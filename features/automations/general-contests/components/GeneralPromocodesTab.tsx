import React, { useEffect, useMemo } from 'react';
import { Project } from '../../../../shared/types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { PromocodesUpload } from '../../reviews-contest/components/promocodes/PromocodesUpload';
import { PromocodesTable } from '../../reviews-contest/components/promocodes/PromocodesTable';
import { useAuth } from '../../../auth/contexts/AuthContext';
import { useGeneralPromocodesManager } from '../hooks/useGeneralPromocodesManager';

interface GeneralPromocodesTabProps {
    project: Project;
    contestId?: string;
    winnersCount: number;
    onCountChange?: (count: number) => void;
}

export const GeneralPromocodesTab: React.FC<GeneralPromocodesTabProps> = ({ project, contestId, winnersCount, onCountChange }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const { state, actions } = useGeneralPromocodesManager(contestId);

    const freeCount = useMemo(
        () => state.promocodes.filter(p => !p.is_issued).length,
        [state.promocodes]
    );

    useEffect(() => {
        if (onCountChange) {
            onCountChange(freeCount);
        }
    }, [freeCount, onCountChange]);

    const shortage = winnersCount > 0 && freeCount < winnersCount && !!contestId;

    return (
        <div className="flex flex-col gap-4 h-full opacity-0 animate-fade-in-up">
            {!contestId && (
                <div className="p-3 bg-gray-50 border border-dashed border-gray-300 text-gray-600 rounded-lg">
                    Черновик: интерфейс доступен, но данные не сохранятся, пока конкурс не будет сохранен.
                </div>
            )}

            {shortage && (
                <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="font-semibold">Не хватает промокодов</p>
                        <p className="text-sm">Свободно {freeCount} шт., нужно минимум {winnersCount} (по количеству победителей).</p>
                    </div>
                    <button 
                        className="px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                        onClick={() => actions.reload?.()}
                    >
                        Обновить
                    </button>
                </div>
            )}

            <div className="flex gap-6 h-full items-start">
                {/* Форма загрузки */}
                <PromocodesUpload
                    inputCodes={state.inputCodes}
                    onInputChange={actions.setInputCodes}
                    onPaste={actions.handlePasteCodes}
                    onAdd={actions.handleAddCodes}
                    isSaving={state.isSaving}
                    error={state.error}
                    disabled={!contestId}
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
                    disableActions={!contestId}
                />
            </div>
            
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
