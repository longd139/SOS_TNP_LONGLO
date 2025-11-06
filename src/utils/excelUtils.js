// Utility để tạo file Excel mẫu cho import lịch tiếp dân
export const createSampleExcelData = () => {
    return [
        // Header row - CHÍNH XÁC theo format server expect
        ['Địa điểm', 'Tên cán bộ', 'Thời gian', 'Ngày tiếp dân', 'Ghi chú'],
        // Sample data với format date chuẩn
        ['Phòng 101', 'Lê Văn A', '08:00 - 10:00', '2025-12-01', 'Tiếp dân trực tiếp'],
        ['Phòng 102', 'Nguyễn Thị B', '10:00 - 12:00', '2025-12-02', 'Tiếp dân online'],
        ['Phòng 103', 'Trần Văn C', '14:00 - 16:00', '2025-12-03', 'Tiếp dân hỗn hợp'],
        ['Phòng 104', 'Phạm Thị D', '08:30 - 10:30', '2025-12-04', 'Tiếp dân khẩn cấp'],
    ];
};

// Utility để download file Excel mẫu
export const downloadSampleExcel = () => {
    const data = createSampleExcelData();
    
    // Create CSV content with UTF-8 BOM for proper Vietnamese display
    const csvContent = data.map(row => 
        row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    // Add UTF-8 BOM for Excel compatibility
    const blob = new Blob(['\ufeff' + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'mau_lich_tiep_dan.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instruction
    setTimeout(() => {
        alert(`
📋 HƯỚNG DẪN SỬ DỤNG FILE MẪU:

1. ✅ Mở file CSV đã tải bằng Excel
2. ✅ Chỉnh sửa dữ liệu theo format có sẵn
3. ✅ Lưu lại dưới dạng .xlsx hoặc .csv
4. ✅ Import file đã chỉnh sửa

⚠️ LƯU Ý:
- Ngày phải đúng format: YYYY-MM-DD (VD: 2025-12-01)
- Không được để trống các cột bắt buộc
- Thời gian theo format: HH:MM - HH:MM
        `.trim());
    }, 500);
};