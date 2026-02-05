import React, { useState } from 'react';
import { ContentProps } from '../shared';

// =====================================================================
// Основной компонент: Сетка календаря
// =====================================================================
export const CalendarGrid: React.FC<ContentProps> = ({ title }) => {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    // Генерация недели для демонстрации
    const getWeekDates = () => {
        const today = new Date(2024, 0, 15); // 15 января 2024 (понедельник)
        const week = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(today);
            day.setDate(today.getDate() + i);
            week.push(day);
        }
        return week;
    };

    const weekDates = getWeekDates();
    const today = new Date(2024, 0, 17); // Среда для демонстрации

    // Демо-данные
    const demoContent = {
        0: { // Понедельник
            stories: 2,
            posts: [
                { time: '10:00', type: 'scheduled', text: 'Утренний пост о новой коллекции' },
                { time: '16:00', type: 'published', text: 'Вечерний пост уже опубликован' }
            ],
            notes: [
                { time: '14:00', color: '#FEE2E2', title: 'Созвон с командой' }
            ]
        },
        1: { // Вторник
            stories: 0,
            posts: [
                { time: '12:00', type: 'scheduled', text: 'Пост про акцию' }
            ],
            notes: []
        },
        2: { // Среда (сегодня)
            stories: 3,
            posts: [
                { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: false },
                { time: '15:00', type: 'scheduled', text: 'Пост про конкурс' }
            ],
            notes: [
                { time: '11:00', color: '#D1FAE5', title: 'Подготовить фото' }
            ]
        },
        3: { // Четверг
            stories: 0,
            posts: [
                { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: true },
                { time: '18:00', type: 'scheduled', text: 'Вечерний пост' }
            ],
            notes: []
        },
        4: { // Пятница
            stories: 1,
            posts: [
                { time: '09:00', type: 'system', text: 'AI-лента: автопост', isGhost: true },
            ],
            notes: [
                { time: '10:00', color: '#FEF3C7', title: 'Запланировать посты на выходные' }
            ]
        },
        5: { // Суббота
            stories: 0,
            posts: [],
            notes: []
        },
        6: { // Воскресенье
            stories: 0,
            posts: [
                { time: '12:00', type: 'scheduled', text: 'Воскресный пост' }
            ],
            notes: []
        }
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сетка календаря — это <strong>основная рабочая область</strong> во вкладке "Расписание". 
                Здесь отображаются все твои посты, заметки и истории, распределённые по дням недели.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Сетка календаря показывает 7 дней (целую неделю) одновременно. 
                    Каждый день — это отдельная колонка, где всё содержимое отсортировано по времени сверху вниз.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Структура сетки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как выглядит сетка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Сетка представляет собой <strong>7 вертикальных колонок</strong> — по одной на каждый день недели. 
                Каждая колонка состоит из трёх частей:
            </p>

            <div className="not-prose space-y-4 my-8">
                {/* Структура колонки */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                    <h3 className="font-bold text-blue-900 mb-2">1. Заголовок дня</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Вверху каждой колонки находится заголовок с информацией о дне:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li><strong>День недели</strong> (пн, вт, ср... в сокращении)</li>
                        <li><strong>Дата</strong> (формат: 15.01)</li>
                        <li><strong>Кнопка "+"</strong> для быстрого создания поста на этот день</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-3">
                        Сегодняшний день подсвечивается <strong>синей верхней границей</strong> — так ты всегда знаешь, где находишься во времени.
                    </p>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <h3 className="font-bold text-purple-900 mb-2">2. Истории (если есть)</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Если в этот день были опубликованы истории, они показываются <strong>кружками</strong> 
                        в верхней части колонки, сразу под заголовком.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Фото-истории — <strong>индиго фон</strong></li>
                        <li>Видео-истории — <strong>фиолетовый фон</strong> + <span className="text-red-500">красный значок воспроизведения</span></li>
                        <li>При клике на кружок открывается просмотрщик истории</li>
                    </ul>
                </div>

                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <h3 className="font-bold text-green-900 mb-2">3. Посты и заметки</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Основное содержимое колонки — <strong>посты и заметки</strong>, отсортированные по времени 
                        (от более ранних к более поздним). Они перемешаны между собой в хронологическом порядке.
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                        Например: заметка на 10:00, пост на 12:00, ещё один пост на 15:00, заметка на 16:00.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Типы контента */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что показывается в сетке?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                В сетке календаря отображаются три основных типа контента:
            </p>

            <div className="not-prose space-y-6 my-8">
                {/* Посты */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">📝</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Посты</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Основной тип контента. Посты бывают трёх видов:
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3 ml-10">
                        <div className="bg-gray-50 rounded p-3 border-l-2 border-gray-400">
                            <p className="font-semibold text-gray-900 mb-1">Обычные запланированные посты</p>
                            <p className="text-xs text-gray-600">
                                Посты, которые ты создал сам. Белый фон, обычная рамка. 
                                Можно перетаскивать, редактировать, удалять.
                            </p>
                        </div>
                        
                        <div className="bg-indigo-50 rounded p-3 border-l-2 border-indigo-400">
                            <p className="font-semibold text-indigo-900 mb-1">Системные посты (автоматизации)</p>
                            <p className="text-xs text-gray-600 mb-2">
                                Посты, которые создаются автоматически по расписанию. 
                                Цветной фон, пунктирная рамка. Нельзя перетаскивать.
                            </p>
                            <div className="text-xs text-gray-700 space-y-1">
                                <p>• <strong>AI-лента</strong> — индиго фон</p>
                                <p>• <strong>Конкурс победителей</strong> — фуксия фон</p>
                                <p>• <strong>Универсальный конкурс старт</strong> — небесно-голубой фон</p>
                                <p>• <strong>Универсальный конкурс итоги</strong> — оранжевый фон</p>
                            </div>
                        </div>
                        
                        <div className="bg-purple-50 rounded p-3 border-l-2 border-purple-400">
                            <p className="font-semibold text-purple-900 mb-1">"Призрачные" посты</p>
                            <p className="text-xs text-gray-600">
                                Полупрозрачные копии системных постов с циклическим повторением. 
                                Показывают будущие публикации автоматизации. Прозрачность 70%, более светлый фон, пунктирная рамка.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Заметки */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">🗒</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Заметки</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Личные напоминания и задачи. Отображаются как <strong>цветные карточки</strong> с текстом. 
                                Доступны 7 цветов для визуального разделения задач.
                            </p>
                            <p className="text-xs text-gray-600">
                                Заметки можно сворачивать (показывается только время и заголовок) или разворачивать 
                                (виден весь текст и кнопки действий).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Истории */}
                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="text-2xl">⭕</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">Истории</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Опубликованные истории ВКонтакте. Показываются как <strong>кружки</strong> в верхней части дня, 
                                наслаиваются друг на друга если их несколько.
                            </p>
                            <p className="text-xs text-gray-600">
                                <strong>Фото-истории</strong> — индиго фон. <strong>Видео-истории</strong> — фиолетовый фон и красный значок воспроизведения.<br/>
                                При наведении кружок увеличивается. При клике открывается полноэкранный просмотрщик истории.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивная демонстрация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Попробуй сам</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Ниже показана <strong>интерактивная демонстрация</strong> сетки календаря. 
                Наведи на колонку дня, чтобы увидеть подробности содержимого:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                {/* Демонстрация сетки */}
                <div className="grid grid-cols-7 gap-3">
                    {weekDates.map((date, index) => {
                        const isToday = date.toDateString() === today.toDateString();
                        const dayContent = demoContent[index as keyof typeof demoContent] || { stories: 0, posts: [], notes: [] };
                        const isSelected = selectedDay === index;

                        return (
                            <div 
                                key={index}
                                onMouseEnter={() => setSelectedDay(index)}
                                onMouseLeave={() => setSelectedDay(null)}
                                className={`
                                    border rounded-lg transition-all duration-200
                                    ${isToday ? 'border-t-4 border-t-indigo-500' : 'border-gray-200'}
                                    ${isSelected ? 'bg-indigo-50 shadow-lg scale-105' : 'bg-white'}
                                `}
                            >
                                {/* Заголовок дня */}
                                <div className="text-center p-2 border-b border-gray-200">
                                    <p className={`font-bold text-xs ${isToday ? 'text-indigo-600' : 'text-gray-700'}`}>
                                        {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                                    </p>
                                    <p className="text-gray-500 text-[10px]">
                                        {date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                                    </p>
                                    {/* Кнопка + */}
                                    <button
                                        className="w-full mt-1 p-1 border border-dashed border-gray-300 rounded text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors"
                                        title="Создать пост"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Содержимое дня */}
                                <div className="p-2 space-y-2 min-h-[200px]">
                                    {/* Истории */}
                                    {dayContent.stories > 0 && (
                                        <div className="flex -space-x-1 pb-2">
                                            {Array.from({ length: dayContent.stories }).map((_, i) => (
                                                <div 
                                                    key={i}
                                                    className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center cursor-pointer hover:z-10 hover:scale-110 transition-transform"
                                                    title="История"
                                                >
                                                    <span className="text-[8px] text-indigo-600">S</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Заметки и посты */}
                                    {[...dayContent.notes, ...dayContent.posts]
                                        .sort((a, b) => a.time.localeCompare(b.time))
                                        .map((item, i) => {
                                            if ('color' in item) {
                                                // Это заметка
                                                return (
                                                    <div 
                                                        key={`note-${i}`}
                                                        style={{ backgroundColor: item.color }}
                                                        className="p-2 rounded border text-[10px] cursor-pointer"
                                                    >
                                                        <p className="font-bold text-gray-800">{item.time}</p>
                                                        <p className="text-gray-700 truncate">{item.title}</p>
                                                    </div>
                                                );
                                            } else {
                                                // Это пост
                                                let bgColor = 'bg-white';
                                                let borderStyle = 'border-gray-200';
                                                let opacityClass = '';

                                                if (item.type === 'published') {
                                                    borderStyle = 'border-gray-300';
                                                } else if (item.type === 'system') {
                                                    // AI-лента - индиго фон
                                                    bgColor = 'bg-indigo-50';
                                                    borderStyle = 'border-indigo-200 border-dashed';
                                                    if (item.isGhost) {
                                                        opacityClass = 'opacity-70';
                                                    }
                                                }

                                                return (
                                                    <div 
                                                        key={`post-${i}`}
                                                        className={`p-2 rounded border ${bgColor} ${borderStyle} ${opacityClass} text-[10px] cursor-pointer`}
                                                    >
                                                        <p className="font-bold text-gray-800">{item.time}</p>
                                                        <p className="text-gray-700 truncate">{item.text}</p>
                                                        {item.type === 'published' && (
                                                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[8px] font-medium">
                                                                Опубликовано
                                                            </span>
                                                        )}
                                                        {item.type === 'system' && (
                                                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[8px] font-medium">
                                                                {item.isGhost ? 'Призрак' : 'Автопост'}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Подсказка */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                        {selectedDay !== null ? (
                            <>
                                <strong>Выбран день:</strong> {weekDates[selectedDay].toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </>
                        ) : (
                            <>
                                <strong>Подсказка:</strong> Наведи курсор на любую колонку, чтобы подсветить её
                            </>
                        )}
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Особенности работы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работает сетка?</h2>

            <div className="not-prose space-y-4 my-8">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Отображение прошедших дней</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Если ты листаешь календарь в прошлое, то увидишь:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Опубликованные посты (с зелёной меткой "Опубликовано")</li>
                        <li>Старые заметки</li>
                        <li>Опубликованные истории</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                        <strong>Важно:</strong> Системные посты в прошлом не показываются — они нужны только для будущих публикаций.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Призрачные посты</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Когда у системного поста включено <strong>циклическое повторение</strong>, 
                        сетка автоматически показывает будущие копии этого поста.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Призраки имеют прозрачность 70% и более светлый фон с пунктирной рамкой</li>
                        <li>Показывают, когда автоматизация сработает в будущем</li>
                        <li>При клике на призрак открывается настройка оригинального поста</li>
                        <li>Призраки нельзя перетаскивать или редактировать</li>
                        <li>Генерируются только для активных системных постов</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                        Например: если AI-лента настроена публиковаться каждый день в 9:00, 
                        ты увидишь призрачные копии на каждый день недели.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Перетаскивание (Drag-and-Drop)</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Обычные посты и заметки можно <strong>перетаскивать</strong> между днями:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>Зажми карточку мышью и перетащи на другой день</li>
                        <li>При наведении колонка-цель подсвечивается синим фоном</li>
                        <li>Отпусти кнопку мыши — пост/заметка переместится</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                        <strong>Нельзя перетаскивать:</strong> системные посты, призрачные посты, опубликованные посты.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Быстрое создание заметки</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Есть два способа быстро создать заметку на конкретный день:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li><strong>Кнопка "+" в заголовке дня</strong> — создаёт пост</li>
                        <li><strong>Двойной клик по пустому месту колонки</strong> — создаёт заметку</li>
                    </ul>
                    <p className="text-xs text-gray-600 mt-2">
                        Это работает только для будущих дней — в прошлое создавать нельзя.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-2">Режим выбора (Selection Mode)</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        Когда включён режим выбора (через кнопку "Выбрать" в шапке):
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                        <li>На каждой карточке появляется чекбокс</li>
                        <li>Клик по карточке = выбор/снятие выбора</li>
                        <li>Перетаскивание отключается</li>
                        <li>Можно выбрать несколько постов/заметок и выполнить массовое действие</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Сценарии использования */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарии использования</h2>

            <div className="not-prose space-y-4 my-8">
                <div className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <h3 className="font-bold text-green-900 mb-2">Планирование контента на неделю</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>Ситуация:</strong> Нужно распределить 10 постов на неделю вперёд.
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-3">
                        <li>Открой вкладку "Расписание"</li>
                        <li>Убедись, что видишь текущую неделю</li>
                        <li>Создай посты через кнопку "+" в нужных днях</li>
                        <li>Посмотри на сетку — видно все пустые места и загруженные дни</li>
                        <li>Если нужно, перетащи посты на другие дни для равномерного распределения</li>
                    </ol>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <h3 className="font-bold text-blue-900 mb-2">Проверка автоматизаций</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>Ситуация:</strong> Настроил AI-ленту на ежедневную публикацию в 9:00. 
                        Хочу убедиться, что она будет работать всю неделю.
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-3">
                        <li>Открой вкладку "Расписание"</li>
                        <li>Посмотри на сетку — должны быть видны призрачные посты AI-ленты на каждый день</li>
                        <li>Если призраки есть на всех днях в 9:00 — всё настроено правильно</li>
                        <li>Если призраков нет — проверь настройки автоматизации</li>
                    </ol>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <h3 className="font-bold text-purple-900 mb-2">Перенос постов на другую неделю</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>Ситуация:</strong> Запланировал посты на эту неделю, 
                        но понял что нужно их сдвинуть на неделю вперёд.
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-3">
                        <li>Включи режим выбора (кнопка "Выбрать" в шапке)</li>
                        <li>Выбери все нужные посты чекбоксами</li>
                        <li>Нажми на стрелку вправо в навигации (переключись на следующую неделю)</li>
                        <li>Нажми "Переместить сюда" в массовых действиях</li>
                        <li>Посты переместятся на те же дни недели, но уже на следующей неделе</li>
                    </ol>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r-lg">
                    <h3 className="font-bold text-orange-900 mb-2">Быстрое добавление напоминаний</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>Ситуация:</strong> В среду нужно не забыть подготовить фото для пятничного поста.
                    </p>
                    <p className="text-sm text-gray-700">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 ml-3">
                        <li>Найди колонку среды в сетке</li>
                        <li>Дважды кликни по пустому месту в колонке</li>
                        <li>Откроется форма создания заметки</li>
                        <li>Напиши текст напоминания, выбери цвет</li>
                        <li>Сохрани — заметка появится в сетке</li>
                    </ol>
                </div>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Почему я не вижу системные посты в прошлых днях?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Системные посты показываются только для будущих публикаций. 
                        После того как автоматизация отработала, системный пост исчезает из календаря 
                        (сама публикация остаётся в ВК, но в сетке её уже нет).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как отличить призрачный пост от обычного системного?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Призрачные посты <strong>полупрозрачные</strong> и имеют пунктирную рамку. 
                        Обычные системные посты непрозрачные (как обычные карточки), но тоже с пунктирной рамкой и цветным фоном.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли скрыть заметки, чтобы видеть только посты?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да! В шапке календаря есть кнопка "Заметки" с выпадающим списком. 
                        Можешь выбрать: "Развёрнутые", "Свёрнутые" или "Скрыты". 
                        В режиме "Скрыты" заметок не будет видно совсем.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Почему нельзя создать пост на прошлый день?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Создание постов и заметок на прошедшие даты заблокировано намеренно. 
                        Календарь предназначен для планирования будущего контента, а не редактирования истории. 
                        Если нужно что-то исправить в прошлом — работай напрямую в ВК.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Сколько призрачных постов может показываться одновременно?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Система генерирует максимум 100 призрачных постов на одну неделю для одной автоматизации. 
                        Это сделано для защиты от зависания — если повторение слишком частое (например, каждую минуту), 
                        ты всё равно не увидишь бесконечный список.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как изменить время поста прямо в сетке?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        В сетке нельзя изменить время напрямую. Нужно кликнуть на карточку поста, 
                        откроется модальное окно редактирования — там сможешь поменять дату и время. 
                        Либо перетащи пост на другой день, а потом отредактируй время в модалке.
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
                            Привыкни использовать сетку как <strong>визуальный планировщик</strong>. 
                            Держи календарь открытым на второй монитор или во вкладке — 
                            так ты всегда будешь видеть "загруженность" недели и пустые дни.
                        </p>
                        <p className="text-sm text-gray-700">
                            Используй <strong>цвета заметок</strong> для разделения типов задач: 
                            красные — срочные, жёлтые — важные, зелёные — выполнено. 
                            Так сетка становится не просто календарём, а полноценным рабочим инструментом.
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
                        <span>Сетка показывает 7 дней (неделю) одновременно</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Каждый день — отдельная колонка с заголовком, историями, постами и заметками</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Контент внутри дня отсортирован по времени</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Призрачные посты показывают будущие повторения автоматизаций</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Обычные посты и заметки можно перетаскивать между днями</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Системные посты и призраки перетаскивать нельзя</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Двойной клик по пустому месту = быстрое создание заметки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка "+" в заголовке дня = создание поста</span>
                    </li>
                </ul>
            </div>
        </article>
    );
};
