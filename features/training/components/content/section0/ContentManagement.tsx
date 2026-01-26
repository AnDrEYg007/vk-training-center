import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Контент-менеджмент
// =====================================================================
export const ContentManagement: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел «Контент-менеджмент» — это основа работы с планировщиком. 
                Здесь вы научитесь создавать, редактировать и публиковать посты, 
                работать с календарём и управлять визуальным контентом.
            </p>

            <hr className="!my-10" />

            {/* Основные темы */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что входит в этот раздел</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-indigo-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Работа с постами</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Создание системных постов (черновиков)</li>
                        <li>• Редактирование текста и форматирование</li>
                        <li>• Отправка в VK как отложенный пост</li>
                        <li>• Копирование и удаление постов</li>
                    </ul>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Изображения</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Загрузка фото через drag-and-drop</li>
                        <li>• Переупорядочивание изображений</li>
                        <li>• Предпросмотр и удаление фото</li>
                        <li>• Работа с сетками изображений</li>
                    </ul>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Календарь и расписание</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Навигация по календарю</li>
                        <li>• Виды: неделя, месяц, день</li>
                        <li>• Планирование даты и времени</li>
                        <li>• Drag-and-drop постов между днями</li>
                    </ul>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">AI-помощник</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Генерация текстов по запросу</li>
                        <li>• Рерайт существующего контента</li>
                        <li>• Оптимизация длины и стиля</li>
                        <li>• Пресеты для разных форматов</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Ключевые навыки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чему вы научитесь</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 text-indigo-700 font-bold">
                        1
                    </div>
                    <div>
                        <p className="font-medium text-indigo-800">Создавать посты быстро</p>
                        <p className="text-sm text-indigo-700 mt-1">
                            Освоите все способы создания контента: из пустого шаблона, копированием, 
                            через AI-генерацию и из предложенных постов.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-700 font-bold">
                        2
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Понимать статусы постов</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Разберётесь в типах рамок карточек: системный (пунктир), отложенный VK (сплошная), 
                            опубликованный (серый) и что с каждым можно делать.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-700 font-bold">
                        3
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Работать с календарём эффективно</p>
                        <p className="text-sm text-green-700 mt-1">
                            Научитесь быстро планировать контент-план на неделю/месяц вперёд, 
                            переносить посты между днями и видеть общую картину публикаций.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 font-bold">
                        4
                    </div>
                    <div>
                        <p className="font-medium text-purple-800">Использовать AI для экономии времени</p>
                        <p className="text-sm text-purple-700 mt-1">
                            Освоите пресеты и промпты для генерации, научитесь быстро адаптировать 
                            тексты под разные форматы и аудитории.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Типичные сценарии */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типичные сценарии работы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В этом разделе разобраны пошаговые инструкции для частых задач:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Создание первого поста</strong> — от открытия редактора до публикации</li>
                <li><strong>Планирование недели контента</strong> — как заполнить календарь на 7 дней</li>
                <li><strong>Редактирование опубликованного поста</strong> — синхронизация изменений с VK</li>
                <li><strong>Работа с изображениями</strong> — загрузка, сортировка, удаление</li>
                <li><strong>Использование AI</strong> — генерация, рерайт, оптимизация</li>
            </ul>

            {/* Подсказка */}
            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-amber-800">
                    <strong>Совет:</strong> Начните с подраздела 
                    <span className="font-medium"> «Карточка поста: Глубокое погружение»</span> — 
                    там интерактивная песочница, где можно попробовать все элементы.
                </p>
            </div>

            <NavigationButtons currentPath="0-3-1-content-management" />
        </article>
    );
};
