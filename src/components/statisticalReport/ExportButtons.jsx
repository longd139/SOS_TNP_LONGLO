import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useStatisticalReport } from '../../hooks/useStatisticalReport';
import { showToast } from '../../utils/toastNotification';
import { exportPDF } from '../../utils/pdfUtils';
import dayjs from 'dayjs';

export default function ExportButtons({ dateRange, reportType }) {
    const { 
        exportPhanAnhExcel, 
        exportThuTucExcel, 
        exportTinTucExcel, 
        exportLoading 
    } = useStatisticalReport();
    const [pdfLoading, setPdfLoading] = useState(false);

    const handleExportExcel = async () => {
        try {
            const params = {};
            if (dateRange?.from) params.from = dateRange.from;
            if (dateRange?.to) params.to = dateRange.to;

            switch (reportType) {
                case 'reports':
                    await exportPhanAnhExcel(params);
                    showToast.success('Xuất báo cáo phản ánh thành công');
                    break;
                case 'news':
                    await exportTinTucExcel(params);
                    showToast.success('Xuất báo cáo tin tức thành công');
                    break;
                case 'procedures':
                    await exportThuTucExcel(params);
                    showToast.success('Xuất báo cáo thủ tục thành công');
                    break;
                default:
                    await exportPhanAnhExcel(params);
                    showToast.success('Xuất báo cáo thành công');
            }
        } catch (error) {
            showToast.error(error.message || 'Xuất Excel thất bại');
        }
    };

    const handleExportPDF = async () => {
        try {
            setPdfLoading(true);

            await new Promise(resolve => setTimeout(resolve, 500));

            const dateRangeStr = dateRange?.from && dateRange?.to
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
                className="px-4 py-2 border border-gray-300 flex items-center gap-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{exportLoading ? 'Đang xuất...' : 'Xuất Excel'}</span>
                <span className="sm:hidden">{exportLoading ? '...' : 'Excel'}</span>
            </button>
            <button
                onClick={handleExportPDF}
                disabled={pdfLoading}
                className="px-4 py-2 border border-gray-300 flex items-center gap-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{pdfLoading ? 'Đang xuất...' : 'Xuất PDF'}</span>
                <span className="sm:hidden">{pdfLoading ? '...' : 'PDF'}</span>
            </button>
        </div>
    );
}
