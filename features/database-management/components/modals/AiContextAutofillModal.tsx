
import React, { useState, useMemo, useEffect } from 'react';
import { ProjectContextValue, ProjectContextField, Project } from '../../../../shared/types';

interface AiContextAutofillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (suggestions: ProjectContextValue[]) => void;
    suggestions: ProjectContextValue[];
    currentValues: ProjectContextValue[];
    fields: ProjectContextField[];
    project: Project;
}

export const AiContextAutofillModal: React.FC<AiContextAutofillModalProps> = ({
    isOpen,
    onClose,
    onApply,
    suggestions,
    currentValues,
    fields,
    project
}) => {
    const [selectedFieldIds, setSelectedFieldIds] = useState<Set<string>>(new Set());

    // При открытии выбираем все предложения, которые отличаются от текущих
    useEffect(() => {
        if (isOpen && suggestions.length > 0) {
            const toSelect = new Set<string>();
            suggestions.forEach(s => {
                const current = currentValues.find(v => v.field_id === s.field_id);
                const currentValue = current?.value || '';
                // Предлагаем выбрать, если новое значение не пустое и отличается от старого
                if (s.value && s.value !== currentValue) {
                    toSelect.add(s.field_id);
                }
            });
            setSelectedFieldIds(toSelect);
        }
    }, [isOpen, suggestions, currentValues]);

    const toggleSelection = (fieldId: string) => {
        setSelectedFieldIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fieldId)) newSet.delete(fieldId);
            else newSet.add(fieldId);
            return newSet;
        });
    };

    const toggleAll = () => {
        if (selectedFieldIds.size === suggestions.length) {
            setSelectedFieldIds(new Set());
        } else {
            setSelectedFieldIds(new Set(suggestions.map(s => s.field_id)));
        }
    };

    const handleApply = () => {
        const suggestionsToApply = suggestions.filter(s => selectedFieldIds.has(s.field_id));
        onApply(suggestionsToApply);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">AI-предложения для "{project.name}"</h2>
                        <p className="text-sm text-gray-500">Выберите данные, которые нужно применить. Старые значения будут перезаписаны.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-0 overflow-auto custom-scrollbar bg-gray-50 flex-grow">
                    {suggestions.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            AI не нашел информации для заполнения полей. Попробуйте заполнить их вручную.
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-100 border-b sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 w-10 bg-gray-100">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedFieldIds.size > 0 && selectedFieldIds.size === suggestions.length}
                                            onChange={toggleAll}
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </th>
                                    <th className="px-4 py-3 w-1/4 bg-gray-100">Поле</th>
                                    <th className="px-4 py-3 w-1/3 bg-gray-100">Текущее значение</th>
                                    <th className="px-4 py-3 w-1/3 bg-gray-100">Предложение AI</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {suggestions.map((suggestion) => {
                                    const field = fields.find(f => f.id === suggestion.field_id);
                                    const currentVal = currentValues.find(v => v.field_id === suggestion.field_id)?.value || '';
                                    const isSelected = selectedFieldIds.has(suggestion.field_id);
                                    const isDifferent = suggestion.value !== currentVal;

                                    return (
                                        <tr key={suggestion.field_id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50/50' : ''}`} onClick={() => toggleSelection(suggestion.field_id)}>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => toggleSelection(suggestion.field_id)}
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-700">
                                                {field?.name || 'Неизвестное поле'}
                                            </td>
                                            <td className="px-4 py-3 text-gray-500 break-words max-w-xs">
                                                {currentVal || <span className="text-gray-300 italic">Пусто</span>}
                                            </td>
                                            <td className="px-4 py-3 break-words max-w-xs">
                                                <span className={isDifferent ? 'text-green-700 font-medium' : 'text-gray-600'}>
                                                    {suggestion.value}
                                                </span>
                                                {isDifferent && currentVal && (
                                                    <div className="text-[10px] text-green-600 mt-1">Будет обновлено</div>
                                                )}
                                                {isDifferent && !currentVal && (
                                                    <div className="text-[10px] text-blue-600 mt-1">Новое значение</div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </main>

                <footer className="p-4 border-t bg-white flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                        Отмена
                    </button>
                    <button 
                        onClick={handleApply} 
                        disabled={selectedFieldIds.size === 0}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                    >
                        Применить ({selectedFieldIds.size})
                    </button>
                </footer>
            </div>
        </div>
    );
};
