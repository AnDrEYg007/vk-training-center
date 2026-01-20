
import { useState, useEffect } from 'react';
import { Project, AllPosts, ScheduledPost, SuggestedPost, Note, SystemPost, GlobalVariableDefinition, ProjectGlobalVariableValue, ContestStatus, UnifiedStory } from '../../shared/types';
import * as api from '../../services/api';

const initialState = {
    projects: [],
    allPosts: {},
    allScheduledPosts: {},
    allSuggestedPosts: {},
    allSystemPosts: {},
    allStories: {},
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
        allStories: Record<string, UnifiedStory[]>;
        allNotes: Record<string, Note[]>;
        scheduledPostCounts: Record<string, number>;
        suggestedPostCounts: Record<string, number>;
        allGlobalVarDefs: GlobalVariableDefinition[];
        allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]>;
        reviewsContestStatuses: Record<string, ContestStatus>;
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

                console.log("Шаг 2: Загружаем контент проектов (batches)...");
                const projectIds = initialProjects.map(p => p.id);
                
                // Инициализируем хранилища
                let postsAccumulator: any = {};
                let scheduledAccumulator: any = {};
                let suggestedAccumulator: any = {};
                let systemAccumulator: any = {};
                let notesAccumulator: any = {};
                let storiesAccumulator: any = {};

                // РАЗБИВАЕМ НА ЧАНКИ (по 5 проектов), чтобы избежать 502 ошибки
                const CHUNK_SIZE = 5;
                for (let i = 0; i < projectIds.length; i += CHUNK_SIZE) {
                    const chunk = projectIds.slice(i, i + CHUNK_SIZE);
                    console.log(`Загрузка чанка ${i / CHUNK_SIZE + 1} (${chunk.length} проектов)...`);
                    
                    try {
                        const chunkData = await api.getAllPostsForProjects(chunk);
                        postsAccumulator = { ...postsAccumulator, ...chunkData.allPosts };
                        scheduledAccumulator = { ...scheduledAccumulator, ...chunkData.allScheduledPosts };
                        suggestedAccumulator = { ...suggestedAccumulator, ...chunkData.allSuggestedPosts };
                        systemAccumulator = { ...systemAccumulator, ...chunkData.allSystemPosts };
                        notesAccumulator = { ...notesAccumulator, ...chunkData.allNotes };
                        storiesAccumulator = { ...storiesAccumulator, ...chunkData.allStories };
                    } catch (e) {
                        console.error(`Ошибка загрузки чанка ${i}:`, e);
                        // Не прерываем, идем дальше, просто эти проекты будут пустыми
                    }
                }
                
                console.log("Шаг 3: Загружаем глобальные переменные...");
                const globalVarDefs = await api.getAllGlobalVariableDefinitions();
                const allGlobalVarValues: Record<string, ProjectGlobalVariableValue[]> = {};
                if (projectIds.length > 0) {
                    // Переменные тоже лучше грузить батчами, но они легковесные, оставим Promise.all
                    // но ограничим параллелизм если проектов супер много ? Нет, пока оставим так.
                    const globalVarValuesPromises = projectIds.map(id =>
                        api.getGlobalVariablesForProject(id).then(res => ({ projectId: id, values: res.values }))
                    );
                    const globalVarValuesResults = await Promise.all(globalVarValuesPromises);
                    globalVarValuesResults.forEach(result => {
                        allGlobalVarValues[result.projectId] = result.values;
                    });
                }

                // Считаем счетчики на основе загруженного
                const newScheduledCounts: Record<string, number> = {};
                projectIds.forEach(id => {
                    const scheduledCount = scheduledAccumulator[id]?.length || 0;
                    const systemCount = systemAccumulator[id]?.length || 0;
                    newScheduledCounts[id] = scheduledCount + systemCount;
                });

                setInitialData({
                    projects: initialProjects,
                    allPosts: postsAccumulator,
                    allScheduledPosts: scheduledAccumulator,
                    allSuggestedPosts: suggestedAccumulator,
                    allSystemPosts: systemAccumulator,
                    allStories: storiesAccumulator || {},
                    allNotes: notesAccumulator,
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
