
import React, { useState, useCallback } from 'react';
import { Project, ScheduledPost, Note, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../shared/types';
import { useProjects } from '../../../contexts/ProjectsContext';
import { useScheduleData, UnifiedPost } from '../hooks/useScheduleData';
import { useScheduleInteraction, ViewMode } from '../hooks/useScheduleInteraction';
import { useScheduleModals } from '../hooks/useScheduleModals';

import { ScheduleHeader } from './ScheduleHeader';
import { DayColumn } from './DayColumn';
import ScheduleGrid from './ScheduleGrid';
import { ScheduleModals } from './ScheduleModals';
import { RefreshType } from '../../posts/components/modals/PostDetailsModal';
import * as api from '../../../services/api';


export const ScheduleTab: React.FC<{ 
    project: Project;
    projects: Project[];
    publishedPosts: ScheduledPost[];
    scheduledPosts: ScheduledPost[];
    systemPosts: SystemPost[]; // Новое свойство
    notes: Note[];
    allGlobalVarDefs: GlobalVariableDefinition[]; // Новый проп
    allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]>; // Новый проп
    onUpdateProject: (updatedProject: Project) => Promise<void>;
    onNotesUpdate: (projectId?: string) => Promise<void>;
    permissionErrorMessage?: string | null;
    emptyScheduleMessage?: string | null;
    onNavigateToContest?: () => void; // New prop for navigation
    onNavigateToGeneralContest?: (contestId?: string) => void;
    onNavigateToAiPosts?: (postId?: string) => void; // New prop for AI posts navigation
}> = ({ 
    project, 
    projects, 
    publishedPosts, 
    scheduledPosts, 
    systemPosts,
    notes: initialNotes,
    allGlobalVarDefs,
    allGlobalVarValues,
    onUpdateProject,
    onNotesUpdate,
    permissionErrorMessage,
    emptyScheduleMessage,
    onNavigateToContest,
    onNavigateToGeneralContest,
    onNavigateToAiPosts
}) => {
    
    const { handleRefreshPublished, handleRefreshScheduled, handleSystemPostUpdate, handleBulkRefresh, syncDataForProject, handleRefreshAllSchedule, allStories } = useProjects();
    const [isRefreshingSystem, setIsRefreshingSystem] = useState(false);
    const [isRefreshingNotes, setIsRefreshingNotes] = useState(false);

    const handleRefreshSystem = async () => {
        setIsRefreshingSystem(true);
        try {
            await handleSystemPostUpdate([project.id]);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
            window.showAppToast?.(`Не удалось обновить системные посты: ${errorMessage}`, 'error');
        } finally {
            setIsRefreshingSystem(false);
        }
    };

    const handleRefreshNotes = async () => {
        setIsRefreshingNotes(true);
        try {
            await onNotesUpdate(project.id);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
            window.showAppToast?.(`Не удалось обновить заметки: ${errorMessage}`, 'error');
        } finally {
            setIsRefreshingNotes(false);
        }
    };

    const handleSaveCompletion = useCallback(async (projectIds: string[], refreshType: RefreshType) => {
        if (refreshType === 'system') {
            await handleSystemPostUpdate(projectIds);
        } else if (refreshType === 'published') {
            console.log(`Обновление данных после публикации для проектов: ${projectIds.join(', ')}`);
            for (const id of projectIds) {
                // Обновляем все списки: 
                // - Опубликованные (чтобы увидеть новый пост)
                // - Отложенные (чтобы убрать пост, если он был опубликован из отложки)
                // - Системные (через syncDataForProject, чтобы убрать пост, если он был системным)
                await Promise.all([
                    handleRefreshPublished(id),
                    handleRefreshScheduled(id),
                    syncDataForProject(id, 'schedule')
                ]);
            }
        } else { // 'scheduled'
            await handleBulkRefresh(projectIds);
        }
    }, [handleSystemPostUpdate, handleRefreshPublished, handleRefreshScheduled, handleBulkRefresh, syncDataForProject]);
    
    const handleConfirmPublish = useCallback(async (
        postToPublish: UnifiedPost,
        setPublishingPost: (post: UnifiedPost | null) => void,
        setPublishSuccessInfo: (info: { project: Project } | null) => void
    ) => {
        try {
            if (postToPublish.postType === 'system') {
                await api.publishSystemPost(postToPublish.id);
                // Обновляем и опубликованные, и системные
                await Promise.all([
                    handleRefreshPublished(project.id),
                    handleSystemPostUpdate([project.id])
                ]);
                setPublishingPost(null);
                window.showAppToast?.("Пост отправлен на публикацию. Он появится на стене в течение минуты.", 'success');
            } else { // 'scheduled' or 'published' type (handled by publishPost)
                await api.publishPost(postToPublish as ScheduledPost, project.id);
                // Обновляем и опубликованные, и отложенные
                await Promise.all([
                    handleRefreshPublished(project.id),
                    handleRefreshScheduled(project.id)
                ]);
                setPublishingPost(null);
                setPublishSuccessInfo({ project });
            }
        } catch (error) {
            setPublishingPost(null);
            const errorMessage = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Не удалось опубликовать пост. Ошибка: ${errorMessage}`, 'error');
        }
    }, [project, handleRefreshPublished, handleRefreshScheduled, handleSystemPostUpdate]);

    // 1. Управление данными
    const { 
        posts, 
        notes, 
        loadingStates: dataLoadingStates, 
        actions: dataActions 
    } = useScheduleData({
        project,
        initialPublishedPosts: publishedPosts,
        initialScheduledPosts: scheduledPosts,
        initialSystemPosts: systemPosts,
        initialNotes: initialNotes,
        onRefreshPublished: (projectId) => handleRefreshPublished(projectId),
        onRefreshScheduled: handleRefreshScheduled,
        onSystemPostsUpdate: handleSystemPostUpdate,
        onNotesUpdate,
        onSaveComplete: handleSaveCompletion,
        onRefreshAllSchedule: handleRefreshAllSchedule,
    });

    // 2. Управление модальными окнами
    const { 
        modalState, 
        modalActions 
    } = useScheduleModals({ projectId: project.id });

    // 3. Управление взаимодействиями
    const {
        interactionState,
        interactionActions,
        dragActions,
        weekDates
    } = useScheduleInteraction({
        project,
        posts,
        notes,
        onRefreshAll: dataActions.handleRefreshAll,
        onSaveNote: dataActions.handleSaveNote,
        setCopyingPost: modalActions.setCopyingPost,
    });
    
    const combinedLoadingStates = {
        ...dataLoadingStates,
        ...interactionState.loadingStates,
        isRefreshingSystem,
        isRefreshingNotes,
    };

    const handleSelectSearchPost = (post: UnifiedPost) => {
        // 1. Navigate to week
        const target = new Date(post.date);
        target.setHours(0, 0, 0, 0);
        
        const startOfView = new Date(weekDates[0]);
        startOfView.setHours(0, 0, 0, 0);
        
        const diffTime = target.getTime() - startOfView.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffWeeks !== 0) {
            interactionActions.setWeekOffset(prev => prev + diffWeeks);
        }

        // 2. Open Modal
        // Logic similar to ScheduleGrid handleEdit/handleClick
        if (post.postType === 'system') {
            if (post.post_type === 'contest_winner') {
                 modalActions.setViewingContestPost(post);
            } else if (post.post_type === 'ai_feed') {
                 modalActions.setViewingAiFeedPost(post);
            } else {
                 // Для системных постов по умолчанию редактирование
                 modalActions.setEditingPost(post);
            }
        } else {
             // Отложенные или Опубликованные
             // Открываем модальное окно деталей
             modalActions.setEditingPost(post);
        }

        // 3. Highlight (Aura effect)
        // Устанавливаем подсветку
        interactionActions.setHighlightedPostId(post.id);
        
        // Автоматически снимаем подсветку через 3 секунды
        setTimeout(() => {
             interactionActions.setHighlightedPostId(null);
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ScheduleHeader
                project={project}
                posts={posts}
                weekDates={weekDates}
                weekOffset={interactionState.weekOffset}
                viewMode={interactionState.viewMode}
                isSelectionMode={interactionState.isSelectionMode}
                selectedPostIds={interactionState.selectedPostIds}
                selectedNoteIds={interactionState.selectedNoteIds}
                loadingStates={combinedLoadingStates}
                noteVisibility={interactionState.noteVisibility}
                tagVisibility={interactionState.tagVisibility}
                onRefreshAll={dataActions.handleRefreshAll}
                onRefreshSystem={handleRefreshSystem}
                onRefreshNotes={handleRefreshNotes}
                onSetWeekOffset={interactionActions.setWeekOffset}
                onSetViewMode={interactionActions.setViewMode}
                onToggleSelectionMode={interactionActions.handleToggleSelectionMode}
                onClearSelection={interactionActions.handleClearSelection}
                onInitiateBulkDelete={interactionActions.handleInitiateBulkDelete}
                onCreateNote={() => modalActions.handleOpenCreateNoteModal(new Date())}
                onCycleNoteVisibility={interactionActions.cycleNoteVisibility}
                onToggleTagVisibility={interactionActions.toggleTagVisibility}
                onOpenTagsModal={() => modalActions.setIsTagsModalOpen(true)}
                onSelectSearchPost={handleSelectSearchPost}
            />

            {permissionErrorMessage && (
                <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 mx-4 mt-4 rounded-r-lg shadow" role="alert">
                    <div className="flex">
                        <div className="py-1">
                            <svg className="h-6 w-6 text-amber-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Ошибка доступа</p>
                            <p className="text-sm">Не удалось загрузить данные. Убедитесь, что сервисный токен имеет права администратора в этом сообществе, после чего обновите данные вручную.</p>
                        </div>
                    </div>
                </div>
            )}
            
            {emptyScheduleMessage && (
                 <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 mx-4 mt-4 rounded-r-lg shadow" role="status">
                    <div className="flex">
                        <div className="py-1">
                             <svg className="h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold">Информация</p>
                            <p className="text-sm">{emptyScheduleMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-grow flex flex-col overflow-y-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 px-4 pt-4 pb-2 flex-shrink-0">
                    {weekDates.map((date, i) => {
                        return (
                            <DayColumn.Header
                                key={`header-${i}`}
                                date={date}
                                isSelectionMode={interactionState.isSelectionMode}
                                onOpenCreateModal={modalActions.handleOpenCreateModal}
                            />
                        );
                    })}
                </div>
                
                <ScheduleGrid
                    weekDates={weekDates}
                    posts={posts} // posts теперь содержит все типы постов
                    stories={allStories[project.id] || []}
                    notes={notes}
                    noteVisibility={interactionState.noteVisibility}
                    tagVisibility={interactionState.tagVisibility}
                    isSelectionMode={interactionState.isSelectionMode}
                    selectedPostIds={interactionState.selectedPostIds}
                    selectedNoteIds={interactionState.selectedNoteIds}
                    highlightedPostId={interactionState.highlightedPostId}
                    expandedPosts={interactionState.expandedPosts}
                    dragActions={dragActions}
                    interactionActions={interactionActions}
                    modalActions={modalActions}
                    // Передаем глобальные переменные
                    globalVarDefs={allGlobalVarDefs}
                    projectGlobalVarValues={allGlobalVarValues[project.id] || []}
                    onNavigateToContest={onNavigateToContest}
                    // Navigation logic for posts grid item click handling is done inside ScheduleGrid->PostCard or similar, 
                    // but the click handler comes from useScheduleModals which sets the state.
                    // The actual navigation happens in the modal (AiFeedPreviewModal).
                />
            </div>
            
            <ScheduleModals
                project={project}
                projects={projects}
                modalState={modalState}
                modalActions={modalActions}
                interactionState={interactionState}
                interactionActions={interactionActions}
                dataActions={dataActions}
                loadingStates={combinedLoadingStates}
                onUpdateProject={onUpdateProject}
                onConfirmPublish={post => handleConfirmPublish(
                    post, 
                    modalActions.setPublishingPost, 
                    modalActions.setPublishSuccessInfo
                )}
                onNavigateToContest={onNavigateToContest}
                onNavigateToGeneralContest={onNavigateToGeneralContest}
                onNavigateToAiPosts={onNavigateToAiPosts}
            />
        </div>
    );
};
