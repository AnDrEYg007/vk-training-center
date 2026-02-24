import React, { useState } from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации AI-подбора категорий
// =====================================================================

// Mock CategorySelector (упрощённая версия реального селектора)
const MockCategorySelector: React.FC<{ value?: string; disabled?: boolean }> = ({ value, disabled }) => (
    <select 
        className={`flex-1 px-2 py-1 text-sm border rounded-md ${disabled ? 'bg-gray-100 text-gray-400' : 'bg-white'}`}
        disabled={disabled}
        value={value || ''}
    >
        <option value="">Выберите категорию...</option>
        <option value="1">Электроника / Смартфоны</option>
        <option value="2">Одежда / Футболки</option>
        <option value="3">Книги / Детективы</option>
    </select>
);

// Mock AI-кнопки в ячейке таблицы (из AiCategoryCell.tsx)
const MockAiCategoryCell: React.FC<{ 
    isLoading?: boolean; 
    error?: boolean;
    onAiClick?: () => void;
}> = ({ isLoading, error, onAiClick }) => {
    return (
        <div className="flex items-center gap-1">
            <MockCategorySelector disabled={isLoading} />
            <button 
                className={`p-1 border rounded-md flex-shrink-0 transition-all ${
                    error 
                        ? 'border-red-500 bg-red-50 text-red-500' 
                        : isLoading 
                            ? 'border-gray-300 bg-white text-gray-400' 
                            : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
                onClick={onAiClick}
                disabled={isLoading}
            >
                {isLoading ? (
                    // Loader из реального компонента
                    <div className="loader h-5 w-5 border-2 border-gray-400 border-t-indigo-500 rounded-full animate-spin"></div>
                ) : (
                    // Lightbulb SVG из реального кода (точная копия)
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

// Mock модального окна подтверждения AI-предложения (из AiCategorySuggestionModal.tsx)
const MockAiSuggestionModal: React.FC<{
    itemTitle: string;
    suggestedCategory: string;
    onClose: () => void;
    onApply: () => void;
}> = ({ itemTitle, suggestedCategory, onClose, onApply }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">AI-помощник: Категория товара</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    <div>
                        <p className="text-sm text-gray-600 mb-1">Товар:</p>
                        <p className="font-medium text-gray-900">{itemTitle}</p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-600 mb-2">Предложенная категория:</p>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                            <p className="text-indigo-900 font-medium">{suggestedCategory}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex gap-2 justify-end">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                        Отмена
                    </button>
                    <button 
                        onClick={onApply}
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                    >
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mock массового редактирования с AI (из BulkCategoryEditModal.tsx - 3 состояния)
type ModalView = 'manual' | 'loading' | 'confirm';

const MockBulkCategoryAi: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    const [view, setView] = useState<ModalView>('manual');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Симуляция AI-подбора
    const handleAiSuggest = () => {
        setView('loading');
        setTimeout(() => {
            setView('confirm');
        }, 2000);
    };

    // Моковые данные для таблицы подтверждения
    const mockSuggestions = [
        { id: 1, title: 'iPhone 13 Pro 128GB', category: 'Электроника / Смартфоны' },
        { id: 2, title: 'Samsung Galaxy S21', category: 'Электроника / Смартфоны' },
        { id: 3, title: 'Футболка Nike Dri-FIT', category: 'Одежда / Спортивная одежда' }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-fade-in-up">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Массовое изменение категории</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body - Manual View */}
                {view === 'manual' && (
                    <>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Выберите категорию
                                </label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                >
                                    <option value="">Выберите категорию...</option>
                                    <option value="1">Электроника / Смартфоны</option>
                                    <option value="2">Одежда / Футболки</option>
                                    <option value="3">Книги / Детективы</option>
                                </select>
                            </div>
                            <p className="text-sm text-gray-600">
                                Выбрано товаров: <span className="font-medium">3</span>
                            </p>
                        </div>

                        <div className="p-4 border-t flex gap-2 justify-between">
                            <button 
                                onClick={handleAiSuggest}
                                className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded-md flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI-помощник
                            </button>
                            <div className="flex gap-2">
                                <button 
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-md"
                                >
                                    Отмена
                                </button>
                                <button 
                                    className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md disabled:opacity-50"
                                    disabled={!selectedCategory}
                                >
                                    Применить
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Body - Loading View */}
                {view === 'loading' && (
                    <div className="p-12 flex flex-col items-center justify-center">
                        <div className="loader mb-4" style={{ width: '32px', height: '32px', borderTopColor: '#4f46e5' }}></div>
                        <p className="text-center text-gray-700 font-medium mb-1">
                            AI-помощник подбирает категории...
                        </p>
                        <p className="text-center text-sm text-gray-500">
                            Это может занять некоторое время
                        </p>
                    </div>
                )}

                {/* Body - Confirm View */}
                {view === 'confirm' && (
                    <>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-gray-700">
                                AI-помощник подобрал следующие категории для <span className="font-medium">3 товаров</span>:
                            </p>
                            <div className="border rounded-lg max-h-64 overflow-y-auto custom-scrollbar">
                                <table className="w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Товар</th>
                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Предложенная категория</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mockSuggestions.map((item) => (
                                            <tr key={item.id} className="border-t">
                                                <td className="px-4 py-2 text-sm text-gray-900">{item.title}</td>
                                                <td className="px-4 py-2 text-sm text-indigo-700 font-medium">{item.category}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="p-4 border-t flex gap-2 justify-end">
                            <button 
                                onClick={() => setView('manual')}
                                className="px-4 py-2 text-sm font-medium bg-gray-200 hover:bg-gray-300 rounded-md"
                            >
                                Назад
                            </button>
                            <button 
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-md"
                            >
                                Применить предложения
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsAICategoriesPage: React.FC<ContentProps> = ({ title }) => {
    const [showSingleModal, setShowSingleModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [isCellLoading, setIsCellLoading] = useState(false);

    const handleCellAiClick = () => {
        setIsCellLoading(true);
        setTimeout(() => {
            setIsCellLoading(false);
            setShowSingleModal(true);
        }, 1500);
    };

    const handleApplySingle = () => {
        setShowSingleModal(false);
        // В реальном приложении здесь происходит обновление категории
    };

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>AI-помощник для подбора категорий</strong> — это инструмент, который автоматически предлагает подходящие категории для товаров на основе их названий и описаний. Он использует искусственный интеллект для анализа текста и выбора наиболее релевантной категории из доступных в VK.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Зачем это нужно?</strong> Представьте, что вы импортировали 180 товаров из CSV-файла, и у всех неправильные категории. Раньше пришлось бы вручную открывать каждый товар и менять категорию — это заняло бы ~90 минут. С AI-помощником эта задача решается за 2 минуты: выделить товары, нажать кнопку, проверить предложения, применить.
            </p>

            <hr className="!my-10" />

            {/* Раздел 1: Одиночный товар */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1. Подбор категории для одного товара (из таблицы)
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый простой сценарий — вы просматриваете таблицу товаров и видите, что у конкретного товара неправильная категория. Вместо того чтобы вручную искать подходящую категорию в длинном списке, можно попросить AI подобрать её автоматически.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает:</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>В таблице товаров находите нужный товар</li>
                <li>В столбце "Категория" есть выпадающий список и кнопка с иконкой лампочки (💡)</li>
                <li>Нажимаете на кнопку — AI анализирует название и описание товара</li>
                <li>Появляется окно с предложенной категорией</li>
                <li>Если категория подходит — нажимаете "Применить", если нет — "Отмена" и выбираете вручную</li>
            </ol>

            <Sandbox
                title="Интерактивный пример: AI-кнопка в таблице"
                description="Попробуйте нажать на кнопку с лампочкой рядом с селектором категории."
                instructions={[
                    'Нажмите на кнопку с <strong>иконкой лампочки</strong> — начнётся анализ',
                    'Дождитесь загрузки (кнопка покажет индикатор)',
                    'Откроется окно с предложенной категорией',
                    'Нажмите "Применить" или "Отмена"'
                ]}
            >
                <div className="bg-white p-4 rounded-lg border">
                    <div className="text-sm text-gray-600 mb-2">Пример строки из таблицы товаров:</div>
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-48">
                            <p className="text-sm font-medium text-gray-900">iPhone 13 Pro 128GB</p>
                            <p className="text-xs text-gray-500">ID: 12345</p>
                        </div>
                        <MockAiCategoryCell 
                            isLoading={isCellLoading}
                            onAiClick={handleCellAiClick}
                        />
                    </div>
                </div>

                {showSingleModal && (
                    <MockAiSuggestionModal
                        itemTitle="iPhone 13 Pro 128GB"
                        suggestedCategory="Электроника / Смартфоны"
                        onClose={() => setShowSingleModal(false)}
                        onApply={handleApplySingle}
                    />
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 2: Массовый подбор */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2. Массовый подбор категорий (для нескольких товаров)
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если нужно изменить категорию у многих товаров одновременно (например, после импорта из CSV), можно использовать массовое редактирование с AI-помощником. Это экономит огромное количество времени.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает:</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Выделяете нужные товары в таблице (галочки слева)</li>
                <li>Нажимаете кнопку "Изменить категорию" в панели действий над таблицей</li>
                <li>Открывается всплывающее окно с выбором категории</li>
                <li>Вместо ручного выбора нажимаете кнопку <strong>"AI-помощник"</strong> (с иконкой лампочки)</li>
                <li>AI анализирует все выделенные товары и подбирает категории индивидуально для каждого</li>
                <li>Появляется таблица с предложениями: товар → предложенная категория</li>
                <li>Просматриваете предложения, и если всё верно — применяете</li>
            </ol>

            <Sandbox
                title="Интерактивный пример: Массовое изменение с AI"
                description="Попробуйте использовать AI-помощника для массового подбора категорий."
                instructions={[
                    'Нажмите кнопку "Открыть массовое редактирование"',
                    'В открывшемся окне нажмите кнопку <strong>"AI-помощник"</strong> (слева внизу)',
                    'Дождитесь анализа (появится индикатор загрузки)',
                    'Просмотрите таблицу с предложениями для 3 товаров',
                    'Нажмите "Применить предложения" или "Назад" для возврата к ручному выбору'
                ]}
            >
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowBulkModal(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Открыть массовое редактирование
                    </button>
                </div>

                {showBulkModal && (
                    <MockBulkCategoryAi onClose={() => setShowBulkModal(false)} />
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 3: Как работает AI */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3. Как AI подбирает категории?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                AI-помощник использует <strong>двухэтапный процесс анализа</strong>, чтобы максимально точно определить категорию товара:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Этап 1: Выбор родительских разделов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                AI сначала анализирует название и описание товара, а затем выбирает 2-3 подходящих <strong>родительских раздела</strong> из всех доступных категорий VK (например, "Электроника", "Одежда", "Книги").
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Этап 2: Выбор финальной подкатегории</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                После того как определены родительские разделы, AI смотрит только на подкатегории внутри этих разделов (например, в разделе "Электроника" это может быть "Смартфоны", "Ноутбуки", "Наушники") и выбирает самую подходящую.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Зачем два этапа?</strong><br/>
                    В VK сотни категорий товаров. Если анализировать их все сразу, AI может ошибиться или выбрать что-то неожиданное. Двухэтапный процесс сначала сужает область поиска (выбирает раздел), а потом точно определяет категорию внутри него.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Раздел 4: Когда использовать */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                4. Когда использовать AI-помощника?
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">✅ Идеальные сценарии:</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>После импорта товаров из CSV</strong> — если у всех товаров одна и та же неправильная категория, AI быстро подберёт правильные</li>
                <li><strong>Реорганизация каталога</strong> — если меняете структуру категорий и нужно пересортировать существующие товары</li>
                <li><strong>Исправление ошибок прошлого</strong> — если обнаружили, что товары были неправильно категоризированы</li>
                <li><strong>Стандартные товары</strong> — iPhone, Nike, книги — AI отлично распознаёт популярные бренды и типы товаров</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">⚠️ Когда быть осторожным:</h3>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Нестандартные товары</strong> — hand-made, винтаж, коллекционные вещи — AI может выбрать не ту категорию</li>
                <li><strong>Товары с коротким названием</strong> — если название не информативное (например, просто "Новинка"), AI не сможет понять суть товара</li>
                <li><strong>Товары на пересечении категорий</strong> — например, "умные часы" можно отнести и к "Электронике", и к "Аксессуарам"</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> AI-помощник — это инструмент для экономии времени, но не замена человеческой проверке. <strong>Всегда просматривайте предложения перед применением</strong>, особенно для массового изменения. AI может ошибаться, и лучше потратить 30 секунд на проверку, чем потом исправлять неправильные категории у сотен товаров.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Раздел 5: Практические примеры */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                5. Реальные примеры из работы агентства
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Пример 1: Импорт товаров интернет-магазина</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Клиент дал CSV-файл с 180 товарами (одежда, обувь, аксессуары). После импорта все товары попали в категорию "Прочее".<br/>
                <strong>Было:</strong> Открыть каждый товар, прочитать название, найти в списке подходящую категорию, сохранить. Время: ~90 минут.<br/>
                <strong>Стало:</strong> Выделить все товары → "Изменить категорию" → "AI-помощник" → проверить предложения → применить. Время: 2 минуты.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Пример 2: Исправление ошибок предыдущего специалиста</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Обнаружили, что 45 товаров электроники лежат в категории "Книги".<br/>
                <strong>Было:</strong> Вручную переносить каждый товар, вспоминая правильные подкатегории.<br/>
                <strong>Стало:</strong> Выделить проблемные товары → AI подобрал правильные категории для каждого → применить.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Пример 3: Быстрая проверка одного товара</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Клиент прислал новый товар "Беспроводная мышь Logitech MX Master 3", непонятно куда отнести — к компьютерным аксессуарам или периферии.<br/>
                <strong>Было:</strong> Лезть в справку VK, искать правильную категорию.<br/>
                <strong>Стало:</strong> Нажать кнопку с лампочкой → AI предложил "Электроника / Компьютерные аксессуары" → применить.
            </p>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-8-ai-category" />
        </article>
    );
};
