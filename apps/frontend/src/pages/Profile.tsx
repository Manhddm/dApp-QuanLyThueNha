import React, { useState, useRef, useEffect } from 'react';
import { User as UserIcon, Phone, FileText, Check, Loader2, Camera, AlertCircle, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { message } from 'antd';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';

export default function Profile() {
    const { user, token, updateUserContext } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Check if there is a redirect parameter
    const queryParams = new URLSearchParams(location.search);
    const redirectUrl = queryParams.get('redirect');
    const isRequiredMode = !!redirectUrl;
    
    const { address } = useAccount();

    const [formData, setFormData] = useState({
        ho_ten: '',
        so_dien_thoai: '',
        so_cccd: '',
        anh_dai_dien: '',
        dia_chi_vi: ''
    });
    
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load user data when component mounts or user changes
    useEffect(() => {
        if (user) {
            setFormData({
                ho_ten: user.ho_ten || '',
                so_dien_thoai: user.so_dien_thoai || '',
                so_cccd: user.so_cccd || '',
                anh_dai_dien: user.anh_dai_dien || '',
                dia_chi_vi: user.dia_chi_vi || address || ''
            });
        }
    }, [user, address]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        const file = e.target.files[0];
        if (!file.type.startsWith('image/')) {
            message.error("Vui lòng chọn file hình ảnh hợp lệ");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.error("Kích thước ảnh tối đa là 5MB");
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const res = await fetch("http://localhost:3000/api/upload/file", {
                method: "POST",
                body: data
            });
            const result = await res.json();
            
            if (result.success) {
                setFormData(prev => ({ ...prev, anh_dai_dien: result.url }));
                message.success("Tải ảnh lên thành công! Hãy bấm Lưu để cập nhật.");
            } else {
                message.error(result.message || "Tải ảnh thất bại");
            }
        } catch (error) {
            console.error("Lỗi upload:", error);
            message.error("Lỗi máy chủ khi tải ảnh lên");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isRequiredMode && (!formData.so_dien_thoai || !formData.so_cccd)) {
            message.error("Vui lòng điền đầy đủ Số điện thoại và CCCD!");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:3000/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                message.success("Cập nhật thông tin thành công!");
                updateUserContext({ ...user, ...formData } as any);
                
                if (redirectUrl) {
                    navigate(redirectUrl);
                }
            } else {
                message.error(data.message || "Cập nhật thất bại");
            }
        } catch (error) {
            console.error(error);
            message.error("Đã xảy ra lỗi khi kết nối với máy chủ");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12">
            <div className="mb-8">
                {redirectUrl ? (
                    <button 
                        onClick={() => navigate(redirectUrl)}
                        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-medium text-sm mb-4"
                    >
                        <ChevronLeft size={16} /> Quay lại
                    </button>
                ) : null}
                <h1 className="text-3xl font-headline font-bold text-on-surface">Hồ Sơ Cá Nhân</h1>
                <p className="text-on-surface-variant mt-2">Quản lý thông tin định danh và cài đặt tài khoản của bạn.</p>
            </div>

            {isRequiredMode && (
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-8 flex items-start gap-3">
                    <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-orange-500 font-bold mb-1">Yêu cầu hoàn thiện hồ sơ</p>
                        <p className="text-xs text-orange-500/80 leading-relaxed">
                            Vui lòng cung cấp đầy đủ Số điện thoại và CCCD để hệ thống có thể tự động tạo Hợp đồng điện tử. Thông tin này sẽ được bảo mật tuyệt đối.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar */}
                <div className="col-span-1">
                    <div className="bg-surface-container rounded-2xl p-8 border border-black/5 dark:border-white/5 flex flex-col items-center text-center">
                        <div className="relative group w-40 h-40 rounded-full overflow-hidden border-4 border-surface shadow-xl mb-6">
                            {formData.anh_dai_dien ? (
                                <img src={formData.anh_dai_dien} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center text-primary">
                                    <UserIcon size={64} />
                                </div>
                            )}
                            
                            {/* Upload Overlay */}
                            <div 
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {uploading ? (
                                    <Loader2 className="animate-spin mb-2" size={24} />
                                ) : (
                                    <>
                                        <Camera size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Đổi ảnh</span>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={uploading}
                            />
                        </div>
                        <h2 className="text-xl font-headline font-bold text-on-surface truncate w-full">{user.ho_ten}</h2>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mt-2">
                            {user.vai_tro === 'chu_nha' ? 'Chủ nhà' : user.vai_tro === 'nguoi_thue' ? 'Khách thuê' : 'Admin'}
                        </p>
                        
                        <div className="w-full mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-left space-y-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Ví Blockchain</p>
                                <p className="text-xs font-mono bg-surface-container-highest p-2 rounded-lg truncate border border-black/5 dark:border-white/5">
                                    {formData.dia_chi_vi || 'Chưa liên kết'}
                                </p>
                                {!user.dia_chi_vi && address && (
                                    <p className="text-[10px] text-orange-500 mt-1">
                                        * Sẽ được liên kết khi bạn bấm Lưu.
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Email</p>
                                <p className="text-sm font-medium text-on-surface truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info Form */}
                <div className="col-span-1 lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-surface-container rounded-2xl p-8 border border-black/5 dark:border-white/5 space-y-6">
                        <h3 className="text-lg font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-primary" /> Thông Tin Định Danh
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                    <UserIcon size={14} /> Họ và tên *
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="ho_ten"
                                    value={formData.ho_ten}
                                    onChange={handleChange}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                />
                            </div>
                            
                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                    <Phone size={14} /> Số điện thoại {isRequiredMode && '*'}
                                </label>
                                <input
                                    required={isRequiredMode}
                                    type="tel"
                                    name="so_dien_thoai"
                                    value={formData.so_dien_thoai}
                                    onChange={handleChange}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="0912345678"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                                    <FileText size={14} /> Số CCCD / CMND {isRequiredMode && '*'}
                                </label>
                                <input
                                    required={isRequiredMode}
                                    type="text"
                                    name="so_cccd"
                                    value={formData.so_cccd}
                                    onChange={handleChange}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                                    placeholder="079012345678"
                                />
                            </div>
                        </div>

                        <div className="bg-surface-container-highest p-4 rounded-xl border border-black/5 dark:border-white/5 mt-6">
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                <strong className="text-primary">Lưu ý bảo mật:</strong> Thông tin CCCD và Số điện thoại của bạn được mã hóa an toàn và <span className="underline font-bold">chỉ</span> hiển thị cho bên kia (Chủ nhà hoặc Khách thuê) trên văn bản Hợp đồng điện tử khi có giao dịch được xác nhận.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-black/5 dark:border-white/5 flex justify-end gap-4">
                            {redirectUrl && (
                                <button
                                    type="button"
                                    onClick={() => navigate(redirectUrl)}
                                    className="px-6 py-3 rounded-xl font-bold text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
                                >
                                    Hủy bỏ
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading || uploading}
                                className="bg-primary text-on-primary-fixed px-8 py-3 rounded-xl font-label font-bold uppercase tracking-widest hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                            >
                                {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                {loading ? "Đang lưu..." : "Lưu Thông Tin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
