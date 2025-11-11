import React, { useState } from "react";
import PropTypes from "prop-types";
import { ChevronDown, ChevronUp, X, Edit2 } from "lucide-react";
import BaseModal, { ModalFooter } from "../base/BaseModal";
import PortalModal from "../base/PortalModal";

const ProcedureCasesSection = ({
  cases,
  addCase,
  removeCase,
  updateCase,
  updateCaseComponent,
  addCaseComponent,
  removeCaseComponent,
  errors,
}) => {
  const [expandedCases, setExpandedCases] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCaseIndex, setEditingCaseIndex] = useState(null);
  const [newCaseName, setNewCaseName] = useState("");
  const [newCaseDesc, setNewCaseDesc] = useState("");
  const [localError, setLocalError] = useState(null);
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
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState("string");
  const [newFieldValue, setNewFieldValue] = useState("");
  const [addedFields, setAddedFields] = useState([]);
  const [componentLocalError, setComponentLocalError] = useState(null);

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
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm trường hợp mới"
        size="md"
        footer={
          <ModalFooter
            onCancel={() => setIsAddModalOpen(false)}
            onSubmit={() => {
              if (!newCaseName || newCaseName.trim() === "") {
                setLocalError("Tên trường hợp là bắt buộc");
                return;
              }

              if (editingCaseIndex !== null && editingCaseIndex !== undefined) {
                updateCase(editingCaseIndex, "ten_truong_hop", newCaseName);
                updateCase(editingCaseIndex, "mo_ta", newCaseDesc);
                setExpandedCases((prev) => ({
                  ...prev,
                  [editingCaseIndex]: true,
                }));
                setIsAddModalOpen(false);
                setEditingCaseIndex(null);
                setNewCaseName("");
                setNewCaseDesc("");
                setLocalError(null);
                return;
              }

              const newIndex = cases.length;

              addCase({
                ten_truong_hop: newCaseName,
                mo_ta: newCaseDesc,
                thu_tu: newIndex + 1,
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
              setLocalError(null);
            }}
            cancelText="Hủy"
            submitText="Lưu"
            submitType="primary"
          />
        }
      >
        <div className="space-y-3 max-h-[60vh] overflow-y-auto px-4 py-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên trường hợp
            </label>
            <input
              type="text"
              value={newCaseName}
              onChange={(e) => {
                setNewCaseName(e.target.value);
                if (localError) setLocalError(null);
              }}
              placeholder="Nhập tên trường hợp..."
              className={`w-full  bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                localError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {localError && (
              <p className="text-xs text-red-600 mt-1">{localError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả trường hợp
            </label>
            <textarea
              value={newCaseDesc}
              onChange={(e) => setNewCaseDesc(e.target.value)}
              placeholder="Nhập mô tả trường hợp..."
              rows="4"
              className="w-full  bg-gray-200 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm border-gray-300 focus:ring-blue-500"
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
          setAddedFields([]);
          setNewFieldRequired(false);
          setNewFieldName("");
          setNewFieldType("string");
          setNewFieldValue("");
        }}
        title="Add a document"
        size="lg"
        className="max-w-xl"
        contentClassName="bg-white overflow-hidden"
        footer={
          <ModalFooter
            onCancel={() => setIsAddComponentModalOpen(false)}
            onSubmit={() => {
              if (!newComponentName || newComponentName.trim() === "") {
                setComponentLocalError("Tên thành phần là bắt buộc");
                return;
              }

              if (activeCaseIndex === null || activeCaseIndex === undefined)
                return;

              addCaseComponent(activeCaseIndex, {
                ten_thanh_phan: newComponentName,
                mo_ta_chi_tiet: newComponentDesc,
                so_luong_ban_chinh: newComponentSoLuongChinh
                  ? Number(newComponentSoLuongChinh)
                  : null,
                so_luong_ban_sao: newComponentSoLuongSao
                  ? Number(newComponentSoLuongSao)
                  : null,
                ghi_chu: newComponentGhiChu,
                thuoc_tinh_them: addedFields.map((f) => ({
                  name: f.name,
                  type: f.type,
                  value: f.value,
                  required: !!f.required,
                })),
              });

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
              setComponentLocalError(null);
            }}
            cancelText="Hủy"
            submitText="Lưu"
            submitType="primary"
          />
        }
      >
        <div className="space-y-3 max-h-[70vh] overflow-y-auto px-1 -mx-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Parent path
            </label>
            <input
              type="text"
              placeholder="/thanhphan 1762658741227"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                componentLocalError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document ID
            </label>
            <div className="w-full">
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  placeholder="Enter document ID…"
                  className={`w-full h-10 pl-4 pr-28 text-gray-200 placeholder-gray-500 text-sm rounded-lg border ${
                    componentLocalError
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                <button
                  type="button"
                  className="flex items-center justify-center px-8 py-2 ml-2 bg-white text-blue-600 border rounded border-blue-300 text-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Auto
                </button>
              </div>

              {componentLocalError && (
                <p className="mt-2 flex items-center gap-2 text-sm text-red-400">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-xs">
                    !
                  </span>
                  <span>Required</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newFieldRequired}
                  onChange={(e) => setNewFieldRequired(e.target.checked)}
                  className="w-4 h-4 border rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>

              <div className="flex-1">
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Optional field name..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-36">
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {newFieldType === "string"
                  ? "String"
                  : newFieldType.charAt(0).toUpperCase() +
                    newFieldType.slice(1)}
              </label>
              <input
                type="text"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
                placeholder="Enter string value..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mt-2">
              <button
                type="button"
                onClick={() => {
                  const field = {
                    id: `${Date.now()}-${Math.round(Math.random() * 10000)}`,
                    required: !!newFieldRequired,
                    name: newFieldName,
                    type: newFieldType,
                    value: newFieldValue,
                  };
                  setAddedFields((prev) => [...prev, field]);
                  setNewFieldRequired(false);
                  setNewFieldName("");
                  setNewFieldType("string");
                  setNewFieldValue("");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add field
              </button>
            </div>
            {addedFields.length > 0 && (
              <div className="mt-3 space-y-2">
                {addedFields.map((f, idx) => (
                  <div
                    key={f.id}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-3 relative max-w-[520px] mx-auto"
                  >
                    <div className="relative mb-3 flex items-center gap-3">
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => {
                          const updated = addedFields.map((item) =>
                            item.id === f.id
                              ? { ...item, name: e.target.value }
                              : item
                          );
                          setAddedFields(updated);
                        }}
                        placeholder="Field name..."
                        className="flex-1 max-w-[390px] h-10 px-3 py-2 bg-white placeholder-gray-500 text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAddedFields((prev) =>
                            prev.filter((it) => it.id !== f.id)
                          )
                        }
                        className="ml-auto bg-white text-red-500 hover:text-red-600 p-1 rounded border border-gray-200"
                        title="Xóa field"
                      >
                        <span className="text-lg">✕</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32">
                        <select
                          value={f.type}
                          onChange={(e) => {
                            const updated = addedFields.map((item) =>
                              item.id === f.id
                                ? { ...item, type: e.target.value }
                                : item
                            );
                            setAddedFields(updated);
                          }}
                          className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none"
                        >
                          <option value="string">string</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        value={f.value}
                        onChange={(e) => {
                          const updated = addedFields.map((item) =>
                            item.id === f.id
                              ? { ...item, value: e.target.value }
                              : item
                          );
                          setAddedFields(updated);
                        }}
                        placeholder="Value..."
                        className="flex-1 max-w-[267px] h-10 px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                            className="bg-gray-50 p-3 rounded border border-gray-200"
                          >
                            {component.ten_thanh_phan ||
                              `Thành phần ${idx + 1}`}
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
                        setAddedFields([]);
                        setNewFieldRequired(false);
                        setNewFieldName("");
                        setNewFieldType("string");
                        setNewFieldValue("");
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