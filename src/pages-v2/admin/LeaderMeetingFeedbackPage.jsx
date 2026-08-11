import React from 'react';
import ReceptionFeedbackDispatchPage from './ReceptionFeedbackDispatchPage';
import { leaderMeetingFeedbackQueue } from '../../citizen/data/receptionFeedbackSession';

export default function LeaderMeetingFeedbackPage() {
  return <ReceptionFeedbackDispatchPage
    eyebrow="Gặp lãnh đạo"
    title="Điều phối đánh giá buổi gặp lãnh đạo"
    description="Lãnh đạo hoặc người được phân quyền chọn đúng phiếu hẹn để gọi màn hình đánh giá trên iPad."
    queue={leaderMeetingFeedbackQueue}
    allowedRoles={['APPROVER', 'LEADER', 'ADMIN']}
  />;
}
