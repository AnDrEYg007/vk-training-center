import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ActionItem } from '../../../shared/hooks/useResponsiveActions';

interface ActionsDropdownProps {
    actions: ActionItem[];
}

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // w-48 в tailwind = 12rem = 192px
            const menuWidth = 192; 
            setPosition({
                top: rect.bottom + 4, // 4px отступ снизу
                left: rect.right - menuWidth, // Выравниваем по правому краю
            });
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                menuRef.current && !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (actions.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={(e) => { e.stopPropagation(); setIsOpen(prev => !prev); }}
                title="Ещё"
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-indigo-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in-up"
                    style={{ top: `${position.top}px`, left: `${position.left}px` }}
                >
                    <ul className="py-1">
                        {actions.map(action => (
                            <li key={action.id}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(e);
                                        setIsOpen(false);
                                    }}
                                    disabled={action.disabled}
                                    title={action.label}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="mr-3">{action.icon}</span>
                                    {action.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>,
                document.body
            )}
        </div>
    );
};