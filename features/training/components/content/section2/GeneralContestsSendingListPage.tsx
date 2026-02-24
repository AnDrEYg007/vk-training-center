import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

export const GeneralContestsSendingListPage: React.FC<ContentProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Журнал отправки призов
        </h1>
        <p className="text-lg text-gray-600">
          Узнайте, как отслеживать доставку сообщений с промокодами победителям, повторять неудачные отправки и управлять историей рассылки.
        </p>
      </div>

      {/* Что это такое */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Что такое "Журнал отправки призов"?
        </h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="text-indigo-700">Журнал отправки призов</strong> — это детальная история всех попыток отправить промокоды и призы победителям конкурса. Здесь видно:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Кто получил приз</strong> — имя победителя и его VK ID</li>
            <li><strong>Какой код отправлен</strong> — конкретный промокод из базы</li>
            <li><strong>Статус доставки</strong> — успешно или ошибка</li>
            <li><strong>Время отправки</strong> — точная дата и время попытки</li>
            <li><strong>Возможность повтора</strong> — если доставка не удалась, можно попробовать снова</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Это контрольная точка для проверки: все ли победители получили свои призы. Если кто-то не получил — видна причина ошибки.
          </p>
        </div>
      </section>

      {/* Было/Стало */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-6">
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
                <span>Записывали в таблицу: кому отправили, когда</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Не знали, доставлено ли сообщение</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Если ошибка — искали пользователя вручную в VK</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Вручную писали повторное сообщение</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Теряли историю: не помнили, кому что отправляли</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700">
                ⏱ Время: ~15 минут на разбор ошибок
              </p>
            </div>
          </div>

          {/* Стало */}
          <div className="bg-white rounded-lg p-5 border-2 border-indigo-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 text-xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Стало (автоматически)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Полная история в одной таблице</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Статус доставки в реальном времени</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Кнопка "Повторить" для каждой ошибки</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Массовый повтор всех ошибок одной кнопкой</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Счётчики успешных и неудачных отправок</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm font-semibold text-indigo-700">
                ⏱ Время: ~1 минута на проверку и повтор
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                💰 Экономия: 14 минут
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

        {/* 1. Общий вид журнала */}
        <Sandbox
          title="1. Общий вид журнала отправки"
          description="Таблица с записями о доставке призов. В шапке — заголовок, счётчики успешных/ошибочных отправок и кнопки управления. Таблица из 5 колонок показывает всю информацию о каждой попытке отправки."
          highlight="indigo"
        >
          <DeliveryJournalDemo />
        </Sandbox>

        {/* 2. Счётчики и заголовок */}
        <Sandbox
          title="2. Заголовок и счётчики статистики"
          description="В шапке таблицы отображается название журнала и два счётчика: зелёный показывает успешные отправки, красный — количество ошибок. Счётчики обновляются автоматически при изменении данных."
          highlight="indigo"
        >
          <HeaderWithCountersDemo />
        </Sandbox>

        {/* 3. Таблица с записями */}
        <Sandbox
          title="3. Таблица записей о доставке"
          description="5 колонок: Пользователь (имя или VK ID), Код/Приз (моноширинный шрифт), Статус (sent/error), Время отправки (русский формат даты), Действия (кнопка повтора для ошибок)."
          highlight="indigo"
          instructions={[
            'Промокоды отображаются <strong>моноширинным шрифтом</strong> для лучшей читаемости',
            'Статус показывается текстом: "sent" или "error"',
            'Кнопка "Повторить" появляется только для записей с ошибками'
          ]}
        >
          <DeliveryTableDemo />
        </Sandbox>

        {/* 4. Кнопка "Повторить" */}
        <Sandbox
          title="4. Повтор отправки для одной записи"
          description="Если доставка не удалась (статус error), в колонке 'Действия' появляется кнопка 'Повторить'. При клике система пытается отправить сообщение снова. Во время повтора показывается индикатор '...'."
          highlight="indigo"
          instructions={[
            'Кнопка доступна только для записей со статусом "error"',
            'Во время повтора кнопка блокируется и показывает "..."',
            'После повтора таблица автоматически обновляется'
          ]}
        >
          <RetryButtonDemo />
        </Sandbox>

        {/* 5. Кнопка "Повторить всем" */}
        <Sandbox
          title="5. Массовый повтор для всех ошибок"
          description="Если в журнале есть хотя бы одна ошибка, в шапке появляется кнопка 'Повторить всем'. Она отправляет сообщения всем пользователям, у которых была ошибка доставки. Требует подтверждения."
          highlight="indigo"
          instructions={[
            'Кнопка показывается только если есть ошибки (счётчик > 0)',
            'Перед выполнением показывается окно подтверждения',
            'Все повторные отправки выполняются автоматически'
          ]}
        >
          <RetryAllButtonDemo />
        </Sandbox>

        {/* 6. Кнопка "Очистить" */}
        <Sandbox
          title="6. Очистка журнала отправки"
          description="Кнопка 'Очистить' удаляет все записи из журнала. Это опасное действие, поэтому показывается всплывающее окно подтверждения с красной кнопкой."
          highlight="indigo"
          instructions={[
            'Очистка удаляет <strong>все</strong> записи безвозвратно',
            'Перед удалением показывается окно подтверждения',
            'Кнопка подтверждения красная (опасное действие)'
          ]}
        >
          <ClearButtonDemo />
        </Sandbox>

        {/* 7. Пустое состояние */}
        <Sandbox
          title="7. Пустой журнал"
          description="Если в журнале нет записей (ещё не было отправок или журнал очищен), показывается информативное сообщение."
          highlight="indigo"
        >
          <EmptyStateDemo />
        </Sandbox>

        {/* 8. Загрузка данных */}
        <Sandbox
          title="8. Загрузка журнала с сервера"
          description="При первом открытии вкладки или обновлении данных показывается анимированный индикатор загрузки в центре экрана."
          highlight="indigo"
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
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Почему статус "error" — что пошло не так?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Статус "error" означает, что сообщение не было доставлено победителю. Самые частые причины:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Закрытые личные сообщения</strong> — пользователь запретил сообщения от сообществ в настройках VK</li>
                <li><strong>Заблокированное сообщество</strong> — пользователь добавил ваше сообщество в чёрный список</li>
                <li><strong>Удалённая страница</strong> — профиль победителя был удалён или заблокирован</li>
              </ul>
              <p className="text-sm text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-200 mt-3">
                💡 <strong>Совет:</strong> Используйте кнопку "Повторить" — иногда пользователь открывает сообщения после первой попытки.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что делает кнопка "Повторить"?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Кнопка "Повторить" делает новую попытку отправить сообщение с промокодом этому пользователю. Система использует тот же код и тот же текст сообщения. Если на этот раз доставка успешна — статус в таблице изменится на "sent" (успешно).
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Когда использовать "Повторить всем"?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Используйте "Повторить всем" в таких случаях:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>После проведения розыгрыша было много ошибок доставки</li>
                <li>Прошло время, и пользователи могли открыть сообщения</li>
                <li>Вы объявили в посте, что победителям нужно разрешить сообщения от сообщества</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Система попробует отправить сообщения всем пользователям со статусом "error" автоматически.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Можно ли восстановить журнал после очистки?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong className="text-red-600">Нет, восстановить нельзя.</strong> Кнопка "Очистить" удаляет все записи безвозвратно. Именно поэтому перед удалением показывается всплывающее окно с предупреждением и красной кнопкой подтверждения. Используйте эту функцию только когда уверены.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Зачем очищать журнал?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Очистка журнала нужна для циклических конкурсов. Если конкурс повторяется каждую неделю, старые записи накапливаются и мешают анализировать текущий розыгрыш. Очистите журнал после завершения цикла, чтобы начать новый розыгрыш с чистого листа.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Как часто обновляется журнал?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Журнал загружается автоматически при открытии вкладки. Если вы используете кнопку "Повторить" или "Повторить всем", после выполнения действия таблица обновляется автоматически, показывая актуальные статусы. Обновлять страницу вручную не нужно.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg shadow-sm border border-indigo-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ключевые преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Полная прозрачность</h3>
            <p className="text-sm text-gray-600">
              Видно всё: кто получил приз, когда, с каким результатом. Никакой неопределённости.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-semibold text-gray-900 mb-2">Автоповтор ошибок</h3>
            <p className="text-sm text-gray-600">
              Не нужно вручную искать и писать пользователям. Кнопка "Повторить всем" делает всё за вас.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Контроль в реальном времени</h3>
            <p className="text-sm text-gray-600">
              Счётчики показывают актуальную статистику. Сразу видно, есть ли проблемы с доставкой.
            </p>
          </div>
        </div>
      </section>

      {/* Навигация */}
      <NavigationButtons
        onPrevious={() => onNavigate('2-4-4-9-promocodes')}
        onNext={() => onNavigate('2-4-4-11-blacklist')}
        previousLabel="Промокоды"
        nextLabel="Чёрный список"
      />
    </div>
  );
};

// ============================================
// Демо-компоненты
// ============================================

const DeliveryJournalDemo: React.FC = () => {
  const mockLogs = [
    { id: '1', user: 'Анна Смирнова', code: 'PROMO123', status: 'sent' as const, time: '15.02.2026, 14:30' },
    { id: '2', user: 'ID 987654321', code: 'WIN2024', status: 'error' as const, time: '15.02.2026, 14:31' },
    { id: '3', user: 'Дмитрий Козлов', code: 'SALE777', status: 'sent' as const, time: '15.02.2026, 14:32' }
  ];

  const stats = {
    sent: mockLogs.filter(l => l.status === 'sent').length,
    error: mockLogs.filter(l => l.status === 'error').length
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      {/* Шапка */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Журнал отправки призов (Конкурс)</h3>
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="text-green-600">Успешно: <strong>{stats.sent}</strong></span>
            <span className="ml-3 text-red-500">Ошибки: <strong>{stats.error}</strong></span>
          </div>
          {stats.error > 0 && (
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs">
              Повторить всем
            </button>
          )}
          <button className="px-3 py-1.5 border rounded text-xs">
            Очистить
          </button>
        </div>
      </div>

      {/* Таблица */}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th className="px-4 py-3">Пользователь</th>
            <th className="px-4 py-3">Код / Приз</th>
            <th className="px-4 py-3">Статус</th>
            <th className="px-4 py-3">Время</th>
            <th className="px-4 py-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {mockLogs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">{log.user}</td>
              <td className="px-4 py-3 font-mono">{log.code}</td>
              <td className="px-4 py-3">{log.status}</td>
              <td className="px-4 py-3 text-gray-500">{log.time}</td>
              <td className="px-4 py-3 text-right">
                {log.status === 'error' && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-800">
                    Повторить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HeaderWithCountersDemo: React.FC = () => {
  const [sentCount, setSentCount] = useState(12);
  const [errorCount, setErrorCount] = useState(3);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 text-lg">Журнал отправки призов (Конкурс)</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-green-600 flex items-center gap-1">
              Успешно: <strong className="text-lg">{sentCount}</strong>
            </span>
            <span className="text-red-500 flex items-center gap-1">
              Ошибки: <strong className="text-lg">{errorCount}</strong>
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSentCount(c => c + 1)}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          + Успешная отправка
        </button>
        <button
          onClick={() => setErrorCount(c => c + 1)}
          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          + Ошибка отправки
        </button>
        <button
          onClick={() => { setSentCount(0); setErrorCount(0); }}
          className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Сбросить
        </button>
      </div>

      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        💡 Счётчики обновляются автоматически при изменении данных в журнале
      </p>
    </div>
  );
};

const DeliveryTableDemo: React.FC = () => {
  const mockLogs = [
    { id: '1', user: 'Анна Смирнова', userId: '123456789', code: 'PROMO123', status: 'sent' as const, time: '15 февраля 2026 г., 14:30:15' },
    { id: '2', user: 'Дмитрий Козлов', userId: '987654321', code: 'WIN2024', status: 'sent' as const, time: '15 февраля 2026 г., 14:31:22' },
    { id: '3', user: null, userId: '555666777', code: 'SALE777', status: 'error' as const, time: '15 февраля 2026 г., 14:32:08' }
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 font-medium border-b">
          <tr>
            <th className="px-4 py-3 text-left">Пользователь</th>
            <th className="px-4 py-3 text-left">Код / Приз</th>
            <th className="px-4 py-3 text-left">Статус</th>
            <th className="px-4 py-3 text-left">Время</th>
            <th className="px-4 py-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {mockLogs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                {log.user ? (
                  <span className="text-gray-900">{log.user}</span>
                ) : (
                  <span className="text-gray-500">ID {log.userId}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">
                  {log.code}
                </code>
              </td>
              <td className="px-4 py-3">
                <span className={log.status === 'sent' ? 'text-green-600' : 'text-red-500'}>
                  {log.status}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">
                {log.time}
              </td>
              <td className="px-4 py-3 text-right">
                {log.status === 'error' && (
                  <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                    Повторить
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-3 bg-gray-50 border-t text-xs text-gray-600">
        💡 <strong>Особенности:</strong> Промокоды выделены моноширинным шрифтом, статусы показаны текстом (sent/error)
      </div>
    </div>
  );
};

const RetryButtonDemo: React.FC = () => {
  const [logs, setLogs] = useState([
    { id: '1', user: 'Елена Петрова', code: 'ERROR123', status: 'error' as const, retrying: false },
    { id: '2', user: 'ID 777888999', code: 'FAIL456', status: 'error' as const, retrying: false }
  ]);

  const handleRetry = (id: string) => {
    setLogs(prev => prev.map(l => l.id === id ? { ...l, retrying: true } : l));
    
    setTimeout(() => {
      setLogs(prev => prev.map(l => l.id === id ? { ...l, status: 'sent' as const, retrying: false } : l));
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Пользователь</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Код</th>
              <th className="px-4 py-3 text-left text-gray-500 font-medium">Статус</th>
              <th className="px-4 py-3 text-right text-gray-500 font-medium">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{log.user}</td>
                <td className="px-4 py-3 font-mono text-xs">{log.code}</td>
                <td className="px-4 py-3">
                  <span className={log.status === 'sent' ? 'text-green-600 font-medium' : 'text-red-500'}>
                    {log.status === 'sent' ? '✓ sent' : '✗ error'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {log.status === 'error' && (
                    <button
                      onClick={() => handleRetry(log.id)}
                      disabled={log.retrying}
                      className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
                    >
                      {log.retrying ? '...' : 'Повторить'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-gray-600 bg-indigo-50 p-3 rounded border border-indigo-200">
        💡 Попробуйте нажать "Повторить" — кнопка заблокируется, покажет "...", затем статус изменится на "sent"
      </p>
    </div>
  );
};

const RetryAllButtonDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [errorCount, setErrorCount] = useState(3);

  const handleRetryAll = () => {
    setShowModal(false);
    setIsRetrying(true);
    
    setTimeout(() => {
      setErrorCount(0);
      setIsRetrying(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Журнал отправки призов</h3>
          <div className="flex items-center gap-3">
            <span className="text-sm text-red-500">
              Ошибки: <strong>{errorCount}</strong>
            </span>
            {errorCount > 0 && (
              <button
                onClick={() => setShowModal(true)}
                disabled={isRetrying}
                className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
              >
                {isRetrying ? 'Отправка...' : 'Повторить всем'}
              </button>
            )}
          </div>
        </div>

        {errorCount === 0 && (
          <div className="text-center py-8 text-green-600">
            ✓ Все сообщения доставлены успешно!
          </div>
        )}

        {errorCount > 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            {errorCount} записей со статусом "error" ожидают повторной отправки
          </div>
        )}
      </div>

      {/* Всплывающее окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Повторить отправку всем?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Вы уверены? Система попытается отправить сообщения всем пользователям со статусом "error".
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
              >
                Отмена
              </button>
              <button
                onClick={handleRetryAll}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
              >
                Да, повторить
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setErrorCount(3); setIsRetrying(false); }}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Сбросить демо
      </button>
    </div>
  );
};

const ClearButtonDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [hasRecords, setHasRecords] = useState(true);

  const handleClear = () => {
    setIsClearing(true);
    
    setTimeout(() => {
      setShowModal(false);
      setHasRecords(false);
      setIsClearing(false);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-700">Журнал отправки призов</h3>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 border rounded text-xs hover:bg-gray-50 transition-colors"
          >
            Очистить
          </button>
        </div>

        {hasRecords ? (
          <div className="text-sm text-gray-600 text-center py-4">
            📝 В журнале 15 записей
          </div>
        ) : (
          <div className="text-center py-8 text-green-600">
            ✓ Журнал очищен
          </div>
        )}
      </div>

      {/* Всплывающее окно с КРАСНОЙ кнопкой */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Очистить журнал?
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Удалить все записи? <strong className="text-red-600">Это действие необратимо.</strong>
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={isClearing}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm disabled:opacity-50"
              >
                Отмена
              </button>
              <button
                onClick={handleClear}
                disabled={isClearing}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm disabled:bg-red-400 flex items-center gap-2"
              >
                {isClearing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Очистка...
                  </>
                ) : (
                  'Да, очистить'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
        ⚠ <strong>Внимание:</strong> Кнопка подтверждения красная — это опасное действие, которое нельзя отменить
      </div>

      <button
        onClick={() => { setHasRecords(true); setShowModal(false); setIsClearing(false); }}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Сбросить демо
      </button>
    </div>
  );
};

const EmptyStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-700">Журнал отправки призов (Конкурс)</h3>
      </div>
      
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📭</span>
        </div>
        <p className="text-gray-400 text-sm">
          Нет записей.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Записи появятся после первой отправки призов победителям
        </p>
      </div>
    </div>
  );
};

const LoadingStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden" style={{ height: '300px' }}>
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Загрузка журнала...</p>
        </div>
      </div>
    </div>
  );
};
