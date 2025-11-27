import React from 'react'
import BaseModal from '../base/BaseModal';
import {
    BadgeCheck, Calendar, ShieldCheck, Building2,
    ToggleLeft,
    CalendarPlus,
    CalendarCheck,
    CalendarX,
    RefreshCcw,
    FileText,
    BookOpen,
    FolderKanban,
    ClipboardList,
    Inbox,
    Eye,
    BarChart,
    FileSpreadsheet,
    Newspaper,
    Users,
    UserPlus,
    UserX,
    Shield,
    Upload,
    Circle
} from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const PermissionDetailModal = ({ isOpen, onClose, permisison }) => {
    if (!permisison) return null;

    const getPermissionIcon = (text) => {
        text = text.toLowerCase();

        if (text.includes("cơ sở dịch vụ công"))
            return <Building2 className="w-4 h-4" />;

        if (text.includes("trạng thái cơ sở dịch vụ công"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("danh mục tin tức"))
            return <FolderKanban className="w-4 h-4" />;

        if (text.includes("trạng thái danh mục tin tức"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("tạo lịch")) return <CalendarPlus className="w-4 h-4" />;
        if (text.includes("cập nhật lịch")) return <CalendarCheck className="w-4 h-4" />;
        if (text.includes("xóa lịch")) return <CalendarX className="w-4 h-4" />;
        if (text.includes("trạng thái lịch")) return <RefreshCcw className="w-4 h-4" />;
        if (text.includes("mẫu lịch")) return <ClipboardList className="w-4 h-4" />;

        if (text.includes("lĩnh vực phản ánh"))
            return <Inbox className="w-4 h-4" />;

        if (text.includes("trạng thái lĩnh vực phản ánh"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("lĩnh vực thủ tục"))
            return <BookOpen className="w-4 h-4" />;

        if (text.includes("trạng thái lĩnh vực thủ tục"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("mẫu đơn"))
            return <FileText className="w-4 h-4" />;

        if (text.includes("trạng thái mẫu đơn"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("phản ánh"))
            return <Inbox className="w-4 h-4" />;

        if (text.includes("xem chi tiết"))
            return <Eye className="w-4 h-4" />;

        if (text.includes("tất cả phản ánh"))
            return <Eye className="w-4 h-4" />;

        if (text.includes("upload video"))
            return <Upload className="w-4 h-4" />;

        if (text.includes("trạng thái phản ánh"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("báo cáo"))
            return <BarChart className="w-4 h-4" />;

        if (text.includes("excel"))
            return <FileSpreadsheet className="w-4 h-4" />;

        if (text.includes("thủ tục"))
            return <ClipboardList className="w-4 h-4" />;

        if (text.includes("trạng thái thủ tục"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("tin tức"))
            return <Newspaper className="w-4 h-4" />;

        if (text.includes("trạng thái tin tức"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("ủy ban"))
            return <Building2 className="w-4 h-4" />;

        if (text.includes("người dùng"))
            return <Users className="w-4 h-4" />;

        if (text.includes("tạo người dùng"))
            return <UserPlus className="w-4 h-4" />;

        if (text.includes("xóa người dùng"))
            return <UserX className="w-4 h-4" />;

        if (text.includes("trạng thái người dùng"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("xem người dùng"))
            return <Eye className="w-4 h-4" />;

        if (text.includes("vai trò"))
            return <ShieldCheck className="w-4 h-4" />;

        if (text.includes("trạng thái vai trò"))
            return <ToggleLeft className="w-4 h-4" />;

        if (text.includes("quyền"))
            return <Shield className="w-4 h-4" />;

        return <Circle className="w-3 h-3" />;
    };

    
    const InfoRow = ({ icon: Icon, label, value, valueClassName = "text-gray-900" }) => (
        <div className="flex items-start gap-3 py-3">
            <div className="flex-shrink-0 mt-1">
                <Icon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                <p className={`text-sm ${valueClassName} break-words`}>{value || '-'}</p>
            </div>
        </div>
    );

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title='Chi tiết vai trò'
            size='xl'
            subtitle='Xem thông tin chi tiết vai trò'
            className='max-w-5xl'
            footer={
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Đóng
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Thông tin cơ bản
                        </h4>
                        <div className="">
                            <InfoRow
                                icon={ShieldCheck}
                                label="Tên vai trò"
                                value={permisison.name ? permisison.name : 'Chưa cập nhật'}
                            />
                            <InfoRow
                                icon={BadgeCheck}
                                label="Mô tả"
                                value={permisison.description ? permisison.description : 'Chưa cập nhật'}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-3 border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Thông tin hệ thống
                        </h4>
                    </div>
                    <div className="px-6 py-1 grid grid-cols-2 gap-y-4 gap-x-6">
                        <InfoRow
                            icon={Calendar}
                            label="Ngày tạo"
                            value={formatDate(permisison.thoi_gian_tao)}
                        />
                        <InfoRow
                            icon={Calendar}
                            label="Ngày cập nhật"
                            value={formatDate(permisison.thoi_gian_cap_nhat)}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="border-b border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Thông tin quyền hạn
                        </h4>
                    </div>
                    {permisison.permissions.length > 0 ? (
                        <div className="px-6 py-1 grid grid-cols-2 gap-y-4 gap-x-6">
                            {permisison.permissions.map((p) => (
                                <label
                                    key={p.code}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        className="w-4 h-4"
                                    />

                                    <div className="flex items-center gap-2 text-gray-800">
                                        <span className="text-blue-600 flex-shrink-0">
                                            {getPermissionIcon(p.description)}
                                        </span>

                                        <span>{p.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-1 text-gray-700">Không có quyền nào</p>
                    )}
                </div>
            </div>
        </BaseModal>
    )
}

export default PermissionDetailModal
