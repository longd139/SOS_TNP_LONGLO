// ============================================================
// LOCAL DOCUMENTS SECTION — Tài liệu địa phương (12)
// Component hiển thị danh sách tài liệu địa phương (read-only)
// Nút Thêm được quản lý tập trung tại DigitalLibraryPage
// ============================================================
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search, BookOpen, FileText, Download, X,
  TrendingUp, Library, ArrowLeft, Building2,
  AlertCircle, Bookmark, Share2, ChevronDown,
  Filter, ArrowRight, ExternalLink,
} from 'lucide-react';
import {
  searchDocuments,
  getDocumentById,
  getRelatedDocs,
  getCategories,
  getAllDocuments,
} from '../../services/libraryService';
import { searchHints } from './data/libraryData';
import {
  DocCardV2, CategoryChip,
  gridStyles,
} from './shared/LibraryShared';

// ============================================
// CONSTANTS
// ============================================
const DOCS_PER_PAGE = 8;
const SECTION_TITLE = '📚 Tài liệu địa phương';
const SECTION_DESC = 'Tra cứu tài liệu, văn bản, sách và bản đồ của địa phương — nhanh chóng, chính xác';
const HERO_BG = 'from-emerald-600 via-emerald-700 to-teal-800';

// ============================================================
// LOCAL DOCUMENT DETAIL VIEW
// ============================================================
function LocalDocDetail({ data, onClose }) {
  const [activeTocSection, setActiveTocSection] = useState('');
  const cat = getCategories().find(c => c.id === data.category);
  const hasSections = data.sections && data.sections.length > 0;
  const relatedDocs = useMemo(() => getRelatedDocs(data), [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{gridStyles}</style>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:text-gray-900 transition-all"
        >
          <ArrowLeft size={16} />
          Quay lại Tài liệu địa phương
        </button>
      </div>

      {/* Hero with cover */}
      <div className="detail-hero relative mt-4">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.cover})`, filter: 'blur(40px)', opacity: 0.3 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/90" />

        <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Cover card */}
            <div className="detail-cover-card shrink-0 w-full md:w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
              <img src={data.cover} alt={data.title} className="w-full h-48 md:h-40 object-cover" />
              <div className="p-4">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold text-white mb-2"
                  style={{ backgroundColor: cat?.color || '#2563EB' }}
                >
                  {data.docType || cat?.name}
                </span>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Download size={14} /> {data.downloads?.toLocaleString('vi-VN')} lượt tải</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                    <Download size={14} /> Tải về
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Bookmark size={14} />
                  </button>
                  <button className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Meta info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">{data.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{data.summary || data.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Building2 size={14} />{data.author}</span>
              </div>
              {data.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {data.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body: Sidebar + Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Table of Contents */}
              {hasSections && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-600" /> Mục lục
                  </h3>
                  <nav className="space-y-1">
                    {data.sections.map((section, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTocSection(section.heading)}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          activeTocSection === section.heading ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {section.heading}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Download CTA */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                  <Download size={18} className="text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">Tải tài liệu</span>
                </div>
                <p className="text-xs text-emerald-700 mb-3">Tải về để xem offline hoặc in ấn</p>
                <button className="w-full py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                  <Download size={14} /> Tải PDF ({data.downloads?.toLocaleString('vi-VN')} lượt)
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-3">📖 Giới thiệu</h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {data.summary || data.description}
                </div>
              </section>

              {/* Sections */}
              {hasSections && data.sections.map((section, i) => (
                <section
                  key={i}
                  id={`section-${i}`}
                  className={`mb-8 p-4 rounded-xl transition-colors ${activeTocSection === section.heading ? 'bg-emerald-50/50 ring-1 ring-emerald-100' : ''}`}
                >
                  <h2 className="text-base font-bold text-gray-900 mb-3">{section.heading}</h2>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>
                </section>
              ))}

              {/* Trust note */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Lưu ý</p>
                  <p className="text-xs text-amber-700">
                    Tài liệu này được cung cấp nhằm mục đích tham khảo. Để biết thông tin chính xác và cập nhật nhất, vui lòng liên hệ trực tiếp UBND Phường Tăng Nhơn Phú.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Documents */}
            {relatedDocs.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📚 Tài liệu liên quan</h2>
                <div className="related-scroll flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
                  {relatedDocs.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => window.scrollTo(0, 0)}
                      className="shrink-0 w-56 text-left bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <div className="h-28 overflow-hidden">
                        <img src={doc.cover} alt={doc.title} loading="lazy" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-2">{doc.title}</h4>
                        <p className="text-[10px] text-gray-500 mt-1">{doc.author}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN: LocalDocumentsSection
// ============================================================
export default function LocalDocumentsSection({ currentUser, currentRole, userDocs = [], onDocSaved }) {
  // ---- state ----
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleDocs, setVisibleDocs] = useState(DOCS_PER_PAGE);
  const [detailDoc, setDetailDoc] = useState(null);

  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const allDocsRef = useRef(null);

  // ---- derived data ----
  const allDocs = useMemo(() => {
    const staticDocs = getAllDocuments();
    const publishedUserDocs = userDocs.filter(d => d.adminStatus === 'PUBLISHED');
    // Tránh trùng id
    const staticIds = new Set(staticDocs.map(d => d.id));
    const uniqueUserDocs = publishedUserDocs.filter(d => !staticIds.has(d.id));
    return [...uniqueUserDocs, ...staticDocs];
  }, [userDocs]);

  const filteredDocs = useMemo(() => {
    return activeCategory ? allDocs.filter(d => d.category === activeCategory) : allDocs;
  }, [activeCategory, allDocs]);

  const categories = useMemo(() => {
    return getCategories().map(c => ({ ...c, count: allDocs.filter(d => d.category === c.id).length }));
  }, [allDocs]);

  // ---- scroll to top on mount ----
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ---- scroll to results when search completes ----
  useEffect(() => {
    if (searchResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchResults]);

  // ---- scroll detail to top when opening ----
  useEffect(() => {
    if (detailDoc) window.scrollTo(0, 0);
  }, [detailDoc]);

  // ---- keyboard shortcut ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && detailDoc) setDetailDoc(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailDoc]);

  // ---- search handler ----
  const handleSearch = useCallback((query) => {
    const q = query.trim();
    if (!q) { setSearchResults(null); return; }
    setIsSearching(true);
    setTimeout(() => {
      const results = searchDocuments(q);
      setSearchResults({ results, query: q });
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleHintClick = (hint) => {
    setSearchQuery(hint);
    handleSearch(hint);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    searchInputRef.current?.focus();
  };

  // ---- detail handlers ----
  const openDetail = (doc) => {
    const data = getDocumentById(doc.id);
    if (data) setDetailDoc(data);
  };

  const closeDetail = () => setDetailDoc(null);

  // ---- load more ----
  const loadMore = () => setVisibleDocs(prev => Math.min(prev + DOCS_PER_PAGE, filteredDocs.length));
  const showAll = () => setVisibleDocs(filteredDocs.length);

  // ---- category change ----
  const handleCategoryChange = (catId) => {
    setActiveCategory(prev => prev === catId ? '' : catId);
    setVisibleDocs(DOCS_PER_PAGE);
    setSearchResults(null);
    setSearchQuery('');
  };

  // ============================================
  // DETAIL VIEW
  // ============================================
  if (detailDoc) {
    return <LocalDocDetail data={detailDoc} onClose={closeDetail} />;
  }

  // ============================================
  // MAIN VIEW
  // ============================================
  return (
    <>
    <div className="min-h-screen bg-gray-50">
      <style>{mainStyles}</style>

      {/* HERO SEARCH SECTION */}
      <section className="hero-section relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${HERO_BG}`} />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {SECTION_TITLE}
          </h1>
          <p className="text-emerald-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            {SECTION_DESC}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} role="search" aria-label="Tìm kiếm tài liệu địa phương"
            className="search-card max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 pl-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu địa phương..."
                className="flex-1 py-3 text-sm bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                aria-label="Nhập từ khóa tìm kiếm"
              />
              {searchQuery && (
                <button type="button" onClick={clearSearch} className="p-1 rounded-full hover:bg-gray-100 transition-colors" aria-label="Xóa tìm kiếm">
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="shrink-0 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang tìm...
                </span>
              ) : ( <><Search size={16} /> Tìm kiếm</> )}
            </button>
          </form>

          {/* Hint Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-2xl mx-auto">
            {searchHints.slice(0, 6).map(hint => (
              <button key={hint} onClick={() => handleHintClick(hint)}
                className="px-3 py-1.5 text-xs font-medium text-emerald-100 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all border border-white/10"
              >{hint}</button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <Library size={18} />
              <span className="text-sm"><strong className="text-white">{filteredDocs.length}</strong> tài liệu</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="text-sm"><strong className="text-white">{filteredDocs.reduce((s, d) => s + d.downloads, 0).toLocaleString('vi-VN')}</strong> lượt tải</span>
            </div>
          </div>

          <div className="mt-12 animate-bounce">
            <ChevronDown size={20} className="text-white/50 mx-auto" />
          </div>
        </div>
      </section>

      {/* SEARCH RESULTS */}
      {searchResults && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Kết quả tìm kiếm cho "{searchResults.query}"</h2>
            <p className="text-sm text-gray-500 mt-1">Tìm thấy {searchResults.results.length} tài liệu địa phương</p>
          </div>
          {searchResults.results.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác hoặc duyệt theo danh mục bên dưới</p>
            </div>
          ) : (
            <div className="doc-grid">
              {searchResults.results.map((doc, i) => (
                <DocCardV2 key={doc.id} doc={doc} onClick={openDetail} index={i} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ALL DOCUMENTS SECTION */}
      <section ref={allDocsRef} className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory ? `${categories.find(c => c.id === activeCategory)?.name || ''}` : '📂 Tất cả tài liệu'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDocs.length} tài liệu{activeCategory ? ' trong danh mục này' : ' — duyệt và khám phá'}
            </p>
          </div>
          {filteredDocs.length > DOCS_PER_PAGE && visibleDocs < filteredDocs.length && (
            <button onClick={showAll} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0">
              Xem tất cả ({filteredDocs.length}) <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => { setActiveCategory(''); setVisibleDocs(DOCS_PER_PAGE); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !activeCategory ? 'bg-gray-900 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          ><Filter size={16} /> Tất cả</button>
          {categories.map(cat => (
            <CategoryChip key={cat.id} category={cat} active={activeCategory === cat.id} onClick={handleCategoryChange} count={cat.count} />
          ))}
        </div>

        {/* Document Grid */}
        <div className="doc-grid">
          {filteredDocs.slice(0, visibleDocs).map((doc, i) => (
            <DocCardV2 key={doc.id} doc={doc} onClick={openDetail} index={i} />
          ))}
        </div>

        {/* Load More */}
        {visibleDocs < filteredDocs.length && (
          <div className="text-center mt-8">
            <button onClick={loadMore} className="px-6 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 mx-auto">
              Xem thêm ({filteredDocs.length - visibleDocs}) <ChevronDown size={16} />
            </button>
          </div>
        )}

        {filteredDocs.length === 0 && (
          <div className="text-center py-16">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có tài liệu</h3>
            <p className="text-gray-500 text-sm">Danh mục này hiện chưa có tài liệu nào</p>
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">🔍 Không tìm thấy tài liệu bạn cần?</h2>
              <p className="text-emerald-100 text-sm md:text-base max-w-lg">
                Gửi yêu cầu đến chúng tôi. Đội ngũ UBND Phường sẽ hỗ trợ bạn tìm kiếm hoặc bổ sung tài liệu vào thư viện số.
              </p>
            </div>
            <button className="shrink-0 px-6 py-3 bg-white text-emerald-700 text-sm font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2">
              <ExternalLink size={16} /> Gửi yêu cầu
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          © 2026 UBND Phường Tăng Nhơn Phú. Tài liệu địa phương — Tra cứu và khám phá.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Ctrl+K</kbd> để tìm kiếm nhanh
        </p>
      </section>
    </div>
  </>
  );
}

// ============================================
// EMBEDDED STYLES
// ============================================
const mainStyles = `
  .hero-section {
    position: relative;
  }
  .search-card {
    animation: searchFloat 0.6s ease-out;
  }
  @keyframes searchFloat {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .doc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  @media (max-width: 1100px) { .doc-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 900px) { .doc-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 680px) {
    .doc-grid { grid-template-columns: 1fr; }
    .search-card { flex-direction: column; gap: 8px; }
    .search-card button[type="submit"] { width: 100%; justify-content: center; }
  }
  @media (max-width: 480px) { .hero-section h1 { font-size: 1.5rem; } }
  .related-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
  .related-scroll::-webkit-scrollbar { height: 6px; }
  .related-scroll::-webkit-scrollbar-track { background: transparent; }
  .related-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
  @media (prefers-reduced-motion: reduce) {
    .search-card { animation: none; }
    .hero-section * { animation: none !important; }
  }
  ${gridStyles}
`;
