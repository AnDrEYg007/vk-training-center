import { MarketItem, MarketAlbum } from '../../../shared/types';

// Вспомогательная функция для безопасного экранирования полей CSV
const escapeCsvField = (field: any): string => {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    // Если поле содержит запятую, двойную кавычку или перенос строки, заключаем его в двойные кавычки
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Также удваиваем все существующие двойные кавычки внутри поля
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

export const exportProductsToCsv = (items: MarketItem[], allAlbums: MarketAlbum[]): void => {
    if (items.length === 0) {
        window.showAppToast?.("Нет данных для скачивания.", 'info');
        return;
    }

    const headers = [
        'VK ID',
        'VK Link',
        'Название',
        'Описание',
        'Цена',
        'Старая цена',
        'Артикул',
        'Фото (URL)',
        'Подборка',
        'Категория',
    ];

    const albumMap = new Map(allAlbums.map(album => [album.id, album.title]));

    const rows = items.map(item => {
        // Конвертируем цены из копеек в рубли
        const price = (Number(item.price.amount) / 100).toFixed(2);
        const oldPrice = item.price.old_amount ? (Number(item.price.old_amount) / 100).toFixed(2) : '';
        
        const albumTitles = (item.album_ids || [])
            .map(albumId => {
                const title = albumMap.get(albumId);
                return title ? `${title} (${albumId})` : `(${albumId})`;
            })
            .join('; ');

        const category = item.category ? `${item.category.name} (${item.category.id})` : '';

        // Новые поля для ID и ссылки VK
        const vkId = `${item.owner_id}_${item.id}`;
        const vkLink = `https://vk.com/product${item.owner_id}_${item.id}`;

        return [
            escapeCsvField(vkId),
            escapeCsvField(vkLink),
            escapeCsvField(item.title),
            escapeCsvField(item.description),
            escapeCsvField(price),
            escapeCsvField(oldPrice),
            escapeCsvField(item.sku || ''),
            escapeCsvField(item.thumb_photo),
            escapeCsvField(albumTitles),
            escapeCsvField(category),
        ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');

    // Добавляем BOM (Byte Order Mark), чтобы Excel правильно распознавал UTF-8 и кириллицу
    const bom = '\uFEFF';
    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'products_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};