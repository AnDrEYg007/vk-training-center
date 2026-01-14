
import { useState, useMemo } from 'react';
import { MarketItem, MarketAlbum } from '../../../shared/types';

/**
 * Хук, отвечающий за фильтрацию и поиск товаров.
 */
export const useProductFiltering = (items: MarketItem[], albums: MarketAlbum[]) => {
    const [activeAlbumId, setActiveAlbumId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        
        const searched = query
            ? items.filter(item => {
                const albumTitles = item.album_ids
                    .map(id => albums.find(a => a.id === id)?.title || '')
                    .join(' ')
                    .toLowerCase();

                return (
                    item.title?.toLowerCase().includes(query) ||
                    item.description?.toLowerCase().includes(query) ||
                    item.sku?.toLowerCase().includes(query) ||
                    String(Number(item.price?.amount) / 100).includes(query) ||
                    (item.price?.old_amount && String(Number(item.price.old_amount) / 100).includes(query)) ||
                    item.category?.name?.toLowerCase().includes(query) ||
                    item.category?.section_name?.toLowerCase().includes(query) ||
                    albumTitles.includes(query)
                );
            })
            : items;
        
        if (activeAlbumId === 'all') {
            return searched;
        }
        
        if (activeAlbumId === 'none') {
            return searched.filter(item => !item.album_ids || item.album_ids.length === 0);
        }

        return searched.filter(item => item.album_ids.includes(Number(activeAlbumId)));
    }, [items, albums, searchQuery, activeAlbumId]);

    return {
        filterState: {
            activeAlbumId,
            searchQuery,
            filteredItems,
        },
        filterActions: {
            setActiveAlbumId,
            setSearchQuery,
        }
    };
};
