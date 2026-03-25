import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useRooms } from "../hooks/useRooms";

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/rooms/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setRoom(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#0d0d18] text-[#a8a4ff]">Đang tải dữ liệu từ Backend...</div>;
    }

    if (!room) {
        return (
            <div className="bg-[#0d0d18] min-h-screen text-[#e9e6f7] flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-[#aba9b9] mb-4">search_off</span>
                <h1 className="text-3xl font-bold font-['Space_Grotesk'] mb-4">Không tìm thấy phòng</h1>
                <button onClick={() => navigate('/rooms')} className="bg-[#a8a4ff] text-black px-6 py-2 rounded-lg font-bold">Quay lại danh sách</button>
            </div>
        );
    }

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] selection:bg-[#a8a4ff]/30 min-h-screen">
            {/* TopNavBar */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors font-['Space_Grotesk'] tracking-tight">Home</Link>
                        <Link to="/rooms" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1 font-['Space_Grotesk'] tracking-tight">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors font-['Space_Grotesk'] tracking-tight">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors font-['Space_Grotesk'] tracking-tight">Dashboard</Link>
                    </div>
                    <button className="bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform active:scale-95 duration-200 shadow-[0px_10px_20px_rgba(168,164,255,0.2)]">
                        Connect Wallet
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">
                <div className="mb-6">
                    <button onClick={() => navigate('/rooms')} className="text-[#aba9b9] hover:text-white flex items-center gap-2 text-sm uppercase tracking-widest font-bold transition-colors">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Trở lại danh sách
                    </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Image Gallery Section */}
                        <section className="space-y-4">
                            <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-2xl relative group">
                                <img 
                                    alt={room.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                    src={room.image} 
                                />
                                <div className="absolute top-4 left-4 bg-[#242434]/80 backdrop-blur-md px-4 py-1 rounded-full text-xs font-medium border border-white/10 uppercase tracking-widest">
                                    ID: {room.id}
                                </div>
                            </div>
                        </section>
                        
                        {/* Description */}
                        <section className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-['Space_Grotesk'] font-bold text-[#e9e6f7] tracking-tight leading-tight">
                                {room.title}
                            </h1>
                            <p className="text-[#aba9b9] leading-relaxed text-lg max-w-3xl">
                                {room.description}
                            </p>
                        </section>

                        {/* Amenities */}
                        <section className="bg-[#12121e] p-8 rounded-3xl border border-white/5">
                            <h2 className="text-xl font-['Space_Grotesk'] font-semibold mb-8 text-[#aa8ffd]">Tiện ích căn hộ</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {room.amenities.map(item => (
                                    <div key={item} className="flex flex-col items-center gap-3 p-4 bg-[#1e1e2d]/50 rounded-2xl">
                                        <span className="material-symbols-outlined text-[#a8a4ff] text-3xl">{item}</span>
                                        <span className="text-sm font-medium uppercase text-center">{item.replace('_', ' ')}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Sticky Pricing Card */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-28">
                            <div className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden">
                                {/* Decorative glow */}
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#a8a4ff]/10 rounded-full blur-[80px]"></div>
                                
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[#aba9b9] text-sm font-medium uppercase tracking-widest mb-1">Giá Thuê Mỗi Tháng</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-['Space_Grotesk'] font-bold text-[#a8a4ff]">{room.price} ETH</span>
                                        </div>
                                    </div>
                                    {room.status === "Available" ? (
                                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-green-500/20">
                                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                            Available
                                        </span>
                                    ) : (
                                        <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-red-500/20">
                                            <span className="material-symbols-outlined text-[10px]">do_not_disturb_on</span>
                                            Rented
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#aba9b9]">Phí Đặt Cọc (Deposit)</span>
                                        <span className="font-mono font-bold text-[#e9e6f7]">{room.deposit} ETH</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#aba9b9]">Thời hạn tối thiểu</span>
                                        <span className="font-bold text-[#e9e6f7]">{room.monthsMinimum || 6} Tháng</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#aba9b9]">Ngày dọn vào</span>
                                        <span className="font-bold text-[#e9e6f7]">{room.availableDate || "Ngay lập tức"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-[#aba9b9]">Vị Trí</span>
                                        <span className="font-bold text-[#e9e6f7] text-right truncate w-[60%] line-clamp-1" title={room.location}>{room.location}</span>
                                    </div>
                                </div>

                                <div className="p-4 bg-[#242434] rounded-2xl space-y-2 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-tighter text-[#aba9b9]/70 font-bold">Landlord Wallet Address</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-[#aa8ffd] truncate">{room.landlordWallet}</span>
                                        <span 
                                            className="material-symbols-outlined text-sm cursor-pointer hover:text-white"
                                            onClick={() => {
                                                navigator.clipboard.writeText(room.landlordWallet);
                                                alert("Đã copy địa chỉ ví!");
                                            }}
                                        >content_copy</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <button 
                                        disabled={room.status !== "Available"}
                                        className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${room.status === "Available" ? "bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black hover:shadow-[0_0_30px_rgba(168,164,255,0.4)]" : "bg-white/5 text-[#aba9b9]/50 cursor-not-allowed" }`}
                                        onClick={() => alert(`Bạn đang gọi hàm thanh toán Smart Contract để cọc ${room.deposit} ETH!`)}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{room.status === "Available" ? "account_balance_wallet" : "lock"}</span>
                                        {room.status === "Available" ? "Đặt cọc & Ký hợp đồng" : "Đã cho thuê"}
                                    </button>
                                    <div className="flex items-center justify-center gap-2 text-[#aba9b9]/60 text-xs text-center px-4">
                                        <span className="material-symbols-outlined text-sm">verified_user</span>
                                        <span>Giao dịch được thực hiện qua smart contract. Minh bạch và bảo mật tuyệt đối.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 mt-20">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
                    <div className="text-xl font-bold text-[#e9e6f7] font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="flex gap-8">
                        <Link to="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors font-['Inter'] text-sm uppercase tracking-widest">Etherscan</Link>
                        <Link to="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors font-['Inter'] text-sm uppercase tracking-widest">Discord</Link>
                        <Link to="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors font-['Inter'] text-sm uppercase tracking-widest">Twitter</Link>
                        <Link to="#" className="text-[#e9e6f7]/40 hover:text-[#aa8ffd] transition-colors font-['Inter'] text-sm uppercase tracking-widest">Terms of Service</Link>
                    </div>
                    <div className="text-[#e9e6f7]/40 font-['Inter'] text-sm uppercase tracking-widest">
                        © 2024 QuanLyThueNha. The Ethereal Ledger.
                    </div>
                </div>
            </footer>
        </div>
    );
}
