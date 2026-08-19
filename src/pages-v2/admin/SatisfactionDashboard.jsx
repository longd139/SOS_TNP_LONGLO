import React, { useEffect, useState, useCallback } from 'react';
import { Star, TrendingUp, Users, MessageSquare, Search, Filter, Calendar, Award, Eye, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { message, Modal } from 'antd';
import apiClient from '../../utils/apiClient';
import { DetailField, DetailGrid, DetailSection, TicketDetailContent, TicketDetailModal } from '../../components/base/TicketDetailForm';
import './SatisfactionDashboard.css';

const stars = [5, 4, 3, 2, 1];
const scoreColor = (score) => score <= 2 ? 'text-rose-600' : score === 3 ? 'text-amber-600' : 'text-emerald-600';
const scoreBg = (score) => score <= 2 ? 'bg-rose-50 text-rose-700 border-rose-200' : score === 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200';

export default function SatisfactionDashboard() {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  
  // Data states
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageScore: 0,
    satisfactionRate: 0,
    scoreDistribution: [],
    byDepartment: []
  });
  const [ratings, setRatings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  
  // Detail Modal state
  const [selectedRatingId, setSelectedRatingId] = useState(null);
  const [ratingDetail, setRatingDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch Statistics
  const fetchStatistics = useCallback(async () => {
    try {
      setStatsLoading(true);
      const params = {};
      if (departmentFilter) params.department = departmentFilter;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await apiClient.get('/api/reception-ratings/statistics', { params });
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rating stats', err);
    } finally {
      setStatsLoading(false);
    }
  }, [departmentFilter, fromDate, toDate]);

  // Fetch Ratings List
  const fetchRatings = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        size: 10
      };
      if (search.trim()) params.search = search.trim();
      if (departmentFilter) params.department = departmentFilter;
      if (scoreFilter) params.score = Number(scoreFilter);
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await apiClient.get('/api/reception-ratings', { params });
      if (res.data?.success) {
        setRatings(res.data.data || []);
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to fetch rating list', err);
      message.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, [search, departmentFilter, scoreFilter, fromDate, toDate]);

  useEffect(() => {
    fetchStatistics();
    fetchRatings(1);
  }, [fetchStatistics, fetchRatings]);

  // Fetch Detail when selected
  const handleOpenDetail = async (id) => {
    setSelectedRatingId(id);
    setRatingDetail(null);
    try {
      setDetailLoading(true);
      const res = await apiClient.get(`/api/reception-ratings/${id}`);
      if (res.data?.success && res.data?.data) {
        setRatingDetail(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch rating detail', err);
      message.error('Lỗi khi tải chi tiết đánh giá');
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12 pt-6">
      <div className="mx-auto max-w-[1600px] animate-fade-in px-4 sm:px-6">
        
        {/* HEADER */}
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Star size={16} fill="currentColor" />
              </span>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-600">Báo cáo & Thống kê lãnh đạo</p>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Thống kê đánh giá tiếp dân</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Tổng hợp điểm số hài lòng, tiêu chí ghi nhận và ý kiến góp ý của người dân sau khi tiếp xúc tại quầy.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-2xs">
            <Award size={14} /> Dành cho Lãnh đạo & Quản trị viên
          </div>
        </header>

        {/* SUMMARY METRIC CARDS */}
        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* CARD 1: Điểm trung bình */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Điểm trung bình</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                <Star size={18} fill="currentColor" />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{stats.averageScore || 0}</span>
              <span className="text-sm font-semibold text-gray-400">/ 5.0 ⭐</span>
            </div>
            <p className="mt-2 text-xs font-medium text-emerald-600">
              {stats.averageScore >= 4 ? 'Đạt mức: Rất hài lòng' : stats.averageScore >= 3 ? 'Đạt mức: Khá hài lòng' : 'Cần cải thiện'}
            </p>
          </div>

          {/* CARD 2: Tổng lượt đánh giá */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tổng lượt đánh giá</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Users size={18} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-gray-900">{stats.totalRatings || 0}</span>
              <span className="text-sm font-medium text-gray-400">lượt hoàn thành</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">Ghi nhận từ iPad Kiosk</p>
          </div>

          {/* CARD 3: Tỷ lệ hài lòng */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tỷ lệ hài lòng (4-5⭐)</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp size={18} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600">{stats.satisfactionRate || 0}%</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${stats.satisfactionRate || 0}%` }} />
            </div>
          </div>

          {/* CARD 4: Phân bố số sao */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Phân bố số sao</span>
              <span className="text-xs text-gray-400">{stats.totalRatings} đánh giá</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {[5, 4, 3, 2, 1].map((s) => {
                const count = stats.scoreDistribution?.find(d => d.score === s)?.count || 0;
                const pct = stats.totalRatings ? Math.round((count / stats.totalRatings) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-2">
                    <span className="w-6 font-semibold text-gray-600">{s}⭐</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className={`h-full ${s >= 4 ? 'bg-emerald-500' : s === 3 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-right font-medium text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FILTER BAR */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Tìm mã đơn, tên công dân..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Quầy tiếp nhận */}
            <div>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">Tất cả quầy tiếp nhận</option>
                <option value="QUAY_1">Quầy 1</option>
                <option value="QUAY_2">Quầy 2</option>
                <option value="QUAY_3">Quầy 3</option>
                <option value="QUAY_4">Quầy 4</option>
                <option value="QUAY_5">Quầy 5</option>
                <option value="QUAY_6">Quầy 6</option>
                <option value="QUAY_7">Quầy 7</option>
                <option value="QUAY_8">Quầy 8</option>
              </select>
            </div>

            {/* Mức điểm sao */}
            <div>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">Tất cả mức sao</option>
                <option value="5">5 sao (Rất hài lòng)</option>
                <option value="4">4 sao (Hài lòng)</option>
                <option value="3">3 sao (Bình thường)</option>
                <option value="2">2 sao (Chưa hài lòng)</option>
                <option value="1">1 sao (Rất không hài lòng)</option>
              </select>
            </div>

            {/* Từ ngày */}
            <div>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                title="Từ ngày đánh giá"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Đến ngày */}
            <div>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                title="Đến ngày đánh giá"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* TABLE OF RATINGS */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">Danh sách ý kiến & đánh giá từ công dân</h2>
              <p className="mt-0.5 text-xs text-gray-500">Dữ liệu ghi nhận trực tiếp theo thời gian thực</p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {pagination.totalItems || ratings.length} kết quả
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3.5 whitespace-nowrap">Mã đơn</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Người dân</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Quầy / Lịch tiếp</th>
                  <th className="px-5 py-3.5 min-w-[180px]">Nội dung làm việc</th>
                  <th className="px-5 py-3.5 text-center whitespace-nowrap">Đánh giá</th>
                  <th className="px-5 py-3.5 min-w-[320px]">Tiêu chí & Nhận xét</th>
                  <th className="px-5 py-3.5 whitespace-nowrap">Thời gian</th>
                  <th className="px-5 py-3.5 text-center whitespace-nowrap">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Đang tải dữ liệu đánh giá...
                    </td>
                  </tr>
                ) : ratings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      Không có đánh giá nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  ratings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Mã đơn */}
                      <td className="px-5 py-4 font-bold text-blue-700 whitespace-nowrap">
                        <button
                          type="button"
                          className="hover:underline font-bold text-blue-600 hover:text-blue-800"
                          onClick={() => handleOpenDetail(item.id)}
                        >
                          {item.receptionCode}
                        </button>
                      </td>

                      {/* Người dân */}
                      <td className="px-5 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {item.applicantName || 'Ẩn danh'}
                      </td>

                      {/* Quầy tiếp nhận & Khung giờ */}
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        <div className="font-semibold text-gray-900">
                          {item.department ? (item.department.replace('QUAY_', 'Quầy ') || item.department) : 'Tại quầy'}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-400">
                          {item.receptionDate ? new Date(item.receptionDate).toLocaleDateString('vi-VN') : ''} · {item.timeSlot}
                        </div>
                      </td>

                      {/* Nội dung làm việc */}
                      <td className="px-5 py-4 min-w-[180px] max-w-[260px] text-gray-700 font-normal">
                        <div className="line-clamp-2" title={item.topic}>
                          {item.topic || '---'}
                        </div>
                      </td>

                      {/* Đánh giá sao */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold whitespace-nowrap ${scoreBg(item.score)}`}>
                          <Star size={13} fill="currentColor" /> {item.score} / 5 ⭐
                        </span>
                      </td>

                      {/* Góp ý / gợi ý */}
                      <td className="px-5 py-4 min-w-[320px] max-w-[420px]">
                        {item.selectedSuggestions?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {item.selectedSuggestions.map((sug, idx) => (
                              <span key={idx} className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                                {sug}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.comment ? (
                          <p className="text-xs text-gray-700 italic bg-gray-50/80 p-2 rounded-lg border border-gray-100 line-clamp-2" title={item.comment}>
                            "{item.comment}"
                          </p>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Không có nhận xét thêm</span>
                        )}
                      </td>

                      {/* Thời gian đánh giá */}
                      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {item.ratedAt ? new Date(item.ratedAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }) : '---'}
                      </td>

                      {/* Thao tác */}
                      <td className="px-5 py-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-2xs hover:bg-gray-50 hover:text-blue-600 transition-colors"
                          onClick={() => handleOpenDetail(item.id)}
                        >
                          <Eye size={14} /> Chi tiết
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
              <span>Trang {pagination.currentPage} / {pagination.totalPages}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => fetchRatings(pagination.currentPage - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => fetchRatings(pagination.currentPage + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

        {/* DETAIL MODAL */}
        <TicketDetailModal
          open={Boolean(selectedRatingId)}
          code={ratingDetail?.registration?.receptionCode}
          title="Chi tiết phiếu đánh giá"
          subtitle="Thông tin buổi tiếp xúc và nhận xét từ người dân"
          onClose={() => setSelectedRatingId(null)}
        >
          {detailLoading ? (
            <div className="py-12 text-center text-gray-400">Đang tải chi tiết phiếu...</div>
          ) : ratingDetail ? (
            <TicketDetailContent
              title={ratingDetail.registration?.topic}
              badges={[
                { label: 'Tiếp dân tại quầy', className: 'bg-indigo-100 text-indigo-800' },
                { label: 'Đã đánh giá', className: 'bg-emerald-100 text-emerald-800' }
              ]}
              meta={[
                { label: 'Ngày tiếp', value: ratingDetail.registration?.receptionDate ? new Date(ratingDetail.registration.receptionDate).toLocaleDateString('vi-VN') : '---' },
                { label: 'Khung giờ', value: ratingDetail.registration?.timeSlot },
                { label: 'Quầy tiếp nhận', value: ratingDetail.registration?.department ? ratingDetail.registration.department.replace('QUAY_', 'Quầy ') : 'Tại quầy' },
                { label: 'Người dân', value: ratingDetail.registration?.applicant?.fullName }
              ]}
              descriptionLabel="Nội dung cần trao đổi"
              description={ratingDetail.registration?.workingContent || 'Không có mô tả chi tiết'}
              sections={
                <>
                  {/* THÔNG TIN NGƯỜI DÂN */}
                  <DetailSection title="Thông tin người dân">
                    <DetailGrid cols={3}>
                      <DetailField label="Họ và tên" value={ratingDetail.registration?.applicant?.fullName} />
                      <DetailField label="Số điện thoại" value={ratingDetail.registration?.applicant?.phoneNumber} />
                      <DetailField label="Số CCCD" value={ratingDetail.registration?.applicant?.citizenId} />
                      <DetailField label="Địa chỉ" value={ratingDetail.registration?.applicant?.address} wide />
                    </DetailGrid>
                  </DetailSection>

                  {/* KẾT QUẢ ĐÁNH GIÁ TỪ IPAD */}
                  <DetailSection title="Kết quả đánh giá từ người dân (iPad Kiosk)" tone="warning">
                    <DetailGrid>
                      <DetailField
                        label="Điểm số đánh giá"
                        value={`${ratingDetail.score} / 5 ⭐ (${ratingDetail.score >= 4 ? 'Hài lòng' : ratingDetail.score === 3 ? 'Bình thường' : 'Chưa hài lòng'})`}
                      />
                      <DetailField
                        label="Thời điểm gửi"
                        value={ratingDetail.ratedAt ? new Date(ratingDetail.ratedAt).toLocaleString('vi-VN') : '---'}
                      />
                      <DetailField
                        label="Tiêu chí ghi nhận"
                        value={ratingDetail.selectedSuggestions?.length > 0 ? ratingDetail.selectedSuggestions.join('; ') : 'Không có tiêu chí cụ thể'}
                        wide
                      />
                      <DetailField
                        label="Ý kiến đóng góp của người dân"
                        value={ratingDetail.comment ? `"${ratingDetail.comment}"` : 'Người dân không để lại nhận xét thêm'}
                        wide
                      />
                    </DetailGrid>
                  </DetailSection>
                </>
              }
            />
          ) : null}
        </TicketDetailModal>

      </div>
    </main>
  );
}
