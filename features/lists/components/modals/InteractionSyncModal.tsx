
import React, { useState } from 'react';
import { ConfirmationModal } from '../../../../shared/components/modals/ConfirmationModal';

interface InteractionSyncModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (dateFrom: string, dateTo: string) => void;
    isSyncing: boolean;
}

export const InteractionSyncModal: React.FC<InteractionSyncModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isSyncing
}) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Default: Last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    const [dateFrom, setDateFrom] = useState(weekAgoStr);
    const [dateTo, setDateTo] = useState(today);
    const [error, setError] = useState<string | null>(null);

    const handlePresetClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);
        
        setDateTo(end.toISOString().split('T')[0]);
        setDateFrom(start.toISOString().split('T')[0]);
        setError(null);
    };

    const handleLastYearClick = () => {
        const now = new Date();
        const prevYear = now.getFullYear() - 1;
        // Формируем строки YYYY-MM-DD вручную, чтобы избежать смещения часовых поясов ISO
        const startStr = `${prevYear}-01-01`;
        const endStr = `${prevYear}-12-31`;
        
        setDateFrom(startStr);
        setDateTo(endStr);
        setError(null);
    };

    const handleConfirm = () => {
        const start = new Date(dateFrom);
        const end = new Date(dateTo);
        // const diffTime = Math.abs(end.getTime() - start.getTime());
        // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (start > end) {
            setError("Дата начала не может быть позже даты окончания.");
            return;
        }

        // Ограничение в 92 дня снято благодаря оптимизации на бэкенде (execute + smart fallback)
        /* 
        if (diffDays > 92) {
            setError("Период сбора не может превышать 3 месяца (92 дня).");
            return;
        }
        */

        onConfirm(new Date(dateFrom).toISOString(), new Date(dateTo).toISOString());
    };

    if (!isOpen) return null;

    const buttonClass = "flex-1 py-1.5 text-xs font-medium bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 rounded border border-gray-200 transition-colors whitespace-nowrap";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Сбор активностей</h2>
                    <button onClick={onClose} disabled={isSyncing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Выберите период, за который нужно собрать лайки, комментарии и репосты со стены сообщества.
                    </p>
                    
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <button onClick={() => handlePresetClick(7)} className={buttonClass}>Неделя</button>
                            <button onClick={() => handlePresetClick(30)} className={buttonClass}>Месяц</button>
                            <button onClick={() => handlePresetClick(90)} className={buttonClass}>Квартал</button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handlePresetClick(180)} className={buttonClass}>Полгода</button>
                            <button onClick={() => handlePresetClick(365)} className={buttonClass}>Год</button>
                            <button onClick={handleLastYearClick} className={buttonClass}>Прошлый год</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">С</label>
                            <input 
                                type="date" 
                                value={dateFrom} 
                                onChange={(e) => { setDateFrom(e.target.value); setError(null); }}
                                className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                max={dateTo}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">По</label>
                            <input 
                                type="date" 
                                value={dateTo} 
                                onChange={(e) => { setDateTo(e.target.value); setError(null); }}
                                className="w-full border rounded px-3 py-2 text-sm border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                min={dateFrom}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-100">
                        <p className="font-medium text-blue-800 mb-1">Важно:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Сбор репостов требует прав администратора.</li>
                            <li>Обновляются данные сразу во всех списках (Лайкали, Комментировали, Репостили).</li>
                            <li>При выборе большого периода (год и более) процесс может занять несколько минут.</li>
                        </ul>
                    </div>
                </main>
                
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} disabled={isSyncing} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button 
                        onClick={handleConfirm} 
                        disabled={isSyncing}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center"
                    >
                        {isSyncing ? <div className="loader border-white border-t-transparent h-4 w-4 mr-2"></div> : null}
                        {isSyncing ? 'Сбор данных...' : 'Запустить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
