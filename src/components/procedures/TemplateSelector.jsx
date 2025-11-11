import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { handleDropdownKeyDown } from '../../utils/keyboardNavigation';

const TemplateSelector = ({ 
    value, 
    onChange, 
    templates, 
    error,
    excludeIds = [], 
    placeholder = "-- Chọn biểu mẫu --" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const selectedTemplate = templates.find(t => t.id === value);

    const filteredTemplates = templates.filter(template => {
        const isCurrentSelection = template.id === value;
        const isExcluded = excludeIds.includes(template.id);
        
        if (!isCurrentSelection && isExcluded) return false;
        
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (template.maMauDon && template.maMauDon.toLowerCase().includes(searchLower)) ||
            (template.tenMauDon && template.tenMauDon.toLowerCase().includes(searchLower))
        );
    });

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    const getDisplayText = () => {
        if (!selectedTemplate) return '';
        const prefix = selectedTemplate.maMauDon ? `[${selectedTemplate.maMauDon}] ` : '';
        return prefix + truncateText(selectedTemplate.tenMauDon, 50);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = useCallback((e) => {
        handleDropdownKeyDown(e, {
            isOpen,
            highlightedIndex,
            items: filteredTemplates,
            setIsOpen,
            setHighlightedIndex,
            onSelect: handleSelect,
            onClose: () => {
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        });
    }, [isOpen, highlightedIndex, filteredTemplates]);

    const handleSelect = (template) => {
        onChange(template.id);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };
    const handleClear = (e) => {
        e.stopPropagation();
        onChange('');
        setSearchTerm('');
    };

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 bg-gray-200 bg-gray-200 py-2 pr-8 text-sm border rounded-lg bg-white cursor-pointer ${
                    error 
                        ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500' 
                        : 'border-gray-300 focus-within:border-blue-500 hover:border-gray-400'
                } focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50 transition-colors`}
                title={selectedTemplate?.tenMauDon || ''}
            >
                {selectedTemplate ? (
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-900 truncate flex-1 min-w-0">{getDisplayText()}</span>
                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </div>

            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <polyline points="6 9 12 15 18 9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setHighlightedIndex(-1);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Tìm kiếm biểu mẫu..."
                            className="w-full bg-gray-200 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="overflow-y-auto max-h-48">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map((template, index) => {
                                const displayText = template.maMauDon 
                                    ? `[${template.maMauDon}] ${truncateText(template.tenMauDon, 50)}`
                                    : truncateText(template.tenMauDon, 50);

                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => handleSelect(template)}
                                        onMouseEnter={() => setHighlightedIndex(index)}
                                        className={`px-3 py-2 text-sm cursor-pointer border-r-4 transition-colors ${
                                            highlightedIndex === index || value === template.id
                                                ? 'bg-blue-50 border-blue-500 text-blue-900'
                                                : 'border-transparent hover:bg-gray-50'
                                        }`}
                                        title={template.tenMauDon}
                                    >
                                        {displayText}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-sm text-gray-500 text-center">
                                Không tìm thấy biểu mẫu
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateSelector;
