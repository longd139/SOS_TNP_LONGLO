import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const ProcedureCasesSection = ({ cases, addCase, removeCase, updateCase, updateCaseComponent, addCaseComponent, removeCaseComponent }) => {
    const [expandedCases, setExpandedCases] = useState({});

    const toggleCase = (index) => {
        setExpandedCases(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Trường hợp thủ tục</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {cases.map((caseItem, caseIndex) => (
                    <div
                        key={caseItem.id || `case-${caseIndex}`}
                        className="bg-white rounded-lg border border-gray-200"
                    >
                            <div className="p-3">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            Trường hợp {caseItem.thu_tu || caseIndex + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => toggleCase(caseIndex)}
                                            className="text-gray-400 hover:text-gray-600 p-1"
                                            title={expandedCases[caseIndex] ? "Thu gọn" : "Mở rộng"}
                                        >
                                            {expandedCases[caseIndex] ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeCase(caseIndex)}
                                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                        title="Xóa trường hợp này"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={caseItem.ten_truong_hop}
                                        onChange={(e) => updateCase(caseIndex, 'ten_truong_hop', e.target.value)}
                                        placeholder="Tên trường hợp..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />

                                    <textarea
                                        value={caseItem.mo_ta}
                                        onChange={(e) => updateCase(caseIndex, 'mo_ta', e.target.value)}
                                        placeholder="Mô tả trường hợp..."
                                        rows="2"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    />
                                </div>
                            </div>

                            {expandedCases[caseIndex] && (
                                <div className="px-3 pb-3 border-t border-gray-200">
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-medium text-gray-600">
                                                Thành phần hồ sơ
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => addCaseComponent(caseIndex)}
                                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                + Thêm thành phần
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {caseItem.thanh_phan_ho_so?.map((component, componentIndex) => (
                                                <div
                                                    key={componentIndex}
                                                    className="bg-gray-50 p-2 rounded border border-gray-200"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-medium text-gray-600">
                                                            Thành phần {componentIndex + 1}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCaseComponent(caseIndex, componentIndex)}
                                                            className="text-red-600 hover:bg-red-100 p-0.5 rounded transition-colors"
                                                            title="Xóa thành phần"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <input
                                                            type="text"
                                                            value={component.ten_thanh_phan}
                                                            onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'ten_thanh_phan', e.target.value)}
                                                            placeholder="Tên thành phần..."
                                                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                        />

                                                        <textarea
                                                            value={component.mo_ta_chi_tiet}
                                                            onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'mo_ta_chi_tiet', e.target.value)}
                                                            placeholder="Mô tả chi tiết..."
                                                            rows="2"
                                                            className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                        />

                                                        <div className="grid grid-cols-3 gap-2">
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={component.so_luong_ban_chinh}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'so_luong_ban_chinh', e.target.value)}
                                                                placeholder="Số bản chính..."
                                                                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                            />
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={component.so_luong_ban_sao}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'so_luong_ban_sao', e.target.value)}
                                                                placeholder="Số bản sao..."
                                                                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={component.ghi_chu}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'ghi_chu', e.target.value)}
                                                                placeholder="Ghi chú..."
                                                                className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                <button
                    type="button"
                    onClick={addCase}
                    className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
                >
                    + Thêm trường hợp thủ tục
                </button>
            </div>
        </div>
    );
};

ProcedureCasesSection.propTypes = {
    cases: PropTypes.array.isRequired,
    addCase: PropTypes.func.isRequired,
    removeCase: PropTypes.func.isRequired,
    updateCase: PropTypes.func.isRequired,
    updateCaseComponent: PropTypes.func.isRequired,
    addCaseComponent: PropTypes.func.isRequired,
    removeCaseComponent: PropTypes.func.isRequired
};

export default ProcedureCasesSection;
