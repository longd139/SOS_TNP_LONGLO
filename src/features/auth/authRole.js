const ROLE_PRIORITY = [
  { appRole: 'ADMIN', backendRoles: ['ADMIN', 'QUAN_TRI_VIEN', 'SYSTEM_ADMIN'] },
  { appRole: 'LEADER', backendRoles: ['LANH_DAO', 'LEADER', 'APPROVER'] },
  { appRole: 'OFFICER', backendRoles: ['CHUYEN_VIEN', 'CAN_BO', 'OFFICER', 'RECEPTION_OFFICER', 'PROCESSING_OFFICER'] },
];

const normalizeRoles = (roles) => {
  if (Array.isArray(roles)) return roles;
  if (typeof roles === 'string') return roles.split(',');
  return [];
};

export const resolveAppRole = (tokenPayload = {}, fallback = 'CITIZEN') => {
  if (tokenPayload.role) return String(tokenPayload.role).trim().toUpperCase();

  const roles = normalizeRoles(tokenPayload.roles)
    .map((role) => String(role).trim().toUpperCase())
    .filter(Boolean);

  return ROLE_PRIORITY.find(({ backendRoles }) =>
    backendRoles.some((role) => roles.includes(role))
  )?.appRole || fallback;
};
