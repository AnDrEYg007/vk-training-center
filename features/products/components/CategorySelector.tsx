
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MarketCategory } from '../../../shared/types';

// Тип для сгруппированных категорий
interface GroupedCategory {
    section_name: string;
    categories: MarketCategory[];
}

interface CategorySelectorProps {
    value: { id: number; name: string; section?: { id: number; name: string } } | null;
    options: GroupedCategory[];
    onChange: (category: MarketCategory) => void;
    onOpen: () => void;
    isLoading: boolean;
    disabled?: boolean;
    className?: string;
    title?: string; // Новый проп для передачи текста ошибки/подсказки
}

// Вспомогательная функция для разделения названия на конечную категорию и путь
const splitCategoryName = (fullName: string) => {
    const parts = fullName.split(' / ');
    const leaf = parts[parts.length - 1];
    const path = parts.slice(0, parts.length - 1).join(' / ');
    return { leaf, path };
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, options, onChange, onOpen, isLoading, disabled, className, title }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const updatePosition = useCallback(() => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
            });
        }
    }, []);

    const toggleDropdown = useCallback(() => {
        if (!isOpen) {
            onOpen(); // Загружаем категории при первом открытии
            updatePosition();
        }
        setIsOpen(prev => !prev);
    }, [isOpen, onOpen, updatePosition]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && wrapperRef.current && !wrapperRef.current.contains(event.target as Node) && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
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

    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;
        const lowerCaseQuery = searchQuery.toLowerCase();
        const result: GroupedCategory[] = [];
        
        for (const group of options) {
            if (group.section_name.toLowerCase().includes(lowerCaseQuery)) {
                result.push(group);
                continue;
            }
            const filteredCategories = group.categories.filter(cat => cat.name.toLowerCase().includes(lowerCaseQuery));
            if (filteredCategories.length > 0) {
                result.push({ ...group, categories: filteredCategories });
            }
        }
        return result;
    }, [options, searchQuery]);
    
    const handleSelect = (category: MarketCategory) => {
        onChange(category);
        setIsOpen(false);
        setSearchQuery('');
    };
    
    // Парсим текущее выбранное значение для красивого отображения
    const selectedDisplay = useMemo(() => {
        if (!value) return null;
        return splitCategoryName(value.name);
    }, [value]);

    return (
        <div className="relative h-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white flex justify-between items-center disabled:bg-gray-100/70 disabled:cursor-default h-full ${className || ''}`}
                disabled={disabled}
                title={title || (value ? value.name : undefined)}
            >
                {selectedDisplay ? (
                    <div className="flex flex-col items-start overflow-hidden min-w-0 leading-tight w-full">
                        {/* Показываем конечную категорию жирнее */}
                        <span className="truncate font-medium text-gray-800 w-full text-left">{selectedDisplay.leaf}</span>
                        {/* Показываем путь очень мелко, если он есть */}
                        {selectedDisplay.path && (
                             <span className="truncate text-[10px] text-gray-400 w-full text-left">{selectedDisplay.path}</span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400 truncate">Выберите категорию</span>
                )}
                <svg className="fill-current h-4 w-4 flex-shrink-0 ml-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </button>
            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    className="fixed z-[100] mt-1 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up flex flex-col"
                    style={{ 
                        top: `${position.top}px`, 
                        left: `${position.left}px`, 
                        width: `${Math.max(position.width, 300)}px` // Делаем дропдаун шире, если исходная кнопка узкая
                    }}
                >
                    <div className="p-2 border-b flex-shrink-0 bg-gray-50">
                        <input
                            type="search"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex-grow max-h-72 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Загрузка...</div>
                        ) : filteredOptions.length > 0 ? (
                            filteredOptions.map(group => (
                                <div key={group.section_name}>
                                    <h3 className="px-3 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 sticky top-0 truncate border-t border-b border-gray-200" title={group.section_name}>{group.section_name.toUpperCase()}</h3>
                                    <ul>
                                        {group.categories.map(cat => {
                                            const { leaf, path } = splitCategoryName(cat.name);
                                            return (
                                                <li key={cat.id}>
                                                    <button 
                                                        onClick={() => handleSelect(cat)} 
                                                        className="block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-indigo-50 group border-b border-gray-50 last:border-0"
                                                        title={cat.name}
                                                    >
                                                        <div className="font-medium text-gray-800 group-hover:text-indigo-700">{leaf}</div>
                                                        {path && (
                                                            <div className="text-[10px] text-gray-400 group-hover:text-indigo-400 truncate">{path}</div>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">Категории не найдены.</div>
                        )}
                    </div>
                </div>, 
                document.body
            )}
        </div>
    );
};
