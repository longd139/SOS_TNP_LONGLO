import React from 'react';
import ReceptionFeedbackDispatchPage from './ReceptionFeedbackDispatchPage';
import { leaderMeetingFeedbackQueue } from '../../citizen/data/receptionFeedbackSession';

export default function LeaderMeetingFeedbackPage() {
  return <ReceptionFeedbackDispatchPage
    eyebrow="Lịch gặp lãnh đạo"
    title="Quản lý lịch gặp lãnh đạo"
    description="Kiểm tra đơn đăng ký, phê duyệt lịch gặp và mời người dân đánh giá sau khi buổi làm việc hoàn tất."
    queue={leaderMeetingFeedbackQueue}
    allowedRoles={['OFFICER', 'RECEPTION_OFFICER', 'PROCESSING_OFFICER', 'APPROVER', 'LEADER', 'ADMIN']}
  />;
}
