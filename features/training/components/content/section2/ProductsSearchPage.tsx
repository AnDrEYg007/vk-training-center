import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsSearchPage: React.FC<ContentProps> = ({ title }) => {
    // Состояние для интерактивного примера
    const [searchQuery, setSearchQuery] = useState('');

    // Демо-данные товаров для примера
    const demoProducts = [
        { id: 1, title: 'Кроссовки Nike Air Max', description: 'Удобные спортивные кроссовки', price: 5990, category: 'Обувь' },
        { id: 2, title: 'Футболка Adidas', description: 'Хлопковая футболка для тренировок', price: 1990, category: 'Одежда' },
        { id: 3, title: 'Рюкзак туристический', description: 'Вместительный рюкзак 40л', price: 3500, category: 'Аксессуары' },
        { id: 4, title: 'Кепка Nike', description: 'Бейсболка с логотипом', price: 890, category: 'Аксессуары' },
    ];

    // Фильтрация по запросу (как в реальном коде)
    const filteredProducts = searchQuery.trim()
        ? demoProducts.filter(p => 
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            String(p.price).includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : demoProducts;

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда в проекте несколько сотен товаров, найти нужный вручную — задача на несколько минут. 
                Раньше приходилось листать таблицу глазами, запоминая где что находится. Теперь есть <strong>полнотекстовый 
                поиск</strong>, который мгновенно находит товары по любому слову из названия, описания, цены или категории.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главное преимущество:</strong> Поиск работает в реальном времени — результаты появляются 
                    по мере ввода текста. Не нужно нажимать кнопку "Искать", система фильтрует товары автоматически.
                </p>
            </div>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>📌 Про сортировку:</strong> В текущей версии приложения сортировка товаров по колонкам 
                    (клик на заголовок таблицы) пока не реализована. Товары отображаются в порядке, полученном от VK. 
                    Эта функция будет добавлена в будущих обновлениях.
                </p>
            </div>

            <hr className="!my-10" />

            {/* 1️⃣ Поле поиска */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1️⃣ Поле поиска
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В правом верхнем углу таблицы товаров находится поле поиска с иконкой лупы. Оно всегда видно 
                и доступно — можете начать печатать в любой момент.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Как выглядит поле
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                <li>
                    <strong>Иконка:</strong> Слева внутри поля — изображение лупы (🔍), символ поиска
                </li>
                <li>
                    <strong>Подсказка в поле:</strong> "Поиск по всем полям..." — появляется когда поле пустое
                </li>
                <li>
                    <strong>Ширина:</strong> Фиксированная, достаточная для комфортного ввода текста
                </li>
                <li>
                    <strong>Стиль:</strong> Белое поле с серой рамкой, при фокусе рамка становится фиолетовой
                </li>
            </ul>

            <Sandbox
                title="Интерактивный пример: Поле поиска"
                description="Начните вводить текст в поле ниже и наблюдайте как фильтруется список товаров"
                instructions={[
                    'Попробуйте ввести <strong>"nike"</strong> — найдутся все товары Nike',
                    'Введите цену <strong>"1990"</strong> — найдётся товар с этой ценой',
                    'Введите категорию <strong>"аксессуары"</strong> — найдутся рюкзак и кепка',
                    'Очистите поле — вернутся все товары'
                ]}
            >
                <div className="space-y-4">
                    {/* Реальное поле поиска из ProductsHeader */}
                    <div className="relative w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="search"
                            placeholder="Поиск по всем полям..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-3 h-10 pl-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Счётчик результатов */}
                    <div className="text-sm text-gray-600">
                        {searchQuery.trim() ? (
                            <span>Найдено товаров: <strong>{filteredProducts.length}</strong> из {demoProducts.length}</span>
                        ) : (
                            <span>Показаны все товары: <strong>{demoProducts.length}</strong></span>
                        )}
                    </div>

                    {/* Список товаров */}
                    <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div key={product.id} className="p-3 hover:bg-gray-50">
                                    <p className="font-medium text-gray-900">{product.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                        <span>💰 {product.price} ₽</span>
                                        <span>📁 {product.category}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-gray-500">
                                <p>Ничего не найдено по запросу "{searchQuery}"</p>
                                <p className="text-sm mt-1">Попробуйте изменить поисковый запрос</p>
                            </div>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* 2️⃣ По каким полям ищет */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2️⃣ По каким полям работает поиск
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система ищет совпадения одновременно в <strong>9 полях</strong> каждого товара. Это значит, 
                что вы можете ввести любое слово, которое помните о товаре, и система найдёт его.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">📝</div>
                        <div>
                            <p className="font-semibold text-gray-900">1. Название товара</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "Кроссовки Nike" — найдёт все товары с этими словами в названии
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">📄</div>
                        <div>
                            <p className="font-semibold text-gray-900">2. Описание товара</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "спортивные" — найдёт товары, где это слово есть в описании
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">🔢</div>
                        <div>
                            <p className="font-semibold text-gray-900">3. Артикул (SKU)</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "A123" — найдёт товар с этим артикулом
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">💰</div>
                        <div>
                            <p className="font-semibold text-gray-900">4. Текущая цена</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "1990" — найдёт все товары с ценой 1990 рублей
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">💸</div>
                        <div>
                            <p className="font-semibold text-gray-900">5. Старая цена</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "2990" — найдёт товары, где была такая старая цена (зачёркнутая)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">📁</div>
                        <div>
                            <p className="font-semibold text-gray-900">6. Категория товара</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "Одежда" — найдёт все товары из этой категории
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">🏪</div>
                        <div>
                            <p className="font-semibold text-gray-900">7. Секция категории</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "Спорт" — найдёт товары из секции "Спорт"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">📚</div>
                        <div>
                            <p className="font-semibold text-gray-900">8. Названия альбомов</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Пример: "Новинки" — найдёт товары из альбома с таким названием
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Важно:</strong> Поиск <strong>не чувствителен к регистру</strong>. Можете писать "nike" или "NIKE" — 
                результат будет одинаковым. Также система автоматически убирает лишние пробелы в начале и конце запроса.
            </p>

            <hr className="!my-10" />

            {/* 3️⃣ Как работает поиск */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3️⃣ Как работает поиск
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система использует метод <strong>частичного совпадения</strong>. Это значит, что не нужно вводить 
                слово целиком — достаточно любой его части.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Примеры частичного совпадения
            </h3>

            <div className="not-prose bg-indigo-50 rounded-lg p-6 my-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">✓</div>
                        <div>
                            <p className="font-semibold text-gray-900">Ввели: "крос"</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Найдёт: "<strong>Крос</strong>совки Nike", "<strong>Крос</strong>совки Adidas"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">✓</div>
                        <div>
                            <p className="font-semibold text-gray-900">Ввели: "199"</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Найдёт: товары с ценой "<strong>199</strong>0", "<strong>199</strong>5", "1<strong>199</strong>"
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">✓</div>
                        <div>
                            <p className="font-semibold text-gray-900">Ввели: "спорт"</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Найдёт: "<strong>Спорт</strong>ивная обувь", "Товары для <strong>спорт</strong>а"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Поиск в реальном времени
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Не нужно нажимать Enter или кнопку "Найти". Как только вы начинаете печатать, таблица 
                автоматически обновляется и показывает только подходящие товары.
            </p>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>💡 Совет:</strong> Если вы ищете конкретный товар, но забыли точное название — начните вводить 
                    любую его часть. Например, помните что в названии было слово "зимние" — введите это и увидите все 
                    подходящие товары.
                </p>
            </div>

            <hr className="!my-10" />

            {/* 4️⃣ Очистка поиска */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                4️⃣ Как вернуться ко всем товарам
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Чтобы снова увидеть все товары без фильтрации, просто <strong>очистите поле поиска</strong>. 
                Есть два способа это сделать:
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-xl font-bold text-gray-700">1</div>
                    <div>
                        <p className="font-semibold text-gray-900">Удалить текст вручную</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Кликните в поле поиска, выделите весь текст (Ctrl+A) и нажмите Delete или Backspace
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-xl font-bold text-gray-700">2</div>
                    <div>
                        <p className="font-semibold text-gray-900">Использовать крестик очистки</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Если в поле есть текст, браузер обычно показывает маленький крестик справа — кликните на него
                        </p>
                    </div>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Как только поле станет пустым, таблица автоматически вернётся к показу всех товаров.
            </p>

            <hr className="!my-10" />

            {/* 5️⃣ Практические примеры */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                5️⃣ Практические примеры использования
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 1: Найти товар по названию бренда
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> В каталоге 500 товаров, нужно найти все товары Nike для обновления цен.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-gray-900 mb-2">Было (без поиска):</p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Листаете таблицу вручную, пытаясь найти товары Nike глазами</li>
                        <li>Занимает 10-15 минут, можно что-то пропустить</li>
                        <li>Если товаров много, приходится записывать какие уже нашли</li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-green-700 mb-2">Стало (с поиском):</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Вводите "nike" в поле поиска</li>
                        <li>Система мгновенно показывает только товары Nike</li>
                        <li>Обновляете цены, задача выполнена за 2 минуты</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 2: Проверить товар по жалобе клиента
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Клиент написал, что в описании "красных кроссовок" ошибка в размере.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-green-700 mb-2">Решение:</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Вводите "красные кроссовки" в поиск</li>
                        <li>Система находит 2-3 подходящих товара</li>
                        <li>Быстро проверяете описания, находите ошибку и исправляете</li>
                        <li>Вся операция заняла 30 секунд вместо нескольких минут поиска</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 3: Найти товары в определённой ценовой категории
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Подготовить список товаров для акции "Всё по 990 рублей".
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-green-700 mb-2">Решение:</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Вводите "990" в поиск</li>
                        <li>Система показывает все товары с ценой 990 рублей</li>
                        <li>Копируете нужные товары для акции</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 4: Работа с альбомами
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Проверить, все ли товары из альбома "Распродажа" имеют скидку.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-green-700 mb-2">Решение:</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Вводите "распродажа" в поиск</li>
                        <li>Система находит все товары, которые находятся в этом альбоме</li>
                        <li>Проверяете каждый товар на наличие старой цены</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Итоговый чек-лист */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                ✅ Краткая памятка
            </h2>

            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 my-6">
                <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🔍</span>
                        <p className="text-gray-800">
                            <strong>Поле поиска</strong> находится в правом верхнем углу таблицы с иконкой лупы
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">⚡</span>
                        <p className="text-gray-800">
                            <strong>Реальное время:</strong> Результаты появляются по мере ввода, кнопка "Найти" не нужна
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🎯</span>
                        <p className="text-gray-800">
                            <strong>9 полей поиска:</strong> Название, описание, артикул, цены, категория, альбомы
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">📝</span>
                        <p className="text-gray-800">
                            <strong>Частичное совпадение:</strong> Можно вводить любую часть слова — "крос" найдёт "кроссовки"
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🔤</span>
                        <p className="text-gray-800">
                            <strong>Регистр не важен:</strong> "nike" и "NIKE" дадут одинаковый результат
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🧹</span>
                        <p className="text-gray-800">
                            <strong>Очистка поля</strong> мгновенно возвращает все товары обратно
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">❌</span>
                        <p className="text-gray-800">
                            <strong>Сортировка:</strong> Пока не реализована — планируется в будущих обновлениях
                        </p>
                    </li>
                </ul>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>💡 Совет:</strong> Используйте поиск каждый раз, когда нужно найти конкретный товар или группу 
                    товаров. Это экономит время и избавляет от необходимости запоминать где что находится в длинной таблице.
                </p>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-2-3-search" />
        </article>
    );
};
