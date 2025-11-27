import React from 'react';
import { User, Mail, Phone, Shield, Calendar, ToggleLeft } from 'lucide-react';
import BaseModal from '../base/BaseModal';
import { formatDate } from '../../utils/formatDate';

const UserViewModal = ({ isOpen, onClose, userData, loading = false }) => {
    if (!userData) return null;

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
            title="Thông tin chi tiết người dùng"
            size="xl"
            className="max-w-5xl"
        >
            {loading ? (
                <div className="py-12 text-center">
                    <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    <p className="mt-4 text-gray-500">Đang tải thông tin...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {userData.fullName?.charAt(0)?.toUpperCase() || userData.username?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {userData.fullName || userData.ho_va_ten || 'Chưa cập nhật'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    @{userData.username || userData.ten_dang_nhap}
                                </p>
                            </div>
                            <div>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${userData.is_active !== false
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {userData.is_active !== false ? 'Hoạt động' : 'Đã khóa'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="px-6 py-3 border-b border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                Thông tin cơ bản
                            </h4>
                        </div>
                        <div className="px-6 py-1 grid grid-cols-2 gap-y-4 gap-x-6">
                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={userData?.email ? userData.email : 'Chưa cập nhật'}
                            />
                            <InfoRow
                                icon={Phone}
                                label="Số điện thoại"
                                value={userData.so_dien_thoai}
                            />
                            <InfoRow
                                icon={Shield}
                                label="Vai trò"
                                value={
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {userData.vai_tro || userData.role || '-'}
                                    </span>
                                }
                            />
                            <InfoRow
                                icon={ToggleLeft}
                                label="Xác thực hai yếu tố"
                                value={
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${userData.xac_thuc_hai_yeu_to
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {userData.xac_thuc_hai_yeu_to ? 'Đã bật' : 'Chưa bật'}
                                    </span>
                                }
                            />
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
                                value={formatDate(userData.thoi_gian_tao)}
                            />
                            <InfoRow
                                icon={Calendar}
                                label="Ngày cập nhật"
                                value={formatDate(userData.thoi_gian_cap_nhat)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </BaseModal>
    );
};

export default UserViewModal;
