import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NewProductRow } from '../../types';
import { MarketAlbum, MarketCategory } from '../../../../shared/types';
import { HEADER_MAP } from '../../utils/fileParser';

interface FileImportMappingModalProps {
    gridData: string[][];
    onClose: () => void;
    onImport: (rows: NewProductRow[]) => void;
    allAlbums: MarketAlbum[];
    allCategories: MarketCategory[];
}

type ProductField = 'title' | 'description' | 'price' | 'old_price' | 'sku' | 'category' | 'album' | 'skip' | 'vk_id' | 'vk_link';

const FIELD_OPTIONS: { value: ProductField; label: string }[] = [
    { value: 'skip', label: 'Пропустить' },
    { value: 'title', label: 'Название' },
    { value: 'description', label: 'Описание' },
    { value: 'price', label: 'Цена' },
    { value: 'old_price', label: 'Старая цена' },
    { value: 'sku', label: 'Артикул' },
    { value: 'category', label: 'Категория' },
    { value: 'album', label: 'Подборка' },
    { value: 'vk_id', label: 'VK ID' },
    { value: 'vk_link', label: 'VK Link' },
];

export const FileImportMappingModal: React.FC<FileImportMappingModalProps> = ({
    gridData, onClose, onImport, allAlbums, allCategories
}) => {
    const [mapping, setMapping] = useState<Record<number, ProductField>>({});

    const maxCols = useMemo(() => gridData[0]?.length || 0, [gridData]);

    // Инициализация маппинга на основе заголовков файла
    useEffect(() => {
        if (gridData.length > 0) {
            const initialMapping: Record<number, ProductField> = {};
            const headers = gridData[0].map(h => h.toLowerCase().trim());
            
            headers.forEach((header, idx) => {
                // Пытаемся автоматически найти подходящее поле
                const suggestedField = HEADER_MAP[header] as ProductField;
                initialMapping[idx] = suggestedField || 'skip';
            });
            setMapping(initialMapping);
        }
    }, [gridData]);

    const handleImport = () => {
        const dataRows = gridData.slice(1);
        const resultRows: NewProductRow[] = dataRows.map(row => {
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
                else if (field === 'vk_id') newRow.vk_id = val;
                else if (field === 'vk_link') newRow.vk_link = val;
                else if (field === 'category') {
                    const lowerVal = val.toLowerCase();
                    const idMatch = val.match(/\((\d+)\)$/);
                    let found: MarketCategory | undefined;
                    
                    if (idMatch) {
                        const id = parseInt(idMatch[1], 10);
                        found = allCategories.find(c => c.id === id);
                    }
                    if (!found) {
                        found = allCategories.find(c => 
                            c.name.toLowerCase() === lowerVal || 
                            `${c.section_name} / ${c.name}`.toLowerCase() === lowerVal
                        );
                    }

                    if (found) {
                        newRow.category = {
                            id: found.id,
                            name: found.name,
                            section_id: found.section_id,
                            section_name: found.section_name
                        };
                    }
                } else if (field === 'album') {
                    const lowerVal = val.toLowerCase().split('(')[0].trim();
                    const found = allAlbums.find(a => a.title.toLowerCase() === lowerVal);
                    if (found) newRow.album_ids = [found.id];
                }
                
                // Для фото по URL в файлах обычно используется 'фото (url)' -> photoUrl
                if (field === 'photoUrl' as any) {
                    newRow.photoUrl = val;
                    newRow.photoPreview = val;
                }
            });
            return newRow;
        });

        onImport(resultRows.filter(r => r.title || r.price || r.photoPreview));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Настройка импорта из файла</h2>
                        <p className="text-xs text-gray-500 mt-1">Сопоставьте колонки вашего файла с полями системы.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-6 overflow-hidden flex flex-col flex-grow">
                    <div className="flex-grow overflow-auto border border-gray-200 rounded-lg custom-scrollbar bg-white shadow-inner">
                        <table className="w-full text-sm border-collapse">
                            <thead className="sticky top-0 z-10 bg-gray-100">
                                <tr>
                                    {Array.from({ length: maxCols }).map((_, idx) => (
                                        <th key={idx} className="p-3 border-r border-gray-200 last:border-0 min-w-[180px]">
                                            <div className="flex flex-col gap-2">
                                                <div className="text-[10px] text-gray-400 uppercase truncate" title={gridData[0]?.[idx]}>
                                                    Колонка: {gridData[0]?.[idx] || idx + 1}
                                                </div>
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
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {gridData.slice(1, 20).map((row, rIdx) => (
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
                    <p className="mt-4 text-xs text-gray-500 italic">Показаны первые 20 строк файла для предпросмотра.</p>
                </main>

                <footer className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">Отмена</button>
                    <button
                        onClick={handleImport}
                        className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                    >
                        Импортировать товары ({gridData.length - 1})
                    </button>
                </footer>
            </div>
        </div>
    );
};