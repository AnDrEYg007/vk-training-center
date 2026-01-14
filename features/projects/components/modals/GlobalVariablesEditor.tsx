import React from 'react';
import { GlobalVariableDefinition, ProjectGlobalVariableValue } from '../../../../shared/types';

interface GlobalVariablesEditorProps {
    definitions: GlobalVariableDefinition[];
    values: ProjectGlobalVariableValue[];
    onDefinitionChange: (defId: string, field: keyof GlobalVariableDefinition, value: string) => void;
    onValueChange: (definitionId: string, value: string) => void;
    onAddDefinition: () => void;
    onRemoveDefinition: (def: GlobalVariableDefinition) => void;
    isSaving: boolean;
    errors: Record<string, { name?: string; key?: string }>; // Новое свойство
}

export const GlobalVariablesEditor: React.FC<GlobalVariablesEditorProps> = ({
    definitions,
    values,
    onDefinitionChange,
    onValueChange,
    onAddDefinition,
    onRemoveDefinition,
    isSaving,
    errors,
}) => {
    const valuesMap = new Map(values.map(v => [v.definition_id, v.value]));
    
    const getInputClasses = (hasError: boolean) => 
        `w-full border rounded px-2 py-1 text-sm disabled:bg-gray-100 ${
            hasError
                ? 'border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500'
                : 'border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500'
        }`;


    return (
        <>
            <p className="text-sm text-gray-500 mb-4">Определите глобальные переменные и их значения для этого проекта. Они будут доступны для подстановки во все посты.</p>
            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar border p-3 rounded-md bg-gray-50">
                {/* Заголовок таблицы */}
                <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-x-2 pb-2 border-b">
                    <label className="text-xs font-semibold text-gray-500">Название</label>
                    <label className="text-xs font-semibold text-gray-500">Ключ плейсхолдера</label>
                    <label className="text-xs font-semibold text-gray-500">Значение (для этого проекта)</label>
                    <div className="w-8"></div>
                </div>

                {definitions.map((def) => {
                    const defErrors = errors[def.id] || {};
                    return (
                    <div key={def.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-start animate-fade-in-up">
                        <div>
                            <input
                                type="text"
                                placeholder="Адрес"
                                value={def.name}
                                onChange={(e) => onDefinitionChange(def.id, 'name', e.target.value)}
                                disabled={isSaving}
                                className={getInputClasses(!!defErrors.name)}
                            />
                            {defErrors.name && <p className="text-xs text-red-600 mt-1">{defErrors.name}</p>}
                        </div>
                         <div>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'{global_'}</span>
                                 <input
                                    type="text"
                                    placeholder="address"
                                    value={def.placeholder_key}
                                    onChange={(e) => onDefinitionChange(def.id, 'placeholder_key', e.target.value.replace(/\s/g, ''))}
                                    disabled={isSaving}
                                    className={`${getInputClasses(!!defErrors.key)} pl-14 pr-2`}
                                />
                                 <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{'}'}</span>
                            </div>
                             {defErrors.key && <p className="text-xs text-red-600 mt-1">{defErrors.key}</p>}
                        </div>
                        <input
                            type="text"
                            placeholder="ул. Ленина, 1"
                            value={valuesMap.get(def.id) || ''}
                            onChange={(e) => onValueChange(def.id, e.target.value)}
                            disabled={isSaving}
                            className={getInputClasses(false)}
                        />
                        <button
                            type="button"
                            onClick={() => onRemoveDefinition(def)}
                            disabled={isSaving}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50 mt-0.5"
                            title="Удалить переменную"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                )})}
                {definitions.length === 0 && (<p className="text-sm text-center text-gray-500 py-4">Глобальных переменных пока нет.</p>)}
            </div>
             <button type="button" onClick={onAddDefinition} disabled={isSaving} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">+ Добавить глобальную переменную</button>
        </>
    );
};