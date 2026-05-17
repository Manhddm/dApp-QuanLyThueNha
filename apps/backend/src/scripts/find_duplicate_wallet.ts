import pool from "../config/db";

async function findDuplicateWallet() {
    try {
        const wallet = "0x20Cd834Ce3BAAc78E8DA4aBAc63a506327b95b91";
        const res = await pool.query(`
            SELECT ma_nguoi_dung, ho_ten, email, dia_chi_vi 
            FROM nguoi_dung 
            WHERE LOWER(dia_chi_vi) = LOWER($1);
        `, [wallet]);
        console.log("Người dùng đang sử dụng ví này:");
        console.table(res.rows);
        process.exit(0);
    } catch (error) {
        console.error("Lỗi:", error);
        process.exit(1);
    }
}

findDuplicateWallet();
