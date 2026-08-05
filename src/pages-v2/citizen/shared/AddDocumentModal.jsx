// ============================================================
// UNIFIED ADD MODAL — Chọn loại tài liệu trước, sau đó hiện form tương ứng
// Dùng chung cho cả Tài liệu địa phương & Văn bản pháp luật
// ============================================================
import React, { useState } from 'react';
import { FileText, Scale } from 'lucide-react';
import AddLocalDocForm from './AddLocalDocModal';
import AddLegalDocForm from './AddLegalDocModal';

const DOC_TYPES = [
  {
    key: 'local', label: 'Tài liệu địa phương', icon: FileText,
    desc: 'Sách, báo cáo, văn bản, bản đồ của địa phương',
    color: 'emerald', gradient: 'from-emerald-500 to-teal-600',
    bgLight: 'bg-emerald-50', textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200', ringColor: 'ring-emerald-500',
  },
  {
    key: 'legal', label: 'Văn bản pháp luật', icon: Scale,
    desc: 'Hiến pháp, Bộ luật, Luật, Nghị định quốc gia',
    color: 'orange', gradient: 'from-orange-500 to-red-600',
    bgLight: 'bg-orange-50', textColor: 'text-orange-700',
    borderColor: 'border-orange-200', ringColor: 'ring-orange-500',
  },
];

export default function AddDocumentModal({ isOpen, onClose, onDocSaved, onLawSaved, currentUser, localCount, legalCount }) {
  const [selectedType, setSelectedType] = useState(null); // null | 'local' | 'legal'

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedType(null);
    onClose();
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  const handleSaved = (data) => {
    if (selectedType === 'local') onDocSaved(data);
    else onLawSaved(data);
    setSelectedType(null);
    onClose();
  };

  // ---- STEP 1: Chọn loại tài liệu ----
  if (!selectedType) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden z-10 animate-scaleIn"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-900 flex items-center justify-center">
              <FileText size={22} className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Thêm tài liệu mới</h2>
            <p className="text-sm text-gray-500 mt-1">Chọn loại tài liệu bạn muốn thêm vào hệ thống</p>
          </div>

          {/* Type Selector */}
          <div className="p-4 space-y-3">
            {DOC_TYPES.map(type => {
              const Icon = type.icon;
              const count = type.key === 'local' ? localCount : legalCount;
              return (
                <button
                  key={type.key}
                  onClick={() => setSelectedType(type.key)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left border-2 transition-all duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-1 ${type.borderColor} ${type.bgLight} hover:border-current focus:${type.ringColor}`}
                >
                  <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center shadow-sm`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{type.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                  </div>
                  <div className={`shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${type.bgLight} ${type.textColor}`}>
                    {count}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              Hủy
            </button>
          </div>
        </div>
        <style>{animStyles}</style>
      </div>
    );
  }

  // ---- STEP 2: Form tương ứng ----
  const typeMeta = DOC_TYPES.find(t => t.key === selectedType);
  return (
    <>
      {selectedType === 'local' && (
        <AddLocalDocForm
          isOpen={true}
          onClose={handleClose}
          onSave={handleSaved}
          currentUser={currentUser}
          onBack={handleBack}
          typeLabel={typeMeta.label}
        />
      )}
      {selectedType === 'legal' && (
        <AddLegalDocForm
          isOpen={true}
          onClose={handleClose}
          onSave={handleSaved}
          currentUser={currentUser}
          onBack={handleBack}
          typeLabel={typeMeta.label}
        />
      )}
    </>
  );
}

const animStyles = `
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  .animate-scaleIn {
    animation: scaleIn 0.2s ease-out;
  }
`;
