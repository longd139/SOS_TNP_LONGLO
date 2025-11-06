import { useState, useEffect } from "react";
import { Download, Upload, Plus } from "lucide-react";
import { showToast } from "../../utils/toastNotification";
import { ConfirmModal } from "../../components/base/BaseModal";
import { useSchedule } from "../../hooks/useSchedule";
import MonthCalendar from "../../components/workSchedule/MonthCalendar";
import ScheduleList from "../../components/workSchedule/ScheduleList";
import dayjs from "dayjs";

export default function WorkSchedule() {
    const {
        loading,
        error,
        selectedMonth,
        selectedYear,
        schedules,
        fetchSchedules,
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
        setShowActive,
    } = useSchedule();

    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        schedule: null,
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all"); // "all", "active", "inactive"

    // Fetch schedules on component mount
    useEffect(() => {
        fetchSchedules();
    }, [fetchSchedules]);

    // Clear error on unmount
    useEffect(() => {
        return () => {
            if (error) {
                clearError();
            }
        };
    }, [error, clearError]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    const handleMonthChange = (newMonth) => {
        setSelectedMonth(newMonth);
        setSelectedDate(null); // Reset selected date when changing month
        fetchSchedules({ monthYear: `${newMonth}/${selectedYear}` });
    };

    const handleYearChange = (newYear) => {
        setSelectedYear(newYear);
        setSelectedDate(null);
        fetchSchedules({ monthYear: `${selectedMonth}/${newYear}` });
    };

    const handleEdit = (schedule) => {
        showToast.showInfo("Tính năng chỉnh sửa lịch đang được phát triển.");
    };

    const handleDelete = (schedule) => {
        setDeleteConfirm({ isOpen: true, schedule });
    };

    const handleUpdateStatus = async (schedule) => {
        try {
            const res = await updateStatus(schedule);
            if (res.success) {
                showToast.success("Cập nhật trạng thái lịch tiếp dân thành công.");
            } else {
                showToast.error(res.error || "Cập nhật trạng thái lịch tiếp dân thất bại.");
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

    const handleExport = () => {
        showToast.info("Tính năng xuất Excel đang được phát triển.");
    };

    const handleImport = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".xlsx,.xls,.csv";
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const maxSize = 10 * 1024 * 1024;
                if (file.size > maxSize) {
                    showToast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
                    return;
                }

                const allowedTypes = [
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
                    "application/vnd.ms-excel",
                    "text/csv",
                ];

                if (!allowedTypes.includes(file.type)) {
                    showToast.error(
                        "Định dạng file không hỗ trợ. Vui lòng chọn file .xlsx, .xls hoặc .csv"
                    );
                    return;
                }

                try {
                    showToast.info(`Đang import file ${file.name}...`);
                    const result = await importSchedule(file);

                    if (result.success) {
                        showToast.success(
                            `Import thành công! Đã import ${result.data?.importedCount || 0
                            } lịch tiếp dân.`
                        );
                        fetchSchedules();
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
            }
        };
        input.click();
    };

    const handleAddSchedule = () => {
        showToast.info("Tính năng thêm lịch đang được phát triển.");
    };

    const filterByActive = (scheduleList) => {
        if (activeFilter === "all") return scheduleList;
        if (activeFilter === "active") {
            return scheduleList.filter(s => s.is_active === true || s.isActive === true);
        }
        if (activeFilter === "inactive") {
            return scheduleList.filter(s => s.is_active === false || s.isActive === false);
        }
        return scheduleList;
    };

    const displaySchedules = filterByActive(
        selectedDate
            ? getSchedulesForDate(selectedDate)
            : getSchedulesForDisplay()
    );

    const handleActiveFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    return (
        <div className="min-h-screen relative">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Quản lý lịch tiếp dân
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Lập lịch và quản lý lịch tiếp dân của lãnh đạo
                    </p>
                </div>

                <div className="flex gap-2 md:gap-3 flex-wrap">
                    <button
                        onClick={handleExport}
                        className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Xuất Excel</span>
                        <span className="sm:hidden">Excel</span>
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Import</span>
                        <span className="sm:hidden">Import</span>
                    </button>
                    <button
                        onClick={handleAddSchedule}
                        className="px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm lịch</span>
                        <span className="sm:hidden">Thêm</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Lọc theo trạng thái:</span>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => handleActiveFilterChange("all")}
                            className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Tất cả ({schedules.length})
                        </button>
                        <button
                            onClick={() => handleActiveFilterChange("active")}
                            className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "active"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Hoạt động ({schedules.filter(s => s.is_active === true || s.isActive === true).length})
                        </button>
                        <button
                            onClick={() => handleActiveFilterChange("inactive")}
                            className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg transition-colors ${activeFilter === "inactive"
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Đã khóa ({schedules.filter(s => s.is_active === false || s.isActive === false).length})
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
                        onEdit={handleEdit}
                        onStatus={handleUpdateStatus}
                        onDelete={handleDelete}
                        formatDate={formatDate}
                        selectedDate={selectedDate}
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
                message={`Bạn có chắc chắn muốn xóa lịch tiếp dân ngày ${dayjs(deleteConfirm.schedule?.ngay_tiep_dan).format("DD/MM/YYYY")} ?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
