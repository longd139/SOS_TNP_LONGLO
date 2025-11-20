import React from 'react';
import BaseFilter from '../base/BaseFilter';

const ReportAreasFilter = ({ onFilter, onReset, filters = {}, pagination = {} }) => {
    const initialFilters = {
        search: '',
        isActive: true,
        pageSize: 10
    };

    const filterFields = [
        {
            name: 'search',
            type: 'search',
            isSearch: true,
            placeholder: 'Tìm kiếm theo tên lĩnh vực...'
        },
        {
            name: 'isActive',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { value: true, label: 'Hoạt động' },
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
                { value: 50, label: '50 bản ghi' }
            ]
        }
    ];

    const handleFilter = (newFilters) => {
        onFilter({
            search: newFilters.search.trim() || '',
            isActive: newFilters.isActive,
            pageSize: Number(newFilters.pageSize)
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
            searchPlaceholder="Tìm kiếm theo tên lĩnh vực..."
            showSearchButton={true}
        />
    );
};

export default ReportAreasFilter;
