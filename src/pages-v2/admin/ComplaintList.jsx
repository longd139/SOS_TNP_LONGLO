// ============================================================
// COMPLAINT LIST — Bản sao y chang ReportList.jsx gốc
// ============================================================
import { useState, useMemo, useEffect } from "react";
import BaseTable from "../../components/base/BaseTable";
import { useMock } from "../../mock/MockContext";
import {
  getCategoryById, getNeighborhoodById, getUserById, getTimeRemaining,
  categories, neighborhoods, departments, users,
} from "../../mock/db";
import { StatusBadge, UrgencyBadge } from "../../mock/components/Badges";
import dayjs from "dayjs";

// ---- Quick tabs (giống pattern MyComplaints) ----
const TABS = [
  { key: 'ALL',              label: 'Tất cả phản ánh',             filter: () => true },
  { key: 'NEW',              label: 'Chờ tiếp nhận (Mới gửi)',     filter: (c) => c.status === 'NEW' || c.status === 'PENDING_RECEPTION' },
  { key: 'AWAITING_ASSIGN',  label: 'Chờ phân công đơn vị',      filter: (c) => c.status === 'RECEIVED' },
  { key: 'IN_PROGRESS',      label: 'Đang xử lý',                 filter: (c) => ['ASSIGNED','IN_PROGRESS'].includes(c.status) },
  { key: 'EXT_PENDING',      label: 'Chờ duyệt gia hạn',          filter: (c) => c.status === 'EXTENSION_PENDING' },
  { key: 'NEAR_DUE',         label: 'Sắp quá hạn',                filter: (c) => c.slaStatus === 'NEAR_DUE' },
  { key: 'OVERDUE',          label: 'Quá hạn xử lý',              filter: (c) => c.slaStatus === 'OVERDUE' },
  { key: 'COMPLETED',        label: 'Hoàn thành giải quyết',      filter: (c) => c.status === 'COMPLETED' },
];

// ---- Badge renderers (shared from Badges.jsx) ----
const renderCategoryBadge = (catId) => {
  const cat = getCategoryById(catId);
  if (!cat) return <span className="text-sm text-gray-400">-</span>;
  return <span className="text-sm text-gray-900">{cat.name}</span>;
};
// ---- COMPLAINT DETAIL MODAL (bản sao ReportDetailModal gốc) ----
function ComplaintDetailModal({ isOpen, onClose, complaint, mode, onModeChange, onStatusUpdated }) {
  const mock = useMock();
  const complaintId = complaint?.id;
  const complaintStatus = complaint?.status;
  const [nextStatus, setNextStatus] = useState(complaintStatus || 'NEW');
  const [responseNote, setResponseNote] = useState('');

  useEffect(() => {
    if (!complaintId) return;
    setNextStatus(complaintStatus);
    setResponseNote('');
  }, [complaintId, complaintStatus]);

  if (!isOpen || !complaint) return null;

  const isEditMode = mode === "edit";
  const history = mock.getHistoryByComplaint(complaint.id) || [];
  const attachments = mock.getAttachmentsByComplaint(complaint.id) || [];
  const hasImages = complaint.hasImages && attachments.length > 0;
  const handleEditMode = () => { if (onModeChange) onModeChange("edit"); };
  const handleUpdateStatus = () => {
    const updatedAt = new Date().toISOString();
    const isCompleted = nextStatus === 'COMPLETED';
    mock.updateComplaint(complaint.id, {
      status: nextStatus,
      updatedAt,
      completedAt: isCompleted ? updatedAt : null,
      progressPercent: isCompleted ? 100 : nextStatus === 'IN_PROGRESS' ? 50 : 0,
    });
    mock.addHistory({
      complaintId: complaint.id,
      actionType: 'STATUS_CHANGED',
      performedBy: 'USR-030',
      performedRole: 'APPROVER',
      performedAt: updatedAt,
      oldValue: { status: complaint.status },
      newValue: { status: nextStatus },
      internalNote: responseNote.trim() || null,
      publicNote: responseNote.trim() || 'Trạng thái phản ánh đã được cập nhật.',
      isPublic: true,
    });
    if (onStatusUpdated) onStatusUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 z-0 bg-gray-900/40" onClick={onClose} />
        <div className="relative z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10 rounded-t-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? "Cập nhật phản ánh" : "Chi tiết phản ánh"}: #{complaint.code}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditMode ? "Cập nhật trạng thái phản ánh" : "Xem chi tiết phản ánh"}
            </p>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Tiêu đề + badges */}
            <div className="flex-1">
              <p className="text-lg mb-2 font-medium break-words">{complaint.title}</p>
              <div className="flex items-center gap-2 mb-4">
                <StatusBadge status={complaint.status} />
                <UrgencyBadge urgency={complaint.confirmedUrgency || complaint.citizenUrgency} />
                <span className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full" style={{ backgroundColor: '#E0E7FF', color: '#3730A3' }}>
                  {getCategoryById(complaint.categoryId)?.name || '—'}
                </span>
              </div>
            </div>

            {/* Ngày gửi + Người gửi + SĐT */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span className="text-sm text-gray-600">Ngày gửi:</span>
                <span className="text-sm text-gray-600">{dayjs(complaint.createdAt).format('DD/MM/YYYY HH:mm')}</span>
              </div>
              <div className="flex items-start gap-2 min-w-0 flex-shrink">
                <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="text-sm text-gray-600 flex-shrink-0">Người gửi: {getUserById(complaint.citizenId)?.fullName || 'Ẩn danh'}</span>
              </div>
              <div className="flex items-start gap-2 min-w-0 flex-shrink">
                <svg className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="text-sm text-gray-600 flex-shrink-0">Số điện thoại: {getUserById(complaint.citizenId)?.phone || '—'}</span>
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">Mô tả chi tiết</h4>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{complaint.description || "Không có mô tả"}</p>
              </div>
            </div>

            {/* Vị trí */}
            <div className="border-b pb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Vị trí
              </h4>
              <p className="text-sm text-gray-700 bg-gray-100 p-3.5 rounded-md break-words">
                {complaint.address || "Không có thông tin vị trí"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Khu phố: {getNeighborhoodById(complaint.neighborhoodId)?.name || '—'}</span>
                <span>Lat: {complaint.latitude?.toFixed(5) || '—'}</span>
                <span>Lng: {complaint.longitude?.toFixed(5) || '—'}</span>
              </div>
            </div>

            {/* Hình ảnh / Video đính kèm */}
            {hasImages && (
              <div className="border-b pb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Hình ảnh đính kèm ({attachments.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {attachments.map((att, i) => (
                    <div key={att.id} className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                      <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="absolute bottom-1 right-1 text-[10px] text-gray-500 bg-white/80 px-1 rounded">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Thời hạn xử lý — V2 */}
            {complaint.originalDeadline && (
              <div className="border-b pb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Thời hạn xử lý
                </h4>
                <div className="bg-gray-50 p-3 rounded-md space-y-1 text-sm">
                  <p>Hạn xử lý: <strong>{dayjs(complaint.currentDeadline || complaint.originalDeadline).format('DD/MM/YYYY HH:mm')}</strong></p>
                  <p className={complaint.slaStatus === 'OVERDUE' ? 'text-red-600 font-medium' : complaint.slaStatus === 'NEAR_DUE' ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
                    {getTimeRemaining(complaint.currentDeadline || complaint.originalDeadline)}
                  </p>
                  {complaint.extensionCount > 0 && <p className="text-gray-500">Đã gia hạn: {complaint.extensionCount} lần</p>}
                </div>
              </div>
            )}

            {/* VIEW MODE */}
            {!isEditMode && (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">Trạng thái hiện tại</h4>
                    <button type="button" hidden onClick={handleEditMode} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium">
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Cập nhật trạng thái
                    </button>
                  </div>
                  <p><StatusBadge status={complaint.status} /></p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span className="text-sm font-semibold text-gray-900 leading-none">Lịch sử cập nhật ({history.length})</span>
                  </div>
                  {history.length > 0 ? (
                    <div className="relative pl-8">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      {history.map((item, index) => {
                        const isLatest = index === 0;
                        return (
                          <div key={item.id} className="mb-2 relative">
                            <span className={`absolute -left-6 top-1.5 w-4 h-4 rounded-full border-2 ${isLatest ? "bg-blue-600 border-blue-600" : "bg-white border-gray-400"}`}></span>
                            <div className="p-2 bg-gray-50 ml-2 rounded-md">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="px-3 py-1.5 text-sm font-medium rounded-full" style={item.actionType === 'COMPLETED' ? { backgroundColor: '#D1FAE5', color: '#065F46' } : item.actionType === 'COMPLAINT_RECEIVED' || item.actionType === 'STATUS_CHANGED' ? { backgroundColor: '#DBEAFE', color: '#1E40AF' } : { backgroundColor: '#F3F4F6', color: '#6B7280' }}>
                                  {item.actionType === 'COMPLAINT_CREATED' ? 'Đã gửi' : item.actionType === 'COMPLAINT_RECEIVED' ? 'Đã tiếp nhận' : item.actionType === 'STATUS_CHANGED' ? 'Đang xử lý' : item.actionType === 'COMPLETED' ? 'Đã giải quyết' : item.actionType === 'REJECTED' ? 'Từ chối' : item.actionType}
                                </span>
                                <span className="text-xs text-gray-500">{dayjs(item.performedAt).format('DD/MM/YYYY HH:mm')}</span>
                              </div>
                              {(item.internalNote || item.publicNote) && (
                                <p className="text-sm text-gray-700 break-words">
                                  {item.publicNote || item.internalNote}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Không có lịch sử cập nhật</div>
                  )}
                </div>
              </>
            )}

            {/* EDIT MODE */}
            {isEditMode && (
              <>
                <div className="mt-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 required-label">Cập nhật trạng thái</h4>
                  <div className="space-y-3">
                    <select value={nextStatus} onChange={(event) => setNextStatus(event.target.value)} className="w-full px-3 py-2.5 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" style={{ border: 'none' }}>
                      <option value="NEW">Đã gửi</option>
                      <option value="IN_PROGRESS">Đang xử lý</option>
                      <option value="COMPLETED">Đã giải quyết</option>
                    </select>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung phản hồi</label>
                      <textarea
                        value={responseNote}
                        onChange={(event) => setResponseNote(event.target.value)}
                        placeholder="Nhập nội dung phản hồi cho người dân..."
                        rows="3"
                        className="w-full px-3 py-2 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none break-words"
                        style={{ minHeight: '72px', wordWrap: 'break-word' }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Lịch sử trạng thái</h4>
                  {history.length > 0 ? (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <div key={item.id} className="p-3 bg-gray-50 rounded-md space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <span>{dayjs(item.performedAt).format('DD/MM/YYYY HH:mm')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            <span>{item.performedRole === 'CITIZEN' ? 'Người dân' : item.performedRole === 'RECEPTION_OFFICER' ? 'Cán bộ tiếp nhận' : item.performedRole === 'PROCESSING_OFFICER' ? 'Cán bộ xử lý' : item.performedRole}</span>
                          </div>
                          {(item.internalNote || item.publicNote) && (
                            <div className="flex items-start gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                              <span className="break-words">{item.publicNote || item.internalNote}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">Không có lịch sử cập nhật</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 rounded-b-xl">
            {isEditMode ? (
              <>
                <button onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">Hủy</button>
                <button onClick={handleUpdateStatus} className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">Lưu và gửi thông báo</button>
              </>
            ) : (
              <button onClick={onClose} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">Đóng</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- MAIN COMPONENT (bản sao ReportList) ----
export default function ComplaintList() {
  const mock = useMock();
  const complaints = mock.complaints;

  const [modalMode, setModalMode] = useState("view");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [tab, setTab] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ title: '', description: '', categoryId: '', neighborhoodId: '', urgency: 'NORMAL', citizenName: '', citizenPhone: '', address: '' });

  // ---- filters (khớp cấu trúc gốc) ----
  const [filters, setFilters] = useState({
    status: "", categoryId: "", neighborhoodId: "", urgency: "", search: "", sortTime: "desc", slaStatus: "", departmentId: "",
    officerId: "", dateFrom: "", dateTo: "", deadlineFrom: "", deadlineTo: "", hasExtension: "", hasEvidence: "", hasLocation: "",
  });

  // ---- Filter data (từ mock DB) ----
  const filtered = useMemo(() => {
    let list = complaints;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || (c.address && c.address.toLowerCase().includes(q)));
    }
    if (filters.status) list = list.filter(c => c.status === filters.status);
    if (filters.categoryId) list = list.filter(c => c.categoryId === filters.categoryId);
    if (filters.neighborhoodId) list = list.filter(c => c.neighborhoodId === filters.neighborhoodId);
    if (filters.urgency) list = list.filter(c => (c.confirmedUrgency || c.citizenUrgency) === filters.urgency);
    if (filters.slaStatus) list = list.filter(c => c.slaStatus === filters.slaStatus);
    if (filters.departmentId) list = list.filter(c => c.assignedDepartmentId === filters.departmentId);
    if (filters.officerId) list = list.filter(c => c.assignedOfficerId === filters.officerId);
    if (filters.dateFrom) list = list.filter(c => new Date(c.createdAt) >= new Date(filters.dateFrom));
    if (filters.dateTo) list = list.filter(c => new Date(c.createdAt) <= new Date(filters.dateTo + 'T23:59:59'));
    if (filters.deadlineFrom) list = list.filter(c => c.currentDeadline && new Date(c.currentDeadline) >= new Date(filters.deadlineFrom));
    if (filters.deadlineTo) list = list.filter(c => c.currentDeadline && new Date(c.currentDeadline) <= new Date(filters.deadlineTo + 'T23:59:59'));
    if (filters.hasExtension === 'yes') list = list.filter(c => c.extensionCount > 0);
    if (filters.hasExtension === 'no') list = list.filter(c => !c.extensionCount || c.extensionCount === 0);
    if (filters.hasEvidence === 'yes') list = list.filter(c => c.hasImages);
    if (filters.hasEvidence === 'no') list = list.filter(c => !c.hasImages);
    if (filters.hasLocation === 'yes') list = list.filter(c => c.hasLocation);
    if (filters.hasLocation === 'no') list = list.filter(c => !c.hasLocation);
    if (filters.sortTime === 'asc') list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    else list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [complaints, filters]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  // Tab counts + tab filter
  const tabCounts = useMemo(() => {
    const c = {};
    TABS.forEach(t => { c[t.key] = filtered.filter(t.filter).length; });
    return c;
  }, [filtered]);

  const tabFiltered = useMemo(() => {
    const t = TABS.find(t => t.key === tab);
    return t ? filtered.filter(t.filter) : filtered;
  }, [filtered, tab]);

  const tabTotalItems = tabFiltered.length;
  const tabTotalPages = Math.max(1, Math.ceil(tabTotalItems / pageSize));
  const tabSafePage = Math.min(page, tabTotalPages);
  const paginated = tabFiltered.slice((tabSafePage - 1) * pageSize, tabSafePage * pageSize);

  // ---- Handlers (giống hệt gốc) ----
  const handleView = (item) => {
    setModalMode("view");
    setSelectedComplaint(item);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalMode("edit");
    setSelectedComplaint(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedComplaint(null);
    setModalMode("view");
  };

  const hasActiveFilters = filters.status || filters.categoryId || filters.neighborhoodId || filters.urgency || filters.slaStatus || filters.departmentId || filters.officerId || filters.dateFrom || filters.dateTo || filters.deadlineFrom || filters.deadlineTo || filters.hasExtension || filters.hasEvidence || filters.hasLocation;

  const handlePageChange = (p) => setPage(p);

  // ---- Columns (rút gọn: 8 cột, vừa 1 màn hình) ----
  const columns = [
    {
      title: "STT", dataIndex: "index", key: "index",
      render: (value, record, index) => (
        <span className="text-sm font-medium text-gray-900">#{((safePage - 1) * pageSize) + index + 1}</span>
      ),
    },
    {
      title: "Mã PA", dataIndex: "code", key: "code",
      render: (value) => <span className="text-sm font-mono text-blue-700">{value}</span>,
    },
    {
      title: "Tiêu đề", dataIndex: "title", key: "title",
      render: (value) => (
        <div className="text-sm text-gray-900 max-w-[160px] truncate" title={value}>{value}</div>
      ),
    },
    {
      title: "Lĩnh vực", dataIndex: "categoryId", key: "categoryId",
      render: (value) => renderCategoryBadge(value),
    },
    {
      title: "Khu phố", dataIndex: "neighborhoodId", key: "neighborhoodId",
      render: (value) => <span className="text-sm text-gray-600 whitespace-nowrap">{getNeighborhoodById(value)?.name || '—'}</span>,
    },
    {
      title: "Ngày gửi", dataIndex: "createdAt", key: "createdAt",
      render: (value) => <span className="text-sm text-gray-600 whitespace-nowrap">{dayjs(value).format("DD/MM HH:mm")}</span>,
    },
    {
      title: "Trạng thái", key: "status",
      render: (value, record) => <StatusBadge status={record.status} />,
    },
    {
      title: "Độ khẩn", key: "urgency",
      render: (value, record) => <UrgencyBadge urgency={record.confirmedUrgency || record.citizenUrgency} />,
    },
    {
      title: "Hạn xử lý", key: "deadline",
      render: (value, record) => (
        <span className={`text-sm whitespace-nowrap ${record.slaStatus === 'OVERDUE' ? 'text-red-600 font-medium' : record.slaStatus === 'NEAR_DUE' ? 'text-yellow-600 font-medium' : 'text-gray-600'}`}>
          {record.originalDeadline ? dayjs(record.currentDeadline || record.originalDeadline).format("DD/MM HH:mm") : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page title — synchronized typography */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý phản ánh kiến nghị</h1>
          <p className="text-xs text-slate-500 mt-1">Tiếp nhận, phân công, xử lý và theo dõi tiến độ phản ánh từ người dân</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-3.5 py-2 rounded-lg hover:bg-blue-700 text-xs font-semibold shadow-2xs transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Thêm phản ánh
        </button>
      </div>

      {/* ---- Quick tabs ---- */}
      <div className="flex border-b border-gray-200 overflow-x-auto mb-4">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); }}
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

      {/* Filter bar — giống hệt BaseFilter gốc */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Search input */}
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                placeholder="Tìm theo mã, tiêu đề, địa chỉ..."
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filters.search && (
                <button onClick={() => setFilters(p => ({ ...p, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {/* Bộ lọc toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${showFilters || hasActiveFilters ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              Bộ lọc
            </button>

            {/* Tìm kiếm button */}
            <button onClick={() => setPage(1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Tìm kiếm
            </button>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                  <select value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="NEW">Đã gửi</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="COMPLETED">Đã giải quyết</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiến độ thời hạn</label>
                  <select value={filters.slaStatus} onChange={e => setFilters(p => ({ ...p, slaStatus: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="ON_TIME">Còn hạn</option>
                    <option value="NEAR_DUE">Sắp đến hạn</option>
                    <option value="OVERDUE">Quá hạn</option>
                    <option value="COMPLETED_ON_TIME">HT đúng hạn</option>
                    <option value="COMPLETED_LATE">HT trễ hạn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị</label>
                  <select value={filters.departmentId} onChange={e => setFilters(p => ({ ...p, departmentId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    {departments.filter(d => d.status === 'ACTIVE' && d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cán bộ xử lý</label>
                  <select value={filters.officerId} onChange={e => setFilters(p => ({ ...p, officerId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    {users.filter(u => u.role === 'PROCESSING_OFFICER' && u.status === 'ACTIVE').map(u => <option key={u.id} value={u.id}>{u.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lĩnh vực</label>
                  <select value={filters.categoryId} onChange={e => setFilters(p => ({ ...p, categoryId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ</label>
                  <select value={filters.urgency} onChange={e => setFilters(p => ({ ...p, urgency: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="URGENT">Khẩn cấp</option>
                    <option value="NORMAL">Thông thường</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khu phố</label>
                  <select value={filters.neighborhoodId} onChange={e => setFilters(p => ({ ...p, neighborhoodId: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày gửi từ</label>
                  <input type="date" value={filters.dateFrom} onChange={e => setFilters(p => ({ ...p, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày gửi đến</label>
                  <input type="date" value={filters.dateTo} onChange={e => setFilters(p => ({ ...p, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hạn xử lý từ</label>
                  <input type="date" value={filters.deadlineFrom} onChange={e => setFilters(p => ({ ...p, deadlineFrom: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hạn xử lý đến</label>
                  <input type="date" value={filters.deadlineTo} onChange={e => setFilters(p => ({ ...p, deadlineTo: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gia hạn</label>
                  <select value={filters.hasExtension} onChange={e => setFilters(p => ({ ...p, hasExtension: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="yes">Có gia hạn</option>
                    <option value="no">Chưa gia hạn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minh chứng</label>
                  <select value={filters.hasEvidence} onChange={e => setFilters(p => ({ ...p, hasEvidence: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="yes">Có hình ảnh</option>
                    <option value="no">Không có hình ảnh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí bản đồ</label>
                  <select value={filters.hasLocation} onChange={e => setFilters(p => ({ ...p, hasLocation: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Tất cả</option>
                    <option value="yes">Có tọa độ</option>
                    <option value="no">Không có tọa độ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sắp xếp theo thời gian</label>
                  <select value={filters.sortTime} onChange={e => setFilters(p => ({ ...p, sortTime: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="desc">Mới nhất trước</option>
                    <option value="asc">Cũ nhất trước</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số bản ghi</label>
                  <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value={5}>5 bản ghi</option>
                    <option value={10}>10 bản ghi</option>
                    <option value={20}>20 bản ghi</option>
                    <option value={50}>50 bản ghi</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Count bar — giống hệt gốc */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 px-4 py-3">
        <h3 className="font-semibold text-gray-900 mb-0">Danh sách phản ánh ({tabTotalItems})</h3>
      </div>

      {/* BaseTable — dùng component thật từ dự án gốc */}
      <BaseTable
        data={paginated}
        columns={columns}
        onView={handleView}
        onEdit={handleEdit}
        showActions={true}
        emptyMessage="Không có phản ánh nào"
        pagination={{
          current: tabSafePage,
          pageSize: pageSize,
          total: tabTotalItems,
          totalPages: tabTotalPages,
          onChange: handlePageChange,
        }}
      />

      {/* ComplaintDetailModal — bản sao ReportDetailModal */}
      <ComplaintDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        complaint={selectedComplaint}
        mode={modalMode}
        onModeChange={setModalMode}
        onStatusUpdated={handleCloseModal}
      />

      {/* Quick-add modal for officers */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 z-0 bg-gray-900/40" onClick={() => setShowAddModal(false)} />
            <div className="relative z-10 bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10 rounded-t-xl">
                <h3 className="text-lg font-semibold text-gray-900">Thêm phản ánh mới</h3>
                <p className="text-sm text-gray-500 mt-0.5">Cán bộ tiếp nhận phản ánh từ người dân</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề <span className="text-red-500">*</span></label>
                  <input value={addForm.title} onChange={e => setAddForm(p => ({...p, title: e.target.value}))} placeholder="Nhập tiêu đề phản ánh" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung <span className="text-red-500">*</span></label>
                  <textarea value={addForm.description} onChange={e => setAddForm(p => ({...p, description: e.target.value}))} rows={3} placeholder="Nhập nội dung chi tiết" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại <span className="text-red-500">*</span></label>
                    <select value={addForm.categoryId} onChange={e => setAddForm(p => ({...p, categoryId: e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn loại</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ</label>
                    <select value={addForm.urgency} onChange={e => setAddForm(p => ({...p, urgency: e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="NORMAL">Thông thường</option>
                      <option value="URGENT">Khẩn cấp</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khu phố <span className="text-red-500">*</span></label>
                    <select value={addForm.neighborhoodId} onChange={e => setAddForm(p => ({...p, neighborhoodId: e.target.value}))} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Chọn khu phố</option>
                      {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input value={addForm.address} onChange={e => setAddForm(p => ({...p, address: e.target.value}))} placeholder="Địa chỉ cụ thể" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Thông tin người dân</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                      <input value={addForm.citizenName} onChange={e => setAddForm(p => ({...p, citizenName: e.target.value}))} placeholder="Nguyễn Văn A" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input value={addForm.citizenPhone} onChange={e => setAddForm(p => ({...p, citizenPhone: e.target.value}))} placeholder="0901234567" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3 rounded-b-xl">
                <button onClick={() => setShowAddModal(false)} className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm">Hủy</button>
                <button onClick={() => {
                  if (!addForm.title || !addForm.description || !addForm.categoryId || !addForm.neighborhoodId) return;
                  const seq = String(complaints.length + 1).padStart(4, '0');
                  const now = new Date().toISOString();
                  const cat = categories.find(c => c.id === addForm.categoryId);
                  const slaHours = addForm.urgency === 'URGENT' ? 24 : (cat?.defaultSlaHours || 120);
                  mock.addComplaint({
                    id: `CMP-${String(complaints.length + 1).padStart(4, '0')}`,
                    code: `PA-${seq}`,
                    citizenId: 'USR-001',
                    title: addForm.title,
                    description: addForm.description,
                    categoryId: addForm.categoryId,
                    citizenUrgency: addForm.urgency,
                    confirmedUrgency: addForm.urgency,
                    neighborhoodId: addForm.neighborhoodId,
                    address: addForm.address || undefined,
                    latitude: neighborhoods.find(n => n.id === addForm.neighborhoodId)?.centerLatitude,
                    longitude: neighborhoods.find(n => n.id === addForm.neighborhoodId)?.centerLongitude,
                    status: 'RECEIVED',
                    slaType: addForm.urgency === 'URGENT' ? 'URGENT_24_HOURS' : `NORMAL_${slaHours}_HOURS`,
                    slaHours,
                    receivedAt: now,
                    originalDeadline: new Date(new Date(now).getTime() + slaHours * 3600000).toISOString(),
                    currentDeadline: new Date(new Date(now).getTime() + slaHours * 3600000).toISOString(),
                    completedAt: null,
                    slaStatus: 'ON_TIME',
                    assignedDepartmentId: null,
                    assignedOfficerId: null,
                    extensionCount: 0,
                    progressPercent: 0,
                    createdAt: now,
                    updatedAt: now,
                    hasImages: false,
                    hasLocation: true,
                  });
                  setShowAddModal(false);
                  setAddForm({ title: '', description: '', categoryId: '', neighborhoodId: '', urgency: 'NORMAL', citizenName: '', citizenPhone: '', address: '' });
                }} className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:text-sm">Lưu và tiếp nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
