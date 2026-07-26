// ============================================================
// DASHBOARD OVERVIEW — Tổng quan bảng điều khiển (admin view)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Filter, TrendingUp, TrendingDown, BarChart3, PieChart,
  AlertTriangle, ArrowRight, Clock, CheckCircle2, XCircle,
  FileText, Inbox, AlertOctagon,
} from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import { getCategoryById, getDepartmentById, getNeighborhoodById, getTimeRemaining } from '../../mock/db';
import { StatusBadge, SlaBadge } from '../../mock/components/Badges';

// ---- time period options ----
const PERIODS = [
  { key: 'today', label: 'Hôm nay' },
  { key: '7d', label: '7 ngày' },
  { key: '30d', label: '30 ngày' },
  { key: 'custom', label: 'Tùy chọn' },
];

// ---- helpers ----
function filterByPeriod(list, period) {
  const now = new Date();
  let since;
  switch (period) {
    case 'today':
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case '7d':
      since = new Date(now.getTime() - 7 * 86400000);
      break;
    case '30d':
      since = new Date(now.getTime() - 30 * 86400000);
      break;
    default:
      return list;
  }
  return list.filter((c) => new Date(c.createdAt) >= since);
}

function getPrevPeriod(period) {
  const now = new Date();
  let start, end;
  switch (period) {
    case 'today': {
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      start = yesterday;
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    }
    case '7d':
      end = new Date(now.getTime() - 7 * 86400000);
      start = new Date(end.getTime() - 7 * 86400000);
      break;
    case '30d':
      end = new Date(now.getTime() - 30 * 86400000);
      start = new Date(end.getTime() - 30 * 86400000);
      break;
    default:
      return () => [];
  }
  return (list) => list.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= start && d < end;
  });
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) +
    ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function KpiCard({ title, value, sub, icon, color, trend }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50', icon: 'text-blue-600',  text: 'text-blue-600' },
    gray:   { bg: 'bg-gray-50', icon: 'text-gray-600',  text: 'text-gray-600' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', text: 'text-orange-600' },
    green:  { bg: 'bg-green-50', icon: 'text-green-600', text: 'text-green-600' },
    red:    { bg: 'bg-red-50', icon: 'text-red-600',   text: 'text-red-600' },
    violet: { bg: 'bg-violet-50', icon: 'text-[#4F39F6]', text: 'text-[#4F39F6]' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${c.text}`}>{value}</p>
          {sub && <p className="text-sm text-gray-500 mt-1">{sub}</p>}
          {trend != null && (
            <p className={`text-sm mt-1 flex items-center gap-1 ${trend > 0 ? 'text-red-500' : trend < 0 ? 'text-green-500' : 'text-gray-400'}`}>
              {trend > 0 ? <TrendingUp size={14} /> : trend < 0 ? <TrendingDown size={14} /> : null}
              {trend !== 0 ? `${trend > 0 ? '+' : ''}${trend}%` : '0%'} vs kỳ trước
            </p>
          )}
        </div>
        <div className={`w-10 h-10 ${c.bg} rounded-lg flex items-center justify-center`}>
          <div className={c.icon}>{icon}</div>
        </div>
      </div>
    </div>
  );
}

// ---- Mock bar chart (CSS bars) ----
function StatusBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const colors = {
    'Mới gửi': 'bg-gray-300',
    'Chờ tiếp nhận': 'bg-blue-200',
    'Đã tiếp nhận': 'bg-blue-400',
    'Đã phân công': 'bg-purple-400',
    'Đang xử lý': 'bg-orange-400',
    'Chờ duyệt gia hạn': 'bg-yellow-400',
    'Hoàn thành': 'bg-green-400',
    'Từ chối': 'bg-red-400',
  };
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2 text-xs">
          <span className="w-28 text-gray-600 truncate">{d.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[d.label] || 'bg-gray-400'} transition-all duration-500`}
              style={{ width: `${(d.count / max) * 100}%`, minWidth: d.count > 0 ? '12px' : 0 }}
            />
          </div>
          <span className="w-8 text-right text-gray-700 font-medium">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ---- Mock donut chart (CSS circles) ----
function SlaDonut({ onTime, late, nearDue }) {
  const total = onTime + late + nearDue || 1;
  const segments = [
    { value: onTime, color: '#22c55e', label: 'Đúng hạn' },
    { value: nearDue, color: '#eab308', label: 'Sắp đến hạn' },
    { value: late, color: '#ef4444', label: 'Trễ hạn' },
  ];
  return (
    <div className="flex items-center gap-6">
      {/* ponytail: manual SVG donut — swap for chart lib when >3 segments */}
      <svg width="100" height="100" viewBox="0 0 36 36" className="shrink-0">
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          const dash = (pct / 100) * 100; // circumference ~100
          const offset = segments.slice(0, i).reduce((a, x) => a + (x.value / total) * 100, 0);
          return (
            <circle
              key={s.label}
              cx="18" cy="18" r="14"
              fill="none"
              stroke={s.color}
              strokeWidth="4"
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 18 18)"
              className="transition-all duration-700"
            />
          );
        })}
        <text x="18" y="20" textAnchor="middle" className="text-[8px] font-bold fill-gray-700">
          {total}
        </text>
      </svg>
      <div className="space-y-1.5 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
            <span className="text-gray-600">{s.label}</span>
            <span className="font-semibold text-gray-800">{s.value}</span>
            <span className="text-gray-400">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Simple bar chart for 7-day trend ----
function TrendBars({ days }) {
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-32">
      {days.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-[10px] text-gray-500">{d.count}</span>
          <div
            className="w-full bg-blue-400 rounded-t hover:bg-blue-500 transition-colors cursor-default"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
            title={`${d.label}: ${d.count}`}
          />
          <span className="text-[10px] text-gray-400">{d.label.split('/')[0]}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function DashboardOverview() {
  const navigate = useNavigate();
  const mock = useMock();
  const stats = mock.getDashboardStats();
  const allComplaints = mock.complaints;
  const filters = mock.filters;
  const setFilters = mock.setFilters;

  const [period, setPeriod] = useState('30d');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  // ---- filter the data ----
  const complaintsInPeriod = useMemo(() => {
    const base = filterByPeriod(allComplaints, period);
    return base.filter((c) => {
      if (filters.neighborhoodId && c.neighborhoodId !== filters.neighborhoodId) return false;
      if (filters.categoryId && c.categoryId !== filters.categoryId) return false;
      if (filters.departmentId && c.assignedDepartmentId !== filters.departmentId) return false;
      if (filters.status && c.status !== filters.status) return false;
      return true;
    });
  }, [allComplaints, period, filters]);

  // ---- KPI computation ----
  const kpi = useMemo(() => {
    const total = complaintsInPeriod.length;
    const newPending = complaintsInPeriod.filter((c) => c.status === 'NEW' || c.status === 'PENDING_RECEPTION').length;
    const inProgress = complaintsInPeriod.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING').length;
    const nearDueInProgress = complaintsInPeriod.filter((c) =>
      (c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING') && c.slaStatus === 'NEAR_DUE'
    ).length;
    const completed = complaintsInPeriod.filter((c) => c.status === 'COMPLETED').length;
    const completedOnTime = complaintsInPeriod.filter((c) => c.slaStatus === 'COMPLETED_ON_TIME').length;
    const onTimeRate = completed > 0 ? Math.round((completedOnTime / completed) * 100) : 0;
    const overdue = complaintsInPeriod.filter((c) => c.slaStatus === 'OVERDUE').length;
    const urgentPending = complaintsInPeriod.filter((c) =>
      (c.status !== 'COMPLETED' && c.status !== 'REJECTED') &&
      (c.confirmedUrgency === 'URGENT' || c.citizenUrgency === 'URGENT')
    ).length;

    // vs last period trend
    let prevTotal = 0;
    if (period === 'today' || period === '7d' || period === '30d') {
      prevTotal = getPrevPeriod(period)(allComplaints).length;
    }
    const trend = prevTotal > 0 ? Math.round(((total - prevTotal) / prevTotal) * 100) : 0;

    return { total, newPending, inProgress, nearDueInProgress, completed, completedOnTime, onTimeRate, overdue, urgentPending, trend };
  }, [complaintsInPeriod, allComplaints, period]);

  // ---- status breakdown for bar chart ----
  const statusBreakdown = useMemo(() => {
    const groups = {};
    complaintsInPeriod.forEach((c) => {
      const label = {
        'NEW': 'Mới gửi', 'PENDING_RECEPTION': 'Chờ tiếp nhận', 'RECEIVED': 'Đã tiếp nhận',
        'ASSIGNED': 'Đã phân công', 'IN_PROGRESS': 'Đang xử lý',
        'EXTENSION_PENDING': 'Chờ duyệt gia hạn', 'COMPLETED': 'Hoàn thành', 'REJECTED': 'Từ chối',
      }[c.status] || c.status;
      groups[label] = (groups[label] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [complaintsInPeriod]);

  // ---- SLA breakdown for donut ----
  const slaBreakdown = useMemo(() => {
    const onTime = complaintsInPeriod.filter((c) =>
      c.slaStatus === 'ON_TIME' || c.slaStatus === 'COMPLETED_ON_TIME'
    ).length;
    const late = complaintsInPeriod.filter((c) =>
      c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE'
    ).length;
    const nearDue = complaintsInPeriod.filter((c) =>
      c.slaStatus === 'NEAR_DUE' || c.slaStatus === 'PENDING_EXTENSION'
    ).length;
    return { onTime, late, nearDue };
  }, [complaintsInPeriod]);

  // ---- 7-day trend ----
  const trend7d = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = complaintsInPeriod.filter((c) => c.createdAt.slice(0, 10) === ds).length;
      days.push({
        label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        count,
      });
    }
    return days;
  }, [complaintsInPeriod]);

  // ---- attention-needed complaints ----
  const attentionComplaints = useMemo(() => {
    return complaintsInPeriod
      .filter((c) =>
        c.status !== 'COMPLETED' && c.status !== 'REJECTED' &&
        (c.slaStatus === 'NEAR_DUE' || c.slaStatus === 'OVERDUE' ||
         (c.confirmedUrgency || c.citizenUrgency) === 'URGENT' ||
         c.extensionCount >= 2)
      )
      .sort((a, b) => {
        const score = (c) =>
          (c.slaStatus === 'OVERDUE' ? 100 : 0) +
          (c.slaStatus === 'NEAR_DUE' ? 50 : 0) +
          ((c.confirmedUrgency || c.citizenUrgency) === 'URGENT' ? 30 : 0) +
          (c.extensionCount >= 2 ? 20 : 0);
        return score(b) - score(a);
      })
      .slice(0, 5);
  }, [complaintsInPeriod]);

  // ---- department performance ----
  const deptPerformance = useMemo(() => {
    const deptMap = {};
    complaintsInPeriod.forEach((c) => {
      if (!c.assignedDepartmentId) return;
      const d = deptMap[c.assignedDepartmentId] || { total: 0, inProgress: 0, completed: 0, onTime: 0, late: 0 };
      d.total++;
      if (c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING') d.inProgress++;
      if (c.status === 'COMPLETED') {
        d.completed++;
        if (c.slaStatus === 'COMPLETED_ON_TIME') d.onTime++;
        if (c.slaStatus === 'COMPLETED_LATE') d.late++;
      }
      // count overdue/completed-late as "late"
      if (c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE') d.late++;
      deptMap[c.assignedDepartmentId] = d;
    });
    return Object.entries(deptMap)
      .map(([id, d]) => {
        const dept = getDepartmentById(id);
        return {
          id,
          name: dept ? dept.name : id,
          ...d,
          rate: d.completed > 0 ? Math.round((d.onTime / d.completed) * 100) : 0,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [complaintsInPeriod]);

  // ---- handlers ----
  const clearFilters = () => {
    setFilters({ search: '', status: '', categoryId: '', neighborhoodId: '', slaStatus: '', urgency: '', departmentId: '', dateFrom: '', dateTo: '' });
  };

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* ================================================================ */}
      {/* FILTER BAR                                                        */}
      {/* ================================================================ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Period selector */}
          <div className="flex flex-wrap gap-2">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  period === p.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom date range — only when Tùy chọn */}
          {period === 'custom' && (
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-32"
              />
              <span className="text-xs text-gray-400">đến</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs w-32"
              />
            </div>
          )}

          <span className="text-gray-300 mx-1">|</span>

          {/* Neighborhood */}
          <select
            value={filters.neighborhoodId || ''}
            onChange={(e) => setFilters({ neighborhoodId: e.target.value || undefined })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600"
          >
            <option value="">Tất cả khu phố</option>
            {mock.neighborhoods.filter((n) => n.status === 'ACTIVE').map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>

          {/* Category */}
          <select
            value={filters.categoryId || ''}
            onChange={(e) => setFilters({ categoryId: e.target.value || undefined })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600"
          >
            <option value="">Tất cả danh mục</option>
            {mock.categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Department */}
          <select
            value={filters.departmentId || ''}
            onChange={(e) => setFilters({ departmentId: e.target.value || undefined })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600"
          >
            <option value="">Tất cả đơn vị</option>
            {mock.departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ status: e.target.value || undefined })}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-600"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="NEW">Mới gửi</option>
            <option value="PENDING_RECEPTION">Chờ tiếp nhận</option>
            <option value="RECEIVED">Đã tiếp nhận</option>
            <option value="ASSIGNED">Đã phân công</option>
            <option value="IN_PROGRESS">Đang xử lý</option>
            <option value="EXTENSION_PENDING">Chờ duyệt gia hạn</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="REJECTED">Từ chối</option>
          </select>

          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Filter size={14} />
            Xóa lọc
          </button>
        </div>
      </div>

      {/* ================================================================ */}
      {/* KPI ROW (6 cards, 3x2 on desktop)                                */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Tổng phản ánh"
          value={kpi.total}
          sub={`${kpi.newPending} mới tiếp nhận`}
          icon={<FileText size={20} />}
          color="blue"
          trend={kpi.trend}
        />
        <KpiCard
          title="Mới / Chờ xử lý"
          value={kpi.newPending}
          icon={<Inbox size={20} />}
          color="gray"
        />
        <KpiCard
          title="Đang xử lý"
          value={kpi.inProgress}
          sub={kpi.nearDueInProgress > 0 ? `${kpi.nearDueInProgress} sắp hết hạn` : null}
          icon={<Clock size={20} />}
          color="orange"
        />
        <KpiCard
          title="Hoàn thành"
          value={kpi.completed}
          sub={`Tỷ lệ đúng hạn: ${kpi.onTimeRate}%`}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <KpiCard
          title="Quá hạn"
          value={kpi.overdue}
          icon={<XCircle size={20} />}
          color="red"
        />
        <KpiCard
          title="Khẩn cấp"
          value={kpi.urgentPending}
          sub={kpi.urgentPending > 0 ? 'đang chờ xử lý' : null}
          icon={<AlertOctagon size={20} />}
          color="red"
        />
      </div>

      {/* ================================================================ */}
      {/* CHARTS ROW                                                        */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Phản ánh theo trạng thái (bar) */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 size={18} className="text-blue-500" />
            <h3 className="text-base font-semibold text-gray-800">Phản ánh theo trạng thái</h3>
          </div>
          <StatusBarChart data={statusBreakdown} />
        </div>

        {/* Chart 2: Đúng hạn / Trễ hạn / Sắp đến hạn (donut) */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <PieChart size={18} className="text-blue-500" />
            <h3 className="text-base font-semibold text-gray-800">Tỉ lệ đúng hạn</h3>
          </div>
          <SlaDonut onTime={slaBreakdown.onTime} late={slaBreakdown.late} nearDue={slaBreakdown.nearDue} />
        </div>

        {/* Chart 3: Xu hướng 7 ngày (bars) */}
        <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} className="text-blue-500" />
            <h3 className="text-base font-semibold text-gray-800">Xu hướng 7 ngày</h3>
          </div>
          <TrendBars days={trend7d} />
        </div>
      </div>

      {/* ================================================================ */}
      {/* TABLE 1: PHẢN ÁNH CẦN CHÚ Ý                                       */}
      {/* ================================================================ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" />
            <h3 className="text-base font-semibold text-gray-800">Phản ánh cần chú ý</h3>
            {attentionComplaints.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 rounded-full">
                {attentionComplaints.length}
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/admin/complaints?filter=attention')}
            className="inline-flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-lg text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Xem thêm <ArrowRight size={14} />
          </button>
        </div>
        {attentionComplaints.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Không có phản ánh nào cần chú ý.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Mã</th>
                <th className="px-6 py-3">Tiêu đề</th>
                <th className="px-6 py-3">Khu phố</th>
                <th className="px-6 py-3">Đơn vị</th>
                <th className="px-6 py-3">Hạn</th>
                <th className="px-6 py-3">Tình trạng</th>
                <th className="px-6 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {attentionComplaints.map((c) => {
                const n = getNeighborhoodById(c.neighborhoodId);
                const d = getDepartmentById(c.assignedDepartmentId);
                const remaining = getTimeRemaining(c.currentDeadline || c.originalDeadline);
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">{c.code}</td>
                    <td className="px-6 py-3">
                      <span className="text-gray-800 line-clamp-1 max-w-48">{c.title}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{n ? n.name : '—'}</td>
                    <td className="px-6 py-3 text-gray-500">{d ? d.name : '—'}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs ${c.slaStatus === 'OVERDUE' ? 'text-red-600 font-medium' : c.slaStatus === 'NEAR_DUE' ? 'text-amber-600' : 'text-gray-500'}`}>
                        {remaining || formatDate(c.currentDeadline || c.originalDeadline)}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={c.status} />
                        <SlaBadge slaStatus={c.slaStatus} />
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => navigate(`/admin/complaints/${c.id}`)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ================================================================ */}
      {/* TABLE 2: HIỆU SUẤT ĐƠN VỊ XỬ LÝ                                  */}
      {/* ================================================================ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <BarChart3 size={18} className="text-blue-500" />
          <h3 className="text-base font-semibold text-gray-800">Hiệu suất đơn vị xử lý</h3>
        </div>
        {deptPerformance.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">Chưa có dữ liệu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Đơn vị</th>
                  <th className="px-6 py-3 text-center">Tổng giao</th>
                  <th className="px-6 py-3 text-center">Đang xử lý</th>
                  <th className="px-6 py-3 text-center">Hoàn thành</th>
                  <th className="px-6 py-3 text-center">Đúng hạn</th>
                  <th className="px-6 py-3 text-center">Trễ hạn</th>
                  <th className="px-6 py-3 text-center">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deptPerformance.map((dp) => (
                  <tr key={dp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-800">{dp.name}</td>
                    <td className="px-6 py-3 text-center text-gray-700">{dp.total}</td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-orange-50 text-orange-600">{dp.inProgress}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-600">{dp.completed}</span>
                    </td>
                    <td className="px-6 py-3 text-center text-green-600">{dp.onTime}</td>
                    <td className="px-6 py-3 text-center text-red-600">{dp.late}</td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${dp.rate >= 80 ? 'bg-green-500' : dp.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${dp.rate}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${dp.rate >= 80 ? 'text-green-600' : dp.rate >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                          {dp.rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;
