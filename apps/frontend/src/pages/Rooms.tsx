import { Link } from "react-router-dom";
import { MapPin, SlidersHorizontal } from "lucide-react";

export default function Rooms() {
    const rooms = [
        {
            id: "0x82f...a12",
            name: "Skyline Loft Premium",
            price: "0.85 ETH",
            location: "88 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
            deposit: "1.5 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuBT0ZxG3OF-jv-wsG8BUUvyHvXlcJcDxUOFO7R82mqCw9lKM5hHuozcrSIJKvLergBMQaPQpgAYc-2lwQZzRYyPzXKwistNJDq4tuyz8d35OOi4IxZy5g98SYFqnhybi0jSOBWoUidnlIHQVi77K_107k6YTc2relPOpjtn8k5iDnV7KC5QxwtexNikjzOkicEUg-giOcy2Kr5JbaAcVPa_afFMa66aANuQ9l3KacQLucF2l7gINCaYqnysSRT0wyIY7sS7uj6lfm8",
        },
        {
            id: "0x44a...b34",
            name: "Cyberpunk Suite 204",
            price: "0.45 ETH",
            location: "12 Phan Xích Long, Phú Nhuận, TP. HCM",
            deposit: "0.9 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCKeTsaR6MRCkGfvxA1bEWAhSmLhiJcQNZ_sQBu9OiYHfErV3_q3vkYtjPcxL0rVnGDpYRmn6g5v7F4R0Xezm-RxTcm7noe3Qd3dJ93-BiCY55XOue8eK6IhGpzMpHC6veqWC2SnWoi4btqRzN6xbRZAOeTZStO8GsK-Pqf1GryBQiRVVC_vTDaW8jypr7UputhfNt95Sl7S0pz4gjskkm7vD69cpBadLuHqrHKGbyVBjNz_7wm4ka4wRjoIt3X83tIOFLm-SlJ9ZI",
        },
        {
            id: "0x12d...e56",
            name: "Neo-Classic Villa",
            price: "1.20 ETH",
            location: "Khu đô thị Sala, Quận 2, TP. Thủ Đức",
            deposit: "2.4 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDAAQPFgA9UEr-kC1NH0A2mB9luwaEHKFNVzQ5I1P3zT3v59ar4zEkJN1EPT9MuVfelO7fU29azliqguHsGizNidfZltHwrk_1CAUnwtYjhN7C1EK2HKO-dIFMhmUQmqYFdqiDbYBFPVDQuxA0o9uIfHyamEoG-Y8rF0354vuJNQdGekT2arHEipjvtovwGjpZCToPFRzDq2DgDe_-A232z2wE3to9jBQuyy2QvOCYNKMw3AI8TGlP3w0bV2By-RsBx1-sYeDKGr_I",
        },
        {
            id: "0x99c...f78",
            name: "The Minimalist Pad",
            price: "0.32 ETH",
            location: "45 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh",
            deposit: "0.5 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDS9qgSubTyTFC2KDT60COXNRkr7P4oUH-vMTRdGCanSPty3bHtyaQXy1GAtOuHOCR0mY8e69Nwq5HnYZWTdrkcEhSHdCzz1kP_tTktGFDZmqfZAE6LItp-h6yrlUD-EU56hfrqyrMqNzkGjjyWCVbdcquwafi20gYn0ng1sOrLaVXo7h8-u93xBVD0uttirQ3ocI-vEpM5mK3onT5c6yy5BEeoQjlpJquSuC_sUJy26TqXTDHMQNjNo6BaRJ_3nbmFZi2mS6JYeHs",
        },
        {
            id: "0xaa1...b23",
            name: "Industrial Brick Loft",
            price: "0.58 ETH",
            location: "102 Nguyễn Hữu Cảnh, Bình Thạnh, TP. HCM",
            deposit: "1.0 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCouy-Ti1xvcahMPbBoj_qylAlkJaweAIwqg8AvLj4ADHcMANN32mKvQK9bouQP5XeP1USrLHP8tPxCEalBGZToeOvMCSel94fVMQX2T18qlTackkpTGrwR34_T2xgnmwcVdBaaRWmpQhcqntBGxOgfcbclkZARTRA3MIsT0YRzx6Z7qtjJHd8YF8KjswJIvnl9SyAaRqQYXoOq_J9DyA3Tcrkjvl0J8Fhj5gGIflPZnBSYQV7eq1tO3JMNm8iPyQJqaKtOKI4z43g",
        },
        {
            id: "0xccc...d45",
            name: "Tech-Smart Studio",
            price: "0.70 ETH",
            location: "Vinhomes Central Park, Bình Thạnh, TP. HCM",
            deposit: "1.4 ETH",
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuABpuuxEaxO7xsnxJPJY5rA7urQzznVGajy-VJr5GymfIlnZWeRGoXNNTl9y0rNY58INNuK38sXk5yYnxs8SuinLURwXec-8bvOoEgFEWvwesz5ZMHiA9n0tMG0kL9XmRM1lnKEI-W7jZa57cUisUOmTMzHg3Si2geMCCYCaYc44d4M-SUD1RkagOrIAJ78SbLSyo-LqrD9nUWdGR8ZR3PM87jBOU4R7Y91nZK4qSiFXBkCi7brrH9rqWqYNPVU3v9cUjgPMPow-Kg",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full">
            {/* Search & Filter Bar */}
            <header className="mb-12">
                <h1 className="font-headline text-5xl font-bold mb-8 tracking-tighter text-on-background">
                    Khám Phá Không Gian Sống
                </h1>
                <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end shadow-xl">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                            Vị trí
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                            <input
                                className="w-full bg-surface-container-highest border-none rounded-xl py-3.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/40 transition-shadow outline-none"
                                placeholder="Thành phố, Quận..."
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                                Khoảng giá (ETH)
                            </label>
                            <span className="text-xs font-mono text-primary font-bold">
                                0.1 - 2.5
                            </span>
                        </div>
                        <input
                            className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary outline-none"
                            max="5"
                            min="0.1"
                            step="0.1"
                            type="range"
                        />
                    </div>
                    <div className="flex items-center justify-between bg-surface-container-highest p-3.5 rounded-xl border border-white/5 h-[48px]">
                        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">
                            Phòng trống
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input checked readOnly className="sr-only peer" type="checkbox" />
                            <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                    <button className="w-full bg-surface-container-highest hover:bg-white/10 border border-primary/20 text-on-surface py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        Áp dụng bộ lọc
                    </button>
                </div>
            </header>

            {/* Room Listing Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room, index) => (
                    <div
                        key={index}
                        className="glass-card rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group"
                    >
                        <div className="relative h-64 overflow-hidden bg-surface-container">
                            <img
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                src={room.image}
                                alt={room.name}
                            />
                            <div className="absolute top-4 left-4 bg-[#22C55E]/20 backdrop-blur-md border border-[#22C55E]/30 text-[#22C55E] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-[#22C55E]/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span>
                                Available
                            </div>
                            <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface border border-white/10 shadow-lg">
                                ID: {room.id}
                            </div>
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-headline text-xl font-bold text-on-background line-clamp-1">
                                    {room.name}
                                </h3>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-primary font-bold text-lg leading-none">
                                        {room.price}
                                    </p>
                                    <p className="text-[10px] text-on-surface-variant uppercase mt-1 font-semibold tracking-wider">
                                        / Month
                                    </p>
                                </div>
                            </div>
                            <p className="text-on-surface-variant text-sm mb-6 flex items-start gap-1.5 line-clamp-2">
                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-on-surface-variant" />
                                {room.location}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-white/5 mt-auto">
                                <div>
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">
                                        Deposit
                                    </p>
                                    <p className="font-mono text-sm font-medium">{room.deposit}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mb-1">
                                        Smart Contract
                                    </p>
                                    <div className="flex items-center justify-end gap-1 text-primary/90 text-sm font-mono font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        Verified
                                    </div>
                                </div>
                            </div>
                            <Link
                                to={`/rooms/${room.id}`}
                                className="w-full border border-outline-variant hover:border-primary/50 text-center py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:bg-primary/5 text-on-surface flex items-center justify-center"
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            {/* Pagination */}
            <footer className="mt-20 flex justify-center items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-on-primary font-bold shadow-glow">
                    1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 text-on-surface hover:bg-white/5 transition-colors font-medium">
                    2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 text-on-surface hover:bg-white/5 transition-colors font-medium">
                    3
                </button>
                <span className="px-2 text-on-surface-variant font-medium">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 text-on-surface hover:bg-white/5 transition-colors font-medium">
                    12
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 text-on-surface-variant hover:bg-white/5 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </footer>
        </div>
    );
}
