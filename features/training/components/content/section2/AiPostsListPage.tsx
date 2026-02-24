import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockAiPostCard } from './AiPostsMocks';

// Mock данные для демонстрации
const mockPosts = [
    {
        id: '1',
        title: 'Посты про меню',
        description: 'Автоматическая публикация блюд из меню',
        isActive: true,
        nextRun: '20.02.26, 12:00',
        recurrenceType: 'days',
        recurrenceInterval: 2,
        systemPrompt: 'Ты — копирайтер ресторана. Пиши аппетитные описания блюд.',
        userPrompt: 'Создай пост про блюдо из меню с эмоджи и призывом к действию',
        generatedText: '🍝 Карбонара — классика итальянской кухни! 😋\n\nНежная паста с беконом, яйцом и сыром пармезан. Готовится по традиционному рецепту.\n\n💰 Цена: 450 ₽\n📍 Закажи прямо сейчас!',
        images: [
            'https://picsum.photos/seed/pasta1/400/300',
            'https://picsum.photos/seed/pasta2/400/300',
            'https://picsum.photos/seed/pasta3/400/300',
        ],
        mediaMode: 'subset' as const,
        mediaCount: 1,
        mediaType: 'random' as const,
    },
    {
        id: '2',
        title: 'Акции и скидки',
        description: 'Посты про текущие акции',
        isActive: true,
        nextRun: '21.02.26, 10:00',
        recurrenceType: 'weeks',
        recurrenceInterval: 1,
        systemPrompt: 'Ты — маркетолог. Пиши продающие тексты про акции.',
        userPrompt: 'Напиши пост про еженедельную акцию с призывом воспользоваться',
        generatedText: '🔥 АКЦИЯ НЕДЕЛИ! 🔥\n\n-30% на все пиццы при заказе через приложение!\n\nУспей заказать до воскресенья! 🍕\n\n👉 Переходи в приложение и выбирай любимую пиццу со скидкой!',
        images: ['https://picsum.photos/seed/promo1/400/300'],
        mediaMode: 'all' as const,
    },
    {
        id: '3',
        title: 'Утреннее меню',
        description: '',
        isActive: false,
        nextRun: '22.02.26, 08:00',
        recurrenceType: 'days',
        recurrenceInterval: 1,
        systemPrompt: 'Ты — SMM-специалист кафе. Пиши посты про завтраки.',
        userPrompt: 'Создай пост про утреннее меню с позитивным настроением',
        generatedText: '☀️ Доброе утро! Начни день с вкусного завтрака!\n\nСегодня в меню:\n🥐 Круассаны\n🍳 Омлеты\n☕ Ароматный кофе\n\nЖдём тебя с 8:00 до 11:00!',
        images: [],
        mediaMode: 'all' as const,
    },
];

// =====================================================================
// СТРАНИЦА: Список AI-постов (2.4.5.2)
// =====================================================================

export const AiPostsListPage: React.FC<ContentProps> = ({ title }) => {
    const [showFullList, setShowFullList] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            {/* ВСТУПЛЕНИЕ */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    После перехода в раздел <strong>Автоматизации → AI посты</strong> вы попадаете на страницу со списком всех созданных автоматизаций.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Здесь вы видите все AI-посты текущего проекта: активные, на паузе, с ближайшим временем запуска и настройками генерации.
                </p>
            </section>

            <hr className="!my-10" />

            {/* СТРУКТУРА СТРАНИЦЫ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура страницы</h2>
                
                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Шапка страницы</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В верхней части расположены:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Заголовок</strong> — "AI Автопубликация"</li>
                    <li><strong>Описание</strong> — "Циклические посты с автоматической генерацией контента"</li>
                    <li><strong>Кнопка "Создать автоматизацию"</strong> — открывает редактор для нового AI-поста</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сетка карточек</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Все AI-посты отображаются в виде карточек в адаптивной сетке:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>На широких экранах — 3 карточки в ряд</li>
                    <li>На средних экранах — 2 карточки в ряд</li>
                    <li>На узких экранах — 1 карточка</li>
                </ul>

                <Sandbox 
                    title="Интерактивная демонстрация: Страница со списком AI-постов"
                    description="Полноэкранный интерфейс управления автоматизациями"
                    instructions={[
                        'Нажмите кнопку ниже, чтобы открыть полную страницу',
                        'Обратите внимание на структуру: шапка с кнопкой создания и сетка карточек',
                        'Посмотрите на различия между активными постами и постами на паузе'
                    ]}
                >
                    <div className="flex justify-center">
                        <button 
                            onClick={() => setShowFullList(true)}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            Открыть страницу списка
                        </button>
                    </div>

                    {showFullList && (
                        <div className="fixed inset-0 bg-white z-50 flex flex-col">
                            <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm flex-shrink-0">
                                <div>
                                    <h2 className="text-lg font-bold text-indigo-900">AI Автопубликация</h2>
                                    <p className="text-xs text-indigo-700">Циклические посты с автоматической генерацией контента</p>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setShowFullList(false)}
                                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    >
                                        Закрыть демо
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Создать автоматизацию
                                    </button>
                                </div>
                            </header>

                            <main className="p-6 overflow-y-auto custom-scrollbar flex-grow bg-gray-50">
                                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-w-7xl mx-auto">
                                    {mockPosts.map(post => (
                                        <div 
                                            key={post.id}
                                            onMouseEnter={() => setHoveredCard(post.id)}
                                            onMouseLeave={() => setHoveredCard(null)}
                                        >
                                            <MockAiPostCard 
                                                post={post}
                                                onEdit={() => {}}
                                                onDelete={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </main>
                        </div>
                    )}
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* КАРТОЧКА AI-ПОСТА */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Карточка AI-поста</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Каждая карточка содержит всю ключевую информацию об автоматизации и позволяет быстро оценить её состояние.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Заголовок и статус</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Название автоматизации</strong> — крупным текстом в верхней части</li>
                    <li><strong>Описание</strong> — мелким серым текстом под названием (если указано)</li>
                    <li><strong>Бейдж статуса</strong> — справа вверху:
                        <ul>
                            <li><strong className="text-green-700">Активно</strong> — зелёный бейдж, автоматизация работает</li>
                            <li><strong className="text-gray-600">Пауза</strong> — серый бейдж, публикации приостановлены</li>
                        </ul>
                    </li>
                </ul>

                <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Подсказка:</strong> Карточки на паузе имеют слегка затемнённый фон и серый цвет текста — так легко отличить неактивные автоматизации.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Информация о запуске</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Под заголовком находится блок с двумя важными данными:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>След. запуск</strong> — дата и время следующей публикации (например: "20.02.26, 12:00")</li>
                    <li><strong>Частота</strong> — интервал повторения (например: "Каждые 2 дня")</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. AI конфигурация</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Карточка показывает настройки AI-генерации:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Системная роль</strong> — инструкция для AI (показывается курсивом с отступом слева)</li>
                    <li><strong>Задача (Prompt)</strong> — конкретный запрос для генерации</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Ориентировочный результат генерации</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Блок с примером сгенерированного текста:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Показывается последний сгенерированный текст (если пост уже публиковался)</li>
                    <li>Отображается заглушка "Текст еще не сгенерирован" для новых автоматизаций</li>
                    <li>Справа от заголовка — счётчик символов</li>
                    <li>Текст обрезается до 4 строк с многоточием (line-clamp-4)</li>
                </ul>

                <div className="not-prose bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
                    <p className="text-sm text-amber-800">
                        <strong>⚠️ Важно:</strong> Это только пример или результат предыдущей генерации. Реальный текст будет создан заново при следующей публикации.
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Медиа вложения</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если к посту прикреплены изображения, карточка показывает:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Превью изображений</strong> — до 4 штук в ряд</li>
                    <li><strong>Счётчик остальных</strong> — если изображений больше 4, на последнем отображается "+N"</li>
                    <li><strong>Режим медиа</strong> — в правом верхнем углу блока:
                        <ul>
                            <li>"Все (3)" — будут прикреплены все изображения</li>
                            <li>"Часть: 1 шт. (Случайно)" — будет выбрано 1 случайное изображение</li>
                            <li>"Часть: 2 шт. (По порядку)" — будут выбраны 2 изображения по порядку</li>
                        </ul>
                    </li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если медиа отсутствуют, показывается надпись "Медиа вложения отсутствуют".
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">6. Кнопки действий</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В нижней части карточки (футер):
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Изменить</strong> — открывает редактор AI-поста с текущими настройками</li>
                    <li><strong>Удалить</strong> — удаляет автоматизацию после подтверждения</li>
                </ul>

                <Sandbox 
                    title="Интерактивная демонстрация: Карточка AI-поста"
                    description="Рассмотрим структуру карточки детально"
                    instructions={[
                        'Наведите курсор на карточку — она приподнимется (эффект тени)',
                        'Обратите внимание на все элементы: статус, расписание, промпт, результат, медиа',
                        'Попробуйте кнопки "Изменить" и "Удалить" (они не активны в демо-режиме)'
                    ]}
                >
                    <div className="max-w-sm mx-auto">
                        <MockAiPostCard 
                            post={mockPosts[0]}
                            onEdit={() => {}}
                            onDelete={() => {}}
                        />
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* РАЗЛИЧИЯ МЕЖДУ КАРТОЧКАМИ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Визуальные различия</h2>
                
                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Активная автоматизация</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Белый фон карточки</li>
                    <li>Яркие цвета текста (чёрный заголовок)</li>
                    <li>Зелёный бейдж "Активно"</li>
                    <li>Индиго рамка (border-indigo-100)</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Автоматизация на паузе</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Слегка серый фон (bg-gray-50/50)</li>
                    <li>Приглушённый серый текст</li>
                    <li>Серый бейдж "Пауза"</li>
                    <li>Серая рамка (border-gray-200)</li>
                </ul>

                <Sandbox 
                    title="Сравнение: Активная vs На паузе"
                    description="Две карточки рядом для наглядности"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-bold text-gray-700 mb-2 text-center">✅ Активная</p>
                            <MockAiPostCard 
                                post={mockPosts[0]}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700 mb-2 text-center">⏸️ На паузе</p>
                            <MockAiPostCard 
                                post={mockPosts[2]}
                                onEdit={() => {}}
                                onDelete={() => {}}
                            />
                        </div>
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ЧТО ДАЛЬШЕ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Теперь, когда вы знаете структуру списка, переходим к созданию нового AI-поста. 
                    В следующем разделе вы узнаете, как открыть редактор и начать настройку автоматизации.
                </p>
            </section>

            <NavigationButtons currentPath="2-4-5-2-list" />
        </article>
    );
};
