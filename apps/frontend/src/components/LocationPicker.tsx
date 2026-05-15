import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Navigation } from 'lucide-react';

// Fix Leaflet marker icon issue in React/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
});
L.Marker.prototype.options.icon = DefaultIcon;

const HANOI_COORDS: [number, number] = [21.0285, 105.8542];

interface LocationPickerProps {
    position: [number, number] | null;
    onChange: (lat: number, lng: number) => void;
    addressContext?: string; // e.g. "Quận 1, TP. Hồ Chí Minh"
}

// Component to handle map clicks
function MapEvents({ onChange }: { onChange: (lat: number, lng: number) => void }) {
    useMapEvents({
        click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Component to auto-center map when position prop changes externally (e.g. search)
function MapUpdater({ position }: { position: [number, number] | null }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 16);
        }
    }, [position, map]);
    return null;
}

export default function LocationPicker({ position, onChange, addressContext }: LocationPickerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const markerRef = useRef<any>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        
        // Kiểm tra nếu người dùng dán tọa độ (VD: 21.0285, 105.8542)
        const coordRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
        const match = searchQuery.trim().match(coordRegex);
        if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[3]);
            onChange(lat, lng);
            return;
        }

        setIsSearching(true);
        try {
            // Tự động nối thêm thông tin Thành phố/Quận Huyện (nếu có) để tìm kiếm chính xác hơn
            let finalQuery = searchQuery;
            if (addressContext && !searchQuery.toLowerCase().includes(addressContext.split(',')[0].toLowerCase())) {
                finalQuery = `${searchQuery}, ${addressContext}`;
            }

            // Thêm tham số giới hạn tìm kiếm ở Việt Nam (countrycodes=vn) và ưu tiên tiếng Việt (accept-language=vi)
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(finalQuery)}&countrycodes=vn&accept-language=vi&limit=5`);
            const data = await res.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);
                onChange(lat, lon);
            } else {
                alert("Không tìm thấy địa chỉ này. Hãy thử từ khóa khác hoặc dán tọa độ từ Google Maps.");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Lỗi tìm kiếm địa chỉ.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleGetCurrentLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    onChange(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Không thể lấy vị trí hiện tại. Hãy đảm bảo bạn đã cấp quyền truy cập vị trí.");
                }
            );
        } else {
            alert("Trình duyệt của bạn không hỗ trợ định vị.");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm vị trí (VD: Hồ Gươm, Hà Nội)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-surface-container-highest border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder:text-on-surface-variant/40"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <Search size={16} /> {isSearching ? "Đang tìm..." : "Tìm"}
                </button>
                <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    title="Sử dụng vị trí GPS hiện tại"
                    className="bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20 p-3 rounded-xl transition-all shadow-sm"
                >
                    <Navigation size={18} />
                </button>
            </div>

            {/* Bản đồ */}
            <div className="w-full h-[300px] rounded-xl overflow-hidden border border-white/10 relative z-0">
                <MapContainer 
                    center={position || HANOI_COORDS} 
                    zoom={position ? 16 : 12} 
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                        url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                        maxZoom={20}
                    />
                    <MapEvents onChange={onChange} />
                    <MapUpdater position={position} />
                    {position && (
                        <Marker 
                            position={position} 
                            draggable={true}
                            ref={markerRef}
                            eventHandlers={{
                                dragend() {
                                    const marker = markerRef.current;
                                    if (marker != null) {
                                        const pos = marker.getLatLng();
                                        onChange(pos.lat, pos.lng);
                                    }
                                }
                            }}
                        />
                    )}
                </MapContainer>
            </div>
            
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest text-center mt-1">
                Kéo thả ghim hoặc click trên bản đồ để chọn vị trí chính xác
            </p>
        </div>
    );
}
