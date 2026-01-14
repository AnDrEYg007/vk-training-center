
import React from 'react';
import { NewProductRow } from '../../../types';
import { MarketAlbum } from '../../../../../shared/types';
import { GroupedCategory } from '../../../hooks/useProductCategories';
import { AlbumSelector } from '../../AlbumSelector';
import { CategorySelector } from '../../CategorySelector';
import { PhotoCell } from './PhotoCell';

// Базовый класс для инпутов (высота h-9 = 36px)
const BASE_INPUT_CLASS = "w-full h-9 px-2 border rounded-md focus:outline-none focus:ring-2 text-sm bg-white no-spinners transition-colors";

interface ProductRowProps {
    row: NewProductRow;
    albums: MarketAlbum[];
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    rowsCount: number;
    errors?: string[]; // Список полей с ошибками валидации для этой строки
    serverError?: string; // Текст ошибки с сервера
    
    // Handlers
    onRowChange: (tempId: string, field: keyof NewProductRow, value: any) => void;
    onRemoveRow: (tempId: string) => void;
    onCopyRow: (tempId: string) => void;
    onDescriptionEdit: (tempId: string) => void;
    
    // Photo Logic
    urlInputValue: string;
    onUrlChange: (tempId: string, value: string) => void;
    onUrlBlur: (tempId: string) => void;
    onClearPhoto: (tempId: string) => void;
    
    // Selection
    isSelected: boolean;
    onToggleSelection: (tempId: string) => void;
}

export const ProductRow: React.FC<ProductRowProps> = ({
    row, albums, groupedCategories, areCategoriesLoading, loadCategories, rowsCount, errors = [], serverError,
    onRowChange, onRemoveRow, onCopyRow, onDescriptionEdit,
    urlInputValue, onUrlChange, onUrlBlur, onClearPhoto,
    isSelected, onToggleSelection
}) => {
    
    const handleFileChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            onRowChange(row.tempId, 'photoPreview', reader.result as string);
            onRowChange(row.tempId, 'photoUrl', undefined);
        };
        reader.readAsDataURL(file);
        onRowChange(row.tempId, 'photoFile', file);
    };

    // Функция для генерации классов валидации
    const getInputClass = (fieldName: string) => {
        const hasError = errors.includes(fieldName);
        return `${BASE_INPUT_CLASS} ${
            hasError 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        }`;
    };

    // Функция для получения текста ошибки
    const getErrorMessage = (fieldName: string): string | undefined => {
        if (!errors.includes(fieldName)) return undefined;
        
        switch (fieldName) {
            case 'title': return 'Минимум 4 символа';
            case 'description': return 'Минимум 10 символов';
            case 'price': return 'Укажите цену';
            case 'category': return 'Выберите категорию';
            case 'photo': return 'Нет фото';
            default: return 'Ошибка';
        }
    };
    
    const renderError = (fieldName: string) => {
        const msg = getErrorMessage(fieldName);
        if (!msg) return null;
        return (
            <div className="text-[10px] text-red-500 leading-tight mt-0.5">
                {msg}
            </div>
        );
    };

    // Подсветка строки при ошибке сервера или выделении
    let rowBgClass = 'hover:bg-gray-50';
    if (serverError) rowBgClass = 'bg-red-50';
    else if (isSelected) rowBgClass = 'bg-indigo-50 hover:bg-indigo-100';

    return (
        <tr 
            className={`transition-colors cursor-pointer ${rowBgClass}`}
            onClick={() => onToggleSelection(row.tempId)}
        >
            {/* ЧЕКБОКС */}
            <td className="p-3 align-top text-center" onClick={(e) => e.stopPropagation()}>
                <div className="h-9 flex items-center justify-center">
                    <input 
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelection(row.tempId)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer h-4 w-4"
                    />
                </div>
            </td>

            {/* ДЕЙСТВИЯ (КОПИРОВАТЬ / УДАЛИТЬ) */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <div className="h-9 flex items-center justify-center gap-1">
                     <button 
                        onClick={() => onCopyRow(row.tempId)} 
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" 
                        title="Копировать товар"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => onRemoveRow(row.tempId)} 
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Удалить строку"
                        disabled={rowsCount <= 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </td>

            {/* ФОТО */}
            <PhotoCell 
                row={row} 
                urlInputValue={urlInputValue} 
                inputClass={getInputClass('photo')}
                onUrlChange={(val) => onUrlChange(row.tempId, val)}
                onUrlBlur={() => onUrlBlur(row.tempId)}
                onClear={() => onClearPhoto(row.tempId)}
                onFileChange={handleFileChange}
                hasError={errors.includes('photo')}
                errorMessage={getErrorMessage('photo')}
            />
            
            {/* НАЗВАНИЕ */}
            <td className="p-2 align-top relative" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="text" 
                    value={row.title || ''} 
                    onChange={e => onRowChange(row.tempId, 'title', e.target.value)} 
                    className={getInputClass('title')} 
                    placeholder="Товар" 
                />
                {renderError('title')}
            </td>
            
            {/* ОПИСАНИЕ */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1 h-9">
                    <input 
                        type="text"
                        value={row.description || ''} 
                        onChange={e => onRowChange(row.tempId, 'description', e.target.value)} 
                        className={getInputClass('description')} 
                        placeholder="Описание..."
                    />
                    <button
                        onClick={() => onDescriptionEdit(row.tempId)}
                        className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors flex-shrink-0 h-9 w-9 flex items-center justify-center"
                        title="Открыть редактор (AI, переменные)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
                {renderError('description')}
            </td>
            
            {/* ЦЕНА */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="number" 
                    value={row.price} 
                    onChange={e => onRowChange(row.tempId, 'price', e.target.value)} 
                    className={getInputClass('price')} 
                    placeholder="0"
                />
                {renderError('price')}
            </td>
            
            {/* СТАРАЯ ЦЕНА */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="number" 
                    value={row.old_price || ''} 
                    onChange={e => onRowChange(row.tempId, 'old_price', e.target.value)} 
                    className={getInputClass('old_price')} 
                    placeholder="Необяз." 
                />
            </td>
            
            {/* АРТИКУЛ */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="text" 
                    value={row.sku || ''} 
                    onChange={e => onRowChange(row.tempId, 'sku', e.target.value)} 
                    className={getInputClass('sku')} 
                    placeholder="Необяз." 
                />
            </td>
            
            {/* ПОДБОРКА */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                <div className="h-9">
                    <AlbumSelector
                        value={albums.find(a => a.id === (row.album_ids?.[0] || -1)) || null}
                        options={albums}
                        onChange={(album) => onRowChange(row.tempId, 'album_ids', album ? [album.id] : [])}
                        onOpen={() => {}}
                        isLoading={false}
                    />
                </div>
            </td>
            
            {/* КАТЕГОРИЯ */}
            <td className="p-2 align-top" onClick={(e) => e.stopPropagation()}>
                 <div className={`h-9 rounded-md ${errors.includes('category') ? 'ring-1 ring-red-500 focus-within:ring-2 focus-within:ring-red-500' : ''}`}>
                    <CategorySelector
                        value={row.category || null}
                        options={groupedCategories}
                        onChange={(cat) => onRowChange(row.tempId, 'category', {id: cat.id, name: cat.name, section: {id: cat.section_id, name: cat.section_name}})}
                        onOpen={loadCategories}
                        isLoading={areCategoriesLoading}
                        title={getErrorMessage('category')}
                    />
                </div>
                {renderError('category')}
            </td>
        </tr>
    );
};
