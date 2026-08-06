import React, { useMemo, useState } from 'react';
import { MessageSquare, Star, TrendingUp } from 'lucide-react';
import { complaintStatuses } from '../../citizen/data/citizenMockDb';
import { adminSatisfactionMockDb, readCitizenRatings, satisfactionLabel } from '../../citizen/data/satisfactionData';

const stars = [5, 4, 3, 2, 1];
const scoreColor = (score) => score <= 2 ? 'text-red-600' : score === 3 ? 'text-amber-600' : 'text-emerald-600';

export default function SatisfactionDashboard() {
  const [scoreFilter, setScoreFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [scoreSort, setScoreSort] = useState('none');
  const ratings = useMemo(() => {
    const submitted = readCitizenRatings();
    const byCode = new Map(adminSatisfactionMockDb.map((item) => [item.code, item]));
    submitted.forEach((item) => byCode.set(item.code, item));
    return Array.from(byCode.values());
  }, []);
  const filtered = ratings.filter((item) => {
    const scoreOk = scoreFilter === 'all' || item.score === Number(scoreFilter);
    const dateOk = (!dateFrom || item.ratedAt >= dateFrom) && (!dateTo || item.ratedAt <= dateTo);
    return scoreOk && dateOk;
  }).sort((a, b) => scoreSort === 'asc' ? a.score - b.score : scoreSort === 'desc' ? b.score - a.score : 0);
  const average = ratings.length ? (ratings.reduce((total, item) => total + item.score, 0) / ratings.length).toFixed(1) : '0.0';

  return <main className="p-6 md:p-8 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="mb-8"><p className="text-sm font-semibold text-blue-600">SOS-018 · Chất lượng phục vụ</p><h1 className="text-3xl font-bold text-gray-900 mt-1">Đánh giá hài lòng</h1><p className="text-gray-500 mt-2">Theo dõi phản hồi của người dân sau khi phản ánh được hoàn thành.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Điểm trung bình</span><TrendingUp className="text-blue-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{average}<span className="text-lg text-gray-400">/5</span></strong><span className="text-sm text-gray-500">{satisfactionLabel(Math.round(Number(average)))}</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Tổng lượt đánh giá</span><Star className="text-amber-500" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{ratings.length}</strong><span className="text-sm text-gray-500">Đánh giá hợp lệ</span></div>
        <div className="bg-white rounded-xl border border-gray-200 p-5"><div className="flex items-center justify-between"><span className="text-gray-500">Có góp ý</span><MessageSquare className="text-emerald-600" size={20} /></div><strong className="text-3xl text-gray-900 block mt-3">{ratings.filter((item) => item.comment).length}</strong><span className="text-sm text-gray-500">Ý kiến cần xem xét</span></div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap items-end gap-3"><select className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}><option value="all">Tất cả số sao</option>{stars.map((item) => <option key={item} value={item}>{item} sao</option>)}</select><label className="text-xs text-gray-500">Từ ngày<input type="date" className="block border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 mt-1" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><label className="text-xs text-gray-500">Đến ngày<input type="date" className="block border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 mt-1" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><span className="text-sm text-gray-500 self-center">{filtered.length} kết quả</span></div>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden"><div className="px-5 py-4 border-b border-gray-200"><h2 className="font-semibold text-gray-900">Danh sách đánh giá</h2></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="text-left px-5 py-3">Mã phản ánh</th><th className="text-left px-5 py-3"><button type="button" className="font-semibold hover:text-blue-600" onClick={() => setScoreSort((current) => current === 'none' || current === 'desc' ? 'asc' : 'desc')}>Điểm {scoreSort === 'asc' ? '↑' : scoreSort === 'desc' ? '↓' : '↕'}</button></th><th className="text-left px-5 py-3">Mức đánh giá</th><th className="text-left px-5 py-3">Ngày đánh giá</th><th className="text-left px-5 py-3">Góp ý</th></tr></thead><tbody className="divide-y divide-gray-100">{filtered.map((item) => <tr key={item.id}><td className="px-5 py-4 font-medium text-blue-600">{item.code}<div className="text-xs text-gray-500 font-normal mt-1">{complaintStatuses[item.code]?.title || 'Phản ánh mẫu'}</div></td><td className={`px-5 py-4 font-semibold ${scoreColor(item.score)}`}>{'★'.repeat(item.score)} <span className="text-gray-500">({item.score}/5)</span></td><td className="px-5 py-4">{satisfactionLabel(item.score)}</td><td className="px-5 py-4 text-gray-600">{item.ratedAt}</td><td className="px-5 py-4 max-w-sm text-gray-600">{item.comment || ''}</td></tr>)}</tbody></table></div></div>
    </div>
  </main>;
}
