import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { GOVERNMENT_API } from '../../apis/government';
import GovernmentFormModal from '../government/GovernmentFormModal';
import { PlusCircle } from 'lucide-react';
import { handleSearchDropdownKeyDown } from '../../utils/keyboardNavigation';

const ProcedureBasicInfo = ({ formData, errors, updateField }) => {
    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!search) {
            setResults([]);
            return;
        }

        const t = setTimeout(async () => {
            setLoading(true);
            try {
                const resp = await GOVERNMENT_API.getGovernment({ search, isRemoved: false, size: 10 });
                setResults(resp.content || []);
                setShowDropdown(true);
            } catch (err) {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!formData.idCoSoDichVuCong) {
            setSearch('');
            setResults([]);
            setShowDropdown(false);
            if (formData.tenCoSoDichVuCong) {
                updateField('tenCoSoDichVuCong', '');
            }
        }
    }, [formData.idCoSoDichVuCong]);

    useEffect(() => {
        setHighlightedIndex(-1);
    }, [results]);

    const handleSelect = (item) => {
        updateField('idCoSoDichVuCong', item.id || item);
        updateField('tenCoSoDichVuCong', item.ten_co_so || '');
        setSearch(item.ten_co_so || '');
        setShowDropdown(false);
    };

    const handleCreateSuccess = (created) => {
        if (!created) return;
        handleSelect(created);
    };

    const handleKeyDown = (e) => {
        handleSearchDropdownKeyDown(e, {
            items: results,
            highlightedIndex,
            showDropdown,
            setHighlightedIndex,
            setShowDropdown,
            onSelect: handleSelect
        });
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div ref={containerRef} className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Mã CSDVC
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={search || formData.tenCoSoDichVuCong || formData.idCoSoDichVuCong || ''}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setSearch(v);
                                    if (!v) {
                                        updateField('idCoSoDichVuCong', '');
                                        updateField('tenCoSoDichVuCong', '');
                                        setResults([]);
                                        setShowDropdown(false);
                                    } else {
                                        updateField('idCoSoDichVuCong', '');
                                    }
                                }}
                                onFocus={() => { if (results.length) setShowDropdown(true); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Tìm hoặc chọn cơ sở..."
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.idCoSoDichVuCong ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.idCoSoDichVuCong && (
                                <p className="mt-1 text-sm text-red-600">{errors.idCoSoDichVuCong}</p>
                            )}

                            {showDropdown && (results.length > 0 || loading) && (
                                <div className="absolute z-40 left-0 right-[52px] mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {loading && (
                                        <div className="p-2 text-sm text-gray-500">Đang tìm...</div>
                                    )}
                                    {!loading && results.length === 0 && (
                                        <div className="p-2 text-sm text-gray-500">Không tìm thấy kết quả</div>
                                    )}
                                    {!loading && results.map((r, idx) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => handleSelect(r)}
                                            onMouseEnter={() => setHighlightedIndex(idx)}
                                            className={`w-full text-left px-3 py-2 hover:bg-gray-100 ${highlightedIndex === idx ? 'bg-blue-100' : ''}`}
                                        >
                                            <div className="font-medium">{r.ten_co_so}</div>
                                            <div className="text-xs text-gray-500">{r.dia_chi}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setOpenCreate(true)}
                            className="flex-shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                            title="Tạo mới cơ sở dịch vụ công"
                        >
                            <PlusCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Mã thủ tục
                    </label>
                    <input
                        type="text"
                        value={formData.maThuTuc}
                        onChange={(e) => updateField('maThuTuc', e.target.value)}
                        placeholder="Nhập mã thủ tục..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.maThuTuc ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.maThuTuc && (
                        <p className="mt-1 text-sm text-red-600">{errors.maThuTuc}</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Tên thủ tục
                    </label>
                    <input
                        type="text"
                        value={formData.tenThuTuc}
                        onChange={(e) => updateField('tenThuTuc', e.target.value)}
                        placeholder="Nhập tên thủ tục..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tenThuTuc ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.tenThuTuc && (
                        <p className="mt-1 text-sm text-red-600">{errors.tenThuTuc}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                        Đối tượng thực hiện
                    </label>
                    <input
                        type="text"
                        value={formData.doiTuongThucHien}
                        onChange={(e) => updateField('doiTuongThucHien', e.target.value)}
                        placeholder="VD: Cá nhân, Tổ chức..."
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.doiTuongThucHien ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.doiTuongThucHien && (
                        <p className="mt-1 text-sm text-red-600">{errors.doiTuongThucHien}</p>
                    )}
                </div>
            </div>
            <GovernmentFormModal isOpen={openCreate} onClose={() => setOpenCreate(false)} onCreate={handleCreateSuccess} />
        </>
    );
};

ProcedureBasicInfo.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    updateField: PropTypes.func.isRequired
};

export default ProcedureBasicInfo;
