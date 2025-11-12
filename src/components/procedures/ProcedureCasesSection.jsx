import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp, X, Edit2 } from "lucide-react";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import PortalModal from "../base/PortalModal";
import { truongHopThuTucSchema, thanhPhanHoSoSchema } from "../../validator/formalityValidator";

const convertCasesToCamelCase = (cases) => {
  return cases.map(caseItem => ({
    tenTruongHop: caseItem.ten_truong_hop,
    moTa: caseItem.mo_ta,
    thuTu: caseItem.thu_tu,
    thanhPhanHoSo: (caseItem.thanh_phan_ho_so || []).map(component => ({
      tenThanhPhan: component.ten_thanh_phan,
      moTaChiTiet: component.mo_ta_chi_tiet,
      soLuongBanChinh: component.so_luong_ban_chinh,
      soLuongBanSao: component.so_luong_ban_sao,
      ghiChu: component.ghi_chu
    }))
  }));
};

const ProcedureCasesSection = ({
  cases = [],
  addCase,
  removeCase,
  updateCase,
  addCaseComponent,
  removeCaseComponent,
  updateCaseComponent,
  errors = {},
}) => {
  const validateCaseForm = async (data, isEdit = false) => {
    try {
      await truongHopThuTucSchema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      } else {
        validationErrors.general = error.message;
      }
      return { isValid: false, errors: validationErrors };
    }
  };

  const validateComponentForm = async (data, isEdit = false) => {
    try {
      await thanhPhanHoSoSchema.validate(data, { abortEarly: false });
      return { isValid: true, errors: {} };
    } catch (error) {
      const validationErrors = {};
      if (error.inner) {
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
      } else {
        validationErrors.general = error.message;
      }
      return { isValid: false, errors: validationErrors };
    }
  };
  const [expandedCases, setExpandedCases] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCaseIndex, setEditingCaseIndex] = useState(null);
  const [newCaseName, setNewCaseName] = useState("");
  const [newCaseDesc, setNewCaseDesc] = useState("");
  const [localError, setLocalError] = useState(null);
  const [caseFieldErrors, setCaseFieldErrors] = useState({});
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
  const [activeCaseIndex, setActiveCaseIndex] = useState(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(
    cases && cases.length > 0 ? 0 : null
  );
  const [newComponentName, setNewComponentName] = useState("");
  const [newComponentDesc, setNewComponentDesc] = useState("");
  const [newComponentSoLuongChinh, setNewComponentSoLuongChinh] = useState("");
  const [newComponentSoLuongSao, setNewComponentSoLuongSao] = useState("");
  const [newComponentGhiChu, setNewComponentGhiChu] = useState("");
  const [componentLocalError, setComponentLocalError] = useState(null);
  const [componentFieldErrors, setComponentFieldErrors] = useState({});

  const toggleCase = (index) => {
    setExpandedCases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900">
          Trường hợp thủ tục
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setLocalError(null);
              setCaseFieldErrors({});
              setNewCaseName("");
              setNewCaseDesc("");
              setEditingCaseIndex(null);
              setIsAddModalOpen(true);
            }}
            className=" py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
          >
            + Thêm trường hợp
          </button>
        </div>
      </div>
      {cases.length === 0 && (
        <div className="border border-gray-300 border-dashed rounded-lg p-6 text-center text-gray-500 mt-3">
          Chưa có trường hợp thủ tục nào. Nhấn "Thêm trường hợp" để bắt đầu.
        </div>
      )}
      <BaseModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCaseFieldErrors({});
          setLocalError(null);
        }}
        title={editingCaseIndex !== null ? "Chỉnh sửa trường hợp" : "Thêm trường hợp mới"}
        size="md"
        footer={
          <ModalFooter
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={async () => {
              // Chuyển data về snake_case để validate với formalityValidator
              const caseDataForValidation = {
                ten_truong_hop: newCaseName,
                mo_ta: newCaseDesc,
                thu_tu: null,
                thanh_phan_ho_so: []
              };

              const isEdit = editingCaseIndex !== null && editingCaseIndex !== undefined;
              const validation = await validateCaseForm(caseDataForValidation, isEdit);

              if (!validation.isValid) {
                // Chuyển error keys về camelCase để hiển thị
                const camelCaseErrors = {};
                Object.keys(validation.errors).forEach(key => {
                  if (key === 'ten_truong_hop') camelCaseErrors.tenTruongHop = validation.errors[key];
                  else camelCaseErrors[key] = validation.errors[key];
                });
                setCaseFieldErrors(camelCaseErrors);
                setLocalError(Object.values(validation.errors)[0] || "Có lỗi xảy ra");
                return;
              }

              setCaseFieldErrors({});
              setLocalError(null);

              if (isEdit) {
                updateCase(editingCaseIndex, "ten_truong_hop", newCaseName);
                updateCase(editingCaseIndex, "mo_ta", newCaseDesc);
                // Giữ nguyên thứ tự hiện tại khi edit
                setExpandedCases((prev) => ({
                  ...prev,
                  [editingCaseIndex]: true,
                }));
                setIsAddModalOpen(false);
                setEditingCaseIndex(null);
                setNewCaseName("");
                setNewCaseDesc("");
                setCaseFieldErrors({});
                setLocalError(null);
                return;
              }

              const newIndex = cases.length;
              // Tự động tính thứ tự: lấy thứ tự lớn nhất hiện có + 1
              const maxThuTu = cases.length > 0 ? Math.max(...cases.map(c => c.thu_tu || 0)) : 0;

              // Submit data với snake_case format để consistency
              addCase({
                ten_truong_hop: newCaseName,
                mo_ta: newCaseDesc,
                thu_tu: maxThuTu + 1,
                thanh_phan_ho_so: [],
              });

              setExpandedCases((prev) => ({ ...prev, [newIndex]: true }));
              setTimeout(() => {
                try {
                  const el = document.querySelector(
                    `[data-case-index="${newIndex}"]`
                  );
                  if (el && typeof el.scrollIntoView === "function") {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                } catch (e) {}
              }, 50);

              setIsAddModalOpen(false);
              setNewCaseName("");
              setNewCaseDesc("");
              setCaseFieldErrors({});
              setLocalError(null);
            }}
            cancelText="Hủy"
            submitText={editingCaseIndex !== null ? "Cập nhật" : "Lưu"}
            submitType="primary"
          />
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-4 py-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên trường hợp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newCaseName}
              onChange={(e) => {
                setNewCaseName(e.target.value);
                if (localError) setLocalError(null);
                if (caseFieldErrors.tenTruongHop) {
                  setCaseFieldErrors(prev => ({...prev, tenTruongHop: null}));
                }
              }}
              placeholder="Nhập tên trường hợp..."
              maxLength={230}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                localError || caseFieldErrors.tenTruongHop
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {(localError || caseFieldErrors.tenTruongHop) && (
              <p className="text-xs text-red-600 mt-1">
                {caseFieldErrors.tenTruongHop || localError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả trường hợp
            </label>
            <textarea
              value={newCaseDesc}
              onChange={(e) => setNewCaseDesc(e.target.value)}
              placeholder="Nhập mô tả trường hợp..."
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
      </BaseModal>
      <PortalModal
        isOpen={isAddComponentModalOpen}
        onClose={() => {
          setIsAddComponentModalOpen(false);
          setActiveCaseIndex(null);
          setNewComponentName("");
          setNewComponentDesc("");
          setNewComponentSoLuongChinh("");
          setNewComponentSoLuongSao("");
          setNewComponentGhiChu("");
          setComponentLocalError(null);
          setComponentFieldErrors({});
        }}
        title="Thêm thành phần hồ sơ"
        size="lg"
        className="max-w-xl"
        contentClassName="bg-white overflow-hidden"
        footer={
          <ModalFooter
            onCancel={() => setIsAddComponentModalOpen(false)}
            onSubmit={async () => {
              // Chuyển data về snake_case để validate với formalityValidator
              const componentDataForValidation = {
                ten_thanh_phan: newComponentName,
                mo_ta_chi_tiet: newComponentDesc,
                so_luong_ban_chinh: newComponentSoLuongChinh ? Number(newComponentSoLuongChinh) : null,
                so_luong_ban_sao: newComponentSoLuongSao ? Number(newComponentSoLuongSao) : null,
                ghi_chu: newComponentGhiChu,
              };

              const validation = await validateComponentForm(componentDataForValidation, false);

              if (!validation.isValid) {
                // Chuyển error keys về camelCase để hiển thị
                const camelCaseErrors = {};
                Object.keys(validation.errors).forEach(key => {
                  switch(key) {
                    case 'ten_thanh_phan': 
                      camelCaseErrors.tenThanhPhan = validation.errors[key];
                      break;
                    case 'so_luong_ban_chinh':
                      camelCaseErrors.soLuongBanChinh = validation.errors[key];
                      break;
                    case 'so_luong_ban_sao':
                      camelCaseErrors.soLuongBanSao = validation.errors[key];
                      break;
                    default:
                      camelCaseErrors[key] = validation.errors[key];
                  }
                });
                setComponentFieldErrors(camelCaseErrors);
                setComponentLocalError(Object.values(validation.errors)[0] || "Có lỗi xảy ra");
                return;
              }

              setComponentFieldErrors({});
              setComponentLocalError(null);

              if (activeCaseIndex === null || activeCaseIndex === undefined) {
                return;
              }

              // Convert back to snake_case for consistency with parent
              const componentDataSnakeCase = {
                ten_thanh_phan: newComponentName,
                mo_ta_chi_tiet: newComponentDesc,
                so_luong_ban_chinh: newComponentSoLuongChinh ? Number(newComponentSoLuongChinh) : null,
                so_luong_ban_sao: newComponentSoLuongSao ? Number(newComponentSoLuongSao) : null,
                ghi_chu: newComponentGhiChu,
              };

              addCaseComponent(activeCaseIndex, componentDataSnakeCase);

              // Force re-render by updating a different state
              setExpandedCases((prev) => ({
                ...prev,
                [activeCaseIndex]: true,
              }));
              setTimeout(() => {
                try {
                  const el = document.querySelector(
                    `[data-case-index="${activeCaseIndex}"]`
                  );
                  if (el && typeof el.scrollIntoView === "function") {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }
                } catch (e) {}
              }, 50);

              setIsAddComponentModalOpen(false);
              setActiveCaseIndex(null);
              setNewComponentName("");
              setNewComponentDesc("");
              setNewComponentSoLuongChinh("");
              setNewComponentSoLuongSao("");
              setNewComponentGhiChu("");
              setComponentFieldErrors({});
              setComponentLocalError(null);
            }}
            cancelText="Hủy"
            submitText="Lưu"
            submitType="primary"
          />
        }
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-4 pb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên thành phần <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newComponentName}
              onChange={(e) => {
                setNewComponentName(e.target.value);
                if (componentLocalError) setComponentLocalError(null);
                if (componentFieldErrors.tenThanhPhan) {
                  setComponentFieldErrors(prev => ({...prev, tenThanhPhan: null}));
                }
              }}
              placeholder="Nhập tên thành phần..."
              maxLength={230}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                componentLocalError || componentFieldErrors.tenThanhPhan
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {(componentLocalError || componentFieldErrors.tenThanhPhan) && (
              <p className="text-xs text-red-600 mt-1">
                {componentFieldErrors.tenThanhPhan || componentLocalError}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              value={newComponentDesc}
              onChange={(e) => setNewComponentDesc(e.target.value)}
              placeholder="Nhập mô tả chi tiết..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số bản chính
              </label>
              <input
                type="number"
                min="0"
                value={newComponentSoLuongChinh}
                onChange={(e) => {
                  setNewComponentSoLuongChinh(e.target.value);
                  if (componentFieldErrors.soLuongBanChinh) {
                    setComponentFieldErrors(prev => ({...prev, soLuongBanChinh: null}));
                  }
                }}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {componentFieldErrors.soLuongBanChinh && (
                <p className="text-xs text-red-600 mt-1">{componentFieldErrors.soLuongBanChinh}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số bản sao
              </label>
              <input
                type="number"
                min="0"
                value={newComponentSoLuongSao}
                onChange={(e) => {
                  setNewComponentSoLuongSao(e.target.value);
                  if (componentFieldErrors.soLuongBanSao) {
                    setComponentFieldErrors(prev => ({...prev, soLuongBanSao: null}));
                  }
                }}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {componentFieldErrors.soLuongBanSao && (
                <p className="text-xs text-red-600 mt-1">{componentFieldErrors.soLuongBanSao}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <input
                type="text"
                value={newComponentGhiChu}
                onChange={(e) => setNewComponentGhiChu(e.target.value)}
                placeholder="Ghi chú..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
      </PortalModal>
      {cases.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Danh sách trường hợp
            </h4>
            <div className="space-y-3">
              {cases.map((caseItem, caseIndex) => (
                <div
                  key={caseItem.id || `case-${caseIndex}`}
                  data-case-index={caseIndex}
                  onClick={() => setSelectedCaseIndex(caseIndex)}
                  className={`rounded-lg border p-3 relative cursor-pointer transition-colors ${
                    selectedCaseIndex === caseIndex
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">{`Trường hợp ${
                        caseItem.thu_tu || caseIndex + 1
                      }`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCase(caseIndex);
                        }}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title={expandedCases[caseIndex] ? "Thu gọn" : "Mở rộng"}
                      >
                        {expandedCases[caseIndex] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCaseIndex(caseIndex);
                          setNewCaseName(caseItem.ten_truong_hop || "");
                          setNewCaseDesc(caseItem.mo_ta || "");
                          setIsAddModalOpen(true);
                        }}
                        className="text-gray-700 hover:bg-gray-50 p-1 rounded transition-colors"
                        title="Chỉnh sửa trường hợp"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCase(caseIndex);
                        }}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Xóa trường hợp này"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {caseItem.ten_truong_hop ||
                          `Trường hợp ${caseIndex + 1}`}
                      </p>
                    </div>

                    {caseItem.mo_ta && (
                      <div className="text-sm text-gray-500">
                        {caseItem.mo_ta}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {(caseItem.thanh_phan_ho_so || []).length} hồ sơ
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-blue-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Thành phần hồ sơ
            </h4>
            <div className="border border-blue-100 rounded-lg p-6">
              {selectedCaseIndex === null || !cases[selectedCaseIndex] ? (
                <div className="text-center text-gray-400 italic">
                  Chưa có trường hợp nào được chọn
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm">{`Trường hợp ${
                      cases[selectedCaseIndex].thu_tu || selectedCaseIndex + 1
                    }: ${cases[selectedCaseIndex].ten_truong_hop || ""}`}</div>
                  </div>

                  {(cases[selectedCaseIndex].thanh_phan_ho_so || []).length ===
                  0 ? (
                    <div className="py-12 text-center text-gray-400 italic">
                      Chưa có thành phần hồ sơ nào
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(cases[selectedCaseIndex].thanh_phan_ho_so || []).map(
                        (component, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h6 className="text-sm font-medium text-gray-900">
                                {component.ten_thanh_phan ||
                                  `Thành phần ${idx + 1}`}
                              </h6>
                              <button
                                type="button"
                                onClick={() => removeCaseComponent(selectedCaseIndex, idx)}
                                className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                                title="Xóa thành phần này"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {component.mo_ta_chi_tiet && (
                              <p className="text-xs text-gray-600 mb-2">
                                {component.mo_ta_chi_tiet}
                              </p>
                            )}
                            
                            <div className="flex gap-4 text-xs text-gray-500">
                              <span>Bản chính: {component.so_luong_ban_chinh || 0}</span>
                              <span>Bản sao: {component.so_luong_ban_sao || 0}</span>
                            </div>
                            
                            {component.ghi_chu && (
                              <p className="text-xs text-gray-500 mt-1 italic">
                                Ghi chú: {component.ghi_chu}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedCaseIndex === null) return;
                        setActiveCaseIndex(selectedCaseIndex);
                        setNewComponentName("");
                        setNewComponentDesc("");
                        setNewComponentSoLuongChinh("");
                        setNewComponentSoLuongSao("");
                        setNewComponentGhiChu("");
                        setComponentLocalError(null);
                        setComponentFieldErrors({});
                        setIsAddComponentModalOpen(true);
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <span className="text-xl">+</span>
                      <span className="text-sm font-medium">
                        Thêm thành phần hồ sơ
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProcedureCasesSection.propTypes = {
  cases: PropTypes.array.isRequired,
  addCase: PropTypes.func.isRequired,
  removeCase: PropTypes.func.isRequired,
  updateCase: PropTypes.func.isRequired,
  updateCaseComponent: PropTypes.func.isRequired,
  addCaseComponent: PropTypes.func.isRequired,
  removeCaseComponent: PropTypes.func.isRequired,
  errors: PropTypes.object,
};
export { convertCasesToCamelCase };
export default ProcedureCasesSection;