import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import { validateReportArea } from "../../validator/reportAreaValidator";
import { showToast } from "../../utils/toastNotification";
import { USER_API } from "../../apis/user";
import { X } from "lucide-react";
import { handleSearchDropdownKeyDown } from "../../utils/keyboardNavigation";

let _persistedReportAreaForm = null;
let _persistedReportAreaId = null;

const ReportAreaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "create",
  isLoading = false,
}) => {
  const isViewMode = mode === "view";
  const [formData, setFormData] = useState({
    ten: "",
    moTa: "",
    nguoiQuanLyIds: [],
  });
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const prevIsOpen = useRef(false);

  const selectedUsers = formData.nguoiQuanLyIds
    .map((id) => {
      const userFromState = users.find((u) => u.id === id);
      if (userFromState) return userFromState;

      if (initialData?.nguoi_quan_ly) {
        const userFromInitial = initialData.nguoi_quan_ly.find(
          (u) => u.id === id
        );
        if (userFromInitial) {
          return {
            id: userFromInitial.id,
            fullName:
              userFromInitial.ho_va_ten ||
              userFromInitial.ho_ten ||
              userFromInitial.fullName ||
              userFromInitial.ten,
            email:
              userFromInitial.email ||
              userFromInitial.email_dang_nhap ||
              userFromInitial.username,
          };
        }
      }
      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showDropdown) return;

    const timer = setTimeout(
      async () => {
        setLoading(true);
        try {
          const result = await USER_API.getAllUsersWithPagination({
            page: 1,
            size: 100,
            isActive: true,
            search: searchUser || "",
          });
          const allUsers = result.content || [];
          const filtered = allUsers.filter(
            (user) =>
              !formData.nguoiQuanLyIds.includes(user.id) &&
              user.fullName &&
              user.fullName.trim() !== ""
          );
          setUsers(
            allUsers.filter((u) => u.fullName && u.fullName.trim() !== "")
          );
          setSearchResults(filtered);
        } catch (error) {
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      },
      searchUser ? 300 : 0
    );

    return () => clearTimeout(timer);
  }, [searchUser, formData.nguoiQuanLyIds, showDropdown]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchResults]);

  const fetchUsers = async () => {
    try {
      const result = await USER_API.getAllUsersWithPagination({
        page: 1,
        size: 100,
        isActive: true,
      });
      setUsers(result.content || []);
    } catch (error) {}
  };

  useEffect(() => {
    if (!prevIsOpen.current && isOpen) {
      if (
        mode === "edit" &&
        initialData &&
        _persistedReportAreaId !== initialData.id
      ) {
        _persistedReportAreaForm = null;
        _persistedReportAreaId = initialData.id;
      }

      if (mode === "create" && _persistedReportAreaId !== null) {
        _persistedReportAreaForm = null;
        _persistedReportAreaId = null;
      }

      if (_persistedReportAreaForm && mode !== "view") {
        setFormData(_persistedReportAreaForm);
      } else if (initialData && (mode === "edit" || mode === "view")) {
        const quanLyIds =
          initialData.nguoi_quan_ly?.map((item) => item.id) ||
          initialData.nguoiQuanLyIds ||
          [];
        setFormData({
          ten: initialData.ten || "",
          moTa: initialData.mo_ta || initialData.moTa || "",
          nguoiQuanLyIds: Array.isArray(quanLyIds) ? quanLyIds : [],
        });
      } else {
        setFormData({
          ten: "",
          moTa: "",
          nguoiQuanLyIds: [],
        });
      }
      setErrors({});
    }
    prevIsOpen.current = isOpen;
  }, [initialData, mode, isOpen]);

  const resetForm = () => {
    setFormData({
      ten: "",
      moTa: "",
      nguoiQuanLyIds: [],
    });
    setErrors({});
    _persistedReportAreaForm = null;
    _persistedReportAreaId = null;
  };

  const validateForm = async () => {
    if (isViewMode) return true;
    const { isValid, errors: validationErrors } = await validateReportArea(
      formData
    );
    setErrors(validationErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (isViewMode) {
      handleClose();
      return;
    }
    const isValid = await validateForm();

    if (!isValid) {
      showToast.error("Vui lòng kiểm tra lại các trường bắt buộc!");
      return;
    }

    try {
      await onSubmit({
        ten: formData.ten.trim(),
        moTa: formData.moTa?.trim() || null,
        nguoiQuanLyIds: formData.nguoiQuanLyIds || [],
      });
      resetForm();
    } catch (error) {
      // showToast.error(error.message || 'Đã có lỗi xảy ra khi gửi dữ liệu!');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const updateField = (field, value) => {
    if (isViewMode) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
    _persistedReportAreaForm = { ...formData, [field]: value };
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSelectUser = (user) => {
    const newIds = [...formData.nguoiQuanLyIds, user.id];
    updateField("nguoiQuanLyIds", newIds);
    setSearchUser("");
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleRemoveUser = (userId) => {
    if (isViewMode) return;
    const newIds = formData.nguoiQuanLyIds.filter((id) => id !== userId);
    updateField("nguoiQuanLyIds", newIds);
  };

  const handleKeyDown = (e) => {
    if (isViewMode) return;
    handleSearchDropdownKeyDown(e, {
      items: searchResults,
      highlightedIndex,
      showDropdown,
      setHighlightedIndex,
      setShowDropdown,
      onSelect: handleSelectUser,
    });
  };

  const modalTitle =
    mode === "create"
      ? "Thêm lĩnh vực mới"
      : mode === "edit"
      ? "Chỉnh sửa lĩnh vực"
      : "Chi tiết lĩnh vực";
  const submitText =
    mode === "create" ? "Tạo lĩnh vực" : "Cập nhật";

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      size="xl"
      footer={
        isViewMode ? (
          <button
            type="button"
            onClick={handleClose}
            className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm"
          >
            Đóng
          </button>
        ) : (
          <ModalFooter
            onCancel={handleClose}
            onSubmit={handleSubmit}
            cancelText="Hủy"
            submitText={submitText}
            submitDisabled={isLoading}
            submitLoading={isLoading}
          />
        )
      }
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
            Tên lĩnh vực
          </label>
          <input
            type="text"
            value={formData.ten}
            onChange={(e) => updateField("ten", e.target.value)}
            placeholder="Nhập tên lĩnh vực..."
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.ten ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
          {errors.ten && (
            <p className="mt-1 text-sm text-red-600">{errors.ten}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            value={formData.moTa}
            onChange={(e) => updateField("moTa", e.target.value)}
            placeholder="Nhập mô tả lĩnh vực..."
            rows="4"
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.moTa ? "border-red-500" : "border-gray-300"
            } ${isViewMode ? "bg-gray-100 cursor-not-allowed" : ""}`}
          />
          {errors.moTa && (
            <p className="mt-1 text-sm text-red-600">{errors.moTa}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
            Người quản lý
          </label>

          <div ref={containerRef} className="relative">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              onFocus={async () => {
                if (isViewMode) return;
                setShowDropdown(true);
                if (searchResults.length === 0 && !loading) {
                  setLoading(true);
                  try {
                    const result = await USER_API.getAllUsersWithPagination({
                      page: 1,
                      size: 100,
                      isActive: true,
                      search: "",
                    });
                    const allUsers = result.content || [];
                    const filtered = allUsers.filter(
                      (user) =>
                        !formData.nguoiQuanLyIds.includes(user.id) &&
                        user.fullName &&
                        user.fullName.trim() !== ""
                    );
                    setUsers(
                      allUsers.filter(
                        (u) => u.fullName && u.fullName.trim() !== ""
                      )
                    );
                    setSearchResults(filtered);
                  } catch (error) {
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm người quản lý..."
              disabled={isViewMode}
              className={`w-full px-3 bg-gray-200 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 ${
                isViewMode ? "cursor-not-allowed" : ""
              }`}
            />

            {showDropdown && !isViewMode && (
              <div className="absolute z-40 left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                {loading && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Đang tìm...
                  </div>
                )}
                {!loading && searchResults.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Không tìm thấy kết quả
                  </div>
                )}
                {!loading &&
                  searchResults.map((user, idx) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 ${
                        highlightedIndex === idx ? "bg-blue-100" : ""
                      }`}
                    >
                      <span className="font-medium text-sm block">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {user.email || "Chưa có email"}
                      </span>
                    </button>
                  ))}
              </div>
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="mt-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user.id}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-xs text-blue-700">
                      {user.email ? `(${user.email})` : "(Chưa có email)"}
                    </span>
                    {!isViewMode && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUser(user.id)}
                        className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                        title="Xóa"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

ReportAreaFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  mode: PropTypes.oneOf(["create", "edit", "view"]),
  isLoading: PropTypes.bool,
};

export default ReportAreaFormModal;
