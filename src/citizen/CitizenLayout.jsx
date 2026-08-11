import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Envelope, GeoAlt, List, Telephone, X } from 'react-bootstrap-icons';
import { citizenNavItems, contactInfo } from './data/citizenMockDb';
import AIChatWidget from './components/AIChatWidget';
import '../styles/citizen.css';

function CitizenPageLoader() {
  return (
    <div className="citizen-page-loader">
      <div className="skeleton-container">
        {/* Header skeleton */}
        <div className="skeleton-card">
          <div className="skeleton-line h28 w40" />
          <div className="skeleton-line w60" style={{ marginTop: 14 }} />
        </div>
        {/* Content skeleton */}
        <div className="skeleton-card">
          <div className="skeleton-line h20 w30" />
          <div className="skeleton-line w100" style={{ marginTop: 16 }} />
          <div className="skeleton-line w100" />
          <div className="skeleton-line w80" />
        </div>
        {/* Card skeleton */}
        <div className="skeleton-card">
          <div className="skeleton-line h20 w25" />
          <div className="skeleton-line w100" style={{ marginTop: 16 }} />
          <div className="skeleton-line w60" />
        </div>
      </div>
    </div>
  );
}

function PageTransitionWrapper({ children, locationKey }) {
  return (
    <div key={locationKey}>
      {children}
    </div>
  );
}

export default function CitizenLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updateIndicator = useCallback(() => {
    if (!navRef.current) return;
    const activeLink = navRef.current.querySelector('.citizen-nav-link.active');
    if (activeLink) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        opacity: 1,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateIndicator, 0);
    return () => clearTimeout(timer);
  }, [location, updateIndicator]);

  useEffect(() => {
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="citizen-app">
      {/* Navbar */}
      <Navbar expand="lg" className="citizen-header" sticky="top" expanded={menuOpen} onToggle={setMenuOpen}>
        <Container className="citizen-header-inner">
          <Navbar.Brand as={Link} to="/cong-dong" className="citizen-brand" onClick={closeMenu}>
            <img src={`${process.env.PUBLIC_URL}/5.jpg`} alt="Logo" className="citizen-brand-logo" />
            <span>
              <strong>Cổng thông tin công dân</strong>
              <small>Phường Tăng Nhơn Phú</small>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="citizen-navbar">
            {menuOpen ? <X size={20} /> : <List size={20} />}
          </Navbar.Toggle>

          <Navbar.Collapse id="citizen-navbar">
            <Nav className="ms-auto citizen-nav align-items-lg-center gap-1" ref={navRef}>
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
              <div className="citizen-nav-indicator" style={indicatorStyle} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <main>
        <Suspense fallback={<CitizenPageLoader />}>
          <PageTransitionWrapper locationKey={location.pathname}>
            <Outlet />
          </PageTransitionWrapper>
        </Suspense>
      </main>

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
              <Link to="/cong-dong/gui-phan-anh">Phản ánh</Link>
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
