import React, { DragEvent } from 'react';
import { Note } from '../../../shared/types';

export const NoteCard: React.FC<{
    note: Note;
    isExpanded: boolean;
    isSelectionMode: boolean;
    isSelected: boolean;
    onView: (note: Note) => void;
    onEdit: (note: Note) => void;
    onDelete: (note: Note) => void;
    onCopy: (note: Note) => void;
    onDragStart: (e: DragEvent<HTMLDivElement>, note: Note) => void;
    onDragEnd: (e: DragEvent<HTMLDivElement>) => void;
    onToggleSelect: (id: string) => void;
    animationIndex?: number;
}> = ({ note, isExpanded, isSelectionMode, isSelected, onView, onEdit, onDelete, onCopy, onDragStart, onDragEnd, onToggleSelect, animationIndex = 0 }) => {
    
    const colorClasses = {
        '#FEE2E2': 'bg-red-100 border-red-200 text-red-800',
        '#FEF3C7': 'bg-amber-100 border-amber-200 text-amber-800',
        '#D1FAE5': 'bg-green-100 border-green-200 text-green-800',
        '#DBEAFE': 'bg-blue-200 border-blue-300 text-blue-800',
        '#E0E7FF': 'bg-indigo-200 border-indigo-300 text-indigo-800',
        '#F3E8FF': 'bg-purple-200 border-purple-300 text-purple-800',
        '#FCE7F3': 'bg-pink-200 border-pink-300 text-pink-800',
    };
    
    const baseClass = colorClasses[note.color as keyof typeof colorClasses] || 'bg-gray-100 border-gray-200 text-gray-800';
    
    const handleCardClick = () => {
        if (isSelectionMode) {
            onToggleSelect(note.id);
        } else {
            onView(note);
        }
    };

    if (!isExpanded) {
        return (
            <div 
                draggable={!isSelectionMode}
                onDragStart={(e) => {
                    if (isSelectionMode) {
                        e.preventDefault();
                        return;
                    }
                    onDragStart(e, note);
                }}
                onDragEnd={onDragEnd}
                onClick={handleCardClick}
                className={`group relative p-1.5 rounded-md border text-xs ${isSelectionMode ? 'cursor-pointer' : 'cursor-move'} ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : ''} ${baseClass} opacity-0 animate-fade-in-up`}
                style={{ animationDelay: `${animationIndex * 50}ms` }}
            >
                 {isSelectionMode && (
                     <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-sm border border-gray-400 bg-white flex items-center justify-center pointer-events-none z-10">
                        {isSelected && <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                     </div>
                )}
                <div className="flex justify-between items-center gap-2">
                    <p className="font-semibold">{new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    {note.title ? (
                        <p className="truncate font-medium flex-grow text-left">{note.title}</p>
                    ) : (
                        // Если нет заголовка, просто оставляем пустое место
                        <div className="flex-grow"></div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div 
            draggable={!isSelectionMode}
            onDragStart={(e) => {
                if (isSelectionMode) {
                    e.preventDefault();
                    return;
                }
                onDragStart(e, note);
            }}
            onDragEnd={onDragEnd}
            className={`relative group p-2.5 rounded-lg border text-xs shadow-sm ${isSelectionMode ? 'cursor-pointer' : 'cursor-move'} transition-all duration-200 ${isSelected ? 'ring-2 ring-indigo-500 border-transparent' : ''} ${baseClass} opacity-0 animate-fade-in-up`}
            style={{ animationDelay: `${animationIndex * 50}ms` }}
        >
            {isSelectionMode && (
                 <div className="absolute top-2 right-2 w-5 h-5 rounded-sm border border-gray-400 bg-white flex items-center justify-center pointer-events-none z-10">
                    {isSelected && <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                 </div>
            )}
            <div onClick={handleCardClick} className={isSelectionMode ? 'opacity-50' : ''}>
                <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold">{new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className={`flex items-center space-x-2 ${isSelectionMode ? 'pointer-events-none' : ''}`}>
                        <button onClick={(e) => { e.stopPropagation(); onCopy(note); }} title="Копировать" className="hover:text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onEdit(note); }} title="Редактировать" className="hover:text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(note); }} title="Удалить" className="hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                </div>
                {note.title && <p className="font-bold mb-1 break-words">{note.title}</p>}
                <p className="break-words whitespace-pre-wrap">{note.text}</p>
            </div>
        </div>
    );
};
