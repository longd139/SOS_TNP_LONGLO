import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="w-64 relative">
                <Sidebar />
            </div>

            <div className="flex-1 flex flex-col h-screen">
                <Header />

                <main className="flex-1 overflow-y-auto bg-gray-50 main-content-scroll">
                    <div className="p-6 h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;