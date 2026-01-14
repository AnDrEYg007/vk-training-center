import React, { useState } from 'react';
import { SuggestedPost } from '../../../shared/types';
import { ImageRibbon } from './ImageRibbon';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';

interface SuggestedPostCardProps {
    post: SuggestedPost;
    projectName: string;
    isSelected: boolean;
    isCorrecting: boolean;
    onSelectForEditing: (post: SuggestedPost) => void;
    stretchHeight?: boolean;
    hasResult: boolean;
}

export const SuggestedPostCard: React.FC<SuggestedPostCardProps> = ({
    post,
    projectName,
    isSelected,
    isCorrecting,
    onSelectForEditing,
    stretchHeight = false,
    hasResult,
}) => {
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const handleImageClick = (url: string) => {
        setPreviewImageUrl(url);
        setIsImagePreviewOpen(true);
    };

    const cardClasses = `
        bg-white rounded-lg border shadow-sm flex flex-col transition-all duration-300
        ${isSelected ? 'border-indigo-500 ring-2 ring-indigo-300' : 'border-gray-200 hover:shadow-md hover:border-gray-300'}
        ${stretchHeight ? 'h-full' : ''}
    `;

    const buttonText = isSelected && hasResult ? 'Сгенерировать новый' : 'Редактор AI';
    const buttonIcon = isSelected && hasResult ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
    );


    return (
        <>
            <div className={cardClasses}>
                {post.imageUrl && post.imageUrl.length > 0 && (
                    <ImageRibbon images={post.imageUrl} onImageClick={handleImageClick} />
                )}

                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                             <a 
                                href={post.authorLink || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-gray-800 hover:text-indigo-600 truncate pr-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {post._groupName || projectName}
                            </a>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                                {new Date(post.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{post.text}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto">
                        <a 
                            href={post.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center text-xs font-medium text-gray-500 hover:text-indigo-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Посмотреть на VK
                        </a>
                        <button
                            onClick={() => onSelectForEditing(post)}
                            disabled={isCorrecting}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait"
                        >
                            {buttonIcon}
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>

            {isImagePreviewOpen && previewImageUrl && (
                <ImagePreviewModal
                    image={{ id: previewImageUrl, url: previewImageUrl }}
                    onClose={() => setIsImagePreviewOpen(false)}
                />
            )}
        </>
    );
};