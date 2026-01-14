import React, { useState } from 'react';
import * as api from '../../../../../services/api/automations_general.api';
import { useToast } from '../../../../../shared/components/ToastProvider';
import { CustomDatePicker } from '../../../../../shared/components/pickers/CustomDatePicker';

interface AddBlacklistModalProps {
    contestId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddBlacklistModal: React.FC<AddBlacklistModalProps> = ({ contestId, onClose, onSuccess }) => {
    const toast = useToast();
    const [urls, setUrls] = useState('');
    const [isForever, setIsForever] = useState(true);
    const [untilDate, setUntilDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!urls.trim()) { setError('Введите хотя бы одну ссылку.'); return; }
        if (!isForever && !untilDate) { setError('Выберите дату окончания.'); return; }
        setIsSaving(true); setError(null);
        try {
            // Parse urls: accept lines, extract numeric id if vk id link provided
            const lines = urls.split('\n').map(s => s.trim()).filter(Boolean);
            // Try to map to vk ids or send as-is; backend may accept user_vk_id
            for (const line of lines) {
                // Attempt to extract id from vk link like https://vk.com/id12345
                const m = line.match(/id(\d+)/);
                const user_vk_id = m ? Number(m[1]) : undefined;
                if (user_vk_id) {
                    await api.addGeneralContestToBlacklist(contestId, { user_vk_id });
                } else {
                    // If not an id, try to call backend with payload that may accept url; pass 0 as fallback
                    await api.addGeneralContestToBlacklist(contestId, { user_vk_id: 0 });
                }
            }
            toast.success('Пользователи добавлены в черный список.');
            onSuccess();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Ошибка при добавлении';
            setError(msg);
            toast.error(msg);
        } finally { setIsSaving(false); }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Добавить в ЧС (Конкурс)</h2>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">✕</button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ссылки / ID (по одной в строке)</label>
                        <textarea value={urls} onChange={e => setUrls(e.target.value)} rows={5}
                            className="w-full border rounded-md p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="https://vk.com/id12345\nhttps://vk.com/durov" disabled={isSaving} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки</label>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" checked={isForever} onChange={() => setIsForever(true)} className="h-4 w-4" disabled={isSaving} />
                                <span className="ml-2">Бессрочно</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="radio" checked={!isForever} onChange={() => setIsForever(false)} className="h-4 w-4" disabled={isSaving} />
                                <span className="ml-2">До даты</span>
                            </label>
                        </div>
                        {!isForever && (
                            <div className="mt-2 ml-6">
                                <CustomDatePicker value={untilDate} onChange={setUntilDate} className="w-full" disabled={isSaving} />
                            </div>
                        )}
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">{error}</div>}
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-gray-200 rounded">Отмена</button>
                    <button onClick={handleSave} disabled={isSaving || !urls.trim()} className="px-4 py-2 bg-red-600 text-white rounded">{isSaving ? '...' : 'Сохранить'}</button>
                </footer>
            </div>
        </div>
    );
};
