import { createAsyncThunk } from '@reduxjs/toolkit';
import { COMMITTEE_API } from '../../apis/committee';
import { validateContact, validateUpdateContact } from '../../validator/contactValidator';

const transformContactData = (data) => {
    if (!data) return null;
    
    return {
        id: data.id,
        tenDonVi: data.ten_don_vi || '',
        diaChi: data.dia_chi_tru_so || '',
        soDienThoai: data.so_dien_thoai || '',
        email: data.email || '',
        gioLamViec: {
            buoi_sang: {
                tu: data.gio_lam_viec?.buoiSang?.tu || data.gio_lam_viec?.buoi_sang?.tu || '07:30',
                den: data.gio_lam_viec?.buoiSang?.den || data.gio_lam_viec?.buoi_sang?.den || '11:30',
            },
            buoi_chieu: {
                tu: data.gio_lam_viec?.buoiChieu?.tu || data.gio_lam_viec?.buoi_chieu?.tu || '13:00',
                den: data.gio_lam_viec?.buoiChieu?.den || data.gio_lam_viec?.buoi_chieu?.den || '17:00',
            },
            ghi_chu: data.gio_lam_viec?.ghiChu || data.gio_lam_viec?.ghi_chu || '',
        },
        linkGoogleMap: data.link_google_map || '',
    };
};

const transformContactDataForRequest = (data) => {
    return {
        tenDonVi: data.tenDonVi,
        diaChi: data.diaChi,
        soDienThoai: data.soDienThoai,
        email: data.email,
        gioLamViec: {
            buoiSang: {
                tu: data.gioLamViec.buoi_sang.tu,
                den: data.gioLamViec.buoi_sang.den,
            },
            buoiChieu: {
                tu: data.gioLamViec.buoi_chieu.tu,
                den: data.gioLamViec.buoi_chieu.den,
            },
            ghiChu: data.gioLamViec.ghi_chu?.trim() || null,
        },
        linkGoogleMap: data.linkGoogleMap,
    };
};

export const fetchContact = createAsyncThunk(
    'contact/fetchContact',
    async (_, { rejectWithValue }) => {
        try {
            const response = await COMMITTEE_API.getCommittees();
            
            let data = response;
            
            if (Array.isArray(response)) {
                data = response[0] || null;
            }
            
            const transformedData = transformContactData(data);
            
            return transformedData;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Không thể tải thông tin ủy ban');
        }
    }
);

export const createContact = createAsyncThunk(
    'contact/createContact',
    async (contactData, { rejectWithValue }) => {
        try {
            const validation = await validateContact(contactData);
            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0];
                return rejectWithValue(firstError || 'Dữ liệu không hợp lệ');
            }

            const requestData = transformContactDataForRequest(contactData);
            const result = await COMMITTEE_API.createCommittee(requestData);
            const transformedResult = transformContactData(result);
            
            return transformedResult;
        } catch (error) {
            return rejectWithValue(error.message || 'Không thể tạo thông tin ủy ban');
        }
    }
);

export const updateContact = createAsyncThunk(
    'contact/updateContact',
    async ({ committeeId, contactData }, { rejectWithValue }) => {
        try {
            const validation = await validateUpdateContact(contactData);
            
            if (!validation.isValid) {
                const firstError = Object.values(validation.errors)[0];
                return rejectWithValue(firstError || 'Dữ liệu không hợp lệ');
            }

            const { id, ...dataWithoutId } = contactData;
            const requestData = transformContactDataForRequest(dataWithoutId);
            
            const result = await COMMITTEE_API.updateCommittee(committeeId, requestData);
            const transformedResult = transformContactData(result);
            
            return transformedResult;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Không thể cập nhật thông tin ủy ban');
        }
    }
);