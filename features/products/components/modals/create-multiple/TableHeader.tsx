
import React from 'react';

interface TableHeaderProps {
    onToggleAll: () => void;
    allSelected: boolean;
    hasRows: boolean;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ onToggleAll, allSelected, hasRows }) => {
    return (
        <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
                <th className="p-3 w-10 text-center">
                     <input 
                        type="checkbox" 
                        checked={hasRows && allSelected}
                        onChange={onToggleAll}
                        disabled={!hasRows}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                    />
                </th>
                <th className="p-3 w-[90px]"></th>
                <th className="p-3 text-left font-medium text-gray-500">Фото / URL <span className="text-red-500">*</span></th>
                <th className="p-3 text-left font-medium text-gray-500">Название <span className="text-red-500">*</span></th>
                <th className="p-3 text-left font-medium text-gray-500">Описание</th>
                <th className="p-3 text-left font-medium text-gray-500">Цена, ₽ <span className="text-red-500">*</span></th>
                <th className="p-3 text-left font-medium text-gray-500">Старая цена</th>
                <th className="p-3 text-left font-medium text-gray-500">Артикул</th>
                <th className="p-3 text-left font-medium text-gray-500">Подборка</th>
                <th className="p-3 text-left font-medium text-gray-500">Категория <span className="text-red-500">*</span></th>
            </tr>
        </thead>
    );
};
