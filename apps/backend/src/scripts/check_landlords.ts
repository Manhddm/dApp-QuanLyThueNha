import pool from "../config/db";

async function checkLandlords() {
    try {
        const res = await pool.query(`
            SELECT ma_nguoi_dung, ho_ten, dia_chi_vi, vai_tro 
            FROM nguoi_dung 
            WHERE vai_tro = 'chu_nha';
        `);
        console.log("Danh sách chủ nhà:");
        console.table(res.rows);
        process.exit(0);
    } catch (error) {
        console.error("Lỗi:", error);
        process.exit(1);
    }
}

checkLandlords();
