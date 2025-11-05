export const INITIAL_FORM_STATE = {
    idCoSoDichVuCong: '',
    tenCoSoDichVuCong: '',
    tenThuTuc: '',
    maThuTuc: '',
    doiTuongThucHien: '',
    yeuCauDieuKienChung: '',
    soQuyetDinh: '',
    danhSachLinhVucIds: [],
    danhSachMauDon: [],
    cachThuThucHien: [],
    trinhTuThucHien: []
};

export const transformInitialData = (initialData, mode) => {
    if (!initialData) {
        return INITIAL_FORM_STATE;
    }

    if (mode === 'edit') {
        return {
            idCoSoDichVuCong: initialData.id_co_so_dich_vu_cong || '',
            tenCoSoDichVuCong: initialData.co_so_dich_vu_cong?.ten_co_so || '',
            tenThuTuc: initialData.ten_thu_tuc || '',
            maThuTuc: initialData.ma_thu_tuc || '',
            doiTuongThucHien: initialData.doi_tuong_thuc_hien || '',
            yeuCauDieuKienChung: initialData.yeu_cau_dieu_kien_chung || '',
            soQuyetDinh: initialData.so_quyet_dinh || '',


            danhSachLinhVucIds: initialData.thu_tuc_hanh_chinh_linh_vuc?.map(
                item => item.id_linh_vuc
            ) || [],

            danhSachMauDon: initialData.thu_tuc_hanh_chinh_mau_don?.map(item => ({
                id: item.id_mau_don || item.id,
                so_luong_ban_chinh: item.so_luong_ban_chinh || 0,
                so_luong_ban_sao: item.so_luong_ban_sao || 0,
                ghi_chu: item.ghi_chu || ''
            })) || [],

            cachThuThucHien: initialData.cach_thuc_thuc_hien?.map(item => ({
                id: item.id,
                hinh_thuc_ap_dung: item.hinh_thuc_ap_dung || '',
                mo_ta_chi_tiet: item.mo_ta_chi_tiet || '',
                thoi_gian_giai_quyet: item.thoi_gian_giai_quyet || '',
                le_phi: parseFloat(item.le_phi) || 0,
                ghi_chu_le_phi: item.ghi_chu_le_phi || ''
            })) || [],

            trinhTuThucHien: initialData.trinh_tu_thuc_hien_thu_tuc?.map(item => ({
                id: item.id,
                ten_buoc: item.ten_buoc || '',
                mo_ta_buoc: item.mo_ta_buoc || '',
                thu_tu_buoc: item.thu_tu_buoc || 1
            })) || []
        };
    }

    return {
        ...INITIAL_FORM_STATE,
        ...initialData,
        danhSachLinhVucIds: initialData.danhSachLinhVucIds || []
    };
};

export const cleanFormData = (formData) => {
    const payload = {
        idCoSoDichVuCong: formData.idCoSoDichVuCong || null,
        tenThuTuc: formData.tenThuTuc || null,
        maThuTuc: formData.maThuTuc || null,
        doiTuongThucHien: formData.doiTuongThucHien || null,
        yeuCauDieuKienChung: formData.yeuCauDieuKienChung?.trim() || null,
        soQuyetDinh: formData.soQuyetDinh?.trim() || null,
        
        danhSachLinhVucIds: formData.danhSachLinhVucIds || [],
        
        danhSachMauDon: (formData.danhSachMauDon || []).map(item => ({
            id: item.id,
            so_luong_ban_chinh: Number(item.so_luong_ban_chinh) || 0,
            so_luong_ban_sao: Number(item.so_luong_ban_sao) || 0,
            ghi_chu: item.ghi_chu || ''
        })),
        
        cachThuThucHien: (formData.cachThuThucHien || []).map(item => {
            let lePhi = 0;
            if (item.le_phi) {
                const cleanedValue = String(item.le_phi).replace(/,/g, '.').replace(/\s/g, '');
                lePhi = parseFloat(cleanedValue) || 0;
            }
            
            const mapped = {
                hinh_thuc_ap_dung: item.hinh_thuc_ap_dung || '',
                mo_ta_chi_tiet: item.mo_ta_chi_tiet || '',
                thoi_gian_giai_quyet: item.thoi_gian_giai_quyet || '',
                le_phi: lePhi,
                ghi_chu_le_phi: item.ghi_chu_le_phi || ''
            };
            if (item.id) {
                mapped.id = item.id;
            }
            return mapped;
        }),
        
        trinhTuThucHien: (formData.trinhTuThucHien || []).map((item, i) => {
            const mapped = {
                ten_buoc: item.ten_buoc || '',
                mo_ta_buoc: item.mo_ta_buoc || '',
                thu_tu_buoc: Number(item.thu_tu_buoc) || (i + 1)
            };
            if (item.id) {
                mapped.id = item.id;
            }
            return mapped;
        })
    };

    return payload;
};
