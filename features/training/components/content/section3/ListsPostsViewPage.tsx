import React from 'react';
import { Sandbox } from '../shared';
import {
    PostsTableAnatomy,
    PostsTableDemo,
    PostsTableStatesDemo,
    PostsSearchDemo,
    PostsInfiniteScrollDemo
} from './ListsMocks';

export const ListsPostsViewPage: React.FC = () => {
    return (
        <div className="prose max-w-none">
            <h1>3.2.4. Просмотр постов</h1>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-purple-900 mt-0 mb-3">Что это за таблица?</h2>
                <p className="text-purple-800 mb-3">
                    Таблица постов показывает <strong>историю всех опубликованных записей</strong> в выбранном списке ВКонтакте. 
                    Это архив для анализа: какие посты получили больше лайков, какие репостили, сколько просмотров собрал каждый.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold text-lg">✕</span>
                            </div>
                            <span className="font-bold text-gray-700">Раньше</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-0">
                            SMM-щик сидел в ВК, листал ленту группы, вручную считал лайки и комментарии в Excel.
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-bold text-lg">✓</span>
                            </div>
                            <span className="font-bold text-gray-700">Сейчас</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-0">
                            Все посты автоматически собираются, статистика обновляется, можно сортировать и искать.
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 1: АНАТОМИЯ ТАБЛИЦЫ */}
            {/* ============================================ */}
            <h2>1. Анатомия таблицы постов</h2>
            <p>
                Таблица состоит из <strong>4 ключевых зон</strong>: панель поиска, заголовки колонок, строки с данными 
                и индикатор загрузки. Каждая зона выполняет свою функцию.
            </p>

            <Sandbox>
                <PostsTableAnatomy />
            </Sandbox>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 mb-2"><strong>Объяснение зон:</strong></p>
                <ul className="text-sm text-blue-800 mb-0 space-y-1">
                    <li><strong className="text-blue-600">Зона 1:</strong> Поиск по тексту + кнопка обновления списка</li>
                    <li><strong className="text-green-600">Зона 2:</strong> Заголовки колонок таблицы (липкие при прокрутке)</li>
                    <li><strong className="text-purple-600">Зона 3:</strong> Строки с данными постов (прокручиваются)</li>
                    <li><strong className="text-indigo-600">Зона 4:</strong> Индикатор автоматической загрузки следующих постов</li>
                </ul>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 2: СТРУКТУРА КОЛОНОК */}
            {/* ============================================ */}
            <h2>2. Колонки таблицы</h2>
            <p>
                В таблице <strong>9 колонок</strong>, каждая с фиксированной шириной. Заголовки "прилипают" к верху 
                при прокрутке, чтобы всегда видеть, что в каком столбце.
            </p>

            <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">№</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Название</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Ширина</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Что показывает</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">1</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Медиа</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">60px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Превью изображения поста (40×40px)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">2</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Текст</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">250px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Текст поста (обрезается, если длинный)</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">3</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Лайки</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">80px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Иконка сердца + количество лайков</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">4</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Комментарии</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">80px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Иконка чата + количество комментариев</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">5</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Репосты</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">80px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Иконка стрелок + количество репостов</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">6</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Просмотры</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">80px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Иконка глаза + количество просмотров</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">7</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Публ.</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">140px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Дата и время публикации поста</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">8</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Собрано</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">140px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Когда последний раз обновлялась статистика</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">9</td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">Ссылка</td>
                        <td className="border border-gray-300 px-4 py-2"><code className="bg-gray-100 px-2 py-1 rounded text-xs">60px</code></td>
                        <td className="border border-gray-300 px-4 py-2">Кнопка для открытия поста в ВК</td>
                    </tr>
                </tbody>
            </table>

            {/* ============================================ */}
            {/* РАЗДЕЛ 3: СТРУКТУРА ДАННЫХ */}
            {/* ============================================ */}
            <h2>3. Структура данных поста</h2>
            <p>
                Каждый пост в таблице — это объект с <strong>11 полями</strong>. Данные приходят из ВКонтакте и 
                хранятся в базе данных.
            </p>

            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono">
                <pre className="mb-0">{`interface SystemListPost {
    id: string;                   // Уникальный ID записи в БД
    vk_id: number;                // ID поста в ВК (wall-123456_789)
    date: number;                 // Unix timestamp публикации
    text: string;                 // Текст поста
    image_url?: string;           // Ссылка на превью (опционально)
    likes_count: number;          // Количество лайков
    comments_count: number;       // Количество комментариев
    reposts_count: number;        // Количество репостов
    views_count: number;          // Количество просмотров
    user_likes: number;           // 1 если пользователь лайкнул, 0 если нет
    last_updated: string;         // ISO дата обновления статистики
    vk_link: string;              // Прямая ссылка на пост
}`}</pre>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 mb-2">
                    <strong>🔍 Важный нюанс:</strong> Поле <code className="bg-amber-100 px-2 py-1 rounded text-xs">user_likes</code> 
                    показывает, лайкнул ли <strong>текущий пользователь системы</strong> этот пост (не клиент, а администратор). 
                    Если <code className="bg-amber-100 px-2 py-1 rounded text-xs">user_likes = 1</code>, счётчик лайков 
                    подсвечивается <span className="text-red-500 font-bold">красным</span>.
                </p>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 4: СЧЁТЧИКИ АКТИВНОСТИ */}
            {/* ============================================ */}
            <h2>4. Счётчики активности</h2>
            <p>
                В таблице <strong>4 типа счётчиков</strong>: лайки, комментарии, репосты и просмотры. Каждый 
                счётчик имеет свою иконку и цвет.
            </p>

            <div className="grid grid-cols-2 gap-4 my-6">
                {/* Лайки */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-gray-700">Лайки</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                        <strong className="text-red-500">Красный цвет</strong> если текущий пользователь лайкнул пост 
                        (<code className="bg-gray-100 px-2 py-1 rounded text-xs">user_likes = 1</code>), 
                        иначе серый.
                    </p>
                </div>

                {/* Комментарии */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-gray-700">Комментарии</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                        Иконка чата. Цвет всегда <strong className="text-gray-700">серый</strong>.
                    </p>
                </div>

                {/* Репосты */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                        </svg>
                        <span className="font-bold text-gray-700">Репосты</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                        Иконка связанных кругов. Цвет всегда <strong className="text-gray-700">серый</strong>.
                    </p>
                </div>

                {/* Просмотры */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-bold text-gray-700">Просмотры</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-0">
                        Иконка глаза. Цвет <strong className="text-gray-500">светло-серый</strong> 
                        (просмотры — вторичная метрика).
                    </p>
                </div>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 5: ПОЛНАЯ ТАБЛИЦА С ДАННЫМИ */}
            {/* ============================================ */}
            <h2>5. Полная таблица с данными</h2>
            <p>
                Вот как выглядит таблица с реальными постами. Попробуйте:
            </p>
            <ul>
                <li>Навести мышку на строку — она подсветится</li>
                <li>Кликнуть на превью изображения — откроется увеличенная версия</li>
                <li>Кликнуть на кнопку со стрелкой — откроется пост в ВК</li>
            </ul>

            <Sandbox>
                <PostsTableDemo />
            </Sandbox>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 mb-0">
                    <strong>💡 Обратите внимание:</strong> Посты с лайком текущего пользователя (красные цифры) 
                    выделяются, чтобы SMM-щик видел, какие посты он уже оценил.
                </p>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 6: СОСТОЯНИЯ ТАБЛИЦЫ */}
            {/* ============================================ */}
            <h2>6. Состояния таблицы</h2>
            <p>
                Таблица может находиться в <strong>3 состояниях</strong>: загрузка данных, пустой список 
                (нет постов) и отображение данных. Переключайте состояния кнопками ниже:
            </p>

            <Sandbox>
                <PostsTableStatesDemo />
            </Sandbox>

            <table className="min-w-full border border-gray-300 text-sm mt-6">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">Состояние</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Когда появляется</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Что видит пользователь</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Загрузка</td>
                        <td className="border border-gray-300 px-4 py-2">При первом открытии списка или обновлении</td>
                        <td className="border border-gray-300 px-4 py-2">Крутящийся индикатор + текст "Загрузка постов..."</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">Пустой список</td>
                        <td className="border border-gray-300 px-4 py-2">Если в списке ещё нет ни одного поста</td>
                        <td className="border border-gray-300 px-4 py-2">Серая иконка документа + текст "Список пуст"</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-medium">С данными</td>
                        <td className="border border-gray-300 px-4 py-2">Когда данные успешно загружены</td>
                        <td className="border border-gray-300 px-4 py-2">Таблица с постами, всеми колонками и счётчиками</td>
                    </tr>
                </tbody>
            </table>

            {/* ============================================ */}
            {/* РАЗДЕЛ 7: ПОИСК ПО ТЕКСТУ */}
            {/* ============================================ */}
            <h2>7. Поиск по тексту</h2>
            <p>
                В верхней панели есть поле поиска. Оно ищет <strong>мгновенно по мере набора текста</strong> 
                (не нужно нажимать Enter). Поиск идёт по тексту поста, регистр не важен.
            </p>

            <Sandbox>
                <PostsSearchDemo />
            </Sandbox>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 mb-2"><strong>Как работает поиск:</strong></p>
                <ul className="text-sm text-blue-800 mb-0 space-y-1">
                    <li>Начинаете вводить текст → таблица сразу фильтруется</li>
                    <li>Счётчик результатов обновляется: "Найдено постов: 2 из 5"</li>
                    <li>Если ничего не найдено → показывается сообщение "Постов с таким текстом не найдено"</li>
                    <li>Поиск <strong>не чувствителен к регистру</strong> ("скидки" = "СКИДКИ")</li>
                </ul>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 8: КНОПКА ОБНОВЛЕНИЯ */}
            {/* ============================================ */}
            <h2>8. Кнопка обновления</h2>
            <p>
                Справа от поля поиска находится <strong>кнопка обновления списка постов</strong>. При клике 
                она отправляет запрос к API ВКонтакте, чтобы получить свежие данные по статистике.
            </p>

            <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm font-bold text-gray-700 mb-2">Обычное состояние</div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-9 w-12 bg-white border border-gray-300 rounded-md text-gray-600">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <span className="text-sm text-gray-600">Иконка стрелок обновления</span>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm font-bold text-gray-700 mb-2">Во время загрузки</div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-9 w-12 bg-gray-100 border border-gray-300 rounded-md text-gray-400 opacity-50">
                            <div className="h-4 w-4 border-2 border-gray-400 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                        <span className="text-sm text-gray-600">Крутящийся индикатор</span>
                    </div>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 mb-0">
                    <strong>⚠️ Важно:</strong> Во время обновления кнопка становится <strong>неактивной</strong> 
                    (полупрозрачной), чтобы пользователь не мог запустить несколько обновлений одновременно.
                </p>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 9: ФОРМАТИРОВАНИЕ ДАТ */}
            {/* ============================================ */}
            <h2>9. Форматирование дат</h2>
            <p>
                В таблице две даты: <strong>"Публ."</strong> (когда пост был опубликован в ВК) и 
                <strong>"Собрано"</strong> (когда последний раз обновлялась статистика). Обе даты 
                отображаются в формате <code className="bg-gray-100 px-2 py-1 rounded text-xs">ДД.МM.ГГГГ, ЧЧ:ММ</code>.
            </p>

            <div className="bg-white border border-gray-200 rounded-lg p-4 my-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-bold text-gray-700 mb-2">Пример даты публикации:</div>
                        <div className="bg-gray-50 rounded px-3 py-2 text-sm font-mono text-gray-800">
                            15.02.2024, 14:23
                        </div>
                        <p className="text-xs text-gray-500 mt-2 mb-0">
                            Читается как: 15 февраля 2024 года в 14:23
                        </p>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-700 mb-2">Исходный формат в БД:</div>
                        <div className="bg-gray-50 rounded px-3 py-2 text-sm font-mono text-gray-800">
                            1708828800 <span className="text-gray-400">(Unix timestamp)</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 mb-0">
                            Преобразуется в читаемый формат на клиенте
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 10: ПРЕВЬЮ ИЗОБРАЖЕНИЯ */}
            {/* ============================================ */}
            <h2>10. Превью изображения и модальное окно</h2>
            <p>
                В колонке "Медиа" показывается <strong>уменьшенное изображение поста (40×40 пикселей)</strong>. 
                При наведении мышки превью слегка увеличивается. При клике — открывается полноразмерное изображение 
                в модальном окне.
            </p>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800 mb-2"><strong>Механика модального окна:</strong></p>
                <ul className="text-sm text-indigo-800 mb-0 space-y-1">
                    <li>Окно открывается <strong>поверх всего интерфейса</strong> (z-index 100)</li>
                    <li>Фон затемняется чёрным полупрозрачным слоем (80% непрозрачности)</li>
                    <li>Изображение масштабируется: максимум 85% высоты экрана</li>
                    <li><strong>3 способа закрыть окно:</strong> кнопка ✕ в углу, клик вне изображения, клавиша ESC</li>
                </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 my-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">Превью в таблице (40×40px):</p>
                    <div className="inline-block w-10 h-10 rounded overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                        <img src="https://picsum.photos/seed/demo/400/400" alt="Превью" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs text-gray-500 mt-3 mb-0">
                        При наведении изображение увеличивается на 110%
                    </p>
                </div>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 11: БЕСКОНЕЧНАЯ ПРОКРУТКА */}
            {/* ============================================ */}
            <h2>11. Бесконечная прокрутка</h2>
            <p>
                Таблица загружает посты <strong>порциями по 50 записей</strong>. Когда пользователь прокручивает 
                таблицу до конца, автоматически подгружается следующая порция. Это называется 
                <strong>"бесконечная прокрутка" (infinite scroll)</strong>.
            </p>

            <Sandbox>
                <PostsInfiniteScrollDemo />
            </Sandbox>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 mb-2"><strong>Как работает механика:</strong></p>
                <ol className="text-sm text-blue-800 mb-0 space-y-1 list-decimal list-inside">
                    <li>Таблица загружает первые 50 постов</li>
                    <li>В конце таблицы появляется <strong>невидимый триггер</strong> (IntersectionObserver)</li>
                    <li>Когда триггер попадает в область видимости — запускается загрузка следующих 50 постов</li>
                    <li>Во время загрузки показывается индикатор "Загрузка..."</li>
                    <li>Новые посты добавляются в конец таблицы</li>
                    <li>Процесс повторяется, пока не закончатся все посты</li>
                </ol>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 12: ССЫЛКА НА VK */}
            {/* ============================================ */}
            <h2>12. Ссылка на VK</h2>
            <p>
                В последней колонке таблицы есть кнопка со стрелкой — <strong>прямая ссылка на пост ВКонтакте</strong>. 
                При клике пост открывается в новой вкладке браузера.
            </p>

            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg p-4 my-6">
                <a 
                    href="https://vk.com/wall-123456_12345" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-center w-8 h-8 border border-gray-300 text-gray-400 rounded-md hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
                <div>
                    <div className="text-sm font-medium text-gray-700">Кнопка "Открыть в VK"</div>
                    <div className="text-xs text-gray-500">При наведении становится синей</div>
                </div>
            </div>

            {/* ============================================ */}
            {/* РАЗДЕЛ 13: ОТЛИЧИЕ ОТ КАЛЕНДАРЯ */}
            {/* ============================================ */}
            <h2>13. Отличие от календаря постов</h2>
            <p>
                Важно понимать разницу между <strong>таблицей постов</strong> и <strong>календарём постов</strong>:
            </p>

            <div className="grid grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-bold text-purple-900">Таблица постов</span>
                    </div>
                    <p className="text-sm text-purple-800 mb-2"><strong>Назначение:</strong></p>
                    <ul className="text-sm text-purple-800 mb-0 space-y-1 list-disc list-inside">
                        <li>Анализ уже опубликованных постов</li>
                        <li>Просмотр статистики (лайки, репосты, просмотры)</li>
                        <li>Поиск и фильтрация постов по тексту</li>
                        <li>История публикаций</li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-bold text-green-900">Календарь постов</span>
                    </div>
                    <p className="text-sm text-green-800 mb-2"><strong>Назначение:</strong></p>
                    <ul className="text-sm text-green-800 mb-0 space-y-1 list-disc list-inside">
                        <li>Создание новых постов</li>
                        <li>Планирование будущих публикаций</li>
                        <li>Редактирование черновиков</li>
                        <li>Отложенный постинг по расписанию</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-800 mt-0 mb-3">Резюме: когда использовать таблицу постов</h3>
                <ul className="text-gray-700 space-y-2 mb-0">
                    <li>✅ Хотите проанализировать, какие посты получили больше всего лайков</li>
                    <li>✅ Нужно найти пост по фрагменту текста</li>
                    <li>✅ Проверяете, когда последний раз обновлялась статистика</li>
                    <li>✅ Хотите быстро открыть пост в ВК для редактирования</li>
                    <li>❌ Хотите создать новый пост — идите в <strong>Календарь</strong></li>
                    <li>❌ Хотите отредактировать запланированный пост — идите в <strong>Календарь</strong></li>
                </ul>
            </div>
        </div>
    );
};
