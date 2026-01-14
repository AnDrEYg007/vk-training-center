import React, { useRef, useEffect } from 'react';
import { AiPromptPreset } from '../../../../shared/types';

interface AiPromptPresetsEditorProps {
    presets: AiPromptPreset[];
    onPresetChange: (id: string, field: 'name' | 'prompt', value: string) => void;
    onAddPreset: () => void;
    onRemovePreset: (preset: AiPromptPreset) => void;
    isSaving: boolean;
}

export const AiPromptPresetsEditor: React.FC<AiPromptPresetsEditorProps> = ({
    presets,
    onPresetChange,
    onAddPreset,
    onRemovePreset,
    isSaving,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const prevPresetsLength = useRef(presets.length);

    useEffect(() => {
        // Прокручиваем контейнер вниз при добавлении нового шаблона
        if (presets.length > prevPresetsLength.current && scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
        prevPresetsLength.current = presets.length;
    }, [presets]);

    return (
        <>
            <p className="text-sm text-gray-500 mb-4">Сохраняйте и переиспользуйте удачные системные инструкции для AI-помощника.</p>
            <div ref={scrollContainerRef} className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar border p-3 rounded-md bg-gray-50">
                {presets.map((preset) => (
                    <div 
                        key={preset.id}
                        className="flex items-start gap-2 animate-fade-in-up"
                    >
                        <div className="flex-1 space-y-1">
                            <input 
                                type="text" 
                                placeholder="Название шаблона" 
                                value={preset.name} 
                                onChange={(e) => onPresetChange(preset.id, 'name', e.target.value)} 
                                disabled={isSaving} 
                                className="w-full border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100" 
                            />
                            <textarea 
                                placeholder="Текст системной инструкции..." 
                                value={preset.prompt} 
                                onChange={(e) => onPresetChange(preset.id, 'prompt', e.target.value)} 
                                disabled={isSaving} 
                                rows={3}
                                className="w-full border rounded px-3 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 custom-scrollbar" 
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={() => onRemovePreset(preset)} 
                            disabled={isSaving} 
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 disabled:opacity-50 mt-1" 
                            title="Удалить шаблон"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                ))}
                {presets.length === 0 && (<p className="text-sm text-center text-gray-500 py-2">Шаблонов пока нет.</p>)}
            </div>
            <button type="button" onClick={onAddPreset} disabled={isSaving} className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50">+ Добавить шаблон</button>
        </>
    );
};