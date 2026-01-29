import React from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Обзор шапки календаря
// =====================================================================
export const CalendarHeaderOverview: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Шапка календаря</strong> — это панель инструментов над сеткой календаря, 
                которая содержит <strong>все необходимые элементы для навигации и управления контентом</strong>. 
                Это твой главный инструмент для работы с календарём постов и заметок.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Шапка календаря — это "пульт управления" временем. 
                    Здесь собраны все инструменты для навигации, переключения режимов, обновления данных 
                    и массовых операций.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Визуализация шапки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит шапка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Шапка располагается прямо над сеткой календаря и визуально разделена на две части:
            </p>

            <div className="not-prose my-6">
                <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-500 uppercase">Левая часть:</span>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                    ← Назад
                                </button>
                                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium">
                                    Сегодня
                                </button>
                                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                                    Вперёд →
                                </button>
                            </div>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded text-sm font-medium">
                                    Неделя
                                </button>
                                <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm font-medium">
                                    Сегодня
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500 uppercase mr-2">Правая часть:</span>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                👁️ Заметки
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                🏷️ Теги
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                🔄 Обновить
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                Выбрать
                            </button>
                            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-sm font-medium">
                                ✏️ Создать
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">
                        ↑ Так выглядит шапка календаря в реальном интерфейсе
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Из чего состоит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Из чего состоит шапка календаря?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Шапка календаря состоит из <strong>6 главных инструментов</strong>, каждый из которых решает свою задачу:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Инструмент 1 */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-blue-700">1️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Навигация по датам</h3>
                            <p className="text-sm text-gray-700">
                                Кнопки "Назад", "Сегодня" и "Вперёд" для переключения между неделями. 
                                Позволяют быстро перемещаться по календарю и возвращаться к текущей дате.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Как работают кнопки навигации, горячие клавиши, 
                                правило "лента времени".
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инструмент 2 */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-green-700">2️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Режимы отображения</h3>
                            <p className="text-sm text-gray-700">
                                Переключатель между режимами "Неделя" (Пн-Вс) и "Сегодня" (7 дней от сегодня). 
                                Каждый режим подходит для разных сценариев работы.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> В чём разница между режимами, когда использовать 
                                каждый, как они работают с навигацией.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инструмент 3 */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-purple-700">3️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Управление видимостью</h3>
                            <p className="text-sm text-gray-700">
                                Кнопки для управления отображением заметок (👁️) и тегов (🏷️) в календаре. 
                                Три режима: показать, свернуть, скрыть.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Как работают режимы видимости, когда сворачивать 
                                элементы, что даёт скрытие.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инструмент 4 */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-orange-700">4️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Кнопка "Обновить" (🔄)</h3>
                            <p className="text-sm text-gray-700">
                                Выпадающее меню с разными вариантами обновления данных: опубликованные посты, 
                                отложенные, системные, предложенные или всё сразу.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Зачем нужно выборочное обновление, как работает 
                                каждый тип, когда обновлять все данные.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инструмент 5 */}
                <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-red-700">5️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900 mb-2">Массовые действия</h3>
                            <p className="text-sm text-gray-700">
                                Кнопка "Выбрать" активирует режим массового выделения постов и заметок. 
                                Позволяет удалить, переместить или изменить сразу много элементов.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Как работает режим выбора, какие действия доступны, 
                                как отменить выбор.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инструмент 6 */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-indigo-700">6️⃣</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 mb-2">Создание заметки (✏️)</h3>
                            <p className="text-sm text-gray-700">
                                Явная кнопка для создания новой заметки с автоматической установкой текущей даты. 
                                Более очевидный способ, чем двойной клик по ячейке календаря.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                📌 <strong>Что узнаешь:</strong> Разница между кнопкой и двойным кликом, 
                                когда использовать кнопку, как работает создание.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Логика расположения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Почему инструменты расположены именно так?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Расположение элементов в шапке не случайно — оно подчиняется логике использования:
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <span className="text-xl">←</span>
                        Левая часть: Навигация и просмотр
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Навигация по датам</strong> — базовое перемещение</li>
                        <li>• <strong>Режимы отображения</strong> — как смотреть на календарь</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-3">
                        Эти инструменты используются <strong>постоянно</strong> и должны быть 
                        под левой рукой (для правшей).
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        Правая часть: Действия и управление
                        <span className="text-xl">→</span>
                    </h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li>• <strong>Видимость</strong> — настройка отображения</li>
                        <li>• <strong>Обновление</strong> — синхронизация с VK</li>
                        <li>• <strong>Массовые действия</strong> — операции над множеством</li>
                        <li>• <strong>Создание заметки</strong> — добавление контента</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-3">
                        Эти инструменты используются <strong>периодически</strong> и логически 
                        сгруппированы по типу действия.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Типичные сценарии */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Типичные сценарии использования шапки
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот как ты будешь использовать шапку календаря в реальной работе:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-lg">📅</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Планирование контента на следующую неделю
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>1.</strong> Режим "Неделя" → <strong>2.</strong> Кнопка "Вперёд" 
                            (переход на следующую неделю) → <strong>3.</strong> Просмотр свободных дат → 
                            <strong>4.</strong> Создание заметок с идеями для постов.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-lg">🔄</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Проверка статуса отложенных постов
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>1.</strong> Кнопка "Обновить" → <strong>2.</strong> Выбрать 
                            "Отложенные VK" → <strong>3.</strong> Дождаться обновления → 
                            <strong>4.</strong> Увидеть актуальные посты в календаре.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-lg">🎯</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Быстрая фиксация идеи на сегодня
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>1.</strong> Кнопка "✏️ Создать заметку" → <strong>2.</strong> Ввод 
                            заголовка и текста → <strong>3.</strong> Сохранение → 
                            <strong>4.</strong> Заметка появляется в календаре на текущей дате.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 text-lg">🗑️</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Массовое удаление старых заметок
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>1.</strong> Кнопка "Выбрать" (активация режима) → 
                            <strong>2.</strong> Кликаем по чекбоксам нужных заметок → 
                            <strong>3.</strong> Кнопка "Удалить" → <strong>4.</strong> Подтверждение → 
                            <strong>5.</strong> "Отмена выбора".
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 text-lg">👁️</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Фокусировка только на постах
                        </h4>
                        <p className="text-sm text-gray-600">
                            <strong>1.</strong> Кнопка "👁️ Заметки" → <strong>2.</strong> Выбрать 
                            "Скрыть" → <strong>3.</strong> Кнопка "🏷️ Теги" → <strong>4.</strong> Выбрать 
                            "Скрыть" → <strong>5.</strong> Теперь в календаре видны только посты.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что изучить дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что изучить дальше?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь, когда ты понимаешь общую структуру шапки календаря, изучи каждый инструмент подробнее:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
                    <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <span className="text-xl">📚</span>
                        Рекомендованный порядок изучения:
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">1.</span>
                            <span>
                                <strong>Навигация по датам</strong> — базовое перемещение, 
                                без которого невозможна работа с календарём.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">2.</span>
                            <span>
                                <strong>Режимы отображения</strong> — понять разницу между "Неделя" и "Сегодня", 
                                выбрать свой стиль работы.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">3.</span>
                            <span>
                                <strong>Управление видимостью</strong> — научиться управлять загруженностью 
                                интерфейса.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">4.</span>
                            <span>
                                <strong>Кнопка "Обновить"</strong> — понять, как синхронизировать данные 
                                с ВКонтакте эффективно.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">5.</span>
                            <span>
                                <strong>Массовые действия</strong> — освоить продвинутый инструмент 
                                для работы с большими объёмами.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold text-indigo-600 flex-shrink-0">6.</span>
                            <span>
                                <strong>Создание заметки</strong> — узнать альтернативный способ 
                                создания заметок через кнопку.
                            </span>
                        </li>
                    </ol>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 rounded-lg p-6 my-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">💡</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>Не пытайся запомнить все инструменты сразу.</strong> Начни с базовой навигации 
                            (кнопки "Назад"/"Вперёд"/"Сегодня") и режима "Неделя". Это 90% твоей работы. 
                            Остальные инструменты осваивай по мере необходимости.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mt-3">
                            <strong>Создай себе привычку:</strong> каждое утро открывай приложение, нажимай 
                            "Сегодня" (чтобы быть на текущей неделе), переключись в режим "Сегодня" 
                            (если планируешь ближайшие 7 дней) и обнови "Отложенные VK", чтобы видеть 
                            актуальную картину дня.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Заключение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итоги</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Шапка календаря</strong> — это твой главный "пульт управления" для работы с контентом 
                во времени. Она содержит:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                <li>
                    <strong>6 ключевых инструментов</strong> для навигации, просмотра и управления контентом
                </li>
                <li>
                    <strong>Логичное разделение</strong> на левую часть (навигация) и правую часть (действия)
                </li>
                <li>
                    <strong>Покрытие всех сценариев</strong> — от простого перемещения до сложных массовых операций
                </li>
                <li>
                    <strong>Интуитивное расположение</strong> — самое используемое слева, редкое справа
                </li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Изучи каждый инструмент отдельно в подразделах, чтобы стать мастером календарного планирования! 
                📅✨
            </p>
        </article>
    );
};
