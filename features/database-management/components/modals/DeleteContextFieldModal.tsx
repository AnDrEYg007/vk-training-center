
import React from 'react';
import { Project, ProjectContextField, ProjectContextValue } from '../../../../shared/types';

interface DeleteContextFieldModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    field: ProjectContextField;
    affectedValues: ProjectContextValue[];
    projects: Project[];
    isDeleting: boolean;
}

export const DeleteContextFieldModal: React.FC<DeleteContextFieldModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    field,
    affectedValues,
    projects,
    isDeleting
}) => {
    if (!isOpen) return null;

    // Фильтруем только те значения, которые не пусты
    const nonEmptyValues = affectedValues.filter(v => v.value && v.value.trim() !== '');

    // Создаем карту проектов для быстрого поиска имени
    const projectMap = new Map(projects.map(p => [p.id, p.name]));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Удалить столбец?</h2>
                </header>
                
                <main className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Вы собираетесь удалить столбец <span className="font-bold text-gray-900">"{field.name}"</span>.
                        </p>
                        <p className="text-sm text-red-600 mt-2 font-medium">
                            Это действие необратимо. Столбец будет удален из структуры, а данные потеряны.
                        </p>
                    </div>

                    {nonEmptyValues.length > 0 ? (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                                Будет удалено значений: {nonEmptyValues.length}
                            </p>
                            <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                {nonEmptyValues.map(val => (
                                    <li key={val.id} className="text-xs border-b border-gray-200 pb-1 last:border-0">
                                        <span className="font-medium text-gray-700 block truncate">
                                            {projectMap.get(val.project_id) || 'Неизвестный проект'}
                                        </span>
                                        <span className="text-gray-500 truncate block" title={val.value || ''}>
                                            "{val.value}"
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-center">
                            <p className="text-sm text-green-700">
                                Этот столбец не содержит данных. Удаление безопасно.
                            </p>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button 
                        onClick={onClose} 
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 flex items-center"
                    >
                        {isDeleting ? <div className="loader border-white border-t-transparent h-4 w-4 mr-2"></div> : null}
                        Удалить
                    </button>
                </footer>
            </div>
        </div>
    );
};
