import React, { useState, useMemo } from 'react';
import { MarketItem, MarketPrice } from '../../../../shared/types';
import { BulkPriceUpdatePayload } from '../../types';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

type EditMode = 'set' | 'round' | 'change';
type RoundTarget = 0 | 5 | 9;
type RoundDirection = 'up' | 'down';
type ChangeAction = 'increase' | 'decrease';
type ChangeType = 'amount' | 'percent';

interface BulkPriceEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedItemsCount: number;
    onConfirm: (payload: BulkPriceUpdatePayload) => void;
}

/**
 * Округляет цену в копейках по заданным правилам.
 * @param priceInKopecks Цена в копейках.
 * @param direction Направление округления ('up' или 'down').
 * @param target Целевое окончание (0, 5, 9).
 * @returns Округленная цена в копейках.
 */
const roundPrice = (priceInKopecks: number, direction: RoundDirection, target: RoundTarget): number => {
    const priceInRub = priceInKopecks / 100;
    const base = Math.floor(priceInRub / 10) * 10;
    const targetInDecade = base + target;
    
    let resultInRub: number;
    if (direction === 'up') {
        resultInRub = targetInDecade >= priceInRub ? targetInDecade : targetInDecade + 10;
    } else { // down
        resultInRub = targetInDecade <= priceInRub ? targetInDecade : targetInDecade - 10;
    }
    return Math.round(resultInRub * 100);
};

export const BulkPriceEditModal: React.FC<BulkPriceEditModalProps> = ({
    isOpen,
    onClose,
    selectedItemsCount,
    onConfirm,
}) => {
    const [activeMode, setActiveMode] = useState<EditMode>('set');
    
    // Состояния для разных режимов
    const [setValue, setSetValue] = useState<number | ''>('');
    const [roundTarget, setRoundTarget] = useState<RoundTarget>(0);
    const [roundDirection, setRoundDirection] = useState<RoundDirection>('up');
    const [changeAction, setChangeAction] = useState<ChangeAction>('increase');
    const [changeType, setChangeType] = useState<ChangeType>('amount');
    const [changeValue, setChangeValue] = useState<number | ''>('');
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    const isDirty = useMemo(() => {
        if (activeMode === 'set') return setValue !== '';
        if (activeMode === 'change') return changeValue !== '';
        return false;
    }, [activeMode, setValue, changeValue]);

    const isApplyDisabled = useMemo(() => {
        return !isDirty;
    }, [isDirty]);
    
    const handleOverlayClick = () => {
        if (isDirty) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    };

    const handleConfirm = () => {
        const updatePayload: BulkPriceUpdatePayload = {
            mode: activeMode,
            setValue: activeMode === 'set' && typeof setValue === 'number' ? setValue * 100 : undefined,
            roundTarget,
            roundDirection,
            changeAction,
            changeType,
            changeValue: activeMode === 'change' && typeof changeValue === 'number' 
                ? (changeType === 'amount' ? changeValue * 100 : changeValue) 
                : undefined,
        };
        
        onConfirm(updatePayload);
    };

    if (!isOpen) {
        return null;
    }

    const renderContent = () => {
        switch (activeMode) {
            case 'set':
                return (
                    <div className="space-y-2 animate-fade-in-up">
                        <label className="block text-sm font-medium text-gray-700">Новая цена</label>
                        <input
                            type="number"
                            value={setValue}
                            onChange={(e) => setSetValue(e.target.valueAsNumber || '')}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 no-spinners"
                            placeholder="Например, 1000"
                            autoFocus
                        />
                    </div>
                );
            case 'round':
                 return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Округлить до</label>
                            <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                {[0, 5, 9].map(t => (
                                    <button key={t} onClick={() => setRoundTarget(t as RoundTarget)} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundTarget === t ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Направление</label>
                            <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                <button onClick={() => setRoundDirection('up')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundDirection === 'up' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>В большую</button>
                                <button onClick={() => setRoundDirection('down')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${roundDirection === 'down' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>В меньшую</button>
                            </div>
                        </div>
                    </div>
                );
            case 'change':
                return (
                    <div className="space-y-4 animate-fade-in-up">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Действие</label>
                            <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                <button onClick={() => setChangeAction('increase')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeAction === 'increase' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Поднять на</button>
                                <button onClick={() => setChangeAction('decrease')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeAction === 'decrease' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Снизить на</button>
                            </div>
                        </div>
                        <div className="flex items-end gap-2">
                             <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700">Значение</label>
                                <input
                                    type="number"
                                    value={changeValue}
                                    onChange={(e) => setChangeValue(e.target.valueAsNumber || '')}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 no-spinners"
                                    placeholder="Например, 100 или 10"
                                    autoFocus
                                />
                             </div>
                             <div className="flex-shrink-0">
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    <button onClick={() => setChangeType('amount')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeType === 'amount' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>₽</button>
                                    <button onClick={() => setChangeType('percent')} className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${changeType === 'percent' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>%</button>
                                </div>
                             </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                    <header className="p-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-800">Массовое изменение цены</h2>
                        <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>{selectedItemsCount}</strong> выбранным товарам.</p>
                    </header>
                    
                    <div className="p-4 border-b">
                         <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                            <button onClick={() => setActiveMode('set')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'set' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Установить</button>
                            <button onClick={() => setActiveMode('round')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'round' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Округлить</button>
                            <button onClick={() => setActiveMode('change')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'change' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>Изменить на</button>
                        </div>
                    </div>

                    <main className="p-6">
                        {renderContent()}
                    </main>

                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={isApplyDisabled}
                            className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
                        >
                            Применить
                        </button>
                    </footer>
                </div>
            </div>
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