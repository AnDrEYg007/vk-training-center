import React, { useState } from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации редактора описаний
// =====================================================================

// Кнопка переменной (из VariablesSelector)
const MockVariableButton: React.FC<{ name: string; isEmpty?: boolean; onClick?: () => void }> = ({ name, isEmpty, onClick }) => {
    const buttonClasses = `px-3 py-1.5 text-xs font-medium border rounded-full transition-colors ${
        isEmpty 
            ? 'border-dashed border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200' 
            : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-indigo-500'
    }`;
    
    return (
        <button onClick={onClick} className={buttonClasses}>
            {name}
        </button>
    );
};

// Панель переменных (упрощённая версия VariablesSelector)
const MockVariablesPanel: React.FC<{ onInsert: (text: string) => void }> = ({ onInsert }) => {
    return (
        <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-md p-3">
            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Глобальные переменные
                </h4>
                <div className="flex flex-wrap gap-2">
                    <MockVariableButton name="Телефон" onClick={() => onInsert('{global_phone}')} />
                    <MockVariableButton name="Email" onClick={() => onInsert('{global_email}')} />
                    <MockVariableButton name="Адрес" onClick={() => onInsert('{global_address}')} />
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Базовые переменные
                </h4>
                <div className="flex flex-wrap gap-2">
                    <MockVariableButton name="Ссылка на сообщество" onClick={() => onInsert('https://vk.com/public123')} />
                    <MockVariableButton name="Ссылка на сообщения" onClick={() => onInsert('https://vk.me/public123')} />
                    <MockVariableButton name="Название сообщества" onClick={() => onInsert('Мой магазин')} />
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Конструкции
                </h4>
                <div className="flex flex-wrap gap-2">
                    <MockVariableButton name="[ | ]" onClick={() => onInsert('[ССЫЛКА|ОПИСАНИЕ]')} />
                    <MockVariableButton name="@ ()" onClick={() => onInsert('@idЦИФРЫ (ТЕКСТ)')} />
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Переменные проекта
                </h4>
                <div className="flex flex-wrap gap-2">
                    <MockVariableButton name="Условия доставки" onClick={() => onInsert('Доставка по России 3-5 дней')} />
                    <MockVariableButton name="Способы оплаты" isEmpty />
                    <button className="px-3 py-1.5 text-xs font-medium border-2 border-dashed rounded-full border-blue-400 text-blue-600 bg-white hover:bg-blue-50">
                        + Добавить
                    </button>
                </div>
            </div>
        </div>
    );
};

// Mock редактора описаний (упрощённая версия DescriptionEditorModal)
const MockDescriptionEditor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'editor' | 'ai' | 'variables'>('editor');
    const [text, setText] = useState('Качественная футболка из хлопка.\n\nДоступные размеры: S, M, L, XL');

    const handleInsert = (value: string) => {
        setText(prev => prev + '\n\n' + value);
        setActiveTab('editor');
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-fade-in-up" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <header className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <h3 className="text-lg font-semibold text-gray-800">Редактор описания</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setActiveTab('editor')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                activeTab === 'editor' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Редактор
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                activeTab === 'ai' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            AI-помощник
                        </button>
                        <button 
                            onClick={() => setActiveTab('variables')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                                activeTab === 'variables' ? 'bg-white shadow text-indigo-700' : 'text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            Переменные
                        </button>
                    </div>
                </header>

                {/* Main content */}
                <main className="p-0 flex-grow overflow-y-auto custom-scrollbar flex flex-col">
                    {activeTab === 'ai' && (
                        <div className="p-4 border-b bg-indigo-50">
                            <div className="text-sm text-indigo-900 space-y-2">
                                <p className="font-medium">AI-помощник для генерации текста</p>
                                <p className="text-xs text-indigo-700">
                                    Здесь можно попросить AI сгенерировать описание товара на основе названия и ключевых характеристик.
                                </p>
                                <button className="mt-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                    Сгенерировать описание
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'variables' && (
                        <div className="p-4 border-b">
                            <MockVariablesPanel onInsert={handleInsert} />
                        </div>
                    )}

                    <div className="p-4 flex-grow flex flex-col">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Текст описания</label>
                        <textarea 
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="w-full flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 custom-scrollbar resize-none min-h-[200px]"
                            placeholder="Введите описание товара..."
                        />
                    </div>
                </main>

                {/* Footer */}
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300">
                        Отмена
                    </button>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                        Применить
                    </button>
                </footer>
            </div>
        </div>
    );
};

// Встроенный редактор в форме создания товара
const MockInlineDescriptionEditor: React.FC = () => {
    const [showVariables, setShowVariables] = useState(false);
    const [description, setDescription] = useState('');

    const handleInsert = (value: string) => {
        setDescription(prev => prev + '\n\n' + value);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                    Описание <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                    <button className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                        AI-помощник
                    </button>
                    <button 
                        onClick={() => setShowVariables(!showVariables)}
                        className="px-3 py-1 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 text-gray-700"
                    >
                        Переменные
                    </button>
                    <button 
                        title="Обновить переменные"
                        className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
                showVariables ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}>
                <div className={`${showVariables ? 'bg-gray-100 border rounded-md p-3' : ''}`}>
                    {showVariables && <MockVariablesPanel onInsert={handleInsert} />}
                </div>
            </div>

            <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={6}
                className="w-full mt-1 p-2 border rounded-md custom-scrollbar focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Введите описание товара (минимум 10 символов)..."
            />
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsDescriptionEditorPage: React.FC<ContentProps> = ({ title }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Редактор описаний</strong> — это инструмент для удобного редактирования текста описания товара с возможностью вставки переменных проекта, использования AI-помощника и применения конструкций VK для ссылок и упоминаний.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Зачем это нужно?</strong> Вместо того чтобы вручную копировать одинаковые блоки текста (контакты, условия доставки, способы оплаты) в каждое описание, вы настраиваете переменные один раз и вставляете их автоматически. Это экономит время и обеспечивает единообразие информации во всех товарах.
            </p>

            <hr className="!my-10" />

            {/* Раздел 1: Где находится редактор */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1. Где находится редактор описаний?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Редактор описаний доступен в двух местах:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Вариант 1: Всплывающее окно (полный редактор)
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>При создании нескольких товаров сразу (импорт из буфера или CSV)</li>
                <li>При редактировании описания в таблице товаров (кнопка "Редактор" в ячейке описания)</li>
                <li>Открывается в отдельном модальном окне с тремя вкладками</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Вариант 2: Встроенный редактор (в форме создания)
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>При создании одного товара через форму "Создать товар"</li>
                <li>Раскрывающиеся панели AI-помощника и переменных прямо в форме</li>
                <li>Не требует открытия дополнительного окна</li>
            </ul>

            <hr className="!my-10" />

            {/* Раздел 2: Три вкладки редактора */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2. Три вкладки полного редактора
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Полный редактор (всплывающее окно) имеет три режима работы, между которыми можно переключаться через кнопки в шапке:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Вкладка "Редактор" (основная)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Текстовое поле для ввода и редактирования описания товара. Здесь вы набираете текст, форматируете его и вставляете переменные или конструкции, скопированные с других вкладок.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Вкладка "AI-помощник"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Инструмент для автоматической генерации текста описания. Вы указываете ключевые характеристики товара (название, материал, размеры), и AI создаёт готовое описание, которое можно вставить в редактор или доработать вручную.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Вкладка "Переменные"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Панель с кнопками для быстрой вставки сохранённых значений (телефон, email, условия доставки) и конструкций VK (ссылки, упоминания). При нажатии на кнопку текст вставляется в позицию курсора в редакторе.
            </p>

            <Sandbox
                title="Интерактивный пример: Полный редактор описаний"
                description="Попробуйте переключаться между вкладками и вставить переменную в текст."
                instructions={[
                    'Нажмите кнопку <strong>"Открыть редактор"</strong>',
                    'Переключитесь на вкладку <strong>"Переменные"</strong>',
                    'Нажмите на любую переменную — она вставится в текст',
                    'Вернитесь на вкладку <strong>"Редактор"</strong> и увидите обновлённый текст',
                    'Нажмите <strong>"Применить"</strong> для сохранения'
                ]}
            >
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Открыть редактор
                    </button>
                </div>

                {showModal && (
                    <MockDescriptionEditor onClose={() => setShowModal(false)} />
                )}
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 3: Типы переменных */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3. Типы переменных в редакторе
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Редактор поддерживает четыре типа переменных, которые помогают автоматизировать создание описаний:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Глобальные переменные
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Значения, общие для всех проектов агентства (например, телефон агентства, корпоративный email). Настраиваются администратором один раз и доступны везде.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Формат:</strong> <code>{'{global_phone}'}</code>, <code>{'{global_email}'}</code></li>
                <li><strong>Пример использования:</strong> "По вопросам обращайтесь: <code>{'{global_phone}'}</code>"</li>
                <li><strong>Результат:</strong> "По вопросам обращайтесь: +7 (999) 123-45-67"</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Базовые переменные проекта
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Автоматические значения из настроек текущего проекта (ссылка на сообщество, название группы). Обновляются автоматически при изменении проекта.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Ссылка на сообщество:</strong> https://vk.com/public123456</li>
                <li><strong>Ссылка на сообщения:</strong> https://vk.me/public123456</li>
                <li><strong>Название сообщества:</strong> Мой магазин одежды</li>
                <li><strong>Упоминание:</strong> @public123456 (Мой магазин одежды)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Переменные проекта (локальные)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Значения, уникальные для каждого проекта. Вы создаёте их сами в настройках проекта (например, "Условия доставки", "Способы оплаты", "График работы").
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Создание:</strong> Настройки проекта → Переменные → "+ Добавить"</li>
                <li><strong>Пример:</strong> Имя "Условия доставки", Значение "Доставка по России 3-5 дней, бесплатно от 3000₽"</li>
                <li><strong>Использование:</strong> Нажать кнопку "Условия доставки" в редакторе — текст вставится автоматически</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Конструкции VK
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Специальный синтаксис ВКонтакте для создания кликабельных ссылок и упоминаний в тексте:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>[ссылка|текст]</strong> — кликабельная ссылка с произвольным текстом</li>
                <li><strong>@idЦИФРЫ (текст)</strong> — упоминание пользователя или сообщества</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пример:</strong> <code>[https://vk.com/market-123_456|Посмотреть все товары]</code> → отобразится как кликабельная ссылка "Посмотреть все товары"
            </p>

            <hr className="!my-10" />

            {/* Раздел 4: Встроенный редактор */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                4. Встроенный редактор в форме создания товара
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы создаёте один товар через форму "Создать товар", редактор описания встроен прямо в форму. Он имеет те же возможности (AI-помощник, переменные), но без отдельного модального окна.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает:</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Над полем описания есть кнопки "AI-помощник" и "Переменные"</li>
                <li>При нажатии на кнопку панель раскрывается плавной анимацией</li>
                <li>Выбираете нужную переменную или генерируете текст через AI</li>
                <li>Текст вставляется в позицию курсора или в конец описания</li>
                <li>Кнопка "Обновить" (значок стрелки) перезагружает список переменных, если вы добавили новые</li>
            </ol>

            <Sandbox
                title="Интерактивный пример: Встроенный редактор"
                description="Попробуйте раскрыть панель переменных и вставить значение."
                instructions={[
                    'Нажмите кнопку <strong>"Переменные"</strong> справа над полем',
                    'Панель раскроется с плавной анимацией',
                    'Нажмите на любую переменную — текст вставится в поле описания',
                    'Нажмите кнопку ещё раз — панель свернётся'
                ]}
            >
                <div className="bg-white border rounded-lg p-6">
                    <MockInlineDescriptionEditor />
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Раздел 5: Практические примеры */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                5. Реальные примеры использования
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Пример 1: Стандартизация контактов
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> У 200 товаров в конце описания нужно указать одинаковые контакты для связи.<br/>
                <strong>Было:</strong> Копировать контакты в каждое описание вручную, при изменении телефона — редактировать все 200 товаров.<br/>
                <strong>Стало:</strong> Создали переменную "Контакты" с текстом "📞 +7 (999) 123-45-67 | 📧 shop@example.com". При вставке переменной текст подставляется автоматически. Изменили номер — обновили переменную, и при следующей генерации описаний новый номер подставится сам.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Пример 2: Условия доставки для всех товаров
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Каждый товар должен содержать актуальные условия доставки.<br/>
                <strong>Было:</strong> Писать "Доставка по России 3-5 дней" в каждом описании. Когда сроки изменились — править вручную.<br/>
                <strong>Стало:</strong> Создали переменную "Доставка" → вставляем её в конец каждого описания. Условия изменились — обновили переменную один раз, новые товары автоматически получат актуальную информацию.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Пример 3: Ссылка на каталог во всех товарах
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> В конце описания добавить кликабельную ссылку "Посмотреть весь каталог".<br/>
                <strong>Было:</strong> Вручную вставлять конструкцию <code>[https://vk.com/market-123|Посмотреть весь каталог]</code> в каждый товар.<br/>
                <strong>Стало:</strong> Используем базовую переменную "Ссылка на сообщество" + конструкцию <code>[ | ]</code> → вставляем готовую ссылку за один клик.
            </p>

            <hr className="!my-10" />

            {/* Раздел 6: Советы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                6. Советы по использованию редактора
            </h2>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Создавайте переменные заранее:</strong> Перед массовым добавлением товаров настройте все нужные переменные (контакты, доставка, оплата) — это ускорит работу</li>
                <li><strong>Используйте AI для уникальных описаний:</strong> Для похожих товаров (например, футболки разных цветов) генерируйте базовое описание через AI, а потом дополняйте уникальными деталями</li>
                <li><strong>Проверяйте результат на VK:</strong> Конструкции <code>[ | ]</code> и <code>@id</code> отображаются корректно только в опубликованном посте/товаре, в редакторе они выглядят как обычный текст</li>
                <li><strong>Обновляйте переменные централизованно:</strong> Если изменились контакты или условия — обновите переменную в настройках проекта, а не правьте каждый товар вручную</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Переменные подставляют сохранённые значения "как есть". Если переменная пустая (не заполнена), при вставке ничего не произойдёт. Убедитесь, что все нужные переменные заполнены в настройках проекта перед использованием.
                </p>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-9-description-editor" />
        </article>
    );
};
