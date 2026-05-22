import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, SlidersHorizontal, Home, XCircle, Search, Map, LayoutGrid, Info, Filter, X, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import RoomMap from "../components/RoomMap";
import { formatOasis } from "../lib/utils";

export default function Rooms() {
    const { user } = useAuth();
    const location = useLocation();
    
    // State for rooms
    const [rooms, setRooms] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // State for filters
    const [search, setSearch] = useState("");
    const [isAvailable, setIsAvailable] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filter Detail States
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [bedrooms, setBedrooms] = useState<number | null>(null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
    
    // State for pagination
    const [page, setPage] = useState(1);
    const limit = 6;

    const amenitiesList = [
        { id: "dieu_hoa", label: "Điều hòa" },
        { id: "may_giat", label: "Máy giặt" },
        { id: "wifi", label: "Wifi" },
        { id: "tu_lanh", label: "Tủ lạnh" }
    ];

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const offset = (page - 1) * limit;
            let url = `http://localhost:3000/api/bat-dong-san?limit=${limit}&offset=${offset}`;
            
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (isAvailable) url += `&trang_thai=trong`;
            if (minPrice) url += `&min_price=${minPrice}`;
            if (maxPrice) url += `&max_price=${maxPrice}`;
            if (bedrooms) url += `&so_phong_ngu=${bedrooms}`;
            if (selectedAmenities.length > 0) url += `&tien_nghi=${selectedAmenities.join(',')}`;

            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                setRooms(result.data);
                setTotal(result.total);
            }
        } catch (error) {
            console.error("Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    // Auto fetch when page or location changes
    useEffect(() => {
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, location.key]);

    const handleApplyFilters = () => {
        setPage(1); // Reset to page 1 on new filter
        fetchRooms();
        setIsSidebarOpen(false);
    };

    const handleResetFilters = async () => {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
        setBedrooms(null);
        setSelectedAmenities([]);
        setIsAvailable(false);
        setPage(1);
        
        // Manual fetch because state updates are async
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/bat-dong-san?limit=${limit}&offset=0`);
            const result = await response.json();
            if (result.success) {
                setRooms(result.data);
                setTotal(result.total);
            }
        } catch (error) {
            console.error("Error resetting rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleAmenity = (id: string) => {
        if (selectedAmenities.includes(id)) {
            setSelectedAmenities(selectedAmenities.filter(a => a !== id));
        } else {
            setSelectedAmenities([...selectedAmenities, id]);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-12 w-full relative">
            {/* Sidebar Filter Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 dark:bg-white/60 backdrop-blur-sm z-[100] transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Filter Content */}
            <aside className={`fixed top-0 left-0 h-full w-[320px] bg-surface-container shadow-2xl z-[101] transition-transform duration-500 ease-out p-8 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between mb-10">
                    <h2 className="font-headline text-2xl font-bold flex items-center gap-2">
                        <Filter className="w-6 h-6 text-primary" /> Bộ lọc
                    </h2>
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="p-2 hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto space-y-10 pr-2 custom-scrollbar">
                    {/* Price Range */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Khoảng giá (OASIS)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-on-surface-variant/60 font-medium">Tối thiểu</label>
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] text-on-surface-variant/60 font-medium">Tối đa</label>
                                <input 
                                    type="number" 
                                    placeholder="Any"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full bg-surface-container-highest border border-black/5 dark:border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bedrooms */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Số phòng ngủ</h3>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setBedrooms(bedrooms === num ? null : num)}
                                    className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-sm transition-all border ${bedrooms === num ? 'bg-primary border-primary text-on-primary shadow-glow-sm' : 'bg-surface-container-highest border-black/5 dark:border-white/5 hover:border-primary/40'}`}
                                >
                                    {num}{num === 5 ? '+' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tiện ích phòng</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {amenitiesList.map((amenity) => (
                                <label 
                                    key={amenity.id}
                                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-highest border border-black/5 dark:border-white/5 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-colors group"
                                >
                                    <span className="text-sm font-medium">{amenity.label}</span>
                                    <div className="relative">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only"
                                            checked={selectedAmenities.includes(amenity.id)}
                                            onChange={() => toggleAmenity(amenity.id)}
                                        />
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${selectedAmenities.includes(amenity.id) ? 'bg-primary border-primary' : 'bg-transparent border-black/20 dark:border-white/20 group-hover:border-primary/50'}`}>
                                            {selectedAmenities.includes(amenity.id) && <Check className="w-3.5 h-3.5 text-on-primary" strokeWidth={4} />}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-primary">Chỉ phòng trống</span>
                            <span className="text-[10px] text-primary/60 font-medium italic">Sẵn sàng dọn vào ngay</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                checked={isAvailable}
                                onChange={(e) => setIsAvailable(e.target.checked)}
                                className="sr-only peer" 
                                type="checkbox" 
                            />
                            <div className="w-10 h-5.5 bg-black/10 dark:bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-4 pt-8 border-t border-black/5 dark:border-white/5">
                    <button 
                        onClick={handleResetFilters}
                        className="py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors"
                    >
                        Đặt lại
                    </button>
                    <button 
                        onClick={handleApplyFilters}
                        className="bg-primary text-on-primary py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-glow hover:shadow-glow-lg transition-all"
                    >
                        Áp dụng
                    </button>
                </div>
            </aside>

            {/* Header & Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-[0.2em] mb-2">
                        <div className="w-8 h-px bg-primary"></div>
                        <span>RentChain Dapp</span>
                    </div>
                    <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-on-background leading-tight">
                        Tìm Kiếm <br /><span className="text-primary italic">Phòng Trọ</span> Ưng Ý
                    </h1>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-surface-container-highest p-1.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-xl">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-primary text-on-primary shadow-glow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Lưới</span>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'map' ? 'bg-primary text-on-primary shadow-glow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                        >
                            <Map className="w-4 h-4" />
                            <span>Bản đồ</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Bar & Global Filter Button */}
            <div className="mb-16 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow group w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant/40 w-5 h-5 transition-colors group-focus-within:text-primary" />
                    <input
                        className="w-full bg-surface-container-low border border-black/5 dark:border-white/5 rounded-2xl py-5 pl-14 pr-6 text-base focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/30 transition-all outline-none shadow-2xl"
                        placeholder="Tìm kiếm theo thành phố, quận huyện..."
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                    />
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="h-[66px] px-8 bg-surface-container-low border border-black/5 dark:border-white/5 rounded-2xl flex items-center gap-3 font-bold text-sm uppercase tracking-widest hover:border-primary/40 transition-all shadow-2xl hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5"
                >
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                    {(minPrice || maxPrice || bedrooms || selectedAmenities.length > 0) && (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse ml-1"></span>
                    )}
                </button>
                <button 
                    onClick={handleApplyFilters}
                    className="h-[66px] px-10 bg-primary text-on-primary rounded-2xl flex items-center gap-3 font-bold text-sm uppercase tracking-widest shadow-glow hover:shadow-glow-lg transition-all"
                >
                    Search
                </button>
            </div>

            {/* Room Listing Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="glass-card rounded-3xl h-[480px] animate-pulse bg-surface-container-high/50 overflow-hidden">
                            <div className="h-2/3 bg-black/5 dark:bg-white/5"></div>
                            <div className="p-8 space-y-4">
                                <div className="h-6 w-3/4 bg-black/5 dark:bg-white/5 rounded-lg"></div>
                                <div className="h-4 w-1/2 bg-black/5 dark:bg-white/5 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : rooms.length === 0 ? (
                <div className="w-full py-32 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8 border border-black/5 dark:border-white/5">
                        <XCircle className="w-12 h-12 text-on-surface-variant/20" />
                    </div>
                    <h3 className="font-headline text-3xl font-bold text-on-surface mb-3">Không tìm thấy phòng nào</h3>
                    <p className="text-on-surface-variant max-w-md text-lg opacity-60">Hãy thử thay đổi điều kiện lọc hoặc từ khóa tìm kiếm để xem thêm các phòng khác.</p>
                </div>
            ) : viewMode === 'map' ? (
                <RoomMap rooms={rooms} />
            ) : (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {rooms.map((room) => {
                        const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80";
                        const imageUrl = room.anh_dai_dien || defaultImage;

                        return (
                            <div
                                key={room.ma_bat_dong_san}
                                className="glass-card rounded-[2rem] overflow-hidden transition-all duration-500 flex flex-col group hover:shadow-[0_20px_50px_rgba(168,164,255,0.15)]"
                            >
                                <div className="relative h-72 overflow-hidden bg-surface-container">
                                    <img
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        src={imageUrl}
                                        alt={room.ten}
                                    />
                                    <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-500">
                                        <button className="p-3 bg-surface/80 backdrop-blur-md rounded-2xl border border-black/10 dark:border-white/10 text-on-surface hover:text-primary transition-colors">
                                            <Filter className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h3 className="font-headline text-2xl font-bold text-on-background line-clamp-1 group-hover:text-primary transition-colors">
                                                {room.ten}
                                            </h3>
                                            <p className="text-on-surface-variant text-sm flex items-center gap-1.5 opacity-60">
                                                <MapPin className="w-4 h-4 shrink-0 text-primary" />
                                                {room.quan_huyen}, {room.thanh_pho}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mb-8">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-[11px] font-bold text-on-surface-variant">
                                            <Home className="w-3.5 h-3.5 text-primary" />
                                            {room.so_phong_ngu || 1} Bed
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 text-[11px] font-bold text-on-surface-variant">
                                            <LayoutGrid className="w-3.5 h-3.5 text-secondary" />
                                            {room.dien_tich} m²
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold ${
                                            room.trang_thai === 'da_thue' || room.trang_thai === 'dang_thue'
                                                ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                : 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                room.trang_thai === 'da_thue' || room.trang_thai === 'dang_thue'
                                                    ? 'bg-orange-400'
                                                    : 'bg-[#22C55E] animate-pulse'
                                            }`}></span>
                                            {room.trang_thai === 'da_thue' || room.trang_thai === 'dang_thue' ? 'Đã cho thuê' : 'Phòng trống'}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                                        <div>
                                            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-1 opacity-40">Monthly Rent</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-bold text-primary">{formatOasis(room.gia_thue)}</span>
                                                <span className="text-sm font-bold text-primary/60">OASIS</span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/rooms/${room.ma_bat_dong_san}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-4 bg-surface-container-highest hover:bg-primary hover:text-on-primary rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-glow-sm hover:shadow-glow"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </section>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && viewMode !== 'map' && (
                <footer className="mt-24 flex justify-center items-center gap-3">
                    <button 
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed group"
                    >
                        <ChevronLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button 
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all font-bold text-sm ${page === i + 1 ? 'bg-primary text-on-primary shadow-glow' : 'border border-black/5 dark:border-white/5 text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5'}`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button 
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 dark:bg-white/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed group"
                    >
                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                    </button>
                </footer>
            )}
        </div>
    );
}


