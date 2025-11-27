import { useState, useEffect } from "react";
import { Download, Upload, Plus, RotateCcw } from "lucide-react";
import { showToast } from "../../utils/toastNotification";
import { ConfirmModal } from "../../components/base/BaseModal";
import { useSchedule } from "../../hooks/useSchedule";
import MonthCalendar from "../../components/workSchedule/MonthCalendar";
import ScheduleList from "../../components/workSchedule/ScheduleList";
import WorkScheduleModal from "../../components/workSchedule/WorkScheduleModal";
import { usePermission } from "../../hooks/usePermission";
import { PermissionHidden } from "../../components/PermissionGuard";
import dayjs from "dayjs";
import { validateFileImport } from "../../validator/fileValidator";
import { downloadUtils } from "../../utils/downLoadUtils";
import { isPastDate } from "../../validator/workScheduleValidator";
import { WORK_SCHEDULE_API } from "../../apis/workSchedule";

export default function WorkSchedule() {
    const {
        loading,
        error,
        selectedMonth,
        selectedYear,
        schedules,
        allSchedules,
        pagination,
        counts,
        fetchSchedules,
        fetchSchedulesPagination,
        importSchedule,
        deleteSchedule,
        hasScheduleForDay,
        getSchedulesForDisplay,
        getSchedulesForDate,
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

    const { canCreate, canUpdate, canDelete, canUpdateStatus } = usePermission();

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

    const pageSize = 10;

    const fetchCounts = async (monthYear) => {
        try {
            const [allResult, activeResult, inactiveResult] = await Promise.all([
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, null, 1, 1),
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, true, 1, 1),
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, false, 1, 1)
            ]);

            setCounts({
                all: allResult.pagination?.totalItems || 0,
                active: activeResult.pagination?.totalItems || 0,
                inactive: inactiveResult.pagination?.totalItems || 0
            });
        } catch (error) {
        }
    };

    const fetchAllSchedulesData = async (monthYear) => {
        if (isFetching) {
            return;
        }

        setIsFetching(true);

        try {
            const [allResult, activeResult, inactiveResult] = await Promise.all([
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, null, 1, 1),
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, true, 1, 1),
                WORK_SCHEDULE_API.getWorkSchedulesPagination(null, monthYear, null, false, 1, 1)
            ]);

            const totalItems = allResult.pagination?.totalItems || 0;

            setCounts({
                all: totalItems,
                active: activeResult.pagination?.totalItems || 0,
                inactive: inactiveResult.pagination?.totalItems || 0
            });

            if (totalItems > 0) {
                await fetchSchedulesPagination({
                    monthYear,
                    isActive: null,
                    page: 1,
                    size: totalItems
                });
            }

            await fetchSchedulesPagination({
                monthYear,
                isActive: null,
                page: 1,
                size: pageSize
            });
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

        if (date) {
            fetchSchedulesPagination({
                date: date,
                isActive: activeFilter === "all" ? null : activeFilter === "active" ? true : false,
                page: 1,
                size: pageSize
            });

            try {
                const [allResult, activeResult, inactiveResult] = await Promise.all([
                    WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, date, null, 1, 1),
                    WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, date, true, 1, 1),
                    WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, date, false, 1, 1)
                ]);

                setCounts({
                    all: allResult.pagination?.totalItems || 0,
                    active: activeResult.pagination?.totalItems || 0,
                    inactive: inactiveResult.pagination?.totalItems || 0
                });
            } catch (error) {
            }
        } else {
            const monthYear = `${selectedMonth}/${selectedYear}`;
            fetchSchedulesPagination({
                monthYear,
                isActive: activeFilter === "all" ? null : activeFilter === "active" ? true : false,
                page: 1,
                size: pageSize
            });

            fetchCounts(monthYear);
        }
    };

    const handleMonthChange = (newMonth) => {
        setSelectedMonth(newMonth);
    };

    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
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
                    fetchSchedulesPagination({
                        date: selectedDate,
                        isActive: isActiveValue,
                        page: currentPage,
                        size: pageSize
                    });

                    const [allResult, activeResult, inactiveResult] = await Promise.all([
                        WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, selectedDate, null, 1, 1),
                        WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, selectedDate, true, 1, 1),
                        WORK_SCHEDULE_API.getWorkSchedulesPagination(null, null, selectedDate, false, 1, 1)
                    ]);
                    setCounts({
                        all: allResult.pagination?.totalItems || 0,
                        active: activeResult.pagination?.totalItems || 0,
                        inactive: inactiveResult.pagination?.totalItems || 0
                    });
                } else {
                    fetchSchedulesPagination({
                        monthYear,
                        isActive: isActiveValue,
                        page: currentPage,
                        size: pageSize
                    });
                    fetchCounts(monthYear);
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
                    showToast.success(result.data?.message);
                    fetchSchedulesPagination({
                        monthYear,
                        isActive: null,
                        page: 1,
                        size: pageSize
                    });
                    fetchCounts(monthYear);
                    setCurrentPage(1);
                    setActiveFilter("all");
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
                    fetchSchedulesPagination({
                        date: selectedDate,
                        isActive: isActiveValue,
                        page: currentPage,
                        size: pageSize
                    });
                } else {
                    fetchSchedulesPagination({
                        monthYear,
                        isActive: isActiveValue,
                        page: currentPage,
                        size: pageSize
                    });
                }
                fetchCounts(monthYear);
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

    const displaySchedules = schedules;

    const handleActiveFilterChange = (filter) => {
        if (filter === activeFilter) return;

        setActiveFilter(filter);
        setCurrentPage(1);

        const isActiveValue = filter === "all" ? null : filter === "active" ? true : false;

        if (selectedDate) {
            fetchSchedulesPagination({
                date: selectedDate,
                isActive: isActiveValue,
                page: 1,
                size: pageSize
            });
        } else {
            const monthYear = `${selectedMonth}/${selectedYear}`;
            fetchSchedulesPagination({
                monthYear,
                isActive: isActiveValue,
                page: 1,
                size: pageSize
            });
        }
    };

    const handleResetFilter = () => {
        const monthYear = `${selectedMonth}/${selectedYear}`;
        setActiveFilter("all");
        setSelectedDate(null);
        setCurrentPage(1);

        fetchSchedulesPagination({
            monthYear,
            isActive: null,
            page: 1,
            size: pageSize
        });
        fetchCounts(monthYear);

        showToast.success("Đã làm mới bộ lọc");
    };

    return (
        <div className="min-h-screen relative">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Quản lý lịch tiếp dân
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Lập lịch và quản lý lịch tiếp dân sắp tới của lãnh đạo
                    </p>
                </div>

                <div className="flex gap-2 md:gap-3 flex-wrap">
                    <PermissionHidden modulePrefix="LTD" action="CREATE">
                        <button
                            onClick={handleDownload}
                            className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download Template</span>
                            <span className="sm:hidden">Excel</span>
                        </button>
                    </PermissionHidden>
                    <PermissionHidden modulePrefix="LTD" action="CREATE">
                        <button
                            onClick={handleImport}
                            className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Import</span>
                            <span className="sm:hidden">Import</span>
                        </button>
                    </PermissionHidden>
                    <PermissionHidden modulePrefix="LTD" action="CREATE">
                        <button
                            onClick={handleAddSchedule}
                            className="px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">Thêm lịch</span>
                            <span className="sm:hidden">Thêm</span>
                        </button>
                    </PermissionHidden>
                </div>
            </div>

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
                                Tất cả ({counts.all})
                            </button>
                            <button
                                onClick={() => handleActiveFilterChange("active")}
                                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "active"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Hoạt động ({counts.active})
                            </button>
                            <button
                                onClick={() => handleActiveFilterChange("inactive")}
                                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "inactive"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                Đã khóa ({counts.inactive})
                            </button>
                        </div>
                    </div>
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

            <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                <div className="flex-1 order-2 lg:order-1">
                    <ScheduleList
                        schedules={displaySchedules}
                        loading={loading}
                        error={error}
                        onEdit={handleEdit}
                        onStatus={handleUpdateStatus}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                        selectedDate={selectedDate}
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        canEdit={() => canUpdate('LTD')}
                        canDelete={() => canDelete('LTD')}
                        canUpdateStatus={() => canUpdateStatus('LTD')}
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
                        hasScheduleForDay={hasScheduleForDay}
                    />
                </div>
            </div>

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
