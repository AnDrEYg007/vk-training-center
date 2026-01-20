import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../../../shared/types';
import { NoteVisibility, ViewMode } from '../hooks/useScheduleInteraction';
import { useProjects } from '../../../contexts/ProjectsContext';
import * as api from '../../../services/api';
import { UnifiedPost } from '../hooks/useScheduleData';
import { ScheduleSearch } from './ScheduleSearch';

interface ScheduleHeaderProps {
    project: Project;
    posts: UnifiedPost[]; 
    weekDates: Date[];
    weekOffset: number;
    viewMode: ViewMode;
    isSelectionMode: boolean;
    selectedPostIds: Set<string>;
    selectedNoteIds: Set<string>;
    loadingStates: {
        isRefreshingPublished: boolean;
        isRefreshingScheduled: boolean;
        isRefreshingSystem: boolean;
        isRefreshingNotes: boolean;
    };
    noteVisibility: NoteVisibility;
    tagVisibility: 'visible' | 'hidden';
    onRefreshAll: () => Promise<void>;
    onRefreshSystem: () => Promise<void>;
    onRefreshNotes: () => Promise<void>;
    onSetWeekOffset: (updater: (prev: number) => number) => void;
    onSetViewMode: (mode: ViewMode) => void;
    onToggleSelectionMode: () => void;
    onClearSelection: () => void;
    onInitiateBulkDelete: () => void;
    onCreateNote: () => void;
    onCycleNoteVisibility: () => void;
    onToggleTagVisibility: () => void;
    onOpenTagsModal: () => void;
    onSelectSearchPost: (post: UnifiedPost) => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
    project,
    posts,
    weekDates,
    weekOffset,
    viewMode,
    isSelectionMode,
    selectedPostIds,
    selectedNoteIds,
    loadingStates,
    noteVisibility,
    tagVisibility,
    onRefreshAll,
    onRefreshSystem,
    onRefreshNotes,
    onSetWeekOffset,
    onSetViewMode,
    onToggleSelectionMode,
    onClearSelection,
    onInitiateBulkDelete,
    onCreateNote,
    onCycleNoteVisibility,
    onToggleTagVisibility,
    onOpenTagsModal,
    onSelectSearchPost,
}) => {
    const { handleRefreshPublished, handleRefreshScheduled, handleRefreshStories } = useProjects();
    const [isRefreshDropdownOpen, setIsRefreshDropdownOpen] = useState(false);
    const [isRetagging, setIsRetagging] = useState(false);
    const [isRefreshingStories, setIsRefreshingStories] = useState(false);
    const refreshDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (refreshDropdownRef.current && !refreshDropdownRef.current.contains(event.target as Node)) {
                setIsRefreshDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRetagProject = async () => {
        setIsRetagging(true);
        setIsRefreshDropdownOpen(false);
        try {
            await api.retagProject(project.id);
            window.showAppToast?.("Процесс обновления тегов запущен. Данные в календаре обновятся автоматически в ближайшее время.", 'info');
            // Фронтенд получит обновление через механизм polling'а (useProjects)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
            window.showAppToast?.(`Не удалось обновить теги: ${errorMessage}`, 'error');
        } finally {
            setIsRetagging(false);
        }
    };

    const handleRefreshStoriesClick = async () => {
        setIsRefreshingStories(true);
        setIsRefreshDropdownOpen(false);
        try {
            await handleRefreshStories(project.id);
            window.showAppToast?.("Истории обновлены", 'success');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Произошла ошибка";
            window.showAppToast?.(`Не удалось обновить истории: ${errorMessage}`, 'error');
        } finally {
            setIsRefreshingStories(false);
        }
    };

    const isRefreshingAny = loadingStates.isRefreshingPublished || loadingStates.isRefreshingScheduled || loadingStates.isRefreshingSystem || loadingStates.isRefreshingNotes || isRetagging || isRefreshingStories;
    const totalSelected = selectedPostIds.size + selectedNoteIds.size;

    const getNoteVisibilityButtonProps = () => {
        switch (noteVisibility) {
            case 'expanded':
                return {
                    title: "Свернуть заметки",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    ),
                };
            case 'collapsed':
                return {
                    title: "Скрыть заметки",
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                        </svg>
                    ),
                };
            case 'hidden':
                return {
                    title: "Показать заметки",
                    icon: (
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                        </svg>
                    ),
                };
        }
    };
    const noteButtonProps = getNoteVisibilityButtonProps();

    // handleNavigateToDate removed, as it's now handled in ScheduleTab via onSelectSearchPost

    return (
        <div className="flex-shrink-0 bg-white shadow-sm z-20">
            <header className="flex justify-between items-center border-b border-gray-200 p-4">
                <h1 className="text-xl font-bold text-gray-800 truncate">{project.name}</h1>
            </header>
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
                    
                    {/* Левая группа: Навигация */}
                    <div className="flex items-center flex-wrap gap-4">
                        <div className="text-left">
                            <span className="font-semibold text-gray-700 text-lg">
                                {new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(weekDates[0])}
                            </span>
                            <p className="text-xs text-gray-500">
                                {weekDates[0].toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} - {weekDates[6].toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                            </p>
                        </div>

                        <div className="flex bg-gray-200 rounded-md p-1">
                            <button onClick={() => onSetViewMode('week')} className={`flex-1 text-sm font-medium px-4 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'week' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Неделя</button>
                            <button onClick={() => onSetViewMode('today')} className={`flex-1 text-sm font-medium px-4 py-1.5 rounded-md transition-all whitespace-nowrap ${viewMode === 'today' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Сегодня</button>
                        </div>

                        <div className="flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
                            <button onClick={() => onSetWeekOffset(w => w - 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors" title="Предыдущая неделя">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <div className="h-5 w-px bg-gray-200"></div>
                            <button onClick={() => onSetWeekOffset(() => 0)} disabled={weekOffset === 0} className="px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 whitespace-nowrap">Сегодня</button>
                            <div className="h-5 w-px bg-gray-200"></div>
                            <button onClick={() => onSetWeekOffset(w => w + 1)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors" title="Следующая неделя">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                        
                        <ScheduleSearch posts={posts} onSelectPost={onSelectSearchPost} />
                    </div>

                     {/* Правая группа: Действия */}
                    <div className="flex items-center flex-wrap justify-end gap-x-4 gap-y-2">
                        <div className="flex items-center gap-2">
                            <button onClick={onCreateNote} title="Создать заметку" className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                </svg>
                            </button>
                            <button 
                                onClick={onCycleNoteVisibility} 
                                title={noteButtonProps.title} 
                                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                {noteButtonProps.icon}
                            </button>
                            <button onClick={onOpenTagsModal} title="Управление тегами" className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            </button>
                            <button 
                                onClick={onToggleTagVisibility} 
                                title={tagVisibility === 'visible' ? "Скрыть теги" : "Показать теги"} 
                                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                {tagVisibility === 'visible' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        <div className="relative flex items-center" ref={refreshDropdownRef}>
                            <button onClick={() => setIsRefreshDropdownOpen(prev => !prev)} disabled={isRefreshingAny} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait transition-colors shadow-sm whitespace-nowrap">
                                {isRefreshingAny ? <div className="loader h-4 w-4 mr-2"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                                <span>Обновить</span>
                            </button>
                            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isRefreshDropdownOpen ? 'max-w-4xl opacity-100 ml-2' : 'max-w-0 opacity-0'}`}>
                                <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                    <button onClick={() => { handleRefreshPublished(project.id); setIsRefreshDropdownOpen(false); }} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Опубликованные {loadingStates.isRefreshingPublished && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={() => { handleRefreshScheduled(project.id); setIsRefreshDropdownOpen(false); }} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Отложенные {loadingStates.isRefreshingScheduled && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={() => { onRefreshSystem(); setIsRefreshDropdownOpen(false); }} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Системные {loadingStates.isRefreshingSystem && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={handleRefreshStoriesClick} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Истории {isRefreshingStories && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={handleRetagProject} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Теги {isRetagging && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={() => { onRefreshNotes(); setIsRefreshDropdownOpen(false); }} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center whitespace-nowrap">Заметки {loadingStates.isRefreshingNotes && <div className="loader h-3 w-3 ml-2"></div>}</button>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={() => { onRefreshAll(); setIsRefreshDropdownOpen(false); }} disabled={isRefreshingAny} className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md disabled:opacity-50 whitespace-nowrap">Всё</button>
                                </div>
                            </div>
                        </div>

                        <div className="h-5 w-px bg-gray-200 hidden lg:block"></div>
                        
                        <div className="flex items-center gap-2">
                             <button onClick={onToggleSelectionMode} className={`inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm whitespace-nowrap ${isSelectionMode ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                {isSelectionMode ? 'Отмена' : 'Выбрать'}
                            </button>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${isSelectionMode && totalSelected > 0 ? 'max-w-lg opacity-100' : 'max-w-0 opacity-0'}`}>
                                <div className="flex items-center gap-1 p-1 bg-white border border-gray-300 rounded-md shadow-sm whitespace-nowrap">
                                    <span className="px-3 py-1 text-sm font-medium text-gray-700 whitespace-nowrap">Выбрано: {totalSelected}</span>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <button onClick={onClearSelection} className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded-md font-medium transition-colors whitespace-nowrap">Снять выделение</button>
                                    <button onClick={onInitiateBulkDelete} disabled={totalSelected === 0} className="px-3 py-1 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 whitespace-nowrap">Удалить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};