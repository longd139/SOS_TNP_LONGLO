// ============================================================
// CÁCH CHẠY PROTOTYPE V2 (không đụng code cũ)
// ============================================================
//
// B1: Mở src/index.js
// B2: TẠM THỜI sửa 2 dòng:
//
//   Dòng 4:  import App from './App.jsx';
//   → SỬA:   import AppV2 from './mock/AppV2';
//
//   Dòng 16: <App />
//   → SỬA:   <AppV2 />
//
// B3: Chạy npm start
// B4: Mở http://localhost:3000/v2/
//
// Sau khi test xong, revert lại 2 dòng trên để về app gốc.
//
// Role mặc định: Lãnh đạo (APPROVER)
// Đổi role: click nút "Lãnh đạo ▼" trên Header → chọn role khác
//
// Các trang:
//   /v2/                          — Gửi phản ánh (người dân)
//   /v2/my-complaints             — Phản ánh của tôi
//   /v2/complaint/:id             — Chi tiết (dân)
//   /v2/dashboard                 — Dashboard tổng quan
//   /v2/dashboard/neighborhood    — Dashboard khu phố
//   /v2/dashboard/large-screen    — Màn hình lớn
//   /v2/admin/complaints          — DS phản ánh (quản trị)
//   /v2/admin/complaints/:id      — Chi tiết + xử lý
//   /v2/admin/extensions          — DS gia hạn
//   /v2/admin/extensions/:id      — Phê duyệt gia hạn
// ============================================================
