
import { useState, useEffect } from 'react';
import { Project, AllPosts, ScheduledPost, SuggestedPost, Note, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../shared/types';
import * as api from '../../services/api';

const initialState = {
    projects: [],
    allPosts: {},
    allScheduledPosts: {},
    allSuggestedPosts: {},
    allSystemPosts: {},
    allNotes: {},
    scheduledPostCounts: {},
    suggestedPostCounts: {},
    allGlobalVarDefs: [],
    allGlobalVarValues: {},
    reviewsContestStatuses: {},
};

/**
 * Хук для инкапсуляции логики первоначальной ("жадной") загрузки всех данных
 * при старте приложения.
 */
export const useDataInitialization = () => {
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [initialData, setInitialData] = useState<{
        projects: Project[];
        allPosts: AllPosts;
        allScheduledPosts: Record<string, ScheduledPost[]>;
        allSuggestedPosts: Record<string, SuggestedPost[]>;
        allSystemPosts: Record<string, SystemPost[]>;
        allNotes: Record<string, Note[]>;
        scheduledPostCounts: Record<string, number>;
        suggestedPostCounts: Record<string, number>;
        allGlobalVarDefs: GlobalVariableDefinition[];
        allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]>;
        reviewsContestStatuses: Record<string, boolean>;
    }>(initialState);

    useEffect(() => {
        const loadData = async () => {
            setIsInitialLoading(true);
            try {
                console.log("Шаг 1: Загружаем проекты...");
                const { 
                    projects: initialProjects, 
                    suggestedPostCounts: initialSuggestedCounts,
                    reviewsContestStatuses: initialContestStatuses
                } = await api.getInitialData();

                if (initialProjects.length === 0) {
                    setInitialData({ ...initialState, projects: [], suggestedPostCounts: initialSuggestedCounts || {} });
                    return;
                }

                console.log("Шаг 2: Загружаем посты и заметки для найденных проектов...");
                const projectIds = initialProjects.map(p => p.id);
                const { 
                    allPosts: postsFromDb, 
                    allScheduledPosts: scheduledFromDb, 
                    allSuggestedPosts: suggestedFromDb,
                    // FIX: Correctly destructure `allSystemPosts` from the API response.
                    allSystemPosts: systemFromDb,
                    allNotes: notesFromDb,
                } = await api.getAllPostsForProjects(projectIds);
                
                console.log("Шаг 3: Загружаем глобальные переменные...");
                const globalVarDefs = await api.getAllGlobalVariableDefinitions();
                const allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]> = {};
                if (projectIds.length > 0) {
                    const globalVarValuesPromises = projectIds.map(id =>
                        api.getGlobalVariablesForProject(id).then(res => ({ projectId: id, values: res.values }))
                    );
                    const globalVarValuesResults = await Promise.all(globalVarValuesPromises);
                    globalVarValuesResults.forEach(result => {
                        allGlobalVarValues[result.projectId] = result.values;
                    });
                }

                const newScheduledCounts: Record<string, number> = {};
                projectIds.forEach(id => {
                    const scheduledCount = scheduledFromDb[id]?.length || 0;
                    const systemCount = systemFromDb[id]?.length || 0;
                    newScheduledCounts[id] = scheduledCount + systemCount;
                });

                setInitialData({
                    projects: initialProjects,
                    allPosts: postsFromDb,
                    allScheduledPosts: scheduledFromDb,
                    allSuggestedPosts: suggestedFromDb,
                    allSystemPosts: systemFromDb,
                    allNotes: notesFromDb,
                    scheduledPostCounts: newScheduledCounts,
                    suggestedPostCounts: initialSuggestedCounts || {},
                    allGlobalVarDefs: globalVarDefs,
                    allGlobalVarValues: allGlobalVarValues,
                    reviewsContestStatuses: initialContestStatuses || {},
                });

                console.log("Загрузка всех данных из базы завершена.");

            } catch (error) {
                console.error("Критическая ошибка при загрузке данных:", error);
                window.showAppToast?.("Не удалось загрузить данные. Убедитесь, что бэкенд запущен, и обновите страницу.", 'error');
                setInitialData(initialState);
            } finally {
                setIsInitialLoading(false);
            }
        };

        loadData();
    }, []);

    return { isInitialLoading, initialData };
};
