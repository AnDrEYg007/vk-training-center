
import React from 'react';
import { MarketItem, MarketCategory } from '../../../../shared/types';
import { GroupedCategory } from '../../hooks/useProductCategories';
import { CategorySelector } from '../CategorySelector';

interface AiCategoryCellProps {
    item: MarketItem;
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    onItemChange: (itemId: number, field: keyof MarketItem, value: any) => void;
    onAiSuggest: () => void;
    isAiLoading: boolean;
    disabled: boolean;
    error?: boolean; // Новый проп
}

export const AiCategoryCell: React.FC<AiCategoryCellProps> = ({
    item,
    groupedCategories,
    areCategoriesLoading,
    loadCategories,
    onItemChange,
    onAiSuggest,
    isAiLoading,
    disabled,
    error
}) => {
    
    const selectorClass = error ? 'ring-1 ring-red-500 rounded-md' : '';
    const buttonClass = error ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-800';

    return (
        <div className="flex items-center gap-1">
            <div className={`flex-grow min-w-0 ${selectorClass}`}>
                <CategorySelector
                    value={item.category}
                    options={groupedCategories}
                    isLoading={areCategoriesLoading}
                    onOpen={loadCategories}
                    onChange={(newCategoryObject) => {
                        if (newCategoryObject) {
                            const reconstructedCategory = {
                                id: newCategoryObject.id,
                                name: newCategoryObject.name,
                                section: {
                                    id: newCategoryObject.section_id,
                                    name: newCategoryObject.section_name,
                                },
                            };
                            onItemChange(item.id, 'category', reconstructedCategory);
                        }
                    }}
                    disabled={disabled}
                    title={error ? 'Категория обязательна' : undefined}
                />
            </div>
            <button
                type="button"
                onClick={onAiSuggest}
                disabled={disabled || isAiLoading}
                title="Подобрать категорию с помощью AI"
                className={`p-1 border rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${buttonClass}`}
            >
                {isAiLoading ? (
                    <div className="loader h-5 w-5 border-2 border-gray-400 border-t-indigo-500"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                )}
            </button>
        </div>
    );
};
