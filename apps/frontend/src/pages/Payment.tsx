import { Link } from "react-router-dom";

const paymentHistory = [
    { date: "Sep 10, 2024", amount: "0.5 ETH", hash: "0x3f...d21" },
    { date: "Aug 10, 2024", amount: "0.5 ETH", hash: "0x1a...f89" },
    { date: "Jul 10, 2024", amount: "0.5 ETH", hash: "0x8e...c44" },
];

const steps = [
    {
        label: "Chờ xác nhận",
        sub: "Giao dịch đã được khởi tạo",
        status: "done",
    },
    {
        label: "Đang xử lý",
        sub: "Đang gửi yêu cầu lên Blockchain",
        status: "active",
    },
    {
        label: "Hoàn tất",
        sub: "Giao dịch thành công",
        status: "pending",
    },
];

export default function Payment() {
    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] min-h-screen">

            {/* Navbar */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors hover:bg-white/5 px-3 py-1 rounded-lg">Home</Link>
                        <Link to="/rooms" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors hover:bg-white/5 px-3 py-1 rounded-lg">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors hover:bg-white/5 px-3 py-1 rounded-lg">Dashboard</Link>
                    </div>
                    <button className="bg-[#9995ff] text-[#16007d] font-['Space_Grotesk'] font-bold py-2 px-6 rounded-lg active:scale-95 duration-200 transition-all shadow-lg shadow-[#a8a4ff]/20">
                        Connect Wallet
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">

                {/* Page Header */}
                <header className="mb-10">
                    <h1 className="font-['Space_Grotesk'] text-4xl font-bold tracking-tight text-[#e9e6f7] mb-2">
                        Thanh toán tiền thuê
                    </h1>
                    <p className="text-[#aba9b9]">Xác nhận và hoàn tất giao dịch thuê phòng định kỳ trên chuỗi khối.</p>
                </header>

                {/* Active Contract Summary */}
                <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl mb-12">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div>
                            <span className="text-xs font-['Inter'] uppercase tracking-[0.2em] text-[#a8a4ff] mb-2 block">
                                Thông tin hợp đồng hiện tại
                            </span>
                            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-[#e9e6f7]">Căn hộ Skyline #402</h2>
                            <p className="text-[#aba9b9] mt-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                Quận 1, TP. Hồ Chí Minh
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:flex gap-8 md:gap-16">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-[#aba9b9] mb-1">Ngày đến hạn</p>
                                <p className="font-['Space_Grotesk'] text-xl font-medium text-[#e9e6f7]">Oct 10, 2024</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest text-[#aba9b9] mb-1">Số tiền thuê</p>
                                <p className="font-['Space_Grotesk'] text-xl font-bold text-[#a8a4ff]">0.5 ETH</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Panel + History */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Payment Panel */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#12121e] rounded-2xl p-8 border border-white/5 shadow-xl">
                            <h3 className="font-['Space_Grotesk'] text-xl font-bold mb-6">Chi tiết giao dịch</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center p-4 bg-[#242434] rounded-xl">
                                    <span className="text-[#aba9b9] text-sm">Số dư ví</span>
                                    <div className="text-right">
                                        <span className="font-['Space_Grotesk'] font-bold text-[#e9e6f7]">2.34 ETH</span>
                                        <span className="block text-[10px] text-[#aba9b9] uppercase tracking-tighter">0x71C...8e92</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-[#242434] rounded-xl">
                                    <span className="text-[#aba9b9] text-sm">Số tiền cần thanh toán</span>
                                    <span className="font-['Space_Grotesk'] font-bold text-[#a8a4ff] text-lg">0.5 ETH</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black font-['Space_Grotesk'] font-bold text-lg rounded-xl shadow-lg shadow-[#a8a4ff]/20 hover:scale-[1.02] active:scale-95 transition-all mb-8">
                                Thanh toán ngay
                            </button>

                            {/* Transaction Stepper */}
                            <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/5"></div>
                                <div className="space-y-8 relative">
                                    {steps.map((step, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            {step.status === "done" && (
                                                <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] z-10 shrink-0">
                                                    <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                                </div>
                                            )}
                                            {step.status === "active" && (
                                                <div className="w-8 h-8 rounded-full bg-[#a8a4ff] flex items-center justify-center shadow-[0_0_15px_rgba(168,164,255,0.4)] z-10 shrink-0">
                                                    <span className="material-symbols-outlined text-[#1e009f] text-sm animate-pulse">sync</span>
                                                </div>
                                            )}
                                            {step.status === "pending" && (
                                                <div className="w-8 h-8 rounded-full bg-[#242434] border border-white/10 flex items-center justify-center z-10 shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-[#474754]"></div>
                                                </div>
                                            )}
                                            <div>
                                                <p className={`text-sm font-bold ${step.status === "active" ? "text-[#a8a4ff]" : step.status === "pending" ? "text-[#aba9b9]" : "text-[#e9e6f7]"}`}>
                                                    {step.label}
                                                </p>
                                                <p className={`text-xs ${step.status === "pending" ? "text-[#aba9b9]/50" : "text-[#aba9b9]"}`}>
                                                    {step.sub}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History */}
                    <div className="lg:col-span-7">
                        <div className="bg-[#12121e] rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h3 className="font-['Space_Grotesk'] text-xl font-bold">Lịch sử thanh toán</h3>
                                <span className="text-xs text-[#a8a4ff] uppercase tracking-widest bg-[#a8a4ff]/10 px-3 py-1 rounded-full">
                                    3 Giao dịch gần nhất
                                </span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[#1e1e2d]/50 text-xs uppercase tracking-widest text-[#aba9b9]">
                                        <tr>
                                            {["Ngày giao dịch", "Số tiền", "TX Hash", "Trạng thái"].map((h) => (
                                                <th key={h} className="px-6 py-4 font-medium">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {paymentHistory.map((tx, i) => (
                                            <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-6 text-sm text-[#e9e6f7]">{tx.date}</td>
                                                <td className="px-6 py-6 font-['Space_Grotesk'] font-bold text-[#e9e6f7]">{tx.amount}</td>
                                                <td className="px-6 py-6">
                                                    <a href="#" className="font-mono text-xs text-[#aa8ffd] hover:underline flex items-center gap-1">
                                                        {tx.hash}
                                                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                                    </a>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                                        <span className="text-xs font-medium text-[#22C55E]">Completed</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
                    <div className="text-xl font-bold text-[#e9e6f7]">QuanLyThueNha</div>
                    <div className="flex gap-8 text-[#e9e6f7]/40 text-sm uppercase tracking-widest">
                        {["Etherscan", "Discord", "Twitter", "Terms of Service"].map((l) => (
                            <a key={l} href="#" className="hover:text-[#aa8ffd] transition-colors">{l}</a>
                        ))}
                    </div>
                    <div className="text-[#e9e6f7]/40 text-sm uppercase tracking-widest">
                        © 2024 QuanLyThueNha.
                    </div>
                </div>
            </footer>
        </div>
    );
}