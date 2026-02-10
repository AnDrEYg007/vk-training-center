import React, { useState } from 'react';
import { ContentProps, NavigationButtons, Sandbox } from '../shared';

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

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> Навигация по датам позволяет легко перемещаться 
                    по времени в календаре, не листая его вручную на много недель вперед или назад.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где это находится?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация по датам располагается в <strong>левой части шапки календаря</strong>. 
                Порядок элементов слева направо: отображение месяца → переключатель режимов → <strong>навигация (3 кнопки)</strong> → поиск.
            </p>

            <hr className="!my-10" />

            {/* Что здесь есть */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Из чего состоит навигация?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация представляет собой <strong>единый блок с тремя кнопками</strong>, разделёнными 
                вертикальными линиями. Все кнопки находятся в одной рамке и работают как единый инструмент.
            </p>

            <div className="not-prose space-y-6 my-8">
                {/* Элемент 1: Кнопка "Назад" */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">1️⃣</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Стрелка влево (Назад)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Первая кнопка в блоке. Перемещает календарь на <strong>одну неделю назад</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-blue-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Просмотр прошедших недель</li>
                                    <li>Проверка уже опубликованных постов</li>
                                    <li>Поиск старых заметок</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Совет:</strong> Ограничений нет — можешь листать хоть на несколько лет назад.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Элемент 2: Кнопка "Сегодня" */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">2️⃣</div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Кнопка "Сегодня" (в центре)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Средняя кнопка в блоке. <strong>Мгновенно возвращает календарь на текущую неделю</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-orange-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Ушёл далеко в прошлое или будущее</li>
                                    <li>Нужно быстро вернуться к текущей дате</li>
                                    <li>Потерял ориентир во времени</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Важно:</strong> Если ты уже на текущей неделе, кнопка становится 
                                блеклой и заблокирована для нажатия — это нормально, она показывает что ты уже "дома".
                            </p>
                        </div>
                    </div>
                </div>

                {/* Элемент 3: Кнопка "Вперед" */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">3️⃣</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Стрелка вправо (Вперёд)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Третья кнопка в блоке. Перемещает календарь на <strong>одну неделю вперёд</strong>.
                            </p>
                            <div className="bg-white rounded p-3 border border-purple-200 text-sm text-gray-700 space-y-2">
                                <p><strong>Когда использовать:</strong></p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Планирование постов на будущие недели</li>
                                    <li>Просмотр свободных дней вперёд</li>
                                    <li>Распределение контента на месяц вперёд</li>
                                </ul>
                            </div>
                            <p className="text-xs text-gray-600 mt-3">
                                💡 <strong>Совет:</strong> Можешь планировать хоть на полгода вперёд — ограничений нет.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивная демонстрация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Попробуй сам</h2>

            <Sandbox
                title="Интерактивная навигация по датам"
                description="Попробуй нажать на кнопки навигации, чтобы понять, как это работает. Обрати внимание, что кнопка 'Сегодня' блокируется, когда ты уже на текущей неделе."
                instructions={["Нажми стрелку влево, чтобы перейти на неделю назад", "Нажми 'Сегодня', чтобы вернуться", "Нажми стрелку вправо, чтобы перейти на неделю вперёд", "Обрати внимание: кнопка 'Сегодня' блокируется на текущей неделе"]}
            >
            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6">
                {/* Демонстрация шапки */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    {/* Навигация - единый блок */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            {/* Единый блок навигации как в реальном коде */}
                            <div className="flex items-center rounded-md border border-gray-300 bg-white shadow-sm">
                                <button
                                    onClick={goToPreviousWeek}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                    title="Предыдущая неделя"
                                    aria-label="Предыдущая неделя"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="h-5 w-px bg-gray-200"></div>
                                <button
                                    onClick={goToToday}
                                    disabled={isCurrentWeek()}
                                    className={`px-4 py-1.5 text-sm font-medium ${
                                        isCurrentWeek()
                                            ? 'text-gray-400 bg-gray-50'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Сегодня
                                </button>
                                <div className="h-5 w-px bg-gray-200"></div>
                                <button
                                    onClick={goToNextWeek}
                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                    title="Следующая неделя"
                                    aria-label="Следующая неделя"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="text-left">
                                <p className="text-xs text-gray-500">Показана неделя:</p>
                                <p className="text-sm font-medium text-gray-900">{weekStart} — {weekEnd}</p>
                            </div>
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
                                    className={`p-4 rounded-lg text-center border-2 ${
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
                <p className="text-xs text-gray-500 mt-2 text-center">
                    ℹ️ Демонстрация показывает режим "Неделя" (Пн-Вс). О режиме "Сегодня" читай в следующем разделе.
                </p>
            </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Кнопка "Сегодня" не реагирует — это ошибка?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, это нормально! Если ты уже на текущей неделе, кнопка <strong>заблокирована</strong> 
                        и становится блеклой. Это специально сделано, чтобы показать что ты уже "дома" — 
                        на текущей неделе. Нажать её нельзя, пока не уйдёшь в другую неделю.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Как далеко я могу переходить в будущее или прошлое?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Ты можешь переходить на столько недель вперед или назад, на сколько захочешь! 
                        В приложении нет ограничений. Это полезно для долгосрочного планирования контента или проверки старых постов.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Можно ли увидеть дни по одному, а не целыми неделями?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет прямого способа просмотра по одному дню. Но есть два <strong>режима отображения</strong>: 
                        "Неделя" (показывает 7 дней с понедельника по воскресенье) и "Сегодня" (показывает 7 дней начиная с текущего дня). 
                        Навигация работает одинаково в обоих режимах. Подробнее читай в разделе "Режимы отображения".
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Почему три кнопки объединены в один блок?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Единый блок создаёт визуальную группу и показывает, что это связанные действия для перемещения по времени. 
                        Это стандартный UX-паттерн для календарей и временных навигационных элементов. Разделительные линии между кнопками 
                        помогают визуально отличить каждую функцию, сохраняя единство блока.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Взаимодействие с режимами */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как навигация работает с режимами отображения?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация работает <strong>одинаково в обоих режимах</strong> — "Неделя" и "Сегодня". 
                Стрелки всегда перемещают на неделю вперёд/назад, а кнопка "Сегодня" возвращает на текущую неделю.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900 mb-2">
                    <strong>💡 Разница режимов:</strong>
                </p>
                <ul className="text-sm text-blue-800 space-y-2">
                    <li>
                        • <strong>Режим "Неделя"</strong> — показывает 7 дней с понедельника по воскресенье. 
                        Стрелки двигают на ровно одну календарную неделю.
                    </li>
                    <li>
                        • <strong>Режим "Сегодня"</strong> — показывает 7 дней начиная с сегодняшнего дня. 
                        Стрелки тоже двигают на 7 дней, но отсчёт идёт от сегодня.
                    </li>
                </ul>
                <p className="text-xs text-blue-700 mt-3">
                    💡 Подробнее о режимах читай в разделе "Режимы отображения".
                </p>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Три кнопки в едином блоке:</strong> стрелка влево (назад), кнопка "Сегодня" (вернуться), стрелка вправо (вперёд).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Стрелки перемещают календарь на <strong>одну неделю</strong> (7 дней) вперёд или назад.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка "Сегодня" <strong>блокируется</strong>, когда ты уже на текущей неделе.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Ограничений по времени нет — можно листать хоть на годы вперёд или назад.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Навигация работает <strong>одинаково</strong> в режимах "Неделя" и "Сегодня".</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Если ты часто планируешь контент на много недель вперед, 
                            <strong> используй режим "Сегодня"</strong> вместе с кнопкой "Вперед". 
                            Это позволит тебе видеть все дни относительно сегодняшнего дня, 
                            что удобнее для долгосрочного планирования. А кнопка "Сегодня" всегда вернёт тебя 
                            к актуальному моменту одним кликом.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons />
        </article>
    );
};
