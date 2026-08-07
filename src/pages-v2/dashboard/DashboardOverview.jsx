// ============================================================
// DASHBOARD OVERVIEW — Tổng quan tích hợp 45 Khu phố & Phân loại phản ánh (PAGE D-01)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, CheckCircle, Clock, FileCheck,
  MessageSquare, Send, TrendingUp, TrendingDown, Filter,
  BarChart3, Layers, SlidersHorizontal, Award, Sparkles,
  Building2, Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';
import Chart from '../../components/dashboard/Chart';
import { useMock } from '../../mock/MockContext';
import {
  getNeighborhoodById, getUserById, getDepartmentById, getStatusLabel, getSlaLabel, getSlaColor,
  categories, departments,
} from '../../mock/db';
import { formatDateShort } from '../../utils/formatDate';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// Colors for 45 KP bars
const KP_BAR_COLORS = [
  '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E',
  '#10B981', '#06B6D4', '#0EA5E9', '#F59E0B', '#14B8A6'
];

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

const CATEGORY_COLORS_MAP = {
  'CAT-INFRA': '#3B82F6',
  'CAT-ENV': '#10B981',
  'CAT-URBAN': '#F59E0B',
  'CAT-SEC': '#EF4444',
  'CAT-ELEC': '#8B5CF6',
  'CAT-CONST': '#6366F1',
  'CAT-SAN': '#06B6D4',
  'CAT-OTHER': '#9CA3AF',
};

export default function DashboardOverview() {
  const navigate = useNavigate();
  const mock = useMock();
  const { complaints, history } = mock;

  const [period, setPeriod] = useState('30d');
  const [filterKp, setFilterKp] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(t);
  }, []);

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

  // Guaranteed non-empty complaints set for rich demo statistics
  const effectiveComplaints = useMemo(() => {
    if (filtered.length > 0) return filtered;
    return complaints.filter(c => {
      if (filterKp && c.neighborhoodId !== filterKp) return false;
      if (filterCat && c.categoryId !== filterCat) return false;
      if (filterDept && c.assignedDepartmentId !== filterDept) return false;
      if (filterUrgency && (c.confirmedUrgency || c.citizenUrgency) !== filterUrgency) return false;
      return true;
    });
  }, [filtered, complaints, filterKp, filterCat, filterDept, filterUrgency]);

  // KPI Stats
  const stats = useMemo(() => {
    const newly = effectiveComplaints.filter(c => c.status === 'NEW' || c.status === 'PENDING_RECEPTION');
    const inProgress = effectiveComplaints.filter(c => ['ASSIGNED', 'IN_PROGRESS', 'EXTENSION_PENDING'].includes(c.status));
    const completed = effectiveComplaints.filter(c => c.status === 'COMPLETED');
    const overdueNow = effectiveComplaints.filter(c => c.slaStatus === 'OVERDUE');
    const urgentAll = effectiveComplaints.filter(c => (c.confirmedUrgency || c.citizenUrgency) === 'URGENT');
    const urgentPending = urgentAll.filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED');
    const nearDueNow = effectiveComplaints.filter(c => c.slaStatus === 'NEAR_DUE');
    const completedLate = effectiveComplaints.filter(c => c.slaStatus === 'COMPLETED_LATE');

    const totalCount = effectiveComplaints.length > 0 ? effectiveComplaints.length : 2156;
    const newlyCount = newly.length > 0 ? newly.length : 342;
    const inProgressCount = inProgress.length > 0 ? inProgress.length : 518;
    const completedCount = completed.length > 0 ? completed.length : 1186;
    const overdueCount = overdueNow.length > 0 ? overdueNow.length : 110;
    const urgentTotal = urgentAll.length > 0 ? urgentAll.length : 284;
    const completedRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 86;

    return {
      total: totalCount,
      pctChange: 12,
      newlyCount,
      inProgressCount,
      nearDueCount: nearDueNow.length || 12,
      completedCount,
      completedRate,
      overdueCount,
      completedLateCount: completedLate.length || 8,
      urgentTotal,
      urgentPendingCount: urgentPending.length || 15,
    };
  }, [effectiveComplaints]);

  // ---- 45 NEIGHBORHOOD RICH DYNAMIC WAVE CHART DATA (ALL 45 KP WITH RHYTHMIC PEAKS & VALLEYS) ----
  const neighborhoodChartData = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => {
      const kpNum = i + 1;
      const name = `KP ${String(kpNum).padStart(2, '0')}`;
      const fullName = `Khu phố ${kpNum}`;

      // Wave calculation: trigonometric sine/cosine combination for natural up-and-down peaks & valleys
      const wave = Math.sin((i / 45) * Math.PI * 6) * 150 + Math.cos((i / 45) * Math.PI * 3.5) * 80;
      const peakBonus = (i % 7 === 0) ? 140 : (i % 5 === 0) ? 90 : (i % 3 === 0) ? -65 : 15;
      
      // Dynamic total complaints count between 40 and 420
      const totalCount = Math.max(40, Math.min(420, Math.round(210 + wave + peakBonus)));
      
      const overdueCount = Math.round(totalCount * (0.04 + (i % 6) * 0.015));
      const completedCount = Math.round(totalCount * (0.74 + ((i % 8) * 0.025)));
      const inProgressCount = totalCount - completedCount;
      
      // Dynamic handling rate between 66% and 98%
      const rateWave = Math.cos((i / 45) * Math.PI * 4.5) * 11 + ((i % 7) * 2.5 - 7);
      const rate = Math.min(98, Math.max(66, Math.round(84 + rateWave)));
      
      const barColor = KP_BAR_COLORS[i % KP_BAR_COLORS.length];

      return {
        id: `KP-${String(kpNum).padStart(2, '0')}`,
        name,
        fullName,
        total: totalCount,
        completed: completedCount,
        inProgress: inProgressCount,
        overdue: overdueCount,
        onTimeRate: rate,
        avgDays: Math.round((1.6 + ((i * 11) % 24) / 10) * 10) / 10,
        barColor,
      };
    });
  }, []);

  // ---- CATEGORY DONUT CHART DATA (Phân loại phản ánh scaled to match total complaints) ----
  const categoryPieData = useMemo(() => {
    const activeCategories = categories.filter(c => c.status === 'ACTIVE');
    const totalTarget = stats.total || 2156;
    
    // Proportional weights for realistic distribution matching total target (2.156)
    const weights = {
      'CAT-INFRA': 0.30,
      'CAT-ENV': 0.23,
      'CAT-URBAN': 0.18,
      'CAT-SEC': 0.12,
      'CAT-ELEC': 0.08,
      'CAT-CONST': 0.05,
      'CAT-SAN': 0.04,
    };

    const counts = activeCategories.map(cat => {
      const weight = weights[cat.id] || 0.05;
      const val = Math.round(totalTarget * weight);
      return {
        id: cat.id,
        name: cat.name,
        value: val,
        color: CATEGORY_COLORS_MAP[cat.id] || '#9CA3AF'
      };
    });

    const totalVal = counts.reduce((acc, curr) => acc + curr.value, 0);
    return counts.map(c => ({
      ...c,
      percent: Math.round((c.value / (totalVal || 1)) * 100)
    })).sort((a, b) => b.value - a.value);
  }, [stats]);

  const totalCategoryCount = useMemo(() => {
    return categoryPieData.reduce((sum, c) => sum + c.value, 0);
  }, [categoryPieData]);

  // Top 5 Neighborhoods
  const topNeighborhoods = useMemo(() => {
    return [...neighborhoodChartData]
      .sort((a, b) => (b.onTimeRate * 0.6 + b.total * 0.4) - (a.onTimeRate * 0.6 + a.total * 0.4))
      .slice(0, 5);
  }, [neighborhoodChartData]);

  // Status breakdown
  const statusData = useMemo(() => {
    const groups = {};
    effectiveComplaints.forEach(c => { const lbl = getStatusLabel(c.status); groups[lbl] = (groups[lbl] || 0) + 1; });
    return Object.entries(groups).map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [effectiveComplaints]);

  // SLA donut data
  const slaData = useMemo(() => {
    const onTime = effectiveComplaints.filter(c => c.slaStatus === 'ON_TIME' || c.slaStatus === 'COMPLETED_ON_TIME').length || 42;
    const nearDue = effectiveComplaints.filter(c => c.slaStatus === 'NEAR_DUE').length || 6;
    const overdue = effectiveComplaints.filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE').length || 5;
    const na = effectiveComplaints.filter(c => c.slaStatus === 'NOT_APPLICABLE' || c.slaStatus === 'PENDING_EXTENSION' || !c.slaStatus).length || 2;
    return { onTime, nearDue, overdue, notApplicable: na };
  }, [effectiveComplaints]);

  // 7-day trend
  const trendData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const dayComplaints = complaints.filter(c => c.createdAt.slice(0, 10) === ds);
      const baseTotal = dayComplaints.length > 0 ? dayComplaints.length : (12 + (i * 3) % 8);
      days.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        tongPhanAnh: baseTotal,
        daGiaiQuyet: Math.round(baseTotal * 0.8),
        quaHan: Math.round(baseTotal * 0.1),
      });
    }
    return days;
  }, [complaints]);

  // Attention list
  const attentionList = useMemo(() => {
    const list = effectiveComplaints
      .filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED')
      .filter(c => c.slaStatus === 'NEAR_DUE' || c.slaStatus === 'OVERDUE'
        || (c.confirmedUrgency || c.citizenUrgency) === 'URGENT'
        || c.extensionCount >= 2)
      .sort((a, b) => {
        const urgencyScore = (c) => ((c.confirmedUrgency || c.citizenUrgency) === 'URGENT' ? 3 : 0) + (c.slaStatus === 'OVERDUE' ? 5 : c.slaStatus === 'NEAR_DUE' ? 3 : 0) + (c.extensionCount || 0);
        return urgencyScore(b) - urgencyScore(a);
      })
      .slice(0, 10);
    return list.length > 0 ? list : complaints.slice(0, 5);
  }, [effectiveComplaints, complaints]);

  // Department performance
  const deptPerformance = useMemo(() => {
    return departments.filter(d => d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP' && d.status === 'ACTIVE').map(d => {
      const deptComplaints = effectiveComplaints.filter(c => c.assignedDepartmentId === d.id);
      const totalC = deptComplaints.length > 0 ? deptComplaints.length : 15;
      const done = deptComplaints.filter(c => c.status === 'COMPLETED').length || Math.round(totalC * 0.8);
      const onTime = deptComplaints.filter(c => c.slaStatus === 'COMPLETED_ON_TIME').length || Math.round(done * 0.9);
      const late = done - onTime;
      return {
        id: d.id,
        name: d.name,
        total: totalC,
        inProgress: Math.round(totalC * 0.2),
        completed: done,
        onTime,
        late,
        onTimeRate: done > 0 ? Math.round((onTime / done) * 100) : 88,
      };
    }).sort((a, b) => b.total - a.total);
  }, [effectiveComplaints]);

  const hasActiveFilters = filterKp || filterCat || filterDept || filterUrgency;
  const resetFilters = () => { setFilterKp(''); setFilterCat(''); setFilterDept(''); setFilterUrgency(''); };
  const selectCls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white";

  // Tooltips for recharts
  const CustomReceivedTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs z-50">
          <p className="font-bold text-blue-400 mb-1 text-sm">{data.fullName}</p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4"><span className="text-gray-400">Phản ánh tiếp nhận:</span> <strong className="text-white">{data.total}</strong></p>
            <p className="flex justify-between gap-4"><span className="text-gray-400">Đang xử lý:</span> <strong className="text-amber-400">{data.inProgress}</strong></p>
            <p className="flex justify-between gap-4"><span className="text-gray-400">Hoàn thành:</span> <strong className="text-emerald-400">{data.completed}</strong></p>
            <p className="flex justify-between gap-4"><span className="text-gray-400">Quá hạn:</span> <strong className="text-rose-400">{data.overdue}</strong></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomRateTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs z-50">
          <p className="font-bold text-emerald-400 mb-1 text-sm">{data.fullName}</p>
          <p className="text-sm font-semibold text-white">Tỷ lệ xử lý đúng hạn: {data.onTimeRate}%</p>
          <p className="text-gray-300 mt-0.5">Thời gian TB: {data.avgDays} ngày</p>
        </div>
      );
    }
    return null;
  };

  const CustomCategoryTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs min-w-[180px] pointer-events-none relative" style={{ zIndex: 9999 }}>
          <p className="font-bold mb-1.5 text-sm flex items-center gap-2" style={{ color: data.color }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: data.color }} />
            {data.name}
          </p>
          <div className="space-y-1">
            <p className="flex justify-between gap-4"><span className="text-gray-400">Số lượng:</span> <strong className="text-white font-mono">{data.value.toLocaleString('vi-VN')} phản ánh</strong></p>
            <p className="flex justify-between gap-4"><span className="text-gray-400">Tỷ trọng:</span> <strong className="text-emerald-400 font-mono">{data.percent}%</strong></p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-xs h-20 bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-h-full pb-8">
      {/* ---- Page title ---- */}
      <div className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Tổng quan
          </h1>
          <p className="text-gray-600 mt-0.5 text-xs md:text-sm">Thống kê hoạt động hệ thống quản trị 45 khu phố</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 text-xs font-semibold text-blue-800 self-start md:self-auto">
          <Sparkles className="w-4 h-4 text-blue-600" />
          Màn hình điều hành 45 Khu phố
        </div>
      </div>

      {/* ---- Period filter ---- */}
      <div className="flex flex-wrap items-center gap-2">
        {PERIODS.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-3 py-1 text-xs md:text-sm font-medium rounded-lg border transition-colors ${
              period === p.key
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {p.label}
          </button>
        ))}
        {period === 'custom' && (
          <div className="flex items-center gap-2">
            <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-gray-400 text-xs">-</span>
            <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
              className="px-3 py-1 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs md:text-sm font-medium rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Bộ lọc
          {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
        </button>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-700 font-medium">
            Xoá bộ lọc
          </button>
        )}
      </div>

      {/* ---- Expanded filters ---- */}
      {showFilters && (
        <div className="bg-white rounded-xl p-4 shadow-xs border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Khu phố</label>
              <select value={filterKp} onChange={e => setFilterKp(e.target.value)} className={selectCls}>
                <option value="">Tất cả (45 Khu phố)</option>
                {mock.neighborhoods.filter(n => n.status === 'ACTIVE').map(n => (
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

      {/* ---- Executive Top Banner Cards (Phản ánh 45 Khu Phố style) ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          layout="horizontal"
          title="Khu phố"
          value={45}
          icon={<Building2 />}
          color="blue"
        />
        <StatCard
          layout="horizontal"
          title="Người dân sử dụng"
          value="12.842"
          icon={<Users />}
          color="blue"
          subtitle={<span className="text-emerald-600 font-semibold text-[10px]">+18% so với kỳ trước</span>}
        />
        <StatCard
          layout="horizontal"
          title="Phản ánh tiếp nhận"
          value="2.156"
          icon={<MessageSquare />}
          color="blue"
          subtitle={<span className="text-emerald-600 font-semibold text-[10px]">+12% so với kỳ trước</span>}
        />
        <StatCard
          layout="horizontal"
          title="Tỷ lệ xử lý"
          value="86,7%"
          icon={<CheckCircle />}
          color="green"
          subtitle={<span className="text-emerald-600 font-semibold text-[10px]">+6,2% so với kỳ trước</span>}
        />
      </div>

      {/* ---- KPI Detailed Status Cards (6 Thẻ nhỏ đều đặn) ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Tổng phản ánh"
          value={stats.total}
          icon={<MessageSquare />}
          color="blue"
        />
        <StatCard
          title="Phản ánh mới"
          value={stats.newlyCount}
          icon={<Send />}
          color="gray"
        />
        <StatCard
          title="Đang xử lý"
          value={stats.inProgressCount}
          icon={<Clock />}
          color="orange"
        />
        <StatCard
          title="Hoàn thành"
          value={stats.completedCount}
          icon={<CheckCircle />}
          color="green"
        />
        <StatCard
          title="Quá hạn"
          value={stats.overdueCount}
          icon={<AlertTriangle />}
          color="red"
        />
        <StatCard
          title="Khẩn cấp"
          value={stats.urgentTotal}
          icon={<FileCheck />}
          color="violet"
          subtitle={<span className="text-violet-600 text-[10px]">Ưu tiên xử lý</span>}
        />
      </div>

      {/* ---- MAIN INTEGRATED SECTION: 45 KHU PHỐ CHARTS & PHÂN LOẠI PHẢN ÁNH ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT COLUMN: Combined Scrollable Charts (Phản ánh tiếp nhận & Tỷ lệ xử lý theo 45 khu phố) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-100">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="text-blue-600 w-5 h-5" />
                Biểu đồ Phản ánh & Tỷ lệ xử lý theo 45 Khu phố
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tỷ lệ xử lý nằm ngay bên dưới Phản ánh tiếp nhận (Trượt ngang để xem toàn bộ 45 khu phố)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Thanh trượt ngang 45 KP →
            </div>
          </div>

          {/* SINGLE HORIZONTAL SCROLL WRAPPER FOR BOTH CHARTS */}
          <div className="overflow-x-auto custom-scrollbar border border-slate-200/70 rounded-xl bg-slate-50/60 p-3.5 shadow-inner">
            <div className="w-[2800px] space-y-5">
              {/* TOP CHART: Phản ánh tiếp nhận theo khu phố */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span>
                    Phản ánh tiếp nhận theo khu phố (Đầy đủ 45 cột)
                  </h3>
                  <span className="text-xs text-gray-400 font-normal">Trục ngang: KP 01 đến KP 45</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={neighborhoodChartData} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
                      <defs>
                        <linearGradient id="pureBlueBarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                          <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0.9} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                        angle={-45}
                        textAnchor="end"
                        height={45}
                      />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip content={<CustomReceivedTooltip />} />
                      <Bar dataKey="total" fill="url(#pureBlueBarGradient)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BOTTOM CHART: Tỷ lệ xử lý theo khu phố (Placed directly under Chart 1) */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                    Tỷ lệ xử lý đúng hạn theo khu phố (%)
                  </h3>
                  <span className="text-xs text-gray-400 font-normal">Đồng bộ chuẩn xác theo 45 Khu phố</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={neighborhoodChartData} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
                      <defs>
                        <linearGradient id="overviewRateGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.35}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                        angle={-45}
                        textAnchor="end"
                        height={45}
                      />
                      <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: '#64748b' }} />
                      <Tooltip content={<CustomRateTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="onTimeRate"
                        stroke="#10B981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#overviewRateGradient)"
                        dot={{ r: 3.5, fill: '#059669', stroke: '#ffffff', strokeWidth: 1 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Phân loại phản ánh & Top Khu phố (Placed NEXT TO the neighborhood chart block) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Card 1: Phân loại phản ánh (Pie / Donut Chart) */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Phân loại phản ánh
              </h2>
              <span className="text-xs text-gray-400 font-normal">Cơ cấu loại</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">Tỷ lệ phân bổ phản ánh theo từng lĩnh vực</p>

            {/* Donut Chart */}
            <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomCategoryTooltip />} wrapperStyle={{ zIndex: 9999, pointerEvents: 'none' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
                <span className="text-2xl font-black text-gray-800">{totalCategoryCount.toLocaleString('vi-VN')}</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Phản ánh</span>
              </div>
            </div>

            {/* Category breakdown list */}
            <div className="space-y-1.5 mt-2 max-h-56 overflow-y-auto pr-1">
              {categoryPieData.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/80 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-700 truncate font-medium">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-semibold text-gray-900">{c.value.toLocaleString('vi-VN')}</span>
                    <span className="text-gray-400 text-[11px] w-9 text-right font-mono">({c.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Top khu phố xuất sắc */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80">
            <h3 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Top 5 Khu phố xuất sắc nhất
            </h3>
            <div className="space-y-1.5">
              {topNeighborhoods.map((s, idx) => (
                <div key={s.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-800' :
                      idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-gray-800">{s.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-gray-500 font-medium">{s.total} đơn</span>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      {s.onTimeRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Secondary charts row: Status + SLA ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 1. Status breakdown */}
        <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
            Phản ánh theo trạng thái
          </h3>
          <HBar data={statusData} colorMap={STATUS_BAR_COLORS} />
        </div>

        {/* 2. SLA donut */}
        <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
            Đúng hạn và trễ hạn
          </h3>
          <SlaDonut {...slaData} />
        </div>
      </div>

      {/* ---- Charts row: Line trend ---- */}
      <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
          Xu hướng phản ánh theo thời gian
        </h3>
        <div className="min-h-64 w-full">
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

      {/* ---- Table 1: Phản ánh cần chú ý ---- */}
      <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
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
                      <td className="px-4 py-2.5 text-sm font-mono text-blue-700 whitespace-nowrap font-bold">{c.code}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-900 max-w-[200px] truncate">{c.title}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{nb?.name || 'Khu phố 1'}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">{dept?.name || 'Bộ phận Đô thị'}</td>
                      <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                        {c.currentDeadline ? formatDateShort(c.currentDeadline) : '15/08/2026'}
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
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold"
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
      <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
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
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center font-semibold">{d.total}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center">{d.inProgress}</td>
                    <td className="px-4 py-2.5 text-sm text-gray-700 text-center">{d.completed}</td>
                    <td className="px-4 py-2.5 text-sm text-green-700 text-center font-medium">{d.onTime}</td>
                    <td className="px-4 py-2.5 text-sm text-red-700 text-center font-medium">{d.late}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full ${
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
      <div className="bg-white rounded-xl p-3.5 md:p-4 shadow-xs border border-slate-200/80">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 ml-2">
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
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
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
