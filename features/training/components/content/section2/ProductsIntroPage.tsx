import React from 'react';
import { ContentProps, NavigationLink, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Введение в раздел "Товары"
// =====================================================================
export const ProductsIntroPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел <strong>"Товары"</strong> предназначен для управления ассортиментом сообществ ВКонтакте. 
                Здесь вы работаете с каталогом товаров: редактируете описания и цены, управляете категориями, 
                загружаете новые позиции и синхронизируете изменения с VK.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Вместо редактирования товаров по одному через интерфейс VK, 
                    вы работаете с ними централизованно — можете изменить цены для десятков товаров за одно действие, 
                    загрузить ассортимент из Excel-таблицы или воспользоваться AI для автоматической категоризации.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Как было vs как стало */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как было vs как стало</h2>

            <div className="!my-6 grid grid-cols-2 gap-4 not-prose">
                {/* Было */}
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                    <h3 className="text-lg font-bold text-red-900 mb-3">❌ Было (через VK)</h3>
                    <ul className="space-y-2 text-sm text-red-800">
                        <li>• Заходить в каждое сообщество отдельно</li>
                        <li>• Открывать товары на сайте VK</li>
                        <li>• Редактировать по одному товару</li>
                        <li>• Вручную подбирать категории</li>
                        <li>• Нет возможности массового изменения цен</li>
                        <li>• Загрузка товаров только по одному</li>
                    </ul>
                </div>

                {/* Стало */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="text-lg font-bold text-green-900 mb-3">✅ Стало (в приложении)</h3>
                    <ul className="space-y-2 text-sm text-green-800">
                        <li>• Все товары проекта в одной таблице</li>
                        <li>• Редактирование прямо в таблице (inline)</li>
                        <li>• Массовое изменение — 100 товаров за раз</li>
                        <li>• AI подбирает категории автоматически</li>
                        <li>• Импорт из Excel/CSV с автоматическим сопоставлением</li>
                        <li>• Предпросмотр всех изменений перед сохранением</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Основные возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные возможности</h2>

            <div className="not-prose space-y-4 my-8">
                {/* Редактирование */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 mb-2">Inline-редактирование</h3>
                            <p className="text-sm text-gray-700">
                                Редактируйте названия, описания, цены прямо в таблице без открытия отдельных окон. 
                                Система автоматически отслеживает изменения и подсвечивает несохранённые правки.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Массовые операции */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900 mb-2">Массовое редактирование</h3>
                            <p className="text-sm text-gray-700">
                                Выберите несколько товаров и измените цены, категории или подборки одним действием. 
                                Идеально для обновления ассортимента или проведения акций.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Импорт/экспорт */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 mb-2">Импорт и экспорт</h3>
                            <p className="text-sm text-gray-700">
                                Загружайте товары из Excel или CSV — система автоматически распознаёт колонки и сопоставит данные. 
                                Экспортируйте каталог для работы в таблицах или передачи заказчику.
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI-помощник */}
                <div className="border-l-4 border-amber-400 pl-4 py-3 bg-amber-50">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900 mb-2">AI-помощник</h3>
                            <p className="text-sm text-gray-700">
                                Автоматический подбор категорий на основе названия и описания товара. 
                                AI анализирует контент и предлагает наиболее подходящие категории из каталога VK.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Основные сценарии работы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные сценарии работы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел "Товары" используется для решения следующих задач:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Актуализация каталога:</strong> Обновление цен, описаний и фотографий товаров без ручной правки каждой позиции в VK.</li>
                <li><strong>Загрузка нового ассортимента:</strong> Импорт товаров из таблиц, которые прислал заказчик или поставщик.</li>
                <li><strong>Проведение акций:</strong> Массовое изменение цен для группы товаров (например, скидка 20% на все товары из подборки "Новинки").</li>
                <li><strong>Оптимизация категорий:</strong> Автоматическая категоризация товаров с помощью AI для улучшения поиска в VK.</li>
                <li><strong>Контроль изменений:</strong> Предпросмотр всех правок перед отправкой в VK — исключает случайные ошибки.</li>
            </ul>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800">
                    <strong>Совет:</strong> Начните с раздела <strong>"Обзор интерфейса"</strong>, 
                    чтобы разобраться с основными элементами таблицы товаров. Затем переходите к практическим сценариям: 
                    импорт, массовое редактирование и работа с AI.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Навигация по разделу */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Изучите ключевые подразделы, чтобы освоить работу с товарами:
            </p>

            <div className="not-prose my-6 space-y-3">
                <NavigationLink 
                    to="2-3-1-overview"
                    title="2.3.1. Обзор интерфейса"
                    description="Подробное описание таблицы товаров, колонок и кнопок управления"
                    variant="next"
                />
                <NavigationLink 
                    to="2-3-6-import-export"
                    title="2.3.6. Импорт и экспорт"
                    description="Загрузка товаров из Excel/CSV и выгрузка каталога"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-7-bulk-edit"
                    title="2.3.7. Массовое редактирование"
                    description="Изменение цен, категорий и подборок для множества товаров"
                    variant="related"
                />
                <NavigationLink 
                    to="2-3-8-ai-category"
                    title="2.3.8. AI-предложения категорий"
                    description="Автоматический подбор категорий с помощью искусственного интеллекта"
                    variant="related"
                />
            </div>

            <NavigationButtons currentPath="2-3-products" />
        </article>
    );
};
