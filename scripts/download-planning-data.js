// ============================================================
// DOWNLOAD PLANNING DATA — Tải GeoJSON quy hoạch từ Sở QHKT
// Fallback: enhanced mock GeoJSON nếu server chặn request
// Usage: node scripts/download-planning-data.js
// ============================================================
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'public', 'data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'planning.geojson');
const GIS_HOST = 'api-gisxaydung.tphcm.gov.vn';
const MAPSERVER_PATH = '/arcm/rest/services/HCM/SuDungDat_QHPK_HCM/MapServer';

// ---- Tang Nhon Phu bounding box (EPSG:4326 → EPSG:3857) ----
function lngLatToWebMercator(lng, lat) {
  const x = (lng * 20037508.34) / 180;
  const y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  return { x, y: (y * 20037508.34) / 180 };
}

const SW = lngLatToWebMercator(106.78, 10.835);
const NE = lngLatToWebMercator(106.80, 10.855);

// ============================================================
// HTTP HELPERS
// ============================================================
function request(urlPath, cookie) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: GIS_HOST,
      path: urlPath,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://gisxaydung.tphcm.gov.vn/',
        'Accept': 'application/json, text/plain, */*',
      },
      timeout: 30000,
      rejectUnauthorized: false,
    };
    if (cookie) opts.headers['Cookie'] = cookie;

    const req = https.get(opts, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const loc = res.headers.location;
        const isFullUrl = loc.startsWith('https://');
        request(isFullUrl ? new URL(loc).pathname + new URL(loc).search : loc, cookie)
          .then(resolve).catch(reject);
        return;
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const newCookies = (res.headers['set-cookie'] || [])
          .map((c) => c.split(';')[0]).join('; ');
        resolve({ status: res.statusCode, body, cookie: newCookies || cookie });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ============================================================
// ARCGIS DOWNLOAD
// ============================================================
async function tryDownloadArcGIS() {
  console.log('🌐 Đang thử tải dữ liệu từ Sở QHKT...\n');

  // Step 1: Get session cookie
  let cookie = '';
  try {
    const r1 = await request(`${MAPSERVER_PATH}?f=json`);
    if (r1.status === 200 && r1.body && r1.body.length > 10) {
      cookie = r1.cookie;
      console.log('✓ Lấy session cookie thành công');
    } else {
      console.log('⚠ Không lấy được session cookie, thử không có cookie...');
    }
  } catch (e) {
    console.log('⚠ Lỗi kết nối:', e.message);
  }

  // Step 2: Download each layer (0, 2, 3) with spatial filter
  const layers = [0, 2, 3];
  const allFeatures = [];

  for (const layerId of layers) {
    console.log(`\n📥 Đang tải layer ${layerId}...`);
    let offset = 0;
    let layerFeatures = 0;

    while (true) {
      const geometryParam = encodeURIComponent(JSON.stringify({
        xmin: SW.x, ymin: SW.y, xmax: NE.x, ymax: NE.y,
        spatialReference: { wkid: 102100 },
      }));

      const params = [
        'f=geojson',
        'where=1=1',
        'outFields=*',
        'returnGeometry=true',
        `geometry=${geometryParam}`,
        'geometryType=esriGeometryEnvelope',
        'inSR=102100',
        'outSR=102100',
        `resultOffset=${offset}`,
        'resultRecordCount=1000',
      ];

      try {
        const url = `${MAPSERVER_PATH}/${layerId}/query?${params.join('&')}`;
        const r = await request(url, cookie);
        if (r.cookie) cookie = r.cookie;

        if (r.status !== 200 || !r.body || r.body.length < 10) {
          console.log(`  ✗ Layer ${layerId}: server trả về rỗng (bị chặn)`);
          break;
        }

        let data;
        try { data = JSON.parse(r.body); } catch { break; }

        if (data.features && data.features.length > 0) {
          const count = data.features.length;
          // Round coords for smaller file
          data.features.forEach((f) => {
            if (f.geometry && f.geometry.coordinates) {
              f.geometry.coordinates = f.geometry.coordinates.map((ring) =>
                ring.map((coord) => [
                  Math.round(coord[0] * 100) / 100,
                  Math.round(coord[1] * 100) / 100,
                ])
              );
            }
          });
          allFeatures.push(...data.features);
          layerFeatures += count;
          offset += count;
          console.log(`  ✓ Tải ${count} features (tổng layer: ${layerFeatures})`);
          if (data.features.length < 1000) break; // Last page
        } else {
          break; // No more data
        }
      } catch (e) {
        console.log(`  ✗ Lỗi layer ${layerId}:`, e.message);
        break;
      }
    }
  }

  if (allFeatures.length > 0) {
    return {
      type: 'FeatureCollection',
      features: allFeatures,
    };
  }
  return null;
}

// ============================================================
// ENHANCED MOCK GEOJSON — Dữ liệu quy hoạch mẫu Tăng Nhơn Phú
// Cấu trúc polygon thực tế hơn, trải đều toàn phường
// ============================================================
function generateMockGeoJSON() {
  console.log('\n📋 Tạo dữ liệu quy hoạch mẫu nâng cao cho Tăng Nhơn Phú...');

  // Tăng Nhơn Phú ward: ~10.835-10.855 lat, ~106.78-106.80 lng
  // Chia thành các khu vực nhỏ với loại đất khác nhau

  function makePolygon(cx, cy, w, h) {
    // Tạo polygon chữ nhật với biến dạng nhẹ cho realistic
    const jitter = () => (Math.random() - 0.5) * 0.0002;
    const hw = w / 2;
    const hh = h / 2;
    return [[
      [cx - hw + jitter(), cy - hh + jitter()],
      [cx + hw + jitter(), cy - hh + jitter()],
      [cx + hw + jitter(), cy + hh + jitter()],
      [cx - hw + jitter(), cy + hh + jitter()],
      [cx - hw + jitter(), cy - hh + jitter()],
    ]];
  }

  function feature(cx, cy, w, h, props) {
    return {
      type: 'Feature',
      properties: props,
      geometry: {
        type: 'Polygon',
        coordinates: makePolygon(cx, cy, w, h),
      },
    };
  }

  // ---- Khu vực trung tâm (dọc Lê Văn Việt) ----
  const features = [
    // Trung tâm hành chính
    feature(106.7898, 10.8453, 0.0020, 0.0018, {
      KyHieuLoaiDat: 'CONG', DienTich: 3200.5, TenChuSoHuu: 'UBND Phường Tăng Nhơn Phú',
      SoTo: '21', SoThua: '1', TenConDuong: 'Lê Văn Việt',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất công cộng - Trụ sở cơ quan', DMMucDichSuDungDat: 'Đất trụ sở cơ quan',
    }),
    // Khu dân cư dọc Lê Văn Việt
    feature(106.7905, 10.8458, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 476.1, TenChuSoHuu: 'Nguyễn Văn An',
      SoTo: '20', SoThua: '108', TenConDuong: 'Đường Số 6',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7910, 10.8448, 0.0012, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 320.5, TenChuSoHuu: 'Trần Thị Bình',
      SoTo: '20', SoThua: '109', TenConDuong: 'Đường Số 6',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7900, 10.8442, 0.0010, 0.0011, {
      KyHieuLoaiDat: 'ODT', DienTich: 280.3, TenChuSoHuu: 'Lê Văn Cường',
      SoTo: '20', SoThua: '112', TenConDuong: 'Đường Số 8',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Thương mại dịch vụ
    feature(106.7885, 10.8440, 0.0025, 0.0015, {
      KyHieuLoaiDat: 'TM-DV', DienTich: 4500.8, TenChuSoHuu: 'Công ty TNHH Thương Mại ABC',
      SoTo: '22', SoThua: '15', TenConDuong: 'Lê Văn Việt',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất thương mại dịch vụ', DMMucDichSuDungDat: 'Đất thương mại dịch vụ',
    }),
    // Chợ Tăng Nhơn Phú
    feature(106.7892, 10.8450, 0.0018, 0.0014, {
      KyHieuLoaiDat: 'TM-DV', DienTich: 2800.0, TenChuSoHuu: 'Ban Quản lý Chợ Tăng Nhơn Phú',
      SoTo: '21', SoThua: '30', TenConDuong: 'Đường Số 4',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất chợ - QHPK 1/2000', DMMucDichSuDungDat: 'Đất thương mại dịch vụ',
    }),
    // ---- Khu vực phía Bắc ----
    feature(106.7918, 10.8468, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 380.2, TenChuSoHuu: 'Phạm Văn Dũng',
      SoTo: '23', SoThua: '80', TenConDuong: 'Đường Số 11',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7922, 10.8472, 0.0012, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 250.0, TenChuSoHuu: 'Đặng Minh Tuấn',
      SoTo: '23', SoThua: '82', TenConDuong: 'Đường Số 12',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2025-2030',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK mới', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Trường học
    feature(106.7915, 10.8470, 0.0030, 0.0022, {
      KyHieuLoaiDat: 'GD-ĐT', DienTich: 8500.0, TenChuSoHuu: 'Trường THCS Tăng Nhơn Phú',
      SoTo: '24', SoThua: '1', TenConDuong: 'Đường Số 10',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất giáo dục - Quy hoạch chung', DMMucDichSuDungDat: 'Đất giáo dục đào tạo',
    }),
    feature(106.7930, 10.8480, 0.0025, 0.0020, {
      KyHieuLoaiDat: 'GD-ĐT', DienTich: 6200.0, TenChuSoHuu: 'Trường Tiểu học Tăng Nhơn Phú',
      SoTo: '24', SoThua: '5', TenConDuong: 'Đường Số 10',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất giáo dục - Quy hoạch chung', DMMucDichSuDungDat: 'Đất giáo dục đào tạo',
    }),
    // ---- Khu vực phía Nam ----
    feature(106.7900, 10.8430, 0.0013, 0.0011, {
      KyHieuLoaiDat: 'ODT', DienTich: 290.5, TenChuSoHuu: 'Võ Thị Hương',
      SoTo: '25', SoThua: '55', TenConDuong: 'Đường Số 4',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7885, 10.8425, 0.0010, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 180.0, TenChuSoHuu: 'Lý Thị Mai',
      SoTo: '25', SoThua: '58', TenConDuong: 'Đường Số 3',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Công viên cây xanh
    feature(106.7890, 10.8428, 0.0035, 0.0025, {
      KyHieuLoaiDat: 'CAY_XANH', DienTich: 12000.0, TenChuSoHuu: 'Ban Quản lý Công viên',
      SoTo: '26', SoThua: '10', TenConDuong: 'Đường Số 3',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất cây xanh - Công viên khu phố', DMMucDichSuDungDat: 'Đất cây xanh',
    }),
    // ---- Khu vực phía Đông ----
    feature(106.7925, 10.8450, 0.0012, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 250.0, TenChuSoHuu: 'Đặng Minh Tuấn',
      SoTo: '27', SoThua: '33', TenConDuong: 'Đường Số 14',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7930, 10.8455, 0.0014, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 420.0, TenChuSoHuu: 'Ngô Thị Lan',
      SoTo: '27', SoThua: '34', TenConDuong: 'Đường Số 14',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7935, 10.8465, 0.0020, 0.0015, {
      KyHieuLoaiDat: 'ODT', DienTich: 500.0, TenChuSoHuu: 'Hoàng Văn Phúc',
      SoTo: '27', SoThua: '88', TenConDuong: 'Đường Số 15',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2025-2030',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK mới', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Trạm y tế
    feature(106.7875, 10.8445, 0.0020, 0.0018, {
      KyHieuLoaiDat: 'Y_TE', DienTich: 3800.0, TenChuSoHuu: 'Trạm Y tế Phường Tăng Nhơn Phú',
      SoTo: '29', SoThua: '5', TenConDuong: 'Đường Số 2',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất y tế - Trạm y tế phường', DMMucDichSuDungDat: 'Đất y tế',
    }),
    // ---- Khu phía Tây ----
    feature(106.7882, 10.8455, 0.0010, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 200.0, TenChuSoHuu: 'Bùi Quốc Hùng',
      SoTo: '28', SoThua: '72', TenConDuong: 'Đường Số 1',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7878, 10.8460, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 350.0, TenChuSoHuu: 'Nguyễn Thị Kim',
      SoTo: '28', SoThua: '75', TenConDuong: 'Đường Số 2',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),

    // ---- Bổ sung thêm các thửa đất rải đều ----
    // Khu vực giữa
    feature(106.7908, 10.8453, 0.0010, 0.0008, {
      KyHieuLoaiDat: 'ODT', DienTich: 220.0, TenChuSoHuu: 'Trần Văn Minh',
      SoTo: '20', SoThua: '115', TenConDuong: 'Đường Số 7',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7912, 10.8445, 0.0010, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 310.0, TenChuSoHuu: 'Phan Thị Hoa',
      SoTo: '20', SoThua: '118', TenConDuong: 'Đường Số 9',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Thêm các cụm dân cư phía Bắc
    feature(106.7900, 10.8475, 0.0012, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 360.0, TenChuSoHuu: 'Đỗ Thanh Tùng',
      SoTo: '23', SoThua: '90', TenConDuong: 'Đường Số 13',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7905, 10.8480, 0.0010, 0.0008, {
      KyHieuLoaiDat: 'ODT', DienTich: 190.0, TenChuSoHuu: 'Mai Văn Sơn',
      SoTo: '23', SoThua: '92', TenConDuong: 'Đường Số 13',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2025-2030',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK mới', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Cụm phía Đông Nam
    feature(106.7932, 10.8435, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 440.0, TenChuSoHuu: 'Lâm Quốc Bảo',
      SoTo: '27', SoThua: '100', TenConDuong: 'Đường Số 14',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7928, 10.8430, 0.0010, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 200.0, TenChuSoHuu: 'Hà Thị Xuân',
      SoTo: '27', SoThua: '102', TenConDuong: 'Đường Số 16',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    // Đất công cộng xen kẽ
    feature(106.7903, 10.8460, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'CONG', DienTich: 1800.0, TenChuSoHuu: 'UBND TP. Thủ Đức',
      SoTo: '21', SoThua: '40', TenConDuong: 'Đường Số 10',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất công cộng - Nhà văn hóa', DMMucDichSuDungDat: 'Đất văn hóa',
    }),
    // Thêm cây xanh nhỏ
    feature(106.7940, 10.8460, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'CAY_XANH', DienTich: 2500.0, TenChuSoHuu: 'Ban Quản lý Công viên',
      SoTo: '27', SoThua: '120', TenConDuong: 'Đường Số 15',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất cây xanh - Vườn hoa', DMMucDichSuDungDat: 'Đất cây xanh',
    }),
    // Thêm TM-DV nhỏ
    feature(106.7895, 10.8435, 0.0012, 0.0010, {
      KyHieuLoaiDat: 'TM-DV', DienTich: 1500.0, TenChuSoHuu: 'HTX Dịch vụ Tăng Nhơn Phú',
      SoTo: '26', SoThua: '22', TenConDuong: 'Đường Số 5',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2030',
      ThongTinQuyHoach: 'Đất thương mại dịch vụ', DMMucDichSuDungDat: 'Đất thương mại dịch vụ',
    }),
    // Khu Tây Bắc
    feature(106.7870, 10.8470, 0.0015, 0.0012, {
      KyHieuLoaiDat: 'ODT', DienTich: 400.0, TenChuSoHuu: 'Vũ Đức Thắng',
      SoTo: '28', SoThua: '85', TenConDuong: 'Đường Số 1',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2025-2030',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK mới', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
    feature(106.7868, 10.8465, 0.0010, 0.0010, {
      KyHieuLoaiDat: 'ODT', DienTich: 210.0, TenChuSoHuu: 'Trịnh Thị Ngọc',
      SoTo: '28', SoThua: '87', TenConDuong: 'Đường Số 1',
      TenXaMoi: 'Phường Tăng Nhơn Phú', GiaiDoanQuyHoach: '2021-2025',
      ThongTinQuyHoach: 'Đất ở đô thị - QHPK 1/2000', DMMucDichSuDungDat: 'Đất ở tại đô thị',
    }),
  ];

  return {
    type: 'FeatureCollection',
    features,
  };
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let data = null;
  let source = '';

  // Try ArcGIS download
  try {
    data = await tryDownloadArcGIS();
    if (data) {
      source = 'real';
    }
  } catch (e) {
    console.log('✗ Lỗi tải ArcGIS:', e.message);
  }

  // Fallback to mock
  if (!data) {
    data = generateMockGeoJSON();
    source = 'mock';
  }

  // Write output
  const json = JSON.stringify(data);
  fs.writeFileSync(OUTPUT_FILE, json, 'utf8');
  const sizeKB = (Buffer.byteLength(json) / 1024).toFixed(1);

  console.log(`\n✅ ${source === 'real' ? 'Dữ liệu thật từ Sở QHKT' : 'Dữ liệu mẫu nâng cao'} → ${OUTPUT_FILE}`);
  console.log(`   ${data.features.length} features, ${sizeKB} KB`);
}

main().catch((e) => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
