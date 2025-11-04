import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="flex h-screen overflow-hidden">
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            <div className={`
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
                fixed md:relative
                z-50 md:z-auto
                transition-transform duration-300 ease-in-out
            `}>
                <Sidebar 
                    collapsed={collapsed} 
                    onToggle={toggleSidebar}
                    onMobileClose={closeMobileMenu}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="sticky top-0 z-30 flex-shrink-0">
                    <Header 
                        onMobileMenuToggle={toggleMobileMenu}
                        isMobileMenuOpen={isMobileMenuOpen}
                    />
                </div>

                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="pt-2 pb-3 px-3 md:pt-3 md:pb-4 md:px-4">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;