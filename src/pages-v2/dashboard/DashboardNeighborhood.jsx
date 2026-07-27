// ============================================================
// DASHBOARD NEIGHBORHOOD — So sanh cac khu pho (PAGE D-02)
// ============================================================
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, MessageSquare, Clock, CheckCircle, AlertTriangle, BarChart3, ChevronDown, ChevronUp } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import { useMock } from '../../mock/MockContext';
import { getCategoryById, categories } from '../../mock/db';

function DashboardNeighborhood() {
  const navigate = useNavigate();
  const mock = useMock();
  const baseStats = mock.getNeighborhoodStats();
  const { complaints, setFilters } = mock;

  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState('total');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedId, setExpandedId] = useState(null);

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
      let av, bv;
      if (sortKey === 'onTimeRate') {
        av = a.total > 0 ? Math.round((a.onTime / a.total) * 100) : 0;
        bv = b.total > 0 ? Math.round((b.onTime / b.total) * 100) : 0;
      } else if (sortKey === 'neighborhoodName') {
        av = a.neighborhoodName;
        bv = b.neighborhoodName;
      } else {
        av = a[sortKey] ?? 0;
        bv = b[sortKey] ?? 0;
      }
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

  // ---- badge helpers (exact badgeUtils.jsx palette) ----
  const makeBadge = (value, bg, color) => value > 0
    ? <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: bg, color }}>{value}</span>
    : <span className="text-gray-300">—</span>;

  const badgeOnTimeRate = (rate) => {
    const s = rate >= 80
      ? { bg: '#D1FAE5', color: '#065F46' }
      : rate >= 50
        ? { bg: '#FEF3C7', color: '#92400E' }
        : { bg: '#FEE2E2', color: '#991B1B' };
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
        {rate}%
      </span>
    );
  };

  // ---- table columns ----
  const columns = [
    ['neighborhoodName', 'Khu phố'],
    ['total', 'Tổng'],
    ['urgent', 'Khẩn cấp'],
    ['inProgress', 'Đang xử l\xFD'],
    ['completed', 'Ho\xE0n th\xE0nh'],
    ['overdue', 'Qu\xE1 hạn'],
    ['onTimeRate', 'Tỷ lệ đ\xFAng hạn'],
    ['avgDays', 'TB xử l\xFD'],
  ];

  // ---- map heat colors (based on volume + overdue) ----
  const maxTotal = Math.max(...stats.map(s => s.total), 1);
  const maxOverdue = Math.max(...stats.map(s => s.overdue), 1);
  const heatColor = (s) => {
    const score = (s.overdue / (maxOverdue || 1)) * 0.6 + (s.total / maxTotal) * 0.4;
    if (score < 0.33) return { bg: '#ECFDF5', text: '#065F46', ring: 'border-emerald-200' };
    if (score < 0.66) return { bg: '#FFFBEB', text: '#92400E', ring: 'border-amber-200' };
    return { bg: '#FEF2F2', text: '#991B1B', ring: 'border-red-200' };
  };

  return (
    <div className="min-h-full">
      {/* ---- Page title ---- */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MapPin size={24} className="text-blue-600" />
          Dashboard theo khu phố
        </h1>
        <p className="text-gray-600 mt-1">So s\xE1nh hiệu suất xử l\xFD phản \xE1nh giữa c\xE1c khu phố</p>
      </div>

      {/* ---- Neighborhood filter chips ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4">
        <p className="text-xs text-gray-500 mb-2">Chọn khu phố để so s\xE1nh (bỏ trống = tất cả)</p>
        <div className="flex flex-wrap gap-2">
          {stats.map(s => (
            <button
              key={s.neighborhoodId}
              onClick={() => toggleNeighborhood(s.neighborhoodId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedIds.includes(s.neighborhoodId)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {s.neighborhoodName}
            </button>
          ))}
        </div>
      </div>

      {/* ---- KPI Row ---- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4">
        <StatCard title="Tổng phản \xE1nh" value={kpi.total} icon={<MessageSquare size={20} />} color="blue" />
        <StatCard title="Đang xử l\xFD" value={kpi.inProgress} icon={<Clock size={20} />} color="orange" />
        <StatCard title="Ho\xE0n th\xE0nh" value={kpi.completed} icon={<CheckCircle size={20} />} color="green" />
        <StatCard title="Qu\xE1 hạn" value={kpi.overdue} icon={<AlertTriangle size={20} />} color="red" />
        <StatCard title="Tỷ lệ đ\xFAng hạn" value={`${kpi.onTimeRate}%`} icon={<BarChart3 size={20} />} color="violet" />
      </div>

      {/* ---- Comparison Table (BaseTable style) ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
          Bảng so s\xE1nh khu phố
        </h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(([key, label]) => (
                  <th
                    key={key}
                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-gray-700 select-none ${key === 'neighborhoodName' ? 'text-left' : 'text-center'}`}
                    onClick={() => handleSort(key)}
                  >
                    {label}{sortArrow(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sorted.map(s => {
                const onTimeRate = s.total > 0 ? Math.round((s.onTime / s.total) * 100) : 0;
                const isExpanded = expandedId === s.neighborhoodId;
                return (
                  <React.Fragment key={s.neighborhoodId}>
                    <tr
                      className={`cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                      onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-600" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                          {s.neighborhoodName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold text-gray-700">{s.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{makeBadge(s.urgent, '#FEE2E2', '#991B1B')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{makeBadge(s.inProgress, '#DBEAFE', '#1E40AF')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{makeBadge(s.completed, '#D1FAE5', '#065F46')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{makeBadge(s.overdue, '#FEE2E2', '#991B1B')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center">{badgeOnTimeRate(onTimeRate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                        {s.avgDays != null ? `${s.avgDays} ng\xE0y` : '—'}
                      </td>
                    </tr>
                    {/* Expanded drill-down row */}
                    {isExpanded && drillData && (
                      <tr key={`${s.neighborhoodId}-expanded`}>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Category breakdown */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Phân bố theo loại</h4>
                              {drillData.categoryBreakdown.length === 0 ? (
                                <p className="text-xs text-gray-400">Không có dữ liệu</p>
                              ) : (
                                <div className="space-y-1">
                                  {drillData.categoryBreakdown.map(d => {
                                    const maxC = Math.max(...drillData.categoryBreakdown.map(x => x.count), 1);
                                    return (
                                      <div key={d.label} className="flex items-center gap-2 text-xs">
                                        <span className="w-32 text-gray-600 truncate">{d.label}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(d.count / maxC) * 100}%`, minWidth: d.count > 0 ? '8px' : 0 }} />
                                        </div>
                                        <span className="w-6 text-right text-gray-700 font-medium">{d.count}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                            {/* Overdue list */}
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Phản ánh quá hạn / sắp hết hạn</h4>
                              {drillData.overdueList.length === 0 ? (
                                <p className="text-xs text-gray-400">Không có phản ánh quá hạn</p>
                              ) : (
                                <div className="space-y-1.5">
                                  {drillData.overdueList.map(c => (
                                    <div key={c.id} className="flex items-center justify-between text-xs bg-white rounded-lg px-3 py-2 border border-gray-100">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-gray-700 truncate font-medium">{c.title}</p>
                                        <p className="text-gray-400">{c.code}</p>
                                      </div>
                                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${c.slaStatus === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
                              className="text-xs font-medium text-blue-600 hover:text-blue-800"
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
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-400">
                    Kh\xF4ng c\xF3 dữ liệu khu phố n\xE0o
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Mock Map: Neighborhood cards grid ---- */}
      <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 ml-3 mt-2">
          Bản đồ khu phố
        </h3>
        <p className="text-[10px] text-gray-400 ml-3 -mt-2 mb-4">(theo số lượng phản \xE1nh)</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {stats.map(s => {
            const h = heatColor(s);
            return (
              <div
                key={s.neighborhoodId}
                onClick={() => handleNeighborhoodClick(s.neighborhoodId)}
                className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer hover:shadow-md ${h.ring}`}
              >
                <p className="text-sm font-semibold text-gray-800 mb-1">{s.neighborhoodName}</p>
                <p className="text-2xl font-bold mb-1" style={{ color: h.text }}>{s.total}</p>
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: h.bg, color: h.text }}
                >
                  {s.overdue > 0 ? `${s.overdue} qu\xE1 hạn` : `${s.completed} ho\xE0n th\xE0nh`}
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
