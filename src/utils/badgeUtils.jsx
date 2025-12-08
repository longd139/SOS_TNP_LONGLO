import React from "react";
import { AlertTriangle } from "lucide-react";

export const getStatusStyle = (statusName) => {
    const styles = {
        "mới": { bg: "#FEF3C7", color: "#92400E" },
        "đã gửi": { bg: "#FEF3C7", color: "#92400E" },
        "đã tiếp nhận": { bg: "#DBEAFE", color: "#1E40AF" },
        "đang xử lý": { bg: "#beeaeaff", color: "#3e88c4ff" },
        "đã giải quyết": { bg: "#D1FAE5", color: "#065F46" },
        "đóng": { bg: "#E5E7EB", color: "#374151" },
    };
    return styles[statusName.toLowerCase()] || { bg: "#F3F4F6", color: "#6B7280" };
};

export const getUrgencyStyle = (mucDo) => {
    const styles = {
        "cao": { bg: "#FEE2E2", color: "#991B1B", showIcon: true },
        "khẩn cấp": { bg: "#FEE2E2", color: "#991B1B", showIcon: true },
        "trung bình": { bg: "#FEF3C7", color: "#92400E", showIcon: false },
        "thấp": { bg: "#E5E7EB", color: "#6B7280", showIcon: false },
    };
    return styles[mucDo.toLowerCase()] || { bg: "#F3F4F6", color: "#6B7280", showIcon: false };
};

export const getCategoryStyle = (categoryName) => {
    const styles = {
        "môi trường": { bg: "black", color: "white" },
        "hạ tầng": { bg: "#DBEAFE", color: "#1E40AF" },
        "kiến nghị": { bg: "#D1FAE5", color: "#065F46" },
        "khác": { bg: "#E5E7EB", color: "#374151" },
    };
    return styles[categoryName.toLowerCase()] || { bg: "#E0E7FF", color: "#3730A3" };
};

export const renderStatusBadge = (lichSuTrangThai) => {
    if (!lichSuTrangThai || lichSuTrangThai.length === 0) {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                Chưa cập nhật
            </span>
        );
    }

    const currentStatus = lichSuTrangThai[0].ten;
    const style = getStatusStyle(currentStatus);

    return (
        <span
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
            style={{
                backgroundColor: style.bg,
                color: style.color,
            }}
        >
            {currentStatus}
        </span>
    );
};

export const renderCategoryBadge = (linhVuc) => {
    if (!linhVuc || !linhVuc.ten) {
        return <span className="text-sm text-gray-400">-</span>;
    }

    return (
        <span className="text-sm text-gray-900">
            {linhVuc.ten}
        </span>
    );
};

export const renderCategoryBadgeStyled = (linhVuc) => {
    if (!linhVuc || !linhVuc.ten) {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                -
            </span>
        );
    }

    const style = getCategoryStyle(linhVuc.ten);

    return (
        <span
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
            style={{
                backgroundColor: style.bg,
                color: style.color,
            }}
        >
            {linhVuc.ten}
        </span>
    );
};

export const renderUrgencyBadge = (mucDo) => {
    if (!mucDo) {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                -
            </span>
        );
    }

    const style = getUrgencyStyle(mucDo);

    return (
        <span
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full"
            style={{
                backgroundColor: style.bg,
                color: style.color,
            }}
        >
            {style.showIcon && <AlertTriangle className="w-3 h-3" />}
            {mucDo}
        </span>
    );
};

export const renderContactInfo = (contactInfo, maxWidth = 180) => {
    const name = contactInfo?.name || "Ẩn danh";
    const phone = contactInfo?.phone || null;
    const fullText = phone ? `${name}\n${phone}` : name;
    const isAnonymous = name === "Ẩn danh";

    return (
        <div className="text-sm overflow-wrap-anywhere max-w-full" style={{ maxWidth: `${maxWidth}px` }} title={fullText}>
            {isAnonymous ? (
                <span className="inline-flex items-center text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md text-xs break-words">
                    {name}
                </span>
            ) : (
                <div className="space-y-1">
                    <div className="text-gray-900 break-words overflow-wrap-anywhere word-break-break-word">
                        {name}
                    </div>
                    {phone && (
                        <div className="text-gray-600 break-words overflow-wrap-anywhere word-break-break-word">
                            {phone}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
