import React, { useState, useEffect, useMemo } from 'react';
import { CategorySelector } from '../CategorySelector';
import { GroupedCategory } from '../../hooks/useProductCategories';
import { MarketCategory, MarketItem } from '../../../../shared/types';
import * as api from '../../../../services/api';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

type ModalView = 'manual' | 'loading' | 'confirm';

interface BulkCategoryEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (update: MarketCategory | api.BulkSuggestionResult[]) => void;
    groupedCategories: GroupedCategory[];
    areCategoriesLoading: boolean;
    loadCategories: () => void;
    selectedItems: MarketItem[];
    onAiSuggest: () => void;
    isAiSuggesting: boolean;
    aiSuggestions: api.BulkSuggestionResult[] | null;
}

export const BulkCategoryEditModal: React.FC<BulkCategoryEditModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    groupedCategories,
    areCategoriesLoading,
    loadCategories,
    selectedItems,
    onAiSuggest,
    isAiSuggesting,
    aiSuggestions
}) => {
    const [view, setView] = useState<ModalView>('manual');
    const [selectedCategory, setSelectedCategory] = useState<MarketCategory | null>(null);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    useEffect(() => {
        if (isAiSuggesting) {
            setView('loading');
        } else if (aiSuggestions) {
            setView('confirm');
        } else {
            setView('manual');
        }
    }, [isAiSuggesting, aiSuggestions]);

    const isDirty = useMemo(() => {
        // ИСПРАВЛЕНО: 'confirm' - правильное имя вида для отображения результатов AI
        if (view === 'confirm' || view === 'loading') return true;
        return selectedCategory !== null;
    }, [view, selectedCategory]);
    
    const handleOverlayClick = () => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    if (!isOpen) {
        return null;
    }

    const handleManualConfirm = () => {
        if (selectedCategory) {
            onConfirm(selectedCategory);
        }
    };
    
    const handleAiConfirm = () => {
        if (aiSuggestions) {
            onConfirm(aiSuggestions);
        }
    };
    
    const selectorValue = selectedCategory ? {
        id: selectedCategory.id,
        name: selectedCategory.name,
        section: {
            id: selectedCategory.section_id,
            name: selectedCategory.section_name
        }
    } : null;

    const suggestionsWithNames = useMemo(() => {
        if (!aiSuggestions) return [];
        return aiSuggestions.map(suggestion => {
            const item = selectedItems.find(i => i.id === suggestion.itemId);
            return { ...suggestion, itemName: item?.title || 'Неизвестный товар' };
        });
    }, [aiSuggestions, selectedItems]);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Массовое изменение категории</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Закрыть">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </header>
                    
                    {view === 'manual' && (
                        <>
                            <main className="p-6 space-y-4">
                                <p className="text-sm text-gray-600">
                                    Выберите новую категорию для <strong>{selectedItems.length}</strong> выбранных товаров. Это изменение будет применено ко всем.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Новая категория</label>
                                    <CategorySelector value={selectorValue} options={groupedCategories} onChange={(cat) => setSelectedCategory(cat)} onOpen={loadCategories} isLoading={areCategoriesLoading}/>
                                </div>
                            </main>
                            <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                                <button type="button" onClick={onAiSuggest} className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    AI-помощник
                                </button>
                                <div className="flex gap-3">
                                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                                    <button type="button" onClick={handleManualConfirm} disabled={!selectedCategory} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300">Применить</button>
                                </div>
                            </footer>
                        </>
                    )}
                    {view === 'loading' && (
                        <main className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="loader" style={{ width: '32px', height: '32px', borderTopColor: '#4f46e5' }}></div>
                            <p className="mt-4 text-gray-600 text-sm font-medium">AI-помощник подбирает категории...</p>
                            <p className="mt-1 text-xs text-gray-500">Это может занять некоторое время</p>
                        </main>
                    )}
                    {view === 'confirm' && (
                        <>
                            <main className="p-6 space-y-4">
                                <p className="text-sm text-gray-600">AI-помощник подобрал следующие категории для <strong>{selectedItems.length}</strong> товаров:</p>
                                <div className="max-h-64 overflow-y-auto border rounded-lg custom-scrollbar">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 text-left font-medium text-gray-600">Товар</th>
                                                <th className="px-4 py-2 text-left font-medium text-gray-600">Предложенная категория</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {suggestionsWithNames.map(s => (
                                                <tr key={s.itemId}>
                                                    <td className="px-4 py-2 text-gray-800 font-medium truncate" title={s.itemName}>{s.itemName}</td>
                                                    <td className="px-4 py-2 text-gray-600">{`${s.category.section_name} / ${s.category.name}`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </main>
                            <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Назад</button>
                                <button type="button" onClick={handleAiConfirm} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Применить предложения</button>
                            </footer>
                        </>
                    )}
                </div>
            </div>
            {showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть без сохранения?"
                    message="Вы уверены, что хотите закрыть это окно? Все внесенные изменения будут потеряны."
                    onConfirm={() => {
                        setShowCloseConfirm(false);
                        onClose();
                    }}
                    onCancel={() => setShowCloseConfirm(false)}
                    confirmText="Да, закрыть"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[60]"
                />
            )}
        </>
    );
};