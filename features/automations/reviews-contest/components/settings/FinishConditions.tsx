
import React from 'react';
import { ContestSettings, FinishConditionType } from '../../types';
import { CustomTimePicker } from '../../../../../shared/components/pickers/CustomTimePicker';
import { DaySelector } from './controls/FormControls';

interface FinishConditionsProps {
    settings: ContestSettings;
    onChange: (field: keyof ContestSettings, value: any) => void;
}

export const FinishConditions: React.FC<FinishConditionsProps> = ({ settings, onChange }) => {
    const finishOptions: { id: FinishConditionType; label: string }[] = [
        { id: 'count', label: 'По количеству' },
        { id: 'date', label: 'В определенный день' },
        { id: 'mixed', label: 'День + Количество' },
    ];

    return (
        <div className="space-y-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2">Условия подведения итогов</h3>
            
            <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
                {finishOptions.map(option => (
                    <button
                        key={option.id}
                        onClick={() => onChange('finishCondition', option.id)}
                        className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap focus:outline-none ${
                            settings.finishCondition === option.id
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Используем min-h вместо фиксированной h для адаптации к контенту */}
            <div className="min-h-[12rem] relative border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col justify-center transition-all duration-300">
                {settings.finishCondition === 'count' && (
                    <div className="animate-fade-in-up space-y-4">
                            <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Целевое количество участников:</span>
                            <input
                                type="number"
                                value={settings.targetCount}
                                onChange={(e) => onChange('targetCount', Number(e.target.value))}
                                className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 no-spinners transition-shadow"
                                placeholder="50"
                            />
                        </div>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                            <p>🎉 Пост с итогами опубликуется <strong>автоматически</strong>, как только наберется указанное количество постов в базе.</p>
                        </div>
                    </div>
                )}

                {settings.finishCondition === 'date' && (
                    <div className="animate-fade-in-up space-y-4">
                            <div className="space-y-3">
                            <div>
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">День недели</span>
                                <div className="mt-1">
                                        <DaySelector value={settings.finishDayOfWeek || 1} onChange={(val) => onChange('finishDayOfWeek', val)} />
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Время подведения:</span>
                                <CustomTimePicker 
                                    value={settings.finishTime || '12:00'}
                                    onChange={(val) => onChange('finishTime', val)}
                                    className="w-32"
                                />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600 bg-white p-3 rounded border border-gray-200">
                            <p>📅 Итоги подведутся в этот день и время, <strong>независимо от количества постов</strong> (если есть хотя бы один участник).</p>
                        </div>
                    </div>
                )}

                {settings.finishCondition === 'mixed' && (
                    <div className="animate-fade-in-up space-y-3">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">День недели</span>
                                <DaySelector value={settings.finishDayOfWeek || 1} onChange={(val) => onChange('finishDayOfWeek', val)} />
                            </div>
                            <div className="w-32">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Время</span>
                                <CustomTimePicker 
                                    value={settings.finishTime || '12:00'}
                                    onChange={(val) => onChange('finishTime', val)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">Минимум участников:</span>
                                <input
                                type="number"
                                value={settings.targetCount}
                                onChange={(e) => onChange('targetCount', Number(e.target.value))}
                                className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 no-spinners transition-shadow"
                                placeholder="50"
                            />
                        </div>
                        <div className="text-sm text-gray-600 bg-white p-2 rounded border border-gray-200">
                            <p>⚖️ Итоги в указанный день, <strong>только если</strong> наберется нужное кол-во. Если нет — перенос на следующую неделю.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
