import React from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';
import { MockProjectListItem } from '../SidebarMocks';

// =====================================================================
// Мок-компонент: Главная навигация (из PrimarySidebar.tsx)
// =====================================================================
const MockPrimarySidebar: React.FC = () => {
    const items = [
        { id: 'km', icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z', label: 'Контент-менеджмент', isActive: true },
        { id: 'lists', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Списки' },
        { id: 'am', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Сообщения (в разработке)' },
        { id: 'stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Статистика (в разработке)' },
    ];

    const bottomItems = [
        { id: 'db', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4', label: 'База проектов' },
        { id: 'users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Пользователи' },
        { id: 'training', icon: 'M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z', label: 'Центр обучения', fill: true },
        { id: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'Настройки' },
    ];

    return (
        <div className="w-16 bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-between py-4 shadow-sm">
            {/* Верхняя группа */}
            <div className="space-y-2">
                {items.map(item => (
                    <button
                        key={item.id}
                        title={item.label}
                        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                            item.isActive 
                                ? 'bg-indigo-50 text-indigo-600' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                        </svg>
                    </button>
                ))}
            </div>

            {/* Нижняя группа */}
            <div className="space-y-2">
                {bottomItems.map(item => (
                    <button
                        key={item.id}
                        title={item.label}
                        className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                    >
                        {item.fill ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d={item.icon} />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

// =====================================================================
// Карточка темы обучения
// =====================================================================
const LearnCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    items: string[];
    section: string;
}> = ({ icon, title, description, items, section }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-semibold text-gray-800">{title}</h4>
                <span className="text-xs text-gray-500">{section}</span>
            </div>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <ul className="text-sm text-gray-600 space-y-1">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

// =====================================================================
// Основной компонент: Что вы узнаете
// =====================================================================
export const WhatYouWillLearn: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Центр обучения охватывает все аспекты работы с приложением "Планировщик контента". 
                Ниже представлен обзор основных тем, которые вы сможете изучить.
            </p>

            <hr className="!my-10" />

            {/* Структура приложения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура приложения</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Приложение состоит из нескольких основных модулей, доступных через главную навигационную панель слева:
            </p>

            <Sandbox 
                title="Главная навигационная панель" 
                description="Это боковая панель с иконками, которая позволяет переключаться между модулями приложения."
            >
                <div className="flex gap-4 items-start">
                    <MockPrimarySidebar />
                    <div className="bg-white border border-gray-200 rounded-lg p-4 flex-1">
                        <h5 className="text-sm font-semibold text-gray-800 mb-3">Модули приложения:</h5>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                <strong>Контент-менеджмент</strong> — календарь, предложенные посты, товары
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                <strong>Списки</strong> — управление списками пользователей
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                <strong>База проектов</strong> — настройка сообществ VK
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                <strong>Пользователи</strong> — управление доступом
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                                <strong>Настройки</strong> — системные параметры
                            </li>
                        </ul>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Темы обучения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные темы</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <LearnCard 
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                    title="Управление контентом"
                    description="Всё о создании, планировании и публикации постов"
                    section="Раздел 2.1"
                    items={[
                        'Работа с календарём отложенных постов',
                        'Модерация предложенных постов',
                        'Использование AI для генерации текстов',
                        'Drag-and-Drop перемещение постов',
                    ]}
                />
                <LearnCard 
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                    title="Работа с товарами"
                    description="Массовое редактирование каталога VK"
                    section="Раздел 2.3"
                    items={[
                        'Импорт/экспорт товаров (CSV, XLSX)',
                        'Массовое редактирование цен и описаний',
                        'AI-коррекция описаний',
                        'Управление категориями и альбомами',
                    ]}
                />
                <LearnCard 
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    title="Автоматизации и конкурсы"
                    description="Настройка ботов и игровых механик"
                    section="Раздел 2.4"
                    items={[
                        'Конкурсы отзывов с промокодами',
                        'Автопубликация постов в истории',
                        'Поздравления с днём рождения',
                        'Универсальные конкурсы',
                    ]}
                />
                <LearnCard 
                    icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    title="Администрирование"
                    description="Управление системой и пользователями"
                    section="Раздел 6"
                    items={[
                        'Настройка проектов и команд',
                        'Управление VK-токенами',
                        'Системные аккаунты и AI-токены',
                        'Просмотр логов и задач',
                    ]}
                />
            </div>

            <hr className="!my-10" />

            {/* Пример: Сайдбар проектов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Пример: Счётчики постов в сайдбаре</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Одна из важных концепций — это счётчики постов в списке проектов. 
                Их цвет показывает количество контента:
            </p>

            <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">0 постов</span>
                        <span className="bg-gradient-to-t from-gray-300 to-red-200 text-red-900 text-xs px-2 py-0.5 rounded-full font-medium">0</span>
                    </div>
                    <p className="text-xs text-red-600">Нет контента</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">1-4 поста</span>
                        <span className="bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 text-xs px-2 py-0.5 rounded-full font-medium">3</span>
                    </div>
                    <p className="text-xs text-orange-600">Мало контента</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">5-10 постов</span>
                        <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">7</span>
                    </div>
                    <p className="text-xs text-gray-600">Достаточно</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">11+ постов</span>
                        <span className="bg-gradient-to-t from-gray-300 to-green-200 text-green-900 text-xs px-2 py-0.5 rounded-full font-medium">15</span>
                    </div>
                    <p className="text-xs text-green-600">Много контента</p>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Подробнее о работе сайдбара вы узнаете в <strong>Разделе 2.1.1</strong>.
            </p>

            {/* Подсказка */}
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Рекомендация:</strong> Если вы новичок, начните с <strong>Раздела 1</strong> — 
                    там описаны базовые понятия и интерфейс приложения. Если уже работаете с системой, 
                    переходите сразу к нужному разделу через оглавление.
                </p>
            </div>

            <NavigationButtons currentPath="0-3-what-you-will-learn" />
        </article>
    );
};
