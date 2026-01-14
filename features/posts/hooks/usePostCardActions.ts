import React, { useMemo } from 'react';
import { ScheduledPost, SystemPost } from '../../../shared/types';
import { ActionItem, useResponsiveActions } from '../../../shared/hooks/useResponsiveActions';

// Определяем пропсы, необходимые для хука
type UsePostCardActionsProps = {
    post: ScheduledPost | (SystemPost & { date: string });
    isSystemPost?: boolean;
    systemPostStatus?: 'pending_publication' | 'publishing' | 'error' | 'possible_error';
    isPublished: boolean;
    onPublishNow: (post: ScheduledPost) => void;
    onMoveToScheduled?: (post: SystemPost) => void;
    onConfirmPublication?: (post: SystemPost) => void;
    onCopy: (post: ScheduledPost) => void;
    onEdit: (post: ScheduledPost) => void;
    onDelete: (post: ScheduledPost | SystemPost) => void;
    actionsContainerRef: React.RefObject<HTMLDivElement>;
};

/**
 * Хук для инкапсуляции логики создания и адаптивного отображения
 * действий для компонента PostCard.
 */
export const usePostCardActions = ({
    post,
    isSystemPost,
    systemPostStatus,
    isPublished,
    onPublishNow,
    onMoveToScheduled,
    onConfirmPublication,
    onCopy,
    onEdit,
    onDelete,
    actionsContainerRef,
}: UsePostCardActionsProps) => {

    const isSystemPublishing = isSystemPost && systemPostStatus === 'publishing';
    const isContentEmpty = post.text.trim() === '' && post.images.length === 0;
    const isCyclic = 'is_cyclic' in post && post.is_cyclic;

    // Определяем полный список всех возможных действий
    const allActions = useMemo<ActionItem[]>(() => [
        {
            id: 'publish',
            label: 'Опубликовать',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" })),
            onClick: (e) => { e.stopPropagation(); onPublishNow(post as ScheduledPost); },
            disabled: isSystemPublishing || isContentEmpty,
            condition: !isPublished || isSystemPost,
        },
        {
            id: 'move',
            label: 'В отложку VK',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" })),
            onClick: (e) => { e.stopPropagation(); onMoveToScheduled?.(post as SystemPost); },
            disabled: isContentEmpty,
            // Скрываем для циклических постов, так как перенос ломает логику цикла
            condition: isSystemPost && !isSystemPublishing && !!onMoveToScheduled && !isCyclic,
        },
        {
            id: 'confirm',
            label: 'Подтвердить',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })),
            onClick: (e) => { e.stopPropagation(); onConfirmPublication?.(post as SystemPost); },
            condition: isSystemPost && systemPostStatus === 'possible_error' && !!onConfirmPublication,
        },
        {
            id: 'copy',
            label: 'Копировать',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" })),
            onClick: (e) => { e.stopPropagation(); onCopy(post as ScheduledPost); },
            condition: true,
        },
        {
            id: 'edit',
            label: 'Редактировать',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" })),
            onClick: (e) => { e.stopPropagation(); onEdit(post as ScheduledPost); },
            disabled: isSystemPublishing,
            condition: true,
        },
        {
            id: 'delete',
            label: 'Удалить',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })),
            onClick: (e) => { e.stopPropagation(); onDelete(post); },
            disabled: isSystemPublishing,
            condition: true,
        },
        {
            id: 'vk_link',
            label: 'Посмотреть на VK',
            // FIX: Replaced JSX with React.createElement to avoid syntax errors in .ts file.
            icon: React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 }, React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" })),
            onClick: (e) => {
                e.stopPropagation();
                if ('vkPostUrl' in post && post.vkPostUrl) {
                    window.open(post.vkPostUrl, '_blank', 'noopener,noreferrer');
                }
            },
            condition: 'vkPostUrl' in post && !!post.vkPostUrl,
        }
    ], [post, isSystemPost, systemPostStatus, isPublished, isContentEmpty, onPublishNow, onMoveToScheduled, onConfirmPublication, onCopy, onEdit, onDelete, isCyclic]);

    const { visibleActions, hiddenActions, availableActions } = useResponsiveActions(allActions, actionsContainerRef);

    return { visibleActions, hiddenActions, availableActions };
};