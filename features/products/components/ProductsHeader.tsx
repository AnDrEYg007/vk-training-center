
import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../../shared/types';
// FIX: Changed import source for PRODUCT_COLUMNS from './ProductsTab' to '../hooks/useColumnManager'
import { PRODUCT_COLUMNS as ColumnDefinition } from '../hooks/useColumnManager';

interface ProductsHeaderProps {
    project: Project;
    isLoading: boolean;
    isDirty: boolean;
    isSaving: boolean;
    onRefreshAll: () => void;
    onSaveAll: (confirmed?: boolean) => void;
    // Props for visibility dropdown
    isVisibilityDropdownOpen: boolean;
    toggleVisibilityDropdown: () => void;
    visibilityDropdownRef: React.RefObject<HTMLDivElement>;
    columns: typeof ColumnDefinition;
    visibleColumns: Record<string, boolean>;
    onToggleColumnVisibility: (key: string) => void;
    onShowAllColumns: () => void;
    onHideAllColumns: () => void;
    // Новые пропсы для выбора
    isSelectionMode: boolean;
    selectedCount: number;
    onToggleSelectionMode: () => void;
    onClearSelection: () => void;
    onInitiateBulkDelete: () => void;
    onBulkEditClick: () => void;
    bulkEditButtonRef: React.RefObject<HTMLButtonElement>;
    onSelectAllVisible: () => void; // Новая пропса
    // FIX: Add props for search functionality to resolve the type error.
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    // Новые пропсы для создания товаров
    onOpenCreateSingleModal: () => void;
    onOpenCreateMultipleModal: () => void;
    onDownloadCsv: () => void;
    onDownloadXlsx: () => void;
    onFileUpload: (file: File) => void;
    // Новые пропсы для обновления категорий
    onRefreshCategories: () => void;
    isRefreshingCategories: boolean;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
    project, isLoading, isDirty, isSaving, onRefreshAll, onSaveAll,
    isVisibilityDropdownOpen, toggleVisibilityDropdown, visibilityDropdownRef,
    columns, visibleColumns, onToggleColumnVisibility, onShowAllColumns, onHideAllColumns,
    isSelectionMode, selectedCount, onToggleSelectionMode, onClearSelection,
    onInitiateBulkDelete, onBulkEditClick, bulkEditButtonRef, onSelectAllVisible,
    // FIX: Destructure the new search props.
    searchQuery, setSearchQuery,
    onOpenCreateSingleModal, onOpenCreateMultipleModal,
    onDownloadCsv, onDownloadXlsx, onFileUpload,
    onRefreshCategories, isRefreshingCategories
}) => {
    const [isCreateOptionsOpen, setIsCreateOptionsOpen] = useState(false);
    const createContainerRef = useRef<HTMLDivElement>(null);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (createContainerRef.current && !createContainerRef.current.contains(event.target as Node)) {
                setIsCreateOptionsOpen(false);
            }
            if (downloadRef.current && !downloadRef.current.contains(event.target as Node)) {
                setIsDownloadOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
        // Сбрасываем значение, чтобы можно было выбрать тот же файл снова
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleCreateSelect = (type: 'single' | 'multiple') => {
        if (type === 'single') {
            onOpenCreateSingleModal();
        } else {
            onOpenCreateMultipleModal();
        }
        setIsCreateOptionsOpen(false);
    };
    
    const handleDownloadSelect = (type: 'csv' | 'xlsx') => {
        if (type === 'csv') {
            onDownloadCsv();
        } else {
            onDownloadXlsx();
        }
        setIsDownloadOpen(false);
    };

    return (
        <header className="flex-shrink-0 bg-white shadow-sm z-10">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                onChange={handleFileSelect}
            />
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Товары</h1>
                <p className="text-sm text-gray-500">Управление товарами и подборками для проекта "{project.name}"</p>
            </div>
            <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center flex-wrap gap-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                         <div className="relative" ref={visibilityDropdownRef}>
                            <button
                                onClick={toggleVisibilityDropdown}
                                className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Колонки
                            </button>
                            {isVisibilityDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 animate-fade-in-up">
                                    <div className="px-3 py-2 border-b flex justify-between items-center">
                                        <button onClick={onShowAllColumns} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">Показать все</button>
                                        <button onClick={onHideAllColumns} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">Скрыть все</button>
                                    </div>
                                    <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                        {columns.map(col => (
                                            <label key={col.key} className="flex items-center px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={!!visibleColumns[col.key]}
                                                    onChange={() => onToggleColumnVisibility(col.key)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                                                />
                                                <span className="ml-3 select-none">{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <button
                            onClick={onToggleSelectionMode}
                            className={`inline-flex items-center justify-center px-4 h-10 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm whitespace-nowrap ${
                                isSelectionMode ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            {isSelectionMode ? 'Отмена' : 'Выбрать'}
                        </button>

                        {/* Панель массовых действий - перемещена сюда, чтобы сдвигать кнопку создания */}
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isSelectionMode ? 'max-w-2xl opacity-100' : 'max-w-0 opacity-0'}`}>
                            <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                <button onClick={onSelectAllVisible} className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition-colors whitespace-nowrap">Все</button>
                                <button onClick={onClearSelection} className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition-colors whitespace-nowrap">Сброс</button>
                                
                                {selectedCount > 0 && (
                                    <>
                                        <div className="h-5 w-px bg-gray-200"></div>
                                        <span className="px-3 py-1 text-sm font-medium text-gray-700 whitespace-nowrap">Выбрано: {selectedCount}</span>
                                        <button
                                            ref={bulkEditButtonRef}
                                            onClick={onBulkEditClick}
                                            className="px-3 py-1 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                                        >
                                            Изменить
                                        </button>
                                        <button onClick={onInitiateBulkDelete} className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 whitespace-nowrap">Удалить</button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={onRefreshCategories}
                            disabled={isRefreshingCategories || isLoading}
                            title="Обновить список категорий товаров из VK"
                            className="inline-flex items-center justify-center px-3 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none whitespace-nowrap"
                        >
                             {isRefreshingCategories ? (
                                <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                             )}
                        </button>

                        {/* Анимированная кнопка создания товара */}
                         <div className="flex items-center" ref={createContainerRef}>
                            <button
                                onClick={() => setIsCreateOptionsOpen(prev => !prev)}
                                className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Создать товар
                            </button>
                            
                            {/* Выезжающая панель опций */}
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isCreateOptionsOpen ? 'max-w-md opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                                <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                    <button 
                                        onClick={() => handleCreateSelect('single')} 
                                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                                    >
                                        Один товар
                                    </button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button 
                                        onClick={() => handleCreateSelect('multiple')} 
                                        className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                                    >
                                        Несколько товаров
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative w-72">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                             <input
                                type="search"
                                placeholder="Поиск по всем полям..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 h-10 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        {!isSelectionMode && (
                            <>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" transform="rotate(180 12 12)" />
                                    </svg>
                                    Загрузить
                                </button>
                                <div className="flex items-center" ref={downloadRef}>
                                    <button
                                        onClick={() => setIsDownloadOpen(prev => !prev)}
                                        disabled={isLoading}
                                        className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 whitespace-nowrap"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Скачать
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isDownloadOpen ? 'max-w-md opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                                        <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                            <button
                                                onClick={() => handleDownloadSelect('csv')}
                                                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                                            >
                                                csv
                                            </button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button
                                                onClick={() => handleDownloadSelect('xlsx')}
                                                className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
                                            >
                                                xlsx
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onRefreshAll}
                                    disabled={isLoading}
                                    className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 whitespace-nowrap"
                                >
                                    {isLoading ? <div className="loader h-4 w-4 mr-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                                    Обновить всё
                                </button>
                                <button
                                    onClick={() => onSaveAll()}
                                    disabled={!isDirty || isSaving}
                                    className="whitespace-nowrap inline-flex items-center justify-center px-4 h-10 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                                >
                                    {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить все'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
