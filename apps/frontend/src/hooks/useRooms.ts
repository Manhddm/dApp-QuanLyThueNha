import { useState, useEffect, useMemo, useCallback } from 'react';
import { mockRooms } from '../data/mockRooms';

export interface Room {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    deposit: number;
    location: string;
    amenities: Array<{ name: string; icon: string }>;
    isAvailable: boolean;
    createdAt: string;
    owner: string;
}

export interface RoomFilters {
    location: string;
    priceMax: number;
    isAvailable: boolean;
}

export const useRooms = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<RoomFilters>({
        location: '',
        priceMax: 50000000, // Thay ranh giới giá tối đa do đơn vị chuyển từ ETH -> VNĐ
        isAvailable: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const fetchRooms = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/bat-dong-san");
            const result = await response.json();
            
            if (result.success && result.data) {
                // Map DB schema sang Frontend Schema cũ để tránh breaking UI
                const mappedRooms: Room[] = result.data.map((r: any) => ({
                    id: r.ma_bat_dong_san,
                    title: r.ten,
                    description: r.mo_ta || "Chưa có mô tả chi tiết.",
                    image: r.duong_dan_anh || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
                    price: parseFloat(r.gia_thue),
                    deposit: parseFloat(r.tien_dat_coc),
                    location: `${r.dia_chi}, ${r.phuong_xa ? r.phuong_xa + ', ' : ''}${r.quan_huyen}, ${r.thanh_pho}`,
                    amenities: r.tien_nghi || [],
                    isAvailable: r.trang_thai === 'trong',
                    createdAt: r.ngay_tao,
                    owner: (r.ma_chu_so_huu || "Unknown").toString()
                }));
                setRooms(mappedRooms);
            } else {
                setRooms(mockRooms); // Fallback về mock data nếu fail
            }
        } catch (error) {
            console.error("Lỗi fetch rooms", error);
            setRooms(mockRooms); // Fallback
        } finally {
            setLoading(false);
        }
    }, []);

    // Load data from actual endpoint
    useEffect(() => {
        fetchRooms();
    }, [fetchRooms]);

    // Filter and paginate rooms
    const filteredRooms = useMemo(() => {
        return rooms.filter(room => {
            const matchesLocation = !filters.location ||
                room.location.toLowerCase().includes(filters.location.toLowerCase()) ||
                room.title.toLowerCase().includes(filters.location.toLowerCase());

            const matchesPrice = room.price <= filters.priceMax;

            const matchesAvailability = !filters.isAvailable || room.isAvailable;

            return matchesLocation && matchesPrice && matchesAvailability;
        });
    }, [rooms, filters]);

    const totalItems = filteredRooms.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedRooms = filteredRooms.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const deleteRoom = (id: number) => {
        setRooms(prev => prev.filter(room => room.id !== id));
    };

    return {
        rooms: paginatedRooms,
        allRooms: rooms,
        loading,
        filters,
        setFilters,
        currentPage,
        setCurrentPage,
        totalPages,
        totalItems,
        deleteRoom,
        refreshRooms: fetchRooms
    };
};