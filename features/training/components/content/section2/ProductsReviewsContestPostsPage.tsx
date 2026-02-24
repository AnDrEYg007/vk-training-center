import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Статусные badge
// =====================================================================

type ParticipantStatus = 'new' | 'processing' | 'commented' | 'error' | 'winner' | 'used';

const StatusBadge: React.FC<{ status: ParticipantStatus }> = ({ status }) => {
    switch (status) {
        case 'new': return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs border border-gray-200">Новый</span>;
        case 'processing': return <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-100 animate-pulse">В работе</span>;
        case 'commented': return <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded text-xs border border-green-100">Принят</span>;
        case 'error': return <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs border border-red-100">Ошибка</span>;
        case 'winner': return <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold border border-amber-200">Победитель</span>;
        case 'used': return <span className="text-gray-400 bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-200">Использован</span>;
    }
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Таблица участников
// =====================================================================

interface MockEntry {
    id: string;
    entry_number?: number;
    user_photo?: string;
    user_name: string;
    user_vk_id: number;
    post_text: string;
    post_link: string;
    status: ParticipantStatus;
    created_at: string;
}

const MockPostsTable: React.FC<{ entries: MockEntry[] }> = ({ entries }) => {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div className="text-sm text-gray-500">
                    Найдено участников: <strong>{entries.length}</strong>
                </div>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto custom-scrollbar" style={{ maxHeight: '400px' }}>
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <p>Список пуст.</p>
                        <p className="text-sm mt-1">Нажмите "Собрать посты", чтобы найти участников.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0 shadow-sm z-10">
                            <tr>
                                <th className="px-4 py-3 w-16 text-center">№</th>
                                <th className="px-4 py-3 w-16">Фото</th>
                                <th className="px-4 py-3 w-48">Автор</th>
                                <th className="px-4 py-3">Текст поста</th>
                                <th className="px-4 py-3 w-32">Статус</th>
                                <th className="px-4 py-3 w-40">Дата</th>
                                <th className="px-4 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {entries.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-center font-bold text-gray-700">
                                        {p.entry_number || '-'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.user_photo ? (
                                            <img src={p.user_photo} className="w-8 h-8 rounded-full" alt="" />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={`https://vk.com/id${p.user_vk_id}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-medium hover:underline truncate">
                                            {p.user_name}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-gray-800">
                                        <p className="truncate max-w-xs" title={p.post_text}>{p.post_text}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={p.status} />
                                        {p.status === 'error' && (
                                            <div className="text-[10px] text-red-500 mt-1">Ошибка VK</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {new Date(p.created_at).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <a 
                                            href={p.post_link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Открыть пост ВКонтакте"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Кнопки управления
// =====================================================================

const MockControlButtons: React.FC<{ newCount: number; readyCount: number }> = ({ newCount, readyCount }) => {
    const [isCollecting, setIsCollecting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleCollect = () => {
        setIsCollecting(true);
        setTimeout(() => {
            setIsCollecting(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2000);
        }, 1500);
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => setIsProcessing(false), 1500);
    };

    return (
        <div className="flex gap-2">
            <button 
                className="p-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Обновить список"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5m11 2a9 9 0 11-2.064-5.364M20 4v5h-5" />
                </svg>
            </button>

            <button 
                onClick={handleProcess}
                disabled={isProcessing || newCount === 0}
                className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 shadow-sm transition-colors"
                title="Присвоить номера новым участникам"
            >
                {isProcessing ? (
                    <div className="h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                )}
                Прокомментировать ({newCount})
            </button>
            
            <button 
                disabled={readyCount === 0}
                className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-amber-500 text-amber-600 hover:bg-amber-50 disabled:opacity-50 disabled:border-gray-300 disabled:text-gray-400 flex items-center gap-2 shadow-sm transition-colors"
                title="Выбрать победителя и опубликовать итоги"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Подвести итоги ({readyCount})
            </button>

            <button 
                onClick={handleCollect}
                disabled={isCollecting}
                className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center gap-2 shadow-sm"
            >
                {isCollecting ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
                Собрать посты
            </button>

            {showToast && (
                <div className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow-lg text-sm">
                    ✓ Сбор постов завершен
                </div>
            )}
        </div>
    );
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Всплывающее окно результата
// =====================================================================

type ResultType = 'success' | 'error' | 'skipped';

const MockResultModal: React.FC<{ type: ResultType; onClose: () => void }> = ({ type, onClose }) => {
    let title = "";
    let iconClass = "";
    let icon = null;
    let content = null;

    if (type === 'error') {
        title = "Ошибка!";
        iconClass = "text-red-600 bg-red-100";
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
        content = (
            <div className="text-center">
                <p className="text-gray-700 mb-4">Не удалось подвести итоги конкурса</p>
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    Возможные причины:
                    <ul className="list-disc list-inside mt-1 text-left px-2">
                        <li>Закончились свободные промокоды.</li>
                        <li>Все участники находятся в черном списке.</li>
                        <li>Ошибка доступа к API (проверьте токены).</li>
                    </ul>
                </div>
            </div>
        );
    } else if (type === 'skipped') {
        title = "Розыгрыш перенесен";
        iconClass = "text-amber-600 bg-amber-100";
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        );
        content = (
            <div className="text-center">
                <p className="text-gray-700">Условия завершения не выполнены.</p>
                <p className="text-sm text-gray-500 mt-2">Конкурс продолжится до следующего запуска.</p>
            </div>
        );
    } else {
        title = "Успешно!";
        iconClass = "text-green-600 bg-green-100";
        icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        );
        content = (
            <div className="text-center space-y-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">Победитель выбран:</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">Иван Петров</p>
                </div>
                
                <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Открыть пост с итогами
                </button>
                
                <p className="text-xs text-gray-500">Приз отправлен победителю. Подробности в журнале отправки.</p>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <div className={`p-3 rounded-full ${iconClass}`}>
                            {icon}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 text-center mb-4">{title}</h3>
                    {content}
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-center">
                    <button 
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ
// =====================================================================

export const ProductsReviewsContestPostsPage: React.FC<ContentProps> = ({ title }) => {
    // Состояния для Sandbox 1: Таблица с разными статусами
    const [sandbox1Entries] = useState<MockEntry[]>([
        {
            id: '1',
            entry_number: 1,
            user_photo: 'https://picsum.photos/seed/user1/64/64',
            user_name: 'Анна Смирнова',
            user_vk_id: 123456,
            post_text: 'Отличный товар! Использую уже месяц, всем рекомендую 👍',
            post_link: 'https://vk.com/wall-123456_789',
            status: 'commented',
            created_at: '2026-02-15T10:30:00'
        },
        {
            id: '2',
            user_photo: 'https://picsum.photos/seed/user2/64/64',
            user_name: 'Дмитрий Козлов',
            user_vk_id: 234567,
            post_text: 'Купил на днях, качество супер! #конкурс',
            post_link: 'https://vk.com/wall-123456_790',
            status: 'new',
            created_at: '2026-02-16T14:20:00'
        },
        {
            id: '3',
            entry_number: 2,
            user_photo: 'https://picsum.photos/seed/user3/64/64',
            user_name: 'Елена Волкова',
            user_vk_id: 345678,
            post_text: 'Спасибо за качественный продукт!',
            post_link: 'https://vk.com/wall-123456_791',
            status: 'winner',
            created_at: '2026-02-14T09:15:00'
        },
        {
            id: '4',
            user_name: 'Игорь Петров',
            user_vk_id: 456789,
            post_text: 'Очень доволен покупкой!',
            post_link: 'https://vk.com/wall-123456_792',
            status: 'error',
            created_at: '2026-02-17T16:45:00'
        },
        {
            id: '5',
            entry_number: 3,
            user_photo: 'https://picsum.photos/seed/user5/64/64',
            user_name: 'Мария Белова',
            user_vk_id: 567890,
            post_text: 'Рекомендую всем! #лучшийтовар',
            post_link: 'https://vk.com/wall-123456_793',
            status: 'used',
            created_at: '2026-02-13T11:00:00'
        }
    ]);

    // Состояния для Sandbox 3: Всплывающее окно
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<ResultType>('success');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================ */}
            {/* СЕКЦИЯ 1: ВВЕДЕНИЕ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое посты конкурса?</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Посты конкурса</strong> — это центральный раздел управления конкурсом отзывов, где собираются все участники, оставившие посты с ключевыми словами на стене сообщества. Здесь вы контролируете весь процесс: от автоматического сбора постов до выбора победителя и публикации итогов.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система автоматически находит посты по заданным ключевым словам, присваивает номера участникам, комментирует их записи и выбирает случайного победителя из принятых заявок. Всё управление происходит через единый интерфейс с понятными статусами и кнопками действий.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 2: БЫЛО / СТАЛО */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работало раньше?</h2>
                
                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">❌ Было: Ручной поиск и подсчёт участников</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Раньше, чтобы провести конкурс отзывов, нужно было:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Вручную искать посты на стене сообщества по ключевым словам</li>
                    <li>Записывать каждого участника в Excel-таблицу с номером и ссылкой</li>
                    <li>Заходить на страницу каждого участника и комментировать его пост вручную</li>
                    <li>Использовать генератор случайных чисел для выбора победителя</li>
                    <li>Проверять, не находится ли победитель в черном списке</li>
                    <li>Вручную создавать пост с итогами и отправлять приз</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    На проведение одного розыгрыша уходило 1-2 часа работы. При частых конкурсах (раз в неделю) это превращалось в бесконечную рутину.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">✅ Стало: Автоматизированная система управления</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Теперь весь процесс автоматизирован:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Одна кнопка "Собрать посты":</strong> Система автоматически находит все посты с ключевыми словами за указанный период</li>
                    <li><strong>Автоматическая нумерация:</strong> Кнопка "Прокомментировать" присваивает номера всем новым участникам и оставляет комментарии под их постами</li>
                    <li><strong>Визуальные статусы:</strong> Каждый участник имеет цветной badge статуса (Новый, Принят, Победитель и т.д.)</li>
                    <li><strong>Умный выбор победителя:</strong> Система автоматически исключает пользователей из черного списка и тех, кто уже выигрывал</li>
                    <li><strong>Автопубликация итогов:</strong> Пост с результатами публикуется автоматически, приз отправляется победителю</li>
                    <li><strong>История участников:</strong> Все записи сохраняются в таблице с удобной фильтрацией</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Теперь на проведение розыгрыша уходит 3-5 минут — просто нажмите три кнопки.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 3: СТРУКТУРА ТАБЛИЦЫ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как устроена таблица участников</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Таблица содержит семь колонок с полной информацией о каждом участнике:
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Номер участника (№)</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Уникальный номер, присвоенный участнику при комментировании. Если номер еще не присвоен — отображается прочерк (-).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Фото</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Аватар пользователя из VK. Если фото не загружено — показывается серый круг.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Автор</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Имя пользователя и кликабельная ссылка на его профиль VK. Ссылка открывается в новой вкладке.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Текст поста</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Первые несколько слов из поста участника. Если навести курсор — появится всплывающая подсказка с полным текстом.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">5. Статус</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Цветной badge, показывающий текущее состояние заявки. Подробнее о статусах — ниже в разделе "Статусы участников".
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">6. Дата</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Когда пост был найден системой (формат <code>ДД.ММ.ГГГГ</code>).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">7. Действия</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Иконка внешней ссылки — при клике открывается оригинальный пост участника на стене ВКонтакте.
                </p>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 1: Таблица участников */}
            {/* ============================================ */}
            <Sandbox
                title="📋 Таблица участников конкурса"
                description="Пример таблицы с разными статусами участников. Обратите внимание на цветные badges статусов."
                instructions={[
                    '<strong>Наведите</strong> курсор на строку — она подсветится',
                    '<strong>Кликните</strong> на имя участника — откроется его профиль VK (имитация)',
                    '<strong>Наведите</strong> на текст поста — увидите всплывающую подсказку',
                    '<strong>Кликните</strong> на иконку внешней ссылки — откроется пост VK'
                ]}
            >
                <MockPostsTable entries={sandbox1Entries} />
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 4: КНОПКИ УПРАВЛЕНИЯ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Кнопки управления конкурсом</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В правом верхнем углу таблицы расположены четыре кнопки для управления процессом:
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">🔄 Обновить</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Иконка с круговыми стрелками. Перезагружает список участников с сервера. При загрузке иконка вращается.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">💬 Прокомментировать (N)</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Зелёная кнопка с иконкой комментария. Присваивает номера всем участникам со статусом "Новый" и оставляет комментарии под их постами. Число в скобках показывает количество необработанных участников.
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Недоступна</strong>, если нет новых участников (число = 0)</li>
                    <li>Во время работы показывает индикатор загрузки</li>
                    <li>После успеха все обработанные участники получают статус "Принят"</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">⭐ Подвести итоги (N)</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Жёлтая кнопка с иконкой звезды. Выбирает случайного победителя из участников со статусом "Принят", публикует пост с итогами и отправляет приз. Число в скобках показывает количество участников, готовых к розыгрышу.
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Недоступна</strong>, если нет принятых участников</li>
                    <li>Система автоматически исключает пользователей из черного списка</li>
                    <li>После успеха показывает всплывающее окно с именем победителя</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">🔍 Собрать посты</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Синяя кнопка с иконкой лупы. Запускает автоматический сбор постов со стены сообщества по заданным ключевым словам. Все найденные посты добавляются в таблицу со статусом "Новый".
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Работает с учетом настроек конкурса (период, ключевые слова)</li>
                    <li>Во время сбора показывает индикатор загрузки</li>
                    <li>После завершения появляется уведомление и таблица обновляется</li>
                </ul>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 2: Кнопки управления */}
            {/* ============================================ */}
            <Sandbox
                title="🎮 Демонстрация кнопок управления"
                description="Попробуйте взаимодействовать с кнопками. Обратите внимание на состояния 'недоступно' и индикаторы загрузки."
                instructions={[
                    '<strong>Кликните</strong> "Прокомментировать" — увидите индикатор загрузки',
                    '<strong>Кликните</strong> "Собрать посты" — появится уведомление об успехе',
                    '<strong>Обратите внимание</strong>: кнопки становятся недоступными при нулевом количестве участников'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div className="text-sm text-gray-500">
                            Новых участников: <strong>3</strong> • Готовых к розыгрышу: <strong>5</strong>
                        </div>
                    </div>
                    <MockControlButtons newCount={3} readyCount={5} />
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 5: СТАТУСЫ УЧАСТНИКОВ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Статусы участников</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Каждый участник имеет цветной badge статуса, который показывает его текущее состояние в конкурсе:
                </p>

                <div className="!not-prose space-y-4 !my-6">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <StatusBadge status="new" />
                        <div>
                            <p className="font-semibold text-gray-800">Новый</p>
                            <p className="text-sm text-gray-600">Пост найден системой, но номер еще не присвоен. Требуется комментирование.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <StatusBadge status="processing" />
                        <div>
                            <p className="font-semibold text-gray-800">В работе</p>
                            <p className="text-sm text-gray-600">Система в данный момент обрабатывает заявку (присваивает номер, комментирует пост). Badge мигает.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <StatusBadge status="commented" />
                        <div>
                            <p className="font-semibold text-gray-800">Принят</p>
                            <p className="text-sm text-gray-600">Участнику присвоен номер, комментарий оставлен. Готов к участию в розыгрыше.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                        <StatusBadge status="error" />
                        <div>
                            <p className="font-semibold text-gray-800">Ошибка</p>
                            <p className="text-sm text-gray-600">Не удалось прокомментировать пост (возможно, пост удален или закрыты комментарии). Под badge появляется текст "Ошибка VK".</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <StatusBadge status="winner" />
                        <div>
                            <p className="font-semibold text-gray-800">Победитель</p>
                            <p className="text-sm text-gray-600">Этот участник выиграл в текущем розыгрыше. Badge выделен жирным шрифтом.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <StatusBadge status="used" />
                        <div>
                            <p className="font-semibold text-gray-800">Использован</p>
                            <p className="text-sm text-gray-600">Участник выигрывал в прошлых розыгрышах. Не участвует в текущем конкурсе (архивная запись).</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 6: ВСПЛЫВАЮЩЕЕ ОКНО РЕЗУЛЬТАТА */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Окно с результатом розыгрыша</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    После нажатия кнопки "Подвести итоги" появляется всплывающее окно с одним из трёх вариантов результата:
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">✅ Успех</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Зелёная иконка галочки</li>
                    <li>Отображается имя победителя</li>
                    <li>Кнопка "Открыть пост с итогами" ведёт на опубликованный пост в VK</li>
                    <li>Указано, что приз отправлен (детали в журнале отправки)</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">⏰ Розыгрыш перенесён</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Жёлтая иконка часов</li>
                    <li>Сообщение "Условия завершения не выполнены"</li>
                    <li>Конкурс продолжится до следующего запуска</li>
                    <li>Такое происходит, если не набрано нужное количество участников</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">❌ Ошибка</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Красная иконка восклицательного знака</li>
                    <li>Список возможных причин ошибки</li>
                    <li>Чаще всего: закончились промокоды или все участники в чёрном списке</li>
                </ul>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 3: Всплывающее окно */}
            {/* ============================================ */}
            <Sandbox
                title="🏆 Демонстрация окна результата"
                description="Нажмите на кнопки ниже, чтобы увидеть разные варианты результата подведения итогов."
                instructions={[
                    '<strong>Кликните</strong> "Показать успех" — увидите окно с именем победителя',
                    '<strong>Кликните</strong> "Показать перенос" — увидите сообщение о переносе',
                    '<strong>Кликните</strong> "Показать ошибку" — увидите список возможных причин',
                    '<strong>Закройте</strong> окно кнопкой или кликом вне области'
                ]}
            >
                <div className="flex gap-3 flex-wrap">
                    <button 
                        onClick={() => { setModalType('success'); setShowModal(true); }}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                        Показать успех
                    </button>
                    <button 
                        onClick={() => { setModalType('skipped'); setShowModal(true); }}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-amber-600 text-white hover:bg-amber-700"
                    >
                        Показать перенос
                    </button>
                    <button 
                        onClick={() => { setModalType('error'); setShowModal(true); }}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                        Показать ошибку
                    </button>
                </div>
                {showModal && <MockResultModal type={modalType} onClose={() => setShowModal(false)} />}
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 7: СОВЕТЫ ПО ИСПОЛЬЗОВАНИЮ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">💡 Советы по использованию</h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как часто нажимать "Собрать посты"?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Зависит от активности сообщества. Если конкурс еженедельный — достаточно собирать посты раз в день. Если у вас много отзывов — можно проверять 2-3 раза в день.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что делать с участниками со статусом "Ошибка"?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Обычно это означает, что пост был удалён или комментарии закрыты. Проверьте вручную — возможно, нужно связаться с участником. Если пост действительно недоступен, такой участник не попадёт в розыгрыш.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Можно ли изменить номер участника вручную?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Нет, номера присваиваются автоматически и не подлежат изменению. Это гарантирует честность розыгрыша. Если нужно исключить участника — добавьте его в чёрный список.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сколько времени занимает сбор постов?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Обычно 5-30 секунд, в зависимости от количества постов на стене. При большом объёме (1000+ постов) может занять до минуты.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что произойдет, если нажать "Подвести итоги" дважды?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система защищена от двойной отправки. При повторном нажатии во время обработки кнопка будет недоступна. Если розыгрыш уже завершён, система выберет другого победителя (если есть доступные участники).
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 8: FAQ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">❓ Частые вопросы (FAQ)</h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Почему некоторые участники не попадают в таблицу?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система собирает только те посты, которые содержат ключевые слова из настроек конкурса и опубликованы в указанном временном диапазоне. Проверьте настройки раздела "Настройки конкурса".
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как система выбирает победителя?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Случайным образом из всех участников со статусом "Принят". Система автоматически исключает пользователей из чёрного списка и тех, кто уже побеждал (если включена соответствующая настройка).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Можно ли вручную добавить участника?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Нет, система работает только с автоматически собранными постами. Это гарантирует прозрачность конкурса. Если нужно учесть чей-то пост — убедитесь, что он содержит ключевые слова.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что делать, если кнопка "Собрать посты" не работает?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Проверьте: 1) Активен ли конкурс в настройках, 2) Указаны ли ключевые слова, 3) Корректны ли токены доступа VK в разделе "Управление токенами".
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сохраняется ли история прошлых розыгрышей?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Да, все участники со статусом "Победитель" и "Использован" сохраняются в таблице. Вы можете увидеть всех прошлых победителей. Для очистки базы есть кнопка "Очистить" (только для администраторов).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как работает автоматический черный список?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если в настройках включена функция "Автоматический черный список", победители автоматически добавляются в ЧС на заданное количество дней. Это предотвращает повторные победы одних и тех же пользователей.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================ */}
            <NavigationButtons currentPath="2-4-2-8-posts" />
        </article>
    );
};
