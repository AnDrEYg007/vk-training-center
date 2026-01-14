import { useState, useCallback, useMemo } from 'react';
import { Project, ScheduledPost, Note, SystemPost } from '../../../shared/types';
import * as api from '../../../services/api';
import { UnifiedPost } from './useScheduleData';

// FIX: Added projectId prop to correctly create new system posts with a project_id.
export const useScheduleModals = ({ projectId }: { projectId: string }) => {
    // Post modals
    const [editingPost, setEditingPost] = useState<UnifiedPost | null>(null);
    const [copyingPost, setCopyingPost] = useState<ScheduledPost | null>(null);
    const [deletingPost, setDeletingPost] = useState<ScheduledPost | SystemPost | null>(null);
    const [viewingPost, setViewingPost] = useState<ScheduledPost | SystemPost | null>(null);
    const [publishingPost, setPublishingPost] = useState<UnifiedPost | null>(null);
    const [publishSuccessInfo, setPublishSuccessInfo] = useState<{ project: Project } | null>(null);
    
    // System Post Action Modals
    const [movingToScheduledPost, setMovingToScheduledPost] = useState<SystemPost | null>(null);
    const [confirmingPublicationPost, setConfirmingPublicationPost] = useState<SystemPost | null>(null);
    const [cancellingPublicationPost, setCancellingPublicationPost] = useState<SystemPost | null>(null);
    
    // Automation Modals
    const [viewingContestPost, setViewingContestPost] = useState<SystemPost | null>(null);
    const [viewingAiFeedPost, setViewingAiFeedPost] = useState<SystemPost | null>(null); // NEW

    const [isActionRunning, setIsActionRunning] = useState(false);
    
    // Note modals
    const [viewingNote, setViewingNote] = useState<Note | null>(null);
    const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);
    const [deletingNote, setDeletingNote] = useState<Note | null>(null);
    
    // Interaction modals
    const [movingItemInfo, setMovingItemInfo] = useState<{ id: string, originalDate: string, type: 'post' | 'note' } | null>(null);
    const [dropTargetDate, setDropTargetDate] = useState<Date | null>(null);
    
    // Tags modal
    const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);

    const handleOpenCreateModal = useCallback((date: Date) => {
        const newPostDate = new Date(date);
        if (date.toDateString() === new Date().toDateString()) {
            const now = new Date();
            newPostDate.setHours(now.getHours(), Math.ceil(now.getMinutes() / 15) * 15 + 15, 0, 0);
        } else {
            newPostDate.setHours(10, 0, 0, 0);
        }

        // FIX: A new post is a SystemPost by default and requires all its properties to be set.
        const isoDate = newPostDate.toISOString();
        setEditingPost({
            id: `new-post-${Date.now()}`,
            // Properties for SystemPost
            project_id: projectId,
            publication_date: isoDate,
            text: '',
            images: [],
            attachments: [],
            status: 'pending_publication',
            post_type: 'regular',
            // Properties for UnifiedPost wrapper
            date: isoDate,
            postType: 'system' // По умолчанию новые посты - системные
        });
    }, [projectId]);

    const handleOpenCreateNoteModal = useCallback((date: Date) => {
        const newNoteDate = new Date(date);
        if (date.toDateString() === new Date().toDateString()) {
            const now = new Date();
            newNoteDate.setHours(now.getHours(), now.getMinutes());
        } else {
            newNoteDate.setHours(9, 0, 0, 0);
        }
        setEditingNote({
            id: `new-note-${Date.now()}`,
            date: newNoteDate.toISOString(),
            text: '',
        });
    }, []);

    const handleCopyNote = useCallback((noteToCopy: Note) => {
        const newDate = new Date();
        const originalDate = new Date(noteToCopy.date);
        newDate.setDate(newDate.getDate() + 1);
        newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), 0, 0);
        setEditingNote({
            ...noteToCopy,
            id: `new-note-${Date.now()}`,
            date: newDate.toISOString(),
        });
    }, []);
    
     const handleConfirmMoveToScheduled = useCallback(async (post: SystemPost, onRefreshAll: () => Promise<void>) => {
        setIsActionRunning(true);
        try {
            await api.moveSystemPostToScheduled(post.id);
            window.showAppToast?.("Пост успешно перенесен в отложенные.", 'success');
            await onRefreshAll(); // Обновляем все данные для консистентности
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Произошла ошибка";
            window.showAppToast?.(`Не удалось перенести пост: ${msg}`, 'error');
        } finally {
            setIsActionRunning(false);
            setMovingToScheduledPost(null);
        }
    }, []);

    const handleConfirmSystemPublication = useCallback(async (post: SystemPost, onSystemPostsUpdate: (projectIds: string[]) => Promise<void>) => {
        setIsActionRunning(true);
        try {
            await api.confirmSystemPostPublication(post.id);
            window.showAppToast?.("Публикация подтверждена.", 'success');
            // После подтверждения нужно обновить системные посты
            await onSystemPostsUpdate([post.project_id]);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Произошла ошибка";
            window.showAppToast?.(`Не удалось подтвердить публикацию: ${msg}`, 'error');
        } finally {
            setIsActionRunning(false);
            setConfirmingPublicationPost(null);
        }
    }, []);

    const modalActions = useMemo(() => ({
        setEditingPost,
        setCopyingPost,
        setDeletingPost,
        setViewingPost,
        setPublishingPost,
        setPublishSuccessInfo,
        setViewingNote,
        setEditingNote,
        setDeletingNote,
        setMovingItemInfo,
        setDropTargetDate,
        setIsTagsModalOpen,
        setMovingToScheduledPost,
        setConfirmingPublicationPost,
        setCancellingPublicationPost,
        setViewingContestPost, 
        setViewingAiFeedPost, // NEW
        setIsActionRunning,
        handleOpenCreateModal,
        handleOpenCreateNoteModal,
        handleCopyNote,
        handleConfirmMoveToScheduled,
        handleConfirmSystemPublication,
    }), [handleOpenCreateModal, handleOpenCreateNoteModal, handleCopyNote, handleConfirmMoveToScheduled, handleConfirmSystemPublication]);

    return {
        modalState: {
            editingPost,
            copyingPost,
            deletingPost,
            viewingPost,
            publishingPost,
            publishSuccessInfo,
            viewingNote,
            editingNote,
            deletingNote,
            movingItemInfo,
            dropTargetDate,
            isTagsModalOpen,
            movingToScheduledPost,
            confirmingPublicationPost,
            cancellingPublicationPost,
            viewingContestPost,
            viewingAiFeedPost, // NEW
            isActionRunning,
        },
        modalActions,
    };
};