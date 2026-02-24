import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

/**
 * 2.4.6.1. Обзор функционала поздравлений с днём рождения
 * 
 * ВАЖНО: Функционал находится на этапе планирования.
 * Эта страница описывает концепцию планируемой автоматизации.
 */
export const BirthdayOverviewPage: React.FC<ContentProps> = ({ title }) => {
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
                            ⚠️ Функционал "Поздравления с ДР" находится на этапе планирования и пока не реализован в приложении. 
                            Эта страница описывает концепцию будущей автоматизации.
                        </p>
                    </div>
                </div>
            </div>

            {/* Что это такое */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое автоматические поздравления с ДР</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Поздравления с днём рождения</strong> — это планируемая автоматизация для автоматической отправки 
                персонализированных поздравлений подписчикам сообщества в день их рождения.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Система будет отслеживать даты рождения участников группы и автоматически отправлять им поздравительные 
                сообщения с возможностью прикрепить промокод или специальное предложение.
            </p>

            {/* Раньше vs Теперь */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это было раньше vs как будет с автоматизацией</h3>

            <div className="not-prose my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Раньше */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <h4 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (без автоматизации)</h4>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Невозможно узнать даты рождения подписчиков без их согласия</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Нужно вручную просматривать профили, если пользователь открыл дату рождения</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Отправка поздравлений вручную каждому — трудоёмкий процесс</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Легко забыть отправить поздравление важному клиенту</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Нет возможности массовой рассылки с персонализацией</span>
                            </li>
                        </ul>
                    </div>

                    {/* Теперь */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h4 className="text-lg font-bold text-green-900 mb-3">✅ С автоматизацией (планируется)</h4>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Система автоматически отслеживает даты рождения участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Поздравления отправляются в день рождения без вашего участия</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Персонализация текста: имя, возраст, индивидуальный промокод</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Возможность прикрепить подарочный промокод или спецпредложение</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Работает 24/7 без необходимости быть онлайн</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Зачем это нужно */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно SMM-агентству</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Персонализированные поздравления — мощный инструмент для повышения лояльности аудитории:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Укрепление связи с аудиторией:</strong> Люди ценят внимание к себе, особенно в день рождения</li>
                <li><strong>Увеличение конверсии:</strong> Промокод в подарок стимулирует покупку</li>
                <li><strong>Повторные продажи:</strong> Напоминание о бренде в важный день</li>
                <li><strong>Автоматизация заботы:</strong> Система работает за вас круглосуточно</li>
                <li><strong>Масштабируемость:</strong> Можно настроить для десятков проектов</li>
            </ul>

            {/* Как это будет работать */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как будет работать система</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планируемая логика работы автоматизации:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <ol className="space-y-4">
                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Получение данных</h4>
                                <p className="text-sm text-gray-700">
                                    Система периодически запрашивает у VK API список участников сообщества с открытыми датами рождения.
                                    VK предоставляет эту информацию только для пользователей, которые сделали дату рождения публичной.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Хранение и отслеживание</h4>
                                <p className="text-sm text-gray-700">
                                    Даты рождения сохраняются в базе данных. Каждое утро система проверяет, у кого сегодня день рождения.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Генерация промокода (опционально)</h4>
                                <p className="text-sm text-gray-700">
                                    Если в настройках указано, что нужно отправлять промокоды, система генерирует уникальный код для именинника.
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Отправка поздравления</h4>
                                <p className="text-sm text-gray-700">
                                    Система отправляет персонализированное сообщение от имени сообщества. Текст содержит имя пользователя, 
                                    поздравление и промокод (если настроено).
                                </p>
                            </div>
                        </li>

                        <li className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Логирование</h4>
                                <p className="text-sm text-gray-700">
                                    Все отправленные поздравления записываются в журнал с отметкой об успешности доставки.
                                </p>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>

            {/* Ограничения VK API */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Важные ограничения VK API</h2>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">📘 Технические особенности</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>
                            <strong>Доступны только открытые даты:</strong> VK API возвращает дату рождения только если пользователь 
                            сделал её публичной в настройках приватности.
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>
                            <strong>Нужно разрешение на сообщения:</strong> Чтобы отправить личное сообщение, пользователь должен 
                            разрешить сообществу писать ему (подписаться на рассылку).
                        </span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>
                            <strong>Ограничения на рассылку:</strong> VK имеет лимиты на количество сообщений в минуту, чтобы 
                            предотвратить спам.
                        </span>
                    </li>
                </ul>
            </div>

            {/* Сравнение с другими автоматизациями */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Отличие от других автоматизаций</h2>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Критерий</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Поздравления с ДР</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Конкурс отзывов</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Дроп промокодов</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Цель</td>
                            <td className="px-4 py-3 border-b border-gray-200">Повышение лояльности через персонализацию</td>
                            <td className="px-4 py-3 border-b border-gray-200">Сбор отзывов и розыгрыш призов</td>
                            <td className="px-4 py-3 border-b border-gray-200">Быстрая раздача промокодов первым участникам</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Триггер</td>
                            <td className="px-4 py-3 border-b border-gray-200">День рождения пользователя</td>
                            <td className="px-4 py-3 border-b border-gray-200">Отзыв с хештегом</td>
                            <td className="px-4 py-3 border-b border-gray-200">Комментарий под постом</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Получатели</td>
                            <td className="px-4 py-3 border-b border-gray-200">Все именинники с открытой датой ДР</td>
                            <td className="px-4 py-3 border-b border-gray-200">Авторы отзывов на товары</td>
                            <td className="px-4 py-3 border-b border-gray-200">Первые N комментаторов</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Частота</td>
                            <td className="px-4 py-3 border-b border-gray-200">Раз в год на каждого пользователя</td>
                            <td className="px-4 py-3 border-b border-gray-200">Непрерывно (пока активен)</td>
                            <td className="px-4 py-3 border-b border-gray-200">Разовая акция</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Персонализация</td>
                            <td className="px-4 py-3"><strong className="text-green-600">Высокая</strong> (имя, возраст)</td>
                            <td className="px-4 py-3">Средняя (имя, номер)</td>
                            <td className="px-4 py-3">Низкая (стандартный текст)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Альтернативные решения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что использовать сейчас</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Пока автоматизация поздравлений в разработке, вы можете:
            </p>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">1. Создать конкурс с условием "День рождения в этом месяце"</h4>
                        <p className="text-sm text-gray-700">
                            Используйте <strong>Универсальные конкурсы</strong> с условием участия "написать комментарий с датой рождения". 
                            Разыграйте призы среди именинников месяца. Это ручной подход, но работает прямо сейчас.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">2. Настроить рассылку через VK Рассылки (вне приложения)</h4>
                        <p className="text-sm text-gray-700">
                            VK предоставляет инструмент "Рассылки" в админ-панели сообщества. Можно вручную отправлять поздравления 
                            подписчикам, если у них открыта дата рождения в профиле.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">3. Использовать внешние сервисы автоматизации VK</h4>
                        <p className="text-sm text-gray-700">
                            Существуют сторонние сервисы (например, SMMplanner, Pepper.Ninja), которые поддерживают автоматические 
                            поздравления. Однако они платные и требуют отдельной настройки.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            1. Когда появится функционал поздравлений?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Функционал находится в backlog разработки. Точные сроки зависят от приоритетов команды. 
                            Следите за обновлениями в разделе "Changelog" приложения.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            2. Можно ли будет отправлять поздравления всем подписчикам?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Нет. Система сможет отправить поздравление только тем пользователям, которые:
                            <br/>1. Сделали дату рождения публичной в VK
                            <br/>2. Разрешили сообществу писать им в личные сообщения
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            3. Можно ли будет настроить время отправки поздравления?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Да, планируется возможность выбрать время отправки (например, 9:00 утра). По умолчанию поздравления 
                            будут отправляться в начале дня рождения.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            4. Нужно ли будет следить за процессом?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Нет. После настройки система работает полностью автоматически. Вы сможете просматривать журнал 
                            отправленных поздравлений и статистику в любое время.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            5. Будут ли поздравления считаться спамом?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Нет, если пользователь сам разрешил сообществу писать ему. VK разрешает отправку персонализированных 
                            сообщений подписчикам, которые дали согласие на получение сообщений от сообщества.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            6. Можно ли будет прикрепить изображение к поздравлению?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Планируется возможность прикрепить фотографию или стикер к текстовому поздравлению. 
                            Детали будут уточнены при реализации.
                        </p>
                    </details>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-6-1-overview" />
        </article>
    );
};
