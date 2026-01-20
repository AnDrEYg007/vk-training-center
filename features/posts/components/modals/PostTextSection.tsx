import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Project, GlobalVariableDefinition } from '../../../../shared/types';
import * as api from '../../../../services/api';

import { AIGenerator } from '../AIGenerator';
import { VariablesSelector } from '../VariablesSelector';
import { ProjectSettingsModal, AccordionSectionKey } from '../../../projects/components/modals/ProjectSettingsModal';
import { EmojiPicker } from '../../../emoji/components/EmojiPicker';
import { ChatTurn } from '../../hooks/useAIGenerator';

interface PostTextSectionProps {
    mode: 'view' | 'edit' | 'copy';
    postText: string;
    editedText: string;
    onTextChange: (text: string) => void;
    projectId: string;
    allProjects: Project[];
    onUpdateProject: (updatedProject: Project) => Promise<void>;
    // Новые пропсы для управления
    showAIGenerator: boolean;
    onToggleAIGenerator: () => void;
    showVariables: boolean;
    onToggleVariables: () => void;
    onReloadVariables: () => void;
    variables: { name: string; value: string }[] | null;
    isLoadingVariables: boolean;
    globalVariables: GlobalVariableDefinition[] | null;
    isLoadingGlobalVariables: boolean;
    
    // Props for multi generation and AI variations
    isMultiGenerationMode?: boolean;
    onSelectionChange?: (turn: ChatTurn | null) => void;
    isBulkMode?: boolean;
    isCyclic?: boolean;
    isAiMultiMode?: boolean;
    onToggleAiMultiMode?: (val: boolean) => void;
}

export const PostTextSection: React.FC<PostTextSectionProps> = ({
    mode,
    postText,
    editedText,
    onTextChange,
    projectId,
    allProjects,
    onUpdateProject,
    // Новые пропсы
    showAIGenerator,
    onToggleAIGenerator,
    showVariables,
    onToggleVariables,
    onReloadVariables,
    variables,
    isLoadingVariables,
    globalVariables,
    isLoadingGlobalVariables,
    
    // Optional props for AI features
    isMultiGenerationMode,
    onSelectionChange,
    isAiMultiMode,
    onToggleAiMultiMode
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
    const [settingsInitialSection, setSettingsInitialSection] = useState<AccordionSectionKey | null>(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [aiPresetsRefreshKey, setAiPresetsRefreshKey] = useState(0); // Новый ключ для обновления

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setIsEmojiPickerOpen(false);
            }
        };
        if (isEmojiPickerOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isEmojiPickerOpen]);

    const currentProject = allProjects.find(p => p.id === projectId) || null;
    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        allProjects.forEach(p => { if (p.team) teams.add(p.team); });
        return Array.from(teams).sort();
    }, [allProjects]);
    
    const handleInsertVariable = (value: string) => {
        if (!textareaRef.current) return;
        const { selectionStart, selectionEnd } = textareaRef.current;
        const newText = editedText.substring(0, selectionStart) + value + editedText.substring(selectionEnd);
        onTextChange(newText);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = selectionStart + value.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleInsertEmoji = (emoji: string) => {
        if (!textareaRef.current) return;
        const { selectionStart, selectionEnd } = textareaRef.current;
        const newText = editedText.substring(0, selectionStart) + emoji + editedText.substring(selectionEnd);
        onTextChange(newText);
        
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                const newCursorPos = selectionStart + emoji.length;
                textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const handleOpenProjectSettings = (section: AccordionSectionKey | null) => {
        setSettingsInitialSection(section);
        setIsProjectSettingsOpen(true);
    };

    const handleSaveProjectSettings = async (updatedProject: Project) => {
        if (!currentProject) return;
        try {
            await onUpdateProject(updatedProject);
            setIsProjectSettingsOpen(false);
            // Запрашиваем перезагрузку переменных, если они были открыты
            if (showVariables) {
                onReloadVariables(); 
            }
            // Запускаем обновление шаблонов AI
            setAiPresetsRefreshKey(k => k + 1);
        } catch (error) {
            console.error("Failed to save project settings from post modal", error);
        }
    };

    // Блок управления переменными
    const variablesControls = (
        <div className="flex items-center gap-1">
            <button type="button" onClick={onToggleVariables} className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${showVariables ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}>Переменные</button>
            <button type="button" onClick={onReloadVariables} disabled={isLoadingVariables} title="Обновить переменные" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-wait">
                {isLoadingVariables ? <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
            </button>
            <button type="button" onClick={() => handleOpenProjectSettings('variables')} title="Настроить переменные" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0 3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
        </div>
    );
    
    return (
        <>
            <div className="relative">
                {/* --- ГЛАВНАЯ ПАНЕЛЬ ИНСТРУМЕНТОВ --- */}
                {mode === 'edit' && (
                    <div className="flex justify-end items-center mb-1 gap-2 flex-wrap">
                        <button 
                            type="button" 
                            onClick={onToggleAIGenerator} 
                            className={`px-3 py-1 text-sm font-medium rounded-md border transition-colors ${showAIGenerator ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                        >
                            AI-помощник
                        </button>
                        
                        {/* Показываем управление переменными здесь, ТОЛЬКО если AI-помощник скрыт */}
                        {!showAIGenerator && variablesControls}
                    </div>
                )}

                {/* --- БЛОК AI-ПОМОЩНИКА --- */}
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAIGenerator && mode === 'edit' ? 'max-h-screen opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                    <div className={`${showAIGenerator && mode === 'edit' ? '' : 'hidden'}`}>
                        <AIGenerator 
                            projectId={projectId}
                            postText={editedText}
                            onTextGenerated={(text) => onTextChange(editedText ? `${editedText}\n\n${text}` : text)}
                            onEditPresets={() => handleOpenProjectSettings('ai-presets')}
                            refreshKey={aiPresetsRefreshKey}
                            // Props for multi generation
                            isMultiGenerationMode={isAiMultiMode}
                            onSelectionChange={onSelectionChange}
                        />
                    </div>
                </div>

                {/* --- БЛОК ПЕРЕМЕННЫХ (условное отображение) --- */}
                {mode === 'edit' && (
                    <>
                        {/* Показываем заголовок и кнопки управления переменными здесь, ТОЛЬКО если AI-помощник открыт */}
                        {showAIGenerator && (
                             <div className="flex justify-between items-center mt-4 mb-1">
                                <label className="block text-sm font-medium text-gray-700">Переменные</label>
                                {variablesControls}
                            </div>
                        )}
                        
                        {/* Сам блок с переменными */}
                        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showVariables ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            <div className={`${showVariables ? 'bg-gray-100 border rounded-md p-3' : ''}`}>
                                {showVariables && <VariablesSelector 
                                    isLoading={isLoadingVariables} 
                                    variables={variables} 
                                    isLoadingGlobalVariables={isLoadingGlobalVariables}
                                    globalVariables={globalVariables}
                                    project={currentProject} 
                                    onInsert={handleInsertVariable} 
                                    onEditVariables={() => handleOpenProjectSettings('variables')} 
                                />}
                            </div>
                        </div>
                    </>
                )}


                {/* --- ОСНОВНОЕ ТЕКСТОВОЕ ПОЛЕ --- */}
                {mode === 'edit' ? (
                    <div className="relative mt-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Текст публикации</label>
                        <textarea
                            ref={textareaRef}
                            value={editedText}
                            onChange={e => onTextChange(e.target.value)}
                            rows={8}
                            className="w-full border rounded p-2 pr-10 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 custom-scrollbar"
                            placeholder="Введите текст вашего поста..."
                        />
                        <div className="absolute top-8 right-2">
                            <button
                                type="button"
                                onClick={() => setIsEmojiPickerOpen(prev => !prev)}
                                title="Добавить эмодзи"
                                className="p-1.5 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            {isEmojiPickerOpen && (
                                <div ref={emojiPickerRef} className="absolute top-full right-0 mt-2 z-[51]">
                                    <EmojiPicker
                                        projectId={projectId}
                                        onSelectEmoji={handleInsertEmoji}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Текст публикации</label>
                        <p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-2 rounded-md min-h-[100px]">{postText || <span className="text-gray-400 italic">Текст отсутствует</span>}</p>
                    </>
                )}
            </div>

            {isProjectSettingsOpen && currentProject && (
                <ProjectSettingsModal project={currentProject} uniqueTeams={uniqueTeams} onClose={() => { setIsProjectSettingsOpen(false); setSettingsInitialSection(null); }} onSave={handleSaveProjectSettings} initialOpenSection={settingsInitialSection} zIndex="z-[60]" />
            )}
        </>
    );
};