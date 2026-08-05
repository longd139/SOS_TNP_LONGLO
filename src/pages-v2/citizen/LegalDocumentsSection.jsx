// ============================================================
// LEGAL DOCUMENTS SECTION — Văn bản pháp luật (12)
// Component hiển thị danh sách văn bản pháp luật (read-only)
// Nút Thêm được quản lý tập trung tại DigitalLibraryPage
// ============================================================
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search, BookOpen, Download, X,
  TrendingUp, Scale, ArrowLeft, Calendar, Building2, Clock,
  AlertCircle, CheckCircle2, Bookmark, Share2, ChevronDown,
  ArrowRight,
} from 'lucide-react';
import {
  searchLaws,
  getLawById,
  getAllLaws,
} from '../../services/libraryService';
import {
  LawCardMini,
  gridStyles,
} from './shared/LibraryShared';

// ============================================
// CONSTANTS
// ============================================
const LAWS_PER_PAGE = 8;
const SECTION_TITLE = '⚖️ Văn bản pháp luật';
const SECTION_DESC = 'Tra cứu văn bản pháp luật quốc gia — Hiến pháp, Bộ luật, Luật và Nghị định';
const HERO_BG = 'from-orange-600 via-orange-700 to-red-800';

// ============================================================
// LAW DETAIL VIEW
// ============================================================
function LawDetail({ data, onClose }) {
  const [activeTocSection, setActiveTocSection] = useState('');
  const hasChapters = data.chapters && data.chapters.length > 0;

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
          Quay lại Văn bản pháp luật
        </button>
      </div>

      {/* Hero */}
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
                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mb-2">
                  {data.type}
                </span>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Download size={14} /> {data.downloads?.toLocaleString('vi-VN')} lượt tải</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors">
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
              <p className="text-sm text-gray-500 mb-1">{data.code}</p>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">{data.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{data.summary}</p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><Building2 size={14} />{data.issuingAgency}</span>
                {data.issuedDate && (
                  <span className="flex items-center gap-1.5"><Calendar size={14} />Ban hành: {data.issuedDate}</span>
                )}
                {data.effectiveDate && (
                  <span className="flex items-center gap-1.5"><Clock size={14} />Hiệu lực: {data.effectiveDate}</span>
                )}
                {data.status && (
                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                    data.status === 'Đang hiệu lực' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {data.status === 'Đang hiệu lực' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                    {data.status}
                  </span>
                )}
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

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Legal Info Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Scale size={16} className="text-orange-600" />
                  Thông tin văn bản
                </h3>
                <div className="space-y-2.5 text-sm">
                  {data.code && (
                    <div>
                      <span className="text-xs text-gray-400">Số hiệu</span>
                      <p className="text-gray-800 font-medium text-xs">{data.code}</p>
                    </div>
                  )}
                  {data.type && (
                    <div>
                      <span className="text-xs text-gray-400">Loại văn bản</span>
                      <p className="text-gray-800 font-medium text-xs">{data.type}</p>
                    </div>
                  )}
                  {data.issuingAgency && (
                    <div>
                      <span className="text-xs text-gray-400">Cơ quan ban hành</span>
                      <p className="text-gray-800 font-medium text-xs">{data.issuingAgency}</p>
                    </div>
                  )}
                  {data.issuedDate && (
                    <div>
                      <span className="text-xs text-gray-400">Ngày ban hành</span>
                      <p className="text-gray-800 font-medium text-xs">{data.issuedDate}</p>
                    </div>
                  )}
                  {data.effectiveDate && (
                    <div>
                      <span className="text-xs text-gray-400">Ngày hiệu lực</span>
                      <p className="text-gray-800 font-medium text-xs">{data.effectiveDate}</p>
                    </div>
                  )}
                  {data.status && (
                    <div>
                      <span className="text-xs text-gray-400">Trạng thái</span>
                      <p className={`text-xs font-medium ${data.status === 'Đang hiệu lực' ? 'text-green-600' : 'text-gray-600'}`}>
                        {data.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Table of Contents */}
              {hasChapters && (
                <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-orange-600" /> Mục lục
                  </h3>
                  <nav className="space-y-1">
                    {data.chapters.map((ch, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTocSection(ch.title)}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          activeTocSection === ch.title ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {ch.title}
                      </button>
                    ))}
                  </nav>
                </div>
              )}

              {/* Download CTA */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-100">
                <div className="flex items-center gap-2 mb-3">
                  <Download size={18} className="text-orange-600" />
                  <span className="text-sm font-semibold text-orange-900">Tải văn bản</span>
                </div>
                <p className="text-xs text-orange-700 mb-3">Tải về để xem offline hoặc in ấn</p>
                <button className="w-full py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2">
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
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</div>
              </section>

              {/* Chapters */}
              {hasChapters && data.chapters.map((ch, i) => (
                <section
                  key={i}
                  className={`mb-6 p-4 rounded-xl transition-colors ${activeTocSection === ch.title ? 'bg-orange-50/50 ring-1 ring-orange-100' : ''}`}
                >
                  <h2 className="text-base font-bold text-gray-900 mb-2">{ch.title}</h2>
                  {ch.articles && ch.articles.length > 0 && (
                    <ul className="space-y-1 pl-4">
                      {ch.articles.map((art, j) => (
                        <li key={j} className="text-sm text-gray-600 list-disc">{art}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Trust note */}
              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 mb-1">Lưu ý</p>
                  <p className="text-xs text-amber-700">
                    Văn bản này được cung cấp nhằm mục đích tham khảo. Để biết thông tin chính xác và cập nhật nhất, vui lòng truy cập Cổng Thông tin Điện tử Chính phủ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN: LegalDocumentsSection
// ============================================================
export default function LegalDocumentsSection({ currentUser, currentRole, userLaws = [], onLawSaved }) {
  // ---- state ----
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [visibleLaws, setVisibleLaws] = useState(LAWS_PER_PAGE);
  const [detailLaw, setDetailLaw] = useState(null);

  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  // ---- derived data ----
  const filteredLaws = useMemo(() => {
    const staticLaws = getAllLaws();
    const publishedUserLaws = userLaws.filter(l => l.adminStatus === 'PUBLISHED');
    const staticIds = new Set(staticLaws.map(l => l.id));
    const uniqueUserLaws = publishedUserLaws.filter(l => !staticIds.has(l.id));
    return [...uniqueUserLaws, ...staticLaws];
  }, [userLaws]);

  // ---- scroll to top ----
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    if (searchResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchResults]);

  useEffect(() => {
    if (detailLaw) window.scrollTo(0, 0);
  }, [detailLaw]);

  // ---- keyboard shortcut ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && detailLaw) setDetailLaw(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailLaw]);

  // ---- search handler ----
  const handleSearch = useCallback((query) => {
    const q = query.trim();
    if (!q) { setSearchResults(null); return; }
    setIsSearching(true);
    setTimeout(() => {
      const results = searchLaws(q);
      setSearchResults({ results, query: q });
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const hintQueries = ['Hiến pháp', 'Đất đai', 'Hình sự', 'Dân sự', 'Môi trường', 'Giao thông'];

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
  const openDetail = (law) => {
    const data = getLawById(law.id);
    if (data) setDetailLaw(data);
  };

  const closeDetail = () => setDetailLaw(null);

  // ---- load more ----
  const loadMore = () => setVisibleLaws(prev => Math.min(prev + LAWS_PER_PAGE, filteredLaws.length));
  const showAll = () => setVisibleLaws(filteredLaws.length);

  // ============================================
  // DETAIL VIEW
  // ============================================
  if (detailLaw) {
    return <LawDetail data={detailLaw} onClose={closeDetail} />;
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            {SECTION_TITLE}
          </h1>
          <p className="text-orange-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            {SECTION_DESC}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} role="search" aria-label="Tìm kiếm văn bản pháp luật"
            className="search-card max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 pl-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm văn bản pháp luật..."
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
              className="shrink-0 px-6 py-3 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center gap-2"
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
            {hintQueries.map(hint => (
              <button key={hint} onClick={() => handleHintClick(hint)}
                className="px-3 py-1.5 text-xs font-medium text-orange-100 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all border border-white/10"
              >{hint}</button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <Scale size={18} />
              <span className="text-sm"><strong className="text-white">{filteredLaws.length}</strong> văn bản luật</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="text-sm"><strong className="text-white">{filteredLaws.reduce((s, l) => s + (l.downloads || 0), 0).toLocaleString('vi-VN')}</strong> lượt tải</span>
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
            <p className="text-sm text-gray-500 mt-1">Tìm thấy {searchResults.results.length} văn bản pháp luật</p>
          </div>
          {searchResults.results.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.results.map(law => (
                <LawCardMini key={law.id} law={law} onClick={openDetail} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ALL LAWS SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">📋 Tất cả văn bản pháp luật</h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredLaws.length} văn bản — tra cứu và tham khảo
            </p>
          </div>
          {filteredLaws.length > LAWS_PER_PAGE && visibleLaws < filteredLaws.length && (
            <button onClick={showAll} className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0">
              Xem tất cả ({filteredLaws.length}) <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Law Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredLaws.slice(0, visibleLaws).map(law => (
            <LawCardMini key={law.id} law={law} onClick={openDetail} />
          ))}
        </div>

        {/* Load More */}
        {visibleLaws < filteredLaws.length && (
          <div className="text-center mt-8">
            <button onClick={loadMore} className="px-6 py-2.5 text-sm font-medium text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors flex items-center gap-2 mx-auto">
              Xem thêm ({filteredLaws.length - visibleLaws}) <ChevronDown size={16} />
            </button>
          </div>
        )}

        {filteredLaws.length === 0 && (
          <div className="text-center py-16">
            <Scale size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có văn bản nào</h3>
            <p className="text-gray-500 text-sm">Không tìm thấy văn bản pháp luật nào</p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <section className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          © 2026 UBND Phường Tăng Nhơn Phú. Văn bản pháp luật — Tra cứu và tham khảo.
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
  .hero-section { position: relative; }
  .search-card { animation: searchFloat 0.6s ease-out; }
  @keyframes searchFloat {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 680px) {
    .search-card { flex-direction: column; gap: 8px; }
    .search-card button[type="submit"] { width: 100%; justify-content: center; }
  }
  @media (max-width: 480px) { .hero-section h1 { font-size: 1.5rem; } }
  @media (prefers-reduced-motion: reduce) {
    .search-card { animation: none; }
    .hero-section * { animation: none !important; }
  }
  ${gridStyles}
`;
