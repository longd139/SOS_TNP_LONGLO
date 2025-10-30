import React from 'react';
import PropTypes from 'prop-types';
import { useTemplates } from '../../hooks/useTemplates';

const ProcedureMauDonSection = ({ items, addItem, removeItem, updateItem, errors }) => {
    const getError = (index, field) => {
        const bracketKey = `danhSachMauDon[${index}].${field}`;
        const dotKey = `danhSachMauDon.${index}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    const { templates = [], loading } = useTemplates(false);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900 required-label">Danh sách mẫu đơn</h3>
            </div>
            <div className="space-y-3">
                {items.map((item, idx) => (
                    <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-white">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <label className="block text-xs font-medium text-gray-700">Mã mẫu đơn</label>
                                <select
                                    value={item.id || ''}
                                    onChange={(e) => updateItem(idx, 'id', e.target.value)}
                                    className={`w-full px-2 py-1 text-sm border rounded ${getError(idx, 'id') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    <option value="">-- Chọn biểu mẫu --</option>
                                    {templates.map(t => (
                                        <option key={t.id} value={t.id}>{t.ten_mau_don || t.mo_ta || t.id}</option>
                                    ))}
                                </select>
                                {getError(idx, 'id') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'id')}</p>}
                            </div>

                            <div className="w-48">
                                <label className="block text-xs font-medium text-gray-700">Số lượng bản chính</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.so_luong_ban_chinh ?? 0}
                                    onChange={(e) => updateItem(idx, 'so_luong_ban_chinh', Number(e.target.value))}
                                    className={`w-full px-2 py-1 text-sm border rounded ${getError(idx, 'so_luong_ban_chinh') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {getError(idx, 'so_luong_ban_chinh') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'so_luong_ban_chinh')}</p>}
                            </div>

                            <div className="w-48">
                                <label className="block text-xs font-medium text-gray-700">Số lượng bản sao</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={item.so_luong_ban_sao ?? 0}
                                    onChange={(e) => updateItem(idx, 'so_luong_ban_sao', Number(e.target.value))}
                                    className={`w-full px-2 py-1 text-sm border rounded ${getError(idx, 'so_luong_ban_sao') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {getError(idx, 'so_luong_ban_sao') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'so_luong_ban_sao')}</p>}
                            </div>

                            <div className="flex items-center justify-center w-10 flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => removeItem(idx)}
                                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                                    title="Xóa mẫu đơn"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-700">Ghi chú</label>
                            <input
                                type="text"
                                value={item.ghi_chu || ''}
                                onChange={(e) => updateItem(idx, 'ghi_chu', e.target.value)}
                                className={`w-full px-2 py-1 text-sm border rounded ${getError(idx, 'ghi_chu') ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            {getError(idx, 'ghi_chu') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'ghi_chu')}</p>}
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    + Thêm mẫu đơn
                </button>
            </div>
        </div>
    );
};

ProcedureMauDonSection.propTypes = {
    items: PropTypes.array.isRequired,
    addItem: PropTypes.func.isRequired,
    removeItem: PropTypes.func.isRequired,
    updateItem: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default ProcedureMauDonSection;
