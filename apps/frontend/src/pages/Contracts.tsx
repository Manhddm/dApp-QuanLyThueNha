import { Link } from "react-router-dom";
import { FileSignature, AlertCircle, ArrowRight, CheckCircle2, Clock, XCircle, ShieldCheck, Loader2 } from "lucide-react";
import { formatOasis } from "../lib/utils";
import { useRentHouse } from "../hooks/useRentHouse";
import { useRooms } from "../hooks/useRooms";
import { useAccount } from "wagmi";

export default function Contracts() {
    const { address } = useAccount();
    const { myContracts, duyetThuePhong, tuChoiThuePhong, thuHoiCocDoViPham, isPending: txPending, isWaiting: txWaiting } = useRentHouse();
    const { allRooms, loading: roomsLoading } = useRooms();

    // Map status enum to string
    const getStatusText = (statusNum: number) => {
        switch(statusNum) {
            case 0: return { text: "Chờ Duyệt", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", icon: <Clock size={14} className="text-orange-500" /> };
            case 1: return { text: "Đang Thuê", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", icon: <CheckCircle2 size={14} className="text-green-500" /> };
            case 2: return { text: "Đã Kết Thúc", color: "text-gray-500", bg: "bg-gray-500/10 border-gray-500/20", icon: <CheckCircle2 size={14} className="text-gray-500" /> };
            case 3: return { text: "Đã Từ Chối", color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", icon: <XCircle size={14} className="text-red-500" /> };
            case 4: return { text: "Đã Bị Đuổi / Phạt", color: "text-red-600", bg: "bg-red-600/10 border-red-600/20", icon: <XCircle size={14} className="text-red-600" /> };
            default: return { text: "Unknown", color: "text-gray-500", bg: "bg-gray-500/10 border-gray-500/20", icon: null };
        }
    };

    if (roomsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Sort contracts: newest first
    const sortedContracts = myContracts ? [...myContracts].sort((a, b) => Number(b.id) - Number(a.id)) : [];

    // Lọc bỏ các hợp đồng cũ trùng lặp (ví dụ khách thuê bấm ký lại nhiều lần sau khi bị từ chối)
    // Chỉ giữ lại hợp đồng mới nhất của khách thuê đối với 1 phòng cụ thể
    const displayedContracts = sortedContracts.filter((contract, index, self) => 
        index === self.findIndex((c) => 
            Number(c.roomId) === Number(contract.roomId) && 
            c.tenant.toLowerCase() === contract.tenant.toLowerCase()
        )
    );

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tighter text-on-background">
                        Hợp Đồng Của Tôi
                    </h1>
                    <p className="text-on-surface-variant max-w-xl">
                        Quản lý các hợp đồng thuê nhà bằng Smart Contract. An toàn, minh bạch
                        và tự động hóa hoàn toàn trên blockchain Oasis.
                    </p>
                </div>
            </header>

            <div className="space-y-6">
                {displayedContracts.length === 0 ? (
                    <div className="text-center py-16 glass-panel rounded-2xl border border-black/5 dark:border-white/5">
                        <FileSignature className="w-16 h-16 text-on-surface-variant/30 mx-auto mb-4" />
                        <h3 className="text-xl font-bold mb-2">Chưa có hợp đồng nào</h3>
                        <p className="text-on-surface-variant">Bạn chưa tham gia vào bất kỳ hợp đồng thuê nhà nào trên nền tảng.</p>
                        <Link to="/rooms" className="mt-6 inline-block bg-primary text-on-primary-fixed px-6 py-2.5 rounded-lg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all">
                            Tìm phòng ngay
                        </Link>
                    </div>
                ) : (
                    displayedContracts.map((contract: any, index: number) => {
                        const status = Number(contract.status);
                        const statusInfo = getStatusText(status);
                        const isActive = status === 1;
                        const isPending = status === 0;
                        const room = allRooms.find(r => r.id === Number(contract.roomId));
                        const isTenant = address?.toLowerCase() === contract.tenant.toLowerCase();
                        const isLandlord = address?.toLowerCase() === contract.landlord.toLowerCase();
                        const dueDate = Number(contract.nextPaymentDueDate);
                        const isOverdue = isActive && Math.floor(Date.now() / 1000) > dueDate + (5 * 24 * 60 * 60);
                        const dueDateFormatted = dueDate > 0 ? new Date(dueDate * 1000).toLocaleDateString('vi-VN') : "Chưa có";

                        return (
                            <div key={index} className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center">
                                {/* Left Status Indicator Accent */}
                                {isActive && !isOverdue && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                )}
                                {isActive && isOverdue && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                                )}
                                {isPending && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                                )}

                                <div className="flex-1 w-full text-left">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <span className="font-mono text-sm font-bold text-on-surface">CT-{contract.id.toString().padStart(4, '0')}</span>
                                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color}`}>
                                            {statusInfo.icon} {statusInfo.text}
                                        </span>
                                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border bg-surface-container text-on-surface-variant border-black/5 dark:border-white/5">
                                            Vai trò: {isTenant ? 'Khách thuê' : 'Chủ nhà'}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-headline font-bold mb-1">{room?.title || `Phòng số #${contract.roomId}`}</h3>
                                    <p className="text-sm text-on-surface-variant mb-6">{room?.location || "Địa chỉ chưa cập nhật"}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-black/5 dark:border-white/5">
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Tiền cọc</p>
                                            <p className="font-mono text-sm font-bold text-on-surface">{formatOasis(contract.deposit)} OASIS</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Tiền thuê</p>
                                            <p className="font-mono text-sm font-bold text-primary">{formatOasis(contract.rentPrice)} OASIS/tháng</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Đối tác ({isTenant ? 'Chủ nhà' : 'Khách'})</p>
                                            <p className="font-mono text-xs text-secondary/80 truncate" title={isTenant ? contract.landlord : contract.tenant}>
                                                {isTenant ? contract.landlord.slice(0,6)+'...'+contract.landlord.slice(-4) : contract.tenant.slice(0,6)+'...'+contract.tenant.slice(-4)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Hạn thanh toán</p>
                                            <p className={`font-mono text-xs flex items-center gap-1 font-bold ${isOverdue ? 'text-red-500' : 'text-on-surface'}`}>
                                                {isActive ? dueDateFormatted : "Chưa bắt đầu"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Actions Pane */}
                                <div className="w-full md:w-64 shrink-0 flex flex-col md:items-end justify-center pt-6 z-10 md:pt-0 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 md:pl-8">
                                    {isTenant && isActive && (
                                        <>
                                            <div className="text-left md:text-right mb-4 w-full flex md:flex-col justify-between md:justify-start items-center md:items-end">
                                                <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-1 flex items-center md:justify-end gap-1.5">
                                                    <AlertCircle size={14} className="text-tertiary" /> Trả tiền
                                                </p>
                                                <p className="font-medium text-sm text-on-surface-variant">Tới hạn hàng tháng</p>
                                            </div>
                                            <Link
                                                to={`/pay/${contract.id}`}
                                                className="w-full bg-gradient-to-r text-center from-primary to-primary-dim text-on-primary-fixed py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,164,255,0.3)] transition-all flex items-center justify-center gap-2"
                                            >
                                                Thanh toán <ArrowRight size={16} />
                                            </Link>
                                        </>
                                    )}

                                    {isLandlord && isActive && isOverdue && (
                                        <div className="w-full flex flex-col gap-3">
                                            <div className="text-left md:text-right mb-2 w-full">
                                                <p className="text-xs uppercase font-bold tracking-widest text-red-500 mb-1 flex items-center md:justify-end gap-1.5">
                                                    <AlertCircle size={14} /> Quá hạn 5 ngày
                                                </p>
                                                <p className="font-medium text-xs text-on-surface-variant">Khách chưa trả tiền</p>
                                            </div>
                                            <button 
                                                disabled={txPending || txWaiting}
                                                onClick={() => thuHoiCocDoViPham(Number(contract.id))}
                                                className="w-full flex justify-center items-center gap-2 bg-red-500 text-white py-3 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {(txPending || txWaiting) ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                Chấm Dứt & Thu Cọc
                                            </button>
                                        </div>
                                    )}

                                    {isLandlord && isPending && (
                                        <div className="w-full flex flex-col gap-3">
                                            <button 
                                                disabled={txPending || txWaiting}
                                                onClick={() => duyetThuePhong(Number(contract.id))}
                                                className="w-full flex justify-center items-center gap-2 bg-green-500 text-white py-3 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-green-600 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {(txPending || txWaiting) ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                                Duyệt Hợp Đồng
                                            </button>
                                            <button 
                                                disabled={txPending || txWaiting}
                                                onClick={() => tuChoiThuePhong(Number(contract.id))}
                                                className="w-full flex justify-center items-center gap-2 border border-red-500/50 text-red-500 py-2.5 rounded-xl font-label text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Từ Chối
                                            </button>
                                        </div>
                                    )}

                                    {isTenant && isPending && (
                                        <div className="text-center w-full">
                                            <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                                            <p className="text-sm font-bold text-orange-500">Đang chờ chủ nhà duyệt</p>
                                        </div>
                                    )}

                                    {(!isActive && !isPending) || (isLandlord && isActive) ? (
                                        <button className="w-full bg-surface-container-highest border border-black/10 dark:border-white/10 text-on-surface-variant py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 hover:text-on-surface transition-all">
                                            Xem Chi Tiết
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
