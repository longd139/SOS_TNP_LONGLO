import React from 'react';
import PropTypes from 'prop-types';

const ProcedureAreasSelector = ({ formData, errors, areas, toggleArea }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                Lĩnh vực
            </label>
            <div className={`bg-gray-50 p-3 rounded-lg border ${errors.danhSachLinhVucIds ? 'border-red-500' : 'border-gray-300'
                }`}>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {areas.map((area) => (
                        <label
                            key={area.id}
                            className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={formData.danhSachLinhVucIds.includes(area.id)}
                                onChange={() => toggleArea(area.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{area.ten_linh_vuc}</span>
                        </label>
                    ))}
                </div>

                {formData.danhSachLinhVucIds.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600">
                            Đã chọn: <span className="font-medium">{formData.danhSachLinhVucIds.length}</span> lĩnh vực
                        </p>
                    </div>
                )}
            </div>

            {errors.danhSachLinhVucIds && (
                <p className="mt-1 text-sm text-red-600">{errors.danhSachLinhVucIds}</p>
            )}
        </div>
    );
};

ProcedureAreasSelector.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    toggleArea: PropTypes.func.isRequired
};

export default ProcedureAreasSelector;
