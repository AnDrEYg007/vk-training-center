import { MarketItem, MarketAlbum, MarketCategory } from '../../../shared/types';
import { NewProductRow, AnalysisResult, MatchKey, RowMatchResult } from '../types';
import { parseProductFile } from './fileParser';

// Вспомогательная функция для сравнения цен в разных форматах (рубли из файла vs копейки из системы)
const arePricesEqual = (filePrice?: string, systemPrice?: string): boolean => {
    if ((filePrice === null || filePrice === undefined || filePrice === '') && (systemPrice === null || systemPrice === undefined || systemPrice === '')) {
        return true;
    }
    if (!filePrice || !systemPrice) return false;
    // Приводим все к копейкам и сравниваем как целые числа
    const fileKopecks = Math.round(parseFloat(String(filePrice).replace(',', '.')) * 100);
    const systemKopecks = parseInt(systemPrice, 10);
    return fileKopecks === systemKopecks;
};

/**
 * Основная функция для сопоставления строк файла с существующими товарами.
 * Работает синхронно с уже распарсенными строками.
 */
export const calculateRowMatches = (
    fileRows: NewProductRow[],
    systemItems: MarketItem[],
    matchKey: MatchKey,
    fieldsToUpdate: Set<keyof MarketItem | 'album_ids' | 'old_price'>,
    allAlbums: MarketAlbum[],
    allCategories: MarketCategory[] // Добавлен для сверки категорий
): RowMatchResult[] => {
    
    // 1. Создаем индекс системных товаров для быстрого поиска
    const systemIndex = new Map<string, MarketItem[]>();
    
    for (const item of systemItems) {
        let key: string | undefined;
        switch (matchKey) {
            case 'vk_id':
                key = `${item.owner_id}_${item.id}`; // Формат: -owner_id_itemId
                // Также поддержим формат просто ID, если в файле только ID
                if (!systemIndex.has(String(item.id))) systemIndex.set(String(item.id), []);
                systemIndex.get(String(item.id))!.push(item);
                break;
            case 'vk_link':
                key = `https://vk.com/product${item.owner_id}_${item.id}`;
                break;
            case 'title':
                key = item.title.trim().toLowerCase();
                break;
            case 'description':
                key = item.description.trim().toLowerCase();
                break;
            case 'sku':
                key = item.sku?.trim().toLowerCase();
                break;
        }
        
        if (key) {
            if (!systemIndex.has(key)) {
                systemIndex.set(key, []);
            }
            systemIndex.get(key)!.push(item);
        }
    }

    // 2. Проходим по строкам файла и ищем совпадения
    return fileRows.map(row => {
        let lookupKey: string | undefined;
        switch (matchKey) {
            case 'vk_id': lookupKey = row.vk_id?.trim(); break;
            case 'vk_link': lookupKey = row.vk_link?.trim(); break;
            case 'title': lookupKey = row.title?.trim().toLowerCase(); break;
            case 'description': lookupKey = row.description?.trim().toLowerCase(); break;
            case 'sku': lookupKey = row.sku?.trim().toLowerCase(); break;
        }

        const matches = lookupKey ? systemIndex.get(lookupKey) : undefined;
        
        let matchType: RowMatchResult['matchType'] = 'none';
        let matchedItem: MarketItem | null = null;
        let matchedItems: MarketItem[] | undefined = undefined;

        if (matches && matches.length === 1) {
            matchType = 'exact';
            matchedItem = matches[0];
        } else if (matches && matches.length > 1) {
            matchType = 'ambiguous';
            matchedItems = matches;
        }

        const willUpdate: RowMatchResult['willUpdate'] = {};

        if (matchType === 'exact' && matchedItem) {
            // Определяем, какие поля будут обновлены
            if (fieldsToUpdate.has('title') && row.title && row.title !== matchedItem.title) {
                willUpdate.title = row.title;
            }
            if (fieldsToUpdate.has('description') && row.description && row.description !== matchedItem.description) {
                willUpdate.description = row.description;
            }
            if (fieldsToUpdate.has('sku') && row.sku && row.sku !== (matchedItem.sku || '')) {
                willUpdate.sku = row.sku;
            }
            
            // Цена
            if (fieldsToUpdate.has('price') && row.price) {
                if (!arePricesEqual(row.price, matchedItem.price.amount)) {
                     const newPriceKopecks = Math.round(parseFloat(row.price.replace(',', '.')) * 100);
                     willUpdate.price = { ...matchedItem.price, amount: String(newPriceKopecks) };
                }
            }
            // Старая цена
            if (fieldsToUpdate.has('old_price') && row.old_price !== undefined) { // old_price может быть пустой строкой (сброс)
                 if (!arePricesEqual(row.old_price, matchedItem.price.old_amount)) {
                    const newOldPriceKopecks = row.old_price ? String(Math.round(parseFloat(row.old_price.replace(',', '.')) * 100)) : undefined;
                    // Если уже есть обновление цены, обновляем его, иначе берем текущую цену
                    const basePrice = willUpdate.price || matchedItem.price;
                    willUpdate.price = { ...basePrice, old_amount: newOldPriceKopecks };
                    willUpdate.old_price = row.old_price; // Устанавливаем маркер для подсветки
                }
            }

            // Категория
            if (fieldsToUpdate.has('category') && row.category) {
                if (row.category.id !== matchedItem.category.id) {
                    willUpdate.category = row.category;
                }
            }

            // Альбомы (Подборки)
            if (fieldsToUpdate.has('album_ids') && row.album_ids) {
                // Сравниваем массивы ID (полагаем, что в файле только 1 альбом или массив)
                const fileAlbumId = row.album_ids.length > 0 ? row.album_ids[0] : null;
                const systemAlbumId = matchedItem.album_ids && matchedItem.album_ids.length > 0 ? matchedItem.album_ids[0] : null;
                
                if (fileAlbumId !== systemAlbumId) {
                    willUpdate.album_ids = row.album_ids;
                }
            }
            
            // Фото (если есть URL) - для простоты пока только URL
            // В будущем можно добавить проверку на изменение
        }

        return {
            fileRow: row,
            matchedItem,
            matchedItems,
            matchType,
            willUpdate
        };
    });
};


// Legacy function (можно оставить для совместимости или удалить позже)
export const analyzeUpdateFile = async (
    file: File,
    systemItems: MarketItem[],
    allAlbums: MarketAlbum[],
    allCategories: MarketCategory[],
    matchKey: MatchKey,
    updateKeys: (keyof MarketItem)[]
): Promise<AnalysisResult> => {

    const fileRows = await parseProductFile(file, allAlbums, allCategories);
    if (fileRows.length === 0) {
        return { unambiguousMatches: [], ambiguousMatches: [], noMatches: [] };
    }
    
    // Для совместимости конвертируем результат calculateRowMatches обратно в AnalysisResult
    // Но лучше использовать новую функцию в модальном окне
    const fieldsSet = new Set(updateKeys);
    // @ts-ignore
    const matches = calculateRowMatches(fileRows, systemItems, matchKey, fieldsSet, allAlbums, allCategories);

    const unambiguousMatches: AnalysisResult['unambiguousMatches'] = [];
    const ambiguousMatches: AnalysisResult['ambiguousMatches'] = [];
    const noMatches: AnalysisResult['noMatches'] = [];

    for (const match of matches) {
        if (match.matchType === 'exact' && match.matchedItem) {
             if (Object.keys(match.willUpdate).length > 0) {
                 unambiguousMatches.push({
                     systemItem: match.matchedItem,
                     fileRow: match.fileRow,
                     changes: match.willUpdate
                 });
             }
        } else if (match.matchType === 'ambiguous') {
             // В новой логике мы не храним matchedItems для ambiguous, 
             // но для совместимости можно пустой массив или переделать логику
             ambiguousMatches.push({ fileRow: match.fileRow, matchedItems: [] });
        } else {
             noMatches.push(match.fileRow);
        }
    }

    return { unambiguousMatches, ambiguousMatches, noMatches };
};