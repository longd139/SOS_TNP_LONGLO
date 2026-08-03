import React, { useEffect, useMemo } from "react";
import BaseFilter from "../base/BaseFilter";
import { useRoles } from "../../hooks/useRoles";

export default function UserFilter({
  filters = {},
  pagination = {},
  onFilterChange,
  onSearch,
  onReset,
  onPageSizeChange,
  onSearchWithFilters,
}) {
  const { allRoles, allRolesLoading, loadAllRoles } = useRoles();

  useEffect(() => {
    loadAllRoles();
  }, [loadAllRoles]);

  const roleOptions = useMemo(() => {
    const defaultOption = [{ value: "", label: "Tất cả vai trò" }];
    
    if (!allRoles || allRoles.length === 0) {
      return defaultOption;
    }

    const rolesFromApi = allRoles.map((role) => ({
      value: role.id,
      label: role.name,
    }));


    return [...defaultOption, ...rolesFromApi];
  }, [allRoles]);

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
      options: roleOptions,
      disabled: allRolesLoading,
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
