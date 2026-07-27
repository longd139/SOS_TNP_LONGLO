// ============================================================
// PAGE D-03 — DASHBOARD LARGE SCREEN (TV / operations room)
// Dark bg-slate-900. Badges use exact badgeUtils.jsx / db.js palette.
// ============================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Maximize, Minimize, Clock, RefreshCw, Settings, X } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import {
  getTimeRemaining,
  getNeighborhoodById,
  getStatusLabel,
  getSlaLabel,
  getStatusColor,
  getSlaColor,
} from '../../mock/db';
import { neighborhoods, departments } from '../../mock/db';

// ============================================================
// SVG donut — Trang thai
// ============================================================
function StatusDonut({ inProgress, overdue, completed, others }) {
  const total = inProgress + overdue + completed + others || 1;
  const segments = [
    { value: inProgress, color: '#3b82f6', label: 'Đang xử lý' },
    { value: overdue, color: '#ef4444', label: 'Quá hạn' },
    { value: completed, color: '#22c55e', label: 'Hoàn thành' },
    { value: others, color: '#94a3b8', label: 'Khác' },
  ];

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 36 36" className="shrink-0">
        {segments.map((s, i) => {
          const pct = (s.value / total) * 100;
          const dash = (pct / 100) * 100;
          const offset = segments.slice(0, i).reduce((a, x) => a + ((x.value / total) * 100), 0);
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
        <text x="18" y="19" textAnchor="middle" className="text-[7px] font-bold fill-white">{total}</text>
        <text x="18" y="23" textAnchor="middle" className="text-[3px] fill-slate-400">Tổng</text>
      </svg>
      <div className="space-y-1.5 text-xs">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
            <span className="text-slate-300">{s.label}</span>
            <span className="font-semibold text-white">{s.value}</span>
            <span className="text-slate-500">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Horizontal bar chart — Phan anh theo trang thai
// ============================================================
function StatusBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const colors = {
    'Mới gửi':          'bg-amber-500',
    'Chờ tiếp nhận':    'bg-slate-400',
    'Đã tiếp nhận':     'bg-blue-400',
    'Đã phân công':     'bg-purple-400',
    'Đang xử lý':       'bg-orange-400',
    'Chờ duyệt GH':     'bg-yellow-400',
    'Hoàn thành':       'bg-green-400',
    'Từ chối':          'bg-red-400',
  };

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-2 text-xs">
          <span className="w-28 text-slate-400 truncate">{d.label}</span>
          <div className="flex-1 bg-slate-700 rounded-full h-5 overflow-hidden">
            <div
              className={`h-full rounded-full ${colors[d.label] || 'bg-slate-400'} transition-all duration-500`}
              style={{ width: `${(d.count / max) * 100}%`, minWidth: d.count > 0 ? '12px' : 0 }}
            />
          </div>
          <span className="w-8 text-right text-slate-300 font-medium">{d.count}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// 7-day trend bars
// ============================================================
function TrendBars({ days }) {
  const max = Math.max(...days.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-1 h-36">
      {days.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs text-slate-400 font-medium">{d.count}</span>
          <div
            className="w-full bg-cyan-400 rounded-t hover:bg-cyan-300 transition-colors"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }}
          />
          <span className="text-[10px] text-slate-500">{d.label.split('/')[0]}</span>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MAIN
// ============================================================
function DashboardLargeScreen() {
  const mock = useMock();
  const stats = mock.getDashboardStats();
  const allComplaints = mock.complaints;
  const neighborhoodStats = mock.getNeighborhoodStats();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [now, setNow] = useState(new Date());
  const [scrollIndex, setScrollIndex] = useState(0);
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState({
    slideInterval: 10,
    refreshInterval: 30,
    showKpi: true,
    showStatusDonut: true,
    showStatusBar: true,
    showTrend: true,
    showOverdueList: true,
    showPendingExtensions: true,
    showTopNeighborhoods: true,
    showSensitiveInfo: false,
    configKp: '',
    configDept: '',
  });

  // Digital clock every 1s
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Escape key / FS change handler
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && document.fullscreenElement) setIsFullscreen(false);
    };
    const fsHandler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('keydown', handler);
    document.addEventListener('fullscreenchange', fsHandler);
    return () => {
      document.removeEventListener('keydown', handler);
      document.removeEventListener('fullscreenchange', fsHandler);
    };
  }, []);

  // Overdue complaints (top 10, sorted by deadline ascending)
  const overdueList = useMemo(() => {
    return allComplaints
      .filter((c) =>
        c.status !== 'COMPLETED' && c.status !== 'REJECTED' &&
        (c.slaStatus === 'OVERDUE' || c.slaStatus === 'NEAR_DUE' || c.slaStatus === 'COMPLETED_LATE')
      )
      .sort((a, b) => {
        const dlA = new Date(a.currentDeadline || a.originalDeadline || 0);
        const dlB = new Date(b.currentDeadline || b.originalDeadline || 0);
        return dlA - dlB;
      })
      .slice(0, 10);
  }, [allComplaints]);

  // Top 5 neighborhoods
  const topNeighborhoods = useMemo(() => {
    return neighborhoodStats
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [neighborhoodStats]);

  // 7-day trend
  const trend7d = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const count = allComplaints.filter((c) => c.createdAt.slice(0, 10) === ds).length;
      days.push({
        label: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        count,
      });
    }
    return days;
  }, [allComplaints]);

  // Status breakdown for bar chart
  const statusBreakdown = useMemo(() => {
    const groups = {};
    allComplaints.forEach((c) => {
      const label = getStatusLabel(c.status);
      groups[label] = (groups[label] || 0) + 1;
    });
    return Object.entries(groups)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);
  }, [allComplaints]);

  // Auto-scroll overdue list every 5s
  useEffect(() => {
    if (overdueList.length === 0) return;
    const t = setInterval(() => {
      setScrollIndex((prev) => (prev + 1) % overdueList.length);
    }, 5000);
    return () => clearInterval(t);
  }, [overdueList.length]);

  const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });
  const updateStr = lastUpdate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col overflow-hidden">
      {/* ---- Top bar ---- */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-white">
            BẢNG ĐIỀU KHIỂN PHÒNG TRỰC BAN
          </h1>
          <span className="text-sm text-slate-500 hidden lg:inline">|</span>
          <span className="text-sm text-slate-400 hidden lg:inline">{dateStr}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock size={16} />
            <span className="text-xl lg:text-2xl font-mono font-bold text-white tabular-nums">{timeStr}</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
            <RefreshCw size={12} />
            <span>Cập nhật lúc {updateStr}</span>
          </div>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-lg transition-colors ${showConfig ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 text-slate-400 hover:text-white'}`}
            title="Cấu hình hiển thị"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* ---- Main content: 3 columns, fill remaining height ---- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-3 p-3 min-h-0">
        {/* ===== LEFT: KPI cards ===== */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="bg-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-400 mb-1">Tổng hôm nay</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.todayCount}</p>
              <p className="text-xs text-slate-500 mt-1">/ {stats.total} tổng</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-400 mb-1">Đang xử lý</p>
              <p className="text-3xl font-bold text-blue-400">{stats.inProgressCount}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.extensionPendingCount > 0 ? `${stats.extensionPendingCount} chờ GH` : ''}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-400 mb-1">Quá hạn</p>
              <p className="text-3xl font-bold text-red-400">{stats.overdueCount}</p>
              <p className="text-xs text-slate-500 mt-1">{stats.nearDueCount > 0 ? `${stats.nearDueCount} sắp đến hạn` : ''}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4 flex flex-col justify-center">
              <p className="text-sm text-slate-400 mb-1">Đúng hạn</p>
              <p className="text-3xl font-bold text-green-400">{stats.onTimeRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{stats.completedOnTimeCount}/{stats.completedCount} PA</p>
            </div>
          </div>
          {/* Pending extensions quick list */}
          <div className="bg-slate-800 rounded-xl p-4 flex-1 overflow-auto min-h-0">
            <h2 className="text-sm font-semibold text-slate-300 mb-2">Chờ duyệt gia hạn</h2>
            {allComplaints.filter(c => c.status === 'EXTENSION_PENDING').length === 0 ? (
              <p className="text-xs text-slate-500">Không có yêu cầu nào</p>
            ) : (
              <div className="space-y-1.5">
                {allComplaints.filter(c => c.status === 'EXTENSION_PENDING').slice(0, 6).map(c => (
                  <div key={c.id} className="text-xs bg-slate-700/50 rounded-lg px-3 py-2">
                    <p className="text-slate-200 truncate">{c.title}</p>
                    <p className="text-slate-400 mt-0.5">{c.code} • {getTimeRemaining(c.currentDeadline || c.originalDeadline)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== CENTER: Charts ===== */}
        <div className="flex flex-col gap-3 min-h-0 overflow-auto">
          {/* Status donut */}
          <div className="bg-slate-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Phân bổ trạng thái</h2>
            <StatusDonut
              inProgress={stats.inProgressCount}
              overdue={stats.overdueCount}
              completed={stats.completedCount}
              others={Math.max(0, stats.total - stats.inProgressCount - stats.overdueCount - stats.completedCount)}
            />
          </div>

          {/* Status bar chart */}
          <div className="bg-slate-800 rounded-xl p-4 flex-1">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Phản ánh theo trạng thái</h2>
            <StatusBarChart data={statusBreakdown} />
          </div>

          {/* 7-day trend */}
          <div className="bg-slate-800 rounded-xl p-4 flex-1">
            <h2 className="text-sm font-semibold text-slate-300 mb-3">Xu hướng 7 ngày</h2>
            <TrendBars days={trend7d} />
          </div>
        </div>

        {/* ===== RIGHT: Lists ===== */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Overdue scrolling list */}
          <div className="bg-slate-800 rounded-xl p-4 flex flex-col flex-1 min-h-0 overflow-hidden">
            <h2 className="text-sm font-semibold text-red-400 mb-2 flex-shrink-0">
              Phản ánh trễ hạn ({overdueList.length})
            </h2>
            {overdueList.length === 0 ? (
              <p className="text-xs text-slate-500">Không có phản ánh trễ hạn.</p>
            ) : (
              <div className="flex-1 overflow-hidden relative">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${scrollIndex * 68}px)` }}
                >
                  {overdueList.map((c) => {
                    const nb = getNeighborhoodById(c.neighborhoodId);
                    const remaining = getTimeRemaining(c.currentDeadline || c.originalDeadline);
                    const s = getStatusColor(c.status);
                    const sl = getSlaColor(c.slaStatus);
                    return (
                      <div
                        key={c.id}
                        className="flex items-start gap-2 py-2 border-b border-slate-700/50 min-h-[68px]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-200 truncate">{c.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full"
                              style={{ backgroundColor: s.bg, color: s.color }}
                            >
                              {getStatusLabel(c.status)}
                            </span>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full"
                              style={{ backgroundColor: sl.bg, color: sl.color }}
                            >
                              {getSlaLabel(c.slaStatus)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                            <span className="text-red-400 font-medium">{remaining || '--'}</span>
                            {nb && <span>{nb.name}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top 5 neighborhoods */}
          <div className="bg-slate-800 rounded-xl p-4 flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-300 mb-2">Khu phố nổi bật</h2>
            {topNeighborhoods.length === 0 ? (
              <p className="text-xs text-slate-500">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-2">
                {topNeighborhoods.map((nb, idx) => (
                  <div key={nb.neighborhoodId} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 w-4">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-xs font-medium text-slate-200">{nb.neighborhoodName}</span>
                        <span className="text-xs font-bold text-slate-300">{nb.total}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${Math.min((nb.total / Math.max(...topNeighborhoods.map((x) => x.total), 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex gap-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="text-red-400">{nb.overdue} trễ</span>
                        <span className="text-green-400">{nb.completed} xong</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======== CONFIG DRAWER ======== */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfig(false)} />
          <div className="relative w-80 bg-slate-800 border-l border-slate-700 h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-5 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings size={18} /> Cấu hình
              </h2>
              <button onClick={() => setShowConfig(false)} className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Slide / Refresh cycle */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Chu kỳ</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Chu kỳ chuyển slide (giây)</label>
                    <input type="number" min={5} max={60} value={config.slideInterval}
                      onChange={e => setConfig(p => ({ ...p, slideInterval: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Chu kỳ refresh (giây)</label>
                    <input type="number" min={10} max={300} value={config.refreshInterval}
                      onChange={e => setConfig(p => ({ ...p, refreshInterval: Number(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Widget visibility */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Widget hiển thị</h3>
                <div className="space-y-2">
                  {[
                    { key: 'showKpi', label: 'KPI tổng quan' },
                    { key: 'showStatusDonut', label: 'Biểu đồ trạng thái (donut)' },
                    { key: 'showStatusBar', label: 'Phản ánh theo trạng thái' },
                    { key: 'showTrend', label: 'Xu hướng 7 ngày' },
                    { key: 'showOverdueList', label: 'Danh sách quá hạn' },
                    { key: 'showPendingExtensions', label: 'Chờ duyệt gia hạn' },
                    { key: 'showTopNeighborhoods', label: 'Khu phố nổi bật' },
                  ].map(w => (
                    <label key={w.key} className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-sm text-slate-300">{w.label}</span>
                      <input type="checkbox" checked={config[w.key]}
                        onChange={e => setConfig(p => ({ ...p, [w.key]: e.target.checked }))}
                        className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                    </label>
                  ))}
                </div>
              </div>

              {/* Sensitive info */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Bảo mật</h3>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-slate-300">Hiển thị thông tin nhạy cảm</span>
                  <input type="checkbox" checked={config.showSensitiveInfo}
                    onChange={e => setConfig(p => ({ ...p, showSensitiveInfo: e.target.checked }))}
                    className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                </label>
              </div>

              {/* Filters */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Lọc dữ liệu</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Khu phố</label>
                    <select value={config.configKp}
                      onChange={e => setConfig(p => ({ ...p, configKp: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả khu phố</option>
                      {neighborhoods.filter(n => n.status === 'ACTIVE').map(n => (
                        <option key={n.id} value={n.id}>{n.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-300 block mb-1">Đơn vị</label>
                    <select value={config.configDept}
                      onChange={e => setConfig(p => ({ ...p, configDept: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả đơn vị</option>
                      {departments.filter(d => d.status === 'ACTIVE' && d.id !== 'DEP-RECEPTION' && d.id !== 'DEP-LEADERSHIP').map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardLargeScreen;
