import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { UnifiedStory } from '../../../shared/types';

interface StoryViewerModalProps {
    initialStoryId: number;
    stories: UnifiedStory[];
    onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({ initialStoryId, stories, onClose }) => {
    // Determine the starting index based on the ID, fallback to 0
    const startIndex = stories.findIndex(s => s.vk_story_id === initialStoryId);
    const [currentIndex, setCurrentIndex] = useState(startIndex !== -1 ? startIndex : 0);

    const currentStory = stories[currentIndex];

    const handleNext = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(); // Close if we reach the end
        }
    }, [currentIndex, stories.length, onClose]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'Space') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev, onClose]);

    if (!currentStory) return null;

    const dateStr = new Date(currentStory.date * 1000).toLocaleString('ru-RU', {
        day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center backdrop-blur-sm" onClick={onClose}>
            
            {/* Navigation Buttons (Left) */}
            {currentIndex > 0 && (
                <button 
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-4 text-white hover:text-gray-300 transition-colors bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 z-20"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Navigation Buttons (Right) */}
            {currentIndex < stories.length - 1 && (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-4 text-white hover:text-gray-300 transition-colors bg-white bg-opacity-10 rounded-full hover:bg-opacity-20 z-20"
                >
                     <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Content Container */}
            <div 
                className="relative max-h-screen w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-full flex flex-col items-center justify-center p-4 story-viewer-container" 
                onClick={e => e.stopPropagation()}
            >
                {/* Header (Project Name & Time) - Optional overlay style */}
                <div className="absolute top-4 left-0 w-full px-4 flex justify-between items-center z-10 text-white drop-shadow-md">
                    <div className="flex flex-col">
                         <span className="text-xs opacity-80">{dateStr}</span>
                         {/* We don't have project name here easily, assume context or omit */}
                    </div>
                     <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Media */}
                <div className="relative w-full h-[80vh] bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex items-center justify-center">
                    {currentStory.preview ? (
                         <img 
                            src={currentStory.preview} 
                            alt="Story" 
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-white text-opacity-50 flex flex-col items-center">
                             <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Нет изображения</span>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex gap-4">
                     {currentStory.link && (
                         <a 
                            href={currentStory.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07,1.69L7.84,17.16L9.06,17.73L16.29,2.26L15.07,1.69M17.43,8.8C15.55,6.15 13.96,6.31 13.96,6.31L13.27,2.26C16.89,1.66 19.19,2.74 19.19,2.74C19.19,2.74 21.03,13.67 21.03,15.67C21.03,18.06 18.72,21.57 15.66,21.57C12.79,21.57 10.95,19.24 10.95,16.86C10.95,15.91 11.23,15.08 11.23,15.08L8.79,13.94C5.16,16.14 4.29,20.37 4.29,20.37L2.47,19.5C2.47,19.5 3.32,15.74 6.87,13.04L13,15.91C12.96,16.2 12.95,16.5 12.95,16.86C12.95,18.3 14.12,19.57 15.66,19.57C17.2,19.57 18.23,17.84 18.23,16.86C18.23,16.17 18.06,14.63 17.58,11.85C17.58,11.85 18.28,9.94 17.43,8.8Z" /></svg>
                            Открыть в VK
                        </a>
                     )}
                </div>

            </div>
        </div>,
        document.body
    );
};
