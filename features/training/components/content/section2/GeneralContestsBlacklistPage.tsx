import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

export const GeneralContestsBlacklistPage: React.FC<ContentProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Чёрный список участников
        </h1>
        <p className="text-lg text-gray-600">
          Узнайте, как исключать пользователей из конкурса, устанавливать временные блокировки и управлять списком нежелательных участников.
        </p>
      </div>

      {/* Что это такое */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Что такое "Чёрный список"?
        </h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="text-red-700">Чёрный список</strong> — это механизм защиты конкурса от недобросовестных участников. Пользователи из чёрного списка автоматически исключаются из розыгрыша, даже если выполнили все условия.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong>Кого добавлять:</strong>
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Накрутчики</strong> — аккаунты, созданные только для участия в конкурсах (пустой профиль, без активности)</li>
            <li><strong>Многократные победители</strong> — если нужно дать шанс новым участникам</li>
            <li><strong>Нарушители правил</strong> — оскорбления в комментариях, спам, попытки обмануть систему</li>
            <li><strong>Проблемные получатели</strong> — те, кто не забирает призы или отказывается от них</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Блокировка может быть <strong>постоянной</strong> (навсегда) или <strong>временной</strong> (до определённой даты). Это позволяет гибко управлять доступом к конкурсам.
          </p>
        </div>
      </section>

      {/* Было/Стало */}
      <section className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Было / Стало
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Было */}
          <div className="bg-white rounded-lg p-5 border-2 border-red-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900">Было (вручную)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Записывали ID нарушителей в отдельный файл</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Вручную проверяли каждого участника перед розыгрышем</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Забывали исключить заблокированных — они попадали в победители</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Не было временных блокировок — только навсегда</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Приходилось искать профиль VK, копировать ID, вставлять в список</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700">
                ⏱ Время: ~10 минут на каждого нарушителя
              </p>
            </div>
          </div>

          {/* Стало */}
          <div className="bg-white rounded-lg p-5 border-2 border-green-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 text-xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-green-900">Стало (автоматически)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Кнопка "Добавить в ЧС" — вставляешь ссылки на профили</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Система автоматически исключает их из розыгрыша</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Можно заблокировать до определённой даты (например, на месяц)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>Массовое добавление — несколько ссылок сразу</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span>История блокировок: видно, когда добавлен, до какой даты</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-sm font-semibold text-green-700">
                ⏱ Время: ~30 секунд на добавление
              </p>
              <p className="text-xs text-green-600 mt-1">
                💰 Экономия: 9.5 минут
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Интерактивные демонстрации */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Интерактивные примеры
        </h2>

        {/* 1. Общий вид таблицы */}
        <Sandbox
          title="1. Общий вид чёрного списка"
          description="Таблица с заблокированными пользователями. В шапке — заголовок, описание и кнопка добавления. Таблица из 4 колонок показывает кто заблокирован, на какой срок и когда добавлен."
          highlight="red"
        >
          <BlacklistTableDemo />
        </Sandbox>

        {/* 2. Кнопка "Добавить в ЧС" */}
        <Sandbox
          title="2. Кнопка добавления в чёрный список"
          description="Кнопка 'Добавить в ЧС' оформлена в красной теме (bg-red-50, text-red-600). При клике открывается всплывающее окно для ввода данных. Если конкурс не сохранён, показывается предупреждение."
          highlight="red"
          instructions={[
            'Кнопка имеет красную тему, чтобы визуально подчеркнуть опасное действие',
            'При наведении фон становится ярче (hover:bg-red-100)',
            'Если конкурс не сохранён, показывается toast-уведомление'
          ]}
        >
          <AddToBlacklistButtonDemo />
        </Sandbox>

        {/* 3. Всплывающее окно добавления */}
        <Sandbox
          title="3. Всплывающее окно добавления в ЧС"
          description="Окно для добавления пользователей: textarea для ссылок (построчно), выбор срока блокировки (бессрочно или до даты), кнопки отмены и сохранения."
          highlight="red"
          instructions={[
            'Можно вставить несколько ссылок — по одной в строке',
            'Система автоматически извлекает VK ID из ссылок типа https://vk.com/id12345',
            'Выбор срока: радио-кнопки "Бессрочно" / "До даты"',
            'При выборе "До даты" появляется календарь'
          ]}
        >
          <AddBlacklistModalDemo />
        </Sandbox>

        {/* 4. Таблица с записями */}
        <Sandbox
          title="4. Таблица заблокированных пользователей"
          description="4 колонки: Пользователь (имя или VK ID), Срок (дата или 'Навсегда'), Добавлен (дата), Действия (кнопка 'Удалить'). Строки подсвечиваются при наведении."
          highlight="red"
          instructions={[
            'Если у пользователя нет имени, показывается "ID {vk_id}"',
            'Срок блокировки: дата в формате ДД.ММ.ГГГГ или текст "Навсегда"',
            'Кнопка "Удалить" — красный текст (text-red-600)'
          ]}
        >
          <BlacklistTableRowsDemo />
        </Sandbox>

        {/* 5. Срок блокировки (временная) */}
        <Sandbox
          title="5. Временная блокировка до даты"
          description="При выборе 'До даты' в модальном окне появляется календарь для выбора срока окончания блокировки. После этой даты пользователь автоматически разблокируется."
          highlight="red"
          instructions={[
            'Выбор даты через календарь (CustomDatePicker)',
            'Дата окончания показывается в таблице',
            'Система автоматически разблокирует после истечения срока'
          ]}
        >
          <TemporaryBlockDemo />
        </Sandbox>

        {/* 6. Удаление из ЧС */}
        <Sandbox
          title="6. Удаление из чёрного списка (разблокировка)"
          description="При клике на 'Удалить' показывается всплывающее окно подтверждения с вопросом 'Разблокировать {name}?'. Это предотвращает случайное удаление."
          highlight="red"
          instructions={[
            'Всплывающее окно использует компонент ConfirmationModal',
            'Текст кнопки подтверждения: "Разблокировать"',
            'Во время удаления кнопка блокируется и показывает индикатор'
          ]}
        >
          <DeleteFromBlacklistDemo />
        </Sandbox>

        {/* 7. Пустое состояние */}
        <Sandbox
          title="7. Пустой чёрный список"
          description="Если в чёрном списке нет записей, показывается информативное сообщение 'Пусто.' в центре таблицы."
          highlight="red"
        >
          <EmptyStateDemo />
        </Sandbox>

        {/* 8. Загрузка */}
        <Sandbox
          title="8. Загрузка списка с сервера"
          description="При первом открытии вкладки или обновлении данных показывается анимированный индикатор загрузки в центре экрана (indigo spinner)."
          highlight="red"
        >
          <LoadingStateDemo />
        </Sandbox>
      </section>

      {/* Частые вопросы */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Частые вопросы
        </h2>
        
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Как работает временная блокировка?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                При добавлении пользователя в чёрный список вы выбираете срок блокировки:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Бессрочно</strong> — пользователь остаётся в чёрном списке навсегда, пока вы его не удалите вручную</li>
                <li><strong>До даты</strong> — выбираете конкретную дату окончания блокировки. После этой даты система автоматически разблокирует пользователя</li>
              </ul>
              <p className="text-sm text-red-700 bg-red-50 p-2 rounded border border-red-200 mt-3">
                💡 <strong>Совет:</strong> Используйте временные блокировки для тех, кто нарушил правила впервые — дайте им второй шанс через месяц.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Можно ли добавить несколько пользователей сразу?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Да! В модальном окне "Добавить в ЧС" есть поле для ввода ссылок. Вставьте ссылки на профили VK <strong>по одной в строке</strong>:
              </p>
              <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs mt-2 mb-2 overflow-x-auto">
{`https://vk.com/id12345
https://vk.com/durov
https://vk.com/id999888`}
              </pre>
              <p className="text-gray-700">
                Система автоматически извлечёт VK ID из каждой ссылки и добавит всех пользователей в чёрный список одновременно.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что произойдёт, если заблокированный пользователь уже участвует?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Если пользователь уже в списке участников конкурса, а вы добавили его в чёрный список, система автоматически исключит его при следующем обновлении списка участников. Он <strong>не попадёт в розыгрыш</strong>, даже если выполнил все условия.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Как удалить пользователя из чёрного списка (разблокировать)?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Найдите пользователя в таблице чёрного списка и нажмите кнопку <strong>"Удалить"</strong> (красный текст) в колонке "Действия". Появится всплывающее окно подтверждения с вопросом:
              </p>
              <div className="bg-gray-100 p-3 rounded border border-gray-300 my-2">
                <p className="text-sm text-gray-700"><strong>Удалить из чёрного списка?</strong></p>
                <p className="text-sm text-gray-600">Разблокировать {'{имя пользователя}'}?</p>
              </div>
              <p className="text-gray-700">
                Нажмите "Разблокировать" — пользователь сможет снова участвовать в конкурсах.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Виден ли чёрный список одного конкурса в другом?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Нет, чёрный список уникален для каждого конкурса.</strong> Если вы заблокировали пользователя в "Конкурсе А", он <strong>не</strong> будет заблокирован автоматически в "Конкурсе Б".
              </p>
              <p className="text-sm text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 mt-2">
                💡 <strong>Совет:</strong> Если нужно заблокировать одного и того же пользователя в нескольких конкурсах, добавьте его в чёрный список каждого конкурса отдельно.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что делать, если не могу добавить пользователя в ЧС?
              </span>
              <span className="text-red-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Если при клике на кнопку "Добавить в ЧС" появляется предупреждение <strong>"Сохраните конкурс перед добавлением в чёрный список"</strong>, это означает, что конкурс ещё не создан в системе.
              </p>
              <p className="text-gray-700 font-semibold mt-2">Решение:</p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1 ml-4 mt-1">
                <li>Вернитесь на вкладку "Настройки"</li>
                <li>Заполните обязательные поля (название, описание, условия)</li>
                <li>Нажмите "Сохранить" или "Создать конкурс"</li>
                <li>Вернитесь на вкладку "Чёрный список" — теперь кнопка будет работать</li>
              </ol>
            </div>
          </details>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ключевые преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-3xl mb-2">🚫</div>
            <h3 className="font-semibold text-gray-900 mb-2">Автоматическое исключение</h3>
            <p className="text-sm text-gray-600">
              Заблокированные пользователи не попадут в розыгрыш — система проверяет чёрный список автоматически.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-3xl mb-2">⏰</div>
            <h3 className="font-semibold text-gray-900 mb-2">Временные блокировки</h3>
            <p className="text-sm text-gray-600">
              Заблокируйте пользователя до конкретной даты — система разблокирует автоматически.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-red-100">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Массовое добавление</h3>
            <p className="text-sm text-gray-600">
              Добавьте несколько пользователей сразу — вставьте ссылки построчно, система обработает все.
            </p>
          </div>
        </div>
      </section>

      {/* Навигация */}
      <NavigationButtons
        onPrevious={() => onNavigate('2-4-4-10-sending-list')}
        onNext={() => onNavigate('2-4-4-12-preview')}
        previousLabel="Список рассылки"
        nextLabel="Предпросмотр"
      />
    </div>
  );
};

// ============================================
// Демо-компоненты
// ============================================

const BlacklistTableDemo: React.FC = () => {
  const mockEntries = [
    { id: '1', user: 'Иван Спамеров', vkId: 123456789, until: 'Навсегда', added: '10.02.2026' },
    { id: '2', user: null, vkId: 987654321, until: '20.03.2026', added: '12.02.2026' },
    { id: '3', user: 'Мария Накруткина', vkId: 555666777, until: '15.03.2026', added: '15.02.2026' }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Черный список (Конкурс)</h3>
          <p className="text-sm text-gray-500">Участники, исключённые для этого конкурса.</p>
        </div>
        <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100">
          Добавить в ЧС
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b">
            <tr>
              <th className="px-6 py-3">Пользователь</th>
              <th className="px-6 py-3">Срок</th>
              <th className="px-6 py-3">Добавлен</th>
              <th className="px-6 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockEntries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {entry.user ? entry.user : <span className="text-gray-500">ID {entry.vkId}</span>}
                </td>
                <td className="px-6 py-4">{entry.until}</td>
                <td className="px-6 py-4 text-gray-500">{entry.added}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-red-600 hover:text-red-800 text-xs">Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AddToBlacklistButtonDemo: React.FC = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [isContestSaved, setIsContestSaved] = useState(false);

  const handleClick = () => {
    if (!isContestSaved) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Черный список (Конкурс)</h3>
          <p className="text-sm text-gray-500">Участники, исключённые для этого конкурса.</p>
        </div>
        <button
          onClick={handleClick}
          className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
        >
          Добавить в ЧС
        </button>
      </div>

      {showWarning && (
        <div className="p-3 bg-yellow-50 text-yellow-800 text-sm rounded-md border border-yellow-200 animate-fade-in-up">
          ⚠ Сохраните конкурс перед добавлением в чёрный список.
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isContestSaved}
            onChange={(e) => setIsContestSaved(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">Конкурс сохранён</span>
        </label>
      </div>

      <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        💡 Попробуйте нажать кнопку без сохранения конкурса — появится предупреждение
      </p>
    </div>
  );
};

const AddBlacklistModalDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [urls, setUrls] = useState('');
  const [isForever, setIsForever] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100"
      >
        Открыть всплывающее окно
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in-up">
            <header className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Добавить в ЧС (Конкурс)</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </header>
            <main className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ссылки / ID (по одной в строке)
                </label>
                <textarea
                  value={urls}
                  onChange={(e) => setUrls(e.target.value)}
                  rows={5}
                  className="w-full border rounded-md p-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  placeholder="https://vk.com/id12345&#10;https://vk.com/durov"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки</label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={isForever}
                      onChange={() => setIsForever(true)}
                      className="h-4 w-4"
                    />
                    <span className="ml-2">Бессрочно</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!isForever}
                      onChange={() => setIsForever(false)}
                      className="h-4 w-4"
                    />
                    <span className="ml-2">До даты</span>
                  </label>
                </div>
                {!isForever && (
                  <div className="mt-2 ml-6">
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full border rounded-md p-2 text-sm border-gray-300"
                    />
                  </div>
                )}
              </div>
            </main>
            <footer className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Сохранить
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

const BlacklistTableRowsDemo: React.FC = () => {
  const [entries] = useState([
    { id: '1', name: 'Анна Иванова', vkId: 123456, until: '25.03.2026', added: '10.02.2026' },
    { id: '2', name: null, vkId: 987654, until: 'Навсегда', added: '12.02.2026' },
    { id: '3', name: 'Пётр Сидоров', vkId: 555777, until: '15.04.2026', added: '14.02.2026' }
  ]);

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th className="px-6 py-3 text-left">Пользователь</th>
            <th className="px-6 py-3 text-left">Срок</th>
            <th className="px-6 py-3 text-left">Добавлен</th>
            <th className="px-6 py-3 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map(entry => (
            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                {entry.name ? (
                  <span className="text-gray-900">{entry.name}</span>
                ) : (
                  <span className="text-gray-500">ID {entry.vkId}</span>
                )}
              </td>
              <td className="px-6 py-4">
                {entry.until === 'Навсегда' ? (
                  <span className="text-red-600 font-medium">{entry.until}</span>
                ) : (
                  <span className="text-gray-700">{entry.until}</span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">{entry.added}</td>
              <td className="px-6 py-4 text-right">
                <button className="text-red-600 hover:text-red-800 text-xs font-medium">
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-3 bg-gray-50 border-t text-xs text-gray-600">
        💡 <strong>Особенности:</strong> Если нет имени — показывается "ID {'{vk_id}'}". Срок "Навсегда" выделен красным.
      </div>
    </div>
  );
};

const TemporaryBlockDemo: React.FC = () => {
  const [isForever, setIsForever] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-03-20');
  const [entries, setEntries] = useState([
    { id: '1', name: 'Дмитрий Тестов', until: 'Навсегда' }
  ]);

  const handleAdd = () => {
    const newEntry = {
      id: Date.now().toString(),
      name: 'Новый пользователь',
      until: isForever ? 'Навсегда' : new Date(selectedDate).toLocaleDateString('ru-RU')
    };
    setEntries([...entries, newEntry]);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Срок блокировки</label>
        <div className="space-y-3 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={isForever}
              onChange={() => setIsForever(true)}
              className="h-4 w-4"
            />
            <span className="ml-2">Бессрочно</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              checked={!isForever}
              onChange={() => setIsForever(false)}
              className="h-4 w-4"
            />
            <span className="ml-2">До даты</span>
          </label>
        </div>
        {!isForever && (
          <div className="ml-6 mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded-md p-2 text-sm border-gray-300"
            />
            <p className="text-xs text-gray-500 mt-1">
              Пользователь будет автоматически разблокирован {new Date(selectedDate).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Добавить запись
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Пользователь</th>
              <th className="px-6 py-3 text-left text-gray-500">Срок</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4">{entry.name}</td>
                <td className="px-6 py-4">
                  {entry.until === 'Навсегда' ? (
                    <span className="text-red-600 font-medium">{entry.until}</span>
                  ) : (
                    <span className="text-gray-700">{entry.until}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DeleteFromBlacklistDemo: React.FC = () => {
  const [entries, setEntries] = useState([
    { id: '1', name: 'Мария Удаляева', vkId: 123456 },
    { id: '2', name: 'Иван Блокиров', vkId: 654321 }
  ]);
  const [toDelete, setToDelete] = useState<{ id: string; name: string; vkId: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (entry: { id: string; name: string; vkId: number }) => {
    setToDelete(entry);
  };

  const confirmDelete = () => {
    if (!toDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      setEntries(prev => prev.filter(e => e.id !== toDelete.id));
      setToDelete(null);
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Пользователь</th>
              <th className="px-6 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{entry.name}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(entry)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Всплывающее окно подтверждения */}
      {toDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Удалить из чёрного списка?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Разблокировать {toDelete.name}?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:bg-green-400"
              >
                {isDeleting ? 'Удаление...' : 'Разблокировать'}
              </button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        💡 Нажмите "Удалить" на любой записи — появится всплывающее окно подтверждения
      </p>
    </div>
  );
};

const EmptyStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Черный список (Конкурс)</h3>
      </div>
      
      <div className="flex items-center justify-center p-8 text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🚫</span>
          </div>
          <p className="text-sm">Пусто.</p>
          <p className="text-xs text-gray-500 mt-2">
            Пользователи появятся после добавления в чёрный список
          </p>
        </div>
      </div>
    </div>
  );
};

const LoadingStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden" style={{ height: '300px' }}>
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="loader h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Загрузка списка...</p>
        </div>
      </div>
    </div>
  );
};
