import { createAsyncThunk } from '@reduxjs/toolkit';
import { USER_API } from '../../apis/user';


const toCamel = (s) => s.replace(/_([a-z0-9])/g, (_, p1) => p1.toUpperCase());
function keysToCamel(obj) {
  if (Array.isArray(obj)) return obj.map(keysToCamel);
  if (obj && obj.constructor === Object) {
    return Object.keys(obj).reduce((acc, k) => {
      acc[toCamel(k)] = keysToCamel(obj[k]);
      return acc;
    }, {});
  }
  return obj;
}
function toBoolean(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v === 1;
  if (typeof v === 'string') {
    const lower = v.trim().toLowerCase();
    return lower === 'true' || lower === '1';
  }
  return false;
}

function normalizeUserProfile(payload) {
  if (!payload) return null;
  let data = payload;
  if (payload && Object.prototype.hasOwnProperty.call(payload, 'success') && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    data = payload.data;
  }
  const camel = keysToCamel(data || {});
  return {
    ...camel,
    id: camel.id ?? null,
    tenDangNhap: camel.tenDangNhap ?? '',
    hoVaTen: camel.hoVaTen ?? '',
    email: camel.email ?? '',
    soDienThoai: camel.soDienThoai ?? '',
    vaiTro: camel.vaiTro ?? '',
    xacThucHaiYeuTo:
      typeof camel.xacThucHaiYeuTo === 'boolean' ? camel.xacThucHaiYeuTo : toBoolean(camel.xacThucHaiYeuTo),
    isActive:
      typeof camel.isActive === 'boolean' ? camel.isActive : toBoolean(camel.isActive),
    thoiGianTao: camel.thoiGianTao ?? null,
    thoiGianCapNhat: camel.thoiGianCapNhat ?? null,
  };
}

export const fetchMyProfile = createAsyncThunk(
  'userProfile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const data = await USER_API.getMyProfile();
      const normalized = normalizeUserProfile(data);
      return normalized;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Lấy thông tin cá nhân thất bại');
    }
  }
);

export const updateProfileData = createAsyncThunk(
  'userProfile/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await USER_API.updateUserProfile(userData);
      const normalized = normalizeUserProfile(data);
      return normalized;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại');
    }
  }
);