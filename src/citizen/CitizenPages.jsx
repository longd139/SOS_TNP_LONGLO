import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, ChevronDown, Clock3, Mail, MapPin, Phone, Search, Star, Upload } from 'lucide-react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import { complaintStatuses, contactInfo, departments, news, newsCategories, procedures, procedureCategories } from './data/citizenMockDb';
import { readCitizenRatings } from './data/satisfactionData';
import { EmptyState, LoadingState, StatusBadge } from './components/CitizenPrimitives';
import useScrollReveal from './hooks/useScrollReveal';

// Fix Leaflet default marker icon với webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const complaintEntries = Object.entries(complaintStatuses).map(([code, item]) => ({ code, ...item }));
const complaintFields = ['Nội dung phản ánh', 'Vị trí và hình ảnh', 'Thông tin người gửi', 'Xác nhận'];

const sortOptions = [
  { value: 'name', label: 'A → Z' },
  { value: 'duration', label: 'Thời hạn' },
];

function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = sortOptions.find((o) => o.value === value) || sortOptions[0];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="ph6-sort-wrap" ref={ref}>
      <button
        type="button"
        className="ph6-sort-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{selected.label}</span>
        <ChevronDown size={14} className={`ph6-sort-arrow ${open ? 'ph6-sort-arrow-open' : ''}`} />
      </button>
      {open && (
        <div className="ph6-sort-menu">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`ph6-sort-option ${opt.value === value ? 'ph6-sort-option-active' : ''}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
              {opt.value === value && <span className="ph6-sort-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProcedureListPage() {
  const [params] = useSearchParams(); const [query, setQuery] = useState(params.get('search') || ''); const [category, setCategory] = useState('Tất cả lĩnh vực'); const [sort, setSort] = useState('name');
  const filtered = useMemo(() => procedures.filter((item) => (category === 'Tất cả lĩnh vực' || item.category === category) && `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).sort((a, b) => sort === 'duration' ? a.duration.localeCompare(b.duration) : a.title.localeCompare(b.title, 'vi')), [query, category, sort]);
  useScrollReveal();
  return <>
    <section className="proc-page-v6">
      <div className="proc-hero-v6" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/2.jpg)` }}>
        <div className="citizen-container">
          <h1>Thủ tục <em>hành chính</em></h1>
          <p>Tìm đúng thủ tục, chuẩn bị đủ hồ sơ và biết rõ thời hạn giải quyết.</p>
        </div>
      </div>

      <div className="citizen-container">
        <div className="ph6-search-bar">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm thủ tục bạn cần..." />
          <SortDropdown value={sort} onChange={setSort} />
        </div>
        <div className="ph6-layout">
          <aside className="ph6-sidebar reveal">
            <h3>Lĩnh vực</h3>
            {procedureCategories.map((item) => (
              <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
                {item} <span>{item === 'Tất cả lĩnh vực' ? procedures.length : procedures.filter(p => p.category === item).length}</span>
              </button>
            ))}
          </aside>

          <div className="ph6-main reveal">
          <div className="ph6-head">
              <h2>{category === 'Tất cả lĩnh vực' ? 'Tất cả thủ tục' : category} <span>({filtered.length})</span></h2>
            </div>

            {filtered.length ? (
              <div className="ph6-list">
                {filtered.map((item) => (
                  <Link key={item.id} to={`/cong-dong/thu-tuc/${item.id}`} className="ph6-item">
                    <div className="ph6-item-content">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <div className="ph6-meta">
                        <span className="ph6-meta-time">⏱ {item.duration}</span>
                        <span className="ph6-meta-fee">{item.fee}</span>
                        <span className={`ph6-cat ph6-cat-${item.category === 'Hộ tịch' ? 'ho-tich' : item.category === 'Đất đai' ? 'dat-dai' : item.category === 'Kinh doanh' ? 'kinh-doanh' : item.category === 'Xây dựng' ? 'xay-dung' : item.category === 'An sinh xã hội' ? 'an-sinh' : ''}`}>{item.category}</span>
                      </div>
                    </div>
                    <span className="ph6-arrow">→</span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState title="Không tìm thấy thủ tục" description="Thử thay đổi từ khóa hoặc lĩnh vực khác." />
            )}
          </div>
      </div>
      </div>
    </section>
  </>;
}

export function ProcedureDetailPage() {
  useScrollReveal();
  const { id } = useParams(); const procedure = procedures.find((item) => item.id === id); if (!procedure) return <CitizenNotFound />;
  return <>
    <section className="proc-page-v6">
      <div className="proc-hero-v6 proc-hero-sm" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/2.jpg)` }}>
        <div className="citizen-container">
          <Link to="/cong-dong/thu-tuc" className="ph6-back">← Thủ tục hành chính</Link>
          <span className={`ph6-breadcrumb ph6-cat ph6-cat-${procedure.category === 'Hộ tịch' ? 'ho-tich' : procedure.category === 'Đất đai' ? 'dat-dai' : procedure.category === 'Kinh doanh' ? 'kinh-doanh' : procedure.category === 'Xây dựng' ? 'xay-dung' : procedure.category === 'An sinh xã hội' ? 'an-sinh' : ''}`}>{procedure.category}</span>
          <h1>{procedure.title}</h1>
        </div>
      </div>

      <div className="citizen-container">
        <div className="pd6-layout">
          <div className="pd6-main">
            <div className="pd6-info-bar">
              <div className="pd6-info-item"><span>Lĩnh vực</span><strong>{procedure.category}</strong></div>
              <div className="pd6-info-item"><span>Thời gian xử lý</span><strong>{procedure.duration}</strong></div>
              <div className="pd6-info-item"><span>Phí, lệ phí</span><strong>{procedure.fee}</strong></div>
              <div className="pd6-info-item"><span>Cơ quan tiếp nhận</span><strong>UBND phường Tăng Nhơn Phú</strong></div>
            </div>

            <div className="pd6-guide">
              <div className="pd6-guide-header">
                <span>📋</span>
                <div><strong>Hướng dẫn thực hiện</strong><p>Quy trình 3 bước để hoàn tất thủ tục này</p></div>
              </div>
              <div className="pd6-guide-steps">
                <div className="pd6-guide-step"><span>1</span><div><strong>Chuẩn bị hồ sơ</strong><p>Thu thập đầy đủ giấy tờ theo danh sách bên dưới.</p></div></div>
                <div className="pd6-guide-step"><span>2</span><div><strong>Nộp hồ sơ</strong><p>Nộp trực tuyến hoặc đến Bộ phận Một cửa UBND phường.</p></div></div>
                <div className="pd6-guide-step"><span>3</span><div><strong>Nhận kết quả</strong><p>Theo dõi tiến độ và nhận kết quả theo giấy hẹn.</p></div></div>
              </div>
            </div>

            <p className="pd6-summary">{procedure.summary}</p>

            <div className="pd6-block-v2">
              <h2>Thành phần hồ sơ</h2>
              <div className="pd6-doc-cards">
                {procedure.documents.map((item, i) => (
                  <div key={item} className="pd6-doc-card">
                    <span className="pd6-doc-num">{i + 1}</span>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd6-block-v2">
              <h2>Trình tự thực hiện</h2>
              <div className="pd6-timeline">
                {procedure.steps.map((step, i) => (
                  <div key={step} className="pd6-tl-item">
                    <div className="pd6-tl-marker">
                      <span>{i + 1}</span>
                      {i < procedure.steps.length - 1 && <div className="pd6-tl-line" />}
                    </div>
                    <div className="pd6-tl-content">
                      <strong>Bước {i + 1}</strong>
                      <p>{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd6-block-v2">
              <h2>Biểu mẫu</h2>
              <div className="pd6-forms">
                {['Tờ khai theo mẫu', 'Hướng dẫn chuẩn bị hồ sơ'].map((form) => (
                  <button key={form}>{form} <span>Tải về</span></button>
                ))}
              </div>
            </div>
          </div>

          <aside className="pd6-sidebar">
            <div className="pd6-action">
              <h3>Nộp hồ sơ ngay</h3>
              <p>Đã chuẩn bị đủ giấy tờ? Nộp trực tuyến để tiết kiệm thời gian.</p>
              <button className="citizen-button citizen-button-primary full-width">Nộp hồ sơ trực tuyến</button>
              <button className="citizen-button citizen-button-secondary full-width">In hướng dẫn</button>
            </div>
            <div className="pd6-help">
              <p>📞 Cần hỗ trợ thêm?</p>
              <strong>{contactInfo.phone}</strong>
              <small>Thứ Hai - Thứ Sáu, 7:30 - 17:00</small>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </>;
}

export function NewsListPage() { const [query, setQuery] = useState(''); const [category, setCategory] = useState('Tất cả'); const filtered = news.filter((item) => (category === 'Tất cả' || item.category === category) && `${item.title} ${item.excerpt}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  useScrollReveal();
  return <>
    <section className="news-page">
      <div className="news-hero-v2" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/3.jpg)` }}>
        <div className="citizen-container">
          <h1>Tin tức & <em>Thông báo</em></h1>
          <p>Thông tin mới nhất từ chính quyền địa phương.</p>
        </div>
      </div>

      <div className="citizen-container">
        <div className="ph6-search-bar">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm tin tức..." />
        </div>
        <div className="news-cat-bar">
          {newsCategories.map((item) => (
            <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="news-content-layout">
          <div className="news-content-main reveal">
            {filtered.length === 0 ? <EmptyState title="Không tìm thấy tin tức" /> : (
              <>
                {/* Hero article */}
                <Link to={`/cong-dong/tin-tuc/${filtered[0].id}`} className="news-hero-article">
                  <div className="nha-img"><img src={filtered[0].image} alt={filtered[0].title} /></div>
                  <div className="nha-body">
                    <span className="nha-badge">{filtered[0].category}</span>
                    <h2>{filtered[0].title}</h2>
                    <p>{filtered[0].excerpt}</p>
                    <div className="nha-footer"><time>{filtered[0].date}</time><span>Đọc tiếp →</span></div>
                  </div>
                </Link>

                {/* Grid */}
                <div className="news-masonry">
                  {filtered.slice(1).map((item, i) => (
                    <Link key={item.id} to={`/cong-dong/tin-tuc/${item.id}`} className={`news-item-card ${i < 2 ? 'ni-featured' : ''}`}>
                      <div className="ni-img"><img src={item.image} alt={item.title} loading="lazy" /></div>
                      <div className="ni-body">
                        <span className="ni-cat">{item.category}</span>
                        <h3>{item.title}</h3>
                        {i < 2 && <p>{item.excerpt}</p>}
                        <time>{item.date}</time>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <aside className="news-content-sidebar">
            <div className="ncs-card">
              <h3>📰 Tin mới nhất</h3>
              {filtered.slice(0, 5).map((item) => (
                <Link key={item.id} to={`/cong-dong/tin-tuc/${item.id}`} className="ncs-item">
                  <strong>{item.title}</strong>
                  <time>{item.date}</time>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  </>; }

export function NewsDetailPage() { useScrollReveal(); const { id } = useParams(); const item = news.find((newsItem) => newsItem.id === id); if (!item) return <CitizenNotFound />;
  return <>
    <article className="news-article-page">
      <div className="nap-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="nap-hero-overlay">
          <div className="citizen-container">
            <Link to="/cong-dong/tin-tuc" style={{ color: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, textDecoration: 'none', fontSize: 13, width: 'fit-content' }}><ArrowLeft size={16} /> Tin tức</Link>
            <span className="nap-category">{item.category}</span>
            <h1>{item.title}</h1>
            <div className="nap-meta">
              <time><CalendarDays size={14} /> {item.date}</time>
              <span>⏱ 3 phút đọc</span>
            </div>
          </div>
        </div>
      </div>

      <div className="citizen-container">
        <div className="nap-layout">
          <div className="nap-content">
            <p className="nap-lead">{item.excerpt}</p>
            <p>Ủy ban nhân dân phường Tăng Nhơn Phú trân trọng thông tin đến toàn thể người dân trên địa bàn về nội dung quan trọng này. Đây là kênh thông tin chính thức nhằm cập nhật các thông báo, hướng dẫn và hoạt động đang diễn ra tại địa phương.</p>
            <p>Người dân vui lòng theo dõi các mốc thời gian được nêu, chuẩn bị đầy đủ giấy tờ cần thiết và liên hệ trực tiếp với Bộ phận Một cửa của UBND phường khi cần được hỗ trợ thêm thông tin chi tiết.</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ qua số điện thoại đường dây nóng hoặc đến trực tiếp trụ sở UBND phường Tăng Nhơn Phú trong giờ hành chính để được giải đáp kịp thời.</p>
            <div className="nap-tags">
              <span>{item.category}</span>
              <span>Phường Tăng Nhơn Phú</span>
              <span>Thông báo chính thức</span>
            </div>
          </div>
          <aside className="nap-sidebar">
            <div className="ncs-card">
              <h3>📰 Tin liên quan</h3>
              {news.filter(r => r.id !== item.id).slice(0, 4).map((r) => (
                <Link key={r.id} to={`/cong-dong/tin-tuc/${r.id}`} className="ncs-item">
                  <strong>{r.title}</strong>
                  <time>{r.date}</time>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </article>
  </>; }

export function SubmitComplaintPage() {
  useScrollReveal();
  const [step, setStep] = useState(0); const [files, setFiles] = useState([]); const [submittedCode, setSubmittedCode] = useState(''); const [form, setForm] = useState({ title: '', category: '', description: '', address: '', name: '', phone: '', consent: false }); const [errors, setErrors] = useState({});
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const validate = () => { const next = {}; if (step === 0 && !form.title.trim()) next.title = 'Vui lòng nhập tiêu đề phản ánh.'; if (step === 0 && !form.category) next.category = 'Vui lòng chọn lĩnh vực.'; if (step === 0 && form.description.trim().length < 20) next.description = 'Nội dung cần có ít nhất 20 ký tự.'; if (step === 1 && !form.address.trim()) next.address = 'Vui lòng nhập địa điểm xảy ra sự việc.'; if (step === 2 && !form.name.trim()) next.name = 'Vui lòng nhập họ và tên.'; if (step === 2 && !/^0\d{9}$/.test(form.phone)) next.phone = 'Số điện thoại gồm 10 chữ số.'; if (step === 3 && !form.consent) next.consent = 'Bạn cần đồng ý trước khi gửi.'; setErrors(next); return !Object.keys(next).length; };
  const next = () => { if (validate()) setStep((current) => current + 1); }; const submit = () => { if (validate()) setSubmittedCode(`PA-2026-${String(Math.floor(10000 + Math.random() * 89999))}`); };
  if (submittedCode) return <section className="citizen-section citizen-container success-page"><div className="success-icon-v2"><CheckCircle2 size={36} /></div><p className="citizen-eyebrow">Gửi thành công</p><h1>Phản ánh đã được tiếp nhận</h1><p>Vui lòng lưu mã này để theo dõi tiến độ xử lý.</p><strong className="complaint-code">{submittedCode}</strong><div className="success-actions"><Link to={`/cong-dong/tra-cuu?code=${submittedCode}`} className="citizen-button citizen-button-primary">Tra cứu phản ánh</Link><Link to="/cong-dong" className="citizen-button citizen-button-secondary">Về trang chủ</Link></div></section>;
  return <>
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/4.jpg)` }}>
      <div className="citizen-container">
        <h1>Gửi <em>phản ánh</em></h1>
        <p className="hero-desc">Gửi thông tin theo từng bước rõ ràng để cơ quan chức năng tiếp nhận nhanh chóng.</p>
      </div>
    </section>
    <section className="citizen-section citizen-container form-layout">
      <form className="complaint-form-v2" onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="complaint-progress-v2">
          {complaintFields.map((label, index) => (
            <button type="button" key={label} className={index === step ? 'active' : index < step ? 'done' : ''} onClick={() => index < step && setStep(index)}>
              <span>{index + 1}</span>
              <div><strong>{label}</strong></div>
            </button>
          ))}
        </div>
        {step === 0 && <><FormTitle number="01" title="Nội dung phản ánh" text="Mô tả càng rõ, việc xử lý càng nhanh." /><Field label="Tiêu đề phản ánh" required value={form.title} onChange={update('title')} error={errors.title} /><Field label="Lĩnh vực" required as="select" value={form.category} onChange={update('category')} error={errors.category}><option value="">Chọn lĩnh vực</option><option>Hạ tầng đô thị</option><option>Môi trường</option><option>An ninh trật tự</option><option>Điện, nước, chiếu sáng</option></Field><Field label="Nội dung chi tiết" required as="textarea" value={form.description} onChange={update('description')} error={errors.description} placeholder="Mô tả sự việc, thời gian và tình trạng hiện tại..." /></>}
        {step === 1 && <><FormTitle number="02" title="Vị trí và hình ảnh" text="Thông tin này giúp xác minh chính xác hơn." /><Field label="Địa điểm xảy ra" required value={form.address} onChange={update('address')} error={errors.address} placeholder="Số nhà, đường, khu phố" /><div className="upload-box"><Upload size={22} /><div><strong>Hình ảnh đính kèm</strong><p>Bạn có thể chọn nhiều ảnh minh họa.</p></div><label className="citizen-button citizen-button-secondary">Chọn ảnh<input type="file" accept="image/*" multiple hidden onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label></div>{files.length > 0 && <div className="file-preview">{files.map((file) => <span key={`${file.name}-${file.size}`}>{file.name}</span>)}</div>}</>}
        {step === 2 && <><FormTitle number="03" title="Thông tin người gửi" text="Chỉ dùng để liên hệ khi cần làm rõ phản ánh." /><Field label="Họ và tên" required value={form.name} onChange={update('name')} error={errors.name} /><Field label="Số điện thoại" required value={form.phone} onChange={update('phone')} error={errors.phone} placeholder="Ví dụ: 0901234567" inputMode="tel" /></>}
        {step === 3 && <><FormTitle number="04" title="Xác nhận thông tin" text="Vui lòng kiểm tra trước khi gửi." /><div className="review-box-v2"><div className="review-row"><span>Tiêu đề</span><strong>{form.title}</strong></div><div className="review-row"><span>Lĩnh vực</span><strong>{form.category}</strong></div><div className="review-row"><span>Nội dung</span><p>{form.description}</p></div><div className="review-row"><span>Địa điểm</span><strong>{form.address}</strong></div><div className="review-row"><span>Người gửi</span><strong>{form.name} · {form.phone}</strong></div></div><label className="consent-row"><input type="checkbox" checked={form.consent} onChange={update('consent')} /><span>Tôi đồng ý cung cấp thông tin để phục vụ việc tiếp nhận và xử lý phản ánh.</span></label>{errors.consent && <p className="field-error">{errors.consent}</p>}</>}
        <div className="form-navigation">{step > 0 && <button type="button" className="citizen-button citizen-button-secondary" onClick={() => setStep((current) => current - 1)}>Quay lại</button>}{step < 3 ? <button type="button" className="citizen-button citizen-button-primary" onClick={next}>Tiếp tục <ArrowRight size={17} /></button> : <button type="button" className="citizen-button citizen-button-primary" onClick={submit}>Gửi phản ánh <ArrowRight size={17} /></button>}</div>
      </form>
      <aside className="form-aside">
        <div className="help-card-v2">
          <Phone size={24} />
          <strong>Cần hỗ trợ?</strong>
          <p>Gọi Bộ phận Một cửa nếu bạn gặp khó khăn khi gửi phản ánh.</p>
          <a href={`tel:${contactInfo.phone}`} className="citizen-button citizen-button-secondary full-width">{contactInfo.phone}</a>
        </div>
      </aside>
    </section>
  </>;
}
function FormTitle({ number, title, text }) { return <div className="form-section-title"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></div>; }
function Field({ label, required, as = 'input', error, children, ...props }) { const Tag = as; return <label className="form-field"><span>{label}{required && <b> *</b>}</span><Tag {...props} className={error ? 'has-error' : ''}>{children}</Tag>{error && <small className="field-error">{error}</small>}</label>; }

export function TrackComplaintPage() { const [params] = useSearchParams(); const [query, setQuery] = useState(params.get('code') || ''); const [result, setResult] = useState(null); const [searched, setSearched] = useState(false); const [loading, setLoading] = useState(false); useEffect(() => { const code = params.get('code'); if (!code) return; const found = complaintEntries.find((item) => item.code.toLocaleLowerCase() === code.toLocaleLowerCase()); setResult(found || null); setSearched(true); }, [params]); const find = (event) => { event.preventDefault(); if (!query.trim()) return; setLoading(true); setSearched(false); window.setTimeout(() => { const value = query.trim().toLocaleLowerCase(); setResult(complaintEntries.find((item) => item.code.toLocaleLowerCase() === value || item.title.toLocaleLowerCase().includes(value)) || null); setLoading(false); setSearched(true); }, 500); };
  useScrollReveal(); return <>
    <section className="tracking-page">
      <div className="tracking-hero" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/4.jpg)` }}>
        <div className="citizen-container">
          <div className="tracking-hero-content">
            <h1 style={{ textAlign: 'center' }}>Tra cứu <em>phản ánh</em></h1>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.55)', fontSize: 14, marginTop: 8 }}>Nhập mã phản ánh để theo dõi tiến độ xử lý</p>
          </div>
        </div>
      </div>

      <div className="citizen-container reveal">
        <div className="tracking-search-card">
          <div className="tracking-search-icon"><Search size={28} /></div>
          <h2>Nhập mã phản ánh của bạn</h2>
          <p>Mỗi phản ánh đều có một mã riêng để bạn dễ dàng theo dõi.</p>
          <form className="tracking-search-bar" onSubmit={find}>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ví dụ: PA-2026-00128" />
            <button type="submit" disabled={loading}>{loading ? 'Đang tìm...' : 'Tra cứu'}</button>
          </form>
          <div className="tracking-suggestions">
            <span>Gợi ý:</span>
            {complaintEntries.slice(0, 3).map((item) => (
              <button key={item.code} onClick={() => { setQuery(item.code); }}>{item.code}</button>
            ))}
          </div>
          <Link to="/cong-dong/gui-phan-anh" className="citizen-button citizen-button-secondary tracking-submit-link">Gửi phản ánh mới <ArrowRight size={16} /></Link>
        </div>

        <div className="tracking-content">
          {loading && <LoadingState />}
          {searched && !result && !loading && (
            <div className="tracking-not-found">
              <div className="tracking-not-found-icon"><Search size={40} /></div>
              <h2>Không tìm thấy phản ánh</h2>
              <p>Vui lòng kiểm tra lại mã phản ánh hoặc thử từ khóa khác.</p>
              <button className="citizen-button citizen-button-secondary" onClick={() => { setSearched(false); setQuery(''); }}>Thử lại</button>
            </div>
          )}
          {result && <ComplaintResult result={result} />}
        </div>
      </div>
    </section>
  </>; }
function ComplaintResult({ result, hideDetailLink }) { const completed = result.status === 'Đã giải quyết' || result.status === 'Hoàn thành'; const rated = completed && readCitizenRatings().some((item) => item.code === result.code); return (
  <div className="tracking-result-v3">
    <div className="tr3-header">
      <div className="tr3-code">
        <span className="lib-section-tag">Mã phản ánh</span>
        <h2>{result.code}</h2>
      </div>
      <StatusBadge tone={result.statusTone}>{result.status}</StatusBadge>
    </div>
    <h3 className="tr3-title">{result.title}</h3>
    <div className="tr3-info">
      <div className="tr3-info-item"><MapPin size={16} /><div><small>Địa điểm</small><strong>{result.location}</strong></div></div>
      <div className="tr3-info-item"><CalendarDays size={16} /><div><small>Ngày gửi</small><strong>{result.createdAt}</strong></div></div>
      <div className="tr3-info-item"><Clock3 size={16} /><div><small>Đơn vị xử lý</small><strong>UBND phường Tăng Nhơn Phú</strong></div></div>
    </div>
    <div className="tracking-actions">
      {!hideDetailLink && <Link className="citizen-button citizen-button-primary" to={`/cong-dong/tra-cuu/${result.code}`}>Xem chi tiết</Link>}
      {completed && (rated ? <Link className="citizen-button citizen-button-secondary" to={`/cong-dong/danh-gia/${result.code}`}><Star size={16} fill="currentColor" /> Xem chi tiết đánh giá</Link> : <Link className="citizen-button citizen-button-secondary" to={`/cong-dong/danh-gia/${result.code}`}><Star size={16} /> Đánh giá hài lòng</Link>)}
    </div>
  </div>
); }
export function ComplaintDetailPage() { useScrollReveal(); const { code } = useParams(); const result = complaintEntries.find((item) => item.code === code); if (!result) return <CitizenNotFound />;
  const completed = result.status === 'Đã giải quyết' || result.status === 'Hoàn thành';
  return <>
    <section className="complaint-detail-page reveal">
      <div className="citizen-container">
        <Link to="/cong-dong/tra-cuu" className="cd-back">
          <ArrowLeft size={17} /> Quay lại tra cứu
        </Link>

        <div className="cd-header">
          <div className="cd-header-top">
            <span className="cd-code">Chi tiết phản ánh: {result.code}</span>
            <StatusBadge tone={result.statusTone}>{result.status}</StatusBadge>
          </div>
          <h1 className="cd-title">{result.title}</h1>
        </div>

        <div className="cd-grid">
          {/* Left column */}
          <div className="cd-main">
            {/* Card: Thông tin người phản ánh */}
            <div className="cd-card">
              <h3 className="cd-card-title">Thông tin người phản ánh</h3>
              <div className="cd-card-body">
                <div className="cd-info-row">
                  <span className="cd-info-label">Họ tên</span>
                  <span className="cd-info-value">{result.citizenName || '***'}</span>
                </div>
                <div className="cd-info-row">
                  <span className="cd-info-label">Số điện thoại</span>
                  <span className="cd-info-value">{result.citizenPhone || '***'}</span>
                </div>
                <div className="cd-info-row">
                  <span className="cd-info-label">Ngày gửi</span>
                  <span className="cd-info-value">{result.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Card: Nội dung phản ánh */}
            <div className="cd-card">
              <h3 className="cd-card-title">Nội dung phản ánh</h3>
              <div className="cd-card-body">
                <div className="cd-info-row">
                  <span className="cd-info-label">Lĩnh vực</span>
                  <span className="cd-info-value"><span className="cd-category-tag">{result.category}</span></span>
                </div>
                <div className="cd-description">
                  {result.description || 'Không có nội dung chi tiết.'}
                </div>
                {result.images && result.images.length > 0 && (
                  <div className="cd-images">
                    <h4 className="cd-images-title">Hình ảnh đính kèm ({result.images.length})</h4>
                    <div className="cd-images-grid">
                      {result.images.map((img, i) => (
                        <div key={i} className="cd-image-item">
                          <img src={img} alt={`Ảnh ${i + 1}`} loading="lazy" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentElement.classList.add('cd-image-fallback'); }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card: Địa điểm */}
            <div className="cd-card">
              <h3 className="cd-card-title">Địa điểm phản ánh</h3>
              <div className="cd-card-body">
                <div className="cd-info-row">
                  <span className="cd-info-label">Địa chỉ</span>
                  <span className="cd-info-value"><MapPin size={14} style={{marginRight: 4}} />{result.location}</span>
                </div>
                <div className="cd-map-placeholder">
                  <MapPin size={28} />
                  <span>{result.location}</span>
                  <small>Bản đồ (minh họa)</small>
                </div>
              </div>
            </div>

            {/* Card: Tiến trình xử lý */}
            <div className="cd-card">
              <h3 className="cd-card-title">Tiến trình xử lý</h3>
              <div className="cd-card-body">
                <div className="cd-timeline">
                  {result.timeline.map((item, i) => (
                    <div className={`cd-tl-step ${item.done ? 'cd-tl-done' : ''}`} key={item.label}>
                      <div className="cd-tl-marker">
                        {item.done ? <CheckCircle2 size={16} /> : <span>{i + 1}</span>}
                      </div>
                      {i < result.timeline.length - 1 && <div className="cd-tl-line" />}
                      <div className="cd-tl-content">
                        <strong>{item.label}</strong>
                        <small>{item.date}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="cd-sidebar">
            {/* Card: Trạng thái xử lý */}
            <div className="cd-card">
              <h3 className="cd-card-title">Trạng thái xử lý</h3>
              <div className="cd-card-body">
                <div className="cd-info-row">
                  <span className="cd-info-label">Trạng thái</span>
                  <StatusBadge tone={result.statusTone}>{result.status}</StatusBadge>
                </div>
                <div className="cd-info-row">
                  <span className="cd-info-label">Đơn vị xử lý</span>
                  <span className="cd-info-value">UBND phường Tăng Nhơn Phú</span>
                </div>
                <div className="cd-info-row">
                  <span className="cd-info-label">Lĩnh vực</span>
                  <span className="cd-info-value">{result.category}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="cd-actions">
              {completed && (
                <Link to={`/cong-dong/danh-gia/${result.code}`} className="citizen-button citizen-button-secondary cd-action-btn">
                  <Star size={16} /> Đánh giá hài lòng
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  </>; }

export function ContactPage() { const [query, setQuery] = useState(''); const filtered = departments.filter((department) => `${department.name} ${department.description}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  useScrollReveal();
  return <>
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/4.jpg)` }}>
      <div className="citizen-container">
        <h1>Liên hệ</h1>
        <p className="hero-desc">Các kênh hỗ trợ chính thức của UBND phường Tăng Nhơn Phú.</p>
      </div>
    </section>
    <section className="citizen-section citizen-container">
      <div className="contact-lower">
        <div className="contact-map">
            <MapContainer center={[10.8460, 106.7885]} zoom={16} scrollWheelZoom={false} className="contact-leaflet-map">
              <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[10.8460, 106.7885]} />
            </MapContainer>
            <div className="contact-map-overlay">
              <MapPin size={29} /><strong>Trung tâm hành chính phường</strong><p>{contactInfo.address}</p><a className="citizen-button citizen-button-white" href="https://maps.google.com">Chỉ đường</a>
            </div>
          </div>
        <div className="departments">
          <p className="citizen-eyebrow">Danh bạ phòng ban</p>
          <h2>Liên hệ đúng nơi bạn cần</h2>
          <div className="department-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm phòng ban hoặc dịch vụ" /></div>
          {filtered.map((department) => <div className="department-row" key={department.name}><div className="dept-info"><strong>{department.name}</strong><p>{department.description}</p></div><a href={`tel:${department.phone}`} className="dept-phone-link"><Phone size={14} /> {department.phone}</a></div>)}
          {!filtered.length && <EmptyState title="Không tìm thấy cơ sở hỗ trợ" />}
        </div>
      </div>
      <div className="contact-info-grid">
        <ContactItem icon={MapPin} title="Địa chỉ" text={contactInfo.address} link="https://maps.google.com" />
        <ContactItem icon={Phone} title="Điện thoại" text={contactInfo.phone} link={`tel:${contactInfo.phone}`} />
        <ContactItem icon={Mail} title="Email" text={contactInfo.email} link={`mailto:${contactInfo.email}`} />
        <ContactItem icon={Clock3} title="Giờ làm việc" text={contactInfo.hours} />
      </div>
    </section>
  </>; }
function ContactItem({ icon: Icon, title, text, link }) { const content = <><Icon size={23} /><div><small>{title}</small><strong>{text}</strong></div></>; return link ? <a className="contact-info-card" href={link}>{content}</a> : <div className="contact-info-card">{content}</div>; }
export function CitizenNotFound() { return <section className="citizen-section citizen-container success-page not-found-page"><div className="not-found-number">404</div><h1>Trang bạn tìm không tồn tại</h1><p>Đường dẫn có thể đã thay đổi hoặc thông tin không còn được cung cấp.</p><Link to="/cong-dong" className="citizen-button citizen-button-primary">Về trang chủ <ArrowRight size={17} /></Link></section>; }
