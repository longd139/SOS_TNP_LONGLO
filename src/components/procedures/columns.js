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
