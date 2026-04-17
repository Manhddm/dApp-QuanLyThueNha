export const mockRooms = [
    {
        id: 1,
        title: "Phòng trọ cao cấp Quận 1",
        description: "Căn hộ hiện đại với view biển tuyệt đẹp, đầy đủ tiện nghi cao cấp. Phòng rộng rãi, thoáng đãng với ban công riêng. Khu vực an ninh 24/7, gần trung tâm thương mại và trường học.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
        price: 1.2,
        deposit: 2.4,
        location: "Quận 1, TP.HCM",
        amenities: [
            { name: "WiFi tốc độ cao", icon: "wifi" },
            { name: "Điều hòa", icon: "ac_unit" },
            { name: "Máy giặt", icon: "local_laundry_service" },
            { name: "Bếp điện", icon: "kitchen" },
            { name: "An ninh 24/7", icon: "security" },
            { name: "Gần trường học", icon: "school" },
            { name: "Gần chợ", icon: "shopping_cart" },
            { name: "Thang máy", icon: "elevator" }
        ],
        isAvailable: true,
        createdAt: "2024-01-15",
        owner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
    },
    {
        id: 2,
        title: "Căn hộ studio Bình Thạnh",
        description: "Studio hiện đại dành cho người trẻ, thiết kế tối giản nhưng đầy đủ tiện nghi. Gần công viên và trung tâm mua sắm, giao thông thuận tiện.",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
        price: 0.8,
        deposit: 1.6,
        location: "Bình Thạnh, TP.HCM",
        amenities: [
            { name: "WiFi tốc độ cao", icon: "wifi" },
            { name: "Điều hòa", icon: "ac_unit" },
            { name: "Máy giặt", icon: "local_laundry_service" },
            { name: "Bếp điện", icon: "kitchen" },
            { name: "Gần công viên", icon: "park" },
            { name: "Gần shopping", icon: "shopping_bag" },
            { name: "Thang máy", icon: "elevator" },
            { name: "Camera an ninh", icon: "videocam" }
        ],
        isAvailable: true,
        createdAt: "2024-01-20",
        owner: "0x8ba1f109551bD4328030126452617683741619"
    },
    {
        id: 3,
        title: "Phòng trọ giá rẻ Quận 7",
        description: "Phòng trọ sạch sẽ, giá hợp lý cho sinh viên và người đi làm. Khu vực yên tĩnh, gần chợ và trường học.",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
        price: 0.3,
        deposit: 0.6,
        location: "Quận 7, TP.HCM",
        amenities: [
            { name: "WiFi cơ bản", icon: "wifi" },
            { name: "Quạt trần", icon: "toys" },
            { name: "Bếp gas", icon: "kitchen" },
            { name: "Gần chợ", icon: "shopping_cart" },
            { name: "Gần trường học", icon: "school" },
            { name: "Khu yên tĩnh", icon: "home" }
        ],
        isAvailable: false,
        createdAt: "2024-01-10",
        owner: "0x3f4E77bF2C8bB2c4F1E9a3B5D6E8F2A1C9B7E5"
    },
    {
        id: 4,
        title: "Căn hộ duplex Phú Nhuận",
        description: "Căn hộ duplex 2 tầng sang trọng với thiết kế hiện đại. Phòng khách rộng rãi, phòng ngủ riêng biệt, ban công view đẹp.",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
        price: 2.5,
        deposit: 5.0,
        location: "Phú Nhuận, TP.HCM",
        amenities: [
            { name: "WiFi tốc độ cao", icon: "wifi" },
            { name: "Điều hòa 2 chiều", icon: "ac_unit" },
            { name: "Máy giặt sấy", icon: "local_laundry_service" },
            { name: "Bếp từ", icon: "kitchen" },
            { name: "An ninh 24/7", icon: "security" },
            { name: "Bãi đậu xe", icon: "local_parking" },
            { name: "Thang máy", icon: "elevator" },
            { name: "Hồ bơi", icon: "pool" }
        ],
        isAvailable: true,
        createdAt: "2024-01-25",
        owner: "0x9c2D4E6F8A1B3C5E7F9A2B4C6D8E0F2A4B6"
    },
    {
        id: 5,
        title: "Phòng trọ Tân Bình",
        description: "Phòng trọ tiện lợi cho người đi làm, gần chợ Bến Thành và các tuyến xe buýt. Khu vực sầm uất nhưng vẫn yên tĩnh.",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
        price: 0.5,
        deposit: 1.0,
        location: "Tân Bình, TP.HCM",
        amenities: [
            { name: "WiFi tốc độ cao", icon: "wifi" },
            { name: "Điều hòa", icon: "ac_unit" },
            { name: "Bếp gas", icon: "kitchen" },
            { name: "Gần chợ Bến Thành", icon: "shopping_cart" },
            { name: "Gần xe buýt", icon: "directions_bus" },
            { name: "Khu an toàn", icon: "security" }
        ],
        isAvailable: true,
        createdAt: "2024-01-18",
        owner: "0x1A3B5C7D9E2F4A6B8C0D2E4F6A8B0C2D4"
    },
    {
        id: 6,
        title: "Căn hộ cao cấp Quận 2",
        description: "Căn hộ cao cấp với view sông Sài Gòn tuyệt đẹp. Thiết kế hiện đại, nội thất cao cấp nhập khẩu. Dịch vụ quản lý chuyên nghiệp.",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
        price: 3.8,
        deposit: 7.6,
        location: "Quận 2, TP.HCM",
        amenities: [
            { name: "WiFi tốc độ cao", icon: "wifi" },
            { name: "Điều hòa trung tâm", icon: "ac_unit" },
            { name: "Máy giặt sấy", icon: "local_laundry_service" },
            { name: "Bếp từ", icon: "kitchen" },
            { name: "An ninh 24/7", icon: "security" },
            { name: "Bãi đậu xe", icon: "local_parking" },
            { name: "Thang máy", icon: "elevator" },
            { name: "Hồ bơi", icon: "pool" },
            { name: "Gym", icon: "fitness_center" },
            { name: "Spa", icon: "spa" }
        ],
        isAvailable: true,
        createdAt: "2024-01-30",
        owner: "0x5F7A9B3D1E4C6F8A2B0D4E6F8A1C3B5"
    }
];