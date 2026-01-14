
import React, { useEffect } from 'react';
import { CustomDatePicker } from '../../../../shared/components/pickers/CustomDatePicker';

interface PostCreationOptionsProps {
    isBulkMode: boolean;
    onToggleBulkMode: (value: boolean) => void;
    isMultiProjectMode: boolean;
    onToggleMultiProjectMode: (value: boolean) => void;
    isSaving: boolean;
    publicationMethod: 'system' | 'vk' | 'now';
    // Props for Cyclic Posts
    isCyclic: boolean;
    onToggleCyclic: (value: boolean) => void;
    recurrenceInterval: number;
    onRecurrenceIntervalChange: (value: number) => void;
    recurrenceType: 'minutes' | 'hours' | 'days' | 'weeks' | 'months';
    onRecurrenceTypeChange: (value: 'minutes' | 'hours' | 'days' | 'weeks' | 'months') => void;
    // New Enhanced Props
    recurrenceEndType: 'infinite' | 'count' | 'date';
    onRecurrenceEndTypeChange: (value: 'infinite' | 'count' | 'date') => void;
    recurrenceEndCount: number;
    onRecurrenceEndCountChange: (value: number) => void;
    recurrenceEndDate: string;
    onRecurrenceEndDateChange: (value: string) => void;
    recurrenceFixedDay: number | '';
    onRecurrenceFixedDayChange: (value: number | '') => void;
    recurrenceIsLastDay: boolean;
    onRecurrenceIsLastDayChange: (value: boolean) => void;
    
    // Конфигурация доступности
    allowBulkMode?: boolean;
    // Дата начала для привязки дня месяца
    startDate?: string;
    // Новый проп для режима "Всегда циклично" (убирает тумблер и лишние стили)
    alwaysCyclic?: boolean;
}

const RECURRENCE_TYPES = [
    { value: 'minutes', label: 'Минуты' },
    { value: 'hours', label: 'Часы' },
    { value: 'days', label: 'Дни' },
    { value: 'weeks', label: 'Недели' },
    { value: 'months', label: 'Месяцы' },
] as const;

export const PostCreationOptions: React.FC<PostCreationOptionsProps> = ({
    isBulkMode,
    onToggleBulkMode,
    isMultiProjectMode,
    onToggleMultiProjectMode,
    isSaving,
    publicationMethod,
    isCyclic,
    onToggleCyclic,
    recurrenceInterval,
    onRecurrenceIntervalChange,
    recurrenceType,
    onRecurrenceTypeChange,
    recurrenceEndType,
    onRecurrenceEndTypeChange,
    recurrenceEndCount,
    onRecurrenceEndCountChange,
    recurrenceEndDate,
    onRecurrenceEndDateChange,
    recurrenceFixedDay,
    onRecurrenceFixedDayChange,
    recurrenceIsLastDay,
    onRecurrenceIsLastDayChange,
    allowBulkMode = true,
    startDate,
    alwaysCyclic = false,
}) => {

    // Валидация даты: если выбран тип "После даты" и дата не выбрана - ошибка
    const isEndDateInvalid = recurrenceEndType === 'date' && !recurrenceEndDate;

    // Извлекаем день месяца из даты старта
    const startDay = startDate ? new Date(startDate).getDate() : new Date().getDate();
    
    const isDay31 = startDay === 31;
    const isLateMonth = startDay >= 29 && startDay < 31;

    // Эффект для синхронизации recurrenceFixedDay с выбранной датой старта
    useEffect(() => {
        if ((isCyclic || alwaysCyclic) && recurrenceType === 'months') {
            // Всегда обновляем фиксированный день на день из даты старта
            onRecurrenceFixedDayChange(startDay);

            // Если выбрано 31 число, принудительно ставим "Последний день месяца"
            if (startDay === 31) {
                onRecurrenceIsLastDayChange(true);
            } else {
                if (recurrenceFixedDay === '') {
                    onRecurrenceIsLastDayChange(false);
                }
            }
        }
    }, [startDate, isCyclic, alwaysCyclic, recurrenceType, startDay]);


    // В режиме alwaysCyclic мы убираем внешние контейнеры и отступы, чтобы интегрироваться бесшовно
    const containerClasses = alwaysCyclic 
        ? "space-y-4" 
        : "bg-gray-50 p-3 rounded-md space-y-4";

    const settingsContainerClasses = alwaysCyclic
        ? "space-y-4 pt-2" // Минимальные отступы
        : "mt-3 p-3 bg-white rounded-md border border-gray-200 shadow-sm space-y-4 animate-fade-in-up text-sm text-gray-700";

    return (
        <div className={containerClasses}>
            
            {/* Опция 1: Создать несколько постов (Bulk) - Скрываем если alwaysCyclic */}
            {!alwaysCyclic && publicationMethod !== 'now' && allowBulkMode && (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onToggleBulkMode(!isBulkMode)}
                            disabled={isSaving || isCyclic}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${isBulkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isBulkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                        <label onClick={() => !isSaving && !isCyclic && onToggleBulkMode(!isBulkMode)} className={`text-sm font-medium text-gray-700 cursor-pointer select-none ${isCyclic ? 'opacity-50' : ''}`}>
                            Создать несколько постов
                        </label>
                    </div>
                </div>
            )}

            {/* Опция 2: Циклическая публикация */}
            {(publicationMethod === 'system' || alwaysCyclic) && (
                <div>
                    {/* Тумблер переключения (Скрываем если alwaysCyclic) */}
                    {!alwaysCyclic && (
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => onToggleCyclic(!isCyclic)}
                                disabled={isSaving || isBulkMode}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${isCyclic ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isCyclic ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <label onClick={() => !isSaving && !isBulkMode && onToggleCyclic(!isCyclic)} className={`text-sm font-medium text-gray-700 cursor-pointer select-none ${isBulkMode ? 'opacity-50' : ''}`}>
                                Циклическая публикация <span className="text-gray-400 font-normal ml-1">(авто-повтор)</span>
                            </label>
                        </div>
                    )}
                    
                    {/* Настройки цикла */}
                    {(isCyclic || alwaysCyclic) && (
                        <div className={settingsContainerClasses}>
                            
                            {/* Выбор типа повторения (Tabs) */}
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2.5">Тип повторения</label>
                                <div className="flex rounded-md p-1 bg-gray-100 gap-1 overflow-x-auto custom-scrollbar">
                                    {RECURRENCE_TYPES.map(type => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => onRecurrenceTypeChange(type.value as any)}
                                            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                                recurrenceType === type.value
                                                    ? 'bg-white shadow text-indigo-700 ring-1 ring-black/5'
                                                    : 'text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Интервал */}
                            <div className="flex items-center gap-3">
                                <span className="text-gray-700 font-medium text-sm">Повторять каждые:</span>
                                <div className="flex items-center">
                                    <input 
                                        type="number" 
                                        min="1" 
                                        value={recurrenceInterval}
                                        onChange={(e) => onRecurrenceIntervalChange(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 border rounded-md px-2 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow text-center"
                                    />
                                    <span className="ml-2 text-gray-500 text-sm">
                                        {RECURRENCE_TYPES.find(t => t.value === recurrenceType)?.label.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Вкладка: Ежемесячно */}
                            {recurrenceType === 'months' && (
                                <div className="bg-indigo-50/50 p-3 rounded-md border border-indigo-100 space-y-3 animate-fade-in-up">
                                    <div className="font-medium text-xs text-indigo-600 uppercase tracking-wider">Когда повторять?</div>
                                    
                                    <label className={`flex items-center gap-2 p-1 rounded transition-colors ${isDay31 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-indigo-100/50'}`}>
                                        <input 
                                            type="radio" 
                                            checked={!recurrenceIsLastDay} 
                                            onChange={() => !isDay31 && onRecurrenceIsLastDayChange(false)}
                                            disabled={isDay31}
                                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="text-sm">Каждое <span className="font-bold">{startDay}</span> число</span>
                                    </label>
                                    
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-indigo-100/50 p-1 rounded transition-colors">
                                        <input 
                                            type="radio" 
                                            checked={recurrenceIsLastDay} 
                                            onChange={() => onRecurrenceIsLastDayChange(true)}
                                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="text-sm">В последний день месяца</span>
                                    </label>

                                    {/* Валидация для 31 числа */}
                                    {isDay31 && (
                                        <div className="flex items-start gap-2 mt-2 text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p>Опция "Каждое 31 число" недоступна. Измените дату публикации на любое другое число, чтобы активировать этот выбор.</p>
                                        </div>
                                    )}

                                    {/* Предупреждение для 29-30 чисел */}
                                    {!recurrenceIsLastDay && isLateMonth && (
                                        <div className="flex items-start gap-2 mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <p>В месяцах, где дней меньше (например, февраль), публикация автоматически сдвинется на последний день месяца.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Ограничение цикла */}
                            <div className="space-y-2 pt-3 border-t border-gray-100 text-sm">
                                <div className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-2">Остановить цикл:</div>
                                
                                <label className="flex items-center gap-2 cursor-pointer h-7 hover:bg-gray-50 rounded px-1">
                                    <input 
                                        type="radio" 
                                        name="endType" 
                                        checked={recurrenceEndType === 'infinite'} 
                                        onChange={() => onRecurrenceEndTypeChange('infinite')}
                                        className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                    />
                                    <span>Никогда (бесконечно)</span>
                                </label>
                                
                                <div className="flex items-center gap-2 h-9 hover:bg-gray-50 rounded px-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="endType" 
                                            checked={recurrenceEndType === 'count'} 
                                            onChange={() => onRecurrenceEndTypeChange('count')}
                                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="whitespace-nowrap">После</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={recurrenceEndCount}
                                        disabled={recurrenceEndType !== 'count'}
                                        onChange={(e) => onRecurrenceEndCountChange(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 border rounded px-2 py-1 text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-100 transition-colors h-[30px] text-center"
                                    />
                                    <span>повторений</span>
                                </div>
                                
                                <div className="flex items-center gap-2 h-9 hover:bg-gray-50 rounded px-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="endType" 
                                            checked={recurrenceEndType === 'date'} 
                                            onChange={() => onRecurrenceEndTypeChange('date')}
                                            className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                                        />
                                        <span className="whitespace-nowrap">После даты</span>
                                    </label>
                                    <CustomDatePicker 
                                        value={recurrenceEndDate}
                                        onChange={(val) => onRecurrenceEndDateChange(val)}
                                        disabled={recurrenceEndType !== 'date'}
                                        className={`w-40 ${isEndDateInvalid ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                                        placeholder="дд.мм.гггг"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Опция 3: Мультипроектная публикация (Скрываем если alwaysCyclic) */}
            {!alwaysCyclic && allowBulkMode && (
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onToggleMultiProjectMode(!isMultiProjectMode)}
                        disabled={isSaving}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors disabled:opacity-50 flex-shrink-0 ${isMultiProjectMode ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    >
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isMultiProjectMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <label onClick={() => !isSaving && onToggleMultiProjectMode(!isMultiProjectMode)} className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                        Мультипроектная публикация
                    </label>
                </div>
            )}
        </div>
    );
};
