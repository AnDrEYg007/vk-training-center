
import { useCallback } from 'react';
import { Project } from '../../../shared/types';
import * as api from '../../../services/api';
import { RefreshProgress } from '../../../services/api/lists.api';
import { ListType } from '../types';
import { useListState } from './useListState';
import { useListFetching } from './useListFetching';

type ListStateReturn = ReturnType<typeof useListState>;
type ListFetchingReturn = ReturnType<typeof useListFetching>;

export const useListPolling = (
    project: Project,
    state: ListStateReturn['state'],
    setters: ListStateReturn['setters'],
    fetchers: ListFetchingReturn
) => {
    
    const pollExistingTask = useCallback(async (taskId: string, listType: ListType | 'subscriber_details' | 'interactions' | 'author_details' | 'mailing_analysis') => {
        const onProgress = (progress: RefreshProgress) => {
            if (state.activeProjectIdRef.current !== project.id) return;

            let newLabel = "...";
            if (progress.status === 'fetching') {
                // Формат: Загружено / Всего (4500/10000)
                newLabel = `${progress.loaded}${progress.total ? '/' + progress.total : ''}`;
            }
            else if (progress.status === 'processing') newLabel = 'Запись';
            else if (progress.status === 'done') newLabel = 'Готово';
            
            if (listType === 'subscriber_details') {
                setters.setIsRefreshingSubscriberDetails(true);
            } else if (listType === 'author_details') {
                 setters.setRefreshStates(prev => ({
                    ...prev,
                    authors: { isRefreshing: true, label: newLabel }
                }));
            } else if (listType === 'mailing_analysis') {
                 // Особое форматирование для анализа
                 if (progress.status === 'fetching' || progress.status === 'processing') {
                     newLabel = `Анализ ${progress.loaded}${progress.total ? '/' + progress.total : ''}`;
                 }
                 setters.setRefreshStates(prev => ({
                    ...prev,
                    mailing: { isRefreshing: true, label: newLabel }
                }));
            } else if (listType === 'interactions') {
                setters.setIsInteractionsSyncing(true);
                 setters.setRefreshStates(prev => ({
                    ...prev,
                    likes: { isRefreshing: true, label: newLabel },
                    comments: { isRefreshing: true, label: newLabel },
                    reposts: { isRefreshing: true, label: newLabel }
                }));
            } else if (listType in state.refreshStates) {
                 setters.setRefreshStates(prev => ({
                    ...prev,
                    [listType as ListType]: { isRefreshing: true, label: newLabel }
                }));
            }
        };

        try {
            await api.pollTask(taskId, onProgress);
            
             if (state.activeProjectIdRef.current === project.id) {
                await fetchers.fetchMeta();
                if (state.activeList) {
                    if ((listType === 'subscriber_details' && state.activeList === 'subscribers') ||
                        (listType === 'interactions' && ['likes', 'comments', 'reposts'].includes(state.activeList)) ||
                        (listType === 'author_details' && state.activeList === 'authors') ||
                        (listType === 'mailing_analysis' && state.activeList === 'mailing') ||
                        (listType === state.activeList)) {
                            
                        await fetchers.fetchItems(1, state.searchQuery, true);
                        // Теперь всегда обновляем статистику, так как для постов она тоже есть
                        await fetchers.fetchStats(state.activeList);
                    }
                }
            }
        } catch (e) {
            console.error("Error resuming task:", e);
        } finally {
            if (state.activeProjectIdRef.current === project.id) {
                 if (listType === 'subscriber_details') {
                    setters.setIsRefreshingSubscriberDetails(false);
                } else if (listType === 'author_details') {
                     setters.setRefreshStates(prev => ({
                        ...prev,
                        authors: { isRefreshing: false, label: null }
                    }));
                } else if (listType === 'mailing_analysis') {
                     setters.setRefreshStates(prev => ({
                        ...prev,
                        mailing: { isRefreshing: false, label: null }
                    }));
                } else if (listType === 'interactions') {
                    setters.setIsInteractionsSyncing(false);
                    setters.setRefreshStates(prev => ({
                        ...prev,
                        likes: { isRefreshing: false, label: null },
                        comments: { isRefreshing: false, label: null },
                        reposts: { isRefreshing: false, label: null }
                    }));
                } else if (listType in state.refreshStates) {
                    setters.setRefreshStates(prev => ({
                        ...prev,
                        [listType as ListType]: { isRefreshing: false, label: null }
                    }));
                }
            }
        }
    }, [project.id, state.activeList, state.searchQuery, fetchers]);

    const checkActiveTasks = useCallback(async () => {
        try {
            const tasks = await api.getActiveTasks(project.id);
            console.log("Active tasks found:", tasks);
            
            Object.entries(tasks).forEach(([typeKey, taskId]) => {
                if (typeKey === 'subscribers') pollExistingTask(taskId, 'subscribers');
                else if (typeKey === 'subscriber_details') pollExistingTask(taskId, 'subscriber_details');
                else if (typeKey === 'author_details') pollExistingTask(taskId, 'author_details');
                else if (typeKey === 'history_join') pollExistingTask(taskId, 'history_join');
                else if (typeKey === 'history_leave') pollExistingTask(taskId, 'history_leave');
                else if (typeKey === 'mailing') pollExistingTask(taskId, 'mailing');
                else if (typeKey === 'mailing_analysis') pollExistingTask(taskId, 'mailing_analysis');
                else if (typeKey === 'posts') pollExistingTask(taskId, 'posts');
                else if (typeKey === 'interactions') pollExistingTask(taskId, 'interactions');
                else if (typeKey === 'interaction_users_likes') pollExistingTask(taskId, 'likes');
                else if (typeKey === 'interaction_users_comments') pollExistingTask(taskId, 'comments');
                else if (typeKey === 'interaction_users_reposts') pollExistingTask(taskId, 'reposts');
                else if (typeKey === 'authors') pollExistingTask(taskId, 'authors'); 
            });
        } catch (e) {
            console.warn("Failed to check active tasks", e);
        }
    }, [project.id, pollExistingTask]);

    return { pollExistingTask, checkActiveTasks };
};
