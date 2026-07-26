// ============================================================
// COMPLAINT LIST — Quản lý phản ánh (admin view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, ChevronDown, ChevronUp, MoreHorizontal,
  Plus, Download, RefreshCw, CheckSquare, X,
  Inbox, ChevronLeft, ChevronRight, ClipboardList,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getUserById, getTimeRemaining, getSlaLabel,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

const PAGE_SIZE = 10;

const TABS = [
  { key: 'ALL',             label: 'Tất cả',            filter: () => true },
  { key: 'NEW',             label: 'Mới tiếp nhận',     filter: (c) => c.status === 'NEW' || c.status === 'PENDING_RECEPTION' },
  { key: 'PENDING_ASSIGN',  label: 'Chờ phân công',     filter: (c) => c.status === 'RECEIVED' },
  { key: 'IN_PROGRESS',     label: 'Đang xử lý',        filter: (c) => c.status === 'ASSIGNED' || c.status === 'IN_PROGRESS' },
  { key: 'EXTENSION',       label: 'Chờ duyệt gia hạn', filter: (c) => c.status === 'EXTENSION_PENDING' },
  { key: 'NEAR_DUE',        label: 'Sắp quá hạn',       filter: (c) => c.slaStatus === 'NEAR_DUE' },
  { key: 'OVERDUE',         label: 'Quá hạn',           filter: (c) => c.slaStatus === 'OVERDUE' },
  { key: 'COMPLETED',       label: 'Hoàn thành',        filter: (c) => c.status === 'COMPLETED' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'NEW', label: 'Mới gửi' },
  { value: 'PENDING_RECEPTION', label: 'Chờ tiếp nhận' },
  { value: 'RECEIVED', label: 'Đã tiếp nhận' },
  { value: 'ASSIGNED', label: 'Đã phân công' },
  { value: 'IN_PROGRESS', label: 'Đang xử lý' },
  { value: 'EXTENSION_PENDING', label: 'Chờ duyệt gia hạn' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'REJECTED', label: 'Từ chối' },
];

const SLA_OPTIONS = [
  { value: '', label: 'Tất cả SLA' },
  { value: 'ON_TIME', label: 'Còn hạn' },
  { value: 'NEAR_DUE', label: 'Sắp đến hạn' },
  { value: 'OVERDUE', label: 'Quá hạn' },
  { value: 'COMPLETED_ON_TIME', label: 'Hoàn thành đúng hạn' },
  { value: 'COMPLETED_LATE', label: 'Hoàn thành trễ hạn' },
  { value: 'NOT_APPLICABLE', label: 'Chưa áp dụng' },
];

const URGENCY_OPTIONS = [
  { value: '', label: 'Tất cả mức độ' },
  { value: 'URGENT', label: 'Khẩn cấp' },
  { value: 'NORMAL', label: 'Thông thường' },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function getStatusActions(status) {
  const always = [];
  switch (status) {
    case 'NEW':
    case 'PENDING_RECEPTION':
      return ['receive', 'detail'];
    case 'RECEIVED':
      return ['assign', 'detail'];
    case 'ASSIGNED':
    case 'IN_PROGRESS':
      return ['update', 'extend', 'complete', 'detail'];
    case 'EXTENSION_PENDING':
      return ['update', 'complete', 'detail'];
    case 'COMPLETED':
    case 'REJECTED':
      return ['detail'];
    default:
      return ['detail'];
  }
}

const ACTION_META = {
  detail:  { label: 'Xem chi tiết',  icon: null,            className: 'text-blue-600 hover:bg-blue-50' },
  receive: { label: 'Tiếp nhận',     icon: null,            className: 'text-green-600 hover:bg-green-50' },
  assign:  { label: 'Phân công',     icon: null,            className: 'text-purple-600 hover:bg-purple-50' },
  update:  { label: 'Cập nhật',      icon: null,            className: 'text-orange-600 hover:bg-orange-50' },
  extend:  { label: 'Đề nghị gia hạn', icon: null,          className: 'text-yellow-600 hover:bg-yellow-50' },
  complete:{ label: 'Hoàn thành',    icon: null,            className: 'text-green-600 hover:bg-green-50' },
};

// ponytail: manual pagination, built-in pagination lib overkill for 55 items
function Pagination({ current, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, current - 2);
  const end = Math.min(totalPages, current + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between pt-3">
      <span className="text-sm text-gray-500">
        Trang {current} / {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && <><button onClick={() => onChange(1)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">1</button><span className="px-1 text-gray-400">...</span></>}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`px-3 py-1 text-sm rounded-lg border ${
              p === current
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <><span className="px-1 text-gray-400">...</span><button onClick={() => onChange(totalPages)} className="px-3 py-1 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">{totalPages}</button></>}
        <button
          disabled={current === totalPages}
          onClick={() => onChange(current + 1)}
          className="p-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function ComplaintList() {
  const navigate = useNavigate();
  const {
    getFilteredComplaints, filters, setFilters,
    neighborhoods, categories, departments,
  } = useMock();

  const [tab, setTab] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [showBulkMenu, setShowBulkMenu] = useState(false);

  // compute counts for each tab from base filtered list
  const baseList = useMemo(() => getFilteredComplaints(), [getFilteredComplaints]);
  const tabCounts = useMemo(() => {
    const counts = {};
    TABS.forEach(t => { counts[t.key] = baseList.filter(t.filter).length; });
    return counts;
  }, [baseList]);

  // apply tab filter
  const tabFiltered = useMemo(() => {
    const t = TABS.find(t => t.key === tab);
    return t ? baseList.filter(t.filter) : baseList;
  }, [baseList, tab]);

  // paginate
  const totalPages = Math.max(1, Math.ceil(tabFiltered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return tabFiltered.slice(start, start + PAGE_SIZE);
  }, [tabFiltered, safePage]);

  // handle tab change — reset page
  const handleTabChange = (key) => {
    setTab(key);
    setPage(1);
    setSelected(new Set());
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(new Set(paginated.map(c => c.id)));
    } else {
      setSelected(new Set());
    }
  };

  const handleSelectOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const allChecked = paginated.length > 0 && paginated.every(c => selected.has(c.id));
  const someChecked = selected.size > 0;

  const hasAdvancedFilters = filters.search || filters.status || filters.slaStatus ||
    filters.urgency || filters.categoryId || filters.neighborhoodId || filters.departmentId ||
    filters.dateFrom || filters.dateTo;

  const clearFilters = () => {
    setFilters({ search: '', status: '', slaStatus: '', urgency: '', categoryId: '', neighborhoodId: '', departmentId: '', dateFrom: '', dateTo: '' });
  };

  const handleRowAction = (e, action, complaint) => {
    e.stopPropagation();
    if (action === 'detail') {
      navigate(`/admin/complaints/${complaint.id}`);
    }
    // ponytail: other actions show placeholder toast for now; wire to real dispatch when needed
  };

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý phản ánh</h1>
          <p className="text-sm text-gray-600 mt-1">Tổng cộng: {tabCounts.ALL} phản ánh</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm phản ánh
        </button>
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

      {/* Search + filter bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã PA, tiêu đề, địa chỉ..."
            value={filters.search}
            onChange={e => { setFilters({ ...filters, search: e.target.value }); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg border transition-colors ${
            showFilters || hasAdvancedFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Bộ lọc nâng cao
          {hasAdvancedFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => { /* data refresh handled by mock context */ }}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
          title="Làm mới dữ liệu"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        </div>
      </div>

      {/* Advanced filter panel */}
      {showFilters && (
        <div className="p-4 bg-white border border-gray-200 rounded-lg space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái</label>
              <select
                value={filters.status}
                onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Trạng thái SLA</label>
              <select
                value={filters.slaStatus || ''}
                onChange={e => { setFilters({ ...filters, slaStatus: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SLA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mức độ</label>
              <select
                value={filters.urgency || ''}
                onChange={e => { setFilters({ ...filters, urgency: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {URGENCY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Danh mục</label>
              <select
                value={filters.categoryId || ''}
                onChange={e => { setFilters({ ...filters, categoryId: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.filter(c => c.status === 'ACTIVE').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Khu phố</label>
              <select
                value={filters.neighborhoodId || ''}
                onChange={e => { setFilters({ ...filters, neighborhoodId: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả khu phố</option>
                {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Đơn vị xử lý</label>
              <select
                value={filters.departmentId || ''}
                onChange={e => { setFilters({ ...filters, departmentId: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tất cả đơn vị</option>
                {departments.filter(d => d.status === 'ACTIVE').map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Từ ngày</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={e => { setFilters({ ...filters, dateFrom: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Đến ngày</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={e => { setFilters({ ...filters, dateTo: e.target.value }); setPage(1); }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {hasAdvancedFilters && (
            <div className="flex justify-end pt-1">
              <button
                onClick={() => { clearFilters(); setPage(1); }}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
              >
                <X className="w-3 h-3" />
                Xoá bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bulk actions bar */}
      {someChecked && (
        <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border border-blue-200 rounded-lg">
          <CheckSquare className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Đã chọn {selected.size} phản ánh
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowBulkMenu(!showBulkMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Phân công đơn vị
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Chuyển trạng thái
            </button>
            <button
              onClick={() => {}}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Download className="w-3 h-3" />
              Xuất danh sách
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                {[
                  'Mã PA', 'Tiêu đề', 'Loại', 'Khu phố', 'Mức độ',
                  'Trạng thái', 'SLA', 'Đơn vị', 'Cán bộ', 'Hạn xử lý', 'Ngày cập nhật', 'Thao tác',
                ].map(label => (
                  <th key={label} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-16 text-center text-gray-500">
                    <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium">Không có phản ánh nào</p>
                    <p className="text-sm mt-1">Không tìm thấy phản ánh phù hợp với bộ lọc</p>
                  </td>
                </tr>
              ) : (
                paginated.map(c => {
                  const cat = getCategoryById(c.categoryId);
                  const nb = getNeighborhoodById(c.neighborhoodId);
                  const dept = c.assignedDepartmentId ? getDepartmentById(c.assignedDepartmentId) : null;
                  const officer = c.assignedOfficerId ? getUserById(c.assignedOfficerId) : null;
                  const urgency = c.confirmedUrgency || c.citizenUrgency;
                  const actions = getStatusActions(c.status);
                  const isChecked = selected.has(c.id);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/admin/complaints/${c.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(c.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-blue-700 whitespace-nowrap">{c.code}</td>
                      <td className="px-6 py-4 text-sm max-w-[180px] truncate" title={c.title}>
                        {c.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{cat?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{nb?.name || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><UrgencyBadge urgency={urgency} /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={c.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap"><SlaBadge slaStatus={c.slaStatus} /></td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{dept?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{officer?.fullName || '—'}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <div className="text-gray-700">{c.currentDeadline ? formatDate(c.currentDeadline) : '—'}</div>
                        {c.currentDeadline && (
                          <div className="text-xs text-gray-400">{getTimeRemaining(c.currentDeadline)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(c.updatedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-0.5">
                          {actions.map(a => (
                            <button
                              key={a}
                              onClick={e => handleRowAction(e, a, c)}
                              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${ACTION_META[a]?.className || ''}`}
                              title={ACTION_META[a]?.label}
                            >
                              {ACTION_META[a]?.label}
                            </button>
                          ))}
                        </div>
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
            <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-base font-medium">Không có phản ánh nào</p>
            <p className="text-sm mt-1">Không tìm thấy phản ánh phù hợp với bộ lọc</p>
          </div>
        ) : (
          paginated.map(c => {
            const cat = getCategoryById(c.categoryId);
            const nb = getNeighborhoodById(c.neighborhoodId);
            const dept = c.assignedDepartmentId ? getDepartmentById(c.assignedDepartmentId) : null;
            const officer = c.assignedOfficerId ? getUserById(c.assignedOfficerId) : null;
            const urgency = c.confirmedUrgency || c.citizenUrgency;
            const actions = getStatusActions(c.status);
            const isChecked = selected.has(c.id);

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/admin/complaints/${c.id}`)}
                className={`bg-white border rounded-lg p-4 space-y-2.5 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all ${isChecked ? 'border-blue-400 ring-1 ring-blue-200' : 'border-gray-200'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono text-blue-700 font-medium">{c.code}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.status} />
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleSelectOne(c.id)}
                      onClick={e => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 line-clamp-2">{c.title}</div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <UrgencyBadge urgency={urgency} />
                  <SlaBadge slaStatus={c.slaStatus} />
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600">{cat?.name || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div>
                    <span className="text-gray-400">Khu phố:</span>
                    <span className="ml-1 text-gray-700">{nb?.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Đơn vị:</span>
                    <span className="ml-1 text-gray-700">{dept?.name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Cán bộ:</span>
                    <span className="ml-1 text-gray-700">{officer?.fullName || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Hạn xử lý:</span>
                    <span className="ml-1 text-gray-700">
                      {c.currentDeadline ? getTimeRemaining(c.currentDeadline) : '—'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap pt-1" onClick={e => e.stopPropagation()}>
                  {actions.map(a => (
                    <button
                      key={a}
                      onClick={e => handleRowAction(e, a, c)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${ACTION_META[a]?.className || ''}`}
                    >
                      {ACTION_META[a]?.label}
                    </button>
                  ))}
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

      {/* Summary footer */}
      <div className="text-xs text-gray-500">
        Hiển thị {paginated.length} / {tabFiltered.length} phản ánh
        {hasAdvancedFilters ? ' (đã lọc)' : ''}
      </div>
    </div>
  );
}
