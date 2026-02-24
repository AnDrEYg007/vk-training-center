import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { 
    StatusBadge, 
    VkAvatar,
    ParticipantsTableMock
} from './ReviewsContestMocks';

// =====================================================================
// Mock данные участников (из реального ParticipantsTab.tsx)
// =====================================================================
const MOCK_PARTICIPANTS = [
    {
        id: 1,
        photo: 'https://i.pravatar.cc/150?img=1',
        author: 'Иван Иванов',
        text: 'Отличные роллы, спасибо! #отзыв',
        status: 'commented' as const,
        date: '10.08.2023 14:30'
    },
    {
        id: 2,
        photo: 'https://i.pravatar.cc/150?img=2',
        author: 'Мария Петрова',
        text: 'Все вкусно, но доставка долгая. #отзыв',
        status: 'commented' as const,
        date: '10.08.2023 15:00'
    },
    {
        id: 3,
        photo: 'https://i.pravatar.cc/150?img=3',
        author: 'Алексей Сидоров',
        text: 'Пицца супер! #отзыв',
        status: 'processing' as const,
        date: '10.08.2023 15:45'
    },
    {
        id: 4,
        photo: 'https://i.pravatar.cc/150?img=4',
        author: 'Елена Смирнова',
        text: 'Не положили салфетки :( #отзыв',
        status: 'error' as const,
        date: '10.08.2023 16:20'
    },
    {
        id: 5,
        photo: 'https://i.pravatar.cc/150?img=5',
        author: 'Дмитрий Козлов',
        text: 'Быстро и вкусно! #отзыв',
        status: 'winner' as const,
        date: '10.08.2023 17:00'
    },
    {
        id: 6,
        photo: 'https://i.pravatar.cc/150?img=6',
        author: 'Анна Волкова',
        text: 'Первый раз заказываю, всё понравилось #отзыв',
        status: 'new' as const,
        date: '10.08.2023 17:30'
    }
];

// =====================================================================
// Inline компонент: Кнопки действий
// =====================================================================
const ActionButtonsDemo: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = (action: string) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert(`Действие "${action}" выполнено!`);
        }, 1500);
    };

    return (
        <div className="flex flex-wrap gap-2">
            {/* Кнопка "Обновить" */}
            <button 
                onClick={() => handleAction('Обновить')}
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Обновить список"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                </svg>
            </button>

            {/* Кнопка "Очистить" (только для админа) */}
            <button 
                onClick={() => handleAction('Очистить базу')}
                className="p-2 text-red-500 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                title="Полностью очистить список участников (для тестов)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>

            {/* Кнопка "Прокомментировать" */}
            <button 
                onClick={() => handleAction('Прокомментировать новых участников')}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 transition-colors"
            >
                {isLoading ? (
                    <div className="loader h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                )}
                Прокомментировать (1)
            </button>

            {/* Кнопка "Подвести итоги" */}
            <button 
                onClick={() => handleAction('Выбрать победителя')}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 transition-colors"
            >
                {isLoading ? (
                    <div className="loader h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                )}
                Подвести итоги (3)
            </button>

            {/* Кнопка "Собрать посты" */}
            <button 
                onClick={() => handleAction('Собрать новые посты')}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2"
            >
                {isLoading ? (
                    <div className="loader h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
                Собрать посты
            </button>
        </div>
    );
};

// =====================================================================
// Inline компонент: Демонстрация всех статусов
// =====================================================================
const StatusesDemo: React.FC = () => {
    const statuses = [
        { status: 'new' as const, label: 'Новый', description: 'Только что найден, ещё не обработан' },
        { status: 'processing' as const, label: 'В работе', description: 'В очереди на присвоение номера' },
        { status: 'commented' as const, label: 'Принят', description: 'Получил номер, участвует в розыгрыше' },
        { status: 'error' as const, label: 'Ошибка', description: 'Не удалось прокомментировать пост' },
        { status: 'winner' as const, label: 'Победитель', description: 'Выбран победителем розыгрыша' },
        { status: 'used' as const, label: 'Использован', description: 'Уже был победителем ранее' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {statuses.map((item) => (
                <div key={item.status} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                </div>
            ))}
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestParticipantsPage: React.FC<ContentProps> = ({ title }) => {
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredParticipants = filterStatus === 'all' 
        ? MOCK_PARTICIPANTS 
        : MOCK_PARTICIPANTS.filter(p => p.status === filterStatus);

    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================= */}
            {/* ВВЕДЕНИЕ */}
            {/* ============================================= */}
            <p className="!text-lg !leading-relaxed !text-gray-600">
                Раздел <strong>"Участники"</strong> — это центральное место, где собираются все посты с ключевым словом конкурса (например, <code>#отзыв</code>). Здесь вы можете видеть каждого участника, его статус обработки, присвоенный номер и управлять процессом конкурса.
            </p>

            <p>
                <strong>Зачем нужен этот раздел?</strong> Раньше приходилось вручную искать посты в предложке, записывать авторов в таблицу Excel, присваивать номера и комментировать каждого вручную. Теперь система делает всё автоматически — находит участников, комментирует, присваивает номера и даже выбирает победителя с учётом черного списка.
            </p>

            {/* ============================================= */}
            {/* БЫЛО / СТАЛО */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                ❌ Было → ✅ Стало
            </h2>

            <div className="not-prose">
                <div className="grid md:grid-cols-2 gap-6 my-6">
                    {/* БЫЛО */}
                    <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg">
                        <h3 className="text-lg font-bold text-red-900 mb-3">❌ Было (ручная работа)</h3>
                        <ul className="space-y-2 text-sm text-red-800">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Заходить в каждое сообщество ВКонтакте отдельно</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Вручную искать посты с хештегом в предложке</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Записывать участников в Excel-таблицу</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Комментировать каждый пост вручную с номером</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Проверять черный список на бумажке</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Выбирать победителя через random.org</span>
                            </li>
                        </ul>
                    </div>

                    {/* СТАЛО */}
                    <div className="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg">
                        <h3 className="text-lg font-bold text-green-900 mb-3">✅ Стало (автоматизация)</h3>
                        <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Одна кнопка</strong> "Собрать посты" — находит всех участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Таблица с аватарами</strong> — видно кто участвует</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Автокомментирование</strong> — кнопка присваивает номера всем</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Статусы в реальном времени</strong> — видно кто обработан</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Автоматическая фильтрация</strong> — черный список учитывается</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span><strong>Кнопка "Подвести итоги"</strong> — случайный выбор победителя</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ============================================= */}
            {/* СТРУКТУРА ТАБЛИЦЫ */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                📊 Структура таблицы участников
            </h2>

            <p>
                Таблица участников содержит <strong>7 колонок</strong>, каждая из которых несёт важную информацию:
            </p>

            <div className="not-prose">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden my-6">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Колонка</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Назначение</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">№</td>
                                <td className="px-4 py-3 text-gray-600">Присвоенный номер участника (1, 2, 3...). Если пусто — ещё не обработан.</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Фото</td>
                                <td className="px-4 py-3 text-gray-600">Аватар пользователя из ВКонтакте (круглое фото 32×32px).</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Автор</td>
                                <td className="px-4 py-3 text-gray-600">Имя и фамилия участника. Кликабельная ссылка на профиль VK.</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Текст поста</td>
                                <td className="px-4 py-3 text-gray-600">Обрезанный текст отзыва (первые ~50 символов).</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Статус</td>
                                <td className="px-4 py-3 text-gray-600">Цветной бейдж с текущим статусом обработки (6 вариантов).</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Дата</td>
                                <td className="px-4 py-3 text-gray-600">Когда пользователь опубликовал пост с отзывом.</td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">Действия</td>
                                <td className="px-4 py-3 text-gray-600">Иконка внешней ссылки — открыть пост ВКонтакте в новой вкладке.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================================= */}
            {/* СТАТУСЫ УЧАСТНИКОВ */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                🎨 Статусы участников (6 вариантов)
            </h2>

            <p>
                Каждый участник проходит через несколько стадий обработки. Система отображает текущее состояние с помощью цветных бейджей:
            </p>

            <div className="not-prose">
                <StatusesDemo />
            </div>

            <div className="not-prose my-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Подсказка:</strong> Статус <code className="bg-blue-100 px-1.5 py-0.5 rounded text-xs">processing</code> мигает (animate-pulse), чтобы показать что система работает. Если статус застрял в этом состоянии — возможно, ошибка API VK.
                    </p>
                </div>
            </div>

            {/* ============================================= */}
            {/* КНОПКИ ДЕЙСТВИЙ */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                🎮 Кнопки действий (5 кнопок)
            </h2>

            <p>
                Над таблицей расположены <strong>5 кнопок управления конкурсом</strong>. Каждая имеет своё назначение и цвет:
            </p>

            <div className="not-prose">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden my-6">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-40">Кнопка</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700">Назначение</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-700 w-32">Цвет</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">🔄 Обновить</td>
                                <td className="px-4 py-3 text-gray-600">Перезагрузить список участников. Иконка вращается при загрузке.</td>
                                <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Серый</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">🗑️ Очистить</td>
                                <td className="px-4 py-3 text-gray-600">Удалить всех участников из базы (только для админов, для тестирования).</td>
                                <td className="px-4 py-3"><span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Красный</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">💬 Прокомментировать</td>
                                <td className="px-4 py-3 text-gray-600">Присвоить номера новым участникам и написать комментарии под их постами.</td>
                                <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Зелёный</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">⭐ Подвести итоги</td>
                                <td className="px-4 py-3 text-gray-600">Выбрать случайного победителя из принятых участников (исключая ЧС).</td>
                                <td className="px-4 py-3"><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">Янтарный</span></td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-800">🔍 Собрать посты</td>
                                <td className="px-4 py-3 text-gray-600">Найти новые посты с ключевым словом в предложке сообщества.</td>
                                <td className="px-4 py-3"><span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Индиго</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ============================================= */}
            {/* ИНТЕРАКТИВНАЯ ПЕСОЧНИЦА 1: КНОПКИ */}
            {/* ============================================= */}
            <Sandbox
                title="🎮 Интерактивно: Попробуйте кнопки"
                description="Нажмите на любую кнопку, чтобы увидеть как они работают. Обратите внимание на иконки и состояние загрузки."
                instructions={[
                    '<strong>Кнопка "Собрать посты"</strong> (синяя) — находит новые отзывы',
                    '<strong>Кнопка "Прокомментировать"</strong> (зелёная) — присваивает номера',
                    '<strong>Кнопка "Подвести итоги"</strong> (янтарная) — выбирает победителя',
                    '<strong>Иконка "Обновить"</strong> вращается при загрузке'
                ]}
            >
                <ActionButtonsDemo />
            </Sandbox>

            {/* ============================================= */}
            {/* ИНТЕРАКТИВНАЯ ПЕСОЧНИЦА 2: ТАБЛИЦА */}
            {/* ============================================= */}
            <Sandbox
                title="📊 Интерактивно: Таблица с фильтрами"
                description="Выберите статус, чтобы отфильтровать участников. Обратите внимание на аватары, номера и цветные бейджи."
                instructions={[
                    'Фильтр по статусу работает мгновенно',
                    'Аватары загружаются из профилей VK',
                    'Номера присваиваются только после комментирования',
                    'Кликните на имя, чтобы открыть профиль (в реальной системе)'
                ]}
            >
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Фильтр по статусу:</label>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                        <option value="all">Все участники ({MOCK_PARTICIPANTS.length})</option>
                        <option value="new">Только новые</option>
                        <option value="processing">В работе</option>
                        <option value="commented">Принятые</option>
                        <option value="error">С ошибками</option>
                        <option value="winner">Победители</option>
                        <option value="used">Использованные</option>
                    </select>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                        <p className="text-sm text-gray-600">Найдено участников: <strong className="text-gray-800">{filteredParticipants.length}</strong></p>
                    </div>
                    <ParticipantsTableMock data={filteredParticipants} />
                </div>
            </Sandbox>

            {/* ============================================= */}
            {/* СВЯЗЬ С ДРУГИМИ РАЗДЕЛАМИ */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                🔗 Связь с другими разделами
            </h2>

            <p>
                Раздел "Участники" тесно интегрирован с другими частями конкурса:
            </p>

            <div className="not-prose">
                <div className="grid md:grid-cols-2 gap-4 my-6">
                    <div className="bg-white border-l-4 border-indigo-500 p-4 rounded-r-lg shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-2">⚙️ Настройки конкурса</h4>
                        <p className="text-sm text-gray-600">Ключевое слово (например, <code>#отзыв</code>) определяет каких участников собирать. Дата начала — с какого момента учитывать посты.</p>
                    </div>

                    <div className="bg-white border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-2">🚫 Чёрный список</h4>
                        <p className="text-sm text-gray-600">При подведении итогов система автоматически исключает участников из ЧС. Победителем может стать только "чистый" участник.</p>
                    </div>

                    <div className="bg-white border-l-4 border-green-500 p-4 rounded-r-lg shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-2">🎟️ Промокоды</h4>
                        <p className="text-sm text-gray-600">Победитель автоматически получает свободный промокод. Система отправляет его в личные сообщения или пишет в комментарий.</p>
                    </div>

                    <div className="bg-white border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm">
                        <h4 className="font-bold text-gray-800 mb-2">🏆 Победители</h4>
                        <p className="text-sm text-gray-600">История всех розыгрышей сохраняется. Участники со статусом "Победитель" или "Использован" не могут выиграть повторно.</p>
                    </div>
                </div>
            </div>

            {/* ============================================= */}
            {/* СОВЕТЫ ПО РАБОТЕ */}
            {/* ============================================= */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-10">
                💡 Советы по работе с участниками
            </h2>

            <div className="not-prose">
                <div className="space-y-4 my-6">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-blue-900 mb-1">1. Регулярно собирайте новых участников</h4>
                        <p className="text-sm text-blue-800">
                            Кнопка "Собрать посты" не работает автоматически — нажимайте её вручную 1-2 раза в день. Так вы не пропустите новые отзывы.
                        </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-green-900 mb-1">2. Комментируйте сразу после сбора</h4>
                        <p className="text-sm text-green-800">
                            Участники со статусом "Новый" не участвуют в розыгрыше. Нажмите "Прокомментировать", чтобы присвоить им номера. Только после этого они становятся валидными.
                        </p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-yellow-900 mb-1">3. Проверяйте участников с ошибками</h4>
                        <p className="text-sm text-yellow-800">
                            Если у участника статус "Ошибка" — система не смогла прокомментировать его пост. Причины: закрытый профиль, удалённый пост или бан VK API. Можно вручную прокомментировать через VK.
                        </p>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-red-900 mb-1">4. Не используйте "Очистить" в боевом режиме</h4>
                        <p className="text-sm text-red-800">
                            Кнопка "Очистить" (корзина) удаляет <strong>ВСЕХ</strong> участников из базы безвозвратно. Она нужна только для тестирования. В реальном конкурсе не используйте её!
                        </p>
                    </div>
                </div>
            </div>

            {/* ============================================= */}
            {/* ЗАКЛЮЧЕНИЕ */}
            {/* ============================================= */}
            <hr className="!my-10" />

            <p className="!text-base !leading-relaxed !text-gray-600">
                Раздел "Участники" — это сердце автоматизации конкурса. Вместо ручной работы с Excel и комментариями теперь достаточно трёх кликов: <strong>Собрать → Прокомментировать → Подвести итоги</strong>. Система сама найдёт участников, присвоит номера, исключит черный список и выберет победителя.
            </p>

            <div className="not-prose my-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-green-900 mb-2">🎉 Готово к работе!</h4>
                    <p className="text-sm text-green-800">
                        Теперь вы знаете как управлять участниками конкурса. Переходите к следующим разделам, чтобы узнать про победителей, промокоды и рассылку призов.
                    </p>
                </div>
            </div>

            {/* ============================================= */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================= */}
            <NavigationButtons currentPath="2-4-2-3-participants" />
        </article>
    );
};
