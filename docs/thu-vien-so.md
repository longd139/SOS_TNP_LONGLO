# 📚 Thư Viện Số — Tài liệu kỹ thuật (Admin)

## 1. Tổng quan

Thư viện số là module dành cho **người dân** tra cứu tài liệu địa phương và văn bản pháp luật quốc gia. Giao diện tập trung vào trải nghiệm người dùng cuối (citizen-facing), không phải giao diện quản lý.

- **Route:** `/cong-dong/thu-vien-so`
- **File chính:** `src/citizen/pages/DigitalLibraryPage.jsx`
- **Service:** `src/services/libraryService.js`
- **Data:** `src/citizen/data/citizenData.js`

---

## 2. Kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                  DigitalLibraryPage                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ Search Bar  │  │ Search Results│  │ All Docs   │ │
│  │ (Hero)      │  │ (local + law) │  │ (browse)   │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│         │                │                 │         │
│         ▼                ▼                 ▼         │
│  ┌─────────────────────────────────────────────┐   │
│  │           libraryService.js                  │   │
│  │  ┌──────────────┐  ┌──────────────────────┐ │   │
│  │  │ MOCK_MODE=true│  │ MOCK_MODE=false      │ │   │
│  │  │ (dữ liệu ảo) │  │ (gọi API thật)       │ │   │
│  │  └──────────────┘  └──────────────────────┘ │   │
│  └─────────────────────────────────────────────┘   │
│         │                     │                     │
│         ▼                     ▼                     │
│  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ citizenData  │  │  BE API                   │   │
│  │ (mock DB)    │  │  GET /api/library/search  │   │
│  │              │  │  GET /api/library/laws/:id│   │
│  └──────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## 3. Các tính năng chính

### 3.1. Tìm kiếm

| Chức năng | Mô tả |
|-----------|-------|
| **Tìm tài liệu địa phương** | Search trong `libraryDocuments` (mock data) theo title, description, tags, author |
| **Tra cứu luật quốc gia** | Gọi `searchLaws()` từ `libraryService.js` — tìm trong 12+ bộ luật Việt Nam |
| **Kết quả kết hợp** | Hiển thị cả 2 loại trong cùng 1 grid, phân biệt bằng màu sắc (xanh = địa phương, cam = luật) |

### 3.2. Duyệt tài liệu

| Chức năng | Mô tả |
|-----------|-------|
| **Filter theo danh mục** | 4 danh mục: Tủ sách, Tài liệu, Văn bản, Bản đồ |
| **Grid 4 cột** | Hiển thị tối đa 8 docs, có nút "Xem tất cả (N)" |
| **DocCardV2** | Mỗi card có ảnh bìa, type badge, title, author, downloads, "Đọc ngay" |

### 3.3. Trang chi tiết

| Chức năng | Mô tả |
|-----------|-------|
| **Hero với ảnh bìa** | Ảnh bìa tài liệu làm nền blur, card nổi với ảnh + meta |
| **Sidebar** | Thông tin văn bản pháp luật (số hiệu, cơ quan, ngày ban hành, hiệu lực, trạng thái) + Mục lục |
| **Nội dung** | Giới thiệu + các section/chương (nếu có) |
| **Tài liệu liên quan** | Carousel scroll ngang |

### 3.4. Hiệu ứng

| Hiệu ứng | Mô tả |
|----------|-------|
| **Scroll reveal** | Các section fade-in + slide-up khi scroll đến |
| **Search card float** | Card tìm kiếm nổi lên từ hero |
| **Hover effects** | Cards nâng lên, shadow, zoom ảnh, CTA trượt vào |

---

## 4. Cấu trúc dữ liệu

### 4.1. Document (tài liệu địa phương)

```js
{
  id: 'sach-01',                    // ID duy nhất
  category: 'tu-sach',              // tu-sach | tai-lieu | van-ban | ban-do
  title: 'Tên tài liệu',
  author: 'Tác giả / Cơ quan',
  cover: 'https://...',             // URL ảnh bìa (600x400)
  description: 'Mô tả ngắn',
  downloads: 3842,                  // Số lượt tải
  featured: true,                   // Có nổi bật không
  docType: 'Sách',                  // Loại tài liệu
  tags: ['lịch sử', 'địa phương'], // Tags tìm kiếm
  sections: [                       // Nội dung phân chương (optional)
    { heading: 'Chương 1: ...', content: 'Nội dung...' },
  ],
  // Dành riêng cho văn bản pháp luật:
  issuingAgency: 'UBND Phường...',  // Cơ quan ban hành
  issuedDate: '15/06/2025',         // Ngày ban hành
  effectiveDate: '01/07/2025',      // Ngày hiệu lực
  status: 'Đang hiệu lực',          // Trạng thái
  code: 'Số 123/QĐ-UBND',          // Số hiệu văn bản
}
```

### 4.2. Law (luật quốc gia — từ libraryService)

```js
{
  id: 'law-hp-2013',
  type: 'Hiến pháp',               // Hiến pháp | Bộ luật | Luật | Nghị định
  code: 'Hiến pháp 2013',
  title: 'Hiến Pháp Nước CHXHCN Việt Nam',
  issuingAgency: 'Quốc hội',
  issuedDate: '28/11/2013',
  effectiveDate: '01/01/2014',
  status: 'Đang hiệu lực',
  summary: 'Mô tả ngắn...',
  tags: ['hiến pháp', 'luật cơ bản'],
  chapters: [
    { title: 'Chương I: ...', articles: ['Điều 1: ...', 'Điều 2: ...'] }
  ],
  downloads: 256800,
}
```

---

## 5. Kết nối Backend

### 5.1. Chuyển từ MOCK sang API thật

**Bước 1:** Mở `src/services/libraryService.js`

```js
const MOCK_MODE = false; // ← Đổi thành false
```

**Bước 2:** Đảm bảo BE có các endpoint sau:

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/library/search` | Tìm kiếm luật |
| `GET` | `/api/library/laws/:id` | Chi tiết 1 luật |
| `GET` | `/api/library/laws/featured` | Luật nổi bật |
| `GET` | `/api/library/stats` | Thống kê |

**Params cho `/api/library/search`:**
```
?q=đất+đai          // Từ khóa (required)
&category=van-ban   // Danh mục (optional)
&page=1             // Trang (default: 1)
&limit=20           // Số lượng/trang (default: 20)
```

**Response format:**
```json
{
  "success": true,
  "data": {
    "items": [ /* mảng Law objects */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    }
  }
}
```

### 5.2. Thêm API cho tài liệu địa phương

Nếu muốn tài liệu địa phương cũng từ BE thay vì mock data trong `citizenData.js`:

1. Tạo API endpoint tương tự: `GET /api/documents/search?q=...&category=...`
2. Tạo service function trong `libraryService.js`
3. Thay `import { libraryDocuments } from '../data/citizenMockDb'` bằng API call

---

## 6. Cấu trúc file

```
src/
├── citizen/
│   ├── pages/
│   │   └── DigitalLibraryPage.jsx    ← Trang chính (1900+ dòng)
│   ├── components/
│   │   └── CitizenPrimitives.jsx     ← Shared components
│   └── data/
│       ├── citizenData.js            ← Mock data (libraryDocuments, libraryCategories)
│       └── citizenMockDb.js          ← Re-export barrel
├── services/
│   └── libraryService.js             ← Service layer (MOCK ↔ API)
├── styles/
│   └── citizen.css                   ← CSS cho toàn bộ citizen portal
└── CitizenApp.jsx                    ← Router (thêm route /cong-dong/thu-vien-so)
```

---

## 7. Component Tree

```
DigitalLibraryPage
├── Hero Search Section
│   └── SearchBar (title + input + hints + stats)
├── Search Results Section (conditional)
│   ├── LocalDocCard (DocCardV2) × N
│   └── LawCardMini × N
├── All Documents Section
│   ├── FilterBar (category chips)
│   ├── DocCardV2 × N
│   └── LoadMore button
├── CTA Banner
├── How It Works Section
│
└── Detail View (conditional)
    ├── DetailHero (cover + meta + actions)
    ├── Sidebar (legal info + TOC)
    ├── MainContent (sections)
    ├── TrustNote
    └── RelatedDocuments (carousel)
```

---

## 8. Responsive Breakpoints

| Breakpoint | Layout thay đổi |
|------------|----------------|
| `1100px` | Category grid: 4→2 cột, doc grid: 4→3 cột |
| `900px` | Hero card: flex→column, sidebar: sticky→static, detail layout: 2 cột→1 cột |
| `680px` | Search bar: wrap, hero text nhỏ hơn, doc grid: 1 cột |
| `480px` | Search bar hint tags full-width |

---

## 9. Màu sắc & Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--citizen-blue` | `#2563EB` | Primary accent, buttons, links |
| `--citizen-blue-dark` | `#1565C0` | Hover states, dark blue |
| `--citizen-blue-soft` | `#E3F2FD` | Light backgrounds, badges |
| `--citizen-ink` | `#111827` | Main text color |
| `--citizen-muted` | `#667085` | Secondary text |
| `--citizen-line` | `#DCE6F2` | Borders, dividers |
| `--citizen-soft` | `#F8FAFC` | Section backgrounds |
| `--citizen-radius` | `16px` | Default border radius |

**Danh mục colors:**
- Tủ sách: `#2563EB` (blue)
- Tài liệu: `#059669` (green)
- Văn bản: `#EA580C` (orange)
- Bản đồ: `#7C3AED` (purple)

---

## 10. SEO & Accessibility

- Tất cả `img` có `alt` hoặc `alt=""` (decorative) + `loading="lazy"`
- Form tìm kiếm có `role="search"` + `aria-label`
- Cards là `<button>` elements → keyboard accessible
- Focus visible styles cho tất cả interactive elements
- `prefers-reduced-motion` support
- Semantic HTML: `<section>`, `<nav>`, `<h1>`-`<h4>`, `<aside>`

---

## 11. Known Issues & TODO

- [ ] Tài liệu địa phương hiện từ mock data → cần API thật khi có BE
- [ ] Luật quốc gia từ mock data 12 luật → cần kết nối CSDL pháp điển thật
- [ ] Chưa có chức năng upload/tải file thực tế
- [ ] Chưa có phân quyền (tất cả người dân đều xem được)
- [ ] Chưa có tính năng bookmark/yêu thích tài liệu
- [ ] Chưa có lịch sử tìm kiếm