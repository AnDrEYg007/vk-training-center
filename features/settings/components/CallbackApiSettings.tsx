import React, { useState, useRef, useEffect } from 'react';
import { useCallbackApiLogs } from '../hooks/useCallbackApiLogs';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

// Вспомогательный компонент для мультиселекта
const MultiSelectDropdown: React.FC<{
    options: { id: string | number; label: string }[];
    selectedIds: Set<string | number>;
    onToggle: (id: string | number) => void;
    label: string;
}> = ({ options, selectedIds, onToggle, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const selectedCount = selectedIds.size;
    const displayLabel = selectedCount === 0 ? 'Все' : `Выбрано: ${selectedCount}`;

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-48 px-3 py-1.5 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    selectedCount > 0 ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-700'
                }`}
            >
                <span className="truncate mr-2">{label}: {displayLabel}</span>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute z-20 w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                    {options.map(opt => (
                        <label key={String(opt.id)} className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedIds.has(opt.id)}
                                onChange={() => onToggle(opt.id)}
                                className="w-4 h-4 flex-shrink-0 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                            />
                            <span className="truncate" title={opt.label}>{opt.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * Компонент настроек логов Callback API.
 * Отображает таблицу логов с возможностью выбора, копирования, удаления и фильтрации.
 */
export const CallbackApiSettings: React.FC = () => {
    const { state, actions, helpers } = useCallbackApiLogs();
    const { 
        filteredLogs, 
        isLoading, 
        isDeleting, 
        error, 
        selectedIds, 
        confirmAction,
        searchQuery,
        selectedEventTypes,
        selectedGroupIds,
    } = state;

    const { 
        availableEventTypes, 
        availableGroups, 
        allFilteredSelected,
    } = helpers;

    // Подсчет активных фильтров
    const activeFiltersCount = (searchQuery ? 1 : 0) + 
        (selectedEventTypes.size > 0 ? 1 : 0) + 
        (selectedGroupIds.size > 0 ? 1 : 0);

    return (
        <div className="flex flex-col h-full">
            {/* Заголовок секции */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">Логи Callback API</h2>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {filteredLogs.length} записей
                    </span>
                </div>
                <div className="flex gap-2">
                    <button 
                        type="button"
                        onClick={actions.handleDeleteAll}
                        disabled={filteredLogs.length === 0 || isDeleting}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        title="Удалить все логи"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Удалить все
                    </button>
                    <button 
                        type="button"
                        onClick={actions.fetchLogs}
                        disabled={isLoading || isDeleting}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        title="Обновить список логов"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        {isLoading ? 'Загрузка...' : 'Обновить'}
                    </button>
                </div>
            </div>

            {/* Панель выбора и фильтров */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center gap-3 flex-wrap">
                {/* Выбор */}
                <span className="text-sm text-gray-600">
                    Выбрано: <span className="font-medium">{selectedIds.size}</span> из {filteredLogs.length}
                </span>
                <button 
                    onClick={actions.handleDeleteSelected}
                    disabled={selectedIds.size === 0 || isDeleting}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Удалить выбранные
                </button>

                {/* Разделитель */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Поиск */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={(e) => actions.setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48"
                    />
                    <svg 
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Фильтр по типу события */}
                <MultiSelectDropdown
                    label="Тип события"
                    options={availableEventTypes.map(type => ({ id: type, label: type }))}
                    selectedIds={selectedEventTypes}
                    onToggle={actions.toggleEventType}
                />

                {/* Фильтр по группам */}
                <MultiSelectDropdown
                    label="Сообщества"
                    options={availableGroups.map(g => ({ id: g.id, label: g.name }))}
                    selectedIds={selectedGroupIds}
                    onToggle={(id) => actions.toggleGroup(id as number)}
                />

                {/* Кнопка сброса фильтров */}
                {activeFiltersCount > 0 && (
                    <button
                        onClick={actions.clearFilters}
                        className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Сбросить ({activeFiltersCount})
                    </button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-4 mt-4">
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Таблица логов */}
            <div className="flex-grow overflow-auto custom-scrollbar bg-white p-4">

            {isLoading && filteredLogs.length === 0 ? (
                <div className="flex justify-center items-center h-40">
                    <div className="loader border-t-indigo-500 w-8 h-8"></div>
                </div>
            ) : filteredLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
                    {activeFiltersCount > 0 ? 'Нет логов, соответствующих фильтрам.' : 'Нет логов Callback API.'}
                </div>
            ) : (
            <div className="overflow-x-auto custom-scrollbar border border-gray-200 rounded-lg">
                <table className="min-w-[1200px] w-full table-fixed divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="w-12 px-4 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={allFilteredSelected}
                                    onChange={actions.toggleSelectAll}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                />
                            </th>
                            <th scope="col" className="w-36 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Время</th>
                            <th scope="col" className="w-80 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Группа</th>
                            <th scope="col" className="w-56 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={helpers.copyAllTypes}
                                        className="text-gray-400 hover:text-indigo-600"
                                        title="Копировать все типы событий"
                                        aria-label="Копировать все типы событий"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <span>Тип события</span>
                                </div>
                            </th>
                            <th scope="col" className="w-56 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={helpers.copyAllPayloads}
                                        className="text-gray-400 hover:text-indigo-600"
                                        title="Копировать все payload"
                                        aria-label="Копировать все payload"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </button>
                                    <span>Payload</span>
                                </div>
                            </th>
                            <th scope="col" className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLogs.length === 0 && !isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                    Логов пока нет. Отправьте тестовый запрос или дождитесь события от VK.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id} className={`hover:bg-gray-50 ${selectedIds.has(log.id) ? 'bg-indigo-50' : ''}`}>
                                    <td className="w-12 px-4 py-4 whitespace-nowrap align-top">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(log.id)}
                                            onChange={() => actions.toggleSelect(log.id)}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                        />
                                    </td>
                                    <td className="w-36 px-6 py-4 whitespace-nowrap text-sm text-gray-900 align-top">
                                        <div className="font-bold">#{log.id}</div>
                                        <div className="text-gray-500 text-xs">{helpers.formatDate(log.timestamp)}</div>
                                    </td>
                                    <td className="w-80 px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top overflow-hidden">
                                        <div className="flex flex-col gap-1">
                                            <a 
                                                href={`https://vk.com/club${log.group_id}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline truncate block"
                                                title={log.group_name || `Группа ${log.group_id}`}
                                            >
                                                {log.group_name || `Группа ${log.group_id}`}
                                            </a>
                                            <span className="text-xs text-gray-400 font-mono">ID: {log.group_id}</span>
                                        </div>
                                    </td>
                                    <td className="w-56 px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 align-top">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => helpers.copyToClipboard(log.type)}
                                                className="text-gray-400 hover:text-indigo-600"
                                                title="Копировать тип события"
                                                aria-label="Копировать тип события"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            <span className="truncate">{log.type}</span>
                                        </div>
                                    </td>
                                    <td className="w-56 px-6 py-4 text-sm text-gray-500 font-mono text-xs align-top">
                                        <details className="min-w-0">
                                            <summary className="cursor-pointer select-none flex items-center gap-2 whitespace-nowrap">
                                                <button
                                                    onClick={(e) => { e.preventDefault(); helpers.copyToClipboard(helpers.formatPayload(log.payload)); }}
                                                    className="text-gray-400 hover:text-indigo-600 flex-shrink-0"
                                                    title="Копировать JSON"
                                                    aria-label="Копировать JSON"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                                <span className="text-indigo-500 hover:text-indigo-700">Показать содержимое</span>
                                            </summary>
                                            <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto custom-scrollbar break-all">
                                                {helpers.formatPayload(log.payload)}
                                            </div>
                                        </details>
                                    </td>
                                    <td className="w-12 px-4 py-4 whitespace-nowrap text-right text-sm align-top">
                                        <button
                                            onClick={() => actions.handleDeleteOne(log.id)}
                                            disabled={isDeleting}
                                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                                            title="Удалить"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            )}
            </div>

            {/* Модальное окно подтверждения удаления */}
            {confirmAction && (
                <ConfirmationModal
                    title="Подтверждение удаления"
                    message={helpers.getConfirmMessage()}
                    onConfirm={actions.executeDelete}
                    onCancel={actions.cancelDelete}
                    confirmText="Удалить"
                    cancelText="Отмена"
                    isConfirming={isDeleting}
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};
