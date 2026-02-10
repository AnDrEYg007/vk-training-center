import React, { useState } from 'react';
import { ContentProps, NavigationButtons, Sandbox } from '../shared';

// =====================================================================
// Основной компонент: Режимы отображения (Неделя vs Сегодня)
// =====================================================================
export const ViewModes: React.FC<ContentProps> = ({ title }) => {
    const [selectedMode, setSelectedMode] = useState<'week' | 'today'>('week');

    const today = new Date();
    
    // Режим "Неделя" - Пн-Вс (логика соответствует реальному коду)
    const getWeekDates = () => {
        const now = new Date(today);
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            week.push(day);
        }
        return week;
    };

    // Режим "Сегодня" - 7 дней начиная с сегодня
    const getTodayMode = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const weekDates = getWeekDates();
    const todayDates = getTodayMode();
    const displayDates = selectedMode === 'week' ? weekDates : todayDates;

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Календарь может отображать неделю <strong>двумя разными способами</strong>. 
                Это не просто визуальное отличие — это две разные логики организации времени, 
                каждая полезна в своей ситуации.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> У каждого режима свой смысл. 
                    "Неделя" — это календарный взгляд (Пн-Вс), а "Сегодня" — это относительный взгляд 
                    (7 дней начиная с сегодня).
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находятся режимы?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Переключатель режимов находится в <strong>левой части шапки календаря</strong>, 
                между отображением месяца и кнопками навигации (← Сегодня →). 
                Это <strong>две кнопки</strong> на сером фоне: "Неделя" и "Сегодня".
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700 mt-4">
                <strong>Как выглядит:</strong> Активная кнопка становится белой с тенью, 
                а неактивная остаётся серой. Нажми на любую, чтобы переключить режим.
            </p>

            <hr className="!my-10" />

            {/* Режим 1: Неделя */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим "Неделя" (Пн-Вс)</h2>

            <div className="not-prose border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg my-6">
                <div>
                    <h3 className="font-bold text-blue-900 mb-3">Классический календарный вид</h3>
                        
                        <div className="bg-white rounded p-4 border border-blue-200 mb-4">
                            <p className="font-bold text-gray-900 mb-3">Как это выглядит:</p>
                            <p className="text-sm text-gray-700 mb-2">
                                Календарь всегда показывает полную календарную неделю: 
                                <strong> понедельник, вторник, среду, четверг, пятницу, субботу и воскресенье</strong>.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                Неделя <strong>всегда начинается с понедельника</strong> и 
                                <strong> заканчивается воскресеньем</strong>, независимо от того, какой сегодня день.
                            </p>
                        </div>

                        <div className="bg-white rounded p-4 border border-blue-200 mb-4">
                            <p className="font-bold text-gray-900 mb-3">Пример:</p>
                            <p className="text-sm text-gray-700 mb-2">
                                Если сегодня вторник 17 января, в режиме "Неделя" ты видишь:
                            </p>
                            <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-800">
                                Пн 16 | Вт 17 (сегодня) | Ср 18 | Чт 19 | Пт 20 | Сб 21 | Вс 22
                            </div>
                        </div>

                        <div className="bg-green-50 rounded p-4 border border-green-200">
                            <p className="font-bold text-green-900 mb-2">✅ Когда использовать:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                <li>Хочешь видеть календарь в стандартном формате (как обычный календарь на стене)</li>
                                <li>Нужно быстро ориентироваться: "где начало недели, где конец"</li>
                                <li>Планируешь контент на полную неделю (Пн-Вс)</li>
                                <li>Нужно увидеть выходные дни отдельно</li>
                            </ul>
                        </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Режим 2: Сегодня */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим "Сегодня" (7 дней от сегодня)</h2>

            <div className="not-prose border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg my-6">
                <div>
                    <h3 className="font-bold text-purple-900 mb-3">Относительный "горизонт" дней</h3>
                        
                        <div className="bg-white rounded p-4 border border-purple-200 mb-4">
                            <p className="font-bold text-gray-900 mb-3">Как это выглядит:</p>
                            <p className="text-sm text-gray-700 mb-2">
                                Календарь показывает <strong>7 дней, начиная с сегодняшнего дня</strong>, 
                                независимо от того, какой день недели сегодня.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                Неделя <strong>всегда начинается с "сегодня"</strong> и 
                                <strong> заканчивается через 6 дней</strong>.
                            </p>
                        </div>

                        <div className="bg-white rounded p-4 border border-purple-200 mb-4">
                            <p className="font-bold text-gray-900 mb-3">Пример:</p>
                            <p className="text-sm text-gray-700 mb-2">
                                Если сегодня вторник 17 января, в режиме "Сегодня" ты видишь:
                            </p>
                            <div className="bg-gray-50 rounded p-3 text-sm font-mono text-gray-800">
                                Вт 17 (сегодня) | Ср 18 | Чт 19 | Пт 20 | Сб 21 | Вс 22 | Пн 23
                            </div>
                        </div>

                        <div className="bg-orange-50 rounded p-4 border border-orange-200">
                            <p className="font-bold text-orange-900 mb-2">✅ Когда использовать:</p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                <li>Хочешь видеть дни относительно сегодняшнего (а не Пн-Вс)</li>
                                <li>Планируешь контент на ближайшие 7 дней от сегодня</li>
                                <li>Удобнее думать "сегодня + 6 дней", а не "эта календарная неделя"</li>
                                <li>Работаешь срочно и нужна быстрая ориентация от "сейчас"</li>
                                <li>Выходные могут попасть в середину горизонта (зависит от дня недели)</li>
                            </ul>
                        </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивное сравнение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивное сравнение</h2>

            <Sandbox
                title="Сравнение режимов отображения"
                description="Нажми на кнопки ниже, чтобы увидеть разницу между двумя режимами. Обрати внимание, как меняется начало недели в каждом режиме."
                instructions={["Нажми 'Неделя' чтобы увидеть календарный формат (Пн-Вс)", "Нажми 'Сегодня' чтобы увидеть относительный формат (7 дней от сегодня)", "Сравни, как меняется позиция сегодняшнего дня (синяя точка)"]}
            >
            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6">
                {/* Переключатели */}
                <div className="flex gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setSelectedMode('week')}
                        aria-pressed={selectedMode === 'week'}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                            selectedMode === 'week'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Неделя
                    </button>
                    <button
                        onClick={() => setSelectedMode('today')}
                        aria-pressed={selectedMode === 'today'}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold ${
                            selectedMode === 'today'
                                ? 'bg-purple-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                    >
                        Сегодня
                    </button>
                </div>

                {/* Описание текущего режима */}
                <div className={`rounded-lg p-4 mb-4 ${
                    selectedMode === 'week'
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-purple-50 border border-purple-200'
                }`}>
                    <p className={`font-bold mb-2 ${
                        selectedMode === 'week' ? 'text-blue-900' : 'text-purple-900'
                    }`}>
                        {selectedMode === 'week'
                            ? 'Режим "Неделя": Пн-Вс (календарный формат)'
                            : 'Режим "Сегодня": 7 дней от сегодня (относительный горизонт)'}
                    </p>
                    <p className="text-sm text-gray-700">
                        {selectedMode === 'week'
                            ? 'Неделя всегда начинается с понедельника и заканчивается воскресеньем, независимо от текущего дня.'
                            : 'Неделя всегда начинается с сегодняшнего дня и показывает следующие 6 дней.'}
                    </p>
                </div>

                {/* Сетка дней */}
                <div className="grid grid-cols-7 gap-2">
                    {displayDates.map((date, idx) => {
                        const dayName = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][date.getDay() === 0 ? 6 : date.getDay() - 1];
                        const isToday = new Date().toDateString() === date.toDateString();
                        const monthName = date.toLocaleDateString('ru-RU', { month: 'short' });
                        
                        return (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg text-center border-2 ${
                                    isToday
                                        ? selectedMode === 'week'
                                            ? 'bg-blue-100 border-blue-500 shadow-md'
                                            : 'bg-purple-100 border-purple-500 shadow-md'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <p className="text-xs font-bold text-gray-600 mb-1">{dayName}</p>
                                <p className="text-lg font-bold text-gray-900">{date.getDate()}</p>
                                <p className="text-xs text-gray-500">{monthName}</p>
                                {isToday && (
                                    <p className={`text-xs font-bold mt-1 ${
                                        selectedMode === 'week' ? 'text-blue-600' : 'text-purple-600'
                                    }`}>
                                        ●
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    {selectedMode === 'week'
                        ? '● = Сегодня (вт)'
                        : '● = Сегодня (отправная точка)'}
                </p>
            </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Таблица сравнения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Таблица сравнения</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Параметр</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-blue-900">Неделя</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-purple-900">Сегодня</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Начало недели</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда понедельник</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда сегодня</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Конец недели</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда воскресенье</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Через 6 дней</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">По умолчанию показывает</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Текущую календарную неделю (Пн-Вс)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">7 дней начиная с сегодня</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Включает выходные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда (Сб-Вс)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Зависит от дня недели</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Лучше всего для</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Планирование недели (Пн-Вс)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Относительное планирование (от сегодня)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Какой режим использовать по умолчанию?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Оба полезны! Новички часто начинают с режима "Неделя", потому что это знакомый формат. 
                        Но "Сегодня" часто удобнее для планирования, если ты думаешь на "7 дней вперед".
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Могу ли я переключаться между режимами?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Да!</strong> Режимы переключаются одной кнопкой. 
                        Ты можешь менять их сколько угодно во время работы.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Если я в режиме "Сегодня", смогу ли я видеть прошлые дни?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Да!</strong> Используй кнопку со стрелкой "Назад" (←) в навигации. 
                        Она работает в обоих режимах. По умолчанию режим "Сегодня" показывает 7 дней начиная с сегодня, 
                        но ты можешь листать назад на любое количество недель.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Когда я нажимаю "Вперед", изменится ли режим?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, выбранный режим останется прежним. Если ты в режиме "Неделя", 
                        нажатие "Вперед" переведет тебя на следующую неделю (Пн-Вс). 
                        Если ты в режиме "Сегодня", переведет на +7 дней от текущего дня.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Два режима:</strong> "Неделя" (календарный Пн-Вс) и "Сегодня" (относительный от сегодня).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Режим "Неделя" <strong>всегда начинается с понедельника</strong> и заканчивается воскресеньем.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Режим "Сегодня" <strong>всегда начинается с текущей даты</strong> и показывает следующие 6 дней.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Переключение между режимами — <strong>одна кнопка</strong> в шапке календаря.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Навигация (← Сегодня →) работает <strong>одинаково в обоих режимах</strong>.</span>
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
                            Многие опытные пользователи используют <strong>режим "Сегодня"</strong> для 
                            <strong> срочной работы</strong> (быстрое планирование на неделю) 
                            и <strong>режим "Неделя"</strong> для <strong>просмотра архива</strong> 
                            (проверка прошлых постов). Экспериментируй с обоими режимами и выбери свой стиль!
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons />
        </article>
    );
};
