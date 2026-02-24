import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

/**
 * 2.4.7.1. Обзор функционала конкурса активности
 * 
 * ВАЖНО: Функционал находится на этапе планирования.
 * Эта страница описывает концепцию планируемой автоматизации.
 */
export const ActivityContestOverviewPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Предупреждение */}
            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-semibold">
                            ⚠️ Функционал "Конкурс «Актив»" находится на этапе планирования. 
                            Эта страница описывает концепцию будущей автоматизации.
                        </p>
                    </div>
                </div>
            </div>

            {/* Что это такое */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое конкурс активности</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Конкурс «Актив»</strong> — это планируемая автоматизация для определения самых активных 
                участников сообщества на основе их взаимодействия с контентом.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В отличие от разовых конкурсов (где нужно выполнить одно действие), здесь побеждают те, 
                кто регулярно проявляет активность: ставит лайки, комментирует, делает репосты. 
                Система подсчитывает баллы за каждое действие и в конце периода определяет победителей.
            </p>

            {/* Раньше vs Теперь */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это было раньше vs как будет с автоматизацией</h3>

            <div className="not-prose my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Раньше */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <h4 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (ручная работа)</h4>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Открывать каждый пост сообщества и смотреть кто лайкнул/прокомментировал</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вести таблицу Excel с именами участников и количеством действий</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вручную проверять каждый день/неделю новую активность</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Риск ошибиться в подсчете или пропустить чью-то активность</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>На месячный конкурс — 15-20 часов ручной работы</span>
                            </li>
                        </ul>
                    </div>

                    {/* Теперь */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h4 className="text-lg font-bold text-green-900 mb-3">✅ С автоматизацией (планируется)</h4>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Система автоматически отслеживает все действия участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Подсчет баллов происходит в режиме реального времени</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Видно текущий топ участников в любой момент конкурса</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматическое определение победителей по итогам периода</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Публикация итогов и отправка призов — без вашего участия</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Как будет работать система */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как будет работать система</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планируемая логика работы автоматизации:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <ol className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Настройка конкурса</h4>
                                <p className="text-sm text-gray-700">
                                    Вы задаете период конкурса (неделя, месяц, квартал), количество победителей и стоимость 
                                    каждого действия в баллах (например: лайк = 1 балл, комментарий = 3 балла, репост = 5 баллов).
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Сбор данных</h4>
                                <p className="text-sm text-gray-700">
                                    Система периодически (каждые 30-60 минут) запрашивает у VK API список всех лайков, 
                                    комментариев и репостов на постах сообщества за период конкурса.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Подсчет баллов</h4>
                                <p className="text-sm text-gray-700">
                                    Для каждого участника суммируются баллы за все его действия. Данные сохраняются в базу 
                                    и обновляются при каждой проверке. Вы видите актуальный рейтинг в реальном времени.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Защита от накрутки</h4>
                                <p className="text-sm text-gray-700">
                                    Система фильтрует подозрительные аккаунты: созданные недавно, без аватарки, 
                                    с пустым профилем или нереалистично высокой активностью (например, 1000 лайков за день).
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Подведение итогов</h4>
                                <p className="text-sm text-gray-700">
                                    По окончании периода конкурса система автоматически определяет топ-N участников 
                                    с наибольшим количеством баллов, публикует пост с итогами и отправляет призы победителям 
                                    в личные сообщения.
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Система подсчета баллов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Система подсчета баллов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планируется гибкая система настройки стоимости действий. Вы сами решаете, сколько баллов 
                стоит каждый тип активности:
            </p>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Действие</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Примерная стоимость</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Логика</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Лайк</td>
                            <td className="px-4 py-3 border-b border-gray-200">1 балл</td>
                            <td className="px-4 py-3 border-b border-gray-200">Самое простое действие, минимальная вовлеченность</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Комментарий</td>
                            <td className="px-4 py-3 border-b border-gray-200">3-5 баллов</td>
                            <td className="px-4 py-3 border-b border-gray-200">Требует времени и вовлечения, ценнее для алгоритмов VK</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Репост</td>
                            <td className="px-4 py-3 border-b border-gray-200">5-10 баллов</td>
                            <td className="px-4 py-3 border-b border-gray-200">Расширяет охват, показывает контент друзьям участника</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Сторис (опционально)</td>
                            <td className="px-4 py-3">10-20 баллов</td>
                            <td className="px-4 py-3">Максимальное вовлечение — если участник упоминает сообщество в сторис</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Рекомендация по настройке баллов</h4>
                <p className="text-sm text-blue-800">
                    Делайте разницу в стоимости значительной (1:3:5 или 1:5:10), чтобы стимулировать более ценные действия. 
                    Если комментарий стоит всего 2 балла вместо 1 за лайк — участники будут просто лайкать, 
                    это проще и быстрее.
                </p>
            </div>

            {/* Защита от накрутки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Защита от накрутки</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планируется многоуровневая система защиты от недобросовестных участников:
            </p>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">1. Фильтрация подозрительных аккаунтов</h4>
                        <p className="text-sm text-gray-700">
                            Система проверяет профиль каждого участника: аватарка, заполненность профиля, 
                            дата регистрации, количество друзей. Аккаунты, созданные недавно или выглядящие как боты, 
                            не учитываются в конкурсе.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">2. Лимит действий в день</h4>
                        <p className="text-sm text-gray-700">
                            Можно установить максимальное количество засчитываемых действий одного типа в день 
                            (например, не более 50 лайков). Если участник лайкнул 200 постов за час — 
                            это явная накрутка, засчитаются только первые 50.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">3. Черный список</h4>
                        <p className="text-sm text-gray-700">
                            Возможность вручную добавить аккаунты в черный список. Их активность не будет учитываться 
                            ни в текущем, ни в будущих конкурсах.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">4. Ручная модерация перед итогами</h4>
                        <p className="text-sm text-gray-700">
                            Перед объявлением победителей система покажет вам топ-10 участников. 
                            Вы сможете проверить их профили и вручную исключить подозрительных перед публикацией итогов.
                        </p>
                    </div>
                </div>
            </div>

            {/* Сравнение с другими конкурсами */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Отличие от других конкурсов</h2>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Критерий</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Конкурс «Актив»</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Универсальные конкурсы</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Конкурс отзывов</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Длительность</td>
                            <td className="px-4 py-3 border-b border-gray-200">Долгосрочный (неделя-месяц)</td>
                            <td className="px-4 py-3 border-b border-gray-200">Короткий (1-7 дней)</td>
                            <td className="px-4 py-3 border-b border-gray-200">Непрерывный</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Условие победы</td>
                            <td className="px-4 py-3 border-b border-gray-200">Наибольшая активность</td>
                            <td className="px-4 py-3 border-b border-gray-200">Случайный выбор</td>
                            <td className="px-4 py-3 border-b border-gray-200">Каждый N-й участник</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Что учитывается</td>
                            <td className="px-4 py-3 border-b border-gray-200">Лайки, комментарии, репосты на ВСЕХ постах</td>
                            <td className="px-4 py-3 border-b border-gray-200">Действия на ОДНОМ посте</td>
                            <td className="px-4 py-3 border-b border-gray-200">Только отзывы на товары</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Стимул</td>
                            <td className="px-4 py-3 border-b border-gray-200">Регулярно возвращаться к контенту</td>
                            <td className="px-4 py-3 border-b border-gray-200">Разовое участие</td>
                            <td className="px-4 py-3 border-b border-gray-200">Писать отзывы</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Справедливость</td>
                            <td className="px-4 py-3"><strong className="text-orange-600">Средняя</strong> (кто больше времени тратит)</td>
                            <td className="px-4 py-3"><strong className="text-green-600">Высокая</strong> (случайность)</td>
                            <td className="px-4 py-3"><strong className="text-yellow-600">Средняя</strong> (кто быстрее)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            1. Когда появится этот функционал?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Функционал находится в backlog разработки. Точные сроки зависят от приоритетов команды. 
                            Следите за обновлениями в разделе "Changelog" приложения.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            2. Можно ли будет проводить несколько конкурсов одновременно?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            В первой версии планируется только один активный конкурс на проект. 
                            Возможность одновременных конкурсов может появиться позже.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            3. Будет ли учитываться качество комментариев?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            В базовой версии — нет, все комментарии стоят одинаковое количество баллов. 
                            Но планируется ручная модерация перед итогами, где можно исключить спам-комментарии 
                            типа "+", "ок", "123".
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            4. Как быть с участниками, которые удаляют лайки/репосты после подсчета?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Система сохраняет данные о действиях в момент проверки. Если участник потом удалит лайк — 
                            баллы не пересчитываются. Данные зафиксированы в базе на момент сбора.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            5. Можно ли будет видеть промежуточные итоги?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Да, планируется живая таблица с топ-участниками и их баллами. 
                            Вы сможете видеть текущий рейтинг в любой момент конкурса. 
                            Также можно будет публиковать промежуточные итоги для участников.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            6. Какие призы можно давать победителям?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Система поддерживает отправку промокодов из загруженного списка (как в других конкурсах). 
                            Для физических призов — система опубликует итоги и отправит уведомление победителям, 
                            далее связываетесь с ними вручную.
                        </p>
                    </details>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-7-1-overview" />
        </article>
    );
};
