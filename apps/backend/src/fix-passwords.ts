import pool from "./config/db";
import bcrypt from "bcrypt";

const fixData = async () => {
    try {
        console.log("Đang bắt đầu cập nhật mật khẩu...");
        const hash = await bcrypt.hash('123456', 10);
        await pool.query(`UPDATE nguoi_dung SET mat_khau_hash = $1`, [hash]);
        console.log("🎉 XONG! Toàn bộ mật khẩu trong Database đã được reset tĩnh thành: 123456");
        console.log("Bây giờ bạn có thể quay lại Postman để test Login!");
        process.exit(0);
    } catch(err) {
        console.error("Lỗi:", err);
        process.exit(1);
    }
}

fixData();
