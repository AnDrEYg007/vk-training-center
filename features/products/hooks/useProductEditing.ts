
import { useState, useCallback } from 'react';
import { MarketItem } from '../../../shared/types';

export interface PendingPhoto {
    file?: File;
    dataUrl: string;
    sourceType: 'file' | 'url';
    url?: string;
}

/**
 * Хук, отвечающий за управление состоянием редактирования:
 * отслеживает измененные поля, новые фотографии и товары к удалению.
 */
export const useProductEditing = () => {
    const [editedItems, setEditedItems] = useState<Record<string, Partial<MarketItem>>>({});
    const [pendingPhotos, setPendingPhotos] = useState<Record<number, PendingPhoto>>({});
    const [itemsToDelete, setItemsToDelete] = useState<Set<number>>(new Set());
    // Новое состояние для ошибок валидации: itemId -> массив названий полей с ошибками
    const [validationErrors, setValidationErrors] = useState<Record<number, string[]>>({});

    const handleItemChange = useCallback((itemId: number, field: keyof MarketItem, value: any) => {
        setEditedItems(prev => ({
            ...prev,
            [itemId]: {
                ...prev[itemId],
                [field]: value,
            },
        }));

        // Мгновенно убираем ошибку для этого поля, если она была
        setValidationErrors(prev => {
            if (!prev[itemId]) return prev;
            const itemErrors = prev[itemId];
            if (itemErrors.includes(field as string)) {
                const newErrors = itemErrors.filter(e => e !== field);
                if (newErrors.length === 0) {
                    const newState = { ...prev };
                    delete newState[itemId];
                    return newState;
                }
                return { ...prev, [itemId]: newErrors };
            }
            return prev;
        });
    }, []);

    const handleSelectNewPhoto = useCallback((itemId: number, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                setPendingPhotos(prev => ({
                    ...prev,
                    [itemId]: { 
                        file, 
                        dataUrl: reader.result as string,
                        sourceType: 'file'
                    },
                }));
            }
        };
        reader.readAsDataURL(file);
    }, []);

    const handlePhotoUrlChange = useCallback((itemId: number, url: string) => {
        // Мы просто сохраняем URL как dataUrl для превью. 
        // Валидация происходит в компоненте UI (NewPhotoCell) перед вызовом этого метода,
        // либо мы надеемся, что браузер сможет отобразить это в <img>.
        setPendingPhotos(prev => ({
            ...prev,
            [itemId]: {
                dataUrl: url,
                sourceType: 'url',
                url: url
            }
        }));
    }, []);

    const clearPendingPhoto = useCallback((itemId: number) => {
        setPendingPhotos(prev => {
            const newState = { ...prev };
            delete newState[itemId];
            return newState;
        });
    }, []);

    const toggleItemDeletion = useCallback((itemId: number) => {
        setItemsToDelete(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);


    return {
        editingState: {
            editedItems,
            pendingPhotos,
            itemsToDelete,
            validationErrors, // Экспортируем ошибки
        },
        editingActions: {
            setEditedItems,
            setPendingPhotos,
            setItemsToDelete,
            setValidationErrors, // Экспортируем сеттер для useProductSaving
            handleItemChange,
            handleSelectNewPhoto,
            handlePhotoUrlChange, 
            clearPendingPhoto,    
            toggleItemDeletion,
        }
    };
};
