import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar(){
  const navClass = ({ isActive }) => isActive ? 'navlink active' : 'navlink';
  return (
    <aside className="sidebar" role="navigation">
      <div className="brand">ADMIN</div>
      <NavLink to="/" end className={navClass}>Dashboard</NavLink>
      <NavLink to="/reports" className={navClass}>Xem danh sách phản ánh</NavLink>
      <NavLink to="/news" className={navClass}>Quản lý tin tức</NavLink>
      <NavLink to="/procedures" className={navClass}>Quản lý thủ tục</NavLink>
      <NavLink to="/login" className={navClass}>Đăng xuất</NavLink>
      <div style={{marginTop:'auto', fontSize:13}} className="footer-note">Phiên bản demo - dữ liệu mẫu</div>
    </aside>
  );
}
