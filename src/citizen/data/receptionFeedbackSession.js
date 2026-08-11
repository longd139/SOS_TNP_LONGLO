export const RECEPTION_FEEDBACK_SESSION_KEY = 'sos_reception_feedback_active_v1';
export const RECEPTION_FEEDBACK_SESSION_EVENT = 'sos-reception-feedback-session-updated';

// Demo queue mirrors the reception tickets created by the mobile prototype.
export const counterReceptionFeedbackQueue = [
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-A001', ticketNo: 'A001', date: '10/08/2026', weekday: 'Thứ Hai', slot: '07:30 - 08:30', topic: 'Hướng dẫn thủ tục', description: 'Hướng dẫn hồ sơ đăng ký thủ tục hành chính.', fullName: 'Nguyễn Văn An', citizenName: 'Nguyễn Văn An', phone: '0901234567', cccd: '079000000123', office: 'Quầy tiếp dân' },
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-B003', ticketNo: 'B003', date: '10/08/2026', weekday: 'Thứ Hai', slot: '08:30 - 09:30', topic: 'Khiếu nại, kiến nghị', description: 'Trao đổi nội dung khiếu nại và kiến nghị.', fullName: 'Trần Thị Mai', citizenName: 'Trần Thị Mai', phone: '0902345678', cccd: '079000000456', office: 'Quầy tiếp dân' },
];

export const leaderMeetingFeedbackQueue = [
  { feedbackType: 'LEADER_MEETING', receptionId: 'LD-20260810-9214', ticketNo: 'LĐ-9214', scheduleId: 'sched-1a', date: '10/08/2026', weekday: 'Thứ Hai', slot: '08:00 - 09:30', topic: 'Gặp Lãnh đạo', reason: 'Đề nghị trao đổi và xin hướng dẫn giải quyết vụ việc.', leaderName: 'Ông Nguyễn Văn An', leaderPosition: 'Chủ tịch UBND phường', office: 'Phòng Tiếp công dân', fullName: 'Lê Minh Khang', citizenName: 'Lê Minh Khang', cccd: '079000000789', cccdDate: '12/03/2020', cccdPlace: 'Cục CSQLHC về TTXH', address: '12 Nguyễn Văn A, phường Tăng Nhơn Phú', phone: '0903456789', status: 'approved', createdAt: '10/08/2026 07:45' },
];

export function readActiveReceptionFeedback() {
  try {
    const value = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_SESSION_KEY) || 'null');
    return value && typeof value === 'object' ? value : null;
  } catch (error) {
    return null;
  }
}

export function announceReceptionFeedback(reception) {
  const session = { ...reception, type: 'TIEP_DAN', announcedAt: new Date().toISOString() };
  window.localStorage.setItem(RECEPTION_FEEDBACK_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent(RECEPTION_FEEDBACK_SESSION_EVENT, { detail: session }));
  return session;
}

export function clearReceptionFeedback() {
  window.localStorage.removeItem(RECEPTION_FEEDBACK_SESSION_KEY);
  window.dispatchEvent(new CustomEvent(RECEPTION_FEEDBACK_SESSION_EVENT, { detail: null }));
}
