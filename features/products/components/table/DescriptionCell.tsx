
import React, { useState, useRef } from 'react';
import { DiffViewer } from '../DiffViewer';

/**
 * @fileoverview Компонент для ячейки с описанием товара.
 * Инкапсулирует логику автоматического расширения textarea при фокусе,
 * сворачивания по кнопке и интеграцию с AI для коррекции.
 */
export const DescriptionCell: React.FC<{
    value: string;
    onChange: (value: string) => void;
    onAiCorrect: () => Promise<string | null>;
    error?: boolean; // Новый проп
}> = ({ value, onChange, onAiCorrect, error }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Состояния для AI
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedText, setSuggestedText] = useState<string | null>(null);

    // Обработчик фокуса: расширяет поле и подгоняет высоту под контент
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
        if (!isExpanded) {
            setIsExpanded(true);
            const textarea = e.currentTarget;
            requestAnimationFrame(() => {
                textarea.style.height = 'auto';
                textarea.style.height = `${textarea.scrollHeight + 2}px`;
            });
        }
    };

    // Обработчик изменения: обновляет значение и подгоняет высоту
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        if (isExpanded) {
            const textarea = e.currentTarget;
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + 2}px`;
        }
    };

    // Функция для сворачивания поля
    const collapse = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = ''; 
        }
        setIsExpanded(false);
        // При сворачивании также сбрасываем режим AI
        setSuggestedText(null);
    };

    const handleAiClick = async () => {
        if (isLoading) return;
        setIsLoading(true);
        setSuggestedText(null); // Сброс перед новым запросом
        try {
            const result = await onAiCorrect();
            if (result) {
                setSuggestedText(result);
                // Автоматически разворачиваем, чтобы показать результат
                if (!isExpanded && textareaRef.current) {
                     handleFocus({ currentTarget: textareaRef.current } as any);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyAi = () => {
        if (suggestedText) {
            onChange(suggestedText);
            setSuggestedText(null);
        }
    };

    const handleCancelAi = () => {
        setSuggestedText(null);
    };

    const borderClass = error 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500';

    return (
        <div className="flex flex-col w-full">
            {/* Верхняя часть: Поле ввода и кнопка вызова AI */}
            <div className="flex items-start gap-1 w-full">
                <div className="relative group flex-grow">
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        rows={isExpanded ? undefined : 3}
                        className={`w-full p-1 border rounded-md focus:outline-none focus:ring-2 text-sm bg-white custom-scrollbar ${borderClass}`}
                        style={{
                            resize: isExpanded ? 'none' : 'vertical',
                        }}
                    />
                    {isExpanded && (
                        <button
                            type="button"
                            onClick={collapse}
                            className="absolute bottom-3 right-3 p-1 text-gray-400 hover:text-gray-700 rounded-full bg-white/50 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                            title="Свернуть"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    )}
                </div>
                
                {/* Кнопка AI: всегда видна, чтобы избежать скачка макета, но блокируется при наличии результата */}
                <button
                    type="button"
                    onClick={handleAiClick}
                    disabled={isLoading || !!suggestedText}
                    title="Исправить ошибки с помощью AI"
                    className="p-1 border border-gray-300 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-8 w-8 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Нижняя часть: Результат AI */}
            {suggestedText && (
                <div className="flex items-start gap-1 w-full mt-1 animate-fade-in-up">
                    <div className="flex-grow min-w-0 border border-gray-300 rounded-md bg-white overflow-hidden relative">
                         <DiffViewer oldText={value} newText={suggestedText} className="max-h-60 overflow-y-auto border-none bg-white p-1"/>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        <button
                            onClick={handleApplyAi}
                            title="Применить"
                            className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-md border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        <button
                            onClick={handleAiClick}
                            disabled={isLoading}
                            title="Перегенерировать"
                            className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm disabled:opacity-50"
                        >
                             {isLoading ? (
                                <div className="loader h-4 w-4 border-2 border-blue-500 border-t-transparent mx-auto"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={handleCancelAi}
                            title="Отмена"
                            className="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
