// ============================================================
// ADMIN LIBRARY MANAGEMENT — Container với 2 tab độc lập
// Route: /admin/library
// Mỗi tab là 1 component riêng biệt, không dùng chung
// ============================================================
import React, { useState } from 'react';
import { Tabs } from 'antd';
import { FileTextOutlined, BookOutlined } from '@ant-design/icons';
import LocalDocManagement from './LocalDocManagement';
import LegalDocManagement from './LegalDocManagement';

export default function LibraryManagement() {
  const [activeTab, setActiveTab] = useState('documents');

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 m-0 flex items-center gap-2">
          <BookOutlined className="text-blue-600" /> Quản lý Thư Viện Số
        </h2>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          {activeTab === 'documents'
            ? 'Quản lý sách, báo cáo, văn bản, bản đồ của địa phương.'
            : 'Quản lý Hiến pháp, Bộ luật, Luật, Nghị định quốc gia.'}
        </p>
      </div>

      {/* Tabs — nổi bật với background + shadow */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-1.5 -mt-2">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="library-tabs"
          tabBarStyle={{ marginBottom: 0 }}
          items={[
            {
              key: 'documents',
              label: <span className="flex items-center gap-2 px-2"><FileTextOutlined />Tài liệu địa phương</span>,
              children: <LocalDocManagement key="docs" />,
            },
            {
              key: 'laws',
              label: <span className="flex items-center gap-2 px-2"><BookOutlined />Văn bản pháp luật</span>,
              children: <LegalDocManagement key="laws" />,
            },
          ]}
        />
      </div>

      <style>{`
        .library-tabs .ant-tabs-nav { margin-bottom: 0 !important; }
        .library-tabs .ant-tabs-nav::before { border-bottom: none !important; }
        .library-tabs .ant-tabs-tab {
          padding: 10px 16px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          border-radius: 12px !important;
          margin: 0 2px !important;
          transition: all 0.2s !important;
        }
        .library-tabs .ant-tabs-tab:hover { color: #4B5563 !important; background: #F9FAFB !important; }
        .library-tabs .ant-tabs-tab.ant-tabs-tab-active {
          background: #2563EB !important;
          box-shadow: 0 2px 8px rgba(37,99,235,0.3) !important;
        }
        .library-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #fff !important;
        }
        .library-tabs .ant-tabs-ink-bar { display: none !important; }
      `}</style>
    </div>
  );
}
