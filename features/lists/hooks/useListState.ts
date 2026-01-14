
import { useState, useRef, useEffect } from 'react';
import { Project, SystemListSubscriber, ProjectListMeta, SystemListPost, SystemListInteraction } from '../../../shared/types';
import { ListStats } from '../../../services/api/lists.api';
import { ListType, ListGroup, FilterQuality, FilterSex, FilterOnline, FilterCanWrite, RefreshState, StatsPeriod, StatsGroupBy, FilterBdateMonth, FilterPlatform, FilterAge } from '../types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';

interface UseListStateProps {
    project: Project;
    activeListGroup: ListGroup;
    onActiveListGroupChange: (group: ListGroup) => void;
}

export const useListState = ({ project, activeListGroup, onActiveListGroupChange }: UseListStateProps) => {
    // --- Состояния UI и навигации ---
    // Используем localStorage для сохранения активной вкладки, чтобы она не сбрасывалась при перезагрузке
    const [activeList, setActiveList] = useLocalStorage<ListType | null>('system-lists-active-tab', null);
    
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- Данные ---
    const [meta, setMeta] = useState<ProjectListMeta | null>(null);
    const [items, setItems] = useState<SystemListSubscriber[]>([]);
    const [posts, setPosts] = useState<SystemListPost[]>([]);
    const [interactions, setInteractions] = useState<SystemListInteraction[]>([]);
    const [stats, setStats] = useState<ListStats | null>(null);
    const [totalItemsCount, setTotalItemsCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // --- Фильтры ---
    const [filterQuality, setFilterQuality] = useState<FilterQuality>('all');
    const [filterSex, setFilterSex] = useState<FilterSex>('all');
    const [filterOnline, setFilterOnline] = useState<FilterOnline>('any');
    const [filterCanWrite, setFilterCanWrite] = useState<FilterCanWrite>('all');
    const [filterBdateMonth, setFilterBdateMonth] = useState<FilterBdateMonth>('any');
    const [filterPlatform, setFilterPlatform] = useState<FilterPlatform>('any');
    const [filterAge, setFilterAge] = useState<FilterAge>('any');
    
    // --- Настройки статистики ---
    const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('all');
    const [statsGroupBy, setStatsGroupBy] = useState<StatsGroupBy>('month');
    const [statsDateFrom, setStatsDateFrom] = useState<string>('');
    const [statsDateTo, setStatsDateTo] = useState<string>('');

    // --- Состояния загрузки ---
    const [isLoadingMeta, setIsLoadingMeta] = useState(false);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingList, setIsLoadingList] = useState(false);
    const [isListLoaded, setIsListLoaded] = useState(false);
    const [isRefreshingSubscriberDetails, setIsRefreshingSubscriberDetails] = useState(false);
    const [isRefreshingAuthorDetails, setIsRefreshingAuthorDetails] = useState(false);
    const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
    const [isInteractionsSyncing, setIsInteractionsSyncing] = useState(false);
    
    // Сохраняет тип списка, для которого была вызвана модалка синхронизации
    const [interactionSyncType, setInteractionSyncType] = useState<'likes' | 'comments' | 'reposts' | null>(null);

    const [refreshStates, setRefreshStates] = useState<Record<ListType, RefreshState>>({
        subscribers: { isRefreshing: false, label: null },
        history_join: { isRefreshing: false, label: null },
        history_leave: { isRefreshing: false, label: null },
        mailing: { isRefreshing: false, label: null },
        posts: { isRefreshing: false, label: null },
        likes: { isRefreshing: false, label: null },
        comments: { isRefreshing: false, label: null },
        reposts: { isRefreshing: false, label: null },
        reviews_winners: { isRefreshing: false, label: null },
        reviews_participants: { isRefreshing: false, label: null },
        reviews_posts: { isRefreshing: false, label: null },
        authors: { isRefreshing: false, label: null },
    });

    const activeProjectIdRef = useRef(project.id);

    // Синхронизация ref с пропсом, чтобы избежать race conditions при смене проекта
    useEffect(() => {
        activeProjectIdRef.current = project.id;
    }, [project.id]);

    return {
        state: {
            activeList, activeGroup: activeListGroup, page, searchQuery,
            meta, items, posts, interactions, stats, totalItemsCount, hasMore,
            filterQuality, filterSex, filterOnline, filterCanWrite, filterBdateMonth, filterPlatform, filterAge,
            statsPeriod, statsGroupBy, statsDateFrom, statsDateTo,
            isLoadingMeta, isLoadingStats, isLoadingList, isListLoaded,
            isRefreshingSubscriberDetails, isRefreshingAuthorDetails, isSyncModalOpen, interactionSyncType,
            refreshStates, activeProjectIdRef,
            isInteractionsSyncing
        },
        setters: {
            setActiveList, setActiveGroup: onActiveListGroupChange, setPage, setSearchQuery,
            setMeta, setItems, setPosts, setInteractions, setStats, setTotalItemsCount, setHasMore,
            setFilterQuality, setFilterSex, setFilterOnline, setFilterCanWrite, setFilterBdateMonth, setFilterPlatform, setFilterAge,
            setStatsPeriod, setStatsGroupBy, setStatsDateFrom, setStatsDateTo,
            setIsLoadingMeta, setIsLoadingStats, setIsLoadingList, setIsListLoaded,
            setIsRefreshingSubscriberDetails, setIsRefreshingAuthorDetails, setIsSyncModalOpen, setInteractionSyncType,
            setRefreshStates,
            setIsInteractionsSyncing
        }
    };
};
