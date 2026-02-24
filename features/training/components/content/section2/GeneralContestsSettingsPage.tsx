import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

const GeneralContestsSettingsPage: React.FC<ContentProps> = ({ topicId, subtopicId, itemId }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <h1>Настройки универсального конкурса</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-800 m-0">
          <strong>Для кого эта страница:</strong> SMM-специалисты, технические специалисты и руководители, которые запускают конкурсы во ВКонтакте.
        </p>
      </div>

      <h2>Что это такое?</h2>
      <p>
        Страница настроек универсального конкурса позволяет настроить все параметры конкурса в одном месте: от условий участия до автоматических сообщений победителям. 
        Это единая форма, где вы контролируете весь жизненный цикл конкурса — от запуска до публикации результатов.
      </p>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
        <p className="text-amber-800 m-0">
          <strong>Важно:</strong> Все настройки сохраняются автоматически, но конкурс запустится только после активации переключателя "Конкурс активен".
        </p>
      </div>

      <h2>⏱️ Было / Стало: Экономия времени</h2>
      
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="!text-red-800 !mt-0">❌ Было (ручная работа)</h3>
          <ul className="!text-red-700 space-y-2">
            <li>Вручную следить за комментариями и лайками</li>
            <li>В Excel записывать участников</li>
            <li>Вручную проверять подписки и репосты</li>
            <li>Самим выбирать победителей из списка</li>
            <li>Лично писать каждому победителю</li>
            <li>Вручную создавать пост с результатами</li>
          </ul>
          <p className="!text-red-800 font-bold !mb-0 !mt-4">Время: 3-5 часов на один конкурс</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="!text-green-800 !mt-0">✅ Стало (автоматизация)</h3>
          <ul className="!text-green-700 space-y-2">
            <li>Система сама отслеживает все действия</li>
            <li>Автоматический сбор участников</li>
            <li>Проверка условий в фоне</li>
            <li>Автоматический выбор победителей</li>
            <li>Автоматическая рассылка сообщений</li>
            <li>Автоматическая публикация результатов</li>
          </ul>
          <p className="!text-green-800 font-bold !mb-0 !mt-4">Время: 10-15 минут на настройку</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <p className="!text-indigo-900 !m-0">
          <strong>💡 Экономия:</strong> Вместо 3-5 часов работы вы тратите 10-15 минут на настройку, а система делает всё остальное автоматически. 
          Это позволяет запускать конкурсы регулярно, не перегружая команду рутиной.
        </p>
      </div>

      <h2>Разделы настроек</h2>
      <p>Страница настроек разделена на 6 логических блоков:</p>

      {/* РАЗДЕЛ 1: ОСНОВНЫЕ ПАРАМЕТРЫ */}
      <h3>1. Основные параметры</h3>
      <p>
        Здесь вы включаете или выключаете конкурс, устанавливаете название и определяете время его работы.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Переключатель активности и название конкурса">
          <BasicParamsDemo />
        </Sandbox>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 m-0">
            <strong>Совет:</strong> Сначала настройте все параметры конкурса с выключенным переключателем, а затем включите его когда всё будет готово.
          </p>
        </div>
      </div>

      <ul>
        <li><strong>Переключатель "Конкурс активен"</strong> — включает или выключает работу конкурса</li>
        <li><strong>Название</strong> — внутреннее название для вашего удобства (не показывается участникам)</li>
        <li><strong>Дата и время начала</strong> — когда конкурс начнёт принимать участников</li>
        <li><strong>Длительность</strong> — сколько дней и часов будет длиться конкурс</li>
      </ul>

      <div className="not-prose my-6">
        <Sandbox title="Выбор даты, времени и длительности">
          <DateTimeDemo />
        </Sandbox>
      </div>

      {/* РАЗДЕЛ 2: ПОСТ КОНКУРСА */}
      <h3>2. Пост конкурса</h3>
      <p>
        В этом блоке вы создаёте сам пост, который увидят участники. Можно выбрать готовый отложенный пост или создать новый прямо здесь.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Выбор типа поста">
          <PostTypeDemo />
        </Sandbox>
      </div>

      <p><strong>Два варианта работы:</strong></p>
      <ul>
        <li><strong>"Использовать отложенный пост"</strong> — если вы уже создали пост в разделе "Посты" и хотите использовать его</li>
        <li><strong>"Создать новый пост здесь"</strong> — если хотите написать текст и добавить фото/видео прямо в настройках конкурса</li>
      </ul>

      <div className="not-prose my-6">
        <Sandbox title="Создание нового поста с медиафайлами">
          <NewPostDemo />
        </Sandbox>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
        <p className="text-amber-800 m-0">
          <strong>Внимание:</strong> Если выберете "Использовать отложенный пост", убедитесь что пост уже создан в разделе "Посты" и добавлен в очередь публикации.
        </p>
      </div>

      {/* РАЗДЕЛ 3: УСЛОВИЯ УЧАСТИЯ */}
      <h3>3. Условия участия</h3>
      <p>
        Самый важный блок — здесь вы определяете, что должен сделать человек, чтобы участвовать в конкурсе. 
        Можно комбинировать несколько условий с логикой "И" и "ИЛИ".
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-4">
        <p className="!text-indigo-900 !m-0">
          <strong>Доступные условия:</strong> Лайк ❤️, Репост 📢, Комментарий 💬, Подписка 👥, Состоит в группе 🤝, Подписан на рассылку 📩
        </p>
      </div>

      <div className="not-prose my-6">
        <Sandbox title="Конструктор условий участия">
          <ConditionsDemo />
        </Sandbox>
      </div>

      <p><strong>Как работает логика условий:</strong></p>
      <ul>
        <li><strong>Внутри одной карточки (группы)</strong> — логика "И" (должны выполниться ВСЕ условия)</li>
        <li><strong>Между карточками</strong> — логика "ИЛИ" (достаточно выполнить условия ЛЮБОЙ карточки)</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
        <p className="text-green-800 m-0">
          <strong>Пример:</strong> Создайте две карточки: первая с условиями "Лайк И Репост", вторая — "Комментарий И Подписка". 
          Тогда пользователь может участвовать двумя способами: либо поставить лайк и сделать репост, либо написать комментарий и подписаться.
        </p>
      </div>

      {/* РАЗДЕЛ 4: РЕЗУЛЬТАТЫ */}
      <h3>4. Результаты конкурса</h3>
      <p>
        Настройки определения победителей: система может выбрать их автоматически сразу после окончания конкурса или дождаться вашего ручного запуска.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Выбор способа завершения">
          <FinishTypeDemo />
        </Sandbox>
      </div>

      <ul>
        <li><strong>"Автоматически"</strong> — система сама выберет победителей в указанное время</li>
        <li><strong>"Вручную"</strong> — вы сами решите когда запустить определение победителей</li>
      </ul>

      <div className="not-prose my-6">
        <Sandbox title="Настройка количества победителей и времени">
          <ResultsSettingsDemo />
        </Sandbox>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 m-0">
            <strong>Совет:</strong> Для конкурсов с большим призовым фондом используйте ручное завершение — так вы сможете проверить победителей перед объявлением результатов.
          </p>
        </div>
      </div>

      {/* РАЗДЕЛ 5: ШАБЛОНЫ СООБЩЕНИЙ */}
      <h3>5. Шаблоны сообщений</h3>
      <p>
        Система автоматически отправит сообщения победителям и участникам, которые не выиграли. Здесь вы настраиваете текст этих сообщений.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Редактор сообщения победителю">
          <WinnerMessageDemo />
        </Sandbox>
      </div>

      <p><strong>Доступные переменные для подстановки:</strong></p>
      <ul>
        <li><code>{'{USER_NAME}'}</code> — имя пользователя</li>
        <li><code>{'{USER_FIRST_NAME}'}</code> — имя</li>
        <li><code>{'{USER_LAST_NAME}'}</code> — фамилия</li>
        <li><code>{'{CONTEST_NAME}'}</code> — название конкурса</li>
        <li><code>{'{PROJECT_NAME}'}</code> — название проекта</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
        <p className="text-green-800 m-0">
          <strong>Совет:</strong> Используйте переменные для персонализации — обращение по имени повышает доверие и отклик участников.
        </p>
      </div>

      <div className="not-prose my-6">
        <Sandbox title="Редактор сообщения проигравшему">
          <LoserMessageDemo />
        </Sandbox>
      </div>

      {/* РАЗДЕЛ 6: ПОСТ С РЕЗУЛЬТАТАМИ */}
      <h3>6. Пост с результатами</h3>
      <p>
        После завершения конкурса система может автоматически опубликовать пост с объявлением победителей.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Автоматическая публикация результатов">
          <ResultsPostDemo />
        </Sandbox>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
        <p className="text-amber-800 m-0">
          <strong>Внимание:</strong> Если включите автоматическую публикацию, пост с результатами появится сразу после определения победителей. 
          Убедитесь что текст и изображения настроены правильно.
        </p>
      </div>

      <h2>Циклический перезапуск</h2>
      <p>
        Для регулярных конкурсов (например, еженедельных) есть функция автоматического перезапуска.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Настройка циклического перезапуска">
          <CyclicRestartDemo />
        </Sandbox>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-4">
        <p className="!text-indigo-900 !m-0">
          <strong>Как это работает:</strong> После завершения конкурса система автоматически запустит новый через указанный интервал с теми же настройками.
          Это удобно для серийных конкурсов — настроил один раз, и система работает сама.
        </p>
      </div>

      <h2>📊 Сравнение подходов</h2>
      
      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Задача</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Без системы (вручную)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">С системой (автоматически)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Отслеживание участников</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Вручную записывать в Excel, следить за лайками/репостами</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Система сама собирает всех участников</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Проверка условий</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Заходить в профиль каждого, проверять подписки</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматическая проверка всех условий</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Выбор победителей</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Использовать random.org или тянуть жребий</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Случайный выбор из валидных участников</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Уведомление победителей</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Писать каждому лично, копировать текст</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматическая рассылка по шаблону</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Публикация результатов</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Вручную создавать пост, искать ссылки на победителей</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматический пост с упоминаниями</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-2">Время на конкурс</td>
              <td className="border border-gray-300 px-4 py-2 text-red-700">3-5 часов</td>
              <td className="border border-gray-300 px-4 py-2 text-green-700">10-15 минут</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Альтернативы</h2>
      <p>Если универсальные конкурсы не подходят под вашу задачу:</p>
      <ul>
        <li><strong>Конкурс отзывов</strong> — если хотите собирать отзывы от клиентов и выбирать победителей среди них</li>
        <li><strong>Дроп промокодов</strong> — если нужно раздать промокоды первым N участникам без жеребьёвки</li>
        <li><strong>Ручной конкурс в разделе "Посты"</strong> — если условия слишком сложные и требуют вашей оценки каждого участника</li>
      </ul>

      <h2>❓ Частые вопросы</h2>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Можно ли изменить условия конкурса после запуска?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Нет, после активации конкурса условия изменить нельзя — это гарантирует честность для уже зарегистрированных участников. 
            Если нужно что-то поменять, выключите текущий конкурс и создайте новый.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Что если участников больше чем мест для победителей?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Система случайным образом выберет нужное количество победителей из всех валидных участников. 
            Каждый участник имеет равные шансы на победу.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Можно ли вручную добавить или исключить участника?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            На текущий момент нет, система работает только с автоматическим сбором участников по заданным условиям. 
            Это сделано специально для прозрачности и честности конкурса.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Что делать если конкурс завис или работает неправильно?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Выключите конкурс переключателем, проверьте все настройки (особенно условия и даты), затем включите снова. 
            Если проблема повторяется — обратитесь к технической поддержке с названием конкурса и описанием проблемы.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Как работает циклический перезапуск?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            После завершения конкурса система ждёт указанный интервал (например, 7 дней) и автоматически запускает новый конкурс с теми же настройками. 
            Это удобно для еженедельных или ежемесячных конкурсов — настраиваете один раз, и система работает постоянно.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Могу ли я видеть список участников до завершения конкурса?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Да, на вкладке "Участники" вы можете в реальном времени видеть всех, кто уже выполнил условия участия. 
            Это помогает оценить популярность конкурса и при необходимости скорректировать стратегию продвижения.
          </p>
        </div>
      </details>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
        <h3 className="!mt-0 !text-green-800">🎯 Итог: Ваша выгода</h3>
        <p className="!text-gray-800">
          Страница настроек универсального конкурса — это полная автоматизация процесса проведения конкурсов. 
          Вместо 3-5 часов ручной работы вы тратите 10-15 минут на настройку, а система берёт на себя всю рутину: 
          отслеживание участников, проверку условий, выбор победителей, рассылку сообщений и публикацию результатов.
        </p>
        <p className="!text-gray-800 !mb-0">
          <strong>Результат:</strong> Вы можете запускать конкурсы регулярно, увеличивая вовлечённость аудитории, без дополнительной нагрузки на команду.
        </p>
      </div>

      <NavigationButtons 
        topicId={topicId}
        subtopicId={subtopicId}
        itemId={itemId}
      />
    </div>
  );
};

// Демо-компоненты для интерактивных примеров

const BasicParamsDemo: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [contestName, setContestName] = useState('');

  return (
    <div className="space-y-4 p-4">
      {/* Переключатель активности */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Конкурс активен</span>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isActive ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isActive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Поле названия */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название конкурса
        </label>
        <input
          type="text"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          placeholder="Например: Еженедельный розыгрыш мерча"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Индикатор состояния */}
      <div className={`p-3 rounded-lg ${isActive ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
        {isActive ? '✅ Конкурс запущен и принимает участников' : '⏸️ Конкурс остановлен'}
      </div>
    </div>
  );
};

const DateTimeDemo: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-02-20');
  const [startTime, setStartTime] = useState('12:00');
  const [days, setDays] = useState(7);
  const [hours, setHours] = useState(0);

  return (
    <div className="space-y-4 p-4">
      {/* Дата и время начала */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата начала
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время начала
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Длительность */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дней
          </label>
          <input
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Часов
          </label>
          <input
            type="number"
            min="0"
            max="23"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Итоговая информация */}
      <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800">
        Конкурс начнётся {startDate} в {startTime} и продлится {days} {days === 1 ? 'день' : 'дней'} {hours > 0 ? `и ${hours} ${hours === 1 ? 'час' : 'часов'}` : ''}
      </div>
    </div>
  );
};

const PostTypeDemo: React.FC = () => {
  const [postType, setPostType] = useState<'deferred' | 'new'>('new');

  return (
    <div className="space-y-4 p-4">
      {/* Сегментированный контрол */}
      <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        <button
          onClick={() => setPostType('deferred')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            postType === 'deferred'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Использовать отложенный пост
        </button>
        <button
          onClick={() => setPostType('new')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            postType === 'new'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Создать новый пост здесь
        </button>
      </div>

      {/* Контент в зависимости от выбора */}
      <div className="mt-4">
        {postType === 'deferred' ? (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              💡 Выберите готовый пост из списка отложенных постов проекта
            </p>
          </div>
        ) : (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">
              ✍️ Создайте новый пост: добавьте текст, изображения и видео прямо здесь
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const NewPostDemo: React.FC = () => {
  const [postText, setPostText] = useState('');

  return (
    <div className="space-y-4 p-4">
      {/* Редактор текста */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Текст поста
        </label>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="🎉 Разыгрываем крутые призы! Условия участия:..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Кнопки добавления медиа */}
      <div className="flex gap-2">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-lg">🖼️</span>
          <span className="text-sm font-medium text-gray-700">Добавить фото</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="text-lg">🎥</span>
          <span className="text-sm font-medium text-gray-700">Добавить видео</span>
        </button>
      </div>

      {/* Превью */}
      {postText && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Превью поста:</p>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{postText}</p>
        </div>
      )}
    </div>
  );
};

const ConditionsDemo: React.FC = () => {
  const [groups, setGroups] = useState<Array<{ id: number; conditions: Array<{ type: string; label: string; emoji: string }> }>>([
    { id: 1, conditions: [{ type: 'like', label: 'Лайк', emoji: '❤️' }] }
  ]);

  const conditionTypes = [
    { type: 'like', label: 'Лайк', emoji: '❤️' },
    { type: 'repost', label: 'Репост', emoji: '📢' },
    { type: 'comment', label: 'Комментарий', emoji: '💬' },
    { type: 'subscription', label: 'Подписка', emoji: '👥' },
    { type: 'member_of_group', label: 'Состоит в группе', emoji: '🤝' },
    { type: 'mailing', label: 'Подписан на рассылку', emoji: '📩' },
  ];

  const addGroup = () => {
    setGroups([...groups, { id: Date.now(), conditions: [{ type: 'like', label: 'Лайк', emoji: '❤️' }] }]);
  };

  const removeGroup = (groupId: number) => {
    setGroups(groups.filter(g => g.id !== groupId));
  };

  const addCondition = (groupId: number, condType: typeof conditionTypes[0]) => {
    setGroups(groups.map(g => 
      g.id === groupId 
        ? { ...g, conditions: [...g.conditions, condType] }
        : g
    ));
  };

  const removeCondition = (groupId: number, condIndex: number) => {
    setGroups(groups.map(g =>
      g.id === groupId
        ? { ...g, conditions: g.conditions.filter((_, i) => i !== condIndex) }
        : g
    ));
  };

  return (
    <div className="space-y-4 p-4">
      {groups.map((group, groupIndex) => (
        <div key={group.id}>
          {/* Разделитель ИЛИ между группами */}
          {groupIndex > 0 && (
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-gray-300" />
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">ИЛИ</span>
              <div className="flex-1 h-px bg-gray-300" />
            </div>
          )}

          {/* Карточка группы условий */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Группа условий #{groupIndex + 1}</span>
              {groups.length > 1 && (
                <button
                  onClick={() => removeGroup(group.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>

            {/* Список условий в группе */}
            <div className="space-y-2">
              {group.conditions.map((cond, condIndex) => (
                <div key={condIndex}>
                  {condIndex > 0 && (
                    <div className="text-center text-xs font-medium text-gray-500 my-1">И</div>
                  )}
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                    <span className="text-2xl">{cond.emoji}</span>
                    <span className="flex-1 text-sm font-medium text-gray-700">{cond.label}</span>
                    <button
                      onClick={() => removeCondition(group.id, condIndex)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Кнопка добавления условия в группу */}
            <div className="relative mt-3">
              <details className="group">
                <summary className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer list-none">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Добавить условие</span>
                </summary>
                <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                  {conditionTypes.map((ct) => (
                    <button
                      key={ct.type}
                      onClick={() => {
                        addCondition(group.id, ct);
                        // Закрываем details
                        const details = document.querySelector('details[open]');
                        if (details) details.removeAttribute('open');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-xl">{ct.emoji}</span>
                      <span className="text-sm text-gray-700">{ct.label}</span>
                    </button>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>
      ))}

      {/* Кнопка добавления новой группы */}
      <button
        onClick={addGroup}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Добавить альтернативную группу (ИЛИ)</span>
      </button>
    </div>
  );
};

const FinishTypeDemo: React.FC = () => {
  const [finishType, setFinishType] = useState<'auto' | 'manual'>('auto');

  return (
    <div className="space-y-4 p-4">
      <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-gray-50">
        <button
          onClick={() => setFinishType('auto')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            finishType === 'auto'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Автоматически
        </button>
        <button
          onClick={() => setFinishType('manual')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            finishType === 'manual'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Вручную
        </button>
      </div>

      <div className="mt-4">
        {finishType === 'auto' ? (
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800 text-sm">
              ⚙️ Система автоматически выберет победителей в указанное время после окончания конкурса
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800 text-sm">
              👤 Вы сами решите когда запустить выбор победителей после окончания конкурса
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ResultsSettingsDemo: React.FC = () => {
  const [winnersCount, setWinnersCount] = useState(3);
  const [finishDate, setFinishDate] = useState('2026-02-27');
  const [finishTime, setFinishTime] = useState('18:00');

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Количество победителей
        </label>
        <input
          type="number"
          min="1"
          value={winnersCount}
          onChange={(e) => setWinnersCount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата завершения
          </label>
          <input
            type="date"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Время завершения
          </label>
          <input
            type="time"
            value={finishTime}
            onChange={(e) => setFinishTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-800">
        Будет выбрано {winnersCount} {winnersCount === 1 ? 'победитель' : winnersCount < 5 ? 'победителя' : 'победителей'} {finishDate} в {finishTime}
      </div>
    </div>
  );
};

const WinnerMessageDemo: React.FC = () => {
  const [message, setMessage] = useState('Поздравляем, {USER_FIRST_NAME}! 🎉\n\nВы выиграли в конкурсе "{CONTEST_NAME}"!\nСвяжитесь с нами для получения приза.');

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Сообщение победителю
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {['{USER_NAME}', '{USER_FIRST_NAME}', '{CONTEST_NAME}', '{PROJECT_NAME}'].map((variable) => (
          <button
            key={variable}
            onClick={() => {
              const textarea = document.querySelector('textarea');
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newText = message.substring(0, start) + variable + message.substring(end);
                setMessage(newText);
              }
            }}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded hover:bg-gray-200 transition-colors"
          >
            {variable}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Превью (с подставленными значениями):</p>
        <p className="text-sm text-gray-800 whitespace-pre-wrap">
          {message
            .replace('{USER_NAME}', 'Иван Петров')
            .replace('{USER_FIRST_NAME}', 'Иван')
            .replace('{USER_LAST_NAME}', 'Петров')
            .replace('{CONTEST_NAME}', 'Еженедельный розыгрыш мерча')
            .replace('{PROJECT_NAME}', 'Сообщество геймеров')}
        </p>
      </div>
    </div>
  );
};

const LoserMessageDemo: React.FC = () => {
  const [message, setMessage] = useState('Привет, {USER_FIRST_NAME}!\n\nК сожалению, в этот раз вы не вошли в число победителей конкурса "{CONTEST_NAME}".\n\nНо не расстраивайтесь — следите за нашими обновлениями, скоро будет новый розыгрыш! 🎁');

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Сообщение проигравшему
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono text-sm"
        />
      </div>

      <div className="bg-amber-50 p-3 rounded-lg text-sm text-amber-800">
        ⚠️ Сообщения проигравшим отправляются массово. Будьте вежливы и позитивны — это мотивирует участвовать в будущих конкурсах.
      </div>
    </div>
  );
};

const ResultsPostDemo: React.FC = () => {
  const [autoPublish, setAutoPublish] = useState(true);
  const [postText, setPostText] = useState('');

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Автоматически публиковать пост с результатами</span>
        <button
          onClick={() => setAutoPublish(!autoPublish)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoPublish ? 'bg-indigo-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoPublish ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {autoPublish && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Текст поста с результатами
            </label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="🏆 Подводим итоги конкурса!&#10;&#10;Победители:&#10;{WINNERS_LIST}&#10;&#10;Поздравляем!"
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-lg">🖼️</span>
              <span className="text-sm font-medium text-gray-700">Добавить фото</span>
            </button>
          </div>
        </>
      )}

      <div className={`p-3 rounded-lg ${autoPublish ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'}`}>
        {autoPublish 
          ? '✅ Пост с результатами будет опубликован автоматически после определения победителей' 
          : '⏸️ Вам придётся опубликовать пост с результатами вручную'}
      </div>
    </div>
  );
};

const CyclicRestartDemo: React.FC = () => {
  const [cyclicRestart, setCyclicRestart] = useState(false);
  const [intervalDays, setIntervalDays] = useState(7);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="cyclic-restart"
          checked={cyclicRestart}
          onChange={(e) => setCyclicRestart(e.target.checked)}
          className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
        />
        <div className="flex-1">
          <label htmlFor="cyclic-restart" className="block text-sm font-medium text-gray-700 cursor-pointer">
            Автоматически перезапускать конкурс
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Система автоматически запустит новый конкурс через указанный интервал после завершения предыдущего
          </p>
        </div>
      </div>

      {cyclicRestart && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Интервал перезапуска (дней)
          </label>
          <input
            type="number"
            min="1"
            value={intervalDays}
            onChange={(e) => setIntervalDays(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Новый конкурс запустится через {intervalDays} {intervalDays === 1 ? 'день' : intervalDays < 5 ? 'дня' : 'дней'} после завершения предыдущего
          </p>
        </div>
      )}

      <div className={`p-3 rounded-lg ${cyclicRestart ? 'bg-indigo-50 text-indigo-800' : 'bg-gray-50 text-gray-600'}`}>
        {cyclicRestart 
          ? `♻️ Конкурс будет автоматически перезапускаться каждые ${intervalDays} ${intervalDays === 1 ? 'день' : intervalDays < 5 ? 'дня' : 'дней'}`
          : '⏹️ Конкурс завершится без автоматического перезапуска'}
      </div>
    </div>
  );
};

export default GeneralContestsSettingsPage;
