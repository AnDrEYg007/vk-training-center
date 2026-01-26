import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Продукты
// =====================================================================
export const Products: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел «Продукты» научит вас работать с каталогом товаров ВКонтакте: 
                привязывать товары к постам, отображать карточки продуктов и управлять 
                ассортиментом для рекламных публикаций.
            </p>

            <hr className="!my-10" />

            {/* Основные возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что входит в этот раздел</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-amber-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Каталог товаров</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Просмотр всех товаров сообщества</li>
                        <li>• Фильтрация по категориям</li>
                        <li>• Поиск по названию и артикулу</li>
                        <li>• Информация о цене и наличии</li>
                    </ul>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Привязка к постам</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Выбор товаров из каталога</li>
                        <li>• Множественная привязка</li>
                        <li>• Отвязка и замена товаров</li>
                        <li>• Предпросмотр карточек в посте</li>
                    </ul>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Отображение в публикациях</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Карточки товаров под постом</li>
                        <li>• Кнопка "Купить" для каждого товара</li>
                        <li>• Актуальная цена из VK</li>
                        <li>• Переход в каталог сообщества</li>
                    </ul>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Аналитика</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Какие товары чаще публикуются</li>
                        <li>• Количество постов с товарами</li>
                        <li>• История привязок</li>
                        <li>• Статистика по категориям</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Чему научитесь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чему вы научитесь</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-700 font-bold">
                        1
                    </div>
                    <div>
                        <p className="font-medium text-amber-800">Быстро находить нужный товар</p>
                        <p className="text-sm text-amber-700 mt-1">
                            Научитесь пользоваться фильтрами и поиском, чтобы за секунды 
                            находить товары из тысяч позиций каталога.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                        2
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Создавать рекламные посты с товарами</p>
                        <p className="text-sm text-green-700 mt-1">
                            Освоите привязку одного или нескольких товаров к публикации, 
                            чтобы подписчики могли сразу купить то, о чём идёт речь.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
                        3
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Управлять привязками</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Разберётесь, как добавлять, удалять и заменять товары в постах, 
                            даже если пост уже опубликован (с ограничениями VK API).
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold">
                        4
                    </div>
                    <div>
                        <p className="font-medium text-purple-800">Понимать ограничения VK</p>
                        <p className="text-sm text-purple-700 mt-1">
                            Узнаете, сколько товаров можно прикрепить к одному посту, 
                            какие типы публикаций поддерживают товары и как работают права доступа.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Когда это нужно */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда нужна работа с товарами</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Модуль «Продукты» особенно полезен, если:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Вы ведёте интернет-магазин</strong> — можно прямо из постов продавать товары</li>
                <li><strong>Делаете рекламные публикации</strong> — показываете продукт и даёте кнопку покупки</li>
                <li><strong>Анонсируете новинки</strong> — привязываете новый товар, чтобы сразу начать продажи</li>
                <li><strong>Проводите акции</strong> — создаёте пост с подборкой товаров по специальной цене</li>
            </ul>

            {/* Подсказка */}
            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-800">
                    <strong>Важно:</strong> Для работы с товарами у сообщества VK 
                    <span className="font-medium"> должен быть включён каталог товаров</span>. 
                    Если каталога нет, модуль будет недоступен.
                </p>
            </div>

            <NavigationButtons currentPath="0-3-2-products" />
        </article>
    );
};
