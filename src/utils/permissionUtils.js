
export const PERMISSION_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  UPDATE_STATUS: 'UPDATE_STATUS',
  GET: 'GET',
  GET_ALL: 'GET_ALL',
  GET_DETAIL: 'GET_DETAIL',
  GET_TEMPLATE: 'GET_TEMPLATE',
  GET_EXCEL: 'GET_EXCEL',
  UPLOAD: 'UPLOAD',
};

export const MODULE_PREFIXES = {
  PA: {
    prefix: 'PA',
    name: 'Phản ánh',
    routes: ['/reports']
  },
  TTIN: {
    prefix: 'TTIN',
    name: 'Tin tức',
    routes: ['/news']
  },
  DMTT: {
    prefix: 'DMTT',
    name: 'Danh mục tin tức',
    routes: ['/news']
  },
  TT: {
    prefix: 'TT',
    name: 'Thủ tục hành chính',
    routes: ['/procedures']
  },
  LVTTHC: {
    prefix: 'LVTTHC',
    name: 'Lĩnh vực thủ tục hành chính',
    routes: ['/procedures']
  },
  MD: {
    prefix: 'MD',
    name: 'Mẫu đơn',
    routes: ['/templates']
  },
  LTD: {
    prefix: 'LTD',
    name: 'Lịch tiếp dân',
    routes: ['/schedules']
  },
  RPT: {
    prefix: 'RPT',
    name: 'Báo cáo',
    routes: ['/statistics', '/report-areas']
  },
  ND: {
    prefix: 'ND',
    name: 'Người dùng',
    routes: ['/accounts']
  },
  ROLE: {
    prefix: 'ROLE',
    name: 'Vai trò',
    routes: ['/permissions']
  },
  PERM: {
    prefix: 'PERM',
    name: 'Quyền',
    routes: ['/permissions']
  },
  UB: {
    prefix: 'UB',
    name: 'Ủy ban',
    routes: ['/government']
  },
  CSV: {
    prefix: 'CSV',
    name: 'Cơ sở dịch vụ công',
    routes: ['/government']
  },
  LVPA: {
    prefix: 'LVPA',
    name: 'Lĩnh vực phản ánh',
    routes: ['/areas']
  },
  VID_PA: {
    prefix: 'VID_PA',
    name: 'Video phản ánh',
    routes: ['/reports']
  },
};


export const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.includes(requiredPermission);
};


export const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};


export const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.every(permission => userPermissions.includes(permission));
};


export const hasModuleAccess = (userPermissions, modulePrefix) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.some(permission => permission.startsWith(modulePrefix + '_'));
};


export const hasModulePermission = (userPermissions, modulePrefix, action) => {
  const permission = `${modulePrefix}_${action}`;
  return hasPermission(userPermissions, permission);
};


export const getModuleActions = (userPermissions, modulePrefix) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return [];
  }

  return userPermissions
    .filter(permission => permission.startsWith(modulePrefix + '_'))
    .map(permission => permission.replace(modulePrefix + '_', ''));
};


export const hasRouteAccess = (userPermissions, routePath) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }

  if (routePath === '/dashboard') {
    return true;
  }

  const moduleEntry = Object.values(MODULE_PREFIXES).find(module =>
    module.routes.some(route => routePath.startsWith(route))
  );

  if (!moduleEntry) {
    return false;
  }

  return hasModuleAccess(userPermissions, moduleEntry.prefix);
};


export const getAccessibleRoutes = (userPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return ['/dashboard'];
  }

  const accessibleRoutes = new Set(['/dashboard']);

  Object.values(MODULE_PREFIXES).forEach(module => {
    if (hasModuleAccess(userPermissions, module.prefix)) {
      module.routes.forEach(route => accessibleRoutes.add(route));
    }
  });

  return Array.from(accessibleRoutes);
};

export const buildPermission = (modulePrefix, action) => {
  return `${modulePrefix}_${action}`;
};

export const parsePermission = (permission) => {
  const parts = permission.split('_');
  if (parts.length < 2) {
    return null;
  }

  return {
    module: parts[0],
    action: parts.slice(1).join('_')
  };
};

export const groupPermissionsByModule = (permissions) => {
  if (!permissions || !Array.isArray(permissions)) {
    return {};
  }

  const grouped = {};

  permissions.forEach(permission => {
    const parsed = parsePermission(permission);
    if (parsed) {
      if (!grouped[parsed.module]) {
        grouped[parsed.module] = [];
      }
      grouped[parsed.module].push(parsed.action);
    }
  });

  return grouped;
};
