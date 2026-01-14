
import { useState, useRef, DragEvent, useCallback, useMemo } from 'react';
import { Project, ScheduledPost, Note, SystemPost } from '../../../shared/types';
import * as api from '../../../services/api';
import { UnifiedPost } from './useScheduleData';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';


export type NoteVisibility = 'expanded' | 'collapsed' | 'hidden';
export type ViewMode = 'week' | 'today';

interface UseScheduleInteractionProps {
    project: Project;
    posts: UnifiedPost[];
    notes: Note[];
    onRefreshAll: () => Promise<void>;
    onSaveNote: (note: Partial<Note>) => Promise<boolean>;
    setCopyingPost: (post: ScheduledPost | null) => void;
}

export const useScheduleInteraction = ({
    project,
    posts,
    notes,
    onRefreshAll,
    onSaveNote,
    setCopyingPost,
}: UseScheduleInteractionProps) => {
    const [weekOffset, setWeekOffset] = useState(0);
    const [viewMode, setViewMode] = useLocalStorage<ViewMode>('schedule-view-mode', 'week');
    const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
    const [noteVisibility, setNoteVisibility] = useState<NoteVisibility>('expanded');
    const [tagVisibility, setTagVisibility] = useState<'visible' | 'hidden'>('visible');
    
    // Selection states
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());
    const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set());
    const [bulkDeleteTargetCount, setBulkDeleteTargetCount] = useState<number>(0);
    const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

    // Drag & Drop states
    const draggedPostRef = useRef<UnifiedPost | null>(null);
    const draggedNoteRef = useRef<Note | null>(null);

    // Loading states for interactions
    const [loadingStates, setLoadingStates] = useState({
        isMovingPost: false,
        isBulkDeleting: false,
    });
    
    const weekDates = useMemo(() => {
        if (viewMode === 'week') {
            const getStartOfWeek = (offset = 0) => {
                const now = new Date();
                const monday = new Date(now);
                monday.setDate(now.getDate() - ((now.getDay() + 6) % 7) + offset * 7);
                monday.setHours(0, 0, 0, 0);
                return monday;
            };
            const startOfWeek = getStartOfWeek(weekOffset);
            return Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(startOfWeek);
                date.setDate(date.getDate() + i);
                return date;
            });
        } else { // 'today' mode
            const getStartOfView = (offset = 0) => {
                const today = new Date();
                today.setDate(today.getDate() + offset * 7);
                today.setHours(0, 0, 0, 0);
                return today;
            };
            const startOfView = getStartOfView(weekOffset);
            return Array.from({ length: 7 }).map((_, i) => {
                const date = new Date(startOfView);
                date.setDate(date.getDate() + i);
                return date;
            });
        }
    }, [weekOffset, viewMode]);

    const handleSetViewMode = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        setWeekOffset(0); // Сбрасываем смещение при смене режима для предсказуемости
    }, [setViewMode]);

    const cycleNoteVisibility = useCallback(() => {
        setNoteVisibility(prev => {
            if (prev === 'expanded') return 'collapsed';
            if (prev === 'collapsed') return 'hidden';
            return 'expanded';
        });
    }, []);

    const toggleTagVisibility = useCallback(() => {
        setTagVisibility(prev => (prev === 'visible' ? 'hidden' : 'visible'));
    }, []);

    const handleToggleSelectionMode = useCallback(() => {
        if (isSelectionMode) {
            setSelectedPostIds(new Set());
            setSelectedNoteIds(new Set());
        }
        setIsSelectionMode(prev => !prev);
    }, [isSelectionMode]);

    const handleClearSelection = useCallback(() => {
        setSelectedPostIds(new Set());
        setSelectedNoteIds(new Set());
    }, []);

    const handleInitiateBulkDelete = useCallback(() => {
        setBulkDeleteTargetCount(selectedPostIds.size + selectedNoteIds.size);
    }, [selectedPostIds.size, selectedNoteIds.size]);
    
    const handleConfirmBulkDelete = useCallback(async (
        closeModal: () => void, 
        deletePostAction: (post: UnifiedPost) => Promise<boolean>,
        deleteNoteAction: (note: Note) => Promise<boolean>
    ) => {
        setLoadingStates(prev => ({ ...prev, isBulkDeleting: true }));
        
        const postsToDelete = Array.from(selectedPostIds).map(id => posts.find(p => p.id === id)).filter((p): p is UnifiedPost => !!p);
        const notesToDelete = Array.from(selectedNoteIds).map(id => notes.find(n => n.id === id)).filter((n): n is Note => !!n);

        const postPromises = postsToDelete.map(p => deletePostAction(p));
        const notePromises = notesToDelete.map(n => deleteNoteAction(n));

        const results = await Promise.allSettled([...postPromises, ...notePromises]);
        const successfulDeletes = results.filter(r => r.status === 'fulfilled' && r.value).length;
        window.showAppToast?.(`Успешно удалено: ${successfulDeletes} элементов.\nНе удалось удалить: ${results.length - successfulDeletes} элементов.`, 'info');

        setLoadingStates(prev => ({ ...prev, isBulkDeleting: false }));
        closeModal();
        setIsSelectionMode(false);
        setSelectedPostIds(new Set());
        setSelectedNoteIds(new Set());
        await onRefreshAll();
    }, [selectedPostIds, selectedNoteIds, posts, notes, onRefreshAll]);


    const handlePostDragStart = useCallback((e: DragEvent<HTMLDivElement>, post: UnifiedPost) => {
        draggedNoteRef.current = null;
        draggedPostRef.current = post;
        
        if (post.postType === 'system' && post.status === 'publishing') {
            e.dataTransfer.effectAllowed = 'copy';
        } else if (post.postType === 'published') {
            e.dataTransfer.effectAllowed = 'copy';
        } else {
            e.dataTransfer.effectAllowed = 'move';
        }
        
        e.currentTarget.classList.add('opacity-50', 'scale-95');
    }, []);
    
    const handleNoteDragStart = useCallback((e: DragEvent<HTMLDivElement>, note: Note) => {
        draggedPostRef.current = null;
        draggedNoteRef.current = note;
        e.dataTransfer.effectAllowed = 'all';
        e.currentTarget.classList.add('opacity-50', 'scale-95');
    }, []);

    const handleDragEnd = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('opacity-50', 'scale-95');
        draggedPostRef.current = null;
        draggedNoteRef.current = null;
    }, []);
    
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>, targetDay: Date, openMoveConfirm: (info: any, date: Date) => void) => {
        e.preventDefault();
        const postToMove = draggedPostRef.current;
        const noteToMove = draggedNoteRef.current;

        if (postToMove && new Date(postToMove.date).toDateString() !== targetDay.toDateString()) {
            const proposedNewDate = new Date(targetDay);
            proposedNewDate.setHours(new Date(postToMove.date).getHours(), new Date(postToMove.date).getMinutes(), 0, 0);

            const isSystemPublishing = postToMove.postType === 'system' && postToMove.status === 'publishing';
            const isAlreadyPublished = postToMove.postType === 'published';

            if (isSystemPublishing || isAlreadyPublished) {
                setCopyingPost({ ...postToMove, date: proposedNewDate.toISOString() } as ScheduledPost);
            } else {
                openMoveConfirm({ id: postToMove.id, originalDate: postToMove.date, type: 'post' }, targetDay);
            }
        } else if (noteToMove && new Date(noteToMove.date).toDateString() !== targetDay.toDateString()) {
             openMoveConfirm({ id: noteToMove.id, originalDate: noteToMove.date, type: 'note' }, targetDay);
        }
    }, [setCopyingPost]);
    
    const handleConfirmDrop = useCallback(async (id: string, newDate: Date, isCopy: boolean, type: 'post' | 'note', copyDestination: 'system' | 'vk' = 'system', closeModal: () => void) => {
        setLoadingStates(prev => ({ ...prev, isMovingPost: true }));
        const itemTypeStr = type === 'post' ? 'пост' : 'заметку';

        try {
            if (type === 'post') {
                const originalPost = posts.find(p => p.id === id);
                if (!originalPost) throw new Error("Post not found");

                let scheduleInVk = false;
                if (isCopy) {
                    scheduleInVk = (copyDestination === 'vk');
                } else { // Это перемещение
                    if (originalPost.postType === 'scheduled' || originalPost.postType === 'published') {
                        scheduleInVk = true; // Перемещение поста VK должно остаться в VK
                    }
                    // Для перемещения системного поста scheduleInVk остается false
                }

                // Если мы работаем с VK (планируем или переносим туда), используем фоновую задачу
                if (scheduleInVk) {
                     let postDataForApi: ScheduledPost;
                     
                     // Подготовка данных поста (аналогично обычной логике)
                     const { postType, status, publication_date, project_id, ...restOfPost } = originalPost as any;
                     postDataForApi = {
                        ...restOfPost,
                        id: isCopy ? `new-post-${Date.now()}` : originalPost.id,
                        date: newDate.toISOString(),
                        tags: [], // Теги переназначаются на бэкенде
                        vkPostUrl: undefined
                     } as ScheduledPost;

                     // Запускаем задачу
                     const { taskId } = await api.schedulePostTask(
                         postDataForApi, 
                         project.id,
                         isCopy ? undefined : originalPost.id // Если перемещение, передаем ID для удаления
                     );
                     
                     // Ожидаем завершения
                     await api.pollPostTask(taskId);

                } else {
                    // Логика для системных постов (оставляем синхронной, так как это быстро)
                    let postDataForApi: ScheduledPost;

                    if (originalPost.postType === 'system') {
                        const { postType, status, publication_date, project_id, ...restOfPost } = originalPost;
                        postDataForApi = {
                            ...(restOfPost as Omit<SystemPost, 'status' | 'post_type' | 'publication_date' | 'project_id'>),
                            date: newDate.toISOString(),
                            id: isCopy ? `new-post-${Date.now()}` : originalPost.id,
                            tags: [],
                            vkPostUrl: undefined,
                        };
                    } else { // scheduled or published -> to system
                        const { postType, ...postData } = originalPost;
                        postDataForApi = isCopy
                            ? { ...postData, id: `new-post-${Date.now()}`, date: newDate.toISOString() }
                            : { ...postData, date: newDate.toISOString() };
                    }
                    
                    await api.savePost(postDataForApi, project.id, false, false);
                }

            } else { // type === 'note'
                const originalNote = notes.find(n => n.id === id);
                if (!originalNote) throw new Error("Note not found");

                const noteToSave: Partial<Note> = isCopy
                    ? { ...originalNote, id: `new-note-${Date.now()}`, date: newDate.toISOString() }
                    : { ...originalNote, date: newDate.toISOString() };
                
                await onSaveNote(noteToSave);
            }
            window.showAppToast?.(`${itemTypeStr.charAt(0).toUpperCase() + itemTypeStr.slice(1)} успешно ${isCopy ? 'скопирован(а)' : 'перенесен(а)'}.`, 'success');
            await onRefreshAll();
            closeModal();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            window.showAppToast?.(`Не удалось ${isCopy ? 'скопировать' : 'перенести'} ${itemTypeStr}. Ошибка: ${errorMessage}`, 'error');
        } finally {
            setLoadingStates(prev => ({ ...prev, isMovingPost: false }));
        }
    }, [posts, notes, project.id, onSaveNote, onRefreshAll]);

    const toggleExpandPost = useCallback((postId: string) => setExpandedPosts(prev => ({ ...prev, [postId]: !prev[postId] })), []);
    
    const handleTogglePostSelection = useCallback((postId: string) => setSelectedPostIds(prev => {
        const newSet = new Set(prev);
        newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId);
        return newSet;
    }), []);

    const handleToggleNoteSelection = useCallback((noteId: string) => setSelectedNoteIds(prev => {
        const newSet = new Set(prev);
        newSet.has(noteId) ? newSet.delete(noteId) : newSet.add(noteId);
        return newSet;
    }), []);

    const interactionActions = useMemo(() => ({
        setWeekOffset,
        setViewMode: handleSetViewMode,
        toggleExpandPost,
        cycleNoteVisibility,
        toggleTagVisibility,
        handleToggleSelectionMode,
        handleClearSelection,
        handleInitiateBulkDelete,
        setBulkDeleteTargetCount,
        handleConfirmBulkDelete,
        handleConfirmDrop,
        handleTogglePostSelection,
        handleToggleNoteSelection,
        setHighlightedPostId,
    }), [cycleNoteVisibility, toggleTagVisibility, handleClearSelection, handleConfirmBulkDelete, handleConfirmDrop, handleInitiateBulkDelete, handleToggleNoteSelection, handleTogglePostSelection, handleToggleSelectionMode, toggleExpandPost, handleSetViewMode]);

    const dragActions = useMemo(() => ({
        handlePostDragStart,
        handleNoteDragStart,
        handleDragEnd,
        handleDrop,
    }), [handleDrop, handleDragEnd, handleNoteDragStart, handlePostDragStart]);


    return {
        interactionState: {
            weekOffset,
            viewMode,
            expandedPosts,
            noteVisibility,
            tagVisibility,
            isSelectionMode,
            selectedPostIds,
            selectedNoteIds,
            bulkDeleteTargetCount,
            loadingStates,
            highlightedPostId,
        },
        interactionActions,
        dragActions,
        weekDates,
    };
};
