
export const handleDropdownKeyDown = (e, options) => {
    const {
        isOpen,
        highlightedIndex,
        items = [],
        setIsOpen,
        setHighlightedIndex,
        onSelect,
        onClose
    } = options;

    if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            return true;
        }
        return false;
    }

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev < items.length - 1 ? prev + 1 : prev
            );
            return true;

        case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
            return true;

        case 'Enter':
            e.preventDefault();
            if (highlightedIndex >= 0 && items[highlightedIndex]) {
                onSelect(items[highlightedIndex]);
            }
            return true;

        case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            if (onClose) {
                onClose();
            }
            return true;

        default:
            return false;
    }
};

export const handleSearchDropdownKeyDown = (e, options) => {
    const {
        items = [],
        highlightedIndex,
        showDropdown,
        setHighlightedIndex,
        setShowDropdown,
        onSelect
    } = options;

    if (!items || items.length === 0) return false;

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            if (!showDropdown) {
                setShowDropdown(true);
            }
            setHighlightedIndex(prev => 
                prev === -1 ? 0 : Math.min(prev + 1, items.length - 1)
            );
            return true;

        case 'ArrowUp':
            e.preventDefault();
            setHighlightedIndex(prev => 
                prev <= 0 ? Math.max(items.length - 1, 0) : prev - 1
            );
            return true;

        case 'Enter':
            if (showDropdown && highlightedIndex >= 0) {
                e.preventDefault();
                onSelect(items[highlightedIndex]);
            }
            return true;

        case 'Escape':
            e.preventDefault();
            setShowDropdown(false);
            return true;

        default:
            return false;
    }
};
