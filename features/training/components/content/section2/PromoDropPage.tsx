import React from 'react';
import { NavigationButtons } from '../shared';

export const PromoDropPage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto px-8 py-8">
            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    2.4.3. Дроп промокодов
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Автоматическая раздача промокодов первым пользователям, написавшим в комментариях под постом.
                </p>
            </div>

            {/* Уведомление о разработке */}
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 mb-8">
                <div className="flex items-start">
                    <svg className="w-6 h-6 text-amber-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                            Раздел в разработке
                        </h3>
                        <p className="text-amber-800 leading-relaxed">
                            Функционал находится на этапе планирования и пока не реализован в приложении. 
                            Используйте альтернативные инструменты или дождитесь выхода новой версии.
                        </p>
                    </div>
                </div>
            </div>

            {/* Что такое дроп промокодов */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Что такое дроп промокодов?
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p>
                        Дроп промокодов — это механика конкурса, когда вы публикуете пост с условием: 
                        <strong> первые N человек, написавших ключевое слово в комментариях</strong>, получают промокод.
                    </p>
                    <p>
                        Например: "Первые 10 человек, написавших 'ХОЧУ СКИДКУ' в комментариях, получат промокод на 20% скидку!"
                    </p>
                    <p>
                        Эта механика создает ажиотаж и мотивирует подписчиков быстро реагировать на ваши посты.
                    </p>
                </div>
            </section>

            {/* Структура раздела */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Структура раздела
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Обзор функционала */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Обзор функционала
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Основные возможности и принципы работы механики дропа промокодов
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Настройка дропа */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start mb-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Настройка дропа
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Параметры конкурса, база промокодов, шаблоны сообщений и защита от накруток
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Что использовать сейчас */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Что использовать сейчас?
                </h2>
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Конкурс отзывов (2.4.2)
                                </h3>
                                <p className="text-blue-800 mb-3 leading-relaxed">
                                    Позволяет автоматически отправлять призы пользователям по определенным критериям. 
                                    Можно настроить ключевое слово и автоматическую раздачу.
                                </p>
                                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Перейти в раздел →
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                                    Универсальные конкурсы (2.4.4)
                                </h3>
                                <p className="text-purple-800 mb-3 leading-relaxed">
                                    Более гибкий инструмент для организации различных типов конкурсов с промокодами, 
                                    условиями участия и автоматическим определением победителей.
                                </p>
                                <a href="#" className="text-purple-600 hover:text-purple-700 font-medium">
                                    Перейти в раздел →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Часто задаваемые вопросы
                </h2>
                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Когда появится функционал дропа промокодов?
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Точная дата релиза пока не определена. Функционал находится на этапе планирования. 
                            Следите за обновлениями или используйте альтернативные инструменты: конкурс отзывов или универсальные конкурсы.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Чем дроп промокодов отличается от конкурса отзывов?
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                            Конкурс отзывов проверяет участников по различным критериям (возраст аккаунта, подписка, отзывы) 
                            и раздает призы всем подходящим. Дроп промокодов — это быстрая гонка: 
                            <strong> первые N человек получают приз</strong>, независимо от других критериев.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Можно ли сейчас как-то реализовать дроп промокодов?
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-3">
                            Да, можно использовать конкурс отзывов с ограничением количества призов. 
                            Настройте автоматическую раздачу с ключевым словом и укажите максимальное количество победителей. 
                            Это не совсем то же самое (нет гонки за скоростью), но решает задачу автоматической раздачи.
                        </p>
                        <p className="text-gray-600 leading-relaxed">
                            Либо используйте универсальные конкурсы — там есть больше гибкости в настройке условий и призов.
                        </p>
                    </div>
                </div>
            </section>

            <NavigationButtons currentPath="2-4-3-promo-drop" />
        </div>
    );
};