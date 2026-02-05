import React, { useState } from 'react';
import { NoteVisibility, ViewMode } from '../../../../schedule/hooks/useScheduleInteraction';

export const CalendarHeaderSandbox: React.FC = () => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [viewMode, setViewMode] = useState<ViewMode>('week');
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedCount, setSelectedCount] = useState(0);
    const [noteVisibility, setNoteVisibility] = useState<NoteVisibility>('expanded');
    const [tagVisibility, setTagVisibility] = useState<'visible' | 'hidden'>('visible');
    const [isRefreshDropdownOpen, setIsRefreshDropdownOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const getWeekDates = () => {
        const today = new Date();
        const start = new Date(today);
        
        if (viewMode === 'week') {
            const dayOfWeek = today.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
            start.setDate(today.getDate() + diff + (weekOffset * 7));
        } else {
            start.setDate(today.getDate() + (weekOffset * 7));
        }
        
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        
        return { start, end };
    };

    const { start, end } = getWeekDates();

    const cycleNoteVisibility = () => {
        setNoteVisibility(prev => {
            if (prev === 'expanded') return 'collapsed';
            if (prev === 'collapsed') return 'hidden';
            return 'expanded';
        });
    };

    const getNoteVisibilityIcon = () => {
        switch (noteVisibility) {
            case 'expanded':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                );
            case 'collapsed':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                    </svg>
                );
            case 'hidden':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                    </svg>
                );
        }
    };

    const handleRefresh = (type: string) => {
        setIsRefreshing(true);
        setIsRefreshDropdownOpen(false);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        if (isSelectionMode) {
            setSelectedCount(0);
        }
    };

    return (
        <div className="not-prose my-8 bg-white border-2 border-indigo-300 rounded-lg overflow-hidden shadow-lg">
            {/* Заголовок песочницы */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="text-2xl">🎮</span>
                    Интерактивная демонстрация шапки календаря
                </h3>
                <p className="text-indigo-100 text-sm mt-1">
                    Кликай на кнопки и смотри, как меняется поведение инструментов
                </p>
            </div>

            {/* Демо-шапка */}
            <div className="bg-gray-50 p-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* Верхний заголовок проекта */}
                    <div className="flex justify-between items-center border-b border-gray-200 px-4 py-3">
                        <h4 className="text-lg font-bold text-gray-800">Демо-проект</h4>
                    </div>

                    {/* Панель инструментов */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
                            
                            {/* Левая группа */}
                            <div className="flex items-center flex-wrap gap-4">
                                {/* Отображение месяца и дат */}
                                <div className="text-left">
                                    <span className="font-semibold text-gray-700 text-lg">
                                        {new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(start)}
                                    </span>
                                    <p className="text-xs text-gray-500">
                                        {start.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} - {end.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                                    </p>
                                </div>

                                {/* Переключатель режимов (pill-switch) */}
                                <div className="flex bg-gray-200 rounded-md p-1">
                                    <button 
                                        onClick={() => setViewMode('week')}
                                        className={`flex-1 text-sm font-medium px-4 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'week' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Неделя
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('today')}
                                        className={`flex-1 text-sm font-medium px-4 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'today' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        Сегодня
                                    </button>
                                </div>

                                {/* Навигация (единый блок) */}
                                <div className="flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
                                    <button 
                                        onClick={() => setWeekOffset(w => w - 1)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors"
                                        title="Предыдущая неделя"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button 
                                        onClick={() => setWeekOffset(0)}
                                        disabled={weekOffset === 0}
                                        className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 whitespace-nowrap"
                                    >
                                        Сегодня
                                    </button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button 
                                        onClick={() => setWeekOffset(w => w + 1)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors"
                                        title="Следующая неделя"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Поиск */}
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="Поиск постов..."
                                        className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Правая группа */}
                            <div className="flex items-center flex-wrap justify-end gap-x-4 gap-y-2">
                                <div className="flex items-center gap-2">
                                    {/* Создать заметку */}
                                    <button 
                                        title="Создать заметку"
                                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                        </svg>
                                    </button>

                                    {/* Видимость заметок */}
                                    <button 
                                        onClick={cycleNoteVisibility}
                                        title={`Заметки: ${noteVisibility === 'expanded' ? 'развёрнуты' : noteVisibility === 'collapsed' ? 'свёрнуты' : 'скрыты'}`}
                                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        {getNoteVisibilityIcon()}
                                    </button>

                                    {/* Управление тегами */}
                                    <button 
                                        title="Управление тегами"
                                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </button>

                                    {/* Видимость тегов */}
                                    <button 
                                        onClick={() => setTagVisibility(prev => prev === 'visible' ? 'hidden' : 'visible')}
                                        title={tagVisibility === 'visible' ? "Скрыть теги" : "Показать теги"}
                                        className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                                    >
                                        {tagVisibility === 'visible' ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Кнопка обновления с выезжающей панелью */}
                                <div className="relative flex items-center">
                                    <button 
                                        onClick={() => setIsRefreshDropdownOpen(!isRefreshDropdownOpen)}
                                        disabled={isRefreshing}
                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm whitespace-nowrap"
                                    >
                                        {isRefreshing ? (
                                            <div className="loader h-4 w-4 mr-2 border-2 border-gray-400 border-t-indigo-500"></div>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                            </svg>
                                        )}
                                        <span>Обновить</span>
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isRefreshDropdownOpen ? 'max-w-4xl opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                                        <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                            <button onClick={() => handleRefresh('published')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Опубликованные</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('scheduled')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Отложенные</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('system')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Системные</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('stories')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Истории</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('retag')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Теги</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('notes')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Заметки</button>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => handleRefresh('all')} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Всё</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-5 w-px bg-gray-200 hidden lg:block"></div>

                                {/* Режим выбора с выезжающими действиями */}
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={toggleSelectionMode}
                                        className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors shadow-sm whitespace-nowrap ${isSelectionMode ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        {isSelectionMode ? 'Отмена' : 'Выбрать'}
                                    </button>

                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isSelectionMode && selectedCount > 0 ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0'}`}>
                                        <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                            <span className="px-3 py-1 text-sm font-medium text-gray-700 whitespace-nowrap">Выбрано: {selectedCount}</span>
                                            <div className="h-5 w-px bg-gray-200"></div>
                                            <button onClick={() => setSelectedCount(0)} className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition-colors whitespace-nowrap">Снять выделение</button>
                                            <button className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 whitespace-nowrap">Удалить</button>
                                        </div>
                                    </div>

                                    {/* Кнопки симуляции для демонстрации */}
                                    {isSelectionMode && (
                                        <div className="flex items-center gap-1 ml-2">
                                            <button 
                                                onClick={() => setSelectedCount(c => c + 1)}
                                                className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                title="Добавить 1 элемент"
                                            >
                                                +1
                                            </button>
                                            <button 
                                                onClick={() => setSelectedCount(c => c + 5)}
                                                className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                title="Добавить 5 элементов"
                                            >
                                                +5
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Подсказки для взаимодействия */}
                <div className="bg-indigo-50 px-6 py-4 border-t border-indigo-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-indigo-900 mb-2">💡 Попробуй:</p>
                            <ul className="text-indigo-700 space-y-1">
                                <li>• Переключи режим "Неделя" ↔ "Сегодня" и смотри на даты</li>
                                <li>• Нажми стрелки навигации — даты изменятся</li>
                                <li>• Кликни на иконку глаза у заметок — 3 состояния</li>
                                <li>• Кликни на иконку глаза у тегов — скрытие/показ</li>
                                <li>• Нажми "Обновить" — справа выедет панель выбора</li>
                                <li>• Нажми "Выбрать", потом кнопки "+1" или "+5" — увидишь панель действий</li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-indigo-900 mb-2">🎯 Обрати внимание:</p>
                            <ul className="text-indigo-700 space-y-1">
                                <li>• Навигация — единый блок с разделителями, не отдельные кнопки</li>
                                <li>• Режимы — pill-switch с фоном, не табы с border-b-2</li>
                                <li>• "Выбрать" меняется на "Отмена" при активации</li>
                                <li>• Кнопка "Обновить" открывает панель вправо, не вниз</li>
                                <li>• Панель действий появляется только при выборе элементов</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
