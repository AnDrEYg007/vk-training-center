import React from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';
import { NoteFormDemo } from './NotesMocks';

// =====================================================================
// Редактирование заметки
// =====================================================================
export const EditNote: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После создания заметки вы можете изменить любое её поле: дату, время, название, текст или цвет. Редактирование доступно через два интерфейса: прямо из карточки заметки или через окно просмотра.
            </p>

            {/* Два способа открыть редактирование */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как открыть редактирование?
            </h2>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Способ</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Действие</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Когда удобно</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Кнопка карандаш ✏️</td>
                            <td className="border border-gray-300 px-4 py-2">Клик по средней кнопке на карточке заметки</td>
                            <td className="border border-gray-300 px-4 py-2">Быстрое редактирование без лишних кликов</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Через окно просмотра</td>
                            <td className="border border-gray-300 px-4 py-2">Клик по заметке → в окне нажать «Редактировать»</td>
                            <td className="border border-gray-300 px-4 py-2">Если сначала нужно прочитать полный текст</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Оба способа открывают одну и ту же форму редактирования — с теми же полями, что и при создании. Все поля предзаполнены текущими значениями заметки.
                </p>
            </div>

            {/* Что можно изменить */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что можно изменить?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Редактирование позволяет изменить абсолютно всё:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-green-900 mb-2">📅 Дата и время</h3>
                    <p className="text-sm text-green-800">
                        Перенесите заметку на другой день или измените время. Полезно, если планы изменились.
                    </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-amber-900 mb-2">📝 Название</h3>
                    <p className="text-sm text-amber-800">
                        Добавьте название к заметке без него, или измените существующее. Можно полностью удалить.
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-blue-900 mb-2">✍️ Текст</h3>
                    <p className="text-sm text-blue-800">
                        Исправьте опечатки, дополните информацию или полностью перепишите содержание.
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-purple-900 mb-2">🎨 Цвет</h3>
                    <p className="text-sm text-purple-800">
                        Поменяйте цвет для визуальной группировки. Например, задача стала срочной — сделайте красной.
                    </p>
                </div>
            </div>

            {/* Форма редактирования */}
            <div className="not-prose">
                <Sandbox
                    title="Интерактивная форма редактирования"
                    description="Откройте форму и посмотрите, как она выглядит. Все поля можно изменить."
                    instructions={[
                        'При редактировании все поля предзаполнены текущими значениями',
                        'Текст остаётся обязательным — нельзя сохранить пустую заметку',
                        'Можно изменить только один параметр, остальные оставить как есть'
                    ]}
                >
                    <NoteFormDemo />
                </Sandbox>
            </div>

            {/* Валидация при редактировании */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Проверка при сохранении
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Правила те же, что и при создании: текст заметки не может быть пустым. Если удалить весь текст, кнопка «Сохранить» станет неактивной.
            </p>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Нельзя «очистить» заметку, оставив только дату или название. Если текст больше не нужен — удалите заметку целиком.
                </p>
            </div>

            {/* Сохранение изменений */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что происходит после сохранения?
            </h2>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li>Форма закрывается</li>
                <li>Заметка обновляется в календаре</li>
                <li>Если изменили дату или время — заметка переместится на новое место в хронологическом списке</li>
                <li>Если изменили цвет — фон карточки мгновенно обновится</li>
            </ol>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Успешное сохранение:</strong> Появляется уведомление «Заметка обновлена» в правом нижнем углу.
                </p>
            </div>

            {/* Отмена изменений */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как отменить изменения?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если вы передумали редактировать заметку, просто закройте форму:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Кликните по крестику ✕ в правом верхнем углу</li>
                <li>Нажмите клавишу Escape</li>
                <li>Кликните мимо окна формы (на затемнённый фон)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Все изменения, которые вы внесли, но не сохранили, будут потеряны. Заметка останется в том виде, в каком была до открытия редактирования.
            </p>

            {/* Альтернативы редактированию */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Альтернативные способы изменения
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Иногда быстрее создать новую заметку, чем редактировать старую:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Ситуация</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Что лучше?</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Почему?</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Нужно повторить задачу на следующий день</td>
                            <td className="border border-gray-300 px-4 py-2">Копирование</td>
                            <td className="border border-gray-300 px-4 py-2">Кнопка «Копировать» автоматически создаёт дубликат на +1 день</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Опечатка в одном слове</td>
                            <td className="border border-gray-300 px-4 py-2">Редактирование</td>
                            <td className="border border-gray-300 px-4 py-2">Быстрее исправить, чем создавать заново</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Заметка полностью устарела</td>
                            <td className="border border-gray-300 px-4 py-2">Удаление</td>
                            <td className="border border-gray-300 px-4 py-2">Не засоряйте календарь ненужными записями</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Перенести задачу через неделю</td>
                            <td className="border border-gray-300 px-4 py-2">Drag & Drop</td>
                            <td className="border border-gray-300 px-4 py-2">Перетащите заметку на нужный день — не нужно открывать форму</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Подробнее о копировании, удалении и перетаскивании — в разделе <NavigationLink to="2-1-5-4-view-actions" title="Просмотр и действия" variant="related" />.
            </p>

            {/* FAQ */}
            <hr className="!my-10" />
            
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Сохраняется ли история изменений?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Когда вы сохраняете изменения, старая версия заметки перезаписывается. Нельзя откатиться к предыдущему варианту текста.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли редактировать несколько заметок одновременно?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Форма открывается только для одной заметки. Если нужно изменить цвет у 10 заметок, придётся открыть каждую по очереди.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что будет, если изменить дату на ту, где уже есть заметки?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Ничего страшного. Заметка просто встанет в хронологический порядок по времени. Система не ограничивает количество заметок на один день.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли удалить название, оставив только текст?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да. Очистите поле названия — заметка сохранится только с текстом. Название необязательно.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Есть ли горячие клавиши для редактирования?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет специальных горячих клавиш. Но вы можете открыть форму кликом по карандашу, затем Tab для перехода между полями, Enter для сохранения.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Два способа:</strong> кнопка ✏️ на карточке или через окно просмотра</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Можно изменить всё:</strong> дату, время, название, текст, цвет</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Текст обязателен:</strong> нельзя сохранить заметку с пустым текстом</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Нет истории:</strong> старая версия перезаписывается, откатиться нельзя</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Альтернативы:</strong> копирование, drag & drop, удаление — иногда быстрее, чем редактирование</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-5-2-edit-note" />
        </article>
    );
};
