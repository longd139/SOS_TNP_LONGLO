export const citizenNavItems = [
  { label: 'Trang chủ', to: '/cong-dong' },
  { label: 'Thủ tục hành chính', to: '/cong-dong/thu-tuc' },
  { label: 'Tin tức', to: '/cong-dong/tin-tuc' },
  { label: 'Lịch tiếp dân', to: '/cong-dong/lich-tiep-dan' },
  { label: 'Phản ánh', to: '/cong-dong/tra-cuu' },
  { label: 'Thư viện số', to: '/cong-dong/thu-vien-so' },
  { label: 'Liên hệ', to: '/cong-dong/lien-he' },
];

export const heroBanners = [
  {
    id: 'ket-noi',
    eyebrow: 'Cổng thông tin công dân',
    title: 'Kết nối người dân với chính quyền địa phương',
    description: 'Tra cứu thủ tục, gửi phản ánh, theo dõi tiến độ và cập nhật thông tin địa phương trên một nền tảng dễ sử dụng.',
    metric: '4.286',
    metricLabel: 'hồ sơ đã được tiếp nhận trực tuyến',
  },
  {
    id: 'phan-anh',
    eyebrow: 'Lắng nghe để phục vụ tốt hơn',
    title: 'Mỗi phản ánh đều được tiếp nhận minh bạch',
    description: 'Chia sẻ vấn đề tại khu phố, nhận mã phản ánh và theo dõi từng bước xử lý từ cơ quan chức năng.',
    metric: '96%',
    metricLabel: 'phản ánh được xử lý đúng hạn',
  },
  {
    id: 'thu-tuc',
    eyebrow: 'Dịch vụ công thuận tiện',
    title: 'Chủ động thực hiện thủ tục hành chính',
    description: 'Tìm hướng dẫn rõ ràng, chuẩn bị đủ hồ sơ và biết trước thời hạn giải quyết trước khi nộp.',
    metric: '24/7',
    metricLabel: 'tra cứu thông tin mọi lúc',
  },
];

export const homeFeatures = [
  { label: 'Thủ tục hành chính', description: 'Hướng dẫn hồ sơ và quy trình thực hiện.', to: '/cong-dong/thu-tuc', icon: 'FileText', tone: 'blue' },
  { label: 'Tin tức', description: 'Thông báo và hoạt động mới nhất.', to: '/cong-dong/tin-tuc', icon: 'Newspaper', tone: 'green' },
  { label: 'Phản ánh', description: 'Gửi ý kiến đến địa phương.', to: '/cong-dong/tra-cuu', icon: 'MessageSquare', tone: 'orange' },
  { label: 'Liên hệ', description: 'Kênh hỗ trợ và danh bạ phường.', to: '/cong-dong/lien-he', icon: 'Phone', tone: 'purple' },
  { label: 'Dịch vụ công', description: 'Tra cứu dịch vụ trực tuyến.', to: '/cong-dong/thu-tuc', icon: 'BriefcaseBusiness', tone: 'blue' },
  { label: 'Lịch tiếp dân', description: 'Thông tin lịch làm việc định kỳ.', to: '/cong-dong/lich-tiep-dan', icon: 'CalendarDays', tone: 'blue' },
  { label: 'Thư viện số', description: 'Sách, tài liệu, văn bản pháp luật và bản đồ di tích.', to: '/cong-dong/thu-vien-so', icon: 'BookOpen', tone: 'green' },
];

export const publicServices = [
  { id: 'nop-ho-so', title: 'Nộp hồ sơ trực tuyến', description: 'Chuẩn bị hồ sơ và thực hiện thủ tục trực tuyến theo hướng dẫn.', action: 'Xem thủ tục', to: '/cong-dong/thu-tuc' },
  { id: 'thanh-toan', title: 'Thanh toán trực tuyến', description: 'Kiểm tra các khoản phí, lệ phí theo quy định của từng thủ tục.', action: 'Tra cứu phí', to: '/cong-dong/thu-tuc' },
  { id: 'nhan-ket-qua', title: 'Nhận kết quả tại nhà', description: 'Đăng ký nhận kết quả qua bưu chính khi thủ tục có hỗ trợ.', action: 'Xem hướng dẫn', to: '/cong-dong/huong-dan' },
  { id: 'kiem-tra', title: 'Kiểm tra hồ sơ', description: 'Tìm hiểu thành phần hồ sơ trước khi đến Bộ phận Một cửa.', action: 'Kiểm tra ngay', to: '/cong-dong/thu-tuc' },
];

export const citizenReceptionSchedule = [
  { day: 'Thứ Hai', time: '07:30 - 11:30', host: 'Lãnh đạo UBND phường', place: 'Phòng Tiếp công dân, trụ sở UBND phường' },
  { day: 'Thứ Tư', time: '13:30 - 16:30', host: 'Bộ phận Đô thị và Môi trường', place: 'Bộ phận Một cửa, trụ sở UBND phường' },
  { day: 'Thứ Sáu', time: '07:30 - 11:30', host: 'Bộ phận Văn hóa - Xã hội', place: 'Bộ phận Một cửa, trụ sở UBND phường' },
];

export const importantNotices = [
  { id: 'lich-tiep-dan', type: 'Quan trọng', title: 'Thông báo lịch tiếp công dân tháng 8/2026', date: '01/08/2026', isNew: true },
  { id: 'khai-sinh-truc-tuyen', type: 'Hướng dẫn', title: 'Hướng dẫn đăng ký khai sinh trực tuyến qua VNeID', date: '28/07/2026', isNew: true },
  { id: 'pccc-kiem-tra', type: 'Quan trọng', title: 'Kiểm tra an toàn PCCC tại các hộ kinh doanh trên địa bàn', date: '25/07/2026', isNew: false },
  { id: 'dang-ky-tam-tru', type: 'Thông báo', title: 'Hướng dẫn đăng ký tạm trú online cho người lao động', date: '20/07/2026', isNew: false },
  { id: 'rac-thai', type: 'Thông báo', title: 'Lịch thu gom rác thải cồng kềnh tháng 8/2026', date: '18/07/2026', isNew: false },
];

export const emergencyContact = { title: 'Liên hệ khẩn cấp', subtitle: 'Gọi ngay khi cần hỗ trợ gấp từ chính quyền địa phương.', phoneLabel: 'Gọi ngay', messageLabel: 'Nhắn tin' };

export const procedureCategories = ['Tất cả lĩnh vực', 'Hộ tịch', 'Đất đai', 'Kinh doanh', 'Xây dựng', 'An sinh xã hội'];

export const procedures = [
  {
    id: 'khai-sinh',
    category: 'Hộ tịch',
    title: 'Đăng ký khai sinh',
    summary: 'Đăng ký khai sinh cho trẻ em tại cơ quan có thẩm quyền nơi cư trú.',
    duration: 'Trong ngày làm việc',
    fee: 'Không thu phí',
    featured: true,
    steps: ['Chuẩn bị hồ sơ theo hướng dẫn', 'Nộp hồ sơ trực tuyến hoặc tại Bộ phận Một cửa', 'Nhận kết quả theo lịch hẹn'],
    documents: ['Tờ khai đăng ký khai sinh', 'Giấy chứng sinh hoặc giấy tờ thay thế', 'Giấy tờ tùy thân của người đi đăng ký'],
  },
  {
    id: 'cu-tru',
    category: 'Hộ tịch',
    title: 'Đăng ký thường trú',
    summary: 'Thực hiện đăng ký thường trú khi công dân thay đổi nơi ở hợp pháp.',
    duration: '07 ngày làm việc',
    fee: 'Theo quy định hiện hành',
    featured: true,
    steps: ['Kê khai thông tin cư trú', 'Cung cấp giấy tờ chứng minh chỗ ở hợp pháp', 'Theo dõi và nhận thông báo kết quả'],
    documents: ['Phiếu thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp', 'Căn cước công dân hoặc định danh điện tử'],
  },
  {
    id: 'giay-phep-xay-dung',
    category: 'Xây dựng',
    title: 'Cấp giấy phép xây dựng nhà ở riêng lẻ',
    summary: 'Cấp phép xây dựng nhà ở riêng lẻ tại đô thị và khu dân cư.',
    duration: '15 ngày làm việc',
    fee: 'Theo quy định hiện hành',
    featured: true,
    steps: ['Chuẩn bị bản vẽ và hồ sơ pháp lý', 'Nộp hồ sơ tại Bộ phận Một cửa', 'Nhận giấy phép hoặc thông báo bổ sung'],
    documents: ['Đơn đề nghị cấp giấy phép', 'Giấy tờ chứng minh quyền sử dụng đất', '02 bộ bản vẽ thiết kế xây dựng'],
  },
  {
    id: 'ho-tro-kho-khan',
    category: 'An sinh xã hội',
    title: 'Đề nghị hỗ trợ người có hoàn cảnh khó khăn',
    summary: 'Tiếp nhận và xem xét hồ sơ đề nghị hỗ trợ đột xuất cho người dân.',
    duration: '03 ngày làm việc',
    fee: 'Không thu phí',
    featured: false,
    steps: ['Nộp đơn đề nghị hỗ trợ', 'Cơ quan chức năng xác minh thông tin', 'Nhận kết quả hỗ trợ'],
    documents: ['Đơn đề nghị hỗ trợ', 'Giấy tờ tùy thân', 'Tài liệu chứng minh hoàn cảnh nếu có'],
  },
  {
    id: 'dang-ky-ho-kinh-doanh',
    category: 'Kinh doanh',
    title: 'Đăng ký hộ kinh doanh',
    summary: 'Đăng ký thành lập hộ kinh doanh và nhận giấy chứng nhận đăng ký.',
    duration: '03 ngày làm việc',
    fee: 'Theo quy định hiện hành',
    featured: false,
    steps: ['Chuẩn bị thông tin hộ kinh doanh', 'Nộp hồ sơ đăng ký', 'Nhận giấy chứng nhận đăng ký hộ kinh doanh'],
    documents: ['Giấy đề nghị đăng ký hộ kinh doanh', 'Bản sao giấy tờ tùy thân của chủ hộ', 'Biên bản họp thành viên nếu có'],
  },
  { id: 'trich-luc-ho-tich', category: 'Hộ tịch', title: 'Cấp bản sao trích lục hộ tịch', summary: 'Cấp bản sao giấy khai sinh, giấy chứng tử, giấy đăng ký kết hôn đã được đăng ký.', duration: 'Trong ngày làm việc', fee: '8.000 đồng/bản sao', featured: false, steps: ['Chọn loại trích lục cần cấp', 'Nộp tờ khai và giấy tờ tùy thân', 'Nhận bản sao trích lục theo lịch hẹn'], documents: ['Tờ khai cấp bản sao trích lục hộ tịch', 'Giấy tờ tùy thân còn hiệu lực'] },
  { id: 'xac-nhan-cu-tru', category: 'Hộ tịch', title: 'Xác nhận thông tin về cư trú', summary: 'Xác nhận thông tin cư trú phục vụ học tập, lao động và các nhu cầu hợp pháp.', duration: '03 ngày làm việc', fee: 'Không thu phí', featured: false, steps: ['Kê khai yêu cầu xác nhận', 'Nộp hồ sơ trực tuyến hoặc trực tiếp', 'Nhận văn bản xác nhận'], documents: ['Tờ khai thay đổi thông tin cư trú', 'Căn cước công dân hoặc định danh điện tử'] },
  { id: 'cap-doi-giay-phep-xay-dung', category: 'Xây dựng', title: 'Cấp điều chỉnh giấy phép xây dựng', summary: 'Điều chỉnh giấy phép xây dựng khi có thay đổi phù hợp với quy định hiện hành.', duration: '10 ngày làm việc', fee: 'Theo quy định hiện hành', featured: false, steps: ['Chuẩn bị hồ sơ điều chỉnh', 'Nộp tại Bộ phận Một cửa', 'Nhận giấy phép điều chỉnh'], documents: ['Đơn đề nghị điều chỉnh giấy phép', 'Bản chính giấy phép xây dựng đã cấp', 'Bản vẽ thiết kế điều chỉnh'] },
  { id: 'xac-nhan-nguoi-co-cong', category: 'An sinh xã hội', title: 'Xác nhận hồ sơ người có công', summary: 'Tiếp nhận hồ sơ xác nhận và hướng dẫn chế độ cho người có công với cách mạng.', duration: '05 ngày làm việc', fee: 'Không thu phí', featured: false, steps: ['Chuẩn bị hồ sơ chứng minh', 'Nộp tại Bộ phận Một cửa', 'Nhận thông báo hoặc kết quả'], documents: ['Đơn đề nghị xác nhận', 'Giấy tờ chứng minh liên quan', 'Căn cước công dân'] },
  { id: 'dang-ky-tam-tru', category: 'Hộ tịch', title: 'Đăng ký tạm trú', summary: 'Hướng dẫn đăng ký tạm trú tại nơi ở hợp pháp trên địa bàn phường.', duration: '03 ngày làm việc', fee: 'Theo quy định hiện hành', featured: false, steps: ['Kê khai thông tin tạm trú', 'Cung cấp giấy tờ về chỗ ở', 'Nhận thông báo kết quả'], documents: ['Tờ khai thay đổi thông tin cư trú', 'Giấy tờ chứng minh chỗ ở hợp pháp', 'Căn cước công dân'] },
];

export const newsCategories = ['Tất cả', 'Thông báo', 'Đời sống', 'Cải cách hành chính'];

export const news = [
  { id: 'bo-phan-mot-cua', category: 'Thông báo', date: '18/07/2026', title: 'Bộ phận Một cửa mở rộng thời gian hỗ trợ hồ sơ trực tuyến', excerpt: 'Người dân có thể nhận hỗ trợ kê khai và nộp hồ sơ trực tuyến trong các khung giờ thuận tiện hơn.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=80' },
  { id: 'ngay-chu-nhat-xanh', category: 'Đời sống', date: '12/07/2026', title: 'Phường phát động Ngày Chủ nhật xanh tháng 7', excerpt: 'Cùng chung tay giữ gìn môi trường sống sạch đẹp tại các khu phố trên địa bàn.', image: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=80' },
  { id: 'dich-vu-cong', category: 'Cải cách hành chính', date: '05/07/2026', title: 'Hướng dẫn sử dụng dịch vụ công trực tuyến toàn trình', excerpt: 'Các bước nộp hồ sơ, thanh toán lệ phí và nhận kết quả tại nhà được hướng dẫn rõ ràng.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80' },
  { id: 'lich-tiep-dan', category: 'Thông báo', date: '28/06/2026', title: 'Lịch tiếp công dân định kỳ tháng 7', excerpt: 'Thông tin lịch tiếp công dân và cách đăng ký làm việc với lãnh đạo địa phương.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80' },
  { id: 'tuyen-truyen-pccc', category: 'Đời sống', date: '24/06/2026', title: 'Khuyến nghị an toàn phòng cháy chữa cháy trong khu dân cư', excerpt: 'Người dân chủ động kiểm tra thiết bị điện, lối thoát nạn và các điều kiện an toàn tại nhà ở.', image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1000&q=80' },
  { id: 'cap-nhat-dia-chi', category: 'Thông báo', date: '19/06/2026', title: 'Thông báo cập nhật thông tin địa chỉ hành chính', excerpt: 'Hướng dẫn người dân sử dụng thông tin địa chỉ thống nhất trong hồ sơ và giao dịch hành chính.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80' },
  { id: 'cham-soc-nguoi-cao-tuoi', category: 'Đời sống', date: '15/06/2026', title: 'Chương trình chăm sóc sức khỏe người cao tuổi', excerpt: 'Thông tin khám sức khỏe định kỳ và tư vấn chăm sóc sức khỏe cho người cao tuổi trên địa bàn.', image: 'https://images.unsplash.com/photo-1576765608866-5b51046452be?auto=format&fit=crop&w=1000&q=80' },
  { id: 'ho-so-truc-tuyen', category: 'Cải cách hành chính', date: '09/06/2026', title: 'Những lưu ý khi nộp hồ sơ trực tuyến', excerpt: 'Kiểm tra định dạng tệp, thông tin liên hệ và mã hồ sơ để quá trình tiếp nhận diễn ra thuận lợi.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80' },
];

export const complaintStatuses = {
  'PA-2026-00128': { title: 'Đèn đường trước số 18 bị hỏng', category: 'Hạ tầng đô thị', status: 'Đang xử lý', statusTone: 'info', createdAt: '16/07/2026', location: 'Đường Lê Văn Việt, Khu phố 3', description: 'Đèn đường chiếu sáng trước cổng nhà số 18 đường Lê Văn Việt đã bị hỏng hơn 3 ngày. Khu vực này rất tối vào ban đêm, tiềm ẩn nguy cơ mất an toàn giao thông và an ninh trật tự. Người dân đi lại khó khăn, đặc biệt là người già và trẻ em. Kính mong chính quyền sớm kiểm tra và sửa chữa.', citizenName: 'Nguyễn Văn Hùng', citizenPhone: '0903123456', images: ['https://images.unsplash.com/photo-1617469165786-7a127a5c2f0e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1545159956-28b3a537c0e3?w=400&h=300&fit=crop'], timeline: [
    { label: 'Đã gửi phản ánh', date: '16/07/2026, 08:42', done: true },
    { label: 'Đã tiếp nhận', date: '16/07/2026, 10:15', done: true },
    { label: 'Đang xử lý', date: '17/07/2026, 09:00', done: true },
    { label: 'Hoàn tất xử lý', date: 'Dự kiến 19/07/2026', done: false },
  ] },
  'PA-2026-00091': { title: 'Rác thải chưa được thu gom', category: 'Môi trường', status: 'Đã giải quyết', statusTone: 'success', createdAt: '08/07/2026', location: 'Hẻm 42, đường Man Thiện', description: 'Rác thải sinh hoạt tại hẻm 42 đường Man Thiện đã 4 ngày chưa được thu gom, gây mùi hôi khó chịu và ảnh hưởng đến sức khỏe người dân xung quanh. Nhiều bao rác chất đống trước cổng hẻm, cản trở lối đi. Đề nghị đơn vị thu gom đến xử lý gấp.', citizenName: 'Trần Thị Mai', citizenPhone: '0903789456', images: ['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'], timeline: [
    { label: 'Đã gửi phản ánh', date: '08/07/2026, 14:20', done: true },
    { label: 'Đã tiếp nhận', date: '08/07/2026, 15:02', done: true },
    { label: 'Đã giải quyết', date: '09/07/2026, 11:30', done: true },
  ] },
  'PA-2026-00076': { title: 'Cống thoát nước bị nghẹt sau mưa lớn', category: 'Môi trường', status: 'Đã tiếp nhận', statusTone: 'info', createdAt: '03/07/2026', location: 'Đường Lã Xuân Oai, Khu phố 5', description: 'Sau trận mưa lớn ngày 02/07/2026, cống thoát nước trên đường Lã Xuân Oai đoạn gần Khu phố 5 bị nghẹt hoàn toàn. Nước không thoát kịp gây ngập úng cục bộ, ảnh hưởng đến việc đi lại và sinh hoạt của người dân. Nước đọng lại còn là nơi sinh sản của muỗi và côn trùng.', citizenName: 'Lê Văn Thành', citizenPhone: '0903555123', images: ['https://images.unsplash.com/photo-1599507593499-a3b2e0bbf62a?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1518134346374-184f9d813764?w=400&h=300&fit=crop'], timeline: [{ label: 'Đã gửi phản ánh', date: '03/07/2026, 16:12', done: true }, { label: 'Đã tiếp nhận', date: '04/07/2026, 08:30', done: true }, { label: 'Đang phân công xử lý', date: 'Dự kiến 05/07/2026', done: false }] },
  'PA-2026-00063': { title: 'Biển báo giao thông bị che khuất', category: 'Hạ tầng đô thị', status: 'Đang xử lý', statusTone: 'info', createdAt: '28/06/2026', location: 'Ngã tư Lê Văn Việt - Tăng Nhơn Phú', description: 'Biển báo giao thông tại ngã tư Lê Văn Việt - Tăng Nhơn Phú bị cành cây che khuất, người tham gia giao thông không nhìn thấy rõ. Đây là nút giao thông quan trọng, lưu lượng xe lớn. Việc không nhìn thấy biển báo có thể gây ra tai nạn giao thông nghiêm trọng.', citizenName: 'Phạm Thị Hoa', citizenPhone: '0903666789', images: ['https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&h=300&fit=crop'], timeline: [{ label: 'Đã gửi phản ánh', date: '28/06/2026, 09:05', done: true }, { label: 'Đã tiếp nhận', date: '28/06/2026, 14:10', done: true }, { label: 'Đang xử lý', date: '30/06/2026, 08:45', done: true }, { label: 'Hoàn tất xử lý', date: 'Dự kiến 04/07/2026', done: false }] },
  'PA-2026-00044': { title: 'Tiếng ồn kéo dài vào buổi tối', category: 'Trật tự đô thị', status: 'Đã chuyển đơn vị xử lý', statusTone: 'info', createdAt: '21/06/2026', location: 'Đường Nguyễn Văn Tăng, Khu phố 2', description: 'Quán nhậu tại số 32 đường Nguyễn Văn Tăng thường xuyên mở nhạc lớn và hoạt động đến 1-2 giờ sáng, gây tiếng ồn ảnh hưởng nghiêm trọng đến giấc ngủ và sinh hoạt của người dân xung quanh. Đã nhắc nhở nhiều lần nhưng không có kết quả. Đề nghị chính quyền can thiệp.', citizenName: 'Hoàng Thị Lan', citizenPhone: '0903999456', images: [], timeline: [{ label: 'Đã gửi phản ánh', date: '21/06/2026, 20:18', done: true }, { label: 'Đã tiếp nhận', date: '22/06/2026, 08:15', done: true }, { label: 'Đã chuyển đơn vị xử lý', date: '22/06/2026, 10:05', done: true }, { label: 'Thông báo kết quả', date: 'Dự kiến 25/06/2026', done: false }] },
  'PA-2026-00022': { title: 'Cây xanh có cành nguy hiểm', category: 'Cây xanh đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '10/06/2026', location: 'Đường Võ Chí Công, Khu phố 1', description: 'Cây xà cừ lớn trước cổng trường Tiểu học Tăng Nhơn Phú có nhiều cành khô và cành mọc thấp, có nguy cơ gãy đổ khi mưa gió. Vị trí này có nhiều học sinh qua lại hàng ngày. Rất mong chính quyền cho kiểm tra và cắt tỉa để đảm bảo an toàn.', citizenName: 'Vũ Đức Minh', citizenPhone: '0903222789', images: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&h=300&fit=crop'], timeline: [{ label: 'Đã gửi phản ánh', date: '10/06/2026, 07:40', done: true }, { label: 'Đã tiếp nhận', date: '10/06/2026, 09:22', done: true }, { label: 'Đã giải quyết', date: '12/06/2026, 15:45', done: true }] },
};

// Các phản ánh hoàn thành dùng cho luồng đánh giá SOS-018 trên bản demo.
Object.assign(complaintStatuses, {
  'PA-2026-00130': { title: 'Đèn tín hiệu tại ngã tư hoạt động chập chờn', category: 'Hạ tầng đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '13/07/2026', location: 'Ngã tư Tăng Nhơn Phú - Lê Văn Việt', timeline: [] },
  'PA-2026-00131': { title: 'Rác tồn đọng tại khu phố 4', category: 'Môi trường', status: 'Đã giải quyết', statusTone: 'success', createdAt: '12/07/2026', location: 'Khu phố 4, phường Tăng Nhơn Phú', timeline: [] },
  'PA-2026-00132': { title: 'Nắp cống bị hư hỏng trước trường học', category: 'Hạ tầng đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '11/07/2026', location: 'Đường Man Thiện, Khu phố 2', timeline: [] },
  'PA-2026-00133': { title: 'Đề nghị bổ sung thùng rác công cộng', category: 'Môi trường', status: 'Đã giải quyết', statusTone: 'success', createdAt: '10/07/2026', location: 'Công viên Khu phố 5', timeline: [] },
  'PA-2026-00134': { title: 'Vạch qua đường bị mờ', category: 'Trật tự đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '09/07/2026', location: 'Đường Võ Chí Công, Khu phố 1', timeline: [] },
  'PA-2026-00135': { title: 'Cây xanh che khuất biển báo', category: 'Cây xanh đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '08/07/2026', location: 'Đường Nguyễn Văn Tăng, Khu phố 3', timeline: [] },
  'PA-2026-00136': { title: 'Đề nghị sửa đèn chiếu sáng hẻm', category: 'Điện, nước, chiếu sáng', status: 'Đã giải quyết', statusTone: 'success', createdAt: '07/07/2026', location: 'Hẻm 18, Khu phố 2', timeline: [] },
  'PA-2026-00137': { title: 'Mặt đường xuống cấp cần khắc phục', category: 'Hạ tầng đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '06/07/2026', location: 'Đường Lã Xuân Oai, Khu phố 6', timeline: [] },
});

export const contactInfo = {
  address: '12 Nguyễn Văn Tăng, phường Tăng Nhơn Phú, Thành phố Hồ Chí Minh',
  phone: '(028) 3896 1234',
  email: 'motcua@longthanhmy.gov.vn',
  hours: 'Thứ Hai đến Thứ Sáu, 07:30 - 11:30 và 13:30 - 17:00',
};

export const departments = [
  { name: 'Bộ phận Một cửa', description: 'Tiếp nhận hồ sơ hành chính và hỗ trợ dịch vụ công.', phone: '(028) 3896 1234' },
  { name: 'Văn phòng Ủy ban nhân dân', description: 'Thông tin điều hành và lịch tiếp công dân.', phone: '(028) 3896 1235' },
  { name: 'Bộ phận Đô thị và Môi trường', description: 'Tiếp nhận phản ánh về hạ tầng, trật tự và môi trường.', phone: '(028) 3896 1236' },
  { name: 'Bộ phận Văn hóa - Xã hội', description: 'Hỗ trợ thông tin an sinh xã hội, giáo dục và hoạt động cộng đồng.', phone: '(028) 3896 1237' },
];

export const libraryCategories = [
  { id: 'tu-sach', label: 'Tủ Sách Cộng Đồng', description: 'Sách hay được chia sẻ từ cộng đồng dân cư', icon: 'BookOpen', tone: 'blue', color: '#2563EB' },
  { id: 'tai-lieu', label: 'Tài Liệu Hướng Dẫn', description: 'Cẩm nang, hướng dẫn sử dụng dịch vụ công', icon: 'FileText', tone: 'green', color: '#059669' },
  { id: 'van-ban', label: 'Văn Bản Cần Biết', description: 'Nghị định, thông tư, quyết định quan trọng', icon: 'ScrollText', tone: 'orange', color: '#EA580C' },
  { id: 'ban-do', label: 'Bản Đồ Di Tích', description: 'Khám phá di tích lịch sử, văn hóa địa phương', icon: 'Map', tone: 'purple', color: '#7C3AED' },
];

export const libraryDocuments = [
  { id: 'sach-01', category: 'tu-sach', title: 'Lịch Sử Phường Tăng Nhơn Phú Qua Các Thời Kỳ', author: 'Ban Văn hóa Phường', cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', description: 'Tìm hiểu về lịch sử hình thành, phát triển và những dấu mốc quan trọng của phường Tăng Nhơn Phú từ thời kỳ khai hoang đến nay.', downloads: 3842, featured: true, docType: 'Sách', tags: ['lịch sử', 'địa phương', 'văn hóa'],
    sections: [
      { heading: 'Chương 1: Khái Quát Địa Lý & Dân Cư', content: 'Phường Tăng Nhơn Phú nằm ở phía Đông thành phố Thủ Đức, có diện tích khoảng 3,2 km² với dân số trên 35.000 người. Vị trí địa lý thuận lợi với các tuyến đường huyết mạch như Lê Văn Việt, Võ Văn Ngân, Tăng Nhơn Phú chạy qua, tạo điều kiện phát triển kinh tế - xã hội.' },
      { heading: 'Chương 2: Giai Đoạn Khai Hoang (Trước 1975)', content: 'Trước năm 1975, khu vực Tăng Nhơn Phú chủ yếu là đất nông nghiệp với những cánh đồng lúa bạt ngàn. Người dân sống chủ yếu bằng nghề trồng lúa nước và hoa màu. Dân cư thưa thớt, tập trung thành các xóm nhỏ ven đường.' },
      { heading: 'Chương 3: Thời Kỳ Đổi Mới (1986 - 2000)', content: 'Sau Đổi Mới, phường Tăng Nhơn Phú có những chuyển biến mạnh mẽ về kinh tế. Nhiều cơ sở sản xuất, xí nghiệp được hình thành, thu hút lao động từ khắp nơi đổ về. Hệ thống trường học, trạm y tế được đầu tư xây dựng.' },
      { heading: 'Chương 4: Phát Triển Đô Thị (2000 - Nay)', content: 'Cùng với sự phát triển của thành phố Thủ Đức, Tăng Nhơn Phú đã chuyển mình thành đô thị hiện đại. Nhiều khu dân cư mới, trung tâm thương mại, công viên được xây dựng. Đời sống người dân ngày càng được nâng cao.' },
    ]
  },
  { id: 'sach-02', category: 'tu-sach', title: 'Cẩm Nang Sống Xanh Trong Khu Dân Cư', author: 'Bộ phận Môi trường', cover: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=600&q=80', description: 'Hướng dẫn thực hành phân loại rác, tiết kiệm năng lượng và bảo vệ môi trường sống.', downloads: 2198, featured: true, docType: 'Sách', tags: ['môi trường', 'sống xanh', 'hướng dẫn'],
    sections: [
      { heading: 'Phần 1: Tại Sao Cần Sống Xanh?', content: 'Sống xanh không chỉ là xu hướng mà còn là trách nhiệm của mỗi người dân đối với môi trường sống. Việc giảm thiểu rác thải, tiết kiệm năng lượng và bảo vệ tài nguyên thiên nhiên giúp cải thiện chất lượng cuộc sống cho chính chúng ta và thế hệ tương lai. Phường Tăng Nhơn Phú đang từng ngày nỗ lực xây dựng một môi trường xanh - sạch - đẹp.' },
      { heading: 'Phần 2: Phân Loại Rác Tại Nguồn', content: 'Rác thải sinh hoạt được chia thành 3 nhóm chính: rác hữu cơ (thức ăn thừa, lá cây), rác tái chế (giấy, nhựa, kim loại, thủy tinh) và rác khác. Mỗi hộ gia đình nên có ít nhất 2 thùng rác riêng biệt. Rác hữu cơ có thể ủ làm phân bón cho cây trồng. Rác tái chế nên được rửa sạch trước khi bỏ vào thùng.' },
      { heading: 'Phần 3: Tiết Kiệm Năng Lượng Trong Gia Đình', content: 'Tắt đèn và các thiết bị điện khi không sử dụng. Sử dụng bóng đèn LED thay cho bóng đèn sợi đốt giúp tiết kiệm đến 80% điện năng. Lắp đặt bình nước nóng năng lượng mặt trời. Hạn chế sử dụng máy lạnh, thay vào đó mở cửa sổ để đón gió tự nhiên vào buổi sáng và chiều mát.' },
      { heading: 'Phần 4: Bảo Vệ Nguồn Nước', content: 'Không xả rác, dầu mỡ xuống cống thoát nước. Sử dụng nước tiết kiệm: tắt vòi khi đánh răng, sửa chữa ngay các vòi nước bị rò rỉ. Thu gom nước mưa để tưới cây. Hạn chế sử dụng hóa chất tẩy rửa độc hại gây ô nhiễm nguồn nước ngầm.' },
      { heading: 'Phần 5: Trồng Cây Xanh — Lá Phổi Của Khu Phố', content: 'Mỗi gia đình nên trồng ít nhất 1-2 cây xanh trong khuôn viên nhà. Cây xanh giúp lọc không khí, giảm nhiệt độ và tạo cảnh quan đẹp. Các loại cây được khuyến khích: cây ăn quả, cây bóng mát, cây cảnh trong nhà như lưỡi hổ, trầu bà, nha đam. Tham gia các đợt trồng cây do phường tổ chức.' },
    ]
  },
  { id: 'sach-03', category: 'tu-sach', title: 'Chuyện Kể Về Những Người Anh Hùng Địa Phương', author: 'Hội Cựu Chiến binh', cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80', description: 'Tập hợp những câu chuyện cảm động về các anh hùng, liệt sĩ xuất thân từ địa phương.', downloads: 5621, featured: true, docType: 'Sách', tags: ['lịch sử', 'anh hùng', 'địa phương'],
    sections: [
      { heading: 'Lời Mở Đầu', content: 'Phường Tăng Nhơn Phú tự hào là quê hương của nhiều người con ưu tú đã anh dũng chiến đấu và hy sinh vì độc lập, tự do của Tổ quốc. Cuốn sách này tập hợp những câu chuyện chân thực, xúc động về cuộc đời và sự nghiệp cách mạng của các anh hùng, liệt sĩ tiêu biểu trên địa bàn.' },
      { heading: 'Chương 1: Người Anh Hùng Lực Lượng Vũ Trang', content: 'Ông Nguyễn Văn A (1925-1968) sinh ra trong một gia đình nông dân nghèo tại khu vực nay thuộc phường Tăng Nhơn Phú. Tham gia cách mạng từ năm 17 tuổi, ông đã có mặt trong nhiều trận đánh lớn, lập nhiều chiến công xuất sắc. Đặc biệt, trong trận đánh đồn địch năm 1968, ông đã anh dũng hy sinh sau khi hoàn thành xuất sắc nhiệm vụ.' },
      { heading: 'Chương 2: Nữ Biệt Động Thành', content: 'Bà Trần Thị B (1930-1968) là nữ biệt động thành hoạt động ngay trong lòng địch. Với vỏ bọc là tiểu thương buôn bán nhỏ, bà đã vận chuyển nhiều tài liệu mật, vũ khí qua các trạm kiểm soát của địch, góp phần quan trọng vào chiến dịch Tổng tiến công Mậu Thân 1968.' },
      { heading: 'Chương 3: Người Thầy Thuốc Nơi Chiến Tuyến', content: 'Bác sĩ Lê Văn C (1928-1975) là một trong những y bác sĩ đầu tiên của trạm xá tiền phương khu vực. Trong điều kiện thiếu thốn thuốc men, dụng cụ, ông đã tận tụy cứu chữa cho hàng trăm thương binh và người dân. Ông được truy tặng danh hiệu Thầy thuốc ưu tú.' },
      { heading: 'Lời Kết: Tiếp Nối Truyền Thống', content: 'Ngày nay, thế hệ trẻ phường Tăng Nhơn Phú tiếp tục phát huy truyền thống yêu nước của cha ông. Nhiều phong trào đền ơn đáp nghĩa, chăm sóc gia đình chính sách được duy trì thường xuyên. Đường phố, trường học mang tên các anh hùng liệt sĩ như một lời nhắc nhở về sự hy sinh cao cả cho độc lập dân tộc.' },
    ]
  },
  { id: 'sach-04', category: 'tu-sach', title: 'Truyện Cổ Tích Cho Thiếu Nhi - Tập 1', author: 'Thư viện Cộng đồng', cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', description: 'Tuyển tập các truyện cổ tích, ngụ ngôn giúp các em thiếu nhi nuôi dưỡng trí tưởng tượng.', downloads: 12340, featured: false, docType: 'Sách', tags: ['thiếu nhi', 'truyện', 'giáo dục'] },
  { id: 'sach-05', category: 'tu-sach', title: 'Kỹ Năng Số Cho Người Cao Tuổi', author: 'Hội Người Cao tuổi', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', description: 'Hướng dẫn sử dụng điện thoại thông minh, mạng xã hội và các ứng dụng hữu ích.', downloads: 8750, featured: false, docType: 'Sách', tags: ['người cao tuổi', 'công nghệ', 'kỹ năng số'] },

  { id: 'tl-01', category: 'tai-lieu', title: 'Hướng Dẫn Đăng Ký Tài Khoản Dịch Vụ Công Trực Tuyến', author: 'Bộ phận Một cửa', cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', description: 'Các bước đăng ký, xác thực tài khoản và sử dụng cổng dịch vụ công trực tuyến từ A đến Z.', downloads: 15230, featured: true, docType: 'Tài liệu hướng dẫn', tags: ['dịch vụ công', 'trực tuyến', 'hướng dẫn'],
    sections: [
      { heading: '1. Chuẩn Bị Trước Khi Đăng Ký', content: 'Bạn cần chuẩn bị: Căn cước công dân hoặc CMND còn hiệu lực, số điện thoại di động chính chủ, địa chỉ email (nếu có). Nên sử dụng điện thoại thông minh hoặc máy tính có kết nối Internet ổn định.' },
      { heading: '2. Các Bước Đăng Ký Tài Khoản', content: 'Bước 1: Truy cập cổng dịch vụ công quốc gia tại địa chỉ dichvucong.gov.vn. Bước 2: Chọn mục "Đăng ký" và điền đầy đủ thông tin cá nhân theo mẫu. Bước 3: Tải ảnh chụp CCCD/CMND lên hệ thống. Bước 4: Xác thực OTP qua số điện thoại.' },
      { heading: '3. Xác Thực Định Danh', content: 'Sau khi đăng ký, bạn cần đến Bộ phận Một cửa tại UBND phường để xác thực định danh trực tiếp (mang theo CCCD gốc). Nếu đã có tài khoản VNeID, bạn có thể sử dụng để đăng nhập luôn.' },
      { heading: '4. Sử Dụng Dịch Vụ Công', content: 'Sau khi tài khoản được kích hoạt, bạn có thể: Nộp hồ sơ trực tuyến, tra cứu tình trạng xử lý hồ sơ, thanh toán lệ phí trực tuyến (nếu có), nhận kết quả điện tử hoặc đăng ký nhận qua bưu điện.' },
    ]
  },
  { id: 'tl-02', category: 'tai-lieu', title: 'Tờ Rơi Phòng Cháy Chữa Cháy Hộ Gia Đình', author: 'Đội PCCC Phường', cover: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80', description: 'Nội dung cơ bản về an toàn PCCC: kiểm tra thiết bị điện, thoát nạn và sử dụng bình chữa cháy.', downloads: 9876, featured: true, docType: 'Tài liệu hướng dẫn', tags: ['PCCC', 'an toàn', 'hướng dẫn'],
    sections: [
      { heading: '1. Kiểm Tra Hệ Thống Điện Định Kỳ', content: 'Không cắm quá nhiều thiết bị vào cùng một ổ điện. Thường xuyên kiểm tra dây điện, ổ cắm, phích cắm. Thay thế ngay các dây điện bị hở, cũ mục. Không luồn dây điện dưới thảm, đệm. Lắp đặt aptomat chống giật cho từng khu vực trong nhà.' },
      { heading: '2. Bếp Nấu Và Nguồn Lửa', content: 'Không để các vật dễ cháy gần bếp gas. Tắt bếp ngay sau khi nấu xong. Khóa van bình gas khi không sử dụng. Để bình gas ở nơi thoáng khí, tránh ánh nắng trực tiếp. Không tích trữ xăng dầu trong nhà.' },
      { heading: '3. Thoát Nạn Khi Có Cháy', content: 'Xác định ít nhất 2 lối thoát nạn từ mỗi phòng. Giữ lối thoát luôn thông thoáng, không khóa chết. Trang bị thang dây, mặt nạ phòng độc nếu nhà cao tầng. Khi có cháy: bình tĩnh, cúi thấp người, dùng khăn ướt che mũi miệng, di chuyển nhanh ra ngoài.' },
      { heading: '4. Sử Dụng Bình Chữa Cháy', content: 'Mỗi gia đình nên có ít nhất 1 bình chữa cháy xách tay loại bột hoặc CO2. Cách sử dụng: Rút chốt an toàn, hướng vòi vào gốc lửa, bóp cò. Đứng cách đám cháy khoảng 1.5-2m. Quét vòi qua lại cho đến khi lửa tắt hẳn. Kiểm tra hạn sử dụng bình định kỳ 6 tháng/lần.' },
    ]
  },
  { id: 'tl-03', category: 'tai-lieu', title: 'Sổ Tay Sức Khỏe Gia Đình: Phòng Bệnh Mùa Mưa', author: 'Trạm Y tế Phường', cover: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80', description: 'Hướng dẫn phòng chống các bệnh thường gặp trong mùa mưa: sốt xuất huyết, cảm cúm, tiêu chảy.', downloads: 14200, featured: false, docType: 'Tài liệu hướng dẫn', tags: ['sức khỏe', 'phòng bệnh', 'gia đình'] },
  { id: 'tl-04', category: 'tai-lieu', title: 'Hướng Dẫn Làm Hồ Sơ Xin Việc Cho Thanh Niên Địa Phương', author: 'Đoàn Thanh niên', cover: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', description: 'Kỹ năng viết CV, thư xin việc và chuẩn bị phỏng vấn cho thanh niên mới ra trường.', downloads: 6230, featured: false, docType: 'Tài liệu hướng dẫn', tags: ['việc làm', 'thanh niên', 'kỹ năng'] },
  { id: 'tl-05', category: 'tai-lieu', title: 'Cẩm Nang An Toàn Giao Thông Cho Học Sinh', author: 'Công an Phường', cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', description: 'Luật giao thông cơ bản, biển báo thường gặp và kỹ năng tham gia giao thông an toàn.', downloads: 18900, featured: false, docType: 'Tài liệu hướng dẫn', tags: ['giao thông', 'an toàn', 'học sinh'] },

  { id: 'vb-01', category: 'van-ban', title: 'Quy Định Về Quản Lý Trật Tự Đô Thị Trên Địa Bàn Phường', author: 'UBND Phường Tăng Nhơn Phú', cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', description: 'Tổng hợp các quy định về trật tự xây dựng, lấn chiếm vỉa hè, lòng lề đường và xử phạt hành chính.', downloads: 5670, featured: true, docType: 'Văn bản pháp luật', issuingAgency: 'UBND Phường Tăng Nhơn Phú', issuedDate: '15/06/2025', effectiveDate: '01/07/2025', status: 'Đang hiệu lực', content: 'Nội dung chi tiết về quy định quản lý trật tự đô thị...', tags: ['trật tự đô thị', 'xây dựng', 'xử phạt'] },
  { id: 'vb-02', category: 'van-ban', title: 'Thông Tư Hướng Dẫn Thực Hiện Dân Chủ Cơ Sở', author: 'Bộ Nội vụ', cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', description: 'Quy chế thực hiện dân chủ ở xã, phường, thị trấn và quyền tham gia của người dân vào hoạt động quản lý nhà nước.', downloads: 3420, featured: false, docType: 'Văn bản pháp luật', issuingAgency: 'Bộ Nội vụ', issuedDate: '10/04/2025', effectiveDate: '01/06/2025', status: 'Đang hiệu lực', content: 'Nội dung chi tiết về thực hiện dân chủ cơ sở...', tags: ['dân chủ', 'cơ sở', 'quyền dân sự'] },
  { id: 'vb-03', category: 'van-ban', title: 'Nghị Định Về Xử Phạt Vi Phạm Hành Chính Trong Lĩnh Vực Đất Đai', author: 'Chính phủ', cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80', description: 'Quy định mức phạt và biện pháp khắc phục đối với các hành vi vi phạm hành chính về đất đai.', downloads: 7890, featured: false, docType: 'Văn bản pháp luật', issuingAgency: 'Chính phủ', issuedDate: '20/03/2025', effectiveDate: '15/05/2025', status: 'Đang hiệu lực', content: 'Nội dung chi tiết về xử phạt vi phạm đất đai...', tags: ['đất đai', 'xử phạt', 'vi phạm'] },
  { id: 'vb-04', category: 'van-ban', title: 'Quyết Định Ban Hành Quy Chế Tiếp Công Dân Tại UBND Phường', author: 'UBND Phường Tăng Nhơn Phú', cover: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80', description: 'Quy trình, thời gian và trách nhiệm tiếp nhận, xử lý kiến nghị của công dân tại trụ sở UBND phường.', downloads: 4560, featured: false, docType: 'Văn bản pháp luật', issuingAgency: 'UBND Phường Tăng Nhơn Phú', issuedDate: '01/01/2025', effectiveDate: '15/01/2025', status: 'Đang hiệu lực', content: 'Nội dung chi tiết về quy chế tiếp công dân...', tags: ['tiếp dân', 'quy chế', 'khiếu nại'] },
  { id: 'vb-05', category: 'van-ban', title: 'Luật Cư Trú Số 68/2020/QH14', author: 'Quốc hội', cover: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80', description: 'Quy định về quyền tự do cư trú, đăng ký và quản lý cư trú của công dân Việt Nam.', downloads: 12450, featured: true, docType: 'Văn bản pháp luật', issuingAgency: 'Quốc hội', issuedDate: '13/11/2020', effectiveDate: '01/07/2021', status: 'Đang hiệu lực', content: 'Luật này quy định về quyền tự do cư trú của công dân...', tags: ['cư trú', 'luật', 'quyền công dân'] },
  { id: 'vb-06', category: 'van-ban', title: 'Nghị Định 144/2021/NĐ-CP Về Xử Phạt An Ninh Trật Tự', author: 'Chính phủ', cover: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80', description: 'Quy định xử phạt vi phạm hành chính trong lĩnh vực an ninh, trật tự, an toàn xã hội.', downloads: 9870, featured: false, docType: 'Văn bản pháp luật', issuingAgency: 'Chính phủ', issuedDate: '31/12/2021', effectiveDate: '01/02/2022', status: 'Đang hiệu lực', content: 'Nội dung chi tiết về xử phạt an ninh trật tự...', tags: ['an ninh', 'trật tự', 'xử phạt'] },
  { id: 'vb-07', category: 'van-ban', title: 'Luật Hôn Nhân Và Gia Đình 2014 (Trích Yếu)', author: 'Quốc hội', cover: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80', description: 'Trích yếu các điều khoản quan trọng về kết hôn, ly hôn, quyền và nghĩa vụ của vợ chồng.', downloads: 8900, featured: false, docType: 'Văn bản pháp luật', issuingAgency: 'Quốc hội', issuedDate: '19/06/2014', effectiveDate: '01/01/2015', status: 'Đang hiệu lực', content: 'Trích yếu Luật Hôn nhân và Gia đình...', tags: ['hôn nhân', 'gia đình', 'quyền lợi'] },

  { id: 'bd-01', category: 'ban-do', title: 'Bản Đồ Di Tích Lịch Sử Phường Tăng Nhơn Phú', author: 'Ban Văn hóa', cover: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80', description: 'Bản đồ chi tiết vị trí các di tích lịch sử, văn hóa được công nhận trên địa bàn phường.', downloads: 12300, featured: true, docType: 'Bản đồ', tags: ['di tích', 'lịch sử', 'bản đồ'] },
  { id: 'bd-02', category: 'ban-do', title: 'Hành Trình Khám Phá Chùa Cổ Trên Địa Bàn', author: 'Hội Di sản Văn hóa', cover: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=600&q=80', description: 'Giới thiệu lịch sử các ngôi chùa cổ, kiến trúc độc đáo và lễ hội truyền thống.', downloads: 8760, featured: false, docType: 'Bản đồ', tags: ['chùa', 'di sản', 'văn hóa'] },
  { id: 'bd-03', category: 'ban-do', title: 'Tuyến Đường Di Sản: Dấu Chân Xưa Trên Đất Mới', author: 'Phòng Văn hóa Thông tin', cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80', description: 'Lộ trình tham quan các địa danh lịch sử, gắn với sự kiện quan trọng qua các thời kỳ.', downloads: 5100, featured: false, docType: 'Bản đồ', tags: ['du lịch', 'lịch sử', 'di sản'] },
];

export const citizenMockDb = { citizenNavItems, heroBanners, homeFeatures, importantNotices, emergencyContact, publicServices, citizenReceptionSchedule, procedureCategories, procedures, newsCategories, news, complaintStatuses, contactInfo, departments, libraryCategories, libraryDocuments };
