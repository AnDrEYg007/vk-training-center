import React, { useState } from 'react';
import { ContentProps, Sandbox, NavigationButtons } from '../shared';

export const GeneralContestsPromocodesPage: React.FC<ContentProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Заголовок страницы */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Промокоды конкурса
        </h1>
        <p className="text-lg text-gray-600">
          Узнайте, как загружать промокоды для автоматической раздачи победителям, редактировать описания призов и контролировать статус выдачи.
        </p>
      </div>

      {/* Что это такое */}
      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Что такое вкладка "Промокоды"?
        </h2>
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4">
            <strong className="text-indigo-700">Вкладка "Промокоды"</strong> — это база кодов для автоматической раздачи призов победителям конкурса. Система сама выдаёт промокоды при розыгрыше и отправляет их в личные сообщения.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Главная фишка — <strong>загрузка прямо из Excel</strong>. Вы копируете два столбца (код и описание приза) из таблицы и вставляете в форму — система автоматически распознаёт формат.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>База промокодов</strong> — таблица с кодами, статусами и информацией о выдаче</li>
            <li><strong>Свободные коды</strong> — доступны для раздачи новым победителям</li>
            <li><strong>Выданные коды</strong> — уже использованы, видна история (кому, когда)</li>
            <li><strong>Описание приза</strong> — текст, который можно вставить в сообщение через переменную</li>
          </ul>
        </div>
      </section>

      {/* Было/Стало */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Было / Стало
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Было */}
          <div className="bg-white rounded-lg p-5 border-2 border-red-200">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 text-xl">😰</span>
              </div>
              <h3 className="text-lg font-semibold text-red-900">Было (вручную)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Хранили промокоды в Excel-файле</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Вручную копировали код для каждого победителя</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Отмечали в таблице "выдано/не выдано"</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Писали победителям через интерфейс VK</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-500 mr-2">•</span>
                <span>Теряли историю: не помнили, кому что выдали</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-red-200">
              <p className="text-sm font-semibold text-red-700">
                ⏱ Время: ~20 минут на 10 победителей
              </p>
            </div>
          </div>

          {/* Стало */}
          <div className="bg-white rounded-lg p-5 border-2 border-indigo-300">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-indigo-600 text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Стало (автоматически)</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Загрузили коды один раз из Excel (копировать-вставить)</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Система автоматически выдаёт коды победителям</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Статусы обновляются в реальном времени</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Сообщения отправляются автоматически</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span>Полная история: видно кто, когда и что получил</span>
              </li>
            </ul>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-sm font-semibold text-indigo-700">
                ⏱ Время: ~30 секунд на загрузку базы
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                💰 Экономия: 19 минут 30 секунд
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

        {/* 1. Двухпанельный интерфейс */}
        <Sandbox
          title="1. Общий вид интерфейса: форма + таблица"
          description="Интерфейс разделён на две части: слева форма загрузки кодов (33% ширины), справа база промокодов с таблицей (67%). Это позволяет быстро добавлять новые коды и сразу видеть результат."
          highlight="indigo"
        >
          <TwoPanelLayoutDemo />
        </Sandbox>

        {/* 2. Форма загрузки из Excel */}
        <Sandbox
          title="2. Загрузка промокодов из Excel"
          description="Скопируйте два столбца из Excel (код и описание) и вставьте в поле. Система автоматически распознает формат и преобразует табуляцию в вертикальную черту. Формат: КОД | ОПИСАНИЕ ПРИЗА."
          highlight="indigo"
          instructions={[
            'Попробуйте вставить текст с табуляцией — формат исправится автоматически',
            'Каждая пара код+описание должна быть на новой строке',
            'Описание необязательно — можно загружать только коды'
          ]}
        >
          <PromocodesUploadFormDemo />
        </Sandbox>

        {/* 3. Таблица с промокодами */}
        <Sandbox
          title="3. Таблица промокодов с 7 колонками"
          description="Полная информация о каждом промокоде: код, описание, статус (свободен/выдан), информация о победителе, ссылка на диалог с ним, кнопка удаления."
          highlight="indigo"
        >
          <PromocodesTableDemo />
        </Sandbox>

        {/* 4. Статусы и счётчики */}
        <Sandbox
          title="4. Статусы промокодов и счётчики"
          description="В шапке таблицы отображаются счётчики: общее количество, сколько свободно (зелёный), сколько выдано (индиго). Каждый код имеет бейдж статуса."
          highlight="indigo"
        >
          <StatusesAndCountersDemo />
        </Sandbox>

        {/* 5. Редактирование описания */}
        <Sandbox
          title="5. Редактирование описания приза"
          description="Наведите курсор на описание свободного промокода — появится иконка карандаша. Кликните, чтобы редактировать. Нажмите Enter для сохранения или Escape для отмены."
          highlight="indigo"
          instructions={[
            'Редактировать можно только <strong>свободные</strong> промокоды',
            'Выданные коды заблокированы для редактирования',
            'Enter = сохранить, Escape = отменить'
          ]}
        >
          <EditDescriptionDemo />
        </Sandbox>

        {/* 6. Множественное удаление */}
        <Sandbox
          title="6. Выделение и удаление нескольких промокодов"
          description="Отметьте несколько свободных промокодов чекбоксами. Появится кнопка для удаления выбранных. Чекбокс в шапке выделяет все доступные коды."
          highlight="indigo"
          instructions={[
            'Выделить можно только свободные коды (выданные заблокированы)',
            'Чекбокс в шапке выделяет все свободные промокоды',
            'Удаление требует подтверждения через всплывающее окно'
          ]}
        >
          <MultipleSelectionDemo />
        </Sandbox>

        {/* 7. Предупреждение о нехватке */}
        <Sandbox
          title="7. Предупреждение о нехватке промокодов"
          description="Если свободных промокодов меньше, чем количество победителей в настройках конкурса, система показывает жёлтое предупреждение с кнопкой обновления данных."
          highlight="indigo"
        >
          <ShortageWarningDemo />
        </Sandbox>

        {/* 8. Пустое состояние и загрузка */}
        <Sandbox
          title="8. Пустое состояние и процесс загрузки"
          description="Если база пуста, показывается информативное сообщение. При загрузке данных с сервера отображается полупрозрачный оверлей со спиннером."
          highlight="indigo"
        >
          <EmptyAndLoadingStatesDemo />
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
                Как загрузить промокоды из Excel?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Откройте вашу таблицу Excel, выделите два столбца (первый — коды, второй — описания призов) и скопируйте (Ctrl+C). Затем вставьте в текстовое поле на форме загрузки. Система автоматически распознает табуляцию и преобразует её в формат "КОД | ОПИСАНИЕ".
              </p>
              <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-200 mt-2">
                💡 <strong>Совет:</strong> Если в Excel только коды без описаний — просто копируйте один столбец. Описание необязательно.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что означает "Свободно" и "Выдано"?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong className="text-green-700">Свободно</strong> — промокод ещё не использован, доступен для автоматической выдачи новым победителям. Такие коды можно редактировать и удалять.
              </p>
              <p className="text-gray-700 mt-2">
                <strong className="text-gray-700">Выдано</strong> — промокод уже отправлен победителю. Система показывает кому, когда и есть ссылка на диалог с этим пользователем. Редактирование и удаление заблокированы.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Зачем нужно описание приза?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Описание используется в шаблоне сообщения победителю. В настройках конкурса вы можете вставить переменную <code className="bg-gray-200 px-1 rounded">{'{description}'}</code>, и система автоматически подставит текст описания при отправке.
              </p>
              <p className="text-gray-700">
                Например, если описание — "Скидка 500 рублей на первый заказ", победитель получит сообщение: "Поздравляем! Ваш промокод WIN123 даёт вам <strong>Скидка 500 рублей на первый заказ</strong>."
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что делать, если свободных кодов меньше, чем победителей?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Система покажет жёлтое предупреждение: "Не хватает промокодов. Свободно N шт., нужно минимум M (по количеству победителей)." Загрузите дополнительные промокоды через форму или нажмите кнопку "Обновить" для проверки актуальных данных.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Можно ли удалить выданный промокод?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-2">
                Нет, выданные промокоды нельзя удалить обычным способом — это история розыгрышей, которая должна сохраняться для отчётности. Удалять можно только свободные коды.
              </p>
              <p className="text-gray-700">
                Если вам нужно полностью очистить базу (включая выданные), используйте кнопку <strong className="text-red-600">"Очистить базу"</strong>. Она доступна только администраторам и требует дополнительного подтверждения.
              </p>
            </div>
          </details>

          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <span className="font-medium text-gray-900">
                Что такое кнопка "Диалог" в таблице?
              </span>
              <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                Это быстрая ссылка на диалог с пользователем, которому выдан промокод. Клик открывает окно сообщений ВКонтакте в новой вкладке, где вы можете продолжить общение с победителем или проверить статус доставки сообщения.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Ключевые преимущества */}
      <section className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-sm border border-indigo-200 p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Ключевые преимущества
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900 mb-2">Загрузка из Excel</h3>
            <p className="text-sm text-gray-600">
              Копируйте данные прямо из таблицы — система автоматически распознает формат. Экономия времени на ручной ввод.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">Автовыдача</h3>
            <p className="text-sm text-gray-600">
              Система сама выбирает свободный промокод и отправляет его победителю. Никакой ручной работы.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Полная история</h3>
            <p className="text-sm text-gray-600">
              Видно кто, когда и какой код получил. Ссылки на профили и диалоги для быстрого доступа.
            </p>
          </div>
        </div>
      </section>

      {/* Навигация */}
      <NavigationButtons
        onPrevious={() => onNavigate('2-4-4-8-winners')}
        onNext={() => onNavigate('2-4-4-10-sending-list')}
        previousLabel="Победители"
        nextLabel="Список рассылки"
      />
    </div>
  );
};

// ============================================
// Демо-компоненты
// ============================================

const TwoPanelLayoutDemo: React.FC = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
      <div className="flex gap-4 h-96">
        {/* Левая панель - форма загрузки */}
        <div className="w-1/3 bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 text-sm">Загрузка кодов</h3>
            <span className="text-xs text-gray-500">33%</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-2 text-xs text-blue-800">
            <p className="font-semibold">Формат: КОД | ОПИСАНИЕ</p>
          </div>
          <div className="flex-1 bg-gray-50 border border-gray-300 rounded p-2 text-xs text-gray-400 font-mono">
            PROMO123 | Скидка 500р<br/>
            WIN2024 | Пицца в подарок
          </div>
          <button className="mt-2 py-2 bg-indigo-600 text-white rounded text-sm font-medium">
            Загрузить в базу
          </button>
        </div>

        {/* Правая панель - таблица */}
        <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-3 p-4 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800 text-sm">База промокодов</h3>
            <span className="text-xs text-gray-500">67%</span>
          </div>
          <div className="flex-1 overflow-hidden p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs bg-green-50 p-2 rounded">
                <div className="w-20 font-mono font-bold">PROMO123</div>
                <div className="flex-1 text-gray-600">Скидка 500р</div>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px]">Свободен</span>
              </div>
              <div className="flex items-center gap-2 text-xs bg-gray-50 p-2 rounded">
                <div className="w-20 font-mono font-bold">WIN2024</div>
                <div className="flex-1 text-gray-600">Пицца в подарок</div>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px]">Выдан</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mt-3 text-center">
        💡 Разделение на панели позволяет работать с формой и видеть результат в таблице одновременно
      </p>
    </div>
  );
};

const PromocodesUploadFormDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    if (text.includes('\t')) {
      e.preventDefault();
      const formatted = text.split('\n')
        .map(line => line.replace('\t', ' | '))
        .join('\n');
      setInputValue(formatted);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4 max-w-md mx-auto">
      <h3 className="font-semibold text-gray-800 mb-2">Загрузка кодов</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs text-blue-800">
        <p className="font-semibold mb-1">Формат загрузки:</p>
        <p className="font-mono bg-white/50 p-1 rounded mb-1">КОД | ОПИСАНИЕ ПРИЗА</p>
        <p>Каждая пара с новой строки. Описание будет использовано в переменной <code>{'{description}'}</code>.</p>
        <p className="mt-2 text-blue-600 italic">💡 Совет: Вы можете скопировать два столбца прямо из Excel и вставить сюда — формат исправится автоматически.</p>
      </div>

      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPaste={handlePaste}
        className="w-full h-32 border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-3 custom-scrollbar font-mono resize-none"
        placeholder="PROMO123 | Скидка 500р&#10;PROMO456 | Сет роллов&#10;WIN_777 | Пицца в подарок"
      />

      <button
        disabled={!inputValue.trim()}
        className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Загрузить в базу
      </button>

      {inputValue.includes('|') && (
        <p className="text-xs text-green-600 mt-2 bg-green-50 p-2 rounded">
          ✓ Формат распознан правильно
        </p>
      )}
    </div>
  );
};

const PromocodesTableDemo: React.FC = () => {
  const mockPromocodes = [
    { id: '1', code: 'PROMO123', description: 'Скидка 500 рублей', isFree: true },
    { id: '2', code: 'WIN2024', description: 'Бесплатная доставка', isFree: true },
    { id: '3', code: 'SALE777', description: 'Пицца в подарок', isFree: false, user: 'Анна Смирнова', userId: 123456, date: '15.02.2026' }
  ];

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">База промокодов</span>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">Всего: <strong>3</strong></span>
          <span className="text-green-600">Свободно: <strong>2</strong></span>
          <span className="text-indigo-600">Выдано: <strong>1</strong></span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b">
            <tr>
              <th className="px-4 py-3 w-10 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="px-4 py-3 w-40">Код</th>
              <th className="px-4 py-3">Описание</th>
              <th className="px-4 py-3 w-28">Статус</th>
              <th className="px-4 py-3 w-48">Кому выдан</th>
              <th className="px-4 py-3 w-24 text-center">Диалог</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockPromocodes.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center">
                  {promo.isFree && <input type="checkbox" className="rounded border-gray-300" />}
                </td>
                <td className="px-4 py-3 font-mono text-gray-700 font-medium">
                  {promo.code}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {promo.description}
                </td>
                <td className="px-4 py-3">
                  {promo.isFree ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                      Свободен
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                      Выдан
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {!promo.isFree ? (
                    <div className="flex flex-col">
                      <span className="text-indigo-600 font-medium text-xs">{promo.user}</span>
                      <span className="text-xs text-gray-400">ID: {promo.userId}</span>
                      <span className="text-[10px] text-gray-400">{promo.date}</span>
                    </div>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {!promo.isFree ? (
                    <button className="text-gray-400 hover:text-indigo-600 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </button>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {promo.isFree && (
                    <button className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
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

const StatusesAndCountersDemo: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4 pb-3 border-b">
          <span className="text-sm font-medium text-gray-700">База промокодов</span>
          <div className="flex gap-4 text-sm">
            <span className="text-gray-500">Всего: <strong className="text-gray-900">15</strong></span>
            <span className="text-green-600">Свободно: <strong>8</strong></span>
            <span className="text-indigo-600">Выдано: <strong>7</strong></span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
            <div className="flex items-center gap-3">
              <code className="font-mono font-bold text-sm">PROMO123</code>
              <span className="text-gray-600 text-sm">Скидка 500 рублей</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
              ✓ Свободен
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-3">
              <code className="font-mono font-bold text-sm">WIN2024</code>
              <span className="text-gray-600 text-sm">Бесплатная доставка</span>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              ✓ Выдан
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border border-blue-200">
        💡 <strong>Счётчики обновляются автоматически:</strong> При загрузке новых кодов увеличивается "Свободно", при выдаче победителям — "Выдано"
      </p>
    </div>
  );
};

const EditDescriptionDemo: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('Скидка 500 рублей');
  const [savedValue, setSavedValue] = useState('Скидка 500 рублей');

  const handleSave = () => {
    setSavedValue(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(savedValue);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
      <div className="space-y-4">
        {/* Редактируемая строка */}
        <div className="p-3 border border-indigo-200 rounded bg-indigo-50/30">
          <div className="flex items-center gap-2 text-sm">
            <code className="font-mono font-bold">PROMO123</code>
            <span className="text-gray-400">→</span>
            {isEditing ? (
              <div className="flex items-center gap-1 flex-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') handleCancel();
                  }}
                  autoFocus
                />
                <button onClick={handleSave} className="text-green-600 hover:text-green-800 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button onClick={handleCancel} className="text-red-500 hover:text-red-700 p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 group/edit">
                <span className="text-gray-700">{savedValue}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover/edit:opacity-100 transition-opacity"
                  title="Редактировать описание"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            )}
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Свободен</span>
          </div>
        </div>

        {/* Заблокированная строка */}
        <div className="p-3 border border-gray-200 rounded bg-gray-50">
          <div className="flex items-center gap-2 text-sm">
            <code className="font-mono font-bold">WIN2024</code>
            <span className="text-gray-400">→</span>
            <span className="text-gray-500">Бесплатная доставка</span>
            <span className="text-gray-400 text-xs italic ml-auto">🔒 Редактирование заблокировано</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Выдан</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
        <p><strong>Как редактировать:</strong></p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-xs">
          <li>Наведите курсор на описание — появится иконка карандаша</li>
          <li>Кликните на иконку или на само описание</li>
          <li>Нажмите <kbd className="bg-white px-1 rounded">Enter</kbd> для сохранения</li>
          <li>Нажмите <kbd className="bg-white px-1 rounded">Escape</kbd> для отмены</li>
        </ul>
      </div>
    </div>
  );
};

const MultipleSelectionDemo: React.FC = () => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [allSelected, setAllSelected] = useState(false);

  const promocodes = [
    { id: '1', code: 'PROMO123', isFree: true },
    { id: '2', code: 'WIN2024', isFree: true },
    { id: '3', code: 'SALE777', isFree: false },
    { id: '4', code: 'GIFT999', isFree: true }
  ];

  const freePromocodes = promocodes.filter(p => p.isFree);

  const toggleSelection = (id: string) => {
    const newSet = new Set(selected);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelected(newSet);
    setAllSelected(newSet.size === freePromocodes.length);
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
      setAllSelected(false);
    } else {
      setSelected(new Set(freePromocodes.map(p => p.id)));
      setAllSelected(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">База промокодов</span>
          {selected.size > 0 && (
            <button className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded border border-red-200 hover:bg-red-200 transition-colors">
              Удалить выбранные ({selected.size})
            </button>
          )}
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 w-10 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="rounded border-gray-300 text-indigo-600 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-left">Код</th>
            <th className="px-4 py-3 text-left">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {promocodes.map(promo => (
            <tr key={promo.id} className={`hover:bg-gray-50 transition-colors ${selected.has(promo.id) ? 'bg-indigo-50' : ''}`}>
              <td className="px-4 py-3 text-center">
                {promo.isFree ? (
                  <input
                    type="checkbox"
                    checked={selected.has(promo.id)}
                    onChange={() => toggleSelection(promo.id)}
                    className="rounded border-gray-300 text-indigo-600 cursor-pointer"
                  />
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 font-mono font-medium">
                {promo.code}
              </td>
              <td className="px-4 py-3">
                {promo.isFree ? (
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Свободен</span>
                ) : (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">Выдан</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-3 bg-gray-50 border-t text-xs text-gray-600">
        💡 Чекбокс в шапке выделяет все <strong>свободные</strong> промокоды ({freePromocodes.length} шт.). Выданные коды нельзя выделить.
      </div>
    </div>
  );
};

const ShortageWarningDemo: React.FC = () => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="space-y-4">
      {showWarning && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center justify-between animate-pulse">
          <div>
            <p className="font-semibold">⚠ Не хватает промокодов</p>
            <p className="text-sm mt-1">
              Свободно <strong>3 шт.</strong>, нужно минимум <strong>5</strong> (по количеству победителей в настройках).
            </p>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors font-medium text-sm"
          >
            Обновить
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">Настройки конкурса</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Количество победителей:</span>
            <span className="font-bold text-gray-900">5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Свободных промокодов:</span>
            <span className={`font-bold ${showWarning ? 'text-red-600' : 'text-green-600'}`}>
              {showWarning ? '3' : '10'}
            </span>
          </div>
        </div>
      </div>

      {!showWarning && (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✓ Достаточно промокодов для всех победителей
        </div>
      )}

      <button
        onClick={() => setShowWarning(true)}
        className="text-xs text-gray-500 hover:text-gray-700 underline"
      >
        Показать предупреждение снова
      </button>
    </div>
  );
};

const EmptyAndLoadingStatesDemo: React.FC = () => {
  const [state, setState] = useState<'empty' | 'loading' | 'loaded'>('empty');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => setState('empty')}
          className={`px-3 py-1 text-xs rounded ${state === 'empty' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Пустая база
        </button>
        <button
          onClick={() => setState('loading')}
          className={`px-3 py-1 text-xs rounded ${state === 'loading' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Загрузка
        </button>
        <button
          onClick={() => setState('loaded')}
          className={`px-3 py-1 text-xs rounded ${state === 'loaded' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Загружено
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden" style={{ height: '250px' }}>
        <div className="p-4 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-700">База промокодов</span>
        </div>

        <div className="relative h-full">
          {state === 'empty' && (
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <div>
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-400 italic">База промокодов пуста.</p>
                <p className="text-xs text-gray-500 mt-2">Загрузите коды через форму слева</p>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Загрузка...</p>
              </div>
            </div>
          )}

          {state === 'loaded' && (
            <div className="p-4">
              <div className="space-y-2">
                {['PROMO123', 'WIN2024', 'SALE777'].map(code => (
                  <div key={code} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <code className="font-mono font-bold text-sm">{code}</code>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Свободен</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
