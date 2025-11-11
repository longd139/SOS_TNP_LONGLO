import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import BaseModal, { ModalFooter } from '../base/BaseModal';

const ProcedureCasesSection = ({ cases, addCase, removeCase, updateCase, updateCaseComponent, addCaseComponent, removeCaseComponent, errors }) => {
    const [expandedCases, setExpandedCases] = useState({});
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCaseName, setNewCaseName] = useState('');
    const [newCaseDesc, setNewCaseDesc] = useState('');
    const [localError, setLocalError] = useState(null);
    const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
    const [activeCaseIndex, setActiveCaseIndex] = useState(null);
    const [newComponentName, setNewComponentName] = useState('');
    const [newComponentDesc, setNewComponentDesc] = useState('');
    const [newComponentSoLuongChinh, setNewComponentSoLuongChinh] = useState('');
    const [newComponentSoLuongSao, setNewComponentSoLuongSao] = useState('');
    const [newComponentGhiChu, setNewComponentGhiChu] = useState('');
    const [componentLocalError, setComponentLocalError] = useState(null);

    const toggleCase = (index) => {
        setExpandedCases(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const getCaseError = (caseIndex, field) => {
        const bracketKey = `truongHopThuTuc[${caseIndex}].${field}`;
        const dotKey = `truongHopThuTuc.${caseIndex}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    const getComponentError = (caseIndex, componentIndex, field) => {
        const bracketKey = `truongHopThuTuc[${caseIndex}].thanh_phan_ho_so[${componentIndex}].${field}`;
        const dotKey = `truongHopThuTuc.${caseIndex}.thanh_phan_ho_so.${componentIndex}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    return (
        <div>
            <div className="flex justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Trường hợp thủ tục</h3>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            setLocalError(null);
                            setNewCaseName('');
                            setNewCaseDesc('');
                            setIsAddModalOpen(true);
                        }}
                        className=" py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
                    >
                        + Thêm trường hợp
                    </button>
                </div>
            </div>
            {cases.length === 0 && (
                <div className="border border-gray-300 border-dashed rounded-lg p-6 text-center text-gray-500 mt-3">
                    Chưa có trường hợp thủ tục nào. Nhấn "Thêm trường hợp" để bắt đầu.
                </div>
            )}
            <BaseModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm trường hợp mới"
                size="md"
                footer={
                    <ModalFooter
                        onCancel={() => setIsAddModalOpen(false)}
                        onSubmit={() => {
                            if (!newCaseName || newCaseName.trim() === '') {
                                setLocalError('Tên trường hợp là bắt buộc');
                                return;
                            }

                            const newIndex = cases.length;

                            addCase({
                                ten_truong_hop: newCaseName,
                                mo_ta: newCaseDesc,
                                thu_tu: newIndex + 1,
                                thanh_phan_ho_so: []
                            });

                            setExpandedCases(prev => ({ ...prev, [newIndex]: true }));
                            setTimeout(() => {
                                try {
                                    const el = document.querySelector(`[data-case-index="${newIndex}"]`);
                                    if (el && typeof el.scrollIntoView === 'function') {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                } catch (e) {
                                }
                            }, 50);

                            setIsAddModalOpen(false);
                            setNewCaseName('');
                            setNewCaseDesc('');
                            setLocalError(null);
                        }}
                        cancelText="Hủy"
                        submitText="Lưu"
                        submitType="primary"
                    />
                }
            >
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên trường hợp</label>
                        <input
                            type="text"
                            value={newCaseName}
                            onChange={(e) => {
                                setNewCaseName(e.target.value);
                                if (localError) setLocalError(null);
                            }}
                            placeholder="Nhập tên trường hợp..."
                            className={`w-full  bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${localError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        />
                        {localError && (
                            <p className="text-xs text-red-600 mt-1">{localError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả trường hợp</label>
                        <textarea
                            value={newCaseDesc}
                            onChange={(e) => setNewCaseDesc(e.target.value)}
                            placeholder="Nhập mô tả trường hợp..."
                            rows="4"
                            className="w-full  bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </BaseModal>
            <BaseModal
                isOpen={isAddComponentModalOpen}
                onClose={() => setIsAddComponentModalOpen(false)}
                title="Add a document"
                size="md"
                contentClassName="bg-white"
                footer={
                    <ModalFooter
                        onCancel={() => setIsAddComponentModalOpen(false)}
                        onSubmit={() => {
                            if (!newComponentName || newComponentName.trim() === '') {
                                setComponentLocalError('Tên thành phần là bắt buộc');
                                return;
                            }

                            if (activeCaseIndex === null || activeCaseIndex === undefined) return;

                            addCaseComponent(activeCaseIndex, {
                                ten_thanh_phan: newComponentName,
                                mo_ta_chi_tiet: newComponentDesc,
                                so_luong_ban_chinh: newComponentSoLuongChinh ? Number(newComponentSoLuongChinh) : null,
                                so_luong_ban_sao: newComponentSoLuongSao ? Number(newComponentSoLuongSao) : null,
                                ghi_chu: newComponentGhiChu
                            });

                            setExpandedCases(prev => ({ ...prev, [activeCaseIndex]: true }));
                            setTimeout(() => {
                                try {
                                    const el = document.querySelector(`[data-case-index="${activeCaseIndex}"]`);
                                    if (el && typeof el.scrollIntoView === 'function') {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }
                                } catch (e) { }
                            }, 50);

                            setIsAddComponentModalOpen(false);
                            setActiveCaseIndex(null);
                            setNewComponentName('');
                            setNewComponentDesc('');
                            setNewComponentSoLuongChinh('');
                            setNewComponentSoLuongSao('');
                            setNewComponentGhiChu('');
                            setComponentLocalError(null);
                        }}
                        cancelText="Hủy"
                        submitText="Lưu"
                        submitType="primary"
                    />
                }
            >
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent path</label>
                        <input
                            type="text"
                            placeholder="/thanhphan 1762658741227"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${componentLocalError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Document ID</label>
                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <input
                                    type="text"
                                    placeholder="Enter document ID…"
                                    className={`w-full h-10 pl-4 pr-28 text-gray-200 placeholder-gray-500 text-sm rounded-lg border ${componentLocalError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                                        } focus:outline-none focus:ring-2 transition-colors`}
                                />
                                <button
                                    type="button"
                                    className="flex items-center justify-center px-8 py-2 ml-2 bg-white text-blue-600 border rounded border-blue-300 text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                >
                                    Auto
                                </button>
                            </div>

                            {componentLocalError && (
                                <p className="mt-2 flex items-center gap-2 text-sm text-red-400">
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-xs">!</span>
                                    <span>Required</span>
                                </p>
                            )}
                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                        <textarea
                            value={newComponentDesc}
                            onChange={(e) => setNewComponentDesc(e.target.value)}
                            placeholder="Mô tả chi tiết..."
                            rows="3"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng bản chính</label>
                            <input
                                type="number"
                                min="0"
                                value={newComponentSoLuongChinh}
                                onChange={(e) => setNewComponentSoLuongChinh(e.target.value)}
                                placeholder="Số bản chính..."
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng bản sao</label>
                            <input
                                type="number"
                                min="0"
                                value={newComponentSoLuongSao}
                                onChange={(e) => setNewComponentSoLuongSao(e.target.value)}
                                placeholder="Số bản sao..."
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <input
                            type="text"
                            value={newComponentGhiChu}
                            onChange={(e) => setNewComponentGhiChu(e.target.value)}
                            placeholder="Ghi chú..."
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </BaseModal>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {cases.map((caseItem, caseIndex) => (
                    <div
                        key={caseItem.id || `case-${caseIndex}`}
                        data-case-index={caseIndex}
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
                                <div>
                                    <input
                                        type="text"
                                        value={caseItem.ten_truong_hop}
                                        onChange={(e) => updateCase(caseIndex, 'ten_truong_hop', e.target.value)}
                                        placeholder="Tên trường hợp..."
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${getCaseError(caseIndex, 'ten_truong_hop')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                    />
                                    {getCaseError(caseIndex, 'ten_truong_hop') && (
                                        <p className="text-xs text-red-600 mt-1">{getCaseError(caseIndex, 'ten_truong_hop')}</p>
                                    )}
                                </div>

                                <div>
                                    <textarea
                                        value={caseItem.mo_ta}
                                        onChange={(e) => updateCase(caseIndex, 'mo_ta', e.target.value)}
                                        placeholder="Mô tả trường hợp..."
                                        rows="2"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${getCaseError(caseIndex, 'mo_ta')
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                    />
                                    {getCaseError(caseIndex, 'mo_ta') && (
                                        <p className="text-xs text-red-600 mt-1">{getCaseError(caseIndex, 'mo_ta')}</p>
                                    )}
                                </div>
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
                                            onClick={() => {
                                                setActiveCaseIndex(caseIndex);
                                                setNewComponentName('');
                                                setNewComponentDesc('');
                                                setNewComponentSoLuongChinh('');
                                                setNewComponentSoLuongSao('');
                                                setNewComponentGhiChu('');
                                                setComponentLocalError(null);
                                                setIsAddComponentModalOpen(true);
                                            }}
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
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={component.ten_thanh_phan}
                                                            onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'ten_thanh_phan', e.target.value)}
                                                            placeholder="Tên thành phần..."
                                                            className={`w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 text-xs ${getComponentError(caseIndex, componentIndex, 'ten_thanh_phan')
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                : 'border-gray-300 focus:ring-blue-500'
                                                                }`}
                                                        />
                                                        {getComponentError(caseIndex, componentIndex, 'ten_thanh_phan') && (
                                                            <p className="text-xs text-red-600 mt-1">{getComponentError(caseIndex, componentIndex, 'ten_thanh_phan')}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <textarea
                                                            value={component.mo_ta_chi_tiet}
                                                            onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'mo_ta_chi_tiet', e.target.value)}
                                                            placeholder="Mô tả chi tiết..."
                                                            rows="2"
                                                            className={`w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 text-xs ${getComponentError(caseIndex, componentIndex, 'mo_ta_chi_tiet')
                                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                : 'border-gray-300 focus:ring-blue-500'
                                                                }`}
                                                        />
                                                        {getComponentError(caseIndex, componentIndex, 'mo_ta_chi_tiet') && (
                                                            <p className="text-xs text-red-600 mt-1">{getComponentError(caseIndex, componentIndex, 'mo_ta_chi_tiet')}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={component.so_luong_ban_chinh}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'so_luong_ban_chinh', e.target.value)}
                                                                placeholder="Số bản chính..."
                                                                className={`w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 text-xs ${getComponentError(caseIndex, componentIndex, 'so_luong_ban_chinh')
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-300 focus:ring-blue-500'
                                                                    }`}
                                                            />
                                                            {getComponentError(caseIndex, componentIndex, 'so_luong_ban_chinh') && (
                                                                <p className="text-xs text-red-600 mt-1">{getComponentError(caseIndex, componentIndex, 'so_luong_ban_chinh')}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={component.so_luong_ban_sao}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'so_luong_ban_sao', e.target.value)}
                                                                placeholder="Số bản sao..."
                                                                className={`w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 text-xs ${getComponentError(caseIndex, componentIndex, 'so_luong_ban_sao')
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-300 focus:ring-blue-500'
                                                                    }`}
                                                            />
                                                            {getComponentError(caseIndex, componentIndex, 'so_luong_ban_sao') && (
                                                                <p className="text-xs text-red-600 mt-1">{getComponentError(caseIndex, componentIndex, 'so_luong_ban_sao')}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={component.ghi_chu}
                                                                onChange={(e) => updateCaseComponent(caseIndex, componentIndex, 'ghi_chu', e.target.value)}
                                                                placeholder="Ghi chú..."
                                                                className={`w-full px-2 py-1.5 border rounded focus:outline-none focus:ring-2 text-xs ${getComponentError(caseIndex, componentIndex, 'ghi_chu')
                                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                                    : 'border-gray-300 focus:ring-blue-500'
                                                                    }`}
                                                            />
                                                            {getComponentError(caseIndex, componentIndex, 'ghi_chu') && (
                                                                <p className="text-xs text-red-600 mt-1">{getComponentError(caseIndex, componentIndex, 'ghi_chu')}</p>
                                                            )}
                                                        </div>
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
    removeCaseComponent: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default ProcedureCasesSection;
