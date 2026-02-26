import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компонент: FilterDropdown
// =====================================================================
interface FilterOption {
    value: string;
    label: string;
}

const MockFilterDropdown: React.FC<{
    label: string;
    options: FilterOption[];
    activeValue: string;
    onSelect: (value: string) => void;
}> = ({ label, options, activeValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    activeValue !== options[0].value
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
            >
                {label}
                <svg className="inline-block ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[200px] max-h-[300px] overflow-y-auto custom-scrollbar">
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onSelect(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                    activeValue === opt.value
                                        ? 'bg-indigo-100 text-indigo-800 font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// =====================================================================
// Mock-компонент: FilterPanel (панель фильтров)
// =====================================================================
const MockFilterPanel: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterQuality, setFilterQuality] = useState('all');
    const [filterSex, setFilterSex] = useState('all');
    const [filterAge, setFilterAge] = useState('any');
    const [filterOnline, setFilterOnline] = useState('any');
    const [filterPlatform, setFilterPlatform] = useState('any');

    const hasActiveFilters = 
        searchQuery !== '' ||
        filterQuality !== 'all' ||
        filterSex !== 'all' ||
        filterAge !== 'any' ||
        filterOnline !== 'any' ||
        filterPlatform !== 'any';

    const resultCount = hasActiveFilters ? 342 : 12458;

    const resetFilters = () => {
        setSearchQuery('');
        setFilterQuality('all');
        setFilterSex('all');
        setFilterAge('any');
        setFilterOnline('any');
        setFilterPlatform('any');
    };

    return (
        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 space-y-3">
            {/* Строка 1: Поиск */}
            <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Поиск по имени, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                    Найдено: <strong className="text-indigo-600">{resultCount}</strong>
                </span>
            </div>

            {/* Строка 2: Фильтры */}
            <div className="flex items-center gap-2 flex-wrap">
                <MockFilterDropdown
                    label="Статус"
                    options={[
                        { value: 'all', label: 'Все' },
                        { value: 'active', label: 'Активен' },
                        { value: 'banned', label: 'Забанен' },
                        { value: 'deleted', label: 'Удалён' }
                    ]}
                    activeValue={filterQuality}
                    onSelect={setFilterQuality}
                />
                <MockFilterDropdown
                    label="Пол"
                    options={[
                        { value: 'all', label: 'Все' },
                        { value: 'male', label: 'Мужской' },
                        { value: 'female', label: 'Женский' },
                        { value: 'unknown', label: 'Не указан' }
                    ]}
                    activeValue={filterSex}
                    onSelect={setFilterSex}
                />
                <MockFilterDropdown
                    label="Возраст"
                    options={[
                        { value: 'any', label: 'Любой' },
                        { value: 'u16', label: 'До 16' },
                        { value: '16-20', label: '16-20' },
                        { value: '20-25', label: '20-25' },
                        { value: '25-30', label: '25-30' },
                        { value: '30-35', label: '30-35' },
                        { value: '35-40', label: '35-40' },
                        { value: '40-45', label: '40-45' },
                        { value: '45p', label: '45+' },
                        { value: 'unknown', label: 'Не указан' }
                    ]}
                    activeValue={filterAge}
                    onSelect={setFilterAge}
                />
                <MockFilterDropdown
                    label="Онлайн"
                    options={[
                        { value: 'any', label: 'Неважно' },
                        { value: 'today', label: 'Сегодня' },
                        { value: '3_days', label: '3 дня' },
                        { value: 'week', label: 'Неделя' },
                        { value: 'month', label: 'Месяц' }
                    ]}
                    activeValue={filterOnline}
                    onSelect={setFilterOnline}
                />
                <MockFilterDropdown
                    label="Платформа"
                    options={[
                        { value: 'any', label: 'Любая' },
                        { value: '1', label: 'Mobile' },
                        { value: '2', label: 'iPhone' },
                        { value: '4', label: 'Android' },
                        { value: '7', label: 'Web' },
                        { value: 'unknown', label: 'Неизвестно' }
                    ]}
                    activeValue={filterPlatform}
                    onSelect={setFilterPlatform}
                />

                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="ml-auto px-3 py-2 text-sm bg-red-50 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        Сбросить
                    </button>
                )}
            </div>

            {/* Строка 3: Кнопки действий */}
            <div className="flex items-center gap-2">
                <button className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Обновить детали
                </button>
                <button className="px-3 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Анализ
                </button>
            </div>
        </div>
    );
};

// =====================================================================
// Mock-таблица пользователей (упрощённая версия)
// =====================================================================
const MockMembersTable: React.FC = () => {
    const mockUsers = [
        { id: 123456789, name: 'Александр Иванов', sex: 'М', age: 28, city: 'Москва', status: 'Активен' },
        { id: 987654321, name: 'Мария Петрова', sex: 'Ж', age: 24, city: 'Санкт-Петербург', status: 'Активен' },
        { id: 555444333, name: 'Дмитрий Сидоров', sex: 'М', age: 32, city: 'Казань', status: 'Активен' },
        { id: 111222333, name: 'Елена Смирнова', sex: 'Ж', age: 19, city: 'Нижний Новгород', status: 'Активен' },
        { id: 777888999, name: 'Игорь Козлов', sex: 'М', age: 45, city: 'Екатеринбург', status: 'Активен' }
    ];

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 border-b border-gray-200">
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Пользователь</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Пол</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Возраст</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Город</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-700">Статус</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {mockUsers.map((user, idx) => (
                        <tr key={user.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-gray-700">{user.sex}</td>
                            <td className="px-4 py-3 text-gray-700">{user.age}</td>
                            <td className="px-4 py-3 text-gray-700">{user.city}</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                    {user.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// =====================================================================
// Компонент страницы 3.1.3: Фильтры
// =====================================================================
export const ListsFiltersGuide: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Система фильтрации позволяет быстро находить нужных пользователей в больших списках. Вместо того чтобы прокручивать тысячи строк вручную, вы задаёте условия отбора — и система показывает только подходящие записи.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель фильтров — это закреплённая область над таблицей данных, которая включает:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div>
                        <div className="font-bold text-gray-900">Поле поиска</div>
                        <div className="text-sm text-gray-700">Поиск по имени пользователя или ID</div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <div>
                        <div className="font-bold text-gray-900">Выпадающие фильтры</div>
                        <div className="text-sm text-gray-700">8 категорий фильтров (статус, пол, возраст, онлайн, платформа и др.)</div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                        <div className="font-bold text-gray-900">Счётчик результатов</div>
                        <div className="text-sm text-gray-700">"Найдено: X" — количество записей, соответствующих условиям</div>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <div>
                        <div className="font-bold text-gray-900">Кнопка "Сбросить"</div>
                        <div className="text-sm text-gray-700">Появляется при активных фильтрах, возвращает всё к начальному состоянию</div>
                    </div>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Попробуйте использовать фильтры — все изменения применяются мгновенно."
                instructions={[
                    '<strong>Введите текст</strong> в поле поиска — счётчик "Найдено" изменится',
                    '<strong>Откройте выпадающий список</strong> — кликните на любой фильтр',
                    '<strong>Выберите опцию</strong> — фильтр выделится цветом (индиго фон)',
                    '<strong>Сбросьте фильтры</strong> — кнопка "Сбросить" появится справа при активных условиях'
                ]}
            >
                <div className="space-y-4">
                    <MockFilterPanel />
                    <MockMembersTable />
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Типы фильтров */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Восемь типов фильтров</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Система поддерживает 8 категорий фильтрации, каждая из которых работает независимо. Если выбрать несколько фильтров одновременно, система покажет записи, удовлетворяющие <strong>всем</strong> условиям сразу (логическое "И").
            </p>

            {/* Фильтр 1: Статус */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Статус (FilterQuality)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">Все</span>
                            <span className="text-sm text-gray-600">Без фильтрации</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">Активен</span>
                            <span className="text-sm text-gray-600">Пользователь активен и доступен</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded">Забанен</span>
                            <span className="text-sm text-gray-600">Заблокирован администраторами VK</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded">Удалён</span>
                            <span className="text-sm text-gray-600">Профиль удалён пользователем</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Зачем нужно:</strong> Отсеять удалённые или забаненные аккаунты перед массовой рассылкой — иначе система будет пытаться отправить сообщения несуществующим пользователям.
                    </p>
                </div>
            </div>

            {/* Фильтр 2: Пол */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Пол (FilterSex)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">Все</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">Мужской</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-pink-100 text-pink-700 text-sm rounded">Женский</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded">Не указан</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтр 3: Возраст */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Возраст (FilterAge)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded text-center">Любой</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">До 16</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">16-20</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">20-25</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">25-30</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">30-35</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">35-40</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">40-45</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded text-center">45+</span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded text-center">Не указан</span>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Зачем нужно:</strong> Таргетировать контент под целевую аудиторию. Например, рекламу студенческих скидок показывать только группе 16-25 лет.
                    </p>
                </div>
            </div>

            {/* Фильтр 4: Онлайн */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Последняя активность (FilterOnline)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">Неважно</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">Сегодня</span>
                            <span className="text-sm text-gray-600">Заходил в течение последних 24 часов</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-lime-100 text-lime-700 text-sm rounded">3 дня</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded">Неделя</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded">Месяц</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Зачем нужно:</strong> Найти активных пользователей перед рассылкой — они с большей вероятностью прочитают сообщение и ответят.
                    </p>
                </div>
            </div>

            {/* Фильтр 5: Платформа */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Платформа (FilterPlatform)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">Любая</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">Mobile (1)</span>
                            <span className="text-sm text-gray-600">Мобильная версия сайта</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded">iPhone (2)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded">Android (4)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded">Web (7)</span>
                            <span className="text-sm text-gray-600">Браузерная версия</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded">Неизвестно</span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-amber-50 border border-amber-300 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Особенность:</strong> Значения 1, 2, 4, 7 — это коды платформ из API ВКонтакте. Система автоматически определяет устройство при последней активности пользователя.
                    </p>
                </div>
            </div>

            {/* Фильтр 6: Месяц рождения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">6. Месяц рождения (FilterBdateMonth)</h3>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded text-center">Любой</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded text-center">Январь</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded text-center">Февраль</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded text-center">Март</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded text-center">...</span>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded text-center">Декабрь</span>
                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded text-center">Не указан</span>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Зачем нужно:</strong> Поздравлять подписчиков с днём рождения. Фильтруете по текущему месяцу и отправляете персонализированное сообщение.
                    </p>
                </div>
            </div>

            {/* Фильтр 7: Доступность сообщений */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">7. Доступность сообщений (FilterCanWrite)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Доступен только для списка <strong>"В рассылке"</strong>:
            </p>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">Все</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded flex items-center gap-1">
                                ✅ Разрешено
                            </span>
                            <span className="text-sm text-gray-600">Можно отправить сообщение</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded flex items-center gap-1">
                                🚫 Запрещено
                            </span>
                            <span className="text-sm text-gray-600">Настройки приватности VK блокируют отправку</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Фильтр 8: Месяц вступления/выхода */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">8. Месяц активности (FilterActionMonth)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Доступен для списков <strong>"Вступившие"</strong> и <strong>"Вышедшие"</strong>:
            </p>
            <div className="not-prose my-6">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                        <span className="text-sm font-semibold text-gray-700">Доступные опции:</span>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-2">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded text-center">Любой</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded text-center">Январь 2026</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded text-center">Февраль 2026</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded text-center">...</span>
                    </div>
                </div>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Зачем нужно:</strong> Анализировать тренды аудитории по месяцам — например, увидеть массовый отток в определённый период и выяснить причину.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Кнопки действий */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Кнопки действий</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Под панелью фильтров расположены кнопки для массовых операций над отфильтрованными данными:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-bold text-gray-900">Обновить детали</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        Для списков пользователей — загружает свежие данные профилей из VK (аватары, имена, город, возраст). Используется, когда основной список уже синхронизирован, но нужны актуальные детали.
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <span className="font-bold text-gray-900">Анализ</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        Только для списка <strong>"В рассылке"</strong>. Открывает выпадающее меню с опциями анализа аудитории (например, статистика по полу, возрасту, городам).
                    </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span className="font-bold text-gray-900">Синхронизация взаимодействий</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        Для списков активностей (Лайкали, Комментировали, Репостили). Загружает ID постов, с которыми взаимодействовал каждый пользователь.
                    </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-bold text-gray-900">Очистить базу</span>
                        <span className="ml-auto px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">ADMIN</span>
                    </div>
                    <p className="text-sm text-gray-700">
                        Доступна только администраторам. Удаляет все данные выбранного списка из базы данных. <strong>Необратимая операция!</strong>
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Sticky поведение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Закреплённая панель (Sticky)</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель фильтров имеет CSS-класс <code className="px-2 py-1 bg-gray-100 text-sm rounded">sticky top-0 z-20</code>, что означает:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-purple-600 text-white text-xs font-mono rounded">sticky</div>
                    <span className="text-sm text-gray-700">
                        При прокрутке таблицы вниз панель остаётся на экране
                    </span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-indigo-600 text-white text-xs font-mono rounded">top-0</div>
                    <span className="text-sm text-gray-700">
                        Прилипает к верхнему краю окна браузера
                    </span>
                </div>
                <div className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <div className="flex-shrink-0 px-2 py-1 bg-emerald-600 text-white text-xs font-mono rounded">z-20</div>
                    <span className="text-sm text-gray-700">
                        Отображается поверх заголовков таблицы (которые имеют <code>z-10</code>)
                    </span>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Благодаря этому вы можете прокрутить таблицу на 1000 строк вниз, но фильтры всё равно останутся доступными — не нужно возвращаться к началу страницы, чтобы изменить условия отбора.
            </p>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: прокрутка тысяч строк вручную</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>В сообществе 15 000 подписчиков — найти нужного вручную невозможно</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Нужны только женщины 20-30 лет из Москвы — выписывать ID вручную часами</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Невозможно быстро отсеять удалённые аккаунты</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: мгновенная фильтрация</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Мгновенный поиск</strong> — введите имя или ID, получите результат за секунду</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Комбинация фильтров</strong> — женщины + 20-30 + Москва + активны сегодня = 342 человека за 1 клик</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Счётчик результатов</strong> — сразу видно, сколько пользователей подходит под условия</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Кнопка "Сбросить"</strong> — вернуться к исходному состоянию одним кликом</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="not-prose my-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                <h4 className="text-lg font-bold text-indigo-900 mb-3">💡 Реальный кейс</h4>
                <p className="text-sm text-gray-700 mb-3">
                    Нужно отправить рассылку про студенческую скидку только активным подписчикам 18-25 лет.
                </p>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex gap-2">
                        <span className="font-bold text-indigo-700">1.</span>
                        <span>Открываете список "В рассылке"</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-indigo-700">2.</span>
                        <span>Фильтр "Возраст" → выбираете "20-25"</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-indigo-700">3.</span>
                        <span>Фильтр "Статус" → "Активен"</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-indigo-700">4.</span>
                        <span>Фильтр "Онлайн" → "3 дня"</span>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-bold text-indigo-700">5.</span>
                        <span><strong>Результат:</strong> "Найдено: 842" — за 10 секунд вместо нескольких часов ручной работы</span>
                    </div>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="3-1-3-filters" />
        </article>
    );
};
