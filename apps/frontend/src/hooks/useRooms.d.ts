export interface Room {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    deposit: number;
    location: string;
    amenities: Array<{
        name: string;
        icon: string;
    }>;
    isAvailable: boolean;
    createdAt: string;
    owner: string;
    pdfContract?: string;
}
export interface RoomFilters {
    location: string;
    priceMax: number;
    isAvailable: boolean;
}
export declare const useRooms: () => {
    rooms: Room[];
    allRooms: Room[];
    loading: boolean;
    filters: RoomFilters;
    setFilters: import("react").Dispatch<import("react").SetStateAction<RoomFilters>>;
    currentPage: number;
    setCurrentPage: import("react").Dispatch<import("react").SetStateAction<number>>;
    totalPages: number;
    totalItems: number;
    deleteRoom: (id: number) => void;
    refreshRooms: () => Promise<void>;
};
