import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';
import { MockEditorTabs } from './GeneralContestsMocks';

/**
 * 2.4.4.4. Редактор конкурса
 */
export const GeneralContestsEditor: React.FC<ContentProps> = ({ title }) => {
  const [activeTab, setActiveTab] = useState('settings');

  return (
    <article className="prose prose-slate max-w-none">
      <h1 className="!text-3xl !font-bold !tracking-tight !text-gray-900 !border-b !pb-4 !mb-6">{title}</h1>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Структура редактора</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Редактор конкурса открывается при нажатии кнопки "Редактировать" на карточке конкурса или при создании нового. 
        Он разделён на вкладки (табы), каждая отвечает за свою область настроек.
      </p>

      <div className="not-prose my-6">
        <Sandbox
          title="Интерактивные табы"
          description="Переключайте вкладки, чтобы увидеть структуру редактора"
          instructions={['Нажимайте на названия вкладок', 'Обратите внимание на цветную подчёркивающую линию у активной вкладки']}
        >
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <MockEditorTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="p-6 text-center text-gray-600 text-sm">
              Содержимое вкладки "<strong>{activeTab}</strong>"
            </div>
          </div>
        </Sandbox>
      </div>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Описание вкладок</h2>
      
      <div className="not-prose my-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">⚙️ Настройки</h3>
          <p className="text-sm text-gray-600">
            Основные параметры конкурса: название, текст поста, даты старта и финиша, условия участия, количество победителей. 
            Это главная вкладка, где происходит вся первичная настройка.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">🎫 Промокоды</h3>
          <p className="text-sm text-gray-600">
            Загрузка и управление промокодами для победителей. Здесь видно, сколько свободных промокодов осталось, 
            какие уже выданы и можно добавить новые.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">👥 Участники</h3>
          <p className="text-sm text-gray-600">
            Список всех, кто выполнил условия конкурса. Показывает имя, аватар, выполненные действия и дату участия. 
            Режим "только чтение" — изменять список нельзя.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">🏆 Победители</h3>
          <p className="text-sm text-gray-600">
            После завершения конкурса здесь появляются выбранные победители. Можно посмотреть, кому выдан промокод, 
            и проверить статус доставки приза.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">📨 Список рассылки</h3>
          <p className="text-sm text-gray-600">
            Логи отправки промокодов победителям: когда отправлено, успешно ли доставлено, какой промокод выдан. 
            Если есть ошибки доставки — они видны здесь.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="font-bold text-gray-900 mb-2">🚫 Чёрный список</h3>
          <p className="text-sm text-gray-600">
            Пользователи, которых нужно исключить из конкурса (боты, мошенники). Они не попадут в список участников, 
            даже если выполнят все условия.
          </p>
        </div>
      </div>

      <h2 className="!text-2xl !font-bold !tracking-tight !text-gray-900">Навигация и сохранение</h2>
      <p className="!text-base !leading-relaxed !text-gray-700">
        Переключение между вкладками происходит мгновенно. Все изменения сохраняются только после нажатия кнопки 
        <strong> "Сохранить"</strong> в правом верхнем углу редактора или в футере.
      </p>

      <div className="not-prose my-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.001-1.742 3.001H4.42c-1.53 0-2.493-1.667-1.743-3.001l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-amber-900 mb-1">Не забудьте сохранить</p>
            <p className="text-sm text-amber-800">
              Если закрыть редактор без сохранения, все изменения будут потеряны. 
              Система предупредит вас об этом при попытке уйти со страницы.
            </p>
          </div>
        </div>
      </div>

      <NavigationButtons currentPath="2-4-4-4-editor" />
    </article>
  );
};
