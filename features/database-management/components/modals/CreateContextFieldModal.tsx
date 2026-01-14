
import React, { useState, useMemo, useEffect } from 'react';
import { Project, ProjectContextField } from '../../../../shared/types';

interface ContextFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string, description: string, isGlobal: boolean, projectIds: string[] | null) => void;
    projects: Project[];
    initialData?: ProjectContextField | null;
}

export const ContextFieldModal: React.FC<ContextFieldModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    projects,
    initialData
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [targetType, setTargetType] = useState<'all' | 'specific'>('all');
    const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    // Заполнение данными при редактировании
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name);
                setDescription(initialData.description || '');
                setTargetType(initialData.is_global ? 'all' : 'specific');
                setSelectedProjectIds(new Set(initialData.project_ids || []));
            } else {
                // Reset
                setName('');
                setDescription('');
                setTargetType('all');
                setSelectedProjectIds(new Set());
            }
        }
    }, [isOpen, initialData]);

    const filteredProjects = useMemo(() => {
        if (!searchQuery) return projects;
        return projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [projects, searchQuery]);

    const toggleProject = (id: string) => {
        setSelectedProjectIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const handleSelectAll = () => {
        setSelectedProjectIds(new Set(projects.map(p => p.id)));
    };

    const handleDeselectAll = () => {
        setSelectedProjectIds(new Set());
    };

    const handleSubmit = () => {
        if (!name.trim()) return;
        const isGlobal = targetType === 'all';
        const projectIds = targetType === 'specific' ? Array.from(selectedProjectIds) : null;
        onConfirm(name, description, isGlobal, projectIds);
        onClose();
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">{initialData ? 'Редактировать столбец' : 'Добавить новый столбец'}</h2>
                    <p className="text-sm text-gray-500 mt-1">{initialData ? 'Изменение настроек поля контекста.' : 'Создание поля контекста для AI.'}</p>
                </header>
                
                <main className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название столбца <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Например: Тональность бренда"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Описание (для AI)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 custom-scrollbar resize-y min-h-[3rem]"
                            placeholder="Как нейросеть должна использовать это поле?"
                            rows={2}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Применимость</label>
                        <div className="flex rounded-md p-1 bg-gray-100 gap-1">
                            <button
                                type="button"
                                onClick={() => setTargetType('all')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${targetType === 'all' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Для всех проектов
                            </button>
                            <button
                                type="button"
                                onClick={() => setTargetType('specific')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${targetType === 'specific' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Для конкретных
                            </button>
                        </div>
                    </div>

                    {targetType === 'specific' && (
                        <div className="border border-gray-200 rounded-md p-3 bg-gray-50 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-2">
                                <input
                                    type="text"
                                    placeholder="Поиск проекта..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 w-1/2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                                <div className="text-xs space-x-2 text-indigo-600">
                                    <button onClick={handleSelectAll} className="hover:underline">Все</button>
                                    <button onClick={handleDeselectAll} className="hover:underline">Сброс</button>
                                </div>
                            </div>
                            <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1">
                                {filteredProjects.map(p => (
                                    <label key={p.id} className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedProjectIds.has(p.id)}
                                            onChange={() => toggleProject(p.id)}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="text-sm text-gray-700 truncate">{p.name}</span>
                                    </label>
                                ))}
                                {filteredProjects.length === 0 && <p className="text-xs text-gray-500 text-center py-2">Ничего не найдено</p>}
                            </div>
                            <p className="text-[10px] text-gray-500 mt-2">
                                * Колонка будет доступна только для выбранных проектов.
                            </p>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={!name.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                        {initialData ? 'Сохранить' : 'Создать'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
