import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from '../base/BaseModal';
import { Download, FileText } from 'lucide-react';
import dayjs from 'dayjs';
import { downloadUtils } from '../../utils/downLoadUtils';
const ProcedureDetailModal = ({ isOpen, onClose, procedure }) => {
    if (!procedure) return null;
    // const formatCurrency = (value) => {
    //     return new Intl.NumberFormat('vi-VN', {
    //         style: 'currency',
    //         currency: 'VND'
    //     }).format(value);
    // };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Chi tiết thủ tục hành chính"
            size="3xl"
            className="max-w-5xl"
            footer={
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Đóng
                    </button>
                </div>
            }
        >
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mã thủ tục</label>
                            <p className="text-sm text-gray-900 truncate" title={procedure.ma_thu_tuc}>
                                {procedure.ma_thu_tuc}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Tên thủ tục</label>
                            <p className="text-sm text-gray-900 truncate" title={procedure.ten_thu_tuc}>
                                {procedure.ten_thu_tuc}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Đối tượng thực hiện</label>
                            <p className="text-sm text-gray-900 truncate" title={procedure.doi_tuong_thuc_hien}>
                                {procedure.doi_tuong_thuc_hien}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Số quyết định</label>
                            <p className="text-sm text-gray-900 truncate" title={procedure.so_quyet_dinh || 'Không có'}>
                                {procedure.so_quyet_dinh || 'Không có'}
                            </p>
                        </div>
                    </div>
                </div>

                {procedure.co_so_dich_vu_cong && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cơ sở dịch vụ công</h3>
                        <div className="space-y-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Tên cơ sở</label>
                                <p className="text-sm text-gray-900 truncate" title={procedure.co_so_dich_vu_cong.ten_co_so}>
                                    {procedure.co_so_dich_vu_cong.ten_co_so}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ</label>
                                <p className="text-sm text-gray-900 truncate" title={procedure.co_so_dich_vu_cong.dia_chi}>
                                    {procedure.co_so_dich_vu_cong.dia_chi}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                                <p className="text-sm text-gray-900">{procedure.co_so_dich_vu_cong.so_dien_thoai}</p>
                            </div>
                            {procedure.co_so_dich_vu_cong.link_google_map && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Google Maps</label>
                                    <a
                                        href={procedure.co_so_dich_vu_cong.link_google_map}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 hover:underline truncate block"
                                        title={procedure.co_so_dich_vu_cong.link_google_map}
                                    >
                                        Xem trên bản đồ
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {procedure.yeu_cau_dieu_kien_chung && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Yêu cầu điều kiện chung</h3>
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{procedure.yeu_cau_dieu_kien_chung}</p>
                    </div>
                )}

                {procedure.thu_tuc_hanh_chinh_linh_vuc && procedure.thu_tuc_hanh_chinh_linh_vuc.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lĩnh vực</h3>
                        <div className="flex flex-wrap gap-2">
                            {procedure.thu_tuc_hanh_chinh_linh_vuc.map((item) => (
                                <span
                                    key={item.id}
                                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                >
                                    {item.linh_vuc.ten_linh_vuc}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {procedure.trinh_tu_thuc_hien_thu_tuc && procedure.trinh_tu_thuc_hien_thu_tuc.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Trình tự thực hiện</h3>
                        <div className="space-y-2">
                            {[...procedure.trinh_tu_thuc_hien_thu_tuc]
                                .sort((a, b) => a.thu_tu_buoc - b.thu_tu_buoc)
                                .map((step) => (
                                    <div key={step.id} className="bg-white p-2 rounded-lg border border-gray-200">
                                        <div className="flex items-start gap-2">
                                            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                                {step.thu_tu_buoc}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 mb-1 truncate" title={step.ten_buoc}>
                                                    {step.ten_buoc}
                                                </h4>
                                                <p className="text-sm text-gray-600 text-wrap" title={step.mo_ta_buoc}>
                                                    {step.mo_ta_buoc}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {procedure.cach_thuc_thuc_hien && procedure.cach_thuc_thuc_hien.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cách thức thực hiện</h3>
                        {procedure.cach_thuc_thuc_hien.map((cach, index) => (
                            <div key={cach.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2 truncate" title={`Cách thức ${index + 1}: ${cach.hinh_thuc_ap_dung}`}>
                                    Cách thức {index + 1}: {cach.hinh_thuc_ap_dung}
                                </h4>
                                <div className="space-y-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Mô tả chi tiết</label>
                                        <p className="text-sm text-gray-900 text-wrap" title={cach.mo_ta_chi_tiet}>
                                            {cach.mo_ta_chi_tiet}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian giải quyết</label>
                                            <p className="text-sm text-gray-900 truncate" title={cach.thoi_gian_giai_quyet}>
                                                {cach.thoi_gian_giai_quyet}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Lệ phí</label>
                                            <p className="text-sm text-gray-900 font-semibold text-green-600">
                                                {cach.le_phi || '-'}
                                            </p>
                                        </div>
                                    </div>
                                    {cach.ghi_chu_le_phi && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Ghi chú lệ phí</label>
                                            <p className="text-sm text-gray-900 truncate" title={cach.ghi_chu_le_phi}>
                                                {cach.ghi_chu_le_phi}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {procedure.truong_hop_thu_tuc && procedure.truong_hop_thu_tuc.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Trường hợp thủ tục</h3>
                        {[...procedure.truong_hop_thu_tuc]
                            .sort((a, b) => a.thu_tu - b.thu_tu)
                            .map((caseItem, index) => (
                                <div key={caseItem.id} className="bg-white p-3 rounded-lg border border-gray-200">
                                    <div className="mb-3">
                                        <h4 className="font-medium text-gray-900 mb-1 truncate text-wrap" title={`Trường hợp ${caseItem.thu_tu}: ${caseItem.ten_truong_hop}`}>
                                            Trường hợp {caseItem.thu_tu}: {caseItem.ten_truong_hop}
                                        </h4>
                                        {caseItem.mo_ta && (
                                            <p className="text-sm text-gray-600 text-wrap" title={caseItem.mo_ta}>
                                                {caseItem.mo_ta}
                                            </p>

                                        )}
                                    </div>

                                    {caseItem.thanh_phan_ho_so && caseItem.thanh_phan_ho_so.length > 0 && (
                                        <div className="mt-3 pl-3 border-l-2 border-yellow-300">
                                            <h5 className="text-sm font-semibold text-gray-700 mb-2">Thành phần hồ sơ:</h5>
                                            <div className="space-y-2">
                                                {caseItem.thanh_phan_ho_so.map((component, compIndex) => (
                                                    <div key={compIndex} className="bg-gray-50 p-2 rounded border border-gray-200">
                                                        <div className="flex items-start gap-2 mb-1">
                                                            <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                                                {compIndex + 1}
                                                            </span>
                                                            <p className="text-sm font-medium text-gray-900 flex-1 text-wrap" title={component.ten_thanh_phan}>
                                                                {component.ten_thanh_phan}
                                                            </p>

                                                        </div>
                                                        {component.mo_ta_chi_tiet && (
                                                            <p className="text-xs text-gray-600 ml-7 mb-1 text-wrap" title={component.mo_ta_chi_tiet}>
                                                                {component.mo_ta_chi_tiet}
                                                            </p>
                                                        )}
                                                        <div className="ml-7 flex gap-3 text-xs text-gray-600">
                                                            <span>Bản chính: <strong>{component.so_luong_ban_chinh || 0}</strong></span>
                                                            <span>Bản sao: <strong>{component.so_luong_ban_sao || 0}</strong></span>
                                                            {component.ghi_chu && (
                                                                <span className="truncate" title={component.ghi_chu}>
                                                                    Ghi chú: <em>{component.ghi_chu}</em>
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}

                {procedure.thu_tuc_hanh_chinh_mau_don && procedure.thu_tuc_hanh_chinh_mau_don.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Mẫu đơn</h3>
                        <div className="space-y-2">
                            {procedure.thu_tuc_hanh_chinh_mau_don.map((mauDon, index) => {
                                return (
                                    <div key={mauDon.id || index} className="flex items-start gap-3 w-full">
                                        <div className="flex-shrink-0 flex items-center">
                                            <FileText className="w-5 h-5 text-gray-600" />
                                        </div>

                                        <div className="flex-1 text-sm text-gray-900 break-words">
                                            {mauDon?.mau_don.ten_mau_don || '-'}
                                        </div>

                                        <div className="flex-shrink-0">
                                            <button
                                                onClick={() => downloadUtils.handleDownloadPdf(mauDon?.mau_don)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Tải xuống"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin khác</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian tạo</label>
                            <p className="text-sm text-gray-900">
                                {dayjs(procedure.thoi_gian_tao).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Thời gian cập nhật</label>
                            <p className="text-sm text-gray-900">
                                {dayjs(procedure.thoi_gian_cap_nhap).format('DD/MM/YYYY HH:mm')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

ProcedureDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    procedure: PropTypes.object
};

export default ProcedureDetailModal;
