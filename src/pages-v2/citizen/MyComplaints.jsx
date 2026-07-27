// ============================================================
// MY COMPLAINTS — Phản ánh của tôi (PAGE C-02)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Eye } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getTimeRemaining,
  getAttachmentsByComplaint,
  categories, neighborhoods,
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

// ponytail: StatusBadge + SlaBadge imported from shared Badges.jsx

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateOnly(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function MyComplaints() {
  const navigate = useNavigate();
  const { currentUser, getComplaintsByCitizen } = useMock();

  const [tab, setTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  const allComplaints = useMemo(() => {
    if (!currentUser) return [];
    return getComplaintsByCitizen(currentUser.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [currentUser, getComplaintsByCitizen]);

  const searched = useMemo(() => {
    let list = allComplaints;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) list = list.filter(c => c.categoryId === categoryFilter);
    if (neighborhoodFilter) list = list.filter(c => c.neighborhoodId === neighborhoodFilter);
    if (dateFrom) list = list.filter(c => new Date(c.createdAt) >= new Date(dateFrom));
    if (dateTo) list = list.filter(c => new Date(c.createdAt) <= new Date(dateTo + 'T23:59:59'));
    return list;
  }, [allComplaints, search, categoryFilter, neighborhoodFilter, dateFrom, dateTo]);

  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => { counts[t.key] = searched.filter(t.filter).length; });
    return counts;
  }, [searched]);

  const filtered = useMemo(() => {
    const t = TABS.find(t => t.key === tab);
    return t ? searched.filter(t.filter) : searched;
  }, [searched, tab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const handleTabChange = (key) => { setTab(key); setPage(1); };
  const hasActiveFilter = !!(search.trim() || categoryFilter || neighborhoodFilter || dateFrom || dateTo);
  const filteredEmpty = paginated.length === 0;

  return (
    <div className="min-h-screen">
      {/* Page title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Phản ánh của tôi</h1>
        <p className="text-gray-600 mt-1">Tổng cộng: {allComplaints.length} phản ánh</p>
      </div>

      {/* Quick tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto mb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
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

      {/* Section title */}
      <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
        Danh sách phản ánh
      </h3>

      {/* Filters */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã PA, tiêu đề..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-48 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả loại</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            value={neighborhoodFilter}
            onChange={e => { setNeighborhoodFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Tất cả khu phố</option>
            {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFrom}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Từ ngày"
            />
            <span className="text-gray-400 text-xs">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Đến ngày"
            />
          </div>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Mã PA', 'Tiêu đề', 'Loại', 'Khu phố', 'Ngày gửi', 'Trạng thái', 'SLA', 'Hạn xử lý', 'Thao tác'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmpty ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-500">
                        {hasActiveFilter ? 'Không tìm thấy phản ánh phù hợp' : 'Bạn chưa gửi phản ánh nào'}
                      </p>
                      {!hasActiveFilter && allComplaints.length === 0 && (
                        <p className="text-sm text-gray-400 mt-1">Nhấn "Gửi phản ánh" để bắt đầu phản ánh mới.</p>
                      )}
                    </td>
                  </tr>
                ) : paginated.map(c => {
                  const cat = getCategoryById(c.categoryId);
                  const nb = getNeighborhoodById(c.neighborhoodId);

                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-700">{c.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-[200px] truncate" title={c.title}>{c.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cat?.name || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{nb?.name || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(c.createdAt)}</td>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {c.currentDeadline ? formatDateOnly(c.currentDeadline) : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/complaint/${c.id}`)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" />
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{((safePage - 1) * PAGE_SIZE) + 1}</span> đến{' '}
                  <span className="font-medium">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> trong{' '}
                  <span className="font-medium">{filtered.length}</span> kết quả
                </p>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (safePage <= 3) pageNum = i + 1;
                    else if (safePage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = safePage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pageNum === safePage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filteredEmpty ? (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-base font-medium">
              {hasActiveFilter ? 'Không tìm thấy phản ánh' : 'Bạn chưa gửi phản ánh nào'}
            </p>
            {!hasActiveFilter && allComplaints.length === 0 && (
              <p className="text-sm mt-1">Nhấn "Gửi phản ánh" để bắt đầu phản ánh mới.</p>
            )}
          </div>
        ) : paginated.map(c => {
          const cat = getCategoryById(c.categoryId);
          const nb = getNeighborhoodById(c.neighborhoodId);

          return (
            <div
              key={c.id}
              className="bg-white rounded-xl p-3 md:p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs text-gray-500">{c.code}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{c.title}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                <span>{cat?.name || '—'}</span><span>•</span>
                <span>{nb?.name || '—'}</span><span>•</span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={c.status} />
                {c.slaStatus !== 'NOT_APPLICABLE' && (
                  <SlaBadge slaStatus={c.slaStatus} />
                )}
              </div>
              {c.slaStatus !== 'NOT_APPLICABLE' && c.currentDeadline && ['ON_TIME','NEAR_DUE','OVERDUE'].includes(c.slaStatus) && (
                <div className="text-xs text-gray-500 mb-2">Hạn: {formatDateOnly(c.currentDeadline)} ({getTimeRemaining(c.currentDeadline)})</div>
              )}
              <button
                onClick={() => navigate(`/complaint/${c.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium w-full"
              >
                Xem chi tiết
              </button>
            </div>
          );
        })}
        {/* Mobile pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <span className="text-sm text-gray-500">Trang {safePage} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
