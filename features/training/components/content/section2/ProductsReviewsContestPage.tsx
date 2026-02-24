import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import {
    VK_COLORS,
    StatusBadge,
    ToggleSwitch,
    SegmentedControl,
    VkPost,
    VkComment,
    VkMessage,
    RichTemplateEditor,
    ParticipantsTableMock,
    WinnersTableMock,
    TerminalLogsMock
} from './ReviewsContestMocks';

export const ProductsReviewsContestPage: React.FC<ContentProps> = ({ title }) => {
    // State для интерактивных примеров
    const [isContestActive, setIsContestActive] = useState(true);
    const [autoBlacklist, setAutoBlacklist] = useState(false);
    const [finishCondition, setFinishCondition] = useState<'count' | 'date' | 'mixed'>('count');
    const [template, setTemplate] = useState('Спасибо за отзыв! Вы — участник №{number} 🎉');

    // Mock данные для таблиц
    const mockParticipants = [
        { id: 1, photo: 'https://via.placeholder.com/40', author: 'Мария Смирнова', text: 'Заказали пиццу, очень понравилось! #отзыв', status: 'commented' as const, date: '18.02.2026 14:30' },
        { id: 2, photo: 'https://via.placeholder.com/40', author: 'Иван Петров', text: 'Доставка быстрая, сет роллов супер! #отзыв', status: 'new' as const, date: '18.02.2026 15:12' },
        { id: 3, photo: 'https://via.placeholder.com/40', author: 'Елена Козлова', text: 'Спасибо за акцию! #отзыв', status: 'winner' as const, date: '18.02.2026 16:45' }
    ];

    const mockWinners = [
        { date: '18.02.2026', winner: 'Елена Козлова', prize: 'Сет роллов "Филадельфия"', promo: 'WIN_X7Z', status: 'sent' as const },
        { date: '11.02.2026', winner: 'Дмитрий Соколов', prize: 'Пицца "Маргарита"', promo: 'WIN_A3B', status: 'error' as const }
    ];

    const mockLogs = [
        { time: '14:30:42', level: 'INFO' as const, message: 'Собрано 3 новых поста по ключевому слову "#отзыв"' },
        { time: '14:35:18', level: 'SUCCESS' as const, message: 'Участник №1 зарегистрирован. Комментарий отправлен' },
        { time: '14:40:05', level: 'SUCCESS' as const, message: 'Итоги подведены. Победитель: Елена Козлова' }
    ];

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            {/* ВВЕДЕНИЕ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это за функция?</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Конкурс отзывов</strong> — это полностью автоматизированный розыгрыш призов за отзывы клиентов в VK. 
                    Система сама находит посты с ключевым словом (например, <code>#отзыв</code>), регистрирует участников, 
                    подводит итоги и вручает промокоды победителям.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Зачем это нужно?</h3>
                <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="text-base font-bold text-indigo-900 mb-3">❌ Раньше (вручную)</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>🔍 Ежедневный поиск отзывов по хештегу</li>
                                <li>💬 Ручная регистрация каждого участника</li>
                                <li>🎲 Случайный выбор победителя</li>
                                <li>✉️ Отправка промокода в ЛС вручную</li>
                                <li>📝 Публикация итогов на стене</li>
                                <li>⏱️ <strong>Время:</strong> ~2 часа в неделю</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-green-900 mb-3">✅ Теперь (автоматически)</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>🤖 Система сама собирает посты с <code>#отзыв</code></li>
                                <li>💬 Автоматическая регистрация с номером участника</li>
                                <li>🎉 Подведение итогов в заданный день/количество</li>
                                <li>✉️ Автоматическая отправка промокода победителям</li>
                                <li>📢 Автоматический пост с результатами</li>
                                <li>⏱️ <strong>Время:</strong> 10 минут на загрузку промокодов</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает?</h3>
                <div className="not-prose my-6">
                    <div className="flex items-center gap-4 overflow-x-auto pb-4">
                        {[
                            { num: 1, icon: '🔍', title: 'Сбор постов', desc: 'Система ищет посты с ключевым словом' },
                            { num: 2, icon: '💬', title: 'Регистрация', desc: 'Под каждым постом оставляется комментарий с номером' },
                            { num: 3, icon: '🎉', title: 'Подведение итогов', desc: 'В заданный день/количество выбирается победитель' },
                            { num: 4, icon: '🎁', title: 'Вручение приза', desc: 'Промокод отправляется в ЛС победителю' },
                            { num: 5, icon: '📢', title: 'Публикация', desc: 'Пост с итогами размещается на стене' }
                        ].map((step, idx) => (
                            <div key={idx} className="flex-shrink-0 w-48 bg-white border-2 border-indigo-200 rounded-lg p-4 text-center">
                                <div className="text-4xl mb-2">{step.icon}</div>
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">{step.num}</span>
                                    <p className="font-bold text-sm text-gray-900">{step.title}</p>
                                </div>
                                <p className="text-xs text-gray-600">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА НАСТРОЙКИ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Настройки"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Эта вкладка разделена на две части: <strong>слева — настройки конкурса</strong>, <strong>справа — предпросмотр</strong> того, 
                    как будут выглядеть сообщения участникам.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Основные настройки</h3>
                <Sandbox
                    title="Интерактивный пример: Включение конкурса"
                    description="Попробуйте включить/выключить конкурс и настроить автоматическое добавление в черный список."
                    instructions={[
                        'Переключите <strong>статус конкурса</strong> (активен/неактивен)',
                        'Включите <strong>авто-добавление в ЧС</strong> — победитель автоматически будет заблокирован на N дней'
                    ]}
                >
                    <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-6">
                        <ToggleSwitch 
                            isActive={isContestActive}
                            onChange={setIsContestActive}
                            label="Конкурс активен"
                        />

                        {isContestActive && (
                            <div className="space-y-4 animate-fade-in-up">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ключевое слово</label>
                                    <input 
                                        type="text" 
                                        value="#отзыв" 
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-indigo-700 text-sm"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Посты с этим словом будут участвовать в конкурсе</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Дата начала</label>
                                    <input 
                                        type="date" 
                                        value="2026-02-18" 
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        readOnly
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Посты до этой даты не будут учитываться</p>
                                </div>

                                <ToggleSwitch 
                                    isActive={autoBlacklist}
                                    onChange={setAutoBlacklist}
                                    label="Авто-добавление в ЧС после победы"
                                />

                                {autoBlacklist && (
                                    <div className="ml-6 animate-fade-in-up">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">На сколько дней</label>
                                        <input 
                                            type="number" 
                                            value={7} 
                                            min={1}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center font-bold text-sm no-spinners"
                                            readOnly
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Победитель не сможет участвовать повторно в течение этого времени</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Sandbox>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Условия завершения конкурса</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Вы можете выбрать <strong>один из трёх режимов</strong>, когда система автоматически подведёт итоги:
                </p>

                <Sandbox
                    title="Интерактивный пример: Условия завершения"
                    description="Выберите режим завершения конкурса и посмотрите, какие настройки доступны для каждого."
                    instructions={[
                        'Переключайте между режимами: <strong>🎉 По количеству</strong>, <strong>📅 В определенный день</strong>, <strong>⚖️ Смешанный</strong>',
                        'Обратите внимание, как меняются доступные настройки'
                    ]}
                >
                    <div className="bg-white rounded-lg border border-gray-300 p-6 space-y-6">
                        <SegmentedControl value={finishCondition} onChange={setFinishCondition} />

                        <div className="min-h-[12rem] bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {finishCondition === 'count' && (
                                <div className="animate-fade-in-up">
                                    <p className="text-2xl mb-3">🎉</p>
                                    <p className="font-semibold text-gray-800 mb-2">Подведение по количеству участников</p>
                                    <div className="flex items-center gap-3 mb-3">
                                        <label className="text-sm text-gray-700">Целевое количество:</label>
                                        <input 
                                            type="number" 
                                            value={50} 
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center font-bold no-spinners"
                                            readOnly
                                        />
                                    </div>
                                    <p className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-200">
                                        Пост с итогами опубликуется <strong>автоматически</strong>, как только наберется 50 участников
                                    </p>
                                </div>
                            )}

                            {finishCondition === 'date' && (
                                <div className="animate-fade-in-up">
                                    <p className="text-2xl mb-3">📅</p>
                                    <p className="font-semibold text-gray-800 mb-2">Подведение в определенный день</p>
                                    <div className="space-y-3 mb-3">
                                        <div>
                                            <label className="text-sm text-gray-700 block mb-2">День недели:</label>
                                            <div className="flex gap-2">
                                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => (
                                                    <button 
                                                        key={idx}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                            idx === 4 
                                                                ? 'bg-indigo-600 text-white' 
                                                                : 'bg-white border border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 block mb-2">Время:</label>
                                            <input 
                                                type="time" 
                                                value="18:00" 
                                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-200">
                                        Итоги подведутся каждую <strong>пятницу в 18:00</strong>, независимо от количества участников
                                    </p>
                                </div>
                            )}

                            {finishCondition === 'mixed' && (
                                <div className="animate-fade-in-up">
                                    <p className="text-2xl mb-3">⚖️</p>
                                    <p className="font-semibold text-gray-800 mb-2">Смешанный режим</p>
                                    <div className="space-y-3 mb-3">
                                        <div className="flex items-center gap-3">
                                            <label className="text-sm text-gray-700">Минимум участников:</label>
                                            <input 
                                                type="number" 
                                                value={30} 
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-md text-center font-bold no-spinners"
                                                readOnly
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-700 block mb-2">Проверка каждую:</label>
                                            <div className="flex gap-2">
                                                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => (
                                                    <button 
                                                        key={idx}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                            idx === 4 
                                                                ? 'bg-indigo-600 text-white' 
                                                                : 'bg-white border border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-white rounded p-3 border border-gray-200">
                                        Каждую <strong>пятницу</strong> система проверит: если набралось 30+ участников — подведет итоги. 
                                        Если нет — перенесет на следующую пятницу
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </Sandbox>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Шаблоны сообщений</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система использует <strong>4 типа шаблонов</strong> для общения с участниками. 
                    В каждом шаблоне можно использовать <strong>переменные</strong> (например, <code>{'{number}'}</code> или <code>{'{promo_code}'}</code>), 
                    которые автоматически заменятся на реальные значения.
                </p>

                <Sandbox
                    title="Интерактивный пример: Редактор шаблона"
                    description="Попробуйте отредактировать шаблон комментария. Переменные выделены цветом."
                    instructions={[
                        'Измените текст в поле редактора',
                        'Нажмите на кнопку <code>{number}</code>, чтобы вставить переменную "Номер участника"',
                        'Посмотрите на предпросмотр ниже — переменная будет заменена на реальное значение'
                    ]}
                >
                    <div className="space-y-4">
                        <RichTemplateEditor
                            label="Шаблон комментария (Регистрация)"
                            value={template}
                            onChange={setTemplate}
                            helpText="Этот комментарий будет отправлен под публикацией участника"
                            specificVariables={[
                                { name: 'Номер', value: '{number}' }
                            ]}
                        />

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                            <p className="text-sm font-semibold text-purple-900 mb-2">Предпросмотр (как увидит участник):</p>
                            <p className="text-sm text-gray-800 bg-white rounded p-3 border border-purple-200">
                                {template.replace('{number}', '42')}
                            </p>
                        </div>
                    </div>
                </Sandbox>

                <div className="not-prose my-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">📋 Доступные шаблоны:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Комментарий регистрации:</strong> Отправляется под постом участника. Переменная: <code>{'{number}'}</code></li>
                        <li><strong>Сообщение победителю (ЛС):</strong> Отправляется в личные сообщения. Переменные: <code>{'{promo_code}'}</code>, <code>{'{description}'}</code>, <code>{'{user_name}'}</code></li>
                        <li><strong>Ошибка отправки (Комментарий):</strong> Если ЛС закрыто, промокод публикуется в комментарии. Переменная: <code>{'{user_name}'}</code></li>
                        <li><strong>Пост с итогами:</strong> Публикуется на стене сообщества. Переменная: <code>{'{winners_list}'}</code></li>
                    </ul>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Предпросмотр в стиле VK</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Справа от настроек отображаются <strong>3 сценария</strong> того, как будут выглядеть сообщения во ВКонтакте:
                </p>

                <Sandbox
                    title="Сценарий 1: Пост участника и ваш ответ"
                    description="Так выглядит регистрация участника — система находит пост с ключевым словом и оставляет комментарий."
                >
                    <div style={{ backgroundColor: VK_COLORS.bg }} className="p-6 rounded-lg">
                        <VkPost
                            authorName="Мария Смирнова"
                            date="сегодня в 14:30"
                            text={`Вчера заказали пиццу, очень понравилось! Тесто тонкое, начинки много.\n\n#отзыв`}
                            highlightWord="#отзыв"
                            blurredExtras={true}
                        >
                            <VkComment
                                isGroup
                                authorName="Пиццерия Вкусно"
                                text={template.replace('{number}', '42')}
                                date="сегодня в 14:35"
                                replyToName="Мария"
                            />
                        </VkPost>
                    </div>
                </Sandbox>

                <Sandbox
                    title="Сценарий 2: Объявление итогов"
                    description="После подведения итогов на стене сообщества публикуется пост с победителями."
                >
                    <div style={{ backgroundColor: VK_COLORS.bg }} className="p-6 rounded-lg">
                        <VkPost
                            isGroup
                            authorName="Пиццерия Вкусно"
                            date="только что"
                            text={`🎉 Итоги конкурса отзывов!\n\nСпасибо всем за участие! Победитель:\n\n1. Мария Смирнова (№42)\n\nПромокод уже отправлен в личные сообщения. Поздравляем! 🎁`}
                            blurredExtras={true}
                        />
                    </div>
                </Sandbox>

                <Sandbox
                    title="Сценарий 3: Вручение приза"
                    description="Промокод отправляется победителю в личные сообщения. Если ЛС закрыто — публикуется комментарий под его постом."
                >
                    <div style={{ backgroundColor: VK_COLORS.bg }} className="p-6 rounded-lg space-y-4">
                        <div className="text-xs text-gray-500 italic text-right">Пример с кодом: WIN_X7Z</div>
                        <VkMessage
                            authorName="Пиццерия Вкусно"
                            text={`Поздравляем, Мария! 🎉\n\nВы победили в конкурсе отзывов!\nВаш промокод: WIN_X7Z\nПриз: Сет роллов "Филадельфия"\n\nПокажите этот код при заказе.`}
                            date="14:40"
                            blurredExtras={true}
                        />

                        <div className="text-center text-xs text-gray-500 py-2 border-t border-gray-300">
                            Если ЛС закрыто (Fallback):
                        </div>

                        <VkPost
                            authorName="Мария Смирнова"
                            date="сегодня в 14:30"
                            text={`Вчера заказали пиццу, очень понравилось! Тесто тонкое, начинки много.\n\n#отзыв`}
                            blurredExtras={true}
                        >
                            <VkComment
                                isGroup
                                authorName="Пиццерия Вкусно"
                                text={`Мария, поздравляем! 🎉 Не удалось отправить промокод в ЛС. Ваш код: WIN_X7Z`}
                                date="только что"
                                replyToName="Мария"
                            />
                        </VkPost>
                    </div>
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА ПОСТЫ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Посты"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Здесь отображаются все найденные посты с ключевым словом. Каждый пост имеет <strong>статус</strong>, 
                    который показывает текущий этап обработки.
                </p>

                <div className="not-prose my-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-800 mb-3">📊 Статусы участников:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="new" />
                            <span className="text-xs text-gray-600">Найден, но не обработан</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status="processing" />
                            <span className="text-xs text-gray-600">Система отправляет комментарий</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status="commented" />
                            <span className="text-xs text-gray-600">Участник зарегистрирован</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status="error" />
                            <span className="text-xs text-gray-600">Ошибка регистрации</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status="winner" />
                            <span className="text-xs text-gray-600">Выбран победителем</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status="used" />
                            <span className="text-xs text-gray-600">Промокод выдан</span>
                        </div>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Кнопки управления</h3>
                <div className="not-prose my-6">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <button className="px-4 py-2 text-sm font-medium rounded-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" /></svg>
                            Обновить
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md border-green-600 text-green-700 bg-white border hover:bg-green-50 flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            Прокомментировать (2)
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md border-amber-500 text-amber-600 bg-white border hover:bg-amber-50 flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            Подвести итоги (1)
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            Собрать посты
                        </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Обновить:</strong> Перезагрузить таблицу с актуальными данными</li>
                        <li><strong>Прокомментировать:</strong> Зарегистрировать все новые посты (отправить комментарии с номерами)</li>
                        <li><strong>Подвести итоги:</strong> Выбрать победителя из зарегистрированных участников</li>
                        <li><strong>Собрать посты:</strong> Найти новые посты с ключевым словом во ВКонтакте</li>
                    </ul>
                </div>

                <Sandbox
                    title="Пример таблицы участников"
                    description="Так выглядит список собранных постов. Обратите внимание на разные статусы."
                >
                    <ParticipantsTableMock data={mockParticipants} />
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА ПОБЕДИТЕЛИ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Победители"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    История всех розыгрышей — кто выиграл, какой приз получил и как была выполнена доставка промокода.
                </p>

                <div className="not-prose my-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-amber-900 mb-2">🎁 Статусы доставки:</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Вручено (ЛС)</span>
                            — Промокод успешно отправлен в личные сообщения
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Вручено (Коммент)</span>
                            — ЛС было закрыто, промокод опубликован в комментарии под постом победителя
                        </li>
                    </ul>
                </div>

                <Sandbox
                    title="Пример таблицы победителей"
                    description="История розыгрышей с информацией о призах и статусах доставки."
                >
                    <WinnersTableMock data={mockWinners} />
                </Sandbox>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА ПРОМОКОДЫ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Промокоды"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Управление базой промокодов для розыгрышей. Промокоды загружаются через CSV-файл и автоматически 
                    выдаются победителям.
                </p>

                <div className="not-prose my-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-green-900 mb-2">📁 Формат CSV-файла:</p>
                    <pre className="bg-white rounded p-3 text-xs font-mono text-gray-800 overflow-x-auto border border-green-200">
code,description{'\n'}
WIN_X7Z,Сет роллов "Филадельфия"{'\n'}
WIN_A3B,Пицца "Маргарита"{'\n'}
WIN_C9D,Бургер "Классик"
                    </pre>
                    <p className="text-xs text-gray-600 mt-2">
                        <strong>code</strong> — уникальный промокод (обязательно)<br />
                        <strong>description</strong> — описание приза (опционально)
                    </p>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Статусы промокодов</h3>
                <div className="not-prose my-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <span className="font-semibold text-gray-800">Свободен</span>
                            </div>
                            <p className="text-sm text-gray-600">Промокод доступен для выдачи победителю</p>
                        </div>
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                                <span className="font-semibold text-gray-800">Выдан</span>
                            </div>
                            <p className="text-sm text-gray-600">Промокод уже отправлен победителю</p>
                        </div>
                    </div>
                </div>

                <div className="not-prose my-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Важно:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Следите за количеством свободных промокодов — если они закончатся, победитель не получит приз</li>
                        <li>• Промокоды, отмеченные как "Выдан", нельзя использовать повторно</li>
                        <li>• Администраторы могут очистить всю базу промокодов (удаляются ВСЕ, включая выданные)</li>
                    </ul>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА ЧЕРНЫЙ СПИСОК */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Блэклист"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Управление пользователями, которые не могут участвовать в конкурсах. 
                    Блокировка может быть <strong>временной</strong> (до определенной даты) или <strong>постоянной</strong>.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Добавление в черный список</h3>
                <div className="not-prose my-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-red-900 mb-3">Как добавить пользователя:</p>
                    <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
                        <li>Нажмите кнопку <strong>"Добавить в ЧС"</strong></li>
                        <li>Вставьте <strong>ссылку на профиль VK</strong> или прямой ID (например, <code>id123456</code>)</li>
                        <li>Выберите срок блокировки:
                            <ul className="ml-6 mt-1 space-y-1 list-disc">
                                <li><strong>Навсегда</strong> — пользователь никогда не сможет участвовать</li>
                                <li><strong>До даты</strong> — блокировка автоматически снимется в указанный день</li>
                            </ul>
                        </li>
                        <li>Нажмите <strong>"Сохранить"</strong></li>
                    </ol>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Автоматическое добавление</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если в настройках включено <strong>"Авто-добавление в ЧС после победы"</strong>, 
                    то каждый победитель автоматически блокируется на N дней. Это предотвращает повторные победы одних и тех же людей.
                </p>

                <div className="not-prose my-6">
                    <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h4 className="font-semibold text-gray-800">Пример записи в черном списке</h4>
                                <p className="text-xs text-gray-500">Как отображаются заблокированные пользователи</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">М</div>
                                    <div>
                                        <p className="font-medium text-gray-800">Мария Смирнова</p>
                                        <p className="text-xs text-gray-500">ID: 123456 • Добавлен: 18.02.2026</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">До: <strong>25.02.2026</strong></span>
                                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Удалить">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200 opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm">И</div>
                                    <div>
                                        <p className="font-medium text-gray-800 line-through">Иван Петров</p>
                                        <p className="text-xs text-gray-500">ID: 654321 • Добавлен: 11.02.2026</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600">Истек</span>
                                    <button className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Удалить">
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            ⚡ Записи с истекшим сроком блокировки отображаются полупрозрачными и зачеркнутыми
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ВКЛАДКА ЖУРНАЛ ОТПРАВКИ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладка "Лист отправок"</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    История попыток отправки промокодов победителям. Здесь можно увидеть, 
                    кому удалось доставить приз, а у кого возникли проблемы.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Функции журнала</h3>
                <div className="not-prose my-6">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-2">
                            Повторить всем ошибкам
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md border border-red-300 text-red-600 bg-white hover:bg-red-50 flex items-center gap-2">
                            Очистить журнал
                        </button>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Повторить всем ошибкам:</strong> Отправить промокоды всем, у кого не удалось с первого раза</li>
                        <li><strong>Очистить журнал:</strong> Удалить всю историю отправок (необратимо, только для администраторов)</li>
                        <li><strong>Повторить (для одного):</strong> Попробовать отправить промокод конкретному пользователю еще раз</li>
                    </ul>
                </div>

                <div className="not-prose my-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">💡 Когда нужна повторная отправка?</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• У пользователя были закрыты ЛС, но теперь он их открыл</li>
                        <li>• Произошла временная ошибка VK API</li>
                        <li>• Промокод был отправлен, но пользователь его не получил</li>
                    </ul>
                </div>

                <div className="not-prose my-6">
                    <div className="bg-white rounded-lg border-2 border-gray-300 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    Успешно: 15
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                    Ошибки: 2
                                </span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 rounded p-3 border border-gray-200">
                            <p className="font-semibold mb-2">Пример записей журнала:</p>
                            <div className="space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span>18.02.2026 14:40 | Мария Смирнова | WIN_X7Z</span>
                                    <span className="text-green-600 font-semibold">Отправлено (ЛС)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>11.02.2026 18:15 | Дмитрий Соколов | WIN_A3B</span>
                                    <span className="text-red-600 font-semibold">Ошибка (ЛС закрыто)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ИТОГИ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Итоги</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Конкурс отзывов</strong> — это комплексная автоматизация, которая экономит часы ручной работы. 
                    Система берет на себя весь цикл: от поиска участников до вручения призов.
                </p>

                <div className="not-prose my-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-green-900 mb-4">✅ Что дает автоматизация:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div>
                            <p className="font-semibold text-green-800 mb-2">Экономия времени:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Поиск отзывов: с 30 мин → на 0 мин</li>
                                <li>Регистрация участников: с 1 ч → на 5 мин</li>
                                <li>Подведение итогов: с 30 мин → на 2 мин</li>
                                <li><strong>Итого: ~2 часа в неделю</strong></li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-semibold text-green-800 mb-2">Снижение ошибок:</p>
                            <ul className="space-y-1 list-disc list-inside">
                                <li>Нет пропущенных отзывов</li>
                                <li>Нет забытых комментариев</li>
                                <li>Нет ошибок в промокодах</li>
                                <li>Нет повторных победителей (ЧС)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="not-prose my-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <p className="text-sm font-semibold text-yellow-900 mb-2">📝 Важно помнить:</p>
                    <ul className="space-y-1 text-sm text-gray-700">
                        <li>• <strong>Проверяйте баланс промокодов</strong> — если они закончатся, победители не получат призы</li>
                        <li>• <strong>Следите за статусами</strong> — если много ошибок, проверьте настройки VK API</li>
                        <li>• <strong>Используйте логи</strong> — при проблемах они помогут найти причину</li>
                        <li>• <strong>Тестируйте шаблоны</strong> — перед запуском конкурса убедитесь, что предпросмотр выглядит правильно</li>
                    </ul>
                </div>
            </section>

            {/* Навигация */}
            <NavigationButtons currentPath="2-4-2-reviews-contest" />
        </article>
    );
};
