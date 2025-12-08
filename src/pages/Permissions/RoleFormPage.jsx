import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { usePermissions } from '../../hooks/usePermissions';
import { useRoles } from '../../hooks/useRoles';
import { selectPermissionRawData, selectPermissionLoading } from '../../features/permissions/permissionSelector';
import { validateRoleForm } from '../../validator/roleValidator';
import { showToast } from '../../utils/toastNotification';
import { Search, ChevronLeft } from 'lucide-react';
import ROUTE_PATH from '../../constants/routes';

const RoleFormPage = () => {
  const navigate = useNavigate();
  const { roleId } = useParams();
  const isEditMode = !!roleId;

  const { loadPermissions } = usePermissions();
  const permissionRawData = useSelector(selectPermissionRawData);
  const permissionsLoading = useSelector(selectPermissionLoading);
  const { getRoleById, createRole, updateRole } = useRoles();

  const [form, setForm] = useState({
    name: "",
    description: "",
    permissionCodes: [],
  });
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const permissionsLoadedRef = useRef(false);
  const roleLoadedRef = useRef(null);

  useEffect(() => {
    if (!permissionsLoadedRef.current) {
      permissionsLoadedRef.current = true;
      loadPermissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEditMode && roleId && roleLoadedRef.current !== roleId) {
      roleLoadedRef.current = roleId;
      loadRoleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleId, isEditMode]);

  const loadRoleData = async () => {
    try {
      setIsLoading(true);
      const result = await getRoleById(roleId);
      if (result.success) {
        const roleData = result.data;
        setForm({
          name: roleData.name || "",
          description: roleData.description || "",
          permissionCodes: roleData.permissions?.map(p => p.code) || [],
        });
        setCheckedItems(roleData.permissions?.map(p => p.code) || []);
      } else {
        showToast.error('Không thể tải dữ liệu vai trò');
        navigate(ROUTE_PATH.PERMISSIONS);
      }
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra');
      navigate(ROUTE_PATH.PERMISSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const permissionsByCategory = useMemo(() => {
    if (!permissionRawData || !permissionRawData.grouped) return {};
    return permissionRawData.grouped;
  }, [permissionRawData]);

  const categoryLabels = useMemo(() => {
    if (!permissionRawData || !permissionRawData.cate) return {};
    return permissionRawData.cate;
  }, [permissionRawData]);

  const categoryNames = useMemo(() => {
    return Object.keys(permissionsByCategory || {});
  }, [permissionsByCategory]);

  const permissionList = useMemo(() => {
    const list = [];
    Object.keys(permissionsByCategory || {}).forEach((category) => {
      const items = permissionsByCategory[category] || [];
      items.forEach((p) => list.push({ category, ...p }));
    });
    return list;
  }, [permissionsByCategory]);

  const permissionsTable = useMemo(() => {
    const table = {};
    Object.keys(permissionsByCategory || {}).forEach((category) => {
      const items = permissionsByCategory[category] || [];
      if (!table[category]) {
        table[category] = {
          label: categoryLabels[category] || category,
          permissions: {}
        };
      }
      items.forEach((p) => {
        table[category].permissions[p.type] = p.code;
      });
    });
    return table;
  }, [permissionsByCategory, categoryLabels]);

  const filteredTable = useMemo(() => {
    let result = { ...permissionsTable };

    if (selectedCategory !== "all") {
      result = { [selectedCategory]: permissionsTable[selectedCategory] };
    }

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      result = Object.keys(result).reduce((acc, category) => {
        if (result[category].label.toLowerCase().includes(searchLower)) {
          acc[category] = result[category];
        }
        return acc;
      }, {});
    }

    return result;
  }, [permissionsTable, selectedCategory, searchText]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const toggleCheck = (code) => {
    setCheckedItems(prev => {
      const newItems = prev.includes(code)
        ? prev.filter(item => item !== code)
        : [...prev, code];

      setForm(prevForm => ({ ...prevForm, permissionCodes: newItems }));

      if (errors.permissionCodes) {
        setErrors(prevErrors => ({ ...prevErrors, permissionCodes: null }));
      }

      return newItems;
    });
  };

  const toggleAllCategory = (category) => {
    const categoryPerms = permissionsTable[category];
    if (!categoryPerms) return;

    const allCodes = Object.values(categoryPerms.permissions);
    const allChecked = allCodes.every(code => checkedItems.includes(code));

    setCheckedItems(prev => {
      let newItems;
      if (allChecked) {
        newItems = prev.filter(code => !allCodes.includes(code));
      } else {
        const toAdd = allCodes.filter(code => !prev.includes(code));
        newItems = [...prev, ...toAdd];
      }

      setForm(prevForm => ({ ...prevForm, permissionCodes: newItems }));

      if (errors.permissionCodes) {
        setErrors(prevErrors => ({ ...prevErrors, permissionCodes: null }));
      }

      return newItems;
    });
  };

  const isPermissionChecked = (category, type) => {
    const code = permissionsTable[category]?.permissions[type];
    return code ? checkedItems.includes(code) : false;
  };


  const isAllCategoryChecked = (category) => {
    const categoryPerms = permissionsTable[category];
    if (!categoryPerms) return false;
    const allCodes = Object.values(categoryPerms.permissions);
    return allCodes.length > 0 && allCodes.every(code => checkedItems.includes(code));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = {
        name: form.name,
        description: form.description,
        permissionCodes: checkedItems
      };

      const { isValid, errors: validationErrors } = await validateRoleForm(formData, isEditMode);

      if (!isValid) {
        setErrors(validationErrors);
        showToast.error('Vui lòng kiểm tra lại các trường bắt buộc!');
        setIsSubmitting(false);
        return;
      }

      if (isEditMode) {
        await updateRole(roleId, formData);
        showToast.success('Cập nhật vai trò thành công');
      } else {
        await createRole(formData);
        showToast.success('Tạo vai trò thành công');
      }

      navigate(ROUTE_PATH.PERMISSIONS);
    } catch (error) {
      showToast.error(error.message || 'Có lỗi xảy ra');
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'CSV': 'Cơ sở dịch vụ công',
      'DMTT': 'Danh mục tin tức',
      'LTD': 'Lịch tiếp dân',
      'LVPA': 'Lĩnh vực phản ánh',
      'LVTTHC': 'Lĩnh vực thủ tục hành chính',
      'MD': 'Mẫu đơn',
      'PA': 'Phản ánh',
      'RPT': 'Báo cáo',
      'TT': 'Thủ tục',
      'TTIN': 'Tin tức',
      'UB': 'Ủy ban',
      'ND': 'Người dùng',
      'ROLE': 'Vai trò',
      'PERM': 'Quyền',
      'ADL': 'Nhật ký hệ thống'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-4">
        <div className="w-full">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                <button
                  onClick={() => navigate(ROUTE_PATH.PERMISSIONS)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Quay lại"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditMode ? 'Chỉnh sửa vai trò' : 'Tạo Role mới'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Cập nhật thông tin và phân quyền cho role
                </p>
              </div>
            </div>
            <button
              type="submit"
              form="roleForm"
              disabled={isSubmitting || permissionsLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSubmitting ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full">
        <form id="roleForm" onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 required-label">
                  Tên Role
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder='Nhập tên role...'
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder='Nhập mô tả về role...'
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2 mb-0">
              Đã chọn: <span className="font-medium text-blue-600">{checkedItems.length} chức năng</span>
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-0 required-label">Phân quyền chức năng</h2>

            {errors.permissionCodes && (
              <p className="text-sm text-red-600 mt-2">{errors.permissionCodes}</p>
            )}

            {/* <div className='flex flex-col md:flex-row gap-3 mb-6 mt-4'>
                            <div className="flex-1 relative">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Tìm kiếm chức năng..."
                                />
                            </div>

                            <select
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categoryNames.map(category => (
                                    <option key={category} value={category}>
                                        {getCategoryLabel(category)}
                                    </option>
                                ))}
                            </select>
                        </div> */}

            {permissionsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : Object.keys(filteredTable).length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                Không có chức năng nào
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-50">
                        Chức năng
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Chọn tất cả
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Tạo mới
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Cập nhật
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Xóa
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Xem danh sách
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Xem chi tiết
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Cập nhật trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.keys(filteredTable).map((category) => {
                      const categoryData = filteredTable[category];
                      return (
                        <tr key={category} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {categoryData.label}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={isAllCategoryChecked(category)}
                              onChange={() => toggleAllCategory(category)}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.CREATE ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'CREATE')}
                                onChange={() => toggleCheck(categoryData.permissions.CREATE)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.UPDATE ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'UPDATE')}
                                onChange={() => toggleCheck(categoryData.permissions.UPDATE)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.DELETE ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'DELETE')}
                                onChange={() => toggleCheck(categoryData.permissions.DELETE)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.GET_ALL ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'GET_ALL')}
                                onChange={() => toggleCheck(categoryData.permissions.GET_ALL)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.GET_DETAIL ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'GET_DETAIL')}
                                onChange={() => toggleCheck(categoryData.permissions.GET_DETAIL)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {categoryData.permissions.UPDATE_STATUS ? (
                              <input
                                type="checkbox"
                                checked={isPermissionChecked(category, 'UPDATE_STATUS')}
                                onChange={() => toggleCheck(categoryData.permissions.UPDATE_STATUS)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                              />
                            ) : (
                              <div className="inline-block" title="Quyền này không tồn tại trong hệ thống">
                                <input
                                  type="checkbox"
                                  disabled
                                  className="w-4 h-4 rounded border-gray-300 text-gray-400 cursor-not-allowed"
                                />
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
              Đã chọn: <span className="font-semibold text-blue-600">{checkedItems.length}</span> chức năng
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(ROUTE_PATH.PERMISSIONS)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleFormPage;
