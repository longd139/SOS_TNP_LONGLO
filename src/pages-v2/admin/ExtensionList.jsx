// ============================================================
// EXTENSION LIST — Quản lý gia hạn (approver/leader view)
// PAGE E-02
// ============================================================
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, ChevronDown, ChevronUp, X, ArrowRight } from "lucide-react";
import { useMock } from "../../mock/MockContext";
import { getComplaintById, getDepartmentById, getUserById, neighborhoods, categories, departments } from "../../mock/db";
import dayjs from "dayjs";

const PAGE_SIZE = 10;

const EXT_STATUS = {
  PENDING:  { label: "Chờ phê duyệt",  bg: "#FEF3C7", color: "#92400E" },
  APPROVED: { label: "Đã phê duyệt",   bg: "#D1FAE5", color: "#065F46" },
  REJECTED: { label: "Đã từ chối",     bg: "#FEE2E2", color: "#991B1B" },
};

const TABS = [
  { key: "PENDING",  label: "Chờ phê duyệt gia hạn" },
  { key: "APPROVED", label: "Đã phê duyệt (Đã gia hạn)" },
  { key: "REJECTED", label: "Đã từ chối gia hạn" },
];

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
  const [activeTab, setActiveTab] = useState("PENDING");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "", extensionStatus: "", neighborhoodId: "", categoryId: "", departmentId: "", urgency: "",
  });

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
    let list = enriched.filter(e => e.status === activeTab);
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
    return list.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  }, [enriched, activeTab, filters]);

  const tabCounts = useMemo(() => {
    const c = {};
    TABS.forEach(t => { c[t.key] = enriched.filter(e => e.status === t.key).length; });
    return c;
  }, [enriched]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = useMemo(() => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE), [filtered, safePage]);

  const handleTabChange = (key) => { setActiveTab(key); setPage(1); };
  const handleFilterChange = (k, v) => { setFilters(p => ({ ...p, [k]: v })); setPage(1); };
  const handleResetFilters = () => { setFilters({ search: "", extensionStatus: "", neighborhoodId: "", categoryId: "", departmentId: "", urgency: "" }); setPage(1); };
  const handleView = (ext) => navigate(`/admin/extensions/${ext.id}`);

  const hasActiveFilters = filters.search || filters.extensionStatus || filters.neighborhoodId || filters.categoryId || filters.departmentId || filters.urgency;

  return (
    <div className="min-h-screen">
      {/* ---- Page title ---- */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Quản lý phê duyệt gia hạn</h1>
        <p className="text-xs text-slate-500 mt-1">Xét duyệt và phê duyệt đề xuất gia hạn thời gian xử lý phản ánh từ các đơn vị</p>
      </div>

      {/* ---- Quick tabs ---- */}
      <div className="flex border-b border-gray-200 overflow-x-auto mb-4">
        {TABS.map(t => (
          <button key={t.key} onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === t.key ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
            {t.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${activeTab === t.key ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>{tabCounts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* ---- Filter bar ---- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm theo mã, tiêu đề, người đề nghị..." value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10" />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${showFilters ? "bg-blue-50 border-blue-300 text-blue-700" : "text-gray-700"}`}>
            <Filter className="w-4 h-4" />Bộ lọc{showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {hasActiveFilters && <button onClick={handleResetFilters} className="inline-flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"><X className="w-4 h-4" />Xoá bộ lọc</button>}
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

      {/* ---- Count bar ---- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
        <h3 className="font-semibold text-gray-900">Danh sách yêu cầu gia hạn ({filtered.length})</h3>
      </div>

      {/* ---- Table ---- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Mã PA</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Tiêu đề</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Đơn vị</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Người đề nghị</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Hạn</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Lý do</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Ngày ĐN</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Trạng thái</th>
                <th className="px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginated.length === 0 ? (
                <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-500">{hasActiveFilters ? "Không tìm thấy yêu cầu gia hạn phù hợp với bộ lọc" : "Không có yêu cầu gia hạn nào"}</td></tr>
              ) : paginated.map(ext => (
                <tr key={ext.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleView(ext)}>
                  <td className="px-3 py-2.5 whitespace-nowrap text-sm font-mono text-blue-700">{ext.complaint?.code || "—"}</td>
                  <td className="px-3 py-2.5 text-sm text-gray-900 max-w-[160px] truncate" title={ext.complaint?.title}>{ext.complaint?.title || "—"}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-600">{ext.dept?.name || "—"}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-600">{ext.requester?.fullName || "—"}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600">
                    <span className="text-gray-400 line-through">{ext.oldDeadline ? dayjs(ext.oldDeadline).format("DD/MM") : "—"}</span>
                    <span className="mx-1 text-gray-300">→</span>
                    <span className="font-medium text-gray-700">{ext.requestedDeadline ? dayjs(ext.requestedDeadline).format("DD/MM HH:mm") : "—"}</span>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-gray-600 max-w-[120px] truncate" title={ext.reason}>{ext.reason}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-600">{dayjs(ext.requestedAt).format("DD/MM HH:mm")}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{renderStatusBadge(ext.status)}</td>
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
