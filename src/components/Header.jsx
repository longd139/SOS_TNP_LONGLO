import React from 'react';
import { Bell } from 'lucide-react';

export default function Header({ title = "Hệ thống quản trị" }) {
    return (
        <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 px-6 py-4 z-50">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                3
                            </span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">TV</span>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-700">Quản trị viên</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
