
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Project, AllPosts, ScheduledPost, SuggestedPost, Note, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue, ContestStatus } from '../shared/types';
import { AppView } from '../App';
import { useDataInitialization } from './hooks/useDataInitialization';
import { useUpdatePolling } from './hooks/useUpdatePolling';
import { useDataRefreshers } from './hooks/useDataRefreshers';

interface IProjectsContext {
    projects: Project[];
    allPosts: AllPosts;
    allScheduledPosts: Record<string, ScheduledPost[]>;
    allSuggestedPosts: Record<string, SuggestedPost[]>;
    // FIX: Add `setAllSuggestedPosts` to the context interface to make it available to consumers.
    setAllSuggestedPosts: React.Dispatch<React.SetStateAction<Record<string, SuggestedPost[]>>>;
    allSystemPosts: Record<string, SystemPost[]>; // Новое состояние
    allNotes: Record<string, Note[]>;
    allGlobalVarDefs: GlobalVariableDefinition[];
    allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]>;
    scheduledPostCounts: Record<string, number>;
    suggestedPostCounts: Record<string, number>;
    // Обновленное состояние для статусов конкурсов
    reviewsContestStatuses: Record<string, ContestStatus>;
    setReviewsContestStatuses: React.Dispatch<React.SetStateAction<Record<string, ContestStatus>>>;
    
    projectPermissionErrors: Record<string, string | null>;
    setProjectPermissionErrors: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
    projectEmptyScheduleNotices: Record<string, string | null>;
    projectEmptySuggestedNotices: Record<string, string | null>;
    isInitialLoading: boolean;
    isCheckingForUpdates: string | null;
    setIsCheckingForUpdates: React.Dispatch<React.SetStateAction<string | null>>;
    updatedProjectIds: Set<string>;
    
    // Functions
    handleUpdateProjectSettings: (updatedProject: Project) => Promise<void>;
    handleForceRefreshProjects: () => Promise<void>;
    handleRefreshForSidebar: (projectId: string, activeView: AppView, silent?: boolean) => Promise<number>;
    handleBulkRefresh: (projectIds: string[]) => Promise<void>;
    handleSystemPostUpdate: (projectIds: string[]) => Promise<void>; // Новая функция
    handleNotesUpdate: (projectId?: string) => Promise<void>;
    syncDataForProject: (projectId: string, activeView: AppView) => Promise<void>;
    handleRefreshPublished: (projectId: string) => Promise<void>;
    handleRefreshScheduled: (projectId: string) => Promise<ScheduledPost[]>;
    handleRefreshSuggested: (projectId: string) => Promise<SuggestedPost[]>;
    handleRefreshAllSchedule: (projectId: string) => Promise<void>;
}

const ProjectsContext = createContext<IProjectsContext | undefined>(undefined);

export const useProjects = (): IProjectsContext => {
    const context = useContext(ProjectsContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectsProvider');
    }
    return context;
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 1. Хук для первоначальной загрузки данных
    const { isInitialLoading, initialData } = useDataInitialization();

    // 2. Инициализация состояний на основе данных из хука
    const [projects, setProjects] = useState<Project[]>(initialData.projects);
    const [allPosts, setAllPosts] = useState<AllPosts>(initialData.allPosts);
    const [allScheduledPosts, setAllScheduledPosts] = useState<Record<string, ScheduledPost[]>>(initialData.allScheduledPosts);
    const [allSuggestedPosts, setAllSuggestedPosts] = useState<Record<string, SuggestedPost[]>>(initialData.allSuggestedPosts);
    const [allSystemPosts, setAllSystemPosts] = useState<Record<string, SystemPost[]>>(initialData.allSystemPosts);
    const [allNotes, setAllNotes] = useState<Record<string, Note[]>>(initialData.allNotes);
    const [allGlobalVarDefs, setAllGlobalVarDefs] = useState<GlobalVariableDefinition[]>(initialData.allGlobalVarDefs);
    const [allGlobalVarValues, setAllGlobalVarValues] = useState<Record<string, ProjectGlobalVariableValue[]>>(initialData.allGlobalVarValues);
    const [scheduledPostCounts, setScheduledPostCounts] = useState<Record<string, number>>(initialData.scheduledPostCounts);
    const [suggestedPostCounts, setSuggestedPostCounts] = useState<Record<string, number>>(initialData.suggestedPostCounts);
    const [reviewsContestStatuses, setReviewsContestStatuses] = useState<Record<string, ContestStatus>>(initialData.reviewsContestStatuses);

    useEffect(() => {
        setProjects(initialData.projects);
        setAllPosts(initialData.allPosts);
        setAllScheduledPosts(initialData.allScheduledPosts);
        setAllSuggestedPosts(initialData.allSuggestedPosts);
        setAllSystemPosts(initialData.allSystemPosts);
        setAllNotes(initialData.allNotes);
        setAllGlobalVarDefs(initialData.allGlobalVarDefs);
        setAllGlobalVarValues(initialData.allGlobalVarValues);
        setScheduledPostCounts(initialData.scheduledPostCounts);
        setSuggestedPostCounts(initialData.suggestedPostCounts);
        setReviewsContestStatuses(initialData.reviewsContestStatuses);
    }, [initialData]);

    // 3. Хук для фонового опроса
    const { updatedProjectIds, setUpdatedProjectIds } = useUpdatePolling();
    
    // 4. Хук для всех функций обновления (передаем ему состояния и сеттеры)
    const {
        states,
        setters,
        refreshers,
    } = useDataRefreshers({
        initialProjects: initialData.projects, // Передаем исходные проекты для onForceRefresh
        projects, setProjects,
        allPosts, setAllPosts,
        allScheduledPosts, setAllScheduledPosts,
        allSuggestedPosts, setAllSuggestedPosts,
        allSystemPosts, setAllSystemPosts,
        allNotes, setAllNotes,
        allGlobalVarDefs, setAllGlobalVarDefs,
        allGlobalVarValues, setAllGlobalVarValues,
        scheduledPostCounts, setScheduledPostCounts,
        suggestedPostCounts, setSuggestedPostCounts,
        updatedProjectIds, setUpdatedProjectIds,
    });
    
    const value = {
        ...states,
        ...setters,
        ...refreshers,
        reviewsContestStatuses,
        setReviewsContestStatuses,
        isInitialLoading,
        // FIX: Provide `setAllSuggestedPosts` in the context value.
        setAllSuggestedPosts,
    };

    return <ProjectsContext.Provider value={value as IProjectsContext}>{children}</ProjectsContext.Provider>;
};
