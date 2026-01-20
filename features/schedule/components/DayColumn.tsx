import React, { DragEvent } from 'react';
import { UnifiedStory } from '../../../shared/types';
import { DayStories } from './DayStories';

// --- DayColumn Header ---
interface DayColumnHeaderProps {
    date: Date;
    isSelectionMode: boolean;
    onOpenCreateModal: (date: Date) => void;
}

const Header: React.FC<DayColumnHeaderProps> = ({ date, isSelectionMode, onOpenCreateModal }) => {
    const isToday = new Date().toDateString() === date.toDateString();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const isPast = date < startOfToday;

    return (
        <div className={`border-t-4 ${isToday ? 'border-indigo-500' : 'border-transparent'}`}>
            <div className="text-center mb-2">
                <p className={`font-bold text-sm ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                </p>
                <p className={`text-gray-500 text-xs ${isToday ? 'font-semibold' : ''}`}>
                    {date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                </p>
            </div>

            <button
                onClick={() => onOpenCreateModal(date)}
                disabled={isPast || isSelectionMode}
                title={isPast ? "Нельзя создавать посты в прошлом" : `Создать пост на ${date.toLocaleDateString('ru-RU')}`}
                className="w-full flex justify-center items-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:text-gray-400"
                aria-label={`Создать пост на ${date.toLocaleDateString('ru-RU')}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
    );
};

// --- DayColumn Content ---
interface DayColumnContentProps {
    date: Date;
    children: React.ReactNode;
    onDrop: (e: DragEvent<HTMLDivElement>, targetDay: Date) => void;
    onDoubleClick: () => void;
}

const Content: React.FC<DayColumnContentProps> = ({ date, children, onDrop, onDoubleClick }) => {
    return (
        <div
            className="p-1 min-h-[200px] rounded-lg"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-indigo-100'); }}
            onDragLeave={(e) => e.currentTarget.classList.remove('bg-indigo-100')}
            onDrop={(e) => {
                e.currentTarget.classList.remove('bg-indigo-100');
                onDrop(e, date);
            }}
            onDoubleClick={(e) => {
                 if (e.currentTarget === e.target) {
                    onDoubleClick();
                }
            }}
        >
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
};

export const DayColumn = {
    Header,
    Content,
};