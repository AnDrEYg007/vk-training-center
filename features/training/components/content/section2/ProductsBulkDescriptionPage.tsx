import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: AutoSizingTextarea (растягивается по высоте)
const AutoSizingTextarea: React.FC<{
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}> = ({ value, onChange, placeholder }) => {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={4}
        />
    );
};

// Mock компонент: DiffViewer для описаний
const DiffViewer: React.FC<{ original: string; modified: string }> = ({ original, modified }) => {
    const originalWords = original.split(' ');
    const modifiedWords = modified.split(' ');

    return (
        <div className="space-y-1">
            {/* Было (удаления) */}
            <div className="flex flex-wrap gap-1">
                {originalWords.map((word, i) => {
                    const removed = !modifiedWords.includes(word);
                    return (
                        <span
                            key={`old-${i}`}
                            className={removed ? 'bg-red-100 text-red-800 line-through px-1' : 'text-gray-600'}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
            {/* Стало (добавления) */}
            <div className="flex flex-wrap gap-1">
                {modifiedWords.map((word, i) => {
                    const added = !originalWords.includes(word);
                    return (
                        <span
                            key={`new-${i}`}
                            className={added ? 'bg-green-100 text-green-800 px-1' : 'text-gray-600'}
                        >
                            {word}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Mock компонент: всплывающее окно изменения описаний (ручной режим)
const MockBulkDescriptionModal: React.FC<{ onClose: () => void; onAiClick: () => void }> = ({ onClose, onAiClick }) => {
    const [activeMode, setActiveMode] = useState<'add' | 'remove'>('add');
    const [addPosition, setAddPosition] = useState<'start' | 'end'>('end');
    const [addText, setAddText] = useState('⚠️ Внимание: размеры указаны производителем. Рекомендуем уточнять перед покупкой.');
    const [removeText, setRemoveText] = useState('Оптом дешевле! Звоните: +7(XXX)XXX-XX-XX');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение описаний</h2>
                    <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>42</strong> выбранным товарам.</p>
                </header>

                {/* Табы режимов */}
                <div className="p-4 border-b">
                    <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                        <button 
                            onClick={() => setActiveMode('add')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'add' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Вставить текст
                        </button>
                        <button 
                            onClick={() => setActiveMode('remove')} 
                            className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeMode === 'remove' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                        >
                            Удалить текст
                        </button>
                    </div>
                </div>

                <main className="p-6 overflow-y-auto">
                    {activeMode === 'add' && (
                        <div className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Позиция</label>
                                <div className="flex rounded-md p-1 bg-gray-200 gap-1">
                                    <button 
                                        onClick={() => setAddPosition('start')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${addPosition === 'start' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        В начало
                                    </button>
                                    <button 
                                        onClick={() => setAddPosition('end')} 
                                        className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${addPosition === 'end' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        В конец
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Текст для вставки</label>
                                <AutoSizingTextarea
                                    value={addText}
                                    onChange={setAddText}
                                    placeholder="Введите текст, который нужно добавить ко всем описаниям..."
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Этот текст будет добавлен к описанию каждого выбранного товара.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeMode === 'remove' && (
                        <div className="space-y-2 animate-fade-in-up">
                            <label className="block text-sm font-medium text-gray-700">Текст для удаления</label>
                            <AutoSizingTextarea
                                value={removeText}
                                onChange={setRemoveText}
                                placeholder="Введите текст, который нужно удалить из всех описаний..."
                            />
                            <p className="text-xs text-gray-500">
                                Все вхождения этого текста будут удалены из описаний выбранных товаров.
                            </p>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                    <button
                        onClick={onAiClick}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Исправить ошибки (AI)
                    </button>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Применить</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

// Mock компонент: AI-коррекция описаний (результаты)
const MockAiCorrectionView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([0, 1]);

    const mockData = [
        {
            id: 0,
            original: 'Кросовки из натуральной кожи. Размер 42. Цвет чёрный.',
            modified: 'Кроссовки из натуральной кожи. Размер 42. Цвет чёрный.'
        },
        {
            id: 1,
            original: 'Сумка женская. Матереал: кожа. Производство Италия.',
            modified: 'Сумка женская. Материал: кожа. Производство Италия.'
        }
    ];

    const toggleItem = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        setSelectedItems(prev =>
            prev.length === mockData.length ? [] : mockData.map(d => d.id)
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">AI-коррекция описаний</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        AI проверил <strong>42</strong> товара и нашёл <strong>2</strong> ошибки. 
                        Выберите изменения, которые хотите применить.
                    </p>
                </header>

                <main className="p-6 overflow-y-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm border">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.length === mockData.length}
                                            onChange={toggleAll}
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                        />
                                    </th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Было</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Стало</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {mockData.map(item => (
                                    <tr key={item.id} className={selectedItems.includes(item.id) ? 'bg-indigo-50' : ''}>
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleItem(item.id)}
                                                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <DiffViewer original={item.original} modified={item.modified} />
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.modified}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                        Применить {selectedItems.length} изменений
                    </button>
                </footer>
            </div>
        </div>
    );
};

export const ProductsBulkDescriptionPage: React.FC<ContentProps> = ({ title }) => {
    const [showManualModal, setShowManualModal] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое редактирование описаний работает точно так же, как редактирование названий: 
                можно добавлять текст в начало/конец или удалять ненужные части. 
                AI-коррекция исправляет опечатки и грамматические ошибки.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ручное редактирование описаний</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 1: Вставить текст</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Добавляет блок текста к описанию каждого товара. Популярные сценарии:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Юридические оговорки:</strong> "Внимание: размеры могут отличаться на ±1см"</li>
                <li><strong>Условия доставки:</strong> "Бесплатная доставка при заказе от 3000₽"</li>
                <li><strong>Акционная информация:</strong> "🔥 Скидка 20% действует до конца месяца!"</li>
                <li><strong>Инструкции по уходу:</strong> "Стирка при температуре не выше 30°C"</li>
            </ul>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">Пример: добавление оговорки о размерах</h4>
                <div className="space-y-2 text-sm">
                    <div>
                        <p className="text-xs text-blue-700 font-semibold mb-1">Было (описание кроссовок):</p>
                        <div className="bg-white p-2 rounded border border-blue-200 text-gray-700">
                            Кроссовки из натуральной кожи. Размер 42. Цвет чёрный. Подходят для повседневной носки.
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-blue-700 font-semibold mb-1">Стало (после добавления в конец):</p>
                        <div className="bg-white p-2 rounded border border-blue-200 text-gray-700">
                            Кроссовки из натуральной кожи. Размер 42. Цвет чёрный. Подходят для повседневной носки. 
                            <span className="text-green-600 font-bold"> ⚠️ Внимание: размеры указаны производителем. Рекомендуем уточнять перед покупкой.</span>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 2: Удалить текст</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Удаляет все вхождения указанного текста. Особенно полезно при:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Очистке от рекламы поставщика:</strong> "Оптом дешевле! Звоните: +7(XXX)XXX-XX-XX"</li>
                <li><strong>Удалении устаревших акций:</strong> "Скидка до 31 декабря"</li>
                <li><strong>Удалении дублирующейся информации:</strong> повторяющиеся фразы после импорта</li>
            </ul>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">Пример: удаление текста поставщика</h4>
                <div className="space-y-2 text-sm">
                    <div>
                        <p className="text-xs text-purple-700 font-semibold mb-1">Было:</p>
                        <div className="bg-white p-2 rounded border border-purple-200 text-gray-700">
                            Сумка женская кожаная. Размер 30x20см. Цвет коричневый. 
                            <span className="text-red-600 line-through"> Оптом дешевле! Звоните: +7(XXX)XXX-XX-XX</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-purple-700 font-semibold mb-1">Стало (после удаления):</p>
                        <div className="bg-white p-2 rounded border border-purple-200 text-gray-700">
                            Сумка женская кожаная. Размер 30x20см. Цвет коричневый.
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">AI-коррекция описаний</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"AI-коррекция"</strong> анализирует описания и исправляет:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Опечатки:</strong> "матереал" → "материал", "кросовки" → "кроссовки"</li>
                <li><strong>Грамматические ошибки:</strong> "с кожанными вставками" → "с кожаными вставками"</li>
                <li><strong>Пунктуацию:</strong> добавляет пропущенные запятые и точки</li>
                <li><strong>Машинный перевод:</strong> исправляет корявые фразы после автоперевода ("in stock" → "в наличии")</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Особенности AI для описаний</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В отличие от названий, описания обычно длиннее (несколько предложений), поэтому AI может найти больше ошибок в одном товаре. 
                В таблице результатов столбец "Было" показывает изменения с подсветкой:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Красный фон, зачёркнуто:</strong> удалённые части (старая ошибка)</li>
                <li><strong>Зелёный фон:</strong> добавленные части (новое правильное слово)</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про проверку AI-результатов:</h4>
                <p className="text-sm text-yellow-800">
                    AI может неверно интерпретировать технические термины или бренды (например, исправить правильное название модели). 
                    Всегда просматривайте таблицу перед применением и снимайте галочки с неподходящих исправлений.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практические сценарии</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Сценарий 1: Добавить условия возврата</h4>
                    <p className="text-sm text-green-700 mb-2">
                        <strong>Задача:</strong> добавить к 200 товарам информацию "Возврат в течение 14 дней при сохранении товарного вида"
                    </p>
                    <p className="text-xs text-green-600">
                        <strong>Решение:</strong> Выбрать товары → "Изменить" → "Описание" → режим "Вставить текст" → 
                        позиция "В конец" → вставить текст → "Применить"
                    </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-bold text-orange-900 mb-2">Сценарий 2: Очистка от рекламы поставщика</h4>
                    <p className="text-sm text-orange-700 mb-2">
                        <strong>Задача:</strong> удалить из 150 описаний фразу "Оптом дешевле! Звоните: ..."
                    </p>
                    <p className="text-xs text-orange-600">
                        <strong>Решение:</strong> Выбрать товары → "Изменить" → "Описание" → режим "Удалить текст" → 
                        вставить фразу поставщика → "Применить"
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-bold text-purple-900 mb-2">Сценарий 3: Исправление опечаток импорта</h4>
                    <p className="text-sm text-purple-700 mb-2">
                        <strong>Задача:</strong> после импорта CSV обнаружились опечатки в 80 описаниях
                    </p>
                    <p className="text-xs text-purple-600">
                        <strong>Решение:</strong> Выбрать товары → "Изменить" → "Описание" → 
                        нажать "AI-коррекция" → проверить таблицу → применить исправления
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-blue-900 mb-2">Сценарий 4: Добавить эмодзи для визуала</h4>
                    <p className="text-sm text-blue-700 mb-2">
                        <strong>Задача:</strong> добавить эмодзи 🔥 в начало описаний хитов продаж
                    </p>
                    <p className="text-xs text-blue-600">
                        <strong>Решение:</strong> Отфильтровать хиты → "Изменить" → "Описание" → 
                        режим "Вставить текст" → позиция "В начало" → ввести "🔥 " → "Применить"
                    </p>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-indigo-900 mb-2">💡 Совет про форматирование:</h4>
                <p className="text-sm text-indigo-800">
                    При добавлении текста в конец не забывайте про разделители. Добавьте пробел или перенос строки в начале вашего текста: 
                    <strong>" \n\n⚠️ Внимание: ..."</strong> (с двумя переносами строк для отступа).
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение описаний"
                description="Два интерактивных окна: ручное редактирование и AI-коррекция."
                instructions={[
                    'Нажмите "Открыть ручное окно" для добавления/удаления текста',
                    'Попробуйте переключить позицию (в начало/в конец)',
                    'Обратите внимание на растягивающееся поле ввода (AutoSizingTextarea)',
                    'Нажмите "Открыть AI-коррекцию" для просмотра таблицы с ошибками',
                    'В AI-таблице снимите/поставьте галочки для выбора исправлений'
                ]}
            >
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowManualModal(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        Открыть ручное окно
                    </button>
                    <button 
                        onClick={() => setShowAiModal(true)}
                        className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-md flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Открыть AI-коррекцию
                    </button>
                </div>
                {showManualModal && (
                    <MockBulkDescriptionModal
                        onClose={() => setShowManualModal(false)}
                        onAiClick={() => {
                            setShowManualModal(false);
                            setShowAiModal(true);
                        }}
                    />
                )}
                {showAiModal && <MockAiCorrectionView onClose={() => setShowAiModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-4-bulk-description" />
        </article>
    );
};
