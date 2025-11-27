import { useAuth } from '../contexts/AuthContext';
import {
  getModuleActions,
  buildPermission,
  groupPermissionsByModule,
  PERMISSION_ACTIONS
} from '../utils/permissionUtils';

export const usePermission = () => {
  const { auth, checkPermission, checkAnyPermission, checkAllPermissions,
    checkModuleAccess, checkModulePermission, checkRouteAccess,
    getAccessibleRoutes: getRoutes } = useAuth();

  const userPermissions = auth.permissions || [];

  return {
    permissions: userPermissions,
    groupedPermissions: groupPermissionsByModule(userPermissions),

    can: (permission) => checkPermission(permission),
    canAny: (permissions) => checkAnyPermission(permissions),
    canAll: (permissions) => checkAllPermissions(permissions),

    canAccessModule: (modulePrefix) => checkModuleAccess(modulePrefix),
    canDoAction: (modulePrefix, action) => checkModulePermission(modulePrefix, action),
    getActions: (modulePrefix) => getModuleActions(userPermissions, modulePrefix),

    canAccessRoute: (routePath) => checkRouteAccess(routePath),
    accessibleRoutes: getRoutes(),

    buildPermission: (modulePrefix, action) => buildPermission(modulePrefix, action),

    canCreate: (modulePrefix) => checkModulePermission(modulePrefix, PERMISSION_ACTIONS.CREATE),
    canUpdate: (modulePrefix) => checkModulePermission(modulePrefix, PERMISSION_ACTIONS.UPDATE),
    canDelete: (modulePrefix) => checkModulePermission(modulePrefix, PERMISSION_ACTIONS.DELETE),
    canView: (modulePrefix) => checkAnyPermission([
      buildPermission(modulePrefix, PERMISSION_ACTIONS.GET),
      buildPermission(modulePrefix, PERMISSION_ACTIONS.GET_ALL),
      buildPermission(modulePrefix, PERMISSION_ACTIONS.GET_DETAIL)
    ]),
    canUpdateStatus: (modulePrefix) => checkModulePermission(modulePrefix, PERMISSION_ACTIONS.UPDATE_STATUS),
  };
};

export default usePermission;
