import dayjs from "dayjs";

export const getProcedureColumns = (pagination) => [
    {
        title: 'STT',
        dataIndex: 'ma_thu_tuc',
        key: 'ma_thu_tuc',
        width: '50px',
        render: (value, record, index) => `#${index + 1 + (pagination.current - 1) * pagination.pageSize}`
    },
    {
        title: 'TÊN THỦ TỤC',
        dataIndex: 'ten_thu_tuc',
        key: 'ten_thu_tuc',
        width: '250px',
        render: (value) => (
            <span 
                className="block max-w-[250px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                title={value}
            >
                {value}
            </span>
        )
    },
    {
        title: 'LIÊN HỆ',
        dataIndex: 'so_dien_thoai_co_so',
        key: 'so_dien_thoai_co_so',
        width: '120px',
        render: (value) => (
            <span 
                className="block max-w-[120px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                title={value || 'N/A'}
            >
                {value || 'N/A'}
            </span>
        )
    },
    {
        title: 'LĨNH VỰC',
        dataIndex: 'linh_vuc',
        key: 'linh_vuc',
        width: '180px',
        render: (value) => {
            if (!value) return 'N/A';
            let displayValue;
            if (Array.isArray(value)) {
                displayValue = value.length > 0 ? value.join(', ') : 'N/A';
            } else {
                displayValue = value.ten_linh_vuc || value;
            }
            return (
                <span 
                    className="block max-w-[180px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                    title={displayValue}
                >
                    {displayValue}
                </span>
            );
        }
    },
    {
        title: 'CƠ SỞ DỊCH VỤ CÔNG',
        dataIndex: 'co_so_dich_vu_cong',
        key: 'co_so_dich_vu_cong',
        width: '200px',
        render: (value) => {
            const displayValue = value || 'N/A';
            return (
                <span 
                    className="block max-w-[200px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                    title={displayValue}
                >
                    {displayValue}
                </span>
            );
        }
    },
    {
        title: 'THOI GIAN TẠO',
        dataIndex: 'thoi_gian_tao',
        key: 'thoi_gian_tao',
        width: '150px',
        render: (value) => (
            <span 
                className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
                title={value ? dayjs(value).format('HH:mm:ss DD/MM/YYYY') : 'N/A'}
            >
                {value ? dayjs(value).format('HH:mm:ss DD/MM/YYYY') : 'N/A'}
            </span>
        )
    }
];
