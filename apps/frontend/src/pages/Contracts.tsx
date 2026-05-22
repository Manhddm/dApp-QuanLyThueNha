import { Link } from "react-router-dom";
import { FileSignature, AlertCircle, ArrowRight, CheckCircle2, Clock, XCircle, ShieldCheck, Loader2, Check, X, History, FileText, Copy, Stamp } from "lucide-react";
import { formatOasis } from "../lib/utils";
import { useRentHouse, rentHouseAddress } from "../hooks/useRentHouse";
import { useRooms } from "../hooks/useRooms";
import { useAccount, useReadContract } from "wagmi";
import RentHouseABI from '../abi/RentHouse.json';
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// Sub-component for rendering each contract card to handle dynamic wagmi reads independently
function ContractCard({ 
    contract, 
    allRooms, 
    address, 
    txPending, 
    txWaiting, 
    onDuyetThue, 
    onTuChoiThue, 
    onThuHoiCoc, 
    onTraPhong, 
    onViewDetails,
    getStatusText,
    isHistory = false
}: any) {
    const status = Number(contract.status);
    const statusInfo = getStatusText(status);
    const isActive = status === 1;
    const isPending = status === 0;
    const room = allRooms.find((r: any) => r.id === Number(contract.roomId));
    const isTenant = address?.toLowerCase() === contract.tenant.toLowerCase();
    const isLandlord = address?.toLowerCase() === contract.landlord.toLowerCase();
    const dueDate = Number(contract.nextPaymentDueDate);
    const isOverdue = isActive && Math.floor(Date.now() / 1000) > dueDate + 15;
    const dueDateFormatted = dueDate > 0 ? new Date(dueDate * 1000).toLocaleString('vi-VN') : "Chưa có";

    // Lấy YYYYMM hiện tại (ví dụ: 202605)
    const today = new Date();
    const currentPeriod = today.getFullYear() * 100 + (today.getMonth() + 1);

    // Đọc trạng thái thanh toán từ Smart Contract
    const { data: isPaidThisPeriod } = useReadContract({
        address: rentHouseAddress,
        abi: RentHouseABI.abi,
        functionName: 'paymentTracking',
        args: [BigInt(contract.id), BigInt(currentPeriod)],
    });

    return (
        <div className={`glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center transition-all ${isHistory ? 'opacity-70 hover:opacity-95 bg-surface-container-lowest/40' : ''}`}>
            {/* Left Status Indicator Accent */}
            {!isHistory && isActive && !isOverdue && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
            )}
            {!isHistory && isActive && isOverdue && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            )}
            {!isHistory && isPending && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
            )}
            {isHistory && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-on-surface/20"></div>
            )}

            <div className="flex-1 w-full text-left">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="font-mono text-sm font-bold text-on-surface opacity-60">CT-{contract.id.toString().padStart(4, '0')}</span>
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border flex items-center gap-1 ${statusInfo.bg} ${statusInfo.color}`}>
                        {statusInfo.icon} {statusInfo.text}
                    </span>
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border bg-surface-container text-on-surface-variant border-black/5 dark:border-white/5 opacity-80">
                        Vai trò: {isTenant ? 'Khách thuê' : 'Chủ nhà'}
                    </span>
                </div>
                <h3 className="text-2xl font-headline font-bold mb-1">{room?.title || `Phòng số #${contract.roomId}`}</h3>
                <p className="text-sm text-on-surface-variant mb-6">{room?.location || "Địa chỉ chưa cập nhật"}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-black/5 dark:border-white/5">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1 opacity-75">Tiền cọc</p>
                        <p className="font-mono text-sm font-bold text-on-surface opacity-90">{formatOasis(contract.deposit)} OASIS</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1 opacity-75">Tiền thuê</p>
                        <p className="font-mono text-sm font-bold text-primary opacity-90">{formatOasis(contract.rentPrice)} OASIS/tháng</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1 opacity-75">Đối tác ({isTenant ? 'Chủ nhà' : 'Khách'})</p>
                        <p className="font-mono text-xs text-secondary/80 truncate opacity-90" title={isTenant ? contract.landlord : contract.tenant}>
                            {isTenant ? contract.landlord.slice(0,6)+'...'+contract.landlord.slice(-4) : contract.tenant.slice(0,6)+'...'+contract.tenant.slice(-4)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1 opacity-75">Hạn thanh toán</p>
                        <p className={`font-mono text-xs flex items-center gap-1 font-bold ${isActive && isOverdue ? 'text-red-500 animate-pulse' : 'text-on-surface'}`}>
                            {isActive ? dueDateFormatted : "Đã kết thúc"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Actions Pane */}
            <div className="w-full md:w-64 shrink-0 flex flex-col md:items-end justify-center pt-6 z-10 md:pt-0 border-t md:border-t-0 md:border-l border-black/5 dark:border-white/5 md:pl-8">
                {isTenant && isActive && !isHistory && (
                    <div className="w-full flex flex-col gap-3">
                        <div className="text-left md:text-right mb-1 w-full flex md:flex-col justify-between md:justify-start items-center md:items-end">
                            <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-1 flex items-center md:justify-end gap-1.5">
                                {isPaidThisPeriod ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-tertiary" />}
                                Trạng thái kỳ này
                            </p>
                            <p className="font-medium text-xs text-on-surface-variant">
                                {isPaidThisPeriod ? 'Đã thanh toán tiền phòng' : 'Chưa thanh toán'}
                            </p>
                        </div>
                        {isPaidThisPeriod ? (
                            <button 
                                disabled
                                className="w-full bg-green-500/10 text-green-500 border border-green-500/20 py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                            >
                                Đã đóng tiền kỳ này <CheckCircle2 size={16} />
                            </button>
                        ) : (
                            <Link
                                to={`/pay/${contract.id}`}
                                className="w-full bg-gradient-to-r text-center from-primary to-primary-dim text-on-primary-fixed py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,164,255,0.3)] transition-all flex items-center justify-center gap-2"
                            >
                                Thanh toán <ArrowRight size={16} />
                            </Link>
                        )}
                        <button 
                            disabled={txPending || txWaiting}
                            onClick={() => onTraPhong(Number(contract.id), Number(contract.roomId))}
                            className="w-full border border-red-500/50 hover:bg-red-500/10 text-red-500 py-2.5 rounded-xl font-label text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                            Trả phòng & Nhận lại cọc
                        </button>
                    </div>
                )}

                {isLandlord && isActive && !isHistory && (
                    <div className="w-full flex flex-col gap-3">
                        <div className="text-left md:text-right mb-1 w-full flex md:flex-col justify-between md:justify-start items-center md:items-end">
                            <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-1 flex items-center md:justify-end gap-1.5">
                                {isPaidThisPeriod ? <CheckCircle2 size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-orange-500" />}
                                Kỳ đóng tiền
                            </p>
                            <p className="font-medium text-xs text-on-surface-variant">
                                {isPaidThisPeriod ? 'Khách đã thanh toán' : 'Khách chưa thanh toán'}
                            </p>
                        </div>
                        {isOverdue ? (
                            <button 
                                disabled={txPending || txWaiting}
                                onClick={() => onThuHoiCoc(Number(contract.id), Number(contract.roomId))}
                                className="w-full flex justify-center items-center gap-2 bg-red-500 text-white py-3 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
                            >
                                {(txPending || txWaiting) ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                Chấm Dứt & Thu Cọc ⚠️
                            </button>
                        ) : (
                            <button 
                                disabled={txPending || txWaiting}
                                onClick={() => onTraPhong(Number(contract.id), Number(contract.roomId))}
                                className="w-full border border-red-500/50 hover:bg-red-500/10 text-red-500 py-2.5 rounded-xl font-label text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                Trả phòng & Trả lại cọc
                            </button>
                        )}
                    </div>
                )}

                {isLandlord && isPending && !isHistory && (
                    <div className="w-full flex flex-col gap-3">
                        <button 
                            disabled={txPending || txWaiting}
                            onClick={() => onDuyetThue(Number(contract.id), Number(contract.roomId))}
                            className="w-full flex justify-center items-center gap-2 bg-green-500 text-white py-3 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-green-600 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {(txPending || txWaiting) ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                            Duyệt Hợp Đồng
                        </button>
                        <button 
                            disabled={txPending || txWaiting}
                            onClick={() => onTuChoiThue(Number(contract.id), Number(contract.roomId))}
                            className="w-full flex justify-center items-center gap-2 border border-red-500/50 text-red-500 py-2.5 rounded-xl font-label text-xs font-bold uppercase tracking-wider hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Từ Chối
                        </button>
                    </div>
                )}

                {isTenant && isPending && !isHistory && (
                    <div className="text-center w-full">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
                        <p className="text-sm font-bold text-orange-500">Đang chờ chủ nhà duyệt</p>
                    </div>
                )}

                <button 
                    onClick={() => onViewDetails(contract)}
                    className="w-full mt-3 bg-surface-container-highest border border-black/10 dark:border-white/10 text-on-surface-variant py-2.5 rounded-xl font-label text-xs font-bold uppercase tracking-wider hover:bg-black/5 dark:hover:bg-white/5 hover:text-on-surface transition-all flex items-center justify-center gap-1.5"
                >
                    <FileText size={14} />
                    Xem Chi Tiết HĐ
                </button>
            </div>
        </div>
    );
}

export default function Contracts() {
    const { address } = useAccount();
    const { 
        myContracts, 
        duyetThuePhong, 
        tuChoiThuePhong, 
        thuHoiCocDoViPham, 
        traPhong,
        refetchMyContracts,
        isPending: txPending, 
        isWaiting: txWaiting 
    } = useRentHouse();
    const { allRooms, loading: roomsLoading, refreshRooms } = useRooms();
    const { token } = useAuth();

    // Modals & Action States
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState<{show: boolean, title: string, message: string} | null>(null);
    const [viewingContract, setViewingContract] = useState<any | null>(null);

    // Landlord & Tenant details retrieved dynamically from DB
    const [landlordInfo, setLandlordInfo] = useState<any | null>(null);
    const [tenantInfo, setTenantInfo] = useState<any | null>(null);
    const [infoLoading, setInfoLoading] = useState(false);

    // Map status enum to string
    const getStatusText = (statusNum: number) => {
        switch(statusNum) {
            case 0: return { text: "Chờ Duyệt", color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", icon: <Clock size={14} className="text-orange-500" />, stamp: "CHỜ DUYỆT", stampColor: "border-amber-500/60 text-amber-600/35" };
            case 1: return { text: "Đang Thuê", color: "text-green-500", bg: "bg-green-500/10 border-green-500/20", icon: <CheckCircle2 size={14} className="text-green-500" />, stamp: "ĐANG HIỆU LỰC", stampColor: "border-emerald-500/70 text-emerald-600/40" };
            case 2: return { text: "Đã Kết Thúc", color: "text-gray-400", bg: "bg-gray-500/5 border-gray-500/10", icon: <CheckCircle2 size={14} className="text-gray-400" />, stamp: "ĐÃ TẤT TOÁN", stampColor: "border-slate-400/60 text-slate-500/35" };
            case 3: return { text: "Đã Từ Chối", color: "text-red-500/80", bg: "bg-red-500/5 border-red-500/10", icon: <XCircle size={14} className="text-red-500/80" />, stamp: "ĐÃ HỦY BỎ", stampColor: "border-rose-400/50 text-rose-500/30" };
            case 4: return { text: "Bị Đuổi / Thu Cọc", color: "text-red-600/80", bg: "bg-red-600/5 border-red-600/10", icon: <XCircle size={14} className="text-red-600/80" />, stamp: "THU HỒI CỌC", stampColor: "border-rose-600/70 text-rose-600/40" };
            default: return { text: "Unknown", color: "text-gray-500", bg: "bg-gray-500/10 border-gray-500/20", icon: null, stamp: "CHƯA XÁC ĐỊNH", stampColor: "border-gray-500/40 text-gray-500/30" };
        }
    };

    // Fetch user details when contract details open
    useEffect(() => {
        if (!viewingContract || !token) {
            setLandlordInfo(null);
            setTenantInfo(null);
            return;
        }

        const fetchDetails = async () => {
            setInfoLoading(true);
            try {
                // Fetch Landlord Info
                const resL = await fetch(`http://localhost:3000/api/auth/user/${viewingContract.landlord}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const dataL = await resL.json();
                if (dataL.success) setLandlordInfo(dataL.data);

                // Fetch Tenant Info
                const resT = await fetch(`http://localhost:3000/api/auth/user/${viewingContract.tenant}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const dataT = await resT.json();
                if (dataT.success) setTenantInfo(dataT.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin chi tiết các bên:", error);
            } finally {
                setInfoLoading(false);
            }
        };

        fetchDetails();
    }, [viewingContract, token]);

    // Copy to clipboard helper
    const handleCopyAddress = (addr: string) => {
        navigator.clipboard.writeText(addr);
        alert("Đã sao chép địa chỉ ví: " + addr);
    };

    // --- CUSTOM ACTION HANDLERS WITH DB SYNC ---

    const handleDuyetThue = async (contractId: number, roomId: number) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn duyệt yêu cầu thuê phòng này không?");
        if (!confirm) return;

        setActionLoading(true);
        try {
            await duyetThuePhong(contractId);
            await new Promise(res => setTimeout(res, 5000));

            // Sync database: set status to 'da_thue'
            await fetch(`http://localhost:3000/api/bat-dong-san/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ trang_thai: "da_thue" })
            });

            setActionSuccess({
                show: true,
                title: "Duyệt yêu cầu thành công!",
                message: "Hợp đồng đã kích hoạt trên Blockchain. Phòng đã chuyển sang trạng thái 'Đã cho thuê'."
            });
        } catch (err: any) {
            console.error("Duyet that bai:", err);
            alert("Giao dịch thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleTuChoiThue = async (contractId: number, roomId: number) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn TỪ CHỐI yêu cầu thuê và HOÀN LẠI TIỀN CỌC cho khách thuê không?");
        if (!confirm) return;

        setActionLoading(true);
        try {
            await tuChoiThuePhong(contractId);
            await new Promise(res => setTimeout(res, 5000));

            setActionSuccess({
                show: true,
                title: "Đã từ chối yêu cầu!",
                message: "Tiền đặt cọc đã được hoàn trả lại ví khách thuê thành công."
            });
        } catch (err: any) {
            console.error("Tu choi that bai:", err);
            alert("Giao dịch thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleThuHoiCoc = async (contractId: number, roomId: number) => {
        const confirm = window.confirm("CẢNH BÁO: Khách thuê đang quá hạn thanh toán! Bạn có chắc chắn muốn CHẤM DỨT HỢP ĐỒNG và THU TOÀN BỘ TIỀN CỌC về ví của mình không?");
        if (!confirm) return;

        setActionLoading(true);
        try {
            await thuHoiCocDoViPham(contractId);
            await new Promise(res => setTimeout(res, 5000));

            // Sync database: set status to 'trong'
            await fetch(`http://localhost:3000/api/bat-dong-san/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ trang_thai: "trong" })
            });

            setActionSuccess({
                show: true,
                title: "Thu hồi cọc thành công! ⚠️",
                message: "Hợp đồng đã bị chấm dứt cưỡng chế. Toàn bộ tiền cọc đã được chuyển về ví của bạn để đền bù. Phòng hiện đã được giải phóng sang trạng thái trống."
            });
        } catch (err: any) {
            console.error("Evict failed:", err);
            alert("Giao dịch thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
        }
    };

    const handleTraPhong = async (contractId: number, roomId: number) => {
        const confirm = window.confirm("Bạn có chắc chắn muốn TẤT TOÁN HỢP ĐỒNG (Trả phòng) và HOÀN LẠI TOÀN BỘ TIỀN CỌC cho khách thuê không?");
        if (!confirm) return;

        setActionLoading(true);
        try {
            await traPhong(contractId);
            await new Promise(res => setTimeout(res, 5000));

            // Sync database: set status to 'trong'
            await fetch(`http://localhost:3000/api/bat-dong-san/${roomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ trang_thai: "trong" })
            });

            setActionSuccess({
                show: true,
                title: "Tất toán hợp đồng thành công!",
                message: "Hợp đồng kết thúc êm đẹp trên Blockchain. Toàn bộ tiền cọc đã hoàn lại ví khách thuê. Phòng đã được đưa về trạng thái trống."
            });
        } catch (err: any) {
            console.error("Tra phong that bai:", err);
            alert("Giao dịch thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
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

    // Phân loại hợp đồng: Hoạt động (Pending hoặc Active) vs Lịch sử (Ended, Rejected, Evicted)
    const activeContracts = displayedContracts.filter(c => Number(c.status) === 0 || Number(c.status) === 1);
    const historyContracts = displayedContracts.filter(c => Number(c.status) > 1);

    // Phòng đang xem chi tiết
    const viewingRoom = viewingContract ? allRooms.find((r: any) => r.id === Number(viewingContract.roomId)) : null;
    const viewingStatusInfo = viewingContract ? getStatusText(Number(viewingContract.status)) : null;

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full relative">
            {/* Loading Modal */}
            {actionLoading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
                    <div className="flex flex-col items-center text-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Đang xử lý trên Blockchain...</h3>
                        <p className="text-on-surface-variant max-w-md">Vui lòng xác nhận giao dịch trên ví MetaMask của bạn và đợi block được mined. Không tải lại trang.</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {actionSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/85 backdrop-blur-sm">
                    <div className="bg-surface-container-high border border-black/10 dark:border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 animate-bounce shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-headline font-bold mb-3 text-on-surface">{actionSuccess.title}</h3>
                        <p className="text-on-surface-variant mb-6 text-sm">{actionSuccess.message}</p>
                        <button 
                            onClick={async () => {
                                setActionSuccess(null);
                                if (refetchMyContracts) await refetchMyContracts();
                                if (refreshRooms) await refreshRooms();
                            }}
                            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-glow transition-all"
                        >
                            Xong & Đồng bộ dữ liệu
                        </button>
                    </div>
                </div>
            )}

            {/* Electronic Contract View Modal (PREMIUM WHITE & BLUE THEME) */}
            {viewingContract && viewingStatusInfo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    <div className="bg-[#FFFFFF] text-slate-800 border-2 border-blue-100 rounded-3xl w-full max-w-3xl shadow-2xl relative my-8 overflow-hidden">
                        
                        {/* Digital Stamp Overlay (Positioned absolutely inside the white paper) */}
                        <div className={`absolute top-24 right-12 w-48 h-48 rounded-full border-4 border-dashed flex items-center justify-center font-bold tracking-widest text-center text-lg select-none pointer-events-none transform rotate-12 ${viewingStatusInfo.stampColor} z-10`}>
                            <div className="flex flex-col items-center justify-center">
                                <span>SMART CONTRACT</span>
                                <span className="text-xl my-1">{viewingStatusInfo.stamp}</span>
                                <span className="text-[9px]">OASIS NETWORK</span>
                            </div>
                        </div>

                        {/* Modal Header (Dark Slate/Blue Premium Header) */}
                        <div className="p-6 md:p-8 bg-[#0F172A] text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="w-6 h-6 text-blue-400" />
                                <div>
                                    <h3 className="text-lg font-bold uppercase tracking-wider text-white">Hợp Đồng Thuê Nhà Điện Tử</h3>
                                    <p className="text-[11px] font-mono text-slate-400">Mã hợp đồng: CT-{viewingContract.id.toString().padStart(4, '0')}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setViewingContract(null)}
                                className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* White & Blue Paper Document Container */}
                        <div className="p-6 md:p-8 space-y-6 max-h-[65vh] overflow-y-auto scrollbar-thin bg-[#F8FAFC]">
                            
                            {/* Legal Paper Header */}
                            <div className="text-center space-y-1 py-4 border-b border-dashed border-blue-200">
                                <h4 className="font-headline text-base font-bold text-slate-800 tracking-wider">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                                <p className="text-xs font-bold text-slate-600">Độc lập - Tự do - Hạnh phúc</p>
                                <p className="text-[11px] italic text-slate-400">***</p>
                                <h5 className="font-headline text-xl font-extrabold text-blue-900 pt-3">HỢP ĐỒNG THUÊ PHÒNG TIÊU CHUẨN</h5>
                            </div>

                            {/* Section 1: Wallet Addresses & User Information */}
                            <div className="space-y-3">
                                <h6 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-3 bg-blue-600 rounded-sm"></span>
                                    1. Các bên tham gia hợp đồng
                                </h6>
                                
                                {infoLoading ? (
                                    <div className="flex flex-col items-center justify-center py-8 bg-white rounded-xl border border-blue-100 shadow-sm text-slate-400">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Đang truy xuất thông tin tư pháp...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Landlord Card */}
                                        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">Bên A (Chủ nhà)</p>
                                                    <p className="text-base font-bold text-slate-800 pt-0.5">{landlordInfo?.ho_ten || "Chưa cập nhật họ tên"}</p>
                                                </div>
                                                <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 rounded">
                                                    ĐÃ XÁC THỰC
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                                                <p><strong>Số CCCD:</strong> {landlordInfo?.so_cccd || "037093014921"}</p>
                                                <p><strong>Số điện thoại:</strong> {landlordInfo?.so_dien_thoai || "0981 234 567"}</p>
                                                <p className="md:col-span-2"><strong>Email liên hệ:</strong> {landlordInfo?.email || "chunya@email.com"}</p>
                                            </div>

                                            <div className="border-t border-dashed border-slate-200 my-2 pt-2.5 flex justify-between items-center gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Địa chỉ ví Blockchain đại diện</p>
                                                    <p className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 truncate break-all">{viewingContract.landlord}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopyAddress(viewingContract.landlord)}
                                                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-all shrink-0 border border-slate-100"
                                                    title="Copy ví chủ nhà"
                                                >
                                                    <Copy size={13} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Tenant Card */}
                                        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] text-blue-600 uppercase font-bold tracking-widest">Bên B (Khách thuê)</p>
                                                    <p className="text-base font-bold text-slate-800 pt-0.5">{tenantInfo?.ho_ten || "Chưa cập nhật họ tên"}</p>
                                                </div>
                                                <span className="px-2 py-0.5 text-[9px] font-bold bg-green-500/10 text-green-600 border border-green-500/20 rounded">
                                                    ĐÃ XÁC THỰC
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                                                <p><strong>Số CCCD:</strong> {tenantInfo?.so_cccd || "037095123490"}</p>
                                                <p><strong>Số điện thoại:</strong> {tenantInfo?.so_dien_thoai || "0912 345 678"}</p>
                                                <p className="md:col-span-2"><strong>Email liên hệ:</strong> {tenantInfo?.email || "khachthue@email.com"}</p>
                                            </div>

                                            <div className="border-t border-dashed border-slate-200 my-2 pt-2.5 flex justify-between items-center gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[9px] text-slate-400 uppercase font-bold">Địa chỉ ví Blockchain đại diện</p>
                                                    <p className="font-mono text-[10px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100 truncate break-all">{viewingContract.tenant}</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleCopyAddress(viewingContract.tenant)}
                                                    className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-slate-400 transition-all shrink-0 border border-slate-100"
                                                    title="Copy ví khách thuê"
                                                >
                                                    <Copy size={13} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 2: Property Details */}
                            <div className="space-y-3">
                                <h6 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-3 bg-blue-600 rounded-sm"></span>
                                    2. Thông tin tài sản thuê
                                </h6>
                                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm space-y-2.5 text-sm text-slate-700">
                                    <p><strong className="text-slate-500 font-semibold">Tên bất động sản:</strong> <span className="font-bold text-slate-800">{viewingRoom?.title || `Phòng số #${viewingContract.roomId}`}</span></p>
                                    <p><strong className="text-slate-500 font-semibold">Địa điểm:</strong> <span className="text-slate-800">{viewingRoom?.location || "Chưa cập nhật địa chỉ"}</span></p>
                                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                                        <p><strong className="text-slate-500 font-semibold">Diện tích:</strong> <span className="font-bold text-slate-800">{viewingRoom?.dien_tich || 30} m²</span></p>
                                        <p><strong className="text-slate-500 font-semibold">Cơ cấu phòng:</strong> <span className="font-bold text-slate-800">{viewingRoom?.so_phong_ngu || 1} Bed</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Financial Terms */}
                            <div className="space-y-3">
                                <h6 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-3 bg-blue-600 rounded-sm"></span>
                                    3. Giá thuê và giá trị đặt cọc
                                </h6>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tiền đặt cọc</p>
                                        <p className="font-mono text-xl font-extrabold text-blue-900">{formatOasis(viewingContract.deposit)} OASIS</p>
                                        <p className="text-[9px] text-slate-400 italic mt-0.5">Khóa trên Smart Contract</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm text-center">
                                        <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Giá thuê hàng tháng</p>
                                        <p className="font-mono text-xl font-extrabold text-blue-600">{formatOasis(viewingContract.rentPrice)} OASIS</p>
                                        <p className="text-[9px] text-slate-400 italic mt-0.5">Thanh toán định kỳ</p>
                                    </div>
                                </div>
                            </div>

                            {/* Legality Clause */}
                            <div className="space-y-2 text-[11px] text-slate-400 text-justify leading-relaxed border-t border-slate-200 pt-4">
                                <p><strong>Điều khoản thi hành:</strong> Hợp đồng này được mã hóa, bảo mật tuyệt đối và thực thi tự động dưới dạng Smart Contract tại địa chỉ ví <strong>{rentHouseAddress}</strong> trên mạng lưới blockchain <strong>Oasis Sapphire</strong>. </p>
                                <p>Mọi hành vi vi phạm thời hạn thanh toán quá hạn (được rút gọn còn 15 giây cho mục đích demo) sẽ trao quyền cưỡng chế thu hồi cọc cho bên A. Mọi giao dịch tất toán đều tự động hoàn trả cọc trực tiếp về ví của bên B.</p>
                            </div>
                        </div>

                        {/* Modal Footer (White Slate Premium Bottom Panel) */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                            <button 
                                onClick={() => handleCopyAddress(rentHouseAddress)}
                                className="flex-1 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
                            >
                                <Stamp size={14} className="text-blue-600" />
                                Xem Ví Contract
                            </button>
                            <button 
                                onClick={() => setViewingContract(null)}
                                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-md shadow-blue-500/20"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Section 1: Active Contracts */}
            <div className="space-y-6">
                <h2 className="text-xl font-headline font-bold text-on-background flex items-center gap-2 mb-6">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    Hợp đồng đang thực hiện ({activeContracts.length})
                </h2>

                {activeContracts.length === 0 ? (
                    <div className="text-center py-16 glass-panel rounded-2xl border border-black/5 dark:border-white/5 mb-12">
                        <FileSignature className="w-12 h-12 text-on-surface-variant/30 mx-auto mb-4" />
                        <h3 className="text-lg font-bold mb-2">Không có hợp đồng hoạt động</h3>
                        <p className="text-on-surface-variant text-sm">Bạn chưa có giao dịch thuê nhà nào đang diễn ra.</p>
                        <Link to="/rooms" className="mt-6 inline-block bg-primary text-on-primary-fixed px-5 py-2.5 rounded-lg font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all">
                            Tìm phòng ngay
                        </Link>
                    </div>
                ) : (
                    activeContracts.map((contract: any, index: number) => (
                        <ContractCard 
                            key={`active-${index}`}
                            contract={contract}
                            allRooms={allRooms}
                            address={address}
                            txPending={txPending}
                            txWaiting={txWaiting}
                            onDuyetThue={handleDuyetThue}
                            onTuChoiThue={handleTuChoiThue}
                            onThuHoiCoc={handleThuHoiCoc}
                            onTraPhong={handleTraPhong}
                            onViewDetails={setViewingContract}
                            getStatusText={getStatusText}
                        />
                    ))
                )}
            </div>

            {/* Section 2: History Contracts */}
            {historyContracts.length > 0 && (
                <div className="mt-16 space-y-6">
                    <h2 className="text-xl font-headline font-bold text-on-background/70 flex items-center gap-2 mb-6 border-t border-black/5 dark:border-white/5 pt-10">
                        <History className="w-5 h-5 text-on-surface-variant/60" />
                        Lịch sử hợp đồng đã chấm dứt ({historyContracts.length})
                    </h2>

                    <div className="space-y-6">
                        {historyContracts.map((contract: any, index: number) => (
                            <ContractCard 
                                key={`history-${index}`}
                                contract={contract}
                                allRooms={allRooms}
                                address={address}
                                txPending={txPending}
                                txWaiting={txWaiting}
                                onDuyetThue={handleDuyetThue}
                                onTuChoiThue={handleTuChoiThue}
                                onThuHoiCoc={handleThuHoiCoc}
                                onTraPhong={handleTraPhong}
                                onViewDetails={setViewingContract}
                                getStatusText={getStatusText}
                                isHistory={true}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
