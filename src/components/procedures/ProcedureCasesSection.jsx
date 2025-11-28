import { useState } from "react";
import PropTypes from "prop-types";
import { X, Edit2 } from "lucide-react";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import PortalModal from "../base/PortalModal";
import { validateSchema } from "../../utils/validationUtils";
import { truongHopThuTucSchema, thanhPhanHoSoSchema } from "../../validator/formalityValidator";

const ProcedureCasesSection = ({
  cases = [],
  addCase,
  removeCase,
  updateCase,
  addCaseComponent,
  removeCaseComponent
}) => {
  const [expandedCases, setExpandedCases] = useState({});
  const [isAddCaseModalOpen, setIsAddCaseModalOpen] = useState(false);
  const [isAddComponentModalOpen, setIsAddComponentModalOpen] = useState(false);
  const [editingCaseIndex, setEditingCaseIndex] = useState(null);
  const [activeCaseIndex, setActiveCaseIndex] = useState(null);
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(
    cases && cases.length > 0 ? 0 : null
  );

  const [caseForm, setCaseForm] = useState({
    ten_truong_hop: "",
    mo_ta: ""
  });
  const [caseErrors, setCaseErrors] = useState({});

  const [componentForm, setComponentForm] = useState({
    ten_thanh_phan: "",
    mo_ta_chi_tiet: "",
    so_luong_ban_chinh: "",
    so_luong_ban_sao: "",
    ghi_chu: ""
  });
  const [componentErrors, setComponentErrors] = useState({});
  const validateCase = async (data) => {
    const result = await validateSchema(truongHopThuTucSchema, data);
    return { isValid: result.valid, errors: result.errors };
  };

  const validateComponent = async (data) => {
    const result = await validateSchema(thanhPhanHoSoSchema, data);
    return { isValid: result.valid, errors: result.errors };
  };
  const resetCaseForm = () => {
    setCaseForm({ ten_truong_hop: "", mo_ta: "" });
    setCaseErrors({});
    setEditingCaseIndex(null);
  };

  const resetComponentForm = () => {
    setComponentForm({
      ten_thanh_phan: "",
      mo_ta_chi_tiet: "",
      so_luong_ban_chinh: "",
      so_luong_ban_sao: "",
      ghi_chu: ""
    });
    setComponentErrors({});
    setActiveCaseIndex(null);
  };
  const handleCaseSubmit = async () => {
    try {
      const validation = await validateCase(caseForm);

      if (!validation.isValid) {
        setCaseErrors(validation.errors);
        return;
      }

      setCaseErrors({});
      const isEdit = editingCaseIndex !== null;

      if (isEdit) {
        updateCase(editingCaseIndex, "ten_truong_hop", caseForm.ten_truong_hop);
        updateCase(editingCaseIndex, "mo_ta", caseForm.mo_ta);
        setExpandedCases(prev => ({ ...prev, [editingCaseIndex]: true }));
      } else {
        const newIndex = cases.length;
        const maxThuTu = cases.length > 0 ? Math.max(...cases.map(c => c.thu_tu || 0)) : 0;

        addCase({
          ten_truong_hop: caseForm.ten_truong_hop,
          mo_ta: caseForm.mo_ta,
          thu_tu: maxThuTu + 1,
          thanh_phan_ho_so: [],
        });

        setExpandedCases(prev => ({ ...prev, [newIndex]: true }));
        setTimeout(() => {
          const el = document.querySelector(`[data-case-index="${newIndex}"]`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }

      setIsAddCaseModalOpen(false);
      resetCaseForm();
    } catch (error) {
      setCaseErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
  };

  const handleComponentSubmit = async () => {
    try {
      let caseIndex = activeCaseIndex;
      if (caseIndex === null || caseIndex === undefined) {
        caseIndex = selectedCaseIndex !== null ? selectedCaseIndex : 0;
      }

      if (caseIndex === null || caseIndex === undefined || !cases || caseIndex >= cases.length) {
        return;
      }

      const dataForValidation = {
        ten_thanh_phan: componentForm.ten_thanh_phan?.trim() || "",
        mo_ta_chi_tiet: componentForm.mo_ta_chi_tiet?.trim() || "",
        so_luong_ban_chinh: componentForm.so_luong_ban_chinh ? Number(componentForm.so_luong_ban_chinh) : null,
        so_luong_ban_sao: componentForm.so_luong_ban_sao ? Number(componentForm.so_luong_ban_sao) : null,
        ghi_chu: componentForm.ghi_chu?.trim() || ""
      };

      if (!dataForValidation.ten_thanh_phan) {
        setComponentErrors({ ten_thanh_phan: "Tên thành phần là bắt buộc" });
        return;
      }

      const validation = await validateComponent(dataForValidation);
      if (!validation.isValid) {
        setComponentErrors(validation.errors);
        return;
      }

      setComponentErrors({});
      addCaseComponent(caseIndex, dataForValidation);
      setExpandedCases(prev => ({ ...prev, [caseIndex]: true }));
      setIsAddComponentModalOpen(false);
      resetComponentForm();

      setTimeout(() => {
        const el = document.querySelector(`[data-case-index="${caseIndex}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);

    } catch (error) {
      setComponentErrors({ general: "Có lỗi xảy ra. Vui lòng thử lại." });
    }
  };

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
              resetCaseForm();
              setIsAddCaseModalOpen(true);
            }}
            className="py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
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
        isOpen={isAddCaseModalOpen}
        onClose={() => {
          setIsAddCaseModalOpen(false);
          resetCaseForm();
        }}
        title={editingCaseIndex !== null ? "Chỉnh sửa trường hợp" : "Thêm trường hợp mới"}
        size="md"
        footer={
          <ModalFooter
            onCancel={() => {
              setIsAddCaseModalOpen(false);
              resetCaseForm();
            }}
            onSubmit={handleCaseSubmit}
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
              value={caseForm.ten_truong_hop}
              onChange={(e) => {
                setCaseForm(prev => ({...prev, ten_truong_hop: e.target.value}));
                if (caseErrors.ten_truong_hop) {
                  setCaseErrors(prev => ({...prev, ten_truong_hop: null}));
                }
              }}
              placeholder="Nhập tên trường hợp..."
              maxLength={230}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                caseErrors.ten_truong_hop
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {caseErrors.ten_truong_hop && (
              <p className="text-xs text-red-600 mt-1">{caseErrors.ten_truong_hop}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả trường hợp
            </label>
            <textarea
              value={caseForm.mo_ta}
              onChange={(e) => setCaseForm(prev => ({...prev, mo_ta: e.target.value}))}
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
          resetComponentForm();
        }}
        title="Thêm thành phần hồ sơ"
        size="lg"
        className="max-w-xl"
        contentClassName="bg-white overflow-hidden"
        footer={
          <ModalFooter
            onCancel={() => {
              setIsAddComponentModalOpen(false);
              resetComponentForm();
            }}
            onSubmit={handleComponentSubmit}
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
              value={componentForm.ten_thanh_phan}
              onChange={(e) => {
                setComponentForm(prev => ({...prev, ten_thanh_phan: e.target.value}));
                if (componentErrors.ten_thanh_phan) {
                  setComponentErrors(prev => ({...prev, ten_thanh_phan: null}));
                }
              }}
              placeholder="Nhập tên thành phần..."
              maxLength={230}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                componentErrors.ten_thanh_phan
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {componentErrors.ten_thanh_phan && (
              <p className="text-xs text-red-600 mt-1">{componentErrors.ten_thanh_phan}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả chi tiết
            </label>
            <textarea
              value={componentForm.mo_ta_chi_tiet}
              onChange={(e) => setComponentForm(prev => ({...prev, mo_ta_chi_tiet: e.target.value}))}
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
                value={componentForm.so_luong_ban_chinh}
                onChange={(e) => {
                  setComponentForm(prev => ({...prev, so_luong_ban_chinh: e.target.value}));
                  if (componentErrors.so_luong_ban_chinh) {
                    setComponentErrors(prev => ({...prev, so_luong_ban_chinh: null}));
                  }
                }}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {componentErrors.so_luong_ban_chinh && (
                <p className="text-xs text-red-600 mt-1">{componentErrors.so_luong_ban_chinh}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số bản sao
              </label>
              <input
                type="number"
                min="0"
                value={componentForm.so_luong_ban_sao}
                onChange={(e) => {
                  setComponentForm(prev => ({...prev, so_luong_ban_sao: e.target.value}));
                  if (componentErrors.so_luong_ban_sao) {
                    setComponentErrors(prev => ({...prev, so_luong_ban_sao: null}));
                  }
                }}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              {componentErrors.so_luong_ban_sao && (
                <p className="text-xs text-red-600 mt-1">{componentErrors.so_luong_ban_sao}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <input
                type="text"
                value={componentForm.ghi_chu}
                onChange={(e) => setComponentForm(prev => ({...prev, ghi_chu: e.target.value}))}
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
                          setEditingCaseIndex(caseIndex);
                          setCaseForm({
                            ten_truong_hop: caseItem.ten_truong_hop || "",
                            mo_ta: caseItem.mo_ta || ""
                          });
                          setIsAddCaseModalOpen(true);
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
                        const caseIndexToUse = selectedCaseIndex !== null ? selectedCaseIndex : 0;
                        
                        if (cases?.length === 0 || !cases) {
                          return;
                        }
                        
                        setActiveCaseIndex(caseIndexToUse);
                        resetComponentForm();
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
export default ProcedureCasesSection;