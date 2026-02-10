import React, { useState } from 'react';
import { ContentProps, NavigationButtons, Sandbox } from '../shared';

export const VisibilityControls: React.FC<ContentProps> = ({ title }) => {
    const [notesState, setNotesState] = useState<'show' | 'collapse' | 'hide'>('show');
    const [tagsState, setTagsState] = useState<'show' | 'hide'>('show');

    const mockCalendarDay = [
        {
            id: 1,
            type: 'post',
            text: 'Новое меню на весну!',
            tag: { name: 'Продажи', color: 'blue' }
        },
        {
            id: 2,
            type: 'note',
            text: 'Позвонить Ивану (14:00)',
            color: 'yellow'
        },
        {
            id: 3,
            type: 'post',
            text: 'Спецпредложение выходного дня',
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

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> Управление видимостью помогает найти баланс между информацией и чистотой экрана. 
                    Ты можешь не только скрывать элементы, но и сворачивать их в компактный вид.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где это находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находятся кнопки?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопки управления видимостью расположены в <strong>правой части шапки календаря</strong>. 
                Это набор из 2 небольших серых кнопок с иконками. Иконки меняются в зависимости от текущего состояния.
            </p>

            <hr className="!my-10" />

            {/* Состояния видимости */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Состояния видимости</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Кнопки управления видимостью работают по-разному: <strong>заметки имеют три режима</strong>, 
                а <strong>теги — только два</strong>. Ты можешь циклически переключаться между ними нажимая на кнопку:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Состояние 1: Показать */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
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
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Состояние 2: Свернуть (Компактный вид)</h3>
                            <p className="text-sm text-gray-700">
                                Заметки остаются видны, но занимают меньше места — показывается время и название. 
                                Это состояние доступно только для заметок.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Состояние 3: Скрыть */}
                <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
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
                        <div>
                            <h3 className="font-bold text-yellow-900 mb-2">Заметки (Notes)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Кнопка имеет три состояния</strong>: Показать (полный текст) → Свернуть (время и название) → Скрыть (полностью).
                            </p>

                            <div className="bg-white rounded p-4 border border-yellow-200 text-sm text-gray-700 space-y-3 mb-4">
                                <p><strong>Что такое заметка?</strong></p>
                                <p>
                                    Это напоминание или личная пометка, которую ты создал двойным кликом на день 
                                    (например: "Позвонить менеджеру в 14:00" или "Проверить аналитику").
                                </p>
                            </div>

                            <div className="bg-green-50 rounded p-4 border border-green-200">
                                <p className="font-bold text-green-900 mb-2">Показать (полный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Видна полная информация о заметке (название, время, текст)</li>
                                    <li>Можно сразу понять, что нужно сделать</li>
                                </ul>
                            </div>

                            <div className="bg-orange-50 rounded p-4 border border-orange-200 mt-3">
                                <p className="font-bold text-orange-900 mb-2">Свернуть (компактный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Заметка видна, но в сокращённом виде (время и название)</li>
                                    <li>Занимает меньше места на экране</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded p-4 border border-red-200 mt-3">
                                <p className="font-bold text-red-900 mb-2">Скрыть (полностью):</p>
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
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Теги (Tags)</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                <strong>Кнопка имеет два состояния</strong>: Показать (полные теги) → Скрыть (полностью).
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
                                <p className="font-bold text-green-900 mb-2">Показать (полный вид):</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                                    <li>Видны полные теги с названиями и цветами</li>
                                    <li>Легко найти посты по категориям</li>
                                    <li>Максимум информации</li>
                                </ul>
                            </div>

                            <div className="bg-red-50 rounded p-4 border border-red-200 mt-3">
                                <p className="font-bold text-red-900 mb-2">Скрыть (полностью):</p>
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

            <Sandbox
                title="Управление видимостью элементов"
                description="Ниже находится макет календаря с кнопками управления видимостью. Попробуй переключать кнопки и смотри, как меняется содержимое дня."
                instructions={["Переключай состояния кнопки 'Заметки' (👁️ → 📋 → 🚫)", "Переключай состояния кнопки 'Теги' (👁️ → 🚫)", "Обрати внимание на изменения в ячейке календаря"]}
            >
            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6">
                {/* Шапка с кнопками */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-6">
                    <div className="flex items-center justify-between">
                        {/* Левая часть (навигация) */}
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded bg-gray-100 text-gray-700" aria-label="Предыдущая неделя">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span className="text-sm font-bold text-gray-800 min-w-[100px]">Янв 15 — 21</span>
                            <button className="p-2 rounded bg-gray-100 text-gray-700" aria-label="Следующая неделя">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Правая часть (видимость) */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    const states: ('show' | 'collapse' | 'hide')[] = ['show', 'collapse', 'hide'];
                                    const currentIndex = states.indexOf(notesState);
                                    setNotesState(states[(currentIndex + 1) % 3]);
                                }}
                                title={notesState === 'show' ? 'Свернуть заметки' : notesState === 'collapse' ? 'Скрыть заметки' : 'Показать заметки'}
                                aria-label={`Заметки: ${notesState === 'show' ? 'показаны' : notesState === 'collapse' ? 'свёрнуты' : 'скрыты'}`}
                                aria-pressed={notesState === 'show'}
                                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                {notesState === 'show' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                ) : notesState === 'collapse' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                    </svg>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setTagsState(tagsState === 'show' ? 'hide' : 'show');
                                }}
                                title={tagsState === 'show' ? 'Скрыть теги' : 'Показать теги'}
                                aria-label={`Теги: ${tagsState === 'show' ? 'показаны' : 'скрыты'}`}
                                aria-pressed={tagsState === 'show'}
                                className="p-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                {tagsState === 'show' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-2.572 4.293m-5.466-4.293a3 3 0 01-4.242-4.242" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                        Нажимай на иконки выше: первая кнопка управляет заметками (3 состояния), вторая — тегами (2 состояния). Иконки меняются при каждом нажатии.
                    </p>
                </div>

                {/* Содержимое дня */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <p className="font-bold text-gray-900 mb-4">Пн, 15 января</p>
                    
                    <div className="space-y-3">
                        {mockCalendarDay.map((item) => (
                            <div key={item.id}>
                                {item.type === 'post' ? (
                                    <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                                        <p className="text-sm font-bold text-gray-900">{item.text}</p>
                                        {tagsState === 'show' && item.tag && (
                                            <div className="mt-2">
                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${
                                                    item.tag.color === 'blue' ? 'bg-blue-500' :
                                                    item.tag.color === 'red' ? 'bg-red-500' :
                                                    'bg-green-500'
                                                }`}>
                                                    {item.tag.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : notesState !== 'hide' && item.type === 'note' ? (
                                    <div className={`rounded-lg p-3 border ${
                                        item.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50 border-gray-300'
                                    }`}>
                                        {notesState === 'show' ? (
                                            <p className="text-sm font-bold text-gray-900">{item.text}</p>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-gray-900">14:00</p>
                                                <p className="text-xs font-medium text-gray-900">Позвонить Ивану</p>
                                            </div>
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
            </Sandbox>

            <hr className="!my-10" />

            {/* Таблица состояний */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Состояния кнопок</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Кнопка</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Показать</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Свернуть</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-bold text-gray-900">Скрыть</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-white">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Заметки</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полный текст и информация</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Время и название</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полностью исчезают</td>
                        </tr>
                        <tr className="bg-white">
                            <td className="border border-gray-300 px-4 py-2 font-bold text-gray-900">Теги</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полные теги с названиями</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">—</td>
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Полностью исчезают</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Какая разница между "Свернуть" и "Скрыть"?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        <strong>Свернуть</strong> (только для заметок): Элементы остаются видны, но в сокращённом виде (компактный режим). 
                        <strong>Скрыть:</strong> Элементы полностью исчезают с экрана. Ничего не видно.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Если я скрою заметку, она удалится?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет! Скрытие — это временно. Заметка остаётся на сервере и вернётся, 
                        когда ты переключишься обратно на "Показать".
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Можно ли скрывать или сворачивать отдельные заметки?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, кнопки управляют <strong>всеми заметками сразу</strong>. 
                        Если ты хочешь скрыть одну заметку, нужно её удалить.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Теги назначаются автоматически?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да! Система сканирует текст поста и автоматически назначает теги 
                        по предустановленным правилам. Но ты можешь менять эти правила в настройках.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Какое состояние по умолчанию?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        По умолчанию обе кнопки находятся в режиме <strong>"Показать"</strong> (полный вид). 
                        Это максимум информации. При каждом открытии календаря видимость сбрасывается на показ всех элементов.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">Когда использовать "Свернуть"?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        "Свернуть" полезно для заметок, когда ты хочешь сэкономить место, но всё ещё видеть, что заметки есть. 
                        Заметка будет отображаться в сокращённом виде (время и название), но останется на экране.
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
                        <span><strong>Видимость ≠ удаление.</strong> Скрытые элементы остаются в системе и можно вернуть их в любой момент.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Заметки имеют <strong>3 режима</strong> (Показать → Свернуть → Скрыть), теги — <strong>2 режима</strong> (Показать → Скрыть).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>"Свернуть" доступно <strong>только для заметок</strong> — это компактный вид с сохранением времени и названия.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопки управления видимостью находятся в <strong>шапке календаря</strong> (правая секция).</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Комбинируй состояния для оптимизации пространства: свернуть заметки + скрыть теги = максимум места для постов.</span>
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
                        <p className="text-sm text-gray-700 mb-3">
                            Используй разные комбинации состояний для оптимизации пространства:
                        </p>
                        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            <li><strong>Свернуть заметки</strong> → видеть напоминания, но не весь текст</li>
                            <li><strong>Скрыть теги</strong> → максимум места для текста постов</li>
                            <li><strong>Скрыть заметки и теги полностью</strong> → максимум места для постов</li>
                        </ul>
                    </div>
                </div>
            </div>

            <NavigationButtons />
        </article>
    );
};
