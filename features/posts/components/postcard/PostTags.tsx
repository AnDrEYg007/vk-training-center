import React from 'react';
import { ScheduledPost } from '../../../../shared/types';

// Функция для определения контрастного цвета текста (черный или белый)
const getContrastingTextColor = (hexColor: string): string => {
    if (!hexColor) return '#000000';
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
};
    
export const PostTags: React.FC<{ tags: ScheduledPost['tags'] }> = React.memo(({ tags }) => {
    if (!tags || tags.length === 0) return null;
    
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map(tag => {
                const textColor = getContrastingTextColor(tag.color);
                return (
                    <span
                        key={tag.id}
                        className="px-2 py-0.5 text-xs font-medium rounded-full inline-block"
                        style={{ backgroundColor: tag.color, color: textColor }}
                    >
                        {tag.name}
                    </span>
                );
            })}
        </div>
    );
});