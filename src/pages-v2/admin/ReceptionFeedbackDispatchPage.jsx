import React, { useEffect, useState } from 'react';
import { CheckCircle2, ClipboardCheck, MonitorUp } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useMock } from '../../mock/MockContext';
import { announceReceptionFeedback, readActiveReceptionFeedback, RECEPTION_FEEDBACK_SESSION_EVENT } from '../../citizen/data/receptionFeedbackSession';

export default function ReceptionFeedbackDispatchPage({ title, description, queue, allowedRoles, eyebrow }) {
  const { currentUser } = useMock();
  const role = currentUser?.role || 'CITIZEN';
  const [activeReception, setActiveReception] = useState(() => readActiveReceptionFeedback());

  useEffect(() => {
    const refresh = () => setActiveReception(readActiveReceptionFeedback());
    window.addEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!allowedRoles.includes(role)) return <Navigate to="/dashboard" replace />;

  const invite = (reception) => setActiveReception(announceReceptionFeedback(reception));

  return <main className="min-h-screen bg-gray-50 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-blue-600"><ClipboardCheck size={16} /> {eyebrow}</p>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
        </div>
        <div className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${activeReception ? 'bg-emerald-50 text-emerald-700' : 'bg-white text-gray-500 border border-gray-200'}`}>
          {activeReception ? <><MonitorUp size={15} /> iPad đang hiển thị {activeReception.ticketNo}</> : 'iPad đang chờ phiên'}
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div><h2 className="font-semibold text-gray-900">Danh sách chờ đánh giá</h2><p className="mt-1 text-xs text-gray-500">Chọn một phiếu để hiển thị đúng thông tin trên iPad.</p></div>
          <span className="text-xs text-gray-500">{queue.length} phiếu</span>
        </div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Mã phiếu</th><th className="px-5 py-3">Người dân</th><th className="px-5 py-3">Ngày / giờ</th><th className="px-5 py-3">Nội dung</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Thao tác</th></tr></thead><tbody className="divide-y divide-gray-100">{queue.map((reception) => { const isActive = activeReception?.receptionId === reception.receptionId; return <tr key={reception.receptionId} className={isActive ? 'bg-blue-50/60' : ''}><td className="px-5 py-4 font-bold text-blue-700">{reception.ticketNo}<div className="mt-1 text-xs font-normal text-gray-400">{reception.receptionId}</div></td><td className="px-5 py-4 text-gray-700">{reception.citizenName}</td><td className="px-5 py-4 text-gray-600">{reception.date}<br />{reception.slot}</td><td className="px-5 py-4 text-gray-700">{reception.topic}</td><td className="px-5 py-4">{isActive ? <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 size={13} /> Đang hiển thị</span> : <span className="text-xs text-gray-400">Chờ gọi</span>}</td><td className="px-5 py-4"><button type="button" className={`rounded-lg px-3 py-2 text-xs font-semibold text-white ${isActive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`} onClick={() => invite(reception)}>{isActive ? 'Hiển thị lại' : 'Mời đánh giá'}</button></td></tr>; })}</tbody></table></div>
      </section>
    </div>
  </main>;
}
