import React, { useState, useEffect } from 'react';

export const ConfirmMoveModal: React.FC<{ 
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (id: string, newDate: Date, isCopy: boolean, type: 'post' | 'note', copyDestination?: 'system' | 'vk') => void;
    itemInfo: { id: string, originalDate: string, type: 'post' | 'note' };
    targetDate: Date;
    isMoving: boolean;
}> = ({ isOpen, onClose, onConfirm, itemInfo, targetDate, isMoving }) => {
    const [time, setTime] = useState('');
    const [isCopyMode, setIsCopyMode] = useState(false);
    const [copyDestination, setCopyDestination] = useState<'system' | 'vk'>('system');
    
    const itemType = itemInfo.type === 'post' ? 'пост' : 'заметку';

    useEffect(() => {
        if (!isOpen) return;

        // Сбрасываем состояния при каждом открытии
        setIsCopyMode(false);
        setCopyDestination('system');

        const isTargetDateToday = targetDate.toDateString() === new Date().toDateString();
        const isOriginalDateInFuture = new Date(itemInfo.originalDate) > new Date();
        
        let initialTime: string;

        if (isTargetDateToday && isOriginalDateInFuture) {
            const now = new Date();
            const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
            const suggestedDate = new Date();
            suggestedDate.setHours(now.getHours(), roundedMinutes + 15, 0, 0);

            const hours = suggestedDate.getHours().toString().padStart(2, '0');
            const minutes = suggestedDate.getMinutes().toString().padStart(2, '0');
            initialTime = `${hours}:${minutes}`;
        } else {
            initialTime = new Date(itemInfo.originalDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        }
        
        setTime(initialTime);

    }, [isOpen, targetDate, itemInfo.originalDate]);

    const handleConfirm = () => {
        if (!time) return;
        const [h, m] = time.split(':').map(Number);
        const newDate = new Date(targetDate);
        newDate.setHours(h, m, 0, 0);
        onConfirm(itemInfo.id, newDate, isCopyMode, itemInfo.type, (isCopyMode && itemInfo.type === 'post') ? copyDestination : undefined);
    };

    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full space-y-4 animate-fade-in-up">
                <h2 className="text-lg font-semibold text-gray-800">Подтвердите действие</h2>
                <p className="text-sm text-gray-600">
                    {isCopyMode ? 'Копировать' : 'Перенести'} {itemType} на 
                    <b> {targetDate.toLocaleDateString('ru-RU')}</b>?
                </p>
                
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={() => setIsCopyMode(prev => !prev)}
                        disabled={isMoving}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-70 ${
                            isCopyMode ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                isCopyMode ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                    <label 
                        onClick={() => !isMoving && setIsCopyMode(prev => !prev)}
                        className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        Копировать {itemType}
                    </label>
                </div>
                
                {isCopyMode && itemInfo.type === 'post' && (
                    <div className="pt-2 animate-fade-in-up">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Куда копировать?</label>
                        <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                            <button
                                type="button"
                                onClick={() => setCopyDestination('system')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${copyDestination === 'system' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                В систему
                            </button>
                            <button
                                type="button"
                                onClick={() => setCopyDestination('vk')}
                                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${copyDestination === 'vk' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                            >
                                В отложку VK
                            </button>
                        </div>
                    </div>
                )}


                <label className="block text-sm text-gray-700 pt-2">
                    Уточните время:
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} disabled={isMoving} className="mt-1 w-full border rounded px-2 py-1 text-sm disabled:bg-gray-100 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                </label>
                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} disabled={isMoving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button
                        onClick={handleConfirm}
                        disabled={isMoving || !time}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait w-28 flex justify-center items-center"
                    >
                        {isMoving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Подтвердить'}
                    </button>
                </div>
            </div>
        </div>
    );
};