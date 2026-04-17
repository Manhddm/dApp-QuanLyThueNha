import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ConnectWallet from "../components/ConnectWallet";

export default function Profile() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="bg-[#0d0d18] text-white min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="bg-[#0d0d18] text-white min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-['Space_Grotesk'] font-bold mb-4">Bạn chưa đăng nhập</h1>
                <Link to="/login">
                    <button className="bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black px-6 py-3 rounded-lg font-bold uppercase tracking-wider">
                        Trở về đăng nhập
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] min-h-screen flex flex-col relative overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#a8a4ff]/5 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff9dd0]/5 blur-[120px]"></div>
            </div>

            {/* Navbar */}
            <header className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        <Link to="/">RentChain</Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Home</Link>
                        <Link to="/rooms" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Dashboard</Link>
                        <Link to="/profile" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1">Hồ sơ</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectWallet />
                    </div>
                </nav>
            </header>

            <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-16 relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-[#e9e6f7] mb-2">Hồ sơ của bạn</h1>
                    <p className="text-[#aba9b9]">Quản lý thông tin cá nhân và cài đặt bảo mật cho tài khoản.</p>
                </div>

                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Decorative Card Accent */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#a8a4ff]/20 to-transparent rounded-bl-full pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#a8a4ff] to-[#675df9] p-1 shadow-[0_0_30px_rgba(168,164,255,0.4)]">
                                <div className="w-full h-full rounded-full bg-[#12121e] flex items-center justify-center overflow-hidden border-4 border-[#0d0d18]">
                                    <span className="text-[#a8a4ff] text-5xl font-['Space_Grotesk'] font-bold uppercase">
                                        {user.ho_ten.charAt(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                {user.da_xac_thuc ? "Đã KYC" : "Chưa KYC"}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-[#0d0d18]/50 p-4 rounded-xl border border-white/5">
                                    <label className="block text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Mã tài khoản (ID)</label>
                                    <div className="font-mono text-lg text-[#e9e6f7]">#{user.ma_nguoi_dung}</div>
                                </div>
                                <div className="bg-[#0d0d18]/50 p-4 rounded-xl border border-white/5">
                                    <label className="block text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Vai trò</label>
                                    <div className="font-medium text-lg text-[#a8a4ff] capitalize">{user.vai_tro.replace('_', ' ')}</div>
                                </div>
                                <div className="bg-[#0d0d18]/50 p-4 rounded-xl border border-white/5 md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Họ và Tên</label>
                                    <div className="font-['Space_Grotesk'] text-2xl font-bold text-[#e9e6f7]">{user.ho_ten}</div>
                                </div>
                                <div className="bg-[#0d0d18]/50 p-4 rounded-xl border border-white/5 md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Email</label>
                                    <div className="text-lg text-[#e9e6f7]">{user.email}</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap gap-4 pt-4 mt-6 border-t border-white/10">
                                <button className="bg-transparent border border-[#a8a4ff]/30 text-[#a8a4ff] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#a8a4ff]/10 hover:border-[#a8a4ff] transition-all flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                    Chỉnh sửa thông tin
                                </button>
                                <button 
                                    onClick={handleLogout}
                                    className="bg-transparent border border-[#ff6e84]/30 text-[#ff6e84] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#ff6e84]/10 hover:border-[#ff6e84] transition-all flex items-center gap-2 md:ms-auto"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Đăng xuất toàn bộ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 mt-auto">
                <div className="flex flex-col md:flex-row justify-center items-center px-8 max-w-7xl mx-auto gap-2">
                    <div className="text-xl font-bold text-[#e9e6f7] font-['Space_Grotesk']">RentChain</div>
                    <p className="text-xs uppercase tracking-widest text-[#e9e6f7]/40">© 2024 The Ethereal Ledger.</p>
                </div>
            </footer>
        </div>
    );
}
