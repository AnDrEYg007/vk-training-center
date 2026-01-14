
import { useState, useCallback, useMemo } from 'react';
import { MarketItem } from '../../../shared/types';
import { AiSuggestionState, NewProductRow, SaveResultSummary } from '../types';

/**
 * Хук, отвечающий за управление состояниями всех модальных окон и поповеров.
 */
export const useProductModals = () => {
    const [itemToSave, setItemToSave] = useState<MarketItem | MarketItem[] | null>(null);
    const [previewImage, setPreviewImage] = useState<MarketItem | null>(null);
    const [bulkDeleteConfirmation, setBulkDeleteConfirmation] = useState(0);
    
    const [isBulkEditOpen, setBulkEditOpen] = useState(false);
    const [isBulkCategoryModalOpen, setIsBulkCategoryModalOpen] = useState(false);
    const [isBulkPriceModalOpen, setIsBulkPriceModalOpen] = useState(false);
    const [isBulkTitleModalOpen, setIsBulkTitleModalOpen] = useState(false);
    const [isBulkDescriptionModalOpen, setIsBulkDescriptionModalOpen] = useState(false);
    const [isBulkOldPriceModalOpen, setIsBulkOldPriceModalOpen] = useState(false);
    const [isBulkAlbumModalOpen, setIsBulkAlbumModalOpen] = useState(false); 

    const [isCreateSingleModalOpen, setIsCreateSingleModalOpen] = useState(false);
    const [isCreateMultipleModalOpen, setIsCreateMultipleModalOpen] = useState(false);
    const [multipleCreateInitialRows, setMultipleCreateInitialRows] = useState<NewProductRow[] | null>(null);
    const [itemToCopy, setItemToCopy] = useState<MarketItem | null>(null);
    
    // Новое состояние для результатов сохранения
    const [saveResult, setSaveResult] = useState<SaveResultSummary | null>(null);
    
    const [aiSuggestionState, setAiSuggestionState] = useState<AiSuggestionState>({
        isLoadingItemId: null,
        suggestion: null,
        error: null,
    });

    const handleConfirmAiSuggestion = useCallback(() => {
        setAiSuggestionState({ isLoadingItemId: null, suggestion: null, error: null });
    }, []);

    const handleCancelAiSuggestion = useCallback(() => {
        setAiSuggestionState({ isLoadingItemId: null, suggestion: null, error: null });
    }, []);

    const handleBulkEditSelect = (field: string) => {
        setBulkEditOpen(false);
        setTimeout(() => {
            switch (field) {
                case 'Категорию': setIsBulkCategoryModalOpen(true); break;
                case 'Цену': setIsBulkPriceModalOpen(true); break;
                case 'Название': setIsBulkTitleModalOpen(true); break;
                case 'Описание': setIsBulkDescriptionModalOpen(true); break;
                case 'Старую цену': setIsBulkOldPriceModalOpen(true); break;
                case 'Подборку': setIsBulkAlbumModalOpen(true); break;
            }
        }, 100);
    };

    const openCreateMultipleModal = (initialRows: NewProductRow[] | null) => {
        setMultipleCreateInitialRows(initialRows);
        setIsCreateMultipleModalOpen(true);
    };

    const closeCreateMultipleModal = () => {
        setIsCreateMultipleModalOpen(false);
        setMultipleCreateInitialRows(null);
    };

    const modalActions = useMemo(() => ({
        setItemToSave,
        setPreviewImage,
        setBulkDeleteConfirmation,
        setBulkEditOpen,
        setIsBulkCategoryModalOpen,
        setIsBulkPriceModalOpen,
        setIsBulkTitleModalOpen,
        setIsBulkDescriptionModalOpen,
        setIsBulkOldPriceModalOpen,
        setIsBulkAlbumModalOpen,
        setAiSuggestionState,
        handleConfirmAiSuggestion,
        handleCancelAiSuggestion,
        setIsCreateSingleModalOpen,
        openCreateMultipleModal,
        closeCreateMultipleModal,
        setItemToCopy,
        handleBulkEditSelect,
        setSaveResult, // Экспортируем
    }), [handleBulkEditSelect]);

    return {
        modalState: {
            itemToSave,
            previewImage,
            bulkDeleteConfirmation,
            isBulkEditOpen,
            isBulkCategoryModalOpen,
            isBulkPriceModalOpen,
            isBulkTitleModalOpen,
            isBulkDescriptionModalOpen,
            isBulkOldPriceModalOpen,
            isBulkAlbumModalOpen,
            aiSuggestionState,
            isCreateSingleModalOpen,
            isCreateMultipleModalOpen,
            itemToCopy,
            multipleCreateInitialRows,
            saveResult, // Экспортируем
        },
        modalActions,
    };
};
