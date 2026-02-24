import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockContestCard, MockEmptyContestsList } from './GeneralContestsMocks';

/**
 * 2.4.4.2. Список конкурсов
 */
export const GeneralContestsListPage: React.FC<ContentProps> = ({ title }) => {
  const [viewMode, setViewMode] = useState<'empty' | 'filled'>('empty');

  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">
        {title}
      </h1>

      {/* Где находится? */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Где находится список конкурсов?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Список всех конкурсов проекта находится в разделе <strong>Автоматизации → Универсальные конкурсы</strong>. 
        Это главная страница, где вы видите все созданные конкурсы, их статусы и можете управлять ими.
      </p>

      {/* Пустое состояние */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Если конкурсов ещё нет</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        При первом заходе в раздел вы увидите пустую страницу с предложением создать первый конкурс. 
        Это нормально — значит, вы ещё не настроили ни одного розыгрыша для этого проекта.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Пустое состояние"
          description="Так выглядит страница, когда конкурсов ещё нет"
          instructions={[
            'Иконка подарка показывает, что раздел пуст',
            'Кнопка <strong>"Создать конкурс"</strong> открывает редактор для настройки нового розыгрыша'
          ]}
        >
          <div className="bg-gray-50 rounded-lg border border-gray-200" style={{ height: '400px' }}>
            <MockEmptyContestsList />
          </div>
        </Sandbox>
      </div>

      {/* Список конкурсов */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Список конкурсов</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Когда вы создадите конкурсы, они отобразятся в виде сетки карточек. Каждая карточка — это отдельный конкурс 
        со своими настройками, статусом и датами.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Интерактивный пример списка"
          description="Переключайте режим просмотра, чтобы увидеть разницу между пустым списком и заполненным"
          instructions={[
            'Нажмите кнопку <strong>"Показать конкурсы"</strong>, чтобы увидеть список',
            'Обратите внимание на разные статусы конкурсов (запущен, ожидает, завершен)',
            'Кнопка <strong>"+ Создать"</strong> в правом верхнем углу всегда доступна для добавления новых конкурсов'
          ]}
        >
          <div className="mb-4 flex gap-2">
            <button 
              onClick={() => setViewMode('empty')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'empty' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Пустой список
            </button>
            <button 
              onClick={() => setViewMode('filled')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'filled' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Показать конкурсы
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {viewMode === 'empty' ? (
              <div style={{ height: '350px' }}>
                <MockEmptyContestsList />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Ваши конкурсы</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium">
                    + Создать
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <MockContestCard
                    title="Розыгрыш промокодов"
                    description="Еженедельный розыгрыш скидки 50%"
                    status="running"
                    startDate="15.02.25"
                    startTime="12:00"
                    winnersCount={3}
                    isCyclic={true}
                    isActive={true}
                    finishLabel="Через 2д 8ч"
                  />
                  <MockContestCard
                    title="Конкурс на лучший отзыв"
                    description="Приз за самый креативный комментарий"
                    status="awaiting_start"
                    startDate="20.02.25"
                    startTime="15:00"
                    winnersCount={1}
                    isCyclic={false}
                    isActive={true}
                    finishLabel="До 25.02.25"
                  />
                  <MockContestCard
                    title="Февральский розыгрыш"
                    description=""
                    status="completed"
                    startDate="01.02.25"
                    startTime="10:00"
                    winnersCount={5}
                    isCyclic={false}
                    isActive={false}
                    finishLabel="Завершен"
                  />
                </div>
              </>
            )}
          </div>
        </Sandbox>
      </div>

      {/* Статусы конкурсов */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Статусы конкурсов</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Каждый конкурс имеет статус, который показывает его текущее состояние. Статус отображается цветным бейджем 
        в правом верхнем углу карточки.
      </p>

      <div className="not-prose my-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Запущен */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Запущен</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-green-100 text-green-700 border-green-200 animate-pulse">
                Запущен
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Конкурс активен, система собирает участников и проверяет выполнение условий. Пульсирующая анимация показывает активность.
            </p>
          </div>

          {/* Ожидает старта */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Ожидает старта</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-yellow-50 text-yellow-700 border-yellow-200">
                Ожидает старта
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Конкурс настроен и включён, но дата начала ещё не наступила. Система автоматически запустит его в указанное время.
            </p>
          </div>

          {/* Завершен */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Завершен</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-blue-50 text-blue-700 border-blue-200">
                Завершен
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Конкурс закончился, победители выбраны, итоги опубликованы. Можно просматривать результаты и статистику.
            </p>
          </div>

          {/* Нет промокодов */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Нет промокодов</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-red-50 text-red-700 border-red-200">
                Нет промокодов
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Конкурс запущен, но свободных промокодов не хватает на всех победителей. Нужно срочно добавить промокоды.
            </p>
          </div>

          {/* Выключен */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">Выключен</h4>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-gray-200 text-gray-600 border-gray-300">
                Выключен
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Конкурс приостановлен вручную. Система не собирает участников и не публикует посты, пока вы не включите его снова.
            </p>
          </div>
        </div>
      </div>

      {/* Действия с карточками */}
      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Что можно сделать с конкурсом?</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        В нижней части каждой карточки есть кнопки для управления конкурсом:
      </p>
      <ul className="!text-base !leading-relaxed !text-gray-700">
        <li>
          <strong>Редактировать</strong> (кнопка с иконкой карандаша) — открывает редактор конкурса, где можно изменить 
          настройки, добавить промокоды, посмотреть участников и победителей.
        </li>
        <li>
          <strong>Удалить</strong> (кнопка с иконкой корзины) — удаляет конкурс и все связанные данные. 
          Система попросит подтверждение, чтобы случайно не удалить активный конкурс.
        </li>
      </ul>

      <div className="not-prose my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-amber-900 mb-1">Осторожно с удалением!</p>
            <p className="text-sm text-amber-800">
              Удаление конкурса нельзя отменить. Будут удалены все участники, промокоды, история отправки и связанные системные посты из календаря.
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons currentPath="2-4-4-2-contests-list" />
    </article>
  );
};
