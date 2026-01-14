
import React from 'react';

interface AiTokensHeaderProps {
    onAdd: () => void;
    onSave: () => void;
    isSaving: boolean;
}

export const AiTokensHeader: React.FC<AiTokensHeaderProps> = ({ onAdd, onSave, isSaving }) => {
    return (
        <div className="p-4 border-b border-gray-200 flex justify-end items-center gap-4 bg-white">
            <button
                onClick={onAdd}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 disabled:opacity-50 whitespace-nowrap"
            >
                + Добавить токен
            </button>
            <button
                onClick={onSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex justify-center items-center whitespace-nowrap"
            >
                {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить все'}
            </button>
        </div>
    );
};
