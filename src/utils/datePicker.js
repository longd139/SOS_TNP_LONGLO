import React from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/vi';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('vi');
dayjs.tz.setDefault('Asia/Ho_Chi_Minh');

export const DateTimePicker = ({ value, onChange, placeholder, style, className, ...rest }) => {
    return (
        <DatePicker
            showTime={{
                format: 'HH:mm',
                minuteStep: 1,
            }}
            format="DD/MM/YYYY HH:mm"
            value={value}
            onChange={onChange}
            placeholder={placeholder || 'Chọn ngày và giờ'}
            locale={locale.DatePicker}
            style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                ...style
            }}
            className={className}
            popupClassName="custom-datepicker-dropdown"
            {...rest}
        />
    );
};

export const utcToVietnamTime = (utcTimestamp) => {
    if (!utcTimestamp) return null;
    return dayjs(utcTimestamp).tz('Asia/Ho_Chi_Minh');
};

export const vietnamTimeToUTC = (dayjsObj) => {
    if (!dayjsObj) return null;
    return dayjsObj.utc().toISOString();
};

export default DateTimePicker;