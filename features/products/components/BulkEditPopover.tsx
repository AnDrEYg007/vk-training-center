import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

type EditableField = 'Название' | 'Описание' | 'Подборку' | 'Цену' | 'Старую цену' | 'Категорию';

const FIELDS_TO_EDIT: EditableField[] = [
    'Название', 'Описание', 'Подборку', 'Цену', 'Старую цену', 'Категорию'
];

interface BulkEditPopoverProps {
    targetRef: React.RefObject<HTMLButtonElement>;
    onClose: () => void;
    onSelectField: (field: EditableField) => void;
}

export const BulkEditPopover: React.FC<BulkEditPopoverProps> = ({ targetRef, onClose, onSelectField }) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (targetRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.left,
            });
        }
    }, [targetRef]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                targetRef.current && !targetRef.current.contains(event.target as Node) &&
                menuRef.current && !menuRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, targetRef]);

    const handleSelect = (field: EditableField) => {
        // Единственная задача - сообщить родителю о выборе.
        // Родительский компонент сам закроет popover и откроет модальное окно.
        onSelectField(field);
    };

    return createPortal(
        <div
            ref={menuRef}
            className="fixed w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 animate-fade-in-up"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
            <ul className="py-1">
                {FIELDS_TO_EDIT.map(field => (
                    <li key={field}>
                        <button
                            onClick={() => handleSelect(field)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            {field}
                        </button>
                    </li>
                ))}
            </ul>
        </div>,
        document.body
    );
};