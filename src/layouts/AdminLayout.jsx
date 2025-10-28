import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
    return (
        <div className="h-screen admin-layout-scroll">
            <div className="min-h-screen flex min-w-0">
                <div className="w-64 flex-shrink-0 sticky top-0 h-screen">
                    <Sidebar />
                </div>

                <div className="flex-1 flex flex-col min-h-screen min-w-0">
                    <div className="sticky top-0 z-50">
                        <Header />
                    </div>

                    <main className="flex-1 bg-gray-50 min-w-0">
                        <div className="p-6 min-w-0">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;