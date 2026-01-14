import React from 'react';
import { MarketItem } from '../../../../shared/types';

/**
 * @fileoverview Компонент для отображения ячейки с текущей фотографией товара.
 */
export const PhotoCell: React.FC<{
    item: MarketItem;
    onPreviewImage: (item: MarketItem) => void;
}> = ({ item, onPreviewImage }) => {
    return (
        <button
            onClick={() => onPreviewImage(item)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded h-14 w-14"
        >
            <img src={item.thumb_photo} alt={item.title} className="h-14 w-14 object-cover rounded" />
        </button>
    );
};
