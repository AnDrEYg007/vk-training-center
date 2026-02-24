import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Таблица черного списка
// =====================================================================

interface MockBlacklistEntry {
    id: string;
    user_name: string;
    user_vk_id: number;
    user_screen_name: string;
    until_date: string | null;
    created_at: string;
}

const MockBlacklistTable: React.FC<{ entries: MockBlacklistEntry[] }> = ({ entries }) => {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const formatDate = (dateStr: string | null): React.ReactNode => {
        if (!dateStr) return <span className="text-gray-400">Навсегда</span>;
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const isDateExpired = (dateStr: string | null): boolean => {
        if (!dateStr) return false;
        return new Date(dateStr) < new Date();
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setTimeout(() => setDeletingId(null), 2000);
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Шапка */}
            <div className="p-4 border-b flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Черный список</h3>
                    <p className="text-sm text-gray-500">Участники, которые будут исключены из розыгрыша.</p>
                </div>
                <button className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Добавить в ЧС
                </button>
            </div>

            {/* Таблица */}
            {entries.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-400 p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    <p className="text-sm font-medium">Черный список пуст.</p>
                </div>
            ) : (
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left">Пользователь</th>
                                <th className="px-6 py-3 text-left">Срок блокировки</th>
                                <th className="px-6 py-3 text-left">Дата добавления</th>
                                <th className="w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600">
                            {entries.map((item) => {
                                const expired = isDateExpired(item.until_date);
                                return (
                                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${expired ? 'bg-gray-50 opacity-60' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">{item.user_name || `ID ${item.user_vk_id}`}</span>
                                                {item.user_screen_name && (
                                                    <a 
                                                        href={`https://vk.com/${item.user_screen_name}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-indigo-500 hover:underline"
                                                    >
                                                        vk.com/{item.user_screen_name}
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-medium ${expired ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                                    {formatDate(item.until_date)}
                                                </span>
                                                {expired && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 rounded">Истек</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {new Date(item.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleDeleteClick(item.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                                                title="Удалить из черного списка"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {deletingId && (
                <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg text-sm">
                    ✓ Пользователь удален из черного списка
                </div>
            )}
        </div>
    );
};

// =====================================================================
// MOCK-КОМПОНЕНТЫ: Всплывающее окно добавления
// =====================================================================

const MockAddBlacklistModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [urls, setUrls] = useState('');
    const [isForever, setIsForever] = useState(true);
    const [untilDate, setUntilDate] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in-up">
            <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
                {/* Шапка */}
                <header className="p-4 border-b flex justify-between items-center bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">Добавить в ЧС</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </header>

                {/* Контент */}
                <main className="p-4 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Поле ввода URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ссылки на профили VK
                        </label>
                        <textarea
                            value={urls}
                            onChange={(e) => setUrls(e.target.value)}
                            rows={5}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md custom-scrollbar resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Введите ссылки на профили (по одной на строку)&#10;Например:&#10;https://vk.com/id12345&#10;https://vk.com/durov"
                        />
                        <p className="text-xs text-gray-500 mt-1">Можно добавить несколько пользователей сразу.</p>
                    </div>

                    {/* Срок блокировки */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки</label>
                        <div className="space-y-3">
                            {/* Бессрочно */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="duration" 
                                    checked={isForever}
                                    onChange={() => setIsForever(true)}
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">Бессрочно (Навсегда)</p>
                                    <p className="text-xs text-gray-500">Пользователь останется в черном списке постоянно</p>
                                </div>
                            </label>

                            {/* До определенной даты */}
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input 
                                    type="radio" 
                                    name="duration" 
                                    checked={!isForever}
                                    onChange={() => setIsForever(false)}
                                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800 group-hover:text-gray-900">До определенной даты</p>
                                    <p className="text-xs text-gray-500">Пользователь будет автоматически разблокирован</p>
                                </div>
                            </label>

                            {/* Выбор даты */}
                            {!isForever && (
                                <div className="ml-6 animate-fade-in-up">
                                    <input 
                                        type="date"
                                        value={untilDate}
                                        onChange={(e) => setUntilDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Пользователь будет автоматически разблокирован после этой даты.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Футер */}
                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
                    <button onClick={onClose} disabled={isSaving} className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors">
                        Отмена
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || !urls.trim()}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 flex items-center min-w-[100px] justify-center transition-colors"
                    >
                        {isSaving ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : 'Сохранить'}
                    </button>
                </footer>
            </div>
        </div>
    );
};

// =====================================================================
// ОСНОВНОЙ КОМПОНЕНТ СТРАНИЦЫ
// =====================================================================

export const ProductsReviewsContestBlacklistPage: React.FC<ContentProps> = ({ title }) => {
    // Состояния для Sandbox 1: Таблица с данными
    const [sandbox1Entries, setSandbox1Entries] = useState<MockBlacklistEntry[]>([
        {
            id: '1',
            user_name: 'Иван Петров',
            user_vk_id: 123456,
            user_screen_name: 'ivan_petrov',
            until_date: '2026-03-15',
            created_at: '2026-02-01T10:30:00'
        },
        {
            id: '2',
            user_name: 'Мария Сидорова',
            user_vk_id: 789012,
            user_screen_name: 'maria_sidorova',
            until_date: '2026-01-10', // Истекший срок
            created_at: '2025-12-20T14:20:00'
        },
        {
            id: '3',
            user_name: 'Алексей Смирнов',
            user_vk_id: 345678,
            user_screen_name: 'alex_smirnov',
            until_date: null, // Навсегда
            created_at: '2026-01-15T09:15:00'
        }
    ]);

    // Состояния для Sandbox 2: Всплывающее окно
    const [showModal, setShowModal] = useState(false);

    // Состояния для Sandbox 3: Пустая таблица
    const [sandbox3Entries, setSandbox3Entries] = useState<MockBlacklistEntry[]>([]);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================ */}
            {/* СЕКЦИЯ 1: ВВЕДЕНИЕ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что такое черный список?</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Черный список</strong> — это инструмент для исключения определенных пользователей из участия в конкурсах отзывов. Если пользователь добавлен в черный список проекта, система автоматически пропускает его отзывы при выборе победителей, даже если они соответствуют всем критериям розыгрыша.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Это помогает обеспечить честность конкурсов и предотвратить ситуации, когда одни и те же пользователи побеждают слишком часто. Вы можете заблокировать участника навсегда или на определенный период времени.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 2: БЫЛО / СТАЛО */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это работало раньше?</h2>
                
                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">❌ Было: Ручное отслеживание победителей</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Раньше, чтобы избежать повторных побед одних и тех же участников, нужно было:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Вести отдельную таблицу Excel с победителями</li>
                    <li>Вручную проверять каждое имя в списке перед объявлением результатов</li>
                    <li>Запоминать, кто уже выигрывал в предыдущих розыгрышах</li>
                    <li>Тратить время на поиск дублей среди участников</li>
                    <li>Случайно объявлять победителем того, кто уже недавно получил приз</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Это особенно усложнялось, когда нужно было временно исключить человека на месяц или два — приходилось ставить напоминания и следить за датами вручную.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">✅ Стало: Автоматизированный черный список</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Теперь вся логика исключения участников работает автоматически:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Единая база:</strong> Все заблокированные пользователи хранятся в одном месте</li>
                    <li><strong>Автоматическая проверка:</strong> Система сама исключает их отзывы при выборе победителей</li>
                    <li><strong>Временные блокировки:</strong> Можно указать дату разблокировки — система автоматически снимет ограничение</li>
                    <li><strong>Визуальные метки:</strong> Истекшие блокировки отображаются серым цветом с меткой "Истек"</li>
                    <li><strong>Быстрое управление:</strong> Добавить или удалить пользователя можно в один клик</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 3: СТРУКТУРА ТАБЛИЦЫ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как устроена таблица черного списка</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Таблица черного списка содержит четыре столбца:
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Пользователь</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Имя:</strong> Отображается имя пользователя (если оно было загружено из VK)</li>
                    <li><strong>Ссылка на профиль:</strong> Синяя кликабельная ссылка вида <code>vk.com/username</code> — ведет на страницу пользователя в VK</li>
                    <li>Если имя не загружено, показывается <code>ID 123456</code></li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Срок блокировки</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Навсегда:</strong> Если блокировка бессрочная, отображается серый текст "Навсегда"</li>
                    <li><strong>До даты:</strong> Если указан срок, показывается дата в формате <code>ДД.ММ.ГГГГ</code></li>
                    <li><strong>Истекший срок:</strong> Если дата уже прошла, текст перечеркивается, добавляется серая метка "Истек", а вся строка становится полупрозрачной</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Дата добавления</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Показывает, когда пользователь был добавлен в черный список (формат <code>ДД.ММ.ГГГГ</code>).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Действия</h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Иконка корзины:</strong> Кнопка удаления пользователя из черного списка</li>
                    <li>При наведении иконка становится красной с фоном</li>
                    <li>После удаления появляется уведомление об успехе</li>
                </ul>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 1: Таблица с данными */}
            {/* ============================================ */}
            <Sandbox
                title="📊 Интерактивная таблица черного списка"
                description="Пример таблицы с тремя записями: активная блокировка до даты, истекший срок, и бессрочная блокировка."
                instructions={[
                    '<strong>Наведите</strong> курсор на строку — она подсветится',
                    '<strong>Обратите внимание</strong> на вторую запись (Мария Сидорова) — срок блокировки истек, строка серая с меткой "Истек"',
                    '<strong>Кликните</strong> на синюю ссылку профиля — откроется VK (имитация)',
                    '<strong>Кликните</strong> на иконку корзины — появится уведомление об удалении'
                ]}
            >
                <MockBlacklistTable entries={sandbox1Entries} />
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 4: РЕЖИМЫ БЛОКИРОВКИ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Режимы блокировки</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    При добавлении пользователя в черный список вы выбираете один из двух режимов:
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">🔒 Бессрочно (Навсегда)</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Пользователь останется в черном списке постоянно до тех пор, пока вы не удалите его вручную. Это подходит для случаев, когда нужно полностью исключить участника из всех будущих розыгрышей.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">📅 До определенной даты</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Вы указываете конкретную дату, после которой система автоматически разблокирует пользователя. Это удобно, если хотите временно исключить участника (например, на месяц после недавней победы).
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Выберите дату в календаре</li>
                    <li>После наступления этой даты запись автоматически помечается как "Истек"</li>
                    <li>Система не будет учитывать истекшие блокировки при выборе победителей</li>
                    <li>Вы можете вручную удалить истекшую запись или оставить её для истории</li>
                </ul>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 2: Всплывающее окно добавления */}
            {/* ============================================ */}
            <Sandbox
                title="➕ Окно добавления в черный список"
                description="Демонстрация модального окна с полями ввода и выбором режима блокировки."
                instructions={[
                    '<strong>Кликните</strong> на кнопку "Открыть окно добавления"',
                    '<strong>Введите</strong> несколько ссылок на профили VK (по одной на строку)',
                    '<strong>Выберите</strong> режим блокировки: "Бессрочно" или "До определенной даты"',
                    '<strong>Если выбрали</strong> "До определенной даты" — появится поле выбора даты',
                    '<strong>Нажмите</strong> "Сохранить" — появится индикатор загрузки, затем окно закроется'
                ]}
            >
                <div className="space-y-4">
                    <button 
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Открыть окно добавления
                    </button>
                    {showModal && <MockAddBlacklistModal onClose={() => setShowModal(false)} />}
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 5: ПУСТОЕ СОСТОЯНИЕ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Пустой черный список</h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если в черном списке пока нет ни одной записи, система отображает специальное состояние с иконкой перечеркнутого круга и текстом <strong>"Черный список пуст."</strong>
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Это показывает, что функция работает, но пока не содержит данных. Чтобы добавить первую запись, нажмите кнопку "Добавить в ЧС" в правом верхнем углу.
                </p>
            </section>

            {/* ============================================ */}
            {/* SANDBOX 3: Пустая таблица */}
            {/* ============================================ */}
            <Sandbox
                title="🚫 Пустой черный список"
                description="Как выглядит таблица, когда в ней нет записей."
                instructions={[
                    '<strong>Это состояние</strong> показывает, что черный список пока не содержит заблокированных пользователей'
                ]}
            >
                <MockBlacklistTable entries={sandbox3Entries} />
            </Sandbox>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 6: СОВЕТЫ ПО ИСПОЛЬЗОВАНИЮ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">💡 Советы по использованию</h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Когда использовать временную блокировку?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Выбирайте режим "До определенной даты", если хотите:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Дать пользователю "перерыв" после недавней победы (например, на 1-2 месяца)</li>
                    <li>Временно исключить участника, который слишком часто выигрывает</li>
                    <li>Создать "период ожидания" между победами одного и того же человека</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Когда использовать бессрочную блокировку?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Выбирайте режим "Бессрочно", если нужно:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Полностью исключить пользователя из всех будущих конкурсов</li>
                    <li>Заблокировать участника, нарушившего правила</li>
                    <li>Исключить сотрудников агентства или связанных лиц</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Удаление истекших записей</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Истекшие блокировки не влияют на розыгрыши, но остаются в таблице для истории. Вы можете:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Оставить их:</strong> Чтобы видеть, кто был заблокирован ранее</li>
                    <li><strong>Удалить вручную:</strong> Чтобы очистить таблицу от неактуальных записей</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Массовое добавление</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Вы можете добавить несколько пользователей одновременно — просто укажите их ссылки построчно в поле ввода. Все они получат одинаковый срок блокировки.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* СЕКЦИЯ 7: FAQ */}
            {/* ============================================ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">❓ Частые вопросы (FAQ)</h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что произойдет, если я удалю пользователя из черного списка?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Он снова сможет участвовать в розыгрышах. Система будет учитывать его отзывы при выборе победителей.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как система определяет, что срок блокировки истек?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система автоматически сравнивает указанную дату с текущей датой. Если дата блокировки прошла, запись помечается как "Истек" и не учитывается при выборе победителей.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Можно ли изменить срок блокировки существующей записи?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Нет, изменение срока блокировки напрямую не предусмотрено. Если нужно изменить дату — удалите запись и добавьте пользователя заново с новым сроком.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Можно ли заблокировать пользователя по ID, если не знаю его ссылку?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Да, вы можете использовать ссылку формата <code>https://vk.com/id123456</code>, где <code>123456</code> — это числовой ID пользователя.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Черный список действует на все конкурсы проекта?</h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Да, черный список привязан к проекту. Пользователь, добавленный в черный список, будет исключен из всех розыгрышей этого проекта.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================ */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================ */}
            <NavigationButtons currentPath="2-4-2-7-blacklist" />
        </article>
    );
};
