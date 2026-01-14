import { useState, useCallback, useRef } from 'react';
import { MarketItem } from '../../../shared/types';

/**
 * Хук, отвечающий за управление состоянием выбора (selection).
 */
export const useProductSelection = (filteredItems: MarketItem[]) => {
    const ignoreNextClickRef = useRef(false);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());

    const clearSelection = useCallback(() => {
        setSelectedItemIds(new Set());
    }, []);

    const toggleSelectionMode = useCallback(() => {
        setIsSelectionMode(prev => {
            if (prev) {
                clearSelection();
            }
            return !prev;
        });
    }, [clearSelection]);

    const toggleItemSelection = useCallback((itemId: number) => {
        if (ignoreNextClickRef.current) {
            ignoreNextClickRef.current = false;
            return;
        }
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    }, []);

    const handleItemDoubleClick = useCallback((itemId: number) => {
        if (isSelectionMode) return;
        setIsSelectionMode(true);
        setSelectedItemIds(new Set([itemId]));
        ignoreNextClickRef.current = true;
    }, [isSelectionMode]);

    const selectAllVisibleItems = useCallback(() => {
        const visibleIds = filteredItems.map(item => item.id);
        setSelectedItemIds(new Set(visibleIds));
    }, [filteredItems]);

    return {
        selectionState: {
            isSelectionMode,
            selectedItemIds,
        },
        selectionActions: {
            setIsSelectionMode,
            setSelectedItemIds,
            toggleSelectionMode,
            toggleItemSelection,
            handleItemDoubleClick,
            selectAllVisibleItems,
            clearSelection,
        }
    };
};