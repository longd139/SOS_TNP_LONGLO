import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import BaseTable from "../../components/base/BaseTable";
import ProcedureForm from "../../components/procedures/ProcedureForm";
import ProcedureDetailModal from "../../components/procedures/ProcedureDetailModal";
import ProceduresFilter from "../../components/procedures/ProceduresFilter";
import { useProcedure } from "../../hooks/useProcedures";
import { usePermission } from "../../hooks/usePermission";
import { PermissionHidden } from "../../components/PermissionGuard";
import { getProcedureColumns } from "../../components/procedures/columns";
import { showToast } from "../../utils/toastNotification";
import { ConfirmModal } from "../../components/base/BaseModal";
import { fetchProcedures } from "../../features/procedures/proceduresThunks";
import { Loader2 } from "lucide-react";
dayjs.locale("vi");

export default function ProceduresManager() {
    const dispatch = useDispatch();
    const { canCreate, canUpdate, canDelete, canView, canUpdateStatus } = usePermission();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({
        isOpen: false,
        procedure: null,
    });

    const {
        procedures,
        areas,
        loading,
        pagination,
        filters,
        showActive,
        searchProcedures,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters,
        createProcedure,
        updateProcedure,
        deleteProcedure,
        getProcedureById,
        toggleShowActive,
        clearCurrent,
        handleUpdateStatus: updateStatus,
    } = useProcedure();

    const columns = getProcedureColumns(pagination);

    useEffect(() => {
        resetFilters();
        toggleShowActive(true);

        dispatch(
            fetchProcedures({
                page: 1,
                size: 10,
                search: '',
                id_linh_vuc: undefined,
                isActive: true,
            })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const openEditModal = () => {
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProcedure(null);
    };

    const openDetailModal = () => {
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedProcedure(null);
    };

    const handleSubmitNewProcedure = async (formData) => {
        const result = await createProcedure(formData);
        if (result.success) {
            closeCreateModal();
            showToast.success("Tạo thủ tục thành công!");
            dispatch(
                fetchProcedures({
                    page: pagination.current,
                    size: pagination.pageSize,
                    search: filters.searchKeyword,
                    id_linh_vuc: filters.selectedDomain,
                    isActive: showActive,
                })
            );
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi tạo thủ tục!";
            showToast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const handleSubmitEditProcedure = async (formData) => {
        if (!selectedProcedure) return;

        const result = await updateProcedure(selectedProcedure.id, formData);
        if (result.success) {
            closeEditModal();
            showToast.success("Cập nhật thủ tục thành công!");
            dispatch(
                fetchProcedures({
                    page: pagination.current,
                    size: pagination.pageSize,
                    search: filters.searchKeyword,
                    id_linh_vuc: filters.selectedDomain,
                    isActive: showActive,
                })
            );
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi cập nhật thủ tục!";
            showToast.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const handleEdit = async (procedure) => {
        const result = await getProcedureById(procedure.id);
        if (result.success) {
            setSelectedProcedure(result.data);
            openEditModal();
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi lấy thông tin thủ tục!";
            showToast.error(errorMessage);
        }
    };

    const handleDelete = (procedure) => {
        setDeleteConfirm({ isOpen: true, procedure });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirm.procedure) return;

        const result = await deleteProcedure(
            deleteConfirm.procedure.id,
            deleteConfirm.procedure.ten_thu_tuc || deleteConfirm.procedure.tenThuTuc
        );

        if (result.success) {
            showToast.success("Đã xóa thủ tục thành công.");
            dispatch(
                fetchProcedures({
                    page: pagination.current,
                    size: pagination.pageSize,
                    search: filters.searchKeyword,
                    id_linh_vuc: filters.selectedDomain,
                    isActive: showActive,
                })
            );
        } else if (result.cancelled) {
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi xóa thủ tục!";
            showToast.error(errorMessage);
        }

        setDeleteConfirm({ isOpen: false, procedure: null });
    };

    const handleView = async (procedure) => {
        const result = await getProcedureById(procedure.id);
        if (result.success) {
            setSelectedProcedure(result.data);
            openDetailModal();
        } else {
            const errorMessage = result.error?.message || result.error || "Có lỗi xảy ra khi lấy thông tin thủ tục!";
            showToast.error(errorMessage);
        }
    };

    const handleFilterChange = (key, value) => {
        updateFilters({ [key]: value });
    };

    const handleUpdateStatus = async (procedure) => {
        try {
            await updateStatus(procedure.id, !procedure.is_active);
            showToast.success(
                `Thủ tục đã được ${!procedure.is_active ? "kích hoạt" : "vô hiệu hóa"
                } thành công!`
            );
            dispatch(
                fetchProcedures({
                    page: pagination.current,
                    size: pagination.pageSize,
                    search: filters.searchKeyword,
                    id_linh_vuc: filters.selectedDomain,
                    isActive: showActive,
                })
            );
        } catch (error) {
            showToast.error(
                error.message || "Có lỗi xảy ra khi cập nhật trạng thái thủ tục!"
            );
        }
    };

    const handleSearchWithFilters = (newFilters) => {
        updateFilters({
            searchKeyword: newFilters.searchKeyword,
            selectedDomain: newFilters.selectedDomain,
        });

        if (newFilters.showActive !== showActive) {
            toggleShowActive(newFilters.showActive);
        }

        if (newFilters.pageSize !== pagination.pageSize) {
            changePageSize(newFilters.pageSize);
        }

        const id_linh_vuc = newFilters.selectedDomain === '' ? undefined : newFilters.selectedDomain;

        dispatch(
            fetchProcedures({
                page: 1,
                size: newFilters.pageSize,
                search: newFilters.searchKeyword,
                id_linh_vuc: id_linh_vuc,
                isActive: newFilters.showActive,
            })
        );
    };

    return (
        <div className="min-h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        Quản lý thủ tục hành chính
                    </h1>
                    <p className="text-sm md:text-base text-gray-600">
                        Quản lý các thủ tục được hiển thị trong ứng dụng
                    </p>
                </div>
                <PermissionHidden modulePrefix="TT" action="CREATE">
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                    >
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                        </svg>
                        Thêm thủ tục mới
                    </button>
                </PermissionHidden>
            </div>

            <ProceduresFilter
                filters={filters}
                pagination={pagination}
                showActive={showActive}
                currentFilters={{
                    searchKeyword: filters.searchKeyword || '',
                    selectedDomain: filters.selectedDomain || '',
                    showActive: showActive,
                    pageSize: pagination.pageSize || 10
                }}
                onFilterChange={handleFilterChange}
                onSearch={searchProcedures}
                onReset={resetFilters}
                onToggleActive={toggleShowActive}
                onPageSizeChange={changePageSize}
                onSearchWithFilters={handleSearchWithFilters}
            />

            <div className="flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách thủ tục ({pagination.total})
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
                data={procedures}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={changePage}
                onEdit={canUpdate('TT') ? handleEdit : undefined}
                onDelete={!JSON.parse(showActive) && canDelete('TT') ? handleDelete : undefined}
                onView={canView('TT') ? handleView : undefined}
                showActions={true}
                emptyMessage="Không có thủ tục nào được tìm thấy"
                className="mb-4"
                onUpdateStatus={canUpdateStatus('TT') ? handleUpdateStatus : undefined}
            />

            <ProcedureForm
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={handleSubmitNewProcedure}
                areas={areas}
                mode="create"
            />

            <ProcedureForm
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleSubmitEditProcedure}
                areas={areas}
                initialData={selectedProcedure}
                mode="edit"
            />

            <ProcedureDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                procedure={selectedProcedure}
            />

            <ConfirmModal
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, procedure: null })}
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa thủ tục "${deleteConfirm.procedure?.ten_thu_tuc ||
                    deleteConfirm.procedure?.tenThuTuc
                    }"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
