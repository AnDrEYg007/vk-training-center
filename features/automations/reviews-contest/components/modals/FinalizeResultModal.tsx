
import React from 'react';
import { FinalizeContestResponse } from '../../../../../services/api/automations.api';

interface FinalizeResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: FinalizeContestResponse | null;
    error: string | null;
}

export const FinalizeResultModal: React.FC<FinalizeResultModalProps> = ({ isOpen, onClose, result, error }) => {
    if (!isOpen) return null;

    let content;
    let title = "Результат";
    let iconClass = "text-gray-500 bg-gray-100";
    let icon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    if (error) {
        title = "Ошибка!";
        iconClass = "text-red-600 bg-red-100";
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
        content = (
            <div className="text-center">
                <p className="text-gray-700 mb-4">{error}</p>
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    Возможные причины:
                    <ul className="list-disc list-inside mt-1 text-left px-2">
                        <li>Закончились свободные промокоды.</li>
                        <li>Все участники находятся в черном списке.</li>
                        <li>Ошибка доступа к API (проверьте токены).</li>
                    </ul>
                </div>
            </div>
        );
    } else if (result?.skipped) {
        title = "Розыгрыш перенесен";
        iconClass = "text-amber-600 bg-amber-100";
        icon = (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
        content = (
            <div className="text-center">
                <p className="text-gray-700">{result.message || "Условия завершения не выполнены."}</p>
                <p className="text-sm text-gray-500 mt-2">Конкурс продолжится до следующего запуска.</p>
            </div>
        );
    } else if (result?.success) {
        title = "Успешно!";
        iconClass = "text-green-600 bg-green-100";
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        );
        content = (
             <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">Победитель выбран:</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{result.winner_name}</p>
                </div>
                
                {result.post_link && (
                    <a 
                        href={result.post_link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors w-full"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        Открыть пост с итогами
                    </a>
                )}
                
                <p className="text-xs text-gray-500">Приз отправлен победителю. Подробности в журнале отправки.</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full ${iconClass}`}>
                            {icon}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4">{title}</h3>
                    {content}
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-center">
                    <button 
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};
