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
  } = useSchedule();

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    schedule: null,
  });

  const [selectedDate, setSelectedDate] = useState(null);

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
    // Fetch schedules for the new month
    fetchSchedules({ monthYear: `${newMonth}/${selectedYear}` });
  };

  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    setSelectedDate(null); // Reset selected date when changing year
    // Fetch schedules for the new year
    fetchSchedules({ monthYear: `${selectedMonth}/${newYear}` });
  };

  const handleEdit = (schedule) => {
    console.log("Edit schedule:", schedule);
    // TODO: Open edit modal
  };

  const handleDelete = (schedule) => {
    setDeleteConfirm({ isOpen: true, schedule });
  };

  const handleUpdateStatus = async (schedule) => {
    try{
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
    console.log("Export to Excel");
    // TODO: Implement Excel export
    showToast.info("Tính năng xuất Excel đang được phát triển.");
  };

  const handleImport = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        // Validate file
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          showToast.error("File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
          return;
        }

        const allowedTypes = [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
          "application/vnd.ms-excel", // .xls
          "text/csv", // .csv
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
              `Import thành công! Đã import ${
                result.data?.importedCount || 0
              } lịch tiếp dân.`
            );
            // Force refresh the data
            fetchSchedules();
          } else {
            showToast.error(
              result.error ||
                "Import lịch tiếp dân thất bại. Vui lòng kiểm tra định dạng file."
            );
          }
        } catch (error) {
          console.error("Import error:", error);
          showToast.error(
            "Có lỗi xảy ra khi import. Vui lòng thử lại hoặc kiểm tra định dạng file."
          );
        }
      }
    };
    input.click();
  };

  const handleAddSchedule = () => {
    console.log("Add new schedule");
    // TODO: Open add modal
    showToast.info("Tính năng thêm lịch đang được phát triển.");
  };

  // Get schedules to display based on selected date
  const displaySchedules = selectedDate
    ? getSchedulesForDate(selectedDate)
    : getSchedulesForDisplay();

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

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Đang xử lý...</p>
          </div>
        </div>
      )}
    </div>
  );
}
