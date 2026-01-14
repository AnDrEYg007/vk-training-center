
import React from 'react';
import { ConfirmationModal } from '../../../shared/components/modals/ConfirmationModal';
import { ImagePreviewModal } from '../../../shared/components/modals/ImagePreviewModal';
import { BulkEditPopover } from './BulkEditPopover';
import { BulkCategoryEditModal } from './modals/BulkCategoryEditModal';
import { BulkPriceEditModal } from './modals/BulkPriceEditModal';
import { BulkTitleEditModal } from './modals/BulkTitleEditModal';
import { BulkDescriptionEditModal } from './modals/BulkDescriptionEditModal';
import { BulkOldPriceEditModal } from './modals/BulkOldPriceEditModal';
import { BulkAlbumEditModal } from './modals/BulkAlbumEditModal';
import { AiCategorySuggestionModal } from './modals/AiCategorySuggestionModal';
import { CreateSingleProductModal } from './modals/CreateSingleProductModal';
import { CreateMultipleProductsModal } from './modals/CreateMultipleProductsModal';
import { SaveResultModal } from './modals/SaveResultModal'; // Импорт нового компонента
import { useProductsManager } from '../hooks/useProductsManager';
import { MarketItem } from '../../../shared/types';

interface ProductsModalsProps {
    state: ReturnType<typeof useProductsManager>['state'];
    actions: ReturnType<typeof useProductsManager>['actions'];
    
    selectedItems: MarketItem[];
    bulkEditButtonRef: React.RefObject<HTMLButtonElement>;
    groupedCategories: any[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    projectId: string;
}

export const ProductsModals: React.FC<ProductsModalsProps> = ({
    state,
    actions,
    selectedItems,
    bulkEditButtonRef,
    groupedCategories,
    areCategoriesLoading,
    loadCategories,
    projectId,
}) => {
    const {
        itemToSave, isSaving, bulkDeleteConfirmation, previewImage, isBulkEditOpen, isBulkCategoryModalOpen,
        isBulkPriceModalOpen, isBulkTitleModalOpen, isBulkDescriptionModalOpen, isBulkOldPriceModalOpen,
        isBulkAlbumModalOpen, aiSuggestionState, isBulkAiSuggesting, bulkAiSuggestions, isBulkAiCorrecting,
        bulkAiCorrections, isBulkAiCorrectingTitles, bulkAiTitleCorrections, albums,
        isCreateSingleModalOpen, isCreateMultipleModalOpen, itemsToDelete, itemToCopy,
        multipleCreateInitialRows, saveResult, // Добавлено состояние результата
    } = state;

    const {
        setItemToSave, handleSaveItem, handleSaveAll, handleConfirmBulkDelete, 
        setPreviewImage, setBulkEditOpen, handleBulkEditSelect, handleBulkCategoryUpdate, 
        handleBulkPriceUpdate, handleBulkTitleUpdate, handleBulkDescriptionUpdate, handleBulkOldPriceUpdate, 
        handleBulkAlbumUpdate, handleCancelAiSuggestion, handleConfirmAiSuggestion, handleBulkAiSuggestCategory, 
        handleBulkAiCorrectDescriptions, handleBulkAiDescriptionConfirm, handleBulkAiCorrectTitles, 
        handleBulkAiTitleConfirm, setBulkAiSuggestions, setBulkAiCorrections, setBulkAiTitleCorrections,
        setIsBulkCategoryModalOpen, setIsBulkPriceModalOpen, setIsBulkTitleModalOpen,
        setIsBulkDescriptionModalOpen, setIsBulkOldPriceModalOpen, setIsBulkAlbumModalOpen,
        setIsCreateSingleModalOpen, closeCreateMultipleModal, handleCreateSingleProduct, handleCreateMultipleProducts,
        setItemToCopy, setSaveResult // Добавлен сеттер
    } = actions;

    const getSaveConfirmationMessage = () => {
        if (Array.isArray(itemToSave)) {
            const updateCount = itemToSave.length;
            const deleteCount = itemsToDelete.size;
            const parts = [];
            
            if (updateCount > 0) {
                parts.push(`• Будет обновлено товаров: ${updateCount} (данные в VK будут перезаписаны).`);
            }
            if (deleteCount > 0) {
                parts.push(`• Будет удалено товаров: ${deleteCount} (данные будут потеряны безвозвратно).`);
            }
            
            return `Вы уверены, что хотите применить изменения?\n\n${parts.join('\n')}`;
        } else {
             return `Вы уверены, что хотите сохранить изменения для товара "${(itemToSave as MarketItem).title}"?`;
        }
    };

    return (
        <>
            {itemToSave && (
                <ConfirmationModal
                    title={Array.isArray(itemToSave) ? "Подтвердите изменения" : "Сохранить изменения?"}
                    message={getSaveConfirmationMessage()}
                    onConfirm={() => {
                        if (Array.isArray(itemToSave)) {
                            handleSaveAll(true);
                        } else {
                            handleSaveItem((itemToSave as MarketItem).id, true);
                        }
                    }}
                    onCancel={() => setItemToSave(null)}
                    isConfirming={isSaving}
                    confirmText="Да, применить"
                    confirmButtonVariant={Array.isArray(itemToSave) && itemsToDelete.size > 0 ? 'danger' : 'primary'}
                />
            )}
            {bulkDeleteConfirmation > 0 && (
                <ConfirmationModal
                    title="Подтвердите удаление"
                    message={`Вы уверены, что хотите удалить ${bulkDeleteConfirmation} выбранных товаров? Это действие необратимо.`}
                    onConfirm={handleConfirmBulkDelete}
                    onCancel={() => actions.setBulkDeleteConfirmation(0)}
                    confirmText="Да, удалить"
                    confirmButtonVariant="danger"
                />
            )}
            {/* Новое модальное окно результатов сохранения */}
            {saveResult && (
                <SaveResultModal
                    result={saveResult}
                    onClose={() => setSaveResult(null)}
                />
            )}
            {previewImage && (
                <ImagePreviewModal 
                    image={{id: String(previewImage.id), url: previewImage.thumb_photo}} 
                    onClose={() => setPreviewImage(null)} 
                />
            )}
            {isBulkEditOpen && (
                <BulkEditPopover
                    targetRef={bulkEditButtonRef}
                    onClose={() => setBulkEditOpen(false)}
                    onSelectField={handleBulkEditSelect}
                />
            )}
            {isBulkCategoryModalOpen && (
                <BulkCategoryEditModal
                    isOpen={isBulkCategoryModalOpen}
                    onClose={() => {
                        setIsBulkCategoryModalOpen(false);
                        setBulkAiSuggestions(null);
                    }}
                    onConfirm={handleBulkCategoryUpdate}
                    groupedCategories={groupedCategories}
                    areCategoriesLoading={areCategoriesLoading}
                    loadCategories={loadCategories}
                    selectedItems={selectedItems}
                    onAiSuggest={handleBulkAiSuggestCategory}
                    isAiSuggesting={isBulkAiSuggesting}
                    aiSuggestions={bulkAiSuggestions}
                />
            )}
            {isBulkPriceModalOpen && (
                <BulkPriceEditModal
                    isOpen={isBulkPriceModalOpen}
                    onClose={() => setIsBulkPriceModalOpen(false)}
                    selectedItemsCount={selectedItems.length}
                    onConfirm={handleBulkPriceUpdate}
                />
            )}
            {isBulkDescriptionModalOpen && (
                <BulkDescriptionEditModal
                    isOpen={isBulkDescriptionModalOpen}
                    onClose={() => {
                        setIsBulkDescriptionModalOpen(false);
                        setBulkAiCorrections(null);
                    }}
                    selectedItems={selectedItems}
                    onConfirm={handleBulkDescriptionUpdate}
                    isBulkAiCorrecting={isBulkAiCorrecting}
                    bulkAiCorrections={bulkAiCorrections}
                    onAiCorrect={handleBulkAiCorrectDescriptions}
                    onConfirmCorrections={handleBulkAiDescriptionConfirm}
                />
            )}
            {isBulkOldPriceModalOpen && (
                <BulkOldPriceEditModal
                    isOpen={isBulkOldPriceModalOpen}
                    onClose={() => setIsBulkOldPriceModalOpen(false)}
                    selectedItemsCount={selectedItems.length}
                    onConfirm={handleBulkOldPriceUpdate}
                />
            )}
            {isBulkAlbumModalOpen && (
                <BulkAlbumEditModal
                    isOpen={isBulkAlbumModalOpen}
                    onClose={() => setIsBulkAlbumModalOpen(false)}
                    selectedItemsCount={selectedItems.length}
                    albums={albums}
                    onConfirm={handleBulkAlbumUpdate}
                />
            )}
            {aiSuggestionState.suggestion && (
                <AiCategorySuggestionModal
                    suggestion={aiSuggestionState.suggestion}
                    onClose={handleCancelAiSuggestion}
                    onConfirm={handleConfirmAiSuggestion}
                />
            )}
            {isBulkTitleModalOpen && (
                <BulkTitleEditModal
                    isOpen={isBulkTitleModalOpen}
                    onClose={() => {
                        setIsBulkTitleModalOpen(false);
                        setBulkAiTitleCorrections(null);
                    }}
                    selectedItems={selectedItems}
                    onConfirm={handleBulkTitleUpdate}
                    isBulkAiCorrecting={isBulkAiCorrectingTitles}
                    bulkAiCorrections={bulkAiTitleCorrections}
                    onAiCorrect={handleBulkAiCorrectTitles}
                    onConfirmCorrections={handleBulkAiTitleConfirm}
                />
            )}
             {(isCreateSingleModalOpen || itemToCopy) && (
                <CreateSingleProductModal
                    isOpen={isCreateSingleModalOpen || !!itemToCopy}
                    onClose={() => {
                        setIsCreateSingleModalOpen(false);
                        setItemToCopy(null);
                    }}
                    onSave={handleCreateSingleProduct}
                    albums={albums}
                    groupedCategories={groupedCategories}
                    areCategoriesLoading={areCategoriesLoading}
                    loadCategories={loadCategories}
                    projectId={projectId}
                    initialData={itemToCopy}
                />
            )}
            {isCreateMultipleModalOpen && (
                <CreateMultipleProductsModal
                    isOpen={isCreateMultipleModalOpen}
                    onClose={() => closeCreateMultipleModal()}
                    onSave={handleCreateMultipleProducts}
                    albums={albums}
                    groupedCategories={groupedCategories}
                    areCategoriesLoading={areCategoriesLoading}
                    loadCategories={loadCategories}
                    projectId={projectId}
                    initialRows={multipleCreateInitialRows}
                />
            )}
        </>
    );
};
