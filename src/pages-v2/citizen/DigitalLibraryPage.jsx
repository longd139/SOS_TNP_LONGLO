// ============================================================
// DIGITAL LIBRARY PAGE — Thư Viện Số cho Citizen Portal
// Route: /cong-dong/thu-vien-so
// Container với 2 tab + 1 nút Thêm chung (chọn role bên trong modal)
// ============================================================
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Scale, Plus } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import LocalDocumentsSection from './LocalDocumentsSection';
import LegalDocumentsSection from './LegalDocumentsSection';
import AddDocumentModal from './shared/AddDocumentModal';

const STORAGE_KEY_DOCS = 'libraryDocsData_v2';
const STORAGE_KEY_LAWS = 'libraryLawsData_v2';
const ALLOWED_ROLES = ['RECEPTION_OFFICER', 'PROCESSING_OFFICER', 'APPROVER', 'LEADER', 'ADMIN'];

export default function DigitalLibraryPage() {
  const { currentUser, currentRole } = useMock();
  const [activeTab, setActiveTab] = useState('local');
  const [showAddModal, setShowAddModal] = useState(false);

  const canAdd = ALLOWED_ROLES.includes(currentRole);

  const [userDocs, setUserDocs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DOCS) || '[]'); }
    catch { return []; }
  });
  const [userLaws, setUserLaws] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY_LAWS) || '[]'); }
    catch { return []; }
  });

  useEffect(() => { window.scrollTo(0, 0); }, [activeTab]);

  const localCount = useMemo(() => 12 + userDocs.filter(d => d.adminStatus === 'PUBLISHED').length, [userDocs]);
  const legalCount = useMemo(() => 12 + userLaws.filter(l => l.adminStatus === 'PUBLISHED').length, [userLaws]);

  const TABS = [
    { key: 'local', label: 'Tài liệu địa phương', count: localCount, icon: BookOpen, color: 'emerald' },
    { key: 'legal', label: 'Văn bản pháp luật', count: legalCount, icon: Scale, color: 'orange' },
  ];

  const handleDocSaved = (newDoc) => setUserDocs(prev => [newDoc, ...prev]);
  const handleLawSaved = (newLaw) => setUserLaws(prev => [newLaw, ...prev]);

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{tabStyles}</style>

      {/* Tab Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-1">
              <div className="mr-6 flex items-center gap-2">
                <span className="text-lg">📚</span>
                <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Thư Viện Số</h1>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`tab-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        isActive
                          ? tab.color === 'emerald'
                            ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200 focus:ring-emerald-500'
                            : 'bg-white text-orange-700 shadow-sm ring-1 ring-gray-200 focus:ring-orange-500'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                      }`}
                    >
                      <Icon size={16} className={isActive ? (tab.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600') : ''} />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? (tab.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700')
                          : 'bg-gray-200 text-gray-500'
                      }`}>{tab.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Single Add Button */}
            {canAdd && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-all shadow-sm"
              >
                <Plus size={16} /> Thêm tài liệu
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'local' && (
          <LocalDocumentsSection key="local" currentUser={currentUser} currentRole={currentRole} userDocs={userDocs} onDocSaved={handleDocSaved} />
        )}
        {activeTab === 'legal' && (
          <LegalDocumentsSection key="legal" currentUser={currentUser} currentRole={currentRole} userLaws={userLaws} onLawSaved={handleLawSaved} />
        )}
      </div>

      {/* Unified Add Modal (chọn role bên trong) */}
      <AddDocumentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onDocSaved={handleDocSaved}
        onLawSaved={handleLawSaved}
        currentUser={currentUser}
        localCount={localCount}
        legalCount={legalCount}
      />
    </div>
  );
}

const tabStyles = `
  .tab-btn { position: relative; }
  .tab-btn:active { transform: scale(0.97); }
  @media (max-width: 640px) { .tab-btn span { display: none; } }
`;
