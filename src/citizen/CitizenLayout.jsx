import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { citizenNavItems, contactInfo } from './data/citizenMockDb';
import '../styles/citizen.css';

export default function CitizenLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);
  return (
    <div className="citizen-app">
      <div className="citizen-topbar"><div className="citizen-container citizen-topbar-inner"><span>Ủy ban nhân dân phường Tăng Nhơn Phú</span><a href={`tel:${contactInfo.phone}`}><Phone size={14} /> {contactInfo.phone}</a></div></div>
      <header className="citizen-header">
        <div className="citizen-container citizen-header-inner">
          <Link to="/cong-dong" className="citizen-brand" onClick={closeMenu}><span className="citizen-brand-mark"><ShieldCheck size={25} /></span><span><strong>Cổng thông tin công dân</strong><small>Phường Tăng Nhơn Phú</small></span></Link>
          <button className="citizen-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">{menuOpen ? <X /> : <Menu />}</button>
          <nav className={menuOpen ? 'citizen-nav citizen-nav-open' : 'citizen-nav'}>{citizenNavItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/cong-dong'} onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>)}<button className="citizen-officer-link" onClick={() => navigate('/cong-dong/dang-nhap')}>Đăng nhập người dân <ArrowUpRight size={16} /></button></nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="citizen-footer"><div className="citizen-container citizen-footer-support"><div><p>Cần hỗ trợ?</p><h2>Chúng tôi luôn sẵn sàng lắng nghe</h2><span>Liên hệ Bộ phận Một cửa nếu bạn cần hướng dẫn thêm về dịch vụ công.</span></div><div className="contact-banner-actions"><a href={`tel:${contactInfo.phone}`} className="citizen-button citizen-button-white"><Phone size={18} /> {contactInfo.phone}</a><Link to="/cong-dong/lien-he" className="citizen-button citizen-button-ghost">Thông tin liên hệ</Link></div></div><div className="citizen-container citizen-footer-grid"><div><Link to="/cong-dong" className="citizen-brand citizen-brand-light"><span className="citizen-brand-mark"><ShieldCheck size={25} /></span><span><strong>Cổng thông tin công dân</strong><small>Phường Tăng Nhơn Phú</small></span></Link><p className="citizen-footer-intro">Kết nối người dân với chính quyền minh bạch, gần gũi và hiệu quả.</p></div><div><h3>Liên kết nhanh</h3><Link to="/cong-dong/thu-tuc">Thủ tục hành chính</Link><Link to="/cong-dong/dich-vu-cong">Dịch vụ công</Link><Link to="/cong-dong/lich-tiep-dan">Lịch tiếp dân</Link><Link to="/cong-dong/gui-phan-anh">Gửi phản ánh</Link></div><div><h3>Hỗ trợ người dân</h3><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a><span>{contactInfo.hours}</span></div></div><div className="citizen-container citizen-footer-bottom"><span>© 2026 UBND phường Tăng Nhơn Phú</span><span>Phục vụ người dân mỗi ngày</span></div></footer>
    </div>
  );
}
