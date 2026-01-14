import React, { useState, useEffect } from 'react';
import { Note } from '../../../shared/types';

const getLocalDateParts = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    return { dateString, timeString };
};

const NOTE_COLORS = [
    '#FEE2E2', // red-100
    '#FEF3C7', // amber-100
    '#D1FAE5', // green-100
    '#DBEAFE', // blue-200
    '#E0E7FF', // indigo-200
    '#F3E8FF', // purple-200
    '#FCE7F3', // pink-200
];

export const NoteModal: React.FC<{
    note: Partial<Note> | null;
    onSave: (note: Partial<Note>) => void;
    onClose: () => void;
    isSaving: boolean;
}> = ({ note, onSave, onClose, isSaving }) => {
    const isNew = !note?.id || note.id.startsWith('new-note-');
    const initialDate = new Date(note?.date || Date.now());
    const { dateString, timeString } = getLocalDateParts(initialDate);

    const [title, setTitle] = useState(note?.title || '');
    const [text, setText] = useState(note?.text || '');
    const [color, setColor] = useState(note?.color || NOTE_COLORS[0]);
    const [date, setDate] = useState(dateString);
    const [time, setTime] = useState(timeString);

    useEffect(() => {
        if (note) {
            const newDate = new Date(note.date || Date.now());
            const { dateString, timeString } = getLocalDateParts(newDate);
            setTitle(note.title || '');
            setText(note.text || '');
            setColor(note.color || NOTE_COLORS[0]);
            setDate(dateString);
            setTime(timeString);
        }
    }, [note]);

    const handleSave = () => {
        const combinedDate = new Date(`${date}T${time}:00`);
        onSave({
            ...note,
            title,
            text,
            color,
            date: combinedDate.toISOString(),
        });
    };
    
    if (!note) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">{isNew ? 'Создать заметку' : 'Редактировать заметку'}</h2>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
                        <div className="flex gap-2">
                            <input type="date" value={date} onChange={e => setDate(e.target.value)} disabled={isSaving} className="flex-grow border rounded px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" />
                            <input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={isSaving} className="border rounded px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название (необязательно)</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} disabled={isSaving} className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" placeholder="Введите название..."/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Текст заметки</label>
                        <textarea value={text} onChange={e => setText(e.target.value)} rows={5} disabled={isSaving} className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 custom-scrollbar" placeholder="Введите текст..."/>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Цвет</label>
                        <div className="flex justify-center gap-3">
                            {NOTE_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full transition-transform transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                                    style={{ backgroundColor: c }}
                                    aria-label={`Select color ${c}`}
                                />
                            ))}
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                    <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button 
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !text.trim()} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-wait w-28 flex justify-center items-center"
                    >
                        {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};