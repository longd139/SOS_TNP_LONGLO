import React from 'react';
import { Menu } from 'lucide-react';
import PropTypes from 'prop-types';
import UserProfileDropdown from '../admin/UserProfileDropdown';

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
                    <UserProfileDropdown />
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
