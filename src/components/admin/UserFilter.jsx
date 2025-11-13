import React from "react";
import BaseFilter from "../base/BaseFilter";
import { ROLE, ROLE_LABELS } from "../../constants/role";

export default function UserFilter({
  filters = {},
  pagination = {},
  onFilterChange,
  onSearch,
  onReset,
  onPageSizeChange,
  onSearchWithFilters,
}) {
  const initialFilters = {
    searchKeyword: filters.searchKeyword || "",
    isActive: filters.isActive !== undefined ? filters.isActive : "",
    vaiTro: filters.vaiTro || "",
    pageSize: pagination.pageSize || 10,
  };

  const filterFields = [
    {
      name: "searchKeyword",
      type: "search",
      isSearch: true,
      placeholder: "Nhập tên đăng nhập, họ tên, email hoặc số điện thoại...",
    },
    {
      name: "isActive",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: "", label: "Tất cả" },
        { value: true, label: "Hoạt động" },
        { value: false, label: "Đã khóa" },
      ],
    },
    {
      name: "vaiTro",
      label: "Vai trò",
      type: "select",
      options: [
        { value: "", label: "Tất cả vai trò" },
        { value: ROLE.ADMIN, label: ROLE_LABELS.ADMIN },
        { value: ROLE.NHAN_VIEN, label: ROLE_LABELS.NHAN_VIEN },
        { value: ROLE.LANH_DAO, label: ROLE_LABELS.LANH_DAO },
        { value: ROLE.PHO_CHU_TICH, label: ROLE_LABELS.PHO_CHU_TICH },
        { value: ROLE.CHU_TICH, label: ROLE_LABELS.CHU_TICH },
        { value: ROLE.KHU_PHO, label: ROLE_LABELS.KHU_PHO },
      ],
    },
    {
      name: "pageSize",
      label: "Số bản ghi",
      type: "select",
      options: [
        { value: 5, label: "5 bản ghi" },
        { value: 10, label: "10 bản ghi" },
        { value: 20, label: "20 bản ghi" },
        { value: 50, label: "50 bản ghi" },
      ],
    },
  ];

  const handleFilter = (newFilters) => {
    if (newFilters.searchKeyword !== filters.searchKeyword) {
      onFilterChange?.("searchKeyword", newFilters.searchKeyword);
    }

    if (newFilters.isActive !== filters.isActive) {
      onFilterChange?.("isActive", newFilters.isActive);
    }

    if (newFilters.vaiTro !== filters.vaiTro) {
      onFilterChange?.("vaiTro", newFilters.vaiTro);
    }

    if (onSearchWithFilters) {
      onSearchWithFilters({
        searchKeyword: newFilters.searchKeyword,
        isActive: newFilters.isActive !== "" ? newFilters.isActive : undefined,
        vaiTro: newFilters.vaiTro !== "" ? newFilters.vaiTro : undefined,
        pageSize: Number(newFilters.pageSize),
      });
    } else {
      if (newFilters.pageSize !== pagination.pageSize) {
        onPageSizeChange?.(Number(newFilters.pageSize));
      }
      onSearch?.();
    }
  };

  const handleReset = () => {
    onReset?.();
  };

  return (
    <BaseFilter
      fields={filterFields}
      onFilter={handleFilter}
      onReset={handleReset}
      initialFilters={initialFilters}
      searchPlaceholder="Nhập tên đăng nhập, họ tên, email hoặc số điện thoại..."
      showSearchButton={true}
    />
  );
}
