import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
import { useConnect } from "wagmi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { connect, connectors } = useConnect();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, mat_khau: password })
            });
            const data = await response.json();

            if (data.success) {
                message.success(data.message || "Đăng nhập thành công!");
                if (data.data?.token) {
                    login(data.data.token, data.data.user);
                }
                navigate("/");
            } else {
                message.error(data.message || "Đăng nhập thất bại");
            }
        } catch (error) {
            message.error("Lỗi kết nối đến máy chủ");
        }
    };

    return (
        <div className="bg-surface font-body text-on-surface overflow-hidden min-h-screen">
            {/* Hero Decorative Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-surface"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.15)_0%,transparent_70%)]"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/10 blur-[120px]"></div>
            </div>

            {/* Main Content Canvas */}
            <main className="relative z-10 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Branding Anchor */}
                    <div className="text-center mb-10 block">
                        <Link to="/">
                            <h1 className="font-headline text-4xl font-bold tracking-tighter text-primary">RentChain</h1>
                            <p className="font-label text-xs uppercase tracking-[0.3em] text-on-surface-variant mt-2">The Ethereal Ledger</p>
                        </Link>
                    </div>

                    {/* Login Glass Card */}
                    <div className="bg-white/[0.03] backdrop-blur-md border border-[#a8a4ff]/10 rounded-xl p-8 shadow-2xl">
                        <div className="mb-8">
                            <h2 className="text-2xl font-headline font-semibold text-on-surface">Chào mừng trở lại</h2>
                            <p className="text-on-surface-variant text-sm mt-1">Vui lòng nhập thông tin để tiếp tục</p>
                        </div>
                        <form className="space-y-6" onSubmit={handleLogin}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider ml-1">Email</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"></span>
                                    <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant/40 transition-all outline-none" placeholder="email@example.com" type="email" />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="block font-label text-xs text-on-surface-variant uppercase tracking-wider">Password</label>
                                    <a className="text-[10px] uppercase tracking-widest text-primary hover:text-primary-fixed transition-colors" href="#">Quên mật khẩu?</a>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg"></span>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface focus:ring-1 focus:ring-primary/50 placeholder:text-on-surface-variant/40 transition-all outline-none" placeholder="••••••••" type="password" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-label font-bold text-xs uppercase tracking-widest py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300" type="submit">
                                Đăng nhập
                            </button>
                        </form>

                        {/* Alternative Methods */}
                        <div className="mt-8">
                            <div className="relative flex items-center justify-center mb-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/30"></div></div>
                                <span className="relative bg-surface-container-low px-4 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant leading-none backdrop-blur-md rounded-full shadow-inner">Hoặc kết nối</span>
                            </div>
                            <div className="space-y-3">
                                {/* Web3 Connect */}
                                <button type="button" onClick={() => connect({ connector: connectors[0] })} className="w-full flex items-center justify-between px-5 py-3 rounded-lg border border-outline-variant/20 bg-surface-container-low hover:bg-surface-container transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">account_balance_wallet</span>
                                        <span className="text-sm font-medium">Kết nối ví Web3</span>
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-surface-container border-2 overflow-hidden">
                                            <img alt="Metamask" className="w-4 h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3OMMUk4uoYal0OerDIdgerIv-LgnJx6P4jSrCD8xF5pgluA24XUaKU-UTHcUnuUr9K9qvXGBtP7v4VtPTZnrXY3KiM8lZidee5vBlpNNW6pJsN0mHXQgv-ylDyZY_9t1Vmn-PCMLyISv3o6nF_eT-NJEv7bGHld6hlyBFA_hIRrGBGbD4P5qSuEqTmmfa_b2icccyYF1Wz9scUPogFcbetUIweV8BfGdDkFiBk4O-GRbUgIEc5z-BNCGXUxEIBArVXdrkbqciFLg" />
                                        </div>
                                        <div className="w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center border border-surface-container border-2 overflow-hidden">
                                            <img alt="Coinbase" className="w-4 h-4 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiegRR00Kiviio-p0YFUju8UEUS-8xVzlDhWlZpUQh6yQh2MkjxO-ZH7EeiN8H03gGLfhcAPKgkb6vvI3lvCfevYOuItelZ5lTYjUMeGsAXAtURg7g_r7l00KOMBAqdT3yuBh19oxLUcXiWGoDe2C1dLb2lhCxoda87an6KRLHIDMGZ7JbgGlqHN1wI_lJVMzikwtfYw93uFdAKB33Jrl9wjfnOYlpyvzoJVdhqI9K6lZKHAfRebEm3Wv_mk957gn1FqD3HVwBizU" />
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Footer Link */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-on-surface-variant">
                                Chưa có tài khoản?
                                <Link className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 ml-1" to="/register">Đăng ký ngay</Link>
                            </p>
                        </div>
                    </div>

                    {/* Accessibility/Legal Footer */}
                    <footer className="mt-8 flex justify-center gap-6 opacity-40">
                        <a className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors" href="#">Điều khoản</a>
                        <a className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors" href="#">Bảo mật</a>
                        <a className="text-[10px] uppercase tracking-widest hover:text-on-surface transition-colors" href="#">Hỗ trợ</a>
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
