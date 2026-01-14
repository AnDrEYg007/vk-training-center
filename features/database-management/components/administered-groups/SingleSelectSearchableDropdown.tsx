
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface SingleSelectSearchableDropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    className?: string;
}

export const SingleSelectSearchableDropdown: React.FC<SingleSelectSearchableDropdownProps> = ({ 
    options, 
    value, 
    onChange, 
    label,
    placeholder = "Все",
    className
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const lower = searchQuery.toLowerCase();
        return options.filter(opt => opt.toLowerCase().includes(lower));
    }, [options, searchQuery]);

    const updatePosition = useCallback(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.left,
                width: Math.max(rect.width, 240), // Минимальная ширина выпадающего списка
            });
        }
    }, []);

    const toggleDropdown = useCallback(() => {
        if (!isOpen) {
            updatePosition();
            setSearchQuery(''); // Сброс поиска при открытии
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

    const displayValue = value || placeholder;
    const isActive = !!value;

    return (
        <div className={`relative ${className || ''}`}>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className={`flex items-center justify-between min-w-[200px] max-w-xs px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                    isActive ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-700'
                }`}
                title={displayValue}
            >
                <div className="flex items-center gap-2 truncate">
                    <span className={`text-xs font-medium ${isActive ? 'text-indigo-500' : 'text-gray-500'}`}>{label}:</span>
                    <span className="truncate font-medium">{displayValue}</span>
                </div>
                <svg 
                    className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && createPortal(
                <div 
                    ref={menuRef}
                    className="fixed z-[100] bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up flex flex-col max-h-[300px]"
                    style={{ 
                        top: `${position.top}px`, 
                        left: `${position.left}px`, 
                        width: `${position.width}px`
                    }}
                >
                    <div className="p-2 border-b border-gray-100 flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="overflow-y-auto custom-scrollbar flex-grow p-1">
                        <button
                            onClick={() => handleSelect('')}
                            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                                value === '' 
                                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {placeholder}
                        </button>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleSelect(opt)}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors truncate ${
                                        value === opt
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    title={opt}
                                >
                                    {opt}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-xs text-gray-400 text-center">
                                Ничего не найдено
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
