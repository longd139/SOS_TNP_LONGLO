import React from 'react';
import PropTypes from 'prop-types';
import { usePermission } from '../hooks/usePermission';

export const PermissionGuard = ({
  permission,
  permissions,
  requireAll = false,
  modulePrefix,
  action,
  fallback = null,
  children
}) => {
  const { can, canAny, canAll, canDoAction } = usePermission();

  let hasAccess = false;

  if (modulePrefix && action) {
    hasAccess = canDoAction(modulePrefix, action);
  }
  else if (permission) {
    hasAccess = can(permission);
  }
  else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }
  else {
    hasAccess = true;
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};

PermissionGuard.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  modulePrefix: PropTypes.string,
  action: PropTypes.string,
  fallback: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export const withPermission = (Component, permissionConfig) => {
  const WrappedComponent = (props) => {
    return (
      <PermissionGuard {...permissionConfig}>
        <Component {...props} />
      </PermissionGuard>
    );
  };

  WrappedComponent.displayName = `withPermission(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
};

export const PermissionButton = ({
  permission,
  permissions,
  requireAll = false,
  modulePrefix,
  action,
  children,
  disabled = false,
  disabledTooltip = 'Bạn không có quyền thực hiện hành động này',
  ...buttonProps
}) => {
  const { can, canAny, canAll, canDoAction } = usePermission();

  let hasAccess = false;

  if (modulePrefix && action) {
    hasAccess = canDoAction(modulePrefix, action);
  } else if (permission) {
    hasAccess = can(permission);
  } else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  } else {
    hasAccess = true;
  }

  const isDisabled = disabled || !hasAccess;

  return (
    <button
      {...buttonProps}
      disabled={isDisabled}
      title={!hasAccess ? disabledTooltip : buttonProps.title}
      className={`
                ${buttonProps.className || ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
    >
      {children}
    </button>
  );
};

PermissionButton.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  modulePrefix: PropTypes.string,
  action: PropTypes.string,
  disabled: PropTypes.bool,
  disabledTooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
};

export const PermissionHidden = ({
  permission,
  permissions,
  requireAll = false,
  modulePrefix,
  action,
  children
}) => {
  return (
    <PermissionGuard
      permission={permission}
      permissions={permissions}
      requireAll={requireAll}
      modulePrefix={modulePrefix}
      action={action}
      fallback={null}
    >
      {children}
    </PermissionGuard>
  );
};

PermissionHidden.propTypes = {
  permission: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
  requireAll: PropTypes.bool,
  modulePrefix: PropTypes.string,
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default PermissionGuard;
