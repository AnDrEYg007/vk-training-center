
import { useState, useCallback } from 'react';
import { Project, SuggestedPost } from '../../../shared/types';
import { useSuggestedPosts } from './useSuggestedPosts';
import * as api from '../../../services/api';

interface UseSuggestedPostsManagerProps {
    project: Project;
    cachedPosts: SuggestedPost[] | undefined;
    onPostsLoaded: (posts: SuggestedPost[]) => void;
}

export const useSuggestedPostsManager = ({
    project,
    cachedPosts,
    onPostsLoaded,
}: UseSuggestedPostsManagerProps) => {
    const { posts, isLoading, error, handleRefresh } = useSuggestedPosts({
        project,
        cachedPosts,
        onPostsLoaded,
    });

    const [selectedPost, setSelectedPost] = useState<SuggestedPost | null>(null);
    const [correctedText, setCorrectedText] = useState<string>('');
    const [isCorrecting, setIsCorrecting] = useState<boolean>(false);

    const [confirmation, setConfirmation] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);

    const executeCorrection = useCallback(async (post: SuggestedPost) => {
        setSelectedPost(post);
        setCorrectedText(''); 
        setIsCorrecting(true);
        try {
            const result = await api.correctSuggestedPostText(post.text, project.id);
            setCorrectedText(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось выполнить коррекцию текста.';
            console.error(err);
            setCorrectedText(`Ошибка AI: ${errorMessage}`);
            // Alert removed here, relying on global modal
        } finally {
            setIsCorrecting(false);
        }
    }, [project.id]);

    const handleSelectPost = useCallback(async (post: SuggestedPost) => {
        if (isCorrecting) return;

        if (correctedText) {
            if (selectedPost?.id === post.id) {
                setConfirmation({
                    title: 'Подтвердите действие',
                    message: 'Вы точно хотите сгенерировать новый текст? Старый будет удален безвозвратно.',
                    onConfirm: () => {
                        setConfirmation(null);
                        executeCorrection(post);
                    },
                });
            } else {
                setConfirmation({
                    title: 'Начать новую генерацию?',
                    message: 'Закрыть результат прошлой генерации и начать новую? Старый будет удален безвозвратно.',
                    onConfirm: () => {
                        setConfirmation(null);
                        executeCorrection(post);
                    }
                });
            }
        } else {
            executeCorrection(post);
        }
    }, [isCorrecting, correctedText, selectedPost, executeCorrection]);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const handleCancelConfirmation = () => {
        setConfirmation(null);
    };
    
    return {
        state: {
            posts,
            isLoading,
            error,
            selectedPost,
            correctedText,
            isCorrecting,
            confirmation,
        },
        actions: {
            handleRefresh,
            handleSelectPost,
            handleCopyToClipboard,
            handleCancelConfirmation,
        },
    };
};
