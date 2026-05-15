import { Link } from "react-router-dom";
import { FileSignature, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatOasis } from "../lib/utils";

export default function Contracts() {
    const contracts = [
        {
            id: "CT-82FA-11X",
            roomName: "Skyline Loft Premium",
            address: "88 Đường Lê Lợi, Quận 1, TP.HCM",
            startDate: "01/05/2024",
            endDate: "01/05/2025",
            rentAmount: 0.85,
            status: "Active",
            nextPayment: "05/06/2024",
            contractAddress: "0x3B6C908aD3aF21b7C118B80e608E986D58c44A2D"
        },
        {
            id: "CT-44A3-92Y",
            roomName: "The Minimalist Pad",
            address: "45 Lê Văn Sỹ, Quận 3, TP.HCM",
            startDate: "15/02/2023",
            endDate: "15/02/2024",
            rentAmount: 0.32,
            status: "Completed",
            nextPayment: null,
            contractAddress: "0x9F2E...1B9C"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4 tracking-tighter text-on-background">
                        Hợp Đồng Của Tôi
                    </h1>
                    <p className="text-on-surface-variant max-w-xl">
                        Quản lý các hợp đồng thuê nhà dạng Smart Contract. An toàn, minh bạch
                        và tự động tự động hóa trên blockchain.
                    </p>
                </div>
                <button className="bg-surface-container-high border border-white/10 hover:border-white/20 text-on-surface px-6 py-3 rounded-xl font-label font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2">
                    <FileSignature size={18} />
                    Lịch Sử Ký Kết
                </button>
            </header>

            <div className="space-y-6">
                {contracts.map((contract, index) => {
                    const isActive = contract.status === "Active";
                    return (
                        <div key={index} className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Left Status Indicator Accent */}
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                            )}

                            <div className="flex-1 w-full text-left">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <span className="font-mono text-sm font-bold text-on-surface">{contract.id}</span>
                                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border ${isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-surface-container text-on-surface-variant border-white/5"
                                        }`}>
                                        {contract.status}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-headline font-bold mb-1">{contract.roomName}</h3>
                                <p className="text-sm text-on-surface-variant mb-6">{contract.address}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-low p-4 rounded-xl border border-white/5">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Thời gian</p>
                                        <p className="text-sm font-medium text-on-surface">{contract.startDate} - {contract.endDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Tiền thuê</p>
                                        <p className="font-mono text-sm font-bold text-primary">{formatOasis(contract.rentAmount)} OASIS/tháng</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Trạng thái</p>
                                        <p className="text-sm font-medium flex items-center gap-1.5 opacity-90">
                                            {isActive ? <><CheckCircle2 size={14} className="text-green-500" /> Đang thuê</> : "Đã kết thúc"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">Smart Contract</p>
                                        <p className="font-mono text-xs text-secondary/80 truncate w-32" title={contract.contractAddress}>
                                            {contract.contractAddress}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Actions Pane */}
                            <div className="w-full md:w-64 shrink-0 flex flex-col md:items-end justify-center pt-6 z-10 md:pt-0 border-t md:border-t-0 md:border-l border-white/5 md:pl-8">
                                {isActive ? (
                                    <>
                                        <div className="text-left md:text-right mb-6 w-full flex md:flex-col justify-between md:justify-start items-center md:items-end">
                                            <p className="text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-1 flex items-center md:justify-end gap-1.5">
                                                <AlertCircle size={14} className="text-tertiary" /> Kỳ thanh toán tới
                                            </p>
                                            <p className="font-medium text-lg">{contract.nextPayment}</p>
                                        </div>
                                        <Link
                                            to={`/pay/${contract.id}`}
                                            className="w-full bg-gradient-to-r text-center from-primary to-primary-dim text-on-primary-fixed py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(168,164,255,0.3)] transition-all flex items-center justify-center gap-2"
                                        >
                                            Thanh toán OASIS <ArrowRight size={16} />
                                        </Link>
                                    </>
                                ) : (
                                    <button className="w-full bg-surface-container-highest border border-white/10 text-on-surface-variant py-3.5 rounded-xl font-label text-sm font-bold uppercase tracking-wider hover:bg-white/5 hover:text-on-surface transition-all">
                                        Xem Chi Tiết
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
