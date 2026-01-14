
import React from 'react';
import { useProjectContext } from '../hooks/useProjectContext';
import { ContextManagementHeader } from './context/ContextManagementHeader';
import { ContextTable } from './context/ContextTable';
import { ContextFieldModal } from './modals/CreateContextFieldModal';
import { DeleteContextFieldModal } from './modals/DeleteContextFieldModal';
import { AiContextAutofillModal } from './modals/AiContextAutofillModal';
import { MassAiAutofillModal } from './modals/MassAiAutofillModal';
import { ClearRowModal } from './modals/ClearRowModal';
import { ClearColumnModal } from './modals/ClearColumnModal';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

export const ProjectContextManagement: React.FC<{ onGoBack: () => void; }> = ({ onGoBack }) => {
    const { state, actions } = useProjectContext();

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <ContextManagementHeader 
                onGoBack={onGoBack}
                columnTypeFilter={state.columnTypeFilter}
                setColumnTypeFilter={actions.setColumnTypeFilter}
                searchQuery={state.searchQuery}
                setSearchQuery={actions.setSearchQuery}
                teamFilter={state.teamFilter}
                setTeamFilter={actions.setTeamFilter}
                uniqueTeams={state.uniqueTeams}
                filteredCount={state.filteredProjects.length}
                totalCount={state.projects.length}
                fields={state.fields}
                hiddenFields={state.hiddenFields}
                toggleFieldVisibility={actions.toggleFieldVisibility}
                onAddColumn={() => { actions.setEditingField(null); actions.setIsModalOpen(true); }}
                onSave={actions.handleSave}
                isSaving={state.isSaving}
                hasChanges={Object.keys(state.editedValues).length > 0}
                onMassAiClick={() => actions.setMassAiModalOpen(true)}
                isMassAiProcessing={state.isMassAiProcessing}
                massAiProgress={state.massAiProgress}
                onClearAll={actions.handleClearAll}
            />
            
            <main className="flex-grow p-4 overflow-hidden flex flex-col">
                {state.isLoading ? (
                    <div className="flex-grow flex justify-center items-center">
                        <div className="loader h-10 w-10 border-4 border-t-indigo-500"></div>
                    </div>
                ) : (
                    <ContextTable 
                        projects={state.filteredProjects}
                        totalProjectsCount={state.projects.length}
                        fields={state.visibleFields}
                        columnWidths={state.columnWidths}
                        setColumnWidths={actions.setColumnWidths}
                        getValue={actions.getValue}
                        handleValueChange={actions.handleValueChange}
                        onEditField={(field) => { actions.setEditingField(field); actions.setIsModalOpen(true); }}
                        onDeleteField={actions.handleInitiateDeleteField}
                        onAiAutofill={actions.handleAiAutofill}
                        onAiCompanyDesc={actions.handleAiCompanyDesc}
                        onAiProductsDesc={actions.handleAiProductsDesc}
                        onAiTone={actions.handleAiTone}
                        autofillLoadingId={state.autofillLoadingId}
                        editedValues={state.editedValues}
                        massAiActiveProjectId={state.massAiActiveProjectId}
                        onClearColumn={actions.handleClearColumn}
                        onClearRow={actions.handleClearRow}
                    />
                )}
            </main>
            
            {state.isModalOpen && (
                <ContextFieldModal 
                    isOpen={state.isModalOpen}
                    onClose={() => { actions.setIsModalOpen(false); actions.setEditingField(null); }}
                    onConfirm={actions.handleSaveField}
                    projects={state.projects}
                    initialData={state.editingField}
                />
            )}
            
            {state.aiModalOpen && state.aiTargetProjectId && (
                <AiContextAutofillModal 
                    isOpen={state.aiModalOpen}
                    onClose={() => actions.setAiModalOpen(false)}
                    onApply={actions.handleApplyAiSuggestions}
                    suggestions={state.aiSuggestions}
                    currentValues={state.values.filter(v => v.project_id === state.aiTargetProjectId)}
                    fields={state.fields}
                    project={state.projects.find(p => p.id === state.aiTargetProjectId)!}
                />
            )}

            {state.massAiModalOpen && (
                <MassAiAutofillModal
                    isOpen={state.massAiModalOpen}
                    onClose={() => actions.setMassAiModalOpen(false)}
                    onStart={actions.handleMassAiStart}
                    projects={state.filteredProjects}
                    fields={state.fields}
                    values={state.values}
                    editedValues={state.editedValues}
                />
            )}
            
            {state.deleteModalState && (
                <DeleteContextFieldModal
                    isOpen={state.deleteModalState.isOpen}
                    onClose={() => actions.setDeleteModalState(null)}
                    onConfirm={actions.handleConfirmDeleteField}
                    field={state.deleteModalState.field}
                    affectedValues={state.deleteModalState.affectedValues}
                    projects={state.projects}
                    isDeleting={state.isSaving}
                />
            )}

            {state.clearRowModalState && (
                <ClearRowModal
                    isOpen={state.clearRowModalState.isOpen}
                    onClose={() => actions.setClearRowModalState(null)}
                    onConfirm={actions.handleConfirmClearRow}
                    project={state.projects.find(p => p.id === state.clearRowModalState?.projectId)!}
                    fields={state.visibleFields}
                />
            )}

            {state.clearColumnModalState && (
                <ClearColumnModal
                    isOpen={state.clearColumnModalState.isOpen}
                    onClose={() => actions.setClearColumnModalState(null)}
                    onConfirm={actions.handleConfirmClearColumn}
                    field={state.fields.find(f => f.id === state.clearColumnModalState?.fieldId)!}
                    projects={state.filteredProjects}
                />
            )}
            
            {state.clearAllModalOpen && (
                <ConfirmationModal
                    title="Очистить всю таблицу?"
                    message="Вы уверены, что хотите очистить все текстовые поля в таблице для текущих проектов? \n\nДанные будут удалены только из интерфейса (временно). Пока вы не нажмете кнопку 'Сохранить', оригинальные данные останутся в базе, и это действие можно будет отменить, просто обновив страницу."
                    onConfirm={actions.handleConfirmClearAll}
                    onCancel={() => actions.setClearAllModalOpen(false)}
                    confirmText="Да, очистить все"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[70]"
                />
            )}
        </div>
    );
};
