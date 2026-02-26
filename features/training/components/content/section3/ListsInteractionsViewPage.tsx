import React from 'react';
import { Sandbox, ContentProps, NavigationButtons } from '../shared';
import {
    MockInteractionsTable,
} from './ListsMocks';

// =====================================================================
// Страница "3.2.5. Просмотр взаимодействий"
// =====================================================================

export const ListsInteractionsViewPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================== */}
            {/* 1. ЧТО ЭТО ЗА ТАБЛИЦА? */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это за таблица?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица взаимодействий показывает <strong>людей, которые активно реагировали на посты сообщества</strong> — ставили лайки, оставляли комментарии или делали репосты. Это история активности пользователей за выбранный период времени.
            </p>

            <div className="not-prose grid grid-cols-2 gap-6 my-8">
                {/* Раньше */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                        <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h3 className="text-lg font-bold text-red-900">Раньше</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-red-800">
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Открывали каждый пост в браузере и смотрели кто лайкнул</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>ВКонтакте показывает только первые 100 пользователей</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Не было информации о профилях (возраст, город, активность)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-red-600">•</span>
                            <span>Невозможно найти самых активных пользователей за период</span>
                        </li>
                    </ul>
                </div>

                {/* Сейчас */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                    <div className="flex items-start gap-3 mb-3">
                        <svg className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h3 className="text-lg font-bold text-green-900">Сейчас</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Все взаимодействия за период собираются автоматически</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Видно полный профиль каждого пользователя (пол, город, возраст, статус)</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Счётчик показывает общее количество активности каждого человека</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="text-green-600">•</span>
                            <span>Можно раскрыть строку и увидеть с какими постами взаимодействовал пользователь</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-blue-900 mb-2">Чем отличается от других таблиц?</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        <span><strong>Участники</strong> — кто подписан на сообщество (статичная база подписчиков)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        <span><strong>Посты</strong> — что опубликовано в сообществе (контент)</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-blue-600 font-bold">→</span>
                        <span><strong>Взаимодействия</strong> — кто активно реагирует на контент (динамическая активность)</span>
                    </li>
                </ul>
            </div>

            {/* ============================================== */}
            {/* 2. АНАТОМИЯ ТАБЛИЦЫ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Анатомия таблицы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица взаимодействий состоит из 4 функциональных зон:
            </p>

            <Sandbox
                title="Структура таблицы взаимодействий"
                description="Наведите курсор на цветные рамки, чтобы понять назначение каждой зоны"
                instructions={[
                    '<strong>Зона 1 (фиолетовая)</strong> — панель поиска, фильтров и кнопка обновления профилей',
                    '<strong>Зона 2 (синяя)</strong> — заголовки колонок, закреплены при прокрутке (sticky)',
                    '<strong>Зона 3 (зелёная)</strong> — строки с данными пользователей, прокручиваемая область',
                    '<strong>Зона 4 (оранжевая)</strong> — индикатор автоподгрузки следующей порции данных',
                ]}
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Интерактивная демонстрация структуры таблицы будет добавлена позже</p>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Описание колонок таблицы</h3>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-12">№</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Название</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Ширина</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Что отображается</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">1</td>
                            <td className="px-4 py-3 text-gray-700">(Раскрытие)</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">w-10</code></td>
                            <td className="px-4 py-3 text-gray-600">Стрелка для раскрытия/сворачивания строки</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">2</td>
                            <td className="px-4 py-3 text-gray-700">(Аватар)</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">w-16</code></td>
                            <td className="px-4 py-3 text-gray-600">Круглое фото 40×40px или SVG-заглушка</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">3</td>
                            <td className="px-4 py-3 text-gray-700">Пользователь</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">flex-grow</code></td>
                            <td className="px-4 py-3 text-gray-600">ФИО (синяя ссылка на VK) + ID/domain + иконка телефона</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">4</td>
                            <td className="px-4 py-3 text-gray-700">Пол</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">"Жен." / "Муж." / "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">5</td>
                            <td className="px-4 py-3 text-gray-700">ДР</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Дата рождения "15.3.1995" или "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">6</td>
                            <td className="px-4 py-3 text-gray-700">Город</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Название города или "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">7</td>
                            <td className="px-4 py-3 text-gray-700">Онлайн</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Дата/время последнего онлайна + цветной бейдж платформы</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">8</td>
                            <td className="px-4 py-3 text-gray-700">Статус</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Цветной бейдж: Активен / Закрытый / Удален / Заблокирован</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">9</td>
                            <td className="px-4 py-3 text-gray-700">Всего</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Белый бейдж со счётчиком взаимодействий</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-700 font-medium">10</td>
                            <td className="px-4 py-3 text-gray-700">Посл. актив</td>
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">auto</code></td>
                            <td className="px-4 py-3 text-gray-600">Дата и время последнего взаимодействия</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============================================== */}
            {/* 3. СТРУКТУРА ДАННЫХ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура данных взаимодействия</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждая строка таблицы представляет собой объект типа <code>SystemListInteraction</code>, который содержит информацию о пользователе и его активности:
            </p>

            <div className="not-prose my-6 bg-gray-900 rounded-lg p-6 overflow-x-auto">
                <pre className="text-sm text-gray-100 leading-relaxed"><code>{`export interface SystemListInteraction {
    id: string;                      // Внутренний ID в базе данных
    vk_user_id: number;              // ID пользователя ВКонтакте
    first_name: string;              // Имя пользователя
    last_name: string;               // Фамилия пользователя
    domain?: string;                 // Короткая ссылка (username)
    photo_url?: string;              // URL аватара пользователя
    interaction_count: number;       // Общее количество взаимодействий
    last_interaction_date: string;   // Дата последнего взаимодействия (ISO)
    post_ids?: number[];             // Массив ID постов
    sex?: number;                    // Пол: 1 - женский, 2 - мужской
    bdate?: string;                  // Дата рождения "15.3.1995"
    city?: string;                   // Город пользователя
    last_seen?: number;              // Последний онлайн (Unix timestamp)
    platform?: number;               // Платформа последнего онлайна (1-7)
    deactivated?: string;            // "banned" | "deleted"
    is_closed?: boolean;             // Закрытый профиль
    has_mobile?: number;             // Известен номер телефона (1/0)
}`}</code></pre>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Пояснение ключевых полей</h3>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Поле</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Что означает</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Пример</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">interaction_count</code></td>
                            <td className="px-4 py-3 text-gray-600">Сколько раз пользователь лайкал/комментировал/репостил посты сообщества за период</td>
                            <td className="px-4 py-3"><span className="font-mono text-gray-700">23</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">post_ids</code></td>
                            <td className="px-4 py-3 text-gray-600">Список ID постов, с которыми взаимодействовал пользователь (показывается при раскрытии строки)</td>
                            <td className="px-4 py-3"><span className="font-mono text-gray-700">[12345, 12346]</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">platform</code></td>
                            <td className="px-4 py-3 text-gray-600">С какого устройства пользователь последний раз заходил в VK (1-m.vk, 2-iPhone, 4-Android, 7-Web)</td>
                            <td className="px-4 py-3"><span className="font-mono text-gray-700">2</span> (iPhone)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">deactivated</code></td>
                            <td className="px-4 py-3 text-gray-600">Если профиль удалён или заблокирован — значение "deleted" или "banned"</td>
                            <td className="px-4 py-3"><span className="font-mono text-gray-700">"banned"</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">has_mobile</code></td>
                            <td className="px-4 py-3 text-gray-600">ВКонтакте знает номер телефона пользователя (показатель надёжности аккаунта)</td>
                            <td className="px-4 py-3"><span className="font-mono text-gray-700">1</span> (есть)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============================================== */}
            {/* 4. РАСКРЫТИЕ СТРОК */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Раскрытие строк и история активности</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждую строку таблицы можно <strong>раскрыть кликом</strong>, чтобы увидеть детальную историю активности пользователя — список постов, с которыми он взаимодействовал.
            </p>

            <Sandbox
                title="Интерактивная демонстрация раскрытия строки"
                description="Нажмите на строку пользователя, чтобы раскрыть её и увидеть список постов"
                instructions={[
                    'Стрелка слева <strong>поворачивается на 90°</strong> и меняет цвет с серого на синий',
                    'Строка получает <strong>светло-синий фон</strong> (bg-indigo-50)',
                    'Появляется вложенная строка с заголовком <strong>"История активности (N)"</strong>',
                    'Показываются бейджи постов в формате <strong>"Post #12345"</strong> как ссылки на VK',
                ]}
            >
                <MockInteractionsTable />
            </Sandbox>

            <div className="not-prose bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-amber-900 mb-2">Практический пример</h4>
                <p className="text-sm text-amber-800 mb-2">
                    Если в колонке "Всего" вы видите счётчик <strong>23</strong> — это значит, что пользователь 23 раза лайкал/комментировал/репостил посты сообщества. При раскрытии строки увидите конкретные посты, где была активность.
                </p>
                <p className="text-sm text-amber-800">
                    Такие данные помогают выявить <strong>"суперфанов"</strong> сообщества для дальнейшего поощрения или привлечения в активности.
                </p>
            </div>

            {/* ============================================== */}
            {/* 5. СЧЁТЧИК ВЗАИМОДЕЙСТВИЙ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Счётчик взаимодействий (колонка "Всего")</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Счётчик в колонке "Всего" показывает общее количество активностей пользователя за выбранный период. Что именно считается:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Для списка <strong>"Лайкали"</strong> — количество постов, которые лайкнул пользователь</li>
                <li>Для списка <strong>"Комментировали"</strong> — количество постов, где оставил комментарий</li>
                <li>Для списка <strong>"Репостили"</strong> — количество репостов</li>
            </ul>

            <Sandbox
                title="Примеры счётчиков взаимодействий"
                description="Разные уровни активности пользователей"
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Интерактивная демонстрация счётчика взаимодействий будет добавлена позже</p>
                </div>
            </Sandbox>

            {/* ============================================== */}
            {/* 6. БЕЙДЖИ ПЛАТФОРМ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Бейджи платформ</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В колонке "Онлайн" кроме даты последнего визита отображается <strong>цветной бейдж платформы</strong> — с какого устройства пользователь заходил в VK. ВКонтакте API возвращает числовой код платформы (1-7):
            </p>

            <Sandbox
                title="Все варианты бейджей платформ"
                description="Цветовая кодировка помогает быстро определить тип устройства"
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Интерактивная демонстрация бейджей платформ будет добавлена позже</p>
                </div>
            </Sandbox>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-blue-900 mb-2">Зачем это нужно?</h4>
                <p className="text-sm text-blue-800">
                    Понимание платформы помогает сегментировать аудиторию. Например, пользователи с мобильных устройств (m.vk, iPhone, Android) больше склонны к быстрым реакциям, а десктопные пользователи (Web) могут тратить больше времени на чтение и комментирование.
                </p>
            </div>

            {/* ============================================== */}
            {/* 7. СТАТУСЫ АККАУНТОВ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Статусы аккаунтов</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Колонка "Статус" показывает текущее состояние профиля пользователя. Всего 4 возможных статуса:
            </p>

            <Sandbox
                title="Все статусы аккаунтов"
                description="Цветовая индикация состояния профиля"
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Интерактивная демонстрация бейджей статусов будет добавлена позже</p>
                </div>
            </Sandbox>

            <div className="not-prose bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-red-900 mb-2">⚠️ Важно знать</h4>
                <p className="text-sm text-red-800">
                    Удалённым и заблокированным пользователям <strong>нельзя отправлять сообщения</strong>. Если вы собираетесь делать рассылку активным пользователям, обязательно отфильтруйте такие аккаунты.
                </p>
            </div>

            {/* ============================================== */}
            {/* 8. ДОПОЛНИТЕЛЬНЫЕ ПОЛЯ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Дополнительные поля профиля</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кроме основной информации таблица содержит дополнительные поля, которые помогают лучше понять аудиторию:
            </p>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Поле</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Описание</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-40">Возможные значения</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Пол</td>
                            <td className="px-4 py-3 text-gray-600">Пол пользователя согласно настройкам профиля</td>
                            <td className="px-4 py-3 text-gray-600">"Жен." / "Муж." / "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">ДР</td>
                            <td className="px-4 py-3 text-gray-600">Дата рождения для расчёта возраста и таргетирования</td>
                            <td className="px-4 py-3 text-gray-600">"15.3.1995" / "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Город</td>
                            <td className="px-4 py-3 text-gray-600">Город проживания пользователя (текстовое название)</td>
                            <td className="px-4 py-3 text-gray-600">"Москва" / "—"</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Онлайн</td>
                            <td className="px-4 py-3 text-gray-600">Дата и время последнего захода в VK + бейдж платформы</td>
                            <td className="px-4 py-3 text-gray-600">"25.02, 14:30" + бейдж</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Иконка телефона</td>
                            <td className="px-4 py-3 text-gray-600">Маленькая серая иконка справа от ID — ВК знает номер телефона (показатель надёжности аккаунта)</td>
                            <td className="px-4 py-3 text-gray-600">Показывается / Скрыта</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============================================== */}
            {/* 9. ПОИСК И ФИЛЬТРЫ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Поиск и фильтры</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Над таблицей расположена панель инструментов для поиска и фильтрации пользователей:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Поле поиска</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Поле с placeholder <strong>"ФИО, ID, ссылка..."</strong> позволяет искать пользователей по:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><code>first_name</code> — имя пользователя</li>
                <li><code>last_name</code> — фамилия пользователя</li>
                <li><code>vk_user_id</code> — числовой ID VK</li>
                <li><code>domain</code> — короткая ссылка (username)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Доступные фильтры</h3>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Фильтр</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Опции</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Статус</td>
                            <td className="px-4 py-3 text-gray-600">Все, Активные, Забанены, Удалены</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Пол</td>
                            <td className="px-4 py-3 text-gray-600">Любой, Женский, Мужской, Не указан</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Онлайн</td>
                            <td className="px-4 py-3 text-gray-600">Любой, Сегодня, 3 дня, Неделя, Месяц</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Платформа</td>
                            <td className="px-4 py-3 text-gray-600">Любая, m.vk, iPhone, Android, Web, Не определена</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Возраст</td>
                            <td className="px-4 py-3 text-gray-600">Любой, до 16, 16-20, 20-25, 25-30, 30-35, 35-40, 40-45, 45+, Не указан</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium text-gray-700">Месяц рождения</td>
                            <td className="px-4 py-3 text-gray-600">Любой, Январь...Декабрь, Не указан</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Кнопка "Обновить профили"</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка с иконкой циркулярных стрелок запускает обновление профилей пользователей из VK API. Это нужно, чтобы получить актуальную информацию о статусах аккаунтов, городах, онлайн-статусе.
            </p>

            {/* ============================================== */}
            {/* 10. СОСТОЯНИЯ ТАБЛИЦЫ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Состояния таблицы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица может находиться в одном из трёх состояний:
            </p>

            <Sandbox
                title="Переключение состояний таблицы"
                description="Используйте кнопки сверху, чтобы увидеть каждое состояние"
                instructions={[
                    '<strong>Loading</strong> — первичная загрузка данных, показывается спиннер',
                    '<strong>Empty</strong> — список пуст, нужно запустить сбор данных',
                    '<strong>Data</strong> — обычное отображение таблицы с данными',
                ]}
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Интерактивная демонстрация состояний таблицы будет добавлена позже</p>
                </div>
            </Sandbox>

            <div className="not-prose my-6">
                <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-32">Состояние</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Когда показывается</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Что видит пользователь</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">Loading</code></td>
                            <td className="px-4 py-3 text-gray-600">При первой загрузке страницы, пока данные грузятся с сервера</td>
                            <td className="px-4 py-3 text-gray-600">Спиннер (крутящийся круг) + текст "Загрузка данных..."</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">Empty</code></td>
                            <td className="px-4 py-3 text-gray-600">Когда в базе нет данных по выбранному списку (не запускался сбор)</td>
                            <td className="px-4 py-3 text-gray-600">Серый блок с текстом "Список пуст. Запустите сбор данных за период."</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded">Data</code></td>
                            <td className="px-4 py-3 text-gray-600">Когда есть хотя бы одна запись в списке</td>
                            <td className="px-4 py-3 text-gray-600">Полноценная таблица со строками, поиск и фильтры активны</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* ============================================== */}
            {/* 11. INFINITE SCROLL */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Бесконечная прокрутка (Infinite Scroll)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица использует технологию <strong>автоподгрузки данных при прокрутке</strong>. Когда пользователь доскроллил до низа таблицы — автоматически подгружается следующая порция записей.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как это работает?</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>В конце таблицы находится невидимый элемент-триггер</li>
                <li>Используется <code>IntersectionObserver</code> API — браузер отслеживает когда элемент попадает в видимую область</li>
                <li>Когда пользователь доскроллил до триггера — срабатывает запрос на сервер</li>
                <li>Во время загрузки показывается спиннер в нижней части таблицы</li>
                <li>Новые записи добавляются в конец списка</li>
            </ol>

            <div className="not-prose bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg my-6">
                <h4 className="font-bold text-green-900 mb-2">Преимущества подхода</h4>
                <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Быстрая первичная загрузка</strong> — не нужно ждать пока загрузятся все 10 000 записей</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Экономия памяти</strong> — браузер не хранит весь массив данных сразу</span>
                    </li>
                    <li className="flex gap-2">
                        <span className="text-green-600">✓</span>
                        <span><strong>Плавная работа</strong> — прокрутка не тормозит даже на слабых устройствах</span>
                    </li>
                </ul>
            </div>

            {/* ============================================== */}
            {/* 12. ОТЛИЧИЯ ОТ ДРУГИХ РЕЖИМОВ */}
            {/* ============================================== */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Отличия от других режимов просмотра</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В разделе "Системные списки" доступны три режима просмотра данных. Вот чем они отличаются:
            </p>

            <Sandbox
                title="Сравнительная таблица: Участники vs Посты vs Взаимодействия"
                description="Каждый режим решает свою задачу"
            >
                <div className="text-center text-gray-500 py-8">
                    <p>Сравнительная таблица взаимодействий будет добавлена позже</p>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Когда использовать каждый режим?</h3>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                <div className="p-4 border-2 border-purple-200 rounded-lg bg-purple-50">
                    <h4 className="font-bold text-purple-900 mb-2">Участники</h4>
                    <ul className="space-y-1 text-sm text-purple-800">
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Массовые рассылки по базе</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Анализ демографии подписчиков</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Экспорт контактов</span>
                        </li>
                    </ul>
                </div>
                <div className="p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <h4 className="font-bold text-blue-900 mb-2">Посты</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Контент-аналитика</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Поиск лучших публикаций</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Статистика по каждому посту</span>
                        </li>
                    </ul>
                </div>
                <div className="p-4 border-2 border-green-200 rounded-lg bg-green-50">
                    <h4 className="font-bold text-green-900 mb-2">Взаимодействия</h4>
                    <ul className="space-y-1 text-sm text-green-800">
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Выявление "суперфанов"</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Поощрение активных пользователей</span>
                        </li>
                        <li className="flex gap-2">
                            <span>•</span>
                            <span>Поиск лояльной аудитории</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* ============================================== */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================== */}
            <NavigationButtons currentPath="3-2-5-interactions" />
        </article>
    );
};
