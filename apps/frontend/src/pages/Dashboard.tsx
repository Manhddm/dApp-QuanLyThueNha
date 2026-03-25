import { Link } from "react-router-dom";
import { useState } from "react";
import { useRooms } from "../hooks/useRooms";

const stats = [
    {
        icon: "home_work",
        iconColor: "text-[#a8a4ff]",
        iconBg: "bg-[#a8a4ff]/10",
        badge: "+2 tháng này",
        badgeColor: "text-green-400 bg-green-400/10",
        label: "Tổng phòng",
        value: "12",
    },
    {
        icon: "person_pin",
        iconColor: "text-[#aa8ffd]",
        iconBg: "bg-[#aa8ffd]/10",
        badge: "66% tỉ lệ lấp đầy",
        badgeColor: "text-[#aba9b9]",
        label: "Phòng đang thuê",
        value: "8",
    },
    {
        icon: "payments",
        iconColor: "text-[#ff9dd0]",
        iconBg: "bg-[#ff9dd0]/10",
        badge: "Mạng Ethereum",
        badgeColor: "text-[#a8a4ff] bg-[#a8a4ff]/10",
        label: "Thu nhập tháng này",
        value: "4.2 ETH",
    },
    {
        icon: "lock",
        iconColor: "text-[#e9e6f7]",
        iconBg: "bg-[#757482]/10",
        badge: "Trong Smart Contract",
        badgeColor: "text-[#aba9b9]",
        label: "Tiền cọc đang giữ",
        value: "8.5 ETH",
    },
];

const activities = [
    {
        icon: "check_circle",
        iconColor: "text-green-500",
        iconBg: "bg-green-500/10",
        title: "Thanh toán phòng 302",
        sub: "0.45 ETH - 2 giờ trước",
    },
    {
        icon: "history_edu",
        iconColor: "text-[#a8a4ff]",
        iconBg: "bg-[#a8a4ff]/10",
        title: "Hợp đồng mới - Phòng 105",
        sub: "Đã ký bởi 0x44d...9e21",
    },
    {
        icon: "warning",
        iconColor: "text-[#ff6e84]",
        iconBg: "bg-[#ff6e84]/10",
        title: "Trễ hạn - Phòng 204",
        sub: "Quá hạn 3 ngày",
    },
];

const tenants = [
    { room: "Phòng 201", wallet: "0x3f...1a42", paid: true, endDate: "15/08/2024" },
    { room: "Phòng 304", wallet: "0x9e...d811", paid: false, endDate: "02/09/2024" },
    { room: "Phòng 102", wallet: "0x2a...f56c", paid: true, endDate: "20/12/2024" },
];

export default function Dashboard() {
    const { addRoom } = useRooms();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "", price: "", deposit: "", location: "", image: "", status: "Available", description: "Căn hộ hiện đại vừa được thêm mới trên hệ thống Blockchain."
    });

    const handleAddSubmit = (e) => {
        e.preventDefault();
        addRoom({
            ...formData,
            price: Number(formData.price),
            deposit: Number(formData.deposit),
            amenities: ["wifi", "ac_unit"], 
        });
        setIsAddModalOpen(false);
        alert("Đăng phòng thành công! Bạn có thể xem tại danh sách phòng.");
        setFormData({ title: "", price: "", deposit: "", location: "", image: "", status: "Available", description: "Căn hộ hiện đại vừa được thêm mới trên hệ thống Blockchain." });
    };

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] min-h-screen flex flex-col">

            {/* Navbar */}
            <header className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <nav className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center space-x-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Home</Link>
                        <Link to="/rooms" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1">Dashboard</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-[#1e1e2d] px-4 py-2 rounded-full border border-white/5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-mono text-xs text-[#aba9b9]">0x71C...8B2A</span>
                        </div>
                        <button className="bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black font-bold py-2 px-6 rounded-lg text-sm uppercase hover:opacity-90 transition-all active:scale-95 duration-200">
                            Connect Wallet
                        </button>
                    </div>
                </nav>
            </header>

            <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-8">

                {/* Header & Quick Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
                    <div>
                        <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-[#e9e6f7] mb-2">Bảng điều khiển</h1>
                        <p className="text-[#aba9b9] max-w-lg">Quản lý tài sản số và dòng tiền thuê từ các hợp đồng thông minh của bạn.</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 bg-[#242434] text-[#a8a4ff] border border-[#a8a4ff]/20 hover:bg-[#a8a4ff]/10 transition-all px-5 py-3 rounded-xl font-medium">
                            <span className="material-symbols-outlined">add_home</span>
                            Đăng phòng mới
                        </button>
                        <button className="flex items-center gap-2 bg-[#242434] text-[#aa8ffd] border border-[#aa8ffd]/20 hover:bg-[#aa8ffd]/10 transition-all px-5 py-3 rounded-xl font-medium">
                            <span className="material-symbols-outlined">account_balance_wallet</span>
                            Rút tiền cọc
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-[#12121e] p-6 rounded-2xl flex flex-col justify-between hover:bg-[#1e1e2d] transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${s.iconBg} ${s.iconColor}`}>
                                    <span className="material-symbols-outlined">{s.icon}</span>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${s.badgeColor}`}>{s.badge}</span>
                            </div>
                            <div>
                                <p className="text-[#aba9b9] text-sm font-medium mb-1">{s.label}</p>
                                <h3 className="font-['Space_Grotesk'] text-3xl font-bold text-[#e9e6f7]">{s.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart + Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* Chart */}
                    <div className="lg:col-span-2 bg-[#12121e] rounded-3xl p-8 overflow-hidden relative">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-xl font-bold">Thu nhập thuê nhà</h2>
                                <p className="text-sm text-[#aba9b9]">Lịch sử 6 tháng gần nhất</p>
                            </div>
                            <div className="flex items-center gap-2 bg-[#242434] rounded-lg px-3 py-1">
                                <span className="text-xs font-medium">Tổng: 24.8 ETH</span>
                            </div>
                        </div>
                        <div className="w-full h-64 relative">
                            <svg className="w-full h-full" viewBox="0 0 1000 300">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#a8a4ff" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#a8a4ff" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <line stroke="#ffffff" strokeOpacity="0.05" x1="0" x2="1000" y1="50" y2="50" />
                                <line stroke="#ffffff" strokeOpacity="0.05" x1="0" x2="1000" y1="150" y2="150" />
                                <line stroke="#ffffff" strokeOpacity="0.05" x1="0" x2="1000" y1="250" y2="250" />
                                <path d="M0,250 Q150,220 300,100 T600,180 T1000,50 L1000,300 L0,300 Z" fill="url(#chartGradient)" />
                                <path d="M0,250 Q150,220 300,100 T600,180 T1000,50" fill="none" stroke="#a8a4ff" strokeLinecap="round" strokeWidth="4" />
                                <circle cx="0" cy="250" fill="#0d0d18" r="6" stroke="#a8a4ff" strokeWidth="2" />
                                <circle cx="300" cy="100" fill="#0d0d18" r="6" stroke="#a8a4ff" strokeWidth="2" />
                                <circle cx="600" cy="180" fill="#0d0d18" r="6" stroke="#a8a4ff" strokeWidth="2" />
                                <circle cx="1000" cy="50" fill="#0d0d18" r="6" stroke="#a8a4ff" strokeWidth="2" />
                            </svg>
                            <div className="flex justify-between mt-4 text-xs font-mono text-[#aba9b9]">
                                {["THÁNG 1", "THÁNG 2", "THÁNG 3", "THÁNG 4", "THÁNG 5", "THÁNG 6"].map((m) => (
                                    <span key={m}>{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Activity Sidebar */}
                    <div className="bg-[#1e1e2d] rounded-3xl p-8">
                        <h2 className="font-['Space_Grotesk'] text-xl font-bold mb-6">Hoạt động gần đây</h2>
                        <div className="space-y-6">
                            {activities.map((a, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full ${a.iconBg} flex items-center justify-center ${a.iconColor} shrink-0`}>
                                        <span className="material-symbols-outlined text-sm">{a.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#e9e6f7] font-medium">{a.title}</p>
                                        <p className="text-xs text-[#aba9b9]">{a.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-3 rounded-xl border border-white/5 text-sm font-medium hover:bg-white/5 transition-colors">
                            Xem tất cả lịch sử
                        </button>
                    </div>
                </div>

                {/* Tenants Table */}
                <div className="bg-[#12121e] rounded-3xl overflow-hidden">
                    <div className="px-8 py-6 flex justify-between items-center">
                        <h2 className="font-['Space_Grotesk'] text-xl font-bold">Người thuê đang hoạt động</h2>
                        <button className="text-[#a8a4ff] text-sm font-medium hover:underline">Bộ lọc</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#242434]/50">
                                    {["Phòng", "Người thuê (Wallet)", "Trạng thái", "Kết thúc hợp đồng", "Hành động"].map((h, i) => (
                                        <th key={i} className={`px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#aba9b9] ${i === 4 ? "text-right" : ""}`}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {tenants.map((t, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-5 font-medium">{t.room}</td>
                                        <td className="px-8 py-5">
                                            <span className="font-mono text-sm bg-[#181826] px-2 py-1 rounded">{t.wallet}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {t.paid ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                                    Đã thanh toán
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium bg-[#ff6e84]/10 text-[#ff6e84]">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff6e84]"></span>
                                                    Chưa thanh toán
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-sm text-[#aba9b9]">{t.endDate}</td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 rounded-lg bg-[#1e1e2d] hover:text-[#a8a4ff] transition-colors">
                                                    <span className="material-symbols-outlined">mail</span>
                                                </button>
                                                <button className="p-2 rounded-lg bg-[#1e1e2d] hover:text-[#ff6e84] transition-colors">
                                                    <span className="material-symbols-outlined">close</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-[#12121e] flex justify-center border-t border-white/5">
                        <button className="text-[#aba9b9] hover:text-[#e9e6f7] text-sm transition-colors py-2">
                            Xem tất cả 8 người thuê
                        </button>
                    </div>
                </div>

                {/* Add Room Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#12121e] border border-white/10 rounded-3xl p-8 max-w-xl w-full shadow-2xl relative">
                            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 text-[#aba9b9] hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <h2 className="font-['Space_Grotesk'] text-3xl font-bold mb-6 text-[#e9e6f7]">Đăng phòng mới</h2>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-[#aba9b9] uppercase tracking-wider mb-2 font-medium">Tên phòng / Căn hộ</label>
                                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#242434] text-[#e9e6f7] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a8a4ff]/50 transition-colors" placeholder="VD: Studio 102 Cao Cấp" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-[#aba9b9] uppercase tracking-wider mb-2 font-medium">Giá Thuê (ETH)</label>
                                        <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-[#242434] text-[#e9e6f7] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a8a4ff]/50 transition-colors" placeholder="0.5" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[#aba9b9] uppercase tracking-wider mb-2 font-medium">Cọc (ETH)</label>
                                        <input required type="number" step="0.01" value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} className="w-full bg-[#242434] text-[#e9e6f7] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a8a4ff]/50 transition-colors" placeholder="1.0" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-[#aba9b9] uppercase tracking-wider mb-2 font-medium">Địa chỉ</label>
                                    <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-[#242434] text-[#e9e6f7] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a8a4ff]/50 transition-colors" placeholder="VD: Vinhomes Central Park, HCMM" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[#aba9b9] uppercase tracking-wider mb-2 font-medium">Link Ảnh Bìa</label>
                                    <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-[#242434] text-[#e9e6f7] border border-white/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#a8a4ff]/50 transition-colors" placeholder="https://..." />
                                </div>
                                <button type="submit" className="w-full bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black font-bold py-4 rounded-xl mt-6 hover:shadow-[0_0_20px_rgba(168,164,255,0.4)] transition-all active:scale-[0.98] uppercase tracking-widest text-sm">
                                    Thêm Vào Hệ Thống Blockchain
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="text-xl font-bold text-[#e9e6f7] mb-2 font-['Space_Grotesk']">QuanLyThueNha</div>
                        <p className="text-sm uppercase tracking-widest text-[#e9e6f7]/40">© 2024 QuanLyThueNha.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 text-sm uppercase tracking-widest">
                        {["Etherscan", "Discord", "Twitter", "Terms of Service"].map((l) => (
                            <a key={l} href="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors">{l}</a>
                        ))}
                    </div>
                    <div className="flex items-center gap-4">
                        {["shield", "language"].map((icon) => (
                            <div key={icon} className="w-8 h-8 rounded-full bg-[#242434] flex items-center justify-center text-[#a8a4ff] hover:text-[#e9e6f7] transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-base">{icon}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}