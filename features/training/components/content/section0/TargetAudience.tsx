import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Для кого этот раздел
// =====================================================================
export const TargetAudience: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Этот раздел предназначен для всех, кто ещё не знаком с системой или не до конца понимает, 
                как работает интерфейс планировщика. Если вы впервые открыли приложение или хотите разобраться 
                с логикой взаимодействия элементов — вы попали по адресу.
            </p>

            <hr className="!my-10" />

            {/* Кому это нужно */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Кому будет полезно</h2>

            <div className="not-prose space-y-4 my-6">
                {/* Новички */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Я только что зарегистрировался</h3>
                            <p className="text-gray-600 mt-1">
                                Вы впервые открыли приложение и не знаете, с чего начать. 
                                Центр обучения покажет, где находятся основные разделы, как создать первый проект 
                                и опубликовать пост.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Непонимание интерфейса */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Я не понимаю, как что работает</h3>
                            <p className="text-gray-600 mt-1">
                                Интерфейс кажется перегруженным, непонятно, зачем нужны счётчики разных цветов, 
                                почему у карточек разные рамки и куда нажимать, чтобы выполнить задачу. 
                                Здесь всё объясняется с примерами.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Поиск связей */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Хочу понять логику и связи</h3>
                            <p className="text-gray-600 mt-1">
                                Вы хотите разобраться, как посты связаны с проектами, что происходит при клике на кнопку,
                                зачем нужны фильтры, списки и теги, и как всё это работает вместе. 
                                Документация объясняет взаимосвязи.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Обучение команды */}
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 text-lg">Нужно обучить коллег</h3>
                            <p className="text-gray-600 mt-1">
                                Вы хотите, чтобы новые участники команды быстро вошли в курс дела. 
                                Центр обучения — готовый справочник, который можно использовать 
                                для онбординга сотрудников.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что даёт этот подход */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что вы получите</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="text-center p-5 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-blue-800">Понимание интерфейса</h3>
                    <p className="text-sm text-blue-700 mt-2">
                        Узнаете, зачем нужна каждая кнопка, что означают цвета и индикаторы
                    </p>
                </div>

                <div className="text-center p-5 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-green-800">Быстрый старт</h3>
                    <p className="text-sm text-green-700 mt-2">
                        Пошаговые сценарии помогут начать работу за считанные минуты
                    </p>
                </div>

                <div className="text-center p-5 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-indigo-800">Справочник</h3>
                    <p className="text-sm text-indigo-700 mt-2">
                        Всегда можно вернуться и освежить знания по конкретной теме
                    </p>
                </div>
            </div>

            <NavigationButtons currentPath="0-1-2-target-audience" />
        </article>
    );
};
