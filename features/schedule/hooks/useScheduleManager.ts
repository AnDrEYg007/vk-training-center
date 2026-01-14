import { useScheduleData } from './useScheduleData';
import { useScheduleInteraction } from './useScheduleInteraction';
import { useScheduleModals } from './useScheduleModals';
import { Project, Note, ScheduledPost, SystemPost } from '../../../shared/types';
import { RefreshType } from '../../posts/components/modals/PostDetailsModal';

interface UseScheduleManagerProps {
    project: Project;
    initialPublishedPosts: ScheduledPost[];
    initialScheduledPosts: ScheduledPost[];
    initialSystemPosts: SystemPost[];
    initialNotes: Note[];
    onRefreshPublished: (projectId: string) => Promise<void>;
    onRefreshScheduled: (projectId: string) => Promise<ScheduledPost[]>;
    onSystemPostsUpdate: (projectIds: string[]) => Promise<void>;
    onNotesUpdate: () => Promise<void>;
    // FIX: Renamed `onBulkSaveComplete` to `onSaveComplete` and updated its signature to match `useScheduleData`.
    onSaveComplete: (projectIds: string[], refreshType: RefreshType) => Promise<void>;
}

/**
 * Композитный хук, который объединяет логику данных, взаимодействий и модальных окон
 * для компонента ScheduleTab.
 */
export const useScheduleManager = ({
    project,
    initialPublishedPosts,
    initialScheduledPosts,
    initialSystemPosts,
    initialNotes,
    onRefreshPublished,
    onRefreshScheduled,
    onSystemPostsUpdate,
    onNotesUpdate,
    onSaveComplete,
}: UseScheduleManagerProps) => {
    
    // 1. Управление данными
    const { 
        posts, 
        notes, 
        loadingStates: dataLoadingStates, 
        actions: dataActions 
    } = useScheduleData({
        project,
        initialPublishedPosts,
        initialScheduledPosts,
        initialSystemPosts,
        initialNotes,
        onRefreshPublished,
        onRefreshScheduled,
        onSystemPostsUpdate,
        onNotesUpdate,
        onSaveComplete,
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
        // FIX: Removed unused `onSavePost` prop that was causing a type error due to a signature mismatch.
        // The `useScheduleInteraction` hook handles post saving for drag-and-drop internally.
        setCopyingPost: modalActions.setCopyingPost,
    });

    // Объединяем состояния и действия для передачи в компонент
    const combinedState = {
        posts,
        notes,
        ...modalState,
        ...interactionState,
        loadingStates: {
            ...dataLoadingStates,
            ...interactionState.loadingStates,
        },
    };

    const combinedActions = {
        ...dataActions,
        ...modalActions,
        ...interactionActions,
    };

    return {
        state: combinedState,
        actions: combinedActions,
        dragActions,
        weekDates,
    };
};