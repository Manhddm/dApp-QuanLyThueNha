import pool from "../config/db";

async function fixLandlordWallets() {
    try {
        console.log("Đang cập nhật địa chỉ ví mặc định cho các chủ nhà chưa có ví...");
        // Sử dụng một địa chỉ ví test từ Hardhat (Account #0) nếu null
        const defaultWallet = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
        await pool.query(`
            UPDATE nguoi_dung 
            SET dia_chi_vi = $1 
            WHERE vai_tro = 'chu_nha' AND (dia_chi_vi IS NULL OR dia_chi_vi = '');
        `, [defaultWallet]);
        console.log("✅ Cập nhật hoàn tất!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Lỗi:", error);
        process.exit(1);
    }
}

fixLandlordWallets();
