// ============================================================
// COMPLAINT DETAIL — Chi tiết phản ánh (admin view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, Calendar, Clock,
  MessageSquare, Image, FileText, Edit, UserPlus,
  CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Send, Paperclip, Eye, EyeOff, Building2, BarChart3,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getComplaintById, getHistoryByComplaint, getExtensionsByComplaint,
  getAttachmentsByComplaint, getAssignmentByComplaint, getUserById,
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getStatusLabel, getActionTypeLabel,
  getTimeRemaining,
  users, departments, categories, neighborhoods,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge } from '../../mock/components/Badges';

// ---- helpers ----
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

function toDatetimeLocal(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ponytail: one badge component, no per-type wrappers — StatusBadge/SlaBadge/UrgencyBadge imported from shared Badges.jsx
function Badge({ label, bg, color, icon: Icon }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-full"
      style={{ backgroundColor: bg, color }}
    >
      {Icon && <Icon className="w-3 h-3" />}
      {label || '—'}
    </span>
  );
}

// ---- Collapsible section ----
function Section({ title, icon: Icon, defaultOpen = true, children, action }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 hover:text-gray-700 transition-colors"
        >
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            {title}
          </h4>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {action}
      </div>
      {open && <div className="space-y-3">{children}</div>}
    </div>
  );
}

// ---- Modal (matching original ReportDetailModal overlay style) ----
function Modal({ title, icon: Icon, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 mb-1">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
}

// ---- Timeline entry (matching ReportDetailModal timeline: w-0.5 line, bordered dots, bg-gray-50 entries) ----
function TimelineEntry({ entry, isLast, isLatest }) {
  const actor = getUserById(entry.performedBy);
  const dotClass = isLatest
    ? 'bg-blue-600 border-blue-600'
    : 'bg-white border-gray-400';

  return (
    <div className="relative pl-8 mb-2">
      <div className={`absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 ${isLast ? 'h-3' : ''}`}></div>
      <span
        className={`absolute left-[0.625rem] top-1.5 w-3 h-3 rounded-full border-2 ${dotClass}`}
      ></span>

      <div className="p-2 bg-gray-50 ml-2 rounded-md">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <Badge label={getActionTypeLabel(entry.actionType)}
            bg={isLatest ? '#DBEAFE' : '#F3F4F6'} color={isLatest ? '#1E40AF' : '#6B7280'} />
          <span className="text-xs text-gray-500">{formatDate(entry.performedAt)}</span>
          {entry.isPublic !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${entry.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {entry.isPublic ? 'Công khai' : 'Nội bộ'}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          {actor?.fullName || entry.performedBy}
          <span className="text-gray-400"> ({actor?.role === 'CITIZEN' ? 'Người dân' : actor?.role === 'RECEPTION_OFFICER' ? 'Cán bộ tiếp nhận' : actor?.role === 'PROCESSING_OFFICER' ? 'Cán bộ xử lý' : actor?.role || '—'})</span>
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
}

// ---- Form field (matching original ReportDetailModal form style) ----
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

// ---- Shared form classes (matching original ReportDetailModal) ----
const inputCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
const textareaCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none";
const selectCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";
const cancelBtnCls = "flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors";

const SLA_HOURS_OPTIONS = [
  { value: '3', label: '3 ngày (72 giờ)' },
  { value: '4', label: '4 ngày (96 giờ)' },
  { value: '5', label: '5 ngày (120 giờ)' },
];

const EXT_REASON_OPTIONS = [
  { value: 'WAITING_FOR_COORDINATION', label: 'Chờ phối hợp liên ngành' },
  { value: 'WAITING_FOR_SURVEY', label: 'Chờ khảo sát hiện trường' },
  { value: 'COMPLEX_CASE', label: 'Vụ việc phức tạp' },
  { value: 'WAITING_FOR_SUPPLIES', label: 'Chờ vật tư, thiết bị' },
  { value: 'WEATHER_CONDITIONS', label: 'Điều kiện thời tiết' },
  { value: 'WAITING_FOR_CITIZEN_INFO', label: 'Chờ người dân bổ sung thông tin' },
  { value: 'OTHER', label: 'Lý do khác' },
];

const PROGRESS_OPTIONS = [
  { value: 0, label: '0% - Chưa bắt đầu' },
  { value: 25, label: '25% - Đang khảo sát' },
  { value: 50, label: '50% - Đang xử lý' },
  { value: 75, label: '75% - Sắp hoàn thành' },
  { value: 100, label: '100% - Hoàn thành' },
];

const COMPLETE_SLA_RESULT_OPTIONS = [
  { value: 'RESOLVED', label: 'Đã xử lý' },
  { value: 'PARTIALLY_RESOLVED', label: 'Xử lý một phần' },
  { value: 'CANNOT_RESOLVE', label: 'Không thể xử lý' },
  { value: 'FORWARDED', label: 'Chuyển đơn vị khác' },
];

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function ComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentRole, currentUser, updateComplaint, addHistory, addExtension, addAssignment,
  } = useMock();

  const complaint = getComplaintById(id);
  const complaintHistory = complaint ? getHistoryByComplaint(complaint.id) : [];
  const complaintExtensions = complaint ? getExtensionsByComplaint(complaint.id) : [];
  const complaintAttachments = complaint ? getAttachmentsByComplaint(complaint.id) : [];
  const complaintAssignment = complaint ? getAssignmentByComplaint(complaint.id) : null;

  const citizen = complaint ? getUserById(complaint.citizenId) : null;
  const category = complaint ? getCategoryById(complaint.categoryId) : null;
  const neighborhood = complaint ? getNeighborhoodById(complaint.neighborhoodId) : null;
  const assignedDept = complaint?.assignedDepartmentId ? getDepartmentById(complaint.assignedDepartmentId) : null;
  const assignedOfficer = complaint?.assignedOfficerId ? getUserById(complaint.assignedOfficerId) : null;
  const supportOfficers = complaintAssignment?.supportOfficerIds?.map(uid => getUserById(uid)).filter(Boolean) || [];
  const urgency = complaint?.confirmedUrgency || complaint?.citizenUrgency;

  const pendingExtension = complaintExtensions.find(e => e.status === 'PENDING');

  // ---- UI state ----
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  // modal states
  const [showReceive, setShowReceive] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [showExtension, setShowExtension] = useState(false);

  // ---- Receive form ----
  const [receiveCategoryId, setReceiveCategoryId] = useState(complaint?.categoryId || '');
  const [receiveUrgency, setReceiveUrgency] = useState(urgency || 'NORMAL');
  const [receiveNeighborhoodId, setReceiveNeighborhoodId] = useState(complaint?.neighborhoodId || '');
  const [receiveAddress, setReceiveAddress] = useState(complaint?.address || '');
  const [receiveSlaDays, setReceiveSlaDays] = useState('3');
  const [receiveNote, setReceiveNote] = useState('');
  const [receiveDeptId, setReceiveDeptId] = useState('');

  // ---- Assign form ----
  const [assignDeptId, setAssignDeptId] = useState('');
  const [assignOfficerId, setAssignOfficerId] = useState('');
  const [assignSupportIds, setAssignSupportIds] = useState([]);
  const [assignInternalDeadline, setAssignInternalDeadline] = useState('');
  const [assignNote, setAssignNote] = useState('');

  // ---- Progress form ----
  const [progressPercent, setProgressPercent] = useState(complaint?.progressPercent || 0);
  const [progressStatus, setProgressStatus] = useState('');
  const [progressWorkDone, setProgressWorkDone] = useState('');
  const [progressIssues, setProgressIssues] = useState('');
  const [progressNextSteps, setProgressNextSteps] = useState('');
  const [progressPublicNote, setProgressPublicNote] = useState('');
  const [progressFiles, setProgressFiles] = useState([]);

  // ---- Complete form ----
  const [completeResult, setCompleteResult] = useState('');
  const [completeConclusion, setCompleteConclusion] = useState('');
  const [completeDate, setCompleteDate] = useState(toDatetimeLocal(new Date().toISOString()));
  const [completeReplyCitizen, setCompleteReplyCitizen] = useState('');
  const [completeCost, setCompleteCost] = useState('');
  const [completeInternalNote, setCompleteInternalNote] = useState('');
  const [completeDeptIds, setCompleteDeptIds] = useState([]);
  const [completeFiles, setCompleteFiles] = useState([]);

  // ---- Location edit form ----
  const [locNeighborhoodId, setLocNeighborhoodId] = useState(complaint?.neighborhoodId || '');
  const [locAddress, setLocAddress] = useState(complaint?.address || '');
  const [locLat, setLocLat] = useState(complaint?.latitude?.toString() || '');
  const [locLng, setLocLng] = useState(complaint?.longitude?.toString() || '');

  // ---- Extension form ----
  const [extNewDeadline, setExtNewDeadline] = useState('');
  const [extReasonType, setExtReasonType] = useState('');
  const [extReason, setExtReason] = useState('');
  const [extPlan, setExtPlan] = useState('');
  const [extFiles, setExtFiles] = useState([]);

  // ---- computed ----
  const officersForDept = useMemo(() => {
    if (!assignDeptId) return [];
    return users.filter(u => u.departmentId === assignDeptId && u.role === 'PROCESSING_OFFICER');
  }, [assignDeptId]);

  const slaPreview = useMemo(() => {
    if (!completeDate || !complaint?.currentDeadline) return null;
    const onTime = new Date(completeDate) <= new Date(complaint.currentDeadline);
    return onTime ? { label: 'Đúng hạn', color: 'text-green-600', bg: 'bg-green-50 border-green-200' }
      : { label: 'Trễ hạn', color: 'text-red-600', bg: 'bg-red-50 border-red-200' };
  }, [completeDate, complaint?.currentDeadline]);

  const isOverdue = complaint?.currentDeadline && new Date(complaint.currentDeadline) < new Date();
  const progressBarPercent = complaint?.progressPercent || 0;

  // ---- modal openers ----
  const openReceive = () => {
    setReceiveCategoryId(complaint?.categoryId || '');
    setReceiveUrgency(urgency || 'NORMAL');
    setReceiveNeighborhoodId(complaint?.neighborhoodId || '');
    setReceiveAddress(complaint?.address || '');
    setReceiveSlaDays('3');
    setReceiveNote('');
    setReceiveDeptId('');
    setShowReceive(true);
  };

  const openAssign = () => {
    setAssignDeptId('');
    setAssignOfficerId('');
    setAssignSupportIds([]);
    setAssignInternalDeadline('');
    setAssignNote('');
    setShowAssign(true);
  };

  const openProgress = () => {
    setProgressPercent(complaint?.progressPercent || 0);
    setProgressStatus('');
    setProgressWorkDone('');
    setProgressIssues('');
    setProgressNextSteps('');
    setProgressPublicNote('');
    setProgressFiles([]);
    setShowProgress(true);
  };

  const openComplete = () => {
    setCompleteResult('');
    setCompleteConclusion('');
    setCompleteDate(toDatetimeLocal(new Date().toISOString()));
    setCompleteReplyCitizen('');
    setCompleteCost('');
    setCompleteInternalNote('');
    setCompleteDeptIds([]);
    setCompleteFiles([]);
    setShowComplete(true);
  };

  const openLocationEdit = () => {
    setLocNeighborhoodId(complaint?.neighborhoodId || '');
    setLocAddress(complaint?.address || '');
    setLocLat(complaint?.latitude?.toString() || '');
    setLocLng(complaint?.longitude?.toString() || '');
    setShowLocationEdit(true);
  };

  const openExtension = () => {
    setExtNewDeadline('');
    setExtReasonType('');
    setExtReason('');
    setExtPlan('');
    setExtFiles([]);
    setShowExtension(true);
  };

  const toggleSupportOfficer = (uid) => {
    setAssignSupportIds(prev => prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]);
  };

  // ---- submit handlers ----
  const handleReceive = () => {
    if (!complaint) return;
    const now = new Date().toISOString();
    const slaHours = receiveUrgency === 'URGENT' ? 24 : parseInt(receiveSlaDays) * 24;
    const deadline = new Date(new Date().getTime() + slaHours * 3600000).toISOString();

    updateComplaint(complaint.id, {
      status: 'RECEIVED',
      receivedAt: now,
      confirmedUrgency: receiveUrgency,
      categoryId: receiveCategoryId,
      neighborhoodId: receiveNeighborhoodId,
      address: receiveAddress,
      slaType: receiveUrgency === 'URGENT' ? 'URGENT_24_HOURS' : `NORMAL_${slaHours}_HOURS`,
      slaHours,
      originalDeadline: deadline,
      currentDeadline: deadline,
      slaStatus: 'ON_TIME',
      ...(receiveDeptId ? { assignedDepartmentId: receiveDeptId } : {}),
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'COMPLAINT_RECEIVED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { status: complaint.status },
      newValue: { status: 'RECEIVED', urgency: receiveUrgency, deadline },
      internalNote: receiveNote || 'Đã kiểm tra và tiếp nhận phản ánh',
      publicNote: 'Phản ánh đã được tiếp nhận.',
      isPublic: true,
    });
    setShowReceive(false);
  };

  const handleAssign = () => {
    if (!complaint || !assignDeptId || !assignOfficerId) return;
    const now = new Date().toISOString();

    updateComplaint(complaint.id, {
      status: 'ASSIGNED',
      assignedDepartmentId: assignDeptId,
      assignedOfficerId: assignOfficerId,
    });

    addAssignment({
      id: 'ASN-' + Date.now(),
      complaintId: complaint.id,
      departmentId: assignDeptId,
      primaryOfficerId: assignOfficerId,
      supportOfficerIds: assignSupportIds,
      assignedBy: currentUser.id,
      assignedAt: now,
      internalDeadline: assignInternalDeadline || null,
      assignmentNote: assignNote || 'Phân công xử lý phản ánh',
      status: 'ACTIVE',
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: complaint.assignedDepartmentId ? 'REASSIGNED' : 'ASSIGNED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { departmentId: complaint.assignedDepartmentId, officerId: complaint.assignedOfficerId },
      newValue: { departmentId: assignDeptId, officerId: assignOfficerId },
      internalNote: assignNote || 'Phân công xử lý',
      publicNote: 'Phản ánh đã được chuyển đến đơn vị xử lý.',
      isPublic: true,
    });
    setShowAssign(false);
  };

  const handleProgress = () => {
    if (!complaint) return;
    const now = new Date().toISOString();

    updateComplaint(complaint.id, { progressPercent, status: progressStatus || complaint.status });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'PROGRESS_UPDATED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { progressPercent: complaint.progressPercent, status: complaint.status },
      newValue: { progressPercent, status: progressStatus || complaint.status },
      internalNote: [progressWorkDone, progressIssues, progressNextSteps].filter(Boolean).join(' | ') || 'Cập nhật tiến độ xử lý',
      publicNote: progressPublicNote || null,
      isPublic: !!progressPublicNote,
    });
    setShowProgress(false);
  };

  const handleComplete = () => {
    if (!complaint || !completeResult || !completeDate) return;
    const now = new Date().toISOString();
    const compDate = new Date(completeDate).toISOString();
    const slaResult = new Date(compDate) <= new Date(complaint.currentDeadline) ? 'COMPLETED_ON_TIME' : 'COMPLETED_LATE';

    updateComplaint(complaint.id, {
      status: 'COMPLETED',
      completedAt: compDate,
      slaStatus: slaResult,
      progressPercent: 100,
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'COMPLETED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { status: complaint.status },
      newValue: { status: 'COMPLETED', slaResult, resultType: completeResult },
      internalNote: [
        completeResult && `Kết quả: ${COMPLETE_SLA_RESULT_OPTIONS.find(o => o.value === completeResult)?.label || completeResult}`,
        completeConclusion && `Kết luận: ${completeConclusion}`,
        completeCost && `Chi phí: ${completeCost}`,
        completeDeptIds.length > 0 && `Đơn vị phối hợp: ${completeDeptIds.map(id => departments.find(d => d.id === id)?.name).filter(Boolean).join(', ')}`,
        completeInternalNote,
      ].filter(Boolean).join(' | ') || 'Đã hoàn thành xử lý',
      publicNote: completeReplyCitizen || 'Phản ánh đã được xử lý và hoàn thành.',
      isPublic: true,
    });
    setShowComplete(false);
  };

  const handleLocationEdit = () => {
    if (!complaint) return;
    const now = new Date().toISOString();

    updateComplaint(complaint.id, {
      neighborhoodId: locNeighborhoodId,
      address: locAddress,
      latitude: parseFloat(locLat) || complaint.latitude,
      longitude: parseFloat(locLng) || complaint.longitude,
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'LOCATION_UPDATED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { neighborhoodId: complaint.neighborhoodId, address: complaint.address },
      newValue: { neighborhoodId: locNeighborhoodId, address: locAddress },
      internalNote: 'Cập nhật địa điểm phản ánh',
      publicNote: null,
      isPublic: false,
    });
    setShowLocationEdit(false);
  };

  const handleExtension = () => {
    if (!complaint || !extNewDeadline || !extReason || extReason.length < 20) return;
    const now = new Date().toISOString();

    addExtension({
      id: 'EXT-' + Date.now(),
      complaintId: complaint.id,
      requestedBy: currentUser.id,
      requestedAt: now,
      oldDeadline: complaint.currentDeadline,
      requestedDeadline: new Date(extNewDeadline).toISOString(),
      approvedDeadline: null,
      reasonType: extReasonType || 'OTHER',
      reason: extReason,
      processingPlan: extPlan || null,
      status: 'PENDING',
      reviewedBy: null,
      reviewedAt: null,
      reviewNote: null,
    });

    updateComplaint(complaint.id, {
      status: 'EXTENSION_PENDING',
      slaStatus: 'PENDING_EXTENSION',
      extensionCount: (complaint.extensionCount || 0) + 1,
    });

    addHistory({
      id: 'HIS-' + Date.now(),
      complaintId: complaint.id,
      actionType: 'EXTENSION_REQUESTED',
      performedBy: currentUser.id,
      performedRole: currentRole,
      performedAt: now,
      oldValue: { currentDeadline: complaint.currentDeadline },
      newValue: { requestedDeadline: new Date(extNewDeadline).toISOString() },
      internalNote: extReason,
      publicNote: null,
      isPublic: false,
    });
    setShowExtension(false);
  };

  // ---- mock evidence thumbnails ----
  const mockImages = useMemo(() => {
    if (!complaint?.hasImages) return [];
    const count = complaintAttachments.length || 3;
    return Array.from({ length: Math.min(count, 6) }, (_, i) => ({
      id: `img-${i}`,
      url: `/mock/images/sample-${(i % 5) + 1}.jpg`,
      label: `Ảnh ${i + 1}`,
    }));
  }, [complaint?.hasImages, complaintAttachments.length]);

  // ---- mock file add/remove ----
  const addMockFile = (setter) => {
    setter(prev => [...prev, { id: 'f-' + Date.now(), name: `minh-chứng-${prev.length + 1}.jpg`, size: '1.2 MB' }]);
  };

  const removeMockFile = (setter, fileId) => {
    setter(prev => prev.filter(f => f.id !== fileId));
  };

  // ---------------- NOT FOUND ----------------
  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <AlertTriangle className="w-12 h-12 mb-3 text-gray-300" />
        <p className="text-lg font-medium">Không tìm thấy phản ánh</p>
        <button onClick={() => navigate('/admin/complaints')} className="mt-4 text-blue-600 hover:underline text-sm">
          Quay lại danh sách
        </button>
      </div>
    );
  }

  // ---------------- ROLE-BASED ACTION BUTTONS (theo SOS-002 đến SOS-008) ----------------
  const renderActions = () => {
    const actions = [];
    const isReception = currentRole === 'RECEPTION_OFFICER' || currentRole === 'ADMIN';
    const isProcessor = currentRole === 'PROCESSING_OFFICER' || currentRole === 'ADMIN';
    const isApprover = currentRole === 'APPROVER' || currentRole === 'LEADER' || currentRole === 'ADMIN';

    // Cán bộ tiếp nhận (SOS-003, SOS-004): tiếp nhận, từ chối, phân công, sửa địa điểm
    if (isReception) {
      if (complaint.status === 'NEW' || complaint.status === 'PENDING_RECEPTION') {
        actions.push({ key: 'receive', label: 'Tiếp nhận', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', onClick: openReceive });
        actions.push({ key: 'reject', label: 'Từ chối', icon: XCircle, color: 'bg-red-600 hover:bg-red-700', onClick: () => {
          const now = new Date().toISOString();
          updateComplaint(complaint.id, { status: 'REJECTED', completedAt: now, slaStatus: 'NOT_APPLICABLE' });
          addHistory({
            id: 'HIS-' + Date.now(), complaintId: complaint.id, actionType: 'REJECTED',
            performedBy: currentUser.id, performedRole: currentRole, performedAt: now,
            oldValue: { status: complaint.status }, newValue: { status: 'REJECTED' },
            internalNote: 'Phản ánh không hợp lệ hoặc trùng lặp', publicNote: 'Phản ánh không được tiếp nhận.', isPublic: true,
          });
        }});
      }
      if (complaint.status === 'RECEIVED') {
        actions.push({ key: 'assign', label: 'Phân công', icon: UserPlus, color: 'bg-purple-600 hover:bg-purple-700', onClick: openAssign });
      }
      if (complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED') {
        actions.push({ key: 'editLocation', label: 'Chỉnh sửa địa điểm', icon: Edit, color: 'bg-blue-600 hover:bg-blue-700', onClick: openLocationEdit });
      }
    }

    // Cán bộ xử lý (SOS-005, SOS-006, SOS-007): cập nhật tiến độ, đề nghị gia hạn, hoàn thành
    if (isProcessor) {
      if (complaint.status === 'ASSIGNED' || complaint.status === 'IN_PROGRESS') {
        actions.push({ key: 'progress', label: 'Cập nhật tiến độ', icon: BarChart3, color: 'bg-orange-600 hover:bg-orange-700', onClick: openProgress });
        actions.push({ key: 'extend', label: 'Đề nghị gia hạn', icon: Clock, color: 'bg-yellow-600 hover:bg-yellow-700', onClick: openExtension });
        actions.push({ key: 'complete', label: 'Hoàn thành', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', onClick: openComplete });
      }
      if (complaint.status === 'EXTENSION_PENDING') {
        actions.push({ key: 'progress', label: 'Cập nhật tiến độ', icon: BarChart3, color: 'bg-orange-600 hover:bg-orange-700', onClick: openProgress });
        actions.push({ key: 'complete', label: 'Hoàn thành', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', onClick: openComplete });
      }
    }

    // Lãnh đạo / Phê duyệt (SOS-005): xem dashboard, duyệt gia hạn (link sang ExtensionDetail)
    if (isApprover && complaint.status === 'EXTENSION_PENDING') {
      const pendingExt = complaintExtensions.find(e => e.status === 'PENDING');
      if (pendingExt) {
        actions.push({ key: 'reviewExtension', label: 'Phê duyệt gia hạn', icon: Clock, color: 'bg-yellow-600 hover:bg-yellow-700', onClick: () => navigate(`/admin/extensions/${pendingExt.id}`) });
      }
    }

    return actions;
  };

  const actionButtons = renderActions();

  return (
    <div className="space-y-4 min-h-full">
      {/* ======== HEADER (matching original ReportDetailModal style) ======== */}
      <div className="flex items-start gap-3 flex-wrap">
        <button
          onClick={() => navigate('/admin/complaints')}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-colors flex-shrink-0 mt-0.5"
          title="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5 flex-wrap">
            <span className="font-mono font-medium text-blue-600">{complaint.code}</span>
            <StatusBadge status={complaint.status} />
            <UrgencyBadge urgency={urgency} />
            <SlaBadge slaStatus={complaint.slaStatus} />
            {complaint.currentDeadline && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED' && (
              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
                {getTimeRemaining(complaint.currentDeadline)}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">{complaint.title}</h1>
        </div>
      </div>

      {/* ======== TWO-COLUMN LAYOUT ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- LEFT COLUMN (~65%) ---- */}
        <div className="lg:col-span-2 space-y-2">

          {/* Section 1: Thông tin người gửi */}
          <Section title="Thông tin người gửi" icon={User}>
            {citizen ? (
              <>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="font-medium text-gray-900">
                      {showPersonalInfo ? citizen.fullName : '***'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">SĐT:</span>
                    <span className="font-medium text-gray-900">
                      {showPersonalInfo ? citizen.phone : '***'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">Ngày gửi:</span>
                    <span className="text-gray-900">{formatDate(complaint.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPersonalInfo(!showPersonalInfo)}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {showPersonalInfo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  {showPersonalInfo ? 'Ẩn thông tin cá nhân' : 'Hiện thông tin cá nhân'}
                </button>
              </>
            ) : (
              <p className="text-sm text-gray-500">Không có thông tin người gửi</p>
            )}
          </Section>

          {/* Section 2: Nội dung phản ánh */}
          <Section title="Nội dung phản ánh" icon={FileText}>
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <Badge label={category.name} bg="#DBEAFE" color="#1E40AF" />
              )}
              <span className="text-xs text-gray-400">|</span>
              <span className="text-sm text-gray-600 flex items-center gap-1.5">
                Mức độ người dân: <UrgencyBadge urgency={complaint.citizenUrgency} />
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1.5">
                Mức độ xác nhận: {complaint.confirmedUrgency ? <UrgencyBadge urgency={complaint.confirmedUrgency} /> : <span className="text-xs text-gray-400">Chưa xác nhận</span>}
                {(currentRole === 'RECEPTION_OFFICER' && (complaint.status === 'NEW' || complaint.status === 'PENDING_RECEPTION')) && (
                  <button onClick={openReceive} className="text-xs text-blue-600 hover:underline ml-1">Chỉnh sửa</button>
                )}
              </span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-3 rounded-md">
              {complaint.description}
            </div>

            {/* Image gallery */}
            {mockImages.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                  <Image className="w-4 h-4" /> Hình ảnh kèm theo ({mockImages.length})
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {mockImages.map(img => (
                    <div key={img.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Section 3: Địa điểm */}
          <Section
            title="Địa điểm"
            icon={MapPin}
            action={(currentRole === 'RECEPTION_OFFICER' && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED') ? (
              <button
                onClick={e => { e.stopPropagation(); openLocationEdit(); }}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md hover:bg-blue-50 transition-colors"
              >
                <Edit className="w-3 h-3" /> Chỉnh sửa
              </button>
            ) : null}
          >
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Khu phố:</span>
                <span className="font-medium text-gray-900">{neighborhood?.name || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="text-gray-900 truncate max-w-xs">{complaint.address || '—'}</span>
              </div>
              <span className="text-xs text-gray-400">
                Lat: {complaint.latitude?.toFixed(6) || '—'} / Lng: {complaint.longitude?.toFixed(6) || '—'}
              </span>
            </div>
            {/* Mock map */}
            <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">{complaint.address || neighborhood?.name || 'Vị trí phản ánh'}</p>
              </div>
              <span className="absolute bottom-2 right-2 text-xs text-gray-400">Bản đồ (demo)</span>
            </div>
          </Section>

          {/* Section 7: Timeline lịch sử */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Lịch sử xử lý ({complaintHistory.length})
            </h4>
            {complaintHistory.length === 0 ? (
              <p className="text-sm text-gray-500 ml-6">Chưa có lịch sử xử lý</p>
            ) : (
              complaintHistory.map((entry, idx) => (
                <TimelineEntry key={entry.id} entry={entry} isLast={idx === complaintHistory.length - 1} isLatest={idx === 0} />
              ))
            )}
          </div>
        </div>

        {/* ---- RIGHT COLUMN (~35%, matching original card style) ---- */}
        <div className="space-y-4">

          {/* Card 1: Phân công xử lý */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Phân công xử lý
            </h4>
            {assignedDept ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-600">Đơn vị:</span>
                  <span className="font-medium text-gray-900">{assignedDept.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-600">Cán bộ chính:</span>
                  <span className="font-medium text-gray-900">{assignedOfficer?.fullName || '—'}</span>
                </div>
                {supportOfficers.length > 0 && (
                  <div className="flex items-start gap-2">
                    <UserPlus className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">Hỗ trợ:</span>
                    <span className="text-gray-900">{supportOfficers.map(o => o.fullName).join(', ')}</span>
                  </div>
                )}
                {complaintAssignment && (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      <span className="text-gray-600">Ngày phân công:</span>
                      <span className="text-gray-900">{formatDateShort(complaintAssignment.assignedAt)}</span>
                    </div>
                    {complaintAssignment.assignmentNote && (
                      <p className="text-xs text-gray-600 bg-gray-50 rounded-md px-3 py-2">{complaintAssignment.assignmentNote}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa phân công xử lý</p>
            )}
            {(currentRole === 'RECEPTION_OFFICER' || currentRole === 'ADMIN') && (complaint.status === 'RECEIVED' || !assignedDept) && (
              <div className="flex flex-wrap gap-2 pt-3 mt-1 border-t border-gray-100">
                <button onClick={openAssign} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-4 h-4" /> Phân công
                </button>
              </div>
            )}
            {(currentRole === 'RECEPTION_OFFICER' || currentRole === 'APPROVER' || currentRole === 'LEADER' || currentRole === 'ADMIN') && assignedDept && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED' && (
              <div className="flex flex-wrap gap-2 pt-3 mt-1 border-t border-gray-100">
                <button onClick={openAssign} className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <UserPlus className="w-4 h-4" /> Chuyển đơn vị / Thay cán bộ
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Thời hạn xử lý */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Thời hạn xử lý
            </h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Quy định thời hạn:</span>
                <span className="font-medium text-gray-900">
                  {complaint.slaType === 'URGENT_24_HOURS' ? 'Khẩn cấp (24h)' : `Thường (${complaint.slaHours || '?'}h)`}
                </span>
              </div>
              {complaint.originalDeadline && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Hạn gốc:</span>
                  <span className="text-gray-900">{formatDate(complaint.originalDeadline)}</span>
                </div>
              )}
              {complaint.currentDeadline && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Hạn hiện tại:</span>
                  <span className={`font-mono font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(complaint.currentDeadline)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Số lần gia hạn:</span>
                <span className="font-medium text-gray-900">{complaint.extensionCount || 0}</span>
              </div>

              {/* Progress bar for remaining time */}
              {complaint.currentDeadline && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED' && complaint.originalDeadline && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Đã sử dụng</span>
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>{getTimeRemaining(complaint.currentDeadline)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${isOverdue ? 'bg-red-500' : 'bg-blue-600'}`}
                      style={{ width: `${Math.min(100, Math.max(0, progressBarPercent))}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Extension pending status */}
              {pendingExtension && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-orange-800">Yêu cầu gia hạn đang chờ duyệt</span>
                  </div>
                  <p className="text-xs text-orange-700">
                    Hạn đề nghị: {formatDate(pendingExtension.requestedDeadline)}
                  </p>
                  <button
                    onClick={() => navigate(`/admin/extensions/${pendingExtension.id}`)}
                    className="text-xs font-medium text-orange-600 hover:text-orange-800 underline"
                  >
                    Xem chi tiết
                  </button>
                </div>
              )}

              {/* Show approved/rejected extensions */}
              {complaintExtensions.filter(e => e.status !== 'PENDING').length > 0 && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1.5">Lịch sử gia hạn</h4>
                  <div className="space-y-1.5">
                    {complaintExtensions.filter(e => e.status !== 'PENDING').map(e => (
                      <div key={e.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded-lg px-3 py-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${e.status === 'APPROVED' ? 'bg-green-600' : 'bg-red-600'}`} />
                        <span className={e.status === 'APPROVED' ? 'text-green-700' : 'text-red-700'}>
                          {e.status === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'} — {formatDateShort(e.requestedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Cập nhật xử lý */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Cập nhật xử lý
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
              <span className="text-gray-500">Tiến độ:</span>
              <SlaBadge slaStatus={complaint.slaStatus} />
            </div>

              {/* Progress meter */}
              {complaint.progressPercent > 0 && complaint.status !== 'COMPLETED' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tiến độ</span>
                    <span className="font-medium">{complaint.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{ width: `${complaint.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {actionButtons.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  {actionButtons.map(a => (
                    <button
                      key={a.key}
                      onClick={a.onClick}
                      className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-colors shadow-sm ${a.color}`}
                    >
                      <a.icon className="w-4 h-4" />
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
              {actionButtons.length === 0 && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED' && (
                <p className="text-sm text-gray-400 italic">Bạn không có quyền thao tác với phản ánh này</p>
              )}
              {(complaint.status === 'COMPLETED' || complaint.status === 'REJECTED') && (
                <p className="text-sm text-gray-400 italic">Phản ánh đã kết thúc xử lý</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======== MODALS ======== */}

      {/* a) ReceiveModal */}
      {showReceive && (
        <Modal title="Tiếp nhận phản ánh" icon={CheckCircle} onClose={() => setShowReceive(false)}>
          <Field label="Danh mục">
            <select value={receiveCategoryId} onChange={e => setReceiveCategoryId(e.target.value)} className={selectCls}>
              {categories.filter(c => c.status === 'ACTIVE').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          <Field label="Mức độ xác nhận">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="receiveUrgency" value="NORMAL" checked={receiveUrgency === 'NORMAL'} onChange={e => setReceiveUrgency(e.target.value)} className="text-blue-600" />
                Thường
              </label>
              <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                <input type="radio" name="receiveUrgency" value="URGENT" checked={receiveUrgency === 'URGENT'} onChange={e => setReceiveUrgency(e.target.value)} className="text-red-600" />
                Khẩn cấp
              </label>
            </div>
            {urgency === 'NORMAL' && receiveUrgency === 'URGENT' && (
              <div className="mt-2 flex items-start gap-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Bạn đang nâng mức độ từ "Thường" lên "Khẩn cấp". Hạn xử lý sẽ rút ngắn còn 24 giờ.</span>
              </div>
            )}
          </Field>

          <Field label="Khu phố">
            <select value={receiveNeighborhoodId} onChange={e => setReceiveNeighborhoodId(e.target.value)} className={selectCls}>
              {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </Field>

          <Field label="Địa chỉ chuẩn hóa">
            <input type="text" value={receiveAddress} onChange={e => setReceiveAddress(e.target.value)}
              className={inputCls} placeholder="Địa chỉ cụ thể..." />
          </Field>

          {receiveUrgency === 'NORMAL' && (
            <Field label="Thời hạn xử lý">
              <div className="flex gap-4 flex-wrap">
                {SLA_HOURS_OPTIONS.map(o => (
                  <label key={o.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" name="slaDays" value={o.value} checked={receiveSlaDays === o.value} onChange={e => setReceiveSlaDays(e.target.value)} className="text-blue-600" />
                    {o.label}
                  </label>
                ))}
              </div>
            </Field>
          )}

          <Field label="Đơn vị xử lý sơ bộ">
            <select value={receiveDeptId} onChange={e => setReceiveDeptId(e.target.value)} className={selectCls}>
              <option value="">Chọn đơn vị (tùy chọn)...</option>
              {departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>

          <Field label="Ghi chú nội bộ">
            <textarea value={receiveNote} onChange={e => setReceiveNote(e.target.value)} rows={3}
              className={textareaCls} placeholder="Ghi chú cho quá trình tiếp nhận..." />
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowReceive(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleReceive}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Xác nhận tiếp nhận
            </button>
          </div>
        </Modal>
      )}

      {/* b) AssignModal */}
      {showAssign && (
        <Modal title="Phân công xử lý" icon={UserPlus} onClose={() => setShowAssign(false)}>
          <Field label="Đơn vị xử lý">
            <select value={assignDeptId} onChange={e => { setAssignDeptId(e.target.value); setAssignOfficerId(''); setAssignSupportIds([]); }}
              className={selectCls}>
              <option value="">Chọn đơn vị...</option>
              {departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </Field>

          {assignDeptId && (
            <Field label="Cán bộ chính">
              <select value={assignOfficerId} onChange={e => setAssignOfficerId(e.target.value)} className={selectCls}>
                <option value="">Chọn cán bộ...</option>
                {officersForDept.map(o => <option key={o.id} value={o.id}>{o.fullName}</option>)}
              </select>
            </Field>
          )}

          {assignDeptId && officersForDept.length > 1 && (
            <Field label="Cán bộ hỗ trợ">
              <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {officersForDept.filter(o => o.id !== assignOfficerId).map(o => (
                  <label key={o.id} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                    <input type="checkbox" checked={assignSupportIds.includes(o.id)} onChange={() => toggleSupportOfficer(o.id)} className="rounded border-gray-300 text-blue-600" />
                    {o.fullName}
                  </label>
                ))}
                {officersForDept.filter(o => o.id !== assignOfficerId).length === 0 && (
                  <p className="text-xs text-gray-400 p-1">Không có cán bộ khác trong đơn vị</p>
                )}
              </div>
            </Field>
          )}

          <Field label="Hạn nội bộ (tùy chọn)">
            <input type="datetime-local" value={assignInternalDeadline} onChange={e => setAssignInternalDeadline(e.target.value)}
              className={inputCls} />
          </Field>

          <Field label="Ghi chú phân công">
            <textarea value={assignNote} onChange={e => setAssignNote(e.target.value)} rows={2}
              className={textareaCls} placeholder="Ghi chú cho cán bộ xử lý..." />
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAssign(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleAssign} disabled={!assignDeptId || !assignOfficerId}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" /> Xác nhận phân công
            </button>
          </div>
        </Modal>
      )}

      {/* c) ProgressModal */}
      {showProgress && (
        <Modal title="Cập nhật tiến độ" icon={BarChart3} onClose={() => setShowProgress(false)}>
          <Field label="Tiến độ xử lý">
            <select value={progressPercent} onChange={e => setProgressPercent(Number(e.target.value))} className={selectCls}>
              {PROGRESS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </Field>

          <Field label="Trạng thái mới (tùy chọn)">
            <select value={progressStatus} onChange={e => setProgressStatus(e.target.value)} className={selectCls}>
              <option value="">Giữ nguyên</option>
              <option value="ASSIGNED">Đã phân công</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
            </select>
          </Field>

          <Field label="Công việc đã thực hiện">
            <textarea value={progressWorkDone} onChange={e => setProgressWorkDone(e.target.value)} rows={2}
              className={textareaCls} placeholder="Mô tả công việc đã làm..." />
          </Field>

          <Field label="Khó khăn / Vướng mắc">
            <textarea value={progressIssues} onChange={e => setProgressIssues(e.target.value)} rows={2}
              className={textareaCls} placeholder="Các khó khăn gặp phải..." />
          </Field>

          <Field label="Bước tiếp theo">
            <textarea value={progressNextSteps} onChange={e => setProgressNextSteps(e.target.value)} rows={2}
              className={textareaCls} placeholder="Kế hoạch các bước tiếp theo..." />
          </Field>

          <Field label="Ghi chú công khai cho người dân">
            <textarea value={progressPublicNote} onChange={e => setProgressPublicNote(e.target.value)} rows={2}
              className={textareaCls} placeholder="Thông báo đến người dân..." />
          </Field>

          <Field label="Minh chứng (mock)">
            <div className="flex flex-wrap gap-2 mb-2">
              {progressFiles.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 text-xs bg-gray-100 rounded-lg px-2 py-1">
                  <Paperclip className="w-3 h-3 text-gray-400" /> {f.name}
                  <button onClick={() => removeMockFile(setProgressFiles, f.id)} className="text-red-400 hover:text-red-600"><XCircle className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addMockFile(setProgressFiles)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
              <Paperclip className="w-3.5 h-3.5" /> Thêm minh chứng
            </button>
          </Field>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowProgress(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleProgress}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Cập nhật tiến độ
            </button>
          </div>
        </Modal>
      )}

      {/* d) CompleteModal */}
      {showComplete && (
        <Modal title="Hoàn thành xử lý" icon={CheckCircle} onClose={() => setShowComplete(false)}>
          <Field label="Kết quả xử lý" required>
            <select value={completeResult} onChange={e => setCompleteResult(e.target.value)} className={selectCls}>
              <option value="">Chọn kết quả...</option>
              {COMPLETE_SLA_RESULT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          <Field label="Kết luận">
            <textarea value={completeConclusion} onChange={e => setCompleteConclusion(e.target.value)} rows={2}
              className={textareaCls} placeholder="Kết luận về kết quả xử lý..." />
          </Field>

          <Field label="Thời gian hoàn thành" required>
            <input type="datetime-local" value={completeDate} onChange={e => setCompleteDate(e.target.value)}
              className={inputCls} />
          </Field>

          {/* SLA preview */}
          {slaPreview && (
            <div className={`rounded-lg p-3 border ${slaPreview.bg}`}>
              <p className={`text-sm font-medium ${slaPreview.color}`}>
                Dự kiến: {slaPreview.label}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Hạn xử lý: {formatDate(complaint.currentDeadline)}
              </p>
            </div>
          )}

          <Field label="Phản hồi cho người dân">
            <textarea value={completeReplyCitizen} onChange={e => setCompleteReplyCitizen(e.target.value)} rows={2}
              className={textareaCls} placeholder="Thông báo kết quả đến người dân..." />
          </Field>

          <Field label="Chi phí (tùy chọn)">
            <input type="text" value={completeCost} onChange={e => setCompleteCost(e.target.value)}
              className={inputCls} placeholder="VND..." />
          </Field>

          <Field label="Đơn vị phối hợp">
            <div className="space-y-1 max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => (
                <label key={d.id} className="flex items-center gap-2 text-sm cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={completeDeptIds.includes(d.id)}
                    onChange={() => setCompleteDeptIds(prev => prev.includes(d.id) ? prev.filter(id => id !== d.id) : [...prev, d.id])}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  {d.name}
                </label>
              ))}
              {departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').length === 0 && (
                <p className="text-xs text-gray-400 p-1">Không có đơn vị khả dụng</p>
              )}
            </div>
          </Field>

          <Field label="Ghi chú nội bộ">
            <textarea value={completeInternalNote} onChange={e => setCompleteInternalNote(e.target.value)} rows={2}
              className={textareaCls} placeholder="Ghi chú nội bộ, không hiển thị cho người dân..." />
          </Field>

          <Field label="Minh chứng hoàn thành" required>
            <span className="text-xs text-gray-400">(mock)</span>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {completeFiles.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 text-xs bg-gray-100 rounded-lg px-2 py-1">
                  <Paperclip className="w-3 h-3 text-gray-400" /> {f.name}
                  <button onClick={() => removeMockFile(setCompleteFiles, f.id)} className="text-red-400 hover:text-red-600"><XCircle className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addMockFile(setCompleteFiles)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
              <Paperclip className="w-3.5 h-3.5" /> Thêm minh chứng
            </button>
          </Field>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 inline mr-1.5" />
            Sau khi hoàn thành, phản ánh sẽ chuyển sang trạng thái "Hoàn thành" và không thể chỉnh sửa thêm. Xác nhận tiếp tục?
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowComplete(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleComplete} disabled={!completeResult || !completeDate || completeFiles.length === 0}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" /> Xác nhận hoàn thành
            </button>
          </div>
        </Modal>
      )}

      {/* e) LocationEditModal */}
      {showLocationEdit && (
        <Modal title="Chỉnh sửa địa điểm" icon={MapPin} onClose={() => setShowLocationEdit(false)}>
          <Field label="Khu phố">
            <select value={locNeighborhoodId} onChange={e => setLocNeighborhoodId(e.target.value)} className={selectCls}>
              {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </Field>

          <Field label="Địa chỉ">
            <input type="text" value={locAddress} onChange={e => setLocAddress(e.target.value)}
              className={inputCls} placeholder="Nhập địa chỉ cụ thể..." />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Vĩ độ (Lat)">
              <input type="number" step="0.000001" value={locLat} onChange={e => setLocLat(e.target.value)}
                className={inputCls} />
            </Field>
            <Field label="Kinh độ (Lng)">
              <input type="number" step="0.000001" value={locLng} onChange={e => setLocLng(e.target.value)}
                className={inputCls} />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowLocationEdit(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleLocationEdit}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Cập nhật địa điểm
            </button>
          </div>
        </Modal>
      )}

      {/* f) ExtensionRequestModal */}
      {showExtension && (
        <Modal title="Đề nghị gia hạn" icon={Clock} onClose={() => setShowExtension(false)}>
          <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">Hạn hiện tại:</span>
            <span className={`font-mono font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDate(complaint.currentDeadline)}
            </span>
          </div>

          <Field label="Hạn gia hạn mới" required>
            <input type="datetime-local" value={extNewDeadline} onChange={e => setExtNewDeadline(e.target.value)}
              className={inputCls} />
          </Field>

          <Field label="Loại lý do">
            <select value={extReasonType} onChange={e => setExtReasonType(e.target.value)} className={selectCls}>
              <option value="">Chọn lý do...</option>
              {EXT_REASON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>

          <Field label="Lý do gia hạn" required>
            <span className="text-xs text-gray-400">(tối thiểu 20 ký tự)</span>
            <textarea value={extReason} onChange={e => setExtReason(e.target.value)} rows={3}
              className={textareaCls} placeholder="Nêu rõ lý do cần gia hạn..." style={{ marginTop: '0.25rem' }} />
            {extReason.length > 0 && extReason.length < 20 && (
              <p className="text-xs text-red-500 mt-1">Cần ít nhất 20 ký tự (hiện tại: {extReason.length})</p>
            )}
          </Field>

          <Field label="Kế hoạch xử lý sau gia hạn">
            <textarea value={extPlan} onChange={e => setExtPlan(e.target.value)} rows={2}
              className={textareaCls} placeholder="Kế hoạch hoàn thành trong thời gian gia hạn..." />
          </Field>

          <Field label="Minh chứng đính kèm">
            <span className="text-xs text-gray-400">(mock)</span>
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {extFiles.map(f => (
                <div key={f.id} className="flex items-center gap-1.5 text-xs bg-gray-100 rounded-lg px-2 py-1">
                  <Paperclip className="w-3 h-3 text-gray-400" /> {f.name}
                  <button onClick={() => removeMockFile(setExtFiles, f.id)} className="text-red-400 hover:text-red-600"><XCircle className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <button onClick={() => addMockFile(setExtFiles)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800">
              <Paperclip className="w-3.5 h-3.5" /> Thêm minh chứng
            </button>
          </Field>

          {isOverdue && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Phản ánh này đã quá hạn. Đề nghị gia hạn sẽ được lưu trong lịch sử xử lý.</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowExtension(false)} className={cancelBtnCls}>Hủy</button>
            <button onClick={handleExtension} disabled={!extNewDeadline || extReason.length < 20}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" /> Gửi đề nghị gia hạn
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
