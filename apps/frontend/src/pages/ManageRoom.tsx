import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Edit, Trash2, Home, MapPin, Info, DollarSign } from "lucide-react";
import { formatOasis } from "../lib/utils";

export default function ManageRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

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

    return (
        <div className="max-w-5xl mx-auto px-6 py-12 w-full">
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
                        <span className="px-3 py-1 bg-surface-container-highest border border-white/10 text-on-surface rounded-full text-xs font-medium font-mono">
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

                    <div className="glass-card p-8 rounded-2xl mt-6 space-y-6">
                        <h2 className="text-2xl font-headline font-bold">{room.ten}</h2>
                        
                        <p className="flex items-start gap-2 text-on-surface-variant text-base">
                            <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                            {room.dia_chi}, {room.phuong_xa ? room.phuong_xa + ', ' : ''}{room.quan_huyen}, {room.thanh_pho}
                        </p>

                        <div className="w-full h-px bg-white/5 my-4"></div>

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
                        
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-on-surface-variant">Diện tích</span>
                            <span className="text-sm font-bold">{room.dien_tich} m²</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-on-surface-variant">Người tối đa</span>
                            <span className="text-sm font-bold">{room.so_nguoi_toi_da} người</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-sm text-on-surface-variant">Phòng ngủ</span>
                            <span className="text-sm font-bold">{tienNghi.phong_ngu || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
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
