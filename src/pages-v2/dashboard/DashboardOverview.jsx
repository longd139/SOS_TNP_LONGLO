// ============================================================
// DASHBOARD OVERVIEW — Đầy đủ KPI + 5 biểu đồ + 2 bảng (PAGE D-01)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, FileCheck, FileText,
  MessageSquare, Send, TrendingUp, TrendingDown, Filter,
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import Chart from '../../components/dashboard/Chart';
import { useMock } from '../../mock/MockContext';
import {
  getCategoryById, getNeighborhoodById, getDepartmentById,
  getUserById, getStatusLabel, getSlaLabel, getSlaColor,
  categories, neighborhoods, departments,
} from '../../mock/db';
import { formatDate, formatDateShort } from '../../utils/formatDate';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// ============================================================
// Tiny inline chart components (ponytail: CSS bars beat Recharts for simple breakdowns)
// ============================================================

// Horizontal bar chart for status/category/neighborhood breakdown
function HBar({ data, colorMap }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="space-y-1.5">
      {data.map(d => (
        <div key={d.label} className="flex items-center gap-2 text-xs">
          <span className="w-28 text-gray-600 truncate flex-shrink-0">{d.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(d.count / max) * 100}%`,
                minWidth: d.count > 0 ? '8px' : 0,
                backgroundColor: colorMap?.[d.label] || '#3B82F6',
              }}
            />
          </div>
          <span className="w-8 text-right text-gray-700 font-medium flex-shrink-0">{d.count}</span>
        </div>
      ))}
      {data.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Không có dữ liệu</p>}
    </div>
  );
}

// SVG Donut for SLA
function SlaDonut({ onTime, nearDue, overdue, notApplicable }) {
  const total = onTime + nearDue + overdue + notApplicable || 1;
  const segments = [
    { value: onTime, color: '#22c55e', label: 'Đúng hạn' },
    { value: nearDue, color: '#eab308', label: 'Sắp đến hạn' },
    { value: overdue, color: '#ef4444', label: 'Quá hạn' },
    { value: notApplicable, color: '#94a3b8', label: 'Chưa XĐ' },
  ].filter(s => s.value > 0);

  return (
    <div className="flex items-center gap-6">
      <svg width="110" height="110" viewBox="0 0 36 36" className="shrink-0">
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          const dash = (pct / 100) * 100;
          const offset = segments.slice(0, i).reduce((a, x) => a + ((x.value / total) * 100), 0);
          return (
            <circle
              key={s.label}
              cx="18" cy="18" r="14" fill="none"
              stroke={s.color} strokeWidth="4"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 18 18)"
              className="transition-all duration-700"
            />
          );
        })}
        <text x="18" y="18" textAnchor="middle" className="text-[6px] font-bold fill-gray-800">{total}</text>
        <text x="18" y="22" textAnchor="middle" className="text-[3px] fill-gray-400">Tổng</text>
      </svg>
      <div className="space-y-1.5 text-xs">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600">{s.label}</span>
            <span className="font-semibold text-gray-800">{s.value}</span>
            <span className="text-gray-400">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// CONSTANTS
// ============================================================
const PERIODS = [
  { key: 'today', label: 'Hôm nay' },
  { key: '7d', label: '7 ngày' },
  { key: '30d', label: '30 ngày' },
  { key: 'thisMonth', label: 'Tháng này' },
  { key: 'thisQuarter', label: 'Quý này' },
  { key: 'custom', label: 'Tùy chọn' },
];

const STATUS_BAR_COLORS = {
  'Mới gửi': '#9CA3AF',
  'Chờ tiếp nhận': '#93C5FD',
  'Đã tiếp nhận': '#3B82F6',
  'Đã phân công': '#8B5CF6',
  'Đang xử lý': '#F97316',
  'Chờ duyệt GH': '#EAB308',
  'Hoàn thành': '#22C55E',
  'Từ chối': '#FCA5A5',
};

const CATEGORY_COLORS = [
  '#3B82F6', '#22C55E', '#F97316', '#EF4444', '#8B5CF6', '#EAB308', '#EC4899', '#6B7280',
];

// ============================================================
// MAIN
// ============================================================
export default function DashboardOverview() {
  const navigate = useNavigate();
  const { complaints, history } = useMock();

  // Common filters
  const [period, setPeriod] = useState('30d');
  const [filterKp, setFilterKp] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // Simulate loading
  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // ---- Filtered data ----
  const filtered = useMemo(() => {
    const now = new Date();
    let since = new Date(now.getTime() - 30 * 86400000);
    let until = now;

    if (period === 'today') {
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === '7d') {
      since = new Date(now.getTime() - 7 * 86400000);
    } else if (period === 'thisMonth') {
      since = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'thisQuarter') {
      const quarterStart = Math.floor(now.getMonth() / 3) * 3;
      since = new Date(now.getFullYear(), quarterStart, 1);
    } else if (period === 'custom') {
      if (customFrom) since = new Date(customFrom);
      if (customTo) until = new Date(customTo + 'T23:59:59');
    }

    return complaints.filter(c => {
      const d = new Date(c.createdAt);
      if (d < since) return false;
      if (period === 'custom' && customTo && d > until) return false;
      if (filterKp && c.neighborhoodId !== filterKp) return false;
      if (filterCat && c.categoryId !== filterCat) return false;
      if (filterDept && c.assignedDepartmentId !== filterDept) return false;
      if (filterUrgency && (c.confirmedUrgency || c.citizenUrgency) !== filterUrgency) return false;
      return true;
    });
  }, [complaints, period, customFrom, customTo, filterKp, filterCat, filterDept, filterUrgency]);

  // Previous period for comparison
  const prevPeriod = useMemo(() => {
    const now = new Date();
    let since, prevSince;
    if (period === 'today') { since = new Date(now.getFullYear(), now.getMonth(), now.getDate()); prevSince = new Date(since.getTime() - 86400000); }
    else if (period === '7d') { since = new Date(now.getTime() - 7 * 86400000); prevSince = new Date(since.getTime() - 7 * 86400000); }
    else if (period === 'thisMonth') { since = new Date(now.getFullYear(), now.getMonth(), 1); prevSince = new Date(now.getFullYear(), now.getMonth() - 1, 1); }
    else if (period === 'thisQuarter') { const qs = Math.floor(now.getMonth() / 3) * 3; since = new Date(now.getFullYear(), qs, 1); prevSince = new Date(now.getFullYear(), qs - 3, 1); }
    else if (period === 'custom') { since = customFrom ? new Date(customFrom) : new Date(now.getTime() - 30 * 86400000); prevSince = new Date(since.getTime() - (customFrom && customTo ? (new Date(customTo) - new Date(customFrom)) : 30 * 86400000)); }
    else { since = new Date(now.getTime() - 30 * 86400000); prevSince = new Date(since.getTime() - 30 * 86400000); }

    const until = period === 'custom' && customTo ? new Date(customTo + 'T23:59:59') : since;

    return complaints.filter(c => {
      const d = new Date(c.createdAt);
      return d >= prevSince && d < since;
    });
  }, [complaints, period, customFrom, customTo]);

  // ---- Stats ----
  const stats = useMemo(() => {
    const newly = filtered.filter(c => c.status === 'NEW' || c.status === 'PENDING_RECEPTION');
    const inProgress = filtered.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'EXTENSION_PENDING'].includes(c.status));
    const completed = filtered.filter(c => c.status === 'COMPLETED');
    const overdueNow = filtered.filter(c => c.slaStatus === 'OVERDUE');
    const urgentAll = filtered.filter(c => (c.confirmedUrgency || c.citizenUrgency) === 'URGENT');
    const urgentPending = urgentAll.filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED');
    const nearDueNow = filtered.filter(c => c.slaStatus === 'NEAR_DUE');
    const completedLate = filtered.filter(c => c.slaStatus === 'COMPLETED_LATE');

    const prevTotal = prevPeriod.length;
    const pctChange = prevTotal > 0 ? Math.round(((filtered.length - prevTotal) / prevTotal) * 100) : 0;

    return {
      total: filtered.length,
      pctChange,
      newlyCount: newly.length,
      inProgressCount: inProgress.length,
      nearDueCount: nearDueNow.length,
      completedCount: completed.length,
      completedRate: filtered.length > 0 ? Math.round((completed.length / filtered.length) * 100) : 0,
      overdueCount: overdueNow.length,
      completedLateCount: completedLate.length,
      urgentTotal: urgentAll.length,
      urgentPendingCount: urgentPending.length,
    };
  }, [filtered, prevPeriod]);

  // ---- Chart data ----

  // 1. Status breakdown
  const statusData = useMemo(() => {
    const groups = {};
    filtered.forEach(c => { const lbl = getStatusLabel(c.status); groups[lbl] = (groups[lbl] || 0) + 1; });
    return Object.entries(groups).map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [filtered]);

  // 2. SLA donut data
  const slaData = useMemo(() => {
    const onTime = filtered.filter(c => c.slaStatus === 'ON_TIME' || c.slaStatus === 'COMPLETED_ON_TIME').length;
    const nearDue = filtered.filter(c => c.slaStatus === 'NEAR_DUE').length;
    const overdue = filtered.filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE').length;
    const na = filtered.filter(c => c.slaStatus === 'NOT_APPLICABLE' || c.slaStatus === 'PENDING_EXTENSION' || !c.slaStatus).length;
    return { onTime, nearDue, overdue, notApplicable: na };
  }, [filtered]);

  // 3. 7-day trend (line chart)
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const dayComplaints = complaints.filter(c => c.createdAt.slice(0, 10) === ds);
      days.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        tongPhanAnh: dayComplaints.length,
        daGiaiQuyet: dayComplaints.filter(c => c.status === 'COMPLETED').length,
        quaHan: dayComplaints.filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE').length,
      });
    }
    return days;
  }, [complaints]);

  // 4. By category
  const categoryData = useMemo(() => {
    return categories.filter(c => c.status === 'ACTIVE').map((c, i) => ({
      label: c.name,
      count: filtered.filter(x => x.categoryId === c.id).length,
      color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
  }, [filtered]);

  // 5. By neighborhood
  const neighborhoodData = useMemo(() => {
    return neighborhoods.filter(n => n.status === 'ACTIVE').map(n => {
      const nc = filtered.filter(c => c.neighborhoodId === n.id);
      return {
        label: n.name,
        total: nc.length,
        inProgress: nc.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'EXTENSION_PENDING'].includes(c.status)).length,
        overdue: nc.filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE').length,
      };
    }).filter(d => d.total > 0).sort((a, b) => b.total - a.total).slice(0, 8);
  }, [filtered]);

  // ---- Attention list ----
  const attentionList = useMemo(() => {
    return filtered
      .filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED')
      .filter(c => c.slaStatus === 'NEAR_DUE' || c.slaStatus === 'OVERDUE'
        || (c.confirmedUrgency || c.citizenUrgency) === 'URGENT'
        || c.extensionCount >= 2)
      .sort((a, b) => {
        const urgencyScore = (c) => ((c.confirmedUrgency || c.citizenUrgency) === 'URGENT' ? 3 : 0) + (c.slaStatus === 'OVERDUE' ? 5 : c.slaStatus === 'NEAR_DUE' ? 3 : 0) + (c.extensionCount || 0);
        return urgencyScore(b) - urgencyScore(a);
      })
      .slice(0, 10);
  }, [filtered]);

  // ---- Department performance ----
  const deptPerformance = useMemo(() => {
    return departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => {
      const deptComplaints = filtered.filter(c => c.assignedDepartmentId === d.id);
      const done = deptComplaints.filter(c => c.status === 'COMPLETED');
      const onTime = done.filter(c => c.slaStatus === 'COMPLETED_ON_TIME');
      return {
        id: d.id,
        name: d.name,
        total: deptComplaints.length,
        inProgress: deptComplaints.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'EXTENSION_PENDING'].includes(c.status)).length,
        completed: done.length,
        onTime: onTime.length,
        late: done.filter(c => c.slaStatus === 'COMPLETED_LATE').length,
        onTimeRate: done.length > 0 ? Math.round((onTime.length / done.length) * 100) : 0,
      };
    }).filter(d => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered]);

  // ---- Helpers ----
  const hasActiveFilters = filterKp || filterCat || filterDept || filterUrgency;
  const resetFilters = () => { setFilterKp(''); setFilterCat(''); setFilterDept(''); setFilterUrgency(''); };

  const selectCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  // ---- Skeleton ----
  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm h-28">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm h-64" />
          <div className="bg-white rounded-xl p-5 shadow-sm h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-full">
      {/* ---- Page title ---- */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">Thống kê hoạt động hệ thống</p>
      </div>

      {/* ---- Period filter ---- */}
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
              period === p.key
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-gray-400 text-xs">-</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          Bộ lọc
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
        </button>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700">
            Xoá bộ lọc
          </button>
        )}
      </div>

      {/* ---- Expanded filters ---- */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Khu phố</label>
              <select value={filterKp} onChange={e => setFilterKp(e.target.value)} className={selectCls}>
                <option value="">Tất cả</option>
                {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Loại phản ánh</label>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className={selectCls}>
                <option value="">Tất cả</option>
                {categories.filter(c => c.status === 'ACTIVE').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Đơn vị xử lý</label>
              <select value={filterDept} onChange={e => setFilterDept(e.target.value)} className={selectCls}>
                <option value="">Tất cả</option>
                {departments.filter(d => d.status === 'ACTIVE' && d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP').map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Mức độ</label>
              <select value={filterUrgency} onChange={e => setFilterUrgency(e.target.value)} className={selectCls}>
                <option value="">Tất cả</option>
                <option value="URGENT">Khẩn cấp</option>
                <option value="NORMAL">Thông thường</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ---- KPI Row ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Tổng phản ánh"
          value={stats.total}
          icon={<MessageSquare />}
          color="blue"
          subtitle={prevPeriod.length > 0 ? (
            <span className={`text-xs flex items-center gap-1 ${stats.pctChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.pctChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stats.pctChange >= 0 ? '+' : ''}{stats.pctChange}% so với kỳ trước
            </span>
          ) : undefined}
        />
        <StatCard
          title="Phản ánh mới"
          value={stats.newlyCount}
          icon={<Send />}
          color="gray"
          subtitle={<span className="text-xs text-gray-500">Chưa tiếp nhận</span>}
        />
        <StatCard
          title="Đang xử lý"
          value={stats.inProgressCount}
          icon={<Clock />}
          color="orange"
          subtitle={stats.nearDueCount > 0 ? (
            <span className="text-xs text-yellow-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {stats.nearDueCount} sắp hết hạn
            </span>
          ) : <span className="text-xs text-gray-500">Không có sắp hết hạn</span>}
        />
        <StatCard
          title="Hoàn thành"
          value={stats.completedCount}
          icon={<CheckCircle />}
          color="green"
          subtitle={<span className="text-xs text-gray-500">Tỷ lệ: {stats.completedRate}%</span>}
        />
        <StatCard
          title="Quá hạn"
          value={stats.overdueCount}
          icon={<AlertTriangle />}
          color="red"
          subtitle={stats.completedLateCount > 0 ? (
            <span className="text-xs text-red-500">{stats.completedLateCount} hoàn thành trễ hạn</span>
          ) : undefined}
        />
        <StatCard
          title="Khẩn cấp"
          value={stats.urgentTotal}
          icon={<FileCheck />}
          color="violet"
          subtitle={stats.urgentPendingCount > 0 ? (
            <span className="text-xs text-red-500">{stats.urgentPendingCount} chưa hoàn thành</span>
          ) : <span className="text-xs text-gray-500">Đã xử lý hết</span>}
        />
      </div>

      {/* ---- Charts row 1: Status + SLA ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Status breakdown */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
            Phản ánh theo trạng thái
          </h3>
          <HBar data={statusData} colorMap={STATUS_BAR_COLORS} />
        </div>

        {/* 2. SLA donut */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
            Đúng hạn và trễ hạn
          </h3>
          <SlaDonut {...slaData} />
        </div>
      </div>

      {/* ---- Charts row 2: Line trend ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
          Xu hướng phản ánh theo thời gian
        </h3>
        <div className="min-h-72 w-full">
          <Chart
            type="line"
            noCard
            data={trendData}
            lines={[
              { key: 'tongPhanAnh', color: '#3B82F6', name: 'Tổng phản ánh' },
              { key: 'daGiaiQuyet', color: '#22C55E', name: 'Hoàn thành' },
              { key: 'quaHan', color: '#EF4444', name: 'Quá hạn' },
            ]}
          />
        </div>
      </div>

      {/* ---- Charts row 3: By category + By neighborhood ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 4. By category */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
            Phản ánh theo loại
          </h3>
          <HBar
            data={categoryData}
            colorMap={Object.fromEntries(categoryData.map(d => [d.label, d.color]))}
          />
        </div>

        {/* 5. By neighborhood */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
            Phản ánh theo khu phố
          </h3>
          <div className="space-y-1.5">
            {neighborhoodData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">Không có dữ liệu</p>
            ) : (
              (() => {
                const maxTotal = Math.max(...neighborhoodData.map(d => d.total), 1);
                return neighborhoodData.map(d => (
                  <div key={d.label} className="flex items-center gap-2 text-xs">
                    <span className="w-20 text-gray-600 truncate flex-shrink-0">{d.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden flex">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${((d.total - d.inProgress - d.overdue) / maxTotal) * 100}%`, minWidth: d.total - d.inProgress - d.overdue > 0 ? '4px' : 0 }}
                        title="Khác"
                      />
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${(d.inProgress / maxTotal) * 100}%`, minWidth: d.inProgress > 0 ? '4px' : 0 }}
                        title="Đang xử lý"
                      />
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${(d.overdue / maxTotal) * 100}%`, minWidth: d.overdue > 0 ? '4px' : 0 }}
                        title="Quá hạn"
                      />
                    </div>
                    <span className="w-8 text-right text-gray-700 font-medium flex-shrink-0">{d.total}</span>
                  </div>
                ));
              })()
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-400 ml-20">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Khác</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> Đang xử lý</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-500 inline-block" /> Quá hạn</span>
          </div>
        </div>
      </div>

      {/* ---- Table 1: Phản ánh cần chú ý ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
          Phản ánh cần chú ý
        </h3>
        {attentionList.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Không có phản ánh nào cần chú ý</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Mã PA', 'Tiêu đề', 'Khu phố', 'Đơn vị', 'Hạn xử lý', 'Tình trạng', 'Thao tác'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attentionList.map(c => {
                  const nb = getNeighborhoodById(c.neighborhoodId);
                  const dept = c.assignedDepartmentId ? getDepartmentById(c.assignedDepartmentId) : null;
                  const sl = getSlaColor(c.slaStatus);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/admin/complaints/${c.id}`)}>
                      <td className="px-4 py-2.5 text-sm font-mono text-blue-700 whitespace-nowrap">{c.code}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-900 max-w-[200px] truncate">{c.title}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{nb?.name || '—'}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{dept?.name || '—'}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                        {c.currentDeadline ? formatDateShort(c.currentDeadline) : '—'}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
                          style={{ backgroundColor: sl.bg, color: sl.color }}>
                          {getSlaLabel(c.slaStatus)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <button
                          onClick={e => { e.stopPropagation(); navigate(`/admin/complaints/${c.id}`); }}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Table 2: Hiệu suất đơn vị ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
          Hiệu suất đơn vị xử lý
        </h3>
        {deptPerformance.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu đơn vị xử lý</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Đơn vị', 'Tổng được giao', 'Đang xử lý', 'Hoàn thành', 'Đúng hạn', 'Trễ hạn', 'Tỷ lệ đúng hạn'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {deptPerformance.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center">{d.total}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center">{d.inProgress}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center">{d.completed}</td>
                    <td className="px-4 py-2.5 text-sm text-green-700 text-center">{d.onTime}</td>
                    <td className="px-4 py-2.5 text-sm text-red-700 text-center">{d.late}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        d.onTimeRate >= 80 ? 'bg-green-100 text-green-700' : d.onTimeRate >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {d.onTimeRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ---- Nhật ký hoạt động gần đây ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-3 mt-2">
          Nhật ký hoạt động
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Không có nhật ký</p>
        ) : (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {history
              .filter(h => h.isPublic)
              .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt))
              .slice(0, 10)
              .map(h => {
                const actor = getUserById(h.performedBy);
                return (
                  <div key={h.id} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{h.publicNote || h.internalNote}</p>
                      <p className="text-xs text-gray-400">
                        {actor?.fullName || 'Hệ thống'} • {dayjs(h.performedAt).fromNow()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
