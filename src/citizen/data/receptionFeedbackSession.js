export const RECEPTION_FEEDBACK_SESSION_KEY = 'sos_reception_feedback_active_v1';
export const RECEPTION_FEEDBACK_SESSION_EVENT = 'sos-reception-feedback-session-updated';

// Demo queue mirrors the reception tickets created by the mobile prototype.
export const counterReceptionFeedbackQueue = [
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-A001', ticketNo: 'A001', date: '10/08/2026', slot: '07:30 - 08:30', topic: 'Hướng dẫn thủ tục', citizenName: 'Nguyễn Văn An', office: 'Quầy tiếp dân' },
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-B003', ticketNo: 'B003', date: '10/08/2026', slot: '08:30 - 09:30', topic: 'Khiếu nại, kiến nghị', citizenName: 'Trần Thị Mai', office: 'Quầy tiếp dân' },
];

export const leaderMeetingFeedbackQueue = [
  { feedbackType: 'LEADER_MEETING', receptionId: 'LD-20260810-9214', ticketNo: 'LĐ-9214', date: '10/08/2026', slot: '08:00 - 09:30', topic: 'Làm việc với Lãnh đạo', citizenName: 'Lê Minh Khang', office: 'Phòng tiếp công dân' },
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
