import * as yup from "yup";
import { validateSchema } from "../utils/validationUtils";

const mauDonSchema = yup.object().shape({
    id: yup
        .string()
        .nullable(),
    so_luong_ban_chinh: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản chính là bắt buộc', function (value) {
            const { id, so_luong_ban_sao, ghi_chu } = this.parent;
            // Chỉ validate nếu có ID (đã chọn mẫu đơn) hoặc có dữ liệu khác
            const hasAnyData = id || (so_luong_ban_sao !== null && so_luong_ban_sao !== undefined && so_luong_ban_sao !== '') || ghi_chu;
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản chính phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    so_luong_ban_sao: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản sao là bắt buộc', function (value) {
            const { id, so_luong_ban_chinh, ghi_chu } = this.parent;
            const hasAnyData = id || (so_luong_ban_chinh !== null && so_luong_ban_chinh !== undefined && so_luong_ban_chinh !== '') || ghi_chu;
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản sao phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    ghi_chu: yup
        .string()
        .nullable()
});

const cachThucHienSchema = yup.object().shape({
    hinh_thuc_ap_dung: yup
        .string()
        .nullable()
        .test('required-if-any', 'Hình thức áp dụng là bắt buộc', function (value) {
            const { mo_ta_chi_tiet, thoi_gian_giai_quyet, le_phi, ghi_chu_le_phi } = this.parent;
            // Chỉ validate nếu có bất kỳ field nào được fill
            const hasAnyData = (mo_ta_chi_tiet && mo_ta_chi_tiet.trim()) || 
                              (thoi_gian_giai_quyet && thoi_gian_giai_quyet.trim()) || 
                              (le_phi && le_phi.toString().trim()) || 
                              (ghi_chu_le_phi && ghi_chu_le_phi.trim());
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Hình thức áp dụng không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta_chi_tiet: yup
        .string()
        .nullable(),
    thoi_gian_giai_quyet: yup
        .string()
        .nullable(),
    le_phi: yup
        .mixed()
        .nullable()
        .test('is-valid-number', 'Lệ phí phải là số hợp lệ', function (value) {
            if (!value && value !== 0) return true;
            const cleanedValue = String(value).replace(/,/g, '.').replace(/\s/g, '');
            const numValue = parseFloat(cleanedValue);
            return !isNaN(numValue) && numValue >= 0;
        })
        .test('max-length', 'Lệ phí không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return String(value).length <= 230;
        }),
    ghi_chu_le_phi: yup
        .string()
        .nullable()
});

const trinhTuThucHienSchema = yup.object().shape({
    ten_buoc: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên bước là bắt buộc', function (value) {
            const { mo_ta_buoc, thu_tu_buoc } = this.parent;
            // Chỉ validate nếu có data được fill
            const hasAnyData = (mo_ta_buoc && mo_ta_buoc.trim()) || 
                              (thu_tu_buoc !== null && thu_tu_buoc !== undefined);
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        }),
    mo_ta_buoc: yup
        .string()
        .nullable(),
    thu_tu_buoc: yup
        .number()
        .nullable()
});

const thanhPhanHoSoSchema = yup.object().shape({
    ten_thanh_phan: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên thành phần là bắt buộc', function (value) {
            const { mo_ta_chi_tiet, so_luong_ban_chinh, so_luong_ban_sao, ghi_chu } = this.parent;
            // Chỉ validate nếu có data được fill
            const hasAnyData = (mo_ta_chi_tiet && mo_ta_chi_tiet.trim()) || 
                              (so_luong_ban_chinh !== null && so_luong_ban_chinh !== undefined && so_luong_ban_chinh !== '') || 
                              (so_luong_ban_sao !== null && so_luong_ban_sao !== undefined && so_luong_ban_sao !== '') || 
                              (ghi_chu && ghi_chu.trim());
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Tên thành phần không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta_chi_tiet: yup
        .string()
        .nullable(),
    so_luong_ban_chinh: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản chính là bắt buộc', function (value) {
            const { ten_thanh_phan, mo_ta_chi_tiet, so_luong_ban_sao, ghi_chu } = this.parent;
            // Chỉ validate nếu có data khác được fill
            const hasAnyData = (ten_thanh_phan && ten_thanh_phan.trim()) || 
                              (mo_ta_chi_tiet && mo_ta_chi_tiet.trim()) || 
                              (so_luong_ban_sao !== null && so_luong_ban_sao !== undefined && so_luong_ban_sao !== '') || 
                              (ghi_chu && ghi_chu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản chính phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    so_luong_ban_sao: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản sao là bắt buộc', function (value) {
            const { ten_thanh_phan, mo_ta_chi_tiet, so_luong_ban_chinh, ghi_chu } = this.parent;
            // Chỉ validate nếu có data khác được fill
            const hasAnyData = (ten_thanh_phan && ten_thanh_phan.trim()) || 
                              (mo_ta_chi_tiet && mo_ta_chi_tiet.trim()) || 
                              (so_luong_ban_chinh !== null && so_luong_ban_chinh !== undefined && so_luong_ban_chinh !== '') || 
                              (ghi_chu && ghi_chu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản sao phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    ghi_chu: yup
        .string()
        .nullable()
});

const truongHopThuTucSchema = yup.object().shape({
    ten_truong_hop: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên trường hợp là bắt buộc', function (value) {
            const { mo_ta, thu_tu, thanh_phan_ho_so } = this.parent;
            // Chỉ validate nếu có data thực sự được fill
            const hasAnyData = (mo_ta && mo_ta.trim()) || 
                              (thu_tu !== null && thu_tu !== undefined) || 
                              (thanh_phan_ho_so && thanh_phan_ho_so.length > 0 && thanh_phan_ho_so.some(item => {
                                  // Kiểm tra xem có item nào thực sự có data không
                                  return (item.ten_thanh_phan && item.ten_thanh_phan.trim()) ||
                                         (item.mo_ta_chi_tiet && item.mo_ta_chi_tiet.trim()) ||
                                         (item.so_luong_ban_chinh !== null && item.so_luong_ban_chinh !== undefined && item.so_luong_ban_chinh !== '') ||
                                         (item.so_luong_ban_sao !== null && item.so_luong_ban_sao !== undefined && item.so_luong_ban_sao !== '') ||
                                         (item.ghi_chu && item.ghi_chu.trim());
                              }));
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Tên trường hợp không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    mo_ta: yup
        .string()
        .nullable(),
    thu_tu: yup
        .number()
        .nullable(),
    thanh_phan_ho_so: yup
        .array()
        .of(thanhPhanHoSoSchema)
        .nullable()
});

export const createFormalitySchema = yup.object().shape({
    idCoSoDichVuCong: yup
        .string()
        .required("Mã cơ sở dịch vụ công là bắt buộc"),
    tenThuTuc: yup
        .string()
        .required("Tên thủ tục là bắt buộc")
        .min(3, "Tên thủ tục phải có ít nhất 3 ký tự")
        .max(230, "Tên thủ tục không được vượt quá 230 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(50, "Mã thủ tục không được vượt quá 50 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc")
        .max(230, "Đối tượng thực hiện không được vượt quá 230 ký tự"),
    // url_pdf: yup
    //     .string()
    //     .nullable()
    //     .notRequired()
    //     .transform((value) => value === '' ? null : value)
    //     .test('url-format', 'URL PDF không hợp lệ', function (value) {
    //         if (!value) return true; 
    //         try {
    //             new URL(value);
    //             return true;
    //         } catch {
    //             return false;
    //         }
    //     }),
    yeuCauDieuKienChung: yup
        .string()
        .nullable(),
    soQuyetDinh: yup
        .string()
        .required("Số quyết định là bắt buộc")
        .max(230, "Số quyết định không được vượt quá 230 ký tự"),
    danhSachLinhVucIds: yup
        .array()
        .of(yup.string())
        .min(1, "Phải chọn ít nhất một lĩnh vực")
        .required("Danh sách lĩnh vực là bắt buộc"),
    danhSachMauDon: yup
        .array()
        .of(mauDonSchema)
        .nullable(),
    cachThuThucHien: yup
        .array()
        .of(cachThucHienSchema)
        .nullable(),
    trinhTuThucHien: yup
        .array()
        .of(trinhTuThucHienSchema)
        .nullable(),
    truongHopThuTuc: yup
        .array()
        .of(truongHopThuTucSchema)
        .nullable()
});

const mauDonUpdateSchema = mauDonSchema.shape({
    id: yup
        .string()
        .nullable(),
    soLuongBanChinh: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản chính là bắt buộc', function (value) {
            const { id, soLuongBanSao, ghiChu } = this.parent;
            // Chỉ validate nếu có ID hoặc có dữ liệu khác
            const hasAnyData = id || 
                              (soLuongBanSao !== null && soLuongBanSao !== undefined && soLuongBanSao !== '') || 
                              (ghiChu && ghiChu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản chính phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    soLuongBanSao: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản sao là bắt buộc', function (value) {
            const { id, soLuongBanChinh, ghiChu } = this.parent;
            const hasAnyData = id || 
                              (soLuongBanChinh !== null && soLuongBanChinh !== undefined && soLuongBanChinh !== '') || 
                              (ghiChu && ghiChu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản sao phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        })
});

const cachThucHienUpdateSchema = cachThucHienSchema.shape({
    id: yup
        .string()
        .nullable(),
    hinhThucApDung: yup
        .string()
        .nullable()
        .test('required-if-any', 'Hình thức áp dụng là bắt buộc', function (value) {
            const { moTaChiTiet, thoiGianGiaiQuyet, lePhi, ghiChuLePhi } = this.parent;
            // Chỉ validate nếu có bất kỳ field nào được fill với dữ liệu thực sự
            const hasAnyData = (moTaChiTiet && moTaChiTiet.trim()) || 
                              (thoiGianGiaiQuyet && thoiGianGiaiQuyet.trim()) || 
                              (lePhi && lePhi.toString().trim()) || 
                              (ghiChuLePhi && ghiChuLePhi.trim());
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Hình thức áp dụng không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    lePhi: yup
        .mixed()
        .nullable()
        .test('max-length', 'Lệ phí không được vượt quá 230 ký tự', function(value) {
            if (!value) return true;
            return String(value).length <= 230;
        })
        .test('is-valid-number', 'Lệ phí phải là số hợp lệ', function (value) {
            if (!value && value !== 0) return true;
            const cleanedValue = String(value).replace(/,/g, '.').replace(/\s/g, '');
            const numValue = parseFloat(cleanedValue);
            return !isNaN(numValue) && numValue >= 0;
        })
});

const trinhTuThucHienUpdateSchema = trinhTuThucHienSchema.shape({
    id: yup
        .string()
        .nullable(),
    tenBuoc: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên bước là bắt buộc', function (value) {
            const { moTaBuoc, thuTuBuoc } = this.parent;
            // Chỉ validate nếu có data được fill
            const hasAnyData = (moTaBuoc && moTaBuoc.trim()) || 
                              (thuTuBuoc !== null && thuTuBuoc !== undefined);
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
});

const thanhPhanHoSoUpdateSchema = thanhPhanHoSoSchema.shape({
    id: yup
        .string()
        .nullable(),
    tenThanhPhan: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên thành phần là bắt buộc', function (value) {
            const { moTaChiTiet, soLuongBanChinh, soLuongBanSao, ghiChu } = this.parent;
            // Chỉ validate nếu có data được fill
            const hasAnyData = (moTaChiTiet && moTaChiTiet.trim()) || 
                              (soLuongBanChinh !== null && soLuongBanChinh !== undefined && soLuongBanChinh !== '') || 
                              (soLuongBanSao !== null && soLuongBanSao !== undefined && soLuongBanSao !== '') || 
                              (ghiChu && ghiChu.trim());
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Tên thành phần không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    soLuongBanChinh: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản chính là bắt buộc', function (value) {
            const { tenThanhPhan, moTaChiTiet, soLuongBanSao, ghiChu } = this.parent;
            // Chỉ validate nếu có data khác được fill
            const hasAnyData = (tenThanhPhan && tenThanhPhan.trim()) || 
                              (moTaChiTiet && moTaChiTiet.trim()) || 
                              (soLuongBanSao !== null && soLuongBanSao !== undefined && soLuongBanSao !== '') || 
                              (ghiChu && ghiChu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản chính phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        }),
    soLuongBanSao: yup
        .number()
        .nullable()
        .test('required-if-any', 'Số lượng bản sao là bắt buộc', function (value) {
            const { tenThanhPhan, moTaChiTiet, soLuongBanChinh, ghiChu } = this.parent;
            // Chỉ validate nếu có data khác được fill
            const hasAnyData = (tenThanhPhan && tenThanhPhan.trim()) || 
                              (moTaChiTiet && moTaChiTiet.trim()) || 
                              (soLuongBanChinh !== null && soLuongBanChinh !== undefined && soLuongBanChinh !== '') || 
                              (ghiChu && ghiChu.trim());
            if (hasAnyData && (value === null || value === undefined || value === '')) return false;
            return true;
        })
        .test('min-value', 'Số lượng bản sao phải lớn hơn hoặc bằng 0', function (value) {
            if (value === null || value === undefined || value === '') return true;
            return value >= 0;
        })
});

const truongHopThuTucUpdateSchema = truongHopThuTucSchema.shape({
    id: yup
        .string()
        .nullable(),
    tenTruongHop: yup
        .string()
        .nullable()
        .test('required-if-any', 'Tên trường hợp là bắt buộc', function (value) {
            const { moTa, thuTu, thanhPhanHoSo } = this.parent;
            // Chỉ validate nếu có data thực sự được fill
            const hasAnyData = (moTa && moTa.trim()) || 
                              (thuTu !== null && thuTu !== undefined) || 
                              (thanhPhanHoSo && thanhPhanHoSo.length > 0 && thanhPhanHoSo.some(item => {
                                  return (item.tenThanhPhan && item.tenThanhPhan.trim()) ||
                                         (item.moTaChiTiet && item.moTaChiTiet.trim()) ||
                                         (item.soLuongBanChinh !== null && item.soLuongBanChinh !== undefined && item.soLuongBanChinh !== '') ||
                                         (item.soLuongBanSao !== null && item.soLuongBanSao !== undefined && item.soLuongBanSao !== '') ||
                                         (item.ghiChu && item.ghiChu.trim());
                              }));
            if (hasAnyData && (!value || !value.trim())) return false;
            return true;
        })
        .test('max-length', 'Tên trường hợp không được vượt quá 230 ký tự', function (value) {
            if (!value) return true;
            return value.length <= 230;
        }),
    thanh_phan_ho_so: yup
        .array()
        .of(thanhPhanHoSoUpdateSchema)
        .nullable()
});

export const updateFormalitySchema = yup.object().shape({
    idCoSoDichVuCong: yup
        .string()
        .required("Mã cơ sở dịch vụ công là bắt buộc"),
    tenThuTuc: yup
        .string()
        .required("Tên thủ tục là bắt buộc")
        .min(3, "Tên thủ tục phải có ít nhất 3 ký tự")
        .max(230, "Tên thủ tục không được vượt quá 230 ký tự"),
    maThuTuc: yup
        .string()
        .required("Mã thủ tục là bắt buộc")
        .min(2, "Mã thủ tục phải có ít nhất 2 ký tự")
        .max(50, "Mã thủ tục không được vượt quá 50 ký tự"),
    doiTuongThucHien: yup
        .string()
        .required("Đối tượng thực hiện là bắt buộc")
        .max(230, "Đối tượng thực hiện không được vượt quá 230 ký tự"),
    // url_pdf: yup
    //     .string()
    //     .nullable()
    //     .notRequired()
    //     .transform((value) => value === '' ? null : value)
    //     .test('url-format', 'URL PDF không hợp lệ', function (value) {
    //         if (!value) return true;
    //         try {
    //             new URL(value);
    //             return true;
    //         } catch {
    //             return false;
    //         }
    //     }),
    yeuCauDieuKienChung: yup
        .string()
        .nullable(),
    soQuyetDinh: yup
        .string()
        .required("Số quyết định là bắt buộc")
        .max(230, "Số quyết định không được vượt quá 230 ký tự"),
    isActive: yup
        .boolean()
        .nullable(),
    danhSachLinhVucIds: yup
        .array()
        .of(yup.string())
        .min(1, "Phải chọn ít nhất một lĩnh vực")
        .required("Danh sách lĩnh vực là bắt buộc"),
    danhSachMauDon: yup
        .array()
        .of(mauDonUpdateSchema)
        .nullable(),
    cachThuThucHien: yup
        .array()
        .of(cachThucHienUpdateSchema)
        .max(230, "Cách thức thực hiện không được vượt quá 230 ký tự")
        .nullable(),
    trinhTuThucHien: yup
        .array()
        .of(trinhTuThucHienUpdateSchema)
        .nullable(),
    truongHopThuTuc: yup
        .array()
        .of(truongHopThuTucUpdateSchema)
        .nullable()
});

export async function validateCreateFormality(data) {
    const result = await validateSchema(createFormalitySchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateUpdateFormality(data) {
    const result = await validateSchema(updateFormalitySchema, data);
    return { isValid: result.valid, errors: result.errors };
}

export async function validateFormalityForm(formalityData, isEditMode = false) {

    const schema = isEditMode ? updateFormalitySchema : createFormalitySchema;

    const result = await validateSchema(schema, formalityData);

    return { isValid: result.valid, errors: result.errors };
}
