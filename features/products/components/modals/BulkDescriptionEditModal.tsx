
import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import { BulkDescriptionUpdatePayload } from '../../types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';
import { MarketItem } from '../../../../shared/types';
import { DiffViewer } from '../DiffViewer';

type EditMode = 'insert' | 'delete';
type InsertPosition = 'start' | 'end';

// Новый тип для состояния модального окна
type ModalView = 'manual' | 'loading' | 'results';


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

    return <textarea ref={textareaRef} style={{ minHeight: '6.5rem', ...props.style }} {...props} />;
};


// Новый дочерний компонент для отображения результатов AI
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
                            <DiffViewer oldText={originalText} newText={correctedText} className="min-h-[6.5rem]" />
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};


interface BulkDescriptionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItems: MarketItem[];
    onConfirm: (payload: BulkDescriptionUpdatePayload) => void;
    // Новые пропсы для AI
    isBulkAiCorrecting: boolean;
    bulkAiCorrections: { itemId: number; originalText: string; correctedText: string }[] | null;
    onAiCorrect: () => void;
    onConfirmCorrections: (corrections: { itemId: number, correctedText: string }[]) => void;
}

export const BulkDescriptionEditModal: React.FC<BulkDescriptionEditModalProps> = ({
    isOpen,
    onClose,
    selectedItems,
    onConfirm,
    isBulkAiCorrecting,
    bulkAiCorrections,
    onAiCorrect,
    onConfirmCorrections,
}) => {
    const [activeMode, setActiveMode] = useState<EditMode>('insert');
    const [view, setView] = useState<ModalView>('manual');

    // Состояния для ручного редактирования
    const [insertText, setInsertText] = useState('');
    const [insertPosition, setInsertPosition] = useState<InsertPosition>('start');
    const [deleteText, setDeleteText] = useState('');
    
    // Состояние для выбора исправлений AI
    const [selectedCorrectionIds, setSelectedCorrectionIds] = useState<Set<number>>(new Set());


    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    
    useEffect(() => {
        if (isBulkAiCorrecting) {
            setView('loading');
        } else if (bulkAiCorrections) {
            // По умолчанию выбираем все исправления
            setSelectedCorrectionIds(new Set(bulkAiCorrections.map(c => c.itemId)));
            setView('results');
        } else {
            setView('manual');
        }
    }, [isBulkAiCorrecting, bulkAiCorrections]);

    const isDirty = useMemo(() => {
        if (view !== 'manual') return true; // Если мы в режиме загрузки или результатов, считаем "грязным"
        if (activeMode === 'insert') return !!insertText.trim();
        if (activeMode === 'delete') return !!deleteText.trim();
        return false;
    }, [activeMode, insertText, deleteText, view]);

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
        let payload: BulkDescriptionUpdatePayload | null = null;
        if (activeMode === 'insert') {
            payload = { mode: 'insert', text: insertText, position: insertPosition };
        } else if (activeMode === 'delete') {
            payload = { mode: 'delete', text: deleteText };
        }
        
        if (payload) {
            onConfirm(payload);
        }
    };
    
    const handleAiConfirm = () => {
        if (bulkAiCorrections) {
            const finalCorrections = bulkAiCorrections
                .filter(c => selectedCorrectionIds.has(c.itemId));
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
                            <textarea value={insertText} onChange={(e) => setInsertText(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar" placeholder="Введите текст..." autoFocus/>
                        </div>
                    </div>
                );
            case 'delete':
                 return (
                    <div className="space-y-2 animate-fade-in-up">
                        <label className="block text-sm font-medium text-gray-700">Текст для удаления</label>
                        <textarea value={deleteText} onChange={(e) => setDeleteText(e.target.value)} rows={4} className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar" placeholder="Введите текст, который нужно удалить..." autoFocus/>
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
                        <h2 className="text-lg font-semibold text-gray-800">Массовое изменение описания</h2>
                        <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>{selectedItems.length}</strong> выбранным товарам.</p>
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
                                <p className="mt-4 text-gray-600 text-sm font-medium">AI-помощник исправляет описания...</p>
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
                                <button type="button" onClick={handleManualConfirm} disabled={!isDirty} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300">Применить</button>
                            )}
                            {view === 'results' && bulkAiCorrections && (
                                <button
                                    type="button"
                                    onClick={handleAiConfirm}
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
                    message={`Вы собираетесь удалить текст "${deleteText}" из всех выбранных описаний. Удаление короткого текста может привести к неожиданным результатам.\n\nВы уверены, что хотите продолжить?`}
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
