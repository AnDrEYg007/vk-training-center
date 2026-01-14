
import { useCallback } from 'react';
import { Project } from '../../../shared/types';
import * as api from '../../../services/api';
import { ListType } from '../types';
import { useListState } from './useListState';

// Тип возвращаемого значения из useListState
type ListStateReturn = ReturnType<typeof useListState>;

export const useListFetching = (
    project: Project,
    state: ListStateReturn['state'],
    setters: ListStateReturn['setters']
) => {
    const PAGE_SIZE = 50;

    const fetchMeta = useCallback(async () => {
        setters.setIsLoadingMeta(true);
        try {
            const metaData = await api.getListMeta(project.id);
            if (state.activeProjectIdRef.current === project.id) {
                 setters.setMeta(metaData.meta);
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (state.activeProjectIdRef.current === project.id) {
                setters.setIsLoadingMeta(false);
            }
        }
    }, [project.id]);

    const fetchStats = useCallback(async (listType: ListType) => {
        // Для списков автоматизации статистика пока не реализована или не требуется в том же виде
        if (listType.startsWith('reviews_')) {
            setters.setStats(null);
            return;
        }

        setters.setIsLoadingStats(true);
        try {
            const statsData = await api.getListStats(
                project.id, 
                listType,
                state.statsPeriod,
                state.statsGroupBy,
                state.statsDateFrom,
                state.statsDateTo,
                state.filterCanWrite // Передаем фильтр ЛС в статистику
            );
            if (state.activeProjectIdRef.current === project.id) {
                setters.setStats(statsData);
            }
        } catch (e) {
            console.error("Failed to load stats", e);
        } finally {
             if (state.activeProjectIdRef.current === project.id) {
                setters.setIsLoadingStats(false);
             }
        }
    }, [project.id, state.statsPeriod, state.statsGroupBy, state.statsDateFrom, state.statsDateTo, state.filterCanWrite]);

    const fetchItems = useCallback(async (pageNum: number, search: string, isReset: boolean = false) => {
        if (!state.activeList) return;
        // Защита от повторного вызова во время загрузки (предотвращает спам запросов)
        if (!isReset && state.isLoadingList) return;
        
        setters.setIsLoadingList(true);
        try {
            let count = 0;
            let metaData = null;
            let total = 0;

            if (state.activeList === 'posts' || state.activeList === 'reviews_posts') {
                if (state.activeList === 'posts') {
                     const data = await api.getPostsList(project.id, pageNum, search);
                     metaData = data.meta;
                     count = data.items.length;
                     total = data.total_count;
                     if (state.activeProjectIdRef.current === project.id) {
                        if (isReset) setters.setPosts(data.items);
                        else setters.setPosts(prev => [...prev, ...data.items]);
                     }
                } else {
                     const response: any = await api.getSubscribers(
                        project.id, 
                        pageNum, 
                        search, 
                        state.activeList as any,
                        state.filterQuality,
                        state.filterSex,
                        state.filterOnline,
                        state.filterCanWrite,
                        state.filterBdateMonth,
                        state.filterPlatform,
                        state.filterAge // NEW
                    );
                    
                    metaData = response.meta;
                    count = response.items.length;
                    total = response.total_count;
                    
                    if (state.activeProjectIdRef.current === project.id) {
                        if (isReset) setters.setPosts(response.items);
                        else setters.setPosts(prev => [...prev, ...response.items]);
                    }
                }

            } else if (['likes', 'comments', 'reposts'].includes(state.activeList)) {
                const data = await api.getInteractionList(
                    project.id, 
                    state.activeList as 'likes' | 'comments' | 'reposts', 
                    pageNum, 
                    search,
                    state.filterQuality,
                    state.filterSex,
                    state.filterOnline,
                    state.filterBdateMonth,
                    state.filterPlatform,
                    state.filterAge // NEW
                );
                metaData = data.meta;
                count = data.items.length;
                total = data.total_count;
                if (state.activeProjectIdRef.current === project.id) {
                    if (isReset) setters.setInteractions(data.items);
                    else setters.setInteractions(prev => [...prev, ...data.items]);
                }

            } else {
                // Подписчики, История, Рассылка, Участники конкурса, Победители
                const data = await api.getSubscribers(
                    project.id, 
                    pageNum, 
                    search, 
                    state.activeList as any,
                    state.filterQuality,
                    state.filterSex,
                    state.filterOnline,
                    state.filterCanWrite,
                    state.filterBdateMonth,
                    state.filterPlatform,
                    state.filterAge // NEW
                );
                metaData = data.meta;
                count = data.items.length;
                total = data.total_count;
                if (state.activeProjectIdRef.current === project.id) {
                    if (isReset) setters.setItems(data.items);
                    else setters.setItems(prev => [...prev, ...data.items]);
                }
            }
            
            if (state.activeProjectIdRef.current === project.id) {
                if (metaData) setters.setMeta(metaData);
                setters.setIsListLoaded(true);
                // Важно: hasMore должно быть true только если мы получили полную страницу
                setters.setHasMore(count === PAGE_SIZE);
                setters.setPage(pageNum);
                if (isReset) setters.setTotalItemsCount(total);
            }

        } catch (e) {
            console.error(e);
            // Сбрасываем флаг загрузки даже при ошибке, чтобы интерфейс не завис
        } finally {
            if (state.activeProjectIdRef.current === project.id) {
                setters.setIsLoadingList(false);
            }
        }
    }, [project.id, state.activeList, state.isLoadingList, state.filterQuality, state.filterSex, state.filterOnline, state.filterCanWrite, state.filterBdateMonth, state.filterPlatform, state.filterAge]);

    return {
        fetchMeta,
        fetchStats,
        fetchItems
    };
};
