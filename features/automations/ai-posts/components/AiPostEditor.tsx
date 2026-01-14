
import React, { useState, useMemo } from 'react';
import { Project } from '../../../../shared/types';
import { useAiPostForm } from '../hooks/useAiPostForm';
import { useProjects } from '../../../../contexts/ProjectsContext';

// UI Components
import { SystemPromptControls } from '../../../posts/components/ai/SystemPromptControls';
import { ChatHistory } from '../../../posts/components/ai/ChatHistory';
import { ContextSelector } from '../../../posts/components/ai/ContextSelector';
import { PostCreationOptions } from '../../../posts/components/modals/PostCreationOptions';
import { PostMediaSection } from '../../../posts/components/modals/PostMediaSection';
import { CustomDatePicker } from '../../../../shared/components/pickers/CustomDatePicker';
import { CustomTimePicker } from '../../../../shared/components/pickers/CustomTimePicker';
// FIX: Corrected import path for ProjectSettingsModal
import { ProjectSettingsModal } from '../../../projects/components/modals/ProjectSettingsModal';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface AiPostEditorProps {
    projectId: string;
    project: Project;
    onCancel: () => void;
    // Данные и методы из хука useAiPostForm
    formData: ReturnType<typeof useAiPostForm>;
}

export const AiPostEditor: React.FC<AiPostEditorProps> = ({ 
    projectId, 
    project,
    onCancel, 
    formData 
}) => {
    const { handleUpdateProjectSettings } = useProjects();
    const [isProjectSettingsOpen, setIsProjectSettingsOpen] = useState(false);
    
    // Деструктуризация данных формы
    const { 
        formState, formSetters, ai, handleSavePost 
    } = formData;

    const uniqueTeams = useMemo(() => {
        return project.team ? [project.team] : [];
    }, [project]);

    const handleSaveSettings = async (updatedProject: Project) => {
        await handleUpdateProjectSettings(updatedProject);
        setIsProjectSettingsOpen(false);
        formSetters.setRefreshPresetsKey((prev: number) => prev + 1);
    };

    // Общий класс для кнопок-переключателей (Segmented Control)
    const toggleButtonClass = (isActive: boolean) => `
        flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500
        ${isActive 
            ? 'bg-white shadow text-indigo-700 ring-1 ring-black/5' 
            : 'text-gray-600 hover:bg-gray-200'
        }
    `;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm flex-shrink-0">
                <div>
                    <h2 className="text-lg font-bold text-indigo-900">
                        {formState.currentPostId ? 'Редактирование AI-поста' : 'Создание Автоматического AI-поста'}
                    </h2>
                    <p className="text-xs text-indigo-700">Настройте и протестируйте шаблон для циклической генерации контента.</p>
                </div>
                <div className="flex gap-3">
                        <button onClick={onCancel} disabled={formState.isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">Отмена</button>
                        <button onClick={handleSavePost} disabled={formState.isSaving || formState.isUploading || !formState.selectedAiTurn} className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 flex items-center shadow-sm">
                        {formState.isSaving ? <div className="loader h-4 w-4 border-2 border-white border-t-transparent mr-2"></div> : null}
                        {formState.currentPostId ? 'Сохранить изменения' : 'Запустить автоматизацию'}
                    </button>
                </div>
            </header>
            
            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden h-full min-h-0">
                {/* ЛЕВАЯ КОЛОНКА: Настройки */}
                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1 min-w-0 h-full">
                    
                    {/* 1. Основные настройки */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">1. Основные настройки</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Название автоматизации <span className="text-red-500">*</span></label>
                                <input 
                                    type="text" 
                                    value={formState.automationName} 
                                    onChange={e => formSetters.setAutomationName(e.target.value)}
                                    placeholder="Например: Посты про меню" 
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (для себя)</label>
                                <input 
                                    type="text" 
                                    value={formState.automationDescription} 
                                    onChange={e => formSetters.setAutomationDescription(e.target.value)}
                                    placeholder="Краткое описание механики..." 
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200">
                                <span className="text-sm font-medium text-gray-700">Статус активности</span>
                                <button
                                    type="button"
                                    onClick={() => formSetters.setIsActive(!formState.isActive)}
                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formState.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                                >
                                    <span
                                        aria-hidden="true"
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formState.isActive ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </section>
                    
                    {/* 2. Настройка AI */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">2. Настройка AI</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-6">
                            <SystemPromptControls 
                                {...ai.state} 
                                {...ai.actions} 
                                onEditPresets={() => setIsProjectSettingsOpen(true)} 
                                onToggleExpand={() => {}} 
                                chatHistoryLength={ai.state.chatHistory.length} 
                            />
                            <div className="border-t border-gray-100"></div>
                            <ContextSelector 
                                {...ai.state} 
                                onToggle={ai.actions.toggleContextPanel}
                                onSelectProduct={ai.actions.selectProduct}
                                onToggleProductField={ai.actions.toggleProductField}
                                onToggleCompanyField={ai.actions.toggleCompanyField}
                                onSetAllCompanyFields={ai.actions.setAllCompanyFields}
                                isOpen={ai.state.isContextPanelOpen}
                                disabled={ai.state.isGenerating}
                                isLoadingItems={ai.state.isLoadingMarketItems} 
                            />
                            <div className="border-t border-gray-100"></div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Задача (промпт)</label>
                                <textarea 
                                    value={ai.state.userPrompt} 
                                    onChange={(e) => ai.actions.setUserPrompt(e.target.value)} 
                                    rows={4} 
                                    placeholder="Напиши пост про..." 
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm custom-scrollbar bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none" 
                                />
                                <button 
                                    onClick={() => ai.actions.handleGenerateText(undefined, undefined, false)} 
                                    disabled={ai.state.isGenerating || !ai.state.userPrompt.trim()} 
                                    className="mt-3 w-full px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center font-medium shadow-sm transition-all active:scale-[0.98]"
                                >
                                    {ai.state.isGenerating ? <div className="loader h-4 w-4 border-2 border-white border-t-transparent mr-2"></div> : null}
                                    Сгенерировать вариант (Тест)
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Контент Поста */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">3. Контент Поста</h3>
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Текст первого поста (Результат)</label>
                                    <textarea 
                                        value={formState.generatedText} 
                                        onChange={(e) => formSetters.setGeneratedText(e.target.value)} 
                                        rows={6} 
                                        className="w-full p-3 border border-gray-300 rounded-md text-sm custom-scrollbar bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none" 
                                        placeholder="Здесь появится сгенерированный текст..." 
                                    />
                            </div>
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Медиа (постоянный пул)</label>
                                <PostMediaSection 
                                    mode="edit" 
                                    projectId={projectId} 
                                    editedImages={formState.images} 
                                    onImagesChange={formSetters.setImages} 
                                    onUploadStateChange={formSetters.setIsUploading} 
                                    postAttachments={[]} 
                                    editedAttachments={formState.attachments} 
                                    onAttachmentsChange={formSetters.setAttachments} 
                                    collapsible={true} // Активируем компактный режим с оверлеем-счетчиком
                                />

                                {/* НОВЫЕ НАСТРОЙКИ МЕДИА (Стилизованные кнопки) */}
                                {formState.images.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-4 animate-fade-in-up">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Режим прикрепления</label>
                                            <div className="flex rounded-md p-1 bg-gray-100 gap-1 overflow-x-auto custom-scrollbar">
                                                <button
                                                    type="button"
                                                    onClick={() => formSetters.setMediaMode('all')}
                                                    className={toggleButtonClass(formState.mediaMode === 'all')}
                                                >
                                                    Прикрепить все ({formState.images.length})
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => formSetters.setMediaMode('subset')}
                                                    className={toggleButtonClass(formState.mediaMode === 'subset')}
                                                >
                                                    Выбрать часть (Х из списка)
                                                </button>
                                            </div>
                                            <div className="mt-2 text-xs text-gray-600 bg-blue-50 border border-blue-100 p-2 rounded-md">
                                                {formState.mediaMode === 'all' 
                                                    ? '📌 Все загруженные изображения будут прикрепляться к каждому сгенерированному посту.'
                                                    : '✂️ Система будет брать из списка только часть изображений для каждого поста.'}
                                            </div>
                                        </div>

                                        {formState.mediaMode === 'subset' && (
                                            <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-3 animate-fade-in-up">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-700 font-medium">Количество (X):</span>
                                                    <input 
                                                        type="number" 
                                                        min={1} 
                                                        max={Math.min(10, formState.images.length)}
                                                        value={formState.mediaSubsetCount}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            // Разрешаем очистку поля
                                                            if (val === '') {
                                                                formSetters.setMediaSubsetCount('');
                                                                return;
                                                            }
                                                            const num = parseInt(val, 10);
                                                            if (isNaN(num)) return;
                                                            
                                                            // Ограничиваем только максимум, чтобы можно было вводить
                                                            const maxAllowed = Math.min(10, formState.images.length);
                                                            
                                                            if (num > maxAllowed) {
                                                                formSetters.setMediaSubsetCount(maxAllowed);
                                                            } else {
                                                                formSetters.setMediaSubsetCount(num);
                                                            }
                                                        }}
                                                        onBlur={() => {
                                                            // Валидация при потере фокуса (минимум 1, не пусто)
                                                            let val = Number(formState.mediaSubsetCount);
                                                            if (!val || val < 1) val = 1;
                                                            const maxAllowed = Math.min(10, formState.images.length);
                                                            if (val > maxAllowed) val = maxAllowed;
                                                            formSetters.setMediaSubsetCount(val);
                                                        }}
                                                        className="w-16 p-1 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm no-spinners"
                                                    />
                                                    <span className="text-xs text-gray-500">из {formState.images.length} доступных</span>
                                                </div>
                                                
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Метод выборки</span>
                                                    <div className="flex rounded-md p-1 bg-gray-100 gap-1 overflow-x-auto custom-scrollbar">
                                                        <button
                                                            type="button"
                                                            onClick={() => formSetters.setMediaSubsetType('random')}
                                                            className={toggleButtonClass(formState.mediaSubsetType === 'random')}
                                                        >
                                                            Случайные
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => formSetters.setMediaSubsetType('order')}
                                                            className={toggleButtonClass(formState.mediaSubsetType === 'order')}
                                                        >
                                                            По порядку
                                                        </button>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-500 bg-white border border-gray-200 p-2 rounded">
                                                        {formState.mediaSubsetType === 'random' 
                                                            ? '🎲 Изображения будут выбираться случайным образом для каждой публикации.'
                                                            : '🔄 Изображения будут браться последовательно по кругу (1-2, затем 3-4 и т.д.).'}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* 4. Расписание */}
                    <section>
                        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3">4. Расписание</h3>
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                            <div className="flex gap-4 items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-700">Первый запуск:</span>
                                <CustomDatePicker value={formState.startDate} onChange={formSetters.setStartDate} />
                                <CustomTimePicker value={formState.startTime} onChange={formSetters.setStartTime} className="w-32" />
                            </div>
                            <PostCreationOptions 
                                isBulkMode={false} onToggleBulkMode={() => {}} 
                                isMultiProjectMode={false} onToggleMultiProjectMode={() => {}} 
                                isSaving={formState.isSaving} 
                                publicationMethod="system" 
                                isCyclic={true} 
                                onToggleCyclic={() => {}} 
                                recurrenceInterval={formState.recurrenceInterval} onRecurrenceIntervalChange={formSetters.setRecurrenceInterval} 
                                recurrenceType={formState.recurrenceType} onRecurrenceTypeChange={formSetters.setRecurrenceType} 
                                recurrenceEndType={formState.recurrenceEndType} onRecurrenceEndTypeChange={formSetters.setRecurrenceEndType} 
                                recurrenceEndCount={formState.recurrenceEndCount} onRecurrenceEndCountChange={formSetters.setRecurrenceEndCount} 
                                recurrenceEndDate={formState.recurrenceEndDate} onRecurrenceEndDateChange={formSetters.setRecurrenceEndDate} 
                                recurrenceFixedDay={formState.recurrenceFixedDay} onRecurrenceFixedDayChange={formSetters.setRecurrenceFixedDay} 
                                recurrenceIsLastDay={formState.recurrenceIsLastDay} onRecurrenceIsLastDayChange={formSetters.setRecurrenceIsLastDay} 
                                startDate={formState.startDate} 
                                allowBulkMode={false}
                                alwaysCyclic={true} 
                            />
                        </div>
                    </section>
                </div>

                {/* ПРАВАЯ КОЛОНКА: Чат */}
                <div className="flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm h-full min-h-0 overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center flex-shrink-0">
                        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">История генераций</h3>
                        <button onClick={ai.actions.handleClearHistory} className="text-xs text-red-500 hover:text-red-700 font-medium">Очистить</button>
                    </div>
                    
                    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/50">
                        {formState.currentPostId && !ai.state.chatHistory.length && (
                            <div className="p-4 text-center text-gray-500 text-sm italic flex-shrink-0 bg-white/50 border-b border-gray-200">
                                История чата для сохраненного поста не восстанавливается, но параметры генерации (промпт) уже загружены. Вы можете сгенерировать новые варианты.
                            </div>
                        )}
                        <ChatHistory 
                            {...ai.state}
                            {...ai.refs}
                            handleAddToPost={ai.actions.handleAddToPost}
                            setReplyToTurn={ai.actions.setReplyToTurn}
                            onRegenerate={ai.actions.handleRegenerate}
                            isMultiGenerationMode={true}
                            onToggleSelection={(turnId) => {
                                const turn = ai.state.chatHistory.find(t => t.id === turnId) || null;
                                const isDeselecting = turnId === formState.selectedAiTurn?.id;
                                ai.handleTurnSelectionInChat(isDeselecting ? null : turn);
                            }}
                            selectedTurnId={formState.selectedAiTurn?.id}
                            handleJumpToTurn={ai.actions.handleJumpToTurn} 
                            getRepliedTurnText={ai.actions.getRepliedTurnText} 
                            className="p-3"
                        />
                    </div>
                </div>
            </main>
            
            {isProjectSettingsOpen && project && (
                <ProjectSettingsModal
                    project={project}
                    uniqueTeams={uniqueTeams}
                    onClose={() => setIsProjectSettingsOpen(false)}
                    onSave={handleSaveSettings}
                    initialOpenSection="ai-presets"
                    zIndex="z-[60]"
                />
            )}

            {ai.state.showUpdateConfirm && ai.state.selectedPreset && (
                <ConfirmationModal
                    title="Сохранить изменения?"
                    message={`Вы уверены, что хотите перезаписать шаблон "${ai.state.selectedPreset.name}"? Это действие необратимо.`}
                    onConfirm={ai.actions.handleUpdatePreset}
                    onCancel={() => ai.actions.setShowUpdateConfirm(false)}
                    confirmText="Да, сохранить"
                    cancelText="Отмена"
                />
            )}
        </div>
    );
};
