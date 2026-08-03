export const citizenNavItems = [
  { label: 'Trang chủ', to: '/cong-dong' },
  { label: 'Thủ tục hành chính', to: '/cong-dong/thu-tuc' },
  { label: 'Tin tức', to: '/cong-dong/tin-tuc' },
  { label: 'Gửi phản ánh', to: '/cong-dong/gui-phan-anh' },
  { label: 'Tra cứu phản ánh', to: '/cong-dong/tra-cuu' },
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
  { label: 'Phản ánh', description: 'Gửi ý kiến đến địa phương.', to: '/cong-dong/gui-phan-anh', icon: 'MessageSquare', tone: 'orange' },
  { label: 'Liên hệ', description: 'Kênh hỗ trợ và danh bạ phường.', to: '/cong-dong/lien-he', icon: 'Phone', tone: 'purple' },
  { label: 'Dịch vụ công', description: 'Tra cứu dịch vụ trực tuyến.', to: '/cong-dong/dich-vu-cong', icon: 'BriefcaseBusiness', tone: 'blue' },
  { label: 'Lịch tiếp dân', description: 'Thông tin lịch làm việc định kỳ.', to: '/cong-dong/lich-tiep-dan', icon: 'CalendarDays', tone: 'blue' },
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
  { id: 'lich-tiep-dan', type: 'Quan trọng', title: 'Thông báo lịch tiếp công dân tháng 11/2025', date: '20/10/2025', isNew: true },
  { id: 'khai-sinh-truc-tuyen', type: 'Tin tức', title: 'Hướng dẫn đăng ký khai sinh trực tuyến', date: '18/10/2025', isNew: false },
];

export const emergencyContact = { title: 'Liên hệ khẩn cấp', subtitle: 'Hỗ trợ thông tin 24/7', phoneLabel: 'Gọi ngay', messageLabel: 'Nhắn tin' };

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
  { id: 'bo-phan-mot-cua', category: 'Thông báo', date: '18/07/2026', title: 'Bộ phận Một cửa mở rộng thời gian hỗ trợ hồ sơ trực tuyến', excerpt: 'Người dân có thể nhận hỗ trợ kê khai và nộp hồ sơ trực tuyến trong các khung giờ thuận tiện hơn.', image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80' },
  { id: 'ngay-chu-nhat-xanh', category: 'Đời sống', date: '12/07/2026', title: 'Phường phát động Ngày Chủ nhật xanh tháng 7', excerpt: 'Cùng chung tay giữ gìn môi trường sống sạch đẹp tại các khu phố trên địa bàn.', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1000&q=80' },
  { id: 'dich-vu-cong', category: 'Cải cách hành chính', date: '05/07/2026', title: 'Hướng dẫn sử dụng dịch vụ công trực tuyến toàn trình', excerpt: 'Các bước nộp hồ sơ, thanh toán lệ phí và nhận kết quả tại nhà được hướng dẫn rõ ràng.', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80' },
  { id: 'lich-tiep-dan', category: 'Thông báo', date: '28/06/2026', title: 'Lịch tiếp công dân định kỳ tháng 7', excerpt: 'Thông tin lịch tiếp công dân và cách đăng ký làm việc với lãnh đạo địa phương.', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80' },
  { id: 'tuyen-truyen-pccc', category: 'Đời sống', date: '24/06/2026', title: 'Khuyến nghị an toàn phòng cháy chữa cháy trong khu dân cư', excerpt: 'Người dân chủ động kiểm tra thiết bị điện, lối thoát nạn và các điều kiện an toàn tại nhà ở.', image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1000&q=80' },
  { id: 'cap-nhat-dia-chi', category: 'Thông báo', date: '19/06/2026', title: 'Thông báo cập nhật thông tin địa chỉ hành chính', excerpt: 'Hướng dẫn người dân sử dụng thông tin địa chỉ thống nhất trong hồ sơ và giao dịch hành chính.', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80' },
  { id: 'cham-soc-nguoi-cao-tuoi', category: 'Đời sống', date: '15/06/2026', title: 'Chương trình chăm sóc sức khỏe người cao tuổi', excerpt: 'Thông tin khám sức khỏe định kỳ và tư vấn chăm sóc sức khỏe cho người cao tuổi trên địa bàn.', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80' },
  { id: 'ho-so-truc-tuyen', category: 'Cải cách hành chính', date: '09/06/2026', title: 'Những lưu ý khi nộp hồ sơ trực tuyến', excerpt: 'Kiểm tra định dạng tệp, thông tin liên hệ và mã hồ sơ để quá trình tiếp nhận diễn ra thuận lợi.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80' },
];

export const complaintStatuses = {
  'PA-2026-00128': { title: 'Đèn đường trước số 18 bị hỏng', category: 'Hạ tầng đô thị', status: 'Đang xử lý', statusTone: 'info', createdAt: '16/07/2026', location: 'Đường Lê Văn Việt, Khu phố 3', timeline: [
    { label: 'Đã gửi phản ánh', date: '16/07/2026, 08:42', done: true },
    { label: 'Đã tiếp nhận', date: '16/07/2026, 10:15', done: true },
    { label: 'Đang xử lý', date: '17/07/2026, 09:00', done: true },
    { label: 'Hoàn tất xử lý', date: 'Dự kiến 19/07/2026', done: false },
  ] },
  'PA-2026-00091': { title: 'Rác thải chưa được thu gom', category: 'Môi trường', status: 'Đã giải quyết', statusTone: 'success', createdAt: '08/07/2026', location: 'Hẻm 42, đường Man Thiện', timeline: [
    { label: 'Đã gửi phản ánh', date: '08/07/2026, 14:20', done: true },
    { label: 'Đã tiếp nhận', date: '08/07/2026, 15:02', done: true },
    { label: 'Đã giải quyết', date: '09/07/2026, 11:30', done: true },
  ] },
  'PA-2026-00076': { title: 'Cống thoát nước bị nghẹt sau mưa lớn', category: 'Môi trường', status: 'Đã tiếp nhận', statusTone: 'info', createdAt: '03/07/2026', location: 'Đường Lã Xuân Oai, Khu phố 5', timeline: [{ label: 'Đã gửi phản ánh', date: '03/07/2026, 16:12', done: true }, { label: 'Đã tiếp nhận', date: '04/07/2026, 08:30', done: true }, { label: 'Đang phân công xử lý', date: 'Dự kiến 05/07/2026', done: false }] },
  'PA-2026-00063': { title: 'Biển báo giao thông bị che khuất', category: 'Hạ tầng đô thị', status: 'Đang xử lý', statusTone: 'info', createdAt: '28/06/2026', location: 'Ngã tư Lê Văn Việt - Tăng Nhơn Phú', timeline: [{ label: 'Đã gửi phản ánh', date: '28/06/2026, 09:05', done: true }, { label: 'Đã tiếp nhận', date: '28/06/2026, 14:10', done: true }, { label: 'Đang xử lý', date: '30/06/2026, 08:45', done: true }, { label: 'Hoàn tất xử lý', date: 'Dự kiến 04/07/2026', done: false }] },
  'PA-2026-00044': { title: 'Tiếng ồn kéo dài vào buổi tối', category: 'Trật tự đô thị', status: 'Đã chuyển đơn vị xử lý', statusTone: 'info', createdAt: '21/06/2026', location: 'Đường Nguyễn Văn Tăng, Khu phố 2', timeline: [{ label: 'Đã gửi phản ánh', date: '21/06/2026, 20:18', done: true }, { label: 'Đã tiếp nhận', date: '22/06/2026, 08:15', done: true }, { label: 'Đã chuyển đơn vị xử lý', date: '22/06/2026, 10:05', done: true }, { label: 'Thông báo kết quả', date: 'Dự kiến 25/06/2026', done: false }] },
  'PA-2026-00022': { title: 'Cây xanh có cành nguy hiểm', category: 'Cây xanh đô thị', status: 'Đã giải quyết', statusTone: 'success', createdAt: '10/06/2026', location: 'Đường Võ Chí Công, Khu phố 1', timeline: [{ label: 'Đã gửi phản ánh', date: '10/06/2026, 07:40', done: true }, { label: 'Đã tiếp nhận', date: '10/06/2026, 09:22', done: true }, { label: 'Đã giải quyết', date: '12/06/2026, 15:45', done: true }] },
};

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

export const citizenMockDb = { citizenNavItems, heroBanners, homeFeatures, importantNotices, emergencyContact, publicServices, citizenReceptionSchedule, procedureCategories, procedures, newsCategories, news, complaintStatuses, contactInfo, departments };
