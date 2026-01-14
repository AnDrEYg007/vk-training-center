
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project } from '../../../shared/types';
import { TeamFilter, ContentFilter } from '../types';
import { AppView } from '../../../App';
import { ProjectListItem } from './ProjectListItem';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import * as api from '../../../services/api';
import { pollTask } from '../../../services/api/lists.api';
import { useProjects } from '../../../contexts/ProjectsContext'; // Import context

export const Sidebar: React.FC<{
    projects: Project[];
    activeProjectId: string | null;
    activeView: AppView;
    scheduledPostCounts: Record<string, number>;
    suggestedPostCounts: Record<string, number>;
    isLoadingCounts: boolean;
    isCheckingForUpdatesProjectId: string | null;
    projectPermissionErrors: Record<string, string | null>;
    updatedProjectIds: Set<string>;
    onSelectProject: (id: string | null) => void;
    onOpenSettings: (project: Project) => void;
    onRefreshProject: (projectId: string, view: AppView, silent?: boolean) => Promise<number>;
    onForceRefresh: () => Promise<void>;
}> = ({ 
    projects, 
    activeProjectId, 
    activeView,
    scheduledPostCounts,
    suggestedPostCounts,
    isLoadingCounts: initialIsLoadingCounts,
    isCheckingForUpdatesProjectId,
    projectPermissionErrors,
    updatedProjectIds,
    onSelectProject, 
    onOpenSettings, 
    onRefreshProject, 
    onForceRefresh 
}) => {
    // Получаем статусы конкурсов из контекста
    const { reviewsContestStatuses } = useProjects();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('All');
    const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
    const [showDisabled, setShowDisabled] = useState(true);
    
    const [isForceRefreshing, setIsForceRefreshing] = useState(false);
    const [isLoadingCounts, setIsLoadingCounts] = useState(initialIsLoadingCounts);

    // State for mass update (server-side)
    const [isMassUpdating, setIsMassUpdating] = useState(false);
    const [massUpdateProgress, setMassUpdateProgress] = useState<string>('');
    const [showMassUpdateConfirm, setShowMassUpdateConfirm] = useState(false);
    
    // State to track which project is currently being processed by the backend task
    const [processingProjectId, setProcessingProjectId] = useState<string | null>(null);
    const lastProcessedIdRef = useRef<string | null>(null);

    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        projects.forEach(p => {
            if (p.team) {
                teams.add(p.team);
            }
        });
        return Array.from(teams).sort();
    }, [projects]);

    const postCounts = useMemo(() => {
        if (activeView === 'schedule') return scheduledPostCounts;
        if (activeView === 'suggested') return suggestedPostCounts;
        // Для вкладки "Товары" и других возвращаем пустой объект, чтобы счетчики не отображались
        return {};
    }, [activeView, scheduledPostCounts, suggestedPostCounts]);
    
    useEffect(() => {
        setIsLoadingCounts(initialIsLoadingCounts);
    }, [initialIsLoadingCounts]);
    
    const handleForceRefreshClick = async () => {
        setIsForceRefreshing(true);
        await onForceRefresh();
        setIsForceRefreshing(false);
    };

    const { filteredEnabledProjects, filteredDisabledProjects } = useMemo(() => {
        const checkVisibility = (p: Project): boolean => {
            // Общие фильтры
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (teamFilter !== 'All') {
                if (teamFilter === 'NoTeam' && p.team) return false;
                if (teamFilter !== 'NoTeam' && p.team !== teamFilter) return false;
            }

            // Фильтр по контенту, применяется только для вкладок с постами
            if (activeView === 'schedule' || activeView === 'suggested') {
                const count = postCounts[p.id] ?? 0;
                switch (contentFilter) {
                    case 'empty': if (count !== 0) return false; break;
                    case 'not_empty': if (count === 0) return false; break;
                    case 'lt5': if (!(count > 0 && count < 5)) return false; break;
                    case '5-10': if (!(count >= 5 && count <= 10)) return false; break;
                    case 'gt10': if (count <= 10) return false; break;
                    default: break;
                }
            }
            return true;
        };

        const enabled: Project[] = [];
        const disabled: Project[] = [];
        projects.forEach(p => {
            if (checkVisibility(p)) {
                (p.disabled ? disabled : enabled).push(p);
            }
        });
        return { filteredEnabledProjects: enabled, filteredDisabledProjects: disabled };
    }, [projects, searchQuery, teamFilter, contentFilter, postCounts, activeView]);

    const handleConfirmMassUpdate = async () => {
        setShowMassUpdateConfirm(false);
        setIsMassUpdating(true);
        setProcessingProjectId(null);
        lastProcessedIdRef.current = null;
        
        try {
            // 1. Запускаем задачу на сервере, передавая текущий вид (чтобы обновить либо отложку, либо предложку)
            const { taskId } = await api.bulkRefreshProjects(activeView);
            
            // 2. Поллим статус задачи
            await pollTask(taskId, (progress) => {
                if (progress.status === 'fetching' || progress.status === 'processing') {
                     const percent = progress.total ? Math.round((progress.loaded! / progress.total) * 100) : 0;
                     setMassUpdateProgress(`${percent}%`);

                     // Парсим ID проекта из сообщения вида "[PID:123] Обработка..."
                     if (progress.message && progress.message.includes('[PID:')) {
                        const match = progress.message.match(/\[PID:([^\]]+)\]/);
                        if (match && match[1]) {
                            const currentId = match[1];
                            
                            // Если ID сменился, значит предыдущий проект завершен.
                            // Запускаем "тихое" обновление (silent refresh) для предыдущего проекта,
                            // чтобы подтянуть новые счетчики и флаги ошибок из базы.
                            if (lastProcessedIdRef.current && lastProcessedIdRef.current !== currentId) {
                                onRefreshProject(lastProcessedIdRef.current, activeView, true).catch(console.error);
                            }
                            
                            setProcessingProjectId(currentId);
                            lastProcessedIdRef.current = currentId;
                        }
                     }

                } else if (progress.status === 'pending') {
                    setMassUpdateProgress('Wait');
                }
            });
            
            // Обновляем последний обработанный проект после завершения задачи
            if (lastProcessedIdRef.current) {
                onRefreshProject(lastProcessedIdRef.current, activeView, true).catch(console.error);
            }
            
            window.showAppToast?.('Глобальное обновление завершено. Данные обновлены.', 'success');

        } catch (error) {
            console.error("Error during mass update task:", error);
            window.showAppToast?.(`Ошибка при запуске массового обновления: ${error instanceof Error ? error.message : String(error)}`, 'error');
        } finally {
            setIsMassUpdating(false);
            setMassUpdateProgress('');
            setProcessingProjectId(null);
            lastProcessedIdRef.current = null;
        }
    };
    
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

    // Определяем, нужно ли показывать статус конкурса
    const showContestStatus = activeView === 'automations-reviews-contest';

    const renderProjectList = (projectList: Project[], startIndex: number = 0) => {
        return projectList.map((p, i) => (
             <ProjectListItem
                key={p.id}
                project={p}
                isActive={activeProjectId === p.id}
                postCount={postCounts[p.id]}
                isLoadingCount={isLoadingCounts}
                isCheckingForUpdates={isCheckingForUpdatesProjectId === p.id}
                isSequentiallyUpdating={processingProjectId === p.id} 
                errorDetails={projectPermissionErrors[p.id] || null}
                hasUpdate={updatedProjectIds.has(p.id)}
                onSelectProject={onSelectProject}
                onRefreshProject={(id) => onRefreshProject(id, activeView, false)}
                onOpenSettings={onOpenSettings}
                animationIndex={startIndex + i}
                // Передаем статус конкурса, если мы на нужной вкладке
                contestStatus={showContestStatus ? reviewsContestStatuses[p.id] : undefined}
            />
        ));
    };
    
    // Динамический текст для модального окна в зависимости от активной вкладки
    const massUpdateTargetText = activeView === 'suggested' 
        ? 'предложенных постов' 
        : activeView === 'products'
            ? 'товаров'
            : 'расписания (отложенные + опубликованные)';

    return (
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800">Проекты</h2>
                <div className="flex items-center gap-1">
                     <button
                        onClick={() => setShowMassUpdateConfirm(true)}
                        disabled={isMassUpdating || isLoadingCounts}
                        title={`Запустить глобальное обновление ${massUpdateTargetText} для всех проектов`}
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-wait relative"
                    >
                        {isMassUpdating ? (
                            <>
                                <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                                {massUpdateProgress && <span className="absolute -bottom-2 right-0 text-[9px] font-bold text-indigo-600">{massUpdateProgress}</span>}
                            </>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={handleForceRefreshClick}
                        disabled={isForceRefreshing || isMassUpdating}
                        title="Обновить список проектов из базы"
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-wait"
                    >
                        {isForceRefreshing ? (
                            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        )}
                    </button>
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
                        {uniqueTeams.map(team => (
                            <button key={team} onClick={() => setTeamFilter(team)} className={getTeamFilterButtonClasses(teamFilter === team)}>
                                {team}
                            </button>
                        ))}
                        <button onClick={() => setTeamFilter('NoTeam')} className={getTeamFilterButtonClasses(teamFilter === 'NoTeam')}>Без команды</button>
                    </div>
                </div>

                {/* Фильтр по контенту отображается только для вкладок с постами */}
                {(activeView === 'schedule' || activeView === 'suggested') && (
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
                )}
            </div>

            <nav className="flex-grow overflow-y-auto custom-scrollbar">
                {isLoadingCounts && projects.length > 0 && (
                    <div className="p-4 space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                )}
                {!isLoadingCounts && renderProjectList(filteredEnabledProjects)}

                {filteredDisabledProjects.length > 0 && (
                    <div className="flex justify-between items-center px-4 pt-4 pb-2 mt-2 border-t border-gray-200">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Отключенные</h4>
                        <button
                            onClick={() => setShowDisabled(prev => !prev)}
                            title={showDisabled ? "Скрыть" : "Показать"}
                            className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-700"
                        >
                            {showDisabled ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" /></svg>
                            )}
                        </button>
                    </div>
                )}
                
                {!isLoadingCounts && showDisabled && renderProjectList(filteredDisabledProjects, filteredEnabledProjects.length)}
            </nav>
            {showMassUpdateConfirm && (
                <ConfirmationModal
                    title="Глобальное обновление"
                    message={`Вы уверены, что хотите запустить обновление данных (${massUpdateTargetText}) для ВСЕХ активных проектов на сервере?\n\nЭто тяжелая операция, которая займет время. Она будет выполняться в фоне.`}
                    onConfirm={handleConfirmMassUpdate}
                    onCancel={() => setShowMassUpdateConfirm(false)}
                    confirmText="Да, запустить"
                    cancelText="Отмена"
                />
            )}
        </aside>
    );
};
