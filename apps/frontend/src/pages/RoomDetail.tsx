import { useNavigate } from "react-router-dom";

export default function RoomDetail() {
    const navigate = useNavigate();

    const handleDeposit = () => {
        // lưu data (giống HTML bạn đang làm)
        localStorage.setItem("room_name", "Penthouse Skyview Quận 1 — Block A1");
        localStorage.setItem("rent_price", "0.5 ETH");
        localStorage.setItem("deposit", "1.0 ETH");

        navigate("/payment");
    };

    return (
        <div className="bg-[#0d0d18] text-[#e9e6f7] min-h-screen">

            {/* NAVBAR */}
            <nav className="bg-[#0d0d18]/80 backdrop-blur-xl sticky top-0 z-50 shadow-2xl">
                <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div className="text-2xl font-bold">RentChain</div>
                    <button className="bg-gradient-to-r from-purple-400 to-indigo-500 px-6 py-2 rounded-lg font-bold text-sm">
                        Connect Wallet
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 py-12 grid lg:grid-cols-12 gap-12">

                {/* LEFT */}
                <div className="lg:col-span-8 space-y-10">

                    {/* IMAGE */}
                    <div className="rounded-2xl overflow-hidden aspect-video">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYgEFcFKYW553lzMIROxZ83Et6ctaO57s1BYNQYMNYCsMrq1mFe1250dL8Y8nYmq4ys9H-OqXhJWNJmezg0O77OeFDAWWIY4unsbW6SBS_EXcdRvW7YaUbEWrWP5FLTRN6c4rR2qXdDHFFctrC1KuItce_MQu7o5FnGBfTngLHRfjDDPJuWGC0a86es7y-hPoyVCK2WKbGcKVxHh-R6cUvQQtIoWC_lIc9uiMRAzNOMq0MSYBF8XyE3WzbJzQOMatJhgveD8rQGZA"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* TITLE */}
                    <div>
                        <h1 className="text-4xl font-bold mb-4">
                            Penthouse Skyview — Block A1
                        </h1>
                        <p className="text-gray-400">
                            Tọa lạc tại trung tâm thành phố, căn hộ mang đến trải nghiệm sống
                            thượng lưu với tầm nhìn toàn cảnh.
                        </p>
                    </div>

                    {/* AMENITIES */}
                    <div className="bg-[#181826] p-8 rounded-2xl">
                        <h2 className="text-xl font-semibold mb-6">Tiện ích</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                            {[
                                "Wi-Fi",
                                "Điều hòa",
                                "Bãi xe",
                                "Hồ bơi",
                                "Gym",
                                "Bảo mật",
                                "Bếp",
                                "Dọn phòng",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="bg-[#242434] p-4 rounded-xl text-center text-sm"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 bg-[#181826] p-8 rounded-2xl space-y-6 shadow-2xl">

                        <div>
                            <p className="text-gray-400 text-sm">Giá thuê</p>
                            <h2 className="text-3xl font-bold text-purple-400">
                                0.5 ETH
                            </h2>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Deposit</span>
                                <span>1.0 ETH</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Thời hạn</span>
                                <span>6 tháng</span>
                            </div>
                        </div>

                        <button
                            onClick={handleDeposit}
                            className="w-full bg-gradient-to-r from-purple-400 to-indigo-500 py-4 rounded-xl font-bold hover:scale-105 transition"
                        >
                            Đặt cọc & Ký hợp đồng
                        </button>

                    </div>
                </div>

            </main>
        </div>
    );
}