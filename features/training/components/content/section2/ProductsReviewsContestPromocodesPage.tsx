import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Inline компоненты для демонстрации
// =====================================================================

// Демо: Форма загрузки промокодов
const UploadFormDemo: React.FC = () => {
    const [inputValue, setInputValue] = useState('PROMO123 | Скидка 500₽\nSALE30OFF | Скидка 30%\nFREESHIP | Бесплатная доставка');

    return (
        <div className="w-full bg-white p-4 rounded-lg shadow border border-gray-200 flex flex-col h-96">
            <h3 className="font-semibold text-gray-800 mb-2">Загрузка кодов</h3>
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs text-blue-800">
                <p className="font-semibold mb-1">Формат загрузки:</p>
                <p className="font-mono bg-white/50 p-1 rounded mb-1">КОД | ОПИСАНИЕ ПРИЗА</p>
                <p>Каждая пара с новой строки. Описание будет использовано в переменной <code>{'{description}'}</code>.</p>
                <p className="mt-2 text-blue-600 italic">💡 Совет: Вы можете скопировать два столбца прямо из Excel и вставить сюда — формат исправится автоматически.</p>
            </div>
            <textarea 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full flex-grow border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 custom-scrollbar font-mono resize-none"
                placeholder="PROMO123 | Скидка 500р&#10;PROMO456 | Сет роллов&#10;WIN_777 | Пицца в подарок"
            />
            <button 
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm"
            >
                Загрузить в базу
            </button>
        </div>
    );
};

// Демо: Иконки действий
const ActionIconsDemo: React.FC = () => {
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    const icons = [
        {
            id: 'edit',
            name: 'Редактировать',
            color: 'text-gray-400 hover:text-indigo-600',
            description: 'Изменить описание приза. Появляется при наведении курсора на свободный промокод.',
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
        },
        {
            id: 'save',
            name: 'Сохранить',
            color: 'text-green-600 hover:text-green-800',
            description: 'Подтвердить изменение описания. Также можно нажать Enter в поле ввода.',
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        },
        {
            id: 'cancel',
            name: 'Отмена',
            color: 'text-red-500 hover:text-red-700',
            description: 'Отменить редактирование. Также можно нажать Escape.',
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        },
        {
            id: 'chat',
            name: 'Диалог',
            color: 'text-gray-400 hover:text-indigo-600',
            description: 'Открыть переписку с победителем в ВК. Доступно только для выданных промокодов.',
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        },
        {
            id: 'delete',
            name: 'Удалить',
            color: 'text-gray-400 hover:text-red-600',
            description: 'Удалить промокод из базы. Доступно только для свободных (не выданных) промокодов.',
            svg: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Наведите курсор на иконку:</p>
                <div className="flex gap-4 flex-wrap">
                    {icons.map(icon => (
                        <button
                            key={icon.id}
                            onMouseEnter={() => setActiveIcon(icon.id)}
                            onMouseLeave={() => setActiveIcon(null)}
                            className={`p-2 rounded transition-colors ${icon.color}`}
                            title={icon.name}
                        >
                            {icon.svg}
                        </button>
                    ))}
                </div>
            </div>

            {activeIcon && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-sm text-indigo-900">
                    <p><strong>{icons.find(i => i.id === activeIcon)?.name}:</strong> {icons.find(i => i.id === activeIcon)?.description}</p>
                </div>
            )}
        </div>
    );
};

// Демо: Статусы промокодов
const StatusesDemo: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<'free' | 'issued'>('free');

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Выберите статус:</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSelectedStatus('free')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'free'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Свободен
                    </button>
                    <button
                        onClick={() => setSelectedStatus('issued')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'issued'
                                ? 'bg-gray-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Выдан
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Отображение в таблице:</p>
                {selectedStatus === 'free' ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                        Свободен
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Выдан
                    </span>
                )}
                <div className="mt-3 text-sm text-gray-700">
                    {selectedStatus === 'free' ? (
                        <>
                            <p className="font-semibold text-green-700">✓ Промокод в запасе</p>
                            <p className="text-xs text-gray-500 mt-1">Этот код еще не выдан победителю. Его можно редактировать, удалить или он будет автоматически использован при следующем розыгрыше.</p>
                            <p className="text-xs text-gray-500 mt-2"><strong>Доступные действия:</strong> редактирование описания, удаление, выделение чекбоксом для массового удаления.</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-gray-700">✓ Промокод вручен победителю</p>
                            <p className="text-xs text-gray-500 mt-1">Этот код уже использован в розыгрыше. Показывает кому выдан, когда и можно открыть диалог с победителем.</p>
                            <p className="text-xs text-gray-500 mt-2"><strong>Доступные действия:</strong> просмотр информации о победителе, переход в диалог ВК. Редактирование и удаление недоступны.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestPromocodesPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Промокоды" — это <strong>база призов</strong> для конкурса отзывов. 
                Здесь вы загружаете коды (промокоды на скидку, купоны, подарочные сертификаты), которые система будет автоматически выдавать победителям розыгрышей.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Без этой базы конкурс не запустится — система не сможет наградить победителя. 
                Промокоды загружаются один раз, а дальше расходуются автоматически при каждом розыгрыше.
            </p>

            <hr className="!my-10" />

            {/* Было/Стало */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как было раньше vs как стало</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Было */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center text-2xl">❌</div>
                        <h3 className="text-xl font-bold text-red-900">Без системы</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-red-800">
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Промокоды хранились в Excel-файле или блокноте</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Вручную искали свободный код перед каждым розыгрышем</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Отмечали выданные коды вручную — легко было ошибиться и выдать один код дважды</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Не было контроля запаса — могли закончиться промокоды в самый неожиданный момент</span>
                        </li>
                    </ul>
                </div>

                {/* Стало */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-2xl">✅</div>
                        <h3 className="text-xl font-bold text-green-900">С системой</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Загружаете всю партию промокодов разом (можно прямо из Excel)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Система сама выбирает свободный код при розыгрыше</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Выданные коды автоматически помечаются — невозможно выдать дважды</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Счётчик показывает сколько кодов осталось — видно когда нужно догрузить</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Структура интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура интерфейса: 2 колонки</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс промокодов разделён на <strong>две части</strong>:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-bold text-indigo-900 mb-2">📝 Левая колонка (1/3 ширины)</h3>
                    <p className="text-sm text-indigo-800 mb-2"><strong>Форма загрузки</strong></p>
                    <ul className="text-xs text-indigo-700 space-y-1 list-disc list-inside">
                        <li>Textarea для ввода промокодов</li>
                        <li>Подсказка формата (голубой блок)</li>
                        <li>Кнопка "Загрузить в базу"</li>
                        <li>Автоматическая обработка вставки из Excel</li>
                    </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-2">📊 Правая колонка (2/3 ширины)</h3>
                    <p className="text-sm text-gray-800 mb-2"><strong>Таблица с промокодами</strong></p>
                    <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                        <li>7 колонок: Чекбокс, Код, Описание, Статус, Кому выдан, Диалог, Удалить</li>
                        <li>Счётчики: Всего / Свободно / Выдано</li>
                        <li>Редактирование описания (появляется при наведении)</li>
                        <li>Массовое удаление через чекбоксы</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Формат загрузки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Формат загрузки промокодов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Промокоды загружаются в формате <code className="bg-gray-100 px-2 py-1 rounded text-sm">КОД | ОПИСАНИЕ</code>, 
                где вертикальная черта разделяет сам промокод и его описание (что получит победитель).
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm font-semibold text-blue-900 mb-2">Пример правильного формата:</p>
                <pre className="bg-white/50 p-3 rounded font-mono text-xs text-blue-800 overflow-x-auto custom-scrollbar">
PROMO500 | Скидка 500₽ на заказ{'\n'}
SALE30OFF | Скидка 30% на всё меню{'\n'}
FREESHIP | Бесплатная доставка{'\n'}
BIRTHDAY20 | Подарок на день рождения
                </pre>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>💡 Секретная фича:</strong> Система автоматически распознаёт данные из Excel! 
                    Просто скопируйте два столбца (код + описание) и вставьте в форму — табуляция между ними преобразуется в вертикальную черту автоматически.
                </p>
                <p className="text-xs text-green-700 mt-2">
                    Это работает благодаря обработчику <code>handlePasteCodes</code> в хуке <code>usePromocodesManager</code> (строки 44-64).
                </p>
            </div>

            <hr className="!my-10" />

            {/* Sandbox 1: Форма загрузки */}
            <Sandbox
                title="📝 Интерактивная форма загрузки"
                description="Попробуйте изменить текст в поле ввода. Обратите внимание на формат подсказки и цветовую схему (indigo-600 для кнопки)."
                instructions={[
                    'Формат <code>КОД | ОПИСАНИЕ</code> — каждая пара с новой строки',
                    'Голубая подсказка (bg-blue-50) объясняет формат загрузки',
                    'Кнопка "Загрузить в базу" использует цвет indigo-600 (фирменный цвет интерактивных элементов)',
                    'Textarea имеет моноширинный шрифт (<code>font-mono</code>) для удобства'
                ]}
            >
                <UploadFormDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Таблица промокодов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Таблица промокодов: 7 колонок</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица показывает все загруженные промокоды и их текущее состояние:
            </p>

            <div className="not-prose my-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Колонка</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Ширина</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Что показывает</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Чекбокс</td>
                                <td className="px-4 py-3 text-gray-500">w-10</td>
                                <td className="px-4 py-3 text-gray-700">Выбор для массового удаления (только свободные)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Код</td>
                                <td className="px-4 py-3 text-gray-500">w-40</td>
                                <td className="px-4 py-3 text-gray-700">Сам промокод (моноширинный шрифт)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Описание</td>
                                <td className="px-4 py-3 text-gray-500">-</td>
                                <td className="px-4 py-3 text-gray-700">Описание приза (редактируемое поле)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Статус</td>
                                <td className="px-4 py-3 text-gray-500">w-28</td>
                                <td className="px-4 py-3 text-gray-700">Бейдж "Свободен" (зелёный) или "Выдан" (серый)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Кому выдан</td>
                                <td className="px-4 py-3 text-gray-500">w-48</td>
                                <td className="px-4 py-3 text-gray-700">Имя победителя + ID + дата выдачи (если выдан)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Диалог</td>
                                <td className="px-4 py-3 text-gray-500">w-24</td>
                                <td className="px-4 py-3 text-gray-700">Иконка чата (открывает переписку с победителем)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Удалить</td>
                                <td className="px-4 py-3 text-gray-500">w-10</td>
                                <td className="px-4 py-3 text-gray-700">Иконка корзины (только для свободных)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Sandbox 2: Иконки */}
            <Sandbox
                title="🎨 Интерактивные иконки действий"
                description="Наведите курсор на каждую иконку, чтобы увидеть её назначение. Все SVG-пути взяты из реального кода."
                instructions={[
                    '<strong>Карандаш</strong> (edit) — появляется при наведении на описание свободного промокода',
                    '<strong>Галочка</strong> (save) и <strong>Крестик</strong> (cancel) — для редактирования описания',
                    '<strong>Чат</strong> (chat) — открывает диалог ВК с победителем (только для выданных)',
                    '<strong>Корзина</strong> (delete) — удаление промокода (только для свободных)'
                ]}
            >
                <ActionIconsDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Sandbox 3: Статусы */}
            <Sandbox
                title="🏷️ Статусы промокодов"
                description="Переключайте между статусами, чтобы увидеть разницу в отображении и доступных действиях."
                instructions={[
                    'Статус "Свободен" (зелёный) — промокод в запасе, можно редактировать и удалять',
                    'Статус "Выдан" (серый) — промокод использован победителем, только просмотр информации',
                    'У выданных промокодов видно: кому выдан, когда выдан, ссылка на диалог'
                ]}
            >
                <StatusesDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Счётчики */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Счётчики в заголовке таблицы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В шапке таблицы всегда видны три счётчика, которые показывают состояние базы промокодов:
            </p>

            <div className="not-prose my-6 flex gap-4 text-sm">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <span className="text-gray-500 block mb-1">Всего:</span>
                    <span className="text-2xl font-bold text-gray-900">47</span>
                </div>
                <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <span className="text-green-600 block mb-1">Свободно:</span>
                    <span className="text-2xl font-bold text-green-700">35</span>
                </div>
                <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                    <span className="text-indigo-600 block mb-1">Выдано:</span>
                    <span className="text-2xl font-bold text-indigo-700">12</span>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Зелёный счётчик "Свободно"</strong> — самый важный. Если он показывает 0, 
                розыгрыш невозможен — нужно срочно загрузить новую партию промокодов.
            </p>

            <hr className="!my-10" />

            {/* Советы по использованию */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать эту вкладку</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">📦 Первичная загрузка</h3>
                    <p className="text-sm text-purple-800">
                        Перед запуском конкурса загружаете всю партию промокодов разом. 
                        Рекомендуется загрузить минимум на 10-20 розыгрышей вперёд, чтобы не забывать догружать.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">🔄 Догрузка при нехватке</h3>
                    <p className="text-sm text-purple-800">
                        Если счётчик "Свободно" показывает мало кодов (меньше 5), самое время догрузить новую партию. 
                        Просто добавьте новые коды в форму и нажмите "Загрузить".
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">✏️ Редактирование описаний</h3>
                    <p className="text-sm text-purple-800">
                        Если заказчик изменил описание приза, можете отредактировать его прямо в таблице. 
                        Наведите курсор на описание свободного промокода — появится иконка карандаша.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">📊 Проверка запаса</h3>
                    <p className="text-sm text-purple-800">
                        Перед выходными или праздниками проверяйте счётчик "Свободно". 
                        Если конкурс активный, промокоды расходуются автоматически — можете не заметить, что они закончились.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Если счётчик "Свободно" показывает 0, система НЕ проведёт розыгрыш. 
                    Она пропустит этот цикл и попробует снова в следующий раз. Поэтому следите за запасом промокодов!
                </p>
            </div>

            <hr className="!my-10" />

            {/* Связь с другими вкладками */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Связь с другими разделами</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Промокоды" работает в связке с остальными разделами конкурса:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">1</div>
                        <div>
                            <p className="font-semibold text-gray-900">Настройки → Промокоды</p>
                            <p className="text-sm text-gray-600">В настройках вы пишете шаблон сообщения с переменной <code>{'{description}'}</code>. 
                            Эта переменная заменяется на описание из таблицы промокодов.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">2</div>
                        <div>
                            <p className="font-semibold text-gray-900">Промокоды → Победители</p>
                            <p className="text-sm text-gray-600">При выборе победителя система берёт первый свободный промокод из этой базы. 
                            Промокод становится "выдан" и появляется в таблице победителей.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">3</div>
                        <div>
                            <p className="font-semibold text-gray-900">Промокоды → Лист отправок</p>
                            <p className="text-sm text-gray-600">Если нужно посмотреть статус доставки промокода победителю (отправлен в ЛС или комментарий), 
                            используйте вкладку "Лист отправок". Там детальная информация о каждой попытке доставки.</p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Частые вопросы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Можно ли загрузить промокоды без описания?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да, можно. Просто введите только коды, каждый с новой строки (без вертикальной черты). 
                        Описание будет пустым, но позже его можно добавить через редактирование.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Что происходит, если промокодов не хватает?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Система пропускает розыгрыш и пишет в логи сообщение об ошибке. 
                        Конкурс продолжит работать, но победитель не будет выбран до тех пор, пока вы не догрузите промокоды.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Можно ли удалить выданный промокод?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, нельзя. Выданные промокоды нельзя удалять — это архивная информация о победителях. 
                        Удалять можно только свободные (не использованные) промокоды.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Как работает массовое удаление?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Отметьте чекбоксы у нужных промокодов (доступно только для свободных), 
                        затем нажмите кнопку "Удалить выбранные" в шапке таблицы. Появится окно подтверждения.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Зачем нужна иконка чата?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Иконка чата (три точки) открывает диалог ВКонтакте с победителем. 
                        Это удобно, если победитель написал вопрос о промокоде — не нужно искать его в сообщениях, просто кликните на иконку.
                    </p>
                </details>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-2-5-promocodes" />
        </article>
    );
};
