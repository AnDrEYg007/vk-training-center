import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsColumnVisibilityPage: React.FC<ContentProps> = ({ title }) => {
    // Состояние для интерактивных примеров
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState({
        actions: true,
        photo: true,
        new_photo: false,
        title: true,
        description: true,
        price: true,
        old_price: true,
        sku: true,
        albums: true,
        category: true,
        vk_link: true,
        rating: true
    });

    const columns = [
        { key: 'actions', label: '⚙️ Действия' },
        { key: 'photo', label: '🖼️ Фото' },
        { key: 'new_photo', label: '🆕 New Фото' },
        { key: 'title', label: '📝 Название' },
        { key: 'description', label: '📄 Описание' },
        { key: 'price', label: '💰 Цена' },
        { key: 'old_price', label: '💸 Старая цена' },
        { key: 'sku', label: '🔢 Артикул' },
        { key: 'albums', label: '📚 Подборка' },
        { key: 'category', label: '📁 Категория' },
        { key: 'vk_link', label: '🔗 VK' },
        { key: 'rating', label: '⭐ Рейтинг' }
    ];

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const showAll = () => {
        const allVisible = columns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {});
        setVisibleColumns(allVisible);
    };

    const hideAll = () => {
        const allHidden = columns.reduce((acc, col) => ({ ...acc, [col.key]: false }), {});
        setVisibleColumns(allHidden);
    };

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда в таблице 12 колонок, экран становится перегруженным — приходится постоянно прокручивать вправо-влево, 
                чтобы увидеть нужную информацию. Раньше приходилось мириться с этим. Теперь вы можете <strong>скрыть неиспользуемые 
                колонки</strong> и оставить только те, с которыми работаете прямо сейчас.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главное преимущество:</strong> Ваши настройки видимости колонок сохраняются автоматически для каждого 
                    проекта. Если вы скрыли "Альбомы" в одном проекте, они останутся видимыми в другом — каждый проект помнит 
                    свою конфигурацию.
                </p>
            </div>

            <hr className="!my-10" />

            {/* 1️⃣ Кнопка "Колонки" */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                1️⃣ Кнопка "Колонки"
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В правом верхнем углу таблицы товаров находится кнопка <strong>"Колонки"</strong> с иконкой блокнота. 
                Именно она открывает доступ к управлению видимостью колонок.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Как выглядит кнопка
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                <li>
                    <strong>Иконка:</strong> Слева от текста — изображение блокнота (📋), символизирующее список колонок
                </li>
                <li>
                    <strong>Текст:</strong> "Колонки"
                </li>
                <li>
                    <strong>Стиль:</strong> Белая кнопка с серой рамкой, при наведении курсора становится светло-серой
                </li>
                <li>
                    <strong>Расположение:</strong> Справа от кнопки "Редактировать всё" в шапке таблицы
                </li>
            </ul>

            <Sandbox
                title="Интерактивный пример: Кнопка 'Колонки'"
                description="Нажмите на кнопку, чтобы открыть список управления колонками"
                instructions={[
                    'Кликните на кнопку "Колонки"',
                    'Обратите внимание на иконку блокнота слева',
                    'Выпадающий список появится с плавной анимацией'
                ]}
            >
                <div className="flex justify-end">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center justify-center px-4 h-10 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-md shadow-sm transition-colors"
                        >
                            <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Колонки
                        </button>

                        {/* Выпадающий список (будет описан ниже) */}
                        {isDropdownOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 z-20 animate-fade-in-up">
                                <div className="px-3 py-2 border-b border-gray-200 flex justify-between text-xs">
                                    <button 
                                        onClick={showAll}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Показать все
                                    </button>
                                    <button 
                                        onClick={hideAll}
                                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                                    >
                                        Скрыть все
                                    </button>
                                </div>
                                <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar">
                                    {columns.map(col => (
                                        <label
                                            key={col.key}
                                            className="flex items-center px-2 py-1.5 hover:bg-indigo-50 rounded cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[col.key as keyof typeof visibleColumns]}
                                                onChange={() => toggleColumn(col.key)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* 2️⃣ Выпадающий список колонок */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                2️⃣ Выпадающий список колонок
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После нажатия на кнопку "Колонки" появляется выпадающий список с чекбоксами (галочками) для каждой колонки таблицы. 
                Этот список открывается с плавной анимацией и содержит все 12 доступных колонок.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Структура списка
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                <li>
                    <strong>Шапка:</strong> Две кнопки для массовых действий — "Показать все" и "Скрыть все"
                </li>
                <li>
                    <strong>Список колонок:</strong> 12 строк с чекбоксами и названиями колонок
                </li>
                <li>
                    <strong>Прокрутка:</strong> Если колонок много, список можно прокручивать (появляется тонкая полоса прокрутки)
                </li>
                <li>
                    <strong>Подсветка:</strong> При наведении курсора на строку она подсвечивается нежно-фиолетовым цветом
                </li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Взаимодействие с чекбоксами
            </h3>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                            ✓
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Галочка стоит = колонка видна</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Колонка отображается в таблице, вы можете редактировать её содержимое
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
                            ✗
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">Галочки нет = колонка скрыта</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Колонка временно убрана из таблицы, но данные не удалены — при повторном включении всё вернётся
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Важно:</strong> Чтобы закрыть выпадающий список, нажмите где-нибудь на странице вне списка, 
                или повторно кликните на кнопку "Колонки".
            </p>

            <hr className="!my-10" />

            {/* 3️⃣ Массовые действия */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                3️⃣ Кнопки "Показать все" и "Скрыть все"
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В шапке выпадающего списка находятся две кнопки быстрого управления. Они позволяют мгновенно изменить 
                видимость всех колонок одновременно, не кликая на каждый чекбокс вручную.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Кнопка "Показать все"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Одним кликом <strong>включает все 12 колонок</strong>. Все чекбоксы становятся отмеченными, и таблица 
                показывает полный набор информации о товарах.
            </p>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>Когда полезно:</strong> Если вы скрыли несколько колонок для работы над описаниями, а теперь нужно 
                    проверить весь товар целиком перед публикацией — одна кнопка вернёт все колонки обратно.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Кнопка "Скрыть все"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Одним кликом <strong>отключает все 12 колонок</strong>. Все чекбоксы снимаются, таблица становится пустой 
                (показывается только структура без данных).
            </p>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Осторожно:</strong> Эта кнопка полезна скорее для сброса конфигурации, чем для ежедневной работы. 
                    Если скрыть все колонки, вы не сможете редактировать товары до тех пор, пока не включите хотя бы одну колонку обратно.
                </p>
            </div>

            <hr className="!my-10" />

            {/* 4️⃣ Сохранение настроек */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                4️⃣ Автоматическое сохранение настроек
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Как только вы изменяете видимость колонки (ставите или снимаете галочку), система <strong>мгновенно 
                сохраняет ваш выбор</strong>. Вам не нужно нажимать кнопку "Сохранить" — всё происходит автоматически.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сохранение для каждого проекта
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Настройки видимости колонок <strong>привязаны к конкретному проекту</strong>. Это значит:
            </p>

            <div className="not-prose bg-purple-50 rounded-lg p-6 my-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">🔵</div>
                        <div>
                            <p className="font-semibold text-gray-900">Проект "Магазин одежды"</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Вы скрыли колонки "Альбомы" и "Ссылка", оставили только название, цену и фото
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-2xl">🟢</div>
                        <div>
                            <p className="font-semibold text-gray-900">Проект "Кафе-пекарня"</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Здесь у вас включены все колонки — проект помнит свою конфигурацию независимо от первого
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы закроете браузер и откроете его через день, настройки останутся такими же — система запомнила 
                вашу конфигурацию для каждого проекта отдельно.
            </p>

            <hr className="!my-10" />

            {/* 5️⃣ Автоматический показ колонки "Новое фото" */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                5️⃣ Автоматический показ колонки "🆕 Новое фото"
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Колонка <strong>"🆕 Новое фото"</strong> работает особым образом — она <strong>скрыта по умолчанию</strong>, 
                потому что нужна не всегда. Но система умная: как только появляется <strong>хотя бы один товар с ожидающей 
                замены фотографией</strong>, эта колонка автоматически включается и показывается в таблице.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Как это работает на практике
            </h3>

            <div className="not-prose bg-indigo-50 rounded-lg p-6 my-6">
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">1</div>
                        <div>
                            <p className="font-semibold text-gray-900">Обычная работа</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Вы редактируете описания и цены товаров. Колонка "Новое фото" скрыта — она вам сейчас не нужна
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">2</div>
                        <div>
                            <p className="font-semibold text-gray-900">Появилась задача</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Заказчик прислал новые фотографии для 3 товаров. Вы загружаете их в систему
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">3</div>
                        <div>
                            <p className="font-semibold text-gray-900">Автоматический показ</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Колонка "🆕 Новое фото" <strong>сама появляется</strong> в таблице — теперь вы видите, какие 
                                товары ждут замены фотографий
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 text-xl font-bold text-indigo-600">4</div>
                        <div>
                            <p className="font-semibold text-gray-900">Завершение работы</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Вы применили все новые фото. Список ожидающих товаров стал пустым — можете снова скрыть колонку вручную
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Зачем это нужно:</strong> Колонка "Новое фото" занимает место в таблице, но используется редко. 
                    Автоматический показ избавляет вас от необходимости помнить о её включении — система сама покажет её, 
                    когда она действительно понадобится.
                </p>
            </div>

            <hr className="!my-10" />

            {/* 6️⃣ Практические примеры */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                6️⃣ Практические примеры использования
            </h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 1: Работа только с текстами
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Вам нужно проверить и отредактировать названия и описания всех товаров в каталоге.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-gray-900 mb-2">Было (без управления видимостью):</p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                        <li>Таблица показывает все 12 колонок одновременно</li>
                        <li>Нужные колонки "Название" и "Описание" разделены другими колонками</li>
                        <li>Приходится постоянно прокручивать таблицу влево-вправо</li>
                        <li>Неудобно читать длинные тексты в узких колонках</li>
                    </ul>
                </div>
                <div>
                    <p className="font-semibold text-green-700 mb-2">Стало (с управлением видимостью):</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Нажимаете кнопку "Колонки"</li>
                        <li>Снимаете галочки со всех колонок кроме "Название" и "Описание"</li>
                        <li>Таблица показывает только 2 колонки — они занимают весь экран</li>
                        <li>Можно спокойно редактировать тексты без прокрутки</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 2: Проверка цен перед акцией
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Завтра начинается распродажа, нужно проверить корректность цен и доступности всех товаров.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-green-700 mb-2">Решение:</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Оставляете видимыми только: "Название", "Цена", "Доступность", "Статус VK"</li>
                        <li>Получаете компактную таблицу с ключевой информацией</li>
                        <li>Видите сразу, какие товары недоступны или не опубликованы</li>
                        <li>После проверки возвращаете остальные колонки кнопкой "Показать все"</li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Сценарий 3: Массовая расстановка по альбомам
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Распределить 50 товаров по разным альбомам VK для удобной навигации покупателей.
            </p>

            <div className="not-prose bg-gray-50 rounded-lg p-6 my-6 space-y-4">
                <div>
                    <p className="font-semibold text-green-700 mb-2">Решение:</p>
                    <ul className="text-sm text-green-900 space-y-1 list-disc list-inside">
                        <li>Оставляете только: "Название", "Фотографии" (чтобы видеть товар), "Альбомы"</li>
                        <li>Таблица становится узкой и удобной</li>
                        <li>Быстро назначаете альбомы всем товарам</li>
                        <li>Не отвлекаетесь на лишнюю информацию</li>
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
                        <span className="text-indigo-600 font-bold text-lg">🎯</span>
                        <p className="text-gray-800">
                            <strong>Кнопка "Колонки"</strong> в правом верхнем углу таблицы открывает список управления
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">☑️</span>
                        <p className="text-gray-800">
                            <strong>Галочка стоит</strong> — колонка видна. <strong>Галочки нет</strong> — колонка скрыта
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">⚡</span>
                        <p className="text-gray-800">
                            <strong>Массовые действия:</strong> "Показать все" или "Скрыть все" — одна кнопка на все колонки
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">💾</span>
                        <p className="text-gray-800">
                            <strong>Автосохранение</strong> — настройки запоминаются мгновенно для каждого проекта отдельно
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🆕</span>
                        <p className="text-gray-800">
                            <strong>Колонка "Новое фото"</strong> появляется автоматически, когда есть товары с ожидающими замены фото
                        </p>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-indigo-600 font-bold text-lg">🔄</span>
                        <p className="text-gray-800">
                            <strong>Сброс настроек:</strong> Кнопка "Показать все" возвращает исходную конфигурацию
                        </p>
                    </li>
                </ul>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>💡 Совет:</strong> Не бойтесь экспериментировать! Скрывайте и показывайте колонки по мере необходимости — 
                    система запомнит вашу конфигурацию. Если что-то пойдёт не так, кнопка "Показать все" вернёт всё обратно.
                </p>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-3-2-2-column-visibility" />
        </article>
    );
};
