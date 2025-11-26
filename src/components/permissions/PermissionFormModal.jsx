import React, { useMemo, useState } from 'react'
import BaseModal, { ModalFooter } from '../base/BaseModal';
import { categoryRole, permissionOptions } from '../../mockData';
import { Search } from 'lucide-react';
import { showToast } from '../../utils/toastNotification';

const initialState = {
    tenRole: "",
    moTa: "",
    phanQuyen: [],
};

const PermissionFormModal = ({
    isOpen,
    onClose,
    onCreate,
    onSubmit,
    mode = "create",
    initialData = null,
    isLoading = false,
}) => {
    const handleSubmit = () => {
        // Handle form submission
        showToast.info("Chức năng đang phát triển")
    }

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors((prev) => ({ ...prev, [key]: null }));
        }
    };

    const [form, setForm] = React.useState(initialState);
    const [errors, setErrors] = React.useState({});

    const [category, setCategory] = React.useState(categoryRole);
    const [permissions, setPermissions] = React.useState(permissionOptions);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchText, setSearchText] = useState("");
    const [checkedItems, setCheckedItems] = useState([]);

    const filteredPermissions = useMemo(() => {
        let list = permissionOptions;

        if (selectedCategory !== "all") {
            list = list.filter(p => p.categoryId === selectedCategory);
        }

        if (searchText.trim()) {
            list = list.filter(p =>
                p.name.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        return list;
    }, [selectedCategory, searchText]);

    const toggleCheck = (id) => {
        setCheckedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                mode === "edit"
                    ? "Chỉnh sửa role"
                    : "Tạo Role mới"
            }
            size="xl"
            className="max-w-5xl"
            subtitle = "Nhập thông tin và chọn phân quyền cho role mới"
            footer={
                <ModalFooter
                    onCancel={onClose}
                    onSubmit={handleSubmit}
                    cancelText="Hủy"
                    submitText={mode === "edit" ? "Cập nhật" : "Tạo mới"}
                    submitDisabled={false}
                    submitLoading={isLoading}
                />
            }
        >
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
                <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 required-label">
                        Tên role
                    </label>
                    <input
                        type="text"
                        value={form.tenRole}
                        onChange={(e) => updateField("tenRole", e.target.value)}
                        placeholder='Nhập tên role'
                        className={`w-full px-3 py-2 border rounded-lg ${errors.tenRole ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.tenRole && (
                        <p className="mt-1 text-sm text-red-600">{errors.tenRole}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        value={form.moTa}
                        onChange={(e) => updateField("moTa", e.target.value)}
                        placeholder='Nhập mô tả về role'
                        className={`w-full px-3 py-2 border rounded-lg ${errors.moTa ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.moTa && (
                        <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>
                    )}
                </div>
                <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700">
                        Phân quyền chức năng
                    </label>
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
                            {categoryRole.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="border rounded-xl p-4 bg-white space-y-3 max-h-72 overflow-auto flex flex-col md:col-span-2">

                    {filteredPermissions.length === 0 && (
                        <p className="text-gray-500 text-sm">Không có chức năng nào</p>
                    )}

                    {filteredPermissions.map(item => (
                        <label
                            key={item.id}
                            className="flex items-start gap-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={checkedItems.includes(item.id)}
                                onChange={() => toggleCheck(item.id)}
                                className="mt-1"
                            />
                            <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-gray-500 text-sm">
                                    {item.code}
                                </div>
                            </div>
                        </label>
                    ))}
                </div>

                <div className="text-sm text-gray-600">
                    Đã chọn: {checkedItems.length} chức năng
                </div>
            </div>
        </BaseModal>
    )
}

export default PermissionFormModal
