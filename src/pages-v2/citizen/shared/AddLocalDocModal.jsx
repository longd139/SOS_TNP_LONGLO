// ============================================================
// ADD LOCAL DOC MODAL — Form thêm tài liệu địa phương
// Dành cho role: RECEPTION_OFFICER, PROCESSING_OFFICER, APPROVER, LEADER, ADMIN
// ============================================================
import React, { useState } from 'react';
import { X, Image, Save, ArrowLeft } from 'lucide-react';
import { getCategories } from '../../../services/libraryService';

const STORAGE_KEY = 'libraryDocsData_v2';
const ALLOWED_ROLES = ['RECEPTION_OFFICER', 'PROCESSING_OFFICER', 'APPROVER', 'LEADER', 'ADMIN'];

export function canAddLocalDoc(role) {
  return ALLOWED_ROLES.includes(role);
}

const DOC_TYPES = ['Sách', 'Báo cáo', 'Hướng dẫn', 'Đề án', 'Quyết định', 'Nghị quyết', 'Chỉ thị', 'Tài liệu'];

export default function AddLocalDocModal({ isOpen, onClose, onSave, currentUser, onBack, typeLabel }) {
  const categories = getCategories();

  const [form, setForm] = useState({
    title: '', author: '', category: 'tai-lieu', docType: 'Tài liệu',
    description: '', tags: '', cover: '', featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSave = () => {
    if (!form.title.trim()) { setError('Vui lòng nhập tiêu đề tài liệu'); return; }
    if (!form.author.trim()) { setError('Vui lòng nhập tác giả / cơ quan ban hành'); return; }

    setSaving(true);
    const tagArray = form.tags.split(',').map(t => t.trim()).filter(Boolean);

    const newDoc = {
      id: `doc-usr-${Date.now()}`,
      category: form.category,
      title: form.title.trim(),
      author: form.author.trim(),
      cover: form.cover || `https://images.unsplash.com/photo-${1589829085413 + Math.floor(Math.random() * 100)}?w=600&h=400&fit=crop`,
      description: form.description.trim(),
      downloads: 0,
      featured: form.featured,
      docType: form.docType,
      tags: tagArray,
      sections: [],
      // Admin metadata
      adminStatus: 'PENDING',
      createdBy: currentUser?.fullName || currentUser?.phone || 'Người dùng',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      approvedBy: null, approvedAt: null, publishedAt: null,
      viewCount: 0, rejectionReason: null,
    };

    // Save to localStorage (merge with existing)
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newDoc, ...existing]));
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newDoc]));
    }

    setTimeout(() => {
      onSave(newDoc);
      setForm({ title: '', author: '', category: 'tai-lieu', docType: 'Tài liệu', description: '', tags: '', cover: '', featured: false });
      setSaving(false);
      onClose();
    }, 300);
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 overflow-y-auto" onClick={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/80 transition-colors" title="Quay lại chọn loại">
                <ArrowLeft size={18} className="text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900">➕ Thêm tài liệu địa phương</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {typeLabel ? `Đang thêm: ${typeLabel}` : 'Tài liệu sẽ được gửi chờ duyệt trước khi xuất bản'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/80 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className={labelClass}>Tiêu đề <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
              className={inputClass} placeholder="Nhập tiêu đề tài liệu..." />
          </div>

          {/* Author */}
          <div>
            <label className={labelClass}>Tác giả / Cơ quan ban hành <span className="text-red-500">*</span></label>
            <input type="text" value={form.author} onChange={e => handleChange('author', e.target.value)}
              className={inputClass} placeholder="VD: UBND Phường Tăng Nhơn Phú" />
          </div>

          {/* Category + DocType */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Danh mục</label>
              <select value={form.category} onChange={e => handleChange('category', e.target.value)} className={inputClass}>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Loại tài liệu</label>
              <select value={form.docType} onChange={e => handleChange('docType', e.target.value)} className={inputClass}>
                {DOC_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Mô tả</label>
            <textarea rows={3} value={form.description} onChange={e => handleChange('description', e.target.value)}
              className={inputClass} placeholder="Mô tả ngắn gọn về tài liệu..." />
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Thẻ (tags)</label>
            <input type="text" value={form.tags} onChange={e => handleChange('tags', e.target.value)}
              className={inputClass} placeholder="phân cách bằng dấu phẩy: lịch sử, địa phương, văn hóa" />
          </div>

          {/* Cover URL */}
          <div>
            <label className={labelClass}>Link ảnh bìa</label>
            <div className="flex items-center gap-2">
              <Image size={16} className="text-gray-400 shrink-0" />
              <input type="text" value={form.cover} onChange={e => handleChange('cover', e.target.value)}
                className={inputClass} placeholder="https://... (để trống để dùng ảnh mặc định)" />
            </div>
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={e => handleChange('featured', e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-sm text-gray-700">Đánh dấu là tài liệu nổi bật</span>
          </label>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Role info */}
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">
            📝 Bạn đang thêm với vai trò: <strong>{currentUser?.fullName || 'Khách'}</strong>. Tài liệu sẽ ở trạng thái <strong>Chờ duyệt</strong>.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              <><Save size={16} /> Thêm tài liệu</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
