import React, { useState } from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации рабочей области
// =====================================================================

type ViewType = 'welcome' | 'calendar' | 'suggested' | 'products';

const MockWelcomeScreen: React.FC = () => (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 bg-white h-full">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Добро пожаловать!</h2>
        <p className="text-gray-500 max-w-md text-sm">
            Выберите проект из списка слева, чтобы просмотреть его расписание.
        </p>
    </div>
);

const MockCalendarView: React.FC = () => (
    <div className="flex-1 bg-white p-6 overflow-auto h-full">
        {/* Шапка */}
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Расписание постов</h1>
            <div className="flex items-center gap-3">
                <button className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Сегодня
                </button>
                <button className="px-3 py-1.5 text-sm bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors">
                    + Создать пост
                </button>
            </div>
        </div>

        {/* Mock календарь */}
        <div className="grid grid-cols-7 gap-2">
            {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => (
                <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
                    {day}
                </div>
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[120px]">
                    <div className="text-sm font-semibold text-gray-700 mb-2">{20 + i}</div>
                    {i % 3 === 0 && (
                        <div className="bg-blue-100 border border-blue-300 rounded p-2 text-xs text-blue-900 mb-1">
                            Пост о скидках
                        </div>
                    )}
                    {i % 4 === 0 && (
                        <div className="bg-green-100 border border-green-300 rounded p-2 text-xs text-green-900">
                            Новый товар
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const MockSuggestedView: React.FC = () => (
    <div className="flex-1 bg-white p-6 overflow-auto h-full">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Предложенные посты</h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                4 новых
            </span>
        </div>

        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <img 
                            src={`https://picsum.photos/seed/author${i}/40/40`}
                            className="w-10 h-10 rounded-full"
                            alt="Автор"
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm mb-1">Пользователь {i}</p>
                            <p className="text-gray-700 text-sm">
                                Отличный контент! Хотел бы поделиться своим мнением...
                            </p>
                            <div className="mt-3 flex gap-2">
                                <button className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700">
                                    Одобрить
                                </button>
                                <button className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700">
                                    Отклонить
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MockProductsView: React.FC = () => (
    <div className="flex-1 bg-white p-6 overflow-auto h-full">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
            <button className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                Синхронизация с VK
            </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                        src={`https://picsum.photos/seed/product${i}/300/200`}
                        className="w-full h-40 object-cover"
                        alt={`Товар ${i}`}
                    />
                    <div className="p-3">
                        <p className="font-semibold text-gray-800 text-sm mb-1">Товар {i}</p>
                        <p className="text-indigo-600 font-bold text-sm">{1000 + i * 500} ₽</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MockWorkspace: React.FC<{ view: ViewType }> = ({ view }) => {
    const views = {
        welcome: <MockWelcomeScreen />,
        calendar: <MockCalendarView />,
        suggested: <MockSuggestedView />,
        products: <MockProductsView />,
    };

    return (
        <div className="flex-1 bg-gray-50 h-full overflow-hidden">
            {views[view]}
        </div>
    );
};

const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
}> = ({ title, description, children, instructions }) => (
    <div className="not-prose relative p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-12">
        <h4 className="text-xl font-bold text-indigo-800 mb-2">{title}</h4>
        <p className="text-sm text-indigo-700 mb-4">{description}</p>
        {instructions && instructions.length > 0 && (
            <ul className="list-disc list-inside text-sm text-indigo-700 space-y-1 mb-6">
                {instructions.map((item, idx) => (
                    <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
            </ul>
        )}
        {children}
    </div>
);

// =====================================================================
// Основной компонент
// =====================================================================
export const WorkspaceIntro: React.FC<ContentProps> = ({ title }) => {
    const [currentView, setCurrentView] = useState<ViewType>('welcome');

    const viewDescriptions: Record<ViewType, { name: string; desc: string }> = {
        welcome: { name: 'Экран приветствия', desc: 'Показывается, когда проект не выбран' },
        calendar: { name: 'Календарь постов', desc: 'Расписание отложенных постов (вкладка "Отложенные")' },
        suggested: { name: 'Предложенные посты', desc: 'Модерация постов из предложки сообщества' },
        products: { name: 'Каталог товаров', desc: 'Товары проекта с синхронизацией VK' },
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Это <strong>основная часть справа</strong> — самая большая область экрана, 
                где отображается содержимое выбранного модуля и проекта.
            </p>

            <div className="not-prose bg-purple-50 border-l-4 border-purple-500 p-4 my-6">
                <p className="text-sm text-purple-900">
                    <strong>Функция:</strong> Отображение контента в зависимости от выбранного модуля и вкладки — 
                    календарь, посты, товары, автоматизации, списки.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Что показывается */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что отображается в рабочей области?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Содержимое зависит от <strong>выбранного модуля</strong> и <strong>активной вкладки</strong>:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 className="font-bold text-blue-900 text-lg">Контент-менеджмент</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span><strong>Отложенные:</strong> Календарь с постами</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span><strong>Предложенные:</strong> Список постов на модерацию</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span><strong>Товары:</strong> Сетка товаров с фото</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <h3 className="font-bold text-green-900 text-lg">Автоматизации</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span><strong>Конкурсы:</strong> Настройки и списки участников</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span><strong>AI-посты:</strong> Автогенерация контента</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span><strong>Истории:</strong> Автопостинг в stories</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-8 h-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <h3 className="font-bold text-purple-900 text-lg">Списки</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span><strong>Системные:</strong> Участники конкурсов</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span><strong>Пользовательские:</strong> Ваши списки</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="font-bold text-orange-900 text-lg">Без проекта</h3>
                    </div>
                    <p className="text-sm text-gray-700">
                        Если проект не выбран, показывается <strong>экран приветствия</strong> 
                        с подсказкой выбрать проект из списка.
                    </p>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="Попробуйте сами: Разные состояния рабочей области"
                description="Переключайте между разными видами контента в рабочей области."
                instructions={[
                    '<strong>Кликните</strong> на кнопки ниже, чтобы увидеть разные экраны.',
                    'Обратите внимание, как меняется содержимое — от экрана приветствия до календаря и товаров.',
                    'Каждый вид имеет <strong>свою структуру</strong> и элементы управления.'
                ]}
            >
                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setCurrentView('welcome')}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                            currentView === 'welcome'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Экран приветствия
                    </button>
                    <button
                        onClick={() => setCurrentView('calendar')}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                            currentView === 'calendar'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Календарь постов
                    </button>
                    <button
                        onClick={() => setCurrentView('suggested')}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                            currentView === 'suggested'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Предложенные посты
                    </button>
                    <button
                        onClick={() => setCurrentView('products')}
                        className={`px-4 py-2 text-sm rounded-lg transition-all ${
                            currentView === 'products'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Товары
                    </button>
                </div>

                <div className="bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-400 shadow-xl h-[500px]">
                    <MockWorkspace view={currentView} />
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-700">
                        <strong>Текущий вид:</strong>{' '}
                        <span className="text-purple-600 font-bold">{viewDescriptions[currentView].name}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {viewDescriptions[currentView].desc}
                    </p>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Общие элементы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Общие элементы интерфейса</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Независимо от содержимого, в рабочей области обычно присутствуют:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Заголовок раздела
                    </h4>
                    <p className="text-sm text-gray-700">
                        Крупный текст вверху страницы — название текущего раздела ("Расписание постов", "Товары" и т.д.)
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Кнопки действий
                    </h4>
                    <p className="text-sm text-gray-700">
                        Справа от заголовка — кнопки для создания контента ("+ Создать пост", "Синхронизация с VK")
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фильтры и сортировка
                    </h4>
                    <p className="text-sm text-gray-700">
                        Инструменты для поиска и фильтрации контента (особенно в списках постов и товаров)
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Прокрутка контента
                    </h4>
                    <p className="text-sm text-gray-700">
                        Если контента много, область прокручивается вертикально — без перезагрузки страницы
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Адаптивность */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Адаптивность и масштаб</h2>

            <div className="not-prose my-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-bold text-yellow-900 mb-1">Рабочая область занимает всё доступное пространство</p>
                            <p className="text-sm text-gray-700">
                                После главной панели и сайдбара проектов остальное место экрана — это рабочая область. 
                                Чем больше экран, тем больше контента видно одновременно.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итог */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итого: Три части работают вместе</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь вы понимаете структуру интерфейса:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                    <ol className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <div>
                                <p className="font-semibold text-gray-800">Главная панель → выбор модуля</p>
                                <p className="text-sm text-gray-600">Кликаете на иконку, выбираете раздел работы</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <div>
                                <p className="font-semibold text-gray-800">Сайдбар проектов → выбор проекта</p>
                                <p className="text-sm text-gray-600">Кликаете на карточку, загружаются данные сообщества</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <div>
                                <p className="font-semibold text-gray-800">Рабочая область → работа с контентом</p>
                                <p className="text-sm text-gray-600">Видите календарь, посты, товары — создаёте, редактируете, публикуете</p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            <div className="not-prose my-6 space-y-3">
                <a href="#" className="block bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border border-indigo-200 rounded-lg p-4 transition-colors">
                    <p className="font-bold text-indigo-900">→ Раздел 2: Модуль "Контент-менеджмент"</p>
                    <p className="text-sm text-gray-600 mt-1">Подробный разбор работы с постами, календарём и товарами</p>
                </a>
            </div>

            <NavigationButtons currentPath="1-2-3-workspace-intro" />
        </article>
    );
};
