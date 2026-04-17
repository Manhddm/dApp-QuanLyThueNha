import { useState } from "react";
import { Link } from "react-router-dom";
import { useRooms } from "../hooks/useRooms";
import ConnectWallet from "../components/ConnectWallet";
import { message, Modal, Form, Input, InputNumber, Select } from "antd";
import { useAuth } from "../context/AuthContext";
export default function RoomList() {
    const {
        rooms,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        deleteRoom,
        refreshRooms
    } = useRooms();
    
    const { token, user } = useAuth();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters({
            ...filters,
            [name]: type === 'checkbox' ? checked : value
        });
        setCurrentPage(1); // Reset page on filter change
    };

    const handleAddRoom = async (values: any) => {
        if (!user || user.vai_tro === 'nguoi_thue') {
            message.error("Chỉ Chủ nhà hoặc Admin mới được phép tạo phòng.");
            return;
        }

        message.loading({ content: 'Đang lưu lên hệ thống...', key: 'tx' });
        
        try {
            const bodyData = {
                ten: values.title,
                dia_chi: values.location || "Đang cập nhật",
                thanh_pho: values.thanh_pho || "TP HCM",
                quan_huyen: values.quan_huyen || "Quận 1",
                loai_bat_dong_san: values.loai_bds || "nha_tro",
                gia_thue: values.price || 0,
                tien_dat_coc: values.deposit || 0,
                dien_tich: values.dien_tich || 30, // mặc định
                so_nguoi_toi_da: 2,
                trang_thai: "trong",
                mo_ta: values.mo_ta || "Chưa có mô tả"
            };

            const response = await fetch("http://localhost:3000/api/bat-dong-san", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bodyData)
            });

            const result = await response.json();
            if (result.success) {
                message.success({ content: 'Tạo phòng thành công!', key: 'tx', duration: 3 });
                setIsModalVisible(false);
                form.resetFields();
                refreshRooms(); // Tải lại danh sách
            } else {
                message.error({ content: result.message || 'Tạo phòng thất bại', key: 'tx', duration: 3 });
            }
        } catch (error) {
            console.error(error);
            message.error({ content: 'Lỗi kết nối máy chủ', key: 'tx', duration: 3 });
        }
    };

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] font-['Inter'] selection:bg-[#a8a4ff]/30 min-h-screen">
            {/* TopNavBar */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
                <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold text-[#e9e6f7] tracking-tighter font-['Space_Grotesk']">
                        QuanLyThueNha
                    </div>
                    <div className="hidden md:flex items-center gap-8 font-['Space_Grotesk'] tracking-tight">
                        <Link to="/" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Home</Link>
                        <Link to="/rooms" className="text-[#a8a4ff] border-b-2 border-[#a8a4ff] pb-1">Danh sách phòng</Link>
                        <Link to="/contracts" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Hợp đồng</Link>
                        <Link to="/dashboard" className="text-[#e9e6f7]/60 hover:text-[#e9e6f7] transition-colors">Dashboard</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <ConnectWallet />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12">
                {/* Search & Filter Bar */}
                <header className="mb-12">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="font-['Space_Grotesk'] text-5xl font-bold tracking-tighter text-[#e9e6f7]">Khám Phá Không Gian Sống</h1>
                        
                        <button onClick={() => setIsModalVisible(true)} className="bg-[#a8a4ff]/20 text-[#a8a4ff] px-4 py-2 border border-[#a8a4ff]/30 rounded-lg hover:bg-[#a8a4ff]/30 flex gap-2 transition-colors">
                            <span className="material-symbols-outlined text-sm">+</span> Đăng phòng mới
                        </button>
                    </div>
                    <div className="bg-[#12121e] p-6 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative z-10">
                        <div className="space-y-2">
                            <label className="block text-xs font-medium text-[#aba9b9] uppercase tracking-widest">Vị trí, từ khóa</label>
                            <div className="relative">
                                {/* <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#aba9b9] text-sm">search</span> */}
                                <input
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    className="w-full bg-[#242434] border-none rounded-lg py-3 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#a8a4ff]/50 placeholder:text-[#aba9b9]/40 outline-none"
                                    placeholder="Tìm theo khu vực, tên..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-medium text-[#aba9b9] uppercase tracking-widest">Giá Tối Đa (ETH)</label>
                                <span className="text-xs font-mono text-[#a8a4ff]">{filters.priceMax} ETH</span>
                            </div>
                            <input
                                name="priceMax"
                                value={filters.priceMax}
                                onChange={handleFilterChange}
                                className="w-full h-1 bg-[#242434] rounded-lg appearance-none cursor-pointer accent-[#a8a4ff]"
                                max="5" min="0.1" step="0.1" type="range"
                            />
                        </div>
                        <div className="flex items-center justify-between bg-[#242434] p-3 rounded-lg h-[46px]">
                            <span className="text-xs font-medium text-[#aba9b9] uppercase tracking-widest">Phòng trống</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    name="isAvailable"
                                    checked={filters.isAvailable}
                                    onChange={handleFilterChange}
                                    className="sr-only peer"
                                    type="checkbox"
                                />
                                <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#a8a4ff]"></div>
                            </label>
                        </div>
                        <div className="w-full bg-[#242434] py-3 rounded-lg text-[#aba9b9] text-sm font-medium tracking-wider text-center h-[46px] flex items-center justify-center border border-white/5">
                            Kết quả: {totalItems}
                        </div>
                    </div>
                </header>

                {/* Room Listing Grid */}
                {rooms.length === 0 ? (
                    <div className="text-center py-20 bg-[#12121e] rounded-xl border border-white/5">
                        <span className="material-symbols-outlined text-6xl text-white/10 mb-4">search_off</span>
                        <h2 className="text-xl font-bold text-[#aba9b9]">Không tìm thấy phòng phù hợp</h2>
                        <p className="text-sm text-[#aba9b9]/60">Thử điều chỉnh lại bộ lọc xem sao!</p>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-0">
                        {rooms.map((room) => (
                            <Link key={room.id} to={`/rooms/${room.id}`} className="bg-white/[0.03] backdrop-blur-md border border-white/5 hover:bg-white/[0.06] hover:-translate-y-1 rounded-xl overflow-hidden transition-all duration-300 flex flex-col group block relative">
                                <div className="relative h-64 overflow-hidden">
                                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={room.title} src={room.image} />
                                    {room.isAvailable ? (
                                        <div className="absolute top-4 left-4 bg-[#22C55E]/20 backdrop-blur-md border border-[#22C55E]/30 text-[#22C55E] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                                            Available
                                        </div>
                                    ) : (
                                        <div className="absolute top-4 left-4 bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                                            <span className="material-symbols-outlined text-[10px]">do_not_disturb_on</span>
                                            Rented
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 right-4 bg-[#0d0d18]/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-[#e9e6f7] shadow-lg">
                                        ID: {room.id}
                                    </div>
                                    {/* Delete Button OVERRIDING nav logic (Demo CRUD) */}
                                    <button
                                        onClick={(e) => { e.preventDefault(); deleteRoom(room.id); }}
                                        className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-md text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                                        title="Delete Room"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e9e6f7] leading-tight flex-1">{room.title}</h3>
                                        <div className="text-right shrink-0">
                                            <p className="text-[#a8a4ff] font-bold text-lg leading-none">{room.price} ETH</p>
                                            <p className="text-[10px] text-[#aba9b9] uppercase mt-1">/ Month</p>
                                        </div>
                                    </div>
                                    <p className="text-[#aba9b9] text-xs mb-6 flex items-start gap-1 line-clamp-2">
                                        <span className="material-symbols-outlined text-sm shrink-0 translation-y-[2px]">location_on</span>
                                        {room.location}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5 mt-auto">
                                        <div>
                                            <p className="text-[10px] text-[#aba9b9] uppercase tracking-wider mb-1">Deposit</p>
                                            <p className="font-mono text-sm">{room.deposit} ETH</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-[#aba9b9] uppercase tracking-wider mb-1">Owner</p>
                                            <p className="font-mono text-sm text-[#a8a4ff]/80 truncate">{room.owner.slice(0, 6)}...{room.owner.slice(-4)}</p>
                                        </div>
                                    </div>
                                    <button className="w-full border border-[#474754] group-hover:border-[#a8a4ff]/50 text-[#e9e6f7] py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all group-hover:bg-[#a8a4ff]/5 pointer-events-none">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </section>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <footer className="mt-20 flex justify-center items-center gap-2 relative z-10">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/5 text-[#aba9b9] hover:bg-white/5 transition-colors disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${currentPage === i + 1 ? "bg-[#a8a4ff] text-[#0d0d18]" : "border border-white/5 text-[#aba9b9] hover:bg-white/5"}`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/5 text-[#aba9b9] hover:bg-white/5 transition-colors disabled:opacity-30"
                        >
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </footer>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#0d0d18] w-full py-12 border-t border-white/5 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-6">
                    <div className="text-xl font-bold text-[#e9e6f7] font-['Space_Grotesk'] tracking-tighter border-b-0">QuanLyThueNha</div>
                    <div className="flex gap-8 text-[#e9e6f7]/40 font-['Inter'] text-sm uppercase tracking-widest">
                        <Link to="#" className="hover:text-[#aa8ffd] transition-colors">Etherscan</Link>
                        <Link to="#" className="hover:text-[#aa8ffd] transition-colors">Discord</Link>
                        <Link to="#" className="hover:text-[#aa8ffd] transition-colors">Twitter</Link>
                        <Link to="#" className="hover:text-[#aa8ffd] transition-colors">Terms of Service</Link>
                    </div>
                    <p className="text-[#e9e6f7]/40 font-['Inter'] text-sm uppercase tracking-widest">
                        © 2024 QuanLyThueNha. The Ethereal Ledger.
                    </p>
                </div>
            </footer>

            {/* Ant Design Modal for adding room */}
            <Modal
                title="Đăng phòng mới lên Blockchain"
                open={isModalVisible}
                onOk={() => form.submit()}
                onCancel={() => setIsModalVisible(false)}
                okText="Ký giao dịch"
                cancelText="Hủy"
                okButtonProps={{ className: "bg-gradient-to-r from-[#a8a4ff] to-[#675df9] text-black font-bold border-none" }}
            >
                <Form layout="vertical" form={form} onFinish={handleAddRoom} className="mt-4">
                    <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Vui lòng nhập tên phòng' }]}>
                        <Input placeholder="Ví dụ: Căn hộ cao cấp Quận 1" />
                    </Form.Item>
                    <div className="flex gap-4">
                        <Form.Item label="Giá thuê (VNĐ/tháng)" name="price" className="flex-1" rules={[{ required: true }]}>
                            <InputNumber min={100000} step={100000} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Tiền cọc (VNĐ)" name="deposit" className="flex-1" rules={[{ required: true }]}>
                            <InputNumber min={100000} step={100000} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <Form.Item label="Thành phố" name="thanh_pho" initialValue="TP HCM" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="TP HCM">TP HCM</Select.Option>
                                <Select.Option value="Hà Nội">Hà Nội</Select.Option>
                                <Select.Option value="Đà Nẵng">Đà Nẵng</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Quận/Huyện" name="quan_huyen" rules={[{ required: true }]}>
                            <Input placeholder="VD: Quận 1, Đống Đa..." />
                        </Form.Item>
                    </div>
                    <Form.Item label="Địa chỉ cụ thể" name="location" rules={[{ required: true, message: 'Vui lòng nhập vị trí' }]}>
                        <Input placeholder="Số nhà, Tên đường..." />
                    </Form.Item>
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Loại BĐS" name="loai_bds" initialValue="nha_tro" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="nha_tro">Nhà Trọ</Select.Option>
                                <Select.Option value="nha_o">Nhà Nguyên Căn</Select.Option>
                                <Select.Option value="chung_cu">Chung Cư</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Diện tích (m2)" name="dien_tich" initialValue={30} rules={[{ required: true }]}>
                            <InputNumber min={1} className="w-full" style={{ width: '100%' }} />
                        </Form.Item>
                    </div>
                    <Form.Item label="Mô tả" name="mo_ta">
                        <Input.TextArea rows={3} placeholder="Mô tả tiện ích, không gian..." />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
