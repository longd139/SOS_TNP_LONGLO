import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Image as ImageIcon, MapPin, MessageSquare, Star, TrendingUp, UserRound, Video, X } from 'lucide-react';
import { complaintStatuses } from '../../citizen/data/citizenMockDb';
import { adminSatisfactionMockDb, readCitizenRatings, SATISFACTION_STORAGE_KEY, SATISFACTION_UPDATED_EVENT, satisfactionLabel } from '../../citizen/data/satisfactionData';
import { attachments, complaints, getCategoryById, getNeighborhoodById, getUserById } from '../../mock/db';
import { RECEPTION_FEEDBACK_STORAGE_KEY } from '../../pages-v2/kiosk/ReceptionKiosk';
import './SatisfactionDashboard.css';

const stars = [5, 4, 3, 2, 1];
const scoreColor = (score) => score <= 2 ? 'text-red-600' : score === 3 ? 'text-amber-600' : 'text-emerald-600';
const formatDate = (value) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—';

function ComplaintDetailModal({ code, onClose }) {
  if (!code) return null;

  const complaint = complaints.find((item) => item.code === code);
  const fallback = complaintStatuses[code];
  const category = complaint ? getCategoryById(complaint.categoryId)?.name : fallback?.category;
  const neighborhood = complaint ? getNeighborhoodById(complaint.neighborhoodId)?.name : fallback?.location;
  const sender = complaint ? getUserById(complaint.citizenId)?.fullName : null;
  const kioskRating = readKioskRatings().find((item) => item.code === code);
  const complaintAttachments = complaint ? attachments.filter((item) => item.complaintId === complaint.id) : [];
  const images = complaintAttachments.filter((item) => item.fileType?.startsWith('image/'));
  const videos = complaintAttachments.filter((item) => item.fileType?.startsWith('video/'));

  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Chi tiết phản ánh ${code}`}>
    <button type="button" className="absolute inset-0 bg-slate-900/50 cursor-default" aria-label="Đóng chi tiết" onClick={onClose} />
    <section className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
      <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-6 py-5">
        <div><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Chi tiết phản ánh</p><h2 className="mt-1 text-xl font-bold text-gray-900">{code}</h2></div>
        <button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800" onClick={onClose} aria-label="Đóng"><X size={20} /></button>
      </header>
      <div className="space-y-5 p-6">
        {kioskRating && <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Chi tiết phiếu đã gửi</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><InfoItem label="Mã phiếu" value={kioskRating.code} /><InfoItem label="Người dân" value={kioskRating.citizenName} /><InfoItem label="Ngày tiếp dân" value={kioskRating.receptionDate} /><InfoItem label="Khung giờ" value={kioskRating.receptionSlot} /><InfoItem label="Nội dung làm việc" value={kioskRating.topic} /><InfoItem label="Nơi tiếp nhận" value={kioskRating.office} /></div></div>}
        {kioskRating && <div className="rounded-xl bg-amber-50 p-4"><p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Chi tiết đánh giá</p><p className="mt-2 text-2xl font-bold text-amber-600">{'★'.repeat(kioskRating.score)} <span className="text-sm text-gray-700">{kioskRating.score}/5 · {satisfactionLabel(kioskRating.score)}</span></p>{kioskRating.criteria && <div className="mt-3 grid gap-2 sm:grid-cols-3">{Object.entries(kioskRating.criteria).map(([key, value]) => <div key={key} className="rounded-lg bg-white/70 p-2 text-xs text-gray-600">{key}: <strong>{value}/5</strong></div>)}</div>}{kioskRating.reasons?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{kioskRating.reasons.map((reason) => <span key={reason} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700">{reason}</span>)}</div>}<p className="mt-3 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-sm text-gray-700">{kioskRating.comment || 'Không có góp ý thêm.'}</p></div>}
        <div><p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Tiêu đề</p><h3 className="text-lg font-semibold text-gray-900">{complaint?.title || fallback?.title || 'Chưa có dữ liệu tiêu đề'}</h3></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoItem label="Lĩnh vực" value={category} />
          <InfoItem label="Trạng thái" value={complaint ? (complaint.status === 'COMPLETED' ? 'Đã hoàn thành' : complaint.status) : fallback?.status} />
          <InfoItem label="Tên người gửi" value={sender || 'Chưa có dữ liệu'} icon={<UserRound size={16} />} />
          <InfoItem label="Vị trí (khu phố)" value={neighborhood} icon={<MapPin size={16} />} />
          <InfoItem label="Thời gian gửi" value={complaint ? formatDate(complaint.createdAt) : fallback?.createdAt || 'Chưa có dữ liệu'} icon={<CalendarDays size={16} />} />
        </div>
        <div><p className="mb-2 text-sm font-semibold text-gray-900">Mô tả</p><p className="whitespace-pre-wrap rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-700">{complaint?.description || 'Chưa có dữ liệu mô tả cho phản ánh này.'}</p></div>
        <div><div className="mb-2 flex items-center gap-2"><ImageIcon size={17} className="text-gray-500" /><p className="text-sm font-semibold text-gray-900">Hình ảnh / video</p></div>{images.length || videos.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((item) => <img key={item.id} src={item.fileUrl} alt={item.fileName} className="aspect-video w-full rounded-xl object-cover" />)}{videos.map((item) => <video key={item.id} src={item.fileUrl} controls className="aspect-video w-full rounded-xl bg-black" />)}</div> : <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-500"><Video size={16} /> Chưa có hình ảnh hoặc video đính kèm.</div>}</div>
      </div>
    </section>
  </div>;
}

function InfoItem({ label, value, icon }) {
  return <div className="rounded-xl border border-gray-200 p-3"><p className="flex items-center gap-1.5 text-xs text-gray-500">{icon}{label}</p><p className="mt-1 text-sm font-semibold text-gray-900">{value || '—'}</p></div>;
}

function ReceptionTicketDetailModal({ item, onClose }) {
  if (!item) return null;
  const isLeaderMeeting = item.feedbackType === 'LEADER_MEETING';
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Chi tiết phiếu tiếp dân">
    <button type="button" className="absolute inset-0 cursor-default bg-slate-900/50" aria-label="Đóng chi tiết phiếu" onClick={onClose} />
    <section className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"><header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-6 py-5"><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Chi tiết phiếu đã gửi</p><h2 className="mt-1 text-xl font-bold text-gray-900">{item.ticketNo}</h2><p className="mt-1 text-sm text-gray-500">{isLeaderMeeting ? 'Phiếu gặp lãnh đạo' : 'Phiếu tiếp dân tại quầy'}</p></div><button type="button" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" onClick={onClose} aria-label="Đóng"><X size={20} /></button></header><div className="space-y-5 p-6"><div><h3 className="mb-3 text-sm font-semibold text-gray-900">Thông tin phiếu</h3><div className="grid gap-3 sm:grid-cols-2"><InfoItem label="Mã phiếu" value={item.ticketNo} /><InfoItem label="Mã liên kết" value={item.receptionId} /><InfoItem label="Ngày" value={item.date} /><InfoItem label="Thứ" value={item.weekday} /><InfoItem label="Khung giờ" value={item.slot} /><InfoItem label="Nơi tiếp nhận" value={item.office} /><InfoItem label="Nội dung làm việc" value={item.topic} /><InfoItem label={isLeaderMeeting ? 'Lý do gặp lãnh đạo' : 'Mô tả nội dung'} value={isLeaderMeeting ? item.reason : item.description} /></div></div>{isLeaderMeeting && <div><h3 className="mb-3 text-sm font-semibold text-gray-900">Thông tin lãnh đạo và lịch hẹn</h3><div className="grid gap-3 sm:grid-cols-2"><InfoItem label="Lãnh đạo tiếp" value={item.leaderName} /><InfoItem label="Chức vụ" value={item.leaderPosition} /><InfoItem label="Trạng thái phiếu" value={item.status} /><InfoItem label="Thời điểm tạo phiếu" value={item.createdAtTicket} /></div></div>}<div><h3 className="mb-3 text-sm font-semibold text-gray-900">Thông tin người dân đã điền</h3><div className="grid gap-3 sm:grid-cols-2"><InfoItem label="Họ và tên" value={item.fullName || item.citizenName} /><InfoItem label="Số điện thoại" value={item.phone} /><InfoItem label="Số CCCD" value={item.cccd} />{isLeaderMeeting && <><InfoItem label="Ngày cấp CCCD" value={item.cccdDate} /><InfoItem label="Nơi cấp CCCD" value={item.cccdPlace} /><InfoItem label="Địa chỉ" value={item.address} /></>}</div></div><div className="rounded-xl bg-amber-50 p-4"><h3 className="text-sm font-semibold text-gray-900">Kết quả đánh giá</h3><p className="mt-2 text-2xl font-bold text-amber-600">{'★'.repeat(item.score || 0)} <span className="text-sm text-gray-700">{item.score}/5 · {satisfactionLabel(item.score)}</span></p>{item.criteria && <div className="mt-3 grid gap-2 sm:grid-cols-3">{Object.entries(item.criteria).map(([key, value]) => <div key={key} className="rounded-lg bg-white/70 p-2 text-xs text-gray-600">{key}: <strong>{value}/5</strong></div>)}</div>}{item.reasons?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.reasons.map((reason) => <span key={reason} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700">{reason}</span>)}</div>}<p className="mt-3 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-sm text-gray-700">{item.comment || 'Không có góp ý thêm.'}</p></div></div></section>
  </div>;
}

function readKioskRatings() {
  try {
    const values = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_STORAGE_KEY) || '[]');
    return Array.isArray(values) ? values.map((item) => ({ ...item, code: item.ticketNo, score: item.overall, ratedAt: item.createdAt?.slice(0, 10), category: item.feedbackType === 'LEADER_MEETING' ? 'LEADER_MEETING' : 'TIEP_DAN' })) : [];
  } catch (error) {
    return [];
  }
}

export default function SatisfactionDashboard() {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [scoreSort, setScoreSort] = useState('none');
  const [dateSort, setDateSort] = useState('none');
  const [selectedComplaintCode, setSelectedComplaintCode] = useState(null);
  const [submittedRatings, setSubmittedRatings] = useState(() => readCitizenRatings());
  const [kioskRatings, setKioskRatings] = useState(() => readKioskRatings());
  useEffect(() => {
    const refreshRatings = () => setSubmittedRatings(readCitizenRatings());
    const refreshFromStorage = (event) => {
      if (event.key === SATISFACTION_STORAGE_KEY) refreshRatings();
      if (event.key === RECEPTION_FEEDBACK_STORAGE_KEY) setKioskRatings(readKioskRatings());
    };
    window.addEventListener(SATISFACTION_UPDATED_EVENT, refreshRatings);
    window.addEventListener('storage', refreshFromStorage);
    return () => {
      window.removeEventListener(SATISFACTION_UPDATED_EVENT, refreshRatings);
      window.removeEventListener('storage', refreshFromStorage);
    };
  }, []);
  const ratings = useMemo(() => {
    const byCode = new Map(adminSatisfactionMockDb.map((item) => [item.code, { ...item, category: item.category || 'PHAN_ANH' }]));
    submittedRatings.forEach((item) => byCode.set(item.code, { ...item, category: 'PHAN_ANH' }));
    kioskRatings.forEach((item) => byCode.set(item.id, item));
    return Array.from(byCode.values());
  }, [kioskRatings, submittedRatings]);
  const filtered = ratings.filter((item) => {
    const categoryOk = categoryFilter === 'all' || item.category === categoryFilter;
    const scoreOk = scoreFilter === 'all' || item.score === Number(scoreFilter);
    const dateOk = (!dateFrom || item.ratedAt >= dateFrom) && (!dateTo || item.ratedAt <= dateTo);
    return categoryOk && scoreOk && dateOk;
  }).sort((a, b) => {
    if (dateSort === 'asc') return a.ratedAt.localeCompare(b.ratedAt);
    if (dateSort === 'desc') return b.ratedAt.localeCompare(a.ratedAt);
    if (scoreSort === 'asc') return a.score - b.score;
    if (scoreSort === 'desc') return b.score - a.score;
    return 0;
  });
  const average = filtered.length ? (filtered.reduce((total, item) => total + item.score, 0) / filtered.length).toFixed(1) : '0.0';
  const selectedKioskRating = selectedComplaintCode ? readKioskRatings().find((item) => item.code === selectedComplaintCode) : null;
  return <main className="satisfaction-dashboard pb-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
      <div className="satisfaction-page-header mb-6"><div className="satisfaction-page-heading"><div className="satisfaction-page-icon"><Star size={18} /></div><div><div className="satisfaction-page-meta"><span>SOS-018 · Chất lượng phục vụ</span><span className="satisfaction-page-badge">Dành cho Lãnh đạo & Admin</span></div><h1 className="text-2xl font-bold text-gray-900 mt-1">Đánh giá hài lòng</h1><p className="text-gray-500 mt-1">Theo dõi phản hồi của người dân sau khi phản ánh được hoàn thành.</p></div></div></div>
      <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3"><span className="self-center px-2 text-xs font-semibold text-gray-500">Loại đánh giá:</span>{[['all', 'Tất cả'], ['PHAN_ANH', 'Phản ánh'], ['LEADER_MEETING', 'Gặp lãnh đạo'], ['TIEP_DAN', 'Tiếp dân']].map(([value, label]) => <button key={value} type="button" className={`rounded-lg px-3 py-2 text-sm font-semibold ${categoryFilter === value ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setCategoryFilter(value)}>{label}</button>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Điểm trung bình</span><TrendingUp className="text-blue-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{average}<span className="text-lg text-gray-400">/5</span></strong><span className="text-sm text-gray-500">{satisfactionLabel(Math.round(Number(average)))}</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Tổng lượt đánh giá</span><Star className="text-amber-500" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{filtered.length}</strong><span className="text-sm text-gray-500">Theo loại đang chọn</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Có góp ý</span><MessageSquare className="text-emerald-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{filtered.filter((item) => item.comment).length}</strong><span className="text-sm text-gray-500">Ý kiến cần xem xét</span></div>
      </div>
      <div className="satisfaction-filter bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-end gap-3"><select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}><option value="all">Tất cả số sao</option>{stars.map((item) => <option key={item} value={item}>{item} sao</option>)}</select><label className="text-xs text-gray-500">Từ ngày<input type="date" className="block border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 mt-1" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><label className="text-xs text-gray-500">Đến ngày<input type="date" className="block border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 mt-1" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><span className="satisfaction-result-count text-sm text-gray-500 self-center">{filtered.length} kết quả</span></div>
      <div className="satisfaction-table-card bg-white border border-gray-200 rounded-xl overflow-hidden"><div className="satisfaction-table-heading px-5 py-4 border-b border-gray-200"><div><h2 className="font-semibold text-gray-900">Danh sách đánh giá</h2><p>Danh sách phản ánh đã có ý kiến hài lòng từ người dân</p></div><span>{filtered.length} bản ghi</span></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="text-left px-5 py-3">Mã phản ánh</th><th className="text-left px-5 py-3"><button type="button" className="font-semibold hover:text-blue-600" onClick={() => setScoreSort((current) => current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none')}>Điểm {scoreSort === 'asc' ? '↑' : scoreSort === 'desc' ? '↓' : '↕'}</button></th><th className="text-left px-5 py-3">Mức đánh giá</th><th className="text-left px-5 py-3"><button type="button" className="font-semibold hover:text-blue-600" onClick={() => setDateSort((current) => current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none')}>Ngày đánh giá {dateSort === 'asc' ? '↑' : dateSort === 'desc' ? '↓' : '↕'}</button></th><th className="text-left px-5 py-3">Góp ý</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((item) => <tr key={item.id}><td className="px-5 py-4 font-medium text-blue-600"><button type="button" className="text-left font-semibold hover:underline" onClick={() => setSelectedComplaintCode(item.code)}>{item.code}</button><div className="text-xs text-gray-500 font-normal mt-1">{complaintStatuses[item.code]?.title || 'Phản ánh mẫu'}</div></td><td className={`px-5 py-4 font-semibold ${scoreColor(item.score)}`}>{'★'.repeat(item.score)} <span className="text-gray-500">({item.score}/5)</span></td><td className="px-5 py-4">{satisfactionLabel(item.score)}</td><td className="px-5 py-4 text-gray-600">{item.ratedAt}</td><td className="px-5 py-4 max-w-sm text-gray-600">{item.comment || ''}</td></tr>)}</tbody></table></div></div>
      <ComplaintDetailModal code={selectedKioskRating ? null : selectedComplaintCode} onClose={() => setSelectedComplaintCode(null)} />
      <ReceptionTicketDetailModal item={selectedKioskRating} onClose={() => setSelectedComplaintCode(null)} />
    </div>
  </main>;
}
