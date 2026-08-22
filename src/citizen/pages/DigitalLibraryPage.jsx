import React, { useState, useEffect } from 'react';
import { ArrowRight, Bank, Book, Download, Eye, FileEarmarkText, FileText, Map, Search, ShieldCheck, Upload } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { libraryCategories } from '../data/citizenMockDb';
import { SectionHeading, LoadingState } from '../components/CitizenPrimitives';
import { getTaiLieuCongKhai, getChiTietTaiLieuCongKhai } from '../../services/libraryService';
import useScrollReveal from '../hooks/useScrollReveal';
import DOMPurify from 'dompurify';

/* ─── Icon map cho danh mục ─── */
const categoryIcons = { BookOpen: Book, FileText, ScrollText: FileEarmarkText, Map };

/* ============================================================
   DIGITAL LIBRARY PAGE — Trang chủ Thư viện số cho người dân
   ============================================================ */
export default function DigitalLibraryPage() {
  const [searchValue, setSearchValue] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [lawResults, setLawResults] = useState([]);
  const [localResults, setLocalResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useScrollReveal([selectedDoc]);

  const [apiDocuments, setApiDocuments] = useState([]);

  useEffect(() => {
    const fetchApiDocs = async () => {
      setIsLoading(true);
      try {
        const res = await getTaiLieuCongKhai({ page: 1, size: 50 });
        if (res?.success && res.data) {
          const mapped = res.data.map(item => ({
            id: item.id,
            title: item.tieu_de,
            description: item.mo_ta || item.tieu_de,
            category: item.loai === 'PHAP_LUAT' ? 'van-ban' : 'sach',
            cover: item.thu_vien_tai_lieu_media?.find(m => m.loai === 'IMAGE')?.url
              ? `${process.env.REACT_APP_API_URL || 'http://localhost:8880'}${item.thu_vien_tai_lieu_media.find(m => m.loai === 'IMAGE').url}`
              : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
            author: item.ten_nguoi_tao || 'UBND Phường',
            downloads: item.so_luot_tai || 0,
            views: item.luot_xem || 0,
            docType: item.thu_vien_danh_muc?.ten || (item.loai === 'PHAP_LUAT' ? 'Văn bản pháp luật' : 'Tài liệu'),
            isApiData: true,
            loai: item.loai,
            date: item.ngay_ban_hanh || item.thoi_gian_tao
          }));
          setApiDocuments(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch api docs:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApiDocs();
  }, []);

  const allDocuments = apiDocuments;

  /* Lọc tài liệu địa phương — CHỈ theo category, KHÔNG theo search */
  const filteredDocs = allDocuments.filter((doc) => {
    return !activeCategory || doc.category === activeCategory;
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    setIsSearching(true);
    setHasSearched(true);
    setActiveCategory(null);

    try {
      const res = await getTaiLieuCongKhai({ search: searchValue, page: 1, size: 50 });
      if (res?.success && res.data) {
        const mapped = res.data.map(item => ({
          id: item.id,
          title: item.tieu_de,
          description: item.mo_ta || item.tieu_de,
          category: item.loai === 'PHAP_LUAT' ? 'van-ban' : 'sach',
          cover: item.thu_vien_tai_lieu_media?.find(m => m.loai === 'IMAGE')?.url
            ? `${process.env.REACT_APP_API_URL || 'http://localhost:8880'}${item.thu_vien_tai_lieu_media.find(m => m.loai === 'IMAGE').url}`
            : 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
          author: item.ten_nguoi_tao || 'UBND Phường',
          downloads: item.so_luot_tai || 0,
          views: item.luot_xem || 0,
          docType: item.thu_vien_danh_muc?.ten || (item.loai === 'PHAP_LUAT' ? 'Văn bản pháp luật' : 'Tài liệu'),
          isApiData: true,
          loai: item.loai,
          date: item.ngay_ban_hanh || item.thoi_gian_tao
        }));
        
        const local = mapped.filter(d => d.loai !== 'PHAP_LUAT');
        const law = mapped.filter(d => d.loai === 'PHAP_LUAT');
        setLocalResults(local);
        setLawResults(law);
      } else {
        setLocalResults([]);
        setLawResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchValue('');
    setHasSearched(false);
    setLocalResults([]);
    setLawResults([]);
  };
  const handleHintClick = (term) => { setSearchValue(term); };

  const handleSelectDoc = async (doc) => {
    window.scrollTo(0, 0);
    setSelectedDoc(doc);
    if (doc.isApiData) {
      try {
        const res = await getChiTietTaiLieuCongKhai(doc.id);
        if (res?.success && res.data) {
          const detail = res.data;
          setSelectedDoc(prev => ({
            ...prev,
            noi_dung: detail.noi_dung,
            files: detail.thu_vien_tai_lieu_file || [],
            media: detail.thu_vien_tai_lieu_media || [],
            issuingAgency: detail.ten_nguoi_tao || 'UBND',
            issuedDate: detail.ngay_ban_hanh ? new Date(detail.ngay_ban_hanh).toLocaleDateString('vi-VN') : null
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  /* ─── Trang chi tiết tài liệu ─── */
  if (selectedDoc) {
    const category = libraryCategories.find((c) => c.id === selectedDoc.category);
    const isLegal = selectedDoc.category === 'van-ban' || selectedDoc.type;
    const sections = selectedDoc.sections || [];
    return (
      <>
        {/* Hero card */}
        <section className="lib-detail-hero-v2">
          <div className="lib-detail-hero-bg" style={{ backgroundImage: `url(${selectedDoc.cover || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'})` }} />
          <div className="citizen-container lib-detail-hero-inner">
            <button className="back-link" onClick={() => setSelectedDoc(null)} style={{ color: '#fff' }}>← Quay lại Thư viện số</button>
            <div className="lib-detail-hero-card">
              <div className="lib-detail-hero-img">
                <img src={selectedDoc.cover} alt={`Ảnh bìa ${selectedDoc.title}`} />
              </div>
              <div className="lib-detail-hero-body">
                <span className="lib-detail-hero-tag" style={{ background: category?.color || '#2563EB' }}>{category?.label || 'Tài liệu'}</span>
                <h1>{selectedDoc.title}</h1>
                <div className="lib-detail-hero-meta">
                  <span>{selectedDoc.author}</span>
                  {selectedDoc.issuingAgency && <span>{selectedDoc.issuingAgency}</span>}
                  <span>{selectedDoc.downloads?.toLocaleString('vi-VN')} lượt tải</span>
                </div>
                {selectedDoc.tags && (
                  <div className="lib-detail-hero-tags">
                    {selectedDoc.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                )}
                <div className="lib-detail-hero-actions">
                  {selectedDoc.files && selectedDoc.files.length > 0 ? (
                    <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8880'}${selectedDoc.files[0].duong_dan}`} download className="citizen-button citizen-button-primary">
                      <Download size={16} /> Tải về ({selectedDoc.files[0].kich_thuoc_mb}MB)
                    </a>
                  ) : (
                    <button className="citizen-button citizen-button-primary" disabled><Download size={16} /> Tải về</button>
                  )}
                  <button className="citizen-button citizen-button-secondary"><Eye size={16} /> Đọc trực tuyến</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="citizen-section">
          <div className="citizen-container">
            <div className="lib-detail-layout-v2">
              <aside className="lib-detail-sidebar">
                {isLegal && (selectedDoc.issuingAgency || selectedDoc.issuedDate) && (
                  <div className="lib-detail-side-card">
                    <h4><ShieldCheck size={15} /> Thông tin văn bản</h4>
                    {selectedDoc.code && <div className="lib-detail-side-row"><span>Số hiệu</span><strong>{selectedDoc.code}</strong></div>}
                    {selectedDoc.issuingAgency && <div className="lib-detail-side-row"><span>Cơ quan ban hành</span><strong>{selectedDoc.issuingAgency}</strong></div>}
                    {selectedDoc.issuedDate && <div className="lib-detail-side-row"><span>Ngày ban hành</span><strong>{selectedDoc.issuedDate}</strong></div>}
                    {selectedDoc.effectiveDate && <div className="lib-detail-side-row"><span>Ngày hiệu lực</span><strong>{selectedDoc.effectiveDate}</strong></div>}
                    {selectedDoc.status && <div className="lib-detail-side-row"><span>Trạng thái</span><strong className="lib-legal-status">{selectedDoc.status}</strong></div>}
                  </div>
                )}
                {sections.length > 0 && (
                  <div className="lib-detail-side-card">
                    <h4>Mục lục</h4>
                    {sections.map((sec, i) => (
                      <a key={i} href={`#section-${i}`} className="lib-detail-toc-link">{sec.heading}</a>
                    ))}
                  </div>
                )}
              </aside>
              <div className="lib-detail-main">
                <div className="lib-detail-section">
                  <h3>Giới thiệu</h3>
                  <p>{selectedDoc.description}</p>
                </div>
                {sections.map((sec, i) => (
                  <div key={i} id={`section-${i}`} className="lib-detail-section">
                    <h3>{sec.heading}</h3>
                    <p>{sec.content}</p>
                  </div>
                ))}
                
                {selectedDoc.noi_dung && (
                  <div className="lib-detail-section">
                    <h3>Nội dung chi tiết</h3>
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedDoc.noi_dung) }} />
                  </div>
                )}

                {selectedDoc.media && selectedDoc.media.length > 0 && (
                  <div className="lib-detail-section">
                    <h3>Hình ảnh / Video</h3>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 16 }}>
                      {selectedDoc.media.map(m => {
                        const url = `${process.env.REACT_APP_API_URL || 'http://localhost:8880'}${m.url}`;
                        if (m.loai === 'IMAGE') {
                          return <img key={m.id} src={url} alt={m.ten_file_goc} style={{ width: '100%', maxWidth: 300, borderRadius: 8, objectFit: 'cover' }} />;
                        }
                        if (m.loai === 'VIDEO') {
                          return <video key={m.id} src={url} controls style={{ width: '100%', maxWidth: 300, borderRadius: 8 }} />;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
                
                {selectedDoc.content && !sections.length && !selectedDoc.noi_dung && (
                  <div className="lib-detail-section">
                    <h3>Nội dung</h3>
                    <p>{selectedDoc.content}</p>
                  </div>
                )}
                <div className="lib-detail-trust">
                  <ShieldCheck size={16} />
                  <span>Nội dung được cung cấp bởi <strong>{selectedDoc.issuingAgency || selectedDoc.author || 'UBND Phường Tăng Nhơn Phú'}</strong>.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="citizen-section citizen-section-soft">
          <div className="citizen-container">
            <SectionHeading eyebrow="Có thể bạn quan tâm" title={`Tài liệu liên quan (${allDocuments.filter((d) => d.category === selectedDoc.category && d.id !== selectedDoc.id).length})`} />
            <div className="lib-related-scroll">
              {allDocuments.filter((d) => d.category === selectedDoc.category && d.id !== selectedDoc.id).map((doc) => (
                <div key={doc.id} className="lib-related-item">
                  <DocCardV2 doc={doc} onClick={() => handleSelectDoc(doc)} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ─── Trang chủ Thư viện số ─── */
  return (
    <>
      {/* ═══ HERO — Tiêu đề + Mô tả ═══ */}
      <section className="library-hero library-hero-congan">
        <div className="hero-overlay" aria-hidden="true" />
        <div className="library-hero-inner">
          <p className="citizen-eyebrow" style={{ color: '#93C5FD' }}>Thư viện số — Bộ Công an</p>
          <h1>Tri thức <em>vững bước</em>,<br />An ninh <em>đồng hành</em></h1>
          <p className="library-hero-sub">
            Kho tài liệu số chính thống kết hợp cùng Bộ Công an — tra cứu sách, văn bản pháp luật,
            tài liệu hướng dẫn và thông tin an ninh trật tự một cách dễ dàng.
          </p>
          <div className="hero-pillars">
            <div className="hero-pillar">
              <div className="hero-pillar-icon hero-pillar-library"><Book size={22} /></div>
              <div><strong>{(allDocuments.reduce((s, d) => s + (d.downloads || 0), 0) / 1000).toFixed(1)}k+</strong><span>Lượt tải tài liệu</span></div>
            </div>
            <div className="hero-pillar-divider" />
            <div className="hero-pillar">
              <div className="hero-pillar-icon hero-pillar-police"><ShieldCheck size={22} /></div>
              <div><strong>{allDocuments.length}+</strong><span>Tài liệu pháp luật</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH SECTION ═══ */}
      <section className="library-search-section reveal">
        <div className="citizen-container">
          <div className="lib-search-hero">
            <div className="lib-search-hero-text">
              <h2>Thư viện số Phường Tăng Nhơn Phú</h2>
              <p>Tra cứu sách, tài liệu, văn bản pháp luật — nhanh chóng, dễ dàng</p>
            </div>
            <form className="lib-search-bar" onSubmit={handleSearch} role="search">
              <Search size={20} strokeWidth={1.5} className="lib-search-bar-icon" />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập tên sách, tài liệu bạn cần tìm..."
                aria-label="Tìm kiếm tài liệu"
                className="lib-search-bar-input"
              />
              <button type="submit" className="lib-search-bar-btn" disabled={isSearching}>
                <Search size={18} /> {isSearching ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>
            <div className="lib-search-tags">
              {['Sổ tay sức khỏe', 'Thủ tục đất đai', 'An ninh trật tự', 'Kỹ năng số', 'PCCC'].map((hint) => (
                <button key={hint} type="button" onClick={() => handleHintClick(hint)}>{hint}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH RESULTS ═══ */}
      {hasSearched && !isSearching && (
        <section className="citizen-section citizen-section-soft">
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
            <div className="lib-section-head">
              <div>
                <span className="lib-section-tag">Kết quả tìm kiếm</span>
                <h2 className="lib-section-title">"{searchValue}"</h2>
                <p className="lib-section-desc">
                  Tìm thấy <strong>{localResults.length + lawResults.length}</strong> kết quả
                  {' '}•{' '}<span style={{ color: 'var(--citizen-blue)' }}>{localResults.length} tài liệu địa phương</span>
                  {' '}•{' '}<span style={{ color: '#E65100' }}>{lawResults.length} văn bản pháp luật</span>
                </p>
              </div>
              <button className="lib-filter-clear" onClick={clearSearch}>× Xóa kết quả</button>
            </div>

            {localResults.length + lawResults.length > 0 ? (
              <div className="lib-results-list">
                {localResults.map((doc) => (
                  <button key={doc.id} className="lib-result-row" onClick={() => handleSelectDoc(doc)} style={{ fontFamily: 'inherit' }}>
                    <div className="lib-result-thumb">
                      <img src={doc.cover} alt={`Ảnh bìa ${doc.title}`} />
                    </div>
                    <div className="lib-result-info">
                      <span className="lib-result-type" style={{ color: 'var(--citizen-blue)' }}>
                        <Book size={13} /> {doc.docType || 'Tài liệu'}
                      </span>
                      <h4>{doc.title}</h4>
                      <p>{doc.description}</p>
                      <span className="lib-result-meta">{doc.author} • {(doc.downloads || 0).toLocaleString('vi-VN')} lượt tải</span>
                    </div>
                    <div className="lib-result-action">
                      <span>Xem <ArrowRight size={15} /></span>
                    </div>
                  </button>
                ))}
                {lawResults.map((law) => (
                  <button
                    key={law.id}
                    className="lib-result-row lib-result-law"
                    onClick={() => handleSelectDoc(law)}
                    style={{ fontFamily: 'inherit' }}
                  >
                    <div className="lib-result-thumb lib-result-thumb-law">
                      <Bank size={28} />
                    </div>
                    <div className="lib-result-info">
                      <span className="lib-result-type" style={{ color: '#E65100' }}>
                        <Bank size={13} /> {law.type} • {law.code}
                      </span>
                      <h4>{law.title}</h4>
                      <p>{law.summary}</p>
                      <span className="lib-result-meta">{law.issuingAgency} • Ban hành: {law.issuedDate} • <span className="lib-law-status">{law.status}</span></span>
                    </div>
                    <div className="lib-result-action">
                      <span>Xem <ArrowRight size={15} /></span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="citizen-empty">
                <Search size={34} />
                <h3>Không tìm thấy kết quả</h3>
                <p>Thử tìm với từ khóa khác, ví dụ: "đất đai", "hôn nhân", "lao động", "sức khỏe"...</p>
              </div>
            )}
          </div>
        </section>
      )}

      {isSearching && (
        <section className="citizen-section" style={{ background: '#fff', paddingTop: 40 }}>
          <div className="citizen-container"><LoadingState /></div>
        </section>
      )}

      {/* ═══ ALL DOCUMENTS ═══ */}
      <section className="citizen-section citizen-section-soft reveal" id="all-docs">
        <div className="citizen-container">
          <div className="lib-section-head">
            <div>
              <span className="lib-section-tag">Khám phá thêm</span>
              <h2 className="lib-section-title">Tất cả tài liệu ({filteredDocs.length})</h2>
              <p className="lib-section-desc">
                {activeCategory
                  ? <>Đang xem: <strong>{libraryCategories.find(c => c.id === activeCategory)?.label}</strong> — {filteredDocs.length} tài liệu.</>
                  : 'Toàn bộ tài liệu trong thư viện số — sách, tài liệu hướng dẫn, văn bản pháp luật địa phương và bản đồ di tích.'
                }
              </p>
            </div>
          </div>

          {/* Filter chips */}
          <div className="lib-filter-bar">
            <button
              className={`lib-filter-chip-v2 ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              Tất cả
            </button>
            {libraryCategories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || FileText;
              const count = allDocuments.filter((d) => d.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`lib-filter-chip-v2 ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                  style={activeCategory === cat.id ? { borderColor: cat.color, color: cat.color, background: `${cat.color}10` } : {}}
                >
                  <Icon size={15} />
                  {cat.label}
                  <span className="lib-filter-chip-count">{count}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div style={{ padding: '40px 0' }}>
              <LoadingState />
            </div>
          ) : filteredDocs.length > 0 ? (
            <>
              <div className="lib-doc-grid-v2">
                {(showAll ? filteredDocs : filteredDocs.slice(0, 8)).map((doc) => (
                  <DocCardV2 key={doc.id} doc={doc} onClick={() => handleSelectDoc(doc)} />
                ))}
              </div>
              {!showAll && filteredDocs.length > 8 && (
                <div className="lib-load-more">
                  <button className="citizen-button citizen-button-secondary" onClick={() => setShowAll(true)}>
                    Xem tất cả {filteredDocs.length} tài liệu <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {showAll && filteredDocs.length > 8 && !hasSearched && (
                <div className="lib-load-more">
                  <button className="citizen-button citizen-button-secondary" onClick={() => setShowAll(false)}>
                    Thu gọn <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="citizen-empty">
              <Search size={34} />
              <h3>Không tìm thấy tài liệu</h3>
              <p>Thử thay đổi từ khóa hoặc chọn danh mục khác nhé.</p>
              <button className="citizen-button citizen-button-secondary" style={{ marginTop: 16 }} onClick={() => { setSearchValue(''); setActiveCategory(null); }}>Xóa bộ lọc</button>
            </div>
          )}
        </div>
      </section>

      {/* ═══ CTA BANNER — Kêu gọi hành động ═══ */}
      <section className="lib-cta-banner reveal">
        <div className="lib-cta-bg" />
        <div className="citizen-container lib-cta-inner">
          <div className="lib-cta-content">
            <p className="citizen-eyebrow" style={{ color: '#93C5FD' }}>Đóng góp cho cộng đồng</p>
            <h2>Chia sẻ tài liệu hay cùng người dân trong phường</h2>
            <p>Bạn có sách hay, tài liệu hữu ích? Hãy đóng góp vào Thư viện số để mọi người cùng học hỏi và phát triển.</p>
            <div className="lib-cta-actions">
              <button className="citizen-button citizen-button-primary">
                <Upload size={17} /> Đóng góp tài liệu
              </button>
              <Link to="/cong-dong/lien-he" className="citizen-button citizen-button-ghost">Liên hệ hỗ trợ</Link>
            </div>
          </div>
          <div className="lib-cta-visual">
            <div className="lib-cta-card">
              <Book size={24} />
              <strong>125+</strong>
              <span>tài liệu đã được<br />đóng góp</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="citizen-section reveal" style={{ background: '#fff' }}>
        <div className="citizen-container">
          <div className="lib-section-head">
            <div>
              <span className="lib-section-tag">Cách sử dụng</span>
              <h2 className="lib-section-title">Dễ dàng tiếp cận tri thức</h2>
              <p className="lib-section-desc">Chỉ với vài bước đơn giản, bạn có thể tìm và sử dụng mọi tài liệu trong thư viện.</p>
            </div>
          </div>
          <div className="lib-how-grid">
            {[
              { step: '01', icon: Search, title: 'Tìm kiếm', text: 'Gõ từ khóa hoặc chọn danh mục bạn quan tâm. Hệ thống sẽ gợi ý tài liệu phù hợp nhất.' },
              { step: '02', icon: Eye, title: 'Xem trực tuyến', text: 'Đọc ngay trên website không cần tải về. Tương thích mọi thiết bị.' },
              { step: '03', icon: Download, title: 'Tải về dễ dàng', text: 'Lưu tài liệu về máy để đọc khi không có mạng. Hỗ trợ định dạng PDF.' },
              { step: '04', icon: ShieldCheck, title: 'Nội dung tin cậy', text: 'Mọi tài liệu đều được kiểm duyệt từ nguồn chính thức của địa phương.' },
            ].map((item) => (
              <div key={item.step} className="lib-how-card">
                <span className="lib-how-step">{item.step}</span>
                <div className="lib-how-icon"><item.icon size={24} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════ */

function DocCardV2({ doc, onClick }) {
  const cat = libraryCategories.find((c) => c.id === doc.category) || { label: doc.docType || 'Tài liệu', color: '#2563EB', icon: 'FileText' };
  const CatIcon = categoryIcons[cat?.icon] || FileText;
  return (
    <button className="lib-doc-card-v2" onClick={onClick} style={{ fontFamily: 'inherit', textAlign: 'left' }}>
      <div className="lib-doc-img-v2">
        <img
          src={doc.cover}
          alt={`Ảnh bìa ${doc.title}`}
          loading="lazy"
          onError={(e) => { e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="260" fill="%23DBEAFE"><rect width="400" height="260"/><text x="200" y="140" text-anchor="middle" fill="%232563EB" font-size="16" font-family="Arial">${encodeURIComponent((doc.title || '').slice(0, 20))}</text></svg>`; }}
        />
        <div className="lib-doc-overlay-v2">
          <Eye size={22} />
          <span>Xem chi tiết</span>
        </div>
        <span className="lib-doc-badge-v2" style={{ background: cat?.color || '#2563EB' }}>
          <CatIcon size={12} /> {cat?.label}
        </span>
      </div>
      <div className="lib-doc-body-v2">
        <span className="lib-doc-type-v2" style={{ color: cat?.color }}>
          <CatIcon size={13} /> {cat?.label}
        </span>
        <h4>{doc.title}</h4>
        <p>{(doc.description || '').slice(0, 80)}...</p>
        <div className="lib-doc-foot-v2">
          <div className="lib-doc-meta-left">
            <span className="lib-doc-author-v2">{doc.author}</span>
            <span className="lib-doc-dl"><Download size={13} /> {(doc.downloads || 0).toLocaleString('vi-VN')}</span>
          </div>
          <span className="lib-doc-read">Đọc ngay <ArrowRight size={14} /></span>
        </div>
      </div>
    </button>
  );
}
