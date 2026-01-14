
import React, { useMemo, useState } from 'react';
import { AdministeredGroup } from '../../../../shared/types';

interface OwnersTableProps {
    groups: AdministeredGroup[];
    isLoading: boolean;
    searchQuery: string;
}

interface OwnerStat {
    id: number;
    name: string;
    groupsCount: number;
    groups: AdministeredGroup[];
}

export const OwnersTable: React.FC<OwnersTableProps> = ({ groups, isLoading, searchQuery }) => {
    const [expandedOwnerId, setExpandedOwnerId] = useState<number | null>(null);

    const ownersStats = useMemo(() => {
        const statsMap = new Map<number, OwnerStat>();

        groups.forEach(group => {
            if (!group.creator_id) return;

            if (!statsMap.has(group.creator_id)) {
                statsMap.set(group.creator_id, {
                    id: group.creator_id,
                    name: group.creator_name || `ID: ${group.creator_id}`,
                    groupsCount: 0,
                    groups: []
                });
            }

            const stat = statsMap.get(group.creator_id)!;
            stat.groupsCount += 1;
            stat.groups.push(group);
        });

        return Array.from(statsMap.values()).sort((a, b) => b.groupsCount - a.groupsCount);
    }, [groups]);

    const filteredOwners = useMemo(() => {
        if (!searchQuery) return ownersStats;
        const lowerQuery = searchQuery.toLowerCase();
        return ownersStats.filter(owner => 
            owner.name.toLowerCase().includes(lowerQuery) || 
            String(owner.id).includes(lowerQuery)
        );
    }, [ownersStats, searchQuery]);

    const toggleExpand = (id: number) => {
        setExpandedOwnerId(prev => prev === id ? null : id);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <div className="loader border-t-indigo-500 w-8 h-8"></div>
            </div>
        );
    }

    if (ownersStats.length === 0) {
        return (
            <div className="p-12 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg">
                Нет данных о владельцах. Возможно, список групп пуст или данные не синхронизированы.
            </div>
        );
    }

    if (filteredOwners.length === 0) {
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
                        <th className="px-4 py-3">Владелец</th>
                        <th className="px-4 py-3 w-40">ID VK</th>
                        <th className="px-4 py-3 text-center w-40">Сообществ</th>
                        <th className="px-4 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {filteredOwners.map((owner) => (
                        <React.Fragment key={owner.id}>
                            <tr 
                                onClick={() => toggleExpand(owner.id)}
                                className={`cursor-pointer hover:bg-gray-50 transition-colors ${expandedOwnerId === owner.id ? 'bg-indigo-50/50' : ''}`}
                            >
                                <td className="px-4 py-3 text-gray-400 text-center">
                                     <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${expandedOwnerId === owner.id ? 'rotate-90 text-indigo-600' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="font-medium text-gray-900">{owner.name}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                                    {owner.id}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {owner.groupsCount}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <a 
                                        href={`https://vk.com/id${owner.id}`} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-indigo-600 hover:text-indigo-900 text-xs"
                                    >
                                        Профиль
                                    </a>
                                </td>
                            </tr>
                            {expandedOwnerId === owner.id && (
                                <tr className="bg-gray-50">
                                    <td colSpan={5} className="px-8 py-4 border-b border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Владеет сообществами ({owner.groups.length}):</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {owner.groups.map(g => (
                                                <a 
                                                    key={g.id}
                                                    href={`https://vk.com/${g.screen_name || 'club' + g.id}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center p-2 bg-white border border-gray-200 rounded hover:border-indigo-300 hover:shadow-sm transition-all"
                                                >
                                                    {g.photo_200 && (
                                                        <img src={g.photo_200} className="w-6 h-6 rounded-full mr-2" alt="" />
                                                    )}
                                                    <span className="text-sm text-gray-700 truncate">{g.name}</span>
                                                </a>
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
