import pool from "../config/db";

async function checkSchema() {
    try {
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'bat_dong_san' 
            AND column_name IN ('gia_thue', 'tien_dat_coc');
        `);
        console.log("Cấu trúc cột hiện tại:");
        console.table(res.rows);
        process.exit(0);
    } catch (error) {
        console.error("Lỗi:", error);
        process.exit(1);
    }
}

checkSchema();
