import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

/**
 * Обучающая страница: "2.4.1.2. Настройки автоматизации"
 * 
 * Детальное объяснение всех настроек автоматизации "Посты в истории":
 * переключатель, режимы отбора, ключевые слова, таблица истории.
 */

// =====================================================================
// Mock-компоненты (переиспользуем из родительской страницы)
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
const MockPostRow: React.FC<{ 
    text: string; 
    date: string; 
    status: string; 
    statusColor: string;
    showButton?: boolean;
}> = ({ text, date, status, statusColor, showButton = true }) => {
    return (
        <tr className="hover:bg-gray-50/80 transition-colors">
            <td className="px-6 py-4 align-top">
                <div className="w-12 h-12 bg-gray-100 rounded-lg border text-[10px] flex items-center justify-center text-gray-400">
                    IMG
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
                {showButton && (
                    <button className="mt-2 px-2 py-1 text-xs rounded text-white bg-indigo-600 hover:bg-indigo-700 block">
                        Опубликовать
                    </button>
                )}
            </td>
        </tr>
    );
};

// =====================================================================
// Основной компонент страницы
// =====================================================================
export const ProductsStoriesSettingsPage: React.FC<ContentProps> = ({ title }) => {
    const [demoActive, setDemoActive] = useState(false);
    const [demoMode, setDemoMode] = useState<'keywords' | 'all'>('keywords');
    const [demoKeywords, setDemoKeywords] = useState('');

    return (
        <article className="prose max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                На этой странице находятся все элементы управления автоматизацией "Посты в истории". 
                Разберём каждый элемент подробно: что он делает, как его использовать и какие есть особенности.
            </p>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Блок "Настройки фильтрации"</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый важный блок на странице — "Настройки фильтрации". Здесь находится переключатель активации 
                и все параметры отбора постов.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Переключатель активации</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Где находится:</strong> В правой части блока "Настройки фильтрации", напротив текста "Статус автоматизации".
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Как выглядит:</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Выключен:</strong> серый прямоугольник с белым кружком слева</li>
                <li><strong>Включён:</strong> синий прямоугольник (indigo-600) с белым кружком справа</li>
                <li>При переключении кружок плавно перемещается влево/вправо</li>
            </ul>

            <Sandbox 
                title="Попробуйте переключатель"
                description="Нажмите на переключатель чтобы увидеть как он работает. Обратите внимание на плавное движение кружка и изменение цвета."
                instructions={[
                    'Кликните на <strong>переключатель</strong> справа',
                    'Серый цвет изменится на синий, кружок переместится вправо',
                    'Кликните ещё раз — вернётся в исходное состояние'
                ]}
            >
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between">
                        <div className="max-w-2xl">
                            <label className="text-sm font-medium text-gray-900 mb-1 block">Статус автоматизации</label>
                            <p className="text-sm text-gray-500">
                                Когда включено, система каждые 10 минут проверяет новые посты
                            </p>
                        </div>
                        <MockToggleSwitch isActive={demoActive} onToggle={() => setDemoActive(!demoActive)} />
                    </div>
                </div>
            </Sandbox>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> Переключатель только меняет настройку локально. 
                        Чтобы изменения применились на сервере, обязательно нажмите кнопку "Сохранить изменения" 
                        в правом верхнем углу страницы!
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Режимы отбора постов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда переключатель активации включён, появляется дополнительный блок с настройками. 
                Первое, что там есть — выбор режима отбора постов.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Два режима работы:</strong>
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>"По ключевым словам"</strong> — система проверяет текст каждого нового поста. 
                    Если в тексте есть хотя бы одно из указанных ключевых слов, пост публикуется в истории.
                </li>
                <li>
                    <strong>"Все посты подряд"</strong> — абсолютно каждый новый пост автоматически дублируется в истории. 
                    Фильтрация отключена.
                </li>
            </ol>

            <Sandbox 
                title="Выбор режима работы"
                description="Попробуйте переключить режимы. Обратите внимание как меняется содержимое блока ниже."
                instructions={[
                    'Сначала <strong>включите переключатель</strong> выше (если он серый)',
                    'Появится блок с настройками (голубой фон)',
                    'Выберите один из двух режимов с помощью радио-кнопок',
                    'Содержимое блока изменится в зависимости от выбора'
                ]}
            >
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                        <div className="max-w-2xl">
                            <label className="text-sm font-medium text-gray-900 mb-1 block">Статус автоматизации</label>
                            <p className="text-sm text-gray-500">
                                Когда включено, система каждые 10 минут проверяет новые посты
                            </p>
                        </div>
                        <MockToggleSwitch isActive={demoActive} onToggle={() => setDemoActive(!demoActive)} />
                    </div>

                    {demoActive && (
                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Режим отбора постов
                                </label>
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
                                    <div className="mt-4">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">
                                            Введите ключевые слова
                                        </label>
                                        <MockKeywordInput value={demoKeywords} onChange={setDemoKeywords} />
                                        <p className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Регистр не важен. Разделяйте слова запятой.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-4 p-3 bg-blue-100/50 text-blue-800 text-sm rounded-lg border border-blue-200 flex gap-2">
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
                        </div>
                    )}
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Поле ввода ключевых слов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если выбран режим "По ключевым словам", появляется поле ввода с иконкой хештега (#) слева.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Правила заполнения:</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Введите одно или несколько ключевых слов</li>
                <li>Разделяйте слова запятой: <code>#вистории, #repost, #важное</code></li>
                <li>Регистр не важен: <code>#ВАЖНОЕ</code> и <code>#важное</code> — одно и то же</li>
                <li>Система ищет вхождение в текст поста, не обязательно точное совпадение</li>
            </ul>

            <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <p className="text-sm text-blue-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Совет:</strong> Используйте хештеги, которые SMM-специалисты добавляют к важным постам. 
                        Например, создайте правило: все посты с хештегом <code>#вистории</code> автоматически попадают в истории. 
                        Так специалисты сами контролируют что публикуется.
                    </span>
                </p>
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Таблица "История обработки"</h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Под блоком настроек находится таблица "История обработки" — список всех постов, 
                которые система проверила на соответствие условиям.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Структура таблицы</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Таблица состоит из 4 колонок:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>Превью</strong> — миниатюра первого изображения из поста (12x12 пикселей). 
                    Если изображения нет, показывается серая плашка "NO IMG".
                </li>
                <li>
                    <strong>Содержание</strong> — текст поста (максимум 3 строки, остальное обрезается).
                </li>
                <li>
                    <strong>Дата</strong> — дата и время публикации поста. Внизу есть ссылка "ВКонтакте" для перехода к оригинальному посту.
                </li>
                <li>
                    <strong>Статус</strong> — цветной бейдж с текущим статусом поста и кнопка "Опубликовать" для ручной публикации.
                </li>
            </ol>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Статусы постов</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Каждый пост в таблице имеет один из пяти статусов:
            </p>

            <div className="not-prose my-6">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Внешний вид</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Когда показывается</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        <tr>
                            <td className="px-4 py-3 text-sm font-medium">Опубликовано</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full border bg-green-50 text-green-600 border-green-200">
                                    Опубликовано
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Пост уже опубликован в истории (вручную или автоматически)
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-sm font-medium">Подходит по условиям</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full border bg-amber-50 text-amber-600 border-amber-200">
                                    Подходит по условиям
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Пост содержит ключевое слово и младше 24 часов — будет опубликован автоматически
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-sm font-medium">Пропущен (старый)</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                                    Пропущен (старый)
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Пост подходит по ключевым словам, но старше 24 часов — система его пропустила
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-sm font-medium">Не подходит</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-50 text-gray-400 border-gray-200">
                                    Не подходит
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                В тексте поста нет ни одного из указанных ключевых слов
                            </td>
                        </tr>
                        <tr>
                            <td className="px-4 py-3 text-sm font-medium">Нет условий</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 text-xs rounded-full border bg-gray-50 text-gray-500 border-gray-200">
                                    Нет условий
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                                Поле ключевых слов пустое — система не знает что искать
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Кнопка "Опубликовать"</h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В колонке "Статус" под бейджем находится синяя кнопка "Опубликовать". 
                Она позволяет опубликовать любой пост в истории вручную, минуя автоматическую проверку.
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                <strong>Когда это нужно:</strong>
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Срочно нужно опубликовать важный пост, не дожидаясь автоматической проверки (которая происходит раз в 10 минут)</li>
                <li>Пост не подходит по ключевым словам, но вы хотите его опубликовать</li>
                <li>Автоматизация выключена, но нужно вручную добавить пост в истории</li>
            </ul>

            <Sandbox 
                title="Пример таблицы постов"
                description="Таблица с примерами постов в разных статусах. Обратите внимание на цвета бейджей и кнопку 'Опубликовать'."
            >
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="text-base font-semibold text-gray-900">
                            История обработки <span className="text-gray-400 font-normal ml-1">3 поста</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left w-20">Превью</th>
                                    <th className="px-6 py-3 text-left">Содержание</th>
                                    <th className="px-6 py-3 text-left w-48">Дата</th>
                                    <th className="px-6 py-3 text-left w-64">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <MockPostRow 
                                    text="Новая коллекция весна-лето 2026! #вистории #новинки Скидка 20% на все позиции до конца недели"
                                    date="17.02.2026"
                                    status="Подходит по условиям"
                                    statusColor="bg-amber-50 text-amber-600 border-amber-200"
                                />
                                <MockPostRow 
                                    text="Обзор трендов сезона: что будет модно этой весной? Читайте в нашем блоге"
                                    date="16.02.2026"
                                    status="Не подходит"
                                    statusColor="bg-gray-50 text-gray-400 border-gray-200"
                                />
                                <MockPostRow 
                                    text="Акция выходного дня! #вистории Только сегодня и завтра — бесплатная доставка"
                                    date="15.02.2026"
                                    status="Опубликовано"
                                    statusColor="bg-green-50 text-green-600 border-green-200"
                                    showButton={false}
                                />
                            </tbody>
                        </table>
                    </div>
                </div>
            </Sandbox>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Особенности таблицы</h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>
                    <strong>При наведении курсора на превью</strong> изображение увеличивается в 2.5 раза 
                    и показывается поверх страницы (hover-превью). Это помогает быстро оценить качество изображения.
                </li>
                <li>
                    <strong>Строки подсвечиваются</strong> при наведении курсора (светло-серый фон) 
                    для удобства чтения.
                </li>
                <li>
                    <strong>Таблица загружает посты порциями</strong> по 50 штук. При прокрутке вниз 
                    автоматически подгружаются следующие 50 постов.
                </li>
                <li>
                    <strong>Посты отсортированы по дате</strong> — самые свежие вверху.
                </li>
            </ul>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работать с настройками</h2>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 1: Первый запуск автоматизации</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Откройте страницу "Настройки и История"</li>
                <li>Убедитесь, что переключатель выключен (серый цвет)</li>
                <li>Выберите режим "По ключевым словам"</li>
                <li>Введите ключевые слова через запятую: <code>#вистории, #важное, #срочно</code></li>
                <li>Включите переключатель (станет синим)</li>
                <li>Нажмите "Сохранить изменения" в правом верхнем углу</li>
                <li>Готово! Система начнёт проверять новые посты каждые 10 минут</li>
            </ol>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 2: Изменение ключевых слов</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Найдите поле ввода с текущими ключевыми словами</li>
                <li>Измените текст: добавьте новые слова или удалите старые</li>
                <li>Нажмите "Сохранить изменения"</li>
                <li>Новые условия применятся к следующей проверке (через 10 минут максимум)</li>
            </ol>

            <div className="not-prose bg-amber-50 border border-amber-200 rounded-lg p-4 my-6">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>
                        <strong>Важно:</strong> Изменение ключевых слов не влияет на уже опубликованные истории. 
                        Новые условия применяются только к постам, которые появятся после сохранения настроек.
                    </span>
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Сценарий 3: Срочная ручная публикация</h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Найдите нужный пост в таблице "История обработки"</li>
                <li>Нажмите кнопку "Опубликовать" в колонке "Статус"</li>
                <li>Кнопка изменит текст на "..." (индикатор загрузки)</li>
                <li>Через 2-3 секунды пост появится в историях сообщества</li>
                <li>Статус поста изменится на "Опубликовано" (зелёный бейдж)</li>
            </ol>

            <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-4 my-6">
                <p className="text-sm text-green-800 flex items-start gap-2">
                    <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Совет:</strong> Используйте ручную публикацию для важных анонсов и акций, 
                        которые нужно опубликовать немедленно. Не нужно ждать автоматической проверки — 
                        кнопка "Опубликовать" сработает мгновенно.
                    </span>
                </p>
            </div>

            <NavigationButtons currentPath="2-4-1-2-settings" />
        </article>
    );
};
