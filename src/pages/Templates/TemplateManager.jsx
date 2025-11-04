import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Download, Plus } from 'lucide-react';
import { ConfirmModal } from '../../components/base/BaseModal';
import TemplateFormModal from '../../components/templates/TemplateFormModal';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import BaseTable from '../../components/base/BaseTable';
import { showToast } from '../../utils/toastNotification';
import {
    fetchTemplates,
    createTemplate as createTemplateThunk,
    updateTemplate as updateTemplateThunk,
    deleteTemplate as deleteTemplateThunk
} from '../../features/templates/templatesThunks';
import {
    selectTemplates,
    selectTemplatesLoading,
    selectShowRemoved
} from '../../features/templates/templatesSelectors';
import { setShowRemoved } from '../../features/templates/templatesSlice';

dayjs.locale('vi');

export default function TemplateManager() {
    const dispatch = useDispatch();
    const templates = useSelector(selectTemplates);
    const loading = useSelector(selectTemplatesLoading);
    const showRemoved = useSelector(selectShowRemoved);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        template: null
    });

    useEffect(() => {
        dispatch(fetchTemplates(showRemoved));
    }, [dispatch, showRemoved]);

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

    const handleDeleteConfirm = async () => {
        try {
            const result = await dispatch(deleteTemplateThunk(deleteModal.template.id)).unwrap();
            showToast.success('Xóa biểu mẫu thành công!');
            setDeleteModal({ isOpen: false, template: null });
        } catch (error) {
            showToast.error(error.message || 'Có lỗi xảy ra khi xóa biểu mẫu!');
        }
    };

    const handleCreateTemplate = () => {
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (formData) => {
        try {
            await dispatch(createTemplateThunk(formData)).unwrap();
            setIsCreateModalOpen(false);
            showToast.success('Tạo biểu mẫu thành công!');
            dispatch(fetchTemplates(showRemoved));
        } catch (error) {
            showToast.error(error.message || 'Tạo biểu mẫu thất bại!');
            throw error;
        }
    };

    const handleSubmitEdit = async (formData) => {
        if (!selectedTemplate) return;
        
        try {
            await dispatch(updateTemplateThunk({ 
                templateId: selectedTemplate.id, 
                formData 
            })).unwrap();
            setIsEditModalOpen(false);
            setSelectedTemplate(null);
            showToast.success('Cập nhật biểu mẫu thành công!');
            dispatch(fetchTemplates(showRemoved));
        } catch (error) {
            showToast.error(error.message || 'Cập nhật biểu mẫu thất bại!');
            throw error;
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
            width: '200px',
            render: (value) => (
                <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                    <span 
                        className="block max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                        title={value}
                    >
                        {value}
                    </span>
                </div>
            )
        },
        {
            title: 'Mã biểu mẫu',
            dataIndex: 'ma_mau_don',
            key: 'ma_mau_don',
            width: '120px',
            render: (value) => (
                <span className="block max-w-[120px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm font-semibold text-blue-600">
                    {value || '-'}
                </span>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'mo_ta',
            key: 'mo_ta',
            width: '150px',
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-gray-600">
                            Danh sách biểu mẫu ({templates.length})
                        </div>
                        {showRemoved && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                                Đã xóa
                            </span>
                        )}
                        {!showRemoved && (
                            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Đang hoạt động
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">Trạng thái:</label>
                        <select
                            value={showRemoved ? 'removed' : 'active'}
                            onChange={(e) => dispatch(setShowRemoved(e.target.value === 'removed'))}
                            className="min-w-[160px] px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                onConfirm={handleDeleteConfirm}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa biểu mẫu "${deleteModal.template?.ten_mau_don}"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}