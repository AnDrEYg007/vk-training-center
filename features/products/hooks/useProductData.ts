import { useState, useEffect, useCallback } from 'react';
import * as api from '../../../services/api';
import { MarketAlbum, MarketItem } from '../../../shared/types';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';

/**
 * Хук, отвечающий за загрузку, кеширование и хранение основных данных
 * для раздела "Товары" (товары и подборки).
 */
export const useProductData = (projectId: string) => {
    const storageKey = `market-data-${projectId}`;
    const [cachedData, setCachedData] = useLocalStorage<{ albums: MarketAlbum[], items: MarketItem[] } | null>(storageKey, null);

    const isCacheValid = !!cachedData;

    const [albums, setAlbums] = useState<MarketAlbum[]>(isCacheValid ? cachedData!.albums : []);
    const [items, setItems] = useState<MarketItem[]>(isCacheValid ? cachedData!.items : []);
    const [isLoading, setIsLoading] = useState(!isCacheValid);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (forceRefresh = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const apiCall = forceRefresh ? api.refreshMarketData : api.getMarketData;
            const data = await apiCall(projectId);
            setAlbums(data.albums);
            setItems(data.items);
            setCachedData({ albums: data.albums, items: data.items });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Не удалось загрузить товары.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, setCachedData]);

    // Первоначальная загрузка, если нет кеша
    useEffect(() => {
        if (!isCacheValid) {
            fetchData(false);
        }
    }, [projectId, isCacheValid, fetchData]);

    // Обновление кеша при изменении данных
    useEffect(() => {
        setCachedData({ albums, items });
    }, [albums, items, setCachedData]);
    
    const handleRefreshAll = useCallback(async () => {
        await fetchData(true);
    }, [fetchData]);

    return {
        dataState: {
            albums,
            items,
            isLoading,
            error,
        },
        dataActions: {
            handleRefreshAll,
            setItems,
            setAlbums,
            setCachedData,
        }
    };
};