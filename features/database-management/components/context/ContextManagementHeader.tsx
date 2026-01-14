
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ProjectContextField } from '../../../../shared/types';
import { ColumnTypeFilter } from '../../hooks/useProjectContext';

interface ContextManagementHeaderProps {
    onGoBack: () => void;
    // Filters
    columnTypeFilter: ColumnTypeFilter;
    setColumnTypeFilter: (val: ColumnTypeFilter) => void;
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    teamFilter: string;
    setTeamFilter: (val: string) => void;
    uniqueTeams: string[];
    filteredCount: number;
    totalCount: number;
    // Visibility
    fields: ProjectContextField[];
    hiddenFields: Record<string, boolean>;
    toggleFieldVisibility: (id: string) => void;
    // Actions
    onAddColumn: () => void;
    onSave: () => void;
    isSaving: boolean;
    hasChanges: boolean;
    onMassAiClick: () => void;
    onClearAll: () => void; // New prop
    // New Props
    isMassAiProcessing: boolean;
    massAiProgress: string | null;
}

export const ContextManagementHeader: React.FC<ContextManagementHeaderProps> = ({
    onGoBack,
    columnTypeFilter, setColumnTypeFilter,
    searchQuery, setSearchQuery,
    teamFilter, setTeamFilter, uniqueTeams,
    filteredCount, totalCount,
    fields, hiddenFields, toggleFieldVisibility,
    onAddColumn, onSave, isSaving, hasChanges, onMassAiClick,
    onClearAll,
    isMassAiProcessing, massAiProgress
}) => {
    const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false);
    const columnsDropdownTriggerRef = useRef<HTMLDivElement>(null);
    const columnsDropdownContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isColumnsDropdownOpen &&
                columnsDropdownTriggerRef.current && 
                !columnsDropdownTriggerRef.current.contains(event.target as Node) &&
                columnsDropdownContentRef.current &&
                !columnsDropdownContentRef.current.contains(event.target as Node)
            ) {
                setIsColumnsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isColumnsDropdownOpen]);

    const filterButtonClass = (type: ColumnTypeFilter) => `px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${columnTypeFilter === type ? 'bg-white text-indigo-700 shadow' : 'text-gray-600 hover:bg-gray-200'}`;

    return (
        <header className="flex-shrink-0 bg-white shadow-sm z-10">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-800">Контекст проектов</h1>
                <p className="text-sm text-gray-500">Дополнительные данные для AI-генерации (бренд, тональность и т.д.)</p>
            </div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                <div className="flex gap-4 items-center">
                    <button onClick={onGoBack} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Назад
                    </button>
                    
                    {/* Фильтр типа колонок */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button onClick={() => setColumnTypeFilter('all')} className={filterButtonClass('all')}>Все</button>
                        <button onClick={() => setColumnTypeFilter('global')} className={filterButtonClass('global')}>Общие</button>
                        <button onClick={() => setColumnTypeFilter('specific')} className={filterButtonClass('specific')}>Частные</button>
                    </div>

                    <div className="relative" ref={columnsDropdownTriggerRef}>
                        <button 
                            onClick={() => setIsColumnsDropdownOpen(!isColumnsDropdownOpen)}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                            Колонки
                        </button>
                        {isColumnsDropdownOpen && createPortal(
                            <div 
                                ref={columnsDropdownContentRef}
                                className="fixed z-[70] mt-1 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up w-56 max-h-60 overflow-y-auto custom-scrollbar"
                                style={{
                                    top: columnsDropdownTriggerRef.current ? columnsDropdownTriggerRef.current.getBoundingClientRect().bottom + 5 : 0,
                                    left: columnsDropdownTriggerRef.current ? columnsDropdownTriggerRef.current.getBoundingClientRect().left : 0
                                }}
                            >
                                <div className="p-2">
                                    <p className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Отображение полей</p>
                                    {fields.length === 0 && <p className="px-2 py-1 text-xs text-gray-400">Нет полей</p>}
                                    {fields.map(field => (
                                        <label key={field.id} className="flex items-center px-2 py-1.5 hover:bg-indigo-50 rounded cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={!hiddenFields[field.id]} 
                                                onChange={() => toggleFieldVisibility(field.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 truncate">{field.name}</span>
                                            {!field.is_global && <span className="ml-1 text-[10px] text-indigo-500 bg-indigo-50 px-1 rounded border border-indigo-100">Частное</span>}
                                        </label>
                                    ))}
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>
                </div>

                <div className="flex gap-2 items-center">
                     {isMassAiProcessing ? (
                        <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-700 shadow-sm">
                             <div className="loader h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                             <span className="font-medium truncate max-w-[200px]" title={massAiProgress || "Обработка..."}>
                                {massAiProgress || "Обработка..."}
                             </span>
                        </div>
                     ) : (
                        <button
                            onClick={onMassAiClick}
                            disabled={isSaving}
                            className="px-4 py-2 border border-indigo-400 text-indigo-600 rounded-md text-sm hover:bg-indigo-50 font-medium flex items-center gap-2 disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            ✨ Массовое заполнение
                        </button>
                     )}

                    <div className="h-8 w-px bg-gray-300 mx-1"></div>
                    
                    <button 
                        onClick={onClearAll} 
                        disabled={isSaving || isMassAiProcessing}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                        title="Очистить все данные в таблице"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    <button onClick={onAddColumn} disabled={isSaving || isMassAiProcessing} className="px-4 py-2 border border-dashed border-indigo-400 text-indigo-600 rounded-md text-sm hover:bg-indigo-50 font-medium disabled:opacity-50">
                        + Столбец
                    </button>
                    <button 
                        onClick={onSave} 
                        disabled={isSaving || !hasChanges || isMassAiProcessing}
                        className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 font-medium shadow-sm"
                    >
                        {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                </div>
            </div>

            {/* Project Filtering Bar */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center gap-4">
                <div className="relative w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Поиск проекта..."
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 whitespace-nowrap">Команда:</span>
                    <select
                        value={teamFilter}
                        onChange={(e) => setTeamFilter(e.target.value)}
                        className="border border-gray-300 rounded-md text-sm py-1.5 pl-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="All">Все</option>
                        {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                        <option value="NoTeam">Без команды</option>
                    </select>
                </div>
                <span className="text-xs text-gray-500 ml-auto">
                    Показано: <strong>{filteredCount}</strong> из {totalCount}
                </span>
            </div>
        </header>
    );
};
