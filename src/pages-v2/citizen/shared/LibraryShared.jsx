// ============================================================
// LIBRARY SHARED — Components dùng chung cho Tài liệu địa phương & Văn bản pháp luật
// ============================================================
import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, FileText, Map, Scroll, Download,
  ChevronRight, Sparkles, Calendar, Scale, Globe, Shield, Landmark,
} from 'lucide-react';
import { getCategories } from '../../../services/libraryService';

// ============================================
// CONSTANTS
// ============================================
export const CATEGORY_ICONS = {
  'tu-sach': BookOpen,
  'tai-lieu': FileText,
  'van-ban': Scroll,
  'ban-do': Map,
};

export const LAW_TYPE_ICONS = {
  'Hiến pháp': Landmark,
  'Bộ luật': Scale,
  'Luật': Shield,
  'Nghị định': Globe,
};

// ============================================
// HOOK: useScrollReveal
// ============================================
export function useScrollReveal() {
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
// DocCardV2 — Card hiển thị tài liệu địa phương
// ============================================
export function DocCardV2({ doc, onClick, index }) {
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

// ============================================
// LawCardMini — Card hiển thị văn bản pháp luật
// ============================================
export function LawCardMini({ law, onClick }) {
  const Icon = LAW_TYPE_ICONS[law.type] || Scale;

  return (
    <button
      onClick={() => onClick(law)}
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

// ============================================
// CategoryChip — Chip lọc danh mục
// ============================================
export function CategoryChip({ category, active, onClick, count }) {
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

// ============================================
// LawTypeFilter — Chip lọc loại văn bản luật
// ============================================
export function LawTypeFilter({ lawTypes, activeType, onClick }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
      <button
        onClick={() => onClick('')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          !activeType
            ? 'bg-orange-600 text-white shadow-md'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
        }`}
      >
        Tất cả
      </button>
      {lawTypes.map(type => (
        <button
          key={type.value}
          onClick={() => onClick(type.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            activeType === type.value
              ? 'text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-orange-50'
          }`}
          style={activeType === type.value ? { backgroundColor: '#EA580C', boxShadow: '0 4px 12px #EA580C40' } : {}}
          aria-pressed={activeType === type.value}
        >
          {React.createElement(LAW_TYPE_ICONS[type.label] || Scale, { size: 16 })}
          {type.label}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeType === type.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
            {type.count}
          </span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// SHARED STYLES
// ============================================
export const gridStyles = `
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
  }

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
`;
