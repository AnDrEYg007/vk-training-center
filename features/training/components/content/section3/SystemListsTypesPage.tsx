import React, { useState } from 'react';
import { Sandbox, NavigationButtons } from '../shared';
import { AllListTypesGrid, ListTypesComparisonTable, MockListsNavigation } from './ListsMocks';

export const SystemListsTypesPage: React.FC = () => {
    const [activeGroup, setActiveGroup] = useState<'subscribers' | 'activities' | 'automations' | 'other'>('subscribers');

    return (
        <div className="prose max-w-none">
            <h1>3.2.1. Типы системных списков</h1>

            <p className="text-lg">
                В системе доступно <strong>12 типов системных списков</strong>, разделённых на 4 группы. Каждый тип собирает данные из своего источника и решает конкретные задачи SMM-специалиста.
            </p>

            {/* ===================================================================== */}
            {/* ЗАЧЕМ СТОЛЬКО ТИПОВ */}
            {/* ===================================================================== */}
            <section>
                <h2>Зачем столько типов?</h2>

                <p>
                    Раньше, чтобы узнать кто лайкнул пост, приходилось открывать каждый пост в ВК и вручную смотреть список. 
                    Чтобы найти активную аудиторию — искать комментаторов по десяткам постов. Чтобы наградить победителя конкурса — 
                    копировать ID из таблицы Excel.
                </p>

                <p><strong>Теперь:</strong></p>

                <ul>
                    <li>Все подписчики сообщества — в одном списке</li>
                    <li>Все кто лайкал посты — в другом</li>
                    <li>Все кто комментировал — в третьем</li>
                    <li>Победители конкурса — в отдельном списке для рассылки</li>
                </ul>

                <p>
                    Каждый тип списка — это готовая выборка людей для конкретной задачи. Вы не ищете их вручную, 
                    система собирает автоматически.
                </p>
            </section>

            {/* ===================================================================== */}
            {/* ГРУППА 1: ПОДПИСЧИКИ */}
            {/* ===================================================================== */}
            <section>
                <h2>Группа «Подписчики» — 4 типа</h2>

                <p>
                    Эти списки работают с участниками сообщества: кто есть сейчас, кто был раньше, кто вступил, кто вышел.
                </p>

                <div className="not-prose grid grid-cols-1 gap-6 my-6">
                    {/* Подписчики */}
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-indigo-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">1. Подписчики сообщества</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Текущие участники группы ВКонтакте. Обновляется через <code className="text-xs bg-gray-900 text-green-400 px-1 py-0.5 rounded">groups.getMembers</code>. 
                                    Загрузка идёт батчами по 1000 человек параллельно — даже если в сообществе 50 000 подписчиков, сбор займёт пару минут.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-indigo-300 text-indigo-700 rounded font-medium">Базовый список</span>
                                    <span className="px-2 py-1 bg-white border border-indigo-300 text-indigo-700 rounded font-medium">Обновление: раз в день</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-indigo-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Рассылки, анализ аудитории, сегментация по полу/возрасту/городу</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* В рассылке */}
                    <div className="bg-cyan-50 border-2 border-cyan-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-cyan-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">2. В рассылке</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Пользователи, у которых есть активный диалог с сообществом. Система проверяет поле <code className="text-xs">can_write.allowed</code> — 
                                    можно ли отправить сообщение. Если человек заблокировал сообщения, он не попадёт в этот список.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-cyan-300 text-cyan-700 rounded font-medium">Для рассылок</span>
                                    <span className="px-2 py-1 bg-white border border-cyan-300 text-cyan-700 rounded font-medium">Проверка can_write</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-cyan-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Таргетированные сообщения, уведомления, персональные предложения</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Вступившие */}
                    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-teal-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">3. Вступившие (История)</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    История всех, кто когда-либо вступал в сообщество. При каждом обновлении списка подписчиков система сравнивает: 
                                    кто новый? Эти пользователи автоматически добавляются в историю вступлений с датой обнаружения.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-teal-300 text-teal-700 rounded font-medium">Автоматическое пополнение</span>
                                    <span className="px-2 py-1 bg-white border border-teal-300 text-teal-700 rounded font-medium">Только для истории</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-teal-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Отслеживание динамики роста, анализ притока новых участников</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Вышедшие */}
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">4. Вышедшие (История)</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    История всех, кто покинул сообщество. При обновлении система детектирует: кто был в старом списке, но отсутствует в новом? 
                                    Эти люди переносятся в историю выхода с фиксацией даты обнаружения.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-orange-300 text-orange-700 rounded font-medium">Автоматическое пополнение</span>
                                    <span className="px-2 py-1 bg-white border border-orange-300 text-orange-700 rounded font-medium">Анализ оттока</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Анализ причин ухода, возвратные кампании</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================================================================== */}
            {/* ГРУППА 2: АКТИВНОСТИ */}
            {/* ===================================================================== */}
            <section>
                <h2>Группа «Активности» — 3 типа</h2>

                <p>
                    Эти списки собирают пользователей, которые взаимодействовали с контентом: ставили лайки, писали комментарии, делали репосты.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h4 className="text-sm font-bold text-amber-900 mb-1">Важное условие</h4>
                            <p className="text-sm text-amber-800 mb-0">
                                Списки активностей работают <strong>только для постов, которые уже добавлены в систему</strong>. 
                                Если вы хотите собрать лайкнувших конкретный пост — сначала добавьте его в раздел «Посты» или 
                                синхронизируйте список «История постов».
                            </p>
                        </div>
                    </div>
                </div>

                <div className="not-prose grid grid-cols-1 gap-6 my-6">
                    {/* Лайкали */}
                    <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-pink-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">5. Лайкали посты</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Пользователи, которые поставили лайк хотя бы одному посту из системы. Сбор идёт через <code className="text-xs bg-gray-900 text-green-400 px-1 py-0.5 rounded">likes.getList</code> 
                                    внутри execute-батчей. Система использует <strong>быстрое сканирование</strong> первых 1000 лайков, 
                                    если больше — запускается глубокое сканирование.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-pink-300 text-pink-700 rounded font-medium">Быстрый сбор</span>
                                    <span className="px-2 py-1 bg-white border border-pink-300 text-pink-700 rounded font-medium">Обновление: 2–4 часа</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-pink-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Поиск активной аудитории, ретаргетинг на тех кто уже заинтересован</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Комментировали */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">6. Комментировали посты</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Пользователи, оставившие комментарий под постами. Сбор через <code className="text-xs bg-gray-900 text-green-400 px-1 py-0.5 rounded">wall.getComments</code> 
                                    с параметром extended=1 для получения профилей. Батчи по 100 комментариев обрабатываются параллельно.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-blue-300 text-blue-700 rounded font-medium">Вовлечённая аудитория</span>
                                    <span className="px-2 py-1 bg-white border border-blue-300 text-blue-700 rounded font-medium">Обновление: 2–4 часа</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Поиск активных дискутёров, обратная связь, анализ мнений</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Репостили */}
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">7. Репостили посты</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Пользователи, сделавшие репост постов. Метод <code className="text-xs bg-gray-900 text-green-400 px-1 py-0.5 rounded">wall.getReposts</code> 
                                    требует <strong>токен администратора сообщества</strong> (level 3). Система автоматически фильтрует только админские токены для этой операции.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-red-100 border border-red-300 text-red-700 rounded font-medium">⚠️ Требует токен администратора</span>
                                    <span className="px-2 py-1 bg-white border border-purple-300 text-purple-700 rounded font-medium">По запросу</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Поиск амбассадоров бренда, анализ виральности контента</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================================================================== */}
            {/* ГРУППА 3: АВТОМАТИЗАЦИИ */}
            {/* ===================================================================== */}
            <section>
                <h2>Группа «Автоматизации» — 3 типа</h2>

                <p>
                    Списки для автоматических процессов: конкурсы, розыгрыши, системные рассылки. Данные берутся не из VK API, 
                    а из внутренней базы данных приложения.
                </p>

                <div className="not-prose grid grid-cols-1 gap-6 my-6">
                    {/* Победители конкурса */}
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-amber-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">8. Конкурс отзывов: Победители</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Пользователи со статусом "winner" в таблице конкурса отзывов. Не синхронизируется из ВКонтакте — 
                                    победители назначаются вручную через интерфейс управления конкурсом.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-amber-300 text-amber-700 rounded font-medium">Внутренняя БД</span>
                                    <span className="px-2 py-1 bg-white border border-amber-300 text-amber-700 rounded font-medium">Ручное управление</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-amber-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Рассылка уведомлений о победе, выдача призов</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Участники конкурса */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">9. Конкурс отзывов: Участники</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Все участники конкурса (со статусом "participant" или "winner"). Включает и победителей тоже — 
                                    удобно для общей рассылки всем участникам после завершения конкурса.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-green-300 text-green-700 rounded font-medium">Внутренняя БД</span>
                                    <span className="px-2 py-1 bg-white border border-green-300 text-green-700 rounded font-medium">Включает победителей</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-green-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Общие рассылки участникам, благодарности</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Посты конкурса */}
                    <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-indigo-400 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">10. Конкурс отзывов: Посты</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Счётчик постов участников конкурса. Не список пользователей, а подсчёт количества отзывов из таблицы 
                                    general_contest_entries. Используется для статистики конкурса.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-indigo-400 text-indigo-700 rounded font-medium">Только счётчик</span>
                                    <span className="px-2 py-1 bg-white border border-indigo-400 text-indigo-700 rounded font-medium">Статистика</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-indigo-300">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Отслеживание активности конкурса, аналитика</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================================================================== */}
            {/* ГРУППА 4: ПРОЧЕЕ */}
            {/* ===================================================================== */}
            <section>
                <h2>Группа «Прочее» — 2 типа</h2>

                <p>
                    Списки, которые не вписываются в другие категории: архив постов и авторы контента.
                </p>

                <div className="not-prose grid grid-cols-1 gap-6 my-6">
                    {/* История постов */}
                    <div className="bg-indigo-900/10 border-2 border-indigo-800/30 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-indigo-800 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">11. История постов</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Архив постов со стены сообщества с метриками (лайки, комментарии, репосты, просмотры). 
                                    Система показывает <strong>двойной счётчик</strong>: сколько постов в БД / сколько всего в ВК. 
                                    Есть два режима синхронизации: <strong>1000 (быстро)</strong> — первая тысяча постов, <strong>all (долго)</strong> — все посты с начала времён.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-indigo-800/50 text-indigo-900 rounded font-medium">Двойной счётчик</span>
                                    <span className="px-2 py-1 bg-white border border-indigo-800/50 text-indigo-900 rounded font-medium">Режимы: 1000 / all</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-indigo-800/30">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Аналитика контента, поиск трендов, основа для списков активностей</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Авторы постов */}
                    <div className="bg-violet-50 border-2 border-violet-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-violet-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">12. Авторы постов</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Уникальные пользователи, чьи посты или подписи нашлись на стене. Система анализирует поля <code className="text-xs">signer_id</code> 
                                    и <code className="text-xs">post_author_id</code> при синхронизации истории постов и автоматически создаёт список авторов.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 bg-white border border-violet-300 text-violet-700 rounded font-medium">Автоматическое извлечение</span>
                                    <span className="px-2 py-1 bg-white border border-violet-300 text-violet-700 rounded font-medium">Из signer_id</span>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border border-violet-200">
                                    <p className="text-xs text-gray-600 mb-1"><strong>Для чего:</strong></p>
                                    <p className="text-xs text-gray-700">Поиск авторов контента, координация команды редакторов</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===================================================================== */}
            {/* ИНТЕРАКТИВНАЯ ДЕМОНСТРАЦИЯ ВСЕХ ТИПОВ */}
            {/* ===================================================================== */}
            <section>
                <h2>Все 12 типов в одном месте</h2>

                <p>
                    Ниже — интерактивная сетка всех типов системных списков с их характеристиками. Каждая карточка показывает: 
                    название, описание, группу, источник данных и VK API метод (если используется).
                </p>

                <Sandbox
                    title="Полный каталог типов системных списков"
                    description="12 типов, 4 группы, разные источники данных — всё что нужно знать о системных списках"
                    height="auto"
                >
                    <AllListTypesGrid />
                </Sandbox>
            </section>

            {/* ===================================================================== */}
            {/* ТАБЛИЦА СРАВНЕНИЯ */}
            {/* ===================================================================== */}
            <section>
                <h2>Когда какой тип использовать?</h2>

                <p>
                    Чтобы быстро выбрать нужный тип списка для задачи, посмотрите таблицу сравнения:
                </p>

                <Sandbox
                    title="Таблица сравнения типов списков"
                    description="Практическое руководство: какой список для какой задачи подходит"
                    height="auto"
                >
                    <ListTypesComparisonTable />
                </Sandbox>
            </section>

            {/* ===================================================================== */}
            {/* ИТОГИ */}
            {/* ===================================================================== */}
            <section>
                <h2>Итого</h2>

                <div className="not-prose bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6 my-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Что важно запомнить:</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span><strong>12 типов</strong> — каждый решает свою задачу, не нужно использовать все сразу</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span><strong>4 группы</strong> — подписчики, активности, автоматизации, прочее</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span><strong>Разные источники</strong> — VK API, внутренняя БД, автоматическое извлечение</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span><strong>Активности требуют постов</strong> — сначала синхронизируйте историю постов</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">✓</span>
                            <span><strong>Репосты = токен админа</strong> — без прав администратора сбор невозможен</span>
                        </li>
                    </ul>
                </div>
            </section>

            {/* ===================================================================== */}
            {/* НАВИГАЦИЯ */}
            {/* ===================================================================== */}
            <NavigationButtons prevPath="3-2-system-lists" nextPath="3-3-statistics" />
        </div>
    );
};
