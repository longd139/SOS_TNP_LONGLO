import React from 'react';
import BaseFilter from '../base/BaseFilter';

const ReportFilter = ({ 
    onFilter, 
    onReset, 
    filters = {}, 
    pagination = {}, 
    statusReport = {},
    reportAreas = [],
    extent = {}
}) => {
    const initialFilters = {
        trangThai: filters.trangThai || '',
        idLinhVucPhanAnh: filters.idLinhVucPhanAnh || '',
        mucDo: filters.mucDo || '',
        maPhanAnh: filters.maPhanAnh || '',
        sortTime: filters.sortTime || 'desc',
        pageSize: pagination.pageSize || 10
    };

    const filterFields = [
        {
            name: 'maPhanAnh',
            label: 'Mã phản ánh',
            type: 'search',
            placeholder: 'Tìm theo mã phản ánh...'
        },
        {
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả' },
                ...(statusReport && typeof statusReport === 'object' ? Object.entries(statusReport).map(([key, value]) => ({
                    value: value,
                    label: value
                })) : [])
            ]
        },
        {
            name: 'idLinhVucPhanAnh',
            label: 'Lĩnh vực',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả' },
                ...reportAreas.map(area => ({
                    value: area.id,
                    label: area.ten
                }))
            ]
        },
        {
            name: 'mucDo',
            label: 'Mức độ',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả' },
                ...(extent && typeof extent === 'object' ? Object.entries(extent).map(([key, value]) => ({
                    value: value,
                    label: value
                })) : [])
            ]
        },
        {
            name: 'sortTime',
            label: 'Sắp xếp theo thời gian',
            type: 'select',
            options: [
                { value: 'desc', label: 'Mới nhất trước' },
                { value: 'asc', label: 'Cũ nhất trước' }
            ]
        },
        {
            name: 'pageSize',
            label: 'Số bản ghi',
            type: 'select',
            options: [
                { value: 5, label: '5 bản ghi' },
                { value: 10, label: '10 bản ghi' },
                { value: 20, label: '20 bản ghi' },
                { value: 50, label: '50 bản ghi' }
            ]
        }
    ];

    const handleFilter = (newFilters) => {
        onFilter({
            trangThai: newFilters.trangThai || '',
            idLinhVucPhanAnh: newFilters.idLinhVucPhanAnh || '',
            mucDo: newFilters.mucDo || '',
            maPhanAnh: (newFilters.maPhanAnh || '').trim(),
            sortTime: newFilters.sortTime || 'desc',
            pageSize: Number(newFilters.pageSize) || 10
        });
    };

    const handleReset = () => {
        onReset();
    };

    return (
        <BaseFilter
            fields={filterFields}
            onFilter={handleFilter}
            onReset={handleReset}
            initialFilters={initialFilters}
            searchPlaceholder="Tìm kiếm phản ánh..."
            showSearchButton={true}
        />
    );
};

export default ReportFilter;
