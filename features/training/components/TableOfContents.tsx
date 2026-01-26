import React, { useState, useEffect } from 'react';
import { TocItem } from '../data/tocData';

export type Topic = TocItem;

// ═══════════════════════════════════════════════════════════════════════════════
// Иконка шеврона для аккордеонов
// ═══════════════════════════════════════════════════════════════════════════════
const ChevronIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className = '' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''} ${className}`}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Проверка: содержит ли раздел выбранный топик
// ═══════════════════════════════════════════════════════════════════════════════
const containsSelectedTopic = (item: TocItem, selectedPath: string | null): boolean => {
    if (!selectedPath) return false;
    if (item.path === selectedPath) return true;
    if (item.children) {
        return item.children.some(child => containsSelectedTopic(child, selectedPath));
    }
    return false;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Получить путь к выбранному топику (для автоматического раскрытия)
// ═══════════════════════════════════════════════════════════════════════════════
const getPathToTopic = (items: TocItem[], targetPath: string, currentPath: string[] = []): string[] | null => {
    for (const item of items) {
        if (item.path === targetPath) {
            return [...currentPath, item.path];
        }
        if (item.children) {
            const result = getPathToTopic(item.children, targetPath, [...currentPath, item.path]);
            if (result) return result;
        }
    }
    return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Компонент: Лист дерева (без детей) — просто кликабельный элемент
// ═══════════════════════════════════════════════════════════════════════════════
interface LeafItemProps {
    item: TocItem;
    level: number;
    isSelected: boolean;
    onSelectTopic: (topic: Topic) => void;
}

const LeafItem: React.FC<LeafItemProps> = ({ item, level, isSelected, onSelectTopic }) => {
    const paddingClasses = ['pl-3', 'pl-6', 'pl-9', 'pl-12', 'pl-14'];
    const padding = paddingClasses[Math.min(level, paddingClasses.length - 1)];
    
    return (
        <button 
            onClick={() => onSelectTopic(item)}
            className={`
                relative w-full text-left py-2 pr-2 rounded-md transition-all duration-200 text-sm
                ${padding}
                ${isSelected 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
            `}
        >
            {isSelected && (
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-indigo-500 rounded-r-full" />
            )}
            <span className="block leading-snug">{item.title}</span>
        </button>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Компонент: Аккордеон для разделов с детьми (управляется родителем)
// ═══════════════════════════════════════════════════════════════════════════════
interface AccordionNodeProps {
    item: TocItem;
    level: number;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
    isOpen: boolean;
    onToggle: () => void;
    openChildPath: string | null;
    onOpenChild: (path: string | null) => void;
}

const AccordionNode: React.FC<AccordionNodeProps> = ({ 
    item, 
    level, 
    selectedTopic, 
    onSelectTopic,
    isOpen,
    onToggle,
    openChildPath,
    onOpenChild
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedTopic?.path === item.path;
    const containsSelected = containsSelectedTopic(item, selectedTopic?.path || null);

    // Если это лист (нет детей) — просто рендерим LeafItem
    if (!hasChildren) {
        return (
            <li>
                <LeafItem 
                    item={item} 
                    level={level} 
                    isSelected={isSelected} 
                    onSelectTopic={onSelectTopic} 
                />
            </li>
        );
    }

    // Стили в зависимости от уровня
    const isTopLevel = level === 0;
    const isSecondLevel = level === 1;
    
    const paddingClasses = ['pl-2', 'pl-4', 'pl-7', 'pl-10', 'pl-12'];
    const padding = paddingClasses[Math.min(level, paddingClasses.length - 1)];

    // Обработчик клика на заголовок аккордеона
    const handleHeaderClick = () => {
        onToggle();
    };

    // Обработчик клика на название (для выбора топика)
    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectTopic(item);
    };

    return (
        <li className={isTopLevel ? 'mb-2' : ''}>
            {/* Заголовок аккордеона */}
            <div 
                onClick={handleHeaderClick}
                className={`
                    flex items-center gap-2 py-2 pr-2 rounded-lg cursor-pointer transition-all duration-200
                    ${padding}
                    ${isTopLevel 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : isSecondLevel 
                            ? 'hover:bg-gray-50' 
                            : 'hover:bg-gray-50'
                    }
                    ${isSelected ? 'bg-indigo-50' : ''}
                    ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                `}
            >
                <ChevronIcon 
                    isOpen={isOpen} 
                    className={`flex-shrink-0 ${
                        containsSelected || isSelected 
                            ? 'text-indigo-500' 
                            : 'text-gray-400'
                    }`}
                />
                <button
                    onClick={handleTitleClick}
                    className={`
                        flex-1 text-left text-sm leading-snug transition-colors
                        ${isTopLevel 
                            ? 'font-bold text-gray-800' 
                            : isSecondLevel 
                                ? 'font-semibold text-gray-700' 
                                : 'font-medium text-gray-600'
                        }
                        ${isSelected ? 'text-indigo-700' : ''}
                        ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                        hover:text-indigo-600
                    `}
                >
                    {item.title}
                </button>
            </div>

            {/* Контент аккордеона (дочерние элементы) */}
            <div 
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <ul className={`
                    mt-1 space-y-0.5
                    ${isTopLevel ? 'ml-2 border-l-2 border-gray-200' : ''}
                    ${isSecondLevel ? 'ml-2 border-l border-gray-100' : ''}
                `}>
                    {item.children!.map(child => {
                        const childHasChildren = child.children && child.children.length > 0;
                        const childIsOpen = openChildPath === child.path;
                        
                        return (
                            <AccordionNode 
                                key={child.path}
                                item={child}
                                level={level + 1}
                                selectedTopic={selectedTopic}
                                onSelectTopic={onSelectTopic}
                                isOpen={childIsOpen}
                                onToggle={() => onOpenChild(childIsOpen ? null : child.path)}
                                openChildPath={null}
                                onOpenChild={() => {}}
                            />
                        );
                    })}
                </ul>
            </div>
        </li>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Главный компонент: Оглавление (управляет состоянием аккордеонов)
// ═══════════════════════════════════════════════════════════════════════════════
interface TableOfContentsProps {
    toc: TocItem[];
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ toc, selectedTopic, onSelectTopic }) => {
    // Состояние открытых путей на каждом уровне
    const [openLevel0, setOpenLevel0] = useState<string | null>(null);
    const [openLevel1, setOpenLevel1] = useState<string | null>(null);
    const [openLevel2, setOpenLevel2] = useState<string | null>(null);

    // При выборе топика автоматически открываем путь к нему
    useEffect(() => {
        if (selectedTopic) {
            const pathToTopic = getPathToTopic(toc, selectedTopic.path);
            if (pathToTopic && pathToTopic.length > 0) {
                if (pathToTopic[0]) setOpenLevel0(pathToTopic[0]);
                if (pathToTopic[1]) setOpenLevel1(pathToTopic[1]);
                if (pathToTopic[2]) setOpenLevel2(pathToTopic[2]);
            }
        }
    }, [selectedTopic, toc]);

    return (
        <nav className="pr-2">
            <ul className="space-y-1">
                {toc.map(item => {
                    const isOpen = openLevel0 === item.path;
                    
                    return (
                        <AccordionNodeLevel0
                            key={item.path}
                            item={item}
                            selectedTopic={selectedTopic}
                            onSelectTopic={onSelectTopic}
                            isOpen={isOpen}
                            onToggle={() => setOpenLevel0(isOpen ? null : item.path)}
                            openLevel1={openLevel1}
                            setOpenLevel1={setOpenLevel1}
                            openLevel2={openLevel2}
                            setOpenLevel2={setOpenLevel2}
                        />
                    );
                })}
            </ul>
        </nav>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Компонент верхнего уровня (раздел) - управляет своими подразделами
// ═══════════════════════════════════════════════════════════════════════════════
interface AccordionNodeLevel0Props {
    item: TocItem;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
    isOpen: boolean;
    onToggle: () => void;
    openLevel1: string | null;
    setOpenLevel1: (path: string | null) => void;
    openLevel2: string | null;
    setOpenLevel2: (path: string | null) => void;
}

const AccordionNodeLevel0: React.FC<AccordionNodeLevel0Props> = ({
    item,
    selectedTopic,
    onSelectTopic,
    isOpen,
    onToggle,
    openLevel1,
    setOpenLevel1,
    openLevel2,
    setOpenLevel2
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedTopic?.path === item.path;
    const containsSelected = containsSelectedTopic(item, selectedTopic?.path || null);

    if (!hasChildren) {
        return (
            <li>
                <LeafItem item={item} level={0} isSelected={isSelected} onSelectTopic={onSelectTopic} />
            </li>
        );
    }

    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectTopic(item);
    };

    return (
        <li className="mb-2">
            <div 
                onClick={onToggle}
                className={`
                    flex items-center gap-2 py-2 pr-2 pl-2 rounded-lg cursor-pointer transition-all duration-200
                    bg-gray-100 hover:bg-gray-200
                    ${isSelected ? 'bg-indigo-50' : ''}
                    ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                `}
            >
                <ChevronIcon 
                    isOpen={isOpen} 
                    className={`flex-shrink-0 ${containsSelected || isSelected ? 'text-indigo-500' : 'text-gray-400'}`}
                />
                <button
                    onClick={handleTitleClick}
                    className={`
                        flex-1 text-left text-sm leading-snug transition-colors font-bold text-gray-800
                        ${isSelected ? 'text-indigo-700' : ''}
                        ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                        hover:text-indigo-600
                    `}
                >
                    {item.title}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="mt-1 space-y-0.5 ml-2 border-l-2 border-gray-200">
                    {item.children!.map(child => (
                        <AccordionNodeLevel1
                            key={child.path}
                            item={child}
                            selectedTopic={selectedTopic}
                            onSelectTopic={onSelectTopic}
                            isOpen={openLevel1 === child.path}
                            onToggle={() => setOpenLevel1(openLevel1 === child.path ? null : child.path)}
                            openLevel2={openLevel2}
                            setOpenLevel2={setOpenLevel2}
                        />
                    ))}
                </ul>
            </div>
        </li>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Компонент второго уровня (подраздел)
// ═══════════════════════════════════════════════════════════════════════════════
interface AccordionNodeLevel1Props {
    item: TocItem;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
    isOpen: boolean;
    onToggle: () => void;
    openLevel2: string | null;
    setOpenLevel2: (path: string | null) => void;
}

const AccordionNodeLevel1: React.FC<AccordionNodeLevel1Props> = ({
    item,
    selectedTopic,
    onSelectTopic,
    isOpen,
    onToggle,
    openLevel2,
    setOpenLevel2
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedTopic?.path === item.path;
    const containsSelected = containsSelectedTopic(item, selectedTopic?.path || null);

    if (!hasChildren) {
        return (
            <li>
                <LeafItem item={item} level={1} isSelected={isSelected} onSelectTopic={onSelectTopic} />
            </li>
        );
    }

    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectTopic(item);
    };

    return (
        <li>
            <div 
                onClick={onToggle}
                className={`
                    flex items-center gap-2 py-2 pr-2 pl-4 rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-gray-50
                    ${isSelected ? 'bg-indigo-50' : ''}
                    ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                `}
            >
                <ChevronIcon 
                    isOpen={isOpen} 
                    className={`flex-shrink-0 ${containsSelected || isSelected ? 'text-indigo-500' : 'text-gray-400'}`}
                />
                <button
                    onClick={handleTitleClick}
                    className={`
                        flex-1 text-left text-sm leading-snug transition-colors font-semibold text-gray-700
                        ${isSelected ? 'text-indigo-700' : ''}
                        ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                        hover:text-indigo-600
                    `}
                >
                    {item.title}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="mt-1 space-y-0.5 ml-2 border-l border-gray-100">
                    {item.children!.map(child => (
                        <AccordionNodeLevel2
                            key={child.path}
                            item={child}
                            selectedTopic={selectedTopic}
                            onSelectTopic={onSelectTopic}
                            isOpen={openLevel2 === child.path}
                            onToggle={() => setOpenLevel2(openLevel2 === child.path ? null : child.path)}
                        />
                    ))}
                </ul>
            </div>
        </li>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// Компонент третьего уровня
// ═══════════════════════════════════════════════════════════════════════════════
interface AccordionNodeLevel2Props {
    item: TocItem;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const AccordionNodeLevel2: React.FC<AccordionNodeLevel2Props> = ({
    item,
    selectedTopic,
    onSelectTopic,
    isOpen,
    onToggle
}) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedTopic?.path === item.path;
    const containsSelected = containsSelectedTopic(item, selectedTopic?.path || null);

    if (!hasChildren) {
        return (
            <li>
                <LeafItem item={item} level={2} isSelected={isSelected} onSelectTopic={onSelectTopic} />
            </li>
        );
    }

    const handleTitleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectTopic(item);
    };

    return (
        <li>
            <div 
                onClick={onToggle}
                className={`
                    flex items-center gap-2 py-2 pr-2 pl-7 rounded-lg cursor-pointer transition-all duration-200
                    hover:bg-gray-50
                    ${isSelected ? 'bg-indigo-50' : ''}
                    ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                `}
            >
                <ChevronIcon 
                    isOpen={isOpen} 
                    className={`flex-shrink-0 ${containsSelected || isSelected ? 'text-indigo-500' : 'text-gray-400'}`}
                />
                <button
                    onClick={handleTitleClick}
                    className={`
                        flex-1 text-left text-sm leading-snug transition-colors font-medium text-gray-600
                        ${isSelected ? 'text-indigo-700' : ''}
                        ${containsSelected && !isSelected ? 'text-indigo-600' : ''}
                        hover:text-indigo-600
                    `}
                >
                    {item.title}
                </button>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="mt-1 space-y-0.5 ml-2">
                    {item.children!.map(child => (
                        <li key={child.path}>
                            <LeafItem 
                                item={child} 
                                level={3} 
                                isSelected={selectedTopic?.path === child.path} 
                                onSelectTopic={onSelectTopic} 
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </li>
    );
};