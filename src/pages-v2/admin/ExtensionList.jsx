// ============================================================
// EXTENSION LIST — Quản lý gia hạn (approver/leader view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Filter, Search, ArrowRight, ChevronDown, ChevronUp, X } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import { getComplaintById, getDepartmentById, getUserById, neighborhoods, categories, departments } from '../../mock/db';

const EXT_STATUS = {
  PENDING: { label: 'Chờ phê duyệt', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
};

const TABS = [
  { key: 'PENDING', label: 'Chờ phê duyệt' },
  { key: 'APPROVED', label: 'Đã phê duyệt' },
  { key: 'REJECTED', label: 'Đã từ chối' },
];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

export default function ExtensionList() {
  const navigate = useNavigate();
  const { extensions } = useMock();

  const [tab, setTab] = useState('PENDING');
  const [filters, setFilters] = useState({ search: '', neighborhoodId: '', categoryId: '', departmentId: '', urgency: '', overdueOnly: false });
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState({ field: 'requestedAt', dir: 'desc' });

  // join extension with its complaint
  const enriched = useMemo(() => extensions.map(ext => {
    const complaint = getComplaintById(ext.complaintId);
    const requester = getUserById(ext.requestedBy);
    const reviewer = ext.reviewedBy ? getUserById(ext.reviewedBy) : null;
    const dept = complaint?.assignedDepartmentId ? getDepartmentById(complaint.assignedDepartmentId) : null;
    const cat = complaint?.categoryId ? categories.find(c => c.id === complaint.categoryId) : null;
    const nb = complaint?.neighborhoodId ? neighborhoods.find(n => n.id === complaint.neighborhoodId) : null;
    return { ...ext, complaint, requester, reviewer, dept, cat, nb };
  }), [extensions]);

  // apply tab + filters
  const filtered = useMemo(() => {
    let list = enriched.filter(e => e.status === tab);
    const f = filters;
    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(e =>
        e.id.toLowerCase().includes(q) ||
        (e.complaint?.code?.toLowerCase() || '').includes(q) ||
        (e.complaint?.title?.toLowerCase() || '').includes(q) ||
        (e.requester?.fullName?.toLowerCase() || '').includes(q)
      );
    }
    if (f.neighborhoodId) list = list.filter(e => e.complaint?.neighborhoodId === f.neighborhoodId);
    if (f.categoryId) list = list.filter(e => e.complaint?.categoryId === f.categoryId);
    if (f.departmentId) list = list.filter(e => e.complaint?.assignedDepartmentId === f.departmentId);
    if (f.urgency) list = list.filter(e => (e.complaint?.confirmedUrgency || e.complaint?.citizenUrgency) === f.urgency);
    if (f.overdueOnly) list = list.filter(e => new Date(e.requestedDeadline) < new Date());
    return list.sort((a, b) => {
      const va = new Date(a[sort.field] || 0);
      const vb = new Date(b[sort.field] || 0);
      return sort.dir === 'asc' ? va - vb : vb - va;
    });
  }, [enriched, tab, filters, sort]);

  const counts = useMemo(() => ({
    PENDING: enriched.filter(e => e.status === 'PENDING').length,
    APPROVED: enriched.filter(e => e.status === 'APPROVED').length,
    REJECTED: enriched.filter(e => e.status === 'REJECTED').length,
  }), [enriched]);

  const toggleSort = (field) => {
    setSort(s => s.field === field ? { field, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { field, dir: 'desc' });
  };

  const clearFilters = () => {
    setFilters({ search: '', neighborhoodId: '', categoryId: '', departmentId: '', urgency: '', overdueOnly: false });
  };

  const hasFilters = filters.search || filters.neighborhoodId || filters.categoryId || filters.departmentId || filters.urgency || filters.overdueOnly;

  const urgencyOptions = [
    { value: '', label: 'Tất cả mức độ' },
    { value: 'URGENT', label: 'Khẩn cấp' },
    { value: 'NORMAL', label: 'Thông thường' },
  ];

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý gia hạn</h1>
          <p className="text-sm text-gray-600 mt-1">Tổng cộng: {extensions.length} yêu cầu</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
              tab === t.key ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}>
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tiêu đề, người đề nghị..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
            showFilters || hasFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
          {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white border border-gray-200 rounded-lg">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Khu phố</label>
            <select
              value={filters.neighborhoodId}
              onChange={e => setFilters(f => ({ ...f, neighborhoodId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả khu phố</option>
              {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Danh mục</label>
            <select
              value={filters.categoryId}
              onChange={e => setFilters(f => ({ ...f, categoryId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.filter(c => c.status === 'ACTIVE').map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Đơn vị xử lý</label>
            <select
              value={filters.departmentId}
              onChange={e => setFilters(f => ({ ...f, departmentId: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả đơn vị</option>
              {departments.filter(d => d.status === 'ACTIVE').map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mức độ</label>
            <select
              value={filters.urgency}
              onChange={e => setFilters(f => ({ ...f, urgency: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {urgencyOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.overdueOnly}
                onChange={e => setFilters(f => ({ ...f, overdueOnly: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Chỉ hiện yêu cầu quá hạn
            </label>
          </div>
          {hasFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3" />
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'id', label: 'Mã yêu cầu' },
                  { key: 'complaintId', label: 'Mã PA' },
                  { key: 'title', label: 'Tiêu đề' },
                  { key: null, label: 'Đơn vị' },
                  { key: null, label: 'Người đề nghị' },
                  { key: 'oldDeadline', label: 'Hạn hiện tại' },
                  { key: 'requestedDeadline', label: 'Hạn đề nghị' },
                  { key: null, label: 'Lý do' },
                  { key: 'requestedAt', label: 'Ngày đề nghị' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: null, label: 'Thao tác' },
                ].map(col => (
                  <th
                    key={col.key || col.label}
                    onClick={() => col.key && toggleSort(col.key)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap ${col.key ? 'cursor-pointer hover:text-gray-700 select-none' : ''}`}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key && sort.field === col.key && (
                        sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium">Không có yêu cầu gia hạn nào</p>
                    <p className="text-sm mt-1">Không tìm thấy yêu cầu gia hạn phù hợp với bộ lọc</p>
                  </td>
                </tr>
              ) : (
                filtered.map(ext => (
                  <tr
                    key={ext.id}
                    onClick={() => navigate(`/admin/extensions/${ext.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-blue-700 whitespace-nowrap">{ext.id}</td>
                    <td className="px-6 py-4 text-sm font-mono whitespace-nowrap">{ext.complaint?.code || '—'}</td>
                    <td className="px-6 py-4 text-sm max-w-[200px] truncate" title={ext.complaint?.title}>
                      {ext.complaint?.title || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{ext.dept?.name || '—'}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">{ext.requester?.fullName || '—'}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap font-mono">{formatDate(ext.oldDeadline)}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap font-mono">{formatDate(ext.requestedDeadline)}</td>
                    <td className="px-6 py-4 text-sm max-w-[180px] truncate" title={ext.reason}>{ext.reason}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      <div>{formatDate(ext.requestedAt)}</div>
                      <div className="text-xs text-gray-400">{timeAgo(ext.requestedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EXT_STATUS[ext.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {EXT_STATUS[ext.status]?.label || ext.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/admin/extensions/${ext.id}`); }}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">Không có yêu cầu gia hạn nào</p>
            <p className="text-sm mt-1">Không tìm thấy yêu cầu gia hạn phù hợp với bộ lọc</p>
          </div>
        ) : (
          filtered.map(ext => (
            <div
              key={ext.id}
              onClick={() => navigate(`/admin/extensions/${ext.id}`)}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-2.5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-blue-700 font-medium">{ext.id}</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EXT_STATUS[ext.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                  {EXT_STATUS[ext.status]?.label || ext.status}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-900 line-clamp-2">{ext.complaint?.title || '—'}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-mono">{ext.complaint?.code || '—'}</span>
                <span>|</span>
                <span>{ext.dept?.name || '—'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-400">Người đề nghị:</span>
                  <span className="ml-1 text-gray-700">{ext.requester?.fullName || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Ngày đề nghị:</span>
                  <span className="ml-1 text-gray-700">{timeAgo(ext.requestedAt)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400">Lý do:</span>
                  <span className="ml-1 text-gray-700 line-clamp-2">{ext.reason}</span>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <ArrowRight className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary footer */}
      {filtered.length > 0 && (
        <div className="text-xs text-gray-500">
          Hiển thị {filtered.length} / {counts[tab]} yêu cầu
          {hasFilters ? ' (đã lọc)' : ''}
        </div>
      )}
    </div>
  );
}
