import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { AREAS_API } from '../../apis/areas';
import { handleSearchDropdownKeyDown } from '../../utils/keyboardNavigation';

const ProcedureAreasSelector = ({ formData, errors, areas, toggleArea, updateField }) => {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);

    const selectedAreas = areas.filter(area => 
        formData.danhSachLinhVucIds.includes(area.id)
    );

    useEffect(() => {
        if (!search) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await AREAS_API.getAreas(false, search);
                const filtered = results.filter(
                    area => !formData.danhSachLinhVucIds.includes(area.id)
                );
                setSearchResults(filtered);
                setShowDropdown(true);
            } catch (error) {
                console.error('Error searching areas:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

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

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                    Lĩnh vực
                </label>

                <div ref={containerRef} className="relative">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => { 
                        if (searchResults.length) setShowDropdown(true); 
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Tìm kiếm lĩnh vực..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.danhSachLinhVucIds ? 'border-red-500' : 'border-gray-300'
                    }`}
                />

                {showDropdown && (searchResults.length > 0 || loading) && (
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
                                <div className="font-medium text-sm">{area.ten_linh_vuc}</div>
                            </button>
                        ))}
                    </div>
                )}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
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
