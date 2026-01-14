import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, Tag, AiPromptPreset, GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../shared/types';
import * as api from '../../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { parseVariablesString, serializeVariablesArray, VariableItem } from '../utils/variableUtils';
import { AccordionSectionKey } from '../components/modals/ProjectSettingsModal';

interface UseProjectSettingsManagerProps {
    project: Project;
    uniqueTeams: string[];
    onSave: (updatedProject: Project) => Promise<void>;
    onClose: () => void;
    initialOpenSection?: AccordionSectionKey | null;
}

const VARIABLE_TEMPLATES = [
  { name: 'Номер телефона', value: '' },
  { name: 'Адрес', value: '' },
  { name: 'Режим работы', value: '' },
  { name: 'Сайт', value: '' },
  { name: 'DLVRY', value: '' },
  { name: 'Mobile ios', value: '' },
  { name: 'Mobile android', value: '' },
];

const TAG_COLORS = [
    '#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE',
    '#E0E7FF', '#F3E8FF', '#FCE7F3', '#E5E7EB',
];

export const useProjectSettingsManager = ({
    project,
    uniqueTeams,
    onSave,
    onClose,
    initialOpenSection = null,
}: UseProjectSettingsManagerProps) => {
    const [formData, setFormData] = useState<Project>({...project, disabled: project.disabled || false});
    const [projectVariables, setProjectVariables] = useState<VariableItem[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isAiRunning, setIsAiRunning] = useState(false);
    const [aiSuggestedVarIds, setAiSuggestedVarIds] = useState<Set<string>>(new Set());
    const [activeAccordion, setActiveAccordion] = useState<AccordionSectionKey | null>(initialOpenSection);
    const [isCreatingTeam, setIsCreatingTeam] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [isTokenVisible, setIsTokenVisible] = useState(false);
    
    // State for tags
    const [initialTags, setInitialTags] = useState<Tag[]>([]);
    const [projectTags, setProjectTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<Set<string>>(new Set());

    const [initialAiPresets, setInitialAiPresets] = useState<AiPromptPreset[]>([]);
    const [projectAiPresets, setProjectAiPresets] = useState<AiPromptPreset[]>([]);
    const [deletedAiPresetIds, setDeletedAiPresetIds] = useState<Set<string>>(new Set());

    // State for Global Variables
    const [initialGlobalVarDefs, setInitialGlobalVarDefs] = useState<GlobalVariableDefinition[]>([]);
    const [projectGlobalVarDefs, setProjectGlobalVarDefs] = useState<GlobalVariableDefinition[]>([]);
    const [deletedGlobalVarDefIds, setDeletedGlobalVarDefIds] = useState<Set<string>>(new Set());
    const [initialGlobalVarValues, setInitialGlobalVarValues] = useState<ProjectGlobalVariableValue[]>([]);
    const [projectGlobalVarValues, setProjectGlobalVarValues] = useState<ProjectGlobalVariableValue[]>([]);
    const [globalVarErrors, setGlobalVarErrors] = useState<Record<string, { name?: string; key?: string }>>({});


    // Валидация глобальных переменных при изменении
    useEffect(() => {
        const errors: Record<string, { name?: string; key?: string }> = {};
        const nameCounts: Record<string, number> = {};
        const keyCounts: Record<string, number> = {};

        projectGlobalVarDefs.forEach(def => {
            const name = def.name.trim().toLowerCase();
            const key = def.placeholder_key.trim().toLowerCase();
            if (name) nameCounts[name] = (nameCounts[name] || 0) + 1;
            if (key) keyCounts[key] = (keyCounts[key] || 0) + 1;
        });

        projectGlobalVarDefs.forEach(def => {
            const name = def.name.trim().toLowerCase();
            const key = def.placeholder_key.trim().toLowerCase();
            if (name && nameCounts[name] > 1) {
                if (!errors[def.id]) errors[def.id] = {};
                errors[def.id].name = "Это название уже используется.";
            }
            if (key && keyCounts[key] > 1) {
                if (!errors[def.id]) errors[def.id] = {};
                errors[def.id].key = "Этот ключ уже используется.";
            }
        });
        setGlobalVarErrors(errors);
    }, [projectGlobalVarDefs]);


    useEffect(() => {
        setFormData({...project, disabled: project.disabled || false});
        
        // Load Variables
        const existingVars = parseVariablesString(project.variables || '');
        const existingVarNames = new Set(existingVars.map(v => v.name.toLowerCase().trim()));
        
        const missingTemplates = VARIABLE_TEMPLATES.filter(template => !existingVarNames.has(template.name.toLowerCase().trim()));
        const newTemplateVars: VariableItem[] = missingTemplates.map(template => ({
            id: uuidv4(), name: template.name, value: template.value,
        }));
        
        setProjectVariables([...existingVars, ...newTemplateVars]);

        // Load Tags
        const loadTags = async () => {
            try {
                const fetchedTags = await api.getTags(project.id);
                setInitialTags(fetchedTags);
                setProjectTags(fetchedTags);
                setDeletedTagIds(new Set());
            } catch (error) {
                console.error("Failed to fetch tags for project settings", error);
                window.showAppToast?.("Не удалось загрузить теги для настроек проекта.", 'error');
            }
        };
        loadTags();

        const loadAiPresets = async () => {
            try {
                const fetchedPresets = await api.getAiPresets(project.id);
                setInitialAiPresets(fetchedPresets);
                setProjectAiPresets(fetchedPresets);
                setDeletedAiPresetIds(new Set());
            } catch (error) {
                console.error("Failed to fetch AI presets for project settings", error);
                window.showAppToast?.("Не удалось загрузить шаблоны AI-инструкций.", 'error');
            }
        };
        loadAiPresets();

        // Load Global Variables
        const loadGlobalVars = async () => {
            try {
                const { definitions, values } = await api.getGlobalVariablesForProject(project.id);
                setInitialGlobalVarDefs(definitions);
                setProjectGlobalVarDefs(definitions);
                setDeletedGlobalVarDefIds(new Set());
                setInitialGlobalVarValues(values);
                setProjectGlobalVarValues(values);
            } catch (error) {
                console.error("Failed to fetch global variables for project settings", error);
            }
        };
        loadGlobalVars();

    }, [project]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const freshProjectData = await api.getProjectDetails(project.id);
            const freshTags = await api.getTags(project.id);
            const freshAiPresets = await api.getAiPresets(project.id);
            const { definitions: freshDefs, values: freshValues } = await api.getGlobalVariablesForProject(project.id);


            setFormData(freshProjectData);
            setProjectVariables(parseVariablesString(freshProjectData.variables || ''));
            setInitialTags(freshTags);
            setProjectTags(freshTags);
            setDeletedTagIds(new Set());
            setInitialAiPresets(freshAiPresets);
            setProjectAiPresets(freshAiPresets);
            setDeletedAiPresetIds(new Set());
            setInitialGlobalVarDefs(freshDefs);
            setProjectGlobalVarDefs(freshDefs);
            setDeletedGlobalVarDefIds(new Set());
            setInitialGlobalVarValues(freshValues);
            setProjectGlobalVarValues(freshValues);

        } catch (error) {
            console.error("Failed to refresh project data", error);
            window.showAppToast?.("Не удалось обновить данные проекта.", 'error');
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
            if (Object.keys(globalVarErrors).length > 0) {
            window.showAppToast?.("Пожалуйста, исправьте ошибки в глобальных переменных перед сохранением.", 'warning');
            setActiveAccordion('global-variables');
            return;
        }

        setIsSaving(true);
        try {
            const allSavePromises: Promise<any>[] = [];

            // 1. Tags
            deletedTagIds.forEach(id => {
                allSavePromises.push(api.deleteTag(id));
            });
            projectTags.forEach(tag => {
                const originalTag = initialTags.find(t => t.id === tag.id);
                if (!tag.name.trim() || !tag.keyword.trim()) return;
                const tagData = { name: tag.name, keyword: tag.keyword, note: tag.note || undefined, color: tag.color };
                if (tag.id.startsWith('new-')) {
                    allSavePromises.push(api.createTag(project.id, tagData));
                } else if (originalTag) {
                    const hasChanged = originalTag.name !== tag.name || originalTag.keyword !== tag.keyword || (originalTag.note || '') !== (tag.note || '') || originalTag.color !== tag.color;
                    if (hasChanged) {
                        allSavePromises.push(api.updateTag(tag.id, tagData));
                    }
                }
            });

            // 2. AI Presets
            deletedAiPresetIds.forEach(id => {
                allSavePromises.push(api.deleteAiPreset(id));
            });
            projectAiPresets.forEach(preset => {
                const originalPreset = initialAiPresets.find(p => p.id === preset.id);
                if (!preset.name.trim() || !preset.prompt.trim()) return;
                const presetData = { name: preset.name, prompt: preset.prompt };
                if (preset.id.startsWith('new-')) {
                    allSavePromises.push(api.createAiPreset(project.id, presetData));
                } else if (originalPreset) {
                    const hasChanged = originalPreset.name !== preset.name || originalPreset.prompt !== preset.prompt;
                    if (hasChanged) {
                        allSavePromises.push(api.updateAiPreset(preset.id, presetData));
                    }
                }
            });

            // 3. Global Variable Definitions and Values
            const finalDefs = projectGlobalVarDefs.filter(def => !deletedGlobalVarDefIds.has(def.id));
            allSavePromises.push(api.updateAllGlobalVariableDefinitions(finalDefs));

            const globalVarsToUpdate = projectGlobalVarValues
                .filter(val => {
                    const initialVal = initialGlobalVarValues.find(v => v.definition_id === val.definition_id)?.value || '';
                    return initialVal !== val.value;
                })
                .map(val => ({ definition_id: val.definition_id, value: val.value }));

            if (globalVarsToUpdate.length > 0) {
                allSavePromises.push(api.updateGlobalVariablesForProject(project.id, globalVarsToUpdate));
            }

            // 4. Project data
            const serializedVars = serializeVariablesArray(projectVariables);
            allSavePromises.push(onSave({ ...formData, variables: serializedVars }));

            await Promise.all(allSavePromises);
            
            onClose();

        } catch (error) {
            console.error("Failed to save project settings or related data", error);
            window.showAppToast?.('Не удалось сохранить изменения. Проверьте консоль на наличие ошибок.', 'error');
            setIsSaving(false);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // --- Team Handlers ---
    const handleSaveNewTeam = () => {
        const trimmedName = newTeamName.trim();
        if (trimmedName && !uniqueTeams.includes(trimmedName)) {
            setFormData(prev => ({...prev, team: trimmedName}));
        }
        setIsCreatingTeam(false);
        setNewTeamName('');
    };
    const handleCancelCreateTeam = () => {
        setIsCreatingTeam(false);
        setNewTeamName('');
    };

    // --- Accordion Handler ---
    const handleAccordionToggle = (key: AccordionSectionKey) => {
        setActiveAccordion(prev => prev === key ? null : key);
    };

    // --- Grouped Actions ---
    const variableActions = useMemo(() => ({
        handleVariableChange: (id: string, field: 'name' | 'value', value: string) => {
            setProjectVariables(vars => vars.map(v => v.id === id ? { ...v, [field]: value } : v));
        },
        handleAddVariable: () => {
            setProjectVariables(vars => [...vars, { id: uuidv4(), name: '', value: '' }]);
        },
        handleRemoveVariable: (id: string) => {
            setProjectVariables(vars => vars.filter(v => v.id !== id));
        },
        handleAiSetup: async () => {
            setIsAiRunning(true);
            setAiSuggestedVarIds(new Set());
            try {
                const emptyVars = projectVariables.filter(v => v.value.trim() === '');
                const result = await api.runAiVariableSetup(project.id, emptyVars);
                const filledMap = new Map(result.filled.map(v => [v.name.toLowerCase(), v.value]));
                const suggestedIds = new Set<string>();
                const updatedVars = projectVariables.map(v => {
                    const lowerCaseName = v.name.toLowerCase();
                    if (filledMap.has(lowerCaseName)) {
                        suggestedIds.add(v.id);
                        return { ...v, value: filledMap.get(lowerCaseName)! };
                    }
                    return v;
                });
                const existingVarNames = new Set(updatedVars.map(v => v.name.toLowerCase().trim()));
                const newVars = result.new.filter(v => !existingVarNames.has(v.name.toLowerCase().trim())).map(v => ({ id: uuidv4(), name: v.name, value: v.value }));
                newVars.forEach(v => suggestedIds.add(v.id));
                setProjectVariables([...updatedVars, ...newVars]);
                setAiSuggestedVarIds(suggestedIds);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Произошла неизвестная ошибка.";
                window.showAppToast?.(`Ошибка умной настройки: ${errorMessage}`, 'error');
                console.error("AI Variable Setup failed:", error);
            } finally {
                setIsAiRunning(false);
            }
        },
    }), [project.id, projectVariables]);

    const globalVariableActions = useMemo(() => ({
        handleDefinitionChange: (defId: string, field: keyof GlobalVariableDefinition, value: string) => {
            setProjectGlobalVarDefs(currentDefs => currentDefs.map(d => d.id === defId ? { ...d, [field]: value } : d));
        },
        handleAddDefinition: () => {
            const newDef: GlobalVariableDefinition = { id: `new-${uuidv4()}`, name: '', placeholder_key: '', note: '' };
            setProjectGlobalVarDefs(currentDefs => [...currentDefs, newDef]);
        },
        handleRemoveDefinition: (defToRemove: GlobalVariableDefinition) => {
            if (!defToRemove.id.startsWith('new-')) {
                setDeletedGlobalVarDefIds(ids => new Set(ids).add(defToRemove.id));
            }
            setProjectGlobalVarDefs(defs => defs.filter(d => d.id !== defToRemove.id));
        },
        handleValueChange: (definitionId: string, value: string) => {
            setProjectGlobalVarValues(currentValues => {
                const existingValueIndex = currentValues.findIndex(v => v.definition_id === definitionId);
                if (existingValueIndex > -1) {
                    const newValues = [...currentValues];
                    newValues[existingValueIndex] = { ...newValues[existingValueIndex], value };
                    return newValues;
                } else {
                    const newValue: ProjectGlobalVariableValue = {
                        id: `new-${uuidv4()}`,
                        project_id: project.id,
                        definition_id: definitionId,
                        value: value,
                    };
                    return [...currentValues, newValue];
                }
            });
        },
    }), [project.id]);

    const tagActions = useMemo(() => ({
        handleTagChange: (id: string, field: keyof Omit<Tag, 'id' | 'project_id'>, value: string) => {
            setProjectTags(tags => tags.map(t => (t.id === id ? { ...t, [field]: value } : t)));
        },
        handleAddTag: () => {
            const newTag: Tag = {
                id: `new-${Date.now()}`,
                project_id: project.id,
                name: '',
                keyword: '',
                note: '',
                color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
            };
            setProjectTags(tags => [...tags, newTag]);
        },
        handleRemoveTag: (tag: Tag) => {
            if (!tag.id.startsWith('new-')) {
                setDeletedTagIds(ids => new Set(ids).add(tag.id));
            }
            setProjectTags(tags => tags.filter(t => t.id !== tag.id));
        },
    }), [project.id]);

    const aiPresetActions = useMemo(() => ({
        handlePresetChange: (id: string, field: 'name' | 'prompt', value: string) => {
            setProjectAiPresets(presets => presets.map(p => (p.id === id ? { ...p, [field]: value } : p)));
        },
        handleAddPreset: () => {
            const newPreset: AiPromptPreset = {
                id: `new-${Date.now()}`,
                project_id: project.id,
                name: '',
                prompt: '',
            };
            setProjectAiPresets(presets => [...presets, newPreset]);
        },
        handleRemovePreset: (preset: AiPromptPreset) => {
            if (!preset.id.startsWith('new-')) {
                setDeletedAiPresetIds(ids => new Set(ids).add(preset.id));
            }
            setProjectAiPresets(presets => presets.filter(p => p.id !== preset.id));
        },
    }), [project.id]);

    return {
        state: {
            formData, projectVariables, projectGlobalVarDefs, projectGlobalVarValues, projectTags, projectAiPresets,
            isRefreshing, isSaving, isAiRunning,
            aiSuggestedVarIds, activeAccordion,
            isCreatingTeam, newTeamName, isTokenVisible,
            globalVarErrors, // Возвращаем ошибки
        },
        actions: {
            handleSubmit, handleRefresh, handleAccordionToggle,
            handleFormChange, handleSetFormData: setFormData,
            setIsCreatingTeam, setNewTeamName, handleSaveNewTeam, handleCancelCreateTeam,
            setIsTokenVisible,
            variableActions,
            globalVariableActions,
            tagActions,
            aiPresetActions
        }
    };
};