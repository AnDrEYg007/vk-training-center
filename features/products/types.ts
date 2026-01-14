import { MarketCategory, MarketItem } from "../../shared/types";

// Состояние для AI-помощника
export interface AiSuggestionState {
    isLoadingItemId: number | null;
    suggestion: {
        item: MarketItem;
        category: MarketCategory;
    } | null;
    error: string | null;
}

// Тип для строки, распарсенной из файла
export type NewProductRow = Partial<Omit<MarketItem, 'id' | 'owner_id' | 'price'>> & {
    tempId: string;
    price: string;
    old_price?: string;
    photoFile?: File;
    photoUrl?: string;
    photoPreview?: string;
    vk_id?: string;
    vk_link?: string;
};

// --- UPDATE TYPES ---

// Тип для сопоставления
export type MatchKey = 'vk_id' | 'vk_link' | 'title' | 'description' | 'sku';

// Результат сопоставления одной строки файла с базой
export interface RowMatchResult {
    fileRow: NewProductRow;
    matchedItem: MarketItem | null;
    matchedItems?: MarketItem[]; // Добавлено для неоднозначных совпадений
    matchType: 'exact' | 'ambiguous' | 'none'; // exact - 1 совпадение, ambiguous - >1, none - 0
    // Поля, которые будут обновлены (ключ - название поля, значение - новое значение)
    willUpdate: Partial<Record<keyof MarketItem | 'album_ids' | 'old_price', any>>; 
}

// Типы для результатов анализа файла (Legacy, можно будет удалить если полностью перейдем на новый UI)
export interface UnambiguousMatch {
    systemItem: MarketItem;
    fileRow: NewProductRow;
    changes: Partial<MarketItem>;
}

export interface AmbiguousMatch {
    fileRow: NewProductRow;
    matchedItems: MarketItem[];
}

export interface AnalysisResult {
    unambiguousMatches: UnambiguousMatch[];
    ambiguousMatches: AmbiguousMatch[];
    noMatches: NewProductRow[];
}

// Типы для модальных окон массового редактирования
export type BulkPriceUpdatePayload = {
    mode: 'set' | 'round' | 'change';
    setValue?: number; // в копейках
    roundTarget?: 0 | 5 | 9;
    roundDirection?: 'up' | 'down';
    changeAction?: 'increase' | 'decrease';
    changeType?: 'amount' | 'percent';
    changeValue?: number; // в копейках для amount
};

export type BulkOldPriceUpdatePayload = {
    mode: 'set' | 'round' | 'change' | 'from_current';
    setValue?: number;
    roundTarget?: 0 | 5 | 9;
    roundDirection?: 'up' | 'down';
    changeAction?: 'increase' | 'decrease';
    changeType?: 'amount' | 'percent';
    changeValue?: number;
    fromCurrentAction?: 'increase' | 'decrease';
    fromCurrentType?: 'amount' | 'percent';
    fromCurrentValue?: number;
};

export type BulkTitleUpdatePayload = {
    mode: 'insert' | 'delete';
    text: string;
    position?: 'start' | 'end';
};

export type BulkDescriptionUpdatePayload = {
    mode: 'insert' | 'delete';
    text: string;
    position?: 'start' | 'end';
};

// Новые типы для отчета о сохранении
export interface SaveResultItem {
    id: number;
    title: string;
    success: boolean;
    error?: string;
}

export interface SaveResultSummary {
    total: number;
    successCount: number;
    failedCount: number;
    results: SaveResultItem[];
}