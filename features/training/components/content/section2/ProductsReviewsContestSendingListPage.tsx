import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Inline компоненты для демонстрации
// =====================================================================

// Демо: Статусы доставки
const DeliveryStatusesDemo: React.FC = () => {
    const [selectedStatus, setSelectedStatus] = useState<'sent' | 'error'>('sent');

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Выберите статус:</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setSelectedStatus('sent')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'sent'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                    >
                        Доставлено
                    </button>
                    <button
                        onClick={() => setSelectedStatus('error')}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            selectedStatus === 'error'
                                ? 'bg-red-600 text-white'
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
                    <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Доставлено (ЛС)
                        </span>
                        <div className="mt-3 text-sm text-gray-700">
                            <p className="font-semibold text-green-700">✓ Сообщение доставлено через личные сообщения</p>
                            <p className="text-xs text-gray-500 mt-1">Система успешно отправила промокод в личные сообщения ВКонтакте. Победитель получил уведомление.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                            Ошибка ЛС
                        </span>
                        <span className="text-[10px] text-gray-500">Отправлен комментарий</span>
                        <div className="mt-3 text-sm text-gray-700">
                            <p className="font-semibold text-red-700">⚠️ Личные сообщения закрыты</p>
                            <p className="text-xs text-gray-500 mt-1">Система не смогла отправить в ЛС (пользователь закрыл личные сообщения от сообществ). 
                            Но промокод НЕ потерян — он автоматически отправлен комментарием под постом победителя.</p>
                            <p className="text-xs text-indigo-600 mt-2"><strong>Доступно действие:</strong> Кнопка "Повторить" — попытка отправить снова в ЛС.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Демо: Счётчики и кнопки
const CountersAndActionsDemo: React.FC = () => {
    const [sentCount, setSentCount] = useState(23);
    const [errorCount, setErrorCount] = useState(4);
    const [isRetrying, setIsRetrying] = useState(false);

    const handleRetryAll = () => {
        setIsRetrying(true);
        setTimeout(() => {
            // Имитация успешной повторной отправки
            setSentCount(prev => prev + errorCount);
            setErrorCount(0);
            setIsRetrying(false);
        }, 2000);
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Журнал отправки призов</h3>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-sm mr-4">
                        <span className="text-green-600">Успешно: <strong>{sentCount}</strong></span>
                        <span className="text-red-500">Ошибки: <strong>{errorCount}</strong></span>
                    </div>
                    {errorCount > 0 && (
                        <button
                            onClick={handleRetryAll}
                            disabled={isRetrying}
                            className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
                        >
                            {isRetrying && <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            Повторить всем ({errorCount})
                        </button>
                    )}
                </div>
            </div>
            <div className="p-4 text-sm text-gray-600">
                <p className="mb-2">
                    <strong>Счётчик "Успешно"</strong> (зелёный) — сколько промокодов доставлено через ЛС.
                </p>
                <p className="mb-2">
                    <strong>Счётчик "Ошибки"</strong> (красный) — сколько не удалось отправить в ЛС (но отправлены комментарием).
                </p>
                <p>
                    <strong>Кнопка "Повторить всем"</strong> — появляется только если есть ошибки. Нажмите, чтобы попробовать отправить повторно всем пользователям со статусом ошибки.
                </p>
            </div>
        </div>
    );
};

// Демо: Таблица отправок
const SendingTableDemo: React.FC = () => {
    const mockLogs = [
        {
            id: '1',
            userName: 'Иван Петров',
            userId: 123456789,
            promoCode: 'PROMO500',
            prizeDesc: 'Скидка 500₽ на заказ',
            status: 'sent' as const,
            time: '15.02.2026, 14:30'
        },
        {
            id: '2',
            userName: 'Мария Сидорова',
            userId: 987654321,
            promoCode: 'SALE30OFF',
            prizeDesc: 'Скидка 30% на всё меню',
            status: 'error' as const,
            time: '15.02.2026, 14:35'
        },
        {
            id: '3',
            userName: 'Алексей Смирнов',
            userId: 555666777,
            promoCode: 'FREESHIP',
            prizeDesc: 'Бесплатная доставка',
            status: 'sent' as const,
            time: '15.02.2026, 14:40'
        }
    ];

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-4 py-3">Пользователь</th>
                            <th className="px-4 py-3">Выданный приз (Код)</th>
                            <th className="px-4 py-3 w-40">Статус отправки</th>
                            <th className="px-4 py-3 w-40">Время</th>
                            <th className="px-4 py-3 w-16 text-center">Чат</th>
                            <th className="px-4 py-3 w-32"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockLogs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-medium text-gray-900">{log.userName}</div>
                                            <span className="text-xs text-indigo-500">ID: {log.userId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-mono text-gray-700 font-medium">{log.promoCode}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{log.prizeDesc}</div>
                                </td>
                                <td className="px-4 py-3">
                                    {log.status === 'sent' ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Доставлено (ЛС)
                                        </span>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 w-fit">
                                                Ошибка ЛС
                                            </span>
                                            <span className="text-[10px] text-gray-500">Отправлен комментарий</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-500">
                                    {log.time}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button 
                                        className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Открыть диалог с пользователем"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {log.status === 'error' && (
                                        <button
                                            className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                                        >
                                            Повторить
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestSendingListPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Вкладка "Список рассылки" (или "Журнал отправки призов") — это <strong>история доставки промокодов победителям</strong> конкурса отзывов. 
                Здесь вы видите кому, когда и как был отправлен каждый промокод, а также можете повторить отправку в случае ошибки.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Этот журнал — ваша страховка от потерянных призов. Если победитель пишет "Мне не пришёл промокод", вы сразу видите: 
                отправлялось ли сообщение, какой был статус доставки, когда это произошло.
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
                            <span>Не было истории отправок — невозможно проверить кому и когда отправлялись призы</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Если победитель жаловался "Не пришло" — приходилось гадать, отправляли мы или нет</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>При ошибке доставки промокод терялся, нужно было вручную разбираться</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-500 font-bold">•</span>
                            <span>Не было способа повторить отправку автоматически</span>
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
                            <span>Полная история: кто получил, какой промокод, когда отправлено</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Статус доставки: видно успешно ли отправлено в ЛС или была ошибка</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Автоматический запасной вариант: если ЛС закрыто — система сама отправляет комментарием</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600 font-bold">•</span>
                            <span>Кнопки повторной отправки — можно попробовать снова одним кликом</span>
                        </li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Структура таблицы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура журнала: 6 колонок</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица отправок состоит из 6 колонок, каждая несёт важную информацию:
            </p>

            <div className="not-prose my-6">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Колонка</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Ширина</th>
                                <th className="px-4 py-2 text-left font-semibold text-gray-700">Что показывает</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Пользователь</td>
                                <td className="px-4 py-3 text-gray-500">auto</td>
                                <td className="px-4 py-3 text-gray-700">Имя победителя + ID (кликабельная ссылка на профиль VK)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Выданный приз (Код)</td>
                                <td className="px-4 py-3 text-gray-500">auto</td>
                                <td className="px-4 py-3 text-gray-700">Промокод (моноширинный шрифт) + описание приза мелким текстом</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Статус отправки</td>
                                <td className="px-4 py-3 text-gray-500">w-40</td>
                                <td className="px-4 py-3 text-gray-700">Бейдж "Доставлено (ЛС)" или "Ошибка ЛС" с подписью</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Время</td>
                                <td className="px-4 py-3 text-gray-500">w-40</td>
                                <td className="px-4 py-3 text-gray-700">Дата и время отправки (формат: 15.02.2026, 14:30)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Чат</td>
                                <td className="px-4 py-3 text-gray-500">w-16</td>
                                <td className="px-4 py-3 text-gray-700">Иконка диалога (открывает переписку с победителем в VK)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-mono text-indigo-700">Действия</td>
                                <td className="px-4 py-3 text-gray-500">w-32</td>
                                <td className="px-4 py-3 text-gray-700">Кнопка "Повторить" (только для записей со статусом ошибки)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Sandbox 1: Статусы */}
            <Sandbox
                title="🏷️ Статусы доставки"
                description="Переключайте между статусами, чтобы увидеть разницу в отображении и понять логику двухэтапной доставки."
                instructions={[
                    '<strong>"Доставлено (ЛС)"</strong> (зелёный бейдж) — промокод успешно отправлен через личные сообщения',
                    '<strong>"Ошибка ЛС"</strong> (красный бейдж) — ЛС закрыто, но промокод отправлен комментарием под постом победителя',
                    'У записей с ошибкой доступна кнопка "Повторить" для повторной попытки отправки в ЛС'
                ]}
            >
                <DeliveryStatusesDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Двухэтапная доставка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Двухэтапная система доставки</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система использует <strong>двухэтапную логику доставки</strong>, чтобы промокоды гарантированно дошли до победителей:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-green-700">1</div>
                        <div>
                            <p className="font-semibold text-green-900">Попытка отправки в личные сообщения (ЛС)</p>
                            <p className="text-sm text-green-800 mt-1">
                                Сначала система пытается отправить промокод через личные сообщения ВКонтакте. 
                                Это самый надёжный способ — пользователь получает уведомление и видит сообщение в своих диалогах.
                            </p>
                            <p className="text-xs text-green-700 mt-2"><strong>Статус при успехе:</strong> "Доставлено (ЛС)" (зелёный бейдж)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-yellow-700">2</div>
                        <div>
                            <p className="font-semibold text-yellow-900">Запасной вариант: отправка комментарием</p>
                            <p className="text-sm text-yellow-800 mt-1">
                                Если личные сообщения закрыты (многие пользователи запрещают ЛС от сообществ), система <strong>автоматически</strong> 
                                оставляет комментарий с промокодом под постом победителя. Промокод НЕ теряется!
                            </p>
                            <p className="text-xs text-yellow-700 mt-2"><strong>Статус при ошибке ЛС:</strong> "Ошибка ЛС" (красный бейдж) + подпись "Отправлен комментарий"</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>💡 Важно понимать:</strong> Статус "Ошибка ЛС" НЕ означает, что промокод потерян. 
                    Это значит, что он доставлен альтернативным способом — комментарием. 
                    Но вы можете попробовать отправить повторно в ЛС, если победитель позже открыл личные сообщения.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Sandbox 2: Счётчики и кнопки */}
            <Sandbox
                title="📊 Счётчики и массовая отправка"
                description="Попробуйте нажать кнопку 'Повторить всем', чтобы увидеть как работает массовая повторная отправка."
                instructions={[
                    'Счётчик <strong>"Успешно"</strong> (зелёный) — количество промокодов, доставленных через ЛС',
                    'Счётчик <strong>"Ошибки"</strong> (красный) — количество отправленных комментарием (ЛС было закрыто)',
                    'Кнопка <strong>"Повторить всем"</strong> появляется только если есть ошибки. Нажмите для массовой повторной отправки'
                ]}
            >
                <CountersAndActionsDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Sandbox 3: Таблица */}
            <Sandbox
                title="📋 Интерактивная таблица отправок"
                description="Наведите курсор на элементы таблицы, чтобы увидеть интерактивные эффекты."
                instructions={[
                    'Наведите курсор на <strong>иконку чата</strong> (три точки) — она изменит цвет на indigo-600',
                    'Обратите внимание на <strong>моноширинный шрифт</strong> для промокодов (удобно читать)',
                    'Кнопка <strong>"Повторить"</strong> видна только у записей со статусом "Ошибка ЛС"',
                    'ID пользователя — кликабельная ссылка на профиль ВКонтакте'
                ]}
            >
                <SendingTableDemo />
            </Sandbox>

            <hr className="!my-10" />

            {/* Иконка чата */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Иконка чата (диалог с победителем)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В колонке "Чат" есть иконка диалога (три точки). При клике она открывает переписку ВКонтакте с победителем.
            </p>

            <div className="not-prose my-6 flex items-start gap-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <button className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center p-1.5 rounded-full hover:bg-indigo-50 transition-colors border border-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
                <div className="flex-1">
                    <p className="text-sm text-indigo-900 font-semibold mb-1">Зачем нужна эта иконка?</p>
                    <p className="text-xs text-indigo-800">
                        Если победитель пишет вам "Не получил промокод" или задаёт вопросы, не нужно искать его в сообщениях вручную. 
                        Просто кликните на иконку чата — откроется диалог с этим пользователем в новой вкладке.
                    </p>
                    <p className="text-xs text-indigo-700 mt-2">
                        <strong>Цвет:</strong> Серый по умолчанию, при наведении становится indigo-600 с фоном indigo-50.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Кнопки повторной отправки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Повторная отправка промокодов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если у записи статус "Ошибка ЛС", доступны два варианта повторной отправки:
            </p>

            <div className="not-prose my-6 space-y-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <button className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors flex-shrink-0">
                            Повторить
                        </button>
                        <div>
                            <p className="font-semibold text-gray-900">Кнопка "Повторить" (одиночная)</p>
                            <p className="text-sm text-gray-700 mt-1">
                                Находится в последней колонке таблицы, только у записей со статусом ошибки. 
                                При нажатии система попытается снова отправить промокод в личные сообщения этому конкретному победителю.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>Когда использовать:</strong> Если победитель написал вам, что открыл ЛС и готов принять сообщение.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2 flex-shrink-0">
                            Повторить всем (4)
                        </button>
                        <div>
                            <p className="font-semibold text-gray-900">Кнопка "Повторить всем (N)"</p>
                            <p className="text-sm text-gray-700 mt-1">
                                Находится в шапке таблицы, появляется только если есть хотя бы одна запись с ошибкой. 
                                В скобках показано количество ошибок. При нажатии система попытается повторно отправить в ЛС ВСЕМ пользователям со статусом ошибки.
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                                <strong>Когда использовать:</strong> Если вы знаете, что была временная проблема с API ВКонтакте, или хотите попробовать отправить всем разом.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Повторная отправка НЕ создаёт дубликаты промокодов. 
                    Система просто пытается отправить тот же самый промокод снова, но уже в ЛС вместо комментария.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Советы по использованию */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда использовать этот журнал</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">🔍 Проверка доставки</h3>
                    <p className="text-sm text-purple-800">
                        Если победитель пишет "Не получил промокод", откройте журнал и найдите его по имени. 
                        Вы сразу увидите: отправлялось ли сообщение, какой был статус, когда это произошло.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">🔄 Повторная отправка</h3>
                    <p className="text-sm text-purple-800">
                        Если у нескольких победителей статус "Ошибка ЛС", можете попробовать массовую повторную отправку. 
                        Возможно, они уже открыли личные сообщения и смогут получить промокод удобным способом.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">💬 Быстрая связь</h3>
                    <p className="text-sm text-purple-800">
                        Используйте иконку чата для мгновенного перехода в диалог с победителем. 
                        Не нужно искать его в сообщениях — один клик и вы в переписке.
                    </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-900 mb-2">📊 Статистика конкурса</h3>
                    <p className="text-sm text-purple-800">
                        Счётчики показывают общую картину: сколько промокодов доставлено успешно, у скольких были проблемы. 
                        Это помогает оценить качество работы конкурса.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Админ-функция */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Очистка журнала (только для администраторов)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В шапке таблицы есть кнопка "Очистить журнал" — она видна только пользователям с ролью <code>admin</code>.
            </p>

            <div className="not-prose bg-red-50 border border-red-200 rounded-lg p-4 my-6">
                <div className="flex items-start gap-3">
                    <button className="px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50 flex-shrink-0">
                        Очистить журнал
                    </button>
                    <div>
                        <p className="text-sm text-red-900 font-semibold mb-1">Функция для очистки истории отправок</p>
                        <p className="text-xs text-red-800 mb-2">
                            При нажатии удаляются ВСЕ записи из журнала отправок. Это полезно, если нужно "обнулить" историю перед новым циклом конкурса.
                        </p>
                        <p className="text-xs text-red-700">
                            <strong>⚠️ Важно:</strong> Очистка журнала НЕ влияет на базу промокодов. 
                            Выданные промокоды остаются помечены как "Выдан" во вкладке "Промокоды". Удаляется только история сообщений.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Частые вопросы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

            <div className="not-prose space-y-4 my-6">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Что делать, если победитель пишет "Не получил промокод"?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        1. Откройте журнал отправки и найдите его по имени.<br/>
                        2. Проверьте статус: если "Доставлено (ЛС)" — скажите победителю проверить личные сообщения от вашего сообщества.<br/>
                        3. Если "Ошибка ЛС" — скажите победителю посмотреть комментарии под его постом-отзывом, там есть промокод.<br/>
                        4. Если победитель говорит, что открыл ЛС — нажмите кнопку "Повторить" для повторной отправки.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Почему так много записей со статусом "Ошибка ЛС"?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Это нормально! Многие пользователи ВКонтакте запрещают личные сообщения от сообществ в настройках приватности. 
                        Но промокоды всё равно доставлены — они отправлены комментариями под постами победителей. 
                        Высокий процент ошибок ЛС не означает проблему с системой.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Можно ли удалить отдельную запись из журнала?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Нет, удаление отдельных записей не предусмотрено. Доступна только полная очистка журнала (кнопка "Очистить журнал" для администраторов). 
                        Журнал — это архив для контроля, изменять его вручную не имеет смысла.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Что происходит при повторной отправке?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Система пытается снова отправить промокод в личные сообщения победителю. 
                        Если ЛС всё ещё закрыто — статус останется "Ошибка ЛС" (промокод уже есть в комментарии). 
                        Если ЛС открыто — статус изменится на "Доставлено (ЛС)" и победитель получит уведомление в диалогах.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">Зачем нужна кнопка "Повторить всем", если промокоды уже в комментариях?</summary>
                    <p className="text-sm text-gray-700 mt-2">
                        Промокод в комментарии менее удобен для пользователя: комментарий может потеряться, его сложнее найти. 
                        Личное сообщение — это более надёжный и приватный способ доставки. 
                        Кнопка "Повторить всем" полезна, если вы хотите улучшить пользовательский опыт и попробовать доставить промокоды в ЛС после того, как победители открыли настройки приватности.
                    </p>
                </details>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-2-6-sending-list" />
        </article>
    );
};
