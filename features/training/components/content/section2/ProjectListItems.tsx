import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Элементы списка проектов
// =====================================================================
export const ProjectListItems: React.FC<ContentProps> = ({ title }) => {
    const [hoveredProject, setHoveredProject] = useState<string | null>(null);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сайдбар проектов — это список всех твоих сообществ ВКонтакте в левой панели. 
                Каждый проект в этом списке — это <strong>целый элемент управления</strong> с несколькими частями.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Что это значит:</strong> Один элемент списка — это не просто текст, 
                    а целая кнопка с иконками, счётчиком и скрытыми действиями.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Из чего состоит элемент */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Из чего состоит один элемент проекта?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый проект в списке имеет три основные части:
            </p>

            <div className="not-prose space-y-6 my-8">
                {/* Часть 1: Название */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">1️⃣</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Название проекта (Кликабельное)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Это название твоего сообщества ВКонтакте. Его можно <strong>кликнуть</strong>, 
                                чтобы переключиться на этот проект и увидеть его расписание.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200">
                                <p className="text-xs text-gray-600 mb-2">Пример:</p>
                                <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <span className="text-xl">🍕</span>
                                    <span className="text-sm font-medium text-gray-800">Доставка пиццы</span>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                ℹ️ <strong>Активный проект</strong> — когда ты кликнул на него, 
                                он подсвечивается синим цветом (выбран).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 2: Счётчик */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">2️⃣</div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Счётчик постов (Справа)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Цифра справа от названия</strong> показывает, сколько <strong>черновиков</strong> 
                                (отложенных постов) есть в этом проекте. Цвет этой цифры важен!
                            </p>

                            <div className="bg-white rounded p-4 border border-green-200 space-y-3">
                                <p className="text-xs text-gray-600 font-bold">Цвета счётчика:</p>
                                
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">0</span>
                                    <span className="text-sm text-gray-700">Красный = <strong>0 постов</strong> (пора создавать!)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">3</span>
                                    <span className="text-sm text-gray-700">Оранжевый = <strong>1-4 поста</strong> (мало, нужно больше)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-300 text-gray-700">7</span>
                                    <span className="text-sm text-gray-700">Серый = <strong>5-10 постов</strong> (нормально)</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">15</span>
                                    <span className="text-sm text-gray-700">Зелёный = <strong>больше 10 постов</strong> (отлично!)</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Смысл:</strong> Красный счётчик — это сигнал "Внимание! В проекте нет постов, 
                                нужно планировать контент". Зелёный — "Всё хорошо, контента достаточно".
                            </p>
                        </div>
                    </div>
                </div>

                {/* Часть 3: Кнопки при наведении */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">3️⃣</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Кнопки при наведении (Скрытые)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Когда наводишь курсор на элемент проекта, слева <strong>появляются две кнопки</strong>. 
                                Они нужны для быстрых действий.
                            </p>

                            <div className="bg-white rounded p-4 border border-purple-200 space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 pb-3 border-b border-purple-200">
                                        <div className="text-2xl flex-shrink-0">🔄</div>
                                        <div>
                                            <p className="font-semibold text-purple-900 text-sm">Кнопка "Обновить"</p>
                                            <p className="text-xs text-gray-700 mt-1">
                                                Нажми эту кнопку, если хочешь <strong>принудительно загрузить</strong> 
                                                свежие данные из ВКонтакте для этого проекта. 
                                                Полезно, если ты создал пост в самом ВК и хочешь увидеть его здесь.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="text-2xl flex-shrink-0">⚙️</div>
                                        <div>
                                            <p className="font-semibold text-purple-900 text-sm">Кнопка "Настройки"</p>
                                            <p className="text-xs text-gray-700 mt-1">
                                                Откроет окно с <strong>настройками этого проекта</strong>: 
                                                название в системе, команда, токен VK API и другие параметры.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 bg-purple-50 p-2 rounded border border-purple-200">
                                    ℹ️ <strong>Важно:</strong> Эти кнопки видны только когда наводишь курсор на элемент. 
                                    Без наведения они скрыты.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный пример */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Живой пример</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Наведи курсор на проекты ниже, чтобы увидеть кнопки в действии:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
                <div className="space-y-2 bg-white rounded border border-gray-300 p-4">
                    {[
                        { name: '🍕 Доставка пиццы', count: 12, status: 'good' },
                        { name: '🎨 Дизайн студия', count: 3, status: 'warning' },
                        { name: '📚 Образование', count: 0, status: 'danger' },
                    ].map((project, idx) => {
                        const isHovered = hoveredProject === project.name;
                        const countColors = {
                            good: 'bg-green-100 text-green-800',
                            warning: 'bg-orange-100 text-orange-800',
                            danger: 'bg-red-100 text-red-800',
                        };

                        return (
                            <div
                                key={idx}
                                onMouseEnter={() => setHoveredProject(project.name)}
                                onMouseLeave={() => setHoveredProject(null)}
                                className="relative overflow-hidden"
                            >
                                {/* Скрытые кнопки при наведении */}
                                {isHovered && (
                                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-gray-200 flex items-center justify-center gap-1 pl-2">
                                        <button className="p-2 text-gray-600 rounded hover:bg-gray-300 transition-colors" title="Обновить">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                                            </svg>
                                        </button>
                                        <button className="p-2 text-gray-600 rounded hover:bg-gray-300 transition-colors" title="Настройки">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}

                                {/* Основной элемент проекта */}
                                <button
                                    className={`w-full text-left pr-4 py-3 text-sm flex justify-between items-center transition-all duration-200 ${
                                        isHovered ? 'pl-20 bg-gray-100' : 'pl-4 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center min-w-0">
                                        <span className="truncate font-medium text-gray-800">{project.name}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-bold flex-shrink-0 ${countColors[project.status]}`}>
                                        {project.count}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <p className="text-xs text-gray-600 mt-4">
                    💡 <strong>Попробуй:</strong> Наведи мышку на проект слева — увидишь скрытые кнопки!
                </p>
            </div>

            <hr className="!my-10" />

            {/* Важные моменты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Важные моменты</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-blue-900">Счётчик зависит от вкладки</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Счётчик показывает разные цифры в зависимости от того, какая вкладка открыта: 
                            "Отложенные" (черновики), "Предложенные" (посты от других), и т.д.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <p className="font-medium text-green-900">Кнопки работают быстро</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Обновление и открытие настроек — это быстрые операции, 
                            не требующие дополнительных окон (кроме окна настроек).
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <div>
                        <p className="font-medium text-purple-900">Один элемент = один проект</p>
                        <p className="text-sm text-gray-700 mt-1">
                            Каждый элемент списка соответствует одному сообществу в ВКонтакте. 
                            Чем больше сообществ — тем длиннее список.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Следующие шаги */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Далее</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь ты знаешь, как устроен <strong>один элемент проекта</strong>. 
                Дальше мы поговорим про <strong>счётчики постов</strong> более детально 
                и про <strong>фильтры для поиска</strong> проектов в списке.
            </p>
        </article>
    );
};
