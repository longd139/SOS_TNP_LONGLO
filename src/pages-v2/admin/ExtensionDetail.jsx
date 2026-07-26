// ============================================================
// EXTENSION DETAIL — Duyệt / từ chối yêu cầu gia hạn
// ============================================================
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, User, Building2, FileText, Calendar, AlertTriangle,
  CheckCircle, XCircle, MessageSquare, Image, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getComplaintById, getUserById, getCategoryById, getDepartmentById,
  getNeighborhoodById, getStatusLabel, getUrgencyLabel, getTimeRemaining,
  getActionTypeLabel, getHistoryByComplaint,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

const EXT_REASON_LABELS = {
  WAITING_FOR_COORDINATION: 'Chờ phối hợp liên ngành',
  WAITING_FOR_SURVEY: 'Chờ khảo sát hiện trường',
  COMPLEX_CASE: 'Vụ việc phức tạp',
  WAITING_FOR_SUPPLIES: 'Chờ vật tư, thiết bị',
  WEATHER_CONDITIONS: 'Điều kiện thời tiết',
  OTHER: 'Lý do khác',
};

// ponytail: badge colors match db.js getStatusColor
const EXT_STATUS = {
  PENDING: { label: 'Chờ phê duyệt', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Đã phê duyệt', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ---- Collapsible section wrapper (matching ComplaintDetail) ----
function Section({ title, icon: Icon, defaultOpen = true, children, action }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-gray-400" />}
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>
      {open && <div className="px-5 pb-5 space-y-3">{children}</div>}
    </div>
  );
}

// ---- Modal wrapper (matching ComplaintDetail) ----
function Modal({ title, icon: Icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---- Timeline entry (matching ComplaintDetail) ----
function TimelineEntry({ entry, isLast, isLatest }) {
  const actor = getUserById(entry.performedBy);
  const dotClass = isLatest
    ? 'bg-white border-2 border-blue-600'
    : 'bg-white border-2 border-gray-400';

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center pt-0.5">
        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotClass}`} />
        {!isLast && <div className="w-0.5 flex-1 min-h-[1.5rem] bg-gray-300" />}
      </div>
      <div className="pb-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-medium text-gray-800">{getActionTypeLabel(entry.actionType)}</span>
          <span className="text-xs text-gray-400">{formatDate(entry.performedAt)}</span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {actor?.fullName || entry.performedBy}
        </p>
        {entry.internalNote && (
          <p className="text-xs text-gray-600 mt-0.5 bg-gray-50 rounded-md px-2 py-1">{entry.internalNote}</p>
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

  const canAct = (currentRole === 'APPROVER' || currentRole === 'LEADER') && ext?.status === 'PENDING';
  const isFinal = ext?.status === 'APPROVED' || ext?.status === 'REJECTED';

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
  const [rejectNote, setRejectNote] = useState('');

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
    setRejectNote('');
    setShowReject(false);
    setTimeout(() => setShowReject(true), 0);
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
      internalNote: [rejectReason, nextSteps, rejectNote].filter(Boolean).join(' | ') || 'Đã từ chối gia hạn',
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
        <AlertTriangle className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-lg font-medium">Không tìm thấy yêu cầu gia hạn</p>
        <button onClick={() => navigate('/admin/extensions')} className="mt-4 text-blue-600 hover:underline text-sm">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const urgency = complaint?.confirmedUrgency || complaint?.citizenUrgency;
  const isOverdue = complaint?.currentDeadline && new Date(complaint.currentDeadline) < new Date();

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* ======== HEADER ======== */}
      <div className="flex items-start gap-3 flex-wrap">
        <button
          onClick={() => navigate('/admin/extensions')}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-colors flex-shrink-0 mt-0.5"
          title="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
            <span className="font-mono font-medium text-blue-600">{ext.id}</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EXT_STATUS[ext.status]?.color || 'bg-gray-100 text-gray-600'}`}>
              {EXT_STATUS[ext.status]?.label || ext.status}
            </span>
            {complaint && (
              <>
                <span className="text-gray-300">|</span>
                <span className="font-mono text-gray-500">{complaint.code}</span>
                <StatusBadge status={complaint.status} />
                <UrgencyBadge urgency={urgency} />
                <SlaBadge slaStatus={complaint.slaStatus} />
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            Yêu cầu gia hạn — {complaint?.title || '—'}
          </h1>
          {requester && (
            <p className="text-sm text-gray-600 mt-1">
              Người đề nghị: {requester.fullName} — {formatDate(ext.requestedAt)}
            </p>
          )}
        </div>
      </div>

      {/* ======== TWO-COLUMN LAYOUT ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- LEFT COLUMN (2/3) ---- */}
        <div className="lg:col-span-2 space-y-4">

          {/* Section 1: Thông tin phản ánh */}
          {complaint && (
            <Section title="Thông tin phản ánh" icon={FileText}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Mã PA:</span>
                  <span className="font-mono font-medium text-gray-900">{complaint.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Danh mục:</span>
                  <span className="text-gray-900">{category?.name || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Khu phố:</span>
                  <span className="text-gray-900">{neighborhood?.name || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Mức độ:</span>
                  <UrgencyBadge urgency={urgency} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Trạng thái:</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Hạn hiện tại:</span>
                  <span className={`font-mono ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                    {formatDate(complaint.currentDeadline)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Thời hạn:</span>
                  <span className={isOverdue ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                    {getTimeRemaining(complaint.currentDeadline)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <SlaBadge slaStatus={complaint.slaStatus} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Số lần gia hạn:</span>
                  <span className="font-medium text-gray-900">{complaint.extensionCount || 0}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 pt-1">{complaint.title}</p>
            </Section>
          )}

          {/* Section 2: Timeline */}
          <Section title="Lịch sử liên quan" icon={Clock} defaultOpen>
            {timeline.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có lịch sử xử lý</p>
            ) : (
              <div className="space-y-0">
                {timeline.slice(0, 15).map((entry, idx) => (
                  <TimelineEntry
                    key={entry.id}
                    entry={entry}
                    isLast={idx === Math.min(timeline.length, 15) - 1}
                    isLatest={idx === 0}
                  />
                ))}
                {timeline.length > 15 && (
                  <p className="text-xs text-gray-400 text-center py-1">
                    + {timeline.length - 15} mục khác
                  </p>
                )}
              </div>
            )}
          </Section>
        </div>

        {/* ---- RIGHT COLUMN (1/3) ---- */}
        <div className="space-y-4">

          {/* Section 3: Chi tiết yêu cầu */}
          <Section title="Chi tiết yêu cầu" icon={FileText}>
            {/* Requester info */}
            <div className="space-y-2 text-sm">
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

            {/* Deadline diff */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Thời hạn</h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Hạn cũ</span>
                  <span className="font-mono text-sm text-gray-500 line-through">{formatDate(ext.oldDeadline)}</span>
                </div>
                <ArrowLeft className="w-5 h-5 text-gray-300 rotate-180" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Hạn đề nghị</span>
                  <span className="font-mono text-sm font-semibold text-blue-700">{formatDate(ext.requestedDeadline)}</span>
                </div>
                {ext.approvedDeadline && (
                  <>
                    <span className="text-xs text-green-600 font-medium mx-1">→ Đã duyệt:</span>
                    <span className="font-mono text-sm font-semibold text-green-700">{formatDate(ext.approvedDeadline)}</span>
                  </>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Gia hạn thêm{' '}
                <span className="font-medium text-gray-700">
                  {Math.ceil((new Date(ext.requestedDeadline) - new Date(ext.oldDeadline)) / 86400000)} ngày
                </span>
              </div>
            </div>

            {/* Reason */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lý do gia hạn</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {EXT_REASON_LABELS[ext.reasonType] || ext.reasonType}
                </span>
              </div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100">{ext.reason}</p>
            </div>

            {/* Processing plan */}
            {ext.processingPlan && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kế hoạch xử lý</h3>
                <p className="text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-100">{ext.processingPlan}</p>
              </div>
            )}

            {/* Evidence thumbnails */}
            {mockEvidence.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hình ảnh minh chứng</h3>
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

            {/* Reviewer info (if final) */}
            {isFinal && reviewer && (
              <div className="border-t border-gray-200 pt-4 mt-2 space-y-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thông tin phê duyệt</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {ext.status === 'APPROVED' ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-gray-500">Người duyệt:</span>
                    <span className="font-medium text-gray-900">{reviewer.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Ngày duyệt:</span>
                    <span className="text-gray-900">{formatDate(ext.reviewedAt)}</span>
                  </div>
                </div>
                {ext.reviewNote && (
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 rounded-lg p-3 border border-gray-100">{ext.reviewNote}</p>
                )}
              </div>
            )}
          </Section>

          {/* Section 4: Thao tác */}
          {canAct && (
            <Section title="Thao tác" icon={CheckCircle} defaultOpen>
              <div className="flex flex-col gap-2">
                <button
                  onClick={openApprove}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Phê duyệt gia hạn
                </button>
                <button
                  onClick={openReject}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối gia hạn
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* ======== MODALS ======== */}

      {/* a) Approval modal */}
      {showApprove && (
        <Modal title="Phê duyệt gia hạn" icon={CheckCircle} onClose={() => setShowApprove(false)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn được duyệt <span className="text-gray-400 font-normal">(mặc định: hạn đề nghị)</span>
            </label>
            <input
              type="datetime-local"
              value={approvedDeadline}
              onChange={e => setApprovedDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú nội bộ</label>
            <textarea
              value={approveNote}
              onChange={e => setApproveNote(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ghi chú cho cán bộ xử lý..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú công khai cho người dân</label>
            <textarea
              value={publicNote}
              onChange={e => setPublicNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Thông báo đến người dân (hiển thị công khai)..."
            />
          </div>

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
            <button
              onClick={() => setShowApprove(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Xác nhận phê duyệt
            </button>
          </div>
        </Modal>
      )}

      {/* b) Rejection modal */}
      {showReject && (
        <Modal title="Từ chối gia hạn" icon={XCircle} onClose={() => setShowReject(false)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              rows={3}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nêu rõ lý do từ chối gia hạn..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hướng dẫn tiếp theo</label>
            <textarea
              value={nextSteps}
              onChange={e => setNextSteps(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Hướng dẫn cán bộ các bước cần làm..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho cán bộ đề nghị</label>
            <textarea
              value={rejectNote}
              onChange={e => setRejectNote(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ghi chú thêm cho cán bộ..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowReject(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
