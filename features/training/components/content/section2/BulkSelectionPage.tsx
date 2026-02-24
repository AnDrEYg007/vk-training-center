import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockBulkSelection } from './PostOperationsMocks';

// =====================================================================
// 2.1.8.6. Массовый выбор и удаление
// =====================================================================

export const BulkSelectionPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* ВВЕДЕНИЕ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Что это?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Массовый выбор позволяет выделить несколько постов сразу и удалить их одним действием. Раньше для удаления 10 постов приходилось кликать по каждому и подтверждать удаление — это занимало много времени. Теперь можно выбрать все нужные посты флажками и удалить одной кнопкой.
                </p>
            </section>

            <hr className="!my-10" />

            {/* КАК ВКЛЮЧИТЬ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Как войти в режим массового выбора?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В шапке календаря (над колонками дней) есть кнопка <strong>«Выбрать»</strong>. Нажмите её — календарь переключится в режим массового выбора.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    После включения режима:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Кнопка «Выбрать» меняет текст на <strong>«Отмена»</strong> и подсвечивается синим фоном</li>
                    <li>На всех карточках постов появляются флажки (квадратики для галочки)</li>
                    <li>Перетаскивание постов (drag-and-drop) временно заблокировано</li>
                    <li>Кнопка создания нового поста «+» заблокирована</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* КАК ВЫБИРАТЬ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Как выбрать посты?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    В режиме массового выбора кликайте по карточкам постов — они будут выделяться:
                </p>

                <Sandbox
                    title="✅ Интерактивная демонстрация массового выбора"
                    description="Включите режим и попробуйте выбрать несколько постов"
                    instructions={[
                        'Нажмите кнопку «Выбрать» справа',
                        'Кликайте по карточкам, чтобы выбрать их',
                        'Появится панель с действиями внизу'
                    ]}
                >
                    <MockBulkSelection />
                </Sandbox>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Визуальное выделение
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Выбранные карточки отличаются от обычных:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Синяя рамка</strong> вокруг карточки (класс <code>ring-2 ring-indigo-500</code>)</li>
                    <li><strong>Синий фон</strong> карточки (светло-синий)</li>
                    <li><strong>Галочка</strong> в флажке в правом верхнем углу</li>
                </ul>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Чтобы отменить выбор карточки, кликните по ней ещё раз — галочка исчезнет, рамка и фон вернутся к обычному виду.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ПАНЕЛЬ ДЕЙСТВИЙ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Панель массовых действий
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Как только вы выбрали хотя бы один пост, в нижней части календаря появляется серая панель с кнопками. Эта панель плавно выезжает снизу (анимация за 300 миллисекунд).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Что на панели?
                </h3>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Счётчик выбранных</strong> — «Выбрано: 3» (показывает количество отмеченных постов)</li>
                    <li><strong>Кнопка «Снять выделение»</strong> — убирает галочки со всех выбранных постов</li>
                    <li><strong>Кнопка «Удалить»</strong> (красная) — удаляет все выбранные посты после подтверждения</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* УДАЛЕНИЕ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Массовое удаление
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    После нажатия кнопки «Удалить» на панели появляется всплывающее окно подтверждения:
                </p>

                <div className="not-prose bg-white border border-gray-300 rounded-lg p-6 my-4 shadow-sm">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Подтвердите удаление</h3>
                    <p className="text-sm text-gray-700 mb-6">
                        Вы уверены, что хотите удалить 3 выбранных элемента? Это действие необратимо.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                            Отмена
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700">
                            Удалить
                        </button>
                    </div>
                </div>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Текст в окне динамический — подставляется количество выбранных элементов (постов или заметок).
                </p>

                <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                    Что происходит при удалении?
                </h3>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Система по очереди удаляет каждый выбранный пост. Процесс может занять несколько секунд, если выбрано много постов.
                </p>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    После завершения появляется уведомление с результатом:
                </p>
                <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
                    <p className="text-sm text-blue-700">
                        Успешно удалено: 3 элемента.<br />
                        Не удалось удалить: 0 элементов.
                    </p>
                </div>

                <p className="!text-base !leading-relaxed !text-gray-700">
                    Если какие-то посты не удалились (например, из-за ошибки VK API), система покажет количество неудачных попыток. Неудалённые посты останутся в календаре — можно попробовать удалить их по отдельности через кнопку «Удалить» на карточке.
                </p>
            </section>

            <hr className="!my-10" />

            {/* ВЫХОД ИЗ РЕЖИМА */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Как выйти из режима массового выбора?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Нажмите кнопку <strong>«Отмена»</strong> в шапке календаря (там, где была кнопка «Выбрать»). Режим выключится:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li>Флажки на карточках исчезнут</li>
                    <li>Выделение с карточек снимется</li>
                    <li>Панель массовых действий скроется</li>
                    <li>Перетаскивание постов снова станет доступным</li>
                    <li>Кнопка «+» для создания постов разблокируется</li>
                </ul>
            </section>

            <hr className="!my-10" />

            {/* ЗАЧЕМ ИСПОЛЬЗОВАТЬ */}
            <section>
                <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                    Когда полезен массовый выбор?
                </h2>
                <p className="!text-base !leading-relaxed !text-gray-700">
                    Режим массового выбора экономит время в нескольких ситуациях:
                </p>
                <ul className="!text-base !leading-relaxed !text-gray-700">
                    <li><strong>Очистка старого контента</strong> — быстро удалить все посты прошлого месяца</li>
                    <li><strong>Удаление ошибочно созданных постов</strong> — если случайно создали 10 одинаковых постов через массовое создание с неправильной датой</li>
                    <li><strong>Смена стратегии</strong> — удалить все посты текущей недели, чтобы заменить их новым контентом</li>
                    <li><strong>Работа с дублями</strong> — быстро убрать повторяющиеся посты</li>
                </ul>
            </section>

            <hr className="!my-10" />

            <NavigationButtons currentPath="2-1-8-6-bulk-selection" />
        </article>
    );
};
