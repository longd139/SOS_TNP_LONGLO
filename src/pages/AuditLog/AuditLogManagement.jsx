import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { showToast } from '../../utils/toastNotification';
import useAuditLog from '../../hooks/useAuditLog';
import AuditLogFilter from '../../components/auditLog/AuditLogFilter';
import AuditLogTable from '../../components/auditLog/AuditLogTable';
import AuditLogDetailModal from '../../components/auditLog/AuditLogDetailModal';

export default function AuditLogManagement() {
  const {
    auditLogs,
    selectedAuditLog,
    loading,
    detailLoading,
    error,
    pagination,
    filters,
    fetchDetail,
    handleFilterChange,
    handleResetFilters,
    handlePageChange
  } = useAuditLog();

  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    auditLog: null
  });

  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  const handleViewDetail = async (auditLog) => {
    try {
      setDetailModal({
        isOpen: true,
        auditLog: null
      });

      await fetchDetail(auditLog.id);

      setDetailModal({
        isOpen: true,
        auditLog: auditLog
      });
    } catch (error) {
      showToast.error(error.message || 'Không thể tải chi tiết nhật ký');
      setDetailModal({
        isOpen: false,
        auditLog: null
      });
    }
  };

  const handleDetailModalClose = () => {
    setDetailModal({
      isOpen: false,
      auditLog: null
    });
  };

  const handleFilterSubmit = (filterData) => {
    const formattedFilters = {
      search: filterData.search?.trim() || '',
      from: filterData.from || '',
      to: filterData.to || '',
      page: 1,
      size: pagination?.pageSize || 10
    };

    handleFilterChange(formattedFilters);
  };

  const handleResetFilter = () => {
    handleResetFilters();
  };

  return (
    <div className="min-h-screen">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Chi tiết hoạt động
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Nhật ký chính sửa và hoạt động của người dùng
          </p>
        </div>
      </div>

      <AuditLogFilter
        onFilter={handleFilterSubmit}
        onReset={handleResetFilter}
        initialFilters={{
          search: filters.search || '',
          from: filters.from || '',
          to: filters.to || ''
        }}
      />

      <div className="flex flex-col mb-4 sm:flex-row sm:justify-between sm:items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-900 mb-0">
            Nhật ký hoạt động ({pagination?.totalItems || 0})
          </h3>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang tải...</span>
          </div>
        )}
      </div>

      <AuditLogTable
        data={auditLogs}
        loading={loading}
        onView={handleViewDetail}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      <AuditLogDetailModal
        isOpen={detailModal.isOpen}
        onClose={handleDetailModalClose}
        auditLog={selectedAuditLog}
        loading={detailLoading}
      />
    </div>
  );
}
