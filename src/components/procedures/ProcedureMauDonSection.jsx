import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../features/templates/templatesThunks';
import { selectTemplates, selectTemplatesLoading } from '../../features/templates/templatesSelectors';
import TemplateSelector from './TemplateSelector';

const ProcedureMauDonSection = ({ items, addItem, removeItem, updateItem, errors }) => {
    const dispatch = useDispatch();
    const templates = useSelector(selectTemplates);
    const loading = useSelector(selectTemplatesLoading);

    useEffect(() => {
        if (templates.length === 0) {
            dispatch(fetchTemplates(false));
        }
    }, [dispatch, templates.length]);

    const getError = (index, field) => {
        const bracketKey = `danhSachMauDon[${index}].${field}`;
        const dotKey = `danhSachMauDon.${index}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Danh sách mẫu đơn</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {items.map((item, idx) => {
                    const selectedIds = items
                        .map(i => i.id)
                        .filter(id => id && id !== item.id);
                    
                    return (
                        <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-white">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                                <div className="lg:col-span-5">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Mẫu đơn</label>
                                    <TemplateSelector
                                        value={item.id || ''}
                                        onChange={(templateId) => updateItem(idx, 'id', templateId)}
                                        templates={templates}
                                        excludeIds={selectedIds}
                                        error={getError(idx, 'id')}
                                        placeholder="-- Chọn biểu mẫu --"
                                    />
                                    {getError(idx, 'id') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'id')}</p>}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Bản chính</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.so_luong_ban_chinh ?? 0}
                                        onChange={(e) => updateItem(idx, 'so_luong_ban_chinh', Number(e.target.value))}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg ${
                                            getError(idx, 'so_luong_ban_chinh') 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                    />
                                    {getError(idx, 'so_luong_ban_chinh') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'so_luong_ban_chinh')}</p>}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Bản sao</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.so_luong_ban_sao ?? 0}
                                        onChange={(e) => updateItem(idx, 'so_luong_ban_sao', Number(e.target.value))}
                                        className={`w-full px-3 py-2 text-sm border rounded-lg ${
                                            getError(idx, 'so_luong_ban_sao') 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                    />
                                    {getError(idx, 'so_luong_ban_sao') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'so_luong_ban_sao')}</p>}
                                </div>

                                <div className="lg:col-span-2">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                                    <input
                                        type="text"
                                        value={item.ghi_chu || ''}
                                        onChange={(e) => updateItem(idx, 'ghi_chu', e.target.value)}
                                        placeholder="Ghi chú..."
                                        className={`w-full px-3 py-2 text-sm border rounded-lg ${
                                            getError(idx, 'ghi_chu') 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                                : 'border-gray-300 focus:border-blue-500 hover:border-gray-400'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors`}
                                    />
                                    {getError(idx, 'ghi_chu') && <p className="text-xs text-red-600 mt-1">{getError(idx, 'ghi_chu')}</p>}
                                </div>

                                <div className="lg:col-span-1 flex items-end justify-center pb-1">
                                    <button
                                        type="button"
                                        onClick={() => removeItem(idx)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                                        title="Xóa mẫu đơn"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
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
