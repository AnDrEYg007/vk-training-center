import { MarketItem, MarketAlbum } from '../../../shared/types';

// Объявляем глобальную переменную XLSX, чтобы TypeScript не ругался
declare var XLSX: any;

export const exportProductsToXlsx = (items: MarketItem[], allAlbums: MarketAlbum[]): void => {
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
        const price = Number((Number(item.price.amount) / 100).toFixed(2));
        const oldPrice = item.price.old_amount ? Number((Number(item.price.old_amount) / 100).toFixed(2)) : '';
        
        const albumTitles = (item.album_ids || [])
            .map(albumId => {
                const title = albumMap.get(albumId);
                return title ? `${title} (${albumId})` : `(${albumId})`;
            })
            .join('; ');

        const category = item.category ? `${item.category.name} (${item.category.id})` : '';

        const vkId = `${item.owner_id}_${item.id}`;
        const vkLink = `https://vk.com/product${item.owner_id}_${item.id}`;

        return [
            vkId,
            vkLink,
            item.title,
            item.description,
            price,
            oldPrice,
            item.sku || '',
            item.thumb_photo,
            albumTitles,
            category,
        ];
    });

    // Создаем лист
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    // Создаем книгу
    const workbook = XLSX.utils.book_new();
    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Товары');

    // Генерируем и скачиваем файл
    XLSX.writeFile(workbook, 'products_export.xlsx');
};