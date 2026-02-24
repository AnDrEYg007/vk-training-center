import React, { useState } from 'react';

// =====================================================================
// MOCK-КОМПОНЕНТЫ ДЛЯ РАЗДЕЛА "ТОВАРЫ"
// =====================================================================

// =====================================================================
// Интерфейсы и типы
// =====================================================================
interface MockProduct {
    id: number;
    title: string;
    description: string;
    price: number;
    oldPrice?: number;
    photo: string;
    album?: string;
    category?: string;
    sku?: string;
}

interface MockAlbum {
    id: number;
    title: string;
    count: number;
}

interface MockCategory {
    id: number;
    name: string;
    section: string;
}

// =====================================================================
// MockProductsHeader - шапка с кнопками и поиском
// =====================================================================
interface MockProductsHeaderProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onCreateClick?: () => void;
    onColumnsClick?: () => void;
    onRefreshClick?: () => void;
    selectedCount?: number;
    onBulkEditClick?: () => void;
    onBulkDeleteClick?: () => void;
}

export const MockProductsHeader: React.FC<MockProductsHeaderProps> = ({
    searchValue,
    onSearchChange,
    onCreateClick,
    onColumnsClick,
    onRefreshClick,
    selectedCount = 0,
    onBulkEditClick,
    onBulkDeleteClick
}) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white">
            {/* Первая строка: основные кнопки и поиск */}
            <div className="flex items-center gap-3 mb-3">
                {/* Кнопка "Колонки" */}
                <button
                    onClick={onColumnsClick}
                    className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Колонки
                </button>

                {/* Кнопка "Обновить категории" */}
                <button
                    onClick={onRefreshClick}
                    className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>

                {/* Кнопка "Создать товар" */}
                <button
                    onClick={onCreateClick}
                    className="inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 shadow-sm whitespace-nowrap"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Создать товар
                </button>

                {/* Поле поиска */}
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Поиск по всем полям..."
                        className="w-full px-3 h-10 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Панель массовых действий (показывается при selectedCount > 0) */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
                    selectedCount > 0 ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <span className="text-sm text-gray-600 mr-3">
                    Выбрано товаров: <span className="font-semibold">{selectedCount}</span>
                </span>
                <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                    <button
                        onClick={onBulkEditClick}
                        className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                    >
                        Изменить
                    </button>
                    <button
                        onClick={onBulkDeleteClick}
                        className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 whitespace-nowrap"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// MockAlbumFilters - фильтры по подборкам
// =====================================================================
interface MockAlbumFiltersProps {
    albums: MockAlbum[];
    activeAlbumId: number | null;
    onAlbumSelect: (albumId: number | null) => void;
    onCreateAlbum?: () => void;
}

export const MockAlbumFilters: React.FC<MockAlbumFiltersProps> = ({
    albums,
    activeAlbumId,
    onAlbumSelect,
    onCreateAlbum
}) => {
    return (
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
                {/* Кнопка "Все товары" */}
                <button
                    onClick={() => onAlbumSelect(null)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border whitespace-nowrap ${
                        activeAlbumId === null
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Все товары
                </button>

                {/* Кнопки подборок */}
                {albums.map((album) => (
                    <button
                        key={album.id}
                        onClick={() => onAlbumSelect(album.id)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border whitespace-nowrap ${
                            activeAlbumId === album.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {album.title} ({album.count})
                    </button>
                ))}

                {/* Кнопка "+ Создать подборку" */}
                <button
                    onClick={onCreateAlbum}
                    className="px-3 py-1.5 text-sm font-medium border-2 border-dashed rounded-md transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50 whitespace-nowrap"
                >
                    + Создать подборку
                </button>
            </div>
        </div>
    );
};

// =====================================================================
// MockProductRow - строка товара в таблице
// =====================================================================
interface MockProductRowProps {
    product: MockProduct;
    isSelected: boolean;
    onSelect: (selected: boolean) => void;
    onChange?: (field: string, value: any) => void;
    onSave?: () => void;
    onDelete?: () => void;
    isDirty?: boolean;
    hasError?: boolean;
    showNewPhoto?: boolean;
    aiSuggestion?: string;
}

export const MockProductRow: React.FC<MockProductRowProps> = ({
    product,
    isSelected,
    onSelect,
    onChange,
    onSave,
    onDelete,
    isDirty = false,
    hasError = false,
    showNewPhoto = false,
    aiSuggestion
}) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <tr className={`border-b border-gray-200 hover:bg-gray-50 ${hasError ? 'bg-red-50' : ''}`}>
            {/* Чекбокс */}
            <td className="px-4 py-2 whitespace-nowrap">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
            </td>

            {/* Действия */}
            <td className="px-4 py-2 whitespace-nowrap">
                <div className="grid grid-cols-2 gap-1 w-fit">
                    {/* Сохранить */}
                    <button
                        onClick={onSave}
                        disabled={!isDirty}
                        className={`flex items-center justify-center h-9 aspect-square p-1 border border-gray-300 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isDirty ? 'text-green-600 hover:bg-green-100' : 'text-gray-400'
                        }`}
                        title="Сохранить изменения"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>

                    {/* Обновить фото */}
                    <button
                        className="flex items-center justify-center h-9 aspect-square p-1 border border-gray-300 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        title="Обновить фото"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>

                    {/* Копировать */}
                    <button
                        className="flex items-center justify-center h-9 aspect-square p-1 border border-gray-300 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        title="Копировать товар"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>

                    {/* Удалить */}
                    <button
                        onClick={onDelete}
                        className="flex items-center justify-center h-9 aspect-square p-1 border border-gray-300 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        title="Удалить товар"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>

            {/* Текущее фото */}
            <td className="px-4 py-2">
                <img src={product.photo} alt={product.title} className="w-16 h-16 object-cover rounded-md border border-gray-300" />
            </td>

            {/* Новое фото (если показываем) */}
            {showNewPhoto && (
                <td className="px-4 py-2">
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 text-xs">
                        Нет
                    </div>
                </td>
            )}

            {/* Название */}
            <td className="px-4 py-2">
                <input
                    type="text"
                    value={product.title}
                    onChange={(e) => onChange?.('title', e.target.value)}
                    className={`w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                        hasError ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                    style={{ minWidth: '200px' }}
                />
            </td>

            {/* Описание */}
            <td className="px-4 py-2">
                <div className="relative group">
                    <textarea
                        value={product.description}
                        onChange={(e) => onChange?.('description', e.target.value)}
                        rows={isDescriptionExpanded ? 8 : 3}
                        className={`w-full p-1 border rounded-md focus:outline-none focus:ring-2 text-sm bg-white custom-scrollbar ${
                            hasError ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                        style={{ minWidth: '250px' }}
                    />
                    {/* Кнопка свернуть/развернуть */}
                    {isDescriptionExpanded && (
                        <button
                            onClick={() => setIsDescriptionExpanded(false)}
                            className="absolute bottom-3 right-3 p-1 text-gray-400 hover:text-gray-700 rounded-full bg-white/50 hover:bg-gray-200 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                    )}
                    {!isDescriptionExpanded && (
                        <button
                            onClick={() => setIsDescriptionExpanded(true)}
                            className="absolute bottom-1 right-1 p-1 text-gray-400 hover:text-gray-700 rounded-full bg-white/50 hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            ↕
                        </button>
                    )}
                    {/* Кнопка AI */}
                    <div className="absolute top-1 right-1 flex gap-1">
                        <button
                            className={`p-1 border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-8 w-8 flex items-center justify-center ${
                                hasError
                                    ? 'border-red-500 bg-red-50 text-red-500'
                                    : 'border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                            title="AI-коррекция описания"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </button>
                        {aiSuggestion && (
                            <button
                                className="p-1 border border-green-500 bg-green-50 text-green-600 rounded-md transition-colors hover:bg-green-100 flex-shrink-0 h-8 w-8 flex items-center justify-center"
                                title="Применить AI-предложение"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </td>

            {/* Цена */}
            <td className="px-4 py-2">
                <input
                    type="number"
                    value={product.price}
                    onChange={(e) => onChange?.('price', parseFloat(e.target.value))}
                    className={`w-24 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                        hasError ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                    }`}
                />
            </td>

            {/* Старая цена */}
            <td className="px-4 py-2">
                <input
                    type="number"
                    value={product.oldPrice || ''}
                    onChange={(e) => onChange?.('oldPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="—"
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </td>

            {/* Подборка */}
            <td className="px-4 py-2">
                <select
                    value={product.album || ''}
                    onChange={(e) => onChange?.('album', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ minWidth: '150px' }}
                >
                    <option value="">Без подборки</option>
                    <option value="Новинки">Новинки</option>
                    <option value="Акции">Акции</option>
                    <option value="Хиты продаж">Хиты продаж</option>
                </select>
            </td>

            {/* Категория */}
            <td className="px-4 py-2">
                <div className="flex items-center gap-1">
                    <select
                        value={product.category || ''}
                        onChange={(e) => onChange?.('category', e.target.value)}
                        className={`flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 ${
                            hasError ? 'border-red-500 bg-red-50 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'
                        }`}
                        style={{ minWidth: '150px' }}
                    >
                        <option value="">Не выбрана</option>
                        <option value="Одежда">Одежда</option>
                        <option value="Обувь">Обувь</option>
                        <option value="Аксессуары">Аксессуары</option>
                    </select>
                    {/* Кнопка AI */}
                    <button
                        className={`p-1 border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            hasError
                                ? 'border-red-500 bg-red-50 text-red-500'
                                : 'border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                        title="AI-подбор категории"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </button>
                </div>
            </td>

            {/* Артикул */}
            <td className="px-4 py-2">
                <input
                    type="text"
                    value={product.sku || ''}
                    onChange={(e) => onChange?.('sku', e.target.value)}
                    placeholder="—"
                    className="w-32 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </td>

            {/* Ссылка на VK */}
            <td className="px-4 py-2 text-center">
                <a
                    href={`https://vk.com/market-123456789_${product.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </td>
        </tr>
    );
};

// =====================================================================
// MockDiffViewer - визуализация изменений текста
// =====================================================================
interface MockDiffViewerProps {
    oldText: string;
    newText: string;
}

export const MockDiffViewer: React.FC<MockDiffViewerProps> = ({ oldText, newText }) => {
    // Простая визуализация без сложного алгоритма
    const renderDiff = () => {
        if (oldText === newText) {
            return <span>{oldText}</span>;
        }
        return (
            <>
                <span className="bg-red-100 text-red-800 rounded line-through px-0.5">{oldText}</span>
                {' → '}
                <span className="bg-green-100 text-green-800 rounded px-0.5">{newText}</span>
            </>
        );
    };

    return (
        <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm whitespace-pre-wrap leading-normal custom-scrollbar max-h-40 overflow-y-auto">
            {renderDiff()}
        </div>
    );
};

// =====================================================================
// MockSaveResultsModal - результаты сохранения
// =====================================================================
interface MockSaveResultsModalProps {
    successCount: number;
    errors: Array<{ product: string; error: string }>;
    onClose: () => void;
}

export const MockSaveResultsModal: React.FC<MockSaveResultsModalProps> = ({
    successCount,
    errors,
    onClose
}) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Заголовок */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">Результат сохранения</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Контент */}
                <div className="px-6 py-4 overflow-y-auto custom-scrollbar">
                    {/* Успешно сохранено */}
                    {successCount > 0 && (
                        <div className="p-4 rounded-lg flex items-start gap-3 bg-green-50 border border-green-100 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <div>
                                <p className="font-medium text-green-900">
                                    Успешно сохранено: {successCount} {successCount === 1 ? 'товар' : 'товаров'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Ошибки */}
                    {errors.length > 0 && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                            <div className="flex items-start gap-3 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <div className="flex-1">
                                    <p className="font-medium text-red-900 mb-2">
                                        Ошибки при сохранении: {errors.length} {errors.length === 1 ? 'товар' : 'товаров'}
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        {errors.map((error, idx) => (
                                            <li key={idx} className="text-red-700">
                                                <span className="font-medium">{error.product}:</span> {error.error}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Кнопка закрытия */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Экспортируемые mock-данные
// =====================================================================
export const mockAlbums: MockAlbum[] = [
    { id: 1, title: 'Новинки', count: 12 },
    { id: 2, title: 'Акции', count: 8 },
    { id: 3, title: 'Хиты продаж', count: 15 }
];

export const mockProducts: MockProduct[] = [
    {
        id: 1,
        title: 'Футболка с принтом',
        description: 'Яркая футболка из хлопка с авторским принтом',
        price: 1200,
        oldPrice: 1500,
        photo: 'https://picsum.photos/seed/product1/200/200',
        album: 'Новинки',
        category: 'Одежда',
        sku: 'TSH-001'
    },
    {
        id: 2,
        title: 'Джинсы классические',
        description: 'Удобные джинсы прямого кроя, универсальная модель на каждый день',
        price: 2800,
        photo: 'https://picsum.photos/seed/product2/200/200',
        album: 'Хиты продаж',
        category: 'Одежда',
        sku: 'JNS-045'
    },
    {
        id: 3,
        title: 'Кроссовки спортивные',
        description: 'Легкие кроссовки для бега и фитнеса',
        price: 4500,
        oldPrice: 5200,
        photo: 'https://picsum.photos/seed/product3/200/200',
        album: 'Акции',
        category: 'Обувь',
        sku: 'SHO-123'
    }
];
