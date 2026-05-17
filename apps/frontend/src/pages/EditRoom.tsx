import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Home, MapPin, Info, DollarSign, UploadCloud, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet, Loader2 } from "lucide-react";
import LocationPicker from "../components/LocationPicker";

export default function EditRoom() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { address, isConnected } = useAccount();
    const { connectors, connect, isPending: isConnecting } = useConnect();
    
    const [formData, setFormData] = useState({
        ten: "",
        thanh_pho: "",
        quan_huyen: "",
        dia_chi: "",
        dien_tich: "",
        so_nguoi_toi_da: 2,
        mo_ta: "",
        gia_thue: "",
        tien_dat_coc: "",
        vi_chu_nha: "",
        anh_phu: [] as string[],
        so_phong_ngu: 1,
        selectedAmenities: [] as string[],
        vi_do: null as number | null,
        kinh_do: null as number | null,
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`);
                const data = await res.json();
                if (data.success) {
                    const r = data.data;
                    let selectedAmenities: string[] = [];
                    if (r.tien_nghi) {
                        try {
                            const parsed = typeof r.tien_nghi === 'string' ? JSON.parse(r.tien_nghi) : r.tien_nghi;
                            if (Array.isArray(parsed)) {
                                selectedAmenities = parsed;
                            } else if (typeof parsed === 'object') {
                                // Backward compatibility for old format
                                selectedAmenities = Object.keys(parsed).filter(k => parsed[k] === true);
                            }
                        } catch(e) {}
                    }

                    setFormData({
                        ten: r.ten || "",
                        thanh_pho: r.thanh_pho || "",
                        quan_huyen: r.quan_huyen || "",
                        dia_chi: r.dia_chi || "",
                        dien_tich: r.dien_tich?.toString() || "",
                        so_nguoi_toi_da: r.so_nguoi_toi_da || 2,
                        mo_ta: r.mo_ta || "",
                        gia_thue: r.gia_thue?.toString() || "",
                        tien_dat_coc: r.tien_dat_coc?.toString() || "",
                        vi_chu_nha: r.vi_chu_nha || "",
                        anh_phu: r.anh_phu || [],
                        so_phong_ngu: r.so_phong_ngu || 1,
                        selectedAmenities,
                        vi_do: r.vi_do ? parseFloat(r.vi_do) : null,
                        kinh_do: r.kinh_do ? parseFloat(r.kinh_do) : null,
                    });
                } else {
                    setError("Không tìm thấy thông tin phòng");
                }
            } catch (err) {
                setError("Lỗi kết nối đến máy chủ");
            } finally {
                setFetching(false);
            }
        };
        fetchRoom();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        
        let parsedValue: any = value;
        if (type === 'checkbox') {
            parsedValue = (e.target as HTMLInputElement).checked;
        } else if (type === 'number') {
            parsedValue = value === '' ? '' : Number(value);
        }
        setFormData(prev => ({
            ...prev,
            [name]: parsedValue
        }));
    };

    const toggleAmenity = (id: string) => {
        setFormData(prev => {
            const current = prev.selectedAmenities;
            const updated = current.includes(id) 
                ? current.filter(a => a !== id) 
                : [...current, id];
            return { ...prev, selectedAmenities: updated };
        });
    };

    const amenitiesList = [
        { id: "dieu_hoa", label: "Điều hòa" },
        { id: "may_giat", label: "Máy giặt" },
        { id: "wifi", label: "Wifi" },
        { id: "tu_lanh", label: "Tủ lạnh" }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ten: formData.ten,
                dia_chi: formData.dia_chi,
                thanh_pho: formData.thanh_pho,
                quan_huyen: formData.quan_huyen,
                dien_tich: Number(formData.dien_tich),
                so_nguoi_toi_da: Number(formData.so_nguoi_toi_da),
                mo_ta: formData.mo_ta,
                gia_thue: Number(formData.gia_thue),
                tien_dat_coc: Number(formData.tien_dat_coc),
                tien_nghi: formData.selectedAmenities,
                anh_phu: formData.anh_phu,
                so_phong_ngu: Number(formData.so_phong_ngu),
                vi_do: formData.vi_do,
                kinh_do: formData.kinh_do,
                vi_chu_nha: formData.vi_chu_nha
            };

            const response = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Đã xảy ra lỗi khi cập nhật phòng.");
            }

            // Thành công thì quay về ManageRoom
            navigate(`/manage-room/${id}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="max-w-4xl mx-auto px-6 py-12 text-center text-on-surface-variant animate-pulse">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 w-full">
            <button 
                onClick={() => navigate(`/manage-room/${id}`)}
                className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors mb-8 font-label text-xs uppercase tracking-widest"
            >
                <ArrowLeft size={16} /> Quay lại Quản lý
            </button>

            <header className="mb-10">
                <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter text-on-background mb-3">
                    Sửa Thông Tin Phòng
                </h1>
                <p className="text-on-surface-variant">
                    Cập nhật lại các thông tin bằng chữ cho căn phòng của bạn. (Chức năng sửa hình ảnh sẽ được hỗ trợ sau)
                </p>
            </header>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 text-sm font-medium flex items-center gap-2">
                    <Info size={18} /> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. Thông tin cơ bản */}
                <section className="glass-card p-8 rounded-2xl">
                    <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                        <Home className="text-primary" size={20} /> 1. Thông tin cơ bản
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Tên phòng/căn hộ *</label>
                            <input 
                                required
                                name="ten"
                                value={formData.ten}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-on-surface-variant/40"
                                placeholder="VD: Studio cao cấp trung tâm Quận 1..."
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Vị trí */}
                <section className="glass-card p-8 rounded-2xl">
                    <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                        <MapPin className="text-secondary" size={20} /> 2. Vị trí
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Thành phố *</label>
                            <input 
                                required
                                name="thanh_pho"
                                value={formData.thanh_pho}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                placeholder="VD: TP. Hồ Chí Minh"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Quận/Huyện *</label>
                            <input 
                                required
                                name="quan_huyen"
                                value={formData.quan_huyen}
                                onChange={handleChange}
                                type="text" 
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                placeholder="VD: Quận 1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Địa chỉ chi tiết *</label>
                        <input 
                            required
                            name="dia_chi"
                            value={formData.dia_chi}
                            onChange={handleChange}
                            type="text" 
                            className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="Số nhà, Tên đường, Phường/Xã"
                        />
                    </div>

                    <div className="mt-8 border-t border-black/5 dark:border-white/5 pt-8">
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Ghim vị trí trên bản đồ *</label>
                        <LocationPicker 
                            position={formData.vi_do && formData.kinh_do ? [formData.vi_do, formData.kinh_do] : null}
                            onChange={(lat, lng) => setFormData(prev => ({ ...prev, vi_do: lat, kinh_do: lng }))}
                            addressContext={[formData.quan_huyen, formData.thanh_pho].filter(Boolean).join(", ")}
                        />
                    </div>
                </section>

                {/* 3. Chi tiết & Tiện nghi */}
                <section className="glass-card p-8 rounded-2xl">
                    <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
                        <Info className="text-tertiary-container" size={20} /> 3. Chi tiết & Tiện nghi
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Diện tích (m²) *</label>
                            <input 
                                required
                                name="dien_tich"
                                value={formData.dien_tich}
                                onChange={handleChange}
                                type="number" 
                                min="1"
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Người tối đa *</label>
                            <input 
                                required
                                name="so_nguoi_toi_da"
                                value={formData.so_nguoi_toi_da}
                                onChange={handleChange}
                                type="number" 
                                min="1"
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Số phòng ngủ *</label>
                            <input 
                                required
                                name="so_phong_ngu"
                                value={formData.so_phong_ngu}
                                onChange={handleChange}
                                type="number" 
                                min="1"
                                className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="mb-10">
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-4">Tiện ích phòng</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {amenitiesList.map((amenity) => (
                                <button
                                    key={amenity.id}
                                    type="button"
                                    onClick={() => toggleAmenity(amenity.id)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${formData.selectedAmenities.includes(amenity.id) ? 'bg-primary/10 border-primary text-primary' : 'bg-surface-container-highest border-black/5 dark:border-white/5 text-on-surface-variant hover:border-black/20 dark:border-white/20'}`}
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.selectedAmenities.includes(amenity.id) ? 'bg-primary border-primary' : 'border-black/20 dark:border-white/20'}`}>
                                        {formData.selectedAmenities.includes(amenity.id) && <Check size={12} className="text-on-primary" strokeWidth={4} />}
                                    </div>
                                    <span className="text-sm font-bold">{amenity.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Thông tin bổ sung</label>
                        <textarea 
                            name="mo_ta"
                            value={formData.mo_ta}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none placeholder:text-on-surface-variant/40"
                            placeholder="Mô tả thêm về căn phòng, nội thất, quy định..."
                        ></textarea>
                    </div>
                </section>

                {/* 4. Giá cả */}
                <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 p-8 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                    <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2 relative z-10">
                        <DollarSign className="text-primary" size={20} /> 4. Định giá (OASIS)
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Giá phòng mỗi tháng *</label>
                            <div className="relative">
                                <input 
                                    required
                                    name="gia_thue"
                                    value={formData.gia_thue}
                                    onChange={handleChange}
                                    type="number" 
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-surface-container-highest border border-primary/20 rounded-xl py-4 pl-4 pr-16 text-lg font-mono font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary text-sm uppercase tracking-widest">
                                    OASIS
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-2">Tiền cọc *</label>
                            <div className="relative">
                                <input 
                                    required
                                    name="tien_dat_coc"
                                    value={formData.tien_dat_coc}
                                    onChange={handleChange}
                                    type="number" 
                                    step="0.01"
                                    min="0.01"
                                    className="w-full bg-surface-container-highest border border-primary/20 rounded-xl py-4 pl-4 pr-16 text-lg font-mono font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary text-sm uppercase tracking-widest">
                                    OASIS
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Blockchain Info */}
                <section className="glass-panel p-8 rounded-2xl border border-primary/20 bg-primary/5 shadow-glow/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2 text-primary">
                        <Wallet size={24} /> 4. Thông tin Blockchain
                    </h2>
                    
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                Địa chỉ ví nhận tiền (OASIS) *
                            </label>
                            <div className="flex flex-col md:flex-row gap-3">
                                <input
                                    type="text"
                                    required
                                    name="vi_chu_nha"
                                    placeholder="0x..."
                                    value={formData.vi_chu_nha}
                                    onChange={handleChange}
                                    className="flex-1 bg-surface-container-highest border border-black/10 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                />
                                {!isConnected && (
                                    <button
                                        type="button"
                                        onClick={() => connect({ connector: connectors[0] })}
                                        disabled={isConnecting}
                                        className="bg-primary text-on-primary-fixed px-6 py-3.5 rounded-xl font-label font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-glow/20"
                                    >
                                        {isConnecting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                                        Connect Wallet
                                    </button>
                                )}
                            </div>
                            <p className="mt-3 text-[10px] text-on-surface-variant leading-relaxed opacity-70">
                                <Info size={10} className="inline mr-1" /> 
                                Địa chỉ này sẽ được dùng để nhận tiền đặt cọc và tiền thuê hàng tháng. Hãy đảm bảo bạn có quyền truy cập vào ví này.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="pt-6">
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed py-5 rounded-2xl font-label font-bold uppercase tracking-[0.2em] hover:shadow-glow active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-on-primary-fixed/30 border-t-on-primary-fixed rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Check size={20} /> Cập nhật phòng
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}


