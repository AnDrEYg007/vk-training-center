import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

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
                        Пост, который уже опубликован на стене группы ВКонтакте. Имеет зелёную галочку в углу карточки. 
                        Такие посты можно копировать на другие даты, но нельзя редактировать или удалять напрямую — 
                        для этого нужно перейти в VK.
                    </p>
                </div>

                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50 rounded-r-lg">
                    <h4 className="font-bold text-blue-900 mb-1">🕒 Отложенный пост VK</h4>
                    <p className="text-sm text-gray-700">
                        Пост, запланированный через интерфейс ВКонтакте. Отображается в календаре со сплошной серой рамкой 
                        без иконки статуса. Его можно перенести на другую дату или удалить, но редактирование доступно только 
                        через VK.
                    </p>
                </div>

                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50 rounded-r-lg">
                    <h4 className="font-bold text-purple-900 mb-1">📝 Системный пост</h4>
                    <p className="text-sm text-gray-700">
                        Пост, созданный в приложении. Имеет <strong>пунктирную рамку</strong> и иконку статуса в углу. 
                        Это самый гибкий тип — можно редактировать, переносить, копировать, удалять и публиковать. 
                        Системные посты поддерживают автоматизации: конкурсы отзывов, AI-ленту и универсальные конкурсы.
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
                    'Обрати внимание на рамку, иконки и оверлеи',
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
                        {selectedType === 'published' && (
                            <div className="relative bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                                {/* Белый градиент-оверлей */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/60 rounded-lg pointer-events-none" />
                                
                                {/* Зелёная галочка */}
                                <div className="absolute top-2 left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center z-10">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                <div className="relative z-10">
                                    <div className="text-xs text-gray-500 mb-2">14:30</div>
                                    <div className="text-sm text-gray-800 mb-2">
                                        Опубликованный пост с примером текста. Имеет сплошную рамку и зелёную галочку.
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Новости</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedType === 'deferred' && (
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
                                <div className="text-xs text-gray-500 mb-2">16:00</div>
                                <div className="text-sm text-gray-800 mb-2">
                                    Отложенный пост VK с примером текста. Имеет сплошную серую рамку без иконок.
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Акции</span>
                                </div>
                            </div>
                        )}

                        {selectedType === 'system' && (
                            <div className="bg-white border-2 border-dashed border-gray-400 rounded-lg p-4 shadow-sm">
                                {/* Иконка статуса */}
                                <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <span className="text-sm">🕒</span>
                                </div>

                                <div className="text-xs text-gray-500 mb-2 ml-8">18:00</div>
                                <div className="text-sm text-gray-800 mb-2">
                                    Системный пост с примером текста. Имеет пунктирную рамку и иконку статуса.
                                </div>
                                <div className="flex gap-1">
                                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">Анонсы</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Легенда */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                        {selectedType === 'published' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности опубликованного поста:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Сплошная серая рамка (<code className="bg-gray-200 px-1 rounded">border-gray-200</code>)</li>
                                    <li>Белый градиент-оверлей сверху</li>
                                    <li>Зелёная галочка ✅ в левом верхнем углу</li>
                                    <li>Действия: Копировать, Просмотр на VK</li>
                                </ul>
                            </div>
                        )}
                        {selectedType === 'deferred' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности отложенного поста VK:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Сплошная серая рамка (<code className="bg-gray-200 px-1 rounded">border-gray-200</code>)</li>
                                    <li>Без иконок и оверлеев</li>
                                    <li>Действия: Перенести, Копировать, Удалить, Просмотр на VK</li>
                                </ul>
                            </div>
                        )}
                        {selectedType === 'system' && (
                            <div>
                                <p className="font-semibold text-gray-900 mb-1">Особенности системного поста:</p>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    <li>Пунктирная рамка (<code className="bg-gray-200 px-1 rounded">border-dashed border-gray-400</code>)</li>
                                    <li>Иконка статуса в левом верхнем углу (🕒 ⚙️ ⚠️ ❌)</li>
                                    <li>Действия: Опубликовать, Редактировать, Перенести, Копировать, Удалить</li>
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
                            <td className="px-4 py-3 text-sm text-gray-700">Сплошная + оверлей</td>
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
                            <td className="px-4 py-3 text-sm text-gray-700">❌ Только в VK</td>
                            <td className="px-4 py-3 text-sm text-gray-700">❌ Только в VK</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Перенос даты</td>
                            <td className="px-4 py-3 text-sm text-gray-700">❌ Только копирование</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                            <td className="px-4 py-3 text-sm text-gray-700">✅ Да</td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">Удаление</td>
                            <td className="px-4 py-3 text-sm text-gray-700">❌ Только в VK</td>
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
                        Почему опубликованные посты нельзя редактировать?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Опубликованные посты уже находятся на стене группы ВКонтакте. Приложение синхронизирует их 
                        для отображения в календаре, но не имеет прав редактировать контент, который уже опубликован. 
                        Для редактирования нужно перейти в VK.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-bold text-gray-900 cursor-pointer">
                        Как создать системный пост?
                    </summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нажми на кнопку «+» в верхней части колонки дня или используй горячую клавишу. 
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
                        Автоматизированные системные посты имеют цветную рамку и бейдж: конкурсы отзывов (фуксия), 
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
                        <span>Опубликованные и отложенные VK посты редактируются только через ВКонтакте</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Иконки в углу системных постов показывают статус публикации (🕒 ⚙️ ⚠️ ❌)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>Автоматизированные посты (конкурсы, AI) имеют цветные рамки и бейджи</span>
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
                            Опубликованные и отложенные VK посты служат для синхронизации с уже существующим контентом — 
                            они отображаются в календаре для полной картины, но редактировать их нужно через ВКонтакте.
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mt-3">
                            <strong>Обращай внимание на визуальные индикаторы.</strong> Пунктирная рамка + иконка статуса = 
                            системный пост, который можно редактировать прямо здесь. Сплошная рамка + галочка = опубликованный пост, 
                            который можно только копировать. Это позволяет мгновенно понимать, что можно делать с каждым постом.
                        </p>
                    </div>
                </div>
            </div>

            <NavigationButtons currentPath="2-1-4-posts-in-calendar" />
        </article>
    );
};
