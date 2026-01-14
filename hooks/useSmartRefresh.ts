
import { useEffect } from 'react';
import { AppView, AppModule } from '../App';
import { useProjects } from '../contexts/ProjectsContext';
import * as api from '../services/api';

export const useSmartRefresh = (
    activeProjectId: string | null,
    activeView: AppView,
    activeModule: AppModule | null
) => {
    const {
        allPosts,
        allSuggestedPosts,
        projectPermissionErrors,
        projectEmptyScheduleNotices,
        projectEmptySuggestedNotices,
        setIsCheckingForUpdates,
        updatedProjectIds,
        handleRefreshForSidebar,
        syncDataForProject,
        handleRefreshPublished,
        handleRefreshScheduled,
        handleRefreshSuggested
    } = useProjects();

    useEffect(() => {
        if (!activeProjectId || (activeModule !== 'km' && activeModule !== 'lists')) return;
        
        const hasPermissionError = !!projectPermissionErrors[activeProjectId];
        const hasEmptyScheduleNotice = !!projectEmptyScheduleNotices[activeProjectId];
        const hasEmptySuggestedNotice = !!projectEmptySuggestedNotices[activeProjectId];

        if (hasPermissionError) {
             console.log(`Автоматическое обновление для проекта ${activeProjectId} заблокировано из-за ошибки доступа.`);
             return;
        }
        if (activeView === 'schedule' && hasEmptyScheduleNotice) {
            console.log(`Автоматическое обновление для проекта ${activeProjectId} (schedule) заблокировано из-за отсутствия отложенных постов.`);
            return;
        }
        if (activeView === 'suggested' && hasEmptySuggestedNotice) {
             console.log(`Автоматическое обновление для проекта ${activeProjectId} (suggested) заблокировано из-за отсутствия предложенных постов.`);
             return;
        }

        const hasUpdateFlag = updatedProjectIds.has(activeProjectId);
        
        let isDataMissing = false;
        if (activeView === 'schedule') {
            if (allPosts[activeProjectId] === undefined) {
                isDataMissing = true;
            }
        } else if (activeView === 'suggested') {
            if (allSuggestedPosts[activeProjectId] === undefined) {
                isDataMissing = true;
            }
        }

        if (isDataMissing) {
            console.log(`Данные для проекта ${activeProjectId} (вид: ${activeView}) отсутствуют. Запускаем первоначальную загрузку из VK...`);
            setIsCheckingForUpdates(activeProjectId);
            handleRefreshForSidebar(activeProjectId, activeView, true).finally(() => {
                setIsCheckingForUpdates(null);
            });
        } else if (hasUpdateFlag) {
            console.log(`Проект ${activeProjectId} помечен для обновления. Запускаем синхронизацию из БД...`);
            syncDataForProject(activeProjectId, activeView);
        } else {
             console.log(`Проект ${activeProjectId} (вид: ${activeView}) не требует немедленного обновления. Проверяем свежесть кэша...`);
             const checkStaleness = async () => {
                try {
                    const status = await api.getProjectUpdateStatus();
                    const promises: Promise<any>[] = [];
                    let needsAnyRefresh = false;

                    if (activeView === 'schedule') {
                        if (status.stalePublished.includes(activeProjectId)) {
                            console.log(`Опубликованные посты для проекта ${activeProjectId} устарели. Обновляем...`);
                            promises.push(handleRefreshPublished(activeProjectId));
                            needsAnyRefresh = true;
                        }
                        if (status.staleScheduled.includes(activeProjectId)) {
                            console.log(`Отложенные посты для проекта ${activeProjectId} устарели. Обновляем...`);
                            promises.push(handleRefreshScheduled(activeProjectId));
                            needsAnyRefresh = true;
                        }
                    } else if (activeView === 'suggested' && status.staleSuggested.includes(activeProjectId)) {
                        console.log(`Предложенные посты для проекта ${activeProjectId} устарели. Обновляем...`);
                        promises.push(handleRefreshSuggested(activeProjectId));
                        needsAnyRefresh = true;
                    }

                    if (needsAnyRefresh) {
                        setIsCheckingForUpdates(activeProjectId);
                        await Promise.allSettled(promises).finally(() => {
                            setIsCheckingForUpdates(null);
                        });
                    } else {
                         console.log(`Кэш для проекта ${activeProjectId} (вид: ${activeView}) свежий.`);
                    }
                } catch (error) {
                     console.error("Ошибка при проверке свежести данных:", error);
                }
             };
             checkStaleness();
        }
    }, [
        activeProjectId, 
        activeView, 
        activeModule,
        allPosts, 
        allSuggestedPosts, 
        handleRefreshForSidebar, 
        handleRefreshPublished, 
        handleRefreshScheduled, 
        handleRefreshSuggested, 
        projectEmptyScheduleNotices, 
        projectEmptySuggestedNotices,
        projectPermissionErrors, 
        setIsCheckingForUpdates, 
        syncDataForProject, 
        updatedProjectIds
    ]);
};
