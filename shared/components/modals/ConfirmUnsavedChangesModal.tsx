import React from 'react';
import { ConfirmationModal } from './ConfirmationModal';

export const ConfirmUnsavedChangesModal: React.FC<{
    onConfirm: () => void;
    onCancel: () => void;
    zIndex?: string;
}> = ({ onConfirm, onCancel, zIndex }) => {
    return (
        <ConfirmationModal
            title="Несохраненные изменения"
            message="У вас есть несохраненные изменения. Вы уверены, что хотите закрыть окно без сохранения?"
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Да, закрыть"
            cancelText="Отмена"
            confirmButtonVariant="danger"
            zIndex={zIndex}
        />
    );
};