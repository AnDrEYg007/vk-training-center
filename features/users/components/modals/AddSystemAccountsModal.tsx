import React, { useState } from 'react';

interface AddSystemAccountsModalProps {
    onClose: () => void;
    onSuccess: (urls: string) => void;
}

export const AddSystemAccountsModal: React.FC<AddSystemAccountsModalProps> = ({ onClose, onSuccess }) => {
    const [urls, setUrls] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!urls.trim()) {
            setError("Пожалуйста, вставьте хотя бы одну ссылку.");
            return;
        }
        setIsProcessing(true);
        setError(null);
        
        // Эмуляция асинхронной операции
        setTimeout(() => {
            onSuccess(urls);
            setIsProcessing(false);
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Добавить системные страницы</h2>
                    <button onClick={onClose} disabled={isProcessing} className="text-gray-400 hover:text-gray-600 disabled:opacity-50" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label htmlFor="account-urls" className="block text-sm font-medium text-gray-700">Список ссылок на профили VK</label>
                        <p className="text-xs text-gray-500 mb-2">Вставьте по одной ссылке на каждой строке. Данные (ФИО, ID, фото) будут загружены автоматически после сохранения.</p>
                        <textarea
                            id="account-urls"
                            value={urls}
                            onChange={(e) => setUrls(e.target.value)}
                            rows={10}
                            disabled={isProcessing}
                            className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 custom-scrollbar"
                            placeholder="https://vk.com/id12345&#10;https://vk.com/durov"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
                    )}
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isProcessing || !urls.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-wait w-32 flex justify-center items-center"
                    >
                        {isProcessing ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Добавить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};