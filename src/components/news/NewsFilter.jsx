import React from 'react';
import BaseFilter from '../base/BaseFilter';
import { useCategories } from '../../hooks/useCategories';

export default function NewsFilter({ onFilter, onReset }) {
    const { activeCategories } = useCategories({ autoFetch: true, isRemoved: false });

    const initialFilters = {
        search: '',
        idDanhMuc: '',
        isActive: true,
        pageSize: 10
    };

    const filterFields = [
        {
            name: 'search',
            type: 'search',
            isSearch: true,
            placeholder: 'Tìm kiếm theo tiêu đề'
        },
        {
            name: 'idDanhMuc',
            label: 'Danh mục',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả danh mục' },
                ...activeCategories.map(cat => ({
                    value: cat.id,
                    label: cat.ten_danh_muc
                }))
            ]
        },
        {
            name: 'isActive',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { value: true, label: 'Đang hoạt động' },
                { value: false, label: 'Không hoạt động' }
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
                { value: 50, label: '50 bản ghi' },
                { value: 100, label: '100 bản ghi' }
            ]
        }
    ];

    const handleFilter = (filters) => {
        onFilter(filters);
    };

    return (
        <BaseFilter
            fields={filterFields}
            onFilter={handleFilter}
            onReset={onReset}
            initialFilters={initialFilters}
            searchPlaceholder="Tìm kiếm theo tiêu đề..."
            showSearchButton={true}
        />
    );
}
