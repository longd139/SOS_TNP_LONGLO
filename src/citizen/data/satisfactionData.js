export const SATISFACTION_STORAGE_KEY = 'sos_citizen_satisfaction_ratings_v2';

// Bản demo bắt đầu với 10 phản ánh hoàn thành nhưng chưa có đánh giá.
export const satisfactionSeedRatings = [];

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
