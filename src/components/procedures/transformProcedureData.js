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
    trinhTuThucHien: [],
    truongHopThuTuc: []
};

export const transformInitialData = (initialData, mode) => {
    if (!initialData) {
        return INITIAL_FORM_STATE;
    }

    if (mode === 'edit') {
        let tenCoSoDichVuCong = '';
        if (typeof initialData.co_so_dich_vu_cong === 'string') {
            tenCoSoDichVuCong = initialData.co_so_dich_vu_cong;
        } else if (typeof initialData.co_so_dich_vu_cong === 'object' && initialData.co_so_dich_vu_cong !== null) {
            tenCoSoDichVuCong = initialData.co_so_dich_vu_cong.ten_co_so || '';
        }

        let danhSachLinhVucIds = [];
        if (initialData.thu_tuc_hanh_chinh_linh_vuc) {
            danhSachLinhVucIds = initialData.thu_tuc_hanh_chinh_linh_vuc.map(
                item => item.id_linh_vuc
            );
        } else if (initialData.linh_vuc && Array.isArray(initialData.linh_vuc)) {
            danhSachLinhVucIds = initialData.linh_vuc;
        }

        return {
            idCoSoDichVuCong: initialData.id_co_so_dich_vu_cong || '',
            tenCoSoDichVuCong: tenCoSoDichVuCong,
            tenThuTuc: initialData.ten_thu_tuc || '',
            maThuTuc: initialData.ma_thu_tuc || '',
            doiTuongThucHien: initialData.doi_tuong_thuc_hien || '',
            yeuCauDieuKienChung: initialData.yeu_cau_dieu_kien_chung || '',
            soQuyetDinh: initialData.so_quyet_dinh || '',

            danhSachLinhVucIds: danhSachLinhVucIds,

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
            })) || [],

            truongHopThuTuc: initialData.truong_hop_thu_tuc?.map(item => ({
                id: item.id,
                ten_truong_hop: item.ten_truong_hop || '',
                mo_ta: item.mo_ta || '',
                thu_tu: item.thu_tu || 1,
                thanh_phan_ho_so: item.thanh_phan_ho_so?.map(comp => ({
                    id: comp.id,
                    ten_thanh_phan: comp.ten_thanh_phan || '',
                    mo_ta_chi_tiet: comp.mo_ta_chi_tiet || '',
                    so_luong_ban_chinh: comp.so_luong_ban_chinh || 0,
                    so_luong_ban_sao: comp.so_luong_ban_sao || 0,
                    ghi_chu: comp.ghi_chu || ''
                })) || []
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
            soLuongBanChinh: Number(item.so_luong_ban_chinh) || 0,
            soLuongBanSao: Number(item.so_luong_ban_sao) || 0,
            ghiChu: item.ghi_chu || ''
        })),
        
        cachThuThucHien: (formData.cachThuThucHien || []).map(item => {
            let lePhi = 0;
            if (item.le_phi) {
                const cleanedValue = String(item.le_phi).replace(/,/g, '.').replace(/\s/g, '');
                lePhi = parseFloat(cleanedValue) || 0;
            }
            
            const mapped = {
                hinhThucApDung: item.hinh_thuc_ap_dung || '',
                moTaChiTiet: item.mo_ta_chi_tiet || '',
                thoiGianGiaiQuyet: item.thoi_gian_giai_quyet || '',
                lePhi: lePhi,
                ghiChuLePhi: item.ghi_chu_le_phi || ''
            };
            if (item.id) {
                mapped.id = item.id;
            }
            return mapped;
        }),
        
        trinhTuThucHien: (formData.trinhTuThucHien || []).map((item, i) => {
            const mapped = {
                tenBuoc: item.ten_buoc || '',
                moTaBuoc: item.mo_ta_buoc || '',
                thuTuBuoc: Number(item.thu_tu_buoc) || (i + 1)
            };
            if (item.id) {
                mapped.id = item.id;
            }
            return mapped;
        }),

        truongHopThuTuc: (formData.truongHopThuTuc || []).map((item, i) => {
            const mapped = {
                tenTruongHop: item.ten_truong_hop || '',
                moTa: item.mo_ta || '',
                thuTu: Number(item.thu_tu) || (i + 1),
                thanhPhanHoSo: (item.thanh_phan_ho_so || []).map(comp => {
                    const compMapped = {
                        tenThanhPhan: comp.ten_thanh_phan || '',
                        moTaChiTiet: comp.mo_ta_chi_tiet || '',
                        soLuongBanChinh: Number(comp.so_luong_ban_chinh) || 0,
                        soLuongBanSao: Number(comp.so_luong_ban_sao) || 0,
                        ghiChu: comp.ghi_chu || ''
                    };
                    if (comp.id) {
                        compMapped.id = comp.id;
                    }
                    return compMapped;
                })
            };
            if (item.id) {
                mapped.id = item.id;
            }
            return mapped;
        })
    };

    return payload;
};
