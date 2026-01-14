import { useState, useCallback } from 'react';
import { ScheduledPost, Project, SystemPost, GlobalVariableDefinition } from '../../../shared/types';
import * as api from '../../../services/api';
import { usePostForm } from './usePostForm';
import { UnifiedPost } from '../../../schedule/hooks/useScheduleData';
import { RefreshType } from '../components/modals/PostDetailsModal';

// Props for the hook, should match the modal's props
interface UsePostDetailsProps {
    post: UnifiedPost;
    isPublished: boolean;
    projectId: string;
    onClose: () => void;
    onSaveComplete: (affectedProjectIds: string[], refreshType: RefreshType) => void;
    onDelete: (post: ScheduledPost | SystemPost) => void;
    onPublishNow: (post: ScheduledPost | SystemPost) => void;
    initialMode?: 'view' | 'edit' | 'copy';
}

export const usePostDetails = ({
    post,
    isPublished,
    projectId,
    onClose,
    onSaveComplete,
    onDelete,
    onPublishNow,
    initialMode = 'view',
}: UsePostDetailsProps) => {
    // --- STATE MANAGEMENT ---

    // Приводим системный пост к типу ScheduledPost для работы с формой
    const formPost: ScheduledPost = 'post_type' in post && post.postType === 'system' ? {
        ...post,
        date: post.publication_date,
        vkPostUrl: undefined,
        tags: [],
    } : post;

    const isNewPost = formPost.id.startsWith('new-post-');
    const isCopyMode = initialMode === 'copy';
    const [mode, setMode] = useState<'view' | 'edit' | 'copy'>(isNewPost || isCopyMode ? 'edit' : initialMode);
    
    // Вся логика формы теперь инкапсулирована в usePostForm
    const { formState, formActions } = usePostForm(formPost, initialMode, projectId, post.postType);

    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [showUnsavedChangesConfirm, setShowUnsavedChangesConfirm] = useState(false);
    const [isUploadingMedia, setIsUploadingMedia] = useState(false);

    // Новые состояния, поднятые из PostTextSection
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [showVariables, setShowVariables] = useState(false);
    const [variables, setVariables] = useState<{ name: string; value: string }[] | null>(null);
    const [isLoadingVariables, setIsLoadingVariables] = useState(false);
    const [globalVariables, setGlobalVariables] = useState<GlobalVariableDefinition[] | null>(null);
    const [isLoadingGlobalVariables, setIsLoadingGlobalVariables] = useState(false);


    // --- DERIVED STATE & DATA ---

    const isLocked = 'status' in post && post.status === 'publishing';
    
    const modalTitle = isNewPost ? 'Создать пост'
        : isCopyMode ? 'Копирование поста'
        : mode === 'edit' ? 'Редактировать пост'
        : 'Просмотр поста';

    const totalPostCount = (formState.isMultiProjectMode ? formState.selectedProjectIds.size : 1) * (formState.isBulkMode ? formState.dateSlots.length : 1);

    // --- HANDLERS & ACTIONS ---

    const handleClose = () => {
        // ОБНОВЛЕННАЯ ЛОГИКА: Показываем подтверждение, если есть изменения ИЛИ открыты панели
        if (mode === 'edit' && !isSaving && (formState.isDirty || showAIGenerator || showVariables)) {
            setShowUnsavedChangesConfirm(true);
        } else {
            onClose();
        }
    };

    const handleToggleVariables = async (forceRefetch = false) => {
        const shouldOpen = !showVariables;
        setShowVariables(shouldOpen);

        // Fetch Global Variables
        if (shouldOpen && !globalVariables) {
            setIsLoadingGlobalVariables(true);
            try {
                const fetchedGlobalVars = await api.getAllGlobalVariableDefinitions();
                setGlobalVariables(fetchedGlobalVars);
            } catch (error) {
                console.error("Не удалось загрузить глобальные переменные:", error);
            } finally {
                setIsLoadingGlobalVariables(false);
            }
        }
        
        // Fetch Project Variables
        if (shouldOpen && (!variables || forceRefetch)) {
            const storageKey = `variables-${projectId}`;
            if (forceRefetch) {
                sessionStorage.removeItem(storageKey);
            } else {
                const cachedData = sessionStorage.getItem(storageKey);
                if (cachedData) {
                    setVariables(JSON.parse(cachedData));
                    return;
                }
            }
            
            setIsLoadingVariables(true);
            try {
                const fetchedVariables = await api.getProjectVariables(projectId);
                setVariables(fetchedVariables);
                sessionStorage.setItem(storageKey, JSON.stringify(fetchedVariables));
            } catch (error) {
                console.error("Не удалось загрузить переменные:", error);
                window.showAppToast?.("Не удалось загрузить переменные проекта. Пожалуйста, попробуйте снова.", "error");
            } finally {
                setIsLoadingVariables(false);
            }
        }
    };
     const handleReloadVariables = async () => {
        if (!showVariables) setShowVariables(true);
        await handleToggleVariables(true);
    };


    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            const isPublishingNow = formState.publicationMethod === 'now';
            const shouldScheduleInVk = formState.publicationMethod === 'vk';
            const projectsToPostIn: string[] = Array.from(formState.selectedProjectIds);
            const datesToPostOn = formState.isBulkMode ? formState.dateSlots : [formState.dateSlots[0]];
            const allSavePromises: Promise<any>[] = [];
            
            // --- SAVING LOOP ---
            for (const projId of projectsToPostIn) {
                for (let idx = 0; idx < datesToPostOn.length; idx++) {
                    const slot = datesToPostOn[idx];
                    let textToUse = formState.editedText;

                    // ВАЛИДАЦИЯ ПЕРЕД ОТПРАВКОЙ
                    const hasAttachments = formState.editedImages.length > 0 || (formState.editedAttachments && formState.editedAttachments.length > 0);
                    if (!textToUse?.trim() && !hasAttachments) {
                        throw new Error("Текст поста не может быть пустым. Введите текст.");
                    }

                    const saveDateTime = isPublishingNow ? new Date().toISOString() : new Date(`${slot.date}T${slot.time}:00`).toISOString();
                    const postData: ScheduledPost = {
                        id: (isNewPost || isCopyMode) ? `new-post-${Date.now()}-${idx}` : formPost.id, 
                        text: textToUse,
                        date: saveDateTime,
                        images: formState.editedImages,
                        attachments: formState.editedAttachments,
                        // Цикличность
                        is_cyclic: formState.isCyclic,
                        recurrence_interval: formState.isCyclic ? formState.recurrenceInterval : undefined,
                        recurrence_type: formState.isCyclic ? formState.recurrenceType : undefined,
                        recurrence_end_type: formState.isCyclic ? formState.recurrenceEndType : undefined,
                        recurrence_end_count: formState.isCyclic ? formState.recurrenceEndCount : undefined,
                        recurrence_end_date: formState.isCyclic ? formState.recurrenceEndDate : undefined,
                        recurrence_fixed_day: formState.isCyclic && formState.recurrenceFixedDay !== '' ? Number(formState.recurrenceFixedDay) : undefined,
                        recurrence_is_last_day: formState.isCyclic ? formState.recurrenceIsLastDay : undefined,
                    };

                    if (isPublishingNow) {
                        allSavePromises.push(
                            api.publishPost(postData, projId).then(async ({ taskId }) => {
                                await api.pollPostTask(taskId);
                            })
                        );
                    } else {
                        allSavePromises.push(api.savePost(postData, projId, false, shouldScheduleInVk));
                    }
                }
            }

            const results = await Promise.allSettled(allSavePromises);
            const failedCreations = results.filter(r => r.status === 'rejected');

            if (failedCreations.length > 0) {
                 failedCreations.forEach(r => {
                    if (r.status === 'rejected') console.error("Ошибка при создании поста:", String((r as PromiseRejectedResult).reason));
                });
                window.showAppToast?.(`Не удалось создать ${failedCreations.length} из ${allSavePromises.length} постов. Проверьте консоль для детальной информации.`, "error");
            }
            
            let refreshType: RefreshType = 'scheduled';
            if (formState.publicationMethod === 'system') {
              refreshType = 'system';
            } else if (formState.publicationMethod === 'now') {
              refreshType = 'published';
            } else if (formState.publicationMethod === 'vk') {
              if (isPublished && !isCopyMode) {
                refreshType = 'published'; 
              } else {
                refreshType = 'scheduled';
              }
            }

            onSaveComplete(projectsToPostIn, refreshType);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setSaveError(`Не удалось сохранить: ${errorMessage}`);
            console.error("Ошибка сохранения:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const handlePublishNowClick = async () => {
        setIsSaving(true);
        try {
            const postData = {
                ...formPost,
                date: new Date(`${formState.dateSlots[0].date}T${formState.dateSlots[0].time}:00`).toISOString(),
                text: formState.editedText,
                images: formState.editedImages,
                attachments: formState.editedAttachments,
            };

            const { taskId } = await api.publishPost(postData, projectId);
            
            await api.pollPostTask(taskId, (progress) => {
                console.log("Publishing progress:", progress);
            });

            onSaveComplete([projectId], 'published');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Ошибка публикации: ${errorMessage}`, "error");
            console.error("Publishing failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = () => {
        onDelete(post);
    }
    
    const switchToEditMode = () => {
        setMode('edit');
    };
    
    const confirmClose = () => {
        setShowUnsavedChangesConfirm(false);
        onClose();
    };
    
    const cancelClose = () => {
        setShowUnsavedChangesConfirm(false);
    };


    return {
        // Состояния для рендеринга
        state: {
            formPost, // Original post data, normalized
            mode,
            isNewPost,
            isCopyMode,
            isSaving,
            saveError,
            showUnsavedChangesConfirm,
            isLocked,
            isUploadingMedia,
            modalTitle,
            totalPostCount,
            formState, // State from usePostForm
            // Новые состояния для PostTextSection
            showAIGenerator,
            showVariables,
            variables,
            isLoadingVariables,
            globalVariables,
            isLoadingGlobalVariables,
        },
        // Действия для вызова из UI
        actions: {
            handleClose,
            handleSave,
            handlePublishNowClick,
            handleDeleteClick,
            switchToEditMode,
            confirmClose,
            cancelClose,
            setIsUploadingMedia,
            formActions, // Actions from usePostForm
             // Новые действия для PostTextSection
            setShowAIGenerator,
            handleToggleVariables,
            handleReloadVariables,
        },
    };
};