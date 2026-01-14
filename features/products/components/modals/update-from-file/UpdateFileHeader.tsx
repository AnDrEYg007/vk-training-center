
import React from 'react';
import { MarketItem } from '../../../../../shared/types';
import { MatchKey } from '../../../types';

interface UpdateFileHeaderProps {
    fileName: string;
    fileRowsCount: number;
    matchKey: MatchKey;
    setMatchKey: (key: MatchKey) => void;
    fieldsToUpdate: Set<keyof MarketItem | 'album_ids' | 'old_price'>;
    toggleField: (key: keyof MarketItem | 'album_ids' | 'old_price') => void;
    setFieldsToUpdate: (fields: Set<keyof MarketItem | 'album_ids' | 'old_price'>) => void;
    onClose: () => void;
}

const UPDATE_FIELDS: { key: keyof MarketItem | 'album_ids' | 'old_price'; label: string }[] = [
    { key: 'title', label: 'Название' },
    { key: 'description', label: 'Описание' },
    { key: 'price', label: 'Цена' },
    { key: 'old_price', label: 'Старая цена' },
    { key: 'sku', label: 'Артикул' },
    { key: 'album_ids', label: 'Подборка' },
    { key: 'category', label: 'Категория' },
];

const MATCH_OPTIONS: { key: MatchKey; label: string }[] = [
    { key: 'vk_id', label: 'VK ID' },
    { key: 'vk_link', label: 'Ссылка' },
    { key: 'title', label: 'Название' },
    { key: 'sku', label: 'Артикул' },
];

export const UpdateFileHeader: React.FC<UpdateFileHeaderProps> = ({
    fileName,
    fileRowsCount,
    matchKey,
    setMatchKey,
    fieldsToUpdate,
    toggleField,
    setFieldsToUpdate,
    onClose
}) => {
    return (
        <header className="p-5 border-b bg-gray-50 rounded-t-lg flex-shrink-0 space-y-5">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Обновление из файла</h2>
                    <p className="text-sm text-gray-500 mt-1">Файл: <span className="font-medium text-gray-700">{fileName}</span> - {fileRowsCount} строк</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Блок 1: Искать по */}
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">1. Искать совпадения по:</label>
                    <div className="flex bg-gray-200 rounded-lg p-1 gap-1">
                        {MATCH_OPTIONS.map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setMatchKey(opt.key)}
                                className={`flex-1 h-8 text-sm font-medium rounded-md transition-all shadow-sm focus:outline-none focus:ring-0 ${
                                    matchKey === opt.key 
                                    ? 'bg-white text-indigo-600 shadow' 
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-300/50 shadow-none bg-transparent'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Блок 2: Обновлять поля */}
                <div className="flex-[2]">
                    <div className="flex items-center gap-4 mb-2.5">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">2. Обновлять поля:</label>
                        <div className="flex gap-2">
                            <button onClick={() => setFieldsToUpdate(new Set(UPDATE_FIELDS.map(f => f.key)))} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline focus:outline-none focus:ring-0">Выбрать все</button>
                            <span className="text-gray-300">|</span>
                            <button onClick={() => setFieldsToUpdate(new Set())} className="text-xs font-medium text-gray-500 hover:text-gray-700 hover:underline focus:outline-none focus:ring-0">Сбросить</button>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {UPDATE_FIELDS.map(field => {
                            const isSelected = fieldsToUpdate.has(field.key);
                            return (
                                <button
                                    key={field.key}
                                    onClick={() => toggleField(field.key)}
                                    className={`px-3 h-8 flex items-center text-sm font-medium rounded-md border transition-all shadow-sm focus:outline-none focus:ring-0 ${
                                        isSelected
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                    }`}
                                >
                                    {field.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </header>
    );
};
