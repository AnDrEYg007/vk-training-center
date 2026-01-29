import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Навигация по датам в шапке календаря
// =====================================================================
export const DateNavigation: React.FC<ContentProps> = ({ title }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 15)); // Пример: 15 января 2024

    const getWeekDates = (date: Date) => {
        const curr = new Date(date);
        const first = curr.getDate() - curr.getDay() + 1; // Понедельник
        const firstDay = new Date(curr.setDate(first));
        
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(firstDay);
            day.setDate(firstDay.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const goToPreviousWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const weekDates = getWeekDates(currentDate);
    const weekStart = weekDates[0].toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });
    const weekEnd = weekDates[6].toLocaleDateString('ru-RU', { month: 'short', day: 'numeric' });

    const isCurrentWeek = () => {
        const today = new Date();
        const todayWeekStart = getWeekDates(today)[0];
        const currentWeekStart = weekDates[0];
        return todayWeekStart.getTime() === currentWeekStart.getTime();
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В шапке календаря находится <strong>полоса навигации по датам</strong>. 
                Это инструмент для быстрого переключения между неделями и для быстрого возврата к текущей дате.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Навигация по датам позволяет легко перемещаться 
                    по времени в календаре, не листая его вручную на много недель вперед или назад.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где это находится?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация по датам располагается в <strong>верхнем левом углу шапки календаря</strong>, 
                прямо над колонками дней. Это первая часть управления календарем.
            </p>

            <hr className="!my-10" />

            {/* Что здесь есть */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Из чего состоит навигация?</h2>

            <div className="not-prose space-y-6 my-8">
                {/* Элемент 1: Кнопка "Назад" */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">⬅️</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Кнопка "Назад" (⬅️)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Стрелка влево, которая перемещает календарь на <strong>одну неделю назад</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Хочешь просмотреть прошедшие недели</li>
                                    <li>Нужно проверить уже опубликованные посты</li>
                                    <li>Нужно найти старые черновики</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Совет:</strong> Кнопка не имеет ограничений — 
                                ты можешь нажимать её столько раз, сколько нужно, даже на несколько лет назад.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Элемент 2: Диапазон дат */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📅</div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Диапазон дат (Посередине)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                В центре между стрелками отображается <strong>дата начала и конца текущей недели</strong>.
                            </p>
                            <div className="bg-white rounded p-4 border border-green-200 text-sm text-gray-700 space-y-3">
                                <p><strong>Пример отображения:</strong></p>
                                <div className="bg-gray-50 rounded p-3 text-center text-sm font-medium text-gray-800">
                                    Янв 15 — Янв 21
                                </div>
                                <p className="text-xs text-gray-600">
                                    (Это означает, что сейчас показана неделя с 15 по 21 января)
                                </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                ℹ️ <strong>Важно:</strong> Это просто информация — клик на текст дат 
                                <strong> ничего не делает</strong>. Для навигации используй стрелки.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Элемент 3: Кнопка "Вперед" */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">➡️</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Кнопка "Вперед" (➡️)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Стрелка вправо, которая перемещает календарь на <strong>одну неделю вперед</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-purple-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Хочешь спланировать посты на будущие недели</li>
                                    <li>Нужно посмотреть пустые дни вперед</li>
                                    <li>Нужно распределить контент на месяц вперед</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Совет:</strong> Ты можешь переходить на неограниченное 
                                количество недель в будущее (например, планировать на полгода вперед).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Элемент 4: Кнопка "Сегодня" */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">🎯</div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Кнопка "Сегодня" (🎯)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Специальная кнопка, которая <strong>мгновенно возвращает календарь на текущую неделю</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-orange-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Ты уехал в прошлое/будущее на много недель</li>
                                    <li>Нужно быстро вернуться к текущей дате</li>
                                    <li>Сбился с ориентира во времени</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Полезно знать:</strong> Если ты уже на текущей неделе, 
                                кнопка "Сегодня" будет немного бледнее (неактивной), но ты все равно можешь её нажать.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный демо */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Попробуй сам</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Ниже находится <strong>интерактивный макет</strong> навигации. 
                Попробуй нажать стрелки и кнопку "Сегодня", чтобы понять, как это работает:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                {/* Макет шапки */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {/* Навигация */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goToPreviousWeek}
                                className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold transition-colors"
                            >
                                ⬅️ Назад
                            </button>

                            <div className="text-center min-w-[150px]">
                                <p className="text-sm text-gray-600">Текущая неделя</p>
                                <p className="text-lg font-bold text-gray-900">{weekStart} — {weekEnd}</p>
                            </div>

                            <button
                                onClick={goToNextWeek}
                                className="p-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold transition-colors"
                            >
                                Вперед ➡️
                            </button>

                            <button
                                onClick={goToToday}
                                disabled={isCurrentWeek()}
                                className={`p-2 rounded-lg font-bold transition-colors ${
                                    isCurrentWeek()
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50'
                                        : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                                }`}
                            >
                                🎯 Сегодня
                            </button>
                        </div>
                    </div>

                    {/* Дни недели */}
                    <div className="grid grid-cols-7 gap-3">
                        {weekDates.map((date, idx) => {
                            const dayName = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][idx];
                            const isToday = new Date().toDateString() === date.toDateString();
                            return (
                                <div
                                    key={idx}
                                    className={`p-4 rounded-lg text-center border-2 transition-all ${
                                        isToday
                                            ? 'bg-indigo-50 border-indigo-400 shadow-md'
                                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <p className="text-xs font-bold text-gray-600 mb-1">{dayName}</p>
                                    <p className="text-sm font-bold text-gray-900">{date.getDate()}</p>
                                    {isToday && <p className="text-xs text-indigo-600 font-bold mt-1">●</p>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Нажимай стрелки, чтобы переходить между неделями. Нажми "Сегодня", чтобы вернуться.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Частые ошибки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы и ошибки</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3">
                    <p className="font-bold text-amber-900 mb-2">❓ Я нажимаю стрелку, но неделя не меняется!</p>
                    <p className="text-sm text-gray-700">
                        Скорее всего, ты нажал на текст дат посередине (📅). Это просто информация. 
                        Нажимай именно на <strong>кнопки со стрелками</strong> слева и справа.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3">
                    <p className="font-bold text-amber-900 mb-2">❓ Кнопка "Сегодня" не реагирует</p>
                    <p className="text-sm text-gray-700">
                        Это нормально! Если ты уже смотришь на текущую неделю, кнопка может быть 
                        <strong> немного бледнее</strong>, но это не значит, что она сломана. 
                        Это просто показывает, что ты уже дома (в текущей неделе).
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3">
                    <p className="font-bold text-amber-900 mb-2">❓ Как далеко я могу переходить в будущее?</p>
                    <p className="text-sm text-gray-700">
                        Ты можешь переходить на столько недель вперед, на сколько захочешь! 
                        В приложении нет ограничений. Это полезно для долгосрочного планирования контента.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3">
                    <p className="font-bold text-amber-900 mb-2">❓ Я могу увидеть дни по одному, а не неделями?</p>
                    <p className="text-sm text-gray-700">
                        Да! Это называется <strong>"режим отображения"</strong>. 
                        Есть два режима: "Неделя" (7 дней) и "Сегодня" (7 дней начиная с сегодня). 
                        Об этом подробнее в следующем разделе.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Полезный совет */}
            <div className="not-prose bg-green-50 border-l-4 border-green-400 pl-4 py-3 rounded-lg">
                <p className="text-green-900 font-bold mb-2">💚 Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700">
                    Если ты часто планируешь контент на много недель вперед, 
                    <strong> используй режим "Сегодня"</strong> вместе с кнопкой "Вперед". 
                    Это позволит тебе видеть все дни относительно сегодняшнего дня, 
                    что удобнее для долгосрочного планирования.
                </p>
            </div>
        </article>
    );
};
