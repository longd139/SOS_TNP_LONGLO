# SOS TNP — Prototype V2

## Cách chạy

### 1. Chuyển entry point sang AppV2

Mở `src/index.js`, sửa 2 dòng:

```diff
- import App from './App.jsx';
+ import AppV2 from './mock/AppV2';

- <App />
+ <AppV2 />
```

### 2. Chạy dev server

```bash
npm start
```

Mở `http://localhost:3000/v2/`

> Sau khi test xong revert 2 dòng trong `index.js` để về app gốc.

---

## Đối tượng sử dụng & Role switcher

| Role | Mô tả | Mặc định |
|------|-------|----------|
| `CITIZEN` | Người dân — gửi & theo dõi phản ánh | |
| `RECEPTION_OFFICER` | Cán bộ tiếp nhận — tiếp nhận, phân công | |
| `PROCESSING_OFFICER` | Cán bộ xử lý — cập nhật tiến độ, đề nghị gia hạn | |
| `APPROVER` / `LEADER` | Lãnh đạo — duyệt gia hạn, xem dashboard | ✅ mặc định |
| `ADMIN` | Quản trị viên — tất cả quyền | |

Đổi role: click nút role trên Header (góc phải) → chọn role → tự động chuyển sang trang phù hợp.

---

## Sitemap

### Public (người dân)
| Path | Trang | Mô tả |
|------|-------|-------|
| `/v2/` | Gửi phản ánh | Form tạo phản ánh mới (PAGE C-01) |
| `/v2/my-complaints` | Phản ánh của tôi | Danh sách + lọc + tab trạng thái (PAGE C-02) |
| `/v2/complaint/:id` | Chi tiết phản ánh | Timeline công khai + kết quả (PAGE C-03) |

### Admin
| Path | Trang | Mô tả |
|------|-------|-------|
| `/v2/dashboard` | Dashboard tổng quan | KPI + 5 biểu đồ + 2 bảng (PAGE D-01) |
| `/v2/dashboard/neighborhood` | Dashboard khu phố | So sánh + drill-down (PAGE D-02) |
| `/v2/dashboard/large-screen` | Màn hình lớn | Dark theme, auto-refresh, fullscreen (PAGE D-03) |
| `/v2/admin/complaints` | Quản lý phản ánh | Danh sách + 8 tab nhanh + 15 bộ lọc (PAGE A-01) |
| `/v2/admin/complaints/:id` | Chi tiết phản ánh | 2-cột: nội dung + xử lý + 6 modal thao tác (PAGE A-02) |
| `/v2/admin/extensions` | Quản lý gia hạn | Danh sách + phê duyệt (PAGE E-02) |
| `/v2/admin/extensions/:id` | Chi tiết gia hạn | Duyệt / từ chối + timeline (PAGE E-03) |

### Placeholder
| Path | Mô tả |
|------|-------|
| `/v2/categories`, `/v2/neighborhoods`, `/v2/departments`, `/v2/users`, `/v2/settings` | Placeholder "Đang phát triển" |

---

## Luồng nghiệp vụ chính

```
Người dân gửi PA
  → Cán bộ tiếp nhận (tiếp nhận / từ chối)
    → Xác nhận mức độ + hạn SLA
      → Phân công đơn vị + cán bộ
        → Cập nhật tiến độ (ghi chú + minh chứng)
          → Đề nghị gia hạn (nếu cần)
            → Lãnh đạo phê duyệt / từ chối
              → Hoàn thành (đúng hạn / trễ hạn)
                → Dashboard cập nhật
```

---

## Mock Database

Toàn bộ dữ liệu nằm trong `src/mock/db.js`, gồm 9 bảng:

| Bảng | Số bản ghi |
|------|-----------|
| users | 16 (5 roles) |
| neighborhoods | 12 (11 active) |
| categories | 8 |
| departments | 5 |
| complaints | 63 (đủ mọi trạng thái) |
| attachments | Tự sinh theo `hasImages` |
| assignments | Tạo khi phân công |
| extensions | Tạo khi đề nghị GH |
| history | Tạo cho mọi thao tác |

Dữ liệu reset mỗi lần refresh trang (React state, không persist).

---

## Quy tắc SLA

| Loại | Thời hạn | Cảnh báo sắp hết hạn |
|------|----------|---------------------|
| Khẩn cấp | 24 giờ | Trước 6 giờ |
| Thông thường | 3-5 ngày (chọn khi tiếp nhận) | Trước 24 giờ |

Trạng thái SLA: `ON_TIME` → `NEAR_DUE` → `OVERDUE` → `COMPLETED_ON_TIME` / `COMPLETED_LATE`

`originalDeadline` không bao giờ bị ghi đè — `currentDeadline` cập nhật khi gia hạn.

---

## Cấu trúc thư mục pages-v2

```
src/pages-v2/
├── PlaceholderPage.jsx          # Trang "Đang phát triển"
├── citizen/
│   ├── SubmitComplaint.jsx      # PAGE C-01
│   ├── MyComplaints.jsx         # PAGE C-02
│   └── CitizenComplaintDetail.jsx # PAGE C-03
├── admin/
│   ├── ComplaintList.jsx        # PAGE A-01
│   ├── ComplaintDetail.jsx      # PAGE A-02 (6 modal nội tuyến)
│   ├── ExtensionList.jsx        # PAGE E-02
│   └── ExtensionDetail.jsx      # PAGE E-03
└── dashboard/
    ├── DashboardOverview.jsx    # PAGE D-01
    ├── DashboardNeighborhood.jsx # PAGE D-02
    └── DashboardLargeScreen.jsx # PAGE D-03
```

## Shared components

| File | Mô tả |
|------|-------|
| `src/mock/MockContext.jsx` | State management (useReducer) |
| `src/mock/db.js` | Mock data + helpers (getStatusColor, SLA compute...) |
| `src/mock/components/Badges.jsx` | StatusBadge, SlaBadge, UrgencyBadge |
| `src/mock/components/HeaderV2.jsx` | Header + role switcher |
| `src/mock/components/SidebarV2.jsx` | Sidebar lọc menu theo role |
| `src/components/dashboard/Chart.jsx` | Chart wrapper (line/bar) |
| `src/components/dashboard/StatCard.jsx` | KPI card |
