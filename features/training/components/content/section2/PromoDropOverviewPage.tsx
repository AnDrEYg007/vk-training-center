import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Страница-заглушка: Обзор функционала дропа промокодов
// =====================================================================
export const PromoDropOverviewPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-lg max-w-none">
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
                                Функционал "Дроп промокодов" находится на этапе планирования и пока не реализован в приложении. 
                                Эта страница появится, когда функционал будет готов к использованию.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Концепция функционала */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что такое дроп промокодов
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Дроп промокодов</strong> — это планируемая автоматизация для раздачи промокодов подписчикам сообщества 
                    в режиме реального времени. Принцип работы: первые N пользователей, которые напишут ключевое слово в комментариях 
                    под постом, автоматически получат промокоды.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Концепция работы
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Представьте: агентство публикует пост "Первые 10 человек, кто напишет #хочуприз, получат скидку 500₽!". 
                    Раньше такие акции требовали ручной обработки каждого комментария. С дропом промокодов система:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Автоматически сканирует новые комментарии под постом</li>
                    <li>Находит пользователей с ключевым словом</li>
                    <li>Выдаёт промокоды первым N участникам</li>
                    <li>Отправляет коды в личные сообщения или комментарии</li>
                    <li>Останавливается, когда закончились призы</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* Чем это полезно */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Для чего нужна эта автоматизация
                </h2>
                
                <div className="not-prose grid md:grid-cols-2 gap-6 my-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-red-800 mb-4">❌ Сейчас (вручную)</h3>
                        <ul className="space-y-3 text-sm text-red-900">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Нужно постоянно мониторить комментарии под постом</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Вручную выписывать первых 10-20 участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Отправлять промокоды каждому в ЛС — долго и утомительно</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>Высокий риск ошибок: случайно пропустить участника или выдать лишний приз</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <h3 className="text-xl font-bold text-green-800 mb-4">✅ С автоматизацией</h3>
                        <ul className="space-y-3 text-sm text-green-900">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Система сама следит за комментариями в режиме реального времени</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Автоматически определяет первых N участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Мгновенно отправляет промокоды победителям</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span>Исключает человеческий фактор — всё честно и прозрачно</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Альтернативы */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что использовать сейчас
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Пока функционал "Дроп промокодов" в разработке, для раздачи призов используйте:
                </p>

                <div className="not-prose space-y-4 my-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <p className="font-semibold text-blue-900 mb-1">
                            <a href="#" className="text-blue-700 hover:underline">→ Конкурс отзывов</a>
                        </p>
                        <p className="text-sm text-blue-800">
                            Подходит для розыгрышей среди участников, оставивших отзывы. Есть автоматический выбор победителя, 
                            отправка промокодов и защита от повторных участий.
                        </p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                        <p className="font-semibold text-purple-900 mb-1">
                            <a href="#" className="text-purple-700 hover:underline">→ Универсальные конкурсы</a>
                        </p>
                        <p className="text-sm text-purple-800">
                            Гибкий инструмент для проведения конкурсов с разными условиями: лайки, репосты, подписки. 
                            Поддерживает рассылку призов победителям.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* FAQ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    ❓ Частые вопросы
                </h2>

                <div className="not-prose space-y-6 my-6">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            1. Когда появится функционал "Дроп промокодов"?
                        </h3>
                        <p className="text-gray-700">
                            Функционал находится на этапе планирования. Точные сроки появления пока не определены. 
                            Следите за обновлениями в разделе "Настройки" → "О приложении".
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            2. Чем дроп промокодов отличается от конкурса отзывов?
                        </h3>
                        <p className="text-gray-700">
                            <strong>Конкурс отзывов</strong> — это розыгрыш среди всех участников с выбором победителя через случайный номер. 
                            <strong>Дроп промокодов</strong> — это раздача первым N людям без розыгрыша (кто первый написал — тот и получил).
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">
                            3. Можно ли использовать другие автоматизации для похожих задач?
                        </h3>
                        <p className="text-gray-700">
                            Да! Для раздачи призов сейчас можно использовать "Конкурс отзывов" или "Универсальные конкурсы" — 
                            они уже реализованы и полностью функциональны.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-3-1-overview" />
        </article>
    );
};
