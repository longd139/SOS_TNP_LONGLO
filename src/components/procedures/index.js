export { default as ProcedureForm } from './ProcedureForm.refactored';
export { default as ProcedureBasicInfo } from './ProcedureBasicInfo';
export { default as ProcedureRemoveToggle } from './ProcedureRemoveToggle';
export { default as ProcedureAreasSelector } from './ProcedureAreasSelector';
export { default as ProcedureAdditionalInfo } from './ProcedureAdditionalInfo';
export { default as ProcedureStepsSection } from './ProcedureStepsSection';
export { default as ProcedureMethodsSection } from './ProcedureMethodsSection';

export { useProcedureForm } from '../../hooks/useProcedureForm';

export {
    INITIAL_FORM_STATE,
    transformInitialData,
    cleanFormData
} from './transformProcedureData';
