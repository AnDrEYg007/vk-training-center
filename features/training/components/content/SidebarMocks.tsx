import React, { useState } from 'react';

// =====================================================================
// Вспомогательные Mock-компоненты для визуализации сайдбара
// =====================================================================

interface MockProjectListItemProps {
    name: string;
    postCount: number;
    isActive?: boolean;
    isHovered?: boolean;
    isDisabled?: boolean;
    status?: 'error' | 'update' | 'loading';
}

const getPostCountColorClasses = (count: number, isActive: boolean, isDisabled: boolean): string => {
    if (isActive) {
        if (isDisabled) return 'bg-gray-300 text-gray-800';
        if (count === 0) return 'bg-red-200 text-red-800';
        if (count > 0 && count < 5) return 'bg-orange-200 text-orange-800';
        if (count > 10) return 'bg-green-200 text-green-800';
        return 'bg-indigo-200 text-indigo-800';
    }
    
    if (count === 0) return 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium';
    if (count > 0 && count < 5) return 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium';
    if (count > 10) return 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium';
    return 'bg-gray-300 text-gray-700';
};

// ИЗМЕНЕНО: Теперь это только сам элемент списка, без обертки и описания
export const MockProjectListItem: React.FC<MockProjectListItemProps> = ({
    name,
    postCount,
    isActive = false,
    isHovered = false,
    isDisabled = false,
    status,
}) => {
    const itemClasses = `w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-all duration-300 ease-in-out ${isHovered ? 'pl-24' : 'pl-4'} ${
        isActive
            ? (isDisabled ? 'bg-gray-200 text-gray-800 font-semibold' : 'bg-indigo-50 text-indigo-700 font-semibold')
            : (isDisabled ? 'text-gray-600 bg-gray-100' : 'hover:bg-gray-100')
    }`;

    return (
        <div className={`relative overflow-hidden ${isDisabled ? 'opacity-70' : ''}`}>
            <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                    <button title="Обновить" className="p-2 text-gray-500 rounded-full bg-gray-300">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                    </button>
                    <button title="Настройки" className="p-2 text-gray-500 rounded-full bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>
            <div className={itemClasses}>
                <div className="flex items-center min-w-0">
                    <span className="truncate pr-1">{name}</span>
                    {status === 'error' && (
                        <div title="Проблема с доступом" className="text-amber-500 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="flex-shrink-0 w-8 h-4 flex items-center justify-center">
                    {status === 'update' ?
                        (<div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" title="Доступны обновления"></div>) :
                    status === 'loading' ?
                        (<div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>) :
                        (<span className={`text-xs px-2 py-0.5 rounded-full ${getPostCountColorClasses(postCount, isActive, isDisabled)}`}>{postCount}</span>)
                    }
                </div>
            </div>
        </div>
    );
};

// НОВЫЙ КОМПОНЕНТ: Контейнер, имитирующий список в сайдбаре
export const MockSidebarList: React.FC = () => {
    return (
        <aside className="w-72 bg-white border border-gray-200 rounded-lg flex flex-col shadow-md">
            <nav>
                <MockProjectListItem name="Обычный проект" postCount={8} />
                <MockProjectListItem name="Активный проект" postCount={12} isActive={true} />
                <MockProjectListItem name="Проект при наведении" postCount={5} isHovered={true} />
                <MockProjectListItem name="Проблема с доступом" postCount={0} status="error" />
                <MockProjectListItem name="Доступно обновление" postCount={15} status="update" />
                <MockProjectListItem name="Идет обновление..." postCount={10} status="loading" />
            </nav>
            <div className="px-4 pt-2 pb-2 mt-2 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Отключенные</h4>
            </div>
             <nav>
                <MockProjectListItem name="Отключенный проект" postCount={2} isDisabled={true} />
             </nav>
        </aside>
    );
};


// =====================================================================
// Интерактивные моки для песочницы
// =====================================================================

export const InteractiveSidebarHeader: React.FC = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };
    
    return (
        <div className="p-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-y-2 bg-white rounded-t-lg">
            <h2 className="text-lg font-bold text-gray-800">Проекты</h2>
            <div className="flex items-center flex-wrap justify-end gap-1">
                 <button title="Последовательно обновить все видимые проекты" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                </button>
                <button onClick={handleRefresh} disabled={isRefreshing} title="Обновить список проектов из базы" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-wait">
                    {isRefreshing ? (
                        <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                    )}
                </button>
                <button title="Обучение и документация" className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                </button>
                <button title="Управление пользователями" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                </button>
                <button title="Управление базой проектов" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" /></svg>
                </button>
                 <button title="Выйти" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export const InteractiveFilterPanel: React.FC = () => {
    type View = 'schedule' | 'suggested';
    type TeamFilter = string;
    type ContentFilter = 'all' | 'empty' | 'not_empty' | 'lt5' | '5-10' | 'gt10';

    const [activeView, setActiveView] = useState<View>('schedule');
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('All');
    const [contentFilter, setContentFilter] = useState<ContentFilter>('all');

    const mockTeams = ['Команда А', 'Команда B'];
    
    const getTeamFilterButtonClasses = (isActive: boolean) => 
        `px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${
            isActive ? 'ring-2 ring-indigo-500' : ''
        }`;
    
    const contentFilterStyles: Record<ContentFilter, string> = {
        all: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        empty: 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 hover:to-red-300',
        not_empty: 'bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 hover:to-blue-300',
        lt5: 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 hover:to-orange-300',
        '5-10': 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        gt10: 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 hover:to-green-300',
    };
    
    const getPostFilterButtonClasses = (filter: ContentFilter) => {
        const isActive = contentFilter === filter;
        const baseClasses = 'px-2.5 py-1 text-xs font-medium rounded-full transition-colors';
        const activeRingClass = isActive ? 'ring-2 ring-indigo-500' : '';
        return `${baseClasses} ${contentFilterStyles[filter]} ${activeRingClass}`;
    };

    return (
        <div className="bg-white rounded-b-lg">
            <div className="p-3 border-b border-gray-200">
                <div className="flex bg-gray-200 rounded-md p-1">
                    <button onClick={() => setActiveView('schedule')} className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${activeView === 'schedule' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Отложенные</button>
                    <button onClick={() => setActiveView('suggested')} className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-all ${activeView === 'suggested' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Предложенные</button>
                </div>
            </div>
            
            <div className="p-3 space-y-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Команды</h4>
                    <div className="flex flex-wrap gap-1.5">
                        <button onClick={() => setTeamFilter('All')} className={getTeamFilterButtonClasses(teamFilter === 'All')}>Все</button>
                        {mockTeams.map(team => (
                            <button key={team} onClick={() => setTeamFilter(team)} className={getTeamFilterButtonClasses(teamFilter === team)}>
                                {team}
                            </button>
                        ))}
                        <button onClick={() => setTeamFilter('NoTeam')} className={getTeamFilterButtonClasses(teamFilter === 'NoTeam')}>Без команды</button>
                    </div>
                </div>
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{activeView === 'schedule' ? 'Отложенные посты' : 'Предложенные посты'}</h4>
                    <div className="flex flex-wrap gap-1.5">
                         <button onClick={() => setContentFilter('all')} className={getPostFilterButtonClasses('all')}>Все</button>
                         <button onClick={() => setContentFilter('empty')} className={getPostFilterButtonClasses('empty')}>Нет постов</button>
                         <button onClick={() => setContentFilter('not_empty')} className={getPostFilterButtonClasses('not_empty')}>Есть посты</button>
                         <button onClick={() => setContentFilter('lt5')} className={getPostFilterButtonClasses('lt5')}>&lt; 5</button>
                         <button onClick={() => setContentFilter('5-10')} className={getPostFilterButtonClasses('5-10')}>5-10</button>
                         <button onClick={() => setContentFilter('gt10')} className={getPostFilterButtonClasses('gt10')}>&gt; 10</button>
                    </div>
                </div>
            </div>
        </div>
    );
};