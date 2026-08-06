import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { ArrowUpRight, BoxArrowUpRight, Envelope, GeoAlt, List, Telephone, X } from 'react-bootstrap-icons';
import { citizenNavItems, contactInfo } from './data/citizenMockDb';
import AIChatWidget from './components/AIChatWidget';
import '../styles/citizen.css';

export default function CitizenLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="citizen-app">
      {/* Topbar */}
      <div className="citizen-topbar">
        <Container className="citizen-topbar-inner">
          <span>Ủy ban nhân dân phường Tăng Nhơn Phú</span>
          <a href={`tel:${contactInfo.phone}`} className="text-white fw-semibold d-inline-flex align-items-center gap-2 text-decoration-none">
            <Telephone size={14} /> {contactInfo.phone}
          </a>
        </Container>
      </div>

      {/* Navbar */}
      <Navbar expand="lg" className="citizen-header" sticky="top">
        <Container className="citizen-header-inner">
          <Navbar.Brand as={Link} to="/cong-dong" className="citizen-brand" onClick={closeMenu}>
            <img src={`${process.env.PUBLIC_URL}/5.jpg`} alt="Logo" className="citizen-brand-logo" />
            <span>
              <strong>Cổng thông tin công dân</strong>
              <small>Phường Tăng Nhơn Phú</small>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="citizen-navbar" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </Navbar.Toggle>

          <Navbar.Collapse id="citizen-navbar">
            <Nav className="ms-auto citizen-nav align-items-lg-center gap-1">
              {citizenNavItems.map((item) => (
                <Nav.Link
                  as={NavLink}
                  key={item.to}
                  to={item.to}
                  end={item.to === '/cong-dong'}
                  onClick={closeMenu}
                  className="citizen-nav-link"
                >
                  {item.label}
                </Nav.Link>
              ))}
              <Button
                variant="outline-primary"
                size="sm"
                className="citizen-officer-link ms-lg-2"
                onClick={() => { closeMenu(); navigate('/cong-dong/dang-nhap'); }}
              >
                Đăng nhập người dân <BoxArrowUpRight size={16} />
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main><Outlet /></main>

      {/* Footer */}
      <footer className="citizen-footer">
        <div className="citizen-footer-pattern" />
        <div className="citizen-container">
          <div className="footer-main">
            <div className="footer-brand">
              <Link to="/cong-dong" className="footer-logo">
                <img src={`${process.env.PUBLIC_URL}/5.jpg`} alt="Logo" className="footer-logo-img" />
                <div>
                  <strong>Cổng thông tin công dân</strong>
                  <small>Phường Tăng Nhơn Phú</small>
                </div>
              </Link>
              <p>Kết nối người dân với chính quyền minh bạch, gần gũi và hiệu quả.</p>
            </div>

            <div className="footer-links">
              <h3>Liên kết nhanh</h3>
              <Link to="/cong-dong/thu-tuc">Thủ tục hành chính</Link>
              <Link to="/cong-dong/tin-tuc">Tin tức</Link>
              <Link to="/cong-dong/phan-anh">Phản ánh</Link>
              <Link to="/cong-dong/thu-vien-so">Thư viện số</Link>
              <Link to="/cong-dong/lien-he">Liên hệ</Link>
            </div>

            <div className="footer-contact">
              <h3>Liên hệ</h3>
              <a href={`tel:${contactInfo.phone}`} className="footer-contact-item">
                <Telephone size={14} /> {contactInfo.phone}
              </a>
              <a href={`mailto:${contactInfo.email}`} className="footer-contact-item">
                <Envelope size={14} /> {contactInfo.email}
              </a>
              <span className="footer-contact-item">
                <GeoAlt size={14} /> {contactInfo.hours}
              </span>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 UBND phường Tăng Nhơn Phú</span>
            <span>Phục vụ người dân mỗi ngày</span>
          </div>
        </div>
      </footer>

      <AIChatWidget />
    </div>
  );
}
