import requests
import json
import time

# --- CẤU HÌNH KHU VỰC (Tăng Nhơn Phú) ---
XMIN = 106.80
YMIN = 10.84
XMAX = 106.82
YMAX = 10.86

# --- CẤU HÌNH GỌI API ---
BASE_URL = "https://api-gisxaydung.tphcm.gov.vn/arcgis/rest/services/HCM/ThuaDat/FeatureServer/0/query"
PAGE_SIZE = 200  # Mỗi lần lấy 200 thửa
offset = 0
all_features = []

# 1. Tạo chuỗi geometry (hình chữ nhật) theo yêu cầu của ArcGIS
geometry = {
    "xmin": XMIN,
    "ymin": YMIN,
    "xmax": XMAX,
    "ymax": YMAX,
    "spatialReference": {"wkid": 4326}
}
geometry_str = json.dumps(geometry)

# 2. Tạo Header giả mạo (Quan trọng nhất để không bị chặn)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://gisxaydung.tphcm.gov.vn/",
    "Origin": "https://gisxaydung.tphcm.gov.vn",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive"
}

print(f"🚀 Bắt đầu tải dữ liệu Phường Tăng Nhơn Phú bằng Python (có giả mạo Header)...")

while True:
    # Tạo URL gọi API
    params = {
        "f": "json",
        "where": "1=1",
        "geometry": geometry_str,
        "geometryType": "esriGeometryEnvelope",
        "spatialRel": "esriSpatialRelIntersects",
        "inSR": 4326,
        "outSR": 4326,
        "outFields": "*",
        "resultRecordCount": PAGE_SIZE,
        "resultOffset": offset
    }

    try:
        print(f"👉 Đang tải gói dữ liệu từ vị trí {offset}...")
        
        # QUAN TRỌNG: Gửi kèm headers
        response = requests.get(BASE_URL, params=params, headers=headers, timeout=30)
        
        if response.status_code != 200:
            print(f"❌ Lỗi Server: {response.status_code} - {response.text}")
            break
        
        data = response.json()
        features = data.get("features", [])

        if not features:
            print("✅ Đã tải xong toàn bộ dữ liệu!")
            break

        all_features.extend(features)
        print(f"   -> Đã lấy thêm {len(features)} thửa. Tổng hiện tại: {len(all_features)}")

        if len(features) < PAGE_SIZE:
            print("✅ Đã tải xong toàn bộ dữ liệu!")
            break
            
        offset += PAGE_SIZE
        
        # Nghỉ 0.5 giây để tránh bị chặn IP
        time.sleep(0.5)

    except Exception as e:
        print(f"❌ Có lỗi xảy ra khi gọi API: {e}")
        break

# --- LƯU FILE ---
if all_features:
    print(f"💾 Đang lưu {len(all_features)} thửa đất vào file JSON...")
    final_data = {"features": all_features}
    with open("tang_nhon_phu_data.json", "w", encoding="utf-8") as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    print("✅ Thành công! File 'tang_nhon_phu_data.json' đã được lưu.")
else:
    print("❌ Không lấy được dữ liệu nào. Kiểm tra lại tọa độ hoặc API.")