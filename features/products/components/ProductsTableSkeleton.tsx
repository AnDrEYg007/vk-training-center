import React from 'react';

const SkeletonRow: React.FC = () => (
    <tr className="animate-pulse">
        {/* Действия */}
        <td className="px-4 py-2 align-top">
            <div className="h-8 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Фото */}
        <td className="px-4 py-2">
            <div className="h-14 w-14 bg-gray-200 rounded"></div>
        </td>
        {/* New Фото */}
        <td className="px-4 py-2">
            <div className="h-14 w-14 bg-gray-200 rounded"></div>
        </td>
        {/* Название */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Описание */}
        <td className="px-4 py-2 align-top">
            <div className="h-12 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Цена */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Старая цена */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Артикул */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Подборка */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Категория */}
         <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* VK */}
        <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
        {/* Рейтинг */}
         <td className="px-4 py-2 align-top">
            <div className="h-5 bg-gray-200 rounded mt-2"></div>
        </td>
    </tr>
);

export const ProductsTableSkeleton: React.FC = () => {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200 custom-scrollbar">
            {/* Используем table-layout: fixed для стабильности */}
            <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
                 {/* Определяем ширину колонок, чтобы они соответствовали DEFAULT_COLUMN_WIDTHS */}
                <colgroup>
                    <col style={{ width: '110px' }} /> {/* actions */}
                    <col style={{ width: '80px' }} />  {/* photo */}
                    <col style={{ width: '80px' }} />  {/* new_photo */}
                    <col style={{ width: '120px' }} /> {/* title */}
                    <col style={{ width: '300px' }} /> {/* description */}
                    <col style={{ width: '80px' }} />  {/* price */}
                    <col style={{ width: '120px' }} /> {/* old_price */}
                    <col style={{ width: '100px' }} /> {/* sku */}
                    <col style={{ width: '100px' }} /> {/* albums */}
                    <col style={{ width: '120px' }} /> {/* category */}
                    <col style={{ width: '60px' }} />  {/* vk_link */}
                    <col style={{ width: '80px' }} />  {/* rating */}
                </colgroup>
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Фото</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">New Фото</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Цена</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Старая цена</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Артикул</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Подборка</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Категория</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">VK</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Рейтинг</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonRow key={index} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};