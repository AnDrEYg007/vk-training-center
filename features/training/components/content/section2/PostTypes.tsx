import React, { useState } from 'react';
import { Sandbox, NavigationButtons, type ContentProps } from '../shared';
import { 
  MockPostCard, 
  PostTypeComparison, 
  SystemPostStatusDemo,
  AutomationTypeDemo 
} from './PostTypesMocks';

/**
 * Обучающая страница: Три типа постов — В чём разница?
 * Path: 2-1-4-1-post-types
 * 
 * Детальное объяснение различий между опубликованными, отложенными VK и системными постами
 */
export const PostTypes: React.FC<ContentProps> = ({ currentPath }) => {
  const [selectedType, setSelectedType] = useState<'published' | 'scheduled' | 'system'>('published');
  const [selectedStatus, setSelectedStatus] = useState<'pending_publication' | 'publishing' | 'possible_error' | 'error'>('pending_publication');
  const [selectedAutomation, setSelectedAutomation] = useState<'regular' | 'contest_winner' | 'ai_feed' | 'general_contest_start' | 'general_contest_result'>('regular');

  return (
    <article className="prose prose-indigo max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        Три типа постов: В чём разница?
      </h1>

      <p className="!text-base !leading-relaxed !text-gray-700">
        В планировщике контента существует три отдельных типа постов, каждый из которых имеет своё назначение, визуальное отображение и доступные действия. Понимание различий между ними критически важно для эффективной работы с расписанием публикаций.
      </p>

      {/* Главная идея */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4 my-6">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0" aria-hidden="true">💡</span>
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">Главная идея</h4>
            <p className="text-sm text-gray-700">
              Три типа постов — это не просто визуальное разделение. Каждый тип хранится в отдельной таблице базы данных и имеет свой источник: опубликованные и отложенные синхронизируются из ВКонтакте, а системные создаются и управляются внутри приложения.
            </p>
          </div>
        </div>
      </div>

      <hr className="!my-10" />

      {/* Интерактивная демонстрация */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сравните визуально</h2>
      
      <p className="!text-base !leading-relaxed !text-gray-700">
        Выберите тип поста, чтобы увидеть, как он отображается в календаре. Обратите внимание на рамку, иконки и доступные действия.
      </p>

      <div className="not-prose my-8">
        <Sandbox
          title="Интерактивное сравнение типов постов"
          description="Переключайте между типами и изучайте визуальные отличия"
          instructions="Нажимайте на кнопки типов, чтобы увидеть, как выглядит каждый тип поста в календаре."
        >
          <PostTypeComparison selectedType={selectedType} onTypeChange={setSelectedType} />
        </Sandbox>
      </div>

      <hr className="!my-10" />

      {/* Опубликованный пост */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Опубликованный пост</h2>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это такое?</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Опубликованный пост — это публикация, которая уже размещена на стене сообщества ВКонтакте. Такие посты отображаются в календаре только для справки и не могут быть изменены через приложение.
      </p>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как определяется?</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Пост считается опубликованным, если он <strong>НЕ</strong> является системным и его дата публикации находится <strong>в прошлом</strong> (до текущего момента). Данные синхронизируются из ВКонтакте через кэш приложения.
      </p>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Визуальные характеристики</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>Рамка:</strong> сплошная серая линия</li>
        <li><strong>Оверлей:</strong> полупрозрачный белый градиент сверху донизу (при наведении курсора исчезает)</li>
        <li><strong>Иконка:</strong> зелёная галочка ✅ в левом верхнем углу</li>
        <li><strong>Перетаскивание:</strong> можно переносить на другие даты (создаёт копию как системный пост)</li>
      </ul>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Доступные действия</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li>✅ <strong>Просмотр</strong> — открывает карточку поста с подробностями</li>
        <li>✅ <strong>Копировать</strong> — создаёт новый системный пост с таким же содержимым</li>
        <li>✅ <strong>Посмотреть на стене ВК</strong> — переход по ссылке на публикацию (если есть vkPostUrl)</li>
        <li>❌ <strong>Редактирование</strong> — невозможно, изменения нужно делать непосредственно в ВКонтакте</li>
        <li>❌ <strong>Удаление</strong> — недоступно через приложение, только через интерфейс ВКонтакте</li>
      </ul>

      <hr className="!my-10" />

      {/* Отложенный пост VK */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Отложенный пост ВКонтакте</h2>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это такое?</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Отложенный пост ВКонтакте — это публикация, которая запланирована для размещения на стене в будущем через встроенную функцию отложенных публикаций ВКонтакте. Пост хранится на серверах ВКонтакте и будет опубликован в указанное время без участия приложения.
      </p>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Как определяется?</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Пост считается отложенным VK, если он <strong>НЕ</strong> является системным и его дата публикации находится <strong>в будущем</strong>. Данные синхронизируются из раздела «Отложенные записи» сообщества ВКонтакте.
      </p>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Визуальные характеристики</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>Рамка:</strong> сплошная серая линия</li>
        <li><strong>Оверлей:</strong> отсутствует</li>
        <li><strong>Иконка:</strong> отсутствует</li>
        <li><strong>Перетаскивание:</strong> можно переносить на другие даты (изменяет дату через API VK)</li>
      </ul>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Доступные действия</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li>✅ <strong>Редактирование</strong> — изменение текста, изображений, времени публикации (через API VK)</li>
        <li>✅ <strong>Удаление</strong> — удаляет запланированную публикацию из ВКонтакте</li>
        <li>✅ <strong>Копировать</strong> — создаёт новый системный пост</li>
        <li>✅ <strong>Перенос даты</strong> — можно перетащить на другой день и время</li>
        <li>✅ <strong>Посмотреть на стене ВК</strong> — переход по ссылке (если доступна)</li>
      </ul>

      <hr className="!my-10" />

      {/* Системный пост */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Системный пост</h2>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Что это такое?</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Системный пост — это публикация, созданная и хранящаяся внутри приложения. Это <strong>способ сохранения по умолчанию</strong> для всех новых постов. Системные посты не размещаются автоматически в ВКонтакте и ожидают, пока вы сами решите, когда и как их опубликовать.
      </p>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Визуальные характеристики</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>Рамка:</strong> пунктирная серая линия (для обычных системных постов)</li>
        <li><strong>Рамка:</strong> цветная сплошная линия (для автоматизаций: фуксия, индиго, голубой, оранжевый)</li>
        <li><strong>Иконка статуса:</strong> отображается в левом верхнем углу (🕒 / ⚙️ / ⚠️ / ❌)</li>
        <li><strong>Бейдж:</strong> отображается в правом верхнем углу для автоматизаций («КОНКУРС», «AI AUTO», «ИТОГИ») или циклических постов (🔄)</li>
        <li><strong>Перетаскивание:</strong> можно переносить на другие даты (кроме момента публикации и автоматизаций)</li>
      </ul>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Доступные действия</h3>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li>✅ <strong>Полное редактирование</strong> — изменение текста, изображений, времени публикации (кроме момента активной публикации)</li>
        <li>✅ <strong>Удаление</strong> — удаляет пост из базы данных приложения</li>
        <li>✅ <strong>Копировать</strong> — создаёт дубликат системного поста</li>
        <li>✅ <strong>Опубликовать сейчас</strong> — немедленно публикует пост на стене ВКонтакте</li>
        <li>✅ <strong>В отложку ВК</strong> — переносит пост в отложенные записи ВКонтакте (кроме циклических)</li>
        <li>✅ <strong>Подтвердить публикацию</strong> — доступно при статусе «Возможная ошибка», удаляет пост из системы после ручной проверки на стене</li>
      </ul>

      <h3 className="!text-xl !font-semibold !text-gray-800 !mt-8">Уникальные возможности</h3>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Системные посты предоставляют функции, недоступные для остальных типов:
      </p>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>Циклические публикации:</strong> автоматическое повторение публикаций с настройкой интервала, количества повторов и дня недели</li>
        <li><strong>Автоматизации:</strong> автоматическое создание постов для конкурсов, AI-ленты, универсальных конкурсов</li>
        <li><strong>AI-генерация:</strong> сохранение параметров генерации контента с использованием искусственного интеллекта</li>
        <li><strong>Глобальные переменные:</strong> динамическая подстановка данных в текст поста через синтаксис <code>{'{{global_key}}'}</code></li>
        <li><strong>Статусы жизненного цикла:</strong> отслеживание состояния публикации (ожидание, публикация, ошибка)</li>
      </ul>

      <hr className="!my-10" />

      {/* Статусы системного поста */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Четыре статуса системного поста</h2>

      <p className="!text-base !leading-relaxed !text-gray-700">
        Каждый системный пост имеет статус, который отображается в виде иконки в левом верхнем углу карточки. Статус показывает текущее состояние публикации и определяет доступные действия.
      </p>

      <div className="not-prose my-8">
        <Sandbox
          title="Статусы системного поста"
          description="Переключайте статусы, чтобы увидеть визуальные различия"
          instructions="Нажимайте на кнопки статусов и наблюдайте, как меняется иконка в карточке поста."
        >
          <SystemPostStatusDemo selectedStatus={selectedStatus} onStatusChange={setSelectedStatus} />
        </Sandbox>
      </div>

      <div className="overflow-x-auto my-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Статус</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Иконка</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Значение</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Доступные действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">pending_publication</code></td>
              <td className="border border-gray-300 px-4 py-2 text-center text-2xl">🕒</td>
              <td className="border border-gray-300 px-4 py-2">Ожидает публикации. Пост создан и готов к размещению в указанное время.</td>
              <td className="border border-gray-300 px-4 py-2 text-sm">Редактировать, удалить, опубликовать сейчас, в отложку ВК</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">publishing</code></td>
              <td className="border border-gray-300 px-4 py-2 text-center text-2xl">⚙️</td>
              <td className="border border-gray-300 px-4 py-2">Публикуется. Сервер в процессе отправки поста в ВКонтакте. Карточка заблокирована.</td>
              <td className="border border-gray-300 px-4 py-2 text-sm">Все действия временно недоступны</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">possible_error</code></td>
              <td className="border border-gray-300 px-4 py-2 text-center text-2xl">⚠️</td>
              <td className="border border-gray-300 px-4 py-2">Возможная ошибка. Сервер не получил подтверждение публикации. Требуется проверка на стене ВК.</td>
              <td className="border border-gray-300 px-4 py-2 text-sm">Подтвердить публикацию, опубликовать заново, редактировать, удалить</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">error</code></td>
              <td className="border border-gray-300 px-4 py-2 text-center text-2xl">❌</td>
              <td className="border border-gray-300 px-4 py-2">Ошибка публикации. При попытке опубликовать пост произошла ошибка (например, недоступен токен проекта).</td>
              <td className="border border-gray-300 px-4 py-2 text-sm">Редактировать, удалить, опубликовать заново</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="!my-10" />

      {/* Подтипы системных постов (автоматизации) */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Подтипы системных постов: Автоматизации</h2>

      <p className="!text-base !leading-relaxed !text-gray-700">
        Системные посты могут иметь специальные подтипы, которые указывают на принадлежность к автоматизациям. Такие посты визуально отличаются цветной рамкой и бейджем в правом верхнем углу.
      </p>

      <div className="not-prose my-8">
        <Sandbox
          title="Подтипы системных постов"
          description="Посмотрите, как отображаются различные типы автоматизаций"
          instructions="Переключайте между подтипами и обратите внимание на цвет рамки и текст бейджа."
        >
          <AutomationTypeDemo selectedAutomation={selectedAutomation} onAutomationChange={setSelectedAutomation} />
        </Sandbox>
      </div>

      <div className="overflow-x-auto my-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Подтип</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Цвет рамки</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Бейдж</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Назначение</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">regular</code></td>
              <td className="border border-gray-300 px-4 py-2">Пунктирная серая</td>
              <td className="border border-gray-300 px-4 py-2">—</td>
              <td className="border border-gray-300 px-4 py-2">Обычный системный пост без привязки к автоматизациям</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">contest_winner</code></td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block w-4 h-4 bg-fuchsia-400 border border-gray-300 rounded"></span> Фуксия</td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block px-2 py-1 bg-fuchsia-500 text-white text-xs font-semibold rounded">КОНКУРС</span></td>
              <td className="border border-gray-300 px-4 py-2">Пост для конкурса отзывов (автоматическое объявление победителей)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">ai_feed</code></td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block w-4 h-4 bg-indigo-400 border border-gray-300 rounded"></span> Индиго</td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block px-2 py-1 bg-indigo-500 text-white text-xs font-semibold rounded">AI AUTO</span></td>
              <td className="border border-gray-300 px-4 py-2">Пост, сгенерированный AI-лентой (автоматический контент из внешних источников)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">general_contest_start</code></td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block w-4 h-4 bg-sky-400 border border-gray-300 rounded"></span> Голубой</td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block px-2 py-1 bg-sky-500 text-white text-xs font-semibold rounded">КОНКУРС</span></td>
              <td className="border border-gray-300 px-4 py-2">Пост, объявляющий начало универсального конкурса</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">general_contest_result</code></td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block w-4 h-4 bg-orange-400 border border-gray-300 rounded"></span> Оранжевый</td>
              <td className="border border-gray-300 px-4 py-2"><span className="inline-block px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded">ИТОГИ</span></td>
              <td className="border border-gray-300 px-4 py-2">Пост, объявляющий итоги универсального конкурса</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="!text-base !leading-relaxed !text-gray-700">
        <strong>Важно:</strong> посты с типами автоматизаций нельзя перетаскивать на другие даты и нельзя переносить в отложку ВКонтакте. Они управляются автоматически соответствующими модулями приложения (конкурсы, AI-лента).
      </p>

      <hr className="!my-10" />

      {/* Сводная таблица различий */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Сводная таблица различий</h2>

      <div className="overflow-x-auto my-8">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Характеристика</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Опубликованный</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Отложенный VK</th>
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">Системный</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Таблица БД</td>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">posts</code></td>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">scheduled_posts</code></td>
              <td className="border border-gray-300 px-4 py-2"><code className="text-sm">system_posts</code></td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Источник данных</td>
              <td className="border border-gray-300 px-4 py-2">Синхронизация из ВКонтакте</td>
              <td className="border border-gray-300 px-4 py-2">Синхронизация из ВКонтакте</td>
              <td className="border border-gray-300 px-4 py-2">Создаётся в приложении</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Рамка</td>
              <td className="border border-gray-300 px-4 py-2">Сплошная серая + оверлей</td>
              <td className="border border-gray-300 px-4 py-2">Сплошная серая</td>
              <td className="border border-gray-300 px-4 py-2">Пунктирная серая</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Иконка</td>
              <td className="border border-gray-300 px-4 py-2">✅ зелёная галочка</td>
              <td className="border border-gray-300 px-4 py-2">—</td>
              <td className="border border-gray-300 px-4 py-2">🕒 / ⚙️ / ⚠️ / ❌</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Редактирование</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">✅ (через API VK)</td>
              <td className="border border-gray-300 px-4 py-2">✅ (локально)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Удаление</td>
              <td className="border border-gray-300 px-4 py-2">❌ (только через VK)</td>
              <td className="border border-gray-300 px-4 py-2">✅ (через API VK)</td>
              <td className="border border-gray-300 px-4 py-2">✅ (локально)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Перетаскивание</td>
              <td className="border border-gray-300 px-4 py-2">✅ (копирование)</td>
              <td className="border border-gray-300 px-4 py-2">✅</td>
              <td className="border border-gray-300 px-4 py-2">✅ (кроме publishing)</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Копирование</td>
              <td className="border border-gray-300 px-4 py-2">✅ → системный</td>
              <td className="border border-gray-300 px-4 py-2">✅ → системный</td>
              <td className="border border-gray-300 px-4 py-2">✅</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Автоматизации</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">✅</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Циклические публикации</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">✅</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-medium">Глобальные переменные</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">❌</td>
              <td className="border border-gray-300 px-4 py-2">✅</td>
            </tr>
          </tbody>
        </table>
      </div>

      <hr className="!my-10" />

      {/* FAQ */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Частые вопросы</h2>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Почему нельзя редактировать опубликованные посты?
        </summary>
        <p className="mt-2 text-gray-700">
          Опубликованные посты хранятся только на серверах ВКонтакте. Приложение синхронизирует их для отображения в календаре, но не имеет прямого доступа к редактированию. Чтобы изменить опубликованный пост, откройте его на стене сообщества в интерфейсе ВКонтакте.
        </p>
      </details>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Можно ли перенести системный пост в отложку ВКонтакте?
        </summary>
        <p className="mt-2 text-gray-700">
          Да, для обычных системных постов доступна кнопка «В отложку ВК». Однако циклические посты и посты автоматизаций нельзя переносить в отложку, так как это нарушит их логику работы.
        </p>
      </details>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Что делать, если системный пост в статусе «Возможная ошибка»?
        </summary>
        <p className="mt-2 text-gray-700">
          Откройте стену сообщества ВКонтакте и проверьте, был ли пост опубликован. Если пост опубликован — нажмите «Подтвердить публикацию», чтобы удалить его из системы. Если пост не опубликован — попробуйте опубликовать его заново или отредактируйте содержимое.
        </p>
      </details>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Почему опубликованные и отложенные посты хранятся в отдельных таблицах?
        </summary>
        <p className="mt-2 text-gray-700">
          Это сделано для соответствия структуре API ВКонтакте. Опубликованные посты возвращаются методом <code>wall.get</code>, а отложенные — методом <code>wall.get</code> с фильтром <code>postponed</code>. Отдельные таблицы упрощают синхронизацию и кэширование данных.
        </p>
      </details>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Можно ли копировать посты между проектами?
        </summary>
        <p className="mt-2 text-gray-700">
          При копировании любого типа поста создаётся новый системный пост в рамках текущего проекта. Для переноса между проектами сначала скопируйте пост в текущем проекте, затем измените привязку проекта в настройках системного поста (если такая возможность реализована).
        </p>
      </details>

      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <summary className="cursor-pointer font-semibold text-gray-900">
          Что происходит при перетаскивании поста на другую дату?
        </summary>
        <p className="mt-2 text-gray-700">
          Для отложенных VK и системных постов изменяется дата публикации (через API VK или локально). Для опубликованных постов создаётся новый системный пост с той же датой, на которую вы перетащили карточку. Опубликованный оригинал остаётся на месте.
        </p>
      </details>

      <hr className="!my-10" />

      {/* Совет эксперта */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-500 p-6 rounded-r-lg my-8">
        <div className="flex items-start gap-4">
          <span className="text-2xl flex-shrink-0" aria-hidden="true">💡</span>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Совет эксперта</h4>
            <p className="text-gray-700">
              При планировании расписания публикаций используйте системные посты как основной рабочий инструмент. Они дают максимум гибкости: можно редактировать, удалять, копировать и настраивать автоматизации. Переносите в отложку ВКонтакте только финальные версии постов, которые точно не будут изменяться, — это уменьшит нагрузку на API VK и упростит управление расписанием.
            </p>
          </div>
        </div>
      </div>

      <hr className="!my-10" />

      {/* Итоги */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 my-8">
        <h4 className="text-xl font-bold text-gray-900 mb-4">Итоги</h4>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Три типа постов хранятся в отдельных таблицах базы данных: <code>posts</code>, <code>scheduled_posts</code> и <code>system_posts</code>.
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Опубликованные и отложенные посты синхронизируются из ВКонтакте и доступны только для просмотра (отложенные — для редактирования через API VK).
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Системные посты — это способ сохранения по умолчанию, они создаются и управляются внутри приложения с полным контролем редактирования и удаления.
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Системные посты имеют четыре статуса жизненного цикла: ожидание публикации, публикуется, возможная ошибка и ошибка публикации.
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Системные посты поддерживают автоматизации (конкурсы, AI-лента) и циклические публикации с визуальным отличием через цветные рамки и бейджи.
          </li>
          <li className="flex items-start">
            <span className="text-indigo-600 mr-2">•</span>
            Визуальные отличия (рамка, иконка, бейдж) помогают мгновенно определить тип поста в календаре и выбрать правильное действие.
          </li>
        </ul>
      </div>

      <NavigationButtons currentPath={currentPath} />
    </article>
  );
};
