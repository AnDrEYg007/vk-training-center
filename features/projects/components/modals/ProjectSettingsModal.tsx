
import React from 'react';
import { Project } from '../../../../shared/types';
import { useProjectSettingsManager } from '../../hooks/useProjectSettingsManager';
import { VariablesEditor } from './VariablesEditor';
import { GlobalVariablesEditor } from './GlobalVariablesEditor';
import { TagsEditor } from './TagsEditor';
import { AiPromptPresetsEditor } from './AiPromptPresetsEditor';
import { AccordionSection } from './settings-sections/AccordionSection';
import { StatusSection } from './settings-sections/StatusSection';
import { NameSection } from './settings-sections/NameSection';
import { TeamSection } from './settings-sections/TeamSection';
import { NotesSection } from './settings-sections/NotesSection';
import { IntegrationsSection } from './settings-sections/IntegrationsSection';
import { InfoSection } from './settings-sections/InfoSection';

export type AccordionSectionKey = 'name' | 'team' | 'notes' | 'variables' | 'global-variables' | 'tags' | 'ai-presets' | 'info' | 'integrations';




export const ProjectSettingsModal: React.FC<{ 
    project: Project, 
    uniqueTeams: string[],
    onClose: () => void, 
    onSave: (updatedProject: Project) => Promise<void>,
    zIndex?: string,
    initialOpenSection?: AccordionSectionKey | null,
}> = ({ project, uniqueTeams, onClose, onSave, zIndex = 'z-50', initialOpenSection = null }) => {
    
    const { state, actions } = useProjectSettingsManager({
        project,
        uniqueTeams,
        onSave,
        onClose,
        initialOpenSection,
    });

    const {
        formData,
        projectVariables,
        projectGlobalVarDefs,
        projectGlobalVarValues,
        projectTags,
        projectAiPresets,
        isRefreshing,
        isSaving,
        isAiRunning,
        aiSuggestedVarIds,
        activeAccordion,
        isCreatingTeam,
        newTeamName,
        isTokenVisible,
        globalVarErrors,
    } = state;

    const {
        handleSubmit,
        handleRefresh,
        handleAccordionToggle,
        handleFormChange,
        handleSetFormData,
        setIsCreatingTeam,
        setNewTeamName,
        handleSaveNewTeam,
        handleCancelCreateTeam,
        setIsTokenVisible,
        variableActions,
        globalVariableActions,
        tagActions,
        aiPresetActions,
    } = actions;
    
    const isSaveDisabled = isSaving || isAiRunning || Object.keys(globalVarErrors).length > 0;

    // --- Логика для списка дополнительных токенов ---
    const additionalTokens = formData.additional_community_tokens || [];

    const handleAdditionalTokenChange = (index: number, value: string) => {
        const newTokens = [...additionalTokens];
        newTokens[index] = value;
        handleSetFormData(prev => ({ ...prev, additional_community_tokens: newTokens }));
    };

    const handleAddAdditionalToken = () => {
        const newTokens = [...additionalTokens, ''];
        handleSetFormData(prev => ({ ...prev, additional_community_tokens: newTokens }));
    };

    const handleRemoveAdditionalToken = (index: number) => {
        const newTokens = [...additionalTokens];
        newTokens.splice(index, 1);
        handleSetFormData(prev => ({ ...prev, additional_community_tokens: newTokens }));
    };


    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ${zIndex} p-4`}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }} autoComplete="off" className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh] animate-fade-in-up">
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800 truncate">
                        Настройки проекта: <span className="text-indigo-600">{project.name}</span>
                    </h2>
                     <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing || isSaving}
                        className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-wait flex items-center"
                        title="Обновить данные проекта из базы"
                    >
                        {isRefreshing ? <div className="loader h-4 w-4 border-2 border-t-2 border-gray-400 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                    </button>
                </header>
                
                <main className="px-6 overflow-y-auto custom-scrollbar">
                    <StatusSection 
                        formData={formData} 
                        handleSetFormData={handleSetFormData} 
                        isSaving={isSaving} 
                    />

                    <NameSection 
                        formData={formData} 
                        handleFormChange={handleFormChange} 
                        handleSubmit={handleSubmit} 
                        isSaving={isSaving} 
                        activeAccordion={activeAccordion} 
                        handleAccordionToggle={handleAccordionToggle} 
                    />

                    <TeamSection 
                        formData={formData} 
                        uniqueTeams={uniqueTeams} 
                        handleSetFormData={handleSetFormData} 
                        isSaving={isSaving} 
                        isCreatingTeam={isCreatingTeam} 
                        setIsCreatingTeam={setIsCreatingTeam} 
                        newTeamName={newTeamName} 
                        setNewTeamName={setNewTeamName} 
                        handleSaveNewTeam={handleSaveNewTeam} 
                        handleCancelCreateTeam={handleCancelCreateTeam} 
                        activeAccordion={activeAccordion} 
                        handleAccordionToggle={handleAccordionToggle} 
                    />
                    
                    <NotesSection 
                        formData={formData} 
                        handleFormChange={handleFormChange} 
                        isSaving={isSaving} 
                        activeAccordion={activeAccordion} 
                        handleAccordionToggle={handleAccordionToggle} 
                    />

                    <AccordionSection title="Переменные проекта" sectionKey="variables" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
                         <VariablesEditor
                            variables={projectVariables}
                            onVariableChange={variableActions.handleVariableChange}
                            onAddVariable={variableActions.handleAddVariable}
                            onRemoveVariable={variableActions.handleRemoveVariable}
                            onAiSetup={variableActions.handleAiSetup}
                            isAiRunning={isAiRunning}
                            isSaving={isSaving}
                            aiSuggestedVarIds={aiSuggestedVarIds}
                        />
                    </AccordionSection>

                    <AccordionSection title="Глобальные переменные" sectionKey="global-variables" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
                        <GlobalVariablesEditor
                            definitions={projectGlobalVarDefs}
                            values={projectGlobalVarValues}
                            onDefinitionChange={globalVariableActions.handleDefinitionChange}
                            onValueChange={globalVariableActions.handleValueChange}
                            onAddDefinition={globalVariableActions.handleAddDefinition}
                            onRemoveDefinition={globalVariableActions.handleRemoveDefinition}
                            isSaving={isSaving}
                            errors={globalVarErrors}
                        />
                    </AccordionSection>

                    <AccordionSection title="Управление тегами" sectionKey="tags" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
                         <TagsEditor
                            tags={projectTags}
                            onTagChange={tagActions.handleTagChange}
                            onAddTag={tagActions.handleAddTag}
                            onRemoveTag={tagActions.handleRemoveTag}
                            isSaving={isSaving}
                        />
                    </AccordionSection>
                    
                    <AccordionSection title="Шаблоны AI-инструкций" sectionKey="ai-presets" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
                        <AiPromptPresetsEditor
                            presets={projectAiPresets}
                            onPresetChange={aiPresetActions.handlePresetChange}
                            onAddPreset={aiPresetActions.handleAddPreset}
                            onRemovePreset={aiPresetActions.handleRemovePreset}
                            isSaving={isSaving}
                        />
                    </AccordionSection>

                    <IntegrationsSection 
                        formData={formData} 
                        handleFormChange={handleFormChange} 
                        isSaving={isSaving} 
                        isTokenVisible={isTokenVisible} 
                        setIsTokenVisible={setIsTokenVisible} 
                        additionalTokens={additionalTokens} 
                        handleAdditionalTokenChange={handleAdditionalTokenChange} 
                        handleAddAdditionalToken={handleAddAdditionalToken} 
                        handleRemoveAdditionalToken={handleRemoveAdditionalToken} 
                        activeAccordion={activeAccordion} 
                        handleAccordionToggle={handleAccordionToggle} 
                    />

                    <InfoSection 
                        formData={formData} 
                        activeAccordion={activeAccordion} 
                        handleAccordionToggle={handleAccordionToggle} 
                    />
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                    <button type="button" onClick={onClose} disabled={isSaving || isAiRunning} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button 
                        type="button" 
                        onClick={handleSubmit}
                        disabled={isSaveDisabled} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 disabled:cursor-wait w-28 flex justify-center items-center"
                        title={isSaveDisabled ? "Исправьте ошибки перед сохранением" : "Сохранить"}
                    >
                        {isSaving ? (
                             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Сохранить'}
                    </button>
                </footer>
            </form>
        </div>
    );
};
