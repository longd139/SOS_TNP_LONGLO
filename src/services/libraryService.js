// ============================================================
// LIBRARY SERVICE — Service layer cho Thư Viện Số
// MOCK_MODE = true → dùng dữ liệu ảo từ libraryData.js
// MOCK_MODE = false → gọi API thật từ backend
// ============================================================

import {
  libraryDocuments,
  lawsData,
  libraryCategories,
  getDocumentById as getDocById,
  getLawById as getLawByIdFromData,
  getFeaturedDocuments,
  getRelatedDocuments,
} from '../pages-v2/citizen/data/libraryData';

const MOCK_MODE = true;

// ============================================
// TÌM KIẾM TÀI LIỆU ĐỊA PHƯƠNG
// ============================================
export function searchDocuments(query = '', category = '') {
  if (!MOCK_MODE) {
    // TODO: Gọi API thật
    // return fetch(`/api/documents/search?q=${query}&category=${category}`).then(r => r.json());
    return [];
  }

  let results = [...libraryDocuments];
  const q = query.toLowerCase().trim();

  if (q) {
    results = results.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.description.toLowerCase().includes(q) ||
        doc.tags.some((t) => t.toLowerCase().includes(q)) ||
        doc.author.toLowerCase().includes(q) ||
        (doc.docType && doc.docType.toLowerCase().includes(q))
    );
  }

  if (category) {
    results = results.filter((doc) => doc.category === category);
  }

  return results;
}

// ============================================
// TÌM KIẾM LUẬT QUỐC GIA
// ============================================
export function searchLaws(query = '') {
  if (!MOCK_MODE) {
    // TODO: Gọi API thật
    // const params = new URLSearchParams({ q: query, page: 1, limit: 20 });
    // return fetch(`/api/library/search?${params}`).then(r => r.json());
    return [];
  }

  const q = query.toLowerCase().trim();
  if (!q) return [];

  return lawsData.filter(
    (law) =>
      law.title.toLowerCase().includes(q) ||
      law.code.toLowerCase().includes(q) ||
      law.summary.toLowerCase().includes(q) ||
      law.tags.some((t) => t.toLowerCase().includes(q)) ||
      law.type.toLowerCase().includes(q) ||
      law.issuingAgency.toLowerCase().includes(q)
  );
}

// ============================================
// LẤY CHI TIẾT TÀI LIỆU
// ============================================
export function getDocumentById(id) {
  if (!MOCK_MODE) {
    // TODO: fetch(`/api/documents/${id}`).then(r => r.json());
    return null;
  }
  return getDocById(id) || null;
}

// ============================================
// LẤY CHI TIẾT LUẬT
// ============================================
export function getLawById(id) {
  if (!MOCK_MODE) {
    // TODO: fetch(`/api/library/laws/${id}`).then(r => r.json());
    return null;
  }
  return getLawByIdFromData(id) || null;
}

// ============================================
// LẤY TÀI LIỆU NỔI BẬT
// ============================================
export function getFeaturedDocs() {
  if (!MOCK_MODE) {
    // TODO: fetch('/api/library/laws/featured').then(r => r.json());
    return [];
  }
  return getFeaturedDocuments();
}

// ============================================
// LẤY TÀI LIỆU LIÊN QUAN
// ============================================
export function getRelatedDocs(doc) {
  if (!MOCK_MODE) {
    // TODO: fetch(`/api/documents/${doc.id}/related`).then(r => r.json());
    return [];
  }
  return getRelatedDocuments(doc);
}

// ============================================
// LẤY THỐNG KÊ
// ============================================
export function getLibraryStats() {
  if (!MOCK_MODE) {
    // TODO: fetch('/api/library/stats').then(r => r.json());
    return { totalDocs: 0, totalLaws: 0, totalDownloads: 0, totalCategories: 0 };
  }

  const totalDownloads = libraryDocuments.reduce((sum, d) => sum + d.downloads, 0) +
    lawsData.reduce((sum, l) => sum + (l.downloads || 0), 0);

  return {
    totalDocs: libraryDocuments.length,
    totalLaws: lawsData.length,
    totalDownloads,
    totalCategories: libraryCategories.length,
  };
}

// ============================================
// LẤY DANH SÁCH DANH MỤC
// ============================================
export function getCategories() {
  return libraryCategories;
}

// ============================================
// LẤY TẤT CẢ TÀI LIỆU (theo category)
// ============================================
export function getAllDocuments(category = '') {
  if (!MOCK_MODE) {
    // TODO: fetch(`/api/documents?category=${category}`).then(r => r.json());
    return [];
  }

  if (category) {
    return libraryDocuments.filter((d) => d.category === category);
  }
  return [...libraryDocuments];
}

// Lấy tất cả luật
export function getAllLaws() {
  if (!MOCK_MODE) {
    // TODO: fetch('/api/library/laws').then(r => r.json());
    return [];
  }
  return [...lawsData];
}