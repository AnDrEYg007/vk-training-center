

import React from 'react';
import { Project, ScheduledPost, SystemPost, GlobalVariableDefinition, Attachment } from '../../../../shared/types';
import { UnifiedPost } from '../../../schedule/hooks/useScheduleData';
import { ConfirmUnsavedChangesModal } from '../../../../shared/components/modals/ConfirmUnsavedChangesModal';
import { usePostDetails } from '../../hooks/usePostDetails';
import { PostModalFooter } from './PostModalFooter';
import { MultiProjectSelector } from '../MultiProjectSelector';
import { PostCreationOptions } from './PostCreationOptions';
import { PostDateTimePicker } from './PostDateTimePicker';
import { PostTextSection } from './PostTextSection';
import { PostMediaSection } from './PostMediaSection';
import { ChatTurn } from '../../hooks/useAIGenerator';

export type RefreshType = 'system' | 'scheduled' | 'published';

export const PostDetailsModal: React.FC<{
    post: UnifiedPost;
    isPublished: boolean;
    projectId: string;
    allProjects: Project[];
    onClose: () => void;
    onSaveComplete: (affectedProjectIds: string[], refreshType: RefreshType) => void;
    onDelete: (post: ScheduledPost | SystemPost) => void;
    onPublishNow: (post: ScheduledPost | SystemPost) => void;
    onUpdateProject: (updatedProject: Project) => Promise<void>;
    initialMode?: 'view' | 'edit' | 'copy';
}> = (props) => {
    
    // Вся логика теперь в хуке
    const { state, actions } = usePostDetails(props);

    const {
        formPost, mode, isNewPost, isCopyMode, isSaving, saveError,
        showUnsavedChangesConfirm, isLocked, isUploadingMedia, modalTitle, totalPostCount, formState,
        showAIGenerator, showVariables, variables, isLoadingVariables, globalVariables, isLoadingGlobalVariables // Новые состояния
    } = state;
    
    const {
        handleClose, handleSave, handlePublishNowClick, handleDeleteClick,
        switchToEditMode, confirmClose, cancelClose, setIsUploadingMedia, formActions,
        setShowAIGenerator, handleToggleVariables, handleReloadVariables // Новые действия
    } = actions;

    const {
        publicationMethod, editedText, editedImages, editedAttachments,
        isBulkMode, dateSlots, isMultiProjectMode, selectedProjectIds,
        isDirty, isFutureDate, isCyclic, recurrenceInterval, recurrenceType,
        recurrenceEndType, recurrenceEndCount, recurrenceEndDate,
        recurrenceFixedDay, recurrenceIsLastDay,
        isAiMultiMode, selectedAiTurn
    } = formState;
    
    const {
        setPublicationMethod, setEditedText, setEditedImages, setEditedAttachments,
        setIsBulkMode, setIsMultiProjectMode, setSelectedProjectIds,
        handleAddDateSlot, handleRemoveDateSlot, handleDateSlotChange,
        setIsCyclic, setRecurrenceInterval, setRecurrenceType,
        setRecurrenceEndType, setRecurrenceEndCount, setRecurrenceEndDate,
        setRecurrenceFixedDay, setRecurrenceIsLastDay,
        setIsAiMultiMode, setSelectedAiTurn
    } = formActions;

    const buttonBaseClass = 'flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors';
    const activeClass = 'bg-white shadow text-indigo-700';
    const inactiveClass = 'text-gray-600 hover:bg-gray-100';
    const disabledClass = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400';

    // Обработчик для AI-вариаций, который также открывает панель AI
    const handleAiMultiModeToggle = (val: boolean) => {
        setIsAiMultiMode(val);
        if (val && !showAIGenerator) {
            setShowAIGenerator(true);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-800">{modalTitle}</h2>
                        <button onClick={handleClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50" title="Закрыть">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    
                    <main className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                        {mode === 'edit' && (
                            <>
                                {/* Выбор способа публикации доступен только при создании или копировании. 
                                    Для существующих постов тип менять нельзя через этот переключатель. */}
                                {(isNewPost || isCopyMode) && (
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Способ публикации</label>
                                        <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                            <button onClick={() => setPublicationMethod('system')} className={`${buttonBaseClass} ${publicationMethod === 'system' ? activeClass : inactiveClass}`}>Запланировать</button>
                                            <button onClick={() => setPublicationMethod('vk')} className={`${buttonBaseClass} ${publicationMethod === 'vk' ? activeClass : inactiveClass}`}>В отложку VK</button>
                                            <button onClick={() => setPublicationMethod('now')} disabled={isFutureDate} className={`${buttonBaseClass} ${publicationMethod === 'now' ? activeClass : inactiveClass} ${disabledClass}`}>Опубликовать сейчас</button>
                                        </div>
                                    </div>
                                )}

                                {/* Опции создания (цикличность, мультипроект) показываем если это новый пост, копия ИЛИ если мы редактируем системный пост (чтобы можно было менять цикл) */}
                                {((isNewPost || isCopyMode) || publicationMethod === 'system') && (
                                    <PostCreationOptions
                                        isBulkMode={isBulkMode}
                                        onToggleBulkMode={setIsBulkMode}
                                        isMultiProjectMode={isMultiProjectMode}
                                        onToggleMultiProjectMode={setIsMultiProjectMode}
                                        isSaving={isSaving}
                                        publicationMethod={publicationMethod}
                                        // Cyclic Props
                                        isCyclic={isCyclic}
                                        onToggleCyclic={setIsCyclic}
                                        recurrenceInterval={recurrenceInterval}
                                        onRecurrenceIntervalChange={setRecurrenceInterval}
                                        recurrenceType={recurrenceType}
                                        onRecurrenceTypeChange={setRecurrenceType}
                                        // Enhanced Cyclic Props
                                        recurrenceEndType={recurrenceEndType}
                                        onRecurrenceEndTypeChange={setRecurrenceEndType}
                                        recurrenceEndCount={recurrenceEndCount}
                                        onRecurrenceEndCountChange={setRecurrenceEndCount}
                                        recurrenceEndDate={recurrenceEndDate}
                                        onRecurrenceEndDateChange={setRecurrenceEndDate}
                                        recurrenceFixedDay={recurrenceFixedDay}
                                        onRecurrenceFixedDayChange={setRecurrenceFixedDay}
                                        recurrenceIsLastDay={recurrenceIsLastDay}
                                        onRecurrenceIsLastDayChange={setRecurrenceIsLastDay}
                                        // Разрешаем массовое создание только для новых постов
                                        allowBulkMode={isNewPost || isCopyMode}
                                        // Передаем дату начала для привязки дня месяца в цикличности
                                        startDate={dateSlots[0]?.date}
                                    />
                                )}
                            </>
                        )}
                        
                        {isMultiProjectMode && mode === 'edit' && (
                            <MultiProjectSelector allProjects={props.allProjects} selectedIds={selectedProjectIds} currentProjectId={props.projectId} onSelectionChange={setSelectedProjectIds} />
                        )}
                        
                        <PostDateTimePicker
                            isBulkMode={isBulkMode}
                            dateSlots={dateSlots}
                            onDateSlotChange={handleDateSlotChange}
                            onAddDateSlot={handleAddDateSlot}
                            onRemoveDateSlot={handleRemoveDateSlot}
                            isPublished={props.isPublished}
                            isNewOrCopy={isNewPost || isCopyMode}
                            mode={mode}
                            publicationMethod={publicationMethod}
                            isFutureDate={isFutureDate}
                            originalPostDate={formPost.date}
                        />

                        {saveError && <p className="text-red-600 text-sm mt-2">{saveError}</p>}

                        <PostTextSection
                            mode={mode}
                            postText={formPost.text}
                            editedText={editedText}
                            onTextChange={setEditedText}
                            projectId={props.projectId}
                            allProjects={props.allProjects}
                            onUpdateProject={props.onUpdateProject}
                            // Новые пропсы для управления состоянием
                            showAIGenerator={showAIGenerator}
                            onToggleAIGenerator={() => setShowAIGenerator(prev => !prev)}
                            showVariables={showVariables}
                            onToggleVariables={handleToggleVariables}
                            onReloadVariables={handleReloadVariables}
                            variables={variables}
                            isLoadingVariables={isLoadingVariables}
                            globalVariables={globalVariables}
                            isLoadingGlobalVariables={isLoadingGlobalVariables}
                            // Для мульти-генерации
                            isMultiGenerationMode={isAiMultiMode}
                            onSelectionChange={setSelectedAiTurn}
                            // Для AI-вариаций
                            isBulkMode={isBulkMode}
                            isCyclic={isCyclic}
                            isAiMultiMode={isAiMultiMode}
                            onToggleAiMultiMode={handleAiMultiModeToggle}
                        />
                        
                        <PostMediaSection
                            mode={mode}
                            editedImages={editedImages}
                            onImagesChange={setEditedImages}
                            onUploadStateChange={setIsUploadingMedia}
                            postAttachments={formPost.attachments || []}
                            editedAttachments={editedAttachments}
                            onAttachmentsChange={setEditedAttachments}
                            projectId={props.projectId}
                        />
                        
                    </main>

                    <PostModalFooter
                        mode={mode}
                        isNewPost={isNewPost}
                        isCopyMode={isCopyMode}
                        isPublished={props.isPublished}
                        isDirty={isDirty}
                        isSaving={isSaving}
                        isUploading={isUploadingMedia}
                        isLocked={isLocked}
                        editedText={editedText}
                        editedImages={editedImages}
                        editedAttachments={editedAttachments}
                        publicationMethod={publicationMethod}
                        postCount={totalPostCount}
                        onSave={handleSave}
                        onDelete={handleDeleteClick}
                        onPublishNow={handlePublishNowClick}
                        onSwitchToEdit={switchToEditMode}
                        isAiMultiMode={isAiMultiMode}
                        selectedAiTurn={selectedAiTurn}
                    />
                </div>
            </div>
            {showUnsavedChangesConfirm && (
                <ConfirmUnsavedChangesModal onConfirm={confirmClose} onCancel={cancelClose} zIndex="z-[60]" />
            )}
        </>
    );
};
