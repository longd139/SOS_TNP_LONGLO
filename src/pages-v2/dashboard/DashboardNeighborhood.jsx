// ============================================================
// DASHBOARD NEIGHBORHOOD — Màn hình quản trị 45 khu phố (PAGE D-02)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Award,
  SlidersHorizontal,
  TrendingUp,
  Layers,
  Sparkles
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
import { useMock } from '../../mock/MockContext';
import { categories } from '../../mock/db';

const CATEGORY_COLORS = {
  'CAT-INFRA': '#3B82F6',
  'CAT-ENV': '#10B981',
  'CAT-URBAN': '#F59E0B',
  'CAT-SEC': '#EF4444',
  'CAT-ELEC': '#8B5CF6',
  'CAT-CONST': '#6366F1',
  'CAT-SAN': '#06B6D4',
  'CAT-OTHER': '#9CA3AF',
};

function DashboardNeighborhood() {
  const navigate = useNavigate();
  const mock = useMock();
  const baseStats = mock.getNeighborhoodStats();
  const { complaints, setFilters } = mock;

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState('total');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);

  // ---- enrich stats ----
  const stats = useMemo(() => {
    return baseStats.map(s => {
      const nc = complaints.filter(c => c.neighborhoodId === s.neighborhoodId);
      const done = nc.filter(c => c.status === 'COMPLETED' && c.receivedAt && c.completedAt);
      const avgDays = done.length > 0
        ? Math.round(done.reduce((sum, c) =>
            sum + (new Date(c.completedAt) - new Date(c.receivedAt)) / 86400000, 0
          ) / done.length * 10) / 10
        : s.avgDays || 2.4;
      return { ...s, avgDays };
    });
  }, [baseStats, complaints]);

  // ---- filters ----
  const toggleNeighborhood = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const clearFilters = () => setSelectedIds([]);

  const filtered = selectedIds.length === 0
    ? stats
    : stats.filter(s => selectedIds.includes(s.neighborhoodId));

  // ---- sort table ----
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (sortKey === 'onTimeRate') {
        av = a.onTimeRate ?? (a.total > 0 ? Math.round((a.onTime / a.total) * 100) : 0);
        bv = b.onTimeRate ?? (b.total > 0 ? Math.round((b.onTime / b.total) * 100) : 0);
      } else if (sortKey === 'neighborhoodName') {
        av = parseInt(a.neighborhoodName.replace(/[^0-9]/g, ''), 10) || 0;
        bv = parseInt(b.neighborhoodName.replace(/[^0-9]/g, ''), 10) || 0;
      } else {
        av = a[sortKey] ?? 0;
        bv = b[sortKey] ?? 0;
      }
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ---- chart sorted (numeric KP 1 to KP 45 order) ----
  const chartData = useMemo(() => {
    return [...filtered]
      .sort((a, b) => {
        const na = parseInt(a.neighborhoodName.replace(/[^0-9]/g, ''), 10) || 0;
        const nb = parseInt(b.neighborhoodName.replace(/[^0-9]/g, ''), 10) || 0;
        return na - nb;
      })
      .map(s => {
        const kpNum = s.neighborhoodName.replace('Khu phố ', '');
        return {
          id: s.neighborhoodId,
          name: `KP ${kpNum}`,
          fullName: s.neighborhoodName,
          total: s.total,
          completed: s.completed,
          inProgress: s.inProgress,
          overdue: s.overdue,
          onTimeRate: s.onTimeRate ?? (s.total > 0 ? Math.round((s.onTime / s.total) * 100) : 85),
          avgDays: s.avgDays,
        };
      });
  }, [filtered]);

  // ---- KPI roll-up ----
  const kpi = useMemo(() => {
    const total = filtered.reduce((sum, x) => sum + x.total, 0);
    const inProgress = filtered.reduce((sum, x) => sum + x.inProgress, 0);
    const completed = filtered.reduce((sum, x) => sum + x.completed, 0);
    const overdue = filtered.reduce((sum, x) => sum + x.overdue, 0);
    const onTime = filtered.reduce((sum, x) => sum + x.onTime, 0);
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 86;
    const avgDays = Math.round((filtered.reduce((sum, x) => sum + (x.avgDays || 2.4), 0) / (filtered.length || 1)) * 10) / 10;
    return { total, inProgress, completed, overdue, onTimeRate, avgDays };
  }, [filtered]);

  // ---- Category breakdown for Pie Chart ----
  const categoryPieData = useMemo(() => {
    const activeCategories = categories.filter(c => c.status === 'ACTIVE');
    const counts = activeCategories.map(cat => {
      const cnt = complaints.filter(c => c.categoryId === cat.id).length;
      return {
        id: cat.id,
        name: cat.name,
        value: cnt > 0 ? cnt : Math.floor(Math.random() * 80 + 20),
        color: CATEGORY_COLORS[cat.id] || '#9CA3AF'
      };
    });
    const totalVal = counts.reduce((acc, curr) => acc + curr.value, 0);
    return counts.map(c => ({
      ...c,
      percent: Math.round((c.value / (totalVal || 1)) * 100)
    })).sort((a, b) => b.value - a.value);
  }, [complaints]);

  const totalCategoryCount = useMemo(() => {
    return categoryPieData.reduce((sum, c) => sum + c.value, 0);
  }, [categoryPieData]);

  // ---- Top performing KP ----
  const topNeighborhoods = useMemo(() => {
    return [...stats]
      .sort((a, b) => (b.onTimeRate * 0.6 + b.total * 0.4) - (a.onTimeRate * 0.6 + a.total * 0.4))
      .slice(0, 5);
  }, [stats]);

  // ---- handlers ----
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortArrow = (key) =>
    sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const handleNeighborhoodClick = (neighborhoodId) => {
    setExpandedId(prev => prev === neighborhoodId ? null : neighborhoodId);
  };

  const handleViewAll = (e, neighborhoodId) => {
    e.stopPropagation();
    setFilters({ neighborhoodId });
    navigate('/admin/complaints');
  };

  // ---- drill-down data for expanded row ----
  const drillData = useMemo(() => {
    if (!expandedId) return null;
    const nc = complaints.filter(c => c.neighborhoodId === expandedId);
    const categoryBreakdown = categories.filter(c => c.status === 'ACTIVE').map(c => ({
      label: c.name,
      count: nc.filter(x => x.categoryId === c.id).length,
    })).filter(d => d.count > 0).sort((a, b) => b.count - a.count);
    const overdueList = nc
      .filter(c => c.status !== 'COMPLETED' && c.status !== 'REJECTED')
      .filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'NEAR_DUE')
      .sort((a, b) => new Date(a.currentDeadline || a.originalDeadline) - new Date(b.currentDeadline || b.originalDeadline))
      .slice(0, 5);
    return { categoryBreakdown, overdueList };
  }, [expandedId, complaints]);

  // ---- badge helpers ----
  const makeBadge = (value, bg, color) => value > 0
    ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: bg, color }}>{value}</span>
    : <span className="text-gray-300">—</span>;

  const badgeOnTimeRate = (rate) => {
    const s = rate >= 85
      ? { bg: '#D1FAE5', color: '#065F46' }
      : rate >= 70
        ? { bg: '#FEF3C7', color: '#92400E' }
        : { bg: '#FEE2E2', color: '#991B1B' };
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
        {rate}%
      </span>
    );
  };

  // ---- table columns ----
  const columns = [
    ['neighborhoodName', 'Khu phố'],
    ['total', 'Tổng phản ánh'],
    ['urgent', 'Khẩn cấp'],
    ['inProgress', 'Đang xử lý'],
    ['completed', 'Hoàn thành'],
    ['overdue', 'Quá hạn'],
    ['onTimeRate', 'Tỷ lệ đúng hạn'],
    ['avgDays', 'TB xử lý'],
  ];

  // ---- map heat colors ----
  const maxTotal = Math.max(...stats.map(s => s.total), 1);
  const maxOverdue = Math.max(...stats.map(s => s.overdue), 1);
  const heatColor = (s) => {
    const score = (s.overdue / (maxOverdue || 1)) * 0.6 + (s.total / maxTotal) * 0.4;
    if (score < 0.33) return { bg: '#ECFDF5', text: '#065F46', ring: 'border-emerald-200' };
    if (score < 0.66) return { bg: '#FFFBEB', text: '#92400E', ring: 'border-amber-200' };
    return { bg: '#FEF2F2', text: '#991B1B', ring: 'border-red-200' };
  };

  // ---- Chart Tooltips ----
  const CustomReceivedTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs z-50">
          <p className="font-bold text-blue-400 mb-1">{data.fullName}</p>
          <div className="space-y-0.5">
            <p><span className="text-gray-400">Tổng phản ánh:</span> <strong className="text-white ml-1">{data.total}</strong></p>
            <p><span className="text-gray-400">Đang xử lý:</span> <strong className="text-amber-400 ml-1">{data.inProgress}</strong></p>
            <p><span className="text-gray-400">Hoàn thành:</span> <strong className="text-emerald-400 ml-1">{data.completed}</strong></p>
            <p><span className="text-gray-400">Quá hạn:</span> <strong className="text-rose-400 ml-1">{data.overdue}</strong></p>
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
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs z-50">
          <p className="font-bold text-emerald-400 mb-1">{data.fullName}</p>
          <p className="text-sm font-semibold text-white">Tỷ lệ xử lý đúng hạn: {data.onTimeRate}%</p>
          <p className="text-gray-300 mt-0.5">Thời gian TB: {data.avgDays} ngày</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-full space-y-5 pb-8">
      {/* ---- Header Banner ---- */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 rounded-2xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-blue-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              DASHBOARD QUẢN TRỊ 45 KHU PHỐ
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              45 khu phố — 1 màn hình điều hành
            </h1>
            <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-2xl">
              Tổng hợp dữ liệu phản ánh, tiến độ xử lý và chỉ số hiệu suất trực quan cho toàn bộ 45 khu phố trên địa bàn phường.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 self-start md:self-auto">
            <MapPin className="w-8 h-8 text-blue-300" />
            <div>
              <p className="text-[11px] text-blue-200 uppercase font-medium">Quy mô quản lý</p>
              <p className="text-xl font-bold">45 Khu phố</p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Filter chip selection ---- */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Bộ lọc so sánh khu phố ({selectedIds.length === 0 ? 'Tất cả 45 khu phố' : `Đang chọn ${selectedIds.length}/45`})
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Bỏ lọc (Xem 45 KP)
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {stats.map(s => {
            const isSelected = selectedIds.includes(s.neighborhoodId);
            return (
              <button
                key={s.neighborhoodId}
                onClick={() => toggleNeighborhood(s.neighborhoodId)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {s.neighborhoodName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- KPI Roll-up Cards ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard title="Tổng phản ánh" value={kpi.total} icon={<MessageSquare size={18} />} color="blue" />
        <StatCard title="Đang xử lý" value={kpi.inProgress} icon={<Clock size={18} />} color="orange" />
        <StatCard title="Hoàn thành" value={kpi.completed} icon={<CheckCircle size={18} />} color="green" />
        <StatCard title="Quá hạn" value={kpi.overdue} icon={<AlertTriangle size={18} />} color="red" />
        <StatCard title="Tỷ lệ xử lý đúng hạn" value={`${kpi.onTimeRate}%`} icon={<BarChart3 size={18} />} color="violet" />
        <StatCard title="Thời gian xử lý TB" value={`${kpi.avgDays} ngày`} icon={<TrendingUp size={18} />} color="blue" />
      </div>

      {/* ---- MAIN CHARTS SECTION ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Combined Scrollable Charts (Phản ánh tiếp nhận & Tỷ lệ xử lý theo khu phố) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-800 flex items-center gap-2">
                <BarChart3 className="text-blue-600 w-5 h-5" />
                Biểu đồ Phản ánh & Tỷ lệ xử lý 45 Khu phố
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tỷ lệ xử lý được xếp ngay bên dưới Phản ánh tiếp nhận (Trượt ngang để duyệt đầy đủ 45 khu phố)
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold animate-pulse">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Thanh trượt ngang 45 KP →
            </div>
          </div>

          {/* SINGLE HORIZONTAL SCROLL WRAPPER FOR BOTH CHARTS */}
          <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-xl bg-slate-50/60 p-4 shadow-inner">
            <div className="w-[2600px] space-y-6">
              {/* TOP CHART: Phản ánh tiếp nhận theo khu phố */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block"></span>
                    Phản ánh tiếp nhận theo khu phố (Số lượng đơn)
                  </h3>
                  <span className="text-xs text-gray-400 font-normal">Trục ngang: 45 Khu phố</span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
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
                      <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* BOTTOM CHART: Tỷ lệ xử lý theo khu phố (Placed directly under Chart 1) */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs md:text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
                    Tỷ lệ xử lý đúng hạn theo khu phố (%)
                  </h3>
                  <span className="text-xs text-gray-400 font-normal">Đồng bộ khớp theo 45 Khu phố</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 25 }}>
                      <defs>
                        <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
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
                        fill="url(#rateGradient)"
                        dot={{ r: 3.5, fill: '#059669', stroke: '#ffffff', strokeWidth: 1 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Phân loại phản ánh & Hoạt động cộng đồng (Positioned side-by-side with Left Column) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col justify-between">
          {/* Card 1: Phân loại phản ánh (Pie / Donut Chart) */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100 flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Phân loại phản ánh
              </h2>
              <span className="text-xs text-gray-400 font-normal">Tất cả các khu</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">Tỷ lệ phân bổ phản ánh theo từng lĩnh vực</p>

            {/* Donut Chart */}
            <div className="h-52 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={82}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} phản ánh`, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-gray-800">{totalCategoryCount}</span>
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Phản ánh</span>
              </div>
            </div>

            {/* Category breakdown list */}
            <div className="space-y-2 mt-3 max-h-60 overflow-y-auto pr-1">
              {categoryPieData.map(c => (
                <div key={c.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-gray-50/80 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                    <span className="text-gray-700 truncate font-medium">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-semibold text-gray-900">{c.value}</span>
                    <span className="text-gray-400 text-[11px] w-9 text-right font-mono">({c.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Top khu phố dẫn đầu & Hoạt động cộng đồng */}
          <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Xếp hạng khu phố dẫn đầu (Top 5)
            </h3>
            <div className="space-y-2">
              {topNeighborhoods.map((s, idx) => (
                <div key={s.neighborhoodId} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      idx === 0 ? 'bg-amber-400 text-amber-950' :
                      idx === 1 ? 'bg-slate-300 text-slate-800' :
                      idx === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-medium text-gray-800">{s.neighborhoodName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">{s.total} đơn</span>
                    {badgeOnTimeRate(s.onTimeRate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---- COMPARISON TABLE ---- */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              Bảng dữ liệu chi tiết 45 khu phố
            </h3>
            <p className="text-xs text-gray-500">Nhấp vào dòng khu phố để xem phân rã theo lĩnh vực và các ca quá hạn</p>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-lg self-start sm:self-auto">
            Hiển thị {sorted.length} / 45 khu phố
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-slate-50">
              <tr>
                {columns.map(([key, label]) => (
                  <th
                    key={key}
                    className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-blue-600 select-none ${key === 'neighborhoodName' ? 'text-left' : 'text-center'}`}
                    onClick={() => handleSort(key)}
                  >
                    {label}{sortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {sorted.map(s => {
                const onTimeRate = s.onTimeRate ?? (s.total > 0 ? Math.round((s.onTime / s.total) * 100) : 0);
                const isExpanded = expandedId === s.neighborhoodId;
                return (
                  <React.Fragment key={s.neighborhoodId}>
                    <tr
                      className={`cursor-pointer transition-colors hover:bg-blue-50/50 ${isExpanded ? 'bg-blue-50/80 font-medium' : ''}`}
                      onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                        <span className="inline-flex items-center gap-1.5">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          {s.neighborhoodName}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center font-bold text-gray-800">{s.total}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">{makeBadge(s.urgent, '#FEE2E2', '#991B1B')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">{makeBadge(s.inProgress, '#DBEAFE', '#1E40AF')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">{makeBadge(s.completed, '#D1FAE5', '#065F46')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">{makeBadge(s.overdue, '#FEE2E2', '#991B1B')}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">{badgeOnTimeRate(onTimeRate)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-center text-gray-600 font-medium">
                        {s.avgDays != null ? `${s.avgDays} ngày` : '—'}
                      </td>
                    </tr>
                    {/* Expanded drill-down row */}
                    {isExpanded && drillData && (
                      <tr key={`${s.neighborhoodId}-expanded`}>
                        <td colSpan={8} className="px-6 py-4 bg-slate-50 border-t border-b border-blue-100">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Category breakdown */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Phân bố theo lĩnh vực</h4>
                              {drillData.categoryBreakdown.length === 0 ? (
                                <p className="text-xs text-gray-400">Không có dữ liệu</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {drillData.categoryBreakdown.map(d => {
                                    const maxC = Math.max(...drillData.categoryBreakdown.map(x => x.count), 1);
                                    return (
                                      <div key={d.label} className="flex items-center gap-2 text-xs">
                                        <span className="w-36 text-gray-600 truncate">{d.label}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-3.5 overflow-hidden">
                                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(d.count / maxC) * 100}%`, minWidth: d.count > 0 ? '6px' : 0 }} />
                                        </div>
                                        <span className="w-8 text-right text-gray-700 font-semibold">{d.count}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {/* Overdue list */}
                            <div>
                              <h4 className="text-xs font-bold text-gray-600 uppercase mb-2">Phản ánh cần chú ý</h4>
                              {drillData.overdueList.length === 0 ? (
                                <p className="text-xs text-gray-400">Không có phản ánh quá hạn</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {drillData.overdueList.map(c => (
                                    <div key={c.id} className="flex items-center justify-between text-xs bg-white rounded-lg px-3 py-2 border border-gray-200">
                                      <div className="flex-1 min-w-0 pr-2">
                                        <p className="text-gray-800 truncate font-medium">{c.title}</p>
                                        <p className="text-gray-400">{c.code}</p>
                                      </div>
                                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium flex-shrink-0 ${c.slaStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {c.slaStatus === 'OVERDUE' ? 'Quá hạn' : 'Sắp hết hạn'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-3 text-right">
                            <button
                              onClick={(e) => handleViewAll(e, s.neighborhoodId)}
                              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                            >
                              Xem tất cả phản ánh của {s.neighborhoodName} →
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- NEIGHBORHOOD STATUS CARDS GRID (45 KHU PHỐ) ---- */}
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-gray-100">
        <div className="mb-3">
          <h3 className="text-base md:text-lg font-bold text-gray-800">
            Trạng thái 45 khu phố
          </h3>
          <p className="text-xs text-gray-500">Thống kê nhanh từng khu phố (Màu sắc theo mức độ khẩn cấp & phản ánh quá hạn)</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
          {stats.map(s => {
            const h = heatColor(s);
            const isSelected = selectedIds.includes(s.neighborhoodId);
            return (
              <div
                key={s.neighborhoodId}
                onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
                className={`bg-white rounded-xl p-3 shadow-xs border cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${h.ring} ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
              >
                <p className="text-xs font-bold text-gray-800 truncate mb-1">{s.neighborhoodName}</p>
                <p className="text-xl font-extrabold mb-1" style={{ color: h.text }}>{s.total}</p>
                <span
                  className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold truncate w-full text-center"
                  style={{ backgroundColor: h.bg, color: h.text }}
                >
                  {s.overdue > 0 ? `${s.overdue} quá hạn` : `${s.onTimeRate}% đúng hạn`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DashboardNeighborhood;
