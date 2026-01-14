import React from 'react';
import { Project } from '../../../../../shared/types';
import { AccordionSection } from './AccordionSection';
import { AccordionSectionKey } from '../ProjectSettingsModal';

interface TeamSectionProps {
    formData: Project;
    uniqueTeams: string[];
    handleSetFormData: (value: React.SetStateAction<Project>) => void;
    isSaving: boolean;
    isCreatingTeam: boolean;
    setIsCreatingTeam: (value: boolean) => void;
    newTeamName: string;
    setNewTeamName: (value: string) => void;
    handleSaveNewTeam: () => void;
    handleCancelCreateTeam: () => void;
    activeAccordion: AccordionSectionKey | null;
    handleAccordionToggle: (key: AccordionSectionKey) => void;
}

export const TeamSection: React.FC<TeamSectionProps> = ({
    formData,
    uniqueTeams,
    handleSetFormData,
    isSaving,
    isCreatingTeam,
    setIsCreatingTeam,
    newTeamName,
    setNewTeamName,
    handleSaveNewTeam,
    handleCancelCreateTeam,
    activeAccordion,
    handleAccordionToggle
}) => {
    return (
        <AccordionSection title="Команда" sectionKey="team" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
            <p className="text-sm text-gray-500 mb-4">Команда, назначенная на проект.</p>
            {isCreatingTeam ? (
            <div className="flex items-center gap-2 animate-fade-in-up">
                <input
                    type="text"
                    placeholder="Название новой команды..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="flex-grow border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNewTeam()}
                />
                <button type="button" onClick={handleSaveNewTeam} className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700">Сохранить</button>
                <button type="button" onClick={handleCancelCreateTeam} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100" title="Отмена">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            ) : (
            <div className="flex flex-wrap gap-2 items-center">
                <button type="button" onClick={() => handleSetFormData(prev => ({ ...prev, team: undefined }))} disabled={isSaving} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors disabled:opacity-70 ${formData.team === undefined ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Без команды</button>
                {Array.from(new Set([...uniqueTeams, formData.team])).filter((t): t is string => !!t).sort().map(team => (
                    <button key={team} type="button" onClick={() => handleSetFormData(prev => ({ ...prev, team: team }))} disabled={isSaving} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors disabled:opacity-70 ${formData.team === team ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{team}</button>
                ))}
                <button
                    type="button"
                    onClick={() => setIsCreatingTeam(true)}
                    disabled={isSaving}
                    title="Создать новую команду"
                    className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full transition-colors border-blue-400 text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50"
                >
                    + Создать команду
                </button>
            </div>
            )}
        </AccordionSection>
    );
};
