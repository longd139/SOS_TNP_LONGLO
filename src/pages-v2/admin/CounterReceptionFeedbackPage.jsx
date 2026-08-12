import React from 'react';
import ReceptionFeedbackDispatchPage from './ReceptionFeedbackDispatchPage';
import { counterReceptionFeedbackQueue } from '../../citizen/data/receptionFeedbackSession';

export default function CounterReceptionFeedbackPage() {
  return <ReceptionFeedbackDispatchPage
    eyebrow="Lịch tiếp dân"
    title="Quản lý lịch tiếp dân tại quầy"
    description="Kiểm tra thông tin đơn, phê duyệt lượt tiếp dân và mời người dân đánh giá sau khi hoàn tất buổi tiếp."
    queue={counterReceptionFeedbackQueue}
    allowedRoles={['OFFICER', 'ADMIN']}
  />;
}
