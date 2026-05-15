import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/10 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-secondary/10 rounded-full blur-[120px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative z-10">
                        <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight tracking-tighter text-on-background mb-6">
                            Thuê nhà minh bạch, <br className="hidden md:block" /> <span className="text-primary">an toàn</span> trên Blockchain
                        </h1>
                        <p className="text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                            Kết nối chủ nhà và người thuê qua Smart Contract trên mạng lưới
                            Oasis. Trải nghiệm tương lai của bất động sản phi tập trung.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/rooms"
                                className="bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,164,255,0.4)] transition-all"
                            >
                                Tìm phòng trọ
                            </Link>
                            <Link
                                to="/dashboard"
                                className="bg-transparent border border-outline-variant hover:bg-white/5 text-on-surface px-8 py-4 rounded-lg font-label font-bold uppercase tracking-widest transition-all"
                            >
                                Đăng phòng
                            </Link>
                        </div>
                        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/5 pt-8">
                            <div>
                                <p className="text-2xl font-headline font-bold text-on-surface">
                                    1.2k+
                                </p>
                                <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">
                                    Active Listings
                                </p>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                            <div>
                                <p className="text-2xl font-headline font-bold text-on-surface">
                                    500+
                                </p>
                                <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">
                                    Smart Contracts
                                </p>
                            </div>
                            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
                            <div>
                                <p className="text-2xl font-headline font-bold text-on-surface">
                                    0%
                                </p>
                                <p className="text-xs uppercase tracking-widest text-on-surface-variant mt-1">
                                    Fraud Rate
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="relative group mt-10 lg:mt-0">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        <div className="relative rounded-2xl overflow-hidden glass-card aspect-square flex items-center justify-center p-8">
                            <img
                                alt="Blockchain Real Estate"
                                className="w-full h-full object-cover rounded-xl shadow-2xl"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb-rZhVnjVR9txknffog-F7cv9xK1yISAz80XHmhEo067Nvdh4qDeqBBytOls3esbxytr4s-HrCjTUf1fpC0_ouXmKgoHzBOZE-kU82RX2ncHfWnWdVlp5kaQblVfytj_pVTWsj2FoWPldow2s3Y0E5qS0S_Mg8IQM1K1_I0iiRRB9HOCqGWtPU1y6jcDtHPuVLnjD2H5jAn6-B4PsDQ2SnFjEfuNlKuEFnHx_wJN2GM_HKt_1-F_sqOofxPd82AbTcmnqtHJV9Gc"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-surface-container-low relative border-y border-white/5">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background mb-4">
                            Tại sao chọn RentChain?
                        </h2>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full mt-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="glass-card p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 text-on-background">
                                Hợp đồng số
                            </h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Smart contract tự động thực thi điều khoản. Không cần trung
                                gian, không cần tin tưởng mù quáng. Mọi cam kết được mã hóa vĩnh
                                viễn.
                            </p>
                        </div>
                        <div className="glass-card p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-secondary/20 transition-colors">
                                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 text-on-background">
                                Thanh toán tự động
                            </h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Nhận và trả tiền bằng OASIS một cách an toàn. Hệ thống tự động
                                khấu trừ và chuyển khoản đúng hạn, giảm thiểu rủi ro chậm trễ.
                            </p>
                        </div>
                        <div className="glass-card p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                            <div className="w-16 h-16 bg-tertiary-container/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-tertiary-container/20 transition-colors">
                                <svg className="w-8 h-8 text-tertiary-container" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-headline font-bold mb-4 text-on-background">
                                Đặt cọc an toàn
                            </h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Trustless deposit management. Tiền cọc được giữ bởi Smart
                                Contract và chỉ được hoàn trả khi các điều kiện thanh lý được
                                thỏa mãn.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Bento Grid Section */}
            <section className="py-24 px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-none md:grid-rows-2 gap-6 h-auto md:h-[600px]">
                    <div className="md:col-span-2 md:row-span-2 glass-card rounded-2xl relative overflow-hidden p-8 flex flex-col justify-end min-h-[300px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent z-10 w-full h-full"></div>
                        <img
                            alt="Modern living"
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzTRNIV5sGC-OSYmBOOCvF6HtcPb8z71-Xf9czTZQbWBZGO6jIAqqRXMu8dZoHDiVtCEODv9yV4jtI4woWYO6GhxnwTAzExWG-vxLg81MwWbDB-UkYj4Z9HktFkFCCaHefI57GjKzG_tG81FuRBY4EDfT96Al2L-JBKN4ZclNSq_L64l9sxlQmSDTJo4gEkEPTZ0Z-VTfNK1LCmD6KvxDGG-jhWe-r8axFM_Y47gWKkwhBiOuMdljqnB8ROC-hpT-x1JT985Xb-sI"
                        />
                        <div className="relative z-20">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold mb-4">
                                LIVING REVOLUTION
                            </span>
                            <h4 className="text-3xl md:text-4xl font-headline font-bold mb-4 shadow-sm text-balance">
                                Nâng tầm trải nghiệm thuê nhà
                            </h4>
                            <p className="text-on-surface/90 max-w-md">
                                Khám phá những căn hộ cao cấp nhất được bảo vệ bởi công nghệ
                                tiên tiến nhất thế giới.
                            </p>
                        </div>
                    </div>
                    <div className="md:col-span-2 bg-surface-container-high rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-white/5">
                        <div className="flex-1">
                            <h5 className="text-xl font-headline font-bold mb-3">
                                Bảo mật đa tầng
                            </h5>
                            <p className="text-on-surface-variant text-sm leading-relaxed">
                                Xác thực danh tính phi tập trung (DID) đảm bảo quyền riêng tư và
                                an toàn cho người dùng.
                            </p>
                        </div>
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-surface shrink-0 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                            </svg>
                        </div>
                    </div>
                    <div className="md:col-span-1 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 border border-white/5 flex flex-col justify-center items-center text-center">
                        <h5 className="text-4xl lg:text-5xl font-headline font-bold mb-3 text-secondary-fixed">0.1%</h5>
                        <p className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
                            Transaction Fee
                        </p>
                    </div>
                    <div className="md:col-span-1 bg-surface-container-highest rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
                        <p className="text-on-surface-variant italic text-sm leading-relaxed relative">
                            <span className="text-3xl text-primary/30 absolute -top-4 -left-2 font-serif">"</span>
                            RentChain đã thay đổi hoàn toàn cách tôi quản lý căn hộ cho thuê của mình.
                        </p>
                        <div className="flex items-center gap-3 mt-6">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                                <div className="w-full h-full bg-surface rounded-full flex items-center justify-center text-xs font-bold text-primary">QT</div>
                            </div>
                            <span className="text-xs font-bold text-on-surface">Quang Tran, Host</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-8 pb-32">
                <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-primary-dim to-secondary-container p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-20 transition-transform duration-1000 hover:scale-110"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                            backgroundSize: "40px 40px",
                        }}
                    ></div>
                    {/* Glow effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-3xl rounded-full"></div>
                    <div className="relative z-10 space-y-10">
                        <h2 className="text-4xl md:text-6xl font-headline font-bold text-white mb-2 leading-tight">
                            Sẵn sàng để bắt đầu <br className="hidden md:block" /> hành trình mới?
                        </h2>
                        <div className="flex flex-wrap justify-center gap-6 pt-4">
                            <button className="bg-white text-on-primary-fixed px-10 py-4.5 rounded-xl font-label font-bold uppercase tracking-widest hover:scale-105 hover:bg-gray-50 transition-all shadow-xl shadow-black/20 flex items-center gap-2">
                                Kết nối ví ngay <MoveRight size={18} />
                            </button>
                            <button className="bg-black/20 backdrop-blur-md text-white px-10 py-4.5 rounded-xl font-label font-bold uppercase tracking-widest border border-white/20 hover:bg-black/30 transition-all flex items-center gap-2">
                                Xem hướng dẫn
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
