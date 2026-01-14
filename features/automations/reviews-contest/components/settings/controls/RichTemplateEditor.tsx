
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Project, GlobalVariableDefinition } from '../../../../../../shared/types';
import { VariablesSelector } from '../../../../../posts/components/VariablesSelector';
import { EmojiPicker } from '../../../../../emoji/components/EmojiPicker';
import * as api from '../../../../../../services/api';

interface RichTemplateEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    rows?: number;
    project: Project;
    specificVariables?: { name: string; value: string; description: string }[];
    helpText?: string; // New prop for explanatory text
}

export const RichTemplateEditor: React.FC<RichTemplateEditorProps> = ({ 
    label, value, onChange, rows = 3, project, specificVariables, helpText 
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showVariables, setShowVariables] = useState(false);
    const [showEmoji, setShowEmoji] = useState(false);
    
    // Состояния для переменных
    const [variables, setVariables] = useState<{ name: string; value: string }[] | null>(null);
    const [globalVariables, setGlobalVariables] = useState<GlobalVariableDefinition[] | null>(null);
    const [isLoadingVars, setIsLoadingVars] = useState(false);
    
    const emojiRef = useRef<HTMLDivElement>(null);

    // Автоматическое изменение высоты
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight + 2}px`;
        }
    };

    // Используем useLayoutEffect для мгновенного обновления при рендере/изменении
    useLayoutEffect(() => {
        adjustHeight();
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmoji(false);
            }
        };
        if (showEmoji) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmoji]);

    const handleInsert = (textToInsert: string) => {
        if (!textareaRef.current) {
            onChange(value + textToInsert);
            return;
        }
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newValue = value.substring(0, start) + textToInsert + value.substring(end);
        onChange(newValue);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
            }
        }, 0);
    };

    const handleToggleVariables = async () => {
        const shouldOpen = !showVariables;
        setShowVariables(shouldOpen);
        setShowEmoji(false);

        if (shouldOpen && !variables) {
            setIsLoadingVars(true);
            try {
                const [projectVars, globalDefs] = await Promise.all([
                    api.getProjectVariables(project.id),
                    api.getAllGlobalVariableDefinitions()
                ]);
                setVariables(projectVars);
                setGlobalVariables(globalDefs);
            } catch (error) {
                console.error("Failed to load variables", error);
            } finally {
                setIsLoadingVars(false);
            }
        }
    };

    return (
        <div className="group">
            <div className="border border-gray-300 rounded-md bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
                <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex items-center gap-1 relative">
                        {/* Specific Variables Buttons */}
                        {specificVariables && specificVariables.length > 0 && (
                            <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
                                {specificVariables.map(v => (
                                    <button
                                        key={v.value}
                                        type="button"
                                        onClick={() => handleInsert(v.value)}
                                        title={`Вставить частную переменную: ${v.description}`}
                                        className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors border border-indigo-200"
                                    >
                                        {v.value}
                                    </button>
                                ))}
                            </div>
                        )}

                        <button 
                            type="button" 
                            onClick={handleToggleVariables}
                            className={`p-1.5 rounded transition-colors ${showVariables ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Переменные проекта"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-1.066 2.573c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <button 
                            type="button" 
                            onClick={() => { setShowEmoji(!showEmoji); setShowVariables(false); }}
                            className={`p-1.5 rounded transition-colors ${showEmoji ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-200'}`}
                            title="Эмодзи"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </button>
                        
                        {showEmoji && (
                            <div ref={emojiRef} className="absolute top-full right-0 mt-1 z-20 shadow-xl">
                                <EmojiPicker projectId={project.id} onSelectEmoji={(char) => { handleInsert(char); setShowEmoji(false); }} />
                            </div>
                        )}
                    </div>
                </div>
                
                {showVariables && (
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                        <VariablesSelector
                            isLoading={isLoadingVars}
                            variables={variables}
                            isLoadingGlobalVariables={isLoadingVars}
                            globalVariables={globalVariables}
                            project={project}
                            onInsert={handleInsert}
                            onEditVariables={() => {}} // Disabled here
                        />
                    </div>
                )}

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    rows={rows}
                    className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent custom-scrollbar rounded-b-md"
                    style={{ resize: 'none', overflow: 'hidden', minHeight: `${rows * 1.5}rem` }}
                    placeholder="Введите текст шаблона..."
                />
            </div>
            {helpText && (
                <p className="text-xs text-gray-500 mt-1">{helpText}</p>
            )}
        </div>
    );
};
