import { v4 as uuidv4 } from 'uuid';
import { NewProductRow } from '../types';
import { MarketAlbum, MarketCategory } from '../../../shared/types';

// Объявляем глобальную переменную XLSX
declare var XLSX: any;

// Карта для автоматического сопоставления заголовков (в нижнем регистре)
export const HEADER_MAP: Record<string, string> = {
    'vk id': 'vk_id',
    'vk link': 'vk_link',
    'название': 'title',
    'описание': 'description',
    'цена': 'price',
    'старая цена': 'old_price',
    'артикул': 'sku',
    'фото (url)': 'photoUrl',
    'подборка': 'album',
    'категория': 'category',
};

/**
 * Парсит файл и возвращает очищенную прямоугольную сетку данных.
 * Гарантирует отсутствие смещения колонок даже при пустых ячейках A1 или пустых первых строках.
 */
export const parseFileToGrid = async (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                
                if (!worksheet) {
                    resolve([]);
                    return;
                }

                // 1. Принудительно определяем диапазон начиная с A1, чтобы индексы не поплыли
                const range = XLSX.utils.decode_range(worksheet['!ref'] || "A1");
                range.s.r = 0; // Начать с 0-й строки (A1)
                range.s.c = 0; // Начать с 0-й колонки (A)
                const forcedRange = XLSX.utils.encode_range(range);

                // 2. Получаем данные в виде 2D массива с фиксированным диапазоном
                // defval: "" гарантирует, что пустые ячейки внутри строк не будут пропущены
                const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { 
                    header: 1, 
                    defval: "",
                    range: forcedRange,
                    blankrows: true 
                });

                if (!rawRows || rawRows.length === 0) {
                    resolve([]);
                    return;
                }

                // 3. Находим индекс первой строки, которая содержит хоть какие-то данные (наш заголовок)
                const firstContentRowIndex = rawRows.findIndex(row => 
                    Array.isArray(row) && row.some(cell => String(cell || '').trim() !== '')
                );

                if (firstContentRowIndex === -1) {
                    resolve([]);
                    return;
                }

                // 4. Обрезаем только пустые строки в самом начале
                const contentRows = rawRows.slice(firstContentRowIndex);

                // 5. Вычисляем максимальную ширину среди всех строк для нормализации
                const maxCols = contentRows.reduce((max, row) => Math.max(max, row.length), 0);

                // 6. Формируем финальную прямоугольную сетку (все строки одной длины)
                const grid: string[][] = contentRows.map(row => {
                    const normalizedRow = Array(maxCols).fill("");
                    row.forEach((cell, i) => {
                        normalizedRow[i] = (cell !== null && cell !== undefined) ? String(cell).trim() : "";
                    });
                    return normalizedRow;
                });

                // 7. Удаляем полностью пустые строки в конце
                let lastNonEmptyRow = grid.length - 1;
                while (lastNonEmptyRow >= 0 && !grid[lastNonEmptyRow].some(cell => cell !== "")) {
                    lastNonEmptyRow--;
                }
                
                resolve(lastNonEmptyRow >= 0 ? grid.slice(0, lastNonEmptyRow + 1) : []);

            } catch (error) {
                console.error("File parse error:", error);
                reject(new Error("Не удалось прочитать файл. Убедитесь, что он в формате CSV или XLSX."));
            }
        };
        reader.onerror = () => reject(new Error("Ошибка чтения файла."));
        reader.readAsArrayBuffer(file);
    });
};

/**
 * Парсит файл и сразу конвертирует его в массив объектов NewProductRow.
 * Используется в упрощенном режиме загрузки "Создать новые".
 */
export const parseProductFile = async (
    file: File, 
    allAlbums: MarketAlbum[], 
    allCategories: MarketCategory[]
): Promise<NewProductRow[]> => {
    const grid = await parseFileToGrid(file);
    if (grid.length < 2) return [];

    const headers = grid[0].map(h => h.toLowerCase().trim());
    const dataRows = grid.slice(1);

    const albumMap = new Map(allAlbums.map(a => [a.title.toLowerCase(), a]));
    const categoryNameMap = new Map(allCategories.map(c => [c.name.toLowerCase(), c]));
    const categoryIdMap = new Map(allCategories.map(c => [c.id, c]));

    return dataRows.map(row => {
        const newRow: any = { tempId: uuidv4(), price: '' };
        headers.forEach((header, index) => {
            const fieldKey = HEADER_MAP[header];
            if (!fieldKey) return;

            const value = row[index];
            if (!value) return;

            if (fieldKey === 'album') {
                const albumName = value.split('(')[0].trim().toLowerCase();
                const album = albumMap.get(albumName);
                if (album) newRow.album_ids = [album.id];
            } else if (fieldKey === 'category') {
                const valStr = String(value);
                const idMatch = valStr.match(/\((\d+)\)$/);
                let category: MarketCategory | undefined;
                if (idMatch) category = categoryIdMap.get(parseInt(idMatch[1], 10));
                if (!category) category = categoryNameMap.get(valStr.split('(')[0].trim().toLowerCase());
                if (category) newRow.category = { id: category.id, name: category.name, section_id: category.section_id, section_name: category.section_name };
            } else if (fieldKey === 'photoUrl') {
                newRow.photoUrl = value;
                newRow.photoPreview = value;
            } else {
                newRow[fieldKey] = value;
            }
        });
        return newRow as NewProductRow;
    });
};