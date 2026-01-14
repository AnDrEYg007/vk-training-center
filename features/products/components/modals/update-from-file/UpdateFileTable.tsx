
import React, { useMemo } from 'react';
import { MarketItem, MarketAlbum, MarketCategory } from '../../../../../shared/types';
import { NewProductRow, RowMatchResult, MatchKey } from '../../../types';
import { AlbumSelector } from '../../AlbumSelector';
import { CategorySelector } from '../../CategorySelector';
import { GroupedCategory } from '../../../hooks/useProductCategories';

interface UpdateFileTableProps {
    data: RowMatchResult[];
    emptyMessage: string;
    allAlbums: MarketAlbum[];
    allCategories: MarketCategory[];
    matchKey?: MatchKey;
    resolutions: Map<string, number>;
    onResolveConflict: (fileRowTempId: string, systemItemId: number | null) => void;
    onCellChange: (fileRowTempId: string, field: keyof NewProductRow, value: any) => void;
    validationErrors?: Record<string, string[]>;
}

export const UpdateFileTable: React.FC<UpdateFileTableProps> = ({ 
    data, 
    emptyMessage, 
    allAlbums, 
    allCategories, 
    matchKey, 
    resolutions, 
    onResolveConflict, 
    onCellChange, 
    validationErrors = {} 
}) => {
    
    const groupedCategories = useMemo(() => {
        if (!allCategories) return [];
        const groups: Record<string, GroupedCategory> = {};
        allCategories.forEach(cat => {
            const sectionName = cat.section_name;
            if (!groups[sectionName]) {
                groups[sectionName] = { section_name: sectionName, categories: [] };
            }
            groups[sectionName].categories.push(cat);
        });
        return Object.values(groups);
    }, [allCategories]);

    const matchKeyToLabel: Record<MatchKey, string> = {
        vk_id: 'ID VK',
        vk_link: 'ссылкой',
        title: 'названием',
        description: 'описанием',
        sku: 'артикулом',
    };
    const conflictLabel = matchKey ? matchKeyToLabel[matchKey] || 'ключом' : 'ключом';

    const conflictingField = matchKey ? {
        'title': 'title',
        'description': 'description',
        'sku': 'sku',
    }[matchKey] : undefined;

    // Вспомогательная функция для получения текста ошибки
    const getErrorMessage = (field: string): string | undefined => {
        switch (field) {
            case 'title': return 'Минимум 4 символа';
            case 'description': return 'Минимум 10 символов';
            case 'price': return 'Укажите цену';
            case 'category': return 'Выберите категорию';
            default: return undefined;
        }
    };

    const getDisplayValue = (item: MarketItem | NewProductRow, field: keyof NewProductRow, isSystem: boolean) => {
        if (isSystem) {
            const sysItem = item as MarketItem;
            if (field === 'price') return `${(Number(sysItem.price.amount) / 100)}`;
            if (field === 'old_price') return sysItem.price.old_amount ? `${(Number(sysItem.price.old_amount) / 100)}` : '';
            if (field === 'album_ids') {
                const albId = sysItem.album_ids?.[0];
                return albId ? (allAlbums.find(a => a.id === albId)?.title || String(albId)) : '—';
            }
            if (field === 'category') return sysItem.category?.name || '—';
            // @ts-ignore
            return String(sysItem[field] || '');
        } else {
            const fileRow = item as NewProductRow;
             if (field === 'album_ids') {
                 const albId = fileRow.album_ids?.[0];
                 return albId ? (allAlbums.find(a => a.id === albId)?.title || String(albId)) : '—';
             }
             if (field === 'category') return fileRow.category?.name || '—';
             // @ts-ignore
             return String(fileRow[field] || '');
        }
    };

    const getCellClass = (match: RowMatchResult, field: keyof NewProductRow, isSystemRow: boolean) => {
        const { matchType, matchedItem, willUpdate } = match;
        const isPair = matchType === 'exact' && matchedItem;
        const isChanging = isPair && willUpdate[field as keyof typeof willUpdate];
        
        if (isChanging) {
            return isSystemRow 
                ? 'bg-red-100 text-red-900 opacity-70'
                : 'bg-green-100 text-green-900 font-medium';
        }
        return isSystemRow ? 'text-gray-500' : 'text-gray-900';
    };

    const renderCellContent = (match: RowMatchResult, field: keyof NewProductRow, isSystemRow: boolean) => {
        const { matchType, matchedItem, willUpdate, fileRow } = match;
        const value = getDisplayValue(isSystemRow ? matchedItem! : fileRow, field, isSystemRow);
    
        if (isSystemRow) {
            return <p className="truncate" title={value}>{value}</p>;
        }
    
        const errorsForRow = validationErrors[fileRow.tempId] || [];
        const hasError = errorsForRow.includes(field as string);
        const isChanging = !!(matchType === 'exact' && matchedItem && willUpdate[field as keyof typeof willUpdate]);

        const commonInputClass = `w-full p-1 border rounded-md focus:outline-none focus:ring-2 text-sm bg-transparent ${
            hasError
                ? 'border-red-500 focus:ring-red-500'
                : isChanging
                    ? 'border-green-400 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-indigo-500'
        }`;

        const renderError = () => {
            if (!hasError) return null;
            const msg = getErrorMessage(field as string);
            return msg ? <div className="text-[10px] text-red-500 leading-tight mt-0.5">{msg}</div> : null;
        };
        
        let content;

        if (field === 'album_ids') {
            const currentAlbum = allAlbums.find(a => a.id === (fileRow.album_ids?.[0] || -1)) || null;
            content = (
                <div className={`h-9 rounded-md ${hasError ? 'ring-1 ring-red-500' : ''}`}>
                    <AlbumSelector 
                        value={currentAlbum} 
                        options={allAlbums} 
                        onChange={(album) => onCellChange(fileRow.tempId, 'album_ids', album ? [album.id] : [])}
                        onOpen={() => {}} 
                        isLoading={false} 
                    />
                </div>
            );
        } else if (field === 'category') {
            content = (
                <div className={`h-9 rounded-md ${hasError ? 'ring-1 ring-red-500' : ''}`}>
                    <CategorySelector 
                        value={fileRow.category || null} 
                        options={groupedCategories} 
                        onChange={(cat) => onCellChange(fileRow.tempId, 'category', {id: cat.id, name: cat.name, section: {id: cat.section_id, name: cat.section_name}})} 
                        onOpen={() => {}} 
                        isLoading={!allCategories} 
                        title={hasError ? 'Категория обязательна' : undefined}
                    />
                </div>
            );
        } else if (field === 'description') {
            content = <textarea value={value} onChange={(e) => onCellChange(fileRow.tempId, field, e.target.value)} className={`${commonInputClass} custom-scrollbar resize-y min-h-[2.25rem]`} rows={1}/>;
        } else if (field === 'price' || field === 'old_price') {
            content = <input type="number" value={value} onChange={(e) => onCellChange(fileRow.tempId, field, e.target.value)} className={`${commonInputClass} no-spinners`}/>;
        } else {
            content = <input type="text" value={value} onChange={(e) => onCellChange(fileRow.tempId, field, e.target.value)} className={commonInputClass}/>;
        }

        return (
            <div className="w-full">
                {content}
                {renderError()}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg bg-white">
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: '200px' }} /> {/* Статус */}
                    <col style={{ width: '200px' }} /> {/* Название */}
                    <col style={{ width: '100px' }} /> {/* Цена */}
                    <col style={{ width: '100px' }} /> {/* Старая цена */}
                    <col style={{ width: '120px' }} /> {/* Артикул */}
                    <col style={{ width: '150px' }} /> {/* Подборка */}
                    <col style={{ width: '150px' }} /> {/* Категория */}
                    <col style={{ width: '300px' }} /> {/* Описание */}
                </colgroup>
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Старая цена</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Артикул</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Подборка</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="px-4 py-8 text-center text-gray-500 italic">{emptyMessage}</td>
                        </tr>
                    ) : (
                        data.map((match, idx) => {
                            const { matchType, matchedItem, willUpdate, fileRow, matchedItems } = match;
                            const changesCount = Object.keys(willUpdate).length;

                            if (matchType === 'ambiguous' && matchedItems && matchedItems.length > 0) {
                                const isResolved = resolutions.has(fileRow.tempId);
                                return ( <React.Fragment key={fileRow.tempId || idx}> <tr className="border-b border-gray-200 bg-green-50"> <td className="px-4 py-3 align-top border-r border-gray-200"> <div className="flex items-start text-green-700"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /> </svg> <div> <span className="text-xs font-bold uppercase tracking-wide">Строка из файла</span> <p className="text-xs text-gray-600 mt-1">Данные для загрузки</p> </div> </div> </td> <td className={`px-4 py-2 text-gray-900 font-medium align-top ${conflictingField === 'title' ? 'bg-red-100' : ''}`}>{renderCellContent(match, 'title', false)}</td> <td className="px-4 py-2 text-gray-900 font-medium align-top">{renderCellContent(match, 'price', false)}</td> <td className="px-4 py-2 text-gray-900 font-medium align-top">{renderCellContent(match, 'old_price', false)}</td> <td className={`px-4 py-2 text-gray-900 font-medium align-top ${conflictingField === 'sku' ? 'bg-red-100' : ''}`}>{renderCellContent(match, 'sku', false)}</td> <td className="px-4 py-2 text-gray-900 font-medium align-top">{renderCellContent(match, 'album_ids', false)}</td> <td className="px-4 py-2 text-gray-900 font-medium align-top">{renderCellContent(match, 'category', false)}</td> <td className={`px-4 py-2 text-gray-900 font-medium align-top ${conflictingField === 'description' ? 'bg-red-100' : ''}`}>{renderCellContent(match, 'description', false)}</td> </tr> {matchedItems.map((systemItem, itemIdx) => { const isSelectedForResolution = resolutions.get(fileRow.tempId) === systemItem.id; return ( <tr key={systemItem.id} onClick={() => onResolveConflict(fileRow.tempId, isSelectedForResolution ? null : systemItem.id)} className={`cursor-pointer transition-colors ${ isSelectedForResolution ? 'bg-blue-100' : 'bg-gray-50 hover:bg-gray-100' } ${itemIdx === matchedItems.length - 1 ? 'border-b-4 border-gray-300' : ''}`} > {itemIdx === 0 && ( <td rowSpan={matchedItems.length} className="px-4 py-3 align-top border-r border-gray-200"> {isResolved ? ( <div className="flex items-start text-blue-700"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> <div> <span className="text-xs font-bold uppercase tracking-wide">Конфликт разрешен</span> <p className="text-xs text-gray-600 mt-1">Выбран товар для обновления. Кликните по нему снова, чтобы отменить выбор.</p> </div> </div> ) : ( <div className="flex items-start text-red-700"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg> <div> <span className="text-xs font-bold uppercase tracking-wide">Конфликт ({matchedItems.length})</span> <p className="text-xs text-gray-600 mt-1">Найдены товары с таким же {conflictLabel}. Кликните на нужный, чтобы выбрать его для обновления.</p> </div> </div> )} </td> )} <td className={`px-4 py-2 text-gray-700 truncate align-top ${conflictingField === 'title' ? 'bg-red-100' : ''}`} title={getDisplayValue(systemItem, 'title', true)}>{getDisplayValue(systemItem, 'title', true)}</td> <td className="px-4 py-2 text-gray-700 align-top">{getDisplayValue(systemItem, 'price', true)}</td> <td className="px-4 py-2 text-gray-700 align-top">{getDisplayValue(systemItem, 'old_price', true)}</td> <td className={`px-4 py-2 text-gray-700 align-top ${conflictingField === 'sku' ? 'bg-red-100' : ''}`}>{getDisplayValue(systemItem, 'sku', true)}</td> <td className="px-4 py-2 text-gray-700 truncate align-top" title={getDisplayValue(systemItem, 'album_ids', true)}>{getDisplayValue(systemItem, 'album_ids', true)}</td> <td className="px-4 py-2 text-gray-700 truncate align-top" title={getDisplayValue(systemItem, 'category', true)}>{getDisplayValue(systemItem, 'category', true)}</td> <td className={`px-4 py-2 text-gray-700 truncate align-top ${conflictingField === 'description' ? 'bg-red-100' : ''}`} title={getDisplayValue(systemItem, 'description', true)}>{getDisplayValue(systemItem, 'description', true)}</td> </tr> ); })} </React.Fragment> ); }

                            if (matchType === 'exact' && matchedItem) {
                                if (changesCount === 0) {
                                    return ( <tr key={fileRow.tempId || idx} className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"> <td className="px-4 py-3 align-top border-r border-gray-200 bg-white"> <div className="flex items-center text-gray-500 mb-1.5"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /> </svg> <span className="text-xs font-medium">Найдено</span> </div> <div className="text-xs text-gray-500 w-full mb-2 space-y-1"> <p><span className="font-semibold">ID:</span> {matchedItem!.id}</p> </div> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"> Без изменений </span> </td> <td className="px-4 py-2 border-r border-gray-100 truncate text-gray-500 align-top">{getDisplayValue(matchedItem!, 'title', true)}</td> <td className="px-4 py-2 border-r border-gray-100 text-gray-500 align-top">{getDisplayValue(matchedItem!, 'price', true)}</td> <td className="px-4 py-2 border-r border-gray-100 text-gray-500 align-top">{getDisplayValue(matchedItem!, 'old_price', true)}</td> <td className="px-4 py-2 border-r border-gray-100 text-gray-500 align-top">{getDisplayValue(matchedItem!, 'sku', true)}</td> <td className="px-4 py-2 border-r border-gray-100 truncate text-gray-500 align-top">{getDisplayValue(matchedItem!, 'album_ids', true)}</td> <td className="px-4 py-2 border-r border-gray-100 truncate text-gray-500 align-top">{getDisplayValue(matchedItem!, 'category', true)}</td> <td className="px-4 py-2 truncate text-gray-500 align-top">{getDisplayValue(matchedItem!, 'description', true)}</td> </tr> );
                                }

                                return ( <React.Fragment key={fileRow.tempId || idx}> <tr className="group"> <td rowSpan={2} className="px-4 py-3 align-top border-r border-gray-200 bg-white border-b border-gray-200 group-last:border-b-0"> <div className="flex items-center text-green-600 mb-1.5"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"> <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /> </svg> <span className="text-xs font-bold uppercase tracking-wide">Найдено</span> </div> <div className="text-xs text-gray-500 w-full mb-2 space-y-1"> <p><span className="font-semibold">ID товара:</span> {matchedItem!.id}</p> <p className="truncate" title={matchedItem!.title}><span className="font-semibold">В системе:</span> {matchedItem!.title}</p> </div> <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"> Изменений: {changesCount} </span> </td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'title', true)}`}>{renderCellContent(match, 'title', true)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'price', true)}`}>{renderCellContent(match, 'price', true)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'old_price', true)}`}>{renderCellContent(match, 'old_price', true)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'sku', true)}`}>{renderCellContent(match, 'sku', true)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'album_ids', true)}`}>{renderCellContent(match, 'album_ids', true)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'category', true)}`}>{renderCellContent(match, 'category', true)}</td> <td className={`px-4 py-2 align-top ${getCellClass(match, 'description', true)}`}>{renderCellContent(match, 'description', true)}</td> </tr> <tr className="border-b border-gray-200 group-last:border-b-0"> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'title', false)}`}>{renderCellContent(match, 'title', false)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'price', false)}`}>{renderCellContent(match, 'price', false)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'old_price', false)}`}>{renderCellContent(match, 'old_price', false)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'sku', false)}`}>{renderCellContent(match, 'sku', false)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'album_ids', false)}`}>{renderCellContent(match, 'album_ids', false)}</td> <td className={`px-4 py-2 border-r border-gray-100 align-top ${getCellClass(match, 'category', false)}`}>{renderCellContent(match, 'category', false)}</td> <td className={`px-4 py-2 align-top ${getCellClass(match, 'description', false)}`}>{renderCellContent(match, 'description', false)}</td> </tr> </React.Fragment> );
                            } else { // 'none'
                                return ( <tr key={fileRow.tempId || idx} className="border-b border-gray-200 last:border-b-0"> <td className="px-4 py-3 align-top border-r border-gray-200 bg-gray-50/50"> <div className="flex items-center text-gray-500"> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <div> <span className="text-xs font-bold uppercase tracking-wide">Не найдено</span> </div> </div> </td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'title', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'price', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'old_price', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'sku', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'album_ids', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'category', false)}</td> <td className="px-4 py-2 align-top">{renderCellContent(match, 'description', false)}</td> </tr> );
                            }
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};
