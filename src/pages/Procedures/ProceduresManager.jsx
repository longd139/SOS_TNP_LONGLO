import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { Search, RotateCcw } from 'lucide-react';
import BaseTable from '../../components/BaseTable';
import ProcedureForm from '../../components/procedures/ProcedureForm';
import ProcedureDetailModal from '../../components/procedures/ProcedureDetailModal';
import { useProcedure } from '../../hooks/useProcedures';
import { getProcedureColumns } from '../../components/procedures/columns';
dayjs.locale('vi');

export default function ProceduresManager() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const {
        procedures,
        areas,
        currentProcedure,
        loading,
        pagination,
        filters,
        showRemoved,
        searchProcedures,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters,
        createProcedure,
        updateProcedure,
        deleteProcedure,
        getProcedureById,
        toggleShowRemoved,
        clearCurrent
    } = useProcedure();


    const columns = getProcedureColumns(pagination);
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
        clearCurrent();
    };

    const openDetailModal = () => {
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        clearCurrent();
    };

    const handleSubmitNewProcedure = async (formData) => {
        const result = await createProcedure(formData);
        if (result.success) {
            closeCreateModal();
            alert('Tạo thủ tục thành công!');
        } else {
            throw new Error(result.error?.message || 'Failed to create procedure');
        }
    };

    const handleSubmitEditProcedure = async (formData) => {
        if (!currentProcedure) return;

        const result = await updateProcedure(currentProcedure.id, formData);
        if (result.success) {
            closeEditModal();
        } else {
            throw new Error(result.error?.message || 'Failed to update procedure');
        }
    };

    const handleEdit = async (procedure) => {
        const result = await getProcedureById(procedure.id);
        if (result.success) {
            openEditModal();
        }
    };


    const handleDelete = async (procedure) => {
        await deleteProcedure(procedure.id, procedure.ten_thu_tuc || procedure.tenThuTuc);
    };

    const handleView = async (procedure) => {
        const result = await getProcedureById(procedure.id);
        if (result.success) {
            openDetailModal();
        }
    };


    const handleSearchKeywordChange = (value) => {
        updateFilters({ searchKeyword: value });
    };

    const handleDomainChange = (value) => {
        updateFilters({ selectedDomain: value });
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchProcedures();
        }
    };

    return (
        <div className="min-h-screen">
            <div className="mb-3 md:mb-4">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Quản lý thủ tục hành chính</h1>
                <p className="text-sm md:text-base text-gray-600">Quản lý các thủ tục được hiển thị trong ứng dụng</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 md:p-4 mb-3 md:mb-4">
                <div className="flex flex-col md:flex-row gap-2 items-end">
                    <div className="flex-1 w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm thủ tục
                        </label>
                        <input
                            type="text"
                            value={filters.searchKeyword}
                            onChange={(e) => handleSearchKeywordChange(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm..."
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={handleSearchKeyPress}
                        />
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực
                        </label>
                        <select
                            value={filters.selectedDomain}
                            onChange={(e) => handleDomainChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả lĩnh vực</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.ten_linh_vuc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={showRemoved ? 'removed' : 'active'}
                            onChange={(e) => toggleShowRemoved(e.target.value === 'removed')}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="active">Hoạt động</option>
                            <option value="removed">Đã xóa</option>
                        </select>
                    </div>

                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hiển thị
                        </label>
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => changePageSize(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={searchProcedures}
                            className="flex-1 md:flex-none p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            title="Tìm kiếm"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <button
                            onClick={resetFilters}
                            className="flex-1 md:flex-none p-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            title="Đặt lại"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="text-xs md:text-sm text-gray-600">
                        Danh sách thủ tục ({pagination.total})
                    </div>
                    {showRemoved && (
                        <span className="px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Đã xóa
                        </span>
                    )}
                    {!showRemoved && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Đang hoạt động
                        </span>
                    )}
                </div>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Thêm thủ tục mới
                </button>
            </div>

            <BaseTable
                data={procedures}
                columns={columns}
                loading={loading}
                pagination={pagination}
                onPageChange={changePage}
                onEdit={handleEdit}
                onDelete={showRemoved ? handleDelete : null}
                onView={handleView}
                showActions={true}
                emptyMessage="Không có thủ tục nào được tìm thấy"
                className="mb-4"
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
                initialData={currentProcedure}
                mode="edit"
            />

            <ProcedureDetailModal
                isOpen={isDetailModalOpen}
                onClose={closeDetailModal}
                procedure={currentProcedure}
            />
        </div>
    );
}
