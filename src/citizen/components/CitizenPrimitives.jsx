import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock3, FileText, Search, ShieldCheck, Sparkles } from 'lucide-react';

export const cn = (...classes) => classes.filter(Boolean).join(' ');

export function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="citizen-section-heading">
      <div>
        {eyebrow && <p className="citizen-eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SearchBox({ value, onChange, onSubmit, placeholder = 'Tìm kiếm thông tin...' }) {
  return (
    <form className="citizen-search" onSubmit={onSubmit} role="search">
      <Search size={21} aria-hidden="true" />
      <input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} />
      <button type="submit" className="citizen-button citizen-button-primary">Tìm kiếm</button>
    </form>
  );
}

export function StatusBadge({ children, tone = 'neutral' }) {
  return <span className={cn('citizen-status', `citizen-status-${tone}`)}>{children}</span>;
}

export function EmptyState({ title = 'Chưa có dữ liệu', description = 'Bạn thử thay đổi từ khóa hoặc bộ lọc nhé.' }) {
  return <div className="citizen-empty"><FileText size={34} /><h3>{title}</h3><p>{description}</p></div>;
}

export function LoadingState() {
  return <div className="citizen-loading" aria-label="Đang tải"><span /><span /><span /></div>;
}

export function ErrorState({ onRetry }) {
  return <div className="citizen-empty citizen-error"><ShieldCheck size={34} /><h3>Không thể tải thông tin</h3><p>Đã có lỗi xảy ra. Vui lòng thử lại sau ít phút.</p>{onRetry && <button className="citizen-button citizen-button-secondary" onClick={onRetry}>Thử lại</button>}</div>;
}

export function ProcedureCard({ procedure }) {
  return (
    <Link to={`/cong-dong/thu-tuc/${procedure.id}`} className="citizen-card procedure-card">
      <div className="procedure-card-icon"><FileText size={23} /></div>
      <span className="citizen-card-kicker">{procedure.category}</span>
      <h3>{procedure.title}</h3>
      <p>{procedure.summary}</p>
      <div className="procedure-card-meta"><span><Clock3 size={15} /> {procedure.duration}</span><span>{procedure.fee}</span></div>
      <span className="citizen-card-link">Xem chi tiết <ArrowRight size={16} /></span>
    </Link>
  );
}

export function NewsCard({ item, featured = false }) {
  return (
    <Link to={`/cong-dong/tin-tuc/${item.id}`} className={cn('citizen-news-card', featured && 'citizen-news-card-featured')}>
      <img src={item.image} alt="" />
      <div className="citizen-news-content"><div className="citizen-news-meta"><span>{item.category}</span><time>{item.date}</time></div><h3>{item.title}</h3><p>{item.excerpt}</p><span className="citizen-card-link">Đọc tiếp <ArrowRight size={16} /></span></div>
    </Link>
  );
}

export function ProcessSteps() {
  const steps = [{ icon: FileText, title: 'Gửi phản ánh', text: 'Mô tả sự việc, chọn vị trí và gửi thông tin.' }, { icon: ShieldCheck, title: 'Cơ quan tiếp nhận', text: 'Phản ánh được kiểm tra và chuyển đúng đơn vị.' }, { icon: Clock3, title: 'Theo dõi xử lý', text: 'Cập nhật tiến độ minh bạch theo từng bước.' }, { icon: CheckCircle2, title: 'Nhận kết quả', text: 'Xem kết quả xử lý và đánh giá chất lượng.' }];
  return <div className="process-steps">{steps.map(({ icon: Icon, title, text }, index) => <div className="process-step" key={title}><div className="process-step-number">{index + 1}</div><div className="process-step-icon"><Icon size={22} /></div><h3>{title}</h3><p>{text}</p>{index < steps.length - 1 && <div className="process-connector" />}</div>)}</div>;
}

export function PageHero({ eyebrow = 'Dịch vụ công trực tuyến', title, description, children }) {
  return <section className="citizen-page-hero"><div className="citizen-container"><p className="citizen-eyebrow">{eyebrow}</p><h1>{title}</h1>{description && <p className="citizen-page-hero-description">{description}</p>}{children}</div></section>;
}

export function QuickSearch({ onSubmit }) {
  const [value, setValue] = React.useState('');
  return <SearchBox value={value} onChange={(event) => setValue(event.target.value)} onSubmit={(event) => { event.preventDefault(); onSubmit?.(value); }} placeholder="Bạn cần tìm thủ tục, tin tức hay phản ánh?" />;
}

export function TrustNote() {
  return <div className="citizen-trust-note"><Sparkles size={18} /><span>Thông tin được cập nhật từ cơ quan hành chính địa phương</span></div>;
}
