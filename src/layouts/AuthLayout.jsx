import React from 'react'
import { Outlet } from 'react-router-dom'
import { useAuthRedirect } from '../hooks/useAuthRedirect'

export default function AuthLayout() {
    useAuthRedirect();

    return (
        <div className="auth-layout">
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Outlet />
            </div>
        </div>
    )
}