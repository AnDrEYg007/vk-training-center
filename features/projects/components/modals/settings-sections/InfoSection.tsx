import React from 'react';
import { Project } from '../../../../../shared/types';
import { AccordionSection } from './AccordionSection';
import { AccordionSectionKey } from '../ProjectSettingsModal';

interface InfoSectionProps {
    formData: Project;
    activeAccordion: AccordionSectionKey | null;
    handleAccordionToggle: (key: AccordionSectionKey) => void;
}

export const InfoSection: React.FC<InfoSectionProps> = ({
    formData,
    activeAccordion,
    handleAccordionToggle
}) => {
    return (
        <AccordionSection title="Информация VK" sectionKey="info" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
            <p className="text-sm text-gray-500 mb-4">Эти данные не редактируются и загружаются из базы.</p>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Название группы VK</label>
                    <input type="text" value={formData.vkGroupName} readOnly className="mt-1 w-full border rounded px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ссылка на проект</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="text" value={formData.vkLink} readOnly className="flex-1 w-full min-w-0 rounded-none rounded-l-md px-3 py-2 text-sm bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed"/>
                        <a href={formData.vkLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </AccordionSection>
    );
};
