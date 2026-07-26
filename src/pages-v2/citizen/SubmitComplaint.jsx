// ============================================================
// Gửi phản ánh, kiến nghị — SubmitComplaint (Citizen)
// ============================================================
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send, MapPin, Camera, XCircle, AlertCircle, CheckCircle,
  Upload, Image, Navigation, ChevronDown, Search, X,
} from 'lucide-react';
import { categories, neighborhoods } from '../../mock/db';
import { useMock } from '../../mock/MockContext';

const activeNeighborhoods = neighborhoods.filter(n => n.status === 'ACTIVE');

function generateCode() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const seq = String(Math.floor(Math.random() * 9000) + 1000);
  return `PA-${y}${m}${d}-${seq}`;
}

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

  // ---- contact pre-filled from currentUser if CITIZEN ----
  const isCitizen = currentUser?.role === 'CITIZEN';
  const [contactName, setContactName] = useState(isCitizen ? currentUser.fullName : '');
  const [contactPhone, setContactPhone] = useState(isCitizen ? currentUser.phone : '');
  const [contactEmail, setContactEmail] = useState(isCitizen ? currentUser.email : '');

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

    const code = generateCode();
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
      setErrors(prev => ({ ...prev, images: `Tối đa 5 ảnh (còn ${remaining} ảnh có thể thêm)` }));
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

  // ---- success screen ----
  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Gửi phản ánh thành công!</h2>
        <p className="text-sm text-gray-500 mt-2">Mã phản ánh của bạn:</p>
        <p className="text-3xl font-mono font-bold text-blue-600 mt-1 tracking-wider">{submittedCode}</p>
        <p className="text-xs text-gray-400 mt-1">Vui lòng lưu lại mã này để tra cứu</p>
        <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
          <button
            onClick={() => navigate(`/complaint/${submittedId}`)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
          >
            Xem chi tiết
          </button>
          <button
            onClick={resetForm}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // ---- form ----
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-600" />
          Gửi phản ánh, kiến nghị
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Vui lòng cung cấp đầy đủ thông tin để cơ quan chức năng tiếp nhận và xử lý.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ---- 1. Loại phản ánh (card-style select) ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Loại phản ánh <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setCategoryId(cat.id); setErrors(prev => { const { categoryId: _, ...r } = prev; return r; }); }}
                className={`p-3 rounded-lg border text-left transition text-xs leading-tight ${
                  categoryId === cat.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <div className="font-medium text-gray-900 text-xs mb-0.5">{cat.name}</div>
                <div className="text-gray-400 text-[10px] leading-tight">{cat.description}</div>
              </button>
            ))}
          </div>
          {errors.categoryId && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.categoryId}
            </p>
          )}
        </div>

        {/* ---- 2. Tiêu đề ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề phản ánh <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => { setTitle(e.target.value); if (errors.title) setErrors(prev => { const { title: _, ...r } = prev; return r; }); }}
            maxLength={150}
            placeholder="Nhập tiêu đề ngắn gọn về vấn đề của bạn"
            className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1.5">
            {errors.title ? (
              <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.title}</p>
            ) : <span />}
            <span className={`text-xs ${title.length > 140 ? 'text-orange-500' : 'text-gray-400'}`}>
              {title.length}/150
            </span>
          </div>
        </div>

        {/* ---- 3. Nội dung chi tiết ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nội dung chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={e => { setDescription(e.target.value); if (errors.description) setErrors(prev => { const { description: _, ...r } = prev; return r; }); }}
            maxLength={2000}
            rows={5}
            placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải (thời gian, địa điểm, tình trạng...)"
            className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-y ${
              errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          <div className="flex justify-between mt-1.5">
            {errors.description ? (
              <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>
            ) : <span />}
            <span className={`text-xs ${description.length > 1900 ? 'text-orange-500' : 'text-gray-400'}`}>
              {description.length}/2000
            </span>
          </div>
        </div>

        {/* ---- 4. Mức độ (radio) ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Mức độ <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            {[
              { value: 'NORMAL', label: 'Thông thường', hint: 'Thời gian xử lý dự kiến: 3-5 ngày', color: 'border-blue-200 bg-blue-50 text-blue-700' },
              { value: 'URGENT', label: 'Khẩn cấp', hint: 'Thời gian xử lý dự kiến: 24 giờ', color: 'border-red-200 bg-red-50 text-red-700' },
            ].map(opt => (
              <label
                key={opt.value}
                className={`flex-1 cursor-pointer rounded-lg border-2 p-4 transition ${
                  urgency === opt.value
                    ? `${opt.color} border-current`
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={urgency === opt.value}
                  onChange={e => setUrgency(e.target.value)}
                  className="sr-only"
                />
                <div className="font-medium text-sm">{opt.label}</div>
                <div className="text-xs mt-1 opacity-70">{opt.hint}</div>
              </label>
            ))}
          </div>
        </div>

        {/* ---- 5. Khu phố (searchable dropdown) ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Khu phố <span className="text-red-500">*</span>
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
                placeholder="Tìm kiếm khu phố..."
                className={`w-full border rounded-lg pl-9 pr-10 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  errors.neighborhoodId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 transition ${showNeighborhoodDropdown ? 'rotate-180' : ''}`} />
            </div>
            {showNeighborhoodDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredNeighborhoods.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-400">Không tìm thấy khu phố</div>
                ) : (
                  filteredNeighborhoods.map(n => (
                    <button
                      key={n.id}
                      type="button"
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setNeighborhoodId(n.id); setNeighborhoodSearch(''); setShowNeighborhoodDropdown(false); setErrors(prev => { const { neighborhoodId: _, ...r } = prev; return r; }); }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 transition ${
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
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.neighborhoodId}</p>
          )}
        </div>

        {/* ---- 6. Địa chỉ cụ thể ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Địa chỉ cụ thể
          </label>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, mốc tham chiếu..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
        </div>

        {/* ---- 7. Map (mock) ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vị trí <MapPin className="w-4 h-4 inline ml-1 text-blue-600" />
          </label>
          <div className="bg-gray-100 rounded-lg h-48 flex flex-col items-center justify-center border border-gray-200">
            {(latitude && longitude) ? (
              <div className="text-center">
                <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-sm font-mono text-gray-700">{latitude}, {longitude}</p>
                <p className="text-xs text-gray-400 mt-0.5">Vị trí đã chọn</p>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <MapPin className="w-6 h-6 mx-auto mb-1 opacity-50" />
                <p className="text-xs">Chưa có vị trí</p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={useCurrentLocation}
            className="mt-3 flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
          >
            <Navigation className="w-4 h-4" />
            Dùng vị trí hiện tại
          </button>
        </div>

        {/* ---- 8. Hình ảnh đính kèm ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh đính kèm <Camera className="w-4 h-4 inline ml-1 text-blue-600" />
          </label>
          <p className="text-xs text-gray-400 mb-3">Tối đa 5 ảnh. Hỗ trợ JPG, PNG.</p>

          {/* thumbnails */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1.5 -right-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition"
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
            className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition ${
              images.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
            <p className="text-sm text-gray-500">
              {images.length >= 5 ? 'Đã đạt tối đa 5 ảnh' : 'Kéo thả hoặc nhấn để tải ảnh lên'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG (tối đa 5 ảnh)</p>
          </div>
          {errors.images && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.images}</p>
          )}
        </div>

        {/* ---- 9. Thông tin liên hệ ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thông tin liên hệ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Họ và tên</label>
              <input
                type="text"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="0901234567"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* ---- 10. Xác nhận ---- */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => { setConfirmed(e.target.checked); if (e.target.checked) setErrors(prev => { const { confirmed: _, ...r } = prev; return r; }); }}
              className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 leading-snug">
              Tôi xác nhận thông tin phản ánh là đúng sự thật và chịu trách nhiệm về nội dung đã cung cấp.
            </span>
          </label>
          {errors.confirmed && (
            <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirmed}</p>
          )}
        </div>

        {/* ---- 11. Buttons ---- */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition order-2 sm:order-1"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Send className="w-4 h-4" />
            Gửi phản ánh
          </button>
        </div>
      </form>
    </div>
  );
}
