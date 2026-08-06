export const SATISFACTION_STORAGE_KEY = 'sos_citizen_satisfaction_ratings';

export const satisfactionSeedRatings = [
  { id: 'DG-001', code: 'PA-2026-00091', score: 5, comment: 'Cán bộ hỗ trợ nhanh và rõ ràng.', ratedAt: '2026-07-15' },
  { id: 'DG-002', code: 'PA-2026-00022', score: 4, comment: 'Kết quả xử lý tốt.', ratedAt: '2026-07-14' },
  { id: 'DG-003', code: 'PA-2026-00130', score: 5, comment: '', ratedAt: '2026-07-13' },
  { id: 'DG-004', code: 'PA-2026-00131', score: 3, comment: 'Thời gian xử lý có thể nhanh hơn.', ratedAt: '2026-07-12' },
  { id: 'DG-005', code: 'PA-2026-00132', score: 4, comment: '', ratedAt: '2026-07-11' },
  { id: 'DG-006', code: 'PA-2026-00133', score: 2, comment: 'Chưa nhận được thông tin cập nhật kịp thời.', ratedAt: '2026-07-10' },
  { id: 'DG-007', code: 'PA-2026-00134', score: 5, comment: 'Hài lòng với kết quả giải quyết.', ratedAt: '2026-07-09' },
  { id: 'DG-008', code: 'PA-2026-00135', score: 4, comment: '', ratedAt: '2026-07-08' },
  { id: 'DG-009', code: 'PA-2026-00136', score: 3, comment: '', ratedAt: '2026-07-07' },
  { id: 'DG-010', code: 'PA-2026-00137', score: 5, comment: 'Quy trình đơn giản, dễ thực hiện.', ratedAt: '2026-07-06' },
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
  if (score <= 2) return 'Không hài lòng';
  if (score === 3) return 'Bình thường';
  return 'Hài lòng';
}
