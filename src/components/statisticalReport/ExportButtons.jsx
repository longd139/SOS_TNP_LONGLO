import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';
import { showToast } from '../../utils/toastNotification';
import { exportPDF } from '../../utils/pdfUtils';
import dayjs from 'dayjs';

export default function ExportButtons({ dateRange, reportType }) {
  const { exportSummaryExcel, exportLoading } = useStatisticalReport();
  const [pdfLoading, setPdfLoading] = useState(false);

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
      setPdfLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dateRangeStr = dateRange.from && dateRange.to
        ? `_${dayjs(dateRange.from).format('DD-MM-YYYY')}_${dayjs(dateRange.to).format('DD-MM-YYYY')}`
        : '';
      
      const fileName = `BaoCaoThongKe${dateRangeStr}_${dayjs().format('DD-MM-YYYY_HH-mm-ss')}`;
      
      await exportPDF('statistic-content', fileName, {
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
        }
      });
      
      showToast.success('Xuất PDF thành công');
    } catch (error) {
      showToast.error(error.message || 'Xuất PDF thất bại. Vui lòng thử lại.');
    } finally {
      setPdfLoading(false);
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
        disabled={pdfLoading}
        className="flex-1 sm:flex-none px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm md:text-base rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">{pdfLoading ? 'Đang xuất...' : 'Xuất PDF'}</span>
        <span className="sm:hidden">{pdfLoading ? '...' : 'PDF'}</span>
      </button>
    </div>
  );
}
