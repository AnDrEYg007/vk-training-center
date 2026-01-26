import React, { useState } from 'react';
import { ContentProps, NavigationLink, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации проектов
// =====================================================================

interface MockProject {
    id: string;
    name: string;
    avatar: string;
    count: number;
    status: 'good' | 'warning' | 'danger';
}

const MockProjectItem: React.FC<{ 
    project: MockProject; 
    isActive: boolean;
    onClick: () => void;
}> = ({ project, isActive, onClick }) => {
    const statusColors = {
        good: 'bg-green-100 text-green-700 border-green-200',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        danger: 'bg-red-100 text-red-700 border-red-200'
    };

    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isActive 
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
            }`}
        >
            <img 
                src={project.avatar} 
                alt={project.name}
                className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
            />
            <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm truncate ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
                    {project.name}
                </p>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold border ${statusColors[project.status]}`}>
                {project.count}
            </span>
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
// Основной компонент: Ваш первый шаг - Проекты
// =====================================================================
export const ProjectsFirstStep: React.FC<ContentProps> = ({ title }) => {
    const [selectedProject, setSelectedProject] = useState<string | null>(null);

    const mockProjects: MockProject[] = [
        { id: '1', name: 'Магазин электроники TECH', avatar: 'https://picsum.photos/seed/project1/100/100', count: 12, status: 'good' },
        { id: '2', name: 'Кафе "Уютный уголок"', avatar: 'https://picsum.photos/seed/project2/100/100', count: 3, status: 'warning' },
        { id: '3', name: 'Фитнес-клуб "Энергия"', avatar: 'https://picsum.photos/seed/project3/100/100', count: 0, status: 'danger' },
        { id: '4', name: 'Салон красоты "Стиль"', avatar: 'https://picsum.photos/seed/project4/100/100', count: 8, status: 'good' },
    ];

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Проект</strong> — это ваше сообщество ВКонтакте, подключённое к приложению. 
                Каждый проект имеет своё расписание постов, предложенные посты, товары, автоматизации и настройки.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Простыми словами:</strong> Проект = Сообщество VK. 
                    Если вы ведёте 5 сообществ, у вас будет 5 проектов в приложении.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Что такое проект */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое проект?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый проект в приложении содержит:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Основная информация
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Название сообщества VK</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Аватар (фото профиля)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>ID сообщества VK</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 font-bold">•</span>
                            <span>Токен доступа к VK API</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Контент
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Отложенные посты (календарь)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Предложенные посты (модерация)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Заметки и теги</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Истории (stories)</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Товары
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>Каталог товаров</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>Синхронизация с VK</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-600 font-bold">•</span>
                            <span>Прикрепление к постам</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Автоматизации
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>Конкурсы (отзывы, активность)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>AI-посты (автогенерация)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>Посты в истории</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Список проектов в сайдбаре */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Список проектов в сайдбаре</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После выбора модуля "Контент-менеджмент" во второй колонке слева появляется 
                <strong> сайдбар проектов</strong> — это ваша главная панель навигации между сообществами.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Элементы карточки проекта</h3>

            <div className="not-prose my-6">
                <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                        <div>
                            <p className="font-semibold text-gray-800">Аватар проекта</p>
                            <p className="text-sm text-gray-600">Круглая иконка с фото сообщества VK — помогает быстро визуально найти проект</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                        <div>
                            <p className="font-semibold text-gray-800">Название проекта</p>
                            <p className="text-sm text-gray-600">Текст обрезается, если слишком длинный (с троеточием)</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                        <div>
                            <p className="font-semibold text-gray-800">Счётчик постов</p>
                            <p className="text-sm text-gray-600">Число отложенных постов с цветовым индикатором статуса</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Цветовые индикаторы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Цветовые индикаторы счётчиков</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Счётчик постов имеет <strong>три цветовых состояния</strong>, которые подсказывают, 
                нужно ли обратить внимание на проект:
            </p>

            <div className="not-prose grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-green-900">Зелёный</h3>
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded font-bold text-sm">
                            8+
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Всё в порядке!</strong><br/>
                        В проекте 8 или больше отложенных постов. Контента достаточно.
                    </p>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-yellow-900">Жёлтый</h3>
                        <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded font-bold text-sm">
                            1-7
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Внимание!</strong><br/>
                        Постов мало (1-7 штук). Скоро нужно будет пополнить календарь.
                    </p>
                </div>

                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-red-900">Красный</h3>
                        <span className="px-3 py-1.5 bg-red-100 text-red-700 border border-red-200 rounded font-bold text-sm">
                            0
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">
                        <strong>Срочно!</strong><br/>
                        В проекте нет отложенных постов. Пора планировать контент!
                    </p>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="Попробуйте сами: Выбор проекта"
                description="Кликайте на проекты, чтобы увидеть, как работает переключение."
                instructions={[
                    '<strong>Кликните</strong> на любой проект из списка.',
                    'Обратите внимание на <strong>цветовые счётчики</strong> (зелёный/жёлтый/красный).',
                    'Активный проект подсвечивается синим фоном.'
                ]}
            >
                <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="space-y-2">
                        {mockProjects.map(project => (
                            <MockProjectItem
                                key={project.id}
                                project={project}
                                isActive={selectedProject === project.id}
                                onClick={() => setSelectedProject(project.id)}
                            />
                        ))}
                    </div>
                </div>
                {selectedProject && (
                    <div className="mt-4 p-4 bg-white rounded-lg border border-indigo-200">
                        <p className="text-sm text-gray-700">
                            <strong>Выбран проект:</strong>{' '}
                            <span className="text-indigo-600 font-bold">
                                {mockProjects.find(p => p.id === selectedProject)?.name}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            В реальном приложении загрузятся данные этого проекта: посты, товары, настройки.
                        </p>
                    </div>
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Фильтры и поиск */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Фильтры и поиск</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если у вас много проектов, в сайдбаре есть инструменты для быстрого поиска:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Поиск по названию
                    </h3>
                    <p className="text-sm text-gray-700">
                        Введите часть названия проекта, и список отфильтруется автоматически. 
                        Удобно, когда проектов больше 10.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        Фильтры по статусу
                    </h3>
                    <p className="text-sm text-gray-700">
                        Можно показать только проекты с красным счётчиком (0 постов) — 
                        так вы быстро найдёте, где нужно добавить контент.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь вы понимаете, что такое проекты и как их выбирать. Следующий шаг — 
                изучить, как работать с контентом внутри проекта:
            </p>

            <div className="not-prose my-6 space-y-3">
                <NavigationLink 
                    to="2-1-scheduled"
                    title='Раздел 2.1. Вкладка "Отложенные"'
                    description="Как работать с календарём и планировать посты"
                    variant="next"
                />
                <NavigationLink 
                    to="2-2-suggested"
                    title='Раздел 2.2. Вкладка "Предложенные"'
                    description="Модерация постов из предложки сообщества"
                    variant="next"
                />
            </div>

            <hr className="!my-10" />

            {/* Полезные советы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Полезные советы</h2>

            <div className="not-prose grid gap-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 1: Сортируйте по приоритету</p>
                        <p className="text-sm text-gray-600">
                            Проекты с красным счётчиком (0 постов) — первоочередные для работы. 
                            Начните с них.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                    <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 2: Переключайтесь быстро</p>
                        <p className="text-sm text-gray-600">
                            Не бойтесь часто переключаться между проектами — данные загружаются мгновенно, 
                            состояние сохраняется.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
                    <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div>
                        <p className="font-semibold text-gray-800 mb-1">Совет 3: Используйте фильтры</p>
                        <p className="text-sm text-gray-600">
                            Если проектов много, фильтр "показать только с 0 постов" поможет сфокусироваться 
                            на том, что требует внимания.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="1-5-projects-first-step" />
        </article>
    );
};
