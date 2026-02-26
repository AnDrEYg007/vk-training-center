import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockListsNavigation, MockListCard } from './ListsMocks';

// =====================================================================
// Компонент страницы 3.1.2: Навигация по спискам
// =====================================================================
export const ListsNavigationGuide: React.FC<ContentProps> = ({ title }) => {
    const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация по спискам — это система карточек, сгруппированных по категориям. Каждая карточка представляет отдельный список данных: подписчиков, лайкнувших, комментаторов и других пользователей или постов вашего сообщества.
            </p>

            <hr className="!my-10" />

            {/* Что это такое? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Навигация по спискам состоит из двух элементов:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-base font-bold text-gray-900 mb-2">1. Табы групп</h3>
                    <p className="text-sm text-gray-700">
                        Четыре категории списков: <strong>Подписчики</strong>, <strong>Активности</strong>, <strong>Автоматизации</strong> и <strong>Прочее</strong>. Клик по табу фильтрует карточки ниже.
                    </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h3 className="text-base font-bold text-gray-900 mb-2">2. Карусель карточек</h3>
                    <p className="text-sm text-gray-700">
                        Горизонтальный ряд карточек списков. Каждая карточка показывает иконку, название, количество записей и дату последнего обновления. При клике карточка выделяется, внизу загружаются данные.
                    </p>
                </div>
            </div>

            {/* Интерактивная песочница */}
            <Sandbox
                title="🎮 Интерактивная демонстрация"
                description="Попробуйте переключать табы и кликать на карточки — интерфейс работает точно так же, как в реальном приложении."
                instructions={[
                    '<strong>Переключите табы</strong> — карточки фильтруются по группе',
                    '<strong>Кликните на карточку</strong> — она выделится синей рамкой',
                    '<strong>Наведите курсор</strong> — появится эффект тени'
                ]}
            >
                <MockListsNavigation />
            </Sandbox>

            <hr className="!my-10" />

            {/* Группы списков */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Четыре группы списков</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Все 12 типов списков разделены на логические группы для удобства навигации:
            </p>

            {/* Группа 1: Подписчики */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Подписчики</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Списки, связанные с аудиторией сообщества:
            </p>
            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Подписчики</div>
                            <div className="text-xs text-gray-500">Все участники сообщества</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Текущий список всех пользователей, состоящих в сообществе на момент последнего обновления.
                    </p>
                </div>

                <div className="border border-cyan-200 rounded-lg p-4 bg-cyan-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">В рассылке</div>
                            <div className="text-xs text-gray-500">Доступны для сообщений</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Подписчики, которым можно отправлять личные сообщения от имени сообщества (настройки приватности VK).
                    </p>
                </div>

                <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Вступившие</div>
                            <div className="text-xs text-gray-500">Новые подписчики</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Пользователи, которые подписались на сообщество за выбранный период времени (настраивается фильтрами).
                    </p>
                </div>

                <div className="border border-red-200 rounded-lg p-4 bg-red-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Вышедшие</div>
                            <div className="text-xs text-gray-500">Отписались</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Пользователи, которые покинули сообщество. Позволяет анализировать причины оттока аудитории.
                    </p>
                </div>
            </div>

            {/* Группа 2: Активности */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Активности</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Списки пользователей, которые взаимодействовали с контентом:
            </p>
            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-pink-200 rounded-lg p-4 bg-pink-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Лайкали</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Список пользователей, которые ставили лайки постам сообщества. При клике на строку раскрывается список ID постов.
                    </p>
                </div>

                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Комментировали</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Пользователи, которые оставляли комментарии. Раскрытие строки показывает ID постов с их комментариями.
                    </p>
                </div>

                <div className="border border-violet-200 rounded-lg p-4 bg-violet-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">Репостили</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Пользователи, сделавшие репосты постов сообщества. Раскрытие показывает список ID репостнутых постов.
                    </p>
                </div>
            </div>

            {/* Группа 3: Автоматизации */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Автоматизации</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Списки, созданные автоматическими процессами (например, конкурсы отзывов):
            </p>
            <div className="not-prose my-6 space-y-3">
                <div className="border border-amber-200 rounded-lg p-4 bg-amber-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">Конкурс отзывов: Победители</div>
                            <div className="text-xs text-gray-500">Автоматически определённые победители конкурса</div>
                        </div>
                    </div>
                </div>
                <div className="border border-lime-200 rounded-lg p-4 bg-lime-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">Конкурс отзывов: Участники</div>
                            <div className="text-xs text-gray-500">Все пользователи, подавшие заявки</div>
                        </div>
                    </div>
                </div>
                <div className="border border-teal-200 rounded-lg p-4 bg-teal-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">Конкурс отзывов: Посты</div>
                            <div className="text-xs text-gray-500">Публикации участников конкурса</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Группа 4: Прочее */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Прочее</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Специальные списки:
            </p>
            <div className="not-prose my-6 space-y-3">
                <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-800 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">История постов</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>Особенность: двойной счётчик</span>
                                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] rounded font-mono">1000 из 5400</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Показывает <strong>количество постов, загруженных в базу данных</strong> из общего числа постов в VK. Полная синхронизация может занять время для больших сообществ.
                    </p>
                </div>
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50/30">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-gray-900">Авторы постов</div>
                            <div className="text-xs text-gray-500">Пользователи, добавившие посты в сообщество</div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700">
                        Список всех авторов постов — как администраторов, так и пользователей, опубликовавших через предложку.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Анатомия карточки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Анатомия карточки списка</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая карточка состоит из нескольких элементов:
            </p>

            <Sandbox
                title="🔍 Разбор элементов карточки"
                description="Наведите курсор на карточку и обратите внимание на детали:"
                instructions={[
                    '<strong>Иконка с цветным фоном</strong> — визуальный идентификатор типа списка',
                    '<strong>Счётчик</strong> — крупная цифра показывает количество записей',
                    '<strong>Название списка</strong> — текстовая метка под счётчиком',
                    '<strong>Дата обновления</strong> — "Обновлено: 15 фев, 14:23"',
                    '<strong>Кнопка обновления</strong> — иконка в правом верхнем углу (при клике запускается синхронизация с VK)'
                ]}
            >
                <div className="flex justify-center">
                    <MockListCard
                        type="subscribers"
                        isActive={selectedDemo === 'demo'}
                        onClick={() => setSelectedDemo('demo')}
                    />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Особенность: двойной счётчик для постов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Список "История постов" имеет уникальное отображение счётчика:
            </p>

            <div className="not-prose my-6">
                <div className="flex justify-center">
                    <MockListCard
                        type="posts"
                        isActive={false}
                        onClick={() => {}}
                    />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-700">
                        <strong>Верхнее число</strong> — количество постов, загруженных в базу данных приложения<br />
                        <strong>Нижнее число</strong> — общее количество постов в сообществе VK<br />
                        <strong>Зачем это нужно?</strong> Большие сообщества имеют тысячи постов. Полная загрузка всех постов может занять время, поэтому система показывает прогресс синхронизации.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Состояния карточки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Состояния карточки</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Карточка списка может находиться в четырёх визуальных состояниях:
            </p>

            <div className="not-prose my-8 space-y-6">
                {/* Неактивная */}
                <div>
                    <h4 className="text-base font-bold text-gray-900 mb-3">1. Неактивная (по умолчанию)</h4>
                    <div className="flex items-center gap-4">
                        <MockListCard
                            type="mailing"
                            isActive={false}
                            onClick={() => {}}
                        />
                        <div className="flex-1 text-sm text-gray-700 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                                <span>Белый фон</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                                <span>Базовая тень</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-transparent rounded"></div>
                                <span>Без рамки</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Активная */}
                <div>
                    <h4 className="text-base font-bold text-gray-900 mb-3">2. Активная (выбранная)</h4>
                    <div className="flex items-center gap-4">
                        <MockListCard
                            type="history_join"
                            isActive={true}
                            onClick={() => {}}
                        />
                        <div className="flex-1 text-sm text-gray-700 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-200 rounded bg-indigo-50"></div>
                                <span>Индиго рамка <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">ring-2 ring-indigo-200</code></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-indigo-50 rounded"></div>
                                <span>Светло-индиго фон <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">bg-indigo-50</code></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-300 rounded shadow-lg"></div>
                                <span>Увеличенная тень</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hover */}
                <div>
                    <h4 className="text-base font-bold text-gray-900 mb-3">3. При наведении курсора</h4>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-sm text-gray-700 mb-2">
                            При наведении курсора на неактивную карточку появляется эффект увеличенной тени, подсказывая, что элемент кликабельный.
                        </p>
                        <p className="text-xs text-gray-500 italic">
                            Попробуйте навести курсор на карточки в интерактивной демонстрации выше.
                        </p>
                    </div>
                </div>

                {/* Обновление */}
                <div>
                    <h4 className="text-base font-bold text-gray-900 mb-3">4. Обновление (синхронизация с VK)</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
                        <p className="text-sm text-gray-700">
                            Когда вы нажимаете кнопку обновления в правом верхнем углу карточки, начинается процесс синхронизации данных с VK:
                        </p>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span><strong>Иконка обновления заменяется на спиннер</strong> — анимированный индикатор загрузки</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span><strong>Под счётчиком появляется статус</strong> — например, "Загрузка 4500/10000"</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-500 mt-0.5">•</span>
                                <span><strong>После завершения</strong> — счётчик и дата обновляются, спиннер исчезает</span>
                            </li>
                        </ul>
                        <p className="text-xs text-gray-500 italic">
                            Примечание: В реальном приложении процесс может занять от нескольких секунд до нескольких минут, в зависимости от размера списка.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Зачем это нужно? */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
            
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Было: работа через интерфейс VK</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-red-400 bg-red-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Для просмотра разных списков нужно заходить в разные разделы VK</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Нет единого места, где видны все метрики сразу</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500">❌</span>
                            <span>Невозможно быстро переключаться между подписчиками, лайкнувшими, комментаторами</span>
                        </li>
                    </ul>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Стало: карусель карточек</h3>
            <div className="not-prose my-6">
                <div className="border-l-4 border-emerald-400 bg-emerald-50 p-4 rounded-r-lg">
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Все списки в одном месте</strong> — один клик для переключения между типами</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Визуальные метрики</strong> — сразу видно количество подписчиков, лайков, комментариев</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Статус актуальности</strong> — дата последнего обновления показывает, нужна ли синхронизация</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-emerald-500">✅</span>
                            <span><strong>Группировка по смыслу</strong> — табы помогают быстро найти нужную категорию</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="3-1-2-navigation" />
        </article>
    );
};
