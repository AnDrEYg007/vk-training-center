import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: DiffViewer (показывает изменения)
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

// Mock компонент: всплывающее окно изменения названий (ручной режим)
const MockBulkTitleModal: React.FC<{ onClose: () => void; onAiClick: () => void }> = ({ onClose, onAiClick }) => {
    const [activeMode, setActiveMode] = useState<'add' | 'remove'>('add');
    const [addPosition, setAddPosition] = useState<'start' | 'end'>('end');
    const [addText, setAddText] = useState('#распродажа');
    const [removeText, setRemoveText] = useState('❌');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение названий</h2>
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

                <main className="p-6">
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
                                <input
                                    type="text"
                                    value={addText}
                                    onChange={e => setAddText(e.target.value)}
                                    className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Например, #новинка или ❄️"
                                />
                            </div>
                        </div>
                    )}

                    {activeMode === 'remove' && (
                        <div className="space-y-2 animate-fade-in-up">
                            <label className="block text-sm font-medium text-gray-700">Текст для удаления</label>
                            <input
                                type="text"
                                value={removeText}
                                onChange={e => setRemoveText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Например, ❌ или старый текст"
                            />
                            <p className="text-xs text-gray-500">
                                Все вхождения этого текста будут удалены из названий выбранных товаров.
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

// Mock компонент: AI-коррекция названий (результаты)
const MockAiCorrectionView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [selectedItems, setSelectedItems] = useState<number[]>([0, 1, 2]);

    const mockData = [
        {
            id: 0,
            original: 'Кросовки Nike Air Max 90 чёрные размер 42',
            modified: 'Кроссовки Nike Air Max 90 чёрные размер 42'
        },
        {
            id: 1,
            original: 'Сумка женская кожанная коричнегого цвета',
            modified: 'Сумка женская кожаная коричневого цвета'
        },
        {
            id: 2,
            original: 'Футболка мужская ХL белая 100% хлопок',
            modified: 'Футболка мужская XL белая 100% хлопок'
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
                    <h2 className="text-lg font-semibold text-gray-800">AI-коррекция названий</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        AI проверил <strong>42</strong> товара и нашёл <strong>3</strong> ошибки. 
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

export const ProductsBulkTitlePage: React.FC<ContentProps> = ({ title }) => {
    const [showManualModal, setShowManualModal] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое редактирование названий позволяет добавлять или удалять текст из названий сразу многих товаров. 
                Кроме ручного режима, доступна AI-коррекция для исправления опечаток и грамматических ошибок.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ручное редактирование: два режима</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 1: Вставить текст</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вставляет текст в начало или конец каждого названия. Подходит для:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Добавления хештегов (#распродажа, #новинка)</li>
                <li>Вставки эмодзи (❄️ для зимних товаров, 🔥 для хитов)</li>
                <li>Маркировки акционных позиций</li>
            </ul>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Было</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Добавить "#распродажа" в конец</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Добавить "🔥" в начало</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">Кроссовки Nike Air Max</td>
                            <td className="px-4 py-2 font-bold text-green-600">Кроссовки Nike Air Max #распродажа</td>
                            <td className="px-4 py-2 font-bold text-green-600">🔥 Кроссовки Nike Air Max</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Сумка кожаная</td>
                            <td className="px-4 py-2 font-bold text-green-600">Сумка кожаная #распродажа</td>
                            <td className="px-4 py-2 font-bold text-green-600">🔥 Сумка кожаная</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режим 2: Удалить текст</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Удаляет все вхождения указанного текста из названий. Полезно для:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Удаления устаревших маркеров (❌, "СНЯТО С ПРОДАЖИ")</li>
                <li>Очистки от текста поставщика ("Оптом дешевле")</li>
                <li>Массового удаления эмодзи после акции</li>
            </ul>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Было</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Удалить "❌"</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">❌ Кроссовки Nike Air Max</td>
                            <td className="px-4 py-2 font-bold text-green-600">Кроссовки Nike Air Max</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Сумка кожаная ❌</td>
                            <td className="px-4 py-2 font-bold text-green-600">Сумка кожаная</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Совет про хештеги:</h4>
                <p className="text-sm text-blue-800">
                    Не забывайте пробел перед хештегом при добавлении в конец: <strong>" #распродажа"</strong> (с пробелом в начале), 
                    иначе получится "MaxИмя#распродажа" без разделения.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">AI-коррекция названий</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"AI-коррекция"</strong> запускает автоматическую проверку всех выбранных товаров. 
                AI находит и исправляет:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Опечатки:</strong> "кросовки" → "кроссовки", "кожанная" → "кожаная"</li>
                <li><strong>Грамматические ошибки:</strong> "коричнегого" → "коричневого"</li>
                <li><strong>Неправильные символы:</strong> "ХL" (русская Х) → "XL" (английская X)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как работает AI-коррекция</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Вы выбираете товары и нажимаете "AI-коррекция"</li>
                <li>AI анализирует названия (занимает несколько секунд)</li>
                <li>Открывается таблица с найденными ошибками</li>
                <li>Столбец "Было" показывает оригинал с подсветкой удалённых частей (красный фон, зачёркнуто)</li>
                <li>Столбец "Стало" показывает исправленный вариант с подсветкой добавленных частей (зелёный фон)</li>
                <li>Вы выбираете, какие исправления применить (галочки слева)</li>
                <li>Нажимаете "Применить N изменений"</li>
            </ol>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">Пример визуализации изменений:</h4>
                <div className="space-y-2 text-sm">
                    <div>
                        <p className="text-xs text-purple-700 font-semibold mb-1">Было:</p>
                        <div className="bg-white p-2 rounded border border-purple-200">
                            <span className="text-gray-600">Кросовки Nike Air Max 90 чёрные</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-purple-700 font-semibold mb-1">Стало:</p>
                        <div className="bg-white p-2 rounded border border-purple-200">
                            <span className="bg-red-100 text-red-800 line-through px-1">Кросовки</span>{' '}
                            <span className="bg-green-100 text-green-800 px-1">Кроссовки</span>{' '}
                            <span className="text-gray-600">Nike Air Max 90 чёрные</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про AI:</h4>
                <p className="text-sm text-yellow-800">
                    AI может предложить неправильное исправление (например, если специфический термин принят за ошибку). 
                    Всегда проверяйте предложенные изменения перед применением — снимите галочки с неподходящих строк.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практический сценарий</h2>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-3">Задача: пометить все товары из зимней коллекции эмодзи ❄️</h4>
                <div className="space-y-2">
                    <p className="text-sm text-green-700">
                        <strong>1.</strong> Отфильтруйте товары по подборке "Зимняя коллекция"
                    </p>
                    <p className="text-sm text-green-700">
                        <strong>2.</strong> Нажмите "Выбрать" → "Изменить" → "Название"
                    </p>
                    <p className="text-sm text-green-700">
                        <strong>3.</strong> Выберите режим "Вставить текст" → позиция "В начало"
                    </p>
                    <p className="text-sm text-green-700">
                        <strong>4.</strong> Введите "❄️ " (эмодзи + пробел)
                    </p>
                    <p className="text-sm text-green-700">
                        <strong>5.</strong> Нажмите "Применить"
                    </p>
                    <p className="text-xs text-green-600 mt-2 italic">
                        Результат: все названия получат снежинку в начале (❄️ Шапка вязаная, ❄️ Перчатки кожаные...)
                    </p>
                </div>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение названий"
                description="Два интерактивных окна: ручное редактирование и AI-коррекция."
                instructions={[
                    'Нажмите "Открыть ручное окно" для добавления/удаления текста',
                    'Попробуйте переключить позицию (в начало/в конец)',
                    'Нажмите "Открыть AI-коррекцию" для просмотра таблицы с ошибками',
                    'В AI-таблице попробуйте снять/поставить галочки',
                    'Обратите внимание на подсветку изменений в столбце "Было"'
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
                    <MockBulkTitleModal
                        onClose={() => setShowManualModal(false)}
                        onAiClick={() => {
                            setShowManualModal(false);
                            setShowAiModal(true);
                        }}
                    />
                )}
                {showAiModal && <MockAiCorrectionView onClose={() => setShowAiModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-3-bulk-title" />
        </article>
    );
};
