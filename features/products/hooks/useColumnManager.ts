import React, { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useLocalStorage } from '../../../shared/hooks/useLocalStorage';
import { MarketItem } from '../../../shared/types';

export interface ColumnDefinition {
    key: string;
    label: string;
}

// Изменен порядок колонок и добавлена новая колонка "VK"
export const PRODUCT_COLUMNS: ColumnDefinition[] = [
    { key: 'actions', label: 'Действия' },
    { key: 'photo', label: 'Фото' },
    { key: 'new_photo', label: 'New Фото' },
    { key: 'title', label: 'Название' },
    { key: 'description', label: 'Описание' },
    { key: 'price', label: 'Цена' },
    { key: 'old_price', label: 'Старая цена' },
    { key: 'sku', label: 'Артикул' },
    { key: 'albums', label: 'Подборка' },
    { key: 'category', label: 'Категория' },
    { key: 'vk_link', label: 'VK' },
    { key: 'rating', label: 'Рейтинг' },
];

// Обновлены размеры колонок по умолчанию
const DEFAULT_COLUMN_WIDTHS: Record<string, number> = {
    actions: 110,
    photo: 80,
    new_photo: 80,
    title: 120,
    description: 300,
    albums: 100,
    price: 80,
    old_price: 120,
    category: 120,
    rating: 80,
    sku: 100,
    vk_link: 60,
};


/**
 * Хук, инкапсулирующий всю логику управления колонками таблицы (ширина, видимость).
 */
export const useColumnManager = (projectId: string, filteredItems: MarketItem[], hasPendingPhotos: boolean) => {
    const tableRef = useRef<HTMLTableElement>(null);
    
    // При инициализации используем DEFAULT_COLUMN_WIDTHS, если в localStorage ничего нет
    const [columnWidths, setColumnWidths] = useLocalStorage<Record<string, number>>(
        `products-tab-widths-${projectId}`,
        DEFAULT_COLUMN_WIDTHS
    );

    const [visibleColumns, setVisibleColumns] = useLocalStorage<Record<string, boolean>>(
        `products-tab-visible-columns-${projectId}`,
        PRODUCT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: col.key !== 'new_photo' }), {})
    );

    // Автоматически показывает колонку 'New Фото', если появляются новые фото
    useEffect(() => {
        if (hasPendingPhotos && !visibleColumns.new_photo) {
            setVisibleColumns(prev => ({...prev, new_photo: true}));
        }
    }, [hasPendingPhotos, visibleColumns.new_photo, setVisibleColumns]);

    const [isVisibilityDropdownOpen, setIsVisibilityDropdownOpen] = useState(false);
    const visibilityDropdownRef = useRef<HTMLDivElement>(null);
    const activeColumnKeyRef = useRef<string | null>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // УДАЛЕНО: useLayoutEffect для измерения колонок больше не нужен.
    // Ширина теперь задается либо из localStorage, либо из DEFAULT_COLUMN_WIDTHS.
    
    const isInitialized = Object.keys(columnWidths).length > 0;

    // Обработчики для изменения ширины колонок
    const handleMouseDown = useCallback((key: string, e: React.MouseEvent) => {
        activeColumnKeyRef.current = key;
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[key] || 0;
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    }, [columnWidths]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (activeColumnKeyRef.current === null) return;
        const deltaX = e.clientX - startXRef.current;
        const newWidth = startWidthRef.current + deltaX;
        setColumnWidths(prevWidths => ({
            ...prevWidths,
            [activeColumnKeyRef.current!]: Math.max(newWidth, 80),
        }));
    }, [setColumnWidths]);

    const handleMouseUp = useCallback(() => {
        activeColumnKeyRef.current = null;
        document.body.style.cursor = '';
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    // Логика закрытия выпадающего меню
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (visibilityDropdownRef.current && !visibilityDropdownRef.current.contains(event.target as Node)) {
                setIsVisibilityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleVisibilityDropdown = useCallback(() => setIsVisibilityDropdownOpen(prev => !prev), []);
    const handleToggleColumnVisibility = (key: string) => setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    const handleShowAllColumns = () => setVisibleColumns(PRODUCT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: true }), {}));
    const handleHideAllColumns = () => setVisibleColumns(PRODUCT_COLUMNS.reduce((acc, col) => ({ ...acc, [col.key]: false }), {}));

    return {
        state: {
            columnWidths,
            visibleColumns,
            isVisibilityDropdownOpen,
            isInitialized,
        },
        actions: {
            handleMouseDown,
            toggleVisibilityDropdown,
            handleToggleColumnVisibility,
            handleShowAllColumns,
            handleHideAllColumns,
        },
        refs: {
            tableRef,
            visibilityDropdownRef,
        }
    };
};