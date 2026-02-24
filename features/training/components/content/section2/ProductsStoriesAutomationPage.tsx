import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * Обучающая страница: "2.4.1. Посты в истории"
 * 
 * Автоматизация репоста постов в истории ВКонтакте — система сама отбирает
 * подходящие записи и публикует их в историях каждые 10 минут.
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

// Статусный бейдж (из StoriesAutomationPage.tsx:54)
interface StatusBadgeProps {
    isActive: boolean;
}

const MockStatusBadge: React.FC<StatusBadgeProps> = ({ isActive }) => {
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

// Поле ввода ключевых слов с иконкой (из StoriesSettingsView.tsx:158)
const MockKeywordInput: React.FC<{ value: string; onChange: (v: string) => void; disabled?: boolean }> = ({ value, onChange, disabled }) => {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
            </div>
            <input 
                type="text" 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                placeholder="Например: #вистории, #repost, #важное"
            />
        </div>
    );
};

// Строка таблицы с постом (упрощённая версия из StoriesSettingsView.tsx:216)
const MockPostRow: React.FC<{ text: string; date: string; status: string; statusColor: string }> = ({ text, date, status, statusColor }) => {
    return (
        <tr className="hover:bg-gray-50/80 transition-colors">
            <td className="px-6 py-4 align-top">
                <div className="w-12 h-12 bg-gray-100 rounded-lg border text-[10px] flex items-center justify-center text-gray-400">
                    NO IMG
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="text-sm line-clamp-2 text-gray-900">{text}</div>
            </td>
            <td className="px-6 py-4 align-top text-sm text-gray-500">
                <div>{date}</div>
                <div className="text-xs">15:30</div>
            </td>
            <td className="px-6 py-4 align-top">
                <span className={`px-2 py-0.5 text-xs rounded-full border ${statusColor}`}>{status}</span>
                <button className="mt-2 px-2 py-1 text-xs rounded text-white bg-indigo-600 hover:bg-indigo-700 block">
                    Опубликовать
                </button>
            </td>
        </tr>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsStoriesAutomationPage: React.FC<ContentProps> = ({ title }) => {
    const [demoActive, setDemoActive] = useState(false);
    const [demoMode, setDemoMode] = useState<'keywords' | 'all'>('keywords');
    const [demoKeywords, setDemoKeywords] = useState('');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>"Посты в истории"</strong> — это автоматизация, которая репостит записи из ленты сообщества в истории ВКонтакте. 
                Система работает в фоновом режиме каждые 10 минут, находит подходящие посты и публикует их без участия человека.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Было:</strong> SMM-специалист каждый день вручную выбирал 3-5 постов и дублировал их в истории сообщества. 
                Это занимало 20-30 минут в день и часто забывалось — истории пустовали по 2-3 дня.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Стало:</strong> Настроил автоматизацию один раз — указал ключевые слова (например, "#вистории"). 
                Теперь система сама находит посты с этим хештегом и публикует их в истории. 
                Охваты выросли в среднем на 15-20% без дополнительных усилий.
            </p>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> Автоматизация проверяет новые посты каждые 10 минут. 
                        Это значит, что пост появится в истории не мгновенно, а в течение 10 минут после публикации в ленте.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работает интерфейс</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница автоматизации состоит из заголовка с переключателем, кнопки сохранения и двух вкладок: "Настройки и История" + "Статистика".
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Переключатель активации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Главный элемент управления — переключатель в правом верхнем углу. Когда он включён (синий цвет), система работает. 
                Когда выключен (серый) — автоматизация остановлена.
            </p>

            <Sandbox 
                title="Интерактивный переключатель"
                description="Попробуйте включить и выключить автоматизацию. Обратите внимание на плавную анимацию ползунка."
                instructions={[
                    'Кликните на переключатель, чтобы изменить состояние',
                    'Синий цвет означает "Активен" — система работает',
                    'Серый цвет означает "Остановлен" — система не проверяет посты'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="max-w-lg">
                            <label className="text-sm font-medium text-gray-900 mb-1 block">
                                Статус автоматизации
                            </label>
                            <p className="text-sm text-gray-500">
                                Когда включено, система каждые 10 минут проверяет новые посты. 
                                Если пост содержит одно из ключевых слов, он будет автоматически опубликован в истории.
                            </p>
                        </div>
                        <MockToggleSwitch isActive={demoActive} onToggle={() => setDemoActive(!demoActive)} />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                            <strong>Текущее состояние:</strong>
                            <MockStatusBadge isActive={demoActive} />
                        </p>
                    </div>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режимы отбора постов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Автоматизация работает в двух режимах: можно публиковать в истории только посты с определёнными ключевыми словами 
                (например, только те, где есть "#вистории"), или публиковать абсолютно все новые посты подряд.
            </p>

            <Sandbox 
                title="Выбор режима работы"
                description="Переключайте между режимами и смотрите, как меняется интерфейс."
                instructions={[
                    '<strong>"По ключевым словам"</strong> — публикуются только посты, содержащие указанные слова или хештеги',
                    '<strong>"Все посты подряд"</strong> — каждый новый пост автоматически дублируется в истории',
                    'В первом режиме появляется поле для ввода ключевых слов'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
                    <div className="flex space-x-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="demoMode" 
                                className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300"
                                checked={demoMode === 'keywords'}
                                onChange={() => setDemoMode('keywords')}
                            />
                            <span className="ml-2 text-sm text-gray-900">По ключевым словам</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="demoMode" 
                                className="form-radio text-indigo-600 focus:ring-indigo-500 w-4 h-4 border-gray-300"
                                checked={demoMode === 'all'}
                                onChange={() => setDemoMode('all')}
                            />
                            <span className="ml-2 text-sm text-gray-900">Все посты подряд</span>
                        </label>
                    </div>

                    {demoMode === 'keywords' ? (
                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 space-y-3 fade-in">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                                Введите ключевые слова через запятую
                            </label>
                            <MockKeywordInput value={demoKeywords} onChange={setDemoKeywords} />
                            <p className="text-xs text-blue-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Регистр не важен. Система найдёт посты с любым из указанных слов.
                            </p>
                        </div>
                    ) : (
                        <div className="p-3 bg-blue-100/50 text-blue-800 text-sm rounded-lg border border-blue-200 flex gap-2 fade-in">
                            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p>
                                В этом режиме <strong>абсолютно все</strong> новые посты, появляющиеся в ленте, 
                                будут автоматически дублироваться в истории. Фильтрация по словам отключена.
                            </p>
                        </div>
                    )}
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Таблица "История обработки"</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Ниже настроек находится таблица со всеми постами, которые система уже проверила. 
                Для каждого поста показан текст, дата публикации и статус (опубликован ли в истории).
            </p>

            <Sandbox 
                title="Пример таблицы постов"
                description="Так выглядит таблица с историей обработки. Для каждого поста есть кнопка ручной публикации."
                instructions={[
                    'Зелёный статус = пост успешно опубликован в истории',
                    'Серый статус = пост не подошёл под условия (нет ключевых слов)',
                    'Кнопка "Опубликовать" позволяет вручную отправить пост в истории'
                ]}
            >
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                                        Превью
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Содержание
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        Дата
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                                        Статус
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <MockPostRow 
                                    text="Новая коллекция уже в продаже! 🔥 #вистории #новинки"
                                    date="15.02.2026"
                                    status="Опубликован"
                                    statusColor="bg-green-50 text-green-700 border-green-200"
                                />
                                <MockPostRow 
                                    text="Скидки до 50% на все товары категории «Зима»"
                                    date="14.02.2026"
                                    status="Не подошёл"
                                    statusColor="bg-gray-50 text-gray-600 border-gray-200"
                                />
                                <MockPostRow 
                                    text="Обзор новинок февраля #вистории #обзор"
                                    date="13.02.2026"
                                    status="Опубликован"
                                    statusColor="bg-green-50 text-green-700 border-green-200"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </Sandbox>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Вкладки навигации</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Страница автоматизации имеет две вкладки с подчёркиванием (стиль underline tabs согласно дизайн-системе).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Настройки и История"</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Здесь находятся все элементы управления, которые мы рассмотрели выше:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Переключатель включения/выключения автоматизации</li>
                <li>Выбор режима работы (по ключевым словам или все посты подряд)</li>
                <li>Поле ввода ключевых слов</li>
                <li>Таблица "История обработки" со всеми проверенными постами</li>
            </ul>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Вкладка "Статистика"</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                На этой вкладке показана подробная статистика по опубликованным историям:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Дашборд с метриками:</strong> общее количество историй, просмотры, лайки, клики по ссылкам, подписки, скрытия</li>
                <li><strong>Расчётные показатели:</strong> CTR (процент кликов), ER (вовлечённость), экономия бюджета</li>
                <li><strong>Таблица историй:</strong> каждая опубликованная история с детальной статистикой и возможностью обновить данные</li>
                <li><strong>Фильтры:</strong> можно отфильтровать только автоматические или только ручные публикации, выбрать период</li>
            </ul>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> Статистика по историям загружается из VK API. 
                        Для обновления данных нажмите кнопку "Обновить статистику" в таблице или на дашборде.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как настроить автоматизацию</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Пошаговая инструкция для первого запуска:</strong>
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Откройте раздел "Автоматизации"</strong> в главном сайдбаре (иконка молнии ⚡).
                </li>
                <li>
                    <strong>В выпадающем меню выберите "Посты в истории".</strong>
                </li>
                <li>
                    <strong>Убедитесь, что переключатель в правом верхнем углу выключен</strong> (серый цвет). 
                    Сначала настроим параметры, потом включим.
                </li>
                <li>
                    <strong>Выберите режим работы:</strong>
                    <ul>
                        <li>Если хотите публиковать только определённые посты — выберите "По ключевым словам" и введите хештеги через запятую (например: "#вистории, #repost").</li>
                        <li>Если хотите публиковать абсолютно все новые посты — выберите "Все посты подряд".</li>
                    </ul>
                </li>
                <li>
                    <strong>Включите автоматизацию</strong>, кликнув на переключатель в правом верхнем углу. Он должен стать синим.
                </li>
                <li>
                    <strong>Нажмите кнопку "Сохранить изменения"</strong> (indigo-600, правый верхний угол).
                </li>
                <li>
                    <strong>Готово!</strong> Система начнёт проверять новые посты каждые 10 минут и публиковать подходящие в истории.
                </li>
            </ol>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Совет:</strong> После первого запуска подождите 15-20 минут и проверьте вкладку "Статистика". 
                        Там появятся опубликованные истории с начальными данными о просмотрах.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Типичные сценарии использования</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 1: Публикация только важных постов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> В сообществе публикуется 5-10 постов в день, но в истории нужны только самые важные — анонсы мероприятий и новинки.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Решение:</strong> Включите режим "По ключевым словам" и введите: "#вистории, #важно, #анонс". 
                Теперь попросите SMM-специалистов добавлять эти хештеги только к важным постам. 
                Система автоматически отфильтрует остальные.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 2: Полная автоматизация для новостного паблика</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Новостное сообщество публикует 20-30 коротких новостей в день. Все они важные, хочется максимальный охват.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Решение:</strong> Включите режим "Все посты подряд". Каждая новость будет автоматически дублироваться в истории. 
                Подписчики получат уведомление и увидят новость даже если не заходят в ленту.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 3: Ручная публикация конкретного поста</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Задача:</strong> Нужно срочно опубликовать конкретный пост в историях, не дожидаясь автоматической проверки (которая произойдёт через 10 минут).
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Решение:</strong> Зайдите на вкладку "Настройки и История", найдите нужный пост в таблице и нажмите кнопку "Опубликовать". 
                Пост мгновенно появится в историях сообщества.
            </p>

            <NavigationButtons currentPath="2-4-1-stories-automation" />
        </article>
    );
};
