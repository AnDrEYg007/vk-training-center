import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    defaultValue?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
    label, 
    value, 
    options, 
    onChange, 
    defaultValue = 'all' 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = value !== defaultValue;

    const updatePosition = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.left,
            });
        }
    }, []);

    const toggleDropdown = useCallback(() => {
        if (!isOpen) {
            updatePosition();
        }
        setIsOpen(prev => !prev);
    }, [isOpen, updatePosition]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                menuRef.current && !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleScrollOrResize = () => {
            if (isOpen) updatePosition();
        };

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScrollOrResize, true);
        window.addEventListener('resize', handleScrollOrResize);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScrollOrResize, true);
            window.removeEventListener('resize', handleScrollOrResize);
        };
    }, [isOpen, updatePosition]);

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    const selectedLabel = options.find(o => o.value === value)?.label || value;

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`flex items-center h-9 px-3 text-sm font-medium border rounded-md transition-colors whitespace-nowrap ${
                    isActive
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 ring-1 ring-indigo-200'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={`${label}: ${selectedLabel}`}
            >
                <span className={`mr-2 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>{label}:</span>
                <span>{selectedLabel}</span>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    className="fixed z-[100] bg-white rounded-md shadow-lg border border-gray-200 py-1 animate-fade-in-up min-w-[180px]"
                    style={{ top: position.top, left: position.left }}
                >
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                value === option.value
                                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    );
};