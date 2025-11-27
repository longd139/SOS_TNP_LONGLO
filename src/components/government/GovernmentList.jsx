import React, { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import BaseTable from "../base/BaseTable";
import { ConfirmModal } from "../base/BaseModal";
import GovernmentFormModal from "./GovernmentFormModal";
import GovernmentFilter from "./GovernmentFilter";
import { useGovernment } from "../../hooks/useGovernment";
import { showToast } from "../../utils/toastNotification";
import { formatDate } from "../../utils/formatDate";
import { usePermission } from "../../hooks/usePermission";
import { PermissionHidden } from "../PermissionGuard";

export default function GovernmontList() {
    const {
        governments,
        loading,
        pagination,
        filters,
        loadGovernments,
        createGovernment,
        updateGovernment,
        deleteGovernment,
        updateGovernmentStatus,
        updateFilters,
        clearFilters,
    } = useGovernment();

    const { canCreate, canUpdate, canDelete, canUpdateStatus } = usePermission();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedGovernment, setSelectedGovernment] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showActive, setShowActive] = useState(true);

    useEffect(() => {
        loadGovernments({
            page: 1,
            size: 10,
            isActive: true,
            search: "",
        });
    }, []);

    const handleFilter = (newFilters) => {
        const searchValue = typeof newFilters.search === 'string' ? newFilters.search.trim() : '';

        updateFilters({ search: searchValue });
        setShowActive(newFilters.isActive);

        loadGovernments({
            page: 1,
            size: newFilters.pageSize || pagination.pageSize,
            isActive: newFilters.isActive,
            search: searchValue,
        });
    };

    const handleReset = () => {
        clearFilters();
        setShowActive(true);
        loadGovernments({
            page: 1,
            size: 10,
            isActive: true,
            search: "",
        });
    };

    const handlePageChange = (page) => {
        loadGovernments({
            page,
            size: pagination.pageSize,
            isActive: showActive,
            search: filters.search,
        });
    };

    const handleCreate = () => {
        setSelectedGovernment(null);
        setIsCreateModalOpen(true);
    };

    const handleEdit = (item) => {
        setSelectedGovernment(item);
        setIsEditModalOpen(true);
    };

    const handleDelete = (item) => {
        setSelectedGovernment(item);
        setIsDeleteModalOpen(true);
    };

    const handleCreateSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await createGovernment(formData);
            showToast.success("Tạo cơ sở dịch vụ công thành công!");
            setIsCreateModalOpen(false);
            loadGovernments({
                page: 1,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search,
            });
        } catch (error) {
            // showToast.error(error.message || "Tạo cơ sở dịch vụ công thất bại!");
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleEditSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await updateGovernment(selectedGovernment.id, formData);
            showToast.success('Cập nhật cơ sở dịch vụ công thành công!');
            setIsEditModalOpen(false);
            setSelectedGovernment(null);
            loadGovernments({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search
            });
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteGovernment(selectedGovernment.id);
            showToast.success("Xóa cơ sở dịch vụ công thành công!");
            setIsDeleteModalOpen(false);
            setSelectedGovernment(null);
            loadGovernments({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search,
            });
        } catch (error) {
            showToast.error(error.message || "Xóa cơ sở dịch vụ công thất bại!");
        }
    };

    const handleUpdateStatus = async (area) => {
        try {
            const newStatus = !area.is_active;
            await updateGovernmentStatus(area.id, newStatus);
            showToast.success(
                `Cơ sở dịch vụ công đã được ${newStatus ? "kích hoạt" : "vô hiệu hóa"
                } thành công!`
            );
            loadGovernments({
                page: pagination.currentPage,
                size: pagination.pageSize,
                isActive: showActive,
                search: filters.search,
            });
        } catch (error) {
            showToast.error(error.message || "Cập nhật trạng thái thất bại!");
        }
    };

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #
                    {((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || 10) +
                        index +
                        1}
                </span>
            ),
        },
        {
            title: "Tên cơ sở",
            dataIndex: "ten_co_so",
            key: "ten_co_so",
            width: "250px",
            render: (value) => (
                <div
                    className="text-sm text-gray-900 font-medium max-w-[250px] truncate"
                    title={value}
                >
                    {value}
                </div>
            ),
        },
        {
            title: "Địa chỉ",
            dataIndex: "dia_chi",
            key: "dia_chi",
            render: (value) => (
                <div
                    className="text-sm text-gray-600 max-w-[400px] truncate"
                    title={value || "Không có địa chỉ"}
                >
                    {value || "Không có địa chỉ"}
                </div>
            ),
        },
        {
            title: "Số điện thoại",
            dataIndex: "so_dien_thoai",
            key: "so_dien_thoai",
            render: (value) => (
                <div
                    className="text-sm text-gray-600 max-w-[400px] truncate"
                    title={value || "Không có số điện thoại"}
                >
                    {value || "Không có số điện thoại"}
                </div>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "thoi_gian_tao",
            key: "thoi_gian_tao",
            width: "150px",
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {value ? formatDate(value) : "N/A"}
                </span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "is_active",
            key: "is_active",
            width: "120px",
            render: (value) => (
                <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                >
                    {value ? "Hoạt động" : "Không hoạt động"}
                </span>
            ),
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý cơ sở dịch vụ công
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Quản lý các cơ sở dịch vụ công trên địa bàn phường
                    </p>
                </div>
                <PermissionHidden modulePrefix="CSV" action="CREATE">
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Tạo mới cơ sở dịch vụ công
                    </button>
                </PermissionHidden>
            </div>

            <GovernmentFilter
                onFilter={handleFilter}
                onReset={handleReset}
                filters={{ search: filters.search, isActive: showActive }}
                pagination={pagination}
            />

            <div className="flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách cơ sở dịch vụ công ({pagination.totalItems || 0})
                    </h3>
                    {!showActive && (
                        <span className="px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Không hoạt động
                        </span>
                    )}
                    {showActive && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Đang hoạt động
                        </span>
                    )}
                </div>
                {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tải...</span>
                    </div>
                )}
            </div>

            <BaseTable
                data={governments}
                columns={columns}
                onEdit={handleEdit}
                onDelete={!showActive ? handleDelete : null}
                onUpdateStatus={handleUpdateStatus}
                canEdit={() => canUpdate('CSV')}
                canDelete={() => canDelete('CSV')}
                canUpdateStatus={() => canUpdateStatus('CSV')}
                showActions={true}
                emptyMessage={
                    loading ? "Đang tải dữ liệu..." : "Không có cơ sở dịch vụ công nào"
                }
                pagination={pagination}
                onPageChange={handlePageChange}
            />

            <GovernmentFormModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateSubmit}
                mode="create"
                isLoading={isSubmitting}
            />

            <GovernmentFormModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedGovernment(null);
                }}
                onSubmit={handleEditSubmit}
                initialData={selectedGovernment}
                mode="edit"
                isLoading={isSubmitting}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa cơ sở dịch vụ công "${selectedGovernment?.ten_co_so}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
