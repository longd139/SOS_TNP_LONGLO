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
    { id: 'P-1', name: 'Đăng ký kinh doanh', field: 'Kinh tế', processingTime: '7 ngày', status: 'Cập nhật' },
    { id: 'P-2', name: 'Cấp chứng minh', field: 'Hành chính', processingTime: '10 ngày', status: 'Cập nhật' }
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
