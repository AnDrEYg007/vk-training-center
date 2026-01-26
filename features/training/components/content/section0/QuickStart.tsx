import React from 'react';
import { Sandbox, ContentProps, NavigationLink, NavigationButtons } from '../shared';
import { MockPostCard } from '../PostCardMocks';

// =====================================================================
// Основной компонент: Быстрый старт
// =====================================================================
export const QuickStart: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Готовы начать работу? Вот три простых сценария для первого знакомства с приложением. 
                Каждый сценарий можно выполнить за несколько минут.
            </p>

            <hr className="!my-10" />

            {/* Сценарий 1 */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 1: Создание первого поста</h2>
            
            <div className="not-prose bg-white border-l-4 border-indigo-500 rounded-r-lg p-4 my-4">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Цель:</strong> Создать и запланировать публикацию поста в сообществе VK.
                </p>
            </div>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Выберите проект</strong> в сайдбаре слева (это ваше сообщество VK)</li>
                <li><strong>Перейдите на вкладку "Отложенные"</strong> — это календарь постов</li>
                <li><strong>Кликните на пустой слот</strong> в нужный день и время</li>
                <li><strong>Заполните модальное окно:</strong>
                    <ul>
                        <li>Введите текст поста</li>
                        <li>Добавьте изображения (кнопка "Галерея" или перетащите файлы)</li>
                        <li>Выберите дату и время публикации</li>
                    </ul>
                </li>
                <li><strong>Нажмите "Сохранить"</strong> — пост появится в календаре</li>
            </ol>

            <Sandbox 
                title="Пример: Карточка поста в календаре" 
                description="После сохранения пост появится в календаре. Вот как выглядит карточка поста:"
            >
                <div className="max-w-xs">
                    <MockPostCard 
                        type="system" 
                        textLength="medium" 
                        imagesCount={2}
                    />
                </div>
            </Sandbox>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Результат:</strong> У вас появился "Системный пост" (с пунктирной рамкой). 
                Он будет автоматически отправлен в VK за несколько минут до указанного времени.
            </p>

            <hr className="!my-10" />

            {/* Сценарий 2 */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 2: Планирование на неделю</h2>
            
            <div className="not-prose bg-white border-l-4 border-green-500 rounded-r-lg p-4 my-4">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Цель:</strong> Распределить контент на всю неделю с помощью Drag-and-Drop.
                </p>
            </div>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Откройте календарь</strong> на вкладке "Отложенные"</li>
                <li><strong>Переключитесь в режим "Неделя"</strong> — кнопка в шапке календаря</li>
                <li><strong>Создайте несколько постов</strong> на один день</li>
                <li><strong>Перетащите посты</strong> на другие дни:
                    <ul>
                        <li>Зажмите карточку поста мышью</li>
                        <li>Перетащите на нужный день</li>
                        <li>В модальном окне выберите "Переместить" или "Копировать"</li>
                    </ul>
                </li>
            </ol>

            <div className="not-prose bg-gray-50 border border-gray-200 rounded-lg p-4 my-6">
                <h5 className="text-sm font-semibold text-gray-800 mb-2">Разница между действиями:</h5>
                <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">→</span>
                        <span><strong>Переместить</strong> — пост переносится на новую дату, исходный слот освобождается</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">→</span>
                        <span><strong>Копировать</strong> — создаётся дубликат поста, оригинал остаётся на месте</span>
                    </li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Сценарий 3 */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сценарий 3: Работа с предложенными постами</h2>
            
            <div className="not-prose bg-white border-l-4 border-purple-500 rounded-r-lg p-4 my-4">
                <p className="text-sm text-gray-600">
                    <strong className="text-gray-800">Цель:</strong> Модерация и публикация постов от подписчиков.
                </p>
            </div>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Перейдите на вкладку "Предложенные"</strong></li>
                <li><strong>Просмотрите карточки постов</strong> от подписчиков</li>
                <li><strong>Для каждого поста</strong> вы можете:
                    <ul>
                        <li><strong>Принять</strong> — опубликовать как есть</li>
                        <li><strong>Отредактировать</strong> — изменить текст или изображения</li>
                        <li><strong>Запланировать</strong> — перенести в календарь на нужную дату</li>
                        <li><strong>Отклонить</strong> — удалить из предложки</li>
                    </ul>
                </li>
                <li><strong>Используйте AI-редактор</strong> для улучшения текста (кнопка с иконкой робота)</li>
            </ol>

            <Sandbox 
                title="Типы постов в календаре" 
                description="После принятия предложенного поста, он появится в календаре с соответствующей рамкой:"
            >
                <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                        <MockPostCard type="system" textLength="short" imagesCount={1} />
                        <p className="text-xs text-center text-gray-500">Системный пост</p>
                    </div>
                    <div className="space-y-2">
                        <MockPostCard type="vk" textLength="short" imagesCount={1} />
                        <p className="text-xs text-center text-gray-500">Отложка VK</p>
                    </div>
                    <div className="space-y-2">
                        <MockPostCard type="published" textLength="short" imagesCount={1} />
                        <p className="text-xs text-center text-gray-500">Опубликован</p>
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* Что дальше */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700">
                После выполнения этих сценариев рекомендуем изучить:
            </p>
            
            <div className="not-prose my-6 space-y-3">
                <NavigationLink 
                    to="2-1-7-post-modal"
                    title="Раздел 2.1.7. Модальное окно поста"
                    description="Детальный разбор редактирования постов"
                    variant="next"
                />
                <NavigationLink 
                    to="2-3-products"
                    title="Раздел 2.3. Работа с товарами VK"
                    description="Синхронизация каталога товаров"
                    variant="related"
                />
                <NavigationLink 
                    to="2-4-automations"
                    title="Раздел 2.4. Автоматизации и конкурсы"
                    description="Настройка автоматических публикаций"
                    variant="related"
                />
            </div>

            {/* Подсказка */}
            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-8">
                <p className="text-sm text-indigo-700">
                    <strong className="text-indigo-800">Совет:</strong> Не бойтесь экспериментировать! 
                    Системные посты можно редактировать и удалять в любой момент до отправки в VK. 
                    Используйте песочницы в этом Центре обучения для безопасной практики.
                </p>
            </div>

            <NavigationButtons currentPath="0-5-quick-start" />
        </article>
    );
};
