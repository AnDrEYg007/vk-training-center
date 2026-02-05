import React from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Дневные колонки в сетке календаря
// =====================================================================
export const DayColumns: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Дневные колонки — это отдельные вертикальные блоки в сетке календаря. В каждой колонке отображается контент только одного дня: посты, заметки и истории, отсортированные по времени.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Каждая колонка — это самостоятельная зона для работы с контентом одного дня. Все действия (создание, просмотр, перемещение) происходят именно внутри колонки.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Структура дневной колонки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как устроена дневная колонка?</h2>

            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Заголовок дня</strong> — показывает день недели и дату. Сегодняшний день выделяется синей верхней границей и цветом текста.</li>
                <li><strong>Кнопка "+"</strong> — позволяет быстро создать пост на этот день (только для будущих дат).</li>
                <li><strong>Блок историй</strong> — если в этот день есть истории, они отображаются кружками под заголовком.</li>
                <li><strong>Содержимое дня</strong> — список постов и заметок, отсортированных по времени. Можно перетаскивать между днями (drag-and-drop).</li>
            </ul>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Интерактивная демонстрация дневной колонки</h3>
                <div className="grid grid-cols-3 gap-6">
                    {/* Пример: обычный день */}
                    <div className="border rounded-lg">
                        <div className="border-t-4 border-transparent text-center p-2">
                            <p className="font-bold text-xs text-gray-700">пн</p>
                            <p className="text-gray-500 text-[10px]">15.01</p>
                            <button className="w-full mt-1 p-1 border border-dashed border-gray-300 rounded text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors" title="Создать пост">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-2 min-h-[120px] space-y-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] text-indigo-600 mb-2">S</div>
                            <div className="p-2 rounded border bg-white border-gray-200 text-[10px]">10:00 Пост</div>
                            <div className="p-2 rounded border bg-white border-gray-200 text-[10px]">14:00 Заметка</div>
                        </div>
                    </div>
                    {/* Пример: сегодня */}
                    <div className="border rounded-lg">
                        <div className="border-t-4 border-t-indigo-500 text-center p-2">
                            <p className="font-bold text-xs text-indigo-600">ср</p>
                            <p className="text-gray-500 text-[10px]">17.01</p>
                            <button className="w-full mt-1 p-1 border border-dashed border-gray-300 rounded text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors" title="Создать пост">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-2 min-h-[120px] space-y-2">
                            <div className="w-6 h-6 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[8px] text-purple-600 mb-2">S</div>
                            <div className="p-2 rounded border bg-white border-gray-200 text-[10px]">09:00 Пост</div>
                            <div className="p-2 rounded border bg-white border-gray-200 text-[10px]">11:00 Заметка</div>
                        </div>
                    </div>
                    {/* Пример: прошедший день (кнопка + неактивна) */}
                    <div className="border rounded-lg">
                        <div className="border-t-4 border-transparent text-center p-2">
                            <p className="font-bold text-xs text-gray-400">вс</p>
                            <p className="text-gray-400 text-[10px]">14.01</p>
                            <button className="w-full mt-1 p-1 border border-dashed border-gray-300 rounded text-gray-300 cursor-not-allowed opacity-50" title="Нельзя создавать посты в прошлом" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-2 min-h-[120px] space-y-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[8px] text-indigo-600 mb-2">S</div>
                            <div className="p-2 rounded border bg-white border-gray-200 text-[10px]">12:00 Пост</div>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Наведи курсор на любую колонку, чтобы увидеть стилизацию и состояние кнопки.</p>
            </div>

            <hr className="!my-10" />

            {/* Особенности работы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работает дневная колонка?</h2>

            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li>Кнопка "+" активна только для будущих и текущих дней. Для прошедших дней она заблокирована и становится бледной.</li>
                <li>Двойной клик по пустому месту внутри колонки — быстрое создание заметки на этот день.</li>
                <li>При перетаскивании карточки на колонку фон становится синим (индиго).</li>
                <li>Сегодняшний день всегда выделен цветом и синей верхней границей.</li>
            </ul>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>
            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Почему нельзя создать пост в прошедший день?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Кнопка "+" становится неактивной для прошедших дат. Это сделано специально, чтобы не было путаницы с публикациями в прошлом.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как быстро добавить заметку на день?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Двойной клик по пустому месту внутри колонки сразу открывает окно создания заметки на этот день.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как работает перетаскивание карточек?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        При перетаскивании карточки на колонку фон становится синим (индиго), а после отпускания карточка перемещается на выбранный день.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как понять, какой сегодня день?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Сегодняшний день всегда выделен цветом текста и синей верхней границей в заголовке колонки.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700 mb-3">
                            Используй дневные колонки для визуального контроля загруженности недели. Если видишь, что в каком-то дне мало карточек — это отличный повод добавить туда пост или заметку.
                        </p>
                        <p className="text-sm text-gray-700">
                            Не забывай про быстрые действия: двойной клик для заметки, drag-and-drop для переноса карточек, кнопка "+" для создания поста.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Каждая колонка — это отдельный день недели</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Заголовок дня показывает день недели и дату, сегодня выделен цветом</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка "+" активна только для будущих и текущих дней</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Двойной клик по пустому месту — быстрое создание заметки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Drag-and-drop работает для переноса карточек между днями</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Сегодняшний день всегда выделен синей верхней границей</span>
                    </li>
                </ul>
            </div>
        </article>
    );
};
