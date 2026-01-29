import React, { useState } from 'react';
import { ContentProps } from '../shared';

export const BulkActions: React.FC<ContentProps> = ({ title }) => {
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const mockItems = [
        { id: 1, type: 'post', title: '🍕 Новое меню на весну!', date: 'Пн, 15 янв' },
        { id: 2, type: 'note', title: '⏰ Позвонить Ивану (14:00)', date: 'Пн, 15 янв' },
        { id: 3, type: 'post', title: '🎉 Спецпредложение выходного дня', date: 'Вт, 16 янв' },
        { id: 4, type: 'note', title: '📊 Подготовить отчет', date: 'Ср, 17 янв' },
        { id: 5, type: 'post', title: '🎂 День рождения ресторана!', date: 'Чт, 18 янв' }
    ];

    const toggleSelection = (id: number) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedItems(mockItems.map(item => item.id));
    };

    const deselectAll = () => {
        setSelectedItems([]);
    };

    const exitSelectionMode = () => {
        setIsSelectionMode(false);
        setSelectedItems([]);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"Выбрать"</strong> в шапке календаря активирует 
                <strong> режим массового выделения</strong>. Это позволяет выбрать сразу несколько постов 
                или заметок и выполнить с ними одно действие (удалить, переместить, изменить дату и т.д.).
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главная идея:</strong> Вместо того, чтобы редактировать каждый пост отдельно, 
                    ты можешь выделить несколько постов сразу и применить к ним одно действие. 
                    Это экономит время при работе с большим количеством контента.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Где находится */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находится кнопка?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка "Выбрать" расположена в <strong>правой части шапки календаря</strong>, 
                обычно рядом с кнопкой "Обновить". Она имеет иконку <strong>☑️</strong> или текст "Выбрать".
            </p>

            <hr className="!my-10" />

            {/* Как это работает */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работает?</h2>

            <div className="not-prose space-y-6 my-8">
                {/* Шаг 1: Активация режима */}
                <div className="bg-white border-2 border-indigo-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0 bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-indigo-700">1</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-indigo-900 mb-2">Активация режима выделения</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Нажми на кнопку <strong>"Выбрать"</strong> в шапке календаря. 
                                Интерфейс изменится: на каждом посте и заметке появятся чекбоксы (квадратики) для выделения.
                            </p>
                            <div className="bg-indigo-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-1">Что произойдёт:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Кнопка "Выбрать" станет активной (подсвеченной)</li>
                                    <li>На всех постах и заметках появятся чекбоксы</li>
                                    <li>Появится панель действий внизу экрана</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Шаг 2: Выделение элементов */}
                <div className="bg-white border-2 border-green-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0 bg-green-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-green-700">2</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-green-900 mb-2">Выделение нужных элементов</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                Кликай на чекбоксы (☐ → ☑) рядом с постами и заметками, которые хочешь выделить. 
                                Можешь выбрать сколько угодно элементов.
                            </p>
                            <div className="bg-green-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-1">Способы выделения:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>Клик на чекбокс</strong> — выделить один элемент</li>
                                    <li><strong>Кнопка "Выбрать всё"</strong> — выделить все элементы на экране</li>
                                    <li><strong>Кнопка "Снять выделение"</strong> — убрать выделение со всех элементов</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Шаг 3: Выполнение действия */}
                <div className="bg-white border-2 border-purple-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0 bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-purple-700">3</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-purple-900 mb-2">Выполнение действия</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                После выделения нужных элементов выбери действие из 
                                <strong> панели действий внизу экрана</strong>.
                            </p>
                            <div className="bg-purple-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-1">Доступные действия:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>Удалить</strong> — удалить все выделенные элементы</li>
                                    <li><strong>Переместить</strong> — перенести на другую дату</li>
                                    <li><strong>Изменить дату</strong> — массово изменить время публикации</li>
                                    <li><strong>Экспорт</strong> — скачать выделенные посты в файл</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Шаг 4: Выход из режима */}
                <div className="bg-white border-2 border-orange-300 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0 bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center font-bold text-orange-700">4</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-orange-900 mb-2">Выход из режима выделения</h3>
                            <p className="text-sm text-gray-700 mb-3">
                                После выполнения действия (или если передумал) нажми кнопку 
                                <strong> "Отмена"</strong> или <strong>"Готово"</strong> на панели действий, 
                                либо снова нажми кнопку "Выбрать" в шапке.
                            </p>
                            <div className="bg-orange-50 rounded p-3 text-sm text-gray-700">
                                <p className="font-bold mb-1">Что произойдёт:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Чекбоксы исчезнут с постов и заметок</li>
                                    <li>Панель действий внизу закроется</li>
                                    <li>Интерфейс вернётся к обычному виду</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Интерактивная демонстрация */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивная демонстрация</h2>

            <p className="!text-base !leading-relaxed !text-gray-700 mb-6">
                Ниже находится <strong>макет календаря с режимом массового выделения</strong>. 
                Попробуй активировать режим, выделить элементы и посмотреть, как это работает:
            </p>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                {/* Шапка календаря */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Шапка календаря</span>
                        </div>
                        
                        <button
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                                isSelectionMode
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            <span>☑️</span>
                            <span>{isSelectionMode ? 'Режим выделения' : 'Выбрать'}</span>
                        </button>
                    </div>
                </div>

                {/* Список элементов */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-4 font-bold">
                        {isSelectionMode 
                            ? `Выделено: ${selectedItems.length} из ${mockItems.length}` 
                            : 'Календарь (обычный режим)'}
                    </p>

                    <div className="space-y-3">
                        {mockItems.map((item) => (
                            <div
                                key={item.id}
                                className={`border-2 rounded-lg p-3 transition-all ${
                                    selectedItems.includes(item.id)
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : item.type === 'post'
                                        ? 'border-blue-200 bg-blue-50'
                                        : 'border-yellow-200 bg-yellow-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isSelectionMode && (
                                        <button
                                            onClick={() => toggleSelection(item.id)}
                                            className={`w-6 h-6 border-2 rounded flex items-center justify-center font-bold transition-all ${
                                                selectedItems.includes(item.id)
                                                    ? 'bg-indigo-600 border-indigo-600 text-white'
                                                    : 'bg-white border-gray-400 text-gray-400 hover:border-indigo-400'
                                            }`}
                                        >
                                            {selectedItems.includes(item.id) ? '✓' : ''}
                                        </button>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                        <p className="text-xs text-gray-600">{item.date}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded border border-gray-300">
                                        {item.type === 'post' ? '📄 Пост' : '📝 Заметка'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Панель действий */}
                {isSelectionMode && (
                    <div className="bg-indigo-600 text-white rounded-lg p-4 shadow-xl">
                        <div className="flex items-center justify-between mb-3">
                            <p className="font-bold">
                                Выбрано: {selectedItems.length} элемент{selectedItems.length !== 1 ? 'ов' : ''}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={selectAll}
                                    className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded text-sm font-bold transition-colors"
                                >
                                    Выбрать всё
                                </button>
                                <button
                                    onClick={deselectAll}
                                    className="px-3 py-1 bg-indigo-500 hover:bg-indigo-400 rounded text-sm font-bold transition-colors"
                                >
                                    Снять выделение
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <button
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                🗑️ Удалить ({selectedItems.length})
                            </button>
                            <button
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                📅 Переместить ({selectedItems.length})
                            </button>
                            <button
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                ⏰ Изменить дату ({selectedItems.length})
                            </button>
                            <button
                                disabled={selectedItems.length === 0}
                                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                💾 Экспорт ({selectedItems.length})
                            </button>
                            <button
                                onClick={exitSelectionMode}
                                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded font-bold transition-colors ml-auto"
                            >
                                ❌ Отмена
                            </button>
                        </div>
                    </div>
                )}

                {!isSelectionMode && (
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                        <p className="text-sm text-gray-600">
                            Нажми кнопку "Выбрать" в шапке, чтобы активировать режим массового выделения
                        </p>
                    </div>
                )}
            </div>

            <hr className="!my-10" />

            {/* Типичные сценарии использования */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать массовые действия?</h2>

            <div className="not-prose space-y-4 my-8">
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📦</div>
                        <div>
                            <h3 className="font-bold text-blue-900 mb-2">Массовое удаление</h3>
                            <p className="text-sm text-gray-700">
                                <strong>Сценарий:</strong> Создал много тестовых постов и хочешь быстро их удалить.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                ✅ Активируй режим → Выдели ненужные посты → Нажми "Удалить" → Готово!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">📅</div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Перенос расписания</h3>
                            <p className="text-sm text-gray-700">
                                <strong>Сценарий:</strong> Нужно перенести все посты с понедельника на вторник.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                ✅ Выдели все посты в понедельнике → Нажми "Переместить" → Выбери вторник → Готово!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">⏰</div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Массовое изменение времени</h3>
                            <p className="text-sm text-gray-700">
                                <strong>Сценарий:</strong> Все посты на неделе запланированы на 10:00, а нужно на 12:00.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                ✅ Выдели все посты → Нажми "Изменить дату" → Укажи новое время 12:00 → Готово!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50 rounded-r-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-3xl flex-shrink-0">💾</div>
                        <div>
                            <h3 className="font-bold text-orange-900 mb-2">Экспорт контента</h3>
                            <p className="text-sm text-gray-700">
                                <strong>Сценарий:</strong> Нужно скачать все посты за неделю для отчета или резервной копии.
                            </p>
                            <p className="text-xs text-gray-600 mt-2">
                                ✅ Выдели нужные посты → Нажми "Экспорт" → Получи файл со всеми постами → Готово!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Частые вопросы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли выделить посты с разных дней?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Да!</strong> Режим массового выделения позволяет выбирать элементы 
                        с любых дней недели. Выдели что нужно, даже если они в разных колонках.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли выделить одновременно посты и заметки?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Да!</strong> Ты можешь выделить и посты, и заметки одновременно. 
                        Но помни: некоторые действия (например, экспорт) могут работать только с одним типом.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Что делать, если случайно удалил нужные посты?</p>
                    <p className="text-sm text-gray-700">
                        К сожалению, <strong>массовое удаление необратимо</strong>. Всегда дважды проверяй, 
                        что выделил именно те элементы, которые хочешь удалить. Лучше перестраховаться!
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Как быстро выделить все элементы на экране?</p>
                    <p className="text-sm text-gray-700">
                        Активируй режим выделения, затем нажми кнопку 
                        <strong> "Выбрать всё"</strong> на панели действий внизу. 
                        Все видимые элементы будут выделены.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли выделить только посты (без заметок)?</p>
                    <p className="text-sm text-gray-700">
                        Нет автоматического фильтра, но ты можешь <strong>вручную выделить только посты</strong>, 
                        просто не кликая на чекбоксы заметок. Это займёт чуть больше времени, но работает.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Можно ли выйти из режима, не выполняя действие?</p>
                    <p className="text-sm text-gray-700">
                        <strong>Да!</strong> Просто нажми кнопку <strong>"Отмена"</strong> на панели действий 
                        или снова нажми кнопку "Выбрать" в шапке календаря. Режим закроется, ничего не изменится.
                    </p>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 rounded-r-lg">
                    <p className="font-bold text-amber-900 mb-2">❓ Почему кнопка действия неактивна (серая)?</p>
                    <p className="text-sm text-gray-700">
                        Кнопки действий активны только если <strong>выделен хотя бы один элемент</strong>. 
                        Если ничего не выделено, все кнопки будут серыми (заблокированными).
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Совет */}
            <div className="not-prose bg-green-50 border-l-4 border-green-400 pl-4 py-3 rounded-lg">
                <p className="text-green-900 font-bold mb-2">💚 Совет для опытных пользователей</p>
                <p className="text-sm text-gray-700 mb-3">
                    <strong>Используй массовые действия для оптимизации рутины:</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li><strong>Еженедельная чистка:</strong> Удаляй старые заметки и черновики в конце недели</li>
                    <li><strong>Перенос расписания:</strong> Если отменилась акция, быстро перенеси все связанные посты</li>
                    <li><strong>Резервное копирование:</strong> Экспортируй важные посты перед крупными изменениями</li>
                    <li><strong>Массовая корректировка:</strong> Измени время публикации для всех постов на неделе за раз</li>
                </ul>
                <p className="text-xs text-gray-600 mt-3">
                    ⚠️ <strong>Осторожно:</strong> Всегда проверяй, что выделил нужные элементы перед удалением. 
                    Массовое удаление необратимо!
                </p>
            </div>
        </article>
    );
};
