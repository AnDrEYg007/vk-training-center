import React from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';
import { NoteFormDemo } from './NotesMocks';

// =====================================================================
// Создание заметки
// =====================================================================
export const CreateNote: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Создать заметку в планировщике можно двумя способами: через кнопку в шапке календаря или двойным кликом по нужному дню. Оба варианта открывают одну и ту же форму с полями для ввода информации.
            </p>

            {/* Два способа создания */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Два способа создания
            </h2>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Выбирайте способ в зависимости от ситуации. Кнопка — когда создаёте заметку на будущее. Двойной клик — когда планируете что-то на конкретный день, который видите перед собой.
                </p>
            </div>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Способ</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Действие</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Дата по умолчанию</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Когда удобно</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Кнопка ✏️</td>
                            <td className="border border-gray-300 px-4 py-2">Клик по кнопке в правой части шапки</td>
                            <td className="border border-gray-300 px-4 py-2">Сегодня + текущее время</td>
                            <td className="border border-gray-300 px-4 py-2">Быстрое создание на сегодня</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Двойной клик</td>
                            <td className="border border-gray-300 px-4 py-2">Дважды кликнуть по пустому месту дня</td>
                            <td className="border border-gray-300 px-4 py-2">Выбранный день + 09:00 (или текущее, если сегодня)</td>
                            <td className="border border-gray-300 px-4 py-2">Планирование на конкретный день</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose my-6">
                <p className="text-sm text-gray-600 mb-2">Подробнее об этих способах:</p>
                <div className="grid gap-3">
                    <NavigationLink 
                        to="2-1-2-6-create-note-button"
                        title="Кнопка создания заметки"
                        description="Где находится кнопка и как ей пользоваться"
                        variant="related"
                    />
                    <NavigationLink 
                        to="2-1-3-4-quick-note"
                        title="Быстрое создание заметки"
                        description="Двойной клик по дню для мгновенного создания"
                        variant="related"
                    />
                </div>
            </div>

            {/* Поля формы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Поля формы создания
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда форма открывается, вы видите следующие поля:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                1. Дата и время
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Два поля рядом: дата (календарь) и время (часы:минуты). Эти поля определяют, когда заметка появится в календаре.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Дата</strong> — выбирается через стандартный календарь браузера</li>
                <li><strong>Время</strong> — вводится вручную в формате ЧЧ:ММ (например, 14:30)</li>
                <li><strong>Умные значения:</strong> если создаёте заметку на сегодня — предлагается текущее время, если на будущее — 09:00</li>
            </ul>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Заметки имеют точное время (часы и минуты), а не только дату. Это позволяет планировать задачи с точностью до минуты и видеть их в календаре в правильной хронологической последовательности с постами.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                2. Название (необязательно)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Краткий заголовок заметки. Это поле можно оставить пустым — заметка всё равно сохранится. Название отображается жирным шрифтом над основным текстом, поэтому удобно для быстрого поиска глазами.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Используйте название для ключевых слов. Например, «Клиент Иванов», «Конкурс», «Отчёт» — так легче найти нужную заметку среди других.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                3. Текст заметки (обязательно)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Основное содержание заметки. Это единственное обязательное поле — без текста кнопка «Сохранить» будет неактивна. Можно вводить многострочный текст, переносы строк сохраняются.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Минимальная длина — 1 символ</li>
                <li>Максимальная длина — не ограничена (но длинные тексты лучше разбивать на несколько заметок)</li>
                <li>Поддерживаются переносы строк — нажмите Enter для новой строки</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                4. Цвет
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Выбор одного из 7 цветов для визуальной маркировки. По умолчанию выбран красный цвет. Цвет влияет на фон карточки заметки в календаре и на цвет заголовка в окне просмотра.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Подробнее о цветах и как их использовать — в разделе <NavigationLink to="2-1-5-3-color-palette" title="Цветовая палитра" variant="related" />.
            </p>

            {/* Интерактивная форма */}
            <div className="not-prose">
                <Sandbox
                    title="Интерактивная форма создания"
                    description="Нажмите кнопку, чтобы открыть форму и посмотреть все поля."
                    instructions={[
                        'Обратите внимание на два поля: дата и время',
                        'Название необязательно, но текст — обязателен',
                        '7 круглых кнопок для выбора цвета'
                    ]}
                >
                    <NoteFormDemo />
                </Sandbox>
            </div>

            {/* Валидация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Проверка перед сохранением
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Форма проверяет только одно условие: текст заметки должен быть заполнен. Если поле пустое, кнопка «Сохранить» будет серой и неактивной.
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Поле</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Обязательно?</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Проверка</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Дата</td>
                            <td className="border border-gray-300 px-4 py-2">Да</td>
                            <td className="border border-gray-300 px-4 py-2">Предзаполнено, нельзя оставить пустым</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Время</td>
                            <td className="border border-gray-300 px-4 py-2">Да</td>
                            <td className="border border-gray-300 px-4 py-2">Предзаполнено, нельзя оставить пустым</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Название</td>
                            <td className="border border-gray-300 px-4 py-2">Нет</td>
                            <td className="border border-gray-300 px-4 py-2">Нет</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Текст</td>
                            <td className="border border-gray-300 px-4 py-2"><strong>Да</strong></td>
                            <td className="border border-gray-300 px-4 py-2">Минимум 1 символ</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Цвет</td>
                            <td className="border border-gray-300 px-4 py-2">Да</td>
                            <td className="border border-gray-300 px-4 py-2">Всегда выбран (по умолчанию красный)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Что происходит после сохранения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что происходит после сохранения?
            </h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Форма закрывается</li>
                <li>Заметка появляется в календаре на указанную дату и время</li>
                <li>Если календарь уже открыт на этом дне — заметка сразу видна, иначе нужно перейти к нужной дате</li>
                <li>Заметка сортируется по времени вместе с постами</li>
            </ol>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Успешное сохранение:</strong> После сохранения появляется уведомление «Заметка создана» в правом нижнем углу экрана.
                </p>
            </div>

            {/* FAQ */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли создать заметку на прошедшую дату?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да, можно. Система не ограничивает выбор даты — вы можете создать заметку хоть на год назад. Это полезно для фиксации важных событий постфактум.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли создать несколько заметок на одно время?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да. Если у вас две заметки на 14:00, обе будут отображаться одна под другой. Порядок определяется временем создания (более новые — ниже).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что будет, если закрыть форму без сохранения?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Все введённые данные пропадут. Заметка не сохраняется автоматически — только при нажатии кнопки «Сохранить».
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли изменить цвет после создания?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да! Откройте заметку на редактирование и выберите другой цвет. Подробнее в разделе <NavigationLink to="2-1-5-2-edit-note" title="Редактирование заметки" variant="related" />.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Два способа:</strong> кнопка ✏️ в шапке или двойной клик по дню</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Обязательное поле:</strong> только текст заметки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Название необязательно,</strong> но помогает быстро находить заметки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Точное время:</strong> дата + часы:минуты для хронологической сортировки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Дефолтный цвет:</strong> красный (можно изменить при создании или после)</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-5-1-create-note" />
        </article>
    );
};
