import React, { useState } from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации главной панели
// =====================================================================

const MockIconButton: React.FC<{ 
    label: string; 
    isActive?: boolean;
    children: React.ReactNode;
}> = ({ label, isActive = false, children }) => (
    <button
        title={label}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            isActive 
            ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
            : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600'
        }`}
    >
        {children}
    </button>
);

const MockPrimarySidebar: React.FC<{ activeIcon: string; onIconClick: (icon: string) => void }> = ({ activeIcon, onIconClick }) => {
    return (
        <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center justify-between py-4">
            {/* Верхняя группа: Модули */}
            <div className="space-y-4">
                <div onClick={() => onIconClick('km')}>
                    <MockIconButton label="Контент-менеджмент" isActive={activeIcon === 'km'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </MockIconButton>
                </div>
                <div onClick={() => onIconClick('am')}>
                    <MockIconButton label="Автоматизации" isActive={activeIcon === 'am'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </MockIconButton>
                </div>
                <div onClick={() => onIconClick('lists')}>
                    <MockIconButton label="Списки" isActive={activeIcon === 'lists'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </MockIconButton>
                </div>
            </div>

            {/* Нижняя группа: Глобальные действия */}
            <div className="space-y-4">
                <div onClick={() => onIconClick('database')}>
                    <MockIconButton label="База проектов" isActive={activeIcon === 'database'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                    </MockIconButton>
                </div>
                <div onClick={() => onIconClick('training')}>
                    <MockIconButton label="Центр обучения" isActive={activeIcon === 'training'}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </MockIconButton>
                </div>
                <div onClick={() => onIconClick('logout')}>
                    <MockIconButton label="Выйти" isActive={false}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </MockIconButton>
                </div>
            </div>
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
// Основной компонент: Главная навигационная панель
// =====================================================================
export const PrimarySidebarComponent: React.FC<ContentProps> = ({ title }) => {
    const [activeIcon, setActiveIcon] = useState<string>('km');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Главная навигационная панель</strong> (Primary Sidebar) — это узкая вертикальная панель 
                с иконками, расположенная в самой левой части экрана. Она всегда видна и служит 
                главным переключателем между модулями приложения и глобальными разделами.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Одна панель для доступа ко всем основным разделам — 
                    не нужно искать меню или запоминать горячие клавиши.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Структура панели */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура панели</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель разделена на <strong>две группы иконок</strong>:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                        Верхняя группа — Модули
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Основные разделы работы с контентом проектов:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">📅</span>
                            <span><strong>Контент-менеджмент</strong> — посты, календарь, предложка, товары</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">⚡</span>
                            <span><strong>Автоматизации</strong> — конкурсы, AI-посты, истории</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">📚</span>
                            <span><strong>Списки</strong> — системные, пользовательские, автоматизаций</span>
                        </li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                        Нижняя группа — Глобальные разделы
                    </h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Управление системой и настройки:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">🗄️</span>
                            <span><strong>База проектов</strong> — создание, редактирование, настройки всех проектов</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">👥</span>
                            <span><strong>Управление пользователями</strong> (только для админов)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">📖</span>
                            <span><strong>Центр обучения</strong> — эта документация!</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-green-600 font-bold">🚪</span>
                            <span><strong>Выйти</strong> — завершение сеанса</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="Попробуйте сами: Переключение между модулями"
                description="Кликайте на иконки, чтобы увидеть, как работает переключение модулей."
                instructions={[
                    '<strong>Кликните</strong> на разные иконки в верхней части панели.',
                    'Обратите внимание, как меняется подсветка активной иконки (синий фон).',
                    'В реальном приложении при клике открывается соответствующий модуль.'
                ]}
            >
                <div className="bg-white rounded-lg border flex justify-center py-8">
                    <MockPrimarySidebar activeIcon={activeIcon} onIconClick={setActiveIcon} />
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">
                        <strong>Активный модуль:</strong>{' '}
                        <span className="text-indigo-600 font-bold">
                            {activeIcon === 'km' && 'Контент-менеджмент'}
                            {activeIcon === 'am' && 'Автоматизации'}
                            {activeIcon === 'lists' && 'Списки'}
                            {activeIcon === 'database' && 'База проектов'}
                            {activeIcon === 'training' && 'Центр обучения'}
                            {activeIcon === 'logout' && 'Выход из системы'}
                        </span>
                    </p>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Детали модулей */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Подробнее о модулях</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Контент-менеджмент (КМ)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Главный рабочий модуль для SMM-специалистов. При выборе этого модуля в главной панели 
                появляются дополнительные вкладки:
            </p>

            <div className="not-prose my-4">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Отложенные</strong> — календарь с запланированными постами</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Предложенные</strong> — посты из предложки сообщества для модерации</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Товары</strong> — каталог товаров проекта с синхронизацией VK</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Автоматизации</strong> (подменю с 6 подразделами: истории, конкурсы, AI-посты и др.)</span>
                    </li>
                </ul>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Автоматизации (АМ)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Модуль для настройки автоматических действий. <strong>Внимание:</strong> в текущей версии 
                функционал автоматизаций доступен через подменю "Автоматизации" в модуле Контент-менеджмент.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Списки</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Управление списками данных, используемых в автоматизациях и конкурсах. Содержит три подраздела:
            </p>

            <div className="not-prose my-4">
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-purple-600 font-bold">•</span>
                        <span><strong>Системные</strong> — списки участников конкурсов, победители</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-purple-600 font-bold">•</span>
                        <span><strong>Пользовательские</strong> — ваши собственные списки (в разработке)</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                        <span className="text-purple-600 font-bold">•</span>
                        <span><strong>Автоматизации</strong> — списки для автоматических действий</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Особенности работы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Особенности работы панели</h2>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Всегда видна</h4>
                    <p className="text-sm text-gray-700">
                        Панель закреплена слева и не скрывается — вы всегда можете переключиться на другой модуль.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Активный модуль подсвечен</h4>
                    <p className="text-sm text-gray-700">
                        Иконка активного модуля имеет синий фон и более яркий цвет — легко понять, где вы находитесь.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Ховер-эффекты</h4>
                    <p className="text-sm text-gray-700">
                        При наведении курсора на иконку появляется серый фон — показывает интерактивность элемента.
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">Тултипы</h4>
                    <p className="text-sm text-gray-700">
                        Каждая иконка имеет всплывающую подсказку с названием модуля при наведении.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Права доступа */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Права доступа</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Не все иконки видны всем пользователям:
            </p>

            <div className="not-prose my-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div>
                            <p className="font-bold text-yellow-900 mb-1">Только для администраторов</p>
                            <p className="text-sm text-gray-700">
                                Иконка "Управление пользователями" видна только пользователям с ролью <code className="bg-yellow-100 px-1.5 py-0.5 rounded text-xs">admin</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="1-2-1-primary-sidebar" />
        </article>
    );
};
