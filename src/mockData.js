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
