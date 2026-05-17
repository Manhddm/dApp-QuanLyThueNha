import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Copy, MapPin, ShieldCheck, FileText, ChevronLeft, Calendar, Coins, History, Loader2, AlertCircle, Check } from "lucide-react";
import { useAuth } from '../context/AuthContext';
import { GlobalLoading } from '../components/GlobalLoading';
import DynamicContract from '../components/DynamicContract';
import { formatOasis } from "../lib/utils";
import { useRentHouse } from "../hooks/useRentHouse";
import { parseEther } from "viem";
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export default function RoomDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const { thuePhong, myContracts, isPending, isWaiting, isSuccess, hash: rentHash, error: contractError } = useRentHouse();
    const { isConnected, address } = useAccount();
    const { connectors, connect } = useConnect();
    
    // UI state hooks
    const [actionLoading, setActionLoading] = useState(false);
    const [actionSuccess, setActionSuccess] = useState<{show: boolean, hash: string} | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Dynamic Contract State
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [landlordProfile, setLandlordProfile] = useState<any>(null);

    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/bat-dong-san/${id}`);
                const result = await response.json();
                
                if (result.success) {
                    setRoom(result.data);
                } else {
                    setError(result.message || "Không thể tải thông tin phòng");
                }
            } catch (err) {
                console.error("Error fetching room:", err);
                setError("Đã xảy ra lỗi khi kết nối đến máy chủ");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRoom();
        }
    }, [id]);

    useEffect(() => {
        // Fetch Landlord profile when room is loaded
        if (room?.vi_chu_nha && token) {
            fetch(`http://localhost:3000/api/auth/user/${room.vi_chu_nha}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setLandlordProfile(data.data);
                }
            })
            .catch(err => console.error("Error fetching landlord profile", err));
        }
    }, [room?.vi_chu_nha, token]);

    const handleContractSign = async (signedData: any) => {
        try {
            await thuePhong(
                room.ma_bat_dong_san,
                parseEther(room.gia_thue.toString()),
                parseEther(room.tien_dat_coc.toString()),
                room.vi_chu_nha as `0x${string}`
            );
            message.success("Hợp đồng đã được gửi lên Blockchain!");
        } catch (error) {
            console.error("Lỗi khi gọi Smart Contract:", error);
            message.error("Giao dịch thất bại hoặc bị từ chối.");
        } finally {
            setIsContractModalOpen(false);
        }
    };

    const handleOpenContract = () => {
        if (!user) {
            message.error("Vui lòng đăng nhập để xem hợp đồng");
            return;
        }
        
        if (!user.so_cccd || !user.so_dien_thoai) {
            navigate(`/profile?redirect=/rooms/${id}`);
            return;
        }

        setIsContractModalOpen(true);
    };

    if (loading) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-on-surface-variant font-medium animate-pulse">Đang tải thông tin phòng...</p>
            </div>
        );
    }

    if (error || !room) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
                <AlertCircle className="w-16 h-16 text-error/50 mb-4" />
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Lỗi tải dữ liệu</h3>
                <p className="text-on-surface-variant max-w-md mb-8">{error || "Không tìm thấy phòng này."}</p>
                <Link to="/rooms" className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all hover:shadow-glow">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    // Prepare display data
    const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
    const mainImage = room.anh_dai_dien || (room.hinh_anh && room.hinh_anh[0]?.duong_dan_anh) || defaultImage;
    const galleryImages = room.hinh_anh ? room.hinh_anh.filter((img: any) => img.duong_dan_anh !== mainImage) : [];
    
    // Address formatting
    const fullAddress = [room.dia_chi, room.phuong_xa, room.quan_huyen, room.thanh_pho].filter(Boolean).join(", ");
    
    // Amenities parsing
    let amenities: string[] = [];
    try {
        if (typeof room.tien_nghi === 'string') {
            amenities = JSON.parse(room.tien_nghi);
        } else if (Array.isArray(room.tien_nghi)) {
            amenities = room.tien_nghi;
        } else if (room.tien_nghi && typeof room.tien_nghi === 'object') {
            // If it's an object of booleans, filter the true ones
            amenities = Object.keys(room.tien_nghi).filter(key => room.tien_nghi[key]);
        }
    } catch (e) {
        console.error("Error parsing amenities:", e);
    }

    const statusConfig: any = {
        'trong': { label: 'Available', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' },
        'da_thue': { label: 'Rented', color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
        'bao_tri': { label: 'Maintenance', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' }
    };
    const currentStatus = statusConfig[room.trang_thai] || statusConfig['trong'];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast notification here
    };

    // Moved hooks to the top level

    const handleRent = async () => {
        if (!isConnected) {
            connect({ connector: connectors[0] });
            return;
        }

        if (!room || !room.vi_chu_nha) {
            alert("Phòng này chưa được chủ nhà thiết lập ví nhận tiền.");
            return;
        }

        if (isConnected && address && room.vi_chu_nha.toLowerCase() === address.toLowerCase()) {
            alert("Chủ nhà không thể tự thuê phòng của chính mình!");
            return;
        }

        setActionLoading(true);
        try {
            const rentPrice = parseEther(room.gia_thue.toString());
            const deposit = parseEther(room.tien_dat_coc.toString());
            
            const txHash = await thuePhong(
                room.ma_bat_dong_san, 
                rentPrice, 
                deposit, 
                room.vi_chu_nha as `0x${string}`
            );
            
            // Wait for mining (in real app, use waitForTransactionReceipt)
            await new Promise(res => setTimeout(res, 5000));
            setActionSuccess({ show: true, hash: txHash as string });
        } catch (err: any) {
            console.error("Error renting room:", err);
            alert("Lỗi khi thực hiện giao dịch: " + (err.message || "Lỗi không xác định"));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 w-full relative">
            {/* --- MODALS --- */}
            {/* Loading Modal */}
            {actionLoading && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
                    <div className="flex flex-col items-center text-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Đang xử lý giao dịch...</h3>
                        <p className="text-on-surface-variant max-w-md">Vui lòng xác nhận trên ví MetaMask và đợi mạng lưới Blockchain xử lý. Không đóng trình duyệt lúc này.</p>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {actionSuccess && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container-high border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-6 animate-bounce shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            <Check size={40} />
                        </div>
                        <h3 className="text-2xl font-headline font-bold mb-3 text-on-surface">Ký Hợp Đồng Thành Công!</h3>
                        <p className="text-on-surface-variant mb-6">Yêu cầu thuê phòng của bạn đã được ghi nhận trên Blockchain và đang chờ Chủ nhà duyệt.</p>
                        
                        <div className="w-full p-4 bg-surface-container mb-6 rounded-xl border border-black/5 dark:border-white/5 text-left">
                            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Transaction Hash</p>
                            <a 
                                href={`https://explorer.testnet.sapphire.oasis.dev/tx/${actionSuccess.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-xs text-primary hover:underline break-all"
                            >
                                {actionSuccess.hash}
                            </a>
                        </div>

                        <button 
                            onClick={() => {
                                setActionSuccess(null);
                                window.location.reload();
                            }}
                            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-glow transition-all"
                        >
                            Đóng & Làm mới
                        </button>
                    </div>
                </div>
            )}
            {/* --- END MODALS --- */}

            <Link to="/rooms" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mb-8">
                <ChevronLeft size={16} /> Quay lại danh sách
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Images & Details */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden glass-panel group relative">
                            <img src={mainImage} alt={room.ten} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                                <p className="text-white font-medium">Ảnh chính của phòng</p>
                            </div>
                        </div>
                        {galleryImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {galleryImages.slice(0, 3).map((img: any, idx: number) => (
                                    <div key={idx} className="h-32 rounded-xl overflow-hidden glass-panel cursor-pointer group">
                                        <img src={img.duong_dan_anh} alt={`Interior ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    </div>
                                ))}
                                {galleryImages.length > 3 && (
                                    <div className="h-32 rounded-xl overflow-hidden bg-surface-container-highest border border-black/5 dark:border-white/5 flex items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-colors">
                                        <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">+{galleryImages.length - 3} ảnh nữa</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Room Info */}
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <span className={`px-3 py-1 ${currentStatus.bg} ${currentStatus.color} border ${currentStatus.border} rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${currentStatus.color.replace('text-', 'bg-')} animate-pulse`}></span>
                                {currentStatus.label}
                            </span>
                            <span className="px-3 py-1 bg-surface-container-highest border border-black/10 dark:border-white/10 text-on-surface rounded-full text-xs font-medium font-mono">
                                ID: {room.ma_bat_dong_san}
                            </span>
                            <span className="px-3 py-1 bg-surface-container-highest border border-black/10 dark:border-white/10 text-on-surface rounded-full text-xs font-medium uppercase">
                                {room.loai_bat_dong_san === 'chung_cu' ? 'Chung cư' : room.loai_bat_dong_san === 'nha_o' ? 'Nhà ở' : 'Nhà trọ'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">{room.ten}</h1>
                        <p className="flex items-start gap-2 text-on-surface-variant text-base mb-8">
                            <MapPin className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                            {fullAddress}
                        </p>

                        <div className="w-full h-px bg-black/5 dark:bg-white/5 my-8"></div>

                        <h2 className="text-xl font-headline font-bold mb-4">Mô tả chi tiết</h2>
                        <div className="text-on-surface-variant leading-relaxed mb-8 whitespace-pre-wrap">
                            {room.mo_ta || "Chưa có mô tả chi tiết cho phòng này."}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">Tiện ích</h3>
                                {amenities.length > 0 ? (
                                    <ul className="grid grid-cols-1 gap-3">
                                        {amenities.map((item, idx) => {
                                            const amenityMap: any = {
                                                'dieu_hoa': 'Điều hòa',
                                                'may_giat': 'Máy giặt',
                                                'wifi': 'Wifi',
                                                'tu_lanh': 'Tủ lạnh'
                                            };
                                            const label = amenityMap[item] || item;
                                            return (
                                                <li key={idx} className="flex items-center gap-3 text-sm text-on-surface-variant">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                                                    {label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-on-surface-variant/60 italic">Không có thông tin tiện ích</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface mb-4">Thông tin khác</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/60"></div>
                                        Diện tích: {room.dien_tich} m²
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/60"></div>
                                        Số phòng ngủ: {room.so_phong_ngu || 1}
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/60"></div>
                                        Tối đa: {room.so_nguoi_toi_da} người
                                    </li>
                                    <li className="flex items-center gap-3 text-sm text-on-surface-variant">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary/60"></div>
                                        Ngày đăng: {new Date(room.ngay_tao).toLocaleDateString('vi-VN')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar: Contract & Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Booking Card */}
                    <div className="glass-card rounded-2xl p-6 lg:p-8 sticky top-24 shadow-glow/5">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Giá Thuê</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-headline font-bold text-primary">{formatOasis(room.gia_thue)}</span>
                                    <span className="text-xl font-bold text-primary">OASIS</span>
                                    <span className="text-xs text-on-surface-variant ml-1">/tháng</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="bg-surface-container p-4 rounded-xl border border-black/5 dark:border-white/5 flex justify-between items-center transition-colors hover:border-black/10 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-tertiary-container/10 flex items-center justify-center text-tertiary-container">
                                        <Coins size={16} />
                                    </div>
                                    <span className="text-sm font-semibold">Cọc đảm bảo</span>
                                </div>
                                <span className="font-mono font-medium">{formatOasis(room.tien_dat_coc)} OASIS</span>
                            </div>
                            <div className="bg-surface-container p-4 rounded-xl border border-black/5 dark:border-white/5 flex justify-between items-center transition-colors hover:border-black/10 dark:border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                        <Calendar size={16} />
                                    </div>
                                    <span className="text-sm font-semibold">Thời hạn (dự kiến)</span>
                                </div>
                                <span className="text-sm font-medium">12 Tháng</span>
                            </div>
                        </div>

                        {contractError && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400">
                                <p className="font-bold mb-1 flex items-center gap-1">
                                    <Info size={12} /> Giao dịch thất bại
                                </p>
                                <p className="opacity-80">{(contractError as any)?.message || "Vui lòng kiểm tra lại ví của bạn."}</p>
                            </div>
                        )}

                        {/* Cảnh báo chưa kết nối ví (nếu có) */}
                        {!isConnected && (
                            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-4 flex items-start gap-3">
                                <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-orange-500 font-medium leading-relaxed">
                                    Vui lòng kết nối ví Oasis Wallet của bạn bằng nút phía trên để có thể ký hợp đồng thuê phòng.
                                </p>
                            </div>
                        )}

                        {/* Tùy chọn xem hợp đồng PDF đính kèm (nếu chủ nhà có đăng) */}
                        {room.pdfContract && (
                            <div className="mb-4">
                                <a 
                                    href={room.pdfContract} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full bg-surface-container border border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 text-on-surface-variant py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 group"
                                >
                                    <FileText size={14} className="group-hover:scale-110 transition-transform" />
                                    Tài liệu đính kèm của chủ nhà
                                </a>
                            </div>
                        )}

                        {(() => {
                            const userContractsForRoom = myContracts?.filter((c: any) => 
                                c.tenant.toLowerCase() === address?.toLowerCase() && 
                                Number(c.roomId) === Number(room.ma_bat_dong_san)
                            ) || [];
                            
                            // Lấy hợp đồng mới nhất (id lớn nhất)
                            const sortedContracts = [...userContractsForRoom].sort((a, b) => Number(b.id) - Number(a.id));
                            const userExistingContract = sortedContracts.length > 0 ? sortedContracts[0] : null;

                            if (userExistingContract) {
                                const status = Number(userExistingContract.status);
                                if (status === 0) {
                                    return (
                                        <button disabled className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/30 py-4 rounded-xl font-label font-bold uppercase tracking-widest mb-4 text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                            <Loader2 className="w-5 h-5 animate-spin" /> Đang chờ chủ nhà duyệt
                                        </button>
                                    );
                                }
                                if (status === 1) {
                                    return (
                                        <button disabled className="w-full bg-green-500/20 text-green-400 border border-green-500/30 py-4 rounded-xl font-label font-bold uppercase tracking-widest mb-4 text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                            <ShieldCheck size={18} /> Đã ký hợp đồng thành công
                                        </button>
                                    );
                                }
                                if (status === 3) {
                                    return (
                                        <>
                                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-400 text-center">
                                                <p className="font-bold mb-1">Yêu cầu thuê trước đó đã bị từ chối</p>
                                                <p className="opacity-80">Tiền cọc đã được hoàn trả. Bạn có thể thử ký lại.</p>
                                            </div>
                                            <button 
                                                disabled={room.trang_thai !== 'trong' || isPending || isWaiting}
                                                onClick={handleRent}
                                                className={`w-full ${room.trang_thai === 'trong' ? 'bg-gradient-to-r from-primary to-primary-dim hover:shadow-glow' : 'bg-surface-container-highest cursor-not-allowed grayscale'} text-on-primary-fixed py-4 rounded-xl font-label font-bold uppercase tracking-widest transition-all mb-4 text-sm flex items-center justify-center gap-2`}
                                            >
                                                {(isPending || isWaiting) ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <FileText size={18} />
                                                )}
                                                {isWaiting ? "Đang xác thực..." : isPending ? "Đang gửi..." : "Ký Lại Smart Contract"}
                                            </button>
                                        </>
                                    );
                                }
                            }

                            return (
                                <button 
                                    disabled={room.trang_thai !== 'trong' || isPending || isWaiting}
                                    onClick={handleOpenContract}
                                    className={`w-full ${room.trang_thai === 'trong' ? 'bg-gradient-to-r from-primary to-primary-dim hover:shadow-glow' : 'bg-surface-container-highest cursor-not-allowed grayscale'} text-on-primary-fixed py-4 rounded-xl font-label font-bold uppercase tracking-widest transition-all mb-4 text-sm flex items-center justify-center gap-2`}
                                >
                                    {(isPending || isWaiting) ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <FileText size={18} />
                                    )}
                                    {isWaiting ? "Đang xác thực..." : isPending ? "Đang xử lý..." : "Xem & Ký Hợp Đồng Điện Tử"}
                                </button>
                            );
                        })()}
                        
                        {/* Cleaned up old inline UI states */}
                        <p className="text-center text-xs text-on-surface-variant mt-2">
                            {room.trang_thai === 'trong' ? 'Phí mạng (Gas fee) sẽ được tính tại thời điểm giao dịch.' : 'Phòng này hiện không sẵn sàng để thuê.'}
                        </p>

                        <div className="w-full h-px bg-black/5 dark:bg-white/5 my-6"></div>

                        {/* Contract Transparency */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-[#22C55E]" />
                                Minh Bạch Chuỗi Khối
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Chủ nhà (Owner Wallet)</p>
                                    <div className="flex items-center justify-between bg-surface-container-highest px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 group">
                                        <span className="font-mono text-[10px] text-secondary/80 truncate mr-2">{room.vi_chu_nha || "Chưa cập nhật"}</span>
                                        <button 
                                            onClick={() => room.vi_chu_nha && handleCopy(room.vi_chu_nha)}
                                            className="text-on-surface-variant hover:text-black dark:hover:text-white transition-colors p-1"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Hợp đồng mẫu (Template)</p>
                                    <div className="flex items-center justify-between bg-surface-container-highest px-3 py-2 rounded-lg border border-black/5 dark:border-white/5">
                                        <span className="font-mono text-[10px] text-primary/80 truncate mr-2">0x3B6C908...4A2D</span>
                                        <button className="text-on-surface-variant hover:text-black dark:hover:text-white transition-colors">
                                            <Copy size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2.5 rounded-lg border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest text-on-surface hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-all mt-2 flex items-center justify-center gap-2">
                                <History size={12} /> Xem Lịch Sử Giao Dịch
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modals */}
            <DynamicContract 
                isOpen={isContractModalOpen}
                onClose={() => setIsContractModalOpen(false)}
                onSign={handleRent}
                isPending={isPending || isWaiting}
                room={room}
                landlord={landlordProfile}
                tenant={user}
            />
        </div>
    );
}



