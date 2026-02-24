import React from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';
import { MockNoteCard, NOTE_COLORS } from './NotesMocks';

// =====================================================================
// Обзорная страница: Заметки
// =====================================================================
export const Notes: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Заметки — это личные записи, которые видны только вам и не публикуются в сообществе VK. Они помогают фиксировать важную информацию, напоминания и задачи прямо в календаре, рядом с постами проекта.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Заметки — это ваш личный блокнот внутри планировщика. Раньше приходилось держать задачи в голове или писать в отдельных приложениях. Теперь всё в одном месте — видите пост и сразу можете добавить заметку о нём.
                </p>
            </div>

            {/* Что такое заметка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что такое заметка?
            </h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                Заметка — это текстовая запись с датой и временем, которая отображается в календаре проекта. У каждой заметки есть:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Дата и время</strong> — когда заметка отображается в календаре</li>
                <li><strong>Название</strong> (необязательно) — краткий заголовок</li>
                <li><strong>Текст</strong> (обязательно) — основное содержание</li>
                <li><strong>Цвет</strong> — один из 7 цветов для визуального разделения</li>
            </ul>

            {/* Пример заметок */}
            <div className="not-prose">
                <Sandbox
                    title="Пример заметок разных цветов"
                    description="Вот как выглядят заметки в календаре. Они располагаются вместе с постами, отсортированные по времени."
                    instructions={[
                        'Каждая заметка имеет свой цвет для быстрого визуального поиска',
                        'Заметки с названием показывают его жирным шрифтом',
                        'Три кнопки справа: копировать, редактировать, удалить'
                    ]}
                >
                    <div className="space-y-3">
                        <MockNoteCard
                            time="09:00"
                            title="Встреча с командой"
                            text="Обсудить новые идеи для контента"
                            color={NOTE_COLORS[2].hex}
                        />
                        <MockNoteCard
                            time="14:00"
                            text="Позвонить клиенту по проекту «Кафе»"
                            color={NOTE_COLORS[0].hex}
                        />
                        <MockNoteCard
                            time="16:30"
                            title="Проверить статистику"
                            text="Собрать данные по охватам за неделю и подготовить отчёт"
                            color={NOTE_COLORS[3].hex}
                        />
                    </div>
                </Sandbox>
            </div>

            {/* Чем отличаются от постов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Чем заметки отличаются от постов?
            </h2>

            <div className="not-prose overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Характеристика</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Посты</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Заметки</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Публикация</td>
                            <td className="border border-gray-300 px-4 py-2">Публикуются в сообщество VK</td>
                            <td className="border border-gray-300 px-4 py-2"><strong>Только для вас</strong>, не публикуются</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Изображения</td>
                            <td className="border border-gray-300 px-4 py-2">Есть</td>
                            <td className="border border-gray-300 px-4 py-2">Нет</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Вложения</td>
                            <td className="border border-gray-300 px-4 py-2">Видео, опросы, документы</td>
                            <td className="border border-gray-300 px-4 py-2">Нет</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Цветовая маркировка</td>
                            <td className="border border-gray-300 px-4 py-2">По типу (опубликованный/отложенный/системный)</td>
                            <td className="border border-gray-300 px-4 py-2">7 цветов на выбор</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Назначение</td>
                            <td className="border border-gray-300 px-4 py-2">Контент для аудитории</td>
                            <td className="border border-gray-300 px-4 py-2">Личные напоминания и задачи</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Где используются */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Для чего нужны заметки?
            </h2>

            <div className="not-prose grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-green-900 mb-2">📌 Напоминания</h3>
                    <p className="text-sm text-green-800">
                        «Позвонить клиенту», «Проверить статистику», «Отправить отчёт» — все задачи фиксируются в день, когда их нужно выполнить.
                    </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-amber-900 mb-2">🗓️ Планирование</h3>
                    <p className="text-sm text-amber-800">
                        «Неделя скидок», «Запуск новой рубрики» — важные события, которые нужно держать в голове при планировании постов.
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-blue-900 mb-2">💡 Идеи</h3>
                    <p className="text-sm text-blue-800">
                        «Идея для конкурса», «Тема для сторис» — быстро записать мысль, чтобы не забыть.
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-purple-900 mb-2">📝 Координация</h3>
                    <p className="text-sm text-purple-800">
                        «Дизайнер в отпуске до 20.02», «Клиент просил не постить в выходные» — важные детали работы с проектом.
                    </p>
                </div>
            </div>

            {/* Привязка к проекту */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Привязка к проекту
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая заметка принадлежит конкретному проекту — это значит, что:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Заметки видны только в календаре этого проекта</li>
                <li>При переключении между проектами вы видите разные наборы заметок</li>
                <li>Заметки можно копировать в другие дни, но нельзя перенести в другой проект</li>
            </ul>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Используйте разные цвета для разных типов задач. Например, красный — срочные звонки, зелёный — идеи для контента, синий — встречи.
                </p>
            </div>

            {/* Отображение в календаре */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как заметки отображаются в календаре?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Заметки и посты объединяются в единый список и сортируются по времени. Это означает, что если у вас на 14:00 запланирована заметка «Звонок клиенту», а на 14:30 — отложенный пост, они будут идти друг за другом в хронологическом порядке.
            </p>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Заметки имеют точное время (часы и минуты), а не только дату. Это позволяет планировать задачи с точностью до минуты.
                </p>
            </div>

            {/* Связанные страницы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Подробнее о работе с заметками
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующих разделах вы узнаете все детали работы с заметками:
            </p>

            <div className="not-prose grid gap-3 my-6">
                <NavigationLink 
                    to="2-1-5-1-create-note"
                    title="Создание заметки"
                    description="Два способа создания: кнопка в шапке и двойной клик по дню"
                    variant="related"
                />
                <NavigationLink 
                    to="2-1-5-2-edit-note"
                    title="Редактирование заметки"
                    description="Как изменить текст, время или цвет существующей заметки"
                    variant="related"
                />
                <NavigationLink 
                    to="2-1-5-3-color-palette"
                    title="Цветовая палитра"
                    description="7 цветов для маркировки заметок и как их использовать"
                    variant="related"
                />
                <NavigationLink 
                    to="2-1-5-4-view-actions"
                    title="Просмотр и действия"
                    description="Просмотр, копирование, удаление и перетаскивание заметок"
                    variant="related"
                />
            </div>

            {/* FAQ */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Видят ли мои коллеги мои заметки?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Заметки видны только вам — это ваш личный блокнот. Если нужно поделиться информацией с командой, используйте системные посты или общий чат проекта.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли прикрепить изображение к заметке?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, заметки — это только текст. Если нужно сохранить изображение или файл, создайте системный пост (он тоже не публикуется в VK, но поддерживает медиа).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Сколько заметок можно создать?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Ограничений нет. Создавайте столько заметок, сколько нужно для комфортной работы.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли скрыть заметки из календаря?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да! В правой части шапки календаря есть переключатель видимости. Он циклически меняет три состояния: развёрнутые заметки → свёрнутые заметки → скрытые заметки. Подробнее в разделе <NavigationLink to="2-1-2-3-visibility-controls" title="Управление видимостью" variant="related" />.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Удаляются ли заметки автоматически?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Заметки хранятся бессрочно, пока вы их не удалите вручную. Старые заметки остаются в календаре и доступны при прокрутке назад по датам.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Заметки приватны</strong> — видны только вам, не публикуются в VK</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Отображаются вместе с постами</strong> — единый список по хронологии</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Имеют точное время</strong> — дата + часы и минуты</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>7 цветов</strong> — для визуального разделения задач</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Привязаны к проекту</strong> — нельзя перенести в другой проект, только скопировать в другой день</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-5-notes" />
        </article>
    );
};
