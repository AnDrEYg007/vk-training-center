
import React from 'react';
import { MarketItem, MarketAlbum, MarketCategory, MarketPrice } from '../../../../shared/types';
import { GroupedCategory } from '../../hooks/useProductCategories';

import { ActionCell } from './ActionCell';
import { PhotoCell } from './PhotoCell';
import { NewPhotoCell } from './NewPhotoCell';
import { DescriptionCell } from './DescriptionCell';
import { PriceCell, OldPriceCell } from './PriceCell';
import { AlbumSelector } from '../AlbumSelector';
import { AiCategoryCell } from './AiCategoryCell';
import { AiSuggestionState } from '../../types';
import { PendingPhoto } from '../../hooks/useProductEditing';

/**
 * @fileoverview Компонент, отвечающий за отображение одной строки (`<tr>`) в таблице товаров.
 * Он является "умной" строкой, которая управляет состоянием своих ячеек.
 */
export const ProductRow: React.FC<{
    item: MarketItem;
    index: number;
    albums: MarketAlbum[];
    editedItems: Record<string, Partial<MarketItem>>;
    onItemChange: (itemId: number, field: keyof MarketItem, value: any) => void;
    onSaveItem: (itemId: number) => void;
    onCopyItem: (item: MarketItem) => void; 
    onPreviewImage: (item: MarketItem) => void;
    isSavingAll: boolean;
    visibleColumns: Record<string, boolean>;
    pendingPhotos: Record<number, PendingPhoto>;
    onSelectNewPhoto: (itemId: number, file: File) => void;
    onPhotoUrlChange: (itemId: number, url: string) => void;
    onClearNewPhoto: (itemId: number) => void;
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    isSelectionMode: boolean;
    isSelected: boolean;
    onToggleSelection: (itemId: number) => void;
    onItemDoubleClick: (itemId: number) => void;
    aiSuggestionState: AiSuggestionState;
    onAiSuggestCategory: (item: MarketItem) => void;
    isMarkedForDeletion: boolean;
    onToggleDeletion: (itemId: number) => void;
    onAiCorrectDescription: (itemId: number, currentDescription: string) => Promise<string | null>;
    isCorrectingDescription: boolean;
    errors: string[]; // Новый проп для ошибок
}> = ({
    item, index, albums, editedItems, onItemChange, onSaveItem, onCopyItem,
    onPreviewImage, isSavingAll, visibleColumns, pendingPhotos,
    onSelectNewPhoto, onPhotoUrlChange, onClearNewPhoto, groupedCategories, areCategoriesLoading, loadCategories,
    isSelectionMode, isSelected, onToggleSelection, onItemDoubleClick,
    aiSuggestionState, onAiSuggestCategory,
    isMarkedForDeletion, onToggleDeletion,
    onAiCorrectDescription, isCorrectingDescription,
    errors
}) => {
    const isDirty = !!editedItems[item.id] || !!pendingPhotos[item.id];
    const currentData = { ...item, ...editedItems[item.id] };
    const { title, sku, description, album_ids, category, price } = currentData;
    
    const firstAlbumId = album_ids?.[0];
    const currentAlbum = firstAlbumId ? albums.find(a => a.id === firstAlbumId) || null : null;
    
    const pendingPhotoUrl = pendingPhotos[item.id]?.dataUrl;

    // Хелперы для классов ошибок
    const getInputClass = (baseClass: string, field: string) => {
        if (errors.includes(field)) {
            return `${baseClass} border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50`;
        }
        return baseClass;
    };

    // Хелпер для текста ошибки
    const renderError = (field: string) => {
        if (!errors.includes(field)) return null;
        let msg = '';
        switch(field) {
            case 'title': msg = 'Мин. 4 символа'; break;
            case 'description': msg = 'Мин. 10 символов'; break;
            case 'price': msg = 'Цена обязательна'; break;
            case 'category': msg = 'Выберите категорию'; break;
            default: msg = 'Ошибка';
        }
        return <div className="text-[10px] text-red-500 leading-tight mt-0.5">{msg}</div>;
    };

    const inputClasses = "w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white disabled:bg-gray-100/70 disabled:cursor-default";

    const handleRowClick = () => {
        if (isSelectionMode) {
            onToggleSelection(item.id);
        }
    };
    
    let rowClasses = `border-b border-gray-50 last:border-b-0 transition-colors opacity-0 animate-fade-in-up`;
    if (isMarkedForDeletion) {
        rowClasses += ' bg-red-100 opacity-50';
    } else if (isSelected) {
        rowClasses += ' bg-indigo-100';
    } else if (isDirty) {
        rowClasses += ' bg-amber-50';
    } else {
        rowClasses += ' hover:bg-gray-50';
    }
    if (isSelectionMode) rowClasses += ' cursor-pointer';


    return (
        <tr 
            onClick={handleRowClick}
            onDoubleClick={() => onItemDoubleClick(item.id)}
            className={rowClasses}
            style={{ animationDelay: `${index * 20}ms` }}
        >
            {visibleColumns.actions && <td className="px-4 py-2 align-top">
                <div className={isSelectionMode ? 'opacity-30 pointer-events-none' : ''}>
                    <ActionCell 
                        isDirty={isDirty}
                        isSavingAll={isSavingAll}
                        isMarkedForDeletion={isMarkedForDeletion}
                        onSave={() => onSaveItem(item.id)}
                        onCopy={() => onCopyItem(item)}
                        onSelectFile={(file) => onSelectNewPhoto(item.id, file)}
                        onToggleDeletion={() => onToggleDeletion(item.id)}
                    />
                </div>
            </td>}
            {visibleColumns.photo && <td className="px-4 py-2 align-top">
                <PhotoCell item={item} onPreviewImage={onPreviewImage} />
            </td>}
            {visibleColumns.new_photo && <td className="px-4 py-2 align-top">
                <NewPhotoCell 
                    dataUrl={pendingPhotoUrl} 
                    onUrlChange={(url) => onPhotoUrlChange(item.id, url)}
                    onClear={() => onClearNewPhoto(item.id)}
                />
            </td>}
            {visibleColumns.title && <td className="px-4 py-2 align-top">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => onItemChange(item.id, 'title', e.target.value)}
                    className={getInputClass(inputClasses, 'title')}
                    disabled={isSelectionMode || isMarkedForDeletion}
                />
                {renderError('title')}
            </td>}
            {visibleColumns.description && <td className="px-4 py-2 align-top">
                <div className={isSelectionMode || isMarkedForDeletion ? 'opacity-30 pointer-events-none' : ''}>
                    <DescriptionCell 
                        value={description} 
                        onChange={(value) => onItemChange(item.id, 'description', value)}
                        onAiCorrect={() => onAiCorrectDescription(item.id, description)}
                        error={errors.includes('description')} // Пробрасываем ошибку
                    />
                    {renderError('description')}
                </div>
            </td>}
            {visibleColumns.price && <td className="px-4 py-2 align-top">
                 <PriceCell
                    price={price}
                    onChange={(newPrice) => onItemChange(item.id, 'price', newPrice)}
                    disabled={isSelectionMode || isMarkedForDeletion}
                    error={errors.includes('price')} // Пробрасываем ошибку
                 />
                 {renderError('price')}
            </td>}
            {visibleColumns.old_price && <td className="px-4 py-2 align-top">
                <OldPriceCell 
                    price={price}
                    onChange={(newPrice) => onItemChange(item.id, 'price', newPrice)}
                    disabled={isSelectionMode || isMarkedForDeletion}
                />
            </td>}
            {visibleColumns.sku && <td className="px-4 py-2 align-top">
                <input
                    type="text"
                    value={sku || ''}
                    onChange={(e) => onItemChange(item.id, 'sku', e.target.value)}
                    className={inputClasses}
                    placeholder="Артикул товара"
                    disabled={isSelectionMode || isMarkedForDeletion}
                />
            </td>}
            {visibleColumns.albums && <td className="px-4 py-2 align-top">
                <AlbumSelector
                    value={currentAlbum}
                    options={albums}
                    onChange={(album) => {
                        const newAlbumIds = album ? [album.id] : [];
                        onItemChange(item.id, 'album_ids', newAlbumIds);
                    }}
                    onOpen={() => {}}
                    isLoading={false}
                    disabled={isSelectionMode || isMarkedForDeletion}
                />
            </td>}
             {visibleColumns.category && <td className="px-4 py-2 align-top">
                <AiCategoryCell
                    item={currentData}
                    groupedCategories={groupedCategories}
                    areCategoriesLoading={areCategoriesLoading}
                    loadCategories={loadCategories}
                    onItemChange={onItemChange}
                    onAiSuggest={() => onAiSuggestCategory(item)}
                    isAiLoading={aiSuggestionState.isLoadingItemId === item.id}
                    disabled={isSelectionMode || isMarkedForDeletion}
                    error={errors.includes('category')} // Пробрасываем ошибку
                />
                {renderError('category')}
            </td>}
            {visibleColumns.vk_link && <td className="px-4 py-2 align-top">
                <div className={isSelectionMode ? 'opacity-30 pointer-events-none' : ''}>
                    <a 
                        href={`https://vk.com/product${item.owner_id}_${item.id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-1 border border-gray-300 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors"
                        title="Открыть товар в VK"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>
            </td>}
            {visibleColumns.rating && <td className="px-4 py-2 align-top text-gray-600">
                {item.rating != null && item.rating > 0 ? (
                    <div className="flex items-center gap-1 mt-2">
                        <svg className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="font-bold text-sm">{item.rating.toFixed(2)}</span>
                        {item.reviews_count != null && (
                            <span className="text-xs text-gray-500">({item.reviews_count})</span>
                        )}
                    </div>
                ) : (
                    <span className="text-xs text-gray-400 mt-2 block">—</span>
                )}
            </td>}
        </tr>
    );
};
