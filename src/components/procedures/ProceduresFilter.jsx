import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BaseFilter from '../base/BaseFilter';
import { fetchAreas } from '../../features/areas/areasThunks';
import { selectAreas } from '../../features/areas/areasSelectors';

export default function ProceduresFilter({ 
    filters = {},
    pagination = {},
    showActive = true,
    onFilterChange,
    onSearch,
    onReset,
    onToggleActive,
    onPageSizeChange,
    onSearchWithFilters
}) {
    const dispatch = useDispatch();
    const areas = useSelector(selectAreas);

    useEffect(() => {
        dispatch(fetchAreas({ isActive: true }));
    }, [dispatch]);

    const initialFilters = {
        searchKeyword: filters.searchKeyword || '',
        selectedDomain: filters.selectedDomain || '',
        showActive: showActive,
        pageSize: pagination.pageSize || 10
    };

    const filterFields = [
        {
            name: 'searchKeyword',
            type: 'search',
            isSearch: true,
            placeholder: 'Nhập từ khóa tìm kiếm thủ tục...'
        },
        {
            name: 'selectedDomain',
            label: 'Lĩnh vực',
            type: 'select',
            options: [
                { value: '', label: 'Tất cả lĩnh vực' },
                ...areas.map(area => ({
                    value: area.id,
                    label: area.ten || area.ten_linh_vuc || area.name
                }))
            ]
        },
        {
            name: 'showActive',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { value: true, label: 'Hoạt động' },
                { value: false, label: 'Đã xóa' }
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
        if (newFilters.searchKeyword !== filters.searchKeyword) {
            onFilterChange?.('searchKeyword', newFilters.searchKeyword);
        }
        if (newFilters.selectedDomain !== filters.selectedDomain) {
            onFilterChange?.('selectedDomain', newFilters.selectedDomain);
        }

        if (newFilters.showActive !== showActive) {
            onToggleActive?.(newFilters.showActive);
        }

        if (onSearchWithFilters) {
            onSearchWithFilters({
                searchKeyword: newFilters.searchKeyword,
                selectedDomain: newFilters.selectedDomain,
                showActive: newFilters.showActive,
                pageSize: Number(newFilters.pageSize)
            });
        } else {
            if (newFilters.pageSize !== pagination.pageSize) {
                onPageSizeChange?.(Number(newFilters.pageSize));
            }
            onSearch?.();
        }
    };

    const handleReset = () => {
        onReset?.();
    };

    return (
        <BaseFilter
            fields={filterFields}
            onFilter={handleFilter}
            onReset={handleReset}
            initialFilters={initialFilters}
            searchPlaceholder="Nhập từ khóa tìm kiếm thủ tục..."
            showSearchButton={true}
        />
    );
}
