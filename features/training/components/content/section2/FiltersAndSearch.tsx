import React, { useState } from 'react';
import { ContentProps, NavigationButtons, Sandbox } from '../shared';

// =====================================================================
// Основной компонент: Фильтры и поиск
// =====================================================================
export const FiltersAndSearch: React.FC<ContentProps> = ({ title }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [contentFilter, setContentFilter] = useState('all');

    const mockProjects = [
        { name: 'Фиолето Суши | Доставка роллов', team: 'Команда А', count: 0 },
        { name: 'Тестовое сообщество', team: 'Команда Б', count: 3 },
        { name: 'Изготовление автоключей | Ключи', team: 'Команда А', count: 7 },
        { name: 'ООО Строй Кровля | Кровельные работы', team: 'Команда Б', count: 15 },
        { name: 'Природа и экология', team: 'Команда А', count: 0 },
    ];
    const getCounterColorClasses = (count: number): string => {
        if (count === 0) return 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium';
        if (count > 0 && count < 5) return 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium';
        if (count > 10) return 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium';
        return 'bg-gray-300 text-gray-700';
    };
    const filteredProjects = mockProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
        
        let matchesContent = true;
        switch(contentFilter) {
            case 'empty': matchesContent = p.count === 0; break;
            case 'not_empty': matchesContent = p.count > 0; break;
            case 'lt5': matchesContent = p.count > 0 && p.count < 5; break;
            case '5-10': matchesContent = p.count >= 5 && p.count <= 10; break;
            case 'gt10': matchesContent = p.count > 10; break;
        }
        
        return matchesSearch && matchesTeam && matchesContent;
    });

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда у тебя <strong>много проектов</strong> (10, 20, 30 сообществ), 
                прокручивать длинный список — это неудобно. 
                Поэтому есть <strong>фильтры и поиск</strong> — быстрые инструменты для поиска.
            </p>

            <div className="not-prose bg-amber-50 border border-amber-300 rounded-lg p-4 my-6">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-amber-900">
                        <strong>Учебные примеры:</strong> В интерактивных примерах ниже используются вымышленные проекты 
                        для демонстрации работы фильтров. В реальном приложении фильтры работают с 
                        <strong> твоими настоящими сообществами</strong> из базы данных.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Смысл:</strong> Вместо того, чтобы листать список вниз-вверх, 
                    просто пишешь название или выбираешь фильтр — нужный проект находится мгновенно!
                </p>
            </div>

            <hr className="!my-10" />

            {/* Три инструмента */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Три инструмента поиска</h2>

            <div className="not-prose space-y-6 my-8">
                {/* Инструмент 1: Поиск по названию */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">1. Поиск по названию</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Вверху сайдбара есть <strong>текстовое поле "Поиск по названию..."</strong>. 
                                Напиши там название проекта, и он автоматически отфильтруется из списка.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Как это работает:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Напиши "суш" → увидишь только "Фиолето Суши"</li>
                                    <li>Напиши "ключ" → увидишь только "Изготовление автоключей"</li>
                                    <li>Напиши "кров" → увидишь только "ООО Строй Кровля"</li>
                                    <li>Поиск <strong>не чувствителен к регистру</strong> (СУШИ = суши)</li>
                                </ul>
                            </div>
                            <div className="bg-blue-100 rounded p-3 border border-blue-300 text-sm text-blue-900 mt-3">
                                <p><strong>Совет:</strong> Напиши первые буквы названия или любое слово из названия 
                                — приложение найдёт проект.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Инструмент 2: Фильтр по командам */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">2. Фильтр по командам</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Если проекты разделены между разными <strong>командами в агентстве</strong>, 
                                можно показать только проекты определённой команды.
                            </p>
                            <div className="bg-white rounded p-3 border border-green-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Как это работает:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Кнопки с названиями команд (например, "Команда А", "Команда Б")</li>
                                    <li>Клик на кнопку команды → видишь только её проекты</li>
                                    <li>Клик на "Все" → видишь все проекты (без фильтра)</li>
                                    <li>Активная команда выделена синим кольцом</li>
                                </ul>
                            </div>
                            <div className="bg-green-100 rounded p-3 border border-green-300 text-sm text-green-900 mt-3">
                                <p><strong>Для кого это полезно:</strong> Если ты работаешь только с одной командой, 
                                можешь выбрать её фильтр и видеть только нужные проекты.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Инструмент 3: Фильтр по количеству постов */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="w-10 h-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">3. Фильтр по количеству постов</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Самый <strong>мощный фильтр</strong> — фильтрация по количеству черновиков. 
                                Это помогает найти проекты, где контент заканчивается.
                            </p>
                            <div className="bg-white rounded p-3 border border-purple-200 text-sm text-gray-700 space-y-3">
                                <p><strong>Варианты фильтра:</strong></p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gray-300 text-gray-800">Все</span>
                                        <span>= Показать все проекты</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gradient-to-t from-gray-300 to-red-200 text-red-900 font-medium">Нет постов</span>
                                        <span>= Проекты с 0 постами</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900 font-medium">Есть посты</span>
                                        <span>= Проекты с любым количеством &gt; 0</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 font-medium">&lt; 5</span>
                                        <span>= От 1 до 4 постов</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gray-300 text-gray-800">5-10</span>
                                        <span>= От 5 до 10 постов</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded text-xs bg-gradient-to-t from-gray-300 to-green-200 text-green-900 font-medium">&gt; 10</span>
                                        <span>= Больше 10 постов</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-100 rounded p-3 border border-purple-300 text-sm text-purple-900 mt-3">
                                <p><strong>Пример:</strong> Хочешь срочно понять, в каких проектах закончился контент? 
                                Выбери фильтр "Нет постов" — и сразу увидишь все критичные проекты!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный пример */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивный пример</h2>

            <Sandbox
                title="Интерактивные фильтры и поиск"
                description="Попробуй использовать фильтры ниже! Пиши в поле поиска, выбирай команду и фильтр по постам."
                instructions={["Напиши 'суши' в поиск", "Выбери 'Команда А'", "Попробуй фильтр 'Нет постов'", "Комбинируй все фильтры вместе"]}
            >
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6">
                {/* Поиск */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {/* Фильтры по командам */}
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Команды</h4>
                    <div className="flex flex-wrap gap-1.5">
                        {[{ value: 'All', label: 'Все' }, { value: 'Команда А', label: 'Команда А' }, { value: 'Команда Б', label: 'Команда Б' }, { value: 'NoTeam', label: 'Без команды' }].map(team => (
                            <button
                                key={team.value}
                                onClick={() => setTeamFilter(team.value)}
                                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                    teamFilter === team.value
                                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-500'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            >
                                {team.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Фильтры по постам */}
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Посты</h4>
                    <div className="flex flex-wrap gap-1.5">
                    {[
                        { value: 'all', label: 'Все', color: 'bg-gray-300 text-gray-800', hoverColor: 'hover:bg-gray-400' },
                        { value: 'empty', label: 'Нет постов', color: 'bg-gradient-to-t from-gray-300 to-red-200 text-red-900', hoverColor: 'hover:to-red-300' },
                        { value: 'not_empty', label: 'Есть посты', color: 'bg-gradient-to-t from-gray-300 to-blue-200 text-blue-900', hoverColor: 'hover:to-blue-300' },
                        { value: 'lt5', label: '< 5', color: 'bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900', hoverColor: 'hover:to-orange-300' },
                        { value: '5-10', label: '5-10', color: 'bg-gray-300 text-gray-800', hoverColor: 'hover:bg-gray-400' },
                        { value: 'gt10', label: '> 10', color: 'bg-gradient-to-t from-gray-300 to-green-200 text-green-900', hoverColor: 'hover:to-green-300' },
                    ].map(option => (
                        <button
                            key={option.value}
                            onClick={() => setContentFilter(option.value)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                contentFilter === option.value
                                    ? `${option.color} ring-2 ring-indigo-500`
                                    : `${option.color} ${option.hoverColor}`
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                    </div>
                </div>

                {/* Результаты */}
                <div className="bg-white rounded border border-gray-300 p-4">
                    <p className="text-xs text-gray-600 mb-3 font-semibold">
                        Результаты поиска ({filteredProjects.length} найдено):
                    </p>
                    {filteredProjects.length > 0 ? (
                        <div className="space-y-2">
                            {filteredProjects.map((project, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{project.name}</p>
                                        <p className="text-xs text-gray-500">{project.team}</p>
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getCounterColorClasses(project.count)}`}>
                                        {project.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                            Проектов не найдено. Попробуй изменить фильтры.
                        </p>
                    )}
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    <strong>Попробуй:</strong> Напиши "суши", выбери "Команда А" и "Нет постов" 
                    — должен остаться только проект "Фиолето Суши"!
                </p>
            </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Комбинирование фильтров */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Комбинирование фильтров</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                    <p className="text-sm text-gray-700">
                        <strong>Важно:</strong> Все три фильтра работают <strong>одновременно</strong>. 
                        Это значит, что если ты выбрал &quot;Команда А&quot; и фильтр &quot;Нет постов&quot;, 
                        ты увидишь только пустые проекты из Команды А.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-800">Примеры поиска:</p>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>Ищешь:</strong> Все пустые проекты → Выбери фильтр &quot;Нет постов&quot;</li>
                        <li><strong>Ищешь:</strong> Проекты Команды Б с малым контентом → Выбери &quot;Команда Б&quot; + &quot;&lt; 5&quot;</li>
                        <li><strong>Ищешь:</strong> Конкретный проект с суши → Пиши &quot;суш&quot; в поиск</li>
                        <li><strong>Ищешь:</strong> Все проекты Команды А → Выбери &quot;Команда А&quot; + фильтр &quot;Все&quot;</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Важные моменты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Советы и трюки</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Быстрый способ найти критичные проекты</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Каждый день открывай сайдбар и выбери фильтр "Нет постов" 
                            — сразу увидишь, где нужно создавать контент.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-blue-900">Фильтры сбрасываются автоматически</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Когда ты переходишь на другой модуль приложения и возвращаешься обратно, 
                            все фильтры сбрасываются (видишь все проекты).
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Поиск — самый быстрый способ</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Если знаешь название проекта, просто пиши его в поиск — это быстрее, 
                            чем щёлкать по кнопкам фильтров.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-amber-900">Фильтр по командам не всегда есть</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Если в приложении только твои проекты (ты работаешь один), 
                            этот фильтр может быть недоступен или скрыт.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Можно ли использовать несколько фильтров одновременно?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да! Все три инструмента работают одновременно. Например, ты можешь выбрать "Команда А" + "Нет постов" 
                        и дополнительно ввести текст в поиск. Результат будет отфильтрован по всем трём критериям.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Что делать, если поиск ничего не находит?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Проверь, активны ли фильтры команд или постов. Возможно, ты случайно выбрал фильтр, 
                        который исключает нужный проект. Сбрось все фильтры (выбери "Все") и попробуй снова.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Сохраняются ли фильтры при перезагрузке страницы?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, при перезагрузке или переходе на другой модуль все фильтры сбрасываются. 
                        Это сделано специально, чтобы ты всегда видел полный список проектов при открытии приложения.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Чем фильтр "Есть посты" отличается от других фильтров по постам?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Фильтр "Есть посты" показывает все проекты, где count &gt; 0 (любое количество). 
                        Остальные фильтры более конкретны: "&lt; 5" = от 1 до 4, "5-10" = от 5 до 10, "&gt; 10" = больше 10.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Три инструмента:</strong> поиск по названию, фильтр по командам, фильтр по постам.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Фильтры работают <strong>одновременно</strong> — можно комбинировать все три.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Поиск <strong>не чувствителен к регистру</strong> — СУШИ = суши.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Самый быстрый способ найти критичные проекты — фильтр <strong>"Нет постов"</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Фильтры сбрасываются при переходе на другой модуль или перезагрузке.</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Создай себе <strong>утренний ритуал</strong>: открывай приложение, выбирай фильтр "Нет постов", 
                            и сразу видишь проекты, где нужно срочно создать контент. За 5-10 минут можно создать 
                            черновики для всех критичных проектов и вывести их хотя бы на оранжевый уровень (1-4 поста). 
                            Это простая привычка, которая <strong>на 100% исключит ситуации</strong>, когда в проекте заканчивается контент.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons />
        </article>
    );
};
