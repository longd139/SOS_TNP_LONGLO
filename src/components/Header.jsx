import React from 'react';
import { Bell, Menu } from 'lucide-react';
import PropTypes from 'prop-types';

export default function Header({ title = "Hệ thống quản trị", onMobileMenuToggle, isMobileMenuOpen }) {
    return (
        <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 px-3 md:px-4 py-3 z-50">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMobileMenuToggle}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    <h1 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h1>
                </div>

                <div className="flex items-center space-x-2 md:space-x-4">

                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 h-8 md:w-9 md:h-9 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">TV</span>
                        </div>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-700">Quản trị viên</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

Header.propTypes = {
    title: PropTypes.string,
    onMobileMenuToggle: PropTypes.func,
    isMobileMenuOpen: PropTypes.bool
};
