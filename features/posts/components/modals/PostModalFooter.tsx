import React from 'react';
import { PhotoAttachment, Attachment } from '../../../../shared/types';
import { ChatTurn } from '../../hooks/useAIGenerator';

interface PostModalFooterProps {
    mode: 'view' | 'edit' | 'copy';
    isNewPost: boolean;
    isCopyMode: boolean;
    isPublished: boolean;
    isDirty: boolean;
    isSaving: boolean;
    isUploading: boolean; 
    isLocked?: boolean; 
    editedText: string;
    editedImages: PhotoAttachment[];
    editedAttachments: Attachment[];
    publicationMethod: 'system' | 'vk' | 'now';
    postCount: number;
    onSave: () => void;
    onDelete: () => void;
    onPublishNow: () => void;
    onSwitchToEdit: () => void;
    // Added props
    isAiMultiMode?: boolean;
    selectedAiTurn?: ChatTurn | null;
}

export const PostModalFooter: React.FC<PostModalFooterProps> = ({
    mode,
    isNewPost,
    isCopyMode,
    isPublished,
    isDirty,
    isSaving,
    isUploading, 
    isLocked,
    editedText,
    editedImages,
    editedAttachments,
    publicationMethod,
    postCount,
    onSave,
    onDelete,
    onPublishNow,
    onSwitchToEdit,
    isAiMultiMode,
    selectedAiTurn
}) => {
    
    // Проверяем, есть ли в посте контент.
    const hasTextOrMedia = editedText.trim() !== '' || editedImages.length > 0 || (editedAttachments && editedAttachments.length > 0);
    const isContentEmpty = !hasTextOrMedia;
    
    // Дополнительная проверка для AI-режима
    const isAiNotReady = isAiMultiMode && !selectedAiTurn;

    const getSaveButtonText = () => {
        if (isUploading) {
            return 'Загрузка...';
        }
        if (isNewPost || isCopyMode) {
            let text = '';
            if (publicationMethod === 'now') {
                text = 'Опубликовать';
            } else if (publicationMethod === 'vk') {
                text = 'В отложку VK';
            } else {
                text = 'Запланировать';
            }
            return postCount > 1 ? `${text} (${postCount})` : text;
        }
        return 'Сохранить';
    };
    
    return (
        <footer className="p-4 border-t flex justify-between items-center bg-gray-50 flex-shrink-0">
             <div className="flex items-center">
                {!isNewPost && !isCopyMode && (
                    <button onClick={onDelete} disabled={isSaving || isUploading || (isLocked && !isCopyMode)} className="px-4 py-2 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 border border-red-200">Удалить</button>
                )}
                 {mode === 'edit' && !isNewPost && !isPublished && !isCopyMode && (
                    <button onClick={onPublishNow} disabled={isSaving || isUploading || isLocked || isContentEmpty || isAiNotReady} className="ml-2 px-4 py-2 text-sm font-medium rounded-md text-green-600 hover:bg-green-100 disabled:opacity-50">Опубликовать сейчас</button>
                )}
            </div>
            <div className="flex items-center gap-2">
                {mode === 'view' && !isNewPost && (
                    <>
                        {!isPublished && <button onClick={onPublishNow} disabled={isLocked || isContentEmpty} className="px-4 py-2 text-sm font-medium rounded-md text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed">Опубликовать сейчас</button>}
                        <button onClick={onSwitchToEdit} disabled={isLocked} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Редактировать</button>
                    </>
                )}
                {mode === 'edit' && (
                     <button 
                        onClick={onSave}
                        disabled={isSaving || isUploading || (isLocked && !isCopyMode) || isContentEmpty || (!isDirty && !isNewPost && !isCopyMode) || isAiNotReady}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center min-w-[120px] whitespace-nowrap"
                        title={isAiNotReady ? 'Выберите вариант текста в чате' : isNewPost || isCopyMode ? 'Сохранить и создать пост(ы)' : 'Сохранить изменения в посте'}
                    >
                        {isSaving || isUploading ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : getSaveButtonText()}
                    </button>
                )}
            </div>
        </footer>
    );
};