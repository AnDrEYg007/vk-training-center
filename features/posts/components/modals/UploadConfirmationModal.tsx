import React from 'react';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface UploadConfirmationModalProps {
    fileCount: number;
    uploadTargetName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

// Вспомогательная функция для правильного склонения слова "файл"
const pluralizeFiles = (count: number): string => {
    const cases = [2, 0, 1, 1, 1, 2];
    const titles = ['файл', 'файла', 'файлов'];
    return titles[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[(count % 10 < 5) ? count % 10 : 5]];
};

export const UploadConfirmationModal: React.FC<UploadConfirmationModalProps> = ({
    fileCount,
    uploadTargetName,
    onConfirm,
    onCancel,
}) => {
    return (
        <ConfirmationModal
            title="Подтвердите загрузку"
            message={`Вы уверены, что хотите загрузить ${fileCount} ${pluralizeFiles(fileCount)} в ${uploadTargetName}?`}
            onConfirm={onConfirm}
            onCancel={onCancel}
            confirmText="Да, загрузить"
            cancelText="Отмена"
            confirmButtonVariant="success"
            zIndex="z-[110]" // Выше, чем модальное окно поста
        />
    );
};