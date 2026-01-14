
import React from 'react';
import { Project, ScheduledPost, Note, SystemPost } from '../../../shared/types';
import { NoteModal } from '../../notes/components/NoteModal';
import { NotePreviewModal } from '../../notes/components/modals/NotePreviewModal';
import { PostDetailsModal } from '../../posts/components/modals/PostDetailsModal';
import { DeleteConfirmationModal } from '../../posts/components/modals/DeleteConfirmationModal';
import { ConfirmMoveModal } from './modals/ConfirmMoveModal';
import { PublishConfirmationModal } from '../../posts/components/modals/PublishConfirmationModal';
import { PublishSuccessModal } from '../../posts/components/modals/PublishSuccessModal';
import { BulkDeleteConfirmationModal } from './modals/BulkDeleteConfirmationModal';
import { TagsManagementModal } from '../../tags/components/modals/TagsManagementModal';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { ContestWinnerPreviewModal } from './modals/ContestWinnerPreviewModal';
import { AiFeedPreviewModal } from './modals/AiFeedPreviewModal'; // NEW
import * as api from '../../../services/api';
import { UnifiedPost } from '../hooks/useScheduleData';


interface ScheduleModalsProps {
    project: Project;
    projects: Project[];
    modalState: any;
    modalActions: any;
    interactionState: any;
    interactionActions: any;
    dataActions: any;
    loadingStates: any;
    onUpdateProject: (updatedProject: Project) => Promise<void>;
    onConfirmPublish: (post: UnifiedPost) => Promise<void>;
    onNavigateToContest?: () => void; 
    onNavigateToAiPosts?: (postId?: string) => void; // New Prop
}

export const ScheduleModals: React.FC<ScheduleModalsProps> = ({
    project,
    projects,
    modalState,
    modalActions,
    interactionState,
    interactionActions,
    dataActions,
    loadingStates,
    onUpdateProject,
    onConfirmPublish,
    onNavigateToContest,
    onNavigateToAiPosts
}) => {
    const now = new Date();
    
    const handleConfirmCancelPublication = async () => {
        if (!modalState.cancellingPublicationPost) return;
        modalActions.setIsActionRunning(true);
        try {
            await api.deleteSystemPost(modalState.cancellingPublicationPost.id);
            window.showAppToast?.("Системный пост успешно удален.", 'success');
            await dataActions.onSystemPostsUpdate([project.id]);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Произошла ошибка";
            window.showAppToast?.(`Не удалось удалить системный пост: ${msg}`, 'error');
        } finally {
            modalActions.setIsActionRunning(false);
            modalActions.setCancellingPublicationPost(null);
        }
    };

    return (
        <>
            {modalState.isTagsModalOpen && (
                <TagsManagementModal
                    projectId={project.id}
                    onClose={() => modalActions.setIsTagsModalOpen(false)}
                    onTagsUpdated={dataActions.handleRefreshAll}
                />
            )}
            {modalState.viewingNote && (
                <NotePreviewModal
                    note={modalState.viewingNote}
                    onClose={() => modalActions.setViewingNote(null)}
                    onEdit={(note) => { modalActions.setViewingNote(null); modalActions.setEditingNote(note); }}
                    onCopy={(note) => { modalActions.setViewingNote(null); modalActions.handleCopyNote(note); }}
                    onDelete={(note) => { modalActions.setViewingNote(null); modalActions.setDeletingNote(note); }}
                />
            )}
            {modalState.editingNote && (
                <NoteModal
                    note={modalState.editingNote}
                    onClose={() => modalActions.setEditingNote(null)}
                    onSave={async (note) => {
                        const success = await dataActions.handleSaveNote(note);
                        if (success) modalActions.setEditingNote(null);
                    }}
                    isSaving={loadingStates.isSavingNote}
                />
            )}
            {modalState.deletingNote && (
                <DeleteConfirmationModal
                    itemType="заметку"
                    itemDate={modalState.deletingNote.date}
                    onClose={() => modalActions.setDeletingNote(null)}
                    onConfirm={async () => {
                        const success = await dataActions.handleDeleteNote(modalState.deletingNote!);
                        if (success) modalActions.setDeletingNote(null);
                    }}
                    isDeleting={loadingStates.isDeleting}
                />
            )}
            {modalState.viewingPost && (
                <PostDetailsModal
                    post={modalState.viewingPost}
                    isPublished={!('status' in modalState.viewingPost) && new Date(modalState.viewingPost.date) < now}
                    projectId={project.id}
                    allProjects={projects}
                    onClose={() => modalActions.setViewingPost(null)}
                    onSaveComplete={(projectIds, refreshType) => {
                        dataActions.handleSavePost(projectIds, refreshType);
                        modalActions.setViewingPost(null);
                    }}
                    onDelete={(post) => { modalActions.setViewingPost(null); modalActions.setDeletingPost(post); }}
                    onPublishNow={(post) => { modalActions.setViewingPost(null); modalActions.setPublishingPost(post); }}
                    onUpdateProject={onUpdateProject}
                />
            )}
            {modalState.editingPost && (
                <PostDetailsModal
                    post={modalState.editingPost}
                    isPublished={new Date(modalState.editingPost.date) < now}
                    projectId={project.id}
                    allProjects={projects}
                    onClose={() => modalActions.setEditingPost(null)}
                    onSaveComplete={(projectIds, refreshType) => { dataActions.handleSavePost(projectIds, refreshType); modalActions.setEditingPost(null); }}
                    onDelete={(post) => { modalActions.setEditingPost(null); modalActions.setDeletingPost(post); }}
                    onPublishNow={(post) => { modalActions.setEditingPost(null); modalActions.setPublishingPost(post); }}
                    initialMode="edit"
                    onUpdateProject={onUpdateProject}
                />
            )}
            {modalState.copyingPost && (
                <PostDetailsModal
                    post={modalState.copyingPost}
                    isPublished={false}
                    projectId={project.id}
                    allProjects={projects}
                    onClose={() => modalActions.setCopyingPost(null)}
                    onSaveComplete={(projectIds, refreshType) => { dataActions.handleSavePost(projectIds, refreshType); modalActions.setCopyingPost(null); }}
                    onDelete={() => {}}
                    onPublishNow={() => {}}
                    initialMode="copy"
                    onUpdateProject={onUpdateProject}
                />
            )}
            {/* Модалка для превью конкурса */}
            {modalState.viewingContestPost && (
                <ContestWinnerPreviewModal
                    post={modalState.viewingContestPost}
                    onClose={() => modalActions.setViewingContestPost(null)}
                    onNavigateToSettings={() => {
                        modalActions.setViewingContestPost(null);
                        if (onNavigateToContest) onNavigateToContest();
                    }}
                />
            )}
            {/* НОВАЯ Модалка для превью AI поста */}
            {modalState.viewingAiFeedPost && (
                <AiFeedPreviewModal
                    post={modalState.viewingAiFeedPost}
                    onClose={() => modalActions.setViewingAiFeedPost(null)}
                    onNavigateToSettings={() => {
                        modalActions.setViewingAiFeedPost(null);
                        if (onNavigateToAiPosts) {
                             // Передаем originalId если это призрак, иначе id поста
                             const postId = modalState.viewingAiFeedPost.originalId || modalState.viewingAiFeedPost.id;
                             onNavigateToAiPosts(postId);
                        }
                    }}
                />
            )}
            {modalState.deletingPost && (
                <DeleteConfirmationModal
                    itemType="пост"
                    itemDate={modalState.deletingPost.date}
                    onClose={() => modalActions.setDeletingPost(null)}
                    onConfirm={async () => {
                        const success = await dataActions.handleDelete(modalState.deletingPost!);
                        if (success) modalActions.setDeletingPost(null);
                    }}
                    isDeleting={loadingStates.isDeleting}
                />
            )}
            {interactionState.bulkDeleteTargetCount > 0 && (
                <BulkDeleteConfirmationModal
                    count={interactionState.bulkDeleteTargetCount}
                    onClose={() => interactionActions.setBulkDeleteTargetCount(0)}
                    onConfirm={() => interactionActions.handleConfirmBulkDelete(
                        () => interactionActions.setBulkDeleteTargetCount(0),
                        dataActions.handleDelete,
                        dataActions.handleDeleteNote
                    )}
                    isDeleting={loadingStates.isBulkDeleting}
                />
            )}
            {modalState.movingItemInfo && modalState.dropTargetDate && (
                <ConfirmMoveModal
                    isOpen={!!modalState.movingItemInfo}
                    onClose={() => { modalActions.setMovingItemInfo(null); modalActions.setDropTargetDate(null); }}
                    onConfirm={(id, newDate, isCopy, type, copyDestination) => interactionActions.handleConfirmDrop(id, newDate, isCopy, type, copyDestination, () => {
                        modalActions.setMovingItemInfo(null);
                        modalActions.setDropTargetDate(null);
                    })}
                    itemInfo={modalState.movingItemInfo}
                    targetDate={modalState.dropTargetDate}
                    isMoving={loadingStates.isMovingPost}
                />
            )}
            {modalState.publishingPost && (
                <PublishConfirmationModal
                    post={modalState.publishingPost}
                    onClose={() => modalActions.setPublishingPost(null)}
                    onConfirm={onConfirmPublish}
                />
            )}
            {modalState.publishSuccessInfo && (
                <PublishSuccessModal
                    project={modalState.publishSuccessInfo.project}
                    onClose={() => modalActions.setPublishSuccessInfo(null)}
                />
            )}
            {modalState.movingToScheduledPost && (
                <ConfirmationModal
                    title="Перенести в отложку ВК"
                    message={`Вы уверены, что хотите перенести этот пост из системных в отложенные посты VK?`}
                    onConfirm={() => modalActions.handleConfirmMoveToScheduled(modalState.movingToScheduledPost, dataActions.handleRefreshAll)}
                    onCancel={() => modalActions.setMovingToScheduledPost(null)}
                    isConfirming={modalState.isActionRunning}
                    confirmText="Да, перенести"
                />
            )}
            {modalState.confirmingPublicationPost && (
                 <ConfirmationModal
                    title="Подтвердить публикацию"
                    message={`Вы уверены, что пост опубликован корректно? Запись о возможной ошибке будет удалена из системы.`}
                    onConfirm={() => modalActions.handleConfirmSystemPublication(modalState.confirmingPublicationPost, dataActions.onSystemPostsUpdate)}
                    onCancel={() => modalActions.setConfirmingPublicationPost(null)}
                    isConfirming={modalState.isActionRunning}
                    confirmText="Да, подтверждаю"
                    confirmButtonVariant="success"
                />
            )}
            {modalState.cancellingPublicationPost && (
                 <ConfirmationModal
                    title="Отменить проверку публикации?"
                    message={`Вы уверены, что хотите отменить проверку и удалить этот системный пост? Это действие необратимо.`}
                    onConfirm={handleConfirmCancelPublication}
                    onCancel={() => modalActions.setCancellingPublicationPost(null)}
                    isConfirming={modalState.isActionRunning}
                    confirmText="Да, удалить"
                    confirmButtonVariant="danger"
                />
            )}
        </>
    );
};
