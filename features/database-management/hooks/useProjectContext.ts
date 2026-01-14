
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Project, ProjectContextField, ProjectContextValue } from '../../../shared/types';
import * as api from '../../../services/api';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { MassAiMode } from '../components/modals/MassAiAutofillModal';

export type ColumnTypeFilter = 'all' | 'global' | 'specific';

export const useProjectContext = () => {
    const [fields, setFields] = useState<ProjectContextField[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [values, setValues] = useState<ProjectContextValue[]>([]);
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [autofillLoadingId, setAutofillLoadingId] = useState<string | null>(null); 
    
    const [editedValues, setEditedValues] = useState<Record<string, string>>({}); // key: projectId_fieldId
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingField, setEditingField] = useState<ProjectContextField | null>(null);
    
    // AI Modals State
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<ProjectContextValue[]>([]);
    const [aiTargetProjectId, setAiTargetProjectId] = useState<string | null>(null);

    // Mass AI State
    const [massAiModalOpen, setMassAiModalOpen] = useState(false);
    const [isMassAiProcessing, setIsMassAiProcessing] = useState(false);
    const [massAiProgress, setMassAiProgress] = useState<string | null>(null);
    const [massAiActiveProjectId, setMassAiActiveProjectId] = useState<string | null>(null);

    // Delete Modal State
    const [deleteModalState, setDeleteModalState] = useState<{
        isOpen: boolean;
        field: ProjectContextField;
        affectedValues: ProjectContextValue[];
    } | null>(null);

    // --- NEW: Clear Modals State ---
    const [clearRowModalState, setClearRowModalState] = useState<{
        isOpen: boolean;
        projectId: string;
    } | null>(null);

    const [clearColumnModalState, setClearColumnModalState] = useState<{
        isOpen: boolean;
        fieldId: string;
    } | null>(null);

    const [clearAllModalOpen, setClearAllModalOpen] = useState(false);


    // --- Column Management State ---
    const [columnWidths, setColumnWidths] = useLocalStorage<Record<string, number>>('project-context-widths', {});
    const [hiddenFields, setHiddenFields] = useLocalStorage<Record<string, boolean>>('project-context-hidden-fields', {});
    const [columnTypeFilter, setColumnTypeFilter] = useState<ColumnTypeFilter>('all');
    
    // --- Project Filtering State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<string>('All');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [allProjects, contextData] = await Promise.all([
                api.getAllProjectsForManagement(),
                api.getAllContextData()
            ]);
            
            setProjects(allProjects.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
            setFields(contextData.fields);
            setValues(contextData.values);
            setEditedValues({});
        } catch (e) {
            window.showAppToast?.("Ошибка загрузки данных контекста", 'error');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Filtering Logic ---
    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        projects.forEach(p => {
            if (p.team) teams.add(p.team);
        });
        return Array.from(teams).sort();
    }, [projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            // Search filter
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            // Team filter
            if (teamFilter !== 'All') {
                if (teamFilter === 'NoTeam') {
                    if (p.team) return false;
                } else {
                    if (p.team !== teamFilter) return false;
                }
            }
            return true;
        });
    }, [projects, searchQuery, teamFilter]);

    const visibleFields = useMemo(() => {
        return fields.filter(f => {
            if (hiddenFields[f.id]) return false;
            if (columnTypeFilter === 'global' && !f.is_global) return false;
            if (columnTypeFilter === 'specific' && f.is_global) return false;
            return true;
        });
    }, [fields, hiddenFields, columnTypeFilter]);

    // --- Actions ---
    const toggleFieldVisibility = (fieldId: string) => {
        setHiddenFields(prev => ({
            ...prev,
            [fieldId]: !prev[fieldId]
        }));
    };

    const handleValueChange = (projectId: string, fieldId: string, newValue: string) => {
        const key = `${projectId}_${fieldId}`;
        // Важно: проверяем именно наличие ключа в объекте, так как пустая строка "" - это валидное (стертое) значение,
        // которое должно перекрывать значение из базы.
        setEditedValues(prev => ({ ...prev, [key]: newValue }));
    };

    const getValue = (projectId: string, fieldId: string) => {
        const key = `${projectId}_${fieldId}`;
        if (Object.prototype.hasOwnProperty.call(editedValues, key)) {
            return editedValues[key];
        }
        
        const val = values.find(v => v.project_id === projectId && v.field_id === fieldId);
        return (val && val.value) ? val.value : '';
    };
    
    // --- CLEARING DATA LOGIC ---
    
    // 1. Column (Field) Clear
    const handleClearColumn = useCallback((fieldId: string) => {
        setClearColumnModalState({ isOpen: true, fieldId });
    }, []);

    const handleConfirmClearColumn = useCallback((projectIds: string[]) => {
        if (!clearColumnModalState) return;
        const fieldId = clearColumnModalState.fieldId;
        
        setEditedValues(prev => {
            const next = { ...prev };
            projectIds.forEach(pid => {
                next[`${pid}_${fieldId}`] = "";
            });
            return next;
        });
    }, [clearColumnModalState]);

    // 2. Row (Project) Clear
    const handleClearRow = useCallback((projectId: string) => {
        setClearRowModalState({ isOpen: true, projectId });
    }, []);

    const handleConfirmClearRow = useCallback((fieldIds: string[]) => {
        if (!clearRowModalState) return;
        const projectId = clearRowModalState.projectId;
        
        setEditedValues(prev => {
            const next = { ...prev };
            fieldIds.forEach(fid => {
                 next[`${projectId}_${fid}`] = "";
            });
            return next;
        });
    }, [clearRowModalState]);

    // 3. Clear All Table
    const handleClearAll = useCallback(() => {
        setClearAllModalOpen(true);
    }, []);

    const handleConfirmClearAll = useCallback(() => {
         setEditedValues(prev => {
            const next = { ...prev };
            filteredProjects.forEach(p => {
                visibleFields.forEach(f => {
                    next[`${p.id}_${f.id}`] = "";
                });
            });
            return next;
        });
        setClearAllModalOpen(false);
    }, [filteredProjects, visibleFields]);

    // --- Save/Delete/Update Fields ---
    const handleSaveField = async (name: string, description: string, isGlobal: boolean, projectIds: string[] | null) => {
        try {
            if (editingField) {
                const updatedField = await api.updateContextField(editingField.id, { name, description, is_global: isGlobal, project_ids: projectIds });
                setFields(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
            } else {
                const newField = await api.createContextField(name, description, isGlobal, projectIds);
                setFields(prev => [...prev, newField]);
            }
            setIsModalOpen(false);
            setEditingField(null);
        } catch (e) {
            window.showAppToast?.("Ошибка сохранения поля", 'error');
            console.error(e);
        }
    };

    const handleInitiateDeleteField = (fieldId: string) => {
        const field = fields.find(f => f.id === fieldId);
        if (!field) return;
        const affectedValues = values.filter(v => v.field_id === fieldId);
        setDeleteModalState({ isOpen: true, field, affectedValues });
    };

    const handleConfirmDeleteField = async () => {
        if (!deleteModalState) return;
        setIsSaving(true);
        try {
            await api.deleteContextField(deleteModalState.field.id);
            setFields(prev => prev.filter(f => f.id !== deleteModalState.field.id));
            setColumnWidths(prev => { const n = {...prev}; delete n[deleteModalState.field.id]; return n; });
            setHiddenFields(prev => { const n = {...prev}; delete n[deleteModalState.field.id]; return n; });
            setValues(prev => prev.filter(v => v.field_id !== deleteModalState.field.id));
            setDeleteModalState(null);
        } catch (e) {
            window.showAppToast?.("Ошибка удаления", 'error');
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = Object.entries(editedValues).map(([key, value]) => {
                const [projectId, fieldId] = key.split('_');
                return { project_id: projectId, field_id: fieldId, value: value as string };
            });
            
            if (payload.length > 0) {
                await api.updateContextValues(payload);
                await fetchData();
                window.showAppToast?.("Сохранено!", 'success');
            } else {
                window.showAppToast?.("Нет изменений для сохранения", 'info');
            }
        } catch (e) {
            window.showAppToast?.("Ошибка сохранения", 'error');
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    // --- AI Single Actions ---
    const handleAiAutofill = async (projectId: string) => {
        setAutofillLoadingId(projectId);
        try {
            const suggestions = await api.runAiAutofill(projectId);
            setAiSuggestions(suggestions);
            setAiTargetProjectId(projectId);
            setAiModalOpen(true);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Ошибка при AI-заполнении';
            window.showAppToast?.(msg, 'error');
            console.error(e);
        } finally {
            setAutofillLoadingId(null);
        }
    };
    
    const handleSingleFieldAiGen = async (projectId: string, fieldId: string, apiCall: (pid: string) => Promise<string>) => {
        setAutofillLoadingId(`${projectId}_${fieldId}`);
        try {
            const result = await apiCall(projectId);
            const suggestion = { id: `temp-${Date.now()}`, project_id: projectId, field_id: fieldId, value: result };
            setAiSuggestions([suggestion]);
            setAiTargetProjectId(projectId);
            setAiModalOpen(true);
           } catch (e) {
               const msg = e instanceof Error ? e.message : 'Ошибка генерации';
               window.showAppToast?.(msg, 'error');
               console.error(e);
        } finally {
             setAutofillLoadingId(null);
        }
    };

    const handleAiCompanyDesc = (projectId: string, fieldId: string) => handleSingleFieldAiGen(projectId, fieldId, api.generateCompanyDesc);
    const handleAiProductsDesc = (projectId: string, fieldId: string) => handleSingleFieldAiGen(projectId, fieldId, api.generateProductsDesc);
    const handleAiTone = (projectId: string, fieldId: string) => handleSingleFieldAiGen(projectId, fieldId, api.generateTone);

    const handleApplyAiSuggestions = (suggestionsToApply: ProjectContextValue[]) => {
        setEditedValues(prev => {
            const newEdited = { ...prev };
            suggestionsToApply.forEach(s => {
                 const key = `${s.project_id}_${s.field_id}`;
                 if (s.value) newEdited[key] = s.value;
            });
            return newEdited;
        });
    };

    // --- MASS AI ACTIONS ---
    const findFieldId = (name: string): string | undefined => {
        return fields.find(f => f.name.toLowerCase() === name.toLowerCase())?.id;
    };

    const handleMassAiStart = async (projectIds: string[], mode: MassAiMode) => {
        setMassAiModalOpen(false);
        setIsMassAiProcessing(true);
        setMassAiProgress("Инициализация...");

        const companyDescId = findFieldId("Описание компании");
        const productsDescId = findFieldId("Описание товаров и услуг");
        const toneId = findFieldId("Тональность бренда");

        // Helper to check if field needs update (is empty)
        const isFieldEmpty = (projectId: string, fieldId: string | undefined): boolean => {
            if (!fieldId) return false;
            const key = `${projectId}_${fieldId}`;
            // Check edited values first
            const hasEdits = editedValues[key];
            if (hasEdits !== undefined && hasEdits !== "") return false;
            // Check stored values
            const hasStored = values.find(v => v.project_id === projectId && v.field_id === fieldId)?.value;
            if (hasStored) return false;
            return true;
        };

        const totalProjects = projectIds.length;
        
        // Вспомогательная функция для обновления прогресса
        const updateProgress = (stepName: string, index: number, projectName: string) => {
             setMassAiProgress(`[${stepName}] (${index + 1}/${totalProjects}): ${projectName}`);
        };

        // --- ЭТАП 1: БАЗОВОЕ АВТОЗАПОЛНЕНИЕ (addresses, phones, etc.) ---
        if (mode === 'all' || mode === 'base') {
            for (let i = 0; i < projectIds.length; i++) {
                const projectId = projectIds[i];
                const project = projects.find(p => p.id === projectId);
                if (!project) continue;

                updateProgress("Базовое заполнение", i, project.name);
                setMassAiActiveProjectId(projectId);

                try {
                    const suggestions = await api.runAiAutofill(projectId);
                    setEditedValues(prev => {
                        const next = { ...prev };
                        suggestions.forEach(s => {
                             if (s.value && s.field_id) {
                                 next[`${projectId}_${s.field_id}`] = s.value;
                             }
                        });
                        return next;
                    });
                } catch (e) {
                    console.error(`Error in Basic Autofill for ${project.name}:`, e);
                }
                await new Promise(resolve => setTimeout(resolve, 50));
            }
        }

        // --- ЭТАП 2: ТОНАЛЬНОСТЬ БРЕНДА ---
        if ((mode === 'all' || mode === 'tone') && toneId) {
            for (let i = 0; i < projectIds.length; i++) {
                const projectId = projectIds[i];
                const project = projects.find(p => p.id === projectId);
                if (!project) continue;

                if (isFieldEmpty(projectId, toneId)) {
                    updateProgress("Тональность", i, project.name);
                    setMassAiActiveProjectId(projectId);
                    try {
                        const val = await api.generateTone(projectId);
                        setEditedValues(prev => ({ ...prev, [`${projectId}_${toneId}`]: val }));
                    } catch (e) {
                        console.error(`Error in Tone generation for ${project.name}:`, e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        // --- ЭТАП 3: ОПИСАНИЕ ТОВАРОВ И УСЛУГ ---
        if ((mode === 'all' || mode === 'products') && productsDescId) {
            for (let i = 0; i < projectIds.length; i++) {
                const projectId = projectIds[i];
                const project = projects.find(p => p.id === projectId);
                if (!project) continue;

                if (isFieldEmpty(projectId, productsDescId)) {
                    updateProgress("Товары", i, project.name);
                    setMassAiActiveProjectId(projectId);
                    try {
                        const val = await api.generateProductsDesc(projectId);
                        setEditedValues(prev => ({ ...prev, [`${projectId}_${productsDescId}`]: val }));
                    } catch (e) {
                        console.error(`Error in Products generation for ${project.name}:`, e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }

        // --- ЭТАП 4: ОПИСАНИЕ КОМПАНИИ ---
        if ((mode === 'all' || mode === 'company') && companyDescId) {
            for (let i = 0; i < projectIds.length; i++) {
                const projectId = projectIds[i];
                const project = projects.find(p => p.id === projectId);
                if (!project) continue;

                if (isFieldEmpty(projectId, companyDescId)) {
                    updateProgress("Описание компании", i, project.name);
                    setMassAiActiveProjectId(projectId);
                    try {
                        const val = await api.generateCompanyDesc(projectId);
                        setEditedValues(prev => ({ ...prev, [`${projectId}_${companyDescId}`]: val }));
                    } catch (e) {
                        console.error(`Error in Company Desc generation for ${project.name}:`, e);
                    }
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }
        
        setIsMassAiProcessing(false);
        setMassAiProgress(null);
        setMassAiActiveProjectId(null);
    };


    return {
        state: {
            fields,
            projects,
            filteredProjects,
            uniqueTeams,
            values,
            editedValues,
            visibleFields,
            columnWidths,
            hiddenFields,
            columnTypeFilter,
            searchQuery,
            teamFilter,
            isLoading,
            isSaving,
            autofillLoadingId,
            // Modal states
            isModalOpen,
            editingField,
            aiModalOpen,
            aiSuggestions,
            aiTargetProjectId,
            deleteModalState,
            // Mass AI
            massAiModalOpen,
            isMassAiProcessing,
            massAiProgress,
            massAiActiveProjectId,
            // Clear Modals
            clearRowModalState,
            clearColumnModalState,
            clearAllModalOpen,
        },
        actions: {
            setSearchQuery,
            setTeamFilter,
            setColumnTypeFilter,
            setColumnWidths,
            toggleFieldVisibility,
            handleValueChange,
            getValue,
            // Fields
            setEditingField,
            setIsModalOpen,
            handleSaveField,
            handleInitiateDeleteField,
            handleConfirmDeleteField,
            setDeleteModalState,
            handleSave,
            // AI
            handleAiAutofill,
            handleAiCompanyDesc,
            handleAiProductsDesc,
            handleAiTone,
            setAiModalOpen,
            handleApplyAiSuggestions,
            // Mass AI
            setMassAiModalOpen,
            handleMassAiStart,
            // Clear Actions
            handleClearColumn,
            handleClearRow,
            handleClearAll,
            // Clear Modal Actions
            setClearRowModalState,
            setClearColumnModalState,
            handleConfirmClearRow,
            handleConfirmClearColumn,
            setClearAllModalOpen,
            handleConfirmClearAll,
        }
    };
};
