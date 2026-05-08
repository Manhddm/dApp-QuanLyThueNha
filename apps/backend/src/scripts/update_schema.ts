import pool from "../config/db";

async function updateSchema() {
    try {
        console.log("Đang cập nhật kiểu dữ liệu cho bảng bat_dong_san...");
        await pool.query(`
            ALTER TABLE bat_dong_san 
            ALTER COLUMN gia_thue TYPE NUMERIC(20, 10),
            ALTER COLUMN tien_dat_coc TYPE NUMERIC(20, 10);
        `);
        console.log("Đang cập nhật kiểu dữ liệu cho bảng hop_dong...");
        await pool.query(`
            ALTER TABLE hop_dong 
            ALTER COLUMN tien_thue_hang_thang TYPE NUMERIC(20, 10),
            ALTER COLUMN tien_dat_coc TYPE NUMERIC(20, 10);
        `);
        console.log("✅ Cập nhật schema thành công!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi cập nhật schema:", error);
        process.exit(1);
    }
}

updateSchema();
