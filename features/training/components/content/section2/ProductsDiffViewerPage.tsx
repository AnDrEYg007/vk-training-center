import React, { useState } from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации DiffViewer
// =====================================================================

// Реальный DiffViewer (упрощенная версия с тем же визуальным стилем)
const MockDiffViewer: React.FC<{ oldText: string; newText: string }> = ({ oldText, newText }) => {
    // Простое сравнение по словам для демонстрации
    const oldWords = oldText.split(/(\s+)/);
    const newWords = newText.split(/(\s+)/);
    
    const renderDiff = () => {
        const result = [];
        let maxLen = Math.max(oldWords.length, newWords.length);
        
        for (let i = 0; i < maxLen; i++) {
            const oldWord = oldWords[i] || '';
            const newWord = newWords[i] || '';
            
            if (oldWord === newWord) {
                result.push(<span key={`same-${i}`}>{oldWord}</span>);
            } else {
                if (oldWord && !newWords.includes(oldWord)) {
                    result.push(
                        <span key={`removed-${i}`} className="bg-red-100 text-red-800 rounded line-through px-0.5">
                            {oldWord}
                        </span>
                    );
                }
                if (newWord && !oldWords.includes(newWord)) {
                    result.push(
                        <span key={`added-${i}`} className="bg-green-100 text-green-800 rounded px-0.5">
                            {newWord}
                        </span>
                    );
                }
            }
        }
        
        return result;
    };
    
    return (
        <div className="w-full p-2 border border-gray-300 rounded-md bg-white text-sm whitespace-pre-wrap leading-normal custom-scrollbar">
            {renderDiff()}
        </div>
    );
};

// Mock ячейки описания с AI-коррекцией
const MockDescriptionCellWithAI: React.FC = () => {
    const [value, setValue] = useState('Красивая футболка из хлопка. Доставка по всей россии.');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedText, setSuggestedText] = useState<string | null>(null);
    
    const handleAiClick = () => {
        if (suggestedText) {
            setSuggestedText(null);
            return;
        }
        
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSuggestedText('Красивая футболка из хлопка. Доставка по всей России!');
        }, 1500);
    };
    
    const handleApply = () => {
        if (suggestedText) {
            setValue(suggestedText);
            setSuggestedText(null);
        }
    };
    
    const handleCancel = () => {
        setSuggestedText(null);
    };
    
    return (
        <div className="w-full">
            {/* Верхняя часть: Textarea + кнопка AI */}
            <div className="flex items-start gap-1">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar resize-none text-sm"
                    rows={3}
                />
                <button
                    onClick={handleAiClick}
                    disabled={isLoading}
                    title="Исправить ошибки с помощью AI"
                    className="p-1 border border-gray-300 rounded-md transition-colors text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50 flex-shrink-0 h-8 w-8 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    )}
                </button>
            </div>
            
            {/* Нижняя часть: DiffViewer + кнопки управления */}
            {suggestedText && (
                <div className="flex items-start gap-1 w-full mt-1 animate-fade-in-up">
                    <div className="flex-grow min-w-0 border border-gray-300 rounded-md bg-white overflow-hidden">
                        <MockDiffViewer oldText={value} newText={suggestedText} />
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                        {/* Применить */}
                        <button
                            onClick={handleApply}
                            title="Применить"
                            className="w-8 h-8 flex items-center justify-center bg-white text-green-600 rounded-md border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                        {/* Перегенерировать */}
                        <button
                            onClick={handleAiClick}
                            title="Перегенерировать"
                            className="w-8 h-8 flex items-center justify-center bg-white text-blue-600 rounded-md border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                            </svg>
                        </button>
                        {/* Отмена */}
                        <button
                            onClick={handleCancel}
                            title="Отмена"
                            className="w-8 h-8 flex items-center justify-center bg-white text-red-600 rounded-md border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm"
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock таблицы массового редактирования с DiffViewer
const MockBulkEditTable: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set([1, 2]));
    
    const corrections = [
        { id: 1, old: 'Товар новый качественный', new: 'Товар новый, качественный.' },
        { id: 2, old: 'Красивое платье отличное', new: 'Красивое платье, отличное качество.' },
        { id: 3, old: 'Хорошая цена быстрая доставка', new: 'Хорошая цена, быстрая доставка.' }
    ];
    
    const toggleAll = () => {
        if (selectedIds.size === corrections.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(corrections.map(c => c.id)));
        }
    };
    
    const toggleSingle = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };
    
    const allSelected = selectedIds.size > 0 && selectedIds.size === corrections.length;
    
    return (
        <div className="border rounded-lg overflow-hidden bg-white">
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-[auto_1fr_1fr] gap-x-4">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b flex items-center">
                        <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={toggleAll}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                        />
                    </div>
                    <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b font-medium text-gray-600">Было</div>
                    <div className="sticky top-0 z-10 bg-gray-50 p-4 border-b font-medium text-gray-600">Стало (AI)</div>
                    
                    {/* Body */}
                    {corrections.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <div className={`p-4 flex items-center ${index > 0 ? 'border-t' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.has(item.id)}
                                    onChange={() => toggleSingle(item.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                />
                            </div>
                            <div className={`p-4 align-top ${index > 0 ? 'border-t' : ''}`}>
                                <textarea
                                    value={item.old}
                                    readOnly
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-sm leading-normal resize-none"
                                    rows={2}
                                />
                            </div>
                            <div className={`p-4 align-top ${index > 0 ? 'border-t' : ''}`}>
                                <MockDiffViewer oldText={item.old} newText={item.new} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsDiffViewerPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>DiffViewer (визуализатор изменений)</strong> — это компонент, который наглядно показывает разницу между старым и новым текстом. Он использует цветовую маркировку, чтобы вы сразу видели, что именно изменилось: что было удалено и что добавлено.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Зачем это нужно?</strong> Когда AI исправляет ошибки в описании товара или при массовом редактировании названий, важно понимать, какие именно правки будут применены. DiffViewer показывает это в удобном формате, защищая от случайных ошибок — вы всегда видите изменения до того, как сохраните их.
            </p>

            <hr className="!my-10" />

            {/* Раздел 1: Как читать изменения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1. Как читать изменения
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                DiffViewer использует цветовую систему для обозначения типа изменений:
            </p>

            <div className="not-prose my-6 space-y-3">
                <div className="flex items-center gap-3">
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded line-through text-sm font-medium">
                        Красный зачёркнутый
                    </span>
                    <span className="text-gray-700">— удалённый текст</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-medium">
                        Зелёный
                    </span>
                    <span className="text-gray-700">— добавленный текст</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-gray-700 px-3 py-1 text-sm">
                        Обычный текст
                    </span>
                    <span className="text-gray-700">— неизменённый текст</span>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример:</strong> Если в описании была ошибка "Доставка по всей россии", AI исправит её на "Доставка по всей России". В DiffViewer вы увидите слово <span className="bg-red-100 text-red-800 px-1 rounded line-through">"россии"</span> зачёркнутым красным и новое слово <span className="bg-green-100 text-green-800 px-1 rounded">"России"</span> зелёным.
            </p>

            <hr className="!my-10" />

            {/* Раздел 2: Где используется */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2. Где используется DiffViewer
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Визуализатор изменений встроен в три места приложения:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Место 1: Таблица товаров (AI-коррекция описаний)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы редактируете описание товара в таблице и нажимаете кнопку AI (иконка лампочки), система предлагает исправленный вариант. DiffViewer появляется под полем ввода и показывает все изменения. Справа от него — три кнопки:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Зелёная галочка</strong> — применить исправления</li>
                <li><strong>Синяя стрелка обновления</strong> — попросить AI перегенерировать текст</li>
                <li><strong>Красный крестик</strong> — отменить и вернуться к оригиналу</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Место 2: Массовое редактирование названий
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При массовой AI-коррекции названий товаров открывается всплывающее окно с таблицей. В колонке "Было" — оригинальный текст, в колонке "Стало (AI)" — DiffViewer с результатом работы AI. Вы можете выбрать чекбоксами, к каким товарам применить правки.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Место 3: Массовое редактирование описаний
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Аналогично названиям — таблица с тремя колонками (чекбокс, "Было", "Стало"). DiffViewer в правой колонке показывает предлагаемые изменения для каждого товара.
            </p>

            <hr className="!my-10" />

            {/* Раздел 3: Интерактивный пример в таблице */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3. Как работает в таблице товаров
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Попробуйте в действии: нажмите кнопку AI (лампочка), дождитесь результата и посмотрите на DiffViewer с изменениями. Затем используйте кнопки управления.
            </p>

            <Sandbox
                title="Интерактивный пример: AI-коррекция описания"
                description="Нажмите кнопку с лампочкой, чтобы запустить AI-коррекцию. Появится DiffViewer с предлагаемыми изменениями."
                instructions={[
                    'Нажмите кнопку <strong>AI (лампочка)</strong> справа от поля',
                    'Подождите 1-2 секунды — AI обработает текст',
                    'Под полем появится DiffViewer с цветовой маркировкой изменений',
                    'Попробуйте кнопки: <strong>Применить (галочка)</strong>, <strong>Перегенерировать (стрелка)</strong>, <strong>Отмена (крестик)</strong>'
                ]}
            >
                <MockDescriptionCellWithAI />
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 4: Массовое редактирование */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                4. Как работает в массовом редактировании
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При массовой AI-коррекции нескольких товаров одновременно DiffViewer показывает изменения для каждого товара отдельно. Вы видите полную картину до применения правок и можете отказаться от коррекции отдельных товаров, сняв галочку.
            </p>

            <Sandbox
                title="Интерактивный пример: Массовая AI-коррекция"
                description="Таблица с результатами массовой коррекции. DiffViewer в правой колонке показывает изменения для каждого товара."
                instructions={[
                    'Чекбокс в шапке — выбрать/снять всё',
                    'Левая колонка — оригинальный текст (серый фон, только чтение)',
                    'Правая колонка — DiffViewer с цветовой маркировкой изменений',
                    'Уберите галочку с товара, чтобы исключить его из применения правок'
                ]}
            >
                <MockBulkEditTable />
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 5: Технические детали */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                5. Как это работает под капотом
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                DiffViewer использует алгоритм <strong>LCS (Longest Common Subsequence)</strong> — поиск наибольшей общей подпоследовательности. Это математический метод для сравнения двух текстов и выявления минимального набора изменений.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это помогает:</h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Точность:</strong> Алгоритм находит именно те части текста, которые изменились, без ложных срабатываний</li>
                <li><strong>Читаемость:</strong> Последовательные одинаковые изменения объединяются для лучшей визуализации</li>
                <li><strong>Производительность:</strong> Компонент использует мемоизацию (запоминание результатов), чтобы не пересчитывать изменения при каждом обновлении экрана</li>
            </ul>

            <hr className="!my-10" />

            {/* Раздел 6: Практические советы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                6. Практические советы по использованию
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Совет 1: Всегда проверяйте изменения перед применением
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                AI может исправить не только очевидные ошибки (заглавные буквы, пунктуация), но и заменить слова на синонимы. Иногда это нежелательно — например, если у вас специфичная терминология бренда. Всегда читайте зелёные добавления, прежде чем нажать "Применить".
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Совет 2: Используйте перегенерацию
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если AI предложил слишком радикальные правки, нажмите синюю стрелку обновления — система сгенерирует другой вариант исправлений. Можно перегенерировать несколько раз, пока не получите подходящий результат.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Совет 3: Массовая коррекция — постепенно
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При массовом редактировании не применяйте правки ко всем товарам сразу. Просмотрите таблицу, снимите галочки с тех товаров, где изменения сомнительны, и примените остальные. Потом вернитесь к отложенным и обработайте их вручную.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Совет 4: DiffViewer как защита от ошибок
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Основная задача визуализатора — показать вам последствия действия ДО его выполнения. Это особенно важно при импорте товаров из CSV-файла: перед применением вы видите, какие описания будут перезаписаны. Всегда используйте эту возможность для проверки.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Подсказка:</strong> Если изменений много и они не помещаются на экран, DiffViewer автоматически добавит вертикальный скролл. Прокрутите весь текст, чтобы ничего не пропустить.
                </p>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-10-diff-viewer" />
        </article>
    );
};
