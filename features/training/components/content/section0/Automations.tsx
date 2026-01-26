import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Автоматизации
// =====================================================================
export const Automations: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел «Автоматизации» научит вас настраивать автоматические сценарии: 
                публикацию по расписанию, обработку предложенных постов, массовые действия 
                и триггеры для рутинных задач.
            </p>

            <hr className="!my-10" />

            {/* Основные возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что входит в этот раздел</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Расписание публикаций</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Автопубликация в заданное время</li>
                        <li>• Повторяющиеся расписания</li>
                        <li>• Временные зоны и корректировки</li>
                        <li>• Пропуск выходных и праздников</li>
                    </ul>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Автомодерация предложки</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Правила фильтрации по ключевым словам</li>
                        <li>• Автоматическое одобрение/отклонение</li>
                        <li>• Проверка на спам и запрещённый контент</li>
                        <li>• Уведомления о новых предложениях</li>
                    </ul>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Триггеры и условия</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• "Если-то" правила для действий</li>
                        <li>• Срабатывание по событиям</li>
                        <li>• Цепочки автоматизаций</li>
                        <li>• Условия по времени, тегам, статусам</li>
                    </ul>
                </div>

                <div className="bg-white border border-orange-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Массовые действия</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Применение тегов к группе постов</li>
                        <li>• Изменение даты для нескольких постов</li>
                        <li>• Копирование настроек между проектами</li>
                        <li>• Экспорт/импорт контента</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Чему научитесь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чему вы научитесь</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
                        1
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Настраивать автопубликацию</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Создадите расписание, и посты будут публиковаться сами в нужное время — 
                            даже если вы спите или в отпуске.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                        2
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Фильтровать предложенные посты автоматически</p>
                        <p className="text-sm text-green-700 mt-1">
                            Настроите правила, чтобы спам отклонялся сразу, 
                            а нормальные посты отправлялись на модерацию или одобрялись автоматически.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold">
                        3
                    </div>
                    <div>
                        <p className="font-medium text-purple-800">Создавать цепочки действий</p>
                        <p className="text-sm text-purple-700 mt-1">
                            Освоите триггеры: например, "если пост получил тег 'Срочно' — отправить уведомление", 
                            или "если дата прошла — добавить тег 'Просрочено'".
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-700 font-bold">
                        4
                    </div>
                    <div>
                        <p className="font-medium text-orange-800">Экономить время на рутине</p>
                        <p className="text-sm text-orange-700 mt-1">
                            Научитесь выполнять однотипные действия сразу для десятков постов: 
                            добавление тегов, изменение даты, копирование между проектами.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Примеры автоматизаций */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Примеры популярных автоматизаций</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800">📅 Ежедневная публикация в 12:00</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Система автоматически публикует первый пост из очереди каждый день ровно в полдень.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800">🚫 Блокировка спама в предложке</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Если в тексте встречается "купить подписчиков" или "накрутка" — пост отклоняется автоматически.
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800">🏷️ Тегирование по ключевым словам</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Если в тексте есть "скидка" или "акция" — автоматически добавляется тег "Промо".
                    </p>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <p className="font-medium text-gray-800">⏰ Напоминания о неопубликованных постах</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Если пост был запланирован на вчера, но не опубликован — отправляется уведомление.
                    </p>
                </div>
            </div>

            {/* Подсказка */}
            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-800">
                    <strong>Важно:</strong> Автоматизации работают на уровне сервера. 
                    <span className="font-medium"> Браузер можно закрыть</span> — 
                    сценарии будут выполняться в фоне.
                </p>
            </div>

            <NavigationButtons currentPath="0-3-3-automations" />
        </article>
    );
};
