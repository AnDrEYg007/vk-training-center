import React, { useState } from 'react';

// =====================================================================
// MockImageRibbon — лента превью изображений
// =====================================================================
interface MockImageRibbonProps {
    images: string[];
    onImageClick?: (index: number) => void;
}

export const MockImageRibbon: React.FC<MockImageRibbonProps> = ({ images, onImageClick }) => {
    if (images.length === 0) return null;

    return (
        <div className="overflow-hidden rounded-t-lg">
            <div className="flex space-x-2 p-2 bg-gray-100/70 border-b border-gray-200 overflow-x-auto custom-scrollbar">
                {images.map((url, idx) => (
                    <button
                        key={idx}
                        onClick={() => onImageClick?.(idx)}
                        className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                    >
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
};

// =====================================================================
// MockSuggestedPostCard — карточка предложенного поста
// =====================================================================
interface MockSuggestedPostCardProps {
    post: {
        author: string;
        date: string;
        text: string;
        link: string;
        images: string[];
    };
    isSelected?: boolean;
    onSelect: () => void;
}

export const MockSuggestedPostCard: React.FC<MockSuggestedPostCardProps> = ({ 
    post, 
    isSelected = false,
    onSelect 
}) => {
    const cardClasses = `bg-white rounded-lg border shadow-sm transition-all ${
        isSelected 
            ? 'border-indigo-500 ring-2 ring-indigo-300' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
    }`;

    return (
        <div className={cardClasses}>
            {post.images.length > 0 && <MockImageRibbon images={post.images} />}

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-gray-800 hover:text-indigo-600 truncate pr-2">
                            {post.author}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0">
                            {post.date}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{post.text}</p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-auto">
                    <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-indigo-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Посмотреть на VK
                    </a>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Редактор AI
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// MockAiEditor — панель AI-редактора
// =====================================================================
interface MockAiEditorProps {
    text: string;
    isLoading?: boolean;
    onTextChange: (text: string) => void;
}

export const MockAiEditor: React.FC<MockAiEditorProps> = ({ 
    text, 
    isLoading = false,
    onTextChange 
}) => {
    const [copyButtonText, setCopyButtonText] = useState('Копировать');

    const handleCopy = () => {
        setCopyButtonText('Скопировано!');
        setTimeout(() => setCopyButtonText('Копировать'), 2000);
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full p-4 items-center justify-center text-center">
                <div className="loader" style={{ width: '32px', height: '32px', borderTopColor: '#4f46e5' }}></div>
                <p className="mt-4 text-gray-600 text-sm font-medium">ИИ-помощник исправляет текст...</p>
                <p className="mt-1 text-xs text-gray-500">Это может занять несколько секунд</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col h-full p-4 space-y-3">
            <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                </svg>
                <h2 className="text-base font-semibold text-gray-700 ml-2">Исправленный текст AI</h2>
            </div>
            <textarea
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                className="w-full flex-grow border rounded p-3 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors custom-scrollbar"
                placeholder="Результат появится здесь..."
                rows={10}
            />
            <button
                onClick={handleCopy}
                disabled={!text.trim()}
                className={`w-full px-4 py-2 text-sm font-semibold rounded-md text-white disabled:bg-gray-400 transition-all ${
                    copyButtonText === 'Скопировано!' ? 'bg-teal-500' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {copyButtonText}
            </button>
        </div>
    );
};

// =====================================================================
// MockEmptyState — состояние пустоты
// =====================================================================
interface MockEmptyStateProps {
    type: 'empty' | 'error';
    title: string;
    message: string;
}

export const MockEmptyState: React.FC<MockEmptyStateProps> = ({ type, title, message }) => {
    const iconColor = type === 'error' ? 'text-red-300' : 'text-gray-300';
    const titleColor = type === 'error' ? 'text-red-600' : 'text-gray-700';

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-10 bg-white rounded-lg border border-gray-200 mt-4">
            {type === 'empty' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 ${iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )}
            <h3 className={`mt-4 font-semibold ${titleColor}`}>{title}</h3>
            <p className="text-sm mt-1 max-w-sm">{message}</p>
        </div>
    );
};

// =====================================================================
// MockAlertBox — алерт-бокс для ошибок и предупреждений
// =====================================================================
interface MockAlertBoxProps {
    type: 'warning' | 'info';
    title: string;
    message: string;
}

export const MockAlertBox: React.FC<MockAlertBoxProps> = ({ type, title, message }) => {
    const styles = type === 'warning' 
        ? {
            bg: 'bg-amber-100',
            border: 'border-l-4 border-amber-500',
            iconColor: 'text-amber-500',
            titleColor: 'text-amber-800'
          }
        : {
            bg: 'bg-blue-100',
            border: 'border-l-4 border-blue-500',
            iconColor: 'text-blue-500',
            titleColor: 'text-blue-800'
          };

    return (
        <div className={`${styles.bg} ${styles.border} rounded-r-lg p-4 mb-4 flex items-start`}>
            {type === 'warning' ? (
                <svg className={`h-6 w-6 ${styles.iconColor} mr-4 flex-shrink-0`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg className={`h-6 w-6 ${styles.iconColor} mr-4 flex-shrink-0`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
            )}
            <div>
                <h4 className={`font-semibold ${styles.titleColor}`}>{title}</h4>
                <p className="text-sm text-gray-700 mt-1">{message}</p>
            </div>
        </div>
    );
};
