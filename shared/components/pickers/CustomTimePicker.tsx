
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface CustomTimePickerProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
}

export const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ 
    value, 
    onChange, 
    disabled, 
    className 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
    const [inputValue, setInputValue] = useState(value);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [hours, minutes] = value.split(':').map(Number);

    // Синхронизация инпута с внешним значением
    useEffect(() => {
        setInputValue(value);
    }, [value]);

    // Авто-скролл к выбранному времени при открытии
    useEffect(() => {
        if (isOpen) {
            // Используем setTimeout, чтобы дать время React отрисовать портал
            const timer = setTimeout(() => {
                const hourEl = document.getElementById(`time-picker-h-${hours}`);
                const minuteEl = document.getElementById(`time-picker-m-${minutes}`);
                
                if (hourEl) hourEl.scrollIntoView({ block: 'center' });
                if (minuteEl) minuteEl.scrollIntoView({ block: 'center' });
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, hours, minutes]);

    const updatePosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const pickerHeight = 256; // h-64
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            if (spaceBelow < pickerHeight + 10 && spaceAbove > pickerHeight) {
                // Open up
                setPosition({ top: rect.top - 4, left: rect.left });
                setOpenDirection('up');
            } else {
                // Open down
                setPosition({ top: rect.bottom + 4, left: rect.left });
                setOpenDirection('down');
            }
        }
    }, []);

    const toggle = () => {
        if (disabled) return;
        if (!isOpen) {
            updatePosition();
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && 
                containerRef.current && !containerRef.current.contains(e.target as Node) &&
                menuRef.current && !menuRef.current.contains(e.target as Node)) {
                validateAndClose();
            }
        };
        const handleScroll = () => { if(isOpen) updatePosition(); };
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', handleScroll);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', handleScroll);
        };
    }, [isOpen, inputValue]);

    // Логика ручного ввода
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const validateAndClose = () => {
        setIsOpen(false);
        
        // Удаляем все нецифровые символы (двоеточия, пробелы)
        const cleanInput = inputValue.replace(/[^0-9]/g, '');
        
        let h: number | undefined;
        let m: number | undefined;

        // Логика парсинга
        if (cleanInput.length === 3) {
            // 930 -> 09:30
            h = parseInt(cleanInput.substring(0, 1), 10);
            m = parseInt(cleanInput.substring(1), 10);
        } else if (cleanInput.length === 4) {
            // 1830 -> 18:30
            h = parseInt(cleanInput.substring(0, 2), 10);
            m = parseInt(cleanInput.substring(2), 10);
        } else if (inputValue.includes(':')) {
            // Стандартный формат H:MM или HH:MM
            const parts = inputValue.split(':');
            h = parseInt(parts[0], 10);
            m = parseInt(parts[1], 10);
        } else if (cleanInput.length > 0 && cleanInput.length <= 2) {
            // Ввели только часы (например, "15")
            h = parseInt(cleanInput, 10);
            m = 0;
        }

        // Валидация диапазонов
        if (h !== undefined && m !== undefined && !isNaN(h) && !isNaN(m) && h >= 0 && h <= 23 && m >= 0 && m <= 59) {
            const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
            if (formatted !== value) {
                onChange(formatted);
            }
            setInputValue(formatted);
        } else {
            // Если невалидно, возвращаем старое значение
            setInputValue(value);
        }
        inputRef.current?.blur();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            validateAndClose();
        }
    };

    const handleHourClick = (h: number) => {
        const mStr = String(minutes).padStart(2, '0');
        const hStr = String(h).padStart(2, '0');
        onChange(`${hStr}:${mStr}`);
    };

    const handleMinuteClick = (m: number) => {
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(m).padStart(2, '0');
        onChange(`${hStr}:${mStr}`);
        setIsOpen(false); // Закрываем после выбора минут
    };

    const handleNowClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent closing
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();
        const formatted = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        onChange(formatted);
        setInputValue(formatted);
        // setIsOpen(false); // Don't close
    };
    
    const hoursList = Array.from({ length: 24 }, (_, i) => i);
    const minutesList = Array.from({ length: 60 }, (_, i) => i);

    return (
        <>
             <div
                ref={containerRef}
                className={`flex justify-between items-center border rounded-md px-2 py-1.5 text-sm border-gray-300 focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-shadow h-[34px] bg-white ${className} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={toggle}
                    onKeyDown={handleKeyDown}
                    onBlur={() => { 
                        // Задержка, чтобы клик по меню успел сработать до validateAndClose
                        // Если мы кликнули вне компонента, handleClickOutside закроет его
                    }}
                    disabled={disabled}
                    className="w-full outline-none bg-transparent"
                    maxLength={5}
                />
                <button 
                    type="button"
                    onClick={toggle}
                    disabled={disabled}
                    className="ml-2 focus:outline-none"
                    tabIndex={-1}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
            {isOpen && createPortal(
                 <div
                    ref={menuRef}
                    // Разделяем позиционирование и контент
                    className={`fixed z-[100] ${openDirection === 'up' ? '-translate-y-full' : ''}`}
                    style={{ top: position.top, left: position.left }}
                >
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-0 overflow-hidden animate-fade-in-up flex flex-col">
                        <div className="flex h-64">
                            <div className="flex flex-col border-r border-gray-100 w-16 overflow-y-auto custom-scrollbar scroll-smooth">
                                {hoursList.map(h => (
                                    <button 
                                        key={h} 
                                        id={`time-picker-h-${h}`}
                                        onClick={(e) => { e.stopPropagation(); handleHourClick(h); }}
                                        className={`px-2 py-1.5 text-sm text-center transition-colors ${
                                            h === hours 
                                                ? 'bg-blue-500 text-white font-bold hover:bg-blue-600' 
                                                : 'text-gray-700 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {String(h).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                            <div className="flex flex-col w-16 overflow-y-auto custom-scrollbar scroll-smooth">
                                {minutesList.map(m => (
                                    <button 
                                        key={m} 
                                        id={`time-picker-m-${m}`}
                                        onClick={() => handleMinuteClick(m)}
                                        className={`px-2 py-1.5 text-sm text-center transition-colors ${
                                            m === minutes 
                                                ? 'bg-blue-500 text-white font-bold hover:bg-blue-600' 
                                                : 'text-gray-700 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {String(m).padStart(2, '0')}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-gray-100 p-1">
                            <button
                                onClick={handleNowClick}
                                className="w-full px-2 py-1.5 text-sm text-center text-blue-600 hover:bg-blue-50 font-medium rounded transition-colors"
                            >
                                Сейчас
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
