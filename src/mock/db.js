// ============================================================
// MOCK DATABASE — SOS_TNP V2
// 9 bảng dữ liệu giả cho prototype Dashboard & Phản ánh
// ============================================================

// ---------- helpers ----------
const now = new Date();
const d = (offsetDays, hour = 9, min = 0) => {
  const date = new Date(now);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hour, min, 0, 0);
  return date.toISOString();
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ============================================================
// 1. USERS
// ============================================================
export const users = [
  { id: "USR-001", fullName: "Nguyễn Văn An",    phone: "0901234567", email: "an.nguyen@example.com",     role: "CITIZEN",              departmentId: null,         status: "ACTIVE", avatarUrl: "/mock/avatars/01.png" },
  { id: "USR-002", fullName: "Trần Thị Bình",     phone: "0901234568", email: "binh.tran@example.com",    role: "CITIZEN",              departmentId: null,         status: "ACTIVE", avatarUrl: "/mock/avatars/02.png" },
  { id: "USR-003", fullName: "Lê Văn Cường",      phone: "0901234569", email: "cuong.le@example.com",     role: "CITIZEN",              departmentId: null,         status: "ACTIVE", avatarUrl: "/mock/avatars/03.png" },
  { id: "USR-004", fullName: "Phạm Thị Dung",      phone: "0901234570", email: "dung.pham@example.com",    role: "CITIZEN",              departmentId: null,         status: "ACTIVE", avatarUrl: "/mock/avatars/04.png" },
  { id: "USR-005", fullName: "Hoàng Văn Em",       phone: "0901234571", email: "em.hoang@example.com",     role: "CITIZEN",              departmentId: null,         status: "ACTIVE", avatarUrl: "/mock/avatars/05.png" },
  { id: "USR-010", fullName: "Vũ Thị Hoa",         phone: "0987654321", email: "hoa.vu@ubnd.gov.vn",       role: "RECEPTION_OFFICER",    departmentId: "DEP-RECEPTION", status: "ACTIVE", avatarUrl: "/mock/avatars/10.png" },
  { id: "USR-011", fullName: "Mai Văn Khánh",      phone: "0987654322", email: "khanh.mai@ubnd.gov.vn",    role: "RECEPTION_OFFICER",    departmentId: "DEP-RECEPTION", status: "ACTIVE", avatarUrl: "/mock/avatars/11.png" },
  { id: "USR-020", fullName: "Đặng Minh Luân",     phone: "0987654330", email: "luan.dang@ubnd.gov.vn",    role: "PROCESSING_OFFICER",   departmentId: "DEP-URBAN",   status: "ACTIVE", avatarUrl: "/mock/avatars/20.png" },
  { id: "USR-021", fullName: "Bùi Thanh Mai",      phone: "0987654331", email: "mai.bui@ubnd.gov.vn",      role: "PROCESSING_OFFICER",   departmentId: "DEP-URBAN",   status: "ACTIVE", avatarUrl: "/mock/avatars/21.png" },
  { id: "USR-022", fullName: "Ngô Quốc Nam",       phone: "0987654332", email: "nam.ngo@ubnd.gov.vn",      role: "PROCESSING_OFFICER",   departmentId: "DEP-ENV",     status: "ACTIVE", avatarUrl: "/mock/avatars/22.png" },
  { id: "USR-023", fullName: "Lý Thị Oanh",        phone: "0987654333", email: "oanh.ly@ubnd.gov.vn",      role: "PROCESSING_OFFICER",   departmentId: "DEP-ENV",     status: "ACTIVE", avatarUrl: "/mock/avatars/23.png" },
  { id: "USR-024", fullName: "Trịnh Văn Phong",    phone: "0987654334", email: "phong.trinh@ubnd.gov.vn",  role: "PROCESSING_OFFICER",   departmentId: "DEP-INFRA",   status: "ACTIVE", avatarUrl: "/mock/avatars/24.png" },
  { id: "USR-025", fullName: "Hồ Thị Quyên",       phone: "0987654335", email: "quyen.ho@ubnd.gov.vn",     role: "PROCESSING_OFFICER",   departmentId: "DEP-INFRA",   status: "ACTIVE", avatarUrl: "/mock/avatars/25.png" },
  { id: "USR-030", fullName: "Đỗ Văn Sơn",         phone: "0987654340", email: "son.do@ubnd.gov.vn",       role: "APPROVER",             departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/30.png" },
  { id: "USR-031", fullName: "Phan Thị Thảo",      phone: "0987654341", email: "thao.phan@ubnd.gov.vn",    role: "LEADER",               departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/31.png" },
  { id: "USR-032", fullName: "Võ Minh Tuấn",       phone: "0987654342", email: "tuan.vo@ubnd.gov.vn",      role: "ADMIN",                departmentId: "DEP-LEADERSHIP", status: "ACTIVE", avatarUrl: "/mock/avatars/32.png" },
];

// ============================================================
// 2. NEIGHBORHOODS (Khu phố — 12 mẫu demo, đủ 45 thật cần xác nhận)
// ============================================================
export const neighborhoods = [
  { id: "KP-01", code: "KP01", name: "Khu phố 1",  centerLatitude: 10.8451, centerLongitude: 106.7894, status: "ACTIVE" },
  { id: "KP-02", code: "KP02", name: "Khu phố 2",  centerLatitude: 10.8460, centerLongitude: 106.7901, status: "ACTIVE" },
  { id: "KP-03", code: "KP03", name: "Khu phố 3",  centerLatitude: 10.8442, centerLongitude: 106.7885, status: "ACTIVE" },
  { id: "KP-04", code: "KP04", name: "Khu phố 4",  centerLatitude: 10.8470, centerLongitude: 106.7910, status: "ACTIVE" },
  { id: "KP-05", code: "KP05", name: "Khu phố 5",  centerLatitude: 10.8438, centerLongitude: 106.7878, status: "ACTIVE" },
  { id: "KP-06", code: "KP06", name: "Khu phố 6",  centerLatitude: 10.8465, centerLongitude: 106.7920, status: "ACTIVE" },
  { id: "KP-07", code: "KP07", name: "Khu phố 7",  centerLatitude: 10.8425, centerLongitude: 106.7865, status: "ACTIVE" },
  { id: "KP-08", code: "KP08", name: "Khu phố 8",  centerLatitude: 10.8480, centerLongitude: 106.7930, status: "ACTIVE" },
  { id: "KP-09", code: "KP09", name: "Khu phố 9",  centerLatitude: 10.8415, centerLongitude: 106.7855, status: "ACTIVE" },
  { id: "KP-10", code: "KP10", name: "Khu phố 10", centerLatitude: 10.8490, centerLongitude: 106.7940, status: "ACTIVE" },
  { id: "KP-11", code: "KP11", name: "Khu phố 11", centerLatitude: 10.8405, centerLongitude: 106.7840, status: "ACTIVE" },
  { id: "KP-12", code: "KP12", name: "Khu phố 12", centerLatitude: 10.8500, centerLongitude: 106.7950, status: "INACTIVE" },
];

// ============================================================
// 3. COMPLAINT CATEGORIES
// ============================================================
export const categories = [
  { id: "CAT-INFRA",  code: "INFRASTRUCTURE",  name: "Hạ tầng giao thông",      description: "Đường sá, cầu cống, vỉa hè",               defaultPriority: "NORMAL", defaultSlaHours: 120, status: "ACTIVE" },
  { id: "CAT-ENV",    code: "ENVIRONMENT",     name: "Môi trường",              description: "Rác thải, nước thải, ô nhiễm",             defaultPriority: "NORMAL", defaultSlaHours: 120, status: "ACTIVE" },
  { id: "CAT-URBAN",  code: "URBAN_ORDER",     name: "Trật tự đô thị",          description: "Lấn chiếm, buôn bán sai quy định",         defaultPriority: "NORMAL", defaultSlaHours: 72,  status: "ACTIVE" },
  { id: "CAT-SEC",    code: "SECURITY",        name: "An ninh trật tự",         description: "Trộm cắp, gây rối, an ninh khu dân cư",    defaultPriority: "URGENT",  defaultSlaHours: 24,  status: "ACTIVE" },
  { id: "CAT-ELEC",   code: "ELECTRIC_WATER",  name: "Điện, nước, chiếu sáng", description: "Mất điện, mất nước, đèn đường",             defaultPriority: "URGENT",  defaultSlaHours: 48,  status: "ACTIVE" },
  { id: "CAT-CONST",  code: "CONSTRUCTION",    name: "Xây dựng",               description: "Xây dựng trái phép, sai phép",              defaultPriority: "NORMAL", defaultSlaHours: 120, status: "ACTIVE" },
  { id: "CAT-SAN",    code: "SANITATION",      name: "Vệ sinh công cộng",       description: "Vệ sinh đường phố, công viên, kênh rạch",  defaultPriority: "NORMAL", defaultSlaHours: 72,  status: "ACTIVE" },
  { id: "CAT-OTHER",  code: "OTHER",           name: "Khác",                   description: "Các vấn đề khác",                          defaultPriority: "NORMAL", defaultSlaHours: 120, status: "ACTIVE" },
];

// ============================================================
// 4. DEPARTMENTS
// ============================================================
export const departments = [
  { id: "DEP-RECEPTION",  code: "RECEPTION",        name: "Bộ phận Tiếp nhận",         description: "Tiếp nhận và phân loại phản ánh",              status: "ACTIVE" },
  { id: "DEP-URBAN",      code: "URBAN_MANAGEMENT", name: "Bộ phận Đô thị",            description: "Hạ tầng, xây dựng và trật tự đô thị",          status: "ACTIVE" },
  { id: "DEP-ENV",        code: "ENVIRONMENT",      name: "Bộ phận Môi trường",        description: "Vệ sinh môi trường, cây xanh, kênh rạch",      status: "ACTIVE" },
  { id: "DEP-INFRA",      code: "INFRASTRUCTURE",   name: "Bộ phận Hạ tầng",           description: "Điện, nước, chiếu sáng công cộng",             status: "ACTIVE" },
  { id: "DEP-LEADERSHIP", code: "LEADERSHIP",       name: "Ban Lãnh đạo",              description: "Phê duyệt và chỉ đạo",                         status: "ACTIVE" },
];

// ============================================================
// 5. COMPLAINTS (55 items covering all statuses)
// ============================================================

// Helper to build a complaint
let cid = 0;
const C = (overrides = {}) => {
  cid++;
  const id = `CMP-${String(cid).padStart(4,'0')}`;
  const cat = overrides.categoryId ? categories.find(c => c.id === overrides.categoryId) : pick(categories);
  const kp  = overrides.neighborhoodId ? neighborhoods.find(n => n.id === overrides.neighborhoodId) : pick(neighborhoods.filter(n => n.status === 'ACTIVE'));
  const urgency = overrides.confirmedUrgency || overrides.citizenUrgency || cat.defaultPriority;
  const slaHours = urgency === 'URGENT' ? 24 : pick([72, 96, 120]);
  const createdAt = overrides.createdAt || d(pick([-30,-25,-20,-15,-10,-7,-5,-3,-2,-1,0]), pick([7,8,9,10,14,15,16,19,20]), pick([0,15,30,45]));
  const receivedAt = overrides.receivedAt || (overrides.status && overrides.status !== 'NEW' && overrides.status !== 'PENDING_RECEPTION' ? d(0, 10, 5) : null);
  const status = overrides.status || 'NEW';
  const originalDeadline = receivedAt ? new Date(new Date(receivedAt).getTime() + slaHours * 3600000).toISOString() : null;

  return {
    id,
    code: `PA-${new Date(createdAt).getFullYear()}${String(new Date(createdAt).getMonth()+1).padStart(2,'0')}${String(new Date(createdAt).getDate()).padStart(2,'0')}-${String(cid).padStart(4,'0')}`,
    citizenId: pick(users.filter(u => u.role === 'CITIZEN')).id,
    title: overrides.title || "Phản ánh mẫu",
    description: overrides.description || "Mô tả chi tiết phản ánh",
    categoryId: cat.id,
    citizenUrgency: urgency,
    confirmedUrgency: overrides.confirmedUrgency || (status === 'NEW' || status === 'PENDING_RECEPTION' ? null : urgency),
    neighborhoodId: kp.id,
    address: overrides.address || `Đường số ${pick([1,2,3,5,6,7,8,10,11,12,15,18])}, ${kp.name}`,
    latitude: kp.centerLatitude + (Math.random() - 0.5) * 0.01,
    longitude: kp.centerLongitude + (Math.random() - 0.5) * 0.01,
    status,
    slaType: urgency === 'URGENT' ? 'URGENT_24_HOURS' : `NORMAL_${slaHours}_HOURS`,
    slaHours,
    receivedAt,
    originalDeadline,
    currentDeadline: overrides.currentDeadline || originalDeadline,
    completedAt: overrides.completedAt || null,
    slaStatus: overrides.slaStatus || computeSlaStatus(status, originalDeadline, overrides.completedAt),
    assignedDepartmentId: overrides.assignedDepartmentId || null,
    assignedOfficerId: overrides.assignedOfficerId || null,
    extensionCount: overrides.extensionCount || 0,
    progressPercent: overrides.progressPercent || (status === 'COMPLETED' ? 100 : status === 'IN_PROGRESS' ? pick([25,50,75]) : 0),
    createdAt,
    updatedAt: overrides.updatedAt || createdAt,
    hasImages: overrides.hasImages ?? (Math.random() > 0.3),
    hasLocation: overrides.hasLocation ?? (Math.random() > 0.2),
  };
};

function computeSlaStatus(status, deadline, completedAt) {
  if (status === 'COMPLETED' && completedAt && deadline) {
    return new Date(completedAt) <= new Date(deadline) ? 'COMPLETED_ON_TIME' : 'COMPLETED_LATE';
  }
  if (!deadline || status === 'NEW' || status === 'PENDING_RECEPTION' || status === 'REJECTED') return 'NOT_APPLICABLE';
  const dl = new Date(deadline);
  const nowDate = new Date();
  if (nowDate > dl) return 'OVERDUE';
  const hoursLeft = (dl - nowDate) / 3600000;
  if (hoursLeft < 6) return 'NEAR_DUE';
  if (hoursLeft < 24) return 'NEAR_DUE';
  return 'ON_TIME';
}

const TITLES = {
  NEW: [
    { t: "Đèn đường không hoạt động tại đường số 12", cat: "CAT-ELEC",   urg: "URGENT",  kp: "KP-05", desc: "Ba trụ đèn liên tiếp không hoạt động từ nhiều ngày nay, gây mất an toàn giao thông vào ban đêm." },
    { t: "Ngập nước tại hẻm 123 đường Tăng Nhơn Phú", cat: "CAT-INFRA", urg: "URGENT",  kp: "KP-03", desc: "Mỗi khi mưa lớn, nước ngập sâu khoảng 30-40cm, không thoát được." },
    { t: "Rác thải tồn đọng trước số nhà 45",        cat: "CAT-ENV",   urg: "NORMAL", kp: "KP-01", desc: "Rác thải sinh hoạt không được thu gom đúng lịch, tồn đọng 3-4 ngày gây mùi hôi." },
    { t: "Quán nhậu gây ồn ào sau 22h",              cat: "CAT-SEC",   urg: "URGENT",  kp: "KP-07", desc: "Quán nhậu vỉa hè mở nhạc lớn, khách ồn ào đến 2h sáng, ảnh hưởng dân cư." },
    { t: "Xây dựng không phép tại hẻm 67",            cat: "CAT-CONST", urg: "NORMAL", kp: "KP-02", desc: "Công trình xây dựng 3 tầng không có bảng hiệu công trình, nghi ngờ không phép." },
    { t: "Vỉa hè bị lấn chiếm buôn bán",              cat: "CAT-URBAN", urg: "NORMAL", kp: "KP-04", desc: "Vỉa hè đường số 8 bị chiếm dụng làm nơi buôn bán, người đi bộ phải đi xuống lòng đường." },
  ],
  IN_PROGRESS: [
    { t: "Ống nước bể gây thất thoát nước sạch",      cat: "CAT-ELEC", urg: "URGENT", kp: "KP-09", desc: "Ống nước chính tại ngã tư bị bể, nước chảy tràn ra đường gây lãng phí." },
    { t: "Cây xanh gãy đổ sau mưa bão",               cat: "CAT-ENV",  urg: "URGENT", kp: "KP-06", desc: "Cây lớn bị gãy ngang thân, chắn ngang đường, cần xử lý khẩn cấp." },
    { t: "Kênh thoát nước bị tắc nghẽn",               cat: "CAT-ENV",  urg: "NORMAL", kp: "KP-08", desc: "Kênh thoát nước khu vực chợ bị rác và bèo lấp đầy, nước không lưu thông." },
    { t: "Đường bị hư hỏng nặng sau thi công",         cat: "CAT-INFRA", urg: "NORMAL", kp: "KP-10", desc: "Mặt đường bị đào lên để thi công cáp, sau đó lấp tạm gây lún sụt." },
    { t: "Tiếng ồn từ công trường xây dựng",           cat: "CAT-CONST", urg: "NORMAL", kp: "KP-11", desc: "Công trường hoạt động từ 5h sáng, gây ồn ào ảnh hưởng khu dân cư." },
    { t: "Điện chập chờn liên tục trong khu dân cư",   cat: "CAT-ELEC", urg: "URGENT", kp: "KP-03", desc: "Điện áp không ổn định, thường xuyên bị sụt giảm gây hư hỏng thiết bị." },
  ],
  EXTENSION_PENDING: [
    { t: "Hệ thống thoát nước xuống cấp nghiêm trọng", cat: "CAT-INFRA", urg: "NORMAL", kp: "KP-02", desc: "Toàn bộ hệ thống cống thoát nước khu vực bị sụt lún, cần khảo sát tổng thể." },
    { t: "Ô nhiễm không khí từ cơ sở sản xuất",        cat: "CAT-ENV",  urg: "URGENT", kp: "KP-07", desc: "Cơ sở sản xuất nhựa xả khói đen, mùi hôi nồng nặc vào giờ tan tầm." },
    { t: "Sụt lún nền đường nghi ngờ do hầm ngầm",    cat: "CAT-INFRA", urg: "URGENT", kp: "KP-05", desc: "Xuất hiện vết nứt và sụt lún kéo dài 20m, nghi có hố ngầm bên dưới." },
    { t: "Lấn chiếm lòng lề đường khu vực chợ",        cat: "CAT-URBAN", urg: "NORMAL", kp: "KP-04", desc: "Tình trạng lấn chiếm kéo dài, cần phối hợp nhiều đơn vị để giải tỏa." },
  ],
  EXTENDED: [
    { t: "Cống thoát nước quá tải mùa mưa",            cat: "CAT-INFRA", urg: "NORMAL", kp: "KP-01", desc: "Cống thoát nước chính bị quá tải, cần nâng cấp toàn bộ tuyến." },
    { t: "Nước sinh hoạt nhiễm phèn",                  cat: "CAT-ELEC",  urg: "URGENT",  kp: "KP-08", desc: "Nước máy có màu vàng đục, mùi tanh, ảnh hưởng sức khỏe người dân." },
    { t: "Bãi rác tự phát tại khu đất trống",           cat: "CAT-ENV",   urg: "NORMAL", kp: "KP-12", desc: "Khu đất trống bị biến thành bãi rác, cần giải tỏa và rào chắn." },
    { t: "Xe tải nặng chạy vào đường dân sinh",         cat: "CAT-INFRA",  urg: "NORMAL", kp: "KP-09", desc: "Xe tải trọng lượng lớn né trạm thu phí đi vào đường nhỏ gây hư hỏng." },
    { t: "Cột điện nghiêng nguy hiểm sau va chạm",      cat: "CAT-ELEC",   urg: "URGENT",  kp: "KP-06", desc: "Cột điện bị xe tải va vào, nghiêng 30 độ, nguy cơ đổ sập." },
  ],
};

function makeComplaints() {
  const list = [];

  // 6 NEW
  TITLES.NEW.forEach((x, i) => list.push(C({ title: x.t, description: x.desc, categoryId: x.cat, citizenUrgency: x.urg, neighborhoodId: x.kp, status: "NEW", createdAt: d(-1 * (i+1), pick([8,9,10,14,15]), pick([0,15,30])), receivedAt: null })));

  // 5 PENDING_RECEPTION
  for (let i = 0; i < 5; i++) list.push(C({ status: "PENDING_RECEPTION", createdAt: d(-1 * (i+1), pick([7,8,9]), pick([0,30])) }));

  // 5 RECEIVED
  for (let i = 0; i < 5; i++) list.push(C({ status: "RECEIVED", createdAt: d(-2-i, 8, 15), receivedAt: d(-1-i, 10, 0) }));

  // 5 ASSIGNED
  for (let i = 0; i < 5; i++) {
    const dept = pick(departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP'));
    const officer = pick(users.filter(u => u.departmentId === dept.id));
    list.push(C({ status: "ASSIGNED", createdAt: d(-3-i, 8, 0), receivedAt: d(-2-i, 9, 30), assignedDepartmentId: dept.id, assignedOfficerId: officer.id }));
  }

  // 12 IN_PROGRESS
  TITLES.IN_PROGRESS.forEach((x, i) => {
    const dept = pick(departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP'));
    const officer = pick(users.filter(u => u.departmentId === dept.id));
    const created = d(-5-i, 8, 0);
    const received = d(-4-i, 10, 30);
    list.push(C({
      title: x.t, description: x.desc, categoryId: x.cat, citizenUrgency: x.urg, confirmedUrgency: x.urg,
      neighborhoodId: x.kp, status: "IN_PROGRESS", createdAt: created, receivedAt: received,
      assignedDepartmentId: dept.id, assignedOfficerId: officer.id,
      progressPercent: pick([25, 50, 75]),
    }));
  });

  // 4 EXTENSION_PENDING
  TITLES.EXTENSION_PENDING.forEach((x, i) => {
    const dept = pick(departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP'));
    const officer = pick(users.filter(u => u.departmentId === dept.id));
    const created = d(-8-i, 7, 0);
    const received = d(-7-i, 9, 0);
    list.push(C({
      title: x.t, description: x.desc, categoryId: x.cat, citizenUrgency: x.urg, confirmedUrgency: x.urg,
      neighborhoodId: x.kp, status: "EXTENSION_PENDING", createdAt: created, receivedAt: received,
      assignedDepartmentId: dept.id, assignedOfficerId: officer.id,
      extensionCount: 1, slaStatus: "PENDING_EXTENSION",
    }));
  });

  // 5 EXTENDED (đã gia hạn + đang xử lý)
  TITLES.EXTENDED.forEach((x, i) => {
    const dept = pick(departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP'));
    const officer = pick(users.filter(u => u.departmentId === dept.id));
    const created = d(-12-i, 7, 0);
    const received = d(-11-i, 9, 0);
    const newDeadline = d(2-i, 17, 0);
    list.push(C({
      title: x.t, description: x.desc, categoryId: x.cat, citizenUrgency: x.urg, confirmedUrgency: x.urg,
      neighborhoodId: x.kp, status: "IN_PROGRESS", createdAt: created, receivedAt: received,
      assignedDepartmentId: dept.id, assignedOfficerId: officer.id,
      extensionCount: pick([1, 2]), currentDeadline: newDeadline,
      progressPercent: pick([50, 75]),
    }));
  });

  // 12 COMPLETED_ON_TIME
  for (let i = 0; i < 12; i++) {
    const created = d(-15-i, pick([7,8,9]), 0);
    const received = d(-14-i, pick([9,10]), 0);
    const completed = d(-8-i, pick([14,15,16]), 0);
    list.push(C({ status: "COMPLETED", createdAt: created, receivedAt: received, completedAt: completed, slaStatus: "COMPLETED_ON_TIME", progressPercent: 100 }));
  }

  // 6 COMPLETED_LATE
  for (let i = 0; i < 6; i++) {
    const created = d(-20-i, pick([7,8]), 0);
    const received = d(-19-i, pick([9,10]), 0);
    const origDeadline = new Date(new Date(received).getTime() + pick([24, 48, 72]) * 3600000).toISOString();
    const completed = new Date(new Date(origDeadline).getTime() + pick([1,2,3]) * 86400000).toISOString();
    list.push(C({ status: "COMPLETED", createdAt: created, receivedAt: received, originalDeadline: origDeadline, currentDeadline: origDeadline, completedAt: completed, slaStatus: "COMPLETED_LATE", progressPercent: 100 }));
  }

  // 3 REJECTED
  for (let i = 0; i < 3; i++) {
    list.push(C({ status: "REJECTED", createdAt: d(-3-i, pick([8,10,14]), 0), receivedAt: d(-2-i, 9, 0), completedAt: d(-1-i, 11, 0), slaStatus: "NOT_APPLICABLE" }));
  }

  return list;
}

export const complaints = makeComplaints();
export const totalComplaints = complaints.length;

// ============================================================
// 6. ATTACHMENTS
// ============================================================
let aid = 0;
export const attachments = [];
complaints.forEach(c => {
  if (c.hasImages) {
    for (let i = 0; i < pick([1, 1, 1, 2, 2, 3]); i++) {
      aid++;
      attachments.push({
        id: `ATT-${String(aid).padStart(4,'0')}`,
        complaintId: c.id,
        fileName: `hinh-anh-${aid}.jpg`,
        fileType: "image/jpeg",
        fileSize: pick([512000, 1024000, 2048000, 450000, 890000]),
        fileUrl: `/mock/images/sample-${pick([1,2,3,4,5])}.jpg`,
        attachmentType: "CITIZEN_EVIDENCE",
        uploadedBy: c.citizenId,
        createdAt: c.createdAt,
      });
    }
  }
});

// ============================================================
// 7. ASSIGNMENTS
// ============================================================
let asnId = 0;
export const assignments = [];
complaints.forEach(c => {
  if (c.assignedDepartmentId && c.assignedOfficerId) {
    asnId++;
    assignments.push({
      id: `ASN-${String(asnId).padStart(4,'0')}`,
      complaintId: c.id,
      departmentId: c.assignedDepartmentId,
      primaryOfficerId: c.assignedOfficerId,
      supportOfficerIds: Math.random() > 0.6 ? [pick(users.filter(u => u.departmentId === c.assignedDepartmentId && u.id !== c.assignedOfficerId))?.id].filter(Boolean) : [],
      assignedBy: pick(users.filter(u => u.role === 'RECEPTION_OFFICER')).id,
      assignedAt: c.receivedAt ? new Date(new Date(c.receivedAt).getTime() + 3600000).toISOString() : c.createdAt,
      assignmentNote: "Phân công xử lý phản ánh",
      status: "ACTIVE",
    });
  }
});

// ============================================================
// 8. EXTENSIONS
// ============================================================
let extId = 0;
export const extensions = [];

// Tạo extension cho EXTENSION_PENDING complaints
complaints.filter(c => c.status === 'EXTENSION_PENDING').forEach(c => {
  extId++;
  const oldDeadline = c.originalDeadline;
  const newDeadline = new Date(new Date(oldDeadline).getTime() + pick([1,2,3]) * 86400000).toISOString();
  extensions.push({
    id: `EXT-${String(extId).padStart(4,'0')}`,
    complaintId: c.id,
    requestedBy: c.assignedOfficerId,
    requestedAt: new Date(new Date().getTime() - pick([1,2]) * 86400000).toISOString(),
    oldDeadline,
    requestedDeadline: newDeadline,
    approvedDeadline: null,
    reasonType: pick(["WAITING_FOR_COORDINATION", "WAITING_FOR_SURVEY", "COMPLEX_CASE", "WAITING_FOR_SUPPLIES", "WEATHER_CONDITIONS", "OTHER"]),
    reason: pick(["Cần phối hợp với đơn vị liên quan", "Đang chờ khảo sát hiện trường", "Vụ việc phức tạp cần thêm thời gian xác minh", "Chờ vật tư thay thế", "Điều kiện thời tiết không cho phép thi công"]),
    processingPlan: "Sẽ hoàn thành ngay khi có đủ điều kiện",
    status: "PENDING",
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
  });
});

// Tạo extension cho EXTENDED complaints
complaints.filter(c => c.extensionCount > 0 && c.status === 'IN_PROGRESS').forEach(c => {
  for (let i = 0; i < c.extensionCount; i++) {
    extId++;
    extensions.push({
      id: `EXT-${String(extId).padStart(4,'0')}`,
      complaintId: c.id,
      requestedBy: c.assignedOfficerId,
      requestedAt: new Date(new Date().getTime() - pick([5,7,10]) * 86400000).toISOString(),
      oldDeadline: c.originalDeadline,
      requestedDeadline: c.currentDeadline,
      approvedDeadline: c.currentDeadline,
      reasonType: pick(["WAITING_FOR_COORDINATION", "COMPLEX_CASE", "WAITING_FOR_SUPPLIES"]),
      reason: pick(["Đã được phê duyệt gia hạn do cần thêm thời gian phối hợp nhiều bên", "Vụ việc phức tạp, đã được lãnh đạo đồng ý gia hạn"]),
      processingPlan: "Đã hoàn thành các bước cần thiết",
      status: "APPROVED",
      reviewedBy: pick(users.filter(u => u.role === 'APPROVER' || u.role === 'LEADER')).id,
      reviewedAt: new Date(new Date().getTime() - pick([3,5,8]) * 86400000).toISOString(),
      reviewNote: "Đồng ý gia hạn, yêu cầu hoàn thành đúng hạn mới",
    });
  }
});

// Thêm 1 vài extension bị từ chối
for (let i = 0; i < 2; i++) {
  extId++;
  const c = complaints.find(x => x.status === 'IN_PROGRESS' && x.extensionCount === 0 && !extensions.some(e => e.complaintId === x.id));
  if (c) {
    extensions.push({
      id: `EXT-${String(extId).padStart(4,'0')}`,
      complaintId: c.id,
      requestedBy: c.assignedOfficerId,
      requestedAt: new Date(new Date().getTime() - 3 * 86400000).toISOString(),
      oldDeadline: c.originalDeadline,
      requestedDeadline: new Date(new Date(c.originalDeadline).getTime() + 2 * 86400000).toISOString(),
      approvedDeadline: null,
      reasonType: "OTHER",
      reason: "Đề nghị gia hạn do thiếu nhân lực",
      processingPlan: null,
      status: "REJECTED",
      reviewedBy: pick(users.filter(u => u.role === 'APPROVER' || u.role === 'LEADER')).id,
      reviewedAt: new Date(new Date().getTime() - 2 * 86400000).toISOString(),
      reviewNote: "Không chấp nhận gia hạn, yêu cầu tăng cường nhân lực xử lý ngay",
    });
  }
}

// ============================================================
// 9. HISTORY
// ============================================================
let hisId = 0;
export const history = [];

complaints.forEach(c => {
  // CREATED
  hisId++;
  history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "COMPLAINT_CREATED", performedBy: c.citizenId, performedRole: "CITIZEN", performedAt: c.createdAt, oldValue: null, newValue: { title: c.title }, internalNote: null, publicNote: "Người dân đã gửi phản ánh.", isPublic: true });

  // RECEIVED
  if (c.receivedAt) {
    const receiver = pick(users.filter(u => u.role === 'RECEPTION_OFFICER'));
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "COMPLAINT_RECEIVED", performedBy: receiver.id, performedRole: receiver.role, performedAt: c.receivedAt, oldValue: { status: "NEW" }, newValue: { status: "RECEIVED", urgency: c.confirmedUrgency, deadline: c.originalDeadline }, internalNote: "Đã kiểm tra và tiếp nhận phản ánh", publicNote: "Phản ánh đã được tiếp nhận.", isPublic: true });
  }

  // ASSIGNED
  const assign = assignments.find(a => a.complaintId === c.id);
  if (assign) {
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "ASSIGNED", performedBy: assign.assignedBy, performedRole: "RECEPTION_OFFICER", performedAt: assign.assignedAt, oldValue: { status: "RECEIVED" }, newValue: { status: "ASSIGNED", departmentId: assign.departmentId, officerId: assign.primaryOfficerId }, internalNote: assign.assignmentNote, publicNote: "Phản ánh đã được chuyển đến đơn vị xử lý.", isPublic: true });
  }

  // STATUS_CHANGED to IN_PROGRESS (for those in progress)
  if (c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING' || c.status === 'COMPLETED') {
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "STATUS_CHANGED", performedBy: c.assignedOfficerId || "USR-020", performedRole: "PROCESSING_OFFICER", performedAt: c.receivedAt ? new Date(new Date(c.receivedAt).getTime() + 7200000).toISOString() : c.createdAt, oldValue: { status: "ASSIGNED" }, newValue: { status: "IN_PROGRESS" }, internalNote: "Đã tiếp nhận và đang xử lý", publicNote: "Đơn vị phụ trách đang tiến hành xử lý.", isPublic: true });
  }

  // EXTENSION entries
  const complaintExtensions = extensions.filter(e => e.complaintId === c.id);
  complaintExtensions.forEach(ext => {
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "EXTENSION_REQUESTED", performedBy: ext.requestedBy, performedRole: "PROCESSING_OFFICER", performedAt: ext.requestedAt, oldValue: { currentDeadline: ext.oldDeadline }, newValue: { requestedDeadline: ext.requestedDeadline }, internalNote: ext.reason, publicNote: null, isPublic: false });
    if (ext.status === 'APPROVED') {
      hisId++;
      history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "EXTENSION_APPROVED", performedBy: ext.reviewedBy, performedRole: "APPROVER", performedAt: ext.reviewedAt, oldValue: { currentDeadline: ext.oldDeadline }, newValue: { currentDeadline: ext.approvedDeadline }, internalNote: ext.reviewNote, publicNote: "Thời hạn xử lý đã được gia hạn.", isPublic: true });
    } else if (ext.status === 'REJECTED') {
      hisId++;
      history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "EXTENSION_REJECTED", performedBy: ext.reviewedBy, performedRole: "APPROVER", performedAt: ext.reviewedAt, oldValue: { requestedDeadline: ext.requestedDeadline }, newValue: { currentDeadline: ext.oldDeadline }, internalNote: ext.reviewNote, publicNote: null, isPublic: false });
    }
  });

  // COMPLETED
  if (c.status === 'COMPLETED' && c.completedAt) {
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "COMPLETED", performedBy: c.assignedOfficerId || "USR-020", performedRole: "PROCESSING_OFFICER", performedAt: c.completedAt, oldValue: { status: "IN_PROGRESS" }, newValue: { status: "COMPLETED", slaResult: c.slaStatus }, internalNote: "Đã hoàn thành xử lý", publicNote: "Phản ánh đã được xử lý và hoàn thành.", isPublic: true });
  }

  // REJECTED
  if (c.status === 'REJECTED') {
    const rejecter = pick(users.filter(u => u.role === 'RECEPTION_OFFICER'));
    hisId++;
    history.push({ id: `HIS-${String(hisId).padStart(4,'0')}`, complaintId: c.id, actionType: "REJECTED", performedBy: rejecter.id, performedRole: rejecter.role, performedAt: c.completedAt || c.receivedAt, oldValue: { status: "PENDING_RECEPTION" }, newValue: { status: "REJECTED" }, internalNote: "Phản ánh không đủ thông tin hoặc trùng lặp", publicNote: "Phản ánh không được tiếp nhận do thiếu thông tin.", isPublic: true });
  }
});

// ============================================================
// HELPERS
// ============================================================
export function getUserById(id) { return users.find(u => u.id === id); }
export function getNeighborhoodById(id) { return neighborhoods.find(n => n.id === id); }
export function getCategoryById(id) { return categories.find(c => c.id === id); }
export function getDepartmentById(id) { return departments.find(d => d.id === id); }
export function getComplaintById(id) { return complaints.find(c => c.id === id); }
export function getComplaintsByCitizen(citizenId) { return complaints.filter(c => c.citizenId === citizenId); }
export function getHistoryByComplaint(complaintId) { return history.filter(h => h.complaintId === complaintId).sort((a,b) => new Date(b.performedAt) - new Date(a.performedAt)); }
export function getExtensionsByComplaint(complaintId) { return extensions.filter(e => e.complaintId === complaintId).sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt)); }
export function getAttachmentsByComplaint(complaintId) { return attachments.filter(a => a.complaintId === complaintId); }
export function getAssignmentByComplaint(complaintId) { return assignments.find(a => a.complaintId === complaintId && a.status === 'ACTIVE'); }

// ============================================================
// SLA helpers
// ============================================================
export function getSlaLabel(slaStatus) {
  const map = {
    'ON_TIME': 'Còn hạn', 'NEAR_DUE': 'Sắp đến hạn', 'OVERDUE': 'Quá hạn',
    'COMPLETED_ON_TIME': 'Hoàn thành đúng hạn', 'COMPLETED_LATE': 'Hoàn thành trễ hạn',
    'PENDING_EXTENSION': 'Chờ gia hạn', 'NOT_APPLICABLE': 'Chưa áp dụng',
  };
  return map[slaStatus] || slaStatus;
}

export function getSlaColor(slaStatus) {
  const map = {
    'ON_TIME': 'bg-green-100 text-green-800', 'NEAR_DUE': 'bg-yellow-100 text-yellow-800',
    'OVERDUE': 'bg-red-100 text-red-800', 'COMPLETED_ON_TIME': 'bg-green-100 text-green-800',
    'COMPLETED_LATE': 'bg-red-200 text-red-900', 'PENDING_EXTENSION': 'bg-orange-100 text-orange-800',
    'NOT_APPLICABLE': 'bg-gray-100 text-gray-600',
  };
  return map[slaStatus] || 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status) {
  const map = {
    'NEW': 'Mới gửi', 'PENDING_RECEPTION': 'Chờ tiếp nhận', 'RECEIVED': 'Đã tiếp nhận',
    'ASSIGNED': 'Đã phân công', 'IN_PROGRESS': 'Đang xử lý',
    'EXTENSION_PENDING': 'Chờ duyệt gia hạn', 'COMPLETED': 'Hoàn thành', 'REJECTED': 'Từ chối',
  };
  return map[status] || status;
}

export function getStatusColor(status) {
  const map = {
    'NEW': 'bg-gray-100 text-gray-600',
    'PENDING_RECEPTION': 'bg-blue-100 text-blue-800',
    'RECEIVED': 'bg-blue-100 text-blue-800',
    'ASSIGNED': 'bg-purple-100 text-purple-800',
    'IN_PROGRESS': 'bg-orange-100 text-orange-800',
    'EXTENSION_PENDING': 'bg-yellow-100 text-yellow-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

export function getUrgencyLabel(urgency) {
  return urgency === 'URGENT' ? 'Khẩn cấp' : 'Thông thường';
}

export function getUrgencyColor(urgency) {
  return urgency === 'URGENT' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600';
}

export function getTimeRemaining(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const dl = new Date(deadline);
  const diff = dl - now;
  const isOverdue = diff < 0;
  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const mins = Math.floor((abs % 3600000) / 60000);
  if (isOverdue) {
    if (days > 0) return `Quá hạn ${days} ngày ${hours} giờ`;
    return `Quá hạn ${hours} giờ ${mins} phút`;
  }
  if (days > 0) return `Còn ${days} ngày ${hours} giờ`;
  return `Còn ${hours} giờ ${mins} phút`;
}

export function getActionTypeLabel(actionType) {
  const map = {
    'COMPLAINT_CREATED': 'Tạo phản ánh', 'LOCATION_UPDATED': 'Cập nhật địa điểm',
    'COMPLAINT_RECEIVED': 'Tiếp nhận', 'URGENCY_CONFIRMED': 'Xác nhận mức độ',
    'ASSIGNED': 'Phân công', 'REASSIGNED': 'Chuyển đơn vị',
    'STATUS_CHANGED': 'Cập nhật trạng thái', 'PROGRESS_UPDATED': 'Cập nhật tiến độ',
    'EVIDENCE_ADDED': 'Thêm minh chứng', 'EXTENSION_REQUESTED': 'Đề nghị gia hạn',
    'EXTENSION_APPROVED': 'Duyệt gia hạn', 'EXTENSION_REJECTED': 'Từ chối gia hạn',
    'DEADLINE_UPDATED': 'Cập nhật hạn', 'COMPLETED': 'Hoàn thành',
    'REJECTED': 'Từ chối', 'REOPENED': 'Mở lại',
  };
  return map[actionType] || actionType;
}
