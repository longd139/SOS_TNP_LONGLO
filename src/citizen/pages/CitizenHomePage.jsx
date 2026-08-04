import React, { useEffect, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, ChevronLeft, ChevronRight, FileImage, FileText, MessageSquare, Newspaper, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { emergencyContact, heroBanners, homeFeatures, importantNotices, procedures, news, contactInfo } from '../data/citizenMockDb';
import { NewsCard, ProcedureCard, ProcessSteps, QuickSearch, SectionHeading, TrustNote } from '../components/CitizenPrimitives';

export default function CitizenHomePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const activeBanner = heroBanners[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % heroBanners.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    heroBanners.forEach((banner) => {
      const image = new Image();
      image.src = banner.image;
    });
  }, []);

  const moveBanner = (direction) => setActiveIndex((current) => (current + direction + heroBanners.length) % heroBanners.length);

  return <>
    <section className={`citizen-hero citizen-hero-${activeBanner.id}`} aria-roledescription="carousel" aria-label="Thông tin nổi bật">
      <div className="citizen-container citizen-hero-grid">
        <div className="citizen-hero-copy" key={activeBanner.id}>
          <p className="citizen-eyebrow citizen-eyebrow-light">{activeBanner.eyebrow}</p>
          <h1>{activeBanner.title}</h1>
          <p>{activeBanner.description}</p>
          <div className="citizen-hero-actions"><Link to="/cong-dong/gui-phan-anh" className="citizen-button citizen-button-white">Gửi phản ánh <ArrowRight size={17} /></Link><Link to="/cong-dong/thu-tuc" className="citizen-button citizen-button-ghost">Xem thủ tục hành chính</Link></div>
          <TrustNote />
        </div>
        <div className="citizen-hero-visual">
          <div className="hero-banner-visual-content" key={activeBanner.id}>
            <img src={activeBanner.image} alt="Hình ảnh minh họa cho dịch vụ công trực tuyến" className="hero-service-image" />
            <div className="hero-metric-card"><span>{activeBanner.metricLabel}</span><strong>{activeBanner.metric}</strong></div>
          </div>
          <div className="hero-controls"><button onClick={() => moveBanner(-1)} aria-label="Banner trước"><ChevronLeft size={18} /></button><span>{activeIndex + 1} / {heroBanners.length}</span><button onClick={() => moveBanner(1)} aria-label="Banner tiếp theo"><ChevronRight size={18} /></button></div>
        </div>
      </div>
      <div className="citizen-container hero-indicators">{heroBanners.map((banner, index) => <button key={banner.id} className={index === activeIndex ? 'active' : ''} onClick={() => setActiveIndex(index)} aria-label={`Xem banner ${index + 1}`} />)}</div>
    </section>
    <section className="citizen-quick-search"><div className="citizen-container"><div className="quick-search-label"><span>Tìm kiếm nhanh</span><small>Tra cứu thông tin bạn cần chỉ trong vài giây</small></div><QuickSearch onSubmit={(value) => value && navigate(`/cong-dong/thu-tuc?search=${encodeURIComponent(value)}`)} /></div></section>
    <section className="citizen-section citizen-container"><SectionHeading eyebrow="Bạn cần làm gì?" title="Chức năng chính" description="Các tiện ích quen thuộc từ ứng dụng được mở rộng để dễ sử dụng trên web." /><div className="citizen-mobile-feature-grid">{homeFeatures.map((feature) => <MobileFeature key={feature.label} feature={feature} />)}</div></section>
    <section className="citizen-section citizen-section-soft"><div className="citizen-container citizen-notice-layout"><div><SectionHeading eyebrow="Thông báo quan trọng" title="Đừng bỏ lỡ thông tin mới" action={<Link to="/cong-dong/tin-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>} /><div className="citizen-notice-list">{importantNotices.map((notice) => <Link key={notice.id} to={`/cong-dong/tin-tuc/${notice.id}`} className="citizen-notice-card"><div><span className={`citizen-notice-tag ${notice.type === 'Quan trọng' ? 'is-important' : ''}`}>{notice.type}</span>{notice.isNew && <span className="citizen-notice-tag is-new">Mới</span>}</div><strong>{notice.title}</strong><time>{notice.date}</time></Link>)}</div></div><aside className="citizen-emergency-card"><Phone size={28} /><h2>{emergencyContact.title}</h2><p>{emergencyContact.subtitle}</p><div><a href={`tel:${contactInfo.phone}`} className="citizen-button citizen-button-danger">{emergencyContact.phoneLabel}</a><Link to="/cong-dong/gui-phan-anh" className="citizen-button citizen-button-white">{emergencyContact.messageLabel}</Link></div></aside></div></section>
    <section className="citizen-section citizen-section-soft"><div className="citizen-container"><SectionHeading eyebrow="Thủ tục nổi bật" title="Bắt đầu hồ sơ của bạn" action={<Link to="/cong-dong/thu-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>} /><div className="procedure-grid">{procedures.filter((item) => item.featured).slice(0, 3).map((item) => <ProcedureCard key={item.id} procedure={item} />)}</div></div></section>
    <section className="citizen-section citizen-container"><SectionHeading eyebrow="Tin tức và thông báo" title="Thông tin mới nhất" action={<Link to="/cong-dong/tin-tuc" className="citizen-text-link">Xem tất cả <ArrowRight size={16} /></Link>} /><div className="news-grid">{news.slice(0, 3).map((item, index) => <NewsCard key={item.id} item={item} featured={index === 0} />)}</div></section>
    <section className="citizen-section citizen-process-section"><div className="citizen-container"><SectionHeading eyebrow="Quy trình xử lý" title="Mỗi phản ánh đều được lắng nghe" description="Từ lúc gửi thông tin đến khi hoàn tất, bạn luôn biết phản ánh của mình đang ở đâu." /><ProcessSteps /></div></section>
  </>;
}

const mobileIcons = { FileText, Newspaper, MessageSquare, Phone, BriefcaseBusiness, CalendarDays };
function MobileFeature({ feature }) { const Icon = mobileIcons[feature.icon] || FileImage; return <Link to={feature.to} className="citizen-mobile-feature"><span className="citizen-mobile-feature-icon"><Icon size={26} /></span><strong>{feature.label}</strong><small>{feature.description}</small></Link>; }
