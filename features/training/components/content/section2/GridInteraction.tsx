import React from 'react';
import { ContentProps, NavigationLink } from '../shared';

// =====================================================================
// Взаимодействие с сеткой календаря: обучение
// =====================================================================
export const GridInteraction: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В сетке календаря можно работать с постами, заметками и историями каждого дня. Все действия происходят прямо внутри нужной колонки: вы можете создавать, просматривать, перемещать и выделять элементы — быстро и удобно.
            </p>

            <div className="not-prose bg-indigo-50 border border-indigo-200 rounded-lg p-4 my-6">
                <p className="text-sm text-indigo-800">
                    <strong>Главное:</strong> Все взаимодействия с контентом происходят прямо в сетке — без лишних переходов и сложных меню.
                </p>
            </div>

            <hr className="!my-10" />

            {/* Основные сценарии взаимодействия */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как работать с сеткой?</h2>
            <p className="!text-base !leading-relaxed !text-gray-700 mb-4">Ниже кратко перечислены основные действия и ограничения, которые помогут быстро освоиться в рабочей области.</p>
            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Создание поста:</strong> нажмите на кнопку «+» в нужном дне (доступно только для будущих дат).</li>
                <li><strong>Перетаскивание (drag-and-drop):</strong> перемещайте посты и заметки между днями — просто захватите элемент мышкой и перенесите в другую колонку.</li>
                <li><strong>Просмотр и редактирование:</strong> кликните по посту или заметке, чтобы открыть подробности или внести изменения.</li>
                <li><strong>Выделение:</strong> включите режим выделения, чтобы выбрать несколько постов или заметок для массовых действий.</li>
                <li><strong>Истории:</strong> если в дне есть истории, они отображаются кружками под датой. Кликните по кружку, чтобы посмотреть историю.</li>
                <li><strong>Ограничения:</strong> нельзя создавать посты в прошлом, а кнопка «+» для таких дней будет неактивна.</li>
                <li><strong>Двойной клик по пустому месту дня:</strong> откроет окно для быстрой заметки.</li>
            </ul>

            <div className="not-prose bg-gray-50 border border-gray-300 rounded-lg p-6 my-8">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Интерактивная демонстрация</h3>
                <p className="text-gray-700 text-base mb-2">Попробуйте перетащить пост или заметку между днями, кликните по элементу для просмотра, или создайте новый пост через «+».</p>
                {/* Здесь может быть демо-область, если поддерживается */}
            </div>

            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900 mt-10">FAQ: Частые вопросы</h2>
            <ul className="list-disc list-inside space-y-2 !text-base !leading-relaxed !text-gray-700">
                <li><strong>Можно ли отменить перемещение?</strong> Если вы случайно переместили элемент, просто перетащите его обратно в нужный день.</li>
                <li><strong>Почему кнопка «+» неактивна?</strong> Она отключена для прошедших дней и при включённом режиме выделения.</li>
                <li><strong>Что делать, если не видно истории?</strong> Истории отображаются только если они есть в выбранном дне.</li>
                <li><strong>Можно ли выделить сразу несколько элементов?</strong> Да, включите режим выделения и отмечайте нужные посты и заметки.</li>
            </ul>

            <div className="not-prose bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-6">
                <p className="text-sm text-yellow-800">
                    <strong>Совет эксперта:</strong> Используйте drag-and-drop для быстрой смены даты публикации — это экономит время при планировании контента.
                </p>
            </div>

            <hr className="!my-10" />
            <p className="!text-base !leading-relaxed !text-gray-700">
                Все основные действия с контентом доступны прямо в сетке календаря — это удобно и ускоряет работу.
            </p>

            <hr className="!my-10" />

            {/* Навигация к следующему разделу */}
            <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <NavigationLink
                    to="2-1-3-1-day-columns"
                    title="Назад: 2.1.3.1 Дневные колонки"
                    description="Подробнее о структуре колонки"
                    variant="prev"
                />
                <NavigationLink
                    to="2-1-3-3-drag-and-drop"
                    title="Далее: 2.1.3.3 Drag-and-Drop"
                    description="Как перетаскивать элементы между днями"
                    variant="next"
                />
            </div>
        </article>
    );
};
