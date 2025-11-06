# Work Schedule Components

Các component chuẩn để hiển thị và quản lý lịch tiếp dân.

## Components

### MonthCalendar

Component hiển thị lịch tháng với các chức năng:

- Hiển thị các ngày trong tháng theo định dạng lịch
- Đánh dấu ngày hiện tại
- Đánh dấu ngày có lịch tiếp dân
- Cho phép người dùng chọn ngày để xem chi tiết
- Highlight ngày được chọn
- **Chọn tháng/năm**: Click vào tiêu đề "Tháng X/Năm" để mở picker chọn tháng/năm
- **Điều hướng**: Nút mũi tên trái/phải để chuyển tháng trước/sau

**Props:**

- `month` (number): Tháng hiện tại (1-12)
- `year` (number): Năm hiện tại
- `onDateSelect` (function): Callback khi người dùng chọn ngày
- `onMonthChange` (function): Callback khi thay đổi tháng
- `onYearChange` (function): Callback khi thay đổi năm
- `selectedDate` (string): Ngày được chọn (format: YYYY-MM-DD)
- `hasScheduleForDay` (function): Function kiểm tra ngày có lịch hay không

**Usage:**

```jsx
<MonthCalendar
  month={11}
  year={2025}
  onDateSelect={(date) => console.log(date)}
  onMonthChange={(month) => setMonth(month)}
  onYearChange={(year) => setYear(year)}
  selectedDate="2025-11-06"
  hasScheduleForDay={hasScheduleForDay}
/>
```

### ScheduleList

Component hiển thị danh sách lịch tiếp dân với các chức năng:

- Hiển thị danh sách lịch tiếp dân
- Lọc theo ngày được chọn
- Hiển thị empty state khi không có lịch
- Hiển thị loading state
- Hiển thị error state
- Các action: Chỉnh sửa, Xóa lịch

**Props:**

- `schedules` (array): Danh sách lịch tiếp dân
- `loading` (boolean): Trạng thái đang tải
- `error` (string): Thông báo lỗi
- `onEdit` (function): Callback khi chỉnh sửa lịch
- `onDelete` (function): Callback khi xóa lịch
- `formatDate` (function): Function format ngày tháng
- `selectedDate` (string): Ngày được chọn để hiển thị thông tin tương ứng

**Usage:**

```jsx
<ScheduleList
  schedules={schedules}
  loading={false}
  error={null}
  onEdit={(schedule) => console.log(schedule)}
  onDelete={(schedule) => console.log(schedule)}
  formatDate={(date) => new Date(date).toLocaleDateString("vi-VN")}
  selectedDate="2025-11-06"
/>
```

## Features

### 1. Mặc định hiển thị lịch từ ngày hiện tại đến tương lai

- Redux selector `selectSchedulesForDisplay` đã được cập nhật để lọc lịch từ ngày hiện tại
- Tự động loại bỏ các lịch trong quá khứ

### 2. Chọn ngày để xem lịch

- Click vào ngày trên lịch tháng để xem lịch của ngày đó
- Ngày được chọn sẽ được highlight
- Danh sách lịch sẽ lọc theo ngày được chọn

### 3. Chọn tháng/năm để query lịch

- **Click vào tiêu đề**: Click vào "Tháng X/Năm" để mở month/year picker
- **Chọn năm**: Dropdown hiển thị 10 năm (5 năm trước và 5 năm sau năm hiện tại)
- **Chọn tháng**: Grid 3x4 các nút tháng, tháng hiện tại được highlight màu xanh
- **Đóng picker**: Click nút "Đóng" hoặc click ra ngoài overlay
- **Điều hướng nhanh**: Sử dụng nút mũi tên trái/phải để chuyển tháng trước/sau
- **Auto fetch**: Khi thay đổi tháng/năm, hệ thống tự động fetch lịch mới từ API
- **Reset selected date**: Khi thay đổi tháng/năm, ngày được chọn sẽ bị reset

### 4. Empty state

- Hiển thị thông báo rõ ràng khi không có lịch
- Phân biệt giữa "Chưa có lịch nào" và "Ngày X không có lịch"

### 5. Tương thích với API và Redux

- Sử dụng Redux Toolkit để quản lý state
- Tương thích với API response có field names:
  - `ngay_tiep_dan` hoặc `date`
  - `thoi_gian` hoặc `time`
  - `ten_can_bo` hoặc `leader`
  - `ghi_chu` hoặc `location`/`purpose`

## Updated Files

### Redux

- `workScheduleSelectors.js`: Thêm selector lọc lịch từ ngày hiện tại, thêm helper function để xử lý các field names khác nhau

### Hooks

- `useSchedule.js`: Thêm function `getSchedulesForDate` để lấy lịch theo ngày, export `setSelectedMonth` và `setSelectedYear`

### Components

- `MonthCalendar.jsx`: Component lịch tháng với month/year picker và navigation
- `ScheduleList.jsx`: Component danh sách lịch mới
- `index.js`: Export các components

### Pages

- `WorkSchedule.jsx`: Refactor để sử dụng các component mới, thêm handlers cho month/year changes

## UI/UX Features

### Month/Year Picker

- **Responsive design**: Dropdown hiển thị tốt trên cả mobile và desktop
- **Keyboard friendly**: Có thể sử dụng keyboard để chọn năm
- **Visual feedback**: Tháng hiện tại được highlight với màu xanh
- **Overlay**: Click overlay để đóng picker
- **Z-index**: Picker hiển thị trên các elements khác với z-index phù hợp

### Navigation

- **Intuitive icons**: Sử dụng ChevronLeft/ChevronRight icons rõ ràng
- **Hover effects**: Buttons có hover state để feedback tốt hơn
- **Smooth transitions**: Các thay đổi state diễn ra mượt mà

## Responsive Design

Các component đã được thiết kế responsive với Tailwind CSS:

- Mobile: Giao diện tối ưu cho màn hình nhỏ
- Tablet: Điều chỉnh kích thước phù hợp
- Desktop: Hiển thị đầy đủ với layout 2 cột
