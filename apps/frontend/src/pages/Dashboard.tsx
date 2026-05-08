import { Plus, Home, Users, DollarSign, Activity, FileCheck, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2 tracking-tighter text-on-background">
                        Landlord Dashboard
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        Quản lý tài sản và theo dõi doanh thu thời gian thực.
                    </p>
                </div>
                <button className="bg-primary text-on-primary-fixed hover:bg-primary-dim px-6 py-3 rounded-xl font-label font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,164,255,0.3)]">
                    <Plus size={18} />
                    Tạo Smart Contract Mới
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <DollarSign size={20} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                            +12.5% <ArrowUpRight size={12} className="ml-0.5" />
                        </span>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Doanh thu tháng (ETH)</p>
                    <p className="text-3xl font-headline font-bold text-on-surface">3.45</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 rounded-full blur-2xl group-hover:bg-secondary/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                            <Home size={20} />
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Tài sản (Phòng)</p>
                    <p className="text-3xl font-headline font-bold text-on-surface">
                        4 <span className="text-sm text-on-surface-variant font-medium ml-1">/ 5 đang cho thuê</span>
                    </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-container/10 rounded-full blur-2xl group-hover:bg-tertiary-container/20 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary-container border border-tertiary-container/20">
                            <Users size={20} />
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Người thuê hiện tại</p>
                    <p className="text-3xl font-headline font-bold text-on-surface">4</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-highest rounded-full blur-2xl group-hover:bg-white/5 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface border border-white/10">
                            <FileCheck size={20} />
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Smart Contracts</p>
                    <p className="text-3xl font-headline font-bold text-on-surface">12</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Manage Assets List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-headline font-bold flex items-center gap-2 mb-6">
                        <Home size={20} className="text-on-surface-variant" /> Tài sản của bạn
                    </h2>
                    <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden">
                        {/* List Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-surface-container/50 text-xs font-bold uppercase tracking-widest text-on-surface-variant hidden md:grid">
                            <div className="col-span-5">Phòng</div>
                            <div className="col-span-2 text-center">Trạng thái</div>
                            <div className="col-span-3 text-right">Giá / Cọc (ETH)</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        {/* List Items */}
                        {[
                            { name: "Skyline Loft Premium", id: "0x82f...a12", status: "Rented", tenant: "0x44B...12C", price: "0.85", deposit: "1.5" },
                            { name: "Tech-Smart Studio", id: "0xccc...d45", status: "Available", tenant: null, price: "0.70", deposit: "1.4" },
                            { name: "Industrial Brick Loft", id: "0xaa1...b23", status: "Rented", tenant: "0x91F...E34", price: "0.58", deposit: "1.0" }
                        ].map((item, i) => (
                            <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                                <div className="col-span-12 md:col-span-5">
                                    <p className="font-bold text-on-surface truncate">{item.name}</p>
                                    <p className="text-xs font-mono text-on-surface-variant mt-1">ID: {item.id}</p>
                                </div>
                                <div className="col-span-12 md:col-span-2 md:text-center flex items-center md:justify-center">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${item.status === "Rented" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="col-span-12 md:col-span-3 md:text-right flex items-center justify-between md:block">
                                    <span className="md:hidden text-xs text-on-surface-variant">Giá/Cọc:</span>
                                    <div>
                                        <p className="font-mono text-sm font-bold text-primary">{item.price}</p>
                                        <p className="text-xs text-on-surface-variant font-mono">/ {item.deposit}</p>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-2 md:text-right flex justify-end">
                                    <button className="text-xs font-bold uppercase tracking-widest bg-surface-container-highest hover:bg-white/10 px-3 py-2 rounded-lg border border-white/5 transition-colors">
                                        Quản lý
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Log */}
                <div className="lg:col-span-1 space-y-6">
                    <h2 className="text-xl font-headline font-bold flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-on-surface-variant" /> Hoạt động gần đây
                    </h2>
                    <div className="glass-card rounded-2xl p-6">
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-container-highest text-primary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                                    <DollarSign size={14} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-panel shadow-md text-sm border border-white/5">
                                    <p className="font-bold text-on-surface mb-1 text-xs">Nhận tiền thuê</p>
                                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest font-mono">0.85 ETH • 2 giờ trước</p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-container-highest text-secondary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                                    <FileCheck size={14} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-surface-container-low shadow-md text-sm border border-white/5">
                                    <p className="font-bold text-on-surface mb-1 text-xs">Hợp đồng mới được ký</p>
                                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest font-mono">Phòng 204 • Hôm qua</p>
                                </div>
                            </div>

                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-surface-container-highest text-tertiary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">
                                    <Users size={14} />
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-surface-container-low shadow-md text-sm border border-white/5 opacity-70">
                                    <p className="font-bold text-on-surface mb-1 text-xs">Phòng trống cập nhật</p>
                                    <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest font-mono">1 Phòng • 3 ngày trước</p>
                                </div>
                            </div>

                        </div>
                        <button className="w-full mt-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors text-center py-2">
                            Xem tất cả
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
