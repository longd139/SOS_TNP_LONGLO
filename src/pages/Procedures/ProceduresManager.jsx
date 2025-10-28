import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import BaseTable from '../../components/BaseTable';
import ProcedureForm from '../../components/procedures/ProcedureForm';
import { useProcedures } from '../../hooks/useProcedures';
import { getProcedureColumns } from '../../components/procedures/columns';
dayjs.locale('vi');

export default function ProceduresManager() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {
        procedures,
        areas,
        loading,
        pagination,
        filters,
        searchProcedures,
        changePage,
        changePageSize,
        resetFilters,
        updateFilters,
        createProcedure,
        deleteProcedure
    } = useProcedures();

    const columns = getProcedureColumns(pagination);
    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleSubmitNewProcedure = async (formData) => {
        const result = await createProcedure(formData);
        if (result.success) {
            closeCreateModal();
        }
    };

    const handleEdit = (procedure) => {
        // TODO: Implement edit functionality
        // Can reuse ProcedureForm with mode='edit' and initialData={procedure}
        console.log('Edit procedure:', procedure);
    };


    const handleDelete = async (procedure) => {
        await deleteProcedure(procedure.id, procedure.ten_thu_tuc);
    };

    const handleView = (procedure) => {
        console.log('View procedure:', procedure);
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
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý thủ tục hành chính</h1>
                <p className="text-gray-600">Quản lý các thủ tục được hiển thị trong ứng dụng</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-64">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tìm kiếm thủ tục
                        </label>
                        <input
                            type="text"
                            value={filters.searchKeyword}
                            onChange={(e) => handleSearchKeywordChange(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm trong mã thủ tục, tên thủ tục..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={handleSearchKeyPress}
                        />
                    </div>

                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực
                        </label>
                        <select
                            value={filters.selectedDomain}
                            onChange={(e) => handleDomainChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả lĩnh vực</option>
                            {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                    {area.ten_linh_vuc}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hiển thị
                        </label>
                        <select
                            value={pagination.pageSize}
                            onChange={(e) => changePageSize(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                            <option value={50}>50 / trang</option>
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={searchProcedures}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    Danh sách thủ tục ({pagination.total})
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
                onDelete={handleDelete}
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
        </div>
    );
}
