import React, { useState, useEffect } from 'react';
import BaseTable from '../../components/BaseTable';
import { FORMALITY_API } from '../../apis/formality';

export default function ProceduresManager() {
    const [procedures, setProcedures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedDomain, setSelectedDomain] = useState('');
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
  };    useEffect(() => {
        fetchProcedures();
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
            dataIndex: 'id',
            key: 'id',
            width: '80px',
            render: (value, record, index) => `#${index + 1 + (pagination.current - 1) * pagination.pageSize}`
        },
        {
            title: 'Tên thủ tục',
            dataIndex: 'ten_thu_tuc',
            key: 'ten_thu_tuc',
            width: '250px'
        },
        {
            title: 'Lĩnh vực',
            dataIndex: 'linh_vuc',
            key: 'linh_vuc',
            width: '150px',
            render: (value) => value?.ten_linh_vuc || 'N/A'
        },
        {
            title: 'Thời gian',
            dataIndex: 'thoi_gian_xu_ly',
            key: 'thoi_gian_xu_ly',
            width: '120px',
            render: (value) => (
                <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {value ? `${value} ngày làm việc` : 'N/A'}
                </div>
            )
        },
        {
            title: 'Lệ phí',
            dataIndex: 'le_phi',
            key: 'le_phi',
            width: '120px',
            render: (value) => (
                <div className="flex items-center text-green-600">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {value ? (value === 0 ? 'Miễn phí' : `${value?.toLocaleString()} VND`) : 'N/A'}
                </div>
            )
        },
        {
            title: 'Liên hệ',
            dataIndex: 'lien_he',
            key: 'lien_he',
            width: '120px',
            render: (value) => value || '028-1234-5678'
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
                            <option value="ho-tich">Hộ tích - Cư trú</option>
                            <option value="kinh-doanh">Kinh doanh</option>
                            <option value="xa-hoi">Xã hội</option>
                            <option value="xay-dung">Xây dựng</option>
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
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
        </div>
    );
}
