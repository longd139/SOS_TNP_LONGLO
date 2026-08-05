// ============================================================
// ADD LEGAL DOC MODAL — Form thêm văn bản pháp luật
// Dành cho role: RECEPTION_OFFICER, PROCESSING_OFFICER, APPROVER, LEADER, ADMIN
// ============================================================
import React, { useState } from 'react';
import { X, Image, Save, Scale, ArrowLeft } from 'lucide-react';

const STORAGE_KEY = 'libraryLawsData_v2';
const ALLOWED_ROLES = ['RECEPTION_OFFICER', 'PROCESSING_OFFICER', 'APPROVER', 'LEADER', 'ADMIN'];

export function canAddLegalDoc(role) {
  return ALLOWED_ROLES.includes(role);
}

const LAW_TYPES = ['Luật', 'Bộ luật', 'Nghị định', 'Hiến pháp'];
const LAW_STATUSES = ['Đang hiệu lực', 'Hết hiệu lực', 'Chưa có hiệu lực', 'Sắp có hiệu lực'];

export default function AddLegalDocModal({ isOpen, onClose, onSave, currentUser, onBack, typeLabel }) {
  const [form, setForm] = useState({
    title: '', code: '', type: 'Luật', issuingAgency: 'Quốc hội',
    issuedDate: '', effectiveDate: '', status: 'Đang hiệu lực',
    summary: '', cover: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSave = () => {
    if (!form.title.trim()) { setError('Vui lòng nhập tên văn bản'); return; }
    if (!form.code.trim()) { setError('Vui lòng nhập số hiệu văn bản'); return; }
    if (!form.issuingAgency.trim()) { setError('Vui lòng nhập cơ quan ban hành'); return; }

    setSaving(true);

    const newLaw = {
      id: `law-usr-${Date.now()}`,
      type: form.type,
      code: form.code.trim(),
      title: form.title.trim(),
      issuingAgency: form.issuingAgency.trim(),
      issuedDate: form.issuedDate || 'Chưa xác định',
      effectiveDate: form.effectiveDate || 'Chưa xác định',
      status: form.status,
      cover: form.cover || `https://images.unsplash.com/photo-${1589829545856 + Math.floor(Math.random() * 100)}?w=600&h=400&fit=crop`,
      summary: form.summary.trim(),
      downloads: 0,
      tags: [],
      chapters: [],
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
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newLaw, ...existing]));
    } catch (e) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newLaw]));
    }

    setTimeout(() => {
      onSave(newLaw);
      setForm({ title: '', code: '', type: 'Luật', issuingAgency: 'Quốc hội', issuedDate: '', effectiveDate: '', status: 'Đang hiệu lực', summary: '', cover: '' });
      setSaving(false);
      onClose();
    }, 300);
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors";
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center gap-3">
            {onBack && (
              <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-white/80 transition-colors" title="Quay lại chọn loại">
                <ArrowLeft size={18} className="text-gray-500" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Scale size={20} className="text-orange-600" /> Thêm văn bản pháp luật
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {typeLabel ? `Đang thêm: ${typeLabel}` : 'Văn bản sẽ được gửi chờ duyệt trước khi xuất bản'}
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
            <label className={labelClass}>Tên văn bản <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={e => handleChange('title', e.target.value)}
              className={inputClass} placeholder="VD: Luật Đất Đai 2024" />
          </div>

          {/* Code + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Số hiệu <span className="text-red-500">*</span></label>
              <input type="text" value={form.code} onChange={e => handleChange('code', e.target.value)}
                className={inputClass} placeholder="VD: Số 31/2024/QH15" />
            </div>
            <div>
              <label className={labelClass}>Loại văn bản</label>
              <select value={form.type} onChange={e => handleChange('type', e.target.value)} className={inputClass}>
                {LAW_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Issuing Agency + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Cơ quan ban hành <span className="text-red-500">*</span></label>
              <input type="text" value={form.issuingAgency} onChange={e => handleChange('issuingAgency', e.target.value)}
                className={inputClass} placeholder="VD: Quốc hội" />
            </div>
            <div>
              <label className={labelClass}>Trạng thái</label>
              <select value={form.status} onChange={e => handleChange('status', e.target.value)} className={inputClass}>
                {LAW_STATUSES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Ngày ban hành</label>
              <input type="text" value={form.issuedDate} onChange={e => handleChange('issuedDate', e.target.value)}
                className={inputClass} placeholder="VD: 18/01/2024" />
            </div>
            <div>
              <label className={labelClass}>Ngày hiệu lực</label>
              <input type="text" value={form.effectiveDate} onChange={e => handleChange('effectiveDate', e.target.value)}
                className={inputClass} placeholder="VD: 01/07/2024" />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className={labelClass}>Tóm tắt</label>
            <textarea rows={3} value={form.summary} onChange={e => handleChange('summary', e.target.value)}
              className={inputClass} placeholder="Mô tả ngắn gọn về nội dung văn bản..." />
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

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">{error}</div>
          )}

          {/* Role info */}
          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl text-xs text-orange-700">
            ⚖️ Bạn đang thêm với vai trò: <strong>{currentUser?.fullName || 'Khách'}</strong>. Văn bản sẽ ở trạng thái <strong>Chờ duyệt</strong>.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button onClick={handleSave} disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-sm"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Đang lưu...</>
            ) : (
              <><Save size={16} /> Thêm văn bản</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
