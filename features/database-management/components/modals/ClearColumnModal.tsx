
import React, { useState } from 'react';
import { Project, ProjectContextField } from '../../../../shared/types';

interface ClearColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (projectIds: string[]) => void;
    field: ProjectContextField;
    projects: Project[]; // Currently filtered projects
}

export const ClearColumnModal: React.FC<ClearColumnModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    field,
    projects,
}) => {
    // Изначально выбираем все проекты
    const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set(projects.map(p => p.id)));

    const toggleProject = (id: string) => {
        setSelectedProjectIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleAll = () => {
        if (selectedProjectIds.size === projects.length) {
            setSelectedProjectIds(new Set());
        } else {
            setSelectedProjectIds(new Set(projects.map(p => p.id)));
        }
    };

    const handleConfirm = () => {
        onConfirm(Array.from(selectedProjectIds));
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Очистка столбца</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Поле: <span className="font-medium text-gray-900">{field.name}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Выберите проекты, для которых нужно очистить это поле. Данные удалятся только локально до сохранения.</p>
                </header>

                <div 
                    className="p-2 border-b bg-gray-50 flex items-center cursor-pointer select-none"
                    onClick={toggleAll}
                >
                    <div className="flex items-center px-2 py-1 text-sm text-indigo-600 font-medium hover:text-indigo-800">
                        <input 
                            type="checkbox" 
                            checked={selectedProjectIds.size > 0 && selectedProjectIds.size === projects.length}
                            onChange={toggleAll}
                            onClick={(e) => e.stopPropagation()}
                            className="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                        />
                        {selectedProjectIds.size === projects.length ? 'Снять выделение' : 'Выбрать все'}
                    </div>
                    <span className="ml-auto text-xs text-gray-500 px-2">Выбрано: {selectedProjectIds.size}</span>
                </div>

                <main className="p-0 overflow-auto custom-scrollbar flex-grow bg-white">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">Нет проектов для отображения.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {projects.map(project => (
                                <div 
                                    key={project.id} 
                                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => toggleProject(project.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedProjectIds.has(project.id)}
                                        onChange={() => toggleProject(project.id)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none"
                                    />
                                    <div className="ml-3 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 truncate">{project.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={selectedProjectIds.size === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Очистить ({selectedProjectIds.size})
                    </button>
                </footer>
            </div>
        </div>
    );
};
