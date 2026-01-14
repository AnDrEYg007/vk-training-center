
import React, { useState, useRef, useEffect } from 'react';
import { NO_TOKENS_LABEL } from '../../hooks/useAdministeredGroups';

interface MultiSelectDropdownProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    label: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selected, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (option: string) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleSelectAll = () => onChange(options);
    const handleClear = () => onChange([]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between min-w-[200px] max-w-xs px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    selected.length > 0 ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-700'
                }`}
            >
                <span className="truncate mr-2">
                    {selected.length === 0 
                        ? label 
                        : selected.length === options.length 
                            ? 'Все токены' 
                            : `Выбрано: ${selected.length}`}
                </span>
                <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 z-20 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-100 flex justify-between">
                        <button onClick={handleSelectAll} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Выбрать все</button>
                        <button onClick={handleClear} className="text-xs text-gray-500 hover:text-gray-700">Сброс</button>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                        {options.map(opt => (
                            <label key={opt} className={`flex items-start px-3 py-2 text-sm cursor-pointer rounded-md ${opt === NO_TOKENS_LABEL ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-gray-700 hover:bg-gray-50'}`}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(opt)}
                                    onChange={() => handleToggle(opt)}
                                    className={`mt-0.5 w-4 h-4 border-gray-300 rounded focus:ring-indigo-500 mr-2 flex-shrink-0 ${opt === NO_TOKENS_LABEL ? 'text-red-600 focus:ring-red-500' : 'text-indigo-600'}`}
                                />
                                <span className="break-words leading-tight">{opt}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
