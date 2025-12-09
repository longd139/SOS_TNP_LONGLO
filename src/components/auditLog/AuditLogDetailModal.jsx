import React from 'react';
import BaseModal from '../base/BaseModal';
import { formatDate } from '../../utils/formatDate';

const AuditLogDetailModal = ({ isOpen, onClose, auditLog, loading = false }) => {
  if (!auditLog) return null;

  const getActionBadge = (action) => {
    const badges = {
      'CREATE': { text: 'CREATE', className: 'bg-green-100 text-green-800' },
      'UPDATE': { text: 'UPDATE', className: 'bg-blue-100 text-blue-800' },
      'DELETE': { text: 'DELETE', className: 'bg-red-100 text-red-800' }
    };
    const badge = badges[action] || { text: action, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết thay đổi"
      size="3xl"
    >
      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-500">Đang tải thông tin...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người dùng
              </label>
              <div className="text-sm font-semibold text-gray-900">
                {auditLog.ten_nguoi_dung || 'N/A'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời gian
              </label>
              <div className="text-sm text-gray-900">
                {formatDate(auditLog.timestamp)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hành động
              </label>
              <div>
                {getActionBadge(auditLog.action)}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bảng
              </label>
              <div className="text-sm text-gray-900">
                {auditLog.table_name || '-'}
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-300 my-4" />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black-900 mb-2">
                Request Body
              </label>
              <div className="border border-gray-200 rounded-lg bg-gray-50 h-[450px]">
                {auditLog.request_body ? (
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words p-4 overflow-auto h-full">
                    {JSON.stringify(auditLog.request_body, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500 italic p-4">Không có dữ liệu</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-black-900 mb-2">
                Response Body
              </label>
              <div className="border border-gray-200 rounded-lg bg-gray-50 h-[450px]">
                {auditLog.response_body ? (
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-words p-4 overflow-auto h-full">
                    {JSON.stringify(auditLog.response_body, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500 italic p-4">Không có dữ liệu</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default AuditLogDetailModal;
