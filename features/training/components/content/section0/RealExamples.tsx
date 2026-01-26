import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';
import { MockPostCard } from '../PostCardMocks';
import { MockProjectListItem } from '../SidebarMocks';

// =====================================================================
// Основной компонент: Примеры из реального интерфейса
// =====================================================================
export const RealExamples: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В документации используются <strong>mock-компоненты</strong> — упрощённые копии реальных элементов интерфейса. 
                Они выглядят и ведут себя как настоящие, но не подключены к данным приложения.
            </p>

            <hr className="!my-10" />

            {/* Зачем нужны mock-компоненты */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем нужны примеры из реального интерфейса</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Визуальное сходство</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Видите точную копию элемента: те же цвета, шрифты, иконки, отступы. 
                        Это помогает узнать его в реальном приложении.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Демонстрация состояний</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Можем показать все варианты: пост с 1 изображением, с 3, с 10+, 
                        опубликованный, черновик, с ошибкой — всё рядом для сравнения.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Контролируемая среда</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Примеры не зависят от реальных данных пользователя, всегда выглядят одинаково 
                        и не "ломаются" при изменениях в приложении.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900">Пояснения рядом</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Каждый mock-компонент сопровождается описанием: что это, зачем, 
                        какие элементы на что влияют.
                    </p>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Примеры mock-компонентов */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Примеры mock-компонентов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вот как выглядят mock-версии реальных элементов интерфейса:
            </p>

            {/* Пример 1: Карточка поста */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Карточка поста в календаре</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Точная копия карточки, которую вы видите в календаре постов. Обратите внимание на:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Пунктирную рамку</strong> — означает системный пост (черновик)</li>
                <li><strong>Счётчик изображений</strong> — показывает количество прикреплённых фото</li>
                <li><strong>Иконки действий</strong> — редактировать, копировать, удалить</li>
            </ul>

            <div className="not-prose my-6 max-w-sm">
                <MockPostCard type="system" textLength="medium" imagesCount={3} />
            </div>

            {/* Пример 2: Элемент списка проектов */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Элемент списка проектов</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Так выглядит проект в левом сайдбаре. Важные детали:
            </p>
            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Название проекта</strong> — кликабельно, открывает контент</li>
                <li><strong>Счётчик справа</strong> — количество постов, цвет зависит от количества</li>
                <li><strong>Иконка VK</strong> — аватар сообщества из ВКонтакте</li>
            </ul>

            <div className="not-prose my-6 max-w-sm">
                <MockProjectListItem 
                    name="Мой проект"
                    count={7}
                    isActive={false}
                />
            </div>

            {/* Пример 3: Сравнение состояний */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сравнение состояний</h3>
            <p className="!text-base !leading-relaxed !text-gray-700">
                Mock-компоненты позволяют показать все состояния элемента рядом для наглядности:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Системный пост (черновик)</p>
                    <MockPostCard type="system" textLength="short" imagesCount={1} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Отложенный пост VK</p>
                    <MockPostCard type="vk" textLength="short" imagesCount={1} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Опубликованный пост</p>
                    <MockPostCard type="published" textLength="short" imagesCount={1} />
                </div>
            </div>

            <hr className="!my-10" />

            {/* Отличия от реального интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чем mock-компоненты отличаются от реальных</h2>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-gray-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                    <div>
                        <p className="font-medium text-gray-800">Нет подключения к данным</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Mock-компоненты не загружают информацию из базы данных, используют заранее заданные примеры.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-gray-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Ограниченная интерактивность</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Можно кликать, наводить курсор, но действия не сохраняются и не влияют на приложение.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="text-gray-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-gray-800">Упрощённая логика</p>
                        <p className="text-sm text-gray-600 mt-1">
                            Некоторые сложные сценарии (например, загрузка файлов) могут быть упрощены или имитированы.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Как использовать */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как использовать mock-компоненты</h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Изучайте визуально</strong> — запоминайте, как выглядит элемент, какие у него есть части</li>
                <li><strong>Читайте пояснения</strong> — под каждым mock-компонентом есть описание его функций</li>
                <li><strong>Сравнивайте состояния</strong> — если показаны несколько вариантов, обратите внимание на различия</li>
                <li><strong>Пробуйте в реальном интерфейсе</strong> — после изучения перейдите в приложение и найдите этот элемент</li>
            </ol>

            {/* Подсказка */}
            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <p className="text-sm text-green-800">
                    <strong>Совет:</strong> Mock-компоненты — это 
                    <span className="font-medium"> "фотографии" реального интерфейса</span>. 
                    Они помогают узнать элемент, когда вы его встретите в работе.
                </p>
            </div>

            <NavigationButtons currentPath="0-2-3-real-examples" />
        </article>
    );
};
