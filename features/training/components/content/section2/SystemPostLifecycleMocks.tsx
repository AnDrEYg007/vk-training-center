import React, { useState } from 'react';
import { MockSystemPostCard } from './SystemPostMocks';

/**
 * Mock-компоненты для обучающей страницы "Жизненный цикл системного поста"
 * Фокус на детальном разборе механизмов пост-трекера и переходов статусов
 */

// =====================================================================
// Полная диаграмма переходов статусов (интерактивная)
// =====================================================================
export const FullStatusTransitionDemo: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const statuses = [
    { 
      id: 'pending', 
      label: 'Ожидает публикации', 
      color: 'bg-gray-100 border-gray-300 text-gray-900',
      description: 'Пост создан и ждёт наступления запланированного времени'
    },
    { 
      id: 'publishing', 
      label: 'Публикуется', 
      color: 'bg-blue-100 border-blue-300 text-blue-900',
      description: 'Пост-трекер отправил в VK и проверяет результат на стене'
    },
    { 
      id: 'possible_error', 
      label: 'Возможная ошибка', 
      color: 'bg-amber-100 border-amber-300 text-amber-900',
      description: 'Прошло 5 минут, пост не найден на стене'
    },
    { 
      id: 'error', 
      label: 'Ошибка', 
      color: 'bg-red-100 border-red-300 text-red-900',
      description: 'Исключение при вызове API VK'
    },
    { 
      id: 'published', 
      label: 'Опубликован', 
      color: 'bg-green-100 border-green-300 text-green-900',
      description: 'Пост найден на стене, удалён из системы'
    },
  ];

  const transitions = [
    { from: 'pending', to: 'publishing', label: 'Время пришло / «Опубликовать сейчас»', color: 'stroke-blue-500' },
    { from: 'publishing', to: 'published', label: 'Найден на стене (< 5 мин)', color: 'stroke-green-500' },
    { from: 'publishing', to: 'possible_error', label: 'Не найден на стене (> 5 мин)', color: 'stroke-amber-500' },
    { from: 'publishing', to: 'error', label: 'Ошибка API VK', color: 'stroke-red-500' },
    { from: 'possible_error', to: 'pending', label: 'Редактирование', color: 'stroke-gray-500' },
    { from: 'error', to: 'pending', label: 'Редактирование', color: 'stroke-gray-500' },
    { from: 'possible_error', to: 'publishing', label: '«Опубликовать сейчас»', color: 'stroke-blue-500' },
    { from: 'error', to: 'publishing', label: '«Опубликовать сейчас»', color: 'stroke-blue-500' },
  ];

  const filteredTransitions = selectedStatus 
    ? transitions.filter(t => t.from === selectedStatus || t.to === selectedStatus)
    : transitions;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${
            selectedStatus === null ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Все переходы
        </button>
        {statuses.map(s => (
          <button
            key={s.id}
            onClick={() => setSelectedStatus(s.id)}
            className={`px-3 py-1.5 rounded-md border text-sm font-medium transition-all ${
              selectedStatus === s.id ? s.color : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {statuses.map(s => (
            <div 
              key={s.id}
              className={`p-3 rounded-lg border-2 text-center ${
                selectedStatus === s.id || selectedStatus === null ? s.color : 'bg-gray-50 border-gray-200 text-gray-400 opacity-50'
              }`}
            >
              <p className="text-xs font-bold mb-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-600 mb-3">Возможные переходы:</p>
          {filteredTransitions.map((t, idx) => (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded ${statuses.find(s => s.id === t.from)?.color}`}>
                  {statuses.find(s => s.id === t.from)?.label}
                </span>
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className={`px-2 py-1 rounded ${statuses.find(s => s.id === t.to)?.color}`}>
                  {statuses.find(s => s.id === t.to)?.label}
                </span>
              </div>
              <span className="text-gray-600 flex-1">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedStatus && (
        <div className={`p-4 rounded-lg border-2 ${statuses.find(s => s.id === selectedStatus)?.color}`}>
          <p className="text-sm font-semibold mb-1">{statuses.find(s => s.id === selectedStatus)?.label}</p>
          <p className="text-sm">{statuses.find(s => s.id === selectedStatus)?.description}</p>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Демонстрация цикла пост-трекера (50 сек)
// =====================================================================
export const TrackerCycleDemo: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'idle' | 'publication' | 'verification' | 'sleep'>('idle');
  const [timeLeft, setTimeLeft] = useState(50);

  const startCycle = () => {
    setIsRunning(true);
    setCurrentPhase('publication');
    setTimeLeft(50);

    setTimeout(() => setCurrentPhase('verification'), 2000);
    setTimeout(() => setCurrentPhase('sleep'), 4000);
    setTimeout(() => {
      setIsRunning(false);
      setCurrentPhase('idle');
    }, 6000);
  };

  const phases = [
    { id: 'publication', label: 'Поиск и публикация', icon: '📤', color: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: 'verification', label: 'Верификация на стене', icon: '✓', color: 'bg-green-100 border-green-300 text-green-900' },
    { id: 'sleep', label: 'Ожидание 50 сек', icon: '⏱️', color: 'bg-gray-100 border-gray-300 text-gray-900' },
  ];

  return (
    <div className="space-y-4">
      {!isRunning ? (
        <button
          onClick={startCycle}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          ▶️ Запустить цикл трекера
        </button>
      ) : (
        <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
          <p className="text-sm font-semibold text-indigo-900 mb-2">🔄 Трекер работает...</p>
          <div className="h-2 bg-indigo-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-6000 ease-linear"
              style={{ width: currentPhase === 'idle' ? '0%' : '100%' }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phases.map(phase => (
          <div 
            key={phase.id}
            className={`p-4 rounded-lg border-2 text-center transition-all ${
              currentPhase === phase.id 
                ? phase.color + ' shadow-md scale-105' 
                : 'bg-white border-gray-200 text-gray-400'
            }`}
          >
            <div className="text-2xl mb-2">{phase.icon}</div>
            <p className="text-sm font-semibold">{phase.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700 mb-2"><strong>Как это работает:</strong></p>
        <ol className="text-xs text-gray-700 space-y-1 ml-4 list-decimal">
          <li><strong>Поиск и публикация:</strong> SQL-запрос находит посты со статусом «Ожидает публикации», у которых время пришло → отправка в VK через wall.post</li>
          <li><strong>Верификация:</strong> Проверка наличия опубликованных постов на стене VK через wall.get → сверка по vk_post_id</li>
          <li><strong>Ожидание:</strong> Redis-блокировка освобождается, трекер засыпает на 50 секунд до следующего цикла</li>
        </ol>
      </div>
    </div>
  );
};

// =====================================================================
// Таймлайн верификации с порогом 5 минут
// =====================================================================
export const VerificationTimelineDemo: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const maxTime = 6; // 6 минут для демо

  const getStatus = () => {
    if (timeElapsed < 5) return { label: 'Проверяется...', color: 'bg-blue-100 text-blue-900', icon: '🔄' };
    if (timeElapsed === 5) return { label: 'Порог достигнут!', color: 'bg-amber-100 text-amber-900', icon: '⚠️' };
    return { label: 'Возможная ошибка', color: 'bg-amber-100 text-amber-900', icon: '⚠️' };
  };

  const currentStatus = getStatus();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTimeElapsed(Math.max(0, timeElapsed - 1))}
          disabled={timeElapsed === 0}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          ← -1 мин
        </button>
        <button
          onClick={() => setTimeElapsed(Math.min(maxTime, timeElapsed + 1))}
          disabled={timeElapsed === maxTime}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          +1 мин →
        </button>
        <button
          onClick={() => setTimeElapsed(0)}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm font-medium"
        >
          🔄 Сброс
        </button>
        <span className="text-sm font-semibold text-gray-700 ml-auto">
          {timeElapsed} мин / 5 мин (порог)
        </span>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${timeElapsed < 5 ? 'bg-blue-500' : 'bg-amber-500'}`}
            style={{ width: `${(timeElapsed / maxTime) * 100}%` }}
          />
        </div>
        <div className="absolute left-[83.33%] top-0 w-0.5 h-4 bg-red-500" title="Порог 5 минут" />
      </div>

      <div className={`mt-6 p-4 rounded-lg border-2 ${currentStatus.color}`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{currentStatus.icon}</span>
          <div>
            <p className="text-sm font-semibold mb-1">{currentStatus.label}</p>
            {timeElapsed < 5 ? (
              <p className="text-xs">Пост-трекер продолжает проверку каждые 50 секунд. Пост имеет статус «Публикуется».</p>
            ) : (
              <p className="text-xs">Время истекло. Статус изменён на «Возможная ошибка». Требуется ручная проверка наличия на стене.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        <div className={`p-3 rounded-lg border ${timeElapsed === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-xs font-bold text-gray-700 mb-1">0 мин — Публикация</p>
          <p className="text-xs text-gray-600">Статус: «Публикуется»</p>
        </div>
        <div className={`p-3 rounded-lg border ${timeElapsed >= 1 && timeElapsed < 5 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-xs font-bold text-gray-700 mb-1">1-4 мин — Проверка</p>
          <p className="text-xs text-gray-600">Каждые 50 сек сверка с VK</p>
        </div>
        <div className={`p-3 rounded-lg border ${timeElapsed >= 5 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className="text-xs font-bold text-gray-700 mb-1">5+ мин — Таймаут</p>
          <p className="text-xs text-gray-600">Статус: «Возможная ошибка»</p>
        </div>
      </div>
    </div>
  );
};

// =====================================================================
// Демонстрация путей восстановления после ошибки
// =====================================================================
export const ErrorRecoveryDemo: React.FC = () => {
  const [scenario, setScenario] = useState<'error' | 'possible_error' | null>(null);

  const scenarios = [
    {
      id: 'error' as const,
      title: 'Ошибка публикации',
      initialStatus: 'error',
      description: 'При попытке опубликовать пост произошла ошибка API VK (недостаточно прав, проблема с токеном и т.д.)',
      color: 'bg-red-100 border-red-300 text-red-900',
      actions: [
        { label: 'Редактировать пост', result: 'Статус сбрасывается на «Ожидает публикации». Можно исправить проблему и дождаться автоматической публикации.' },
        { label: '«Опубликовать сейчас»', result: 'Принудительная повторная попытка публикации. Если ошибка не устранена — снова статус «Ошибка».' },
        { label: 'Удалить пост', result: 'Пост полностью удаляется из системы.' },
      ]
    },
    {
      id: 'possible_error' as const,
      title: 'Возможная ошибка',
      initialStatus: 'possible_error',
      description: 'Пост не найден на стене VK в течение 5 минут после отправки. Возможно, он опубликован, но задержка синхронизации.',
      color: 'bg-amber-100 border-amber-300 text-amber-900',
      actions: [
        { label: 'Подтвердить публикацию', result: 'Вручную проверить наличие на стене VK. Если найден — пост удаляется из системы.' },
        { label: 'Редактировать пост', result: 'Статус сбрасывается на «Ожидает публикации». Публикация будет повторена.' },
        { label: '«Опубликовать сейчас»', result: 'Принудительная повторная попытка. Используйте только если уверены, что первая попытка не удалась.' },
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => setScenario(s.id)}
            className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
              scenario === s.id ? s.color : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      {scenario && (
        <div className={`p-4 rounded-lg border-2 ${scenarios.find(s => s.id === scenario)?.color}`}>
          <p className="text-sm font-bold mb-2">{scenarios.find(s => s.id === scenario)?.title}</p>
          <p className="text-xs mb-4">{scenarios.find(s => s.id === scenario)?.description}</p>
          
          <p className="text-xs font-semibold mb-2">Доступные действия:</p>
          <div className="space-y-2">
            {scenarios.find(s => s.id === scenario)?.actions.map((action, idx) => (
              <div key={idx} className="bg-white bg-opacity-50 rounded p-2 text-xs">
                <p className="font-semibold mb-1">→ {action.label}</p>
                <p className="text-gray-700">{action.result}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!scenario && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Выберите сценарий ошибки выше, чтобы увидеть доступные пути восстановления</p>
        </div>
      )}
    </div>
  );
};

// =====================================================================
// Визуализация циклической регенерации
// =====================================================================
export const CyclicRegenerationDemo: React.FC = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { 
      label: 'Исходное состояние', 
      description: 'Циклический пост со статусом «Публикуется» ожидает верификации',
      cards: [{ id: 'original', label: 'Циклический пост', status: 'publishing', date: '10 января, 10:00' }]
    },
    { 
      label: 'Верификация успешна', 
      description: 'Пост найден на стене VK. Пост-трекер вызывает _create_next_cyclic_post()',
      cards: [
        { id: 'original', label: 'Циклический пост', status: 'publishing', date: '10 января, 10:00' },
        { id: 'new', label: 'Новый пост (создаётся)', status: 'pending', date: '17 января, 10:00', highlight: true }
      ]
    },
    { 
      label: 'Удаление оригинала', 
      description: 'После создания следующего — оригинал удаляется из системы',
      cards: [
        { id: 'new', label: 'Следующий пост', status: 'pending', date: '17 января, 10:00' }
      ]
    },
    { 
      label: 'Цикл продолжается', 
      description: 'Новый пост станет текущим и процесс повторится через неделю',
      cards: [
        { id: 'new', label: 'Текущий пост', status: 'pending', date: '17 января, 10:00' },
        { id: 'ghost1', label: 'Призрак', status: 'ghost', date: '24 января, 10:00', opacity: 0.5 },
        { id: 'ghost2', label: 'Призрак', status: 'ghost', date: '31 января, 10:00', opacity: 0.3 }
      ]
    }
  ];

  const statusColors = {
    publishing: 'border-blue-400',
    pending: 'border-gray-400',
    ghost: 'border-indigo-200'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          ← Назад
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
          disabled={step === steps.length - 1}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          Далее →
        </button>
        <span className="text-sm text-gray-600 ml-auto">Шаг {step + 1} из {steps.length}</span>
      </div>

      <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4">
        <p className="text-sm font-bold text-indigo-900 mb-1">{steps[step].label}</p>
        <p className="text-xs text-indigo-700">{steps[step].description}</p>
      </div>

      <div className="flex gap-3 justify-center">
        {steps[step].cards.map((card, idx) => (
          <div 
            key={card.id}
            className={`relative p-2.5 rounded-lg border-2 border-dashed ${statusColors[card.status as keyof typeof statusColors]} bg-white shadow-sm text-xs max-w-[160px] transition-all ${
              card.highlight ? 'ring-2 ring-green-500 shadow-lg' : ''
            }`}
            style={{ opacity: card.opacity || 1 }}
          >
            {card.highlight && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                NEW
              </div>
            )}
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-gray-500">{card.date.split(',')[1]}</p>
            </div>
            <div className="mb-2 rounded overflow-hidden bg-gray-100 h-16 flex items-center justify-center">
              <span className="text-gray-400 text-xs">Превью</span>
            </div>
            <p className="text-gray-800 text-xs font-medium">{card.label}</p>
            <p className="text-gray-500 text-xs mt-1">{card.date.split(',')[0]}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-3">
        <p className="text-xs text-gray-700">
          <strong>Важный момент:</strong> Новый пост создаётся ДО удаления старого. Это гарантирует, что цепочка никогда не прервётся, даже если произойдёт сбой при удалении.
        </p>
      </div>
    </div>
  );
};
