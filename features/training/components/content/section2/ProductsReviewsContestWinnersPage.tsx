import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { StatusBadge, WinnersTableMock } from './ReviewsContestMocks';

// =====================================================================
// Inline компоненты для демонстрации
// =====================================================================

// Демо: Кнопки-ссылки на посты победителей
const PostLinksDemo: React.FC = () => {
    const [hoveredButton, setHoveredButton] = useState<'review' | 'results' | null>(null);

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Ссылки на контекст победителя:</p>
                <div className="flex gap-3">
                    {/* Кнопка "Отзыв" */}
                    <button
                        onMouseEnter={() => setHoveredButton('review')}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 rounded text-xs transition-colors border border-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Отзыв
                    </button>

                    {/* Кнопка "Итоги" */}
                    <button
                        onMouseEnter={() => setHoveredButton('results')}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded text-xs transition-colors border border-amber-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Итоги
                    </button>
                </div>
            </div>

            {hoveredButton && (
                <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 text-sm text-indigo-900">
                    {hoveredButton === 'review' && (
                        <p><strong>Отзыв:</strong> Открывает пост-отзыв победителя в ВК (тот пост, за который человек выиграл)</p>
                    )}
                    {hoveredButton === 'results' && (
                        <p><strong>Итоги:</strong> Открывает пост с объявлением итогов конкурса (где система опубликовала имя победителя)</p>
                    )}
                </div>
            )}
        </div>
    );
};

// Демо: Статусы доставки призов
const DeliveryStatusDemo: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<'sent' | 'error'>('sent');

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Выберите статус доставки:</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSelectedStatus('sent')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'sent'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Успешно
                    </button>
                    <button
                        onClick={() => setSelectedStatus('error')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'error'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Ошибка
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Отображение в таблице:</p>
                {selectedStatus === 'sent' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Вручено (ЛС)
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Вручено (Коммент)
                    </span>
                )}
                <div className="mt-3 text-sm text-gray-700">
                    {selectedStatus === 'sent' ? (
                        <>
                            <p className="font-semibold text-green-700">✓ Приз доставлен в личные сообщения</p>
                            <p className="text-xs text-gray-500 mt-1">Система успешно отправила промокод победителю через сообщения сообщества.</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-yellow-700">⚠ Личные сообщения закрыты</p>
                            <p className="text-xs text-gray-500 mt-1">Победитель не разрешил писать сообщения от лица сообщества. Система автоматически опубликовала промокод в комментарии под постом победителя.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestWinnersPage: React.FC<ContentProps> = ({ title }) => {
    const [filterStatus, setFilterStatus] = useState<'all' | 'sent' | 'error'>('all');

    // Моковые данные победителей
    const allWinners = [
        { date: '15.02.2026 14:30', winner: 'Анна Петрова', prize: 'Промокод на 500₽', promo: 'WINNER500', status: 'sent' as const },
        { date: '10.02.2026 18:45', winner: 'Дмитрий Иванов', prize: 'Скидка 30%', promo: 'SALE30OFF', status: 'error' as const },
        { date: '05.02.2026 12:00', winner: 'Елена Смирнова', prize: 'Бесплатная доставка', promo: 'FREESHIP', status: 'sent' as const },
        { date: '01.02.2026 09:15', winner: 'Михаил Козлов', prize: 'Промокод на 1000₽', promo: 'TOP1000', status: 'sent' as const },
        { date: '28.01.2026 16:20', winner: 'Ольга Новикова', prize: 'Скидка 50%', promo: 'MEGA50', status: 'error' as const },
    ];

    const filteredWinners = filterStatus === 'all' 
        ? allWinners 
        : allWinners.filter(w => w.status === filterStatus);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Победители" — это <strong>история всех проведенных розыгрышей</strong> в конкурсе отзывов. 
                Здесь хранится информация о каждом победителе: кто выиграл, какой приз получил, и удалось ли доставить промокод.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Это архив для контроля: если заказчик или победитель спросит "а кто вообще выигрывал в феврале?" — 
                вы открываете эту вкладку и видите полную картину за все время работы конкурса.
            </p>

            <hr className="!my-10" />

            {/* Было/Стало */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как было раньше vs как стало</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                {/* Было */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center text-2xl">❌</div>
                        <h3 className="text-xl font-bold text-red-900">Без системы</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-red-800">
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Записывали победителей в Excel-таблицу или блокнот</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Вручную искали ссылки на посты-отзывы в истории переписок</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Не было единой базы — каждый проект в отдельном файле</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Непонятно, отправлен ли приз или забыли</span>
                        </li>
                    </ul>
                </div>

                {/* Стало */}
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-2xl">✅</div>
                        <h3 className="text-xl font-bold text-green-900">С системой</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Все победители автоматически попадают в единую таблицу</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Одним кликом открываешь отзыв победителя или пост с итогами</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Все данные в одном месте — не нужно ничего искать</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Видно статус доставки: "Вручено (ЛС)" или "Вручено (Коммент)"</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Структура таблицы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что показывает таблица победителей</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица содержит <strong>7 колонок</strong> с полной информацией о каждом розыгрыше:
            </p>

            <div className="not-prose my-6">
                <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-amber-100 border-b border-amber-200">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-amber-900">Колонка</th>
                                <th className="px-4 py-2 text-left font-semibold text-amber-900">Что показывает</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-amber-100">
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Дата розыгрыша</td>
                                <td className="px-4 py-3 text-gray-700">Когда был выбран победитель (автоматически фиксируется системой)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Победитель</td>
                                <td className="px-4 py-3 text-gray-700">Имя пользователя ВК (кликабельная ссылка на профиль)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Пост автора</td>
                                <td className="px-4 py-3 text-gray-700">Кнопка-ссылка на отзыв победителя (тот пост, за который выиграл)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Итоги конкурса</td>
                                <td className="px-4 py-3 text-gray-700">Кнопка-ссылка на пост, где система объявила результаты розыгрыша</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Приз</td>
                                <td className="px-4 py-3 text-gray-700">Описание приза (например, "Промокод на 500₽" или "Скидка 30%")</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Промокод</td>
                                <td className="px-4 py-3 text-gray-700">Сам код, который получил победитель (отображается моноширинным шрифтом)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-amber-700">Статус доставки</td>
                                <td className="px-4 py-3 text-gray-700">Где был вручен приз: в личных сообщениях или в комментарии</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Статусы доставки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Два способа доставки приза</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система пытается отправить промокод <strong>в личные сообщения сообщества</strong>. 
                Но не все пользователи разрешают получать сообщения от групп. В таких случаях система автоматически публикует приз в комментарии.
            </p>

            <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Статус 1: Успешно */}
                <div className="bg-white border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Вручено (ЛС)
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold text-green-700 mb-2">✓ Приз доставлен в личные сообщения</p>
                    <p className="text-xs text-gray-600">
                        Победитель получил промокод через сообщения сообщества. Это идеальный сценарий — 
                        приз отправлен конфиденциально, другие участники его не видят.
                    </p>
                </div>

                {/* Статус 2: Ошибка */}
                <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Вручено (Коммент)
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold text-yellow-700 mb-2">⚠ Личные сообщения закрыты</p>
                    <p className="text-xs text-gray-600">
                        Победитель запретил сообщения от групп. Система автоматически опубликовала промокод 
                        в комментарии под постом-отзывом победителя. Приз всё равно вручен.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Важно:</strong> Даже если система не смогла отправить ЛС, победитель всё равно получает приз — 
                    через комментарий. Оба статуса означают успешное вручение, просто через разные каналы.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Sandbox 1: Интерактивная таблица */}
            <Sandbox
                title="🎯 Интерактивная таблица победителей"
                description="Попробуйте отфильтровать записи по статусу доставки. В реальном интерфейсе вы можете наводить курсор на строки и кликать на ссылки."
                instructions={[
                    'Нажмите на кнопки фильтров, чтобы увидеть только успешные доставки или только ошибки',
                    'Обратите внимание на янтарный (amber) дизайн — это фирменный цвет раздела победителей',
                    'В реальной таблице каждая строка подсвечивается при наведении курсора'
                ]}
            >
                <div className="mb-4 flex gap-2">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            filterStatus === 'all'
                                ? 'bg-amber-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Все ({allWinners.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('sent')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            filterStatus === 'sent'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        ЛС ({allWinners.filter(w => w.status === 'sent').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('error')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            filterStatus === 'error'
                                ? 'bg-yellow-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Комментарии ({allWinners.filter(w => w.status === 'error').length})
                    </button>
                </div>

                <WinnersTableMock data={filteredWinners} />

                <p className="text-xs text-gray-500 mt-3 italic">
                    💡 В реальной системе вы можете кликнуть на имя победителя, чтобы открыть его профиль ВК
                </p>
            </Sandbox>

            <hr className="!my-10" />

            {/* Sandbox 2: Демо кнопок и статусов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Интерактивные элементы таблицы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В таблице есть два типа кликабельных элементов: <strong>кнопки-ссылки на посты</strong> и <strong>статусы доставки</strong>. 
                Попробуйте их в действии:
            </p>

            <Sandbox
                title="🔗 Демо: Кнопки-ссылки на посты"
                description="Наведите курсор на кнопки, чтобы увидеть описание. В реальной системе эти кнопки открывают посты ВКонтакте в новой вкладке."
                instructions={[
                    'Кнопка "Отзыв" (серая) — открывает пост победителя',
                    'Кнопка "Итоги" (янтарная) — открывает пост с объявлением результатов',
                    'Обе кнопки содержат иконки для визуального различия'
                ]}
            >
                <PostLinksDemo />
            </Sandbox>

            <Sandbox
                title="📊 Демо: Статусы доставки"
                description="Переключайте между статусами, чтобы увидеть как система отображает способ вручения приза."
                instructions={[
                    'Зеленый значок = успешная доставка в личные сообщения',
                    'Желтый значок = доставка через комментарий (ЛС недоступны)',
                    'Оба варианта означают, что победитель получил приз'
                ]}
            >
                <DeliveryStatusDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Советы по использованию */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать эту вкладку</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">📋 Контроль истории</h3>
                    <p className="text-sm text-purple-800">
                        Заказчик спросил: "А кто выигрывал в прошлом месяце?". Открываете эту вкладку и показываете полный список с датами.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">🔍 Проверка доставки</h3>
                    <p className="text-sm text-purple-800">
                        Победитель написал "не получил приз". Смотрите в таблицу: если статус "Вручено (Коммент)" — 
                        значит приз в комментариях под его постом.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">📊 Статистика для отчета</h3>
                    <p className="text-sm text-purple-800">
                        Нужно показать заказчику сколько розыгрышей провели за квартал? Открываете таблицу и считаете записи по датам.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">🔗 Быстрый доступ к постам</h3>
                    <p className="text-sm text-purple-800">
                        Нужно найти отзыв конкретного победителя? Не ищите в ленте вручную — кликните на кнопку "Отзыв" в таблице.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>Совет:</strong> Если у вас много записей с желтым статусом "Вручено (Коммент)", 
                    возможно стоит добавить в пост с условиями конкурса призыв разрешить сообщения от группы — 
                    так больше победителей будут получать призы конфиденциально через ЛС.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Связь с другими вкладками */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Связь с другими разделами</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Победители" работает не изолированно. Вот как она связана с остальными разделами конкурса:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">1</div>
                        <div>
                            <p className="font-semibold text-gray-900">Участники → Победители</p>
                            <p className="text-sm text-gray-600">Когда система выбирает победителя из вкладки "Участники", запись автоматически появляется здесь</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">2</div>
                        <div>
                            <p className="font-semibold text-gray-900">Промокоды → Победители</p>
                            <p className="text-sm text-gray-600">Каждый победитель получает свободный промокод из базы. Промокод становится "выданным"</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-indigo-700">3</div>
                        <div>
                            <p className="font-semibold text-gray-900">Победители → Лист отправок</p>
                            <p className="text-sm text-gray-600">Если нужна детальная информация (текст сообщения, время отправки, ошибки), смотрите в "Лист отправок"</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Победители" — это <strong>архивная витрина результатов</strong>. Для подробностей процесса доставки используйте 
                вкладку "Лист отправок" (там можно повторно отправить приз, если была ошибка).
            </p>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-2-4-winners" />
        </article>
    );
};
