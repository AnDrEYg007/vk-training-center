import React, { useState } from 'react';
import { UnifiedStory } from '../../../shared/types';
import { StoryViewerModal } from './StoryViewerModal';

interface DayStoriesProps {
    stories: UnifiedStory[];
}

export const DayStories: React.FC<DayStoriesProps> = ({ stories }) => {
    const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);

    if (!stories || stories.length === 0) {
        return null; // Don't render anything if no stories
    }

    return (
        <>
            <div className="flex justify-start -space-x-2 pb-2 mt-2 px-1 overflow-x-auto custom-scrollbar">
                {stories.map((story, index) => (
                    <div 
                        key={`${story.vk_story_id}-${index}`} 
                        onClick={() => setSelectedStoryId(story.vk_story_id)}
                        className={`
                            relative w-10 h-10 flex-shrink-0 
                            rounded-full ring-2 ring-white cursor-pointer 
                            transition-transform hover:z-10 hover:scale-110
                            ${story.type === 'photo' ? 'bg-indigo-50' : 'bg-purple-50'}
                        `}
                        title={`История: ${new Date(story.date * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    >
                        {story.preview ? (
                            <img 
                                src={story.preview} 
                                alt="Story" 
                                className="w-full h-full rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div className="w-full h-full rounded-full border border-gray-200 flex items-center justify-center text-[10px] text-indigo-300 font-medium bg-gray-50">
                                Story
                            </div>
                        )}
                        
                        {/* Type Indicator Dot */}
                        <div className={`
                            absolute bottom-0 right-0 w-3 h-3 rounded-full ring-1 ring-white
                            flex items-center justify-center text-[6px] text-white font-bold
                            ${story.type === 'video' ? 'bg-red-500' : 'bg-blue-400'}
                        `}>
                            {story.type === 'video' ? '▶' : ''}
                        </div>
                    </div>
                ))}
            </div>

            {selectedStoryId !== null && (
                <StoryViewerModal 
                    initialStoryId={selectedStoryId}
                    stories={stories}
                    onClose={() => setSelectedStoryId(null)}
                />
            )}
        </>
    );
};
