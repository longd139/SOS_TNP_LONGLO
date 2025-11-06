import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X, PlusCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AREAS_API } from '../../apis/areas';
import { handleSearchDropdownKeyDown } from '../../utils/keyboardNavigation';
import { createArea, fetchAreas } from '../../features/areas/areasThunks';
import { selectAreas } from '../../features/areas/areasSelectors';
import { showToast } from '../../utils/toastNotification';
import AreaFormModal from '../areas/AreaFormModal';

const ProcedureAreasSelector = ({ formData, errors, areas: propAreas, toggleArea, updateField }) => {
    const dispatch = useDispatch();
    const reduxAreas = useSelector(selectAreas);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
    const containerRef = useRef(null);

    const areas = reduxAreas.length > 0 ? reduxAreas : propAreas;

    const selectedAreas = areas.filter(area => 
        formData.danhSachLinhVucIds.includes(area.id)
    );

    useEffect(() => {
        if (reduxAreas.length === 0) {
            dispatch(fetchAreas({ isActive: true }));
        }
    }, [dispatch, reduxAreas.length]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await AREAS_API.getAreas(true, search || '');
                const filtered = results.filter(
                    area => !formData.danhSachLinhVucIds.includes(area.id)
                );
                setSearchResults(filtered);
            } catch (error) {
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, search ? 300 : 0);

        return () => clearTimeout(timer);
    }, [search, formData.danhSachLinhVucIds]);

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
        setHighlightedIndex(-1);
    }, [searchResults]);

    const handleSelect = (area) => {
        toggleArea(area.id);
        setSearch('');
        setSearchResults([]);
        setShowDropdown(false);
    };

    const handleRemove = (areaId) => {
        toggleArea(areaId);
    };

    const handleKeyDown = (e) => {
        handleSearchDropdownKeyDown(e, {
            items: searchResults,
            highlightedIndex,
            showDropdown,
            setHighlightedIndex,
            setShowDropdown,
            onSelect: handleSelect
        });
    };

    const handleCreateArea = async (areaData) => {
        try {
            const result = await dispatch(createArea(areaData)).unwrap();
            showToast.success('Tạo lĩnh vực thành công!');
            
            await dispatch(fetchAreas({ isActive: true }));
            
            if (result && result.id) {
                toggleArea(result.id);
            }
            
            setIsAreaModalOpen(false);
        } catch (error) {
            showToast.error(error.message || 'Tạo lĩnh vực thất bại!');
            throw error;
        }
    };

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                    Lĩnh vực
                </label>

                <div className="flex gap-2">
                    <div ref={containerRef} className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => { 
                                setShowDropdown(true);
                                if (!search && searchResults.length === 0) {
                                    setSearch('');
                                }
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Tìm kiếm lĩnh vực..."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.danhSachLinhVucIds ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />

                        {showDropdown && (
                            <div className="absolute z-40 left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {loading && (
                            <div className="p-2 text-sm text-gray-500">Đang tìm...</div>
                        )}
                        {!loading && searchResults.length === 0 && (
                            <div className="p-2 text-sm text-gray-500">Không tìm thấy kết quả</div>
                        )}
                        {!loading && searchResults.map((area, idx) => (
                            <button
                                key={area.id}
                                type="button"
                                onClick={() => handleSelect(area)}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                                className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors ${
                                    highlightedIndex === idx ? 'bg-blue-100' : ''
                                }`}
                            >
                                <div className="font-medium text-sm truncate">{area.ten_linh_vuc}</div>
                            </button>
                        ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsAreaModalOpen(true)}
                        className="flex-shrink-0 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Tạo lĩnh vực mới"
                    >
                        <PlusCircle className="w-5 h-5" />
                    </button>
                </div>

                {errors.danhSachLinhVucIds && (
                    <p className="mt-1 text-sm text-red-600">{errors.danhSachLinhVucIds}</p>
                )}

            {selectedAreas.length > 0 && (
                <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {selectedAreas.map((area) => (
                            <span
                                key={area.id}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                                <span>{area.ten_linh_vuc}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(area.id)}
                                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                                    title="Xóa"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-300">
                        <p className="text-xs text-gray-600">
                            Đã chọn: <span className="font-medium">{selectedAreas.length}</span> lĩnh vực
                        </p>
                    </div>
                </div>
            )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                    Số quyết định
                </label>
                <input
                    type="text"
                    value={formData.soQuyetDinh}
                    onChange={(e) => updateField('soQuyetDinh', e.target.value)}
                    placeholder="Nhập số quyết định..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.soQuyetDinh ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.soQuyetDinh && (
                    <p className="mt-1 text-sm text-red-600">{errors.soQuyetDinh}</p>
                )}
            </div>

            <AreaFormModal
                isOpen={isAreaModalOpen}
                onClose={() => setIsAreaModalOpen(false)}
                onSubmit={handleCreateArea}
            />
        </div>
    );
};

ProcedureAreasSelector.propTypes = {
    formData: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    areas: PropTypes.array.isRequired,
    toggleArea: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired
};

export default ProcedureAreasSelector;
