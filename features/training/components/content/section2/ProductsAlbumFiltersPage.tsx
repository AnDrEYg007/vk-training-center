import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации фильтров по альбомам
// =====================================================================

interface MockAlbum {
    id: number;
    owner_id: number;
    title: string;
    count: number;
}

const AlbumFiltersMock: React.FC<{
    albums: MockAlbum[];
    itemsCount: number;
    itemsWithoutAlbumCount: number;
    activeAlbumId: string;
    onSelectAlbum: (id: string) => void;
    isLoading?: boolean;
}> = ({ albums, itemsCount, itemsWithoutAlbumCount, activeAlbumId, onSelectAlbum, isLoading }) => {
    const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');

    if (isLoading) {
        return (
            <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex gap-2 flex-wrap">
                    <div className="h-9 w-28 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-9 w-40 bg-gray-200 rounded-md animate-pulse"></div>
                    <div className="h-9 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
            </div>
        );
    }

    const handleCreateClick = () => {
        if (newAlbumTitle.trim()) {
            alert(`Создана подборка: "${newAlbumTitle}"`);
            setNewAlbumTitle('');
            setIsCreatingAlbum(false);
        }
    };

    return (
        <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-2 flex-wrap">
                {/* Кнопка "Все" */}
                <button
                    onClick={() => onSelectAlbum('all')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border ${
                        activeAlbumId === 'all'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    Все - {itemsCount}
                </button>

                {/* Кнопка "Без подборки" (условная) */}
                {itemsWithoutAlbumCount > 0 && (
                    <button
                        onClick={() => onSelectAlbum('none')}
                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors border ${
                            activeAlbumId === 'none'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        Без подборки - {itemsWithoutAlbumCount}
                    </button>
                )}

                {/* Кнопки альбомов */}
                {albums.map((album) => {
                    const isActive = activeAlbumId === String(album.id);
                    const wrapperClass = `flex items-center gap-2 rounded-md border transition-colors ${
                        isActive
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`;

                    return (
                        <div key={album.id} className={wrapperClass}>
                            <button
                                onClick={() => onSelectAlbum(String(album.id))}
                                className="px-3 py-1.5 text-sm font-medium"
                            >
                                {album.title} - {album.count}
                            </button>
                            <div
                                className={`w-px h-4 ${isActive ? 'bg-indigo-400' : 'bg-gray-300'}`}
                            ></div>
                            <a
                                href={`https://vk.com/market${album.owner_id}?section=album_${album.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pr-2"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg
                                    className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    );
                })}

                {/* Кнопка создания альбома */}
                {isCreatingAlbum ? (
                    <div className="flex items-center gap-2 animate-fade-in-up">
                        <input
                            type="text"
                            value={newAlbumTitle}
                            onChange={(e) => setNewAlbumTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreateClick();
                                if (e.key === 'Escape') {
                                    setIsCreatingAlbum(false);
                                    setNewAlbumTitle('');
                                }
                            }}
                            placeholder="Название новой подборки..."
                            className="px-3 py-1.5 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateClick}
                            className="px-3 py-1.5 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Ок
                        </button>
                        <button
                            onClick={() => {
                                setIsCreatingAlbum(false);
                                setNewAlbumTitle('');
                            }}
                            className="p-1.5 text-gray-500 hover:text-gray-700"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreatingAlbum(true)}
                        className="px-3 py-1.5 text-sm font-medium border-2 border-dashed border-blue-400 text-blue-600 bg-white rounded-md hover:bg-blue-50 transition-colors"
                    >
                        + Создать подборку
                    </button>
                )}
            </div>
        </div>
    );
};

// Mock товаров для демонстрации
interface MockProduct {
    id: number;
    title: string;
    album_ids: number[];
}

const ProductCardMini: React.FC<{ product: MockProduct }> = ({ product }) => (
    <div className="p-3 border border-gray-200 rounded-md bg-white">
        <p className="text-sm font-medium text-gray-900">{product.title}</p>
        <p className="text-xs text-gray-500 mt-1">
            {product.album_ids.length > 0
                ? `Подборки: ${product.album_ids.join(', ')}`
                : 'Без подборки'}
        </p>
    </div>
);

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsAlbumFiltersPage: React.FC<ContentProps> = ({ title }) => {
    const [activeAlbumId, setActiveAlbumId] = useState<string>('all');

    // Демонстрационные данные
    const mockAlbums: MockAlbum[] = [
        { id: 1, owner_id: -123456789, title: 'Новинки', count: 12 },
        { id: 2, owner_id: -123456789, title: 'Акции', count: 8 },
        { id: 3, owner_id: -123456789, title: 'Популярные', count: 15 },
    ];

    const mockProducts: MockProduct[] = [
        { id: 1, title: 'Футболка классическая', album_ids: [1, 3] },
        { id: 2, title: 'Кроссовки спортивные', album_ids: [1] },
        { id: 3, title: 'Джинсы slim fit', album_ids: [3] },
        { id: 4, title: 'Куртка демисезонная', album_ids: [2] },
        { id: 5, title: 'Рюкзак городской', album_ids: [] },
        { id: 6, title: 'Шапка вязаная', album_ids: [] },
    ];

    const totalCount = mockProducts.length;
    const withoutAlbumCount = mockProducts.filter(p => p.album_ids.length === 0).length;

    // Логика фильтрации
    const getFilteredProducts = (): MockProduct[] => {
        if (activeAlbumId === 'all') {
            return mockProducts;
        }
        if (activeAlbumId === 'none') {
            return mockProducts.filter(p => p.album_ids.length === 0);
        }
        return mockProducts.filter(p => p.album_ids.includes(Number(activeAlbumId)));
    };

    const filteredProducts = getFilteredProducts();

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================ */}
            {/* Введение: Было/Стало */}
            {/* ============================================ */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Фильтры по альбомам (подборкам) помогают быстро находить товары, относящиеся к определённой категории или акции. Это особенно удобно, когда в проекте сотни товаров.
                </p>

                <div className="not-prose mt-6 grid grid-cols-2 gap-6">
                    {/* Было */}
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-bold text-red-900 mb-3">❌ Раньше (в VK)</h4>
                        <ul className="text-sm text-red-800 space-y-2">
                            <li>• Заходили в раздел "Товары" сообщества</li>
                            <li>• Переключались между подборками через меню</li>
                            <li>• Каждая подборка открывалась отдельно</li>
                            <li>• Не видно количество товаров без подборки</li>
                            <li>• Нужно открывать новую вкладку для просмотра подборки в VK</li>
                        </ul>
                    </div>

                    {/* Стало */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-bold text-green-900 mb-3">✅ Теперь (в приложении)</h4>
                        <ul className="text-sm text-green-800 space-y-2">
                            <li>• Все подборки — кнопки в одной строке</li>
                            <li>• Видно количество товаров в каждой подборке</li>
                            <li>• Отдельная кнопка "Без подборки" для неразобранных товаров</li>
                            <li>• Быстрый переход в VK — иконка со стрелкой рядом с каждой подборкой</li>
                            <li>• Можно создать новую подборку прямо из фильтров</li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Типы кнопок фильтров */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🎯 Типы кнопок фильтров
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    1. Кнопка "Все"
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Всегда видна. Показывает общее количество товаров в проекте. По умолчанию активна при открытии страницы.
                </p>
                <div className="not-prose mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-sm text-blue-900">
                        <strong>Когда использовать:</strong> Нужно увидеть весь каталог без ограничений.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    2. Кнопка "Без подборки"
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Появляется <strong>только если есть</strong> товары, которые не добавлены ни в одну подборку. Показывает количество таких товаров.
                </p>
                <div className="not-prose mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm text-yellow-900">
                        <strong>Зачем это нужно:</strong> Часто после импорта новых товаров они оказываются без подборок. Эта кнопка помогает быстро найти их и распределить.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    3. Кнопки индивидуальных подборок
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Каждая подборка (альбом) отображается отдельной кнопкой с названием и количеством товаров. Кнопка состоит из <strong>трёх частей</strong>:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Основная кнопка</strong> — клик фильтрует товары по этой подборке</li>
                    <li><strong>Разделитель</strong> — вертикальная линия (визуальное разделение)</li>
                    <li><strong>Иконка со стрелкой</strong> — открывает подборку в VK в новой вкладке</li>
                </ul>

                <div className="not-prose mt-4 p-3 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <p className="text-sm text-purple-900">
                        <strong>Совет:</strong> Внешняя ссылка удобна, когда нужно проверить как подборка выглядит для покупателей в VK, или добавить/удалить товары через интерфейс VK.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    4. Кнопка "+ Создать подборку"
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Пунктирная кнопка голубого цвета. При нажатии превращается в форму для ввода названия новой подборки.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Форма создания:</strong>
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Поле ввода с подсказкой "Название новой подборки..." (автофокус)</li>
                    <li>Зелёная кнопка "Ок" — сохраняет подборку</li>
                    <li>Кнопка с крестиком — отменяет создание</li>
                    <li><strong>Клавиша Enter</strong> — то же, что "Ок"</li>
                    <li><strong>Клавиша Escape</strong> — то же, что крестик</li>
                </ul>
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
                    Попробуйте взаимодействовать с фильтрами и увидите, как меняется список товаров:
                </p>

                <Sandbox
                    title="Фильтрация по подборкам"
                    description="Кликайте по кнопкам, наведите курсор на иконку со стрелкой (откроется подборка в VK), попробуйте создать новую подборку."
                    instructions={[
                        'Нажмите <strong>"Все"</strong> — увидите все 6 товаров',
                        'Нажмите <strong>"Без подборки"</strong> — останется 2 товара',
                        'Выберите <strong>"Новинки"</strong> — покажется 2 товара из этой подборки',
                        'Кликните <strong>иконку со стрелкой</strong> рядом с подборкой — откроется VK (в реальности)',
                        'Нажмите <strong>"+ Создать подборку"</strong>, введите название и нажмите Enter',
                    ]}
                >
                    <div className="space-y-4">
                        {/* Фильтры */}
                        <AlbumFiltersMock
                            albums={mockAlbums}
                            itemsCount={totalCount}
                            itemsWithoutAlbumCount={withoutAlbumCount}
                            activeAlbumId={activeAlbumId}
                            onSelectAlbum={setActiveAlbumId}
                        />

                        {/* Результат фильтрации */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                                Найдено товаров: <strong>{filteredProducts.length}</strong>
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                {filteredProducts.map((product) => (
                                    <ProductCardMini key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Состояние загрузки */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    ⏳ Состояние загрузки (Skeleton)
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Пока данные о подборках загружаются с сервера, вместо реальных кнопок отображаются <strong>4 серых блока</strong> с пульсирующей анимацией. Это показывает пользователю, что система работает.
                </p>

                <Sandbox
                    title="Состояние загрузки"
                    description="Так выглядят фильтры во время загрузки данных:"
                >
                    <AlbumFiltersMock
                        albums={[]}
                        itemsCount={0}
                        itemsWithoutAlbumCount={0}
                        activeAlbumId="all"
                        onSelectAlbum={() => {}}
                        isLoading={true}
                    />
                </Sandbox>

                <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                    <strong>Детали реализации:</strong>
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>4 блока разной ширины (имитация разных длин названий подборок)</li>
                    <li>Высота: 36px (h-9) — как у реальных кнопок</li>
                    <li>Цвет: серый (#E5E7EB, Tailwind gray-200)</li>
                    <li>Анимация: пульсация (animate-pulse)</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Логика фильтрации */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🧠 Как работает фильтрация
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Фильтрация по подборкам имеет <strong>три режима</strong>:
                </p>

                <div className="not-prose mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 border-l-4 border-gray-500 rounded">
                        <h4 className="font-bold text-gray-900 mb-2">Режим 1: "Все" (activeAlbumId = 'all')</h4>
                        <p className="text-sm text-gray-700">
                            Показываются <strong>все товары</strong> без ограничений по подборкам. Это режим по умолчанию.
                        </p>
                    </div>

                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <h4 className="font-bold text-yellow-900 mb-2">Режим 2: "Без подборки" (activeAlbumId = 'none')</h4>
                        <p className="text-sm text-yellow-800">
                            Показываются только товары, у которых <code className="text-xs bg-yellow-200 px-1 py-0.5 rounded">album_ids</code> пустой или отсутствует.
                        </p>
                    </div>

                    <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                        <h4 className="font-bold text-indigo-900 mb-2">Режим 3: Конкретная подборка (activeAlbumId = '123')</h4>
                        <p className="text-sm text-indigo-800">
                            Показываются только товары, у которых в массиве <code className="text-xs bg-indigo-200 px-1 py-0.5 rounded">album_ids</code> есть этот ID подборки.
                        </p>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Комбинация с поиском
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Важная особенность: фильтрация по подборкам применяется <strong>после поиска</strong>. Это означает:
                </p>
                <ol className="!text-base !leading-relaxed !text-gray-700">
                    <li>Сначала товары фильтруются по строке поиска (если она заполнена)</li>
                    <li>Затем из найденных товаров выбираются те, что соответствуют активной подборке</li>
                </ol>

                <div className="not-prose mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                        <strong>Пример:</strong> Вы ввели в поиск "футболка" и выбрали подборку "Акции". Покажутся только товары, в названии которых есть "футболка" <strong>И</strong> которые добавлены в подборку "Акции".
                    </p>
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
                    Сценарий 1: Проверка товаров в акции
                </h3>
                <div className="not-prose mt-3 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2"><strong>Ситуация:</strong> Заказчик спросил, сколько товаров сейчас в подборке "Летняя распродажа".</p>
                    <p className="text-sm text-blue-900"><strong>Действия:</strong></p>
                    <ol className="text-sm text-blue-900 space-y-1 ml-5 mt-2">
                        <li>1. Открываете вкладку "Товары" проекта</li>
                        <li>2. Кликаете на кнопку "Летняя распродажа"</li>
                        <li>3. Смотрите количество рядом с названием (например, "Летняя распродажа - 23")</li>
                        <li>4. Проверяете список товаров — видите только те, что в подборке</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 2: Разбор новых товаров
                </h3>
                <div className="not-prose mt-3 p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-900 mb-2"><strong>Ситуация:</strong> После импорта 50 новых товаров нужно распределить их по подборкам.</p>
                    <p className="text-sm text-yellow-900"><strong>Действия:</strong></p>
                    <ol className="text-sm text-yellow-900 space-y-1 ml-5 mt-2">
                        <li>1. Кликаете кнопку "Без подборки"</li>
                        <li>2. Видите список неразобранных товаров</li>
                        <li>3. Открываете каждый товар, смотрите на его категорию</li>
                        <li>4. В карточке товара добавляете нужные подборки</li>
                        <li>5. Когда закончите — кнопка "Без подборки" исчезнет (если всё разобрали)</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 3: Создание новой подборки
                </h3>
                <div className="not-prose mt-3 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-900 mb-2"><strong>Ситуация:</strong> Появилась новая категория товаров — нужно создать подборку "Новогодние товары".</p>
                    <p className="text-sm text-green-900"><strong>Действия:</strong></p>
                    <ol className="text-sm text-green-900 space-y-1 ml-5 mt-2">
                        <li>1. Кликаете "+ Создать подборку"</li>
                        <li>2. Вводите название: "Новогодние товары"</li>
                        <li>3. Нажимаете Enter (или кнопку "Ок")</li>
                        <li>4. Новая кнопка с подборкой появляется в фильтрах</li>
                        <li>5. Теперь можно добавлять туда товары через их карточки</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 4: Быстрый переход в VK
                </h3>
                <div className="not-prose mt-3 p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-900 mb-2"><strong>Ситуация:</strong> Заказчик говорит, что подборка "Хиты продаж" выглядит странно на сайте VK.</p>
                    <p className="text-sm text-purple-900"><strong>Действия:</strong></p>
                    <ol className="text-sm text-purple-900 space-y-1 ml-5 mt-2">
                        <li>1. Наводите курсор на кнопку "Хиты продаж"</li>
                        <li>2. Видите иконку со стрелкой справа</li>
                        <li>3. Кликаете на иконку</li>
                        <li>4. Открывается новая вкладка с этой подборкой в VK</li>
                        <li>5. Видите проблему и решаете её (например, изменяете порядок товаров)</li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Сценарий 5: Комбинация поиска и фильтра
                </h3>
                <div className="not-prose mt-3 p-4 bg-indigo-50 rounded-lg">
                    <p className="text-sm text-indigo-900 mb-2"><strong>Ситуация:</strong> Нужно найти все футболки из подборки "Акции".</p>
                    <p className="text-sm text-indigo-900"><strong>Действия:</strong></p>
                    <ol className="text-sm text-indigo-900 space-y-1 ml-5 mt-2">
                        <li>1. Вводите в поиск: "футболка"</li>
                        <li>2. Кликаете кнопку "Акции"</li>
                        <li>3. Видите только футболки из акционной подборки</li>
                        <li>4. Если результатов нет — значит футболок в акциях сейчас нет</li>
                    </ol>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Технические детали */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🔧 Технические детали
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Структура данных подборки (MarketAlbum)
                </h3>
                <div className="not-prose mt-3 p-4 bg-gray-50 rounded-lg font-mono text-sm">
                    <pre className="text-gray-800">{`{
  id: 123,                    // Уникальный ID подборки в VK
  owner_id: -987654321,       // ID сообщества (отрицательное число)
  title: "Новинки",           // Название подборки
  count: 15,                  // Количество товаров в подборке
  updated_time: 1642512345    // Время последнего обновления (опционально)
}`}</pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Формат внешней ссылки
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Ссылка на подборку в VK формируется по шаблону:
                </p>
                <div className="not-prose mt-3 p-4 bg-blue-50 rounded-lg font-mono text-sm">
                    <code className="text-blue-900">
                        https://vk.com/market<span className="text-red-600">{'{owner_id}'}</span>?section=album_<span className="text-red-600">{'{id}'}</span>
                    </code>
                </div>
                <p className="!text-base !leading-relaxed !text-gray-700 !mt-3">
                    <strong>Пример:</strong> Подборка с <code>id=456</code> сообщества <code>owner_id=-123456789</code> откроется по адресу:<br />
                    <code className="text-sm">https://vk.com/market-123456789?section=album_456</code>
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Поведение кнопки "Без подборки"
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Кнопка отображается только если выполняется условие:
                </p>
                <div className="not-prose mt-3 p-4 bg-yellow-50 rounded-lg font-mono text-sm">
                    <code className="text-yellow-900">
                        itemsWithoutAlbumCount {'>'} 0
                    </code>
                </div>
                <p className="!text-base !leading-relaxed !text-gray-700 !mt-3">
                    Количество рассчитывается как товары, у которых:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>album_ids === undefined</code> (поле отсутствует), <strong>или</strong></li>
                    <li><code>album_ids.length === 0</code> (массив пустой)</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* Итоги */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    ✅ Итоги
                </h2>
                <div className="not-prose mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <h4 className="font-bold text-green-900 mb-4 text-lg">Что вы узнали:</h4>
                    <ul className="text-sm text-green-800 space-y-2">
                        <li>✅ Фильтры по подборкам — быстрый способ найти товары нужной категории</li>
                        <li>✅ Кнопка "Без подборки" помогает найти неразобранные товары после импорта</li>
                        <li>✅ Каждая кнопка подборки имеет внешнюю ссылку для проверки в VK</li>
                        <li>✅ Можно создать новую подборку прямо из фильтров (кнопка "+", Enter для сохранения)</li>
                        <li>✅ Фильтрация работает после поиска — можно комбинировать</li>
                        <li>✅ Во время загрузки показывается скелетон из 4 блоков</li>
                    </ul>
                </div>
            </section>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-3-album-filters" />
        </article>
    );
};
