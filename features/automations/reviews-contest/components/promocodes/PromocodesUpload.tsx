
import React from 'react';

interface PromocodesUploadProps {
    inputCodes: string;
    onInputChange: (value: string) => void;
    onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onAdd: () => void;
    isSaving: boolean;
    error: string | null;
}

export const PromocodesUpload: React.FC<PromocodesUploadProps> = ({
    inputCodes,
    onInputChange,
    onPaste,
    onAdd,
    isSaving,
    error
}) => {
    return (
        <div className="w-1/3 bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col h-[calc(100vh-250px)]">
            <h3 className="font-semibold text-gray-800 mb-2">Загрузка кодов</h3>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">Формат загрузки:</p>
                <p className="font-mono bg-white/50 p-1 rounded mb-1">КОД | ОПИСАНИЕ ПРИЗА</p>
                <p>Каждая пара с новой строки. Описание будет использовано в переменной <code>{'{description}'}</code>.</p>
                <p className="mt-2 text-blue-600 italic">💡 Совет: Вы можете скопировать два столбца прямо из Excel и вставить сюда — формат исправится автоматически.</p>
            </div>
            <textarea 
                value={inputCodes}
                onChange={(e) => onInputChange(e.target.value)}
                onPaste={onPaste}
                disabled={isSaving}
                className="w-full flex-grow border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 custom-scrollbar font-mono resize-none disabled:bg-gray-100 transition-shadow"
                placeholder="PROMO123 | Скидка 500р&#10;PROMO456 | Сет роллов&#10;WIN_777 | Пицца в подарок"
            ></textarea>
            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
            <button 
                onClick={onAdd}
                disabled={!inputCodes.trim() || isSaving}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm flex-shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed flex justify-center items-center"
            >
                {isSaving ? <div className="loader h-4 w-4 border-2 border-white border-t-transparent"></div> : 'Загрузить в базу'}
            </button>
        </div>
    );
};
