import React, { useState } from 'react';
import { ScheduledPost } from '../../../../shared/types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

export const PublishConfirmationModal: React.FC<{ 
    post: any, 
    onClose: () => void, 
    onConfirm: (post: any) => Promise<void> 
}> = ({ post, onClose, onConfirm }) => {
    const [isPublishing, setIsPublishing] = useState(false);

    const handleConfirm = async () => {
        setIsPublishing(true);
        try {
            await onConfirm(post);
        } catch (error) {
            // Ошибка обрабатывается родителем, но нам все равно нужно сбросить состояние загрузки
            setIsPublishing(false);
        }
    };

    return (
       <ConfirmationModal
            title="Подтвердите публикацию"
            message="Вы уверены, что хотите опубликовать пост сейчас?"
            onConfirm={handleConfirm}
            onCancel={onClose}
            isConfirming={isPublishing}
            confirmText="Да"
            cancelText="Нет"
            confirmButtonVariant="success"
        />
    );
};