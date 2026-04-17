import { useState } from "react";
import { Link } from "react-router-dom";
import ConnectWallet from "../components/ConnectWallet";
import { message } from "antd";

const contracts = [
    {
        title: "Căn hộ Skyview #402",
        address: "123 Đường Lê Lợi, Quận 1, TP. HCM",
        wallet: "0x71C...3aE2",
        avatarGradient: "from-blue-500 to-purple-500",
        status: "ACTIVE",
        rent: "0.4 ETH",
        deposit: "0.8 ETH",
        startDate: "15/10/2023",
        duration: "12 Tháng",
    },
    {
        title: "Studio Minimalist A1",
        address: "45 Nguyễn Huệ, Quận 1, TP. HCM",
        wallet: "0x3A2...9F1b",
        avatarGradient: "from-emerald-500 to-cyan-500",
        status: "ACTIVE",
        rent: "0.25 ETH",
        deposit: "0.5 ETH",
        startDate: "01/12/2023",
        duration: "6 Tháng",
    },
];

export default function Contracts() {
    const [activeTab, setActiveTab] = useState("myContracts");

    const handleCloseContract = () => {
        message.loading({ content: 'Đang yêu cầu chữ ký từ MetaMask để kết thúc hợp đồng...', key: 'closeTx' });
        setTimeout(() => {
            message.success({ content: 'Hợp đồng đã kết thúc! Smart Contract đang hoàn cọc.', key: 'closeTx', duration: 3 });
        }, 2000);
    };

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] min-h-screen">

            {/* Navbar */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-lg">Home</Link>
                        <Link to="/rooms" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-lg">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1 px-3 py-1">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] hover:bg-white/5 transition-all duration-300 px-3 py-1 rounded-lg">Dashboard</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectWallet className="px-6 py-2" />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12 min-h-screen">

                {/* Header */}
                <header className="mb-12">
                    <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-tight mb-4 bg-gradient-to-br from-[#e9e6f7] to-[#aba9b9] bg-clip-text text-transparent">
                        Quản lý Hợp đồng
                    </h1>
                    <p className="text-[#aba9b9] max-w-2xl text-lg">
                        Theo dõi các giao dịch thuê phòng và trạng thái pháp lý trên chuỗi khối của bạn một cách minh bạch và an toàn.
                    </p>
                </header>

                {/* Tab Switcher */}
                <div className="flex items-center gap-2 p-1 bg-[#12121e] rounded-xl w-fit mb-10">
                    <button
                        onClick={() => setActiveTab("myContracts")}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === "myContracts"
                            ? "bg-[#1e1e2d] text-[#a8a4ff] shadow-sm"
                            : "text-[#aba9b9] hover:text-[#e9e6f7]"
                            }`}
                    >
                        Hợp đồng của tôi
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-6 py-2.5 rounded-lg font-medium transition-all ${activeTab === "history"
                            ? "bg-[#1e1e2d] text-[#a8a4ff] shadow-sm"
                            : "text-[#aba9b9] hover:text-[#e9e6f7]"
                            }`}
                    >
                        Lịch sử
                    </button>
                </div>

                {/* Contract Grid */}
                {activeTab === "myContracts" && contracts.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {contracts.map((c, i) => (
                            <div
                                key={i}
                                className="group relative bg-[#12121e] rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300 border border-white/5"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-[#a8a4ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="p-8 relative z-10">

                                    {/* Card Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="space-y-1">
                                            <h3 className="font-['Space_Grotesk'] text-2xl font-bold">{c.title}</h3>
                                            <p className="text-[#aba9b9] text-sm flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">location_on</span>
                                                {c.address}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full flex items-center gap-1.5 border border-green-500/20">
                                                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                                {c.status}
                                            </span>
                                            <div className="bg-[#1e1e2d] px-3 py-1 rounded-full flex items-center gap-2">
                                                <span className="font-mono text-[10px] text-[#aba9b9]">{c.wallet}</span>
                                                <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${c.avatarGradient}`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rent & Deposit */}
                                    <div className="grid grid-cols-2 gap-6 mb-8">
                                        <div className="bg-[#181826]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Monthly Rent</p>
                                            <p className="text-xl font-['Space_Grotesk'] font-bold text-[#a8a4ff]">{c.rent}</p>
                                        </div>
                                        <div className="bg-[#181826]/50 p-4 rounded-xl border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest text-[#aba9b9] mb-1">Deposit Locked</p>
                                            <p className="text-xl font-['Space_Grotesk'] font-bold text-[#aa8ffd]">{c.deposit}</p>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="flex flex-col space-y-4 text-sm text-[#aba9b9] border-t border-white/5 pt-6">
                                        <div className="flex justify-between items-center">
                                            <span>Ngày bắt đầu</span>
                                            <span className="text-[#e9e6f7] font-medium">{c.startDate}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Thời hạn hợp đồng</span>
                                            <span className="text-[#e9e6f7] font-medium">{c.duration}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-8 flex items-center gap-4">
                                        <a
                                            href="#"
                                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#242434] hover:bg-[#2b2a3c] transition-colors text-sm font-medium border border-white/5"
                                        >
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            Xem trên Etherscan
                                        </a>
                                        <button onClick={handleCloseContract} className="flex-1 py-3 px-4 rounded-xl border border-[#474754] hover:border-[#ff6e84] hover:text-[#ff6e84] transition-all text-sm font-medium">
                                            Kết thúc hợp đồng
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {(activeTab === "history" || contracts.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-64 h-64 mb-8 relative">
                            <div className="absolute inset-0 bg-[#a8a4ff]/10 blur-[100px] rounded-full"></div>
                            <img
                                alt="Empty illustration"
                                className="relative z-10 opacity-60"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV2J4J37kzzkhGmoGwLe7-bLmnhQJLZEYfcnRkQKAwVEh2DMyBO4wrpn6DxrXpuLe6rFisa3ri_os7yd0abqrthAe4c6f-lxEQ5E-aKrgNUdaDDPDq32cDmTHj6ltLs91wcJUaKQBGo2CBkWwDkKzGcUpaprtItIFG2T7vXia9-ByB_oNMkwibh7IHO1IQFGLE0yNiXq01j5nZU6v08bInFhgqWZPfLOiBSvlXJ_eCdhq1hQcEuh3BSZ9nYsWAv36ywCJri05deb8"
                            />
                        </div>
                        <h2 className="text-3xl font-['Space_Grotesk'] font-bold mb-4">Chưa có hợp đồng nào</h2>
                        <p className="text-[#aba9b9] mb-8 max-w-sm">
                            Bắt đầu thuê phòng hoặc đăng tin cho thuê để khởi tạo hợp đồng thông minh đầu tiên của bạn.
                        </p>
                        <Link to="/rooms">
                            <button className="bg-[#a8a4ff] text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0_0_30px_rgba(168,164,255,0.3)] transition-all">
                                <span className="material-symbols-outlined">explore</span>
                                Khám phá ngay
                            </button>
                        </Link>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6 text-sm uppercase tracking-widest">
                    <div className="text-xl font-bold text-[#e9e6f7]">QuanLyThueNha</div>
                    <div className="text-[#e9e6f7]/40">© 2024 QuanLyThueNha.</div>
                    <div className="flex gap-8">
                        {["Etherscan", "Discord", "Twitter", "Terms of Service"].map((l) => (
                            <a key={l} href="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors">{l}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}