import React, { useState, useRef } from 'react';
import { AIGenerator } from '../../../../posts/components/AIGenerator';
import { VariablesSelector } from '../../../../posts/components/VariablesSelector';
import * as api from '../../../../../services/api';

interface DescriptionSectionProps {
    description: string;
    setDescription: (text: string) => void;
    projectId: string;
    onOpenProjectSettings: () => void;
    forceVariablesReload?: boolean;
    hasError?: boolean;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    description,
    setDescription,
    projectId,
    onOpenProjectSettings,
    forceVariablesReload,
    hasError
}) => {
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [showVariables, setShowVariables] = useState(false);
    const [variables, setVariables] = useState<{ name: string; value: string }[] | null>(null);
    const [isLoadingVariables, setIsLoadingVariables] = useState(false);
    const [aiRefreshKey, setAiRefreshKey] = useState(0);

    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    // Эффект для перезагрузки переменных, если они изменились извне
    React.useEffect(() => {
        if (forceVariablesReload && (showVariables || showAIGenerator)) {
             handleReloadVariables();
        }
    }, [forceVariablesReload]);

    const handleInsertText = (textToInsert: string) => {
        if (!descriptionRef.current) {
            setDescription(description + textToInsert);
            return;
        }
        
        const start = descriptionRef.current.selectionStart;
        const end = descriptionRef.current.selectionEnd;
        const newText = description.substring(0, start) + textToInsert + description.substring(end);
        setDescription(newText);
        
        setTimeout(() => {
            if (descriptionRef.current) {
                descriptionRef.current.focus();
                descriptionRef.current.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
            }
        }, 0);
    };

    const handleToggleVariables = async () => {
        const shouldOpen = !showVariables;
        setShowVariables(shouldOpen);

        if (shouldOpen && !variables) {
            setIsLoadingVariables(true);
            try {
                const fetchedVariables = await api.getProjectVariables(projectId);
                setVariables(fetchedVariables);
            } catch (error) {
                console.error("Не удалось загрузить переменные:", error);
            } finally {
                setIsLoadingVariables(false);
            }
        }
    };

    const handleReloadVariables = async () => {
        if (!showVariables) setShowVariables(true);
        setIsLoadingVariables(true);
        try {
            const fetchedVariables = await api.getProjectVariables(projectId);
            setVariables(fetchedVariables);
        } finally {
            setIsLoadingVariables(false);
        }
    };

    const handleAiGenerated = (text: string) => {
        const textToInsert = description.trim().length > 0 ? `\n\n${text}` : text;
        handleInsertText(textToInsert);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Описание <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-1">
                    <button 
                        type="button"
                        onClick={() => setShowAIGenerator(prev => !prev)}
                        className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                        AI-помощник
                    </button>
                    {!showAIGenerator && (
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={handleToggleVariables} className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">Переменные</button>
                            <button type="button" onClick={handleReloadVariables} disabled={isLoadingVariables} title="Обновить переменные" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-wait">
                                {isLoadingVariables ? <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showAIGenerator ? 'max-h-screen opacity-100 mt-1 mb-2' : 'max-h-0 opacity-0'}`}>
                <div className={`${showAIGenerator ? '' : 'hidden'}`}>
                    {/* FIX: Added missing 'postText' prop to AIGenerator. */}
                    <AIGenerator 
                        projectId={projectId}
                        postText={description}
                        onTextGenerated={handleAiGenerated}
                        onEditPresets={() => {}}
                        refreshKey={aiRefreshKey}
                    />
                </div>
            </div>

            <>
                {showAIGenerator && (
                    <div className="flex justify-between items-center mt-4 mb-1">
                        <label className="block text-sm font-medium text-gray-700">Переменные</label>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={handleToggleVariables} className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">Переменные</button>
                            <button type="button" onClick={handleReloadVariables} disabled={isLoadingVariables} title="Обновить переменные" className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-wait">
                                {isLoadingVariables ? <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>}
                            </button>
                        </div>
                    </div>
                )}
                
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showVariables ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                    <div className={`${showVariables ? 'bg-gray-100 border rounded-md p-3' : ''}`}>
                        {showVariables && <VariablesSelector 
                            isLoading={isLoadingVariables} 
                            variables={variables} 
                            isLoadingGlobalVariables={false}
                            globalVariables={null} 
                            project={null} 
                            onInsert={handleInsertText} 
                            onEditVariables={onOpenProjectSettings}
                        />}
                    </div>
                </div>
            </>

            <textarea 
                ref={descriptionRef}
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                rows={6} 
                className={`w-full mt-1 p-2 border rounded-md custom-scrollbar focus:outline-none focus:ring-2 ${hasError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                placeholder="Введите описание товара (минимум 10 символов)..."
            />
        </div>
    );
};