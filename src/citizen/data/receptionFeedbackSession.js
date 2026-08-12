export const RECEPTION_FEEDBACK_SESSION_KEY = 'sos_reception_feedback_active_v1';
export const RECEPTION_FEEDBACK_SESSION_EVENT = 'sos-reception-feedback-session-updated';

// Demo queue mirrors the reception tickets created by the mobile prototype.
export const counterReceptionFeedbackQueue = [
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-A001', ticketNo: 'A001', date: '10/08/2026', weekday: 'Thứ Hai', slot: '07:30 - 08:30', topic: 'Hướng dẫn thủ tục', description: 'Hướng dẫn hồ sơ đăng ký thủ tục hành chính.', fullName: 'Nguyễn Văn An', citizenName: 'Nguyễn Văn An', phone: '0901234567', cccd: '079000000123', address: '18 Đường số 4, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', status: 'pending' },
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-B003', ticketNo: 'B003', date: '10/08/2026', weekday: 'Thứ Hai', slot: '08:30 - 09:30', topic: 'Khiếu nại, kiến nghị', description: 'Trao đổi nội dung khiếu nại và kiến nghị.', fullName: 'Trần Thị Mai', citizenName: 'Trần Thị Mai', phone: '0902345678', cccd: '079000000456', address: '42 Nguyễn Văn Tăng, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', status: 'pending' },
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-C005', ticketNo: 'C005', date: '10/08/2026', weekday: 'Thứ Hai', slot: '09:30 - 10:30', topic: 'Xác nhận thông tin cư trú', description: 'Đề nghị hướng dẫn xác nhận thông tin cư trú để hoàn thiện hồ sơ.', fullName: 'Phạm Minh Đức', citizenName: 'Phạm Minh Đức', phone: '0904567890', cccd: '079000001234', address: '06 Lê Văn Việt, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', status: 'pending' },
  { feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260810-D007', ticketNo: 'D007', date: '10/08/2026', weekday: 'Thứ Hai', slot: '13:30 - 14:30', topic: 'Phản ánh hạ tầng khu phố', description: 'Phản ánh tình trạng đèn chiếu sáng công cộng chưa hoạt động tại khu dân cư.', fullName: 'Lê Thị Hồng', citizenName: 'Lê Thị Hồng', phone: '0905678901', cccd: '079000001567', address: '25 Đường số 9, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', status: 'pending' },
];

export const leaderMeetingFeedbackQueue = [
  { feedbackType: 'LEADER_MEETING', receptionId: 'LD-20260810-9214', ticketNo: 'LĐ-9214', scheduleId: 'sched-1a', date: '10/08/2026', weekday: 'Thứ Hai', slot: '08:00 - 09:30', topic: 'Gặp Lãnh đạo', reason: 'Đề nghị trao đổi và xin hướng dẫn giải quyết vụ việc.', leaderName: 'Ông Nguyễn Văn An', leaderPosition: 'Chủ tịch UBND phường', office: 'Phòng Tiếp công dân', fullName: 'Lê Minh Khang', citizenName: 'Lê Minh Khang', cccd: '079000000789', cccdDate: '12/03/2020', cccdPlace: 'Cục CSQLHC về TTXH', address: '12 Nguyễn Văn A, phường Tăng Nhơn Phú', phone: '0903456789', status: 'approved', createdAt: '10/08/2026 07:45' },
];

// Mock kết quả đã đánh giá để màn hình Thống kê có đủ dữ liệu cho cả tiếp dân và gặp lãnh đạo.
export const receptionFeedbackMockRatings = [
  { id: 'TD-DG-001', feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260808-A014', ticketNo: 'A014', receptionDate: '08/08/2026', weekday: 'Thứ Bảy', receptionSlot: '08:00 - 09:00', topic: 'Hướng dẫn thủ tục hành chính', description: 'Hướng dẫn hồ sơ đăng ký khai sinh.', citizenName: 'Nguyễn Thị Lan', fullName: 'Nguyễn Thị Lan', phone: '0906789012', cccd: '079000002001', address: '08 Đường số 2, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', overall: 5, criteria: { attitude: 5, guidance: 5, waiting: 4 }, reasons: ['Được hướng dẫn rõ ràng', 'Cán bộ lắng nghe và hỗ trợ tận tình'], comment: 'Cảm ơn cán bộ đã hỗ trợ nhanh chóng.', createdAt: '2026-08-08T09:15:00.000Z' },
  { id: 'TD-DG-002', feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260807-B011', ticketNo: 'B011', receptionDate: '07/08/2026', weekday: 'Thứ Sáu', receptionSlot: '09:30 - 10:30', topic: 'Khiếu nại, kiến nghị', description: 'Trao đổi nội dung kiến nghị về hạ tầng khu phố.', citizenName: 'Phạm Văn Hùng', fullName: 'Phạm Văn Hùng', phone: '0907890123', cccd: '079000002002', address: '21 Lê Văn Việt, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', overall: 3, criteria: { attitude: 4, guidance: 3, waiting: 3 }, reasons: ['Được tiếp nhận và hướng dẫn cơ bản', 'Có thể cung cấp thêm thông tin chi tiết'], comment: '', createdAt: '2026-08-07T10:40:00.000Z' },
  { id: 'TD-DG-003', feedbackType: 'COUNTER_RECEPTION', receptionId: 'TD-20260806-C009', ticketNo: 'C009', receptionDate: '06/08/2026', weekday: 'Thứ Năm', receptionSlot: '14:00 - 15:00', topic: 'Xác nhận thông tin cư trú', description: 'Đề nghị xác nhận thông tin cư trú để hoàn thiện hồ sơ.', citizenName: 'Trần Minh Châu', fullName: 'Trần Minh Châu', phone: '0908901234', cccd: '079000002003', address: '33 Nguyễn Văn Tăng, phường Tăng Nhơn Phú', office: 'Quầy tiếp dân', overall: 4, criteria: { attitude: 4, guidance: 4, waiting: 4 }, reasons: ['Quy trình thuận tiện', 'Thời gian tiếp nhận phù hợp'], comment: 'Buổi tiếp dân diễn ra thuận lợi.', createdAt: '2026-08-06T15:20:00.000Z' },
  { id: 'LD-DG-001', feedbackType: 'LEADER_MEETING', receptionId: 'LD-20260805-8120', ticketNo: 'LĐ-8120', scheduleId: 'sched-2b', date: '05/08/2026', weekday: 'Thứ Tư', slot: '08:00 - 09:30', topic: 'Gặp Lãnh đạo', reason: 'Đề nghị trao đổi hướng giải quyết phản ánh của khu phố.', leaderName: 'Bà Phạm Thị Mai', leaderPosition: 'Phó Chủ tịch UBND phường', office: 'Phòng Tiếp công dân', fullName: 'Đỗ Thị Hạnh', citizenName: 'Đỗ Thị Hạnh', phone: '0909012345', cccd: '079000003001', cccdDate: '20/05/2021', cccdPlace: 'Cục CSQLHC về TTXH', address: '14 Đường số 8, phường Tăng Nhơn Phú', overall: 5, criteria: { attitude: 5, guidance: 5, waiting: 5 }, reasons: ['Được hướng dẫn rõ ràng', 'Thái độ phục vụ thân thiện'], comment: 'Lãnh đạo lắng nghe và trao đổi rất cụ thể.', status: 'completed', createdAt: '2026-08-05T09:45:00.000Z' },
  { id: 'LD-DG-002', feedbackType: 'LEADER_MEETING', receptionId: 'LD-20260804-7351', ticketNo: 'LĐ-7351', scheduleId: 'sched-3c', date: '04/08/2026', weekday: 'Thứ Ba', slot: '14:00 - 15:30', topic: 'Gặp Lãnh đạo', reason: 'Trao đổi về việc cấp giấy xác nhận cho hộ gia đình.', leaderName: 'Ông Trần Hoàng Nam', leaderPosition: 'Chủ tịch UBND phường', office: 'Phòng Tiếp công dân', fullName: 'Võ Quốc Dũng', citizenName: 'Võ Quốc Dũng', phone: '0910123456', cccd: '079000003002', cccdDate: '03/09/2019', cccdPlace: 'Cục CSQLHC về TTXH', address: '52 Đỗ Xuân Hợp, phường Tăng Nhơn Phú', overall: 4, criteria: { attitude: 4, guidance: 4, waiting: 3 }, reasons: ['Cán bộ lắng nghe và hỗ trợ tận tình', 'Quy trình thuận tiện'], comment: '', status: 'completed', createdAt: '2026-08-04T15:35:00.000Z' },
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
