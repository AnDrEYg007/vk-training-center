import { useState, useMemo, useCallback } from 'react';
import * as api from '../../../services/api';
import { MarketCategory } from '../../../shared/types';

// Тип для сгруппированных категорий, используемый в селекторе
export interface GroupedCategory {
    section_name: string;
    categories: MarketCategory[];
}

/**
 * @fileoverview Хук для управления состоянием и загрузкой категорий товаров.
 * 
 * @returns {object} Объект, содержащий все состояния и обработчики для работы с категориями.
 * @property {MarketCategory[]} allCategories - Плоский список всех категорий.
 * @property {GroupedCategory[]} groupedCategories - Категории, сгруппированные по секциям для отображения в UI.
 * @property {boolean} areCategoriesLoading - Флаг, указывающий на процесс загрузки категорий.
 * @property {function} loadCategories - Функция для асинхронной загрузки категорий с сервера.
 */
export const useProductCategories = () => {
    const [allCategories, setAllCategories] = useState<MarketCategory[]>([]);
    const [areCategoriesLoading, setAreCategoriesLoading] = useState(false);

    const loadCategories = useCallback(async () => {
        if (allCategories.length > 0 || areCategoriesLoading) {
            return;
        }
        setAreCategoriesLoading(true);
        try {
            const fetchedCategories = await api.getMarketCategories();
            setAllCategories(fetchedCategories);
        } catch (error) {
            console.error("Failed to load market categories", error);
            window.showAppToast?.("Не удалось загрузить категории товаров. Попробуйте обновить страницу.", 'error');
        } finally {
            setAreCategoriesLoading(false);
        }
    }, [allCategories.length, areCategoriesLoading]);

    const groupedCategories = useMemo(() => {
        if (allCategories.length === 0) return [];
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

    return {
        allCategories,
        groupedCategories,
        areCategoriesLoading,
        loadCategories,
    };
};
