// ============================================================
// DIGITAL MAP — Bản đồ số + Click tra cứu thông tin quy hoạch
// Mock data mặc định | Token → API thật từ Sở QHKT TP.HCM
// ============================================================
import React, { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, useMap, useMapEvents } from 'react-leaflet';
import { Loader2, AlertCircle, MapPin, SlidersHorizontal, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// ---- Fix Leaflet icon với webpack ----
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ============================================================
// CONSTANTS
// ============================================================

const PLANNING_TILE_URL =
  'https://api-gisxaydung.tphcm.gov.vn/arcm/rest/services/HCM/SuDungDat_QHPK_HCM/MapServer/tile/{z}/{y}/{x}?blankTile=false';

const CENTER = [10.8449, 106.7907];
const DEFAULT_ZOOM = 16;

// ============================================================
// BẢNG MÀU QUY HOẠCH — Phụ lục 1 Thông tư 16/2025/TT-BXD
// ============================================================
const LAND_USE_COLORS = [
  { color: '#212121',       label: 'Ranh phường' },
  { color: 'rgb(95,127,0)', label: 'Đất an ninh' },
  { color: 'rgb(102,102,102)', label: 'Đất bãi đỗ xe' },
  { color: 'rgb(82,165,0)', label: 'Đất cây xanh sử dụng công cộng' },
  { color: 'rgb(0,127,0)',  label: 'Đất cây xanh sử dụng hạn chế' },
  { color: 'rgb(127,63,0)', label: 'Đất cơ quan, trụ sở' },
  { color: 'rgb(0,95,127)', label: 'Đất đào tạo, nghiên cứu' },
  { color: 'rgb(76,0,0)',   label: 'Đất di tích, tôn giáo' },
  { color: 'rgb(127,63,63)', label: 'Đất giáo dục - trường THCS, tiểu học, mầm non' },
  { color: 'rgb(127,31,0)', label: 'Đất giáo dục - trường THPT' },
  { color: 'rgb(101,101,101)', label: 'Đất giao thông' },
  { color: 'rgb(28,19,88)', label: 'Đất hạ tầng kỹ thuật khác' },
  { color: 'rgb(165,41,0)', label: 'Đất hỗn hợp nhóm nhà ở và dịch vụ' },
  { color: 'rgb(165,0,0)',  label: 'Đất khu dịch vụ' },
  { color: 'rgb(165,124,0)', label: 'Đất nhóm nhà ở' },
  { color: 'rgb(28,38,19)', label: 'Đất quốc phòng' },
  { color: 'rgb(82,0,165)', label: 'Đất sản xuất công nghiệp, kho bãi' },
  { color: 'rgb(0,127,0)',  label: 'Đất thể dục thể thao' },
  { color: 'rgb(165,82,103)', label: 'Đất văn hóa' },
  { color: 'rgb(255,0,191)', label: 'Đất y tế' },
  { color: 'rgb(0,63,127)', label: 'Hồ, ao, đầm' },
  { color: 'rgb(0,82,165)', label: 'Sông, suối, kênh, rạch' },
];

// ============================================================
// MOCK DATA — 15 thửa đất mẫu
// ============================================================
function makeParcel(cx, cy, size, attrs) {
  const hs = size * 0.00009;
  const hsy = size * 0.00008;
  return {
    attributes: attrs,
    geometry: {
      rings: [[
        [cx - hs, cy - hsy], [cx - hs, cy + hsy],
        [cx + hs, cy + hsy], [cx + hs, cy - hsy],
        [cx - hs, cy - hsy],
      ]],
    },
  };
}

const MOCK_PARCELS = [
  makeParcel(106.7907, 10.8450, 4, { DienTich: 476.1, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Nguyễn Văn An', SoTo: '20', SoThua: '108', TenConDuong: 'Đường Số 6', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7910, 10.8448, 3, { DienTich: 320.5, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Trần Thị Bình', SoTo: '20', SoThua: '109', TenConDuong: 'Đường Số 6', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7895, 10.8453, 5, { DienTich: 550.0, KyHieuLoaiDat: 'CONG', TenChuSoHuu: 'UBND Phường Tăng Nhơn Phú', SoTo: '21', SoThua: '50', TenConDuong: 'Lê Văn Việt', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030', ThongTinQuyHoach: 'Đất công cộng - Trụ sở UBND phường', DMMucDichSuDungDat: 'Đất công cộng' }),
  makeParcel(106.7900, 10.8442, 3, { DienTich: 280.3, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Lê Văn Cường', SoTo: '20', SoThua: '112', TenConDuong: 'Đường Số 8', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7885, 10.8440, 6, { DienTich: 610.8, KyHieuLoaiDat: 'TM-DV', TenChuSoHuu: 'Công ty TNHH ABC', SoTo: '22', SoThua: '15', TenConDuong: 'Lê Văn Việt', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030', ThongTinQuyHoach: 'Đất thương mại dịch vụ - QHPK 1/2000', DMMucDichSuDungDat: 'Đất thương mại dịch vụ' }),
  makeParcel(106.7920, 10.8465, 4, { DienTich: 380.2, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Phạm Văn Dũng', SoTo: '23', SoThua: '80', TenConDuong: 'Đường Số 11', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7915, 10.8470, 5, { DienTich: 720.0, KyHieuLoaiDat: 'GD-ĐT', TenChuSoHuu: 'Trường THCS Tăng Nhơn Phú', SoTo: '24', SoThua: '1', TenConDuong: 'Đường Số 10', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030', ThongTinQuyHoach: 'Đất giáo dục - Quy hoạch chung', DMMucDichSuDungDat: 'Đất giáo dục đào tạo' }),
  makeParcel(106.7900, 10.8430, 4, { DienTich: 290.5, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Võ Thị Hương', SoTo: '25', SoThua: '55', TenConDuong: 'Đường Số 4', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7890, 10.8428, 5, { DienTich: 850.0, KyHieuLoaiDat: 'CAY_XANH', TenChuSoHuu: 'Ban Quản lý Công viên', SoTo: '26', SoThua: '10', TenConDuong: 'Đường Số 3', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030', ThongTinQuyHoach: 'Đất cây xanh - Công viên khu phố', DMMucDichSuDungDat: 'Đất cây xanh' }),
  makeParcel(106.7925, 10.8450, 3, { DienTich: 250.0, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Đặng Minh Tuấn', SoTo: '27', SoThua: '33', TenConDuong: 'Đường Số 12', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7930, 10.8455, 4, { DienTich: 420.0, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Ngô Thị Lan', SoTo: '27', SoThua: '34', TenConDuong: 'Đường Số 13', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7880, 10.8450, 4, { DienTich: 340.0, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Bùi Quốc Hùng', SoTo: '28', SoThua: '72', TenConDuong: 'Đường Số 1', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7875, 10.8445, 6, { DienTich: 950.0, KyHieuLoaiDat: 'Y_TE', TenChuSoHuu: 'Trạm Y tế Phường', SoTo: '29', SoThua: '5', TenConDuong: 'Đường Số 2', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030', ThongTinQuyHoach: 'Đất y tế - Trạm y tế phường', DMMucDichSuDungDat: 'Đất y tế' }),
  makeParcel(106.7935, 10.8465, 5, { DienTich: 500.0, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Hoàng Văn Phúc', SoTo: '30', SoThua: '88', TenConDuong: 'Đường Số 14', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2025-2030', ThongTinQuyHoach: 'Đất ở đô thị - QHPK mới', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
  makeParcel(106.7870, 10.8430, 3, { DienTich: 180.0, KyHieuLoaiDat: 'ODT', TenChuSoHuu: 'Lý Thị Mai', SoTo: '31', SoThua: '42', TenConDuong: 'Đường Số 5', TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025', ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị' }),
];

// ============================================================
// HELPERS
// ============================================================

function queryMockData(lat, lng) {
  const results = [];
  for (const p of MOCK_PARCELS) {
    if (!p.geometry || !p.geometry.rings) continue;
    const ring = p.geometry.rings[0];
    const cx = ring.reduce((s, c) => s + c[0], 0) / ring.length;
    const cy = ring.reduce((s, c) => s + c[1], 0) / ring.length;
    const dist = Math.sqrt((lng - cx) ** 2 + (lat - cy) ** 2);
    if (dist < 0.0015) results.push({ ...p, _distance: dist });
  }
  return results.sort((a, b) => a._distance - b._distance).slice(0, 3);
}

function parseGeometry(geometry) {
  if (!geometry) return [];
  if (geometry.rings) return geometry.rings.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
  if (geometry.coordinates) return geometry.coordinates.map((ring) => ring.map(([lng, lat]) => [lat, lng]));
  return [];
}

// ============================================================
// COMPONENTS
// ============================================================

// ---- Map click → query ----
function MapClickHandler({ onQueryStart, onQueryResult, onQueryError, enabled }) {
  useMapEvents({
    click: async (e) => {
      if (!enabled) return;
      const { lat, lng } = e.latlng;
      onQueryStart({ lat, lng });
      await new Promise((r) => setTimeout(r, 200));
      const results = queryMockData(lat, lng);
      onQueryResult(results, results.length > 0 ? 'mock' : 'mock');
    },
  });
  return null;
}

function PlanningHighlight({ features }) {
  if (!features || features.length === 0) return null;
  return (
    <>
      {features.map((f, i) => {
        const rings = parseGeometry(f.geometry);
        if (rings.length === 0) return null;
        return rings.map((ring, j) => (
          <Polygon key={`${i}-${j}`} positions={ring}
            pathOptions={{ color: '#f97316', weight: 3, fillColor: '#f97316', fillOpacity: 0.3, dashArray: j === 0 ? '' : '5 5' }}>
            <Popup><PlanningFeatureInfo attributes={f.attributes} /></Popup>
          </Polygon>
        ));
      })}
    </>
  );
}

function PlanningFeatureInfo({ attributes }) {
  if (!attributes) return <p className="text-xs text-gray-400">Không có dữ liệu</p>;
  const FIELD_LABELS = {
    DienTich: 'Diện tích', KyHieuLoaiDat: 'Loại đất', TenChuSoHuu: 'Chủ sở hữu',
    SoTo: 'Số tờ', SoThua: 'Số thửa', DiaChi: 'Địa chỉ', TenConDuong: 'Đường',
    TenXaMoi: 'Phường/Xã', GiaiDoanQuyHoach: 'Giai đoạn QH', ThongTinQuyHoach: 'Thông tin QH',
    DMMucDichSuDungDat: 'Mục đích SDĐ', MaDoiTuong: 'Mã đối tượng',
    DienTichPhapLy: 'DT pháp lý', DaCapGCN: 'Đã cấp GCN', CCCD_CMND: 'CCCD/CMND',
  };
  const rows = Object.entries(attributes)
    .filter(([, v]) => v !== null && v !== undefined && v !== '' && v !== ' ')
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      let display = value;
      if (key === 'DienTich' && typeof value === 'number') display = `${value.toLocaleString()} m²`;
      if (key === 'DienTichPhapLy' && typeof value === 'number') display = `${value.toLocaleString()} m²`;
      if (key === 'DaCapGCN' && typeof value === 'number') display = value === 1 ? 'Đã cấp' : 'Chưa cấp';
      return { label, value: String(display) };
    }).slice(0, 12);
  return (
    <div className="text-xs min-w-[200px] max-w-[280px]">
      <h4 className="font-bold text-sm text-gray-900 mb-1.5">📋 Thông tin thửa đất</h4>
      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {rows.map((r) => <div key={r.label} className="flex justify-between gap-2"><span className="text-gray-500 flex-shrink-0">{r.label}</span><span className="font-medium text-gray-800 text-right break-words">{r.value}</span></div>)}
      </div>
    </div>
  );
}

// ---- Bảng chú thích màu quy hoạch (Thông tư 16/2025/TT-BXD) ----
function LandUseLegend() {
  const [open, setOpen] = useState(true);
  return (
    <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-3 w-[290px]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-xs font-semibold text-gray-700 hover:text-gray-900 transition-colors">
        <span className="flex items-center gap-1.5">
          <Layers size={14} /> Phân loại chức năng sử dụng đất
        </span>
        {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
      </button>
      {open && (
        <>
          <p className="text-[10px] text-gray-400 mt-2 mb-2 leading-tight">
            Dựa theo quy định tại Phụ lục 1 Thông tư số 16/2025/TT-BXD ngày 30/6/2025 của Bộ trưởng Bộ Xây dựng
          </p>
          <div className="space-y-0.5 max-h-[320px] overflow-y-auto">
            {LAND_USE_COLORS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 py-0.5">
                <span className="w-3.5 h-3.5 rounded-sm flex-shrink-0 border border-black/20"
                  style={{ backgroundColor: item.color }} />
                <span className="text-gray-800 leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function QueryStatus({ loading, error, resultCount }) {
  if (loading) return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow border border-gray-200 px-4 py-2 flex items-center gap-2 text-sm">
      <Loader2 size={16} className="text-blue-500 animate-spin" />
      <span className="text-gray-600">Đang tra cứu dữ liệu...</span>
    </div>
  );
  if (error) return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-red-50 rounded-lg shadow border border-red-200 px-4 py-2 flex items-center gap-2 text-sm">
      <AlertCircle size={16} className="text-red-500" /><span className="text-red-700">Lỗi: {error}</span>
    </div>
  );
  if (resultCount === 0) return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50 rounded-lg shadow border border-yellow-200 px-4 py-2 flex items-center gap-2 text-sm">
      <AlertCircle size={16} className="text-yellow-600" /><span className="text-yellow-700">Không tìm thấy dữ liệu quy hoạch tại vị trí này</span>
    </div>
  );
  return null;
}

function ClickHint() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
      <MapPin size={14} />
      <span>Click vào bản đồ để tra cứu thông tin quy hoạch thửa đất</span>
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function DigitalMap() {
  const [mapReady, setMapReady] = useState(false);

  // Query state
  const [queryState, setQueryState] = useState({
    loading: false, error: null, features: null, resultCount: -1, source: 'mock',
  });

  const handleQueryStart = useCallback(() => {
    setQueryState({ loading: true, error: null, features: null, resultCount: -1, source: 'mock' });
  }, []);

  const handleQueryResult = useCallback((features, source) => {
    setQueryState({ loading: false, error: null, features, resultCount: features.length, source });
    setTimeout(() => setQueryState((prev) => prev.features === features ? { ...prev, features: null, resultCount: -1 } : prev), 10000);
  }, []);

  const handleQueryError = useCallback((errMsg) => {
    setQueryState({ loading: false, error: errMsg, features: null, resultCount: -1, source: 'mock' });
    setTimeout(() => setQueryState((prev) => prev.error === errMsg ? { ...prev, error: null } : prev), 5000);
  }, []);

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh' }}>
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2 relative">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🗺 Bản đồ số</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Tra cứu quy hoạch · Phường Tăng Nhơn Phú, TP. Thủ Đức
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <SlidersHorizontal size={14} />
            Nguồn: Sở QHKT TP.HCM
          </div>
        </div>
      </div>

      {/* ---- Map ---- */}
      <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100" style={{ minHeight: '500px' }}>
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center z-[999] bg-gray-100">
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={36} className="text-blue-500 animate-spin" />
              <span className="text-sm text-gray-500">Đang tải bản đồ...</span>
            </div>
          </div>
        )}

        <MapContainer center={CENTER} zoom={DEFAULT_ZOOM} className="w-full h-full absolute inset-0"
          whenReady={() => setMapReady(true)} zoomControl={true} maxZoom={22} minZoom={12}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxNativeZoom={19}
          />
          <TileLayer url={PLANNING_TILE_URL} opacity={0.7} maxNativeZoom={18}
            attribution='QH: <a href="https://gisxaydung.tphcm.gov.vn">Sở QHKT</a>' />
          <PlanningHighlight features={queryState.features} />
          <MapClickHandler enabled={mapReady}
            onQueryStart={handleQueryStart} onQueryResult={handleQueryResult} onQueryError={handleQueryError} />
        </MapContainer>

        {mapReady && (
          <>
            <LandUseLegend />
            <QueryStatus loading={queryState.loading} error={queryState.error}
              resultCount={queryState.resultCount} />
            {queryState.resultCount === -1 && !queryState.loading && <ClickHint />}
          </>
        )}
      </div>

      {/* ---- Legend ---- */}
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-500 flex-wrap">
        <span className="font-medium text-gray-700">Chú thích quy hoạch:</span>
        {LAND_USE_COLORS.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm inline-block border border-black/20"
              style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
        <span className="border-l border-gray-300 pl-3 ml-1 flex items-center gap-1">
          <span className="w-3 h-3 rounded inline-block border-2 border-orange-400 bg-orange-100" /> Thửa đất đã chọn
        </span>
      </div>
    </div>
  );
}