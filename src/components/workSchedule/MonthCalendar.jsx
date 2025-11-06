import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

/**
 * MonthCalendar - Component hiển thị lịch tháng
 * @param {number} month - Tháng hiện tại (1-12)
 * @param {number} year - Năm hiện tại
 * @param {function} onDateSelect - Callback khi chọn ngày
 * @param {function} onMonthChange - Callback khi thay đổi tháng
 * @param {function} onYearChange - Callback khi thay đổi năm
 * @param {string} selectedDate - Ngày được chọn (YYYY-MM-DD)
 * @param {function} hasScheduleForDay - Function kiểm tra ngày có lịch
 */
export default function MonthCalendar({
  month,
  year,
  onDateSelect,
  onMonthChange,
  onYearChange,
  selectedDate,
  hasScheduleForDay,
}) {
  const [isMonthYearPickerOpen, setIsMonthYearPickerOpen] = useState(false);
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const days = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const daysArray = [];
    for (let i = 0; i < startDayOfWeek; i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(i);
    }
    return daysArray;
  }, [month, year]);

  const handleDayClick = (day) => {
    if (!day) return;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    onDateSelect?.(dateStr);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() + 1 &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return dateStr === selectedDate;
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      onMonthChange?.(12);
      onYearChange?.(year - 1);
    } else {
      onMonthChange?.(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      onMonthChange?.(1);
      onYearChange?.(year + 1);
    } else {
      onMonthChange?.(month + 1);
    }
  };

  const handleMonthSelect = (selectedMonth) => {
    onMonthChange?.(selectedMonth);
    setIsMonthYearPickerOpen(false);
  };

  const handleYearSelect = (selectedYear) => {
    onYearChange?.(selectedYear);
  };

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 relative">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Tháng trước"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>

        <button
          onClick={() => setIsMonthYearPickerOpen(!isMonthYearPickerOpen)}
          className="flex items-center gap-2 px-2 md:px-3 py-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          <h2 className="text-base md:text-lg font-semibold text-gray-900">
            Tháng {month}/{year}
          </h2>
        </button>

        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Tháng sau"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
        </button>
      </div>

      {/* Month/Year Picker Dropdown */}
      {isMonthYearPickerOpen && (
        <div className="absolute top-16 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn năm
            </label>
            <select
              value={year}
              onChange={(e) => handleYearSelect(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn tháng
            </label>
            <div className="grid grid-cols-3 gap-2">
              {months.map((monthName, index) => (
                <button
                  key={index}
                  onClick={() => handleMonthSelect(index + 1)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    month === index + 1
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {monthName}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsMonthYearPickerOpen(false)}
            className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Overlay to close picker when clicking outside */}
      {isMonthYearPickerOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsMonthYearPickerOpen(false)}
        />
      )}

      {/* Week days header */}
      <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] md:text-xs font-medium text-gray-600 py-1 md:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-0.5 md:gap-1">
        {days.map((day, index) => {
          const hasSchedule = hasScheduleForDay?.(day) || false;
          const isTodayDay = isToday(day);
          const isSelectedDay = isSelected(day);

          return (
            <div
              key={index}
              onClick={() => handleDayClick(day)}
              className={`
                aspect-square flex items-center justify-center text-xs md:text-sm rounded-md md:rounded-lg
                ${!day ? "invisible" : "cursor-pointer"}
                ${
                  hasSchedule
                    ? "bg-blue-600 text-white font-semibold hover:bg-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${isSelectedDay ? "ring-2 ring-blue-400 ring-offset-2" : ""}
                ${
                  isTodayDay && !hasSchedule
                    ? "border-2 border-blue-600 font-semibold"
                    : ""
                }
                transition-all
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
