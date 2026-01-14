import React from 'react';
import { useAIGenerator } from '../hooks/useAIGenerator';
import { SystemPromptControls } from './ai/SystemPromptControls';
import { ChatHistory } from './ai/ChatHistory';
import { PromptInput } from './ai/PromptInput';
import { ContextSelector } from './ai/ContextSelector'; // Импорт нового компонента
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { ChatTurn } from '../hooks/useAIGenerator';

interface AIGeneratorProps {
    projectId: string;
    onTextGenerated: (text: string) => void;
    onEditPresets: () => void;
    refreshKey: number;
    postText: string; // Текст из основного поля ввода поста
    // Новые пропсы для режима мульти-генерации
    isMultiGenerationMode?: boolean;
    onSelectionChange?: (turn: ChatTurn | null) => void;
}

export const AIGenerator: React.FC<AIGeneratorProps> = ({ projectId, onTextGenerated, onEditPresets, refreshKey, postText, isMultiGenerationMode, onSelectionChange }) => {
    // Вся логика теперь инкапсулирована в кастомном хуке
    const { state, actions, refs } = useAIGenerator({ projectId, onTextGenerated, refreshKey, postText });
    
    // Общий класс для кнопок быстрых действий
    const quickActionButtonClass = "inline-flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50";
    
    // Кнопки активны, если есть текст поста ИЛИ выбран ответ для пересылки, и не идет генерация
    const isQuickActionDisabled = (!postText && !state.replyToTurn) || state.isGenerating;
    
    // Обработчик выбора сообщения для мульти-генерации
    const handleTurnSelection = (turnId: string) => {
        actions.toggleTurnSelection(turnId);
        
        // Находим объект ChatTurn и передаем родителю
        const turn = state.chatHistory.find(t => t.id === turnId) || null;
        // Если кликнули по уже выбранному (сняли выделение), то turn будет найден, но мы должны передать null
        // Но toggleTurnSelection в хуке уже переключил state.selectedTurnId.
        // Здесь мы используем аргумент turnId, а state.selectedTurnId обновится асинхронно.
        // Поэтому лучше ориентироваться на то, что если turnId === state.selectedTurnId (текущий), значит мы его снимаем.
        
        const isDeselecting = turnId === state.selectedTurnId;
        if (onSelectionChange) {
            onSelectionChange(isDeselecting ? null : turn);
        }
    };

    return (
        <div 
            className="relative p-4 bg-indigo-50 border border-indigo-200 rounded-lg flex flex-col overflow-hidden"
            style={{ height: `${state.height}px` }}
        >
            
            {/* === ВЕРХНИЙ БЛОК: УПРАВЛЕНИЕ СИСТЕМНОЙ ИНСТРУКЦИЕЙ === */}
            <SystemPromptControls 
                useCustomSystemPrompt={state.useCustomSystemPrompt}
                setUseCustomSystemPrompt={actions.setUseCustomSystemPrompt}
                handleClearHistory={actions.handleClearHistory}
                chatHistoryLength={state.chatHistory.length}
                onEditPresets={onEditPresets}
                isLoadingPresets={state.isLoadingPresets}
                aiPresets={state.aiPresets}
                selectedPreset={state.selectedPreset}
                handleSelectPreset={actions.handleSelectPreset}
                customSystemPrompt={state.customSystemPrompt}
                setCustomSystemPrompt={actions.setCustomSystemPrompt}
                isGenerating={state.isGenerating}
                canSave={state.canSave}
                handleSavePreset={actions.handleSavePreset}
                isLoadingDefaultPrompt={state.isLoadingDefaultPrompt}
                defaultSystemPrompt={state.defaultSystemPrompt}
                // Новые пропсы для инлайн-создания
                isCreatingPreset={state.isCreatingPreset}
                newPresetName={state.newPresetName}
                setNewPresetName={actions.setNewPresetName}
                handleCreatePreset={actions.handleCreatePreset}
                handleCancelCreatePreset={actions.handleCancelCreatePreset}
                handleInitiateSaveAsNew={actions.handleInitiateSaveAsNew}
                onToggleExpand={actions.handleSystemPromptToggle} // Передаем обработчик раскрытия
            />

            {/* === ЦЕНТРАЛЬНЫЙ БЛОК: ОКНО ЧАТА === */}
            <ChatHistory 
                chatHistory={state.chatHistory}
                chatContainerRef={refs.chatContainerRef}
                turnRefs={refs.turnRefs}
                highlightedTurnId={state.highlightedTurnId}
                handleAddToPost={actions.handleAddToPost}
                setReplyToTurn={actions.setReplyToTurn}
                handleJumpToTurn={actions.handleJumpToTurn}
                getRepliedTurnText={actions.getRepliedTurnText}
                onRegenerate={actions.handleRegenerate} 
                // Новые пропсы
                isMultiGenerationMode={isMultiGenerationMode}
                selectedTurnId={state.selectedTurnId}
                onToggleSelection={handleTurnSelection}
                // Явно передаем стили, так как ChatHistory теперь прозрачный
                className="my-4 p-3 space-y-4 bg-white border rounded-lg"
            />

            {/* === НИЖНЯЯ ПАНЕЛЬ УПРАВЛЕНИЯ === */}
            <div className="flex-shrink-0 pt-3 mt-2 border-t border-indigo-200 space-y-3">
                
                {/* === БЛОК: КОНТЕКСТ (НОВОЕ) === */}
                <ContextSelector 
                    isOpen={state.isContextPanelOpen}
                    onToggle={actions.toggleContextPanel}
                    // Product
                    selectedProduct={state.selectedProduct}
                    onSelectProduct={actions.selectProduct}
                    marketItems={state.marketItems}
                    isLoadingItems={state.isLoadingMarketItems}
                    productFields={state.productFields}
                    onToggleProductField={actions.toggleProductField}
                    // Company
                    companyContextData={state.companyContextData}
                    isLoadingCompanyContext={state.isLoadingCompanyContext}
                    companyFields={state.companyFields}
                    onToggleCompanyField={actions.toggleCompanyField}
                    onSetAllCompanyFields={actions.setAllCompanyFields}
                    // Common
                    disabled={state.isGenerating}
                />

                {/* === БЛОК: БЫСТРЫЕ ДЕЙСТВИЯ === */}
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    <button type="button" onClick={() => actions.handleQuickAction('rewrite')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Переписать основной текст поста, сохранив смысл">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                        Рерайт
                    </button>
                    <button type="button" onClick={() => actions.handleQuickAction('fix_errors')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Исправить орфографию и пунктуацию в основном тексте поста">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                        Исправить ошибки
                    </button>
                    <button type="button" onClick={() => actions.handleQuickAction('shorten')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Сократить текст, сохранив смысл">
                        Сократи
                    </button>
                    <button type="button" onClick={() => actions.handleQuickAction('expand')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Расширить текст, добавив деталей">
                        Расширь
                    </button>
                     <button type="button" onClick={() => actions.handleQuickAction('add_emoji')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Добавить эмоджи в текст">
                        + эмоджи
                    </button>
                     <button type="button" onClick={() => actions.handleQuickAction('remove_emoji')} disabled={isQuickActionDisabled} className={quickActionButtonClass} title="Убрать лишние эмоджи из текста">
                        - эмоджи
                    </button>
                </div>
                {/* === БЛОК: ПОЛЕ ВВОДА === */}
                <PromptInput 
                    replyToTurn={state.replyToTurn}
                    setReplyToTurn={actions.setReplyToTurn}
                    userPrompt={state.userPrompt}
                    setUserPrompt={actions.setUserPrompt}
                    isGenerating={state.isGenerating}
                    handleGenerateText={actions.handleGenerateText}
                />
            </div>

            {/* Модальное окно для подтверждения обновления */}
            {state.showUpdateConfirm && state.selectedPreset && (
                <ConfirmationModal
                    title="Сохранить изменения?"
                    message={`Вы уверены, что хотите перезаписать шаблон "${state.selectedPreset.name}"? Это действие необратимо.`}
                    onConfirm={actions.handleUpdatePreset}
                    onCancel={() => actions.setShowUpdateConfirm(false)}
                    confirmText="Да, сохранить"
                    cancelText="Отмена"
                />
            )}

            {/* Ручка для изменения размера */}
            <div 
                className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize z-10 flex items-end justify-end"
                onMouseDown={actions.handleResizeStart}
            >
                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM10 14a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
            </div>
        </div>
    );
};