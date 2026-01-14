
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const parseDate = (dateStr: string): Date => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Сдвиг для Пн=0, Вс=6
};

interface CustomDatePickerProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ 
    value, 
    onChange, 
    disabled, 
    className, 
    placeholder = "Выберите дату" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [openDirection, setOpenDirection] = useState<'down' | 'up'>('down');
    const [viewDate, setViewDate] = useState(value ? parseDate(value) : new Date());
    
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (value) {
            setViewDate(parseDate(value));
        }
    }, [value, isOpen]);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            // Увеличили предполагаемую высоту календаря для более надежного переключения вверх
            const calendarHeight = 360; 

            // Проверка места снизу
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            
            if (spaceBelow < calendarHeight && spaceAbove > calendarHeight) {
                // Открываем вверх
                setPosition({ top: rect.top - 4, left: rect.left });
                setOpenDirection('up');
            } else {
                // Стандартно вниз
                setPosition({ top: rect.bottom + 4, left: rect.left });
                setOpenDirection('down');
            }
        }
    };

    const toggle = () => {
        if (disabled) return;
        if (!isOpen) {
             updatePosition();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && 
                buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
                menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
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
    }, [isOpen]);

    const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    
    const handleDayClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        onChange(formatDate(newDate));
        setIsOpen(false);
    };

    const handleTodayClick = () => {
        const today = new Date();
        onChange(formatDate(today));
        setIsOpen(false);
    }

    const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
    const firstDayIdx = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: firstDayIdx }, (_, i) => i);
    
    const selectedDate = value ? parseDate(value) : null;
    const isSelected = (day: number) => 
        selectedDate &&
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === viewDate.getMonth() && 
        selectedDate.getFullYear() === viewDate.getFullYear();
    
    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();
    }

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onClick={toggle}
                disabled={disabled}
                className={`flex justify-between items-center border rounded-md px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow h-[34px] bg-white ${className} ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}
            >
                <span className={!value ? 'text-gray-400' : 'text-gray-800'}>
                    {value ? new Date(value).toLocaleDateString('ru-RU') : placeholder}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            {isOpen && createPortal(
                <div
                    ref={menuRef}
                    // Внешний контейнер отвечает только за позиционирование (включая сдвиг вверх)
                    className={`fixed z-[100] ${openDirection === 'up' ? '-translate-y-full' : ''}`}
                    style={{ top: position.top, left: position.left }}
                >
                    {/* Внутренний контейнер отвечает за внешний вид и анимацию появления */}
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 w-64 animate-fade-in-up select-none">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-700">{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                            <div className="flex gap-1">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-1 text-center">
                            {WEEKDAYS.map(d => <div key={d} className="text-xs text-gray-400 font-medium">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {emptySlots.map(i => <div key={`empty-${i}`} />)}
                            {daysArray.map(day => (
                                <button
                                    key={day}
                                    onClick={() => handleDayClick(day)}
                                    className={`w-7 h-7 text-sm rounded-full flex items-center justify-center transition-colors ${
                                        isSelected(day) ? 'bg-blue-500 text-white' : 
                                        isToday(day) ? 'text-blue-600 font-bold hover:bg-blue-50' : 
                                        'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between mt-3 pt-2 border-t border-gray-100 text-xs">
                            <button onClick={() => {/*Logic for clear if needed*/}} className="text-red-500 hover:text-red-700 hidden">Удалить</button>
                            <button onClick={handleTodayClick} className="text-blue-600 hover:text-blue-800 font-medium w-full text-right">Сегодня</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
