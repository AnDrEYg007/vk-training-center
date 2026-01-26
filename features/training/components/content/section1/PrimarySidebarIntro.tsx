import React, { useState } from 'react';
import { ContentProps, NavigationLink, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации главной панели
// =====================================================================

interface IconButtonProps {
    label: string;
    isActive?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

const MockIconButton: React.FC<IconButtonProps> = ({ label, isActive = false, children, onClick }) => (
    <button
        title={label}
        onClick={onClick}
        className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer ${
            isActive 
            ? 'bg-indigo-50 text-indigo-600 shadow-sm scale-105' 
            : 'text-gray-400 hover:bg-gray-100 hover:text-indigo-600 hover:scale-105'
        }`}
    >
        {children}
    </button>
);

const MockPrimarySidebarFull: React.FC<{ activeIcon: string; onIconClick: (icon: string) => void }> = ({ activeIcon, onIconClick }) => {
    return (
        <div className="bg-white border-r border-gray-200 shadow-sm flex">
            {/* Колонка с иконками */}
            <div className="w-16 flex flex-col items-center justify-between py-4 bg-gray-50">
                {/* Верхняя группа: Модули */}
                <div className="space-y-4">
                    <MockIconButton label="Контент-менеджмент" isActive={activeIcon === 'km'} onClick={() => onIconClick('km')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Списки" isActive={activeIcon === 'lists'} onClick={() => onIconClick('lists')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Работа с сообщениями (в разработке)" isActive={activeIcon === 'am'} onClick={() => onIconClick('am')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Статистика (в разработке)" isActive={activeIcon === 'stats'} onClick={() => onIconClick('stats')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </MockIconButton>
                </div>

                {/* Нижняя группа: Глобальные действия */}
                <div className="space-y-4">
                    <MockIconButton label="База проектов" isActive={activeIcon === 'database'} onClick={() => onIconClick('database')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Центр обучения" isActive={activeIcon === 'training'} onClick={() => onIconClick('training')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Настройки" isActive={activeIcon === 'settings'} onClick={() => onIconClick('settings')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </MockIconButton>
                    <MockIconButton label="Выйти" isActive={false} onClick={() => onIconClick('logout')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </MockIconButton>
                </div>
            </div>

            {/* Вторая колонка с вкладками (всегда занимает место) */}
            <div className="w-44 bg-white border-r border-gray-200 py-4 px-3">
                {activeIcon === 'km' && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Контент</p>
                        <div className="space-y-1">
                            <button className="w-full text-left p-2 rounded-md text-sm bg-indigo-50 text-indigo-700 font-semibold">
                                Отложенные
                            </button>
                            <button className="w-full text-left p-2 rounded-md text-sm text-gray-500 hover:bg-gray-100">
                                Предложенные
                            </button>
                            <button className="w-full text-left p-2 rounded-md text-sm text-gray-500 hover:bg-gray-100">
                                Товары
                            </button>
                            <div className="mt-2">
                                <button className="w-full text-left p-2 rounded-md text-sm text-gray-700 font-semibold hover:bg-gray-100 flex justify-between items-center">
                                    <span>Автоматизации</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="pl-4 pt-1 space-y-0.5">
                                    <button className="w-full text-left p-1.5 rounded text-xs text-gray-500 hover:bg-gray-100">
                                        Посты в истории
                                    </button>
                                    <button className="w-full text-left p-1.5 rounded text-xs text-gray-500 hover:bg-gray-100">
                                        Конкурс отзывов
                                    </button>
                                    <button className="w-full text-left p-1.5 rounded text-xs text-gray-500 hover:bg-gray-100">
                                        Дроп промокодов
                                    </button>
                                    <button className="w-full text-left p-1.5 rounded text-xs text-gray-500 hover:bg-gray-100">
                                        Конкурсы
                                    </button>
                                    <button className="w-full text-left p-1.5 rounded text-xs text-gray-500 hover:bg-gray-100">
                                        AI посты
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeIcon === 'lists' && (
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Списки</p>
                        <div className="space-y-1">
                            <button className="w-full text-left p-2 rounded-md text-sm bg-indigo-50 text-indigo-700 font-semibold">
                                Системные
                            </button>
                            <button className="w-full text-left p-2 rounded-md text-sm text-gray-500 hover:bg-gray-100">
                                Пользовательские
                            </button>
                            <button className="w-full text-left p-2 rounded-md text-sm text-gray-500 hover:bg-gray-100">
                                Автоматизации
                            </button>
                        </div>
                    </div>
                )}
                {activeIcon !== 'km' && activeIcon !== 'lists' && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-xs text-gray-400 text-center px-2">
                            Нет подразделов
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
    rightPanel?: React.ReactNode;
}> = ({ title, description, children, instructions, rightPanel }) => (
    <div className="not-prose relative p-5 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-8">
        <h4 className="text-lg font-bold text-indigo-800 mb-1">{title}</h4>
        <p className="text-sm text-indigo-700 mb-4">{description}</p>
        
        <div className="flex gap-6">
            {/* Левая часть: интерактивный элемент */}
            <div className="flex-shrink-0">
                {children}
            </div>
            
            {/* Правая часть: инструкции или кастомный контент */}
            <div className="flex-1 min-w-0">
                {rightPanel ? rightPanel : (
                    instructions && instructions.length > 0 && (
                        <div className="bg-white rounded-lg border border-indigo-200 p-4 h-full">
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Попробуйте:</p>
                            <ul className="space-y-2 text-sm text-gray-700">
                                {instructions.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                )}
            </div>
        </div>
    </div>
);

// =====================================================================
// Основной компонент
// =====================================================================
export const PrimarySidebarIntro: React.FC<ContentProps> = ({ title }) => {
    const [activeIcon, setActiveIcon] = useState<string>('km');

    const getModuleName = (icon: string) => {
        const names: Record<string, string> = {
            'km': 'Контент-менеджмент',
            'am': 'Автоматизации',
            'lists': 'Списки',
            'database': 'База проектов',
            'training': 'Центр обучения',
            'logout': 'Выход'
        };
        return names[icon] || '';
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Это <strong>самая левая панель</strong> в приложении — узкая вертикальная полоска с иконками. 
                Она всегда видна и служит главным переключателем между модулями.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Функция:</strong> Переключение между основными разделами работы (контент, автоматизации, списки) 
                    и глобальными настройками (база проектов, обучение, выход).
                </p>
            </div>

            <hr className="!my-10" />

            {/* Структура */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура панели</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель состоит из <strong>двух групп иконок</strong>:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-indigo-900 text-lg">Верхняя группа</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Модули для работы с проектами:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span><strong>Контент-менеджмент</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span><strong>Списки</strong></span>
                        </li>
                        <li className="flex items-center gap-2 opacity-50">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span><strong>Работа с сообщениями</strong> <span className="text-xs text-gray-500">(в разработке)</span></span>
                        </li>
                        <li className="flex items-center gap-2 opacity-50">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span><strong>Статистика</strong> <span className="text-xs text-gray-500">(в разработке)</span></span>
                        </li>
                    </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-green-900 text-lg">Нижняя группа</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Глобальные разделы:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7s0 0 0 0m16 0s0 0 0 0M12 11a4 4 0 100-8 4 4 0 000 8zm0 0v10m0-10L8 7m4 4l4-4" />
                            </svg>
                            <span><strong>База проектов</strong></span>
                        </li>
                        <li className="flex items-center gap-2 opacity-50">
                            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span><strong>Управление пользователями</strong> <span className="text-xs text-gray-500">(только админ)</span></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <span><strong>Центр обучения</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span><strong>Настройки</strong></span>
                        </li>
                        <li className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span><strong>Выйти</strong></span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="Попробуйте сами: Взаимодействие с главной панелью"
                description="Кликайте на иконки, чтобы увидеть, как меняется интерфейс."
                instructions={[
                    '<strong>Кликните</strong> на иконки в верхней части — откроются разные модули.',
                    'При выборе модуля <strong>появляется вторая колонка</strong> с вкладками.',
                    'Активная иконка подсвечивается <strong>синим цветом</strong> и увеличивается.'
                ]}
                rightPanel={
                    <div className="bg-white rounded-lg border border-indigo-200 p-4 h-full flex flex-col">
                        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">Попробуйте:</p>
                        <ul className="space-y-2 text-sm text-gray-700 mb-4">
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <span><strong>Кликните</strong> на иконки в верхней части — откроются разные модули.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <span>При выборе модуля <strong>появляется вторая колонка</strong> с вкладками.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <span>Активная иконка подсвечивается <strong>синим</strong> и увеличивается.</span>
                            </li>
                        </ul>
                        <div className="mt-auto pt-3 border-t border-gray-200">
                            <p className="text-sm text-gray-700">
                                <strong>Активный модуль:</strong>{' '}
                                <span className="text-indigo-600 font-bold">{getModuleName(activeIcon)}</span>
                            </p>
                            {(activeIcon === 'km' || activeIcon === 'lists') && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Вторая колонка появляется только для модулей с подразделами.
                                </p>
                            )}
                        </div>
                    </div>
                }
            >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <MockPrimarySidebarFull activeIcon={activeIcon} onIconClick={setActiveIcon} />
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Подробнее о модулях */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Подробнее о модулях</h2>

            <div className="not-prose space-y-4 my-6">
                {/* Контент-менеджмент */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-indigo-900 text-lg mb-1">Контент-менеджмент (КМ)</h3>
                            <p className="text-sm text-gray-600 mb-3">Главный рабочий модуль для SMM-специалистов</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    Отложенные
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    Предложенные
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    Товары
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 rounded-full text-xs font-medium text-indigo-700">
                                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                                    Автоматизации
                                    <span className="text-gray-400 text-[10px]">+6</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Автоматизации */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-amber-900 text-lg">Работа с сообщениями (АМ)</h3>
                                <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold uppercase rounded">В разработке</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Модуль для работы с сообщениями сообщества. Функционал автоматизаций пока доступен через подменю в Контент-менеджменте.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Списки */}
                <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-purple-900 text-lg mb-1">Списки</h3>
                            <p className="text-sm text-gray-600 mb-3">Управление списками для автоматизаций и конкурсов</p>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Системные
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700 opacity-60">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                    Пользовательские
                                    <span className="text-[10px]">🔧</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-full text-xs font-medium text-purple-700">
                                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                    Автоматизации
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Особенности работы панели */}
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
                    <h4 className="font-bold text-purple-900 mb-2">Реакция на наведение</h4>
                    <p className="text-sm text-gray-700">
                        Наведите курсор на иконку — она подсветится серым. Так вы понимаете, что элемент кликабельный.
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">Подсказки при наведении</h4>
                    <p className="text-sm text-gray-700">
                        Задержите курсор на иконке — появится название модуля. Не нужно запоминать, что значит каждая иконка.
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

            <hr className="!my-10" />

            {/* Что дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь разберём остальные части интерфейса:
            </p>

            <div className="not-prose my-6 space-y-3">
                <NavigationLink 
                    to="1-2-2-projects-sidebar-intro"
                    title="1.2.2. Сайдбар проектов"
                    description="Вторая колонка со списком всех проектов"
                    variant="next"
                />
                <NavigationLink 
                    to="1-2-3-workspace-intro"
                    title="1.2.3. Рабочая область"
                    description="Основная часть экрана, где отображается контент"
                    variant="related"
                />
            </div>

            <NavigationButtons currentPath="1-2-1-primary-sidebar-intro" />
        </article>
    );
};
