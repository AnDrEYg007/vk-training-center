import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * 2.4.7.2. Настройка конкурса активности
 * 
 * ВАЖНО: Функционал находится на этапе планирования.
 * Эта страница описывает предполагаемый интерфейс настройки.
 */
export const ActivityContestSettingsPage: React.FC<ContentProps> = ({ title }) => {
    const [demoEnabled, setDemoEnabled] = useState(false);
    const [demoLikePoints, setDemoLikePoints] = useState(1);
    const [demoCommentPoints, setDemoCommentPoints] = useState(3);
    const [demoRepostPoints, setDemoRepostPoints] = useState(5);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Предупреждение */}
            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 font-semibold">
                            ⚠️ Функционал "Конкурс «Актив»" находится на этапе планирования. 
                            Эта страница описывает, как будет выглядеть интерфейс настройки после реализации.
                        </p>
                    </div>
                </div>
            </div>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница настроек конкурса активности — это место, где вы будете задавать параметры конкурса: 
                период проведения, стоимость действий в баллах, количество победителей и условия завершения.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Настройка займет 5-7 минут. После активации система начнет автоматически собирать данные 
                об активности участников и подсчитывать баллы в режиме реального времени.
            </p>

            {/* Раньше vs Теперь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как было раньше vs как будет с автоматизацией</h2>

            <div className="not-prose my-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Раньше */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                        <h3 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (ручная работа)</h3>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Создавать таблицу Excel с именами участников и колонками для баллов</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Каждый день проверять новые лайки/комментарии/репосты вручную</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вручную складывать баллы по формулам</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Риск ошибиться в подсчете или пропустить чью-то активность</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Невозможно показать промежуточные итоги участникам</span>
                            </li>
                        </ul>
                    </div>

                    {/* Теперь */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-bold text-green-900 mb-3">✅ С автоматизацией (планируется)</h3>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Настроили один раз — система работает весь период конкурса</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматический сбор данных каждые 30-60 минут</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Подсчет баллов в реальном времени, нулевая вероятность ошибки</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Видно текущий топ участников в любой момент</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматическое определение победителей и публикация итогов</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Элементы интерфейса */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные элементы настроек</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Интерфейс настроек будет состоять из нескольких блоков. Рассмотрим каждый подробно:
            </p>

            {/* 1. Переключатель активации */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Переключатель активации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Главный элемент — переключатель (toggle switch), который включает и выключает конкурс. 
                Когда переключатель в положении "Включено" (синий), система активно собирает данные.
            </p>

            <Sandbox 
                title="Интерактивный переключатель"
                description="Попробуйте включить и выключить конкурс"
                instructions={[
                    'Кликните на переключатель, чтобы изменить состояние',
                    'Синий цвет означает "Включено", серый — "Выключено"'
                ]}
            >
                <div className="flex items-center gap-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={demoEnabled}
                            onChange={() => setDemoEnabled(!demoEnabled)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <span className="text-sm font-medium text-gray-700">
                        {demoEnabled ? '✅ Конкурс активен' : '⚪ Конкурс остановлен'}
                    </span>
                </div>
            </Sandbox>

            {/* 2. Период конкурса */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Период конкурса</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вы выбираете даты начала и окончания конкурса. Система будет учитывать только ту активность, 
                которая произошла в указанном диапазоне.
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Планируемые настройки периода:</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Дата начала</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                defaultValue="2026-03-01"
                            />
                            <p className="text-xs text-gray-600 mt-1">С какого числа начинать учитывать активность</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Дата окончания</label>
                            <input 
                                type="date" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                defaultValue="2026-03-31"
                            />
                            <p className="text-xs text-gray-600 mt-1">До какого числа учитывать активность (включительно)</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-blue-800">
                                <strong>💡 Совет:</strong> Для первого конкурса выбирайте период 1-2 недели. 
                                Так легче оценить вовлеченность аудитории и скорректировать настройки баллов для следующего конкурса.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Система подсчета баллов */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Система подсчета баллов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый важный блок — настройка стоимости каждого типа действия. От этих значений зависит, 
                какую активность будут проявлять участники.
            </p>

            <Sandbox 
                title="Калькулятор баллов"
                description="Настройте стоимость действий и посмотрите примеры расчета"
                instructions={[
                    'Измените стоимость лайков, комментариев и репостов',
                    'Посмотрите, сколько баллов наберет участник с разной активностью'
                ]}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Лайк</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="10"
                                value={demoLikePoints}
                                onChange={(e) => setDemoLikePoints(parseInt(e.target.value) || 1)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Комментарий</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="20"
                                value={demoCommentPoints}
                                onChange={(e) => setDemoCommentPoints(parseInt(e.target.value) || 3)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Репост</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="50"
                                value={demoRepostPoints}
                                onChange={(e) => setDemoRepostPoints(parseInt(e.target.value) || 5)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-xs font-bold text-gray-600 mb-2">Примеры расчета:</p>
                        <div className="space-y-1 text-xs text-gray-800">
                            <div className="flex justify-between">
                                <span>Участник A (20 лайков, 5 комментариев, 2 репоста):</span>
                                <strong>{20 * demoLikePoints + 5 * demoCommentPoints + 2 * demoRepostPoints} баллов</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Участник B (50 лайков, 0 комментариев, 0 репостов):</span>
                                <strong>{50 * demoLikePoints} баллов</strong>
                            </div>
                            <div className="flex justify-between">
                                <span>Участник C (10 лайков, 15 комментариев, 5 репостов):</span>
                                <strong>{10 * demoLikePoints + 15 * demoCommentPoints + 5 * demoRepostPoints} баллов</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </Sandbox>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-yellow-900 mb-2">⚠️ Важно понимать логику настройки баллов</h4>
                <p className="text-sm text-yellow-800">
                    Если разница между действиями слишком маленькая (лайк = 1, комментарий = 2), участники будут 
                    выбирать самое простое — лайки. Чтобы стимулировать комментарии и репосты, делайте значительную 
                    разницу: 1:5:10 или даже 1:10:20.
                </p>
            </div>

            {/* 4. Количество победителей и призы */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Количество победителей и призы</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вы задаете, сколько человек получат призы, и загружаете промокоды (или указываете описание призов).
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Планируемые параметры:</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Количество победителей</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="100"
                                placeholder="3" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                defaultValue="3"
                            />
                            <p className="text-xs text-gray-600 mt-1">Топ-N участников с наибольшим количеством баллов</p>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                                <span className="text-sm font-medium text-gray-700">Использовать промокоды</span>
                            </label>
                            <button className="w-full px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                                Загрузить файл с промокодами
                            </button>
                            <p className="text-xs text-gray-600 mt-1">Формат: один промокод на строку (минимум {3} промокодов)</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Описание призов (для поста с итогами)</label>
                            <textarea 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500"
                                rows={3}
                                placeholder="1 место - iPhone 15 Pro&#10;2 место - AirPods Pro&#10;3 место - промокод 3000₽"
                                defaultValue="1 место - iPhone 15 Pro&#10;2 место - AirPods Pro&#10;3 место - промокод 3000₽"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Защита от накрутки */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Защита от накрутки</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Настройки фильтрации подозрительных аккаунтов и лимитов активности:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Исключать аккаунты без аватарки</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Профили без фото часто являются ботами</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Исключать аккаунты младше 30 дней</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Новые аккаунты могут быть созданы специально для накрутки</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                            <span className="text-sm font-medium text-gray-700">Ограничить количество действий в день</span>
                        </label>
                        <div className="ml-6 mt-2 space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Максимум лайков:</span>
                                <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded text-xs" defaultValue="50" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Максимум комментариев:</span>
                                <input type="number" className="w-20 px-2 py-1 border border-gray-300 rounded text-xs" defaultValue="20" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 6. Автоматические действия */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">6. Автоматические действия по завершении</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Что система будет делать автоматически, когда наступит дата окончания конкурса:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Определить победителей автоматически</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Топ-N участников с наибольшими баллами</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Опубликовать пост с итогами</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Система создаст пост со списком победителей и их баллами</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Отправить призы победителям</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Личные сообщения с промокодами/описанием призов</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                            <span className="text-sm font-medium text-gray-700">Ручная модерация перед итогами</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Показать топ-10 для проверки, дождаться вашего подтверждения перед публикацией</p>
                    </div>
                </div>
            </div>

            {/* Сравнительная таблица */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравнение с другими конкурсами</h2>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Параметр</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Конкурс «Актив»</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Универсальные конкурсы</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Настройка условий</td>
                            <td className="px-4 py-3 border-b border-gray-200">Стоимость баллов за действия</td>
                            <td className="px-4 py-3 border-b border-gray-200">Условия участия (лайк, репост, комментарий)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Шаблоны сообщений</td>
                            <td className="px-4 py-3 border-b border-gray-200">Один (победителям)</td>
                            <td className="px-4 py-3 border-b border-gray-200">Три (пост старта, пост итогов, победителям)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Отслеживание</td>
                            <td className="px-4 py-3 border-b border-gray-200">Все посты за период</td>
                            <td className="px-4 py-3 border-b border-gray-200">Один конкретный пост</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Сложность настройки</td>
                            <td className="px-4 py-3"><strong className="text-green-600">Простая</strong> (5-7 параметров)</td>
                            <td className="px-4 py-3">Средняя (10+ параметров)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            1. Можно ли будет изменить баллы после старта конкурса?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Нет, после активации конкурса стоимость баллов заморожена. Это гарантирует справедливость — 
                            участники знают правила с самого начала и понимают за что получают баллы.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            2. Как часто система будет обновлять данные?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Планируется обновление каждые 30-60 минут. Это баланс между актуальностью данных и нагрузкой 
                            на VK API. Для конкурса длиной неделя-месяц такая частота вполне достаточна.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            3. Будет ли видно промежуточные итоги участникам?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Да, планируется возможность публиковать промежуточные итоги (например, топ-10 на середине недели). 
                            Это дополнительно стимулирует участников проявлять активность.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            4. Можно ли будет вручную добавить/убрать баллы участнику?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            В первой версии — нет, только автоматический подсчет. Но планируется возможность исключить 
                            участника из конкурса (например, если обнаружили накрутку вручную).
                        </p>
                    </details>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-7-2-settings" />
        </article>
    );
};
