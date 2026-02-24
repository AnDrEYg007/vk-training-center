import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// Mock-компоненты для демонстрации логов
// =====================================================================

// Типы логов
type LogLevel = 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING';
type DeliveryStatus = 'sent' | 'error';

interface SystemLogEntry {
    time: string;
    level: LogLevel;
    message: string;
}

interface DeliveryLogEntry {
    id: string;
    userName: string;
    userVkId: number;
    promoCode: string;
    prizeDescription: string;
    status: DeliveryStatus;
    createdAt: string;
}

// Компонент системных логов (стиль терминала из LogsTab.tsx)
const MockSystemLogs: React.FC = () => {
    const [logs] = useState<SystemLogEntry[]>([
        { time: '14:30:05', level: 'INFO', message: 'Scanner started. Keyword: "#отзыв"' },
        { time: '14:30:12', level: 'SUCCESS', message: 'Found new post id:12345 from User id:998877' },
        { time: '14:30:13', level: 'INFO', message: 'Comment posted. Number: 1' },
        { time: '14:35:00', level: 'SUCCESS', message: 'Found new post id:12346 from User id:554433' },
        { time: '14:35:02', level: 'ERROR', message: 'Failed to post comment: VK API error (rate limit)' },
        { time: '14:35:05', level: 'WARNING', message: 'User id:112233 is in blacklist, skipping...' },
    ]);

    const getLevelColor = (level: LogLevel): string => {
        switch (level) {
            case 'INFO': return 'text-blue-400';
            case 'SUCCESS': return 'text-green-400';
            case 'ERROR': return 'text-red-400';
            case 'WARNING': return 'text-amber-400';
        }
    };

    return (
        <div className="bg-black/90 rounded-lg shadow border border-gray-700 overflow-hidden">
            <div className="p-2 border-b border-gray-700 bg-black flex justify-between items-center">
                <h4 className="font-semibold text-gray-400 text-sm">System Logs</h4>
                <button className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded hover:bg-gray-700 transition-colors">
                    Clear
                </button>
            </div>
            <div className="p-4 overflow-y-auto custom-scrollbar space-y-1 h-64 text-gray-300 font-mono text-xs">
                {logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2">
                        <span className="text-gray-500">[{log.time}]</span>
                        <span className={getLevelColor(log.level)}>{log.level}:</span>
                        <span>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Компонент журнала отправки призов (из SendingListTab.tsx)
const MockDeliveryLogs: React.FC = () => {
    const [logs] = useState<DeliveryLogEntry[]>([
        {
            id: '1',
            userName: 'Анна Петрова',
            userVkId: 123456789,
            promoCode: 'PROMO500',
            prizeDescription: 'Скидка 500₽ на следующую покупку',
            status: 'sent',
            createdAt: '2026-02-18T14:30:00'
        },
        {
            id: '2',
            userName: 'Иван Сидоров',
            userVkId: 987654321,
            promoCode: 'GIFT100',
            prizeDescription: 'Подарок при заказе от 1000₽',
            status: 'error',
            createdAt: '2026-02-18T14:32:00'
        },
        {
            id: '3',
            userName: 'Мария Иванова',
            userVkId: 555444333,
            promoCode: 'WINNER2024',
            prizeDescription: 'Бесплатная доставка',
            status: 'sent',
            createdAt: '2026-02-18T14:35:00'
        },
    ]);

    const [isRetrying, setIsRetrying] = useState<string | null>(null);

    const handleRetry = (logId: string) => {
        setIsRetrying(logId);
        setTimeout(() => {
            setIsRetrying(null);
            alert('Сообщение успешно отправлено повторно!');
        }, 1000);
    };

    const stats = {
        sent: logs.filter(l => l.status === 'sent').length,
        error: logs.filter(l => l.status === 'error').length
    };

    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-wrap gap-4">
                <h4 className="font-semibold text-gray-700">Журнал отправки призов</h4>
                <div className="flex items-center gap-4">
                    <div className="flex gap-4 text-sm">
                        <span className="text-green-600">Успешно: <strong>{stats.sent}</strong></span>
                        <span className="text-red-500">Ошибки: <strong>{stats.error}</strong></span>
                    </div>
                    {stats.error > 0 && (
                        <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
                            Повторить всем ({stats.error})
                        </button>
                    )}
                    <button className="px-3 py-1.5 text-sm font-medium rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50">
                        Очистить журнал
                    </button>
                </div>
            </div>
            
            <div className="overflow-x-auto">
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
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <div className="font-medium text-gray-900">{log.userName}</div>
                                            <a href="#" className="text-xs text-indigo-500 hover:underline">
                                                ID: {log.userVkId}
                                            </a>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="font-mono text-gray-700 font-medium">{log.promoCode}</div>
                                    <div className="text-xs text-gray-500 truncate max-w-xs">{log.prizeDescription}</div>
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
                                    {new Date(log.createdAt).toLocaleString('ru-RU')}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <a 
                                        href="#" 
                                        className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Открыть диалог с пользователем"
                                    >
                                        {/* Иконка сообщений из SendingListTab.tsx строка 192-193 */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </a>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    {log.status === 'error' && (
                                        <button
                                            onClick={() => handleRetry(log.id)}
                                            disabled={isRetrying === log.id}
                                            className="text-xs font-medium text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                                        >
                                            {isRetrying === log.id ? '...' : 'Повторить'}
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
export const ProductsReviewsContestLogsPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-lg max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================================= */}
            {/* ВВЕДЕНИЕ */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что такое логи в автоматизации конкурсов
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Логи — это история всех событий, которые происходят в системе конкурсов. В приложении есть два типа логов:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Системные логи</strong> — показывают работу автоматизации в реальном времени (поиск постов, комментарии, ошибки VK API)</li>
                    <li><strong>Журнал отправки призов</strong> — фиксирует каждую попытку отправить промокод победителю (успешно или с ошибкой)</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Это как журнал действий: раньше приходилось помнить всё в голове («кому отправил, кому нет»), теперь система записывает каждое действие с временем и статусом.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================================= */}
            {/* БЫЛО/СТАЛО */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Было/Стало: От хаоса к контролю
                </h2>
                <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
                    {/* БЫЛО */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-red-800 mb-4">❌ Было (без логов)</h3>
                        <ul className="space-y-3 text-sm text-red-900">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Не понятно, почему конкурс не находит новые посты — приходится вручную проверять ВКонтакте</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>При ошибках отправки не понятно, кто из победителей не получил приз</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Нет истории — не можем понять, когда и почему возникла проблема</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Приходится писать вручную: кому отправлено, кому нужно повторить</span>
                            </li>
                        </ul>
                    </div>

                    {/* СТАЛО */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-green-800 mb-4">✅ Стало (с логами)</h3>
                        <ul className="space-y-3 text-sm text-green-900">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Видно в реальном времени: сколько постов найдено, сколько прокомментировано</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Все ошибки записываются с описанием — легко понять причину</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Журнал отправки показывает: кому доставлено, у кого ошибка, с кнопкой «Повторить»</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>История сохраняется — можно разобраться в проблеме через день или неделю</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================================= */}
            {/* СИСТЕМНЫЕ ЛОГИ (Терминал) */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Системные логи (терминал)
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Системные логи отображаются в стиле <strong>терминала программиста</strong> — чёрный фон, цветные сообщения. Это техническая информация для отладки работы автоматизации.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Уровни логов и их значение
                </h3>
                <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-blue-400 text-white text-xs font-mono rounded">INFO</span>
                            <span className="font-semibold text-blue-900">Информация</span>
                        </div>
                        <p className="text-sm text-blue-800">
                            Обычные действия системы: запуск сканера, публикация комментария, поиск постов
                        </p>
                    </div>

                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-green-400 text-white text-xs font-mono rounded">SUCCESS</span>
                            <span className="font-semibold text-green-900">Успех</span>
                        </div>
                        <p className="text-sm text-green-800">
                            Успешные операции: найден новый пост, комментарий опубликован, победитель выбран
                        </p>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-red-400 text-white text-xs font-mono rounded">ERROR</span>
                            <span className="font-semibold text-red-900">Ошибка</span>
                        </div>
                        <p className="text-sm text-red-800">
                            Проблемы работы: ошибка VK API, не удалось опубликовать комментарий, превышен лимит запросов
                        </p>
                    </div>

                    <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 bg-amber-400 text-white text-xs font-mono rounded">WARNING</span>
                            <span className="font-semibold text-amber-900">Предупреждение</span>
                        </div>
                        <p className="text-sm text-amber-800">
                            Важные события: пользователь в чёрном списке, пост пропущен, дубликат участника
                        </p>
                    </div>
                </div>
            </section>

            {/* Sandbox: Системные логи */}
            <div className="not-prose">
                <Sandbox
                    title="🖥️ Интерактивная демонстрация: Системные логи"
                    description="Так выглядит окно системных логов в реальном приложении. Записи появляются в реальном времени с временными метками."
                    instructions={[
                        'Каждая запись содержит: <strong>время</strong>, <strong>уровень</strong> (INFO/SUCCESS/ERROR/WARNING) и <strong>описание события</strong>',
                        'Цвета помогают быстро увидеть проблемы: красный = ошибка, жёлтый = предупреждение',
                        'Кнопка <strong>"Clear"</strong> очищает окно логов (но не удаляет историю из базы)'
                    ]}
                >
                    <MockSystemLogs />
                </Sandbox>
            </div>

            <hr className="!my-10" />

            {/* ============================================================= */}
            {/* ЖУРНАЛ ОТПРАВКИ ПРИЗОВ */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Журнал отправки призов
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Журнал отправки — это отдельная таблица, где записывается каждая попытка отправить промокод победителю. Здесь можно увидеть: кто получил приз, у кого возникла ошибка, и повторить отправку одной кнопкой.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Структура таблицы (6 колонок)
                </h3>
                <div className="not-prose my-6 overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Колонка</th>
                                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Что показывает</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><strong>Пользователь</strong></td>
                                <td className="border border-gray-300 px-4 py-2">ФИО победителя + ссылка на его профиль ВКонтакте</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2"><strong>Выданный приз (Код)</strong></td>
                                <td className="border border-gray-300 px-4 py-2">Промокод (например, PROMO500) + описание (Скидка 500₽)</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><strong>Статус отправки</strong></td>
                                <td className="border border-gray-300 px-4 py-2">Зелёный бэдж "Доставлено (ЛС)" или красный "Ошибка ЛС"</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2"><strong>Время</strong></td>
                                <td className="border border-gray-300 px-4 py-2">Дата и время попытки отправки</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-4 py-2"><strong>Чат</strong></td>
                                <td className="border border-gray-300 px-4 py-2">Иконка сообщений — ссылка на диалог с пользователем ВКонтакте</td>
                            </tr>
                            <tr className="bg-gray-50">
                                <td className="border border-gray-300 px-4 py-2"><strong>Действия</strong></td>
                                <td className="border border-gray-300 px-4 py-2">Кнопка "Повторить" (появляется только при ошибке)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Статусы отправки
                </h3>
                <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-3">
                            Доставлено (ЛС)
                        </span>
                        <p className="text-sm text-green-900">
                            Промокод успешно отправлен в личные сообщения пользователю. Победитель получил приз.
                        </p>
                    </div>

                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <div className="flex flex-col gap-1 mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 w-fit">
                                Ошибка ЛС
                            </span>
                            <span className="text-xs text-gray-600">Отправлен комментарий</span>
                        </div>
                        <p className="text-sm text-red-900">
                            Не удалось отправить ЛС (закрытые сообщения), но система автоматически опубликовала промокод в комментарии под постом победителя.
                        </p>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Управляющие кнопки
                </h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>
                        <strong>Повторить всем (N)</strong> — появляется, если есть ошибки. Автоматически повторяет отправку всем пользователям со статусом «Ошибка ЛС». Кнопка синяя (indigo).
                    </li>
                    <li>
                        <strong>Очистить журнал</strong> — удаляет все записи из таблицы (доступно только администраторам). Это не влияет на базу промокодов! Кнопка красная с красной обводкой.
                    </li>
                    <li>
                        <strong>Повторить</strong> (в каждой строке с ошибкой) — повторная попытка отправки сообщения конкретному пользователю. Кнопка с синей обводкой на синем фоне.
                    </li>
                </ul>
            </section>

            {/* Sandbox: Журнал отправки */}
            <div className="not-prose">
                <Sandbox
                    title="📋 Интерактивная демонстрация: Журнал отправки призов"
                    description="Так выглядит таблица журнала отправки в реальном приложении. Здесь видно все попытки доставки промокодов победителям."
                    instructions={[
                        'В шапке таблицы — <strong>статистика</strong>: сколько успешно отправлено (зелёный) и сколько ошибок (красный)',
                        'Для записей с ошибкой доступна кнопка <strong>"Повторить"</strong> — система попробует отправить ЛС ещё раз',
                        'Иконка сообщений в колонке "Чат" открывает диалог с пользователем ВКонтакте (в приложении сообществ)',
                        'При наведении на строку она подсвечивается серым — так удобнее читать длинные таблицы'
                    ]}
                >
                    <MockDeliveryLogs />
                </Sandbox>
            </div>

            <hr className="!my-10" />

            {/* ============================================================= */}
            {/* СОВЕТЫ */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    💡 Практические советы
                </h2>
                
                <div className="not-prose space-y-4 my-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="font-semibold text-blue-900 mb-1">1. Следите за ошибками в реальном времени</p>
                        <p className="text-sm text-blue-800">
                            Если в системных логах появляется <span className="font-mono text-red-600">ERROR</span> — изучите причину сразу. Частые ошибки VK API могут означать проблемы с токеном или превышение лимитов.
                        </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="font-semibold text-green-900 mb-1">2. Используйте «Повторить всем» при массовых ошибках</p>
                        <p className="text-sm text-green-800">
                            Если видите 5+ записей со статусом «Ошибка ЛС», не нажимайте кнопку «Повторить» для каждой вручную — используйте массовую кнопку «Повторить всем».
                        </p>
                    </div>

                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                        <p className="font-semibold text-amber-900 mb-1">3. Очищайте журнал после завершения конкурса</p>
                        <p className="text-sm text-amber-800">
                            Журнал отправки накапливается после каждого конкурса. После подведения итогов и успешной доставки всех призов — очистите журнал, чтобы не путаться в следующий раз.
                        </p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                        <p className="font-semibold text-purple-900 mb-1">4. Проверяйте ссылку на диалог при ошибках</p>
                        <p className="text-sm text-purple-800">
                            Если отправка не удалась, кликните на иконку сообщений — откроется диалог ВКонтакте. Возможно, пользователь закрыл ЛС или заблокировал сообщество.
                        </p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="font-semibold text-red-900 mb-1">5. Не паникуйте при статусе «Ошибка ЛС»</p>
                        <p className="text-sm text-red-800">
                            Даже если ЛС не доставлено, система автоматически публикует промокод в комментарии под постом победителя — приз НЕ потерян!
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================================= */}
            {/* FAQ */}
            {/* ============================================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    ❓ Часто задаваемые вопросы
                </h2>

                <div className="not-prose space-y-6 my-6">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            1. В чём разница между системными логами и журналом отправки?
                        </h3>
                        <p className="text-gray-700">
                            <strong>Системные логи</strong> — это техническая информация для отладки (поиск постов, API-запросы, ошибки). 
                            <strong>Журнал отправки</strong> — это конкретная история: кому отправлен приз, когда, успешно или нет. 
                            Логи нужны технарям, журнал — всем специалистам.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            2. Можно ли восстановить удалённые логи?
                        </h3>
                        <p className="text-gray-700">
                            Нет. Кнопка «Очистить журнал» удаляет записи безвозвратно. Системные логи (в терминале) сбрасываются кнопкой «Clear» только из окна (не из базы), но при перезагрузке страницы терминал будет пустым.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            3. Почему статус «Ошибка ЛС», но написано «Отправлен комментарий»?
                        </h3>
                        <p className="text-gray-700">
                            Система всегда пытается отправить промокод в личные сообщения. Если пользователь закрыл ЛС от сообщества, ВКонтакте вернёт ошибку. Тогда система автоматически публикует промокод в комментарии под постом победителя, чтобы приз не потерялся.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            4. Зачем повторять отправку, если уже опубликован комментарий?
                        </h3>
                        <p className="text-gray-700">
                            Иногда ошибка временная (например, VK API не отвечал). Через несколько минут пользователь может открыть ЛС, и тогда повторная попытка отправит промокод в сообщения (это приватнее, чем комментарий).
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            5. Где хранятся системные логи? Можно ли их скачать?
                        </h3>
                        <p className="text-gray-700">
                            В текущей версии системные логи отображаются только в окне терминала (не сохраняются в базу). Функция экспорта логов планируется в будущих обновлениях. Журнал отправки призов сохраняется в базе данных до ручной очистки.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            6. Какие события не попадают в логи?
                        </h3>
                        <p className="text-gray-700">
                            В логи попадают только события автоматизации (сбор постов, комментарии, отправка призов). Ручные действия специалистов (редактирование настроек, добавление в чёрный список) в логах не отображаются — для них есть отдельные разделы.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-2-9-logs" />
        </article>
    );
};
