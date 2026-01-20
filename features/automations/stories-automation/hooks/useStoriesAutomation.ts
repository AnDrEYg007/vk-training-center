import { useState, useEffect, useRef } from 'react';
import { callApi } from '../../../../shared/utils/apiClient';
import { PublishedPost, StoryLog, UnifiedStory } from '../types';

export const useStoriesAutomation = (projectId?: string) => {
    const [activeTab, setActiveTab] = useState<'settings' | 'stats'>('settings');
    
    // Unified stories list (Active + Archived)
    const [stories, setStories] = useState<UnifiedStory[]>([]);
    const [isLoadingStories, setIsLoadingStories] = useState(false);
    
    // Updating states
    const [isSaving, setIsSaving] = useState(false);
    const [updatingStatsId, setUpdatingStatsId] = useState<string | null>(null);

    const [isActive, setIsActive] = useState(false);
    const [keywords, setKeywords] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(false);
    
    const [posts, setPosts] = useState<PublishedPost[]>([]);
    const [logs, setLogs] = useState<StoryLog[]>([]);

    // Pagination state
    const [visibleCount, setVisibleCount] = useState(50);
    const [isPublishing, setIsPublishing] = useState<number | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!projectId) return;
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setIsLoading(true);
        setIsInitialLoad(true);
        try {
            const [settingsData, postsData, logsData] = await Promise.all([
                callApi('getStoriesAutomation', { projectId }),
                callApi('getCachedPublishedPosts', { projectId }),
                callApi('getStoriesAutomationLogs', { projectId }),
            ]);

            setIsActive(settingsData.is_active || false);
            setKeywords(settingsData.keywords || '');
            setPosts(postsData || []);
            setLogs(logsData || []);
        } catch (error) {
            console.error(error);
            window.showAppToast?.('Не удалось загрузить данные', 'error');
        } finally {
            setIsLoading(false);
            setIsInitialLoad(false);
        }
    };

    const handleSave = async () => {
        if (!projectId) return;
        setIsSaving(true);
        try {
            await callApi('updateStoriesAutomation', {
                projectId,
                settings: { is_active: isActive, keywords: keywords }
            });
            window.showAppToast?.('Настройки обновлены', 'success');
        } catch (error) {
            console.error(error);
            window.showAppToast?.('Не удалось сохранить', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const loadLogs = async () => {
        if (!projectId) return;
        try {
            const logsData = await callApi('getStoriesAutomationLogs', { projectId });
            setLogs(logsData || []);
        } catch (error) {
            console.error(error);
        }
    };

    // New unified loader
    const loadStories = async () => {
        if (!projectId) return;
        setIsLoadingStories(true);
        try {
             // Load with refresh=true because this is the Stories Automation page
             // User likely wants to see latest data here.
             const res = await callApi<{ items: UnifiedStory[] }>('getUnifiedStories', { projectId, refresh: true });
             
            // Note: Since we updated api wrapper to return just items, but here we use raw callApi
            // we need to handle response structure manually or use api service. 
            // Better to use api service or keep raw if customized.
            // Wait, useStoriesAutomation was using raw callApi. 
            // Let's stick to raw callApi but now passing refresh: true.
            
             // The backend returns { items: ... } or error
             if ((res as any).error) { 
                 window.showAppToast?.((res as any).error, 'error');
                 setStories([]);
             } else {
                 setStories(res.items || []); 
             }
        } catch (error: any) {
             console.error(error);
             const msg = error?.response?.data?.detail || 'Ошибка загрузки историй';
             window.showAppToast?.(msg, 'error');
        } finally {
            setIsLoadingStories(false);
        }
    };

    const handleUpdateStats = async (mode: 'single' | 'last_n' | 'period', params: any = {}) => {
        if (!projectId) return;
        
        let loadingId = 'global';
        if (mode === 'single' && params.logId) {
            loadingId = params.logId; // Use logId for automated stories
        } else if (mode === 'single' && params.vkStoryId) {
            loadingId = `vk_${params.vkStoryId}`; // Use vkStoryId for manual? (Not fully implemented on backend yet)
        } else if (mode === 'last_n') {
            loadingId = `last_${params.count}`;
        } else if (mode === 'period') {
            loadingId = `period_${params.days}`;
        }

        setUpdatingStatsId(loadingId);
        
        try {
            const res = await callApi('updateStoriesStats', {
                projectId,
                mode,
                ...params
            });
            
            if (res.status === 'ok') {
                 window.showAppToast?.(`Обновлено ${res.updated || 0} записей`, 'success');
                 loadStories(); // Reload unified list to show new stats
            }
        } catch (error) {
            console.error(error);
            window.showAppToast?.('Не удалось обновить статистику', 'error');
        } finally {
            setUpdatingStatsId(null);
        }
    };

    // Load stories when tab is switched to stats
    useEffect(() => {
        if (activeTab === 'stats' && projectId) {
            loadStories();
        }
    }, [activeTab, projectId]);

    const extractVkId = (post: PublishedPost): number | null => {
        const match = post.vkPostUrl ? post.vkPostUrl.match(/wall(-?\d+)_(\d+)/) : null;
        if (match && match[2]) return parseInt(match[2]);
        if (post.vkPostUrl) {
             const parts = post.vkPostUrl.split('_');
             if (parts.length > 1) {
                  const last = parts[parts.length - 1];
                  return parseInt(last);
             }
        }
        return null;
    };

    const handleManualPublish = async (post: PublishedPost) => {
        if (!projectId) return;
        
        const vkPostId = extractVkId(post);
        if (!vkPostId) {
            window.showAppToast?.('Не удалось определить ID поста', 'error');
            return;
        }

        setIsPublishing(post.id);
        try {
            const res = await callApi('manualPublishStory', { projectId, vkPostId });
            if (res.status === 'success') {
                window.showAppToast?.('История успешно опубликована, не забудьте нажать "Обновить", когда она появится', 'success');
            } else if (res.status === 'skipped') {
                window.showAppToast?.('История уже опубликована', 'info');
            } else {
                 throw new Error(res.message);
            }
            await loadLogs(); 
        } catch (error: any) {
            console.error(error);
            const logMsg = error?.response?.data?.detail || error.message || 'Ошибка публикации';
            window.showAppToast?.(logMsg, 'error');
        } finally {
            setIsPublishing(null);
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 50) {
                setVisibleCount(prev => Math.min(prev + 50, posts.length));
            }
        }
    };

    const getPostStatus = (post: PublishedPost) => {
        const vkId = extractVkId(post);
        if (!vkId) {
             return { status: 'none', label: 'Нет ID', color: 'text-gray-500 bg-gray-50 border-gray-200', details: '', logDate: null, vkId: null };
        }

        const log = logs.find(l => l.vk_post_id === vkId);
        
        if (log) {
            let storyLink = null;
            try {
                if (log.log) {
                    const parsed = JSON.parse(log.log);
                    storyLink = parsed.story_link;
                }
            } catch (e) {}

            return { 
                status: 'published', 
                label: 'Опубликовано', 
                color: 'text-green-600 bg-green-50 border-green-200',
                details: null,
                logDate: new Date(log.created_at),
                storyLink,
                vkId
            };
        }

        const kwList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
        const postText = (post.text || '').toLowerCase();
        
        if (kwList.length === 0) {
             return { status: 'none', label: 'Нет условий', color: 'text-gray-500 bg-gray-50 border-gray-200', details: '', logDate: null, vkId };
        }

        const hasKeyword = kwList.some(k => postText.includes(k));
        
        if (hasKeyword) {
            const postDate = new Date(post.date);
            const isOld = (Date.now() - postDate.getTime()) > 24 * 60 * 60 * 1000;
            
            if (isOld) {
                 return { status: 'skipped', label: 'Пропущен (старый)', color: 'text-gray-500 bg-gray-50 border-gray-200', details: 'Пост старше 24ч', logDate: null, vkId };
            }

            return { status: 'pending', label: 'Подходит по условиям', color: 'text-amber-600 bg-amber-50 border-amber-200', details: 'Ожидает публикации', logDate: null, vkId };
        }

        return { status: 'mismatch', label: 'Не подходит', color: 'text-gray-400 bg-gray-50 border-gray-200', details: 'Нет ключевых слов', logDate: null, vkId };
    };

    const getFirstImage = (post: PublishedPost) => {
        try {
            if (!post.images) return null;

            let imagesData = post.images;
            if (typeof imagesData === 'string') {
                try {
                    imagesData = JSON.parse(imagesData);
                } catch (e) {
                    return null;
                }
            }

            if (Array.isArray(imagesData) && imagesData.length > 0) {
                return imagesData[0].url; 
            }
        } catch (e) {}
        return null;
    };

    const getCount = (field: any): number => {
        if (typeof field === 'number') return field;
        if (field && typeof field === 'object' && 'count' in field) return field.count || 0;
        return 0;
    };

    return {
        activeTab, setActiveTab,
        stories,
        isLoadingStories,
        loadStories,
        isSaving,
        updatingStatsId,
        isActive, setIsActive,
        keywords, setKeywords,
        isLoading,
        posts,
        visibleCount, setVisibleCount,
        isPublishing,
        scrollContainerRef,
        handleSave,
        handleUpdateStats,
        handleManualPublish,
        handleScroll,
        getPostStatus,
        getFirstImage,
        getCount
    };
};
