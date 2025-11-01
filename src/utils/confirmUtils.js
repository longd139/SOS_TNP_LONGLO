export const showConfirm = (message) => {
    try {
        return window.confirm(message);
    } catch (e) {
        console.error('showConfirm error:', e);
        return false;
    }
};
