import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';
import { useTrainingNavigation } from '../../../contexts/TrainingNavigationContext';

// =====================================================================
// Компонент страницы 3.1: Общий обзор
// =====================================================================
export const ListsGeneralOverview: React.FC<ContentProps> = ({ title }) => {
    const { navigateTo } = useTrainingNavigation();

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                В этом разделе вы подробно познакомитесь с интерфейсом модуля "Списки": 
                узнаете, как устроена навигация по карточкам списков, как работает система фильтрации 
                и как отображаются данные в таблице.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Раздел состоит из трёх тем, каждая из которых раскрывает отдельный аспект работы с модулем.
            </p>

            <hr className="!my-10" />

            {/* Содержание раздела */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Содержание раздела</h2>

            <div className="not-prose grid gap-4 my-8">
                {/* 3.1.1 */}
                <button 
                    onClick={() => navigateTo('3-1-1-interface')}
                    className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all duration-200 bg-white"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                            1
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">3.1.1. Интерфейс модуля</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Три основные секции интерфейса: навигация по спискам, панель фильтров и таблица с данными. 
                                Узнаете, как они расположены и какую роль выполняет каждая из них.
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>

                {/* 3.1.2 */}
                <button 
                    onClick={() => navigateTo('3-1-2-navigation')}
                    className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all duration-200 bg-white"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                            2
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">3.1.2. Навигация по спискам</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Карточки списков, группировка по типам, индикаторы статусов обновления и счётчики элементов. 
                                Интерактивная песочница поможет освоить навигацию на практике.
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>

                {/* 3.1.3 */}
                <button 
                    onClick={() => navigateTo('3-1-3-filters')}
                    className="text-left p-6 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-lg transition-all duration-200 bg-white"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                            3
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">3.1.3. Фильтры</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Восемь типов фильтров для точной настройки отображения данных, полнотекстовый поиск 
                                и закреплённая панель для удобной работы. Попробуйте все возможности фильтрации в демо-режиме.
                            </p>
                        </div>
                        <div className="flex-shrink-0 text-indigo-500">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </button>
            </div>

            <hr className="!my-10" />

            {/* Как проходить раздел */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как проходить раздел?</h2>
            
            <p className="!text-base !leading-relaxed !text-gray-700">
                Рекомендуется изучать темы последовательно — сначала познакомиться с общей структурой интерфейса, 
                затем освоить навигацию и в конце разобраться с фильтрацией данных.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
                <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                        <h4 className="text-base font-bold text-blue-900 mb-2">Совет</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            На каждой странице есть интерактивные песочницы — используйте их для практики. 
                            Экспериментируйте с настройками, чтобы лучше понять, как работает каждый элемент интерфейса.
                        </p>
                    </div>
                </div>
            </div>

            {/* Навигационные кнопки */}
            <NavigationButtons currentPath="3-1-lists-overview" />
        </article>
    );
};
