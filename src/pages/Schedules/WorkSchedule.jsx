import { useState, useEffect, useMemo } from "react";
import { Download, Upload, Plus, RotateCcw, Calendar as CalendarIcon, Users, UserCheck } from "lucide-react";
import { showToast } from "../../utils/toastNotification";
import { ConfirmModal } from "../../components/base/BaseModal";
import { useSchedule } from "../../hooks/useSchedule";
import MonthCalendar from "../../components/workSchedule/MonthCalendar";
import ScheduleList from "../../components/workSchedule/ScheduleList";
import WorkScheduleModal from "../../components/workSchedule/WorkScheduleModal";
import CounterManagementTab from "../../components/workSchedule/CounterManagementTab";
import { usePermission } from "../../hooks/usePermission";
import { PermissionHidden } from "../../components/PermissionGuard";
import { useMock } from "../../mock/MockContext";
import dayjs from "dayjs";
import { validateFileImport } from "../../validator/fileValidator";
import { downloadUtils } from "../../utils/downLoadUtils";
import { WORK_SCHEDULE_API } from "../../apis/workSchedule";
import { normalizeDate } from "../../utils/dateUtils";

export default function WorkSchedule() {
    const { currentUser } = useMock() || {};
    const isOfficer = ["OFFICER", "RECEPTION_OFFICER", "PROCESSING_OFFICER"].includes(currentUser?.role);
    const [viewOnlyMySchedule, setViewOnlyMySchedule] = useState(isOfficer);
    const [mainTab, setMainTab] = useState("schedules"); // "schedules" | "counters"
    const {
        loading,
        error,
        selectedMonth,
        selectedYear,
        schedules,
        pagination,
        counts,
        fetchSchedulesPagination,
        importSchedule,
        deleteSchedule,
        hasScheduleForDay,
        updateStatus,
        formatDate,
        clearError,
        setSelectedMonth,
        setSelectedYear,
        getTemplate,
        createScheduleItem,
        updateScheduleItem,
        setCounts,
    } = useSchedule();

    const { canUpdate, canDelete, canUpdateStatus } = usePermission();

    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        schedule: null,
    });

    const [modalState, setModalState] = useState({
        isOpen: false,
        mode: "create",
        data: null,
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isFetching, setIsFetching] = useState(false);
    const [monthSchedulesRaw, setMonthSchedulesRaw] = useState([]);

    const pageSize = 10;

    const fetchCounts = async (monthYear, date = null) => {
        try {
            const result = await WORK_SCHEDULE_API.countWorkSchedules(null, date ? null : monthYear, date);
            
            setCounts({
                all: result.total || 0,
                active: result.active || 0,
                inactive: result.inactive || 0
            });

            return result.total || 0;
        } catch (error) {
            return 0;
        }
    };

    const fetchAllSchedulesData = async (monthYear) => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);

        try {
            // Load full month raw schedules for calendar dots & highlights
            try {
                const monthAllData = await WORK_SCHEDULE_API.getWorkSchedules(null, monthYear);
                const list = Array.isArray(monthAllData) ? monthAllData : (monthAllData?.items || []);
                setMonthSchedulesRaw(list);
            } catch (e) {
                console.warn("Could not fetch full month schedules", e);
            }

            const totalItems = await fetchCounts(monthYear);

            await fetchSchedulesPagination({
                monthYear,
                isActive: null,
                page: 1,
                size: pageSize
            });

            if (totalItems > pageSize) {
                await fetchSchedulesPagination({
                    monthYear,
                    isActive: null,
                    page: 1,
                    size: Math.max(totalItems, pageSize)
                });
            }
        } catch (error) {
            showToast.error("Lỗi khi tải dữ liệu lịch tiếp dân.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const monthYear = `${selectedMonth}/${selectedYear}`;

        fetchAllSchedulesData(monthYear);

        setCurrentPage(1);
        setActiveFilter("all");
        setSelectedDate(null);
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        return () => {
            if (error) {
                clearError();
            }
        };
    }, [error, clearError]);

    const handleDateSelect = async (date) => {
        setSelectedDate(date);
        setCurrentPage(1);

        const isActiveValue = activeFilter === "all" ? null : activeFilter === "active" ? true : false;

        if (date) {
            await Promise.all([
                fetchSchedulesPagination({
                    date: date,
                    isActive: isActiveValue,
                    page: 1,
                    size: pageSize
                }),
                fetchCounts(null, date)
            ]);
        } else {
            const monthYear = `${selectedMonth}/${selectedYear}`;
            await Promise.all([
                fetchSchedulesPagination({
                    monthYear,
                    isActive: isActiveValue,
                    page: 1,
                    size: pageSize
                }),
                fetchCounts(monthYear)
            ]);
        }
    };

    const handleMonthChange = (newMonth, forceRefresh = false) => {
        if (forceRefresh && newMonth === selectedMonth) {
            const monthYear = `${newMonth}/${selectedYear}`;
            setCurrentPage(1);
            setActiveFilter("all");
            setSelectedDate(null);
            fetchAllSchedulesData(monthYear);
        } else {
            setSelectedMonth(newMonth);
        }
    };

    const handleYearChange = (newYear, forceRefresh = false) => {
        if (forceRefresh && newYear === selectedYear) {
            const monthYear = `${selectedMonth}/${newYear}`;
            setCurrentPage(1);
            setActiveFilter("all");
            setSelectedDate(null);
            fetchAllSchedulesData(monthYear);
        } else {
            setSelectedYear(newYear);
        }
    };

    const handleEdit = (schedule) => {
        setModalState({
            isOpen: true,
            mode: "edit",
            data: schedule,
        });
    };

    const handleDelete = (schedule) => {
        setDeleteConfirm({ isOpen: true, schedule });
    };

    const handleUpdateStatus = async (schedule) => {
        try {
            const res = await updateStatus(schedule);
            if (res.success) {
                const monthYear = `${selectedMonth}/${selectedYear}`;
                const isActiveValue = activeFilter === "all" ? null : activeFilter === "active" ? true : false;

                showToast.success("Cập nhật trạng thái lịch tiếp dân thành công.");

                if (selectedDate) {
                    await Promise.all([
                        fetchSchedulesPagination({
                            date: selectedDate,
                            isActive: isActiveValue,
                            page: currentPage,
                            size: pageSize
                        }),
                        fetchCounts(null, selectedDate)
                    ]);
                } else {
                    await Promise.all([
                        fetchSchedulesPagination({
                            monthYear,
                            isActive: isActiveValue,
                            page: currentPage,
                            size: pageSize
                        }),
                        fetchCounts(monthYear)
                    ]);
                }
            } else {
                showToast.error(
                    res.error || "Cập nhật trạng thái lịch tiếp dân thất bại."
                );
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi cập nhật trạng thái lịch tiếp dân.");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.schedule) return;

        try {
            const result = await deleteSchedule(deleteConfirm.schedule.id);
            if (result.success) {
                showToast.success("Đã xóa lịch tiếp dân thành công.");
            } else {
                showToast.error(result.error || "Xóa lịch tiếp dân thất bại.");
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi xóa lịch tiếp dân.");
        } finally {
            setDeleteConfirm({ isOpen: false, schedule: null });
        }
    };

    const handleDownload = async () => {
        try {
            const result = await getTemplate();
            if (result.success) {
                downloadUtils.handleDownloadExcel(result.data.data);
                showToast.success(
                    result.message || "Đã tải xuống template lịch tiếp dân."
                );
            } else {
                showToast.error(result.error || "Lấy template lịch tiếp dân thất bại.");
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi tải template lịch tiếp dân.");
        }
    };

    const handleImport = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx,.xls,.csv";
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const validation = await validateFileImport({ file });
            if (!validation.valid) {
                showToast.error(validation.errors.file);
                return;
            }

                try {
                showToast.info(`Đang import file ${file.name}...`);
                const result = await importSchedule(file);
                if (result.success) {
                    const monthYear = `${selectedMonth}/${selectedYear}`;
                    showToast.success(result.data?.message || "Import lịch tiếp dân thành công!");
                    setCurrentPage(1);
                    setActiveFilter("all");
                    setSelectedDate(null);
                    await fetchAllSchedulesData(monthYear);
                } else {
                    showToast.error(
                        result.error ||
                        "Import lịch tiếp dân thất bại. Vui lòng kiểm tra định dạng file."
                    );
                }
            } catch (error) {
                showToast.error(
                    "Có lỗi xảy ra khi import. Vui lòng thử lại hoặc kiểm tra định dạng file."
                );
            }
        };
        input.click();
    };

    const handleAddSchedule = () => {
        setModalState({
            isOpen: true,
            mode: "create",
            data: null,
        });
    };

    const handleCloseModal = () => {
        setModalState({
            isOpen: false,
            mode: "create",
            data: null,
        });
    };

    const handleSubmitSchedule = async (scheduleData, mode) => {
        try {
            let result;

            if (mode === "create") {
                result = await createScheduleItem(scheduleData);
            } else {
                result = await updateScheduleItem(modalState.data.id, scheduleData);
            }

            if (result.success) {
                const monthYear = `${selectedMonth}/${selectedYear}`;
                const isActiveValue = activeFilter === "all" ? null : activeFilter === "active" ? true : false;

                showToast.success(
                    mode === "create"
                        ? "Tạo lịch tiếp dân thành công!"
                        : "Cập nhật lịch tiếp dân thành công!"
                );

                if (selectedDate) {
                    await Promise.all([
                        fetchSchedulesPagination({
                            date: selectedDate,
                            isActive: isActiveValue,
                            page: currentPage,
                            size: pageSize
                        }),
                        fetchCounts(monthYear)
                    ]);
                } else {
                    await Promise.all([
                        fetchSchedulesPagination({
                            monthYear,
                            isActive: isActiveValue,
                            page: currentPage,
                            size: pageSize
                        }),
                        fetchCounts(monthYear)
                    ]);
                }
                return true;
            } else {
                showToast.error(result.error || "Có lỗi xảy ra!");
                return false;
            }
        } catch (error) {
            showToast.error("Có lỗi xảy ra khi xử lý lịch tiếp dân!");
            return false;
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);

        const isActiveValue = activeFilter === "all" ? null : activeFilter === "active" ? true : false;

        if (selectedDate) {
            fetchSchedulesPagination({
                date: selectedDate,
                isActive: isActiveValue,
                page,
                size: pageSize
            });
        } else {
            fetchSchedulesPagination({
                monthYear: `${selectedMonth}/${selectedYear}`,
                isActive: isActiveValue,
                page,
                size: pageSize
            });
        }
    };

    const displaySchedules = useMemo(() => {
        if (!isOfficer) {
            return schedules;
        }
        const currentName = (currentUser?.ho_va_ten || currentUser?.fullName || currentUser?.name || "").toLowerCase().trim();
        const currentUsername = (currentUser?.username || currentUser?.tenDangNhap || "").toLowerCase().trim();

        return schedules.filter((s) => {
            const tenCanBo = (s.ten_can_bo || "").toLowerCase().trim();
            if (!tenCanBo) return false;
            return (
                (currentName && tenCanBo.includes(currentName)) ||
                (currentUsername && tenCanBo.includes(currentUsername)) ||
                (currentUsername === "canbo" && (tenCanBo.includes("nguyễn v") || tenCanBo.includes("cán bộ tiếp nhận") || tenCanBo === "canbo")) ||
                (currentUsername === "canbo3" && (tenCanBo.includes("canbo3") || tenCanBo.includes("cán bộ 3")))
            );
        });
    }, [schedules, isOfficer, currentUser]);

    const officerMonthSchedules = useMemo(() => {
        if (!isOfficer) {
            return monthSchedulesRaw;
        }
        const currentName = (currentUser?.ho_va_ten || currentUser?.fullName || currentUser?.name || "").toLowerCase().trim();
        const currentUsername = (currentUser?.username || currentUser?.tenDangNhap || "").toLowerCase().trim();

        return monthSchedulesRaw.filter((s) => {
            const tenCanBo = (s.ten_can_bo || "").toLowerCase().trim();
            if (!tenCanBo) return false;
            return (
                (currentName && tenCanBo.includes(currentName)) ||
                (currentUsername && tenCanBo.includes(currentUsername)) ||
                (currentUsername === "canbo" && (tenCanBo.includes("nguyễn v") || tenCanBo.includes("cán bộ tiếp nhận") || tenCanBo === "canbo")) ||
                (currentUsername === "canbo3" && (tenCanBo.includes("canbo3") || tenCanBo.includes("cán bộ 3")))
            );
        });
    }, [monthSchedulesRaw, isOfficer, currentUser]);

    const officerCounts = useMemo(() => {
        if (!isOfficer) return counts;
        const all = displaySchedules.length;
        const active = displaySchedules.filter((s) => s.trang_thai !== false && s.is_active !== false).length;
        const inactive = all - active;
        return { all, active, inactive };
    }, [isOfficer, displaySchedules, counts]);

    const officerHasScheduleForDay = (dayOrDate) => {
        if (!dayOrDate) return false;
        const listToCheck = isOfficer ? officerMonthSchedules : (monthSchedulesRaw.length > 0 ? monthSchedulesRaw : schedules);

        if (typeof dayOrDate === "string") {
            const targetNorm = normalizeDate(dayOrDate);
            return listToCheck.some((s) => {
                const sDate = s.ngay_tiep_dan || s.date;
                if (!sDate) return false;
                return normalizeDate(sDate) === targetNorm;
            });
        }

        return listToCheck.some((s) => {
            const sDate = s.ngay_tiep_dan || s.date;
            if (!sDate) return false;
            const norm = normalizeDate(sDate);
            if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) {
                const [sYear, sMonth, sDay] = norm.split('-').map(Number);
                return (
                    sDay === dayOrDate &&
                    sMonth === selectedMonth &&
                    sYear === selectedYear
                );
            }
            return false;
        });
    };

    const handleActiveFilterChange = async (filter) => {
        if (filter === activeFilter) return;

        setActiveFilter(filter);
        setCurrentPage(1);

        const isActiveValue = filter === "all" ? null : filter === "active" ? true : false;

        // Chỉ fetch danh sách, không fetch count vì count đã có sẵn
        if (selectedDate) {
            await fetchSchedulesPagination({
                date: selectedDate,
                isActive: isActiveValue,
                page: 1,
                size: pageSize
            });
        } else {
            const monthYear = `${selectedMonth}/${selectedYear}`;
            await fetchSchedulesPagination({
                monthYear,
                isActive: isActiveValue,
                page: 1,
                size: pageSize
            });
        }
    };

    const handleResetFilter = async () => {
        const monthYear = `${selectedMonth}/${selectedYear}`;
        setActiveFilter("all");
        setSelectedDate(null);
        setCurrentPage(1);

        await Promise.all([
            fetchSchedulesPagination({
                monthYear,
                isActive: null,
                page: 1,
                size: pageSize
            }),
            fetchCounts(monthYear)
        ]);

        showToast.success("Đã làm mới bộ lọc");
    };

    return (
        <div className="min-h-screen relative">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        {isOfficer ? "Xem ca trực" : "Quản lý lịch tiếp dân & Quầy phục vụ"}
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        {isOfficer
                            ? "Theo dõi danh sách ca trực và lịch phân công làm việc của bạn"
                            : "Lập lịch ca trực, phân công cán bộ vào 8 quầy và quản lý danh mục quầy Một cửa"}
                    </p>
                </div>

                {!isOfficer && mainTab === "schedules" && (
                    <div className="flex gap-2 md:gap-3 flex-wrap">
                        <PermissionHidden modulePrefix="LTD" action="CREATE">
                            <button
                                onClick={handleDownload}
                                className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-2xs"
                            >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download Template</span>
                                <span className="sm:hidden">Excel</span>
                            </button>
                        </PermissionHidden>
                        <PermissionHidden modulePrefix="LTD" action="CREATE">
                            <button
                                onClick={handleImport}
                                className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-2xs"
                            >
                                <Upload className="w-4 h-4" />
                                <span className="hidden sm:inline">Import</span>
                                <span className="sm:hidden">Import</span>
                            </button>
                        </PermissionHidden>
                        <PermissionHidden modulePrefix="LTD" action="CREATE">
                            <button
                                onClick={handleAddSchedule}
                                className="px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Thêm lịch</span>
                                <span className="sm:hidden">Thêm</span>
                            </button>
                        </PermissionHidden>
                    </div>
                )}
            </div>

            {/* MAIN TAB SWITCHER (Leader only) */}
            {!isOfficer && (
                <div className="flex items-center gap-2 border-b border-gray-200 mb-5 pb-3">
                    <button
                        type="button"
                        onClick={() => setMainTab("schedules")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            mainTab === "schedules"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <CalendarIcon size={16} />
                        <span>Lịch Tiếp dân & Import Excel</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMainTab("counters")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                            mainTab === "counters"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                    >
                        <Users size={16} />
                        <span>Phân công Quầy & Quản lý 8 Quầy</span>
                    </button>
                </div>
            )}

            {!isOfficer && mainTab === "counters" ? (
                <CounterManagementTab />
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">
                                    Lọc theo trạng thái:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleActiveFilterChange("all")}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "all"
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Tất cả ({officerCounts.all})
                                    </button>
                                    <button
                                        onClick={() => handleActiveFilterChange("active")}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "active"
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Hoạt động ({officerCounts.active})
                                    </button>
                                    <button
                                        onClick={() => handleActiveFilterChange("inactive")}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "inactive"
                                            ? "bg-gray-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        Ngừng hoạt động ({officerCounts.inactive})
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleResetFilter}
                                    className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    title="Làm mới bộ lọc"
                                >
                                    <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Làm mới</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                        <div className="flex-1 order-2 lg:order-1">
                            <ScheduleList
                                schedules={displaySchedules}
                                loading={loading}
                                error={error}
                                onEdit={isOfficer ? null : handleEdit}
                                onStatus={isOfficer ? null : handleUpdateStatus}
                                onDelete={isOfficer ? null : handleDelete}
                                formatDate={formatDate}
                                selectedDate={selectedDate}
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        </div>

                        <div className="w-full lg:w-96 order-1 lg:order-2">
                            <MonthCalendar
                                month={selectedMonth}
                                year={selectedYear}
                                onDateSelect={handleDateSelect}
                                onMonthChange={handleMonthChange}
                                onYearChange={handleYearChange}
                                selectedDate={selectedDate}
                                hasScheduleForDay={officerHasScheduleForDay}
                            />
                        </div>
                    </div>
                </>
            )}

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, schedule: null })}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa lịch tiếp dân ngày ${dayjs(
                    deleteConfirm.schedule?.ngay_tiep_dan
                ).format("DD/MM/YYYY")} ?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />

            <WorkScheduleModal
                isOpen={modalState.isOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmitSchedule}
                initialData={modalState.data}
                mode={modalState.mode}
            />
        </div>
    );
}
