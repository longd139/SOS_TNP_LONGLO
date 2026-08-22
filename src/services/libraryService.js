/**
 * LIBRARY SERVICE — Tầng dịch vụ Thư viện số
 *
 * KIẾN TRÚC:
 * - Hiện tại: MOCK_MODE = true → dùng dữ liệu ảo mô phỏng API thật
 * - Khi có BE: MOCK_MODE = false → gọi API thật qua apiClient
 *
 * Cấu trúc response mô phỏng đúng format backend sẽ trả về.
 */

import apiClient from '../utils/apiClient'; // eslint-disable-line no-unused-vars

/* ─── CONFIG ─── */
const MOCK_MODE = true; // ← Đổi thành false khi có backend thật

/* ─── MOCK DATABASE — Luật pháp Việt Nam ─── */
const MOCK_LAWS = [
  {
    id: 'law-hp-2013',
    type: 'Hiến pháp',
    code: 'Hiến pháp 2013',
    title: 'Hiến Pháp Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam',
    issuingAgency: 'Quốc hội',
    issuedDate: '28/11/2013',
    effectiveDate: '01/01/2014',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Đạo luật cơ bản và tối cao của nước CHXHCN Việt Nam, quy định chế độ chính trị, kinh tế, văn hóa, xã hội, quốc phòng, an ninh, quyền và nghĩa vụ cơ bản của công dân.',
    chapters: [
      { title: 'Chương I: Chế Độ Chính Trị', articles: ['Điều 1: Nước CHXHCN Việt Nam là một nước độc lập, có chủ quyền...', 'Điều 2: Nhà nước CHXHCN Việt Nam là nhà nước pháp quyền XHCN...'] },
      { title: 'Chương II: Quyền Con Người, Quyền Và Nghĩa Vụ Cơ Bản Của Công Dân', articles: ['Điều 14: Ở nước CHXHCN Việt Nam, các quyền con người...', 'Điều 15: Quyền công dân không tách rời nghĩa vụ công dân...'] },
      { title: 'Chương III: Kinh Tế, Xã Hội, Văn Hóa, Giáo Dục, Khoa Học, Công Nghệ Và Môi Trường', articles: ['Điều 50: Nước CHXHCN Việt Nam xây dựng nền kinh tế độc lập, tự chủ...'] },
    ],
    tags: ['hiến pháp', 'luật cơ bản', 'quyền công dân', 'nhà nước'],
    downloads: 256800,
  },
  {
    id: 'law-ds-2015',
    type: 'Bộ luật',
    code: 'Bộ luật Dân sự 91/2015/QH13',
    title: 'Bộ Luật Dân Sự',
    issuingAgency: 'Quốc hội',
    issuedDate: '24/11/2015',
    effectiveDate: '01/01/2017',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định địa vị pháp lý, chuẩn mực pháp lý về cách ứng xử của cá nhân, pháp nhân trong quan hệ dân sự.',
    chapters: [
      { title: 'Phần 1: Quy Định Chung', articles: ['Điều 1: Phạm vi điều chỉnh', 'Điều 2: Các nguyên tắc cơ bản của pháp luật dân sự'] },
      { title: 'Phần 2: Quyền Sở Hữu Và Quyền Khác Đối Với Tài Sản', articles: ['Điều 158: Quyền sở hữu', 'Điều 159: Quyền khác đối với tài sản'] },
    ],
    tags: ['dân sự', 'tài sản', 'quyền sở hữu', 'hợp đồng'],
    downloads: 189400,
  },
  {
    id: 'law-hs-2015',
    type: 'Bộ luật',
    code: 'Bộ luật Hình sự 100/2015/QH13',
    title: 'Bộ Luật Hình Sự',
    issuingAgency: 'Quốc hội',
    issuedDate: '27/11/2015',
    effectiveDate: '01/01/2018',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về tội phạm và hình phạt đối với người phạm tội, bảo vệ an ninh quốc gia, trật tự an toàn xã hội.',
    chapters: [
      { title: 'Phần 2: Các Tội Phạm', articles: ['Chương XIII: Các tội xâm phạm an ninh quốc gia', 'Chương XIV: Các tội xâm phạm tính mạng, sức khỏe'] },
    ],
    tags: ['hình sự', 'tội phạm', 'hình phạt', 'an ninh'],
    downloads: 213600,
  },
  {
    id: 'law-datdai-2013',
    type: 'Luật',
    code: 'Luật Đất đai 45/2013/QH13',
    title: 'Luật Đất Đai',
    issuingAgency: 'Quốc hội',
    issuedDate: '29/11/2013',
    effectiveDate: '01/07/2014',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về quyền hạn và trách nhiệm của Nhà nước đối với đất đai, quyền và nghĩa vụ của người sử dụng đất.',
    chapters: [
      { title: 'Chương II: Quyền Và Trách Nhiệm Của Nhà Nước Đối Với Đất Đai', articles: ['Điều 13: Nhà nước thực hiện quyền đại diện chủ sở hữu...', 'Điều 14: Nhà nước quyết định quy hoạch, kế hoạch sử dụng đất...'] },
      { title: 'Chương XI: Quyền Và Nghĩa Vụ Của Người Sử Dụng Đất', articles: ['Điều 166: Quyền chung của người sử dụng đất', 'Điều 167: Quyền chuyển đổi, chuyển nhượng...'] },
    ],
    tags: ['đất đai', 'sử dụng đất', 'quyền sở hữu', 'nhà ở'],
    downloads: 276100,
  },
  {
    id: 'law-honnhan-2014',
    type: 'Luật',
    code: 'Luật Hôn nhân và Gia đình 52/2014/QH13',
    title: 'Luật Hôn Nhân Và Gia Đình',
    issuingAgency: 'Quốc hội',
    issuedDate: '19/06/2014',
    effectiveDate: '01/01/2015',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về chế độ hôn nhân và gia đình, quyền và nghĩa vụ của vợ chồng, cha mẹ và con cái.',
    chapters: [
      { title: 'Chương III: Kết Hôn', articles: ['Điều 8: Điều kiện kết hôn', 'Điều 9: Đăng ký kết hôn'] },
      { title: 'Chương IV: Chấm Dứt Hôn Nhân', articles: ['Điều 51: Quyền yêu cầu giải quyết ly hôn', 'Điều 55: Thuận tình ly hôn'] },
    ],
    tags: ['hôn nhân', 'gia đình', 'kết hôn', 'ly hôn'],
    downloads: 156300,
  },
  {
    id: 'law-laodong-2019',
    type: 'Bộ luật',
    code: 'Bộ luật Lao động 45/2019/QH14',
    title: 'Bộ Luật Lao Động',
    issuingAgency: 'Quốc hội',
    issuedDate: '20/11/2019',
    effectiveDate: '01/01/2021',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về quyền và nghĩa vụ của người lao động, người sử dụng lao động, các tiêu chuẩn lao động, quản lý nhà nước về lao động.',
    chapters: [
      { title: 'Chương II: Việc Làm', articles: ['Điều 9: Việc làm, giải quyết việc làm'] },
      { title: 'Chương VI: Tiền Lương', articles: ['Điều 90: Tiền lương', 'Điều 97: Kỳ hạn trả lương'] },
    ],
    tags: ['lao động', 'việc làm', 'tiền lương', 'quyền lợi'],
    downloads: 198700,
  },
  {
    id: 'law-curu-2020',
    type: 'Luật',
    code: 'Luật Cư trú 68/2020/QH14',
    title: 'Luật Cư Trú',
    issuingAgency: 'Quốc hội',
    issuedDate: '13/11/2020',
    effectiveDate: '01/07/2021',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về quyền tự do cư trú, đăng ký và quản lý cư trú của công dân Việt Nam, thay thế hình thức quản lý bằng sổ hộ khẩu, sổ tạm trú.',
    chapters: [
      { title: 'Chương II: Đăng Ký Cư Trú', articles: ['Điều 5: Quyền và nghĩa vụ của công dân về cư trú'] },
    ],
    tags: ['cư trú', 'hộ khẩu', 'tạm trú', 'thường trú'],
    downloads: 245300,
  },
  {
    id: 'law-baohiem-2014',
    type: 'Luật',
    code: 'Luật Bảo hiểm xã hội 58/2014/QH13',
    title: 'Luật Bảo Hiểm Xã Hội',
    issuingAgency: 'Quốc hội',
    issuedDate: '20/11/2014',
    effectiveDate: '01/01/2016',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về chế độ, chính sách bảo hiểm xã hội đối với người lao động, bao gồm BHXH bắt buộc, BHXH tự nguyện, chế độ hưu trí, tử tuất.',
    chapters: [
      { title: 'Chương III: BHXH Bắt Buộc', articles: ['Điều 21: Đối tượng áp dụng', 'Điều 85: Mức đóng và phương thức đóng'] },
    ],
    tags: ['bảo hiểm', 'xã hội', 'hưu trí', 'người lao động'],
    downloads: 167200,
  },
  {
    id: 'law-xuphat-2012',
    type: 'Luật',
    code: 'Luật Xử lý vi phạm hành chính 15/2012/QH13',
    title: 'Luật Xử Lý Vi Phạm Hành Chính',
    issuingAgency: 'Quốc hội',
    issuedDate: '20/06/2012',
    effectiveDate: '01/07/2013',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về xử phạt vi phạm hành chính, các biện pháp xử lý hành chính và thủ tục áp dụng.',
    chapters: [
      { title: 'Phần 2: Xử Phạt Vi Phạm Hành Chính', articles: ['Điều 21: Các hình thức xử phạt', 'Điều 23: Mức phạt tiền'] },
    ],
    tags: ['xử phạt', 'hành chính', 'vi phạm'],
    downloads: 134500,
  },
  {
    id: 'law-bvmt-2020',
    type: 'Luật',
    code: 'Luật Bảo vệ Môi trường 72/2020/QH14',
    title: 'Luật Bảo Vệ Môi Trường',
    issuingAgency: 'Quốc hội',
    issuedDate: '17/11/2020',
    effectiveDate: '01/01/2022',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về hoạt động bảo vệ môi trường, quyền và trách nhiệm của cơ quan, tổ chức, hộ gia đình và cá nhân trong bảo vệ môi trường.',
    chapters: [
      { title: 'Chương II: Bảo Vệ Các Thành Phần Môi Trường', articles: ['Điều 8: Bảo vệ chất lượng không khí'] },
    ],
    tags: ['môi trường', 'bảo vệ', 'xanh', 'rác thải'],
    downloads: 98700,
  },
  {
    id: 'ld-gt-2008',
    type: 'Luật',
    code: 'Luật Giao thông đường bộ 23/2008/QH12',
    title: 'Luật Giao Thông Đường Bộ',
    issuingAgency: 'Quốc hội',
    issuedDate: '13/11/2008',
    effectiveDate: '01/07/2009',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về quy tắc giao thông đường bộ, phương tiện và người tham gia giao thông, vận tải đường bộ.',
    chapters: [
      { title: 'Chương II: Quy Tắc Giao Thông Đường Bộ', articles: ['Điều 8: Các hành vi bị nghiêm cấm', 'Điều 9: Quy tắc chung'] },
    ],
    tags: ['giao thông', 'đường bộ', 'an toàn', 'phương tiện'],
    downloads: 212400,
  },
  {
    id: 'ld-pccc-2001',
    type: 'Luật',
    code: 'Luật Phòng cháy chữa cháy 27/2001/QH10',
    title: 'Luật Phòng Cháy Và Chữa Cháy',
    issuingAgency: 'Quốc hội',
    issuedDate: '29/06/2001',
    effectiveDate: '01/10/2001',
    status: 'Đang hiệu lực',
    category: 'van-ban',
    summary: 'Quy định về phòng cháy, chữa cháy, trách nhiệm của cơ quan, tổ chức, hộ gia đình và cá nhân trong hoạt động PCCC.',
    chapters: [
      { title: 'Chương I: Những Quy Định Chung', articles: ['Điều 4: Trách nhiệm của mọi công dân'] },
    ],
    tags: ['PCCC', 'an toàn', 'cháy nổ', 'cứu hộ'],
    downloads: 187600,
  },
];

/* ─── MOCK API FUNCTIONS — Mô phỏng delay và response như backend thật ─── */

/** Giả lập độ trễ mạng */
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms + Math.random() * 200));

/**
 * Tìm kiếm luật — mô phỏng API endpoint:
 *   GET /api/library/search?q=...&category=...&page=...&limit=...
 *
 * @param {object} params
 * @param {string} params.query     - Từ khóa tìm kiếm
 * @param {string} [params.category] - Lọc theo danh mục
 * @param {number} [params.page]     - Trang hiện tại (mặc định 1)
 * @param {number} [params.limit]    - Số kết quả mỗi trang (mặc định 20)
 * @returns {Promise<{success: boolean, data: {items: Array, pagination: object}}>}
 */
export async function searchLaws({ query = '', category = '', page = 1, limit = 20 } = {}) {
  if (!MOCK_MODE) {
    // Khi có backend thật, gọi API qua apiClient:
    // const res = await apiClient.get('/api/library/search', { params: { q: query, category, page, limit } });
    // return res.data;
    throw new Error('Backend chưa được kết nối. Vui lòng đặt MOCK_MODE = false sau khi có API.');
  }

  await delay();

  const q = query.toLowerCase().trim();
  let results = [...MOCK_LAWS];

  // Lọc theo từ khóa
  if (q) {
    results = results.filter((law) => {
      return (
        law.title.toLowerCase().includes(q) ||
        law.code.toLowerCase().includes(q) ||
        law.summary.toLowerCase().includes(q) ||
        law.type.toLowerCase().includes(q) ||
        (law.tags && law.tags.some((t) => t.includes(q))) ||
        (law.issuingAgency && law.issuingAgency.toLowerCase().includes(q))
      );
    });
  }

  // Lọc theo danh mục
  if (category) {
    results = results.filter((law) => law.category === category);
  }

  // Phân trang
  const total = results.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const items = results.slice(start, start + limit);

  return {
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    },
  };
}

/**
 * Lấy chi tiết một văn bản luật:
 *   GET /api/library/laws/:id
 */
export async function getLawById(id) {
  if (!MOCK_MODE) {
    // const res = await apiClient.get(`/api/library/laws/${id}`);
    // return res.data;
    throw new Error('Backend chưa được kết nối.');
  }

  await delay(200);
  const law = MOCK_LAWS.find((l) => l.id === id);
  if (!law) return { success: false, message: 'Không tìm thấy văn bản.' };
  return { success: true, data: law };
}

/**
 * Lấy danh sách luật nổi bật (featured):
 *   GET /api/library/laws/featured
 */
export async function getFeaturedLaws() {
  if (!MOCK_MODE) {
    // const res = await apiClient.get('/api/library/laws/featured');
    // return res.data;
    throw new Error('Backend chưa được kết nối.');
  }

  await delay(250);
  const featured = MOCK_LAWS.filter((l) => l.downloads > 200000).slice(0, 6);
  return { success: true, data: featured };
}

/**
 * Lấy thống kê thư viện
 */
export async function getLibraryStats() {
  if (!MOCK_MODE) {
    // const res = await apiClient.get('/api/library/stats');
    // return res.data;
    throw new Error('Backend chưa được kết nối.');
  }

  await delay(150);
  return {
    success: true,
    data: {
      totalLaws: MOCK_LAWS.length,
      totalCategories: 1,
      totalDownloads: MOCK_LAWS.reduce((s, l) => s + l.downloads, 0),
      categories: ['Hiến pháp', 'Bộ luật', 'Luật'],
    },
  };
}

const libraryService = { searchLaws, getLawById, getFeaturedLaws, getLibraryStats };

/**
 * Lấy danh sách tài liệu công khai (Văn hóa & Pháp luật)
 */
export async function getTaiLieuCongKhai(params = {}) {
  try {
    const res = await apiClient.get('/api/tai-lieu-cong-khai/paging', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching tai-lieu-cong-khai:', error);
    return { success: false, data: [], pagination: {} };
  }
}

/**
 * Lấy chi tiết tài liệu công khai
 */
export async function getChiTietTaiLieuCongKhai(id) {
  try {
    const res = await apiClient.get(`/api/tai-lieu-cong-khai/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching tai-lieu-cong-khai detail ${id}:`, error);
    return { success: false, data: null };
  }
}

export default libraryService;
