import { useParams, Link } from "react-router-dom";
import { Copy, MapPin, ShieldCheck, FileText, ChevronLeft, Calendar, Coins, History } from "lucide-react";

export default function RoomDetail() {
    const { id } = useParams();

    // Mock data for the specific room
    const room = {
        id: id || "0x82f...a12",
        name: "Skyline Loft Premium",
        price: "0.85",
        deposit: "1.5",
        location: "88 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
        addressFull: "Tòa nhà The Landmark, Tầng 32, Phòng 3204, 88 Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM",
        status: "Available",
        contractAddress: "0x3B6C908...4A2D",
        ownerId: "0xA92...F11",
        description: "Căn hộ cao cấp với tầm nhìn toàn cảnh trung tâm thành phố. Thiết kế hiện đại, nội thất sang trọng. Hệ thống smart home tích hợp. Tòa nhà có đầy đủ tiện ích: hồ bơi vô cực, gym, khu BBQ.",
        amenities: ["Smart Home System", "Infinity Pool", "Private Gym", "24/7 Security", "Balcony View", "Fully Furnished"],
        rules: ["No smoking inside", "Pets allowed (under 5kg)", "No loud noise after 10PM"],
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBT0ZxG3OF-jv-wsG8BUUvyHvXlcJcDxUOFO7R82mqCw9lKM5hHuozcrSIJKvLergBMQaPQpgAYc-2lwQZzRYyPzXKwistNJDq4tuyz8d35OOi4IxZy5g98SYFqnhybi0jSOBWoUidnlIHQVi77K_107k6YTc2relPOpjtn8k5iDnV7KC5QxwtexNikjzOkicEUg-giOcy2Kr5JbaAcVPa_afFMa66aANuQ9l3KacQLucF2l7gINCaYqnysSRT0wyIY7sS7uj6lfm8",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCzTRNIV5sGC-OSYmBOOCvF6HtcPb8z71-Xf9czTZQbWBZGO6jIAqqRXMu8dZoHDiVtCEODv9yV4jtI4woWYO6GhxnwTAzExWG-vxLg81MwWbDB-UkYj4Z9HktFkFCCaHefI57GjKzG_tG81FuRBY4EDfT96Al2L-JBKN4ZclNSq_L64l9sxlQmSDTJo4gEkEPTZ0Z-VTfNK1LCmD6KvxDGG-jhWe-r8axFM_Y47gWKkwhBiOuMdljqnB8ROC-hpT-x1JT985Xb-sI"
        ],
        terms: {
            duration: "12 Months Minimum",
            penalty: "1 Month Rent",
            paymentDay: "5th of every month"
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full">
            <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mb-8">
                <ChevronLeft size={16} /> Back to Rooms
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Images & Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden glass-panel">
                            <img src={room.images[0]} alt="Room main view" className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="h-32 rounded-xl overflow-hidden glass-panel hidden md:block">
                                <img src={room.images[1]} alt="Room interior" className="w-full h-full object-cover" />
                            </div>
                            <div className="h-32 rounded-xl overflow-hidden bg-surface-container-highest border border-white/5 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                                <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">+ View All 12 Photos</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Info */}
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                {room.status}
                            </span>
                            <span className="px-3 py-1 bg-surface-container-highest border border-white/10 text-on-surface rounded-full text-xs font-medium font-mono">
                                ID: {room.id}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">{room.name}</h1>
                        <p className="flex items-start gap-2 text-on-surface-variant text-base mb-8">
                            <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                            {room.addressFull}
                        </p>

                        <div className="w-full h-px bg-white/5 my-8"></div>

                        <h2 className="text-xl font-headline font-bold mb-4">Mô tả chi tiết</h2>
                        <p className="text-on-surface-variant leading-relaxed mb-8">
                            {room.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">Tiện ích</h3>
                                <ul className="space-y-3">
                                    {room.amenities.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">Quy định thuê</h3>
                                <ul className="space-y-3">
                                    {room.rules.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                                            <div className="w-1.5 h-1.5 rounded-full bg-secondary/60"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Contract & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Booking Card */}
                    <div className="glass-card rounded-2xl p-6 lg:p-8 sticky top-24">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Giá Thuê</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-headline font-bold text-primary">{room.price}</span>
                                    <span className="text-xl font-bold text-primary">ETH</span>
                                    <span className="text-xs text-on-surface-variant ml-1">/tháng</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-surface-container p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
                                        <Coins size={16} />
                                    </div>
                                    <span className="text-sm font-semibold">Cọc đảm bảo</span>
                                </div>
                                <span className="font-mono font-medium">{room.deposit} ETH</span>
                            </div>
                            <div className="bg-surface-container p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Calendar size={16} />
                                    </div>
                                    <span className="text-sm font-semibold">Thời hạn tối thiểu</span>
                                </div>
                                <span className="text-sm font-medium">{room.terms.duration}</span>
                            </div>
                        </div>

                        <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed py-4 rounded-xl font-label font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(168,164,255,0.3)] transition-all mb-4 text-sm flex items-center justify-center gap-2">
                            <FileText size={18} /> Ký Smart Contract
                        </button>
                        <p className="text-center text-xs text-on-surface-variant">
                            Phí mạng (Gas fee) sẽ được tính tại thời điểm giao dịch.
                        </p>

                        <div className="w-full h-px bg-white/5 my-6"></div>

                        {/* Contract Transparency */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-[#22C55E]" />
                                Minh Bạch Chuỗi Khối
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Contract Address</p>
                                    <div className="flex items-center justify-between bg-surface-container-highest px-3 py-2 rounded-lg border border-white/5">
                                        <span className="font-mono text-xs text-primary/80 truncate mr-2">{room.contractAddress}</span>
                                        <button className="text-on-surface-variant hover:text-white transition-colors">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Chủ nhà (Owner)</p>
                                    <div className="flex items-center justify-between bg-surface-container-highest px-3 py-2 rounded-lg border border-white/5">
                                        <span className="font-mono text-xs text-secondary/80 truncate mr-2">{room.ownerId}</span>
                                        <button className="text-on-surface-variant hover:text-white transition-colors">
                                            <Copy size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2.5 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-widest text-on-surface hover:bg-white/5 transition-all mt-2 flex items-center justify-center gap-2">
                                <History size={14} /> Xem Lịch Sử Giao Dịch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
