import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: CategorySelector (два уровня: раздел и категория)
const CategorySelector: React.FC<{
    section: string;
    category: string;
    onSectionChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}> = ({ section, category, onSectionChange, onCategoryChange }) => {
    const sections = [
        { id: '1', name: 'Одежда', categories: ['Верхняя одежда', 'Футболки', 'Брюки', 'Юбки'] },
        { id: '2', name: 'Обувь', categories: ['Кроссовки', 'Ботинки', 'Туфли', 'Сандалии'] },
        { id: '3', name: 'Аксессуары', categories: ['Сумки', 'Кошельки', 'Ремни', 'Шарфы'] }
    ];

    const currentSection = sections.find(s => s.id === section);

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Раздел VK</label>
                <select
                    value={section}
                    onChange={e => {
                        onSectionChange(e.target.value);
                        onCategoryChange('');
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Выберите раздел...</option>
                    {sections.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                </select>
            </div>
            {currentSection && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория VK</label>
                    <select
                        value={category}
                        onChange={e => onCategoryChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Выберите категорию...</option>
                        {currentSection.categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

// Mock компонент: всплывающее окно изменения категории (ручной режим)
const MockBulkCategoryModal: React.FC<{ onClose: () => void; onAiClick: () => void }> = ({ onClose, onAiClick }) => {
    const [section, setSection] = useState('2');
    const [category, setCategory] = useState('Кроссовки');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Массовое изменение категории VK</h2>
                    <p className="text-sm text-gray-500 mt-1">Это действие будет применено к <strong>42</strong> выбранным товарам.</p>
                </header>

                <main className="p-6">
                    <CategorySelector
                        section={section}
                        category={category}
                        onSectionChange={setSection}
                        onCategoryChange={setCategory}
                    />
                    <p className="text-xs text-gray-500 mt-3">
                        Выберите раздел VK, затем категорию. Все выбранные товары получат эту категорию.
                    </p>
                </main>

                <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                    <button
                        onClick={onAiClick}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI-помощник
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

// Mock компонент: AI-помощник (три состояния: анализ → загрузка → результаты)
const MockAiCategoryView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [view, setView] = useState<'loading' | 'results'>('loading');
    const [selectedItems, setSelectedItems] = useState<number[]>([0, 1, 2]);

    React.useEffect(() => {
        if (view === 'loading') {
            const timer = setTimeout(() => setView('results'), 2000);
            return () => clearTimeout(timer);
        }
    }, [view]);

    const mockData = [
        { id: 0, product: 'Nike Air Max 90 Black', suggestedSection: 'Обувь', suggestedCategory: 'Кроссовки' },
        { id: 1, product: 'Сумка кожаная женская коричневая', suggestedSection: 'Аксессуары', suggestedCategory: 'Сумки' },
        { id: 2, product: 'Футболка мужская белая 100% хлопок', suggestedSection: 'Одежда', suggestedCategory: 'Футболки' }
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
                    <h2 className="text-lg font-semibold text-gray-800">AI-помощник: подбор категорий VK</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {view === 'loading' && 'AI анализирует названия и описания товаров для определения категорий...'}
                        {view === 'results' && (
                            <>AI проанализировал <strong>42</strong> товара и предложил категории. Выберите, какие применить.</>
                        )}
                    </p>
                </header>

                <main className="p-6 overflow-y-auto">
                    {view === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-12 animate-fade-in-up">
                            <div className="loader mb-4"></div>
                            <p className="text-sm text-gray-600">AI анализирует товары...</p>
                            <p className="text-xs text-gray-500 mt-1">Это может занять несколько секунд</p>
                        </div>
                    )}

                    {view === 'results' && (
                        <div className="overflow-x-auto animate-fade-in-up">
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
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Товар</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Раздел</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Категория</th>
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
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.product}</td>
                                            <td className="px-4 py-3 text-green-600">{item.suggestedSection}</td>
                                            <td className="px-4 py-3 text-green-600">{item.suggestedCategory}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">Отмена</button>
                    {view === 'results' && (
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                            Применить {selectedItems.length} изменений
                        </button>
                    )}
                </footer>
            </div>
        </div>
    );
};

export const ProductsBulkCategoryPage: React.FC<ContentProps> = ({ title }) => {
    const [showManualModal, setShowManualModal] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Массовое изменение категории VK позволяет переместить группу товаров в другой раздел и категорию каталога VK. 
                Помимо ручного выбора, доступен AI-помощник, который автоматически подбирает категории на основе названий и описаний.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">Что такое раздел и категория VK:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li><strong>Раздел</strong> — верхний уровень классификации (например, "Обувь", "Одежда", "Аксессуары")</li>
                    <li><strong>Категория</strong> — подтип внутри раздела (например, раздел "Обувь" → категория "Кроссовки")</li>
                    <li>Правильная категоризация помогает покупателям находить товары через фильтры VK</li>
                </ul>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ручное изменение категории</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В ручном режиме вы выбираете раздел VK, затем категорию. Все выбранные товары получат эту комбинацию.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Выберите товары через фильтры и "Выбрать"</li>
                <li>Нажмите "Изменить" → "Категорию VK"</li>
                <li>Выберите раздел из первого выпадающего списка (например, "Обувь")</li>
                <li>Выберите категорию из второго списка (например, "Кроссовки")</li>
                <li>Нажмите "Применить"</li>
            </ol>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Сценарий</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Раздел</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">Категория</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-4 py-2">Перемещение кроссовок</td>
                            <td className="px-4 py-2 font-medium text-green-600">Обувь</td>
                            <td className="px-4 py-2 font-medium text-green-600">Кроссовки</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Сумки в аксессуары</td>
                            <td className="px-4 py-2 font-medium text-green-600">Аксессуары</td>
                            <td className="px-4 py-2 font-medium text-green-600">Сумки</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">Футболки в одежду</td>
                            <td className="px-4 py-2 font-medium text-green-600">Одежда</td>
                            <td className="px-4 py-2 font-medium text-green-600">Футболки</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">AI-помощник: автоматический подбор категорий</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка <strong>"AI-помощник"</strong> запускает автоматический анализ названий и описаний товаров. 
                AI определяет, в какой раздел и категорию VK лучше всего поместить каждый товар.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как работает AI-помощник</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Вы выбираете товары и нажимаете "AI-помощник"</li>
                <li>AI анализирует название и описание каждого товара (занимает несколько секунд)</li>
                <li>Открывается таблица с предложенными категориями</li>
                <li>В таблице 4 столбца: галочка, товар, раздел (предложенный), категория (предложенная)</li>
                <li>Вы просматриваете предложения и снимаете галочки с неподходящих</li>
                <li>Нажимаете "Применить N изменений"</li>
            </ol>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">Пример работы AI:</h4>
                <div className="space-y-2 text-sm">
                    <div className="bg-white p-2 rounded border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1"><strong>Товар:</strong> Nike Air Max 90 Black</p>
                        <p className="text-xs text-green-600"><strong>AI предложил:</strong> Раздел "Обувь" → Категория "Кроссовки"</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1"><strong>Товар:</strong> Сумка кожаная женская коричневая</p>
                        <p className="text-xs text-green-600"><strong>AI предложил:</strong> Раздел "Аксессуары" → Категория "Сумки"</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-purple-200">
                        <p className="text-xs text-purple-700 mb-1"><strong>Товар:</strong> Футболка мужская белая 100% хлопок</p>
                        <p className="text-xs text-green-600"><strong>AI предложил:</strong> Раздел "Одежда" → Категория "Футболки"</p>
                    </div>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Когда использовать AI-помощник</h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>После массового импорта:</strong> поставщик загрузил 200 товаров с неправильными категориями</li>
                <li><strong>Реорганизация каталога:</strong> изменилась структура разделов VK, нужно перекатегоризировать товары</li>
                <li><strong>Исправление ошибок прошлого:</strong> товары добавлялись вручную с ошибками в категориях</li>
                <li><strong>Экономия времени:</strong> вместо 100 ручных операций — одна AI-проверка с подтверждением</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно про проверку AI-результатов:</h4>
                <p className="text-sm text-yellow-800">
                    AI может ошибаться с нестандартными товарами или мультифункциональными предметами 
                    (например, "кроссовки-ботинки гибрид"). Всегда проверяйте таблицу перед применением 
                    и корректируйте галочки вручную при необходимости.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Практический сценарий</h2>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-green-900 mb-3">Задача: исправить категории после импорта от поставщика</h4>
                <div className="space-y-2">
                    <p className="text-sm text-green-700">
                        <strong>Ситуация:</strong> Поставщик загрузил 180 товаров через CSV. 
                        Все товары попали в категорию "Разное" → "Прочее", потому что в файле не было правильных категорий VK.
                    </p>
                    <p className="text-sm text-green-700">
                        <strong>Решение через AI:</strong>
                    </p>
                    <ol className="text-xs text-green-600 list-decimal list-inside space-y-1">
                        <li>Отфильтровать товары по категории "Прочее"</li>
                        <li>Нажать "Выбрать" → "Изменить" → "Категорию VK"</li>
                        <li>Нажать кнопку "AI-помощник" в модальном окне</li>
                        <li>Подождать 10-15 секунд, пока AI анализирует 180 товаров</li>
                        <li>Просмотреть таблицу с предложенными категориями</li>
                        <li>Снять галочки с 5-10 неточных предложений (если есть)</li>
                        <li>Нажать "Применить 175 изменений"</li>
                    </ol>
                    <p className="text-xs text-green-600 mt-2 italic">
                        Результат: вместо 180 ручных операций (по ~30 секунд каждая = 90 минут работы) — 
                        одна AI-проверка за 2 минуты.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-indigo-900 mb-2">💡 Совет про ручной режим:</h4>
                <p className="text-sm text-indigo-800">
                    Если у вас однородная группа товаров (например, 50 моделей кроссовок одного бренда), 
                    ручной режим быстрее — просто выберите раздел "Обувь" → категорию "Кроссовки" для всех сразу.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Массовое изменение категории VK"
                description="Два интерактивных окна: ручной выбор категории и AI-помощник."
                instructions={[
                    'Нажмите "Открыть ручное окно" для выбора раздела и категории',
                    'Попробуйте выбрать раздел — обратите внимание, как появляется второй селектор',
                    'Нажмите "Открыть AI-помощник" для автоматического подбора',
                    'В AI-окне дождитесь загрузки (2 секунды) и просмотрите таблицу результатов',
                    'Попробуйте снять/поставить галочки в таблице'
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
                        Открыть AI-помощник
                    </button>
                </div>
                {showManualModal && (
                    <MockBulkCategoryModal
                        onClose={() => setShowManualModal(false)}
                        onAiClick={() => {
                            setShowManualModal(false);
                            setShowAiModal(true);
                        }}
                    />
                )}
                {showAiModal && <MockAiCategoryView onClose={() => setShowAiModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-7-6-bulk-category" />
        </article>
    );
};
