import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Общая информация о планировщике
// =====================================================================
export const Overview: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Планировщик контента</strong> — это веб-приложение для управления публикациями 
                в сообществах ВКонтакте. Оно помогает создавать, редактировать, планировать и автоматически 
                публиковать посты, работать с изображениями, товарами и предложенными постами.
            </p>

            <hr className="!my-10" />

            {/* Основная идея */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основная идея</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Приложение создано, чтобы заменить стандартный интерфейс ВКонтакте более удобным 
                и функциональным инструментом для контент-менеджеров, SMM-специалистов и администраторов сообществ.
            </p>

            <div className="not-prose space-y-3 my-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-blue-800">Один интерфейс для всего</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Управление постами, календарём, товарами, предложкой и автоматизациями 
                            в едином окне без переключения между вкладками VK.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-green-800">Ускорение рутинных операций</p>
                        <p className="text-sm text-green-700 mt-1">
                            Drag-and-drop для переноса постов, быстрое копирование, массовое редактирование, 
                            AI-генерация текстов — всё для экономии времени.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-purple-800">Автоматизация публикаций</p>
                        <p className="text-sm text-purple-700 mt-1">
                            Настройте расписание — и посты будут публиковаться сами в нужное время, 
                            даже когда вы офлайн.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-medium text-orange-800">Работа в команде</p>
                        <p className="text-sm text-orange-700 mt-1">
                            Несколько пользователей могут одновременно работать над контент-планом 
                            с разными уровнями доступа.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Ключевые возможности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Ключевые возможности</h2>

            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-white border border-indigo-200 rounded-lg p-4">
                    <h3 className="font-semibold text-indigo-900 mb-2">📝 Контент-менеджмент</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Создание и редактирование постов</li>
                        <li>• Календарное планирование</li>
                        <li>• Работа с изображениями (загрузка, сортировка)</li>
                        <li>• AI-генерация и рерайт текстов</li>
                    </ul>
                </div>

                <div className="bg-white border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">📊 Организация</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Проекты для разных сообществ</li>
                        <li>• Списки для группировки постов</li>
                        <li>• Теги и метки</li>
                        <li>• Фильтры и поиск</li>
                    </ul>
                </div>

                <div className="bg-white border border-amber-200 rounded-lg p-4">
                    <h3 className="font-semibold text-amber-900 mb-2">🛍️ Товары</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Интеграция с каталогом VK</li>
                        <li>• Привязка товаров к постам</li>
                        <li>• Отображение карточек продуктов</li>
                        <li>• Поиск и фильтрация товаров</li>
                    </ul>
                </div>

                <div className="bg-white border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">💬 Предложенные посты</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Модерация предложки</li>
                        <li>• Редактирование перед публикацией</li>
                        <li>• Автоматическая фильтрация спама</li>
                        <li>• Одобрение/отклонение</li>
                    </ul>
                </div>

                <div className="bg-white border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">⚙️ Автоматизации</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Расписание публикаций</li>
                        <li>• Триггеры и условия</li>
                        <li>• Массовые операции</li>
                        <li>• Автомодерация предложки</li>
                    </ul>
                </div>

                <div className="bg-white border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2">👥 Администрирование</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Управление пользователями и ролями</li>
                        <li>• Настройка токенов VK API</li>
                        <li>• Резервное копирование</li>
                        <li>• Системные настройки</li>
                    </ul>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Технические особенности */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Техническая основа</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Приложение построено на современном технологическом стеке:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Frontend:</strong> React с TypeScript — быстрый и отзывчивый интерфейс</li>
                <li><strong>Backend:</strong> Python FastAPI — надёжный REST API и фоновые задачи</li>
                <li><strong>База данных:</strong> PostgreSQL — хранение всех данных о постах, проектах, пользователях</li>
                <li><strong>Интеграция:</strong> VK API — прямое взаимодействие с ВКонтакте для публикаций и модерации</li>
            </ul>

            <NavigationButtons currentPath="1-1-1-overview" />
        </article>
    );
};
