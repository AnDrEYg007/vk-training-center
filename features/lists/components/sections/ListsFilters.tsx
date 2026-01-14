
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FilterDropdown } from '../FilterDropdown';
import { ListType, FilterQuality, FilterSex, FilterOnline, FilterCanWrite, RefreshState, FilterBdateMonth, FilterPlatform, FilterAge } from '../../types';
import { AuthUser } from '../../../../shared/types';

interface ListsFiltersProps {
    activeList: ListType | null;
    searchQuery: string;
    totalItemsCount: number;
    filterQuality: FilterQuality;
    filterSex: FilterSex;
    filterOnline: FilterOnline;
    filterCanWrite: FilterCanWrite;
    // Новые фильтры
    filterBdateMonth: FilterBdateMonth;
    filterPlatform: FilterPlatform;
    filterAge: FilterAge;
    
    setSearchQuery: (val: string) => void;
    setFilterQuality: (val: FilterQuality) => void;
    setFilterSex: (val: FilterSex) => void;
    setFilterOnline: (val: FilterOnline) => void;
    setFilterCanWrite: (val: FilterCanWrite) => void;
    setFilterBdateMonth: (val: FilterBdateMonth) => void;
    setFilterPlatform: (val: FilterPlatform) => void;
    setFilterAge: (val: FilterAge) => void;
    
    onResetFilters: () => void;
    
    // Действия обновления деталей
    isRefreshingSubscriberDetails: boolean;
    refreshStates: Record<ListType, RefreshState>;
    onRefreshSubscriberDetails: () => void;
    onRefreshList: (type: ListType | 'mailing_analysis', mode?: 'missing' | 'full') => void;
    onRefreshInteractionUsers: () => void;
    
    // Admin действия
    user: AuthUser | null;
    onInitiateClearList: () => void;
}

export const ListsFilters: React.FC<ListsFiltersProps> = ({
    activeList,
    searchQuery,
    totalItemsCount,
    filterQuality,
    filterSex,
    filterOnline,
    filterCanWrite,
    filterBdateMonth,
    filterPlatform,
    filterAge,
    setSearchQuery,
    setFilterQuality,
    setFilterSex,
    setFilterOnline,
    setFilterCanWrite,
    setFilterBdateMonth,
    setFilterPlatform,
    setFilterAge,
    onResetFilters,
    isRefreshingSubscriberDetails,
    refreshStates,
    onRefreshSubscriberDetails,
    onRefreshList,
    onRefreshInteractionUsers,
    user,
    onInitiateClearList
}) => {
    
    const hasActiveFilters = searchQuery.trim() !== '' || 
        filterQuality !== 'all' || 
        filterSex !== 'all' || 
        filterOnline !== 'any' || 
        filterCanWrite !== 'all' || 
        filterBdateMonth !== 'any' || 
        filterPlatform !== 'any' ||
        filterAge !== 'any';
        
    const isPostsList = activeList === 'posts' || activeList === 'reviews_posts';
    const isAutomationList = activeList?.startsWith('reviews_');

    // Состояние для выпадающего меню "Анализ"
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const analysisBtnRef = useRef<HTMLButtonElement>(null);
    const analysisMenuRef = useRef<HTMLDivElement>(null);
    const [analysisMenuPos, setAnalysisMenuPos] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isAnalysisOpen &&
                analysisBtnRef.current && !analysisBtnRef.current.contains(event.target as Node) &&
                analysisMenuRef.current && !analysisMenuRef.current.contains(event.target as Node)
            ) {
                setIsAnalysisOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAnalysisOpen]);

    const handleAnalysisClick = () => {
        if (isAnalysisOpen) {
            setIsAnalysisOpen(false);
            return;
        }

        if (analysisBtnRef.current) {
            const rect = analysisBtnRef.current.getBoundingClientRect();
            setAnalysisMenuPos({
                top: rect.bottom + 4,
                left: rect.left
            });
        }
        setIsAnalysisOpen(true);
    };

    return (
        <div className="mb-4 flex flex-wrap gap-3 items-center justify-between bg-white p-3 rounded-lg border border-gray-200 shadow-sm sticky top-0 z-20">
            {/* Фильтры */}
            <div className="flex flex-wrap items-center gap-3 w-full">
                <div className="relative w-72 flex items-center gap-2">
                    <div className="relative flex-grow">
                        <input 
                            type="text" 
                            placeholder={isPostsList ? "Поиск по тексту..." : "ФИО, ID, ссылка..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                     {/* Кнопка Анализа для рассылки */}
                    {activeList === 'mailing' && (
                        <div className="relative">
                            <button
                                ref={analysisBtnRef}
                                onClick={handleAnalysisClick}
                                disabled={refreshStates['mailing'].isRefreshing}
                                className="flex items-center justify-center px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50 shadow-sm text-xs font-medium whitespace-nowrap"
                                title="Анализ диалогов (дата первого сообщения, инициатор)"
                            >
                                {refreshStates['mailing'].isRefreshing && refreshStates['mailing'].label && refreshStates['mailing'].label.includes('Анализ') ? (
                                    <div className="flex items-center gap-1">
                                        <div className="loader h-3 w-3 border-2 border-indigo-500 border-t-transparent"></div>
                                        <span>{refreshStates['mailing'].label}</span>
                                    </div>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Анализ
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 ml-1 transition-transform ${isAnalysisOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </>
                                )}
                            </button>
                            {isAnalysisOpen && createPortal(
                                <div
                                    ref={analysisMenuRef}
                                    className="fixed z-[100] bg-white rounded-md shadow-lg border border-gray-200 py-1 animate-fade-in-up min-w-[200px]"
                                    style={{ top: analysisMenuPos.top, left: analysisMenuPos.left }}
                                >
                                    <div className="px-3 py-2 border-b border-gray-100 text-xs text-gray-500 bg-gray-50 font-medium uppercase tracking-wider">
                                        Режим анализа
                                    </div>
                                    <button
                                        onClick={() => { onRefreshList('mailing_analysis', 'missing'); setIsAnalysisOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex flex-col"
                                    >
                                        <span className="font-medium">Дополнить</span>
                                        <span className="text-xs text-gray-500">Только пустые записи (Быстро)</span>
                                    </button>
                                    <button
                                        onClick={() => { onRefreshList('mailing_analysis', 'full'); setIsAnalysisOpen(false); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex flex-col"
                                    >
                                        <span className="font-medium">Полный пересчет</span>
                                        <span className="text-xs text-gray-500">Обновить всех (Медленно)</span>
                                    </button>
                                </div>,
                                document.body
                            )}
                        </div>
                    )}
                </div>
                
                {/* Кнопки обновления деталей */}
                {activeList === 'subscribers' && (
                    <button
                        onClick={onRefreshSubscriberDetails}
                        disabled={isRefreshingSubscriberDetails}
                        className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 shadow-sm"
                        title="Обновить детали (статус, город, онлайн)"
                    >
                        {isRefreshingSubscriberDetails ? (
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </button>
                )}
                
                {activeList === 'authors' && (
                    <button
                        onClick={() => onRefreshList('author_details' as any)} // Используем спец тип для деталей
                        disabled={refreshStates['authors'].isRefreshing} // Используем статус списка, или можно добавить isRefreshingAuthorDetails
                        className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 shadow-sm"
                        title="Обновить детали профилей авторов"
                    >
                        {refreshStates['authors'].isRefreshing && refreshStates['authors'].label ? ( // Покажем лоадер если идет обновление деталей
                             <div className="flex items-center gap-1">
                                <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                            </div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </button>
                )}

                {activeList && ['history_join', 'history_leave'].includes(activeList) && (
                    <button
                        onClick={() => onRefreshList(activeList)}
                        disabled={refreshStates[activeList].isRefreshing}
                        className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 shadow-sm"
                        title="Обновить детали профилей в истории"
                    >
                        {refreshStates[activeList].isRefreshing ? (
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </button>
                )}
                {activeList && ['likes', 'comments', 'reposts'].includes(activeList) && (
                    <button
                        onClick={onRefreshInteractionUsers}
                        disabled={refreshStates[activeList].isRefreshing}
                        className="flex items-center justify-center h-9 px-3 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50 shadow-sm"
                        title="Обновить профили пользователей"
                    >
                        {refreshStates[activeList].isRefreshing ? (
                            <div className="flex items-center gap-1">
                                <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                                {refreshStates[activeList].label && (
                                    <span className="text-xs text-gray-500">{refreshStates[activeList].label}</span>
                                )}
                            </div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                    </button>
                )}

                <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block"></div>

                {!isPostsList && !isAutomationList && (
                    <div className="flex flex-wrap gap-2 items-center">
                        <FilterDropdown
                            label="Статус"
                            value={filterQuality}
                            onChange={(val) => setFilterQuality(val as FilterQuality)}
                            defaultValue="all"
                            options={[
                                { value: 'all', label: 'Все' },
                                { value: 'active', label: 'Активные' },
                                { value: 'banned', label: 'Забанены' },
                                { value: 'deleted', label: 'Удалены' }
                            ]}
                        />
                        <FilterDropdown
                            label="Пол"
                            value={filterSex}
                            onChange={(val) => setFilterSex(val as FilterSex)}
                            defaultValue="all"
                            options={[
                                { value: 'all', label: 'Любой' },
                                { value: 'female', label: 'Женский' },
                                { value: 'male', label: 'Мужской' },
                                { value: 'unknown', label: 'Не указан' }
                            ]}
                        />
                        <FilterDropdown
                            label="Онлайн"
                            value={filterOnline}
                            onChange={(val) => setFilterOnline(val as FilterOnline)}
                            defaultValue="any"
                            options={[
                                { value: 'any', label: 'Любой' },
                                { value: 'today', label: 'Сегодня' },
                                { value: '3_days', label: '3 дня' },
                                { value: 'week', label: 'Неделя' },
                                { value: 'month', label: 'Месяц' }
                            ]}
                        />
                         <FilterDropdown
                            label="Платформа"
                            value={filterPlatform}
                            onChange={(val) => setFilterPlatform(val as FilterPlatform)}
                            defaultValue="any"
                            options={[
                                { value: 'any', label: 'Любая' },
                                { value: '1', label: 'm.vk' },
                                { value: '2', label: 'iPhone' },
                                { value: '4', label: 'Android' },
                                { value: '7', label: 'Web' },
                                { value: 'unknown', label: 'Не определена' }
                            ]}
                        />
                        <FilterDropdown
                            label="Возраст"
                            value={filterAge}
                            onChange={(val) => setFilterAge(val as FilterAge)}
                            defaultValue="any"
                            options={[
                                { value: 'any', label: 'Любой' },
                                { value: 'u16', label: 'до 16' },
                                { value: '16-20', label: '16-20' },
                                { value: '20-25', label: '20-25' },
                                { value: '25-30', label: '25-30' },
                                { value: '30-35', label: '30-35' },
                                { value: '35-40', label: '35-40' },
                                { value: '40-45', label: '40-45' },
                                { value: '45p', label: '45+' },
                                { value: 'unknown', label: 'Не указан' },
                            ]}
                        />
                        <FilterDropdown
                            label="Месяц рожд."
                            value={filterBdateMonth}
                            onChange={(val) => setFilterBdateMonth(val as FilterBdateMonth)}
                            defaultValue="any"
                            options={[
                                { value: 'any', label: 'Любой' },
                                { value: '1', label: 'Январь' },
                                { value: '2', label: 'Февраль' },
                                { value: '3', label: 'Март' },
                                { value: '4', label: 'Апрель' },
                                { value: '5', label: 'Май' },
                                { value: '6', label: 'Июнь' },
                                { value: '7', label: 'Июль' },
                                { value: '8', label: 'Август' },
                                { value: '9', label: 'Сентябрь' },
                                { value: '10', label: 'Октябрь' },
                                { value: '11', label: 'Ноябрь' },
                                { value: '12', label: 'Декабрь' },
                                { value: 'unknown', label: 'Не указан' },
                            ]}
                        />
                        
                        {activeList === 'mailing' && (
                            <FilterDropdown
                                label="Сообщения"
                                value={filterCanWrite}
                                onChange={(val) => setFilterCanWrite(val as FilterCanWrite)}
                                defaultValue="all"
                                options={[
                                    { value: 'all', label: 'Все' },
                                    { value: 'allowed', label: 'Разрешено' },
                                    { value: 'forbidden', label: 'Запрещено' }
                                ]}
                            />
                        )}
                        
                        {hasActiveFilters && (
                            <button 
                                onClick={onResetFilters}
                                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1 px-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                Сбросить
                            </button>
                        )}
                    </div>
                )}
                
                <div className="text-sm text-gray-500 font-medium px-2 border-l border-gray-300 ml-1">
                    Найдено: {totalItemsCount}
                </div>

                {user?.role === 'admin' && (
                    <div className="ml-auto">
                        <button 
                            onClick={onInitiateClearList} 
                            className="text-sm text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-800 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                            title="Полностью очистить базу данных этого списка (для отладки)"
                        >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                Очистить базу
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
