import React from 'react';
import { MarketCategory, MarketItem } from '../../../../shared/types';

interface AiCategorySuggestionModalProps {
    suggestion: {
        item: MarketItem;
        category: MarketCategory;
    } | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const AiCategorySuggestionModal: React.FC<AiCategorySuggestionModalProps> = ({
    suggestion,
    onClose,
    onConfirm,
}) => {
    if (!suggestion) {
        return null;
    }

    const { item, category } = suggestion;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">AI-помощник: Категория товара</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Для товара <strong className="text-gray-800">"{item.title}"</strong> AI-помощник предлагает следующую категорию:
                    </p>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                        <p className="text-sm font-medium text-gray-500">{category.section_name}</p>
                        <p className="text-lg font-semibold text-indigo-700">{category.name}</p>
                    </div>
                     <p className="text-sm text-gray-600">
                        Применить эту категорию?
                    </p>
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Применить
                    </button>
                </footer>
            </div>
        </div>
    );
};
