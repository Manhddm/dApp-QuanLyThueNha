import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { message } from "antd";
import { useConnect, useAccount } from "wagmi";

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { connect, connectors } = useConnect();
    const { address, isConnected } = useAccount();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    ho_ten: fullName, 
                    email, 
                    mat_khau: password,
                    dia_chi_vi: address // Send the wallet address if connected
                })
            });
            const data = await response.json();

            if (data.success) {
                message.success(data.message || "Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login");
            } else {
                message.error(data.message || "Đăng ký thất bại");
            }
        } catch (error) {
            message.error("Lỗi kết nối đến máy chủ");
        }
    };

    return (
        <div className="bg-[#0d0d18] font-body text-on-surface min-h-screen flex flex-col items-center justify-center p-6 selection:bg-primary/30 relative overflow-hidden z-0">
            {/* Atmosphere Background Texture */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_20%_30%,rgba(108,99,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_80%_70%,rgba(170,143,253,0.08)_0%,transparent_40%)]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[120px]"></div>
            </div>

            <main className="w-full max-w-lg mb-auto mt-12 relative z-10">
                {/* Logo Section */}
                <div className="mb-12 text-center block">
                    <Link to="/">
                        <h1 className="font-headline font-bold text-4xl tracking-tighter text-primary">
                            RentChain
                        </h1>
                        <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-2">
                            The Ethereal Ledger
                        </p>
                    </Link>
                </div>

                {/* Centralized Minimalist Glass Card */}
                <div className="bg-white/[0.03] backdrop-blur-md border border-[#a8a4ff]/10 rounded-xl p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                    <div className="mb-8">
                        <h2 className="font-headline text-2xl font-medium text-on-surface">Tạo tài khoản mới</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Bắt đầu hành trình bất động sản kỹ thuật số của bạn.</p>
                        {isConnected && (
                            <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                                <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
                                <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                                    Đã liên kết: {address?.slice(0, 6)}...{address?.slice(-4)}
                                </span>
                            </div>
                        )}
                    </div>

                    <form className="space-y-5" onSubmit={handleRegister}>
                        {/* Họ và tên */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Họ và tên</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg group-focus-within:text-primary transition-colors"></span>
                                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="Nguyễn Văn A" type="text" />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Email</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg group-focus-within:text-primary transition-colors"></span>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="example@rentchain.io" type="email" />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Mật khẩu</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg group-focus-within:text-primary transition-colors"></span>
                                <input value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="••••••••" type="password" />
                            </div>
                        </div>

                        {/* Xác nhận mật khẩu */}
                        <div className="group">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1.5 ml-1">Xác nhận mật khẩu</label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg group-focus-within:text-primary transition-colors"></span>
                                <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full bg-surface-container-highest border-none rounded-lg py-3.5 pl-11 pr-4 text-on-surface placeholder:text-outline/40 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="••••••••" type="password" />
                            </div>
                        </div>

                        {/* Checkbox Terms */}
                        <div className="flex items-start gap-3 py-2">
                            <div className="flex items-center h-5">
                                <input className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary/20 transition-all cursor-pointer" id="terms" type="checkbox" />
                            </div>
                            <label className="text-xs text-on-surface-variant leading-relaxed cursor-pointer select-none" htmlFor="terms">
                                Tôi đồng ý với <a className="text-primary hover:text-primary-container underline decoration-primary/20 underline-offset-4 transition-colors" href="#">Điều khoản &amp; Điều kiện</a> và chính sách bảo mật của RentChain.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed font-label font-bold py-4 rounded-lg uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(108,99,255,0.2)]" type="submit">
                            Tạo tài khoản
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-[1px] bg-outline-variant/30"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                            <span className="bg-surface-container-low px-3 rounded-full text-outline shadow-inner backdrop-blur-md">Hoặc</span>
                        </div>
                    </div>

                    {/* Web3 Auth */}
                    <button type="button" onClick={() => connect({ connector: connectors[0] })} className="w-full flex items-center justify-center gap-3 border border-outline-variant/20 py-3.5 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors group">
                        <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">account_balance_wallet</span>
                        Đăng ký bằng ví Web3
                    </button>

                    {/* Link Login */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-on-surface-variant">
                            Đã có tài khoản?
                            <Link className="text-primary font-medium hover:underline underline-offset-4 ml-1 transition-all" to="/login">Đăng nhập</Link>
                        </p>
                    </div>
                </div>

                {/* Footer Decoration */}
                <div className="mt-12 flex justify-center items-center gap-8 opacity-20">
                    <div className="h-[1px] w-12 bg-primary"></div>
                    <span className="material-symbols-outlined text-sm">lock_person</span>
                    <div className="h-[1px] w-12 bg-primary"></div>
                </div>
            </main>

            {/* Footer Identity from JSON Mapping */}
            <footer className="w-full py-12 mt-auto border-t border-white/10 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto space-y-4 md:space-y-0">
                    <div className="font-['Space_Grotesk'] font-bold text-[#a8a4ff]">
                        RentChain
                    </div>
                    <div className="font-['Inter'] text-xs uppercase tracking-widest text-[#aba9b9]">
                        © 2024 RentChain. The Ethereal Ledger.
                    </div>
                    <div className="flex gap-6">
                        <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#aba9b9] hover:text-[#a8a4ff] transition-colors" href="#">Documentation</a>
                        <a className="font-['Inter'] text-xs uppercase tracking-widest text-[#aba9b9] hover:text-[#a8a4ff] transition-colors" href="#">Privacy</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
