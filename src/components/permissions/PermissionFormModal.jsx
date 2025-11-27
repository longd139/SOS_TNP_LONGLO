import React, { useEffect, useMemo, useState } from 'react'
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { Search } from 'lucide-react';
import { showToast } from '../../utils/toastNotification';
import { usePermissions } from '../../hooks/usePermissions';
import { validateRoleForm } from '../../validator/roleValidator';

const initialState = {
    name: "",
    description: "",
    permissionCodes: [],
};

const PermissionFormModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode = "create",
    initialData = null,
    isLoading = false,
}) => {
    const { permissions, loading: permissionsLoading } = usePermissions();
    
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [checkedItems, setCheckedItems] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (mode === "edit" && initialData) {
                setForm({
                    name: initialData.name || "",
                    description: initialData.description || "",
                    permissionCodes: initialData.permissions?.map(p => p.code) || [],
                });
                setCheckedItems(initialData.permissions?.map(p => p.code) || []);
            } else {
                setForm(initialState);
                setCheckedItems([]);
            }
            setErrors({});
            setSearchText("");
            setSelectedCategory("all");
        }
    }, [isOpen, mode, initialData]);

    const categoryNames = useMemo(() => {
        return Object.keys(permissions || {});
    }, [permissions]);

    const permissionList = useMemo(() => {
        const list = [];
        Object.keys(permissions || {}).forEach((category) => {
            const items = permissions[category] || [];
            items.forEach((p) => list.push({ category, ...p }));
        });
        return list;
    }, [permissions]);

    const filteredPermissions = useMemo(() => {
        let list = permissionList;

        if (selectedCategory !== "all") {
            list = list.filter(p => p.category === selectedCategory);
        }

        if (searchText.trim()) {
            const searchLower = searchText.toLowerCase();
            list = list.filter(p =>
                p.description?.toLowerCase().includes(searchLower) ||
                p.code?.toLowerCase().includes(searchLower)
            );
        }

        return list;
    }, [permissionList, selectedCategory, searchText]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: null }));
        }
    };

    const toggleCheck = (code) => {
        setCheckedItems(prev => {
            const newItems = prev.includes(code)
                ? prev.filter(item => item !== code)
                : [...prev, code];
            
            setForm(prevForm => ({ ...prevForm, permissionCodes: newItems }));
            
            if (errors.permissionCodes) {
                setErrors(prevErrors => ({ ...prevErrors, permissionCodes: null }));
            }
            
            return newItems;
        });
    };

    const handleSubmit = async () => {
        const formData = {
            name: form.name,
            description: form.description,
            permissionCodes: checkedItems
        };

        const { isValid, errors: validationErrors } = await validateRoleForm(formData, mode === "edit");

        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        if (onSubmit) {
            onSubmit(formData);
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'CSV': 'Cơ sở dịch vụ công',
            'DMTT': 'Danh mục tin tức',
            'LTD': 'Lịch tiếp dân',
            'LVPA': 'Lĩnh vực phản ánh',
            'LVTTHC': 'Lĩnh vực thủ tục hành chính',
            'MD': 'Mẫu đơn',
            'PA': 'Phản ánh',
            'RPT': 'Báo cáo',
            'TT': 'Thủ tục',
            'TTIN': 'Tin tức',
            'UB': 'Ủy ban',
            'VID': 'Video',
            'ND': 'Người dùng',
            'ROLE': 'Vai trò',
            'PERM': 'Quyền'
        };
        return labels[category] || category;
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                mode === "edit"
                    ? "Chỉnh sửa vai trò"
                    : "Tạo vai trò mới"
            }
            size="xl"
            className="max-w-5xl"
            subtitle="Nhập thông tin và chọn phân quyền cho vai trò"
            footer={
                <ModalFooter
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={mode === "edit" ? "Cập nhật" : "Tạo mới"}
                    submitDisabled={isLoading || permissionsLoading}
                    submitLoading={isLoading}
                />
            }
        >
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Tên vai trò
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder='Nhập tên vai trò'
                        className={`w-full px-3 py-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder='Nhập mô tả về vai trò'
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>
                <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Phân quyền chức năng
                    </label>
                    {errors.permissionCodes && (
                        <p className="mt-1 text-sm text-red-600">{errors.permissionCodes}</p>
                    )}
                    <div className='flex items-center gap-2 mt-1'>
                        <div className="relative w-full">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                            <input
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Tìm kiếm chức năng..."
                            />
                        </div>

                        <select
                            className="border border-gray-300 rounded-lg px-2 py-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">Tất cả danh mục</option>
                            {categoryNames.map(category => (
                                <option key={category} value={category}>
                                    {getCategoryLabel(category)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={`border rounded-xl p-4 bg-white space-y-3 max-h-72 overflow-auto flex flex-col md:col-span-2 ${errors.permissionCodes ? "border-red-500" : ""}`}>
                    {permissionsLoading && (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-500">Đang tải quyền...</span>
                        </div>
                    )}

                    {!permissionsLoading && filteredPermissions.length === 0 && (
                        <p className="text-gray-500 text-sm">Không có chức năng nào</p>
                    )}

                    {!permissionsLoading && filteredPermissions.map(item => (
                        <label
                            key={item.code}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={checkedItems.includes(item.code)}
                                onChange={() => toggleCheck(item.code)}
                                className="w-4 h-4"
                            />
                            <div>
                                <div className="font-medium">{item.description}</div>
                                {/* <div className="text-gray-500 text-sm">
                                    {item.code} • {getCategoryLabel(item.category)}
                                </div> */}
                            </div>
                        </label>
                    ))}
                </div>

                <div className="text-sm text-gray-600 md:col-span-2">
                    Đã chọn: <span className="font-medium text-blue-600">{checkedItems.length}</span> chức năng
                </div>
            </div>
        </BaseModal>
    )
}

export default PermissionFormModal
