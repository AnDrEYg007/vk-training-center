import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

export const GeneralContestsWinnersPage: React.FC<ContentProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Победители конкурса
        </h1>
        <p className="text-lg text-gray-600">
          Узнайте, как отслеживать победителей, просматривать информацию о призах и контролировать статус доставки подарков участникам конкурса.
        </p>
      </div>

      {/* Что это такое */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Что такое вкладка "Победители"?
        </h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="text-amber-700">Вкладка "Победители"</strong> — это специальный раздел в универсальных конкурсах, который показывает список всех пользователей, выбранных победителями розыгрыша. Здесь вы можете увидеть:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Дату проведения розыгрыша</li>
            <li>Информацию о победителе (имя, ссылку на профиль)</li>
            <li>Ссылку на пост автора-участника</li>
            <li>Ссылку на пост с итогами конкурса</li>
            <li>Описание приза</li>
            <li>Выданный промокод (если применимо)</li>
            <li>Статус доставки сообщения победителю</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Это финальный этап работы с конкурсом — здесь фиксируются результаты розыгрыша и контролируется процесс вручения призов.
          </p>
        </div>
      </section>

      {/* Было/Стало */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg shadow-sm border border-amber-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Было / Стало
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Было */}
          <div className="bg-white rounded-lg p-5 border-2 border-red-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">😔</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900">Было (вручную)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Записывали победителей в Excel-таблицу</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Вручную искали их профили ВКонтакте</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Копировали ссылки на посты в отдельный документ</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Отправляли сообщения с промокодами вручную</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Отмечали в таблице, кому уже отправили</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700">
                ⏱ Время: ~45 минут на каждый розыгрыш
              </p>
            </div>
          </div>

          {/* Стало */}
          <div className="bg-white rounded-lg p-5 border-2 border-amber-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-amber-600 text-xl">🎉</span>
              </div>
              <h3 className="text-lg font-semibold text-amber-900">Стало (автоматически)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Все данные о победителях собираются автоматически</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Система сохраняет ссылки на посты участников</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Промокоды генерируются и фиксируются автоматически</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Сообщения отправляются системой</span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-500 mr-2">•</span>
                <span>Статус доставки отображается в реальном времени</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-amber-200">
              <p className="text-sm font-semibold text-amber-700">
                ⏱ Время: ~2 минуты на просмотр результатов
              </p>
              <p className="text-xs text-amber-600 mt-1">
                💰 Экономия: 43 минуты на розыгрыш
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

        {/* 1. Таблица победителей */}
        <Sandbox
          title="1. Таблица победителей с полной информацией"
          description="Таблица показывает 7 колонок с данными о каждом победителе: дату розыгрыша, имя победителя, ссылки на посты, информацию о призе, промокод и статус доставки."
          highlight="amber"
        >
          <WinnersTableDemo />
        </Sandbox>

        {/* 2. Статусы доставки */}
        <Sandbox
          title="2. Статусы доставки сообщений"
          description="Система показывает, было ли успешно доставлено сообщение с промокодом победителю. Зелёный статус означает успешную отправку, жёлтый — ошибку с подробностями."
          highlight="amber"
        >
          <DeliveryStatusDemo />
        </Sandbox>

        {/* 3. Ссылки на посты */}
        <Sandbox
          title="3. Кнопки перехода к постам"
          description="Две кнопки для быстрого перехода: серая ведёт к посту автора-участника, золотистая — к посту с итогами конкурса."
          highlight="amber"
        >
          <PostLinksDemo />
        </Sandbox>

        {/* 4. Отображение промокодов */}
        <Sandbox
          title="4. Отображение промокодов"
          description="Промокоды показываются моноширинным шрифтом для удобства чтения и копирования. Если промокод не выдавался, ячейка остаётся пустой."
          highlight="amber"
        >
          <PromoCodeDisplayDemo />
        </Sandbox>

        {/* 5. Пустое состояние */}
        <Sandbox
          title="5. Состояние до проведения розыгрыша"
          description="Если победители ещё не выбраны, система показывает информативное сообщение с подсказкой."
          highlight="amber"
        >
          <EmptyWinnersStateDemo />
        </Sandbox>

        {/* 6. Загрузка данных */}
        <Sandbox
          title="6. Загрузка списка победителей"
          description="При загрузке данных показывается анимированный спиннер в золотистом цвете, соответствующем тематике победителей."
          highlight="amber"
        >
          <LoadingWinnersStateDemo />
        </Sandbox>

        {/* 7. Шапка таблицы */}
        <Sandbox
          title="7. Заголовок секции победителей"
          description="Шапка вкладки выполнена в золотистой цветовой гамме, символизирующей награды и достижения."
          highlight="amber"
        >
          <WinnersHeaderDemo />
        </Sandbox>
      </section>

      {/* Частые вопросы */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Частые вопросы
        </h2>
        
        <div className="space-y-4">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что означает жёлтый статус доставки?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Жёлтый статус означает, что возникла ошибка при отправке сообщения победителю. Это может произойти, если пользователь запретил сообщения от сообщества или заблокировал его. Наведите курсор на статус, чтобы увидеть детали ошибки.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Как победители попадают в эту таблицу?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Победители попадают в таблицу автоматически после проведения розыгрыша и публикации поста с результатами. Система фиксирует всех пользователей, которым был отправлен приз или промокод.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Можно ли изменить данные победителя?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Вкладка "Победители" предназначена только для просмотра. Это архивная информация о проведённых розыгрышах. Изменить данные нельзя, но вы можете перейти по ссылкам на посты для проверки информации.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что делать, если промокод не отображается?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Если ячейка с промокодом пустая, это означает, что в данном розыгрыше промокоды не использовались. Некоторые конкурсы проводятся без промокодов — победители могут получать физические призы или другие типы вознаграждений.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Сколько победителей может быть в одном розыгрыше?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Количество победителей не ограничено системой. Вы можете провести розыгрыш с одним победителем или с несколькими — все они будут отображены в этой таблице с соответствующими данными.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Как использовать ссылки на посты?
              </span>
              <span className="text-amber-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Нажмите на серую кнопку "Пост автора", чтобы перейти к публикации участника, за которую он победил. Нажмите на золотистую кнопку "Итоги", чтобы увидеть пост с объявлением результатов конкурса. Ссылки открываются в новой вкладке.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow-sm border border-amber-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ключевые преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Полная история</h3>
            <p className="text-sm text-gray-600">
              Все данные о победителях сохраняются и доступны в любой момент для проверки и отчётности.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Прозрачность</h3>
            <p className="text-sm text-gray-600">
              Видны все детали: кто победил, какой приз получил, успешно ли доставлено сообщение.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-amber-100">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-gray-900 mb-2">Быстрый доступ</h3>
            <p className="text-sm text-gray-600">
              Один клик — и вы переходите к нужному посту или профилю победителя.
            </p>
          </div>
        </div>
      </section>

      {/* Навигация */}
      <NavigationButtons
        onPrevious={() => onNavigate('2-4-4-7-participants')}
        onNext={() => onNavigate('2-4-5')}
        previousLabel="Участники"
        nextLabel="Заключение"
      />
    </div>
  );
};

// ============================================
// Демо-компоненты
// ============================================

const WinnersTableDemo: React.FC = () => {
  const mockWinners = [
    {
      id: '1',
      date: '15 февраля 2026',
      winner: 'Анна Смирнова',
      prize: 'Скидка 20% на все товары',
      promo: 'WIN2026-ANNA',
      status: 'success' as const
    },
    {
      id: '2',
      date: '10 февраля 2026',
      winner: 'Дмитрий Козлов',
      prize: 'Бесплатная доставка на 3 месяца',
      promo: 'DELIVERY-FREE',
      status: 'success' as const
    },
    {
      id: '3',
      date: '5 февраля 2026',
      winner: 'Елена Петрова',
      prize: 'Подарочный набор',
      promo: '',
      status: 'error' as const
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
      {/* Шапка */}
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
        <h3 className="text-lg font-semibold text-amber-800">
          🏆 Список победителей
        </h3>
        <p className="text-sm text-amber-700 mt-1">
          Всего победителей: {mockWinners.length}
        </p>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата розыгрыша
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Победитель
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пост автора
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Итоги конкурса
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Приз
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Промокод
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус доставки
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockWinners.map((winner) => (
              <tr key={winner.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {winner.date}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer">
                    {winner.winner}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Открыть
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button className="inline-flex items-center px-3 py-1.5 border border-amber-200 rounded-md text-xs font-medium bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Итоги
                  </button>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {winner.prize}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {winner.promo ? (
                    <code className="font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                      {winner.promo}
                    </code>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {winner.status === 'success' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Отправлено
                    </span>
                  ) : (
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 cursor-help"
                      title="Пользователь запретил сообщения от сообщества"
                    >
                      ⚠ Ошибка
                    </span>
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

const DeliveryStatusDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Анна Смирнова</p>
            <p className="text-xs text-gray-500">15 февраля 2026</p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Отправлено
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Сообщение с промокодом успешно доставлено победителю
        </p>
      </div>

      <div className="bg-white rounded-lg border border-yellow-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Елена Петрова</p>
            <p className="text-xs text-gray-500">5 февраля 2026</p>
          </div>
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 cursor-help"
            title="Пользователь запретил сообщения от сообщества"
          >
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Ошибка доставки
          </span>
        </div>
        <p className="text-xs text-yellow-700 mt-2 bg-yellow-50 p-2 rounded">
          <strong>Причина:</strong> Пользователь запретил сообщения от сообщества
        </p>
        <p className="text-xs text-gray-600 mt-2">
          💡 Свяжитесь с победителем через комментарии или другие каналы
        </p>
      </div>
    </div>
  );
};

const PostLinksDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Кнопки для навигации:</h4>
        
        <div className="space-y-3">
          {/* Кнопка к посту автора */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Пост автора
            </button>
            <span className="text-sm text-gray-600">
              → Переход к публикации участника
            </span>
          </div>

          {/* Кнопка к итогам */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-amber-200 rounded-md text-sm font-medium bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              Итоги конкурса
            </button>
            <span className="text-sm text-gray-600">
              → Переход к посту с результатами
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            💡 <strong>Подсказка:</strong> Обе ссылки открываются в новой вкладке браузера
          </p>
        </div>
      </div>
    </div>
  );
};

const PromoCodeDisplayDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Примеры отображения промокодов:</h4>
        
        <div className="space-y-3">
          {/* С промокодом */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Анна Смирнова</p>
              <p className="text-xs text-gray-500">Скидка 20%</p>
            </div>
            <code className="font-mono text-gray-700 bg-gray-100 px-3 py-1.5 rounded text-sm border border-gray-300">
              WIN2026-ANNA
            </code>
          </div>

          {/* С промокодом */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Дмитрий Козлов</p>
              <p className="text-xs text-gray-500">Бесплатная доставка</p>
            </div>
            <code className="font-mono text-gray-700 bg-gray-100 px-3 py-1.5 rounded text-sm border border-gray-300">
              DELIVERY-FREE
            </code>
          </div>

          {/* Без промокода */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-900">Елена Петрова</p>
              <p className="text-xs text-gray-500">Подарочный набор (физический приз)</p>
            </div>
            <span className="text-gray-400 text-sm italic">
              — промокод не требуется —
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            💡 <strong>Моноширинный шрифт</strong> облегчает чтение и копирование промокодов
          </p>
        </div>
      </div>
    </div>
  );
};

const EmptyWinnersStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
        <h3 className="text-lg font-semibold text-amber-800">
          🏆 Список победителей
        </h3>
      </div>
      
      <div className="p-12 text-center">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Победители еще не выбраны
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Здесь появится список, когда вы проведете первый розыгрыш и опубликуете пост с итогами конкурса.
        </p>
      </div>
    </div>
  );
};

const LoadingWinnersStateDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
      <div className="bg-amber-50 px-6 py-4 border-b border-amber-200">
        <h3 className="text-lg font-semibold text-amber-800">
          🏆 Список победителей
        </h3>
      </div>
      
      <div className="p-12 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-sm">
          Загрузка списка победителей...
        </p>
      </div>
    </div>
  );
};

const WinnersHeaderDemo: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-amber-200 overflow-hidden">
      <div className="bg-amber-50 px-6 py-5 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-amber-800 mb-1">
              🏆 Список победителей
            </h3>
            <p className="text-sm text-amber-700">
              История всех розыгрышей и информация о призах
            </p>
          </div>
          <button className="px-4 py-2 border border-amber-200 rounded-md text-sm font-medium hover:bg-amber-100 text-amber-700 transition-colors">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Обновить
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          Золотистая цветовая гамма символизирует награды и достижения
        </p>
      </div>
    </div>
  );
};
