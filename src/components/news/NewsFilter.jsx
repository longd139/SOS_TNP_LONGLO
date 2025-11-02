import React from 'react';
import BaseFilter from '../BaseFilter';
import { useCategories } from '../../hooks/useCategories';
import { STATUS_NEWS, STATUS_NEWS_LABELS } from '../../constants/status';

export default function NewsFilter({ onFilter, onReset }) {
    const { activeCategories } = useCategories({ autoFetch: true, isRemoved: false });

    const initialFilters = {
        search: '',
        idDanhMuc: '',
        trangThai: '',
        isRemoved: false
    };

    const filterFields = [
        {
            name: 'search',
            type: 'search',
            isSearch: true,
            placeholder: 'Tìm kiếm theo tiêu đề...'
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
            name: 'trangThai',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả trạng thái' },
                { value: STATUS_NEWS.DRAFT, label: STATUS_NEWS_LABELS[STATUS_NEWS.DRAFT] },
                { value: STATUS_NEWS.PUBLISHED, label: STATUS_NEWS_LABELS[STATUS_NEWS.PUBLISHED] }
            ]
        },
        {
            name: 'isRemoved',
            label: 'Hiển thị',
            type: 'select',
            options: [
                { value: false, label: 'Đang hoạt động' },
                { value: true, label: 'Đã xóa' }
            ]
        }
    ];

    const handleFilter = (filters) => {
        const activeFilters = {};
        if (filters.search) activeFilters.search = filters.search;
        if (filters.idDanhMuc) activeFilters.idDanhMuc = filters.idDanhMuc;
        if (filters.trangThai) activeFilters.trangThai = filters.trangThai;
        if (filters.isRemoved) activeFilters.isRemoved = filters.isRemoved;
        
        onFilter(activeFilters);
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
