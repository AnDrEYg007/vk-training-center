
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as api from '../../../../services/api';
import { Tag } from '../../../../shared/types';
import { ConfirmUnsavedChangesModal } from '../../../../shared/components/modals/ConfirmUnsavedChangesModal';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

const TAG_COLORS = [
    '#FEE2E2', // red-100
    '#FEF3C7', // amber-100
    '#D1FAE5', // green-100
    '#DBEAFE', // blue-200
    '#E0E7FF', // indigo-200
    '#F3E8FF', // purple-200
    '#FCE7F3', // pink-200
    '#E5E7EB', // gray-200
];

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

export const TagsManagementModal: React.FC<{
    projectId: string;
    onClose: () => void;
    onTagsUpdated: () => void;
}> = ({ projectId, onClose, onTagsUpdated }) => {
    const [initialTags, setInitialTags] = useState<Tag[]>([]);
    const [editedTags, setEditedTags] = useState<Tag[]>([]);
    const [deletedTagIds, setDeletedTagIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRetagging, setIsRetagging] = useState(false);
    const [showUnsavedConfirm, setShowUnsavedConfirm] = useState(false);
    const [deletingTag, setDeletingTag] = useState<Tag | null>(null);

    const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);
    const [colorPickerTarget, setColorPickerTarget] = useState<DOMRect | null>(null);
    const colorPickerButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    const isDirty = useMemo(() => {
        if (deletedTagIds.size > 0) return true;
        if (initialTags.length !== editedTags.length) return true;

        const initialTagsMap = new Map(initialTags.map(t => [t.id, t]));
        
        return editedTags.some(tag => {
            if (tag.id.startsWith('new-')) return true;
            const original = initialTagsMap.get(tag.id);
            return (
                !original ||
                // @ts-ignore
                original.name !== tag.name ||
                // @ts-ignore
                original.keyword !== tag.keyword ||
                // @ts-ignore
                (original.note || '') !== (tag.note || '') ||
                // @ts-ignore
                original.color !== tag.color
            );
        });
    }, [initialTags, editedTags, deletedTagIds]);

    const fetchTags = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedTags = await api.getTags(projectId);
            setInitialTags(fetchedTags);
            setEditedTags(fetchedTags);
            setDeletedTagIds(new Set());
        } catch (error) {
            console.error("Failed to fetch tags", error);
            window.showAppToast?.("Не удалось загрузить теги.", 'error');
        } finally {
            setIsLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const handleFieldChange = (id: string, field: 'name' | 'keyword' | 'note', value: string) => {
        setEditedTags(tags => tags.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const handleColorChange = (id: string, color: string) => {
        setEditedTags(tags => tags.map(t => t.id === id ? { ...t, color } : t));
        setActiveColorPicker(null);
    };

    const handleAddTag = () => {
        const newTag: Tag = {
            id: `new-${Date.now()}`,
            project_id: projectId,
            name: '',
            keyword: '',
            note: '',
            color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
        };
        setEditedTags(tags => [...tags, newTag]);
    };

    const handleDeleteTag = (tag: Tag) => {
        if (tag.id.startsWith('new-')) {
            setEditedTags(tags => tags.filter(t => t.id !== tag.id));
        } else {
            setDeletingTag(tag);
        }
    };

    const confirmDelete = () => {
        if (!deletingTag) return;
        setDeletedTagIds(ids => new Set(ids).add(deletingTag.id));
        setEditedTags(tags => tags.filter(t => t.id !== deletingTag.id));
        setDeletingTag(null);
    };

    const openColorPicker = (tagId: string) => {
        const button = colorPickerButtonRefs.current[tagId];
        if (button) {
            setColorPickerTarget(button.getBoundingClientRect());
            setActiveColorPicker(tagId);
        }
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        const promises: Promise<any>[] = [];

        deletedTagIds.forEach(id => promises.push(api.deleteTag(id)));

        for (const tag of editedTags) {
            const originalTag = initialTags.find(t => t.id === tag.id);

            if (!tag.name.trim() || !tag.keyword.trim()) continue;

            const tagData: Omit<Tag, 'id' | 'project_id'> = { name: tag.name, keyword: tag.keyword, note: tag.note || undefined, color: tag.color };

            if (tag.id.startsWith('new-')) {
                promises.push(api.createTag(projectId, tagData));
            } else if (originalTag) {
                const typedOriginalTag = originalTag as Tag;
                const hasChanged = typedOriginalTag.name !== tag.name ||
                    typedOriginalTag.keyword !== tag.keyword ||
                    (typedOriginalTag.note || '') !== (tag.note || '') ||
                    typedOriginalTag.color !== tag.color;

                if (hasChanged) {
                    promises.push(api.updateTag(tag.id, tagData));
                }
            }
        }

        const results = await Promise.allSettled(promises);
        const failed = results.filter(r => r.status === 'rejected');
        
        if (failed.length > 0) {
            window.showAppToast?.(`Не удалось сохранить ${failed.length} из ${promises.length} изменений.`, 'error');
            console.error("Tag saving errors:", failed.map(f => (f as PromiseRejectedResult).reason));
        }
        
        setIsSaving(false);
        
        if (failed.length === 0) {
            onTagsUpdated();
            onClose();
        } else {
            await fetchTags();
        }
    };

    const handleCloseRequest = () => {
        if (isDirty) {
            setShowUnsavedConfirm(true);
        } else {
            onClose();
        }
    };

    const handleRetagProject = async () => {
        setIsRetagging(true);
        try {
            await api.retagProject(projectId);
            window.showAppToast?.("Процесс перетегирования запущен. Изменения появятся в календаре в течение минуты.", 'info');
            onTagsUpdated();
        } catch (error) {
            console.error("Failed to retag project", error);
            window.showAppToast?.("Не удалось запустить перетегирование.", 'error');
        } finally {
            setIsRetagging(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseRequest}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-semibold text-gray-800">Управление тегами</h2>
                    <button onClick={handleCloseRequest} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40"><div className="loader"></div></div>
                    ) : (
                        <div className="border rounded-lg">
                            <div className="grid grid-cols-[2fr_2fr_3fr_1fr_auto] gap-4 p-3 bg-gray-50 border-b rounded-t-lg">
                                {['Название', 'Ключевое слово', 'Заметка', 'Цвет', ''].map(header => 
                                    <div key={header} className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {header}
                                    </div>
                                )}
                            </div>
                            <div className="divide-y">
                                {editedTags.map((tag) => (
                                    <div key={tag.id} className="grid grid-cols-[2fr_2fr_3fr_1fr_auto] gap-4 items-center p-3 animate-fade-in-up">
                                        <input type="text" value={tag.name} onChange={e => handleFieldChange(tag.id, 'name', e.target.value)} placeholder="Название тега" className="w-full border rounded px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                        <input type="text" value={tag.keyword} onChange={e => handleFieldChange(tag.id, 'keyword', e.target.value)} placeholder="Ключевое слово" className="w-full border rounded px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                        <input type="text" value={tag.note || ''} onChange={e => handleFieldChange(tag.id, 'note', e.target.value)} placeholder="Описание" className="w-full border rounded px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                                        <div className="flex justify-center">
                                            <button
                                                ref={(el) => { colorPickerButtonRefs.current[tag.id] = el; }}
                                                type="button"
                                                onClick={() => openColorPicker(tag.id)}
                                                className="w-6 h-6 rounded-full ring-1 ring-gray-300"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                        </div>
                                        <button onClick={() => handleDeleteTag(tag)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={handleAddTag} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800">+ Добавить тег</button>
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-gray-50 flex-shrink-0">
                    <button onClick={handleRetagProject} disabled={isRetagging || isSaving} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
                         {isRetagging ? 'Обновление...' : 'Обновить теги для всех постов'}
                    </button>
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={handleCloseRequest} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button type="button" onClick={handleSaveChanges} disabled={isSaving || !isDirty} className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400 w-28 flex justify-center items-center">
                            {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                        </button>
                    </div>
                </footer>
                
                {activeColorPicker && <ColorPickerDropdown targetRect={colorPickerTarget} onSelect={color => handleColorChange(activeColorPicker, color)} onClose={() => setActiveColorPicker(null)} />}
                
                {showUnsavedConfirm && <ConfirmUnsavedChangesModal onConfirm={() => { setShowUnsavedConfirm(false); onClose(); }} onCancel={() => setShowUnsavedConfirm(false)} zIndex="z-[60]" />}

                {deletingTag && (
                    <ConfirmationModal
                        title="Подтвердите удаление"
                        message={`Вы уверены, что хотите удалить тег "${deletingTag.name}"? Это действие необратимо.`}
                        onConfirm={confirmDelete}
                        onCancel={() => setDeletingTag(null)}
                        confirmText="Удалить"
                        confirmButtonVariant="danger"
                        zIndex="z-[60]"
                    />
                )}
            </div>
        </div>
    );
};
