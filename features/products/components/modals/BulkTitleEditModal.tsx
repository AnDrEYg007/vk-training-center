import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { BulkTitleUpdatePayload } from '../../types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { MarketItem } from '../../../../shared/types';

// FIX: Changed EditMode to only include manual editing modes. AI is now a separate view.
type EditMode = 'insert' | 'delete';
type InsertPosition = 'start' | 'end';
// FIX: Added ModalView type to manage different states of the modal (manual, loading, AI results).
type ModalView = 'manual' | 'loading' | 'results';

// +++ START: Helper components and functions for AI correction view (copied from BulkDescriptionEditModal) +++

/**
 * Вычисляет разницу между двумя строками на основе алгоритма LCS (Longest Common Subsequence).
 * @param oldText Старый текст.
 * @param newText Новый текст.
 * @returns Массив объектов, представляющих части текста (добавленные, удаленные, общие).
 */
const computeDiff = (oldText: string, newText: string) => {
    // Разделяем текст на слова и пробелы, чтобы сохранить форматирование
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    const m = oldWords.length;
    const n = newWords.length;

    // Строим матрицу LCS
    const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (oldWords[i - 1] === newWords[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // Восстанавливаем разницу, двигаясь по матрице
    const diff: { value: string; added?: boolean; removed?: boolean }[] = [];
    let i = m, j = n;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
            diff.unshift({ value: oldWords[i - 1] });
            i--; j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ value: newWords[j - 1], added: true });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diff.unshift({ value: oldWords[i - 1], removed: true });
            i--;
        } else { break; }
    }
    
    // Объединяем последовательные одинаковые изменения для лучшего вида
    if (diff.length === 0) return [];
    const mergedDiff = [diff[0]];
    for (let k = 1; k < diff.length; k++) {
        const last = mergedDiff[mergedDiff.length - 1];
        const current = diff[k];
        if (last.added === current.added && last.removed === current.removed) {
            last.value += current.value;
        } else {
            mergedDiff.push(current);
        }
    }
    return mergedDiff;
};

/**
 * Компонент для рендеринга визуальной разницы между двумя текстами.
 */
const DiffViewer: React.FC<{ oldText: string; newText: string }> = ({ oldText, newText }) => {
    const diffs = useMemo(() => computeDiff(oldText, newText), [oldText, newText]);

    return (
        <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm whitespace-pre-wrap leading-normal min-h-12">
            {diffs.map((part, index) => (
                <span key={index} className={
                    part.added ? "bg-green-100 rounded" : part.removed ? "bg-red-100 rounded line-through" : ""
                }>
                    {part.value}
                </span>
            ))}
        </div>
    );
};

const AutoSizingTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const resize = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Сбросить высоту
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Установить по содержимому
        }
    };

    useLayoutEffect(resize, []); // При первом рендере
    useEffect(resize, [props.value]); // При изменении значения

    return <textarea ref={textareaRef} style={{ minHeight: '3rem', ...props.style }} {...props} />;
};


// Дочерний компонент для отображения результатов AI
const AiCorrectionView: React.FC<{
    corrections: { itemId: number; originalText: string; correctedText: string }[];
    selectedIds: Set<number>;
    onToggleAll: () => void;
    onToggleSingle: (itemId: number) => void;
}> = ({ corrections, selectedIds, onToggleAll, onToggleSingle }) => {
    const allSelected = selectedIds.size > 0 && selectedIds.size === corrections.length;

    return (
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar border rounded-lg">
            <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4 bg-white">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b flex items-center">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={onToggleAll}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        title="Выбрать все / Снять выделение"
                    />
                </div>
                <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b font-medium text-gray-600">Было</div>
                <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b font-medium text-gray-600">Стало (AI)</div>
                
                {/* Body */}
                {corrections.map(({ itemId, originalText, correctedText }, index) => (
                    <React.Fragment key={itemId}>
                        <div className={`p-4 flex items-center ${index > 0 ? 'border-t' : ''}`}>
                            <input
                                type="checkbox"
                                checked={selectedIds.has(itemId)}
                                onChange={() => onToggleSingle(itemId)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                        </div>
                        <div className={`p-4 align-top ${index > 0 ? 'border-t' : ''}`}>
                             <AutoSizingTextarea
                                value={originalText}
                                readOnly
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none custom-scrollbar text-sm leading-normal"
                            />
                        </div>
                        <div className={`p-4 align-top ${index > 0 ? 'border-t' : ''}`}>
                            <DiffViewer oldText={originalText} newText={correctedText} />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// +++ END: Helper components +++


// FIX: Updated props interface to accept `selectedItems` and AI-related functions.
interface BulkTitleEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: MarketItem[];
    onConfirm: (payload: BulkTitleUpdatePayload) => void;
    isBulkAiCorrecting: boolean;
    bulkAiCorrections: { itemId: number; originalText: string; correctedText: string }[] | null;
    onAiCorrect: () => void;
    onConfirmCorrections: (corrections: { itemId: number, correctedText: string }[]) => void;
}

export const BulkTitleEditModal: React.FC<BulkTitleEditModalProps> = ({
    isOpen,
    onClose,
    selectedItems,
    onConfirm,
    isBulkAiCorrecting,
    bulkAiCorrections,
    onAiCorrect,
    onConfirmCorrections,
}) => {
    const selectedItemsCount = selectedItems.length;
    const [activeMode, setActiveMode] = useState<EditMode>('insert');
    const [view, setView] = useState<ModalView>('manual');

    // Состояния для ручного редактирования
    const [insertText, setInsertText] = useState('');
    const [insertPosition, setInsertPosition] = useState<InsertPosition>('start');
    const [deleteText, setDeleteText] = useState('');
    const [selectedCorrectionIds, setSelectedCorrectionIds] = useState<Set<number>>(new Set());

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    
    useEffect(() => {
        if (isBulkAiCorrecting) {
            setView('loading');
        } else if (bulkAiCorrections) {
            setSelectedCorrectionIds(new Set(bulkAiCorrections.map(c => c.itemId)));
            setView('results');
        } else {
            setView('manual');
        }
    }, [isBulkAiCorrecting, bulkAiCorrections]);

    const isDirty = useMemo(() => {
        if (view !== 'manual') return true;
        if (activeMode === 'insert') return !!insertText.trim();
        if (activeMode === 'delete') return !!deleteText.trim();
        return false;
    }, [activeMode, insertText, deleteText, view]);

    const isApplyDisabled = !isDirty;

    const handleOverlayClick = () => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    const handleManualConfirm = () => {
        if (activeMode === 'delete' && deleteText.trim().length < 3) {
            setShowDeleteConfirm(true);
            return;
        }
        executeManualConfirm();
    };
    
    const executeManualConfirm = () => {
        setShowDeleteConfirm(false);
        let payload: BulkTitleUpdatePayload | null = null;
        if (activeMode === 'insert') {
            payload = { mode: 'insert', text: insertText, position: insertPosition };
        } else if (activeMode === 'delete') {
            payload = { mode: 'delete', text: deleteText };
        }
        
        if (payload) {
            onConfirm(payload);
        }
    };
    
    const handleAiConfirmAll = () => {
        if (bulkAiCorrections) {
            onConfirmCorrections(bulkAiCorrections);
        }
    };
    
    const handleAiConfirmSelected = () => {
        if (bulkAiCorrections) {
            const finalCorrections = bulkAiCorrections.filter(c => selectedCorrectionIds.has(c.itemId));
            onConfirmCorrections(finalCorrections);
        }
    };

    const handleToggleAllCorrections = () => {
        if (selectedCorrectionIds.size === bulkAiCorrections?.length) {
            setSelectedCorrectionIds(new Set());
        } else {
            setSelectedCorrectionIds(new Set(bulkAiCorrections?.map(c => c.itemId) || []));
        }
    };

    const handleToggleSingleCorrection = (itemId: number) => {
        setSelectedCorrectionIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    if (!isOpen) {
        return null;
    }

    const renderManualContent = () => {
        switch (activeMode) {
            case 'insert':
                return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Позиция</label>
                            <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                <button onClick={() => setInsertPosition('start')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${insertPosition === 'start' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>В начало</button>
                                <button onClick={() => setInsertPosition('end')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${insertPosition === 'end' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>В конец</button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Текст для вставки</label>
                            <input
                                type="text"
                                value={insertText}
                                onChange={(e) => setInsertText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Например, 'Пицца '"
                                autoFocus
                            />
                        </div>
                    </div>
                );
            case 'delete':
                 return (
                    <div className="space-y-2 animate-fade-in-up">
                        <label className="block text-sm font-medium text-gray-700">Текст для удаления</label>
                        <input
                            type="text"
                            value={deleteText}
                            onChange={(e) => setDeleteText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Например, '(акция)'"
                            autoFocus
                        />
                         {deleteText.trim().length > 0 && deleteText.trim().length < 3 && (
                            <p className="text-xs text-amber-700 p-2 bg-amber-100 rounded-md">
                                <strong>Внимание:</strong> Удаление короткого текста (менее 3 символов) может привести к нежелательным изменениям. Потребуется дополнительное подтверждение.
                            </p>
                        )}
                    </div>
                );
        }
    };
    
    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Массовое изменение названия</h2>
                        <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>{selectedItemsCount}</strong> выбранным товарам.</p>
                    </header>
                    
                    {view === 'manual' && (
                        <div className="p-4 border-b">
                             <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                <button onClick={() => setActiveMode('insert')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'insert' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Вставить текст</button>
                                <button onClick={() => setActiveMode('delete')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'delete' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Удалить текст</button>
                            </div>
                        </div>
                    )}

                    <main className="p-6 min-h-[200px] flex-grow">
                        {view === 'manual' && renderManualContent()}
                        {view === 'loading' && (
                            <div className="p-12 flex flex-col items-center justify-center text-center">
                                <div className="loader" style={{ width: '32px', height: '32px', borderTopColor: '#4f46e5' }}></div>
                                <p className="mt-4 text-gray-600 text-sm font-medium">AI-помощник исправляет названия...</p>
                                <p className="mt-1 text-xs text-gray-500">Это может занять некоторое время</p>
                            </div>
                        )}
                        {view === 'results' && bulkAiCorrections && (
                            <AiCorrectionView 
                                corrections={bulkAiCorrections}
                                selectedIds={selectedCorrectionIds}
                                onToggleAll={handleToggleAllCorrections}
                                onToggleSingle={handleToggleSingleCorrection}
                            />
                        )}
                    </main>

                    <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                        {view === 'manual' ? (
                            <button
                                type="button"
                                onClick={onAiCorrect}
                                className="px-4 py-2 text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                Исправить ошибки (AI)
                            </button>
                        ) : <div />}
                        
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                             {view === 'manual' && (
                                <button type="button" onClick={handleManualConfirm} disabled={isApplyDisabled} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300">Применить</button>
                            )}
                            {view === 'results' && bulkAiCorrections && (
                                <button
                                    type="button"
                                    onClick={selectedCorrectionIds.size === bulkAiCorrections.length ? handleAiConfirmAll : handleAiConfirmSelected}
                                    disabled={selectedCorrectionIds.size === 0}
                                    className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                                >
                                    {selectedCorrectionIds.size === bulkAiCorrections.length
                                        ? 'Применить все'
                                        : `Применить выбранные (${selectedCorrectionIds.size})`}
                                </button>
                            )}
                        </div>
                    </footer>
                </div>
            </div>
            {showDeleteConfirm && (
                <ConfirmationModal
                    title="Опасное действие"
                    message={`Вы собираетесь удалить текст "${deleteText}" из всех выбранных названий. Удаление короткого текста может привести к неожиданным результатам.\n\nВы уверены, что хотите продолжить?`}
                    onConfirm={executeManualConfirm}
                    onCancel={() => setShowDeleteConfirm(false)}
                    confirmText="Да, удалить"
                    cancelText="Отмена"
                    confirmButtonVariant="danger"
                    zIndex="z-[60]"
                />
            )}
             {showCloseConfirm && (
                <ConfirmationModal
                    title="Закрыть без сохранения?"
                    message="Вы уверены, что хотите закрыть это окно? Все введенные данные будут потеряны."
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