import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * Обучающая страница: "2.4.1.3. Статистика"
 * 
 * Подробное объяснение дашборда эффективности и таблицы историй:
 * фильтры периодов, метрики, детальная статистика по каждой истории.
 */

// =====================================================================
// Mock-компоненты для демонстрации
// =====================================================================

// Мини-график (упрощённая версия Sparkline)
const MockSparkline: React.FC<{ color: string }> = ({ color }) => {
    return (
        <div className="w-full h-full relative">
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <path d="M0,80 L20,60 L40,70 L60,40 L80,50 L100,20" fill="none" stroke="currentColor" strokeWidth="3" className={color} />
            </svg>
        </div>
    );
};

// Карточка метрики для дашборда
const MockMetricCard: React.FC<{ 
    title: string; 
    value: string; 
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    valueColor: string;
    showGraph?: boolean;
    graphColor?: string;
}> = ({ title, value, icon, bgColor, iconColor, valueColor, showGraph, graphColor }) => {
    return (
        <div className={`${bgColor} rounded-3xl p-6 border border-gray-200 shadow-sm hover:border-indigo-300 transition-colors`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-semibold">{title}</p>
                    <h3 className={`text-3xl font-bold ${valueColor} mt-2`}>{value}</h3>
                </div>
                <div className={`p-2 ${iconColor} rounded-xl`}>
                    {icon}
                </div>
            </div>
            {showGraph && graphColor && (
                <div className="mt-6 h-12 w-full -mb-2">
                    <MockSparkline color={graphColor} />
                </div>
            )}
        </div>
    );
};

// Строка таблицы с историей
const MockStoryRow: React.FC<{
    hasPreview: boolean;
    date: string;
    type: string;
    isActive: boolean;
    isAutomated: boolean;
    hasStats: boolean;
}> = ({ hasPreview, date, type, isActive, isAutomated, hasStats }) => {
    return (
        <tr className="hover:bg-gray-50 transition-colors">
            <td className="px-6 py-4 align-top">
                {hasPreview ? (
                    <div className="w-12 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg border border-gray-200 shadow-sm hover:ring-2 ring-indigo-500 transition-all cursor-pointer"></div>
                ) : (
                    <div className="w-12 h-20 bg-gray-100 rounded-lg border flex items-center justify-center text-[9px] text-gray-400 text-center p-1">
                        Нет фото
                    </div>
                )}
            </td>
            
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col gap-2">
                    <div>
                        <div className="text-sm font-medium text-gray-900">{date}</div>
                        <div className="text-xs text-gray-500 capitalize">{type}</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                                Активна
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wide">
                                Архив
                            </span>
                        )}
                        {isAutomated ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                Наш сервис
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                Вручную
                            </span>
                        )}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 align-top">
                {hasStats ? (
                    <div className="grid grid-cols-4 gap-2 w-full">
                        <div className="flex flex-col items-center bg-indigo-50 p-1.5 rounded border border-indigo-100 min-w-[50px]">
                            <span className="text-[10px] text-indigo-600 uppercase font-bold">Просм.</span>
                            <span className="text-sm font-bold text-indigo-800">1,234</span>
                        </div>
                        <div className="flex flex-col items-center bg-pink-50 p-1.5 rounded border border-pink-100 min-w-[50px]">
                            <span className="text-[10px] text-pink-600 uppercase font-bold">Лайки</span>
                            <span className="text-sm font-bold text-pink-800">45</span>
                        </div>
                        <div className="flex flex-col items-center bg-green-50 p-1.5 rounded border border-green-100 min-w-[50px]">
                            <span className="text-[10px] text-green-600 uppercase font-bold">Клики</span>
                            <span className="text-sm font-bold text-green-800">12</span>
                        </div>
                        <div className="flex flex-col items-center bg-purple-50 p-1.5 rounded border border-purple-100 min-w-[50px]">
                            <span className="text-[10px] text-purple-600 uppercase font-bold">Репосты</span>
                            <span className="text-sm font-bold text-purple-800">8</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">856</span>
                            <span className="text-xs text-gray-500 uppercase font-medium">Просмотров</span>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-xs text-gray-500 max-w-[200px]">
                            Детальная статистика отсутствует. Нажмите "Обновить" для загрузки.
                        </div>
                    </div>
                )}
            </td>

            <td className="px-6 py-4 align-top text-right space-y-2">
                <button className="w-full px-3 py-1.5 rounded text-xs font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors">
                    Обновить
                </button>
            </td>
        </tr>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsStoriesStatsPage: React.FC<ContentProps> = ({ title }) => {
    const [filterType, setFilterType] = useState<'all' | 'manual' | 'auto'>('all');
    const [periodType, setPeriodType] = useState<'all' | 'week' | 'month'>('all');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница статистики показывает результаты работы автоматизации историй. Здесь вы видите два главных блока: 
                дашборд с общими метриками эффективности и детальная таблица всех опубликованных историй.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Обзор эффективности (Дашборд)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В верхней части страницы находится дашборд — набор карточек с ключевыми метриками. 
                Здесь собраны цифры, которые показывают насколько хорошо работают ваши истории.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Фильтры</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Перед метриками расположены два ряда фильтров, которые позволяют выбрать период и тип историй для анализа.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Фильтр периода</strong> (6 кнопок):
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>За всё время</strong> — показывает данные с момента первой публикации</li>
                <li><strong>За неделю</strong> — последние 7 дней</li>
                <li><strong>За месяц</strong> — последние 30 дней</li>
                <li><strong>За квартал</strong> — последние 90 дней</li>
                <li><strong>За год</strong> — последние 365 дней</li>
                <li><strong>Свой период</strong> — появляются два календаря для выбора точных дат начала и конца</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Фильтр типа</strong> (3 кнопки):
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Всё</strong> — все истории без разделения</li>
                <li><strong>Ручные</strong> — только те истории, которые были опубликованы вручную через кнопку "Опубликовать"</li>
                <li><strong>Авто</strong> — только истории, опубликованные автоматически нашим сервисом</li>
            </ul>

            <Sandbox
                title="Попробуйте фильтры"
                description="Переключайте фильтры и наблюдайте как меняется визуальное состояние кнопок."
                instructions={[
                    'Выберите <strong>период</strong> из шести вариантов',
                    'Переключите <strong>тип</strong> между "Всё", "Ручные" и "Авто"',
                    'Активная кнопка периода подсвечивается индиго цветом',
                    'Активная кнопка типа становится синей с белым текстом'
                ]}
            >
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <div className="flex flex-col gap-4">
                        {/* Фильтр периода */}
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-2">Период:</p>
                            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                                {['all', 'week', 'month'].map((period) => (
                                    <button
                                        key={period}
                                        onClick={() => setPeriodType(period as any)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                            periodType === period
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {period === 'all' ? 'За всё время' : period === 'week' ? 'За неделю' : 'За месяц'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Фильтр типа */}
                        <div>
                            <p className="text-sm text-gray-500 font-medium mb-2">Тип:</p>
                            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                                {['all', 'manual', 'auto'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type as any)}
                                        className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                            filterType === type
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                    >
                                        {type === 'all' ? 'Всё' : type === 'manual' ? 'Ручные' : 'Авто'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Метрики (Бенто-сетка)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Ниже фильтров расположены карточки с ключевыми показателями. Они организованы в бенто-сетку — 
                адаптивную раскладку, где карточки разных размеров создают визуальную иерархию.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Сумма показов (большая карточка)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самая заметная карточка в верхнем ряду. Занимает два столбца и показывает общее количество просмотров всех историй.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Иконка:</strong> Глаз (символ просмотров)</li>
                <li><strong>Значение:</strong> Крупное число с разделителями тысяч (например: 12,345)</li>
                <li><strong>График:</strong> Линейный график показов за период (мини-sparkline внизу карточки)</li>
                <li><strong>Цвета:</strong> Индиго (синий) — основной цвет показов</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Эквивалент в рекламе</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Показывает сколько денег вы сэкономили, получив охват через истории вместо платной рекламы. 
                Расчёт: 1000 показов = 150 рублей (средний CPM в таргетированной рекламе ВКонтакте).
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Иконка:</strong> Денежный знак с кружком</li>
                <li><strong>Значение:</strong> Сумма в рублях (например: 1,850 ₽)</li>
                <li><strong>Подсказка:</strong> При наведении курсора на иконку вопроса появляется всплывающая подсказка с объяснением расчёта</li>
                <li><strong>Бейдж внизу:</strong> Зелёная плашка "Вы сэкономили бюджет"</li>
                <li><strong>Цвета:</strong> Изумрудно-зелёный (emerald)</li>
            </ul>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Пример:</strong> Если ваши истории набрали 10,000 просмотров, эквивалент в рекламе = 1,500₽. 
                        Это примерная стоимость покупки такого же охвата через таргет ВКонтакте.
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Клики (с CTR)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Количество переходов по ссылкам в историях. Внизу карточки показывается CTR — процент кликов от просмотров.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Иконка:</strong> Курсор с лучами (клик)</li>
                <li><strong>Значение:</strong> Число кликов</li>
                <li><strong>График:</strong> Линия кликов за период</li>
                <li><strong>CTR (справа внизу):</strong> Процент с одним знаком после запятой (например: 2.4%)</li>
                <li><strong>Расчёт CTR:</strong> (Клики / Просмотры) × 100</li>
                <li><strong>Цвета:</strong> Голубой (blue)</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">4. Активность (вовлечённость)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Суммарное количество активных действий: лайки + репосты + ответы. Внизу карточки — детализация по каждому типу.
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Иконка:</strong> Сердечко</li>
                <li><strong>Значение:</strong> Общая сумма активности</li>
                <li><strong>Детализация:</strong>
                    <ul>
                        <li>Лайки (розовая точка)</li>
                        <li>Репосты (фиолетовая точка)</li>
                        <li>Ответы (синяя точка)</li>
                    </ul>
                </li>
                <li><strong>Цвета:</strong> Розовый (pink)</li>
            </ul>

            <Sandbox
                title="Пример карточек метрик"
                description="Так выглядят основные карточки дашборда с разными показателями."
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MockMetricCard
                        title="Сумма показов"
                        value="12,345"
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                        bgColor="bg-white"
                        iconColor="bg-indigo-50"
                        valueColor="text-indigo-900"
                        showGraph={true}
                        graphColor="text-indigo-500"
                    />
                    
                    <MockMetricCard
                        title="Эквивалент в рекламе"
                        value="1,850 ₽"
                        icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                        bgColor="bg-white"
                        iconColor="bg-emerald-50"
                        valueColor="text-emerald-600"
                    />
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Нижний ряд (мини-карточки)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В самом низу дашборда находятся 4 маленькие карточки с дополнительными метриками:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Историй</strong> — количество историй в выборке (с иконкой архива, индиго цвет)</li>
                <li><strong>Новых подписок</strong> — сколько людей подписались через истории (оранжевая иконка пользователя с плюсом)</li>
                <li><strong>Скрытий</strong> — сколько раз пользователи скрыли истории (серая иконка перечёркнутого круга)</li>
                <li><strong>ER View</strong> — уровень вовлечённости (процент, градиент индиго, иконка графика вверх)</li>
            </ol>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>ER View</strong> (Engagement Rate View) — это процент вовлечённости на просмотр. 
                Расчёт: (Лайки + Репосты + Ответы) / Просмотры × 100. Чем выше процент, тем лучше контент цепляет аудиторию.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">История публикаций (Таблица)</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Под дашбордом находится большая таблица со списком всех историй. 
                Здесь показываются как активные истории (ещё доступны в ВКонтакте), так и архивные (уже удалённые или истёкшие).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Панель управления (Toolbar)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В верхней части таблицы расположена панель с двумя кнопками управления.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>1. Кнопка "Обновить статистику"</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>При клике раскрывается панель быстрых команд (dropdown)</li>
                <li><strong>"Посл:"</strong> 10, 30, 50, 100 — обновить последние N историй</li>
                <li><strong>"Дни:"</strong> 7, 30, 90 — обновить за последние N дней</li>
                <li><strong>"Все"</strong> (красная кнопка) — обновить всю статистику (может занять время)</li>
                <li>Иконка вращается во время загрузки (animate-spin)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>2. Кнопка "Обновить список"</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Перезагружает список историй с сервера</li>
                <li>Синий цвет (indigo-600)</li>
                <li>Показывает спиннер во время загрузки</li>
                <li>Используйте после публикации новой истории, чтобы увидеть её в списке</li>
            </ul>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Разница между кнопками:</strong> "Обновить статистику" загружает детальные данные с VK API 
                        (лайки, клики, подписки). "Обновить список" просто перезагружает таблицу из базы данных.
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Структура таблицы (4 колонки)</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица состоит из четырёх колонок:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Превью</strong> — миниатюра изображения из истории (12×20 пикселей, вертикальный формат). 
                    При наведении курсора изображение увеличивается в 2.5 раза. При клике открывается полноэкранный просмотр.
                </li>
                <li>
                    <strong>Информация</strong> — дата и время публикации, тип истории (photo/video), статусные бейджи:
                    <ul>
                        <li><strong>"Активна"</strong> (зелёный) — история ещё доступна в ВКонтакте</li>
                        <li><strong>"Архив"</strong> (серый) — история удалена или истекла</li>
                        <li><strong>"Наш сервис"</strong> (индиго) — опубликовано автоматически</li>
                        <li><strong>"Вручную"</strong> (оранжевый) — опубликовано кнопкой "Опубликовать"</li>
                    </ul>
                </li>
                <li>
                    <strong>Статистика</strong> — адаптивная сетка с 8 мини-карточками (на больших экранах в один ряд, на маленьких — 2×4):
                    <ul>
                        <li>Просм. (индиго)</li>
                        <li>Лайки (розовый)</li>
                        <li>Ответы (синий)</li>
                        <li>Клики (зелёный)</li>
                        <li>Репосты (фиолетовый)</li>
                        <li>Подп. (янтарный)</li>
                        <li>Скрытия (красный)</li>
                        <li>ЛС (голубой)</li>
                    </ul>
                    Если детальная статистика не загружена, показывается только количество просмотров и плашка "Нажмите 'Обновить' для загрузки".
                </li>
                <li>
                    <strong>Действия</strong> — ссылка на историю в ВКонтакте (открывается в новой вкладке) и кнопка "Обновить" 
                    для загрузки статистики конкретной истории.
                </li>
            </ol>

            <Sandbox
                title="Пример строк таблицы"
                description="Три истории с разными статусами и типами статистики."
            >
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-base font-semibold text-gray-900">
                            История публикаций <span className="text-gray-400 font-normal ml-1">3 истории</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Превью</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-48">Информация</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статистика</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase w-32">Действия</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <MockStoryRow 
                                    hasPreview={true}
                                    date="17 фев, 14:30"
                                    type="photo"
                                    isActive={true}
                                    isAutomated={true}
                                    hasStats={true}
                                />
                                <MockStoryRow 
                                    hasPreview={true}
                                    date="16 фев, 10:15"
                                    type="video"
                                    isActive={true}
                                    isAutomated={false}
                                    hasStats={false}
                                />
                                <MockStoryRow 
                                    hasPreview={false}
                                    date="15 фев, 18:45"
                                    type="photo"
                                    isActive={false}
                                    isAutomated={true}
                                    hasStats={true}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Особенности таблицы</h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>При наведении курсора на превью</strong> изображение увеличивается и показывается поверх страницы. 
                    Это позволяет быстро проверить качество изображения без открытия полноэкранного режима.
                </li>
                <li>
                    <strong>Строки подсвечиваются</strong> при наведении курсора (светло-серый фон) для удобства чтения.
                </li>
                <li>
                    <strong>Плавная анимация появления</strong> — каждая строка появляется с небольшой задержкой (30ms на строку), 
                    создавая эффект постепенной загрузки.
                </li>
                <li>
                    <strong>Адаптивная сетка статистики</strong> — на широких экранах все 8 метрик в один ряд, 
                    на средних — 4×2, на узких — 2×4.
                </li>
                <li>
                    <strong>Пустое состояние</strong> — если историй нет, показывается иконка архива с текстом 
                    "Опубликуйте первую историю или включите автоматизацию."
                </li>
            </ul>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как пользоваться статистикой</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 1: Первый просмотр статистики</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Откройте страницу "Статистика" (вкладка справа от "Настройки и История")</li>
                <li>Дождитесь загрузки дашборда и таблицы (может занять 2-3 секунды)</li>
                <li>Посмотрите на дашборд — там сводные цифры за всё время</li>
                <li>Прокрутите вниз до таблицы — там список всех историй</li>
                <li>Если у каких-то историй нет детальной статистики (только просмотры), нажмите "Обновить статистику" → выберите период</li>
            </ol>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 2: Анализ эффективности за неделю</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Нажмите на фильтр "За неделю" в дашборде</li>
                <li>Все метрики пересчитаются и покажут данные за последние 7 дней</li>
                <li>Сравните CTR и ER View — если CTR &lt; 1%, значит ссылки не кликают; если ER View &lt; 3%, значит контент не цепляет</li>
                <li>Переключите фильтр типа на "Авто" — посмотрите работает ли автоматизация лучше чем ручные публикации</li>
            </ol>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 3: Обновление статистики конкретной истории</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Найдите нужную историю в таблице (по дате или превью)</li>
                <li>Нажмите кнопку "Обновить" в колонке "Действия"</li>
                <li>Кнопка изменит текст на "Обновление..." и станет серой</li>
                <li>Через 2-5 секунд детальная статистика загрузится с VK API</li>
                <li>Появятся все 8 метрик: лайки, клики, репосты, подписки и т.д.</li>
            </ol>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Совет:</strong> Обновляйте статистику раз в день, а не каждый час. 
                        VK API имеет ограничения на количество запросов, и частые обновления могут привести к временной блокировке.
                    </span>
                </p>
            </div>

            <NavigationButtons currentPath="2-4-1-3-stats" />
        </article>
    );
};
