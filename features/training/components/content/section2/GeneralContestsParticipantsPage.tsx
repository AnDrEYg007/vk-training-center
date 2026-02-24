import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

const GeneralContestsParticipantsPage: React.FC<ContentProps> = ({ topicId, subtopicId, itemId }) => {
  return (
    <div className="prose prose-slate max-w-none">
      <h1>Участники конкурса</h1>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-800 m-0">
          <strong>Для кого эта страница:</strong> SMM-специалисты и руководители, которые проводят конкурсы и хотят видеть всех участников в реальном времени.
        </p>
      </div>

      <h2>Что это такое?</h2>
      <p>
        Вкладка "Участники" показывает полный список всех, кто выполнил условия конкурса. Система автоматически собирает участников после публикации стартового поста и отслеживает выполнение каждого условия. Вы видите кто участвует, какой у них статус обработки, и какой порядковый номер получил каждый человек.
      </p>

      <h2>⏱️ Было / Стало: Экономия времени</h2>
      
      <div className="grid grid-cols-2 gap-4 my-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="!text-red-800 !mt-0">❌ Было (ручная работа)</h3>
          <ul className="!text-red-700 space-y-2">
            <li>Вручную просматривать все комментарии и лайки</li>
            <li>Записывать участников в Excel таблицу</li>
            <li>Самостоятельно проверять выполнение условий</li>
            <li>Нумеровать участников вручную</li>
            <li>Постоянно обновлять список до конца конкурса</li>
            <li>Следить за дубликатами участников</li>
          </ul>
          <p className="!text-red-800 font-bold !mb-0 !mt-4">Время: 30-60 минут каждый день конкурса</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="!text-green-800 !mt-0">✅ Стало (автоматизация)</h3>
          <ul className="!text-green-700 space-y-2">
            <li>Система сама собирает всех участников</li>
            <li>Автоматическая проверка условий</li>
            <li>Автоматическая нумерация по порядку</li>
            <li>Обновление списка в реальном времени</li>
            <li>Автоматическая фильтрация дубликатов</li>
            <li>Видно статус обработки каждого</li>
          </ul>
          <p className="!text-green-800 font-bold !mb-0 !mt-4">Время: 0 минут — работает автоматически</p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg my-6">
        <p className="!text-indigo-900 !m-0">
          <strong>💡 Экономия:</strong> Вместо ежедневного ручного труда система работает в фоне и показывает актуальный список участников в любой момент. Вы просто открываете вкладку и видите всю информацию.
        </p>
      </div>

      <h2>Как выглядит список участников</h2>
      <p>
        После публикации стартового поста конкурса система начинает автоматически собирать участников. Каждый, кто выполнил условия, попадает в таблицу с полной информацией.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Пример списка участников">
          <ParticipantsTableDemo />
        </Sandbox>
      </div>

      <h3>Что показывается в таблице</h3>
      <p>Каждая строка содержит информацию об одном участнике:</p>
      
      <ul>
        <li><strong>Участник</strong> — имя и ссылка на профиль ВКонтакте (открывается в новой вкладке)</li>
        <li><strong>Пост</strong> — ссылка на пост участника и превью текста (если это комментарий или репост с текстом)</li>
        <li><strong>Номер</strong> — порядковый номер регистрации в конкурсе (1, 2, 3...)</li>
        <li><strong>Статус</strong> — текущее состояние обработки (цветной бейдж)</li>
        <li><strong>Дата</strong> — когда человек зарегистрировался в конкурсе</li>
      </ul>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 m-0">
            <strong>Удобно:</strong> Наведите курсор на строку участника — она подсветится, так легче читать длинные списки.
          </p>
        </div>
      </div>

      <h2>Статусы участников</h2>
      <p>
        Система отслеживает в каком состоянии находится обработка каждого участника. Статус показывается цветным бейджем в столбце "Статус".
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Все возможные статусы">
          <StatusBadgesDemo />
        </Sandbox>
      </div>

      <p><strong>Расшифровка статусов:</strong></p>
      
      <div className="space-y-3 my-4">
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 flex-shrink-0">Обработан</span>
          <div>
            <p className="!m-0 text-sm text-green-800">
              Участник прошёл проверку условий, получил порядковый номер и может претендовать на победу. Это финальный статус для обычных участников.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-pulse flex-shrink-0">В очереди</span>
          <div>
            <p className="!m-0 text-sm text-blue-800">
              Система обнаружила участника, но ещё проверяет выполнение условий. Обычно обработка занимает несколько секунд. Бейдж мигает, показывая активный процесс.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">Победитель</span>
          <div>
            <p className="!m-0 text-sm text-amber-900">
              Участник был случайно выбран победителем при подведении итогов конкурса. Система автоматически присваивает этот статус при завершении.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 flex-shrink-0">Ошибка</span>
          <div>
            <p className="!m-0 text-sm text-red-800">
              Произошла ошибка при проверке условий (например, участник удалил комментарий или закрыл профиль). Такие участники не попадают в розыгрыш.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 flex-shrink-0">Новый</span>
          <div>
            <p className="!m-0 text-sm text-gray-800">
              Только что обнаруженный участник, обработка еще не началась. Обычно быстро меняется на "В очереди".
            </p>
          </div>
        </div>
      </div>

      <h2>Счётчик и кнопки управления</h2>
      <p>
        В верхней части вкладки расположена панель с общей информацией и действиями.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Панель управления списком участников">
          <HeaderActionsDemo />
        </Sandbox>
      </div>

      <h3>Что здесь есть:</h3>

      <ul>
        <li>
          <strong>Счётчик "Всего участников"</strong> — показывает сколько человек выполнили условия конкурса. 
          Обновляется автоматически при загрузке новых данных.
        </li>
        <li>
          <strong>Кнопка "Обновить"</strong> — вручную загружает актуальный список участников с сервера. 
          Полезно если хотите увидеть новых участников не перезагружая всю страницу.
        </li>
        <li>
          <strong>Кнопка "Очистить"</strong> (только для администраторов) — удаляет всех участников из списка. 
          Используется если нужно сбросить конкурс и начать сбор заново. Требует подтверждения действия.
        </li>
      </ul>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-4">
        <p className="text-amber-800 m-0">
          <strong>Внимание:</strong> Кнопка "Очистить" безвозвратно удаляет всех участников! Используйте её только если точно уверены. 
          Обычные пользователи (не администраторы) эту кнопку не видят.
        </p>
      </div>

      <h2>Состояния отображения</h2>
      <p>
        В зависимости от ситуации вкладка может показывать разное содержимое.
      </p>

      <h3>1. Загрузка данных</h3>
      <p>
        Когда список участников загружается с сервера, вместо таблицы показывается анимированный индикатор загрузки.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Индикатор загрузки">
          <LoadingStateDemo />
        </Sandbox>
      </div>

      <h3>2. Нет участников</h3>
      <p>
        Если конкурс ещё не запущен или никто пока не выполнил условия, показывается подсказка.
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Пустой список участников">
          <EmptyStateDemo />
        </Sandbox>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-blue-800 m-0">
            <strong>Помните:</strong> Сбор участников начинается только после публикации стартового поста конкурса. 
            Если вы создали конкурс, но не опубликовали пост — список будет пустым.
          </p>
        </div>
      </div>

      <h3>3. Список участников</h3>
      <p>
        Когда есть хотя бы один участник, показывается полная таблица с возможностью прокрутки.
      </p>

      <h2>Порядковые номера</h2>
      <p>
        Каждый участник получает уникальный порядковый номер в порядке регистрации. Номер показывается в круглом бейдже синего цвета в столбце "Номер".
      </p>

      <div className="not-prose my-6">
        <Sandbox title="Пример порядковых номеров">
          <EntryNumbersDemo />
        </Sandbox>
      </div>

      <p><strong>Для чего нужны номера:</strong></p>
      <ul>
        <li>Честность розыгрыша — каждый получает номер по порядку прихода</li>
        <li>Прозрачность — участники могут видеть свой номер в комментариях</li>
        <li>Удобство — легко ссылаться на конкретного участника</li>
        <li>История — номер остаётся навсегда, даже если пост удалён</li>
      </ul>

      <h2>Ссылки на ВКонтакте</h2>
      <p>
        Все имена участников и посты — это кликабельные ссылки, которые открываются в новой вкладке браузера.
      </p>

      <ul>
        <li><strong>Ссылка на участника:</strong> <code>https://vk.com/id{'{число}'}</code> — открывает профиль человека</li>
        <li><strong>Ссылка на пост:</strong> Если участник сделал репост или комментарий, можно открыть его пост напрямую</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
        <p className="text-green-800 m-0">
          <strong>Совет:</strong> Используйте ссылки на профили чтобы проверить реальность участников. 
          Это помогает выявить боты или фейковые аккаунты перед выбором победителей.
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
              <td className="border border-gray-300 px-4 py-2">Сбор участников</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Просматривать комментарии/лайки вручную</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматический сбор в фоне</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Проверка условий</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Заходить в каждый профиль вручную</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматическая проверка всех условий</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Нумерация участников</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Вручную присваивать номера в Excel</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматическая нумерация по порядку</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Отслеживание дубликатов</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Проверять вручную по ID</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Автоматическая фильтрация дубликатов</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Обновление списка</td>
              <td className="border border-gray-300 px-4 py-2 bg-red-50">Каждый час заново собирать</td>
              <td className="border border-gray-300 px-4 py-2 bg-green-50">Одна кнопка "Обновить"</td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-gray-300 px-4 py-2">Время на обслуживание</td>
              <td className="border border-gray-300 px-4 py-2 text-red-700">30-60 мин/день</td>
              <td className="border border-gray-300 px-4 py-2 text-green-700">0 минут</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>❓ Частые вопросы</h2>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Почему в списке нет нового участника, хотя он выполнил условия?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Система собирает участников периодически (обычно раз в несколько минут). Нажмите кнопку "Обновить" чтобы загрузить свежие данные с сервера. Если участник всё равно не появился — проверьте выполнены ли все условия конкурса.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Можно ли вручную добавить или удалить участника из списка?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Нет, ручное редактирование списка невозможно — это гарантирует честность конкурса. Система автоматически добавляет только тех, кто выполнил условия. Единственное исключение — кнопка "Очистить" для админов, которая удаляет всех участников сразу.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Что означает статус "Ошибка" и что с этим делать?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Статус "Ошибка" появляется когда система не смогла проверить выполнение условий. Причины: участник удалил пост/комментарий, закрыл профиль, или временные технические проблемы ВКонтакте. Такие участники автоматически исключаются из розыгрыша.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Как экспортировать список участников в Excel?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Функция экспорта в Excel пока не реализована в интерфейсе. Если нужен список участников в файле — обратитесь к техническому специалисту или администратору, они могут выгрузить данные напрямую из базы.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Сколько участников может обработать система?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Система справляется с любым количеством участников — от десятков до десятков тысяч. Таблица имеет прокрутку, так что даже при большом списке интерфейс остаётся удобным. Обработка происходит партиями в фоновом режиме.
          </p>
        </div>
      </details>

      <details className="mb-4">
        <summary className="font-semibold cursor-pointer text-indigo-600 hover:text-indigo-800">
          Можно ли искать участника по имени или номеру?
        </summary>
        <div className="mt-2 pl-4 border-l-2 border-gray-300">
          <p>
            Функция поиска и фильтрации пока не реализована. Для поиска конкретного участника используйте встроенный поиск браузера (Ctrl+F / Cmd+F) прямо на странице.
          </p>
        </div>
      </details>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 my-8 rounded-r-lg">
        <h3 className="!mt-0 !text-green-800">🎯 Итог: Ваша выгода</h3>
        <p className="!text-gray-800">
          Вкладка "Участники" — это полная автоматизация самой трудоёмкой части проведения конкурса. 
          Вместо ежедневной ручной работы по сбору и проверке участников система делает всё сама: собирает, проверяет, нумерует и обновляет список в реальном времени.
        </p>
        <p className="!text-gray-800 !mb-0">
          <strong>Результат:</strong> Вы экономите 30-60 минут каждый день конкурса и получаете стопроцентную точность — ни один участник не потеряется, все условия проверены автоматически.
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

// =====================================================================
// Демо-компоненты для интерактивных примеров
// =====================================================================

const ParticipantsTableDemo: React.FC = () => {
  const mockParticipants = [
    { 
      id: '1', 
      user_name: 'Анна Смирнова', 
      user_vk_id: 123456, 
      post_link: 'https://vk.com/wall-123456_789',
      vk_post_id: 789,
      post_text: 'Участвую в конкурсе! Очень хочу выиграть 🎁',
      entry_number: 1, 
      status: 'processed', 
      created_at: '2026-02-19T10:30:00' 
    },
    { 
      id: '2', 
      user_name: 'Иван Петров', 
      user_vk_id: 234567, 
      post_link: 'https://vk.com/wall-123456_790',
      vk_post_id: 790,
      post_text: '',
      entry_number: 2, 
      status: 'processed', 
      created_at: '2026-02-19T11:15:00' 
    },
    { 
      id: '3', 
      user_name: 'Мария Кузнецова', 
      user_vk_id: 345678,
      post_link: 'https://vk.com/wall-123456_791',
      vk_post_id: 791,
      post_text: 'Отличный конкурс, давно хотела такой приз!',
      entry_number: 3, 
      status: 'processing', 
      created_at: '2026-02-19T12:45:00' 
    },
    { 
      id: '4', 
      user_name: null,
      user_vk_id: 456789,
      post_link: null,
      vk_post_id: 0,
      post_text: '',
      entry_number: 0, 
      status: 'error', 
      created_at: '2026-02-19T13:20:00' 
    },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Обработан</span>;
      case 'processing':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">В очереди</span>;
      case 'winner':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Победитель</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Ошибка</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">Новый</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-auto max-h-96">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3">Участник</th>
              <th className="px-4 py-3">Пост</th>
              <th className="px-4 py-3 w-24 text-center">Номер</th>
              <th className="px-4 py-3 w-32">Статус</th>
              <th className="px-4 py-3 w-40">Дата</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockParticipants.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-medium text-indigo-600">
                    {p.user_name || `ID: ${p.user_vk_id}`}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 truncate max-w-xs">
                  {p.post_link ? (
                    <div>
                      <span className="text-indigo-600">Пост #{p.vk_post_id}</span>
                      {p.post_text && (
                        <div className="text-xs text-gray-500 line-clamp-2 mt-1">{p.post_text}</div>
                      )}
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.entry_number > 0 ? (
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">{p.entry_number}</span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3">{statusBadge(p.status)}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                  {new Date(p.created_at).toLocaleString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadgesDemo: React.FC = () => {
  const statuses = [
    { status: 'processed', label: 'Обработан', desc: 'Прошёл проверку, участвует в розыгрыше' },
    { status: 'processing', label: 'В очереди', desc: 'Система проверяет условия (мигает)' },
    { status: 'winner', label: 'Победитель', desc: 'Выбран при подведении итогов' },
    { status: 'error', label: 'Ошибка', desc: 'Не прошёл проверку условий' },
    { status: 'new', label: 'Новый', desc: 'Только обнаружен системой' },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'processed':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Обработан</span>;
      case 'processing':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">В очереди</span>;
      case 'winner':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">Победитель</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Ошибка</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">Новый</span>;
    }
  };

  return (
    <div className="space-y-3">
      {statuses.map((s) => (
        <div key={s.status} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          {statusBadge(s.status)}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{s.label}</p>
            <p className="text-xs text-gray-600">{s.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const HeaderActionsDemo: React.FC = () => {
  const [participantsCount, setParticipantsCount] = useState(47);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setParticipantsCount(prev => prev + Math.floor(Math.random() * 5));
      setIsRefreshing(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <div className="text-sm text-gray-500">
          Всего участников: <strong className="text-gray-800">{participantsCount}</strong>
        </div>
        <div className="flex gap-2">
          <button 
            className="px-3 py-1.5 text-sm bg-white border border-red-200 rounded hover:bg-red-50 text-red-600 transition-colors"
            onClick={() => alert('Требуется подтверждение действия')}
          >
            Очистить
          </button>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
          >
            {isRefreshing ? '...' : 'Обновить'}
          </button>
        </div>
      </div>
      <div className="p-4 text-center text-gray-400 text-sm">
        Нажмите "Обновить" чтобы увидеть изменение счётчика
      </div>
    </div>
  );
};

const LoadingStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
      <div className="flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">Загрузка списка участников...</p>
    </div>
  );
};

const EmptyStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-12">
      <div className="text-center text-gray-400 text-sm">
        <p className="text-base mb-2">Нет участников.</p>
        <p>Сбор начнется после публикации стартового поста.</p>
      </div>
    </div>
  );
};

const EntryNumbersDemo: React.FC = () => {
  const numbers = [1, 2, 3, 15, 42, 158];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
      {numbers.map(num => (
        <div key={num} className="flex flex-col items-center gap-2">
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
            {num}
          </span>
          <span className="text-xs text-gray-500">Участник #{num}</span>
        </div>
      ))}
    </div>
  );
};

export default GeneralContestsParticipantsPage;
