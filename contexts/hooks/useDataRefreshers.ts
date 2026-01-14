import React, { useState, useCallback } from 'react';
import { Project, AllPosts, ScheduledPost, SuggestedPost, Note, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../shared/types';
import * as api from '../../services/api';
import { interpretApiError } from '../../services/errorService';
import { AppView } from '../../App';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';

// Типы для пропсов хука
interface UseDataRefreshersProps {
    initialProjects: Project[];
    projects: Project[]; setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    allPosts: AllPosts; setAllPosts: React.Dispatch<React.SetStateAction<AllPosts>>;
    allScheduledPosts: Record<string, ScheduledPost[]>; setAllScheduledPosts: React.Dispatch<React.SetStateAction<Record<string, ScheduledPost[]>>>;
    allSuggestedPosts: Record<string, SuggestedPost[]>; setAllSuggestedPosts: React.Dispatch<React.SetStateAction<Record<string, SuggestedPost[]>>>;
    allSystemPosts: Record<string, SystemPost[]>; setAllSystemPosts: React.Dispatch<React.SetStateAction<Record<string, SystemPost[]>>>;
    allNotes: Record<string, Note[]>; setAllNotes: React.Dispatch<React.SetStateAction<Record<string, Note[]>>>;
    scheduledPostCounts: Record<string, number>; setScheduledPostCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    suggestedPostCounts: Record<string, number>; setSuggestedPostCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    allGlobalVarDefs: GlobalVariableDefinition[]; setAllGlobalVarDefs: React.Dispatch<React.SetStateAction<GlobalVariableDefinition[]>>;
    allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]>; setAllGlobalVarValues: React.Dispatch<React.SetStateAction<Record<string, ProjectGlobalVariableValue[]>>>;
    updatedProjectIds: Set<string>; setUpdatedProjectIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

/**
 * Хук, который инкапсулирует ВСЕ функции для обновления, синхронизации и сохранения данных.
 * Он принимает состояния и их сеттеры из основного контекста.
 */
export const useDataRefreshers = ({
    initialProjects, projects, setProjects,
    allPosts, setAllPosts,
    allScheduledPosts, setAllScheduledPosts,
    allSuggestedPosts, setAllSuggestedPosts,
    allSystemPosts, setAllSystemPosts,
    allNotes, setAllNotes,
    scheduledPostCounts, setScheduledPostCounts,
    suggestedPostCounts, setSuggestedPostCounts,
    allGlobalVarDefs, setAllGlobalVarDefs,
    allGlobalVarValues, setAllGlobalVarValues,
    updatedProjectIds, setUpdatedProjectIds,
}: UseDataRefreshersProps) => {

    const [projectPermissionErrors, setProjectPermissionErrors] = useLocalStorage<Record<string, string | null>>('projectPermissionErrors', {});
    const [projectEmptyScheduleNotices, setProjectEmptyScheduleNotices] = useState<Record<string, string | null>>({});
    const [projectEmptySuggestedNotices, setProjectEmptySuggestedNotices] = useState<Record<string, string | null>>({});
    const [isCheckingForUpdates, setIsCheckingForUpdates] = useState<string | null>(null);

    // --- Индивидуальные рефрешеры ---

    const handleRefreshPublished = useCallback(async (projectId: string): Promise<void> => {
        const project = projects.find(p => p.id === projectId);
        console.log(`Обновление опубликованных постов для проекта ${projectId} из VK...`);
        try {
            // 1. Обновляем данные из VK (синхронизация)
            await api.refreshPublishedPosts(projectId);
            
            // 2. Запрашиваем свежие данные из кэша БД (гарантирует наличие тегов и корректность связей)
            // Это решает проблему "гонки", когда теги могли не успеть подгрузиться в ответе refreshPublishedPosts
            const cachedPosts = await api.getCachedPublishedPosts(projectId);
            
            setAllPosts(prev => ({ ...prev, [projectId]: cachedPosts }));
        } catch (error) {
            const errorAction = interpretApiError(error, { projectId, projectName: project?.name });
            if (errorAction.type === 'PERMISSION_ERROR' && errorAction.projectId) {
                setProjectPermissionErrors(prev => ({ ...prev, [errorAction.projectId!]: errorAction.message }));
            }
            console.error(`Ошибка при обновлении опубликованных постов для ${projectId}:`, error);
            throw error;
        }
    }, [projects, setProjectPermissionErrors]);

    const handleRefreshScheduled = useCallback(async (projectId: string): Promise<ScheduledPost[]> => {
        const project = projects.find(p => p.id === projectId);
        console.log(`Обновление отложенных постов для проекта ${projectId} из VK...`);
        try {
            // 1. Обновляем данные из VK (синхронизация)
            await api.refreshScheduledPosts(projectId);
            
            // 2. Запрашиваем свежие данные из кэша БД (гарантирует наличие тегов и корректность связей)
            // Это решает проблему "гонки", когда теги могли не успеть подгрузиться в ответе refreshScheduledPosts
            const cachedPosts = await api.getCachedScheduledPosts(projectId);
            
            setAllScheduledPosts(prev => ({ ...prev, [projectId]: cachedPosts }));
            
            // Обновляем общий счетчик, включая системные посты
            setScheduledPostCounts(prev => ({
                 ...prev, 
                 [projectId]: cachedPosts.length + (allSystemPosts[projectId]?.length || 0)
            }));


            if (cachedPosts.length === 0 && (allSystemPosts[projectId]?.length || 0) === 0) {
                setProjectEmptyScheduleNotices(prev => ({ ...prev, [projectId]: 'Отложенные и системные посты не найдены.' }));
            } else {
                setProjectEmptyScheduleNotices(prev => {
                    const newNotices = { ...prev };
                    delete newNotices[projectId];
                    return newNotices;
                });
            }
            return cachedPosts;
        } catch (error) {
            const errorAction = interpretApiError(error, { projectId, projectName: project?.name });
            if (errorAction.type === 'PERMISSION_ERROR' && errorAction.projectId) {
                setProjectPermissionErrors(prev => ({ ...prev, [errorAction.projectId!]: errorAction.message }));
            }
            console.error(`Ошибка при обновлении отложенных постов для ${projectId}:`, error);
            throw error;
        }
    }, [projects, allSystemPosts, setProjectPermissionErrors]);

    const handleRefreshSuggested = useCallback(async (projectId: string): Promise<SuggestedPost[]> => {
        const project = projects.find(p => p.id === projectId);
        console.log(`Обновление предложенных постов для проекта ${projectId} из VK...`);
        try {
            const refreshedPosts = await api.refreshSuggestedPosts(projectId);
            setAllSuggestedPosts(prev => ({ ...prev, [projectId]: refreshedPosts }));
            setSuggestedPostCounts(prev => ({ ...prev, [projectId]: refreshedPosts.length }));

            if (refreshedPosts.length === 0) {
                setProjectEmptySuggestedNotices(prev => ({ ...prev, [projectId]: 'Предложенные посты не найдены. Очередь пуста.' }));
            } else {
                setProjectEmptySuggestedNotices(prev => {
                    const newNotices = { ...prev };
                    delete newNotices[projectId];
                    return newNotices;
                });
            }
            return refreshedPosts;
        } catch (error) {
            const errorAction = interpretApiError(error, { projectId, projectName: project?.name });
            if (errorAction.type === 'PERMISSION_ERROR' && errorAction.projectId) {
                setProjectPermissionErrors(prev => ({ ...prev, [errorAction.projectId!]: errorAction.message }));
            }
            console.error(`Ошибка при обновлении предложенных постов для ${projectId}:`, error);
            throw error;
        }
    }, [projects, setProjectPermissionErrors]);

    const handleRefreshAllSchedule = useCallback(async (projectId: string): Promise<void> => {
        const project = projects.find(p => p.id === projectId);
        console.log(`Полное обновление расписания для проекта ${projectId}...`);
        try {
            const { published, scheduled } = await api.refreshAllScheduleData(projectId);
            
            setAllPosts(prev => ({ ...prev, [projectId]: published }));
            setAllScheduledPosts(prev => ({ ...prev, [projectId]: scheduled }));
            
            // Update counts
             setScheduledPostCounts(prev => ({
                 ...prev, 
                 [projectId]: scheduled.length + (allSystemPosts[projectId]?.length || 0)
            }));
            
            // Update empty notices
             if (scheduled.length === 0 && (allSystemPosts[projectId]?.length || 0) === 0) {
                setProjectEmptyScheduleNotices(prev => ({ ...prev, [projectId]: 'Отложенные и системные посты не найдены.' }));
            } else {
                setProjectEmptyScheduleNotices(prev => {
                    const newNotices = { ...prev };
                    delete newNotices[projectId];
                    return newNotices;
                });
            }

        } catch (error) {
             const errorAction = interpretApiError(error, { projectId, projectName: project?.name });
            if (errorAction.type === 'PERMISSION_ERROR' && errorAction.projectId) {
                setProjectPermissionErrors(prev => ({ ...prev, [errorAction.projectId!]: errorAction.message }));
            }
            console.error(`Ошибка при полном обновлении расписания для ${projectId}:`, error);
            throw error;
        }
    }, [projects, allSystemPosts, setProjectPermissionErrors]);


    // --- Комплексные рефрешеры ---

    const handleRefreshForSidebar = useCallback(async (projectId: string, activeView: AppView, silent: boolean = false): Promise<number> => {
        const refreshPromises = [];
        
        if (activeView === 'schedule') {
            refreshPromises.push(handleRefreshScheduled(projectId));
            refreshPromises.push(handleRefreshPublished(projectId));
            const notesPromise = api.getNotes(projectId).then(notes => {
                setAllNotes(prev => ({ ...prev, [projectId]: notes }));
                return notes;
            });
            refreshPromises.push(notesPromise);
        } else if (activeView === 'products') {
             // Обновление товаров. Мы просто вызываем API для обновления кеша на бэкенде.
             // Данные не сохраняются в глобальный контекст ProjectsContext, так как они изолированы в модуле товаров.
             console.log(`Обновление товаров для проекта ${projectId} из VK...`);
             const marketPromise = api.refreshMarketData(projectId).then(data => {
                 // Возвращаем количество товаров, чтобы хоть как-то отреагировать, если нужно
                 return data.items.length;
             });
             refreshPromises.push(marketPromise);
        } else {
            // Fallback для 'suggested'
            refreshPromises.push(handleRefreshSuggested(projectId));
        }

        const results = await Promise.allSettled(refreshPromises);
        const allSucceeded = results.every(r => r.status === 'fulfilled');

        if (allSucceeded) {
            console.log(`Полное обновление для проекта ${projectId} успешно. Снимаем флаг ошибки доступа.`);
            setProjectPermissionErrors(prev => {
                if (!prev[projectId]) return prev;
                const newErrors = { ...prev };
                delete newErrors[projectId];
                return newErrors;
            });
            // alert removed here for UX
        } else {
            if (!silent) {
                const failedResult = results.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
                if (failedResult) {
                    const project = projects.find(p => p.id === projectId);
                    const errorAction = interpretApiError(failedResult.reason, { projectId, projectName: project?.name });
                    window.showAppToast?.(errorAction.message, 'error');
                }
            }
        }

        setUpdatedProjectIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(projectId);
            return newSet;
        });

        let count = 0;
        const mainResult = results[0];
        if (mainResult.status === 'fulfilled') {
            // Если это число (как в случае с товарами), используем его
            if (typeof mainResult.value === 'number') {
                count = mainResult.value;
            } else if (Array.isArray(mainResult.value)) {
                 count = mainResult.value.length;
            }
        } else {
            count = (activeView === 'schedule' ? scheduledPostCounts[projectId] : suggestedPostCounts[projectId]) ?? 0;
        }
        return count;
    }, [
        projects,
        handleRefreshScheduled,
        handleRefreshPublished,
        handleRefreshSuggested,
        setProjectPermissionErrors,
        scheduledPostCounts,
        suggestedPostCounts,
        setUpdatedProjectIds,
        setAllNotes
    ]);

    const syncDataForProject = useCallback(async (projectId: string, activeView: AppView) => {
        console.log(`Проект ${projectId} помечен как обновленный. Запускаем фоновую синхронизацию из БД для вида "${activeView}"...`);
        setIsCheckingForUpdates(projectId);
        try {
            const { 
                allPosts: postsFromDb, 
                allScheduledPosts: scheduledFromDb, 
                allSuggestedPosts: suggestedFromDb,
                // FIX: Correctly destructure `allSystemPosts` from the API response.
                allSystemPosts: systemFromDb,
                allNotes: notesFromDb,
            } = await api.getAllPostsForProjects([projectId]);
            
            if (activeView === 'schedule') {
                setAllPosts(prev => ({ ...prev, [projectId]: postsFromDb[projectId] || [] }));
                setAllScheduledPosts(prev => ({ ...prev, [projectId]: scheduledFromDb[projectId] || [] }));
                setAllSystemPosts(prev => ({ ...prev, [projectId]: systemFromDb[projectId] || [] }));
                setAllNotes(prev => ({ ...prev, [projectId]: notesFromDb[projectId] || [] }));
                
                const newCount = (scheduledFromDb[projectId]?.length || 0) + (systemFromDb[projectId]?.length || 0);
                setScheduledPostCounts(prev => ({ ...prev, [projectId]: newCount }));
                
                console.log(`Фоновая синхронизация для 'schedule' завершена.`);

            } else if (activeView === 'suggested') {
                setAllSuggestedPosts(prev => ({ ...prev, [projectId]: suggestedFromDb[projectId] || [] }));
                
                const newCount = suggestedFromDb[projectId]?.length || 0;
                setSuggestedPostCounts(prev => ({ ...prev, [projectId]: newCount }));

                console.log(`Фоновая синхронизация для 'suggested' завершена.`);
            }
        } catch (error) {
            console.error(`Ошибка фоновой синхронизации для проекта ${projectId}:`, error);
        } finally {
            setIsCheckingForUpdates(null);
            setUpdatedProjectIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(projectId);
                return newSet;
            });
        }
    }, [setAllNotes, setAllPosts, setAllScheduledPosts, setAllSuggestedPosts, setAllSystemPosts, setScheduledPostCounts, setSuggestedPostCounts, setUpdatedProjectIds]);
    
    // --- Действия по сохранению/обновлению ---

    const handleNotesUpdate = async (projectId?: string) => {
        try {
             if (projectId) {
                 const notes = await api.getNotes(projectId);
                 setAllNotes(prev => ({
                     ...prev,
                     [projectId]: notes
                 }));
             } else {
                 const projectIds = projects.map(p => p.id);
                 if (projectIds.length > 0) {
                    const { allNotes: notesFromDb } = await api.getAllPostsForProjects(projectIds);
                    setAllNotes(notesFromDb);
                 }
             }
        } catch (error) {
            console.error("Не удалось обновить заметки:", error);
            window.showAppToast?.("Произошла ошибка при обновлении заметок.", 'error');
        }
    };

    const handleUpdateProjectSettings = async (updatedProject: Project) => {
        try {
            const savedProject = await api.updateProjectSettings(updatedProject);
            setProjects(prevProjects =>
                prevProjects.map(p => (p.id === savedProject.id ? savedProject : p))
            );
        } catch (error) {
            console.error("Не удалось сохранить настройки проекта:", error);
            window.showAppToast?.(`Не удалось сохранить настройки проекта. Проверьте ваше соединение с интернетом и попробуйте снова.`, 'error');
            throw error;
        }
    };

    const handleForceRefreshProjects = async () => {
        try {
            const { projects: refreshedProjects, suggestedPostCounts: refreshedSuggestedCounts } = await api.forceRefreshProjects();
            setProjects(refreshedProjects);
            if (refreshedSuggestedCounts) {
                setSuggestedPostCounts(refreshedSuggestedCounts);
            }

            setAllPosts({});
            setAllScheduledPosts({});
            setScheduledPostCounts({});
            setAllSuggestedPosts({});
            setAllSystemPosts({});
            setAllNotes({});
            setProjectPermissionErrors({});
            setAllGlobalVarDefs([]);
            setAllGlobalVarValues({});
            setProjectEmptyScheduleNotices({});
            setProjectEmptySuggestedNotices({});

            if (refreshedProjects.length > 0) {
                const projectIds = refreshedProjects.map(p => p.id);
                const { 
                    allPosts: postsFromDb, 
                    allScheduledPosts: scheduledFromDb, 
                    allSuggestedPosts: suggestedFromDb,
                    // FIX: Correctly destructure `allSystemPosts` from the API response.
                    allSystemPosts: systemFromDb,
                    allNotes: notesFromDb,
                } = await api.getAllPostsForProjects(projectIds);
                
                setAllPosts(postsFromDb);
                setAllScheduledPosts(scheduledFromDb);
                setAllSuggestedPosts(suggestedFromDb);
                setAllSystemPosts(systemFromDb);
                setAllNotes(notesFromDb);

                const newScheduledCounts: Record<string, number> = {};
                projectIds.forEach(id => {
                    newScheduledCounts[id] = (scheduledFromDb[id]?.length || 0) + (systemFromDb[id]?.length || 0);
                });
                setScheduledPostCounts(newScheduledCounts);
                const globalVarDefs = await api.getAllGlobalVariableDefinitions();
                const allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]> = {};
                if (projectIds.length > 0) {
                    const globalVarValuesPromises = projectIds.map(id =>
                        api.getGlobalVariablesForProject(id).then(res => ({ projectId: id, values: res.values }))
                    );
                    const globalVarValuesResults = await Promise.all(globalVarValuesPromises);
                    globalVarValuesResults.forEach(result => {
                        allGlobalVarValues[result.projectId] = result.values;
                    });
                }
                setAllGlobalVarDefs(globalVarDefs);
                setAllGlobalVarValues(allGlobalVarValues);
            }
            window.showAppToast?.("Список проектов и все связанные данные успешно обновлены из базы!", 'success');
        } catch (error) {
             console.error("Не удалось принудительно обновить проекты:", error);
             window.showAppToast?.("Не удалось обновить список проектов. Пожалуйста, проверьте ваше соединение с интернетом и попробуйте снова.", 'error');
        }
    };

    const handleBulkRefresh = async (projectIds: string[]) => {
        console.log(`Starting bulk refresh for projects: ${projectIds.join(', ')}`);
        
        const uniqueProjectIds = Array.from(new Set(projectIds));
        
        for (const id of uniqueProjectIds) {
            try {
                await handleRefreshScheduled(id);
            } catch (err) {
                console.error(`Ошибка при массовом обновлении отложенных постов для проекта ${id}:`, err);
            }
        }

        console.log('Bulk refresh completed.');
        window.showAppToast?.(`Посты успешно созданы. Расписание для ${uniqueProjectIds.length} проект(а/ов) обновлено.`, 'success');
    };

    const handleSystemPostUpdate = async (projectIds: string[]) => {
        console.log(`System post update triggered for projects: ${projectIds.join(', ')}`);
        const uniqueProjectIds = Array.from(new Set(projectIds));
        for (const id of uniqueProjectIds) {
            await syncDataForProject(id, 'schedule');
        }
        window.showAppToast?.(`Системные публикации для ${uniqueProjectIds.length} проект(а/ов) обновлены.`, 'success');
    };

    return {
        states: {
            projects, allPosts, allScheduledPosts, allSuggestedPosts, allSystemPosts, allNotes,
            scheduledPostCounts, suggestedPostCounts,
            projectPermissionErrors, projectEmptyScheduleNotices, projectEmptySuggestedNotices,
            isCheckingForUpdates, updatedProjectIds,
            allGlobalVarDefs, allGlobalVarValues
        },
        setters: {
            setProjectPermissionErrors,
            setIsCheckingForUpdates,
        },
        refreshers: {
            handleUpdateProjectSettings,
            handleForceRefreshProjects,
            handleRefreshForSidebar,
            handleBulkRefresh,
            handleSystemPostUpdate,
            handleNotesUpdate,
            syncDataForProject,
            handleRefreshPublished,
            handleRefreshScheduled,
            handleRefreshSuggested,
            handleRefreshAllSchedule,
        }
    }
};