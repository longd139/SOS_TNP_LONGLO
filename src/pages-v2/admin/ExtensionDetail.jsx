// ============================================================
// EXTENSION DETAIL — PAGE E-03: Duyệt / từ chối yêu cầu gia hạn
// ============================================================
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, User, Building2, FileText, Calendar,
  CheckCircle, XCircle, MessageSquare, Image, Send,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getComplaintById, getUserById, getCategoryById, getDepartmentById,
  getNeighborhoodById, getStatusLabel, getTimeRemaining,
  getActionTypeLabel, getHistoryByComplaint,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

// ---- Extension-specific constants ----
const EXT_STATUS_COLORS = {
  PENDING:  { bg: '#FEF3C7', color: '#92400E' },
  APPROVED: { bg: '#D1FAE5', color: '#065F46' },
  REJECTED: { bg: '#FEE2E2', color: '#991B1B' },
};

const EXT_STATUS_LABELS = {
  PENDING: 'Chờ phê duyệt',
  APPROVED: 'Đã phê duyệt',
  REJECTED: 'Đã từ chối',
};

const EXT_REASON_LABELS = {
  WAITING_FOR_COORDINATION: 'Chờ phối hợp liên ngành',
  WAITING_FOR_SURVEY: 'Chờ khảo sát hiện trường',
  COMPLEX_CASE: 'Vụ việc phức tạp',
  WAITING_FOR_SUPPLIES: 'Chờ vật tư, thiết bị',
  WEATHER_CONDITIONS: 'Điều kiện thời tiết',
  WAITING_FOR_CITIZEN_INFO: 'Chờ người dân bổ sung thông tin',
  OTHER: 'Lý do khác',
};

// ---- Shared badge base (StatusBadge/SlaBadge/UrgencyBadge imported from Badges.jsx) ----
function Badge({ label, bg, color, icon: Icon }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
      style={{ backgroundColor: bg, color }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label || '—'}
    </span>
  );
}

function ExtStatusBadge({ status }) {
  const c = EXT_STATUS_COLORS[status] || { bg: '#F3F4F6', color: '#6B7280' };
  return <Badge label={EXT_STATUS_LABELS[status] || status} bg={c.bg} color={c.color} />;
}

// ---- Helpers ----
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ---- Form classes (exact spec) ----
const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
const textareaCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none";

// ---- Field ----
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ---- Modal ----
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ExtensionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { extensions, currentRole, currentUser, updateExtension, updateComplaint, addHistory } = useMock();

  const ext = extensions.find(e => e.id === id);
  const complaint = ext ? getComplaintById(ext.complaintId) : null;
  const requester = ext ? getUserById(ext.requestedBy) : null;
  const reviewer = ext?.reviewedBy ? getUserById(ext.reviewedBy) : null;
  const category = complaint ? getCategoryById(complaint.categoryId) : null;
  const dept = complaint?.assignedDepartmentId ? getDepartmentById(complaint.assignedDepartmentId) : null;
  const neighborhood = complaint ? getNeighborhoodById(complaint.neighborhoodId) : null;
  const timeline = complaint ? getHistoryByComplaint(complaint.id) : [];

  const canAct = (currentRole === 'APPROVER' || currentRole === 'LEADER' || currentRole === 'ADMIN') && ext?.status === 'PENDING';
  const isFinal = ext?.status === 'APPROVED' || ext?.status === 'REJECTED';
  const urgency = complaint?.confirmedUrgency || complaint?.citizenUrgency;
  const isOverdue = complaint?.currentDeadline && new Date(complaint.currentDeadline) < new Date();

  // ---- modals ----
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  // approve form
  const [approvedDeadline, setApprovedDeadline] = useState('');
  const [approveNote, setApproveNote] = useState('');
  const [publicNote, setPublicNote] = useState('');
  const [applyImmediately, setApplyImmediately] = useState(true);

  // reject form
  const [rejectReason, setRejectReason] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  const openApprove = () => {
    const dl = ext?.requestedDeadline ? new Date(ext.requestedDeadline) : null;
    setApprovedDeadline(dl ? dl.toISOString().slice(0, 16) : '');
    setApproveNote('');
    setPublicNote('');
    setApplyImmediately(true);
    setShowApprove(true);
  };

  const openReject = () => {
    setRejectReason('');
    setNextSteps('');
    setShowReject(true);
  };

  // ---- submit handlers ----
  const handleApprove = () => {
    if (!ext || !complaint) return;
    const now = new Date().toISOString();
    const finalDeadline = approvedDeadline ? new Date(approvedDeadline).toISOString() : ext.requestedDeadline;

    updateExtension(ext.id, {
      status: 'APPROVED',
      approvedDeadline: finalDeadline,
      reviewedBy: currentUser.id,
      reviewedAt: now,
      reviewNote: approveNote,
      applyImmediately,
    });

    updateComplaint(complaint.id, {
      currentDeadline: finalDeadline,
      slaStatus: 'ON_TIME',
      extensionCount: (complaint.extensionCount || 0) + 1,
      ...(applyImmediately ? { status: 'IN_PROGRESS' } : {}),
    });

    const hisId = 'HIS-' + Date.now();
    addHistory({
      id: hisId + '-a',
      complaintId: complaint.id,
      actionType: 'EXTENSION_APPROVED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { currentDeadline: ext.oldDeadline },
      newValue: { currentDeadline: finalDeadline },
      internalNote: approveNote || 'Đã phê duyệt gia hạn',
      publicNote: publicNote || 'Thời hạn xử lý đã được gia hạn.',
      isPublic: true,
    });
    if (applyImmediately) {
      addHistory({
        id: hisId + '-b',
        complaintId: complaint.id,
        actionType: 'STATUS_CHANGED',
        performedBy: currentUser.id,
        performedRole: currentRole,
        performedAt: now,
        oldValue: { status: 'EXTENSION_PENDING' },
        newValue: { status: 'IN_PROGRESS' },
        internalNote: 'Tự động chuyển trạng thái sau khi duyệt gia hạn',
        publicNote: null,
        isPublic: false,
      });
    }
    setShowApprove(false);
  };

  const handleReject = () => {
    if (!ext || !complaint) return;
    const now = new Date().toISOString();

    updateExtension(ext.id, {
      status: 'REJECTED',
      reviewedBy: currentUser.id,
      reviewedAt: now,
      reviewNote: rejectReason,
    });

    updateComplaint(complaint.id, {
      status: 'IN_PROGRESS',
      currentDeadline: ext.oldDeadline,
      slaStatus: new Date(ext.oldDeadline) < new Date() ? 'OVERDUE' : 'ON_TIME',
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'EXTENSION_REJECTED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { requestedDeadline: ext.requestedDeadline },
      newValue: { currentDeadline: ext.oldDeadline },
      internalNote: [rejectReason, nextSteps].filter(Boolean).join(' | ') || 'Đã từ chối gia hạn',
      publicNote: null,
      isPublic: false,
    });

    setShowReject(false);
  };

  // ---- mock evidence thumbnails ----
  const mockEvidence = useMemo(() => {
    if (!complaint?.hasImages) return [];
    return Array.from({ length: 3 }, (_, i) => ({
      id: `ev-${i}`,
      url: `/mock/images/sample-${(i % 5) + 1}.jpg`,
      label: `Ảnh hiện trường ${i + 1}`,
    }));
  }, [complaint?.hasImages]);

  // ---- not found ----
  if (!ext) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <p className="text-lg font-medium">Không tìm thấy yêu cầu gia hạn</p>
        <button onClick={() => navigate('/admin/extensions')} className="mt-4 text-blue-600 hover:underline text-sm">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const daysRequested = Math.ceil((new Date(ext.requestedDeadline) - new Date(ext.oldDeadline)) / 86400000);

  return (
    <div className="space-y-6 min-h-full">
      {/* ======== 1. PAGE HEADER: Back button + extension request info ======== */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate('/admin/extensions')}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium inline-flex items-center gap-2 flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">
            Yêu cầu gia hạn — {ext.id}
          </h1>
          <p className="text-gray-600 mt-1">
            {requester?.fullName || '—'} đề nghị gia hạn xử lý phản ánh {complaint?.code || '—'}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <ExtStatusBadge status={ext.status} />
            <span className="text-xs text-gray-400">{formatDate(ext.requestedAt)}</span>
          </div>
        </div>
      </div>

      {/* ======== 2. COMPLAINT SUMMARY CARD ======== */}
      {complaint && (
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
            Thông tin phản ánh
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm px-3">
            <div>
              <span className="text-gray-500">Mã PA:</span>{' '}
              <span className="font-mono font-medium text-gray-900">{complaint.code}</span>
            </div>
            <div>
              <span className="text-gray-500">Tiêu đề:</span>{' '}
              <span className="text-gray-900">{complaint.title}</span>
            </div>
            <div>
              <span className="text-gray-500">Khu phố:</span>{' '}
              <span className="text-gray-900">{neighborhood?.name || '—'}</span>
            </div>
            <div>
              <span className="text-gray-500">Danh mục:</span>{' '}
              <span className="text-gray-900">{category?.name || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Mức độ:</span>
              <UrgencyBadge urgency={urgency} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Trạng thái:</span>
              <StatusBadge status={complaint.status} />
            </div>
            <div>
              <span className="text-gray-500">Hạn hiện tại:</span>{' '}
              <span className={`font-mono ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                {formatDate(complaint.currentDeadline)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Thời hạn:</span>{' '}
              <span className={isOverdue ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                {getTimeRemaining(complaint.currentDeadline)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Tiến độ:</span>
              <SlaBadge slaStatus={complaint.slaStatus} />
            </div>
            <div>
              <span className="text-gray-500">Số lần gia hạn:</span>{' '}
              <span className="font-medium text-gray-900">{complaint.extensionCount || 0}</span>
            </div>
          </div>
        </div>
      )}

      {/* ======== 3. REQUEST DETAIL CARD ======== */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
          Chi tiết yêu cầu gia hạn
        </h3>

        <div className="space-y-4 px-3">
          {/* Requester info row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">Người đề nghị:</span>
              <span className="font-medium text-gray-900">{requester?.fullName || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">Đơn vị:</span>
              <span className="text-gray-900">{dept?.name || '—'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-500">Ngày đề nghị:</span>
              <span className="text-gray-900">{formatDate(ext.requestedAt)}</span>
            </div>
          </div>

          {/* Deadline change */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thay đổi thời hạn</h4>
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div>
                <span className="text-xs text-gray-400 block">Hạn cũ</span>
                <span className="font-mono text-gray-500 line-through">{formatDate(ext.oldDeadline)}</span>
              </div>
              <span className="text-gray-300">&rarr;</span>
              <div>
                <span className="text-xs text-gray-400 block">Hạn đề nghị</span>
                <span className="font-mono font-semibold text-blue-700">{formatDate(ext.requestedDeadline)}</span>
              </div>
              {ext.approvedDeadline && (
                <>
                  <span className="text-gray-300">&rarr;</span>
                  <div>
                    <span className="text-xs text-gray-400 block">Hạn được duyệt</span>
                    <span className="font-mono font-semibold text-green-700">{formatDate(ext.approvedDeadline)}</span>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Gia hạn thêm <span className="font-medium text-gray-700">{daysRequested} ngày</span>
            </p>
          </div>

          {/* Reason */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lý do gia hạn</h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge
                label={EXT_REASON_LABELS[ext.reasonType] || ext.reasonType}
                bg="#EDE9FE" color="#5B21B6"
              />
            </div>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">{ext.reason}</p>
          </div>

          {/* Processing plan */}
          {ext.processingPlan && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kế hoạch xử lý</h4>
              <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">{ext.processingPlan}</p>
            </div>
          )}

          {/* Evidence */}
          {mockEvidence.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hình ảnh minh chứng</h4>
              <div className="flex gap-3 flex-wrap">
                {mockEvidence.map(ev => (
                  <div key={ev.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 w-32">
                    <div className="h-20 bg-gray-200 flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 text-center py-1.5 truncate px-1">{ev.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviewer info (if reviewed) */}
          {isFinal && reviewer && (
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thông tin phê duyệt</h4>
              <div className="flex items-center gap-2">
                {ext.status === 'APPROVED' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span className="text-gray-600">Người duyệt:</span>
                <span className="font-medium text-gray-900">{reviewer.fullName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Ngày duyệt:</span>
                <span className="text-gray-900">{formatDate(ext.reviewedAt)}</span>
              </div>
              {ext.reviewNote && (
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">{ext.reviewNote}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ======== 4. RELATED TIMELINE ======== */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
          Lịch sử liên quan ({timeline.length})
        </h3>
        {timeline.length === 0 ? (
          <p className="text-sm text-gray-500 px-3">Chưa có lịch sử xử lý</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {timeline.slice(0, 15).map((entry, idx) => {
              const actor = getUserById(entry.performedBy);
              return (
                <div key={entry.id} className="px-3 py-3 flex items-start gap-3">
                  <span
                    className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge
                        label={getActionTypeLabel(entry.actionType)}
                        bg={idx === 0 ? '#DBEAFE' : '#F3F4F6'}
                        color={idx === 0 ? '#1E40AF' : '#6B7280'}
                      />
                      <span className="text-xs text-gray-400">{formatDate(entry.performedAt)}</span>
                      {entry.isPublic !== undefined && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${entry.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {entry.isPublic ? 'Công khai' : 'Nội bộ'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {actor?.fullName || entry.performedBy}{' '}
                      <span className="text-gray-400">
                        ({actor?.role === 'CITIZEN' ? 'Người dân' : actor?.role === 'RECEPTION_OFFICER' ? 'Cán bộ tiếp nhận' : actor?.role === 'PROCESSING_OFFICER' ? 'Cán bộ xử lý' : actor?.role || '—'})
                      </span>
                    </p>
                    {entry.oldValue && entry.newValue && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        <span className="text-gray-400 line-through">
                          {typeof entry.oldValue === 'object'
                            ? (entry.oldValue.status ? getStatusLabel(entry.oldValue.status) : JSON.stringify(entry.oldValue))
                            : entry.oldValue}
                        </span>
                        <span className="mx-1 text-gray-300">&rarr;</span>
                        <span className="font-medium text-gray-700">
                          {typeof entry.newValue === 'object'
                            ? (entry.newValue.status ? getStatusLabel(entry.newValue.status) : JSON.stringify(entry.newValue))
                            : entry.newValue}
                        </span>
                      </p>
                    )}
                    {entry.internalNote && (
                      <p className="text-xs text-gray-600 mt-0.5 bg-white rounded-md px-2 py-1 border border-gray-100">{entry.internalNote}</p>
                    )}
                    {entry.publicNote && (
                      <p className="text-xs text-green-600 mt-0.5 italic">
                        <MessageSquare className="w-3 h-3 inline mr-1" />
                        {entry.publicNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {timeline.length > 15 && (
          <p className="text-xs text-gray-400 text-center py-2">+ {timeline.length - 15} mục khác</p>
        )}
      </div>

      {/* ======== 5. ACTION BUTTONS (APPROVER/LEADER only, only if PENDING) ======== */}
      {canAct && (
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
            Thao tác
          </h3>
          <div className="flex flex-wrap gap-3 px-3">
            <button
              onClick={openApprove}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium inline-flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Phê duyệt
            </button>
            <button
              onClick={openReject}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium inline-flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Từ chối
            </button>
          </div>
        </div>
      )}

      {/* ======== 6. APPROVAL MODAL ======== */}
      {showApprove && (
        <Modal title="Phê duyệt gia hạn" onClose={() => setShowApprove(false)}>
          <Field label="Hạn được duyệt">
            <span className="text-xs text-gray-400 ml-1 font-normal">(mặc định: hạn đề nghị)</span>
            <input
              type="datetime-local"
              value={approvedDeadline}
              onChange={e => setApprovedDeadline(e.target.value)}
              className={inputCls}
              style={{ marginTop: '0.25rem' }}
            />
          </Field>

          <Field label="Ghi chú nội bộ">
            <textarea
              value={approveNote}
              onChange={e => setApproveNote(e.target.value)}
              rows={3}
              className={textareaCls}
              placeholder="Ghi chú cho cán bộ xử lý..."
            />
          </Field>

          <Field label="Ghi chú công khai cho người dân">
            <textarea
              value={publicNote}
              onChange={e => setPublicNote(e.target.value)}
              rows={2}
              className={textareaCls}
              placeholder="Thông báo đến người dân (hiển thị công khai)..."
            />
          </Field>

          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={applyImmediately}
              onChange={e => setApplyImmediately(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Áp dụng ngay — chuyển PA về trạng thái "Đang xử lý"
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowApprove(false)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium flex-1">
              Hủy
            </button>
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium inline-flex items-center justify-center gap-2 flex-1"
            >
              <Send className="w-4 h-4" />
              Xác nhận phê duyệt
            </button>
          </div>
        </Modal>
      )}

      {/* ======== 7. REJECTION MODAL ======== */}
      {showReject && (
        <Modal title="Từ chối gia hạn" onClose={() => setShowReject(false)}>
          <Field label="Lý do từ chối" required>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              className={textareaCls}
              placeholder="Nêu rõ lý do từ chối gia hạn..."
            />
          </Field>

          <Field label="Hướng dẫn tiếp theo">
            <textarea
              value={nextSteps}
              onChange={e => setNextSteps(e.target.value)}
              rows={2}
              className={textareaCls}
              placeholder="Hướng dẫn cán bộ các bước cần làm..."
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowReject(false)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium flex-1">
              Hủy
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium inline-flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Xác nhận từ chối
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
