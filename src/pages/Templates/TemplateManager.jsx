import { useState } from 'react';
import { FileText, Download, Plus } from 'lucide-react';
import { ConfirmModal } from '../../components/BaseModal';
import TemplateFormModal from '../../components/templates/TemplateFormModal';
import { useTemplates } from '../../hooks/useTemplates';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import BaseTable from '../../components/BaseTable';

dayjs.locale('vi');

export default function TemplateManager() {
    const [showRemoved, setShowRemoved] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        template: null
    });

    const {
        templates,
        loading,
        createTemplate,
        updateTemplate,
        deleteTemplate
    } = useTemplates(showRemoved);

    console.log('Templates:', templates);

    const handleView = (template) => {
        const baseUrl = process.env.REACT_APP_API_URL;
        const fileUrl = `${baseUrl}${template.url_file_pdf}`;
        window.open(fileUrl, '_blank');
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setIsEditModalOpen(true);
    };

    const handleDelete = (template) => {
        setDeleteModal({
            isOpen: true,
            template
        });
    };

    const handleConfirmDelete = async () => {
        const result = await deleteTemplate(deleteModal.template.id, deleteModal.template.ten_mau_don);
        if (result.success) {
            alert('Xóa biểu mẫu thành công!');
        }
        setDeleteModal({ isOpen: false, template: null });
    };

    const handleCreateTemplate = () => {
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (formData) => {
        const result = await createTemplate(formData);
        if (result.success) {
            setIsCreateModalOpen(false);
            alert('Tạo biểu mẫu thành công!');
        } else {
            throw new Error(result.error?.message || 'Failed to create template');
        }
    };

    const handleSubmitEdit = async (formData) => {
        if (!selectedTemplate) return;
        
        const result = await updateTemplate(selectedTemplate.id, formData);
        if (result.success) {
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
            alert('Cập nhật biểu mẫu thành công!');
        } else {
            throw new Error(result.error?.message || 'Failed to update template');
        }
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedTemplate(null);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            width: '20px',
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #{(index + 1).toString().padStart(2, '0')}
                </span>
            )
        },
        {
            title: 'Tên biểu mẫu',
            dataIndex: 'ten_mau_don',
            key: 'ten_mau_don',
            width: '250px',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                    <span 
                        className="block max-w-[250px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                        title={value}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            width: '100px',
            render: (value) => {
                const displayValue = value || '-';
                return (
                    <span 
                        className="block max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-600"
                        title={displayValue}
                    >
                        {displayValue}
                    </span>
                );
            }
        },
        {
            title: 'Kích thước',
            dataIndex: 'kich_thuoc_file_mb',
            key: 'kich_thuoc_file_mb',
            width: '100px',
            render: (value) => (
                <span className="text-sm text-gray-600">{value} MB</span>
            )
        },
        {
            title: 'Cập nhật',
            dataIndex: 'thoi_gian_cap_nhap',
            key: 'thoi_gian_cap_nhap',
            width: '150px',
            render: (value) => (
                <span className="text-sm text-gray-600">
                    {dayjs(value).format('DD/MM/YYYY HH:mm')}
                </span>
            )
        }
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Quản lý biểu mẫu</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Quản lý các biểu mẫu tải xuống cho người dân</p>
                </div>
                <button
                    onClick={handleCreateTemplate}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Thêm biểu mẫu mới</span>
                    <span className="sm:hidden">Thêm mới</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 px-3 md:px-4 py-2 md:py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                        <h3 className="text-sm md:text-base font-semibold text-gray-900 whitespace-nowrap">
                            Danh sách biểu mẫu ({templates.length})
                        </h3>
                        {showRemoved && (
                            <span className="px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full whitespace-nowrap">
                                Đã xóa
                            </span>
                        )}
                        {!showRemoved && (
                            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full whitespace-nowrap">
                                Đang hoạt động
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">Trạng thái:</label>
                        <select
                            value={showRemoved ? 'removed' : 'active'}
                            onChange={(e) => setShowRemoved(e.target.value === 'removed')}
                            className="flex-1 sm:flex-none min-w-0 px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="active">Đang hoạt động</option>
                            <option value="removed">Đã xóa</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <BaseTable
                        data={templates}
                        columns={columns}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={ showRemoved ? handleDelete : null}
                        viewIcon={<Download className="w-4 h-4" />}
                        showActions={true}
                        actionColumnWidth="150px"
                        emptyMessage="Không có biểu mẫu nào"
                    />
                </div>
            </div>

            <TemplateFormModal
                isOpen={isCreateModalOpen}
                onClose={closeCreateModal}
                onSubmit={handleSubmitCreate}
                mode="create"
            />

            <TemplateFormModal
                isOpen={isEditModalOpen}
                onClose={closeEditModal}
                onSubmit={handleSubmitEdit}
                initialData={selectedTemplate}
                mode="edit"
            />

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, template: null })}
                onConfirm={handleConfirmDelete}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa biểu mẫu "${deleteModal.template?.ten_mau_don}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}