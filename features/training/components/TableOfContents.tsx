import React from 'react';
import { TocItem, toc } from '../data/tocData';

export type Topic = TocItem;

interface TocNodeProps {
    item: TocItem;
    level: number;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
}

const TocNode: React.FC<TocNodeProps> = ({ item, level, selectedTopic, onSelectTopic }) => {
    const isSelected = selectedTopic?.path === item.path;
    
    const textClasses = isSelected 
        ? 'font-bold text-indigo-700' 
        : 'font-medium text-gray-600 hover:text-gray-900';

    const paddingClasses = [
        'pl-2', 'pl-6', 'pl-10', 'pl-14'
    ];
    const padding = paddingClasses[level] || 'pl-16';

    return (
        <li>
            <button 
                onClick={() => onSelectTopic(item)}
                className={`relative w-full text-left py-1.5 rounded-md transition-all duration-200 text-sm ${padding} ${isSelected ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
            >
                {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>}
                <span className={textClasses}>{item.title}</span>
            </button>
            {item.children && (
                <ul className="mt-1 space-y-1">
                    {item.children.map(child => (
                        <TocNode 
                            key={child.path}
                            item={child}
                            level={level + 1}
                            selectedTopic={selectedTopic}
                            onSelectTopic={onSelectTopic}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

interface TableOfContentsProps {
    toc: TocItem[];
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc, selectedTopic, onSelectTopic }) => {
    return (
        <nav>
            <ul className="space-y-2">
                {toc.map(item => (
                    <TocNode 
                        key={item.path}
                        item={item}
                        level={0}
                        selectedTopic={selectedTopic}
                        onSelectTopic={onSelectTopic}
                    />
                ))}
            </ul>
        </nav>
    );
};