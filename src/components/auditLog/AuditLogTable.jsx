import React from 'react';
import BaseTable from '../base/BaseTable';
import { formatDate } from '../../utils/formatDate';

const AuditLogTable = ({ data, loading, onView, pagination, onPageChange }) => {
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

  const getRoleBadge = (role) => {
    const badges = {
      'Admin': 'bg-purple-100 text-purple-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Staff': 'bg-green-100 text-green-800'
    };
    const className = badges[role] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${className}`}>
        {role}
      </span>
    );
  };

  const columns = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '180px',
      render: (timestamp) => (
        <span className="text-sm text-gray-900 whitespace-nowrap">
          {formatDate(timestamp)}
        </span>
      )
    },
    {
      title: 'Người dùng',
      dataIndex: 'ten_nguoi_dung',
      key: 'ten_nguoi_dung',
      width: '200px',
      render: (name) => (
        <span className="text-sm font-medium text-gray-900">
          {name || 'N/A'}
        </span>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      width: '120px',
      render: (roles) => (
        <div className="flex flex-wrap gap-1">
          {roles && roles.length > 0 ? (
            roles.map((role, index) => (
              <span key={index}>{getRoleBadge(role)}</span>
            ))
          ) : (
            <span className="text-sm text-gray-500">-</span>
          )}
        </div>
      )
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: '120px',
      render: (action) => getActionBadge(action)
    },
    {
      title: 'Bảng',
      dataIndex: 'table_name',
      key: 'table_name',
      width: '250px',
      render: (tableName) => (
        <span className="text-sm text-gray-900">
          {tableName || '-'}
        </span>
      )
    },
    {
      title: 'IP Address',
      dataIndex: 'remote_address',
      key: 'remote_address',
      width: '150px',
      render: (ip) => (
        <span className="text-sm font-mono text-gray-700">
          {ip || '-'}
        </span>
      )
    }
  ];

  return (
    <BaseTable
      data={data}
      columns={columns}
      loading={loading}
      onView={onView}
      canView={() => true}
      showActions={true}
      actionColumnWidth="80px"
      emptyMessage="Không có nhật ký hoạt động"
      pagination={pagination}
      onPageChange={onPageChange}
      className="mb-4"
    />
  );
};

export default AuditLogTable;
