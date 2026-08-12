import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ArrowRight, Book, Briefcase, Calendar3, ChatDots, FileText, Newspaper, Telephone } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { emergencyContact, heroBanners, homeFeatures, importantNotices, procedures, news, contactInfo } from '../data/citizenMockDb';
import { ProcedureCard, ProcessSteps, QuickSearch, TrustNote } from '../components/CitizenPrimitives';
import useScrollReveal from '../hooks/useScrollReveal';

export default function CitizenHomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const activeBanner = heroBanners[activeIndex];

  useScrollReveal();

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % heroBanners.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return <>
    {/* Hero Carousel */}
    <section className={`citizen-hero citizen-hero-${activeBanner.id}`} style={{ background: `linear-gradient(170deg, rgba(10,22,48,.90) 0%, rgba(15,40,70,.72) 38%, rgba(10,30,56,.90) 100%), url(${process.env.PUBLIC_URL}/1.jpg) center/cover no-repeat` }} aria-roledescription="carousel" aria-label="Thông tin nổi bật">
      <div className="citizen-container citizen-hero-grid">
        <div className="citizen-hero-copy" key={activeBanner.id}>
          <div className="hero-accent-line" />
          <p className="citizen-eyebrow citizen-eyebrow-light">
            <span className="hero-eyebrow-dot" /> {activeBanner.eyebrow}
          </p>
          <h1>
            {activeBanner.id === 'ket-noi' && <><em>Kết nối</em> người dân<br />với chính quyền <em>địa phương</em></>}
            {activeBanner.id === 'phan-anh' && <>Mỗi phản ánh đều được<br /><em>tiếp nhận minh bạch</em></>}
            {activeBanner.id === 'thu-tuc' && <>Chủ động thực hiện<br /><em>thủ tục hành chính</em></>}
          </h1>
          <p className="hero-desc">{activeBanner.description}</p>
          <div className="citizen-hero-actions">
            <Button as={Link} to="/cong-dong/tra-cuu" variant="light" className="d-inline-flex align-items-center gap-2">
              Gửi phản ánh <ArrowRight size={17} />
            </Button>
            <Button as={Link} to="/cong-dong/thu-tuc" variant="outline-light" className="d-inline-flex align-items-center gap-2">
              Xem thủ tục hành chính
            </Button>
          </div>
          <TrustNote />
        </div>
      </div>
      <div className="citizen-container hero-indicators">
        {heroBanners.map((banner, index) => <button key={banner.id} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Xem banner ${index + 1}`} />)}
      </div>
    </section>

    {/* Quick Search */}
    <section className="citizen-quick-search reveal">
      <div className="citizen-container">
        <div className="quick-search-label"><span>Tìm kiếm nhanh</span><small>Tra cứu thông tin bạn cần chỉ trong vài giây</small></div>
        <QuickSearch onSubmit={(value) => value && navigate(`/cong-dong/thu-tuc?search=${encodeURIComponent(value)}`)} />
      </div>
    </section>

    {/* News */}
    <section className="citizen-section reveal">
      <div className="citizen-container">
        <div className="lib-section-head">
          <div>
            <span className="lib-section-tag">Tin tức & Sự kiện</span>
            <h2 className="lib-section-title">Thông tin mới nhất từ địa phương</h2>
            <p className="lib-section-desc">Cập nhật các hoạt động, thông báo và sự kiện đang diễn ra trên địa bàn phường.</p>
          </div>
          <Link to="/cong-dong/tin-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>
        </div>
        <div className="home-news-grid">
          {news.slice(0, 6).map((item) => {
            const nc = { 'Thông báo': { bg: '#EEF2FF', color: '#818CF8' }, 'Đời sống': { bg: '#ECFDF5', color: '#6EE7B7' }, 'Cải cách hành chính': { bg: '#FFF7ED', color: '#FDBA74' } }[item.category] || { bg: '#F8FAFC', color: '#94A3B8' };
            return (
            <Link key={item.id} to={`/cong-dong/tin-tuc/${item.id}`} className="home-news-card">
              <div className="hn-card-img">
                <img src={item.image} alt={item.title} loading="lazy" />
                <span className="hn-card-badge" style={{background:nc.bg,color:nc.color}}>{item.category}</span>
              </div>
              <div className="hn-card-body">
                <div className="hn-card-meta">
                  <span>{item.category}</span>
                  <time>{item.date}</time>
                </div>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </div>
            </Link>
          );
          })}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="citizen-section reveal">
      <div className="citizen-container">
        <div className="lib-section-head">
          <div>
            <span className="lib-section-tag">Chức năng chính</span>
            <h2 className="lib-section-title">Bạn cần làm gì hôm nay?</h2>
            <p className="lib-section-desc">Chọn một chức năng bên dưới để bắt đầu — mọi thứ đều được thiết kế đơn giản, dễ hiểu.</p>
          </div>
        </div>
        <div className="citizen-mobile-feature-grid-v2">{homeFeatures.map((feature, index) => <MobileFeature key={feature.label} feature={feature} index={index} />)}</div>
      </div>
    </section>

    {/* Important Notices */}
    <section className="citizen-section citizen-section-soft reveal">
      <div className="citizen-container">
        <div className="lib-section-head">
          <div>
            <span className="lib-section-tag" style={{ background: '#FFEBEE', color: '#E53935' }}>Quan trọng</span>
            <h2 className="lib-section-title">Thông báo & Khẩn cấp</h2>
            <p className="lib-section-desc">Những thông tin cần thiết được cập nhật thường xuyên từ chính quyền địa phương.</p>
          </div>
          <Link to="/cong-dong/tin-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>
        </div>
        <div className="citizen-notice-layout">
          <div className="citizen-notice-list">
            {importantNotices.map((notice) => (
              <Link key={notice.id} to={`/cong-dong/tin-tuc/${notice.id}`} className="notice-card-v2">
                <div className="notice-card-left">
                  <span className={`notice-icon-badge ${notice.type === 'Quan trọng' ? 'is-urgent' : ''}`}>
                    {notice.type === 'Quan trọng' ? '!' : 'i'}
                  </span>
                </div>
                <div className="notice-card-body">
                  <div className="notice-card-top">
                    <span className={`notice-type-tag ${notice.type === 'Quan trọng' ? 'is-urgent' : ''}`}>{notice.type}</span>
                    {notice.isNew && <span className="notice-type-tag is-new">Mới</span>}
                    <time>{notice.date}</time>
                  </div>
                  <strong>{notice.title}</strong>
                </div>
                <ArrowRight size={16} className="notice-card-arrow" />
              </Link>
            ))}
          </div>
          <aside className="citizen-emergency-card">
            <div className="emergency-top">
              <div className="emergency-icon-ring">
                <Telephone size={24} />
              </div>
              <div>
                <p className="emergency-label">Hỗ trợ 24/7</p>
                <h2>{emergencyContact.title}</h2>
              </div>
            </div>
            <p className="emergency-desc">{emergencyContact.subtitle}</p>
            <div className="emergency-actions">
              <Button as="a" href={`tel:${contactInfo.phone}`} variant="danger" className="d-inline-flex align-items-center gap-2">
                <Telephone size={15} /> Gọi ngay: {contactInfo.phone}
              </Button>
              <Button as={Link} to="/cong-dong/tra-cuu" variant="light" className="d-inline-flex align-items-center gap-2">
                Gửi phản ánh <ArrowRight size={15} />
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>

    {/* Featured Procedures */}
    <section className="citizen-section citizen-section-soft reveal">
      <div className="citizen-container">
        <div className="lib-section-head">
          <div>
            <span className="lib-section-tag">Thủ tục hành chính</span>
            <h2 className="lib-section-title">Bắt đầu hồ sơ của bạn</h2>
            <p className="lib-section-desc">Chọn thủ tục bên dưới để xem hướng dẫn chi tiết và chuẩn bị đầy đủ giấy tờ cần thiết.</p>
          </div>
          <Link to="/cong-dong/thu-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>
        </div>
        <div className="procedure-grid">{procedures.filter((item) => item.featured).slice(0, 3).map((item) => <ProcedureCard key={item.id} procedure={item} />)}</div>
      </div>
    </section>

    {/* Process Steps */}
    <section className="citizen-section citizen-process-section reveal">
      <div className="citizen-container">
        <div className="lib-section-head">
          <div>
            <span className="lib-section-tag">Quy trình</span>
            <h2 className="lib-section-title">Mỗi phản ánh đều được lắng nghe</h2>
            <p className="lib-section-desc">Từ lúc gửi thông tin đến khi hoàn tất, bạn luôn biết phản ánh của mình đang ở đâu.</p>
          </div>
        </div>
        <ProcessSteps />
      </div>
    </section>
  </>;
}

const mobileIcons = {
  FileText,
  Newspaper,
  MessageSquare: ChatDots,
  Phone: Telephone,
  BriefcaseBusiness: Briefcase,
  CalendarDays: Calendar3,
  BookOpen: Book,
};
function MobileFeature({ feature, index }) {
  const Icon = mobileIcons[feature.icon] || FileText;
  const tones = {
    blue:   { bg: '#EFF6FF', iconBg: '#2563EB', accent: '#1E40AF' },
    green:  { bg: '#F0FDF4', iconBg: '#16A34A', accent: '#15803D' },
    orange: { bg: '#FFF7ED', iconBg: '#EA580C', accent: '#C2410C' },
    purple: { bg: '#FAFAFE', iconBg: '#7C3AED', accent: '#5B21B6' },
  };
  const t = tones[feature.tone] || tones.blue;
  const isFirst = index === 0;
  const isLast = index === 6;
  const isHero = isFirst || isLast;
  return (
    <Link to={feature.to} className={`citizen-mobile-feature-v2 ${isHero ? 'feature-hero' : ''}`}
      style={isHero ? {} : { '--feat-bg': t.bg, '--feat-icon': t.iconBg, '--feat-accent': t.accent }}>
      <span className="feature-number-badge">{String(index + 1).padStart(2, '0')}</span>
      <span className="citizen-mobile-feature-icon-v2" style={{ color: '#fff', background: isHero && isLast ? '#16A34A' : t.iconBg }}>
        <Icon size={isHero ? 18 : 16} />
      </span>
      <strong>{feature.label}</strong>
      <small>{feature.description}</small>
      <span className="feature-action">Truy cập ngay →</span>
    </Link>
  );
}
