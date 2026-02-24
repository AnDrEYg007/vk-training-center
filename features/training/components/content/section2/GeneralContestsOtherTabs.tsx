import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

/**
 * 2.4.4.6. Настройки конкурса
 * 2.4.4.7. Участники
 * 2.4.4.8. Победители  
 * 2.4.4.9. Промокоды
 * 2.4.4.10. Список рассылки
 * 2.4.4.11. Чёрный список
 * 2.4.4.12. Превью конкурса
 * 
 * Компактные страницы для остальных табов редактора
 */

export const GeneralContestsSettings: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Вкладка "Настройки" — основной раздел редактора конкурса. Здесь настраивается всё: от названия до даты завершения.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Основные параметры</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Активность механики</strong> — включить/выключить конкурс переключателем</li>
      <li><strong>Название</strong> — внутреннее имя для удобства (участники не видят)</li>
      <li><strong>Описание</strong> — опциональная заметка для себя</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Конкурсный пост (старт)</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Два варианта: создать новый пост (система опубликует автоматически) или привязаться к существующему посту в VK (вставить ссылку).
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Условия участия</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Здесь находится конструктор условий (подробно описан в разделе "Условия участия").
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Финиш</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Два режима: <strong>по дате</strong> (указать конкретное время завершения) или <strong>по длительности</strong> (через X дней/часов после старта).
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Победители</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Количество</strong> — сколько человек получат призы</li>
      <li><strong>Один приз на человека</strong> — если включено, один пользователь не может выиграть несколько раз</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Циклы</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Можно сделать конкурс циклическим (еженедельный розыгрыш): система автоматически перезапустит конкурс после завершения предыдущего цикла.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Шаблоны</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Пост с итогами</strong> — текст для объявления победителей (переменная <code>{'{winners_list}'}</code>)</li>
      <li><strong>Личное сообщение</strong> — текст для отправки промокода победителю (переменная <code>{'{promo_code}'}</code>)</li>
      <li><strong>Комментарий-заглушка</strong> — если личка закрыта, система оставит комментарий под постом</li>
    </ul>
    <NavigationButtons currentPath="2-4-4-6-settings" />
  </article>
);

export const GeneralContestsParticipants: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Вкладка "Участники" показывает всех, кто выполнил условия конкурса и попал в розыгрыш. Это режим только для просмотра — изменять список нельзя.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что видно в списке?</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Аватар и имя</strong> — профиль участника ВКонтакте</li>
      <li><strong>Выполненные действия</strong> — какие условия были выполнены (лайк, репост, комментарий)</li>
      <li><strong>Дата участия</strong> — когда система зафиксировала выполнение условий</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Обновление списка</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Система автоматически проверяет новых участников каждые 5-10 минут. Если кто-то выполнил условия — он появится в списке. 
      Кнопка "Обновить" позволяет принудительно запросить свежие данные.
    </p>
    <NavigationButtons currentPath="2-4-4-7-participants" />
  </article>
);

export const GeneralContestsWinners: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      После завершения конкурса система автоматически выбирает победителей случайным образом из списка участников. Они отображаются на этой вкладке.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Информация о победителях</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Имя и профиль</strong> — кто выиграл</li>
      <li><strong>Выданный промокод</strong> — какой приз получил победитель</li>
      <li><strong>Статус доставки</strong> — отправлено ли ЛС успешно, или возникла ошибка</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что делать, если ошибка доставки?</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Если личка победителя закрыта, система оставит комментарий под итоговым постом с просьбой написать в ЛС сообщества. 
      Можно вручную отправить промокод через интерфейс ВКонтакте.
    </p>
    <NavigationButtons currentPath="2-4-4-8-winners" />
  </article>
);

export const GeneralContestsPromocodes: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Промокоды — это призы, которые получат победители. Это могут быть коды скидок, ссылки на подарки или просто текст с инструкцией.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как добавить промокоды?</h2>
    <ol className="!text-base !leading-relaxed !text-gray-700">
      <li>Откройте вкладку "Промокоды"</li>
      <li>В поле ввода вставьте коды (каждый на отдельной строке)</li>
      <li>Нажмите кнопку "Загрузить промокоды"</li>
    </ol>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Статусы промокодов</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Свободен</strong> — промокод доступен для выдачи</li>
      <li><strong>Выдан</strong> — промокод отправлен победителю (показывается, кому именно)</li>
    </ul>
    <div className="not-prose my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div className="flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-semibold text-amber-900 mb-1">Важно!</p>
          <p className="text-sm text-amber-800">
            Свободных промокодов должно быть не меньше, чем количество победителей. Иначе конкурс получит статус "Нет промокодов" и не запустится.
          </p>
        </div>
      </div>
    </div>
    <NavigationButtons currentPath="2-4-4-9-promocodes" />
  </article>
);

export const GeneralContestsSendingList: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Список рассылки — это логи отправки промокодов победителям. Здесь видно, кому, когда и что было отправлено, а также статус доставки.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что показывает таблица?</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Получатель</strong> — имя и профиль победителя</li>
      <li><strong>Промокод</strong> — какой приз отправлен</li>
      <li><strong>Дата отправки</strong> — когда система отправила ЛС</li>
      <li><strong>Статус</strong> — успешно доставлено или ошибка (например, личка закрыта)</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Если победитель жалуется, что не получил приз — здесь можно проверить, была ли попытка отправки и что пошло не так. 
      Также полезно для отчётности: сколько призов выдано, сколько доставлено успешно.
    </p>
    <NavigationButtons currentPath="2-4-4-10-sending-list" />
  </article>
);

export const GeneralContestsBlacklist: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Чёрный список — это пользователи, которых вы хотите исключить из конкурса. Они не попадут в список участников, даже если выполнят все условия.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Кого добавлять в чёрный список?</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Боты</strong> — фейковые аккаунты, созданные для накрутки</li>
      <li><strong>Мошенники</strong> — пользователи, которые нарушают правила конкурса</li>
      <li><strong>Сотрудники</strong> — если хотите исключить работников агентства из розыгрыша</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как добавить пользователя?</h2>
    <ol className="!text-base !leading-relaxed !text-gray-700">
      <li>Откройте вкладку "Чёрный список"</li>
      <li>Нажмите кнопку "+ Добавить"</li>
      <li>Вставьте ссылку на профиль ВКонтакте или ID пользователя</li>
      <li>Нажмите "Сохранить"</li>
    </ol>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Система автоматически исключит этих пользователей при проверке условий. Они не увидят, что находятся в чёрном списке.
    </p>
    <NavigationButtons currentPath="2-4-4-11-blacklist" />
  </article>
);

export const GeneralContestsPreview: React.FC<ContentProps> = ({ title }) => (
  <article className="prose prose-slate max-w-none">
    <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Режим "Превью" показывает, как будут выглядеть посты конкурса в ВКонтакте: стартовый пост, итоговый пост и личное сообщение победителю.
    </p>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что показывается?</h2>
    <ul className="!text-base !leading-relaxed !text-gray-700">
      <li><strong>Стартовый пост</strong> — как будет выглядеть объявление о конкурсе (с текстом и изображениями)</li>
      <li><strong>Итоговый пост</strong> — как будут оформлены результаты с именами победителей</li>
      <li><strong>Личное сообщение</strong> — какой текст получит победитель с промокодом</li>
      <li><strong>Комментарий-заглушка</strong> — что система напишет под постом, если личка закрыта</li>
    </ul>
    <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
    <p className="!text-base !leading-relaxed !text-gray-700">
      Превью позволяет проверить, правильно ли работают переменные (например, <code>{'{winners_list}'}</code> или <code>{'{promo_code}'}</code>), 
      и убедиться, что посты выглядят корректно перед публикацией. Это особенно полезно при первой настройке конкурса.
    </p>
    <div className="not-prose my-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="font-semibold text-blue-900 mb-1">Совет</p>
          <p className="text-sm text-blue-800">
            Всегда проверяйте превью перед сохранением конкурса. Это поможет избежать опечаток и ошибок форматирования.
          </p>
        </div>
      </div>
    </div>
    <NavigationButtons currentPath="2-4-4-12-preview" />
  </article>
);
