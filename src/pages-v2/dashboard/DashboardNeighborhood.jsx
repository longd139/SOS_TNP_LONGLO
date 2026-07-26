// ============================================================
// DASHBOARD NEIGHBORHOOD — So sánh các khu phố
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, BarChart3, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import { getNeighborhoodById } from '../../mock/db';
import { StatusBadge, SlaBadge } from '../../mock/components/Badges';

function DashboardNeighborhood() {
  const navigate = useNavigate();
  const mock = useMock();
  const baseStats = mock.getNeighborhoodStats();
  const { complaints, setFilters } = mock;

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState('total');
  const [sortDir, setSortDir] = useState('desc');

  // ---- enrich with avg processing days ----
  const stats = useMemo(() => baseStats.map(s => {
    const done = complaints.filter(c =>
      c.neighborhoodId === s.neighborhoodId &&
      c.receivedAt && c.completedAt
    );
    const avgDays = done.length > 0
      ? Math.round(done.reduce((sum, c) =>
          sum + (new Date(c.completedAt) - new Date(c.receivedAt)) / 86400000, 0
        ) / done.length * 10) / 10
      : null;
    return { ...s, avgDays };
  }), [baseStats, complaints]);

  // ---- filters ----
  const toggleNeighborhood = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filtered = selectedIds.length === 0
    ? stats
    : stats.filter(s => selectedIds.includes(s.neighborhoodId));

  // ---- sort ----
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const resolve = (x) => {
        if (sortKey === 'onTimeRate') return x.total > 0 ? Math.round((x.onTime / x.total) * 100) : 0;
        if (sortKey === 'neighborhoodName') return x.neighborhoodName;
        const v = x[sortKey];
        return v == null ? 0 : v;
      };
      const av = resolve(a);
      const bv = resolve(b);
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  // ---- KPI roll-up ----
  const kpi = useMemo(() => {
    const total = filtered.reduce((sum, x) => sum + x.total, 0);
    const inProgress = filtered.reduce((sum, x) => sum + x.inProgress, 0);
    const completed = filtered.reduce((sum, x) => sum + x.completed, 0);
    const overdue = filtered.reduce((sum, x) => sum + x.overdue, 0);
    const onTime = filtered.reduce((sum, x) => sum + x.onTime, 0);
    const onTimeRate = total > 0 ? Math.round((onTime / total) * 100) : 0;
    return { total, inProgress, completed, overdue, onTimeRate };
  }, [filtered]);

  // ---- handlers ----
  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const sortArrow = (key) =>
    sortKey === key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';

  const handleNeighborhoodClick = (neighborhoodId) => {
    setFilters({ neighborhoodId });
    navigate('/admin/complaints');
  };

  // ---- volume color for map cards ----
  const maxTotal = Math.max(...stats.map(s => s.total), 1);
  const volumeColor = (total) => {
    const pct = total / maxTotal;
    if (pct < 0.33) return 'text-green-600 bg-green-50';
    if (pct < 0.66) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  // ---- bar chart data (sorted by total desc) ----
  const barMax = Math.max(...stats.map(s => s.total), 1);
  const barData = [...stats].sort((a, b) => b.total - a.total);

  // ---- table columns config ----
  const columns = [
    ['neighborhoodName', 'Khu phố'],
    ['total', 'Tổng'],
    ['urgent', 'Khẩn cấp'],
    ['inProgress', 'Đang xử lý'],
    ['completed', 'Hoàn thành'],
    ['overdue', 'Quá hạn'],
    ['onTimeRate', 'Tỷ lệ đúng hạn'],
    ['avgDays', 'TB xử lý (ngày)'],
  ];

  return (
    <div className="space-y-3 md:space-y-4 min-h-full">
      {/* ---- Title ---- */}
      <div className="flex items-center gap-2">
        <MapPin size={22} className="text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Dashboard theo khu phố</h2>
      </div>

      {/* ---- Neighborhood filter chips ---- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <p className="text-xs text-gray-500 mb-2">Chọn khu phố để so sánh (bỏ trống = tất cả)</p>
        <div className="flex flex-wrap gap-2">
          {stats.map(s => (
            <button
              key={s.neighborhoodId}
              onClick={() => toggleNeighborhood(s.neighborhoodId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedIds.includes(s.neighborhoodId)
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {s.neighborhoodName}
            </button>
          ))}
        </div>
      </div>

      {/* ---- KPI Row ---- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Tổng', value: kpi.total, color: 'text-blue-600', bg: 'bg-blue-50', icon: '📋' },
          { label: 'Đang xử lý', value: kpi.inProgress, color: 'text-orange-600', bg: 'bg-orange-50', icon: '⏳' },
          { label: 'Hoàn thành', value: kpi.completed, color: 'text-green-600', bg: 'bg-green-50', icon: '✅' },
          { label: 'Quá hạn', value: kpi.overdue, color: 'text-red-600', bg: 'bg-red-50', icon: '⚠️' },
          { label: 'Tỷ lệ đúng hạn', value: `${kpi.onTimeRate}%`, color: 'text-violet-600', bg: 'bg-violet-50', icon: '📊' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{k.label}</p>
                <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
              </div>
              <div className={`w-10 h-10 ${k.bg} rounded-lg flex items-center justify-center text-lg`}>
                {k.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Comparison Table ---- */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <BarChart3 size={18} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-700">Bảng so sánh khu phố</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wider">
                {columns.map(([key, label]) => (
                  <th
                    key={key}
                    className={`px-3 py-2.5 cursor-pointer hover:text-gray-700 select-none ${key === 'neighborhoodName' ? 'text-left' : 'text-center'}`}
                    onClick={() => handleSort(key)}
                  >
                    {label}{sortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sorted.map(s => {
                const overdueRate = s.total > 0 ? (s.overdue / s.total) * 100 : 0;
                const onTimeRate = s.total > 0 ? Math.round((s.onTime / s.total) * 100) : 0;
                return (
                  <tr
                    key={s.neighborhoodId}
                    className={`cursor-pointer transition-colors ${
                      overdueRate > 30
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
                  >
                    <td className="px-3 py-2.5 font-medium text-gray-800">{s.neighborhoodName}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-gray-700">{s.total}</td>
                    <td className="px-3 py-2.5 text-center">
                      {s.urgent > 0
                        ? <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-medium">{s.urgent}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-center text-orange-600 font-medium">{s.inProgress || '—'}</td>
                    <td className="px-3 py-2.5 text-center text-green-600 font-medium">{s.completed || '—'}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={s.overdue > 0 ? 'text-red-600 font-medium' : 'text-gray-400'}>{s.overdue || '—'}</span>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className={`font-medium ${
                        onTimeRate >= 80 ? 'text-green-600' : onTimeRate >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {onTimeRate}%
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-center text-gray-500">
                      {s.avgDays != null ? `${s.avgDays} ngày` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Bar Chart: side-by-side bars ---- */}
      {/* ponytail: CSS grouped bars; swap for recharts when >5 metrics */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-700">Biểu đồ so sánh: Tổng vs Hoàn thành vs Quá hạn</h3>
        </div>
        <div className="space-y-2">
          {barData.map(s => (
            <div key={s.neighborhoodId} className="flex items-center gap-2 text-xs">
              <span className="w-24 truncate text-gray-600">{s.neighborhoodName}</span>
              <div className="flex-1 flex items-end gap-0.5 h-6">
                <div
                  className="h-5 bg-blue-400 rounded-sm"
                  style={{ width: `${(s.total / barMax) * 100}%`, minWidth: s.total > 0 ? '3px' : 0 }}
                  title={`Tổng: ${s.total}`}
                />
                <div
                  className="h-5 bg-green-400 rounded-sm"
                  style={{ width: `${(s.completed / barMax) * 100}%`, minWidth: s.completed > 0 ? '3px' : 0 }}
                  title={`Hoàn thành: ${s.completed}`}
                />
                <div
                  className="h-5 bg-red-400 rounded-sm"
                  style={{ width: `${(s.overdue / barMax) * 100}%`, minWidth: s.overdue > 0 ? '3px' : 0 }}
                  title={`Quá hạn: ${s.overdue}`}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-400 rounded-sm inline-block" /> Tổng</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Hoàn thành</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Quá hạn</span>
        </div>
      </div>

      {/* ---- Mock Map: Neighborhood cards grid ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={18} className="text-blue-500" />
          <h3 className="text-sm font-semibold text-gray-700">Bản đồ khu phố</h3>
          <span className="text-[10px] text-gray-400 ml-2">(theo số lượng phản ánh)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stats.map(s => (
            <div
              key={s.neighborhoodId}
              onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-800 mb-1">{s.neighborhoodName}</p>
                <ArrowRight size={14} className="text-gray-300 mt-0.5" />
              </div>
              <p className={`text-2xl font-bold mb-1 ${volumeColor(s.total).split(' ').slice(0, 1).join(' ')}`}>{s.total}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${volumeColor(s.total)}`}>
                {s.overdue > 0 ? `${s.overdue} quá hạn` : 'phản ánh'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardNeighborhood;
