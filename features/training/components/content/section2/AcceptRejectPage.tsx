import React from 'react';
import { NavigationButtons, ContentProps } from '../shared';

// =====================================================================
// Страница обучения: Принятие и отклонение предложенных постов
// =====================================================================
export const AcceptRejectPage: React.FC<ContentProps> = ({ title }) => {
    return (
        <article className="prose prose-indigo max-w-none">
            {/* Заголовок страницы */}
            <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
                {title}
            </h1>

            {/* Важное уведомление */}
            <div className="not-prose">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
                    <div className="flex items-start">
                        <svg className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h3 className="text-lg font-bold text-yellow-900 mb-2">Функционал в разработке</h3>
                            <p className="text-sm text-yellow-800 leading-relaxed">
                                Кнопки "Принять" и "Отклонить" для предложенных постов пока не реализованы в приложении. 
                                Эта страница описывает, как работать с предложкой в текущей версии и что планируется добавить в будущем.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Текущее состояние */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что доступно сейчас
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В текущей версии приложения предложенные посты можно:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Просматривать</strong> — видеть все предложенные участниками посты в удобном формате карточек</li>
                    <li><strong>Редактировать через AI</strong> — автоматически исправлять текст, добавлять хештеги и благодарности</li>
                    <li><strong>Копировать текст</strong> — забирать исправленный AI текст в буфер обмена</li>
                    <li><strong>Открывать в VK</strong> — переходить к оригинальному посту по ссылке</li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Обходной путь */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Как работать с предложкой сейчас
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Пока кнопок принятия/отклонения нет, используйте следующий процесс для модерации предложенных постов:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 1: Просмотр и оценка
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Откройте вкладку "Предложенные" в нужном проекте. Пролистайте карточки, оцените качество контента. 
                Если пост хороший — переходите к следующему шагу. Если плохой — просто пропускайте (он останется в предложке, но вы к нему не вернётесь).
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 2: AI-обработка (для хороших постов)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Нажмите кнопку "Редактор AI" на карточке. AI исправит опечатки, добавит хештеги проекта, уберёт лишние эмодзи. 
                Подождите несколько секунд, пока AI обработает текст.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 3: Ручное редактирование (при необходимости)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Если AI не идеально справился, отредактируйте текст вручную прямо в AI-редакторе. Текстовое поле полностью редактируемое.
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 4: Копирование и публикация
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Нажмите кнопку "Копировать" в AI-редакторе. Текст скопируется в буфер обмена. Затем:
            </p>

            <div className="not-prose">
                <ol className="list-decimal list-inside text-base text-gray-700 space-y-2 mb-6 ml-4">
                    <li>Перейдите на вкладку "Отложенные"</li>
                    <li>Нажмите "+ Создать пост"</li>
                    <li>Вставьте текст (Ctrl+V)</li>
                    <li>Добавьте изображения (если были в предложке, скопируйте их вручную)</li>
                    <li>Запланируйте или опубликуйте</li>
                </ol>
            </div>

            <div className="not-prose">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p className="text-sm text-blue-800">
                        <strong>Совет:</strong> Держите открытыми две вкладки браузера — одну с "Предложенными", другую с "Отложенными". 
                        Так будет удобнее переносить контент.
                    </p>
                </div>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Шаг 5: Удаление из предложки (вручную в VK)
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                После публикации поста зайдите в само сообщество ВКонтакте и удалите предложенный пост из очереди предложки. 
                Это нужно делать вручную, так как приложение пока не умеет автоматически удалять посты из предложки.
            </p>

            <hr className="!my-10" />

            {/* Что планируется */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Что будет добавлено в будущем
            </h2>

            <p className="!text-base !leading-relaxed !text-gray-700">
                В следующих версиях планируется реализовать полноценный функционал модерации предложенных постов:
            </p>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Кнопка "Принять"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Автоматически создаст новый пост в отложенных из текущего предложенного. Текст можно будет выбрать — использовать 
                оригинальный или исправленный AI. Изображения также скопируются автоматически.
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Один клик</strong> — не нужно вручную копировать текст и создавать пост</li>
                    <li><strong>Сохранение автора</strong> — информация об авторе предложки сохранится в описании поста</li>
                    <li><strong>Автоудаление</strong> — пост автоматически удалится из предложки в VK</li>
                </ul>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Кнопка "Отклонить"
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Удалит предложенный пост из очереди предложки VK без переноса в отложенные. Используется для спама, неподходящего контента или дубликатов.
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Быстрая очистка</strong> — не нужно заходить в VK для удаления плохого контента</li>
                    <li><strong>Подтверждение действия</strong> — всплывающее окно с вопросом "Точно удалить?"</li>
                    <li><strong>История</strong> — возможно, будет храниться лог отклонённых постов</li>
                </ul>
            </div>

            <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">
                Массовые действия
            </h3>

            <p className="!text-base !leading-relaxed !text-gray-700">
                Возможность выделить несколько предложенных постов галочками и применить действие ко всем сразу:
            </p>

            <div className="not-prose">
                <ul className="list-disc list-inside text-base text-gray-700 space-y-2 mb-6">
                    <li><strong>Массовое принятие</strong> — перенести 5-10 хороших постов в отложенные одним кликом</li>
                    <li><strong>Массовое отклонение</strong> — удалить всю партию спама за раз</li>
                    <li><strong>AI для всех</strong> — обработать сразу несколько постов через AI (по очереди)</li>
                </ul>
            </div>

            <hr className="!my-10" />

            {/* Итоги */}
            <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">
                Итоги
            </h2>

            <div className="not-prose">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-bold text-indigo-900 mb-3">Что нужно запомнить:</h4>
                    <ul className="list-disc list-inside text-base text-indigo-800 space-y-2">
                        <li>Кнопок "Принять" и "Отклонить" пока нет в приложении</li>
                        <li>Используйте AI-редактор для подготовки текста к публикации</li>
                        <li>Копируйте исправленный текст и создавайте пост вручную на вкладке "Отложенные"</li>
                        <li>Удаляйте принятые/отклонённые посты из предложки через сам VK</li>
                        <li>Функционал автоматизации модерации добавят в будущих версиях</li>
                    </ul>
                </div>
            </div>

            <div className="not-prose">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                    <p className="text-sm text-green-800">
                        <strong>Хорошая новость:</strong> Даже без кнопок принятия/отклонения вы уже экономите время благодаря AI-редактору, 
                        который автоматически исправляет текст. Раньше приходилось вручную править каждую опечатку!
                    </p>
                </div>
            </div>

            {/* Навигация */}
            <NavigationButtons currentPath="2-2-5-accept-reject" />
        </article>
    );
};
