import React from 'react';
import { ContentProps, NavigationLink, NavigationButtons } from '../shared';

/**
 * Раздел 2.3.2. Таблица товаров
 * Краткое введение в таблицу товаров, структуру колонок и управление ими
 */
export const ProductsTableIntroPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Вводный блок */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Таблица товаров — это основной инструмент для работы с товарами сообщества. Здесь вы видите все товары проекта в виде удобной таблицы, где каждая строка — это отдельный товар.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В отличие от интерфейса VK, где товары отображаются плиткой и требуют перехода в отдельные формы редактирования, наша таблица позволяет:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700 space-y-2">
                    <li><strong>Видеть все данные сразу</strong> — название, цена, описание, подборка в одном экране</li>
                    <li><strong>Редактировать inline</strong> — кликнули на ячейку, изменили текст, нажали Enter</li>
                    <li><strong>Управлять колонками</strong> — скрывать ненужные поля, менять ширину</li>
                    <li><strong>Работать массово</strong> — выбрать несколько товаров и изменить параметры одновременно</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* Секция: Структура таблицы */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    📊 Структура таблицы
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Таблица состоит из <strong>12 колонок</strong>, каждая из которых отвечает за определенный параметр товара:
                </p>

                <div className="not-prose mt-6 space-y-4">
                    {/* Колонка 1: Действия */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                1
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Действия</h4>
                                <p className="text-sm text-gray-600">Кнопки для удаления, дублирования, перехода в VK. Ширина: 110px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 2: Фото */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                2
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Фото</h4>
                                <p className="text-sm text-gray-600">Текущее фото товара из VK. Миниатюра 60×60px. Ширина колонки: 80px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 3: New Фото */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">New Фото</h4>
                                <p className="text-sm text-gray-600">Новое фото для загрузки (если вы хотите заменить). Ширина: 80px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 4: Название */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                4
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Название</h4>
                                <p className="text-sm text-gray-600">Название товара. Редактируется inline. Ширина: 120px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 5: Описание */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                5
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Описание</h4>
                                <p className="text-sm text-gray-600">Полное описание товара. Самая широкая колонка: 300px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 6: Цена */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                6
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Цена</h4>
                                <p className="text-sm text-gray-600">Актуальная цена товара в рублях. Ширина: 80px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 7: Старая цена */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                7
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Старая цена</h4>
                                <p className="text-sm text-gray-600">Зачеркнутая цена для отображения скидки. Ширина: 120px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 8: Артикул */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                8
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Артикул (SKU)</h4>
                                <p className="text-sm text-gray-600">Уникальный код товара для учета. Ширина: 100px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 9: Подборка */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                9
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Подборка (Альбом)</h4>
                                <p className="text-sm text-gray-600">К какой подборке VK принадлежит товар. Ширина: 100px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 10: Категория */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                                10
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Категория (AI)</h4>
                                <p className="text-sm text-gray-600">Категория товара с возможностью генерации через AI. Ширина: 120px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 11: VK Link */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                11
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">VK</h4>
                                <p className="text-sm text-gray-600">Ссылка на товар в VK. Компактная кнопка. Ширина: 60px</p>
                            </div>
                        </div>
                    </div>

                    {/* Колонка 12: Рейтинг */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                                12
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-1">Рейтинг</h4>
                                <p className="text-sm text-gray-600">Оценка товара пользователями VK. Ширина: 80px</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Секция: Следующие шаги */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    🧭 Что дальше изучить?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700 !mb-6">
                    Чтобы полностью освоить работу с таблицей товаров, переходите к следующим разделам:
                </p>

                <div className="not-prose space-y-4">
                    <NavigationLink
                        to="2-3-2-1-columns"
                        title="Подробное описание каждой колонки"
                        description="Узнайте о возможностях редактирования, форматах данных и особенностях каждой колонки"
                    />
                    <NavigationLink
                        to="2-3-2-2-column-visibility"
                        title="Управление видимостью колонок"
                        description="Научитесь скрывать/показывать колонки и настраивать ширину для удобства работы"
                    />
                    <NavigationLink
                        to="2-3-2-3-sort-search"
                        title="Сортировка и поиск"
                        description="Как быстро находить нужные товары и упорядочивать список"
                    />
                </div>
            </section>

            {/* Навигация между разделами */}
            <NavigationButtons currentPath="2-3-2-products-table" />
        </article>
    );
};
