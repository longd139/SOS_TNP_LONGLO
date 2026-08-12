import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, MonitorUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useMock } from '../../mock/MockContext';
import {
  announceReceptionFeedback,
  readActiveReceptionFeedback,
  RECEPTION_FEEDBACK_SESSION_EVENT,
} from '../../citizen/data/receptionFeedbackSession';
import {
  RECEPTION_FEEDBACK_STORAGE_KEY,
  RECEPTION_FEEDBACK_UPDATED_EVENT,
} from '../kiosk/ReceptionKiosk';
import {
  DetailField,
  DetailGrid,
  DetailSection,
  TicketDetailContent,
  TicketDetailModal,
} from '../../components/base/TicketDetailForm';

export default function ReceptionFeedbackDispatchPage({ title, description, queue, allowedRoles, eyebrow }) {
  const { currentUser } = useMock();
  const role = currentUser?.role || 'CITIZEN';
  const isLeaderMeeting = queue[0]?.feedbackType === 'LEADER_MEETING';
  const labels = useMemo(() => (isLeaderMeeting
    ? {
      listTitle: 'Danh sách đơn đăng ký gặp lãnh đạo',
      listDescription: 'Mở mã đơn để xem lịch hẹn, lý do gặp và lãnh đạo tiếp trước khi mời đánh giá trên iPad.',
      code: 'Mã đơn gặp lãnh đạo',
      date: 'Ngày / giờ gặp',
      topic: 'Lý do gặp lãnh đạo',
      approve: 'Phê duyệt lịch gặp',
      approved: 'Đã phê duyệt lịch',
      invite: 'Mời đánh giá buổi gặp',
      detailTitle: 'Chi tiết đơn gặp lãnh đạo',
      detailSubtitle: 'Đơn đăng ký gặp lãnh đạo',
      detailDescription: 'Lý do gặp lãnh đạo',
      receptionInfo: 'Thông tin lịch gặp',
      leaderSection: 'Thông tin lãnh đạo và lịch hẹn',
    }
    : {
      listTitle: 'Danh sách đơn tiếp dân',
      listDescription: 'Mở mã đơn để xem nội dung, phê duyệt trước khi mời người dân đánh giá trên iPad.',
      code: 'Mã đơn tiếp dân',
      date: 'Ngày / giờ tiếp',
      topic: 'Nội dung làm việc',
      approve: 'Phê duyệt đơn',
      approved: 'Đã phê duyệt đơn',
      invite: 'Mời người dân đánh giá',
      detailTitle: 'Chi tiết đơn tiếp dân',
      detailSubtitle: 'Đơn đăng ký tiếp dân tại quầy',
      detailDescription: 'Mô tả nội dung',
      receptionInfo: 'Thông tin tiếp nhận',
      leaderSection: 'Thông tin lãnh đạo và lịch hẹn',
    }), [isLeaderMeeting]);

  const [activeReception, setActiveReception] = useState(() => readActiveReceptionFeedback());
  const [selectedReception, setSelectedReception] = useState(null);
  const [approvedReceptionIds, setApprovedReceptionIds] = useState(() => new Set());
  const [ratedReceptionIds, setRatedReceptionIds] = useState(() => readRatedReceptionIds());

  useEffect(() => {
    const refresh = () => setActiveReception(readActiveReceptionFeedback());
    const refreshRatings = () => setRatedReceptionIds(readRatedReceptionIds());
    window.addEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
    window.addEventListener(RECEPTION_FEEDBACK_UPDATED_EVENT, refreshRatings);
    window.addEventListener('storage', refresh);
    window.addEventListener('storage', refreshRatings);
    return () => {
      window.removeEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
      window.removeEventListener(RECEPTION_FEEDBACK_UPDATED_EVENT, refreshRatings);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('storage', refreshRatings);
    };
  }, []);

  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;

  const invite = (reception) => setActiveReception(announceReceptionFeedback(reception));
  const approveReception = (receptionId) => setApprovedReceptionIds((current) => new Set([...current, receptionId]));

  return (
    <main className="min-h-screen bg-gray-50 pb-10 pt-6" data-feedback-type={isLeaderMeeting ? 'LEADER_MEETING' : 'COUNTER_RECEPTION'}>
      <style>{`main.min-h-screen .overflow-x-auto tr:has(td:nth-child(5) .bg-emerald-50) td:last-child button:last-child:disabled { background: #ecfdf5 !important; color: #047857 !important; border: 1px solid #a7f3d0; font-size: 0; } main.min-h-screen .overflow-x-auto tr:has(td:nth-child(5) .bg-emerald-50) td:last-child button:last-child:disabled::after { content: 'Đã đánh giá'; font-size: 0.75rem; }`}</style>
      <div className="mx-auto max-w-[1600px] animate-fade-in">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-blue-600"><ClipboardCheck size={16} /> {eyebrow}</p>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${activeReception ? 'bg-emerald-50 text-emerald-700' : 'border border-gray-200 bg-white text-gray-500'}`}>
            {activeReception ? <><MonitorUp size={15} /> iPad đang hiển thị đánh giá {activeReception.ticketNo}</> : 'iPad đang chờ phiên đánh giá'}
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div><h2 className="font-semibold text-gray-900">{labels.listTitle}</h2><p className="mt-1 text-xs text-gray-500">{labels.listDescription}</p></div>
            <span className="text-xs text-gray-500">{queue.length} đơn</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr>
                <th className="px-5 py-3">{labels.code}</th><th className="px-5 py-3">Người đăng ký</th><th className="px-5 py-3">{labels.date}</th><th className="px-5 py-3">{labels.topic}</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thao tác</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">{queue.map((reception) => {
                const isActive = activeReception?.receptionId === reception.receptionId;
                const isApproved = approvedReceptionIds.has(reception.receptionId);
                const isRated = ratedReceptionIds.has(reception.receptionId) || ratedReceptionIds.has(reception.ticketNo);
                return <tr key={reception.receptionId} className={isActive ? 'bg-blue-50/60' : ''}>
                  <td className="px-5 py-4 font-bold text-blue-700"><button type="button" className="hover:underline" onClick={() => setSelectedReception(reception)}>{reception.ticketNo}</button><div className="mt-1 text-xs font-normal text-gray-400">{reception.receptionId}</div></td>
                  <td className="px-5 py-4 text-gray-700">{reception.citizenName}</td><td className="px-5 py-4 text-gray-600">{reception.date}<br />{reception.slot}</td><td className="px-5 py-4 text-gray-700">{reception.topic}</td>
                  <td className="px-5 py-4">{isRated ? <Status tone="green" icon={<CheckCircle2 size={13} />}>Hoàn thành</Status> : isActive ? <Status tone="blue" icon={<MonitorUp size={13} />}>Đang hiển thị đánh giá</Status> : isApproved ? <Status tone="blue" icon={<CheckCircle2 size={13} />}>{labels.approved}</Status> : <span className="text-xs text-amber-600">Chờ phê duyệt đơn</span>}</td>
                  <td className="px-5 py-4"><div className="flex flex-wrap gap-2"><button type="button" className={`rounded-lg border px-3 py-2 text-xs font-semibold ${isApproved || isRated ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`} onClick={() => approveReception(reception.receptionId)} disabled={isApproved || isRated}>{isApproved || isRated ? labels.approved : labels.approve}</button><button type="button" disabled={!isApproved || isRated} className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${!isApproved || isRated ? 'cursor-not-allowed bg-gray-300' : isActive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={() => invite(reception)}>{isRated ? 'Hoàn thành' : isActive ? 'Hiển thị lại đánh giá' : labels.invite}</button></div></td>
                </tr>;
              })}</tbody>
            </table>
          </div>
        </section>

        <TicketDetailModal open={Boolean(selectedReception)} code={selectedReception?.ticketNo} title={labels.detailTitle} subtitle={labels.detailSubtitle} onClose={() => setSelectedReception(null)}>
          {selectedReception && <TicketDetailContent
            title={selectedReception.topic}
            badges={[{ label: isLeaderMeeting ? 'Gặp lãnh đạo' : 'Tiếp dân tại quầy', className: 'bg-indigo-100 text-indigo-800' }, { label: selectedReception.status || 'Chờ đánh giá', className: 'bg-gray-100 text-gray-700' }]}
            meta={[{ label: isLeaderMeeting ? 'Ngày gặp' : 'Ngày tiếp', value: selectedReception.date }, { label: 'Người dân', value: selectedReception.fullName || selectedReception.citizenName }, { label: 'Số điện thoại', value: selectedReception.phone }]}
            descriptionLabel={labels.detailDescription}
            description={selectedReception.description || selectedReception.reason}
            location={{ title: labels.receptionInfo, value: selectedReception.office, extra: `Mã liên kết: ${selectedReception.receptionId || 'Chưa có dữ liệu'} · Khung giờ: ${selectedReception.slot || 'Chưa có dữ liệu'}` }}
            sections={<><DetailSection title="Thông tin người dân đã điền"><DetailGrid><DetailField label="Họ và tên" value={selectedReception.fullName || selectedReception.citizenName} /><DetailField label="Số điện thoại" value={selectedReception.phone} /><DetailField label="Số CCCD" value={selectedReception.cccd} /><DetailField label="Ngày cấp CCCD" value={selectedReception.cccdDate} /><DetailField label="Nơi cấp CCCD" value={selectedReception.cccdPlace} /><DetailField label="Địa chỉ" value={selectedReception.address} wide /></DetailGrid></DetailSection>{(isLeaderMeeting || selectedReception.leaderName || selectedReception.leaderPosition) && <DetailSection title={labels.leaderSection}><DetailGrid><DetailField label="Lãnh đạo tiếp" value={selectedReception.leaderName} /><DetailField label="Chức vụ" value={selectedReception.leaderPosition} /></DetailGrid></DetailSection>}</>}
          />}
        </TicketDetailModal>
      </div>
    </main>
  );
}

function Status({ children, tone, icon }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tone === 'green' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{icon}{children}</span>;
}

function readRatedReceptionIds() {
  try {
    const ratings = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_STORAGE_KEY) || '[]');
    return new Set(ratings.flatMap((item) => [item.receptionId, item.ticketNo].filter(Boolean)));
  } catch (error) {
    return new Set();
  }
}
