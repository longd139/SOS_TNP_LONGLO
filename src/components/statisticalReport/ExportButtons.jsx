import React from 'react';
import { Download } from 'lucide-react';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';
import { showToast } from '../../utils/toastNotification';

export default function ExportButtons({ dateRange, reportType }) {
  const { exportSummaryExcel, exportLoading } = useStatisticalReport();

  const handleExportExcel = async () => {
    try {
      const params = {};
      if (dateRange.from) params.from = dateRange.from;
      if (dateRange.to) params.to = dateRange.to;

      if (reportType === 'overview' || reportType === 'reports') {
        await exportSummaryExcel(params);
        showToast.success('Xuất báo cáo tổng hợp thành công');
      }
    } catch (error) {
      showToast.error(error.message || 'Xuất Excel thất bại');
    }
  };

  const handleExportPDF = async () => {
    try {
      showToast.info('Chức năng xuất PDF đang được phát triển. Vui lòng sử dụng xuất Excel.');
    } catch (error) {
      showToast.error('Xuất PDF thất bại');
    }
  };

  return (
    <div className="flex gap-2 md:gap-3">
      <button
        onClick={handleExportExcel}
        disabled={exportLoading}
        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">{exportLoading ? 'Đang xuất...' : 'Xuất Excel'}</span>
        <span className="sm:hidden">{exportLoading ? '...' : 'Excel'}</span>
      </button>
      <button
        onClick={handleExportPDF}
        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Xuất PDF</span>
        <span className="sm:hidden">PDF</span>
      </button>
    </div>
  );
}
