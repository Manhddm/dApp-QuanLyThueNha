import pool from "./src/config/db"; 

const updatePassword = async () => {
    try {
        const hash = "$2b$10$B5RNGXNaH1zy.igxmZtinuetYuWQfyJZAHpVe1RU3ApnHaDvHEm1S";
        await pool.query("UPDATE nguoi_dung SET mat_khau_hash = $1", [hash]);
        console.log("Updated OK");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updatePassword();
