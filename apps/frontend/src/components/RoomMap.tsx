import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatOasis } from '../lib/utils';

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

// Function to create custom house marker with image and name
const createHouseIcon = (room: any) => {
    const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80";
    const imageUrl = room.anh_dai_dien || defaultImage;
    
    return L.divIcon({
        className: 'custom-house-marker',
        html: `
            <div class="house-marker-container">
                <div class="house-marker-label">
                    <img src="${imageUrl}" />
                    <span>${room.ten}</span>
                </div>
                <div class="house-marker-icon-wrapper">
                    🏠
                </div>
            </div>
        `,
        iconSize: [0, 0], // Size is handled by CSS
        iconAnchor: [18, 18], // Center the circle
        popupAnchor: [0, -60]
    });
};

// Component để điều khiển view của bản đồ
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                animate: true,
                duration: 1.5 // giây
            });
        }
    }, [center, zoom, map]);
    return null;
}

export default function RoomMap({ rooms }: { rooms: any[] }) {
    // Chỉ hiển thị các phòng có tọa độ hợp lệ
    const validRooms = rooms.filter(r => r.vi_do && r.kinh_do);
    
    const [selectedPos, setSelectedPos] = useState<[number, number] | null>(null);
    
    // Nếu có phòng, center bản đồ vào phòng đầu tiên, ngược lại center vào Hà Nội
    const initialCenter = validRooms.length > 0 
        ? [parseFloat(validRooms[0].vi_do), parseFloat(validRooms[0].kinh_do)] as [number, number]
        : HANOI_COORDS;

    return (
        <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-white/10 relative z-0 shadow-2xl">
            <MapContainer 
                center={initialCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
            >
                {selectedPos && <ChangeView center={selectedPos} zoom={16} />}
                <TileLayer
                    attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                    url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                    maxZoom={20}
                />
                
                {validRooms.map(room => {
                    const defaultImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80";
                    const imageUrl = room.anh_dai_dien || defaultImage;

                    return (
                        <Marker 
                            key={room.ma_bat_dong_san} 
                            position={[parseFloat(room.vi_do), parseFloat(room.kinh_do)]}
                            icon={createHouseIcon(room)}
                            eventHandlers={{
                                click: () => {
                                    setSelectedPos([parseFloat(room.vi_do), parseFloat(room.kinh_do)]);
                                }
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="w-[200px] overflow-hidden flex flex-col gap-2">
                                    <img 
                                        src={imageUrl} 
                                        alt={room.ten} 
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <div className="pt-1">
                                        <h3 className="font-bold text-sm text-gray-900 leading-tight line-clamp-1">{room.ten}</h3>
                                        <p className="text-primary font-bold mt-1 text-sm">{formatOasis(room.gia_thue)} OASIS</p>
                                        <p className="text-xs text-gray-500 flex items-start gap-1 mt-1 line-clamp-2">
                                            <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                            {room.dia_chi}
                                        </p>
                                        <Link 
                                            to={`/rooms/${room.ma_bat_dong_san}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full text-center bg-primary hover:bg-primary-dim text-white text-xs font-bold py-2 rounded-lg mt-3 transition-colors"
                                        >
                                            Xem chi tiết
                                        </Link>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
            
            {validRooms.length === 0 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-surface-container-highest/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-lg text-sm font-semibold text-on-surface flex items-center gap-2">
                    <Info size={16} className="text-secondary" />
                    Không có phòng nào có thông tin tọa độ để hiển thị trên bản đồ.
                </div>
            )}
        </div>
    );
}
