import { useState, useEffect, useMemo } from 'react';
import { ScheduledPost } from '../../../shared/types';
import { v4 as uuidv4 } from 'uuid';

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

const getInitialDateTimeForCopyMode = (post: ScheduledPost) => {
    const postDate = new Date(post.date);
    const now = new Date();
    if (!isNaN(postDate.getTime()) && postDate > now) {
        return getLocalDateParts(postDate);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return getLocalDateParts(tomorrow);
};

/**
 * Хук, инкапсулирующий логику управления режимами массового и 
 * мультипроектного создания постов.
 */
export const useBulkCreationManager = (
    post: ScheduledPost,
    initialMode: 'view' | 'edit' | 'copy',
    projectId: string
) => {
    const isCopyMode = initialMode === 'copy';

    const { dateString: initialDate, timeString: initialTime } = isCopyMode
        ? getInitialDateTimeForCopyMode(post)
        : getLocalDateParts(new Date(post.date));

    // State for bulk & multi-project creation
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [dateSlots, setDateSlots] = useState([{ id: uuidv4(), date: initialDate, time: initialTime }]);
    const [isMultiProjectMode, setIsMultiProjectMode] = useState(false);
    const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set([projectId]));

    const isFutureDate = useMemo(() => {
        if (!dateSlots[0]?.date) return false;
        const postDate = new Date(dateSlots[0].date);
        postDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return postDate > today;
    }, [dateSlots]);

    useEffect(() => {
        if (!isMultiProjectMode) {
            setSelectedProjectIds(new Set([projectId]));
        }
    }, [isMultiProjectMode, projectId]);

    const handleAddDateSlot = () => {
        setDateSlots(prev => {
            if (prev.length >= 10) return prev;
            const lastSlot = prev[prev.length - 1];
            const nextDate = new Date(lastSlot.date);
            nextDate.setDate(nextDate.getDate() + 1);
            const { dateString } = getLocalDateParts(nextDate);
            return [...prev, { id: uuidv4(), date: dateString, time: lastSlot.time }];
        });
    };

    const handleRemoveDateSlot = (id: string) => {
        setDateSlots(prev => prev.filter(slot => slot.id !== id));
    };

    const handleDateSlotChange = (id: string, field: 'date' | 'time', value: string) => {
        setDateSlots(prev => prev.map(slot => slot.id === id ? { ...slot, [field]: value } : slot));
    };

    return {
        bulkState: {
            dateSlots,
            isBulkMode,
            isMultiProjectMode,
            selectedProjectIds,
        },
        bulkActions: {
            setIsBulkMode,
            setIsMultiProjectMode,
            setSelectedProjectIds,
            handleAddDateSlot,
            handleRemoveDateSlot,
            handleDateSlotChange,
        },
        isFutureDate,
    };
};
