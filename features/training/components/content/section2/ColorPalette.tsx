import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { NOTE_COLORS, ColorPaletteDemo } from './NotesMocks';

// =====================================================================
// Цветовая палитра заметок
// =====================================================================
export const ColorPalette: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая заметка может быть окрашена в один из 7 цветов. Это помогает визуально группировать задачи по типу, приоритету или тематике — вы сами решаете, что означает каждый цвет в вашей системе работы.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Цвета — это ваш личный «язык» для быстрого поиска. Открыв календарь, вы сразу видите: красные — срочные, зелёные — идеи, синие — встречи. Не нужно читать текст каждой заметки.
                </p>
            </div>

            {/* Все 7 цветов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Доступные цвета
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Палитра состоит из 7 пастельных оттенков. Они подобраны так, чтобы не раздражать глаз при долгой работе с календарём:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Цвет</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">HEX-код</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Пример использования</th>
                        </tr>
                    </thead>
                    <tbody>
                        {NOTE_COLORS.map((color, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                <td className="border border-gray-300 px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-8 h-8 rounded-full border-2 border-gray-300"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <span className="font-medium">{color.name}</span>
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 font-mono text-xs">
                                    {color.hex}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-gray-700">
                                    {index === 0 && 'Срочные задачи, дедлайны, важные звонки'}
                                    {index === 1 && 'Финансовые вопросы, счета, оплаты'}
                                    {index === 2 && 'Идеи для контента, креативные задачи'}
                                    {index === 3 && 'Встречи, звонки, коммуникации'}
                                    {index === 4 && 'Аналитика, отчёты, проверки'}
                                    {index === 5 && 'Планирование, долгосрочные задачи'}
                                    {index === 6 && 'Личные дела, напоминания'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Примеры использования в таблице — это всего лишь рекомендации. Вы можете создать свою систему цветов: например, разделять заметки по клиентам, проектам или дням недели.
                </p>
            </div>

            {/* Интерактивная демонстрация */}
            <div className="not-prose">
                <Sandbox
                    title="Интерактивная палитра"
                    description="Кликайте по цветам, чтобы увидеть, как выглядит заметка каждого оттенка."
                    instructions={[
                        'Обратите внимание на разницу в яркости',
                        'Все цвета хорошо различимы даже при беглом просмотре',
                        'Текст всегда тёмный для лучшей читаемости'
                    ]}
                >
                    <ColorPaletteDemo />
                </Sandbox>
            </div>

            {/* Цвет по умолчанию */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Цвет по умолчанию
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы создаёте новую заметку, автоматически выбирается <strong>красный цвет (#FEE2E2)</strong>. Это сделано специально:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Красный привлекает внимание</strong> — новые задачи сразу бросаются в глаза</li>
                <li><strong>Стимулирует действовать</strong> — красный подсознательно ассоциируется с важностью</li>
                <li><strong>Первый в списке</strong> — не нужно искать, куда кликнуть при создании</li>
            </ul>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Можете сразу изменить цвет при создании заметки или оставить красным и изменить позже при редактировании. Цвет можно менять сколько угодно раз.
                </p>
            </div>

            {/* Как выбрать цвет */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как выбрать цвет при создании или редактировании?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В форме создания или редактирования заметки есть 7 круглых кнопок — каждая окрашена в свой цвет. Просто кликните по нужной:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Откройте форму создания или редактирования</li>
                <li>Под текстом заметки увидите строку из 7 цветных кружков</li>
                <li>Кликните по любому — он выделится белой обводкой</li>
                <li>Сохраните заметку — цвет применится</li>
            </ol>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Мгновенный выбор:</strong> Не нужно вводить HEX-коды или искать цвета в выпадающем списке. Всего один клик — и цвет выбран.
                </p>
            </div>

            {/* Где отображается цвет */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Где виден цвет заметки?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Цвет заметки виден в двух местах:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">1. В календаре (карточка)</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Весь фон карточки окрашен в выбранный цвет. Это самое заметное место — именно здесь цвет работает как визуальный маркер.
                    </p>
                    <div className="bg-red-100 border border-red-200 rounded p-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <div className="text-xs text-gray-600">09:00</div>
                                <div className="text-sm font-semibold text-gray-900 mt-1">Пример красной заметки</div>
                                <div className="text-sm text-gray-700 mt-1">Весь фон окрашен</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">2. В окне просмотра (заголовок)</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        Верхняя часть окна просмотра (где дата и время) окрашена в цвет заметки, но более насыщенный. Остальное окно — белое.
                    </p>
                    <div className="border border-gray-300 rounded overflow-hidden">
                        <div className="bg-red-200 border-b border-red-300 p-3">
                            <div className="text-xs text-gray-700">Заголовок окна</div>
                        </div>
                        <div className="bg-white p-3">
                            <div className="text-xs text-gray-600">Основное содержание — белый фон</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Примеры систем цветов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Примеры систем использования цветов
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Разные команды используют цвета по-разному. Вот несколько популярных подходов:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">📌 По приоритету</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li><span className="inline-block w-3 h-3 rounded-full bg-red-200 mr-2"></span>Красный — срочно и важно</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-amber-200 mr-2"></span>Янтарный — важно, но не срочно</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-green-200 mr-2"></span>Зелёный — можно отложить</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-gray-200 mr-2"></span>Остальные — второстепенные задачи</li>
                    </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">🗂️ По типу задачи</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li><span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-2"></span>Синий — встречи и созвоны</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-green-200 mr-2"></span>Зелёный — идеи для контента</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-purple-200 mr-2"></span>Фиолетовый — аналитика и отчёты</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-amber-200 mr-2"></span>Янтарный — финансы</li>
                    </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">👥 По клиентам (если работаете с несколькими)</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                        <li><span className="inline-block w-3 h-3 rounded-full bg-red-200 mr-2"></span>Красный — клиент А</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-blue-200 mr-2"></span>Синий — клиент Б</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-green-200 mr-2"></span>Зелёный — клиент В</li>
                        <li><span className="inline-block w-3 h-3 rounded-full bg-amber-200 mr-2"></span>Янтарный — общие задачи</li>
                    </ul>
                </div>
            </div>

            {/* FAQ */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли добавить свои цвета?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, палитра фиксированная — 7 цветов. Это сделано для единообразия и простоты выбора. Если бы цветов было больше, выбирать стало бы сложнее.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли изменить цвет сразу у нескольких заметок?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, массовое редактирование не поддерживается. Каждую заметку нужно открыть и изменить индивидуально.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Почему цвета пастельные, а не яркие?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Пастельные тона меньше утомляют глаза при длительной работе. Яркие цвета отвлекают от содержания и быстро надоедают.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли фильтровать заметки по цвету?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, такой функции пока нет. Все заметки отображаются вместе в хронологическом порядке. Но благодаря цветам вы быстро найдёте нужную визуально.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что делать, если 7 цветов не хватает для всех категорий?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Комбинируйте цвета с названиями заметок. Например, все встречи — синие, но в названии пишите «Клиент А» или «Клиент Б». Так вы получите подкатегории внутри одного цвета.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>7 пастельных цветов</strong> — фиксированная палитра для всех заметок</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Красный по умолчанию</strong> — привлекает внимание к новым задачам</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Цвет виден в двух местах:</strong> фон карточки + заголовок окна просмотра</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Создайте свою систему:</strong> приоритеты, типы задач, клиенты — решаете вы</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Мгновенное изменение:</strong> один клик при создании или редактировании</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-5-3-color-palette" />
        </article>
    );
};
