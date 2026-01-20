
import React from 'react';
import { ContestSettings } from '../../types';
import { CustomDatePicker } from '../../../../../shared/components/pickers/CustomDatePicker';

interface MainSettingsProps {
    settings: ContestSettings;
    onChange: (field: keyof ContestSettings, value: any) => void;
}

export const MainSettings: React.FC<MainSettingsProps> = ({ settings, onChange }) => {
    const inputClass = "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

    return (
        <div className="space-y-6 opacity-0 animate-fade-in-up">
            <div>
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Основные настройки</h3>
                
                <div className="flex items-center justify-between border border-gray-200 p-3 rounded-lg bg-gray-50 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-800">Активность механики</label>
                        <p className="text-xs text-gray-500 mt-1">Включите, чтобы запустить автоматический сбор и обработку постов.</p>
                    </div>
                    <button
                        onClick={() => onChange('isActive', !settings.isActive)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            settings.isActive ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                settings.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Ключевое вхождение</label>
                        <input
                            type="text"
                            value={settings.keywords}
                            onChange={(e) => onChange('keywords', e.target.value)}
                            placeholder="#отзыв"
                            className={`${inputClass} font-mono text-indigo-700`}
                        />
                        <p className="text-xs text-gray-500 mt-1">Слово для поиска постов.</p>
                    </div>
                    
                    <div>
                        <label className={labelClass}>Начало сбора</label>
                        <CustomDatePicker
                            value={settings.startDate}
                            onChange={(val) => onChange('startDate', val)}
                            className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">Учитывать посты с этой даты.</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between border border-gray-200 p-3 rounded-lg bg-gray-50">
                    <div>
                         <label className="block text-sm font-medium text-gray-800">Автоматический бан победителя</label>
                         <p className="text-xs text-gray-500 mt-1">Добавлять победителя в черный список после выигрыша.</p>
                    </div>
                     <button
                        onClick={() => onChange('autoBlacklist', !settings.autoBlacklist)}
                        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                            settings.autoBlacklist ? 'bg-indigo-600' : 'bg-gray-300'
                        }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                settings.autoBlacklist ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                    </button>
                </div>

                {settings.autoBlacklist && (
                    <div className="mt-3 ml-1 animate-fade-in-up p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Срок блокировки (дней)</label>
                        <div className="flex items-center gap-2">
                             <input
                                type="number"
                                min="1"
                                value={settings.autoBlacklistDuration || 7}
                                onChange={(e) => onChange('autoBlacklistDuration', Math.max(1, Number(e.target.value)))}
                                className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow no-spinners text-center font-bold"
                            />
                            <span className="text-sm text-gray-500">дней</span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Пользователь будет автоматически удален из ЧС спустя это время.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
