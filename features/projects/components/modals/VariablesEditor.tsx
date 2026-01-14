import React, { useRef, useEffect } from 'react';
import { VariableItem } from '../../utils/variableUtils';

interface VariablesEditorProps {
    variables: VariableItem[];
    onVariableChange: (id: string, field: 'name' | 'value', value: string) => void;
    onAddVariable: () => void;
    onRemoveVariable: (id: string) => void;
    onAiSetup: () => void;
    isAiRunning: boolean;
    isSaving: boolean;
    aiSuggestedVarIds: Set<string>;
}

export const VariablesEditor: React.FC<VariablesEditorProps> = ({
    variables,
    onVariableChange,
    onAddVariable,
    onRemoveVariable,
    onAiSetup,
    isAiRunning,
    isSaving,
    aiSuggestedVarIds,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevVariablesLength = useRef(variables.length);

    useEffect(() => {
        // Если была добавлена новая переменная, прокручиваем контейнер вниз
        if (variables.length > prevVariablesLength.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
        // Обновляем предыдущее значение длины для следующего рендера
        prevVariablesLength.current = variables.length;
    }, [variables]);

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">Переменные для быстрой вставки в текст поста.</p>
                <button
                    type="button"
                    onClick={onAiSetup}
                    disabled={isAiRunning || isSaving}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-wait"
                >
                    {isAiRunning ? (
                        <div className="loader h-4 w-4 border-t-indigo-500"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    )}
                    <span>Умная настройка</span>
                </button>
            </div>
            <div ref={scrollContainerRef} className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar border p-3 rounded-md bg-gray-50">
                {variables.map((variable) => {
                    const isAiSuggested = aiSuggestedVarIds.has(variable.id);
                    return (
                        <div 
                            key={variable.id}
                            className={`relative flex items-center gap-2 animate-fade-in-up p-1 rounded-md transition-all ${isAiSuggested ? 'ring-2 ring-indigo-300 bg-white' : ''}`}
                            title={isAiSuggested ? "Это значение предложено или заполнено AI" : undefined}
                        >
                            {isAiSuggested && (
                                <div className="absolute -top-1.5 -left-1.5 text-indigo-500 bg-white rounded-full p-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                            )}
                            <input type="text" placeholder="Название" value={variable.name} onChange={(e) => onVariableChange(variable.id, 'name', e.target.value)} disabled={isSaving || isAiRunning} className="flex-1 w-1/3 border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" />
                            <input type="text" placeholder="Значение" value={variable.value} onChange={(e) => onVariableChange(variable.id, 'value', e.target.value)} disabled={isSaving || isAiRunning} className="flex-1 w-2/3 border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" />
                            <button type="button" onClick={() => onRemoveVariable(variable.id)} disabled={isSaving || isAiRunning} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50" title="Удалить переменную">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    );
                })}
                {variables.length === 0 && (<p className="text-sm text-center text-gray-500 py-2">Переменных пока нет.</p>)}
            </div>
            <button type="button" onClick={onAddVariable} disabled={isSaving || isAiRunning} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">+ Добавить переменную</button>
        </>
    );
};