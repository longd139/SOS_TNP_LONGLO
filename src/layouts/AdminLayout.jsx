import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="sticky top-0 z-50 flex-shrink-0">
                    <Header />
                </div>

                <main className="flex-1 bg-gray-50 overflow-auto">
                    <div className="p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;