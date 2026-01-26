import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Как устроена документация
// =====================================================================
export const DocumentationStructure: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Документация организована по модулям приложения. Каждый раздел посвящён 
                отдельной функциональной области и содержит как теоретические объяснения, 
                так и интерактивные примеры.
            </p>

            <hr className="!my-10" />

            {/* Структура разделов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура документации</h2>

            <div className="not-prose space-y-4 my-6">
                {/* Раздел 0 */}
                <div className="border-l-4 border-gray-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-100 text-gray-700 text-xs font-mono px-2 py-0.5 rounded">0</span>
                        <h3 className="font-semibold text-gray-900">О Центре обучения</h3>
                        <span className="text-xs text-gray-500">(вы здесь)</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Вводная информация: что это, для кого, как пользоваться документацией
                    </p>
                </div>

                {/* Раздел 1 */}
                <div className="border-l-4 border-indigo-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-mono px-2 py-0.5 rounded">1</span>
                        <h3 className="font-semibold text-gray-900">Введение в приложение</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Что такое планировщик контента, какие задачи решает, сценарии использования, интерфейс и первые шаги
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">О приложении</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Задачи и сценарии</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Интерфейс</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Первый проект</span>
                    </div>
                </div>

                {/* Раздел 2 */}
                <div className="border-l-4 border-blue-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-mono px-2 py-0.5 rounded">2</span>
                        <h3 className="font-semibold text-gray-900">Модуль «Контент-менеджмент»</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Основной функционал: посты, календарь, редактирование, изображения, AI-генерация
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Карточка поста</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Drag & Drop</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">AI-помощник</span>
                    </div>
                </div>

                {/* Раздел 3 */}
                <div className="border-l-4 border-green-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 text-xs font-mono px-2 py-0.5 rounded">3</span>
                        <h3 className="font-semibold text-gray-900">Модуль «Списки»</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Организация контента: создание списков, добавление постов, сортировка
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Создание списка</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Управление</span>
                    </div>
                </div>

                {/* Раздел 4 */}
                <div className="border-l-4 border-amber-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 text-xs font-mono px-2 py-0.5 rounded">4</span>
                        <h3 className="font-semibold text-gray-900">Модуль «Товары»</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Интеграция с каталогом VK: привязка товаров к постам, отображение карточек
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Каталог товаров</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Привязка к посту</span>
                    </div>
                </div>

                {/* Раздел 5 */}
                <div className="border-l-4 border-orange-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-orange-100 text-orange-700 text-xs font-mono px-2 py-0.5 rounded">5</span>
                        <h3 className="font-semibold text-gray-900">Модуль «Предложенные посты»</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Работа с предложкой: модерация, редактирование, публикация или отклонение
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Модерация</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Редактирование</span>
                    </div>
                </div>

                {/* Раздел 6 */}
                <div className="border-l-4 border-red-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-700 text-xs font-mono px-2 py-0.5 rounded">6</span>
                        <h3 className="font-semibold text-gray-900">Модуль «Автоматизации»</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Настройка автоматических действий: расписание публикаций, триггеры, условия
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Правила</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Расписание</span>
                    </div>
                </div>

                {/* Раздел 7 */}
                <div className="border-l-4 border-purple-400 pl-4 py-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-700 text-xs font-mono px-2 py-0.5 rounded">7</span>
                        <h3 className="font-semibold text-gray-900">Администрирование</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                        Системные настройки: пользователи, токены VK, база данных, резервное копирование
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Настройки</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">VK API</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Бэкапы</span>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Типы контента */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что вы найдёте в каждом разделе</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Текстовые объяснения</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Подробное описание функций, механик и сценариев использования
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Визуальные примеры</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Mock-компоненты интерфейса для наглядной демонстрации
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Песочницы</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Интерактивные элементы для практики прямо в документации
                    </p>
                </div>
            </div>

            {/* Навигационная подсказка */}
            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-indigo-700">
                    <strong className="text-indigo-800">Рекомендация:</strong> Если вы новичок — 
                    перейдите к разделу <span className="font-medium">«Как работать с Центром обучения»</span>, 
                    чтобы узнать, как эффективно использовать эту документацию.
                </p>
            </div>

            <NavigationButtons currentPath="0-1-3-documentation-structure" />
        </article>
    );
};
