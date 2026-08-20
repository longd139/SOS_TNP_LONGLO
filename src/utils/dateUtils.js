
export const normalizeDate = (dateStr) => {
    if (!dateStr) return '';
    
    // If string like DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // If pure YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }
    
    // If ISO timestamp with T
    if (typeof dateStr === 'string' && dateStr.includes('T')) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            // Check if it's UTC representation of VN midnight (T17:00:00Z)
            if (dateStr.includes('T17:00:00') || dateStr.includes('T17:00:00.000Z')) {
                const vnTime = new Date(d.getTime() + (d.getTimezoneOffset() + 420) * 60000);
                const year = vnTime.getFullYear();
                const month = String(vnTime.getMonth() + 1).padStart(2, '0');
                const day = String(vnTime.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            // For standard ISO with T00:00:00, take the date part directly
            const datePart = dateStr.split('T')[0];
            if (/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
                return datePart;
            }
        }
    }
    
    try {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    } catch (e) {
    }
    
    return String(dateStr);
};

export const formatDateVN = (dateStr) => {
    if (!dateStr) return '';
    const norm = normalizeDate(dateStr);
    if (/^\d{4}-\d{2}-\d{2}$/.test(norm)) {
        const [year, month, day] = norm.split('-');
        return `${day}/${month}/${year}`;
    }
    return dateStr;
};

export const formatDateTimeVN = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    
    return date.toLocaleString('vi-VN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

export const createDateString = (year, month, day) => {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const isSameDate = (date1, date2) => {
    const normalized1 = normalizeDate(date1);
    const normalized2 = normalizeDate(date2);
    return normalized1 === normalized2;
};

export const hourFormat = (hourStr) => {
    if (!hourStr) return '';
    const [start, end] = hourStr.split(' - ').map(t => t.trim());
    return {
        start,
        end
    };
};