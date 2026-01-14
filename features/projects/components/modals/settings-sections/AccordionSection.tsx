import React from 'react';
import { AccordionSectionKey } from '../ProjectSettingsModal';

interface AccordionSectionProps {
    title: string;
    sectionKey: AccordionSectionKey;
    activeSection: AccordionSectionKey | null;
    onToggle: (key: AccordionSectionKey) => void;
    children: React.ReactNode;
}

export const AccordionSection: React.FC<AccordionSectionProps> = ({ title, sectionKey, activeSection, onToggle, children }) => {
    const isOpen = activeSection === sectionKey;
    return (
        <div className="border-b border-gray-200 last:border-b-0">
            <div
                className="flex justify-between items-center cursor-pointer group py-4"
                onClick={() => onToggle(sectionKey)}
                aria-expanded={isOpen}
                aria-controls={`section-content-${sectionKey}`}
            >
                <h3 className="text-base font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-500 transition-transform duration-500 ease-in-out ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <div
                id={`section-content-${sectionKey}`}
                className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] opacity-100 pb-4 px-1' : 'max-h-0 opacity-0'}`}
            >
                {children}
            </div>
        </div>
    );
};
