import React, { useState, useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import BaseModal, { ModalFooter } from '../../components/BaseModal';
import { FORMALITY_API } from '../../apis/formality';
import { AREAS_API } from '../../apis/areas';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export default function ProceduresManager() {
    const [procedures, setProcedures] = useState([]);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        ten_thu_tuc: '',
        linh_vuc: [],
        cac_buoc_thuc_hien: ['', '', ''],
        ho_so_yeu_cau: [''],
        thoi_gian_xu_ly: '',
        le_phi: '',
        dia_diem_tiep_nhan: '',
        so_dien_thoai_ho_tro: ''
    });
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0
    });

    const fetchProcedures = async (page = 1, size = 10, search = '', id_linh_vuc = '') => {
        setLoading(true);
        try {
            const params = {
                page: page,
                size,
                search,
                is_removed: false
            };

            if (id_linh_vuc) {
                params.id_linh_vuc = id_linh_vuc;
            }

            const response = await FORMALITY_API.getFormalityApi(params);

            console.log('Procedures API response:', response.content);
            const procedures = response.content || [];

            setProcedures(procedures);
            setPagination({
                current: page,
                pageSize: size,
                total: response.totalElements || 0,
                totalPages: response.totalPages || 0
            });
            console.log('Fetched procedures:', procedures.length, 'items');
        } catch (error) {
            console.error('Error fetching procedures:', error);
            setProcedures([]);

            setPagination(prev => ({
                ...prev,
                total: 0,
                totalPages: 0
            }));
        } finally {
            setLoading(false);
        }
    };

    const fetchAreas = async () => {
        try {
            const response = await AREAS_API.getAreas(false);
            setAreas(response || []);
            console.log('Fetched areas:', response?.length, 'items');
        } catch (error) {
            console.error('Error fetching areas:', error);
            setAreas([]);
        }
    };

    useEffect(() => {
        fetchProcedures();
        fetchAreas();
    }, []);

    const handleSearch = () => {
        fetchProcedures(1, pagination.pageSize, searchKeyword, selectedDomain);
    };

    const handlePageChange = (page) => {
        fetchProcedures(page, pagination.pageSize, searchKeyword, selectedDomain);
    };

    const handlePageSizeChange = (size) => {
        fetchProcedures(1, size, searchKeyword, selectedDomain);
    };

    const handleReset = () => {
        setSearchKeyword('');
        setSelectedDomain('');
        fetchProcedures(1, pagination.pageSize, '', '');
    };

    const handleCreateProcedure = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCreateModalOpen(false);
        setFormData({
            ten_thu_tuc: '',
            linh_vuc: [],
            cac_buoc_thuc_hien: ['', '', ''],
            ho_so_yeu_cau: [''],
            thoi_gian_xu_ly: '',
            le_phi: '',
            dia_diem_tiep_nhan: '',
            so_dien_thoai_ho_tro: ''
        });
    };

    const handleSubmitCreate = async () => {
        console.log('Create procedure:', formData);
        // await FORMALITY_API.createFormality(formData);
        handleCloseModal();
        // fetchProcedures(pagination.current, pagination.pageSize, searchKeyword, selectedDomain);
    };

    const handleAddStep = () => {
        setFormData({
            ...formData,
            cac_buoc_thuc_hien: [...formData.cac_buoc_thuc_hien, '']
        });
    };

    const handleRemoveStep = (index) => {
        const newSteps = formData.cac_buoc_thuc_hien.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            cac_buoc_thuc_hien: newSteps
        });
    };

    const handleStepChange = (index, value) => {
        const newSteps = [...formData.cac_buoc_thuc_hien];
        newSteps[index] = value;
        setFormData({
            ...formData,
            cac_buoc_thuc_hien: newSteps
        });
    };

    const handleAddDocument = () => {
        setFormData({
            ...formData,
            ho_so_yeu_cau: [...formData.ho_so_yeu_cau, '']
        });
    };

    const handleRemoveDocument = (index) => {
        const newDocs = formData.ho_so_yeu_cau.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            ho_so_yeu_cau: newDocs
        });
    };

    const handleDocumentChange = (index, value) => {
        const newDocs = [...formData.ho_so_yeu_cau];
        newDocs[index] = value;
        setFormData({
            ...formData,
            ho_so_yeu_cau: newDocs
        });
    };

    const handleToggleArea = (areaId) => {
        const currentAreas = [...formData.linh_vuc];
        const index = currentAreas.indexOf(areaId);
        
        if (index > -1) {
            currentAreas.splice(index, 1);
        } else {
            currentAreas.push(areaId);
        }
        
        setFormData({
            ...formData,
            linh_vuc: currentAreas
        });
    };

    const handleEdit = (procedure) => {
        console.log('Edit procedure:', procedure);
    };

    const handleDelete = async (procedure) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa thủ tục "${procedure.ten_thu_tuc}"?`)) {
            try {
                await FORMALITY_API.deleteFormality(procedure.id);
                fetchProcedures(pagination.current, pagination.pageSize, searchKeyword, selectedDomain);
            } catch (error) {
                console.error('Error deleting procedure:', error);
                alert('Có lỗi xảy ra khi xóa thủ tục!');
            }
        }
    };

    const handleView = (procedure) => {
        console.log('View procedure:', procedure);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ma_thu_tuc',
            key: 'ma_thu_tuc',
            width: '80px',
            render: (value, record, index) => `#${index + 1 + (pagination.current - 1) * pagination.pageSize}`
        },
        {
            title: 'TÊN THỦ TỤC',
            dataIndex: 'ten_thu_tuc',
            key: 'ten_thu_tuc',
            width: '250px'
        },
        {
            title: 'LĨNH VỰC',
            dataIndex: 'linh_vuc',
            key: 'linh_vuc',
            width: '150px',
            render: (value) => {
                if (!value) return 'N/A';
                if (Array.isArray(value)) {
                    return value.length > 0 ? value.join(', ') : 'N/A';
                }
                return value.ten_linh_vuc || value;
            }
        },
        {
            title: 'THỜI GIAN',
            dataIndex: 'thoi_gian_tao',
            key: 'thoi_gian_tao',
            width: '150px',
            render: (value) => {
                if (!value) return (
                    <div className="text-gray-400">
                        <div className="text-xs">N/A</div>
                    </div>
                );
                return (
                    <div className="text-gray-600">
                        <div className="text-xs font-medium">{dayjs(value).format('DD/MM/YYYY')}</div>
                        <div className="text-xs text-gray-400">{dayjs(value).format('HH:mm:ss')}</div>
                    </div>
                );
            }
        },
        {
            title: 'LỆ PHÍ',
            dataIndex: 'le_phi',
            key: 'le_phi',
            width: '120px',
            render: (value) => {
                if (value === undefined || value === null) {
                    return (
                        <div className="flex items-center text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            N/A
                        </div>
                    );
                }
                return (
                    <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        {value === 0 ? 'Miễn phí' : `${value?.toLocaleString()} VND`}
                    </div>
                );
            }
        },
        {
            title: 'LIÊN HỆ',
            dataIndex: 'lien_he',
            key: 'lien_he',
            width: '150px',
            render: (value) => {
                if (!value) {
                    return <span className="text-gray-400">028-1234-5678</span>;
                }
                return <span className="text-gray-600">{value}</span>;
            }
        }
    ];

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
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            placeholder="Nhập từ khóa tìm kiếm trong mã thủ tục, tên thủ tục..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className="min-w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực
                        </label>
                        <select
                            value={selectedDomain}
                            onChange={(e) => setSelectedDomain(e.target.value)}
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
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
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
                            onClick={handleSearch}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={handleReset}
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
                    onClick={handleCreateProcedure}
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
                onPageChange={handlePageChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                showActions={true}
                emptyMessage="Không có thủ tục nào được tìm thấy"
                className="mb-4"
            />

            <BaseModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseModal}
                title="Thêm thủ tục mới"
                size="2xl"
                footer={
                    <ModalFooter
                        onCancel={handleCloseModal}
                        onSubmit={handleSubmitCreate}
                        cancelText="Hủy"
                        submitText="Lưu thủ tục"
                    />
                }
            >
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên thủ tục <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.ten_thu_tuc}
                            onChange={(e) => setFormData({ ...formData, ten_thu_tuc: e.target.value })}
                            placeholder="Nhập tên thủ tục..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lĩnh vực <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-300">
                            <p className="text-xs text-gray-500 mb-2">VD: Hộ tích - Cư trú</p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {areas.map((area) => (
                                    <label 
                                        key={area.id} 
                                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.linh_vuc.includes(area.id)}
                                            onChange={() => handleToggleArea(area.id)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">{area.ten_linh_vuc}</span>
                                    </label>
                                ))}
                            </div>
                            {formData.linh_vuc.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-600">
                                        Đã chọn: <span className="font-medium">{formData.linh_vuc.length}</span> lĩnh vực
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Các bước thực hiện
                        </label>
                        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                            {formData.cac_buoc_thuc_hien.map((step, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={step}
                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                        placeholder={`Bước ${index + 1}:`}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    />
                                    {formData.cac_buoc_thuc_hien.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveStep(index)}
                                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddStep}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Thêm bước
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Hồ sơ yêu cầu
                        </label>
                        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                            {formData.ho_so_yeu_cau.map((doc, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={doc}
                                        onChange={(e) => handleDocumentChange(index, e.target.value)}
                                        placeholder="- Chứng minh nhân dân/Căn cước công dân"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                                    />
                                    {formData.ho_so_yeu_cau.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveDocument(index)}
                                            className="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddDocument}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                + Thêm hồ sơ
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian xử lý
                            </label>
                            <input
                                type="text"
                                value={formData.thoi_gian_xu_ly}
                                onChange={(e) => setFormData({ ...formData, thoi_gian_xu_ly: e.target.value })}
                                placeholder="VD: 7 ngày làm việc"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lệ phí
                            </label>
                            <input
                                type="text"
                                value={formData.le_phi}
                                onChange={(e) => setFormData({ ...formData, le_phi: e.target.value })}
                                placeholder="VD: 100.000 VND hoặc Miễn phí"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            Địa điểm tiếp nhận
                        </label>
                        <input
                            type="text"
                            value={formData.dia_diem_tiep_nhan}
                            onChange={(e) => setFormData({ ...formData, dia_diem_tiep_nhan: e.target.value })}
                            placeholder="VD: Phòng Hộ tích - Tầng 2, UBND Phường"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại hỗ trợ
                        </label>
                        <input
                            type="text"
                            value={formData.so_dien_thoai_ho_tro}
                            onChange={(e) => setFormData({ ...formData, so_dien_thoai_ho_tro: e.target.value })}
                            placeholder="VD: 028-1234-5678"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </BaseModal>
        </div>
    );
}
