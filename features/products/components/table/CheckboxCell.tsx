import React from 'react';

/**
 * @fileoverview Компонент для отображения ячейки с чекбоксом в режиме выбора.
 */
export const CheckboxCell: React.FC<{
    isSelected: boolean;
    onToggle: () => void;
}> = ({ isSelected, onToggle }) => {
    return (
        <div className="flex items-center justify-center h-full pt-1">
            <input
                type="checkbox"
                checked={isSelected}
                onChange={onToggle}
                onClick={(e) => e.stopPropagation()} // Предотвращаем срабатывание клика по строке
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
        </div>
    );
};