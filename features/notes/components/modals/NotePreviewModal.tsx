import React from 'react';
import { Note } from '../../../../shared/types';

export const NotePreviewModal: React.FC<{
    note: Note;
    onClose: () => void;
    onEdit: (note: Note) => void;
    onCopy: (note: Note) => void;
    onDelete: (note: Note) => void;
}> = ({ note, onClose, onEdit, onCopy, onDelete }) => {
    
    const colorClasses = {
        header: {
            '#FEE2E2': 'bg-red-100 text-red-800',
            '#FEF3C7': 'bg-amber-100 text-amber-800',
            '#D1FAE5': 'bg-green-100 text-green-800',
            '#DBEAFE': 'bg-blue-200 text-blue-800',
            '#E0E7FF': 'bg-indigo-200 text-indigo-800',
            '#F3E8FF': 'bg-purple-200 text-purple-800',
            '#FCE7F3': 'bg-pink-200 text-pink-800',
        },
        body: {
            '#FEE2E2': 'bg-red-50',
            '#FEF3C7': 'bg-amber-50',
            '#D1FAE5': 'bg-green-50',
            '#DBEAFE': 'bg-blue-100',
            '#E0E7FF': 'bg-indigo-100',
            '#F3E8FF': 'bg-purple-100',
            '#FCE7F3': 'bg-pink-100',
        }
    };

    const headerClass = colorClasses.header[note.color as keyof typeof colorClasses.header] || 'bg-gray-100 text-gray-800';
    const bodyClass = colorClasses.body[note.color as keyof typeof colorClasses.body] || 'bg-gray-50';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                <header className={`p-4 rounded-t-lg flex justify-between items-center flex-shrink-0 ${headerClass}`}>
                    <div>
                        <h2 className="text-lg font-semibold">{note.title || 'Заметка'}</h2>
                        <p className="text-sm">{new Date(note.date).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                    <button onClick={onClose} className="text-current opacity-70 hover:opacity-100" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className={`p-6 flex-grow overflow-y-auto custom-scrollbar ${bodyClass}`}>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {note.text}
                    </p>
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <button onClick={() => onDelete(note)} className="px-4 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-100">Удалить</button>
                    <div className="flex items-center gap-2">
                         <button onClick={() => onCopy(note)} className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-100">Копировать</button>
                         <button onClick={() => onEdit(note)} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Редактировать</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};