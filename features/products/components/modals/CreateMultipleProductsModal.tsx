
import React, { useRef } from 'react';
import { MarketAlbum } from '../../../../shared/types';
import { GroupedCategory } from '../../hooks/useProductCategories';
import { NewProductRow } from '../../types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { DescriptionEditorModal } from './DescriptionEditorModal';
import { useCreateMultipleProducts } from '../../hooks/useCreateMultipleProducts';
import { TableHeader } from './create-multiple/TableHeader';
import { ProductRow } from './create-multiple/ProductRow';
import { BulkEditPopover } from '../BulkEditPopover';
import { BulkCategoryEditModal } from './BulkCategoryEditModal';
import { BulkAlbumEditModal } from './BulkAlbumEditModal';
import { BulkPriceEditModal } from './BulkPriceEditModal';
import { PasteFromClipboardModal } from './PasteFromClipboardModal';

interface CreateMultipleProductsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (productsData: NewProductRow[]) => Promise<{ successfulTempIds: string[], failed: { tempId: string, error: string }[] }>;
    albums: MarketAlbum[];
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    projectId: string;
    initialRows?: NewProductRow[] | null;
}

export const CreateMultipleProductsModal: React.FC<CreateMultipleProductsModalProps> = ({
    isOpen, onClose, onSave, albums, groupedCategories, areCategoriesLoading, loadCategories, projectId, initialRows
}) => {
    const { 
        rows, urlInputs, showCloseConfirm, activeDescriptionRowId, activeDescriptionText, errors,
        serverErrors, isSubmitting, showConfirmSave, validRowsToSave,
        selectedTempIds, isBulkEditOpen, activeBulkModal, isPasteModalOpen,
        actions
    } = useCreateMultipleProducts({ onSave, onClose, initialRows });
    
    const bulkEditButtonRef = useRef<HTMLButtonElement>(null);

    if (!isOpen) return null;

    const hasServerErrors = Object.keys(serverErrors).length > 0;
    const selectedCount = selectedTempIds.size;
    const selectedItemsForBulk = rows.filter(r => selectedTempIds.has(r.tempId)).map(r => ({ ...r, id: 0 } as any));

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={actions.handleCloseRequest}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Массовое создание товаров</h2>
                                <p className="text-xs text-gray-500 mt-0.5">Черновики новых товаров в группе.</p>
                            </div>

                            {selectedCount > 0 ? (
                                <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-lg animate-fade-in-up">
                                    <span className="text-sm font-medium text-indigo-800">Выбрано: {selectedCount}</span>
                                    <div className="h-4 w-px bg-indigo-200 mx-1"></div>
                                    <button
                                        ref={bulkEditButtonRef}
                                        onClick={() => actions.setIsBulkEditOpen(true)}
                                        className="px-3 py-1 text-sm font-medium bg-white border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors shadow-sm"
                                    >
                                        Изменить
                                    </button>
                                    <button onClick={actions.clearSelection} className="text-xs text-indigo-500 hover:text-indigo-700 ml-2">Сброс</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => actions.setIsPasteModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-all text-sm font-medium shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                    Из буфера
                                </button>
                            )}
                        </div>
                        <button onClick={actions.handleCloseRequest} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    
                    <main className="flex-grow overflow-auto custom-scrollbar bg-gray-50 p-4">
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                                <colgroup>
                                    <col style={{ width: '40px' }} />
                                    <col style={{ width: '90px' }} />
                                    <col style={{ width: '220px' }} />
                                    <col style={{ width: '200px' }} />
                                    <col style={{ width: '250px' }} />
                                    <col style={{ width: '100px' }} />
                                    <col style={{ width: '100px' }} />
                                    <col style={{ width: '100px' }} />
                                    <col style={{ width: '180px' }} />
                                    <col style={{ width: '200px' }} />
                                </colgroup>
                                <TableHeader onToggleAll={actions.toggleSelectAll} allSelected={rows.length > 0 && selectedCount === rows.length} hasRows={rows.length > 0} />
                                <tbody className="divide-y divide-gray-100">
                                     {rows.map((row) => (
                                        <ProductRow
                                            key={row.tempId} row={row} rowsCount={rows.length} albums={albums} groupedCategories={groupedCategories}
                                            areCategoriesLoading={areCategoriesLoading} loadCategories={loadCategories}
                                            onRowChange={actions.handleRowChange} onRemoveRow={actions.handleRemoveRow} onCopyRow={actions.handleCopyRow}
                                            onDescriptionEdit={actions.setActiveDescriptionRowId} urlInputValue={urlInputs[row.tempId] || ''}
                                            onUrlChange={actions.handleUrlInputChange} onUrlBlur={actions.handleUrlBlur} onClearPhoto={actions.handleClearPhoto}
                                            errors={errors[row.tempId]} serverError={serverErrors[row.tempId]} isSelected={selectedTempIds.has(row.tempId)}
                                            onToggleSelection={actions.toggleSelection}
                                        />
                                     ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4">
                            <button onClick={actions.handleAddRow} disabled={isSubmitting} className="px-3 py-1.5 text-sm font-medium border-2 border-dashed rounded-md transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50">+ Добавить товар</button>
                        </div>
                    </main>
                    
                    {hasServerErrors && (
                        <div className="bg-red-50 border-t border-red-200 p-4 max-h-32 overflow-y-auto custom-scrollbar flex-shrink-0">
                            <div className="flex items-center gap-2 mb-2 text-red-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                <h4 className="font-bold text-sm">Ошибки при создании ({Object.keys(serverErrors).length}):</h4>
                            </div>
                            <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                                {Object.entries(serverErrors).map(([id, msg]) => {
                                    const rowIndex = rows.findIndex(r => r.tempId === id) + 1;
                                    return <li key={id}><span className="font-medium">Строка {rowIndex > 0 ? rowIndex : '?'}:</span> {msg}</li>;
                                })}
                            </ul>
                        </div>
                    )}

                     <footer className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-white flex-shrink-0 rounded-b-lg">
                        <button type="button" onClick={actions.handleCloseRequest} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">Отмена</button>
                        <button type="button" onClick={actions.handleSave} disabled={isSubmitting} className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 shadow-sm flex items-center justify-center min-w-[140px]">
                            {isSubmitting ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Создать товары'}
                        </button>
                    </footer>
                </div>
            </div>

            {isBulkEditOpen && <BulkEditPopover targetRef={bulkEditButtonRef} onClose={() => actions.setIsBulkEditOpen(false)} onSelectField={actions.handleBulkEditSelect} />}

            {activeBulkModal === 'category' && <BulkCategoryEditModal isOpen={true} onClose={() => actions.setActiveBulkModal(null)} onConfirm={actions.handleBulkCategoryUpdate} groupedCategories={groupedCategories} areCategoriesLoading={areCategoriesLoading} loadCategories={loadCategories} selectedItems={selectedItemsForBulk} onAiSuggest={() => window.showAppToast?.("AI пока недоступен", 'warning')} isAiSuggesting={false} aiSuggestions={null} />}
            {activeBulkModal === 'album' && <BulkAlbumEditModal isOpen={true} onClose={() => actions.setActiveBulkModal(null)} selectedItemsCount={selectedCount} albums={albums} onConfirm={actions.handleBulkAlbumUpdate} />}
            {activeBulkModal === 'price' && <BulkPriceEditModal isOpen={true} onClose={() => actions.setActiveBulkModal(null)} selectedItemsCount={selectedCount} onConfirm={actions.handleBulkPriceUpdate} />}

            {showCloseConfirm && <ConfirmationModal title="Закрыть без сохранения?" message="Все введенные данные будут потеряны." onConfirm={() => { actions.setShowCloseConfirm(false); onClose(); }} onCancel={() => actions.setShowCloseConfirm(false)} confirmText="Да, закрыть" cancelText="Отмена" confirmButtonVariant="danger" zIndex="z-[60]" />}
            {showConfirmSave && <ConfirmationModal title="Подтвердите создание" message={`Вы готовы создать ${validRowsToSave.length} товаров?`} onConfirm={actions.handleConfirmSave} onCancel={() => actions.setShowConfirmSave(false)} confirmText="Да, создать" cancelText="Отмена" confirmButtonVariant="success" zIndex="z-[60]" />}

            {activeDescriptionRowId && (
                <DescriptionEditorModal isOpen={!!activeDescriptionRowId} onClose={() => actions.setActiveDescriptionRowId(null)} initialText={activeDescriptionText} onSave={(text) => actions.handleRowChange(activeDescriptionRowId, 'description', text)} projectId={projectId} />
            )}

            {isPasteModalOpen && (
                <PasteFromClipboardModal
                    isOpen={isPasteModalOpen}
                    onClose={() => actions.setIsPasteModalOpen(false)}
                    onImport={actions.handleImportFromPaste}
                    allAlbums={albums}
                    allCategories={groupedCategories.flatMap(g => g.categories)}
                />
            )}
        </>
    );
};
