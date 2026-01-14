
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface RefreshOption {
    label: string;
    onClick: () => void;
}

interface ListCardProps {
    title: string;
    count: number;
    storedCount?: number; // Новый проп: реальное количество в БД
    lastUpdated?: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    colorClass: string;
    
    // Пропсы для обновления
    onRefresh?: () => void;
    refreshOptions?: RefreshOption[]; // Новое: опции меню
    isRefreshing?: boolean;
    loadingLabel?: string | null; 
}

export const ListCard: React.FC<ListCardProps> = ({ 
    title, 
    count, 
    storedCount,
    lastUpdated, 
    isActive, 
    onClick, 
    icon, 
    colorClass,
    onRefresh,
    refreshOptions,
    isRefreshing,
    loadingLabel
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });

    const handleRefreshClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (refreshOptions && refreshOptions.length > 0) {
            if (!isMenuOpen && buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                setMenuPos({ top: rect.bottom + 5, left: rect.right - 160 }); // 160 - width of menu
            }
            setIsMenuOpen(!isMenuOpen);
        } else if (onRefresh) {
            onRefresh();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMenuOpen && 
                buttonRef.current && !buttonRef.current.contains(event.target as Node) &&
                menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMenuOpen]);


    return (
        <div 
            onClick={onClick}
            className={`relative bg-white p-4 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 group flex flex-col h-full min-h-[160px]
                ${isActive ? `ring-2 ring-indigo-500 border-transparent shadow-md` : 'border-gray-200 hover:shadow-md hover:border-gray-300'}
            `}
        >
            {/* Верхняя часть: Иконка и Кнопка обновления */}
            <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-lg ${colorClass} text-white shadow-sm flex-shrink-0`}>
                    {icon}
                </div>
                
                {/* Кнопка обновления */}
                {(onRefresh || refreshOptions) && (
                    <div className="flex items-center gap-1 z-10 min-w-0 justify-end">
                        <button
                            ref={buttonRef}
                            onClick={handleRefreshClick}
                            disabled={isRefreshing}
                            className={`flex-shrink-0 p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors ${isRefreshing ? 'cursor-wait' : ''}`}
                            title="Обновить из VK"
                        >
                            {isRefreshing ? (
                                <div className="loader h-4 w-4 border-2 border-gray-300 border-t-indigo-500"></div>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                </svg>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Центральная часть: Цифра и Название */}
            <div className="mt-auto mb-1">
                 {storedCount !== undefined ? (
                    <div>
                        <span 
                            className="block text-3xl font-bold text-gray-800 tracking-tight"
                            title={`Загружено в базу: ${storedCount.toLocaleString('ru-RU')}`}
                        >
                            {storedCount.toLocaleString('ru-RU')}
                        </span>
                        <p 
                            className="text-xs text-gray-400 font-medium -mt-1" 
                            title={`Всего постов в VK: ${count.toLocaleString('ru-RU')}`}
                        >
                            из {count.toLocaleString('ru-RU')} в VK
                        </p>
                    </div>
                ) : (
                    <div>
                        <span 
                            className="block text-3xl font-bold text-gray-800 tracking-tight truncate" 
                            title={String(count)}
                        >
                            {count.toLocaleString('ru-RU')}
                        </span>
                        {/* Невидимый элемент для выравнивания высоты */}
                        <p className="text-xs font-medium -mt-1 invisible h-4">&nbsp;</p>
                    </div>
                )}
                <h3 
                    className="text-sm font-medium text-gray-500 leading-tight mt-1 line-clamp-2 h-10 flex items-start" 
                    title={title}
                >
                    {title}
                </h3>
            </div>
            
            {/* Блок с лоадером: Располагается между названием и футером */}
            <div className="h-5 mt-2">
                {isRefreshing && loadingLabel ? (
                    <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium animate-pulse">
                        <div className="loader h-3 w-3 border-2 border-indigo-200 border-t-indigo-600 flex-shrink-0"></div>
                        <span className="truncate w-full" title={loadingLabel}>{loadingLabel}</span>
                    </div>
                ) : (
                    // Пустой блок, чтобы сохранить отступ, если нужно, или просто null
                    null
                )}
            </div>

            {/* Нижняя часть: Дата (Всегда видна) */}
            <div className="flex items-center text-[10px] text-gray-400 mt-auto pt-3 border-t border-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate">
                    {lastUpdated ? new Date(lastUpdated).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Нет данных'}
                </span>
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && refreshOptions && createPortal(
                <div 
                    ref={menuRef}
                    className="fixed bg-white rounded-md shadow-xl border border-gray-200 py-1 z-[60] animate-fade-in-up w-40"
                    style={{ top: menuPos.top, left: menuPos.left }}
                    onClick={(e) => e.stopPropagation()} 
                >
                    {refreshOptions.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsMenuOpen(false);
                                opt.onClick();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
};
