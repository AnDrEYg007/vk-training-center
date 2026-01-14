import React from 'react';
import { Project } from '../../../../../shared/types';
import { AccordionSection } from './AccordionSection';
import { AccordionSectionKey } from '../ProjectSettingsModal';

interface NameSectionProps {
    formData: Project;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    isSaving: boolean;
    activeAccordion: AccordionSectionKey | null;
    handleAccordionToggle: (key: AccordionSectionKey) => void;
}

export const NameSection: React.FC<NameSectionProps> = ({ 
    formData, 
    handleFormChange, 
    handleSubmit, 
    isSaving, 
    activeAccordion, 
    handleAccordionToggle 
}) => {
    return (
        <AccordionSection title="Название проекта" sectionKey="name" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
            <p className="text-sm text-gray-500 mb-4">Название, которое отображается в интерфейсе планировщика.</p>
            <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                disabled={isSaving} 
                // Явно обрабатываем Enter для сохранения
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="mt-1 w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
            />
        </AccordionSection>
    );
};
