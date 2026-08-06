import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Button, Card, Col, Row, Spinner } from 'react-bootstrap';
import { ArrowRight, CheckCircle, Clock, FileText, Search, Send, ShieldCheck, Stars } from 'react-bootstrap-icons';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <Row className="align-items-end mb-4">
      <Col>
        {eyebrow && <p className="citizen-eyebrow">{eyebrow}</p>}
        <h2 className="citizen-section-heading-title">{title}</h2>
        {description && <p className="citizen-section-heading-desc">{description}</p>}
      </Col>
      {action && <Col xs="auto">{action}</Col>}
    </Row>
  );
}

export function SearchBox({ value, onChange, onSubmit, placeholder = 'Tìm kiếm thông tin...' }) {
  return (
    <form className="lib-search-bar" onSubmit={onSubmit} role="search">
      <Search size={20} className="lib-search-bar-icon" />
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="lib-search-bar-input"
      />
      <button type="submit" className="lib-search-bar-btn">
        <Search size={18} /> Tìm kiếm
      </button>
    </form>
  );
}

export function StatusBadge({ children, tone = 'neutral' }) {
  const bgMap = { info: 'primary', success: 'success', neutral: 'secondary', warning: 'warning', danger: 'danger' };
  return (
    <Badge bg={bgMap[tone] || 'secondary'} className="citizen-status" pill>
      {children}
    </Badge>
  );
}

export function EmptyState({ title = 'Chưa có dữ liệu', description = 'Bạn thử thay đổi từ khóa hoặc bộ lọc nhé.' }) {
  return (
    <Alert variant="light" className="citizen-empty text-center">
      <FileText size={34} className="text-muted mb-2" />
      <h3 className="h5">{title}</h3>
      <p className="text-muted mb-0">{description}</p>
    </Alert>
  );
}

export function LoadingState() {
  return (
    <div className="citizen-loading text-center py-4" aria-label="Đang tải">
      <Spinner animation="border" variant="primary" />
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <Alert variant="warning" className="citizen-empty citizen-error text-center">
      <ShieldCheck size={34} className="mb-2" />
      <h3 className="h5">Không thể tải thông tin</h3>
      <p className="text-muted mb-0">Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút.</p>
      {onRetry && <Button variant="outline-primary" size="sm" className="mt-3" onClick={onRetry}>Thử lại</Button>}
    </Alert>
  );
}

export function ProcedureCard({ procedure }) {
  return (
    <Card as={Link} to={`/cong-dong/thu-tuc/${procedure.id}`} className="citizen-card text-decoration-none text-dark h-100">
      <Card.Body className="d-flex flex-column">
        <div className="procedure-card-icon mb-3">
          <FileText size={22} />
        </div>
        <span className="citizen-card-kicker">{procedure.category}</span>
        <h3 className="h6 mt-2 mb-2">{procedure.title}</h3>
        <p className="text-muted small mb-0">{procedure.summary}</p>
        <div className="procedure-card-meta mt-auto pt-3">
          <span className="procedure-card-meta-item"><Clock size={14} /> {procedure.duration}</span>
          <span className="procedure-card-meta-item">{procedure.fee}</span>
        </div>
      </Card.Body>
    </Card>
  );
}

export function NewsCard({ item, featured = false }) {
  return (
    <Card as={Link} to={`/cong-dong/tin-tuc/${item.id}`} className={`citizen-news-card text-decoration-none text-dark h-100 ${featured ? 'citizen-news-card-featured' : ''}`}>
      <Card.Img variant="top" src={item.image} alt="" loading="lazy" />
      <Card.Body className="d-flex flex-column">
        <div className="citizen-news-meta mb-2">
          <span>{item.category}</span>
          <time>{item.date}</time>
        </div>
        <h3 className="h6">{item.title}</h3>
        <p className="text-muted small">{item.excerpt}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="small text-muted">⏱ 3 phút đọc</span>
          <span className="citizen-text-link">Đọc tiếp <ArrowRight size={14} /></span>
        </div>
      </Card.Body>
    </Card>
  );
}

export function ProcessSteps() {
  const steps = [
    { icon: Send, color: '#2563EB', bg: '#EFF6FF', title: 'Gửi phản ánh', text: 'Mô tả sự việc, chọn vị trí và gửi thông tin đến chính quyền.' },
    { icon: ShieldCheck, color: '#059669', bg: '#ECFDF5', title: 'Tiếp nhận & phân công', text: 'Cơ quan chức năng kiểm tra và chuyển đến đúng đơn vị xử lý.' },
    { icon: Clock, color: '#EA580C', bg: '#FFF7ED', title: 'Theo dõi tiến độ', text: 'Cập nhật trạng thái minh bạch theo từng bước xử lý.' },
    { icon: CheckCircle, color: '#7C3AED', bg: '#F5F3FF', title: 'Hoàn tất & đánh giá', text: 'Nhận kết quả và đánh giá chất lượng dịch vụ.' },
  ];
  return (
    <div className="process-pipeline">
      <div className="process-pipeline-track">
        {steps.map(({ icon: Icon, title, text, color, bg }, index) => (
          <div className="process-pipeline-step" key={title} style={{ '--step-color': color, '--step-bg': bg }}>
            <div className="process-pipeline-node" style={{ background: color }}>
              <Icon size={20} color="#fff" />
            </div>
            <div className="process-pipeline-card">
              <span className="process-pipeline-num" style={{ color }}>{String(index + 1).padStart(2, '0')}</span>
              <h3 className="h6 fw-bold mb-1">{title}</h3>
              <p className="text-muted small mb-0">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageHero({ eyebrow = 'Dịch vụ công trực tuyến', title, description, children }) {
  return (
    <section className="citizen-page-hero">
      <div className="citizen-container">
        <p className="citizen-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p className="citizen-page-hero-description">{description}</p>}
        {children}
      </div>
    </section>
  );
}

export function QuickSearch({ onSubmit }) {
  const [value, setValue] = React.useState('');
  return <SearchBox value={value} onChange={(event) => setValue(event.target.value)} onSubmit={(event) => { event.preventDefault(); onSubmit?.(value); }} placeholder="Bạn cần tìm thủ tục, tin tức hay phản ánh?" />;
}

export function TrustNote() {
  return (
    <div className="citizen-trust-note d-inline-flex align-items-center gap-2">
      <Stars size={18} />
      <span>Thông tin được cập nhật từ cơ quan hành chính địa phương</span>
    </div>
  );
}
