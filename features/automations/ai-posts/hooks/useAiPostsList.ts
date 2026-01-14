
import { useState, useCallback, useEffect } from 'react';
import * as api from '../../../../services/api/automations_ai.api';
import { AiPost } from '../types';

export const useAiPostsList = (projectId: string) => {
    const [posts, setPosts] = useState<AiPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [postToDelete, setPostToDelete] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadPosts = useCallback(async () => {
        if (!projectId) return;
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const data = await api.getAiPostsList(projectId);
            setPosts(data);
        } catch (e) {
            console.error(e);
            setErrorMessage("Не удалось загрузить AI посты");
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    const handleDelete = async () => {
        if (!postToDelete) return;
        try {
            await api.deleteAiPost(postToDelete);
            setPosts(prev => prev.filter(p => p.id !== postToDelete));
            setPostToDelete(null);
            setErrorMessage(null);
        } catch (e) {
            console.error(e);
            setErrorMessage("Ошибка удаления AI поста");
        }
    };

    return {
        posts,
        isLoading,
        errorMessage,
        postToDelete,
        setPostToDelete,
        handleDelete,
        loadPosts
    };
};
