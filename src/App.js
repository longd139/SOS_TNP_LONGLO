import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ReportDetail from './pages/Reports/ReportDetail';
import ReportList from './pages/Reports/ReportList';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Auth/Login';
import ProceduresManager from './pages/Procedures/ProceduresManager';
import NewsManager from './pages/News/NewsManager';

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
            <Route path="/reports" element={<ReportList />} />
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
