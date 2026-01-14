import React from 'react';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

export const DeleteConfirmationModal: React.FC<{
    itemType: 'пост' | 'заметку';
    itemDate: string;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}> = ({ itemType, itemDate, onClose, onConfirm, isDeleting }) => {
    return (
        <ConfirmationModal
            title="Подтвердите удаление"
            message={`Вы уверены, что хотите удалить ${itemType} от ${new Date(itemDate).toLocaleString('ru-RU')}?`}
            onConfirm={onConfirm}
            onCancel={onClose}
            isConfirming={isDeleting}
            confirmText="Удалить"
            cancelText="Отмена"
            confirmButtonVariant="danger"
        />
    );
};
