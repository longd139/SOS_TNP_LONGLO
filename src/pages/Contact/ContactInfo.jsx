import React, { useState } from 'react';
import { MapPin, Phone, Clock, Globe } from 'lucide-react';
import { contactInfo } from '../../mockData';

export default function ContactInfo() {
    const [formData, setFormData] = useState(contactInfo);
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = () => {
        console.log('Saving contact info:', formData);
        setIsEditing(false);
        // TODO: API call to save contact info
    };

    const handleChange = (path, value) => {
        const keys = path.split('.');
        setFormData(prev => {
            const newData = { ...prev };
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    return (
        <div className="min-h-screen">
            <div className="mb-3 md:mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                    Quản lý thông tin liên hệ
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                    Cập nhật thông tin liên hệ của UBND Phường
                </p>
            </div>

            <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 bg-transparent">
                    <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">Địa chỉ văn phòng</h2>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Địa chỉ đầy đủ
                                </label>
                                <input
                                    type="text"
                                    value={formData.address.full}
                                    onChange={(e) => handleChange('address.full', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                        Vĩ độ (Latitude)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.latitude}
                                        onChange={(e) => handleChange('address.latitude', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                        Kinh độ (Longitude)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address.longitude}
                                        onChange={(e) => handleChange('address.longitude', e.target.value)}
                                        disabled={!isEditing}
                                        className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Bản đồ hiển thị
                                </label>
                                <div className="w-full h-48 md:h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                                    <div className="text-center">
                                        <MapPin className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-2" />
                                        <p className="text-xs md:text-sm text-gray-500">Xem trước bản đồ</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {formData.address.latitude}, {formData.address.longitude}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-200 p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                            <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">Thông tin liên lạc</h2>
                        </div>

                        <div className="space-y-3 md:space-y-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Tổng đài chính
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact.mainPhone}
                                    onChange={(e) => handleChange('contact.mainPhone', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Phòng Hành chính - Tư pháp
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact.departments.administrative}
                                    onChange={(e) => handleChange('contact.departments.administrative', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Phòng Kinh tế - Xã hội
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact.departments.socialWelfare}
                                    onChange={(e) => handleChange('contact.departments.socialWelfare', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Email liên hệ
                                </label>
                                <input
                                    type="email"
                                    value={formData.contact.email}
                                    onChange={(e) => handleChange('contact.email', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Fax
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact.fax}
                                    onChange={(e) => handleChange('contact.fax', e.target.value)}
                                    disabled={!isEditing}
                                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl md:rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h2 className="text-base md:text-lg font-semibold text-gray-900">
                            Giờ làm việc
                        </h2>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Buổi sáng
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={formData.workingHours.morning.start}
                                        onChange={(e) => handleChange('workingHours.morning.start', e.target.value)}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="07:30"
                                    />
                                    <span className="text-gray-500 text-sm md:text-base">-</span>
                                    <input
                                        type="text"
                                        value={formData.workingHours.morning.end}
                                        onChange={(e) => handleChange('workingHours.morning.end', e.target.value)}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="11:30"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                    Buổi chiều
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={formData.workingHours.afternoon.start}
                                        onChange={(e) => handleChange('workingHours.afternoon.start', e.target.value)}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="13:00"
                                    />
                                    <span className="text-gray-500 text-sm md:text-base">-</span>
                                    <input
                                        type="text"
                                        value={formData.workingHours.afternoon.end}
                                        onChange={(e) => handleChange('workingHours.afternoon.end', e.target.value)}
                                        disabled={!isEditing}
                                        className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                                        placeholder="17:00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                Ngày làm việc
                            </label>
                            <input
                                type="text"
                                value={formData.workingHours.workingDays}
                                onChange={(e) => handleChange('workingHours.workingDays', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                Ghi chú
                            </label>
                            <input
                                type="text"
                                value={formData.workingHours.note}
                                onChange={(e) => handleChange('workingHours.note', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl md:rounded-lg shadow-sm border border-gray-200 p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <h2 className="text-base md:text-lg font-semibold text-gray-900">
                            Thông tin bổ sung
                        </h2>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                Website chính thức
                            </label>
                            <input
                                type="text"
                                value={formData.additional.website}
                                onChange={(e) => handleChange('additional.website', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                Facebook Page
                            </label>
                            <input
                                type="text"
                                value={formData.additional.facebook}
                                onChange={(e) => handleChange('additional.facebook', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                            />
                        </div>

                        <div>
                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                                Hotline hỗ trợ khẩn cấp (24/7)
                            </label>
                            <input
                                type="text"
                                value={formData.additional.hotline}
                                onChange={(e) => handleChange('additional.hotline', e.target.value)}
                                disabled={!isEditing}
                                className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm md:text-base rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
