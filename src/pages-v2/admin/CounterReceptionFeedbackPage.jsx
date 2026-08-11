import React from 'react';
import ReceptionFeedbackDispatchPage from './ReceptionFeedbackDispatchPage';
import { counterReceptionFeedbackQueue } from '../../citizen/data/receptionFeedbackSession';

export default function CounterReceptionFeedbackPage() {
  return <ReceptionFeedbackDispatchPage
    eyebrow="Tiếp dân tại quầy"
    title="Điều phối đánh giá tiếp dân tại quầy"
    description="Cán bộ quầy chọn đúng phiếu tiếp dân đã hoàn tất để gọi màn hình đánh giá trên iPad."
    queue={counterReceptionFeedbackQueue}
    allowedRoles={['RECEPTION_OFFICER', 'PROCESSING_OFFICER', 'ADMIN']}
  />;
}
