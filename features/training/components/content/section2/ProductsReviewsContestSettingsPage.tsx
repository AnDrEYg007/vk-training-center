import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { ToggleSwitch } from './ReviewsContestMocks';

// =====================================================================
// Mock-компоненты для настроек конкурса
// =====================================================================

// Segmented Control для выбора условия завершения
const SegmentedControlMock: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
    const options = [
        { id: 'count', label: 'По количеству' },
        { id: 'date', label: 'В определенный день' },
        { id: 'mixed', label: 'День + Количество' }
    ];

    return (
        <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
            {options.map(option => (
                <button
                    key={option.id}
                    onClick={() => onChange(option.id)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap focus:outline-none ${
                        value === option.id
                            ? 'bg-white text-indigo-600 shadow-sm'
                            : 'text-gray-600 hover:bg-gray-300'
                    }`}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

// Селектор дня недели (7 кнопок)
const DaySelectorMock: React.FC<{ value: number; onChange: (day: number) => void }> = ({ value, onChange }) => {
    const days = [
        { val: 1, label: 'Пн' }, { val: 2, label: 'Вт' }, { val: 3, label: 'Ср' },
        { val: 4, label: 'Чт' }, { val: 5, label: 'Пт' }, { val: 6, label: 'Сб' }, { val: 7, label: 'Вс' }
    ];

    return (
        <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            {days.map(d => (
                <button
                    key={d.val}
                    onClick={() => onChange(d.val)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
                        value === d.val
                            ? 'bg-white shadow-sm text-indigo-600 ring-1 ring-black/5'
                            : 'text-gray-500 hover:bg-white/50'
                    }`}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
};

// Редактор шаблона с кнопками переменных
const RichTemplateEditorMock: React.FC<{ 
    label: string; 
    value: string; 
    specificVariables?: { name: string; value: string }[];
    helpText?: string;
}> = ({ label, value, specificVariables, helpText }) => {
    return (
        <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 p-2">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <div className="flex items-center gap-1">
                        {/* Кнопки специфичных переменных */}
                        {specificVariables && specificVariables.length > 0 && (
                            <div className="flex gap-1 mr-2 border-r border-gray-300 pr-2">
                                {specificVariables.map(v => (
                                    <button
                                        key={v.value}
                                        type="button"
                                        title={`Вставить переменную: ${v.name}`}
                                        className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors border border-indigo-200 cursor-pointer"
                                    >
                                        {v.value}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {/* Кнопка переменных */}
                        <button 
                            type="button"
                            className="p-1.5 rounded transition-colors text-gray-500 hover:bg-gray-200"
                            title="Переменные проекта"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        
                        {/* Кнопка эмодзи */}
                        <button 
                            type="button"
                            className="p-1.5 rounded transition-colors text-gray-500 hover:bg-gray-200"
                            title="Эмодзи"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            
            <textarea
                value={value}
                readOnly
                rows={3}
                className="w-full px-3 py-2 text-sm focus:outline-none bg-transparent custom-scrollbar rounded-b-md resize-none"
                placeholder="Введите текст шаблона..."
            />
            
            {helpText && (
                <div className="bg-gray-50 border-t border-gray-200 px-3 py-2">
                    <p className="text-xs text-gray-500">{helpText}</p>
                </div>
            )}
        </div>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsReviewsContestSettingsPage: React.FC<ContentProps> = ({ title }) => {
    // Состояния для интерактивных примеров
    const [isActive, setIsActive] = useState(true);
    const [keywords, setKeywords] = useState('#отзыв@club12345');
    const [finishCondition, setFinishCondition] = useState<'count' | 'date' | 'mixed'>('count');
    const [targetCount, setTargetCount] = useState(50);
    const [dayOfWeek, setDayOfWeek] = useState(1);
    const [autoBlacklist, setAutoBlacklist] = useState(false);
    const [blacklistDuration, setBlacklistDuration] = useState(7);

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ===== ВВЕДЕНИЕ ===== */}
            <section>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Вкладка <strong>"Настройки"</strong> — это центр управления конкурсом отзывов. Здесь настраивается всё: от активности механики и ключевых слов до шаблонов сообщений участникам и победителям. Правильная настройка этих параметров гарантирует, что конкурс будет работать автоматически и без ошибок.
                </p>

                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 !mt-8">
                    Что настраивается на этой вкладке?
                </h2>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Активность конкурса</strong> — включить или остановить сбор участников</li>
                    <li><strong>Ключевые слова</strong> — по каким словам искать отзывы в товарах сообщества</li>
                    <li><strong>Условия завершения</strong> — когда подводить итоги (по количеству, по дате или смешанный режим)</li>
                    <li><strong>Шаблоны сообщений</strong> — что отправлять участникам, победителям и в посте с итогами</li>
                    <li><strong>Автоматический черный список</strong> — исключать ли победителей из будущих розыгрышей</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ===== БЫЛО/СТАЛО ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Было / Стало
                </h2>

                <div className="not-prose grid md:grid-cols-2 gap-6 mt-6">
                    {/* БЫЛО */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-red-800 mb-4">❌ Раньше (ручная работа)</h3>
                        <ul className="space-y-3 text-sm text-red-900">
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Каждый раз вручную копировать текст комментария для регистрации участников</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Забывать добавить хештег или номер участника — приходилось редактировать</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Составлять пост с итогами вручную, форматировать список победителей</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Не было единого шаблона — каждый раз писать текст заново</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>Если победитель уже выигрывал, узнавали только постфактум</span>
                            </li>
                        </ul>
                    </div>

                    {/* СТАЛО */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-green-800 mb-4">✅ Сейчас (автоматика)</h3>
                        <ul className="space-y-3 text-sm text-green-900">
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Один раз настроили шаблоны — используются всегда</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Переменные автоматически подставляются (номер участника, промокод, имя)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Пост с итогами формируется автоматически по шаблону</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Условия завершения настраиваются гибко (день недели, количество, комбинация)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">•</span>
                                <span>Автоматический бан победителя на N дней — исключает повторные выигрыши</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== БЛОК 1: ОСНОВНЫЕ НАСТРОЙКИ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Блок 1: Основные настройки
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Первый блок содержит самые важные параметры запуска конкурса:
                </p>

                <div className="not-prose mt-6 space-y-6">
                    {/* Переключатель активности */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">⚙️ Активность механики</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Включите, чтобы система начала автоматически собирать и обрабатывать новые отзывы. Выключите — сбор остановится.
                                </p>
                            </div>
                            <ToggleSwitch enabled={isActive} onChange={() => setIsActive(!isActive)} />
                        </div>
                        {isActive && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
                                ✓ Конкурс активен, система ищет новых участников
                            </div>
                        )}
                    </div>

                    {/* Ключевое вхождение */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-2">🔍 Ключевое вхождение</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Слово или хештег, по которому система ищет отзывы. Обычно это хештег с упоминанием сообщества, чтобы участники писали его в отзывах.
                        </p>
                        <input
                            type="text"
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            placeholder="#отзыв@club12345"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Пример: <code className="bg-gray-100 px-1 py-0.5 rounded">#отзыв@club12345</code> — участники пишут это в своих отзывах на товары
                        </p>
                    </div>

                    {/* Начало сбора */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-2">📅 Начало сбора</h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Дата, с которой учитываются отзывы. Отзывы, написанные до этой даты, не попадут в конкурс.
                        </p>
                        <div className="inline-block border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm">
                            📆 15.02.2026
                        </div>
                    </div>

                    {/* Автоматический бан победителя */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">🚫 Автоматический бан победителя</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Добавлять победителя в черный список после выигрыша, чтобы он не участвовал повторно в следующих розыгрышах.
                                </p>
                            </div>
                            <ToggleSwitch enabled={autoBlacklist} onChange={() => setAutoBlacklist(!autoBlacklist)} />
                        </div>
                        
                        {autoBlacklist && (
                            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки (дней)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={blacklistDuration}
                                        onChange={(e) => setBlacklistDuration(Math.max(1, Number(e.target.value)))}
                                        className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    />
                                    <span className="text-sm text-gray-600">дней</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Пользователь будет автоматически удален из черного списка через {blacklistDuration} {blacklistDuration === 1 ? 'день' : blacklistDuration < 5 ? 'дня' : 'дней'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ИНТЕРАКТИВНЫЙ ПРИМЕР: ПЕРЕКЛЮЧАТЕЛЬ АКТИВНОСТИ ===== */}
            <Sandbox
                title="🎮 Попробуйте: Переключатель активности"
                description="Этот переключатель управляет работой всей механики конкурса. Попробуйте включить и выключить конкурс."
                instructions={[
                    'Нажмите на переключатель, чтобы увидеть изменение состояния',
                    'Когда конкурс активен, переключатель становится синим',
                    'В реальном приложении изменения сохраняются на сервере'
                ]}
            >
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">Конкурс отзывов активен</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                {isActive 
                                    ? 'Система активно ищет новых участников по ключевым словам' 
                                    : 'Конкурс остановлен, новые участники не собираются'}
                            </p>
                        </div>
                        <ToggleSwitch enabled={isActive} onChange={() => setIsActive(!isActive)} />
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ===== БЛОК 2: УСЛОВИЯ ЗАВЕРШЕНИЯ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Блок 2: Условия подведения итогов
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Этот блок определяет, <strong>когда система автоматически подведет итоги конкурса</strong>. Есть три режима:
                </p>

                <div className="not-prose mt-6 space-y-6">
                    {/* Переключатель режимов */}
                    <div className="bg-white border border-gray-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-3">Выберите режим завершения</h3>
                        <SegmentedControlMock value={finishCondition} onChange={(val) => setFinishCondition(val as any)} />
                    </div>

                    {/* Описание режимов */}
                    {finishCondition === 'count' && (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-indigo-900 mb-3">🎉 По количеству</h3>
                            <p className="text-sm text-indigo-800 mb-4">
                                Итоги подводятся автоматически, как только в базе наберется указанное количество участников.
                            </p>
                            <div className="bg-white border border-indigo-200 rounded-lg p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Целевое количество участников</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(Math.max(1, Number(e.target.value)))}
                                        className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    />
                                    <span className="text-sm text-gray-600">участников</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Пост с итогами опубликуется автоматически при достижении {targetCount} участников
                                </p>
                            </div>
                        </div>
                    )}

                    {finishCondition === 'date' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-green-900 mb-3">📅 В определенный день</h3>
                            <p className="text-sm text-green-800 mb-4">
                                Итоги подводятся в указанный день недели и время, независимо от количества участников (если есть хотя бы один).
                            </p>
                            <div className="bg-white border border-green-200 rounded-lg p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">День недели</label>
                                    <DaySelectorMock value={dayOfWeek} onChange={setDayOfWeek} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Время подведения</label>
                                    <div className="inline-block border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm">
                                        🕐 10:00
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Итоги подведутся каждый {['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье'][dayOfWeek - 1]} в 10:00
                                </p>
                            </div>
                        </div>
                    )}

                    {finishCondition === 'mixed' && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                            <h3 className="text-lg font-bold text-amber-900 mb-3">⚖️ День + Количество</h3>
                            <p className="text-sm text-amber-800 mb-4">
                                Итоги подводятся в указанный день, но только если набрано минимальное количество участников. Если нет — переносится на следующую неделю.
                            </p>
                            <div className="bg-white border border-amber-200 rounded-lg p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">День недели</label>
                                    <DaySelectorMock value={dayOfWeek} onChange={setDayOfWeek} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Минимум участников</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={targetCount}
                                        onChange={(e) => setTargetCount(Math.max(1, Number(e.target.value)))}
                                        className="w-24 border border-gray-300 rounded-md px-3 py-1.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Если в {['понедельник', 'вторник', 'среду', 'четверг', 'пятницу', 'субботу', 'воскресенье'][dayOfWeek - 1]} будет {targetCount}+ участников — проводим розыгрыш. Если нет — ждем следующей недели.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ИНТЕРАКТИВНЫЙ ПРИМЕР: РЕЖИМЫ ЗАВЕРШЕНИЯ ===== */}
            <Sandbox
                title="🎮 Попробуйте: Режимы завершения конкурса"
                description="Переключайте между режимами, чтобы увидеть, какие параметры становятся доступны для настройки."
                instructions={[
                    'Выберите режим "По количеству" — появится поле для указания целевого числа участников',
                    'Выберите "В определенный день" — увидите селектор дня недели и времени',
                    'Режим "День + Количество" комбинирует оба условия'
                ]}
            >
                <div className="space-y-4">
                    <SegmentedControlMock value={finishCondition} onChange={(val) => setFinishCondition(val as any)} />
                    
                    <div className="min-h-[8rem] bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-center">
                        {finishCondition === 'count' && (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-indigo-600 mb-2">{targetCount}</p>
                                <p className="text-sm text-gray-600">участников до розыгрыша</p>
                            </div>
                        )}
                        {finishCondition === 'date' && (
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600 mb-2">
                                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][dayOfWeek - 1]} в 10:00
                                </p>
                                <p className="text-sm text-gray-600">розыгрыш каждую неделю</p>
                            </div>
                        )}
                        {finishCondition === 'mixed' && (
                            <div className="text-center space-y-1">
                                <p className="text-lg font-bold text-amber-600">
                                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][dayOfWeek - 1]} в 10:00
                                </p>
                                <p className="text-sm text-gray-600">если набрано минимум</p>
                                <p className="text-xl font-bold text-amber-700">{targetCount} участников</p>
                            </div>
                        )}
                    </div>
                </div>
            </Sandbox>

            <hr className="!my-10" />

            {/* ===== БЛОК 3: ШАБЛОНЫ СООБЩЕНИЙ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Блок 3: Шаблоны сообщений
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Самый важный блок настроек — здесь вы создаёте тексты, которые будут автоматически отправляться участникам и публиковаться в сообществе. <strong>Используйте переменные</strong> — они автоматически подставят нужные значения.
                </p>

                <div className="not-prose mt-6 space-y-6">
                    {/* Шаблон 1: Комментарий регистрации */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">1️⃣ Шаблон комментария (Регистрация)</h3>
                        <RichTemplateEditorMock
                            label="Комментарий под отзывом участника"
                            value="Спасибо за отзыв! Ваш номер участника: {number}. Желаем удачи! 🍀"
                            specificVariables={[
                                { name: 'Номер', value: '{number}' }
                            ]}
                            helpText="Это комментарий оставляется автоматически под отзывом пользователя, когда он регистрируется в конкурсе."
                        />
                    </div>

                    {/* Шаблон 2: Сообщение победителю */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">2️⃣ Сообщение победителю (ЛС)</h3>
                        <RichTemplateEditorMock
                            label="Личное сообщение победителю"
                            value="Поздравляем, {user_name}! 🎉\n\nВы выиграли в конкурсе отзывов.\nВаш приз: {description}\nВаш промокод: {promo_code}\n\nИспользуйте его при следующем заказе!"
                            specificVariables={[
                                { name: 'Промокод', value: '{promo_code}' },
                                { name: 'Приз', value: '{description}' },
                                { name: 'Имя', value: '{user_name}' }
                            ]}
                            helpText="Это сообщение отправляется победителю в личные сообщения от лица сообщества."
                        />
                    </div>

                    {/* Шаблон 3: Ошибка отправки */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">3️⃣ Ошибка отправки (Комментарий)</h3>
                        <RichTemplateEditorMock
                            label="Комментарий при ошибке отправки ЛС"
                            value="{user_name}, поздравляем с победой! 🎊\n\nНе смогли отправить вам промокод в ЛС. Напишите нам в сообщения сообщества, чтобы получить приз!"
                            specificVariables={[
                                { name: 'Имя', value: '{user_name}' }
                            ]}
                            helpText="Этот комментарий оставляется под отзывом победителя, если не удалось отправить ему ЛС (закрыты сообщения)."
                        />
                    </div>

                    {/* Шаблон 4: Пост с итогами */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">4️⃣ Текст поста с итогами</h3>
                        <RichTemplateEditorMock
                            label="Публикация в сообществе"
                            value="🏆 Поздравляем победителей конкурса отзывов!\n\n{winners_list}\n\nСпасибо всем за участие! Следите за новыми конкурсами. ❤️"
                            specificVariables={[
                                { name: 'Список', value: '{winners_list}' }
                            ]}
                            helpText="Этот пост публикуется автоматически на стене сообщества при подведении итогов. Переменная {winners_list} подставит список победителей."
                        />
                        
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Совет:</strong> К посту можно добавить изображения через раздел "Медиавложения" ниже редактора. Они будут прикреплены к публикации автоматически.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ПРЕВЬЮ В РЕАЛЬНОМ ВРЕМЕНИ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Превью в реальном времени
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    В реальном приложении справа от настроек находится <strong>панель предпросмотра</strong>, где вы видите, как будут выглядеть все сообщения с подставленными переменными. Это помогает проверить корректность шаблонов до запуска конкурса.
                </p>

                <div className="not-prose mt-6">
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-purple-900 mb-3">👁️ Что показывается в превью</h3>
                        <ul className="space-y-2 text-sm text-purple-900">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span><strong>Пост участника</strong> с вашим комментарием-регистрацией</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span><strong>Пост с итогами</strong> на стене сообщества</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span><strong>Личное сообщение победителю</strong> с промокодом</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 mt-0.5">•</span>
                                <span><strong>Fallback комментарий</strong> на случай ошибки отправки</span>
                            </li>
                        </ul>
                        <div className="mt-4 p-3 bg-white rounded border border-purple-200">
                            <p className="text-xs text-gray-600">
                                Все переменные (например, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{number}'}</code>, <code className="bg-gray-100 px-1 py-0.5 rounded">{'{promo_code}'}</code>) заменяются реальными значениями из базы данных.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== СОВЕТЫ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Советы по настройке
                </h2>

                <div className="not-prose mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-yellow-900 mb-2">💡 Тестируйте шаблоны</h3>
                        <p className="text-sm text-yellow-800">
                            Перед запуском конкурса проверьте все шаблоны в превью. Убедитесь, что переменные подставляются корректно и тексты выглядят естественно.
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-blue-900 mb-2">🔄 Режим "Смешанный"</h3>
                        <p className="text-sm text-blue-800">
                            Используйте режим "День + Количество", если хотите проводить розыгрыши регулярно, но только при достаточном числе участников.
                        </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-green-900 mb-2">✅ Автобан победителей</h3>
                        <p className="text-sm text-green-800">
                            Включайте автоматический черный список на 7-30 дней, чтобы дать шанс другим пользователям выиграть. Это повышает доверие к конкурсу.
                        </p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
                        <h3 className="text-base font-bold text-purple-900 mb-2">📝 Ясные тексты</h3>
                        <p className="text-sm text-purple-800">
                            Пишите простые и понятные тексты в шаблонах. Избегайте двусмысленностей — участники должны четко понимать, что делать.
                        </p>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ===== ЗАКЛЮЧЕНИЕ ===== */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что дальше?
                </h2>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    После настройки всех параметров система готова к работе. Перейдите на вкладку <strong>"Посты"</strong>, чтобы запустить сбор участников и управлять конкурсом в режиме реального времени.
                </p>
            </section>

            {/* ===== НАВИГАЦИЯ ===== */}
            <NavigationButtons currentPath="2-4-2-2-settings" />
        </article>
    );
};
