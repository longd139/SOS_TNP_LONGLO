import React from 'react';
import PropTypes from 'prop-types';

const ProcedureStepsSection = ({ steps, addStep, removeStep, updateStep }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Trình tự thực hiện
            </label>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {steps.map((step, index) => (
                    <div
                        key={step.id || `step-${index}`}
                        className="bg-white p-3 rounded-lg border border-gray-200"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Bước {step.thu_tu_buoc}
                            </span>
                            {steps.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="text-red-600 hover:bg-red-50 p-1 rounded"
                                    title="Xóa bước này"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <input
                            type="text"
                            value={step.ten_buoc}
                            onChange={(e) => updateStep(index, 'ten_buoc', e.target.value)}
                            placeholder="Tên bước..."
                            className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />

                        <textarea
                            value={step.mo_ta_buoc}
                            onChange={(e) => updateStep(index, 'mo_ta_buoc', e.target.value)}
                            placeholder="Mô tả chi tiết bước thực hiện..."
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addStep}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    + Thêm bước thực hiện
                </button>
            </div>
        </div>
    );
};

ProcedureStepsSection.propTypes = {
    steps: PropTypes.array.isRequired,
    addStep: PropTypes.func.isRequired,
    removeStep: PropTypes.func.isRequired,
    updateStep: PropTypes.func.isRequired
};

export default ProcedureStepsSection;
