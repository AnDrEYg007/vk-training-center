
import React from 'react';

// Компонент выбора дня недели
export const DaySelector: React.FC<{ value: number; onChange: (day: number) => void }> = ({ value, onChange }) => {
    const days = [
        { val: 1, label: 'Пн' }, { val: 2, label: 'Вт' }, { val: 3, label: 'Ср' },
        { val: 4, label: 'Чт' }, { val: 5, label: 'Пт' }, { val: 6, label: 'Сб' }, { val: 7, label: 'Вс' }
    ];

    return (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            {days.map(d => (
                <button
                    key={d.val}
                    onClick={() => onChange(d.val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                        value === d.val
                            ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5'
                            : 'text-gray-500 hover:bg-white/50'
                    }`}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
};

// Компонент поля шаблона
interface TemplateAreaProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    hint: string;
    rows?: number;
}

export const TemplateArea: React.FC<TemplateAreaProps> = ({ label, value, onChange, hint, rows = 3 }) => {
    return (
        <div>
            <div className="flex justify-between items-baseline mb-1.5">
                <label className="block text-sm font-medium text-gray-700">{label}</label>
                <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                     {hint}
                </div>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow custom-scrollbar resize-y"
            />
        </div>
    );
};
