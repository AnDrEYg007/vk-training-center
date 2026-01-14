import React, { useState } from 'react';

interface UploadOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileName: string;
    onCreate: (addPrefix: boolean) => void;
    onUpdate: () => void;
}

export const UploadOptionsModal: React.FC<UploadOptionsModalProps> = ({
    isOpen,
    onClose,
    fileName,
    onCreate,
    onUpdate,
}) => {
    const [mode, setMode] = useState<'create' | 'update'>('create');
    const [addPrefix, setAddPrefix] = useState(true);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (mode === 'create') {
            onCreate(addPrefix);
        } else if (mode === 'update') {
            onUpdate();
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Загрузка товаров из файла</h2>
                    <p className="text-sm text-gray-500 mt-1">Файл: <span className="font-medium">{fileName}</span></p>
                </header>
                
                <main className="p-6 space-y-4">
                    <p className="text-sm text-gray-700">Что вы хотите сделать с данными из этого файла?</p>
                    
                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                        <button onClick={() => setMode('create')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'create' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>
                            Создать новые товары
                        </button>
                        <button onClick={() => setMode('update')} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'update' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}>
                            Обновить существующие
                        </button>
                    </div>

                    {mode === 'create' && (
                        <div className="p-4 border border-indigo-200 bg-indigo-50 rounded-lg animate-fade-in-up">
                            <p className="text-xs text-indigo-700 mb-3">Данные из файла будут добавлены в таблицу массового создания. Поля "VK ID" и "VK Link" будут проигнорированы.</p>
                             <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setAddPrefix(prev => !prev)}
                                    className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                                        addPrefix ? 'bg-indigo-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <span
                                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                            addPrefix ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                                <label 
                                    onClick={() => setAddPrefix(prev => !prev)}
                                    className="text-sm text-gray-700 cursor-pointer"
                                >
                                    Добавить "NEW" в начало названия
                                </label>
                            </div>
                        </div>
                    )}
                    
                    {mode === 'update' && (
                         <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg animate-fade-in-up">
                            <p className="text-xs text-blue-700">Система попытается найти товары из вашего файла среди существующих в проекте и предложит применить изменения.</p>
                        </div>
                    )}
                </main>
                
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button 
                        type="button" 
                        onClick={handleConfirm}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Подтвердить
                    </button>
                </footer>
            </div>
        </div>
    );
};