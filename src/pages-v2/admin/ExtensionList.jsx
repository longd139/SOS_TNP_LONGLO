// ============================================================
// EXTENSION LIST — Quản lý gia hạn (approver/leader view)
// PAGE E-02
// ============================================================
import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X, ArrowRight } from "lucide-react";
import { useMock } from "../../mock/MockContext";
import { getComplaintById, getDepartmentById, getUserById, neighborhoods, categories, departments } from "../../mock/db";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

// ---- Column definitions (used for visibility & export) ----
const ALL_COLUMNS = [
  { key: 'index', title: 'STT' },
  { key: 'code', title: 'Mã PA' },
  { key: 'title', title: 'Tiêu đề' },
  { key: 'department', title: 'Đơn vị' },
  { key: 'requester', title: 'Người đề nghị' },
  { key: 'deadline', title: 'Hạn' },
  { key: 'reason', title: 'Lý do' },
  { key: 'requestedAt', title: 'Ngày ĐN' },
  { key: 'status', title: 'Trạng thái' },
];

const EXT_STATUS = {
  PENDING:  { label: "Chờ phê duyệt",  bg: "#FEF3C7", color: "#92400E" },
  APPROVED: { label: "Đã phê duyệt",   bg: "#D1FAE5", color: "#065F46" },
  REJECTED: { label: "Đã từ chối",     bg: "#FEE2E2", color: "#991B1B" },
};

function renderStatusBadge(status) {
  const s = EXT_STATUS[status] || { label: status, bg: "#F3F4F6", color: "#6B7280" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full border" style={{ backgroundColor: s.bg, color: s.color, borderColor: s.color + '40' }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.label}
    </span>
  );
}

export default function ExtensionList() {
  const navigate = useNavigate();
  const { extensions } = useMock();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "", extensionStatus: "", neighborhoodId: "", categoryId: "", departmentId: "", urgency: "",
  });
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const initial = {};
    ALL_COLUMNS.forEach(c => { initial[c.key] = true; });
    return initial;
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const columnSettingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (columnSettingsRef.current && !columnSettingsRef.current.contains(e.target)) {
        setShowColumnSettings(false);
      }
    };
    if (showColumnSettings) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColumnSettings]);

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

  // apply filters
  const filtered = useMemo(() => {
    let list = enriched;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(e =>
        e.id.toLowerCase().includes(q) ||
        (e.complaint?.code?.toLowerCase() || "").includes(q) ||
        (e.complaint?.title?.toLowerCase() || "").includes(q) ||
        (e.requester?.fullName?.toLowerCase() || "").includes(q)
      );
    }
    if (filters.extensionStatus) list = list.filter(e => e.status === filters.extensionStatus);
    if (filters.neighborhoodId) list = list.filter(e => e.complaint?.neighborhoodId === filters.neighborhoodId);
    if (filters.categoryId) list = list.filter(e => e.complaint?.categoryId === filters.categoryId);
    if (filters.departmentId) list = list.filter(e => e.complaint?.assignedDepartmentId === filters.departmentId);
    if (filters.urgency) {
      list = list.filter(e => {
        const urg = e.complaint?.confirmedUrgency || e.complaint?.citizenUrgency;
        return urg === filters.urgency;
      });
    }
    // Sort
    list = [...list].sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
    if (sortKey) {
      const dir = sortDirection === 'asc' ? 1 : -1;
      list.sort((a, b) => {
        let va, vb;
        switch (sortKey) {
          case 'code': va = (a.complaint?.code || '').toLowerCase(); vb = (b.complaint?.code || '').toLowerCase(); break;
          case 'title': va = (a.complaint?.title || '').toLowerCase(); vb = (b.complaint?.title || '').toLowerCase(); break;
          case 'department': va = (a.dept?.name || '').toLowerCase(); vb = (b.dept?.name || '').toLowerCase(); break;
          case 'requester': va = (a.requester?.fullName || '').toLowerCase(); vb = (b.requester?.fullName || '').toLowerCase(); break;
          case 'deadline': va = a.requestedDeadline ? new Date(a.requestedDeadline).getTime() : 0; vb = b.requestedDeadline ? new Date(b.requestedDeadline).getTime() : 0; break;
          case 'reason': va = (a.reason || '').toLowerCase(); vb = (b.reason || '').toLowerCase(); break;
          case 'requestedAt': va = new Date(a.requestedAt).getTime(); vb = new Date(b.requestedAt).getTime(); break;
          case 'status': va = (a.status || '').toLowerCase(); vb = (b.status || '').toLowerCase(); break;
          default: return 0;
        }
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    }
    return list;
  }, [enriched, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleFilterChange = (k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); };
  const handleResetFilters = () => { setFilters({ search: "", extensionStatus: "", neighborhoodId: "", categoryId: "", departmentId: "", urgency: "" }); setPage(1); };
  const handleView = (ext) => navigate(`/admin/extensions/${ext.id}`);
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExportExcel = () => {
    const visibleKeys = ALL_COLUMNS.filter(c => columnVisibility[c.key]).map(c => c.key);
    const visibleTitles = ALL_COLUMNS.filter(c => columnVisibility[c.key]).map(c => c.title);
    const rows = filtered.map((ext, idx) => {
      const row = [];
      visibleKeys.forEach(key => {
        switch (key) {
          case 'index': row.push(idx + 1); break;
          case 'code': row.push(ext.complaint?.code || ''); break;
          case 'title': row.push(ext.complaint?.title || ''); break;
          case 'department': row.push(ext.dept?.name || ''); break;
          case 'requester': row.push(ext.requester?.fullName || ''); break;
          case 'deadline': row.push(ext.requestedDeadline ? dayjs(ext.requestedDeadline).format('DD/MM/YYYY HH:mm') : ''); break;
          case 'reason': row.push(ext.reason || ''); break;
          case 'requestedAt': row.push(ext.requestedAt ? dayjs(ext.requestedAt).format('DD/MM/YYYY HH:mm') : ''); break;
          case 'status': {
            const statusMap = { PENDING: 'Chờ phê duyệt', APPROVED: 'Đã phê duyệt', REJECTED: 'Đã từ chối' };
            row.push(statusMap[ext.status] || ext.status || ''); break;
          }
          default: row.push(''); break;
        }
      });
      return row;
    });

    const BOM = '﻿';
    const csvContent = [visibleTitles, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GiaHan_${dayjs().format('DD-MM-YYYY_HH-mm')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleColumn = (key) => {
    if (key === 'index') return; // không cho phép ẩn STT
    setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveFilters = filters.search || filters.extensionStatus || filters.neighborhoodId || filters.categoryId || filters.departmentId || filters.urgency;

  const renderSortIcon = (key) => {
    const isActive = sortKey === key;
    const isAsc = isActive && sortDirection === 'asc';
    const isDesc = isActive && sortDirection === 'desc';
    return (
      <svg className={`w-3 h-3 transition-transform ${isAsc ? 'text-blue-600' : isDesc ? 'text-blue-600 rotate-180' : 'text-gray-300'}`} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <line x1="6" y1="10" x2="6" y2="2" />
        <polyline points="3.5,4.5 6,2 8.5,4.5" />
      </svg>
    );
  };

  const SortHeader = ({ label, sortKey: key }) => (
    <button onClick={() => handleSort(key)} className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700 cursor-pointer select-none">
      {label}
      {renderSortIcon(key)}
    </button>
  );

  return (
    <div className="min-h-screen">
      {/* ---- Page title ---- */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý phê duyệt gia hạn</h1>
        <p className="text-xs text-slate-500 mt-1">Xét duyệt và phê duyệt đề xuất gia hạn thời gian xử lý phản ánh từ các đơn vị</p>
      </div>

      {/* ---- Filter bar + Table — unified card ---- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative" style={{ maxWidth: 280 }}>
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Tìm kiếm theo mã, tiêu đề, người đề nghị..." value={filters.search}
                onChange={e => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              {filters.search && (
                <button onClick={() => handleFilterChange("search", "")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters || hasActiveFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <Filter className="w-4 h-4" />Bộ lọc
            </button>
            {hasActiveFilters && <button onClick={handleResetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" />Xoá bộ lọc</button>}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Export Excel button */}
            <button
              onClick={handleExportExcel}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              title="Xuất file Excel"
            >
              <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Xuất Excel
            </button>

            {/* Column settings button */}
            <div className="relative" ref={columnSettingsRef}>
              <button
                onClick={() => setShowColumnSettings(!showColumnSettings)}
                className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${showColumnSettings ? 'bg-gray-100 border-gray-400 text-gray-800' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                title="Tùy chỉnh cột hiển thị"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </button>
              {showColumnSettings && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-[100] py-2 min-w-[200px]">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Cột hiển thị</div>
                  {ALL_COLUMNS.map(col => (
                    <button
                      key={col.key}
                      onClick={() => toggleColumn(col.key)}
                      disabled={col.key === 'index'}
                      className={`flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left ${col.key === 'index' ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'}`}
                    >
                      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${columnVisibility[col.key] ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                        {columnVisibility[col.key] && (
                          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1.5,6 4.5,9 10.5,3" />
                          </svg>
                        )}
                      </span>
                      {col.title}
                      {col.key === 'index' && <span className="text-[10px] text-gray-400 ml-auto">bắt buộc</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
              <select value={filters.extensionStatus} onChange={e => handleFilterChange("extensionStatus", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ phê duyệt</option>
                <option value="APPROVED">Đã phê duyệt</option>
                <option value="REJECTED">Đã từ chối</option>
              </select>
              <select value={filters.neighborhoodId} onChange={e => handleFilterChange("neighborhoodId", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả khu phố</option>
                {neighborhoods.filter(n => n.status === "ACTIVE").map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
              </select>
              <select value={filters.categoryId} onChange={e => handleFilterChange("categoryId", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả danh mục</option>
                {categories.filter(c => c.status === "ACTIVE").map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={filters.departmentId} onChange={e => handleFilterChange("departmentId", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả đơn vị</option>
                {departments.filter(d => d.status === "ACTIVE").map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={filters.urgency} onChange={e => handleFilterChange("urgency", e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Tất cả mức độ</option>
                <option value="URGENT">Khẩn cấp</option>
                <option value="NORMAL">Thông thường</option>
              </select>
            </div>
          )}
        </div>

        {/* ---- Table ---- */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columnVisibility.index && <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>}
                {columnVisibility.code && <th className="px-3 py-2.5 text-left"><SortHeader label="Mã PA" sortKey="code" /></th>}
                {columnVisibility.title && <th className="px-3 py-2.5 text-left"><SortHeader label="Tiêu đề" sortKey="title" /></th>}
                {columnVisibility.department && <th className="px-3 py-2.5 text-left"><SortHeader label="Đơn vị" sortKey="department" /></th>}
                {columnVisibility.requester && <th className="px-3 py-2.5 text-left"><SortHeader label="Người đề nghị" sortKey="requester" /></th>}
                {columnVisibility.deadline && <th className="px-3 py-2.5 text-left"><SortHeader label="Hạn" sortKey="deadline" /></th>}
                {columnVisibility.reason && <th className="px-3 py-2.5 text-left"><SortHeader label="Lý do" sortKey="reason" /></th>}
                {columnVisibility.requestedAt && <th className="px-3 py-2.5 text-left"><SortHeader label="Ngày ĐN" sortKey="requestedAt" /></th>}
                {columnVisibility.status && <th className="px-3 py-2.5 text-left"><SortHeader label="Trạng thái" sortKey="status" /></th>}
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.length === 0 ? (
                <tr><td colSpan={1 + Object.values(columnVisibility).filter(Boolean).length} className="px-6 py-8 text-center text-gray-500">{hasActiveFilters ? "Không tìm thấy yêu cầu gia hạn phù hợp với bộ lọc" : "Không có yêu cầu gia hạn nào"}</td></tr>
              ) : paginated.map((ext, idx) => (
                <tr key={ext.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(ext)}>
                  {columnVisibility.index && <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium text-gray-900">#{((safePage - 1) * PAGE_SIZE) + idx + 1}</td>}
                  {columnVisibility.code && <td className="px-3 py-2.5 whitespace-nowrap text-sm font-mono text-blue-700">{ext.complaint?.code || "—"}</td>}
                  {columnVisibility.title && <td className="px-3 py-2.5 text-sm text-gray-900 max-w-[160px] truncate" title={ext.complaint?.title}>{ext.complaint?.title || "—"}</td>}
                  {columnVisibility.department && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-600">{ext.dept?.name || "—"}</td>}
                  {columnVisibility.requester && <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-600">{ext.requester?.fullName || "—"}</td>}
                  {columnVisibility.deadline && <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600">
                    <span className="text-gray-400 line-through">{ext.oldDeadline ? dayjs(ext.oldDeadline).format("DD/MM") : "—"}</span>
                    <span className="mx-1 text-gray-300">→</span>
                    <span className="font-medium text-gray-700">{ext.requestedDeadline ? dayjs(ext.requestedDeadline).format("DD/MM HH:mm") : "—"}</span>
                  </td>}
                  {columnVisibility.reason && <td className="px-3 py-2.5 text-sm text-gray-600 max-w-[120px] truncate" title={ext.reason}>{ext.reason}</td>}
                  {columnVisibility.requestedAt && <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600">{dayjs(ext.requestedAt).format("DD/MM HH:mm")}</td>}
                  {columnVisibility.status && <td className="px-3 py-2.5 whitespace-nowrap">{renderStatusBadge(ext.status)}</td>}
                  <td className="px-3 py-2.5 whitespace-nowrap text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); handleView(ext); }} className="border border-gray-300 text-gray-700 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 text-xs font-medium">Chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* ---- Pagination ---- */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">Hiển thị <span className="font-medium">{((safePage - 1) * PAGE_SIZE) + 1}</span> đến <span className="font-medium">{Math.min(safePage * PAGE_SIZE, filtered.length)}</span> trong <span className="font-medium">{filtered.length}</span> kết quả</p>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let num; const cp = safePage;
                  if (totalPages <= 5) num = i + 1;
                  else if (cp <= 3) num = i + 1;
                  else if (cp >= totalPages - 2) num = totalPages - 4 + i;
                  else num = cp - 2 + i;
                  return <button key={num} onClick={() => setPage(num)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${num === cp ? "z-10 bg-blue-50 border-blue-500 text-blue-600" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"}`}>{num}</button>;
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* ---- Mobile cards ---- */}
      <div className="md:hidden space-y-3 mt-4">
        {paginated.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">{hasActiveFilters ? "Không tìm thấy yêu cầu gia hạn" : "Không có yêu cầu gia hạn nào"}</div>
        ) : paginated.map(ext => (
          <div key={ext.id} onClick={() => handleView(ext)} className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 font-mono">{ext.id}</span>
              {renderStatusBadge(ext.status)}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{ext.complaint?.title || "—"}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-2">
              <span className="font-mono">{ext.complaint?.code || "—"}</span><span>|</span>
              <span>{ext.dept?.name || "—"}</span><span>|</span>
              <span>{dayjs(ext.requestedAt).format("DD/MM/YYYY")}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-xs text-gray-500 mb-2">
              <div><span className="text-gray-400">Người đề nghị: </span><span className="text-gray-700">{ext.requester?.fullName || "—"}</span></div>
              <div><span className="text-gray-400">Hạn đề nghị: </span><span className="text-gray-700">{ext.requestedDeadline ? dayjs(ext.requestedDeadline).format("DD/MM/YYYY") : "—"}</span></div>
            </div>
            <p className="text-xs text-gray-400 line-clamp-2 mb-2">Lý do: {ext.reason}</p>
            <div className="flex items-center justify-end">
              <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
          </div>
        ))}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Trước</button>
            <span className="text-sm text-gray-500">Trang {safePage} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Sau</button>
          </div>
        )}
      </div>
    </div>
  );
}
