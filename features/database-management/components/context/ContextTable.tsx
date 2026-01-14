
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { Project, ProjectContextField } from '../../../../shared/types';

interface ContextTableProps {
    projects: Project[];
    totalProjectsCount: number;
    fields: ProjectContextField[];
    columnWidths: Record<string, number>;
    setColumnWidths: React.Dispatch<React.SetStateAction<Record<string, number>>>;
    getValue: (projectId: string, fieldId: string) => string;
    handleValueChange: (projectId: string, fieldId: string, newValue: string) => void;
    onEditField: (field: ProjectContextField) => void;
    onDeleteField: (fieldId: string) => void;
    // New
    onAiAutofill: (projectId: string) => void;
    // Specific AI handlers
    onAiCompanyDesc: (projectId: string, fieldId: string) => void;
    onAiProductsDesc: (projectId: string, fieldId: string) => void;
    onAiTone: (projectId: string, fieldId: string) => void;
    
    // Clear Handlers
    onClearColumn: (fieldId: string) => void;
    onClearRow: (projectId: string) => void;
    
    autofillLoadingId: string | null;
    editedValues: Record<string, string>; // Для подсветки
    massAiActiveProjectId: string | null; // NEW: ID проекта, который сейчас обрабатывается массовым AI
}

// Внутренний компонент ячейки с логикой расширения (как в DescriptionCell)
const ContextDataCell: React.FC<{
    value: string;
    onChange: (val: string) => void;
    fieldName: string;
    onAiClick?: () => void;
    isLoading?: boolean;
    disabled?: boolean; // Новый проп для блокировки
    isEdited?: boolean; // Новый проп для подсветки
}> = ({ value, onChange, fieldName, onAiClick, isLoading, disabled, isEdited }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFocus = () => {
        if (!isExpanded) {
            setIsExpanded(true);
            // Автоматическая подстройка высоты при разворачивании
            requestAnimationFrame(() => {
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
                }
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
        // Авто-рост при вводе, если развернуто
        if (isExpanded) {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight + 2}px`;
        }
    };

    const handleCollapse = (e: React.MouseEvent) => {
        e.stopPropagation(); // Чтобы не триггерить onFocus снова
        setIsExpanded(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = ''; // Сброс к дефолтной высоте (через rows/css)
        }
    };

    return (
        <div className="relative group w-full flex items-start gap-1">
            <div className="relative flex-grow">
                <textarea
                    ref={textareaRef}
                    className={`w-full border border-gray-300 rounded-md text-sm p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all custom-scrollbar ${isExpanded ? 'overflow-hidden' : ''} ${isEdited ? 'bg-amber-50' : 'bg-white'}`}
                    // По умолчанию 3 строки, как просили
                    rows={isExpanded ? undefined : 3}
                    style={{ 
                        minHeight: isExpanded ? undefined : '4.5rem', // Примерная высота для 3 строк
                        resize: isExpanded ? 'none' : 'vertical' 
                    }} 
                    placeholder="..."
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                />
                {isExpanded && (
                    <button
                        type="button"
                        onClick={handleCollapse}
                        className="absolute bottom-2 right-2 p-1 text-gray-400 hover:text-gray-700 rounded-full bg-white/90 hover:bg-gray-200 transition-colors shadow-sm opacity-0 group-hover:opacity-100 border border-gray-200"
                        title="Свернуть"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                )}
            </div>
            {onAiClick && (
                 <button
                    type="button"
                    onClick={onAiClick}
                    disabled={isLoading || disabled}
                    className="p-1 border border-gray-300 rounded-md transition-colors text-indigo-500 hover:bg-indigo-50 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 h-8 w-8 flex items-center justify-center mt-1 bg-white"
                    title={disabled ? "Дождитесь завершения текущей генерации" : `Сгенерировать "${fieldName}" с помощью AI`}
                >
                    {isLoading ? (
                        <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};

export const ContextTable: React.FC<ContextTableProps> = ({
    projects,
    totalProjectsCount,
    fields,
    columnWidths,
    setColumnWidths,
    getValue,
    handleValueChange,
    onEditField,
    onDeleteField,
    onAiAutofill,
    onAiCompanyDesc,
    onAiProductsDesc,
    onAiTone,
    // Clear props
    onClearColumn,
    onClearRow,
    
    autofillLoadingId,
    editedValues,
    massAiActiveProjectId
}) => {
    const tableRef = useRef<HTMLTableElement>(null);
    const activeColumnIdRef = useRef<string | null>(null);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Глобальный флаг блокировки: если что-то генерируется, блокируем все AI кнопки
    const isAnyAiLoading = !!autofillLoadingId || !!massAiActiveProjectId;

    // Проверяет, доступно ли поле для данного проекта
    const isFieldAccessible = (project: Project, field: ProjectContextField) => {
        if (field.is_global) return true;
        return field.project_ids && field.project_ids.includes(project.id);
    };

    // --- Sorting Logic ---
    const sortedFields = useMemo(() => {
        const priorityOrder = [
            "Название бренда",
            "Описание компании",
            "Описание товаров и услуг",
            "Тональность бренда",
            "Вид деятельности",
            "Адрес",
            "График работы",
            "Телефоны"
        ];

        return [...fields].sort((a, b) => {
            const idxA = priorityOrder.indexOf(a.name);
            const idxB = priorityOrder.indexOf(b.name);

            // Если оба поля есть в списке приоритетов, сортируем по индексу в этом списке
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            
            // Если только поле A есть в списке, оно идет раньше
            if (idxA !== -1) return -1;
            
            // Если только поле B есть в списке, оно идет раньше
            if (idxB !== -1) return 1;

            // Если ни одного нет в списке, сортируем по алфавиту
            return a.name.localeCompare(b.name);
        });
    }, [fields]);


    // --- Resizing Logic ---
    const handleMouseDown = (fieldId: string, e: React.MouseEvent) => {
        e.preventDefault();
        activeColumnIdRef.current = fieldId;
        startXRef.current = e.clientX;
        startWidthRef.current = columnWidths[fieldId] || 200;
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (activeColumnIdRef.current) {
            const deltaX = e.clientX - startXRef.current;
            const newWidth = Math.max(100, startWidthRef.current + deltaX);
            setColumnWidths(prev => ({ ...prev, [activeColumnIdRef.current!]: newWidth }));
        }
    }, [setColumnWidths]);

    const handleMouseUp = useCallback(() => {
        if (activeColumnIdRef.current) {
            activeColumnIdRef.current = null;
            document.body.style.cursor = '';
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    const Resizer = ({ fieldId }: { fieldId: string }) => (
        <div
            className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize select-none group-hover:bg-indigo-300/50 transition-colors z-20"
            onMouseDown={(e) => handleMouseDown(fieldId, e)}
        />
    );
    
    // Определяем, какую функцию AI вызывать для поля
    const getAiHandler = (fieldName: string, projectId: string, fieldId: string) => {
        const lowerName = fieldName.toLowerCase().trim();
        if (lowerName === 'описание компании') return () => onAiCompanyDesc(projectId, fieldId);
        if (lowerName === 'описание товаров и услуг') return () => onAiProductsDesc(projectId, fieldId);
        if (lowerName === 'тональность бренда') return () => onAiTone(projectId, fieldId);
        return undefined;
    };
    
    // Проверка, идет ли загрузка для конкретного поля конкретного проекта (одиночный режим)
    const isFieldLoading = (projectId: string, fieldId: string) => {
         return autofillLoadingId === `${projectId}_${fieldId}` || autofillLoadingId === projectId;
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-auto custom-scrollbar flex-grow">
            <table className="w-full text-sm border-collapse" ref={tableRef} style={{ tableLayout: 'fixed' }}>
                <thead className="bg-gray-50 border-b sticky top-0 z-20 shadow-sm">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500 w-64 sticky left-0 bg-gray-50 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200">
                            Проект
                        </th>
                        {sortedFields.map(field => (
                            <th 
                                key={field.id} 
                                className="group relative px-4 py-3 text-left font-medium text-gray-500 border-r border-gray-100 last:border-0"
                                style={{ width: columnWidths[field.id] || 200 }}
                            >
                                <div className="flex justify-between items-center gap-2">
                                    <div className="flex items-center gap-1 truncate">
                                        <span className="truncate" title={field.description || field.name}>{field.name}</span>
                                        {!field.is_global && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                                                <title>Частное поле (доступно не всем)</title>
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex items-center relative z-30">
                                        <button 
                                            type="button"
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                onClearColumn(field.id); 
                                            }}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-red-50"
                                            title="Очистить столбец"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onEditField(field); }}
                                            className="text-gray-400 hover:text-blue-600 p-1 rounded"
                                            title="Редактировать столбец"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); onDeleteField(field.id); }}
                                            className="text-gray-400 hover:text-red-600 p-1 rounded"
                                            title="Удалить столбец"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <Resizer fieldId={field.id} />
                            </th>
                        ))}
                        {/* Spacer col to prevent collapsing */}
                        <th className="w-full bg-gray-50"></th> 
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {projects.map((project, index) => {
                        const isMassProcessing = massAiActiveProjectId === project.id;
                        
                        return (
                        <tr key={project.id} className={`hover:bg-gray-50 opacity-0 animate-fade-in-up ${isMassProcessing ? 'bg-indigo-50/50' : ''}`} style={{ animationDelay: `${index * 10}ms` }}>
                            <td className="px-4 py-2 font-medium text-gray-900 sticky left-0 bg-white hover:bg-gray-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r border-gray-200 max-w-[250px] align-top">
                                <div className="flex items-center justify-between h-full min-h-[40px]">
                                    <span className="truncate mr-2 flex-grow" title={project.name}>{project.name}</span>
                                    
                                    <div className="flex items-center gap-1">
                                        <button 
                                            type="button"
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                onClearRow(project.id); 
                                            }}
                                            disabled={isAnyAiLoading}
                                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0 disabled:opacity-0"
                                            title="Очистить строку"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        
                                        {isMassProcessing ? (
                                            <div className="p-1.5 bg-indigo-50 rounded-full flex-shrink-0 border border-indigo-100" title="Идет массовая обработка...">
                                                <div className="loader h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent"></div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => onAiAutofill(project.id)}
                                                disabled={isAnyAiLoading}
                                                className="p-1 text-indigo-500 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={isAnyAiLoading ? "Дождитесь завершения текущей операции" : "AI-Автозаполнение: Заполнить пустые поля данными из VK"}
                                            >
                                                {autofillLoadingId === project.id ? (
                                                    <div className="loader h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </td>
                            {sortedFields.map(field => {
                                const accessible = isFieldAccessible(project, field);
                                const aiHandler = accessible ? getAiHandler(field.name, project.id, field.id) : undefined;
                                const isLoading = isFieldLoading(project.id, field.id);
                                const isEdited = !!editedValues[`${project.id}_${field.id}`];

                                return (
                                    <td key={field.id} className={`px-2 py-2 border-r border-gray-100 last:border-0 align-top ${accessible ? '' : 'bg-gray-100/50'}`}>
                                        {accessible ? (
                                            <ContextDataCell 
                                                value={getValue(project.id, field.id)}
                                                onChange={(val) => handleValueChange(project.id, field.id, val)}
                                                fieldName={field.name}
                                                onAiClick={aiHandler}
                                                isLoading={isLoading}
                                                disabled={isAnyAiLoading && !isLoading} // Блокируем, если идет загрузка, но не этого поля
                                                isEdited={isEdited}
                                            />
                                        ) : (
                                            <div className="w-full h-[2.5rem] flex items-center justify-center text-xs text-gray-400 italic bg-gray-100 rounded-md select-none" title="Это поле недоступно для данного проекта">
                                                Не применимо
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                            <td></td>
                        </tr>
                    )})}
                </tbody>
            </table>
            {totalProjectsCount === 0 && (
                <div className="p-8 text-center text-gray-500">Нет проектов. Добавьте их на главной странице управления.</div>
            )}
            {totalProjectsCount > 0 && projects.length === 0 && (
                <div className="p-8 text-center text-gray-500">Проекты не найдены по заданным фильтрам.</div>
            )}
        </div>
    );
};
