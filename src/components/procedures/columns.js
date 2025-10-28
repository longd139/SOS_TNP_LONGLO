import dayjs from 'dayjs';

export const getProcedureColumns = (pagination) => [
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
            if (!value) {
                return (
                    <div className="text-gray-400">
                        <div className="text-xs">N/A</div>
                    </div>
                );
            }
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
