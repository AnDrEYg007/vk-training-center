import { useState, useEffect, useMemo } from 'react';
import { ScheduledPost, PhotoAttachment, Attachment } from '../../../shared/types';
import { useDirtyCheck } from './useDirtyCheck';
import { useBulkCreationManager } from './useBulkCreationManager';
import { ChatTurn } from './useAIGenerator';

export const usePostForm = (
    post: ScheduledPost, 
    initialMode: 'view' | 'edit' | 'copy', 
    projectId: string,
    postType?: 'scheduled' | 'published' | 'system'
) => {
    // Form state
    const getInitialPublicationMethod = (): 'system' | 'vk' | 'now' => {
        const isNew = post.id.startsWith('new-post-');
        
        if (isNew || initialMode === 'copy') {
            return 'system'; // Новые или скопированные посты всегда по умолчанию системные.
        }

        // Если это существующий пост из VK (отложенный ИЛИ опубликованный),
        // то при редактировании мы должны использовать VK API.
        if (postType === 'scheduled' || postType === 'published') {
            return 'vk';
        }

        // Во всех остальных случаях (например, редактирование существующего системного поста) - метод системный.
        return 'system'; 
    };

    const [publicationMethod, setPublicationMethod] = useState<'system' | 'vk' | 'now'>(getInitialPublicationMethod());
    const [editedText, setEditedText] = useState(post.text);
    const [editedImages, setEditedImages] = useState<PhotoAttachment[]>(post.images);
    const [editedAttachments, setEditedAttachments] = useState<Attachment[]>(post.attachments || []);
    
    // Cyclic state
    const [isCyclic, setIsCyclic] = useState(post.is_cyclic || false);
    const [recurrenceInterval, setRecurrenceInterval] = useState(post.recurrence_interval || 1);
    const [recurrenceType, setRecurrenceType] = useState<'minutes' | 'hours' | 'days' | 'weeks' | 'months'>(post.recurrence_type || 'days');
    
    // Enhanced Cyclic state
    const [recurrenceEndType, setRecurrenceEndType] = useState<'infinite' | 'count' | 'date'>(post.recurrence_end_type || 'infinite');
    const [recurrenceEndCount, setRecurrenceEndCount] = useState<number>(post.recurrence_end_count || 5);
    const [recurrenceEndDate, setRecurrenceEndDate] = useState<string>(post.recurrence_end_date || '');
    const [recurrenceFixedDay, setRecurrenceFixedDay] = useState<number | ''>(post.recurrence_fixed_day || '');
    const [recurrenceIsLastDay, setRecurrenceIsLastDay] = useState<boolean>(post.recurrence_is_last_day || false);

    // AI Multi-Generation State
    const [isAiMultiMode, setIsAiMultiMode] = useState(false);
    const [selectedAiTurn, setSelectedAiTurn] = useState<ChatTurn | null>(null);

    // 1. Хук для управления режимами массового/мультипроектного создания
    const {
        bulkState,
        bulkActions,
        isFutureDate
    } = useBulkCreationManager(post, initialMode, projectId);

    const { dateSlots, isBulkMode, isMultiProjectMode, selectedProjectIds } = bulkState;
    const { setIsBulkMode, setIsMultiProjectMode, setSelectedProjectIds, handleAddDateSlot, handleRemoveDateSlot, handleDateSlotChange } = bulkActions;

    // 2. Хук для определения "грязного" состояния формы
    // ВНИМАНИЕ: useDirtyCheck пока не учитывает новые циклические поля. 
    // Для упрощения считаем форму грязной при изменении флагов цикличности вручную.
    const basicIsDirty = useDirtyCheck({
        originalPost: post,
        initialMode,
        currentProjectId: projectId,
        editedText,
        editedImages,
        editedAttachments,
        isBulkMode,
        isMultiProjectMode,
        dateSlots,
        selectedProjectIds,
    });
    
    const isCyclicDirty = isCyclic !== (post.is_cyclic || false) || 
                          recurrenceInterval !== (post.recurrence_interval || 1) ||
                          recurrenceType !== (post.recurrence_type || 'days') ||
                          recurrenceEndType !== (post.recurrence_end_type || 'infinite') ||
                          recurrenceEndCount !== (post.recurrence_end_count || 5) ||
                          recurrenceEndDate !== (post.recurrence_end_date || '') ||
                          recurrenceFixedDay !== (post.recurrence_fixed_day || '') ||
                          recurrenceIsLastDay !== (post.recurrence_is_last_day || false);
                          
    const isDirty = basicIsDirty || isCyclicDirty;


    // Синхронизация: если выбрана публикация "сейчас", а дата уходит в будущее,
    // переключаемся обратно на системную публикацию, чтобы избежать путаницы.
    useEffect(() => {
        if (isFutureDate && publicationMethod === 'now') {
            setPublicationMethod('system');
        }
    }, [isFutureDate, publicationMethod]);

    useEffect(() => {
        // При переключении на "опубликовать сейчас" нужно выключить режим массового создания и цикличности
        if (publicationMethod === 'now') {
            setIsBulkMode(false);
            setIsCyclic(false);
        }
        // При переключении на "VK", цикличность недоступна
        if (publicationMethod === 'vk') {
             setIsCyclic(false);
        }
    }, [publicationMethod, isBulkMode, setIsBulkMode]);
    
    // Блокируем массовое создание, если включена цикличность
    useEffect(() => {
        if (isCyclic && isBulkMode) {
            setIsBulkMode(false);
        }
    }, [isCyclic, isBulkMode, setIsBulkMode]);

    return {
        formState: {
            publicationMethod,
            editedText,
            editedImages,
            editedAttachments,
            isBulkMode,
            dateSlots,
            isMultiProjectMode,
            selectedProjectIds,
            isDirty,
            isFutureDate,
            // Cyclic
            isCyclic,
            recurrenceInterval,
            recurrenceType,
            recurrenceEndType,
            recurrenceEndCount,
            recurrenceEndDate,
            recurrenceFixedDay,
            recurrenceIsLastDay,
            // AI Multi
            isAiMultiMode,
            selectedAiTurn,
        },
        formActions: {
            setPublicationMethod,
            setEditedText,
            setEditedImages,
            setEditedAttachments,
            setIsBulkMode,
            setIsMultiProjectMode,
            setSelectedProjectIds,
            handleAddDateSlot,
            handleRemoveDateSlot,
            handleDateSlotChange,
            // Cyclic
            setIsCyclic,
            setRecurrenceInterval,
            setRecurrenceType,
            setRecurrenceEndType,
            setRecurrenceEndCount,
            setRecurrenceEndDate,
            setRecurrenceFixedDay,
            setRecurrenceIsLastDay,
            // AI Multi
            setIsAiMultiMode,
            setSelectedAiTurn,
        }
    };
};