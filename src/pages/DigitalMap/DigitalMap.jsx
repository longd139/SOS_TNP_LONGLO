// ============================================================
// DIGITAL MAP — Bản đồ số + Click tra cứu thông tin quy hoạch
// Mock data mặc định | Token → API thật từ Sở QHKT TP.HCM
// Có lớp địa điểm công cộng + chế độ cập nhật cho cán bộ
// ============================================================
import React, { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polygon, Popup, useMap, useMapEvents } from 'react-leaflet';
import {
  Layers, SlidersHorizontal, X, Loader2, AlertCircle, MapPin, Key, Database,
  Plus, Edit2, Trash2, GraduationCap, HeartPulse, Landmark, Trees, Building2, Shield, UserCheck,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useMock } from '../../mock/MockContext';

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

const FEATURE_SERVER_PATH = '/arcgis/rest/services/HCM/ThuaDat/FeatureServer/0/query';

const CENTER = [10.8449, 106.7907];
const DEFAULT_ZOOM = 16;

const STATUS_COLORS = {
  PENDING: '#f59e0b', IN_PROGRESS: '#3b82f6', EXTENSION_PENDING: '#8b5cf6',
  COMPLETED: '#22c55e', REJECTED: '#ef4444',
};

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý', IN_PROGRESS: 'Đang xử lý', EXTENSION_PENDING: 'Chờ gia hạn',
  COMPLETED: 'Hoàn thành', REJECTED: 'Từ chối',
};

// ============================================================
// ĐỊA ĐIỂM CÔNG CỘNG — category config + mock data
// ============================================================
const PLACE_CATEGORIES = {
  SCHOOL:       { label: 'Trường học',      icon: GraduationCap, color: '#2563eb', bg: '#dbeafe' },
  HEALTH:       { label: 'Y tế',            icon: HeartPulse,    color: '#dc2626', bg: '#fee2e2' },
  HERITAGE:     { label: 'Di tích',         icon: Landmark,      color: '#9333ea', bg: '#f3e8ff' },
  PARK:         { label: 'Cây xanh / CV',   icon: Trees,         color: '#16a34a', bg: '#dcfce7' },
  GOV:          { label: 'Cơ quan hành chính', icon: Building2,  color: '#64748b', bg: '#f1f5f9' },
  OTHER:        { label: 'Khác',            icon: MapPin,        color: '#78716c', bg: '#fafaf9' },
};

// Mock data: 12 địa điểm công cộng tiêu biểu tại Tăng Nhơn Phú
const INITIAL_PUBLIC_PLACES = [
  {
    id: 'pp-1', category: 'SCHOOL', name: 'Trường THCS Tăng Nhơn Phú',
    address: 'Đường Số 10, KP.4', ward: 'Tăng Nhơn Phú',
    managedBy: 'Phòng GD&ĐT TP. Thủ Đức',
    description: 'Trường trung học cơ sở chính của phường, đạt chuẩn quốc gia.',
    lat: 10.8470, lng: 106.7915,
  },
  {
    id: 'pp-2', category: 'SCHOOL', name: 'Trường Tiểu học Tăng Nhơn Phú',
    address: 'Đường Số 10, KP.4', ward: 'Tăng Nhơn Phú',
    managedBy: 'Phòng GD&ĐT TP. Thủ Đức',
    description: 'Trường tiểu học phục vụ học sinh KP.3, KP.4.',
    lat: 10.8480, lng: 106.7930,
  },
  {
    id: 'pp-3', category: 'SCHOOL', name: 'Trường Mầm non Tăng Nhơn Phú',
    address: 'Đường Số 6, KP.2', ward: 'Tăng Nhơn Phú',
    managedBy: 'Phòng GD&ĐT TP. Thủ Đức',
    description: 'Trường mầm non công lập.',
    lat: 10.8455, lng: 106.7895,
  },
  {
    id: 'pp-4', category: 'HEALTH', name: 'Trạm Y tế Phường Tăng Nhơn Phú',
    address: 'Đường Số 2, KP.5', ward: 'Tăng Nhơn Phú',
    managedBy: 'Trung tâm Y tế TP. Thủ Đức',
    description: 'Trạm y tế phường, khám chữa bệnh ban đầu, tiêm chủng mở rộng.',
    lat: 10.8445, lng: 106.7875,
  },
  {
    id: 'pp-5', category: 'HERITAGE', name: 'Đình Tăng Nhơn Phú',
    address: 'Đường Lê Văn Việt, KP.3', ward: 'Tăng Nhơn Phú',
    managedBy: 'Ban Quý tế Đình Tăng Nhơn Phú',
    description: 'Di tích lịch sử văn hóa cấp thành phố, nơi sinh hoạt tín ngưỡng của người dân.',
    lat: 10.8462, lng: 106.7890,
  },
  {
    id: 'pp-6', category: 'HERITAGE', name: 'Chùa Pháp Quang',
    address: 'Đường Số 11, KP.4', ward: 'Tăng Nhơn Phú',
    managedBy: 'Giáo hội Phật giáo TP. Thủ Đức',
    description: 'Chùa cổ trong khu vực, nơi tu tập và sinh hoạt Phật giáo.',
    lat: 10.8475, lng: 106.7910,
  },
  {
    id: 'pp-7', category: 'PARK', name: 'Công viên Tăng Nhơn Phú',
    address: 'Đường Số 3, KP.5', ward: 'Tăng Nhơn Phú',
    managedBy: 'UBND Phường Tăng Nhơn Phú',
    description: 'Công viên cây xanh, khu vui chơi và tập thể dục cho người dân.',
    lat: 10.8428, lng: 106.7890,
  },
  {
    id: 'pp-8', category: 'PARK', name: 'Sân thể thao KP.4',
    address: 'Đường Số 11, KP.4', ward: 'Tăng Nhơn Phú',
    managedBy: 'UBND Phường Tăng Nhơn Phú',
    description: 'Sân bóng đá mini và khu tập luyện thể thao cộng đồng.',
    lat: 10.8465, lng: 106.7930,
  },
  {
    id: 'pp-9', category: 'GOV', name: 'UBND Phường Tăng Nhơn Phú',
    address: 'Đường Lê Văn Việt, KP.3', ward: 'Tăng Nhơn Phú',
    managedBy: 'UBND TP. Thủ Đức',
    description: 'Trụ sở Ủy ban Nhân dân phường, nơi tiếp nhận và giải quyết thủ tục hành chính.',
    lat: 10.8453, lng: 106.7895,
  },
  {
    id: 'pp-10', category: 'GOV', name: 'Công an Phường Tăng Nhơn Phú',
    address: 'Đường Lê Văn Việt, KP.3', ward: 'Tăng Nhơn Phú',
    managedBy: 'Công an TP. Thủ Đức',
    description: 'Trụ sở Công an phường, đảm bảo an ninh trật tự địa bàn.',
    lat: 10.8450, lng: 106.7896,
  },
  {
    id: 'pp-11', category: 'GOV', name: 'Bưu điện Tăng Nhơn Phú',
    address: 'Đường Lê Văn Việt, KP.3', ward: 'Tăng Nhơn Phú',
    managedBy: 'Bưu điện TP. Hồ Chí Minh',
    description: 'Điểm giao dịch bưu chính viễn thông.',
    lat: 10.8458, lng: 106.7902,
  },
  {
    id: 'pp-12', category: 'OTHER', name: 'Chợ Tăng Nhơn Phú',
    address: 'Đường Số 4, KP.2', ward: 'Tăng Nhơn Phú',
    managedBy: 'Ban Quản lý Chợ Tăng Nhơn Phú',
    description: 'Chợ truyền thống phục vụ nhu yếu phẩm cho người dân trong phường.',
    lat: 10.8448, lng: 106.7892,
  },
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
const API_PROXY = process.env.NODE_ENV === 'development' ? '/api-gis' : 'https://api-gisxaydung.tphcm.gov.vn';


async function queryFeatureServer(lat, lng, token) {
  const params = new URLSearchParams({
    f: 'json',
    geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
    geometryType: 'esriGeometryPoint', spatialRel: 'esriSpatialRelIntersects',
    inSR: '4326', outSR: '4326', outFields: '*', returnGeometry: 'true', resultRecordCount: '5',
  });
  const url = `${API_PROXY}${FEATURE_SERVER_PATH}?${params}`;
  const res = await fetch(url, { headers: { 'x-gis-auth': `Bearer ${token}` } });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!raw || raw.trim() === '') throw new Error('API trả về rỗng');
  try { return JSON.parse(raw); } catch (e) { throw new Error(`Không parse được JSON`); }
}

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
// ICONS
// ============================================================
const getComplaintIcon = (status) =>
  L.divIcon({
    className: 'complaint-marker',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${
      STATUS_COLORS[status] || '#6b7280'
    };border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14], iconAnchor: [7, 7],
  });

const getPlaceIcon = (category) => {
  const cat = PLACE_CATEGORIES[category] || PLACE_CATEGORIES.OTHER;
  return L.divIcon({
    className: 'place-marker',
    html: `<div style="
      width:32px;height:32px;border-radius:8px;background:${cat.bg};
      border:2px solid ${cat.color};display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.25);font-size:16px;
    "><span style="color:${cat.color}">${getCategoryEmoji(category)}</span></div>`,
    iconSize: [32, 32], iconAnchor: [16, 16],
  });
};

function getCategoryEmoji(cat) {
  const map = { SCHOOL: '🏫', HEALTH: '🏥', HERITAGE: '🏛', PARK: '🌳', GOV: '🏛', OTHER: '📍' };
  return map[cat] || '📍';
}

// ============================================================
// COMPONENTS
// ============================================================

// ---- Map click → query ----
function MapClickHandler({ onQueryStart, onQueryResult, onQueryError, enabled, token }) {
  useMapEvents({
    click: async (e) => {
      if (!enabled) return;
      const { lat, lng } = e.latlng;
      onQueryStart({ lat, lng });
      if (token) {
        try {
          const data = await queryFeatureServer(lat, lng, token);
          onQueryResult(data.features && data.features.length > 0 ? data.features : [], 'real');
        } catch (err) { onQueryError(err.message); }
      } else {
        await new Promise((r) => setTimeout(r, 200));
        const results = queryMockData(lat, lng);
        onQueryResult(results, results.length > 0 ? 'mock' : 'mock');
      }
    },
  });
  return null;
}

// ---- Officer mode: click bản đồ để chọn vị trí thêm mới ----
function OfficerMapClick({ enabled, onPlaceClick }) {
  useMapEvents({
    click: (e) => {
      if (!enabled) return;
      const { lat, lng } = e.latlng;
      onPlaceClick(lat, lng);
    },
  });
  return null;
}

function FitBounds({ complaints }) {
  const map = useMap();
  React.useEffect(() => {
    if (!complaints || complaints.length === 0) return;
    const coords = complaints.filter((c) => c.latitude && c.longitude).map((c) => [c.latitude, c.longitude]);
    if (coords.length > 0) map.fitBounds(L.latLngBounds(coords), { padding: [50, 50], maxZoom: 17 });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

function ComplaintMarkers({ complaints, onSelect }) {
  const map = useMap();
  return (
    <>
      {complaints.filter((c) => c.latitude && c.longitude).map((c) => (
        <Marker key={c.id} position={[c.latitude, c.longitude]} icon={getComplaintIcon(c.status)}
          eventHandlers={{ click: () => { map.flyTo([c.latitude, c.longitude], 18, { duration: 0.8 }); onSelect(c); } }} />
      ))}
    </>
  );
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

// ---- Marker địa điểm công cộng ----
function PublicPlaceMarkers({ places, isOfficer, onEdit, onDelete }) {
  const map = useMap();
  if (!places || places.length === 0) return null;
  return (
    <>
      {places.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={getPlaceIcon(p.category)}
          eventHandlers={{
            click: () => {
              if (isOfficer) {
                map.flyTo([p.lat, p.lng], 18, { duration: 0.6 });
              }
            },
          }}>
          <Popup maxWidth={300} minWidth={240}>
            <PublicPlacePopup place={p} isOfficer={isOfficer} onEdit={onEdit} onDelete={onDelete} />
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// ---- Popup nội dung địa điểm ----
function PublicPlacePopup({ place, isOfficer, onEdit, onDelete }) {
  const cat = PLACE_CATEGORIES[place.category] || PLACE_CATEGORIES.OTHER;
  const CatIcon = cat.icon;
  return (
    <div className="text-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: cat.bg }}>
          <CatIcon size={18} style={{ color: cat.color }} />
        </span>
        <div>
          <h4 className="font-semibold text-sm text-gray-900">{place.name}</h4>
          <span className="text-gray-500">{cat.label}</span>
        </div>
      </div>
      <div className="space-y-1.5 text-gray-600 mb-2">
        <div><span className="font-medium">Địa chỉ:</span> {place.address}</div>
        <div><span className="font-medium">Đơn vị quản lý:</span> {place.managedBy}</div>
        {place.description && <div className="text-gray-500 italic mt-1">{place.description}</div>}
      </div>
      {isOfficer && (
        <div className="flex gap-2 pt-2 border-t border-gray-100 mt-2">
          <button onClick={() => onEdit(place)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <Edit2 size={12} /> Sửa
          </button>
          <button onClick={() => { if (window.confirm(`Xóa "${place.name}"?`)) onDelete(place.id); }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
            <Trash2 size={12} /> Xóa
          </button>
        </div>
      )}
    </div>
  );
}

// ---- Form thêm/sửa địa điểm (modal) ----
function PlaceFormModal({ place, position, onSave, onCancel }) {
  const isEdit = !!place;
  const [form, setForm] = useState({
    name: place?.name || '',
    category: place?.category || 'SCHOOL',
    address: place?.address || '',
    managedBy: place?.managedBy || '',
    description: place?.description || '',
    lat: place?.lat || position?.lat || CENTER[0],
    lng: place?.lng || position?.lng || CENTER[1],
  });

  const handleChange = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const handleSave = () => {
    if (!form.name.trim()) return;
    onSave({
      ...(place || {}),
      ...form,
      id: place?.id || `pp-${Date.now()}`,
    });
  };

  return (
    <div className="absolute inset-0 z-[1200] bg-black/40 flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 p-5"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            {isEdit ? '✏️ Chỉnh sửa địa điểm' : '📍 Thêm địa điểm mới'}
          </h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tên địa điểm *</label>
            <input value={form.name} onChange={handleChange('name')} placeholder="VD: Trường Tiểu học ABC"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Loại địa điểm</label>
            <select value={form.category} onChange={handleChange('category')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
              {Object.entries(PLACE_CATEGORIES).map(([key, cat]) => (
                <option key={key} value={key}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Địa chỉ</label>
            <input value={form.address} onChange={handleChange('address')} placeholder="VD: Đường Số 6, KP.2"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Đơn vị quản lý</label>
            <input value={form.managedBy} onChange={handleChange('managedBy')} placeholder="VD: UBND Phường Tăng Nhơn Phú"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mô tả</label>
            <textarea value={form.description} onChange={handleChange('description')} rows={2} placeholder="Mô tả ngắn về địa điểm..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Vĩ độ (lat)</label>
              <input type="number" step="0.0001" value={form.lat} onChange={handleChange('lat')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Kinh độ (lng)</label>
              <input type="number" step="0.0001" value={form.lng} onChange={handleChange('lng')}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 font-mono" />
            </div>
          </div>
          {!isEdit && position && (
            <p className="text-xs text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
              🎯 Tọa độ được lấy từ vị trí bạn vừa click trên bản đồ
            </p>
          )}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
            Hủy
          </button>
          <button onClick={handleSave}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Layer toggle ----
function LayerPanel({ layers, onToggle }) {
  return (
    <div className="absolute top-3 right-3 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 p-3 min-w-[200px]">
      <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
        <Layers size={16} /> Lớp bản đồ
      </div>
      {layers.map((l) => (
        <label key={l.key}
          className="flex items-center gap-2 py-1.5 cursor-pointer text-sm text-gray-600 hover:text-gray-900">
          <input type="checkbox" checked={l.visible} onChange={() => onToggle(l.key)} className="rounded accent-blue-600" />
          <span className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
            style={{ backgroundColor: l.visible ? l.color : '#d1d5db' }} />
          <span style={{ color: l.visible ? '#374151' : '#9ca3af' }}>{l.label}</span>
        </label>
      ))}
    </div>
  );
}

function InfoCard({ complaint, onClose }) {
  if (!complaint) return null;
  return (
    <div className="absolute bottom-4 left-3 z-[1000] bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-500">{complaint.code}</span>
          <h4 className="font-semibold text-gray-900 mt-0.5 line-clamp-2">{complaint.title}</h4>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full text-white"
              style={{ backgroundColor: STATUS_COLORS[complaint.status] || '#6b7280' }}>
              {STATUS_LABELS[complaint.status] || complaint.status}
            </span>
            <span className="text-xs text-gray-500">{complaint.neighborhoodName || ''}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{complaint.address || 'Không có địa chỉ'}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg flex-shrink-0"><X size={16} className="text-gray-400" /></button>
      </div>
    </div>
  );
}

function StatsBar({ complaints, places }) {
  const byNeighborhood = {};
  complaints.forEach((c) => { const n = c.neighborhoodName || 'Khác'; byNeighborhood[n] = (byNeighborhood[n] || 0) + 1; });
  return (
    <div className="absolute bottom-3 right-3 z-[1000] bg-white/90 backdrop-blur rounded-lg shadow border border-gray-200 px-3 py-2 text-xs text-gray-600">
      <div className="font-semibold text-gray-800 mb-1">📊 {complaints.length} phản ánh · {places?.length || 0} địa điểm</div>
      {Object.entries(byNeighborhood).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([name, count]) => (
        <div key={name} className="flex justify-between gap-4">
          <span className="truncate max-w-[100px]">{name}</span>
          <span className="font-medium text-gray-800">{count}</span>
        </div>
      ))}
    </div>
  );
}

function DataSourceBadge({ source }) {
  if (source === 'real') {
    return (
      <div className="absolute top-3 left-3 z-[1000] bg-green-50 rounded-lg shadow border border-green-300 px-3 py-1.5 flex items-center gap-2 text-xs">
        <Database size={14} className="text-green-600" />
        <span className="font-semibold text-green-700">Dữ liệu thật</span>
        <span className="text-green-600">từ Sở QHKT</span>
      </div>
    );
  }
  if (source === 'identify') {
    return (
      <div className="absolute top-3 left-3 z-[1000] bg-blue-50 rounded-lg shadow border border-blue-300 px-3 py-1.5 flex items-center gap-2 text-xs">
        <Database size={14} className="text-blue-600" />
        <span className="font-semibold text-blue-700">MapServer Identify</span>
        <span className="text-blue-600">từ Sở QHKT</span>
      </div>
    );
  }
  return (
    <div className="absolute top-3 left-3 z-[1000] bg-yellow-50 rounded-lg shadow border border-yellow-300 px-3 py-1.5 flex items-center gap-2 text-xs">
      <Database size={14} className="text-yellow-600" />
      <span className="font-semibold text-yellow-700">Dữ liệu mẫu</span>
      <span className="text-yellow-600">click để xem thửa đất demo</span>
    </div>
  );
}

function TokenInput({ token, onTokenSet, onTokenClear }) {
  const [show, setShow] = useState(false);
  const [inputVal, setInputVal] = useState(token || '');
  const handleSave = () => {
    const trimmed = inputVal.trim();
    if (trimmed) onTokenSet(trimmed); else onTokenClear();
    setShow(false);
  };
  return (
    <div className="flex items-center gap-2">
      {token ? (
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-300 rounded-lg px-2.5 py-1 text-xs">
          <Key size={12} className="text-green-600" />
          <span className="text-green-700 font-medium">Token sẵn sàng</span>
          <button onClick={onTokenClear} className="text-green-500 hover:text-red-500 ml-1"><X size={12} /></button>
        </div>
      ) : (
        <button onClick={() => setShow(!show)}
          className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-300 rounded-lg px-2.5 py-1 text-xs hover:bg-yellow-100 transition-colors">
          <Key size={12} className="text-yellow-600" /><span className="text-yellow-700">Nhập token</span>
        </button>
      )}
      {show && (
        <div className="absolute top-12 right-0 z-[1100] bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-96">
          <p className="text-xs text-gray-600 mb-2">
            Dán Bearer token từ DevTools (F12 → Network → chọn request bất kỳ → copy <code className="bg-gray-100 px-1 rounded">Authorization</code> header)
          </p>
          <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            placeholder="eyJhbGciOiJI..." className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg mb-2 font-mono" />
          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Áp dụng</button>
            <button onClick={() => setShow(false)} className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Hủy</button>
          </div>
        </div>
      )}
    </div>
  );
}

function QueryStatus({ loading, error, resultCount, source }) {
  if (loading) return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white rounded-lg shadow border border-gray-200 px-4 py-2 flex items-center gap-2 text-sm">
      <Loader2 size={16} className="text-blue-500 animate-spin" />
      <span className="text-gray-600">{source === 'real' ? 'Đang tra cứu dữ liệu thật từ Sở QHKT...' : 'Đang tra cứu dữ liệu mẫu...'}</span>
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

function ClickHint({ token, isOfficer }) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900/80 backdrop-blur text-white text-xs px-4 py-2 rounded-full flex items-center gap-2">
      <MapPin size={14} />
      {isOfficer ? (
        <span>Click vào bản đồ để chọn vị trí thêm địa điểm mới</span>
      ) : (
        <span>Click vào bản đồ để tra cứu thông tin quy hoạch thửa đất{!token ? ' (dữ liệu mẫu)' : ' (dữ liệu thật)'}</span>
      )}
    </div>
  );
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function DigitalMap() {
  const { complaints, neighborhoods } = useMock();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [layers, setLayers] = useState([
    { key: 'planning', label: 'Quy hoạch SDĐ', visible: true, color: '#f97316' },
    { key: 'complaints', label: 'Điểm phản ánh', visible: true, color: '#3b82f6' },
    { key: 'publicPlaces', label: 'Địa điểm công cộng', visible: true, color: '#22c55e' },
  ]);
  const [mapReady, setMapReady] = useState(false);
  const [token, setToken] = useState(null);

  // ---- Officer mode ----
  const [isOfficer, setIsOfficer] = useState(false);
  const [publicPlaces, setPublicPlaces] = useState(INITIAL_PUBLIC_PLACES);
  const [placeForm, setPlaceForm] = useState({ show: false, place: null, position: null }); // {show, place?, position?}

  // Query state
  const [queryState, setQueryState] = useState({
    loading: false, error: null, features: null, resultCount: -1, source: 'mock',
  });

  const enrichedComplaints = useMemo(
    () => complaints.map((c) => {
      const nb = neighborhoods.find((n) => n.id === c.neighborhoodId);
      if (!c.latitude && nb) {
        const jitter = () => (Math.random() - 0.5) * 0.008;
        return { ...c, latitude: nb.centerLatitude + jitter(), longitude: nb.centerLongitude + jitter(), neighborhoodName: nb.name };
      }
      return { ...c, neighborhoodName: nb?.name || '' };
    }),
    [complaints, neighborhoods]
  );

  const toggleLayer = (key) => setLayers((prev) => prev.map((l) => (l.key === key ? { ...l, visible: !l.visible } : l)));

  const handleQueryStart = useCallback(() => {
    setQueryState({ loading: true, error: null, features: null, resultCount: -1, source: token ? 'real' : 'mock' });
    setSelectedComplaint(null);
  }, [token]);

  const handleQueryResult = useCallback((features, source) => {
    setQueryState({ loading: false, error: null, features, resultCount: features.length, source });
    setTimeout(() => setQueryState((prev) => prev.features === features ? { ...prev, features: null, resultCount: -1 } : prev), 10000);
  }, []);

  const handleQueryError = useCallback((errMsg) => {
    setQueryState({ loading: false, error: errMsg, features: null, resultCount: -1, source: 'real' });
    setTimeout(() => setQueryState((prev) => prev.error === errMsg ? { ...prev, error: null } : prev), 5000);
  }, []);

  // ---- Officer handlers ----
  const handleOfficerMapClick = useCallback((lat, lng) => {
    setPlaceForm({ show: true, place: null, position: { lat, lng } });
  }, []);

  const handleEditPlace = useCallback((place) => {
    setPlaceForm({ show: true, place, position: null });
  }, []);

  const handleSavePlace = useCallback((placeData) => {
    setPublicPlaces((prev) => {
      const idx = prev.findIndex((p) => p.id === placeData.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = placeData;
        return updated;
      }
      return [...prev, placeData];
    });
    setPlaceForm({ show: false, place: null, position: null });
  }, []);

  const handleDeletePlace = useCallback((id) => {
    setPublicPlaces((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const planningVisible = layers.find((l) => l.key === 'planning')?.visible;
  const complaintsVisible = layers.find((l) => l.key === 'complaints')?.visible;
  const publicPlacesVisible = layers.find((l) => l.key === 'publicPlaces')?.visible;

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
          {/* ---- Officer mode toggle ---- */}
          <button
            onClick={() => setIsOfficer((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isOfficer
                ? 'bg-blue-600 text-white shadow'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isOfficer ? <UserCheck size={14} /> : <Shield size={14} />}
            {isOfficer ? 'Đang: Cán bộ' : 'Chế độ: Người dân'}
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <SlidersHorizontal size={14} />
            Nguồn: Sở QHKT TP.HCM
          </div>
          <TokenInput token={token} onTokenSet={setToken} onTokenClear={() => setToken(null)} />
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
          {planningVisible && (
            <TileLayer url={PLANNING_TILE_URL} opacity={0.7} maxNativeZoom={18}
              attribution='QH: <a href="https://gisxaydung.tphcm.gov.vn">Sở QHKT</a>' />
          )}
          {complaintsVisible && (
            <ComplaintMarkers complaints={enrichedComplaints} onSelect={setSelectedComplaint} />
          )}
          {publicPlacesVisible && (
            <PublicPlaceMarkers places={publicPlaces} isOfficer={isOfficer}
              onEdit={handleEditPlace} onDelete={handleDeletePlace} />
          )}
          <PlanningHighlight features={queryState.features} />
          <MapClickHandler enabled={mapReady && !isOfficer} token={token}
            onQueryStart={handleQueryStart} onQueryResult={handleQueryResult} onQueryError={handleQueryError} />
          <OfficerMapClick enabled={mapReady && isOfficer} onPlaceClick={handleOfficerMapClick} />
          <FitBounds complaints={enrichedComplaints} />
        </MapContainer>

        {mapReady && (
          <>
            <DataSourceBadge source={queryState.resultCount > 0 ? queryState.source : (token ? 'real' : 'mock')} />
            <LayerPanel layers={layers} onToggle={toggleLayer} />
            <StatsBar complaints={enrichedComplaints} places={publicPlaces} />
            <InfoCard complaint={selectedComplaint} onClose={() => setSelectedComplaint(null)} />
            <QueryStatus loading={queryState.loading} error={queryState.error}
              resultCount={queryState.resultCount} source={queryState.source} />
            {queryState.resultCount === -1 && !queryState.loading && !isOfficer && <ClickHint token={token} isOfficer={false} />}
            {isOfficer && <ClickHint token={token} isOfficer={true} />}

            {/* Nút thêm địa điểm (chế độ cán bộ) */}
            {isOfficer && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1001]">
                <button
                  onClick={() => setPlaceForm({ show: true, place: null, position: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} /> Thêm địa điểm
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ---- Form modal ---- */}
      {placeForm.show && (
        <PlaceFormModal
          place={placeForm.place}
          position={placeForm.position}
          onSave={handleSavePlace}
          onCancel={() => setPlaceForm({ show: false, place: null, position: null })}
        />
      )}

      {/* ---- Legend ---- */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 flex-wrap">
        <span className="font-medium text-gray-700">Chú thích:</span>
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
            {STATUS_LABELS[key] || key}
          </span>
        ))}
        <span className="flex items-center gap-1 ml-2">
          <span className="w-3 h-3 rounded inline-block border-2 border-orange-400 bg-orange-100" /> Thửa đất đã chọn
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded inline-block border-2 border-orange-400 bg-orange-50 opacity-50" /> Vùng quy hoạch
        </span>
        {/* Chú thích địa điểm công cộng */}
        {['SCHOOL', 'HEALTH', 'HERITAGE', 'PARK', 'GOV'].map((cat) => {
          const cfg = PLACE_CATEGORIES[cat];
          return (
            <span key={cat} className="flex items-center gap-1 ml-1">
              <span className="text-xs">{getCategoryEmoji(cat)}</span> {cfg.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
