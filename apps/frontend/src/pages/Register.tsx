import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck, UserSearch, Home as HomeIcon, CheckCircle2 } from "lucide-react";
import { message } from "antd";

export default function Register() {
    const navigate = useNavigate();

    const [ho_ten, setHoTen] = useState("");
    const [email, setEmail] = useState("");
    const [mat_khau, setMatKhau] = useState("");
    const [confirm_mat_khau, setConfirmMatKhau] = useState("");
    const [vai_tro_ui, setVaiTroUi] = useState("tenant"); // "tenant" or "landlord"
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mat_khau !== confirm_mat_khau) {
            message.error("Mật khẩu xác nhận không khớp!");
            return;
        }

        setLoading(true);

        // Map UI role to backend role
        const vai_tro = vai_tro_ui === "tenant" ? "nguoi_thue" : "chu_nha";

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ho_ten,
                    email,
                    mat_khau,
                    vai_tro,
                    // so_dien_thoai and dia_chi_vi can be added later if needed
                }),
            });

            const data = await response.json();

            if (data.success) {
                message.success("Đăng ký thành công! Vui lòng đăng nhập.");
                navigate("/login");
            } else {
                message.error(data.message || "Đăng ký thất bại");
            }
        } catch (error) {
            console.error("Register error:", error);
            message.error("Lỗi kết nối đến máy chủ");
        } finally {
            setLoading(false);
        }
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
                        The Oasis Ledger
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
                                    value={ho_ten}
                                    onChange={(e) => setHoTen(e.target.value)}
                                    required
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                    value={mat_khau}
                                    onChange={(e) => setMatKhau(e.target.value)}
                                    required
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
                                    value={confirm_mat_khau}
                                    onChange={(e) => setConfirmMatKhau(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div className="space-y-3">
                            <label className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant ml-1">Bạn là:</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="relative flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 cursor-pointer hover:bg-primary/5 transition-all group">
                                    <input 
                                        checked={vai_tro_ui === "tenant"} 
                                        onChange={() => setVaiTroUi("tenant")} 
                                        className="sr-only peer" 
                                        name="role" 
                                        type="radio" 
                                        value="tenant" 
                                    />
                                    <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary/50 transition-all"></div>
                                    <UserSearch className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors peer-checked:text-primary" />
                                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors peer-checked:text-on-surface">Khách thuê</span>
                                    <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <CheckCircle2 className="text-primary w-4 h-4" />
                                    </div>
                                </label>

                                <label className="relative flex flex-col items-center gap-3 p-4 rounded-xl bg-surface-container-highest/50 border border-outline-variant/30 cursor-pointer hover:bg-primary/5 transition-all group">
                                    <input 
                                        checked={vai_tro_ui === "landlord"} 
                                        onChange={() => setVaiTroUi("landlord")} 
                                        className="sr-only peer" 
                                        name="role" 
                                        type="radio" 
                                        value="landlord" 
                                    />
                                    <div className="absolute inset-0 rounded-xl border-2 border-transparent peer-checked:border-primary/50 transition-all"></div>
                                    <HomeIcon className="w-8 h-8 text-primary/40 group-hover:text-primary transition-colors peer-checked:text-primary" />
                                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors peer-checked:text-on-surface">Chủ nhà</span>
                                    <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 transition-opacity">
                                        <CheckCircle2 className="text-primary w-4 h-4" />
                                    </div>
                                </label>
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
                            className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed font-label font-bold py-4 rounded-lg uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_20px_rgba(108,99,255,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Tạo tài khoản"}
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
            <footer className="w-full py-12 mt-auto border-t border-black/5 dark:border-white/5 z-10 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 space-y-4 md:space-y-0">
                    <div className="font-headline font-bold text-primary">
                        RentChain
                    </div>
                    <div className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60">
                        © 2024 RentChain. The Oasis Ledger.
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


