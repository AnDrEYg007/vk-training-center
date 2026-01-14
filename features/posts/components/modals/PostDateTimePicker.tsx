import React from 'react';
import { CustomDatePicker } from '../../../../shared/components/pickers/CustomDatePicker';
import { CustomTimePicker } from '../../../../shared/components/pickers/CustomTimePicker';

interface PostDateTimePickerProps {
    isBulkMode: boolean;
    dateSlots: { id: string, date: string, time: string }[];
    onDateSlotChange: (id: string, field: 'date' | 'time', value: string) => void;
    onAddDateSlot: () => void;
    onRemoveDateSlot: (id: string) => void;
    isPublished: boolean;
    isNewOrCopy: boolean;
    mode: 'view' | 'edit' | 'copy';
    publicationMethod: 'system' | 'vk' | 'now';
    isFutureDate: boolean;
    originalPostDate: string;
}

// Экспорт компонента (CustomDatePicker и CustomTimePicker теперь импортируются)
export { CustomDatePicker, CustomTimePicker };

export const PostDateTimePicker: React.FC<PostDateTimePickerProps> = ({
    isBulkMode,
    dateSlots,
    onDateSlotChange,
    onAddDateSlot,
    onRemoveDateSlot,
    isPublished,
    isNewOrCopy,
    mode,
    publicationMethod,
    originalPostDate,
}) => {
    
    if (isBulkMode && mode === 'edit') {
        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Даты и время для постов ({dateSlots.length}/10)</label>
                {dateSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center gap-2 animate-fade-in-up">
                        <CustomDatePicker
                            value={slot.date}
                            onChange={(val) => onDateSlotChange(slot.id, 'date', val)}
                            className="flex-grow"
                        />
                        <CustomTimePicker 
                            value={slot.time}
                            onChange={(val) => onDateSlotChange(slot.id, 'time', val)}
                            className="w-32"
                        />
                        <button onClick={() => onRemoveDateSlot(slot.id)} disabled={dateSlots.length <= 1} className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
                <button onClick={onAddDateSlot} disabled={dateSlots.length >= 10} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed">+ Добавить дату</button>
            </div>
        );
    }

    if ((mode === 'edit' && publicationMethod !== 'now') || mode === 'view') {
        const isDisabled = isPublished && !isNewOrCopy;
        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
                {mode === 'edit' ? (
                    <div className="flex gap-2" title={isDisabled ? "Дату и время опубликованного поста изменять нельзя" : ""}>
                        <CustomDatePicker 
                            value={dateSlots[0].date}
                            onChange={(val) => onDateSlotChange(dateSlots[0].id, 'date', val)}
                            disabled={isDisabled}
                            className="flex-grow"
                        />
                        <CustomTimePicker 
                            value={dateSlots[0].time}
                            onChange={(val) => onDateSlotChange(dateSlots[0].id, 'time', val)}
                            disabled={isDisabled}
                            className="w-32"
                        />
                    </div>
                ) : (
                    <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded-md border border-gray-200">{new Date(originalPostDate).toLocaleString('ru-RU', { dateStyle: 'long', timeStyle: 'short' })}</p>
                )}
            </div>
        );
    }

    return null;
};