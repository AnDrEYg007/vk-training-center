
// FIX: Import React to make React types like Dispatch and SetStateAction available.
import React, { useState, useEffect, useCallback } from 'react';
import { MarketItem, MarketCategory, MarketPrice } from '../../../shared/types';
import * as api from '../../../services/api';
import { 
    BulkPriceUpdatePayload, 
    BulkTitleUpdatePayload, 
    BulkDescriptionUpdatePayload,
    BulkOldPriceUpdatePayload
} from '../types';
import { useProductModals } from './useProductModals';
import { useProductAI } from './useProductAI';
import { useProductSelection } from './useProductSelection';

interface UseProductBulkActionsProps {
    items: MarketItem[];
    selectedItemIds: Set<number>;
    editedItems: Record<string, Partial<MarketItem>>;
    setEditedItems: React.Dispatch<React.SetStateAction<Record<string, Partial<MarketItem>>>>;
    modalActions: ReturnType<typeof useProductModals>['modalActions'];
    aiActions: ReturnType<typeof useProductAI>['aiActions'];
    selectionActions: ReturnType<typeof useProductSelection>['selectionActions'];
}

/**
 * Хук, инкапсулирующий логику всех массовых действий.
 */
export const useProductBulkActions = ({
    items,
    selectedItemIds,
    editedItems,
    setEditedItems,
    modalActions,
    aiActions,
    selectionActions
}: UseProductBulkActionsProps) => {
    
    // ВНИМАНИЕ: projectId теперь должен приходить откуда-то выше
    // Предположим, что он будет добавлен в props
    const projectId = items[0]?.owner_id ? String(Math.abs(items[0].owner_id)) : '';


    const initiateBulkDelete = useCallback(() => {
        if (selectedItemIds.size > 0) {
            modalActions.setBulkDeleteConfirmation(selectedItemIds.size);
        }
    }, [selectedItemIds, modalActions]);

    const handleConfirmBulkDelete = useCallback(async () => {
        if (selectedItemIds.size === 0) return;
        try {
            await api.deleteMarketItems(projectId, Array.from(selectedItemIds));
            window.showAppToast?.(`Удалено ${selectedItemIds.size} товаров.`, 'success');
            // Здесь нужно будет вызвать обновление данных
        } catch (error) {
             const msg = error instanceof Error ? error.message : 'Произошла ошибка';
             window.showAppToast?.(`Не удалось удалить товары: ${msg}`, 'error');
        } finally {
             modalActions.setBulkDeleteConfirmation(0);
             selectionActions.clearSelection();
        }
    }, [selectedItemIds, projectId, modalActions, selectionActions]);

    const handleBulkCategoryUpdate = useCallback((update: MarketCategory | api.BulkSuggestionResult[]) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };
        
        if (Array.isArray(update)) { // AI suggestions
            update.forEach(suggestion => {
                const { itemId, category: newCategoryObject } = suggestion;
                const reconstructedCategory = { id: newCategoryObject.id, name: newCategoryObject.name, section_id: newCategoryObject.section_id, section_name: newCategoryObject.section_name };
                newEdits[itemId] = { ...newEdits[itemId], category: reconstructedCategory };
            });
        } else { // Manual selection
            const newCategoryObject = update;
            if (selectedItemIds.size > 0) {
                const reconstructedCategory = { id: newCategoryObject.id, name: newCategoryObject.name, section_id: newCategoryObject.section_id, section_name: newCategoryObject.section_name };
                selectedItemIds.forEach(itemId => {
                    newEdits[itemId] = { ...newEdits[itemId], category: reconstructedCategory };
                });
            }
        }
        
        setEditedItems(newEdits);
        modalActions.setIsBulkCategoryModalOpen(false);
        aiActions.setBulkAiSuggestions(null);
        selectionActions.clearSelection();
    }, [selectedItemIds, editedItems, setEditedItems, modalActions, aiActions, selectionActions]);

    const handleBulkPriceUpdate = useCallback((payload: BulkPriceUpdatePayload) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };
        
        const round = (priceInKopecks: number, direction: 'up' | 'down', target: 0 | 5 | 9): number => {
            const priceInRub = priceInKopecks / 100;
            const base = Math.floor(priceInRub / 10) * 10;
            const targetInDecade = base + target;
            let resultInRub: number;
            if (direction === 'up') {
                resultInRub = targetInDecade >= priceInRub ? targetInDecade : targetInDecade + 10;
            } else {
                resultInRub = targetInDecade <= priceInRub ? targetInDecade : targetInDecade - 10;
            }
            return Math.round(resultInRub * 100);
        };
        
        selectedItemIds.forEach(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            const currentPrice = { ...item.price, ...(newEdits[itemId]?.price || {}) };
            let newAmount = Number(currentPrice.amount);

            switch (payload.mode) {
                case 'set':
                    newAmount = payload.setValue!;
                    break;
                case 'round':
                    newAmount = round(newAmount, payload.roundDirection!, payload.roundTarget!);
                    break;
                case 'change':
                    const value = payload.changeValue!;
                    if (payload.changeType === 'amount') {
                        newAmount = payload.changeAction === 'increase' ? newAmount + value : Math.max(0, newAmount - value);
                    } else { // percent
                        const factor = 1 + (payload.changeAction === 'increase' ? value : -value) / 100;
                        newAmount = Math.round(newAmount * factor);
                    }
                    break;
            }
            
            const newPrice: MarketPrice = { ...currentPrice, amount: String(newAmount) };
            newEdits[itemId] = { ...newEdits[itemId], price: newPrice };
        });

        setEditedItems(newEdits);
        modalActions.setIsBulkPriceModalOpen(false);
        selectionActions.clearSelection();

    }, [selectedItemIds, items, editedItems, setEditedItems, modalActions, selectionActions]);

    const handleBulkTitleUpdate = useCallback((payload: BulkTitleUpdatePayload) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };

        selectedItemIds.forEach(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            const currentTitle = newEdits[itemId]?.title || item.title;
            let newTitle = currentTitle;

            if (payload.mode === 'insert') {
                if (payload.position === 'start') {
                    newTitle = payload.text + currentTitle;
                } else { // end
                    newTitle = currentTitle + payload.text;
                }
            } else if (payload.mode === 'delete') {
                newTitle = currentTitle.replace(new RegExp(payload.text, 'g'), '');
            }
            
            newEdits[itemId] = { ...newEdits[itemId], title: newTitle };
        });

        setEditedItems(newEdits);
        modalActions.setIsBulkTitleModalOpen(false);
        selectionActions.clearSelection();
    }, [selectedItemIds, items, editedItems, setEditedItems, modalActions, selectionActions]);
    
    const handleBulkDescriptionUpdate = useCallback((payload: BulkDescriptionUpdatePayload) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };

        selectedItemIds.forEach(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            const currentDescription = newEdits[itemId]?.description || item.description;
            let newDescription = currentDescription;

            if (payload.mode === 'insert') {
                if (payload.position === 'start') {
                    newDescription = payload.text + currentDescription;
                } else { // end
                    newDescription = currentDescription + payload.text;
                }
            } else if (payload.mode === 'delete') {
                newDescription = currentDescription.replace(new RegExp(payload.text, 'g'), '');
            }
            
            newEdits[itemId] = { ...newEdits[itemId], description: newDescription };
        });

        setEditedItems(newEdits);
        modalActions.setIsBulkDescriptionModalOpen(false);
        selectionActions.clearSelection();
    }, [selectedItemIds, items, editedItems, setEditedItems, modalActions, selectionActions]);

    const handleBulkOldPriceUpdate = useCallback((payload: BulkOldPriceUpdatePayload) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };

        const round = (priceInKopecks: number, direction: 'up' | 'down', target: 0 | 5 | 9): number => {
            const priceInRub = priceInKopecks / 100;
            const base = Math.floor(priceInRub / 10) * 10;
            const targetInDecade = base + target;
            let resultInRub: number;
            if (direction === 'up') {
                resultInRub = targetInDecade >= priceInRub ? targetInDecade : targetInDecade - 10;
            } else {
                resultInRub = targetInDecade <= priceInRub ? targetInDecade : targetInDecade - 10;
            }
            return Math.round(resultInRub * 100);
        };

        selectedItemIds.forEach(itemId => {
            const item = items.find(i => i.id === itemId);
            if (!item) return;

            const currentPrice = { ...item.price, ...(newEdits[itemId]?.price || {}) };
            let newOldAmount: number | undefined;
            const currentOldAmount = currentPrice.old_amount ? Number(currentPrice.old_amount) : undefined;
            const currentAmount = Number(currentPrice.amount);

            switch (payload.mode) {
                case 'set':
                    newOldAmount = payload.setValue;
                    break;
                case 'round':
                    if(currentOldAmount !== undefined) {
                        newOldAmount = round(currentOldAmount, payload.roundDirection!, payload.roundTarget!);
                    }
                    break;
                case 'change':
                    if(currentOldAmount !== undefined) {
                        const value = payload.changeValue!;
                        if (payload.changeType === 'amount') {
                            newOldAmount = payload.changeAction === 'increase' ? currentOldAmount + value : Math.max(0, currentOldAmount - value);
                        } else { // percent
                            const factor = 1 + (payload.changeAction === 'increase' ? value : -value) / 100;
                            newOldAmount = Math.round(currentOldAmount * factor);
                        }
                    }
                    break;
                case 'from_current':
                    const fromCurrentValue = payload.fromCurrentValue!;
                    if (payload.fromCurrentType === 'amount') {
                        newOldAmount = payload.fromCurrentAction === 'increase' ? currentAmount + fromCurrentValue : Math.max(0, currentAmount - fromCurrentValue);
                    } else { // percent
                        const factor = 1 + (payload.fromCurrentAction === 'increase' ? fromCurrentValue : -fromCurrentValue) / 100;
                        newOldAmount = Math.round(currentAmount * factor);
                    }
                    break;
            }
            
            const newPrice: MarketPrice = { ...currentPrice, old_amount: newOldAmount !== undefined ? String(newOldAmount) : undefined };
            newEdits[itemId] = { ...newEdits[itemId], price: newPrice };
        });

        setEditedItems(newEdits);
        modalActions.setIsBulkOldPriceModalOpen(false);
        selectionActions.clearSelection();

    }, [selectedItemIds, items, editedItems, setEditedItems, modalActions, selectionActions]);

    const handleBulkAlbumUpdate = useCallback((albumId: number | null) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };
        selectedItemIds.forEach(itemId => {
            newEdits[itemId] = { ...newEdits[itemId], album_ids: albumId ? [albumId] : [] };
        });
        setEditedItems(newEdits);
        modalActions.setIsBulkAlbumModalOpen(false);
        selectionActions.clearSelection();
    }, [selectedItemIds, editedItems, setEditedItems, modalActions, selectionActions]);

    const handleBulkAiDescriptionConfirm = useCallback((corrections: { itemId: number, correctedText: string }[]) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };
        corrections.forEach(({ itemId, correctedText }) => {
            newEdits[itemId] = { ...newEdits[itemId], description: correctedText };
        });
        setEditedItems(newEdits);
        modalActions.setIsBulkDescriptionModalOpen(false);
        aiActions.setBulkAiCorrections(null);
        selectionActions.clearSelection();
    }, [editedItems, setEditedItems, modalActions, aiActions, selectionActions]);

    const handleBulkAiTitleConfirm = useCallback((corrections: { itemId: number, correctedText: string }[]) => {
        const newEdits: Record<string, Partial<MarketItem>> = { ...editedItems };
        corrections.forEach(({ itemId, correctedText }) => {
            newEdits[itemId] = { ...newEdits[itemId], title: correctedText };
        });
        setEditedItems(newEdits);
        modalActions.setIsBulkTitleModalOpen(false);
        aiActions.setBulkAiTitleCorrections(null);
        selectionActions.clearSelection();
    }, [editedItems, setEditedItems, modalActions, aiActions, selectionActions]);

    const [modalToOpen, setModalToOpen] = useState<string | null>(null);
    
    const handleBulkEditSelect = (field: string) => {
        modalActions.setBulkEditOpen(false);
        setModalToOpen(field);
    };

    useEffect(() => {
        if (modalToOpen) {
            const timer = setTimeout(() => {
                switch (modalToOpen) {
                    case 'Категорию': modalActions.setIsBulkCategoryModalOpen(true); break;
                    case 'Цену': modalActions.setIsBulkPriceModalOpen(true); break;
                    case 'Название': modalActions.setIsBulkTitleModalOpen(true); break;
                    case 'Описание': modalActions.setIsBulkDescriptionModalOpen(true); break;
                    case 'Старую цену': modalActions.setIsBulkOldPriceModalOpen(true); break;
                    case 'Подборку': modalActions.setIsBulkAlbumModalOpen(true); break;
                }
                setModalToOpen(null);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [modalToOpen, modalActions]);

    return {
        bulkActions: {
            initiateBulkDelete,
            handleConfirmBulkDelete,
            handleBulkCategoryUpdate,
            handleBulkPriceUpdate,
            handleBulkTitleUpdate,
            handleBulkDescriptionUpdate,
            handleBulkOldPriceUpdate,
            handleBulkAlbumUpdate,
            handleBulkAiDescriptionConfirm,
            handleBulkAiTitleConfirm,
            handleBulkEditSelect,
        }
    };
};
