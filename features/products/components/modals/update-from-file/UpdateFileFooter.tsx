import React from 'react';

type TabType = 'updates' | 'unchanged' | 'not_found' | 'ambiguous';

interface UpdateFileFooterProps {
    activeTab: TabType;
    totalProcessed: number;
    readyToUpdateCount: number;
    notFoundCount: number;
    onCancel: () => void;
    onApply: () => void;
    onQueueNewItems: () => void;
}

export const UpdateFileFooter: React.FC<UpdateFileFooterProps> = ({
    activeTab,
    totalProcessed,
    readyToUpdateCount,
    notFoundCount,
    onCancel,
    onApply,
    onQueueNewItems,
}) => {
    return (
        <footer className="p-4 border-t border-gray-200 bg-white rounded-b-lg flex justify-between items-center flex-shrink-0">
            <div className="text-sm text-gray-600 flex items-center gap-4">
                <span>Всего обработано строк: <strong className="text-gray-900">{totalProcessed}</strong></span>
                <span className="h-4 w-px bg-gray-300"></span>
                {activeTab === 'not_found' ? (
                     <span>Готово к созданию: <strong className="text-indigo-700">{notFoundCount}</strong></span>
                ) : (
                    <span>Готово к обновлению: <strong className="text-indigo-700">{readyToUpdateCount}</strong></span>
                )}
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onCancel} 
                    className="min-w-[100px] px-4 h-10 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm focus:outline-none focus:ring-0"
                >
                    Отмена
                </button>
                
                {activeTab === 'not_found' ? (
                    <button 
                        onClick={onQueueNewItems} 
                        disabled={notFoundCount === 0}
                        className="px-6 h-10 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed shadow-md transition-all transform active:scale-95 focus:outline-none focus:ring-0"
                    >
                        Создать товары - {notFoundCount}
                    </button>
                ) : (
                    <button 
                        onClick={onApply} 
                        disabled={readyToUpdateCount === 0}
                        className="px-6 h-10 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed shadow-md transition-all transform active:scale-95 focus:outline-none focus:ring-0"
                    >
                        Применить обновления - {readyToUpdateCount}
                    </button>
                )}
            </div>
        </footer>
    );
};