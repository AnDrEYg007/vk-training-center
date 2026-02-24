import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';

/**
 * Обучающая страница: "2.4.1.1. Обзор функционала"
 * 
 * Общий обзор страницы автоматизации "Посты в истории" — что видит пользователь,
 * как устроен интерфейс, куда смотреть в первую очередь.
 */

// =====================================================================
// Mock-компоненты для демонстрации интерфейса
// =====================================================================

// Переключатель активации (точная копия из StoriesSettingsView.tsx:115)
const MockToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={isActive}
                onChange={onToggle}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
    );
};

// Статусный бейдж (из StoriesAutomationPage.tsx:50,52)
const MockStatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    return isActive ? (
        <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200 animate-pulse">
            Активен
        </span>
    ) : (
        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">
            Остановлен
        </span>
    );
};

// Mock-компонент: Упрощённый вид заголовка страницы
const MockPageHeader: React.FC<{ isActive: boolean; onToggle: () => void }> = ({ isActive, onToggle }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            {/* Заголовок с бейджем */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                        Автоматизация историй
                        <MockStatusBadge isActive={isActive} />
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Автоматический репост подходящих записей в истории сообщества
                    </p>
                </div>
                <button className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                    Сохранить изменения
                </button>
            </div>

            {/* Вкладки */}
            <div className="flex gap-6 border-b border-gray-200">
                <button className="pb-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
                    Настройки и История
                </button>
                <button className="pb-3 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                    Статистика
                </button>
            </div>

            {/* Упрощённая область контента */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Статус автоматизации</p>
                        <p className="text-xs text-gray-500">
                            Когда включено, система каждые 10 минут проверяет новые посты
                        </p>
                    </div>
                    <MockToggleSwitch isActive={isActive} onToggle={onToggle} />
                </div>

                <div className="text-xs text-gray-400 text-center py-4 border-t border-gray-300">
                    Здесь находятся настройки фильтрации, таблица постов и вся логика работы
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsStoriesOverviewPage: React.FC<ContentProps> = ({ title }) => {
    const [demoActive, setDemoActive] = useState(false);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Эта страница — <strong>общий обзор</strong> раздела "Посты в истории". Здесь мы разберём главные элементы интерфейса,
                которые видит пользователь при первом заходе, и объясним что где находится.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Для чего этот раздел:</strong> После общего обзора вы перейдёте к детальным разделам — 
                        "Настройки автоматизации", "Статистика" и "Дашборд", где каждый элемент рассмотрен подробно.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это за автоматизация?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>"Посты в истории"</strong> — это автоматизация, которая репостит записи из ленты сообщества в истории ВКонтакте. 
                Работает в фоновом режиме: каждые 10 минут проверяет новые посты, отбирает подходящие (по ключевым словам) 
                и публикует их без участия человека.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Зачем это нужно?</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Раньше:</strong> SMM-специалист каждый день вручную выбирал 3-5 постов и дублировал их в истории. 
                Это занимало 20-30 минут и часто забывалось.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Теперь:</strong> Настроил один раз — указал ключевые слова (например, "#вистории"). 
                Система сама находит посты с этим хештегом и публикует в истории. 
                Охваты выросли в среднем на 15-20%.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура страницы</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница автоматизации состоит из трёх основных частей:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">1. Заголовок с управлением</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В самом верху страницы находится заголовок "Автоматизация историй" и два важных элемента:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Статусный бейдж:</strong> показывает текущее состояние автоматизации.
                    <ul>
                        <li><strong>"Активен"</strong> (зелёный, с анимацией пульсации) — система работает, каждые 10 минут проверяет новые посты</li>
                        <li><strong>"Остановлен"</strong> (серый) — автоматизация выключена, посты не проверяются</li>
                    </ul>
                </li>
                <li>
                    <strong>Кнопка "Сохранить изменения":</strong> синяя кнопка (indigo-600) в правом верхнем углу. 
                    Нажимайте её после любых изменений настроек, чтобы сохранить их на сервере.
                </li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">2. Вкладки навигации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Под заголовком находятся две вкладки с подчёркиванием (стиль underline tabs):
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>"Настройки и История"</strong> — здесь находится переключатель включения/выключения, 
                    выбор режима работы (по ключевым словам или все посты), поле ввода ключевых слов 
                    и таблица с историей обработанных постов.
                </li>
                <li>
                    <strong>"Статистика"</strong> — здесь показана детальная статистика по опубликованным историям: 
                    дашборд с метриками, графики и таблица всех историй с подробными данными.
                </li>
            </ul>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <p className="text-sm text-purple-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Важная деталь:</strong> Вкладки используют стиль с подчёркиванием (border-b-2). 
                        Активная вкладка подчёркнута синим цветом (indigo-600), неактивная — прозрачная с серым текстом.
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">3. Область контента</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В зависимости от выбранной вкладки, здесь отображается:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Настройки:</strong> блок с переключателем активации, режимами отбора постов, полем ввода ключевых слов и таблицей</li>
                <li><strong>Статистика:</strong> дашборд с метриками (просмотры, лайки, клики) и таблица опубликованных историй</li>
            </ul>

            <Sandbox 
                title="Интерактивная демонстрация"
                description="Попробуйте включить и выключить автоматизацию. Обратите внимание как меняется статусный бейдж."
                instructions={[
                    'Нажмите на <strong>переключатель</strong> справа от текста "Статус автоматизации"',
                    'Статусный бейдж в заголовке изменится с "Остановлен" на "Активен" (с пульсацией)',
                    'Переключатель станет синим, когда автоматизация включена'
                ]}
            >
                <MockPageHeader isActive={demoActive} onToggle={() => setDemoActive(!demoActive)} />
            </Sandbox>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Главные элементы управления</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Переключатель активации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый важный элемент управления — переключатель активации (toggle switch). 
                Находится в правой части блока "Статус автоматизации" на вкладке "Настройки и История".
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Состояния переключателя:</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Выключен:</strong> серый цвет (gray-200), белый кружок слева</li>
                <li><strong>Включён:</strong> синий цвет (indigo-600), белый кружок справа</li>
            </ul>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Критически важно:</strong> После включения/выключения переключателя обязательно нажмите 
                        кнопку "Сохранить изменения" в правом верхнем углу. Иначе изменения не применятся на сервере.
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Статусный бейдж</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Рядом с заголовком страницы находится статусный бейдж — небольшой цветной индикатор, 
                который показывает текущее состояние автоматизации:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>"Активен"</strong> — зелёный бейдж (bg-green-100, text-green-700) с анимацией пульсации (animate-pulse). 
                    Означает, что система работает и проверяет посты каждые 10 минут.
                </li>
                <li>
                    <strong>"Остановлен"</strong> — серый бейдж (bg-gray-100, text-gray-600) без анимации. 
                    Означает, что автоматизация выключена.
                </li>
            </ul>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Куда идти дальше?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Теперь, когда вы знаете общую структуру страницы, переходите к детальным разделам:
            </p>

            <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                {/* Карточка: Настройки */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-indigo-900">Настройки</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        Переключатель активации, режимы отбора постов (по ключевым словам / все подряд), 
                        поле ввода ключевых слов, таблица истории обработки.
                    </p>
                    <NavigationLink 
                        to="2-4-1-2-settings"
                        title="Настройки автоматизации"
                        variant="related"
                    />
                </div>

                {/* Карточка: Статистика */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-green-900">Статистика</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        Таблица всех опубликованных историй с детальной статистикой: просмотры, лайки, 
                        ответы, клики, подписки. Возможность обновить данные по каждой истории.
                    </p>
                    <NavigationLink 
                        to="2-4-1-3-stats"
                        title="Статистика"
                        variant="related"
                    />
                </div>

                {/* Карточка: Дашборд */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-amber-900">Дашборд</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                        Метрики и аналитика: сумма просмотров, активность (лайки, репосты, ответы), 
                        расчётные показатели (CTR, ER), фильтры по периоду и типу историй, графики.
                    </p>
                    <NavigationLink 
                        to="2-4-1-4-dashboard"
                        title="Дашборд"
                        variant="related"
                    />
                </div>
            </div>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Совет:</strong> Начните с раздела "Настройки автоматизации" — там подробно объясняется 
                        как настроить систему и запустить её в работу. Потом переходите к статистике и дашборду.
                    </span>
                </p>
            </div>

            <NavigationButtons currentPath="2-4-1-1-overview" />
        </article>
    );
};
