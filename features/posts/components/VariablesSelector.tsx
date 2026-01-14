
import React from 'react';
import { Project, GlobalVariableDefinition } from '../../../../shared/types';

interface VariablesSelectorProps {
    isLoading: boolean;
    variables: { name: string; value: string }[] | null;
    isLoadingGlobalVariables: boolean;
    globalVariables: GlobalVariableDefinition[] | null;
    project: Project | null;
    onInsert: (value: string) => void;
    onEditVariables: () => void;
}

export const VariablesSelector: React.FC<VariablesSelectorProps> = ({ 
    isLoading, 
    variables,
    isLoadingGlobalVariables,
    globalVariables,
    project, 
    onInsert, 
    onEditVariables 
}) => {
    
    const baseVariables = project ? [
        { name: 'Ссылка на сообщество', value: project.vkLink || '' },
        { name: 'Ссылка на сообщения', value: `https://vk.me/${project.vkGroupShortName}` },
        { name: 'Название сообщества', value: project.vkGroupName || '' },
        { name: 'Упоминание сообщества', value: `@${project.vkGroupShortName} (${project.vkGroupName})` },
    ] : [];

    const baseConstructions = [
        { name: '[ | ]', value: '[ССЫЛКА|ОПИСАНИЕ]' },
        { name: '@ ()', value: '@idЦИФРЫ_АЙДИ (ТЕКСТ_ССЫЛКИ)' },
    ];

    const VariableButton: React.FC<{name: string, value: string, title?: string}> = ({name, value, title: customTitle}) => {
        const isEmpty = !value || value.trim() === '';
        
        const buttonClasses = `
            px-3 py-1.5 text-xs font-medium border rounded-full transition-colors
            ${isEmpty 
                ? 'border-dashed border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200' 
                : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-indigo-500'
            }
        `;

        return (
            <button
                type="button"
                onClick={() => onInsert(value)}
                title={customTitle ?? (isEmpty ? 'Переменная не содержит значения' : `Вставить: ${value}`)}
                className={buttonClasses}
            >
                {name}
            </button>
        );
    };
    
    return (
        <div className="space-y-4">
            {/* We explicitly check for null here because passing null means "hide this section entirely" */}
            {globalVariables !== null && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Глобальные переменные</h4>
                    {isLoadingGlobalVariables && (
                        <div className="flex items-center py-2">
                            <div className="loader h-4 w-4"></div>
                        </div>
                    )}
                    {!isLoadingGlobalVariables && globalVariables && (
                        <div className="flex flex-wrap gap-2">
                            {globalVariables.map(gVar => (
                                <VariableButton 
                                    key={gVar.id} 
                                    name={gVar.name} 
                                    value={`{global_${gVar.placeholder_key}}`} 
                                    title={`Вставить плейсхолдер: {global_${gVar.placeholder_key}}`}
                                />
                            ))}
                             {globalVariables.length === 0 && <p className="text-xs text-gray-500">Глобальные переменные не настроены.</p>}
                        </div>
                    )}
                </div>
            )}

            {project && (
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Базовые переменные</h4>
                    <div className="flex flex-wrap gap-2">
                        {baseVariables.map(v => v.value ? <VariableButton key={v.name} name={v.name} value={v.value} /> : null)}
                    </div>
                </div>
            )}
            
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Конструкции</h4>
                <div className="flex flex-wrap gap-2">
                    {baseConstructions.map(c => <VariableButton key={c.name} name={c.name} value={c.value} />)}
                </div>
            </div>

            <div>
                 <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Переменные проекта</h4>
                {isLoading && (
                    <div className="flex items-center py-2">
                        <div className="loader h-4 w-4"></div>
                    </div>
                )}
                {!isLoading && variables && (
                    <div className="flex flex-wrap gap-2">
                        {variables.map(variable => <VariableButton key={variable.name} name={variable.name} value={variable.value} />)}
                        <button
                            type="button"
                            onClick={onEditVariables}
                            title="Добавить или изменить переменные проекта"
                            className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50"
                        >
                            + Добавить
                        </button>
                    </div>
                )}
                 {!isLoading && !variables && (
                     <p className="text-sm text-center text-gray-500 py-1">Нажмите кнопку "Переменные" еще раз, чтобы загрузить.</p>
                 )}
            </div>
        </div>
    );
};
