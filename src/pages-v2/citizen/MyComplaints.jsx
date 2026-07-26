// ============================================================
// MY COMPLAINTS — Phản ánh của tôi (Citizen view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getTimeRemaining, getAttachmentsByComplaint,
} from '../../mock/db';
import { StatusBadge, SlaBadge } from '../../mock/components/Badges';

const PAGE_SIZE = 8;

const TABS = [
  { key: 'ALL',          label: 'Tất cả',           filter: () => true },
  { key: 'PENDING',      label: 'Chờ tiếp nhận',    filter: (c) => c.status === 'NEW' || c.status === 'PENDING_RECEPTION' },
  { key: 'IN_PROGRESS',  label: 'Đang xử lý',       filter: (c) => ['RECEIVED','ASSIGNED','IN_PROGRESS','EXTENSION_PENDING'].includes(c.status) },
  { key: 'COMPLETED',    label: 'Đã hoàn thành',    filter: (c) => c.status === 'COMPLETED' },
  { key: 'REJECTED',     label: 'Bị từ chối',       filter: (c) => c.status === 'REJECTED' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ponytail: simple pagination; full table sort/paginate lib not needed for citizen's own list
function Pagination({ current, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return (
    <div className="flex items-center justify-between pt-3">
      <span className="text-sm text-gray-500">Trang {current} / {totalPages}</span>
      <div className="flex items-center gap-1">
        <button disabled={current === 1} onClick={() => onChange(current - 1)}
          className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">1</button><span className="px-1 text-gray-400">...</span></>}
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`px-3 py-1 text-sm rounded-lg border ${p === current ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            {p}
          </button>
        ))}
        {end < totalPages && <><span className="px-1 text-gray-400">...</span><button onClick={() => onChange(totalPages)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">{totalPages}</button></>}
        <button disabled={current === totalPages} onClick={() => onChange(current + 1)}
          className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function MyComplaints() {
  const navigate = useNavigate();
  const { currentUser, getComplaintsByCitizen } = useMock();

  const [tab, setTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const allComplaints = useMemo(() => {
    if (!currentUser) return [];
    return getComplaintsByCitizen(currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [currentUser, getComplaintsByCitizen]);

  // apply search
  const searched = useMemo(() => {
    if (!search.trim()) return allComplaints;
    const q = search.toLowerCase();
    return allComplaints.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q)
    );
  }, [allComplaints, search]);

  // tab counts
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => { counts[t.key] = searched.filter(t.filter).length; });
    return counts;
  }, [searched]);

  // apply tab filter
  const tabFiltered = useMemo(() => {
    const t = TABS.find(t => t.key === tab);
    return t ? searched.filter(t.filter) : searched;
  }, [searched, tab]);

  // paginate
  const totalPages = Math.max(1, Math.ceil(tabFiltered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return tabFiltered.slice(start, start + PAGE_SIZE);
  }, [tabFiltered, safePage]);

  const handleTabChange = (key) => { setTab(key); setPage(1); };

  const emptyState = allComplaints.length === 0
    ? { icon: true, title: 'Bạn chưa gửi phản ánh nào', sub: 'Nhấn "Gửi phản ánh" để bắt đầu phản ánh mới.' }
    : null;

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Phản ánh của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Tổng cộng: {allComplaints.length} phản ánh</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo mã PA, tiêu đề..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick filter tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
              tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {tabCounts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Empty state */}
      {emptyState && (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">{emptyState.title}</p>
          <p className="text-sm text-gray-400 mt-1">{emptyState.sub}</p>
        </div>
      )}

      {/* Content */}
      {!emptyState && (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Mã PA', 'Tiêu đề', 'Loại', 'Khu phố', 'Ngày gửi', 'Trạng thái', 'SLA'].map(label => (
                      <th key={label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-16 text-center text-gray-500">
                        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-base font-medium">Không tìm thấy phản ánh</p>
                        <p className="text-sm mt-1">Không có phản ánh nào phù hợp với bộ lọc</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map(c => {
                      const cat = getCategoryById(c.categoryId);
                      const nb = getNeighborhoodById(c.neighborhoodId);
                      const attachments = getAttachmentsByComplaint(c.id);
                      const thumbnail = attachments.length > 0 ? attachments[0].fileUrl : null;

                      return (
                        <tr
                          key={c.id}
                          onClick={() => navigate(`/complaint/${c.id}`)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2.5">
                              {thumbnail && (
                                <img src={thumbnail} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0 bg-gray-100" />
                              )}
                              <span className="text-sm font-mono text-blue-700 whitespace-nowrap">{c.code}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm max-w-[180px] truncate" title={c.title}>{c.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{cat?.name || '—'}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{nb?.name || '—'}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                          <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {c.slaStatus !== 'NOT_APPLICABLE' ? (
                              <div>
                                <SlaBadge slaStatus={c.slaStatus} />
                                {c.currentDeadline && ['ON_TIME','NEAR_DUE','OVERDUE'].includes(c.slaStatus) && (
                                  <div className="text-xs text-gray-400 mt-0.5">{getTimeRemaining(c.currentDeadline)}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {paginated.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-base font-medium">Không tìm thấy phản ánh</p>
                <p className="text-sm mt-1">Không có phản ánh nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              paginated.map(c => {
                const cat = getCategoryById(c.categoryId);
                const nb = getNeighborhoodById(c.neighborhoodId);
                const attachments = getAttachmentsByComplaint(c.id);
                const thumbnail = attachments.length > 0 ? attachments[0].fileUrl : null;

                return (
                  <div
                    key={c.id}
                    onClick={() => navigate(`/complaint/${c.id}`)}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2.5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      {thumbnail && (
                        <img src={thumbnail} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0 bg-gray-100" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-mono text-blue-700 font-medium">{c.code}</div>
                        <div className="text-sm font-medium text-gray-900 line-clamp-2 mt-0.5">{c.title}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <StatusBadge status={c.status} />
                      {c.slaStatus !== 'NOT_APPLICABLE' && <SlaBadge slaStatus={c.slaStatus} />}
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      <div>
                        <span className="text-gray-400">Loại:</span>
                        <span className="ml-1 text-gray-700">{cat?.name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Khu phố:</span>
                        <span className="ml-1 text-gray-700">{nb?.name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Ngày gửi:</span>
                        <span className="ml-1 text-gray-700">{formatDate(c.createdAt)}</span>
                      </div>
                      {c.slaStatus !== 'NOT_APPLICABLE' && c.currentDeadline ? (
                        <div>
                          <span className="text-gray-400">Hạn:</span>
                          <span className="ml-1 text-gray-700">{getTimeRemaining(c.currentDeadline)}</span>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {tabFiltered.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
              <Pagination current={safePage} totalPages={totalPages} onChange={setPage} />
            </div>
          )}

          {/* Summary */}
          <div className="text-xs text-gray-500">
            Hiển thị {paginated.length} / {tabFiltered.length} phản ánh
            {search ? ' (đã tìm kiếm)' : ''}
          </div>
        </>
      )}
    </div>
  );
}
