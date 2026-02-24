import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    StatusBadge, 
    ToggleSwitch
} from './ReviewsContestMocks';

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestOverviewPage: React.FC<ContentProps> = ({ title }) => {
    // Состояния для интерактивных примеров
    const [contestActive, setContestActive] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'settings' | 'posts' | 'winners'>('settings');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ===== ВВЕДЕНИЕ ===== */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Конкурс отзывов</strong> — это автоматизация розыгрышей призов среди пользователей, которые оставили отзывы на товары сообщества. Система сама находит участников, проверяет их на соответствие условиям, выбирает победителей и отправляет им уведомления.
                </p>

                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-8">
                    Для кого эта автоматизация?
                </h2>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Для SMM-специалистов:</strong> управление конкурсами без ручной работы</li>
                    <li><strong>Для руководителей:</strong> контроль вовлечённости и истории розыгрышей</li>
                    <li><strong>Для сообществ с товарами:</strong> стимулирование пользователей оставлять отзывы</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ===== БЫЛО/СТАЛО ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Было / Стало
                </h2>

                <div className="not-prose grid md:grid-cols-2 gap-6 mt-6">
                    {/* БЫЛО */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-red-800 mb-4">❌ Раньше (вручную)</h3>
                        <ul className="space-y-3 text-sm text-red-900">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Заходить в каждый товар сообщества и вручную искать новые отзывы</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вести списки участников в таблицах Excel или Google Sheets</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вручную проверять каждого на черный список и повторное участие</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Проводить розыгрыш через сторонние сервисы или random.org</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Копировать тексты, вручную отправлять сообщения победителям</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Терять время на рутину вместо создания контента</span>
                            </li>
                        </ul>
                    </div>

                    {/* СТАЛО */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-green-800 mb-4">✅ Сейчас (автоматически)</h3>
                        <ul className="space-y-3 text-sm text-green-900">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Система сама находит новые отзывы по ключевым словам из товаров</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматическая проверка на черный список и повторное участие</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Выбор победителей по условиям (количество или дата окончания)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматическая отправка уведомлений победителям и комментариев к отзывам</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>История розыгрышей с отслеживанием выдачи призов</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Настроили один раз — работает постоянно</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== РАБОЧИЙ ПРОЦЕСС ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Как работает конкурс: 5 шагов
                </h2>

                <div className="not-prose mt-6 space-y-4">
                    {/* Шаг 1 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                            1
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Настройка условий</h3>
                            <p className="text-sm text-gray-600">
                                Включите конкурс, укажите ключевые слова для поиска (берутся из названий товаров), установите дату старта и условия завершения (по количеству участников, по дате или смешанный режим).
                            </p>
                        </div>
                    </div>

                    {/* Шаг 2 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                            2
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Сбор участников</h3>
                            <p className="text-sm text-gray-600">
                                Нажмите кнопку "Собрать посты" — система найдёт все отзывы на товары сообщества, которые содержат указанные ключевые слова. Каждый участник получает статус и может быть обработан.
                            </p>
                        </div>
                    </div>

                    {/* Шаг 3 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                            3
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Проверка и комментирование</h3>
                            <p className="text-sm text-gray-600">
                                Система автоматически комментирует отзывы участников с использованием настраиваемого шаблона. Если включён автоматический черный список, повторные участники отсеиваются.
                            </p>
                        </div>
                    </div>

                    {/* Шаг 4 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                            4
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Выбор победителей</h3>
                            <p className="text-sm text-gray-600">
                                Когда условия конкурса выполнены (набрано нужное количество участников или наступила дата окончания), нажмите "Провести розыгрыш" — система случайным образом выберет победителей среди принятых участников.
                            </p>
                        </div>
                    </div>

                    {/* Шаг 5 */}
                    <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                            5
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Уведомление победителей</h3>
                            <p className="text-sm text-gray-600">
                                Система автоматически отправит личные сообщения победителям и опубликует пост в сообществе с результатами розыгрыша. История сохраняется на вкладке "Победители".
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ИНТЕРАКТИВНЫЙ ПРИМЕР: ВКЛЮЧЕНИЕ КОНКУРСА ===== */}
            <Sandbox
                title="🎮 Попробуйте включить конкурс"
                description="Переключатель контролирует активность конкурса. В выключенном состоянии система не будет искать новых участников."
                instructions={[
                    'Нажмите на переключатель, чтобы включить или выключить конкурс',
                    'Когда конкурс активен, переключатель становится синим'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Конкурс отзывов активен</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {contestActive 
                                    ? 'Система активно ищет новых участников по заданным ключевым словам' 
                                    : 'Конкурс приостановлен, новые участники не собираются'}
                            </p>
                        </div>
                        <ToggleSwitch 
                            enabled={contestActive} 
                            onChange={() => setContestActive(!contestActive)} 
                        />
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ===== СТРУКТУРА ИНТЕРФЕЙСА: 7 ВКЛАДОК ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Структура раздела: 7 вкладок
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Весь функционал конкурса разделён на 7 вкладок для удобной навигации:
                </p>

                <div className="not-prose mt-6">
                    {/* Переключатель вкладок */}
                    <div className="mb-6 border-b border-gray-200">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setSelectedTab('settings')}
                                className={`py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                                    selectedTab === 'settings'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                ⚙️ Настройки
                            </button>
                            <button
                                onClick={() => setSelectedTab('posts')}
                                className={`py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                                    selectedTab === 'posts'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                📋 Посты
                            </button>
                            <button
                                onClick={() => setSelectedTab('winners')}
                                className={`py-2 px-2 text-sm font-medium border-b-2 transition-colors ${
                                    selectedTab === 'winners'
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                🏆 Победители
                            </button>
                        </div>
                    </div>

                    {/* Описание вкладок */}
                    <div className="space-y-4">
                        {selectedTab === 'settings' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">⚙️ Настройки</h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    Основная вкладка для настройки условий конкурса:
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Активность:</strong> включение/выключение конкурса</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Ключевые слова:</strong> по каким словам искать отзывы (автоматически берутся из названий товаров)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Даты:</strong> начало конкурса и условия завершения</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Условие завершения:</strong> по количеству участников, по дате или смешанный режим</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Шаблоны:</strong> тексты комментариев, сообщений победителям, постов с результатами</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Автоматический черный список:</strong> исключение повторных участников на заданный период</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Предпросмотр:</strong> как будут выглядеть отправленные сообщения</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {selectedTab === 'posts' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Посты</h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    Таблица всех участников конкурса с возможностью управления:
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Список участников:</strong> пользователь, текст отзыва, дата, статус</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Статусы:</strong> Новый, В работе, Принят, Ошибка, Победитель, Использован</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Кнопка "Собрать посты":</strong> запуск поиска новых отзывов</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Кнопка "Комментировать":</strong> отправить комментарий к отзыву участника</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Кнопка "Провести розыгрыш":</strong> выбрать победителей среди принятых участников</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Очистка списка:</strong> удаление всех записей (только для администраторов)</span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {selectedTab === 'winners' && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">🏆 Победители</h3>
                                <p className="text-sm text-gray-700 mb-4">
                                    История всех проведённых розыгрышей:
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Дата розыгрыша:</strong> когда был проведён конкурс</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Победитель:</strong> имя пользователя со ссылкой на профиль</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Текст отзыва:</strong> за что был выигран приз</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Ссылка на отзыв:</strong> открывается во ВКонтакте</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Ссылка на пост:</strong> открывается пост с результатами в сообществе</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Статус выдачи:</strong> выдан ли приз победителю</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-indigo-500 mt-0.5">•</span>
                                        <span><strong>Цветовая схема:</strong> янтарный стиль (amber) для выделения важности</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Оставшиеся 4 вкладки */}
                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">🚫 Блэклист</h4>
                            <p className="text-sm text-gray-600">
                                Список пользователей, исключённых из конкурса. Можно добавлять вручную или автоматически при повторном участии.
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">🎟️ Промокоды</h4>
                            <p className="text-sm text-gray-600">
                                Управление промокодами для призов. Можно импортировать список и автоматически выдавать победителям.
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">📤 Лист отправок</h4>
                            <p className="text-sm text-gray-600">
                                Пользователи, которым будут отправлены сообщения о победе. Формируется автоматически при проведении розыгрыша.
                            </p>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-900 mb-2">📜 Логи</h4>
                            <p className="text-sm text-gray-600">
                                Детальная история всех действий системы: сбор постов, комментирование, выбор победителей, ошибки.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== СТАТУСЫ УЧАСТНИКОВ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Статусы участников
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Каждый участник конкурса проходит через определённые статусы, которые отражают этап обработки его отзыва:
                </p>

                <div className="not-prose mt-6 space-y-3">
                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="new" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Новый</p>
                            <p className="text-sm text-gray-600">Отзыв найден системой, но ещё не обработан</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="processing" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">В работе</p>
                            <p className="text-sm text-gray-600">Система проверяет участника (черный список, дубликаты)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="commented" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Принят</p>
                            <p className="text-sm text-gray-600">Участник прошёл проверку, комментарий отправлен, может участвовать в розыгрыше</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="error" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Ошибка</p>
                            <p className="text-sm text-gray-600">Произошла ошибка при обработке (например, не удалось отправить комментарий)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="winner" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Победитель</p>
                            <p className="text-sm text-gray-600">Участник выбран победителем в результате розыгрыша</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <StatusBadge status="used" />
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900">Использован</p>
                            <p className="text-sm text-gray-600">Запись была обработана в прошлых розыгрышах</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== КЛЮЧЕВЫЕ ДЕЙСТВИЯ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Ключевые действия
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    На вкладке "Посты" доступны 5 основных действий для управления конкурсом:
                </p>

                <div className="not-prose mt-6 space-y-4">
                    {/* Кнопка 1: Обновить */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">Обновить список</h3>
                                <p className="text-sm text-gray-600">
                                    Перезагружает таблицу участников из базы данных. Используется для проверки актуальных статусов после автоматических процессов.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка 2: Очистить */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">Очистить список <span className="text-xs text-red-600">(только администраторы)</span></h3>
                                <p className="text-sm text-gray-600">
                                    Удаляет всех участников из базы данных. Используется для начала нового конкурса с чистого листа. Требуется подтверждение действия.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка 3: Комментировать */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 border border-green-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">Комментировать отзывы</h3>
                                <p className="text-sm text-gray-600">
                                    Отправляет комментарии к отзывам всех новых участников, используя шаблон из настроек. Автоматически меняет статус на "Принят".
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка 4: Провести розыгрыш */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 border border-amber-500 flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">Провести розыгрыш</h3>
                                <p className="text-sm text-gray-600">
                                    Случайным образом выбирает победителей среди участников со статусом "Принят". После выбора отправляет им личные сообщения и публикует пост с результатами в сообществе.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Кнопка 5: Собрать посты */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 mb-1">Собрать посты</h3>
                                <p className="text-sm text-gray-600">
                                    Запускает поиск новых отзывов на товары сообщества по ключевым словам. Найденные отзывы добавляются в таблицу со статусом "Новый".
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ИНТЕРАКТИВНЫЙ ПРИМЕР: ТАБЛИЦА УЧАСТНИКОВ ===== */}
            <Sandbox
                title="🎮 Пример таблицы участников"
                description="Так выглядит список всех участников конкурса на вкладке 'Посты'. Каждый участник имеет статус, который меняется в процессе обработки."
                instructions={[
                    'Обратите внимание на цветовые индикаторы статусов',
                    'Статус "В работе" имеет пульсирующую анимацию',
                    'Статус "Победитель" выделен жирным шрифтом'
                ]}
            >
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Пользователь</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Текст отзыва</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">АИ</div>
                                        <span className="text-sm font-medium text-gray-900">Анна Иванова</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Отличный товар! Очень довольна покупкой, рекомендую всем</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">15 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status="commented" /></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">ДС</div>
                                        <span className="text-sm font-medium text-gray-900">Дмитрий Смирнов</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Качество на высоте, доставка быстрая</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">16 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status="winner" /></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold text-purple-700">ЕП</div>
                                        <span className="text-sm font-medium text-gray-900">Елена Петрова</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Спасибо за товар! Все как на фото</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">17 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status="processing" /></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-700">МК</div>
                                        <span className="text-sm font-medium text-gray-900">Максим Козлов</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Не понравилось качество</td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">18 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status="new" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ===== ИНТЕРАКТИВНЫЙ ПРИМЕР: ТАБЛИЦА ПОБЕДИТЕЛЕЙ ===== */}
            <Sandbox
                title="🏆 Пример истории победителей"
                description="На вкладке 'Победители' хранится вся история розыгрышей. Каждая запись содержит информацию о победителе, его отзыве и статусе выдачи приза."
                instructions={[
                    'Янтарная цветовая схема подчёркивает важность раздела',
                    'Ссылки на отзывы и посты открываются во ВКонтакте',
                    'Можно отслеживать статус выдачи призов'
                ]}
            >
                <div className="bg-amber-50 border border-amber-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-amber-200">
                        <thead className="bg-amber-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Дата розыгрыша</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Победитель</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Текст отзыва</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">Статус выдачи</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-amber-100">
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">10 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">ОС</div>
                                        <span className="text-sm font-medium text-gray-900">Ольга Соколова</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Замечательный товар, превзошёл все ожидания!</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        ✓ Выдан
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">5 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">ИН</div>
                                        <span className="text-sm font-medium text-gray-900">Игорь Новиков</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Очень доволен покупкой, рекомендую</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                        ⏳ Ожидается
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1 фев 2026</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">СМ</div>
                                        <span className="text-sm font-medium text-gray-900">Светлана Морозова</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">Отличное качество за свою цену</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                        ✓ Выдан
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ===== ЗАКЛЮЧЕНИЕ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что дальше?
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Теперь, когда вы знакомы с общей структурой конкурса отзывов, переходите к детальным разделам для изучения каждой вкладки и настройки конкурса под ваши задачи.
                </p>

                <div className="not-prose mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Совет</h3>
                    <p className="text-sm text-blue-800">
                        Начните с настройки базовых параметров: включите конкурс, укажите ключевые слова и установите условие завершения. Затем настройте шаблоны сообщений и проведите первый тестовый розыгрыш на небольшом количестве участников.
                    </p>
                </div>
            </section>

            {/* ===== НАВИГАЦИЯ ===== */}
            <NavigationButtons currentPath="2-4-2-1-overview" />
        </article>
    );
};
