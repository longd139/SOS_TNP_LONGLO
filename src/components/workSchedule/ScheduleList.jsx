import { Clock, MapPin, User, FileText, Pencil, Trash2, ToggleLeft, Calendar } from "lucide-react";

export default function ScheduleList({
    schedules,
    loading,
    error,
    onEdit,
    onStatus,
    onDelete,
    formatDate,
    selectedDate,
}) {
    const getFieldValue = (schedule, field, fallback = "N/A") => {
        const possibleFields = {
            date: ["ngay_tiep_dan", "date"],
            time: ["thoi_gian", "time"],
            leader: ["ten_can_bo", "leader"],
            location: ["dia_diem", "location"],
            purpose: ["ghi_chu", "purpose"],
        };

        if (possibleFields[field]) {
            for (const fieldName of possibleFields[field]) {
                if (schedule[fieldName]) {
                    return schedule[fieldName];
                }
            }
        }

        return schedule[field] || fallback;
    };

    const getDisplayMessage = () => {
        if (selectedDate) {
            const selectedSchedules = schedules.filter(
                (s) => getFieldValue(s, "date") === selectedDate
            );
            if (selectedSchedules.length === 0) {
                const formattedDate = formatDate
                    ? formatDate(selectedDate)
                    : selectedDate;
                return {
                    icon: <Calendar className="w-12 h-12 text-gray-300 mx-auto" />,
                    title: "Không có lịch tiếp dân",
                    message: `Ngày ${formattedDate} chưa có lịch tiếp dân nào`,
                };
            }
        }

        return {
            icon: <Calendar className="w-12 h-12 text-gray-300 mx-auto" />,
            title: "Chưa có lịch tiếp dân nào",
            message: "Hãy thêm lịch mới hoặc import từ file Excel",
        };
    };

    const displayMessage = getDisplayMessage();

    console.log("Rendered ScheduleList with schedules:", schedules);
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
            <div className="flex items-center justify-between mb-2 md:mb-3">
                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                    {selectedDate ? "Lịch tiếp dân trong ngày" : "Lịch tiếp dân sắp tới"}
                </h2>
                <span className="text-sm text-gray-500">({schedules.length} lịch)</span>
            </div>

            <div className="space-y-2 md:space-y-3">
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-8 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="mb-4 text-4xl">{displayMessage.icon}</div>
                        <p className="text-lg font-medium mb-2">{displayMessage.title}</p>
                        <p className="text-sm">{displayMessage.message}</p>
                    </div>
                ) : (
                    schedules.map((schedule) => (
                        <div
                            key={schedule.id}
                            className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200 hover:border-blue-300 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 md:gap-3 mb-2 md:mb-3">
                                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                    <div className="bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium">
                                        {formatDate
                                            ? formatDate(getFieldValue(schedule, "date"))
                                            : getFieldValue(schedule, "date")}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="text-xs md:text-sm">
                                            {getFieldValue(schedule, "time")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 self-end sm:self-auto">
                                    {onEdit && (
                                        <button
                                            onClick={() => onEdit(schedule)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        </button>
                                    )}
                                    {onStatus && (
                                        <button
                                            onClick={() => onStatus(schedule)}
                                            className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-100"
                                            title="Cập nhật trạng thái"
                                        >
                                            <ToggleLeft className="w-4 h-4" />
                                        </button>
                                    )}
                                    {(onDelete && (schedule.is_active === false || schedule.isActive === false)) && (
                                        <button
                                            onClick={() => onDelete(schedule)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5 md:space-y-2">
                                <div className="flex items-start gap-2">
                                    <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700 text-xs md:text-sm">
                                        {getFieldValue(schedule, "leader")}
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-600 text-xs md:text-sm">
                                        {getFieldValue(schedule, "location")}
                                    </span>
                                </div>
                                {getFieldValue(schedule, "purpose") === "N/A" ? (
                                    ""
                                ) : (
                                    <div className="flex items-start gap-2">
                                        <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-600 text-xs md:text-sm">
                                            {getFieldValue(schedule, "purpose")}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
