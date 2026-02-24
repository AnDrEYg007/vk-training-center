import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * 2.4.6.2. Настройка поздравлений с днём рождения
 * 
 * ВАЖНО: Функционал находится на этапе планирования.
 * Эта страница описывает предполагаемый интерфейс настройки.
 */
export const BirthdaySettingsPage: React.FC<ContentProps> = ({ title }) => {
    const [demoEnabled, setDemoEnabled] = useState(false);
    const [demoMessage, setDemoMessage] = useState('С днём рождения, {user_name}! 🎉\n\nПоздравляем вас с этим замечательным днём! Желаем здоровья, счастья и исполнения всех желаний!\n\nВ честь вашего дня рождения дарим промокод на скидку 20%: {promo_code}\n\nДействителен до конца месяца. 🎁');

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
                            ⚠️ Функционал "Поздравления с ДР" находится на этапе планирования. 
                            Эта страница описывает, как будет выглядеть интерфейс настройки после реализации.
                        </p>
                    </div>
                </div>
            </div>

            {/* Введение */}
            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница настроек поздравлений с днём рождения — это место, где вы будете настраивать шаблон сообщения, 
                время отправки, промокоды и другие параметры автоматизации.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Настройка займёт 2-3 минуты. После активации система будет автоматически отправлять поздравления всем именинникам, 
                у которых открыта дата рождения в профиле VK и которые разрешили сообществу писать им в личные сообщения.
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
                                <span>Заходить в каждую группу VK отдельно</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вручную искать участников с ДР сегодня</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Копировать текст поздравления для каждого</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вставлять имя вручную, генерировать промокод</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>На 50 именинников — 1-2 часа работы</span>
                            </li>
                        </ul>
                    </div>

                    {/* Теперь */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-lg font-bold text-green-900 mb-3">✅ С автоматизацией (планируется)</h3>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Настроили один раз — работает круглый год</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Система сама находит именинников каждый день</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматически подставляет имя и генерирует промокод</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Отправляет в заданное время (например, 9:00 утра)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Работает 24/7, даже если вы не онлайн</span>
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
                Главный элемент — переключатель (toggle switch), который включает и выключает автоматизацию. 
                Когда переключатель в положении "Включено" (синий), система активно работает.
            </p>

            <Sandbox 
                title="Интерактивный переключатель"
                description="Попробуйте включить и выключить автоматизацию"
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
                        {demoEnabled ? '✅ Поздравления включены' : '⚪ Поздравления выключены'}
                    </span>
                </div>
            </Sandbox>

            {/* 2. Шаблон сообщения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Шаблон сообщения</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Основной блок настроек — текстовое поле для шаблона поздравления. Здесь вы пишете текст, 
                который получит каждый именинник. Можно использовать переменные для персонализации.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <h4 className="font-bold text-blue-900 mb-2">📌 Доступные переменные:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded text-xs">{'{user_name}'}</code> — Имя пользователя (например, "Иван")</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded text-xs">{'{user_first_name}'}</code> — Только имя без фамилии</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded text-xs">{'{age}'}</code> — Возраст (если указан год рождения)</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded text-xs">{'{promo_code}'}</code> — Уникальный промокод (если включена генерация)</li>
                    <li><code className="bg-blue-100 px-2 py-0.5 rounded text-xs">{'{community_name}'}</code> — Название вашего сообщества</li>
                </ul>
            </div>

            <Sandbox 
                title="Редактор шаблона сообщения"
                description="Попробуйте изменить текст поздравления"
                instructions={[
                    'Используйте переменные в фигурных скобках для персонализации',
                    'Система автоматически подставит реальные значения при отправке'
                ]}
            >
                <div className="space-y-3">
                    <textarea
                        className="w-full h-48 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono"
                        value={demoMessage}
                        onChange={(e) => setDemoMessage(e.target.value)}
                        placeholder="Введите текст поздравления..."
                    />
                    
                    <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-xs font-bold text-gray-600 mb-2">Превью (как увидит пользователь "Иван Петров", 25 лет):</p>
                        <div className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200">
                            {demoMessage
                                .replace('{user_name}', 'Иван Петров')
                                .replace('{user_first_name}', 'Иван')
                                .replace('{age}', '25')
                                .replace('{promo_code}', 'BIRTHDAY2026')
                                .replace('{community_name}', 'Кофейня "Бодрость"')
                            }
                        </div>
                    </div>
                </div>
            </Sandbox>

            {/* 3. Настройки промокодов */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Настройки промокодов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вы сможете настроить автоматическую генерацию уникальных промокодов для именинников. 
                Каждый промокод будет привязан к конкретному пользователю и будет действовать ограниченное время.
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <h4 className="font-bold text-gray-900 mb-4">Планируемые параметры промокодов:</h4>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                                <span className="text-sm font-medium text-gray-700">Генерировать промокоды</span>
                            </label>
                            <p className="text-xs text-gray-600 ml-6">Если выключено, переменная {'{promo_code}'} будет пустой</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Префикс промокода</label>
                            <input 
                                type="text" 
                                placeholder="BIRTHDAY" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                defaultValue="BIRTHDAY"
                            />
                            <p className="text-xs text-gray-600 mt-1">Пример: BIRTHDAY2026</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Срок действия промокода</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500">
                                <option>7 дней</option>
                                <option>14 дней</option>
                                <option selected>30 дней (до конца месяца)</option>
                                <option>60 дней</option>
                                <option>90 дней</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Описание промокода (для внутреннего учёта)</label>
                            <input 
                                type="text" 
                                placeholder="Скидка 20% на день рождения" 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                defaultValue="Скидка 20% на день рождения"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Время отправки */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Время отправки поздравления</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Вы сможете выбрать, в какое время дня отправлять поздравления. По умолчанию — 9:00 утра по московскому времени.
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Время отправки</label>
                    <input 
                        type="time" 
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                        defaultValue="09:00"
                    />
                    <p className="text-xs text-gray-600 mt-2">Все поздравления отправляются в указанное время по московскому часовому поясу (UTC+3)</p>
                </div>
            </div>

            {/* 5. Фильтры и ограничения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Фильтры и ограничения (дополнительно)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Дополнительные настройки, которые планируются для более точного контроля:
            </p>

            <div className="not-prose my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 space-y-4">
                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                            <span className="text-sm font-medium text-gray-700">Отправлять только подписчикам сообщества</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Поздравлять только тех, кто подписан на рассылку</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" />
                            <span className="text-sm font-medium text-gray-700">Не отправлять повторно в течение года</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Защита от дублирования, если пользователь уже получил поздравление</p>
                    </div>

                    <div>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-indigo-600 rounded" defaultChecked />
                            <span className="text-sm font-medium text-gray-700">Проверять возможность отправки сообщения</span>
                        </label>
                        <p className="text-xs text-gray-600 ml-6 mt-1">Не пытаться отправить, если пользователь заблокировал сообщения от сообщества</p>
                    </div>
                </div>
            </div>

            {/* Сравнительная таблица */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравнение с другими автоматизациями</h2>

            <div className="not-prose my-6 overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Параметр</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Поздравления с ДР</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-300">Конкурс отзывов</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Настройка текста</td>
                            <td className="px-4 py-3 border-b border-gray-200">Один шаблон для всех</td>
                            <td className="px-4 py-3 border-b border-gray-200">Три шаблона (победитель, пост, ошибка)</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Промокоды</td>
                            <td className="px-4 py-3 border-b border-gray-200">Генерируются автоматически</td>
                            <td className="px-4 py-3 border-b border-gray-200">Загружаются списком из файла</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 border-b border-gray-200 font-semibold">Частота проверки</td>
                            <td className="px-4 py-3 border-b border-gray-200">Раз в день утром</td>
                            <td className="px-4 py-3 border-b border-gray-200">Каждые 10 минут</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 font-semibold">Сложность настройки</td>
                            <td className="px-4 py-3"><strong className="text-green-600">Простая</strong> (3-4 поля)</td>
                            <td className="px-4 py-3">Средняя (10+ полей)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Что использовать сейчас */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что использовать, пока функционал в разработке</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Пока автоматизация поздравлений не реализована, рекомендуем использовать существующие инструменты:
            </p>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h4 className="font-bold text-indigo-900 mb-2">
                            ✅ <strong>Универсальные конкурсы</strong> (2.4.4)
                        </h4>
                        <p className="text-sm text-indigo-800">
                            Создайте конкурс с условием "Написать в комментариях дату рождения". Вручную соберёте список именинников 
                            месяца и разыграете между ними призы. Долго, но работает прямо сейчас.
                        </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h4 className="font-bold text-purple-900 mb-2">
                            ⚡ <strong>AI посты</strong> (2.4.5)
                        </h4>
                        <p className="text-sm text-purple-800">
                            Настройте AI-автоматизацию для генерации постов с поздравлениями. Можно публиковать общие поздравления 
                            "Сегодня день рождения у наших подписчиков!", но это не персонализировано.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-bold text-gray-900 mb-2">
                            🔧 <strong>Сторонние сервисы</strong>
                        </h4>
                        <p className="text-sm text-gray-700">
                            Используйте внешние инструменты автоматизации VK (SMMplanner, Pepper.Ninja). Они платные, 
                            но поддерживают автоматические поздравления уже сейчас.
                        </p>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Часто задаваемые вопросы</h2>

            <div className="not-prose my-6">
                <div className="space-y-4">
                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            1. Когда появится эта функция?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Функционал находится в backlog разработки. Точные сроки зависят от приоритетов. 
                            Следите за обновлениями в Changelog приложения.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            2. Можно ли будет настроить несколько шаблонов поздравлений?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            В первой версии планируется один шаблон на проект. Возможность создавать несколько вариантов 
                            (например, для разных возрастов) может появиться позже.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            3. Будет ли статистика отправленных поздравлений?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Да. Планируется отдельная вкладка "Статистика" с информацией: сколько поздравлений отправлено, 
                            сколько доставлено успешно, сколько промокодов использовано.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            4. Можно ли будет прикрепить картинку к поздравлению?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Планируется возможность прикрепить одну фотографию или стикер ко всем поздравлениям. 
                            Детали будут уточнены при реализации.
                        </p>
                    </details>

                    <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            5. Будут ли поздравления работать для нескольких проектов?
                        </summary>
                        <p className="text-sm text-gray-700 mt-2">
                            Да. Каждый проект сможет иметь свои настройки поздравлений: отдельный текст, промокоды и время отправки.
                        </p>
                    </details>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-6-2-settings" />
        </article>
    );
};
