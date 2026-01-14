import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MarketAlbum } from '../../../shared/types';

interface AlbumSelectorProps {
    value: MarketAlbum | null;
    options: MarketAlbum[];
    onChange: (album: MarketAlbum | null) => void;
    onOpen: () => void;
    isLoading: boolean;
    disabled?: boolean;
    className?: string; // Новый проп
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({ value, options, onChange, onOpen, isLoading, disabled, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const updatePosition = useCallback(() => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom,
                left: rect.left,
                width: rect.width,
            });
        }
    }, []);

    const toggleDropdown = useCallback(() => {
        if (!isOpen) {
            onOpen();
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
        return options.filter(album => album.title.toLowerCase().includes(lowerCaseQuery));
    }, [options, searchQuery]);
    
    const handleSelect = (album: MarketAlbum | null) => {
        onChange(album);
        setIsOpen(false);
        setSearchQuery('');
    };

    const displayValue = value ? value.title : <span className="text-gray-400">Без подборки</span>;

    return (
        <div className="relative h-full" ref={wrapperRef}>
            <button
                type="button"
                onClick={toggleDropdown}
                className={`w-full p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white flex justify-between items-center disabled:bg-gray-100/70 disabled:cursor-default ${className || ''}`}
                disabled={disabled}
            >
                <span className="truncate" title={value?.title}>{displayValue}</span>
                <svg className="fill-current h-4 w-4 flex-shrink-0 ml-1 text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </button>
            {isOpen && createPortal(
                <div 
                    ref={dropdownRef}
                    className="fixed z-[100] mt-1 bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up flex flex-col"
                    style={{ 
                        top: `${position.top}px`, 
                        left: `${position.left}px`, 
                        width: `${position.width}px`
                    }}
                >
                    <div className="p-2 border-b flex-shrink-0">
                        <input
                            type="search"
                            placeholder="Поиск подборки..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex-grow max-h-60 overflow-y-auto custom-scrollbar">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500">Загрузка...</div>
                        ) : (
                            <ul>
                                <li>
                                    <button 
                                        onClick={() => handleSelect(null)} 
                                        className="block w-full text-left px-3 py-2 text-sm transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-900"
                                    >
                                        Без подборки
                                    </button>
                                </li>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map(album => (
                                        <li key={album.id}>
                                            <button 
                                                onClick={() => handleSelect(album)} 
                                                className="block w-full text-left px-3 py-2 text-sm transition-colors text-gray-700 hover:bg-indigo-50 hover:text-indigo-900 truncate"
                                                title={album.title}
                                            >
                                                {album.title}
                                            </button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="p-4 text-center text-sm text-gray-500">Подборки не найдены.</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>, 
                document.body
            )}
        </div>
    );
};