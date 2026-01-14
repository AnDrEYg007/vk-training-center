
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useProjects } from '../../../contexts/ProjectsContext';
import { WelcomeScreen } from '../../../shared/components/WelcomeScreen';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { AiPost } from './types';

// New Imports
import { useAiPostsList } from './hooks/useAiPostsList';
import { useAiPostForm } from './hooks/useAiPostForm';
import { AiPostList } from './components/AiPostList';
import { AiPostEditor } from './components/AiPostEditor';

interface AiPostsPageProps {
    projectId: string;
    setNavigationBlocker?: React.Dispatch<React.SetStateAction<(() => boolean) | null>>;
    initialPostId?: string; // ID поста для открытия при загрузке
    onClearParams?: () => void; // Функция очистки параметров навигации
}

export const AiPostsPage: React.FC<AiPostsPageProps> = ({ projectId, setNavigationBlocker, initialPostId, onClearParams }) => {
    const { projects, handleSystemPostUpdate } = useProjects();
    
    // View State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    // Ref для отслеживания смены проекта, чтобы не сбрасывать форму при перерисовках хука из-за resetFormState
    const prevProjectIdRef = useRef(projectId);

    const currentProject = useMemo(() => projects.find(p => p.id === projectId), [projects, projectId]);

    // --- Hooks ---
    const { 
        posts, isLoading: isListLoading, errorMessage,
        postToDelete, setPostToDelete, handleDelete, 
        loadPosts 
    } = useAiPostsList(projectId);

    const formHookData = useAiPostForm({
        projectId,
        onSaveSuccess: async () => {
             // Сброс блокировщика при успешном сохранении
             if (setNavigationBlocker) setNavigationBlocker(null);
             
             // 1. ВАЖНО: Обновляем глобальное расписание (системные посты), чтобы изменения отразились в календаре
             await handleSystemPostUpdate([projectId]);
             
             // 2. Возвращаемся в режим списка
             setViewMode('list');
             
             // 3. Обновляем локальный список автоматизаций
             loadPosts(); 
        }
    });

    const { handleEditPost, resetFormState, formState } = formHookData;

    // --- Effects ---

    // Initial Load
    useEffect(() => {
        if (viewMode === 'list') {
            loadPosts();
        }
    }, [projectId, viewMode, loadPosts]);

    // Обработка навигации к конкретному посту
    useEffect(() => {
        if (initialPostId && posts.length > 0) {
            const targetPost = posts.find(p => p.id === initialPostId);
            if (targetPost) {
                console.log(`Navigating to AI post: ${targetPost.title} (${targetPost.id})`);
                handleEditPost(targetPost);
                setViewMode('create');
                // Очищаем параметры, чтобы не переоткрывать при переключениях
                if (onClearParams) onClearParams();
            }
        }
    }, [initialPostId, posts, handleEditPost, onClearParams]);

    // Navigation Blocking Logic
    useEffect(() => {
        if (setNavigationBlocker) {
            if (viewMode === 'create') {
                setNavigationBlocker(() => () => true);
            } else {
                setNavigationBlocker(null);
            }
        }
        return () => {
            if (setNavigationBlocker) setNavigationBlocker(null);
        };
    }, [viewMode, setNavigationBlocker]);

    // Project Change Reset
    // ВАЖНО: Используем проверку ref, чтобы сброс происходил ТОЛЬКО при смене проекта,
    // а не при каждом обновлении ссылки resetFormState (которая меняется часто).
    useEffect(() => {
        if (prevProjectIdRef.current !== projectId) {
            resetFormState();
            setViewMode('list');
            prevProjectIdRef.current = projectId;
        }
    }, [projectId, resetFormState]);


    // --- Handlers ---

    const handleCreateClick = () => {
        resetFormState();
        setViewMode('create');
    };

    const handleEditClick = (post: AiPost) => {
        handleEditPost(post);
        setViewMode('create');
    };

    const handleCancelCreate = () => {
        if (formState.isDirty) {
            setShowCancelConfirm(true);
        } else {
            setViewMode('list');
            resetFormState();
        }
    };

    const confirmCancel = () => {
        setViewMode('list');
        resetFormState();
        setShowCancelConfirm(false);
    };

    if (!projectId || !currentProject) {
        return <WelcomeScreen />;
    }

    // --- Render ---

    if (viewMode === 'create') {
        return (
            <>
                <AiPostEditor 
                    projectId={projectId}
                    project={currentProject}
                    onCancel={handleCancelCreate}
                    formData={formHookData}
                />
                {showCancelConfirm && (
                    <ConfirmationModal 
                        title="Отменить изменения?" 
                        message="Все несохраненные данные будут потеряны." 
                        onConfirm={confirmCancel} 
                        onCancel={() => setShowCancelConfirm(false)} 
                        confirmText="Да, отменить" 
                        cancelText="Остаться" 
                        confirmButtonVariant="danger" 
                    />
                )}
            </>
        );
    }

    return (
        <>
            <AiPostList 
                posts={posts}
                isLoading={isListLoading}
                errorMessage={errorMessage}
                onCreateClick={handleCreateClick}
                onEditClick={handleEditClick}
                onDeleteClick={setPostToDelete}
            />
            {postToDelete && (
                <ConfirmationModal 
                    title="Удалить автоматизацию?" 
                    message="Это действие остановит генерацию и удалит пост из расписания. Уже опубликованные посты останутся." 
                    onConfirm={handleDelete} 
                    onCancel={() => setPostToDelete(null)} 
                    confirmText="Удалить" 
                    confirmButtonVariant="danger" 
                />
            )}
        </>
    );
};
