import { useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Pencil, Trash2, Download, Upload, Plus } from 'lucide-react';
import { showConfirm } from '../../utils/confirmUtils';
import { showToast } from '../../utils/toastNotification';
import { scheduleList } from '../../mockData';

export default function WorkSchedule() {
    const [schedules, setSchedules] = useState(scheduleList);
    const [selectedMonth, setSelectedMonth] = useState(10); // October
    const [selectedYear, setSelectedYear] = useState(2025);

    const getDaysInMonth = (month, year) => {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const daysInMonth = lastDay.getDate();
        const startDayOfWeek = firstDay.getDay();

        const days = [];
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const hasSchedule = (day) => {
        if (!day) return false;
        const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return schedules.some(schedule => schedule.date === dateStr);
    };

    const getSchedulesForDisplay = () => {
        return schedules.sort((a, b) => new Date(a.date) - new Date(b.date));
    };

    const handleEdit = (schedule) => {
        console.log('Edit schedule:', schedule);
        // TODO: Open edit modal
    };

    const handleDelete = (schedule) => {
        const confirmed = showConfirm(`Bạn có chắc chắn muốn xóa lịch tiếp dân ngày ${schedule.date}?`);
        if (!confirmed) return;

        setSchedules(schedules.filter(s => s.id !== schedule.id));
        showToast.success('Đã xóa lịch tiếp dân thành công.');
    };

    const handleExport = () => {
        console.log('Export to Excel');
        // TODO: Implement Excel export
    };

    const handleImport = () => {
        console.log('Import from Excel');
        // TODO: Implement Excel import
    };

    const handleAddSchedule = () => {
        console.log('Add new schedule');
        // TODO: Open add modal
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
    };

    const days = getDaysInMonth(selectedMonth, selectedYear);
    const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return (
        <div className="min-h-screen">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                        Quản lý lịch tiếp dân
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Lập lịch và quản lý lịch tiếp dân của lãnh đạo
                    </p>
                </div>

                <div className="flex gap-2 md:gap-3">
                    <button
                        onClick={handleExport}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Xuất Excel</span>
                        <span className="sm:hidden">Excel</span>
                    </button>
                    <button
                        onClick={handleImport}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span className="hidden sm:inline">Import</span>
                        <span className="sm:hidden">Import</span>
                    </button>
                    <button
                        onClick={handleAddSchedule}
                        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm lịch</span>
                        <span className="sm:hidden">Thêm</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                <div className="flex-1 order-2 lg:order-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
                        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                            Lịch tiếp dân sắp tới
                        </h2>

                        <div className="space-y-2 md:space-y-3">
                            {getSchedulesForDisplay().map((schedule) => (
                                <div
                                    key={schedule.id}
                                    className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                            <div className="bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium">
                                                {formatDate(schedule.date)}
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                                <span className="text-xs md:text-sm">{schedule.time}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 self-end sm:self-auto">
                                            <button
                                                onClick={() => handleEdit(schedule)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(schedule)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Xóa"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 md:space-y-2">
                                        <div className="flex items-start gap-2">
                                            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700 text-xs md:text-sm">{schedule.leader}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 text-xs md:text-sm">{schedule.location}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 text-xs md:text-sm">{schedule.purpose}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-96 order-1 lg:order-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                                    Tháng {selectedMonth}/{selectedYear}
                                </h2>
                            </div>
                        </div>

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

                        <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                            {days.map((day, index) => {
                                const isScheduled = hasSchedule(day);
                                const today = new Date();
                                const isToday =
                                    day === today.getDate() &&
                                    selectedMonth === today.getMonth() + 1 &&
                                    selectedYear === today.getFullYear();

                                return (
                                    <div
                                        key={index}
                                        className={`
                                            aspect-square flex items-center justify-center text-xs md:text-sm rounded-md md:rounded-lg
                                            ${!day ? 'invisible' : ''}
                                            ${isScheduled ? 'bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer' : 'text-gray-700 hover:bg-gray-100'}
                                            ${isToday && !isScheduled ? 'border-2 border-blue-600 font-semibold' : ''}
                                            transition-colors
                                        `}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
