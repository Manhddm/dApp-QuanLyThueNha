import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Wallet, Shield, AlertTriangle } from "lucide-react";
import { formatOasis } from "../lib/utils";

export default function PayRent() {
    const { id } = useParams();

    return (
        <div className="max-w-3xl mx-auto px-6 md:px-8 py-12 w-full">
            <Link to="/contracts" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors mb-8">
                <ChevronLeft size={16} /> Back to Contracts
            </Link>

            <div className="glass-card rounded-3xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                <div className="p-8 md:p-12 text-center border-b border-black/5 dark:border-white/5 relative bg-surface-container-low/50">
                    <h1 className="font-headline text-3xl font-bold mb-2">Thanh Toán Tiền Thuê</h1>
                    <p className="text-on-surface-variant text-sm font-mono tracking-widest uppercase">Contract ID: {id}</p>
                </div>

                <div className="p-8 md:p-12">
                    <div className="bg-surface-container rounded-2xl p-6 border border-black/5 dark:border-white/5 mb-8 text-center flex flex-col items-center justify-center py-10 relative overflow-hidden">
                        <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[200%] bg-primary/5 rounded-[100%] pointer-events-none blur-3xl"></div>
                        <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 relative z-10">Số lượng cần thanh toán</p>
                        <div className="flex items-baseline justify-center gap-2 relative z-10">
                            <span className="text-4xl font-headline font-bold text-on-background tracking-tighter">
                                {formatOasis(room.price)}
                            </span>
                            <span className="text-2xl font-bold text-primary">OASIS</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-3 font-mono relative z-10">~ $2,845.50 USD</p>
                    </div>

                    <div className="space-y-4 mb-10">
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Phòng thuê</span>
                            <span className="font-bold text-right">Skyline Loft Premium</span>
                        </div>
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Kỳ thanh toán</span>
                            <span className="font-bold text-right">Tháng 06/2024 (01/06 - 30/06)</span>
                        </div>
                        <div className="flex justify-between text-sm py-3 border-b border-black/5 dark:border-white/5">
                            <span className="text-on-surface-variant">Địa chỉ ví nhận (Smart Contract)</span>
                            <span className="font-mono text-xs text-secondary truncate max-w-[150px] md:max-w-xs text-right">0x3B6C908aD3aF21b7C118B80e608E986D58c44A2D</span>
                        </div>
                    </div>

                    <div className="bg-[#EAB308]/10 border border-[#EAB308]/20 rounded-xl p-4 flex gap-4 items-start mb-8">
                        <AlertTriangle className="text-[#EAB308] shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-[#EAB308] text-sm font-bold mb-1">Lưu ý quan trọng</p>
                            <p className="text-[#EAB308]/80 text-xs leading-relaxed">
                                Giao dịch không thể hoàn tác sau khi thực hiện trên Blockchain. Vui lòng đảm bảo bạn đang sử dụng mạng lưới Oasis Network và có đủ số dư (bao gồm cả Gas fee).
                            </p>
                        </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary-fixed py-4 md:py-5 rounded-xl font-label text-base font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,164,255,0.4)] transition-all flex items-center justify-center gap-3">
                        <Wallet size={20} />
                        Chuyển {formatOasis(room.price)} OASIS
                    </button>
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-on-surface-variant">
                        <Shield size={14} className="text-[#22C55E]" /> Được bảo vệ bởi RentChain Smart Contract
                    </div>
                </div>
            </div>
        </div>
    );
}


