import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Интерактивные песочницы
// =====================================================================
export const Sandboxes: React.FC<ContentProps> = ({ title }) => {
    const [clickCount, setClickCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [inputValue, setInputValue] = useState('');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Песочницы (Sandbox)</strong> — это интерактивные блоки внутри документации, 
                где можно безопасно практиковаться с элементами интерфейса без риска что-либо сломать 
                или потерять данные в реальном приложении.
            </p>

            <hr className="!my-10" />

            {/* Что такое песочница */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем нужны песочницы</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Безопасная практика</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Пробуйте клики, перетаскивания и другие действия без страха, 
                        что удалите важные данные или испортите рабочий процесс.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Наглядность</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Видите результат действий сразу: как элемент меняет цвет при наведении, 
                        что происходит при клике, как срабатывает переключатель.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Повторение</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Можно повторить действие сколько угодно раз, чтобы запомнить последовательность 
                        и закрепить навык.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Контекст</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Песочницы встроены прямо в текст объяснения — читаете описание 
                        и сразу пробуете на примере.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как распознать песочницу */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит песочница</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Все песочницы имеют одинаковое оформление для лёгкого распознавания:
            </p>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 border-2 border-dashed border-indigo-300 rounded bg-indigo-50"></div>
                    <div>
                        <p className="font-medium text-gray-800">Пунктирная рамка цвета indigo</p>
                        <p className="text-sm text-gray-600">Визуально отделяет интерактивный блок от обычного текста</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-10 h-10 bg-indigo-50 rounded"></div>
                    <div>
                        <p className="font-medium text-gray-800">Светло-синий фон</p>
                        <p className="text-sm text-gray-600">Подчёркивает, что это особая зона для практики</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <p className="font-medium text-gray-800">Инструкция выше</p>
                        <p className="text-sm text-gray-600">Над интерактивными элементами всегда есть пояснение, что нужно сделать</p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Примеры песочниц */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Примеры песочниц</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот несколько типичных песочниц, которые встречаются в документации:
            </p>

            {/* Песочница 1: Клик */}
            <Sandbox
                title="Пример 1: Простой клик"
                description="Кликните на кнопку, чтобы увидеть счётчик кликов."
                instructions={[
                    '<strong>Кликните</strong> на зелёную кнопку ниже.',
                    'Счётчик справа покажет количество кликов.',
                ]}
            >
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setClickCount(clickCount + 1)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    >
                        Кликни меня
                    </button>
                    <span className="text-gray-700">
                        Кликов: <span className="font-bold text-indigo-600 text-xl">{clickCount}</span>
                    </span>
                </div>
            </Sandbox>

            {/* Песочница 2: Ховер */}
            <Sandbox
                title="Пример 2: Наведение курсора"
                description="Наведите курсор на карточку, чтобы увидеть изменение цвета."
                instructions={[
                    '<strong>Наведите</strong> курсор на серую карточку.',
                    'Фон изменится на синий, появится тень.',
                ]}
            >
                <div 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`p-6 rounded-lg border-2 transition-all cursor-pointer ${
                        isHovered 
                            ? 'bg-indigo-100 border-indigo-400 shadow-lg' 
                            : 'bg-gray-100 border-gray-300'
                    }`}
                >
                    <p className={`font-medium ${isHovered ? 'text-indigo-800' : 'text-gray-700'}`}>
                        {isHovered ? '✨ Вы навели курсор!' : 'Наведите на меня курсор'}
                    </p>
                </div>
            </Sandbox>

            {/* Песочница 3: Ввод текста */}
            <Sandbox
                title="Пример 3: Ввод данных"
                description="Введите текст в поле и увидите его отражение ниже."
                instructions={[
                    '<strong>Введите</strong> любой текст в поле ввода.',
                    'Ниже появится введённое значение в реальном времени.',
                ]}
            >
                <div className="space-y-3">
                    <input 
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Введите что-нибудь..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {inputValue && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800">
                                <strong>Вы ввели:</strong> {inputValue}
                            </p>
                        </div>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Что можно делать */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что можно делать в песочницах</h2>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Кликать</strong> — нажимать на кнопки, карточки, переключатели</li>
                <li><strong>Наводить курсор</strong> — видеть hover-эффекты и всплывающие подсказки</li>
                <li><strong>Вводить текст</strong> — заполнять поля и смотреть на результат</li>
                <li><strong>Перетаскивать</strong> — drag-and-drop элементов (в некоторых песочницах)</li>
                <li><strong>Переключать состояния</strong> — включать/выключать тогглы, выбирать вкладки</li>
                <li><strong>Повторять</strong> — делать действие снова и снова для закрепления</li>
            </ul>

            {/* Подсказка */}
            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-800">
                    <strong>Важно:</strong> Всё, что происходит в песочницах, 
                    <span className="font-medium"> не влияет на ваши реальные данные</span>. 
                    Это безопасная среда для экспериментов.
                </p>
            </div>

            <NavigationButtons currentPath="0-2-2-sandboxes" />
        </article>
    );
};
