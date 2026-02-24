import React, { useState } from 'react';

// =====================================================================
// Константы: 7 цветов заметок (из реального NoteCard.tsx)
// =====================================================================
export const NOTE_COLORS = [
    { hex: '#FEE2E2', name: 'Красный', bg: 'bg-red-100', border: 'border-red-200', text: 'text-red-800', headerBg: 'bg-red-200', bodyBg: 'bg-red-50' },
    { hex: '#FEF3C7', name: 'Янтарный', bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-800', headerBg: 'bg-amber-200', bodyBg: 'bg-amber-50' },
    { hex: '#D1FAE5', name: 'Зелёный', bg: 'bg-green-100', border: 'border-green-200', text: 'text-green-800', headerBg: 'bg-green-200', bodyBg: 'bg-green-50' },
    { hex: '#DBEAFE', name: 'Синий', bg: 'bg-blue-200', border: 'border-blue-300', text: 'text-blue-800', headerBg: 'bg-blue-300', bodyBg: 'bg-blue-100' },
    { hex: '#E0E7FF', name: 'Индиго', bg: 'bg-indigo-200', border: 'border-indigo-300', text: 'text-indigo-800', headerBg: 'bg-indigo-300', bodyBg: 'bg-indigo-100' },
    { hex: '#F3E8FF', name: 'Фиолетовый', bg: 'bg-purple-200', border: 'border-purple-300', text: 'text-purple-800', headerBg: 'bg-purple-300', bodyBg: 'bg-purple-100' },
    { hex: '#FCE7F3', name: 'Розовый', bg: 'bg-pink-200', border: 'border-pink-300', text: 'text-pink-800', headerBg: 'bg-pink-300', bodyBg: 'bg-pink-50' }
];

// =====================================================================
// MockNoteCard — упрощённая карточка заметки
// =====================================================================
interface MockNoteCardProps {
    time: string;
    title?: string;
    text: string;
    color: string; // HEX
    expanded?: boolean;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
}

export const MockNoteCard: React.FC<MockNoteCardProps> = ({ 
    time, 
    title, 
    text, 
    color, 
    expanded = true,
    showActions = true,
    onEdit,
    onDelete,
    onCopy
}) => {
    const colorData = NOTE_COLORS.find(c => c.hex === color) || NOTE_COLORS[0];
    
    if (!expanded) {
        // Свёрнутый вид
        return (
            <div className={`${colorData.bg} ${colorData.border} ${colorData.text} border-2 rounded-lg p-2 cursor-move transition-all hover:shadow-sm`}>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{time}</span>
                    {title && <span className="text-xs truncate flex-1">{title}</span>}
                </div>
            </div>
        );
    }
    
    // Развёрнутый вид
    return (
        <div className={`${colorData.bg} ${colorData.border} ${colorData.text} border-2 rounded-lg p-3 cursor-move transition-all hover:shadow-md animate-fade-in-up`}>
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium">{time}</span>
                {showActions && (
                    <div className="flex gap-1">
                        <button onClick={onCopy} className="p-1 hover:bg-white/50 rounded transition-colors" title="Копировать">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>
                        <button onClick={onEdit} className="p-1 hover:bg-white/50 rounded transition-colors" title="Редактировать">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={onDelete} className="p-1 hover:bg-white/50 rounded transition-colors" title="Удалить">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            {title && <p className="font-semibold text-sm mb-1">{title}</p>}
            <p className="text-xs whitespace-pre-wrap break-words">{text}</p>
        </div>
    );
};

// =====================================================================
// MockNoteModal — форма создания/редактирования
// =====================================================================
interface MockNoteModalProps {
    isNew?: boolean;
    onClose: () => void;
}

export const MockNoteModal: React.FC<MockNoteModalProps> = ({ isNew = true, onClose }) => {
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0].hex);
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl animate-scale-in">
                <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {isNew ? 'Создать заметку' : 'Редактировать заметку'}
                    </h3>
                </div>
                
                <div className="p-4 space-y-4">
                    {/* Дата и время */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Дата</label>
                            <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" defaultValue="2026-02-15" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Время</label>
                            <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" defaultValue="14:00" />
                        </div>
                    </div>
                    
                    {/* Название */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Название (необязательно)</label>
                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Введите название..." />
                    </div>
                    
                    {/* Текст */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Текст заметки *</label>
                        <textarea rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" placeholder="Введите текст..." defaultValue="Позвонить клиенту по проекту" />
                    </div>
                    
                    {/* Цвет */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">Цвет</label>
                        <div className="flex gap-2">
                            {NOTE_COLORS.map(color => (
                                <button
                                    key={color.hex}
                                    onClick={() => setSelectedColor(color.hex)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        selectedColor === color.hex ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="p-4 border-t border-gray-200 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md transition-colors">
                        Отмена
                    </button>
                    <button className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// MockNotePreview — просмотр заметки
// =====================================================================
interface MockNotePreviewProps {
    title?: string;
    text: string;
    color: string;
    date: string;
    onClose: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    onCopy?: () => void;
}

export const MockNotePreview: React.FC<MockNotePreviewProps> = ({ 
    title, 
    text, 
    color, 
    date, 
    onClose,
    onEdit,
    onDelete,
    onCopy
}) => {
    const colorData = NOTE_COLORS.find(c => c.hex === color) || NOTE_COLORS[0];
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg max-w-md w-full mx-4 shadow-xl animate-scale-in overflow-hidden">
                {/* Header с цветом */}
                <div className={`${colorData.headerBg} ${colorData.text} p-4 border-b-2 ${colorData.border}`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">{title || 'Заметка'}</h3>
                            <p className="text-xs mt-1 opacity-80">{date}</p>
                        </div>
                        <button onClick={onClose} className="p-1 hover:bg-white/30 rounded transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                
                {/* Body с текстом */}
                <div className={`${colorData.bodyBg} ${colorData.text} p-4 max-h-[60vh] overflow-y-auto custom-scrollbar`}>
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{text}</p>
                </div>
                
                {/* Footer с кнопками */}
                <div className="p-4 border-t border-gray-200 flex gap-3 justify-between">
                    <button onClick={onDelete} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        Удалить
                    </button>
                    <div className="flex gap-2">
                        <button onClick={onCopy} className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                            Копировать
                        </button>
                        <button onClick={onEdit} className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md transition-colors">
                            Редактировать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// ColorPaletteDemo — интерактивная палитра
// =====================================================================
export const ColorPaletteDemo: React.FC = () => {
    const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0]);
    
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {NOTE_COLORS.map(color => (
                    <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            selectedColor.hex === color.hex 
                                ? 'border-indigo-600 bg-indigo-50 scale-105' 
                                : 'border-gray-200 hover:border-gray-300 hover:scale-102'
                        }`}
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-gray-300" style={{ backgroundColor: color.hex }} />
                        <span className="text-xs font-medium text-gray-700">{color.name}</span>
                        <code className="text-[10px] text-gray-500">{color.hex}</code>
                    </button>
                ))}
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Выбранный цвет: {selectedColor.name}</p>
                <MockNoteCard
                    time="14:00"
                    title="Пример заметки"
                    text="Так выглядит заметка с этим цветом"
                    color={selectedColor.hex}
                    expanded={true}
                    showActions={false}
                />
            </div>
        </div>
    );
};

// =====================================================================
// NoteFormDemo — интерактивная форма
// =====================================================================
export const NoteFormDemo: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div>
            <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
                Открыть форму создания
            </button>
            
            {showModal && <MockNoteModal isNew={true} onClose={() => setShowModal(false)} />}
        </div>
    );
};

// =====================================================================
// NotePreviewDemo — интерактивный просмотр
// =====================================================================
export const NotePreviewDemo: React.FC = () => {
    const [showPreview, setShowPreview] = useState(false);
    
    return (
        <div className="space-y-3">
            <p className="text-sm text-gray-600">Кликните на заметку, чтобы открыть просмотр:</p>
            <div onClick={() => setShowPreview(true)}>
                <MockNoteCard
                    time="14:00"
                    title="Встреча с командой"
                    text="Обсудить планы на следующую неделю и распределить задачи между участниками проекта"
                    color="#D1FAE5"
                    expanded={true}
                    showActions={true}
                />
            </div>
            
            {showPreview && (
                <MockNotePreview
                    title="Встреча с командой"
                    text="Обсудить планы на следующую неделю и распределить задачи между участниками проекта"
                    color="#D1FAE5"
                    date="15 февраля 2026, 14:00"
                    onClose={() => setShowPreview(false)}
                    onEdit={() => alert('Редактирование')}
                    onDelete={() => alert('Удаление')}
                    onCopy={() => alert('Копирование')}
                />
            )}
        </div>
    );
};
