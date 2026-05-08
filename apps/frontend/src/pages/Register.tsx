import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, Wallet } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/home");
    };

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary/30 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(108,99,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(170,143,253,0.08)_0%,transparent_40%)] pointer-events-none -z-10 gap-0"></div>

            <main className="w-full max-w-lg mt-12 mb-auto z-10">
                {/* Logo Section */}
                <div className="mb-12 text-center">
                    <h1 className="font-headline font-bold text-4xl tracking-tighter text-primary">
                        RentChain
                    </h1>
                    <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">
                        The Ethereal Ledger
                    </p>
                </div>

                {/* Centralized Minimalist Glass Card */}
                <div className="glass-card rounded-xl p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                    <div className="mb-8">
                        <h2 className="font-headline text-2xl font-medium text-on-surface">Tạo tài khoản mới</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Bắt đầu hành trình bất động sản kỹ thuật số của bạn.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Họ và tên */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                    placeholder="Nguyễn Văn A"
                                    type="text"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                    placeholder="example@rentchain.io"
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Mật khẩu</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary/40 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                <input
                                    className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                    placeholder="••••••••"
                                    type="password"
                                />
                            </div>
                        </div>

                        {/* Checkbox Terms */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="flex items-center h-5">
                                <input
                                    className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/20 transition-all cursor-pointer outline-none"
                                    id="terms"
                                    type="checkbox"
                                />
                            </div>
                            <label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer select-none" htmlFor="terms">
                                Tôi đồng ý với <Link to="#" className="text-primary hover:text-primary-container underline decoration-primary/20 underline-offset-4 transition-colors">Điều khoản & Điều kiện</Link> và chính sách bảo mật của RentChain.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed font-label font-bold py-4 rounded-lg uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(108,99,255,0.2)]"
                            type="submit"
                        >
                            Tạo tài khoản
                        </button>
                    </form>

                    {/* Link Login */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-on-surface-variant">
                            Đã có tài khoản?{" "}
                            <Link to="/login" className="text-primary font-medium hover:underline underline-offset-4 ml-1 transition-all">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Decoration */}
                <div className="mt-12 flex justify-center items-center gap-8 opacity-20">
                    <div className="h-[1px] w-12 bg-primary"></div>
                    <Lock className="w-4 h-4" />
                    <div className="h-[1px] w-12 bg-primary"></div>
                </div>
            </main>

            {/* Footer Identity */}
            <footer className="w-full py-12 mt-auto border-t border-white/5 z-10 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 space-y-4 md:space-y-0">
                    <div className="font-headline font-bold text-primary">
                        RentChain
                    </div>
                    <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60">
                        © 2024 RentChain. The Ethereal Ledger.
                    </div>
                    <div className="flex gap-6">
                        <Link to="#" className="font-label text-xs uppercase tracking-widest text-on-surface-variant/80 hover:text-primary transition-colors">Documentation</Link>
                        <Link to="#" className="font-label text-xs uppercase tracking-widest text-on-surface-variant/80 hover:text-primary transition-colors">Privacy</Link>
                    </div>
                </div>
            </footer>

            {/* Atmosphere Background Texture */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]"></div>
            </div>
        </div>
    );
}
