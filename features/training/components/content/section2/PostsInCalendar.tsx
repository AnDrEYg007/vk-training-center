import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockPublishedPost, MockDeferredPost, MockSystemPost } from './PostsInCalendarMocks';

// =====================================================================
// 2.1.4. Посты в календаре — обзорная страница
// =====================================================================
export const PostsInCalendar: React.FC<ContentProps> = ({ title }) => {
    const [selectedType, setSelectedType] = useState<'published' | 'deferred' | 'system'>('published');

    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Посты — это основной контент, который ты планируешь и публикуешь в группах ВКонтакте. 
                В календаре они отображаются в виде карточек с текстом, изображениями и временем публикации. 
                Каждый пост имеет свой тип, который определяет, как с ним работать и какие действия доступны.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Главная идея:</strong> В приложении существует три типа постов: опубликованные 
                    (уже на стене VK), отложенные VK (запланированы через VK) и системные (созданы в приложении). 
                    Каждый тип имеет уникальное визуальное оформление и набор доступных действий.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Три типа постов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Три типа постов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Приложение работает с тремя типами постов, каждый из которых имеет свои особенности:
            </p>

            <div className="not-prose space-y-4 my-6">
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50 rounded-r-lg">
                    <h4 className="font-bold text-green-900 mb-1">✅ Опубликованный пост</h4>
                    <p className="text-sm text-gray-700">
                        Пост, который уже опубликован на стене группы ВКонтакте. Имеет зелёную галочку в углу карточки 
                        и полупрозрачное затенение. Такие посты можно редактировать, удалять и копировать через приложение — 
                        изменения применяются к оригиналу на стене через VK API.
                    </p>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <h4 className="font-bold text-blue-900 mb-1">🕒 Отложенный пост VK</h4>
                    <p className="text-sm text-gray-700">
                        Пост, запланированный через интерфейс ВКонтакте. Отображается в календаре со сплошной серой рамкой 
                        без иконки статуса. Его можно редактировать, опубликовать сейчас, копировать, удалить или посмотреть на VK. 
                        Перенос даты происходит через перетаскивание на другую ячейку календаря.
                    </p>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <h4 className="font-bold text-purple-900 mb-1">📝 Системный пост</h4>
                    <p className="text-sm text-gray-700">
                        Пост, созданный в приложении. Имеет <strong>пунктирную рамку</strong> и иконку статуса в углу. 
                        Это самый гибкий тип — можно редактировать, опубликовать, переместить в отложенные VK, копировать и удалять. 
                        Перенос на другую дату — через перетаскивание. Системные посты поддерживают автоматизации: конкурсы отзывов, AI-ленту и универсальные конкурсы.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Визуальные различия */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как отличить типы постов визуально?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый тип поста имеет уникальное оформление, которое помогает мгновенно определить его статус:
            </p>

            <Sandbox
                title="Сравнение типов постов"
                description="Переключайся между типами постов, чтобы увидеть различия в визуальном оформлении."
                instructions={[
                    'Нажми на один из типов постов ниже',
                    'Обрати внимание на рамку, иконки и затенение',
                    'Попробуй переключиться между всеми тремя типами'
                ]}
            >
                <div className="space-y-4">
                    {/* Переключатель типов */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedType('published')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                selectedType === 'published'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-pressed={selectedType === 'published'}
                        >
                            ✅ Опубликованный
                        </button>
                        <button
                            onClick={() => setSelectedType('deferred')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                selectedType === 'deferred'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-pressed={selectedType === 'deferred'}
                        >
                            🕒 Отложенный VK
                        </button>
                        <button
                            onClick={() => setSelectedType('system')}
                            className={`px-4 py-2 rounded-md font-medium transition ${
                                selectedType === 'system'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            aria-pressed={selectedType === 'system'}
                        >
                            📝 Системный
                        </button>
                    </div>

                    {/* Mock-карточки постов */}
                    <div className="relative">
                        {selectedType === 'published' && <MockPublishedPost />}
                        {selectedType === 'deferred' && <MockDeferredPost />}
                        {selectedType === 'system' && <MockSystemPost />}
                    </div>

                    {/* Легенда */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                        {selectedType === 'published' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности опубликованного поста:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Сплошная серая рамка</li>
                                    <li>Белое затенение слева направо</li>
                                    <li>Зелёная галочка ✅ в левом верхнем углу</li>
                                    <li>Действия: Редактировать, Удалить, Копировать, Посмотреть на VK</li>
                                </ul>
                            </div>
                        )}
                        {selectedType === 'deferred' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности отложенного поста VK:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Сплошная серая рамка</li>
                                    <li>Без иконок и затенения</li>
                                    <li>Действия: Опубликовать, Редактировать, Копировать, Удалить, Посмотреть на VK</li>
                                    <li>Перенос даты: через перетаскивание на другую ячейку</li>
                                </ul>
                            </div>
                        )}
                        {selectedType === 'system' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности системного поста:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Пунктирная рамка</li>
                                    <li>Иконка статуса в левом верхнем углу (🕒 ⚙️ ⚠️ ❌)</li>
                                    <li>Действия: Опубликовать, Редактировать, В отложку VK, Копировать, Удалить</li>
                                    <li>Перенос даты: через перетаскивание на другую ячейку</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Таблица сравнения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравнительная таблица</h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Характеристика
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Опубликованный
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Отложенный VK
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                Системный
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Рамка</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Сплошная + затенение</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Сплошная серая</td>
                            <td className="px-4 py-3 text-sm text-gray-700">Пунктирная</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Иконка</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Зелёная галочка</td>
                            <td className="px-4 py-3 text-sm text-gray-700">—</td>
                            <td className="px-4 py-3 text-sm text-gray-700">🕒 ⚙️ ⚠️ ❌</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Редактирование</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Перенос даты</td>
                            <td className="px-4 py-3 text-sm text-gray-700">❌ Только копирование</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Перетаскивание</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Перетаскивание</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Удаление</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Автоматизации</td>
                            <td className="px-4 py-3 text-sm text-gray-700">—</td>
                            <td className="px-4 py-3 text-sm text-gray-700">—</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да (конкурсы, AI)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <hr className="!my-10" />

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли редактировать опубликованные посты?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Да, опубликованные посты можно редактировать и удалять прямо через приложение. Изменения применяются 
                        к оригинальному посту на стене ВКонтакте через метод API <code>wall.edit</code>. После сохранения 
                        обновлённая версия сразу появится на стене сообщества и в календаре приложения.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как создать системный пост?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нажми на кнопку «+» в верхней части колонки дня. 
                        В открывшейся форме заполни текст, добавь изображения и выбери теги. Системный пост 
                        автоматически сохранится в приложении с пунктирной рамкой.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Можно ли перенести опубликованный пост на другую дату?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Опубликованный пост уже находится на стене и имеет фиксированную дату публикации. 
                        Однако ты можешь <strong>скопировать</strong> его на другую дату — будет создан новый 
                        системный пост с тем же контентом, который можно запланировать на нужное время.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Что означает пунктирная рамка?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Пунктирная рамка — это визуальный индикатор системного поста, созданного в приложении. 
                        Такая рамка означает, что пост ещё не опубликован в VK и находится в состоянии черновика 
                        или запланирован к публикации. После публикации пост станет опубликованным (сплошная рамка + галочка).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Что за иконки в углу системных постов?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Иконки показывают статус системного поста: 🕒 — ожидает публикации, ⚙️ — публикуется 
                        (редактирование заблокировано), ⚠️ — возможная ошибка (сервер не подтвердил), 
                        ❌ — ошибка публикации. Это помогает отслеживать процесс публикации в реальном времени.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Чем отличаются автоматизированные посты?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Автоматизированные системные посты имеют цветную рамку и метку типа автоматизации: конкурсы отзывов (фуксия), 
                        AI-лента (индиго), универсальные конкурсы (голубой/оранжевый). Они создаются автоматически 
                        по заданным правилам и отличаются визуально от обычных системных постов.
                    </p>
                </details>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Три типа постов: опубликованные (✅ сплошная рамка), отложенные VK (серая рамка), системные (пунктир)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Системные посты — самые гибкие: можно редактировать, переносить, публиковать</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Все типы постов (опубликованные, отложенные VK, системные) можно редактировать и удалять через приложение</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Иконки в углу системных постов показывают статус публикации (🕒 ⚙️ ⚠️ ❌)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Автоматизированные посты (конкурсы, AI) имеют цветные рамки и метки типа</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Опубликованные посты можно копировать, но не переносить</span>
                    </li>
                </ul>
            </div>

            {/* Совет эксперта */}
            <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">💡</div>
                    <div>
                        <h3 className="font-bold text-indigo-900 text-lg mb-2">Совет эксперта</h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            <strong>Используй системные посты для основного планирования контента.</strong> Создавай 
                            черновики системных постов заранее, редактируй и совершенствуй их, а затем публикуй в нужное время. 
                            Опубликованные и отложенные VK посты тоже можно редактировать — изменения применяются 
                            к оригиналу на стене через VK API.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mt-3">
                            <strong>Обращай внимание на визуальные индикаторы.</strong> Пунктирная рамка + иконка статуса = 
                            системный пост, созданный в приложении. Сплошная рамка + галочка = опубликованный пост 
                            со стены ВКонтакте. Сплошная рамка без иконок = отложенный пост VK. Это позволяет мгновенно понимать 
                            происхождение каждого поста в календаре.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="2-1-4-posts-in-calendar" />
        </article>
    );
};
