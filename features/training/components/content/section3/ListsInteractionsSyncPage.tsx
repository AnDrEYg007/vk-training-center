import React from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';
import {
    SyncInteractionsButtonDemo,
    InteractionSyncModalDemo,
    SyncProgressStatesDemo,
    SyncResultsComparisonDemo,
    SyncErrorsDemo,
    TwoButtonsComparisonDemo,
    InteractionTypesDemo,
    DatePeriodPickerDemo,
} from './ListsMocks';

// =====================================================================
// Страница "3.2.6. Синхронизация взаимодействий"
// =====================================================================

export const ListsInteractionsSyncPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================== */}
            {/* 1. ЗАЧЕМ НУЖНА СИНХРОНИЗАЦИЯ? */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Зачем нужна синхронизация взаимодействий?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Данные о лайках, комментариях и репостах <strong>не появляются автоматически</strong> при создании постов. Их нужно собрать вручную, запустив процесс синхронизации за выбранный период времени.
            </p>

            <div className="not-prose grid grid-cols-2 gap-6 my-8">
                {/* Раньше */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                        <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h3 className="text-lg font-bold text-red-900">Раньше</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-red-800">
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Данные о лайках/комментах видны только при открытии поста в VK</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>ВКонтакте показывает максимум 100 пользователей</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Нет возможности посмотреть историю активности за период</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Невозможно найти "суперфанов" сообщества</span>
                        </li>
                    </ul>
                </div>

                {/* Сейчас */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                        <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-lg font-bold text-green-900">Сейчас</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Все взаимодействия за любой период собираются автоматически</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Полные профили пользователей с демографией</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>История активности каждого пользователя</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Возможность экспорта активных пользователей для рассылок</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ============================================== */}
            {/* 2. ГДЕ НАХОДИТСЯ КНОПКА СИНХРОНИЗАЦИИ? */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Где находится кнопка синхронизации?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка синхронизации — это маленькая кнопка с иконкой <strong>циркулярных стрелок</strong> (refresh) в правом верхнем углу карточек списков "Лайкали", "Комментировали" и "Репостили".
            </p>

            <Sandbox
                title="Расположение кнопки синхронизации"
                description="Наведите курсор на кнопку refresh, чтобы увидеть реакцию"
            >
                <SyncInteractionsButtonDemo />
            </Sandbox>

            {/* ============================================== */}
            {/* 3. ЗАПУСК СИНХРОНИЗАЦИИ (ПОШАГОВО) */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Запуск синхронизации (пошагово)
            </h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Шаг 1:</strong> Нажмите на кнопку refresh на любой карточке (Лайкали/Комментировали/Репостили)</li>
                <li><strong>Шаг 2:</strong> В открывшемся модальном окне выберите период сбора данных</li>
                <li><strong>Шаг 3:</strong> Нажмите кнопку "Запустить"</li>
                <li><strong>Шаг 4:</strong> Дождитесь завершения процесса (показывается прогресс на кнопке)</li>
            </ol>

            <Sandbox
                title="Интерактивное модальное окно синхронизации"
                description="Полностью рабочая демонстрация — попробуйте выбрать период и запустить"
                instructions={[
                    'Используйте <strong>preset-кнопки</strong> для быстрого выбора (Неделя, Месяц, Год)',
                    'Или выберите даты вручную в полях <strong>"С"</strong> и <strong>"По"</strong>',
                    'Нажмите <strong>"Запустить"</strong>, чтобы увидеть имитацию процесса',
                ]}
            >
                <div className="flex justify-center">
                    <InteractionSyncModalDemo />
                </div>
            </Sandbox>

            {/* ============================================== */}
            {/* 4. ВЫБОР ПЕРИОДА СБОРА */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Выбор периода сбора данных
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В модальном окне доступны <strong>6 preset-кнопок</strong> для быстрого выбора периода и возможность ручного ввода дат:
            </p>

            <Sandbox
                title="Интерактивный выбор периода"
                description="Нажимайте на preset'ы, чтобы увидеть результат"
            >
                <DatePeriodPickerDemo />
            </Sandbox>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Preset</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Период</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Когда использовать</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Неделя</td>
                            <td className="px-4 py-3 text-gray-600">Последние 7 дней</td>
                            <td className="px-4 py-3 text-gray-600">Регулярное обновление активных проектов</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Месяц</td>
                            <td className="px-4 py-3 text-gray-600">Последние 30 дней</td>
                            <td className="px-4 py-3 text-gray-600">Ежемесячный анализ аудитории</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Квартал</td>
                            <td className="px-4 py-3 text-gray-600">Последние 90 дней</td>
                            <td className="px-4 py-3 text-gray-600">Квартальные отчёты</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Полгода</td>
                            <td className="px-4 py-3 text-gray-600">Последние 180 дней</td>
                            <td className="px-4 py-3 text-gray-600">Полугодовой анализ</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Год</td>
                            <td className="px-4 py-3 text-gray-600">Последние 365 дней</td>
                            <td className="px-4 py-3 text-gray-600">Годовая статистика, первый запуск</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Прошлый год</td>
                            <td className="px-4 py-3 text-gray-600">1 янв — 31 дек прошлого года</td>
                            <td className="px-4 py-3 text-gray-600">Архивные данные, ретроспектива</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-green-900 mb-2">✓ Нет ограничений по периоду!</h4>
                <p className="text-sm text-green-800">
                    Раньше было ограничение в 92 дня, но благодаря оптимизации backend вы можете собрать данные за любой период — хоть за несколько лет. Единственное — чем больше период, тем дольше выполнение.
                </p>
            </div>

            {/* ============================================== */}
            {/* 5. ЧТО СОБИРАЕТСЯ? */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что собирается при синхронизации?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При запуске синхронизации собираются <strong>три типа взаимодействий</strong> одновременно:
            </p>

            <Sandbox
                title="Три типа взаимодействий"
                description="Все три списка обновляются одновременно"
            >
                <InteractionTypesDemo />
            </Sandbox>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-amber-900 mb-2">⚠️ Важная особенность</h4>
                <p className="text-sm text-amber-800">
                    Даже если вы нажали кнопку refresh только на карточке <strong>"Лайкали"</strong>, система обновит данные сразу во <strong>всех трёх списках</strong> (Лайкали + Комментировали + Репостили). Это сделано для оптимизации — один запрос собирает все типы взаимодействий одновременно.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Лимиты VK API</h3>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Тип</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Быстрый сбор</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Если больше</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Лайки</td>
                            <td className="px-4 py-3 text-gray-600">Первые 1000 на пост (execute)</td>
                            <td className="px-4 py-3 text-gray-600">Deep scan — дополнительные запросы</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Комментарии</td>
                            <td className="px-4 py-3 text-gray-600">Первые 100 на пост (execute)</td>
                            <td className="px-4 py-3 text-gray-600">Deep scan — дополнительные запросы</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Репосты</td>
                            <td className="px-4 py-3 text-gray-600 font-semibold">Первые 1000 на пост (требуются админские права!)</td>
                            <td className="px-4 py-3 text-gray-600">Deep scan — дополнительные запросы</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============================================== */}
            {/* 6. ПРОЦЕСС ВЫПОЛНЕНИЯ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Процесс выполнения синхронизации
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После нажатия кнопки "Запустить" процесс синхронизации проходит через <strong>4 фазы</strong>. Прогресс отображается на кнопке refresh карточки списка:
            </p>

            <Sandbox
                title="Фазы синхронизации (автоматическая смена)"
                description="Наблюдайте за сменой состояний на кнопке"
            >
                <SyncProgressStatesDemo />
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что происходит на backend?</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>PHASE 1: READ & PREPARE</strong> — получение проекта из БД, сбор токенов пользователей, выбор постов за период</li>
                <li><strong>PHASE 2.1: FAST SCAN</strong> — быстрый сбор первых 1000 лайков/репостов или 100 комментариев через execute-запросы</li>
                <li><strong>PHASE 2.2: DEEP SCAN</strong> — для постов с большим количеством взаимодействий докачиваются все данные</li>
                <li><strong>PHASE 3: WRITE</strong> — сохранение собранных взаимодействий в базу данных (bulk upsert)</li>
                <li><strong>PHASE 4: PROFILE ENRICHMENT</strong> — дополнительный запрос users.get для получения полных профилей (city, bdate, platform)</li>
                <li><strong>PHASE 5: META UPDATE</strong> — обновление счётчиков и даты последнего обновления</li>
            </ol>

            {/* ============================================== */}
            {/* 7. РЕЗУЛЬТАТЫ СИНХРОНИЗАЦИИ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Результаты синхронизации
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После успешного завершения синхронизации обновляются:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Счётчики на карточках</strong> — количество записей в каждом списке</li>
                <li><strong>Дата последнего обновления</strong> — timestamp в формате "25.02, 14:30"</li>
                <li><strong>Таблица взаимодействий</strong> — автоматически перезагружается с новыми данными</li>
            </ul>

            <Sandbox
                title="Сравнение: до и после синхронизации"
                description="Визуальная разница в счётчиках"
            >
                <SyncResultsComparisonDemo />
            </Sandbox>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-blue-900 mb-2">Silent Success</h4>
                <p className="text-sm text-blue-800">
                    Система <strong>не показывает отдельное уведомление</strong> об успешном завершении синхронизации. Вместо этого обновляются счётчики и дата на карточках — это и есть подтверждение успеха.
                </p>
            </div>

            {/* ============================================== */}
            {/* 8. ОШИБКИ И ПРОБЛЕМЫ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Ошибки и проблемы
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При возникновении ошибки показывается toast-уведомление с описанием проблемы:
            </p>

            <Sandbox
                title="Типичные ошибки синхронизации"
                description="Примеры реальных ошибок из кода"
            >
                <SyncErrorsDemo />
            </Sandbox>

            {/* ============================================== */}
            {/* 9. ДВЕ РАЗНЫЕ КНОПКИ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Синхронизация VS Обновление профилей
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В интерфейсе есть <strong>две разные кнопки refresh</strong> с разным назначением:
            </p>

            <Sandbox
                title="Сравнение двух кнопок"
                description="Разное назначение, разное расположение"
            >
                <TwoButtonsComparisonDemo />
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Когда что использовать?</h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Синхронизация взаимодействий</strong> (на карточках) — когда нужно собрать новые данные за период (первый запуск, регулярное обновление)</li>
                <li><strong>Обновление профилей</strong> (в панели фильтров) — когда данные уже собраны, но нужны актуальные профили (статусы забанен/удалён, изменение города)</li>
            </ul>

            {/* ============================================== */}
            {/* 10. ПРАКТИЧЕСКИЕ СОВЕТЫ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Практические советы
            </h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✓ Первый запуск</h4>
                    <p className="text-sm text-green-800">
                        Соберите данные <strong>за последний год</strong> для получения полной картины активности сообщества. Это займёт 5-10 минут, зато получите историю всех взаимодействий.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✓ Регулярное обновление</h4>
                    <p className="text-sm text-green-800">
                        Для активных сообществ запускайте синхронизацию <strong>1 раз в неделю</strong>. Для медленных проектов достаточно раза в месяц.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✓ Большие периоды</h4>
                    <p className="text-sm text-green-800">
                        Если собираете данные за год и более, лучше запускать процесс <strong>вечером или ночью</strong> — он может выполняться до 15 минут.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">✓ Для конкурсов</h4>
                    <p className="text-sm text-green-800">
                        Запускайте синхронизацию <strong>ПОСЛЕ окончания конкурса</strong> за точный период его проведения, чтобы собрать всех участников.
                    </p>
                </div>
            </div>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-amber-900 mb-2">⚡ Время выполнения</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                    <li>• <strong>Неделя (7 дней):</strong> 1-2 минуты</li>
                    <li>• <strong>Месяц (30 дней):</strong> 3-5 минут</li>
                    <li>• <strong>Квартал (90 дней):</strong> 5-8 минут</li>
                    <li>• <strong>Год (365 дней):</strong> 10-15 минут</li>
                </ul>
                <p className="text-xs text-amber-700 mt-2">
                    Время зависит от количества постов и активности сообщества. Для популярных пабликов с тысячами лайков на каждом посте процесс займёт больше времени.
                </p>
            </div>

            {/* ============================================== */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================== */}
            <NavigationButtons currentPath="3-2-6-sync" />
        </article>
    );
};
