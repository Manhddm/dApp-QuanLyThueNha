import { useState, useEffect, useMemo } from 'react';
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
        priceMax: 5,
        isAvailable: false
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Load mock data
    useEffect(() => {
        const loadRooms = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            setRooms(mockRooms);
            setLoading(false);
        };
        loadRooms();
    }, []);

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
        deleteRoom
    };
};