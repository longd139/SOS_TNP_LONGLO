// ============================================================
// Gửi phản ánh, kien nghi -- SubmitComplaint (Citizen)
// PAGE C-01
// ============================================================
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, MapPin, Camera, XCircle, AlertCircle, CheckCircle,
  Upload, Image, Navigation, ChevronDown, Search,
} from 'lucide-react';
import { categories, neighborhoods } from '../../mock/db';
import { useMock } from '../../mock/MockContext';
import { showToast } from '../../utils/toastNotification';

const activeNeighborhoods = neighborhoods.filter(n => n.status === 'ACTIVE');

const inputClass =
  'w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const inputErrorClass =
  'w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
const requiredClass = 'text-red-500';
const errorClass = 'text-red-500 text-xs mt-1 flex items-center gap-1';
const counterClass = 'text-xs text-gray-400';

export default function SubmitComplaint() {
  const { currentUser, addComplaint, complaints } = useMock();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ---- form state ----
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState('NORMAL');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [images, setImages] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [neighborhoodSearch, setNeighborhoodSearch] = useState('');
  const [showNeighborhoodDropdown, setShowNeighborhoodDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  const [submittedTime, setSubmittedTime] = useState('');

  // ---- contact pre-filled from currentUser if CITIZEN ----
  const isCitizen = currentUser?.role === 'CITIZEN';
  const [contactName, setContactName] = useState(isCitizen ? currentUser.fullName : '');
  const [contactPhone, setContactPhone] = useState(isCitizen ? currentUser.phone : '');
  const [contactEmail, setContactEmail] = useState('');

  // ---- filtered neighborhoods ----
  const filteredNeighborhoods = neighborhoodSearch
    ? activeNeighborhoods.filter(n => n.name.toLowerCase().includes(neighborhoodSearch.toLowerCase()))
    : activeNeighborhoods;

  // ---- reset ----
  function resetForm() {
    setCategoryId('');
    setTitle('');
    setDescription('');
    setUrgency('NORMAL');
    setNeighborhoodId('');
    setAddress('');
    setLatitude('');
    setLongitude('');
    setImages([]);
    setConfirmed(false);
    setNeighborhoodSearch('');
    setErrors({});
    setSubmitted(false);
    setSubmittedId('');
    setSubmittedCode('');
    setSubmittedTime('');
  }

  // ---- validate ----
  function validate() {
    const e = {};
    if (!categoryId) e.categoryId = 'Vui lòng chọn loại phản ánh';
    if (!title.trim()) e.title = 'Vui lòng nhập tiêu đề phản ánh';
    else if (title.trim().length > 150) e.title = 'Tiêu đề không được vượt quá 150 ký tự';
    if (!description.trim()) e.description = 'Vui lòng nhập nội dung chi tiết';
    else if (description.trim().length < 20) e.description = 'Nội dung phải có ít nhất 20 ký tự';
    else if (description.trim().length > 2000) e.description = 'Nội dung không được vượt quá 2000 ký tự';
    if (!neighborhoodId) e.neighborhoodId = 'Vui lòng chọn khu phố';
    if (!confirmed) e.confirmed = 'Vui lòng xác nhận thông tin phản ánh là đúng sự thật';
    if (images.length > 5) e.images = 'Tối đa 5 ảnh';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ---- submit ----
  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const seq = String(complaints.length + 1).padStart(4, '0');
    const code = `PA-${seq}`;
    const cat = categories.find(c => c.id === categoryId);
    const now = new Date().toISOString();
    const id = `CMP-${String(complaints.length + 1).padStart(4, '0')}`;
    const kp = neighborhoods.find(n => n.id === neighborhoodId);

    const newComplaint = {
      id,
      code,
      citizenId: currentUser?.id || 'USR-001',
      title: title.trim(),
      description: description.trim(),
      categoryId,
      citizenUrgency: urgency,
      confirmedUrgency: null,
      neighborhoodId,
      address: address.trim() || undefined,
      latitude: latitude ? parseFloat(latitude) : kp?.centerLatitude,
      longitude: longitude ? parseFloat(longitude) : kp?.centerLongitude,
      status: 'NEW',
      slaType: urgency === 'URGENT' ? 'URGENT_24_HOURS' : `NORMAL_${cat?.defaultSlaHours || 120}_HOURS`,
      slaHours: urgency === 'URGENT' ? 24 : (cat?.defaultSlaHours || 120),
      receivedAt: null,
      originalDeadline: null,
      currentDeadline: null,
      completedAt: null,
      slaStatus: 'NOT_APPLICABLE',
      assignedDepartmentId: null,
      assignedOfficerId: null,
      extensionCount: 0,
      progressPercent: 0,
      createdAt: now,
      updatedAt: now,
      hasImages: images.length > 0,
      hasLocation: !!(latitude && longitude),
    };

    addComplaint(newComplaint);
    setSubmittedId(id);
    setSubmittedCode(code);
    setSubmittedTime(new Date().toLocaleString('vi-VN'));
    setSubmitted(true);
  }

  // ---- mock location ----
  function useCurrentLocation() {
    const lat = 10.845 + (Math.random() - 0.5) * 0.02;
    const lng = 106.789 + (Math.random() - 0.5) * 0.02;
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
  }

  // ---- file handling ----
  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    const remaining = 5 - images.length;
    if (files.length > remaining) {
      setErrors(prev => ({ ...prev, images: `Tối đa 5 ảnh (con ${remaining} anh co the them)` }));
      e.target.value = '';
      return;
    }
    const newImages = files.map(f => ({ name: f.name, size: f.size }));
    setImages(prev => [...prev, ...newImages]);
    setErrors(prev => { const { images: _, ...rest } = prev; return rest; });
    e.target.value = '';
  }

  function removeImage(idx) {
    setImages(prev => prev.filter((_, i) => i !== idx));
  }

  // ---- clear field error ----
  function clearField(field) {
    setErrors(prev => { const { [field]: _, ...r } = prev; return r; });
  }

  // ---- success modal ----
  if (submitted) {
    return (
      <>
        {/* overlay */}
        <div className="fixed inset-0 bg-black/40 z-40" onClick={resetForm} />
        {/* modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Gửi phản ánh thành công!</h2>
            <p className="text-sm text-gray-500 mt-2">Mã phản ánh của bạn:</p>
            <p className="text-3xl font-mono font-bold text-blue-600 mt-1 tracking-wider">{submittedCode}</p>
            <p className="text-xs text-gray-400 mt-1">Vui lòng lưu lại mã này để tra cứu</p>
            <p className="text-xs text-gray-500 mt-2">Thời gian tiếp nhận: {submittedTime}</p>
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
              <button
                type="button"
                onClick={() => navigate(`/complaint/${submittedId}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Xem chi tiết
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ---- form ----
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page Title + Back button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gửi phản ánh, kiến nghị</h1>
          <p className="text-gray-600 mt-1">
            Vui lòng cung cấp đầy đủ thông tin để cơ quan chức năng tiếp nhận và xử lý.
          </p>
        </div>
        <a href="/admin/complaints" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Quay lại
        </a>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        {/* ---- 1. Loại phản ánh ---- */}
        <div>
          <label className={labelClass}>
            Loại phản ánh <span className={requiredClass}>*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setCategoryId(cat.id); clearField('categoryId'); }}
                className={`rounded-lg border p-3 text-left transition text-xs ${
                  categoryId === cat.id
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900 text-xs mb-0.5">{cat.name}</div>
                <div className="text-gray-400 text-[10px] leading-tight">{cat.description}</div>
              </button>
            ))}
          </div>
          {errors.categoryId && (
            <p className={errorClass}>
              <AlertCircle className="w-3 h-3" />{errors.categoryId}
            </p>
          )}
        </div>

        {/* ---- 2. Tieu de ---- */}
        <div>
          <label className={labelClass}>
            Tiêu đề phản ánh <span className={requiredClass}>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); clearField('title'); }}
            maxLength={150}
            placeholder="Nhap tieu de ngan gon ve van de cua ban"
            className={errors.title ? inputErrorClass : inputClass}
          />
          <div className="flex justify-between mt-1">
            {errors.title ? (
              <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.title}</p>
            ) : <span />}
            <span className={`${counterClass} ${title.length > 140 ? 'text-orange-500' : ''}`}>
              {title.length}/150
            </span>
          </div>
        </div>

        {/* ---- 3. Nội dung chi tiết ---- */}
        <div>
          <label className={labelClass}>
            Nội dung chi tiết <span className={requiredClass}>*</span>
          </label>
          <textarea
            value={description}
            onChange={e => { setDescription(e.target.value); clearField('description'); }}
            maxLength={2000}
            rows={5}
            placeholder="Mo ta chi tiet van de ban dang gap phai (thoi gian, dia diem, tinh trang...)"
            className={`${errors.description ? inputErrorClass : inputClass} resize-y`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.description}</p>
            ) : <span />}
            <span className={`${counterClass} ${description.length > 1900 ? 'text-orange-500' : ''}`}>
              {description.length}/2000
            </span>
          </div>
          {urgency === 'URGENT' && description.trim().length >= 20 && description.trim().length < 50 && (
            <p className="text-yellow-600 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Bạn chọn mức khẩn cấp nhưng nội dung khá ngắn. Vui lòng mô tả chi tiết hơn để cơ quan chức năng xử lý nhanh chóng.
            </p>
          )}
        </div>

        {/* ---- 4. Muc do ---- */}
        <div>
          <label className={labelClass}>
            Muc do <span className={requiredClass}>*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <label
              title="Thoi gian xu ly du kien: 3-5 ngay"
              className={`flex-1 cursor-pointer rounded-lg border-2 p-3 ${
                urgency === 'NORMAL'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value="NORMAL"
                checked={urgency === 'NORMAL'}
                onChange={e => setUrgency(e.target.value)}
                className="sr-only"
              />
              <div className="font-medium text-sm text-gray-900">Thông thường</div>
              <div className="text-xs mt-0.5 text-gray-500">Thoi gian xu ly du kien: 3-5 ngay</div>
            </label>
            <label
              title="Can xu ly trong vong 24 gio"
              className={`flex-1 cursor-pointer rounded-lg border-2 p-3 ${
                urgency === 'URGENT'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value="URGENT"
                checked={urgency === 'URGENT'}
                onChange={e => setUrgency(e.target.value)}
                className="sr-only"
              />
              <div className="font-medium text-sm text-gray-900">Khẩn cấp</div>
              <div className="text-xs mt-0.5 text-gray-500">Thoi gian xu ly du kien: 24 gio</div>
            </label>
          </div>
        </div>

        {/* ---- 5. Khu phố ---- */}
        <div>
          <label className={labelClass}>
            Khu phố <span className={requiredClass}>*</span>
          </label>
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={neighborhoodId ? activeNeighborhoods.find(n => n.id === neighborhoodId)?.name : neighborhoodSearch}
                onChange={e => { setNeighborhoodSearch(e.target.value); setNeighborhoodId(''); setShowNeighborhoodDropdown(true); }}
                onFocus={() => setShowNeighborhoodDropdown(true)}
                onBlur={() => setTimeout(() => setShowNeighborhoodDropdown(false), 200)}
                placeholder="Tim kiem khu pho..."
                className={`${errors.neighborhoodId ? inputErrorClass : inputClass} pl-9 pr-10`}
              />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition-transform ${showNeighborhoodDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showNeighborhoodDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredNeighborhoods.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">Khong tim thay khu pho</div>
                ) : (
                  filteredNeighborhoods.map(n => (
                    <button
                      key={n.id}
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setNeighborhoodId(n.id); setNeighborhoodSearch(''); setShowNeighborhoodDropdown(false); clearField('neighborhoodId'); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                        neighborhoodId === n.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {n.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {errors.neighborhoodId && (
            <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.neighborhoodId}</p>
          )}
        </div>

        {/* ---- 6. Địa chỉ cụ thể ---- */}
        <div>
          <label className={labelClass}>Địa chỉ cụ thể</label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="So nha, ten duong, moc tham chieu..."
            className={inputClass}
          />
        </div>

        {/* ---- 7. Vi tri (mock map) ---- */}
        <div>
          <label className={labelClass}>
            Vi tri <MapPin className="w-4 h-4 inline ml-1 text-blue-600" />
          </label>
          <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center border border-gray-200">
            {(latitude && longitude) ? (
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-mono text-gray-700">{latitude}, {longitude}</p>
                <p className="text-xs text-gray-400 mt-0.5">Vi tri da chon</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <MapPin className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Chua co vi tri</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={useCurrentLocation}
            className="mt-2 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Navigation className="w-4 h-4" />
            Dùng vị trí hiện tại
          </button>
        </div>

        {/* ---- 8. Hinh anh dinh kem ---- */}
        <div>
          <label className={labelClass}>
            Hinh anh dinh kem <Camera className="w-4 h-4 inline ml-1 text-blue-600" />
          </label>
          <p className="text-xs text-gray-400 mb-2">Tối đa 5 ảnh. Ho tro JPG, PNG.</p>

          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-sm hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 text-red-500" />
                  </button>
                  <p className="absolute bottom-0 left-0 right-0 text-[9px] text-gray-500 truncate px-1 bg-white/80 rounded-b-lg">
                    {img.name.length > 12 ? img.name.slice(0, 10) + '..' : img.name}
                  </p>
                </div>
              ))}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            onClick={() => images.length < 5 && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition ${
              images.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm text-gray-500">
              {images.length >= 5 ? 'Da dat toi da 5 anh' : 'Keo tha hoac nhan de tai anh len'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG (toi da 5 anh)</p>
          </div>
          {errors.images && (
            <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.images}</p>
          )}
        </div>

        {/* ---- 9. Thông tin liên hệ ---- */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin liên hệ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Ho va ten</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Nguyen Van A"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="0901234567"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="example@email.com"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* ---- 10. Xac nhan ---- */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => { setConfirmed(e.target.checked); if (e.target.checked) clearField('confirmed'); }}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 leading-snug">
              Toi xac nhan thong tin phan anh la dung su that va chiu trach nhiem ve noi dung da cung cap.
            </span>
          </label>
          {errors.confirmed && (
            <p className={errorClass}><AlertCircle className="w-3 h-3" />{errors.confirmed}</p>
          )}
        </div>

        {/* ---- 11. Buttons ---- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={resetForm}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium order-3 sm:order-1"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={() => showToast.info('Đã lưu bản nháp. Tính năng lưu nháp sẽ được bổ sung đầy đủ ở giai đoạn sau.')}
            className="border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 text-sm font-medium order-2"
          >
            Lưu nháp
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2 order-1 sm:order-3 sm:w-auto w-full"
          >
            <Send className="w-4 h-4" />
            Gửi phản ánh
          </button>
        </div>
      </form>
    </div>
  );
}
