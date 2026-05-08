import { Link, Outlet, useLocation } from "react-router-dom";
import { Copy, Shield, Globe } from "lucide-react";
import { cn } from "../../lib/utils";

export default function BaseLayout() {
    const location = useLocation();

    const navLinks = [
        { name: "Home", path: "/home" },
        { name: "Danh sách phòng", path: "/rooms" },
        { name: "Hợp đồng", path: "/contracts" },
        { name: "Dashboard", path: "/dashboard" },
    ];

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
                    <div className="hidden md:flex items-center gap-2 md:gap-8 font-headline tracking-tight">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={cn(
                                        "px-3 py-1 rounded-lg transition-all duration-300",
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
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-white/5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-mono text-xs text-on-surface-variant">
                                0x71C...8B2A
                            </span>
                        </div>
                        <button className="bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-6 py-2.5 rounded-lg font-label text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(168,164,255,0.2)]">
                            Connect Wallet
                        </button>
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
                            © 2024 RentChain. The Ethereal Ledger.
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8">
                        <a href="#" className="hover:text-secondary transition-colors">
                            Etherscan
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
