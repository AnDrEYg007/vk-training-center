import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации работы с категориями
// =====================================================================

interface MockCategory {
    id: number;
    name: string;
    section_id: number;
    section_name: string;
}

interface GroupedCategory {
    section_name: string;
    categories: MockCategory[];
}

// Mock данных
const mockGroupedCategories: GroupedCategory[] = [
    {
        section_name: 'Одежда',
        categories: [
            { id: 1, name: 'Одежда / Футболки / Мужские', section_id: 1, section_name: 'Одежда' },
            { id: 2, name: 'Одежда / Футболки / Женские', section_id: 1, section_name: 'Одежда' },
            { id: 3, name: 'Одежда / Джинсы', section_id: 1, section_name: 'Одежда' },
        ],
    },
    {
        section_name: 'Обувь',
        categories: [
            { id: 4, name: 'Обувь / Кроссовки / Мужские', section_id: 2, section_name: 'Обувь' },
            { id: 5, name: 'Обувь / Ботинки', section_id: 2, section_name: 'Обувь' },
        ],
    },
    {
        section_name: 'Аксессуары',
        categories: [
            { id: 6, name: 'Аксессуары / Рюкзаки', section_id: 3, section_name: 'Аксессуары' },
            { id: 7, name: 'Аксессуары / Шапки', section_id: 3, section_name: 'Аксессуары' },
        ],
    },
];

// Функция разделения названия категории
const splitCategoryName = (fullName: string) => {
    const parts = fullName.split(' / ');
    const leaf = parts[parts.length - 1];
    const path = parts.slice(0, parts.length - 1).join(' / ');
    return { leaf, path };
};

// Mock CategorySelector
const CategorySelectorMock: React.FC<{
    value: MockCategory | null;
    isOpen: boolean;
    onToggle: () => void;
    onSelect: (cat: MockCategory) => void;
}> = ({ value, isOpen, onToggle, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const selectedDisplay = value ? splitCategoryName(value.name) : null;

    const filteredGroups = mockGroupedCategories
        .map(group => ({
            ...group,
            categories: group.categories.filter(cat =>
                cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cat.section_name.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter(group => group.categories.length > 0);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white flex justify-between items-center h-10"
            >
                {selectedDisplay ? (
                    <div className="flex flex-col items-start overflow-hidden min-w-0 leading-tight w-full">
                        <span className="truncate font-medium text-gray-800 w-full text-left">
                            {selectedDisplay.leaf}
                        </span>
                        {selectedDisplay.path && (
                            <span className="truncate text-[10px] text-gray-400 w-full text-left">
                                {selectedDisplay.path}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="text-gray-400 truncate">Выберите категорию</span>
                )}
                <svg
                    className="fill-current h-4 w-4 flex-shrink-0 ml-1 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 animate-fade-in-up flex flex-col">
                    <div className="p-2 border-b flex-shrink-0 bg-gray-50">
                        <input
                            type="search"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    </div>
                    <div className="flex-grow max-h-72 overflow-y-auto custom-scrollbar">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <div key={group.section_name}>
                                    <h3 className="px-3 py-1.5 text-[10px] font-bold text-gray-500 bg-gray-100 sticky top-0 truncate border-t border-b border-gray-200">
                                        {group.section_name.toUpperCase()}
                                    </h3>
                                    <ul>
                                        {group.categories.map((cat) => {
                                            const { leaf, path } = splitCategoryName(cat.name);
                                            return (
                                                <li key={cat.id}>
                                                    <button
                                                        onClick={() => {
                                                            onSelect(cat);
                                                            onToggle();
                                                        }}
                                                        className="block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-indigo-50 group border-b border-gray-50 last:border-0"
                                                    >
                                                        <div className="font-medium text-gray-800 group-hover:text-indigo-700">
                                                            {leaf}
                                                        </div>
                                                        {path && (
                                                            <div className="text-[10px] text-gray-400 group-hover:text-indigo-400 truncate">
                                                                {path}
                                                            </div>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Категории не найдены.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock кнопки обновления категорий
const RefreshCategoriesButtonMock: React.FC<{
    isRefreshing: boolean;
    onClick: () => void;
}> = ({ isRefreshing, onClick }) => (
    <button
        onClick={onClick}
        disabled={isRefreshing}
        title="Обновить список категорий товаров из VK"
        className="inline-flex items-center justify-center px-3 h-10 border border-gray-300 text-sm font-medium rounded-md text-gray-600 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none whitespace-nowrap disabled:opacity-50"
    >
        {isRefreshing ? (
            <div className="loader h-4 w-4 border-2 border-gray-400 border-t-indigo-500"></div>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
        )}
    </button>
);

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsCategoryFiltersPage: React.FC<ContentProps> = ({ title }) => {
    const [selectedCategory, setSelectedCategory] = useState<MockCategory | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            alert('Категории обновлены из VK');
        }, 2000);
    };

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================ */}
            {/* Важное уточнение */}
            {/* ============================================ */}
            <div className="not-prose mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-900">
                    <strong>Важно:</strong> В приложении нет отдельных кнопок фильтрации по категориям
                    (как для альбомов). Категории используются через выпадающий список в каждой строке
                    товара и при создании новых товаров.
                </p>
            </div>

            {/* ============================================ */}
            {/* Введение: Было/Стало */}
            {/* ============================================ */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Категории товаров — это обязательное поле для каждого товара в VK. Правильная
                    категория помогает покупателям находить товары через поиск и фильтры ВКонтакте.
                </p>

                <div className="not-prose mt-6 grid grid-cols-2 gap-6">
                    {/* Было */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-bold text-red-900 mb-3">❌ Раньше (в VK)</h4>
                        <ul className="text-sm text-red-800 space-y-2">
                            <li>• Выбор категории — длинный список без группировки</li>
                            <li>• Нет поиска — нужно листать сотни категорий</li>
                            <li>• Не видно структуру (раздел → категория → подкатегория)</li>
                            <li>• Если VK добавил новые категории — приходится заново заходить в товар</li>
                        </ul>
                    </div>

                    {/* Стало */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-bold text-green-900 mb-3">✅ Теперь (в приложении)</h4>
                        <ul className="text-sm text-green-800 space-y-2">
                            <li>• Категории сгруппированы по разделам (Одежда, Обувь...)</li>
                            <li>• Поиск по названию — находите категорию за секунду</li>
                            <li>• Двухстрочное отображение: жирная конечная + серый путь</li>
                            <li>• Кнопка обновления — загружает новые категории из VK</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Выпадающий селектор категорий */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    📋 Выпадающий список категорий
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Где используется
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Селектор категории встречается в нескольких местах:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>
                        <strong>В таблице товаров</strong> — колонка "Категория" (каждая строка имеет
                        свой селектор)
                    </li>
                    <li>
                        <strong>При создании товара</strong> — в модальном окне создания одного или
                        нескольких товаров
                    </li>
                    <li>
                        <strong>При массовом редактировании</strong> — изменение категории для
                        нескольких товаров сразу
                    </li>
                    <li>
                        <strong>При обновлении из файла</strong> — маппинг категорий из импортируемого
                        файла
                    </li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Структура селектора
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Селектор состоит из двух частей:
                </p>

                <div className="not-prose mt-4 space-y-3">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm text-blue-900 font-medium mb-1">1. Кнопка с выбранной категорией</p>
                        <ul className="text-sm text-blue-800 space-y-1 ml-4">
                            <li>• <strong>Первая строка:</strong> конечная категория (жирным шрифтом)</li>
                            <li>• <strong>Вторая строка:</strong> полный путь (серым цветом, мелким шрифтом)</li>
                            <li>• <strong>Иконка стрелки:</strong> справа, показывает что можно раскрыть</li>
                        </ul>
                    </div>

                    <div className="p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                        <p className="text-sm text-purple-900 font-medium mb-1">
                            2. Выпадающее окно (dropdown)
                        </p>
                        <ul className="text-sm text-purple-800 space-y-1 ml-4">
                            <li>• <strong>Поле поиска:</strong> вверху, автофокус, серый фон</li>
                            <li>• <strong>Группы категорий:</strong> липкие заголовки (uppercase, серый фон)</li>
                            <li>• <strong>Категории:</strong> двухстрочные кнопки с hover-эффектом (подсветка голубым)</li>
                            <li>• <strong>Скроллбар:</strong> тонкий, стилизованный (max высота 288px)</li>
                        </ul>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Поиск по категориям
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Поиск работает в реальном времени и ищет совпадения:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>В названии категории</li>
                    <li>В названии раздела (секции)</li>
                    <li>Регистр не важен (поиск case-insensitive)</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Пример:</strong> Введите "футбол" — увидите "Одежда / Футболки / Мужские" и
                    "Одежда / Футболки / Женские".
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Интерактивная песочница */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🎮 Интерактивная демонстрация
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Попробуйте открыть селектор, поискать категорию и выбрать её:
                </p>

                <Sandbox
                    title="Выбор категории товара"
                    description="Кликните по кнопке, используйте поиск, выберите категорию из списка."
                    instructions={[
                        'Нажмите на кнопку <strong>"Выберите категорию"</strong>',
                        'Введите в поиск <strong>"футбол"</strong> — список отфильтруется',
                        'Наведите курсор на категорию — она подсветится голубым',
                        'Кликните на категорию — она выберется и отобразится в кнопке',
                        'Обратите внимание на <strong>двухстрочное отображение</strong> выбранной категории',
                    ]}
                >
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Категория товара:
                            </p>
                            <CategorySelectorMock
                                value={selectedCategory}
                                isOpen={isDropdownOpen}
                                onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                                onSelect={setSelectedCategory}
                            />
                        </div>

                        {selectedCategory && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm text-green-900">
                                    <strong>Выбрано:</strong> {selectedCategory.name}
                                </p>
                                <p className="text-xs text-green-700 mt-1">
                                    ID: {selectedCategory.id} | Раздел: {selectedCategory.section_name}
                                </p>
                            </div>
                        )}
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Кнопка обновления категорий */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🔄 Обновление категорий из VK
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В шапке страницы "Товары" есть кнопка с иконкой круговой стрелки. Она загружает
                    актуальный справочник категорий из VK.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Зачем это нужно
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    ВКонтакте периодически добавляет новые категории товаров или изменяет их структуру.
                    Чтобы использовать свежие категории при создании товаров, нужно нажать эту кнопку.
                </p>

                <div className="not-prose mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm text-yellow-900">
                        <strong>Важно:</strong> Обновление не изменяет категории у существующих товаров.
                        Оно только обновляет список доступных категорий для новых товаров.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Как работает кнопка
                </h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>
                        <strong>В обычном состоянии:</strong> иконка круговой стрелки (SVG), серый цвет
                    </li>
                    <li>
                        <strong>При наведении:</strong> фон становится светло-серым
                    </li>
                    <li>
                        <strong>При загрузке:</strong> иконка заменяется на spinner (крутящийся индикатор)
                    </li>
                    <li>
                        <strong>Подсказка:</strong> "Обновить список категорий товаров из VK" (при
                        наведении курсора)
                    </li>
                </ul>

                <Sandbox
                    title="Кнопка обновления категорий"
                    description="Нажмите на кнопку, чтобы увидеть процесс обновления."
                    instructions={[
                        'Нажмите на кнопку с <strong>круговой стрелкой</strong>',
                        'Иконка сменится на <strong>индикатор загрузки</strong> (spinner)',
                        'Через 2 секунды появится сообщение об успешном обновлении',
                    ]}
                >
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <RefreshCategoriesButtonMock
                            isRefreshing={isRefreshing}
                            onClick={handleRefresh}
                        />
                        <p className="text-sm text-gray-600">
                            Кнопка обновления категорий (находится в шапке страницы "Товары")
                        </p>
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Структура данных */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🔧 Структура данных MarketCategory
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Каждая категория в системе имеет следующую структуру:
                </p>

                <div className="not-prose mt-4 p-4 bg-gray-50 rounded-lg font-mono text-sm">
                    <pre className="text-gray-800">
{`{
  id: 123,                             // Уникальный ID категории
  name: "Одежда / Футболки / Мужские", // Полный путь с разделителями
  section_id: 1,                       // ID раздела (секции)
  section_name: "Одежда"               // Название раздела
}`}
                    </pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Группировка категорий
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Категории группируются по полю <code>section_name</code>. Это создаёт структуру с
                    липкими заголовками в dropdown:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>
                        <strong>ОДЕЖДА</strong> — Футболки / Мужские, Футболки / Женские, Джинсы...
                    </li>
                    <li>
                        <strong>ОБУВЬ</strong> — Кроссовки / Мужские, Ботинки...
                    </li>
                    <li>
                        <strong>АКСЕССУАРЫ</strong> — Рюкзаки, Шапки...
                    </li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Разделение названия на части
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система автоматически разбивает <code>name</code> на две части для отображения:
                </p>
                <div className="not-prose mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-900 mb-2">
                        <strong>Входные данные:</strong>
                    </p>
                    <code className="text-xs bg-blue-100 px-2 py-1 rounded">
                        "Одежда / Футболки / Мужские"
                    </code>
                    <p className="text-sm text-blue-900 mt-3 mb-2">
                        <strong>Отображение:</strong>
                    </p>
                    <div className="bg-white p-2 rounded border border-blue-300">
                        <p className="text-sm font-medium text-gray-800">Мужские</p>
                        <p className="text-[10px] text-gray-400">Одежда / Футболки</p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Практические сценарии */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    💼 Практические сценарии
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 1: Создание нового товара
                </h3>
                <div className="not-prose mt-3 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2">
                        <strong>Ситуация:</strong> Нужно добавить футболку в каталог.
                    </p>
                    <p className="text-sm text-blue-900">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="text-sm text-blue-900 space-y-1 ml-5 mt-2">
                        <li>1. Открываете всплывающее окно создания товара</li>
                        <li>2. Заполняете название, цену, описание</li>
                        <li>3. Кликаете на селектор категории</li>
                        <li>4. Вводите в поиск "футбол"</li>
                        <li>5. Выбираете "Одежда / Футболки / Мужские"</li>
                        <li>6. Сохраняете товар</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 2: Изменение категории у существующего товара
                </h3>
                <div className="not-prose mt-3 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-900 mb-2">
                        <strong>Ситуация:</strong> Товар был в неправильной категории, нужно исправить.
                    </p>
                    <p className="text-sm text-green-900">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="text-sm text-green-900 space-y-1 ml-5 mt-2">
                        <li>1. Находите товар в таблице</li>
                        <li>2. Кликаете на селектор в колонке "Категория"</li>
                        <li>3. Ищете правильную категорию через поиск</li>
                        <li>4. Выбираете нужную категорию</li>
                        <li>5. Нажимаете "Сохранить изменения" в шапке таблицы</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 3: Массовое изменение категорий
                </h3>
                <div className="not-prose mt-3 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900 mb-2">
                        <strong>Ситуация:</strong> После импорта 50 товаров все оказались в категории
                        "Разное", нужно переместить их в "Одежда / Футболки".
                    </p>
                    <p className="text-sm text-purple-900">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="text-sm text-purple-900 space-y-1 ml-5 mt-2">
                        <li>1. Включаете режим выбора (кнопка с галочками)</li>
                        <li>2. Отмечаете нужные товары</li>
                        <li>3. Нажимаете "Изменить" в шапке</li>
                        <li>4. Открывается окно массового редактирования</li>
                        <li>5. Выбираете категорию "Одежда / Футболки"</li>
                        <li>6. Нажимаете "Применить"</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 4: VK добавил новые категории
                </h3>
                <div className="not-prose mt-3 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-900 mb-2">
                        <strong>Ситуация:</strong> ВКонтакте добавил категорию "Смартфоны", но в
                        приложении её нет.
                    </p>
                    <p className="text-sm text-yellow-900">
                        <strong>Действия:</strong>
                    </p>
                    <ol className="text-sm text-yellow-900 space-y-1 ml-5 mt-2">
                        <li>1. Открываете страницу "Товары"</li>
                        <li>2. Нажимаете кнопку с круговой стрелкой (справа вверху)</li>
                        <li>3. Ждёте пару секунд (крутится индикатор загрузки)</li>
                        <li>4. Теперь при открытии селектора видите новую категорию "Смартфоны"</li>
                    </ol>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Особенности работы */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    ⚙️ Технические особенности
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Ленивая загрузка категорий
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Категории загружаются не сразу при открытии страницы "Товары", а только при первом
                    открытии любого селектора категорий. Это ускоряет начальную загрузку страницы.
                </p>
                <div className="not-prose mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-900">
                        После первой загрузки категории кэшируются в памяти и не загружаются повторно до
                        обновления страницы.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Состояние загрузки
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Во время загрузки категорий в dropdown отображается:
                </p>
                <div className="not-prose mt-3 p-4 bg-gray-100 rounded text-center">
                    <p className="text-sm text-gray-500">Загрузка...</p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Позиционирование dropdown
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Dropdown использует <code>createPortal</code> из React — он рендерится в
                    корне документа (не внутри таблицы). Это решает проблему обрезания dropdown при
                    скролле таблицы.
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>z-index: 100 (выше всех элементов таблицы)</li>
                    <li>Позиция рассчитывается динамически при открытии</li>
                    <li>Обновляется при скролле и ресайзе окна</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Итоги */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">✅ Итоги</h2>
                <div className="not-prose mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-4 text-lg">Что вы узнали:</h4>
                    <ul className="text-sm text-green-800 space-y-2">
                        <li>
                            ✅ В приложении нет кнопок фильтрации по категориям — категории выбираются
                            через выпадающий список
                        </li>
                        <li>
                            ✅ Селектор категорий имеет поиск и группировку по разделам (Одежда, Обувь...)
                        </li>
                        <li>
                            ✅ Выбранная категория отображается в два ряда: жирная конечная + серый путь
                        </li>
                        <li>
                            ✅ Кнопка с круговой стрелкой обновляет справочник категорий из VK
                        </li>
                        <li>
                            ✅ Категории загружаются один раз при первом открытии селектора (ленивая
                            загрузка)
                        </li>
                        <li>
                            ✅ Dropdown использует portal для корректного отображения поверх таблицы
                        </li>
                    </ul>
                </div>
            </section>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-4-category-filters" />
        </article>
    );
};
