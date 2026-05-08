import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Wallet } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/home");
    };

    return (
        <div className="bg-surface font-body text-on-surface overflow-hidden min-h-screen">
            {/* Hero Decorative Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-surface"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.15)_0%,transparent_70%)]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]"></div>
            </div>

            {/* Main Content Canvas */}
            <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Branding Anchor */}
                    <div className="text-center mb-10">
                        <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary">RentChain</h1>
                        <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant mt-2">The Ethereal Ledger</p>
                    </div>

                    {/* Login Glass Card */}
                    <div className="glass-card rounded-xl p-8 shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-headline font-semibold text-on-surface">Chào mừng trở lại</h2>
                            <p className="text-on-surface-variant text-sm mt-1">Vui lòng nhập thông tin để tiếp tục</p>
                        </div>

                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="space-y-2 group">
                                <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider ml-1">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant/40 transition-all outline-none"
                                        placeholder="email@example.com"
                                        type="email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider">Password</label>
                                    <Link to="#" className="text-[10px] uppercase tracking-widest text-primary hover:text-primary-fixed transition-colors">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <input
                                        className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant/40 transition-all outline-none"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed font-label font-bold text-xs uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                type="submit"
                            >
                                Đăng nhập
                            </button>
                        </form>



                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-on-surface-variant">
                                Chưa có tài khoản?{" "}
                                <Link to="/register" className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Accessibility/Legal Footer */}
                    <footer className="mt-8 flex justify-center gap-6 opacity-40">
                        <Link to="#" className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors">Điều khoản</Link>
                        <Link to="#" className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors">Bảo mật</Link>
                        <Link to="#" className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors">Hỗ trợ</Link>
                    </footer>
                </div>
            </main>

            {/* Background Decoration Image */}
            <div className="fixed bottom-0 right-0 w-1/3 h-1/2 opacity-20 pointer-events-none z-0">
                <img alt="abstract blockchain" className="w-full h-full object-cover mix-blend-overlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCql6IuL8woexcVJNRPuVRRBTJXAoCS8zVgMOoOb_ogzwrhNLfQO9vNzctR28I50HqDYY3JNN4C-OJb8bST0UApyeFMgw7eLsXq1Pd6UkBx9gqeifcX9_LgQuV_Itd1MJrC9unoUA4a6e1uwToA5IGGbPqvJdGK5ZrnBEbqQ99DBRuTxp7KSSohVxlXtXNYuDJPCyXacEwQ8-ytvEVrIuNGbQaTgjZmsUfIZuFgdhyZKgWIMSJBZ4bDXDRC2B5L_fyrHGgwOxBGoEg" />
            </div>
        </div>
    );
}
