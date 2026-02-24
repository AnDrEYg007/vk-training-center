import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * Обучающая страница: "2.4.3.2. Настройка дропа"
 * 
 * Описание параметров для автоматизации "Дроп промокодов".
 * ВАЖНО: Функционал находится в разработке, страница показывает планируемые возможности.
 * Обновлено: детальное описание всех настроек с примерами
 */

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const PromoDropSettingsPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Уведомление о разработке */}
            <div className="not-prose mb-8">
                <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
                    <div className="flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-amber-900 mb-2">Раздел в разработке</h3>
                            <p className="text-sm text-amber-800 leading-relaxed">
                                Функционал "Дроп промокодов" находится на этапе планирования. Эта страница описывает, 
                                какие настройки появятся, когда автоматизация будет реализована.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Введение */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что это за страница?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Страница настроек дропа промокодов — это место, где вы будете задавать правила конкурса: 
                    где искать комментарии, какое ключевое слово использовать, сколько промокодов раздать и как защитить конкурс от накруток.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Настройка дропа занимает 3-5 минут. После сохранения система начинает автоматически отслеживать комментарии 
                    и раздавать промокоды первым участникам.
                </p>
            </section>

            <hr className="!my-10" />

            {/* Было / Стало */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Было / Стало
                </h2>

                <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
                    {/* Было */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-red-900">Было (ручная работа)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-red-800">
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span>Постоянно обновлять страницу с постом, чтобы видеть новые комментарии</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span>Вручную искать комментарии с ключевым словом и запоминать имена</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span>Вручную отправлять промокоды каждому победителю в личные сообщения</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span>Риск ошибки: отправить код дважды одному человеку или пропустить кого-то</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-red-500 font-bold">•</span>
                                <span>Невозможно проводить дроп ночью — нужно быть онлайн</span>
                            </li>
                        </ul>
                    </div>

                    {/* Стало */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-green-900">Стало (автоматизация)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-green-800">
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Система сама мониторит комментарии в режиме реального времени</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Автоматически находит первых N человек с ключевым словом</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Сама отправляет промокоды в ЛС победителям с персональным сообщением</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Защита от дубликатов: один человек = один промокод</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-green-500 font-bold">•</span>
                                <span>Работает 24/7, можно запустить дроп в любое время</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Экономия времени:</strong> Вместо 1-2 часов ручного мониторинга и рассылки — 5 минут на настройку и 0 минут на контроль. 
                    Система всё делает сама.
                </p>
            </section>

            <hr className="!my-10" />

            {/* Описание будущего функционала */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Какие настройки будут на этой странице
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Когда функционал будет реализован, на странице настроек появятся следующие блоки:
                </p>

                <div className="not-prose my-6 space-y-4">
                    {/* Блок 1: Основные параметры */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base mb-2">1. Основные параметры</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Базовые настройки для запуска дропа: где искать участников и когда остановить раздачу.
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1">→</span>
                                        <span><strong>Ссылка на пост:</strong> URL поста ВКонтакте, под которым будет проходить дроп</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1">→</span>
                                        <span><strong>Ключевое слово:</strong> Слово или фраза для активации (например, "ХОЧУПРИЗ" или "#скидка20")</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1">→</span>
                                        <span><strong>Количество призов:</strong> Сколько промокодов раздать (например, первым 10 участникам)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-1">→</span>
                                        <span><strong>Временной диапазон:</strong> Когда начать и когда остановить мониторинг (опционально)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Блок 2: База промокодов */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base mb-2">2. База промокодов</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Управление списком промокодов, которые будут раздаваться победителям.
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">→</span>
                                        <span><strong>Загрузка из файла:</strong> CSV или TXT файл со списком промокодов (один код на строку)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">→</span>
                                        <span><strong>Ручное добавление:</strong> Возможность добавить коды прямо в интерфейсе</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">→</span>
                                        <span><strong>Просмотр остатка:</strong> Сколько кодов осталось и какие уже использованы</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-1">→</span>
                                        <span><strong>Дублирование защита:</strong> Система не отправит один код дважды</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Блок 3: Шаблоны сообщений */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base mb-2">3. Шаблоны сообщений</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Настройка текста, который система будет отправлять участникам в личные сообщения.
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        <span><strong>Сообщение победителю:</strong> Текст с промокодом (например: "Поздравляем! Ваш код: {'{'+ 'CODE' + '}'}")</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        <span><strong>Сообщение опоздавшим:</strong> Что отправить, если призы закончились</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        <span><strong>Переменные:</strong> Автоподстановка имени, кода, даты (как в конкурсе отзывов)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 mt-1">→</span>
                                        <span><strong>Эмодзи и форматирование:</strong> Поддержка смайликов и переносов строк</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Блок 4: Защита от накруток */}
                    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:shadow-sm transition-shadow">
                        <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-base mb-2">4. Защита от накруток</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Фильтры для защиты от ботов, накрутчиков и нечестных участников.
                                </p>
                                <ul className="text-sm text-gray-700 space-y-1.5">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">→</span>
                                        <span><strong>Черный список:</strong> Исключить определенных пользователей из участия</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">→</span>
                                        <span><strong>Возраст аккаунта:</strong> Минимальный возраст страницы ВК (например, от 3 месяцев)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">→</span>
                                        <span><strong>Подписка на сообщество:</strong> Участвовать могут только подписчики</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-500 mt-1">→</span>
                                        <span><strong>Лимит на пользователя:</strong> Один человек может выиграть только 1 раз (по умолчанию)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Сравнение с конкурсом отзывов */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Чем отличается от конкурса отзывов?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    У нас уже есть "Конкурс отзывов" с похожими возможностями. В чём разница?
                </p>

                <div className="not-prose my-6">
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Параметр</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Конкурс отзывов (есть сейчас)</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Дроп промокодов (планируется)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Принцип выбора победителя</td>
                                    <td className="px-4 py-3 text-gray-700">Случайный выбор из всех подходящих</td>
                                    <td className="px-4 py-3 text-gray-700"><strong className="text-indigo-600">Кто первый написал — тот победил</strong></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Скорость реакции</td>
                                    <td className="px-4 py-3 text-gray-700">Не важна, можно написать в любое время</td>
                                    <td className="px-4 py-3 text-gray-700"><strong className="text-indigo-600">Критична — нужно быть быстрее других</strong></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Проверки участников</td>
                                    <td className="px-4 py-3 text-gray-700">Подписка, возраст аккаунта, чёрный список</td>
                                    <td className="px-4 py-3 text-gray-700">Те же проверки, но упрощённые</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Вовлечённость</td>
                                    <td className="px-4 py-3 text-gray-700">Средняя (можно подождать)</td>
                                    <td className="px-4 py-3 text-gray-700"><strong className="text-indigo-600">Высокая (азарт, гонка)</strong></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Подходит для</td>
                                    <td className="px-4 py-3 text-gray-700">Продуманные конкурсы с отзывами</td>
                                    <td className="px-4 py-3 text-gray-700"><strong className="text-indigo-600">Быстрые акции, флешмобы</strong></td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">Сложность настройки</td>
                                    <td className="px-4 py-3 text-gray-700">Средняя (много параметров)</td>
                                    <td className="px-4 py-3 text-gray-700"><strong className="text-indigo-600">Простая (минимум полей)</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Вывод:</strong> Конкурс отзывов — для спокойных длительных конкурсов. Дроп промокодов — для быстрых акций с ажиотажем.
                </p>
            </section>

            <hr className="!my-10" />

            {/* Что использовать сейчас */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что использовать прямо сейчас?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Пока дроп промокодов в разработке, вы можете решить похожие задачи с помощью существующих инструментов:
                </p>

                <div className="not-prose my-6 space-y-4">
                    {/* Конкурс отзывов */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-green-900 mb-2">
                                    Конкурс отзывов
                                </h3>
                                <p className="text-sm text-green-800 mb-4 leading-relaxed">
                                    Автоматическая раздача промокодов участникам конкурса. Можно настроить ключевое слово, количество призов, 
                                    фильтры участников и автоматическую отправку кодов в ЛС.
                                </p>
                                <div className="grid md:grid-cols-2 gap-3 text-sm mb-4">
                                    <div>
                                        <p className="font-semibold text-green-900 mb-2">✅ Что можно:</p>
                                        <ul className="text-green-800 space-y-1">
                                            <li>• База промокодов</li>
                                            <li>• Автоотправка в ЛС</li>
                                            <li>• Черный список</li>
                                            <li>• Фильтры участников</li>
                                            <li>• Логи отправок</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-900 mb-2">❌ Чего нет:</p>
                                        <ul className="text-green-800 space-y-1">
                                            <li>• Режима "кто первый"</li>
                                            <li>• Мониторинга в реальном времени</li>
                                            <li>• Гонки за скорость</li>
                                        </ul>
                                    </div>
                                </div>
                                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 hover:underline">
                                    Перейти в раздел "Конкурс отзывов"
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Универсальные конкурсы */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-purple-900 mb-2">
                                    Универсальные конкурсы
                                </h3>
                                <p className="text-sm text-purple-800 mb-4 leading-relaxed">
                                    Гибкий инструмент для создания любых типов конкурсов с промокодами. 
                                    Позволяет настроить условия участия, автоматический выбор победителей и рассылку призов.
                                </p>
                                <p className="text-sm text-purple-700 font-medium">
                                    Больше возможностей для кастомизации, но требует больше времени на настройку.
                                </p>
                                <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 hover:text-purple-800 hover:underline mt-4">
                                    Перейти в раздел "Универсальные конкурсы"
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* FAQ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Частые вопросы
                </h2>

                <div className="not-prose space-y-6 my-6">
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            1. Когда появится функционал дропа промокодов?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Точная дата релиза пока не определена. Функционал находится на этапе планирования. 
                            О готовности будет объявлено в обновлениях приложения. Следите за новостями или используйте альтернативные инструменты 
                            (конкурс отзывов, универсальные конкурсы).
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            2. Можно ли сейчас провести дроп промокодов вручную?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            Да, технически возможно, но потребуется:
                        </p>
                        <ul className="text-sm text-gray-700 space-y-1.5">
                            <li className="flex gap-2">
                                <span className="text-indigo-500 mt-0.5">•</span>
                                <span>Постоянно обновлять страницу с постом и следить за комментариями</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-500 mt-0.5">•</span>
                                <span>Вручную запоминать первых N участников с ключевым словом</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="text-indigo-500 mt-0.5">•</span>
                                <span>Отправлять промокоды каждому в личные сообщения</span>
                            </li>
                        </ul>
                        <p className="text-sm text-gray-700 leading-relaxed mt-3">
                            Это отнимает 1-2 часа времени и повышает риск ошибки. Автоматизация сократит это до 5 минут на настройку.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            3. Будет ли работать защита от ботов?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Да, планируется интеграция с чёрным списком и фильтрами (возраст аккаунта, подписка на сообщество). 
                            Это те же механизмы, что используются в конкурсе отзывов — они уже доказали свою эффективность.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            4. Можно ли будет запустить несколько дропов одновременно?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Это будет зависеть от реализации. Скорее всего, можно будет настроить несколько дропов для разных проектов, 
                            но в рамках одного проекта активен будет только один дроп. Детали уточнятся при разработке.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            5. Нужно ли будет следить за дропом или всё произойдёт автоматически?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Полностью автоматически. Вы настраиваете параметры, запускаете дроп — и система сама мониторит комментарии, 
                            выбирает первых N участников и отправляет им промокоды в ЛС. 
                            Вы получите уведомление, когда все призы будут розданы.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 text-base">
                            6. Что если промокоды закончатся раньше времени?
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Дроп автоматически остановится, когда закончатся промокоды. 
                            Опоздавшим участникам (если настроено) будет отправлено сообщение о том, что призы уже разобрали. 
                            Вы увидите это в журнале отправок.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-3-2-settings" />
        </article>
    );
};
