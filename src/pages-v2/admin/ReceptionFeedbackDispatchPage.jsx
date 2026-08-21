import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, MonitorUp, MoreHorizontal, Eye, Check, X, AlertTriangle, Search, Filter, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import RECEPTION_API from '../../apis/reception';
import LEADER_MEETING_API from '../../apis/leaderMeeting';
import { message, Dropdown, Modal } from 'antd';
import { useMock } from '../../mock/MockContext';
import {
  announceReceptionFeedback,
  readActiveReceptionFeedback,
  RECEPTION_FEEDBACK_SESSION_EVENT,
} from '../../citizen/data/receptionFeedbackSession';
import {
  RECEPTION_FEEDBACK_STORAGE_KEY,
  RECEPTION_FEEDBACK_UPDATED_EVENT,
} from '../kiosk/ReceptionKiosk';
import {
  DetailField,
  DetailGrid,
  DetailSection,
  TicketDetailContent,
  TicketDetailModal,
} from '../../components/base/TicketDetailForm';

export const RECEPTION_DEPARTMENTS = [
  { value: '', label: 'Tất cả quầy / phòng ban' },
  { value: 'QUAY_1', label: 'Quầy 1: Hộ tịch - Tư pháp' },
  { value: 'QUAY_2', label: 'Quầy 2: Địa chính - Xây dựng' },
  { value: 'QUAY_3', label: 'Quầy 3: Lao động - Thương binh - Xã hội' },
  { value: 'QUAY_4', label: 'Quầy 4: Tài chính - Kế hoạch' },
  { value: 'QUAY_5', label: 'Quầy 5: Công an phường' },
  { value: 'QUAY_6', label: 'Quầy 6: Bảo hiểm xã hội' },
  { value: 'QUAY_7', label: 'Quầy 7: Đăng ký kinh doanh' },
  { value: 'QUAY_8', label: 'Quầy 8: Tiếp nhận chung' },
];

export default function ReceptionFeedbackDispatchPage({ title, description, queue, allowedRoles, eyebrow }) {
  const { currentUser } = useMock();
  const role = currentUser?.role || 'CITIZEN';
  const isLeaderMeeting = queue[0]?.feedbackType === 'LEADER_MEETING';
  const labels = useMemo(() => (isLeaderMeeting
    ? {
      listTitle: 'Danh sách đơn đăng ký gặp lãnh đạo',
      listDescription: 'Mở mã đơn để xem lịch hẹn, lý do gặp và lãnh đạo tiếp trước khi mời đánh giá trên iPad.',
      code: 'Mã đơn gặp lãnh đạo',
      date: 'Ngày / giờ gặp',
      topic: 'Lý do gặp lãnh đạo',
      approve: 'Phê duyệt lịch gặp',
      approved: 'Đã phê duyệt lịch',
      invite: 'Mời đánh giá buổi gặp',
      detailTitle: 'Chi tiết đơn gặp lãnh đạo',
      detailSubtitle: 'Đơn đăng ký gặp lãnh đạo',
      detailDescription: 'Lý do gặp lãnh đạo',
      receptionInfo: 'Thông tin lịch gặp',
      leaderSection: 'Thông tin lãnh đạo và lịch hẹn',
    }
    : {
      listTitle: 'Danh sách đơn tiếp dân tại quầy',
      listDescription: 'Mở mã đơn để xem nội dung, phân công quầy và phê duyệt trước khi mời người dân đánh giá trên iPad.',
      code: 'Mã đơn tiếp dân',
      date: 'Ngày / giờ tiếp',
      topic: 'Nội dung làm việc',
      approve: 'Phê duyệt & Phân quầy',
      approved: 'Đã phân quầy & tiếp dân',
      invite: 'Mời người dân đánh giá',
      detailTitle: 'Chi tiết đơn tiếp dân tại quầy',
      detailSubtitle: 'Đơn đăng ký tiếp dân tại quầy',
      detailDescription: 'Nội dung cần trao đổi',
      receptionInfo: 'Thông tin tiếp nhận',
      leaderSection: 'Thông tin phòng ban và quầy tiếp nhận',
    }), [isLeaderMeeting]);

  const [activeReception, setActiveReception] = useState(() => readActiveReceptionFeedback());
  const [selectedReception, setSelectedReception] = useState(null);
  const [approvedReceptionIds, setApprovedReceptionIds] = useState(() => new Set());
  const [ratedReceptionIds, setRatedReceptionIds] = useState(() => readRatedReceptionIds());

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Reject Modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    const refresh = () => setActiveReception(readActiveReceptionFeedback());
    const refreshRatings = () => setRatedReceptionIds(readRatedReceptionIds());
    window.addEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
    window.addEventListener(RECEPTION_FEEDBACK_UPDATED_EVENT, refreshRatings);
    window.addEventListener('storage', refresh);
    window.addEventListener('storage', refreshRatings);
    return () => {
      window.removeEventListener(RECEPTION_FEEDBACK_SESSION_EVENT, refresh);
      window.removeEventListener(RECEPTION_FEEDBACK_UPDATED_EVENT, refreshRatings);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('storage', refreshRatings);
    };
  }, []);

  const [dbTickets, setDbTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = isLeaderMeeting
        ? await LEADER_MEETING_API.getRegistrations({ limit: 100 })
        : await RECEPTION_API.getRegistrations({ size: 100 });
      const tickets = response?.data || response || [];
      if (Array.isArray(tickets)) {
        setDbTickets(tickets);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, [isLeaderMeeting]);

  const [detailLoading, setDetailLoading] = useState(false);

  const handleOpenDetail = async (reception) => {
    setSelectedReception(reception);
    const targetId = reception.rawId || reception.id || reception.receptionId;
    if (!targetId) return;

    try {
      setDetailLoading(true);
      const response = isLeaderMeeting
        ? await LEADER_MEETING_API.getRegistrationDetail(targetId)
        : await RECEPTION_API.getRegistrationDetail(targetId);
      const d = response?.data || response;
      if (d) {
        setSelectedReception({
          ...reception,
          ticketNo: d.registrationCode || d.receptionCode || reception.ticketNo,
          receptionId: d.id || reception.receptionId,
          rawId: d.id || reception.rawId,
          topic: d.reason || d.topic || reception.topic,
          date: d.receptionDate ? new Date(d.receptionDate).toLocaleDateString('vi-VN') : (reception.date || reception.receptionDate),
          slot: d.timeSlot || reception.slot,
          fullName: d.applicant?.fullName || reception.fullName || reception.citizenName,
          citizenName: d.applicant?.fullName || reception.citizenName,
          phone: d.applicant?.phoneNumber || reception.phone,
          cccd: d.applicant?.citizenId || reception.cccd || '---',
          address: d.applicant?.address || reception.address || '---',
          description: d.reason || d.workingContent || reception.description || reception.reason,
          reason: d.reason || d.workingContent || reception.reason,
          department: d.department || reception.department || 'QUAY_1',
          office: d.location || d.schedule?.location || reception.office || d.department || 'Phòng tiếp công dân',
          leaderName: d.leader?.fullName || d.schedule?.officerName || d.approver?.name || reception.leaderName,
          leaderPosition: d.approver?.title || reception.leaderPosition,
          approvalStatus: d.approvalStatus || reception.status,
          status: d.approvalStatus || reception.status,
          rating: d.rating,
          ratingStatus: d.ratingStatus
        });
      }
    } catch (err) {
      console.warn("Could not fetch remote detail, using existing row data", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const invite = (reception) => setActiveReception(announceReceptionFeedback(reception));

  const approveReception = async (reception) => {
    const targetId = reception.rawId || reception.id || reception.receptionId;
    const targetDept = reception.department || 'QUAY_1';
    try {
      if (isLeaderMeeting) {
        await LEADER_MEETING_API.approveRegistration(targetId);
      } else {
        await RECEPTION_API.approveRegistration(targetId, targetDept);
      }
      message.success('Đã phê duyệt tiếp nhận thành công!');
      fetchTickets();
      setApprovedReceptionIds((current) => new Set([...current, targetId]));
    } catch (error) {
      console.error("Failed to approve ticket", error);
      message.error(error.response?.data?.message || 'Lỗi khi phê duyệt tiếp nhận');
    }
  };

  const completeReception = async (receptionId, rawId) => {
    const targetId = rawId || receptionId;
    try {
      if (isLeaderMeeting) {
        await LEADER_MEETING_API.completeRegistration(targetId, 'Đã hoàn thành buổi gặp lãnh đạo');
      } else {
        await RECEPTION_API.completeRegistration(targetId);
      }
      message.success('Đã hoàn thành buổi tiếp dân! Người dân có thể đánh giá trên iPad.');
      fetchTickets();
    } catch (error) {
      console.error("Failed to complete ticket", error);
      message.error(error.response?.data?.message || 'Lỗi khi hoàn thành buổi tiếp dân');
    }
  };

  const processLeaderMeeting = async (receptionId, rawId) => {
    const targetId = rawId || receptionId;
    try {
      await LEADER_MEETING_API.processRegistration(targetId, 'Bắt đầu buổi gặp lãnh đạo');
      message.success('Đã chuyển lịch hẹn sang trạng thái đang xử lý');
      fetchTickets();
    } catch (error) {
      console.error('Failed to process leader meeting', error);
      message.error(error.response?.data?.message || 'Lỗi khi bắt đầu buổi gặp lãnh đạo');
    }
  };

  const handleOpenRejectModal = (reception) => {
    setRejectTarget(reception);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim() || rejectReason.trim().length < 5) {
      message.warning('Vui lòng nhập lý do từ chối tối thiểu 5 ký tự');
      return;
    }
    const targetId = rejectTarget.rawId || rejectTarget.id || rejectTarget.receptionId;
    try {
      setRejectLoading(true);
      if (isLeaderMeeting) {
        await LEADER_MEETING_API.rejectRegistration(targetId, rejectReason.trim());
      } else {
        await RECEPTION_API.rejectRegistration(targetId, rejectReason.trim());
      }
      message.success('Đã từ chối đơn tiếp dân thành công');
      setRejectModalOpen(false);
      setRejectTarget(null);
      fetchTickets();
    } catch (error) {
      console.error("Failed to reject ticket", error);
      message.error(error.response?.data?.message || 'Lỗi khi từ chối đơn tiếp dân');
    } finally {
      setRejectLoading(false);
    }
  };

  const displayItems = useMemo(() => {
    let rawItems = [];
    if (isLeaderMeeting) {
      const leaderDbTickets = dbTickets;
      if (leaderDbTickets.length > 0) {
        rawItems = leaderDbTickets.map(item => ({
          ...item,
          rawId: item.id,
          receptionId: item.id || item.registrationCode,
          ticketNo: item.registrationCode || item.receptionCode || item.id,
          citizenName: item.applicant?.fullName || item.applicantName || item.citizenName || item.citizenInfo?.name,
          phone: item.applicant?.phoneNumber || item.phone,
          topic: item.reason || item.topic,
          department: item.department || '',
        }));
      } else {
        rawItems = queue;
      }
    } else {
      const counterDbTickets = dbTickets;
      if (counterDbTickets.length > 0) {
        rawItems = counterDbTickets.map(item => ({
          ...item,
          rawId: item.id,
          receptionId: item.id || item.receptionCode,
          ticketNo: item.receptionCode || item.id,
          citizenName: item.applicant?.fullName || item.applicantName || item.citizenName || item.citizenInfo?.name,
          phone: item.applicant?.phoneNumber || item.phone,
          topic: item.topic || item.workingContent,
        }));
      } else {
        rawItems = queue;
      }
    }

    // Map each item's computed status
    let processed = rawItems.map(item => {
      const isRejected = item.approvalStatus === "REJECTED" || item.status === "REJECTED" || item.status === "CANCELED";
      const isRated = ratedReceptionIds.has(item.receptionId) || ratedReceptionIds.has(item.ticketNo) || item.ratingStatus === "RATED" || item.status === "RATED";
      const isCompleted = !isRated && (item.approvalStatus === "COMPLETED" || item.status === "COMPLETED");
      const isProcessing = !isRated && !isCompleted && (item.status === "IN_PROGRESS" || item.status === "PROCESSING");
      const isApproved = !isRated && !isCompleted && !isProcessing && (approvedReceptionIds.has(item.receptionId) || item.approvalStatus === "APPROVED" || item.status === "APPROVED");
      const isPending = !isRejected && !isRated && !isCompleted && !isProcessing && !isApproved;

      // Status key
      const currentStatusKey = isRejected ? 'REJECTED' : isRated ? 'RATED' : isCompleted ? 'COMPLETED' : isProcessing ? 'IN_PROGRESS' : isApproved ? 'APPROVED' : 'PENDING';

      // Priority rank: PENDING (1) -> APPROVED (2) -> COMPLETED (3) -> RATED (4) -> REJECTED (5)
      const rank = isPending ? 1 : isApproved ? 2 : isProcessing ? 3 : isCompleted ? 4 : isRated ? 5 : 6;

      return {
        ...item,
        currentStatusKey,
        rank
      };
    });

    // 1. Search Filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      processed = processed.filter(item => 
        (item.ticketNo && item.ticketNo.toLowerCase().includes(q)) ||
        (item.citizenName && item.citizenName.toLowerCase().includes(q)) ||
        (item.applicantName && item.applicantName.toLowerCase().includes(q)) ||
        (item.phone && item.phone.toLowerCase().includes(q)) ||
        (item.topic && item.topic.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q))
      );
    }

    // 2. Status Filter
    if (statusFilter) {
      processed = processed.filter(item => item.currentStatusKey === statusFilter);
    }

    // 3. Department Filter
    if (departmentFilter) {
      processed = processed.filter(item => 
        item.department === departmentFilter || 
        item.office === departmentFilter || 
        (item.department && item.department.includes(departmentFilter)) ||
        (item.office && item.office.includes(departmentFilter))
      );
    }

    // 4. Date Filter
    if (dateFilter) {
      processed = processed.filter(item => {
        const itemDate = item.receptionDate ? new Date(item.receptionDate).toISOString().slice(0, 10) : item.date;
        return itemDate === dateFilter || (item.date && item.date.includes(dateFilter));
      });
    }

    // 5. Smart Priority Sorting:
    // PENDING first (1), then APPROVED (2), COMPLETED (3), RATED (4), REJECTED (5)
    // Within same priority rank, sort newest date/created first
    processed.sort((a, b) => {
      if (a.rank !== b.rank) {
        return a.rank - b.rank;
      }
      const timeB = new Date(b.receptionDate || b.date || b.created_at || 0).getTime();
      const timeA = new Date(a.receptionDate || a.date || a.created_at || 0).getTime();
      return timeB - timeA;
    });

    return processed;
  }, [dbTickets, queue, isLeaderMeeting, approvedReceptionIds, ratedReceptionIds, search, statusFilter, dateFilter, departmentFilter]);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, dateFilter, departmentFilter]);

  const totalPages = Math.max(1, Math.ceil(displayItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return displayItems.slice(start, start + pageSize);
  }, [displayItems, currentPage, pageSize]);

  return (
    <main className="min-h-screen bg-gray-50 pb-10 pt-6" data-feedback-type={isLeaderMeeting ? 'LEADER_MEETING' : 'COUNTER_RECEPTION'}>
      <div className="mx-auto max-w-[1600px] animate-fade-in">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-blue-600"><ClipboardCheck size={16} /> {eyebrow}</p>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
          </div>
        </header>

        {/* BỘ LỌC TÌM KIẾM & TRẠNG THÁI */}
        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <Filter size={16} className="text-blue-600" />
              <span>Bộ lọc danh sách</span>
            </div>
            {(search || statusFilter || dateFilter || departmentFilter) && (
              <button
                type="button"
                onClick={() => { setSearch(''); setStatusFilter(''); setDateFilter(''); setDepartmentFilter(''); }}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                <RotateCcw size={13} /> Đặt lại bộ lọc
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search input */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên công dân, chủ đề..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-9 pr-3 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Department filter for Counter Reception */}
            {!isLeaderMeeting && (
              <div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
                >
                  {RECEPTION_DEPARTMENTS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Status filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">🟡 Chờ phê duyệt (Ưu tiên)</option>
                <option value="APPROVED">🔵 Đang tiếp dân</option>
                {isLeaderMeeting && <option value="IN_PROGRESS">🟣 Đang xử lý buổi gặp</option>}
                <option value="COMPLETED">🟢 Chờ dân đánh giá</option>
                <option value="RATED">✅ Đã đánh giá</option>
                <option value="REJECTED">🔴 Đã từ chối</option>
              </select>
            </div>

            {/* Date filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                title="Lọc theo ngày tiếp dân"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-xs text-gray-800 focus:border-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div><h2 className="font-semibold text-gray-900">{labels.listTitle}</h2><p className="mt-1 text-xs text-gray-500">{labels.listDescription}</p></div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{displayItems.length} đơn</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr>
                <th className="px-5 py-3">{labels.code}</th><th className="px-5 py-3">Người đăng ký</th><th className="px-5 py-3">{labels.date}</th><th className="px-5 py-3">{labels.topic}</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3">Đánh giá</th><th className="px-5 py-3 text-center">Thao tác</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Đang tải dữ liệu tiếp dân...
                    </td>
                  </tr>
                ) : paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      Không tìm thấy đơn tiếp dân nào phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((reception) => {
                    const isRejected = reception.approvalStatus === "REJECTED" || reception.status === "REJECTED";
                    const isCompleted = reception.approvalStatus === "COMPLETED" || reception.status === "COMPLETED";
                    const isProcessing = reception.status === "IN_PROGRESS" || reception.status === "PROCESSING";
                    const isApproved = approvedReceptionIds.has(reception.receptionId) || approvedReceptionIds.has(reception.rawId) || reception.approvalStatus === "APPROVED" || reception.status === "APPROVED" || isProcessing || isCompleted;
                    const isRated = ratedReceptionIds.has(reception.receptionId) || ratedReceptionIds.has(reception.rawId) || ratedReceptionIds.has(reception.ticketNo) || reception.ratingStatus === "RATED" || reception.status === "RATED";
                    const deptLabel = RECEPTION_DEPARTMENTS.find(d => d.value === reception.department)?.label;
                    return <tr key={reception.receptionId}>
                      <td className="px-5 py-4 font-bold text-blue-700">
                        <button type="button" className="hover:underline text-sm font-bold text-blue-600 hover:text-blue-800" onClick={() => handleOpenDetail(reception)}>
                          {reception.ticketNo}
                        </button>
                        {deptLabel && !isLeaderMeeting && (
                          <div className="text-[11px] font-normal text-gray-500 mt-0.5">{deptLabel}</div>
                        )}
                      </td>
                      <td className="px-5 py-4 text-gray-700">{reception.citizenName || reception.applicantName}</td><td className="px-5 py-4 text-gray-600">{(reception.date || (reception.receptionDate ? new Date(reception.receptionDate).toLocaleDateString('vi-VN') : ''))}<br />{(reception.slot || reception.timeSlot)}</td><td className="px-5 py-4 text-gray-700">{(reception.topic || reception.content || reception.citizenInfo?.content)}</td>
                      <td className="px-5 py-4">
                        {isRejected ? (
                          <Status tone="rose" icon={<X size={13} />}>Đã từ chối</Status>
                        ) : isRated ? (
                          <Status tone="green" icon={<CheckCircle2 size={13} />}>Đã đánh giá</Status>
                        ) : isCompleted ? (
                          <Status tone="green" icon={<CheckCircle2 size={13} />}>Chờ dân đánh giá</Status>
                        ) : isProcessing ? (
                          <Status tone="blue" icon={<MonitorUp size={13} />}>Đang xử lý</Status>
                        ) : isApproved ? (
                          <Status tone="blue" icon={<CheckCircle2 size={13} />}>Đang tiếp dân</Status>
                        ) : (
                          <span className="text-xs text-amber-600 font-medium">Chờ phê duyệt</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium">
                        {isRejected ? (
                          <span className="text-xs text-rose-500 font-medium">Đơn bị từ chối</span>
                        ) : isRated ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600"><CheckCircle2 size={14}/> Đã đánh giá</span>
                        ) : isCompleted ? (
                          <span className="text-xs font-semibold text-blue-600">Chờ iPad đánh giá</span>
                        ) : isApproved ? (
                          <span className="text-xs font-medium text-amber-600">Chưa xong buổi tiếp</span>
                        ) : (
                          <span className="text-xs text-gray-400">Chưa duyệt</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center">
                        {(() => {
                          const items = [
                            {
                              key: 'detail',
                              label: <span className="flex items-center gap-2 font-medium text-gray-700"><Eye size={15} /> Xem chi tiết</span>,
                              onClick: () => handleOpenDetail(reception)
                            }
                          ];

                          if (!isApproved && !isCompleted && !isRated && !isRejected) {
                            items.push({ type: 'divider' });
                            items.push({
                              key: 'approve',
                              label: <span className="flex items-center gap-2 font-medium text-blue-600"><Check size={15} /> {labels.approve || 'Phê duyệt đơn'}</span>,
                              onClick: () => approveReception(reception)
                            });
                            items.push({
                              key: 'reject',
                              label: <span className="flex items-center gap-2 font-medium text-rose-600"><X size={15} /> Từ chối đơn</span>,
                              onClick: () => handleOpenRejectModal(reception)
                            });
                          } else if (isLeaderMeeting && isApproved && !isProcessing && !isCompleted && !isRated && !isRejected) {
                            items.push({ type: 'divider' });
                            items.push({
                              key: 'process',
                              label: <span className="flex items-center gap-2 font-medium text-blue-600"><MonitorUp size={15} /> Bắt đầu buổi gặp</span>,
                              onClick: () => processLeaderMeeting(reception.receptionId, reception.rawId)
                            });
                          } else if (isApproved && !isCompleted && !isRated && !isRejected) {
                            items.push({ type: 'divider' });
                            items.push({
                              key: 'complete',
                              label: <span className="flex items-center gap-2 font-medium text-emerald-600"><CheckCircle2 size={15} /> Hoàn thành tiếp dân</span>,
                              onClick: () => completeReception(reception.receptionId, reception.rawId)
                            });
                          }

                          return (
                            <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-2xs hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                title="Thao tác"
                              >
                                <MoreHorizontal size={16} />
                              </button>
                            </Dropdown>
                          );
                        })()}
                      </td>
                    </tr>;
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PHÂN TRANG */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-5 py-3.5 text-xs text-gray-500">
            <span>
              Hiển thị {displayItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, displayItems.length)} trên tổng số <span className="font-semibold text-gray-700">{displayItems.length}</span> đơn
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  title="Trang trước"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2 font-medium text-gray-700">
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  title="Trang sau"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* MODAL XÁC NHẬN TỪ CHỐI */}
        <Modal
          open={rejectModalOpen}
          onCancel={() => !rejectLoading && setRejectModalOpen(false)}
          footer={null}
          title={null}
          centered
          width={480}
        >
          <div className="p-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Xác nhận từ chối đơn tiếp dân</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mã đơn: <span className="font-bold text-blue-600">{rejectTarget?.ticketNo}</span> ({rejectTarget?.citizenName})
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Lý do từ chối tiếp nhận <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                className="w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                placeholder="Vui lòng nhập lý do từ chối tiếp nhận (tối thiểu 5 ký tự)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                maxLength={500}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Tối thiểu 5 ký tự</span>
                <span>{rejectReason.length}/500</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
              <button
                type="button"
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setRejectModalOpen(false)}
                disabled={rejectLoading}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
                onClick={handleConfirmReject}
                disabled={rejectLoading || rejectReason.trim().length < 5}
              >
                {rejectLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </Modal>

        <TicketDetailModal open={Boolean(selectedReception)} code={selectedReception?.ticketNo} title={labels.detailTitle} subtitle={labels.detailSubtitle} onClose={() => setSelectedReception(null)}>
          {selectedReception && <TicketDetailContent
            title={selectedReception.topic}
            badges={[{ label: isLeaderMeeting ? 'Gặp lãnh đạo' : 'Tiếp dân tại quầy', className: 'bg-indigo-100 text-indigo-800' }, { label: selectedReception.status || selectedReception.approvalStatus || 'Chờ đánh giá', className: 'bg-gray-100 text-gray-700' }]}
            meta={[{ label: isLeaderMeeting ? 'Ngày gặp' : 'Ngày tiếp', value: selectedReception.date }, { label: 'Người dân', value: selectedReception.fullName || selectedReception.citizenName }, { label: 'Số điện thoại', value: selectedReception.phone }]}
            descriptionLabel={labels.detailDescription}
            description={selectedReception.description || selectedReception.reason || selectedReception.workingContent}
            location={{ title: labels.receptionInfo, value: selectedReception.office, extra: `Khung giờ: ${selectedReception.slot || 'Chưa có dữ liệu'}` }}
            sections={<>
              <DetailSection title="Thông tin người dân đã điền">
                <DetailGrid cols={3}>
                  <DetailField label="Họ và tên" value={selectedReception.fullName || selectedReception.citizenName} />
                  <DetailField label="Số điện thoại" value={selectedReception.phone} />
                  <DetailField label="Số CCCD" value={selectedReception.cccd} />
                  <DetailField label="Địa chỉ" value={selectedReception.address} wide />
                </DetailGrid>
              </DetailSection>
              {Boolean(isLeaderMeeting && (selectedReception.leaderName || selectedReception.leaderPosition)) && (
                <DetailSection title={labels.leaderSection}>
                  <DetailGrid>
                    <DetailField label="Lãnh đạo tiếp" value={selectedReception.leaderName} />
                    <DetailField label="Chức vụ" value={selectedReception.leaderPosition} />
                  </DetailGrid>
                </DetailSection>
              )}
              {selectedReception.rating && (
                <DetailSection title="Kết quả đánh giá từ người dân (iPad Kiosk)">
                  <DetailGrid>
                    <DetailField label="Điểm số đánh giá" value={`${selectedReception.rating.score || 5} / 5 ⭐ (${(selectedReception.rating.score || 5) >= 4 ? 'Hài lòng' : 'Chưa hài lòng'})`} />
                    <DetailField label="Tiêu chí ghi nhận" value={Array.isArray(selectedReception.rating.suggestions) ? selectedReception.rating.suggestions.join('; ') : (selectedReception.rating.suggestions || 'Cán bộ tận tình và chuyên nghiệp')} wide />
                    <DetailField label="Lời nhận xét của người dân" value={selectedReception.rating.comment || 'Không có nhận xét thêm'} wide />
                  </DetailGrid>
                </DetailSection>
              )}
            </>}
          />}
        </TicketDetailModal>
      </div>
    </main>
  );
}

function Status({ children, tone, icon }) {
  const toneClass = tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'rose' ? 'bg-rose-50 text-rose-700' : 'bg-blue-50 text-blue-700';
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass}`}>{icon}{children}</span>;
}

function readRatedReceptionIds() {
  try {
    const ratings = JSON.parse(window.localStorage.getItem(RECEPTION_FEEDBACK_STORAGE_KEY) || '[]');
    return new Set(ratings.flatMap((item) => [item.receptionId, item.ticketNo].filter(Boolean)));
  } catch (error) {
    return new Set();
  }
}
