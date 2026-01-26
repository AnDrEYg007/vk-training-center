import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

// =====================================================================
// Основной компонент: Какие задачи решает приложение
// =====================================================================
export const Tasks: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Планировщик контента закрывает широкий спектр задач контент-менеджера: 
                от рутинных операций до сложной автоматизации. Давайте разберём, 
                что именно можно делать с помощью приложения.
            </p>

            <hr className="!my-10" />

            {/* Основные задачи */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные задачи</h2>

            <div className="not-prose space-y-4 my-6">
                {/* Задача 1 */}
                <div className="border-l-4 border-indigo-400 pl-4 py-3 bg-indigo-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-indigo-700 font-bold">1</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900">Создание и редактирование постов</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Быстро создавайте новые публикации с текстом, изображениями, товарами. 
                                Редактируйте черновики, копируйте посты, используйте AI для генерации контента.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Текстовый редактор</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Загрузка фото</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">AI-помощник</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 2 */}
                <div className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-700 font-bold">2</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-blue-900">Планирование публикаций</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Создавайте контент-план на неделю, месяц или год вперёд. 
                                Просматривайте календарь, переносите посты между датами, 
                                задавайте точное время публикации.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Календарь</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Drag-and-drop</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Виды: день/неделя/месяц</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 3 */}
                <div className="border-l-4 border-green-400 pl-4 py-3 bg-green-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-green-700 font-bold">3</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900">Отправка постов в VK</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Публикуйте посты мгновенно или отправляйте как отложенные в VK. 
                                Приложение автоматически загружает изображения, прикрепляет товары, 
                                сохраняет форматирование текста.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Публикация сейчас</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Отложенный пост</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Автозагрузка медиа</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 4 */}
                <div className="border-l-4 border-amber-400 pl-4 py-3 bg-amber-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-amber-700 font-bold">4</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900">Работа с товарами</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Прикрепляйте товары из каталога VK к рекламным постам. 
                                Ищите нужные продукты, смотрите предпросмотр карточек, 
                                управляйте привязками.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Каталог товаров</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Привязка</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Фильтры и поиск</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 5 */}
                <div className="border-l-4 border-purple-400 pl-4 py-3 bg-purple-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-purple-700 font-bold">5</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-purple-900">Модерация предложенных постов</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Просматривайте посты, предложенные подписчиками. Редактируйте текст, 
                                одобряйте или отклоняйте, настраивайте автоматическую фильтрацию спама.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Модерация</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Редактирование</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Автофильтры</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 6 */}
                <div className="border-l-4 border-orange-400 pl-4 py-3 bg-orange-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-orange-700 font-bold">6</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-orange-900">Организация контента</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Группируйте посты в списки, добавляйте теги, используйте фильтры. 
                                Создавайте отдельные проекты для разных сообществ.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Проекты</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Списки</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Теги</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 7 */}
                <div className="border-l-4 border-red-400 pl-4 py-3 bg-red-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-red-700 font-bold">7</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900">Автоматизация процессов</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Настройте расписание автопубликаций, создайте триггеры для массовых действий, 
                                автоматизируйте модерацию предложки по ключевым словам.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Расписание</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Триггеры</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Автомодерация</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Задача 8 */}
                <div className="border-l-4 border-gray-400 pl-4 py-3 bg-gray-50/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-gray-700 font-bold">8</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Командная работа</h3>
                            <p className="text-sm text-gray-700 mt-1">
                                Добавляйте пользователей с разными ролями: редактор, модератор, администратор. 
                                Контролируйте доступ к проектам и функциям.
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Роли</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Права доступа</span>
                                <span className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">Журнал действий</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr className="!my-10" />

            {/* Что приложение НЕ делает */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что приложение НЕ делает</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Важно понимать ограничения, чтобы не ожидать лишнего:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Не заменяет аналитику VK</strong> — статистика постов смотрится в интерфейсе ВКонтакте</li>
                <li><strong>Не работает с историями и клипами</strong> — только обычные посты</li>
                <li><strong>Не управляет рекламными кампаниями</strong> — для таргетинга используйте VK Рекламу</li>
                <li><strong>Не отвечает на комментарии автоматически</strong> — модерация комментариев остаётся в VK</li>
            </ul>

            <NavigationButtons currentPath="1-1-2-tasks" />
        </article>
    );
};
