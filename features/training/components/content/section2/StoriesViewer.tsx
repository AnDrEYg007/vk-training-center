import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { ViewerNavigationDemo, StoriesRowDemo } from './StoriesMocks';

// =====================================================================
// Просмотр историй
// =====================================================================
export const StoriesViewer: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-slate max-w-none">
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Когда вы кликаете по аватарке истории в календаре, открывается полноэкранный просмотрщик. Он позволяет увидеть историю в полном размере, перемещаться между историями и открыть её в ВКонтакте.
            </p>

            <div className="not-prose bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-sm text-blue-900">
                    <strong>Главная идея:</strong> Просмотрщик — это отдельное всплывающее окно, которое занимает весь экран. Фон затемнён и размыт, чтобы история была в фокусе внимания. Дизайн похож на просмотр историй в самом ВКонтакте.
                </p>
            </div>

            {/* Как открыть просмотрщик */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как открыть просмотрщик?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Просто кликните по любой аватарке истории в горизонтальной строке. Просмотрщик откроется мгновенно и покажет выбранную историю. Никаких дополнительных кнопок или меню не нужно.
            </p>

            <div className="not-prose">
                <Sandbox
                    title="Откройте просмотрщик"
                    description="Кликните по любой аватарке ниже, чтобы увидеть, как работает просмотрщик."
                    instructions={[
                        'Клик по аватарке → открывается полноэкранное окно',
                        'История отображается в центре на чёрном фоне',
                        'Стрелки по бокам для навигации'
                    ]}
                >
                    <StoriesRowDemo />
                </Sandbox>
            </div>

            {/* Структура просмотрщика */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Структура просмотрщика
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Просмотрщик состоит из нескольких элементов:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Элемент</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Расположение</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Функция</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Фон</td>
                            <td className="border border-gray-300 px-4 py-2">Весь экран</td>
                            <td className="border border-gray-300 px-4 py-2">Чёрный полупрозрачный + размытие (backdrop-blur)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Дата и время</td>
                            <td className="border border-gray-300 px-4 py-2">Вверху по центру</td>
                            <td className="border border-gray-300 px-4 py-2">Когда была опубликована история</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Превью истории</td>
                            <td className="border border-gray-300 px-4 py-2">Центр экрана</td>
                            <td className="border border-gray-300 px-4 py-2">Изображение истории (max-height: 600px)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Стрелка ←</td>
                            <td className="border border-gray-300 px-4 py-2">Слева по центру</td>
                            <td className="border border-gray-300 px-4 py-2">Переход к предыдущей истории (если есть)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">Стрелка →</td>
                            <td className="border border-gray-300 px-4 py-2">Справа по центру</td>
                            <td className="border border-gray-300 px-4 py-2">Переход к следующей истории (если есть)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">Кнопка ×</td>
                            <td className="border border-gray-300 px-4 py-2">Правый верхний угол</td>
                            <td className="border border-gray-300 px-4 py-2">Закрыть просмотрщик</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2">«Открыть в VK»</td>
                            <td className="border border-gray-300 px-4 py-2">Под превью по центру</td>
                            <td className="border border-gray-300 px-4 py-2">Ссылка на историю в ВКонтакте</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Навигация между историями */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Навигация между историями
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если в проекте несколько историй за один день, вы можете пролистывать их прямо в просмотрщике. Есть три способа навигации:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                1. Стрелки на экране
            </h3>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Стрелка влево (←)</strong> — переход к предыдущей истории. Видна только если вы не на первой истории.</li>
                <li><strong>Стрелка вправо (→)</strong> — переход к следующей истории. Видна только если есть следующая история. Если вы на последней истории, вместо стрелки справа отображается кнопка «Закрыть».</li>
            </ul>

            <div className="not-prose bg-yellow-50 border-l-4 border-yellow-500 p-4 my-6">
                <p className="text-sm text-yellow-900">
                    <strong>⚠️ Важно:</strong> Клик по стрелке → на последней истории автоматически закрывает просмотрщик. Это сделано для удобства — не нужно искать кнопку закрытия, просто пролистайте до конца.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                2. Клавиатура
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Просмотрщик поддерживает управление с клавиатуры — это быстрее, чем кликать мышкой:
            </p>

            <div className="not-prose overflow-x-auto my-6">
                <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Клавиша</th>
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">← (ArrowLeft)</td>
                            <td className="border border-gray-300 px-4 py-2">Предыдущая история</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">→ (ArrowRight)</td>
                            <td className="border border-gray-300 px-4 py-2">Следующая история (или закрыть, если это последняя)</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-4 py-2 font-mono">Пробел (Space)</td>
                            <td className="border border-gray-300 px-4 py-2">Следующая история (или закрыть)</td>
                        </tr>
                        <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2 font-mono">Escape (Esc)</td>
                            <td className="border border-gray-300 px-4 py-2">Закрыть просмотрщик</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-900">
                    <strong>💡 Совет:</strong> Привыкните к клавиатурной навигации — так вы сможете быстро просматривать десятки историй без лишних движений мышкой. Стрелки → и ← работают интуитивно.
                </p>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-6">
                3. Клик по фону
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если кликнуть мимо превью истории (по затемнённому фону), просмотрщик закроется. Это быстрый способ выйти, не ища кнопку «×».
            </p>

            {/* Интерактивная демонстрация */}
            <div className="not-prose">
                <Sandbox
                    title="Интерактивная демонстрация навигации"
                    description="Попробуйте управлять просмотрщиком — стрелки, клавиатура, закрытие."
                    instructions={[
                        'Клик по стрелкам → переключение между историями',
                        'Клавиши ← → управляют навигацией',
                        'Escape или клик по фону → закрыть',
                        'На последней истории стрелка → закрывает просмотрщик'
                    ]}
                >
                    <ViewerNavigationDemo />
                </Sandbox>
            </div>

            {/* Кнопка "Открыть в VK" */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Кнопка «Открыть в VK»
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Под превью истории есть синяя кнопка с текстом «Открыть в VK». Клик по ней откроет историю в браузере на сайте ВКонтакте (в новой вкладке).
            </p>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Зачем это нужно?
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li><strong>Просмотр статистики</strong> — в VK видны просмотры, лайки, ответы</li>
                <li><strong>Полная версия</strong> — если это видео-история, в VK вы увидите её в движении</li>
                <li><strong>Контекст</strong> — увидите историю в общем контексте сообщества</li>
                <li><strong>Действия</strong> — можете удалить или скрыть историю (если есть права администратора)</li>
            </ul>

            <div className="not-prose bg-green-50 border-l-4 border-green-500 p-4 my-6">
                <p className="text-sm text-green-900">
                    <strong>✅ Удобно:</strong> Ссылка формируется автоматически. Планировщик знает ID сообщества и ID истории, поэтому всегда ведёт на правильную страницу.
                </p>
            </div>

            {/* Что если нет превью */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что, если изображение не загрузилось?
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Иногда превью истории может отсутствовать (например, если история была удалена из VK, но запись о ней ещё осталась в базе). В этом случае вместо изображения отображается серая заглушка:
            </p>

            <ul className="!text-base !leading-relaxed !text-gray-700">
                <li>SVG-иконка фотографии (схематичное изображение)</li>
                <li>Текст «Нет изображения»</li>
                <li>Фон серый (#374151)</li>
            </ul>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Кнопка «Открыть в VK» всё равно работает — вы можете перейти по ссылке и посмотреть, что случилось с историей в самом ВКонтакте.
            </p>

            {/* Закрытие просмотрщика */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Все способы закрыть просмотрщик
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Просмотрщик можно закрыть несколькими способами:
            </p>

            <div className="not-prose grid md:grid-cols-2 gap-4 my-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Кнопка ×</h3>
                    <p className="text-sm text-gray-700">
                        Белый крестик в правом верхнем углу. Классический способ закрытия модальных окон.
                    </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Клавиша Escape</h3>
                    <p className="text-sm text-gray-700">
                        Самый быстрый способ. Работает из любого состояния — на первой, последней или средней истории.
                    </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Клик по фону</h3>
                    <p className="text-sm text-gray-700">
                        Кликните мимо превью (по чёрному фону) — просмотрщик закроется. Интуитивный жест.
                    </p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Стрелка → на последней истории</h3>
                    <p className="text-sm text-gray-700">
                        Если пролистали до конца, клик по стрелке → автоматически закроет просмотрщик. Или нажмите пробел.
                    </p>
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
                        Можно ли увидеть статистику просмотров в просмотрщике?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, статистика доступна только в самом ВКонтакте. Нажмите кнопку «Открыть в VK», и там увидите количество просмотров, лайков и ответов на историю.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Почему видео-история не проигрывается?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Просмотрщик показывает только статичное превью (первый кадр). Чтобы посмотреть видео, откройте историю в VK через кнопку «Открыть в VK».
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли удалить историю из просмотрщика?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Нет, управление историями доступно только через ВКонтакте. Планировщик показывает истории в режиме «только для чтения».
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Что делать, если ссылка «Открыть в VK» не работает?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Скорее всего, история уже удалена из VK (прошло больше 24 часов). Ссылка ведёт на несуществующую страницу, и VK покажет ошибку 404.
                    </p>
                </details>

                <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <summary className="font-semibold text-gray-900 cursor-pointer">
                        Можно ли закрыть просмотрщик, не пролистав до конца?
                    </summary>
                    <p className="mt-2 text-sm text-gray-700">
                        Да, конечно. Нажмите Escape, кликните по × или по фону — просмотрщик закроется сразу, не важно на какой истории вы находитесь.
                    </p>
                </details>
            </div>

            {/* Итоги */}
            <div className="not-prose bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Итоги: что нужно запомнить</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Открытие</strong> — клик по аватарке истории в календаре</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Полноэкранный режим</strong> — чёрный фон с размытием, история в центре</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Навигация</strong> — стрелки ← → на экране или клавиатура, пробел для перехода вперёд</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Клавиатура</strong> — ← назад, → вперёд, пробел вперёд, Escape закрыть</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>«Открыть в VK»</strong> — кнопка под превью, ссылка на историю в ВКонтакте</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span><strong>Закрытие</strong> — × в углу, Escape, клик по фону, → на последней истории</span>
                    </li>
                </ul>
            </div>

            <NavigationButtons currentPath="2-1-6-2-stories-viewer" />
        </article>
    );
};
