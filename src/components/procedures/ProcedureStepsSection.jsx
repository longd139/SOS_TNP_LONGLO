import React from 'react';
import PropTypes from 'prop-types';
import { X, GripVertical } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableStepItem = ({ step, index, removeStep, updateStep, errors }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: step.id || `step-${index}` });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const getError = (field) => {
        const bracketKey = `trinhTuThucHien[${index}].${field}`;
        const dotKey = `trinhTuThucHien.${index}.${field}`;
        return errors?.[bracketKey] || errors?.[dotKey];
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white p-3 rounded-lg border border-gray-200 ${isDragging ? 'shadow-lg ring-2 ring-blue-400' : ''
                }`}
        >
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1"
                        {...attributes}
                        {...listeners}
                        title="Kéo để di chuyển"
                    >
                        <GripVertical className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Bước {step.thu_tu_buoc}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    title="Xóa bước này"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="mb-2">
                <input
                    type="text"
                    value={step.ten_buoc}
                    onChange={(e) => updateStep(index, 'ten_buoc', e.target.value)}
                    placeholder="Tên bước..."
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                        getError('ten_buoc')
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                    }`}
                />
                {getError('ten_buoc') && (
                    <p className="text-xs text-red-600 mt-1">{getError('ten_buoc')}</p>
                )}
            </div>

            <div>
                <textarea
                    value={step.mo_ta_buoc}
                    onChange={(e) => updateStep(index, 'mo_ta_buoc', e.target.value)}
                    placeholder="Mô tả chi tiết bước thực hiện..."
                    rows="2"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                        getError('mo_ta_buoc')
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                    }`}
                />
                {getError('mo_ta_buoc') && (
                    <p className="text-xs text-red-600 mt-1">{getError('mo_ta_buoc')}</p>
                )}
            </div>
        </div>
    );
};

SortableStepItem.propTypes = {
    step: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    removeStep: PropTypes.func.isRequired,
    updateStep: PropTypes.func.isRequired,
    errors: PropTypes.object
};

const ProcedureStepsSection = ({ steps, addStep, removeStep, updateStep, reorderSteps, errors }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = steps.findIndex(
                (step, idx) => (step.id || `step-${idx}`) === active.id
            );
            const newIndex = steps.findIndex(
                (step, idx) => (step.id || `step-${idx}`) === over.id
            );

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderSteps(oldIndex, newIndex);
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">Trình tự thực hiện</h3>
            </div>
            <div className="space-y-3 bg-gray-50 p-3 rounded-lg">
                {steps.length > 0 && (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={steps.map((step, idx) => step.id || `step-${idx}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {steps.map((step, index) => (
                                    <SortableStepItem
                                        key={step.id || `step-${index}`}
                                        step={step}
                                        index={index}
                                        removeStep={removeStep}
                                        updateStep={updateStep}
                                        errors={errors}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}

                <button
                    type="button"
                    onClick={addStep}
                    className="w-full py-2 px-4 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg font-medium transition-colors"
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
    updateStep: PropTypes.func.isRequired,
    reorderSteps: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default ProcedureStepsSection;
