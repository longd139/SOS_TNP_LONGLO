import React from 'react';

export default function NewsDetailsTable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu để hiển thị
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left py-3 px-4 font-bold text-gray-900">
              Ngày
            </th>
            <th className="text-center py-3 px-4 font-bold text-gray-900">
              Đã xuất bản
            </th>
            <th className="text-center py-3 px-4 font-bold text-gray-900">
              Bản nháp
            </th>
            <th className="text-center py-3 px-4 font-bold text-gray-900">
              Tổng bài viết
            </th>
            <th className="text-center py-3 px-4 font-bold text-gray-900">
              Lượt xem
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-900 font-medium">
                {item.date}
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-sm font-medium text-green-500 rounded-md">
                  {item.daXuatBan}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-sm font-medium text-orange-500  rounded-md">
                  {item.banNhap}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-2 text-sm font-medium text-gray-700 rounded-md">
                  {item.tongBaiViet}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-flex items-center justify-center min-w-[3rem] h-6 px-2 text-sm font-medium text-blue-500 rounded-md">
                  {item.luotXem.toLocaleString()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}