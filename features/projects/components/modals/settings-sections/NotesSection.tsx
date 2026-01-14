import React from 'react';
import { Project } from '../../../../../shared/types';
import { AccordionSection } from './AccordionSection';
import { AccordionSectionKey } from '../ProjectSettingsModal';

interface NotesSectionProps {
    formData: Project;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    isSaving: boolean;
    activeAccordion: AccordionSectionKey | null;
    handleAccordionToggle: (key: AccordionSectionKey) => void;
}

export const NotesSection: React.FC<NotesSectionProps> = ({
    formData,
    handleFormChange,
    isSaving,
    activeAccordion,
    handleAccordionToggle
}) => {
    return (
        <AccordionSection title="Заметки" sectionKey="notes" activeSection={activeAccordion} onToggle={handleAccordionToggle}>
            <p className="text-sm text-gray-500 mb-4">Внутренние заметки по проекту.</p>
            <textarea name="notes" value={formData.notes || ''} onChange={handleFormChange} rows={3} disabled={isSaving} className="mt-1 w-full border rounded px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 custom-scrollbar"></textarea>
        </AccordionSection>
    );
};
