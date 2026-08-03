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
        title: 'STT',
        dataIndex: 'id',
        key: 'id',
        width: '50px',
        render: (value, record, index) => `#${index + 1 + (pagination.currentPage - 1) * pagination.pageSize}`
    },
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '150px',
      render: (timestamp) => (
        <span
          className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
          title={formatDate(timestamp)}>
          {formatDate(timestamp)}
        </span>
      )
    },
    {
      title: 'Người dùng',
      dataIndex: 'ten_nguoi_dung',
      key: 'ten_nguoi_dung',
      width: '150px',
      render: (name) => (
        <span 
        className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
          title={name || 'N/A'}>
          {name || 'N/A'}
        </span>
      )
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      key: 'roles',
      width: '150px',
      render: (roles) => (
        <div className="flex flex-wrap gap-1">
          {roles && roles.length > 0 ? (
            roles.map((role, index) => (
              <span
                title={role}
                className='block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900'
                key={index}>{getRoleBadge(role)}</span>
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
        <span 
          className="block max-w-[250px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm text-gray-900"
          title={tableName || '-'}
        >
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
        <span 
          className="block max-w-[150px] truncate text-ellipsis overflow-hidden whitespace-nowrap text-sm font-mono text-gray-700"
          title={ip || '-'}
        >
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
