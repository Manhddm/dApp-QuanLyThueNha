# Nhật Ký Thiết Lập Chức Năng Backend (Phase 1)
*Ngày cập nhật: 27/03/2026*

## 1. Mục Tiêu
Cấu trúc lại thư mục dự án Backend Node.js từ một file `index.ts` duy nhất thành mô hình Layered Architecture (REST API) chuyên nghiệp, đồng thời khắc phục lỗi kết nối DB. Bố trí sẵn các tầng cần thiết để chuẩn bị cho việc xây dựng tính năng Đăng ký/Đăng nhập (Auth).

## 2. Các Thay Đổi Cốt Lõi

### A. Cấu Trúc Khung Dự Án (Architecture)
Đã chia tách dự án thành các thư mục riêng biệt trong `src/`:
- `config/`: Chứa file `db.ts` cấu hình PostgreSQL Pool connection dùng chung thay vì để lộn xộn trong `index.ts`.
- `middlewares/`: Nơi chứa các lớp lá chắn cho API trước khi logic chính được gọi.
- `models/`: Tầng giao tiếp trực tiếp với cơ sở dữ liệu (thực thi câu lệnh SQL trực tiếp thông qua thư viện `pg`).
- `services/`: Tầng xử lý logic nghiệp vụ (Business logic layer).
- `controllers/`: Tầng tiếp nhận Request từ người dùng, gọi xuống Service, và trả về Response JSON.
- `routes/`: Tầng định tuyến URL (Endpoint API) và kết nối với Middleware + Controller.

### B. Cài Đặt Thư Viện Chuyên Dụng (Dependencies)
- **Cài đặt Authentication:** `bcrypt` (dùng để mã hóa mật khẩu) và `jsonwebtoken` (tạo và kiểm tra token phiên làm việc).
- **Cài đặt Type Declarations:** `@types/bcrypt` và `@types/jsonwebtoken` để hỗ trợ môi trường TypeScript.

### C. Khởi Tạo Chức Năng Báo Cáo & Xác Thực (Auth Module)
- **Model (`userModel.ts`):** Xây dựng các hàm `findUserByEmail`, `createUser`, `findUserById`, `updateUser` dựa trên các cột định nghĩa trong ERD (mã_người_dùng, email, mật_khẩu_hash, vai_trò...).
- **Service (`authService.ts`):** Tạo luồng nghiệp vụ cho `registerUser` (kiểm tra tồn tại, hash password) và `loginUser` (so sánh password, sinh ra JWT kéo dài 7 ngày).
- **Controller (`authController.ts`):** Xử lý đầu vào Body Request, trả về JSON bao gồm Token và Dữ liệu người dùng (ẩn mật khẩu).
- **Routes (`authRoutes.ts`):** Expose 3 endpoints API đầu tiên: 
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`

### D. Các Middleware Bảo Mật
- **`errorHandler.ts`**: Hệ thống hứng bắt lỗi tập trung (Global error handler). Toàn bộ app không cần phải `try/catch` xuất log rườm rà. Chỉ cần `throw new Error()`, middleware này ở cuối `index.ts` sẽ đón nhận và trả chuẩn JSON Status 500 hoặc Status tương ứng.
- **`authMiddleware.ts`**: Middleware `verifyToken` giúp dịch ngược token JWT để lấy thông tin `ma_nguoi_dung`, xác thực quyền (Route Protected) thông qua `requireRole`. 

### E. Khắc Phục Lỗi Hệ Thống
- Đã khắc phục thành công lỗi `client password must be a string` đối với PostgreSQL bằng cách thay đổi đường dẫn tham chiếu `.env` của `dotenv`. 
- Thư viện `dotenv` đã được di chuyển cấp thiết lên đầu cùng của file `index.ts` và `db.ts` kết hợp với `path.resolve` để đảm bảo luôn đọc đúng cấu hình tại thư mục gốc của dApp cho dù được chạy từ terminal nào.

## 3. Trạng Thái Hiện Tại
- Lệnh chạy: `npm run dev` (hoặc `npx ts-node src/index.ts`) đang hoạt động tốt.
- Backend chạy ổn định tại port `3000`.
- Cơ sở dữ liệu Postgres báo kết nối ✅ Thành Công.

## 4. Các Bước Tiếp Theo (Next Steps)
Cần khởi tạo các Database schema thực tế vào PostgreSQL thông qua script SQL bám sát với bản vẽ `erd.puml`. Sau khi có bảng thực, ta có thể test trực tiếp API Register/Login qua Postman.
