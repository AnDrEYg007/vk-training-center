
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Project, AuthUser } from '../../../shared/types';
import * as api from '../../../services/api';
import { ProjectTable, ColumnDefinition } from './ProjectTable';
import { AddProjectsModal } from './modals/AddProjectsModal';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { ArchivePage } from './ArchivePage';
import { GlobalVariablesManagement } from './GlobalVariablesManagement';
import { ProjectContextManagement } from './ProjectContextManagement'; // Новый компонент
import { AdministeredGroupsPage } from './AdministeredGroupsPage'; // NEW
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { ProjectSettingsModal, AccordionSectionKey } from '../../projects/components/modals/ProjectSettingsModal';

const COLUMNS: ColumnDefinition[] = [
    { key: 'sort_order', label: '№' },
    { key: 'name', label: 'Название проекта' },
    { key: 'team', label: 'Команда' },
    { key: 'disabled', label: 'Статус' },
    { key: 'archived', label: 'В архив' },
    { key: 'communityToken', label: 'Токен сообщества' },
    { key: 'additional_community_tokens', label: 'Доп. токены' },
    { key: 'notes', label: 'Заметки' },
    { key: 'vk_confirmation_code', label: 'Код Callback API' },
    { key: 'vkGroupName', label: 'Название VK' },
    { key: 'vkLink', label: 'Ссылка VK' },
];

export const DatabaseManagementPage: React.FC<{
    onProjectsUpdate: () => void;
    user: AuthUser | null;
}> = ({ onProjectsUpdate, user }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'main' | 'archive' | 'global-variables' | 'project-context' | 'administered'>('main');

    const [editedProjects, setEditedProjects] = useState<Record<string, Project>>({});
    const isDirty = Object.keys(editedProjects).length > 0;
    
    const [visibleColumns, setVisibleColumns] = useLocalStorage<Record<string, boolean>>(
        'db-management-visible-columns',
        COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
    );
    const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);
    const visibilityDropdownRef = useRef<HTMLDivElement>(null);
    const [archiveConfirmation, setArchiveConfirmation] = useState<{ count: number; onConfirm: () => void } | null>(null);

    // Состояния для модального окна настроек
    const [settingsProject, setSettingsProject] = useState<Project | null>(null);
    const [settingsInitialSection, setSettingsInitialSection] = useState<AccordionSectionKey | null>(null);

    // --- Filtering State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<string>('All');

    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        const allCombinedProjects = [...projects, ...Object.values(editedProjects)];
        allCombinedProjects.forEach(p => {
            if (p.team) teams.add(p.team);
        });
        return Array.from(teams).sort();
    }, [projects, editedProjects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
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

    const fetchProjects = useCallback(async () => {
        setError(null);
        try {
            console.log("DB_PAGE: Загружаем все проекты для управления...");
            const allProjects = await api.getAllProjectsForManagement();
            setProjects(allProjects);
            console.log(`DB_PAGE: Загружено ${allProjects.length} проектов.`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить проекты.';
            setError(errorMessage);
            console.error(err);
        }
    }, []);

    useEffect(() => {
        if (viewMode === 'main') {
            fetchProjects();
        }
    }, [fetchProjects, viewMode]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (visibilityDropdownRef.current && !visibilityDropdownRef.current.contains(event.target as Node)) {
                setIsVisibilityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleProjectChange = useCallback((projectId: string, field: keyof Project, value: any) => {
        const originalProject = projects.find(p => p.id === projectId);
        if (!originalProject) return;

        const projectBeforeChange = editedProjects[projectId] || originalProject;
        const newEdits = { ...editedProjects };
        
        newEdits[projectId] = { ...projectBeforeChange, [field]: value };

        if (field === 'sort_order') {
            const oldValue = projectBeforeChange.sort_order;
            const newValue = value === null || isNaN(value) ? null : Number(value);
            
            if (newValue !== null && oldValue !== null && newValue !== oldValue) {
                const allCurrentData = projects.map(p => newEdits[p.id] || p);
                
                if (newValue < oldValue) {
                    allCurrentData.forEach(p => {
                        if (p.id !== projectId && p.sort_order != null && p.sort_order >= newValue && p.sort_order < oldValue) {
                            const shiftedProject = { ...(newEdits[p.id] || p), sort_order: p.sort_order + 1 };
                            newEdits[p.id] = shiftedProject;
                        }
                    });
                } 
                else {
                    allCurrentData.forEach(p => {
                        if (p.id !== projectId && p.sort_order != null && p.sort_order > oldValue && p.sort_order <= newValue) {
                            const shiftedProject = { ...(newEdits[p.id] || p), sort_order: p.sort_order - 1 };
                            newEdits[p.id] = shiftedProject;
                        }
                    });
                }
            }
        }
        
        setEditedProjects(newEdits);
    }, [projects, editedProjects]);
    
    const executeSave = async () => {
        setArchiveConfirmation(null);
        setIsSaving(true);
        try {
            console.log(`DB_PAGE: Сохраняем изменения для ${Object.keys(editedProjects).length} проектов...`);
            await api.updateProjects(Object.values(editedProjects));
            setEditedProjects({});
            window.showAppToast?.("Изменения успешно сохранены!", 'success');
            await fetchProjects();
            onProjectsUpdate();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при сохранении.';
            window.showAppToast?.(`Не удалось сохранить изменения: ${errorMessage}`, 'error');
            console.error("Bulk project update failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveChanges = async () => {
        if (!isDirty) return;

        const projectsToArchive = Object.values(editedProjects).filter((p: Project) => {
            const original = projects.find(orig => orig.id === p.id);
            return p.archived && (!original || !original.archived);
        });

        if (projectsToArchive.length > 0) {
            setArchiveConfirmation({
                count: projectsToArchive.length,
                onConfirm: executeSave,
            });
        } else {
            await executeSave();
        }
    };

    const handleAddProjectsSuccess = () => {
        setIsAddModalOpen(false);
        fetchProjects();
        onProjectsUpdate();
    };

    const handleToggleColumnVisibility = (key: string) => {
        setVisibleColumns(prev => ({...prev, [key]: !prev[key]}));
    };

    const handleShowAllColumns = () => {
        setVisibleColumns(COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}));
    };

    const handleHideAllColumns = () => {
        setVisibleColumns(COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: false }), {}));
    };

    const handleAutoNumbering = useCallback(() => {
        const allProjectData = projects.map(p => editedProjects[p.id] || p);
        
        const existingNumbers = allProjectData
            .map(p => p.sort_order)
            .filter((num): num is number => num != null && !isNaN(num));

        let currentNumber = (existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0) + 1;

        const newEdits = { ...editedProjects };
        
        projects.forEach(p => {
            const currentData = newEdits[p.id] || p;
            if (currentData.sort_order == null) {
                newEdits[p.id] = { ...currentData, sort_order: currentNumber };
                currentNumber++;
            }
        });

        setEditedProjects(newEdits);
    }, [projects, editedProjects]);

    const handleOpenSettings = (project: Project, section?: AccordionSectionKey) => {
        setSettingsProject(project);
        setSettingsInitialSection(section || null);
    };

    const handleSettingsSave = async (updatedProject: Project) => {
        try {
            await api.updateProjectSettings(updatedProject);
            // Обновляем данные в списке проектов без перезагрузки страницы
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
            setSettingsProject(null);
        } catch (error) {
            console.error("Failed to save settings from DB page:", error);
            window.showAppToast?.("Не удалось сохранить настройки проекта.", 'error');
        }
    };

    if (viewMode === 'archive') {
        return <ArchivePage user={user} onGoBack={() => setViewMode('main')} onDataUpdated={onProjectsUpdate} />;
    }
    
    if (viewMode === 'global-variables') {
        return <GlobalVariablesManagement onGoBack={() => setViewMode('main')} />;
    }

    if (viewMode === 'project-context') {
        return <ProjectContextManagement onGoBack={() => setViewMode('main')} />;
    }

    if (viewMode === 'administered') {
        return <AdministeredGroupsPage onGoBack={() => setViewMode('main')} />;
    }

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                 <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Управление базой проектов</h1>
                    <p className="text-sm text-gray-500">Массовое редактирование и добавление проектов.</p>
                </div>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
                     <div className="flex items-center gap-2">
                        <div className="relative" ref={visibilityDropdownRef}>
                            <button
                                onClick={() => setIsVisibilityDropdownOpen(prev => !prev)}
                                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                Колонки
                            </button>
                             {isVisibilityDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 animate-fade-in-up">
                                    <div className="px-3 py-2 border-b flex justify-between items-center">
                                        <button onClick={handleShowAllColumns} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">Показать все</button>
                                        <button onClick={handleHideAllColumns} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap">Скрыть все</button>
                                    </div>
                                    <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                        {COLUMNS.map(col => (
                                            <label key={col.key} className="flex items-center px-2 py-1.5 rounded-md text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={!!visibleColumns[col.key]}
                                                    onChange={() => handleToggleColumnVisibility(col.key)}
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                                                />
                                                <span className="ml-3 select-none">{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleAutoNumbering}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm disabled:opacity-50 whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20V4l4 4" />
                            </svg>
                            Auto №
                        </button>

                        {/* NEW: Administered Groups Button */}
                        <button
                            onClick={() => setViewMode('administered')}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Администрируемые
                        </button>

                        <button
                            onClick={() => setViewMode('archive')}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            Архив
                        </button>
                         {user?.role === 'admin' && (
                             <>
                                <button
                                    onClick={() => setViewMode('global-variables')}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.705 4.5l.395 3.951a.5.5 0 00.495.448h5.81a.5.5 0 00.495-.448l.395-3.951M5.23 11h13.54M4.21 15h15.58" />
                                    </svg>
                                    Глобальные переменные
                                </button>
                                <button
                                    onClick={() => setViewMode('project-context')}
                                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Контекст проекта
                                </button>
                            </>
                        )}
                    </div>
                     <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            disabled={isSaving}
                            className="inline-flex items-center justify-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 disabled:opacity-50 whitespace-nowrap"
                        >
                            + Добавить проекты
                        </button>
                        <button
                            onClick={handleSaveChanges}
                            disabled={!isDirty || isSaving}
                            title="Сохранить все изменения"
                            className="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                        >
                            {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                        </button>
                    </div>
                </div>

                {/* Project Filtering Bar */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center gap-4">
                    <div className="relative w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Поиск проекта..."
                            className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 whitespace-nowrap">Команда:</span>
                        <select
                            value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)}
                            className="border border-gray-300 rounded-md text-sm py-1.5 pl-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="All">Все</option>
                            {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
                            <option value="NoTeam">Без команды</option>
                        </select>
                    </div>
                    <span className="text-xs text-gray-500 ml-auto">
                        Показано: <strong>{filteredProjects.length}</strong> из {projects.length}
                    </span>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-auto custom-scrollbar">
                {error ? (
                    <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>
                ) : (
                    <ProjectTable 
                        projects={filteredProjects}
                        editedProjects={editedProjects}
                        onProjectChange={handleProjectChange}
                        uniqueTeams={uniqueTeams}
                        columns={COLUMNS}
                        visibleColumns={visibleColumns}
                        onOpenSettings={handleOpenSettings}
                    />
                )}
            </main>
            {isAddModalOpen && (
                <AddProjectsModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSuccess={handleAddProjectsSuccess}
                />
            )}
            {archiveConfirmation && (
                <ConfirmationModal
                    title="Перенести проекты в архив?"
                    message={`Вы уверены, что хотите перенести ${archiveConfirmation.count} проект(а/ов) в архив?\nДействие может отменить только администратор.`}
                    onConfirm={archiveConfirmation.onConfirm}
                    onCancel={() => setArchiveConfirmation(null)}
                    confirmText="Да, перенести"
                    cancelText="Отмена"
                    isConfirming={isSaving}
                />
            )}
             {settingsProject && (
                <ProjectSettingsModal
                    project={settingsProject}
                    uniqueTeams={uniqueTeams}
                    onClose={() => setSettingsProject(null)}
                    onSave={handleSettingsSave}
                    initialOpenSection={settingsInitialSection}
                    zIndex="z-[60]"
                />
            )}
        </div>
    );
};
