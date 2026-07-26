// ============================================================
// MOCK CONTEXT — State management giả lập cho prototype
// ============================================================
import { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import {
  users, complaints, neighborhoods, categories, departments,
  attachments, assignments, extensions, history,
  getUserById, getNeighborhoodById, getCategoryById, getDepartmentById,
  getComplaintById, getComplaintsByCitizen, getHistoryByComplaint,
  getExtensionsByComplaint, getAttachmentsByComplaint, getAssignmentByComplaint,
} from './db';

const MockContext = createContext(null);

// ---- actions ----
const ACTIONS = {
  SET_ROLE: 'SET_ROLE',
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  ADD_COMPLAINT: 'ADD_COMPLAINT',
  UPDATE_COMPLAINT: 'UPDATE_COMPLAINT',
  ADD_HISTORY: 'ADD_HISTORY',
  ADD_EXTENSION: 'ADD_EXTENSION',
  UPDATE_EXTENSION: 'UPDATE_EXTENSION',
  ADD_ASSIGNMENT: 'ADD_ASSIGNMENT',
  SET_FILTERS: 'SET_FILTERS',
};

// ---- role mặc định khi demo ----
const DEFAULT_ROLE = 'APPROVER'; // có thể đổi để test
const DEFAULT_USER = users.find(u => u.role === DEFAULT_ROLE) || users[0];

const initialState = {
  currentRole: DEFAULT_ROLE,
  currentUser: DEFAULT_USER,
  roleLabel: getRoleLabel(DEFAULT_ROLE),
  complaints,
  users,
  neighborhoods,
  categories,
  departments,
  attachments,
  assignments,
  extensions,
  history,
  filters: { search: '', status: '', categoryId: '', neighborhoodId: '', slaStatus: '', urgency: '', departmentId: '', dateFrom: '', dateTo: '' },
  notifications: [],
};

function getRoleLabel(role) {
  const map = { CITIZEN: 'Người dân', RECEPTION_OFFICER: 'Cán bộ tiếp nhận', PROCESSING_OFFICER: 'Cán bộ xử lý', APPROVER: 'Lãnh đạo', LEADER: 'Lãnh đạo', ADMIN: 'Quản trị viên' };
  return map[role] || role;
}

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ROLE: {
      const role = action.payload;
      const user = users.find(u => u.role === role) || state.currentUser;
      return { ...state, currentRole: role, currentUser: user, roleLabel: getRoleLabel(role) };
    }
    case ACTIONS.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };

    case ACTIONS.ADD_COMPLAINT: {
      const newComplaint = action.payload;
      return { ...state, complaints: [newComplaint, ...state.complaints] };
    }

    case ACTIONS.UPDATE_COMPLAINT: {
      const { id, changes } = action.payload;
      return {
        ...state,
        complaints: state.complaints.map(c => c.id === id ? { ...c, ...changes, updatedAt: new Date().toISOString() } : c),
      };
    }

    case ACTIONS.ADD_HISTORY: {
      return { ...state, history: [...state.history, action.payload] };
    }

    case ACTIONS.ADD_EXTENSION: {
      return { ...state, extensions: [...state.extensions, action.payload] };
    }

    case ACTIONS.UPDATE_EXTENSION: {
      const { id, changes } = action.payload;
      return {
        ...state,
        extensions: state.extensions.map(e => e.id === id ? { ...e, ...changes } : e),
      };
    }

    case ACTIONS.ADD_ASSIGNMENT: {
      // deactivate old assignment
      const updatedAssignments = state.assignments.map(a =>
        a.complaintId === action.payload.complaintId ? { ...a, status: 'INACTIVE' } : a
      );
      return { ...state, assignments: [...updatedAssignments, action.payload] };
    }

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    default:
      return state;
  }
}

// ---- provider ----
export function MockProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const switchRole = useCallback((role) => {
    dispatch({ type: ACTIONS.SET_ROLE, payload: role });
  }, []);

  const addComplaint = useCallback((complaint) => {
    dispatch({ type: ACTIONS.ADD_COMPLAINT, payload: complaint });
  }, []);

  const updateComplaint = useCallback((id, changes) => {
    dispatch({ type: ACTIONS.UPDATE_COMPLAINT, payload: { id, changes } });
  }, []);

  const addHistory = useCallback((entry) => {
    dispatch({ type: ACTIONS.ADD_HISTORY, payload: entry });
  }, []);

  const addExtension = useCallback((ext) => {
    dispatch({ type: ACTIONS.ADD_EXTENSION, payload: ext });
  }, []);

  const updateExtension = useCallback((id, changes) => {
    dispatch({ type: ACTIONS.UPDATE_EXTENSION, payload: { id, changes } });
  }, []);

  const addAssignment = useCallback((asn) => {
    dispatch({ type: ACTIONS.ADD_ASSIGNMENT, payload: asn });
  }, []);

  const setFilters = useCallback((f) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: f });
  }, []);

  // ---- computed helpers ----
  const getFilteredComplaints = useCallback(() => {
    let list = state.complaints;
    const f = state.filters;
    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || (c.address && c.address.toLowerCase().includes(q)));
    }
    if (f.status) list = list.filter(c => c.status === f.status);
    if (f.categoryId) list = list.filter(c => c.categoryId === f.categoryId);
    if (f.neighborhoodId) list = list.filter(c => c.neighborhoodId === f.neighborhoodId);
    if (f.slaStatus) list = list.filter(c => c.slaStatus === f.slaStatus);
    if (f.urgency) list = list.filter(c => (c.confirmedUrgency || c.citizenUrgency) === f.urgency);
    if (f.departmentId) list = list.filter(c => c.assignedDepartmentId === f.departmentId);
    if (f.dateFrom) list = list.filter(c => new Date(c.createdAt) >= new Date(f.dateFrom));
    if (f.dateTo) list = list.filter(c => new Date(c.createdAt) <= new Date(f.dateTo + 'T23:59:59'));
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [state.complaints, state.filters]);

  const getDashboardStats = useCallback(() => {
    const all = state.complaints;
    const now = new Date();
    const today = all.filter(c => new Date(c.createdAt).toDateString() === now.toDateString());
    const inProgress = all.filter(c => c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING');
    const overdue = all.filter(c => c.slaStatus === 'OVERDUE');
    const nearDue = all.filter(c => c.slaStatus === 'NEAR_DUE');
    const completed = all.filter(c => c.status === 'COMPLETED');
    const completedOnTime = all.filter(c => c.slaStatus === 'COMPLETED_ON_TIME');
    const completedLate = all.filter(c => c.slaStatus === 'COMPLETED_LATE');
    const urgentPending = all.filter(c => (c.status !== 'COMPLETED' && c.status !== 'REJECTED') && (c.confirmedUrgency === 'URGENT' || c.citizenUrgency === 'URGENT'));
    const extensionPending = all.filter(c => c.status === 'EXTENSION_PENDING');

    return {
      total: all.length,
      todayCount: today.length,
      inProgressCount: inProgress.length,
      overdueCount: overdue.length,
      nearDueCount: nearDue.length,
      completedCount: completed.length,
      completedOnTimeCount: completedOnTime.length,
      completedLateCount: completedLate.length,
      urgentPendingCount: urgentPending.length,
      extensionPendingCount: extensionPending.length,
      onTimeRate: completed.length > 0 ? Math.round((completedOnTime.length / completed.length) * 100) : 100,
    };
  }, [state.complaints]);

  const getNeighborhoodStats = useCallback(() => {
    return state.neighborhoods.map(n => {
      const nc = state.complaints.filter(c => c.neighborhoodId === n.id);
      return {
        neighborhoodId: n.id,
        neighborhoodName: n.name,
        total: nc.length,
        urgent: nc.filter(c => (c.confirmedUrgency || c.citizenUrgency) === 'URGENT').length,
        inProgress: nc.filter(c => c.status === 'IN_PROGRESS' || c.status === 'EXTENSION_PENDING').length,
        completed: nc.filter(c => c.status === 'COMPLETED').length,
        overdue: nc.filter(c => c.slaStatus === 'OVERDUE' || c.slaStatus === 'COMPLETED_LATE').length,
        onTime: nc.filter(c => c.slaStatus === 'COMPLETED_ON_TIME' || (c.status !== 'COMPLETED' && c.slaStatus === 'ON_TIME')).length,
      };
    }).filter(x => x.total > 0);
  }, [state.complaints, state.neighborhoods]);

  const value = useMemo(() => ({
    ...state,
    switchRole,
    addComplaint,
    updateComplaint,
    addHistory,
    addExtension,
    updateExtension,
    addAssignment,
    setFilters,
    getFilteredComplaints,
    getDashboardStats,
    getNeighborhoodStats,
    // lookup helpers
    getUserById, getNeighborhoodById, getCategoryById, getDepartmentById,
    getComplaintById, getComplaintsByCitizen, getHistoryByComplaint,
    getExtensionsByComplaint, getAttachmentsByComplaint, getAssignmentByComplaint,
  }), [state, switchRole, addComplaint, updateComplaint, addHistory, addExtension, updateExtension, addAssignment, setFilters, getFilteredComplaints, getDashboardStats, getNeighborhoodStats]);

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock() {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('useMock must be inside MockProvider');
  return ctx;
}

export default MockContext;
