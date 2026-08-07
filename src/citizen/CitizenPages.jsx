import React, { useMemo, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { ArrowLeft, ArrowRight, Calendar3, CheckCircle, Clock, Download, Envelope, FileText, GeoAlt, Inbox, Search, Send, ShieldCheck, Telephone, Upload } from 'react-bootstrap-icons';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { complaintStatuses, contactInfo, departments, news, newsCategories, procedures, procedureCategories } from './data/citizenMockDb';
import { EmptyState, LoadingState, StatusBadge } from './components/CitizenPrimitives';

const complaintEntries = Object.entries(complaintStatuses).map(([code, item]) => ({ code, ...item }));
const complaintFields = ['Nội dung phản ánh', 'Thông tin người gửi', 'Xác nhận'];

export function ProcedureListPage() {
  const [params] = useSearchParams(); const [query, setQuery] = useState(params.get('search') || ''); const [category, setCategory] = useState('Tất cả lĩnh vực');
  const filtered = useMemo(() => procedures.filter((item) => (category === 'Tất cả lĩnh vực' || item.category === category) && `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [query, category]);
  return <>
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/2.jpg)` }}>
      <div className="citizen-container">
        <h1>Thủ tục <em>hành chính</em></h1>
        <p className="hero-desc">Tìm đúng thủ tục, chuẩn bị đủ hồ sơ và biết rõ thời hạn giải quyết.</p>
      </div>
    </section>

    <section className="citizen-section"><div className="citizen-container">
      <div className="proc-toolbar">
        <div className="proc-filter-bar">
          {procedureCategories.map((item) => {
            const catColors = {
              'Tất cả lĩnh vực': { bg: '#F1F5F9', color: '#64748B', activeBg: '#64748B' },
              'Hộ tịch': { bg: '#EEF2FF', color: '#4F46E5', activeBg: '#4F46E5' },
              'Đất đai': { bg: '#F0FDF4', color: '#16A34A', activeBg: '#16A34A' },
              'Kinh doanh': { bg: '#FFF7ED', color: '#EA580C', activeBg: '#EA580C' },
              'Xây dựng': { bg: '#FEF2F2', color: '#DC2626', activeBg: '#DC2626' },
              'An sinh xã hội': { bg: '#F5F3FF', color: '#7C3AED', activeBg: '#7C3AED' },
            };
            const cc = catColors[item] || catColors['Tất cả lĩnh vực'];
            return (
              <button key={item} className={`proc-filter-chip ${category === item ? 'active' : ''}`} style={category === item ? {'--chip-bg': cc.bg, '--chip-color': cc.color, background: cc.color, color: '#fff', borderColor: cc.color} : {'--chip-bg': cc.bg, '--chip-color': cc.color}} onClick={() => setCategory(item)}>
                {item} <span style={category === item ? {background:'rgba(255,255,255,.25)',color:'#fff'} : {background: cc.bg, color: cc.color}}>{item === 'Tất cả lĩnh vực' ? procedures.length : procedures.filter(p => p.category === item).length}</span>
              </button>
            );
          })}
        </div>
        <div className="proc-search-inline">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm thủ tục..." />
        </div>
      </div>

      {filtered.length ? (
        <Row className="g-3">
          {filtered.map((item) => {
            const catColors = {
              'Hộ tịch': { bg: '#EEF2FF', color: '#4F46E5', bar: '#4F46E5' },
              'Đất đai': { bg: '#F0FDF4', color: '#16A34A', bar: '#16A34A' },
              'Kinh doanh': { bg: '#FFF7ED', color: '#EA580C', bar: '#EA580C' },
              'Xây dựng': { bg: '#FEF2F2', color: '#DC2626', bar: '#DC2626' },
              'An sinh xã hội': { bg: '#F5F3FF', color: '#7C3AED', bar: '#7C3AED' },
            };
            const cc = catColors[item.category] || { bg: '#F1F5F9', color: '#64748B', bar: '#64748B' };
            return (
              <Col md={6} lg={4} key={item.id}>
                <Link to={`/cong-dong/thu-tuc/${item.id}`} className="proc-card text-decoration-none text-dark" style={{'--card-bar': cc.bar}}>
                  <div className="proc-card-cat" style={{background:cc.bg,color:cc.color}}>{item.category}</div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                  <div className="proc-card-meta">
                    <span><Clock size={14} /> {item.duration}</span>
                    <span>{item.fee}</span>
                  </div>
                </Link>
              </Col>
            );
          })}
        </Row>
      ) : (
        <EmptyState title="Không tìm thấy thủ tục" description="Thử thay đổi từ khóa hoặc lĩnh vực khác." />
      )}
    </div></section>
  </>;
}

export function ProcedureDetailPage() {
  const { id } = useParams(); const procedure = procedures.find((item) => item.id === id); if (!procedure) return <CitizenNotFound />;
  const catColors = {
    'Hộ tịch': { color: '#4F46E5', bg: '#EEF2FF' },
    'Đất đai': { color: '#16A34A', bg: '#F0FDF4' },
    'Kinh doanh': { color: '#EA580C', bg: '#FFF7ED' },
    'Xây dựng': { color: '#DC2626', bg: '#FEF2F2' },
    'An sinh xã hội': { color: '#7C3AED', bg: '#F5F3FF' },
  };
  const cc = catColors[procedure.category] || { color: '#4F46E5', bg: '#EEF2FF' };
  return <>
    <section className="proc-page-v6">
      <div className="proc-hero-v6 proc-hero-sm" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/2.jpg)` }}>
        <div className="citizen-container">
          <Link to="/cong-dong/thu-tuc" className="ph6-back">← Thủ tục hành chính</Link>
          <span className="proc-detail-cat" style={{background:cc.bg,color:cc.color}}>{procedure.category}</span>
          <h1>{procedure.title}</h1>
        </div>
      </div>

      <div className="citizen-container">
        <div className="pd6-layout">
          <div className="pd6-main">
            <div className="pd6-info-bar-v2">
              <div className="pd6-info-item-v2" style={{'--ic': cc.color,'--ib': cc.bg}}>
                <div className="pd6-info-icon-v2"><FileText size={20} /></div>
                <div><span>Lĩnh vực</span><strong>{procedure.category}</strong></div>
              </div>
              <div className="pd6-info-item-v2" style={{'--ic': '#16A34A','--ib':'#F0FDF4'}}>
                <div className="pd6-info-icon-v2"><Clock size={20} /></div>
                <div><span>Thời gian xử lý</span><strong>{procedure.duration}</strong></div>
              </div>
              <div className="pd6-info-item-v2" style={{'--ic': '#EA580C','--ib':'#FFF7ED'}}>
                <div className="pd6-info-icon-v2"><CheckCircle size={20} /></div>
                <div><span>Phí, lệ phí</span><strong>{procedure.fee}</strong></div>
              </div>
              <div className="pd6-info-item-v2" style={{'--ic': '#7C3AED','--ib':'#F5F3FF'}}>
                <div className="pd6-info-icon-v2"><GeoAlt size={20} /></div>
                <div><span>Cơ quan tiếp nhận</span><strong>UBND phường Tăng Nhơn Phú</strong></div>
              </div>
            </div>

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
              <div className="proc-steps-h">
                {procedure.steps.map((step, i) => (
                  <div key={step} className="proc-step-h">
                    <div className="proc-step-h-num">{String(i + 1).padStart(2, '0')}</div>
                    <div className="proc-step-h-dot" />
                    <strong>Bước {i + 1}</strong>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pd6-block-v2">
              <h2>Biểu mẫu tải về</h2>
              <div className="form-template-grid">
                <div className="form-template-card">
                  <div className="form-template-icon" style={{background:'#FEF2F2',color:'#DC2626'}}>
                    <FileText size={28} />
                  </div>
                  <h3>Tờ khai theo mẫu</h3>
                  <p>Mẫu đơn chuẩn theo quy định, tải về điền thông tin và nộp kèm hồ sơ.</p>
                  <div className="form-template-meta">
                    <span>📄 PDF</span>
                    <span>📥 2.1 MB</span>
                  </div>
                  <Button variant="primary" className="w-100 mt-2 d-inline-flex align-items-center justify-content-center gap-2">
                    <Download size={16} /> Tải về
                  </Button>
                </div>
                <div className="form-template-card">
                  <div className="form-template-icon" style={{background:'#EFF6FF',color:'#2563EB'}}>
                    <CheckCircle size={28} />
                  </div>
                  <h3>Hướng dẫn chuẩn bị hồ sơ</h3>
                  <p>Tài liệu hướng dẫn chi tiết cách chuẩn bị đầy đủ giấy tờ cần thiết.</p>
                  <div className="form-template-meta">
                    <span>📄 PDF</span>
                    <span>📥 1.5 MB</span>
                  </div>
                  <Button variant="primary" className="w-100 mt-2 d-inline-flex align-items-center justify-content-center gap-2">
                    <Download size={16} /> Tải về
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="pd6-sidebar">
            <div className="pd6-action">
              <h3>Nộp hồ sơ ngay</h3>
              <p>Đã chuẩn bị đủ giấy tờ? Nộp trực tuyến để tiết kiệm thời gian.</p>
              <Button variant="primary" className="w-100 mb-2">Nộp hồ sơ trực tuyến</Button>
              <Button variant="outline-primary" className="w-100">In hướng dẫn</Button>
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
  const newsCatColors = {
    'Thông báo': { bg: '#EEF2FF', color: '#4F46E5', bar: '#4F46E5' },
    'Đời sống': { bg: '#F0FDF4', color: '#16A34A', bar: '#16A34A' },
    'Cải cách hành chính': { bg: '#FFF7ED', color: '#EA580C', bar: '#EA580C' },
  };
  return <>
    <section className="news-page">
      <div className="news-hero-v2" style={{ backgroundImage: `linear-gradient(170deg, rgba(10,22,48,.92), rgba(15,40,70,.72)), url(${process.env.PUBLIC_URL}/3.jpg)` }}>
        <div className="citizen-container">
          <h1>Tin tức & <em>Thông báo</em></h1>
          <p>Thông tin mới nhất từ chính quyền địa phương.</p>
        </div>
      </div>

      <div className="citizen-container">
        <div className="news-toolbar">
          <div className="news-cat-bar">
            {newsCategories.map((item) => {
              const catColors = {
                'Tất cả': { bg: '#F8FAFC', color: '#94A3B8', activeColor: '#94A3B8' },
                'Thông báo': { bg: '#EEF2FF', color: '#818CF8', activeColor: '#6366F1' },
                'Đời sống': { bg: '#ECFDF5', color: '#6EE7B7', activeColor: '#34D399' },
                'Cải cách hành chính': { bg: '#FFF7ED', color: '#FDBA74', activeColor: '#F97316' },
              };
              const cc = catColors[item] || catColors['Tất cả'];
              return (
                <button key={item} className={`proc-filter-chip ${category === item ? 'active' : ''}`}
                  style={category === item ? {background:cc.activeColor,color:'#fff',borderColor:cc.activeColor} : {}}
                  onClick={() => setCategory(item)}>
                  {item} <span style={category === item ? {background:'rgba(255,255,255,.25)',color:'#fff'} : {background:cc.bg, color:cc.color}}>{item === 'Tất cả' ? news.length : news.filter(n => n.category === item).length}</span>
                </button>
              );
            })}
          </div>
          <div className="news-search-inline">
            <Search size={18} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm kiếm tin tức..." />
          </div>
        </div>

        <div className="news-content-layout">
          <div className="news-content-main">
            {filtered.length === 0 ? <EmptyState title="Không tìm thấy tin tức" /> : (
              <>
                <Link to={`/cong-dong/tin-tuc/${filtered[0].id}`} className="news-hero-article">
                  <div className="nha-img"><img src={filtered[0].image} alt="" onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/1.jpg`; }} /></div>
                  <div className="nha-body">
                    <span className="nha-badge" style={(newsCatColors[filtered[0].category] && {background:newsCatColors[filtered[0].category].bg,color:newsCatColors[filtered[0].category].color}) || {}}>{filtered[0].category}</span>
                    <h2>{filtered[0].title}</h2>
                    <p>{filtered[0].excerpt}</p>
                    <div className="nha-footer"><time>{filtered[0].date}</time><span>Đọc tiếp →</span></div>
                  </div>
                </Link>

                <div className="news-masonry">
                  {filtered.slice(1).map((item, i) => (
                    <Link key={item.id} to={`/cong-dong/tin-tuc/${item.id}`} className={`news-item-card ${i < 2 ? 'ni-featured' : ''}`}>
                      <div className="ni-img"><img src={item.image} alt="" loading="lazy" onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/1.jpg`; }} /></div>
                      <div className="ni-body">
                        <span className="ni-cat" style={(newsCatColors[item.category] && {background:newsCatColors[item.category].bg,color:newsCatColors[item.category].color}) || {}}>{item.category}</span>
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

export function NewsDetailPage() { const { id } = useParams(); const item = news.find((newsItem) => newsItem.id === id); if (!item) return <CitizenNotFound />;
  const newsCatColors = { 'Thông báo': { bg: '#EEF2FF', color: '#818CF8' }, 'Đời sống': { bg: '#ECFDF5', color: '#6EE7B7' }, 'Cải cách hành chính': { bg: '#FFF7ED', color: '#FDBA74' } };
  const nc = newsCatColors[item.category] || { bg: '#F1F5F9', color: '#64748B' };
  return <>
    <article className="news-article-page">
      <div className="nap-hero" style={{ backgroundImage: `url(${item.image})` }}>
        <div className="nap-hero-overlay">
          <div className="citizen-container">
            <Link to="/cong-dong/tin-tuc" style={{ color: 'rgba(255,255,255,.75)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18, textDecoration: 'none', fontSize: 13, width: 'fit-content' }}><ArrowLeft size={16} /> Tin tức</Link>
            <span className="nap-category" style={{background:nc.bg,color:nc.color}}>{item.category}</span>
            <h1>{item.title}</h1>
            <div className="nap-meta">
              <time><Calendar3 size={14} /> {item.date}</time>
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
              <span style={{background:nc.bg,color:nc.color}}>{item.category}</span>
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

export function ComplaintPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'track' ? 'track' : 'submit';
  const switchTab = (tab) => setSearchParams({ tab });

  // ---- Submit state ----
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [submittedCode, setSubmittedCode] = useState('');
  const [form, setForm] = useState({ title: '', category: '', description: '', address: '', name: '', phone: '', consent: false });
  const [errors, setErrors] = useState({});
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const validate = () => { const next = {}; if (step === 0 && !form.title.trim()) next.title = 'Vui lòng nhập tiêu đề phản ánh.'; if (step === 0 && !form.category) next.category = 'Vui lòng chọn lĩnh vực.'; if (step === 0 && form.description.trim().length < 20) next.description = 'Nội dung cần có ít nhất 20 ký tự.'; if (step === 0 && !form.address.trim()) next.address = 'Vui lòng nhập địa điểm xảy ra sự việc.'; if (step === 1 && !form.name.trim()) next.name = 'Vui lòng nhập họ và tên.'; if (step === 1 && !/^0\d{9}$/.test(form.phone)) next.phone = 'Số điện thoại gồm 10 chữ số.'; if (step === 2 && !form.consent) next.consent = 'Bạn cần đồng ý trước khi gửi.'; setErrors(next); return !Object.keys(next).length; };
  const next = () => { if (validate()) setStep((current) => current + 1); };
  const submit = () => { if (validate()) setSubmittedCode(`PA-2026-${String(Math.floor(10000 + Math.random() * 89999))}`); };
  const resetSubmit = () => { setStep(0); setFiles([]); setSubmittedCode(''); setForm({ title: '', category: '', description: '', address: '', name: '', phone: '', consent: false }); setErrors({}); };

  // ---- Track state ----
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const find = (event) => { event.preventDefault(); if (!query.trim()) return; setLoading(true); setSearched(false); window.setTimeout(() => { const value = query.trim().toLocaleLowerCase(); setResult(complaintEntries.find((item) => item.code.toLocaleLowerCase() === value || item.title.toLocaleLowerCase().includes(value)) || null); setLoading(false); setSearched(true); }, 500); };

  // ---- Success state (submit done) ----
  if (submittedCode) {
    return (
      <div className="citizen-container citizen-section success-page">
        <div className="success-icon-v2"><CheckCircle size={36} /></div>
        <p className="citizen-eyebrow">Gửi thành công</p>
        <h1>Phản ánh đã được tiếp nhận</h1>
        <p>Vui lòng lưu mã này để theo dõi tiến độ xử lý.</p>
        <strong className="complaint-code">{submittedCode}</strong>
        <div className="success-actions">
          <Button variant="primary" onClick={() => { setQuery(submittedCode); resetSubmit(); switchTab('track'); }}>Tra cứu ngay</Button>
          <Button variant="outline-primary" onClick={resetSubmit}>Gửi phản ánh khác</Button>
          <Button as={Link} to="/cong-dong" variant="outline-primary">Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return <>
    {/* Hero */}
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/4.jpg)` }}>
      <div className="citizen-container">
        <h1>Phản <em>ánh</em></h1>
        <p className="hero-desc">Gửi thông tin đến chính quyền hoặc tra cứu tiến độ xử lý phản ánh của bạn.</p>
      </div>
    </section>

    {/* Tab Nav */}
    <section className="citizen-section">
      <div className="citizen-container">
        <div className="complaint-tab-nav">
          <button className={`complaint-tab-pill ${activeTab === 'submit' ? 'active' : ''}`} onClick={() => switchTab('submit')}>
            <FileText size={18} />
            <span>Gửi phản ánh</span>
          </button>
          <button className={`complaint-tab-pill ${activeTab === 'track' ? 'active' : ''}`} onClick={() => switchTab('track')}>
            <Search size={18} />
            <span>Tra cứu phản ánh</span>
          </button>
        </div>

        {/* ── Tab: Gửi phản ánh ── */}
        {activeTab === 'submit' && (
          <div className="complaint-submit-layout">
            {/* Form Column */}
            <div className="complaint-form-col">
              <form className="complaint-form-v3" onSubmit={(event) => event.preventDefault()} noValidate>
                <div className="complaint-stepper">
                  {complaintFields.map((label, index) => (
                    <button type="button" key={label} className={`complaint-stepper-step ${index === step ? 'active' : index < step ? 'done' : ''}`} onClick={() => index < step && setStep(index)}>
                      <span className="complaint-stepper-dot">{index < step ? <CheckCircle size={16} /> : index + 1}</span>
                      <span className="complaint-stepper-label">{label}</span>
                    </button>
                  ))}
                </div>

                <div className="complaint-form-body">
                  {step === 0 && <>
                    <h2 className="complaint-form-heading">Nội dung phản ánh</h2>
                    <p className="complaint-form-sub">Mô tả càng rõ ràng, việc xử lý càng nhanh chóng.</p>
                    <Field label="Tiêu đề phản ánh" required value={form.title} onChange={update('title')} error={errors.title} placeholder="Nhập tiêu đề ngắn gọn về sự việc" />
                    <div className="form-grid-2">
                      <Field label="Lĩnh vực" required as="select" value={form.category} onChange={update('category')} error={errors.category}>
                        <option value="">Chọn lĩnh vực</option>
                        <option>Hạ tầng đô thị</option><option>Môi trường</option><option>An ninh trật tự</option><option>Điện, nước, chiếu sáng</option>
                      </Field>
                      <Field label="Địa điểm xảy ra" required value={form.address} onChange={update('address')} error={errors.address} placeholder="Số nhà, đường, khu phố" />
                    </div>
                    <Field label="Nội dung chi tiết" required as="textarea" value={form.description} onChange={update('description')} error={errors.description} placeholder="Mô tả sự việc, thời gian xảy ra, tình trạng hiện tại và mong muốn của bạn..." />
                    <div className="upload-box-v2">
                      <Upload size={22} />
                      <div><strong>Tải ảnh đính kèm</strong><p>Kéo thả hoặc chọn tối đa 5 ảnh minh họa sự việc</p></div>
                      <label className="citizen-button citizen-button-secondary">Chọn ảnh<input type="file" accept="image/*" multiple hidden onChange={(event) => setFiles(Array.from(event.target.files || []))} /></label>
                    </div>
                    {files.length > 0 && <div className="file-preview">{files.map((file) => <span key={`${file.name}-${file.size}`}><FileText size={12} /> {file.name}</span>)}</div>}
                  </>}

                  {step === 1 && <>
                    <h2 className="complaint-form-heading">Thông tin người gửi</h2>
                    <p className="complaint-form-sub">Thông tin của bạn chỉ dùng để liên hệ khi cần làm rõ phản ánh.</p>
                    <div className="form-grid-2">
                      <Field label="Họ và tên" required value={form.name} onChange={update('name')} error={errors.name} placeholder="Nhập họ tên đầy đủ" />
                      <Field label="Số điện thoại" required value={form.phone} onChange={update('phone')} error={errors.phone} placeholder="0901234567" inputMode="tel" />
                    </div>
                  </>}

                  {step === 2 && <>
                    <h2 className="complaint-form-heading">Xác nhận thông tin</h2>
                    <p className="complaint-form-sub">Vui lòng kiểm tra kỹ tất cả thông tin trước khi gửi phản ánh.</p>
                    <div className="review-card">
                      <div className="review-card-row"><span className="review-label">Tiêu đề</span><span className="review-value">{form.title}</span></div>
                      <div className="review-card-row"><span className="review-label">Lĩnh vực</span><span className="review-value">{form.category}</span></div>
                      <div className="review-card-row"><span className="review-label">Nội dung</span><span className="review-value review-value-muted">{form.description}</span></div>
                      <div className="review-card-row"><span className="review-label">Địa điểm</span><span className="review-value">{form.address}</span></div>
                      <div className="review-card-row"><span className="review-label">Người gửi</span><span className="review-value">{form.name} · {form.phone}</span></div>
                      {files.length > 0 && <div className="review-card-row"><span className="review-label">Ảnh đính kèm</span><span className="review-value">{files.length} ảnh</span></div>}
                    </div>
                    <label className="consent-row-v2">
                      <input type="checkbox" checked={form.consent} onChange={update('consent')} />
                      <span>Tôi xác nhận thông tin trên là chính xác và đồng ý để cơ quan chức năng liên hệ khi cần.</span>
                    </label>
                    {errors.consent && <p className="field-error">{errors.consent}</p>}
                  </>}
                </div>

                <div className="form-actions">
                  {step > 0 && <Button variant="outline-secondary" type="button" onClick={() => setStep((current) => current - 1)} className="d-inline-flex align-items-center gap-2"><ArrowLeft size={16} /> Quay lại</Button>}
                  {step < 2 ? (
                    <Button variant="primary" type="button" onClick={next} className="ms-auto d-inline-flex align-items-center gap-2">Tiếp tục <ArrowRight size={17} /></Button>
                  ) : (
                    <Button variant="primary" type="button" onClick={submit} className="ms-auto d-inline-flex align-items-center gap-2" size="lg">Gửi phản ánh <Send size={17} /></Button>
                  )}
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <aside className="complaint-sidebar">
              <div className="complaint-sidebar-card">
                <div className="complaint-sidebar-icon"><ShieldCheck size={24} /></div>
                <h3>Thông tin của bạn được bảo mật</h3>
                <p>Mọi thông tin cá nhân chỉ được sử dụng để liên hệ và xử lý phản ánh, không chia sẻ cho bên thứ ba.</p>
              </div>
              <div className="complaint-sidebar-card">
                <div className="complaint-sidebar-icon"><Clock size={24} /></div>
                <h3>Thời gian xử lý</h3>
                <p>Phản ánh sẽ được tiếp nhận trong 24h và xử lý trong vòng 3-7 ngày làm việc tùy theo lĩnh vực.</p>
              </div>
              <div className="complaint-sidebar-help">
                <Telephone size={20} />
                <div>
                  <strong>Cần hỗ trợ gấp?</strong>
                  <p>Gọi ngay {contactInfo.phone}</p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ── Tab: Tra cứu phản ánh ── */}
        {activeTab === 'track' && (
          <div className="tracking-layout">
            {/* Left Column */}
            <div className="tracking-main-col">
              <div className="tracking-stats-row">
                <div className="tracking-stat-card">
                  <div className="tracking-stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Inbox size={22} /></div>
                  <div><strong>{complaintEntries.length}</strong><span>Tổng phản ánh</span></div>
                </div>
                <div className="tracking-stat-card">
                  <div className="tracking-stat-icon" style={{ background: '#FFF7ED', color: '#EA580C' }}><Clock size={22} /></div>
                  <div><strong>{complaintEntries.filter(c => c.statusTone === 'info').length}</strong><span>Đang xử lý</span></div>
                </div>
                <div className="tracking-stat-card">
                  <div className="tracking-stat-icon" style={{ background: '#F0FDF4', color: '#16A34A' }}><CheckCircle size={22} /></div>
                  <div><strong>{complaintEntries.filter(c => c.statusTone === 'success').length}</strong><span>Đã giải quyết</span></div>
                </div>
              </div>

              <div className="tracking-search-card-v2">
                <form className="tracking-search-bar-v2" onSubmit={find}>
                  <Search size={20} style={{color:'#94A3B8',flex:'0 0 auto',alignSelf:'center'}} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nhập mã phản ánh, ví dụ: PA-2026-00128" />
                  <Button type="submit" disabled={loading}>{loading ? 'Đang tìm...' : 'Tra cứu ngay'}</Button>
                </form>
                <div className="tracking-suggestions-v2">
                  <span>Gợi ý:</span>
                  {complaintEntries.slice(0, 4).map((item) => (<button key={item.code} onClick={() => setQuery(item.code)}>{item.code}</button>))}
                </div>
              </div>

              <div className="tracking-content">
                {loading && <LoadingState />}
                {searched && !result && !loading && (
                  <div className="tracking-not-found">
                    <div className="tracking-not-found-icon"><Search size={40} /></div>
                    <h2>Không tìm thấy phản ánh</h2>
                    <p>Vui lòng kiểm tra lại mã phản ánh hoặc thử từ khóa khác.</p>
                    <Button variant="outline-primary" onClick={() => { setSearched(false); setQuery(''); }}>Thử lại</Button>
                  </div>
                )}
                {result && <ComplaintResult result={result} showDetailButton />}
              </div>

              {!searched && !result && !loading && (
                <div className="tracking-recent-section">
                  <div className="tracking-recent-head">
                    <div><h2>Phản ánh gần đây</h2><p>Tham khảo các phản ánh đã được tiếp nhận và xử lý trên địa bàn.</p></div>
                    <Button as={Link} to="/cong-dong/phan-anh?tab=submit" variant="primary" className="d-inline-flex align-items-center gap-2">Gửi phản ánh mới <ArrowRight size={16} /></Button>
                  </div>
                  <div className="tracking-recent-grid">
                    {complaintEntries.slice(0, 6).map((item) => (
                      <button key={item.code} className="tracking-recent-card" onClick={() => { setQuery(item.code); setLoading(true); setSearched(false); window.setTimeout(() => { setResult(item); setLoading(false); setSearched(true); }, 300); }}>
                        <div className="trc-top"><span className="trc-code">{item.code}</span><StatusBadge tone={item.statusTone}>{item.status}</StatusBadge></div>
                        <h3 className="trc-title">{item.title}</h3>
                        <div className="trc-meta"><span><GeoAlt size={12} /> {item.location}</span><span><Calendar3 size={12} /> {item.createdAt}</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="tracking-sidebar">
              <div className="complaint-sidebar-card">
                <div className="complaint-sidebar-icon" style={{background:'#F0FDF4',color:'#16A34A'}}><CheckCircle size={24} /></div>
                <h3>Tra cứu bằng mã số</h3>
                <p>Mỗi phản ánh đều được cấp một mã riêng (VD: PA-2026-00128). Nhập mã này để xem chi tiết tiến độ xử lý.</p>
              </div>
              <div className="complaint-sidebar-card">
                <div className="complaint-sidebar-icon" style={{background:'#FFF7ED',color:'#EA580C'}}><Clock size={24} /></div>
                <h3>Tiến độ được cập nhật</h3>
                <p>Mỗi bước xử lý đều được ghi nhận và cập nhật trên hệ thống. Bạn có thể theo dõi bất cứ lúc nào.</p>
              </div>
              <Button as={Link} to="/cong-dong/phan-anh?tab=submit" variant="primary" className="w-100 d-inline-flex align-items-center justify-content-center gap-2">
                <FileText size={18} /> Gửi phản ánh mới
              </Button>
            </aside>
          </div>
        )}
      </div>
    </section>
  </>;
}

function FormTitle({ number, title, text }) { return <div className="form-section-title"><span>{number}</span><div><h2>{title}</h2><p>{text}</p></div></div>; }
function Field({ label, required, as = 'input', error, children, ...props }) { const Tag = as; return <label className="form-field"><span>{label}{required && <b> *</b>}</span><Tag {...props} className={error ? 'has-error' : ''}>{children}</Tag>{error && <small className="field-error">{error}</small>}</label>; }
function ComplaintResult({ result, showDetailButton = false }) {
  const statusColors = {
    info: { bar: '#2563EB', bg: '#EFF6FF', dot: '#2563EB' },
    success: { bar: '#16A34A', bg: '#F0FDF4', dot: '#16A34A' },
    warning: { bar: '#EA580C', bg: '#FFF7ED', dot: '#EA580C' },
  };
  const sc = statusColors[result.statusTone] || statusColors.info;
  return (
    <div className="tracking-result-card">
      <div className="tr-result-bar" style={{ background: sc.bar }} />
      <div className="tr-result-body">
        <div className="tr-result-top">
          <div>
            <span className="tr-result-code">{result.code}</span>
            <h2 className="tr-result-title">{result.title}</h2>
          </div>
          <StatusBadge tone={result.statusTone}>{result.status}</StatusBadge>
        </div>
        <div className="tr-result-info">
          <div className="tr-result-info-item">
            <div className="tr-result-info-icon" style={{background: '#EEF2FF',color:'#4F46E5'}}><GeoAlt size={16} /></div>
            <div><small>Địa điểm</small><strong>{result.location}</strong></div>
          </div>
          <div className="tr-result-info-item">
            <div className="tr-result-info-icon" style={{background: '#F0FDF4',color:'#16A34A'}}><Calendar3 size={16} /></div>
            <div><small>Ngày gửi</small><strong>{result.createdAt}</strong></div>
          </div>
          <div className="tr-result-info-item">
            <div className="tr-result-info-icon" style={{background: '#FFF7ED',color:'#EA580C'}}><Clock size={16} /></div>
            <div><small>Đơn vị xử lý</small><strong>UBND phường Tăng Nhơn Phú</strong></div>
          </div>
        </div>
        {showDetailButton && <Button as={Link} to={`/cong-dong/phan-anh/${result.code}`} variant="primary" className="d-inline-flex align-items-center gap-2">Xem chi tiết tiến độ <ArrowRight size={16} /></Button>}
      </div>
    </div>
  );
}
export function ComplaintDetailPage() { const { code } = useParams(); const result = complaintEntries.find((item) => item.code === code); if (!result) return <CitizenNotFound />;
  const statusColors = { info: '#2563EB', success: '#16A34A', warning: '#EA580C' };
  const barColor = statusColors[result.statusTone] || '#2563EB';
  return <>
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/4.jpg)` }}>
      <div className="citizen-container">
        <Link to="/cong-dong/phan-anh?tab=track" className="back-link" style={{ color: 'rgba(255,255,255,.75)' }}><ArrowLeft size={17} /> Quay lại tra cứu</Link>
        <span className="lib-section-tag d-block" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', marginBottom: 16, marginTop: 14, width: 'fit-content' }}>{result.code}</span>
        <h1><em>{result.title.split(' ').slice(0, 2).join(' ')}</em> {result.title.split(' ').slice(2).join(' ')}</h1>
      </div>
    </section>
    <section className="citizen-section"><div className="citizen-container">
      <ComplaintResult result={result} />
      <div className="detail-timeline">
        <h2 className="detail-timeline-title">Tiến trình xử lý</h2>
        <div className="detail-timeline-h">
          {result.timeline.map((item, i) => (
            <div className={`dt-h-step ${item.done ? 'done' : ''}`} key={item.label} style={{ '--dt-color': barColor }}>
              <div className="dt-h-dot">{item.done ? <CheckCircle size={14} /> : <span>{i + 1}</span>}</div>
              {i < result.timeline.length - 1 && <div className="dt-h-line" />}
              <div className="dt-h-body">
                <strong>{item.label}</strong>
                <small>{item.date}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div></section>
  </>; }

export function ContactPage() { const [query, setQuery] = useState(''); const filtered = departments.filter((department) => `${department.name} ${department.description}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())); return <>
    <section className="citizen-page-hero proc-hero" style={{ '--proc-bg': `url(${process.env.PUBLIC_URL}/4.jpg)` }}>
      <div className="citizen-container">
        <h1>Thông tin <em>liên hệ</em></h1>
        <p className="hero-desc">Các kênh hỗ trợ chính thức của UBND phường Tăng Nhơn Phú.</p>
      </div>
    </section>
    <section className="citizen-section"><div className="citizen-container">
      {/* Map + Info Layout */}
      <div className="contact-map-layout">
        <div className="contact-map-large">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.484231724!2d106.784!3d10.850!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175273c1f6f0aa3%3A0xb2e2d2a2e2d2a2e2!2zMTIgTmd1eeG7hW4gVsSDbiBUxINuZywgVMSDbmcgTmjGoW4gUGjDuiwgVGjhu6cgxJDhu6lj!5e0!3m2!1svi!2s!4v1690000000000!5m2!1svi!2s"
            width="100%" height="100%" style={{border:0,borderRadius:16}} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí UBND phường Tăng Nhơn Phú"
          />
        </div>
        <div className="contact-info-side">
          <div className="contact-info-header">
            <div className="contact-info-badge"><GeoAlt size={20} /></div>
            <div>
              <h2>Trung tâm hành chính phường</h2>
              <p>UBND phường Tăng Nhơn Phú, Thành phố Thủ Đức</p>
            </div>
          </div>
          <div className="contact-info-list">
            <div className="contact-info-row">
              <div className="cir-icon" style={{background:'#EEF2FF',color:'#4F46E5'}}><GeoAlt size={18} /></div>
              <div><small>Địa chỉ</small><strong>{contactInfo.address}</strong></div>
            </div>
            <div className="contact-info-row">
              <div className="cir-icon" style={{background:'#F0FDF4',color:'#16A34A'}}><Telephone size={18} /></div>
              <div><small>Điện thoại</small><strong>{contactInfo.phone}</strong></div>
            </div>
            <div className="contact-info-row">
              <div className="cir-icon" style={{background:'#FFF7ED',color:'#EA580C'}}><Envelope size={18} /></div>
              <div><small>Email</small><strong>{contactInfo.email}</strong></div>
            </div>
            <div className="contact-info-row">
              <div className="cir-icon" style={{background:'#F5F3FF',color:'#7C3AED'}}><Clock size={18} /></div>
              <div><small>Giờ làm việc</small><strong>{contactInfo.hours}</strong></div>
            </div>
          </div>
          <div className="contact-info-actions">
            <Button as="a" href={`tel:${contactInfo.phone}`} variant="primary" className="w-100 mb-2 d-inline-flex align-items-center justify-content-center gap-2">
              <Telephone size={16} /> Gọi ngay
            </Button>
            <Button as="a" href="https://maps.google.com" variant="outline-primary" className="w-100 d-inline-flex align-items-center justify-content-center gap-2">
              <GeoAlt size={16} /> Chỉ đường trên Google Maps
            </Button>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="contact-dept-section mt-5">
        <div className="contact-dept-header">
          <div className="contact-dept-header-left">
            <h2>Danh bạ phòng ban</h2>
            <p>Liên hệ đúng nơi bạn cần</p>
          </div>
          <div className="contact-dept-header-line" />
        </div>
        <Row className="g-3">
          {filtered.map((department, i) => {
            const icons = [FileText, ShieldCheck, GeoAlt, Telephone];
            const bgs = ['#EEF2FF','#ECFDF5','#FFF7ED','#F5F3FF'];
            const colors = ['#4F46E5', '#16A34A', '#EA580C', '#7C3AED'];
            const Icon = icons[i % 4];
            const ci = i % 4;
            return (
              <Col md={6} key={department.name}>
                <div className="dept-row-card">
                  <div className="dept-row-icon" style={{background:bgs[ci],color:colors[ci]}}>
                    <Icon size={20} />
                  </div>
                  <div className="dept-row-info">
                    <strong>{department.name}</strong>
                    <small>{department.description}</small>
                  </div>
                  <a href={`tel:${department.phone}`} className="dept-row-phone" style={{color:colors[i%4]}}>
                    <Telephone size={14} /> Gọi
                  </a>
                </div>
              </Col>
            );
          })}
        </Row>
        {!filtered.length && <EmptyState title="Không tìm thấy phòng ban" />}
      </div>
    </div></section>
  </>; }
export function CitizenNotFound() { return <section className="citizen-section"><div className="citizen-container success-page not-found-page"><div className="not-found-number">404</div><h1>Trang bạn tìm không tồn tại</h1><p>Đường dẫn có thể đã thay đổi hoặc thông tin không còn được cung cấp.</p><Button as={Link} to="/cong-dong" variant="primary" className="d-inline-flex align-items-center gap-2">Về trang chủ <ArrowRight size={17} /></Button></div></section>; }
export const SubmitComplaintPage = ComplaintPage;
export const TrackComplaintPage = ComplaintPage;
