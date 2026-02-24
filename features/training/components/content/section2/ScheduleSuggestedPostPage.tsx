import React, { useState } from 'react';
import { NavigationButtons, ContentProps, Sandbox } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации UI
// =====================================================================

// Mock: Кнопка "+ Создать пост" (из DayColumn Header)
const MockCreatePostButton: React.FC<{ date: string; onClick: () => void }> = ({ date, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={onClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                title={`Создать пост на ${date}`}
                className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    );
};

// Mock: Всплывающее окно создания поста
const MockPostModal: React.FC<{ isOpen: boolean; onClose: () => void; date: string }> = ({ isOpen, onClose, date }) => {
    const [text, setText] = useState('');
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [isMultiProjectMode, setIsMultiProjectMode] = useState(false);
    const [isCyclic, setIsCyclic] = useState(false);
    const [publicationMethod, setPublicationMethod] = useState<'system' | 'vk'>('system');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Заголовок */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Создание поста</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Содержимое */}
                <div className="p-6 space-y-6">
                    {/* Секция 1: Текст поста */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Текст поста</label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors custom-scrollbar"
                            placeholder="Вставьте скопированный текст сюда..."
                            rows={8}
                        />
                    </div>

                    {/* Секция 2: Медиа (упрощённо) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Изображения</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 cursor-pointer transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Нажмите для загрузки изображений</p>
                        </div>
                    </div>

                    {/* Секция 3: Дата и время */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Дата и время публикации</label>
                        <div className="flex space-x-3">
                            <input
                                type="date"
                                value={date}
                                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                                type="time"
                                defaultValue="10:00"
                                className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Секция 4: Дополнительные опции */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700">Дополнительные опции</h3>

                        {/* Переключатель: Массовое создание */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Массовое создание</p>
                                <p className="text-xs text-gray-500">Создать несколько постов с интервалом</p>
                            </div>
                            <button
                                onClick={() => setIsBulkMode(!isBulkMode)}
                                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                                    isBulkMode ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    isBulkMode ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {/* Переключатель: Мультипроект */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Мультипроект</p>
                                <p className="text-xs text-gray-500">Опубликовать в несколько сообществ</p>
                            </div>
                            <button
                                onClick={() => setIsMultiProjectMode(!isMultiProjectMode)}
                                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                                    isMultiProjectMode ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    isMultiProjectMode ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {/* Переключатель: Цикличность */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-700">Цикличность</p>
                                <p className="text-xs text-gray-500">Повторять публикацию по расписанию</p>
                            </div>
                            <button
                                onClick={() => setIsCyclic(!isCyclic)}
                                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${
                                    isCyclic ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                            >
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    isCyclic ? 'translate-x-6' : 'translate-x-1'
                                }`} />
                            </button>
                        </div>

                        {/* Выбор способа публикации */}
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Способ публикации</p>
                            <div className="flex bg-gray-200 p-0.5 rounded-lg gap-1">
                                <button
                                    onClick={() => setPublicationMethod('system')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                        publicationMethod === 'system'
                                            ? 'bg-white shadow text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    В систему
                                </button>
                                <button
                                    onClick={() => setPublicationMethod('vk')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                                        publicationMethod === 'vk'
                                            ? 'bg-white shadow text-indigo-700'
                                            : 'text-gray-600 hover:bg-gray-300'
                                    }`}
                                >
                                    В VK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Футер с кнопками */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-md transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        className="px-4 py-2 text-sm font-medium bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ScheduleSuggestedPostPage: React.FC<ContentProps> = ({ title }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                После того как вы обработали предложенный пост через AI-редактор и скопировали исправленный текст, 
                следующий шаг — запланировать его публикацию. В системе нет прямой кнопки "Опубликовать из предложки", 
                поэтому используется общий механизм создания постов через вкладку "Отложенные".
            </p>

            {/* Важное замечание */}
            <div className="not-prose">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-blue-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-blue-900 mb-2">Процесс требует ручного переноса</h3>
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Планирование предложенного поста — это ручной процесс копирования текста из AI-редактора 
                                и вставки его в форму создания нового поста. Автоматического переноса пока нет.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Пошаговый процесс */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Процесс планирования: 5 шагов
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 1: Обработка в AI-редакторе
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сначала откройте предложенный пост во вкладке "Предложенные" и нажмите кнопку "Редактор AI". 
                Дождитесь, пока искусственный интеллект исправит текст, добавит хештеги и уберёт ошибки. 
                При необходимости отредактируйте текст вручную.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 2: Копирование текста
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В AI-редакторе нажмите кнопку "Копировать". Исправленный текст сохранится в буфере обмена. 
                Кнопка на мгновение изменит надпись на "Скопировано!" — это подтверждение успешной операции.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 3: Переход на вкладку "Отложенные"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Закройте AI-редактор и переключитесь на вкладку "Отложенные" в том же проекте. 
                Здесь находится календарь с планируемыми публикациями.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 4: Создание нового поста
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В календаре найдите день, на который хотите запланировать публикацию. В заголовке этого дня есть 
                кнопка с плюсом "Создать пост". При наведении курсора появится подсказка "Создать пост на [дата]". 
                Нажмите на неё — откроется всплывающее окно создания поста.
            </p>

            {/* Интерактивная демонстрация кнопки */}
            <Sandbox
                title="Интерактивная демонстрация: Кнопка создания поста"
                description="Наведите курсор на кнопку, чтобы увидеть подсказку, затем нажмите для открытия всплывающего окна."
                instructions={[
                    'Наведите курсор на кнопку — появится подсказка с датой',
                    'Нажмите на кнопку — откроется всплывающее окно создания поста',
                    'Обратите внимание: кнопка меняет цвет при наведении (серый → индиго)'
                ]}
            >
                <div className="max-w-md mx-auto">
                    <div className="mb-3 text-center">
                        <p className="text-sm font-semibold text-gray-700">Заголовок дня в календаре</p>
                        <p className="text-xs text-gray-500">Понедельник, 17 февраля 2026</p>
                    </div>
                    <MockCreatePostButton 
                        date="17 февраля 2026" 
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 5: Заполнение формы и сохранение
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В открывшемся модальном окне вставьте скопированный текст (Ctrl+V или Cmd+V) в текстовое поле. 
                Система автоматически подставит дату выбранного дня и время:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Для сегодняшнего дня:</strong> текущее время + 15 минут (округлённое до ближайшего интервала 15 минут)</li>
                    <li><strong>Для будущих дней:</strong> 10:00 по умолчанию</li>
                </ul>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При необходимости настройте дополнительные параметры (подробнее ниже) и нажмите "Сохранить". 
                Пост появится в календаре на выбранной дате.
            </p>

            <hr className="!my-10" />

            {/* Структура модального окна */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Структура всплывающего окна
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Всплывающее окно создания поста разделено на четыре основные секции:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                1. Секция текста поста
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Большое текстовое поле для ввода или вставки текста публикации. Поддерживает многострочный текст, 
                эмодзи и переносы строк. Здесь вы вставляете скопированный из AI-редактора контент.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                2. Секция медиа
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Область загрузки изображений. Нажмите на неё, чтобы выбрать файлы с компьютера. 
                Поддерживается несколько изображений. После загрузки превью отображаются в виде ленты.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                3. Секция даты и времени
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Два поля: выбор даты (календарь) и выбор времени (часы:минуты). Дата подставляется автоматически 
                из выбранного дня календаря, но её можно изменить вручную. Время рассчитывается умно (см. выше).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                4. Секция дополнительных опций
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Набор переключателей и селекторов для продвинутых функций:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Массовое создание:</strong> Автоматически создать несколько постов с заданным интервалом (например, каждые 2 часа)</li>
                    <li><strong>Мультипроект:</strong> Опубликовать один и тот же пост сразу в несколько сообществ</li>
                    <li><strong>Цикличность:</strong> Повторять публикацию по расписанию (каждый день/неделю/месяц)</li>
                    <li><strong>Способ публикации:</strong> "В систему" (сначала в базу данных) или "В VK" (сразу на сервера ВКонтакте)</li>
                </ul>
            </div>

            {/* Интерактивная демонстрация модального окна */}
            <Sandbox
                title="Интерактивная демонстрация: Всплывающее окно создания поста"
                description="Нажмите кнопку выше, чтобы открыть полнофункциональное всплывающее окно. Попробуйте переключить опции и ввести текст."
                instructions={[
                    'Нажмите кнопку "Создать пост" выше, если окно ещё не открыто',
                    'Попробуйте вставить текст в поле "Текст поста"',
                    'Переключите переключатели "Массовое создание", "Мультипроект", "Цикличность"',
                    'Обратите внимание: переключатели меняют цвет с серого (bg-gray-300) на индиго (bg-indigo-600)',
                    'Переключите способ публикации между "В систему" и "В VK" — активная вкладка подсвечивается белым фоном с тенью'
                ]}
            >
                <div className="text-center">
                    {!isModalOpen && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Открыть всплывающее окно
                        </button>
                    )}
                    {isModalOpen && (
                        <p className="text-sm text-gray-600">Всплывающее окно открыто выше ↑</p>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Дополнительные опции */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Дополнительные опции публикации
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система предлагает мощные инструменты для автоматизации публикаций. Раньше приходилось вручную 
                создавать по 10-20 постов для разных сообществ или дублировать один пост на несколько дней. 
                Теперь это делается одним кликом.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Массовое создание
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Включите переключатель "Массовое создание", чтобы система автоматически создала серию постов. 
                Укажите количество постов и интервал между ними (минуты, часы, дни, недели, месяцы). 
                Например: "Создать 5 постов с интервалом 2 часа" — система создаст 5 одинаковых постов, 
                разнесённых по времени на 2 часа каждый.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример использования:</strong> У вас есть важное объявление, которое нужно показать 
                аудитории несколько раз в течение дня. Вместо ручного создания 3-4 постов, включите массовое 
                создание: "3 поста, интервал 4 часа". Готово.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Мультипроект
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Включите переключатель "Мультипроект", чтобы опубликовать один и тот же контент сразу в несколько 
                сообществ. После включения появится список ваших проектов с чекбоксами — выберите нужные. 
                Система создаст идентичные посты для каждого выбранного сообщества.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример использования:</strong> Агентство ведёт 10 сообществ в одной тематике (например, 
                юмор). Один хороший пост из предложки можно опубликовать во всех 10 сообществах. Раньше — 
                10 минут рутины, заходить в каждую группу. Теперь — одно окно, 10 галочек, одна кнопка "Сохранить".
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Цикличность
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Включите переключатель "Цикличность", чтобы пост автоматически повторялся по расписанию. 
                Выберите тип повторения (минуты, часы, дни, недели, месяцы), интервал и условие завершения 
                (количество повторений или конечная дата).
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример использования:</strong> Сообщество проводит еженедельный конкурс каждую пятницу в 18:00. 
                Вместо того, чтобы каждую неделю создавать новый пост, настройте цикличность: "Повторять каждые 7 дней, 
                завершить через 10 повторений". Система автоматически создаст 10 постов на следующие 10 пятниц.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Способ публикации
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Выберите, куда сохранить пост:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>"В систему"</strong> (по умолчанию) — пост сохраняется в базу данных приложения. 
                    В назначенное время система автоматически опубликует его в ВКонтакте через свой механизм.</li>
                    <li><strong>"В VK"</strong> — пост сразу отправляется на сервера ВКонтакте как отложенная публикация. 
                    Управление таким постом осуществляется уже через интерфейс ВКонтакте, а не через приложение.</li>
                </ul>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Рекомендация:</strong> Используйте "В систему" для максимального контроля. 
                Вариант "В VK" полезен, если вы хотите управлять постом напрямую через ВКонтакте 
                или если ваш токен API ограничен по функционалу.
            </p>

            <hr className="!my-10" />

            {/* Что планируется в будущем */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что планируется улучшить
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Текущий процесс планирования предложенного поста требует ручного копирования текста и переключения 
                между вкладками. В будущем планируется добавить:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Кнопка "Запланировать" в AI-редакторе:</strong> Прямо из окна AI-редактора открывать 
                    всплывающее окно создания поста с уже вставленным текстом (без копирования в буфер)</li>
                    <li><strong>Контекстное меню на карточке:</strong> Правый клик по предложенному посту → 
                    "Запланировать публикацию" → сразу открытие модального окна</li>
                    <li><strong>Drag-and-drop:</strong> Перетаскивание карточки предложенного поста из вкладки 
                    "Предложенные" прямо на день в календаре вкладки "Отложенные"</li>
                </ul>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Эти улучшения сократят количество кликов и упростят рабочий процесс, но базовая функциональность 
                планирования останется той же.
            </p>

            {/* Всплывающее окно (рендерится, если открыто) */}
            <MockPostModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                date="2026-02-17"
            />

            {/* Навигационные кнопки */}
            <NavigationButtons currentPath="2-2-6-schedule-suggested" />
        </article>
    );
};
