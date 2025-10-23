import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ReportsList from './pages/ReportsList';
import ReportDetail from './pages/ReportDetail';
import NewsManager from './pages/NewsManager';
import ProceduresManager from './pages/ProceduresManager';
import Login from './pages/Login';

export default function App(){
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Header title="Hệ thống quản trị - Admin" />
        <div className="content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/reports/:id" element={<ReportDetail />} />
            <Route path="/news" element={<NewsManager />} />
            <Route path="/procedures" element={<ProceduresManager />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
