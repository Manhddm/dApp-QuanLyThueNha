import { useState, useRef, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Copy, Shield, Globe, LogOut, User as UserIcon, Sun, Moon, Bell, UserCircle, ArrowRight, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useTheme } from "../../hooks/useTheme";
import { useRentHouse } from "../../hooks/useRentHouse";
import { Modal } from "antd";

export default function BaseLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, token, logout, updateUserContext } = useAuth();
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { theme, toggleTheme } = useTheme();
    const { myContracts } = useRentHouse();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const handleDisconnect = () => {
        Modal.confirm({
            title: 'Xác nhận ngắt kết nối',
            content: 'Bạn có chắc chắn muốn hủy kết nối với ví Blockchain hiện tại không?',
            okText: 'Xác nhận',
            cancelText: 'Hủy bỏ',
            okButtonProps: { className: 'bg-red-500 hover:bg-red-600 text-white border-none' },
            onOk() {
                disconnect();
            }
        });
    };

    // Tự động đồng bộ ví kết nối lên DB trong background
    useEffect(() => {
        if (user && token && isConnected && address && user.dia_chi_vi !== address) {
            const syncWallet = async () => {
                try {
                    const res = await fetch("http://localhost:3000/api/auth/profile", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify({ dia_chi_vi: address })
                    });
                    const data = await res.json();
                    if (data.success) {
                        updateUserContext({ ...user, dia_chi_vi: address });
                        console.log("Automatically synchronized connected wallet to database.");
                    }
                } catch (error) {
                    console.error("Error auto-syncing wallet:", error);
                }
            };
            syncWallet();
        }
    }, [user, token, isConnected, address]);

    // Notifications Logic
    const notifications = useMemo(() => {
        if (!myContracts || !address) return [];
        const notifs = [];
        const now = Math.floor(Date.now() / 1000);
        
        for (const contract of myContracts) {
            const status = Number(contract.status);
            const isTenant = contract.tenant.toLowerCase() === address.toLowerCase();
            const isLandlord = contract.landlord.toLowerCase() === address.toLowerCase();
            
            // Thông báo có người thuê phòng (cho Chủ nhà)
            if (status === 0 && isLandlord) {
                notifs.push({ 
                    id: contract.id, 
                    type: 'primary', 
                    message: `Bạn có 1 yêu cầu thuê mới cho Phòng #${Number(contract.roomId)}. Bấm vào đây để xem chi tiết và duyệt!`,
                    link: `/manage-room/${Number(contract.roomId)}`
                });
            }

            if (status !== 1) continue; // Only Active contracts for payment logic

            const dueDate = Number(contract.nextPaymentDueDate);
            const gracePeriodEnd = dueDate + 15; // Đồng bộ 15 giây cho DEMO
            
            if (isTenant) {
                if (now > gracePeriodEnd) {
                    notifs.push({ 
                        id: contract.id, 
                        type: 'danger', 
                        message: `Hợp đồng CT-${contract.id} đã quá hạn thanh toán! Chủ nhà có thể chấm dứt hợp đồng và thu cọc. Nhấn để thanh toán ngay!`,
                        link: `/contracts`
                    });
                } else if (now > dueDate) {
                    notifs.push({ 
                        id: contract.id, 
                        type: 'warning', 
                        message: `Hợp đồng CT-${contract.id} đã tới hạn thanh toán. Vui lòng thanh toán tránh bị phạt cọc. Nhấn để xem ngay!`,
                        link: `/contracts`
                    });
                }
            }
            
            if (isLandlord) {
                if (now > gracePeriodEnd) {
                    notifs.push({ 
                        id: contract.id, 
                        type: 'danger', 
                        message: `Khách thuê hợp đồng CT-${contract.id} đã quá hạn 15 giây. Bạn có quyền chấm dứt và thu cọc. Nhấn để giải quyết!`,
                        link: `/contracts`
                    });
                }
            }
        }
        return notifs;
    }, [myContracts, address]);

    // Check if the current tenant has any active contracts that are past due
    const hasOverdueContracts = useMemo(() => {
        if (!myContracts || !address) return false;
        const now = Math.floor(Date.now() / 1000);
        return myContracts.some((contract: any) => {
            const status = Number(contract.status);
            const isTenant = contract.tenant.toLowerCase() === address.toLowerCase();
            if (status !== 1 || !isTenant) return false;
            const dueDate = Number(contract.nextPaymentDueDate);
            return now > dueDate;
        });
    }, [myContracts, address]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { name: "Home", path: "/home", roles: ["all"] },
        { name: "Danh sách phòng", path: "/rooms", roles: ["all"] },
        { name: "Hợp đồng", path: "/contracts", roles: ["all"] },
        { name: "Dashboard", path: "/dashboard", roles: ["chu_nha", "admin"] },
    ];

    const filteredNavLinks = navLinks.filter(link => {
        if (link.roles.includes("all")) return true;
        if (user && link.roles.includes(user.vai_tro)) return true;
        return false;
    });

    return (
        <div className="min-h-screen flex flex-col font-body">
            {/* TopNavBar */}
            <nav className="bg-surface/90 backdrop-blur-xl sticky top-0 z-50 shadow-sm shadow-black/5 border-b border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center w-full px-6 md:px-8 py-4 max-w-7xl mx-auto">
                    <Link
                        to="/home"
                        className="text-2xl font-bold text-on-surface tracking-tighter font-headline"
                    >
                        RentChain
                    </Link>
                    <div className="hidden md:flex items-center gap-2 lg:gap-6 font-headline tracking-tight">
                        {filteredNavLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={cn(
                                        "px-2 lg:px-3 py-1 rounded-lg transition-all duration-300 whitespace-nowrap",
                                        isActive
                                            ? "text-primary border-b-2 border-primary rounded-b-none pb-1"
                                            : "text-on-surface/60 hover:text-on-surface hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <button 
                            onClick={toggleTheme}
                            className="w-10 h-10 rounded-full bg-surface-container-highest border border-black/5 dark:border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        
                        {/* Notification Bell */}
                        {user && (
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                                    className="relative w-10 h-10 rounded-full bg-surface-container-highest border border-black/5 dark:border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all"
                                >
                                    <Bell size={18} />
                                    {notifications.length > 0 && (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                                    )}
                                </button>

                                {isNotifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-surface-container-high backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl py-2 z-50 max-h-[400px] overflow-y-auto">
                                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                                            <p className="font-label text-sm text-on-surface font-semibold">Thông báo</p>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-on-surface-variant text-sm">
                                                Không có thông báo nào.
                                            </div>
                                        ) : (
                                            <div className="flex flex-col">
                                                {notifications.map((n, i) => (
                                                    <Link 
                                                        key={i} 
                                                        to={n.link || "/contracts"}
                                                        onClick={() => setIsNotifOpen(false)}
                                                        className={cn(
                                                            "px-4 py-3 border-b border-black/5 dark:border-white/5 last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm",
                                                            n.type === 'danger' ? "text-red-500" : n.type === 'warning' ? "text-orange-500" : "text-primary"
                                                        )}
                                                    >
                                                        {n.message}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {isConnected ? (
                            <button 
                                onClick={handleDisconnect}
                                className="hidden sm:block bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 lg:px-6 py-2.5 rounded-lg font-label text-xs lg:text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap"
                            >
                                Hủy kết nối ví
                            </button>
                        ) : (
                            <button 
                                onClick={() => connect({ connector: connectors[0] })}
                                className="hidden sm:block bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-4 lg:px-6 py-2.5 rounded-lg font-label text-xs lg:text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(168,164,255,0.2)] whitespace-nowrap"
                            >
                                Connect Wallet
                            </button>
                        )}
                        
                        {user && (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-surface-container-highest border-2 border-primary/20 flex items-center justify-center text-primary hover:border-primary transition-all overflow-hidden"
                                >
                                    {user.anh_dai_dien ? (
                                        <img src={user.anh_dai_dien} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon size={20} />
                                    )}
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-surface-container-high backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-xl shadow-2xl py-2 z-50">
                                        <div className="px-4 py-3 border-b border-black/5 dark:border-white/5">
                                            <p className="font-label text-sm text-on-surface font-semibold truncate">{user.ho_ten}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-primary mt-1">
                                                {user.vai_tro === 'chu_nha' ? 'Chủ nhà' : user.vai_tro === 'nguoi_thue' ? 'Khách thuê' : 'Admin'}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                setIsDropdownOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm text-on-surface hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <UserCircle size={16} />
                                            <span>Hồ sơ cá nhân</span>
                                        </button>
                                        <button 
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                                navigate('/login');
                                            }}
                                            className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm text-on-surface hover:bg-error/10 hover:text-error transition-colors rounded-b-xl"
                                        >
                                            <LogOut size={16} />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Overdue Payment Alert Banner for Tenants */}
            {hasOverdueContracts && (
                <div 
                    onClick={() => navigate('/contracts')}
                    className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-3.5 px-6 text-center text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(239,68,68,0.2)] animate-pulse shrink-0"
                >
                    <AlertTriangle size={18} className="animate-bounce shrink-0" />
                    <span>Bạn có hợp đồng thuê nhà đã đến hạn hoặc quá hạn thanh toán tiền phòng! Nhấp vào đây để thanh toán ngay tránh bị phạt cọc.</span>
                    <ArrowRight size={16} className="ml-1 shrink-0" />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-grow flex flex-col w-full">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-surface-dim w-full py-12 border-t border-black/5 dark:border-white/5 mt-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6 font-label text-sm uppercase tracking-widest text-on-surface/40">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-xl font-bold text-on-surface mb-2 font-headline tracking-tighter normal-case">
                            RentChain
                        </div>
                        <p className="text-xs">
                            © 2024 RentChain. The Oasis Ledger.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="#" className="hover:text-secondary transition-colors">
                            Oasis Scan
                        </a>
                        <a href="#" className="hover:text-secondary transition-colors">
                            Discord
                        </a>
                        <a href="#" className="hover:text-secondary transition-colors">
                            Twitter
                        </a>
                        <a href="#" className="hover:text-secondary transition-colors">
                            Terms of Service
                        </a>
                    </div>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary/80 hover:text-on-surface transition-all cursor-pointer">
                            <Shield size={16} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary/80 hover:text-on-surface transition-all cursor-pointer">
                            <Globe size={16} />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}


