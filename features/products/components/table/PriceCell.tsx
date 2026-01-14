
import React from 'react';
import { MarketPrice } from '../../../../shared/types';

// Общие стили для полей ввода в ячейках
const baseInputClasses = "w-full p-1 border rounded-md focus:outline-none focus:ring-2 text-sm bg-white no-spinners disabled:bg-gray-100/70 disabled:cursor-default";

/**
 * @fileoverview Компоненты для редактирования цен в таблице товаров.
 */

/**
 * Компонент для ячейки с основной ценой.
 */
export const PriceCell: React.FC<{
    price: MarketPrice;
    onChange: (newPrice: MarketPrice) => void;
    disabled?: boolean;
    error?: boolean; // Новый проп
}> = ({ price, onChange, disabled, error }) => {
    // Цена хранится в копейках, отображаем и редактируем в рублях
    const priceInRub = (Number(price.amount) / 100);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valueAsNumber = e.target.valueAsNumber;
        const newPrice: MarketPrice = {
            ...price,
            // Преобразуем рубли обратно в копейки для сохранения
            amount: isNaN(valueAsNumber) ? '0' : String(Math.round(valueAsNumber * 100))
        };
        onChange(newPrice);
    };

    const className = `${baseInputClasses} ${
        error 
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50' 
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
    }`;

    return (
        <input
            type="number"
            value={priceInRub}
            onChange={handleChange}
            className={className}
            step="0.01"
            disabled={disabled}
        />
    );
};

/**
 * Компонент для ячейки со старой ценой.
 */
export const OldPriceCell: React.FC<{
    price: MarketPrice;
    onChange: (newPrice: MarketPrice) => void;
    disabled?: boolean;
}> = ({ price, onChange, disabled }) => {
    // Старая цена может отсутствовать
    const oldPriceInRub = (Number(price.old_amount) / 100) || '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const valueAsNumber = e.target.valueAsNumber;
        const newPrice: MarketPrice = {
            ...price,
            // Если поле пустое, сохраняем undefined
            old_amount: value && !isNaN(valueAsNumber) ? String(Math.round(valueAsNumber * 100)) : undefined
        };
        onChange(newPrice);
    };
    
    const className = `${baseInputClasses} border-gray-300 focus:border-indigo-500 focus:ring-indigo-500`;

    return (
         <input
            type="number"
            value={oldPriceInRub}
            onChange={handleChange}
            className={className}
            step="0.01"
            placeholder="Старая цена"
            disabled={disabled}
        />
    );
};
