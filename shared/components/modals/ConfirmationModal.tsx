import React from 'react';

export const ConfirmationModal: React.FC<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirming?: boolean;
    confirmButtonVariant?: 'primary' | 'danger' | 'success';
    zIndex?: string;
}> = ({
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Да',
    cancelText = 'Нет',
    isConfirming = false,
    confirmButtonVariant = 'primary',
    zIndex = 'z-50'
}) => {
    const buttonColorClasses = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
        success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${zIndex} p-4`}>
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4 animate-fade-in-up">
                 <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                 <p className="text-sm text-gray-600 whitespace-pre-wrap">{message}</p>
                 <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onCancel} disabled={isConfirming} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex justify-center items-center whitespace-nowrap">
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isConfirming}
                        className={`px-4 py-2 text-sm font-medium rounded-md disabled:cursor-wait flex justify-center items-center whitespace-nowrap ${buttonColorClasses[confirmButtonVariant]}`}
                    >
                        {isConfirming ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};