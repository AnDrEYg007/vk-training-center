import React, { useState } from 'react';
import { NavigationButtons } from './shared';

// =====================================================================
// Вспомогательный компонент Sandbox
// =====================================================================
const Sandbox: React.FC<{ 
    title: string; 
    description: string; 
    children: React.ReactNode;
    instructions?: string[];
}> = ({ title, description, children, instructions }) => (
    <div className="relative not-prose p-6 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 mt-8">
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
// Мок-компонент: Главная навигационная панель
// =====================================================================
const MockPrimarySidebar: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('calendar');
    
    const menuItems = [
        { id: 'calendar', icon: '📅', label: 'Отложенные', description: 'Календарь с постами' },
        { id: 'suggested', icon: '📥', label: 'Предложенные', description: 'Посты от подписчиков' },
        { id: 'products', icon: '🛍️', label: 'Товары', description: 'Управление товарами' },
        { id: 'automations', icon: '⚙️', label: 'Автоматизации', description: 'Конкурсы и боты' },
        { id: 'lists', icon: '📋', label: 'Списки', description: 'Пользователи и активность' },
        { id: 'projects', icon: '🏢', label: 'Проекты', description: 'База данных проектов' },
        { id: 'settings', icon: '⚡', label: 'Настройки', description: 'Администрирование' },
    ];

    return (
        <div className="bg-gray-900 rounded-lg p-2 w-20">
            <div className="space-y-1">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className={`w-full p-3 rounded-lg text-center transition-all duration-200 group relative ${
                            activeItem === item.id 
                                ? 'bg-indigo-600 text-white' 
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`}
                        title={item.label}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {/* Тултип */}
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            {item.label}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// =====================================================================
// Мок-компонент: Карточка поста
// =====================================================================
const MockPostCardSmall: React.FC<{ type: 'system' | 'vk' | 'published'; time: string; hasImages?: boolean }> = ({ type, time, hasImages = true }) => {
    const borderStyle = type === 'system' ? 'border-dashed border-2 border-indigo-400' : 
                        type === 'vk' ? 'border-2 border-indigo-500' : 
                        'border border-gray-300 bg-gray-50';
    const label = type === 'system' ? 'Системный' : type === 'vk' ? 'Отложка VK' : 'Опубликован';
    const labelColor = type === 'system' ? 'bg-indigo-100 text-indigo-700' : 
                       type === 'vk' ? 'bg-blue-100 text-blue-700' : 
                       'bg-green-100 text-green-700';

    return (
        <div className={`rounded-lg p-2 ${borderStyle} bg-white`}>
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">{time}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${labelColor}`}>{label}</span>
            </div>
            {hasImages && (
                <div className="w-full h-12 bg-gradient-to-br from-indigo-200 to-purple-200 rounded mb-1" />
            )}
            <p className="text-xs text-gray-600 truncate">Пример текста поста...</p>
        </div>
    );
};

// =====================================================================
// Мок-компонент: Мини-календарь
// =====================================================================
const MockMiniCalendar: React.FC = () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    
    return (
        <div className="bg-white rounded-lg border p-3">
            <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-700">Январь 2026</span>
                <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-500">◀</button>
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-500">▶</button>
                </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map(d => (
                    <div key={d} className="text-xs text-gray-400 font-medium py-1">{d}</div>
                ))}
                {/* Колонки с постами */}
                <div className="col-span-7 grid grid-cols-7 gap-1">
                    {[20, 21, 22, 23, 24, 25, 26].map(day => (
                        <div key={day} className="space-y-1">
                            <div className="text-xs text-gray-600 text-center py-1 font-medium">{day}</div>
                            {day === 21 && <MockPostCardSmall type="vk" time="10:00" />}
                            {day === 22 && <MockPostCardSmall type="system" time="15:00" />}
                            {day === 23 && <MockPostCardSmall type="published" time="12:00" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Мок-компонент: Интерактивный пример песочницы
// =====================================================================
const InteractiveSandboxDemo: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    return (
        <div className="space-y-4">
            {/* Демо: Кликабельный элемент */}
            <div 
                onClick={() => setClickCount(c => c + 1)}
                className="bg-white border-2 border-dashed border-indigo-300 rounded-lg p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">👆 Кликните на меня!</span>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        Кликов: {clickCount}
                    </span>
                </div>
            </div>

            {/* Демо: Разворачивающийся текст */}
            <div className="bg-white border rounded-lg p-4">
                <div 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">📖 Разворачивающийся текст</span>
                        <span className={`text-indigo-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
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
// Мок-компонент: Пример оглавления
// =====================================================================
const MockTableOfContents: React.FC = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['section-1']);
    const [selectedItem, setSelectedItem] = useState<string>('1-1');

    const toggleSection = (id: string) => {
        setExpandedSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const sections = [
        { 
            id: 'section-0', 
            title: '📚 Раздел 0: О Центре обучения',
            items: [
                { id: '0-1', title: '0.1. Что такое Центр обучения?' },
                { id: '0-2', title: '0.2. Как работать с Центром' },
            ]
        },
        { 
            id: 'section-1', 
            title: '🚀 Раздел 1: Введение',
            items: [
                { id: '1-1', title: '1.1. Что такое Планировщик?' },
                { id: '1-2', title: '1.2. Знакомство с интерфейсом' },
            ]
        },
        { 
            id: 'section-2', 
            title: '📅 Раздел 2: Контент-менеджмент',
            items: [
                { id: '2-1', title: '2.1. Вкладка "Отложенные"' },
                { id: '2-2', title: '2.2. Вкладка "Предложенные"' },
            ]
        },
    ];

    return (
        <div className="bg-white border rounded-lg p-3 w-64">
            <div className="space-y-1">
                {sections.map(section => (
                    <div key={section.id}>
                        <button 
                            onClick={() => toggleSection(section.id)}
                            className="w-full text-left px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded flex items-center justify-between"
                        >
                            <span>{section.title}</span>
                            <span className={`text-gray-400 transition-transform ${expandedSections.includes(section.id) ? 'rotate-90' : ''}`}>▶</span>
                        </button>
                        {expandedSections.includes(section.id) && (
                            <div className="ml-4 border-l-2 border-gray-200 pl-2 space-y-1">
                                {section.items.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedItem(item.id)}
                                        className={`w-full text-left px-2 py-1.5 text-sm rounded transition-colors ${
                                            selectedItem === item.id 
                                                ? 'bg-indigo-100 text-indigo-700 font-medium' 
                                                : 'text-gray-600 hover:bg-gray-50'
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
// Мок-компонент: Пример карточки товара
// =====================================================================
const MockProductCard: React.FC = () => (
    <div className="bg-white border rounded-lg p-3 w-48">
        <div className="w-full h-24 bg-gradient-to-br from-pink-200 to-orange-200 rounded-lg mb-2 flex items-center justify-center text-3xl">
            🛍️
        </div>
        <h4 className="text-sm font-medium text-gray-800 truncate">Название товара</h4>
        <p className="text-xs text-gray-500 truncate">Категория товара</p>
        <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-indigo-600">1 500 ₽</span>
            <span className="text-xs text-gray-400 line-through">2 000 ₽</span>
        </div>
    </div>
);

// =====================================================================
// Мок-компонент: Пример конкурса
// =====================================================================
const MockContestCard: React.FC = () => (
    <div className="bg-white border rounded-lg p-4 w-64">
        <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-lg flex items-center justify-center text-xl">
                🏆
            </div>
            <div>
                <h4 className="text-sm font-medium text-gray-800">Конкурс отзывов</h4>
                <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Активен</span>
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">24</div>
                <div className="text-xs text-gray-500">Участников</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">5</div>
                <div className="text-xs text-gray-500">Победителей</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
                <div className="text-lg font-bold text-gray-800">12</div>
                <div className="text-xs text-gray-500">Промокодов</div>
            </div>
        </div>
    </div>
);

// =====================================================================
// Карточка "Что вы узнаете"
// =====================================================================
const LearnCard: React.FC<{ icon: string; title: string; description: string; items: string[] }> = ({ icon, title, description, items }) => (
    <div className="bg-white border rounded-xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{icon}</span>
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        <ul className="text-sm text-gray-600 space-y-1">
            {items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">✓</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

// =====================================================================
// Карточка условного обозначения
// =====================================================================
const LegendItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-3 p-3 bg-white border rounded-lg">
        <div className="flex-shrink-0">{icon}</div>
        <div>
            <h5 className="text-sm font-medium text-gray-800">{title}</h5>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    </div>
);

// =====================================================================
// Основной компонент
// =====================================================================
interface ContentProps {
    title: string;
}

export const AboutTrainingCenter: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            {/* Приветствие */}
            <div className="not-prose bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
                <h2 className="text-2xl font-bold mb-2">👋 Добро пожаловать в Центр обучения!</h2>
                <p className="text-indigo-100 text-lg">
                    Здесь вы найдёте всё, что нужно для эффективной работы с Планировщиком контента — 
                    от базовых понятий до продвинутых техник автоматизации.
                </p>
            </div>

            {/* Что это такое */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">🎯 Что такое Центр обучения?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Центр обучения</strong> — это интерактивная документация к приложению "Планировщик контента". 
                В отличие от обычных инструкций, здесь вы не только читаете текст, но и <strong>можете взаимодействовать 
                с элементами интерфейса</strong> прямо на страницах документации.
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <span className="text-3xl mb-2 block">📖</span>
                    <h4 className="font-semibold text-blue-800">Читайте</h4>
                    <p className="text-sm text-blue-600">Подробные объяснения каждой функции</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <span className="text-3xl mb-2 block">👀</span>
                    <h4 className="font-semibold text-green-800">Смотрите</h4>
                    <p className="text-sm text-green-600">Визуальные примеры интерфейса</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <span className="text-3xl mb-2 block">🖱️</span>
                    <h4 className="font-semibold text-purple-800">Пробуйте</h4>
                    <p className="text-sm text-purple-600">Интерактивные демо-элементы</p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Для кого */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">👥 Для кого этот раздел?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Центр обучения будет полезен всем пользователям системы:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Новичкам</strong> — чтобы быстро освоить основы и начать работать</li>
                <li><strong>Опытным пользователям</strong> — чтобы узнать о скрытых возможностях и горячих клавишах</li>
                <li><strong>Администраторам</strong> — чтобы разобраться в настройках и управлении командой</li>
            </ul>

            <hr className="!my-10" />

            {/* Как работать с Центром обучения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">🧭 Как работать с Центром обучения</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Навигация по оглавлению</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Слева вы видите <strong>оглавление</strong> — дерево разделов и подразделов. 
                Кликайте на заголовки разделов, чтобы развернуть или свернуть их. 
                Выбирайте нужный подраздел — и его содержимое появится в этой области.
            </p>

            <Sandbox 
                title="Попробуйте сами: Навигация" 
                description="Это уменьшенная копия оглавления. Кликайте на разделы, чтобы развернуть их, и на подразделы, чтобы выбрать."
            >
                <MockTableOfContents />
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Интерактивные песочницы</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В каждом разделе вы найдёте <strong>песочницы</strong> — специальные блоки с пунктирной рамкой, 
                где можно попробовать функции интерфейса. Они выглядят так:
            </p>

            <Sandbox 
                title="Пример песочницы" 
                description="Попробуйте взаимодействовать с элементами ниже:"
                instructions={[
                    '<strong>Кликните</strong> на первый блок несколько раз — счётчик увеличится.',
                    '<strong>Кликните</strong> на второй блок — текст развернётся.',
                ]}
            >
                <InteractiveSandboxDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Примеры из интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">🖼️ Примеры из реального интерфейса</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Чтобы вы сразу понимали, как выглядят элементы в реальном приложении, 
                мы показываем <strong>mock-версии</strong> (упрощённые копии) реальных компонентов:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Главная навигационная панель</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Это боковая панель слева, которая позволяет переключаться между основными разделами приложения.
            </p>

            <Sandbox 
                title="Главная навигация" 
                description="Кликайте на иконки, чтобы переключаться между разделами. Наведите курсор, чтобы увидеть подсказки."
            >
                <MockPrimarySidebar />
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Три типа постов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В календаре вы увидите посты с разными рамками — каждая означает свой тип:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div>
                    <MockPostCardSmall type="system" time="10:00" />
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        <strong>Системный пост</strong> — создан в планировщике, ждёт отправки
                    </p>
                </div>
                <div>
                    <MockPostCardSmall type="vk" time="15:00" />
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        <strong>Отложка VK</strong> — уже в очереди VK
                    </p>
                </div>
                <div>
                    <MockPostCardSmall type="published" time="12:00" />
                    <p className="text-sm text-gray-600 mt-2 text-center">
                        <strong>Опубликован</strong> — уже на стене сообщества
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что вы узнаете */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">📚 Что вы узнаете</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Центр обучения охватывает все аспекты работы с приложением:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <LearnCard 
                    icon="📅"
                    title="Управление контентом"
                    description="Всё о создании, планировании и публикации постов"
                    items={[
                        'Работа с календарём отложенных постов',
                        'Модерация предложенных постов',
                        'Использование AI для генерации текстов',
                        'Drag-and-Drop перемещение постов',
                    ]}
                />
                <LearnCard 
                    icon="🛍️"
                    title="Работа с товарами"
                    description="Массовое редактирование каталога VK"
                    items={[
                        'Импорт/экспорт товаров (CSV, XLSX)',
                        'Массовое редактирование цен и описаний',
                        'AI-коррекция описаний',
                        'Управление категориями и альбомами',
                    ]}
                />
                <LearnCard 
                    icon="⚙️"
                    title="Автоматизации и конкурсы"
                    description="Настройка ботов и игровых механик"
                    items={[
                        'Конкурсы отзывов с промокодами',
                        'Автопубликация постов в истории',
                        'Поздравления с днём рождения',
                        'AI-посты по расписанию',
                    ]}
                />
                <LearnCard 
                    icon="🔧"
                    title="Администрирование"
                    description="Управление системой и пользователями"
                    items={[
                        'Настройка проектов и команд',
                        'Управление VK-токенами',
                        'Системные аккаунты и AI-токены',
                        'Просмотр логов и задач',
                    ]}
                />
            </div>

            {/* Примеры элементов */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Примеры элементов интерфейса</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот как выглядят некоторые элементы, с которыми вы будете работать:
            </p>

            <div className="not-prose flex flex-wrap gap-4 my-6 items-start">
                <MockProductCard />
                <MockContestCard />
            </div>

            <hr className="!my-10" />

            {/* Условные обозначения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">🏷️ Условные обозначения</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                В документации и интерфейсе используются единые обозначения:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Цвета счётчиков</h3>
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                <LegendItem 
                    icon={<span className="bg-gradient-to-t from-gray-300 to-red-200 text-red-900 text-xs px-2 py-1 rounded-full font-medium">0</span>}
                    title="Красный: Нет контента"
                    description="В проекте нет постов — пора за работу!"
                />
                <LegendItem 
                    icon={<span className="bg-gradient-to-t from-gray-300 to-orange-200 text-orange-900 text-xs px-2 py-1 rounded-full font-medium">3</span>}
                    title="Оранжевый: Мало (1-4)"
                    description="Контент есть, но его немного"
                />
                <LegendItem 
                    icon={<span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">7</span>}
                    title="Серый: Достаточно (5-10)"
                    description="Хороший запас контента"
                />
                <LegendItem 
                    icon={<span className="bg-gradient-to-t from-gray-300 to-green-200 text-green-900 text-xs px-2 py-1 rounded-full font-medium">15</span>}
                    title="Зелёный: Много (11+)"
                    description="Отлично! Контента достаточно"
                />
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Типы рамок постов</h3>
            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                <LegendItem 
                    icon={<div className="w-8 h-8 border-2 border-dashed border-indigo-400 rounded" />}
                    title="Пунктирная"
                    description="Системный пост (ещё не в VK)"
                />
                <LegendItem 
                    icon={<div className="w-8 h-8 border-2 border-solid border-indigo-500 rounded" />}
                    title="Сплошная"
                    description="Отложенный пост VK"
                />
                <LegendItem 
                    icon={<div className="w-8 h-8 border border-gray-300 bg-gray-50 rounded" />}
                    title="Тонкая серая"
                    description="Опубликованный пост"
                />
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Иконки действий</h3>
            <div className="not-prose grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                <LegendItem icon={<span className="text-xl">✏️</span>} title="Редактировать" description="Открыть для изменения" />
                <LegendItem icon={<span className="text-xl">📋</span>} title="Копировать" description="Создать копию" />
                <LegendItem icon={<span className="text-xl">🗑️</span>} title="Удалить" description="Удалить элемент" />
                <LegendItem icon={<span className="text-xl">🔄</span>} title="Обновить" description="Синхронизировать с VK" />
            </div>

            <hr className="!my-10" />

            {/* Быстрый старт */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">🚀 Быстрый старт</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Готовы начать? Вот три простых сценария для первого знакомства:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-white border-l-4 border-indigo-500 rounded-r-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 text-sm px-2 py-0.5 rounded">Сценарий 1</span>
                        Создание первого поста
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Выберите проект → Кликните на пустой слот в календаре → Заполните текст и добавьте фото → Сохраните
                    </p>
                    <p className="text-xs text-indigo-600 mt-2">→ Перейти к разделу: 2.1.8. Операции с постами</p>
                </div>

                <div className="bg-white border-l-4 border-green-500 rounded-r-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 text-sm px-2 py-0.5 rounded">Сценарий 2</span>
                        Планирование на неделю
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Откройте календарь → Используйте режим "Неделя" → Drag-and-Drop для распределения постов → Копируйте удачные посты
                    </p>
                    <p className="text-xs text-green-600 mt-2">→ Перейти к разделу: 2.1.3. Сетка календаря</p>
                </div>

                <div className="bg-white border-l-4 border-purple-500 rounded-r-lg p-4 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 text-sm px-2 py-0.5 rounded">Сценарий 3</span>
                        Работа с предложенными постами
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                        Перейдите на вкладку "Предложенные" → Просмотрите посты от подписчиков → Отредактируйте с AI → Запланируйте публикацию
                    </p>
                    <p className="text-xs text-purple-600 mt-2">→ Перейти к разделу: 2.2. Вкладка "Предложенные"</p>
                </div>
            </div>

            {/* Заключение */}
            <div className="not-prose bg-gray-50 border rounded-xl p-6 mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Совет</h3>
                <p className="text-gray-600">
                    Не пытайтесь запомнить всё сразу! Используйте Центр обучения как справочник — 
                    возвращайтесь к нужным разделам по мере необходимости. Оглавление слева всегда поможет 
                    быстро найти нужную информацию.
                </p>
            </div>

            <NavigationButtons currentPath="0-about-training-center" />
        </article>
    );
};
