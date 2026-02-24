import React from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';
import { NotePreviewDemo, MockNoteCard } from './NotesMocks';

// =====================================================================
// Просмотр и действия с заметками
// =====================================================================
export const ViewActions: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После создания заметки с ней можно выполнять различные действия: просматривать полный текст, копировать на другие дни, редактировать, удалять и перетаскивать. Все эти операции доступны прямо из календаря.
            </p>

            {/* Просмотр заметки */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Просмотр полного текста
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В календаре заметки отображаются в виде компактных карточек. Чтобы прочитать полный текст (особенно если он длинный), кликните по карточке — откроется окно просмотра.
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Элемент окна</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Что отображается</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Заголовок (цветной)</td>
                            <td className="border border-gray-300 px-4 py-2">Дата и время заметки, окрашен в цвет заметки</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Название (если есть)</td>
                            <td className="border border-gray-300 px-4 py-2">Жирным шрифтом в теле окна</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Текст</td>
                            <td className="border border-gray-300 px-4 py-2">Основное содержание, переносы строк сохранены</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Подвал</td>
                            <td className="border border-gray-300 px-4 py-2">Три кнопки действий</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Окно просмотра — это не только чтение. Из него можно сразу перейти к редактированию, копированию или удалению, не закрывая окно.
                </p>
            </div>

            {/* Интерактивная демонстрация */}
            <div className="not-prose">
                <Sandbox
                    title="Интерактивная демонстрация просмотра"
                    description="Кликните по заметке, чтобы открыть окно просмотра."
                    instructions={[
                        'Обратите внимание на цветной заголовок',
                        'Три кнопки внизу: Копировать, Редактировать, Удалить',
                        'Закрыть окно можно кликом по крестику или мимо окна'
                    ]}
                >
                    <NotePreviewDemo />
                </Sandbox>
            </div>

            {/* Три кнопки действий */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Три основных действия
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                На каждой карточке заметки справа есть три кнопки. Они также дублируются в подвале окна просмотра:
            </p>

            <div className="not-prose grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-blue-900 mb-2">📋 Копировать</h3>
                    <p className="text-sm text-blue-800 mb-2">
                        Создаёт дубликат заметки на <strong>следующий день</strong> с тем же временем.
                    </p>
                    <p className="text-xs text-blue-700">
                        Полезно для повторяющихся задач: «Проверить почту», «Позвонить клиенту».
                    </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-amber-900 mb-2">✏️ Редактировать</h3>
                    <p className="text-sm text-amber-800 mb-2">
                        Открывает форму, где можно изменить любое поле: дату, текст, цвет.
                    </p>
                    <p className="text-xs text-amber-700">
                        Подробнее в разделе <NavigationLink to="2-1-5-2-edit-note" title="Редактирование заметки" variant="related" />.
                    </p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-red-900 mb-2">🗑️ Удалить</h3>
                    <p className="text-sm text-red-800 mb-2">
                        Безвозвратно удаляет заметку после подтверждения.
                    </p>
                    <p className="text-xs text-red-700">
                        Система спросит: «Вы уверены?». Отменить удаление нельзя.
                    </p>
                </div>
            </div>

            {/* Копирование: детали */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                Копирование заметки: как это работает?
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы нажимаете «Копировать», система:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Создаёт точную копию заметки (название, текст, цвет)</li>
                <li>Переносит дату на <strong>+1 день</strong> (например, с 15.02 на 16.02)</li>
                <li>Оставляет время <strong>без изменений</strong> (если была 14:00, останется 14:00)</li>
                <li>Мгновенно отображает копию в календаре</li>
            </ol>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Если нужно скопировать заметку не на следующий день, а на конкретную дату (например, через неделю), используйте комбинацию: копирование → редактирование даты. Или сразу используйте drag & drop.
                </p>
            </div>

            {/* Удаление: детали */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                Удаление заметки: безопасность
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                При нажатии кнопки удаления система показывает всплывающее окно с вопросом: <em>«Удалить заметку?»</em>. У вас есть два варианта:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Да, удалить</strong> — заметка исчезает навсегда</li>
                <li><strong>Отмена</strong> — окно закрывается, заметка остаётся</li>
            </ul>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Удалённую заметку нельзя восстановить. Нет корзины, нет отмены. Удаление — окончательное.
                </p>
            </div>

            {/* Перетаскивание (Drag & Drop) */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Перетаскивание заметок (Drag & Drop)
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Самый быстрый способ перенести заметку на другой день — перетащить её мышкой. Это работает точно так же, как с постами.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                Как перетащить заметку?
            </h3>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Наведите курсор на карточку заметки</li>
                <li>Зажмите левую кнопку мыши и начните тащить</li>
                <li>Заметка «прилипнет» к курсору и станет полупрозрачной</li>
                <li>Наведите на нужный день в календаре (он подсветится)</li>
                <li>Отпустите кнопку мыши</li>
            </ol>

            <div className="not-prose bg-purple-50 border border-purple-200 rounded-lg p-4 my-6">
                <p className="text-sm text-purple-900">
                    <strong>🎯 Умное поведение:</strong> После отпускания мыши появляется всплывающее окно с двумя вариантами: «Переместить» или «Скопировать». Это позволяет гибко управлять заметками.
                </p>
            </div>

            {/* Всплывающее окно подтверждения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                Окно выбора: переместить или скопировать?
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы перетащили заметку на другой день, система не знает, хотите ли вы:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Переместить</strong> — удалить с текущего дня и создать на новом</li>
                <li><strong>Скопировать</strong> — оставить на текущем дне и создать дубликат на новом</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Поэтому появляется окно с двумя кнопками. Выберите нужное действие:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Действие</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Что происходит</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Когда использовать</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Переместить</td>
                            <td className="border border-gray-300 px-4 py-2">Заметка исчезает со старой даты, появляется на новой</td>
                            <td className="border border-gray-300 px-4 py-2">Планы изменились, задача переносится</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Скопировать</td>
                            <td className="border border-gray-300 px-4 py-2">Заметка остаётся на старой дате + создаётся копия на новой</td>
                            <td className="border border-gray-300 px-4 py-2">Задача повторяется несколько дней подряд</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Умная логика:</strong> При копировании через drag & drop дата меняется на ту, куда вы перетащили, а время остаётся прежним. Это позволяет быстро планировать повторяющиеся задачи.
                </p>
            </div>

            {/* Режимы отображения */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Режимы отображения: развёрнутый и свёрнутый
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Заметки в календаре могут отображаться в двух вариантах, которые переключаются кнопкой видимости в правой части шапки календаря:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Режим</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Что видно</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Когда удобно</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Развёрнутый</td>
                            <td className="border border-gray-300 px-4 py-2">Время, название, текст, 3 кнопки действий</td>
                            <td className="border border-gray-300 px-4 py-2">Работаете с заметками, нужен полный контекст</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Свёрнутый</td>
                            <td className="border border-gray-300 px-4 py-2">Только время и название (одна строка)</td>
                            <td className="border border-gray-300 px-4 py-2">Фокус на постах, заметки — для справки</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Скрытый</td>
                            <td className="border border-gray-300 px-4 py-2">Заметки не отображаются вообще</td>
                            <td className="border border-gray-300 px-4 py-2">Работаете только с постами</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose">
                <Sandbox
                    title="Сравнение режимов"
                    description="Посмотрите, как выглядит одна и та же заметка в двух режимах."
                    instructions={[
                        'Развёрнутый режим: полный текст + кнопки действий',
                        'Свёрнутый режим: компактная строка времени и названия',
                        'В свёрнутом режиме клик по заметке открывает окно просмотра'
                    ]}
                >
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Развёрнутый режим:</p>
                            <MockNoteCard
                                time="14:00"
                                title="Встреча с командой"
                                text="Обсудить новые идеи для контента и распределить задачи на следующую неделю"
                                color="#FEE2E2"
                            />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">Свёрнутый режим:</p>
                            <div className="bg-red-100 border-l-4 border-red-300 px-3 py-2 cursor-pointer hover:bg-red-200 transition">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600">14:00</span>
                                    <span className="text-gray-900 font-semibold">Встреча с командой</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Sandbox>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Подробнее о переключении режимов — в разделе <NavigationLink to="2-1-2-3-visibility-controls" title="Управление видимостью" variant="related" />.
            </p>

            {/* Массовое выделение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Массовое выделение
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Заметки поддерживают массовое выделение точно так же, как посты. Это позволяет:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Выделить несколько заметок сразу (Ctrl + клик или Shift + клик)</li>
                <li>Удалить выделенные одной кнопкой</li>
                <li>Перетащить выделенную группу на другой день</li>
            </ul>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Массовое выделение особенно полезно при планировании на неделю вперёд. Выделите все задачи одного типа и перетащите их на нужные дни.
                </p>
            </div>

            {/* FAQ */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли отменить удаление заметки?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Удаление безвозвратное. Если случайно удалили важную заметку, придётся создать заново.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли перетащить заметку в другой проект?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Заметки привязаны к проекту. Drag & Drop работает только внутри одного проекта между днями. Если нужна заметка в другом проекте — создайте новую вручную.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что происходит при копировании через кнопку vs через drag & drop?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Кнопка «Копировать» всегда создаёт копию на +1 день. Drag & Drop позволяет выбрать любой день, а затем решить: переместить или скопировать.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли выделить заметки и посты одновременно?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да! Массовое выделение работает для любых элементов календаря. Можете выделить 3 заметки и 2 поста, а затем удалить их все сразу.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Почему в свёрнутом режиме не видно кнопок действий?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Чтобы экономить место. В свёрнутом режиме цель — показать как можно больше элементов на экране. Действия доступны через окно просмотра (клик по заметке).
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Окно просмотра:</strong> клик по заметке открывает полный текст + 3 кнопки действий</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Копирование:</strong> кнопка создаёт дубликат на +1 день с тем же временем</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Drag & Drop:</strong> перетащите → выберите «переместить» или «скопировать»</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Удаление безвозвратно:</strong> система спрашивает подтверждение, но восстановить нельзя</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Два режима:</strong> развёрнутый (полный) и свёрнутый (компактный)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Массовое выделение:</strong> работает с заметками и постами одновременно</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-5-4-view-actions" />
        </article>
    );
};
