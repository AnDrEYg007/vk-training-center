import React from 'react';
import { ContentProps, Sandbox, NavigationButtons, NavigationLink } from '../shared';
import { StoriesRowDemo, TypeIndicatorsDemo, EmptyStoriesDemo } from './StoriesMocks';

// =====================================================================
// Отображение историй в календаре
// =====================================================================
export const StoriesDisplay: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Истории отображаются в календаре в виде горизонтальной строки круглых аватарок в начале каждого дня. Это компактный формат, который не занимает много места и позволяет увидеть сразу все истории дня одним взглядом.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Дизайн вдохновлён интерфейсом Instagram и ВКонтакте — истории показываются как перекрывающиеся круги. Это привычный формат, который пользователи узнают сразу.
                </p>
            </div>

            {/* Горизонтальная строка */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Горизонтальная строка аватарок
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Все истории одного дня выстраиваются в одну линию слева направо. Ключевая особенность — аватарки <strong>перекрывают друг друга</strong> примерно на 20% ширины. Это экономит место и создаёт визуальный эффект стопки.
            </p>

            <div className="not-prose">
                <Sandbox
                    title="Интерактивная демонстрация"
                    description="Наведите курсор на любую аватарку и кликните по ней."
                    instructions={[
                        'Аватарки перекрываются — это нормально, так экономится место',
                        'При наведении аватарка увеличивается и выходит на передний план',
                        'Клик по аватарке откроет полноэкранный просмотрщик (в реальном интерфейсе)'
                    ]}
                >
                    <StoriesRowDemo />
                </Sandbox>
            </div>

            {/* Технические детали отображения */}
            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                Технические детали
            </h3>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Параметр</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Значение</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Размер аватарки</td>
                            <td className="border border-gray-300 px-4 py-2">40×40 пикселей (круглая)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Перекрытие</td>
                            <td className="border border-gray-300 px-4 py-2">~8 пикселей (20% ширины)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Рамка</td>
                            <td className="border border-gray-300 px-4 py-2">2 пикселя, белая</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Реакция на наведение</td>
                            <td className="border border-gray-300 px-4 py-2">Увеличение на 10% (scale-110)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Тень</td>
                            <td className="border border-gray-300 px-4 py-2">Лёгкая тень (shadow-sm)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Индикаторы типа */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Индикаторы типа: фото или видео
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В правом нижнем углу каждой аватарки есть маленький цветной кружок — это <strong>индикатор типа истории</strong>. Он помогает сразу понять, что опубликовано: фото или видео.
            </p>

            <div className="not-prose">
                <Sandbox
                    title="Два типа индикаторов"
                    description="Слева — фото-история (синий), справа — видео-история (красный с символом)."
                    instructions={[
                        'Синий кружок = фото-история',
                        'Красный кружок с символом ▶ = видео-история',
                        'Индикатор всегда в правом нижнем углу аватарки'
                    ]}
                >
                    <TypeIndicatorsDemo />
                </Sandbox>
            </div>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Тип истории</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Цвет индикатора</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Символ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Фото</td>
                            <td className="border border-gray-300 px-4 py-2">Синий (#3B82F6)</td>
                            <td className="border border-gray-300 px-4 py-2">Нет</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Видео</td>
                            <td className="border border-gray-300 px-4 py-2">Красный (#EF4444)</td>
                            <td className="border border-gray-300 px-4 py-2">▶ (белый треугольник)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Если в проекте много историй, индикаторы помогают быстро оценить баланс контента. Например, если все истории — видео (только красные индикаторы), возможно, стоит разбавить их фото.
                </p>
            </div>

            {/* Реакция на наведение */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Реакция на наведение курсора
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы наводите курсор на аватарку истории, происходят два визуальных изменения:
            </p>

            <ol className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Увеличение размера</strong> — аватарка плавно увеличивается на 10% (эффект scale-110)</li>
                <li><strong>Выход на передний план</strong> — z-index меняется, и аватарка «выезжает» из стопки, становясь поверх соседних</li>
            </ol>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Увеличение происходит плавно (transition-duration: 200ms). Это создаёт приятный эффект и показывает, что элемент интерактивный.
                </p>
            </div>

            {/* Клик по аватарке */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Клик по аватарке
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы кликаете по аватарке, открывается <strong>полноэкранный просмотрщик</strong> (подробнее в разделе <NavigationLink to="2-1-6-2-stories-viewer" title="Просмотр историй" variant="related" />). Это позволяет:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Увидеть историю в полном размере</li>
                <li>Прочитать дату и время публикации</li>
                <li>Перейти к следующей/предыдущей истории стрелками</li>
                <li>Открыть историю в VK по кнопке</li>
            </ul>

            {/* Порядок историй */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                В каком порядке отображаются истории?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Истории сортируются <strong>по времени публикации</strong> — от старых к новым (слева направо). Это значит:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>Крайняя левая аватарка — самая старая история дня (опубликована раньше всех)</li>
                <li>Крайняя правая — самая свежая (опубликована последней)</li>
                <li>Порядок фиксированный — вы не можете его изменить</li>
            </ul>

            {/* Пустое состояние */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что, если историй нет?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если в проекте нет активных историй на конкретный день, строка аватарок просто не отображается. День в календаре начинается сразу с постов или заметок (если они есть), или остаётся пустым.
            </p>

            <div className="not-prose">
                <Sandbox
                    title="Пустое состояние"
                    description="Так выглядит день без историй — никакой строки аватарок, никакой заглушки."
                    instructions={[
                        'Компонент историй не рендерится вообще',
                        'Это экономит место в календаре',
                        'Пользователь сразу видит посты или заметки'
                    ]}
                >
                    <EmptyStoriesDemo />
                </Sandbox>
            </div>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Дизайн-решение:</strong> Мы намеренно не показываем заглушку типа «Нет историй». Если историй нет — их просто нет, и это нормально. Заглушка занимала бы место и отвлекала бы внимание.
                </p>
            </div>

            {/* Позиция в дне */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Где в дне располагаются истории?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Истории всегда идут <strong>первыми</strong> — перед постами и заметками. Структура дня в календаре:
            </p>

            <div className="not-prose my-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">1</div>
                        <div>
                            <p className="font-semibold text-gray-900">Истории (Stories)</p>
                            <p className="text-gray-600">Горизонтальная строка круглых аватарок</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center font-bold">2</div>
                        <div>
                            <p className="font-semibold text-gray-900">Посты</p>
                            <p className="text-gray-600">Вертикальный список карточек постов</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 text-white rounded flex items-center justify-center font-bold">3</div>
                        <div>
                            <p className="font-semibold text-gray-900">Заметки</p>
                            <p className="text-gray-600">Перемешаны с постами по хронологии</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <hr className="!my-10" />

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Часто задаваемые вопросы
            </h2>

            <div className="not-prose space-y-4">
                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Почему аватарки перекрываются? Это баг?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, это специальный дизайн-приём для экономии места. Если бы аватарки шли без перекрытия, строка из 10 историй заняла бы слишком много места по горизонтали.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли изменить порядок историй?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет. Порядок определяется временем публикации в VK — старые слева, новые справа. Это фиксированная логика, изменить её нельзя.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что делать, если превью истории не загрузилось?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        В этом случае вместо картинки отображается серая заглушка с текстом «Story». Это значит, что система не смогла получить превью из VK (истории может уже не быть или ссылка устарела).
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Сколько максимально историй может быть в одной строке?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Технически ограничений нет. Но VK сам ограничивает количество активных историй сообщества — обычно до 100. На практике в одном дне редко бывает больше 10–20 историй.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Почему при наведении аватарка «выпрыгивает» из строки?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Это визуальная подсказка, что элемент интерактивный. Увеличение и выход на передний план показывают, что по аватарке можно кликнуть.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Горизонтальная строка</strong> — аватарки 40×40, перекрывающиеся на 20%</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Индикаторы типа</strong> — синий для фото, красный ▶ для видео</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Реакция на наведение</strong> — увеличение на 10% и выход на передний план</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Порядок хронологический</strong> — от старых к новым (слева направо)</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Пустое состояние</strong> — если историй нет, строка не отображается</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Позиция в дне</strong> — всегда первыми, перед постами и заметками</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-6-1-stories-display" />
        </article>
    );
};
