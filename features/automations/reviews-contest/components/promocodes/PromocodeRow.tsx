
import React from 'react';
import { PromoCode } from '../../types';
import { Project } from '../../../../../shared/types';

interface PromocodeRowProps {
    promo: PromoCode;
    project: Project;
    isSelected: boolean;
    isEditing: boolean;
    editingDescription: string;
    onToggleSelection: (id: string) => void;
    onStartEditing: (promo: PromoCode) => void;
    onSaveEditing: () => void;
    onCancelEditing: () => void;
    onEditingDescriptionChange: (val: string) => void;
    onDelete: (ids: string[]) => void;
}

export const PromocodeRow: React.FC<PromocodeRowProps> = ({
    promo,
    project,
    isSelected,
    isEditing,
    editingDescription,
    onToggleSelection,
    onStartEditing,
    onSaveEditing,
    onCancelEditing,
    onEditingDescriptionChange,
    onDelete,
}) => {
    
    const getDialogLink = (userId?: number) => {
        if (!userId) return '#';
        return `https://vk.com/gim${project.vkProjectId}?sel=${userId}`;
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors group">
            <td className="px-4 py-3 text-center">
                {!promo.is_issued && (
                    <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        checked={isSelected}
                        onChange={() => onToggleSelection(promo.id)}
                    />
                )}
            </td>
            <td className="px-4 py-3 font-mono text-gray-700 font-medium whitespace-nowrap">
                {promo.code}
            </td>
            <td className="px-4 py-3 text-gray-600">
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input 
                            type="text" 
                            value={editingDescription}
                            onChange={(e) => onEditingDescriptionChange(e.target.value)}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onSaveEditing();
                                if (e.key === 'Escape') onCancelEditing();
                            }}
                        />
                        <button onClick={onSaveEditing} className="text-green-600 hover:text-green-800 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></button>
                        <button onClick={onCancelEditing} className="text-red-500 hover:text-red-700 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 group/edit">
                        <span>{promo.description || <span className="text-gray-400 italic">Нет описания</span>}</span>
                        {!promo.is_issued && (
                            <button 
                                onClick={() => onStartEditing(promo)}
                                className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                                title="Редактировать описание"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                            </button>
                        )}
                    </div>
                )}
            </td>
            <td className="px-4 py-3">
                {promo.is_issued ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Выдан
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Свободен
                    </span>
                )}
            </td>
            <td className="px-4 py-3">
                {promo.is_issued && promo.issued_to_user_id ? (
                    <div className="flex flex-col">
                        <a href={`https://vk.com/id${promo.issued_to_user_id}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium truncate max-w-[150px]">
                            {promo.issued_to_user_name || 'Пользователь'}
                        </a>
                        <span className="text-xs text-gray-400">ID: {promo.issued_to_user_id}</span>
                        {promo.issued_at && (
                            <span className="text-[10px] text-gray-400">
                                {new Date(promo.issued_at).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </td>
            <td className="px-4 py-3 text-center">
                {promo.is_issued && promo.issued_to_user_id ? (
                    <a 
                        href={getDialogLink(promo.issued_to_user_id)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50 transition-colors"
                        title="Открыть диалог с пользователем"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </a>
                ) : (
                    <span className="text-gray-300">—</span>
                )}
            </td>
            <td className="px-4 py-3 text-right">
                {!promo.is_issued && (
                    <button 
                        onClick={() => onDelete([promo.id])}
                        className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                        title="Удалить промокод"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </td>
        </tr>
    );
};
