
import React from 'react';
import { SaveResultSummary } from '../../types';

interface SaveResultModalProps {
    result: SaveResultSummary;
    onClose: () => void;
}

export const SaveResultModal: React.FC<SaveResultModalProps> = ({ result, onClose }) => {
    if (!result) return null;

    const failedItems = result.results.filter(r => !r.success);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Результат сохранения</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 overflow-auto custom-scrollbar max-h-[60vh]">
                    <div className="space-y-4">
                        {/* Блок успеха */}
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${result.successCount > 0 ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                            <div className={`mt-0.5 p-1 rounded-full ${result.successCount > 0 ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className={`font-medium ${result.successCount > 0 ? 'text-green-800' : 'text-gray-600'}`}>
                                    Успешно обработано: {result.successCount} из {result.total}
                                </h3>
                                {result.successCount > 0 && (
                                    <p className="text-sm text-green-700 mt-1">Изменения применены.</p>
                                )}
                            </div>
                        </div>

                        {/* Блок ошибок */}
                        {result.failedCount > 0 && (
                            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="mt-0.5 p-1 rounded-full bg-red-200 text-red-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-red-800">
                                            Ошибок: {result.failedCount}
                                        </h3>
                                        <p className="text-sm text-red-700 mt-1">
                                            Некоторые товары не удалось обновить. Они остались подсвеченными в таблице.
                                        </p>
                                    </div>
                                </div>
                                
                                <ul className="space-y-2 pl-2">
                                    {failedItems.map((fail, idx) => (
                                        <li key={fail.id} className="text-sm text-red-700 bg-white/50 p-2 rounded border border-red-100">
                                            <p className="font-semibold">{fail.title}</p>
                                            <p className="mt-0.5">{fail.error}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </main>
                
                <footer className="p-4 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Закрыть
                    </button>
                </footer>
            </div>
        </div>
    );
};
