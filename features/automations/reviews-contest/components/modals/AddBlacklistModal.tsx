
import React, { useState } from 'react';
import * as api from '../../../../../services/api/automations.api';
import { CustomDatePicker } from '../../../../../shared/components/pickers/CustomDatePicker';

interface AddBlacklistModalProps {
    projectId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddBlacklistModal: React.FC<AddBlacklistModalProps> = ({ projectId, onClose, onSuccess }) => {
    const [urls, setUrls] = useState('');
    const [isForever, setIsForever] = useState(true);
    const [untilDate, setUntilDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!urls.trim()) {
            setError("Введите хотя бы одну ссылку.");
            return;
        }
        if (!isForever && !untilDate) {
            setError("Выберите дату окончания блокировки.");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            await api.addToBlacklist(projectId, urls, isForever ? null : untilDate);
            window.showAppToast?.("Пользователи добавлены в черный список.", 'success');
            onSuccess();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Ошибка при добавлении";
            setError(msg);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Добавить в ЧС</h2>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ссылки на страницы (по одной в строке)</label>
                        <textarea
                            value={urls}
                            onChange={(e) => setUrls(e.target.value)}
                            rows={5}
                            className="w-full border rounded-md p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 custom-scrollbar resize-none transition-shadow"
                            placeholder="https://vk.com/id12345&#10;https://vk.com/durov"
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки</label>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    type="radio" 
                                    checked={isForever} 
                                    onChange={() => setIsForever(true)} 
                                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300 cursor-pointer"
                                    disabled={isSaving}
                                />
                                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Бессрочно (Навсегда)</span>
                            </label>
                            
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    type="radio" 
                                    checked={!isForever} 
                                    onChange={() => setIsForever(false)} 
                                    className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300 cursor-pointer"
                                    disabled={isSaving}
                                />
                                <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">До определенной даты</span>
                            </label>
                        </div>

                        {!isForever && (
                            <div className="mt-2 ml-6 animate-fade-in-up">
                                <CustomDatePicker
                                    value={untilDate}
                                    onChange={setUntilDate}
                                    className="w-full"
                                    disabled={isSaving}
                                />
                                <p className="text-xs text-gray-500 mt-1">Пользователь будет автоматически разблокирован после этой даты.</p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                            {error}
                        </div>
                    )}
                </main>
                
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors">Отмена</button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !urls.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 flex items-center min-w-[100px] justify-center transition-colors"
                    >
                        {isSaving ? <div className="loader h-4 w-4 border-2 border-white border-t-transparent"></div> : 'Сохранить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};
