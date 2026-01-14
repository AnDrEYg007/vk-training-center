
import React, { useState, useCallback } from 'react';
import * as api from '../../../services/api';
import { MarketItem, MarketAlbum } from '../../../shared/types';
import { PendingPhoto } from './useProductEditing';
import { SaveResultSummary, SaveResultItem } from '../types';

// FIX: Added explicit types for promise results to resolve type inference issues.
type UpdateSuccessResult = { id: number; title: string; success: true; data: MarketItem; action: 'update' };
type UpdateFailureResult = { id: number; title: string; success: false; error: string; action: 'update' };
type DeleteSuccessResult = { id: number; title: string; success: true; action: 'delete' };
type DeleteFailureResult = { id: number; title: string; success: false; error: string; action: 'delete' };

type ActionPromiseResult = UpdateSuccessResult | UpdateFailureResult | DeleteSuccessResult | DeleteFailureResult;

interface UseProductSavingProps {
    projectId: string;
    items: MarketItem[];
    albums: MarketAlbum[];
    editedItems: Record<string, Partial<MarketItem>>;
    pendingPhotos: Record<number, PendingPhoto>;
    itemsToDelete: Set<number>;
    setItems: React.Dispatch<React.SetStateAction<MarketItem[]>>;
    setAlbums: React.Dispatch<React.SetStateAction<MarketAlbum[]>>;
    setEditedItems: React.Dispatch<React.SetStateAction<Record<string, Partial<MarketItem>>>>;
    setPendingPhotos: React.Dispatch<React.SetStateAction<Record<number, PendingPhoto>>>;
    setItemsToDelete: React.Dispatch<React.SetStateAction<Set<number>>>;
    setCachedData: (value: { albums: MarketAlbum[]; items: MarketItem[]; } | null) => void;
    setItemToSave: (item: MarketItem | MarketItem[] | null) => void;
    setSaveResult: (result: SaveResultSummary | null) => void;
    setValidationErrors: React.Dispatch<React.SetStateAction<Record<number, string[]>>>; // Новый проп
}

/**
 * Хук, отвечающий за логику сохранения данных (одиночного и массового).
 */
export const useProductSaving = ({
    projectId,
    items,
    albums,
    editedItems,
    pendingPhotos,
    itemsToDelete,
    setItems,
    setAlbums,
    setEditedItems,
    setPendingPhotos,
    setItemsToDelete,
    setCachedData,
    setItemToSave,
    setSaveResult,
    setValidationErrors,
}: UseProductSavingProps) => {
    const [isSaving, setIsSaving] = useState(false);

    // Функция валидации одного товара
    const validateItem = (item: MarketItem): string[] => {
        const errors: string[] = [];
        if (!item.title || item.title.trim().length < 4) errors.push('title');
        if (!item.description || item.description.trim().length < 10) errors.push('description');
        // Проверка цены: должна быть числом > 0
        const priceNum = Number(item.price.amount);
        if (isNaN(priceNum) || priceNum <= 0) errors.push('price');
        
        // Проверка категории
        if (!item.category || !item.category.id) errors.push('category');

        return errors;
    };

    const handleSaveItem = useCallback(async (itemId: number, confirmed = false) => {
        const originalItem = items.find(i => i.id === itemId);
        if (!originalItem) return;
        
        const changes = editedItems[itemId];
        const pendingPhoto = pendingPhotos[itemId];

        if (!changes && !pendingPhoto && !confirmed) return;
        
        const itemWithChanges = { ...originalItem, ...changes };

        // ВАЛИДАЦИЯ
        const errors = validateItem(itemWithChanges as MarketItem);
        if (errors.length > 0) {
            setValidationErrors(prev => ({ ...prev, [itemId]: errors }));
            // Если мы были в модальном окне подтверждения, закрываем его
            if (confirmed) setItemToSave(null);
            // Не показываем алерт, так как поля подсветятся
            return;
        }

        if (!confirmed) {
            setItemToSave(itemWithChanges as MarketItem);
            return;
        }

        setIsSaving(true);
        try {
            // Определяем, что отправлять: файл или URL
            let fileToUpload: File | undefined;
            let urlToUpload: string | undefined;

            if (pendingPhoto) {
                if (pendingPhoto.sourceType === 'file') {
                    fileToUpload = pendingPhoto.file;
                } else if (pendingPhoto.sourceType === 'url') {
                    urlToUpload = pendingPhoto.url;
                }
            }

            const updatedItem = await api.updateMarketItem(projectId, itemWithChanges as MarketItem, fileToUpload, urlToUpload);
            
            // Обновляем состояние напрямую
            const newItems = items.map(i => i.id === updatedItem.id ? updatedItem : i);
            setItems(newItems);
            setCachedData({ albums, items: newItems });
            
            // Очищаем флаги изменений
            setEditedItems(prev => { const newEdits = { ...prev }; delete newEdits[itemId]; return newEdits; });
            setPendingPhotos(prev => { const newPendings = { ...prev }; delete newPendings[itemId]; return newPendings; });
            setValidationErrors(prev => { const newErrors = { ...prev }; delete newErrors[itemId]; return newErrors; });

        } catch (err) {
            window.showAppToast?.(`Не удалось сохранить товар: ${err instanceof Error ? err.message : 'Ошибка'}`, 'error');
        } finally {
            setIsSaving(false);
            setItemToSave(null);
        }
    }, [projectId, items, albums, editedItems, pendingPhotos, setItems, setEditedItems, setPendingPhotos, setItemToSave, setCachedData, setValidationErrors]);

    const handleSaveAll = useCallback(async (confirmed = false) => {
        const itemsToUpdateIds = new Set([...Object.keys(editedItems).map(Number), ...Object.keys(pendingPhotos).map(Number)]);
        
        // Исключаем удаляемые товары из списка обновления
        itemsToDelete.forEach(id => itemsToUpdateIds.delete(id));

        if (itemsToUpdateIds.size === 0 && itemsToDelete.size === 0) return;

        const itemsToUpdate = Array.from(itemsToUpdateIds).map(id => {
            const original = items.find(i => i.id === id);
            if (!original) return null;
            return { ...original, ...editedItems[id] } as MarketItem;
        }).filter((i): i is MarketItem => !!i);
        
        // ВАЛИДАЦИЯ ДЛЯ МАССОВОГО СОХРАНЕНИЯ
        const newValidationErrors: Record<number, string[]> = {};
        let hasErrors = false;

        itemsToUpdate.forEach(item => {
            const errors = validateItem(item);
            if (errors.length > 0) {
                newValidationErrors[item.id] = errors;
                hasErrors = true;
            }
        });

            if (hasErrors) {
            setValidationErrors(newValidationErrors);
            if (confirmed) setItemToSave(null);
            window.showAppToast?.("Некоторые товары содержат ошибки. Исправьте подсвеченные поля перед сохранением.", 'warning');
            return;
        }

        if (!confirmed) {
            setItemToSave(itemsToUpdate);
            return;
        }

        setIsSaving(true);
        
        // --- 1. Удаление ---
        const deletePromises = Array.from(itemsToDelete).map(itemId => {
            const itemTitle = items.find(i => i.id === itemId)?.title || `ID ${itemId}`;
            return api.deleteMarketItems(projectId, [itemId])
                .then((): DeleteSuccessResult => ({ id: itemId, title: itemTitle, success: true, action: 'delete' }))
                .catch((err): DeleteFailureResult => ({ id: itemId, title: itemTitle, success: false, error: String(err.message || 'Ошибка удаления'), action: 'delete' }));
        });

        // --- 2. Обновление ---
        const updatePromises = itemsToUpdate.map(item => {
            const pending = pendingPhotos[item.id];
            const file = pending?.sourceType === 'file' ? pending.file : undefined;
            const url = pending?.sourceType === 'url' ? pending.url : undefined;
            
            return api.updateMarketItem(projectId, item, file, url)
                .then((updatedItem): UpdateSuccessResult => ({ id: item.id, title: item.title, success: true, data: updatedItem, action: 'update' }))
                .catch((err): UpdateFailureResult => ({ id: item.id, title: item.title, success: false, error: String(err.message || 'Ошибка обновления'), action: 'update' }));
        });

        try {
            const allResults: ActionPromiseResult[] = await Promise.all([...updatePromises, ...deletePromises]);
            
            const successes = allResults.filter((r): r is UpdateSuccessResult | DeleteSuccessResult => r.success);
            const failures = allResults.filter((r): r is UpdateFailureResult | DeleteFailureResult => !r.success);
            
            if (successes.length > 0) {
                setItems(prevItems => {
                    const itemMap = new Map<number, MarketItem>(prevItems.map(i => [i.id, i]));

                    successes.forEach(res => {
                        if (res.action === 'delete') {
                            itemMap.delete(res.id);
                        } 
                        else if (res.action === 'update') {
                            itemMap.set(res.id, res.data);
                        }
                    });
                    
                    const newItemsList = Array.from(itemMap.values());
                    setCachedData({ albums, items: newItemsList });
                    return newItemsList;
                });

                const successIds = new Set(successes.map(r => r.id));
                
                setEditedItems(prev => {
                    const nextState = { ...prev };
                    successIds.forEach(id => delete nextState[id]);
                    return nextState;
                });
                setPendingPhotos(prev => {
                    const nextState = { ...prev };
                    successIds.forEach(id => delete nextState[id]);
                    return nextState;
                });
                setItemsToDelete(prev => {
                    const nextState = new Set(prev);
                    successIds.forEach(id => nextState.delete(id));
                    return nextState;
                });
                setValidationErrors(prev => {
                    const nextState = { ...prev };
                    successIds.forEach(id => delete nextState[id]);
                    return nextState;
                });
            }

            setSaveResult({
                total: allResults.length,
                successCount: successes.length,
                failedCount: failures.length,
                results: allResults as SaveResultItem[],
            });

        } catch (err) {
            console.error("Critical error during bulk save:", err);
            window.showAppToast?.(`Произошла критическая ошибка при сохранении: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`, 'error');
        } finally {
            setIsSaving(false);
            setItemToSave(null);
        }
    }, [projectId, items, albums, editedItems, pendingPhotos, itemsToDelete, setItems, setEditedItems, setPendingPhotos, setItemToSave, setItemsToDelete, setCachedData, setSaveResult, setValidationErrors]);

    return {
        savingState: {
            isSaving,
        },
        savingActions: {
            handleSaveItem,
            handleSaveAll,
        }
    };
};
