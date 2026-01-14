import React, { useState, useEffect } from 'react';
import { AIGenerator } from '../../../posts/components/AIGenerator';
import { VariablesSelector } from '../../../posts/components/VariablesSelector';
import * as api from '../../../../services/api';
import { GlobalVariableDefinition } from '../../../../shared/types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface DescriptionEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialText: string;
    onSave: (text: string) => void;
    projectId: string;
    initialTab?: 'editor' | 'ai' | 'variables';
}

export const DescriptionEditorModal: React.FC<DescriptionEditorModalProps> = ({
    isOpen,
    onClose,
    initialText,
    onSave,
    projectId,
    initialTab = 'editor',
}) => {
    const [text, setText] = useState(initialText);
    const [activeTab, setActiveTab] = useState<'editor' | 'ai' | 'variables'>(initialTab);
    
    // Состояния для переменных
    const [variables, setVariables] = useState<{ name: string; value: string }[] | null>(null);
    const [isLoadingVariables, setIsLoadingVariables] = useState(false);
    const [globalVariables, setGlobalVariables] = useState<GlobalVariableDefinition[] | null>(null);
    const [isLoadingGlobalVariables, setIsLoadingGlobalVariables] = useState(false);
    const [aiRefreshKey, setAiRefreshKey] = useState(0);

    // Состояние для подтверждения закрытия
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (isOpen) {
            setText(initialText);
            setActiveTab(initialTab);
            setShowCloseConfirm(false);
        }
    }, [isOpen, initialText, initialTab]);

    const loadVariables = async () => {
        setIsLoadingVariables(true);
        setIsLoadingGlobalVariables(true);
        try {
            const [projectVars, globalDefs] = await Promise.all([
                api.getProjectVariables(projectId),
                api.getAllGlobalVariableDefinitions()
            ]);
            setVariables(projectVars);
            setGlobalVariables(globalDefs);
        } catch (error) {
            console.error("Failed to load variables", error);
        } finally {
            setIsLoadingVariables(false);
            setIsLoadingGlobalVariables(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'variables' && !variables) {
            loadVariables();
        }
    }, [activeTab, variables]);

    const handleInsert = (value: string) => {
        if (!textareaRef.current) {
            setText(prev => prev + value);
            return;
        }
        
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newText = text.substring(0, start) + value + text.substring(end);
        setText(newText);
        
        // Возвращаем фокус и курсор
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.focus();
                textareaRef.current.setSelectionRange(start + value.length, start + value.length);
            }
        }, 0);
    };

    const handleSave = () => {
        onSave(text);
        onClose();
    };

    const handleCloseRequest = () => {
        if (text !== initialText) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" onClick={handleCloseRequest}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up" onClick={e => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h3 className="text-lg font-semibold text-gray-800">Редактор описания</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setActiveTab('editor')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'editor' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Редактор
                            </button>
                            <button 
                                onClick={() => setActiveTab('ai')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'ai' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                AI-помощник
                            </button>
                            <button 
                                onClick={() => setActiveTab('variables')}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === 'variables' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                Переменные
                            </button>
                        </div>
                    </header>
                    
                    <main className="p-0 flex-grow overflow-y-auto custom-scrollbar flex flex-col">
                        {activeTab === 'ai' && (
                            <div className="p-4 border-b bg-indigo-50">
                                {/* FIX: Added missing 'postText' prop to AIGenerator. */}
                                <AIGenerator 
                                    projectId={projectId}
                                    postText={text}
                                    onTextGenerated={(genText) => setText(prev => prev ? `${prev}\n\n${genText}` : genText)}
                                    onEditPresets={() => {}} // В этом контексте редактирование пресетов отключено для простоты
                                    refreshKey={aiRefreshKey}
                                />
                            </div>
                        )}

                        {activeTab === 'variables' && (
                            <div className="p-4 border-b bg-gray-50">
                                <VariablesSelector
                                    isLoading={isLoadingVariables}
                                    variables={variables}
                                    isLoadingGlobalVariables={isLoadingGlobalVariables}
                                    globalVariables={globalVariables}
                                    project={null} // Проект передается как null, т.к. нам нужны только переменные, а базовые поля проекта для товаров менее актуальны
                                    onInsert={handleInsert}
                                    onEditVariables={() => {}} // Редактирование переменных отсюда недоступно
                                />
                            </div>
                        )}

                        <div className="p-4 flex-grow flex flex-col">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Текст описания</label>
                            <textarea 
                                ref={textareaRef}
                                value={text} 
                                onChange={e => setText(e.target.value)} 
                                className="w-full flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar resize-none min-h-[200px]"
                                placeholder="Введите описание товара..."
                            />
                        </div>
                    </main>
                    
                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                        <button onClick={handleCloseRequest} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button onClick={handleSave} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Применить</button>
                    </footer>
                </div>
            </div>

            {showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть без сохранения?"
                    message="Вы уверены, что хотите закрыть редактор? Все изменения в описании будут потеряны."
                    onConfirm={() => {
                        setShowCloseConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setShowCloseConfirm(false)}
                    confirmText="Да, закрыть"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[70]" // Выше, чем само модальное окно (60)
                />
            )}
        </>
    );
};