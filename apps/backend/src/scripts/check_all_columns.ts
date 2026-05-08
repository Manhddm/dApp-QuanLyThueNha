import pool from "../config/db";

async function checkAllColumns() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'bat_dong_san';
        `);
        console.log("Cấu trúc bảng bat_dong_san:");
        console.table(res.rows);
        process.exit(0);
    } catch (error) {
        console.error("Lỗi:", error);
        process.exit(1);
    }
}

checkAllColumns();
