import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * Обучающая страница: "2.4. Автоматизации"
 * 
 * Обзор раздела автоматизаций — описание всех доступных автоматизаций,
 * их назначение и сценарии использования.
 */

// =====================================================================
// Mock-компоненты для демонстрации интерфейсов автоматизаций
// =====================================================================

// Карточка автоматизации для навигации
interface AutomationCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    status?: 'active' | 'inactive';
    color: string;
    onClick?: () => void;
}

const MockAutomationCard: React.FC<AutomationCardProps> = ({ 
    title, 
    description, 
    icon, 
    status, 
    color,
    onClick 
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`bg-white rounded-lg border-2 p-5 transition-all cursor-pointer ${
                isHovered ? 'border-indigo-400 shadow-md transform -translate-y-1' : 'border-gray-200 shadow-sm'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="flex items-start gap-4">
                {/* Иконка */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
                    {icon}
                </div>

                {/* Контент */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-bold text-gray-900">{title}</h4>
                        {status && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                                status === 'active' 
                                    ? 'bg-green-100 text-green-700 border-green-200 animate-pulse' 
                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                                {status === 'active' ? 'Активен' : 'Остановлен'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
};

// Демонстрация переключателя автоматизации (из Stories Automation)
const MockToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isActive}
                onChange={onToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    );
};

// Пример статусного бейджа конкурса
interface StatusBadgeProps {
    status: 'active' | 'completed' | 'stopped';
}

const MockStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = {
        active: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', label: 'Активен', pulse: true },
        completed: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', label: 'Завершён', pulse: false },
        stopped: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200', label: 'Остановлен', pulse: false }
    };

    const { bg, text, border, label, pulse } = config[status];

    return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${bg} ${text} ${border} ${pulse ? 'animate-pulse' : ''}`}>
            {label}
        </span>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsAutomationsPage: React.FC<ContentProps> = ({ title }) => {
    const [demoToggle, setDemoToggle] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<'active' | 'completed' | 'stopped'>('active');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел <strong>"Автоматизации"</strong> — это набор инструментов, которые работают в фоновом режиме и выполняют рутинные задачи за вас. 
                Вместо того чтобы каждый день вручную публиковать посты в истории, отвечать участникам конкурсов или генерировать контент, система делает это автоматически.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем нужны автоматизации?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Было:</strong> SMM-специалист тратил 2-3 часа в день на однообразные действия — публикацию в истории, обработку отзывов конкурса, ответы победителям.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Стало:</strong> Настроил автоматизацию один раз — дальше всё происходит без участия человека. Система сама отслеживает новые посты, проверяет условия, публикует, отправляет сообщения.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> Все автоматизации работают на стороне сервера каждые 10 минут. 
                        Это значит, что вам не нужно держать приложение открытым — система работает круглосуточно.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Доступные автоматизации</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В приложении доступно несколько автоматизаций. Каждая решает конкретную задачу и настраивается независимо от других. 
                Некоторые автоматизации находятся на этапе планирования и пока не реализованы.
            </p>

            <Sandbox 
                title="Карточки автоматизаций"
                description="Вот как выглядят разделы автоматизаций. Наведите курсор на карточку, чтобы увидеть эффект."
                instructions={[
                    'Статус показывает, включена ли автоматизация',
                    'Зелёный бейдж «Активен» с анимацией означает, что система работает',
                    'Серый «Остановлен» — автоматизация выключена'
                ]}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MockAutomationCard
                        title="Посты в истории"
                        description="Автоматический репост подходящих записей в истории сообщества"
                        status="active"
                        color="bg-purple-100"
                        icon={
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        }
                    />

                    <MockAutomationCard
                        title="Конкурс отзывов"
                        description="Сбор отзывов с хештегом, автоматическая нумерация и выбор победителя"
                        status="inactive"
                        color="bg-amber-100"
                        icon={
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        }
                    />

                    <MockAutomationCard
                        title="Конкурсы"
                        description="Розыгрыши с различными условиями участия: репосты, лайки, комментарии"
                        color="bg-sky-100"
                        icon={
                            <svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                            </svg>
                        }
                    />

                    <MockAutomationCard
                        title="AI посты"
                        description="Автоматическая генерация постов с помощью искусственного интеллекта"
                        color="bg-indigo-100"
                        icon={
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        }
                    />

                    <MockAutomationCard
                        title="С др"
                        description="Автоматические поздравления подписчиков с днём рождения"
                        color="bg-rose-100"
                        icon={
                            <svg className="w-6 h-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                            </svg>
                        }
                    />

                    <MockAutomationCard
                        title="Конкурс Актив"
                        description="Конкурс на самого активного участника сообщества"
                        color="bg-emerald-100"
                        icon={
                            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        }
                    />
                </div>
            </Sandbox>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Общие элементы интерфейса</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Все автоматизации используют одинаковые паттерны интерфейса для включения/выключения и отображения статуса.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Переключатель активации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая автоматизация имеет переключатель для включения/выключения. Синий цвет означает «Включено», серый — «Выключено».
            </p>

            <Sandbox 
                title="Интерактивный переключатель"
                description="Попробуйте включить и выключить автоматизацию. Обратите внимание на плавную анимацию."
                instructions={[
                    'Кликните на переключатель, чтобы изменить состояние',
                    'Синий цвет = автоматизация работает',
                    'Серый цвет = автоматизация остановлена'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="max-w-lg">
                            <label className="text-sm font-medium text-gray-900 mb-1 block">
                                Статус автоматизации
                            </label>
                            <p className="text-sm text-gray-500">
                                Когда включено, система каждые 10 минут проверяет новые посты и выполняет настроенные действия автоматически.
                            </p>
                        </div>
                        <MockToggleSwitch isActive={demoToggle} onToggle={() => setDemoToggle(!demoToggle)} />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            <strong>Текущее состояние:</strong>{' '}
                            <span className={demoToggle ? 'text-green-600 font-bold' : 'text-gray-500'}>
                                {demoToggle ? 'Автоматизация активна' : 'Автоматизация остановлена'}
                            </span>
                        </p>
                    </div>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Статусные бейджи</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Статусные бейджи показывают текущее состояние автоматизации или конкурса. Они используются в заголовках страниц и карточках.
            </p>

            <Sandbox 
                title="Виды статусных бейджей"
                description="Выберите статус, чтобы увидеть как выглядит соответствующий бейдж."
                instructions={[
                    'Зелёный с анимацией — активный процесс (конкурс идёт, автоматизация работает)',
                    'Синий — завершённый конкурс',
                    'Серый — остановленная автоматизация или неактивный конкурс'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSelectedStatus('active')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === 'active'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Активен
                        </button>
                        <button
                            onClick={() => setSelectedStatus('completed')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === 'completed'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Завершён
                        </button>
                        <button
                            onClick={() => setSelectedStatus('stopped')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                selectedStatus === 'stopped'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Остановлен
                        </button>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">Так выглядит бейдж в интерфейсе:</p>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Конкурс отзывов:</span>
                            <MockStatusBadge status={selectedStatus} />
                        </div>
                    </div>
                </div>
            </Sandbox>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работать с автоматизациями</h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Откройте модуль "Контент-менеджмент"</strong> в главном сайдбаре (первая кнопка).
                </li>
                <li>
                    <strong>Разверните раздел "Автоматизации"</strong> и выберите нужную автоматизацию из выпадающего списка.
                </li>
                <li>
                    <strong>Настройте параметры:</strong> укажите условия, шаблоны текстов, расписание.
                </li>
                <li>
                    <strong>Включите автоматизацию</strong> переключателем в верхней части страницы.
                </li>
                <li>
                    <strong>Сохраните изменения</strong> кнопкой "Сохранить" или "Сохранить изменения" (цвет зависит от автоматизации: синий indigo-600 для историй, зелёный green-600 для конкурсов).
                </li>
            </ol>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> После включения автоматизации не забудьте нажать кнопку «Сохранить изменения». 
                        Без сохранения настройки не применятся, и автоматизация не начнёт работать.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующих разделах мы подробно разберём каждую автоматизацию: как она работает, как настроить, какие есть ограничения и типичные проблемы.
            </p>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        Начните с раздела <strong>"2.4.1. Посты в истории"</strong> — это самая простая автоматизация, 
                        которая поможет понять общую логику работы всех остальных.
                    </span>
                </p>
            </div>

            <NavigationButtons currentPath="2-4-automations" />
        </article>
    );
};
