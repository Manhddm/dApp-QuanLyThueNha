import { Plus, Home, Users, DollarSign, Activity, FileCheck, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { formatOasis } from "../lib/utils";
import { Link } from "react-router-dom";
import { useRentHouse } from "../hooks/useRentHouse";
import { useAccount } from "wagmi";
import { Check, X, Loader2, Info } from "lucide-react";
import { formatEther } from "viem";

export default function Dashboard() {
    const { user } = useAuth();
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { isConnected, address } = useAccount();
    const { pendingContracts, myContracts, isPending, isWaiting } = useRentHouse();

    // Tính toán các chỉ số
    const activeRooms = rooms.filter(r => r.trang_thai === 'da_thue').length;
    const totalRooms = rooms.length;

    // Lấy danh sách hợp đồng của chủ nhà này
    const landlordContracts = myContracts ? myContracts.filter((c: any) => c.landlord.toLowerCase() === address?.toLowerCase()) : [];

    // Tính tổng doanh thu tháng từ các hợp đồng đang Active (status === 1)
    const activeContracts = landlordContracts.filter((c: any) => Number(c.status) === 1);
    const totalRevenueWei = activeContracts.reduce((acc: bigint, c: any) => acc + BigInt(c.rentPrice), 0n);
    const totalRevenueOasis = Number(formatEther(totalRevenueWei));

    // Hoạt động gần đây (lấy 3 hợp đồng mới nhất)
    const recentActivities = [...landlordContracts].reverse().slice(0, 3);

    useEffect(() => {
        const fetchMyRooms = async () => {
            if (!user?.ma_nguoi_dung) return;
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/bat-dong-san?ma_chu_so_huu=${user.ma_nguoi_dung}`);
                const result = await response.json();
                if (result.success) {
                    setRooms(result.data);
                }
            } catch (error) {
                console.error("Error fetching my rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyRooms();
    }, [user]);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold mb-2 tracking-tighter text-on-background">
                        Dashboard
                    </h1>
                    <p className="text-on-surface-variant text-sm">
                        Quản lý tài sản và theo dõi doanh thu thời gian thực.
                    </p>
                </div>
                <Link to="/create-room" className="bg-primary text-on-primary-fixed hover:bg-primary-dim px-6 py-3 rounded-xl font-label font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,164,255,0.3)]">
                    <Plus size={18} />
                    Tạo phòng mới
                </Link>
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
                            Đang hoạt động
                        </span>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Doanh thu dự kiến (OASIS)</p>
                    <p className="text-3xl font-headline font-bold text-primary">{formatOasis(totalRevenueOasis)}</p>
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
                        {activeRooms} <span className="text-sm text-on-surface-variant font-medium ml-1">/ {totalRooms} đang cho thuê</span>
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
                    <p className="text-3xl font-headline font-bold text-on-surface">{activeContracts.length}</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-highest rounded-full blur-2xl group-hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-all"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface border border-black/10 dark:border-white/10">
                            <FileCheck size={20} />
                        </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest font-bold text-on-surface-variant mb-1">Smart Contracts</p>
                    <p className="text-3xl font-headline font-bold text-on-surface">{landlordContracts.length}</p>
                </div>
            </div>

            {/* Pending Requests Section */}
            {isConnected && pendingContracts && pendingContracts.filter((c: any) => c.landlord.toLowerCase() === address?.toLowerCase()).length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-headline font-bold flex items-center gap-2 mb-6">
                        <Info size={20} className="text-primary" /> Yêu cầu thuê đang chờ duyệt
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {pendingContracts
                            .filter((c: any) => c.landlord.toLowerCase() === address?.toLowerCase())
                            .map((contract: any, idx: number) => {
                                // contract: [id, roomId, landlord, tenant, rentPrice, deposit, status]
                                const cId = Number(contract.id);
                                const rId = Number(contract.roomId);
                                const tenant = contract.tenant;
                                const deposit = contract.deposit;

                                return (
                                    <div key={idx} className="glass-card p-6 rounded-2xl border-l-4 border-primary shadow-glow/5 relative group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Contract ID: {cId}</p>
                                                <h3 className="font-headline font-bold text-lg">Yêu cầu thuê Phòng #{rId}</h3>
                                                <p className="text-xs text-on-surface-variant font-mono truncate max-w-[200px]">Người thuê: {tenant}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Tiền cọc</p>
                                                <p className="text-primary font-bold">{formatOasis(formatEther(deposit))} OASIS</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/manage-room/${rId}`}
                                                className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                            >
                                                Chi tiết & Xử lý
                                            </Link>
                                        </div>
                                        {(isPending || isWaiting) && (
                                            <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Manage Assets List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-headline font-bold flex items-center gap-2 mb-6">
                        <Home size={20} className="text-on-surface-variant" /> Tài sản của bạn
                    </h2>
                    <div className="bg-surface-container-low border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden">
                        {/* List Header */}
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-black/5 dark:border-white/5 bg-surface-container/50 text-xs font-bold uppercase tracking-widest text-on-surface-variant hidden md:grid">
                            <div className="col-span-5">Phòng</div>
                            <div className="col-span-2 text-center">Trạng thái</div>
                            <div className="col-span-3 text-right">Giá / Cọc (OASIS)</div>
                            <div className="col-span-2 text-right">Action</div>
                        </div>

                        {/* List Items */}
                        {loading ? (
                            <div className="p-12 text-center text-on-surface-variant text-sm font-medium">Đang tải danh sách phòng...</div>
                        ) : rooms.length === 0 ? (
                            <div className="p-12 text-center text-on-surface-variant text-sm font-medium">Bạn chưa có tài sản nào. Hãy thêm phòng mới!</div>
                        ) : rooms.map((room) => (
                            <div key={room.ma_bat_dong_san} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-black/5 dark:border-white/5 items-center hover:bg-white/[0.02] transition-colors">
                                <div className="col-span-12 md:col-span-5 flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container border border-black/5 dark:border-white/5">
                                        {room.anh_dai_dien ? (
                                            <img src={room.anh_dai_dien} alt={room.ten} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><Home size={20} /></div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-on-surface truncate" title={room.ten}>{room.ten}</p>
                                        <p className="text-xs font-mono text-on-surface-variant mt-1">ID: {room.ma_bat_dong_san}</p>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-2 md:text-center flex items-center md:justify-center">
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${room.trang_thai === "da_thue" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"}`}>
                                        {room.trang_thai === "da_thue" ? "Đã cho thuê" : "Phòng trống"}
                                    </span>
                                </div>
                                <div className="col-span-12 md:col-span-3 md:text-right flex items-center justify-between md:block">
                                    <span className="md:hidden text-xs text-on-surface-variant">Giá/Cọc:</span>
                                    <div className="font-mono text-sm font-bold flex items-center md:justify-end gap-1.5">
                                        <span className="text-primary">{formatOasis(room.gia_thue)}</span>
                                        <span className="text-on-surface-variant text-xs opacity-40">/</span>
                                        <span className="text-on-surface-variant text-xs font-medium">{formatOasis(room.tien_dat_coc)}</span>
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-2 md:text-right flex justify-end">
                                    <Link to={`/manage-room/${room.ma_bat_dong_san}`} className="text-xs font-bold uppercase tracking-widest bg-surface-container-highest hover:bg-black/10 dark:hover:bg-white/10 dark:bg-white/10 px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 transition-colors">
                                        Quản lý
                                    </Link>
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

                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-center text-on-surface-variant py-4 font-medium">Chưa có hoạt động nào</p>
                            ) : (
                                recentActivities.map((activity: any, idx: number) => {
                                    const status = Number(activity.status);
                                    const rId = Number(activity.roomId);
                                    const price = formatOasis(formatEther(activity.rentPrice));

                                    let icon = <FileCheck size={14} />;
                                    let title = "Hợp đồng mới được ký";
                                    let colorClass = "text-secondary";

                                    if (status === 0) {
                                        icon = <Users size={14} />;
                                        title = "Yêu cầu thuê phòng mới";
                                        colorClass = "text-primary";
                                    } else if (status === 2) {
                                        icon = <Check size={14} />;
                                        title = "Hợp đồng đã hoàn thành";
                                        colorClass = "text-green-500";
                                    } else if (status === 3) {
                                        icon = <X size={14} />;
                                        title = "Hợp đồng đã hủy";
                                        colorClass = "text-red-500";
                                    }

                                    return (
                                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full border border-black/10 dark:border-white/10 bg-surface-container-highest ${colorClass} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10`}>
                                                {icon}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-panel shadow-md text-sm border border-black/5 dark:border-white/5">
                                                <p className="font-bold text-on-surface mb-1 text-xs">{title}</p>
                                                <p className="text-on-surface-variant text-[10px] uppercase font-bold tracking-widest font-mono">
                                                    Phòng #{rId} • Giá: {price} OASIS
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}

                        </div>
                        <Link to="/contracts" className="block w-full mt-6 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-black dark:hover:text-white transition-colors text-center py-2">
                            Xem tất cả hợp đồng
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}



