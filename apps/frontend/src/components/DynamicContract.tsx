import React, { useRef } from 'react';
import { X, Printer, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatOasis } from '../lib/utils';
import { message } from 'antd';

interface DynamicContractProps {
    isOpen: boolean;
    onClose: () => void;
    onSign: () => void;
    isPending: boolean;
    room: any;
    landlord: any;
    tenant: any;
}

export default function DynamicContract({ isOpen, onClose, onSign, isPending, room, landlord, tenant }: DynamicContractProps) {
    const contractRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    if (!isOpen) return null;

    const handlePrint = () => {
        const content = contractRef.current;
        if (!content) return;
        
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            message.error("Vui lòng cho phép trình duyệt mở tab mới để in Hợp đồng");
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Hợp Đồng Điện Tử - RentChain</title>
                    <style>
                        body { font-family: 'Times New Roman', Times, serif; line-height: 1.6; margin: 0; padding: 40px; color: #000; }
                        h1, h2, h3, h4, h5 { text-align: center; margin-bottom: 5px; }
                        .text-center { text-align: center; }
                        .font-bold { font-weight: bold; }
                        .italic { font-style: italic; }
                        .mt-4 { margin-top: 20px; }
                        .mb-4 { margin-bottom: 20px; }
                        .flex-between { display: flex; justify-content: space-between; }
                        .signature-box { margin-top: 40px; display: flex; justify-content: space-between; padding: 0 50px; }
                        .signature-col { text-align: center; width: 45%; }
                        .sign-space { height: 100px; }
                        p { margin: 8px 0; text-align: justify; }
                        .indent { padding-left: 20px; }
                        .article-title { font-weight: bold; margin-top: 15px; }
                    </style>
                </head>
                <body>
                    ${content.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const isTenant = user?.dia_chi_vi?.toLowerCase() === tenant?.dia_chi_vi?.toLowerCase();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col p-4 md:p-8">
            {/* Overlay */}
            <div className="absolute inset-0 bg-surface-dim/90 backdrop-blur-sm" onClick={onClose}></div>
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-4xl mx-auto rounded-xl shadow-2xl flex flex-col max-h-[90vh] border border-black/10">
                {/* Header Actions */}
                <div className="flex justify-between items-center p-4 border-b border-black/10 bg-surface-container-lowest rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2 text-primary">
                        <ShieldCheck size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Hợp Đồng Điện Tử Bằng Chứng Chuỗi (Smart Contract)</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handlePrint}
                            className="flex items-center gap-2 text-sm font-bold text-on-surface hover:text-primary transition-colors px-4 py-2 bg-black/5 rounded-lg"
                        >
                            <Printer size={16} /> Lưu PDF
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Contract Paper */}
                <div className="overflow-y-auto p-8 md:p-12 bg-white text-black shrink-1 flex-grow">
                    <div ref={contractRef} className="max-w-3xl mx-auto" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                        <h3 className="font-bold text-center">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
                        <h4 className="font-bold text-center" style={{ textDecoration: 'underline' }}>Độc lập - Tự do - Hạnh phúc</h4>

                        <br/>
                        <h2 className="font-bold text-center text-xl">HỢP ĐỒNG THUÊ NHÀ / PHÒNG TRỌ</h2>
                        <p className="text-center italic">(Hợp đồng điện tử tích hợp trên hệ thống RentChain)</p>

                        <p className="mt-6">Hôm nay, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}, thông qua nền tảng RentChain.</p>
                        <p>Chúng tôi gồm có:</p>

                        <div className="mt-4 font-bold">BÊN CHO THUÊ (BÊN A):</div>
                        <p>Ông/Bà: <strong>{landlord?.ho_ten || '...........................................'}</strong></p>
                        <p>Số CMND/CCCD: <strong>{landlord?.so_cccd || '...........................................'}</strong></p>
                        <p>Số điện thoại: <strong>{landlord?.so_dien_thoai || '...........................................'}</strong></p>
                        <p>Địa chỉ Ví Blockchain (Smart Contract): <span className="font-mono text-sm">{landlord?.dia_chi_vi || room?.vi_chu_nha}</span></p>

                        <div className="mt-4 font-bold">BÊN THUÊ (BÊN B):</div>
                        <p>Ông/Bà: <strong>{tenant?.ho_ten || '...........................................'}</strong></p>
                        <p>Số CMND/CCCD: <strong>{tenant?.so_cccd || '...........................................'}</strong></p>
                        <p>Số điện thoại: <strong>{tenant?.so_dien_thoai || '...........................................'}</strong></p>
                        <p>Địa chỉ Ví Blockchain (Smart Contract): <span className="font-mono text-sm">{tenant?.dia_chi_vi || '...........................................'}</span></p>

                        <p className="mt-6">Hai bên cùng thỏa thuận và ký kết Hợp đồng thuê phòng trọ/nhà ở với các điều khoản sau:</p>

                        <p className="font-bold mt-4">ĐIỀU 1: THÔNG TIN TÀI SẢN CHO THUÊ</p>
                        <p>- Bên A đồng ý cho Bên B thuê phòng/nhà tại địa chỉ: <strong>{room?.dia_chi}, {room?.phuong_xa}, {room?.quan_huyen}, {room?.thanh_pho}</strong></p>
                        <p>- Diện tích: <strong>{room?.dien_tich} m2</strong>. Sức chứa tối đa: <strong>{room?.so_nguoi_toi_da} người</strong>.</p>
                        <p>- Mục đích sử dụng: Để ở.</p>

                        <p className="font-bold mt-4">ĐIỀU 2: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN</p>
                        <p>- Tiền thuê hàng tháng là: <strong>{formatOasis(room?.gia_thue)} OASIS</strong>.</p>
                        <p>- Tiền cọc đảm bảo: <strong>{formatOasis(room?.tien_dat_coc)} OASIS</strong>.</p>
                        <p>- <strong>Phương thức thanh toán:</strong> Thanh toán tự động qua Smart Contract trên nền tảng RentChain trước ngày <strong>05</strong> hàng tháng.</p>
                        <p className="italic pl-4 text-sm">*Lưu ý: Tiền cọc sẽ được khóa tự động trên Smart Contract. Bên A chỉ hoàn trả cọc thông qua hệ thống khi kết thúc hợp đồng đúng hạn và không có hư hại tài sản.</p>

                        <p className="font-bold mt-4">ĐIỀU 3: ĐIỀU KHOẢN PHẠT VI PHẠM</p>
                        <div className="pl-4">
                            <p>- Đóng tiền thuê đúng hạn. Nếu Bên B quá hạn thanh toán <strong>5 ngày</strong>, Smart Contract sẽ cho phép Bên A đơn phương chấm dứt hợp đồng và tịch thu cọc tự động.</p>
                            <p>- Nếu Bên B tự ý dọn đi trước thời hạn mà không thỏa thuận với Bên A, toàn bộ tiền cọc trên Smart Contract sẽ thuộc về Bên A.</p>
                        </div>

                        <p className="font-bold mt-4">ĐIỀU 4: ĐIỀU KHOẢN CHUNG</p>
                        <p>- Hợp đồng này có hiệu lực kể từ thời điểm giao dịch được xác nhận thành công trên mạng lưới Blockchain (Oasis Network).</p>
                        <p>- Bằng việc nhấn nút "Xác nhận & Ký Smart Contract", hai bên cam kết đã đọc, hiểu rõ và đồng ý với mọi điều khoản.</p>

                        <div className="flex justify-between mt-12 px-12">
                            <div className="text-center w-1/2">
                                <p className="font-bold">BÊN THUÊ (BÊN B)</p>
                                <p className="italic text-sm">(Chữ ký số xác thực bằng Ví)</p>
                                <div className="h-24 flex items-center justify-center">
                                    <span className="font-mono text-xs opacity-50 border border-dashed border-gray-400 p-2 rounded">
                                        Waiting for signature...
                                    </span>
                                </div>
                                <p className="font-bold">{tenant?.ho_ten || '.....................'}</p>
                            </div>
                            <div className="text-center w-1/2">
                                <p className="font-bold">BÊN CHO THUÊ (BÊN A)</p>
                                <p className="italic text-sm">(Chữ ký số xác thực bằng Ví)</p>
                                <div className="h-24 flex items-center justify-center">
                                    <span className="font-mono text-xs opacity-50 border border-dashed border-gray-400 p-2 rounded">
                                        Signed electronically
                                    </span>
                                </div>
                                <p className="font-bold">{landlord?.ho_ten || '.....................'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                {isTenant && (
                    <div className="p-4 border-t border-black/10 bg-surface-container-lowest rounded-b-xl flex justify-end shrink-0 gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                        <button 
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg font-bold text-on-surface-variant hover:bg-black/5 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            onClick={onSign}
                            disabled={isPending}
                            className="bg-primary text-on-primary-fixed px-8 py-3 rounded-lg font-label font-bold uppercase tracking-widest hover:shadow-glow active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isPending ? "Đang xử lý..." : "Xác nhận & Ký Smart Contract"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
