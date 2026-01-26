import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Назначение и цели
// =====================================================================
export const Purpose: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Центр обучения</strong> — это встроенная интерактивная документация по работе с Планировщиком контента.
                Его цель — помочь вам быстрее освоить интерфейс и основные сценарии: от создания поста до модерации предложенных публикаций и
                продвинутых автоматизаций.
            </p>

            <hr className="!my-10" />

            {/* Основные цели */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные цели Центра обучения</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Быстрое погружение</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Помочь за короткое время разобраться, где что находится: навигация по модулям,
                        ключевые экраны и базовые сценарии.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Понимание логики интерфейса</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Объяснить неочевидные механики: статусы карточек, цвета счётчиков, фильтры,
                        кликабельные области и поведение элементов.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Практика без риска</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Дать возможность попробовать взаимодействия в «песочницах» — без изменения реальных данных
                        и без риска «сломать» рабочий процесс.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Единый справочник</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Быстро находить ответы по конкретным модулям и действиям, возвращаться к материалам
                        при необходимости и обучать новых участников команды.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Какие проблемы решает */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Какие проблемы решает</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-red-800">Без Центра обучения</p>
                        <p className="text-sm text-red-700 mt-1">
                            Долгое вхождение в интерфейс, ошибки в сценариях, ощущение «слишком много кнопок»,
                            потеря времени на поиск нужного места и расшифровку значков/статусов.
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center justify-center py-2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-green-800">С Центром обучения</p>
                        <p className="text-sm text-green-700 mt-1">
                            Понятные шаги «что нажать и зачем», визуальные подсказки и примеры интерфейса,
                            возможность потренироваться в песочницах и быстрее перейти к работе.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Ключевые возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что даёт этот раздел</h2>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Понятные объяснения</strong> — что означает элемент интерфейса и почему он ведёт себя именно так</li>
                <li><strong>Разборы по модулям</strong> — контент-менеджмент, списки, товары, предложенные посты, автоматизации и другое</li>
                <li><strong>Визуальные примеры</strong> — mock-компоненты, повторяющие внешний вид интерфейса</li>
                <li><strong>Интерактивные песочницы</strong> — безопасная практика кликов, ховеров и типовых сценариев</li>
                <li><strong>Легенда обозначений</strong> — цвета счётчиков, типы рамок карточек и другие подсказки</li>
                <li><strong>Быстрый старт</strong> — короткие сценарии для первых действий без «воды»</li>
            </ul>

            {/* Навигация между разделами */}
            <NavigationButtons currentPath="0-1-1-purpose" />
        </article>
    );
};
