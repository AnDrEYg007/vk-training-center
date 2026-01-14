
import React from 'react';
import { MarketItem, MarketAlbum, MarketCategory } from '../../../../shared/types';
import { NewProductRow } from '../../types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { useUpdateFileLogic } from '../../hooks/useUpdateFileLogic';
import { UpdateFileHeader } from './update-from-file/UpdateFileHeader';
import { UpdateFileTabs } from './update-from-file/UpdateFileTabs';
import { UpdateFileTable } from './update-from-file/UpdateFileTable';
import { UpdateFileFooter } from './update-from-file/UpdateFileFooter';

interface UpdateFromFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string; // Передаем только имя файла для заголовка
    fileRows: NewProductRow[]; // Получаем распарсенные и маппленные строки
    allItems: MarketItem[];
    allAlbums: MarketAlbum[];
    allCategories: MarketCategory[];
    onApplyUpdates: (updates: Record<number, Partial<MarketItem>>) => void;
    onQueueNewItems: (newRows: NewProductRow[]) => void;
}

export const UpdateFromFileModal: React.FC<UpdateFromFileModalProps> = ({
    isOpen, onClose, fileName, fileRows, allItems, allAlbums, allCategories, onApplyUpdates, onQueueNewItems
}) => {
    
    const { state, actions } = useUpdateFileLogic({
        isOpen,
        fileRows,
        allItems,
        allAlbums,
        allCategories,
        onClose,
        onApplyUpdates,
        onQueueNewItems,
    });

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={actions.handleCloseRequest}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] animate-fade-in-up flex flex-col h-[85vh]" onClick={e => e.stopPropagation()}>
                    
                    <UpdateFileHeader
                        fileName={fileName}
                        fileRowsCount={state.fileRows.length}
                        matchKey={state.matchKey}
                        setMatchKey={actions.setMatchKey}
                        fieldsToUpdate={state.fieldsToUpdate}
                        toggleField={actions.toggleField}
                        setFieldsToUpdate={actions.setFieldsToUpdate}
                        onClose={actions.handleCloseRequest}
                    />

                    <main className="flex-grow p-4 overflow-hidden flex flex-col bg-gray-50 relative">
                        <UpdateFileTabs 
                            activeTab={state.activeTab}
                            setActiveTab={actions.setActiveTab}
                            updatesCount={state.changedMatches.length}
                            unchangedCount={state.unchangedMatches.length}
                            ambiguousCount={state.ambiguousMatches.length}
                            notFoundCount={state.notFoundMatches.length}
                        />
                        
                        <div className="flex-grow overflow-auto custom-scrollbar">
                            {state.activeTab === 'updates' && (
                                <UpdateFileTable 
                                    data={state.changedMatches} 
                                    emptyMessage="Совпадающих товаров с изменениями не найдено."
                                    allAlbums={allAlbums}
                                    allCategories={allCategories}
                                    resolutions={state.resolutions}
                                    onResolveConflict={actions.handleResolveConflict}
                                    onCellChange={actions.handleCellChange}
                                    validationErrors={state.validationErrors}
                                />
                            )}
                            {state.activeTab === 'unchanged' && (
                                <UpdateFileTable 
                                    data={state.unchangedMatches} 
                                    emptyMessage="Нет товаров без изменений."
                                    allAlbums={allAlbums}
                                    allCategories={allCategories}
                                    resolutions={state.resolutions}
                                    onResolveConflict={actions.handleResolveConflict}
                                    onCellChange={actions.handleCellChange}
                                    validationErrors={state.validationErrors}
                                />
                            )}
                            {state.activeTab === 'ambiguous' && (
                                <UpdateFileTable 
                                    data={state.ambiguousMatches}
                                    emptyMessage="Товаров с дублирующимися совпадениями не найдено."
                                    allAlbums={allAlbums}
                                    allCategories={allCategories}
                                    matchKey={state.matchKey}
                                    resolutions={state.resolutions}
                                    onResolveConflict={actions.handleResolveConflict}
                                    onCellChange={actions.handleCellChange}
                                    validationErrors={state.validationErrors}
                                />
                            )}
                            {state.activeTab === 'not_found' && (
                                <UpdateFileTable 
                                    data={state.notFoundMatches} 
                                    emptyMessage="Все товары из файла найдены в системе."
                                    allAlbums={allAlbums}
                                    allCategories={allCategories}
                                    resolutions={state.resolutions}
                                    onResolveConflict={actions.handleResolveConflict}
                                    onCellChange={actions.handleCellChange}
                                    validationErrors={state.validationErrors}
                                />
                            )}
                        </div>
                    </main>

                    <UpdateFileFooter
                        activeTab={state.activeTab}
                        totalProcessed={state.matchesTotal}
                        readyToUpdateCount={state.itemsToUpdateCount}
                        notFoundCount={state.notFoundMatches.length}
                        onCancel={actions.handleCloseRequest}
                        onApply={actions.handleApply}
                        onQueueNewItems={actions.handleQueueNewItems}
                    />
                </div>
            </div>

            {state.showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть окно?"
                    message="Вы не применили изменения. Весь прогресс анализа будет потерян."
                    onConfirm={() => { actions.setShowCloseConfirm(false); onClose(); }}
                    onCancel={() => actions.setShowCloseConfirm(false)}
                    confirmText="Да, закрыть"
                    cancelText="Назад"
                    confirmButtonVariant="danger"
                    zIndex="z-[70]"
                />
            )}
        </>
    );
};
