
import React, { useState, useMemo, useEffect } from 'react';
import { Project, ProjectContextField, ProjectContextValue } from '../../../../shared/types';

export type MassAiMode = 'all' | 'base' | 'company' | 'products' | 'tone';

interface MassAiAutofillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (projectIds: string[], mode: MassAiMode) => void;
    projects: Project[];
    fields: ProjectContextField[];
    values: ProjectContextValue[];
    editedValues: Record<string, string>;
}

export const MassAiAutofillModal: React.FC<MassAiAutofillModalProps> = ({
    isOpen,
    onClose,
    onStart,
    projects,
    fields,
    values,
    editedValues,
}) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [mode, setMode] = useState<MassAiMode>('all');

    // Вычисляем проекты, у которых есть пустые поля
    const candidateProjects = useMemo(() => {
        const candidates: { project: Project; emptyCount: number }[] = [];

        projects.forEach(project => {
            let emptyFields = 0;
            
            // Фильтруем поля, доступные этому проекту
            const availableFields = fields.filter(f => 
                f.is_global || (f.project_ids && f.project_ids.includes(project.id))
            );

            availableFields.forEach(field => {
                // Проверяем, есть ли значение в editedValues (приоритет) или в values
                const editKey = `${project.id}_${field.id}`;
                const hasEdits = editKey in editedValues && editedValues[editKey].trim() !== '';
                
                if (hasEdits) return; // Уже заполнено (не сохранено)

                const storedValue = values.find(v => v.project_id === project.id && v.field_id === field.id)?.value;
                const hasStored = storedValue && storedValue.trim() !== '';

                if (!hasStored) {
                    emptyFields++;
                }
            });

            if (emptyFields > 0) {
                candidates.push({ project, emptyCount: emptyFields });
            }
        });

        return candidates;
    }, [projects, fields, values, editedValues]);

    // При открытии (или изменении списка кандидатов) выбираем всех
    useEffect(() => {
        if (candidateProjects.length > 0 && selectedIds.size === 0) {
            setSelectedIds(new Set(candidateProjects.map(c => c.project.id)));
        }
    }, [candidateProjects.length]);

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleAll = () => {
        if (selectedIds.size === candidateProjects.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(candidateProjects.map(c => c.project.id)));
        }
    };
    
    const ModeOption: React.FC<{ value: MassAiMode; label: string; description: string }> = ({ value, label, description }) => (
        <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${mode === value ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'bg-white border-gray-200 hover:border-indigo-300'}`}>
            <input 
                type="radio" 
                name="aiMode" 
                value={value} 
                checked={mode === value} 
                onChange={() => setMode(value)}
                className="mt-0.5 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
            />
            <div className="ml-3">
                <span className={`block text-sm font-medium ${mode === value ? 'text-indigo-900' : 'text-gray-900'}`}>{label}</span>
                <span className={`block text-xs ${mode === value ? 'text-indigo-700' : 'text-gray-500'}`}>{description}</span>
            </div>
        </label>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Массовое заполнение через AI</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Выберите, какие данные генерировать для выбранных проектов.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-0 overflow-auto custom-scrollbar flex-grow bg-gray-50">
                    <div className="p-4 bg-white border-b border-gray-200 space-y-2">
                         <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Что заполнить?</p>
                         <div className="space-y-2">
                            <ModeOption value="all" label="Все пустые поля" description="Попытаться заполнить все пропущенные данные (рекомендуется)." />
                            <div className="grid grid-cols-2 gap-2">
                                <ModeOption value="base" label="Базовая информация" description="Адреса, телефоны, ссылки." />
                                <ModeOption value="tone" label="Тональность" description="Стиль общения (Tone of Voice)." />
                                <ModeOption value="products" label="Товары и услуги" description="Описание ассортимента." />
                                <ModeOption value="company" label="О компании" description="Миссия и описание бизнеса." />
                            </div>
                         </div>
                    </div>
                
                    {candidateProjects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Все поля заполнены! Нет проектов для обработки.
                        </div>
                    ) : (
                        <>
                            <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Проекты ({selectedIds.size})
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 w-10 bg-gray-100">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedIds.size > 0 && selectedIds.size === candidateProjects.length}
                                                onChange={toggleAll}
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-4 py-3 bg-gray-100">Проект</th>
                                        <th className="px-4 py-3 w-24 bg-gray-100 text-right">Пустых полей</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {candidateProjects.map(({ project, emptyCount }) => (
                                        <tr 
                                            key={project.id} 
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                            onClick={() => toggleSelection(project.id)}
                                        >
                                            <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedIds.has(project.id)}
                                                    onChange={() => toggleSelection(project.id)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {project.name}
                                            </td>
                                            <td className="px-4 py-3 text-right text-amber-600 font-medium">
                                                {emptyCount}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </main>

                <footer className="p-4 border-t bg-white flex justify-end gap-3 rounded-b-lg flex-shrink-0">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={() => onStart(Array.from(selectedIds), mode)} 
                        disabled={selectedIds.size === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Запустить ({selectedIds.size})
                    </button>
                </footer>
            </div>
        </div>
    );
};
