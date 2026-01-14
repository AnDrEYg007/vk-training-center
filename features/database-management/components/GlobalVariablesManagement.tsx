import React, { useState, useEffect, useCallback } from 'react';
import { GlobalVariableDefinition } from '../../../shared/types';
import * as api from '../../../services/api';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';

const DefinitionsTable: React.FC<{
    definitions: GlobalVariableDefinition[];
    onDefinitionChange: (defId: string, field: keyof GlobalVariableDefinition, value: any) => void;
    onRemoveDefinition: (defId: string) => void;
    errors: Record<string, { name?: string; key?: string }>; // Новое свойство для ошибок
}> = ({ definitions, onDefinitionChange, onRemoveDefinition, errors }) => {
    
    const getInputClasses = (hasError: boolean) => 
        `w-full p-1 border rounded-md focus:outline-none text-sm bg-white ${
            hasError
                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
        }`;
    
    return (
         <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Название</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Ключ плейсхолдера</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">Заметка (описание)</th>
                        <th scope="col" className="w-12"></th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {definitions.map((def, index) => {
                        const defErrors = errors[def.id] || {};
                        return (
                        <tr key={def.id} className="border-b border-gray-50 last:border-b-0 opacity-0 animate-fade-in-up" style={{ animationDelay: `${index * 20}ms` }}>
                            <td className="px-4 py-2 align-top">
                                <input type="text" value={def.name} onChange={(e) => onDefinitionChange(def.id, 'name', e.target.value)} className={getInputClasses(!!defErrors.name)} placeholder="Адрес"/>
                                {defErrors.name && <p className="text-xs text-red-600 mt-1">{defErrors.name}</p>}
                            </td>
                            <td className="px-4 py-2 align-top">
                                <input type="text" value={def.placeholder_key} onChange={(e) => onDefinitionChange(def.id, 'placeholder_key', e.target.value)} className={getInputClasses(!!defErrors.key)} placeholder="address"/>
                                {defErrors.key && <p className="text-xs text-red-600 mt-1">{defErrors.key}</p>}
                            </td>
                             <td className="px-4 py-2 align-top">
                                <input type="text" value={def.note || ''} onChange={(e) => onDefinitionChange(def.id, 'note', e.target.value)} className={getInputClasses(false)} placeholder="Например, юридический адрес"/>
                            </td>
                             <td className="px-4 py-2 text-right align-top">
                                <button onClick={() => onRemoveDefinition(def.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100" title="Удалить определение">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
};

export const GlobalVariablesManagement: React.FC<{ onGoBack: () => void; }> = ({ onGoBack }) => {
    const [initialDefinitions, setInitialDefinitions] = useState<GlobalVariableDefinition[]>([]);
    const [definitions, setDefinitions] = useState<GlobalVariableDefinition[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ deletedDefs: GlobalVariableDefinition[]; onConfirm: () => void; } | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, { name?: string; key?: string }>>({});

    // Валидация при изменении
    useEffect(() => {
        const errors: Record<string, { name?: string; key?: string }> = {};
        const nameCounts: Record<string, number> = {};
        const keyCounts: Record<string, number> = {};

        definitions.forEach(def => {
            const name = def.name.trim().toLowerCase();
            const key = def.placeholder_key.trim().toLowerCase();
            if (name) nameCounts[name] = (nameCounts[name] || 0) + 1;
            if (key) keyCounts[key] = (keyCounts[key] || 0) + 1;
        });

        definitions.forEach(def => {
            const name = def.name.trim().toLowerCase();
            const key = def.placeholder_key.trim().toLowerCase();
            let hasError = false;

            if (name && nameCounts[name] > 1) {
                if (!errors[def.id]) errors[def.id] = {};
                errors[def.id].name = "Это название уже используется.";
                hasError = true;
            }
            if (key && keyCounts[key] > 1) {
                if (!errors[def.id]) errors[def.id] = {};
                errors[def.id].key = "Этот ключ уже используется.";
                hasError = true;
            }
        });
        setValidationErrors(errors);
    }, [definitions]);


    const fetchDefinitions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const allDefinitions = await api.getAllGlobalVariableDefinitions();
            setInitialDefinitions(allDefinitions); // Сохраняем исходное состояние
            setDefinitions(allDefinitions);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Не удалось загрузить определения";
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDefinitions();
    }, [fetchDefinitions]);

    const handleDefinitionChange = (defId: string, field: keyof GlobalVariableDefinition, value: any) => {
        setDefinitions(currentDefs => currentDefs.map(d => d.id === defId ? { ...d, [field]: value } : d));
    };

    const handleRemoveDefinition = (defId: string) => {
        setDefinitions(currentDefs => currentDefs.filter(d => d.id !== defId));
    };

    const handleAddDefinition = () => {
        const newDef: GlobalVariableDefinition = {
            id: `new-${uuidv4()}`,
            name: '',
            placeholder_key: '',
            note: '',
        };
        setDefinitions(currentDefs => [...currentDefs, newDef]);
    };

    const executeSave = async () => {
        setDeleteConfirmation(null);
        setIsSaving(true);
        try {
            for (const def of definitions) {
                if (!def.name.trim() || !def.placeholder_key.trim()) {
                     throw new Error('Поля "Название" и "Ключ плейсхолдера" должны быть заполнены для всех переменных.');
                }
                if (/\s/.test(def.placeholder_key.trim())) {
                     throw new Error(`Ключ плейсхолдера "${def.placeholder_key}" не должен содержать пробелов.`);
                }
            }
            await api.updateAllGlobalVariableDefinitions(definitions);
            window.showAppToast?.("Глобальные переменные успешно сохранены!", 'success');
            await fetchDefinitions();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Произошла ошибка';
            window.showAppToast?.(`Не удалось сохранить: ${msg}`, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSaveChanges = async () => {
        if (Object.keys(validationErrors).length > 0) {
            window.showAppToast?.("Пожалуйста, исправьте ошибки дублирования перед сохранением.", 'warning');
            return;
        }

        const initialIds = new Set(initialDefinitions.map(d => d.id));
        const currentIds = new Set(definitions.map(d => d.id));
        const deletedIds = [...initialIds].filter(id => !currentIds.has(id));
        const deletedDefs = initialDefinitions.filter(d => deletedIds.includes(d.id));

        if (deletedDefs.length > 0) {
            setDeleteConfirmation({
                deletedDefs,
                onConfirm: executeSave,
            });
        } else {
            await executeSave();
        }
    };
    
    const isSaveDisabled = isSaving || Object.keys(validationErrors).length > 0;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="flex-shrink-0 bg-white shadow-sm z-10">
                 <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-gray-800">Управление глобальными переменными</h1>
                    <p className="text-sm text-gray-500">Создание и редактирование "типов" переменных, доступных во всех проектах.</p>
                </div>
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <button onClick={onGoBack} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Назад к управлению
                    </button>
                    <div className="flex items-center gap-4">
                        <button onClick={handleAddDefinition} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 border border-indigo-600 hover:bg-indigo-50 disabled:opacity-50">
                            + Добавить переменную
                        </button>
                        <button 
                            onClick={handleSaveChanges} 
                            disabled={isSaveDisabled}
                            title={isSaveDisabled ? "Исправьте ошибки перед сохранением" : "Сохранить все изменения"}
                            className="px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 flex justify-center items-center whitespace-nowrap"
                        >
                            {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Сохранить'}
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-grow p-4 overflow-auto custom-scrollbar">
                {error ? (
                    <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>
                ) : (
                    <DefinitionsTable definitions={definitions} onDefinitionChange={handleDefinitionChange} onRemoveDefinition={handleRemoveDefinition} errors={validationErrors} />
                )}
            </main>

            {deleteConfirmation && (
                <ConfirmationModal
                    title="Подтвердите удаление"
                    message={`Вы собираетесь удалить переменную(ы): '${deleteConfirmation.deletedDefs.map(d => d.name).join(', ')}'.\n\nОни очистятся во всех проектах, и во всех системных постах будут пустые значения при публикации. Вы уверены?`}
                    onConfirm={deleteConfirmation.onConfirm}
                    onCancel={() => setDeleteConfirmation(null)}
                    confirmText="Да, удалить"
                    cancelText="Отмена"
                    isConfirming={isSaving}
                    confirmButtonVariant="danger"
                />
            )}
        </div>
    );
};