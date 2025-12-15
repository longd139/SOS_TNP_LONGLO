export const showConfirm = (message) => {
    try {
        return window.confirm(message);
    } catch (e) {
        return false;
    }
};
