import React, { useState } from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Навигация по оглавлению
// =====================================================================
export const Navigation: React.FC<ContentProps> = ({ title }) => {
    const [expandedDemo, setExpandedDemo] = useState<string | null>('section-0');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Оглавление Центра обучения — это дерево разделов слева от контента. 
                Оно помогает быстро находить нужную тему и перемещаться между страницами документации.
            </p>

            <hr className="!my-10" />

            {/* Структура оглавления */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как устроено оглавление</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Разделы (Раздел 0, 1, 2...)</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Верхний уровень иерархии. Каждый раздел объединяет связанные темы: 
                        например, Раздел 2 — это весь Контент-менеджмент.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Подразделы (0.1, 0.2...)</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Внутри раздела есть подразделы — крупные темы. 
                        Например, 0.1 — "Что такое Центр обучения", 0.2 — "Как работать".
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Вкладки (0.1.1, 0.1.2...)</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Самый детальный уровень — конкретные страницы. 
                        Например, 0.1.1 — "Назначение и цели", 0.1.2 — "Для кого этот раздел".
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Свёрнутые/развёрнутые</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Разделы можно сворачивать и разворачивать кликом на заголовок 
                        или стрелку слева от названия.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как перемещаться */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как перемещаться по оглавлению</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
                        1
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Клик на название раздела/подраздела</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Открывает первую страницу внутри этого блока. Например, клик на "Раздел 0: О Центре обучения" 
                            откроет страницу "Что такое Центр обучения".
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                        2
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Клик на стрелку слева</p>
                        <p className="text-sm text-green-700 mt-1">
                            Разворачивает или сворачивает содержимое раздела, не открывая страницу. 
                            Так можно просмотреть структуру, не покидая текущую страницу.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
                        3
                    </div>
                    <div>
                        <p className="font-medium text-indigo-800">Клик на вкладку (конечный пункт)</p>
                        <p className="text-sm text-indigo-700 mt-1">
                            Открывает конкретную страницу с информацией. Активная вкладка подсвечивается синим цветом 
                            и имеет левую рамку.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивное демо */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Попробуйте сами</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кликните на элементы ниже, чтобы увидеть, как работает навигация:
            </p>

            <div className="not-prose border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50/50 p-6 mt-6">
                <h4 className="text-xl font-bold text-indigo-800 mb-4">Демо: Оглавление</h4>
                
                <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-sm">
                    {/* Раздел 0 */}
                    <div className="mb-2">
                        <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
                            <button 
                                onClick={() => setExpandedDemo(expandedDemo === 'section-0' ? null : 'section-0')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className={`w-4 h-4 transition-transform ${expandedDemo === 'section-0' ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-700">Раздел 0: О Центре обучения</span>
                        </div>
                        
                        {expandedDemo === 'section-0' && (
                            <div className="ml-6 mt-1 space-y-1">
                                <div className="py-1.5 px-3 text-sm text-gray-600 hover:bg-indigo-50 rounded cursor-pointer border-l-2 border-transparent hover:border-indigo-300">
                                    0.1 Что такое ЦО?
                                </div>
                                <div className="py-1.5 px-3 text-sm text-indigo-600 bg-indigo-50 rounded cursor-pointer border-l-2 border-indigo-600 font-medium">
                                    0.2.1 Навигация ← вы здесь
                                </div>
                                <div className="py-1.5 px-3 text-sm text-gray-600 hover:bg-indigo-50 rounded cursor-pointer border-l-2 border-transparent hover:border-indigo-300">
                                    0.2.2 Песочницы
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Раздел 1 */}
                    <div className="mb-2">
                        <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
                            <button 
                                onClick={() => setExpandedDemo(expandedDemo === 'section-1' ? null : 'section-1')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className={`w-4 h-4 transition-transform ${expandedDemo === 'section-1' ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-700">Раздел 1: Введение</span>
                        </div>
                        
                        {expandedDemo === 'section-1' && (
                            <div className="ml-6 mt-1 space-y-1">
                                <div className="py-1.5 px-3 text-sm text-gray-600 hover:bg-indigo-50 rounded cursor-pointer">
                                    1.1 Главная навигация
                                </div>
                                <div className="py-1.5 px-3 text-sm text-gray-600 hover:bg-indigo-50 rounded cursor-pointer">
                                    1.2 Сайдбар проектов
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Раздел 2 */}
                    <div>
                        <div className="flex items-center gap-2 py-2 px-2 hover:bg-gray-50 rounded cursor-pointer">
                            <button 
                                onClick={() => setExpandedDemo(expandedDemo === 'section-2' ? null : 'section-2')}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className={`w-4 h-4 transition-transform ${expandedDemo === 'section-2' ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                            <span className="text-sm font-medium text-gray-700">Раздел 2: Контент-менеджмент</span>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-indigo-700 mt-4">
                    <strong>Совет:</strong> Стрелка сворачивает/разворачивает, клик на название — открывает страницу.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Визуальные индикаторы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Визуальные подсказки</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-3 h-3 bg-indigo-600 rounded"></div>
                    <div>
                        <p className="font-medium text-gray-800">Синий фон и левая рамка</p>
                        <p className="text-sm text-gray-600">Активная страница — вы находитесь здесь</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="w-3 h-3 border-2 border-gray-300 rounded bg-gray-50"></div>
                    <div>
                        <p className="font-medium text-gray-800">Серый текст</p>
                        <p className="text-sm text-gray-600">Неактивная страница — можно кликнуть, чтобы открыть</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg">
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <div>
                        <p className="font-medium text-gray-800">Стрелка вправо/вниз</p>
                        <p className="text-sm text-gray-600">Показывает, свёрнут раздел или развёрнут</p>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="0-2-1-navigation" />
        </article>
    );
};
