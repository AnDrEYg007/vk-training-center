
import React, { useState, useEffect } from 'react';

interface NewPhotoCellProps {
    dataUrl?: string;
    onUrlChange: (url: string) => void;
    onClear: () => void;
}

/**
 * @fileoverview Компонент для отображения превью нового фото или поля для вставки ссылки.
 */
export const NewPhotoCell: React.FC<NewPhotoCellProps> = ({ dataUrl, onUrlChange, onClear }) => {
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Если dataUrl приходит извне (например, при выборе файла через ActionCell), обновляем инпут
    useEffect(() => {
        if (!dataUrl) {
            setInputValue('');
        }
    }, [dataUrl]);

    const handlePaste = async (e: React.ClipboardEvent) => {
        const pastedData = e.clipboardData.getData('text');
        if (pastedData && (pastedData.startsWith('http') || pastedData.startsWith('data:image'))) {
            e.preventDefault();
            validateAndSetUrl(pastedData);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            validateAndSetUrl(inputValue);
        }
    };

    const validateAndSetUrl = (url: string) => {
        if (!url.trim()) return;
        
        setIsLoading(true);
        const img = new Image();
        img.onload = () => {
            setIsLoading(false);
            onUrlChange(url);
            setInputValue(''); // Очищаем инпут, так как теперь показываем превью
        };
        img.onerror = () => {
            setIsLoading(false);
            window.showAppToast?.("Не удалось загрузить изображение по этой ссылке.", 'error');
        };
        img.src = url;
    };

    // Состояние загрузки изображения или файла
    if (isLoading) {
        return (
             <div className="h-14 w-14 flex items-center justify-center border border-gray-200 rounded bg-gray-50">
                <div className="loader h-5 w-5 border-2 border-gray-300 border-t-indigo-500"></div>
            </div>
        );
    }

    // Состояние: изображение загружено (показать превью)
    if (dataUrl) {
        return (
            <div 
                className="relative h-14 w-14 group"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={dataUrl} alt="Preview" className="h-14 w-14 object-cover rounded border border-indigo-200" />
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClear();
                    }}
                    className="absolute top-0.5 right-0.5 bg-white/90 text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50 hover:text-red-600 z-10 border border-gray-200"
                    title="Удалить фото"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        );
    }
    
    // Состояние: ничего не загружено (показать текстовое поле)
    return (
        <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={handleKeyDown}
            onBlur={() => { if(inputValue) validateAndSetUrl(inputValue); }}
            onClick={(e) => e.stopPropagation()}
            placeholder="URL фото"
            className="w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white transition-colors"
            title="Вставьте ссылку на фото и нажмите Enter"
        />
    );
};
