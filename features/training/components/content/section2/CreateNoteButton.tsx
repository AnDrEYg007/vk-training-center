import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

export const CreateNoteButton: React.FC<ContentProps> = ({ title }) => {
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    const handleCreateNote = () => {
        setIsButtonClicked(true);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"Создать заметку"</strong> с иконкой карандаша — это 
                <strong> самый быстрый и очевидный способ</strong> создать новую заметку в календаре. 
                Она находится в шапке календаря и открывает окно создания заметки с автоматической 
                установкой текущей даты.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> Помимо двойного клика по ячейке календаря, 
                    у тебя есть явная кнопка с иконкой карандаша, которая всегда доступна 
                    и создаёт заметку на текущую дату.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находится кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка "Создать заметку" расположена в <strong>правой части шапки календаря</strong> 
                среди кнопок управления заметками и тегами. Она отображается как кнопка с иконкой 
                карандаша (при наведении появляется подсказка "Создать заметку").
            </p>

            <hr className="!my-10" />

            {/* Как работает */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работает кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При нажатии на кнопку происходит следующее:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700 space-y-3">
                <li>
                    <strong>Открывается всплывающее окно</strong> создания заметки (такое же, как при 
                    двойном клике по ячейке календаря)
                </li>
                <li>
                    <strong>Автоматически устанавливается текущая дата</strong> — не нужно выбирать дату вручную
                </li>
                <li>
                    После заполнения обязательного поля "Текст заметки" и сохранения, заметка появляется 
                    в календаре на сегодняшней дате
                </li>
            </ol>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Совет:</strong> Если тебе нужно быстро создать заметку на сегодня, 
                    используй эту кнопку. Для заметок на конкретную дату в будущем или прошлом — 
                    удобнее двойной клик по нужной ячейке календаря.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Разница между способами создания */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Два способа создать заметку
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В приложении есть два основных способа создания заметки. Вот сравнение:
            </p>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Способ
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Как использовать
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Когда удобно
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Дата заметки
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                Кнопка "Создать"
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                Кликнуть по кнопке в шапке календаря
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                Быстрое создание заметки на сегодня
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    Текущая дата
                                </span>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                Двойной клик
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                Дважды кликнуть по нужной ячейке календаря
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                Создание заметки на конкретную дату
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-700">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    Выбранная дата
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* Интерактивный пример */}
            <Sandbox
                title="Интерактивный пример"
                description="Попробуй кликнуть на кнопку ниже, чтобы увидеть, как работает создание заметки."
                instructions={[
                    'Нажми на кнопку с иконкой карандаша в шапке календаря',
                    'Откроется форма создания заметки с автоматической установкой сегодняшней даты',
                    'Заполни поля и нажми Сохранить или Отмена'
                ]}
            >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800">Календарь на неделю</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleCreateNote}
                                className={`p-2 ${
                                    isButtonClicked 
                                        ? 'bg-green-500 border-green-500 text-white' 
                                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'
                                } border rounded-md transition-all shadow-sm`}
                                title="Создать заметку"
                                aria-label="Создать заметку"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {[29, 30, 31, 1, 2, 3, 4].map((date, index) => {
                            const day = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][index];
                            return (
                                <div 
                                    key={day} 
                                    className={`p-3 bg-white border-2 ${
                                        index === 3 ? 'border-indigo-400' : 'border-gray-200'
                                    } rounded text-center`}
                                >
                                    <div className="text-xs text-gray-500 mb-1">{day}</div>
                                    <div className={`text-sm font-medium ${
                                        index === 3 ? 'text-indigo-600' : 'text-gray-700'
                                    }`}>
                                        {date}
                                        {index === 3 && (
                                            <span className="block text-xs text-indigo-500 mt-1">Сегодня</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isButtonClicked && (
                        <div className="mt-4 p-4 bg-white border-2 border-green-400 rounded-lg shadow-lg animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                        Создание новой заметки
                                    </h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label htmlFor="note-date" className="block text-xs text-gray-600 mb-1">Дата и время</label>
                                            <div id="note-date" className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                                4 февраля 2026 (Ср) — Сегодня
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="note-title" className="block text-xs text-gray-600 mb-1">Название (необязательно)</label>
                                            <input 
                                                id="note-title"
                                                type="text" 
                                                placeholder="Введите название..." 
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="note-text" className="block text-xs text-gray-600 mb-1">Текст заметки</label>
                                            <textarea 
                                                id="note-text"
                                                rows={3}
                                                placeholder="Введите текст..." 
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Цвет</label>
                                            <div className="flex gap-2">
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-red-100" />
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-yellow-100" />
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-green-100" />
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-blue-100" />
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-indigo-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3">
                                        <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-medium">
                                            Сохранить
                                        </button>
                                        <button 
                                            onClick={() => setIsButtonClicked(false)}
                                            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isButtonClicked && (
                        <div className="text-center text-sm text-gray-500 py-4">
                            Нажми на кнопку с иконкой карандаша выше, чтобы увидеть форму создания
                        </div>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Сценарии использования */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Когда использовать кнопку создания?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот типичные сценарии, когда эта кнопка особенно полезна:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Быстрая заметка "на сегодня"
                    </h4>
                    <p className="text-sm text-gray-600">
                        Нужно зафиксировать идею, задачу или напоминание на сегодняшний день. 
                        Кнопка автоматически установит текущую дату.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Не видно нужную дату в календаре
                    </h4>
                    <p className="text-sm text-gray-600">
                        Если ты находишься на другой неделе в календаре, но хочешь создать заметку 
                        на сегодня — не нужно возвращаться к текущей дате, просто используй кнопку.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Более очевидный интерфейс для новичков
                    </h4>
                    <p className="text-sm text-gray-600">
                        Не все пользователи знают про двойной клик по ячейке. Явная кнопка 
                        делает функцию создания заметки более понятной и доступной.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        Работа с клавиатурой
                    </h4>
                    <p className="text-sm text-gray-600">
                        Кнопку можно активировать с помощью клавиатуры (Tab для перехода + Enter), 
                        что удобнее, чем двойной клик мышью для тех, кто предпочитает клавиатуру.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы (FAQ)
            </h2>

            <div className="not-prose space-y-4 my-6">
                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Можно ли выбрать другую дату при создании заметки через кнопку?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Да! Хотя кнопка автоматически устанавливает текущую дату, в открывшейся форме 
                        создания заметки есть поле выбора даты. Ты можешь изменить её на любую другую, 
                        если нужно создать заметку на другой день.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Чем заметка отличается от поста?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        <strong>Заметка</strong> — это личная запись, напоминание или задача в календаре. 
                        Она видна только тебе и не публикуется ВКонтакте. <strong>Пост</strong> — это 
                        контент для публикации в группе: текст, фото, видео и т.д. Заметки помогают 
                        организовать работу с постами.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Есть ли горячая клавиша для создания заметки?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        В текущей версии приложения нет глобальной горячей клавиши для создания заметки. 
                        Однако можно использовать Tab для навигации по интерфейсу до кнопки создания, 
                        а затем нажать Enter. В будущих версиях могут появиться горячие клавиши 
                        (например, Ctrl+N или Cmd+N).
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Можно ли создать несколько заметок на одну дату?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Да, абсолютно! На одной дате может быть сколько угодно заметок. Они будут 
                        отображаться в ячейке календаря списком. Это полезно, когда у тебя несколько 
                        задач или идей для одного дня.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Что произойдет, если не заполнить текст заметки?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Текст заметки — обязательное поле. Если попытаться сохранить заметку без 
                        текста, кнопка "Сохранить" будет неактивна. Название заметки заполнять необязательно.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Можно ли прикрепить файлы или изображения к заметке?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Заметки предназначены для текстовых записей и не поддерживают прикрепление 
                        файлов (в отличие от постов). Однако ты можешь добавить ссылки на внешние ресурсы 
                        в текст заметки.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Можно ли выбрать цвет заметки?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Да! При создании или редактировании заметки ты можешь выбрать один из семи 
                        пастельных цветов. Это помогает визуально группировать заметки по типам или важности.
                    </div>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 rounded-lg p-6 my-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Совет эксперта</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>Используй заметки как якоря для планирования контента.</strong> Например, 
                        создай заметку "Проверить статистику предыдущих постов" на понедельник, 
                        "Подготовить контент на неделю" на вторник, "Запланировать посты на выходные" 
                        на среду. Так ты создашь систему регулярных задач, которая поможет не забывать 
                        важные рутинные операции.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mt-3">
                        <strong>Используй цвета для категоризации.</strong> Например, красный — для срочных дел, 
                        зелёный — для идей, синий — для задач, жёлтый — для напоминаний. Так ты быстро 
                        увидишь в календаре, какие заметки требуют внимания в первую очередь.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка «Создать заметку» с иконкой карандаша находится в шапке календаря</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>При нажатии открывается форма создания с автоматической установкой сегодняшней даты</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Два способа создания: кнопка (для сегодня) и двойной клик (для конкретной даты)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка доступна через клавиатуру (Tab + Enter)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Заметки приватны и не публикуются в соцсетях</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Можно выбрать цвет заметки для категоризации</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-3-5-create-note-button" />
        </article>
    );
};
