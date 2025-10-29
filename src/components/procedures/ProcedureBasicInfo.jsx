import React from 'react';
import PropTypes from 'prop-types';

const ProcedureBasicInfo = ({ formData, errors, updateField }) => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã CSDVC <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.idCoSoDichVuCong}
                    onChange={(e) => updateField('idCoSoDichVuCong', e.target.value)}
                    placeholder="Nhập mã cơ sở dịch vụ công (UUID)..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.idCoSoDichVuCong ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.idCoSoDichVuCong && (
                    <p className="mt-1 text-sm text-red-600">{errors.idCoSoDichVuCong}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã thủ tục <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.maThuTuc}
                    onChange={(e) => updateField('maThuTuc', e.target.value)}
                    placeholder="Nhập mã thủ tục..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.maThuTuc ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.maThuTuc && (
                    <p className="mt-1 text-sm text-red-600">{errors.maThuTuc}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên thủ tục <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.tenThuTuc}
                    onChange={(e) => updateField('tenThuTuc', e.target.value)}
                    placeholder="Nhập tên thủ tục..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tenThuTuc ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.tenThuTuc && (
                    <p className="mt-1 text-sm text-red-600">{errors.tenThuTuc}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đối tượng thực hiện <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={formData.doiTuongThucHien}
                    onChange={(e) => updateField('doiTuongThucHien', e.target.value)}
                    placeholder="VD: Cá nhân, Tổ chức..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.doiTuongThucHien ? 'border-red-500' : 'border-gray-300'
                        }`}
                />
                {errors.doiTuongThucHien && (
                    <p className="mt-1 text-sm text-red-600">{errors.doiTuongThucHien}</p>
                )}
            </div>
        </>
    );
};

ProcedureBasicInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    updateField: PropTypes.func.isRequired
};

export default ProcedureBasicInfo;
