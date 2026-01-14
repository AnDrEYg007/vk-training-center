import { useState, useEffect } from 'react';
import { ScheduledPost, PhotoAttachment, Attachment } from '../../../shared/types';

interface UseDirtyCheckProps {
    originalPost: ScheduledPost;
    initialMode: 'view' | 'edit' | 'copy';
    currentProjectId: string;
    editedText: string;
    editedImages: PhotoAttachment[];
    editedAttachments: Attachment[];
    isBulkMode: boolean;
    isMultiProjectMode: boolean;
    dateSlots: { id: string, date: string, time: string }[];
    selectedProjectIds: Set<string>;
}

const getLocalDateParts = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    return { dateString, timeString };
};

/**
 * Хук, инкапсулирующий сложную логику определения, были ли внесены
 * изменения в форму поста ("грязное" состояние).
 */
export const useDirtyCheck = ({
    originalPost,
    initialMode,
    currentProjectId,
    editedText,
    editedImages,
    editedAttachments,
    isBulkMode,
    isMultiProjectMode,
    dateSlots,
    selectedProjectIds,
}: UseDirtyCheckProps) => {
    const [isDirty, setIsDirty] = useState(initialMode === 'copy');

    useEffect(() => {
        // Копия всегда считается измененной.
        if (initialMode === 'copy') {
            setIsDirty(true);
            return;
        }

        const { dateString: initialDate, timeString: initialTime } = getLocalDateParts(new Date(originalPost.date));

        // Сравниваем текущее состояние с оригинальным `post`.
        const textIsDirty = editedText !== originalPost.text;
        
        const imagesAreDirty = 
            JSON.stringify(editedImages.map(i => i.id).sort()) !== 
            JSON.stringify(originalPost.images.map(i => i.id).sort());

        const attachmentsAreDirty = 
            JSON.stringify(editedAttachments.map(a => a.id).sort()) !== 
            JSON.stringify((originalPost.attachments || []).map(a => a.id).sort());
        
        let dateIsDirty = false;
        if (isBulkMode) {
            // В режиме массового создания "грязно", если слотов больше одного ИЛИ значение единственного слота изменилось.
            if (dateSlots.length > 1 || dateSlots[0].date !== initialDate || dateSlots[0].time !== initialTime) {
                dateIsDirty = true;
            }
        } else {
            // В обычном режиме "грязно", если дата или время изменились.
            if (dateSlots.length > 0 && (dateSlots[0].date !== initialDate || dateSlots[0].time !== initialTime)) {
                dateIsDirty = true;
            }
        }

        let projectsAreDirty = false;
        if (isMultiProjectMode) {
            // В мультипроектном режиме "грязно", если выбрано больше одного проекта.
            if (selectedProjectIds.size > 1) {
                projectsAreDirty = true;
            }
        } else {
            // В обычном режиме "грязно", если выбор отличается от исходного проекта.
            if (selectedProjectIds.size !== 1 || !selectedProjectIds.has(currentProjectId)) {
                 projectsAreDirty = true;
            }
        }

        // Форма "грязна", если любая ее часть была изменена.
        setIsDirty(textIsDirty || imagesAreDirty || attachmentsAreDirty || dateIsDirty || projectsAreDirty);
        
    }, [
        editedText, editedImages, editedAttachments, dateSlots, selectedProjectIds, 
        isBulkMode, isMultiProjectMode, initialMode, originalPost, currentProjectId
    ]);

    return isDirty;
};
