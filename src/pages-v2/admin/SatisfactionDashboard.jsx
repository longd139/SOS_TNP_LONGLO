import React, { useEffect, useMemo, useState } from 'react';
import { MessageSquare, Star, TrendingUp } from 'lucide-react';
import { complaintStatuses } from '../../citizen/data/citizenMockDb';
import { adminSatisfactionMockDb, readCitizenRatings, SATISFACTION_STORAGE_KEY, SATISFACTION_UPDATED_EVENT, satisfactionLabel } from '../../citizen/data/satisfactionData';
import { attachments, complaints, getCategoryById, getNeighborhoodById, getUserById } from '../../mock/db';
import { RECEPTION_FEEDBACK_STORAGE_KEY } from '../../pages-v2/kiosk/ReceptionKiosk';
import { receptionFeedbackMockRatings } from '../../citizen/data/receptionFeedbackSession';
import { DetailField, DetailGrid, DetailSection, TicketDetailContent, TicketDetailModal } from '../../components/base/TicketDetailForm';
import './SatisfactionDashboard.css';

const stars = [5, 4, 3, 2, 1];
const scoreColor = (score) => score <= 2 ? 'text-red-600' : score === 3 ? 'text-amber-600' : 'text-emerald-600';
const formatDate = (value) => value ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value)) : '—';
const feedbackSummary = (item) => [item.comment?.trim(), item.reasons?.length ? `Gợi ý: ${item.reasons.join(' · ')}` : ''].filter(Boolean).join(' · ');

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

  return <TicketDetailModal code={code} title="Chi tiết phản ánh" subtitle="Thông tin phiếu và nội dung người dân đã gửi" onClose={onClose}>
    <TicketDetailContent
      title={complaint?.title || fallback?.title}
      badges={[{ label: category || 'Chưa phân loại' }, { label: complaint ? (complaint.status === 'COMPLETED' ? 'Đã hoàn thành' : complaint.status) : fallback?.status || 'Chưa cập nhật', className: 'bg-gray-100 text-gray-700' }]}
      meta={[{ label: 'Ngày gửi', value: complaint ? formatDate(complaint.createdAt) : fallback?.createdAt }, { label: 'Người gửi', value: sender }, { label: 'Số điện thoại', value: complaint ? getUserById(complaint.citizenId)?.phone : null }]}
      description={complaint?.description || 'Chưa có dữ liệu mô tả cho phản ánh này.'}
      location={{ value: neighborhood, extra: complaint?.address || fallback?.location }}
      sections={kioskRating && <DetailSection title="Thông tin phiếu" tone="accent"><DetailGrid><DetailField label="Mã phiếu" value={kioskRating.code} /><DetailField label="Người dân" value={kioskRating.citizenName} /><DetailField label="Ngày tiếp dân" value={kioskRating.receptionDate} /><DetailField label="Khung giờ" value={kioskRating.receptionSlot} /><DetailField label="Nội dung làm việc" value={kioskRating.topic} wide /><DetailField label="Nơi tiếp nhận" value={kioskRating.office} /></DetailGrid></DetailSection>}
      attachments={[...images.map((item) => <img key={item.id} src={item.fileUrl} alt={item.fileName} className="aspect-video w-full rounded-xl object-cover" />), ...videos.map((item) => <video key={item.id} src={item.fileUrl} controls className="aspect-video w-full rounded-xl bg-black" />)]}
    />
  </TicketDetailModal>;
}

function ReceptionTicketDetailModal({ item, onClose }) {
  if (!item) return null;
  const isLeaderMeeting = item.feedbackType === 'LEADER_MEETING';
  return <TicketDetailModal code={item.ticketNo} title="Chi tiết phiếu đã gửi" subtitle={isLeaderMeeting ? 'Phiếu gặp lãnh đạo' : 'Phiếu tiếp dân tại quầy'} onClose={onClose}>
    <TicketDetailContent
      title={item.topic}
      badges={[{ label: isLeaderMeeting ? 'Gặp lãnh đạo' : 'Tiếp dân tại quầy' }, { label: item.status || 'Đã tiếp nhận', className: 'bg-gray-100 text-gray-700' }]}
      meta={[{ label: 'Ngày tiếp', value: item.date }, { label: 'Người dân', value: item.fullName || item.citizenName }, { label: 'Số điện thoại', value: item.phone }]}
      descriptionLabel={isLeaderMeeting ? 'Lý do gặp lãnh đạo' : 'Mô tả nội dung'}
      description={isLeaderMeeting ? item.reason : item.description}
      location={{ title: 'Thông tin tiếp nhận', value: item.office, extra: `Mã liên kết: ${item.receptionId || 'Chưa có dữ liệu'} · Thứ: ${item.weekday || 'Chưa có dữ liệu'} · Khung giờ: ${item.slot || 'Chưa có dữ liệu'}` }}
      sections={<><DetailSection title="Thông tin người dân đã điền"><DetailGrid><DetailField label="Họ và tên" value={item.fullName || item.citizenName} /><DetailField label="Số điện thoại" value={item.phone} /><DetailField label="Số CCCD" value={item.cccd} /><DetailField label="Ngày cấp CCCD" value={item.cccdDate} /><DetailField label="Nơi cấp CCCD" value={item.cccdPlace} /><DetailField label="Địa chỉ" value={item.address} wide /></DetailGrid></DetailSection>{isLeaderMeeting && <DetailSection title="Thông tin lãnh đạo và lịch hẹn"><DetailGrid><DetailField label="Lãnh đạo tiếp" value={item.leaderName} /><DetailField label="Chức vụ" value={item.leaderPosition} /><DetailField label="Trạng thái phiếu" value={item.status} /><DetailField label="Thời điểm tạo phiếu" value={item.createdAtTicket} /></DetailGrid></DetailSection>}<DetailSection title="Kết quả đánh giá" tone="warning"><p className="text-2xl font-bold text-amber-600">{'★'.repeat(item.score || 0)} <span className="text-sm text-gray-700">{item.score}/5 · {satisfactionLabel(item.score)}</span></p>{item.criteria && <div className="mt-3 grid gap-2 sm:grid-cols-3">{Object.entries(item.criteria).map(([key, value]) => <div key={key} className="rounded-lg bg-white/70 p-2 text-xs text-gray-600">{key}: <strong>{value}/5</strong></div>)}</div>}{item.reasons?.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{item.reasons.map((reason) => <span key={reason} className="rounded-full bg-blue-100 px-2.5 py-1 text-xs text-blue-700">{reason}</span>)}</div>}<p className="mt-3 whitespace-pre-wrap rounded-lg bg-white/70 p-3 text-sm text-gray-700">{item.comment || 'Không có góp ý thêm.'}</p></DetailSection></>}
    />
  </TicketDetailModal>;
}

function readKioskRatings() {
  try {
    const values = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_STORAGE_KEY) || '[]');
    const allValues = [...receptionFeedbackMockRatings, ...(Array.isArray(values) ? values : [])];
    return allValues.map((item) => ({ ...item, code: item.ticketNo, score: item.overall, ratedAt: item.createdAt?.slice(0, 10), category: item.feedbackType === 'LEADER_MEETING' ? 'LEADER_MEETING' : 'TIEP_DAN' }));
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Điểm trung bình</span><TrendingUp className="text-blue-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{average}<span className="text-lg text-gray-400">/5</span></strong><span className="text-sm text-gray-500">{satisfactionLabel(Math.round(Number(average)))}</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Tổng lượt đánh giá</span><Star className="text-amber-500" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{filtered.length}</strong><span className="text-sm text-gray-500">Theo loại đang chọn</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Có góp ý</span><MessageSquare className="text-emerald-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{filtered.filter((item) => feedbackSummary(item)).length}</strong><span className="text-sm text-gray-500">Bao gồm lựa chọn và nội dung nhập</span></div>
      </div>
      <div className="satisfaction-filter mb-5 overflow-x-auto rounded-xl border border-gray-200 bg-white p-4"><div className="flex min-w-[760px] w-full items-end gap-4"><label className="flex-1 whitespace-nowrap text-xs text-gray-500">Loại đánh giá<select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Tất cả loại</option><option value="PHAN_ANH">Phản ánh</option><option value="LEADER_MEETING">Gặp lãnh đạo</option><option value="TIEP_DAN">Tiếp dân</option></select></label><label className="flex-1 whitespace-nowrap text-xs text-gray-500">Mức đánh giá<select className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}><option value="all">Tất cả số sao</option>{stars.map((item) => <option key={item} value={item}>{item} sao</option>)}</select></label><label className="flex-1 whitespace-nowrap text-xs text-gray-500">Từ ngày<input type="date" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><label className="flex-1 whitespace-nowrap text-xs text-gray-500">Đến ngày<input type="date" className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><span className="satisfaction-result-count self-center whitespace-nowrap text-sm text-gray-500">{filtered.length} kết quả</span></div></div>
      <div className="satisfaction-table-card bg-white border border-gray-200 rounded-xl overflow-hidden"><div className="satisfaction-table-heading px-5 py-4 border-b border-gray-200"><div><h2 className="font-semibold text-gray-900">Danh sách đánh giá</h2><p>Danh sách phản ánh và đơn tiếp dân đã có phản hồi từ người dân</p></div><span>{filtered.length} bản ghi</span></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="text-left px-5 py-3">Mã phiếu</th><th className="text-left px-5 py-3"><button type="button" className="font-semibold hover:text-blue-600" onClick={() => setScoreSort((current) => current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none')}>Điểm {scoreSort === 'asc' ? '↑' : scoreSort === 'desc' ? '↓' : '↕'}</button></th><th className="text-left px-5 py-3">Mức đánh giá</th><th className="text-left px-5 py-3"><button type="button" className="font-semibold hover:text-blue-600" onClick={() => setDateSort((current) => current === 'none' ? 'asc' : current === 'asc' ? 'desc' : 'none')}>Ngày đánh giá {dateSort === 'asc' ? '↑' : dateSort === 'desc' ? '↓' : '↕'}</button></th><th className="text-left px-5 py-3">Góp ý / lựa chọn</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((item) => <tr key={item.id}><td className="px-5 py-4 font-medium text-blue-600"><button type="button" className="text-left font-semibold hover:underline" onClick={() => setSelectedComplaintCode(item.code)}>{item.code}</button><div className="text-xs text-gray-500 font-normal mt-1">{complaintStatuses[item.code]?.title || 'Phản ánh mẫu'}</div></td><td className={`px-5 py-4 font-semibold ${scoreColor(item.score)}`}>{'★'.repeat(item.score)} <span className="text-gray-500">({item.score}/5)</span></td><td className="px-5 py-4">{satisfactionLabel(item.score)}</td><td className="px-5 py-4 text-gray-600">{item.ratedAt}</td><td className="max-w-sm whitespace-pre-wrap px-5 py-4 text-gray-600">{feedbackSummary(item) || 'Không có góp ý thêm.'}</td></tr>)}</tbody></table></div></div>
      <ComplaintDetailModal code={selectedKioskRating ? null : selectedComplaintCode} onClose={() => setSelectedComplaintCode(null)} />
      <ReceptionTicketDetailModal item={selectedKioskRating} onClose={() => setSelectedComplaintCode(null)} />
    </div>
  </main>;
}
