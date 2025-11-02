const menuItems = [
    { id: 'overview', path: '/dashboard', disabled: true },
    { id: 'reports', path: '/reports', disabled: true },
    { id: 'news', path: '/news', disabled: true },
    { id: 'procedures', path: '/procedures', disabled: false },
    { id: 'templates', path: '/templates', disabled: false },
    { id: 'contact', path: '/contact', disabled: false },
    { id: 'schedule', path: '/schedules', disabled: true },
    { id: 'statistics', path: '/statistics', disabled: true },
    { id: 'accounts', path: '/accounts', disabled: true }
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
