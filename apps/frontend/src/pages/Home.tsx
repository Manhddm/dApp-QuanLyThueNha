import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] min-h-screen">

            {/* Navbar */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1">Home</Link>
                        <Link to="/rooms" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Danh sách nhà</Link>
                        <Link to="/contracts" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Dashboard</Link>
                    </div>
                    <button className="bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all duration-200">
                        Connect Wallet
                    </button>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-32">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-[#a8a4ff]/10 rounded-full blur-[120px]"></div>
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#aa8ffd]/10 rounded-full blur-[120px]"></div>
                    </div>
                    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative z-10">
                            <h1 className="text-5xl md:text-7xl font-['Space_Grotesk'] font-bold leading-tight tracking-tighter text-[#e9e6f7] mb-6">
                                Thuê nhà minh bạch, <span className="text-[#a8a4ff]">an toàn</span> trên Blockchain
                            </h1>
                            <p className="text-xl text-[#aba9b9] max-w-xl mb-10 leading-relaxed">
                                Kết nối chủ nhà và người thuê qua Smart Contract trên mạng lưới Ethereum. Trải nghiệm tương lai của bất động sản phi tập trung.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/rooms">
                                    <button className="bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,164,255,0.4)] transition-all">
                                        Tìm nhà cho thuê
                                    </button>
                                </Link>
                                <Link to="/rooms">
                                    <button className="bg-transparent border border-[#474754] hover:bg-white/5 text-[#e9e6f7] px-8 py-4 rounded-lg font-bold uppercase tracking-widest transition-all">
                                        Đăng nhà mới
                                    </button>
                                </Link>
                            </div>
                            <div className="mt-12 flex items-center gap-6 border-t border-white/5 pt-8">
                                <div>
                                    <p className="text-2xl font-['Space_Grotesk'] font-bold text-[#e9e6f7]">1.2k+</p>
                                    <p className="text-xs uppercase tracking-widest text-[#aba9b9]">Active Listings</p>
                                </div>
                                <div className="w-px h-10 bg-white/10"></div>
                                <div>
                                    <p className="text-2xl font-['Space_Grotesk'] font-bold text-[#e9e6f7]">500+</p>
                                    <p className="text-xs uppercase tracking-widest text-[#aba9b9]">Smart Contracts</p>
                                </div>
                                <div className="w-px h-10 bg-white/10"></div>
                                <div>
                                    <p className="text-2xl font-['Space_Grotesk'] font-bold text-[#e9e6f7]">0%</p>
                                    <p className="text-xs uppercase tracking-widest text-[#aba9b9]">Fraud Rate</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#a8a4ff] to-[#aa8ffd] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                            <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 aspect-square flex items-center justify-center p-8">
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
                <section className="py-24 bg-[#12121e] relative">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold tracking-tight text-[#e9e6f7] mb-4">
                                Tại sao chọn QuanLyThueNha?
                            </h2>
                            <div className="w-24 h-1 bg-[#a8a4ff] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                                {/* <div className="w-16 h-16 bg-[#a8a4ff]/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#a8a4ff]/20 transition-colors"> */}
                                {/* <span className="material-symbols-outlined text-[#a8a4ff] text-4xl">description</span> */}
                                {/* </div> */}
                                <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 text-[#e9e6f7]">Hợp đồng số</h3>
                                <p className="text-[#aba9b9] leading-relaxed">
                                    Smart contract tự động thực thi điều khoản. Không cần trung gian, không cần tin tưởng mù quáng. Mọi cam kết được mã hóa vĩnh viễn.
                                </p>
                            </div>
                            {/* Feature 2 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                                {/* <div className="w-16 h-16 bg-[#aa8ffd]/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#aa8ffd]/20 transition-colors">
                                    <span className="material-symbols-outlined text-[#aa8ffd] text-4xl">account_balance_wallet</span>
                                </div> */}
                                <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 text-[#e9e6f7]">Thanh toán tự động</h3>
                                <p className="text-[#aba9b9] leading-relaxed">
                                    Nhận và trả tiền bằng ETH một cách an toàn. Hệ thống tự động khấu trừ và chuyển khoản đúng hạn, giảm thiểu rủi ro chậm trễ.
                                </p>
                            </div>
                            {/* Feature 3 */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-2xl group hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2">
                                {/* <div className="w-16 h-16 bg-[#ff9dd0]/10 rounded-xl flex items-center justify-center mb-8 group-hover:bg-[#ff9dd0]/20 transition-colors">
                                    <span className="material-symbols-outlined text-[#ff9dd0] text-4xl">shield</span>
                                </div> */}
                                <h3 className="text-2xl font-['Space_Grotesk'] font-bold mb-4 text-[#e9e6f7]">Đặt cọc an toàn</h3>
                                <p className="text-[#aba9b9] leading-relaxed">
                                    Trustless deposit management. Tiền cọc được giữ bởi Smart Contract và chỉ được hoàn trả khi các điều kiện thanh lý được thỏa mãn.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Section */}
                <section className="py-24 px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 md:row-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl relative overflow-hidden p-8 flex flex-col justify-end min-h-[300px]">
                            <img
                                alt="Modern living"
                                className="absolute inset-0 w-full h-full object-cover opacity-50"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzTRNIV5sGC-OSYmBOOCvF6HtcPb8z71-Xf9czTZQbWBZGO6jIAqqRXMu8dZoHDiVtCEODv9yV4jtI4woWYO6GhxnwTAzExWG-vxLg81MwWbDB-UkYj4Z9HktFkFCCaHefI57GjKzG_tG81FuRBY4EDfT96Al2L-JBKN4ZclNSq_L64l9sxlQmSDTJo4gEkEPTZ0Z-VTfNK1LCmD6KvxDGG-jhWe-r8axFM_Y47gWKkwhBiOuMdljqnB8ROC-hpT-x1JT985Xb-sI"
                            />
                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#a8a4ff]/20 text-[#a8a4ff] text-xs font-bold mb-4">LIVING REVOLUTION</span>
                                <h4 className="text-4xl font-['Space_Grotesk'] font-bold mb-4">Nâng tầm trải nghiệm thuê nhà</h4>
                                <p className="text-[#aba9b9] max-w-md">Khám phá những căn hộ cao cấp nhất được bảo vệ bởi công nghệ tiên tiến nhất thế giới.</p>
                            </div>
                        </div>
                        <div className="md:col-span-2 bg-[#1e1e2d] rounded-2xl p-8 flex items-center gap-8">
                            <div className="flex-1">
                                <h5 className="text-xl font-['Space_Grotesk'] font-bold mb-2">Bảo mật đa tầng</h5>
                                <p className="text-[#aba9b9] text-sm">Xác thực danh tính phi tập trung (DID) đảm bảo quyền riêng tư và an toàn cho người dùng.</p>
                            </div>
                            {/* <div className="w-24 h-24 bg-[#0d0d18] rounded-full flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-[#a8a4ff] text-4xl">security</span>
                            </div> */}
                        </div>
                        <div className="md:col-span-1 bg-gradient-to-br from-[#a8a4ff]/20 to-[#aa8ffd]/20 rounded-2xl p-8 border border-white/5">
                            <h5 className="text-3xl font-['Space_Grotesk'] font-bold mb-2">0.1%</h5>
                            <p className="text-[#aba9b9] text-xs uppercase tracking-widest">Transaction Fee</p>
                        </div>
                        <div className="md:col-span-1 bg-[#242434] rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
                            <p className="text-[#aba9b9] italic text-sm">"QuanLyThueNha đã thay đổi hoàn toàn cách tôi quản lý căn hộ cho thuê của mình."</p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-8 h-8 rounded-full bg-[#a8a4ff]/40"></div>
                                <span className="text-xs font-bold">Nguyen Hieu, Host</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-8">
                    <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-[#675df9] to-[#4e329b] p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }}></div>
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-['Space_Grotesk'] font-bold text-white mb-8 leading-tight">
                                Sẵn sàng để bắt đầu hành trình mới?
                            </h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                <button className="bg-white text-[#0d0d18] px-10 py-5 rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                                    Kết nối ví ngay
                                </button>
                                <button className="bg-[#0d0d18] text-[#e9e6f7] px-10 py-5 rounded-full font-bold uppercase tracking-widest border border-white/10 hover:bg-[#2b2a3c] transition-all">
                                    Xem hướng dẫn
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6 text-sm uppercase tracking-widest">
                    <div className="text-xl font-bold text-[#e9e6f7]">QuanLyThueNha</div>
                    <div className="flex flex-wrap justify-center gap-8 text-[#e9e6f7]/40">
                        <a href="#" className="hover:text-[#aa8ffd] transition-colors">Etherscan</a>
                        <a href="#" className="hover:text-[#aa8ffd] transition-colors">Discord</a>
                        <a href="#" className="hover:text-[#aa8ffd] transition-colors">Twitter</a>
                        <a href="#" className="hover:text-[#aa8ffd] transition-colors">Terms of Service</a>
                    </div>
                    <p className="text-[#e9e6f7]/40">© 2024 QuanLyThueNha.</p>
                </div>
            </footer>
        </div>
    );
}