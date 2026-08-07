import ROUTE_PATH from "../constants/routes";

const menuItems = [
    { id: 'overview', path: ROUTE_PATH.DASHBOARD, disabled: false },
    { id: 'reports', path: ROUTE_PATH.REPORT, disabled: false },
    { id: 'news', path: ROUTE_PATH.NEWS, disabled: false },
    { id: 'procedures', path: ROUTE_PATH.PROCEDURES, disabled: false },
    { id: 'templates', path: ROUTE_PATH.TEMPLATES, disabled: false },
    { id: 'contact', path: ROUTE_PATH.CONTACT, disabled: false },
    { id: 'schedule', path: ROUTE_PATH.SCHEDULES, disabled: false },
    { id: 'statistics', path: ROUTE_PATH.STATISTICS, disabled: false },
    { id: 'accounts', path: ROUTE_PATH.ACCOUNTS, disabled: false },
    { id: 'roles', path: ROUTE_PATH.ROLES, disabled: false },
    { id: 'permissions', path: ROUTE_PATH.PERMISSIONS, disabled: false },
    { id: 'auditLogs', path: ROUTE_PATH.AUDIT_LOG, disabled: false },
    { id: 'areas', path: ROUTE_PATH.AREAS, disabled: false },
    { id: 'government', path: ROUTE_PATH.GOVERNMENT, disabled: false },
    { id: 'categoryNews', path: ROUTE_PATH.CATEGORY_NEWS, disabled: false },
    { id: 'reportAreas', path: ROUTE_PATH.REPORT_AREAS, disabled: false },
    { id: 'appStatistics', path: ROUTE_PATH.APP_STATISTICS, disabled: false },
];

export const getDefaultEnabledRoute = () => {
    const enabledItem = menuItems.find(item => !item.disabled);
    return enabledItem ? enabledItem.path : '/procedures'; 
};

export const isPathDisabled = (path) => {
    const item = menuItems.find(item => item.path === path);
    return item?.disabled || false;
};

export const getRedirectPathIfDisabled = (currentPath) => {
    if (isPathDisabled(currentPath)) {
        return getDefaultEnabledRoute();
    }
    return currentPath;
};

export const getDisabledRoutes = () => {
    return menuItems.filter(item => item.disabled).map(item => item.path);
};

export const getEnabledRoutes = () => {
    return menuItems.filter(item => !item.disabled).map(item => item.path);
};
