import { createSelector } from '@reduxjs/toolkit';


export const selectContactState = (state) => state.contact;
export const selectContact = (state) => state.contact.contact;
export const selectLoading = (state) => state.contact.loading;
export const selectError = (state) => state.contact.error;
export const selectUpdateSuccess = (state) => state.contact.updateSuccess;

export const selectWorkingHours = createSelector(
    [selectContact],
    (contact) => {
        if (!contact?.gioLamViec) return null;

        const { buoi_sang, buoi_chieu, ghi_chu } = contact.gioLamViec;

        return {
            morning: {
                start: buoi_sang?.tu || '',
                end: buoi_sang?.den || '',
                formatted: buoi_sang?.tu && buoi_sang?.den 
                    ? `${buoi_sang.tu} - ${buoi_sang.den}`
                    : ''
            },
            afternoon: {
                start: buoi_chieu?.tu || '',
                end: buoi_chieu?.den || '',
                formatted: buoi_chieu?.tu && buoi_chieu?.den
                    ? `${buoi_chieu.tu} - ${buoi_chieu.den}`
                    : ''
            },
            note: ghi_chu || '',
            fullSchedule: [
                buoi_sang?.tu && buoi_sang?.den ? `Sáng: ${buoi_sang.tu} - ${buoi_sang.den}` : '',
                buoi_chieu?.tu && buoi_chieu?.den ? `Chiều: ${buoi_chieu.tu} - ${buoi_chieu.den}` : ''
            ].filter(Boolean).join(' | ')
        };
    }
);

export const selectGoogleMapInfo = createSelector(
    [selectContact],
    (contact) => {
        if (!contact?.linkGoogleMap) return null;

        const match = contact.linkGoogleMap.match(/q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
        
        return {
            link: contact.linkGoogleMap,
            latitude: match ? match[1] : null,
            longitude: match ? match[2] : null,
            isValid: !!match
        };
    }
);

export const selectFormattedContact = createSelector(
    [selectContact, selectWorkingHours, selectGoogleMapInfo],
    (contact, workingHours, mapInfo) => {
        if (!contact) return null;

        return {
            id: contact.id,
            tenDonVi: contact.tenDonVi || '',
            diaChi: contact.diaChi || '',
            soDienThoai: contact.soDienThoai || '',
            email: contact.email || '',
            workingHours: workingHours,
            mapInfo: mapInfo,
            phoneFormatted: contact.soDienThoai || 'Chưa cập nhật',
            emailFormatted: contact.email || 'Chưa cập nhật',
            addressFormatted: contact.diaChi || 'Chưa cập nhật',
            workingHoursText: workingHours?.fullSchedule || 'Chưa cập nhật'
        };
    }
);

export const selectContactValidation = createSelector(
    [selectContact],
    (contact) => {
        const errors = [];

        if (!contact) {
            return { 
                isValid: false, 
                errors: ['Chưa có thông tin ủy ban'],
                missingFields: 9
            };
        }

        if (!contact.tenDonVi) errors.push('Thiếu tên đơn vị');
        if (!contact.diaChi) errors.push('Thiếu địa chỉ');
        if (!contact.soDienThoai) errors.push('Thiếu số điện thoại');
        if (!contact.email) errors.push('Thiếu email');
        if (!contact.gioLamViec?.buoi_sang?.tu) errors.push('Thiếu giờ bắt đầu buổi sáng');
        if (!contact.gioLamViec?.buoi_sang?.den) errors.push('Thiếu giờ kết thúc buổi sáng');
        if (!contact.gioLamViec?.buoi_chieu?.tu) errors.push('Thiếu giờ bắt đầu buổi chiều');
        if (!contact.gioLamViec?.buoi_chieu?.den) errors.push('Thiếu giờ kết thúc buổi chiều');
        if (!contact.linkGoogleMap) errors.push('Thiếu link Google Map');

        return {
            isValid: errors.length === 0,
            errors,
            missingFields: errors.length
        };
    }
);

export const selectContactStats = createSelector(
    [selectContact],
    (contact) => {
        if (!contact) {
            return {
                totalFields: 9,
                completedFields: 0,
                missingFields: 9,
                percentage: 0,
                isComplete: false
            };
        }

        const totalFields = 9;
        let completedFields = 0;

        if (contact.tenDonVi) completedFields++;
        if (contact.diaChi) completedFields++;
        if (contact.soDienThoai) completedFields++;
        if (contact.email) completedFields++;
        if (contact.gioLamViec?.buoi_sang?.tu) completedFields++;
        if (contact.gioLamViec?.buoi_sang?.den) completedFields++;
        if (contact.gioLamViec?.buoi_chieu?.tu) completedFields++;
        if (contact.gioLamViec?.buoi_chieu?.den) completedFields++;
        if (contact.linkGoogleMap) completedFields++;

        const percentage = Math.round((completedFields / totalFields) * 100);

        return {
            totalFields,
            completedFields,
            missingFields: totalFields - completedFields,
            percentage,
            isComplete: completedFields === totalFields
        };
    }
);