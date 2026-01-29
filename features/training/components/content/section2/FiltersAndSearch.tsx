import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Фильтры и поиск
// =====================================================================
export const FiltersAndSearch: React.FC<ContentProps> = ({ title }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teamFilter, setTeamFilter] = useState('All');
    const [contentFilter, setContentFilter] = useState('all');

    const mockProjects = [
        { name: '🍕 Доставка пиццы', team: 'Команда А', count: 0 },
        { name: '🎨 Дизайн студия', team: 'Команда Б', count: 3 },
        { name: '📚 Образование', team: 'Команда А', count: 7 },
        { name: '💪 Фитнес клуб', team: 'Команда Б', count: 15 },
        { name: '🌿 Природа', team: 'Команда А', count: 0 },
    ];

    const filteredProjects = mockProjects.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTeam = teamFilter === 'All' || p.team === teamFilter;
        
        let matchesContent = true;
        switch(contentFilter) {
            case 'empty': matchesContent = p.count === 0; break;
            case 'not_empty': matchesContent = p.count > 0; break;
            case 'lt5': matchesContent = p.count > 0 && p.count < 5; break;
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

            <div className="not-pros bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Смысл:</strong> Вместо того, чтобы листать список вниз-вверх, 
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
                        <div className="text-3xl flex-shrink-0">🔍</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">1. Поиск по названию</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Вверху сайдбара есть <strong>текстовое поле "Поиск по названию..."</strong>. 
                                Напиши там название проекта, и он автоматически отфильтруется из списка.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Как это работает:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Напиши "пиц" → увидишь только "Доставка пиццы"</li>
                                    <li>Напиши "кл" → увидишь только "Фитнес клуб"</li>
                                    <li>Напиши "обр" → увидишь только "Образование"</li>
                                    <li>Поиск <strong>не чувствителен к регистру</strong> (ДОСТАВКА = доставка)</li>
                                </ul>
                            </div>
                            <div className="bg-blue-100 rounded p-3 border border-blue-300 text-sm text-blue-900 mt-3">
                                <p><strong>💡 Совет:</strong> Напиши первые буквы названия или любое слово из названия 
                                — приложение найдёт проект.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Инструмент 2: Фильтр по командам */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">👥</div>
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
                                    <li>Клик на "All" → видишь все проекты (без фильтра)</li>
                                    <li>Активная команда выделена синим кольцом</li>
                                </ul>
                            </div>
                            <div className="bg-green-100 rounded p-3 border border-green-300 text-sm text-green-900 mt-3">
                                <p><strong>💡 Для кого это полезно:</strong> Если ты работаешь только с одной командой, 
                                можешь выбрать её фильтр и видеть только нужные проекты.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Инструмент 3: Фильтр по количеству постов */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📊</div>
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
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">0</span>
                                        <span>= Пусто (0 постов)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">1-4</span>
                                        <span>= Мало (1-4 поста)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-gray-300 text-gray-700">5-10</span>
                                        <span>= Не пусто (5-10 постов)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">10+</span>
                                        <span>= Много (10+ постов)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-purple-100 rounded p-3 border border-purple-300 text-sm text-purple-900 mt-3">
                                <p><strong>💡 Пример:</strong> Хочешь срочно понять, в каких проектах закончился контент? 
                                Выбери фильтр "0 постов" — и сразу увидишь все критичные проекты!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный пример */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивный пример</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Попробуй использовать фильтры ниже! Пиши в поле поиска, выбирай команду и фильтр по постам:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                {/* Поиск */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Поиск по названию..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Фильтры по командам */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {['All', 'Команда А', 'Команда Б'].map(team => (
                        <button
                            key={team}
                            onClick={() => setTeamFilter(team)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                teamFilter === team
                                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {team}
                        </button>
                    ))}
                </div>

                {/* Фильтры по постам */}
                <div className="mb-4 flex flex-wrap gap-2">
                    {[
                        { value: 'all', label: 'Все', color: 'bg-gray-300' },
                        { value: 'empty', label: 'Пусто (0)', color: 'bg-red-100 text-red-800' },
                        { value: 'not_empty', label: 'Не пусто', color: 'bg-blue-100 text-blue-800' },
                        { value: 'lt5', label: 'Мало (1-4)', color: 'bg-orange-100 text-orange-800' },
                        { value: 'gt10', label: 'Много (10+)', color: 'bg-green-100 text-green-800' },
                    ].map(option => (
                        <button
                            key={option.value}
                            onClick={() => setContentFilter(option.value)}
                            className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                                contentFilter === option.value
                                    ? `${option.color} ring-2 ring-indigo-400`
                                    : `${option.color} hover:opacity-75`
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
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
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
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
                    💡 <strong>Попробуй:</strong> Напиши "пиц", выбери "Команда А" и "Пусто (0)" 
                    — должна остаться только "Доставка пиццы"!
                </p>
            </div>

            <hr className="!my-10" />

            {/* Комбинирование фильтров */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Комбинирование фильтров</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                        <strong>Важно:</strong> Все три фильтра работают <strong>одновременно</strong>. 
                        Это значит, что если ты выбрал "Команда А" и фильтр "Пусто (0)", 
                        ты увидишь только пусто проекты из Команды А.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-800">Примеры поиска:</p>
                    <ul className="text-sm text-gray-700 space-y-2">
                        <li><strong>Ищешь:</strong> Все пустые проекты → Выбери фильтр "Пусто (0)"</li>
                        <li><strong>Ищешь:</strong> Проекты Команды Б с малым контентом → Выбери "Команда Б" + "Мало (1-4)"</li>
                        <li><strong>Ищешь:</strong> Конкретный проект "Доставка" → Пиши "доставка" в поиск</li>
                        <li><strong>Ищешь:</strong> Все проекты Команды А → Выбери "Команда А" + фильтр "Все"</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Важные моменты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Советы и трюки</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Быстрый способ найти критичные проекты</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Каждый день открывай сайдбар и выбери фильтр "Пусто (0)" 
                            — сразу увидишь, где нужно создавать контент.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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

                <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-yellow-900">Фильтр по командам не всегда есть</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Если в приложении только твои проекты (ты работаешь один), 
                            этот фильтр может быть недоступен или скрыт.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Заключение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итог</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Фильтры и поиск</strong> — это мощные инструменты для навигации по проектам. 
                Используй их ежедневно:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 !list-disc !pl-6 my-4">
                <li><strong>Поиск</strong> — когда знаешь название проекта</li>
                <li><strong>Фильтр по командам</strong> — когда работаешь в команде и нужны только её проекты</li>
                <li><strong>Фильтр по постам</strong> — когда ищешь критичные проекты (пустые) или проверяешь статус</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700 mt-6">
                Теперь ты полностью понял сайдбар проектов! 🎉
            </p>
        </article>
    );
};
