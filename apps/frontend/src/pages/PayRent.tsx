import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, Wallet, Shield, AlertTriangle, Loader2, Check } from "lucide-react";
import { formatOasis } from "../lib/utils";
import { useRentHouse } from "../hooks/useRentHouse";
import { useAccount, useConnect } from "wagmi";
import { formatEther } from "viem";
import { message } from "antd";

export default function PayRent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { myContracts, thanhToanThang, isPending, isWaiting } = useRentHouse();
    const { isConnected, address } = useAccount();
    const { connectors, connect } = useConnect();

    const [room, setRoom] = useState<any>(null);
    const [loadingRoom, setLoadingRoom] = useState(false);
    const [txSuccess, setTxSuccess] = useState(false);

    const contract = myContracts?.find((c: any) => Number(c.id) === Number(id));

    useEffect(() => {
        if (contract?.roomId) {
            setLoadingRoom(true);
            fetch(`http://localhost:3000/api/bat-dong-san/${Number(contract.roomId)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setRoom(data.data);
                    }
                })
                .catch(err => console.error("Error fetching room details:", err))
                .finally(() => setLoadingRoom(false));
        }
    }, [contract?.roomId]);

    // Lấy Tháng/Năm hiện tại dưới dạng số YYYYMM (ví dụ: 202605)
    const today = new Date();
    const currentPeriod = today.getFullYear() * 100 + (today.getMonth() + 1);
    const currentPeriodFormatted = `Tháng ${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()} (${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()})`;

    const handlePay = async () => {
        if (!contract) return;
        try {
            await thanhToanThang(Number(contract.id), currentPeriod, contract.rentPrice);
            setTxSuccess(true);
            message.success("Thanh toán tiền nhà thành công!");
            setTimeout(() => {
                navigate("/contracts");
            }, 3000);
        } catch (err) {
            console.error("Payment failed:", err);
            message.error("Giao dịch thanh toán thất bại.");
        }
    };

    if (!contract) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-20 text-center flex flex-col items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-error mb-4 opacity-55 animate-bounce" />
                <p className="text-on-surface-variant mb-6 text-sm">Không tìm thấy thông tin hợp đồng hoặc bạn không có quyền thanh toán hợp đồng này.</p>
                <Link to="/contracts" className="bg-primary text-on-primary px-6 py-3 rounded-xl uppercase tracking-widest text-xs font-bold font-label transition-all hover:shadow-glow">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    const rentPriceOasis = contract ? formatEther(contract.rentPrice) : "0";

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 w-full relative">
            {/* Global Loading overlay */}
            {(isPending || isWaiting) && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <h3 className="text-xl font-bold mb-2">Đang xử lý thanh toán...</h3>
                        <p className="text-sm text-on-surface-variant max-w-sm text-center">Vui lòng xác nhận giao dịch trên ví MetaMask của bạn và chờ mạng lưới Oasis xử lý.</p>
                    </div>
                </div>
            )}

            {/* Success Overlay */}
            {txSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-surface-container-high border border-black/10 dark:border-white/10 rounded-2xl p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4 animate-bounce">
                            <Check size={32} />
                        </div>
                        <h3 className="text-xl font-headline font-bold mb-2 text-on-surface">Thanh toán hoàn tất</h3>
                        <p className="text-on-surface-variant mb-6 text-sm">Giao dịch đã được xác nhận thành công trên chuỗi khối Oasis Sapphire!</p>
                    </div>
                </div>
            )}

            <Link to="/contracts" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mb-8">
                <ChevronLeft size={16} /> Quay lại Hợp đồng
            </Link>

            <div className="glass-card rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                <div className="p-8 md:p-12 text-center border-b border-black/5 dark:border-white/5 relative bg-surface-container-low/50">
                    <h1 className="font-headline text-3xl font-bold mb-2">Thanh Toán Tiền Thuê</h1>
                    <p className="text-on-surface-variant text-sm font-mono tracking-widest uppercase">Mã Hợp Đồng: CT-{contract.id}</p>
                </div>

                <div className="p-8 md:p-12">
                    <div className="bg-surface-container rounded-2xl p-6 border border-black/5 dark:border-white/5 mb-8 text-center flex flex-col items-center justify-center py-10 relative overflow-hidden">
                        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-primary/5 rounded-[100%] pointer-events-none blur-3xl"></div>
                        <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 relative z-10">Số lượng cần thanh toán</p>
                        <div className="flex items-baseline justify-center gap-2 relative z-10">
                            <span className="text-4xl font-headline font-bold text-on-background tracking-tighter">
                                {formatOasis(rentPriceOasis)}
                            </span>
                            <span className="text-2xl font-bold text-primary">OASIS</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Phòng thuê</span>
                            <span className="font-bold text-right">{loadingRoom ? "Đang tải..." : (room?.ten || "Liên kết Smart Contract")}</span>
                        </div>
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Kỳ thanh toán</span>
                            <span className="font-bold text-right">{currentPeriodFormatted}</span>
                        </div>
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Ví nhận tiền (Chủ nhà)</span>
                            <span className="font-mono text-xs text-secondary truncate max-w-[150px] md:max-w-xs text-right">{contract.landlord}</span>
                        </div>
                    </div>

                    <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4 flex gap-4 items-start mb-8">
                        <AlertTriangle className="text-[#EAB308] shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-[#EAB308] text-sm font-bold mb-1">Lưu ý quan trọng</p>
                            <p className="text-[#EAB308]/80 text-xs leading-relaxed">
                                Giao dịch không thể hoàn tác sau khi thực hiện trên Blockchain. Vui lòng đảm bảo ví của bạn đang kết nối đúng mạng lưới Oasis Sapphire Testnet và có đủ số dư.
                            </p>
                        </div>
                    </div>

                    {/* Cảnh báo kết nối ví ngay tại đây */}
                    {!isConnected ? (
                        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6 flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-orange-500 font-medium leading-relaxed">
                                    Ví của bạn đang bị ngắt kết nối. Vui lòng kết nối ví để thanh toán tiền nhà.
                                </p>
                            </div>
                            <button 
                                onClick={() => connect({ connector: connectors[0] })}
                                className="bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-label font-bold text-xs uppercase tracking-wider transition-all w-full flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                Kết nối ví ngay
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={handlePay}
                            disabled={isPending || isWaiting}
                            className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed py-4 md:py-5 rounded-xl font-label text-base font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,164,255,0.4)] transition-all flex items-center justify-center gap-3"
                        >
                            <Wallet size={20} />
                            Thanh toán {formatOasis(rentPriceOasis)} OASIS
                        </button>
                    )}

                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-on-surface-variant">
                        <Shield size={14} className="text-[#22C55E]" /> Được bảo hiểm bởi RentChain Smart Contract
                    </div>
                </div>
            </div>
        </div>
    );
}
