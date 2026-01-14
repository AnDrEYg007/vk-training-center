import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from '../../../../shared/types';

const TAG_COLORS = [
    '#FEE2E2', '#FEF3C7', '#D1FAE5', '#DBEAFE',
    '#E0E7FF', '#F3E8FF', '#FCE7F3', '#E5E7EB',
];

// Color Picker Dropdown (copied from TagsManagementModal)
const ColorPickerDropdown: React.FC<{
    onSelect: (color: string) => void;
    onClose: () => void;
    targetRect: DOMRect | null;
}> = ({ onSelect, onClose, targetRect }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!targetRect) return null;

    return createPortal(
        <div
            ref={dropdownRef}
            className="fixed z-[60] p-2 bg-white rounded-lg shadow-xl border grid grid-cols-4 gap-2 animate-fade-in-up"
            style={{
                top: `${targetRect.bottom + 4}px`,
                left: `${targetRect.left}px`,
            }}
        >
            {TAG_COLORS.map(color => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onSelect(color)}
                    className="w-7 h-7 rounded-full transition-transform transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                />
            ))}
        </div>,
        document.body
    );
};


interface TagsEditorProps {
    tags: Tag[];
    onTagChange: (id: string, field: 'name' | 'keyword' | 'note' | 'color', value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: Tag) => void;
    isSaving: boolean;
}

export const TagsEditor: React.FC<TagsEditorProps> = ({
    tags,
    onTagChange,
    onAddTag,
    onRemoveTag,
    isSaving,
}) => {
    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
    const [colorPickerTarget, setColorPickerTarget] = useState<DOMRect | null>(null);
    const colorPickerButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevTagsLength = useRef(tags.length);

    useEffect(() => {
        // Если был добавлен новый тег, прокручиваем контейнер вниз
        if (tags.length > prevTagsLength.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
        // Обновляем предыдущее значение длины для следующего рендера
        prevTagsLength.current = tags.length;
    }, [tags]);

    const openColorPicker = (tagId: string) => {
        const button = colorPickerButtonRefs.current[tagId];
        if (button) {
            setColorPickerTarget(button.getBoundingClientRect());
            setActiveColorPicker(tagId);
        }
    };

    const handleColorSelect = (tagId: string, color: string) => {
        onTagChange(tagId, 'color', color);
        setActiveColorPicker(null);
    }

    return (
        <>
            <p className="text-sm text-gray-500 mb-4">Теги для автоматической категоризации постов по ключевым словам.</p>
            <div ref={scrollContainerRef} className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar border p-3 rounded-md bg-gray-50">
                <div className="grid grid-cols-[2fr_2fr_3fr_1fr_auto] gap-x-2 gap-y-1 pb-2 border-b">
                    {['Название', 'Ключевое слово', 'Заметка', 'Цвет', ''].map(header => 
                        <div key={header} className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                        </div>
                    )}
                </div>
                {tags.map((tag) => (
                    <div 
                        key={tag.id}
                        className="grid grid-cols-[2fr_2fr_3fr_1fr_auto] gap-2 items-center animate-fade-in-up"
                    >
                        <input type="text" placeholder="Название" value={tag.name} onChange={(e) => onTagChange(tag.id, 'name', e.target.value)} disabled={isSaving} className="w-full border rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <input type="text" placeholder="Ключевое слово" value={tag.keyword} onChange={(e) => onTagChange(tag.id, 'keyword', e.target.value)} disabled={isSaving} className="w-full border rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <input type="text" placeholder="Описание" value={tag.note || ''} onChange={(e) => onTagChange(tag.id, 'note', e.target.value)} disabled={isSaving} className="w-full border rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <div className="flex justify-center">
                            <button
                                ref={(el) => { colorPickerButtonRefs.current[tag.id] = el; }}
                                type="button"
                                onClick={() => openColorPicker(tag.id)}
                                disabled={isSaving}
                                className="w-6 h-6 rounded-full ring-1 ring-gray-300"
                                style={{ backgroundColor: tag.color }}
                            />
                        </div>
                        <button type="button" onClick={() => onRemoveTag(tag)} disabled={isSaving} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50" title="Удалить тег">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
                {tags.length === 0 && (<p className="text-sm text-center text-gray-500 py-2">Тегов пока нет.</p>)}
            </div>
            <button type="button" onClick={onAddTag} disabled={isSaving} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">+ Добавить тег</button>
            {activeColorPicker && <ColorPickerDropdown targetRect={colorPickerTarget} onSelect={color => handleColorSelect(activeColorPicker, color)} onClose={() => setActiveColorPicker(null)} />}
        </>
    );
};