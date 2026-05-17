import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Edit, Trash2, Home, MapPin, Info, DollarSign } from "lucide-react";
import { formatOasis } from "../lib/utils";
import { Check, X, Loader2, AlertCircle } from "lucide-react";
import { useRentHouse } from "../hooks/useRentHouse";
import { formatEther } from "viem";
import { useAccount, useConnect } from "wagmi";

export default function ManageRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const { pendingContracts, duyetThuePhong, tuChoiThuePhong, isPending, isWaiting, refetchPending, writeError } = useRentHouse();
    const { isConnected } = useAccount();
    const { connectors, connect } = useConnect();

    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Modal states
    const [confirmModal, setConfirmModal] = useState<{show: boolean, type: 'approve' | 'reject', contractId: number, title: string, message: string} | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState<{show: boolean, title: string, message: string} | null>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`);
                const data = await res.json();
                if (data.success) {
                    setRoom(data.data);
                } else {
                    setError("Không tìm thấy thông tin phòng");
                }
            } catch (err) {
                setError("Lỗi kết nối đến máy chủ");
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleConfirmAction = async () => {
        if (!confirmModal) return;
        setActionLoading(true);
        try {
            if (confirmModal.type === 'approve') {
                const txHash = await duyetThuePhong(confirmModal.contractId);
                // Sau khi tx được gửi (pending), lý ra cần chờ tx được mine (isWaiting). 
                // Tạm thời chờ 5 giây hoặc dựa vào event. (Ở bản thật nên dùng publicClient.waitForTransactionReceipt)
                await new Promise(res => setTimeout(res, 5000));
                
                // Đồng bộ Database (Trạng thái phòng -> Đã cho thuê)
                const apiRes = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ trang_thai: "da_thue" })
                });
                const apiData = await apiRes.json();
                console.log("API Update Status Response:", apiData);

                if (!apiData.success) {
                    throw new Error(`Cập nhật Database thất bại: ${apiData.message}`);
                }

                setActionSuccess({
                    show: true,
                    title: "Duyệt hợp đồng thành công",
                    message: "Phòng đã được chuyển trạng thái thành 'Đã cho thuê'."
                });
            } else {
                await tuChoiThuePhong(confirmModal.contractId);
                await new Promise(res => setTimeout(res, 5000));
                
                setActionSuccess({
                    show: true,
                    title: "Từ chối hợp đồng thành công",
                    message: "Đã hoàn trả tiền cọc lại cho khách thuê."
                });
            }
            refetchPending();
            // Refetch room data to update status UI
            const res = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`);
            const data = await res.json();
            if (data.success) setRoom(data.data);
            
        } catch (err: any) {
            console.error("Action failed", err);
            alert("Giao dịch thất bại: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
            setConfirmModal(null);
        }
    };

    const handleDelete = async () => {
        const confirm = window.confirm("Bạn có chắc chắn muốn xóa phòng này? Dữ liệu không thể khôi phục.");
        if (!confirm) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                alert("Đã xóa phòng thành công");
                navigate("/dashboard");
            } else {
                alert(data.message || "Lỗi xóa phòng");
            }
        } catch (err) {
            alert("Lỗi kết nối");
        } finally {
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto px-6 py-12 text-center text-on-surface-variant animate-pulse">Đang tải thông tin...</div>;
    }

    if (error || !room) {
        return <div className="max-w-4xl mx-auto px-6 py-12 text-center text-red-400">{error}</div>;
    }

    let tienNghi = { phong_ngu: 1, nha_ve_sinh: 1, bep: true };
    try {
        if (room.tien_nghi) {
            tienNghi = typeof room.tien_nghi === 'string' ? JSON.parse(room.tien_nghi) : room.tien_nghi;
        }
    } catch(e) {}

    const images = room.hinh_anh ? room.hinh_anh.map((h: any) => h.duong_dan_anh) : (room.anh_dai_dien ? [room.anh_dai_dien] : []);

    const roomPendingContracts = pendingContracts?.filter(c => Number(c.roomId) === Number(room.ma_bat_dong_san)) || [];

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 w-full relative">
            {/* --- MODALS --- */}
            {/* Confirm Modal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container-high border border-black/10 dark:border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setConfirmModal(null)} className="absolute top-4 right-4 text-on-surface-variant hover:text-black dark:hover:text-white"><X size={20} /></button>
                        <h3 className="text-xl font-headline font-bold mb-2 text-on-surface flex items-center gap-2">
                            {confirmModal.type === 'approve' ? <Check className="text-green-400" /> : <X className="text-error" />}
                            {confirmModal.title}
                        </h3>
                        <p className="text-on-surface-variant mb-6 text-sm">{confirmModal.message}</p>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 rounded-xl border border-black/10 dark:border-white/10 font-bold uppercase tracking-widest text-xs hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-colors">Hủy</button>
                            <button 
                                onClick={handleConfirmAction}
                                className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors text-white ${confirmModal.type === 'approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-error hover:bg-red-500'}`}
                            >
                                Xác nhận {confirmModal.type === 'approve' ? 'Duyệt' : 'Từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Modal */}
            {actionLoading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h3 className="text-xl font-bold mb-2">Đang xử lý giao dịch...</h3>
                        <p className="text-sm text-on-surface-variant max-w-sm text-center">Vui lòng xác nhận trên ví MetaMask và đợi mạng lưới Blockchain xử lý. Không đóng trình duyệt lúc này.</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {actionSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container-high border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4 animate-bounce">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-headline font-bold mb-2 text-on-surface">{actionSuccess.title}</h3>
                        <p className="text-on-surface-variant mb-6 text-sm">{actionSuccess.message}</p>
                        <button 
                            onClick={() => setActionSuccess(null)}
                            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
            {/* --- END MODALS --- */}

            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8 font-label text-xs uppercase tracking-widest"
            >
                <ArrowLeft size={16} /> Quay lại Dashboard
            </button>

            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter text-on-background mb-3">
                        Quản Lý Phòng
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="px-3 py-1 bg-surface-container-highest border border-black/10 dark:border-white/10 text-on-surface rounded-full text-xs font-medium font-mono">
                            ID: {room.ma_bat_dong_san}
                        </span>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border ${room.trang_thai === "dang_thue" ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20"}`}>
                            {room.trang_thai === "dang_thue" ? "Đã cho thuê" : "Phòng trống"}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <Link to={`/edit-room/${room.ma_bat_dong_san}`} className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-6 py-3 rounded-xl font-label font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2">
                        <Edit size={16} /> Sửa thông tin
                    </Link>
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-6 py-3 rounded-xl font-label font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <Trash2 size={16} /> {isDeleting ? "Đang xóa..." : "Xóa phòng"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Thông tin chính */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hình ảnh */}
                    {images.length > 0 ? (
                        <div className="space-y-4">
                            <div className="w-full h-[400px] rounded-2xl overflow-hidden glass-panel">
                                <img src={images[0]} alt="Main" className="w-full h-full object-cover" />
                            </div>
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.slice(1).map((src: string, idx: number) => (
                                        <div key={idx} className="h-24 rounded-xl overflow-hidden glass-panel">
                                            <img src={src} alt="Sub" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-64 rounded-2xl glass-panel flex flex-col items-center justify-center text-on-surface-variant/50">
                            <Home size={48} className="mb-4 opacity-50" />
                            <p>Không có hình ảnh</p>
                        </div>
                    )}

                    {roomPendingContracts.length > 0 && (
                        <div className="glass-card p-6 rounded-2xl border-l-4 border-primary shadow-glow/5 relative">
                            <h2 className="text-xl font-headline font-bold flex items-center gap-2 mb-6">
                                <Info size={20} className="text-primary" /> Yêu cầu thuê đang chờ duyệt
                            </h2>
                            
                            {!isConnected && (
                                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6 flex flex-col gap-3">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-orange-500 font-medium leading-relaxed">
                                            Bạn chưa kết nối ví Blockchain. Vui lòng kết nối ví của bạn để tiến hành phê duyệt hoặc từ chối yêu cầu thuê phòng.
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => connect({ connector: connectors[0] })}
                                        className="bg-orange-500 text-white py-2.5 rounded-xl font-label font-bold text-xs uppercase tracking-wider hover:bg-orange-600 active:scale-[0.98] transition-all w-full flex items-center justify-center gap-1.5 shadow-sm"
                                    >
                                        Kết nối ví ngay
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4">
                                {roomPendingContracts.map((contract: any, idx: number) => {
                                    const cId = Number(contract.id);
                                    const tenant = contract.tenant;
                                    const deposit = contract.deposit;

                                    return (
                                        <div key={idx} className="bg-surface-container-highest border border-black/5 dark:border-white/5 p-4 rounded-xl relative group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Contract ID: {cId}</p>
                                                    <p className="text-xs text-on-surface font-mono truncate max-w-[200px]">Người thuê: {tenant}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant mb-1">Tiền cọc</p>
                                                    <p className="text-primary font-bold text-sm">{formatOasis(formatEther(deposit))} OASIS</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button 
                                                    onClick={() => setConfirmModal({ show: true, type: 'approve', contractId: cId, title: 'Duyệt hợp đồng', message: `Bạn có chắc chắn muốn duyệt hợp đồng thuê phòng của khách hàng ${tenant.slice(0,6)}...${tenant.slice(-4)} không?` })}
                                                    disabled={isPending || isWaiting}
                                                    className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <Check size={16} /> Duyệt
                                                </button>
                                                <button 
                                                    onClick={() => setConfirmModal({ show: true, type: 'reject', contractId: cId, title: 'Từ chối hợp đồng', message: `Bạn có chắc chắn muốn từ chối và hoàn lại tiền cọc cho khách hàng ${tenant.slice(0,6)}...${tenant.slice(-4)} không?` })}
                                                    disabled={isPending || isWaiting}
                                                    className="flex-1 bg-error/10 hover:bg-error/20 text-error border border-error/20 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <X size={16} /> Từ chối
                                                </button>
                                            </div>
                                            {(isPending || isWaiting) && (
                                                <div className="absolute inset-0 bg-surface/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                                                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {writeError && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400">
                                    <p className="font-bold flex items-center gap-2 mb-1"><AlertCircle size={14} /> Giao dịch thất bại</p>
                                    <p className="opacity-80 break-words">{writeError.message}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="glass-card p-8 rounded-2xl mt-6 space-y-6">
                        <h2 className="text-2xl font-headline font-bold">{room.ten}</h2>
                        
                        <p className="flex items-start gap-2 text-on-surface-variant text-base">
                            <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                            {room.dia_chi}, {room.phuong_xa ? room.phuong_xa + ', ' : ''}{room.quan_huyen}, {room.thanh_pho}
                        </p>

                        <div className="w-full h-px bg-black/5 dark:bg-white/5 my-4"></div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-3 flex items-center gap-2"><Info size={16} /> Mô tả chi tiết</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                {room.mo_ta || "Chưa có mô tả chi tiết."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thống kê & Chi tiết */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 relative z-10">Tài chính</h3>
                        
                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Giá thuê (OASIS/Tháng)</p>
                                <p className="text-3xl font-headline font-bold text-primary">{formatOasis(room.gia_thue)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Tiền cọc yêu cầu (OASIS)</p>
                                <p className="text-2xl font-headline font-bold text-on-surface">{formatOasis(room.tien_dat_coc)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card rounded-2xl p-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Thông số phòng</h3>
                        
                        <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                            <span className="text-sm text-on-surface-variant">Diện tích</span>
                            <span className="text-sm font-bold">{room.dien_tich} m²</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                            <span className="text-sm text-on-surface-variant">Người tối đa</span>
                            <span className="text-sm font-bold">{room.so_nguoi_toi_da} người</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                            <span className="text-sm text-on-surface-variant">Phòng ngủ</span>
                            <span className="text-sm font-bold">{tienNghi.phong_ngu || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-black/5 dark:border-white/5">
                            <span className="text-sm text-on-surface-variant">Phòng vệ sinh</span>
                            <span className="text-sm font-bold">{tienNghi.nha_ve_sinh || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-sm text-on-surface-variant">Khu vực bếp</span>
                            <span className="text-sm font-bold">{tienNghi.bep ? "Có" : "Không"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



