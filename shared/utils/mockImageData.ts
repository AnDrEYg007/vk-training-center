import { v4 as uuidv4 } from 'uuid';
import { Album, Photo } from '../types';

// FIX: Added missing 'size' property to each album object to match the Album type.
export const projectAlbums: Album[] = [
    { id: 'proj_team', name: 'Команда', size: 15 },
    { id: 'proj_products', name: 'Продукция', size: 42 },
    { id: 'proj_promos', name: 'Акции', size: 28 },
    { id: 'proj_misc', name: 'Разное', size: 9 },
];

// FIX: Added missing 'size' property to each album object to match the Album type.
export const agencyAlbums: Album[] = [
    { id: 'agency_couriers', name: 'Курьеры', size: 22 },
    { id: 'agency_sushi', name: 'Суши и роллы', size: 112 },
    { id: 'agency_pizza', name: 'Пицца', size: 78 },
    { id: 'agency_chefs', name: 'Повара', size: 31 },
    { id: 'agency_interior', name: 'Интерьер', size: 56 },
    { id: 'agency_lifestyle', name: 'Лайфстайл', size: 64 },
];

const PHOTO_PAGE_SIZE = 9;

export const getPhotosForAlbum = (albumId: string, page: number): Promise<Photo[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const photos: Photo[] = Array.from({ length: PHOTO_PAGE_SIZE }, (_, i) => {
                const photoIndex = (page - 1) * PHOTO_PAGE_SIZE + i;
                const id = `${albumId}-${photoIndex}`;
                // Используем постоянный seed для детерминированных "случайных" изображений
                const url = `https://picsum.photos/seed/${id}/400/400`;
                return { id, url };
            });
            resolve(photos);
        }, 500); // Имитируем задержку сети
    });
};