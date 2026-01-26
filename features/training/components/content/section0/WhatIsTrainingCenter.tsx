import React, { useState } from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';
import { MockSidebarList } from '../SidebarMocks';

// =====================================================================
// Мок-компонент: Оглавление Центра обучения (точная копия TableOfContents)
// =====================================================================
const MockTableOfContents: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['section-0']);
    const [selectedItem, setSelectedItem] = useState<string>('0-1');

    const toggleSection = (id: string) => {
        setExpandedSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const sections = [
        { 
            id: 'section-0', 
            title: 'Раздел 0: О Центре обучения',
            items: [
                { id: '0-1', title: '0.1. Что такое Центр обучения?' },
                { id: '0-2', title: '0.2. Как работать с Центром' },
                { id: '0-3', title: '0.3. Что вы узнаете' },
            ]
        },
        { 
            id: 'section-1', 
            title: 'Раздел 1: Введение в приложение',
            items: [
                { id: '1-1', title: '1.1. Что такое Планировщик?' },
                { id: '1-2', title: '1.2. Знакомство с интерфейсом' },
            ]
        },
        { 
            id: 'section-2', 
            title: 'Раздел 2: Модуль "Контент-менеджмент"',
            items: [
                { id: '2-1', title: '2.1. Вкладка "Отложенные"' },
                { id: '2-2', title: '2.2. Вкладка "Предложенные"' },
            ]
        },
    ];

    // Стили из реального TableOfContents
    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-72">
            <div className="overflow-y-auto custom-scrollbar max-h-80">
                {sections.map(section => (
                    <div key={section.id}>
                        {/* Заголовок раздела - кликабельный */}
                        <button 
                            onClick={() => toggleSection(section.id)}
                            className="w-full text-left px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between border-b border-gray-100"
                        >
                            <span>{section.title}</span>
                            <svg 
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSections.includes(section.id) ? 'rotate-90' : ''}`} 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        {/* Подразделы */}
                        {expandedSections.includes(section.id) && (
                            <div className="bg-gray-50">
                                {section.items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedItem(item.id)}
                                        className={`w-full text-left px-6 py-2 text-sm transition-colors ${
                                            selectedItem === item.id 
                                                ? 'bg-indigo-50 text-indigo-700 font-medium border-l-2 border-indigo-600' 
                                                : 'text-gray-600 hover:bg-gray-100 border-l-2 border-transparent'
                                        }`}
                                    >
                                        {item.title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// =====================================================================
// Мок-компонент: Интерактивная песочница
// =====================================================================
const InteractiveSandboxDemo: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    return (
        <div className="space-y-4">
            {/* Демо: Кликабельный элемент */}
            <div 
                onClick={() => setClickCount(c => c + 1)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Кликните на меня!</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                        Кликов: {clickCount}
                    </span>
                </div>
            </div>

            {/* Демо: Разворачивающийся текст (как в PostCard) */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Разворачивающийся текст</span>
                        <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <p className={`text-sm text-gray-600 transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-40' : 'max-h-5'}`}>
                        Это пример текста, который можно развернуть и свернуть. В реальном приложении такая механика используется для карточек постов — 
                        вы можете быстро просмотреть содержимое, не открывая модальное окно редактирования. Кликните еще раз, чтобы свернуть.
                    </p>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент: Что такое Центр обучения
// =====================================================================
export const WhatIsTrainingCenter: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            {/* Приветствие */}
            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-indigo-800 mb-2">Добро пожаловать в Центр обучения!</h2>
                <p className="text-indigo-700">
                    Здесь вы найдёте всё, что нужно для эффективной работы с Планировщиком контента — 
                    от базовых понятий до продвинутых техник автоматизации.
                </p>
            </div>

            {/* Что это такое */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое Центр обучения?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Центр обучения</strong> — это интерактивная документация к приложению "Планировщик контента". 
                В отличие от обычных инструкций, здесь вы не только читаете текст, но и <strong>можете взаимодействовать 
                с элементами интерфейса</strong> прямо на страницах документации.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый раздел содержит:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Текстовые объяснения</strong> — подробные описания функций и механик</li>
                <li><strong>Визуальные примеры</strong> — скриншоты и mock-компоненты реального интерфейса</li>
                <li><strong>Интерактивные песочницы</strong> — элементы, с которыми можно взаимодействовать</li>
            </ul>

            <hr className="!my-10" />

            {/* Интерактивные песочницы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивные песочницы</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В каждом разделе вы найдёте <strong>песочницы</strong> — специальные блоки с пунктирной рамкой индиго-цвета, 
                где можно попробовать функции интерфейса. Они выглядят так:
            </p>

            <Sandbox 
                title="Пример интерактивной песочницы" 
                description="Попробуйте взаимодействовать с элементами ниже:"
                instructions={[
                    '<strong>Кликните</strong> на первый блок несколько раз — счётчик увеличится.',
                    '<strong>Кликните</strong> на второй блок — текст развернётся.',
                ]}
            >
                <InteractiveSandboxDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Навигация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Навигация по Центру обучения</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Слева вы видите <strong>оглавление</strong> — дерево разделов и подразделов. 
                Кликайте на заголовки разделов, чтобы развернуть или свернуть их. 
                Выбирайте нужный подраздел — и его содержимое появится справа.
            </p>

            <Sandbox 
                title="Пример оглавления" 
                description="Это уменьшенная копия оглавления. Кликайте на разделы, чтобы развернуть их, и на подразделы, чтобы выбрать."
            >
                <MockTableOfContents />
            </Sandbox>

            <hr className="!my-10" />

            {/* Для кого */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Для кого этот раздел?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Центр обучения будет полезен всем пользователям системы:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Новичкам</strong> — чтобы быстро освоить основы и начать работать</li>
                <li><strong>Опытным пользователям</strong> — чтобы узнать о скрытых возможностях и механиках</li>
                <li><strong>Администраторам</strong> — чтобы разобраться в настройках и управлении командой</li>
            </ul>

            {/* Совет */}
            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Совет:</strong> Не пытайтесь запомнить всё сразу! 
                    Используйте Центр обучения как справочник — возвращайтесь к нужным разделам по мере необходимости. 
                    Оглавление слева всегда поможет быстро найти нужную информацию.
                </p>
            </div>

            <NavigationButtons currentPath="0-1-what-is-training-center" />
        </article>
    );
};
