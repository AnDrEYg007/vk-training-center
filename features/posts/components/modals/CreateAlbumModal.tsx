import React, { useState } from 'react';
import * as api from '../../../../services/api';

interface CreateAlbumModalProps {
    projectId: string;
    onClose: () => void;
    onSuccess: (newAlbum: any) => void;
}

export const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ projectId, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Название альбома не может быть пустым.");
            return;
        }
        setIsSaving(true);
        setError(null);
        try {
            const newAlbum = await api.createAlbum(projectId, title);
            onSuccess(newAlbum);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Произошла неизвестная ошибка.';
            setError(`Не удалось создать альбом: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Создать новый альбом</h2>
                    <button onClick={onClose} disabled={isSaving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50" title="Закрыть">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <div>
                        <label htmlFor="album-title" className="block text-sm font-medium text-gray-700 mb-1">Название альбома</label>
                        <input
                            id="album-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                            className="w-full border rounded p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Например, 'Акции Июля'"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>
                    )}
                </main>
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Отмена</button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !title.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 w-28 flex justify-center items-center"
                    >
                        {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Создать'}
                    </button>
                </footer>
            </div>
        </div>
    );
};