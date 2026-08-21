import React, { useState, useEffect, useMemo } from "react";
import { Users, Building2, Save, Calendar, Clock, Edit3, CheckCircle2, AlertCircle, RefreshCw, Power, UserCheck, ShieldCheck } from "lucide-react";
import { Modal, message, Spin, Switch } from "antd";
import { RECEPTION_COUNTER_API } from "../../apis/receptionCounter";
import { getSelectableReceptionOfficers } from "../../apis/receptionOfficerMapper";
import { useMock } from "../../mock/MockContext";
import dayjs from "dayjs";

const DEFAULT_TIME_SLOTS = [
  "07:30 - 08:30",
  "08:30 - 09:30",
  "09:30 - 10:30",
  "10:30 - 11:30",
  "13:30 - 14:30",
  "14:30 - 15:30",
  "15:30 - 16:30",
];

export default function CounterManagementTab({ initialDate }) {
  const { currentUser } = useMock() || {};
  const isOfficer = ["OFFICER", "RECEPTION_OFFICER", "PROCESSING_OFFICER"].includes(currentUser?.role);
  const isLeader = !isOfficer; // APPROVER, LEADER, ADMIN
  const currentUserId = currentUser?.id || currentUser?._id || currentUser?.userId;
  const currentUsername = currentUser?.username || currentUser?.tenDangNhap || currentUser?.ten_dang_nhap;

  const [subTab, setSubTab] = useState("assignment"); // "assignment" | "counters"
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Core Data
  const [counters, setCounters] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [scheduleDetail, setScheduleDetail] = useState(null);

  // Assignment Form State
  const [selectedDate, setSelectedDate] = useState(
    initialDate || dayjs().format("YYYY-MM-DD")
  );
  const [selectedSlot, setSelectedSlot] = useState(DEFAULT_TIME_SLOTS[0]);
  const [counterAssignmentsMap, setCounterAssignmentsMap] = useState({}); // { [counterId]: officerId }

  // Counter Edit Modal State (Leader only)
  const [editingCounter, setEditingCounter] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    counterName: "",
    location: "",
    description: "",
    isActive: true,
  });

  // Load all initial data
  const fetchData = async () => {
    setLoading(true);
    setScheduleDetail(null);
    try {
      const [countersData, officersData, assignmentsData, schedulesData] = await Promise.all([
        RECEPTION_COUNTER_API.getCounters(),
        RECEPTION_COUNTER_API.getOfficers(),
        RECEPTION_COUNTER_API.getAssignments({ isActive: true }),
        RECEPTION_COUNTER_API.getSchedules({ date: selectedDate }),
      ]);

      const scheduleList = Array.isArray(schedulesData) ? schedulesData : [];
      const assignmentList = Array.isArray(assignmentsData) ? assignmentsData : [];
      setCounters(Array.isArray(countersData) ? countersData : []);
      setOfficers(Array.isArray(officersData) ? officersData : []);
      setAssignments(assignmentList);
      setSchedules(scheduleList);

      if (isOfficer && (currentUserId || currentUsername)) {
        const ownAssignmentDates = assignmentList
          .filter((assignment) =>
            assignment.officer?.id === currentUserId ||
            assignment.officer?.username === currentUsername
          )
          .map((assignment) => dayjs(assignment.receptionDate).format("YYYY-MM-DD"))
          .filter((date, index, dates) => date && dates.indexOf(date) === index)
          .sort();

        if (!ownAssignmentDates.includes(selectedDate) && ownAssignmentDates.length > 0) {
          const today = dayjs().format("YYYY-MM-DD");
          const nearestDate =
            ownAssignmentDates.find((date) => date >= today) ||
            ownAssignmentDates[ownAssignmentDates.length - 1];
          if (nearestDate !== selectedDate) {
            setSelectedDate(nearestDate);
            return;
          }
        }
      }

      const detail = scheduleList[0]?.id
        ? await RECEPTION_COUNTER_API.getScheduleDetail(scheduleList[0].id)
        : null;
      setScheduleDetail(detail);
      if (detail?.slots?.length > 0) {
        setSelectedSlot((currentSlot) =>
          detail.slots.some((slot) => slot.timeSlot === currentSlot)
            ? currentSlot
            : detail.slots[0].timeSlot
        );
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu quầy và phân công:", err);
      message.error("Lỗi khi tải dữ liệu quầy tiếp dân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate, currentUserId, currentUsername]);

  useEffect(() => {
    if (initialDate && initialDate !== selectedDate) {
      setSelectedDate(initialDate);
    }
  }, [initialDate, selectedDate]);

  // Update counter assignments mapping when selectedDate or selectedSlot changes
  useEffect(() => {
    const currentAssignments = assignments.filter((a) => {
      const aDate = a.receptionDate ? dayjs(a.receptionDate).format("YYYY-MM-DD") : "";
      const assignmentSlot = a.startTime && a.endTime
        ? `${a.startTime} - ${a.endTime}`
        : a.timeSlot;
      return aDate === selectedDate && assignmentSlot === selectedSlot;
    });

    const map = {};
    counters.forEach((c) => {
      const found = currentAssignments.find(
        (a) => a.counter?.counterCode === c.counterCode || a.counter?.id === c.id
      );
      if (found && found.officer?.id) {
        map[c.id] = found.officer.id;
      }
    });

    setCounterAssignmentsMap(map);
  }, [selectedDate, selectedSlot, assignments, counters, officers]);

  // Find active schedule and shift for current date
  const activeSchedule = useMemo(() => {
    if (scheduleDetail) return scheduleDetail;
    return schedules.find((s) => {
      const sDate = s.ngay_tiep_dan ? dayjs(s.ngay_tiep_dan).format("YYYY-MM-DD") : "";
      return sDate === selectedDate;
    });
  }, [schedules, selectedDate, scheduleDetail]);

  const selectedSlotDetail = useMemo(() => {
    return activeSchedule?.slots?.find((slot) => slot.timeSlot === selectedSlot) || null;
  }, [activeSchedule, selectedSlot]);

  const availableTimeSlots = useMemo(() => {
    const scheduleSlots = activeSchedule?.slots
      ?.map((slot) => slot.timeSlot)
      .filter(Boolean);
    return scheduleSlots?.length ? scheduleSlots : DEFAULT_TIME_SLOTS;
  }, [activeSchedule]);

  // Find which counter the current officer is assigned to
  const myAssignedCounter = useMemo(() => {
    if (!isOfficer || !currentUser) return null;

    return counters.find((c) => {
      const assignedOfficerId = counterAssignmentsMap[c.id];
      const assignedOfficer = officers.find((o) => (o.id || o._id) === assignedOfficerId);
      return (
        assignedOfficerId === currentUserId ||
        assignedOfficer?.tenDangNhap === currentUsername ||
        assignedOfficer?.ten_dang_nhap === currentUsername ||
        assignedOfficer?.username === currentUsername
      );
    }) || null;
  }, [isOfficer, currentUser, currentUserId, currentUsername, counters, counterAssignmentsMap, officers]);

  // Handle Officer selection for a counter (Leader only)
  const handleSelectOfficer = (counterId, officerId) => {
    if (isOfficer) return;
    setCounterAssignmentsMap((prev) => ({
      ...prev,
      [counterId]: officerId || null,
    }));
  };

  // Handle Save Shift Assignments (Leader only)
  const handleSaveAssignments = async () => {
    setSaving(true);
    try {
      const slotCounters = selectedSlotDetail?.counters || [];
      const shiftId = selectedSlotDetail?.shiftId || slotCounters[0]?.shiftId;
      if (!shiftId || slotCounters.length === 0) {
        message.error("Ngày và khung giờ này chưa có cấu hình ca tiếp dân");
        return;
      }
      const payloadAssignments = counters
        .filter((c) => counterAssignmentsMap[c.id])
        .map((c) => {
          const configuration = slotCounters.find(
            (item) => item.counterId === c.id || item.counterCode === c.counterCode
          );
          return configuration ? {
            counterConfigurationId: configuration.id,
            officerId: counterAssignmentsMap[c.id],
          } : null;
        })
        .filter(Boolean);

      await RECEPTION_COUNTER_API.replaceShiftAssignments(shiftId, payloadAssignments);
      message.success("Đã lưu phân công cán bộ vào các quầy thành công!");
      fetchData();
    } catch (err) {
      console.error("Lỗi lưu phân công:", err);
      message.error(err.response?.data?.message || "Không thể lưu phân công cán bộ - quầy");
    } finally {
      setSaving(false);
    }
  };

  // Handle Counter Edit Modal (Leader only)
  const handleOpenEditModal = (counter) => {
    setEditingCounter(counter);
    setEditForm({
      counterName: counter.counterName || "",
      location: counter.location || "",
      description: counter.description || "",
      isActive: Boolean(counter.isActive),
    });
    setEditModalOpen(true);
  };

  const handleSaveEditCounter = async () => {
    if (!editingCounter) return;
    try {
      await RECEPTION_COUNTER_API.updateCounter(editingCounter.id, editForm);
      message.success(`Đã cập nhật thông tin ${editingCounter.counterName} thành công!`);
      setEditModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Lỗi cập nhật quầy:", err);
      message.error(err.response?.data?.message || "Lỗi khi cập nhật quầy");
    }
  };

  // Quick toggle counter status (Leader only)
  const handleToggleCounterStatus = async (counter, newStatus) => {
    try {
      await RECEPTION_COUNTER_API.updateCounter(counter.id, { isActive: newStatus });
      message.success(`Đã ${newStatus ? "bật" : "tạm tắt"} ${counter.counterName}`);
      setCounters((prev) =>
        prev.map((c) => (c.id === counter.id ? { ...c, isActive: newStatus } : c))
      );
    } catch (err) {
      message.error("Lỗi khi thay đổi trạng thái quầy");
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tab Switcher (Only visible to Leader/Admin; Officer stays on View mode) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("assignment")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              subTab === "assignment"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isOfficer ? <UserCheck size={16} /> : <Users size={16} />}
            <span>{isOfficer ? "Ca trực & Quầy tiếp dân của bạn" : "Phân công Cán bộ theo Ca trực"}</span>
          </button>

          {isLeader && (
            <button
              type="button"
              onClick={() => setSubTab("counters")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                subTab === "counters"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Building2 size={16} />
              <span>Quản lý 8 Quầy Tiếp dân ({counters.length})</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-blue-600" : ""} />
          <span>Làm mới</span>
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Spin size="large" tip="Đang tải dữ liệu quầy tiếp dân..." />
        </div>
      )}

      {/* OFFICER BANNER: If logged in as Officer, show prominent shift & counter info */}
      {!loading && isOfficer && myAssignedCounter && (
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-emerald-600 p-3 text-white shadow-sm">
                <UserCheck size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold uppercase text-white tracking-wider">
                    Ca trực của bạn
                  </span>
                  <span className="text-xs font-semibold text-emerald-800">
                    Hôm nay: {dayjs(selectedDate).format("DD/MM/YYYY")} ({selectedSlot})
                  </span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  {myAssignedCounter.counterName} ({myAssignedCounter.counterCode || "QUAY_1"})
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">
                  Vị trí: <strong className="text-gray-800">{myAssignedCounter.location || "Tầng 1, Khu A"}</strong> • Sức chứa: <strong className="text-gray-800">{myAssignedCounter.defaultCapacity || 2} người/ca</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="rounded-xl bg-white px-4 py-2.5 border border-emerald-200 text-center shadow-2xs">
                <span className="block text-[10px] font-bold text-gray-500 uppercase">Trạng thái</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={13} /> Đang sẵn sàng tiếp dân
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: ASSIGNMENT PANEL */}
      {!loading && subTab === "assignment" && (
        <div className="space-y-5">
          {/* Header Controls: Date & Time Slot */}
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Calendar size={15} className="text-blue-600" />
                    Ngày trực:
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Clock size={15} className="text-blue-600" />
                    Khung giờ:
                  </span>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="rounded-xl border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 focus:border-blue-500 focus:outline-none"
                  >
                    {availableTimeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Save Button (Leader only) */}
              {isLeader && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAssignments}
                    disabled={saving || !selectedSlotDetail}
                    title={!selectedSlotDetail ? "Ngày đang chọn chưa có lịch tiếp dân" : undefined}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    <Save size={15} />
                    <span>{saving ? "Đang lưu..." : "Lưu chỉnh sửa phân công"}</span>
                  </button>
                </div>
              )}
            </div>

            {!activeSchedule && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800">
                <AlertCircle size={15} className="shrink-0" />
                <span>
                  Ngày {dayjs(selectedDate).format("DD/MM/YYYY")} chưa có lịch tiếp dân. Hãy chọn ngày đã import lịch.
                </span>
              </div>
            )}

            {/* Note banner */}
            {activeSchedule && <div className="mt-3 flex items-center gap-2 rounded-xl bg-blue-50/70 px-3.5 py-2 text-xs text-blue-900 border border-blue-100">
              <AlertCircle size={15} className="shrink-0 text-blue-600" />
              <span>
                {isOfficer
                  ? "Dưới đây là danh sách phân công trực tại 8 quầy tiếp nhận Một cửa trong ca này."
                  : "Lãnh đạo phân công cán bộ vào từng quầy. Cán bộ khi đăng nhập sẽ tự động nhận diện và duyệt đơn tại quầy được gán."}
              </span>
            </div>}
          </div>

          {/* 8 Counters Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {counters.map((counter, idx) => {
              const currentOfficerId = counterAssignmentsMap[counter.id] || "";
              const assignedOfficer = officers.find((o) => o.id === currentOfficerId || o._id === currentOfficerId);
              const selectableOfficers = getSelectableReceptionOfficers(
                officers,
                counterAssignmentsMap,
                currentOfficerId
              );
              const isCounterActive = counter.isActive !== false;
              const isMyCounter = isOfficer && myAssignedCounter?.id === counter.id;

              return (
                <div
                  key={counter.id || idx}
                  className={`rounded-2xl border transition-all p-4 relative ${
                    isMyCounter
                      ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-md"
                      : isCounterActive
                      ? "border-gray-200 bg-white shadow-sm hover:shadow-md"
                      : "border-gray-200 bg-gray-50/70 opacity-60"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-100">
                          {counter.counterCode || `QUAY_${idx + 1}`}
                        </span>
                        {isMyCounter && (
                          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            Quầy của bạn
                          </span>
                        )}
                      </div>
                      <h4 className="mt-1 font-bold text-gray-900 text-sm">{counter.counterName}</h4>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isCounterActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isCounterActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {isCounterActive ? "Đang mở" : "Tạm đóng"}
                    </span>
                  </div>

                  {/* Location & Capacity */}
                  <div className="space-y-1 text-xs text-gray-500 mb-3.5">
                    <p className="flex items-center justify-between">
                      <span>Vị trí:</span>
                      <span className="font-semibold text-gray-700">{counter.location || `Tầng 1, khu A`}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Sức chứa ca:</span>
                      <span className="font-semibold text-gray-700">{counter.defaultCapacity || 2} người / ca</span>
                    </p>
                  </div>

                  {/* Officer Info / Dropdown Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600">
                      Cán bộ phụ trách:
                    </label>

                    {isOfficer ? (
                      /* READ-ONLY VIEW FOR OFFICER */
                      <div
                        className={`rounded-xl border p-2.5 text-xs font-semibold ${
                          isMyCounter
                            ? "border-emerald-300 bg-emerald-100/50 text-emerald-900"
                            : assignedOfficer
                            ? "border-gray-200 bg-gray-50 text-gray-800"
                            : "border-gray-200 bg-gray-50 text-gray-400 italic"
                        }`}
                      >
                        {assignedOfficer ? (
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className={isMyCounter ? "text-emerald-600" : "text-blue-600"} />
                            <span>
                              {assignedOfficer.ho_va_ten || assignedOfficer.fullName || assignedOfficer.tenDangNhap}
                            </span>
                          </div>
                        ) : (
                          "Chưa phân công"
                        )}
                      </div>
                    ) : (
                      /* EDITABLE DROPDOWN FOR LEADER */
                      <>
                        <select
                          value={currentOfficerId}
                          onChange={(e) => handleSelectOfficer(counter.id, e.target.value)}
                          disabled={!isCounterActive}
                          className={`w-full rounded-xl border p-2 text-xs font-semibold focus:outline-none ${
                            currentOfficerId
                              ? "border-blue-300 bg-blue-50/30 text-blue-900 focus:border-blue-500"
                              : "border-gray-300 bg-gray-50 text-gray-500 focus:border-gray-400"
                          }`}
                        >
                          <option value="">-- Chưa phân công --</option>
                          {selectableOfficers.map((officer) => (
                            <option key={officer.id || officer._id} value={officer.id || officer._id}>
                              {officer.ho_va_ten || officer.fullName || officer.tenDangNhap || officer.username} ({officer.tenDangNhap || officer.username})
                            </option>
                          ))}
                        </select>

                        {assignedOfficer && (
                          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                            <CheckCircle2 size={12} />
                            Đã gán: {assignedOfficer.ho_va_ten || assignedOfficer.fullName || assignedOfficer.tenDangNhap}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: QUẢN LÝ 8 QUẦY TIẾP NHẬN (Leader only) */}
      {!loading && isLeader && subTab === "counters" && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">Danh mục Quầy Tiếp nhận Một cửa</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Cấu hình thông tin 8 quầy tiếp dân, vị trí bố trí và bật/tắt trạng thái phục vụ.
              </p>
            </div>
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
              8 Quầy hệ thống
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5">Mã Quầy</th>
                  <th className="px-5 py-3.5">Tên Quầy / Lĩnh vực</th>
                  <th className="px-5 py-3.5">Vị trí bố trí</th>
                  <th className="px-5 py-3.5 text-center">Sức chứa mặc định</th>
                  <th className="px-5 py-3.5 text-center">Trạng thái</th>
                  <th className="px-5 py-3.5 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {counters.map((counter, idx) => (
                  <tr key={counter.id || idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-4 font-bold text-blue-700">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs border border-blue-100 font-mono">
                        {counter.counterCode || `QUAY_${idx + 1}`}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {counter.counterName}
                      {counter.description && (
                        <p className="text-xs font-normal text-gray-500 mt-0.5">{counter.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs font-medium text-gray-600">
                      {counter.location || `Tầng 1, khu A`}
                    </td>
                    <td className="px-5 py-4 text-center font-bold text-gray-800 text-xs">
                      {counter.defaultCapacity || 2} người / ca
                    </td>
                    <td className="px-5 py-4 text-center">
                      <Switch
                        checked={counter.isActive !== false}
                        onChange={(checked) => handleToggleCounterStatus(counter, checked)}
                        checkedChildren="Mở"
                        unCheckedChildren="Tắt"
                      />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(counter)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-colors shadow-2xs"
                      >
                        <Edit3 size={13} />
                        Sửa quầy
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Chỉnh sửa Quầy (Leader only) */}
      <Modal
        title={<div className="text-base font-bold text-gray-900">Chỉnh sửa Quầy Tiếp Dân</div>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={handleSaveEditCounter}
        okText="Lưu thay đổi"
        cancelText="Hủy bỏ"
        centered
        width={480}
      >
        {editingCounter && (
          <div className="space-y-4 pt-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Tên Quầy / Lĩnh vực tiếp nhận <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={editForm.counterName}
                onChange={(e) => setEditForm({ ...editForm, counterName: e.target.value })}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs font-semibold text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Ví dụ: Quầy số 1: Hộ tịch - Tư pháp"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Vị trí bố trí
              </label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Ví dụ: Tầng 1, Khu A - Cửa chính"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Mô tả chi tiết / Ghi chú
              </label>
              <textarea
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none"
                placeholder="Mô tả các thủ tục tiếp nhận tại quầy này..."
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="text-xs font-bold text-gray-700">Trạng thái hoạt động:</span>
              <Switch
                checked={editForm.isActive}
                onChange={(checked) => setEditForm({ ...editForm, isActive: checked })}
                checkedChildren="Mở quầy"
                unCheckedChildren="Tạm đóng"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
