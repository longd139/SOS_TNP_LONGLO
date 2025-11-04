import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import BaseModal from '../base/BaseModal';
import { updateProfileData } from '../../features/userProfile/userProfileThunks';
import { selectUpdating, selectUpdateError } from '../../features/userProfile/userProfileSelectors';

const UserProfileModal = ({ isOpen, onClose, profile, loading }) => {
    const [formData, setFormData] = useState({
        hoVaTen: '',
        soDienThoai: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const dispatch = useDispatch();
    const updating = useSelector(selectUpdating);
    const updateError = useSelector(selectUpdateError);

    // Initialize form data when profile changes
    useEffect(() => {
        if (profile) {
            setFormData({
                hoVaTen: profile.hoVaTen || '',
                soDienThoai: profile.soDienThoai || '',
            });
        }
    }, [profile, isOpen]);

    // Clear messages after 5 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.hoVaTen.trim()) {
            setError('Họ và tên không được để trống');
            return;
        }

        try {
            const result = await dispatch(updateProfileData(formData)).unwrap();
            setSuccessMessage('Cập nhật hồ sơ thành công');
            setFormData({
                hoVaTen: result.hoVaTen || '',
                soDienThoai: result.soDienThoai || '',
            });
        } catch (err) {
            setError(err || 'Lỗi cập nhật hồ sơ');
        }
    };

    if (!profile) {
        return null;
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose} title="Hồ sơ">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Success Message */}
                {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {(error || updateError) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {error || updateError}
                    </div>
                )}

                {/* Username (Read-only) */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Tên đăng nhập
                    </label>
                    <input
                        type="text"
                        value={profile.tenDangNhap || ''}
                        disabled
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-xs md:text-sm cursor-not-allowed"
                    />
                </div>

                {/* Email (Read-only) */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>
                    <input
                        type="email"
                        value={profile.email || ''}
                        disabled
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-xs md:text-sm cursor-not-allowed"
                    />
                </div>

                {/* Vài trò (Read-only) */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Vai trò
                    </label>
                    <input
                        type="text"
                        value={profile.vaiTro || ''}
                        disabled
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 text-xs md:text-sm cursor-not-allowed"
                    />
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-4"></div>

                {/* Full Name (Editable) */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Họ và tên
                    </label>
                    <input
                        type="text"
                        name="hoVaTen"
                        value={formData.hoVaTen}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Phone (Editable) */}
                <div>
                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">
                        Số điện thoại
                    </label>
                    <input
                        type="tel"
                        name="soDienThoai"
                        value={formData.soDienThoai}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        className="w-full px-2.5 md:px-3 py-1.5 md:py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={updating}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-1.5 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={updating}
                    >
                        {updating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                </div>
            </form>
        </BaseModal>
    );
};

export default UserProfileModal;
