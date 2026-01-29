import React, { useState } from 'react';
import { ContentProps } from '../shared';

export const CreateNoteButton: React.FC<ContentProps> = ({ title }) => {
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>('Сегодня');

    const handleCreateNote = () => {
        setIsButtonClicked(true);
        setTimeout(() => setIsButtonClicked(false), 2000);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"Создать заметку"</strong> с иконкой <strong>✏️</strong> — это 
                <strong> самый быстрый и очевидный способ</strong> создать новую заметку в календаре. 
                Она находится в шапке календаря и открывает окно создания заметки с автоматической 
                установкой текущей даты.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Помимо двойного клика по ячейке календаря, 
                    у тебя есть явная кнопка с понятной иконкой ✏️, которая всегда доступна 
                    и создаёт заметку на текущую дату.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находится кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка "Создать заметку" расположена в <strong>правой части шапки календаря</strong>, 
                обычно после кнопки "Выбрать" (массовые действия). Она имеет характерную иконку 
                <strong> ✏️</strong> и подпись "Создать заметку" или просто иконку в компактном режиме.
            </p>

            <div className="not-prose my-6">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Шапка календаря</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                Обновить 🔄
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-sm">
                                Выбрать
                            </button>
                            <button 
                                onClick={handleCreateNote}
                                className={`px-4 py-1.5 ${
                                    isButtonClicked 
                                        ? 'bg-green-500' 
                                        : 'bg-indigo-600'
                                } text-white rounded text-sm font-medium transition-colors`}
                            >
                                ✏️ Создать заметку
                            </button>
                        </div>
                    </div>
                    {isButtonClicked && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                                ✅ Открыто окно создания заметки на дату: <strong>{selectedDate}</strong>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как работает */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работает кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При нажатии на кнопку происходит следующее:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700 space-y-3">
                <li>
                    <strong>Открывается модальное окно</strong> создания заметки (такое же, как при 
                    двойном клике по ячейке календаря)
                </li>
                <li>
                    <strong>Автоматически устанавливается текущая дата</strong> — не нужно выбирать дату вручную
                </li>
                <li>
                    <strong>Курсор фокусируется на поле заголовка</strong> — можно сразу начать печатать
                </li>
                <li>
                    После заполнения и сохранения заметка появляется в календаре на сегодняшней дате
                </li>
            </ol>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800">
                    <strong>⚡ Совет:</strong> Если тебе нужно быстро создать заметку на сегодня, 
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
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">✏️</span>
                                    Кнопка "Создать"
                                </span>
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
                                <span className="flex items-center gap-2">
                                    <span className="text-lg">🖱️</span>
                                    Двойной клик
                                </span>
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
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Интерактивный пример
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Попробуй кликнуть на кнопку ниже, чтобы увидеть, как работает создание заметки:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
                        <h3 className="text-lg font-semibold text-gray-800">Календарь на неделю</h3>
                        <div className="flex gap-2">
                            <button 
                                onClick={handleCreateNote}
                                className={`px-4 py-2 ${
                                    isButtonClicked 
                                        ? 'bg-green-500' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white rounded-lg text-sm font-medium transition-all shadow-md`}
                            >
                                ✏️ Создать заметку
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
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
                                    {27 + index}
                                    {index === 3 && (
                                        <span className="block text-xs text-indigo-500 mt-1">Сегодня</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {isButtonClicked && (
                        <div className="mt-4 p-4 bg-white border-2 border-green-400 rounded-lg shadow-lg animate-pulse">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <span className="text-green-600 text-xl">✏️</span>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                        Создание новой заметки
                                    </h4>
                                    <div className="space-y-2">
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Дата</label>
                                            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                                                30 января 2026 (Чт) — Сегодня
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-600 mb-1">Заголовок</label>
                                            <input 
                                                type="text" 
                                                placeholder="Введите заголовок заметки..." 
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
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
                            Нажми на кнопку "✏️ Создать заметку" выше, чтобы увидеть форму создания
                        </div>
                    )}
                </div>
            </div>

            <hr className="!my-10" />

            {/* Сценарии использования */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Когда использовать кнопку создания?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот типичные сценарии, когда эта кнопка особенно полезна:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 text-lg">📝</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Быстрая заметка "на сегодня"
                        </h4>
                        <p className="text-sm text-gray-600">
                            Нужно зафиксировать идею, задачу или напоминание на сегодняшний день. 
                            Кнопка автоматически установит текущую дату.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 text-lg">🎯</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Не видно нужную дату в календаре
                        </h4>
                        <p className="text-sm text-gray-600">
                            Если ты находишься на другой неделе в календаре, но хочешь создать заметку 
                            на сегодня — не нужно возвращаться к текущей дате, просто используй кнопку.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-600 text-lg">🚀</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Более очевидный интерфейс для новичков
                        </h4>
                        <p className="text-sm text-gray-600">
                            Не все пользователи знают про двойной клик по ячейке. Кнопка с явной 
                            подписью делает функцию создания заметки более понятной и доступной.
                        </p>
                    </div>
                </div>

                <div className="flex gap-4 items-start p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-orange-600 text-lg">⌨️</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">
                            Работа с клавиатурой
                        </h4>
                        <p className="text-sm text-gray-600">
                            Кнопку можно активировать с помощью клавиатуры (Tab для перехода + Enter), 
                            что удобнее, чем двойной клик мышью для тех, кто предпочитает клавиатуру.
                        </p>
                    </div>
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
                        <span>Что произойдет, если не заполнить заголовок заметки?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Заголовок заметки — обязательное поле. Если попытаться сохранить заметку без 
                        заголовка, приложение покажет ошибку валидации и попросит заполнить это поле. 
                        Минимальная длина заголовка — обычно 1 символ.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Можно ли прикрепить файлы или изображения к заметке?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Заметки предназначены для текстовых записей и обычно не поддерживают прикрепление 
                        файлов (в отличие от постов). Однако ты можешь добавить ссылки на внешние ресурсы 
                        или использовать теги для организации заметок.
                    </div>
                </details>

                <details className="group bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <summary className="px-4 py-3 cursor-pointer font-medium text-gray-800 hover:bg-gray-50 flex justify-between items-center">
                        <span>Видны ли заметки в мобильном приложении?</span>
                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-700 border-t border-gray-200">
                        Это зависит от реализации приложения. Если есть мобильная версия с синхронизацией, 
                        то заметки будут доступны и там. Обычно заметки хранятся в облаке и синхронизируются 
                        между устройствами, чтобы ты мог работать с ними везде.
                    </div>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600 rounded-lg p-6 my-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">💡</span>
                        </div>
                    </div>
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
                            <strong>Комбинируй заметки с тегами.</strong> Добавляй к заметкам теги вроде 
                            "срочно", "идея", "задача", "напоминание" — это поможет быстро фильтровать 
                            и находить нужные записи в календаре.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Заключение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итоги</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"Создать заметку" (✏️)</strong> — это простой и интуитивный инструмент 
                для быстрого добавления заметок в календарь. Она особенно полезна для:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                <li>
                    <strong>Быстрого создания заметок на текущую дату</strong> — не нужно искать 
                    "сегодня" в календаре
                </li>
                <li>
                    <strong>Интуитивного интерфейса</strong> — явная кнопка понятнее, чем скрытый 
                    жест двойного клика
                </li>
                <li>
                    <strong>Доступности с клавиатуры</strong> — можно использовать без мыши
                </li>
                <li>
                    <strong>Новых пользователей</strong> — они сразу видят, как создать заметку
                </li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Используй её вместе с двойным кликом по ячейкам календаря для максимальной 
                эффективности в работе с заметками! 📝✨
            </p>
        </article>
    );
};
