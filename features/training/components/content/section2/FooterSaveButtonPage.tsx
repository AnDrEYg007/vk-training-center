import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
// import { MockFooterStates, MockFooterVariants } from './FooterSaveButtonMocks';

// =====================================================================
// Inline mock-компоненты (временно встроены в файл)
// =====================================================================

const MockFooterStatesInline: React.FC = () => {
    const [state, setState] = React.useState<'normal' | 'empty' | 'saving'>('normal');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2">
                <button
                    onClick={() => setState('normal')}
                    className={`px-4 py-2 rounded ${
                        state === 'normal'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Обычное состояние
                </button>
                <button
                    onClick={() => setState('empty')}
                    className={`px-4 py-2 rounded ${
                        state === 'empty'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Поле пустое
                </button>
                <button
                    onClick={() => setState('saving')}
                    className={`px-4 py-2 rounded ${
                        state === 'saving'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Идёт сохранение
                </button>
            </div>

            <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                <div className="p-4 border-b">
                    <input
                        type="text"
                        placeholder="Название альбома"
                        value={state === 'empty' ? '' : 'Мой альбом'}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                        readOnly
                    />
                </div>

                <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
                    <button
                        disabled={state === 'saving'}
                        className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Отмена
                    </button>
                    <button
                        disabled={state === 'empty' || state === 'saving'}
                        className={`w-28 px-4 py-2 rounded flex justify-center items-center ${
                            state === 'empty' || state === 'saving'
                                ? 'bg-gray-400 text-white cursor-not-allowed'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        {state === 'saving' ? (
                            <div className="loader border-white border-t-transparent h-4 w-4" style={{
                                borderRadius: '50%',
                                border: '2px solid',
                                animation: 'spin 0.6s linear infinite'
                            }}></div>
                        ) : (
                            'Сохранить'
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
};

const MockFooterVariantsInline: React.FC = () => {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                    Стандартный футер (justify-end)
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
                            Отмена
                        </button>
                        <button className="w-28 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                            Сохранить
                        </button>
                    </footer>
                </div>
            </div>

            <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                    Футер поста (justify-between)
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <footer className="p-4 border-t flex justify-between items-center bg-gray-50">
                        <button className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
                            Удалить
                        </button>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300">
                                Отмена
                            </button>
                            <button className="w-28 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                                Сохранить
                            </button>
                        </div>
                    </footer>
                </div>
            </div>

            <div>
                <div className="text-sm font-semibold text-gray-700 mb-2">
                    Футер с одной кнопкой
                </div>
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                        <button className="w-28 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">
                            Готово
                        </button>
                    </footer>
                </div>
            </div>
        </div>
    );
};

// =====================================================================
// Футер и кнопка сохранения
// =====================================================================

export const FooterSaveButtonPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <article className="prose prose-slate max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ============================================= */}
            {/* 1. ВВЕДЕНИЕ */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Зачем нужен футер в модальных окнах?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Футер (нижняя часть всплывающего окна) — это место, где находятся главные кнопки действий: <strong>«Сохранить»</strong>, <strong>«Создать»</strong>, <strong>«Отмена»</strong>. Он всегда на виду, даже когда форма длинная и нужно прокручивать содержимое окна.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Почему именно внизу?</strong> Потому что при заполнении формы взгляд движется сверху вниз — прочитали заголовок, заполнили поля, и вот внизу кнопки для завершения действия. Это естественный порядок работы.
                </p>

                <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-4 rounded-md my-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="font-semibold text-indigo-900 text-sm">Единообразие интерфейса</p>
                            <p className="text-sm text-indigo-800 mt-1">
                                Во всех модальных окнах приложения футер выглядит одинаково — светло-серый фон, кнопки справа, отступы и цвета стандартные. Это помогает быстро ориентироваться: пользователь всегда знает, где искать кнопку сохранения.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 2. СТРУКТУРА ФУТЕРА */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Как устроен футер
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Футер — это HTML-элемент <code>&lt;footer&gt;</code> с фиксированным набором стилей. Вот как он выглядит в коде:
                </p>

                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`<footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 flex-shrink-0">
    <button className="...">Отмена</button>
    <button className="...">Сохранить</button>
</footer>`}
                    </pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Разбор классов
                </h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>p-4</code> — внутренние отступы 16px со всех сторон</li>
                    <li><code>border-t</code> — тонкая верхняя граница, отделяющая футер от содержимого</li>
                    <li><code>flex justify-end gap-3</code> — кнопки выровнены справа, между ними отступ 12px</li>
                    <li><code>bg-gray-50</code> — светло-серый фон (отличается от белого фона основного содержимого)</li>
                    <li><code>flex-shrink-0</code> — футер никогда не сжимается, даже если содержимое окна слишком большое</li>
                </ul>

                <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                    <strong>Важный момент:</strong> класс <code>flex-shrink-0</code> гарантирует, что футер всегда останется на экране с полной высотой, даже если форма внутри окна очень длинная. Это означает, что кнопки «Отмена» и «Сохранить» никогда не "схлопнутся" и не исчезнут.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 3. КНОПКА "ОТМЕНА" */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Кнопка «Отмена»
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Кнопка «Отмена» — это вторичная кнопка, которая закрывает всплывающее окно без сохранения изменений. Она всегда серая, чтобы визуально отличаться от главной зелёной кнопки.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Внешний вид
                </h3>
                <div className="not-prose my-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-600">Обычное состояние:</span>
                        <button 
                            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300"
                        >
                            Отмена
                        </button>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Технические детали
                </h3>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`<button 
    onClick={onClose} 
    disabled={isSaving}
    className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
>
    Отмена
</button>`}
                    </pre>
                </div>

                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>bg-gray-200</code> — серый фон в обычном состоянии</li>
                    <li><code>hover:bg-gray-300</code> — становится темнее при наведении курсора</li>
                    <li><code>disabled:opacity-50</code> — становится полупрозрачной, если идёт сохранение</li>
                    <li><code>px-4 py-2</code> — отступы 16px по горизонтали, 8px по вертикали</li>
                    <li><code>text-sm font-medium</code> — размер текста 14px, средняя жирность</li>
                </ul>

                <p className="!text-base !leading-relaxed !text-gray-700 !mt-4">
                    <strong>Когда кнопка заблокирована:</strong> Пока идёт сохранение (например, создаётся новый альбом или товар), кнопка «Отмена» становится полупрозрачной (<code>opacity: 0.5</code>) и не реагирует на клики. Это предотвращает случайное закрытие окна во время отправки данных на сервер.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 4. КНОПКА "СОХРАНИТЬ" */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Кнопка «Сохранить» / «Создать»
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Это главная кнопка действия — зелёная, яркая, привлекает внимание. В зависимости от контекста на ней может быть написано <strong>«Сохранить»</strong> (при редактировании), <strong>«Создать»</strong> (при создании нового элемента) или <strong>«Применить»</strong> (при массовом изменении).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Внешний вид
                </h3>
                <div className="not-prose my-6 space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-600">Активна:</span>
                        <button 
                            className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 w-28 flex justify-center items-center"
                        >
                            Сохранить
                        </button>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-600">Заблокирована:</span>
                        <button 
                            disabled
                            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-400 text-white w-28 flex justify-center items-center cursor-not-allowed"
                        >
                            Сохранить
                        </button>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Технические детали
                </h3>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`<button
    onClick={handleSave}
    disabled={isSaving || !title.trim()}
    className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 w-28 flex justify-center items-center"
>
    {isSaving ? <div className="loader border-white border-t-transparent h-4 w-4"></div> : 'Создать'}
</button>`}
                    </pre>
                </div>

                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>bg-green-600</code> — зелёный фон (цвет основного действия в приложении)</li>
                    <li><code>hover:bg-green-700</code> — становится темнее при наведении курсора</li>
                    <li><code>disabled:bg-gray-400</code> — серый фон, если кнопка заблокирована</li>
                    <li><code>w-28</code> — фиксированная ширина 112px (7rem)</li>
                    <li><code>flex justify-center items-center</code> — содержимое выровнено по центру (важно для индикатора загрузки)</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Зачем фиксированная ширина?
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Когда начинается сохранение, текст «Создать» заменяется на крутящийся индикатор загрузки. Если бы ширина кнопки была автоматической, она бы "сжалась" (индикатор уже, чем текст), и футер визуально "дёрнулся" бы. Фиксированная ширина (<code>w-28</code>) решает эту проблему — кнопка остаётся неподвижной.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 5. ИНДИКАТОР ЗАГРУЗКИ */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Индикатор загрузки (крутящийся спиннер)
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Когда вы нажимаете «Сохранить» или «Создать», данные отправляются на сервер. Пока идёт отправка (обычно 0.5–2 секунды), текст кнопки заменяется на крутящийся спиннер — белый кружок с анимацией вращения.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Как это выглядит
                </h3>
                <div className="not-prose my-6">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                        <span className="text-sm text-gray-600">Сохранение:</span>
                        <button 
                            className="px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white w-28 flex justify-center items-center"
                        >
                            <div className="loader border-white border-t-transparent h-4 w-4"></div>
                        </button>
                    </div>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Код спиннера
                </h3>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`{isSaving ? (
    <div className="loader border-white border-t-transparent h-4 w-4"></div>
) : (
    'Создать'
)}`}
                    </pre>
                </div>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    <strong>Что означают классы:</strong>
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>loader</code> — глобальный CSS-класс с анимацией вращения (определён в <code>index.css</code>)</li>
                    <li><code>border-white</code> — белая рамка вокруг круга (хорошо видна на зелёной кнопке)</li>
                    <li><code>border-t-transparent</code> — верхняя часть рамки прозрачная (создаёт эффект "незавершённого круга")</li>
                    <li><code>h-4 w-4</code> — размер 16×16 пикселей</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    CSS-анимация
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Анимация вращения определена глобально в файле стилей:
                </p>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`.loader {
    border-radius: 50%;
    border: 2px solid;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}`}
                    </pre>
                </div>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Спиннер делает полный оборот за 0.6 секунды и повторяет анимацию бесконечно, пока <code>isSaving</code> равен <code>true</code>.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 6. СОСТОЯНИЯ БЛОКИРОВКИ */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Когда кнопки блокируются
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Кнопки в футере могут быть заблокированы (<code>disabled</code>) в нескольких ситуациях. Заблокированная кнопка не реагирует на клики и визуально отличается от активной.
                </p>

                <Sandbox
                    title="🔒 Интерактивная демонстрация блокировки"
                    description="Посмотрите, как меняется футер в зависимости от состояния формы."
                    instructions={[
                        '<strong>Состояние 1:</strong> Обычное — кнопки активны',
                        '<strong>Состояние 2:</strong> Поле пустое — кнопка "Сохранить" серая',
                        '<strong>Состояние 3:</strong> Идёт сохранение — обе кнопки частично заблокированы'
                    ]}
                >
                    <div className="flex flex-col gap-4">
                        <div className="text-sm text-gray-600 mb-2">
                            Кликайте по кнопкам, чтобы переключать состояния:
                        </div>
                        <MockFooterStatesInline />
                    </div>
                </Sandbox>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Условия блокировки
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В реальном коде кнопка «Сохранить» блокируется, если:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Идёт сохранение</strong> (<code>isSaving === true</code>)</li>
                    <li><strong>Поле пустое</strong> (<code>!title.trim()</code>) — нельзя сохранить пустое название</li>
                    <li><strong>Данные не изменились</strong> (<code>!isDirty</code>) — в некоторых окнах (например, настройки проекта)</li>
                    <li><strong>Работает AI</strong> (<code>isAiRunning</code>) — в окнах с AI-генерацией</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Примеры из реального кода
                </h3>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`// CreateAlbumModal.tsx (строка 64)
disabled={isSaving || !title.trim()}

// NoteModal.tsx (строка 115)
disabled={isSaving || !text.trim()}

// ProjectSettingsModal.tsx (строка 227)
disabled={isSaving || isAiRunning || !isDirty}`}
                    </pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Визуальные изменения при блокировке
                </h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Цвет кнопки:</strong> <code>bg-green-600</code> → <code>bg-gray-400</code> (зелёная становится серой)</li>
                    <li><strong>Прозрачность кнопки "Отмена":</strong> <code>opacity: 1</code> → <code>opacity: 0.5</code></li>
                    <li><strong>Курсор:</strong> обычный → <code>cursor-not-allowed</code> (перечёркнутый круг) или <code>cursor-wait</code> (песочные часы)</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 7. ВАРИАНТЫ ФУТЕРА */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Альтернативные варианты футера
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Хотя большинство футеров выглядят одинаково (кнопки справа), есть несколько исключений, когда структура отличается.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Футер с кнопками слева и справа
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В окне редактирования поста (PostModalFooter) используется футер с <code>justify-between</code> вместо <code>justify-end</code>. Это означает, что кнопки распределены по краям — слева кнопка «Удалить», справа «Сохранить» и «Опубликовать сейчас».
                </p>

                <Sandbox
                    title="📐 Варианты расположения кнопок"
                    description="Сравните стандартный футер и футер с распределёнными кнопками."
                >
                    <MockFooterVariantsInline />
                </Sandbox>

                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`// Стандартный футер (кнопки справа)
<footer className="... flex justify-end gap-3 ...">

// Футер поста (кнопки по краям)
<footer className="... flex justify-between items-center ...">`}
                    </pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Футер с одной кнопкой
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В модальных окнах просмотра (например, результаты сохранения, предпросмотр конкурса) есть только одна кнопка «Закрыть» — действие уже завершено, менять ничего не нужно, только посмотреть информацию и закрыть окно.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Цвет фона футера
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В большинстве окон используется <code>bg-gray-50</code> (очень светло-серый), но в некоторых окнах товаров применяется <code>bg-white</code> (белый). Это сделано для визуального единообразия с остальным интерфейсом модалки.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* 8. ТЕХНИЧЕСКИЕ ДЕТАЛИ */}
            {/* ============================================= */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Технические детали и лучшие практики
                </h2>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Порядок кнопок
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В приложении соблюдается единый порядок: <strong>сначала вторичная кнопка (слева), потом главная (справа)</strong>. Это соответствует дизайн-паттернам Windows, macOS и веб-приложений — главная кнопка всегда ближе к правому краю.
                </p>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`<footer>
    <button>Отмена</button>     {/* Вторичная — слева */}
    <button>Сохранить</button>  {/* Главная — справа */}
</footer>`}
                    </pre>
                </div>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Клавиша Enter для быстрого сохранения
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Во многих формах (создание альбома, заметка) можно нажать <strong>Enter</strong> в поле ввода, чтобы мгновенно сохранить. Это работает через обработчик <code>onKeyDown</code> на поле:
                </p>
                <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-4 my-4">
                    <pre className="text-xs overflow-x-auto">
{`<input
    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
    ...
/>`}
                    </pre>
                </div>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Валидация выполняется точно так же, как при клике на кнопку — если поле пустое, появится ошибка.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Типы кнопок действий
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В разных окнах кнопка главного действия может иметь разные цвета:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Зелёная</strong> (<code>bg-green-600</code>) — создание, сохранение, подтверждение</li>
                    <li><strong>Синяя</strong> (<code>bg-indigo-600</code>) — применение изменений, редактирование</li>
                    <li><strong>Красная</strong> (<code>bg-red-600</code>) — удаление, опасные действия (используется в ConfirmationModal)</li>
                </ul>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Динамический текст кнопки
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В окне поста текст кнопки меняется в зависимости от выбранного способа публикации:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><code>publicationMethod === 'now'</code> → «Опубликовать»</li>
                    <li><code>publicationMethod === 'vk'</code> → «В отложку VK»</li>
                    <li><code>publicationMethod === 'system'</code> → «Запланировать»</li>
                </ul>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если создаётся несколько постов одновременно, к тексту добавляется счётчик: <strong>«Запланировать (5)»</strong>.
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Компонент ConfirmationModal
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В приложении есть готовый компонент <code>ConfirmationModal</code> из <code>shared/components/modals/</code>, который используется для подтверждения опасных действий (удаление, закрытие без сохранения). У него тоже есть футер с кнопками, но структура упрощённая — нет тега <code>&lt;footer&gt;</code>, только <code>&lt;div&gt;</code> с классами <code>flex justify-end gap-3</code>.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ============================================= */}
            {/* НАВИГАЦИЯ */}
            {/* ============================================= */}
            <NavigationButtons currentPath="2-1-7-12-footer-save-button" />
        </article>
        </>
    );
};
