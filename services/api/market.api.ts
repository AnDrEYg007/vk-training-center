
import { MarketAlbum, MarketItem, MarketCategory } from '../../shared/types';
import { callApi } from '../../shared/utils/apiClient';
import { API_BASE_URL } from '../../shared/config';

// Типы для массового AI-подбора
export interface SimpleMarketItem {
    id: number;
    title: string;
    description: string;
}

export interface BulkSuggestionResult {
    itemId: number;
    category: MarketCategory;
}

// Тип для AI-коррекции описаний
export interface BulkCorrectDescriptionPayload {
    id: number;
    description: string;
}

export interface BulkCorrectDescriptionResult {
    itemId: number;
    correctedText: string;
}

// Типы для AI-коррекции названий
export interface BulkCorrectTitlePayload {
    id: number;
    title: string;
}

export interface BulkCorrectTitleResult {
    itemId: number;
    correctedText: string;
}


// --- MARKET API ---

export const getMarketData = async (projectId: string): Promise<{ albums: MarketAlbum[], items: MarketItem[], categories: MarketCategory[] }> => {
    return callApi('market/getData', { projectId });
};

export const refreshMarketData = async (projectId: string): Promise<{ albums: MarketAlbum[], items: MarketItem[], categories: MarketCategory[] }> => {
    return callApi('market/refreshAll', { projectId });
};

export const getMarketCategories = async (): Promise<MarketCategory[]> => {
    return callApi('market/getCategories');
};

export const refreshMarketCategories = async (): Promise<{ success: boolean }> => {
    return callApi('market/refreshCategories');
};

export const updateMarketItem = async (projectId: string, item: MarketItem, file?: File, photoUrl?: string): Promise<MarketItem> => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('itemData', JSON.stringify(item));
    if (file) {
        formData.append('file', file);
    }
    if (photoUrl) {
        formData.append('photoUrl', photoUrl);
    }

    // Здесь мы не используем callApi, так как он заточен под JSON, а нам нужен multipart/form-data
    const response = await fetch(`${API_BASE_URL}/market/updateItem`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось обновить товар');
    }
    return response.json();
};

export const updateMarketItems = async (projectId: string, items: MarketItem[]): Promise<{ success: boolean }> => {
     return callApi('market/updateItems', { projectId, items });
};

export const suggestMarketCategory = async (projectId: string, title: string, description: string): Promise<MarketCategory> => {
    return callApi('market/ai/suggestCategory', { projectId, title, description });
};

export const bulkSuggestMarketCategory = async (projectId: string, items: SimpleMarketItem[]): Promise<BulkSuggestionResult[]> => {
    return callApi('market/ai/bulkSuggestCategory', { projectId, items });
};

export const bulkCorrectDescriptions = async (items: BulkCorrectDescriptionPayload[]): Promise<BulkCorrectDescriptionResult[]> => {
    return callApi('market/ai/bulkCorrectDescriptions', { items });
};

export const bulkCorrectTitles = async (items: BulkCorrectTitlePayload[]): Promise<BulkCorrectTitleResult[]> => {
    return callApi('market/ai/bulkCorrectTitles', { items });
};

export const createMarketAlbum = async (projectId: string, title: string): Promise<MarketAlbum> => {
    return callApi('market/createAlbum', { projectId, title });
};

export const createMarketItem = async (projectId: string, itemData: any, file?: File, photoUrl?: string, useDefaultImage?: boolean): Promise<MarketItem> => {
    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('itemData', JSON.stringify(itemData));
    if (file) {
        formData.append('file', file);
    }
    if (photoUrl) {
        formData.append('photoUrl', photoUrl);
    }
    if (useDefaultImage) {
        formData.append('useDefaultImage', 'true');
    }
    const response = await fetch(`${API_BASE_URL}/market/createItem`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Не удалось создать товар');
    }
    return response.json();
};

export const createMarketItems = async (projectId: string, items: any[]): Promise<{ success: boolean }> => {
    return callApi('market/createItems', { projectId, items });
};

export const deleteMarketItems = async (projectId: string, itemIds: number[]): Promise<{ success: boolean }> => {
    return callApi('market/deleteItems', { projectId, itemIds });
};
