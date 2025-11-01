import React, { useEffect } from 'react';

const BaseModal = ({
    isOpen = false,
    onClose,
    title = "",
    children,
    footer = null,
    size = "md",
    showCloseButton = true,
    closeOnOverlay = true,
    className = ""
}) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl"
    };

    const handleOverlayClick = (e) => {
        if (closeOnOverlay && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="flex items-center justify-center min-h-screen pt-3 px-3 pb-16 text-center sm:block sm:p-0"
                onClick={handleOverlayClick}
            >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                <div className={`
          inline-block align-bottom bg-white rounded-lg text-left shadow-xl transform transition-all overflow-visible
          sm:my-8 sm:align-middle sm:w-full ${sizeClasses[size]} ${className}
        `}>
                    {(title || showCloseButton) && (
                        <div className="bg-white px-3 pt-4 pb-3 sm:p-4 sm:pb-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                {title && (
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {title}
                                    </h3>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white px-3 pt-4 pb-3 sm:p-4">
                        {children}
                    </div>

                    {footer && (
                        <div className="bg-gray-50 px-3 py-2 sm:px-4 sm:flex sm:flex-row-reverse border-t border-gray-200">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ModalFooter = ({
    onCancel,
    onSubmit,
    cancelText = "Hủy",
    submitText = "Xác nhận",
    submitDisabled = false,
    submitLoading = false,
    submitType = "primary"
}) => {
    const submitButtonClass = {
        primary: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
        danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500"
    };

    return (
        <>
            <button
                type="button"
                onClick={onSubmit}
                disabled={submitDisabled || submitLoading}
                className={`
          w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 
          text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 
          sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed
          ${submitButtonClass[submitType]}
        `}
            >
                {submitLoading ? (
                    <div className="flex items-center">
                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Đang xử lý...
                    </div>
                ) : (
                    submitText
                )}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
                {cancelText}
            </button>
        </>
    );
};

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Xác nhận",
    message = "Bạn có chắc chắn muốn thực hiện hành động này?",
    confirmText = "Xác nhận",
    cancelText = "Hủy",
    type = "danger"
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
            footer={
                <ModalFooter
                    onCancel={onClose}
                    onSubmit={onConfirm}
                    cancelText={cancelText}
                    submitText={confirmText}
                    submitType={type}
                />
            }
        >
            <div className="text-center">
                <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${type === 'danger' ? 'bg-red-100' : 'bg-blue-100'
                    } mb-4`}>
                    {type === 'danger' ? (
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    ) : (
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <p className="text-sm text-gray-500">{message}</p>
            </div>
        </BaseModal>
    );
};

export default BaseModal;