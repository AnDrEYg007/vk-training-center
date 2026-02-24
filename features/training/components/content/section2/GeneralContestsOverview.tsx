import React from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockContestCard, MockContestStartBadge, MockContestResultBadge } from './GeneralContestsMocks';

/**
 * 2.4.4.1. Обзор: Что такое "Универсальные конкурсы"
 */
export const GeneralContestsOverview: React.FC<ContentProps> = ({ title }) => {
  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        {title}
      </h1>

      {/* Что это такое? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что это такое?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        <strong>Универсальные конкурсы</strong> — это инструмент для проведения розыгрышей и конкурсов с гибкими условиями участия.
        В отличие от конкурса отзывов (где единственное условие — оставить отзыв на товар), здесь вы сами настраиваете, 
        что нужно сделать участнику: поставить лайк, сделать репост, написать комментарий или всё вместе.
      </p>

      {/* Раньше vs Теперь */}
      <div className="not-prose my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Раньше */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-red-900 mb-3">❌ Раньше (без системы)</h3>
            <ul className="space-y-2 text-sm text-red-800">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Вручную публиковали пост о конкурсе в каждом сообществе</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Проверяли лайки и репосты руками или через браузерные расширения</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Записывали участников в таблицу Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Генератором случайных чисел выбирали победителя</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Вручную отправляли промокоды в личные сообщения</span>
              </li>
            </ul>
          </div>

          {/* Теперь */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-5">
            <h3 className="text-lg font-bold text-green-900 mb-3">✅ Теперь (с системой)</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Система автоматически публикует пост о старте конкурса</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Автоматически собирает участников по заданным условиям</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Сама проверяет выполнение условий (лайк, репост, комментарий)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Случайно выбирает победителей и публикует итоги</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span>Автоматически отправляет промокоды победителям</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Зачем это нужно? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Зачем это нужно?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Универсальные конкурсы экономят время SMM-специалистов и снижают риск ошибок. Раньше на один конкурс уходило несколько часов: 
        публикация, сбор участников, проверка условий, выбор победителей, отправка призов. Теперь весь процесс автоматизирован — 
        нужно только настроить условия один раз, и система сделает всё сама.
      </p>

      {/* Чем отличается от конкурса отзывов? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Чем отличается от конкурса отзывов?</h2>
      <div className="not-prose my-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Параметр</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Конкурс отзывов</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">Универсальный конкурс</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-200">Условие участия</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Только отзыв на товар</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Любые: лайк, репост, комментарий, подписка, спонсор</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-200">Гибкость</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Фиксированная механика</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Конструктор условий: комбинируй как угодно</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-200">Стартовый пост</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Система не создаёт</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Система публикует автоматически (или привязывается к существующему)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900 border-b border-gray-200">Цикличность</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Только разовый</td>
                <td className="px-4 py-3 text-gray-700 border-b border-gray-200">Может быть циклическим (еженедельные розыгрыши)</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-gray-900">Применение</td>
                <td className="px-4 py-3 text-gray-700">Стимулирование отзывов на товары</td>
                <td className="px-4 py-3 text-gray-700">Любые маркетинговые активности: вовлечение, продвижение спонсоров, рост охватов</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Визуальный пример */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Как это выглядит?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Конкурсы отображаются в календаре специальными цветными метками:
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Бейджи конкурсов в календаре"
          description="Системные посты конкурсов имеют цветные метки, чтобы их легко отличить от обычных постов"
          instructions={[
            '<strong>Голубой бейдж "Конкурс"</strong> — пост о старте конкурса (начало сбора участников)',
            '<strong>Оранжевый бейдж "Итоги"</strong> — пост с результатами (объявление победителей)'
          ]}
        >
          <div className="flex gap-6 items-center justify-center p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Старт конкурса</p>
              <MockContestStartBadge />
            </div>
            <div className="h-12 w-px bg-gray-300"></div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Итоги конкурса</p>
              <MockContestResultBadge />
            </div>
          </div>
        </Sandbox>
      </div>

      {/* Пример карточки конкурса */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Карточка конкурса</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        В разделе "Автоматизации → Универсальные конкурсы" все созданные конкурсы отображаются в виде карточек. 
        Каждая карточка показывает текущий статус, даты, количество победителей и основные действия.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Интерактивная карточка"
          description="Наведите курсор на карточку, чтобы увидеть эффект выделения. Карточка показывает все ключевые параметры конкурса."
          instructions={[
            '<strong>Статус</strong> показывает текущее состояние (Запущен, Ожидает старта, Завершен и т.д.)',
            '<strong>Даты</strong> — когда начинается и когда заканчивается конкурс',
            '<strong>Победителей</strong> — сколько человек получат призы',
            '<strong>Кнопки действий</strong> — редактировать или удалить конкурс'
          ]}
        >
          <div className="max-w-md mx-auto">
            <MockContestCard
              title="Розыгрыш промокодов на пиццу"
              description="Еженедельный розыгрыш скидки 50% среди активных подписчиков"
              status="running"
              startDate="15.02.25"
              startTime="12:00"
              winnersCount={3}
              isCyclic={true}
              isActive={true}
              finishLabel="Через 2д 8ч"
              onEdit={() => alert('Открыт редактор конкурса')}
              onDelete={() => alert('Запрос на удаление')}
            />
          </div>
        </Sandbox>
      </div>

      {/* Что дальше? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что дальше?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        В следующих разделах вы узнаете:
      </p>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li>Как создать свой первый конкурс за 3 минуты</li>
        <li>Как настроить сложные условия участия (И/ИЛИ)</li>
        <li>Как работает автоматическая публикация и выбор победителей</li>
        <li>Как управлять промокодами и рассылкой призов</li>
        <li>Как отслеживать участников и результаты</li>
      </ul>

      <NavigationButtons currentPath="2-4-4-1-overview" />
    </article>
  );
};
