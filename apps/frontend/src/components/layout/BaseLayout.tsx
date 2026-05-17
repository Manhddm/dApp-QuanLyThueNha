import { useState, useRef, useEffect, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Copy, Shield, Globe, LogOut, User as UserIcon, Sun, Moon, Bell, UserCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useTheme } from "../../hooks/useTheme";
import { useRentHouse } from "../../hooks/useRentHouse";

export default function BaseLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();
    const { theme, toggleTheme } = useTheme();
    const { myContracts } = useRentHouse();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Notifications Logic
    const notifications = useMemo(() => {
        if (!myContracts || !address) return [];
        const notifs = [];
        const now = Math.floor(Date.now() / 1000);
        
        for (const contract of myContracts) {
            if (Number(contract.status) !== 1) continue; // Only Active contracts
            
            const isTenant = contract.tenant.toLowerCase() === address.toLowerCase();
            const isLandlord = contract.landlord.toLowerCase() === address.toLowerCase();
            const dueDate = Number(contract.nextPaymentDueDate);
            const daysDiff = (dueDate - now) / (60 * 60 * 24);
            const gracePeriodEnd = dueDate + (5 * 24 * 60 * 60);
            
            if (isTenant) {
                if (now > gracePeriodEnd) {
                    notifs.push({ id: contract.id, type: 'danger', message: `Hợp đồng CT-${contract.id} đã quá hạn thanh toán! Chủ nhà có thể chấm dứt hợp đồng và thu cọc.` });
                } else if (now > dueDate) {
                    notifs.push({ id: contract.id, type: 'warning', message: `Hợp đồng CT-${contract.id} đã tới hạn thanh toán. Bạn đang trong thời gian ân hạn 5 ngày.` });
                } else if (daysDiff <= 5 && daysDiff >= 0) {
                    notifs.push({ id: contract.id, type: 'info', message: `Sắp tới hạn thanh toán hợp đồng CT-${contract.id} (còn ${Math.floor(daysDiff)} ngày).` });
                }
            }
            
            if (isLandlord) {
                if (now > gracePeriodEnd) {
                    notifs.push({ id: contract.id, type: 'danger', message: `Khách thuê hợp đồng CT-${contract.id} đã quá hạn 5 ngày. Bạn có quyền chấm dứt và thu cọc.` });
                }
            }
        }
        return notifs;
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
                                                        to="/contracts"
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
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="hidden sm:block bg-surface-container-highest border border-primary/20 text-primary px-4 lg:px-6 py-2.5 rounded-lg font-mono text-xs hover:bg-primary/10 transition-all duration-200 truncate max-w-[200px]"
                            >
                                {user ? `${user.ho_ten} (${address?.slice(0, 4)}...${address?.slice(-4)})` : `${address?.slice(0, 6)}...${address?.slice(-4)}`}
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


