
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Project } from '../../../shared/types';
import { TeamFilter, ContentFilter } from '../types';
import { AppView } from '../../../App';
import { ProjectListItem } from './ProjectListItem';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import * as api from '../../../services/api';
import { pollTask } from '../../../services/api/lists.api';
import { useProjects } from '../../../contexts/ProjectsContext'; // Import context
import { useAuth } from '../../../features/auth/contexts/AuthContext';

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
    
    // Получаем данные текущего пользователя
    const { user, logout } = useAuth();
    
    // Данные VK пользователя из БД
    const [vkUserData, setVkUserData] = useState<{
        vk_user_id: string;
        first_name: string;
        last_name: string;
        photo_url: string | null;
    } | null>(null);
    
    // Версия бэкенда
    const [backendVersion, setBackendVersion] = useState<string>('...');
    
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

    // Загружаем версию бэкенда и VK пользователя при монтировании
    useEffect(() => {
        api.getBackendVersion().then(setBackendVersion);
    }, []);
    
    // Загружаем данные VK пользователя из БД только если авторизован через VK
    useEffect(() => {
        // Сбрасываем сразу при любом изменении user
        setVkUserData(null);
        
        if (user?.vk_user_id) {
            fetch('http://127.0.0.1:8000/api/vk-test/users/current')
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    if (data && user?.vk_user_id) {
                        setVkUserData(data);
                    }
                })
                .catch(err => console.error('Failed to load VK user:', err));
        }
    }, [user]); // Зависимость от всего user, а не только vk_user_id

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
            
            {/* Блок текущего пользователя */}
            {user && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex items-center gap-3">
                        {/* Аватар */}
                        {(vkUserData?.photo_url || user.photo_url) ? (
                            <img 
                                src={vkUserData?.photo_url || user.photo_url} 
                                alt={user.username}
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-600 text-sm font-medium">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        
                        {/* Имя и роль */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.vk_user_id && vkUserData 
                                    ? `${vkUserData.first_name} ${vkUserData.last_name}` 
                                    : user.username}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                {user.vk_user_id ? (
                                    <>
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" fill="#0077FF"/>
                                            <path d="M12.766 16.489h.858s.259-.028.391-.169c.121-.129.117-.372.117-.372s-.017-1.136.51-1.303c.52-.164 1.188 1.093 1.897 1.577.536.366.943.286.943.286l1.896-.026s.991-.061.521-.84c-.038-.063-.274-.573-1.411-1.619-1.19-1.095-1.031-.918.403-2.812.873-1.155 1.222-1.86 1.113-2.163-.104-.288-.743-.212-.743-.212l-2.135.013s-.158-.022-.275.048c-.114.069-.188.23-.188.23s-.337.899-.787 1.664c-.949 1.614-1.328 1.699-1.483 1.599-.36-.234-.27-1.059-.27-1.624 0-1.765.268-2.501-.521-2.692-.262-.063-.455-.105-1.124-.112-.858-.009-1.585.003-1.996.204-.273.134-.484.432-.355.449.158.021.517.097.707.356.245.335.236 1.087.236 1.087s.141 2.076-.328 2.334c-.322.177-.764-.184-1.713-1.636-.486-.743-.853-1.565-.853-1.565s-.071-.173-.197-.266c-.153-.112-.366-.148-.366-.148l-2.028.013s-.304.009-.416.141c-.1.117-.008.36-.008.36s1.585 3.71 3.379 5.578c1.645 1.714 3.513 1.601 3.513 1.601z" fill="#fff"/>
                                        </svg>
                                        VK Пользователь
                                    </>
                                ) : (
                                    user.role === 'admin' ? 'Администратор' : 'Пользователь'
                                )}
                            </p>
                        </div>
                        
                        {/* Кнопка выхода */}
                        <button
                            onClick={logout}
                            title="Выйти"
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                    {/* Версия бэкенда */}
                    <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-[10px] text-gray-400 font-mono truncate" title={`Backend: ${backendVersion}`}>
                            Backend: {backendVersion}
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
};
