// ============================================================
// DASHBOARD LARGE SCREEN — TV / operations room display
// ============================================================
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Maximize, Minimize, Clock, RefreshCw } from 'lucide-react';
import { useMock } from '../../mock/MockContext';
import { getTimeRemaining, getNeighborhoodById } from '../../mock/db';
import { StatusBadge, SlaBadge } from '../../mock/components/Badges';

// ---- Donut chart (CSS conic-gradient) ----
function StatusDonut({ inProgress, overdue, completed, others }) {
  const total = inProgress + overdue + completed + others || 1;
  const segments = [
    { value: inProgress, color: '#f97316', label: 'Đang xử lý' },
    { value: overdue, color: '#ef4444', label: 'Quá hạn' },
    { value: completed, color: '#22c55e', label: 'Hoàn thành' },
    { value: others, color: '#64748b', label: 'Khác' },
  ];
  // Build conic-gradient string
  let angle = 0;
  const slices = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const pct = (s.value / total) * 360;
      const from = angle;
      angle += pct;
      return `${s.color} ${from}deg ${angle}deg`;
    })
    .join(', ');
  const gradient = slices || '#334155 0deg 360deg';

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-48 h-48 rounded-full relative"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-4 rounded-full bg-slate-900 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-white">{total}</span>
          <span className="text-xs text-slate-400">Tổng cộng</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: s.color }} />
            <span className="text-slate-300">{s.label}</span>
            <span className="text-white font-semibold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- 7-day trend bars ----
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

  // ---- Digital clock (every 1s) ----
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ---- Auto-refresh (every 30s) ----
  useEffect(() => {
    const t = setInterval(() => setLastUpdate(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  // ---- Fullscreen toggle ----
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // ---- Escape key exits fullscreen ----
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && document.fullscreenElement) {
        setIsFullscreen(false);
      }
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

  // ---- Overdue complaints (top 10, sorted by deadline) ----
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

  // ---- Top 5 neighborhoods ----
  const topNeighborhoods = useMemo(() => {
    return neighborhoodStats
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [neighborhoodStats]);

  // ---- 7-day trend ----
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

  // ---- Scrolling list (auto-advance every 5s) ----
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
    <div className="min-h-screen bg-slate-900 text-white overflow-hidden">
      {/* ---- Top bar ---- */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-wide text-white">
            BẢNG ĐIỀU KHIỂN — PHÒNG TRỰC BAN
          </h1>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm text-slate-400">{dateStr}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock size={16} />
            <span className="text-2xl font-mono font-bold text-white tabular-nums">{timeStr}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-xs text-slate-400">
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
        </div>
      </div>

      {/* ---- Main content: 3 columns ---- */}
      <div className="grid grid-cols-[30%_40%_30%] gap-4 p-4" style={{ height: 'calc(100vh - 57px)' }}>
        {/* ----- LEFT: KPI cards ----- */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* KPI 1: Tổng hôm nay */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <p className="text-xl text-slate-400 mb-2">Tổng hôm nay</p>
            <p className="text-4xl font-bold text-cyan-400">{stats.todayCount}</p>
            <p className="text-sm text-slate-400 mt-2">Tổng cộng: {stats.total}</p>
          </div>

          {/* KPI 2: Đang xử lý */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <p className="text-xl text-slate-400 mb-2">Đang xử lý</p>
            <p className="text-4xl font-bold text-orange-400">{stats.inProgressCount}</p>
            <p className="text-sm text-slate-400 mt-2">
              {stats.extensionPendingCount > 0 ? `${stats.extensionPendingCount} chờ duyệt gia hạn` : 'Không có gia hạn nào'}
            </p>
          </div>

          {/* KPI 3: Quá hạn */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <p className="text-xl text-slate-400 mb-2">Quá hạn</p>
            <p className="text-4xl font-bold text-red-400">{stats.overdueCount}</p>
            <p className="text-sm text-slate-400 mt-2">
              {stats.nearDueCount > 0 ? `${stats.nearDueCount} sắp đến hạn` : 'Không có sắp đến hạn'}
            </p>
          </div>

          {/* KPI 4: Tỷ lệ đúng hạn */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <p className="text-xl text-slate-400 mb-2">Tỷ lệ đúng hạn</p>
            <p className="text-4xl font-bold text-green-400">{stats.onTimeRate}%</p>
            <p className="text-sm text-slate-400 mt-2">
              {stats.completedOnTimeCount}/{stats.completedCount} hoàn thành đúng hạn
            </p>
          </div>
        </div>

        {/* ----- CENTER: Charts ----- */}
        <div className="flex flex-col gap-4 overflow-auto">
          {/* Donut chart */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <h2 className="text-base font-semibold text-slate-300 mb-4">Phân bố trạng thái</h2>
            <StatusDonut
              inProgress={stats.inProgressCount}
              overdue={stats.overdueCount}
              completed={stats.completedCount}
              others={stats.total - stats.inProgressCount - stats.overdueCount - stats.completedCount}
            />
          </div>

          {/* 7-day trend */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 flex-1">
            <h2 className="text-base font-semibold text-slate-300 mb-4">Xu hướng 7 ngày</h2>
            <TrendBars days={trend7d} />
          </div>
        </div>

        {/* ----- RIGHT: Lists ----- */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Overdue scrolling list */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col flex-1 overflow-hidden">
            <h2 className="text-base font-semibold text-red-400 mb-3">
              Phản ánh trễ hạn ({overdueList.length})
            </h2>
            {overdueList.length === 0 ? (
              <p className="text-sm text-slate-500">Không có phản ánh trễ hạn.</p>
            ) : (
              <div className="flex-1 overflow-hidden relative">
                <div
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(-${scrollIndex * 76}px)` }}
                >
                  {overdueList.map((c) => {
                    const nb = getNeighborhoodById(c.neighborhoodId);
                    const remaining = getTimeRemaining(c.currentDeadline || c.originalDeadline);
                    return (
                      <div
                        key={c.id}
                        className="flex items-start gap-3 py-2.5 border-b border-slate-700/50 min-h-[76px]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-200 truncate">{c.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <StatusBadge status={c.status} />
                            <SlaBadge slaStatus={c.slaStatus} />
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="text-red-400 font-medium">{remaining || '—'}</span>
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
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
            <h2 className="text-base font-semibold text-cyan-400 mb-3">Khu phố nổi bật</h2>
            {topNeighborhoods.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
            ) : (
              <div className="space-y-2">
                {topNeighborhoods.map((nb, idx) => (
                  <div key={nb.neighborhoodId} className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-500 w-5">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-200">{nb.neighborhoodName}</span>
                        <span className="text-xs font-bold text-cyan-400">{nb.total}</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-400"
                          style={{ width: `${Math.min((nb.total / Math.max(...topNeighborhoods.map(x => x.total), 1)) * 100, 100)}%` }}
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
    </div>
  );
}

export default DashboardLargeScreen;
