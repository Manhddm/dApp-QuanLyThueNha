import pool from "../config/db";

async function resetRooms() {
    try {
        console.log("Đang đặt lại tất cả trạng thái phòng thành 'trong' (Phòng trống)...");
        const res = await pool.query(`
            UPDATE bat_dong_san 
            SET trang_thai = 'trong';
        `);
        console.log(`✅ Thành công! Đã cập nhật ${res.rowCount} phòng về trạng thái Trống.`);
        
        // Xóa tất cả các hợp đồng ở database nếu có (nếu deploy lại smart contract thì các hợp đồng cũ ở database cũng nên được xoá/reset)
        console.log("Đang xóa tất cả các hợp đồng cũ ở database...");
        const res2 = await pool.query(`
            DELETE FROM hop_dong;
        `);
        console.log(`✅ Thành công! Đã xóa ${res2.rowCount} hợp đồng cũ ở database.`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi khi reset dữ liệu:", error);
        process.exit(1);
    }
}

resetRooms();
