import React, { useState, useMemo } from 'react';
import { Project } from '../../../../shared/types';
import { TeamFilter } from '../../../projects/types';

interface MultiProjectSelectorProps {
    allProjects: Project[];
    selectedIds: Set<string>;
    currentProjectId: string;
    onSelectionChange: (newIds: Set<string>) => void;
}

export const MultiProjectSelector: React.FC<MultiProjectSelectorProps> = ({
    allProjects,
    selectedIds,
    currentProjectId,
    onSelectionChange,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState<TeamFilter>('All');

    const uniqueTeams = useMemo(() => {
        const teams = new Set<string>();
        allProjects.forEach(p => {
            if (p.team) teams.add(p.team);
        });
        return Array.from(teams).sort();
    }, [allProjects]);

    const filteredProjects = useMemo(() => {
        return allProjects.filter(p => {
            if (p.disabled) return false;
            if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (teamFilter !== 'All') {
                if (teamFilter === 'NoTeam' && p.team) return false;
                if (teamFilter !== 'NoTeam' && p.team !== teamFilter) return false;
            }
            return true;
        });
    }, [allProjects, searchQuery, teamFilter]);

    const handleToggleProject = (projectId: string) => {
        const newIds = new Set(selectedIds);
        if (newIds.has(projectId)) {
            newIds.delete(projectId);
        } else {
            newIds.add(projectId);
        }
        onSelectionChange(newIds);
    };

    const handleSelectAllVisible = () => {
        const allVisibleIds = new Set(filteredProjects.map(p => p.id));
        const newIds = new Set([...selectedIds, ...allVisibleIds]);
        onSelectionChange(newIds);
    };

    const handleDeselectAllVisible = () => {
        const visibleIdsToRemove = new Set(filteredProjects.map(p => p.id));
        const newIds = new Set(selectedIds);
        visibleIdsToRemove.forEach(id => {
            if (id !== currentProjectId) { // Нельзя снять выделение с текущего проекта
                newIds.delete(id);
            }
        });
        onSelectionChange(newIds);
    };
    
    return (
        <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fade-in-up">
            <div className="flex justify-between items-center">
                 <h3 className="text-sm font-semibold text-gray-800">Выберите проекты для публикации</h3>
                 <span className="text-sm font-medium text-gray-600">Выбрано: {selectedIds.size}</span>
            </div>
           
            <div className="flex gap-2 items-center">
                 <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>
            <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setTeamFilter('All')} className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${teamFilter === 'All' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Все</button>
                {uniqueTeams.map(team => (
                    <button key={team} onClick={() => setTeamFilter(team)} className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${teamFilter === team ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                        {team}
                    </button>
                ))}
                <button onClick={() => setTeamFilter('NoTeam')} className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${teamFilter === 'NoTeam' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Без команды</button>
            </div>
             <div className="flex items-center justify-end gap-2 text-xs font-medium">
                <button onClick={handleSelectAllVisible} className="text-indigo-600 hover:text-indigo-800">Выбрать все видимые</button>
                <span>|</span>
                <button onClick={handleDeselectAllVisible} className="text-indigo-600 hover:text-indigo-800">Снять выделение</button>
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar border rounded-md p-2 space-y-1 bg-white">
                {filteredProjects.length > 0 ? filteredProjects.map(project => {
                    const isCurrent = project.id === currentProjectId;
                    const isChecked = selectedIds.has(project.id);
                    return (
                        <label key={project.id} className={`flex items-center p-2 rounded-md cursor-pointer ${isCurrent ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isCurrent}
                                onChange={() => handleToggleProject(project.id)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                            />
                            <span className={`ml-3 text-sm font-medium ${isCurrent ? 'text-gray-500' : 'text-gray-800'}`}>{project.name}</span>
                        </label>
                    )
                }) : (
                    <p className="text-sm text-gray-500 text-center p-4">Проекты не найдены.</p>
                )}
            </div>
        </div>
    );
};
