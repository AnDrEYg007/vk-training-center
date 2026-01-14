import { useState, useEffect, useCallback } from 'react';
import { Project, SuggestedPost } from '../../../shared/types';
import * as api from '../../../services/api';

interface UseSuggestedPostsProps {
    project: Project;
    cachedPosts: SuggestedPost[] | undefined;
    onPostsLoaded: (posts: SuggestedPost[]) => void;
}

/**
 * Хук для получения и управления списком предложенных постов.
 * Отвечает только за data-fetching.
 */
export const useSuggestedPosts = ({ project, cachedPosts, onPostsLoaded }: UseSuggestedPostsProps) => {
    const [posts, setPosts] = useState<SuggestedPost[]>(cachedPosts || []);
    const [isLoading, setIsLoading] = useState<boolean>(!cachedPosts);
    const [error, setError] = useState<string | null>(null);

    // НОВОЕ: Этот useEffect синхронизирует локальное состояние с пропсами из контекста.
    // Он срабатывает каждый раз, когда фоновое обновление меняет allSuggestedPosts.
    useEffect(() => {
        setPosts(cachedPosts || []);
        if (cachedPosts) {
            setIsLoading(false);
        }
    }, [cachedPosts]);


    const fetchPosts = useCallback(async () => {
        // Этот блок теперь в основном нужен для самого первого открытия проекта,
        // когда в cachedPosts еще ничего нет.
        if (cachedPosts && cachedPosts.length > 0) {
            setPosts(cachedPosts);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const fetchedPosts = await api.getSuggestedPosts(project.id);
            setPosts(fetchedPosts);
            onPostsLoaded(fetchedPosts);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить предложенные посты.';
            setError(errorMessage);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [project.id, cachedPosts, onPostsLoaded]);

    // Этот useEffect по-прежнему отвечает за первоначальную загрузку при смене проекта
    useEffect(() => {
        // Мы вызываем fetchPosts только если cachedPosts еще не определены,
        // чтобы избежать двойного запроса при первом рендере.
        if (cachedPosts === undefined) {
            fetchPosts();
        }
    }, [project.id, cachedPosts, fetchPosts]);

    const handleRefresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const freshPosts = await api.refreshSuggestedPosts(project.id);
            setPosts(freshPosts);
            onPostsLoaded(freshPosts);
            return freshPosts;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось обновить предложенные посты.';
            setError(errorMessage);
            console.error(err);
            throw err; // Пробрасываем ошибку для обработки в компоненте
        } finally {
            setIsLoading(false);
        }
    }, [project.id, onPostsLoaded]);

    return {
        posts,
        isLoading,
        error,
        handleRefresh,
    };
};