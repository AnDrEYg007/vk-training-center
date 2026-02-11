import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Перетаскивание в сетке календаря
// =====================================================================
export const DragAndDrop: React.FC<ContentProps> = ({ title }) => {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
    const [columns, setColumns] = useState<Record<'monday' | 'tuesday' | 'wednesday', string[]>>({
        monday: ['Пост 10:00', 'Заметка 14:00'],
        tuesday: ['Пост 12:00'],
        wednesday: []
    });

    const handleDragStart = (item: string) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent, column: string) => {
        e.preventDefault();
        setDragOverColumn(column);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (targetColumn: keyof typeof columns) => {
        if (!draggedItem) return;
        setDragOverColumn(null);

        // Найти исходную колонку
        let sourceColumn: keyof typeof columns | null = null;
        for (const [key, items] of Object.entries(columns)) {
            if ((items as string[]).includes(draggedItem)) {
                sourceColumn = key as keyof typeof columns;
                break;
            }
        }

        if (!sourceColumn || sourceColumn === targetColumn) {
            setDraggedItem(null);
            return;
        }

        // Перемещение элемента
        setColumns(prev => ({
            ...prev,
            [sourceColumn]: prev[sourceColumn].filter(item => item !== draggedItem),
            [targetColumn]: [...prev[targetColumn], draggedItem]
        }));

        setDraggedItem(null);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Перетаскивание — это удобный способ перемещать посты и заметки между днями в сетке календаря. 
                Просто захватите элемент мышкой и перенесите его в нужную колонку.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> Перетаскивание работает для постов и заметок. Это позволяет быстро изменить дату публикации или напоминания.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Как работает перетаскивание */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как перетаскивать элементы?</h2>
            <ol className="list-decimal list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Наведите курсор</strong> на пост или заметку, которую хотите переместить.</li>
                <li><strong>Зажмите левую кнопку мыши</strong> и начните перетаскивание — элемент "прилипнет" к курсору.</li>
                <li><strong>Перенесите элемент</strong> в нужную колонку (день недели).</li>
                <li><strong>Отпустите кнопку мыши</strong> — элемент переместится в выбранный день, а время останется прежним.</li>
            </ol>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Важно:</strong> При перетаскивании изменяется только дата, время публикации сохраняется. Если нужно изменить время — откройте пост и отредактируйте его вручную.
                </p>
            </div>

            {/* Интерактивная демонстрация */}
            <Sandbox
                title="Попробуйте перетащить элемент"
                description="Захватите карточку мышкой и перенесите её в другой день. Демонстрация работает только с мышью."
                instructions={[
                    'Наведите на карточку и зажмите левую кнопку мыши',
                    'Перетащите в другую колонку',
                    'Отпустите — элемент переместится'
                ]}
            >
                <div className="grid grid-cols-3 gap-4">
                    {/* Понедельник */}
                    <div
                        role="region"
                        aria-label="Понедельник — зона перетаскивания"
                        onDragOver={(e) => handleDragOver(e, 'monday')}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop('monday')}
                        className={`border-2 rounded-lg p-4 min-h-[200px] transition-colors ${
                            dragOverColumn === 'monday' 
                                ? 'bg-indigo-100 border-indigo-400' 
                                : 'bg-white border-gray-200'
                        }`}
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Понедельник</h4>
                        <div className="space-y-2">
                            {columns.monday.map((item, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                    role="listitem"
                                    tabIndex={0}
                                    aria-label={`Перетащить ${item}`}
                                    aria-roledescription="перетаскиваемый элемент"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Вторник */}
                    <div
                        role="region"
                        aria-label="Вторник — зона перетаскивания"
                        onDragOver={(e) => handleDragOver(e, 'tuesday')}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop('tuesday')}
                        className={`border-2 rounded-lg p-4 min-h-[200px] transition-colors ${
                            dragOverColumn === 'tuesday' 
                                ? 'bg-indigo-100 border-indigo-400' 
                                : 'bg-white border-gray-200'
                        }`}
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Вторник</h4>
                        <div className="space-y-2">
                            {columns.tuesday.map((item, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(item)}
                                    className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                    role="listitem"
                                    tabIndex={0}
                                    aria-label={`Перетащить ${item}`}
                                    aria-roledescription="перетаскиваемый элемент"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Среда */}
                    <div
                        role="region"
                        aria-label="Среда — зона перетаскивания"
                        onDragOver={(e) => handleDragOver(e, 'wednesday')}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop('wednesday')}
                        className={`border-2 rounded-lg p-4 min-h-[200px] transition-colors ${
                            dragOverColumn === 'wednesday' 
                                ? 'bg-indigo-100 border-indigo-400' 
                                : 'bg-white border-gray-200'
                        }`}
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Среда</h4>
                        <div className="space-y-2">
                            {columns.wednesday.length === 0 ? (
                                <p className="text-sm text-gray-500 italic" aria-live="polite">Перетащите сюда</p>
                            ) : (
                                columns.wednesday.map((item, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={() => handleDragStart(item)}
                                        className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                        role="listitem"
                                        tabIndex={0}
                                        aria-label={`Перетащить ${item}`}
                                        aria-roledescription="перетаскиваемый элемент"
                                    >
                                        {item}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>
            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли перетаскивать несколько элементов сразу?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, перетаскивание работает только для одного элемента за раз. Для массовых действий используйте режим выделения.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Изменится ли время публикации?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, время останется прежним. Изменяется только дата.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли перетащить в прошлое?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да, но для опубликованных постов это может вызвать ошибки. Система предупредит о возможных проблемах.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Что делать, если случайно переместил не туда?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Просто перетащите элемент обратно в нужный день.
                    </p>
                </details>
            </div>

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Используйте перетаскивание для быстрого перепланирования контента. Это экономит время по сравнению с ручным редактированием каждого поста.
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
                        <span>Перетаскивание работает для постов и заметок</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Изменяется только дата, время остаётся прежним</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Колонка-цель подсвечивается синим при наведении</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Для массовых действий используйте режим выделения</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Ошиблись? Просто перетащите обратно</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-3-3-drag-and-drop" />
        </article>
    );
};
