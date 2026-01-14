
import React, { useMemo } from 'react';
import { MarketItem, MarketAlbum } from '../../../shared/types';
import { ColumnDefinition } from '../hooks/useColumnManager';
import { ProductRow } from './table/ProductRow';
import { useProductCategories } from '../hooks/useProductCategories';
import { AiSuggestionState } from '../types';
import { PendingPhoto } from '../hooks/useProductEditing';

// Компонент таблицы товаров
export const ProductsTable: React.FC<{
    items: MarketItem[];
    albums: MarketAlbum[];
    editedItems: Record<string, Partial<MarketItem>>;
    onItemChange: (itemId: number, field: keyof MarketItem, value: any) => void;
    onSaveItem: (itemId: number) => void;
    onCopyItem: (item: MarketItem) => void; 
    onPreviewImage: (item: MarketItem) => void;
    isSavingAll: boolean;
    tableRef: React.RefObject<HTMLTableElement>;
    isInitialized: boolean;
    columnWidths: Record<string, number>;
    handleMouseDown: (key: string, e: React.MouseEvent) => void;
    columns: ColumnDefinition[];
    visibleColumns: Record<string, boolean>;
    pendingPhotos: Record<number, PendingPhoto>;
    onSelectNewPhoto: (itemId: number, file: File) => void;
    onPhotoUrlChange: (itemId: number, url: string) => void;
    onClearNewPhoto: (itemId: number) => void;
    isSelectionMode: boolean;
    selectedItemIds: Set<number>;
    onToggleItemSelection: (itemId: number) => void;
    onItemDoubleClick: (itemId: number) => void;
    aiSuggestionState: AiSuggestionState;
    onAiSuggestCategory: (item: MarketItem) => void;
    itemsToDelete: Set<number>;
    onToggleItemDeletion: (itemId: number) => void;
    onAiCorrectDescription: (itemId: number, currentDescription: string) => Promise<string | null>;
    correctingDescriptionItemId: number | null;
    validationErrors: Record<number, string[]>; // Новый проп
}> = ({ 
    items, albums, editedItems, onItemChange, onSaveItem, onCopyItem,
    onPreviewImage, isSavingAll, tableRef, isInitialized, 
    columnWidths, handleMouseDown, columns, visibleColumns,
    pendingPhotos, onSelectNewPhoto, onPhotoUrlChange, onClearNewPhoto,
    isSelectionMode, selectedItemIds, onToggleItemSelection,
    onItemDoubleClick,
    aiSuggestionState, onAiSuggestCategory,
    itemsToDelete, onToggleItemDeletion,
    onAiCorrectDescription, correctingDescriptionItemId,
    validationErrors
}) => {
    
    const { groupedCategories, areCategoriesLoading, loadCategories } = useProductCategories();
    
    const Resizer: React.FC<{ columnKey: string }> = ({ columnKey }) => (
        <div
            className="absolute top-0 right-0 h-full w-2 cursor-col-resize select-none"
            onMouseDown={(e) => handleMouseDown(columnKey, e)}
        >
            <div className="w-px h-full bg-gray-300 group-hover:bg-indigo-500 transition-colors"></div>
        </div>
    );

    const visibleCols = useMemo(() => columns.filter(col => visibleColumns[col.key] || (col.key === 'selection' && isSelectionMode)), [columns, visibleColumns, isSelectionMode]);

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            <table
                ref={tableRef}
                className="w-full text-sm"
                style={{ tableLayout: isInitialized ? 'fixed' : 'auto' }}
            >
                 {isInitialized && (
                    <colgroup>
                        {visibleCols.map(col => (
                            <col key={col.key} style={{ width: `${columnWidths[col.key]}px` }} />
                        ))}
                    </colgroup>
                 )}
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                         {visibleCols.map(col => (
                            <th 
                                key={col.key}
                                data-key={col.key}
                                className="group relative px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
                            >
                                {col.key === 'selection' ? '' : col.label}
                                {isInitialized && <Resizer columnKey={col.key} />}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {items.map((item, index) => (
                        <ProductRow
                            key={item.id}
                            item={item}
                            index={index}
                            albums={albums}
                            editedItems={editedItems}
                            onItemChange={onItemChange}
                            onSaveItem={onSaveItem}
                            onCopyItem={onCopyItem}
                            onPreviewImage={onPreviewImage}
                            isSavingAll={isSavingAll}
                            visibleColumns={visibleColumns}
                            pendingPhotos={pendingPhotos}
                            onSelectNewPhoto={onSelectNewPhoto}
                            onPhotoUrlChange={onPhotoUrlChange}
                            onClearNewPhoto={onClearNewPhoto}
                            groupedCategories={groupedCategories}
                            areCategoriesLoading={areCategoriesLoading}
                            loadCategories={loadCategories}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedItemIds.has(item.id)}
                            onToggleSelection={onToggleItemSelection}
                            onItemDoubleClick={onItemDoubleClick}
                            aiSuggestionState={aiSuggestionState}
                            onAiSuggestCategory={onAiSuggestCategory}
                            isMarkedForDeletion={itemsToDelete.has(item.id)}
                            onToggleDeletion={onToggleItemDeletion}
                            onAiCorrectDescription={onAiCorrectDescription}
                            isCorrectingDescription={correctingDescriptionItemId === item.id}
                            errors={validationErrors[item.id] || []} // Передаем ошибки для конкретной строки
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
