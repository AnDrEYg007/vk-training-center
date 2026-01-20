import React, { useState } from 'react';
import { AiPromptPreset } from '../../../../shared/types';

interface SystemPromptControlsProps {
    useCustomSystemPrompt: boolean;
    setUseCustomSystemPrompt: (value: boolean) => void;
    handleClearHistory: () => void;
    chatHistoryLength: number;
    // Props for custom prompt section
    onEditPresets: () => void;
    isLoadingPresets: boolean;
    aiPresets: AiPromptPreset[];
    selectedPreset: AiPromptPreset | null;
    handleSelectPreset: (preset: AiPromptPreset) => void;
    customSystemPrompt: string;
    setCustomSystemPrompt: (value: string) => void;
    isGenerating: boolean;
    canSave: boolean;
    handleSavePreset: () => void;
    // Props for default prompt section
    isLoadingDefaultPrompt: boolean;
    defaultSystemPrompt: string;
    // Новые пропсы для инлайн-создания
    isCreatingPreset: boolean;
    newPresetName: string;
    setNewPresetName: (value: string) => void;
    handleCreatePreset: () => void;
    handleCancelCreatePreset: () => void;
    handleInitiateSaveAsNew: () => void;
    onToggleExpand: (expanded: boolean) => void; // Новый проп
}

export const SystemPromptControls: React.FC<SystemPromptControlsProps> = ({
    useCustomSystemPrompt, setUseCustomSystemPrompt, handleClearHistory, chatHistoryLength,
    onEditPresets, isLoadingPresets, aiPresets, selectedPreset, handleSelectPreset,
    customSystemPrompt, setCustomSystemPrompt, isGenerating, canSave, handleSavePreset,
    isLoadingDefaultPrompt, defaultSystemPrompt,
    isCreatingPreset, newPresetName, setNewPresetName, handleCreatePreset, handleCancelCreatePreset,
    handleInitiateSaveAsNew, onToggleExpand,
}) => {
    // Состояние сворачивания для кастомного промпта убрано, теперь он всегда развернут
    const [isDefaultPromptExpanded, setIsDefaultPromptExpanded] = useState(false);

    const defaultPromptIsLong = defaultSystemPrompt.length > 100;

    return (
        <div className="space-y-2 flex-shrink-0">
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={() => setUseCustomSystemPrompt(!useCustomSystemPrompt)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            useCustomSystemPrompt ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${ useCustomSystemPrompt ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <label onClick={() => setUseCustomSystemPrompt(!useCustomSystemPrompt)} className="text-xs font-medium text-gray-700 cursor-pointer">
                        Использовать свою системную инструкцию
                    </label>
                </div>
                <button
                    type="button"
                    onClick={handleClearHistory}
                    disabled={chatHistoryLength === 0}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Очистить историю
                </button>
            </div>
            {useCustomSystemPrompt ? (
                <div className="animate-fade-in-up space-y-2">
                    <div>
                         <div className="flex items-center gap-2 mb-1">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Шаблоны</label>
                        </div>
                        {isLoadingPresets ? (
                            <div className="flex items-center text-sm text-gray-500"><div className="loader h-4 w-4 mr-2"></div> Загрузка...</div>
                        ) : (
                            <div className="flex flex-wrap gap-1.5 items-center">
                                {aiPresets.map(preset => (
                                    <button
                                        key={preset.id}
                                        type="button"
                                        onClick={() => handleSelectPreset(preset)}
                                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors bg-gray-200 text-gray-700 hover:bg-indigo-200 hover:text-indigo-800 ${
                                            selectedPreset?.id === preset.id ? 'ring-2 ring-indigo-500' : ''
                                        }`}
                                        title={preset.prompt}
                                    >
                                        {preset.name}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={onEditPresets}
                                    title="Добавить или изменить шаблоны"
                                    className="px-2.5 py-1 text-xs font-medium border border-dashed rounded-full transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50"
                                >
                                    + Добавить
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                            Ваша инструкция
                        </label>
                        <div>
                            <textarea
                                value={customSystemPrompt}
                                onChange={(e) => setCustomSystemPrompt(e.target.value)}
                                rows={10}
                                placeholder="Например: 'Ты — SMM-менеджер, который пишет тексты...'"
                                className="w-full border rounded p-2 text-xs border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar resize-y"
                                disabled={isGenerating}
                            />
                        </div>
                         <div className="mt-2 flex justify-end">
                            {isCreatingPreset ? (
                                <div className="flex items-center gap-2 w-full animate-fade-in-up">
                                    <input
                                        type="text"
                                        placeholder="Название нового шаблона..."
                                        value={newPresetName}
                                        onChange={(e) => setNewPresetName(e.target.value)}
                                        className="flex-grow border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        autoFocus
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleCreatePreset(); } }}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleCreatePreset}
                                        disabled={!newPresetName.trim()}
                                        className="px-3 py-1.5 text-sm font-semibold rounded-md transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
                                    >
                                        Ок
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={handleCancelCreatePreset} 
                                        className="p-1.5 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" 
                                        title="Отмена"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {selectedPreset && canSave && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={handleInitiateSaveAsNew}
                                                disabled={isGenerating}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                            >
                                                Сохранить как новый
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleSavePreset}
                                                disabled={isGenerating}
                                                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                            >
                                                Обновить шаблон
                                            </button>
                                        </>
                                    )}
                                    {!selectedPreset && canSave && (
                                        <button
                                            type="button"
                                            onClick={handleSavePreset}
                                            disabled={isGenerating}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                                        >
                                            Сохранить как шаблон
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className="p-2 border rounded bg-gray-100/70 border-gray-300"
                    onClick={() => defaultPromptIsLong && setIsDefaultPromptExpanded(prev => !prev)}
                >
                     <p 
                        className={`text-xs text-gray-600 whitespace-pre-wrap overflow-hidden transition-[max-height] duration-300 ease-in-out ${defaultPromptIsLong ? 'cursor-pointer' : ''} ${isDefaultPromptExpanded ? 'max-h-48' : 'max-h-8'}`}
                    >
                        {isLoadingDefaultPrompt ? 'Загрузка...' : defaultSystemPrompt}
                    </p>
                </div>
            )}
        </div>
    );
};