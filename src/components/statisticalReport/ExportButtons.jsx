import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
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
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isLoading = exportLoading || pdfLoading;

    const handleExportExcel = async () => {
        setIsOpen(false);
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
        setIsOpen(false);
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
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 flex items-center gap-2 bg-blue-600 text-white text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
            >
                <Download className="w-4 h-4" />
                <span>{isLoading ? 'Đang xuất...' : 'Xuất file'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 divide-y divide-gray-100 animate-fade-in">
                    <div className="py-1">
                        <button
                            onClick={handleExportExcel}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-900">Xuất file Excel (.xlsx)</div>
                                <div className="text-xs text-gray-500">Bảng dữ liệu chi tiết</div>
                            </div>
                        </button>
                        <button
                            onClick={handleExportPDF}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                            <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <div>
                                <div className="font-semibold text-gray-900">Xuất file PDF (.pdf)</div>
                                <div className="text-xs text-gray-500">Tài liệu báo cáo tổng hợp</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
