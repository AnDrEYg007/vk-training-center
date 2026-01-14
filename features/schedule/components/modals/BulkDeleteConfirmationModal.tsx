import React from 'react';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

export const BulkDeleteConfirmationModal: React.FC<{
    count: number;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}> = ({ count, onClose, onConfirm, isDeleting }) => {
    return (
        <ConfirmationModal
            title="Подтвердите удаление"
            message={`Вы уверены, что хотите удалить ${count} выбранных элементов? Это действие необратимо.`}
            onConfirm={onConfirm}
            onCancel={onClose}
            isConfirming={isDeleting}
            confirmText="Удалить"
            cancelText="Отмена"
            confirmButtonVariant="danger"
        />
    );
};
