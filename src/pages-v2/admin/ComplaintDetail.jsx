// ============================================================
// COMPLAINT DETAIL — Chi tiết phản ánh (admin view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock,
  MessageSquare, Image, FileText, MoreVertical, Edit, UserPlus,
  CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp,
  Send, Paperclip, Download, Eye, EyeOff, Building2, BarChart3,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getComplaintById, getHistoryByComplaint, getExtensionsByComplaint,
  getAttachmentsByComplaint, getAssignmentByComplaint, getUserById,
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getStatusLabel, getStatusColor, getSlaLabel, getSlaColor,
  getUrgencyLabel, getActionTypeLabel, getTimeRemaining,
  users, departments, categories, neighborhoods,
} from '../../mock/db';
import { StatusBadge, SlaBadge, UrgencyBadge, SlaStatusIcon } from '../../mock/components/Badges';

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

// ---- Collapsible section wrapper ----
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

// ---- Modal wrapper ----
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

// ---- Timeline entry ----
function TimelineEntry({ entry, isLast, isLatest }) {
  const actor = getUserById(entry.performedBy);
  // ponytail: simple dot — blue for latest, gray otherwise
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
          {entry.isPublic !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${entry.isPublic ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
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
            <span className="text-gray-400 line-through">{typeof entry.oldValue === 'object' ? (entry.oldValue.status ? getStatusLabel(entry.oldValue.status) : JSON.stringify(entry.oldValue)) : entry.oldValue}</span>
            <span className="mx-1 text-gray-300">→</span>
            <span className="font-medium text-gray-700">{typeof entry.newValue === 'object' ? (entry.newValue.status ? getStatusLabel(entry.newValue.status) : JSON.stringify(entry.newValue)) : entry.newValue}</span>
          </p>
        )}
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

    const changes = {
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
    };

    updateComplaint(complaint.id, changes);
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

    const asnId = 'ASN-' + Date.now();
    addAssignment({
      id: asnId,
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

    const extId = 'EXT-' + Date.now();
    addExtension({
      id: extId,
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

  // ---- mock file add ----
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

  // ---------------- ROLE-BASED ACTION BUTTONS ----------------
  const renderActions = () => {
    const actions = [];
    if (currentRole === 'RECEPTION_OFFICER') {
      if (complaint.status === 'NEW' || complaint.status === 'PENDING_RECEPTION') {
        actions.push({ key: 'receive', label: 'Tiếp nhận', icon: CheckCircle, color: 'bg-green-600 hover:bg-green-700', onClick: openReceive });
        actions.push({ key: 'reject', label: 'Từ chối', icon: XCircle, color: 'bg-red-600 hover:bg-red-700', onClick: () => {
          // ponytail: simple reject — update status + add history
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
    if (currentRole === 'PROCESSING_OFFICER') {
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
    if (currentRole === 'APPROVER' || currentRole === 'LEADER') {
      actions.push({ key: 'dashboard', label: 'Xem dashboard', icon: BarChart3, color: 'bg-blue-600 hover:bg-blue-700', onClick: () => navigate('/admin/dashboard') });
    }
    return actions;
  };

  const actionButtons = renderActions();

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* ======== HEADER ======== */}
      <div className="flex items-start gap-3 flex-wrap">
        <button
          onClick={() => navigate('/admin/complaints')}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-700 transition-colors flex-shrink-0 mt-0.5"
          title="Quay lại"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-0.5">
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
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">{complaint.title}</h1>
        </div>
      </div>

      {/* ======== TWO-COLUMN LAYOUT ======== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ---- LEFT COLUMN (65% ~ 2/3) ---- */}
        <div className="lg:col-span-2 space-y-4">

          {/* Section 1: Thông tin người gửi */}
          <Section title="Thông tin người gửi" icon={User}>
            {citizen ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Họ tên:</span>
                  <span className="font-medium text-gray-900">
                    {showPersonalInfo ? citizen.fullName : '***'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">SĐT:</span>
                  <span className="font-medium text-gray-900">
                    {showPersonalInfo ? citizen.phone : '***'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium text-gray-900">
                    {showPersonalInfo ? citizen.email : '***'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Ngày gửi:</span>
                  <span className="text-gray-900">{formatDate(complaint.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Không có thông tin người gửi</p>
            )}
            <button
              onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showPersonalInfo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showPersonalInfo ? 'Ẩn thông tin cá nhân' : 'Hiện thông tin cá nhân'}
            </button>
          </Section>

          {/* Section 2: Nội dung phản ánh */}
          <Section title="Nội dung phản ánh" icon={FileText}>
            <div className="flex flex-wrap items-center gap-3">
              {category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  {category.name}
                </span>
              )}
              <span className="text-xs text-gray-400">|</span>
              <span className="text-sm text-gray-600">
                Mức độ người dân: <UrgencyBadge urgency={complaint.citizenUrgency} />
              </span>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                Mức độ xác nhận: {complaint.confirmedUrgency ? <UrgencyBadge urgency={complaint.confirmedUrgency} /> : <span className="text-xs text-gray-400">Chưa xác nhận</span>}
                {(currentRole === 'RECEPTION_OFFICER' && (complaint.status === 'NEW' || complaint.status === 'PENDING_RECEPTION')) && (
                  <button onClick={openReceive} className="text-xs text-blue-600 hover:underline ml-1">Chỉnh sửa</button>
                )}
              </span>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
              {complaint.description}
            </div>

            {/* Image gallery */}
            {mockImages.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Image className="w-3.5 h-3.5" /> Hình ảnh kèm theo ({mockImages.length})
                </h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500">Khu phố:</span>
                <span className="font-medium text-gray-900">{neighborhood?.name || '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-500">Địa chỉ:</span>
                <span className="text-gray-900 truncate">{complaint.address || '—'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Lat: {complaint.latitude?.toFixed(6) || '—'}</span>
                <span>Lng: {complaint.longitude?.toFixed(6) || '—'}</span>
              </div>
            </div>
            {/* Mock map */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg h-40 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-red-400 mx-auto" />
                <p className="text-xs text-gray-500 mt-1">{complaint.address || neighborhood?.name || 'Vị trí phản ánh'}</p>
              </div>
              <span className="absolute bottom-2 right-2 text-xs text-gray-400">Bản đồ (demo)</span>
            </div>
          </Section>

          {/* Section 7: Timeline */}
          <Section title="Lịch sử xử lý" icon={Clock} defaultOpen>
            {complaintHistory.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có lịch sử xử lý</p>
            ) : (
              <div className="space-y-0">
                {complaintHistory.map((entry, idx) => (
                  <TimelineEntry key={entry.id} entry={entry} isLast={idx === complaintHistory.length - 1} isLatest={idx === 0} />
                ))}
              </div>
            )}
          </Section>
        </div>

        {/* ---- RIGHT COLUMN (35% ~ 1/3) ---- */}
        <div className="space-y-4">

          {/* Section 4: Phân công xử lý */}
          <Section title="Phân công xử lý" icon={UserPlus}>
            {assignedDept ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Đơn vị:</span>
                  <span className="font-medium text-gray-900">{assignedDept.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-500">Cán bộ chính:</span>
                  <span className="font-medium text-gray-900">{assignedOfficer?.fullName || '—'}</span>
                </div>
                {supportOfficers.length > 0 && (
                  <div className="flex items-start gap-2">
                    <UserPlus className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-500">Hỗ trợ:</span>
                    <span className="text-gray-900">{supportOfficers.map(o => o.fullName).join(', ')}</span>
                  </div>
                )}
                {complaintAssignment && (
                  <>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">Ngày phân công:</span>
                      <span className="text-gray-900">{formatDateShort(complaintAssignment.assignedAt)}</span>
                    </div>
                    {complaintAssignment.assignmentNote && (
                      <p className="text-xs text-gray-600 bg-gray-50 rounded px-3 py-2">{complaintAssignment.assignmentNote}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Chưa phân công xử lý</p>
            )}
            {currentRole === 'RECEPTION_OFFICER' && (complaint.status === 'RECEIVED' || !assignedDept) && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={openAssign} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Phân công
                </button>
              </div>
            )}
            {(currentRole === 'RECEPTION_OFFICER' || currentRole === 'APPROVER' || currentRole === 'LEADER') && assignedDept && complaint.status !== 'COMPLETED' && complaint.status !== 'REJECTED' && (
              <div className="flex flex-wrap gap-2 pt-1">
                <button onClick={openAssign} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Chuyển đơn vị / Thay cán bộ
                </button>
              </div>
            )}
          </Section>

          {/* Section 5: Thời hạn xử lý */}
          <Section title="Thời hạn xử lý" icon={Clock}>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Loại SLA:</span>
                <span className="font-medium text-gray-900">
                  {complaint.slaType === 'URGENT_24_HOURS' ? 'Khẩn cấp (24h)' : `Thường (${complaint.slaHours || '?'}h)`}
                </span>
              </div>
              {complaint.originalDeadline && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Hạn gốc:</span>
                  <span className="text-gray-900">{formatDate(complaint.originalDeadline)}</span>
                </div>
              )}
              {complaint.currentDeadline && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Hạn hiện tại:</span>
                  <span className={`font-mono font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(complaint.currentDeadline)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Số lần gia hạn:</span>
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
          </Section>

          {/* Section 6: Cập nhật xử lý */}
          <Section title="Cập nhật xử lý" icon={MessageSquare}>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Trạng thái hiện tại:</span>
                <StatusBadge status={complaint.status} />
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
                <div className="flex flex-col gap-2">
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
          </Section>
        </div>
      </div>

      {/* ======== MODALS ======== */}

      {/* a) ReceiveModal */}
      {showReceive && (
        <Modal title="Tiếp nhận phản ánh" icon={CheckCircle} onClose={() => setShowReceive(false)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select value={receiveCategoryId} onChange={e => setReceiveCategoryId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {categories.filter(c => c.status === 'ACTIVE').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mức độ xác nhận</label>
            <div className="flex gap-3">
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
                <span>Bạn đang nâng mức độ từ &quot;Thường&quot; lên &quot;Khẩn cấp&quot;. Hạn xử lý sẽ rút ngắn còn 24 giờ.</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khu phố</label>
            <select value={receiveNeighborhoodId} onChange={e => setReceiveNeighborhoodId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chuẩn hóa</label>
            <input type="text" value={receiveAddress} onChange={e => setReceiveAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Địa chỉ cụ thể..." />
          </div>

          {receiveUrgency === 'NORMAL' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời hạn xử lý (SLA)</label>
              <div className="flex gap-3">
                {SLA_HOURS_OPTIONS.map(o => (
                  <label key={o.value} className="flex items-center gap-1.5 text-sm cursor-pointer">
                    <input type="radio" name="slaDays" value={o.value} checked={receiveSlaDays === o.value} onChange={e => setReceiveSlaDays(e.target.value)} className="text-blue-600" />
                    {o.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú nội bộ</label>
            <textarea value={receiveNote} onChange={e => setReceiveNote(e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ghi chú cho quá trình tiếp nhận..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowReceive(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị xử lý</label>
            <select value={assignDeptId} onChange={e => { setAssignDeptId(e.target.value); setAssignOfficerId(''); setAssignSupportIds([]); }}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn đơn vị...</option>
              {departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          {assignDeptId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cán bộ chính</label>
              <select value={assignOfficerId} onChange={e => setAssignOfficerId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Chọn cán bộ...</option>
                {officersForDept.map(o => <option key={o.id} value={o.id}>{o.fullName}</option>)}
              </select>
            </div>
          )}

          {assignDeptId && officersForDept.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cán bộ hỗ trợ</label>
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
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn nội bộ <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
            <input type="datetime-local" value={assignInternalDeadline} onChange={e => setAssignInternalDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú phân công</label>
            <textarea value={assignNote} onChange={e => setAssignNote(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Ghi chú cho cán bộ xử lý..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowAssign(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiến độ xử lý</label>
            <select value={progressPercent} onChange={e => setProgressPercent(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {PROGRESS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái mới <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
            <select value={progressStatus} onChange={e => setProgressStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Giữ nguyên</option>
              <option value="ASSIGNED">Đã phân công</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Công việc đã thực hiện</label>
            <textarea value={progressWorkDone} onChange={e => setProgressWorkDone(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Mô tả công việc đã làm..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khó khăn / Vướng mắc</label>
            <textarea value={progressIssues} onChange={e => setProgressIssues(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Các khó khăn gặp phải..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bước tiếp theo</label>
            <textarea value={progressNextSteps} onChange={e => setProgressNextSteps(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Kế hoạch các bước tiếp theo..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú công khai cho người dân</label>
            <textarea value={progressPublicNote} onChange={e => setProgressPublicNote(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Thông báo đến người dân..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minh chứng (mock)</label>
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
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowProgress(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kết quả xử lý <span className="text-red-500">*</span>
            </label>
            <select value={completeResult} onChange={e => setCompleteResult(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn kết quả...</option>
              {COMPLETE_SLA_RESULT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kết luận</label>
            <textarea value={completeConclusion} onChange={e => setCompleteConclusion(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Kết luận về kết quả xử lý..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian hoàn thành <span className="text-red-500">*</span>
            </label>
            <input type="datetime-local" value={completeDate} onChange={e => setCompleteDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          {/* SLA preview */}
          {slaPreview && (
            <div className={`rounded-lg p-3 border ${slaPreview.bg}`}>
              <p className={`text-sm font-medium ${slaPreview.color}`}>
                Dự kiến: {slaPreview.label}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Hạn SLA: {formatDate(complaint.currentDeadline)}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phản hồi cho người dân</label>
            <textarea value={completeReplyCitizen} onChange={e => setCompleteReplyCitizen(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Thông báo kết quả đến người dân..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chi phí <span className="text-gray-400 font-normal">(tùy chọn)</span></label>
            <input type="text" value={completeCost} onChange={e => setCompleteCost(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VND..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minh chứng hoàn thành <span className="text-red-500">*</span> (mock)</label>
            <div className="flex flex-wrap gap-2 mb-2">
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
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 inline mr-1.5" />
            Sau khi hoàn thành, phản ánh sẽ chuyển sang trạng thái &quot;Hoàn thành&quot; và không thể chỉnh sửa thêm. Xác nhận tiếp tục?
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowComplete(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khu phố</label>
            <select value={locNeighborhoodId} onChange={e => setLocNeighborhoodId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input type="text" value={locAddress} onChange={e => setLocAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập địa chỉ cụ thể..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Lat)</label>
              <input type="number" step="0.000001" value={locLat} onChange={e => setLocLat(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Lng)</label>
              <input type="number" step="0.000001" value={locLng} onChange={e => setLocLng(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowLocationEdit(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Hạn hiện tại:</span>
            <span className={`font-mono font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
              {formatDate(complaint.currentDeadline)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hạn gia hạn mới <span className="text-red-500">*</span>
            </label>
            <input type="datetime-local" value={extNewDeadline} onChange={e => setExtNewDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại lý do</label>
            <select value={extReasonType} onChange={e => setExtReasonType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Chọn lý do...</option>
              {EXT_REASON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do gia hạn <span className="text-red-500">*</span>
              <span className="text-gray-400 font-normal text-xs ml-1">(tối thiểu 20 ký tự)</span>
            </label>
            <textarea value={extReason} onChange={e => setExtReason(e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Nêu rõ lý do cần gia hạn..." />
            {extReason.length > 0 && extReason.length < 20 && (
              <p className="text-xs text-red-500 mt-1">Cần ít nhất 20 ký tự (hiện tại: {extReason.length})</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kế hoạch xử lý sau gia hạn</label>
            <textarea value={extPlan} onChange={e => setExtPlan(e.target.value)} rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Kế hoạch hoàn thành trong thời gian gia hạn..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minh chứng đính kèm (mock)</label>
            <div className="flex flex-wrap gap-2 mb-2">
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
          </div>

          {isOverdue && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Phản ánh này đã quá hạn. Đề nghị gia hạn sẽ được lưu trong lịch sử xử lý.</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowExtension(false)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Hủy</button>
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
