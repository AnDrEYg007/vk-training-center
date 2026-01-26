import React, { useState } from 'react';
import { ContentProps, NavigationLink, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты (на основе реального Sidebar.tsx и ProjectListItem.tsx)
// =====================================================================

interface MockProject {
    id: string;
    name: string;
    count: number;
}

// Реальная логика цветов из ProjectListItem.tsx
const getPostCountColorClasses = (count: number, isActive: boolean): string => {
    if (isActive) {
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

const MockProjectItem: React.FC<{ 
    project: MockProject; 
    isActive: boolean;
    onClick: () => void;
}> = ({ project, isActive, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Выдвижные кнопки слева (как в реальном компоненте) */}
            <div className={`absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-gray-200 transition-transform duration-300 ease-in-out ${isHovered ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-1/2 left-0 -translate-y-1/2 flex items-center pl-2 space-x-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        title="Обновить данные"
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); }}
                        title="Настройки"
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-300 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
            </div>
            <button
                onClick={onClick}
                className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-[padding-left] duration-300 ease-in-out ${isHovered ? 'pl-24' : 'pl-4'} ${
                    isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-gray-100'
                }`}
            >
                <div className="flex items-center min-w-0">
                    <span className="truncate pr-1">{project.name}</span>
                </div>
                <div className="flex-shrink-0 w-8 h-4 flex items-center justify-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPostCountColorClasses(project.count, isActive)}`}>
                        {project.count}
                    </span>
                </div>
            </button>
        </div>
    );
};

const MockProjectsSidebar: React.FC<{ 
    projects: MockProject[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}> = ({ projects, selectedId, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<'All' | 'Команда А' | 'Команда Б' | 'NoTeam'>('All');
    const [contentFilter, setContentFilter] = useState<'all' | 'empty' | 'not_empty' | 'lt5' | '5-10' | 'gt10'>('all');

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesContent = true;
        switch (contentFilter) {
            case 'empty': matchesContent = p.count === 0; break;
            case 'not_empty': matchesContent = p.count > 0; break;
            case 'lt5': matchesContent = p.count > 0 && p.count < 5; break;
            case '5-10': matchesContent = p.count >= 5 && p.count <= 10; break;
            case 'gt10': matchesContent = p.count > 10; break;
        }
        
        return matchesSearch && matchesContent;
    });

    const getTeamFilterButtonClasses = (isActive: boolean) => 
        `px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 ${isActive ? 'ring-2 ring-indigo-500' : ''}`;

    const contentFilterStyles = {
        all: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        empty: 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 hover:to-red-300',
        not_empty: 'bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 hover:to-blue-300',
        lt5: 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 hover:to-orange-300',
        '5-10': 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        gt10: 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 hover:to-green-300',
    };

    const getPostFilterButtonClasses = (filter: typeof contentFilter) => {
        const isActive = contentFilter === filter;
        return `px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${contentFilterStyles[filter]} ${isActive ? 'ring-2 ring-indigo-500' : ''}`;
    };

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Шапка с кнопками обновления */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Проекты</h2>
                <div className="flex items-center gap-1">
                    <button
                        title="Глобальное обновление всех проектов"
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                    </button>
                    <button
                        title="Обновить список проектов из базы"
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                    </button>
                </div>
            </div>

            {/* Фильтры */}
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
                        <button onClick={() => setTeamFilter('Команда А')} className={getTeamFilterButtonClasses(teamFilter === 'Команда А')}>Команда А</button>
                        <button onClick={() => setTeamFilter('Команда Б')} className={getTeamFilterButtonClasses(teamFilter === 'Команда Б')}>Команда Б</button>
                        <button onClick={() => setTeamFilter('NoTeam')} className={getTeamFilterButtonClasses(teamFilter === 'NoTeam')}>Без команды</button>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Отложенные посты</h4>
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

            {/* Список проектов */}
            <nav className="flex-grow overflow-y-auto">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        <p>Проекты не найдены</p>
                    </div>
                ) : (
                    filteredProjects.map(project => (
                        <MockProjectItem
                            key={project.id}
                            project={project}
                            isActive={selectedId === project.id}
                            onClick={() => onSelect(project.id)}
                        />
                    ))
                )}
            </nav>

            {/* Блок текущего пользователя */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-indigo-600 text-sm font-medium">А</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Анна Смирнова</p>
                        <p className="text-xs text-gray-500">Пользователь</p>
                    </div>
                    <button
                        title="Выйти"
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 font-mono truncate">Backend: v1.2.3</p>
                </div>
            </div>
        </aside>
    );
};

const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
}> = ({ title, description, children, instructions }) => (
    <div className="not-prose relative p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-12">
        <h4 className="text-xl font-bold text-indigo-800 mb-2">{title}</h4>
        <p className="text-sm text-indigo-700 mb-4">{description}</p>
        {instructions && instructions.length > 0 && (
            <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1 mb-6">
                {instructions.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        )}
        {children}
    </div>
);

// =====================================================================
// Основной компонент
// =====================================================================
export const ProjectsSidebarIntro: React.FC<ContentProps> = ({ title }) => {
    const [selectedProject, setSelectedProject] = useState<string | null>('1');

    const mockProjects: MockProject[] = [
        { id: '1', name: 'Магазин электроники TECH', count: 12 },
        { id: '2', name: 'Кафе "Уютный уголок"', count: 3 },
        { id: '3', name: 'Фитнес-клуб "Энергия"', count: 0 },
        { id: '4', name: 'Салон красоты "Стиль"', count: 8 },
        { id: '5', name: 'Автосервис "Мастер"', count: 0 },
        { id: '6', name: 'Ресторан "Вкусно"', count: 15 },
        { id: '7', name: 'Книжный магазин', count: 1 },
        { id: '8', name: 'Детский центр', count: 6 },
    ];

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Это <strong>вторая колонка слева</strong> — появляется при выборе модуля из верхней группы главной панели. 
                Содержит список всех ваших проектов с возможностью поиска и фильтрации.
            </p>

            <div className="not-prose bg-indigo-50 border-l-4 border-indigo-500 p-4 my-6">
                <p className="text-sm text-indigo-900 mb-3">
                    <strong>Когда появляется:</strong> При выборе модулей из <strong>верхней группы</strong> главной панели:
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Контент-менеджмент
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Списки
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Работа с сообщениями <span className="text-xs">(в разработке)</span>
                    </span>
                    <span className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Статистика <span className="text-xs">(в разработке)</span>
                    </span>
                </div>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900 mb-3">
                    <strong>НЕ появляется:</strong> При выборе из <strong>нижней группы</strong> (глобальные действия):
                </p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" />
                        </svg>
                        База проектов
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        Центр обучения
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Настройки
                    </span>
                    <span className="px-3 py-1.5 bg-white border border-green-200 rounded-lg text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Выйти
                    </span>
                </div>
                <p className="text-xs text-green-800 mt-3">
                    Эти действия открывают отдельные страницы или выполняют действие, а не работают с проектами.
                </p>
            </div>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
                <p className="text-sm text-amber-900">
                    <strong>Функция:</strong> Быстрое переключение между проектами (сообществами VK) 
                    и визуальная индикация их состояния через цветовые счётчики.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Структура сайдбара */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура сайдбара</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сайдбар состоит из <strong>пяти частей</strong>. Каждая выполняет свою роль:
            </p>

            <div className="not-prose my-6 space-y-4">
                {/* 1. Шапка с кнопками - мини-превью */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        {/* Мини-превью реального интерфейса */}
                        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-gray-800">Проекты</span>
                                <div className="flex gap-1">
                                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                        </svg>
                                    </div>
                                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-1">Шапка с кнопками</p>
                            <p className="text-sm text-gray-600">Заголовок «Проекты» + две кнопки: глобальное обновление всех проектов и обновление списка из базы</p>
                        </div>
                    </div>
                </div>

                {/* 2. Поле поиска - мини-превью */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 shadow-sm w-36">
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-[10px] text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Поиск по названию...</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-1">Поле поиска</p>
                            <p className="text-sm text-gray-600">Введите часть названия проекта — список мгновенно отфильтруется</p>
                        </div>
                    </div>
                </div>

                {/* 3. Фильтр по командам - мини-превью */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                            <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Команды</p>
                            <div className="flex gap-1">
                                <span className="px-1.5 py-0.5 text-[9px] bg-gray-200 text-gray-700 rounded-full ring-1 ring-indigo-400">Все</span>
                                <span className="px-1.5 py-0.5 text-[9px] bg-gray-200 text-gray-700 rounded-full">СММ-1</span>
                                <span className="px-1.5 py-0.5 text-[9px] bg-gray-200 text-gray-600 rounded-full">...</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-1">Фильтр по командам</p>
                            <p className="text-sm text-gray-600">Показать проекты конкретной команды или все сразу. Удобно, когда у вас много проектов</p>
                        </div>
                    </div>
                </div>

                {/* 4. Фильтр по количеству постов - мини-превью */}
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 shadow-sm">
                            <p className="text-[8px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Посты</p>
                            <div className="flex gap-0.5 flex-wrap" style={{ maxWidth: '110px' }}>
                                <span className="px-1.5 py-0.5 text-[8px] bg-gray-300 text-gray-800 rounded-full">Все</span>
                                <span className="px-1.5 py-0.5 text-[8px] bg-gradient-to-t from-gray-300 to-red-200 text-red-900 rounded-full">0</span>
                                <span className="px-1.5 py-0.5 text-[8px] bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 rounded-full">&lt;5</span>
                                <span className="px-1.5 py-0.5 text-[8px] bg-gray-300 text-gray-700 rounded-full">5-10</span>
                                <span className="px-1.5 py-0.5 text-[8px] bg-gradient-to-t from-gray-300 to-green-200 text-green-900 rounded-full">&gt;10</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-1">Фильтр по количеству постов</p>
                            <p className="text-sm text-gray-600">Цветовая кодировка: красный = 0 постов, оранжевый = мало, серый = норма, зелёный = много</p>
                        </div>
                    </div>
                </div>

                {/* 5. Список проектов + блок пользователя - мини-превью */}
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-2 shadow-sm w-36">
                            {/* Мини-карточки проектов */}
                            <div className="space-y-1 mb-2">
                                <div className="flex items-center justify-between px-1.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded text-[9px]">
                                    <span className="text-gray-800 truncate">Салон красоты</span>
                                    <span className="px-1 bg-gradient-to-t from-gray-300 to-green-200 text-green-900 rounded-full text-[8px]">12</span>
                                </div>
                                <div className="flex items-center justify-between px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[9px]">
                                    <span className="text-gray-800 truncate">Автосервис</span>
                                    <span className="px-1 bg-gradient-to-t from-gray-300 to-red-200 text-red-900 rounded-full text-[8px]">0</span>
                                </div>
                            </div>
                            {/* Мини-блок пользователя */}
                            <div className="flex items-center gap-1 pt-1 border-t border-gray-200">
                                <div className="w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full"></div>
                                <span className="text-[8px] text-gray-600 truncate">Иван И.</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 mb-1">Список проектов + блок пользователя</p>
                            <p className="text-sm text-gray-600">Карточки проектов со счётчиком постов. Внизу — ваш аватар, имя и кнопка выхода</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Карточка проекта */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Элементы карточки проекта</h2>

            <div className="not-prose grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                    <div className="flex items-center justify-center mb-3">
                        <div className="px-4 py-2 bg-white border-2 border-blue-300 rounded-lg">
                            <p className="font-semibold text-gray-800 text-sm">Название проекта</p>
                        </div>
                    </div>
                    <h3 className="font-bold text-blue-900 text-center mb-2">Название</h3>
                    <p className="text-sm text-gray-700 text-center">
                        Текст обрезается троеточием, если слишком длинный
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-5">
                    <div className="flex items-center justify-center mb-3 gap-2">
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium rounded-full text-xs">0</span>
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium rounded-full text-xs">3</span>
                        <span className="px-2 py-0.5 bg-gray-300 text-gray-700 rounded-full text-xs">7</span>
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium rounded-full text-xs">12</span>
                    </div>
                    <h3 className="font-bold text-purple-900 text-center mb-2">Счётчик</h3>
                    <p className="text-sm text-gray-700 text-center">
                        Число постов с цветом: 0=красный, 1-4=оранжевый, 5-10=серый, 11+=зелёный
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                    <div className="flex items-center justify-center mb-3 gap-2">
                        <button className="p-2 bg-white rounded-full border-2 border-green-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        </button>
                        <button className="p-2 bg-white rounded-full border-2 border-green-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                    </div>
                    <h3 className="font-bold text-green-900 text-center mb-2">Выдвижные кнопки</h3>
                    <p className="text-sm text-gray-700 text-center">
                        При наведении слева появляются кнопки: <strong>Обновить</strong> и <strong>Настройки</strong>.
                        Подробнее о них — в <em>Разделе 2.1.1 "Сайдбар проектов"</em>.
                    </p>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="Попробуйте сами: Работа с сайдбаром проектов"
                description="Полнофункциональный сайдбар с поиском, фильтрами и выбором проектов."
                instructions={[
                    '<strong>Кликните</strong> на проект, чтобы выбрать его (подсветится синим).',
                    '<strong>Введите</strong> текст в поиск, чтобы отфильтровать список.',
                    '<strong>Раскройте</strong> меню фильтров и выберите "Требуют внимания" — покажутся только проекты с 0 постов.',
                    'Обратите внимание на <strong>цветовые счётчики</strong> (зелёный/жёлтый/красный).'
                ]}
            >
                <div className="bg-gray-100 rounded-lg p-6 flex justify-center">
                    <div className="h-[600px] overflow-hidden rounded-lg border-2 border-gray-300 shadow-xl">
                        <MockProjectsSidebar 
                            projects={mockProjects}
                            selectedId={selectedProject}
                            onSelect={setSelectedProject}
                        />
                    </div>
                </div>
                {selectedProject && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700">
                            <strong>Выбран проект:</strong>{' '}
                            <span className="text-green-600 font-bold">
                                {mockProjects.find(p => p.id === selectedProject)?.name}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            В реальном приложении рабочая область справа загрузит данные этого проекта.
                        </p>
                    </div>
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Цветовые индикаторы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Цветовые индикаторы счётчиков</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-4">
                Система из <strong>4 уровней</strong> для быстрой оценки состояния проекта:
            </p>

            <div className="not-prose grid md:grid-cols-4 gap-3 my-6">
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-red-900">Красный</h3>
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium rounded-full text-xs">
                            0
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Критично!</strong> Нет отложенных постов.
                    </p>
                </div>

                <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-orange-900">Оранжевый</h3>
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium rounded-full text-xs">
                            1-4
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Внимание!</strong> Мало постов, скоро закончатся.
                    </p>
                </div>

                <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800">Серый</h3>
                        <span className="px-2 py-0.5 bg-gray-300 text-gray-700 rounded-full text-xs">
                            5-10
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Нормально.</strong> Запас постов на несколько дней.
                    </p>
                </div>

                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-green-900">Зелёный</h3>
                        <span className="px-2 py-0.5 bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium rounded-full text-xs">
                            11+
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Отлично!</strong> Большой запас контента.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Полезные функции */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ключевые возможности</h2>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Поиск в реальном времени
                    </h4>
                    <p className="text-sm text-gray-700">
                        Начните вводить название — список обновится мгновенно без задержек.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        Фильтр по командам
                    </h4>
                    <p className="text-sm text-gray-700">
                        Покажите только проекты конкретной команды или без команды.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фильтр по количеству постов
                    </h4>
                    <p className="text-sm text-gray-700">
                        Кнопки с цветовой кодировкой: "Нет постов" (красный), "&lt;5" (оранжевый), "5-10" (серый), "&gt;10" (зелёный).
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Выдвижные кнопки на карточках
                    </h4>
                    <p className="text-sm text-gray-700">
                        Наведите курсор на проект — слева выдвинутся кнопки "Обновить" и "Настройки".
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <div className="not-prose my-6 space-y-3">
                <NavigationLink 
                    to="1-2-1-primary-sidebar-intro"
                    title="1.2.1. Главная навигационная панель"
                    description="Вернуться к описанию левой панели с иконками"
                    variant="prev"
                />
                <NavigationLink 
                    to="1-2-3-workspace-intro"
                    title="1.2.3. Рабочая область"
                    description="Основная часть экрана справа, где отображается контент проекта"
                    variant="next"
                />
            </div>

            <NavigationButtons currentPath="1-2-2-projects-sidebar-intro" />
        </article>
    );
};
