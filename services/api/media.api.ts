import { Album, Photo, PhotoAttachment } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';
import { API_BASE_URL } from '../../shared/config';

// --- MEDIA API ---

/**
 * Загружает фотоальбомы для проекта (из кеша или VK).
 */
export const getAlbums = async (projectId: string): Promise<Album[]> => {
    return callApi<Album[]>('media/getAlbums', { projectId });
}

/**
 * Принудительно обновляет список альбомов из VK.
 */
export const refreshAlbums = async (projectId: string): Promise<Album[]> => {
    return callApi<Album[]>('media/refreshAlbums', { projectId });
}

/**
 * Загружает фотографии для альбома (из кеша или VK).
 */
export const getPhotos = async (projectId: string, albumId: string, page: number): Promise<{ photos: Photo[], hasMore: boolean }> => {
    return callApi<{ photos: Photo[], hasMore: boolean }>('media/getPhotos', { projectId, albumId, page });
}

/**
 * Принудительно обновляет фотографии в альбоме из VK.
 */
export const refreshPhotos = async (projectId: string, albumId: string): Promise<{ photos: Photo[], hasMore: boolean }> => {
    return callApi<{ photos: Photo[], hasMore: boolean }>('media/refreshPhotos', { projectId, albumId });
}

/**
 * Создает новый фотоальбом.
 */
export const createAlbum = async (projectId: string, title: string): Promise<Album> => {
    return callApi<Album>('media/createAlbum', { projectId, title });
};


/**
 * Загружает одно фото на сервер VK через наш бэкенд.
 */
export const uploadPhoto = async (file: File, projectId: string): Promise<PhotoAttachment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);

    const url = `${API_BASE_URL}/media/uploadPhoto`;
    console.log(`🚀 Uploading file to: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            const errorText = result.detail || `HTTP error! status: ${response.status}`;
            throw new Error(errorText);
        }
        
        console.log(`✅ File uploaded successfully for project ${projectId}`);
        return result as PhotoAttachment;
    } catch (error) {
        console.error(`Ошибка при загрузке файла для проекта ${projectId}:`, error);
        throw error; // Пробрасываем ошибку для обработки в компоненте
    }
};

/**
 * Загружает одно фото в конкретный альбом VK через наш бэкенд.
 */
export const uploadPhotoToAlbum = async (file: File, projectId: string, albumId: string): Promise<Photo> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    formData.append('albumId', albumId);

    const url = `${API_BASE_URL}/media/uploadPhotoToAlbum`;
    console.log(`🚀 Uploading file to album ${albumId} via: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            const errorText = result.detail || `HTTP error! status: ${response.status}`;
            throw new Error(errorText);
        }
        
        console.log(`✅ File uploaded to album ${albumId} successfully`);
        return result as Photo;
    } catch (error) {
        console.error(`Ошибка при загрузке файла в альбом ${albumId}:`, error);
        throw error;
    }
};
