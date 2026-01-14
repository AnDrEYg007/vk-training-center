import React, { useRef } from 'react';

/**
 * @fileoverview Компонент, отвечающий за отображение ячейки с кнопками действий в виде иконок.
 */
export const ActionCell: React.FC<{
    isDirty: boolean;
    isSavingAll: boolean;
    isMarkedForDeletion: boolean;
    onSave: () => void;
    onSelectFile: (file: File) => void;
    onToggleDeletion: () => void;
    onCopy: () => void; // Новый проп
}> = ({ isDirty, isSavingAll, isMarkedForDeletion, onSave, onSelectFile, onToggleDeletion, onCopy }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onSelectFile(file);
        }
        if (e.target) e.target.value = '';
    };

    // ИЗМЕНЕНИЕ: Добавлены классы для центрирования и сохранения квадратной формы
    const baseButtonClass = "flex items-center justify-center h-9 aspect-square p-1 border border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    const iconSize = "h-5 w-5";

    const deleteButtonClasses = `${baseButtonClass} ${
        isMarkedForDeletion
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
    }`;
    
    return (
        // ИЗМЕНЕНИЕ: `w-24` заменен на `w-fit` чтобы контейнер подстраивался под размер кнопок
        <div className="grid grid-cols-2 gap-1 w-fit">
             <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
            />
            {/* Кнопка Сохранить */}
            <button
                onClick={onSave}
                disabled={!isDirty || isSavingAll || isMarkedForDeletion}
                className={`${baseButtonClass} text-green-600 hover:bg-green-100 disabled:text-gray-400 disabled:hover:bg-transparent`}
                title="Сохранить"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </button>
            {/* Кнопка Обновить фото */}
             <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isSavingAll || isMarkedForDeletion}
                className={`${baseButtonClass} text-gray-500 hover:bg-gray-100 hover:text-gray-800`}
                title="Обновить фото"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {/* Новая кнопка Копировать */}
            <button
                onClick={onCopy}
                disabled={isSavingAll}
                className={`${baseButtonClass} text-gray-500 hover:bg-gray-100 hover:text-gray-800`}
                title="Копировать товар"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            </button>
            {/* Кнопка Удалить */}
            <button
                onClick={onToggleDeletion}
                disabled={isSavingAll}
                className={deleteButtonClasses}
                title={isMarkedForDeletion ? "Отменить удаление" : "Пометить на удаление"}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};