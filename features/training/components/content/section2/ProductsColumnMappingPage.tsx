import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// Mock компонент: всплывающее окно маппинга колонок
const MockColumnMappingModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const mockData = [
        ['VK ID', 'Название', 'Цена', 'Описание'],
        ['123456_789', 'Пицца Маргарита', '450', 'Томатный соус, моцарелла'],
        ['123456_790', 'Пицца Пепперони', '520', 'Томатный соус, пепперони'],
        ['123456_791', 'Пицца 4 сыра', '580', 'Четыре вида сыра'],
    ];

    const [mapping, setMapping] = useState<Record<number, string>>({
        0: 'vk_id',
        1: 'title',
        2: 'price',
        3: 'description'
    });

    const fieldOptions = [
        { value: 'skip', label: 'Пропустить' },
        { value: 'vk_id', label: 'VK ID' },
        { value: 'title', label: 'Название' },
        { value: 'description', label: 'Описание' },
        { value: 'price', label: 'Цена' },
        { value: 'old_price', label: 'Старая цена' },
        { value: 'sku', label: 'Артикул' },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl animate-fade-in-up flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Настройка импорта из файла</h2>
                        <p className="text-xs text-gray-500 mt-1">Сопоставьте колонки вашего файла с полями системы.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <main className="p-6 overflow-hidden flex flex-col flex-grow">
                    <div className="flex-grow overflow-auto border border-gray-200 rounded-lg custom-scrollbar bg-white shadow-inner">
                        <table className="w-full text-sm border-collapse">
                            <thead className="sticky top-0 z-10 bg-gray-100">
                                <tr>
                                    {mockData[0].map((header, idx) => (
                                        <th key={idx} className="p-3 border-r border-gray-200 last:border-0 min-w-[180px]">
                                            <div className="flex flex-col gap-2">
                                                <div className="text-[10px] text-gray-400 uppercase truncate" title={header}>
                                                    Колонка: {header}
                                                </div>
                                                <select
                                                    value={mapping[idx] || 'skip'}
                                                    onChange={e => setMapping(prev => ({ ...prev, [idx]: e.target.value }))}
                                                    className={`w-full p-1.5 border rounded-md text-xs font-bold transition-colors shadow-sm focus:ring-2 focus:ring-indigo-500 ${
                                                        mapping[idx] !== 'skip' ? 'border-indigo-500 text-indigo-700 bg-indigo-50' : 'border-gray-300 text-gray-500'
                                                    }`}
                                                >
                                                    {fieldOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mockData.slice(1).map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-gray-50">
                                        {row.map((cell, cIdx) => (
                                            <td key={cIdx} className={`p-3 border-r border-gray-100 last:border-0 truncate max-w-[200px] ${mapping[cIdx] !== 'skip' ? 'bg-indigo-50/20' : ''}`}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-4 text-xs text-gray-500 italic">Показаны первые 3 строки файла для предпросмотра.</p>
                </main>

                <footer className="p-4 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">Отмена</button>
                    <button className="px-6 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                        Импортировать товары (3)
                    </button>
                </footer>
            </div>
        </div>
    );
};

export const ProductsColumnMappingPage: React.FC<ContentProps> = ({ title }) => {
    const [showMappingModal, setShowMappingModal] = useState(false);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После выбора файла и режима импорта открывается окно сопоставления колонок. Это критически важный шаг — 
                от правильного маппинга зависит, какие данные куда попадут.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Автоматическое сопоставление</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система анализирует заголовки колонок в первой строке файла и пытается автоматически определить соответствие:
            </p>

            <div className="not-prose overflow-x-auto my-4">
                <table className="min-w-full divide-y divide-gray-200 text-sm border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Заголовок в файле</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Автоматически → Поле системы</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">vk id</td><td className="px-4 py-2 text-xs">→ VK ID</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">vk link</td><td className="px-4 py-2 text-xs">→ VK Link</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">название</td><td className="px-4 py-2 text-xs">→ Название</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">описание</td><td className="px-4 py-2 text-xs">→ Описание</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">цена</td><td className="px-4 py-2 text-xs">→ Цена</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">старая цена</td><td className="px-4 py-2 text-xs">→ Старая цена</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">артикул</td><td className="px-4 py-2 text-xs">→ Артикул</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">фото (url)</td><td className="px-4 py-2 text-xs">→ Фото URL</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">подборка</td><td className="px-4 py-2 text-xs">→ Подборка</td></tr>
                        <tr><td className="px-4 py-2 whitespace-nowrap font-mono text-xs">категория</td><td className="px-4 py-2 text-xs">→ Категория</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Регистр не важен:</h4>
                <p className="text-sm text-blue-800">
                    Система ищет заголовки без учёта регистра. "НАЗВАНИЕ", "Название" и "название" — одинаково распознаются как поле "Название".
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура окна маппинга</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Шапка таблицы (селекты)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Над каждой колонкой отображается:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Серый текст вверху:</strong> "Колонка: [название из файла]" — показывает оригинальный заголовок</li>
                <li><strong>Выпадающий список:</strong> для выбора поля системы</li>
                <li><strong>Цвет селекта:</strong> индиго (если выбрано поле) / серый (если "Пропустить")</li>
                <li><strong>Подсветка колонки:</strong> если выбрано поле, весь столбец окрашивается в светло-индиго</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Тело таблицы (предпросмотр данных)</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает первые 20 строк файла для проверки корректности маппинга. 
                При наведении на строку она подсвечивается серым фоном. Ячейки, принадлежащие активным колонкам, 
                имеют лёгкий индиго-фон.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Опция "Пропустить"</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Если в файле есть технические или лишние колонки (например, "Комментарий менеджера"), 
                выберите для них значение <strong>"Пропустить"</strong> — эти данные не будут импортированы.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ручная коррекция маппинга</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если автоматическое распознавание ошиблось или заголовки в вашем файле нестандартные:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Кликните на выпадающий список нужной колонки</li>
                <li>Выберите правильное поле из списка</li>
                <li>Селект изменит цвет на индиго, колонка подсветится</li>
                <li>Проверьте данные в предпросмотре — всё на своих местах?</li>
            </ol>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Частая ошибка:</h4>
                <p className="text-sm text-yellow-800 mb-2">
                    В файле колонка "Price" распозналась как "Пропустить", потому что система ждёт русское название "Цена". 
                    Вручную выберите "Цена" для этой колонки.
                </p>
                <p className="text-xs text-yellow-700 italic">
                    Совет: используйте русские заголовки в файлах для автоматического маппинга.
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Проверка перед импортом</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Перед нажатием кнопки "Импортировать товары (X)" обязательно проверьте:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>✓ Обязательные поля сопоставлены: <strong>Название, Описание, Цена, Фото URL</strong></li>
                <li>✓ Данные в предпросмотре выглядят корректно (нет смещения, пустот, иероглифов)</li>
                <li>✓ Колонки, которые не нужны, помечены как "Пропустить"</li>
                <li>✓ Счётчик в кнопке показывает правильное количество строк</li>
            </ul>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-purple-900 mb-2">🎯 Подсказка:</h4>
                <p className="text-sm text-purple-800">
                    После первого успешного импорта файла с определённой структурой, система запомнит маппинг. 
                    При следующей загрузке аналогичного файла сопоставление произойдёт автоматически.
                </p>
            </div>

            <Sandbox 
                title="Попробуйте: Маппинг колонок"
                description="Нажмите кнопку чтобы открыть интерактивный пример модального окна сопоставления колонок."
                instructions={[
                    'Нажмите кнопку "Открыть маппинг"',
                    'Обратите внимание на селекты в шапке таблицы',
                    'Попробуйте изменить сопоставление любой колонки',
                    'Колонка с выбранным полем подсвечивается индиго-фоном',
                    'Внизу показан счётчик строк для импорта'
                ]}
            >
                <button 
                    onClick={() => setShowMappingModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                    Открыть маппинг
                </button>
                {showMappingModal && <MockColumnMappingModal onClose={() => setShowMappingModal(false)} />}
            </Sandbox>

            <NavigationButtons currentPath="2-3-6-2-column-mapping" />
        </article>
    );
};
