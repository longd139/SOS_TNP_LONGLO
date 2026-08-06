export const SATISFACTION_STORAGE_KEY = 'sos_citizen_satisfaction_ratings_v2';

// Bản demo bắt đầu với 10 phản ánh hoàn thành nhưng chưa có đánh giá.
export const satisfactionSeedRatings = [];

// Mock DB riêng cho màn hình lãnh đạo, không dùng để khóa nút đánh giá phía người dân.
export const adminSatisfactionMockDb = [
  { id: 'ADMIN-DG-001', code: 'PA-2026-00091', score: 5, comment: 'Cán bộ hỗ trợ nhanh và rõ ràng.', ratedAt: '2026-07-15' },
  { id: 'ADMIN-DG-002', code: 'PA-2026-00022', score: 4, comment: 'Kết quả xử lý tốt.', ratedAt: '2026-07-14' },
  { id: 'ADMIN-DG-003', code: 'PA-2026-00130', score: 5, comment: '', ratedAt: '2026-07-13' },
  { id: 'ADMIN-DG-004', code: 'PA-2026-00131', score: 3, comment: 'Thời gian xử lý có thể nhanh hơn.', ratedAt: '2026-07-12' },
  { id: 'ADMIN-DG-005', code: 'PA-2026-00132', score: 4, comment: '', ratedAt: '2026-07-11' },
  { id: 'ADMIN-DG-006', code: 'PA-2026-00133', score: 2, comment: 'Chưa nhận được thông tin cập nhật kịp thời.', ratedAt: '2026-07-10' },
  { id: 'ADMIN-DG-007', code: 'PA-2026-00134', score: 5, comment: 'Hài lòng với kết quả giải quyết.', ratedAt: '2026-07-09' },
  { id: 'ADMIN-DG-008', code: 'PA-2026-00135', score: 4, comment: '', ratedAt: '2026-07-08' },
  { id: 'ADMIN-DG-009', code: 'PA-2026-00136', score: 3, comment: '', ratedAt: '2026-07-07' },
  { id: 'ADMIN-DG-010', code: 'PA-2026-00137', score: 1, comment: 'Chưa hài lòng với thời gian xử lý.', ratedAt: '2026-07-06' },
  ...Array.from({ length: 50 }, (_, index) => {
    const number = 138 + index;
    const score = (index % 5) + 1;
    const day = String((index % 28) + 1).padStart(2, '0');
    return { id: `ADMIN-DG-${String(index + 11).padStart(3, '0')}`, code: `PA-2026-${String(number).padStart(5, '0')}`, score, comment: index % 3 === 0 ? `Góp ý mẫu cho phản ánh ${number}.` : '', ratedAt: `2026-06-${day}` };
  }),
];

export function readCitizenRatings() {
  try {
    const value = JSON.parse(window.localStorage.getItem(SATISFACTION_STORAGE_KEY) || '[]');
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

export function satisfactionLabel(score) {
  if (score === 1) return 'Rất không hài lòng';
  if (score === 2) return 'Không hài lòng';
  if (score === 3) return 'Bình thường';
  if (score === 4) return 'Hài lòng';
  return 'Rất hài lòng';
}
