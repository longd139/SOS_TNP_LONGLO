import React from 'react';
import { FileText } from 'lucide-react';
import { reportDetailsData } from '../../mockData';

export default function ReportDetails() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">
          Chi tiết phản ánh (Cập nhật mới nhất)
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Mã phản ánh
              </th>
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Tiêu đề
              </th>
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Lĩnh vực
              </th>
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Trạng thái
              </th>
              <th className="text-left py-3 px-2 text-base font-bold text-gray-700">
                Ngày cập nhật
              </th>
            </tr>
          </thead>
          <tbody>
            {reportDetailsData.map((report, index) => (
              <tr
                key={report.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
              >
                <td className="py-3 px-2 text-sm font-medium text-gray-900">
                  {report.id}
                </td>
                <td className="py-3 px-2 text-sm text-gray-900 max-w-xs">
                  <div className="truncate" title={report.title}>
                    {report.title}
                  </div>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600">
                  {report.category}
                </td>
                <td className="py-3 px-2">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: report.statusBg,
                      color: report.statusColor
                    }}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="py-3 px-2 text-sm text-gray-600">
                  {report.createdDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}