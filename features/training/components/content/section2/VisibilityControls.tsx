import React, { useState } from 'react';
import { ContentProps } from '../shared';

export const VisibilityControls: React.FC<ContentProps> = ({ title }) => {
    const [notesState, setNotesState] = useState<'show' | 'collapse' | 'hide'>('show');
    const [tagsState, setTagsState] = useState<'show' | 'collapse' | 'hide'>('show');

    const mockCalendarDay = [
        {
            id: 1,
            type: 'post',
            text: '🍕 Новое меню на весну!',
            tag: { name: 'Продажи', color: 'blue' }
        },
        {
            id: 2,
            type: 'note',
            text: '⏰ Позвонить Ивану (14:00)',
            color: 'yellow'
        },
        {
            id: 3,
            type: 'post',
            text: '🎉 Спецпредложение выходного дня',
            tag: { name: 'Акции', color: 'red' }
        }
    ];

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Календарь содержит разные типы элементов: <strong>посты, заметки и теги</strong>. 
                Иногда их так много, что они загромождают экран. Для этого есть 
                <strong> кнопки управления видимостью</strong> — они позволяют показать, свернуть или полностью скрыть эти элементы.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Управление видимостью помогает найти баланс между информацией и чистотой экрана. 
                    Ты можешь не только скрывать элементы, но и сворачивать их в компактный вид.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находятся кнопки?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопки управления видимостью расположены в <strong>шапке календаря, справа от кнопок режимов</strong>. 
                Это набор из 2-3 кнопок, которые обычно выглядят как <strong>иконки глаза (👁️) или переключатели</strong>.
            </p>

            <hr className="!my-10" />

            {/* Три состояния видимости */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Три состояния видимости</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Каждая кнопка управления видимостью имеет <strong>три режима работы</strong>. 
                Ты можешь циклически переключаться между ними одного нажатия на кнопку:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Состояние 1: Показать */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">👁️</div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Состояние 1: Показать (Полный вид)</h3>
                            <p className="text-sm text-gray-700">
                                Все элементы (заметки или теги) видны в полном размере с полной информацией.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Состояние 2: Свернуть */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📦</div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Состояние 2: Свернуть (Компактный вид)</h3>
                            <p className="text-sm text-gray-700">
                                Элементы остаются видны, но занимают меньше места. Например, заметка показывает только название, 
                                а тег отображается как маленький ярлычок без текста.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Состояние 3: Скрыть */}
                <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">🚫</div>
                        <div>
                            <h3 className="font-bold text-red-900 mb-2">Состояние 3: Скрыть (Полностью скрыто)</h3>
                            <p className="text-sm text-gray-700">
                                Элементы полностью исчезают с экрана. Но не удаляются — они остаются на сервере 
                                и вернутся, если ты переключишься обратно на "Показать".
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Из чего состоит */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Какие элементы можно управлять?</h2>

            <div className="not-prose space-y-6 my-8">
                {/* Элемент 1: Заметки */}
                <div className="border-l-4 border-yellow-400 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📝</div>
                        <div>
                            <h3 className="font-bold text-yellow-900 mb-2">Заметки (Notes)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Кнопка имеет три состояния</strong>: Показать (полный текст) → Свернуть (только название) → Скрыть (полностью).
                            </p>

                            <div className="bg-white rounded p-4 border border-yellow-200 text-sm text-gray-700 space-y-3 mb-4">
                                <p><strong>Что такое заметка?</strong></p>
                                <p>
                                    Это напоминание или личная пометка, которую ты создал двойным кликом на день 
                                    (например: "Позвонить менеджеру в 14:00" или "Проверить аналитику").
                                </p>
                            </div>

                            <div className="bg-green-50 rounded p-4 border border-green-200">
                                <p className="font-bold text-green-900 mb-2">👁️ Показать (полный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Видна полная информация о заметке (название, время, текст)</li>
                                    <li>Можно сразу понять, что нужно сделать</li>
                                </ul>
                            </div>

                            <div className="bg-orange-50 rounded p-4 border border-orange-200 mt-3">
                                <p className="font-bold text-orange-900 mb-2">📦 Свернуть (компактный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Заметка видна, но в сокращённом виде (только название)</li>
                                    <li>Занимает меньше места на экране</li>
                                    <li>При наведении можно увидеть полный текст</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded p-4 border border-red-200 mt-3">
                                <p className="font-bold text-red-900 mb-2">🚫 Скрыть (полностью):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Заметка полностью исчезает с экрана</li>
                                    <li>Нужно сосредоточиться только на постах</li>
                                    <li>Показываешь календарь клиенту (скрыть личное)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Элемент 2: Теги */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">🏷️</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Теги (Tags)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Кнопка имеет три состояния</strong>: Показать (полные теги) → Свернуть (только иконки) → Скрыть (полностью).
                            </p>

                            <div className="bg-white rounded p-4 border border-purple-200 text-sm text-gray-700 space-y-3 mb-4">
                                <p><strong>Что такое теги?</strong></p>
                                <p>
                                    Это маленькие цветные ярлычки с названиями категорий постов 
                                    (например: "Продажи", "Новости", "Конкурс"). Теги назначаются автоматически 
                                    по ключевым словам в тексте поста.
                                </p>
                            </div>

                            <div className="bg-green-50 rounded p-4 border border-green-200">
                                <p className="font-bold text-green-900 mb-2">👁️ Показать (полный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Видны полные теги с названиями и цветами</li>
                                    <li>Легко найти посты по категориям</li>
                                    <li>Максимум информации</li>
                                </ul>
                            </div>

                            <div className="bg-orange-50 rounded p-4 border border-orange-200 mt-3">
                                <p className="font-bold text-orange-900 mb-2">📦 Свернуть (компактный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Теги остаются видны, но показывают только цветные иконки/точки</li>
                                    <li>Займет намного меньше места</li>
                                    <li>При наведении можно увидеть название тега</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded p-4 border border-red-200 mt-3">
                                <p className="font-bold text-red-900 mb-2">🚫 Скрыть (полностью):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Теги полностью исчезают с экрана</li>
                                    <li>Максимально чистый вид (видны только посты)</li>
                                    <li>Хочешь увидеть больше текста постов</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный демо */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивный демо</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Ниже находится <strong>макет календаря с кнопками управления видимостью</strong>. 
                Попробуй переключать кнопки и смотри, как меняется содержимое дня:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                {/* Шапка с кнопками */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        {/* Левая часть (навигация) */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">⬅️</button>
                            <span className="text-sm font-bold text-gray-800 min-w-[100px]">Янв 15 — 21</span>
                            <button className="p-2 rounded bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">➡️</button>
                        </div>

                        {/* Правая часть (видимость) */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const states: ('show' | 'collapse' | 'hide')[] = ['show', 'collapse', 'hide'];
                                    const currentIndex = states.indexOf(notesState);
                                    setNotesState(states[(currentIndex + 1) % 3]);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                                    notesState === 'show'
                                        ? 'bg-green-100 border-2 border-green-400 text-green-900'
                                        : notesState === 'collapse'
                                        ? 'bg-orange-100 border-2 border-orange-400 text-orange-900'
                                        : 'bg-red-100 border-2 border-red-400 text-red-900'
                                }`}
                            >
                                📝 Заметки {notesState === 'show' ? '👁️' : notesState === 'collapse' ? '📦' : '🚫'}
                            </button>
                            <button
                                onClick={() => {
                                    const states: ('show' | 'collapse' | 'hide')[] = ['show', 'collapse', 'hide'];
                                    const currentIndex = states.indexOf(tagsState);
                                    setTagsState(states[(currentIndex + 1) % 3]);
                                }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold transition-all ${
                                    tagsState === 'show'
                                        ? 'bg-green-100 border-2 border-green-400 text-green-900'
                                        : tagsState === 'collapse'
                                        ? 'bg-orange-100 border-2 border-orange-400 text-orange-900'
                                        : 'bg-red-100 border-2 border-red-400 text-red-900'
                                }`}
                            >
                                🏷️ Теги {tagsState === 'show' ? '👁️' : tagsState === 'collapse' ? '📦' : '🚫'}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                        Нажимай кнопки, чтобы циклически переключаться: Показать → Свернуть → Скрыть → Показать...
                    </p>
                </div>

                {/* Содержимое дня */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <p className="font-bold text-gray-900 mb-4">Пн, 15 января</p>
                    
                    <div className="space-y-3">
                        {mockCalendarDay.map((item) => (
                            <div key={item.id}>
                                {item.type === 'post' ? (
                                    <div className="border border-indigo-300 rounded-lg p-3 bg-indigo-50">
                                        <p className="text-sm font-bold text-gray-900">{item.text}</p>
                                        {tagsState !== 'hide' && item.tag && (
                                            <div className="mt-2">
                                                {tagsState === 'show' ? (
                                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold text-white ${
                                                        item.tag.color === 'blue' ? 'bg-blue-500' :
                                                        item.tag.color === 'red' ? 'bg-red-500' :
                                                        'bg-green-500'
                                                    }`}>
                                                        {item.tag.name}
                                                    </span>
                                                ) : (
                                                    <span className={`inline-block w-3 h-3 rounded-full ${
                                                        item.tag.color === 'blue' ? 'bg-blue-500' :
                                                        item.tag.color === 'red' ? 'bg-red-500' :
                                                        'bg-green-500'
                                                    }`} title={item.tag.name}></span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : notesState !== 'hide' && item.type === 'note' ? (
                                    <div className={`rounded-lg p-3 border-2 border-dashed ${
                                        item.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-300'
                                    }`}>
                                        {notesState === 'show' ? (
                                            <p className="text-sm font-bold text-gray-900">{item.text}</p>
                                        ) : (
                                            <p className="text-xs font-bold text-gray-900">Заметка...</p>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {notesState === 'hide' && tagsState === 'hide' && (
                        <p className="text-sm text-gray-600 mt-4 italic text-center">
                            (Заметки и теги скрыты — видны только тексты постов)
                        </p>
                    )}
                    
                    {notesState === 'hide' && tagsState !== 'hide' && (
                        <p className="text-xs text-gray-500 mt-4 italic">
                            (Заметки скрыты)
                        </p>
                    )}

                    {tagsState === 'hide' && notesState !== 'hide' && (
                        <p className="text-xs text-gray-500 mt-4 italic">
                            (Теги скрыты)
                        </p>
                    )}
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Нажимай кнопки выше, чтобы переключать видимость элементов
                </p>
            </div>

            <hr className="!my-10" />

            {/* Таблица состояний */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Состояния кнопок</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Кнопка</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">👁️ Показать</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">📦 Свернуть</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">🚫 Скрыть</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">📝 Заметки</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полный текст и информация</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Только название/иконка</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полностью исчезают</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">🏷️ Теги</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полные теги с названиями</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Только цветные иконки/точки</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полностью исчезают</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Частые ошибки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Какая разница между "Свернуть" и "Скрыть"?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Свернуть:</strong> Элементы остаются видны, но в сокращённом виде (компактный режим). 
                        <strong>Скрыть:</strong> Элементы полностью исчезают с экрана. Ничего не видно.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Если я скрою заметку, она удалится?</p>
                    <p className="text-sm text-gray-700">
                        Нет! Скрытие — это временно. Заметка остаётся на сервере и вернётся, 
                        когда ты переключишься обратно на "Показать".
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли скрывать/сворачивать отдельные заметки?</p>
                    <p className="text-sm text-gray-700">
                        Нет, кнопки управляют <strong>всеми заметками сразу</strong>. 
                        Если ты хочешь скрыть одну заметку, нужно её удалить (нажать на иконку 🗑️).
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Теги назначаются автоматически?</p>
                    <p className="text-sm text-gray-700">
                        Да! Система сканирует текст поста и автоматически назначает теги 
                        по предустановленным правилам. Но ты можешь менять эти правила в настройках.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Какое состояние по умолчанию?</p>
                    <p className="text-sm text-gray-700">
                        По умолчанию обе кнопки находятся в режиме <strong>"Показать"</strong> (полный вид). 
                        Это максимум информации. Ты можешь менять состояния по своему усмотрению.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Сохраняется ли мой выбор (состояние кнопок)?</p>
                    <p className="text-sm text-gray-700">
                        Да! Приложение <strong>запоминает твой выбор</strong>. 
                        Если ты свернул теги, они останут свёрнутыми, пока ты не измениш их состояние 
                        (даже если перезагрузишь приложение).
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Когда использовать "Свернуть"?</p>
                    <p className="text-sm text-gray-700">
                        "Свернуть" полезно, когда ты хочешь сэкономить место, но всё ещё видеть, что элементы есть. 
                        Например, свернуть теги в иконки — видишь категории, но меньше текста занимает место.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Совет */}
            <div className="not-prose bg-green-50 border-l-4 border-green-400 pl-4 py-3 rounded-lg">
                <p className="text-green-900 font-bold mb-2">💚 Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700 mb-3">
                    Используй <strong>"Свернуть"</strong> как промежуточный вариант:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li><strong>Свернуть теги</strong> → сэкономить место, но видеть категории (как иконки)</li>
                    <li><strong>Свернуть заметки</strong> → видеть напоминания (галочки), но не весь текст</li>
                    <li><strong>Скрыть полностью</strong> → максимум места для постов</li>
                </ul>
            </div>
        </article>
    );
};
