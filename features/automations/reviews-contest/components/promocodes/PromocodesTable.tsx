
import React from 'react';
import { PromoCode } from '../../types';
import { Project } from '../../../../../shared/types';
import { PromocodeRow } from './PromocodeRow';

interface PromocodesTableProps {
    promocodes: PromoCode[];
    project: Project;
    isLoading: boolean;
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onToggleAll: () => void;
    onDelete: (ids: string[]) => void;
    // Editing props
    editingId: string | null;
    editingDescription: string;
    onStartEditing: (promo: PromoCode) => void;
    onSaveEditing: () => void;
    onCancelEditing: () => void;
    onEditingDescriptionChange: (val: string) => void;
    // Admin props
    isAdmin?: boolean;
    onClearAll?: () => void;
}

export const PromocodesTable: React.FC<PromocodesTableProps> = ({
    promocodes,
    project,
    isLoading,
    selectedIds,
    onToggleSelection,
    onToggleAll,
    onDelete,
    editingId,
    editingDescription,
    onStartEditing,
    onSaveEditing,
    onCancelEditing,
    onEditingDescriptionChange,
    isAdmin,
    onClearAll,
}) => {
    
    const availableCodesCount = promocodes.filter(p => !p.is_issued).length;

    return (
        <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-250px)]">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">База промокодов</span>
                     {selectedIds.size > 0 && (
                        <button 
                            onClick={() => onDelete(Array.from(selectedIds))}
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded border border-red-200 hover:bg-red-200 transition-colors"
                        >
                            Удалить выбранные ({selectedIds.size})
                        </button>
                    )}
                    {isAdmin && onClearAll && (
                         <button 
                            onClick={onClearAll}
                            className="text-xs text-red-500 bg-white border border-red-200 px-2 py-1 rounded hover:bg-red-50 transition-colors flex items-center gap-1 shadow-sm"
                            title="Полностью очистить базу промокодов"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Очистить базу
                        </button>
                    )}
                </div>
                <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">Всего: <strong>{promocodes.length}</strong></span>
                    <span className="text-green-600">Свободно: <strong>{promocodes.filter(p => !p.is_issued).length}</strong></span>
                    <span className="text-indigo-600">Выдано: <strong>{promocodes.filter(p => p.is_issued).length}</strong></span>
                </div>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-grow relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                         <div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}
                
                {promocodes.length === 0 && !isLoading ? (
                    <div className="p-8 text-center text-gray-400 italic">База промокодов пуста.</div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-3 w-10 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        checked={selectedIds.size > 0 && selectedIds.size === availableCodesCount}
                                        onChange={onToggleAll}
                                        disabled={availableCodesCount === 0}
                                    />
                                </th>
                                <th className="px-4 py-3 w-40">Код</th>
                                <th className="px-4 py-3">Описание</th>
                                <th className="px-4 py-3 w-28">Статус</th>
                                <th className="px-4 py-3 w-48">Кому выдан</th>
                                <th className="px-4 py-3 w-24 text-center">Диалог</th>
                                <th className="px-4 py-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {promocodes.map(promo => (
                                <PromocodeRow
                                    key={promo.id}
                                    promo={promo}
                                    project={project}
                                    isSelected={selectedIds.has(promo.id)}
                                    isEditing={editingId === promo.id}
                                    editingDescription={editingDescription}
                                    onToggleSelection={onToggleSelection}
                                    onStartEditing={onStartEditing}
                                    onSaveEditing={onSaveEditing}
                                    onCancelEditing={onCancelEditing}
                                    onEditingDescriptionChange={onEditingDescriptionChange}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
