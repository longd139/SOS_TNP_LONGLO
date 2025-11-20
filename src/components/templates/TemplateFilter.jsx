import React from "react";
import { useSelector } from "react-redux";
import BaseFilter from "../base/BaseFilter";
import { selectShowRemoved } from "../../features/templates/templatesSelectors";

export default function TemplateFilter({
  filters = {},
  pagination = {},
  onFilterChange,
  onSearch,
  onReset,
  onToggleRemoved,
  onPageSizeChange,
  onSearchWithFilters,
}) {
  const showRemoved = useSelector(selectShowRemoved);

  const initialFilters = {
    searchKeyword: filters.searchKeyword || "",
    showRemoved: showRemoved,
    pageSize: pagination.pageSize || 10,
  };

  const filterFields = [
    {
      name: "searchKeyword",
      type: "search",
      isSearch: true,
      placeholder: "Nhập từ khóa tìm kiếm biểu mẫu...",
    },
    {
      name: "showRemoved",
      label: "Trạng thái",
      type: "select",
      options: [
        { value: false, label: "Đang hoạt động" },
        { value: true, label: "Không hoạt động" },
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

    if (newFilters.showRemoved !== showRemoved) {
      onToggleRemoved?.(newFilters.showRemoved);
    }

    if (onSearchWithFilters) {
      onSearchWithFilters({
        searchKeyword: newFilters.searchKeyword,
        showRemoved: newFilters.showRemoved,
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
      searchPlaceholder="Nhập từ khóa tìm kiếm biểu mẫu..."
      showSearchButton={true}
    />
  );
}
