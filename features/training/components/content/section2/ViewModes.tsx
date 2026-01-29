import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Режимы отображения (Неделя vs Сегодня)
// =====================================================================
export const ViewModes: React.FC<ContentProps> = ({ title }) => {
    const [selectedMode, setSelectedMode] = useState<'week' | 'today'>('week');

    const today = new Date();
    
    // Режим "Неделя" - Пн-Вс
    const getWeekDates = () => {
        const curr = new Date(today);
        const first = curr.getDate() - curr.getDay() + 1;
        const firstDay = new Date(curr.setDate(first));
        
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(firstDay);
            day.setDate(firstDay.getDate() + i);
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

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> У каждого режима свой смысл. 
                    "Неделя" — это календарный взгляд (Пн-Вс), а "Сегодня" — это относительный взгляд 
                    (7 дней начиная с сегодня).
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находятся режимы?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Рядом с кнопками навигации (⬅️ Назад, диапазон дат, ➡️ Вперед) находятся 
                <strong> две кнопки переключения режимов</strong>. На них написано "Неделя" и "Сегодня".
            </p>

            <hr className="!my-10" />

            {/* Режим 1: Неделя */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим 1️⃣: Неделя (Пн-Вс)</h2>

            <div className="not-prose border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg my-6">
                <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0">📅</div>
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
                                Пн 15 | Вт 16 | Ср 17 (сегодня) | Чт 18 | Пт 19 | Сб 20 | Вс 21
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
            </div>

            <hr className="!my-10" />

            {/* Режим 2: Сегодня */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режим 2️⃣: Сегодня (7 дней от сегодня)</h2>

            <div className="not-prose border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg my-6">
                <div className="flex items-start gap-3">
                    <div className="text-4xl flex-shrink-0">🎯</div>
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
                                <li>Сосредоточен на "сейчас и будущее" (нет прошлого)</li>
                                <li>Планируешь контент на ближайшие 7 дней (горизонт планирования)</li>
                                <li>Хочешь видеть только релевантные дни (без прошлых дней недели)</li>
                                <li>Работаешь срочно и нужна "авангард" перспектива</li>
                                <li>Нужно спланировать на выходные (они видны в конце вашего горизонта)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивное сравнение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивное сравнение</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Нажми на кнопки ниже, чтобы увидеть разницу между двумя режимами:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                {/* Переключатели */}
                <div className="flex gap-3 mb-6 bg-white p-4 rounded-lg border border-gray-200">
                    <button
                        onClick={() => setSelectedMode('week')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                            selectedMode === 'week'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        📅 Неделя
                    </button>
                    <button
                        onClick={() => setSelectedMode('today')}
                        className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all ${
                            selectedMode === 'today'
                                ? 'bg-purple-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        🎯 Сегодня
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
                            ? '📅 Режим "Неделя": Пн-Вс (календарный формат)'
                            : '🎯 Режим "Сегодня": 7 дней от сегодня (относительный горизонт)'}
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
                                className={`p-3 rounded-lg text-center border-2 transition-all ${
                                    isToday
                                        ? selectedMode === 'week'
                                            ? 'bg-blue-100 border-blue-500 shadow-md'
                                            : 'bg-purple-100 border-purple-500 shadow-md'
                                        : 'bg-white border-gray-200 hover:border-gray-400'
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

            <hr className="!my-10" />

            {/* Таблица сравнения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Таблица сравнения</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Параметр</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-blue-900">📅 Неделя</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-purple-900">🎯 Сегодня</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Начало недели</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда понедельник</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда сегодня</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Конец недели</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда воскресенье</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Через 6 дней</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Включает прошлые дни</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Да (если сегодня не Пн)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Никогда</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Включает выходные</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Всегда (Сб-Вс)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Зависит от дня недели</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Лучше всего для</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Планирование недели (Пн-Вс)</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Короткий горизонт (7 дней вперед)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Частые ошибки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Какой режим использовать по умолчанию?</p>
                    <p className="text-sm text-gray-700">
                        Оба полезны! Новички часто начинают с режима "Неделя", потому что это знакомый формат. 
                        Но "Сегодня" часто удобнее для планирования, если ты думаешь на "7 дней вперед".
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Могу ли я переключаться между режимами?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Да!</strong> Режимы переключаются одной кнопкой. 
                        Ты можешь менять их сколько угодно во время работы.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Если я в режиме "Сегодня", смогу ли я видеть прошлые дни?</p>
                    <p className="text-sm text-gray-700">
                        Нет, это сделано нарочно. В режиме "Сегодня" ты видишь только релевантные дни 
                        (текущий и будущие). Чтобы увидеть прошлые дни, переключись на режим "Неделя".
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Когда я нажимаю "Вперед", изменится ли режим?</p>
                    <p className="text-sm text-gray-700">
                        Нет, выбранный режим останется прежним. Если ты в режиме "Неделя", 
                        нажатие "Вперед" переведет тебя на следующую неделю (Пн-Вс). 
                        Если ты в режиме "Сегодня", переведет на +7 дней от текущего дня.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Совет */}
            <div className="not-prose bg-green-50 border-l-4 border-green-400 pl-4 py-3 rounded-lg">
                <p className="text-green-900 font-bold mb-2">💚 Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700">
                    Многие опытные пользователи используют <strong>режим "Сегодня"</strong> для 
                    <strong> срочной работы</strong> (быстрое планирование на неделю) 
                    и <strong>режим "Неделя"</strong> для <strong>просмотра архива</strong> 
                    (проверка прошлых постов). Выбери свой стиль!
                </p>
            </div>
        </article>
    );
};
