import React, { useState, useEffect } from 'react';
import { ContentProps, Sandbox, NavigationLink } from '../shared';

// =====================================================================
// Быстрое создание заметки в сетке календаря
// =====================================================================
export const QuickNote: React.FC<ContentProps> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteColor, setNoteColor] = useState('bg-yellow-100');
    const [notes, setNotes] = useState<Array<{ title: string; color: string }>>([]);

    const handleDoubleClick = () => {
        setShowModal(true);
    };

    const handleSave = () => {
        if (noteTitle.trim()) {
            setNotes([...notes, { title: noteTitle, color: noteColor }]);
            setNoteTitle('');
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setNoteTitle('');
        setShowModal(false);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && showModal) {
                handleCancel();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showModal]);

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Быстрое создание заметки — это удобный способ добавить напоминание или задачу прямо в нужный день календаря. 
                Достаточно дважды кликнуть по свободному месту в колонке дня, и откроется окно для создания заметки.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главное:</strong> Двойной клик по пустому месту дня открывает окно быстрого создания заметки. Это экономит время по сравнению с использованием основной кнопки создания.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Как создать заметку */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как быстро создать заметку?</h2>
            <ol className="list-decimal list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Найдите нужный день</strong> в сетке календаря.</li>
                <li><strong>Дважды кликните</strong> по пустому месту в колонке этого дня (не по посту или существующей заметке).</li>
                <li><strong>Введите текст заметки</strong> в появившемся окне.</li>
                <li><strong>Выберите цвет</strong> для визуального выделения (опционально).</li>
                <li><strong>Нажмите "Сохранить"</strong> — заметка появится в выбранном дне.</li>
            </ol>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <p className="text-sm text-yellow-800">
                    <strong>Важно:</strong> Заметки не публикуются в соцсетях — они видны только вам и используются для планирования и напоминаний.
                </p>
            </div>

            {/* Интерактивная демонстрация */}
            <Sandbox
                title="Попробуйте создать заметку"
                description="Дважды кликните по серой области, чтобы открыть окно создания заметки"
                instructions={[
                    'Дважды кликните по области ниже',
                    'Введите текст заметки',
                    'Выберите цвет (если нужно)',
                    'Нажмите "Сохранить"'
                ]}
            >
                <div className="space-y-4">
                    {/* Область для двойного клика */}
                    <div
                        onDoubleClick={handleDoubleClick}
                        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-200 transition"
                        role="button"
                        tabIndex={0}
                        aria-label="Дважды кликните для создания заметки"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleDoubleClick();
                            }
                        }}
                    >
                        <p className="text-gray-600">Дважды кликните здесь для создания заметки</p>
                    </div>

                    {/* Список созданных заметок */}
                    {notes.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-bold text-gray-900">Созданные заметки:</h4>
                            {notes.map((note, idx) => (
                                <div
                                    key={idx}
                                    className={`${note.color} border-l-4 border-gray-400 p-3 rounded`}
                                >
                                    {note.title}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Модальное окно */}
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div 
                                className="bg-white rounded-lg p-6 w-96 shadow-xl"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="modal-title"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Создать заметку</h3>
                                
                                <label className="block mb-4">
                                    <span className="text-gray-700 font-medium">Текст заметки:</span>
                                    <input
                                        type="text"
                                        value={noteTitle}
                                        onChange={(e) => setNoteTitle(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Например: Подготовить контент"
                                        autoFocus
                                        aria-label="Текст заметки"
                                    />
                                </label>

                                <label className="block mb-6">
                                    <span className="text-gray-700 font-medium">Цвет:</span>
                                    <div className="flex gap-2 mt-2">
                                        {[
                                            { label: 'Жёлтый', value: 'bg-yellow-100' },
                                            { label: 'Зелёный', value: 'bg-green-100' },
                                            { label: 'Красный', value: 'bg-red-100' },
                                            { label: 'Синий', value: 'bg-blue-100' }
                                        ].map((color) => (
                                            <button
                                                key={color.value}
                                                onClick={() => setNoteColor(color.value)}
                                                className={`w-8 h-8 rounded border-2 ${color.value} ${
                                                    noteColor === color.value ? 'border-gray-900' : 'border-gray-300'
                                                } hover:border-gray-600 transition`}
                                                aria-label={color.label}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </label>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                                        aria-label="Отменить создание заметки"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                        aria-label="Сохранить заметку"
                                    >
                                        Сохранить
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Особенности заметок */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Особенности заметок</h2>
            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Приватность:</strong> Заметки видны только вам — они не публикуются и не отправляются в соцсети.</li>
                <li><strong>Цветовая маркировка:</strong> Используйте разные цвета для категоризации (например, красный — срочно, жёлтый — напоминание).</li>
                <li><strong>Перемещение:</strong> Заметки можно перетаскивать между днями.</li>
                <li><strong>Редактирование:</strong> Кликните по заметке один раз, чтобы открыть её для редактирования или удаления.</li>
            </ul>

            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700">
                            Создавайте заметки для важных дедлайнов, встреч с командой или напоминаний о подготовке контента. Это помогает держать всё под контролем.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>
            <div className="not-prose space-y-4 my-8">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли создать заметку в прошлом?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да, но она не будет иметь практической ценности — заметки предназначены для планирования будущих действий.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Сколько заметок можно создать в один день?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Количество не ограничено, но для удобства рекомендуется не более 5–7 заметок в день.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли добавить время к заметке?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Заметки не имеют точного времени — они прикрепляются к дню. Если нужно время, укажите его в тексте заметки.
                    </p>
                </details>
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Что делать, если двойной клик не работает?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Убедитесь, что кликаете по пустому месту, а не по посту или другой заметке.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Двойной клик по пустому месту открывает окно создания заметки</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Заметки приватны — они не публикуются в соцсетях</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Используйте цвета для категоризации задач и напоминаний</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Заметки можно перетаскивать между днями</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Нажмите Escape для быстрого закрытия модального окна</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Навигация к соседним разделам */}
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <NavigationLink
                    to="2-1-3-3-drag-and-drop"
                    title="Назад: 2.1.3.3 Перетаскивание в сетке календаря"
                    description="Как перемещать элементы между днями"
                    variant="prev"
                />
                <NavigationLink
                    to="2-1-4-time-selection"
                    title="Далее: 2.1.4 Выбор времени публикации"
                    description="Настройка точного времени для постов"
                    variant="next"
                />
            </div>
        </article>
    );
};
