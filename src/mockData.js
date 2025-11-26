export const reports = [
    {
        id: 'R-1001',
        title: 'Mất điện khu phố A',
        area: 'Khu phố A',
        severity: 'Thường',
        status: 'Mới',
        createdAt: '2025-10-20',
        content: 'Khu phố A bị mất điện từ 2 giờ sáng.'
    },
    {
        id: 'R-1002',
        title: 'Ngập nước đường B',
        area: 'Đường B',
        severity: 'Khẩn cấp',
        status: 'Đang xử lý',
        createdAt: '2025-10-21',
        content: 'Mưa lớn gây ngập ở đoạn km 3.'
    }
];

export const news = [
    { id: 'N-1', title: 'Khai trương Cổng thông tin mới', publishedAt: '2025-09-01', status: 'Xuất bản' },
    { id: 'N-2', title: 'Hướng dẫn nộp hồ sơ trực tuyến', publishedAt: '2025-09-15', status: 'Bản nháp' }
];

export const newsList = [
    {
        id: "#1",
        title: "Thông báo lịch tiếp dân tháng 11/2025",
        category: "Quan trọng",
        categoryBg: "#FEE2E2",
        categoryColor: "#DC2626",
        status: "Đã xuất bản",
        statusBg: "#D1FAE5",
        statusColor: "#059669",
        publishedDate: "2025-10-20",
        views: 1234
    },
    {
        id: "#2",
        title: "Hướng dẫn đăng ký làm căn cước công dân gắn chip",
        category: "Tin tức",
        categoryBg: "#DBEAFE",
        categoryColor: "#2563EB",
        status: "Đã xuất bản",
        statusBg: "#D1FAE5",
        statusColor: "#059669",
        publishedDate: "2025-10-19",
        views: 892
    },
    {
        id: "#3",
        title: "Lịch cắt nước định kỳ tuần tới",
        category: "Quan trọng",
        categoryBg: "#FEE2E2",
        categoryColor: "#DC2626",
        status: "Đã xuất bản",
        statusBg: "#D1FAE5",
        statusColor: "#059669",
        publishedDate: "2025-10-18",
        views: 2156
    },
    {
        id: "#4",
        title: "Khai mạc Festival Văn hóa Phường",
        category: "Sự kiện",
        categoryBg: "#E9D5FF",
        categoryColor: "#7C3AED",
        status: "Bản nháp",
        statusBg: "#FEF3C7",
        statusColor: "#D97706",
        publishedDate: "2025-10-17",
        views: 0
    },
    {
        id: "#5",
        title: "Chính sách hỗ trợ người có công mới nhất",
        category: "Tin tức",
        categoryBg: "#DBEAFE",
        categoryColor: "#2563EB",
        status: "Đã xuất bản",
        statusBg: "#D1FAE5",
        statusColor: "#059669",
        publishedDate: "2025-10-15",
        views: 567
    }
];

export const procedures = [
    { 
        id: '#1', 
        name: 'Đăng ký kinh doanh', 
        field: 'Kinh tế', 
        processingTime: '7 ngày', 
        status: 'Cập nhật', 
        fee: 'Miễn phí', 
        contact: '028-1234-5678' 
    },
    { 
        id: '#2', 
        name: 'Cấp chứng minh', 
        field: 'Hành chính', 
        processingTime: '10 ngày', 
        status: 'Cập nhật', 
        fee: '100.000 VNĐ', 
        contact: '028-1234-5678' 
    },
    { 
        id: '#3', 
        name: 'Đăng ký kết hôn', 
        field: 'Xã hội', 
        processingTime: '5 ngày', 
        status: 'Cập nhật', 
        fee: '50.000 VNĐ', 
        contact: '028-1234-5679' 
    },
    { 
        id: '#4', 
        name: 'Cấp giấy phép xây dựng', 
        field: 'Xây dựng', 
        processingTime: '15 ngày', 
        status: 'Cập nhật', 
        fee: '200.000 VNĐ', 
        contact: '028-1234-5680' 
    }
];


export const dashboardStats = {
    totalReports: 24,
    pendingReports: 12,
    resolvedReports: 156,
    urgentReports: 3
};

export const chartData = {
    trends: [
        { date: '01/10', tongPhanAnh: 45, daGiaiQuyet: 33 },
        { date: '05/10', tongPhanAnh: 52, daGiaiQuyet: 37 },
        { date: '10/10', tongPhanAnh: 47, daGiaiQuyet: 40 },
        { date: '15/10', tongPhanAnh: 61, daGiaiQuyet: 44 },
        { date: '20/10', tongPhanAnh: 58, daGiaiQuyet: 47 },
        { date: '22/10', tongPhanAnh: 69, daGiaiQuyet: 51 }
    ],
    visits: [
        { day: 'T2', visits: 1200 },
        { day: 'T3', visits: 1380 },
        { day: 'T4', visits: 1600 },
        { day: 'T5', visits: 1400 },
        { day: 'T6', visits: 1700 },
        { day: 'T7', visits: 1950 },
        { day: 'CN', visits: 1450 }
    ]
};

export const recentReports = [
    {
        id: "#1234",
        priority: "Khẩn",
        title: "Vấn đề vệ sinh môi trường tại đường Số 10",
        category: "Môi trường",
        reporter: "Nguyễn Văn A",
        phone: "0901234567",
        timeAgo: "10 phút trước",
        status: "Chờ xử lý",
        statusColor: "#FDE68A",
        isUrgent: true
    },
    {
        id: "#1233",
        priority: null,
        title: "Đèn đường bị hỏng tại Khu phố 3",
        category: "Hạ tầng",
        reporter: "Ẩn danh",
        phone: null,
        timeAgo: "1 giờ trước",
        status: "Đang xử lý",
        statusColor: "#93C5FD",
        isUrgent: false
    },
    {
        id: "#1232",
        priority: null,
        title: "Kiến nghị về giờ giấc hoạt động của chợ",
        category: "Kiến nghị",
        reporter: "Trần Thị B",
        phone: "0912345678",
        timeAgo: "2 giờ trước",
        status: "Đã giải quyết",
        statusColor: "#A7F3D0",
        isUrgent: false
    },
    {
        id: "#1231",
        priority: null,
        title: "Ô nhiễm tiếng ồn từ quán karaoke",
        category: "Môi trường",
        reporter: "Lê Văn C",
        phone: null,
        timeAgo: "3 giờ trước",
        status: "Chờ xử lý",
        statusColor: "#FDE68A",
        isUrgent: false
    }
];

export const feedbackList = [
    {
        id: "#1234",
        title: "Vấn đề về sinh môi trường tại đường Số 10",
        category: "Môi trường",
        status: "Mới",
        statusBg: "#FEE2E2",
        statusColor: "#DC2626",
        urgency: "Cao",
        urgencyIcon: "⚠",
        urgencyColor: "#DC2626",
        urgencyBg: "#FEE2E2",
        submittedDate: "2025-10-22",
        daysOpen: "0 ngày",
        contact: {
            name: "Nguyễn Văn A",
            phone: "0901234567"
        }
    },
    {
        id: "#1233",
        title: "Đèn đường bị hỏng tại Khu phố 3",
        category: "Hạ tầng",
        status: "Đang xử lý",
        statusBg: "#DBEAFE",
        statusColor: "#2563EB",
        urgency: "Trung bình",
        urgencyIcon: null,
        urgencyColor: "#D97706",
        urgencyBg: "#FEF3C7",
        submittedDate: "2025-10-21",
        daysOpen: "1 ngày",
        contact: {
            name: "Ẩn danh",
            phone: null
        }
    },
    {
        id: "#1232",
        title: "Kiến nghị về giờ giấc hoạt động của chợ",
        category: "Kiến nghị",
        status: "Đã giải quyết",
        statusBg: "#D1FAE5",
        statusColor: "#059669",
        urgency: "Thấp",
        urgencyIcon: null,
        urgencyColor: "#059669",
        urgencyBg: "#D1FAE5",
        submittedDate: "2025-10-20",
        daysOpen: "2 ngày",
        contact: {
            name: "Trần Thị B",
            phone: "0912345678"
        }
    },
    {
        id: "#1231",
        title: "Ô nhiễm tiếng ồn từ quán karaoke",
        category: "Môi trường",
        status: "Mới",
        statusBg: "#FEE2E2",
        statusColor: "#DC2626",
        urgency: "Trung bình",
        urgencyIcon: null,
        urgencyColor: "#D97706",
        urgencyBg: "#FEF3C7",
        submittedDate: "2025-10-22",
        daysOpen: "0 ngày",
        contact: {
            name: "Lê Văn C",
            phone: null
        }
    },
    {
        id: "#1230",
        title: "Đường xuống cấp tại ngõ 123",
        category: "Hạ tầng",
        status: "Đang xử lý",
        statusBg: "#DBEAFE",
        statusColor: "#2563EB",
        urgency: "Cao",
        urgencyIcon: "⚠",
        urgencyColor: "#DC2626",
        urgencyBg: "#FEE2E2",
        submittedDate: "2025-10-19",
        daysOpen: "3 ngày",
        contact: {
            name: null,
            phone: "0923456789"
        }
    }
];

export const templatesList = [
    {
        id: "#1",
        name: "Đơn đăng ký thường trú",
        relatedProcedure: "Đăng ký thường trú",
        fileSize: "245 KB",
        uploadedDate: "2025-10-15",
        downloads: 342
    },
    {
        id: "#2",
        name: "Giấy khai sinh",
        relatedProcedure: "Đăng ký khai sinh",
        fileSize: "189 KB",
        uploadedDate: "2025-10-12",
        downloads: 256
    },
    {
        id: "#3",
        name: "Đơn xin giấy phép kinh doanh",
        relatedProcedure: "Đăng ký kinh doanh hộ cá thể",
        fileSize: "312 KB",
        uploadedDate: "2025-10-10",
        downloads: 128
    },
    {
        id: "#4",
        name: "Đơn xác nhận hộ nghèo",
        relatedProcedure: "Xác nhận hộ nghèo, cận nghèo",
        fileSize: "198 KB",
        uploadedDate: "2025-10-08",
        downloads: 89
    },
    {
        id: "#5",
        name: "Đơn xin giấy phép xây dựng",
        relatedProcedure: "Giấy phép xây dựng tạm",
        fileSize: "425 KB",
        uploadedDate: "2025-10-05",
        downloads: 167
    }
];

export const contactInfo = {
    address: {
        full: "123 Đường Tăng Nhơn Phú, Quận 9, TP. Thủ Đức",
        latitude: 10.8231,
        longitude: 106.6297
    },
    contact: {
        mainPhone: "028-1234-5678",
        departments: {
            administrative: "028-1234-5679",
            socialWelfare: "028-1234-5680"
        },
        email: "ubnd@tangnhonphu.gov.vn",
        fax: "028-1234-5677"
    },
    workingHours: {
        morning: {
            start: "07:30",
            end: "11:30"
        },
        afternoon: {
            start: "13:00",
            end: "17:00"
        },
        workingDays: "Thứ 2 đến Thứ 6 (trừ ngày lễ, Tết)",
        note: "Lịch tiếp dân: Thứ 2 và Thứ 5 hàng tuần"
    },
    additional: {
        website: "https://tangnhonphu.gov.vn",
        facebook: "https://facebook.com/tangnhonphu",
        hotline: "0900-123-456"
    }
};

export const scheduleList = [
    {
        id: 1,
        date: "2025-10-23",
        time: "08:00 - 10:00",
        leader: "Ông Nguyễn Văn A - Chủ tích UBND",
        location: "Phòng tiếp dân - Tầng 1",
        purpose: "Tiếp dân định kỳ"
    },
    {
        id: 2,
        date: "2025-10-24",
        time: "14:00 - 16:00",
        leader: "Bà Trần Thị B - Phó Chủ tịch",
        location: "Phòng họp A",
        purpose: "Tư vấn pháp luật"
    },
    {
        id: 3,
        date: "2025-10-28",
        time: "08:00 - 10:00",
        leader: "Ông Lê Văn C - Phó Chủ tịch",
        location: "Phòng tiếp dân - Tầng 1",
        purpose: "Tiếp dân định kỳ"
    },
    {
        id: 4,
        date: "2025-10-30",
        time: "09:00 - 11:00",
        leader: "Ông Nguyễn Văn A - Chủ tịch UBND",
        location: "Phòng tiếp dân - Tầng 1",
        purpose: "Giải quyết khiếu nại"
    }
];

export const statisticsData = {
    summary: {
        totalUsers: 12458,
        activeUsers: 8942,
        totalReports: "Phản ánh",
        avgResponseTime: "5m 32s"
    },
    reportsByCategory: [
        { category: "Môi trường", count: 98, percentage: 39, color: "#3B82F6" },
        { category: "Hạ tầng", count: 70, percentage: 28, color: "#10B981" },
        { category: "Kiến nghị", count: 40, percentage: 16, color: "#F59E0B" },
        { category: "An ninh", count: 25, percentage: 10, color: "#EF4444" },
        { category: "Khác", count: 17, percentage: 7, color: "#6B7280" }
    ],
    reportsByStatus: [
        { status: "Mới", count: 32 },
        { status: "Đang xử lý", count: 45 },
        { status: "Đã giải quyết", count: 156 },
        { status: "Đã đóng", count: 89 }
    ],
    feedbackTrend: [
        { month: "T6", count: 145 },
        { month: "T7", count: 167 },
        { month: "T8", count: 198 },
        { month: "T9", count: 178 },
        { month: "T10", count: 213 }
    ],
    topIssues: [
        { title: "Vệ sinh môi trường không được đảm bảo", count: 45 },
        { title: "Đường xương cấp, hư hỏng", count: 38 },
        { title: "Đèn đường hỏng", count: 24 },
        { title: "Ô nhiễm tiếng ồn", count: 18 },
        { title: "Chậm giải quyết thủ tục", count: 15 }
    ],
    userActivityByDay: [
        { day: "T2", users: 1245, sessions: 1567 },
        { day: "T3", users: 1356, sessions: 1723 },
        { day: "T4", users: 1589, sessions: 1945 },
        { day: "T5", users: 1423, seconds: 1689 },
        { day: "T6", users: 1678, sessions: 2067 },
        { day: "T7", users: 1834, sessions: 2398 },
        { day: "CN", users: 1456, sessions: 1812 }
    ],
    feedbackStats: {
        withIdentity: 68,
        anonymous: 32
    },
    deviceStats: {
        mobile: 82,
        desktop: 18
    }
};

export const permissionData = [
    {
        id: "1",
        name: "Super Admin",
        description: "Quản trị viên cao nhất, có toàn quyền truy cập",
        permissionNumber: 56,
        createdDate: "2025-10-01"
    },
    {
        id: "2",
        name: "Quản lý phản ánh",
        description: "Quản lý và xử lý các phản ánh từ người dân",
        permissionNumber: 4,
        createdDate: "2025-10-05"
    },
    {
        id: "3",
        name: "Quản lý nội dung",
        description: "Quản lý tin tức và nội dung website",
        permissionNumber: 5,
        createdDate: "2025-10-10"
    }
]

export const categoryRole = [
    {
        id: "1",
        name: "Cơ sở dịch vụ công"
    },
    {
        id: "2",
        name: "Danh mục tin tức"
    },
    {
        id: "3",
        name: "Lịch tiếp dân"
    },
    {
        id: "4",
        name: "Lĩnh vực phản ánh"
    },
    {
        id: "5",
        name: "Lĩnh vực thủ tục hành chính"
    },
    {
        id: "6",
        name: "Mẫu đơn"
    },
    {
        id: "7",
        name: "Phản ánh"
    },
    {
        id: "8",
        name: "Báo cáo"
    },
    {
        id: "9",
        name: "Thủ tục"
    },
    {
        id: "10",
        name: "Tin tức"
    },
    {
        id: "11",
        name: "Uỷ ban"
    },
    {
        id: "12",
        name: "Upload"
    },
    {
        id: "13",
        name: "Phân quyền"
    },
    {
        id: "14",
        name: "Người dùng"
    },
    {
        id: "15",
        name: "Role"
    },
]

export const permissionOptions = [
    // --- Cơ sở dịch vụ công ---
    {
        id: "1-1",
        categoryId: "1",
        code: "CO_SO_DICH_VU_CONG_CREATE",
        name: "Tạo mới Cơ sở dịch vụ công",
        description: "Cho phép tạo mới cơ sở dịch vụ công"
    },
    {
        id: "1-2",
        categoryId: "1",
        code: "CO_SO_DICH_VU_CONG_UPDATE",
        name: "Cập nhật Cơ sở dịch vụ công",
        description: "Cho phép chỉnh sửa thông tin cơ sở dịch vụ công"
    },
    {
        id: "1-3",
        categoryId: "1",
        code: "CO_SO_DICH_VU_CONG_DELETE",
        name: "Xóa Cơ sở dịch vụ công",
        description: "Cho phép xóa cơ sở dịch vụ công"
    },
    {
        id: "1-4",
        categoryId: "1",
        code: "CO_SO_DICH_VU_CONG_STATUS",
        name: "Cập nhật trạng thái Cơ sở dịch vụ công",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái"
    },

    // --- Danh mục tin tức ---
    {
        id: "2-1",
        categoryId: "2",
        code: "DANH_MUC_TIN_TUC_CREATE",
        name: "Tạo mới Danh mục tin tức",
        description: "Tạo mới danh mục tin tức"
    },
    {
        id: "2-2",
        categoryId: "2",
        code: "DANH_MUC_TIN_TUC_UPDATE",
        name: "Cập nhật Danh mục tin tức",
        description: "Chỉnh sửa danh mục tin tức"
    },
    {
        id: "2-3",
        categoryId: "2",
        code: "DANH_MUC_TIN_TUC_DELETE",
        name: "Xóa Danh mục tin tức",
        description: "Xóa danh mục tin tức"
    },
    {
        id: "2-4",
        categoryId: "2",
        code: "DANH_MUC_TIN_TUC_STATUS",
        name: "Cập nhật trạng thái Danh mục tin tức",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái danh mục tin tức"
    },

    // --- Lịch tiếp dân ---
    {
        id: "3-1",
        categoryId: "3",
        code: "LICH_TIEP_DAN_CREATE",
        name: "Tạo mới lịch tiếp dân",
        description: "Tạo mới lịch tiếp dân"
    },
    {
        id: "3-2",
        categoryId: "3",
        code: "LICH_TIEP_DAN_UPDATE",
        name: "Cập nhật lịch tiếp dân",
        description: "Cập nhật thông tin lịch tiếp dân"
    },
    {
        id: "3-3",
        categoryId: "3",
        code: "LICH_TIEP_DAN_DELETE",
        name: "Xóa lịch tiếp dân",
        description: "Xóa lịch tiếp dân"
    },
    {
        id: "3-4",
        categoryId: "3",
        code: "LICH_TIEP_DAN_STATUS",
        name: "Cập nhật trạng thái lịch tiếp dân",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái lịch tiếp dân"
    },
    {
        id: "3-5",
        categoryId: "3",
        code: "LICH_TIEP_DAN_GET_TEMPLATE",
        name: "Lấy mẫu lịch tiếp dân",
        description: "Cho phép lấy mẫu file lịch tiếp dân"
    },

    // --- Lĩnh vực phản ánh ---
    {
        id: "4-1",
        categoryId: "4",
        code: "LINH_VUC_PHAN_ANH_CREATE",
        name: "Tạo mới lĩnh vực phản ánh",
        description: "Tạo mới lĩnh vực phản ánh"
    },
    {
        id: "4-2",
        categoryId: "4",
        code: "LINH_VUC_PHAN_ANH_UPDATE",
        name: "Cập nhật lĩnh vực phản ánh",
        description: "Chỉnh sửa lĩnh vực phản ánh"
    },
    {
        id: "4-3",
        categoryId: "4",
        code: "LINH_VUC_PHAN_ANH_DELETE",
        name: "Xóa lĩnh vực phản ánh",
        description: "Xóa lĩnh vực phản ánh"
    },
    {
        id: "4-4",
        categoryId: "4",
        code: "LINH_VUC_PHAN_ANH_STATUS",
        name: "Cập nhật trạng thái lĩnh vực phản ánh",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái lĩnh vực phản ánh"
    },

    // --- Lĩnh vực thủ tục hành chính ---
    {
        id: "5-1",
        categoryId: "5",
        code: "LINH_VUC_TTHC_CREATE",
        name: "Tạo mới lĩnh vực TTHC",
        description: "Tạo mới lĩnh vực thủ tục hành chính"
    },
    {
        id: "5-2",
        categoryId: "5",
        code: "LINH_VUC_TTHC_UPDATE",
        name: "Cập nhật lĩnh vực TTHC",
        description: "Cập nhật lĩnh vực thủ tục hành chính"
    },
    {
        id: "5-3",
        categoryId: "5",
        code: "LINH_VUC_TTHC_DELETE",
        name: "Xóa lĩnh vực TTHC",
        description: "Xóa lĩnh vực thủ tục hành chính"
    },
    {
        id: "5-4",
        categoryId: "5",
        code: "LINH_VUC_TTHC_STATUS",
        name: "Cập nhật trạng thái lĩnh vực TTHC",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái lĩnh vực thủ tục hành chính"
    },

    // --- Mẫu đơn ---
    {
        id: "6-1",
        categoryId: "6",
        code: "MAU_DON_CREATE",
        name: "Tạo mới mẫu đơn",
        description: "Tạo mới mẫu đơn"
    },
    {
        id: "6-2",
        categoryId: "6",
        code: "MAU_DON_UPDATE",
        name: "Cập nhật mẫu đơn",
        description: "Cập nhật mẫu đơn"
    },
    {
        id: "6-3",
        categoryId: "6",
        code: "MAU_DON_DELETE",
        name: "Xóa mẫu đơn",
        description: "Xóa mẫu đơn"
    },
    {
        id: "6-4",
        categoryId: "6",
        code: "MAU_DON_STATUS",
        name: "Cập nhật trạng thái mẫu đơn",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái mẫu đơn"
    },

    // --- Phản ánh ---
    {
        id: "7-1",
        categoryId: "7",
        code: "PHAN_ANH_CREATE",
        name: "Tạo mới phản ánh",
        description: "Cho phép tạo mới phản ánh"
    },
    {
        id: "7-2",
        categoryId: "7",
        code: "PHAN_ANH_UPDATE",
        name: "Cập nhật phản ánh",
        description: "Cho phép cập nhật phản ánh người dân"
    },
    {
        id: "7-3",
        categoryId: "7",
        code: "PHAN_ANH_DELETE",
        name: "Xóa phản ánh",
        description: "Cho phép xóa phản ánh người dân"
    },
    {
        id: "7-4",
        categoryId: "7",
        code: "PHAN_ANH_STATUS",
        name: "Cập nhật trạng thái phản ánh",
        description: "Cho phép thay đổi trạng thái phản ánh"
    },
    {
        id: "7-5",
        categoryId: "7",
        code: "PHAN_ANH_GET_TONG_QUAN",
        name: "Xem tổng quan phản ánh",
        description: "Xem báo cáo tổng quan về phản ánh"
    },
    {
        id: "7-6",
        categoryId: "7",
        code: "PHAN_ANH_GET_DETAIL",
        name: "Xem chi tiết phản ánh",
        description: "Xem chi tiết từng phản ánh"
    },
    {
        id: "7-7",
        categoryId: "7",
        code: "PHAN_ANH_GET_ALL",
        name: "Xem danh sách phản ánh",
        description: "Xem danh sách tất cả phản ánh"
    },

    // --- Báo cáo ---
    {
        id: "8-1",
        categoryId: "8",
        code: "REPORT_GET",
        name: "Xem báo cáo",
        description: "Xem các loại báo cáo"
    },
    {
        id: "8-2",
        categoryId: "8",
        code: "REPORT_GET_EXCEL",
        name: "Xuất báo cáo excel",
        description: "Xuất file báo cáo excel"
    },
    {
        id: "8-3",
        categoryId: "8",
        code: "REPORT_MANAGE",
        name: "Quản lý báo cáo",
        description: "Thêm/sửa/xóa báo cáo"
    },

    // --- Thủ tục ---
    {
        id: "9-1",
        categoryId: "9",
        code: "THU_TUC_CREATE",
        name: "Tạo mới thủ tục",
        description: "Tạo mới thủ tục hành chính"
    },
    {
        id: "9-2",
        categoryId: "9",
        code: "THU_TUC_UPDATE",
        name: "Cập nhật thủ tục",
        description: "Chỉnh sửa thủ tục hành chính"
    },
    {
        id: "9-3",
        categoryId: "9",
        code: "THU_TUC_DELETE",
        name: "Xóa thủ tục",
        description: "Xóa thủ tục hành chính"
    },
    {
        id: "9-4",
        categoryId: "9",
        code: "THU_TUC_STATUS",
        name: "Cập nhật trạng thái thủ tục",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái thủ tục hành chính"
    },

    // --- Tin tức ---
    {
        id: "10-1",
        categoryId: "10",
        code: "TIN_TUC_CREATE",
        name: "Tạo mới tin tức",
        description: "Tạo bài viết mới"
    },
    {
        id: "10-2",
        categoryId: "10",
        code: "TIN_TUC_UPDATE",
        name: "Cập nhật tin tức",
        description: "Chỉnh sửa tin"
    },
    {
        id: "10-3",
        categoryId: "10",
        code: "TIN_TUC_DELETE",
        name: "Xóa tin tức",
        description: "Xóa bài tin"
    },
    {
        id: "10-4",
        categoryId: "10",
        code: "TIN_TUC_STATUS",
        name: "Cập nhật trạng thái tin tức",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái tin tức"
    },

    // --- Uỷ ban ---
    {
        id: "11-1",
        categoryId: "11",
        code: "UY_BAN_UPDATE",
        name: "Cập nhật thông tin Uỷ ban",
        description: "Chỉnh sửa thông tin Uỷ ban"
    },
    {
        id: "11-2",
        categoryId: "11",
        code: "UY_BAN_CREATE",
        name: "Tạo mới Uỷ ban",
        description: "Tạo mới thông tin Uỷ ban"
    },

    // --- Upload ---
    {
        id: "12-1",
        categoryId: "12",
        code: "UPLOAD_VIDEO_PHAN_ANH",
        name: "Upload file",
        description: "Cho phép upload file lên hệ thống"
    },

    // --- Phân quyền ---
    {
        id: "13-1",
        categoryId: "13",
        code: "PERMISSION_MANAGE",
        name: "Phân quyền",
        description: "Thêm/sửa/xóa quyền hệ thống"
    },

    // --- Người dùng ---
    {
        id: "14-1",
        categoryId: "14",
        code: "NGUOI_DUNG_CREATE",
        name: "Tạo mới người dùng",
        description: "Tạo mới tài khoản người dùng"
    },
    {
        id: "14-2",
        categoryId: "14",
        code: "NGUOI_DUNG_UPDATE",
        name: "Cập nhật người dùng",
        description: "Cập nhật tài khoản người dùng"
    },
    {
        id: "14-3",
        categoryId: "14",
        code: "NGUOI_DUNG_DELETE",
        name: "Xóa người dùng",
        description: "Xóa tài khoản người dùng"
    },
    {
        id: "14-4",
        categoryId: "14",
        code: "NGUOI_DUNG_STATUS",
        name: "Cập nhật trạng thái người dùng",
        description: "Cho phép bật/tắt hoặc thay đổi trạng thái người dùng"
    },
    {
        id: "14-5",
        categoryId: "14",
        code: "NGUOI_DUNG_GET",
        name: "Xem thông tin người dùng",
        description: "Xem thông tin người dùng"
    },

    // --- Role ---
    {
        id: "15-1",
        categoryId: "15",
        code: "ROLE_CREATE",
        name: "Tạo mới role",
        description: "Tạo mới role trong hệ thống"
    },
    {
        id: "15-2",
        categoryId: "15",
        code: "ROLE_UPDATE",
        name: "Cập nhật role",
        description: "Cập nhật role trong hệ thống"
    },
    {
        id: "15-3",
        categoryId: "15",
        code: "ROLE_DELETE",
        name: "Xóa role",
        description: "Xóa role trong hệ thống"
    },
    {
        id: "15-4",
        categoryId: "15",
        code: "ROLE_UPDATE_STATUS",
        name: "Cập nhật trạng thái role",
        description: "Cập nhật trạng thái role trong hệ thống"
    },
];


