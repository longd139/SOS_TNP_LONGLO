import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Download, Plus, Loader2 } from "lucide-react";
import { ConfirmModal } from "../../components/base/BaseModal";
import TemplateFormModal from "../../components/templates/TemplateFormModal";
import TemplateFilter from "../../components/templates/TemplateFilter";
import { usePermission } from "../../hooks/usePermission";
import { PermissionHidden } from "../../components/PermissionGuard";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import BaseTable from "../../components/base/BaseTable";
import { showToast } from "../../utils/toastNotification";
import {
    fetchTemplatesPaging,
    createTemplate as createTemplateThunk,
    updateTemplate as updateTemplateThunk,
    deleteTemplate as deleteTemplateThunk,
    updateTemplateStatus,
} from "../../features/templates/templatesThunks";
import {
    selectTemplates,
    selectTemplatesLoading,
    selectShowRemoved,
    selectPagination,
    selectFilters,
} from "../../features/templates/templatesSelectors";
import {
    setShowRemoved,
    setFilters,
    resetFilters,
} from "../../features/templates/templatesSlice";
import { downloadUtils } from "../../utils/downLoadUtils";

dayjs.locale("vi");

export default function TemplateManager() {
    const dispatch = useDispatch();
    const templates = useSelector(selectTemplates);
    const loading = useSelector(selectTemplatesLoading);
    const showRemoved = useSelector(selectShowRemoved);
    const pagination = useSelector(selectPagination);
    const filters = useSelector(selectFilters);

    const { canUpdate, canDelete, canUpdateStatus, canView } = usePermission();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        template: null,
    });

    const loadTemplates = useCallback(
        (page = 1, pageSize = 10, search = "", isRemoved = false) => {
            dispatch(
                fetchTemplatesPaging({
                    page,
                    pageSize,
                    isRemoved,
                    search,
                })
            );
        },
        [dispatch]
    );

    useEffect(() => {
        dispatch(resetFilters());
        dispatch(setShowRemoved(false));
        loadTemplates(1, 10, "", false);
    }, []);

    const handleView = (template) => {
        downloadUtils.handleDownloadPdf(template);
    };

    const handleEdit = (template) => {
        setSelectedTemplate(template);
        setIsEditModalOpen(true);
    };

    const handleDelete = (template) => {
        setDeleteModal({
            isOpen: true,
            template,
        });
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteTemplateThunk(deleteModal.template.id)).unwrap();
            showToast.success("Xóa biểu mẫu thành công!");
            setDeleteModal({ isOpen: false, template: null });
            loadTemplates(
                pagination.current,
                pagination.pageSize,
                filters.searchKeyword,
                showRemoved
            );
        } catch (error) {
            const errorMessage =
                error?.message || error || "Có lỗi xảy ra khi xóa biểu mẫu!";
            showToast.error(errorMessage);
        }
    };

    const handleCreateTemplate = () => {
        setIsCreateModalOpen(true);
    };

    const handleSubmitCreate = async (formData, options = {}) => {
        try {
            await dispatch(createTemplateThunk({ formData, options })).unwrap();
            setIsCreateModalOpen(false);
            showToast.success("Tạo biểu mẫu thành công!");
            loadTemplates(1, pagination.pageSize, filters.searchKeyword, showRemoved);
        } catch (error) {
            const errorMessage = error?.message || error || "Tạo biểu mẫu thất bại!";
            showToast.error(errorMessage);
            throw error;
        }
    };

    const handleSubmitEdit = async (formData, options = {}) => {
        if (!selectedTemplate) return;

        try {
            await dispatch(
                updateTemplateThunk({
                    templateId: selectedTemplate.id,
                    formData,
                    options,
                })
            ).unwrap();

            setIsEditModalOpen(false);
            setSelectedTemplate(null);
            showToast.success("Cập nhật biểu mẫu thành công!");
            loadTemplates(
                pagination.current,
                pagination.pageSize,
                filters.searchKeyword,
                showRemoved
            );
        } catch (error) {
            const errorMessage =
                error?.message || error || "Cập nhật biểu mẫu thất bại!";
            showToast.error(errorMessage);
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

    const handleUpdateStatus = async (template) => {
        const current =
            typeof template?.isActive !== "undefined"
                ? template.isActive
                : typeof template?.is_active !== "undefined"
                    ? template.is_active
                    : false;

        try {
            await dispatch(
                updateTemplateStatus({ templateId: template.id, isActive: !current })
            ).unwrap();
            showToast.success(
                `Biểu mẫu đã được ${!current ? "kích hoạt" : "vô hiệu hóa"} thành công!`
            );
            loadTemplates(
                pagination.current,
                pagination.pageSize,
                filters.searchKeyword,
                showRemoved
            );
        } catch (error) {
            const errorMessage =
                error?.message ||
                error ||
                "Có lỗi xảy ra khi cập nhật trạng thái biểu mẫu!";
            showToast.error(errorMessage);
        }
    };

    const handlePageChange = useCallback(
        (page) => {
            loadTemplates(
                page,
                pagination.pageSize,
                filters.searchKeyword,
                showRemoved
            );
        },
        [loadTemplates, pagination.pageSize, filters.searchKeyword, showRemoved]
    );

    const handlePageSizeChange = useCallback(
        (size) => {
            loadTemplates(1, size, filters.searchKeyword, showRemoved);
        },
        [loadTemplates, filters.searchKeyword, showRemoved]
    );

    const handleFilterChange = useCallback(
        (key, value) => {
            dispatch(setFilters({ [key]: value }));
        },
        [dispatch]
    );

    const handleSearch = useCallback(() => {
        loadTemplates(1, pagination.pageSize, filters.searchKeyword, showRemoved);
    }, [loadTemplates, pagination.pageSize, filters.searchKeyword, showRemoved]);

    const handleReset = useCallback(() => {
        dispatch(resetFilters());
        loadTemplates(1, pagination.pageSize, "", showRemoved);
    }, [dispatch, loadTemplates, pagination.pageSize, showRemoved]);

    const handleToggleRemoved = useCallback(
        (value) => {
            dispatch(setShowRemoved(value));
        },
        [dispatch]
    );

    const handleSearchWithFilters = useCallback(
        (newFilters) => {
            dispatch(setFilters({ searchKeyword: newFilters.searchKeyword }));
            loadTemplates(
                1,
                newFilters.pageSize,
                newFilters.searchKeyword,
                newFilters.showRemoved
            );
        },
        [dispatch, loadTemplates]
    );

    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            width: "20px",
            render: (value, record, index) => (
                <span className="text-sm font-medium text-gray-900">
                    #{((pagination?.currentPage || 1) - 1) * (pagination?.pageSize || filters.pageSize) + index + 1}
                </span>
            ),
        },
        {
            title: "Tên biểu mẫu",
            dataIndex: "tenMauDon",
            key: "tenMauDon",
            width: "200px",
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
            ),
        },
        {
            title: "Mã biểu mẫu",
            dataIndex: "maMauDon",
            key: "maMauDon",
            width: "120px",
            render: (value) => (
                <span className="block max-w-[120px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm font-semibold text-blue-600">
                    {value || "-"}
                </span>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "moTa",
            key: "moTa",
            width: "150px",
            render: (value) => {
                const displayValue = value || "-";
                return (
                    <span
                        className="block max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-600"
                        title={displayValue}
                    >
                        {displayValue}
                    </span>
                );
            },
        },
        {
            title: "Kích thước",
            dataIndex: "kichThuocFileMb",
            key: "kichThuocFileMb",
            width: "100px",
            render: (value, record) => {
                const v =
                    value ?? record?.kich_thuoc_file_mb ?? record?.kichThuocFileMb;
                return <span className="text-sm text-gray-600">{v} MB</span>;
            },
        },
        {
            title: "Cập nhật",
            dataIndex: "thoiGianCapNhat",
            key: "thoiGianCapNhat",
            width: "150px",
            render: (value, record) => {
                const v =
                    value ?? record?.thoi_gian_cap_nhap ?? record?.thoiGianCapNhat;
                return (
                    <span className="text-sm text-gray-600">
                        {dayjs(v).format("DD/MM/YYYY HH:mm")}
                    </span>
                );
            },
        },
        {
            title: "TRẠNG THÁI",
            dataIndex: "isActive",
            key: "isActive",
            width: "120px",
            render: (value, record) => {
                const v =
                    typeof value !== "undefined"
                        ? value
                        : record?.is_active ?? record?.isActive;
                return (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${value
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {value ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                );
            },
        },
    ];

    return (
        <div className="min-h-screen">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                        Quản lý biểu mẫu
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Quản lý các biểu mẫu tải xuống cho người dân
                    </p>
                </div>
                <PermissionHidden modulePrefix="MD" action="CREATE">
                    <button
                        onClick={handleCreateTemplate}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">Thêm biểu mẫu mới</span>
                        <span className="sm:hidden">Thêm mới</span>
                    </button>
                </PermissionHidden>
            </div>

            <TemplateFilter
                filters={filters}
                pagination={pagination}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
                onReset={handleReset}
                onToggleRemoved={handleToggleRemoved}
                onPageSizeChange={handlePageSizeChange}
                onSearchWithFilters={handleSearchWithFilters}
            />

            <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900 mb-0">
                        Danh sách biểu mẫu ({pagination.total})
                    </h3>
                    {showRemoved && (
                        <span className="px-2 md:px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Không hoạt động
                        </span>
                    )}
                    {!showRemoved && (
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

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <BaseTable
                        data={templates}
                        columns={columns}
                        loading={loading}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={showRemoved ? handleDelete : null}
                        onUpdateStatus={handleUpdateStatus}
                        canView={() => canView('MD')}
                        canEdit={() => canUpdate('MD')}
                        canDelete={() => canDelete('MD')}
                        canUpdateStatus={() => canUpdateStatus('MD')}
                        viewIcon={<Download className="w-4 h-4" />}
                        showActions={true}
                        actionColumnWidth="150px"
                        emptyMessage="Không có biểu mẫu nào"
                        pagination={pagination}
                        onPageChange={handlePageChange}
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
                message={`Bạn có chắc chắn muốn xóa biểu mẫu "${deleteModal.template?.tenMauDon ?? deleteModal.template?.ten_mau_don
                    }"?`}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />
        </div>
    );
}
