// ============================================================
// DIGITAL LIBRARY PAGE — Thư Viện Số cho Citizen Portal
// Route: /cong-dong/thu-vien-so
// ============================================================
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Search, BookOpen, FileText, Map, Scroll, Download,
  ChevronRight, X, TrendingUp, Library, ArrowLeft,
  Calendar, Building2, Clock, AlertCircle, CheckCircle2,
  Bookmark, Share2, ExternalLink, Filter, ChevronDown,
  Sparkles, ArrowRight, Globe, Shield, Scale, Landmark,
} from 'lucide-react';
import {
  searchDocuments,
  searchLaws,
  getDocumentById,
  getLawById,
  getRelatedDocs,
  getLibraryStats,
  getCategories,
  getAllDocuments,
} from '../../services/libraryService';
import { searchHints } from './data/libraryData';

// ============================================
// CONSTANTS
// ============================================
const DOCS_PER_PAGE = 8;

const CATEGORY_ICONS = {
  'tu-sach': BookOpen,
  'tai-lieu': FileText,
  'van-ban': Scroll,
  'ban-do': Map,
};

const LAW_TYPE_ICONS = {
  'Hiến pháp': Landmark,
  'Bộ luật': Scale,
  'Luật': Shield,
  'Nghị định': Globe,
};

// ============================================
// UTILITY HOOKS
// ============================================

// Scroll reveal animation hook
function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

// ============================================
// SUB-COMPONENTS
// ============================================

// --- DocCardV2 ---
function DocCardV2({ doc, onClick, index }) {
  const [ref, visible] = useScrollReveal();
  const cat = getCategories().find(c => c.id === doc.category);
  const Icon = CATEGORY_ICONS[doc.category] || FileText;

  return (
    <button
      ref={ref}
      onClick={() => onClick(doc)}
      className={`group text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${(index % 4) * 50}ms` }}
      aria-label={`Xem chi tiết: ${doc.title}`}
    >
      {/* Cover Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={doc.cover}
          alt={doc.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Category Badge */}
        <span
          className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm"
          style={{ backgroundColor: cat?.color || '#2563EB', color: '#fff' }}
        >
          <Icon size={12} />
          {doc.docType || cat?.name}
        </span>
        {doc.featured && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-amber-900 flex items-center gap-1">
            <Sparkles size={10} /> NỔI BẬT
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {doc.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3 line-clamp-1">{doc.author}</p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Download size={12} />
            {doc.downloads?.toLocaleString('vi-VN') || 0}
          </span>
          <span className="text-xs font-medium text-blue-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            Đọc ngay <ChevronRight size={12} />
          </span>
        </div>
      </div>
    </button>
  );
}

// --- LawCardMini ---
function LawCardMini({ law, onClick }) {
  const Icon = LAW_TYPE_ICONS[law.type] || Scale;

  return (
    <button
      onClick={() => onClick(law, true)}
      className="group text-left bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-full"
      aria-label={`Xem chi tiết luật: ${law.title}`}
    >
      <div className="p-4 flex items-start gap-3">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
          <Icon size={18} className="text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">{law.type}</span>
            <span className="text-[10px] text-gray-400">{law.code}</span>
          </div>
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {law.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{law.issuingAgency}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={10} /> {law.issuedDate}</span>
            <span className="flex items-center gap-1"><Download size={10} /> {law.downloads?.toLocaleString('vi-VN')}</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
      </div>
    </button>
  );
}

// --- CategoryChip ---
function CategoryChip({ category, active, onClick, count }) {
  return (
    <button
      onClick={() => onClick(category.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
        active
          ? 'text-white shadow-md'
          : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
      style={active ? { backgroundColor: category.color, boxShadow: `0 4px 12px ${category.color}40` } : {}}
      aria-pressed={active}
    >
      {React.createElement(CATEGORY_ICONS[category.id] || FileText, { size: 16 })}
      {category.name}
      {count !== undefined && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DigitalLibraryPage() {
  // ---- state ----
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchResults, setSearchResults] = useState(null); // null = chưa search, [] = đã search nhưng ko có kq
  const [isSearching, setIsSearching] = useState(false);
  const [visibleDocs, setVisibleDocs] = useState(DOCS_PER_PAGE);
  const [detailItem, setDetailItem] = useState(null); // { data, isLaw }
  const [activeTocSection, setActiveTocSection] = useState('');
  const [stats] = useState(() => getLibraryStats());

  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);
  const detailContentRef = useRef(null);

  // ---- derived data ----
  const filteredDocs = useMemo(() => {
    return activeCategory ? getAllDocuments(activeCategory) : getAllDocuments();
  }, [activeCategory]);

  const categories = useMemo(() => {
    const cats = getCategories();
    return cats.map(c => ({
      ...c,
      count: getAllDocuments(c.id).length,
    }));
  }, []);

  // ---- scroll to top on mount ----
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ---- scroll to results when search completes ----
  useEffect(() => {
    if (searchResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchResults]);

  // ---- scroll detail to top when opening ----
  useEffect(() => {
    if (detailItem) {
      window.scrollTo(0, 0);
      setActiveTocSection('');
    }
  }, [detailItem]);

  // ---- keyboard shortcut: Ctrl+K to focus search ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && detailItem) {
        setDetailItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [detailItem]);

  // ---- search handler ----
  const handleSearch = useCallback((query) => {
    const q = query.trim();
    if (!q) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    // Giả lập độ trễ search
    setTimeout(() => {
      const localResults = searchDocuments(q);
      const lawResults = searchLaws(q);
      setSearchResults({ local: localResults, laws: lawResults, query: q });
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
  const openDetail = (item, isLaw = false) => {
    const data = isLaw ? getLawById(item.id) : getDocumentById(item.id);
    if (data) {
      setDetailItem({ data, isLaw });
    }
  };

  const closeDetail = () => {
    setDetailItem(null);
  };

  // ---- load more ----
  const loadMore = () => {
    setVisibleDocs(prev => Math.min(prev + DOCS_PER_PAGE, filteredDocs.length));
  };

  const showAll = () => {
    setVisibleDocs(filteredDocs.length);
  };

  // ---- category change ----
  const handleCategoryChange = (catId) => {
    setActiveCategory(prev => prev === catId ? '' : catId);
    setVisibleDocs(DOCS_PER_PAGE);
    setSearchResults(null);
    setSearchQuery('');
  };

  // ---- related docs ----
  const relatedDocs = useMemo(() => {
    if (!detailItem) return [];
    return getRelatedDocs(detailItem.data);
  }, [detailItem]);

  // ============================================
  // DETAIL VIEW
  // ============================================
  if (detailItem) {
    const { data, isLaw } = detailItem;
    const cat = getCategories().find(c => c.id === data.category);
    const hasSections = data.sections && data.sections.length > 0;
    const hasChapters = data.chapters && data.chapters.length > 0;

    return (
      <div className="min-h-screen bg-gray-50">
        <style>{detailStyles}</style>

        {/* Back button */}
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <button
            onClick={closeDetail}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:text-gray-900 transition-all"
          >
            <ArrowLeft size={16} />
            Quay lại Thư Viện Số
          </button>
        </div>

        {/* Hero with cover */}
        <div className="detail-hero relative mt-4">
          {/* Blurred background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${data.cover})`, filter: 'blur(40px)', opacity: 0.3 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white/90" />

          {/* Content */}
          <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* Cover card */}
              <div className="detail-cover-card shrink-0 w-full md:w-64 bg-white rounded-2xl shadow-xl overflow-hidden">
                <img
                  src={data.cover}
                  alt={data.title}
                  className="w-full h-48 md:h-40 object-cover"
                />
                <div className="p-4">
                  {isLaw ? (
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 mb-2">
                      {data.type}
                    </span>
                  ) : (
                    <span
                      className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold text-white mb-2"
                      style={{ backgroundColor: cat?.color || '#2563EB' }}
                    >
                      {data.docType || cat?.name}
                    </span>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Download size={14} /> {data.downloads?.toLocaleString('vi-VN')} lượt tải</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
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
                {isLaw && <p className="text-sm text-gray-500 mb-1">{data.code}</p>}
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-snug">
                  {data.title}
                </h1>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {data.summary || data.description}
                </p>

                {/* Meta tags */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={14} />
                    {data.author || data.issuingAgency}
                  </span>
                  {data.issuedDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      Ban hành: {data.issuedDate}
                    </span>
                  )}
                  {data.effectiveDate && (
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      Hiệu lực: {data.effectiveDate}
                    </span>
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

                {/* Tags */}
                {data.tags && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {data.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors">
                        #{tag}
                      </span>
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
                {/* Legal Info Card (for laws or van-ban) */}
                {(isLaw || data.category === 'van-ban') && (
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Scale size={16} className="text-blue-600" />
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
                )}

                {/* Table of Contents */}
                {(hasSections || hasChapters) && (
                  <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen size={16} className="text-blue-600" />
                      Mục lục
                    </h3>
                    <nav className="space-y-1">
                      {hasSections && data.sections.map((section, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTocSection(section.heading)}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            activeTocSection === section.heading
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {section.heading}
                        </button>
                      ))}
                      {hasChapters && data.chapters.map((ch, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveTocSection(ch.title)}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg transition-colors ${
                            activeTocSection === ch.title
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {ch.title}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}

                {/* Download CTA */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Download size={18} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">Tải tài liệu</span>
                  </div>
                  <p className="text-xs text-blue-700 mb-3">Tải về để xem offline hoặc in ấn</p>
                  <button className="w-full py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                    <Download size={14} /> Tải PDF ({data.downloads?.toLocaleString('vi-VN')} lượt)
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0" ref={detailContentRef}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                {/* Introduction */}
                <section className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">📖 Giới thiệu</h2>
                  <div className="prose-citizen text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {data.summary || data.description}
                  </div>
                </section>

                {/* Sections */}
                {hasSections && data.sections.map((section, i) => (
                  <section
                    key={i}
                    id={`section-${i}`}
                    className={`mb-8 p-4 rounded-xl transition-colors ${activeTocSection === section.heading ? 'bg-blue-50/50 ring-1 ring-blue-100' : ''}`}
                  >
                    <h2 className="text-base font-bold text-gray-900 mb-3">{section.heading}</h2>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </section>
                ))}

                {/* Chapters (for laws) */}
                {hasChapters && data.chapters.map((ch, i) => (
                  <section
                    key={i}
                    className={`mb-6 p-4 rounded-xl transition-colors ${activeTocSection === ch.title ? 'bg-blue-50/50 ring-1 ring-blue-100' : ''}`}
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
                      Tài liệu này được cung cấp nhằm mục đích tham khảo. Để biết thông tin chính xác và cập nhật nhất, vui lòng liên hệ trực tiếp UBND Phường Tăng Nhơn Phú hoặc truy cập Cổng Thông tin Điện tử Chính phủ.
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
                        onClick={() => openDetail(doc)}
                        className="shrink-0 w-56 text-left bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

  // ============================================
  // MAIN VIEW (Browse + Search)
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{mainStyles}</style>

      {/* ============================================ */}
      {/* HERO SEARCH SECTION */}
      {/* ============================================ */}
      <section className="hero-section relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative max-w-4xl mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            📚 Thư Viện Số
          </h1>
          <p className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Tra cứu tài liệu địa phương và văn bản pháp luật quốc gia — nhanh chóng, chính xác, miễn phí
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            aria-label="Tìm kiếm tài liệu"
            className="search-card max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2 pl-3">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu, văn bản pháp luật..."
                className="flex-1 py-3 text-sm bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                aria-label="Nhập từ khóa tìm kiếm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Xóa tìm kiếm"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="shrink-0 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang tìm...
                </span>
              ) : (
                <>
                  <Search size={16} /> Tìm kiếm
                </>
              )}
            </button>
          </form>

          {/* Hint Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-5 max-w-2xl mx-auto">
            {searchHints.slice(0, 6).map(hint => (
              <button
                key={hint}
                onClick={() => handleHintClick(hint)}
                className="px-3 py-1.5 text-xs font-medium text-blue-100 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-sm transition-all border border-white/10"
              >
                {hint}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/80">
            <div className="flex items-center gap-2">
              <Library size={18} />
              <span className="text-sm"><strong className="text-white">{stats.totalDocs}</strong> tài liệu địa phương</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale size={18} />
              <span className="text-sm"><strong className="text-white">{stats.totalLaws}</strong> văn bản luật</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="text-sm"><strong className="text-white">{stats.totalDownloads?.toLocaleString('vi-VN')}</strong> lượt tải</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-12 animate-bounce">
            <ChevronDown size={20} className="text-white/50 mx-auto" />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* SEARCH RESULTS SECTION */}
      {/* ============================================ */}
      {searchResults && (
        <section ref={resultsRef} className="max-w-6xl mx-auto px-4 py-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Kết quả tìm kiếm cho "{searchResults.query}"
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Tìm thấy {searchResults.local.length} tài liệu địa phương và {searchResults.laws.length} văn bản luật
            </p>
          </div>

          {searchResults.local.length === 0 && searchResults.laws.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 text-sm">Thử tìm kiếm với từ khóa khác hoặc duyệt theo danh mục bên dưới</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Local docs results */}
              {searchResults.local.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                    <FileText size={16} /> Tài liệu địa phương ({searchResults.local.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {searchResults.local.map((doc, i) => (
                      <DocCardV2 key={doc.id} doc={doc} onClick={openDetail} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {/* Law results */}
              {searchResults.laws.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <Scale size={16} /> Văn bản pháp luật ({searchResults.laws.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.laws.map(law => (
                      <LawCardMini key={law.id} law={law} onClick={openDetail} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ============================================ */}
      {/* ALL DOCUMENTS SECTION */}
      {/* ============================================ */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeCategory
                ? `${categories.find(c => c.id === activeCategory)?.name || ''}`
                : '📂 Tất cả tài liệu'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDocs.length} tài liệu
              {activeCategory ? ` trong danh mục này` : ' — duyệt và khám phá'}
            </p>
          </div>
          {filteredDocs.length > DOCS_PER_PAGE && visibleDocs < filteredDocs.length && (
            <button
              onClick={showAll}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 shrink-0"
            >
              Xem tất cả ({filteredDocs.length}) <ArrowRight size={14} />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => { setActiveCategory(''); setVisibleDocs(DOCS_PER_PAGE); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              !activeCategory
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            <Filter size={16} /> Tất cả
          </button>
          {categories.map(cat => (
            <CategoryChip
              key={cat.id}
              category={cat}
              active={activeCategory === cat.id}
              onClick={handleCategoryChange}
              count={cat.count}
            />
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
            <button
              onClick={loadMore}
              className="px-6 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2 mx-auto"
            >
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

      {/* ============================================ */}
      {/* CTA BANNER */}
      {/* ============================================ */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                🔍 Không tìm thấy tài liệu bạn cần?
              </h2>
              <p className="text-blue-100 text-sm md:text-base max-w-lg">
                Gửi yêu cầu đến chúng tôi. Đội ngũ UBND Phường sẽ hỗ trợ bạn tìm kiếm hoặc bổ sung tài liệu vào thư viện số.
              </p>
            </div>
            <button className="shrink-0 px-6 py-3 bg-white text-blue-700 text-sm font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-2">
              <ExternalLink size={16} /> Gửi yêu cầu
            </button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* HOW IT WORKS SECTION */}
      {/* ============================================ */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-900 text-center mb-2">📋 Cách sử dụng Thư Viện Số</h2>
        <p className="text-sm text-gray-500 text-center mb-8">Chỉ với 3 bước đơn giản để tìm kiếm tài liệu bạn cần</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: Search, title: 'Tìm kiếm', desc: 'Nhập từ khóa vào thanh tìm kiếm hoặc chọn danh mục tài liệu bạn quan tâm. Có thể tìm theo tên, tác giả, hoặc nội dung.' },
            { step: '02', icon: BookOpen, title: 'Khám phá', desc: 'Duyệt qua kết quả, xem thông tin chi tiết về từng tài liệu bao gồm mô tả, tác giả, số lượt tải và nội dung.' },
            { step: '03', icon: Download, title: 'Tải về', desc: 'Tải tài liệu về máy để xem offline hoặc in ấn. Tất cả tài liệu đều được cung cấp miễn phí cho người dân.' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 flex items-center justify-center">
                <item.icon size={24} className="text-blue-600" />
              </div>
              <div className="text-xs font-bold text-blue-200 mb-2">{item.step}</div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* FOOTER NOTE */}
      {/* ============================================ */}
      <section className="max-w-6xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-400">
          © 2026 UBND Phường Tăng Nhơn Phú. Thư Viện Số — Tra cứu tài liệu và văn bản pháp luật.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-mono">Ctrl+K</kbd> để tìm kiếm nhanh
        </p>
      </section>
    </div>
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
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .doc-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  @media (max-width: 1100px) {
    .doc-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 900px) {
    .doc-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 680px) {
    .doc-grid {
      grid-template-columns: 1fr;
    }
    .search-card {
      flex-direction: column;
      gap: 8px;
    }
    .search-card button[type="submit"] {
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    .hero-section h1 {
      font-size: 1.5rem;
    }
  }

  .related-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }

  .related-scroll::-webkit-scrollbar {
    height: 6px;
  }

  .related-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .related-scroll::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .search-card {
      animation: none;
    }
    .hero-section * {
      animation: none !important;
    }
  }
`;

const detailStyles = `
  .detail-cover-card {
    animation: cardSlideIn 0.4s ease-out;
  }

  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    .detail-hero .flex {
      flex-direction: column;
    }
    .detail-cover-card {
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .detail-cover-card {
      animation: none;
    }
  }
`;