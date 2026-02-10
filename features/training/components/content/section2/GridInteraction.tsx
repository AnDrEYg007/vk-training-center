import React, { useState } from 'react';
import { ContentProps, NavigationLink, Sandbox } from '../shared';

// =====================================================================
// Взаимодействие с сеткой календаря: обучение
// =====================================================================
export const GridInteraction: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В сетке календаря можно работать с постами, заметками и историями каждого дня. Все действия происходят прямо внутри нужной колонки: вы можете создавать, просматривать, перемещать и выделять элементы — быстро и удобно.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главное:</strong> Все взаимодействия с контентом происходят прямо в сетке — без лишних переходов и сложных меню.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Основные сценарии взаимодействия */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работать с сеткой?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700 mb-4">Ниже кратко перечислены основные действия и ограничения, которые помогут быстро освоиться в рабочей области.</p>
            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Создание поста:</strong> нажмите на кнопку «+» в нужном дне (доступно только для будущих дат).</li>
                <li><strong>Перетаскивание:</strong> перемещайте посты и заметки между днями — просто захватите элемент мышкой и перенесите в другую колонку.</li>
                <li><strong>Просмотр и редактирование:</strong> кликните по посту или заметке, чтобы открыть подробности или внести изменения.</li>
                <li><strong>Выделение:</strong> включите режим выделения, чтобы выбрать несколько постов или заметок для массовых действий.</li>
                <li><strong>Истории:</strong> если в дне есть истории, они отображаются кружками под датой. Кликните по кружку, чтобы посмотреть историю.</li>
                <li><strong>Ограничения:</strong> нельзя создавать посты в прошлом, а кнопка «+» для таких дней будет неактивна.</li>
                <li><strong>Двойной клик по пустому месту дня:</strong> откроет окно для быстрой заметки.</li>
            </ul>

            <Sandbox
                title="Попробуйте взаимодействовать с элементами"
                description="Кликайте по карточкам, включайте режим выделения и пробуйте различные действия."
                instructions={[
                    '<strong>Кликните</strong> по посту или заметке для просмотра',
                    'Включите <strong>режим выделения</strong> и отметьте несколько элементов',
                    'Попробуйте <strong>выделить всё</strong> одной кнопкой'
                ]}
            >
                <InteractiveGridDemo />
            </Sandbox>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 mt-10">Часто задаваемые вопросы</h2>
            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли отменить перемещение?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Если вы случайно переместили элемент, просто перетащите его обратно в нужный день.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Почему кнопка «+» неактивна?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Она отключена для прошедших дней и при включённом режиме выделения.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Что делать, если не видно истории?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Истории отображаются только если они есть в выбранном дне.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли выделить сразу несколько элементов?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да, включите режим выделения и отмечайте нужные посты и заметки.
                    </p>
                </details>
            </div>

            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Используйте перетаскивание для быстрой смены даты публикации — это экономит время при планировании контента.
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
                        <span>Все действия доступны прямо в сетке — без лишних переходов</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Кнопка «+» создаёт пост, двойной клик — заметку</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Перетаскивание работает для быстрого переноса между днями</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Режим выделения позволяет работать с несколькими элементами сразу</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Прошедшие дни защищены от случайных изменений</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Навигация к следующему разделу */}
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <NavigationLink
                    to="2-1-3-1-day-columns"
                    title="Назад: 2.1.3.1 Дневные колонки"
                    description="Подробнее о структуре колонки"
                    variant="prev"
                />
                <NavigationLink
                    to="2-1-3-3-drag-and-drop"
                    title="Далее: 2.1.3.3 Перетаскивание"
                    description="Как перетаскивать элементы между днями"
                    variant="next"
                />
            </div>
        </article>
    );
};

// =====================================================================
// Интерактивный компонент демонстрации взаимодействия
// =====================================================================
const InteractiveGridDemo: React.FC = () => {
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [clickedItem, setClickedItem] = useState<number | null>(null);

    const items = [
        { id: 1, type: 'post', time: '10:00', text: 'Утренний пост' },
        { id: 2, type: 'note', time: '14:00', text: 'Созвон с командой' },
        { id: 3, type: 'post', time: '16:00', text: 'Вечерний пост' },
        { id: 4, type: 'note', time: '18:00', text: 'Подготовить фото' },
    ];

    const toggleSelection = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleItemClick = (id: number) => {
        if (selectionMode) {
            toggleSelection(id);
        } else {
            setClickedItem(id);
            setTimeout(() => setClickedItem(null), 1500);
        }
    };

    const selectAll = () => {
        setSelectedItems(items.map(i => i.id));
    };

    return (
        <div className="space-y-4">
            {/* Панель управления */}
            <div className="flex gap-3 items-center">
                <button
                    onClick={() => {
                        setSelectionMode(!selectionMode);
                        setSelectedItems([]);
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        selectionMode 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                    aria-label={selectionMode ? 'Отключить режим выделения' : 'Включить режим выделения'}
                >
                    {selectionMode ? '✓ Режим выделения' : 'Режим выделения'}
                </button>
                {selectionMode && (
                    <>
                        <button
                            onClick={selectAll}
                            className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors"
                            aria-label="Выделить все элементы"
                        >
                            Выделить всё
                        </button>
                        <span className="text-sm text-gray-600">
                            Выбрано: {selectedItems.length}
                        </span>
                    </>
                )}
            </div>

            {/* Список элементов */}
            <div className="grid grid-cols-2 gap-3">
                {items.map(item => {
                    const isSelected = selectedItems.includes(item.id);
                    const isClicked = clickedItem === item.id;
                    const isPost = item.type === 'post';

                    return (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.id)}
                            className={`
                                p-3 rounded-lg border-2 transition-all cursor-pointer
                                ${isPost ? 'bg-white border-gray-200' : 'bg-yellow-50 border-yellow-200'}
                                ${isSelected ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
                                ${isClicked ? 'scale-105 shadow-lg' : 'hover:shadow-md'}
                                ${selectionMode ? 'cursor-pointer' : 'cursor-pointer'}
                            `}
                            role="button"
                            tabIndex={0}
                            aria-label={`${item.type === 'post' ? 'Пост' : 'Заметка'}: ${item.text}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-600 mb-1">{item.time}</p>
                                    <p className="text-sm text-gray-900">{item.text}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {item.type === 'post' ? '📝 Пост' : '🗒 Заметка'}
                                    </p>
                                </div>
                                {selectionMode && (
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                        isSelected 
                                            ? 'bg-indigo-600 border-indigo-600' 
                                            : 'bg-white border-gray-300'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </div>
                            {isClicked && !selectionMode && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    <p className="text-xs text-indigo-600">👁 Просмотр открыт</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Подсказки */}
            <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-3">
                {selectionMode ? (
                    <p>✓ Режим выделения активен. Кликайте по элементам для выбора.</p>
                ) : (
                    <p>Кликните по элементу для просмотра. Включите режим выделения для массовых действий.</p>
                )}
            </div>
        </div>
    );
};
