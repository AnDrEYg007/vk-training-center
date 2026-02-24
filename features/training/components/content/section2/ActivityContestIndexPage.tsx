import React from 'react';
import { ContentProps, NavigationButtons } from '../shared';

/**
 * 2.4.7. Конкурс «Актив» — главная страница раздела
 * Краткая обзорная страница с описанием функционала
 */
export const ActivityContestIndexPage: React.FC<ContentProps> = ({ title }) => {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        {title}
      </h1>

      {/* Предупреждение */}
      <div className="not-prose bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-semibold">
              ⚠️ Функционал "Конкурс «Актив»" находится на этапе планирования и пока не реализован в приложении. 
              Этот раздел описывает концепцию будущей автоматизации.
            </p>
          </div>
        </div>
      </div>

      {/* Что это такое? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        <strong>Конкурс «Актив»</strong> — это планируемая автоматизация для проведения конкурса на самого активного 
        участника сообщества. Система будет отслеживать активность подписчиков (лайки, комментарии, репосты) за определенный 
        период и автоматически определять победителей.
      </p>

      <p className="!text-base !leading-relaxed !text-gray-700">
        Это долгосрочный механизм вовлечения аудитории — пользователи получают стимул регулярно взаимодействовать 
        с контентом сообщества, зная что их активность учитывается в конкурсе.
      </p>

      {/* Раньше vs Теперь */}
      <div className="not-prose my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Раньше */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (без автоматизации)</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Вручную отслеживать активность каждого участника в таблице Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Считать лайки/комментарии через браузерные расширения или скрипты</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Постоянно обновлять данные вручную на протяжении всего конкурса</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Легко упустить активность участника, если не проверяли каждый пост</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>На конкурс длиной месяц — десятки часов ручной работы</span>
              </li>
            </ul>
          </div>

          {/* Теперь */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-green-900 mb-3">✅ С автоматизацией (планируется)</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Система автоматически собирает данные об активности участников</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Подсчет баллов в режиме реального времени (лайки, комментарии, репосты)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Автоматическое определение победителей по накопленным баллам</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Защита от накрутки — фильтрация подозрительных аккаунтов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Публикация итогов и отправка призов — автоматически</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Зачем это нужно */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Конкурс активности решает ключевую задачу SMM — <strong>долгосрочное вовлечение аудитории</strong>:
      </p>

      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li><strong>Стимул к регулярной активности:</strong> Пользователи возвращаются к контенту, зная что их действия учитываются</li>
        <li><strong>Рост органического охвата:</strong> Лайки и репосты показывают контент друзьям участников</li>
        <li><strong>Развитие сообщества:</strong> Активные комментаторы создают атмосферу живого общения</li>
        <li><strong>Выявление лояльной аудитории:</strong> Можно выделить самых преданных подписчиков для особых акций</li>
      </ul>

      {/* Навигация по подразделам */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Содержание раздела</h2>

      <div className="not-prose my-6">
        <div className="space-y-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigateToTopic', { detail: '2-4-7-1-overview' })); }}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">📋 Обзор функционала</h3>
            <p className="text-sm text-gray-600">
              Подробное описание концепции: система подсчета баллов, типы активности, 
              защита от накрутки и сравнение с другими конкурсами.
            </p>
          </a>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('navigateToTopic', { detail: '2-4-7-2-settings' })); }}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1">⚙️ Настройка конкурса</h3>
            <p className="text-sm text-gray-600">
              Предполагаемый интерфейс настройки: выбор периода конкурса, настройка баллов 
              за разные действия, условия победы, шаблоны сообщений.
            </p>
          </a>
        </div>
      </div>

      {/* Когда появится функционал */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Когда появится функционал?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Функционал находится в backlog разработки. Точные сроки зависят от приоритетов команды. 
        Следите за обновлениями в разделе "Changelog" приложения.
      </p>

      <div className="not-prose bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
        <h4 className="font-bold text-blue-900 mb-2">💡 Что использовать сейчас?</h4>
        <p className="text-sm text-blue-800">
          Пока автоматизация в разработке, вы можете использовать:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span><strong>Универсальные конкурсы</strong> — создайте серию еженедельных конкурсов с разными условиями</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span><strong>Ручной подсчет в Excel</strong> — трудоемко, но можно собрать данные из VK статистики</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span><strong>Конкурс отзывов</strong> — альтернативный механизм вовлечения через отзывы на товары</span>
          </li>
        </ul>
      </div>

      {/* Навигация */}
      <NavigationButtons currentPath="2-4-7-activity-contest" />
    </article>
  );
};
