import React from "react";
import {
  X,
  Calendar,
  User,
  MapPin,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { formatDate } from "../../utils/formatDate";

const ReportDetailModal = ({ isOpen, onClose, report, loading = false }) => {
  if (!isOpen) return null;

  const API_URL = process.env.REACT_APP_API_URL;

  const getStatusBadgeStyle = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("mới") || statusLower.includes("gửi")) {
      return "bg-yellow-100 text-yellow-800";
    }
    if (statusLower.includes("tiếp nhận")) {
      return "bg-blue-100 text-blue-800";
    }
    if (statusLower.includes("xử lý")) {
      return "bg-orange-100 text-orange-800";
    }
    if (statusLower.includes("giải quyết")) {
      return "bg-green-100 text-green-800";
    }
    if (statusLower.includes("đóng")) {
      return "bg-gray-100 text-gray-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const currentStatus =
    report?.lich_su_trang_thai?.[report.lich_su_trang_thai.length - 1];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Center modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          {loading ? (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : report ? (
            <>
              <div className="bg-white px-4 pt-5 sm:p-6 sm:pb-0 max-h-[calc(100vh-100px)] max-w-2xl overflow-y-auto">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="items-center gap-2 mb-4">
                      <h2 className="text-md text-black font-semibold mb-2">
                        Chi tiết phản ánh: #{report.ma_phan_anh}
                      </h2>
                      <p className="text-sm text-gray-500">
                        Xem và cập nhật trạng thái phản ánh
                      </p>
                    </div>
                    <p className="text-lg mb-2">
                      {report.tieu_de}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                          currentStatus?.ten
                        )}`}
                      >
                        {currentStatus?.ten || "Chưa xác định"}
                      </span>
                      <span>{report.muc_do || "Chưa xác định"}</span>
                      <span>
                        {report.linh_vuc_phan_anh.ten || "Chưa xác định"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Đóng</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Thông tin cơ bản */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        Ngày gửi:
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatDate(report.thoi_gian_tao)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {report.ten_nguoi_phan_anh || "Ẩn danh"} -{" "}
                        {report.sdt_nguoi_phan_anh || "Không có SĐT"}
                      </span>
                    </div>
                  </div>

                  {/* Mô tả chi tiết */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      Mô tả chi tiết
                    </h4>
                    <p className="text-sm text-gray-700 rounded-md whitespace-pre-wrap mb-6">
                      {report.mo_ta || "Không có mô tả"}
                    </p>
                  </div>

                  {/* Hình ảnh đính kèm */}
                  {report.dinh_kem_phan_anh &&
                    report.dinh_kem_phan_anh.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4" />
                          Hình ảnh đính kèm
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {report.dinh_kem_phan_anh.map((file, index) => (
                            <div key={index} className="relative group">
                              {file.dinh_dang_file?.startsWith("image/") ? (
                                <img
                                  src={`${API_URL}${file.url_file}`}
                                  alt={`Attachment ${index + 1}`}
                                  className="w-full object-cover rounded-lg border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      `${API_URL}${file.url_file}`,
                                      "_blank"
                                    )
                                  }
                                />
                              ) : (
                                <div className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                  <FileText className="w-12 h-12 text-gray-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Vị trí */}
                  <div className="border-b">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2 ">
                      <MapPin className="w-4 h-4" />
                      Vị trí
                    </h4>
                    <p className="text-sm text-gray-700 bg-gray-100 p-3.5 rounded-md mb-6">
                      {report.vi_tri || "Không có thông tin vị trí"}
                    </p>
                  </div>

                  {/* Cập nhật trạng thái */}
                  <div className="mt-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Cập nhật trạng thái
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-4">
                        <select className="flex-1 px-3 py-2.5 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                          <option>
                            {currentStatus?.ten || "Chưa xác định"}
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nội dung phản hồi
                        </label>
                        <textarea
                          placeholder="Nhập nội dung phản hồi cho người dân..."
                          rows="3"
                          className="w-full px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Lưu và gửi thông báo
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Đóng
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Không có dữ liệu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
