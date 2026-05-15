import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Copy, Shield, Globe, LogOut, User as UserIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export default function BaseLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
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
            <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)] border-b border-white/5">
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
                                            : "text-on-surface/60 hover:text-on-surface hover:bg-white/5"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2 lg:gap-4 shrink-0">
                        <button className="hidden sm:block bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-4 lg:px-6 py-2.5 rounded-lg font-label text-xs lg:text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(168,164,255,0.2)] whitespace-nowrap">
                            Connect Wallet
                        </button>
                        
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
                                    <div className="absolute right-0 mt-2 w-48 bg-surface-container-high backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="font-label text-sm text-on-surface font-semibold truncate">{user.ho_ten}</p>
                                            <p className="text-[10px] uppercase tracking-widest text-primary mt-1">
                                                {user.vai_tro === 'chu_nha' ? 'Chủ nhà' : user.vai_tro === 'nguoi_thue' ? 'Khách thuê' : 'Admin'}
                                            </p>
                                        </div>
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
            <footer className="bg-surface-dim w-full py-12 border-t border-white/5 mt-auto">
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
