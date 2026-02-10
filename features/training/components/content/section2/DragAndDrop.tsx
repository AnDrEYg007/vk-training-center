import React, { useState } from 'react';
import { ContentProps, Sandbox } from '../shared';

// =====================================================================
// Drag-and-Drop в сетке календаря
// =====================================================================
export const DragAndDrop: React.FC<ContentProps> = ({ title }) => {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [columns, setColumns] = useState<Record<'monday' | 'tuesday' | 'wednesday', string[]>>({
        monday: ['Пост 10:00', 'Заметка 14:00'],
        tuesday: ['Пост 12:00'],
        wednesday: []
    });

    const handleDragStart = (item: string, column: string) => {
        setDraggedItem(item);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetColumn: keyof typeof columns) => {
        if (!draggedItem) return;

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
                Drag-and-Drop (перетаскивание) — это удобный способ перемещать посты и заметки между днями в сетке календаря. 
                Просто захватите элемент мышкой и перенесите его в нужную колонку.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главное:</strong> Перетаскивание работает для постов и заметок. Это позволяет быстро изменить дату публикации или напоминания.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Как работает Drag-and-Drop */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как перетаскивать элементы?</h2>
            <ol className="list-decimal list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Наведите курсор</strong> на пост или заметку, которую хотите переместить.</li>
                <li><strong>Зажмите левую кнопку мыши</strong> и начните перетаскивание — элемент "прилипнет" к курсору.</li>
                <li><strong>Перенесите элемент</strong> в нужную колонку (день недели).</li>
                <li><strong>Отпустите кнопку мыши</strong> — элемент переместится в выбранный день, а время останется прежним.</li>
            </ol>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <p className="text-sm text-yellow-800">
                    <strong>Важно:</strong> При перетаскивании изменяется только дата, время публикации сохраняется. Если нужно изменить время — откройте пост и отредактируйте его вручную.
                </p>
            </div>

            {/* Интерактивная демонстрация */}
            <Sandbox
                title="Попробуйте перетащить элемент"
                description="Захватите карточку мышкой и перенесите её в другой день"
                instructions={[
                    'Наведите на карточку и зажмите левую кнопку мыши',
                    'Перетащите в другую колонку',
                    'Отпустите — элемент переместится'
                ]}
            >
                <div className="grid grid-cols-3 gap-4">
                    {/* Понедельник */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop('monday')}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[200px]"
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Понедельник</h4>
                        <div className="space-y-2">
                            {columns.monday.map((item, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(item, 'monday')}
                                    className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Перетащить ${item}`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Вторник */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop('tuesday')}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[200px]"
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Вторник</h4>
                        <div className="space-y-2">
                            {columns.tuesday.map((item, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(item, 'tuesday')}
                                    className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`Перетащить ${item}`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Среда */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop('wednesday')}
                        className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[200px]"
                    >
                        <h4 className="font-bold text-gray-900 mb-3">Среда</h4>
                        <div className="space-y-2">
                            {columns.wednesday.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">Перетащите сюда</p>
                            ) : (
                                columns.wednesday.map((item, idx) => (
                                    <div
                                        key={idx}
                                        draggable
                                        onDragStart={() => handleDragStart(item, 'wednesday')}
                                        className="bg-blue-100 border border-blue-300 rounded p-2 cursor-move hover:bg-blue-200 transition"
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`Перетащить ${item}`}
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
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">FAQ: Частые вопросы</h2>
            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Можно ли перетаскивать несколько элементов сразу?</strong> Нет, drag-and-drop работает только для одного элемента за раз. Для массовых действий используйте режим выделения.</li>
                <li><strong>Изменится ли время публикации?</strong> Нет, время останется прежним. Изменяется только дата.</li>
                <li><strong>Можно ли перетащить в прошлое?</strong> Да, но для опубликованных постов это может вызвать ошибки. Система предупредит о возможных проблемах.</li>
                <li><strong>Что делать, если случайно переместил не туда?</strong> Просто перетащите элемент обратно в нужный день.</li>
            </ul>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Совет эксперта:</strong> Используйте drag-and-drop для быстрого перепланирования контента. Это экономит время по сравнению с ручным редактированием каждого поста.
                </p>
            </div>

            <hr className="!my-10" />
            <p className="!text-base !leading-relaxed !text-gray-700">
                Drag-and-Drop делает работу с календарём быстрой и интуитивной — просто перетащите элемент туда, куда нужно.
            </p>
        </article>
    );
};
