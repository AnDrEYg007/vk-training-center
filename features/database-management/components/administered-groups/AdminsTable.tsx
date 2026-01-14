
import React, { useMemo, useState } from 'react';
import { AdministeredGroup } from '../../../../shared/types';

interface AdminsTableProps {
    groups: AdministeredGroup[];
    isLoading: boolean;
    searchQuery: string;
}

interface GroupRoleInfo {
    group: AdministeredGroup;
    role: string;
}

interface AdminStat {
    id: number;
    name: string;
    totalGroups: number;
    roles: {
        administrator: number;
        editor: number;
        moderator: number;
        creator: number; // На случай если попадет сюда
    };
    groupsList: GroupRoleInfo[];
}

export const AdminsTable: React.FC<AdminsTableProps> = ({ groups, isLoading, searchQuery }) => {
    const [expandedAdminId, setExpandedAdminId] = useState<number | null>(null);

    const adminsStats = useMemo(() => {
        const statsMap = new Map<number, AdminStat>();

        groups.forEach(group => {
            if (!group.admins_data || group.admins_data.length === 0) return;

            group.admins_data.forEach(admin => {
                // Если статус неактивен (например, потерян доступ), пропускаем или помечаем
                if (admin.status !== 'active') return;

                if (!statsMap.has(admin.id)) {
                    statsMap.set(admin.id, {
                        id: admin.id,
                        name: `${admin.first_name} ${admin.last_name}`.trim(),
                        totalGroups: 0,
                        roles: { administrator: 0, editor: 0, moderator: 0, creator: 0 },
                        groupsList: []
                    });
                }

                const stat = statsMap.get(admin.id)!;
                stat.totalGroups += 1;
                
                // Увеличиваем счетчик конкретной роли
                if (admin.role in stat.roles) {
                    stat.roles[admin.role as keyof typeof stat.roles] += 1;
                }

                stat.groupsList.push({
                    group: group,
                    role: admin.role
                });
            });
        });

        return Array.from(statsMap.values()).sort((a, b) => b.totalGroups - a.totalGroups);
    }, [groups]);

    const filteredAdmins = useMemo(() => {
        if (!searchQuery) return adminsStats;
        const lowerQuery = searchQuery.toLowerCase();
        return adminsStats.filter(admin => 
            admin.name.toLowerCase().includes(lowerQuery) || 
            String(admin.id).includes(lowerQuery)
        );
    }, [adminsStats, searchQuery]);

    const toggleExpand = (id: number) => {
        setExpandedAdminId(prev => prev === id ? null : id);
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'creator': return 'bg-blue-100 text-blue-800';
            case 'administrator': return 'bg-red-100 text-red-800';
            case 'editor': return 'bg-orange-100 text-orange-800';
            case 'moderator': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    const getRoleName = (role: string) => {
        switch (role) {
            case 'creator': return 'Владелец';
            case 'administrator': return 'Админ';
            case 'editor': return 'Редактор';
            case 'moderator': return 'Модер';
            default: return role;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="loader border-t-indigo-500 w-8 h-8"></div>
            </div>
        );
    }

    if (adminsStats.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                Нет данных об администраторах. Нажмите "Получить админов" в главном меню, чтобы собрать данные.
            </div>
        );
    }

    if (filteredAdmins.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                По запросу "{searchQuery}" ничего не найдено.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                    <tr>
                        <th className="px-4 py-3 w-10"></th>
                        <th className="px-4 py-3">Администратор</th>
                        <th className="px-4 py-3 w-32">ID VK</th>
                        <th className="px-4 py-3 text-center w-24">Всего групп</th>
                        <th className="px-4 py-3">Роли (Сводка)</th>
                        <th className="px-4 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredAdmins.map((admin) => (
                        <React.Fragment key={admin.id}>
                            <tr 
                                onClick={() => toggleExpand(admin.id)}
                                className={`cursor-pointer hover:bg-gray-50 transition-colors ${expandedAdminId === admin.id ? 'bg-indigo-50/50' : ''}`}
                            >
                                <td className="px-4 py-3 text-gray-400 text-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedAdminId === admin.id ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900">{admin.name}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                    {admin.id}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="font-bold text-gray-800">{admin.totalGroups}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        {admin.roles.administrator > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                Админ: {admin.roles.administrator}
                                            </span>
                                        )}
                                        {admin.roles.editor > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                Редактор: {admin.roles.editor}
                                            </span>
                                        )}
                                        {admin.roles.moderator > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Модер: {admin.roles.moderator}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <a 
                                        href={`https://vk.com/id${admin.id}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs"
                                    >
                                        Профиль
                                    </a>
                                </td>
                            </tr>
                            {expandedAdminId === admin.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan={6} className="px-8 py-4 border-b border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Управляет сообществами ({admin.groupsList.length}):</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {admin.groupsList.map((item, idx) => (
                                                <div 
                                                    key={`${item.group.id}-${idx}`}
                                                    className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded hover:border-indigo-300 hover:shadow-sm transition-all"
                                                >
                                                    <a 
                                                        href={`https://vk.com/${item.group.screen_name || 'club' + item.group.id}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center flex-1 min-w-0 mr-2"
                                                    >
                                                        {item.group.photo_200 && (
                                                            <img src={item.group.photo_200} className="w-6 h-6 rounded-full mr-2 flex-shrink-0" alt="" />
                                                        )}
                                                        <span className="text-sm text-gray-700 truncate">{item.group.name}</span>
                                                    </a>
                                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${getRoleBadge(item.role)}`}>
                                                        {getRoleName(item.role)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
