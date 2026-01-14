
import React, { useState } from 'react';
import { AdministeredGroup, GroupAdmin } from '../../../../shared/types';
import * as api from '../../../../services/api/management.api';

interface GroupsTableProps {
    isLoading: boolean;
    error: string | null;
    filteredGroups: AdministeredGroup[];
    totalGroups: number;
    selectedSources: string[];
    systemBotIds: Set<number>; // Новое свойство
}

export const GroupsTable: React.FC<GroupsTableProps> = ({ 
    isLoading, 
    error, 
    filteredGroups, 
    totalGroups, 
    selectedSources,
    systemBotIds 
}) => {
    const [updatingGroupId, setUpdatingGroupId] = useState<number | null>(null);

    // Обновляем состояние после получения данных с сервера (локально)
    const [localGroupUpdates, setLocalGroupUpdates] = useState<Record<number, AdministeredGroup>>({});

    const handleScanAdmins = async (group: AdministeredGroup) => {
        setUpdatingGroupId(group.id);
        try {
            const updatedGroup = await api.syncGroupAdmins(group.id);
            setLocalGroupUpdates(prev => ({ ...prev, [group.id]: updatedGroup }));
        } catch (e) {
            window.showAppToast?.(`Ошибка при сканировании: ${e instanceof Error ? e.message : String(e)}`, 'error');
        } finally {
            setUpdatingGroupId(null);
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'creator': return 'Владелец';
            case 'administrator': return 'Админ';
            case 'editor': return 'Редактор';
            case 'moderator': return 'Модератор';
            default: return role;
        }
    };

    const getAdminStyle = (admin: GroupAdmin) => {
        if (admin.status === 'inactive') {
            return 'bg-gray-100 text-gray-500 border-gray-200 line-through decoration-gray-400/50';
        }
        
        switch (admin.role) {
            case 'creator': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'administrator': return 'bg-red-100 text-red-800 border-red-200';
            case 'editor': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'moderator': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="loader border-t-indigo-500 w-8 h-8"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-600 p-8 bg-red-50 rounded-lg">{error}</div>;
    }

    if (filteredGroups.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                {totalGroups === 0 
                    ? 'Список пуст. Нажмите "Обновить данные", чтобы просканировать аккаунты.' 
                    : 'Нет групп, соответствующих заданным фильтрам.'}
            </div>
        );
    }

    return (
        <>
            <div className="mb-2 text-xs text-gray-500 font-medium">
                Показано: {filteredGroups.length} из {totalGroups}
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                        <tr>
                            <th className="px-4 py-3 w-16">Фото</th>
                            <th className="px-4 py-3 w-48">Название</th>
                            <th className="px-4 py-3 w-40">Создатель</th>
                            <th className="px-4 py-3">Администраторы (VK)</th>
                            <th className="px-4 py-3 w-1/4">Токены (Доступ)</th>
                            <th className="px-4 py-3 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredGroups.map((origGroup) => {
                            const group = localGroupUpdates[origGroup.id] || origGroup;
                            const isLost = group.admin_sources.length === 0;
                            const isUpdating = updatingGroupId === group.id;
                            
                            const admins: GroupAdmin[] = group.admins_data || [];
                            
                            // Препроцессинг админов: если группа потеряна И админ является нашим ботом -> помечаем как inactive
                            const processedAdmins = admins.map((admin): GroupAdmin => {
                                if (isLost && systemBotIds.has(admin.id)) {
                                    return { ...admin, status: 'inactive' };
                                }
                                return admin;
                            });

                            // Сортируем: сначала активные, потом неактивные. Внутри активных: creator -> admin -> editor
                            const sortedAdmins = processedAdmins.sort((a, b) => {
                                if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
                                const roleOrder: Record<string, number> = { creator: 0, administrator: 1, editor: 2, moderator: 3 };
                                return (roleOrder[a.role] ?? 4) - (roleOrder[b.role] ?? 4);
                            });

                            return (
                                <tr key={group.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        {group.photo_200 ? (
                                            <img src={group.photo_200} alt="" className={`w-10 h-10 rounded-full object-cover border border-gray-200 ${isLost ? 'grayscale opacity-70' : ''}`} />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col">
                                            <a 
                                                href={`https://vk.com/${group.screen_name || ('club' + group.id)}`} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                className={`font-medium text-base ${isLost ? 'text-gray-500' : 'text-indigo-600 hover:text-indigo-800'}`}
                                            >
                                                {group.name}
                                            </a>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-400 font-mono">ID: {group.id}</span>
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                                    {(group.members_count || 0).toLocaleString()} уч.
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {group.creator_name ? (
                                            <div className="flex flex-col">
                                                 <span className="text-sm font-medium text-gray-800">{group.creator_name}</span>
                                                 <a href={`https://vk.com/id${group.creator_id}`} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">ID: {group.creator_id}</a>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 text-xs">—</span>
                                        )}
                                    </td>
                                    
                                    {/* Колонка "Администраторы" */}
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1.5">
                                            {sortedAdmins.length > 0 ? (
                                                sortedAdmins.map(admin => (
                                                    <a
                                                        key={admin.id}
                                                        href={`https://vk.com/id${admin.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border hover:opacity-80 transition-opacity whitespace-nowrap ${getAdminStyle(admin)}`}
                                                        title={`Роль: ${getRoleLabel(admin.role)}\nСтатус: ${admin.status === 'active' ? 'Активен' : 'Утрачен'}\nПрава: ${admin.permissions?.join(', ') || 'нет'}`}
                                                    >
                                                        {admin.first_name} {admin.last_name}
                                                    </a>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">
                                                    {isLost ? "Данные недоступны" : 'Нажмите "Админы"'}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Колонка "Токены" */}
                                    <td className="px-4 py-3">
                                        {isLost ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                                Статус утерян
                                            </span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {group.admin_sources.map((source, idx) => {
                                                    const isSelected = selectedSources.includes(source);
                                                    return (
                                                        <span 
                                                            key={idx} 
                                                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${isSelected ? 'bg-indigo-100 text-indigo-800 border-indigo-200 ring-1 ring-indigo-300' : 'bg-blue-50 text-blue-700 border-blue-100'}`}
                                                        >
                                                            {source}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                         {!isLost && (
                                            <button
                                                onClick={() => handleScanAdmins(group)}
                                                disabled={isUpdating}
                                                className="text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2 py-1.5 rounded transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1"
                                                title="Сканировать админов"
                                            >
                                                {isUpdating ? (
                                                    <div className="loader h-3 w-3 border-indigo-600 border-t-transparent"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                    </svg>
                                                )}
                                                Админы
                                            </button>
                                         )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};
