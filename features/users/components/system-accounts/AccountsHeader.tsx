
import React from 'react';

interface AccountsHeaderProps {
    isCheckingTokens: boolean;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    hasChanges: boolean;
    onCheckTokens: () => void;
    onAdd: () => void;
    onSave: () => void;
}

export const AccountsHeader: React.FC<AccountsHeaderProps> = ({
    isCheckingTokens,
    isLoading,
    isSaving,
    error,
    hasChanges,
    onCheckTokens,
    onAdd,
    onSave
}) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                 <button
                    onClick={onCheckTokens}
                    disabled={isCheckingTokens || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                >
                    {isCheckingTokens ? (
                        <>
                            <div className="loader w-4 h-4 border-2 border-gray-500 border-t-transparent mr-2"></div>
                            Проверка...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Проверка токенов
                        </>
                    )}
                </button>
                {error && <span className="text-red-600 text-sm">{error}</span>}
            </div>
            <div className="flex gap-3">
                <button
                    onClick={onAdd}
                    disabled={isSaving || isLoading}
                    className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить списком
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving || !hasChanges}
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center min-w-[100px]"
                >
                    {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                </button>
            </div>
        </div>
    );
};
