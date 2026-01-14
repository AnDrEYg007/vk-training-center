
// FIX: Import React to make React types like Dispatch and SetStateAction available.
import React, { useState, useCallback } from 'react';
import * as api from '../../../services/api';
import { MarketItem } from '../../../shared/types';
import { AiSuggestionState } from '../types';

interface UseProductAIProps {
    projectId: string;
    items: MarketItem[];
    selectedItemIds: Set<number>;
    setAiSuggestionState: React.Dispatch<React.SetStateAction<AiSuggestionState>>;
}

/**
 * Хук, инкапсулирующий всю AI-логику для раздела "Товары".
 */
export const useProductAI = ({ projectId, items, selectedItemIds, setAiSuggestionState }: UseProductAIProps) => {
    // Состояния для массовых AI операций
    const [isBulkAiSuggesting, setIsBulkAiSuggesting] = useState(false);
    const [bulkAiSuggestions, setBulkAiSuggestions] = useState<api.BulkSuggestionResult[] | null>(null);
    const [isBulkAiCorrecting, setIsBulkAiCorrecting] = useState(false);
    const [bulkAiCorrections, setBulkAiCorrections] = useState<{ itemId: number, originalText: string, correctedText: string }[] | null>(null);
    const [isBulkAiCorrectingTitles, setIsBulkAiCorrectingTitles] = useState(false);
    const [bulkAiTitleCorrections, setBulkAiTitleCorrections] = useState<{ itemId: number, originalText: string, correctedText: string }[] | null>(null);
    
    // Состояние для одиночной коррекции описания теперь не нужно здесь, 
    // так как загрузка управляется локально в DescriptionCell
    const [correctingDescriptionItemId, setCorrectingDescriptionItemId] = useState<number | null>(null);

    /**
     * Запускает AI-подбор категории для одного товара.
     */
    const handleAiSuggestCategory = useCallback(async (item: MarketItem) => {
        setAiSuggestionState({ isLoadingItemId: item.id, suggestion: null, error: null });
        try {
            const suggestedCategory = await api.suggestMarketCategory(projectId, item.title, item.description);
            setAiSuggestionState({ isLoadingItemId: null, suggestion: { item, category: suggestedCategory }, error: null });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка AI-помощника";
            window.showAppToast?.(`Не удалось предложить категорию: ${message}`, 'error');
            setAiSuggestionState({ isLoadingItemId: null, suggestion: null, error: message });
        }
    }, [projectId, setAiSuggestionState]);
    
    /**
     * Запускает AI-коррекцию описания для одного товара.
     * Возвращает Promise с исправленным текстом.
     */
    const handleAiCorrectSingleDescription = useCallback(async (itemId: number, currentDescription: string): Promise<string | null> => {
        try {
            // Используем существующий массовый API для одного элемента
            const corrections = await api.bulkCorrectDescriptions([{ id: itemId, description: currentDescription }]);
            if (corrections.length > 0) {
                return corrections[0].correctedText;
            }
            return null;
        } catch (err) {
             const message = err instanceof Error ? err.message : "Ошибка AI-помощника";
             window.showAppToast?.(`Не удалось исправить описание: ${message}`, 'error');
             return null;
        }
    }, []);


    /**
     * Запускает массовый AI-подбор категорий для выбранных товаров.
     */
    const handleBulkAiSuggestCategory = useCallback(async () => {
        if (selectedItemIds.size === 0) return;
        
        setIsBulkAiSuggesting(true);
        setBulkAiSuggestions(null);
        try {
            const itemsToSuggest = items
                .filter(item => selectedItemIds.has(item.id))
                .map(({ id, title, description }) => ({ id, title, description }));
            
            const suggestions = await api.bulkSuggestMarketCategory(projectId, itemsToSuggest);
            setBulkAiSuggestions(suggestions);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка AI-помощника";
            window.showAppToast?.(`Не удалось предложить категории: ${message}`, 'error');
            setBulkAiSuggestions(null);
        } finally {
            setIsBulkAiSuggesting(false);
        }
    }, [projectId, items, selectedItemIds]);

    /**
     * Запускает массовое AI-исправление описаний для выбранных товаров.
     */
    const handleBulkAiCorrectDescriptions = useCallback(async () => {
        if (selectedItemIds.size === 0) return;
        
        setIsBulkAiCorrecting(true);
        setBulkAiCorrections(null);
        try {
            const itemsToCorrect = items
                .filter(item => selectedItemIds.has(item.id))
                .map(({ id, description }) => ({ id, description }));

            const corrections = await api.bulkCorrectDescriptions(itemsToCorrect);
            
            const resultsWithOriginalText = corrections.map(correction => {
                const originalItem = items.find(item => item.id === correction.itemId);
                return {
                    itemId: correction.itemId,
                    originalText: originalItem?.description || '',
                    correctedText: correction.correctedText,
                };
            });

            setBulkAiCorrections(resultsWithOriginalText);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка AI-помощника";
            window.showAppToast?.(`Не удалось исправить описания: ${message}`, 'error');
            setBulkAiCorrections(null);
        } finally {
            setIsBulkAiCorrecting(false);
        }
    }, [items, selectedItemIds]);

    /**
     * Запускает массовое AI-исправление названий для выбранных товаров.
     */
    const handleBulkAiCorrectTitles = useCallback(async () => {
        if (selectedItemIds.size === 0) return;
        
        setIsBulkAiCorrectingTitles(true);
        setBulkAiTitleCorrections(null);
        try {
            const itemsToCorrect = items
                .filter(item => selectedItemIds.has(item.id))
                .map(({ id, title }) => ({ id, title }));

            const corrections = await api.bulkCorrectTitles(itemsToCorrect);
            
            const resultsWithOriginalText = corrections.map(correction => {
                const originalItem = items.find(item => item.id === correction.itemId);
                return {
                    itemId: correction.itemId,
                    originalText: originalItem?.title || '',
                    correctedText: correction.correctedText,
                };
            });

            setBulkAiTitleCorrections(resultsWithOriginalText);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Ошибка AI-помощника";
            window.showAppToast?.(`Не удалось исправить названия: ${message}`, 'error');
            setBulkAiTitleCorrections(null);
        } finally {
            setIsBulkAiCorrectingTitles(false);
        }
    }, [items, selectedItemIds]);


    return {
        aiState: {
            isBulkAiSuggesting,
            bulkAiSuggestions,
            isBulkAiCorrecting,
            bulkAiCorrections,
            isBulkAiCorrectingTitles,
            bulkAiTitleCorrections,
            correctingDescriptionItemId, 
        },
        aiActions: {
            handleAiSuggestCategory,
            handleBulkAiSuggestCategory,
            setBulkAiSuggestions,
            handleBulkAiCorrectDescriptions,
            setBulkAiCorrections,
            handleBulkAiCorrectTitles,
            setBulkAiTitleCorrections,
            handleAiCorrectSingleDescription, 
        }
    };
};
