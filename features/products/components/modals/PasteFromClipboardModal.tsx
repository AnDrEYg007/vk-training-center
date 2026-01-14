import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NewProductRow } from '../../types';
import { MarketAlbum, MarketCategory } from '../../../../shared/types';

interface PasteFromClipboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (rows: NewProductRow[]) => void;
    allAlbums: MarketAlbum[];
    allCategories: MarketCategory[];
}

type ProductField = 'title' | 'description' | 'price' | 'old_price' | 'sku' | 'category' | 'album' | 'skip';

const FIELD_OPTIONS: { value: ProductField; label: string }[] = [
    { value: 'skip', label: 'Пропустить' },
    { value: 'title', label: 'Название' },
    { value: 'description', label: 'Описание' },
    { value: 'price', label: 'Цена' },
    { value: 'old_price', label: 'Старая цена' },
    { value: 'sku', label: 'Артикул' },
    { value: 'category', label: 'Категория' },
    { value: 'album', label: 'Подборка' },
];

export const PasteFromClipboardModal: React.FC<PasteFromClipboardModalProps> = ({
    isOpen, onClose, onImport, allAlbums, allCategories
}) => {
    const [rawText, setRawText] = useState('');
    const [mapping, setMapping] = useState<Record<number, ProductField>>({});

    // Парсим текст в двумерный массив (строки и столбцы)
    const gridData = useMemo(() => {
        if (!rawText.trim()) return [];
        return rawText.split(/\r\n|\n|\r/).filter(line => line.trim() !== '').map(line => line.split('\t'));
    }, [rawText]);

    const maxCols = useMemo(() => {
        return gridData.reduce((max, row) => Math.max(max, row.length), 0);
    }, [gridData]);

    // Инициализация маппинга при появлении данных
    React.useEffect(() => {
        if (maxCols > 0) {
            const initialMapping: Record<number, ProductField> = {};
            for (let i = 0; i < maxCols; i++) {
                initialMapping[i] = 'skip';
            }
            setMapping(initialMapping);
        }
    }, [maxCols]);

    const handleImport = () => {
        const resultRows: NewProductRow[] = gridData.map(row => {
            const newRow: NewProductRow = { tempId: uuidv4(), price: '' };
            
            row.forEach((cell, idx) => {
                const field = mapping[idx];
                if (!field || field === 'skip') return;

                const val = cell.trim();
                if (!val) return;

                if (field === 'title') newRow.title = val;
                else if (field === 'description') newRow.description = val;
                else if (field === 'price') newRow.price = val;
                else if (field === 'old_price') newRow.old_price = val;
                else if (field === 'sku') newRow.sku = val;
                else if (field === 'category') {
                    // Умный поиск категории по названию
                    const lowerVal = val.toLowerCase();
                    const found = allCategories.find(c => 
                        c.name.toLowerCase() === lowerVal || 
                        `${c.section_name} / ${c.name}`.toLowerCase() === lowerVal
                    );
                    if (found) {
                        newRow.category = {
                            id: found.id,
                            name: found.name,
                            // FIX: Replaced incorrect 'section' property with 'section_id' and 'section_name' to match the MarketCategory interface.
                            section_id: found.section_id,
                            section_name: found.section_name
                        };
                    }
                } else if (field === 'album') {
                    // Умный поиск альбома по названию
                    const lowerVal = val.toLowerCase();
                    const found = allAlbums.find(a => a.title.toLowerCase() === lowerVal);
                    if (found) newRow.album_ids = [found.id];
                }
            });
            return newRow;
        });

        onImport(resultRows);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Импорт данных из буфера</h2>
                        <p className="text-xs text-gray-500 mt-1">Скопируйте таблицу в Excel/Google Sheets и вставьте в поле ниже.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-6 overflow-hidden flex flex-col gap-6">
                    {/* 1. Область вставки */}
                    <div className="flex-shrink-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Вставьте данные сюда (Ctrl + V)</label>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-gray-50 font-mono"
                            value={rawText}
                            onChange={e => setRawText(e.target.value)}
                            placeholder="Название	Описание	Цена...&#10;Пицца	Вкусная пицца	1000..."
                        />
                    </div>

                    {/* 2. Превью и маппинг */}
                    {gridData.length > 0 && (
                        <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Настройка колонок</label>
                            <div className="flex-grow overflow-auto border border-gray-200 rounded-lg custom-scrollbar shadow-inner bg-white">
                                <table className="w-full text-sm border-collapse">
                                    <thead className="sticky top-0 z-10 bg-gray-100">
                                        <tr>
                                            {Array.from({ length: maxCols }).map((_, idx) => (
                                                <th key={idx} className="p-3 border-r border-gray-200 last:border-0 min-w-[150px]">
                                                    <select
                                                        value={mapping[idx] || 'skip'}
                                                        onChange={e => setMapping(prev => ({ ...prev, [idx]: e.target.value as ProductField }))}
                                                        className={`w-full p-1.5 border rounded-md text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                                                            mapping[idx] !== 'skip' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-500'
                                                        }`}
                                                    >
                                                        {FIELD_OPTIONS.map(opt => (
                                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                        ))}
                                                    </select>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {gridData.slice(0, 50).map((row, rIdx) => (
                                            <tr key={rIdx} className="hover:bg-gray-50">
                                                {Array.from({ length: maxCols }).map((_, cIdx) => (
                                                    <td key={cIdx} className={`p-3 border-r border-gray-100 last:border-0 truncate max-w-[200px] ${mapping[cIdx] !== 'skip' ? 'bg-indigo-50/20' : ''}`}>
                                                        {row[cIdx] || ''}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {gridData.length > 50 && (
                                <p className="text-[10px] text-gray-400 mt-2 italic text-right">Показаны первые 50 строк из {gridData.length}</p>
                            )}
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">Отмена</button>
                    <button
                        onClick={handleImport}
                        disabled={gridData.length === 0}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 shadow-md transition-all active:scale-95"
                    >
                        Импортировать {gridData.length > 0 ? `(${gridData.length})` : ''}
                    </button>
                </footer>
            </div>
        </div>
    );
};