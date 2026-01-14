
import React, { useEffect } from 'react';
import { Project } from '../../../../shared/types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { usePromocodesManager } from '../hooks/usePromocodesManager';
import { PromocodesUpload } from './promocodes/PromocodesUpload';
import { PromocodesTable } from './promocodes/PromocodesTable';
import { useAuth } from '../../../auth/contexts/AuthContext';

interface PromocodesTabProps {
    project: Project; // Нужно для формирования ссылки на диалог
    onCountChange?: (count: number) => void;
}

export const PromocodesTab: React.FC<PromocodesTabProps> = ({ project, onCountChange }) => {
    const { state, actions } = usePromocodesManager(project.id);
    const { user } = useAuth();
    
    const isAdmin = user?.role === 'admin';
    
    // Синхронизируем количество свободных кодов с родительским компонентом
    useEffect(() => {
        if (onCountChange) {
            const freeCount = state.promocodes.filter(p => !p.is_issued).length;
            onCountChange(freeCount);
        }
    }, [state.promocodes, onCountChange]);

    return (
        <div className="flex gap-6 h-full items-start opacity-0 animate-fade-in-up">
            {/* Форма загрузки */}
            <PromocodesUpload
                inputCodes={state.inputCodes}
                onInputChange={actions.setInputCodes}
                onPaste={actions.handlePasteCodes}
                onAdd={actions.handleAddCodes}
                isSaving={state.isSaving}
                error={state.error}
            />
            
            {/* Таблица */}
            <PromocodesTable
                promocodes={state.promocodes}
                project={project}
                isLoading={state.isLoading}
                selectedIds={state.selectedIds}
                onToggleSelection={actions.toggleSelection}
                onToggleAll={actions.toggleAll}
                onDelete={actions.initiateDelete}
                // Editing props
                editingId={state.editingId}
                editingDescription={state.editingDescription}
                onStartEditing={actions.startEditing}
                onSaveEditing={actions.saveEditing}
                onCancelEditing={actions.cancelEditing}
                onEditingDescriptionChange={actions.setEditingDescription}
                // Admin props
                isAdmin={isAdmin}
                onClearAll={() => actions.setClearAllConfirmation(true)}
            />
            
            {state.deleteConfirmation && (
                <ConfirmationModal
                    title="Удалить промокоды?"
                    message={`Вы уверены, что хотите удалить ${state.deleteConfirmation.count} промокод(ов)? Это действие необратимо.`}
                    onConfirm={actions.confirmDelete}
                    onCancel={() => actions.setDeleteConfirmation(null)}
                    confirmText="Да, удалить"
                    confirmButtonVariant="danger"
                    isConfirming={state.isSaving}
                />
            )}

            {state.clearAllConfirmation && (
                <ConfirmationModal
                    title="Очистить базу промокодов?"
                    message="ВНИМАНИЕ: Вы собираетесь удалить ВСЕ промокоды для этого конкурса, включая выданные. История выдачи будет потеряна. \n\nЭто действие необратимо. Вы уверены?"
                    onConfirm={actions.confirmClearAll}
                    onCancel={() => actions.setClearAllConfirmation(false)}
                    confirmText="Да, очистить все"
                    confirmButtonVariant="danger"
                    isConfirming={state.isSaving}
                />
            )}
        </div>
    );
};
