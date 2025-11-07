import React from 'react';
import PropTypes from 'prop-types';

const ProcedureMethodsSection = ({ methods, addMethod, removeMethod, updateMethod, errors }) => {
    const getError = (index, field) => {
        const bracketKey = `cachThuThucHien[${index}].${field}`;
        const dotKey = `cachThuThucHien.${index}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Cách thức thực hiện</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {methods.map((method, index) => (
                    <div
                        key={method.id || `method-${index}`}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Cách thức {index + 1}
                            </span>
                            {methods.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeMethod(index)}
                                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                                    title="Xóa cách thức này"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div>
                                <input
                                    type="text"
                                    value={method.hinh_thuc_ap_dung}
                                    onChange={(e) => updateMethod(index, 'hinh_thuc_ap_dung', e.target.value)}
                                    placeholder="Hình thức áp dụng..."
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                                        getError(index, 'hinh_thuc_ap_dung')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {getError(index, 'hinh_thuc_ap_dung') && (
                                    <p className="text-xs text-red-600 mt-1">{getError(index, 'hinh_thuc_ap_dung')}</p>
                                )}
                            </div>

                            <div>
                                <textarea
                                    value={method.mo_ta_chi_tiet}
                                    onChange={(e) => updateMethod(index, 'mo_ta_chi_tiet', e.target.value)}
                                    placeholder="Mô tả chi tiết..."
                                    rows="2"
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                                        getError(index, 'mo_ta_chi_tiet')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {getError(index, 'mo_ta_chi_tiet') && (
                                    <p className="text-xs text-red-600 mt-1">{getError(index, 'mo_ta_chi_tiet')}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <input
                                        type="text"
                                        value={method.thoi_gian_giai_quyet}
                                        onChange={(e) => updateMethod(index, 'thoi_gian_giai_quyet', e.target.value)}
                                        placeholder="Thời gian giải quyết..."
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                                            getError(index, 'thoi_gian_giai_quyet')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                    />
                                    {getError(index, 'thoi_gian_giai_quyet') && (
                                        <p className="text-xs text-red-600 mt-1">{getError(index, 'thoi_gian_giai_quyet')}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={method.le_phi === 0 || method.le_phi === '0' ? '' : method.le_phi}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === '' || /^[0-9.,]*$/.test(value)) {
                                                updateMethod(index, 'le_phi', value);
                                            }
                                        }}
                                        placeholder="Lệ phí (VND)..."
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                                            getError(index, 'le_phi')
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-300 focus:ring-blue-500'
                                        }`}
                                    />
                                    {getError(index, 'le_phi') && (
                                        <p className="text-xs text-red-600 mt-1">{getError(index, 'le_phi')}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <input
                                    type="text"
                                    value={method.ghi_chu_le_phi}
                                    onChange={(e) => updateMethod(index, 'ghi_chu_le_phi', e.target.value)}
                                    placeholder="Ghi chú lệ phí..."
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                                        getError(index, 'ghi_chu_le_phi')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {getError(index, 'ghi_chu_le_phi') && (
                                    <p className="text-xs text-red-600 mt-1">{getError(index, 'ghi_chu_le_phi')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addMethod}
                    className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
                >
                    + Thêm cách thức thực hiện
                </button>
            </div>
        </div>
    );
};

ProcedureMethodsSection.propTypes = {
    methods: PropTypes.array.isRequired,
    addMethod: PropTypes.func.isRequired,
    removeMethod: PropTypes.func.isRequired,
    updateMethod: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default ProcedureMethodsSection;
